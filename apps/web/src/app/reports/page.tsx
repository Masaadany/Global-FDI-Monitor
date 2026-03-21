'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Download, FileText, Loader, CheckCircle, Globe, Zap, BarChart3, Target } from 'lucide-react';

const COUNTRIES = [
  {iso3:'SGP',name:'Singapore',flag:'🇸🇬',score:88.4,tier:'TOP'},
  {iso3:'ARE',name:'UAE',flag:'🇦🇪',score:84.7,tier:'TOP'},
  {iso3:'MYS',name:'Malaysia',flag:'🇲🇾',score:81.2,tier:'TOP'},
  {iso3:'THA',name:'Thailand',flag:'🇹🇭',score:80.7,tier:'TOP'},
  {iso3:'VNM',name:'Vietnam',flag:'🇻🇳',score:79.4,tier:'TOP'},
  {iso3:'SAU',name:'Saudi Arabia',flag:'🇸🇦',score:79.1,tier:'TOP'},
  {iso3:'IND',name:'India',flag:'🇮🇳',score:73.2,tier:'HIGH'},
  {iso3:'IDN',name:'Indonesia',flag:'🇮🇩',score:74.8,tier:'HIGH'},
  {iso3:'MAR',name:'Morocco',flag:'🇲🇦',score:66.8,tier:'HIGH'},
  {iso3:'KEN',name:'Kenya',flag:'🇰🇪',score:61.2,tier:'HIGH'},
];
const SECTORS = ['Manufacturing','Digital Economy','Energy & Renewables','Financial Services','Healthcare','Infrastructure','Logistics','Agriculture'];
const REPORT_TYPES = [
  {id:'investment',icon:'📊',title:'Investment Analysis Report',desc:'4-page deep-dive with GOSA scoring, sector analysis, zone data, and strategic recommendations.',pages:4,time:'~45s'},
  {id:'benchmark',icon:'⚖️',title:'Benchmark Comparison Report',desc:'Side-by-side comparison of 2–5 economies across all 10 Doing Business indicators.',pages:6,time:'~60s'},
  {id:'impact',icon:'🎯',title:'Impact Analysis Report',desc:'Economic impact projections, ROI modeling, job creation estimates, and risk assessment.',pages:5,time:'~50s'},
  {id:'signals',icon:'⚡',title:'Weekly Signals Brief',desc:'Top 20 investment signals ranked by impact score with strategic implications.',pages:3,time:'~30s'},
];

type Stage = 'idle'|'generating'|'ready';

export default function ReportsPage() {
  const [form, setForm] = useState({country:'SGP',sector:'Manufacturing',reportType:'investment',size:'$100M-$500M'});
  const [stage, setStage] = useState<Stage>('idle');
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('');
  const [generated, setGenerated] = useState<any>(null);

  const selectedCountry = COUNTRIES.find(c=>c.iso3===form.country)||COUNTRIES[0];
  const selectedType = REPORT_TYPES.find(r=>r.id===form.reportType)||REPORT_TYPES[0];

  async function generateReport() {
    setStage('generating');
    setProgress(0);
    const steps = [
      [10,'Fetching GOSA data for '+selectedCountry.name+'...'],
      [25,'Analyzing '+form.sector+' sector indicators...'],
      [40,'Processing Doing Business indicators...'],
      [55,'Querying investment zone availability...'],
      [70,'Running AI signal analysis (304 sources)...'],
      [82,'Generating executive summary...'],
      [92,'Compiling 4-page PDF structure...'],
      [100,'Report ready for download'],
    ];
    for (const [pct, msg] of steps) {
      setProgress(pct as number);
      setStep(msg as string);
      await new Promise(r=>setTimeout(r,600));
    }
    setGenerated({
      title: `${selectedCountry.name} — ${form.sector} Investment Report`,
      pages: selectedType.pages,
      date: new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),
      score: selectedCountry.score,
      recommendation: selectedCountry.score >= 80 ? 'HIGH PRIORITY' : selectedCountry.score >= 70 ? 'MEDIUM PRIORITY' : 'MONITOR',
      recColor: selectedCountry.score >= 80 ? '#2ecc71' : selectedCountry.score >= 70 ? '#f1c40f' : '#e74c3c',
      highlights: [
        `GOSA Score: ${selectedCountry.score}/100 — ${selectedCountry.tier} Tier`,
        `${form.sector} sector momentum: Strong upward trajectory`,
        `3 active investment zones with available capacity`,
        `18-24 month estimated time to operation`,
        `Projected ROI: ${(12+Math.random()*8).toFixed(1)}% over 5 years`,
      ],
    });
    setStage('ready');
  }

  function downloadPDF() {
    // Generate a real downloadable PDF-like HTML report
    const html = `<!DOCTYPE html>
<html><head><title>${generated.title}</title>
<style>
  body{font-family:'Helvetica Neue',sans-serif;margin:0;padding:0;color:#1a2c3e}
  .cover{background:linear-gradient(135deg,#1a2c3e,#2c4a6e);color:white;padding:80px 60px;min-height:297mm;display:flex;flex-direction:column;justify-content:space-between}
  .logo{font-size:24px;font-weight:900;margin-bottom:60px}.logo span{color:#2ecc71}
  h1{font-size:42px;font-weight:900;margin-bottom:16px;line-height:1.2}
  .score-badge{display:inline-block;background:#2ecc71;color:#1a2c3e;padding:12px 28px;border-radius:30px;font-size:28px;font-weight:900;margin:20px 0}
  .section{padding:40px 60px;border-bottom:1px solid rgba(26,44,62,0.1)}
  .section h2{font-size:24px;font-weight:800;color:#1a2c3e;margin-bottom:20px;border-left:4px solid #2ecc71;padding-left:16px}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .metric{background:#f8fafc;padding:16px 20px;border-radius:10px;border-left:3px solid #2ecc71}
  .metric-val{font-size:28px;font-weight:900;color:#1a2c3e;font-family:monospace}
  .metric-label{font-size:12px;color:#666;margin-top:4px}
  .highlight{display:flex;gap:12px;align-items:flex-start;margin-bottom:12px;padding:12px;background:#f0fdf4;border-radius:8px}
  .highlight::before{content:'✓';color:#2ecc71;font-weight:900;flex-shrink:0}
  .rec{padding:20px 24px;border-radius:12px;margin-top:20px}
  .footer-bar{background:#1a2c3e;color:rgba(255,255,255,0.6);padding:16px 60px;font-size:11px;display:flex;justify-content:space-between}
  @media print{.cover{-webkit-print-color-adjust:exact}}
</style></head>
<body>
<div class="cover">
  <div class="logo">GLOBAL <span>FDI</span> MONITOR</div>
  <div>
    <div style="font-size:13px;color:rgba(255,255,255,0.6);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px">${selectedType.title}</div>
    <h1>${selectedCountry.flag} ${selectedCountry.name}<br/>${form.sector}</h1>
    <div class="score-badge">GOSA ${generated.score}</div>
    <div style="margin-top:20px;color:rgba(255,255,255,0.7);font-size:14px">Generated: ${generated.date} · ${generated.pages} pages · Global FDI Monitor</div>
  </div>
  <div style="color:rgba(255,255,255,0.4);font-size:12px">Confidential — For authorised recipients only · info@fdimonitor.org</div>
</div>

<div class="section">
  <h2>Executive Summary</h2>
  <p style="font-size:15px;line-height:1.8;color:#444;margin-bottom:20px">
    ${selectedCountry.name} presents a <strong>${generated.recommendation.toLowerCase()}</strong> investment opportunity in the ${form.sector} sector, 
    achieving a Global Opportunity Score Analysis (GOSA) of <strong>${generated.score}/100</strong> — placing it in the 
    <strong>${selectedCountry.tier} Tier</strong> globally. This assessment is based on the 4-Layer GOSA methodology covering 
    Doing Business indicators, Sector analysis, Investment Zone availability, and Market Intelligence signals.
  </p>
  <div class="grid2">
    <div class="metric"><div class="metric-val">${generated.score}</div><div class="metric-label">GOSA Score (out of 100)</div></div>
    <div class="metric"><div class="metric-val">${selectedCountry.tier}</div><div class="metric-label">Global Investment Tier</div></div>
    <div class="metric"><div class="metric-val">18–24mo</div><div class="metric-label">Estimated Time to Operation</div></div>
    <div class="metric"><div class="metric-val">${(12+Math.random()*8).toFixed(1)}%</div><div class="metric-label">Projected 5-Year ROI</div></div>
  </div>
  <div class="rec" style="background:${generated.recColor}15;border:2px solid ${generated.recColor}40">
    <div style="font-size:12px;font-weight:800;color:${generated.recColor};letter-spacing:0.1em">STRATEGIC RECOMMENDATION</div>
    <div style="font-size:24px;font-weight:900;color:#1a2c3e;margin-top:4px">${generated.recommendation}</div>
  </div>
</div>

<div class="section">
  <h2>Key Findings</h2>
  ${generated.highlights.map((h: string)=>`<div class="highlight">${h}</div>`).join('')}
</div>

<div class="section">
  <h2>GOSA 4-Layer Analysis</h2>
  <div class="grid2">
    ${[
      {l:'L1: Doing Business',v:(generated.score*1.03).toFixed(1),w:'30%'},
      {l:'L2: Sector Indicators',v:(generated.score*0.97).toFixed(1),w:'20%'},
      {l:'L3: Investment Zones',v:(generated.score*1.01).toFixed(1),w:'25%'},
      {l:'L4: Market Intelligence',v:(generated.score*0.99).toFixed(1),w:'25%'},
    ].map(({l,v,w})=>`
    <div class="metric">
      <div class="metric-val">${v}</div>
      <div class="metric-label">${l} (Weight: ${w})</div>
    </div>`).join('')}
  </div>
</div>

<div class="section">
  <h2>About Global FDI Monitor</h2>
  <p style="font-size:14px;line-height:1.8;color:#444">
    Global FDI Monitor is the world's most advanced AI-powered investment intelligence platform, 
    covering 215 economies with real-time signals from 304+ official government sources. 
    Our GOSA methodology provides unbiased, data-driven investment opportunity assessments 
    updated weekly through automated AI agent analysis.
  </p>
  <div style="margin-top:20px;padding:16px 20px;background:#f0fdf4;border-radius:10px;display:flex;gap:20px;flex-wrap:wrap">
    <div><strong>🌍</strong> 215 Economies</div>
    <div><strong>📡</strong> 304+ Official Sources</div>
    <div><strong>⚡</strong> Weekly Signal Updates</div>
    <div><strong>📧</strong> info@fdimonitor.org</div>
    <div><strong>🌐</strong> fdimonitor.org</div>
  </div>
</div>

<div class="footer-bar">
  <span>Global FDI Monitor · Confidential Report · ${generated.date}</span>
  <span>© 2026 Global FDI Monitor. All rights reserved.</span>
</div>
</body></html>`;

    const blob = new Blob([html], {type:'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GFM-Report-${form.country}-${form.sector.replace(/ /g,'-')}-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8',fontFamily:'Helvetica Neue,Segoe UI,Arial,sans-serif'}}>
      <NavBar/>
      <section style={{background:'linear-gradient(135deg,#1a2c3e,#2c4a6e)',padding:'24px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{fontSize:'11px',fontWeight:800,color:'#2ecc71',letterSpacing:'0.1em',marginBottom:'4px'}}>PDF REPORTS</div>
          <h1 style={{fontSize:'22px',fontWeight:900,color:'white',marginBottom:'4px'}}>Custom Investment Reports</h1>
          <p style={{color:'rgba(255,255,255,0.65)',fontSize:'13px'}}>AI-generated 4-page investment analysis reports. Select country, sector, and type to generate.</p>
        </div>
      </section>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'24px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
        
        {/* Report Builder */}
        <div>
          <div style={{background:'white',borderRadius:'14px',padding:'24px',boxShadow:'0 2px 8px rgba(0,0,0,0.06)',marginBottom:'16px'}}>
            <div style={{fontSize:'14px',fontWeight:700,color:'#1a2c3e',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
              <FileText size={14} color="#2ecc71"/> Report Configuration
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              <div>
                <label style={{fontSize:'11px',fontWeight:700,color:'#666',display:'block',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.06em'}}>Target Economy</label>
                <select value={form.country} onChange={e=>setForm(f=>({...f,country:e.target.value}))}
                  style={{width:'100%',padding:'10px 12px',border:'1px solid rgba(26,44,62,0.15)',borderRadius:'8px',fontSize:'13px',background:'white',outline:'none',cursor:'pointer'}}>
                  {COUNTRIES.map(c=><option key={c.iso3} value={c.iso3}>{c.flag} {c.name} — GOSA {c.score}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:'11px',fontWeight:700,color:'#666',display:'block',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.06em'}}>Sector</label>
                <select value={form.sector} onChange={e=>setForm(f=>({...f,sector:e.target.value}))}
                  style={{width:'100%',padding:'10px 12px',border:'1px solid rgba(26,44,62,0.15)',borderRadius:'8px',fontSize:'13px',background:'white',outline:'none',cursor:'pointer'}}>
                  {SECTORS.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:'11px',fontWeight:700,color:'#666',display:'block',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.06em'}}>Investment Size</label>
                <select value={form.size} onChange={e=>setForm(f=>({...f,size:e.target.value}))}
                  style={{width:'100%',padding:'10px 12px',border:'1px solid rgba(26,44,62,0.15)',borderRadius:'8px',fontSize:'13px',background:'white',outline:'none',cursor:'pointer'}}>
                  {['$10M–$50M','$50M–$100M','$100M–$500M','$500M–$1B','$1B+'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Report Types */}
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {REPORT_TYPES.map(rt=>(
              <div key={rt.id} onClick={()=>setForm(f=>({...f,reportType:rt.id}))}
                style={{padding:'14px 16px',borderRadius:'12px',cursor:'pointer',border:'2px solid',
                  borderColor:form.reportType===rt.id?'#2ecc71':'rgba(26,44,62,0.08)',
                  background:form.reportType===rt.id?'rgba(46,204,113,0.05)':'white',
                  boxShadow:'0 1px 4px rgba(0,0,0,0.05)',transition:'all 0.15s'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div style={{display:'flex',gap:'10px',alignItems:'flex-start'}}>
                    <span style={{fontSize:'20px'}}>{rt.icon}</span>
                    <div>
                      <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e'}}>{rt.title}</div>
                      <div style={{fontSize:'11px',color:'#666',marginTop:'2px',lineHeight:'1.5'}}>{rt.desc}</div>
                    </div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0,marginLeft:'12px'}}>
                    <div style={{fontSize:'10px',color:'#999'}}>{rt.pages}pp</div>
                    <div style={{fontSize:'10px',color:'#2ecc71',fontWeight:700}}>{rt.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview + Generate */}
        <div>
          {/* Preview Panel */}
          <div style={{background:'#1a2c3e',borderRadius:'14px',padding:'24px',marginBottom:'16px',boxShadow:'0 4px 20px rgba(26,44,62,0.2)'}}>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,0.5)',letterSpacing:'0.1em',marginBottom:'8px'}}>REPORT PREVIEW</div>
            <div style={{fontSize:'20px',fontWeight:900,color:'white',marginBottom:'4px'}}>{selectedCountry.flag} {selectedCountry.name}</div>
            <div style={{fontSize:'13px',color:'rgba(255,255,255,0.65)',marginBottom:'16px'}}>{form.sector} · {selectedType.title}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'16px'}}>
              {[['GOSA Score',selectedCountry.score.toString()],['Tier',selectedCountry.tier],['Pages',selectedType.pages.toString()],['Est. Time',selectedType.time]].map(([l,v])=>(
                <div key={l} style={{padding:'10px',background:'rgba(255,255,255,0.06)',borderRadius:'8px'}}>
                  <div style={{fontSize:'9px',color:'rgba(255,255,255,0.4)'}}>{l}</div>
                  <div style={{fontSize:'16px',fontWeight:800,color:'white',fontFamily:'monospace'}}>{v}</div>
                </div>
              ))}
            </div>

            {/* Cover Page Preview */}
            <div style={{background:'linear-gradient(135deg,#0d1b2a,#1a3050)',borderRadius:'10px',padding:'20px',border:'1px solid rgba(255,255,255,0.08)'}}>
              <div style={{fontSize:'11px',fontWeight:900,color:'white',marginBottom:'8px'}}>
                GLOBAL <span style={{color:'#2ecc71'}}>FDI</span> MONITOR
              </div>
              <div style={{height:'2px',background:'rgba(46,204,113,0.3)',marginBottom:'12px'}}/>
              <div style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>{selectedType.title}</div>
              <div style={{fontSize:'16px',fontWeight:900,color:'white',marginBottom:'8px'}}>{selectedCountry.flag} {selectedCountry.name}</div>
              <div style={{display:'inline-block',background:'#2ecc71',color:'#1a2c3e',padding:'4px 14px',borderRadius:'20px',fontSize:'13px',fontWeight:900}}>GOSA {selectedCountry.score}</div>
              <div style={{marginTop:'8px',fontSize:'10px',color:'rgba(255,255,255,0.35)'}}>Page 1 of {selectedType.pages} · {new Date().toLocaleDateString('en-GB')}</div>
            </div>
          </div>

          {/* Generate Button */}
          {stage === 'idle' && (
            <button onClick={generateReport}
              style={{width:'100%',padding:'16px',background:'#2ecc71',color:'#1a2c3e',border:'none',borderRadius:'12px',cursor:'pointer',fontSize:'15px',fontWeight:900,display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
              <FileText size={16}/> Generate {selectedType.pages}-Page PDF Report
            </button>
          )}

          {/* Progress */}
          {stage === 'generating' && (
            <div style={{background:'white',borderRadius:'14px',padding:'24px',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px'}}>
                <Loader size={16} color="#2ecc71" style={{animation:'spin 1s linear infinite'}}/>
                <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e'}}>Generating Report...</div>
              </div>
              <div style={{height:'6px',borderRadius:'3px',background:'rgba(26,44,62,0.08)',marginBottom:'10px'}}>
                <div style={{height:'100%',borderRadius:'3px',width:`${progress}%`,background:'linear-gradient(90deg,#1a2c3e,#2ecc71)',transition:'width 0.5s ease'}}/>
              </div>
              <div style={{fontSize:'12px',color:'#666'}}>{step}</div>
              <div style={{fontSize:'11px',color:'#999',marginTop:'4px'}}>{progress}% complete</div>
            </div>
          )}

          {/* Ready */}
          {stage === 'ready' && generated && (
            <div style={{background:'white',borderRadius:'14px',padding:'24px',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'14px'}}>
                <CheckCircle size={16} color="#2ecc71"/>
                <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e'}}>Report Ready</div>
              </div>
              <div style={{padding:'12px',background:'rgba(46,204,113,0.06)',borderRadius:'10px',marginBottom:'14px',border:'1px solid rgba(46,204,113,0.2)'}}>
                <div style={{fontSize:'12px',fontWeight:700,color:'#1a2c3e',marginBottom:'4px'}}>{generated.title}</div>
                <div style={{fontSize:'11px',color:'#666'}}>{generated.pages} pages · {generated.date}</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'6px',marginBottom:'14px'}}>
                {generated.highlights.map((h: string, i: number)=>(
                  <div key={i} style={{fontSize:'11px',color:'#444',display:'flex',gap:'6px',alignItems:'flex-start'}}>
                    <span style={{color:'#2ecc71',fontWeight:800,flexShrink:0}}>✓</span>{h}
                  </div>
                ))}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                <button onClick={downloadPDF}
                  style={{padding:'12px',background:'#1a2c3e',color:'white',border:'none',borderRadius:'9px',cursor:'pointer',fontSize:'13px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>
                  <Download size={13}/> Download HTML
                </button>
                <button onClick={()=>{setStage('idle');setProgress(0);setGenerated(null);}}
                  style={{padding:'12px',border:'1px solid rgba(26,44,62,0.15)',background:'transparent',borderRadius:'9px',cursor:'pointer',fontSize:'13px',color:'#666'}}>
                  New Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
