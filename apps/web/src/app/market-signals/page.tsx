'use client';
import { useState } from 'react';
import { Zap, Shield, Activity, CheckCircle, BarChart3, TrendingUp, Database, Globe, ArrowRight } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';
import PreviewGate from '@/components/PreviewGate';
import SourceBadge from '@/components/SourceBadge';
import Link from 'next/link';

const SCI_COMPONENTS = [
  {name:'Source Credibility',   code:'SC', weight:25, color:'#0A3D62',
   desc:'Authority tier (T1–T4), editorial standards, official vs secondary classification.'},
  {name:'Verification Status',  code:'VS', weight:20, color:'#74BB65',
   desc:'Z3 formal proof completion, cross-source confirmation status, SHA-256 hash assignment.'},
  {name:'Extraction Accuracy',  code:'EA', weight:20, color:'#1B6CA8',
   desc:'NLP confidence score, structured field completeness, schema validation pass rate.'},
  {name:'Temporal Freshness',   code:'TF', weight:20, color:'#2E86AB',
   desc:'Hours since original announcement. Exponential decay function applied after 72 hours.'},
  {name:'Publish Reliability',  code:'PR', weight:15, color:'#696969',
   desc:'Historical track record of source for this signal type and geography.'},
];

const GRADE_MAP = [
  {grade:'PLATINUM', min:90, color:'#0A3D62', bg:'rgba(10,61,98,0.1)',  z3:true,  sha:true,  desc:'Highest confidence. Z3 verified, multi-source confirmed, SHA-256 sealed.'},
  {grade:'GOLD',     min:75, color:'#74BB65', bg:'rgba(116,187,101,0.12)',z3:true, sha:true,  desc:'High confidence. Z3 verified, primary source confirmed.'},
  {grade:'SILVER',   min:60, color:'#696969', bg:'rgba(105,105,105,0.1)',z3:false, sha:false, desc:'Moderate confidence. Single source, schema validated.'},
  {grade:'BRONZE',   min:40, color:'#9E9E9E', bg:'rgba(158,158,158,0.1)',z3:false,sha:false, desc:'Lower confidence. Requires further verification before use.'},
];

const SIGNAL_TYPES = [
  {type:'Greenfield FDI',  icon:'🏗', cnt:89, pct:41, desc:'New capital investment creating new operations, facilities, or ventures.'},
  {type:'M&A Activity',    icon:'🤝', cnt:34, pct:16, desc:'Mergers, acquisitions, and takeovers involving foreign capital.'},
  {type:'Expansion FDI',   icon:'📈', cnt:41, pct:19, desc:'Expansion of existing operations through additional capital injection.'},
  {type:'Joint Venture',   icon:'🔗', cnt:28, pct:13, desc:'Formal partnership between foreign and domestic entities.'},
  {type:'VC & PE',         icon:'💰', cnt:18, pct: 8, desc:'Venture capital and private equity investments.'},
  {type:'Real Estate',     icon:'🏢', cnt: 8, pct: 4, desc:'Commercial real estate with economic development significance.'},
];

export default function MarketSignalsPage() {
  const [activeTab, setActiveTab] = useState<'methodology'|'types'|'verification'>('methodology');

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/><TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'40px 24px 0'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px',marginBottom:'20px'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                <div style={{width:'9px',height:'9px',borderRadius:'50%',background:'#74BB65',animation:'livePulse 2s infinite'}}/>
                <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>
                  Market Signals Module · LIVE
                </span>
              </div>
              <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'4px'}}>Signal Intelligence Framework</h1>
              <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>
                Z3 formal verification · SHA-256 provenance · SCI 0–100 · 218+ live signals
              </p>
            </div>
            <div style={{display:'flex',gap:'18px'}}>
              {[['218+','Live Signals'],['Z3','Verified'],['2s','Latency'],['SCI','0-100']].map(([v,l])=>(
                <div key={l} style={{textAlign:'center'}}>
                  <div style={{fontSize:'18px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                  <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)'}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'flex',gap:'0'}}>
            {[{id:'methodology',label:'SCI Methodology'},{id:'types',label:'Signal Types'},{id:'verification',label:'Z3 & Provenance'}].map(t=>(
              <button key={t.id} onClick={()=>setActiveTab(t.id as any)}
                style={{padding:'11px 18px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:600,
                  background:'transparent',color:activeTab===t.id?'white':'rgba(226,242,223,0.65)',
                  borderBottom:activeTab===t.id?'3px solid #74BB65':'3px solid transparent',transition:'all 0.2s'}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'24px',display:'flex',flexDirection:'column',gap:'20px'}}>

        {/* SCI METHODOLOGY */}
        {activeTab==='methodology' && (
          <>
            <div className="gfm-card" style={{padding:'24px'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'14px',display:'flex',alignItems:'center',gap:'6px'}}>
                <Shield size={14} color="#74BB65"/> Signal Confidence Index (SCI) — 5 Components
              </div>
              <div style={{fontFamily:'monospace',fontSize:'13px',color:'#0A3D62',
                background:'rgba(10,61,98,0.04)',padding:'14px',borderRadius:'9px',
                border:'1px solid rgba(10,61,98,0.1)',marginBottom:'18px',lineHeight:'1.9'}}>
                SCI = (SC × 0.25) + (VS × 0.20) + (EA × 0.20) + (TF × 0.20) + (PR × 0.15)
              </div>
              {SCI_COMPONENTS.map(c=>(
                <div key={c.code} style={{marginBottom:'14px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'5px'}}>
                    <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
                      <span style={{fontSize:'12px',fontWeight:800,color:c.color,fontFamily:'monospace',minWidth:'20px'}}>{c.code}</span>
                      <span style={{fontSize:'13px',fontWeight:600,color:'#0A3D62'}}>{c.name}</span>
                    </div>
                    <span style={{fontSize:'12px',fontWeight:800,color:c.color}}>{c.weight}%</span>
                  </div>
                  <div style={{height:'8px',borderRadius:'4px',background:'rgba(10,61,98,0.06)',marginBottom:'4px',overflow:'hidden'}}>
                    <div style={{height:'100%',borderRadius:'4px',width:`${c.weight*4}%`,background:c.color}}/>
                  </div>
                  <div style={{fontSize:'11px',color:'#696969'}}>{c.desc}</div>
                </div>
              ))}
            </div>
            {/* Grade thresholds */}
            <div className="gfm-card" style={{padding:'24px'}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
                <BarChart3 size={14} color="#74BB65"/> Grade Classification Thresholds
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px'}}>
                {GRADE_MAP.map(g=>(
                  <div key={g.grade} style={{padding:'16px',borderRadius:'10px',background:g.bg,
                    border:`1px solid ${g.color}20`,borderTop:`3px solid ${g.color}`}}>
                    <div style={{fontSize:'14px',fontWeight:900,color:g.color,marginBottom:'6px'}}>{g.grade}</div>
                    <div style={{fontSize:'16px',fontWeight:800,color:g.color,fontFamily:'monospace',marginBottom:'6px'}}>≥ {g.min}</div>
                    <div style={{display:'flex',gap:'4px',marginBottom:'8px'}}>
                      {g.z3  && <span style={{fontSize:'9px',fontWeight:700,padding:'1px 5px',borderRadius:'5px',background:`${g.color}15`,color:g.color}}>Z3</span>}
                      {g.sha && <span style={{fontSize:'9px',fontWeight:700,padding:'1px 5px',borderRadius:'5px',background:`${g.color}15`,color:g.color}}>SHA-256</span>}
                    </div>
                    <div style={{fontSize:'11px',color:'#696969',lineHeight:'1.4'}}>{g.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{textAlign:'center'}}>
              <Link href="/signals" style={{display:'inline-flex',alignItems:'center',gap:'7px',
                padding:'12px 28px',background:'#0A3D62',color:'white',borderRadius:'9px',
                textDecoration:'none',fontWeight:700,fontSize:'14px'}}>
                <Zap size={14}/> View Live Signal Feed <ArrowRight size={13}/>
              </Link>
            </div>
          </>
        )}

        {/* SIGNAL TYPES */}
        {activeTab==='types' && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
            {SIGNAL_TYPES.map(s=>(
              <div key={s.type} className="gfm-card" style={{padding:'20px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
                  <span style={{fontSize:'32px'}}>{s.icon}</span>
                  <div style={{display:'flex',gap:'6px'}}>
                    <span style={{fontSize:'16px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{s.cnt}</span>
                    <span style={{fontSize:'11px',color:'#696969',alignSelf:'center'}}>{s.pct}%</span>
                  </div>
                </div>
                <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'6px'}}>{s.type}</div>
                <div style={{fontSize:'12px',color:'#696969',lineHeight:'1.5',marginBottom:'10px'}}>{s.desc}</div>
                <div style={{height:'6px',borderRadius:'3px',background:'rgba(10,61,98,0.07)'}}>
                  <div style={{height:'100%',borderRadius:'3px',width:`${s.pct*2.44}%`,background:'#74BB65'}}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Z3 & PROVENANCE */}
        {activeTab==='verification' && (
          <PreviewGate feature="full_profile">
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <div className="gfm-card" style={{padding:'24px'}}>
                <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'14px',display:'flex',alignItems:'center',gap:'6px'}}>
                  <Shield size={14} color="#74BB65"/> Z3 Formal Verification Engine
                </div>
                <p style={{fontSize:'13px',color:'#696969',lineHeight:'1.75',marginBottom:'16px'}}>
                  Z3 is a formal proof and constraint-solving system developed by Microsoft Research. Global FDI Monitor applies 14 Z3 constraint sets to PLATINUM and GOLD signals. Only records passing all 14 constraints receive a SHA-256 provenance hash.
                </p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px'}}>
                  {[['14','Z3 Constraints'],['100%','PLATINUM Coverage'],['2s','Verification Time'],['0','False Positives/Month']].map(([v,l])=>(
                    <div key={l} style={{padding:'14px',borderRadius:'9px',background:'rgba(116,187,101,0.06)',
                      border:'1px solid rgba(116,187,101,0.15)',textAlign:'center'}}>
                      <div style={{fontSize:'18px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                      <div style={{fontSize:'11px',color:'#696969',marginTop:'3px'}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="gfm-card" style={{padding:'24px'}}>
                <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'14px',display:'flex',alignItems:'center',gap:'6px'}}>
                  <Database size={14} color="#74BB65"/> SHA-256 Provenance Chain
                </div>
                <p style={{fontSize:'13px',color:'#696969',lineHeight:'1.75',marginBottom:'14px'}}>
                  Every verified signal receives a SHA-256 hash sealing: signal reference ID + source URL + extraction timestamp + normalised data fields. The hash is stored in our audit trail and displayed on each signal card as the signal's tamper-evident digital seal.
                </p>
                <div style={{fontFamily:'monospace',fontSize:'11px',color:'#0A3D62',
                  background:'rgba(10,61,98,0.04)',padding:'12px',borderRadius:'8px',
                  border:'1px solid rgba(10,61,98,0.1)',wordBreak:'break-all'}}>
                  Example: GFM-SIG-ARE-001 → SHA-256: a1b2c3d4e5f6789...
                  <SourceBadge source="GFM Signal Verification Engine" date="20 Mar 2026" accessed="20 Mar 2026" refCode="GFM-SRC-Z3-001">
                    <span style={{color:'#74BB65',cursor:'pointer',marginLeft:'8px'}}>[verify ℹ]</span>
                  </SourceBadge>
                </div>
              </div>
            </div>
          </PreviewGate>
        )}
      </div>
      <Footer/>
    </div>
  );
}
