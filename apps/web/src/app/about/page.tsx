'use client';
import { Globe, Shield, TrendingUp, CheckCircle, Users, Target, BarChart3, Zap, Building2, Award, Database, Activity } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import PreviewGate from '@/components/PreviewGate';
import Footer from '@/components/Footer';
import Link from 'next/link';

const INSIGHT = [
  {letter:'I', word:'Intelligence',   desc:'Real-time FDI signals, Z3-verified, SHA-256 provenance.',                   icon:Zap,      color:'#0A3D62'},
  {letter:'N', word:'Network',        desc:'300+ primary sources across T1–T4 tiers from 215 economies.',              icon:Globe,    color:'#74BB65'},
  {letter:'S', word:'Signals',        desc:'218+ live signals graded PLATINUM to BRONZE by Signal Confidence Index.',  icon:Activity, color:'#1B6CA8'},
  {letter:'I', word:'Indicators',     desc:'World Bank Doing Business 10 indicators normalized via Distance-to-Frontier.', icon:BarChart3,color:'#0A3D62'},
  {letter:'G', word:'Global',         desc:'GFR assessment across 215 economies — 6 dimensions, 38 indicators.',       icon:Award,    color:'#74BB65'},
  {letter:'H', word:'Hubs & Zones',   desc:'1,400+ special investment zones evaluated for readiness and incentives.',  icon:Building2,color:'#1B6CA8'},
  {letter:'T', word:'Transparency',   desc:'Every data point is traceable — GFM-SRC reference, source date, access date.', icon:Shield,  color:'#0A3D62'},
];

const LAYERS = [
  {n:1,name:'Doing Business Indicators',  weight:30, color:'#0A3D62', desc:'10 World Bank indicators via Distance-to-Frontier normalization.'},
  {n:2,name:'Sector Indicators',          weight:20, color:'#74BB65', desc:'Regulations, incentives, labor, infrastructure, export potential.'},
  {n:3,name:'Special Investment Zone Indicators',weight:25,color:'#1B6CA8',desc:'Land availability, occupancy, infrastructure readiness, zone incentives.'},
  {n:4,name:'Market Intelligence Matrix', weight:25, color:'#2E86AB', desc:'IFI signals, trade flows, central bank data, company announcements.'},
];



export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      {/* Hero */}
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'60px 40px'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',textAlign:'center'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'16px'}}>
            <Globe size={16} color="#74BB65"/>
            <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.1em',textTransform:'uppercase'}}>About Global FDI Monitor</span>
          </div>
          <h1 style={{fontSize:'clamp(28px,4vw,46px)',fontWeight:900,color:'white',marginBottom:'16px',lineHeight:'1.1'}}>
            The Global Standard for<br/>Investment Intelligence
          </h1>
          <p style={{fontSize:'16px',color:'rgba(226,242,223,0.82)',maxWidth:'680px',margin:'0 auto',lineHeight:'1.75'}}>
            Global FDI Monitor transforms complex global investment data into actionable strategic decisions for governments, investment promotion agencies, and institutional investors worldwide.
          </p>
        </div>
      </section>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'48px 24px',display:'flex',flexDirection:'column',gap:'32px'}}>

        {/* Vision & Mission */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
          {[
            {title:'Our Vision',icon:Target,color:'#74BB65',text:"To become the world's most trusted and comprehensive source of foreign direct investment intelligence — delivering clarity, speed, and precision to investment professionals across 215 economies."},
            {title:'Our Mission',icon:Zap,color:'#0A3D62',text:'To democratise access to high-quality investment intelligence by combining rigorous methodology, real-time signals, and AI-powered analytics into a single, accessible platform.'},
          ].map(({title,icon:Icon,color,text})=>(
            <div key={title} className="gfm-card" style={{padding:'28px',borderTop:`4px solid ${color}`}}>
              <div style={{display:'flex',alignItems:'center',gap:'9px',marginBottom:'12px'}}>
                <Icon size={18} color={color}/>
                <span style={{fontSize:'14px',fontWeight:800,color:'#0A3D62',textTransform:'uppercase',letterSpacing:'0.06em'}}>{title}</span>
              </div>
              <p style={{fontSize:'14px',color:'#696969',lineHeight:'1.75',margin:0}}>{text}</p>
            </div>
          ))}
        </div>

        {/* INSIGHT framework */}
        <div className="gfm-card" style={{padding:'28px'}}>
          <div style={{fontSize:'14px',fontWeight:800,color:'#0A3D62',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'20px',display:'flex',alignItems:'center',gap:'8px'}}>
            <Award size={16} color="#74BB65"/> The INSIGHT Framework
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'12px'}}>
            {INSIGHT.map(({letter,word,desc,icon:Icon,color})=>(
              <div key={word} style={{textAlign:'center',padding:'16px 8px'}}>
                <div style={{width:'48px',height:'48px',borderRadius:'14px',background:`${color}10`,
                  border:`2px solid ${color}20`,display:'flex',alignItems:'center',justifyContent:'center',
                  margin:'0 auto 10px'}}>
                  <span style={{fontSize:'22px',fontWeight:900,color}}>{letter}</span>
                </div>
                <div style={{fontSize:'12px',fontWeight:700,color:'#0A3D62',marginBottom:'4px'}}>{word}</div>
                <div style={{fontSize:'10px',color:'#696969',lineHeight:'1.4'}}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scoring methodology */}
        <div className="gfm-card" style={{padding:'28px'}}>
          <div style={{fontSize:'14px',fontWeight:800,color:'#0A3D62',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'6px',display:'flex',alignItems:'center',gap:'8px'}}>
            <BarChart3 size={16} color="#74BB65"/> Global Opportunity Score Analysis Methodology
          </div>
          <div style={{fontFamily:'monospace',fontSize:'13px',color:'#0A3D62',
            background:'rgba(10,61,98,0.04)',padding:'14px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.1)',
            marginBottom:'16px',lineHeight:'1.9'}}>
            GOSA = (0.30 × Layer 1: Doing Business Indicators) +<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(0.20 × Layer 2: Sector Indicators) +<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(0.25 × Layer 3: Special Investment Zone Indicators) +<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(0.25 × Layer 4: Market Intelligence Matrix)
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px'}}>
            {LAYERS.map(l=>(
              <div key={l.n} style={{padding:'14px',borderRadius:'10px',background:`${l.color}06`,
                border:`1px solid ${l.color}20`,borderLeft:`4px solid ${l.color}`}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                  <span style={{fontSize:'11px',fontWeight:800,color:l.color}}>LAYER {l.n}</span>
                  <span style={{fontSize:'11px',fontWeight:700,color:l.color}}>{l.weight}%</span>
                </div>
                <div style={{fontSize:'12px',fontWeight:700,color:'#0A3D62',marginBottom:'5px'}}>{l.name}</div>
                <div style={{fontSize:'11px',color:'#696969',lineHeight:'1.4'}}>{l.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key strengths */}
        <div className="gfm-card" style={{padding:'28px'}}>
          <div style={{fontSize:'14px',fontWeight:800,color:'#0A3D62',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'16px',display:'flex',alignItems:'center',gap:'8px'}}>
            <Shield size={16} color="#74BB65"/> Our Core Strengths
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
            {[
              {icon:Database,  title:'Data Integrity',          desc:'Z3 formal verification + SHA-256 provenance on all PLATINUM/GOLD signals. Every data point traceable.'},
              {icon:Zap,       title:'Real-Time Intelligence',  desc:'218+ live signals updated every 2 seconds. Ingestion latency below 2s from source publication.'},
              {icon:Globe,     title:'Global Coverage',         desc:'215 economies, 21 ISIC sectors, 1,400+ investment zones, 300+ verified data sources.'},
              {icon:BarChart3, title:'Rigorous Methodology',    desc:'World Bank Doing Business methodology combined with proprietary sector and zone intelligence layers.'},
              {icon:Shield,    title:'Security & Compliance',   desc:'PDF-only reports, dynamic watermarks, copy protection. DIFC registered, GDPR compliant.'},
              {icon:Users,     title:'Expert Team',             desc:'Investment intelligence professionals with backgrounds at sovereign wealth funds, IPAs, and multilateral institutions.'},
            ].map(({icon:Icon,title,desc})=>(
              <div key={title} style={{display:'flex',gap:'12px',padding:'14px',
                borderRadius:'10px',background:'rgba(10,61,98,0.02)',border:'1px solid rgba(10,61,98,0.07)'}}>
                <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'rgba(116,187,101,0.1)',
                  display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Icon size={18} color="#74BB65"/>
                </div>
                <div>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'4px'}}>{title}</div>
                  <div style={{fontSize:'11px',color:'#696969',lineHeight:'1.5'}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{textAlign:'center',padding:'32px',background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',borderRadius:'16px'}}>
          <h3 style={{fontSize:'22px',fontWeight:800,color:'white',marginBottom:'10px'}}>
            Ready to explore global investment intelligence?
          </h3>
          <p style={{color:'rgba(226,242,223,0.8)',marginBottom:'20px',fontSize:'14px'}}>
            Start a free trial — full access to signals, GFR assessment, and Investment Analysis.
          </p>
          <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/register"
              style={{padding:'12px 28px',background:'#74BB65',color:'white',borderRadius:'9px',
                textDecoration:'none',fontWeight:700,fontSize:'14px',display:'flex',alignItems:'center',gap:'6px'}}>
              Start Free Trial →
            </Link>
            <Link href="/investment-analysis"
              style={{padding:'12px 24px',border:'1px solid rgba(226,242,223,0.35)',color:'rgba(226,242,223,0.9)',
                borderRadius:'9px',textDecoration:'none',fontWeight:600,fontSize:'14px'}}>
              View Investment Analysis
            </Link>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
