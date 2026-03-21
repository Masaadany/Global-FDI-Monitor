'use client';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Bell, BellOff, Check, Trash2, Filter, Zap, Globe, TrendingUp, AlertTriangle } from 'lucide-react';

interface Alert {
  id: number; type: 'SIGNAL'|'GOSA_CHANGE'|'WATCHLIST'|'SYSTEM';
  grade?: string; title: string; body: string; country?: string; flag?: string;
  read: boolean; time: string; priority: 'HIGH'|'MED'|'LOW'; link: string;
}

const INITIAL_ALERTS: Alert[] = [
  {id:1, type:'SIGNAL',grade:'PLATINUM',title:'PLATINUM Signal: Malaysia FDI cap lifted',body:'FDI cap in Malaysian data centers raised to 100%. SCI Score: 96. AGT-02 verified from MITI Malaysia official source.',country:'Malaysia',flag:'🇲🇾',read:false,time:'2m ago',priority:'HIGH',link:'/signals'},
  {id:2, type:'SIGNAL',grade:'PLATINUM',title:'PLATINUM Signal: UAE Microsoft $3.3B AI investment',body:'Microsoft commits $3.3B to UAE AI data center infrastructure. SCI Score: 97. Verified from DIFC official announcement.',country:'UAE',flag:'🇦🇪',read:false,time:'1h ago',priority:'HIGH',link:'/signals'},
  {id:3, type:'GOSA_CHANGE',title:'GOSA Update: Saudi Arabia +2.1 pts',body:'Saudi Arabia GOSA score increased from 77.0 to 79.1 (+2.1 points). Driver: Policy reform — 30-day license guarantee. New tier: HIGH.',country:'Saudi Arabia',flag:'🇸🇦',read:false,time:'3h ago',priority:'HIGH',link:'/country/SAU'},
  {id:4, type:'WATCHLIST',title:'Watchlist Alert: Vietnam approaching GOSA 80',body:'Vietnam GOSA score is now 79.4, approaching your alert threshold of 80.0. Score has increased +0.5 pts this week.',country:'Vietnam',flag:'🇻🇳',read:true,time:'6h ago',priority:'MED',link:'/watchlists'},
  {id:5, type:'SIGNAL',grade:'GOLD',title:'GOLD Signal: Thailand $2B EV battery package',body:'Thailand BOI approves $2B EV battery subsidy covering 5-year 50% CIT reduction. SCI Score: 95.',country:'Thailand',flag:'🇹🇭',read:true,time:'1d ago',priority:'HIGH',link:'/signals'},
  {id:6, type:'GOSA_CHANGE',title:'GOSA Update: UAE +1.2 pts (weekly update)',body:'UAE GOSA score updated to 82.1 (+1.2 pts). Driven by L4 Market Intelligence improvements: 2 new PLATINUM signals.',country:'UAE',flag:'🇦🇪',read:true,time:'2d ago',priority:'MED',link:'/country/ARE'},
  {id:7, type:'SYSTEM',title:'Weekly Intelligence Brief #47 ready for review',body:'AGT-06 has generated Intelligence Brief #47 for the week of March 16-22. 5 PLATINUM signals included. Awaiting your approval before distribution.',read:false,time:'3d ago',priority:'HIGH',link:'/newsletter'},
  {id:8, type:'SIGNAL',grade:'GOLD',title:'GOLD Signal: Indonesia $15B nickel investment',body:'Chinese-European consortium secures $15B nickel processing expansion. SCI Score: 93. Batam FTZ primary zone.',country:'Indonesia',flag:'🇮🇩',read:true,time:'4d ago',priority:'HIGH',link:'/signals'},
  {id:9, type:'WATCHLIST',title:'Pipeline Alert: UAE deal stage update due',body:'Your UAE AI & Technology deal in pipeline has been in Negotiation stage for 21 days. Time to update?',read:true,time:'5d ago',priority:'LOW',link:'/pipeline'},
  {id:10,type:'SYSTEM',title:'Trial period: 4 days remaining',body:'Your 7-day free trial expires in 4 days. Upgrade to Professional for unlimited access including API, unlimited reports, and weekly Intelligence Brief.',read:false,time:'5d ago',priority:'MED',link:'/pricing'},
];

const TYPE_ICON: Record<string,any> = {
  SIGNAL: <Zap size={14} color="#ffd700"/>,
  GOSA_CHANGE: <TrendingUp size={14} color="#00ffc8"/>,
  WATCHLIST: <Globe size={14} color="#00d4ff"/>,
  SYSTEM: <AlertTriangle size={14} color="#ff4466"/>,
};
const TYPE_COLOR: Record<string,string> = {SIGNAL:'#ffd700',GOSA_CHANGE:'#00ffc8',WATCHLIST:'#00d4ff',SYSTEM:'#ff4466'};
const GRADE_COL: Record<string,string> = {PLATINUM:'#c39bd3',GOLD:'#ffd700',SILVER:'#94a8b3'};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [filter, setFilter] = useState('ALL');
  const [showUnread, setShowUnread] = useState(false);

  const unread = alerts.filter(a=>!a.read).length;

  const filtered = alerts.filter(a => {
    if (showUnread && a.read) return false;
    if (filter !== 'ALL' && a.type !== filter) return false;
    return true;
  });

  function markRead(id: number) { setAlerts(p=>p.map(a=>a.id===id?{...a,read:true}:a)); }
  function markAllRead() { setAlerts(p=>p.map(a=>({...a,read:true}))); }
  function remove(id: number) { setAlerts(p=>p.filter(a=>a.id!==id)); }

  return (
    <div style={{minHeight:'100vh',background:'#020c14',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{background:'linear-gradient(135deg,#020c14,#060f1a)',padding:'20px 24px',borderBottom:'1px solid rgba(0,255,200,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'900px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px',position:'relative'}}>
          <div>
            <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.5)',letterSpacing:'0.2em',marginBottom:'4px',fontFamily:"'Orbitron','Inter',sans-serif"}}>ALERTS CENTRE</div>
            <h1 style={{fontSize:'22px',fontWeight:900,color:'#e8f4f8',display:'flex',alignItems:'center',gap:'10px'}}>
              Notifications
              {unread > 0 && <span style={{fontSize:'13px',fontWeight:900,padding:'2px 10px',borderRadius:'12px',background:'rgba(255,68,102,0.15)',color:'#ff4466',border:'1px solid rgba(255,68,102,0.3)'}}>{unread} unread</span>}
            </h1>
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} style={{display:'flex',alignItems:'center',gap:'7px',padding:'8px 18px',background:'rgba(0,255,200,0.07)',border:'1px solid rgba(0,255,200,0.2)',borderRadius:'9px',cursor:'pointer',fontSize:'12px',fontWeight:700,color:'#00ffc8',fontFamily:"'Inter',sans-serif"}}>
              <Check size={13}/> Mark all read
            </button>
          )}
        </div>
      </div>

      <div style={{maxWidth:'900px',margin:'0 auto',padding:'20px 24px'}}>
        {/* Filters */}
        <div style={{display:'flex',gap:'8px',marginBottom:'14px',flexWrap:'wrap',alignItems:'center'}}>
          {[['ALL','All'],['SIGNAL','Signals'],['GOSA_CHANGE','GOSA Updates'],['WATCHLIST','Watchlist'],['SYSTEM','System']].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)}
              style={{padding:'6px 14px',borderRadius:'20px',border:`1px solid ${filter===v?'rgba(0,255,200,0.3)':'rgba(255,255,255,0.07)'}`,background:filter===v?'rgba(0,255,200,0.08)':'rgba(255,255,255,0.03)',cursor:'pointer',fontSize:'11px',fontWeight:filter===v?700:400,color:filter===v?'#00ffc8':'rgba(232,244,248,0.45)',fontFamily:"'Inter',sans-serif",transition:'all 150ms'}}>
              {l}
            </button>
          ))}
          <button onClick={()=>setShowUnread(!showUnread)}
            style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 14px',borderRadius:'20px',border:`1px solid ${showUnread?'rgba(255,68,102,0.3)':'rgba(255,255,255,0.07)'}`,background:showUnread?'rgba(255,68,102,0.08)':'rgba(255,255,255,0.03)',cursor:'pointer',fontSize:'11px',fontWeight:showUnread?700:400,color:showUnread?'#ff4466':'rgba(232,244,248,0.45)',fontFamily:"'Inter',sans-serif",transition:'all 150ms'}}>
            <Bell size={11}/>{showUnread?'Unread only':'All'}
          </button>
          <span style={{marginLeft:'auto',fontSize:'10px',color:'rgba(232,244,248,0.3)',fontFamily:"'JetBrains Mono',monospace"}}>{filtered.length} alerts</span>
        </div>

        {/* Alert list */}
        <div style={{display:'flex',flexDirection:'column',gap:'7px'}}>
          {filtered.map(alert => {
            const tc = TYPE_COLOR[alert.type];
            return (
              <div key={alert.id} style={{background:alert.read?'rgba(10,22,40,0.5)':'rgba(10,22,40,0.85)',border:`1px solid ${alert.read?'rgba(255,255,255,0.04)':tc+'20'}`,borderLeft:`3px solid ${alert.read?'rgba(255,255,255,0.08)':tc}`,borderRadius:'10px',padding:'14px 16px',transition:'all 200ms ease',position:'relative',overflow:'hidden'}}>
                {!alert.read && <div style={{position:'absolute',top:'12px',right:'14px',width:'7px',height:'7px',borderRadius:'50%',background:tc,boxShadow:`0 0 8px ${tc}`}}/>}
                <div style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
                  <div style={{width:'32px',height:'32px',borderRadius:'8px',background:`${tc}10`,border:`1px solid ${tc}20`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:'2px'}}>
                    {TYPE_ICON[alert.type]}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',gap:'7px',alignItems:'center',marginBottom:'4px',flexWrap:'wrap'}}>
                      {alert.grade && <span style={{fontSize:'9px',fontWeight:800,padding:'1px 7px',borderRadius:'4px',background:GRADE_COL[alert.grade]+'15',color:GRADE_COL[alert.grade],letterSpacing:'0.04em'}}>{alert.grade}</span>}
                      <span style={{fontSize:'9px',fontWeight:700,color:tc+'90',padding:'1px 7px',background:tc+'10',borderRadius:'4px'}}>{alert.type.replace('_',' ')}</span>
                      {alert.flag && <span style={{fontSize:'14px'}}>{alert.flag}</span>}
                      {alert.country && <span style={{fontSize:'11px',color:'rgba(232,244,248,0.6)',fontWeight:600}}>{alert.country}</span>}
                      <span style={{fontSize:'10px',color:'rgba(232,244,248,0.25)',fontFamily:"'JetBrains Mono',monospace",marginLeft:'auto'}}>{alert.time}</span>
                    </div>
                    <div style={{fontSize:'13px',fontWeight:alert.read?500:700,color:alert.read?'rgba(232,244,248,0.6)':'rgba(232,244,248,0.9)',marginBottom:'5px',lineHeight:1.35}}>{alert.title}</div>
                    <div style={{fontSize:'11px',color:'rgba(232,244,248,0.4)',lineHeight:1.65}}>{alert.body}</div>
                    <div style={{display:'flex',gap:'8px',marginTop:'10px'}}>
                      <Link href={alert.link} onClick={()=>markRead(alert.id)} style={{padding:'5px 14px',background:tc+'0a',border:`1px solid ${tc}18`,borderRadius:'6px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:tc}}>
                        View →
                      </Link>
                      {!alert.read && (
                        <button onClick={()=>markRead(alert.id)} style={{display:'flex',alignItems:'center',gap:'4px',padding:'5px 12px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'6px',cursor:'pointer',fontSize:'11px',fontWeight:600,color:'rgba(232,244,248,0.5)',fontFamily:"'Inter',sans-serif"}}>
                          <Check size={10}/>Mark read
                        </button>
                      )}
                      <button onClick={()=>remove(alert.id)} style={{padding:'5px 8px',background:'rgba(255,68,102,0.05)',border:'1px solid rgba(255,68,102,0.12)',borderRadius:'6px',cursor:'pointer',color:'rgba(255,68,102,0.5)',lineHeight:1,marginLeft:'auto'}}
                        onMouseEnter={e=>{e.currentTarget.style.color='#ff4466';e.currentTarget.style.borderColor='rgba(255,68,102,0.25)';}}
                        onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,68,102,0.5)';e.currentTarget.style.borderColor='rgba(255,68,102,0.12)';}}>
                        <Trash2 size={12}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{textAlign:'center',padding:'48px',color:'rgba(232,244,248,0.3)',fontSize:'13px'}}>
              <BellOff size={32} color="rgba(0,255,200,0.2)" style={{display:'block',margin:'0 auto 14px'}}/>
              No alerts to show
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
