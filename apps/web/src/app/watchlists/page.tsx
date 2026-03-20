'use client';
import { useState } from 'react';
import { BookmarkPlus, Globe, Zap, TrendingUp, X, Plus, Edit2, Trash2, Bell, BarChart3, ArrowRight } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';
import PreviewGate from '@/components/PreviewGate';
import { useTrial } from '@/lib/trialContext';
import Link from 'next/link';

const DEFAULT_LISTS = [
  {id:'wl1',name:'MENA Priority',   items:['UAE','Saudi Arabia','Egypt','Kuwait'],  signals:18, color:'#0A3D62'},
  {id:'wl2',name:'ASEAN Emerging',  items:['Vietnam','Indonesia','Malaysia','Thailand'], signals:31, color:'#74BB65'},
  {id:'wl3',name:'Tech Corridor',   items:['Singapore','South Korea','India'],      signals:24, color:'#1B6CA8'},
];

const SIGNAL_PREVIEW = [
  {flag:'🇦🇪',eco:'UAE',      company:'Microsoft Azure',    amt:'$5.2B', grade:'PLATINUM', sci:96, hrs:'2h ago'},
  {flag:'🇸🇦',eco:'S. Arabia', company:'Amazon AWS',         amt:'$5.4B', grade:'GOLD',     sci:91, hrs:'5h ago'},
  {flag:'🇻🇳',eco:'Vietnam',  company:'CATL Battery',       amt:'$3.2B', grade:'PLATINUM', sci:94, hrs:'8h ago'},
  {flag:'🇮🇩',eco:'Indonesia', company:'Hyundai Motor',     amt:'$1.8B', grade:'GOLD',     sci:88, hrs:'12h ago'},
  {flag:'🇸🇬',eco:'Singapore', company:'Google Data Centre', amt:'$2.1B', grade:'PLATINUM', sci:97, hrs:'1d ago'},
];

const GRADE_C: Record<string,string> = {PLATINUM:'#0A3D62',GOLD:'#74BB65',SILVER:'#696969',BRONZE:'#9E9E9E'};

export default function WatchlistsPage() {
  const [lists,    setLists]    = useState(DEFAULT_LISTS);
  const [active,   setActive]   = useState('wl1');
  const [newName,  setNewName]  = useState('');
  const [creating, setCreating] = useState(false);
  const trial = useTrial();

  const current = lists.find(l=>l.id===active);

  function createList() {
    if (!newName.trim()) return;
    const id = 'wl'+Date.now();
    setLists(l=>[...l, {id, name:newName.trim(), items:[], signals:0, color:'#74BB65'}]);
    setActive(id); setNewName(''); setCreating(false);
  }

  function deleteList(id:string) {
    setLists(l=>l.filter(x=>x.id!==id));
    if (active===id) setActive(lists[0]?.id||'');
  }

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/><TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'28px 24px'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
              <BookmarkPlus size={16} color="#74BB65"/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>Watchlists</span>
            </div>
            <h1 style={{fontSize:'24px',fontWeight:800,color:'white',margin:0}}>My Watchlists</h1>
          </div>
          <button onClick={()=>setCreating(true)} style={{display:'flex',alignItems:'center',gap:'7px',
            padding:'10px 20px',background:'#74BB65',color:'white',border:'none',borderRadius:'9px',
            cursor:'pointer',fontSize:'13px',fontWeight:700,boxShadow:'0 4px 14px rgba(116,187,101,0.35)'}}>
            <Plus size={14}/> New Watchlist
          </button>
        </div>
      </section>

      <div style={{maxWidth:'1400px',margin:'0 auto',padding:'20px 24px',display:'grid',gridTemplateColumns:'260px 1fr',gap:'20px',alignItems:'start'}}>
        {/* Sidebar */}
        <div style={{display:'flex',flexDirection:'column',gap:'8px',position:'sticky',top:'80px'}}>
          {/* Create form */}
          {creating && (
            <div style={{background:'white',borderRadius:'12px',padding:'14px',
              boxShadow:'0 4px 16px rgba(10,61,98,0.1)',marginBottom:'4px'}}>
              <input value={newName} onChange={e=>setNewName(e.target.value)}
                placeholder="Watchlist name" autoFocus
                onKeyDown={e=>{if(e.key==='Enter')createList();if(e.key==='Escape'){setCreating(false);setNewName('');}}}
                style={{width:'100%',padding:'9px 12px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.2)',
                  fontSize:'13px',outline:'none',color:'#000',marginBottom:'8px'}}/>
              <div style={{display:'flex',gap:'6px'}}>
                <button onClick={createList} className="gfm-btn-primary"
                  style={{flex:1,padding:'8px',fontSize:'12px'}}>Create</button>
                <button onClick={()=>{setCreating(false);setNewName('');}}
                  style={{padding:'8px 10px',border:'1px solid rgba(10,61,98,0.15)',borderRadius:'7px',
                    background:'transparent',cursor:'pointer',fontSize:'12px',color:'#696969'}}>Cancel</button>
              </div>
            </div>
          )}
          {lists.map(l=>(
            <div key={l.id} onClick={()=>setActive(l.id)}
              style={{background:active===l.id?'white':'rgba(255,255,255,0.6)',borderRadius:'11px',
                padding:'14px',cursor:'pointer',transition:'all 0.15s',
                border:active===l.id?`2px solid ${l.color}`:'1px solid rgba(10,61,98,0.07)',
                boxShadow:active===l.id?`0 4px 16px ${l.color}20`:'none'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div style={{display:'flex',alignItems:'center',gap:'7px',flex:1}}>
                  <div style={{width:'10px',height:'10px',borderRadius:'50%',background:l.color,flexShrink:0}}/>
                  <span style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',lineHeight:'1.3'}}>{l.name}</span>
                </div>
                <button onClick={e=>{e.stopPropagation();deleteList(l.id);}}
                  style={{background:'transparent',border:'none',cursor:'pointer',padding:'2px',opacity:0.4}}
                  title="Delete">
                  <Trash2 size={12} color="#696969"/>
                </button>
              </div>
              <div style={{display:'flex',gap:'12px',marginTop:'8px',fontSize:'11px',color:'#696969'}}>
                <span style={{display:'flex',alignItems:'center',gap:'3px'}}><Globe size={10}/>{l.items.length} economies</span>
                <span style={{display:'flex',alignItems:'center',gap:'3px'}}><Zap size={10} color="#74BB65"/><b style={{color:'#74BB65'}}>{l.signals}</b> signals</span>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div style={{marginTop:'8px',padding:'14px',borderRadius:'11px',background:'white',
            boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'#696969',textTransform:'uppercase',
              letterSpacing:'0.06em',marginBottom:'10px'}}>All watchlists</div>
            {[{l:'Total signals',v:String(lists.reduce((s,l)=>s+l.signals,0))},
              {l:'Economies tracked',v:String(new Set(lists.flatMap(l=>l.items)).size)},
              {l:'Alert rules',v:'3'},
            ].map(({l,v})=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',marginBottom:'7px',fontSize:'12px'}}>
                <span style={{color:'#696969'}}>{l}</span>
                <span style={{fontWeight:700,color:'#0A3D62',fontFamily:'monospace'}}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        {current && (
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            {/* Header */}
            <div className="gfm-card" style={{padding:'20px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'12px',height:'12px',borderRadius:'50%',background:current.color}}/>
                <span style={{fontSize:'18px',fontWeight:800,color:'#0A3D62'}}>{current.name}</span>
                <span style={{fontSize:'12px',color:'#696969'}}>{current.items.length} economies · {current.signals} signals</span>
              </div>
              <div style={{display:'flex',gap:'8px'}}>
                <button style={{display:'flex',alignItems:'center',gap:'5px',padding:'8px 14px',
                  border:'1px solid rgba(10,61,98,0.15)',borderRadius:'8px',background:'transparent',
                  cursor:'pointer',fontSize:'12px',fontWeight:600,color:'#0A3D62'}}>
                  <Bell size={12}/> Set Alert
                </button>
                <button style={{display:'flex',alignItems:'center',gap:'5px',padding:'8px 14px',
                  border:'1px solid rgba(10,61,98,0.15)',borderRadius:'8px',background:'transparent',
                  cursor:'pointer',fontSize:'12px',fontWeight:600,color:'#0A3D62'}}>
                  <Edit2 size={12}/> Edit
                </button>
              </div>
            </div>

            {/* Economy chips */}
            <div className="gfm-card" style={{padding:'18px'}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'12px',display:'flex',alignItems:'center',gap:'6px'}}>
                <Globe size={13} color="#74BB65"/> Watched Economies
              </div>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                {current.items.map(eco=>(
                  <div key={eco} style={{display:'flex',alignItems:'center',gap:'6px',padding:'7px 12px',
                    borderRadius:'20px',background:`${current.color}10`,border:`1px solid ${current.color}25`,
                    fontSize:'13px',fontWeight:600,color:current.color}}>
                    {eco}
                    <X size={11} style={{cursor:'pointer',opacity:0.6}}/>
                  </div>
                ))}
                <button style={{display:'flex',alignItems:'center',gap:'5px',padding:'7px 12px',
                  borderRadius:'20px',border:'1px dashed rgba(10,61,98,0.2)',background:'transparent',
                  cursor:'pointer',fontSize:'12px',color:'#696969'}}>
                  <Plus size={11}/> Add economy
                </button>
              </div>
            </div>

            {/* Signals */}
            <PreviewGate feature="view">
              <div className="gfm-card" style={{overflow:'hidden'}}>
                <div style={{padding:'14px 18px',borderBottom:'1px solid rgba(10,61,98,0.06)',
                  display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',display:'flex',alignItems:'center',gap:'6px'}}>
                    <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#74BB65',animation:'livePulse 2s infinite'}}/>
                    Live Signal Feed — {current.name}
                  </div>
                  <Link href="/signals" style={{fontSize:'11px',fontWeight:700,color:'#74BB65',textDecoration:'none',
                    display:'flex',alignItems:'center',gap:'4px'}}>
                    View all <ArrowRight size={11}/>
                  </Link>
                </div>
                {SIGNAL_PREVIEW.map((s,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 18px',
                    borderBottom:i<SIGNAL_PREVIEW.length-1?'1px solid rgba(10,61,98,0.04)':'none',flexWrap:'wrap'}}>
                    <span style={{fontSize:'10px',fontWeight:800,padding:'2px 8px',borderRadius:'8px',flexShrink:0,
                      background:`${GRADE_C[s.grade]}12`,color:GRADE_C[s.grade]}}>{s.grade}</span>
                    <span style={{fontSize:'18px'}}>{s.flag}</span>
                    <span style={{fontWeight:700,color:'#0A3D62',flex:1,fontSize:'13px',minWidth:'140px'}}>{s.company}</span>
                    <span style={{fontSize:'12px',color:'#696969',minWidth:'80px'}}>{s.eco}</span>
                    <span style={{fontFamily:'monospace',fontWeight:700,color:'#0A3D62',fontSize:'13px'}}>{s.amt}</span>
                    <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                      <div style={{width:'36px',height:'4px',borderRadius:'2px',background:'rgba(10,61,98,0.07)'}}>
                        <div style={{height:'100%',borderRadius:'2px',width:`${s.sci}%`,background:GRADE_C[s.grade]}}/>
                      </div>
                      <span style={{fontSize:'11px',fontWeight:700,color:GRADE_C[s.grade]}}>{s.sci}</span>
                    </div>
                    <span style={{fontSize:'11px',color:'#696969'}}>{s.hrs}</span>
                  </div>
                ))}
              </div>
            </PreviewGate>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
