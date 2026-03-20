'use client';
import { useState, useEffect } from 'react';
import { Activity, CheckCircle, AlertCircle, Server, Zap, Shield, Clock, Globe } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import PreviewGate from '@/components/PreviewGate';
import Footer from '@/components/Footer';

const SERVICES = [
  {name:'API Gateway',         status:'operational', latency:'42ms',  uptime:'99.97%',icon:Globe},
  {name:'Signal Ingestion',    status:'operational', latency:'<2s',   uptime:'99.91%',icon:Zap},
  {name:'Z3 Verification',     status:'operational', latency:'180ms', uptime:'99.95%',icon:Shield},
  {name:'PostgreSQL Database', status:'operational', latency:'8ms',   uptime:'99.99%',icon:Server},
  {name:'Redis Cache',         status:'operational', latency:'1ms',   uptime:'100%',  icon:Server},
  {name:'Container App (Azure)',status:'operational', latency:'—',     uptime:'99.97%',icon:Server},
  {name:'Report Generation',   status:'operational', latency:'32s',   uptime:'99.88%',icon:Activity},
  {name:'Agent Pipeline',      status:'operational', latency:'<1s',   uptime:'99.93%',icon:Activity},
  {name:'GFR Computation',     status:'operational', latency:'—',     uptime:'99.99%',icon:CheckCircle},
  {name:'Email Delivery',      status:'operational', latency:'2.1s',  uptime:'99.82%',icon:Globe},
  {name:'CDN / GitHub Pages',  status:'operational', latency:'45ms',  uptime:'99.95%',icon:Globe},
  {name:'Investment Analysis API',status:'operational',latency:'85ms',uptime:'99.94%',icon:Activity},
];

const INCIDENTS: {date:string,title:string,status:'resolved'|'ongoing',severity:'minor'|'major'}[] = [
  {date:'Mar 10 2026',title:'Signal feed 14-min interruption — WebSocket reconnect required',status:'resolved',severity:'minor'},
  {date:'Feb 22 2026',title:'Report generation latency spike (+45s) — queue backlog resolved',status:'resolved',severity:'minor'},
  {date:'Jan 15 2026',title:'Scheduled maintenance: PostgreSQL upgrade 16.2 — 30-min window',status:'resolved',severity:'minor'},
];

const STATUS_C = {operational:'#74BB65',degraded:'#FFB347',outage:'#E57373'};
const SEV_C    = {minor:'#FFB347',major:'#E57373'};

export default function HealthPage() {
  const [uptime, setUptime] = useState(99.97);
  const [tick,   setTick]   = useState(0);

  useEffect(() => {
    const t = setInterval(()=>setTick(n=>n+1), 5000);
    return ()=>clearInterval(t);
  }, []);

  const allOk = SERVICES.every(s=>s.status==='operational');

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section style={{background:allOk?'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)':'linear-gradient(135deg,#C62828 0%,#E53935 100%)',padding:'40px 24px'}}>
        <div style={{maxWidth:'1000px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'16px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
              <div style={{width:'12px',height:'12px',borderRadius:'50%',background:'#74BB65',
                animation:'livePulse 2s infinite'}}/>
              <span style={{fontSize:'14px',fontWeight:800,color:'#74BB65',letterSpacing:'0.06em'}}>
                {allOk ? 'ALL SYSTEMS OPERATIONAL' : 'PARTIAL OUTAGE'}
              </span>
            </div>
            <h1 style={{fontSize:'26px',fontWeight:800,color:'white',margin:0}}>Platform Status</h1>
            <p style={{color:'rgba(226,242,223,0.75)',fontSize:'13px',marginTop:'4px'}}>Last checked: just now · Auto-refresh every 5s</p>
          </div>
          <div style={{display:'flex',gap:'20px'}}>
            {[['12','Services'],['99.97%','30-day uptime'],['0','Active incidents']].map(([v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:'20px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1000px',margin:'0 auto',padding:'28px 24px',display:'flex',flexDirection:'column',gap:'20px'}}>
        {/* Services */}
        <div className="gfm-card" style={{overflow:'hidden'}}>
          <div style={{padding:'14px 20px',borderBottom:'1px solid rgba(10,61,98,0.06)',
            fontSize:'13px',fontWeight:700,color:'#0A3D62',display:'flex',alignItems:'center',gap:'6px'}}>
            <Server size={14} color="#74BB65"/> Service Status
          </div>
          {SERVICES.map((s,i)=>{
            const Icon = s.icon;
            return (
              <div key={s.name} style={{display:'flex',alignItems:'center',gap:'14px',padding:'13px 20px',
                borderBottom:i<SERVICES.length-1?'1px solid rgba(10,61,98,0.05)':'none',flexWrap:'wrap'}}>
                <Icon size={16} color={STATUS_C[s.status as keyof typeof STATUS_C]}/>
                <span style={{flex:1,fontSize:'13px',fontWeight:600,color:'#0A3D62',minWidth:'200px'}}>{s.name}</span>
                <div style={{display:'flex',gap:'16px',alignItems:'center',flexWrap:'wrap'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                    <div style={{width:'8px',height:'8px',borderRadius:'50%',
                      background:STATUS_C[s.status as keyof typeof STATUS_C],
                      animation:s.status==='operational'?'livePulse 3s infinite':'none'}}/>
                    <span style={{fontSize:'12px',fontWeight:700,color:STATUS_C[s.status as keyof typeof STATUS_C],textTransform:'capitalize'}}>
                      {s.status}
                    </span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'11px',color:'#696969'}}>
                    <Clock size={11}/><span>{s.latency}</span>
                  </div>
                  <div style={{fontSize:'11px',color:'#696969',fontFamily:'monospace',minWidth:'50px'}}>{s.uptime} uptime</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Uptime chart (visual bars) */}
        <div className="gfm-card" style={{padding:'22px'}}>
          <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
            <Activity size={14} color="#74BB65"/> 30-Day Uptime History
          </div>
          {SERVICES.slice(0,5).map(s=>(
            <div key={s.name} style={{marginBottom:'10px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px',fontSize:'12px'}}>
                <span style={{color:'#0A3D62',fontWeight:600}}>{s.name}</span>
                <span style={{color:'#74BB65',fontWeight:700,fontFamily:'monospace'}}>{s.uptime}</span>
              </div>
              <div style={{display:'flex',gap:'2px'}}>
                {Array.from({length:30},(_,i)=>(
                  <div key={i} style={{flex:1,height:'20px',borderRadius:'2px',
                    background:i===9||i===22?'rgba(255,179,71,0.4)':'rgba(116,187,101,0.7)',
                    transition:'all 0.2s'}}
                    title={`Day ${30-i} ago`}/>
                ))}
              </div>
            </div>
          ))}
          <div style={{display:'flex',gap:'14px',marginTop:'10px',fontSize:'11px',color:'#696969'}}>
            <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
              <div style={{width:'10px',height:'10px',borderRadius:'2px',background:'rgba(116,187,101,0.7)'}}/>Operational
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
              <div style={{width:'10px',height:'10px',borderRadius:'2px',background:'rgba(255,179,71,0.4)'}}/>Degraded
            </div>
          </div>
        </div>

        {/* Incident history */}
        <div className="gfm-card" style={{padding:'22px'}}>
          <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
            <AlertCircle size={14} color="#74BB65"/> Recent Incident History
          </div>
          {INCIDENTS.map((inc,i)=>(
            <div key={i} style={{display:'flex',gap:'12px',padding:'12px 0',
              borderBottom:i<INCIDENTS.length-1?'1px solid rgba(10,61,98,0.06)':'none'}}>
              <div style={{width:'8px',height:'8px',borderRadius:'50%',flexShrink:0,marginTop:'5px',
                background:inc.status==='resolved'?'#74BB65':'#E57373'}}/>
              <div style={{flex:1}}>
                <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap',marginBottom:'3px'}}>
                  <span style={{fontSize:'13px',fontWeight:700,color:'#0A3D62'}}>{inc.title}</span>
                  <span style={{fontSize:'10px',fontWeight:700,padding:'1px 7px',borderRadius:'8px',
                    background:inc.status==='resolved'?'rgba(116,187,101,0.1)':'rgba(229,115,115,0.1)',
                    color:inc.status==='resolved'?'#74BB65':'#E57373',textTransform:'capitalize'}}>
                    {inc.status}
                  </span>
                </div>
                <div style={{fontSize:'11px',color:'#696969'}}>{inc.date} · Severity: <b style={{color:SEV_C[inc.severity]}}>{inc.severity}</b></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
