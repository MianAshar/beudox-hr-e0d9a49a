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

Process each employee's punches in this exact order:

STEP 1 — MIDNIGHT CROSSOVER CHECK (do this BEFORE collapsing punches):
For each employee, look at ALL their raw punches across all dates chronologically.
If you see a punch at or before 06:00 on any given day, check if the PREVIOUS day
for that employee has punches but none after 18:00 (i.e. no checkout).
If yes: that early morning punch is a midnight crossover — it is the checkout from
the previous day, NOT a check-in for the current day.
Action: assign it as check_out on the previous day record. Remove it from the
current day's punch list entirely before processing the current day.
Add notes "midnight_crossover" on the previous day record.
Example: Employee has punches on Aug 4 [10:12] and Aug 5 [01:50, 11:42, 18:40].
The 01:50 on Aug 5 is a midnight crossover — assign it as check_out on Aug 4.
Aug 5 is then processed with only [11:42, 18:40].

STEP 2 — COLLAPSE PUNCHES PER DAY:
After applying Step 1, for each employee per date:
- If multiple punches remain: keep the EARLIEST as check_in and LATEST as check_out.
- If only one punch remains: put it in check_in if before 14:00, else check_out.
  Add notes "single_punch".

STEP 3 — OUTPUT RULES:
- Output STRICT JSON only, no prose, no markdown fences.
- Shape: { "records": [...], "warnings": ["..."] }
- Each record must have: employee_code (string), name (string or null), date
  (YYYY-MM-DD), check_in (HH:mm:ss or null), check_out (HH:mm:ss or null),
  notes (string or null).
- Times must be 24-hour, zero-padded, with seconds (HH:mm:ss). If seconds missing, append :00.
- Dates must be ISO YYYY-MM-DD.
- Omit rows where employee did not punch at all (do not invent absences).
- Skip header rows, totals rows, summary rows.
- Skip rows where you cannot determine employee_code AND date.
- Add warnings for any structural issues encountered.
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
    // Two scenarios handled:
    //
    // Scenario A (simple): Day N has check_in only. Day N+1 has check_in before
    //   06:00 and NO check_out. Merge the early punch as Day N's check_out.
    //
    // Scenario B (absorbed): Day N has check_in only. Day N+1 has check_in
    //   before 06:00 AND a check_out. The early punch was absorbed as Day N+1's
    //   check_in by the AI (AI kept earliest punch). In this case:
    //   - Move the early punch to Day N's check_out
    //   - Find the SECOND earliest punch for Day N+1 and set that as check_in
    //   This requires re-examining original punches — but we don't have them
    //   post-AI. Instead, we detect the pattern and flag it for manual correction,
    //   AND apply a best-effort fix: set Day N check_out = Day N+1 check_in,
    //   then set Day N+1 check_in = null (single_punch_adjusted) so HR can see it.
    //   The user must manually correct Day N+1 check_in via CEO edit.

    const timeToMins = (t: string | null): number | null => {
      if (!t) return null;
      const parts = t.split(':').map(Number);
      if (parts.length < 2) return null;
      return parts[0] * 60 + parts[1];
    };

    // Build index: employee_code → array of { record, cleanIdx }
    // so we can look up and mutate by position without indexOf reference issues
    const byEmployee = new Map<string, Array<{ rec: ParsedRecord; idx: number }>>();
    for (let i = 0; i < cleanRecords.length; i++) {
      const r = cleanRecords[i];
      if (!byEmployee.has(r.employee_code)) byEmployee.set(r.employee_code, []);
      byEmployee.get(r.employee_code)!.push({ rec: r, idx: i });
    }

    const toRemove = new Set<number>();

    for (const [, entries] of byEmployee) {
      // Sort by date
      entries.sort((a, b) => a.rec.date.localeCompare(b.rec.date));

      for (let i = 0; i < entries.length - 1; i++) {
        const { rec: dayN, idx: idxN } = entries[i];
        const { rec: dayNext, idx: idxNext } = entries[i + 1];

        // Day N must have check_in but no check_out
        if (!dayN.check_in || dayN.check_out) continue;

        // Day N+1 must have a check_in before 06:00
        const nextInMins = timeToMins(dayNext.check_in);
        if (nextInMins == null || nextInMins >= 6 * 60) continue;

        // Must be consecutive calendar days
        const dN = new Date(dayN.date + 'T00:00:00Z');
        const dNext = new Date(dayNext.date + 'T00:00:00Z');
        const diffDays = (dNext.getTime() - dN.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays !== 1) continue;

        // Total gap must be under 20 hours
        const inMins = timeToMins(dayN.check_in);
        if (inMins == null) continue;
        const totalMins = (24 * 60 - inMins) + nextInMins;
        if (totalMins > 20 * 60) continue;

        if (!dayNext.check_out) {
          // ── Scenario A: Day N+1 is check_in only → remove it entirely ──
          cleanRecords[idxN] = { ...dayN, check_out: dayNext.check_in, notes: 'midnight_crossover' };
          toRemove.add(idxNext);
          // Update entries[i] so further iterations see the mutated record
          entries[i] = { rec: cleanRecords[idxN], idx: idxN };

          warnings.push(
            `Midnight crossover (A) for ${dayN.employee_code} on ${dayN.date}: checkout ${dayNext.check_in} moved from ${dayNext.date}.`
          );
        } else {
          // ── Scenario B: Day N+1 absorbed the early punch as its check_in ──
          // Move early punch → Day N check_out
          // Null out Day N+1 check_in — CEO must manually set the real check_in
          cleanRecords[idxN] = { ...dayN, check_out: dayNext.check_in, notes: 'midnight_crossover' };
          cleanRecords[idxNext] = { ...dayNext, check_in: null, notes: 'midnight_crossover_checkin_missing' };
          // Update entries so further iterations see mutated records
          entries[i] = { rec: cleanRecords[idxN], idx: idxN };
          entries[i + 1] = { rec: cleanRecords[idxNext], idx: idxNext };

          warnings.push(
            `Midnight crossover (B) for ${dayN.employee_code} on ${dayN.date}: checkout ${dayNext.check_in} extracted from ${dayNext.date}. Check-in on ${dayNext.date} needs manual correction.`
          );
        }
      }
    }

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
