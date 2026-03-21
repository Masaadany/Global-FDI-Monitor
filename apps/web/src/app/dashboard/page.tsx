'use client';
import { useState, useEffect, useCallback } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Globe3D from '@/components/Globe3D';
import ScrollableSelect from '@/components/ScrollableSelect';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Zap, Activity, Globe, Shield, Target, BarChart3, ChevronRight } from 'lucide-react';

/* ── DATA ──────────────────────────────────────────────────────────── */
const ALL_ECONOMIES = [
  {id:'SGP',flag:'🇸🇬',name:'Singapore',    gosa:88.4,trend:+0.2,fdi:'$91B', l1:92.1,l2:85.3,l3:87.2,l4:89.0,tier:'TOP',  region:'Asia Pacific', color:'#00ffc8'},
  {id:'DNK',flag:'🇩🇰',name:'Denmark',      gosa:85.3,trend:+0.3,fdi:'$22B', l1:87.2,l2:83.5,l3:84.9,l4:85.6,tier:'TOP',  region:'Europe',       color:'#00ffc8'},
  {id:'KOR',flag:'🇰🇷',name:'South Korea',  gosa:84.1,trend:+0.1,fdi:'$17B', l1:86.0,l2:82.8,l3:83.5,l4:84.2,tier:'TOP',  region:'Asia Pacific', color:'#00ffc8'},
  {id:'USA',flag:'🇺🇸',name:'United States',gosa:83.9,trend:-0.2,fdi:'$349B',l1:85.3,l2:82.1,l3:83.0,l4:85.1,tier:'TOP',  region:'Americas',     color:'#00ffc8'},
  {id:'GBR',flag:'🇬🇧',name:'United Kingdom',gosa:82.5,trend:-0.1,fdi:'$50B',l1:84.1,l2:81.4,l3:82.2,l4:82.3,tier:'TOP',  region:'Europe',       color:'#00d4ff'},
  {id:'ARE',flag:'🇦🇪',name:'UAE',          gosa:82.1,trend:+1.2,fdi:'$23B', l1:83.4,l2:81.2,l3:82.8,l4:81.0,tier:'TOP',  region:'Middle East',  color:'#00ffc8'},
  {id:'MYS',flag:'🇲🇾',name:'Malaysia',     gosa:81.2,trend:+0.4,fdi:'$22B', l1:82.5,l2:80.7,l3:81.8,l4:79.8,tier:'HIGH', region:'Asia Pacific', color:'#00d4ff'},
  {id:'THA',flag:'🇹🇭',name:'Thailand',     gosa:80.7,trend:+0.2,fdi:'$14B', l1:81.8,l2:80.2,l3:81.0,l4:79.8,tier:'HIGH', region:'Asia Pacific', color:'#00d4ff'},
  {id:'VNM',flag:'🇻🇳',name:'Vietnam',      gosa:79.4,trend:+0.5,fdi:'$24B', l1:80.5,l2:79.1,l3:78.9,l4:79.1,tier:'HIGH', region:'Asia Pacific', color:'#00d4ff'},
  {id:'SAU',flag:'🇸🇦',name:'Saudi Arabia', gosa:79.1,trend:+2.1,fdi:'$36B', l1:77.3,l2:80.4,l3:82.1,l4:76.6,tier:'HIGH', region:'Middle East',  color:'#e67e22'},
  {id:'IDN',flag:'🇮🇩',name:'Indonesia',    gosa:77.8,trend:+0.1,fdi:'$22B', l1:78.9,l2:77.3,l3:77.5,l4:77.5,tier:'HIGH', region:'Asia Pacific', color:'#00d4ff'},
  {id:'IND',flag:'🇮🇳',name:'India',        gosa:73.2,trend:+0.8,fdi:'$71B', l1:69.8,l2:74.6,l3:74.8,l4:73.6,tier:'HIGH', region:'Asia Pacific', color:'#e67e22'},
  {id:'BRA',flag:'🇧🇷',name:'Brazil',       gosa:71.3,trend:+0.4,fdi:'$74B', l1:68.4,l2:72.8,l3:71.2,l4:72.8,tier:'HIGH', region:'Americas',     color:'#00d4ff'},
  {id:'MAR',flag:'🇲🇦',name:'Morocco',      gosa:66.8,trend:+0.6,fdi:'$4B',  l1:63.8,l2:68.2,l3:68.4,l4:66.8,tier:'HIGH', region:'Africa',       color:'#ffd700'},
  {id:'NZL',flag:'🇳🇿',name:'New Zealand',  gosa:86.7,trend:-0.1,fdi:'$9B',  l1:89.5,l2:84.1,l3:85.8,l4:87.3,tier:'TOP',  region:'Oceania',      color:'#00ffc8'},
];

const DB_INDICATORS = [
  {ind:'Starting a Business',  globe:82.3,avg:72.4,color:'#00ffc8'},
  {ind:'Construction Permits', globe:74.8,avg:67.1,color:'#00d4ff'},
  {ind:'Getting Electricity',  globe:87.2,avg:78.6,color:'#ffd700'},
  {ind:'Registering Property', globe:71.4,avg:61.8,color:'#9b59b6'},
  {ind:'Getting Credit',       globe:75.0,avg:65.4,color:'#00ffc8'},
  {ind:'Protecting Investors', globe:81.8,avg:71.2,color:'#00d4ff'},
  {ind:'Paying Taxes',         globe:78.6,avg:64.8,color:'#ffd700'},
  {ind:'Trading Across Borders',globe:82.4,avg:74.2,color:'#9b59b6'},
  {ind:'Enforcing Contracts',  globe:72.1,avg:58.4,color:'#00ffc8'},
  {ind:'Resolving Insolvency', globe:82.4,avg:61.6,color:'#00d4ff'},
];

const SECTOR_MATRIX = [
  {s:'EV Battery',     x:82,y:91,size:16,color:'#00ffc8',momentum:'HOT'},
  {s:'Data Centers',   x:76,y:88,size:14,color:'#00d4ff',momentum:'HOT'},
  {s:'Semiconductors', x:84,y:78,size:13,color:'#ffd700',momentum:'RISING'},
  {s:'Renewables',     x:71,y:82,size:12,color:'#00ffc8',momentum:'RISING'},
  {s:'FinTech',        x:68,y:74,size:10,color:'#9b59b6',momentum:'STABLE'},
  {s:'Pharma/Health',  x:79,y:69,size:11,color:'#00d4ff',momentum:'STABLE'},
  {s:'Aerospace',      x:74,y:64,size:9, color:'#ffd700',momentum:'STABLE'},
  {s:'Logistics',      x:61,y:72,size:10,color:'#ff4466',momentum:'COOLING'},
];

const ZONES = [
  {name:'Jurong Island, SG',    country:'SGP',type:'Industrial',avail:34,color:'#00ffc8'},
  {name:'Jebel Ali FZ, UAE',    country:'ARE',type:'Multi-use', avail:22,color:'#00d4ff'},
  {name:'Penang FIZ, Malaysia', country:'MYS',type:'Tech',      avail:41,color:'#ffd700'},
  {name:'Eastern EEC, Thailand',country:'THA',type:'EV/Auto',   avail:58,color:'#9b59b6'},
  {name:'VSIP, Vietnam',        country:'VNM',type:'Manufacturing',avail:47,color:'#00ffc8'},
  {name:'NEOM, Saudi Arabia',   country:'SAU',type:'Mixed-use', avail:78,color:'#e67e22'},
];

const POLICIES = [
  {country:'Malaysia',   flag:'🇲🇾',policy:'100% FDI in data centers',    status:'NEW',   date:'Mar 2026',c:'#00ffc8'},
  {country:'UAE',        flag:'🇦🇪',policy:'100% mainland ownership',      status:'ACTIVE',date:'Feb 2026',c:'#00d4ff'},
  {country:'Thailand',   flag:'🇹🇭',policy:'$2B EV battery incentive',     status:'NEW',   date:'Mar 2026',c:'#ffd700'},
  {country:'Vietnam',    flag:'🇻🇳',policy:'50% CIT reduction EV mfg',     status:'ACTIVE',date:'Jan 2026',c:'#9b59b6'},
  {country:'Saudi Arabia',flag:'🇸🇦',policy:'30-day license guarantee',    status:'NEW',   date:'Mar 2026',c:'#e67e22'},
];

const INITIAL_SIGNALS = [
  {id:1,type:'POLICY',  grade:'PLATINUM',country:'Malaysia',   flag:'🇲🇾',title:'FDI cap in data centers raised to 100%',           sco:96,impact:'HIGH',ts:'2m'},
  {id:2,type:'INCENTIVE',grade:'PLATINUM',country:'Thailand',  flag:'🇹🇭',title:'$2B EV battery subsidy package approved',            sco:95,impact:'HIGH',ts:'1h'},
  {id:3,type:'DEAL',    grade:'PLATINUM',country:'UAE',         flag:'🇦🇪',title:'Microsoft $3.3B AI data center announced',           sco:97,impact:'HIGH',ts:'2d'},
  {id:4,type:'GROWTH',  grade:'GOLD',    country:'Vietnam',     flag:'🇻🇳',title:'Electronics exports surge 34% YoY',                  sco:92,impact:'MED', ts:'3h'},
  {id:5,type:'ZONE',    grade:'GOLD',    country:'Indonesia',   flag:'🇮🇩',title:'New Batam zone — 200ha ready',                       sco:91,impact:'MED', ts:'5h'},
  {id:6,type:'POLICY',  grade:'PLATINUM',country:'Saudi Arabia',flag:'🇸🇦',title:'30-day FDI license guarantee live',                  sco:94,impact:'HIGH',ts:'2d'},
  {id:7,type:'DEAL',    grade:'GOLD',    country:'India',       flag:'🇮🇳',title:'Apple commits $10B manufacturing expansion',         sco:89,impact:'HIGH',ts:'4d'},
];

function scoreColor(s: number){ return s>=80?'#00ffc8':s>=60?'#00d4ff':s>=40?'#ffd700':'#ff4466'; }
function gradeColor(g: string){ return g==='PLATINUM'?'#c39bd3':g==='GOLD'?'#ffd700':'#94a8b3'; }
function gradeBg(g: string){ return g==='PLATINUM'?'rgba(155,89,182,0.12)':g==='GOLD'?'rgba(255,215,0,0.10)':'rgba(148,168,179,0.08)'; }
function typeColor(t: string){ const m:any={POLICY:'#ff4466',INCENTIVE:'#00ffc8',DEAL:'#e67e22',GROWTH:'#00d4ff',ZONE:'#9b59b6'}; return m[t]||'#94a8b3'; }

function RadarMini({data}:{data:number[]}) {
  const n=data.length; const cx=90,cy=90,r=72;
  function pt(i:number,v:number){const a=(Math.PI*2*i/n)-Math.PI/2;const d=(v/100)*r;return{x:cx+d*Math.cos(a),y:cy+d*Math.sin(a)};}
  const pts=data.map((v,i)=>pt(i,v));
  return(
    <svg width="180" height="180" viewBox="0 0 180 180">
      {[20,40,60,80,100].map(l=>{const ps=data.map((_,i)=>pt(i,l));return <polygon key={l} points={ps.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke="rgba(0,255,200,0.07)" strokeWidth="0.5"/>;})}
      {data.map((_,i)=>{const p=pt(i,100);return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(0,255,200,0.06)" strokeWidth="0.5"/>;})}
      <polygon points={pts.map(p=>`${p.x},${p.y}`).join(' ')} fill="rgba(0,255,200,0.12)" stroke="#00ffc8" strokeWidth="1.5"/>
      {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="3" fill="#00ffc8" style={{filter:'drop-shadow(0 0 4px #00ffc8)'}}/>)}
    </svg>
  );
}

function SectorScatter() {
  const [hov,setHov]=useState<string|null>(null);
  const W=320,H=200;
  return(
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{width:'100%'}}>
      {[0,25,50,75,100].map(v=>(<line key={'v'+v} x1={v/100*(W-40)+20} y1={8} x2={v/100*(W-40)+20} y2={H-24} stroke="rgba(0,255,200,0.05)" strokeWidth="0.5" strokeDasharray="3,6"/>))}
      {[0,25,50,75,100].map(v=>(<line key={'h'+v} x1={20} y1={(1-v/100)*(H-32)+8} x2={W-20} y2={(1-v/100)*(H-32)+8} stroke="rgba(0,255,200,0.05)" strokeWidth="0.5" strokeDasharray="3,6"/>))}
      <text x={W/2} y={H-6} textAnchor="middle" fill="rgba(232,244,248,0.25)" fontSize="7" fontFamily="'JetBrains Mono',monospace">INCENTIVE STRENGTH →</text>
      <text x={8} y={H/2} textAnchor="middle" fill="rgba(232,244,248,0.25)" fontSize="7" fontFamily="'JetBrains Mono',monospace" transform={`rotate(-90,8,${H/2})`}>ATTRACTIVENESS →</text>
      {SECTOR_MATRIX.map(s=>{
        const px=20+(s.x/100)*(W-40); const py=8+((100-s.y)/100)*(H-32); const isH=hov===s.s;
        return(
          <g key={s.s} onMouseEnter={()=>setHov(s.s)} onMouseLeave={()=>setHov(null)} style={{cursor:'pointer'}}>
            <circle cx={px} cy={py} r={s.size+2} fill={s.color+'08'} stroke={s.color+'20'} strokeWidth="1" style={{filter:isH?`drop-shadow(0 0 8px ${s.color})`:'none'}}/>
            <circle cx={px} cy={py} r={s.size/2} fill={s.color} opacity="0.85" style={{filter:isH?`drop-shadow(0 0 12px ${s.color})`:'none'}}/>
            {isH&&<text x={px} y={py-s.size-4} textAnchor="middle" fill={s.color} fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">{s.s}</text>}
          </g>
        );
      })}
    </svg>
  );
}

export default function Dashboard() {
  const [signals, setSignals] = useState(INITIAL_SIGNALS);
  const [selCountry, setSelCountry] = useState(ALL_ECONOMIES[0]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  // Dashboard-level filters
  const [filterCountry, setFilterCountry] = useState('ALL');
  const [filterRegion, setFilterRegion] = useState('ALL');
  const [filterTier, setFilterTier] = useState('ALL');

  // Derived list for the globe quick-select and economy panel
  const filteredEconomies = ALL_ECONOMIES.filter(e => {
    if (filterCountry !== 'ALL' && e.id !== filterCountry) return false;
    if (filterRegion !== 'ALL' && e.region !== filterRegion) return false;
    if (filterTier !== 'ALL' && e.tier !== filterTier) return false;
    return true;
  });

  // When country filter changes to a specific country, auto-select it
  useEffect(() => {
    if (filterCountry !== 'ALL') {
      const found = ALL_ECONOMIES.find(e => e.id === filterCountry);
      if (found) setSelCountry(found);
    }
  }, [filterCountry]);

  // Live signal updates
  useEffect(() => {
    const iv = setInterval(() => {
      setTime(new Date());
      if (Math.random() > 0.65) {
        const ctrs = ALL_ECONOMIES.slice(0, 5);
        const types = ['POLICY','INCENTIVE','DEAL','GROWTH','ZONE'];
        const grades = ['PLATINUM','GOLD','SILVER'];
        const co = ctrs[Math.floor(Math.random()*ctrs.length)];
        setSignals(p => [{
          id:Date.now(),type:types[Math.floor(Math.random()*types.length)],
          grade:grades[Math.floor(Math.random()*grades.length)],
          country:co.name,flag:co.flag,
          title:'New investment signal detected — SCI scoring in progress',
          sco:70+Math.floor(Math.random()*26),impact:'MED',ts:'now'
        },...p.slice(0,8)]);
        setLastUpdate(new Date());
      }
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  // Build select options
  const countryOptions = [
    { value: 'ALL', label: 'All Countries' },
    ...ALL_ECONOMIES.map(e => ({ value: e.id, label: e.name, flag: e.flag, sub: `GOSA ${e.gosa} · ${e.region}` }))
  ];
  const regionOptions = [
    { value: 'ALL', label: 'All Regions' },
    ...Array.from(new Set(ALL_ECONOMIES.map(e => e.region))).map(r => ({ value: r, label: r }))
  ];
  const tierOptions = [
    { value: 'ALL', label: 'All Tiers' },
    { value: 'TOP',  label: 'TOP Tier (≥80)',  sub: 'Best-in-class destinations' },
    { value: 'HIGH', label: 'HIGH Tier (60-79)', sub: 'Strong investment cases' },
  ];

  // Panel wrapper
  const Panel = ({ children, style={} }: { children: any; style?: any }) => (
    <div style={{background:'rgba(10,22,40,0.7)',border:'1px solid rgba(0,180,216,0.12)',borderRadius:'12px',backdropFilter:'blur(10px)',boxShadow:'0 8px 32px rgba(0,0,0,0.4)',overflow:'hidden',...style}}>
      {children}
    </div>
  );

  const PanelHeader = ({ icon, title, badge, extra }: { icon: any; title: string; badge?: string; extra?: any }) => (
    <div style={{padding:'11px 16px',borderBottom:'1px solid rgba(0,255,200,0.06)',display:'flex',alignItems:'center',gap:'10px',background:'rgba(0,0,0,0.2)',flexShrink:0}}>
      <span style={{color:'#00ffc8',display:'flex',alignItems:'center'}}>{icon}</span>
      <span style={{fontSize:'10px',fontWeight:800,color:'rgba(232,244,248,0.75)',letterSpacing:'0.1em',textTransform:'uppercase',fontFamily:"'Orbitron','Inter',sans-serif",flex:1}}>{title}</span>
      {badge && <span style={{fontSize:'8px',fontWeight:800,padding:'2px 7px',borderRadius:'4px',background:'rgba(0,255,200,0.07)',color:'#00ffc8',border:'1px solid rgba(0,255,200,0.18)',letterSpacing:'0.08em',fontFamily:"'JetBrains Mono',monospace"}}>{badge}</span>}
      {extra}
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#020c14',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>

      {/* ── DASHBOARD HEADER ───────────────────────────────────────── */}
      <div style={{background:'linear-gradient(180deg,rgba(4,14,28,0.97),rgba(2,12,20,0.93))',borderBottom:'1px solid rgba(0,255,200,0.08)',padding:'12px 24px',position:'sticky',top:'58px',zIndex:200,backdropFilter:'blur(20px)'}}>
        <div style={{maxWidth:'1900px',margin:'0 auto'}}>
          {/* Row 1: title + clock */}
          <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'10px',flexWrap:'wrap'}}>
            <div style={{flex:1}}>
              <div style={{fontSize:'9px',fontWeight:800,color:'rgba(0,255,200,0.45)',letterSpacing:'0.16em',fontFamily:"'Orbitron','Inter',sans-serif"}}>INTELLIGENCE DASHBOARD</div>
              <div style={{fontSize:'17px',fontWeight:900,color:'#e8f4f8',lineHeight:1.1}}>Global FDI Monitor — Live Operations</div>
            </div>
            <div style={{padding:'6px 14px',background:'rgba(0,255,200,0.05)',border:'1px solid rgba(0,255,200,0.12)',borderRadius:'8px',textAlign:'center',flexShrink:0}}>
              <div style={{fontSize:'15px',fontWeight:800,color:'#00ffc8',fontFamily:"'JetBrains Mono',monospace",lineHeight:1}}>{time.toLocaleTimeString()}</div>
              <div style={{fontSize:'8px',color:'rgba(0,255,200,0.35)',letterSpacing:'0.1em',marginTop:'1px'}}>{time.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase()}</div>
            </div>
            {[['AGT-02','SIGNAL'],['AGT-04','GOSA'],['AGT-05','GFR'],['API','LIVE']].map(([a,l])=>(
              <div key={a} style={{display:'flex',alignItems:'center',gap:'5px',padding:'4px 10px',background:'rgba(0,255,200,0.04)',border:'1px solid rgba(0,255,200,0.1)',borderRadius:'16px',flexShrink:0}}>
                <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'#00ffc8',boxShadow:'0 0 6px #00ffc8'}}/>
                <span style={{fontSize:'9px',fontWeight:700,color:'rgba(0,255,200,0.65)',fontFamily:"'JetBrains Mono',monospace"}}>{a} {l}</span>
              </div>
            ))}
          </div>

          {/* Row 2: FILTERS */}
          <div style={{display:'flex',alignItems:'flex-end',gap:'10px',flexWrap:'wrap'}}>
            <div style={{fontSize:'9px',fontWeight:700,color:'rgba(232,244,248,0.3)',textTransform:'uppercase',letterSpacing:'0.1em',paddingBottom:'1px',flexShrink:0}}>Dashboard Filters</div>

            <ScrollableSelect
              label="Country"
              value={filterCountry}
              options={countryOptions}
              onChange={setFilterCountry}
              width="200px"
              accentColor="#00ffc8"
            />

            <ScrollableSelect
              label="Region"
              value={filterRegion}
              options={regionOptions}
              onChange={setFilterRegion}
              width="160px"
              accentColor="#00d4ff"
            />

            <ScrollableSelect
              label="Tier"
              value={filterTier}
              options={tierOptions}
              onChange={setFilterTier}
              width="160px"
              accentColor="#ffd700"
            />

            {/* Active filter pills */}
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap',alignItems:'flex-end',paddingBottom:'1px'}}>
              {filterCountry !== 'ALL' && (
                <button onClick={() => setFilterCountry('ALL')}
                  style={{display:'flex',alignItems:'center',gap:'5px',padding:'4px 10px',background:'rgba(0,255,200,0.08)',border:'1px solid rgba(0,255,200,0.25)',borderRadius:'14px',cursor:'pointer',fontSize:'10px',fontWeight:700,color:'#00ffc8',fontFamily:"'Inter',sans-serif"}}>
                  {ALL_ECONOMIES.find(e=>e.id===filterCountry)?.flag} {ALL_ECONOMIES.find(e=>e.id===filterCountry)?.name} <span style={{opacity:0.6}}>×</span>
                </button>
              )}
              {filterRegion !== 'ALL' && (
                <button onClick={() => setFilterRegion('ALL')}
                  style={{display:'flex',alignItems:'center',gap:'5px',padding:'4px 10px',background:'rgba(0,180,216,0.08)',border:'1px solid rgba(0,180,216,0.25)',borderRadius:'14px',cursor:'pointer',fontSize:'10px',fontWeight:700,color:'#00b4d8',fontFamily:"'Inter',sans-serif"}}>
                  {filterRegion} <span style={{opacity:0.6}}>×</span>
                </button>
              )}
              {filterTier !== 'ALL' && (
                <button onClick={() => setFilterTier('ALL')}
                  style={{display:'flex',alignItems:'center',gap:'5px',padding:'4px 10px',background:'rgba(255,215,0,0.08)',border:'1px solid rgba(255,215,0,0.25)',borderRadius:'14px',cursor:'pointer',fontSize:'10px',fontWeight:700,color:'#ffd700',fontFamily:"'Inter',sans-serif"}}>
                  {filterTier} <span style={{opacity:0.6}}>×</span>
                </button>
              )}
            </div>

            {/* Result count */}
            <div style={{marginLeft:'auto',fontSize:'10px',color:'rgba(232,244,248,0.3)',fontFamily:"'JetBrains Mono',monospace",paddingBottom:'1px',flexShrink:0}}>
              Showing <span style={{color:'#00ffc8',fontWeight:700}}>{filteredEconomies.length}</span> / {ALL_ECONOMIES.length} economies · Updated {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ─────────────────────────────────────────────── */}
      <div style={{maxWidth:'1900px',margin:'0 auto',padding:'16px 24px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr 360px',gridTemplateRows:'auto auto auto',gap:'12px'}}>

        {/* W1: GLOBAL OPPORTUNITY MAP */}
        <Panel style={{gridColumn:'1/3',gridRow:'1/2'}}>
          <PanelHeader icon={<Globe size={13}/>} title="Global Opportunity Map" badge="INTERACTIVE"/>
          <div style={{padding:'12px 16px',display:'flex',gap:'16px',alignItems:'flex-start',minHeight:'440px'}}>
            <div style={{flex:'0 0 auto'}}>
              <Globe3D width={400} height={400} onCountryClick={(c: any) => {
                const found = ALL_ECONOMIES.find(e => e.name === c.country || e.id === c.id);
                if (found) setSelCountry(found);
              }}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              {/* Selected country */}
              <div style={{padding:'14px',background:'rgba(0,0,0,0.3)',borderRadius:'10px',border:'1px solid rgba(0,255,200,0.1)',marginBottom:'12px'}}>
                <div style={{fontSize:'8px',color:'rgba(0,255,200,0.4)',letterSpacing:'0.15em',marginBottom:'8px',fontFamily:"'Orbitron','Inter',sans-serif"}}>SELECTED ECONOMY</div>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
                  <span style={{fontSize:'32px'}}>{selCountry.flag}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'16px',fontWeight:900,color:'#e8f4f8'}}>{selCountry.name}</div>
                    <div style={{fontSize:'10px',color:'rgba(0,255,200,0.45)'}}>{selCountry.region} · {selCountry.tier}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'34px',fontWeight:900,color:'#00ffc8',fontFamily:"'JetBrains Mono',monospace",textShadow:'0 0 18px rgba(0,255,200,0.5)',lineHeight:1}}>{selCountry.gosa}</div>
                    <div style={{fontSize:'9px',color:selCountry.trend>0?'#00ffc8':'#ff4466',fontWeight:700,display:'flex',alignItems:'center',gap:'2px',justifyContent:'flex-end'}}>
                      {selCountry.trend>0?<TrendingUp size={9}/>:<TrendingDown size={9}/>}
                      {selCountry.trend>0?'+':''}{selCountry.trend}
                    </div>
                  </div>
                </div>
                <div style={{display:'flex',justifyContent:'center',marginBottom:'10px'}}>
                  <RadarMini data={[selCountry.l1,selCountry.l2,selCountry.l3,selCountry.l4,selCountry.l1*0.9,selCountry.l2*0.95]}/>
                </div>
                {/* Layer bars */}
                {[['L1',selCountry.l1,'#00ffc8'],['L2',selCountry.l2,'#00d4ff'],['L3',selCountry.l3,'#ffd700'],['L4',selCountry.l4,'#9b59b6']].map(([l,v,c])=>(
                  <div key={String(l)} style={{marginBottom:'6px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'2px'}}>
                      <span style={{fontSize:'9px',color:'rgba(232,244,248,0.45)'}}>{l}</span>
                      <span style={{fontSize:'11px',fontWeight:800,color:String(c),fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>
                    </div>
                    <div style={{height:'3px',background:'rgba(255,255,255,0.05)',borderRadius:'2px',overflow:'hidden'}}>
                      <div style={{height:'100%',width:(v as number)+'%',background:String(c),borderRadius:'2px',boxShadow:'0 0 6px '+c+'60'}}/>
                    </div>
                  </div>
                ))}
                <div style={{display:'flex',gap:'7px',marginTop:'11px'}}>
                  <Link href={'/country/'+selCountry.id} style={{flex:1,padding:'7px',background:'rgba(0,255,200,0.07)',border:'1px solid rgba(0,255,200,0.18)',borderRadius:'7px',textDecoration:'none',fontSize:'10px',fontWeight:700,color:'#00ffc8',textAlign:'center'}}>Profile</Link>
                  <Link href="/reports" style={{flex:1,padding:'7px',background:'rgba(255,215,0,0.06)',border:'1px solid rgba(255,215,0,0.18)',borderRadius:'7px',textDecoration:'none',fontSize:'10px',fontWeight:700,color:'#ffd700',textAlign:'center'}}>Report</Link>
                </div>
              </div>

              {/* Filtered economy quick-select */}
              <div style={{fontSize:'8px',color:'rgba(232,244,248,0.25)',marginBottom:'6px',letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace"}}>
                {filteredEconomies.length} economies {filterCountry!=='ALL'||filterRegion!=='ALL'||filterTier!=='ALL' ? '(filtered)' : 'tracked'}
              </div>
              <div style={{display:'flex',gap:'5px',flexWrap:'wrap',maxHeight:'80px',overflowY:'auto'}}>
                {filteredEconomies.map(e=>(
                  <button key={e.id} onClick={()=>setSelCountry(e)}
                    style={{padding:'3px 9px',background:selCountry.id===e.id?'rgba(0,255,200,0.1)':'rgba(255,255,255,0.03)',border:'1px solid '+(selCountry.id===e.id?'rgba(0,255,200,0.3)':'rgba(255,255,255,0.06)'),borderRadius:'16px',cursor:'pointer',fontSize:'10px',color:selCountry.id===e.id?'#00ffc8':'rgba(232,244,248,0.45)',fontFamily:"'Inter',sans-serif",display:'flex',alignItems:'center',gap:'4px',flexShrink:0,transition:'all 150ms'}}>
                    {e.flag} {e.name}
                  </button>
                ))}
                {filteredEconomies.length === 0 && (
                  <div style={{fontSize:'11px',color:'rgba(232,244,248,0.3)',padding:'8px'}}>No economies match the selected filters</div>
                )}
              </div>
            </div>
          </div>
        </Panel>

        {/* W2: GLOBAL INVESTMENT ANALYSIS */}
        <Panel style={{gridColumn:'3/4',gridRow:'1/2'}}>
          <PanelHeader icon={<BarChart3 size={13}/>} title="Investment Analysis" badge={filteredEconomies.length+' SHOWN'}/>
          <div style={{padding:'12px 16px',overflowY:'auto',maxHeight:'460px'}}>
            {filteredEconomies.slice(0,10).map((c,i)=>(
              <div key={c.id} onClick={()=>setSelCountry(c)}
                style={{padding:'9px 11px',borderRadius:'8px',marginBottom:'7px',cursor:'pointer',background:selCountry.id===c.id?'rgba(0,255,200,0.05)':'rgba(255,255,255,0.02)',border:'1px solid '+(selCountry.id===c.id?'rgba(0,255,200,0.18)':'rgba(255,255,255,0.04)'),transition:'all 180ms ease'}}>
                <div style={{display:'flex',alignItems:'center',gap:'9px',marginBottom:'5px'}}>
                  <span style={{fontSize:'8px',fontWeight:800,color:scoreColor(c.gosa),fontFamily:"'JetBrains Mono',monospace",minWidth:'16px'}}>#{i+1}</span>
                  <span style={{fontSize:'17px'}}>{c.flag}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'11px',fontWeight:700,color:'rgba(232,244,248,0.85)'}}>{c.name}</div>
                    <div style={{fontSize:'9px',color:'rgba(232,244,248,0.3)'}}>FDI {c.fdi}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'17px',fontWeight:900,color:scoreColor(c.gosa),fontFamily:"'JetBrains Mono',monospace"}}>{c.gosa}</div>
                    <div style={{fontSize:'8px',color:c.trend>0?'#00ffc8':'#ff4466',fontWeight:700}}>{c.trend>0?'▲':'▼'}{Math.abs(c.trend)}</div>
                  </div>
                </div>
                <div style={{height:'3px',background:'rgba(255,255,255,0.04)',borderRadius:'2px',overflow:'hidden'}}>
                  <div style={{height:'100%',width:c.gosa+'%',background:'linear-gradient(90deg,'+scoreColor(c.gosa)+'60,'+scoreColor(c.gosa)+')',borderRadius:'2px'}}/>
                </div>
              </div>
            ))}
            {filteredEconomies.length > 10 && (
              <div style={{textAlign:'center',padding:'8px',fontSize:'10px',color:'rgba(232,244,248,0.3)'}}>
                +{filteredEconomies.length-10} more · <Link href="/investment-analysis" style={{color:'#00ffc8',textDecoration:'none'}}>View all →</Link>
              </div>
            )}
            {filteredEconomies.length === 0 && (
              <div style={{textAlign:'center',padding:'32px 12px',color:'rgba(232,244,248,0.3)',fontSize:'12px'}}>
                No economies match your filters.<br/>
                <button onClick={()=>{setFilterCountry('ALL');setFilterRegion('ALL');setFilterTier('ALL');}} style={{marginTop:'10px',padding:'6px 14px',background:'rgba(0,255,200,0.07)',border:'1px solid rgba(0,255,200,0.18)',borderRadius:'7px',cursor:'pointer',fontSize:'11px',color:'#00ffc8',fontFamily:"'Inter',sans-serif"}}>Clear filters</button>
              </div>
            )}
            <Link href="/investment-analysis" style={{display:'block',textAlign:'center',padding:'7px',marginTop:'6px',background:'rgba(0,255,200,0.04)',border:'1px solid rgba(0,255,200,0.1)',borderRadius:'7px',textDecoration:'none',fontSize:'10px',fontWeight:700,color:'rgba(0,255,200,0.65)'}}>
              Full Analysis Platform →
            </Link>
          </div>
        </Panel>

        {/* W7: SIGNALS FEED */}
        <Panel style={{gridColumn:'4/5',gridRow:'1/3'}}>
          <PanelHeader icon={<Zap size={13}/>} title="Investment Signals" badge="LIVE"/>
          <div style={{height:'640px',overflowY:'auto',padding:'8px'}}>
            {signals.map((s,i)=>{
              const gc=gradeColor(s.grade); const gbg=gradeBg(s.grade); const tc=typeColor(s.type);
              return(
                <div key={s.id} style={{padding:'10px 11px',borderRadius:'8px',marginBottom:'5px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.03)',borderLeft:'2px solid '+tc,animation:i===0?'slideIn 0.35s ease':'none'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}>
                    <div style={{display:'flex',gap:'4px'}}>
                      <span style={{fontSize:'8px',fontWeight:800,padding:'1px 6px',borderRadius:'3px',background:gbg,color:gc,letterSpacing:'0.04em'}}>{s.grade}</span>
                      <span style={{fontSize:'9px',padding:'1px 6px',background:tc+'14',color:tc,borderRadius:'3px',fontWeight:700}}>{s.type}</span>
                    </div>
                    <span style={{fontSize:'12px',fontWeight:900,color:'#9b59b6',fontFamily:"'JetBrains Mono',monospace"}}>{s.sco}</span>
                  </div>
                  <div style={{fontSize:'11px',color:'rgba(232,244,248,0.72)',lineHeight:1.4,marginBottom:'5px'}}>{s.title}</div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:'10px',color:'rgba(232,244,248,0.3)'}}>{s.flag} {s.country}</span>
                    <span style={{fontSize:'9px',color:'rgba(0,255,200,0.3)',fontFamily:"'JetBrains Mono',monospace"}}>{s.ts} ago</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{padding:'8px',borderTop:'1px solid rgba(0,255,200,0.06)'}}>
            <Link href="/signals" style={{display:'block',textAlign:'center',padding:'7px',background:'rgba(0,255,200,0.05)',border:'1px solid rgba(0,255,200,0.13)',borderRadius:'7px',textDecoration:'none',fontSize:'10px',fontWeight:700,color:'#00ffc8'}}>
              Full Signals Feed →
            </Link>
          </div>
        </Panel>

        {/* W3: DOING BUSINESS */}
        <Panel style={{gridColumn:'1/2',gridRow:'2/3'}}>
          <PanelHeader icon={<Shield size={13}/>} title="Doing Business Indicators" badge="L1 LAYER"/>
          <div style={{padding:'13px 15px'}}>
            {DB_INDICATORS.map(({ind,globe,avg,color})=>(
              <div key={ind} style={{marginBottom:'8px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2px'}}>
                  <span style={{fontSize:'10px',color:'rgba(232,244,248,0.5)',fontWeight:400}}>{ind}</span>
                  <div style={{display:'flex',gap:'5px',alignItems:'center'}}>
                    <span style={{fontSize:'10px',color:'rgba(232,244,248,0.25)',fontFamily:"'JetBrains Mono',monospace"}}>{avg}</span>
                    <span style={{fontSize:'11px',fontWeight:800,color,fontFamily:"'JetBrains Mono',monospace"}}>{globe}</span>
                  </div>
                </div>
                <div style={{position:'relative',height:'4px',background:'rgba(255,255,255,0.04)',borderRadius:'2px',overflow:'hidden'}}>
                  <div style={{position:'absolute',left:0,top:0,height:'100%',width:avg+'%',background:'rgba(255,255,255,0.05)',borderRadius:'2px'}}/>
                  <div style={{position:'absolute',left:0,top:0,height:'100%',width:globe+'%',background:color,borderRadius:'2px',boxShadow:'0 0 5px '+color+'60'}}/>
                </div>
              </div>
            ))}
            <div style={{display:'flex',gap:'10px',marginTop:'8px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'9px',color:'rgba(232,244,248,0.25)'}}><div style={{width:'12px',height:'3px',background:'rgba(255,255,255,0.14)',borderRadius:'2px'}}/>Global Avg</div>
              <div style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'9px',color:'rgba(232,244,248,0.25)'}}><div style={{width:'12px',height:'3px',background:'linear-gradient(90deg,rgba(0,255,200,0.5),#00ffc8)',borderRadius:'2px'}}/>Selected</div>
            </div>
          </div>
        </Panel>

        {/* W4: SECTOR MATRIX */}
        <Panel style={{gridColumn:'2/3',gridRow:'2/3'}}>
          <PanelHeader icon={<Target size={13}/>} title="Sector Attractiveness Matrix" badge="L2 LAYER"/>
          <div style={{padding:'12px 15px'}}>
            <SectorScatter/>
            <div style={{display:'flex',gap:'7px',flexWrap:'wrap',marginTop:'8px'}}>
              {[['HOT','#00ffc8'],['RISING','#ffd700'],['STABLE','#00d4ff'],['COOLING','#ff4466']].map(([l,c])=>(
                <div key={l} style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'9px',color:c+'70',padding:'2px 7px',background:c+'08',borderRadius:'8px',border:'1px solid '+c+'18'}}>
                  <div style={{width:'5px',height:'5px',borderRadius:'50%',background:c}}/>{l}
                </div>
              ))}
            </div>
            <Link href="/investment-analysis" style={{display:'block',textAlign:'center',padding:'6px',marginTop:'8px',background:'rgba(0,212,255,0.04)',border:'1px solid rgba(0,212,255,0.1)',borderRadius:'7px',textDecoration:'none',fontSize:'10px',fontWeight:700,color:'rgba(0,212,255,0.65)'}}>
              Full Investment Analysis →
            </Link>
          </div>
        </Panel>

        {/* W5: INVESTMENT ZONES */}
        <Panel style={{gridColumn:'3/4',gridRow:'2/3'}}>
          <PanelHeader icon={<Globe size={13}/>} title="Special Investment Zones" badge="L3 LAYER"/>
          <div style={{padding:'11px 15px'}}>
            {ZONES.map(z=>{
              const pct=(100-z.avail);
              return(
                <div key={z.name} style={{marginBottom:'9px',padding:'9px 11px',background:'rgba(255,255,255,0.02)',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.04)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}>
                    <div>
                      <div style={{fontSize:'11px',fontWeight:700,color:'rgba(232,244,248,0.8)'}}>{z.name}</div>
                      <div style={{fontSize:'9px',color:'rgba(232,244,248,0.3)'}}>{z.type}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:'14px',fontWeight:900,color:z.color,fontFamily:"'JetBrains Mono',monospace"}}>{z.avail}<span style={{fontSize:'8px',color:'rgba(232,244,248,0.25)',fontWeight:400}}>% free</span></div>
                    </div>
                  </div>
                  <div style={{height:'4px',background:'rgba(255,255,255,0.05)',borderRadius:'2px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:pct+'%',background:'linear-gradient(90deg,'+z.color+'50,'+z.color+')',borderRadius:'2px'}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* W6: POLICIES + W BOTTOM: QUICK LINKS */}
        <Panel style={{gridColumn:'1/3',gridRow:'3/4'}}>
          <PanelHeader icon={<Activity size={13}/>} title="Policy & Incentives Monitor" badge="LIVE"/>
          <div style={{padding:'11px 15px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'9px'}}>
            {POLICIES.map(p=>(
              <div key={p.policy} style={{padding:'11px 13px',background:'rgba(255,255,255,0.02)',borderRadius:'9px',border:'1px solid '+p.c+'15',borderLeft:'3px solid '+p.c}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'5px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    <span style={{fontSize:'15px'}}>{p.flag}</span>
                    <span style={{fontSize:'11px',fontWeight:700,color:'rgba(232,244,248,0.75)'}}>{p.country}</span>
                  </div>
                  <span style={{fontSize:'8px',fontWeight:800,padding:'2px 6px',borderRadius:'4px',background:p.status==='NEW'?'rgba(0,255,200,0.09)':'rgba(0,180,216,0.09)',color:p.status==='NEW'?'#00ffc8':'#00b4d8',letterSpacing:'0.05em'}}>{p.status}</span>
                </div>
                <div style={{fontSize:'11px',color:'rgba(232,244,248,0.6)',lineHeight:1.45,marginBottom:'3px'}}>{p.policy}</div>
                <div style={{fontSize:'9px',color:'rgba(232,244,248,0.25)',fontFamily:"'JetBrains Mono',monospace"}}>{p.date}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel style={{gridColumn:'3/5',gridRow:'3/4'}}>
          <PanelHeader icon={<ChevronRight size={13}/>} title="Platform Navigation"/>
          <div style={{padding:'12px 15px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'7px'}}>
            {[
              {href:'/gfr',icon:'🏆',l:'GFR Ranking',d:'25 economies · 6 dims',c:'#ffd700'},
              {href:'/reports',icon:'📄',l:'PDF Reports',d:'AI intelligence',c:'#e67e22'},
              {href:'/pmp',icon:'🎯',l:'Mission Planning',d:'4 guided workflows',c:'#ff4466'},
              {href:'/sources',icon:'📡',l:'Data Sources',d:'304+ official',c:'#00d4ff'},
            ].map(({href,icon,l,d,c})=>(
              <Link key={href} href={href} style={{padding:'11px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.04)',borderRadius:'9px',textDecoration:'none',display:'flex',gap:'9px',alignItems:'center',transition:'all 180ms ease'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=c+'22';e.currentTarget.style.background=c+'05';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.04)';e.currentTarget.style.background='rgba(255,255,255,0.02)';}}>
                <span style={{fontSize:'20px'}}>{icon}</span>
                <div>
                  <div style={{fontSize:'11px',fontWeight:700,color:'rgba(232,244,248,0.75)'}}>{l}</div>
                  <div style={{fontSize:'9px',color:c+'60'}}>{d}</div>
                </div>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <Footer/>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
