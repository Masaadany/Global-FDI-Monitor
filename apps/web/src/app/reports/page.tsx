'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Download, FileText, Zap, Clock, CheckCircle } from 'lucide-react';
import ScrollableSelect from '@/components/ScrollableSelect';

const COUNTRIES_LIST = [
  {id:'SGP',name:'Singapore',    flag:'🇸🇬',gosa:88.4,region:'Asia Pacific'},
  {id:'MYS',name:'Malaysia',     flag:'🇲🇾',gosa:81.2,region:'Asia Pacific'},
  {id:'THA',name:'Thailand',     flag:'🇹🇭',gosa:80.7,region:'Asia Pacific'},
  {id:'VNM',name:'Vietnam',      flag:'🇻🇳',gosa:79.4,region:'Asia Pacific'},
  {id:'ARE',name:'UAE',          flag:'🇦🇪',gosa:82.1,region:'Middle East'},
  {id:'SAU',name:'Saudi Arabia', flag:'🇸🇦',gosa:79.1,region:'Middle East'},
  {id:'IND',name:'India',        flag:'🇮🇳',gosa:73.2,region:'Asia Pacific'},
  {id:'IDN',name:'Indonesia',    flag:'🇮🇩',gosa:77.8,region:'Asia Pacific'},
  {id:'KOR',name:'South Korea',  flag:'🇰🇷',gosa:84.1,region:'Asia Pacific'},
  {id:'JPN',name:'Japan',        flag:'🇯🇵',gosa:81.4,region:'Asia Pacific'},
  {id:'GBR',name:'United Kingdom',flag:'🇬🇧',gosa:82.5,region:'Europe'},
  {id:'DEU',name:'Germany',      flag:'🇩🇪',gosa:83.1,region:'Europe'},
  {id:'USA',name:'United States',flag:'🇺🇸',gosa:83.9,region:'Americas'},
  {id:'BRA',name:'Brazil',       flag:'🇧🇷',gosa:71.3,region:'Americas'},
  {id:'MAR',name:'Morocco',      flag:'🇲🇦',gosa:66.8,region:'Africa'},
];

const SECTORS = ['All Sectors','EV Battery','Data Centers','Semiconductors','Renewables','Manufacturing','Financial Services','Pharmaceutical','Logistics'];

const RECENT_REPORTS = [
  {id:'RPT-0319-01',title:'Vietnam FDI Investment Analysis',country:'Vietnam',flag:'🇻🇳',sector:'Electronics',date:'Mar 19, 2026',gosa:79.4},
  {id:'RPT-0316-01',title:'Malaysia Data Center Opportunity',country:'Malaysia',flag:'🇲🇾',sector:'Data Centers',date:'Mar 16, 2026',gosa:81.2},
  {id:'RPT-0312-01',title:'UAE AI Infrastructure Investment',country:'UAE',flag:'🇦🇪',sector:'AI & Tech',date:'Mar 12, 2026',gosa:82.1},
  {id:'RPT-0308-01',title:'Thailand EV Battery Supply Chain',country:'Thailand',flag:'🇹🇭',sector:'EV Battery',date:'Mar 8, 2026',gosa:80.7},
];

function generateHTMLReport(country: string, flag: string, sector: string, gosa: number, countryId: string): void {
  const date = new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>GFM Investment Report — ${country}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=JetBrains+Mono:wght@600;700;900&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Inter',sans-serif;background:#020c14;color:#e8f4f8;padding:32px;min-height:100vh}
  .page{max-width:900px;margin:0 auto;page-break-after:always;padding:0 0 48px}
  .cover{background:linear-gradient(135deg,#060f1a,#0a1628);border:1px solid rgba(0,255,200,0.15);border-radius:16px;padding:48px;margin-bottom:32px;position:relative;overflow:hidden}
  .cover::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(0,255,200,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.02) 1px,transparent 1px);background-size:48px 48px}
  h2{font-size:14px;font-weight:800;color:rgba(0,255,200,0.5);text-transform:uppercase;letter-spacing:.1em;margin-bottom:16px;font-family:'JetBrains Mono',monospace}
  .panel{background:rgba(10,22,40,0.8);border:1px solid rgba(0,180,216,0.1);border-radius:12px;padding:22px;margin-bottom:18px}
  .metric{background:rgba(255,255,255,0.03);border-radius:9px;padding:14px;text-align:center;border:1px solid rgba(255,255,255,0.05)}
  .row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.04)}
  .bar{height:5px;background:rgba(255,255,255,0.05);border-radius:3px;overflow:hidden;margin-top:5px}
  .bar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,rgba(0,255,200,0.5),#00ffc8)}
  .signal{padding:10px 14px;background:rgba(0,0,0,0.3);border-radius:8px;border-left:3px solid #00ffc8;margin-bottom:8px}
  .footer{border-top:1px solid rgba(255,255,255,0.05);padding-top:16px;font-size:10px;color:rgba(232,244,248,0.25);text-align:center;margin-top:24px}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body><div class="page">

<div class="cover">
  <div style="position:relative">
    <div style="font-size:10px;font-weight:800;color:rgba(0,255,200,0.5);letter-spacing:.12em;margin-bottom:8px;font-family:'JetBrains Mono',monospace">INVESTMENT INTELLIGENCE REPORT · ${date}</div>
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
      <span style="font-size:52px">${flag}</span>
      <div>
        <h1 style="font-size:28px;font-weight:900;color:#e8f4f8;line-height:1.1;margin-bottom:4px">${country}</h1>
        <div style="font-size:13px;color:rgba(232,244,248,0.5)">${sector} Sector · FDI Investment Analysis</div>
      </div>
      <div style="margin-left:auto;text-align:right">
        <div style="font-size:10px;color:rgba(232,244,248,0.4);margin-bottom:4px">GOSA SCORE</div>
        <div style="font-size:52px;font-weight:900;color:#00ffc8;font-family:'JetBrains Mono',monospace;line-height:1;text-shadow:0 0 24px rgba(0,255,200,0.4)">${gosa}</div>
      </div>
    </div>
    <p style="font-size:13px;color:rgba(232,244,248,0.55);line-height:1.8;max-width:700px">
      ${country} presents a ${gosa>=80?'strong':'developing'} FDI destination profile in the ${sector} sector with a GOSA composite score of ${gosa}/100, placing it in the ${gosa>=80?'TOP':'HIGH'} tier. This report covers Doing Business Indicators (L1), Sector Indicators (L2), Zone Indicators (L3), and Market Intelligence (L4).
    </p>
    <div style="display:flex;gap:20px;margin-top:20px">
      ${[[`${(gosa*0.30).toFixed(1)}`,'L1 Doing Business'],[`${(gosa*0.20).toFixed(1)}`,'L2 Sector'],[`${(gosa*0.25).toFixed(1)}`,'L3 Zones'],[`${(gosa*0.25).toFixed(1)}`,'L4 Market Intel']].map(([v,l])=>`<div class="metric"><div style="font-size:9px;color:rgba(232,244,248,0.4);margin-bottom:4px">${l}</div><div style="font-size:22px;font-weight:900;color:#00ffc8;font-family:'JetBrains Mono',monospace">${v}</div></div>`).join('')}
    </div>
  </div>
</div>

<div class="panel">
  <h2>Doing Business Indicators (L1 Layer)</h2>
  ${[['Starting a Business',82],['Construction Permits',74],['Getting Electricity',87],['Registering Property',71],['Getting Credit',75],['Protecting Investors',74],['Paying Taxes',69],['Trading Across Borders',71],['Enforcing Contracts',64],['Resolving Insolvency',66]].map(([ind,score])=>`
  <div class="row">
    <span style="font-size:12px;color:rgba(232,244,248,0.65)">${ind}</span>
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:80px" class="bar"><div class="bar-fill" style="width:${score}%"></div></div>
      <span style="font-size:13px;font-weight:800;color:${Number(score)>=80?'#2ECC71':Number(score)>=60?'#3498DB':'#ffd700'};font-family:'JetBrains Mono',monospace;min-width:28px;text-align:right">${score}</span>
    </div>
  </div>`).join('')}
</div>

<div class="panel">
  <h2>Investment Zones (L3 Layer)</h2>
  ${[['Premier Investment Zone','Free Zone','5yr CIT exemption',89],['Industrial Technology Park','SEZ','50% CIT reduction',85],['Export Processing Zone','EPZ','Full CIT exemption',82]].map(([name,type,inc,score])=>`
  <div class="row">
    <div><div style="font-size:12px;font-weight:700;color:rgba(232,244,248,0.8)">${name}</div><div style="font-size:10px;color:rgba(232,244,248,0.4)">${type} · ${inc}</div></div>
    <span style="font-size:16px;font-weight:900;color:#00ffc8;font-family:'JetBrains Mono',monospace">${score}</span>
  </div>`).join('')}
</div>

<div class="panel">
  <h2>Market Signals (L4 Layer)</h2>
  ${[['POLICY CHANGE','Favorable regulatory shift detected in '+sector+' sector','#ff4466','HIGH'],['NEW INCENTIVE','Tax package expanded for target sector investments','#2ECC71','HIGH'],['SECTOR GROWTH','Market momentum in '+sector+' confirms investment thesis','#3498DB','MED']].map(([type,title,color,impact])=>`
  <div class="signal" style="border-left-color:${color}">
    <div style="display:flex;justify-content:space-between;margin-bottom:4px">
      <span style="font-size:9px;font-weight:800;color:${color};letter-spacing:.06em">${type}</span>
      <span style="font-size:9px;font-weight:800;color:${impact==='HIGH'?'#ff4466':'#ffd700'}">${impact}</span>
    </div>
    <div style="font-size:12px;color:rgba(232,244,248,0.7)">${title}</div>
  </div>`).join('')}
</div>

<div class="panel">
  <h2>Strategic Recommendations</h2>
  ${[['HIGH','Proceed with '+sector+' investment — GOSA score '+gosa+'/100 supports strong ROI','Immediate'],['HIGH','Engage Investment Promotion Agency for fast-track licensing','0-30 days'],['MED','Secure preferred zone allocation — 3 zones recommended','30-60 days'],['MED','Apply for sector-specific incentive package — est. $8-12M saving over 5 years','60-90 days'],['LOW','Establish supply chain partnerships with existing zone tenants','90-180 days']].map(([priority,rec,timeline])=>`
  <div class="row">
    <div style="flex:1"><span style="font-size:9px;font-weight:800;padding:2px 6px;border-radius:4px;background:${priority==='HIGH'?'rgba(255,68,102,0.12)':priority==='MED'?'rgba(255,215,0,0.12)':'rgba(46,204,113,0.12)'};color:${priority==='HIGH'?'#ff4466':priority==='MED'?'#ffd700':'#2ECC71'};margin-right:8px">${priority}</span><span style="font-size:12px;color:rgba(232,244,248,0.7)">${rec}</span></div>
    <span style="font-size:10px;color:rgba(232,244,248,0.35);flex-shrink:0;margin-left:12px">${timeline}</span>
  </div>`).join('')}
</div>

<div style="background:rgba(0,255,200,0.04);border:1px solid rgba(0,255,200,0.12);border-radius:10px;padding:16px;margin-bottom:18px">
  <div style="font-size:11px;font-weight:800;color:#00ffc8;margin-bottom:6px">INVESTMENT VERDICT — ${gosa>=80?'STRONGLY RECOMMENDED':'RECOMMENDED WITH CONDITIONS'}</div>
  <div style="font-size:13px;color:rgba(232,244,248,0.65);line-height:1.7">${country} ${sector} investment at your target size shows ${gosa>=80?'excellent':'strong'} fundamentals with GOSA score ${gosa}/100. Recommended entry window: Q3-Q4 2026.</div>
</div>

<div class="footer">Global FDI Monitor · fdimonitor.org · info@fdimonitor.org · Generated: ${date} · Report: GFM-${countryId}-${Date.now().toString().slice(-6)}</div>
</div></body></html>`;

  const blob = new Blob([html], {type:'text/html'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `GFM_${country.replace(/\s/g,'_')}_${sector.replace(/\s/g,'_')}_Report.html`;
  a.click();
}

export default function ReportsPage() {
  const [country, setCountry] = useState('MYS');
  const [sector, setSector] = useState('Data Centers');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [tab, setTab] = useState('generate');

  const sel = COUNTRIES_LIST.find(c => c.id === country) || COUNTRIES_LIST[0];

  async function generate() {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1800));
    setGenerating(false);
    setGenerated(true);
  }

  function downloadReport() {
    generateHTMLReport(sel.name, sel.flag, sector, sel.gosa, sel.id);
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-page)',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>

      <div style={{background:'linear-gradient(135deg,#FFFFFF,#060f1a)',padding:'24px',borderBottom:'1px solid rgba(0,255,200,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'1540px',margin:'0 auto',position:'relative'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'#2ECC71',letterSpacing:'0.2em',marginBottom:'6px',fontFamily:'var(--font-display)'}}>REPORTS</div>
          <h1 style={{fontSize:'24px',fontWeight:900,color:'var(--text-primary)',marginBottom:'4px'}}>Investment Report Generator</h1>
          <p style={{fontSize:'13px',color:'var(--text-muted)'}}>AI-generated 4-section intelligence reports · GOSA scored · Download as HTML (print to PDF)</p>
        </div>
      </div>

      <div style={{background:'var(--bg-page)',borderBottom:'1px solid rgba(0,255,200,0.06)',backdropFilter:'blur(20px)'}}>
        <div style={{maxWidth:'1540px',margin:'0 auto',padding:'0 24px',display:'flex'}}>
          {[['generate','Export Report'],['recent','Recent Reports'],['templates','Templates']].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{padding:'13px 20px',border:'none',borderBottom:`2px solid ${tab===t?'#2ECC71':'transparent'}`,background:'transparent',fontSize:'12px',fontWeight:tab===t?700:400,color:tab===t?'#2ECC71':'rgba(232,244,248,0.45)',cursor:'pointer',fontFamily:'var(--font-ui)',marginBottom:'-1px'}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:'1540px',margin:'0 auto',padding:'24px'}}>
        {tab === 'generate' && (
          <div style={{display:'grid',gridTemplateColumns:'360px 1fr',gap:'20px',alignItems:'start'}}>
            {/* Config */}
            <div style={{background:'white',border:'1px solid var(--border)',borderRadius:'14px',padding:'24px'}}>
              <div style={{fontSize:'11px',fontWeight:800,color:'#2ECC71',letterSpacing:'0.1em',marginBottom:'18px',fontFamily:'var(--font-display)'}}>CONFIGURE REPORT</div>
              <div style={{marginBottom:'14px'}}>
                <label style={{fontSize:'10px',fontWeight:700,color:'#27ae60',display:'block',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Target Economy</label>
                <ScrollableSelect
                  value={country}
                  onChange={v => { setCountry(v); setGenerated(false); }}
                  width="100%"
                  options={COUNTRIES_LIST.map(c => ({value:c.id,label:c.name,flag:c.flag,sub:'GOSA '+c.gosa+' · '+c.region}))}
                  accentColor="#00ffc8"
                />
              </div>
              <div style={{marginBottom:'20px'}}>
                <label style={{fontSize:'10px',fontWeight:700,color:'#27ae60',display:'block',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Primary Sector</label>
                <ScrollableSelect
                  value={sector}
                  onChange={v => { setSector(v); setGenerated(false); }}
                  width="100%"
                  options={SECTORS.map(s => ({value:s,label:s}))}
                  accentColor="#00d4ff"
                />
              </div>
              <div style={{padding:'14px',background:'rgba(0,255,200,0.04)',borderRadius:'10px',border:'1px solid rgba(0,255,200,0.1)',marginBottom:'20px'}}>
                <div style={{fontSize:'10px',fontWeight:700,color:'#2ECC71',marginBottom:'8px',letterSpacing:'0.08em'}}>REPORT INCLUDES</div>
                {['Executive Summary & GOSA Score','Doing Business — 10 Indicators','Zone & Sector Intelligence','Signals & Strategic Recommendations'].map(f => (
                  <div key={f} style={{display:'flex',alignItems:'center',gap:'7px',padding:'3px 0',fontSize:'11px',color:'rgba(232,244,248,0.65)'}}>
                    <CheckCircle size={11} color="#00ffc8"/>{f}
                  </div>
                ))}
              </div>
              {!generated ? (
                <button onClick={generate} disabled={generating}
                  style={{width:'100%',padding:'12px',background:generating?'rgba(46,204,113,0.08)':'linear-gradient(135deg,#00ffc8,#00c49a)',color:generating?'rgba(232,244,248,0.4)':'var(--primary)',border:'none',borderRadius:'10px',cursor:generating?'not-allowed':'pointer',fontSize:'13px',fontWeight:800,fontFamily:'var(--font-ui)',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',transition:'all 200ms',boxShadow:generating?'none':'0 4px 16px rgba(0,255,200,0.25)'}}>
                  <Zap size={14}/> {generating ? 'Exporting Report...' : 'Export Report'}
                </button>
              ) : (
                <div>
                  <div style={{padding:'12px',background:'rgba(0,255,200,0.05)',borderRadius:'10px',border:'1px solid rgba(0,255,200,0.15)',marginBottom:'10px',textAlign:'center'}}>
                    <CheckCircle size={20} color="#00ffc8" style={{display:'block',margin:'0 auto 6px',filter:'drop-shadow(0 0 8px rgba(0,255,200,0.5))'}}/>
                    <div style={{fontSize:'12px',fontWeight:700,color:'var(--accent-green)'}}>Report Ready!</div>
                  </div>
                  <button onClick={downloadReport}
                    style={{width:'100%',padding:'12px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'var(--primary)',border:'none',borderRadius:'10px',cursor:'pointer',fontSize:'13px',fontWeight:800,fontFamily:'var(--font-ui)',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'8px',boxShadow:'0 4px 16px rgba(0,255,200,0.25)'}}>
                    <Download size={14}/> Download HTML Report
                  </button>
                  <button onClick={() => setGenerated(false)}
                    style={{width:'100%',padding:'9px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'9px',cursor:'pointer',fontSize:'12px',fontWeight:600,fontFamily:'var(--font-ui)',color:'var(--text-muted)'}}>
                    New Report
                  </button>
                </div>
              )}
            </div>

            {/* Preview */}
            <div style={{background:'white',border:'1px solid var(--border)',borderRadius:'14px',overflow:'hidden'}}>
              <div style={{background:'var(--bg-subtle)',padding:'16px 22px',borderBottom:'1px solid rgba(0,255,200,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontSize:'10px',color:'var(--text-muted)',marginBottom:'4px',letterSpacing:'0.1em',fontFamily:'var(--font-mono)'}}>REPORT PREVIEW</div>
                  <div style={{fontSize:'15px',fontWeight:800,color:'var(--text-primary)'}}>{sel.flag} {sel.name} — {sector}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'10px',color:'var(--text-muted)'}}>GOSA</div>
                  <div style={{fontSize:'32px',fontWeight:900,color:'var(--accent-green)',fontFamily:'var(--font-mono)',textShadow:'0 0 16px rgba(0,255,200,0.4)',lineHeight:1}}>{sel.gosa}</div>
                </div>
              </div>
              <div style={{padding:'22px'}}>
                {[
                  {n:1,title:'Executive Summary & GOSA Score',desc:'Overall composite score, 4-layer breakdown, key findings, investment verdict'},
                  {n:2,title:'Doing Business Indicators',desc:'10 World Bank DTF indicators, regulatory environment, tax framework'},
                  {n:3,title:'Zone & Sector Intelligence',desc:'Zone availability, incentive stacks, infrastructure quality, sector momentum'},
                  {n:4,title:'Market Signals & Recommendations',desc:'3 verified signals, 5 strategic recommendations with timeline'},
                ].map(page => (
                  <div key={page.n} style={{display:'flex',gap:'14px',padding:'14px',borderRadius:'10px',border:'1px solid var(--border)',marginBottom:'10px',alignItems:'flex-start',transition:'all 200ms ease'}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(46,204,113,0.12)';e.currentTarget.style.background='rgba(0,255,200,0.02)';}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.04)';e.currentTarget.style.background='transparent';}}>
                    <div style={{width:'34px',height:'34px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(0,255,200,0.15)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'14px',fontWeight:900,color:'var(--accent-green)',fontFamily:'var(--font-mono)'}}>{page.n}</div>
                    <div>
                      <div style={{fontSize:'13px',fontWeight:700,color:'var(--text-primary)',marginBottom:'3px'}}>{page.title}</div>
                      <div style={{fontSize:'12px',color:'var(--text-muted)'}}>{page.desc}</div>
                    </div>
                  </div>
                ))}
                <div style={{marginTop:'16px',padding:'14px',background:'rgba(0,255,200,0.03)',borderRadius:'10px',border:'1px solid rgba(0,255,200,0.08)'}}>
                  <div style={{display:'flex',gap:'20px',flexWrap:'wrap'}}>
                    {[['Format','HTML → Print to PDF'],['Sections','4'],['Language','English'],['Sources',Math.floor(sel.gosa/3)+' verified']].map(([l,v]) => (
                      <div key={l}>
                        <div style={{fontSize:'9px',color:'var(--text-light)',marginBottom:'1px',textTransform:'uppercase',letterSpacing:'0.06em'}}>{l}</div>
                        <div style={{fontSize:'12px',fontWeight:700,color:'var(--text-secondary)'}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'recent' && (
          <div style={{background:'white',border:'1px solid var(--border)',borderRadius:'14px',overflow:'hidden'}}>
            <div style={{padding:'14px 20px',borderBottom:'1px solid rgba(0,255,200,0.06)',fontSize:'11px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.1em',fontFamily:'var(--font-display)',background:'var(--bg-subtle)'}}>
              Recent Reports
            </div>
            {RECENT_REPORTS.map(r => (
              <div key={r.id} style={{padding:'14px 20px',borderBottom:'1px solid rgba(255,255,255,0.03)',display:'flex',alignItems:'center',gap:'16px'}}>
                <span style={{fontSize:'24px'}}>{r.flag}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:'13px',fontWeight:700,color:'var(--text-primary)',marginBottom:'2px'}}>{r.title}</div>
                  <div style={{fontSize:'11px',color:'var(--text-muted)'}}>{r.date} · {r.sector}</div>
                </div>
                <div style={{fontSize:'18px',fontWeight:900,color:'var(--accent-green)',fontFamily:'var(--font-mono)'}}>{r.gosa}</div>
                <button onClick={() => generateHTMLReport(r.country, r.flag, r.sector, r.gosa, r.id.slice(-3))}
                  style={{display:'flex',alignItems:'center',gap:'6px',padding:'7px 14px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(0,255,200,0.15)',borderRadius:'7px',cursor:'pointer',fontSize:'11px',fontWeight:700,color:'var(--accent-green)',fontFamily:'var(--font-ui)'}}>
                  <Download size={11}/> Download
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'templates' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
            {[
              {icon:'🌏',title:'Market Entry Assessment',desc:'Full GOSA analysis for new country entry decisions. 4 sections covering all scoring layers.',color:'var(--accent-green)'},
              {icon:'📊',title:'Competitive Benchmark',desc:'Compare 2-4 economies head-to-head across all GOSA dimensions and sector indicators.',color:'var(--accent-blue)'},
              {icon:'📍',title:'Zone Selection Report',desc:'Deep-dive on specific investment zones — occupancy, infrastructure, incentive stack.',color:'#ffd700'},
              {icon:'💼',title:'Sector Opportunity Brief',desc:'Sector-focused 2-section brief for board presentations and executive briefings.',color:'#9b59b6'},
            ].map(({icon,title,desc,color}) => (
              <div key={title} style={{background:'white',border:'1px solid #ECF0F1',borderRadius:'14px',padding:'22px',cursor:'pointer',transition:'all 250ms ease'}}
                onClick={() => setTab('generate')}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=color+'20';e.currentTarget.style.transform='translateY(-2px)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.05)';e.currentTarget.style.transform='none';}}>
                <div style={{fontSize:'28px',marginBottom:'10px'}}>{icon}</div>
                <div style={{fontSize:'15px',fontWeight:800,color:'var(--text-primary)',marginBottom:'6px'}}>{title}</div>
                <div style={{fontSize:'12px',color:'var(--text-muted)',lineHeight:1.65,marginBottom:'12px'}}>{desc}</div>
                <span style={{fontSize:'12px',color:color,fontWeight:700}}>Use template →</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
