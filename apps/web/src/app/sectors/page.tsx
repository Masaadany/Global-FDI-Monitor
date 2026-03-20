'use client';
import { useState } from 'react';
import { Building2, Target, Globe, BarChart3, Zap, ArrowRight, TrendingUp, Factory } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import PreviewGate from '@/components/PreviewGate';
import Footer from '@/components/Footer';
import Link from 'next/link';

const SECTORS = [
  {id:'A', code:'ISIC-A', name:'Agriculture & Agribusiness',    fdi:'$168B', growth:'+11%', hotspot:'🇧🇷 Brazil · 🇺🇦 Ukraine',     color:'#74BB65', icon:'🌾', signals:18},
  {id:'B', code:'ISIC-B', name:'Mining & Natural Resources',    fdi:'$245B', growth:'+6%',  hotspot:'🇦🇺 Australia · 🇿🇦 S. Africa', color:'#696969', icon:'⛏', signals:22},
  {id:'C', code:'ISIC-C', name:'Manufacturing',                 fdi:'$512B', growth:'+14%', hotspot:'🇻🇳 Vietnam · 🇲🇽 Mexico',     color:'#0A3D62', icon:'🏭', signals:41},
  {id:'D', code:'ISIC-D', name:'Electricity & Power',           fdi:'$187B', growth:'+18%', hotspot:'🇩🇪 Germany · 🇮🇳 India',      color:'#FFB347', icon:'⚡', signals:31},
  {id:'E', code:'ISIC-E', name:'Water & Waste Management',      fdi:'$42B',  growth:'+7%',  hotspot:'🇸🇬 Singapore · 🇦🇪 UAE',      color:'#2E86AB', icon:'💧', signals:8},
  {id:'F', code:'ISIC-F', name:'Construction & Real Estate',    fdi:'$224B', growth:'+9%',  hotspot:'🇸🇦 Saudi · 🇦🇪 UAE',          color:'#1B6CA8', icon:'🏗', signals:27},
  {id:'G', code:'ISIC-G', name:'Wholesale & Retail Trade',      fdi:'$134B', growth:'+5%',  hotspot:'🇮🇳 India · 🇧🇷 Brazil',       color:'#74BB65', icon:'🛍', signals:14},
  {id:'H', code:'ISIC-H', name:'Transport & Logistics',         fdi:'$218B', growth:'+12%', hotspot:'🇸🇬 Singapore · 🇦🇪 UAE',      color:'#0A3D62', icon:'🚢', signals:33},
  {id:'I', code:'ISIC-I', name:'Hospitality & Tourism',         fdi:'$96B',  growth:'+22%', hotspot:'🇦🇪 UAE · 🇸🇦 Saudi',          color:'#74BB65', icon:'🏨', signals:19},
  {id:'J', code:'ISIC-J', name:'Digital Economy & ICT',         fdi:'$487B', growth:'+31%', hotspot:'🇺🇸 USA · 🇸🇬 Singapore',      color:'#0A3D62', icon:'💻', signals:58},
  {id:'K', code:'ISIC-K', name:'Financial Services',            fdi:'$312B', growth:'+8%',  hotspot:'🇬🇧 UK · 🇸🇬 Singapore',       color:'#2E86AB', icon:'🏦', signals:29},
  {id:'L', code:'ISIC-L', name:'Real Estate (Commercial)',      fdi:'$189B', growth:'+7%',  hotspot:'🇦🇪 UAE · 🇬🇧 UK',             color:'#696969', icon:'🏢', signals:21},
  {id:'M', code:'ISIC-M', name:'Professional & Business Svcs',  fdi:'$145B', growth:'+10%', hotspot:'🇮🇳 India · 🇵🇱 Poland',       color:'#1B6CA8', icon:'📊', signals:16},
  {id:'N', code:'ISIC-N', name:'Admin & Support Services',      fdi:'$67B',  growth:'+8%',  hotspot:'🇵🇭 Philippines · 🇮🇳 India',  color:'#696969', icon:'🗂', signals:9},
  {id:'O', code:'ISIC-O', name:'Public Admin & Defence',        fdi:'$28B',  growth:'+3%',  hotspot:'🇩🇪 Germany · 🇫🇷 France',     color:'#9E9E9E', icon:'🏛', signals:5},
  {id:'P', code:'ISIC-P', name:'Education & Training',          fdi:'$54B',  growth:'+15%', hotspot:'🇸🇬 Singapore · 🇦🇪 UAE',      color:'#74BB65', icon:'📚', signals:11},
  {id:'Q', code:'ISIC-Q', name:'Healthcare & Pharma',           fdi:'$228B', growth:'+16%', hotspot:'🇸🇬 Singapore · 🇮🇳 India',    color:'#2E86AB', icon:'⚕', signals:24},
  {id:'R', code:'ISIC-R', name:'Arts, Entertainment & Media',   fdi:'$41B',  growth:'+19%', hotspot:'🇸🇦 Saudi · 🇦🇪 UAE',          color:'#74BB65', icon:'🎬', signals:12},
  {id:'S', code:'ISIC-S', name:'Other Services',                fdi:'$33B',  growth:'+4%',  hotspot:'🇦🇪 UAE · 🇸🇬 Singapore',      color:'#9E9E9E', icon:'🔧', signals:7},
  {id:'T', code:'ISIC-T', name:'Renewable Energy',              fdi:'$385B', growth:'+28%', hotspot:'🇩🇪 Germany · 🇸🇦 Saudi',      color:'#74BB65', icon:'☀', signals:45},
  {id:'U', code:'ISIC-U', name:'Defence & Aerospace',           fdi:'$84B',  growth:'+7%',  hotspot:'🇺🇸 USA · 🇫🇷 France',         color:'#696969', icon:'🛡', signals:13},
];

const TOTAL_FDI = '$3.21T';



export default function SectorsPage() {
  const [sort,    setSort]    = useState<'name'|'fdi'|'growth'|'signals'>('signals');
  const [search,  setSearch]  = useState('');
  const [hovered, setHovered] = useState<string|null>(null);

  const sorted = [...SECTORS]
    .filter(s=>!search||s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>{
      if (sort==='name')    return a.name.localeCompare(b.name);
      if (sort==='signals') return b.signals - a.signals;
      if (sort==='growth')  return parseFloat(b.growth)-parseFloat(a.growth);
      if (sort==='fdi')     return parseFloat(b.fdi.replace(/[$B]/g,''))-parseFloat(a.fdi.replace(/[$B]/g,''));
      return 0;
    });

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'40px 24px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
              <Factory size={16} color="#74BB65"/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>Sector Intelligence</span>
            </div>
            <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'6px'}}>21 Global Investment Sectors</h1>
            <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>ISIC classification · FDI flows by sector · Signal coverage · Investment hotspots</p>
          </div>
          <div style={{display:'flex',gap:'20px'}}>
            {[['21','Sectors'],[TOTAL_FDI,'Total FDI'],['400+','Signals']].map(([v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:'18px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'24px'}}>
        {/* Controls */}
        <div style={{display:'flex',gap:'10px',marginBottom:'16px',flexWrap:'wrap',alignItems:'center'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Filter sectors…"
            style={{padding:'8px 14px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
              fontSize:'13px',background:'white',color:'#000',outline:'none',minWidth:'180px'}}/>
          <div style={{display:'flex',gap:'4px',marginLeft:'auto'}}>
            <span style={{fontSize:'12px',color:'#696969',marginRight:'4px',alignSelf:'center'}}>Sort by:</span>
            {[{k:'signals',l:'Signals'},{k:'fdi',l:'FDI Volume'},{k:'growth',l:'Growth'},{k:'name',l:'Name'}].map(({k,l})=>(
              <button key={k} onClick={()=>setSort(k as any)}
                style={{padding:'5px 12px',borderRadius:'16px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:700,
                  background:sort===k?'#0A3D62':'rgba(10,61,98,0.07)',color:sort===k?'white':'#0A3D62'}}>
                {l}
              </button>
            ))}
          </div>
        </div>
        {/* Sector grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'12px'}}>
          {sorted.map(s=>(
            <div key={s.id}
              onMouseEnter={()=>setHovered(s.id)} onMouseLeave={()=>setHovered(null)}
              style={{background:'white',borderRadius:'12px',padding:'18px',
                boxShadow:hovered===s.id?'0 6px 20px rgba(10,61,98,0.12)':'0 2px 8px rgba(10,61,98,0.06)',
                borderLeft:`4px solid ${s.color}`,transition:'all 0.15s',cursor:'pointer'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <span style={{fontSize:'24px'}}>{s.icon}</span>
                  <div>
                    <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',lineHeight:'1.3'}}>{s.name}</div>
                    <div style={{fontSize:'10px',color:'#696969',fontFamily:'monospace'}}>{s.code}</div>
                  </div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'3px',fontSize:'10px',
                  fontWeight:700,color:s.color,background:`${s.color}10`,
                  padding:'2px 7px',borderRadius:'8px'}}>
                  <Zap size={9}/>{s.signals}
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                <div style={{textAlign:'center',padding:'8px 0',flex:1}}>
                  <div style={{fontSize:'14px',fontWeight:800,color:'#0A3D62',fontFamily:'monospace'}}>{s.fdi}</div>
                  <div style={{fontSize:'9px',color:'#696969'}}>FDI 2025</div>
                </div>
                <div style={{width:'1px',background:'rgba(10,61,98,0.07)'}}/>
                <div style={{textAlign:'center',padding:'8px 0',flex:1}}>
                  <div style={{fontSize:'14px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{s.growth}</div>
                  <div style={{fontSize:'9px',color:'#696969'}}>YoY Growth</div>
                </div>
              </div>
              <div style={{fontSize:'10px',color:'#696969'}}>
                <span style={{fontWeight:600,color:'#0A3D62'}}>Hotspot: </span>{s.hotspot}
              </div>
              {hovered===s.id && (
                <div style={{marginTop:'10px',paddingTop:'10px',borderTop:'1px solid rgba(10,61,98,0.06)',
                  display:'flex',gap:'6px'}}>
                  <Link href="/investment-analysis" style={{display:'flex',alignItems:'center',gap:'3px',
                    padding:'5px 10px',background:'#0A3D62',color:'white',borderRadius:'6px',
                    textDecoration:'none',fontSize:'10px',fontWeight:700}}>
                    Analyse <ArrowRight size={9}/>
                  </Link>
                  <Link href="/signals" style={{display:'flex',alignItems:'center',gap:'3px',
                    padding:'5px 10px',background:'rgba(10,61,98,0.07)',color:'#0A3D62',borderRadius:'6px',
                    textDecoration:'none',fontSize:'10px',fontWeight:700}}>
                    Signals <Zap size={9}/>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
