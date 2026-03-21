'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle, XCircle, Edit3, Eye, Download, Send, Bell, Settings } from 'lucide-react';

const ISSUE = {
  id:47,week:'March 16–22, 2026',generated:'March 23, 2026 00:32 GMT',conf:94,subscribers:12847,
  headline:'ASEAN EV Corridor: $25B Supply Chain Investment Reshapes Southeast Asia',
  sections:[
    {n:1,title:'Top Global Update',status:'VERIFIED',conf:94,src:'Ministry VN · Thailand BOI · MITI Malaysia',body:'Vietnam, Thailand, Malaysia form ASEAN EV Corridor — $25B supply chain investment. Three nations sign landmark agreement. Harmonised incentives, cross-border tariff elimination, joint infrastructure development.'},
    {n:2,title:'Regional Updates',status:'REVIEW',conf:91,src:'6 official sources · 1 wire service',body:'Asia Pacific (+0.6): Vietnam EV subsidy, Malaysia 100% FDI cap, Thailand $2B package. Middle East: UAE $10B AI fund, Saudi PIF $15B renewables. Americas: Brazil Amazon $5B data center.'},
    {n:3,title:'Sector Intelligence',status:'VERIFIED',conf:93,src:'8 sector authority sources',body:'EV Battery: Momentum 92/100 ▲+12. AI Data Centers: 78/100 ▲+8. Top 3 destinations by GOSA score with key signal correlation.'},
    {n:4,title:'Top 5 Signals',status:'VERIFIED',conf:95,src:'All T1/T2 government verified',body:'#1 POLICY Malaysia SCI 96 · #2 INCENTIVE Thailand SCI 95 · #3 GROWTH Vietnam SCI 92 · #4 ZONE Indonesia SCI 91 · #5 DEAL Indonesia SCI 93'},
  ],
  signals:[
    {n:1,type:'POLICY CHANGE',country:'Malaysia',impact:'HIGH',conf:96,implication:'$5B+ data center investment expected'},
    {n:2,type:'NEW INCENTIVE',country:'Thailand',impact:'HIGH',conf:95,implication:'5-8 new battery facilities by 2028'},
    {n:3,type:'SECTOR GROWTH',country:'Vietnam',impact:'MED',conf:92,implication:'#2 ASEAN electronics exporter'},
    {n:4,type:'ZONE AVAIL',country:'Indonesia',impact:'MED',conf:91,implication:'Manufacturing relocation opportunities'},
    {n:5,type:'COMPETITOR MOVE',country:'Indonesia',impact:'HIGH',conf:93,implication:'Nickel supply chain dominance'},
  ],
};

export default function NewsletterPage(){
  const [toast,setToast]=useState<{msg:string,type:'success'|'warn'}|null>(null);
  const [editing,setEditing]=useState<number|null>(null);
  const [tab,setTab]=useState('review');

  function showToast(msg:string,type:'success'|'warn'='success'){setToast({msg,type});setTimeout(()=>setToast(null),3500);}

  return(
    <div style={{minHeight:'100vh',background:'var(--bg-page)',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>
      {toast&&(
        <div style={{position:'fixed',top:'70px',right:'20px',zIndex:1000,padding:'12px 20px',borderRadius:'10px',fontSize:'13px',fontWeight:600,background:toast.type==='success'?'rgba(46,204,113,0.12)':'rgba(255,68,102,0.12)',color:toast.type==='success'?'#2ECC71':'#ff4466',border:`1px solid ${toast.type==='success'?'rgba(46,204,113,0.3)':'rgba(255,68,102,0.25)'}`,boxShadow:'0 8px 32px rgba(0,0,0,0.4)',backdropFilter:'blur(12px)',maxWidth:'400px'}}>
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <div style={{background:'linear-gradient(135deg,#FFFFFF,#060f1a)',padding:'20px 24px',borderBottom:'1px solid rgba(0,255,200,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.02) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'1540px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px',position:'relative'}}>
          <div>
            <div style={{fontSize:'10px',fontWeight:800,color:'#2ECC71',letterSpacing:'0.2em',marginBottom:'4px',fontFamily:'var(--font-display)'}}>NEWSLETTER ADMIN · AGT-06</div>
            <h1 style={{fontSize:'20px',fontWeight:900,color:'var(--text-primary)'}}>Intelligence Brief Management</h1>
          </div>
          <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
            <span style={{fontSize:'11px',color:'var(--text-light)',fontFamily:'var(--font-mono)'}}>
              <span style={{color:'#ffd700',fontWeight:700}}>1</span> pending · <span style={{color:'var(--accent-green)',fontWeight:700}}>{ISSUE.subscribers.toLocaleString()}</span> subscribers
            </span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{background:'var(--bg-page)',borderBottom:'1px solid rgba(0,255,200,0.06)',backdropFilter:'blur(20px)'}}>
        <div style={{maxWidth:'1540px',margin:'0 auto',padding:'0 24px',display:'flex'}}>
          {[['review','Review Dashboard'],['archive','Issue Archive'],['settings','Distribution Settings'],['analytics','Email Analytics']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{padding:'13px 20px',border:'none',borderBottom:`2px solid ${tab===t?'#2ECC71':'transparent'}`,background:'transparent',fontSize:'12px',fontWeight:tab===t?700:400,color:tab===t?'#2ECC71':'rgba(232,244,248,0.45)',cursor:'pointer',fontFamily:'var(--font-ui)',marginBottom:'-1px'}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:'1540px',margin:'0 auto',padding:'20px 24px'}}>
        {tab==='review'&&(
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            {/* Issue header */}
            <div style={{background:'white',border:'1px solid rgba(0,255,200,0.12)',borderRadius:'14px',padding:'22px',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,right:0,width:'200px',height:'200px',background:'radial-gradient(circle at top right, rgba(0,255,200,0.04), transparent)',pointerEvents:'none'}}/>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'12px'}}>
                <div>
                  <div style={{fontSize:'10px',color:'rgba(255,68,102,0.7)',fontWeight:800,letterSpacing:'0.1em',marginBottom:'6px',fontFamily:'var(--font-mono)'}}>ISSUE #{ISSUE.id} · PENDING REVIEW · Generated: {ISSUE.generated}</div>
                  <div style={{fontSize:'20px',fontWeight:900,color:'var(--text-primary)',lineHeight:1.2,marginBottom:'8px',maxWidth:'800px'}}>{ISSUE.headline}</div>
                  <div style={{fontSize:'11px',color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>
                    Week: {ISSUE.week} · Confidence: <span style={{color:'var(--accent-green)',fontWeight:700}}>{ISSUE.conf}%</span> · {ISSUE.subscribers.toLocaleString()} subscribers
                  </div>
                </div>
              </div>
              {/* Action buttons */}
              <div style={{display:'flex',gap:'8px',marginTop:'18px',flexWrap:'wrap'}}>
                {[
                  {id:'approve',label:'APPROVE & DISTRIBUTE',icon:<Send size={12}/>,bg:'linear-gradient(135deg,#00ffc8,#00c49a)',fc:'var(--primary)',act:()=>showToast(`✅ Issue #${ISSUE.id} approved — distributing to ${ISSUE.subscribers.toLocaleString()} subscribers`)},
                  {id:'edit',label:'REQUEST EDITS',icon:<Edit3 size={12}/>,bg:'rgba(255,215,0,0.1)',fc:'#ffd700',brd:'rgba(255,215,0,0.25)',act:()=>showToast('📝 Edit request sent to AGT-06','warn')},
                  {id:'reject',label:'REJECT',icon:<XCircle size={12}/>,bg:'rgba(255,68,102,0.1)',fc:'#ff4466',brd:'rgba(255,68,102,0.25)',act:()=>showToast('⚠ Issue rejected — AGT-06 will regenerate','warn')},
                  {id:'preview',label:'PREVIEW',icon:<Eye size={12}/>,bg:'rgba(0,180,216,0.1)',fc:'#3498DB',brd:'rgba(0,180,216,0.25)',act:()=>showToast('👁 Preview opened in new tab')},
                ].map(a=>(
                  <button key={a.id} onClick={a.act}
                    style={{padding:'9px 16px',background:a.bg,color:a.fc,border:a.brd?`1px solid ${a.brd}`:'none',borderRadius:'8px',cursor:'pointer',fontSize:'11px',fontWeight:800,display:'flex',alignItems:'center',gap:'6px',fontFamily:'var(--font-ui)',letterSpacing:'0.04em',boxShadow:a.id==='approve'?'0 4px 16px rgba(0,255,200,0.2)':'none'}}>
                    {a.icon} {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 sections */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
              {ISSUE.sections.map((sec,idx)=>(
                <div key={idx} style={{background:'white',border:'1px solid var(--border)',borderRadius:'12px',overflow:'hidden'}}>
                  <div style={{padding:'10px 14px',borderBottom:'1px solid rgba(0,255,200,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center',background:sec.status==='VERIFIED'?'rgba(0,255,200,0.03)':'rgba(255,215,0,0.03)'}}>
                    <div>
                      <span style={{fontSize:'9px',fontWeight:800,color:'var(--text-light)',letterSpacing:'0.08em'}}>SECTION {sec.n} · </span>
                      <span style={{fontSize:'11px',fontWeight:700,color:'#1A2C3E'}}>{sec.title.toUpperCase()}</span>
                    </div>
                    <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
                      <span style={{fontSize:'9px',fontWeight:800,padding:'2px 7px',borderRadius:'4px',background:sec.status==='VERIFIED'?'rgba(46,204,113,0.1)':'rgba(255,215,0,0.1)',color:sec.status==='VERIFIED'?'#2ECC71':'#ffd700',letterSpacing:'0.06em'}}>{sec.status==='VERIFIED'?'✓ VERIFIED':'⚠ REVIEW'}</span>
                      <button onClick={()=>setEditing(editing===idx?null:idx)} style={{padding:'2px 8px',background:'var(--bg-subtle)',border:'none',borderRadius:'4px',cursor:'pointer',fontSize:'9px',color:'var(--text-muted)',fontFamily:'var(--font-ui)'}}>
                        {editing===idx?'DONE':'EDIT'}
                      </button>
                    </div>
                  </div>
                  <div style={{padding:'12px 14px'}}>
                    <div style={{fontSize:'9px',color:'var(--text-light)',marginBottom:'6px',fontFamily:'var(--font-mono)'}}>Sources: {sec.src} · AI: {sec.conf}%</div>
                    {editing===idx?(
                      <textarea defaultValue={sec.body} rows={4} style={{width:'100%',padding:'8px',background:'var(--bg-subtle)',border:'1px solid rgba(0,255,200,0.2)',borderRadius:'7px',fontSize:'11px',fontFamily:'var(--font-ui)',outline:'none',resize:'vertical',color:'var(--text-primary)'}}/>
                    ):(
                      <div style={{fontSize:'12px',color:'var(--text-secondary)',lineHeight:1.7}}>{sec.body}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Top 5 signals */}
            <div style={{background:'white',border:'1px solid var(--border)',borderRadius:'12px',overflow:'hidden'}}>
              <div style={{padding:'12px 18px',borderBottom:'1px solid rgba(0,255,200,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center',background:'var(--bg-subtle)'}}>
                <span style={{fontSize:'11px',fontWeight:800,color:'var(--text-secondary)',letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:'var(--font-display)'}}>⚡ Top 5 Investment Signals</span>
                <span style={{fontSize:'10px',color:'var(--text-light)',fontFamily:'var(--font-mono)'}}>All SHA-256 verified</span>
              </div>
              <div style={{padding:'12px 18px',display:'flex',flexDirection:'column',gap:'8px'}}>
                {ISSUE.signals.map(sig=>{
                  const ic=sig.impact==='HIGH'?'#ff4466':sig.impact==='MED'?'#ffd700':'#2ECC71';
                  return(
                    <div key={sig.n} style={{padding:'10px 12px',background:'var(--bg-subtle)',borderRadius:'8px',border:'1px solid var(--border)',display:'flex',alignItems:'center',gap:'12px'}}>
                      <span style={{fontSize:'18px',fontWeight:900,color:'var(--accent-green)',fontFamily:'var(--font-mono)',minWidth:'24px'}}>#{sig.n}</span>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',gap:'6px',marginBottom:'2px',flexWrap:'wrap'}}>
                          <span style={{fontSize:'9px',fontWeight:800,color:'var(--text-secondary)'}}>{sig.type}</span>
                          <span style={{fontSize:'11px',fontWeight:600,color:'var(--text-secondary)'}}>· {sig.country}</span>
                        </div>
                        <div style={{fontSize:'10px',color:'var(--text-muted)'}}>{sig.implication}</div>
                      </div>
                      <div style={{display:'flex',gap:'8px',alignItems:'center',flexShrink:0}}>
                        <span style={{fontSize:'9px',fontWeight:800,padding:'2px 7px',borderRadius:'4px',background:`${ic}12`,color:ic}}>{sig.impact}</span>
                        <span style={{fontSize:'14px',fontWeight:900,color:'#9b59b6',fontFamily:'var(--font-mono)'}}>{sig.conf}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab==='settings'&&(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
            {[
              {title:'SendGrid Email',icon:<Send size={14} color="#00ffc8"/>,fields:[['API Key','SG.••••••••••••••••••'],['From','intelligence@fdimonitor.org'],['From Name','Global FDI Monitor'],['Subscriber List','GFM_Weekly_Subscribers']]},
              {title:'LinkedIn API',icon:<Bell size={14} color="#00d4ff"/>,fields:[['Client ID','86••••••••••••••'],['Access Token','AQ••••••••••••••••'],['Company Page','globalfdimonitor'],['Auto-post','Enabled on Approval']]},
              {title:'AWS S3 Storage',icon:<Download size={14} color="#9b59b6"/>,fields:[['Bucket','gfm-publications-prod'],['Region','me-south-1 (UAE)'],['Access Key ID','AKIA••••••••••••'],['CDN URL','cdn.fdimonitor.org/publications']]},
              {title:'Schedule',icon:<Settings size={14} color="#ffd700"/>,fields:[['Generation','Monday 00:00 GMT'],['Distribution','Tuesday 08:00 GMT'],['Review Window','Mon 10:00-16:00 GMT'],['Auto-approve','Disabled (Manual only)']]},
            ].map(({title,icon,fields})=>(
              <div key={title} style={{background:'white',border:'1px solid var(--border)',borderRadius:'12px',padding:'20px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px',fontWeight:700,fontSize:'14px',color:'var(--text-primary)'}}>
                  {icon} {title}
                </div>
                {fields.map(([l,v])=>(
                  <div key={l} style={{marginBottom:'10px'}}>
                    <div style={{fontSize:'9px',color:'#27ae60',marginBottom:'3px',textTransform:'uppercase',letterSpacing:'0.08em'}}>{l}</div>
                    <input defaultValue={v} style={{width:'100%',padding:'8px 12px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'7px',fontSize:'12px',fontFamily:'var(--font-ui)',outline:'none',color:'var(--text-primary)'}}/>
                  </div>
                ))}
                <button onClick={()=>showToast(`✅ ${title} settings saved`)}
                  style={{width:'100%',marginTop:'4px',padding:'9px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(0,255,200,0.2)',borderRadius:'8px',cursor:'pointer',fontSize:'12px',fontWeight:700,fontFamily:'var(--font-ui)',color:'var(--accent-green)'}}>
                  Save Settings
                </button>
              </div>
            ))}
          </div>
        )}

        {tab==='analytics'&&(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'12px'}}>
            {[['Total Subscribers','12,847','+124 this week','#2ECC71'],['Avg Open Rate','41.2%','+2.1% vs last','#3498DB'],['Avg Click Rate','18.6%','+1.4% vs last','#9b59b6'],['PDF Downloads','3,241','Issue #47 pending','#ffd700']].map(([l,v,d,c])=>(
              <div key={String(l)} style={{background:'white',border:'1px solid var(--border)',borderRadius:'12px',padding:'22px',borderTop:`2px solid ${c}`}}>
                <div style={{fontSize:'10px',color:'var(--text-muted)',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.08em'}}>{l}</div>
                <div style={{fontSize:'30px',fontWeight:900,color:String(c),fontFamily:'var(--font-mono)',textShadow:`0 0 16px ${c}40`}}>{v}</div>
                <div style={{fontSize:'11px',color:'var(--text-light)',marginTop:'4px'}}>{d}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
