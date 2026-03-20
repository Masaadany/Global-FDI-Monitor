'use client';
import { useState } from 'react';
import { Bell, BellOff, CheckCircle, X, Zap, Globe, Settings, Plus, ArrowRight, Filter } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';
import PreviewGate from '@/components/PreviewGate';
import Link from 'next/link';

const ALERTS = [
  {id:'A001',pri:'HIGH',   type:'Signal',    title:'PLATINUM: CATL $3.2B greenfield in Indonesia',   eco:'🇮🇩 Indonesia', time:'2h ago',  read:false},
  {id:'A002',pri:'HIGH',   type:'Signal',    title:'PLATINUM: Google Data Centre $2.1B in Singapore', eco:'🇸🇬 Singapore', time:'5h ago',  read:false},
  {id:'A003',pri:'MEDIUM', type:'GFR',       title:'UAE GFR score updated: 94.2 → 94.6 (+0.4)',        eco:'🇦🇪 UAE',       time:'1d ago',  read:false},
  {id:'A004',pri:'MEDIUM', type:'Signal',    title:'GOLD: Hyundai Motor $1.8B expansion in Indonesia', eco:'🇮🇩 Indonesia', time:'1d ago',  read:true},
  {id:'A005',pri:'LOW',    type:'Watchlist', title:'ASEAN Emerging watchlist: 8 new signals',           eco:'ASEAN',        time:'2d ago',  read:true},
  {id:'A006',pri:'LOW',    type:'GFR',       title:'Saudi Arabia GFR tier change: HIGH → VERY HIGH',   eco:'🇸🇦 S. Arabia', time:'3d ago',  read:true},
  {id:'A007',pri:'HIGH',   type:'Signal',    title:'PLATINUM: Microsoft Azure $5.2B UAE expansion',    eco:'🇦🇪 UAE',       time:'4d ago',  read:true},
];

const RULES = [
  {id:'R001',name:'PLATINUM Signals — MENA',       type:'Signal',    active:true,  criteria:'Grade = PLATINUM AND Region = MENA'},
  {id:'R002',name:'GFR Score Changes — ASEAN',     type:'GFR',       active:true,  criteria:'GFR change > 0.3 AND Region = ASEAN'},
  {id:'R003',name:'All GOLD+ — Technology sector', type:'Signal',    active:false, criteria:'Grade >= GOLD AND Sector = Technology'},
];

const PRI_C: Record<string,string> = {HIGH:'#E57373',MEDIUM:'#FFB347',LOW:'#74BB65'};
const PRI_BG: Record<string,string> = {HIGH:'rgba(229,115,115,0.08)',MEDIUM:'rgba(255,179,71,0.08)',LOW:'rgba(116,187,101,0.08)'};
const TYPE_ICON: Record<string,any> = {Signal:Zap, GFR:Globe, Watchlist:Bell};

export default function AlertsPage() {
  const [tab,   setTab]   = useState<'inbox'|'rules'>('inbox');
  const [filter,setFilter]= useState('All');
  const [alerts,setAlerts]= useState(ALERTS);
  const [rules, setRules] = useState(RULES);

  const unread = alerts.filter(a=>!a.read).length;
  const filtered = filter==='All' ? alerts : alerts.filter(a=>a.pri===filter||a.type===filter);

  function markRead(id:string) {
    setAlerts(a=>a.map(x=>x.id===id?{...x,read:true}:x));
  }
  function markAllRead() {
    setAlerts(a=>a.map(x=>({...x,read:true})));
  }
  function toggleRule(id:string) {
    setRules(r=>r.map(x=>x.id===id?{...x,active:!x.active}:x));
  }

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/><TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'28px 24px 0'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'12px',marginBottom:'20px'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
                <Bell size={16} color="#74BB65"/>
                <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>Alerts</span>
                {unread>0 && <span style={{background:'#E57373',color:'white',fontSize:'10px',fontWeight:800,
                  width:'18px',height:'18px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {unread}
                </span>}
              </div>
              <h1 style={{fontSize:'22px',fontWeight:800,color:'white',margin:0}}>Alerts & Notifications</h1>
            </div>
            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={markAllRead} style={{display:'flex',alignItems:'center',gap:'5px',
                padding:'8px 14px',border:'1px solid rgba(255,255,255,0.25)',borderRadius:'8px',
                background:'transparent',cursor:'pointer',fontSize:'12px',fontWeight:600,color:'rgba(226,242,223,0.8)'}}>
                <CheckCircle size={12}/> Mark all read
              </button>
            </div>
          </div>
          <div style={{display:'flex',gap:'0'}}>
            {[{id:'inbox',label:`Inbox (${unread} unread)`},{id:'rules',label:'Alert Rules'}].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id as any)}
                style={{padding:'10px 18px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:600,
                  background:'transparent',color:tab===t.id?'white':'rgba(226,242,223,0.6)',
                  borderBottom:tab===t.id?'3px solid #74BB65':'3px solid transparent',transition:'all 0.2s'}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'20px 24px',display:'flex',flexDirection:'column',gap:'14px'}}>
        {tab==='inbox' && (
          <>
            {/* Filter chips */}
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap',alignItems:'center'}}>
              <Filter size={13} color="#696969"/>
              {['All','HIGH','MEDIUM','LOW','Signal','GFR','Watchlist'].map(f=>(
                <button key={f} onClick={()=>setFilter(f)}
                  style={{padding:'5px 12px',borderRadius:'16px',border:'none',cursor:'pointer',
                    fontSize:'11px',fontWeight:700,
                    background:filter===f?'#0A3D62':'rgba(10,61,98,0.07)',
                    color:filter===f?'white':'#0A3D62'}}>
                  {f}
                </button>
              ))}
              <span style={{fontSize:'12px',color:'#696969',marginLeft:'4px'}}>{filtered.length} alerts</span>
            </div>

            <PreviewGate feature="view">
              <div className="gfm-card" style={{overflow:'hidden'}}>
                {filtered.map((alert,i)=>{
                  const Icon = TYPE_ICON[alert.type] || Bell;
                  return (
                    <div key={alert.id}
                      onClick={()=>markRead(alert.id)}
                      style={{display:'flex',alignItems:'flex-start',gap:'12px',padding:'14px 18px',
                        borderBottom:i<filtered.length-1?'1px solid rgba(10,61,98,0.05)':'none',
                        cursor:'pointer',background:!alert.read?PRI_BG[alert.pri]:'white',
                        transition:'background 0.15s'}}>
                      {!alert.read && (
                        <div style={{width:'8px',height:'8px',borderRadius:'50%',flexShrink:0,
                          background:PRI_C[alert.pri],marginTop:'6px'}}/>
                      )}
                      {alert.read && <div style={{width:'8px',flexShrink:0}}/>}
                      <div style={{width:'32px',height:'32px',borderRadius:'8px',flexShrink:0,
                        background:`${PRI_C[alert.pri]}15`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <Icon size={14} color={PRI_C[alert.pri]}/>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',gap:'8px',alignItems:'center',marginBottom:'3px',flexWrap:'wrap'}}>
                          <span style={{fontSize:'13px',fontWeight:alert.read?600:700,color:'#0A3D62',lineHeight:'1.3'}}>{alert.title}</span>
                          <span style={{fontSize:'10px',fontWeight:700,padding:'1px 6px',borderRadius:'6px',flexShrink:0,
                            background:`${PRI_C[alert.pri]}15`,color:PRI_C[alert.pri]}}>{alert.pri}</span>
                        </div>
                        <div style={{display:'flex',gap:'12px',fontSize:'11px',color:'#696969'}}>
                          <span>{alert.eco}</span>
                          <span style={{color:alert.read?'#696969':'#74BB65',fontWeight:600}}>{alert.type}</span>
                          <span>{alert.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </PreviewGate>
          </>
        )}

        {tab==='rules' && (
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            <div style={{display:'flex',justifyContent:'flex-end'}}>
              <button style={{display:'flex',alignItems:'center',gap:'6px',padding:'9px 18px',
                background:'#74BB65',color:'white',border:'none',borderRadius:'8px',
                cursor:'pointer',fontSize:'13px',fontWeight:700}}>
                <Plus size={13}/> New Rule
              </button>
            </div>
            {rules.map(rule=>(
              <div key={rule.id} className="gfm-card" style={{padding:'18px',
                opacity:rule.active?1:0.6,transition:'opacity 0.2s'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'10px'}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'5px'}}>
                      <span style={{fontSize:'14px',fontWeight:700,color:'#0A3D62'}}>{rule.name}</span>
                      <span style={{fontSize:'10px',fontWeight:700,padding:'2px 7px',borderRadius:'7px',
                        background:'rgba(10,61,98,0.07)',color:'#696969'}}>{rule.type}</span>
                    </div>
                    <div style={{fontFamily:'monospace',fontSize:'11px',color:'#696969',
                      background:'rgba(10,61,98,0.03)',padding:'6px 10px',borderRadius:'6px',
                      border:'1px solid rgba(10,61,98,0.06)'}}>{rule.criteria}</div>
                  </div>
                  <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                    <span style={{fontSize:'11px',fontWeight:700,color:rule.active?'#74BB65':'#696969'}}>
                      {rule.active?'Active':'Paused'}
                    </span>
                    <label style={{position:'relative',display:'inline-block',width:'40px',height:'22px',cursor:'pointer'}}>
                      <input type="checkbox" checked={rule.active} onChange={()=>toggleRule(rule.id)}
                        style={{opacity:0,width:0,height:0}}/>
                      <span style={{position:'absolute',top:0,left:0,right:0,bottom:0,
                        background:rule.active?'#74BB65':'rgba(10,61,98,0.15)',borderRadius:'11px',transition:'background 0.2s'}}>
                        <span style={{position:'absolute',top:'3px',left:rule.active?'21px':'3px',
                          width:'16px',height:'16px',borderRadius:'50%',background:'white',
                          transition:'left 0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.2)'}}/>
                      </span>
                    </label>
                    <button style={{background:'transparent',border:'none',cursor:'pointer',padding:'4px',opacity:0.5}}>
                      <Settings size={14} color="#696969"/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
