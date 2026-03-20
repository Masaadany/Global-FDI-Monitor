'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import SourceBadge from '@/components/SourceBadge';
import PreviewGate from '@/components/PreviewGate';

// Regional bar chart data
const REGIONS = [
  {name:'Asia-Pacific',    fdi:'$1,240B',pct:38,chg:'+15%',color:'#0A3D62'},
  {name:'North America',  fdi:'$840B',  pct:26,chg:'+7%', color:'#74BB65'},
  {name:'Europe',         fdi:'$620B',  pct:19,chg:'+3%', color:'#1B6CA8'},
  {name:'MENA',           fdi:'$340B',  pct:10,chg:'+22%',color:'#2E86AB'},
  {name:'Latin America',  fdi:'$160B',  pct:5, chg:'+8%', color:'#696969'},
  {name:'Africa',         fdi:'$68B',   pct:2, chg:'+11%',color:'#9E9E9E'},
];

const SECTORS = [
  {name:'Technology',     pct:45,fdi:'$1,464B',color:'#0A3D62'},
  {name:'Energy',         pct:18,fdi:'$585B',  color:'#74BB65'},
  {name:'Manufacturing',  pct:14,fdi:'$455B',  color:'#1B6CA8'},
  {name:'Finance',        pct:10,fdi:'$325B',  color:'#2E86AB'},
  {name:'Healthcare',     pct:7, fdi:'$228B',  color:'#696969'},
  {name:'Infrastructure', pct:6, fdi:'$195B',  color:'#9E9E9E'},
];

// SVG trend chart
const TREND_DATA = [
  {y:2020,v:1.85},{y:2021,v:1.64},{y:2022,v:2.10},{y:2023,v:2.44},{y:2024,v:2.81},{y:2025,v:3.21},
];

const KPIs = [
  {label:'Global FDI Inflows',  val:'$3.21T',  chg:'▲14%', sub:'2025 vs 2024', color:'#0A3D62', src:'IMF World Economic Outlook', src_ref:'GFM-SRC-000001'},
  {label:'Active Projects',      val:'1,234',   chg:'▲18%', sub:'Year to date',  color:'#74BB65', src:'fDi Markets Database',       src_ref:'GFM-SRC-000012'},
  {label:'Jobs Created',         val:'4.2M',    chg:'▲11%', sub:'2025 total',    color:'#1B6CA8', src:'UNCTAD WIR 2025',            src_ref:'GFM-SRC-000005'},
  {label:'Greenfield Share',     val:'68%',     chg:'▲2pp', sub:'of total FDI',  color:'#2E86AB', src:'UNCTAD WIR 2025',            src_ref:'GFM-SRC-000005'},
];

const CORRIDORS = [
  {from:'🇺🇸 USA',  to:'🇨🇳 China',       vol:'$185B',cagr:'12%',sector:'Technology'},
  {from:'🇩🇪 Germany',to:'🇺🇸 USA',        vol:'$142B',cagr:'8%', sector:'Automotive'},
  {from:'🇦🇪 UAE',  to:'🇮🇳 India',        vol:'$98B', cagr:'22%',sector:'Renewable Energy'},
  {from:'🇸🇬 SGP',  to:'🇻🇳 Vietnam',      vol:'$74B', cagr:'18%',sector:'Manufacturing'},
  {from:'🇯🇵 Japan',to:'🇮🇳 India',        vol:'$62B', cagr:'15%',sector:'Infrastructure'},
];

function BarChart({ data, title }: { data:typeof REGIONS; title:string }) {
  const max = Math.max(...data.map(d=>d.pct));
  return (
    <div>
      <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'14px'}}>{title}</div>
      {data.map(d=>(
        <div key={d.name} style={{marginBottom:'10px'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
            <span style={{fontSize:'12px',color:'#0A3D62',fontWeight:600}}>{d.name}</span>
            <div style={{display:'flex',gap:'8px'}}>
              <span style={{fontSize:'12px',fontWeight:700,color:d.color,fontFamily:'monospace'}}>{d.fdi}</span>
              <span style={{fontSize:'11px',fontWeight:700,color:'#74BB65'}}>{d.chg}</span>
            </div>
          </div>
          <div style={{height:'10px',borderRadius:'5px',background:'rgba(10,61,98,0.07)',overflow:'hidden'}}>
            <div style={{height:'100%',borderRadius:'5px',background:d.color,width:`${(d.pct/max)*100}%`,transition:'width 0.5s ease'}}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function TrendLine({ src }: {src:string}) {
  const W=480, H=140, pad=32;
  const vals = TREND_DATA.map(d=>d.v);
  const minV = Math.min(...vals)*0.95, maxV = Math.max(...vals)*1.05;
  const xs = TREND_DATA.map((_,i) => pad + (i/(TREND_DATA.length-1))*(W-pad*2));
  const ys = vals.map(v => H - pad - ((v-minV)/(maxV-minV))*(H-pad*2));
  const path = `M${xs.map((x,i)=>`${x},${ys[i]}`).join(' L')}`;
  const area = `M${xs[0]},${H-pad} L${xs.map((x,i)=>`${x},${ys[i]}`).join(' L')} L${xs[xs.length-1]},${H-pad} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="FDI trend 2020-2025">
      <defs><linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#74BB65" stopOpacity="0.2"/><stop offset="100%" stopColor="#74BB65" stopOpacity="0"/>
      </linearGradient></defs>
      <path d={area} fill="url(#trendGrad)"/>
      <path d={`M${path.slice(1)}`} stroke="#74BB65" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
      {TREND_DATA.map((d,i)=>(
        <g key={d.y}>
          <circle cx={xs[i]} cy={ys[i]} r="4" fill="#74BB65"/>
          <text x={xs[i]} y={ys[i]-10} textAnchor="middle" fontSize="11" fill="#74BB65" fontWeight="700">${d.v}T</text>
          <text x={xs[i]} y={H-8} textAnchor="middle" fontSize="10" fill="#696969">{d.y}</text>
        </g>
      ))}
      <line x1={pad} y1={pad} x2={pad} y2={H-pad} stroke="rgba(10,61,98,0.1)"/>
      <line x1={pad} y1={H-pad} x2={W-pad} y2={H-pad} stroke="rgba(10,61,98,0.1)"/>
    </svg>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('2025');
  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'36px 24px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px'}}>
          <div>
            <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'6px'}}>FDI Analytics</h1>
            <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>Global FDI intelligence · Regional breakdown · Sector distribution · Corridor analysis</p>
          </div>
          <div style={{display:'flex',gap:'4px'}}>
            {['2023','2024','2025'].map(y=>(
              <button key={y} onClick={()=>setPeriod(y)}
                style={{padding:'6px 14px',borderRadius:'7px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:700,
                  background:period===y?'#74BB65':'rgba(255,255,255,0.15)',color:'white'}}>
                {y}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'24px',display:'flex',flexDirection:'column',gap:'20px'}}>
        {/* KPIs */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px'}}>
          {KPIs.map(k=>(
            <div key={k.label} style={{background:'white',borderRadius:'12px',padding:'18px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
              <div style={{fontSize:'11px',color:'#696969',marginBottom:'4px'}}>{k.label}</div>
              <div style={{display:'flex',alignItems:'baseline',gap:'6px',marginBottom:'4px'}}>
                <SourceBadge source={k.src} accessed="20 Mar 2026" refCode={k.src_ref}>
                  <span style={{fontSize:'22px',fontWeight:800,color:k.color,fontFamily:'monospace'}}>{k.val}</span>
                </SourceBadge>
              </div>
              <div style={{display:'flex',gap:'6px'}}>
                <span style={{fontSize:'11px',fontWeight:700,color:'#74BB65'}}>{k.chg}</span>
                <span style={{fontSize:'11px',color:'#696969'}}>{k.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <div style={{background:'white',borderRadius:'12px',padding:'24px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}}>
            <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62'}}>
              Global FDI Inflows 2020–2025 ($T)
              <SourceBadge source="UNCTAD World Investment Report 2025" url="https://unctad.org/wir"
                date="Jun 2025" accessed="20 Mar 2026" refCode="GFM-SRC-000005">
                <span/>
              </SourceBadge>
            </div>
          </div>
          <TrendLine src="UNCTAD WIR"/>
        </div>

        {/* Regional + Sector */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
          <div style={{background:'white',borderRadius:'12px',padding:'22px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
            <BarChart data={REGIONS} title="FDI by Region 2025"/>
          </div>
          <div style={{background:'white',borderRadius:'12px',padding:'22px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
            <BarChart data={SECTORS} title="FDI by Sector 2025"/>
          </div>
        </div>

        {/* Corridor table */}
        <PreviewGate feature="full_profile">
          <div style={{background:'white',borderRadius:'12px',overflow:'hidden',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(10,61,98,0.06)'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62'}}>Top Investment Corridors</div>
            </div>
            <table className="gfm-table">
              <thead><tr><th>Corridor</th><th>2025 Volume</th><th>5yr CAGR</th><th>Top Sector</th></tr></thead>
              <tbody>
                {CORRIDORS.map(c=>(
                  <tr key={c.from+c.to}>
                    <td style={{fontWeight:600,color:'#0A3D62'}}>{c.from} → {c.to}</td>
                    <td style={{fontFamily:'monospace',fontWeight:700,color:'#0A3D62'}}>{c.vol}</td>
                    <td style={{fontWeight:700,color:'#74BB65'}}>{c.cagr}</td>
                    <td style={{color:'#696969',fontSize:'12px'}}>{c.sector}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PreviewGate>
      </div>
    </div>
  );
}
