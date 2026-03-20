'use client';
import { useState } from 'react';
import { Play, Globe, Award, BarChart3, Target, ArrowRight, Zap, Shield, CheckCircle, TrendingUp, Building2 } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';
import FDIFlowMap from '@/components/FDIFlowMap';
import AnimatedCounter from '@/components/AnimatedCounter';
import SectorDonut from '@/components/SectorDonut';
import Link from 'next/link';

const DEMO_SIGNALS = [
  {flag:'🇦🇪',eco:'UAE',co:'Microsoft',amt:'$5.2B',sector:'Technology',sci:96,grade:'PLATINUM'},
  {flag:'🇮🇩',eco:'Indonesia',co:'CATL',amt:'$3.2B',sector:'Manufacturing',sci:94,grade:'PLATINUM'},
  {flag:'🇸🇦',eco:'Saudi Arabia',co:'Amazon AWS',amt:'$5.4B',sector:'Technology',sci:91,grade:'GOLD'},
  {flag:'🇩🇪',eco:'Germany',co:'Siemens',amt:'$2.1B',sector:'Energy',sci:88,grade:'GOLD'},
];

const SECTORS_DEMO = [
  {label:'Technology',value:45,color:'#0A3D62'},
  {label:'Energy',value:18,color:'#74BB65'},
  {label:'Manufacturing',value:14,color:'#1B6CA8'},
  {label:'Finance',value:10,color:'#2E86AB'},
  {label:'Healthcare',value:7,color:'#696969'},
  {label:'Infrastructure',value:6,color:'#9E9E9E'},
];

const FEATURES = [
  {id:'signals',   icon:Zap,        title:'Live FDI Signals',         desc:'See real-time investment signals graded PLATINUM to BRONZE with SCI scoring.'},
  {id:'analysis',  icon:BarChart3,  title:'Investment Analysis',       desc:'Global Opportunity Score Analysis across 215 economies with 4-layer methodology.'},
  {id:'benchmark', icon:Target,     title:'Benchmark',                 desc:'Compare countries side-by-side across all Doing Business and sector indicators.'},
  {id:'mission',   icon:Building2,  title:'Mission Planning',          desc:'Build investment promotion missions — destinations, targets, dossier generation.'},
];



export default function DemoPage() {
  const [activeFeature, setActiveFeature] = useState('signals');

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      {/* Hero */}
      <section style={{background:'linear-gradient(135deg,#061E30 0%,#0A3D62 45%,#0E4F7A 100%)',
        padding:'60px 40px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,
          backgroundImage:'linear-gradient(rgba(116,187,101,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(116,187,101,0.06) 1px,transparent 1px)',
          backgroundSize:'48px 48px'}}/>
        <div style={{position:'relative',zIndex:1,maxWidth:'1100px',margin:'0 auto',display:'grid',
          gridTemplateColumns:'1fr 1fr',gap:'48px',alignItems:'center'}}>
          <div>
            <div style={{display:'inline-flex',alignItems:'center',gap:'7px',
              background:'rgba(116,187,101,0.12)',border:'1px solid rgba(116,187,101,0.3)',
              padding:'5px 14px',borderRadius:'20px',marginBottom:'20px'}}>
              <Play size={11} color="#74BB65" fill="#74BB65"/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em'}}>INTERACTIVE DEMO</span>
            </div>
            <h1 style={{fontSize:'clamp(28px,3.5vw,46px)',fontWeight:900,color:'white',lineHeight:'1.1',marginBottom:'16px'}}>
              Explore the Full<br/><span style={{color:'#74BB65'}}>FDI Monitor</span><br/>Platform
            </h1>
            <p style={{fontSize:'15px',color:'rgba(226,242,223,0.82)',lineHeight:'1.75',marginBottom:'28px'}}>
              No login required. Interact with live signals, Investment Analysis, benchmarking, and mission planning tools.
            </p>
            <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
              <Link href="/register" style={{display:'inline-flex',alignItems:'center',gap:'7px',
                padding:'13px 28px',background:'#74BB65',color:'white',borderRadius:'9px',
                textDecoration:'none',fontWeight:800,fontSize:'15px',boxShadow:'0 4px 16px rgba(116,187,101,0.35)'}}>
                Start Free Trial <ArrowRight size={14}/>
              </Link>
              <Link href="/contact" style={{display:'inline-flex',alignItems:'center',gap:'7px',
                padding:'13px 22px',border:'1px solid rgba(255,255,255,0.25)',color:'rgba(226,242,223,0.9)',
                borderRadius:'9px',textDecoration:'none',fontWeight:600,fontSize:'15px'}}>
                Request Demo
              </Link>
            </div>
            {/* Stats */}
            <div style={{display:'flex',gap:'24px',marginTop:'32px'}}>
              {[{v:215,s:'',l:'Economies'},{v:218,s:'+',l:'Live Signals'},{v:107,s:'',l:'API Routes'}].map(({v,s,l})=>(
                <div key={l}>
                  <div style={{fontSize:'22px',fontWeight:900,color:'white',fontFamily:'monospace',lineHeight:1}}>
                    <AnimatedCounter value={v} suffix={s} duration={2000}/>
                  </div>
                  <div style={{fontSize:'10px',color:'rgba(226,242,223,0.55)',marginTop:'3px'}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div><FDIFlowMap height={300}/></div>
        </div>
      </section>

      {/* Interactive feature demo */}
      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'48px 24px',display:'flex',flexDirection:'column',gap:'32px'}}>

        {/* Feature selector */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px'}}>
          {FEATURES.map(({id,icon:Icon,title,desc})=>(
            <div key={id} onClick={()=>setActiveFeature(id)}
              style={{background:'white',borderRadius:'12px',padding:'18px',cursor:'pointer',
                boxShadow:'0 2px 8px rgba(10,61,98,0.06)',transition:'all 0.15s',
                border:activeFeature===id?'2px solid #74BB65':'1px solid rgba(10,61,98,0.07)',
                borderTop:activeFeature===id?'4px solid #74BB65':'4px solid transparent'}}>
              <div style={{width:'40px',height:'40px',borderRadius:'10px',
                background:activeFeature===id?'rgba(116,187,101,0.1)':'rgba(10,61,98,0.06)',
                display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'10px'}}>
                <Icon size={18} color={activeFeature===id?'#74BB65':'#0A3D62'}/>
              </div>
              <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'4px'}}>{title}</div>
              <div style={{fontSize:'11px',color:'#696969',lineHeight:'1.5'}}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Feature preview panels */}
        {activeFeature==='signals' && (
          <div className="gfm-card" style={{padding:'24px'}}>
            <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'8px'}}>
              <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#74BB65',animation:'livePulse 2s infinite'}}/>
              Live FDI Signal Feed — PLATINUM & GOLD
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'20px'}}>
              {DEMO_SIGNALS.map((s,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',
                  borderRadius:'10px',background:'rgba(10,61,98,0.02)',border:'1px solid rgba(10,61,98,0.07)',flexWrap:'wrap'}}>
                  <span style={{fontSize:'11px',fontWeight:700,padding:'2px 8px',borderRadius:'10px',
                    background:s.grade==='PLATINUM'?'rgba(10,61,98,0.1)':'rgba(116,187,101,0.12)',
                    color:s.grade==='PLATINUM'?'#0A3D62':'#74BB65'}}>{s.grade}</span>
                  <span style={{fontSize:'14px'}}>{s.flag}</span>
                  <span style={{fontWeight:700,color:'#0A3D62',flex:1,minWidth:'120px'}}>{s.co}</span>
                  <span style={{color:'#696969',fontSize:'12px'}}>{s.eco}</span>
                  <span style={{fontFamily:'monospace',fontWeight:700,color:'#0A3D62'}}>{s.amt}</span>
                  <span style={{fontSize:'11px',color:'#696969'}}>{s.sector}</span>
                  <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                    <div style={{width:'40px',height:'5px',borderRadius:'3px',background:'rgba(10,61,98,0.07)'}}>
                      <div style={{height:'100%',borderRadius:'3px',width:`${s.sci}%`,background:s.grade==='PLATINUM'?'#0A3D62':'#74BB65'}}/>
                    </div>
                    <span style={{fontSize:'11px',fontWeight:700,color:s.grade==='PLATINUM'?'#0A3D62':'#74BB65'}}>{s.sci}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/signals" style={{display:'inline-flex',alignItems:'center',gap:'6px',
              padding:'9px 18px',background:'#0A3D62',color:'white',borderRadius:'8px',
              textDecoration:'none',fontSize:'13px',fontWeight:700}}>
              View All Live Signals <ArrowRight size={13}/>
            </Link>
          </div>
        )}

        {activeFeature==='analysis' && (
          <div className="gfm-card" style={{padding:'24px'}}>
            <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
              <BarChart3 size={14} color="#74BB65"/> Investment Analysis — Global Opportunity Score Analysis
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'20px'}}>
              <SectorDonut slices={SECTORS_DEMO} size={200} title="FDI 2025"/>
              <div>
                {[{eco:'🇸🇬 Singapore',score:88.4,tier:'Top Tier',color:'#74BB65'},
                  {eco:'🇦🇪 UAE',score:83.5,tier:'Top Tier',color:'#74BB65'},
                  {eco:'🇻🇳 Vietnam',score:79.4,tier:'High Tier',color:'#0A3D62'},
                  {eco:'🇮🇩 Indonesia',score:74.8,tier:'High Tier',color:'#0A3D62'}].map(e=>(
                  <div key={e.eco} style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
                    <span style={{fontSize:'13px',fontWeight:600,color:'#0A3D62',minWidth:'130px'}}>{e.eco}</span>
                    <div style={{flex:1,height:'10px',borderRadius:'5px',background:'rgba(10,61,98,0.06)'}}>
                      <div style={{height:'100%',borderRadius:'5px',width:`${e.score}%`,background:e.color}}/>
                    </div>
                    <span style={{fontSize:'13px',fontWeight:800,color:e.color,fontFamily:'monospace',minWidth:'34px'}}>{e.score}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/investment-analysis" style={{display:'inline-flex',alignItems:'center',gap:'6px',
              padding:'9px 18px',background:'#0A3D62',color:'white',borderRadius:'8px',
              textDecoration:'none',fontSize:'13px',fontWeight:700}}>
              Open Investment Analysis <ArrowRight size={13}/>
            </Link>
          </div>
        )}

        {activeFeature==='benchmark' && (
          <div className="gfm-card" style={{padding:'24px'}}>
            <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
              <Target size={14} color="#74BB65"/> Benchmark — Compare Economies
            </div>
            {[{eco:'🇻🇳 Vietnam',l1:80.5,l2:79.1,l3:78.9,l4:79.1,total:79.4},
              {eco:'🇹🇭 Thailand',l1:78.2,l2:76.8,l3:77.0,l4:76.4,total:77.1},
              {eco:'🇲🇾 Malaysia',l1:79.8,l2:77.5,l3:78.1,l4:77.4,total:78.2},
              {eco:'🇮🇩 Indonesia',l1:76.0,l2:74.5,l3:74.2,l4:74.5,total:74.8}].map(e=>(
              <div key={e.eco} style={{marginBottom:'14px',padding:'12px',borderRadius:'9px',background:'rgba(10,61,98,0.02)'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                  <span style={{fontSize:'13px',fontWeight:700,color:'#0A3D62'}}>{e.eco}</span>
                  <span style={{fontSize:'14px',fontWeight:900,color:'#0A3D62',fontFamily:'monospace'}}>{e.total}</span>
                </div>
                <div style={{display:'flex',gap:'4px'}}>
                  {[{v:e.l1,c:'#0A3D62'},{v:e.l2,c:'#74BB65'},{v:e.l3,c:'#1B6CA8'},{v:e.l4,c:'#2E86AB'}].map(({v,c},i)=>(
                    <div key={i} style={{flex:1,height:'6px',borderRadius:'3px',background:c,opacity:v/100}}/>
                  ))}
                </div>
              </div>
            ))}
            <Link href="/investment-analysis" style={{display:'inline-flex',alignItems:'center',gap:'6px',
              padding:'9px 18px',background:'#0A3D62',color:'white',borderRadius:'8px',
              textDecoration:'none',fontSize:'13px',fontWeight:700}}>
              Open Benchmark Tool <ArrowRight size={13}/>
            </Link>
          </div>
        )}

        {activeFeature==='mission' && (
          <div className="gfm-card" style={{padding:'24px'}}>
            <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
              <Building2 size={14} color="#74BB65"/> Mission Planning — Investment Promotion Dossier
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'20px'}}>
              {[{label:'Destination Countries',val:'5',icon:'🌍'},
                {label:'Target Companies',val:'18',icon:'🏢'},
                {label:'Opportunities Matched',val:'12',icon:'🎯'}].map(({label,val,icon})=>(
                <div key={label} style={{textAlign:'center',padding:'16px',borderRadius:'10px',
                  background:'rgba(116,187,101,0.06)',border:'1px solid rgba(116,187,101,0.15)'}}>
                  <div style={{fontSize:'24px',marginBottom:'4px'}}>{icon}</div>
                  <div style={{fontSize:'22px',fontWeight:900,color:'#74BB65',fontFamily:'monospace'}}>{val}</div>
                  <div style={{fontSize:'11px',color:'#696969',marginTop:'2px'}}>{label}</div>
                </div>
              ))}
            </div>
            <Link href="/pmp" style={{display:'inline-flex',alignItems:'center',gap:'6px',
              padding:'9px 18px',background:'#0A3D62',color:'white',borderRadius:'8px',
              textDecoration:'none',fontSize:'13px',fontWeight:700}}>
              Open Mission Planner <ArrowRight size={13}/>
            </Link>
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{textAlign:'center',padding:'36px',background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',borderRadius:'16px'}}>
          <h3 style={{fontSize:'22px',fontWeight:800,color:'white',marginBottom:'10px'}}>
            Ready to get started?
          </h3>
          <p style={{color:'rgba(226,242,223,0.8)',marginBottom:'22px',fontSize:'14px'}}>
            Join investment professionals from IPAs, sovereign wealth funds, and strategy firms worldwide.
          </p>
          <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/register" style={{padding:'12px 28px',background:'#74BB65',color:'white',
              borderRadius:'9px',textDecoration:'none',fontWeight:800,fontSize:'14px',
              display:'flex',alignItems:'center',gap:'6px'}}>
              Start Free Trial <ArrowRight size={14}/>
            </Link>
            <Link href="/contact" style={{padding:'12px 22px',border:'1px solid rgba(255,255,255,0.25)',
              color:'rgba(226,242,223,0.9)',borderRadius:'9px',textDecoration:'none',fontWeight:600,fontSize:'14px'}}>
              Request Live Demo
            </Link>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
