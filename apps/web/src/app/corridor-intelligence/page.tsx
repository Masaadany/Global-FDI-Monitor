'use client';
import { useState } from 'react';
import { ArrowRight, Globe, TrendingUp, BarChart3, MapPin, Activity, Zap } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import TrialBanner from '@/components/TrialBanner';
import PreviewGate from '@/components/PreviewGate';
import SourceBadge from '@/components/SourceBadge';

const CORRIDORS = [
  {id:'C01',from:'🇺🇸 USA',    to:'🇦🇪 UAE',        vol:'$32.4B',cagr:'18%',signals:24,sector:'Technology',  trend:'↑',  color:'#0A3D62'},
  {id:'C02',from:'🇩🇪 Germany', to:'🇸🇦 Saudi Arabia',vol:'$28.1B',cagr:'15%',signals:18,sector:'Energy',      trend:'↑',  color:'#74BB65'},
  {id:'C03',from:'🇺🇸 USA',    to:'🇨🇳 China',      vol:'$185B', cagr:'12%',signals:41,sector:'Technology',  trend:'↓',  color:'#696969'},
  {id:'C04',from:'🇦🇪 UAE',    to:'🇮🇳 India',      vol:'$98B',  cagr:'22%',signals:31,sector:'Renewables',  trend:'↑',  color:'#1B6CA8'},
  {id:'C05',from:'🇸🇬 SGP',    to:'🇻🇳 Vietnam',    vol:'$74B',  cagr:'18%',signals:22,sector:'Manufacturing',trend:'↑', color:'#74BB65'},
  {id:'C06',from:'🇯🇵 Japan',  to:'🇮🇳 India',      vol:'$62B',  cagr:'15%',signals:19,sector:'Infrastructure',trend:'↑',color:'#0A3D62'},
  {id:'C07',from:'🇬🇧 UK',    to:'🇳🇬 Nigeria',    vol:'$18B',  cagr:'11%',signals:12,sector:'Finance',      trend:'→', color:'#696969'},
  {id:'C08',from:'🇨🇳 China', to:'🇿🇦 South Africa',vol:'$24B', cagr:'9%', signals:15,sector:'Mining',       trend:'→',  color:'#9E9E9E'},
  {id:'C09',from:'🇫🇷 France',to:'🇲🇦 Morocco',     vol:'$14B',  cagr:'14%',signals:11,sector:'Auto',        trend:'↑',  color:'#74BB65'},
  {id:'C10',from:'🇸🇦 Saudi', to:'🇪🇬 Egypt',       vol:'$12B',  cagr:'20%',signals:16,sector:'Energy',      trend:'↑',  color:'#1B6CA8'},
];

const SECTORS_DIST = [
  {name:'Technology',pct:38,color:'#0A3D62'}, {name:'Energy',pct:22,color:'#74BB65'},
  {name:'Manufacturing',pct:16,color:'#1B6CA8'}, {name:'Finance',pct:12,color:'#2E86AB'},
  {name:'Infrastructure',pct:7,color:'#696969'}, {name:'Other',pct:5,color:'#9E9E9E'},
];

export default function CorridorPage() {
  const [active, setActive] = useState<string|null>(null);
  const ac = CORRIDORS.find(c=>c.id===active);

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/><TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'36px 24px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}><Globe size={16} color="#74BB65"/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>Corridor Intelligence</span>
            </div>
            <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'6px'}}>Bilateral FDI Corridors</h1>
            <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>Top 10 investment corridors by signal volume and capital flows.</p>
          </div>
          <div style={{display:'flex',gap:'20px'}}>
            {[['10','Corridors'],['209','Total Signals'],['$548B','Total Volume']].map(([v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:'20px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'24px',display:'grid',gridTemplateColumns:'1fr 340px',gap:'20px',alignItems:'start'}}>
        <div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {CORRIDORS.map((c,i)=>(
              <div key={c.id} onClick={()=>setActive(active===c.id?null:c.id)}
                style={{background:'white',borderRadius:'12px',padding:'16px',cursor:'pointer',
                  boxShadow:'0 2px 8px rgba(10,61,98,0.06)',
                  border:active===c.id?`2px solid ${c.color}`:'1px solid rgba(10,61,98,0.06)',
                  transition:'all 0.15s'}}>
                <div style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
                  <span style={{fontSize:'13px',fontWeight:800,color:c.color,minWidth:'24px',fontFamily:'monospace'}}>#{i+1}</span>
                  <div style={{display:'flex',alignItems:'center',gap:'6px',flex:1,minWidth:'200px'}}>
                    <span style={{fontSize:'14px',fontWeight:600,color:'#0A3D62'}}>{c.from}</span>
                    <ArrowRight size={14} color={c.color}/>
                    <span style={{fontSize:'14px',fontWeight:600,color:'#0A3D62'}}>{c.to}</span>
                  </div>
                  <div style={{display:'flex',gap:'16px',alignItems:'center',flexWrap:'wrap'}}>
                    <div style={{textAlign:'center'}}>
                      <div style={{fontSize:'15px',fontWeight:800,color:'#0A3D62',fontFamily:'monospace'}}>{c.vol}</div>
                      <div style={{fontSize:'10px',color:'#696969'}}>Volume</div>
                    </div>
                    <div style={{textAlign:'center'}}>
                      <div style={{fontSize:'14px',fontWeight:700,color:'#74BB65'}}>{c.cagr}</div>
                      <div style={{fontSize:'10px',color:'#696969'}}>CAGR</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'4px',padding:'4px 10px',borderRadius:'12px',
                      background:`${c.color}10`,color:c.color,fontSize:'11px',fontWeight:700}}>
                      <Zap size={11}/>{c.signals}
                    </div>
                    <span style={{fontSize:'11px',padding:'3px 8px',borderRadius:'8px',
                      background:'rgba(10,61,98,0.06)',color:'#696969'}}>{c.sector}</span>
                    <span style={{fontSize:'16px',fontWeight:800,color:c.trend==='↑'?'#74BB65':c.trend==='↓'?'#E57373':'#696969'}}>{c.trend}</span>
                  </div>
                </div>
                {active===c.id && (
                  <div style={{marginTop:'14px',paddingTop:'14px',borderTop:'1px solid rgba(10,61,98,0.06)'}}>
                    <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
                      {[['Top Sector',c.sector],['CAGR (5yr)',c.cagr],['Active Signals',c.signals],['Volume',c.vol]].map(([l,v])=>(
                        <div key={l} style={{padding:'10px 16px',borderRadius:'8px',background:'rgba(10,61,98,0.03)',border:'1px solid rgba(10,61,98,0.07)',textAlign:'center'}}>
                          <div style={{fontSize:'14px',fontWeight:700,color:c.color,fontFamily:'monospace'}}>{v}</div>
                          <div style={{fontSize:'10px',color:'#696969'}}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'14px',position:'sticky',top:'140px'}}>
          <div style={{background:'white',borderRadius:'12px',padding:'18px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'12px',display:'flex',alignItems:'center',gap:'6px'}}>
              <BarChart3 size={14} color="#74BB65"/> Sector Distribution
            </div>
            {SECTORS_DIST.map(s=>(
              <div key={s.name} style={{marginBottom:'8px'}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',marginBottom:'3px'}}>
                  <span style={{color:'#696969'}}>{s.name}</span>
                  <span style={{fontWeight:700,color:s.color}}>{s.pct}%</span>
                </div>
                <div style={{height:'6px',borderRadius:'3px',background:'rgba(10,61,98,0.06)'}}>
                  <div style={{height:'100%',borderRadius:'3px',width:`${s.pct}%`,background:s.color}}/>
                </div>
              </div>
            ))}
          </div>
          <PreviewGate feature="full_profile">
            <div style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',borderRadius:'12px',padding:'18px',color:'white'}}>
              <div style={{fontSize:'12px',fontWeight:700,color:'#74BB65',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.06em'}}>AI Corridor Insight</div>
              <p style={{fontSize:'12px',lineHeight:'1.6',color:'rgba(226,242,223,0.85)'}}>
                UAE→India corridor grew 22% CAGR driven by renewable energy and digital infrastructure. Technology FDI from USA to UAE surged 45% Q1 2026.
              </p>
            </div>
          </PreviewGate>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
