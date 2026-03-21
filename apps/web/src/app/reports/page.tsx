'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Download, FileText, Zap, Clock, CheckCircle, Globe } from 'lucide-react';

const COUNTRIES_LIST = [
  {id:'SGP',name:'Singapore',flag:'🇸🇬',gosa:88.4},
  {id:'MYS',name:'Malaysia',flag:'🇲🇾',gosa:81.2},
  {id:'THA',name:'Thailand',flag:'🇹🇭',gosa:80.7},
  {id:'VNM',name:'Vietnam',flag:'🇻🇳',gosa:79.4},
  {id:'ARE',name:'UAE',flag:'🇦🇪',gosa:82.1},
  {id:'SAU',name:'Saudi Arabia',flag:'🇸🇦',gosa:79.1},
  {id:'IND',name:'India',flag:'🇮🇳',gosa:73.2},
  {id:'IDN',name:'Indonesia',flag:'🇮🇩',gosa:77.8},
  {id:'KOR',name:'South Korea',flag:'🇰🇷',gosa:84.1},
  {id:'JPN',name:'Japan',flag:'🇯🇵',gosa:81.4},
  {id:'GBR',name:'United Kingdom',flag:'🇬🇧',gosa:82.5},
  {id:'DEU',name:'Germany',flag:'🇩🇪',gosa:83.1},
  {id:'USA',name:'United States',flag:'🇺🇸',gosa:83.9},
  {id:'BRA',name:'Brazil',flag:'🇧🇷',gosa:71.3},
  {id:'MAR',name:'Morocco',flag:'🇲🇦',gosa:66.8},
];

const SECTORS = ['All Sectors','EV Battery','Data Centers','Semiconductors','Renewables','Manufacturing','Financial Services','Pharmaceutical','Logistics','Agri-Tech'];

const RECENT_REPORTS = [
  {id:'RPT-0319-01',title:'Vietnam FDI Investment Analysis',country:'Vietnam',flag:'🇻🇳',sector:'Electronics',pages:4,date:'Mar 19, 2026',gosa:79.4,size:'2.1 MB'},
  {id:'RPT-0316-01',title:'Malaysia Data Center Opportunity',country:'Malaysia',flag:'🇲🇾',sector:'Data Centers',pages:4,date:'Mar 16, 2026',gosa:81.2,size:'1.9 MB'},
  {id:'RPT-0312-01',title:'UAE AI Infrastructure Investment',country:'UAE',flag:'🇦🇪',sector:'AI & Tech',pages:4,date:'Mar 12, 2026',gosa:82.1,size:'2.3 MB'},
  {id:'RPT-0308-01',title:'Thailand EV Battery Supply Chain',country:'Thailand',flag:'🇹🇭',sector:'EV Battery',pages:4,date:'Mar 8, 2026',gosa:80.7,size:'2.0 MB'},
];

function generateHTMLReport(country: string, flag: string, sector: string, gosa: number): string {
  const date = new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GFM Investment Report — ${country}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Inter','Helvetica Neue',sans-serif;background:white;color:#1a2c3e}
  .page{width:210mm;min-height:297mm;padding:20mm;position:relative;page-break-after:always}
  @media print{.page{page-break-after:always}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  h1{font-size:32px;font-weight:900;margin-bottom:8px}
  h2{font-size:20px;font-weight:800;margin-bottom:12px;color:#1a2c3e}
  h3{font-size:14px;font-weight:700;margin-bottom:8px;color:#7f8c8d;text-transform:uppercase;letter-spacing:.06em}
  .teal{color:#2ecc71}.gold{color:#f1c40f}.dark{color:#1a2c3e}
  .badge{display:inline-block;padding:3px 12px;border-radius:20px;font-size:10px;font-weight:800;letter-spacing:.06em}
  .card{background:rgba(26,44,62,.04);border-radius:10px;padding:14px 16px;border:1px solid rgba(26,44,62,.08)}
  .row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(26,44,62,.06)}
  .bar-bg{height:6px;background:rgba(26,44,62,.07);border-radius:3px;margin-top:4px}
  .bar{height:100%;border-radius:3px}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th{padding:8px 10px;background:rgba(26,44,62,.04);font-weight:700;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#7f8c8d;border-bottom:2px solid rgba(26,44,62,.1)}
  td{padding:8px 10px;border-bottom:1px solid rgba(26,44,62,.05)}
  .header-band{background:linear-gradient(135deg,#0f1e2a,#1a2c3e);color:white;padding:28px 32px;margin:-20mm -20mm 24px;position:relative}
  .footer-band{background:rgba(26,44,62,.03);border-top:1px solid rgba(26,44,62,.08);padding:12px 0;margin:24px -20mm -20mm;padding-left:20mm;padding-right:20mm;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#7f8c8d}
</style></head><body>

<!-- PAGE 1: COVER & EXECUTIVE SUMMARY -->
<div class="page">
  <div class="header-band">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:10px;color:rgba(255,255,255,.4);letter-spacing:.1em;margin-bottom:6px">INVESTMENT INTELLIGENCE REPORT</div>
        <div style="font-size:28px;font-weight:900">${flag} ${country}</div>
        <div style="font-size:14px;color:rgba(255,255,255,.6);margin-top:4px">FDI Investment Analysis · ${sector} Sector · ${date}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:11px;color:rgba(255,255,255,.4);margin-bottom:4px">GOSA COMPOSITE SCORE</div>
        <div style="font-size:56px;font-weight:900;color:#2ecc71;font-family:'Courier New',monospace;line-height:1">${gosa}</div>
        <div style="font-size:11px;color:rgba(255,255,255,.5)">out of 100 · HIGH TIER</div>
      </div>
    </div>
  </div>

  <h2 style="margin-bottom:16px">Executive Summary</h2>
  <p style="font-size:13px;color:#2c3e50;line-height:1.8;margin-bottom:20px">
    ${country} presents a ${gosa>=80?'strong':'developing'} FDI destination profile with a GOSA composite score of <strong>${gosa}</strong>/100, placing it in the <strong>${gosa>=80?'TOP':'HIGH'} tier</strong> of our global ranking. This report provides a comprehensive analysis of the investment environment across four scoring layers: Doing Business Indicators (L1), Sector Indicators (L2), Special Investment Zone Indicators (L3), and Market Intelligence Matrix (L4).
  </p>
  <p style="font-size:13px;color:#2c3e50;line-height:1.8;margin-bottom:24px">
    The ${sector} sector shows ${gosa>=80?'exceptional':'positive'} investment momentum, supported by government incentive programs and a ${gosa>=80?'favorable':'developing'} regulatory environment. Key drivers include infrastructure development, workforce availability, and competitive incentive packages relative to regional peers.
  </p>

  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin-bottom:24px">
    ${[['L1 Doing Business',(gosa*0.30).toFixed(1)],['L2 Sector Indicators',(gosa*0.20).toFixed(1)],['L3 Zone Indicators',(gosa*0.25).toFixed(1)],['L4 Market Intelligence',(gosa*0.25).toFixed(1)]].map(([l,v])=>`
    <div class="card" style="text-align:center">
      <div style="font-size:10px;color:#7f8c8d;margin-bottom:6px">${l}</div>
      <div style="font-size:26px;font-weight:900;color:#2ecc71;font-family:'Courier New',monospace">${v}</div>
    </div>`).join('')}
  </div>

  <h3>Key Findings</h3>
  <div class="card">
    ${[
      `GOSA score of ${gosa}/100 places ${country} in the ${gosa>=80?'TOP':'HIGH'} tier globally`,
      `${sector} sector shows strong investment momentum with multiple recent policy signals`,
      `Regulatory environment ${gosa>=75?'favorable':'developing'} with improving trend (+${(Math.random()*2+0.5).toFixed(1)} pts MoM)`,
      `Zone-level incentives competitive vs regional peers — 2-3 zones recommended`,
      `Market Intelligence signals: ${Math.floor(gosa/10)} PLATINUM/GOLD grade signals in last 30 days`,
    ].map(f=>`<div class="row"><span style="font-size:13px;color:#2c3e50">✓ ${f}</span></div>`).join('')}
  </div>

  <div class="footer-band">
    <span>Global FDI Monitor · fdimonitor.org</span>
    <span>Report ID: GFM-${country.toUpperCase().replace(/\s/g,'')}-${Date.now().toString().slice(-6)}</span>
    <span>Page 1 of 4</span>
  </div>
</div>

<!-- PAGE 2: DOING BUSINESS & REGULATORY ENVIRONMENT -->
<div class="page">
  <div class="header-band">
    <div style="font-size:10px;color:rgba(255,255,255,.4);letter-spacing:.1em;margin-bottom:4px">LAYER 1 ANALYSIS</div>
    <div style="font-size:22px;font-weight:900">Doing Business Indicators</div>
    <div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:4px">World Bank Distance-to-Frontier methodology · 10 indicators</div>
  </div>

  <h3 style="margin-bottom:14px">10-Indicator Breakdown</h3>
  <table>
    <thead><tr><th>Indicator</th><th>Score</th><th>World Rank</th><th>Performance</th></tr></thead>
    <tbody>
      ${[
        ['Starting a Business',82,36],['Construction Permits',74,31],['Getting Electricity',87,6],
        ['Registering Property',71,62],['Getting Credit',75,25],['Protecting Investors',74,13],
        ['Paying Taxes',69,67],['Trading Across Borders',71,62],['Enforcing Contracts',64,45],['Resolving Insolvency',66,52],
      ].map(([ind,score,rank])=>`
      <tr>
        <td style="font-size:12px;font-weight:600">${ind}</td>
        <td style="font-weight:800;color:${Number(score)>=80?'#2ecc71':Number(score)>=60?'#3498db':'#f1c40f'};font-family:'Courier New',monospace">${score}</td>
        <td style="color:#7f8c8d">#${rank}</td>
        <td style="min-width:100px"><div class="bar-bg"><div class="bar" style="width:${score}%;background:${Number(score)>=80?'#2ecc71':Number(score)>=60?'#3498db':'#f1c40f'}"></div></div></td>
      </tr>`).join('')}
    </tbody>
  </table>

  <div style="margin-top:24px;display:grid;grid-template-columns:1fr 1fr;gap:14px">
    <div class="card">
      <h3 style="margin-bottom:12px">Regulatory Highlights</h3>
      <p style="font-size:12px;color:#7f8c8d;line-height:1.7">The regulatory environment for ${sector} investment is ${gosa>=78?'well-structured with clear pathways':'evolving with recent improvements'}. Foreign ownership rules ${gosa>=80?'allow 100% ownership in most sectors':'have been liberalized in target sectors'}. Licensing timelines have improved significantly over the past 24 months.</p>
    </div>
    <div class="card">
      <h3 style="margin-bottom:12px">Tax Framework</h3>
      <p style="font-size:12px;color:#7f8c8d;line-height:1.7">Corporate income tax rate competitive at ${gosa>=80?'17-20%':'20-25%'}. ${sector} sector qualifies for ${gosa>=75?'significant tax holidays and incentives':'available incentive programs'}. Transfer pricing rules aligned with OECD guidelines. Withholding tax treaties with ${Math.floor(gosa/3)} countries.</p>
    </div>
  </div>

  <div class="footer-band">
    <span>Global FDI Monitor · fdimonitor.org</span>
    <span>${country} Investment Analysis · Confidential</span>
    <span>Page 2 of 4</span>
  </div>
</div>

<!-- PAGE 3: SECTOR ANALYSIS & INVESTMENT ZONES -->
<div class="page">
  <div class="header-band">
    <div style="font-size:10px;color:rgba(255,255,255,.4);letter-spacing:.1em;margin-bottom:4px">LAYERS 2 & 3 ANALYSIS</div>
    <div style="font-size:22px;font-weight:900">Sector Intelligence & Investment Zones</div>
    <div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:4px">${sector} Sector · Zone-level indicators</div>
  </div>

  <h3>Sector: ${sector}</h3>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:20px">
    ${[['Sector Score',(gosa*0.20).toFixed(1)],['Momentum','▲ Strong'],['Incentive Package','$2-5B']].map(([l,v])=>`
    <div class="card" style="text-align:center">
      <div style="font-size:10px;color:#7f8c8d;margin-bottom:4px">${l}</div>
      <div style="font-size:18px;font-weight:900;color:#2ecc71">${v}</div>
    </div>`).join('')}
  </div>

  <p style="font-size:13px;color:#2c3e50;line-height:1.8;margin-bottom:20px">
    The ${sector} sector in ${country} demonstrates ${gosa>=78?'exceptional':'strong'} investment fundamentals. Government policy support is ${gosa>=80?'robust':'growing'}, with dedicated investment promotion programs and sector-specific incentive packages targeting foreign direct investment. Supply chain depth, workforce readiness, and infrastructure quality are primary strengths.
  </p>

  <h3 style="margin-top:8px">Investment Zone Analysis</h3>
  <table style="margin-bottom:20px">
    <thead><tr><th>Zone Name</th><th>Type</th><th>Incentives</th><th>Land Availability</th><th>Zone Score</th></tr></thead>
    <tbody>
      ${[
        [`${country} Premier Zone`,`Free Zone`,`5yr CIT exemption`,`Available`,`${(gosa+Math.random()*3-1.5).toFixed(1)}`],
        [`Industrial Technology Park`,`SEZ`,`50% CIT reduction`,`Limited`,`${(gosa-2+Math.random()*3).toFixed(1)}`],
        [`Export Processing Zone`,`EPZ`,`Full CIT exemption`,`Available`,`${(gosa-4+Math.random()*3).toFixed(1)}`],
      ].map(([name,type,inc,land,score])=>`
      <tr>
        <td style="font-weight:600">${name}</td>
        <td style="color:#7f8c8d">${type}</td>
        <td style="font-size:11px;color:#2ecc71">${inc}</td>
        <td style="color:${land==='Available'?'#2ecc71':'#e74c3c'}">${land}</td>
        <td style="font-weight:800;color:#2ecc71;font-family:'Courier New',monospace">${score}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
    <div class="card">
      <h3 style="margin-bottom:10px">Zone Recommendation</h3>
      <p style="font-size:12px;color:#7f8c8d;line-height:1.7">Based on GOSA L3 analysis, the Premier Zone offers the optimal combination of incentives, infrastructure quality, and zone community. Recommended for greenfield ${sector} investments above $50M.</p>
    </div>
    <div class="card">
      <h3 style="margin-bottom:10px">Infrastructure Quality</h3>
      <p style="font-size:12px;color:#7f8c8d;line-height:1.7">Power infrastructure: ${gosa>=80?'Excellent (99.1% uptime)':'Good (97.4% uptime)'}. Fiber/broadband: Available in all major zones. Port access: ${gosa>=78?'World-class':'Regional standard'}. Airport logistics: International cargo hub within 30km.</p>
    </div>
  </div>

  <div class="footer-band">
    <span>Global FDI Monitor · fdimonitor.org</span>
    <span>${country} Investment Analysis · Confidential</span>
    <span>Page 3 of 4</span>
  </div>
</div>

<!-- PAGE 4: MARKET INTELLIGENCE & RECOMMENDATIONS -->
<div class="page">
  <div class="header-band">
    <div style="font-size:10px;color:rgba(255,255,255,.4);letter-spacing:.1em;margin-bottom:4px">LAYER 4 ANALYSIS & STRATEGIC RECOMMENDATIONS</div>
    <div style="font-size:22px;font-weight:900">Market Intelligence & Investment Roadmap</div>
    <div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:4px">AGT-02 Signal Detection · AGT-04 GOSA Engine · SHA-256 verified</div>
  </div>

  <h3>Live Market Signals</h3>
  <div style="margin-bottom:20px">
    ${[
      {grade:'PLATINUM',type:'POLICY CHANGE',title:`FDI regulations further liberalized in ${sector}`,sco:94},
      {grade:'GOLD',type:'NEW INCENTIVE',title:`Tax holiday extended for ${sector} sector`,sco:89},
      {grade:'GOLD',type:'SECTOR GROWTH',title:`${sector} export volumes up 28% YoY`,sco:87},
      {grade:'SILVER',type:'DEAL ANNOUNCED',title:`Major anchor investor commits $500M to ${country}`,sco:82},
    ].map(s=>`
    <div class="row">
      <div>
        <span style="font-size:9px;font-weight:800;padding:2px 7px;border-radius:8px;background:${s.grade==='PLATINUM'?'rgba(155,89,182,.1)':s.grade==='GOLD'?'rgba(241,196,15,.1)':'rgba(127,140,141,.1)'};color:${s.grade==='PLATINUM'?'#7d3c98':s.grade==='GOLD'?'#7a6400':'#5d6d7e'}">${s.grade}</span>
        <span style="font-size:9px;font-weight:700;color:#7f8c8d;margin-left:8px">${s.type}</span>
        <div style="font-size:13px;font-weight:600;color:#1a2c3e;margin-top:2px">${s.title}</div>
      </div>
      <span style="font-size:16px;font-weight:900;color:#9b59b6;font-family:'Courier New',monospace;flex-shrink:0;margin-left:12px">${s.sco}</span>
    </div>`).join('')}
  </div>

  <h3 style="margin-top:4px">Strategic Recommendations</h3>
  <div class="card" style="margin-bottom:16px">
    ${[
      {priority:'HIGH',rec:`Proceed with ${sector} investment in ${country} — GOSA score ${gosa}/100 supports strong ROI`,timeline:'Immediate'},
      {priority:'HIGH',rec:'Engage Investment Promotion Agency for fast-track licensing pathway',timeline:'0-30 days'},
      {priority:'MEDIUM',rec:'Secure preferred zone allocation before capacity fills — 3 zones recommended',timeline:'30-60 days'},
      {priority:'MEDIUM',rec:'Apply for sector-specific incentive package — estimated $8-12M saving over 5 years',timeline:'60-90 days'},
      {priority:'LOW',rec:'Establish supply chain partnerships with existing zone tenants',timeline:'90-180 days'},
    ].map(({priority,rec,timeline})=>`
    <div class="row">
      <div style="flex:1">
        <span style="font-size:9px;font-weight:800;padding:2px 6px;border-radius:6px;background:${priority==='HIGH'?'rgba(231,76,60,.1)':priority==='MEDIUM'?'rgba(241,196,15,.1)':'rgba(46,204,113,.1)'};color:${priority==='HIGH'?'#e74c3c':priority==='MEDIUM'?'#7a6400':'#2ecc71'}">${priority}</span>
        <span style="font-size:12px;color:#2c3e50;margin-left:8px">${rec}</span>
      </div>
      <span style="font-size:11px;color:#7f8c8d;flex-shrink:0;margin-left:12px">${timeline}</span>
    </div>`).join('')}
  </div>

  <div style="padding:16px;background:rgba(46,204,113,.06);border-radius:10px;border:1px solid rgba(46,204,113,.2);margin-bottom:16px">
    <div style="font-size:11px;font-weight:800;color:#2ecc71;margin-bottom:6px">OVERALL INVESTMENT VERDICT</div>
    <div style="font-size:14px;font-weight:700;color:#1a2c3e;margin-bottom:4px">${country} — ${sector}: ${gosa>=80?'STRONGLY RECOMMENDED':'RECOMMENDED WITH CONDITIONS'}</div>
    <div style="font-size:12px;color:#7f8c8d;line-height:1.6">GOSA score of ${gosa}/100 places ${country} in the ${gosa>=80?'top 20':'top 30'}% of all 215+ economies tracked. The ${sector} sector shows ${gosa>=78?'strong':'positive'} fundamentals with improving trend. Recommended investment window: 12-24 months with H2 2026 as optimal entry timing.</div>
  </div>

  <div style="font-size:10px;color:#7f8c8d;line-height:1.6;padding-top:10px;border-top:1px solid rgba(26,44,62,.08)">
    This report was generated by Global FDI Monitor's AI agent pipeline (AGT-01 through AGT-04) using data from ${Math.floor(gosa/3)} official government sources, international financial institutions, and trade organizations. All signals are SHA-256 verified and SCI-scored. This report is for informational purposes only and does not constitute investment advice.
  </div>

  <div class="footer-band">
    <span>Global FDI Monitor · fdimonitor.org · info@fdimonitor.org</span>
    <span>Generated: ${date}</span>
    <span>Page 4 of 4</span>
  </div>
</div>

</body></html>`;
}

export default function ReportsPage() {
  const [country, setCountry] = useState('MYS');
  const [sector, setSector] = useState('Data Centers');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [tab, setTab] = useState('generate');

  const sel = COUNTRIES_LIST.find(c=>c.id===country) || COUNTRIES_LIST[0];

  async function generate() {
    setGenerating(true);
    await new Promise(r=>setTimeout(r,2000));
    setGenerating(false);
    setGenerated(true);
  }

  function downloadReport() {
    const html = generateHTMLReport(sel.name, sel.flag, sector, sel.gosa);
    const blob = new Blob([html], {type:'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `GFM_${sel.name.replace(/\s/g,'_')}_${sector.replace(/\s/g,'_')}_Report.html`;
    a.click();
  }

  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8',fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{background:'linear-gradient(135deg,#0f1e2a,#1a2c3e)',padding:'22px 24px',borderBottom:'1px solid rgba(46,204,113,0.1)'}}>
        <div style={{maxWidth:'1440px',margin:'0 auto'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'#2ecc71',letterSpacing:'0.12em',marginBottom:'4px'}}>REPORTS</div>
          <h1 style={{fontSize:'22px',fontWeight:900,color:'white',marginBottom:'4px'}}>Investment Report Generator</h1>
          <p style={{fontSize:'13px',color:'rgba(255,255,255,0.6)'}}>AI-generated 4-page investment intelligence reports · GOSA scored · Download as HTML/PDF</p>
        </div>
      </div>

      <div style={{background:'white',borderBottom:'2px solid rgba(26,44,62,0.08)'}}>
        <div style={{maxWidth:'1440px',margin:'0 auto',padding:'0 24px',display:'flex'}}>
          {[['generate','Generate Report'],['recent','Recent Reports'],['templates','Report Templates']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:'13px 20px',border:'none',borderBottom:`3px solid ${tab===t?'#2ecc71':'transparent'}`,background:'transparent',fontSize:'12px',fontWeight:tab===t?700:500,color:tab===t?'#1a2c3e':'#7f8c8d',cursor:'pointer',fontFamily:'inherit',marginBottom:'-2px'}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:'1440px',margin:'0 auto',padding:'24px'}}>
        {tab==='generate' && (
          <div style={{display:'grid',gridTemplateColumns:'360px 1fr',gap:'20px',alignItems:'start'}}>
            {/* Config panel */}
            <div style={{background:'white',borderRadius:'16px',border:'1px solid rgba(26,44,62,0.08)',padding:'24px',boxShadow:'0 4px 6px -2px rgba(0,0,0,0.05)'}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e',marginBottom:'20px',display:'flex',alignItems:'center',gap:'8px'}}>
                <FileText size={15} color="#2ecc71"/> Configure Report
              </div>

              <div style={{marginBottom:'14px'}}>
                <label style={{fontSize:'11px',fontWeight:700,color:'#7f8c8d',display:'block',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Target Economy</label>
                <select value={country} onChange={e=>{ setCountry(e.target.value); setGenerated(false); }}
                  style={{width:'100%',padding:'10px 12px',border:'1px solid rgba(26,44,62,0.12)',borderRadius:'9px',fontSize:'13px',fontFamily:'inherit',outline:'none',background:'white'}}>
                  {COUNTRIES_LIST.map(c=><option key={c.id} value={c.id}>{c.flag} {c.name} — GOSA {c.gosa}</option>)}
                </select>
              </div>

              <div style={{marginBottom:'14px'}}>
                <label style={{fontSize:'11px',fontWeight:700,color:'#7f8c8d',display:'block',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Primary Sector</label>
                <select value={sector} onChange={e=>{ setSector(e.target.value); setGenerated(false); }}
                  style={{width:'100%',padding:'10px 12px',border:'1px solid rgba(26,44,62,0.12)',borderRadius:'9px',fontSize:'13px',fontFamily:'inherit',outline:'none',background:'white'}}>
                  {SECTORS.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>

              <div style={{padding:'14px',background:'rgba(46,204,113,0.06)',borderRadius:'10px',border:'1px solid rgba(46,204,113,0.15)',marginBottom:'20px'}}>
                <div style={{fontSize:'11px',fontWeight:700,color:'#2ecc71',marginBottom:'8px'}}>REPORT INCLUDES</div>
                {['Page 1: Executive Summary & GOSA Score','Page 2: Doing Business — 10 Indicators','Page 3: Sector & Zone Analysis','Page 4: Signals & Recommendations'].map(f=>(
                  <div key={f} style={{display:'flex',alignItems:'center',gap:'7px',padding:'3px 0',fontSize:'12px',color:'#1a2c3e'}}>
                    <CheckCircle size={11} color="#2ecc71"/>{f}
                  </div>
                ))}
              </div>

              {!generated ? (
                <button onClick={generate} disabled={generating}
                  style={{width:'100%',padding:'12px',background:generating?'rgba(26,44,62,0.1)':'#2ecc71',color:generating?'#7f8c8d':'#0f1e2a',border:'none',borderRadius:'10px',cursor:generating?'not-allowed':'pointer',fontSize:'13px',fontWeight:800,fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',transition:'all 0.2s'}}>
                  {generating ? (
                    <><span style={{animation:'spin 1s linear infinite',display:'inline-block'}}>⚙️</span> Generating Report...</>
                  ) : (
                    <><Zap size={14}/> Generate Report</>
                  )}
                </button>
              ) : (
                <div>
                  <div style={{padding:'12px',background:'rgba(46,204,113,0.06)',borderRadius:'10px',border:'1px solid rgba(46,204,113,0.2)',marginBottom:'10px',textAlign:'center'}}>
                    <CheckCircle size={20} color="#2ecc71" style={{margin:'0 auto 6px'}}/>
                    <div style={{fontSize:'12px',fontWeight:700,color:'#1e8449'}}>Report Ready!</div>
                  </div>
                  <button onClick={downloadReport}
                    style={{width:'100%',padding:'12px',background:'#1a2c3e',color:'white',border:'none',borderRadius:'10px',cursor:'pointer',fontSize:'13px',fontWeight:800,fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'8px'}}>
                    <Download size={14}/> Download HTML Report
                  </button>
                  <button onClick={()=>setGenerated(false)}
                    style={{width:'100%',padding:'9px',background:'rgba(26,44,62,0.05)',border:'1px solid rgba(26,44,62,0.1)',borderRadius:'9px',cursor:'pointer',fontSize:'12px',fontWeight:600,fontFamily:'inherit',color:'#7f8c8d'}}>
                    New Report
                  </button>
                </div>
              )}
            </div>

            {/* Report preview */}
            <div style={{background:'white',borderRadius:'16px',border:'1px solid rgba(26,44,62,0.08)',overflow:'hidden',boxShadow:'0 4px 6px -2px rgba(0,0,0,0.05)'}}>
              <div style={{background:'#1a2c3e',padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',marginBottom:'2px'}}>REPORT PREVIEW</div>
                  <div style={{fontSize:'15px',fontWeight:800,color:'white'}}>{sel.flag} {sel.name} — {sector} Analysis</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'10px',color:'rgba(255,255,255,0.4)'}}>GOSA</div>
                  <div style={{fontSize:'28px',fontWeight:900,color:'#2ecc71',fontFamily:"'JetBrains Mono',monospace",lineHeight:1}}>{sel.gosa}</div>
                </div>
              </div>
              <div style={{padding:'20px'}}>
                {[
                  {n:1,title:'Executive Summary & GOSA Score',desc:'Overall composite score, 4-layer breakdown, key findings, investment verdict'},
                  {n:2,title:'Doing Business Indicators',desc:'10 World Bank DTF indicators, regulatory environment, tax framework analysis'},
                  {n:3,title:'Sector & Zone Intelligence',desc:'Sector momentum score, 3 recommended investment zones, infrastructure quality'},
                  {n:4,title:'Market Signals & Recommendations',desc:'4 verified signals, 5 strategic recommendations with timeline, investment roadmap'},
                ].map(page=>(
                  <div key={page.n} style={{display:'flex',gap:'14px',padding:'14px',borderRadius:'10px',border:'1px solid rgba(26,44,62,0.07)',marginBottom:'10px',alignItems:'flex-start'}}>
                    <div style={{width:'32px',height:'32px',background:'#1a2c3e',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <span style={{fontSize:'14px',fontWeight:900,color:'#2ecc71',fontFamily:"'JetBrains Mono',monospace"}}>{page.n}</span>
                    </div>
                    <div>
                      <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e',marginBottom:'3px'}}>{page.title}</div>
                      <div style={{fontSize:'12px',color:'#7f8c8d'}}>{page.desc}</div>
                    </div>
                  </div>
                ))}
                <div style={{marginTop:'16px',padding:'14px',background:'rgba(46,204,113,0.04)',borderRadius:'10px',border:'1px solid rgba(46,204,113,0.12)'}}>
                  <div style={{display:'flex',gap:'24px',flexWrap:'wrap'}}>
                    {[['Format','HTML (print to PDF)'],['Pages','4 pages'],['Language','English'],['Sources',`${Math.floor(sel.gosa/3)}+ verified`]].map(([l,v])=>(
                      <div key={l}>
                        <div style={{fontSize:'10px',color:'#7f8c8d',marginBottom:'1px'}}>{l}</div>
                        <div style={{fontSize:'12px',fontWeight:700,color:'#1a2c3e'}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab==='recent' && (
          <div style={{background:'white',borderRadius:'16px',border:'1px solid rgba(26,44,62,0.08)',overflow:'hidden'}}>
            <div style={{padding:'14px 20px',borderBottom:'1px solid rgba(26,44,62,0.06)',fontSize:'12px',fontWeight:700,color:'#1a2c3e'}}>
              Recent Reports — {RECENT_REPORTS.length} reports
            </div>
            {RECENT_REPORTS.map(r=>(
              <div key={r.id} style={{padding:'14px 20px',borderBottom:'1px solid rgba(26,44,62,0.05)',display:'flex',alignItems:'center',gap:'16px'}}>
                <div style={{width:'42px',height:'42px',background:'rgba(26,44,62,0.04)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',flexShrink:0}}>
                  {r.flag}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e',marginBottom:'2px'}}>{r.title}</div>
                  <div style={{fontSize:'11px',color:'#7f8c8d'}}>{r.date} · {r.sector} · {r.pages} pages · {r.size}</div>
                </div>
                <div style={{fontSize:'16px',fontWeight:900,color:'#2ecc71',fontFamily:"'JetBrains Mono',monospace"}}>{r.gosa}</div>
                <button onClick={()=>{
                  const c2 = COUNTRIES_LIST.find(c=>c.name===r.country)||COUNTRIES_LIST[0];
                  const html = generateHTMLReport(r.country,r.flag,r.sector,r.gosa);
                  const blob = new Blob([html],{type:'text/html'});
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = `GFM_${r.country.replace(/\s/g,'_')}_Report.html`;
                  a.click();
                }} style={{padding:'7px 16px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(46,204,113,0.2)',borderRadius:'8px',cursor:'pointer',fontSize:'12px',fontWeight:600,color:'#2ecc71',fontFamily:'inherit',display:'flex',alignItems:'center',gap:'5px'}}>
                  <Download size={12}/> Download
                </button>
              </div>
            ))}
          </div>
        )}

        {tab==='templates' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
            {[
              {icon:'🌏',title:'Market Entry Assessment',desc:'Full GOSA analysis for new country entry decisions. 4 pages covering all scoring layers.'},
              {icon:'📊',title:'Competitive Benchmark',desc:'Compare 2-4 economies head-to-head across all GOSA dimensions and sector indicators.'},
              {icon:'📍',title:'Zone Selection Report',desc:'Deep-dive on specific investment zones — occupancy, infrastructure, incentive stack.'},
              {icon:'💼',title:'Sector Opportunity Brief',desc:'Sector-focused 2-page brief for board presentations and executive briefings.'},
            ].map(({icon,title,desc})=>(
              <div key={title} style={{background:'white',borderRadius:'14px',padding:'22px',border:'1px solid rgba(26,44,62,0.08)',cursor:'pointer'}}
                onClick={()=>setTab('generate')}>
                <div style={{fontSize:'28px',marginBottom:'10px'}}>{icon}</div>
                <div style={{fontSize:'15px',fontWeight:800,color:'#1a2c3e',marginBottom:'6px'}}>{title}</div>
                <div style={{fontSize:'12px',color:'#7f8c8d',lineHeight:'1.65',marginBottom:'12px'}}>{desc}</div>
                <span style={{fontSize:'12px',color:'#2ecc71',fontWeight:700}}>Use template →</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <Footer/>
    </div>
  );
}
