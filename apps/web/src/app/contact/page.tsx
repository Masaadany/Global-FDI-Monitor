'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Mail, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({name:'',email:'',org:'',plan:'',message:''});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r=>setTimeout(r,1200));
    setLoading(false);
    setSent(true);
  }

  return (
    <div style={{minHeight:'100vh', background:'#f0f4f8', fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{background:'linear-gradient(135deg,#0f1e2a,#1a2c3e)', padding:'32px 24px', borderBottom:'1px solid rgba(46,204,113,0.1)'}}>
        <div style={{maxWidth:'700px', margin:'0 auto', textAlign:'center'}}>
          <div style={{fontSize:'10px', fontWeight:800, color:'#2ecc71', letterSpacing:'0.12em', marginBottom:'8px'}}>CONTACT</div>
          <h1 style={{fontSize:'28px', fontWeight:900, color:'white', marginBottom:'8px'}}>Get in touch</h1>
          <p style={{fontSize:'14px', color:'rgba(255,255,255,0.6)'}}>Enterprise pricing · API access · Partnership enquiries · Technical support</p>
        </div>
      </div>
      <div style={{maxWidth:'900px', margin:'0 auto', padding:'40px 24px'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', alignItems:'start'}}>
          {/* Contact info */}
          <div>
            {[
              { icon:<Mail size={18} color="#2ecc71"/>, title:'Email', val:'info@fdimonitor.org', sub:'We respond within 24 hours' },
              { icon:'🌐', title:'Platform', val:'fdimonitor.org', sub:'Live · 24/7 access' },
              { icon:'📱', title:'LinkedIn', val:'Global FDI Monitor', sub:'Weekly intelligence updates' },
            ].map(({icon,title,val,sub})=>(
              <div key={title} style={{display:'flex', gap:'14px', alignItems:'center', padding:'18px', background:'white', borderRadius:'14px', border:'1px solid rgba(26,44,62,0.08)', marginBottom:'10px'}}>
                <div style={{width:'42px', height:'42px', borderRadius:'12px', background:'rgba(46,204,113,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:typeof icon==='string'?'20px':'0'}}>
                  {icon}
                </div>
                <div>
                  <div style={{fontSize:'11px', color:'#7f8c8d', marginBottom:'2px'}}>{title}</div>
                  <div style={{fontSize:'14px', fontWeight:700, color:'#1a2c3e'}}>{val}</div>
                  <div style={{fontSize:'11px', color:'#7f8c8d'}}>{sub}</div>
                </div>
              </div>
            ))}
            <div style={{background:'rgba(46,204,113,0.06)', borderRadius:'14px', padding:'18px', border:'1px solid rgba(46,204,113,0.15)', marginTop:'6px'}}>
              <div style={{fontSize:'12px', fontWeight:700, color:'#2ecc71', marginBottom:'6px'}}>TRIAL EXPIRED?</div>
              <div style={{fontSize:'12px', color:'#2c3e50', lineHeight:'1.65'}}>To continue accessing the platform after your trial, contact us or upgrade to Professional at $9,588/year.</div>
            </div>
          </div>
          {/* Form */}
          {sent ? (
            <div style={{background:'white', borderRadius:'16px', padding:'32px', border:'1px solid rgba(26,44,62,0.08)', textAlign:'center'}}>
              <CheckCircle size={40} color="#2ecc71" style={{margin:'0 auto 16px'}}/>
              <h2 style={{fontSize:'20px', fontWeight:800, color:'#1a2c3e', marginBottom:'8px'}}>Message sent!</h2>
              <p style={{fontSize:'13px', color:'#7f8c8d'}}>We'll respond to <strong>{form.email}</strong> within 24 hours.</p>
            </div>
          ) : (
            <div style={{background:'white', borderRadius:'16px', padding:'28px', border:'1px solid rgba(26,44,62,0.08)'}}>
              <form onSubmit={handleSubmit}>
                {[{n:'name',l:'Full Name',p:'Your name'},{n:'email',l:'Email',p:'you@org.com'},{n:'org',l:'Organisation',p:'Company / Government Agency'}].map(({n,l,p})=>(
                  <div key={n} style={{marginBottom:'14px'}}>
                    <label style={{fontSize:'11px', fontWeight:700, color:'#7f8c8d', display:'block', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.05em'}}>{l}</label>
                    <input required type={n==='email'?'email':'text'} placeholder={p} value={(form as any)[n]} onChange={e=>setForm(f=>({...f,[n]:e.target.value}))}
                      style={{width:'100%', padding:'9px 14px', border:'1px solid rgba(26,44,62,0.12)', borderRadius:'8px', fontSize:'13px', fontFamily:'inherit', outline:'none'}}/>
                  </div>
                ))}
                <div style={{marginBottom:'14px'}}>
                  <label style={{fontSize:'11px', fontWeight:700, color:'#7f8c8d', display:'block', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.05em'}}>Enquiry Type</label>
                  <select value={form.plan} onChange={e=>setForm(f=>({...f,plan:e.target.value}))}
                    style={{width:'100%', padding:'9px 14px', border:'1px solid rgba(26,44,62,0.12)', borderRadius:'8px', fontSize:'13px', fontFamily:'inherit', outline:'none', background:'white'}}>
                    <option value="">Select enquiry type</option>
                    <option>Professional Plan</option><option>Enterprise Plan</option><option>API Access</option>
                    <option>Partnership / Integration</option><option>Trial Extension</option><option>Technical Support</option>
                  </select>
                </div>
                <div style={{marginBottom:'20px'}}>
                  <label style={{fontSize:'11px', fontWeight:700, color:'#7f8c8d', display:'block', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.05em'}}>Message</label>
                  <textarea rows={4} required placeholder="Tell us about your requirements..." value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}
                    style={{width:'100%', padding:'9px 14px', border:'1px solid rgba(26,44,62,0.12)', borderRadius:'8px', fontSize:'13px', fontFamily:'inherit', outline:'none', resize:'vertical'}}/>
                </div>
                <button type="submit" disabled={loading}
                  style={{width:'100%', padding:'11px', background:'#1a2c3e', color:'white', border:'none', borderRadius:'9px', cursor:'pointer', fontSize:'13px', fontWeight:800, fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
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
