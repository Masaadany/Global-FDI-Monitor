'use client';
import { useState } from 'react';
import { BarChart3, Globe, TrendingUp, Target, Plus, Award } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import TrialBanner from '@/components/TrialBanner';
import RadarChart from '@/components/RadarChart';
import PreviewGate from '@/components/PreviewGate';

const ECONOMIES = [
  { iso3:'SGP',name:'Singapore',   flag:'🇸🇬',score:100.0,ETR:98.2,ICT:97.5,TCM:96.8,DTF:95.4,SGT:94.2,GRP:93.8,color:'#0A3D62' },
  { iso3:'ARE',name:'UAE',         flag:'🇦🇪',score:94.2, ETR:93.5,ICT:92.8,TCM:93.1,DTF:92.5,SGT:91.8,GRP:90.5,color:'#74BB65' },
  { iso3:'DEU',name:'Germany',     flag:'🇩🇪',score:95.8, ETR:94.2,ICT:93.8,TCM:94.1,DTF:93.5,SGT:92.1,GRP:91.8,color:'#1B6CA8' },
  { iso3:'SAU',name:'Saudi Arabia',flag:'🇸🇦',score:86.2, ETR:85.8,ICT:84.5,TCM:86.1,DTF:84.8,SGT:83.5,GRP:82.9,color:'#2E86AB' },
  { iso3:'IND',name:'India',       flag:'🇮🇳',score:82.1, ETR:81.5,ICT:80.8,TCM:82.5,DTF:79.8,SGT:78.5,GRP:77.9,color:'#696969' },
  { iso3:'VNM',name:'Vietnam',     flag:'🇻🇳',score:79.4, ETR:78.8,ICT:77.5,TCM:79.2,DTF:76.5,SGT:75.2,GRP:74.8,color:'#9E9E9E' },
];

const DIMS = ['ETR','ICT','TCM','DTF','SGT','GRP'] as const;
const DIM_LABELS: Record<string,string> = {ETR:'Economic\nResilience',ICT:'Innovation\nCapacity',TCM:'Trade &\nCapital',DTF:'Digital &\nTech',SGT:'Sustainable\nGrowth',GRP:'Governance\n& Policy'};



export default function BenchmarkingPage() {
  const [selected, setSelected] = useState<string[]>(['SGP','ARE','DEU']);
  const [activeDim, setActiveDim] = useState<string|null>(null);

  function toggle(iso3: string) {
    setSelected(s => s.includes(iso3) ? s.filter(x=>x!==iso3) : s.length<5 ? [...s,iso3] : s);
  }

  const selectedEcos = ECONOMIES.filter(e=>selected.includes(e.iso3));

  // Build radar axes for first selected economy
  const radarAxes = DIMS.map(d=>({
    label:d,
    value:selectedEcos[0]?selectedEcos[0][d]:0,
    max:100,
  }));

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'36px 24px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
              <BarChart3 size={16} color="#74BB65"/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>Economy Benchmarking</span>
            </div>
            <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'6px'}}>Compare GFR Dimensions</h1>
            <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>
              Select up to 5 economies to compare across 6 GFR dimensions
            </p>
          </div>
          <div style={{display:'flex',gap:'16px'}}>
            {[['6','Dimensions'],['215','Economies'],['38','Indicators']].map(([v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:'20px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'24px'}}>
        {/* Economy selector */}
        <div style={{background:'white',borderRadius:'12px',padding:'20px',marginBottom:'20px',
          boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
          <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'12px',
            display:'flex',alignItems:'center',gap:'6px'}}>
            <Globe size={14} color="#74BB65"/> Selected: {selectedEcos.map(e=>e.flag+' '+e.name).join(' · ')}
          </div>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            {ECONOMIES.map(e=>(
              <button key={e.iso3} onClick={()=>toggle(e.iso3)}
                style={{display:'flex',alignItems:'center',gap:'6px',padding:'7px 14px',borderRadius:'8px',
                  border:selected.includes(e.iso3)?`2px solid ${e.color}`:'1px solid rgba(10,61,98,0.12)',
                  background:selected.includes(e.iso3)?`${e.color}0F`:'white',cursor:'pointer',
                  fontSize:'13px',fontWeight:600,color:selected.includes(e.iso3)?e.color:'#0A3D62',
                  transition:'all 0.15s'}}>
                <span style={{fontSize:'18px'}}>{e.flag}</span>{e.name}
                {selected.includes(e.iso3) && <span style={{fontSize:'14px',color:e.color}}>✓</span>}
              </button>
            ))}
            {selected.length < 5 && (
              <button style={{display:'flex',alignItems:'center',gap:'5px',padding:'7px 14px',borderRadius:'8px',
                border:'1px dashed rgba(10,61,98,0.2)',background:'transparent',cursor:'pointer',
                fontSize:'13px',color:'#696969'}}>
                <Plus size={14}/> Add economy
              </button>
            )}
          </div>
        </div>

        <PreviewGate feature="full_profile">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
            {/* Radar charts — one per selected economy */}
            <div style={{background:'white',borderRadius:'12px',padding:'24px',
              boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',
                display:'flex',alignItems:'center',gap:'6px'}}>
                <Award size={14} color="#74BB65"/> GFR Radar — {selectedEcos[0]?.name||'Select economy'}
              </div>
              {selectedEcos[0] && (
                <RadarChart axes={DIMS.map(d=>({label:d,value:selectedEcos[0][d],max:100}))} size={260} animated/>
              )}
            </div>

            {/* Dimension bar comparison */}
            <div style={{background:'white',borderRadius:'12px',padding:'24px',
              boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',
                display:'flex',alignItems:'center',gap:'6px'}}>
                <TrendingUp size={14} color="#74BB65"/> Dimension Comparison
              </div>
              {DIMS.map(dim=>(
                <div key={dim} style={{marginBottom:'12px',cursor:'pointer'}}
                  onMouseEnter={()=>setActiveDim(dim)} onMouseLeave={()=>setActiveDim(null)}>
                  <div style={{fontSize:'11px',fontWeight:700,color:'#0A3D62',marginBottom:'5px'}}>{dim}</div>
                  <div style={{display:'flex',flexDirection:'column',gap:'3px'}}>
                    {selectedEcos.map(e=>(
                      <div key={e.iso3} style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <span style={{fontSize:'14px',flexShrink:0}}>{e.flag}</span>
                        <div style={{flex:1,height:'8px',borderRadius:'4px',background:'rgba(10,61,98,0.06)'}}>
                          <div style={{height:'100%',borderRadius:'4px',
                            width:`${e[dim as keyof typeof e] as number}%`,
                            background:e.color,transition:'width 0.4s ease',
                            opacity:activeDim===dim||!activeDim?1:0.4}}/>
                        </div>
                        <span style={{fontSize:'10px',color:e.color,fontFamily:'monospace',fontWeight:700,minWidth:'28px'}}>
                          {(e[dim as keyof typeof e] as number).toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison table */}
          <div style={{background:'white',borderRadius:'12px',overflow:'hidden',marginTop:'20px',
            boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(10,61,98,0.06)',
              display:'flex',alignItems:'center',gap:'6px'}}>
              <Target size={14} color="#74BB65"/>
              <span style={{fontSize:'13px',fontWeight:700,color:'#0A3D62'}}>Full Comparison Table</span>
            </div>
            <div style={{overflowX:'auto'}}>
              <table className="gfm-table">
                <thead><tr>
                  <th>Economy</th><th>Score</th>
                  {DIMS.map(d=><th key={d}>{d}</th>)}
                  <th>vs 2025</th>
                </tr></thead>
                <tbody>
                  {selectedEcos.map(e=>(
                    <tr key={e.iso3}>
                      <td><div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <span style={{fontSize:'18px'}}>{e.flag}</span>
                        <span style={{fontWeight:700,color:'#0A3D62'}}>{e.name}</span>
                      </div></td>
                      <td>
                        <span style={{fontSize:'15px',fontWeight:900,color:e.color,fontFamily:'monospace'}}>{e.score.toFixed(1)}</span>
                      </td>
                      {DIMS.map(d=>(
                        <td key={d} style={{fontFamily:'monospace',fontSize:'12px',color:'#696969'}}>{(e[d as keyof typeof e] as number).toFixed(1)}</td>
                      ))}
                      <td style={{fontFamily:'monospace',fontWeight:700,color:'#74BB65'}}>+{Math.round(Math.random()*5+1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </PreviewGate>
      </div>
      <Footer/>
    </div>
  );
}
