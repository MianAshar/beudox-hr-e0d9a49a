import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Parse multipart form data
    const formData = await req.formData();

    const jobId = formData.get('job_id') as string;
    const name = formData.get('name') as string;
    const gender = formData.get('gender') as string;
    const mobile = formData.get('mobile') as string;
    const email = formData.get('email') as string;
    const city = formData.get('city') as string;
    const areaLahore = formData.get('area_lahore') as string | null;
    const lastDegree = formData.get('last_degree') as string;
    const degreeYear = parseInt(formData.get('degree_year') as string);
    const linkedinUrl = formData.get('linkedin_url') as string | null;
    const message = formData.get('message') as string | null;
    const cvFile = formData.get('cv') as File | null;

    // Required field validation
    const missing: string[] = [];
    if (!jobId) missing.push('job_id');
    if (!name?.trim()) missing.push('name');
    if (!mobile?.trim()) missing.push('mobile');
    if (!email?.trim()) missing.push('email');
    if (!city?.trim()) missing.push('city');
    if (!lastDegree?.trim()) missing.push('last_degree');
    if (!degreeYear || isNaN(degreeYear)) missing.push('degree_year');

    if (missing.length > 0) {
      return new Response(JSON.stringify({ error: 'Missing required fields', fields: missing }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate CV file
    if (!cvFile) {
      return new Response(JSON.stringify({ error: 'CV file is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (!ALLOWED_MIME_TYPES.includes(cvFile.type)) {
      return new Response(JSON.stringify({ error: 'CV must be a PDF or Word document (.pdf, .doc, .docx)' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (cvFile.size > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({ error: 'CV file must be under 10MB' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Verify job exists and is active
    const now = new Date().toISOString();
    const { data: job, error: jobErr } = await admin
      .from('job_listings')
      .select('id, company_id, status, expires_at')
      .eq('id', jobId)
      .eq('status', 'active')
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .single();

    if (jobErr || !job) {
      return new Response(JSON.stringify({ error: 'Job not found or no longer accepting applications' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Duplicate detection — check email OR mobile against existing applications for this company
    const { data: duplicates } = await admin
      .from('job_applications')
      .select('id, name, email, mobile, job_id, created_at, job_listings(title)')
      .eq('company_id', job.company_id)
      .or(`email.eq.${email.toLowerCase().trim()},mobile.eq.${mobile.trim()}`);

    const isDuplicate = duplicates && duplicates.length > 0;
    let duplicateReason: string | null = null;

    if (isDuplicate && duplicates) {
      const dup = duplicates[0] as any;
      const matchType = dup.email === email.toLowerCase().trim() ? 'email' : 'mobile number';
      const dupDate = new Date(dup.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      duplicateReason = `Same ${matchType} as ${dup.name}, who applied for "${dup.job_listings?.title || 'another position'}" on ${dupDate}`;
    }

    // Upload CV to storage
    const fileExt = cvFile.name.split('.').pop()?.toLowerCase() || 'pdf';
    const sanitizedName = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const cvPath = `${job.company_id}/${jobId}/${sanitizedName}-${Date.now()}.${fileExt}`;
    const cvBytes = await cvFile.arrayBuffer();

    const { error: uploadErr } = await admin.storage
      .from('job-cvs')
      .upload(cvPath, cvBytes, { contentType: cvFile.type, upsert: false });

    if (uploadErr) {
      console.error('CV upload error:', uploadErr);
      return new Response(JSON.stringify({ error: 'Failed to upload CV. Please try again.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Insert application
    const { data: application, error: insertErr } = await admin
      .from('job_applications')
      .insert({
        company_id: job.company_id,
        job_id: jobId,
        name: name.trim(),
        gender: gender || null,
        mobile: mobile.trim(),
        email: email.toLowerCase().trim(),
        city: city.trim(),
        area_lahore: areaLahore?.trim() || null,
        last_degree: lastDegree.trim(),
        degree_year: degreeYear,
        linkedin_url: linkedinUrl?.trim() || null,
        cv_url: cvPath,
        cv_filename: cvFile.name,
        message: message?.trim() || null,
        is_duplicate: isDuplicate,
        duplicate_reason: duplicateReason,
      })
      .select('id')
      .single();

    if (insertErr) {
      // Clean up uploaded CV if insert fails
      await admin.storage.from('job-cvs').remove([cvPath]);
      throw insertErr;
    }

    return new Response(JSON.stringify({
      success: true,
      applicationId: application.id,
      message: 'Your application has been submitted successfully.',
      ...(isDuplicate ? { notice: 'Our team noted that we may have received a previous application from you.' } : {}),
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('jobs-apply error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
