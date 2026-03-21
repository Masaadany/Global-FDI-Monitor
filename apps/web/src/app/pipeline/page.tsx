'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ScrollableSelect from '@/components/ScrollableSelect';
import Link from 'next/link';
import { Plus, CheckCircle, Clock, AlertTriangle, Trash2, Edit3, ChevronRight } from 'lucide-react';

type Stage = 'screening'|'analysis'|'due_diligence'|'negotiation'|'committed';

interface PipelineItem {
  id: string; country: string; flag: string; sector: string; size: string;
  stage: Stage; gosa: number; priority: 'HIGH'|'MED'|'LOW'; notes: string;
  added: number; targetQ: string;
}

const STAGES: {id:Stage;label:string;color:string;icon:string}[] = [
  {id:'screening',    label:'Screening',     color:'#94a8b3',icon:'🔍'},
  {id:'analysis',     label:'Analysis',      color:'#00d4ff',icon:'📊'},
  {id:'due_diligence',label:'Due Diligence', color:'#ffd700',icon:'🔬'},
  {id:'negotiation',  label:'Negotiation',   color:'#e67e22',icon:'🤝'},
  {id:'committed',    label:'Committed',     color:'#00ffc8',icon:'✅'},
];

const DEFAULT_ITEMS: PipelineItem[] = [
  {id:'1',country:'Malaysia',   flag:'🇲🇾',sector:'Data Centers', size:'$250M–$1B',stage:'due_diligence',gosa:81.2,priority:'HIGH',notes:'Penang FIZ shortlisted. 100% FDI cap confirmed.',added:Date.now()-86400000*14,targetQ:'Q3 2026'},
  {id:'2',country:'Vietnam',    flag:'🇻🇳',sector:'EV Battery',   size:'$50M–$250M',stage:'analysis',    gosa:79.4,priority:'HIGH',notes:'Binh Duong Industrial Zone pre-qualified. CIT reduction confirmed.',added:Date.now()-86400000*7,targetQ:'Q4 2026'},
  {id:'3',country:'UAE',        flag:'🇦🇪',sector:'AI & Data',    size:'$1B+',      stage:'negotiation', gosa:82.1,priority:'HIGH',notes:'JAFZA discussions initiated. ADGM licence process started.',added:Date.now()-86400000*21,targetQ:'Q2 2026'},
  {id:'4',country:'Thailand',   flag:'🇹🇭',sector:'Automotive EV',size:'$50M–$250M',stage:'screening',   gosa:80.7,priority:'MED', notes:'EEC incentive package review in progress.',added:Date.now()-86400000*3, targetQ:'Q1 2027'},
  {id:'5',country:'Saudi Arabia',flag:'🇸🇦',sector:'Renewables',  size:'$250M–$1B',stage:'committed',   gosa:79.1,priority:'HIGH',notes:'NEOM Phase 1 MOU signed. Awaiting regulatory clearance.',added:Date.now()-86400000*45,targetQ:'Q2 2026'},
  {id:'6',country:'India',      flag:'🇮🇳',sector:'Semiconductor',size:'$1B+',      stage:'analysis',    gosa:73.2,priority:'MED', notes:'GIFT City and Tamil Nadu SEZ under evaluation.',added:Date.now()-86400000*10,targetQ:'Q4 2026'},
];

const COUNTRIES = ['Singapore','Malaysia','Thailand','Vietnam','UAE','Saudi Arabia','India','Indonesia','South Korea','Japan','UK','Germany','USA','Brazil','Morocco'];
const SECTORS = ['EV Battery','Data Centers','AI & Technology','Semiconductors','Renewables','Manufacturing','Financial Services','Pharmaceutical','Logistics'];
const SIZES = ['$10M–$50M','$50M–$250M','$250M–$1B','$1B+'];

const PRIORITY_STYLE = {
  HIGH: {bg:'rgba(255,68,102,0.1)',color:'#ff4466',border:'rgba(255,68,102,0.25)'},
  MED:  {bg:'rgba(255,215,0,0.1)', color:'#ffd700',border:'rgba(255,215,0,0.25)'},
  LOW:  {bg:'rgba(0,180,216,0.1)', color:'#00b4d8',border:'rgba(0,180,216,0.25)'},
};

export default function PipelinePage() {
  const [items, setItems] = useState<PipelineItem[]>(DEFAULT_ITEMS);
  const [showAdd, setShowAdd] = useState(false);
  const [view, setView] = useState<'kanban'|'table'>('kanban');
  const [editId, setEditId] = useState<string|null>(null);
  const [form, setForm] = useState({ country:'Malaysia', flag:'🇲🇾', sector:'Data Centers', size:'$50M–$250M', stage:'screening' as Stage, priority:'HIGH' as 'HIGH'|'MED'|'LOW', notes:'', targetQ:'Q3 2026' });

  function addItem() {
    const flags: Record<string,string> = {Singapore:'🇸🇬',Malaysia:'🇲🇾',Thailand:'🇹🇭',Vietnam:'🇻🇳',UAE:'🇦🇪','Saudi Arabia':'🇸🇦',India:'🇮🇳',Indonesia:'🇮🇩','South Korea':'🇰🇷',Japan:'🇯🇵',UK:'🇬🇧',Germany:'🇩🇪',USA:'🇺🇸',Brazil:'🇧🇷',Morocco:'🇲🇦'};
    const gosas: Record<string,number> = {Singapore:88.4,Malaysia:81.2,Thailand:80.7,Vietnam:79.4,UAE:82.1,'Saudi Arabia':79.1,India:73.2,Indonesia:77.8,'South Korea':84.1,Japan:81.4,UK:82.5,Germany:83.1,USA:83.9,Brazil:71.3,Morocco:66.8};
    const newItem: PipelineItem = { id: Date.now().toString(), ...form, flag: flags[form.country]||'🌍', gosa: gosas[form.country]||70, added: Date.now() };
    setItems(prev => [newItem, ...prev]);
    setShowAdd(false);
    setForm({country:'Malaysia',flag:'🇲🇾',sector:'Data Centers',size:'$50M–$250M',stage:'screening',priority:'HIGH',notes:'',targetQ:'Q3 2026'});
  }

  function moveStage(id: string, dir: 1|-1) {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const idx = STAGES.findIndex(s => s.id === item.stage);
      const newIdx = Math.max(0, Math.min(STAGES.length-1, idx + dir));
      return { ...item, stage: STAGES[newIdx].id };
    }));
  }

  function removeItem(id: string) { setItems(prev => prev.filter(i => i.id !== id)); }

  const countryOpts = [{value:'Malaysia',label:'Malaysia'},...COUNTRIES.filter(c=>c!=='Malaysia').map(c=>({value:c,label:c}))];

  return (
    <div style={{minHeight:'100vh',background:'#020c14',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>

      <div style={{background:'linear-gradient(135deg,#020c14,#060f1a)',padding:'20px 24px',borderBottom:'1px solid rgba(0,255,200,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'1540px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px',position:'relative'}}>
          <div>
            <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.5)',letterSpacing:'0.2em',marginBottom:'4px',fontFamily:"'Orbitron','Inter',sans-serif"}}>INVESTMENT PIPELINE</div>
            <h1 style={{fontSize:'20px',fontWeight:900,color:'#e8f4f8'}}>Deal Pipeline Tracker</h1>
            <p style={{fontSize:'12px',color:'rgba(232,244,248,0.4)'}}>{items.length} deals · {items.filter(i=>i.priority==='HIGH').length} high priority · {items.filter(i=>i.stage==='committed').length} committed</p>
          </div>
          <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
            <div style={{display:'flex',background:'rgba(255,255,255,0.04)',borderRadius:'8px',padding:'3px',border:'1px solid rgba(255,255,255,0.07)'}}>
              {[['kanban','⬜ Board'],['table','☰ List']].map(([v,l]) => (
                <button key={v} onClick={()=>setView(v as any)}
                  style={{padding:'6px 14px',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'11px',fontWeight:view===v?700:400,fontFamily:"'Inter',sans-serif",background:view===v?'rgba(0,255,200,0.1)':'transparent',color:view===v?'#00ffc8':'rgba(232,244,248,0.45)',transition:'all 150ms'}}>
                  {l}
                </button>
              ))}
            </div>
            <button onClick={()=>setShowAdd(!showAdd)}
              style={{display:'flex',alignItems:'center',gap:'7px',padding:'9px 18px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'#020c14',border:'none',borderRadius:'9px',cursor:'pointer',fontSize:'12px',fontWeight:800,fontFamily:"'Inter',sans-serif",boxShadow:'0 4px 14px rgba(0,255,200,0.25)'}}>
              <Plus size={14}/> Add Deal
            </button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1540px',margin:'0 auto',padding:'20px 24px'}}>
        {/* Add Form */}
        {showAdd && (
          <div style={{background:'rgba(10,22,40,0.95)',border:'1px solid rgba(0,255,200,0.18)',borderRadius:'12px',padding:'20px',marginBottom:'16px',boxShadow:'0 8px 32px rgba(0,0,0,0.4)'}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'rgba(0,255,200,0.6)',marginBottom:'14px',textTransform:'uppercase',letterSpacing:'0.1em'}}>New Pipeline Deal</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr',gap:'12px',marginBottom:'12px'}}>
              {[
                {label:'Country',    key:'country',  opts:COUNTRIES.map(c=>({value:c,label:c})),     accent:'#00ffc8'},
                {label:'Sector',     key:'sector',   opts:SECTORS.map(s=>({value:s,label:s})),       accent:'#00d4ff'},
                {label:'Deal Size',  key:'size',     opts:SIZES.map(s=>({value:s,label:s})),         accent:'#ffd700'},
                {label:'Stage',      key:'stage',    opts:STAGES.map(s=>({value:s.id,label:s.label})),accent:'#9b59b6'},
                {label:'Priority',   key:'priority', opts:[{value:'HIGH',label:'HIGH'},{value:'MED',label:'MED'},{value:'LOW',label:'LOW'}],accent:'#ff4466'},
              ].map(({label,key,opts,accent}) => (
                <ScrollableSelect key={key} label={label} value={(form as any)[key]} onChange={v=>setForm(f=>({...f,[key]:v}))} width="100%" options={opts} accentColor={accent}/>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr auto auto',gap:'10px',alignItems:'flex-end'}}>
              <div>
                <label style={{fontSize:'9px',fontWeight:700,color:'rgba(0,255,200,0.4)',display:'block',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Notes</label>
                <input value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}
                  placeholder="Key notes, zone preferences, milestones..."
                  style={{width:'100%',padding:'8px 12px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'8px',fontSize:'12px',fontFamily:"'Inter',sans-serif",outline:'none',color:'#e8f4f8'}}/>
              </div>
              <button onClick={addItem} style={{padding:'9px 22px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'#020c14',border:'none',borderRadius:'9px',cursor:'pointer',fontSize:'12px',fontWeight:800,fontFamily:"'Inter',sans-serif",whiteSpace:'nowrap'}}>Add Deal</button>
              <button onClick={()=>setShowAdd(false)} style={{padding:'9px 16px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'9px',cursor:'pointer',fontSize:'12px',fontWeight:600,color:'rgba(232,244,248,0.5)',fontFamily:"'Inter',sans-serif"}}>Cancel</button>
            </div>
          </div>
        )}

        {/* KANBAN VIEW */}
        {view === 'kanban' && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'12px',alignItems:'start'}}>
            {STAGES.map(stage => {
              const stageItems = items.filter(i => i.stage === stage.id);
              return (
                <div key={stage.id} style={{background:'rgba(6,15,26,0.8)',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.04)',overflow:'hidden'}}>
                  <div style={{padding:'10px 14px',background:'rgba(0,0,0,0.3)',borderBottom:'1px solid rgba(255,255,255,0.04)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'7px'}}>
                      <span style={{fontSize:'14px'}}>{stage.icon}</span>
                      <span style={{fontSize:'11px',fontWeight:700,color:'rgba(232,244,248,0.7)'}}>{stage.label}</span>
                    </div>
                    <span style={{fontSize:'11px',fontWeight:900,color:stage.color,fontFamily:"'JetBrains Mono',monospace",padding:'2px 8px',background:`${stage.color}12`,borderRadius:'10px'}}>{stageItems.length}</span>
                  </div>
                  <div style={{padding:'8px',display:'flex',flexDirection:'column',gap:'7px',minHeight:'100px'}}>
                    {stageItems.map(item => {
                      const ps = PRIORITY_STYLE[item.priority];
                      return (
                        <div key={item.id} style={{background:'rgba(255,255,255,0.03)',borderRadius:'9px',padding:'10px 12px',border:'1px solid rgba(255,255,255,0.05)',transition:'all 200ms ease'}}
                          onMouseEnter={e=>{e.currentTarget.style.borderColor=stage.color+'25';e.currentTarget.style.background='rgba(255,255,255,0.05)';}}
                          onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.05)';e.currentTarget.style.background='rgba(255,255,255,0.03)';}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'5px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                              <span style={{fontSize:'14px'}}>{item.flag}</span>
                              <div>
                                <div style={{fontSize:'11px',fontWeight:700,color:'rgba(232,244,248,0.85)'}}>{item.country}</div>
                                <div style={{fontSize:'9px',color:'rgba(232,244,248,0.35)'}}>{item.sector}</div>
                              </div>
                            </div>
                            <span style={{fontSize:'8px',fontWeight:800,padding:'2px 6px',borderRadius:'6px',background:ps.bg,color:ps.color,border:`1px solid ${ps.border}`,letterSpacing:'0.04em'}}>{item.priority}</span>
                          </div>
                          <div style={{fontSize:'11px',fontWeight:700,color:'#00ffc8',fontFamily:"'JetBrains Mono',monospace",marginBottom:'4px'}}>{item.size}</div>
                          {item.notes && <div style={{fontSize:'10px',color:'rgba(232,244,248,0.4)',lineHeight:1.5,marginBottom:'6px'}}>{item.notes.slice(0,60)}{item.notes.length>60?'...':''}</div>}
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                            <span style={{fontSize:'9px',color:'rgba(232,244,248,0.3)',fontFamily:"'JetBrains Mono',monospace"}}>GOSA {item.gosa}</span>
                            <div style={{display:'flex',gap:'3px'}}>
                              {STAGES.findIndex(s=>s.id===item.stage) > 0 && (
                                <button onClick={()=>moveStage(item.id,-1)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(232,244,248,0.3)',padding:'2px',fontSize:'10px',lineHeight:1}}>←</button>
                              )}
                              {STAGES.findIndex(s=>s.id===item.stage) < STAGES.length-1 && (
                                <button onClick={()=>moveStage(item.id,1)} style={{background:'none',border:'none',cursor:'pointer',color:stage.color+'80',padding:'2px',fontSize:'10px',lineHeight:1}}>→</button>
                              )}
                              <button onClick={()=>removeItem(item.id)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,68,102,0.3)',padding:'2px',lineHeight:1}}
                                onMouseEnter={e=>{e.currentTarget.style.color='#ff4466';}}
                                onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,68,102,0.3)';}}>
                                <Trash2 size={10}/>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {stageItems.length === 0 && (
                      <div style={{padding:'16px',textAlign:'center',fontSize:'10px',color:'rgba(232,244,248,0.2)'}}>No deals</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TABLE VIEW */}
        {view === 'table' && (
          <div style={{background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.1)',borderRadius:'12px',overflow:'hidden'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
              <thead>
                <tr style={{background:'rgba(0,0,0,0.3)'}}>
                  {['Economy','Sector','Size','Stage','Priority','GOSA','Target','Notes','Actions'].map(h=>(
                    <th key={h} style={{padding:'10px 14px',textAlign:h==='Economy'||h==='Notes'?'left':'center',fontWeight:700,color:'rgba(232,244,248,0.3)',textTransform:'uppercase',fontSize:'9px',letterSpacing:'0.08em',borderBottom:'1px solid rgba(0,255,200,0.06)',whiteSpace:'nowrap',fontFamily:"'JetBrains Mono',monospace'"}}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const ps = PRIORITY_STYLE[item.priority];
                  const stage = STAGES.find(s=>s.id===item.stage)!;
                  return (
                    <tr key={item.id} style={{borderBottom:'1px solid rgba(255,255,255,0.025)',transition:'background 150ms'}}
                      onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,255,200,0.02)';}}
                      onMouseLeave={e=>{e.currentTarget.style.background='transparent';}}>
                      <td style={{padding:'11px 14px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                          <span style={{fontSize:'18px'}}>{item.flag}</span>
                          <span style={{fontWeight:700,color:'rgba(232,244,248,0.85)'}}>{item.country}</span>
                        </div>
                      </td>
                      <td style={{padding:'11px 8px',textAlign:'center',fontSize:'11px',color:'rgba(232,244,248,0.55)'}}>{item.sector}</td>
                      <td style={{padding:'11px 8px',textAlign:'center',fontSize:'11px',fontWeight:700,color:'#00ffc8',fontFamily:"'JetBrains Mono',monospace"}}>{item.size}</td>
                      <td style={{padding:'11px 8px',textAlign:'center'}}>
                        <span style={{fontSize:'10px',fontWeight:700,padding:'3px 8px',borderRadius:'6px',background:`${stage.color}12`,color:stage.color}}>{stage.icon} {stage.label}</span>
                      </td>
                      <td style={{padding:'11px 8px',textAlign:'center'}}>
                        <span style={{fontSize:'9px',fontWeight:800,padding:'2px 7px',borderRadius:'6px',background:ps.bg,color:ps.color,border:`1px solid ${ps.border}`}}>{item.priority}</span>
                      </td>
                      <td style={{padding:'11px 8px',textAlign:'center',fontWeight:800,color:'#00ffc8',fontFamily:"'JetBrains Mono',monospace"}}>{item.gosa}</td>
                      <td style={{padding:'11px 8px',textAlign:'center',fontSize:'11px',color:'rgba(232,244,248,0.45)'}}>{item.targetQ}</td>
                      <td style={{padding:'11px 14px',fontSize:'11px',color:'rgba(232,244,248,0.45)',maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.notes||'—'}</td>
                      <td style={{padding:'11px 8px',textAlign:'center'}}>
                        <div style={{display:'flex',gap:'4px',justifyContent:'center'}}>
                          <Link href={'/country/'+(['SGP','MYS','THA','VNM','ARE','SAU','IND','IDN','KOR','JPN','GBR','DEU','USA','BRA','MAR','CAN','NLD','CHE','DNK','NZL'].find(id=>({Singapore:'SGP',Malaysia:'MYS',Thailand:'THA',Vietnam:'VNM',UAE:'ARE','Saudi Arabia':'SAU',India:'IND',Indonesia:'IDN','South Korea':'KOR',Japan:'JPN','United Kingdom':'GBR',Germany:'DEU','United States':'USA',Brazil:'BRA',Morocco:'MAR',Canada:'CAN',Netherlands:'NLD',Switzerland:'CHE',Denmark:'DNK','New Zealand':'NZL'} as any)[item.country]===id)||'MYS')} style={{padding:'4px 10px',background:'rgba(0,255,200,0.06)',border:'1px solid rgba(0,255,200,0.15)',borderRadius:'6px',textDecoration:'none',fontSize:'10px',fontWeight:700,color:'#00ffc8'}}>Profile</Link>
                          <button onClick={()=>removeItem(item.id)} style={{padding:'4px 8px',background:'rgba(255,68,102,0.06)',border:'1px solid rgba(255,68,102,0.15)',borderRadius:'6px',cursor:'pointer',color:'#ff4466',lineHeight:1}}><Trash2 size={11}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
