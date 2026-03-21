'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ScrollableSelect from '@/components/ScrollableSelect';
import Link from 'next/link';
import { ArrowRight, Globe, TrendingUp, Zap } from 'lucide-react';

const CORRIDORS = [
  {from:'China',to:'Vietnam',fromFlag:'🇨🇳',toFlag:'🇻🇳',flow:'$8.2B',momentum:'HOT',    color:'#00ffc8', sectors:['Electronics','EV Battery','Textiles'],  gosaFrom:64,gosaTo:79.4,driver:'China+1 relocation — Samsung, Intel suppliers relocating manufacturing',  growth:'+34%',signals:4},
  {from:'Japan',to:'Vietnam',fromFlag:'🇯🇵',toFlag:'🇻🇳',flow:'$5.1B',momentum:'RISING',  color:'#00d4ff', sectors:['Auto Parts','Electronics','Retail'],      gosaFrom:81.4,gosaTo:79.4,driver:'Japan ASEAN diversification strategy, Toyota supply chain, convenience retail',growth:'+18%',signals:2},
  {from:'USA',  to:'India',  fromFlag:'🇺🇸',toFlag:'🇮🇳',flow:'$6.8B',momentum:'RISING',  color:'#ffd700', sectors:['Semiconductors','AI','Pharma'],           gosaFrom:83.9,gosaTo:73.2,driver:'Apple India expansion, semiconductor PLI, US-India technology partnership',  growth:'+28%',signals:3},
  {from:'Europe',to:'UAE',   fromFlag:'🇪🇺',toFlag:'🇦🇪',flow:'$4.4B',momentum:'HOT',    color:'#00ffc8', sectors:['Finance','Logistics','AI Data Centers'],  gosaFrom:85,gosaTo:82.1,driver:'UAE as European HQ for MEA operations, DIFC financial cluster growth',        growth:'+22%',signals:3},
  {from:'Korea',to:'Indonesia',fromFlag:'🇰🇷',toFlag:'🇮🇩',flow:'$3.8B',momentum:'RISING',color:'#e67e22', sectors:['EV Battery','Steel','Electronics'],       gosaFrom:84.1,gosaTo:77.8,driver:'Korean battery manufacturers — LG, Samsung SDI in Batam and Karawang',        growth:'+41%',signals:2},
  {from:'USA',  to:'UAE',    fromFlag:'🇺🇸',toFlag:'🇦🇪',flow:'$7.2B',momentum:'HOT',    color:'#9b59b6', sectors:['AI Infrastructure','Finance','Defence'],   gosaFrom:83.9,gosaTo:82.1,driver:'Microsoft $3.3B AI commitment, AWS expansion, hyperscaler MEA hub strategy',    growth:'+55%',signals:4},
  {from:'Saudi Arabia',to:'Morocco',fromFlag:'🇸🇦',toFlag:'🇲🇦',flow:'$2.1B',momentum:'RISING',color:'#ffd700',sectors:['Renewables','Real Estate','Finance'],gosaFrom:79.1,gosaTo:66.8,driver:'PIF Morocco strategy, Islamic finance expansion, North Africa bridge',            growth:'+19%',signals:1},
  {from:'Singapore',to:'Malaysia',fromFlag:'🇸🇬',toFlag:'🇲🇾',flow:'$5.8B',momentum:'HOT',color:'#00ffc8',sectors:['Data Centers','Semiconductors','Fintech'], gosaFrom:88.4,gosaTo:81.2,driver:'Singapore land scarcity driving data center spillover, JB-Singapore Special Economic Zone',growth:'+38%',signals:3},
  {from:'China',to:'Saudi Arabia',fromFlag:'🇨🇳',toFlag:'🇸🇦',flow:'$4.9B',momentum:'RISING',color:'#e67e22',sectors:['EV','Renewables','Infrastructure'],  gosaFrom:64,gosaTo:79.1,driver:'Saudi Vision 2030 China-Saudi partnerships, CATL battery, NEOM construction',     growth:'+31%',signals:2},
  {from:'India',to:'UAE',    fromFlag:'🇮🇳',toFlag:'🇦🇪',flow:'$3.2B',momentum:'STABLE',  color:'#00d4ff', sectors:['IT Services','Finance','Real Estate'],    gosaFrom:73.2,gosaTo:82.1,driver:'Indian diaspora investment, GIFT City-ADGM linkage, IT firm regional HQs',       growth:'+12%',signals:1},
  {from:'Germany',to:'Vietnam',fromFlag:'🇩🇪',toFlag:'🇻🇳',flow:'$1.9B',momentum:'RISING',color:'#9b59b6',sectors:['Auto Parts','Machinery','Electronics'],   gosaFrom:83.1,gosaTo:79.4,driver:'German auto supply chain diversification from China, VW and BMW suppliers',     growth:'+24%',signals:1},
  {from:'Japan',to:'Thailand',fromFlag:'🇯🇵',toFlag:'🇹🇭',flow:'$4.2B',momentum:'STABLE', color:'#00ffc8', sectors:['Automotive','Electronics','Retail'],      gosaFrom:81.4,gosaTo:80.7,driver:'50yr Japan-Thailand investment relationship, auto cluster Toyota and Honda',   growth:'+8%', signals:2},
];

const MOMENTUM_STYLE: Record<string,{bg:string,c:string}> = {
  HOT:   {bg:'rgba(0,255,200,0.1)', c:'#00ffc8'},
  RISING:{bg:'rgba(255,215,0,0.1)', c:'#ffd700'},
  STABLE:{bg:'rgba(0,180,216,0.1)', c:'#00b4d8'},
};

const ALL_COUNTRIES = [...new Set([...CORRIDORS.map(c=>c.from),...CORRIDORS.map(c=>c.to)])].sort();

export default function CorridorsPage() {
  const [filterOrigin, setFilterOrigin] = useState('ALL');
  const [filterDest, setFilterDest] = useState('ALL');
  const [filterMom, setFilterMom] = useState('ALL');
  const [selected, setSelected] = useState<typeof CORRIDORS[0]|null>(null);

  const filtered = CORRIDORS.filter(c => {
    if (filterOrigin !== 'ALL' && c.from !== filterOrigin && c.to !== filterOrigin) return false;
    if (filterDest !== 'ALL' && c.to !== filterDest && c.from !== filterDest) return false;
    if (filterMom !== 'ALL' && c.momentum !== filterMom) return false;
    return true;
  });

  const countryOpts = [{value:'ALL',label:'All Economies'}, ...ALL_COUNTRIES.map(c=>({value:c,label:c}))];

  return (
    <div style={{minHeight:'100vh',background:'#020c14',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>

      <div style={{background:'linear-gradient(135deg,#020c14,#060f1a)',padding:'28px 24px',borderBottom:'1px solid rgba(0,255,200,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'1540px',margin:'0 auto',position:'relative'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.5)',letterSpacing:'0.2em',marginBottom:'6px',fontFamily:"'Orbitron','Inter',sans-serif"}}>CORRIDOR INTELLIGENCE</div>
          <h1 style={{fontSize:'28px',fontWeight:900,color:'#e8f4f8',marginBottom:'6px'}}>Bilateral FDI Corridor Monitor</h1>
          <p style={{fontSize:'13px',color:'rgba(232,244,248,0.45)'}}>12 active corridors · Live flow data · Sector mapping · Strategic drivers</p>
        </div>
      </div>

      <div style={{maxWidth:'1540px',margin:'0 auto',padding:'20px 24px'}}>
        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'16px'}}>
          {[
            [CORRIDORS.length,'Active Corridors','All bilateral routes','#00ffc8'],
            [CORRIDORS.filter(c=>c.momentum==='HOT').length,'HOT Corridors','Accelerating flows','#00ffc8'],
            ['$63B','Total Corridor Flow','Annual FDI tracked','#ffd700'],
            [CORRIDORS.reduce((a,c)=>a+c.signals,0)+'','Active Signals','Across all corridors','#9b59b6'],
          ].map(([v,l,s,c]) => (
            <div key={String(l)} style={{padding:'16px',background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.1)',borderRadius:'12px',borderTop:'2px solid '+c}}>
              <div style={{fontSize:'9px',color:'rgba(232,244,248,0.3)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'5px'}}>{l as string}</div>
              <div style={{fontSize:'26px',fontWeight:900,color:String(c),fontFamily:"'JetBrains Mono',monospace"}}>{v}</div>
              <div style={{fontSize:'10px',color:'rgba(232,244,248,0.3)',marginTop:'2px'}}>{s as string}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.1)',borderRadius:'12px',padding:'12px 16px',marginBottom:'14px',display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'flex-end'}}>
          <ScrollableSelect label="Origin Country" value={filterOrigin} onChange={setFilterOrigin} width="170px" options={countryOpts} accentColor="#00ffc8"/>
          <ScrollableSelect label="Destination" value={filterDest} onChange={setFilterDest} width="170px" options={countryOpts} accentColor="#00d4ff"/>
          <ScrollableSelect label="Momentum" value={filterMom} onChange={setFilterMom} width="130px" options={[{value:'ALL',label:'All'},{value:'HOT',label:'HOT'},{value:'RISING',label:'RISING'},{value:'STABLE',label:'STABLE'}]} accentColor="#ffd700"/>
          <span style={{marginLeft:'auto',fontSize:'10px',color:'rgba(232,244,248,0.3)',fontFamily:"'JetBrains Mono',monospace",paddingBottom:'1px'}}>{filtered.length} corridors</span>
        </div>

        {/* Corridor grid */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
          {filtered.map(cor => {
            const ms = MOMENTUM_STYLE[cor.momentum];
            const isSel = selected?.from===cor.from && selected?.to===cor.to;
            return (
              <div key={cor.from+cor.to}
                onClick={() => setSelected(isSel ? null : cor)}
                style={{background:isSel?'rgba(10,28,46,0.95)':'rgba(10,22,40,0.7)',border:`1px solid ${isSel?cor.color+'30':'rgba(0,180,216,0.1)'}`,borderRadius:'14px',overflow:'hidden',cursor:'pointer',transition:'all 200ms ease',boxShadow:isSel?`0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${cor.color}15`:'none'}}
                onMouseEnter={e=>{if(!isSel){e.currentTarget.style.borderColor=cor.color+'20';e.currentTarget.style.transform='translateY(-2px)'}}}
                onMouseLeave={e=>{if(!isSel){e.currentTarget.style.borderColor='rgba(0,180,216,0.1)';e.currentTarget.style.transform='none'}}}>
                <div style={{padding:'16px 18px'}}>
                  {/* Header */}
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'6px',flex:1}}>
                      <span style={{fontSize:'24px'}}>{cor.fromFlag}</span>
                      <div>
                        <div style={{fontSize:'13px',fontWeight:700,color:'rgba(232,244,248,0.8)'}}>{cor.from}</div>
                        <div style={{fontSize:'9px',color:'rgba(232,244,248,0.35)'}}>Origin</div>
                      </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'3px',flexShrink:0}}>
                      <div style={{fontSize:'14px',fontWeight:900,color:cor.color,fontFamily:"'JetBrains Mono',monospace"}}>{cor.flow}</div>
                      <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
                        <div style={{width:'40px',height:'2px',background:`linear-gradient(90deg, ${cor.color}60, ${cor.color})`,borderRadius:'1px'}}/>
                        <ArrowRight size={12} color={cor.color}/>
                      </div>
                      <span style={{fontSize:'8px',fontWeight:800,padding:'2px 6px',borderRadius:'8px',background:ms.bg,color:ms.c,letterSpacing:'0.04em'}}>{cor.momentum}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'6px',flex:1,justifyContent:'flex-end'}}>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontSize:'13px',fontWeight:700,color:'rgba(232,244,248,0.8)'}}>{cor.to}</div>
                        <div style={{fontSize:'9px',color:'rgba(232,244,248,0.35)'}}>Destination</div>
                      </div>
                      <span style={{fontSize:'24px'}}>{cor.toFlag}</span>
                    </div>
                  </div>
                  {/* Driver */}
                  <div style={{fontSize:'12px',color:'rgba(232,244,248,0.55)',lineHeight:1.6,marginBottom:'10px'}}>{cor.driver}</div>
                  {/* Sectors */}
                  <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'10px'}}>
                    {cor.sectors.map(s => (
                      <span key={s} style={{fontSize:'10px',padding:'2px 8px',background:cor.color+'0a',border:`1px solid ${cor.color}20`,borderRadius:'10px',color:cor.color+'90',fontWeight:600}}>{s}</span>
                    ))}
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{display:'flex',gap:'12px'}}>
                      <span style={{fontSize:'10px',color:'rgba(232,244,248,0.35)'}}>Growth: <b style={{color:'#00ffc8',fontFamily:"'JetBrains Mono',monospace"}}>{cor.growth}</b></span>
                      <span style={{fontSize:'10px',color:'rgba(232,244,248,0.35)'}}>Signals: <b style={{color:'#9b59b6',fontFamily:"'JetBrains Mono',monospace"}}>{cor.signals}</b></span>
                    </div>
                    <span style={{fontSize:'10px',color:cor.color+'80',fontWeight:600}}>{isSel?'▲ Less':'▼ Details'}</span>
                  </div>
                </div>

                {/* Expanded */}
                {isSel && (
                  <div style={{borderTop:'1px solid rgba(0,255,200,0.06)',padding:'14px 18px',background:'rgba(0,0,0,0.2)'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'12px'}}>
                      {[
                        [`GOSA ${cor.from}`,cor.gosaFrom,cor.color],
                        [`GOSA ${cor.to}`,cor.gosaTo,cor.color],
                        ['Annual Flow',cor.flow,'#ffd700'],
                        ['YoY Growth',cor.growth,'#00ffc8'],
                      ].map(([l,v,c]) => (
                        <div key={String(l)} style={{padding:'10px',background:'rgba(255,255,255,0.03)',borderRadius:'8px'}}>
                          <div style={{fontSize:'9px',color:'rgba(232,244,248,0.3)',marginBottom:'3px',textTransform:'uppercase',letterSpacing:'0.06em'}}>{l as string}</div>
                          <div style={{fontSize:'16px',fontWeight:900,color:String(c),fontFamily:"'JetBrains Mono',monospace"}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:'flex',gap:'8px'}}>
                      <Link href="/signals" style={{flex:1,padding:'7px',background:'rgba(0,255,200,0.06)',border:'1px solid rgba(0,255,200,0.15)',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'#00ffc8',textAlign:'center'}}>View Signals</Link>
                      <Link href="/reports" style={{flex:1,padding:'7px',background:'rgba(255,215,0,0.06)',border:'1px solid rgba(255,215,0,0.15)',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'#ffd700',textAlign:'center'}}>Generate Report</Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
