'use client';
import { useState } from 'react';
import { Building2, TrendingUp, Activity, Globe, Users, Briefcase, Zap, ChevronDown, ChevronRight, Filter } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import TrialBanner from '@/components/TrialBanner';
import PreviewGate from '@/components/PreviewGate';

const COMPANIES = [
  {cic:'CIC-MSFT-001',name:'Microsoft Corporation',  hq:'🇺🇸 USA',sector:'Technology', ims:94.2,sci:96,grade:'PLATINUM',rev:'$245B',emp:'228K',
   fdi:[{y:2025,eco:'🇦🇪 UAE',amt:'$5.2B',type:'Greenfield'},{y:2023,eco:'🇦🇪 UAE',amt:'$1.2B',type:'Data Centre'}],
   signals:3,focus:['Cloud','AI','Azure'],listed:true},
  {cic:'CIC-CATL-001',name:'CATL',                    hq:'🇨🇳 China',sector:'Manufacturing',ims:88.5,sci:93,grade:'PLATINUM',rev:'$42B',emp:'98K',
   fdi:[{y:2025,eco:'🇮🇩 Indonesia',amt:'$3.2B',type:'Greenfield'},{y:2024,eco:'🇻🇳 Vietnam',amt:'$1.1B',type:'Greenfield'}],
   signals:3,focus:['EV Battery','Energy Storage'],listed:true},
  {cic:'CIC-AWS-001', name:'Amazon Web Services',      hq:'🇺🇸 USA',sector:'Technology', ims:89.8,sci:92,grade:'PLATINUM',rev:'$90B',emp:'1.5M',
   fdi:[{y:2025,eco:'🇸🇦 Saudi Arabia',amt:'$5.4B',type:'Greenfield'},{y:2024,eco:'🇦🇪 UAE',amt:'$1.8B',type:'Greenfield'}],
   signals:4,focus:['Cloud','AI','IoT'],listed:true},
  {cic:'CIC-SIEM-001',name:'Siemens AG',               hq:'🇩🇪 Germany',sector:'Energy', ims:85.2,sci:88,grade:'GOLD',    rev:'$84B',emp:'311K',
   fdi:[{y:2025,eco:'🇦🇪 UAE',amt:'$2.1B',type:'Expansion'},{y:2023,eco:'🇸🇦 Saudi',amt:'$0.9B',type:'Greenfield'}],
   signals:2,focus:['Energy','Automation','Infrastructure'],listed:true},
  {cic:'CIC-BLK-001', name:'BlackRock',                hq:'🇺🇸 USA',sector:'Finance',   ims:83.1,sci:79,grade:'SILVER',  rev:'$17.9B',emp:'20K',
   fdi:[{y:2025,eco:'🇬🇧 UK',amt:'$0.9B',type:'M&A'},{y:2024,eco:'🇦🇪 UAE',amt:'$1.2B',type:'Expansion'}],
   signals:1,focus:['Asset Management','Infrastructure'],listed:true},
  {cic:'CIC-GOOG-001',name:'Google (Alphabet)',         hq:'🇺🇸 USA',sector:'Technology', ims:91.5,sci:94,grade:'PLATINUM',rev:'$307B',emp:'182K',
   fdi:[{y:2025,eco:'🇸🇬 Singapore',amt:'$2.8B',type:'Greenfield'},{y:2024,eco:'🇮🇳 India',amt:'$1.5B',type:'Expansion'}],
   signals:2,focus:['Cloud','AI','YouTube'],listed:true},
];

const GRADE_C: Record<string,string> = {PLATINUM:'#0A3D62',GOLD:'#74BB65',SILVER:'#696969'};
const SECTORS = ['All','Technology','Manufacturing','Energy','Finance'];

export default function CompanyProfilesPage() {
  const [search,   setSearch]   = useState('');
  const [sector,   setSector]   = useState('All');
  const [expanded, setExpanded] = useState<string|null>(null);

  const filtered = COMPANIES.filter(c=>{
    const ms = sector==='All'||c.sector===sector;
    const mq = !search||c.name.toLowerCase().includes(search.toLowerCase())||c.hq.toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/><TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'36px 24px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}><Building2 size={16} color="#74BB65"/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>Company Intelligence Centre</span>
            </div>
            <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'6px'}}>Active Investor Profiles</h1>
            <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>IMS-scored · SCI verified · Full investment history · 12-dimension analysis</p>
          </div>
          <div style={{display:'flex',gap:'20px'}}>
            {[['215+','Companies'],['12','Dimensions'],['SCI','Verified']].map(([v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:'20px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'24px'}}>
        <div style={{display:'flex',gap:'10px',marginBottom:'14px',flexWrap:'wrap',alignItems:'center'}}>
          <Filter size={14} color="#696969"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search companies…"
            style={{padding:'8px 14px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
              fontSize:'13px',background:'white',color:'#000',outline:'none',minWidth:'220px'}}/>
          <div style={{display:'flex',gap:'4px'}}>
            {SECTORS.map(s=>(
              <button key={s} onClick={()=>setSector(s)}
                style={{padding:'6px 12px',borderRadius:'16px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:700,
                  background:sector===s?'#0A3D62':'rgba(10,61,98,0.07)',color:sector===s?'white':'#0A3D62'}}>
                {s}
              </button>
            ))}
          </div>
          <span style={{marginLeft:'auto',fontSize:'12px',color:'#696969'}}>{filtered.length} companies</span>
        </div>
        <PreviewGate feature="full_profile">
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {filtered.map(co=>(
              <div key={co.cic} style={{background:'white',borderRadius:'12px',overflow:'hidden',
                boxShadow:'0 2px 8px rgba(10,61,98,0.06)',border:'1px solid rgba(10,61,98,0.06)'}}>
                <div style={{padding:'18px',cursor:'pointer',display:'flex',gap:'14px',alignItems:'center',flexWrap:'wrap'}}
                  onClick={()=>setExpanded(expanded===co.cic?null:co.cic)}>
                  <div style={{width:'42px',height:'42px',borderRadius:'10px',background:`${GRADE_C[co.grade]}12`,
                    display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <Building2 size={20} color={GRADE_C[co.grade]}/>
                  </div>
                  <div style={{flex:1,minWidth:'200px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'3px',flexWrap:'wrap'}}>
                      <span style={{fontSize:'15px',fontWeight:700,color:'#0A3D62'}}>{co.name}</span>
                      <span style={{fontSize:'10px',fontWeight:700,padding:'2px 7px',borderRadius:'10px',
                        background:`${GRADE_C[co.grade]}12`,color:GRADE_C[co.grade]}}>{co.grade}</span>
                    </div>
                    <div style={{fontSize:'12px',color:'#696969'}}>{co.hq} · {co.sector} · Rev {co.rev} · {co.emp} employees</div>
                  </div>
                  <div style={{display:'flex',gap:'16px',alignItems:'center',flexShrink:0}}>
                    <div style={{textAlign:'center'}}>
                      <div style={{fontSize:'16px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{co.ims}</div>
                      <div style={{fontSize:'10px',color:'#696969'}}>IMS</div>
                    </div>
                    <div style={{textAlign:'center'}}>
                      <div style={{fontSize:'16px',fontWeight:800,color:GRADE_C[co.grade],fontFamily:'monospace'}}>{co.sci}%</div>
                      <div style={{fontSize:'10px',color:'#696969'}}>SCI</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'11px',color:'#74BB65',fontWeight:700}}>
                      <Zap size={11}/>{co.signals}
                    </div>
                    {expanded===co.cic ? <ChevronDown size={16} color="#696969"/> : <ChevronRight size={16} color="#696969"/>}
                  </div>
                </div>
                {expanded===co.cic && (
                  <div style={{padding:'0 18px 18px',borderTop:'1px solid rgba(10,61,98,0.06)'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginTop:'14px'}}>
                      <div>
                        <div style={{fontSize:'11px',fontWeight:700,color:'#696969',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'8px'}}>Investment History</div>
                        {co.fdi.map((f,i)=>(
                          <div key={i} style={{display:'flex',gap:'8px',padding:'7px',borderRadius:'7px',
                            background:'rgba(10,61,98,0.03)',border:'1px solid rgba(10,61,98,0.07)',marginBottom:'6px',fontSize:'12px'}}>
                            <span style={{fontWeight:700,color:'#0A3D62',minWidth:'35px'}}>{f.y}</span>
                            <span>{f.eco}</span>
                            <span style={{fontWeight:700,color:'#74BB65',marginLeft:'auto',fontFamily:'monospace'}}>{f.amt}</span>
                            <span style={{color:'#696969'}}>{f.type}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{fontSize:'11px',fontWeight:700,color:'#696969',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'8px'}}>Focus Areas</div>
                        <div style={{display:'flex',gap:'5px',flexWrap:'wrap'}}>
                          {co.focus.map(f=>(
                            <span key={f} style={{fontSize:'11px',padding:'3px 10px',borderRadius:'12px',
                              background:'rgba(116,187,101,0.1)',color:'#0A3D62',fontWeight:600}}>{f}</span>
                          ))}
                        </div>
                        <div style={{marginTop:'10px',fontSize:'12px',color:'#696969'}}>
                          CIC: <span style={{fontFamily:'monospace',color:'#0A3D62'}}>{co.cic}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </PreviewGate>
      </div>
      <Footer/>
    </div>
  );
}
