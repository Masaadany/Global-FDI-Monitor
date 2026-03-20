'use client';
import { useState } from 'react';
import { Server, Users, Activity, Mail, Settings, BarChart3, Zap, Globe, Shield, Play, Pause, CheckCircle, AlertCircle } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';
import Link from 'next/link';

const METRIC_KPIS = [
  {label:'Total API Calls Today', v:'84,218',  change:'+12%', icon:Activity, color:'#0A3D62'},
  {label:'Active Users',          v:'248',     change:'+8%',  icon:Users,    color:'#74BB65'},
  {label:'Reports Generated',     v:'156',     change:'+22%', icon:BarChart3,color:'#1B6CA8'},
  {label:'Signals Ingested',      v:'218',     change:'+5%',  icon:Zap,      color:'#2E86AB'},
];

const SAMPLE_USERS = [
  {id:'U001',name:'Ahmed Al-Rashid',    org:'MISA',      plan:'Enterprise', signals:42, reports:8,  joined:'Jan 2026'},
  {id:'U002',name:'Sarah Chen',         org:'GIC',       plan:'Professional',signals:31, reports:5, joined:'Feb 2026'},
  {id:'U003',name:'Marcus Weber',       org:'McKinsey',  plan:'Professional',signals:28, reports:4, joined:'Mar 2026'},
  {id:'U004',name:'Priya Sharma',       org:'DPIIT',     plan:'Enterprise', signals:55, reports:12, joined:'Jan 2026'},
  {id:'U005',name:'Carlos Silva',       org:'Deloitte',  plan:'Professional',signals:19, reports:3, joined:'Mar 2026'},
];

const JOBS = [
  {id:'AGT-001',name:'SignalIngestionAgent',   status:'running',  lastRun:'2s ago',  runsToday:43200, health:'OK'},
  {id:'AGT-002',name:'Z3VerificationAgent',    status:'running',  lastRun:'5s ago',  runsToday:17280, health:'OK'},
  {id:'AGT-003',name:'SHAProvenanceAgent',     status:'running',  lastRun:'5s ago',  runsToday:17280, health:'OK'},
  {id:'AGT-004',name:'SCIComputationAgent',    status:'running',  lastRun:'10s ago', runsToday:8640,  health:'OK'},
  {id:'AGT-005',name:'CorridorAggregationAgent',status:'running', lastRun:'1m ago',  runsToday:1440,  health:'OK'},
  {id:'AGT-011',name:'GFRComputationAgent',    status:'scheduled',lastRun:'6h ago',  runsToday:1,     health:'OK'},
  {id:'AGT-019',name:'GOSAComputationAgent',   status:'scheduled',lastRun:'6h ago',  runsToday:1,     health:'OK'},
  {id:'AGT-027',name:'ReportGenerationAgent',  status:'running',  lastRun:'32s ago', runsToday:156,   health:'OK'},
];

const SYS = [
  {label:'API Gateway',   status:'operational', latency:'42ms',  pct:'99.97%'},
  {label:'PostgreSQL DB', status:'operational', latency:'8ms',   pct:'99.99%'},
  {label:'Redis Cache',   status:'operational', latency:'1ms',   pct:'100%'},
  {label:'Container App', status:'operational', latency:'—',     pct:'99.97%'},
];

export default function AdminPage() {
  const [tab, setTab] = useState<'metrics'|'users'|'jobs'|'system'>('metrics');
  const [jobs, setJobs] = useState(JOBS);

  function toggleJob(id:string) {
    setJobs(j=>j.map(x=>x.id===id?{...x,status:x.status==='running'?'paused':'running'}:x));
  }

  const TABS = [{id:'metrics',label:'Metrics',icon:BarChart3},{id:'users',label:'Users',icon:Users},
                {id:'jobs',label:'Agent Jobs',icon:Activity},{id:'system',label:'System',icon:Server}];

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/><TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'28px 24px 0'}}>
        <div style={{maxWidth:'1300px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px'}}>
            <Shield size={18} color="#74BB65"/>
            <h1 style={{fontSize:'22px',fontWeight:800,color:'white',margin:0}}>Admin Console</h1>
            <span style={{fontSize:'11px',fontWeight:700,padding:'3px 9px',borderRadius:'8px',
              background:'rgba(229,115,115,0.2)',color:'#FFB8B8',marginLeft:'4px'}}>RESTRICTED</span>
          </div>
          <div style={{display:'flex',gap:'0'}}>
            {TABS.map(({id,label,icon:Icon})=>(
              <button key={id} onClick={()=>setTab(id as any)}
                style={{display:'flex',alignItems:'center',gap:'5px',padding:'10px 16px',
                  border:'none',cursor:'pointer',fontSize:'13px',fontWeight:600,background:'transparent',
                  color:tab===id?'white':'rgba(226,242,223,0.65)',
                  borderBottom:tab===id?'3px solid #74BB65':'3px solid transparent',transition:'all 0.2s'}}>
                <Icon size={13}/>{label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1300px',margin:'0 auto',padding:'20px 24px',display:'flex',flexDirection:'column',gap:'14px'}}>

        {tab==='metrics' && (
          <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px'}}>
              {METRIC_KPIS.map(({label,v,change,icon:Icon,color})=>(
                <div key={label} className="gfm-card" style={{padding:'16px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}>
                    <div style={{width:'34px',height:'34px',borderRadius:'9px',
                      background:`${color}10`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <Icon size={16} color={color}/>
                    </div>
                    <span style={{fontSize:'11px',fontWeight:700,color:'#74BB65'}}>{change}</span>
                  </div>
                  <div style={{fontSize:'22px',fontWeight:800,color:'#0A3D62',fontFamily:'monospace'}}>{v}</div>
                  <div style={{fontSize:'11px',color:'#696969',marginTop:'3px'}}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
              {[{l:'Trial to Pro conversion',v:'18%'},{l:'Avg session duration',v:'24min'},{l:'Report completion rate',v:'94%'}].map(({l,v})=>(
                <div key={l} className="gfm-card" style={{padding:'16px',textAlign:'center'}}>
                  <div style={{fontSize:'28px',fontWeight:900,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                  <div style={{fontSize:'12px',color:'#696969',marginTop:'4px'}}>{l}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab==='users' && (
          <div className="gfm-card" style={{overflow:'hidden'}}>
            <table className="gfm-table">
              <thead><tr>{['Name','Organisation','Plan','Signals','Reports','Joined'].map(h=><th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {SAMPLE_USERS.map(u=>(
                  <tr key={u.id}>
                    <td style={{fontWeight:700}}>{u.name}</td>
                    <td>{u.org}</td>
                    <td><span style={{fontSize:'11px',fontWeight:700,padding:'2px 8px',borderRadius:'7px',
                      background:u.plan==='Enterprise'?'rgba(116,187,101,0.1)':'rgba(10,61,98,0.07)',
                      color:u.plan==='Enterprise'?'#74BB65':'#0A3D62'}}>{u.plan}</span></td>
                    <td style={{fontFamily:'monospace'}}>{u.signals}</td>
                    <td style={{fontFamily:'monospace'}}>{u.reports}</td>
                    <td>{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab==='jobs' && (
          <div className="gfm-card" style={{overflow:'hidden'}}>
            <table className="gfm-table">
              <thead><tr>{['Agent ID','Name','Status','Last Run','Runs Today','Health','Action'].map(h=><th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {jobs.map(job=>(
                  <tr key={job.id}>
                    <td style={{fontFamily:'monospace',fontSize:'11px',color:'#696969'}}>{job.id}</td>
                    <td style={{fontWeight:600,fontSize:'13px'}}>{job.name}</td>
                    <td><span style={{fontSize:'11px',fontWeight:700,padding:'2px 8px',borderRadius:'7px',
                      background:job.status==='running'?'rgba(116,187,101,0.1)':'rgba(255,179,71,0.1)',
                      color:job.status==='running'?'#74BB65':'#FFB347'}}>{job.status}</span></td>
                    <td style={{fontSize:'12px',color:'#696969'}}>{job.lastRun}</td>
                    <td style={{fontFamily:'monospace'}}>{job.runsToday.toLocaleString()}</td>
                    <td><span style={{fontSize:'11px',fontWeight:700,color:'#74BB65',display:'flex',alignItems:'center',gap:'3px'}}>
                      <CheckCircle size={11}/>OK</span></td>
                    <td>
                      <button onClick={()=>toggleJob(job.id)}
                        style={{display:'flex',alignItems:'center',gap:'4px',padding:'5px 10px',
                          border:'1px solid rgba(10,61,98,0.15)',borderRadius:'6px',background:'transparent',
                          cursor:'pointer',fontSize:'11px',fontWeight:600,color:'#696969'}}>
                        {job.status==='running'?<><Pause size={10}/>Pause</>:<><Play size={10}/>Resume</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab==='system' && (
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {SYS.map(s=>(
              <div key={s.label} className="gfm-card" style={{padding:'16px',display:'flex',alignItems:'center',gap:'16px',flexWrap:'wrap'}}>
                <CheckCircle size={18} color="#74BB65"/>
                <span style={{flex:1,fontSize:'14px',fontWeight:700,color:'#0A3D62'}}>{s.label}</span>
                <span style={{fontSize:'12px',fontWeight:700,color:'#74BB65'}}>Operational</span>
                <span style={{fontSize:'12px',color:'#696969',fontFamily:'monospace'}}>{s.latency}</span>
                <span style={{fontSize:'12px',fontWeight:700,color:'#0A3D62',fontFamily:'monospace'}}>{s.pct}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
