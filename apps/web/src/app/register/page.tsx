'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Eye, EyeOff, Globe, Zap, BarChart3 } from 'lucide-react';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', org:'', role:'', password:'' });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r=>setTimeout(r,1400));
    setLoading(false);
    setDone(true);
  }

  const roles = ['Strategy / Investment','Corporate Development','Government / Economic Development','Private Equity / VC','Research / Academia','Other'];

  if(done) return (
    <div style={{minHeight:'100vh', background:'#0f1e2a', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <div style={{background:'white', borderRadius:'20px', padding:'40px', maxWidth:'480px', width:'100%', textAlign:'center'}}>
        <div style={{width:'64px', height:'64px', background:'rgba(46,204,113,0.12)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px'}}>
          <CheckCircle size={32} color="#2ecc71"/>
        </div>
        <h1 style={{fontSize:'24px', fontWeight:900, color:'#1a2c3e', marginBottom:'8px'}}>Welcome to Global FDI Monitor</h1>
        <p style={{fontSize:'14px', color:'#7f8c8d', marginBottom:'24px', lineHeight:'1.65'}}>
          Your 7-day free trial is active. Access all features including the Dashboard, Investment Analysis, GFR Ranking, and generate up to 2 PDF reports.
        </p>
        <div style={{background:'rgba(46,204,113,0.06)', borderRadius:'12px', padding:'16px', marginBottom:'24px', border:'1px solid rgba(46,204,113,0.2)'}}>
          <div style={{fontSize:'12px', color:'#7f8c8d', marginBottom:'8px'}}>TRIAL INCLUDES</div>
          {['7 days full platform access','2 PDF report downloads','3 country searches','All 7 dashboard widgets','GFR Ranking access','Live signals feed'].map(f=>(
            <div key={f} style={{display:'flex', alignItems:'center', gap:'8px', padding:'4px 0', fontSize:'13px', color:'#1a2c3e'}}>
              <CheckCircle size={13} color="#2ecc71"/>{f}
            </div>
          ))}
        </div>
        <Link href="/dashboard" style={{display:'block', padding:'13px', background:'#2ecc71', color:'#0f1e2a', borderRadius:'10px', textDecoration:'none', fontSize:'14px', fontWeight:800, marginBottom:'10px'}}>
          Go to Dashboard →
        </Link>
        <p style={{fontSize:'11px', color:'#7f8c8d'}}>Check <strong>{form.email||'your email'}</strong> for confirmation</p>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh', background:'#0f1e2a', display:'flex', fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      {/* Left panel */}
      <div style={{flex:'0 0 420px', background:'linear-gradient(160deg,#1a2c3e,#0f1e2a)', padding:'40px', display:'flex', flexDirection:'column', borderRight:'1px solid rgba(46,204,113,0.1)'}}>
        <Link href="/" style={{textDecoration:'none', marginBottom:'40px', display:'flex', alignItems:'center', gap:'10px'}}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="#2ecc71" strokeWidth="1.5" opacity="0.4"/>
            <circle cx="16" cy="16" r="10" stroke="#2ecc71" strokeWidth="1" opacity="0.6"/>
            <path d="M16 26 L20 14 L16 6" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <circle cx="20" cy="14" r="2.5" fill="#2ecc71"/>
          </svg>
          <span style={{fontSize:'14px', fontWeight:900, letterSpacing:'0.04em'}}>
            <span style={{color:'white'}}>GLOBAL </span><span style={{color:'#2ecc71'}}>FDI</span><span style={{color:'white'}}> MONITOR</span>
          </span>
        </Link>
        <div style={{flex:1}}>
          <h1 style={{fontSize:'28px', fontWeight:900, color:'white', marginBottom:'8px', lineHeight:'1.2'}}>Start your free 7-day trial</h1>
          <p style={{fontSize:'14px', color:'rgba(255,255,255,0.55)', marginBottom:'32px', lineHeight:'1.7'}}>No credit card required. Full access to the world's most advanced FDI intelligence platform.</p>
          {[
            { icon:<Globe size={18} color="#2ecc71"/>, title:'215+ Economies', desc:'Complete global coverage with GOSA scores' },
            { icon:<Zap size={18} color="#f1c40f"/>, title:'Real-time Signals', desc:'Live FDI signals from 304+ official sources' },
            { icon:<BarChart3 size={18} color="#3498db"/>, title:'PDF Reports', desc:'AI-generated investment reports with cover images' },
          ].map(({icon,title,desc})=>(
            <div key={title} style={{display:'flex', gap:'14px', marginBottom:'20px', padding:'14px 16px', background:'rgba(255,255,255,0.04)', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.07)'}}>
              <div style={{width:'38px', height:'38px', borderRadius:'10px', background:'rgba(46,204,113,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                {icon}
              </div>
              <div>
                <div style={{fontSize:'13px', fontWeight:700, color:'white', marginBottom:'2px'}}>{title}</div>
                <div style={{fontSize:'12px', color:'rgba(255,255,255,0.45)'}}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{fontSize:'11px', color:'rgba(255,255,255,0.3)'}}>
          Professional plan from $9,588/year · Enterprise: Custom pricing
        </div>
      </div>
      {/* Right panel */}
      <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px'}}>
        <div style={{background:'white', borderRadius:'20px', padding:'36px', width:'100%', maxWidth:'440px', boxShadow:'0 24px 48px rgba(0,0,0,0.3)'}}>
          <h2 style={{fontSize:'22px', fontWeight:800, color:'#1a2c3e', marginBottom:'6px'}}>Create your account</h2>
          <p style={{fontSize:'13px', color:'#7f8c8d', marginBottom:'24px'}}>Join 12,847 investment professionals</p>
          <form onSubmit={handleSubmit}>
            {[
              {name:'name', label:'Full Name', placeholder:'Mahmoud Al-Saadany', type:'text'},
              {name:'email', label:'Work Email', placeholder:'m@organisation.com', type:'email'},
              {name:'org', label:'Organisation', placeholder:'Forecasta / MISA / Goldman Sachs', type:'text'},
            ].map(field=>(
              <div key={field.name} style={{marginBottom:'14px'}}>
                <label style={{fontSize:'11px', fontWeight:700, color:'#7f8c8d', textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:'4px'}}>{field.label}</label>
                <input required type={field.type} placeholder={field.placeholder} value={(form as any)[field.name]}
                  onChange={e=>setForm(f=>({...f,[field.name]:e.target.value}))}
                  style={{width:'100%', padding:'10px 14px', border:'1px solid rgba(26,44,62,0.15)', borderRadius:'9px', fontSize:'13px', fontFamily:'inherit', outline:'none', transition:'border 0.2s'}}/>
              </div>
            ))}
            <div style={{marginBottom:'14px'}}>
              <label style={{fontSize:'11px', fontWeight:700, color:'#7f8c8d', textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:'4px'}}>Role</label>
              <select required value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}
                style={{width:'100%', padding:'10px 14px', border:'1px solid rgba(26,44,62,0.15)', borderRadius:'9px', fontSize:'13px', fontFamily:'inherit', outline:'none', background:'white'}}>
                <option value="">Select your role</option>
                {roles.map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{marginBottom:'20px', position:'relative'}}>
              <label style={{fontSize:'11px', fontWeight:700, color:'#7f8c8d', textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:'4px'}}>Password</label>
              <input required type={showPass?'text':'password'} placeholder="Min. 8 characters" value={form.password}
                onChange={e=>setForm(f=>({...f,password:e.target.value}))}
                style={{width:'100%', padding:'10px 40px 10px 14px', border:'1px solid rgba(26,44,62,0.15)', borderRadius:'9px', fontSize:'13px', fontFamily:'inherit', outline:'none'}}/>
              <button type="button" onClick={()=>setShowPass(!showPass)}
                style={{position:'absolute', right:'12px', top:'28px', background:'none', border:'none', cursor:'pointer', color:'#7f8c8d', padding:'0'}}>
                {showPass?<EyeOff size={16}/>:<Eye size={16}/>}
              </button>
            </div>
            <label style={{display:'flex', alignItems:'flex-start', gap:'10px', marginBottom:'20px', cursor:'pointer'}}>
              <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:'2px', accentColor:'#2ecc71'}}/>
              <span style={{fontSize:'12px', color:'#7f8c8d', lineHeight:'1.55'}}>
                I agree to the <Link href="/terms" style={{color:'#2ecc71', textDecoration:'none', fontWeight:600}}>Terms of Service</Link> and <Link href="/privacy" style={{color:'#2ecc71', textDecoration:'none', fontWeight:600}}>Privacy Policy</Link>
              </span>
            </label>
            <button type="submit" disabled={!agreed||loading}
              style={{width:'100%', padding:'12px', background:agreed?'#2ecc71':'rgba(26,44,62,0.1)', color:agreed?'#0f1e2a':'#7f8c8d',
                border:'none', borderRadius:'10px', cursor:agreed?'pointer':'not-allowed', fontSize:'14px', fontWeight:800, fontFamily:'inherit',
                transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
              {loading ? '⏳ Creating account...' : '🚀 Start Free 7-Day Trial'}
            </button>
          </form>
          <div style={{textAlign:'center', marginTop:'16px', fontSize:'12px', color:'#7f8c8d'}}>
            Already have an account? <Link href="/auth/login" style={{color:'#2ecc71', fontWeight:600, textDecoration:'none'}}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
