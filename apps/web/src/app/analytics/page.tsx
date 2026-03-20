'use client';
import { useState } from 'react';
import { BarChart3, TrendingUp, Globe, Zap, ArrowRight, Filter } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';
import PreviewGate from '@/components/PreviewGate';
import SourceBadge from '@/components/SourceBadge';
import Link from 'next/link';

const KPIS = [
  {label:'Global FDI Inflows 2025', value:'$2.94T', change:'+14%',  up:true,  src:'UNCTAD'},
  {label:'Greenfield Projects',      value:'18,240', change:'+8%',   up:true,  src:'fDi Markets'},
  {label:'PLATINUM Signals (Q1)',    value:'82',     change:'+12%',  up:true,  src:'GFM'},
  {label:'Avg SCI Score',            value:'76.4',   change:'+1.2',  up:true,  src:'GFM'},
];

const TREND_DATA = [
  {q:'Q1 2024',v:620},{q:'Q2 2024',v:680},{q:'Q3 2024',v:710},{q:'Q4 2024',v:780},
  {q:'Q1 2025',v:720},{q:'Q2 2025',v:800},{q:'Q3 2025',v:850},{q:'Q4 2025',v:940},
];

const REGIONS = [
  {name:'Asia-Pacific',  pct:38, fdi:'$1.12T', color:'#0A3D62'},
  {name:'North America', pct:24, fdi:'$706B',  color:'#74BB65'},
  {name:'Europe',        pct:19, fdi:'$558B',  color:'#1B6CA8'},
  {name:'MENA',          pct:11, fdi:'$323B',  color:'#2E86AB'},
  {name:'Latin America', pct:5,  fdi:'$147B',  color:'#696969'},
  {name:'Sub-Sah. Africa',pct:3, fdi:'$88B',   color:'#9E9E9E'},
];

const SECTORS_TOP = [
  {name:'Digital Economy & ICT', fdi:'$487B', growth:'+31%', color:'#0A3D62'},
  {name:'Financial Services',    fdi:'$312B', growth:'+8%',  color:'#74BB65'},
  {name:'Renewable Energy',      fdi:'$385B', growth:'+28%', color:'#1B6CA8'},
  {name:'Manufacturing',         fdi:'$512B', growth:'+14%', color:'#2E86AB'},
  {name:'Healthcare & Pharma',   fdi:'$228B', growth:'+16%', color:'#696969'},
];

function TrendChart({data}:{data:typeof TREND_DATA}) {
  const max = Math.max(...data.map(d=>d.v));
  const W=560, H=160, pad=40;
  const pts = data.map((d,i)=>{
    const x = pad + (i/(data.length-1))*(W-pad*2);
    const y = H-pad - ((d.v/max)*(H-pad*2));
    return {x,y,d};
  });
  const pathD = pts.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
  const fillD = `${pathD} L${pts[pts.length-1].x},${H-pad} L${pts[0].x},${H-pad} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto'}}>
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#74BB65" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#74BB65" stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      <path d={fillD} fill="url(#tg)"/>
      <path d={pathD} fill="none" stroke="#74BB65" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#74BB65" strokeWidth="2"/>
          <text x={p.x} y={H-8} textAnchor="middle" fontSize="9" fill="#696969">{p.d.q}</text>
          <text x={p.x} y={p.y-10} textAnchor="middle" fontSize="9" fontWeight="700" fill="#0A3D62">${p.d.v}B</text>
        </g>
      ))}
    </svg>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('2025');

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/><TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'36px 24px'}}>
        <div style={{maxWidth:'1300px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
              <BarChart3 size={16} color="#74BB65"/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>FDI Analytics</span>
            </div>
            <h1 style={{fontSize:'26px',fontWeight:800,color:'white',marginBottom:'4px'}}>Global FDI Analytics Dashboard</h1>
            <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>Real-time aggregates · Regional breakdown · Sector flows · Signal intelligence</p>
          </div>
          <div style={{display:'flex',gap:'4px'}}>
            {['2023','2024','2025','Q1 2026'].map(p=>(
              <button key={p} onClick={()=>setPeriod(p)}
                style={{padding:'7px 14px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:700,borderRadius:'7px',
                  background:period===p?'#74BB65':'rgba(255,255,255,0.1)',
                  color:period===p?'white':'rgba(226,242,223,0.75)'}}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1300px',margin:'0 auto',padding:'24px',display:'flex',flexDirection:'column',gap:'18px'}}>
        {/* KPIs */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px'}}>
          {KPIS.map(kpi=>(
            <div key={kpi.label} className="gfm-card" style={{padding:'18px'}}>
              <div style={{fontSize:'11px',color:'#696969',marginBottom:'8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span>{kpi.label}</span>
                <SourceBadge source={kpi.src} date="2025" accessed="20 Mar 2026" refCode={`GFM-SRC-ANA-${kpi.label.slice(0,3).toUpperCase()}`}>
                  <span style={{fontSize:'10px',color:'#696969',cursor:'default'}}>ℹ</span>
                </SourceBadge>
              </div>
              <div style={{fontSize:'26px',fontWeight:900,color:'#0A3D62',fontFamily:'monospace',lineHeight:1}}>{kpi.value}</div>
              <div style={{fontSize:'12px',fontWeight:700,marginTop:'5px',
                color:kpi.up?'#74BB65':'#E57373',display:'flex',alignItems:'center',gap:'3px'}}>
                <TrendingUp size={12}/>{kpi.change} vs prev year
              </div>
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <div className="gfm-card" style={{padding:'22px'}}>
          <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
            <TrendingUp size={14} color="#74BB65"/> Global FDI Inflows — Quarterly Trend (2024–2025)
          </div>
          <TrendChart data={TREND_DATA}/>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'18px'}}>
          {/* Regional */}
          <PreviewGate feature="full_profile">
            <div className="gfm-card" style={{padding:'22px'}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
                <Globe size={14} color="#74BB65"/> FDI by Region 2025
              </div>
              {REGIONS.map(r=>(
                <div key={r.name} style={{marginBottom:'12px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                    <span style={{fontSize:'12px',fontWeight:600,color:'#0A3D62'}}>{r.name}</span>
                    <div style={{display:'flex',gap:'10px',fontSize:'12px'}}>
                      <span style={{fontFamily:'monospace',fontWeight:700,color:'#0A3D62'}}>{r.fdi}</span>
                      <span style={{color:'#696969'}}>{r.pct}%</span>
                    </div>
                  </div>
                  <div style={{height:'8px',borderRadius:'4px',background:'rgba(10,61,98,0.06)'}}>
                    <div style={{height:'100%',borderRadius:'4px',width:`${r.pct*2.5}%`,background:r.color}}/>
                  </div>
                </div>
              ))}
            </div>
          </PreviewGate>

          {/* Sectors */}
          <div className="gfm-card" style={{padding:'22px'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
              <BarChart3 size={14} color="#74BB65"/> Top Sectors by FDI Inflows
            </div>
            {SECTORS_TOP.map(s=>(
              <div key={s.name} style={{marginBottom:'12px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                  <span style={{fontSize:'12px',fontWeight:600,color:'#0A3D62'}}>{s.name}</span>
                  <div style={{display:'flex',gap:'10px'}}>
                    <span style={{fontFamily:'monospace',fontWeight:700,color:'#0A3D62',fontSize:'12px'}}>{s.fdi}</span>
                    <span style={{fontSize:'11px',fontWeight:700,color:'#74BB65'}}>{s.growth}</span>
                  </div>
                </div>
                <div style={{height:'8px',borderRadius:'4px',background:'rgba(10,61,98,0.06)'}}>
                  <div style={{height:'100%',borderRadius:'4px',
                    width:`${parseFloat(s.fdi.replace(/[$BT]/g,''))/6}%`,background:s.color}}/>
                </div>
              </div>
            ))}
            <div style={{marginTop:'14px',paddingTop:'12px',borderTop:'1px solid rgba(10,61,98,0.06)'}}>
              <Link href="/investment-analysis" style={{display:'flex',alignItems:'center',gap:'5px',
                fontSize:'12px',fontWeight:700,color:'#74BB65',textDecoration:'none'}}>
                Deep-dive in Investment Analysis <ArrowRight size={12}/>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
