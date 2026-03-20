'use client';
import { Globe, TrendingUp, BarChart3, MapPin, Building2, Activity, Award } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import RadarChart from '@/components/RadarChart';
import PreviewGate from '@/components/PreviewGate';
import Link from 'next/link';

const COUNTRIES: Record<string,{name:string;flag:string;region:string;capital:string;pop:string;gdp:string;gfr:number;gfrRank:number;gfrTier:string;fdi:string;fdiGrowth:string;freezones:number;sectors:string[];dims:number[];signals:number;color:string}> = {
  ARE:{name:'United Arab Emirates',flag:'🇦🇪',region:'MENA',capital:'Abu Dhabi',pop:'9.4M',gdp:'$415B',gfr:94.2,gfrRank:5,gfrTier:'VERY HIGH',fdi:'$25.3B',fdiGrowth:'+12%',freezones:45,sectors:['Technology','Finance','Logistics','Renewables'],dims:[93,95,92,94,91,96],signals:34,color:'#74BB65'},
  SAU:{name:'Saudi Arabia',flag:'🇸🇦',region:'MENA',capital:'Riyadh',pop:'35.9M',gdp:'$1.1T',gfr:86.2,gfrRank:15,gfrTier:'HIGH',fdi:'$18.2B',fdiGrowth:'+15%',freezones:8,sectors:['Energy','Technology','Tourism'],dims:[85,88,84,87,83,86],signals:22,color:'#0A3D62'},
  SGP:{name:'Singapore',flag:'🇸🇬',region:'Asia-Pacific',capital:'Singapore',pop:'5.9M',gdp:'$466B',gfr:100.0,gfrRank:1,gfrTier:'VERY HIGH',fdi:'$18.5B',fdiGrowth:'+6%',freezones:12,sectors:['Finance','Technology','Biotech','Logistics'],dims:[99,100,98,100,97,99],signals:28,color:'#74BB65'},
  IND:{name:'India',flag:'🇮🇳',region:'South Asia',capital:'New Delhi',pop:'1.44B',gdp:'$3.7T',gfr:82.1,gfrRank:18,gfrTier:'HIGH',fdi:'$12.3B',fdiGrowth:'+9%',freezones:24,sectors:['Technology','Manufacturing','Pharma','Renewables'],dims:[81,84,80,83,79,82],signals:18,color:'#1B6CA8'},
  DEU:{name:'Germany',flag:'🇩🇪',region:'Europe',capital:'Berlin',pop:'84.4M',gdp:'$4.1T',gfr:95.8,gfrRank:4,gfrTier:'VERY HIGH',fdi:'$14.2B',fdiGrowth:'+3%',freezones:0,sectors:['Auto','Engineering','Technology','Chemicals'],dims:[95,96,94,97,93,95],signals:15,color:'#696969'},
};

const TIER_C: Record<string,string> = {'VERY HIGH':'#74BB65','HIGH':'#0A3D62','MEDIUM':'#1B6CA8','LOW':'#696969'};
const DIM_LABELS = ['ETR','ICT','TCM','DTF','SGT','GRP'];

export default function CountryClient({ iso3 }: { iso3: string }) {
  const data = COUNTRIES[iso3];
  if (!data) return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/><TrialBanner/>
      <div style={{maxWidth:'800px',margin:'60px auto',textAlign:'center',padding:'24px'}}>
        <div style={{fontSize:'48px',marginBottom:'16px'}}>🌍</div>
        <h2 style={{fontSize:'22px',fontWeight:700,color:'#0A3D62',marginBottom:'8px'}}>Country Profile: {iso3}</h2>
        <p style={{fontSize:'14px',color:'#696969',marginBottom:'20px'}}>Full profiles for all 215 economies available with Professional access.</p>
        <div style={{display:'flex',gap:'10px',justifyContent:'center',flexWrap:'wrap'}}>
          {Object.entries(COUNTRIES).map(([k,c])=>(
            <Link key={k} href={`/country/${k}`}
              style={{padding:'8px 16px',borderRadius:'8px',background:'#0A3D62',color:'white',textDecoration:'none',fontWeight:700,fontSize:'13px'}}>
              {c.flag} {c.name.split(' ')[0]}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/><TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'40px 24px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{display:'flex',gap:'20px',alignItems:'flex-start',flexWrap:'wrap'}}>
            <div style={{fontSize:'64px',lineHeight:1}}>{data.flag}</div>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'6px',flexWrap:'wrap'}}>
                <h1 style={{fontSize:'32px',fontWeight:900,color:'white',margin:0}}>{data.name}</h1>
                <span style={{fontSize:'12px',fontWeight:700,padding:'3px 10px',borderRadius:'20px',
                  background:`${TIER_C[data.gfrTier]}20`,color:TIER_C[data.gfrTier],
                  border:`1px solid ${TIER_C[data.gfrTier]}40`}}>{data.gfrTier} GFR</span>
              </div>
              <div style={{fontSize:'13px',color:'rgba(226,242,223,0.75)',marginBottom:'16px',display:'flex',gap:'16px',flexWrap:'wrap'}}>
                <span style={{display:'flex',alignItems:'center',gap:'4px'}}><MapPin size={12}/>{data.capital}</span>
                <span style={{display:'flex',alignItems:'center',gap:'4px'}}><Globe size={12}/>{data.region}</span>
                <span>Pop: {data.pop} · GDP: {data.gdp}</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'12px'}}>
                {[{l:'GFR Score',v:data.gfr.toFixed(1),c:'#74BB65'},{l:'GFR Rank',v:`#${data.gfrRank}`,c:'white'},
                  {l:'FDI Inflows',v:data.fdi,c:'#74BB65'},{l:'FDI Growth',v:data.fdiGrowth,c:'#74BB65'},
                  {l:'Free Zones',v:`${data.freezones}`,c:'white'},{l:'Signals',v:`${data.signals}`,c:'#74BB65'}].map(({l,v,c})=>(
                  <div key={l} style={{background:'rgba(255,255,255,0.08)',borderRadius:'10px',padding:'12px',textAlign:'center'}}>
                    <div style={{fontSize:'18px',fontWeight:800,color:c,fontFamily:'monospace',lineHeight:1}}>{v}</div>
                    <div style={{fontSize:'9px',color:'rgba(226,242,223,0.6)',marginTop:'3px'}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'24px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
        <div style={{background:'white',borderRadius:'12px',padding:'22px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
          <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'14px',display:'flex',alignItems:'center',gap:'6px'}}>
            <BarChart3 size={14} color="#74BB65"/> GFR Dimension Scores
          </div>
          <RadarChart axes={DIM_LABELS.map((l,i)=>({label:l,value:data.dims[i],max:100}))} size={260}/>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          <div style={{background:'white',borderRadius:'12px',padding:'20px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'12px',display:'flex',alignItems:'center',gap:'6px'}}>
              <TrendingUp size={14} color="#74BB65"/> Top FDI Sectors
            </div>
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
              {data.sectors.map(s=>(
                <span key={s} style={{fontSize:'12px',padding:'5px 12px',borderRadius:'20px',
                  background:'rgba(116,187,101,0.1)',color:'#0A3D62',fontWeight:600}}>{s}</span>
              ))}
            </div>
          </div>
          <PreviewGate feature="full_profile">
            <div style={{background:'white',borderRadius:'12px',padding:'20px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'12px',display:'flex',alignItems:'center',gap:'6px'}}>
                <Activity size={14} color="#74BB65"/> Investment Signal Summary
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                {[['Active Signals',data.signals],['FDI Inflows',data.fdi],['Growth YoY',data.fdiGrowth],['GFR Score',data.gfr]].map(([l,v])=>(
                  <div key={l} style={{padding:'12px',borderRadius:'8px',background:'rgba(10,61,98,0.03)',textAlign:'center'}}>
                    <div style={{fontSize:'16px',fontWeight:800,color:data.color,fontFamily:'monospace'}}>{v}</div>
                    <div style={{fontSize:'10px',color:'#696969',marginTop:'2px'}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </PreviewGate>
          <div style={{background:'white',borderRadius:'12px',padding:'16px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
            <div style={{fontSize:'12px',fontWeight:700,color:'#696969',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'8px'}}>Other Economies</div>
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
              {Object.entries(COUNTRIES).filter(([k])=>k!==iso3).map(([k,c])=>(
                <Link key={k} href={`/country/${k}`}
                  style={{padding:'5px 10px',borderRadius:'7px',background:'rgba(10,61,98,0.05)',
                    textDecoration:'none',fontSize:'12px',fontWeight:600,color:'#0A3D62'}}>
                  {c.flag} {c.name.split(' ')[0]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
