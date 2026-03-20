/**
 * GFM Export Library
 * 7 export functions for signals, GFR, pipeline, and country profiles.
 */

// ── CSV Export ─────────────────────────────────────────────────────────────
export function exportCSV(data: Record<string, unknown>[], filename: string): void {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows    = data.map(row =>
    headers.map(h => {
      const val = row[h];
      if (val === null || val === undefined) return '';
      if (typeof val === 'string' && (val.includes(',') || val.includes('"')))
        return `"${val.replace(/"/g, '""')}"`;
      return String(val);
    }).join(',')
  );
  const csv     = [headers.join(','), ...rows].join('\n');
  downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8');
}

// ── JSON Export ───────────────────────────────────────────────────────────
export function exportJSON(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `${filename}.json`, 'application/json');
}

// ── GFR Export ────────────────────────────────────────────────────────────
export function exportGFR(assessments: Record<string, unknown>[], quarter: string = 'Q1-2026'): void {
  const data = assessments.map(r => ({
    Rank:           r.rank,
    ISO3:           r.iso3,
    Economy:        r.economy || r.economy_name,
    'GFR Score':    r.gfr_composite,
    Tier:           r.tier,
    'Macro':        r.macro_score,
    'Policy':       r.policy_score,
    'Digital':      r.digital_score,
    'Human':        r.human_score,
    'Infrastructure': r.infra_score,
    'Sustainability': r.sustain_score,
    Quarter:        quarter,
  }));
  exportCSV(data, `GFM_GFR_Assessment_${quarter.replace('-','_')}`);
}

// ── Signals Export ────────────────────────────────────────────────────────
export function exportSignals(signals: Record<string, unknown>[], format: 'csv' | 'json' = 'csv'): void {
  const data = signals.map(s => ({
    'Reference Code':  s.reference_code,
    Company:           s.company,
    Economy:           s.economy,
    ISO3:              s.iso3,
    Sector:            s.sector,
    'Signal Type':     s.signal_type,
    'CapEx (USD M)':   s.capex_m,
    'SCI Score':       s.sci_score,
    Grade:             s.grade,
    Conviction:        s.conviction,
    'Source':          s.source_tier || 'T1',
    'Verified':        s.verified ? 'Yes' : 'Pending',
    'Created At':      s.created_at,
  }));
  const filename = `GFM_Signals_${new Date().toISOString().slice(0,10)}`;
  format === 'json' ? exportJSON(data, filename) : exportCSV(data, filename);
}

// ── Pipeline Export ───────────────────────────────────────────────────────
export function exportPipeline(deals: Record<string, unknown>[]): void {
  const data = deals.map(d => ({
    ID:            d.id,
    Company:       d.company,
    Economy:       d.economy,
    ISO3:          d.iso3,
    Sector:        d.sector,
    'CapEx (M)':   d.capex_m,
    Stage:         d.stage,
    Owner:         d.owner,
    Notes:         d.notes,
    'Created At':  d.created_at,
    'Updated At':  d.updated_at,
  }));
  exportCSV(data, `GFM_Pipeline_${new Date().toISOString().slice(0,10)}`);
}

// ── Country Profile Export ────────────────────────────────────────────────
export function exportCountryProfile(profile: Record<string, unknown>, iso3: string): void {
  const data = {
    economy: {
      iso3,
      name:      profile.name || profile.economy_name,
      gfr_score: profile.gfr_composite,
      tier:      profile.tier,
      rank:      profile.rank,
    },
    dimensions: {
      macro:          profile.macro_score,
      policy:         profile.policy_score,
      digital:        profile.digital_score,
      human:          profile.human_score,
      infrastructure: profile.infra_score,
      sustainability: profile.sustain_score,
    },
    signals_count: profile.signals_count || 0,
    generated_at:  new Date().toISOString(),
    source:        'Global FDI Monitor — fdimonitor.org',
  };
  exportJSON(data, `GFM_Country_${iso3}_${new Date().toISOString().slice(0,10)}`);
}

// ── Print HTML Export ─────────────────────────────────────────────────────
export function exportPrintHTML(title: string, content: string, subtitle?: string): void {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${title} — GFM Intelligence</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 32px; color: #0A2540; }
  h1   { font-size: 28px; color: #0A2540; border-bottom: 3px solid #0A66C2; padding-bottom: 12px; }
  h2   { font-size: 18px; color: #0A66C2; margin-top: 28px; }
  p    { line-height: 1.7; color: #64748B; }
  .meta { color: #94A3B8; font-size: 12px; margin-bottom: 24px; }
  @media print { body { padding: 16px; } }
</style>
</head>
<body>
  <div class="meta">Global FDI Monitor · fdimonitor.org · Generated: ${new Date().toLocaleString()}</div>
  <h1>${title}</h1>
  ${subtitle ? `<h2>${subtitle}</h2>` : ''}
  ${content}
</body>
</html>`;
  downloadFile(html, `GFM_${title.replace(/\s+/g,'_')}.html`, 'text/html;charset=utf-8');
}

// ── Helper ────────────────────────────────────────────────────────────────
function downloadFile(content: string, filename: string, mimeType: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
