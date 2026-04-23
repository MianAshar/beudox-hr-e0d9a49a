// Edge Function: parse-attendance-ai
// Takes raw CSV text exported from a ZKTeco-style attendance machine and uses
// Lovable AI Gateway (Gemini) to normalise it into a clean JSON list of
// per-day attendance entries.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ParsedRecord {
  employee_code: string;
  name: string | null;
  date: string;          // YYYY-MM-DD
  check_in: string | null;   // HH:mm:ss
  check_out: string | null;  // HH:mm:ss
  notes?: string | null;
}

interface ParseResult {
  records: ParsedRecord[];
  warnings: string[];
}

const SYSTEM_PROMPT = `You are an attendance data normaliser. You will be given the raw CSV
content of a biometric attendance machine export (typically ZKTeco). Your job is
to extract a clean list of per-employee, per-day attendance entries.

Rules:
- Output STRICT JSON only, no prose, no markdown fences.
- Shape: { "records": [...], "warnings": ["..."] }
- Each record must have: employee_code (string), name (string or null), date
  (YYYY-MM-DD), check_in (HH:mm:ss or null), check_out (HH:mm:ss or null),
  notes (string or null).
- One record per employee per date. If an employee punched in multiple times,
  keep the EARLIEST as check_in and the LATEST as check_out.
- If only one punch exists for the day, put it in check_in OR check_out
  depending on whether it is closer to the start or end of the typical workday
  (under 14:00 → check_in, otherwise check_out) and add notes "single_punch".
- If the file contains rows for weekends or holidays where the employee did not
  punch, OMIT those rows — do not invent absences.
- Skip any header rows, totals rows, or summary rows.
- Skip rows where you cannot determine an employee_code AND a date.
- Add an entry to "warnings" describing any structural issue you encountered
  (e.g. "Could not parse 12 rows", "Detected duplicate header rows").
- Times must be 24-hour, zero-padded, with seconds (HH:mm:ss). If seconds are
  missing, append :00.
- Dates must be ISO YYYY-MM-DD.
- Return at most 5000 records.`;

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => null);
    const csvContent: unknown = body?.csv_content;
    if (typeof csvContent !== 'string' || csvContent.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'csv_content (string) is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Cap the input we send to the model.
    const MAX_CHARS = 200_000;
    const trimmed = csvContent.length > MAX_CHARS
      ? csvContent.slice(0, MAX_CHARS)
      : csvContent;

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Here is the raw CSV content of an attendance export. Parse it now and return JSON:\n\n${trimmed}`,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      const status = aiRes.status === 429 || aiRes.status === 402 ? aiRes.status : 502;
      return new Response(
        JSON.stringify({ error: `AI gateway error: ${aiRes.status}`, details: errText }),
        { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const aiJson = await aiRes.json();
    const raw: string = aiJson?.choices?.[0]?.message?.content ?? '';
    if (!raw) {
      return new Response(
        JSON.stringify({ error: 'AI returned empty content' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    let parsed: ParseResult;
    try {
      // Strip accidental code fences just in case.
      const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'AI returned invalid JSON', raw }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Defensive shape normalisation.
    const records = Array.isArray(parsed?.records) ? parsed.records : [];
    const warnings = Array.isArray(parsed?.warnings) ? parsed.warnings : [];

    const cleanRecords: ParsedRecord[] = [];
    for (const r of records) {
      if (!r || typeof r !== 'object') continue;
      const employee_code = String((r as any).employee_code ?? '').trim();
      const date = String((r as any).date ?? '').trim();
      if (!employee_code || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
      const normaliseTime = (t: unknown): string | null => {
        if (t == null || t === '') return null;
        const s = String(t).trim();
        if (/^\d{2}:\d{2}:\d{2}$/.test(s)) return s;
        if (/^\d{2}:\d{2}$/.test(s)) return `${s}:00`;
        if (/^\d{1}:\d{2}$/.test(s)) return `0${s}:00`;
        return null;
      };
      cleanRecords.push({
        employee_code,
        name: (r as any).name ? String((r as any).name) : null,
        date,
        check_in: normaliseTime((r as any).check_in),
        check_out: normaliseTime((r as any).check_out),
        notes: (r as any).notes ? String((r as any).notes) : null,
      });
    }

    return new Response(
      JSON.stringify({ records: cleanRecords, warnings }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('parse-attendance-ai error', err);
    return new Response(
      JSON.stringify({ error: (err as Error).message ?? 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
