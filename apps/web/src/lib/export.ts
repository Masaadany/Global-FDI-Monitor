/**
 * GFM Export Utilities
 * CSV, JSON, Print, GFR, Signals, Pipeline
 */

export function exportCSV(rows: Record<string,any>[], filename: string): void {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape  = (v: any) => {
    const s = String(v ?? '').replace(/"/g, '""');
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
  };
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))].join('\n');
  _download(csv, `${filename}_${_ts()}.csv`, 'text/csv;charset=utf-8;');
}

export function exportJSON(data: any, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  _download(json, `${filename}_${_ts()}.json`, 'application/json');
}

export function exportPrintHTML(title: string, html: string): void {
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
    <style>body{font-family:Inter,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#1e293b}
    h1{color:#0A2540}table{width:100%;border-collapse:collapse}th,td{border:1px solid #e2e8f0;padding:8px;text-align:left}
    th{background:#f8fafc;font-size:11px;text-transform:uppercase}@media print{@page{margin:20mm}}</style></head>
    <body><h1>${title}</h1><p style="color:#64748B;font-size:12px">Generated: ${new Date().toLocaleString()} · Global FDI Monitor · fdimonitor.org</p>
    ${html}</body></html>`);
  win.document.close();
  win.print();
}

export function exportGFR(rankings: any[]): void {
  exportCSV(rankings.map(r => ({
    'Rank':        r.rank || '',
    'ISO3':        r.iso3,
    'Economy':     r.name,
    'Region':      r.region,
    'Tier':        r.tier,
    'Composite':   r.composite,
    'Macro':       r.macro,
    'Policy':      r.policy,
    'Digital':     r.digital,
    'Human':       r.human,
    'Infrastructure': r.infra,
    'Sustainability': r.sustain,
    'FDI $B':      r.fdi_b,
    'GDP $B':      r.gdp_b,
  })), 'GFM_GFR_Rankings');
}

export function exportSignals(signals: any[]): void {
  exportCSV(signals.map(s => ({
    'Reference Code':  s.id || s.reference_code || '',
    'Grade':           s.grade,
    'Company':         s.company,
    'HQ':              s.hq || '',
    'Economy':         s.economy,
    'ISO3':            s.iso3 || '',
    'Sector':          s.sector_name || s.sector || '',
    'CapEx (USD)':     s.capex_usd || (s.capex_m ? s.capex_m * 1e6 : ''),
    'CapEx ($M)':      s.capex_m || (s.capex_usd ? s.capex_usd/1e6 : ''),
    'Signal Type':     s.signal_type || '',
    'Status':          s.status || '',
    'SCI Score':       s.sci_score || '',
    'Source':          s.source || '',
    'Date':            s.signal_date || s.date || '',
    'Provenance Hash': s.provenance_hash || s.provenance?.hash || '',
    'Source Tier':     s.source_tier || s.provenance?.tier || '',
  })), 'GFM_FDI_Signals');
}

export function exportPipeline(deals: any[]): void {
  exportCSV(deals.map(d => ({
    'Deal ID':      d.id,
    'Company':      d.company,
    'HQ':           d.hq || '',
    'Economy':      d.economy || d.iso3 || '',
    'ISO3':         d.iso3 || '',
    'Sector':       d.sector || '',
    'CapEx $M':     d.capex_m || '',
    'Stage':        d.stage,
    'Probability%': d.probability || '',
    'Contact':      d.contact || '',
    'Days in Stage':d.days || '',
    'Grade':        d.grade || '',
    'Notes':        d.notes || '',
  })), 'GFM_Investment_Pipeline');
}

export function exportCountryProfile(eco: any): void {
  exportJSON({
    iso3:         eco.iso3,
    name:         eco.name,
    gfr:          eco.gfr,
    tier:         eco.tier,
    fdi_inflows:  eco.fdi_inflows,
    top_sources:  eco.top_sources,
    top_sectors:  eco.top_sectors,
    generated_at: new Date().toISOString(),
    source:       'Global FDI Monitor · fdimonitor.org',
    reference:    `GFM-CPROFILE-${eco.iso3}-${new Date().toISOString().slice(0,10).replace(/-/g,'')}`,
  }, `GFM_Country_${eco.iso3}`);
}

// ── Private helpers ────────────────────────────────────────────────────────
function _download(content: string, filename: string, mimeType: string): void {
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

function _ts(): string {
  return new Date().toISOString().slice(0,10);
}
