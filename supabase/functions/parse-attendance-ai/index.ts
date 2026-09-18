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
- MIDNIGHT CROSSOVER: If an employee has a punch before 06:00 on day N+1, AND
  also has only a check_in (no check_out) on day N, the early punch on day N+1
  is almost certainly the checkout for day N that crossed midnight. In this case:
  set it as check_out on day N (keep the time as-is, the system will shift the
  date), do NOT create a separate record for day N+1 for that early punch, and
  add notes "midnight_crossover" on the day N record. Only apply this rule when
  the gap between the day N check_in and the early day N+1 punch is under 20 hours.
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

    // ─── Post-processing: deterministic midnight crossover merge ───────────────
    // Catches cases where the AI missed the pattern. After AI processing,
    // scan for employees who have:
    //   - Day N: check_in only (no check_out), notes = "single_punch"
    //   - Day N+1: check_in only before 06:00 (no check_out)
    // Merge the Day N+1 early punch as check_out of Day N.

    const timeToMins = (t: string | null): number | null => {
      if (!t) return null;
      const parts = t.split(':').map(Number);
      if (parts.length < 2) return null;
      return parts[0] * 60 + parts[1];
    };

    // Group by employee_code → sorted by date
    const byEmployee = new Map<string, ParsedRecord[]>();
    for (const r of cleanRecords) {
      if (!byEmployee.has(r.employee_code)) byEmployee.set(r.employee_code, []);
      byEmployee.get(r.employee_code)!.push(r);
    }

    const toRemove = new Set<number>(); // indices in cleanRecords to remove

    for (const [, empRecords] of byEmployee) {
      empRecords.sort((a, b) => a.date.localeCompare(b.date));

      for (let i = 0; i < empRecords.length - 1; i++) {
        const dayN = empRecords[i];
        const dayNext = empRecords[i + 1];

        // Check day N: has check_in but no check_out
        if (!dayN.check_in || dayN.check_out) continue;

        // Check day N+1: has early check_in (before 06:00) and no check_out
        const nextInMins = timeToMins(dayNext.check_in);
        if (nextInMins == null || nextInMins >= 6 * 60) continue;
        if (dayNext.check_out) continue;

        // Verify the two dates are consecutive calendar days
        const dN = new Date(dayN.date + 'T00:00:00Z');
        const dNext = new Date(dayNext.date + 'T00:00:00Z');
        const diffDays = (dNext.getTime() - dN.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays !== 1) continue;

        // Verify total gap is under 20 hours
        const inMins = timeToMins(dayN.check_in);
        if (inMins == null) continue;
        const totalMins = (24 * 60 - inMins) + nextInMins; // time from check_in to midnight + early punch
        if (totalMins > 20 * 60) continue;

        // Merge: set dayN check_out to the early punch time
        const idx = cleanRecords.indexOf(dayN);
        const nextIdx = cleanRecords.indexOf(dayNext);

        if (idx !== -1) {
          cleanRecords[idx] = {
            ...dayN,
            check_out: dayNext.check_in,
            notes: 'midnight_crossover',
          };
        }

        // Remove the day N+1 early punch record
        if (nextIdx !== -1) {
          toRemove.add(nextIdx);
        }

        // Add a warning so HR can see it in the preview
        warnings.push(
          `Midnight crossover detected for ${dayN.employee_code} on ${dayN.date} — checkout at ${dayNext.check_in} (next day) has been merged.`
        );
      }
    }

    // Remove the merged early-punch records
    const finalRecords = cleanRecords.filter((_, i) => !toRemove.has(i));

    return new Response(
      JSON.stringify({ records: finalRecords, warnings }),
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
