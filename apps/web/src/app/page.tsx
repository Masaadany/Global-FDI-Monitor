'use client';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { CheckCircle, Zap, Globe, TrendingUp, BarChart3, FileText, ArrowRight } from 'lucide-react';

const STATS = [
  {v:'215+',l:'Economies'},
  {v:'304+',l:'Official Sources'},
  {v:'6-Stage',l:'AI Pipeline'},
  {v:'12,847',l:'Subscribers'},
];

const FEATURES = [
  { icon:<BarChart3 size={22} color="#2ecc71"/>, title:'GOSA Investment Scoring', desc:'4-layer weighted composite across Doing Business, Sector, Zone, and Market Intelligence indicators. Updated weekly by AGT-04.' },
  { icon:<Zap size={22} color="#f1c40f"/>, title:'Live Investment Signals', desc:'Real-time signals from 304+ official sources, SCI-scored, SHA-256 verified. PLATINUM, GOLD, and SILVER grade alerts.' },
  { icon:<Globe size={22} color="#3498db"/>, title:'GFR Ranking', desc:'6-dimension Global Future Readiness Ranking covering ETR, ICT, TCM, DTF, SGT, and GRP across 25 top economies.' },
  { icon:<FileText size={22} color="#9b59b6"/>, title:'AI-Generated Reports', desc:'4-page investment intelligence reports with GOSA deep-dive, zone recommendations, and strategic roadmap. Download instantly.' },
  { icon:<TrendingUp size={22} color="#e67e22"/>, title:'Impact Analysis', desc:'Model the economic impact, IRR, and incentive capture for any investment scenario. 5-year financial projections.' },
  { icon:<Globe size={22} color="#2ecc71"/>, title:'Country Profiles', desc:'20+ country deep-dives with Doing Business indicators, zones, key signals, and FDI statistics. Full profile for each economy.' },
];

const PLATFORMS = ['Investment Promotion Agencies','Sovereign Wealth Funds','Private Equity','Corporate Strategy Teams','Economic Development Bodies','International Law Firms'];

export default function HomePage() {
  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8',fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <NavBar/>

      {/* HERO */}
      <div style={{background:'linear-gradient(135deg,#061420,#0f1e2a,#1a2c3e)',padding:'72px 24px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(46,204,113,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(46,204,113,0.04) 1px,transparent 1px)',backgroundSize:'48px 48px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'800px',margin:'0 auto',position:'relative'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'6px 16px',background:'rgba(46,204,113,0.1)',border:'1px solid rgba(46,204,113,0.25)',borderRadius:'20px',marginBottom:'20px'}}>
            <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#2ecc71',display:'inline-block'}}/>
            <span style={{fontSize:'11px',fontWeight:700,color:'#2ecc71',letterSpacing:'0.06em'}}>LIVE — 12,847 investment professionals subscribed</span>
          </div>
          <h1 style={{fontSize:'clamp(32px,5vw,56px)',fontWeight:900,color:'white',lineHeight:'1.1',marginBottom:'18px',letterSpacing:'-0.02em'}}>
            The world's most advanced<br/><span style={{color:'#2ecc71'}}>FDI intelligence platform</span>
          </h1>
          <p style={{fontSize:'17px',color:'rgba(255,255,255,0.65)',lineHeight:'1.75',maxWidth:'600px',margin:'0 auto 32px',fontWeight:400}}>
            GOSA-scored investment intelligence across 215+ economies. Real-time signals, GFR rankings, PDF reports, and AI-powered analysis — all in one platform.
          </p>
          <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap',marginBottom:'48px'}}>
            <Link href="/register" style={{padding:'14px 32px',background:'#2ecc71',color:'#0f1e2a',borderRadius:'10px',textDecoration:'none',fontSize:'15px',fontWeight:800,display:'flex',alignItems:'center',gap:'8px'}}>
              Start Free 7-Day Trial <ArrowRight size={16}/>
            </Link>
            <Link href="/dashboard" style={{padding:'14px 28px',border:'1px solid rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.85)',borderRadius:'10px',textDecoration:'none',fontSize:'15px',fontWeight:600}}>
              View Dashboard
            </Link>
          </div>
          {/* Stats */}
          <div style={{display:'flex',gap:'32px',justifyContent:'center',flexWrap:'wrap'}}>
            {STATS.map(({v,l})=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:'28px',fontWeight:900,color:'#2ecc71',fontFamily:"'JetBrains Mono',monospace"}}>{v}</div>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',marginTop:'2px'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'64px 24px'}}>
        <div style={{textAlign:'center',marginBottom:'48px'}}>
          <h2 style={{fontSize:'32px',fontWeight:900,color:'#1a2c3e',marginBottom:'10px'}}>Everything for FDI intelligence</h2>
          <p style={{fontSize:'15px',color:'#7f8c8d',maxWidth:'500px',margin:'0 auto'}}>Purpose-built for investment professionals, governments, and economic development organizations</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px',marginBottom:'64px'}}>
          {FEATURES.map(({icon,title,desc})=>(
            <div key={title} style={{background:'white',borderRadius:'16px',padding:'26px',border:'1px solid rgba(26,44,62,0.08)',boxShadow:'0 4px 6px -2px rgba(0,0,0,0.05)'}}>
              <div style={{width:'46px',height:'46px',borderRadius:'12px',background:'rgba(26,44,62,0.04)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'14px'}}>
                {icon}
              </div>
              <h3 style={{fontSize:'16px',fontWeight:800,color:'#1a2c3e',marginBottom:'8px'}}>{title}</h3>
              <p style={{fontSize:'13px',color:'#7f8c8d',lineHeight:'1.7'}}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Navigation cards to main sections */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'12px',marginBottom:'64px'}}>
          {[
            {href:'/dashboard',icon:'📊',title:'Dashboard',desc:'7 live widgets'},
            {href:'/investment-analysis',icon:'🌍',title:'Investment Analysis',desc:'15 economies, 4 tabs'},
            {href:'/signals',icon:'⚡',title:'Market Signals',desc:'Live signal feed'},
            {href:'/gfr',icon:'🏆',title:'GFR Ranking',desc:'25 economies'},
            {href:'/reports',icon:'📄',title:'PDF Reports',desc:'4-page AI reports'},
            {href:'/pmp',icon:'🎯',title:'Mission Planning',desc:'Guided workflows'},
            {href:'/publications',icon:'📰',title:'Publications',desc:'Weekly newsletter'},
            {href:'/pricing',icon:'💼',title:'Pricing',desc:'From $0 trial'},
          ].map(({href,icon,title,desc})=>(
            <Link key={href} href={href} style={{background:'white',borderRadius:'14px',padding:'18px',border:'1px solid rgba(26,44,62,0.08)',textDecoration:'none',boxShadow:'0 2px 4px rgba(0,0,0,0.04)',display:'flex',flexDirection:'column',gap:'6px'}}>
              <span style={{fontSize:'24px'}}>{icon}</span>
              <span style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e'}}>{title}</span>
              <span style={{fontSize:'11px',color:'#7f8c8d'}}>{desc}</span>
            </Link>
          ))}
        </div>

        {/* Who uses it */}
        <div style={{background:'#1a2c3e',borderRadius:'20px',padding:'40px',textAlign:'center',border:'1px solid rgba(46,204,113,0.1)',marginBottom:'48px'}}>
          <h2 style={{fontSize:'24px',fontWeight:900,color:'white',marginBottom:'8px'}}>Trusted by investment professionals at</h2>
          <p style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',marginBottom:'24px'}}>Leading organizations use Global FDI Monitor for investment intelligence</p>
          <div style={{display:'flex',justifyContent:'center',gap:'24px',flexWrap:'wrap',marginBottom:'32px',opacity:0.6}}>
            {PLATFORMS.map(org=>(
              <span key={org} style={{fontSize:'12px',fontWeight:700,color:'white'}}>{org}</span>
            ))}
          </div>
          <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/register" style={{padding:'12px 28px',background:'#2ecc71',color:'#0f1e2a',borderRadius:'10px',textDecoration:'none',fontSize:'14px',fontWeight:800}}>
              Start Free Trial — No Card Required
            </Link>
            <Link href="/contact" style={{padding:'12px 24px',border:'1px solid rgba(255,255,255,0.2)',color:'white',borderRadius:'10px',textDecoration:'none',fontSize:'14px',fontWeight:600}}>
              Contact Enterprise Sales
            </Link>
          </div>
        </div>

        {/* Trial features */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
          <div style={{background:'white',borderRadius:'16px',padding:'28px',border:'1px solid rgba(26,44,62,0.08)'}}>
            <h3 style={{fontSize:'18px',fontWeight:800,color:'#1a2c3e',marginBottom:'16px'}}>Free Trial Includes</h3>
            {['7 days full platform access','2 PDF report downloads','3 country searches','All 7 dashboard widgets','GFR Ranking access','Live signals feed — all grades','Benchmark tool'].map(f=>(
              <div key={f} style={{display:'flex',alignItems:'center',gap:'10px',padding:'7px 0',fontSize:'13px',color:'#2c3e50',borderBottom:'1px solid rgba(26,44,62,0.04)'}}>
                <CheckCircle size={14} color="#2ecc71"/>{f}
              </div>
            ))}
            <Link href="/register" style={{display:'block',marginTop:'18px',padding:'11px',background:'#2ecc71',color:'#0f1e2a',borderRadius:'9px',textDecoration:'none',fontSize:'13px',fontWeight:800,textAlign:'center'}}>
              Start Free Trial →
            </Link>
          </div>
          <div style={{background:'white',borderRadius:'16px',padding:'28px',border:'1px solid rgba(26,44,62,0.08)'}}>
            <h3 style={{fontSize:'18px',fontWeight:800,color:'#1a2c3e',marginBottom:'6px'}}>Professional Plan</h3>
            <div style={{fontSize:'28px',fontWeight:900,color:'#1a2c3e',marginBottom:'4px',fontFamily:"'JetBrains Mono',monospace"}}>$9,588<span style={{fontSize:'14px',color:'#7f8c8d',fontFamily:'inherit'}}>/year</span></div>
            <div style={{fontSize:'12px',color:'#7f8c8d',marginBottom:'16px'}}>$799/month</div>
            {['Unlimited PDF reports','Unlimited searches & exports','Weekly Intelligence Brief','API access (1,000 calls/day)','Mission Planning module','Full benchmark tool'].map(f=>(
              <div key={f} style={{display:'flex',alignItems:'center',gap:'10px',padding:'7px 0',fontSize:'13px',color:'#2c3e50',borderBottom:'1px solid rgba(26,44,62,0.04)'}}>
                <CheckCircle size={14} color="#3498db"/>{f}
              </div>
            ))}
            <Link href="/contact?plan=professional" style={{display:'block',marginTop:'18px',padding:'11px',background:'#1a2c3e',color:'white',borderRadius:'9px',textDecoration:'none',fontSize:'13px',fontWeight:800,textAlign:'center'}}>
              Get Professional →
            </Link>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
