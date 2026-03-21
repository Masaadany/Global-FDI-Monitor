'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Mail, Send, CheckCircle, Globe, Zap } from 'lucide-react';

export default function ContactPage(){
  const [form,setForm]=useState({name:'',email:'',org:'',plan:'',message:''});
  const [sent,setSent]=useState(false);
  const [loading,setLoading]=useState(false);

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    setLoading(true);
    await new Promise(r=>setTimeout(r,1200));
    setLoading(false);
    setSent(true);
  }

  return(
    <div style={{minHeight:'100vh',background:'var(--bg-page)',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{background:'linear-gradient(135deg,#FFFFFF,#060f1a)',padding:'40px 24px',borderBottom:'1px solid rgba(0,255,200,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.02) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'700px',margin:'0 auto',textAlign:'center',position:'relative'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'#2ECC71',letterSpacing:'0.2em',marginBottom:'10px',fontFamily:'var(--font-display)'}}>CONTACT</div>
          <h1 style={{fontSize:'28px',fontWeight:900,color:'var(--text-primary)',marginBottom:'8px'}}>Get in Touch</h1>
          <p style={{fontSize:'13px',color:'var(--text-muted)'}}>Enterprise pricing · API access · Partnership · Technical support</p>
        </div>
      </div>

      <div style={{maxWidth:'900px',margin:'0 auto',padding:'48px 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'28px',alignItems:'start'}}>
          {/* Contact info */}
          <div>
            {[
              {icon:<Mail size={18} color="#00ffc8"/>,title:'Email',val:'info@fdimonitor.org',sub:'We respond within 24 hours'},
              {icon:<Globe size={18} color="#00d4ff"/>,title:'Platform',val:'fdimonitor.org',sub:'Live · 24/7 access'},
              {icon:<Zap size={18} color="#ffd700"/>,title:'API Endpoint',val:'api.fdimonitor.org',sub:'REST + WebSocket · v1 stable'},
            ].map(({icon,title,val,sub})=>(
              <div key={title} style={{display:'flex',gap:'14px',alignItems:'center',padding:'18px',background:'white',borderRadius:'12px',border:'1px solid var(--border)',marginBottom:'10px',transition:'all 200ms ease'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(46,204,113,0.15)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(0,180,216,0.1)';}}>
                <div style={{width:'44px',height:'44px',borderRadius:'12px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(0,255,200,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{icon}</div>
                <div>
                  <div style={{fontSize:'10px',color:'var(--text-muted)',marginBottom:'2px',textTransform:'uppercase',letterSpacing:'0.08em'}}>{title}</div>
                  <div style={{fontSize:'14px',fontWeight:700,color:'var(--text-primary)'}}>{val}</div>
                  <div style={{fontSize:'11px',color:'var(--text-muted)'}}>{sub}</div>
                </div>
              </div>
            ))}
            <div style={{background:'rgba(0,255,200,0.04)',borderRadius:'12px',padding:'18px',border:'1px solid rgba(0,255,200,0.1)',marginTop:'6px'}}>
              <div style={{fontSize:'11px',fontWeight:800,color:'rgba(0,255,200,0.7)',marginBottom:'8px',letterSpacing:'0.08em'}}>TRIAL EXPIRED?</div>
              <div style={{fontSize:'12px',color:'var(--text-secondary)',lineHeight:1.7}}>To continue after your trial, contact us or upgrade to Professional at $9,588/year.</div>
            </div>
          </div>

          {/* Form */}
          {sent?(
            <div style={{background:'white',borderRadius:'14px',padding:'40px',border:'1px solid rgba(0,255,200,0.15)',textAlign:'center'}}>
              <CheckCircle size={44} color="#00ffc8" style={{margin:'0 auto 18px',display:'block',filter:'drop-shadow(0 0 12px rgba(0,255,200,0.5))'}}/>
              <h2 style={{fontSize:'22px',fontWeight:800,color:'var(--text-primary)',marginBottom:'8px'}}>Message sent!</h2>
              <p style={{fontSize:'13px',color:'var(--text-muted)'}}>We'll respond to <strong style={{color:'var(--accent-green)'}}>{form.email}</strong> within 24 hours.</p>
            </div>
          ):(
            <div style={{background:'white',borderRadius:'14px',padding:'28px',border:'1px solid var(--border)'}}>
              <form onSubmit={handleSubmit}>
                {[{n:'name',l:'Full Name',p:'Your name',t:'text'},{n:'email',l:'Email',p:'you@org.com',t:'email'},{n:'org',l:'Organisation',p:'Company / Government Agency',t:'text'}].map(({n,l,p,t})=>(
                  <div key={n} style={{marginBottom:'14px'}}>
                    <label style={{fontSize:'10px',fontWeight:700,color:'#2ECC71',display:'block',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>{l}</label>
                    <input required type={t} placeholder={p} value={(form as any)[n]} onChange={e=>setForm(f=>({...f,[n]:e.target.value}))}
                      style={{width:'100%',padding:'10px 14px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'8px',fontSize:'13px',fontFamily:'var(--font-ui)',outline:'none',color:'var(--text-primary)',transition:'border-color 150ms ease'}}
                      onFocus={e=>{e.target.style.borderColor='rgba(46,204,113,0.3)';}}
                      onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.08)';}}/>
                  </div>
                ))}
                <div style={{marginBottom:'14px'}}>
                  <label style={{fontSize:'10px',fontWeight:700,color:'#2ECC71',display:'block',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Enquiry Type</label>
                  <select value={form.plan} onChange={e=>setForm(f=>({...f,plan:e.target.value}))}
                    style={{width:'100%',padding:'10px 14px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'8px',fontSize:'13px',fontFamily:'var(--font-ui)',outline:'none',color:'var(--text-primary)'}}>
                    <option style={{background:'white'}}>Select type</option>
                    {['Professional Plan','Enterprise Plan','API Access','Partnership / Integration','Trial Extension','Technical Support'].map(o=><option key={o} style={{background:'white'}}>{o}</option>)}
                  </select>
                </div>
                <div style={{marginBottom:'20px'}}>
                  <label style={{fontSize:'10px',fontWeight:700,color:'#2ECC71',display:'block',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.08em'}}>Message</label>
                  <textarea rows={4} required placeholder="Tell us about your requirements..." value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}
                    style={{width:'100%',padding:'10px 14px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'8px',fontSize:'13px',fontFamily:'var(--font-ui)',outline:'none',color:'var(--text-primary)',resize:'vertical'}}/>
                </div>
                <button type="submit" disabled={loading}
                  style={{width:'100%',padding:'11px',background:loading?'rgba(46,204,113,0.1)':'linear-gradient(135deg,#00ffc8,#00c49a)',color:loading?'rgba(232,244,248,0.4)':'var(--primary)',border:'none',borderRadius:'9px',cursor:loading?'not-allowed':'pointer',fontSize:'13px',fontWeight:800,fontFamily:'var(--font-ui)',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',transition:'all 200ms ease',boxShadow:loading?'none':'0 4px 16px rgba(0,255,200,0.25)'}}>
                  <Send size={14}/> {loading?'Sending...':'Send Message'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
