'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const ENDPOINTS = [
  {method:'GET', path:'/api/v1/countries',desc:'List all economies with GOSA scores',params:[{n:'region',t:'string',d:'Filter by region'},{n:'tier',t:'string',d:'TOP | HIGH'},{n:'search',t:'string',d:'Economy name search'}],example:'{"success":true,"count":15,"data":[{"id":"SGP","name":"Singapore","gosa":88.4,"tier":"TOP","trend":0.2}]}'},
  {method:'GET', path:'/api/v1/countries/:id',desc:'Get single economy by ISO3 code',params:[{n:'id',t:'path',d:'ISO3 code e.g. SGP, MYS, ARE'}],example:'{"success":true,"data":{"id":"MYS","name":"Malaysia","gosa":81.2,"tier":"HIGH"}}'},
  {method:'GET', path:'/api/v1/signals',desc:'Get latest investment signals',params:[{n:'grade',t:'string',d:'PLATINUM | GOLD | SILVER'},{n:'impact',t:'string',d:'HIGH | MED | LOW'}],example:'{"success":true,"count":5,"data":[{"id":1,"type":"POLICY_CHANGE","grade":"PLATINUM","country":"Malaysia","sco":96}]}'},
  {method:'POST',path:'/api/v1/reports/generate',desc:'Generate investment report',params:[{n:'country_id',t:'string',d:'ISO3 code'},{n:'sector',t:'string',d:'Target sector'}],example:'{"success":true,"data":{"report_id":"RPT-1742851234","country":"Malaysia","gosa":81.2,"download_url":"https://api.fdimonitor.org/reports/GFM_MYS..."}}'},
  {method:'POST',path:'/api/v1/auth/register',desc:'Register for access',params:[{n:'name',t:'string',d:'Full name'},{n:'email',t:'string',d:'Work email'},{n:'org',t:'string',d:'Organisation'}],example:'{"success":true,"data":{"tier":"trial","trial_end":"2026-03-28T00:00:00Z","token":"gfm_trial_..."}}'},
  {method:'POST',path:'/api/v1/auth/login',desc:'Authenticate and get token',params:[{n:'email',t:'string',d:'Registered email'},{n:'password',t:'string',d:'Password'}],example:'{"success":true,"data":{"tier":"professional","token":"gfm_pro_..."}}'},
  {method:'GET', path:'/api/v1/agents/health',desc:'AI agent pipeline status',params:[],example:'{"success":true,"agents":[{"id":"AGT-01","status":"active"},{"id":"AGT-02","status":"active"}]}'},
  {method:'WS',  path:'/ws/signals',desc:'WebSocket stream of live signals',params:[{n:'—',t:'—',d:'Connect via WebSocket. Receive signal events every ~5s'}],example:'{"type":"signal","data":{"grade":"GOLD","country":"Thailand","title":"New signal","sco":88}}'},
];

const MC:Record<string,{bg:string,color:string}>={GET:{bg:'rgba(46,204,113,0.1)',color:'var(--accent-green)'},POST:{bg:'rgba(0,180,216,0.1)',color:'#3498DB'},WS:{bg:'rgba(155,89,182,0.1)',color:'#9b59b6'}};

export default function ApiDocsPage(){
  const [expanded,setExpanded]=useState<number|null>(0);
  const [copied,setCopied]=useState<number|null>(null);

  function copy(i:number,t:string){
    navigator.clipboard?.writeText(t);
    setCopied(i);
    setTimeout(()=>setCopied(null),2000);
  }

  return(
    <div style={{minHeight:'100vh',background:'var(--bg-page)',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{background:'linear-gradient(135deg,#FFFFFF,#060f1a)',padding:'28px 24px',borderBottom:'1px solid rgba(0,255,200,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'1100px',margin:'0 auto',position:'relative'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'#2ECC71',letterSpacing:'0.2em',marginBottom:'6px',fontFamily:'var(--font-display)'}}>API DOCUMENTATION</div>
          <h1 style={{fontSize:'24px',fontWeight:900,color:'var(--text-primary)',marginBottom:'8px'}}>Global FDI Monitor REST API</h1>
          <p style={{fontSize:'13px',color:'var(--text-muted)',marginBottom:'14px'}}>
            Base URL: <code style={{background:'rgba(46,204,113,0.08)',padding:'2px 8px',borderRadius:'5px',color:'var(--accent-green)',fontFamily:'var(--font-mono)'}}>https://api.fdimonitor.org</code>
            &nbsp;· WebSocket: <code style={{background:'rgba(155,89,182,0.08)',padding:'2px 8px',borderRadius:'5px',color:'#9b59b6',fontFamily:'var(--font-mono)'}}>wss://api.fdimonitor.org/ws/signals</code>
          </p>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            {[['Auth','Bearer token in Authorization header'],['Rate Limits','Professional: 1,000/day · Enterprise: Unlimited'],['Format','JSON · UTF-8 · gzip'],['Version','v1 (stable)']].map(([l,v])=>(
              <div key={String(l)} style={{padding:'5px 12px',background:'var(--bg-subtle)',borderRadius:'6px',border:'1px solid var(--border)'}}>
                <span style={{fontSize:'9px',fontWeight:800,color:'#27ae60'}}>{l}: </span>
                <span style={{fontSize:'10px',color:'var(--text-secondary)'}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'24px'}}>
        <div style={{background:'white',border:'1px solid rgba(0,255,200,0.12)',borderRadius:'12px',padding:'16px 20px',marginBottom:'18px'}}>
          <div style={{fontSize:'10px',fontWeight:700,color:'#2ECC71',letterSpacing:'0.08em',marginBottom:'6px'}}>AUTHENTICATION</div>
          <code style={{fontSize:'12px',color:'rgba(0,255,200,0.8)',fontFamily:'var(--font-mono)',lineHeight:1.8,display:'block'}}>Authorization: Bearer gfm_pro_YOUR_TOKEN_HERE<br/>Content-Type: application/json</code>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
          {ENDPOINTS.map((ep,i)=>{
            const mc=MC[ep.method]||{bg:'rgba(255,255,255,0.05)',color:'var(--text-muted)'};
            const isExp=expanded===i;
            return(
              <div key={i} style={{background:'white',borderRadius:'12px',border:'1px solid var(--border)',overflow:'hidden',boxShadow:isExp?'0 8px 24px rgba(0,0,0,0.4)':'none',transition:'box-shadow 200ms ease'}}>
                <div onClick={()=>setExpanded(isExp?null:i)}
                  style={{padding:'14px 18px',cursor:'pointer',display:'flex',alignItems:'center',gap:'14px',transition:'background 150ms ease'}}
                  onMouseEnter={e=>{if(!isExp)e.currentTarget.style.background='rgba(0,255,200,0.02)';}}
                  onMouseLeave={e=>{if(!isExp)e.currentTarget.style.background='transparent';}}>
                  <span style={{fontSize:'10px',fontWeight:800,padding:'3px 10px',borderRadius:'5px',background:mc.bg,color:mc.color,fontFamily:'var(--font-mono)',minWidth:'48px',textAlign:'center',letterSpacing:'0.04em'}}>{ep.method}</span>
                  <code style={{fontSize:'13px',fontWeight:700,color:'var(--text-primary)',fontFamily:'var(--font-mono)',flex:1}}>{ep.path}</code>
                  <span style={{fontSize:'12px',color:'var(--text-muted)'}}>{ep.desc}</span>
                  <span style={{fontSize:'18px',color:'#27ae60',marginLeft:'8px',transition:'transform 200ms ease',transform:isExp?'rotate(45deg)':'none'}}>+</span>
                </div>
                {isExp&&(
                  <div style={{borderTop:'1px solid rgba(0,255,200,0.06)',padding:'16px 18px'}}>
                    {ep.params.length>0&&(
                      <>
                        <div style={{fontSize:'10px',fontWeight:700,color:'#27ae60',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'10px'}}>Parameters</div>
                        <div style={{marginBottom:'16px',display:'flex',flexDirection:'column',gap:'6px'}}>
                          {ep.params.map(p=>(
                            <div key={p.n} style={{display:'flex',gap:'12px',padding:'8px 12px',background:'var(--bg-subtle)',borderRadius:'7px',alignItems:'flex-start'}}>
                              <code style={{fontSize:'12px',fontWeight:700,color:'var(--accent-green)',fontFamily:'var(--font-mono)',minWidth:'100px'}}>{p.n}</code>
                              <span style={{fontSize:'10px',fontWeight:700,color:'#3498DB',minWidth:'56px'}}>{p.t}</span>
                              <span style={{fontSize:'12px',color:'var(--text-muted)'}}>{p.d}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                      <div style={{fontSize:'10px',fontWeight:700,color:'#27ae60',textTransform:'uppercase',letterSpacing:'0.08em'}}>Example Response</div>
                      <button onClick={()=>copy(i,ep.example)} style={{padding:'4px 10px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(0,255,200,0.15)',borderRadius:'6px',cursor:'pointer',fontSize:'10px',fontWeight:700,color:'var(--accent-green)',fontFamily:'var(--font-ui)'}}>
                        {copied===i?'✓ Copied':'Copy'}
                      </button>
                    </div>
                    <pre style={{background:'rgba(0,0,0,0.4)',padding:'14px 16px',borderRadius:'10px',fontSize:'11px',color:'rgba(0,255,200,0.8)',fontFamily:'var(--font-mono)',overflow:'auto',margin:0,lineHeight:1.65,maxHeight:'160px',border:'1px solid rgba(0,255,200,0.08)'}}>
                      {JSON.stringify(JSON.parse(ep.example),null,2)}
                    </pre>
                    <div style={{marginTop:'12px',padding:'10px 14px',background:'rgba(0,180,216,0.05)',borderRadius:'9px',border:'1px solid var(--border)'}}>
                      <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,180,216,0.6)',marginBottom:'4px'}}>CURL EXAMPLE</div>
                      <code style={{fontSize:'11px',color:'rgba(0,180,216,0.8)',fontFamily:'var(--font-mono)'}}>
                        curl -H "Authorization: Bearer YOUR_TOKEN" https://api.fdimonitor.org{ep.path.replace(':id','SGP')}
                      </code>
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
