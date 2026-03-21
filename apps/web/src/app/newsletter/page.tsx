'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle, XCircle, Edit3, Eye, Download, Send, AlertTriangle, Globe, TrendingUp, Zap } from 'lucide-react';

const ISSUES = [
  {
    id: 47, status:'PENDING_REVIEW', date:'March 24, 2026', week:'March 16-22, 2026',
    generated:'March 23, 2026 00:32 GMT', confidence:94,
    headline:'ASEAN EV Corridor: $25B Supply Chain Investment Reshapes Southeast Asia',
    sections:[
      { title:'Top Global Update', status:'VERIFIED', conf:94, sources:'Ministry VN · Thailand BOI · MITI Malaysia',
        content:'Vietnam, Thailand, Malaysia form "ASEAN EV Corridor" — $25B supply chain investment. Three nations sign landmark agreement. Harmonised incentives, cross-border tariff elimination, joint infrastructure development.' },
      { title:'Regional Updates', status:'REVIEW', conf:91, sources:'6 official sources · 1 wire service',
        content:'Asia Pacific (+0.6): Vietnam EV subsidy, Malaysia 100% FDI cap data centers, Thailand $2B package. Europe & ME: UAE $10B AI fund, Saudi PIF $15B renewables. Americas: Brazil Amazon $5B data center.' },
      { title:'Sector Updates', status:'VERIFIED', conf:93, sources:'8 sector authority sources',
        content:'EV Battery: Momentum 92/100 ▲+12. AI Data Centers: 78/100 ▲+8. Top 3 destinations with GOSA scores. Market Intel Layer signals correlated.' },
      { title:'Top 5 Investment Signals', status:'VERIFIED', conf:95, sources:'All T1/T2 government verified',
        content:'#1 POLICY Malaysia SCI 96 · #2 INCENTIVE Thailand SCI 95 · #3 GROWTH Vietnam SCI 92 · #4 ZONE Indonesia SCI 91 · #5 COMPETITOR Indonesia SCI 93' },
    ],
    signals:[
      { n:1, type:'POLICY CHANGE',    country:'Malaysia',  impact:'HIGH',   conf:96, implication:'$5B+ data center investment expected' },
      { n:2, type:'NEW INCENTIVE',    country:'Thailand',  impact:'HIGH',   conf:95, implication:'5-8 new battery facilities by 2028' },
      { n:3, type:'SECTOR GROWTH',    country:'Vietnam',   impact:'MEDIUM', conf:92, implication:'#2 ASEAN electronics exporter' },
      { n:4, type:'ZONE AVAILABILITY',country:'Indonesia', impact:'MEDIUM', conf:91, implication:'Manufacturing relocation opportunities' },
      { n:5, type:'COMPETITOR MOVE',  country:'Indonesia', impact:'HIGH',   conf:93, implication:'Nickel supply chain dominance' },
    ],
    subscribers: 12847, scheduledSend:'Tuesday, March 24, 2026, 08:00 GMT',
  },
  {
    id:46, status:'PUBLISHED', date:'March 17, 2026', week:'March 9-15, 2026',
    generated:'March 16, 2026 00:28 GMT', confidence:96,
    headline:"Malaysia's Data Center Boom: $5B+ Investment Expected as 100% FDI Cap Takes Effect",
    sections:[], signals:[], subscribers:12634, scheduledSend:'Published',
  },
  {
    id:45, status:'PUBLISHED', date:'March 10, 2026', week:'March 2-8, 2026',
    generated:'March 9, 2026 00:31 GMT', confidence:92,
    headline:"Vietnam's Electronics Surge: 34% Export Growth Signals Supply Chain Shift",
    sections:[], signals:[], subscribers:12521, scheduledSend:'Published',
  },
];

const statusColors: Record<string,{bg:string,color:string}> = {
  PENDING_REVIEW:{ bg:'rgba(241,196,15,0.12)', color:'#7a6400' },
  VERIFIED:{ bg:'rgba(46,204,113,0.12)', color:'#1e8449' },
  REVIEW:{ bg:'rgba(241,196,15,0.12)', color:'#7a6400' },
  PUBLISHED:{ bg:'rgba(52,152,219,0.12)', color:'#1a6ea8' },
};

export default function NewsletterPage() {
  const [selectedIssue, setSelectedIssue] = useState(ISSUES[0]);
  const [activeAction, setActiveAction] = useState<string|null>(null);
  const [editingSection, setEditingSection] = useState<number|null>(null);
  const [toast, setToast] = useState<{msg:string,type:'success'|'warn'}|null>(null);
  const [tab, setTab] = useState('review');

  function showToast(msg: string, type: 'success'|'warn' = 'success') {
    setToast({ msg, type });
    setTimeout(()=>setToast(null), 3500);
  }

  function handleAction(action: string) {
    setActiveAction(action);
    if(action==='approve') showToast('✅ Issue #'+selectedIssue.id+' approved — distributing to '+selectedIssue.subscribers.toLocaleString()+' subscribers via SendGrid');
    if(action==='reject') showToast('⚠ Issue rejected — AGT-06 will regenerate with feedback', 'warn');
    if(action==='request_edits') showToast('📝 Edit request sent to AI pipeline', 'warn');
  }

  return (
    <div style={{minHeight:'100vh', background:'#f0f4f8', fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <NavBar/>
      {/* Toast */}
      {toast && (
        <div style={{position:'fixed', top:'70px', right:'20px', zIndex:1000, padding:'12px 20px', borderRadius:'10px', fontSize:'13px', fontWeight:600,
          background: toast.type==='success' ? '#1e8449' : '#7a6400', color:'white', boxShadow:'0 8px 24px rgba(0,0,0,0.2)', maxWidth:'400px', lineHeight:'1.5'}}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#0f1e2a,#1a2c3e)', padding:'18px 24px', borderBottom:'1px solid rgba(46,204,113,0.1)'}}>
        <div style={{maxWidth:'1440px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px'}}>
          <div>
            <div style={{fontSize:'10px', fontWeight:800, color:'#2ecc71', letterSpacing:'0.12em', marginBottom:'4px'}}>ADMIN DASHBOARD</div>
            <h1 style={{fontSize:'20px', fontWeight:900, color:'white'}}>Newsletter Management — AGT-06 Pipeline</h1>
          </div>
          <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
            <div style={{fontSize:'12px', color:'rgba(255,255,255,0.5)'}}>
              <span style={{color:'#f1c40f', fontWeight:700}}>{ISSUES.filter(i=>i.status==='PENDING_REVIEW').length}</span> pending · 
              <span style={{color:'#2ecc71', fontWeight:700, marginLeft:'4px'}}>{selectedIssue.subscribers.toLocaleString()}</span> subscribers
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{background:'white', borderBottom:'2px solid rgba(26,44,62,0.08)'}}>
        <div style={{maxWidth:'1440px', margin:'0 auto', padding:'0 24px', display:'flex'}}>
          {[['review','Review Dashboard'],['archive','Issue Archive'],['settings','Distribution Settings'],['analytics','Email Analytics']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{padding:'13px 20px', border:'none', borderBottom:`3px solid ${tab===t?'#2ecc71':'transparent'}`,
                background:'transparent', fontSize:'12px', fontWeight:tab===t?700:500,
                color:tab===t?'#1a2c3e':'#7f8c8d', cursor:'pointer', fontFamily:'inherit', marginBottom:'-2px'}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:'1440px', margin:'0 auto', padding:'20px 24px'}}>
        {tab === 'review' && (
          <div style={{display:'grid', gridTemplateColumns:'260px 1fr', gap:'16px', alignItems:'start'}}>
            {/* Issue selector */}
            <div style={{background:'white', borderRadius:'14px', border:'1px solid rgba(26,44,62,0.08)', overflow:'hidden'}}>
              <div style={{padding:'12px 14px', borderBottom:'1px solid rgba(26,44,62,0.06)', fontSize:'11px', fontWeight:700, color:'#7f8c8d', textTransform:'uppercase', letterSpacing:'0.06em'}}>
                Recent Issues
              </div>
              {ISSUES.map(issue=>{
                const sc = statusColors[issue.status];
                return (
                  <div key={issue.id} onClick={()=>setSelectedIssue(issue)}
                    style={{padding:'12px 14px', cursor:'pointer', borderBottom:'1px solid rgba(26,44,62,0.05)',
                      background:selectedIssue.id===issue.id?'rgba(46,204,113,0.05)':'white',
                      borderLeft:selectedIssue.id===issue.id?'3px solid #2ecc71':'3px solid transparent'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px'}}>
                      <span style={{fontSize:'11px', fontWeight:800, color:'#1a2c3e'}}>Issue #{issue.id}</span>
                      <span style={{fontSize:'9px', fontWeight:800, padding:'2px 6px', borderRadius:'8px', background:sc.bg, color:sc.color}}>
                        {issue.status.replace('_',' ')}
                      </span>
                    </div>
                    <div style={{fontSize:'10px', color:'#7f8c8d'}}>{issue.date}</div>
                    <div style={{fontSize:'10px', color:'#2c3e50', marginTop:'2px', lineHeight:'1.4'}}>
                      {issue.headline.slice(0,55)}...
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main review panel */}
            <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
              {/* Issue header */}
              <div style={{background:'#1a2c3e', borderRadius:'14px', padding:'18px 22px', border:'1px solid rgba(46,204,113,0.1)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'12px'}}>
                  <div>
                    <div style={{fontSize:'10px', color:statusColors[selectedIssue.status].color, fontWeight:800, letterSpacing:'0.08em', marginBottom:'4px'}}>
                      ISSUE #{selectedIssue.id} · {selectedIssue.status.replace('_',' ')} · Generated: {selectedIssue.generated}
                    </div>
                    <div style={{fontSize:'18px', fontWeight:900, color:'white', lineHeight:'1.3', marginBottom:'6px'}}>
                      {selectedIssue.headline}
                    </div>
                    <div style={{fontSize:'11px', color:'rgba(255,255,255,0.5)'}}>
                      Week of {selectedIssue.week} · AI Confidence: <span style={{color:'#2ecc71', fontWeight:700}}>{selectedIssue.confidence}%</span> · {selectedIssue.subscribers.toLocaleString()} subscribers
                    </div>
                  </div>
                </div>
                {/* Action buttons */}
                <div style={{display:'flex', gap:'8px', marginTop:'16px', flexWrap:'wrap'}}>
                  {[
                    {id:'approve', label:'APPROVE & DISTRIBUTE', icon:<Send size={12}/>, bg:'#2ecc71', fc:'#0f1e2a'},
                    {id:'request_edits', label:'REQUEST EDITS', icon:<Edit3 size={12}/>, bg:'#f1c40f', fc:'#0f1e2a'},
                    {id:'reject', label:'REJECT', icon:<XCircle size={12}/>, bg:'#e74c3c', fc:'#ffffff'},
                    {id:'preview_email', label:'PREVIEW EMAIL', icon:<Eye size={12}/>, bg:'#3498db', fc:'#ffffff'},
                    {id:'preview_pdf', label:'PREVIEW PDF', icon:<Download size={12}/>, bg:'rgba(255,255,255,0.15)', fc:'#ffffff'},
                  ].map(a=>(
                    <button key={a.id} onClick={()=>handleAction(a.id)}
                      style={{padding:'8px 14px', background:a.bg, color:a.fc, border:'none', borderRadius:'8px', cursor:'pointer',
                        fontSize:'11px', fontWeight:800, display:'flex', alignItems:'center', gap:'5px', fontFamily:'inherit',
                        letterSpacing:'0.02em', opacity:activeAction&&activeAction!==a.id?0.7:1}}>
                      {a.icon} {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 sections */}
              {selectedIssue.sections.length > 0 && (
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                  {selectedIssue.sections.map((sec, idx)=>{
                    const sc = statusColors[sec.status];
                    const isEdit = editingSection === idx;
                    return (
                      <div key={idx} style={{background:'white', borderRadius:'12px', border:'1px solid rgba(26,44,62,0.08)', overflow:'hidden'}}>
                        <div style={{padding:'10px 14px', background:sec.status==='VERIFIED'?'rgba(46,204,113,0.04)':'rgba(241,196,15,0.04)',
                          borderBottom:'1px solid rgba(26,44,62,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                          <div>
                            <span style={{fontSize:'10px', fontWeight:800, color:'#7f8c8d'}}>SECTION {idx+1}: </span>
                            <span style={{fontSize:'11px', fontWeight:700, color:'#1a2c3e'}}>{sec.title.toUpperCase()}</span>
                          </div>
                          <div style={{display:'flex', gap:'6px', alignItems:'center'}}>
                            <span style={{fontSize:'9px', fontWeight:800, padding:'2px 7px', borderRadius:'8px', background:sc.bg, color:sc.color}}>
                              {sec.status==='VERIFIED'?'✓ VERIFIED':'⚠ REVIEW'}
                            </span>
                            <button onClick={()=>setEditingSection(isEdit?null:idx)}
                              style={{padding:'3px 8px', background:'rgba(26,44,62,0.06)', border:'none', borderRadius:'5px',
                                cursor:'pointer', fontSize:'9px', color:'#7f8c8d', fontFamily:'inherit'}}>
                              {isEdit?'DONE':'EDIT'}
                            </button>
                          </div>
                        </div>
                        <div style={{padding:'12px 14px'}}>
                          <div style={{fontSize:'10px', color:'#7f8c8d', marginBottom:'6px'}}>Sources: {sec.sources} · AI: {sec.conf}%</div>
                          {isEdit ? (
                            <textarea defaultValue={sec.content} rows={4}
                              style={{width:'100%', padding:'8px', border:'1px solid rgba(46,204,113,0.3)', borderRadius:'7px',
                                fontSize:'11px', fontFamily:'inherit', outline:'none', resize:'vertical'}}/>
                          ) : (
                            <div style={{fontSize:'11px', color:'#2c3e50', lineHeight:'1.65'}}>{sec.content}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Top 5 signals */}
              {selectedIssue.signals.length > 0 && (
                <div style={{background:'white', borderRadius:'14px', border:'1px solid rgba(26,44,62,0.08)', overflow:'hidden'}}>
                  <div style={{padding:'12px 18px', borderBottom:'1px solid rgba(26,44,62,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{fontSize:'12px', fontWeight:700, color:'#1a2c3e', display:'flex', alignItems:'center', gap:'6px'}}><Zap size={13} color="#2ecc71"/> TOP 5 INVESTMENT SIGNALS</span>
                    <span style={{fontSize:'10px', color:'#7f8c8d'}}>All SHA-256 verified</span>
                  </div>
                  <div style={{padding:'12px 18px', display:'flex', flexDirection:'column', gap:'8px'}}>
                    {selectedIssue.signals.map(sig=>{
                      const impC = {HIGH:'#e74c3c', MEDIUM:'#f1c40f', LOW:'#2ecc71'};
                      return (
                        <div key={sig.n} style={{padding:'10px 12px', background:'rgba(26,44,62,0.02)', borderRadius:'8px', border:'1px solid rgba(26,44,62,0.06)',
                          display:'flex', alignItems:'center', gap:'12px'}}>
                          <span style={{fontSize:'16px', fontWeight:900, color:'#2ecc71', fontFamily:"'JetBrains Mono',monospace", minWidth:'20px'}}>#{sig.n}</span>
                          <div style={{flex:1}}>
                            <div style={{display:'flex', gap:'6px', alignItems:'center', marginBottom:'2px', flexWrap:'wrap'}}>
                              <span style={{fontSize:'9px', fontWeight:800, color:'#1a2c3e'}}>{sig.type}</span>
                              <span style={{fontSize:'11px', fontWeight:600, color:'#2c3e50'}}>· {sig.country}</span>
                            </div>
                            <div style={{fontSize:'10px', color:'#7f8c8d'}}>{sig.implication}</div>
                          </div>
                          <div style={{display:'flex', gap:'6px', alignItems:'center', flexShrink:0}}>
                            <span style={{fontSize:'9px', fontWeight:800, padding:'2px 6px', borderRadius:'6px',
                              background:(impC as any)[sig.impact]+'15', color:(impC as any)[sig.impact]}}>{sig.impact}</span>
                            <span style={{fontSize:'11px', fontWeight:800, color:'#9b59b6', fontFamily:"'JetBrains Mono',monospace"}}>{sig.conf}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Distribution settings */}
              <div style={{background:'white', borderRadius:'14px', border:'1px solid rgba(26,44,62,0.08)', padding:'18px 22px'}}>
                <div style={{fontSize:'12px', fontWeight:700, color:'#1a2c3e', marginBottom:'14px', display:'flex', alignItems:'center', gap:'6px'}}>
                  <Send size={13} color="#2ecc71"/> Distribution Settings
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px'}}>
                  {[
                    {l:'Email Subscribers', v:selectedIssue.subscribers.toLocaleString()+' active', c:'#2ecc71'},
                    {l:'Scheduled Send', v:selectedIssue.scheduledSend, c:'#3498db'},
                    {l:'PDF to Publications', v:'Auto-upload on approval', c:'#9b59b6'},
                    {l:'LinkedIn Post', v:'Auto-schedule with cover image', c:'#2ecc71'},
                    {l:'Email Platform', v:'SendGrid API · Tracked links', c:'#f1c40f'},
                    {l:'Distribution Method', v:'HTML Template · Responsive', c:'#e67e22'},
                  ].map(({l,v,c})=>(
                    <div key={l} style={{padding:'10px 12px', background:'rgba(26,44,62,0.02)', borderRadius:'8px', border:'1px solid rgba(26,44,62,0.06)'}}>
                      <div style={{fontSize:'10px', color:'#7f8c8d', marginBottom:'2px', textTransform:'uppercase', letterSpacing:'0.05em'}}>{l}</div>
                      <div style={{fontSize:'12px', fontWeight:600, color:c}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'archive' && (
          <div style={{background:'white', borderRadius:'14px', border:'1px solid rgba(26,44,62,0.08)', overflow:'hidden'}}>
            <div style={{padding:'14px 20px', borderBottom:'1px solid rgba(26,44,62,0.06)', fontSize:'12px', fontWeight:700, color:'#1a2c3e'}}>
              All Issues
            </div>
            {ISSUES.map(issue=>{
              const sc = statusColors[issue.status];
              return (
                <div key={issue.id} style={{padding:'14px 20px', borderBottom:'1px solid rgba(26,44,62,0.05)', display:'flex', alignItems:'center', gap:'16px'}}>
                  <div style={{background:'#1a2c3e', borderRadius:'8px', padding:'8px 12px', textAlign:'center', minWidth:'56px'}}>
                    <div style={{fontSize:'9px', color:'rgba(255,255,255,0.4)'}}>ISSUE</div>
                    <div style={{fontSize:'18px', fontWeight:900, color:'#2ecc71', fontFamily:"'JetBrains Mono',monospace", lineHeight:1}}>{issue.id}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'13px', fontWeight:700, color:'#1a2c3e', marginBottom:'2px'}}>{issue.headline}</div>
                    <div style={{fontSize:'11px', color:'#7f8c8d'}}>{issue.date} · {issue.subscribers.toLocaleString()} subscribers</div>
                  </div>
                  <span style={{fontSize:'10px', fontWeight:800, padding:'3px 10px', borderRadius:'10px', background:sc.bg, color:sc.color}}>
                    {issue.status.replace('_',' ')}
                  </span>
                  <Link href="/publications" style={{padding:'7px 14px', background:'rgba(26,44,62,0.06)', border:'1px solid rgba(26,44,62,0.1)', borderRadius:'7px', textDecoration:'none', fontSize:'11px', fontWeight:600, color:'#1a2c3e'}}>
                    View
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'settings' && (
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
            {[
              { title:'SendGrid Email', icon:<Send size={16} color="#2ecc71"/>, fields:[
                {l:'API Key', v:'SG.••••••••••••••••••••••', type:'password'},
                {l:'From Address', v:'intelligence@fdimonitor.org', type:'text'},
                {l:'From Name', v:'Global FDI Monitor', type:'text'},
                {l:'Subscriber List ID', v:'GFM_Weekly_Subscribers', type:'text'},
              ]},
              { title:'LinkedIn API', icon:<Globe size={16} color="#3498db"/>, fields:[
                {l:'Client ID', v:'86••••••••••••••', type:'password'},
                {l:'Access Token', v:'AQ••••••••••••••••••••••••', type:'password'},
                {l:'Company Page ID', v:'globalfdimonitor', type:'text'},
                {l:'Auto-post on Approval', v:'Enabled', type:'text'},
              ]},
              { title:'AWS S3 Storage', icon:<Download size={16} color="#9b59b6"/>, fields:[
                {l:'Bucket Name', v:'gfm-publications-prod', type:'text'},
                {l:'Region', v:'me-south-1 (UAE)', type:'text'},
                {l:'Access Key ID', v:'AKIA••••••••••••', type:'password'},
                {l:'CDN URL', v:'https://cdn.fdimonitor.org/publications', type:'text'},
              ]},
              { title:'Schedule Settings', icon:<TrendingUp size={16} color="#f1c40f"/>, fields:[
                {l:'Generation Day/Time', v:'Monday 00:00 GMT', type:'text'},
                {l:'Distribution Day/Time', v:'Tuesday 08:00 GMT', type:'text'},
                {l:'Review Window', v:'Monday 10:00 — 16:00 GMT', type:'text'},
                {l:'Auto-approve Threshold', v:'Disabled (Manual only)', type:'text'},
              ]},
            ].map(({title,icon,fields})=>(
              <div key={title} style={{background:'white', borderRadius:'14px', border:'1px solid rgba(26,44,62,0.08)', padding:'20px'}}>
                <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px', fontWeight:700, fontSize:'14px', color:'#1a2c3e'}}>
                  {icon} {title}
                </div>
                {fields.map(({l,v,type})=>(
                  <div key={l} style={{marginBottom:'10px'}}>
                    <div style={{fontSize:'10px', color:'#7f8c8d', marginBottom:'3px', textTransform:'uppercase', letterSpacing:'0.05em'}}>{l}</div>
                    <input defaultValue={v} type={type}
                      style={{width:'100%', padding:'8px 12px', border:'1px solid rgba(26,44,62,0.12)', borderRadius:'7px', fontSize:'12px', fontFamily:'inherit', outline:'none', background:'rgba(26,44,62,0.02)'}}/>
                  </div>
                ))}
                <button onClick={()=>showToast(`✅ ${title} settings saved`)}
                  style={{width:'100%', marginTop:'4px', padding:'8px', background:'#1a2c3e', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:700, fontFamily:'inherit'}}>
                  Save Settings
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'analytics' && (
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'12px', marginBottom:'16px'}}>
            {[
              {l:'Total Subscribers', v:'12,847', d:'+124 this week', c:'#2ecc71'},
              {l:'Avg Open Rate', v:'41.2%', d:'+2.1% vs last month', c:'#3498db'},
              {l:'Avg Click Rate', v:'18.6%', d:'+1.4% vs last month', c:'#9b59b6'},
              {l:'PDF Downloads', v:'3,241', d:'Issue #47 (pending)', c:'#f1c40f'},
            ].map(({l,v,d,c})=>(
              <div key={l} style={{background:'white', borderRadius:'14px', padding:'20px', border:'1px solid rgba(26,44,62,0.08)'}}>
                <div style={{fontSize:'11px', color:'#7f8c8d', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.05em'}}>{l}</div>
                <div style={{fontSize:'28px', fontWeight:900, color:c, fontFamily:"'JetBrains Mono',monospace"}}>{v}</div>
                <div style={{fontSize:'11px', color:'#7f8c8d', marginTop:'4px'}}>{d}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
