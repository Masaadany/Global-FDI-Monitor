'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function RegisterPage(){
  const [showPass,setShowPass]=useState(false);
  const [form,setForm]=useState({name:'',email:'',org:'',role:'',password:''});
  const [agreed,setAgreed]=useState(false);
  const [loading,setLoading]=useState(false);
  const [done,setDone]=useState(false);

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    setLoading(true);
    await new Promise(r=>setTimeout(r,1400));
    setLoading(false);
    setDone(true);
  }

  const roles=['Strategy / Investment','Corporate Development','Government / Economic Development','Private Equity / VC','Research / Academia','Other'];

  if(done) return(
    <div style={{minHeight:'100vh',background:'var(--bg-page)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',fontFamily:"'Inter','Helvetica Neue',sans-serif",position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
      <div style={{background:'white',borderRadius:'18px',padding:'44px',maxWidth:'480px',width:'100%',textAlign:'center',border:'1px solid rgba(0,255,200,0.15)',boxShadow:'0 0 40px rgba(0,255,200,0.08)',position:'relative'}}>
        <div style={{width:'70px',height:'70px',background:'rgba(46,204,113,0.08)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',border:'1px solid rgba(0,255,200,0.2)'}}>
          <CheckCircle size={36} color="#00ffc8" style={{filter:'drop-shadow(0 0 12px rgba(0,255,200,0.6))'}}/>
        </div>
        <h1 style={{fontSize:'24px',fontWeight:900,color:'var(--text-primary)',marginBottom:'8px'}}>Welcome to Global FDI Monitor</h1>
        <p style={{fontSize:'14px',color:'var(--text-muted)',marginBottom:'24px',lineHeight:1.7}}>Your 7-day access is active. Full platform access with 2 PDF report downloads and 3 searches.</p>
        <div style={{background:'rgba(0,255,200,0.05)',borderRadius:'12px',padding:'16px',marginBottom:'24px',border:'1px solid rgba(0,255,200,0.12)'}}>
          {['7 days full platform access','2 PDF report downloads','3 country searches','All 7 HUD dashboard widgets','GFR Ranking access','Live signals — all grades'].map(f=>(
            <div key={f} style={{display:'flex',alignItems:'center',gap:'8px',padding:'5px 0',fontSize:'13px',color:'var(--text-secondary)'}}>
              <CheckCircle size={12} color="#00ffc8"/>{f}
            </div>
          ))}
        </div>
        <Link href="/dashboard" style={{display:'block',padding:'13px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'var(--primary)',borderRadius:'10px',textDecoration:'none',fontSize:'14px',fontWeight:800,marginBottom:'12px',boxShadow:'0 4px 16px rgba(0,255,200,0.3)'}}>
          Go to Dashboard →
        </Link>
        <p style={{fontSize:'11px',color:'var(--text-light)'}}>Confirmation sent to {form.email||'your email'}</p>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:'100vh',background:'var(--bg-page)',display:'flex',fontFamily:"'Inter','Helvetica Neue',sans-serif",overflow:'hidden'}}>
      {/* Left panel */}
      <div style={{flex:'0 0 420px',background:'linear-gradient(160deg,rgba(10,22,40,0.98),rgba(2,12,20,0.98))',padding:'40px',display:'flex',flexDirection:'column',borderRight:'1px solid rgba(0,255,200,0.08)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.03) 1px,transparent 1px)',backgroundSize:'48px 48px',pointerEvents:'none'}}/>
        <Link href="/" style={{textDecoration:'none',marginBottom:'48px',display:'flex',alignItems:'center',gap:'10px',position:'relative'}}>
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="17" stroke="rgba(0,255,200,0.4)" strokeWidth="1.5"/>
            <circle cx="20" cy="20" r="11" stroke="rgba(0,212,255,0.4)" strokeWidth="1"/>
            <path d="M20 32 L24 18 L20 6" stroke="#00ffc8" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <circle cx="24" cy="18" r="3" fill="#00ffc8" style={{filter:'drop-shadow(0 0 6px #00ffc8)'}}/>
          </svg>
          <div style={{fontSize:'13px',fontWeight:900,letterSpacing:'0.06em',fontFamily:'var(--font-display)'}}>
            <span style={{color:'var(--text-primary)'}}>GLOBAL </span><span style={{color:'var(--accent-green)',textShadow:'0 0 12px rgba(0,255,200,0.6)'}}>FDI</span><span style={{color:'var(--text-primary)'}}> MONITOR</span>
          </div>
        </Link>
        <div style={{flex:1,position:'relative'}}>
          <h1 style={{fontSize:'28px',fontWeight:900,color:'var(--text-primary)',marginBottom:'10px',lineHeight:1.15}}>Start your free 7-day trial</h1>
          <p style={{fontSize:'14px',color:'var(--text-muted)',marginBottom:'32px',lineHeight:1.75}}>No credit card required. Full access to the world's most advanced FDI intelligence platform.</p>
          {[
            {icon:'🌍',title:'215+ Economies',desc:'Complete global coverage with GOSA scores'},
            {icon:'⚡',title:'Real-time Signals',desc:'Live FDI signals from 1000+ official sources'},
            {icon:'🏆',title:'GFR Ranking',desc:'Comparable to IMD WCR and Kearney GCR'},
            {icon:'📄',title:'PDF Reports',desc:'AI-generated investment intelligence reports'},
          ].map(({icon,title,desc})=>(
            <div key={title} style={{display:'flex',gap:'14px',marginBottom:'18px',padding:'12px 14px',background:'rgba(0,255,200,0.03)',borderRadius:'10px',border:'1px solid rgba(0,255,200,0.07)'}}>
              <span style={{fontSize:'22px',flexShrink:0}}>{icon}</span>
              <div>
                <div style={{fontSize:'13px',fontWeight:700,color:'var(--text-primary)',marginBottom:'2px'}}>{title}</div>
                <div style={{fontSize:'11px',color:'var(--text-muted)'}}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{fontSize:'11px',color:'var(--text-light)',position:'relative'}}>Professional: $9,588/year · Enterprise: Custom pricing</div>
      </div>

      {/* Right panel — form */}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px',background:'rgba(2,12,20,0.5)'}}>
        <div style={{background:'white',borderRadius:'18px',padding:'36px',width:'100%',maxWidth:'440px',boxShadow:'0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,200,0.08)',border:'1px solid var(--border)'}}>
          <h2 style={{fontSize:'22px',fontWeight:800,color:'var(--text-primary)',marginBottom:'6px'}}>Create your account</h2>
          <p style={{fontSize:'13px',color:'var(--text-muted)',marginBottom:'24px'}}>Join 12,847 investment professionals</p>
          <form onSubmit={handleSubmit}>
            {[{n:'name',l:'Full Name',p:'Mahmoud Al-Saadany',t:'text'},{n:'email',l:'Work Email',p:'m@organisation.com',t:'email'},{n:'org',l:'Organisation',p:'Forecasta / MISA / Goldman Sachs',t:'text'}].map(({n,l,p,t})=>(
              <div key={n} style={{marginBottom:'14px'}}>
                <label style={{fontSize:'10px',fontWeight:700,color:'#2ECC71',textTransform:'uppercase',letterSpacing:'0.08em',display:'block',marginBottom:'4px'}}>{l}</label>
                <input required type={t} placeholder={p} value={(form as any)[n]} onChange={e=>setForm(f=>({...f,[n]:e.target.value}))}
                  style={{width:'100%',padding:'10px 14px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'8px',fontSize:'13px',fontFamily:'var(--font-ui)',outline:'none',color:'var(--text-primary)',transition:'border-color 150ms'}}
                  onFocus={e=>{e.target.style.borderColor='rgba(46,204,113,0.5)';}}
                  onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.08)';}}/>
              </div>
            ))}
            <div style={{marginBottom:'14px'}}>
              <label style={{fontSize:'10px',fontWeight:700,color:'#2ECC71',textTransform:'uppercase',letterSpacing:'0.08em',display:'block',marginBottom:'4px'}}>Role</label>
              <select required value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}
                style={{width:'100%',padding:'10px 14px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'8px',fontSize:'13px',fontFamily:'var(--font-ui)',outline:'none',color:'var(--text-primary)'}}>
                <option value="" style={{background:'white'}}>Select your role</option>
                {roles.map(r=><option key={r} style={{background:'white'}}>{r}</option>)}
              </select>
            </div>
            <div style={{marginBottom:'20px',position:'relative'}}>
              <label style={{fontSize:'10px',fontWeight:700,color:'#2ECC71',textTransform:'uppercase',letterSpacing:'0.08em',display:'block',marginBottom:'4px'}}>Password</label>
              <input required type={showPass?'text':'password'} placeholder="Min. 8 characters" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}
                style={{width:'100%',padding:'10px 40px 10px 14px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'8px',fontSize:'13px',fontFamily:'var(--font-ui)',outline:'none',color:'var(--text-primary)'}}/>
              <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:'12px',top:'28px',background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',padding:0,lineHeight:1}}>
                {showPass?<EyeOff size={15}/>:<Eye size={15}/>}
              </button>
            </div>
            <label style={{display:'flex',alignItems:'flex-start',gap:'10px',marginBottom:'20px',cursor:'pointer'}}>
              <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:'2px',accentColor:'#2ECC71'}}/>
              <span style={{fontSize:'12px',color:'var(--text-muted)',lineHeight:1.6}}>
                I agree to the <Link href="/terms" style={{color:'var(--accent-green)',textDecoration:'none',fontWeight:600}}>Terms</Link> and <Link href="/privacy" style={{color:'var(--accent-green)',textDecoration:'none',fontWeight:600}}>Privacy Policy</Link>
              </span>
            </label>
            <button type="submit" disabled={!agreed||loading}
              style={{width:'100%',padding:'12px',background:agreed?'linear-gradient(135deg,#00ffc8,#00c49a)':'rgba(255,255,255,0.06)',color:agreed?'var(--primary)':'rgba(232,244,248,0.3)',border:'none',borderRadius:'10px',cursor:agreed?'pointer':'not-allowed',fontSize:'14px',fontWeight:800,fontFamily:'var(--font-ui)',transition:'all 200ms',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',boxShadow:agreed?'0 4px 16px rgba(0,255,200,0.25)':'none'}}>
              {loading?'⚙️ Creating account...':'🚀 Start Free 7-Day Trial'}
            </button>
          </form>
          <div style={{textAlign:'center',marginTop:'16px',fontSize:'12px',color:'var(--text-muted)'}}>
            Already have an account? <Link href="/auth/login" style={{color:'var(--accent-green)',fontWeight:600,textDecoration:'none'}}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
