'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const ENDPOINTS = [
  { method:'GET', path:'/api/v1/countries', desc:'List all economies with GOSA scores', params:[{n:'region',t:'string',d:'Filter by region (Asia Pacific, Middle East, Americas, Europe, Africa, Oceania)'},{ n:'tier',t:'string',d:'Filter by tier (TOP, HIGH)'},{n:'search',t:'string',d:'Search by economy name'},{n:'limit',t:'integer',d:'Max results (default all)'}],
    example:'{"success":true,"count":15,"data":[{"id":"SGP","name":"Singapore","flag":"🇸🇬","gosa":88.4,"l1":92.1,"l2":85.3,"l3":87.2,"l4":89.0,"trend":0.2,"tier":"TOP","region":"Asia Pacific"}]}' },
  { method:'GET', path:'/api/v1/countries/:id', desc:'Get single economy by ISO3 code', params:[{n:'id',t:'path',d:'ISO3 country code (e.g. SGP, MYS, ARE)'}],
    example:'{"success":true,"data":{"id":"MYS","name":"Malaysia","gosa":81.2,"tier":"HIGH"}}' },
  { method:'GET', path:'/api/v1/signals', desc:'Get latest investment signals', params:[{n:'grade',t:'string',d:'PLATINUM | GOLD | SILVER'},{n:'impact',t:'string',d:'HIGH | MEDIUM | LOW'},{n:'type',t:'string',d:'POLICY_CHANGE | NEW_INCENTIVE | SECTOR_GROWTH | ZONE_AVAIL | COMPETITOR_MOVE'},{n:'limit',t:'integer',d:'Max results'}],
    example:'{"success":true,"count":5,"data":[{"id":1,"type":"POLICY_CHANGE","grade":"PLATINUM","country":"Malaysia","title":"FDI cap in data centers raised to 100%","impact":"HIGH","sco":96}]}' },
  { method:'POST', path:'/api/v1/reports/generate', desc:'Generate investment report for an economy', params:[{n:'country_id',t:'string',d:'ISO3 code of target economy'},{n:'report_type',t:'string',d:'investment_analysis | market_entry | benchmark'},{n:'sector',t:'string',d:'Target sector for analysis'}],
    example:'{"success":true,"data":{"report_id":"RPT-1742851234","country":"Malaysia","gosa":81.2,"download_url":"https://api.fdimonitor.org/reports/GFM_MYS_1742851234.html"}}' },
  { method:'POST', path:'/api/v1/auth/register', desc:'Register for free trial access', params:[{n:'name',t:'string',d:'Full name (required)'},{n:'email',t:'string',d:'Work email (required)'},{n:'org',t:'string',d:'Organisation name'},{n:'role',t:'string',d:'Professional role'}],
    example:'{"success":true,"data":{"user_id":"USR-1742851234","tier":"trial","trial_end":"2026-03-28T00:00:00.000Z","token":"gfm_trial_..."}}' },
  { method:'POST', path:'/api/v1/auth/login', desc:'Authenticate and get access token', params:[{n:'email',t:'string',d:'Registered email'},{n:'password',t:'string',d:'Account password'}],
    example:'{"success":true,"data":{"user_id":"USR-demo","tier":"professional","token":"gfm_pro_..."}}' },
  { method:'GET', path:'/api/v1/agents/health', desc:'Get AI agent pipeline status', params:[],
    example:'{"success":true,"agents":[{"id":"AGT-01","name":"Data Collection","status":"active","last_run":"2m ago"},{"id":"AGT-02","name":"Signal Detection","status":"active"}]}' },
  { method:'GET', path:'/api/v1/agents/run', desc:'Trigger full agent pipeline run', params:[],
    example:'{"success":true,"data":{"pipeline":"completed","duration_ms":98,"stages":6,"signals":28,"economies":15}}' },
  { method:'WS', path:'/ws/signals', desc:'WebSocket stream of live investment signals', params:[{n:'—',t:'—',d:'Connect via WebSocket. Receive signal events in real-time every ~8 seconds.'}],
    example:'{"type":"signal","data":{"id":1742851234,"type":"NEW_INCENTIVE","country":"Thailand","title":"New signal","sco":88,"grade":"GOLD","timestamp":"2026-03-21T..."}}' },
];

const MC: Record<string,{bg:string,color:string}> = {
  GET:{bg:'rgba(46,204,113,0.1)',color:'#1e8449'},
  POST:{bg:'rgba(52,152,219,0.1)',color:'#1a6ea8'},
  WS:{bg:'rgba(155,89,182,0.1)',color:'#7d3c98'},
};

export default function ApiDocsPage() {
  const [expanded, setExpanded] = useState<number|null>(0);
  const [copied, setCopied] = useState<number|null>(null);

  function copy(idx: number, text: string) {
    navigator.clipboard?.writeText(text);
    setCopied(idx);
    setTimeout(()=>setCopied(null), 2000);
  }

  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8',fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{background:'linear-gradient(135deg,#0f1e2a,#1a2c3e)',padding:'24px',borderBottom:'1px solid rgba(46,204,113,0.1)'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'#2ecc71',letterSpacing:'0.12em',marginBottom:'6px'}}>API DOCUMENTATION</div>
          <h1 style={{fontSize:'24px',fontWeight:900,color:'white',marginBottom:'8px'}}>Global FDI Monitor REST API</h1>
          <p style={{fontSize:'13px',color:'rgba(255,255,255,0.6)',marginBottom:'16px'}}>Base URL: <code style={{background:'rgba(46,204,113,0.12)',padding:'2px 8px',borderRadius:'5px',color:'#2ecc71',fontFamily:"'JetBrains Mono',monospace"}}>https://api.fdimonitor.org</code> · WebSocket: <code style={{background:'rgba(155,89,182,0.12)',padding:'2px 8px',borderRadius:'5px',color:'#9b59b6',fontFamily:"'JetBrains Mono',monospace"}}>wss://api.fdimonitor.org/ws/signals</code></p>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            {[['Authentication','Bearer token via Authorization header'],['Rate Limits','Professional: 1,000 req/day · Enterprise: Unlimited'],['Format','JSON · UTF-8 · gzip supported'],['Version','v1 (stable)']].map(([l,v])=>(
              <div key={l} style={{padding:'6px 12px',background:'rgba(255,255,255,0.06)',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)'}}>
                <span style={{fontSize:'10px',fontWeight:800,color:'rgba(255,255,255,0.4)'}}>{l}: </span>
                <span style={{fontSize:'10px',color:'rgba(255,255,255,0.7)'}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'24px'}}>
        {/* Auth example */}
        <div style={{background:'#1a2c3e',borderRadius:'14px',padding:'18px 20px',marginBottom:'20px',border:'1px solid rgba(46,204,113,0.15)'}}>
          <div style={{fontSize:'12px',fontWeight:700,color:'#2ecc71',marginBottom:'8px'}}>AUTHENTICATION</div>
          <code style={{fontSize:'12px',color:'rgba(255,255,255,0.8)',fontFamily:"'JetBrains Mono',monospace",lineHeight:'1.8',display:'block'}}>
            {`Authorization: Bearer gfm_pro_YOUR_TOKEN_HERE`}<br/>
            {`Content-Type: application/json`}
          </code>
        </div>

        {/* Endpoints */}
        <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
          {ENDPOINTS.map((ep,i)=>{
            const mc=MC[ep.method]||{bg:'rgba(26,44,62,0.08)',color:'#7f8c8d'};
            const isExp=expanded===i;
            return (
              <div key={i} style={{background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',overflow:'hidden',boxShadow:isExp?'0 8px 20px rgba(0,0,0,0.08)':'none'}}>
                <div onClick={()=>setExpanded(isExp?null:i)}
                  style={{padding:'14px 20px',cursor:'pointer',display:'flex',alignItems:'center',gap:'14px'}}>
                  <span style={{fontSize:'11px',fontWeight:800,padding:'3px 10px',borderRadius:'6px',background:mc.bg,color:mc.color,fontFamily:"'JetBrains Mono',monospace",minWidth:'52px',textAlign:'center'}}>{ep.method}</span>
                  <code style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e',fontFamily:"'JetBrains Mono',monospace",flex:1}}>{ep.path}</code>
                  <span style={{fontSize:'12px',color:'#7f8c8d'}}>{ep.desc}</span>
                  <span style={{fontSize:'16px',color:'#7f8c8d',marginLeft:'8px'}}>{isExp?'−':'+'}</span>
                </div>
                {isExp && (
                  <div style={{borderTop:'1px solid rgba(26,44,62,0.06)',padding:'18px 20px'}}>
                    {ep.params.length>0 && (
                      <>
                        <div style={{fontSize:'11px',fontWeight:700,color:'#7f8c8d',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'10px'}}>Parameters</div>
                        <div style={{marginBottom:'16px',display:'flex',flexDirection:'column',gap:'6px'}}>
                          {ep.params.map(p=>(
                            <div key={p.n} style={{display:'flex',gap:'12px',padding:'8px 12px',background:'rgba(26,44,62,0.02)',borderRadius:'8px',alignItems:'flex-start'}}>
                              <code style={{fontSize:'12px',fontWeight:700,color:'#2ecc71',fontFamily:"'JetBrains Mono',monospace",minWidth:'120px'}}>{p.n}</code>
                              <span style={{fontSize:'10px',fontWeight:700,color:'#3498db',minWidth:'60px'}}>{p.t}</span>
                              <span style={{fontSize:'12px',color:'#7f8c8d'}}>{p.d}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    <div style={{fontSize:'11px',fontWeight:700,color:'#7f8c8d',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span>Example Response</span>
                      <button onClick={()=>copy(i,ep.example)}
                        style={{padding:'4px 10px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(46,204,113,0.2)',borderRadius:'6px',cursor:'pointer',fontSize:'10px',fontWeight:600,color:'#2ecc71',fontFamily:'inherit'}}>
                        {copied===i?'✓ Copied':'Copy'}
                      </button>
                    </div>
                    <pre style={{background:'#0f1e2a',padding:'14px 16px',borderRadius:'10px',fontSize:'11px',color:'#2ecc71',fontFamily:"'JetBrains Mono',monospace",overflow:'auto',margin:0,lineHeight:'1.65',maxHeight:'200px'}}>
                      {JSON.stringify(JSON.parse(ep.example),null,2)}
                    </pre>
                    {/* Quick try */}
                    <div style={{marginTop:'14px',padding:'12px 14px',background:'rgba(52,152,219,0.06)',borderRadius:'10px',border:'1px solid rgba(52,152,219,0.15)'}}>
                      <div style={{fontSize:'11px',fontWeight:700,color:'#3498db',marginBottom:'6px'}}>CURL EXAMPLE</div>
                      <code style={{fontSize:'11px',color:'rgba(52,152,219,0.9)',fontFamily:"'JetBrains Mono',monospace"}}>
                        curl -H "Authorization: Bearer YOUR_TOKEN" https://api.fdimonitor.org{ep.path.replace(':id','SGP')}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SDK note */}
        <div style={{marginTop:'24px',background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',padding:'22px'}}>
          <h3 style={{fontSize:'15px',fontWeight:800,color:'#1a2c3e',marginBottom:'12px'}}>SDK & Integration Support</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px'}}>
            {[['JavaScript / Node.js','npm install gfm-sdk · TypeScript definitions included'],
              ['Python','pip install gfm-intelligence · Pandas integration'],
              ['REST / Any Language','Standard JSON REST API works with any HTTP client']].map(([l,d])=>(
              <div key={l} style={{padding:'14px',background:'rgba(26,44,62,0.02)',borderRadius:'10px',border:'1px solid rgba(26,44,62,0.07)'}}>
                <div style={{fontSize:'12px',fontWeight:700,color:'#1a2c3e',marginBottom:'4px'}}>{l}</div>
                <div style={{fontSize:'11px',color:'#7f8c8d'}}>{d}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:'14px',fontSize:'12px',color:'#7f8c8d'}}>
            API access available on Professional ($9,588/yr) and Enterprise plans. Contact <a href="mailto:info@fdimonitor.org" style={{color:'#2ecc71',textDecoration:'none'}}>info@fdimonitor.org</a> for enterprise integration support.
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
