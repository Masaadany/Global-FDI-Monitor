'use client';
import { useState } from 'react';

const DIMENSIONS = [
  { code:'ETR', name:'Economic & Trade Readiness',      color:'#0A3D62', pct:72, weight:20,
    desc:'GDP growth · Trade openness · FDI stock · Tariff complexity · Export diversification',
    indicators:['GDP growth rate','Trade-to-GDP ratio','FDI stock % GDP','Applied MFN tariff','Export concentration index'] },
  { code:'ICT', name:'Innovation & Competitiveness',    color:'#74BB65', pct:68, weight:18,
    desc:'GII assessment · R&D spend · Unicorn density · Patent activity · Startup ecosystem',
    indicators:['GII score','R&D % GDP','Unicorns per million','Patent filings','Startup density'] },
  { code:'TCM', name:'Talent & Capital Markets',        color:'#1B6CA8', pct:65, weight:17,
    desc:'Tertiary enrolment · Talent retention · Market cap · Venture capital · Banking depth',
    indicators:['Tertiary enrolment %','Talent retention index','Stock market cap % GDP','VC investment','Private credit % GDP'] },
  { code:'DTF', name:'Digital & Tech Foundations',      color:'#22c55e', pct:70, weight:16,
    desc:'Broadband penetration · 5G rollout · Digital gov · Cloud adoption · Cybersecurity',
    indicators:['Fixed broadband %','5G coverage %','GovTech index','Cloud adoption','Cybersecurity index'] },
  { code:'SGT', name:'Sustainability & Governance',     color:'#2E86AB', pct:63, weight:15,
    desc:'CCPI score · ESG regulatory · Rule of law · Anti-corruption · Green energy %',
    indicators:['CCPI score','ESG regulation','Rule of Law index','Corruption Perceptions','Renewable energy %'] },
  { code:'GRP', name:'Geopolitical & Risk Profile',     color:'#F6AE2D', pct:58, weight:14,
    desc:'Stability index · Sanctions exposure · Treaty network · BITs · Political risk',
    indicators:['Political stability','Sanctions exposure','BITs count','Credit rating','Country risk premium'] },
];

const FACTORS = [
  { code:'IRES', name:'Investment Readiness Score',         color:'#0A3D62', val:'82.4' },
  { code:'IMS',  name:'Investment Momentum Score',          color:'#74BB65', val:'76.1' },
  { code:'SCI',  name:'Signal Confidence Index',            color:'#1B6CA8', val:'94.8' },
  { code:'FZII', name:'Free Zone Investment Intelligence',  color:'#22c55e', val:'71.3' },
  { code:'PAI',  name:'Policy Alignment Indicator',         color:'#2E86AB', val:'67.9' },
  { code:'GCI',  name:'Green Capital Index',                color:'#F6AE2D', val:'59.2' },
];

export default function DimensionWheel({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState<string|null>(null);
  const activeD = DIMENSIONS.find(d=>d.code===active);

  return (
    <div>
      {/* Six-dimension radial visualization */}
      <div style={{display:'flex',gap:'24px',flexWrap:'wrap',alignItems:'flex-start'}}>

        {/* SVG Wheel */}
        <div style={{flexShrink:0}}>
          <svg width="280" height="280" viewBox="0 0 280 280" role="img" aria-label="GFR 6-dimension wheel">
            {/* Center */}
            <circle cx="140" cy="140" r="40" fill="#0A3D62"/>
            <text x="140" y="135" textAnchor="middle" fontSize="10" fill="white" fontWeight="700">GFR</text>
            <text x="140" y="148" textAnchor="middle" fontSize="8" fill="rgba(226,242,223,0.8)">Score</text>

            {DIMENSIONS.map((d, i) => {
              const angle = (i * 60 - 90) * (Math.PI / 180);
              const inner = 50, outer = 115;
              const x1 = 140 + inner * Math.cos(angle), y1 = 140 + inner * Math.sin(angle);
              const x2 = 140 + outer * Math.cos(angle), y2 = 140 + outer * Math.sin(angle);
              const mx = 140 + (outer+22) * Math.cos(angle), my = 140 + (outer+22) * Math.sin(angle);
              const isActive = active === d.code;
              const barLen = ((d.pct/100) * (outer - inner));
              const bx = 140 + inner * Math.cos(angle), by = 140 + inner * Math.sin(angle);
              const ex = 140 + (inner + barLen) * Math.cos(angle), ey = 140 + (inner + barLen) * Math.sin(angle);

              return (
                <g key={d.code} onClick={()=>setActive(active===d.code?null:d.code)} style={{cursor:'pointer'}}>
                  {/* Track */}
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(10,61,98,0.1)" strokeWidth="12" strokeLinecap="round"/>
                  {/* Value bar */}
                  <line x1={bx} y1={by} x2={ex} y2={ey} stroke={d.color} strokeWidth={isActive?14:10}
                    strokeLinecap="round" opacity={isActive?1:0.8}/>
                  {/* Label */}
                  <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle"
                    fontSize={isActive?9:8} fontWeight={isActive?700:600} fill={isActive?d.color:'#0A3D62'}>
                    {d.code}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dimension details */}
        <div style={{flex:1,minWidth:'200px'}}>
          {DIMENSIONS.map(d=>(
            <div key={d.code} onClick={()=>setActive(active===d.code?null:d.code)}
              className="gfm-card"
              style={{
                padding:'8px 12px',marginBottom:'6px',cursor:'pointer',
                borderLeft:`3px solid ${d.color}`,
                background: active===d.code ? `${d.color}08` : 'white',
              }}>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <span style={{fontWeight:800,fontSize:'12px',color:d.color,minWidth:'32px'}}>{d.code}</span>
                <span style={{fontSize:'11px',fontWeight:600,color:'#0A3D62',flex:1}}>{d.name}</span>
                <span style={{fontSize:'12px',fontWeight:700,color:d.color,fontFamily:'monospace'}}>{d.pct}</span>
                <span style={{fontSize:'10px',color:'#696969'}}>W:{d.weight}%</span>
              </div>
              {active===d.code && (
                <div style={{marginTop:'6px',paddingTop:'6px',borderTop:'1px solid rgba(10,61,98,0.08)'}}>
                  <div style={{fontSize:'10px',color:'#696969',marginBottom:'4px'}}>{d.desc}</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'3px'}}>
                    {d.indicators.map(ind=>(
                      <span key={ind} style={{fontSize:'9px',background:'rgba(10,61,98,0.06)',
                        color:'#0A3D62',padding:'2px 6px',borderRadius:'4px'}}>{ind}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Proprietary factors */}
      {!compact && (
        <div style={{marginTop:'16px'}}>
          <div style={{fontSize:'11px',fontWeight:700,color:'#696969',
            textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'10px'}}>
            Proprietary Intelligence Factors
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px'}}>
            {FACTORS.map(f=>(
              <div key={f.code} className="gfm-card" style={{padding:'10px',textAlign:'center'}}>
                <div style={{fontSize:'11px',fontWeight:800,color:f.color,marginBottom:'2px'}}>{f.code}</div>
                <div style={{fontSize:'18px',fontWeight:700,color:'#0A3D62',fontFamily:'monospace'}}>{f.val}</div>
                <div style={{fontSize:'9px',color:'#696969',marginTop:'2px',lineHeight:'1.3'}}>{f.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
