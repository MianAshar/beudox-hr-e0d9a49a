import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.100.1';
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { invoice_id } = await req.json();
    if (!invoice_id) {
      return new Response(JSON.stringify({ error: 'invoice_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Fetch invoice with client
    const { data: invoice, error: invError } = await supabase
      .from('invoices')
      .select('*, clients(id, name, contact_name, contact_email, country)')
      .eq('id', invoice_id)
      .single();

    if (invError || !invoice) {
      return new Response(JSON.stringify({ error: 'Invoice not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch company
    const { data: company } = await supabase
      .from('companies')
      .select('*')
      .eq('id', invoice.company_id)
      .single();

    // Fetch line items
    const { data: lineItems } = await supabase
      .from('invoice_line_items')
      .select('*')
      .eq('invoice_id', invoice_id)
      .order('display_order');

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const page = pdfDoc.addPage([595, 842]); // A4
    const { width, height } = page.getSize();
    const margin = 50;
    let y = height - margin;

    const textColor = rgb(0.15, 0.15, 0.15);
    const mutedColor = rgb(0.45, 0.45, 0.45);
    const primaryColor = rgb(0.357, 0.247, 0.973); // #5B3FF8

    // Company logo + name
    let logoDrawn = false;
    if (company?.logo_url) {
      try {
        const logoRes = await fetch(company.logo_url);
        if (logoRes.ok) {
          const logoBytes = new Uint8Array(await logoRes.arrayBuffer());
          const contentType = logoRes.headers.get('content-type') || '';
          let logoImage;
          if (contentType.includes('png') || company.logo_url.toLowerCase().includes('.png')) {
            logoImage = await pdfDoc.embedPng(logoBytes);
          } else {
            logoImage = await pdfDoc.embedJpg(logoBytes);
          }
          const maxH = 40;
          const scale = maxH / logoImage.height;
          const logoW = logoImage.width * scale;
          const logoH = maxH;
          page.drawImage(logoImage, { x: margin, y: y - logoH + 10, width: logoW, height: logoH });
          y -= logoH + 5;
          logoDrawn = true;
        }
      } catch {
        // skip logo on error
      }
    }

    if (company) {
      page.drawText(company.name || '', {
        x: margin,
        y,
        size: 16,
        font: fontBold,
        color: textColor,
      });
      y -= 18;
      if (company.address) {
        page.drawText(company.address, { x: margin, y, size: 9, font, color: mutedColor });
        y -= 13;
      }
      const cityCountry = [company.city, company.country].filter(Boolean).join(', ');
      if (cityCountry) {
        page.drawText(cityCountry, { x: margin, y, size: 9, font, color: mutedColor });
        y -= 13;
      }
    }

    // INVOICE heading top-right
    page.drawText('INVOICE', {
      x: width - margin - fontBold.widthOfTextAtSize('INVOICE', 22),
      y: height - margin,
      size: 22,
      font: fontBold,
      color: primaryColor,
    });

    // Invoice details right-aligned
    const rightX = width - margin;
    let ry = height - margin - 30;
    const drawRight = (label: string, value: string) => {
      const labelW = font.widthOfTextAtSize(label, 9);
      const valueW = fontBold.widthOfTextAtSize(value, 9);
      page.drawText(label, { x: rightX - labelW - valueW - 8, y: ry, size: 9, font, color: mutedColor });
      page.drawText(value, { x: rightX - valueW, y: ry, size: 9, font: fontBold, color: textColor });
      ry -= 15;
    };

    drawRight('Invoice #: ', invoice.invoice_number);
    drawRight('Date: ', new Date(invoice.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    if (invoice.due_date) {
      drawRight('Due: ', new Date(invoice.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    }

    // Bill To
    y = Math.min(y, ry) - 30;
    page.drawText('BILL TO', { x: margin, y, size: 9, font: fontBold, color: mutedColor });
    y -= 15;
    const client = invoice.clients as any;
    if (client) {
      page.drawText(client.name || '', { x: margin, y, size: 11, font: fontBold, color: textColor });
      y -= 14;
      if (client.contact_name) {
        page.drawText(client.contact_name, { x: margin, y, size: 9, font, color: mutedColor });
        y -= 13;
      }
      if (client.contact_email) {
        page.drawText(client.contact_email, { x: margin, y, size: 9, font, color: mutedColor });
        y -= 13;
      }
      if (client.country) {
        page.drawText(client.country, { x: margin, y, size: 9, font, color: mutedColor });
        y -= 13;
      }
    }

    // Line items table
    y -= 20;
    const colX = [margin, margin + 250, margin + 310, margin + 390, width - margin];
    const headers = ['Description', 'Qty', 'Unit Price', 'Amount'];

    // Table header
    page.drawRectangle({
      x: margin,
      y: y - 4,
      width: width - 2 * margin,
      height: 20,
      color: rgb(0.95, 0.95, 0.97),
    });

    headers.forEach((h, i) => {
      const xPos = i === 0 ? colX[0] + 8 : colX[i];
      page.drawText(h, {
        x: xPos,
        y: y,
        size: 8,
        font: fontBold,
        color: mutedColor,
      });
    });
    y -= 22;

    // Table rows
    const items = lineItems || [];
    for (const item of items) {
      if (y < 120) break; // leave room for totals

      // Description (truncate if too long)
      let desc = item.description || '';
      if (font.widthOfTextAtSize(desc, 9) > 240) {
        while (font.widthOfTextAtSize(desc + '…', 9) > 240 && desc.length > 0) {
          desc = desc.slice(0, -1);
        }
        desc += '…';
      }

      page.drawText(desc, { x: colX[0] + 8, y, size: 9, font, color: textColor });
      page.drawText(String(Number(item.quantity)), { x: colX[1], y, size: 9, font, color: textColor });

      const upText = Number(item.unit_price).toLocaleString();
      page.drawText(upText, { x: colX[2], y, size: 9, font, color: textColor });

      const amtText = Number(item.amount).toLocaleString();
      const amtW = font.widthOfTextAtSize(amtText, 9);
      page.drawText(amtText, { x: colX[4] - amtW, y, size: 9, font, color: textColor });

      y -= 18;
    }

    // Totals
    y -= 10;
    page.drawLine({
      start: { x: width - margin - 200, y: y + 8 },
      end: { x: width - margin, y: y + 8 },
      thickness: 0.5,
      color: rgb(0.85, 0.85, 0.87),
    });

    const drawTotal = (label: string, value: string, bold = false, color = textColor) => {
      const f = bold ? fontBold : font;
      const sz = bold ? 11 : 9;
      page.drawText(label, { x: width - margin - 200, y, size: sz, font: f, color: mutedColor });
      const vW = f.widthOfTextAtSize(value, sz);
      page.drawText(value, { x: width - margin - vW, y, size: sz, font: f, color });
      y -= (bold ? 20 : 16);
    };

    drawTotal('Subtotal', `${invoice.currency} ${Number(invoice.subtotal).toLocaleString()}`);
    if (Number(invoice.discount_amount) > 0) {
      drawTotal('Discount', `-${invoice.currency} ${Number(invoice.discount_amount).toLocaleString()}`);
    }
    drawTotal('Total', `${invoice.currency} ${Number(invoice.total_amount).toLocaleString()}`, true, primaryColor);

    if (Number(invoice.amount_paid) > 0) {
      drawTotal('Paid', `${invoice.currency} ${Number(invoice.amount_paid).toLocaleString()}`);
      drawTotal('Amount Due', `${invoice.currency} ${Number(invoice.amount_due).toLocaleString()}`, true);
    }

    // Bank details
    if (company && (company.bank_name || company.bank_iban)) {
      y -= 10;
      page.drawText('BANK DETAILS', { x: margin, y, size: 9, font: fontBold, color: mutedColor });
      y -= 14;

      const bankInfo = [
        company.bank_name && `Bank: ${company.bank_name}`,
        company.bank_account_title && `Account: ${company.bank_account_title}`,
        company.bank_account_number && `A/C #: ${company.bank_account_number}`,
        company.bank_iban && `IBAN: ${company.bank_iban}`,
        company.bank_swift && `SWIFT: ${company.bank_swift}`,
      ].filter(Boolean);

      for (const line of bankInfo) {
        page.drawText(line!, { x: margin, y, size: 8, font, color: mutedColor });
        y -= 12;
      }
    }

    // Footer
    page.drawText('Thank you for your business', {
      x: margin,
      y: 40,
      size: 9,
      font,
      color: mutedColor,
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();

    // Upload to storage
    const path = `${invoice.company_id}/${invoice_id}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('invoice-pdfs')
      .upload(path, pdfBytes, {
        upsert: true,
        contentType: 'application/pdf',
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: urlData } = supabase.storage.from('invoice-pdfs').getPublicUrl(path);
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    // Update invoice pdf_url
    await supabase
      .from('invoices')
      .update({ pdf_url: publicUrl })
      .eq('id', invoice_id);

    return new Response(JSON.stringify({ pdf_url: publicUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
