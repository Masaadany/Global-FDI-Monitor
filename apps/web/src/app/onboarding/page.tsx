'use client';
import { useState } from 'react';
import { Globe, CheckCircle, ArrowRight, Target, Zap, BarChart3 } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Link from 'next/link';

const STEPS = [
  {id:'welcome',    title:'Welcome to Global FDI Monitor',    subtitle:'Your investment intelligence platform'},
  {id:'language',   title:'Choose Your Language',             subtitle:'We support 10 official languages'},
  {id:'use-case',   title:'What best describes your role?',   subtitle:'We\'ll personalise your experience'},
  {id:'regions',    title:'Select your focus regions',        subtitle:'Which regions matter most to you?'},
  {id:'sectors',    title:'Your key investment sectors',      subtitle:'Filter intelligence to what matters'},
];

const LANGUAGES = [
  {code:'en',name:'English',    native:'English',    flag:'🇺🇸'},
  {code:'ar',name:'Arabic',     native:'العربية',    flag:'🇸🇦',dir:'rtl'},
  {code:'zh',name:'Chinese',    native:'中文',        flag:'🇨🇳'},
  {code:'fr',name:'French',     native:'Français',   flag:'🇫🇷'},
  {code:'es',name:'Spanish',    native:'Español',    flag:'🇪🇸'},
  {code:'de',name:'German',     native:'Deutsch',    flag:'🇩🇪'},
  {code:'ja',name:'Japanese',   native:'日本語',      flag:'🇯🇵'},
  {code:'ko',name:'Korean',     native:'한국어',      flag:'🇰🇷'},
  {code:'pt',name:'Portuguese', native:'Português',  flag:'🇧🇷'},
  {code:'ru',name:'Russian',    native:'Русский',    flag:'🇷🇺'},
];

const ROLES = [
  {id:'ipa',       label:'Investment Promotion Agency (IPA)',    icon:'🏛'},
  {id:'gov',       label:'Government / Ministry',               icon:'🏢'},
  {id:'swf',       label:'Sovereign Wealth Fund',               icon:'💰'},
  {id:'consulting',label:'Strategy / Consulting Firm',          icon:'📊'},
  {id:'pe',        label:'Private Equity / Venture Capital',    icon:'📈'},
  {id:'corporate', label:'Corporate / Multinational',           icon:'🌐'},
  {id:'academic',  label:'Research / Academic Institution',     icon:'📚'},
  {id:'other',     label:'Other Professional',                  icon:'👤'},
];

const REGIONS_LIST = ['Middle East & North Africa','Asia-Pacific','Europe','Americas','Sub-Saharan Africa','South Asia'];
const SECTORS_LIST = ['Technology','Renewable Energy','Manufacturing','Financial Services','Healthcare','Logistics & Infrastructure','Agriculture','Real Estate'];

export default function OnboardingPage() {
  const [step,     setStep]     = useState(0);
  const [lang,     setLang]     = useState('en');
  const [role,     setRole]     = useState('');
  const [regions,  setRegions]  = useState<string[]>([]);
  const [sectors,  setSectors]  = useState<string[]>([]);

  const STEP = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function next() { if (step < STEPS.length - 1) setStep(s=>s+1); }
  function back() { if (step > 0) setStep(s=>s-1); }

  const canNext = () => {
    if (step===1) return true;
    if (step===2) return !!role;
    if (step===3) return regions.length > 0;
    if (step===4) return sectors.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen" style={{background:'linear-gradient(135deg,#0A3D62 0%,#0E4F7A 100%)',
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',
      position:'relative',overflow:'hidden'}}>
      {/* Grid overlay */}
      <div style={{position:'absolute',inset:0,
        backgroundImage:'linear-gradient(rgba(116,187,101,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(116,187,101,0.05) 1px,transparent 1px)',
        backgroundSize:'40px 40px'}}/>

      <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:'580px'}}>
        {/* Logo */}
        <div style={{textAlign:'center',marginBottom:'28px'}}>
          <Link href="/" style={{textDecoration:'none',display:'inline-flex',alignItems:'baseline',gap:'2px'}}>
            <span style={{fontSize:'22px',fontWeight:900,color:'white'}}>GLOBAL</span>
            <span style={{fontSize:'22px',fontWeight:900,color:'#74BB65',marginLeft:'4px'}}>FDI</span>
            <span style={{fontSize:'22px',fontWeight:900,color:'white',marginLeft:'4px'}}>MONITOR</span>
          </Link>
        </div>

        {/* Progress bar */}
        <div style={{display:'flex',gap:'4px',marginBottom:'28px'}}>
          {STEPS.map((_,i)=>(
            <div key={i} style={{flex:1,height:'4px',borderRadius:'2px',
              background:i<=step?'#74BB65':'rgba(255,255,255,0.15)',transition:'background 0.3s'}}/>
          ))}
        </div>

        {/* Card */}
        <div style={{background:'white',borderRadius:'20px',padding:'36px',
          boxShadow:'0 24px 80px rgba(0,0,0,0.2)'}}>
          <div style={{textAlign:'center',marginBottom:'28px'}}>
            <div style={{fontSize:'22px',fontWeight:800,color:'#0A3D62',marginBottom:'6px'}}>{STEP.title}</div>
            <div style={{fontSize:'14px',color:'#696969'}}>{STEP.subtitle}</div>
          </div>

          {/* Step 0: Welcome */}
          {step===0 && (
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {[{icon:Zap,   title:'218+ live FDI signals',   desc:'PLATINUM to BRONZE, Z3 verified, 2s updates'},
                {icon:Globe, title:'215 economies covered',   desc:'GFR assessment, Investment Analysis, benchmarking'},
                {icon:BarChart3,title:'Investment Analysis',  desc:'4-layer scoring — Doing Business to Market Intelligence'},
                {icon:Target,title:'Mission Planning',        desc:'Destination countries, targets, dossier generation'},
              ].map(({icon:Icon,title,desc})=>(
                <div key={title} style={{display:'flex',gap:'12px',padding:'14px',borderRadius:'10px',
                  background:'rgba(10,61,98,0.02)',border:'1px solid rgba(10,61,98,0.07)'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'rgba(116,187,101,0.1)',
                    display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <Icon size={16} color="#74BB65"/>
                  </div>
                  <div>
                    <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'2px'}}>{title}</div>
                    <div style={{fontSize:'11px',color:'#696969'}}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 1: Language */}
          {step===1 && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
              {LANGUAGES.map(l=>(
                <button key={l.code} onClick={()=>setLang(l.code)}
                  style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 14px',
                    borderRadius:'9px',border:lang===l.code?'2px solid #74BB65':'1px solid rgba(10,61,98,0.12)',
                    background:lang===l.code?'rgba(116,187,101,0.06)':'white',
                    cursor:'pointer',transition:'all 0.15s',textAlign:'left'}}>
                  <span style={{fontSize:'20px'}}>{l.flag}</span>
                  <div>
                    <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62'}}>{l.native}</div>
                    <div style={{fontSize:'10px',color:'#696969'}}>{l.name}</div>
                  </div>
                  {lang===l.code && <CheckCircle size={14} color="#74BB65" style={{marginLeft:'auto'}}/>}
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Role */}
          {step===2 && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
              {ROLES.map(r=>(
                <button key={r.id} onClick={()=>setRole(r.id)}
                  style={{display:'flex',alignItems:'center',gap:'8px',padding:'12px',
                    borderRadius:'9px',border:role===r.id?'2px solid #74BB65':'1px solid rgba(10,61,98,0.12)',
                    background:role===r.id?'rgba(116,187,101,0.06)':'white',
                    cursor:'pointer',transition:'all 0.15s',textAlign:'left'}}>
                  <span style={{fontSize:'20px'}}>{r.icon}</span>
                  <span style={{fontSize:'12px',fontWeight:600,color:'#0A3D62',lineHeight:'1.3'}}>{r.label}</span>
                  {role===r.id && <CheckCircle size={12} color="#74BB65" style={{marginLeft:'auto',flexShrink:0}}/>}
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Regions */}
          {step===3 && (
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {REGIONS_LIST.map(r=>(
                <button key={r}
                  onClick={()=>setRegions(p=>p.includes(r)?p.filter(x=>x!==r):[...p,r])}
                  style={{display:'flex',alignItems:'center',gap:'10px',padding:'12px 16px',
                    borderRadius:'9px',border:regions.includes(r)?'2px solid #74BB65':'1px solid rgba(10,61,98,0.12)',
                    background:regions.includes(r)?'rgba(116,187,101,0.06)':'white',
                    cursor:'pointer',transition:'all 0.15s',textAlign:'left'}}>
                  <div style={{width:'18px',height:'18px',borderRadius:'4px',border:'2px solid',
                    borderColor:regions.includes(r)?'#74BB65':'rgba(10,61,98,0.2)',
                    background:regions.includes(r)?'#74BB65':'transparent',
                    display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    {regions.includes(r) && <CheckCircle size={11} color="white"/>}
                  </div>
                  <span style={{fontSize:'13px',fontWeight:600,color:'#0A3D62'}}>{r}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 4: Sectors */}
          {step===4 && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
              {SECTORS_LIST.map(s=>(
                <button key={s}
                  onClick={()=>setSectors(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s])}
                  style={{padding:'10px 14px',borderRadius:'9px',
                    border:sectors.includes(s)?'2px solid #74BB65':'1px solid rgba(10,61,98,0.12)',
                    background:sectors.includes(s)?'rgba(116,187,101,0.06)':'white',
                    cursor:'pointer',transition:'all 0.15s',fontSize:'12px',fontWeight:600,
                    color:'#0A3D62',textAlign:'left',display:'flex',alignItems:'center',gap:'6px'}}>
                  {sectors.includes(s) && <CheckCircle size={11} color="#74BB65"/>}
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div style={{display:'flex',gap:'10px',marginTop:'24px',justifyContent:'space-between'}}>
            {step > 0
              ? <button onClick={back} style={{padding:'11px 20px',border:'1px solid rgba(10,61,98,0.15)',
                  borderRadius:'9px',background:'transparent',cursor:'pointer',fontSize:'14px',fontWeight:600,color:'#696969'}}>← Back</button>
              : <div/>}
            {isLast
              ? <Link href="/dashboard" style={{display:'flex',alignItems:'center',gap:'7px',
                  padding:'11px 28px',background:'#74BB65',color:'white',borderRadius:'9px',
                  textDecoration:'none',fontWeight:800,fontSize:'14px',
                  boxShadow:'0 4px 16px rgba(116,187,101,0.3)'}}>
                  Launch Platform <ArrowRight size={14}/>
                </Link>
              : <button onClick={next} disabled={!canNext()}
                  style={{display:'flex',alignItems:'center',gap:'7px',
                    padding:'11px 24px',background:canNext()?'#74BB65':'rgba(116,187,101,0.4)',
                    color:'white',borderRadius:'9px',border:'none',cursor:canNext()?'pointer':'not-allowed',
                    fontSize:'14px',fontWeight:700,transition:'all 0.15s'}}>
                  Continue <ArrowRight size={13}/>
                </button>}
          </div>
          <div style={{textAlign:'center',marginTop:'14px',fontSize:'11px',color:'#696969'}}>
            Step {step+1} of {STEPS.length}
          </div>
        </div>
      </div>
    </div>
  );
}
