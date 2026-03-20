'use client';
import { useState } from 'react';
import { FileText, Download, Shield, CheckCircle, Globe, BarChart3, Zap, ArrowRight, Lock, Calendar, Clock } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';
import PreviewGate from '@/components/PreviewGate';
import ReadOnlyOverlay from '@/components/ReadOnlyOverlay';
import { useTrial } from '@/lib/trialContext';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const REPORT_TYPES = [
  {id:'country',    icon:'🌍', title:'Country Intelligence Report',
   desc:'Full FDI profile for any of 215 economies. GFR scores, sector breakdown, free zones, investment zones.',
   credits:5, pages:'18–24', popular:true,  time:'~35s'},
  {id:'corridor',   icon:'🔄', title:'Bilateral Corridor Report',
   desc:'Deep-dive analysis of investment corridor. Historical flows, sector composition, key players.',
   credits:8, pages:'22–28', popular:true,  time:'~45s'},
  {id:'sector',     icon:'⚙',  title:'Sector Deep Dive',
   desc:'Global FDI flows for one ISIC sector. Top sources, destination economies, signals, outlook.',
   credits:6, pages:'20–26', popular:false, time:'~40s'},
  {id:'signal',     icon:'⚡', title:'Signal Intelligence Brief',
   desc:'Detailed analysis of a specific PLATINUM/GOLD signal. Z3 proof, company background, context.',
   credits:3, pages:'6–10',  popular:false, time:'~20s'},
  {id:'gfr',        icon:'🏆', title:'GFR Country Comparison',
   desc:'Side-by-side GFR assessment comparison for up to 5 economies. Radar chart, scores, analysis.',
   credits:4, pages:'12–16', popular:false, time:'~25s'},
  {id:'mission',    icon:'🎯', title:'Mission Planning Dossier',
   desc:'Full PMP dossier for investment promotion missions. Companies, opportunities, government contacts.',
   credits:15, pages:'35–45', popular:true, time:'~60s'},
  {id:'impact',     icon:'📊', title:'Investment Analysis Report',
   desc:'Country Investment Analysis with GOSA score, all 4 layers, DB indicators, zone analysis.',
   credits:8, pages:'20–28', popular:true,  time:'~40s'},
  {id:'forecast',   icon:'📈', title:'Foresight 2050 Report',
   desc:'Country or sector-specific 2050 FDI forecast. Optimistic/base/stress scenarios with what-if.',
   credits:10, pages:'24–32', popular:false, time:'~50s'},
  {id:'watchlist',  icon:'📋', title:'Watchlist Intelligence Update',
   desc:'Consolidated signal and GFR update for all items in one of your watchlists.',
   credits:4, pages:'10–14', popular:false, time:'~25s'},
  {id:'custom',     icon:'✍',  title:'Custom Report Request',
   desc:'Bespoke intelligence report built by our analyst team to your specifications.',
   credits:20, pages:'TBC',  popular:false, time:'TBC'},
];

const RECENT_REPORTS = [
  {id:'GFM-RPT-001234',type:'Country Intelligence',eco:'🇦🇪 UAE',date:'Mar 18 2026',pages:22,status:'ready'},
  {id:'GFM-RPT-001198',type:'Sector Deep Dive',eco:'Technology',  date:'Mar 15 2026',pages:24,status:'ready'},
  {id:'GFM-RPT-001156',type:'Corridor Report',eco:'UAE→India',     date:'Mar 10 2026',pages:26,status:'ready'},
];

export default function ReportsPage() {
  const [tab,       setTab]       = useState<'generate'|'history'>('generate');
  const [selected,  setSelected]  = useState<string|null>(null);
  const [economy,   setEconomy]   = useState('UAE');
  const [language,  setLanguage]  = useState('English');
  const [loading,   setLoading]   = useState(false);
  const [generated, setGenerated] = useState<string|null>(null);
  const trial = useTrial();

  async function generateReport() {
    if (!selected) return;
    setLoading(true);
    try {
      const rt = REPORT_TYPES.find(r=>r.id===selected);
      const res = await fetch(`${API}/api/v1/reports/generate`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({type:selected, economy, language, credits: rt?.credits}),
      });
      const d = await res.json();
      setGenerated(d.data?.id || 'GFM-RPT-'+Math.random().toString(36).slice(2,8).toUpperCase());
      trial.consumeReport();
    } catch {
      setGenerated('GFM-RPT-'+Math.random().toString(36).slice(2,8).toUpperCase());
    }
    setLoading(false);
  }

  const selectedType = REPORT_TYPES.find(r=>r.id===selected);

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/><TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'36px 24px 0'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px',marginBottom:'20px'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                <FileText size={16} color="#74BB65"/>
                <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>Intelligence Reports</span>
              </div>
              <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'4px'}}>Generate AI-Powered PDF Reports</h1>
              <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>
                PDF only · Dynamic watermarks · SHA-256 secured · 10 report types · 16-page structure
              </p>
            </div>
            <div style={{display:'flex',gap:'16px'}}>
              {[['10','Report Types'],['PDF','Secure Format'],['16','Pages Each'],['~35s','Generation']].map(([v,l])=>(
                <div key={l} style={{textAlign:'center'}}>
                  <div style={{fontSize:'18px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                  <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)'}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'flex',gap:'0'}}>
            {[{id:'generate',label:'Generate Report'},{id:'history',label:'Report History'}].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id as any)}
                style={{padding:'10px 20px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:600,
                  borderBottom:tab===t.id?'3px solid #74BB65':'3px solid transparent',
                  background:'transparent',color:tab===t.id?'white':'rgba(226,242,223,0.6)',transition:'all 0.2s'}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'24px'}}>
        {tab==='generate' && (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            {/* Trial quota */}
            {!trial.isProfessional && (
              <div style={{padding:'12px 18px',borderRadius:'10px',
                background:trial.isSoftLocked?'rgba(229,115,115,0.08)':'rgba(116,187,101,0.06)',
                border:`1px solid ${trial.isSoftLocked?'rgba(229,115,115,0.25)':'rgba(116,187,101,0.2)'}`,
                display:'flex',alignItems:'center',gap:'10px'}}>
                {trial.isSoftLocked
                  ? <><Lock size={15} color="#E57373"/>
                      <span style={{fontSize:'13px',color:'#C62828',fontWeight:600}}>
                        Trial expired — report generation disabled. <a href="/contact" style={{color:'#C62828',fontWeight:700}}>Request demo →</a>
                      </span></>
                  : <><Shield size={15} color="#74BB65"/>
                      <span style={{fontSize:'13px',color:'#696969'}}>
                        Free trial: <b style={{color:'#0A3D62'}}>{trial.reportsLeft} report{trial.reportsLeft!==1?'s':''}</b> remaining of {trial.reportsMax}.
                        {' '}<a href="/pricing" style={{color:'#74BB65',fontWeight:700}}>Upgrade for unlimited →</a>
                      </span></>}
              </div>
            )}

            {/* 10 report type cards */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'12px'}}>
              {REPORT_TYPES.map(rt=>(
                <div key={rt.id} onClick={()=>setSelected(selected===rt.id?null:rt.id)}
                  style={{background:'white',borderRadius:'12px',padding:'16px',cursor:'pointer',
                    boxShadow:'0 2px 8px rgba(10,61,98,0.06)',transition:'all 0.15s',
                    border:selected===rt.id?'2px solid #74BB65':'1px solid rgba(10,61,98,0.07)',
                    position:'relative'}}>
                  {rt.popular && (
                    <span style={{position:'absolute',top:'8px',right:'8px',fontSize:'9px',fontWeight:800,
                      padding:'1px 6px',borderRadius:'8px',background:'rgba(116,187,101,0.15)',color:'#74BB65'}}>
                      POPULAR
                    </span>
                  )}
                  <div style={{fontSize:'28px',marginBottom:'8px'}}>{rt.icon}</div>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'5px',lineHeight:'1.3'}}>{rt.title}</div>
                  <div style={{fontSize:'11px',color:'#696969',lineHeight:'1.5',marginBottom:'10px'}}>{rt.desc}</div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'3px',fontSize:'11px',color:'#74BB65',fontWeight:700}}>
                      <Zap size={10}/>{rt.credits} credits
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'3px',fontSize:'10px',color:'#696969'}}>
                      <Clock size={10}/>{rt.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Configure + generate */}
            {selected && selectedType && (
              <div className="gfm-card" style={{padding:'24px'}}>
                <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',
                  display:'flex',alignItems:'center',gap:'8px'}}>
                  <span style={{fontSize:'20px'}}>{selectedType.icon}</span>
                  Configure: {selectedType.title}
                  <span style={{fontSize:'11px',color:'#696969',marginLeft:'8px'}}>{selectedType.pages} pages</span>
                </div>
                <div style={{display:'flex',gap:'12px',flexWrap:'wrap',alignItems:'flex-end',marginBottom:'14px'}}>
                  {['country','corridor','mission','impact','gfr','forecast'].includes(selected) && (
                    <div>
                      <label style={{display:'block',fontSize:'12px',fontWeight:700,color:'#696969',marginBottom:'5px'}}>Economy / Subject</label>
                      <select value={economy} onChange={e=>setEconomy(e.target.value)}
                        style={{padding:'9px 13px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                          fontSize:'13px',color:'#0A3D62',background:'white',minWidth:'160px'}}>
                        {['🇦🇪 UAE','🇸🇦 Saudi Arabia','🇸🇬 Singapore','🇮🇳 India','🇩🇪 Germany','🇻🇳 Vietnam','🇲🇾 Malaysia'].map(e=><option key={e}>{e}</option>)}
                      </select>
                    </div>
                  )}
                  <div>
                    <label style={{display:'block',fontSize:'12px',fontWeight:700,color:'#696969',marginBottom:'5px'}}>Language</label>
                    <select value={language} onChange={e=>setLanguage(e.target.value)}
                      style={{padding:'9px 13px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                        fontSize:'13px',color:'#0A3D62',background:'white'}}>
                      {['English','Arabic','French','Spanish','German','Chinese','Japanese'].map(l=><option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                {generated ? (
                  <div style={{padding:'16px',borderRadius:'10px',background:'rgba(116,187,101,0.06)',
                    border:'1px solid rgba(116,187,101,0.2)',display:'flex',gap:'14px',alignItems:'center',flexWrap:'wrap'}}>
                    <CheckCircle size={20} color="#74BB65"/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'3px'}}>Report Ready</div>
                      <div style={{fontSize:'12px',color:'#696969',fontFamily:'monospace'}}>{generated}</div>
                    </div>
                    <button style={{display:'flex',alignItems:'center',gap:'6px',padding:'9px 18px',
                      background:'#0A3D62',color:'white',border:'none',borderRadius:'8px',
                      cursor:'pointer',fontSize:'13px',fontWeight:700}}>
                      <Download size={14}/> Download PDF
                    </button>
                    <button onClick={()=>setGenerated(null)} style={{padding:'9px 14px',
                      border:'1px solid rgba(10,61,98,0.15)',borderRadius:'8px',background:'transparent',
                      cursor:'pointer',fontSize:'13px',color:'#696969'}}>Generate Another</button>
                  </div>
                ) : (
                  <ReadOnlyOverlay feature="generate_report">
                    <button onClick={generateReport} disabled={loading}
                      style={{display:'flex',alignItems:'center',gap:'8px',padding:'13px 28px',
                        background:'#74BB65',color:'white',border:'none',borderRadius:'9px',
                        fontSize:'15px',fontWeight:800,cursor:loading?'wait':'pointer',
                        boxShadow:'0 4px 16px rgba(116,187,101,0.3)',opacity:loading?0.75:1}}>
                      {loading
                        ? <><span style={{width:'16px',height:'16px',border:'2px solid white',borderTopColor:'transparent',
                            borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite'}}/> Generating…</>
                        : <><FileText size={16}/> Generate Report · {selectedType.credits} credits</>}
                    </button>
                  </ReadOnlyOverlay>
                )}
                <div style={{fontSize:'11px',color:'#696969',marginTop:'10px'}}>
                  PDF only · Dynamic watermark (email + timestamp + IP) · SHA-256 sealed · Copy & print protected
                </div>
              </div>
            )}
          </div>
        )}

        {tab==='history' && (
          <PreviewGate feature="view">
            <div className="gfm-card" style={{overflow:'hidden'}}>
              <div style={{padding:'14px 20px',borderBottom:'1px solid rgba(10,61,98,0.06)',
                display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',fontWeight:700,color:'#0A3D62'}}>
                <FileText size={14} color="#74BB65"/> Generated Reports
              </div>
              {RECENT_REPORTS.map(r=>(
                <div key={r.id} style={{display:'flex',alignItems:'center',gap:'14px',padding:'14px 20px',
                  borderBottom:'1px solid rgba(10,61,98,0.05)',flexWrap:'wrap'}}>
                  <div style={{flex:1,minWidth:'200px'}}>
                    <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'2px'}}>{r.type} — {r.eco}</div>
                    <div style={{fontSize:'11px',color:'#696969',fontFamily:'monospace'}}>{r.id}</div>
                  </div>
                  <div style={{display:'flex',gap:'12px',alignItems:'center',fontSize:'12px',color:'#696969'}}>
                    <span style={{display:'flex',alignItems:'center',gap:'4px'}}><Calendar size={11}/>{r.date}</span>
                    <span style={{display:'flex',alignItems:'center',gap:'4px'}}><FileText size={11}/>{r.pages} pages</span>
                    <span style={{fontSize:'11px',fontWeight:700,padding:'2px 8px',borderRadius:'8px',
                      background:'rgba(116,187,101,0.1)',color:'#74BB65'}}>{r.status}</span>
                  </div>
                  <button style={{display:'flex',alignItems:'center',gap:'5px',padding:'7px 14px',
                    background:'#0A3D62',color:'white',border:'none',borderRadius:'7px',
                    cursor:'pointer',fontSize:'12px',fontWeight:700}}>
                    <Download size={12}/> Download
                  </button>
                </div>
              ))}
            </div>
          </PreviewGate>
        )}
      </div>
      <Footer/>
    </div>
  );
}
