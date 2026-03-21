'use client';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Star, AlertTriangle } from 'lucide-react';

const ALL_ECONOMIES = [
  {id:'SGP',flag:'🇸🇬',name:'Singapore',    gosa:88.4,trend:+0.2,region:'Asia Pacific',tier:'TOP', color:'#00ffc8'},
  {id:'ARE',flag:'🇦🇪',name:'UAE',          gosa:82.1,trend:+1.2,region:'Middle East', tier:'TOP', color:'#00ffc8'},
  {id:'MYS',flag:'🇲🇾',name:'Malaysia',     gosa:81.2,trend:+0.4,region:'Asia Pacific',tier:'HIGH',color:'#00d4ff'},
  {id:'THA',flag:'🇹🇭',name:'Thailand',     gosa:80.7,trend:+0.2,region:'Asia Pacific',tier:'HIGH',color:'#00d4ff'},
  {id:'VNM',flag:'🇻🇳',name:'Vietnam',      gosa:79.4,trend:+0.5,region:'Asia Pacific',tier:'HIGH',color:'#00d4ff'},
  {id:'SAU',flag:'🇸🇦',name:'Saudi Arabia', gosa:79.1,trend:+2.1,region:'Middle East', tier:'HIGH',color:'#e67e22'},
  {id:'IDN',flag:'🇮🇩',name:'Indonesia',    gosa:77.8,trend:+0.1,region:'Asia Pacific',tier:'HIGH',color:'#00d4ff'},
  {id:'IND',flag:'🇮🇳',name:'India',        gosa:73.2,trend:+0.8,region:'Asia Pacific',tier:'HIGH',color:'#e67e22'},
  {id:'KOR',flag:'🇰🇷',name:'South Korea',  gosa:84.1,trend:+0.1,region:'Asia Pacific',tier:'TOP', color:'#00ffc8'},
  {id:'GBR',flag:'🇬🇧',name:'United Kingdom',gosa:82.5,trend:-0.1,region:'Europe',     tier:'TOP', color:'#00d4ff'},
  {id:'DEU',flag:'🇩🇪',name:'Germany',      gosa:83.1,trend:-0.2,region:'Europe',      tier:'TOP', color:'#00d4ff'},
  {id:'USA',flag:'🇺🇸',name:'United States',gosa:83.9,trend:-0.2,region:'Americas',    tier:'TOP', color:'#00d4ff'},
  {id:'BRA',flag:'🇧🇷',name:'Brazil',       gosa:71.3,trend:+0.4,region:'Americas',    tier:'HIGH',color:'#ffd700'},
  {id:'MAR',flag:'🇲🇦',name:'Morocco',      gosa:66.8,trend:+0.6,region:'Africa',      tier:'HIGH',color:'#ffd700'},
];

interface WatchItem { id: string; addedAt: number; alertGosa: number | null; }

export default function WatchlistsPage() {
  const [watchlist, setWatchlist] = useState<WatchItem[]>([
    {id:'MYS',addedAt:Date.now()-86400000*3,alertGosa:82},
    {id:'VNM',addedAt:Date.now()-86400000*7,alertGosa:80},
    {id:'SAU',addedAt:Date.now()-86400000*1,alertGosa:null},
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [alertId, setAlertId] = useState<string|null>(null);
  const [alertVal, setAlertVal] = useState('');

  function addToWatch(id: string) {
    if (!watchlist.find(w=>w.id===id)) {
      setWatchlist(w=>[...w,{id,addedAt:Date.now(),alertGosa:null}]);
    }
    setShowAdd(false);
  }

  function removeWatch(id: string) { setWatchlist(w=>w.filter(x=>x.id!==id)); }

  function setAlert(id: string) {
    const val = parseFloat(alertVal);
    if (!isNaN(val) && val > 0 && val <= 100) {
      setWatchlist(w=>w.map(x=>x.id===id?{...x,alertGosa:val}:x));
      setAlertId(null); setAlertVal('');
    }
  }

  const watchedEconomies = watchlist.map(w => ({
    ...ALL_ECONOMIES.find(e=>e.id===w.id)!,
    addedAt: w.addedAt,
    alertGosa: w.alertGosa,
  })).filter(Boolean);

  const unwatched = ALL_ECONOMIES.filter(e=>!watchlist.find(w=>w.id===e.id));

  return (
    <div style={{minHeight:'100vh',background:'#020c14',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>

      <div style={{background:'linear-gradient(135deg,#020c14,#060f1a)',padding:'24px',borderBottom:'1px solid rgba(0,255,200,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'1100px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px',position:'relative'}}>
          <div>
            <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.5)',letterSpacing:'0.2em',marginBottom:'4px',fontFamily:"'Orbitron','Inter',sans-serif"}}>WATCHLISTS</div>
            <h1 style={{fontSize:'22px',fontWeight:900,color:'#e8f4f8'}}>Economy Watchlist</h1>
            <p style={{fontSize:'12px',color:'rgba(232,244,248,0.4)'}}>Track economies, set GOSA alert thresholds</p>
          </div>
          <button onClick={()=>setShowAdd(!showAdd)}
            style={{display:'flex',alignItems:'center',gap:'8px',padding:'10px 20px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'#020c14',border:'none',borderRadius:'9px',cursor:'pointer',fontSize:'13px',fontWeight:800,fontFamily:"'Inter',sans-serif",boxShadow:'0 4px 16px rgba(0,255,200,0.25)'}}>
            <Plus size={14}/> Add Economy
          </button>
        </div>
      </div>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'24px'}}>
        {/* Add panel */}
        {showAdd && (
          <div style={{background:'rgba(10,22,40,0.9)',border:'1px solid rgba(0,255,200,0.15)',borderRadius:'12px',padding:'16px',marginBottom:'16px',boxShadow:'0 8px 32px rgba(0,0,0,0.4)'}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'rgba(0,255,200,0.6)',marginBottom:'12px',textTransform:'uppercase',letterSpacing:'0.1em'}}>Add to Watchlist</div>
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              {unwatched.map(e => (
                <button key={e.id} onClick={()=>addToWatch(e.id)}
                  style={{padding:'7px 14px',background:'rgba(0,255,200,0.05)',border:'1px solid rgba(0,255,200,0.15)',borderRadius:'20px',cursor:'pointer',fontSize:'12px',fontWeight:600,color:'#00ffc8',fontFamily:"'Inter',sans-serif",display:'flex',alignItems:'center',gap:'6px',transition:'all 150ms'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,255,200,0.1)';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,255,200,0.05)';}}>
                  {e.flag} {e.name} <span style={{fontSize:'10px',color:'rgba(0,255,200,0.5)',fontFamily:"'JetBrains Mono',monospace"}}>{e.gosa}</span>
                </button>
              ))}
              {unwatched.length === 0 && <span style={{fontSize:'12px',color:'rgba(232,244,248,0.4)'}}>All economies are already in your watchlist</span>}
            </div>
          </div>
        )}

        {/* Watchlist items */}
        {watchedEconomies.length === 0 && (
          <div style={{background:'rgba(10,22,40,0.6)',borderRadius:'14px',padding:'56px',textAlign:'center',border:'1px solid rgba(0,180,216,0.08)'}}>
            <Star size={36} color="rgba(0,255,200,0.3)" style={{display:'block',margin:'0 auto 16px'}}/>
            <div style={{fontSize:'16px',fontWeight:700,color:'rgba(232,244,248,0.6)',marginBottom:'8px'}}>Your watchlist is empty</div>
            <div style={{fontSize:'13px',color:'rgba(232,244,248,0.35)',marginBottom:'20px'}}>Add economies to track their GOSA scores and set alert thresholds</div>
            <button onClick={()=>setShowAdd(true)} style={{padding:'10px 24px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'#020c14',border:'none',borderRadius:'9px',cursor:'pointer',fontSize:'13px',fontWeight:800,fontFamily:"'Inter',sans-serif"}}>
              Add First Economy
            </button>
          </div>
        )}

        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          {watchedEconomies.map(ec => {
            const daysAgo = Math.floor((Date.now()-ec.addedAt)/86400000);
            const alertTriggered = ec.alertGosa && ec.gosa >= ec.alertGosa;
            return (
              <div key={ec.id} style={{background:'rgba(10,22,40,0.8)',border:`1px solid ${alertTriggered?'rgba(0,255,200,0.25)':'rgba(0,180,216,0.1)'}`,borderRadius:'12px',padding:'16px 20px',position:'relative',overflow:'hidden'}}>
                {alertTriggered && <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,#00ffc8,transparent)'}}/>}
                <div style={{display:'flex',alignItems:'center',gap:'16px',flexWrap:'wrap'}}>
                  <span style={{fontSize:'32px'}}>{ec.flag}</span>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'3px'}}>
                      <Link href={'/country/'+ec.id} style={{fontSize:'16px',fontWeight:800,color:'#e8f4f8',textDecoration:'none'}}>{ec.name}</Link>
                      <span style={{fontSize:'8px',fontWeight:800,padding:'2px 7px',borderRadius:'8px',background:ec.tier==='TOP'?'rgba(0,255,200,0.08)':'rgba(0,180,216,0.08)',color:ec.tier==='TOP'?'#00ffc8':'#00b4d8',border:`1px solid ${ec.tier==='TOP'?'rgba(0,255,200,0.2)':'rgba(0,180,216,0.2)'}`}}>{ec.tier}</span>
                      {alertTriggered && <span style={{fontSize:'9px',fontWeight:800,color:'#00ffc8',padding:'2px 8px',background:'rgba(0,255,200,0.1)',border:'1px solid rgba(0,255,200,0.25)',borderRadius:'8px',display:'flex',alignItems:'center',gap:'4px'}}><Bell size={9}/>ALERT MET</span>}
                    </div>
                    <div style={{fontSize:'11px',color:'rgba(232,244,248,0.4)'}}>{ec.region} · Added {daysAgo===0?'today':daysAgo===1?'yesterday':`${daysAgo} days ago`}</div>
                  </div>
                  {/* GOSA score */}
                  <div style={{textAlign:'center',padding:'8px 16px',background:'rgba(0,255,200,0.05)',border:'1px solid rgba(0,255,200,0.12)',borderRadius:'10px'}}>
                    <div style={{fontSize:'8px',color:'rgba(0,255,200,0.4)',marginBottom:'2px',letterSpacing:'0.08em'}}>GOSA</div>
                    <div style={{fontSize:'28px',fontWeight:900,color:'#00ffc8',fontFamily:"'JetBrains Mono',monospace",textShadow:'0 0 14px rgba(0,255,200,0.4)',lineHeight:1}}>{ec.gosa}</div>
                    <div style={{fontSize:'9px',color:ec.trend>0?'#00ffc8':'#ff4466',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:'2px'}}>
                      {ec.trend>0?<TrendingUp size={9}/>:<TrendingDown size={9}/>}{ec.trend>0?'+':''}{ec.trend}
                    </div>
                  </div>
                  {/* Alert */}
                  <div style={{textAlign:'center',minWidth:'120px'}}>
                    {alertId === ec.id ? (
                      <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
                        <input type="number" min="0" max="100" step="0.1" placeholder="e.g. 82" value={alertVal} onChange={e=>setAlertVal(e.target.value)}
                          onKeyDown={e=>{if(e.key==='Enter')setAlert(ec.id);if(e.key==='Escape'){setAlertId(null);setAlertVal('');}}}
                          style={{width:'70px',padding:'6px 9px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(0,255,200,0.25)',borderRadius:'7px',fontSize:'12px',color:'#e8f4f8',outline:'none',fontFamily:"'Inter',sans-serif"}}
                          autoFocus/>
                        <button onClick={()=>setAlert(ec.id)} style={{padding:'6px 10px',background:'rgba(0,255,200,0.1)',border:'1px solid rgba(0,255,200,0.25)',borderRadius:'7px',cursor:'pointer',fontSize:'11px',fontWeight:700,color:'#00ffc8',fontFamily:"'Inter',sans-serif"}}>Set</button>
                      </div>
                    ) : (
                      <button onClick={()=>{setAlertId(ec.id);setAlertVal(ec.alertGosa?.toString()||'');}}
                        style={{padding:'6px 12px',background:ec.alertGosa?'rgba(255,215,0,0.08)':'rgba(255,255,255,0.04)',border:`1px solid ${ec.alertGosa?'rgba(255,215,0,0.2)':'rgba(255,255,255,0.08)'}`,borderRadius:'7px',cursor:'pointer',fontSize:'11px',fontWeight:600,color:ec.alertGosa?'#ffd700':'rgba(232,244,248,0.45)',fontFamily:"'Inter',sans-serif",display:'flex',alignItems:'center',gap:'5px'}}>
                        <Bell size={11}/>{ec.alertGosa?`Alert ≥ ${ec.alertGosa}`:'Set Alert'}
                      </button>
                    )}
                  </div>
                  {/* Actions */}
                  <div style={{display:'flex',gap:'7px'}}>
                    <Link href={'/country/'+ec.id} style={{padding:'7px 13px',background:'rgba(0,180,216,0.06)',border:'1px solid rgba(0,180,216,0.18)',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'#00b4d8'}}>Profile</Link>
                    <button onClick={()=>removeWatch(ec.id)} style={{padding:'7px 10px',background:'rgba(255,68,102,0.06)',border:'1px solid rgba(255,68,102,0.15)',borderRadius:'7px',cursor:'pointer',color:'#ff4466',lineHeight:1}}>
                      <Trash2 size={13}/>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
