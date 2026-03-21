'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Globe3D from '@/components/Globe3D';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Zap, Activity, Globe, Shield, Target, BarChart3, ChevronRight, RefreshCw } from 'lucide-react';

/* ── DATA ──────────────────────────────────────────────────────────── */
const TOP_ECONOMIES = [
  {id:'SGP',flag:'🇸🇬',name:'Singapore',    gosa:88.4,trend:+0.2,fdi:'$91B',l1:92.1,l2:85.3,l3:87.2,l4:89.0,tier:'TOP',color:'#00ffc8'},
  {id:'ARE',flag:'🇦🇪',name:'UAE',          gosa:82.1,trend:+1.2,fdi:'$23B',l1:83.4,l2:81.2,l3:82.8,l4:81.0,tier:'TOP',color:'#00ffc8'},
  {id:'USA',flag:'🇺🇸',name:'United States',gosa:83.9,trend:-0.2,fdi:'$349B',l1:85.3,l2:82.1,l3:83.0,l4:85.1,tier:'TOP',color:'#00ffc8'},
  {id:'MYS',flag:'🇲🇾',name:'Malaysia',    gosa:81.2,trend:+0.4,fdi:'$22B',l1:82.5,l2:80.7,l3:81.8,l4:79.8,tier:'HIGH',color:'#00d4ff'},
  {id:'VNM',flag:'🇻🇳',name:'Vietnam',     gosa:79.4,trend:+0.5,fdi:'$24B',l1:80.5,l2:79.1,l3:78.9,l4:79.1,tier:'HIGH',color:'#00d4ff'},
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
  {s:'EV Battery',      x:82,y:91,size:16,color:'#00ffc8',momentum:'HOT'},
  {s:'Data Centers',    x:76,y:88,size:14,color:'#00d4ff',momentum:'HOT'},
  {s:'Semiconductors',  x:84,y:78,size:13,color:'#ffd700',momentum:'RISING'},
  {s:'Renewables',      x:71,y:82,size:12,color:'#00ffc8',momentum:'RISING'},
  {s:'FinTech',         x:68,y:74,size:10,color:'#9b59b6',momentum:'STABLE'},
  {s:'Pharma/Health',   x:79,y:69,size:11,color:'#00d4ff',momentum:'STABLE'},
  {s:'Aerospace',       x:74,y:64,size:9, color:'#ffd700',momentum:'STABLE'},
  {s:'Logistics',       x:61,y:72,size:10,color:'#ff4466',momentum:'COOLING'},
];

const ZONES = [
  {name:'Jurong Island, SG',    country:'SGP',type:'Industrial',avail:34,total:100,color:'#00ffc8'},
  {name:'Jebel Ali FZ, UAE',    country:'ARE',type:'Multi-use', avail:22,total:100,color:'#00d4ff'},
  {name:'Penang FIZ, Malaysia', country:'MYS',type:'Tech',      avail:41,total:100,color:'#ffd700'},
  {name:'Eastern EEC, Thailand',country:'THA',type:'EV/Auto',   avail:58,total:100,color:'#9b59b6'},
  {name:'VSIP, Vietnam',        country:'VNM',type:'Manufacturing',avail:47,total:100,color:'#00ffc8'},
  {name:'NEOM, Saudi Arabia',   country:'SAU',type:'Mixed-use', avail:78,total:100,color:'#e67e22'},
];

const POLICIES = [
  {country:'Malaysia',flag:'🇲🇾',policy:'100% FDI in data centers',status:'NEW',   date:'Mar 2026',c:'#00ffc8'},
  {country:'UAE',    flag:'🇦🇪',policy:'100% mainland ownership',  status:'ACTIVE', date:'Feb 2026',c:'#00d4ff'},
  {country:'Thailand',flag:'🇹🇭',policy:'$2B EV battery incentive', status:'NEW',   date:'Mar 2026',c:'#ffd700'},
  {country:'Vietnam', flag:'🇻🇳',policy:'50% CIT reduction EV mfg', status:'ACTIVE', date:'Jan 2026',c:'#9b59b6'},
  {country:'Saudi Arabia',flag:'🇸🇦',policy:'30-day license guarantee',status:'NEW', date:'Mar 2026',c:'#e67e22'},
];

const INITIAL_SIGNALS = [
  {id:1,type:'POLICY',grade:'PLATINUM',country:'Malaysia',flag:'🇲🇾',title:'FDI cap in data centers raised to 100%',sco:96,impact:'HIGH',ts:'2m'},
  {id:2,type:'INCENTIVE',grade:'PLATINUM',country:'Thailand',flag:'🇹🇭',title:'$2B EV battery subsidy package approved',sco:95,impact:'HIGH',ts:'1h'},
  {id:3,type:'DEAL',grade:'PLATINUM',country:'UAE',flag:'🇦🇪',title:'Microsoft $3.3B AI data center announced',sco:97,impact:'HIGH',ts:'2d'},
  {id:4,type:'GROWTH',grade:'GOLD',country:'Vietnam',flag:'🇻🇳',title:'Electronics exports surge 34% YoY',sco:92,impact:'MED',ts:'3h'},
  {id:5,type:'ZONE',grade:'GOLD',country:'Indonesia',flag:'🇮🇩',title:'New Batam zone — 200ha ready',sco:91,impact:'MED',ts:'5h'},
];

function scoreColor(s:number){ return s>=80?'#00ffc8':s>=60?'#00d4ff':s>=40?'#ffd700':'#ff4466'; }
function gradeBg(g:string){ return g==='PLATINUM'?'rgba(155,89,182,0.15)':g==='GOLD'?'rgba(255,215,0,0.12)':'rgba(148,168,179,0.1)'; }
function gradeColor(g:string){ return g==='PLATINUM'?'#c39bd3':g==='GOLD'?'#ffd700':'#94a8b3'; }
function typeColor(t:string){ const m:any={POLICY:'#ff4466',INCENTIVE:'#00ffc8',DEAL:'#e67e22',GROWTH:'#00d4ff',ZONE:'#9b59b6'}; return m[t]||'#94a8b3'; }

/* ── MINI RADAR ─────────────────────────────────────────────────────── */
function RadarMini({data,size=90}:{data:number[];size?:number}){
  const n=data.length; const cx=size/2,cy=size/2,r=size*0.38;
  function pt(i:number,v:number){const a=(Math.PI*2*i/n)-Math.PI/2;const d=(v/100)*r;return{x:cx+d*Math.cos(a),y:cy+d*Math.sin(a)};}
  const pts=data.map((v,i)=>pt(i,v));
  const poly=pts.map(p=>`${p.x},${p.y}`).join(' ');
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[20,40,60,80,100].map(l=>{const ps=data.map((_,i)=>pt(i,l));return <polygon key={l} points={ps.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke="rgba(0,255,200,0.06)" strokeWidth="0.5"/>;})}
      {data.map((_,i)=>{const p=pt(i,100);return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(0,255,200,0.06)" strokeWidth="0.5"/>;})}
      <polygon points={poly} fill="rgba(0,255,200,0.15)" stroke="#00ffc8" strokeWidth="1.5"/>
      {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#00ffc8" style={{filter:'drop-shadow(0 0 4px #00ffc8)'}}/>)}
    </svg>
  );
}

/* ── SECTOR SCATTER ─────────────────────────────────────────────────── */
function SectorScatter(){
  const [hov,setHov]=useState<string|null>(null);
  const W=320,H=200;
  return(
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{width:'100%'}}>
      {/* Grid */}
      {[0,25,50,75,100].map(v=>(
        <line key={v} x1={v/100*(W-40)+20} y1={8} x2={v/100*(W-40)+20} y2={H-24} stroke="rgba(0,255,200,0.06)" strokeWidth="0.5" strokeDasharray="3,6"/>
      ))}
      {[0,25,50,75,100].map(v=>(
        <line key={v} x1={20} y1={(1-v/100)*(H-32)+8} x2={W-20} y2={(1-v/100)*(H-32)+8} stroke="rgba(0,255,200,0.06)" strokeWidth="0.5" strokeDasharray="3,6"/>
      ))}
      {/* Axis labels */}
      <text x={W/2} y={H-6} textAnchor="middle" fill="rgba(232,244,248,0.3)" fontSize="8" fontFamily="'JetBrains Mono',monospace">INCENTIVE STRENGTH →</text>
      <text x={8} y={H/2} textAnchor="middle" fill="rgba(232,244,248,0.3)" fontSize="8" fontFamily="'JetBrains Mono',monospace" transform={`rotate(-90,8,${H/2})`}>MARKET ATTRACTIVENESS →</text>
      {/* Quadrant label */}
      <text x={W-60} y={22} textAnchor="middle" fill="rgba(0,255,200,0.3)" fontSize="7" fontFamily="'JetBrains Mono',monospace">PRIORITY ZONE</text>
      {/* Points */}
      {SECTOR_MATRIX.map(s=>{
        const px=20+(s.x/100)*(W-40);
        const py=8+((100-s.y)/100)*(H-32);
        const isH=hov===s.s;
        return(
          <g key={s.s} onMouseEnter={()=>setHov(s.s)} onMouseLeave={()=>setHov(null)} style={{cursor:'pointer'}}>
            <circle cx={px} cy={py} r={s.size+2} fill={`${s.color}08`} stroke={`${s.color}20`} strokeWidth="1" style={{filter:isH?`drop-shadow(0 0 8px ${s.color})`:'none'}}/>
            <circle cx={px} cy={py} r={s.size/2} fill={s.color} opacity="0.85" style={{filter:isH?`drop-shadow(0 0 12px ${s.color})`:'none'}}/>
            {isH&&<text x={px} y={py-s.size-4} textAnchor="middle" fill={s.color} fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">{s.s}</text>}
          </g>
        );
      })}
    </svg>
  );
}

/* ── MAIN COMPONENT ─────────────────────────────────────────────────── */
export default function Dashboard() {
  const [signals,setSignals]=useState(INITIAL_SIGNALS);
  const [selCountry,setSelCountry]=useState(TOP_ECONOMIES[0]);
  const [lastUpdate,setLastUpdate]=useState(new Date());
  const [time,setTime]=useState(new Date());

  useEffect(()=>{
    const iv=setInterval(()=>{
      setTime(new Date());
      if(Math.random()>0.65){
        const types=['POLICY','INCENTIVE','DEAL','GROWTH','ZONE'];
        const ctrs=[{n:'Malaysia',f:'🇲🇾'},{n:'UAE',f:'🇦🇪'},{n:'Vietnam',f:'🇻🇳'},{n:'Thailand',f:'🇹🇭'},{n:'Singapore',f:'🇸🇬'}];
        const g=['PLATINUM','GOLD','SILVER'][Math.floor(Math.random()*3)];
        const c=ctrs[Math.floor(Math.random()*ctrs.length)];
        setSignals(p=>[{id:Date.now(),type:types[Math.floor(Math.random()*types.length)],grade:g,country:c.n,flag:c.f,title:'New investment signal detected — SCI scoring in progress',sco:70+Math.floor(Math.random()*26),impact:['HIGH','MED','LOW'][Math.floor(Math.random()*3)],ts:'now'},...p.slice(0,8)]);
        setLastUpdate(new Date());
      }
    },4000);
    return ()=>clearInterval(iv);
  },[]);

  const Panel=({children,style={}}:{children:any,style?:any})=>(
    <div style={{background:'rgba(10,22,40,0.7)',border:'1px solid rgba(0,180,216,0.12)',borderRadius:'12px',backdropFilter:'blur(10px)',boxShadow:'0 8px 32px rgba(0,0,0,0.4)',overflow:'hidden',...style}}>
      {children}
    </div>
  );

  const PanelHeader=({icon,title,badge,extra}:{icon:any,title:string,badge?:string,extra?:any})=>(
    <div style={{padding:'12px 16px',borderBottom:'1px solid rgba(0,255,200,0.06)',display:'flex',alignItems:'center',gap:'10px',background:'rgba(0,0,0,0.2)'}}>
      <span style={{color:'#00ffc8'}}>{icon}</span>
      <span style={{fontSize:'11px',fontWeight:800,color:'rgba(232,244,248,0.8)',letterSpacing:'0.1em',textTransform:'uppercase',fontFamily:"'Orbitron','Inter',sans-serif",flex:1}}>{title}</span>
      {badge&&<span style={{fontSize:'8px',fontWeight:800,padding:'2px 8px',borderRadius:'4px',background:'rgba(0,255,200,0.08)',color:'#00ffc8',border:'1px solid rgba(0,255,200,0.2)',letterSpacing:'0.08em',fontFamily:"'JetBrains Mono',monospace"}}>{badge}</span>}
      {extra}
    </div>
  );

  return(
    <div style={{minHeight:'100vh',background:'#020c14',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>

      {/* ── DASHBOARD HEADER ──────────────────────────────────────── */}
      <div style={{background:'linear-gradient(180deg,rgba(4,14,28,0.95),rgba(2,12,20,0.9))',borderBottom:'1px solid rgba(0,255,200,0.08)',padding:'14px 24px',position:'sticky',top:'58px',zIndex:100,backdropFilter:'blur(20px)'}}>
        <div style={{maxWidth:'1900px',margin:'0 auto',display:'flex',alignItems:'center',gap:'16px',flexWrap:'wrap'}}>
          {/* Title */}
          <div style={{flex:1}}>
            <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.5)',letterSpacing:'0.15em',fontFamily:"'Orbitron','Inter',sans-serif"}}>INTELLIGENCE DASHBOARD</div>
            <div style={{fontSize:'18px',fontWeight:900,color:'#e8f4f8'}}>Global FDI Monitor — Live Operations</div>
          </div>
          {/* Time */}
          <div style={{textAlign:'center',padding:'6px 16px',background:'rgba(0,255,200,0.05)',border:'1px solid rgba(0,255,200,0.1)',borderRadius:'8px'}}>
            <div style={{fontSize:'16px',fontWeight:800,color:'#00ffc8',fontFamily:"'JetBrains Mono',monospace"}}>{time.toLocaleTimeString()}</div>
            <div style={{fontSize:'9px',color:'rgba(0,255,200,0.4)',letterSpacing:'0.1em'}}>{time.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase()}</div>
          </div>
          {/* Status badges */}
          {[['AGT-02','SIGNAL'],['AGT-04','GOSA'],['AGT-05','GFR'],['API','LIVE']].map(([a,l])=>(
            <div key={a} style={{display:'flex',alignItems:'center',gap:'5px',padding:'4px 10px',background:'rgba(0,255,200,0.05)',border:'1px solid rgba(0,255,200,0.12)',borderRadius:'20px'}}>
              <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'#00ffc8',boxShadow:'0 0 6px #00ffc8'}}/>
              <span style={{fontSize:'9px',fontWeight:700,color:'rgba(0,255,200,0.7)',fontFamily:"'JetBrains Mono',monospace"}}>{a}</span>
              <span style={{fontSize:'9px',color:'rgba(232,244,248,0.3)'}}>{l}</span>
            </div>
          ))}
          <div style={{fontSize:'11px',color:'rgba(232,244,248,0.3)',fontFamily:"'JetBrains Mono',monospace"}}>Updated: {lastUpdate.toLocaleTimeString()}</div>
        </div>
      </div>

      {/* ── MAIN GRID ─────────────────────────────────────────────── */}
      <div style={{maxWidth:'1900px',margin:'0 auto',padding:'20px 24px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr 380px',gridTemplateRows:'auto auto auto',gap:'14px'}}>

        {/* ── W1: GLOBAL OPPORTUNITY MAP ───────────────── */}
        <Panel style={{gridColumn:'1/3',gridRow:'1/2'}}>
          <PanelHeader icon={<Globe size={13}/>} title="Global Opportunity Map" badge="INTERACTIVE"/>
          <div style={{padding:'12px 16px',display:'flex',gap:'16px',alignItems:'center',minHeight:'460px'}}>
            <div style={{flex:'0 0 auto'}}>
              <Globe3D width={420} height={420} onCountryClick={(c:any)=>{
                const ec=TOP_ECONOMIES.find(e=>e.name===c.country||e.id===c.id);
                if(ec)setSelCountry(ec);
              }}/>
            </div>
            <div style={{flex:1}}>
              {/* Selected country detail */}
              <div style={{padding:'16px',background:'rgba(0,0,0,0.3)',borderRadius:'10px',border:'1px solid rgba(0,255,200,0.1)',marginBottom:'12px'}}>
                <div style={{fontSize:'9px',color:'rgba(0,255,200,0.4)',letterSpacing:'0.15em',marginBottom:'8px',fontFamily:"'Orbitron','Inter',sans-serif"}}>SELECTED ECONOMY</div>
                <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
                  <span style={{fontSize:'36px'}}>{selCountry.flag}</span>
                  <div>
                    <div style={{fontSize:'18px',fontWeight:900,color:'#e8f4f8'}}>{selCountry.name}</div>
                    <div style={{fontSize:'11px',color:'rgba(0,255,200,0.5)'}}>GOSA Score · {selCountry.tier} Tier</div>
                  </div>
                  <div style={{marginLeft:'auto',textAlign:'right'}}>
                    <div style={{fontSize:'38px',fontWeight:900,color:'#00ffc8',fontFamily:"'JetBrains Mono',monospace",textShadow:'0 0 20px rgba(0,255,200,0.5)',lineHeight:1}}>{selCountry.gosa}</div>
                    <div style={{fontSize:'10px',color:selCountry.trend>0?'#00ffc8':'#ff4466',fontWeight:700,display:'flex',alignItems:'center',gap:'3px',justifyContent:'flex-end'}}>
                      {selCountry.trend>0?<TrendingUp size={10}/>:<TrendingDown size={10}/>}
                      {selCountry.trend>0?'+':''}{selCountry.trend} MoM
                    </div>
                  </div>
                </div>
                <RadarMini data={[selCountry.l1,selCountry.l2,selCountry.l3,selCountry.l4,selCountry.l1*0.9,selCountry.l2*0.95]}/>
              </div>
              {/* Layer scores */}
              {[['L1 Doing Business',selCountry.l1,'#00ffc8'],['L2 Sector',selCountry.l2,'#00d4ff'],['L3 Zones',selCountry.l3,'#ffd700'],['L4 Market Intel',selCountry.l4,'#9b59b6']].map(([l,v,c])=>(
                <div key={l as string} style={{marginBottom:'8px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}>
                    <span style={{fontSize:'11px',color:'rgba(232,244,248,0.5)'}}>{l}</span>
                    <span style={{fontSize:'12px',fontWeight:800,color:c as string,fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>
                  </div>
                  <div style={{height:'4px',background:'rgba(255,255,255,0.05)',borderRadius:'2px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${v as number}%`,background:c as string,borderRadius:'2px',boxShadow:`0 0 8px ${c}60`}}/>
                  </div>
                </div>
              ))}
              <div style={{display:'flex',gap:'8px',marginTop:'14px'}}>
                <Link href={`/country/${selCountry.id}`} style={{flex:1,padding:'8px',background:'rgba(0,255,200,0.08)',border:'1px solid rgba(0,255,200,0.2)',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'#00ffc8',textAlign:'center'}}>Full Profile →</Link>
                <Link href="/reports" style={{flex:1,padding:'8px',background:'rgba(255,215,0,0.08)',border:'1px solid rgba(255,215,0,0.2)',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'#ffd700',textAlign:'center'}}>Report →</Link>
              </div>
              {/* Quick select */}
              <div style={{marginTop:'12px',display:'flex',gap:'6px',flexWrap:'wrap'}}>
                {TOP_ECONOMIES.map(e=>(
                  <button key={e.id} onClick={()=>setSelCountry(e)}
                    style={{padding:'4px 10px',background:selCountry.id===e.id?'rgba(0,255,200,0.12)':'rgba(255,255,255,0.04)',border:`1px solid ${selCountry.id===e.id?'rgba(0,255,200,0.3)':'rgba(255,255,255,0.06)'}`,borderRadius:'20px',cursor:'pointer',fontSize:'11px',color:selCountry.id===e.id?'#00ffc8':'rgba(232,244,248,0.5)',fontFamily:'inherit',display:'flex',alignItems:'center',gap:'5px'}}>
                    {e.flag} {e.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        {/* ── W2: GLOBAL INVESTMENT ANALYSIS ──────────── */}
        <Panel style={{gridColumn:'3/4',gridRow:'1/2'}}>
          <PanelHeader icon={<BarChart3 size={13}/>} title="Global Investment Analysis" badge="TOP 5"/>
          <div style={{padding:'14px 16px'}}>
            {TOP_ECONOMIES.map((c,i)=>(
              <div key={c.id} onClick={()=>setSelCountry(c)}
                style={{padding:'10px 12px',borderRadius:'9px',marginBottom:'8px',cursor:'pointer',background:selCountry.id===c.id?'rgba(0,255,200,0.06)':'rgba(255,255,255,0.02)',border:`1px solid ${selCountry.id===c.id?'rgba(0,255,200,0.2)':'rgba(255,255,255,0.04)'}`,transition:'all 200ms ease'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'6px'}}>
                  <span style={{fontSize:'9px',fontWeight:800,color:scoreColor(c.gosa),fontFamily:"'JetBrains Mono',monospace",minWidth:'18px'}}>#{i+1}</span>
                  <span style={{fontSize:'18px'}}>{c.flag}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'12px',fontWeight:700,color:'#e8f4f8'}}>{c.name}</div>
                    <div style={{fontSize:'9px',color:'rgba(232,244,248,0.4)'}}>FDI {c.fdi}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'18px',fontWeight:900,color:scoreColor(c.gosa),fontFamily:"'JetBrains Mono',monospace"}}>{c.gosa}</div>
                    <div style={{fontSize:'9px',color:c.trend>0?'#00ffc8':'#ff4466',fontWeight:700,display:'flex',alignItems:'center',gap:'2px',justifyContent:'flex-end'}}>
                      {c.trend>0?'▲':'▼'}{Math.abs(c.trend)}
                    </div>
                  </div>
                </div>
                <div style={{height:'3px',background:'rgba(255,255,255,0.05)',borderRadius:'2px',overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${c.gosa}%`,background:`linear-gradient(90deg, ${scoreColor(c.gosa)}80, ${scoreColor(c.gosa)})`,borderRadius:'2px'}}/>
                </div>
              </div>
            ))}
            <Link href="/investment-analysis" style={{display:'block',textAlign:'center',padding:'8px',marginTop:'8px',background:'rgba(0,255,200,0.05)',border:'1px solid rgba(0,255,200,0.1)',borderRadius:'8px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'rgba(0,255,200,0.7)'}}>
              View All 15 Economies →
            </Link>
          </div>
        </Panel>

        {/* ── W7: SIGNALS FEED ──────────────────────────────────────── */}
        <Panel style={{gridColumn:'4/5',gridRow:'1/3'}}>
          <PanelHeader icon={<Zap size={13}/>} title="Investment Signals" badge="LIVE">
            <span style={{fontSize:'9px',color:'rgba(232,244,248,0.3)',fontFamily:"'JetBrains Mono',monospace"}}>{signals.length}</span>
          </PanelHeader>
          <div style={{height:'680px',overflowY:'auto',padding:'10px'}}>
            {signals.map((s,i)=>(
              <div key={s.id} style={{padding:'10px 11px',borderRadius:'8px',marginBottom:'6px',background:'rgba(255,255,255,0.02)',border:`1px solid rgba(255,255,255,0.04)`,borderLeft:`2px solid ${typeColor(s.type)}`,animation:i===0?'slideIn 0.3s ease':'none',transition:'all 200ms ease'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}>
                  <div style={{display:'flex',gap:'4px',alignItems:'center'}}>
                    <span style={{fontSize:'8px',fontWeight:800,padding:'1px 6px',borderRadius:'3px',background:gradeBg(s.grade),color:gradeColor(s.grade),letterSpacing:'0.04em'}}>{s.grade}</span>
                    <span style={{fontSize:'10px',padding:'1px 6px',background:`${typeColor(s.type)}15`,color:typeColor(s.type),borderRadius:'3px',fontWeight:700,letterSpacing:'0.03em'}}>{s.type}</span>
                  </div>
                  <span style={{fontSize:'11px',fontWeight:900,color:'#9b59b6',fontFamily:"'JetBrains Mono',monospace"}}>{s.sco}</span>
                </div>
                <div style={{fontSize:'11px',color:'rgba(232,244,248,0.75)',lineHeight:1.5,marginBottom:'5px'}}>{s.title}</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:'10px',color:'rgba(232,244,248,0.35)'}}>{s.flag} {s.country}</span>
                  <span style={{fontSize:'9px',color:'rgba(0,255,200,0.3)',fontFamily:"'JetBrains Mono',monospace"}}>{s.ts} ago</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{padding:'10px',borderTop:'1px solid rgba(0,255,200,0.06)'}}>
            <Link href="/signals" style={{display:'block',textAlign:'center',padding:'8px',background:'rgba(0,255,200,0.06)',border:'1px solid rgba(0,255,200,0.15)',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'#00ffc8'}}>
              Full Signals Feed →
            </Link>
          </div>
        </Panel>

        {/* ── W3: DOING BUSINESS INDICATORS ──────────── */}
        <Panel style={{gridColumn:'1/2',gridRow:'2/3'}}>
          <PanelHeader icon={<Shield size={13}/>} title="Doing Business Indicators" badge="L1 LAYER"/>
          <div style={{padding:'14px 16px'}}>
            {DB_INDICATORS.map(({ind,globe,avg,color})=>(
              <div key={ind} style={{marginBottom:'9px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'3px'}}>
                  <span style={{fontSize:'10px',color:'rgba(232,244,248,0.55)',fontWeight:500}}>{ind}</span>
                  <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
                    <span style={{fontSize:'11px',fontWeight:700,color:'rgba(232,244,248,0.35)',fontFamily:"'JetBrains Mono',monospace"}}>{avg}</span>
                    <span style={{fontSize:'12px',fontWeight:800,color,fontFamily:"'JetBrains Mono',monospace"}}>{globe}</span>
                  </div>
                </div>
                <div style={{position:'relative',height:'5px',background:'rgba(255,255,255,0.05)',borderRadius:'3px',overflow:'hidden'}}>
                  <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${avg}%`,background:'rgba(255,255,255,0.06)',borderRadius:'3px'}}/>
                  <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${globe}%`,background:`linear-gradient(90deg, ${color}60, ${color})`,borderRadius:'3px',boxShadow:`0 0 6px ${color}60`}}/>
                </div>
              </div>
            ))}
            <div style={{display:'flex',gap:'12px',marginTop:'10px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'9px',color:'rgba(232,244,248,0.3)'}}>
                <div style={{width:'16px',height:'3px',background:'rgba(255,255,255,0.15)',borderRadius:'2px'}}/>
                Global Avg
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'9px',color:'rgba(232,244,248,0.3)'}}>
                <div style={{width:'16px',height:'3px',background:'linear-gradient(90deg, #00ffc860, #00ffc8)',borderRadius:'2px'}}/>
                Selected Economy
              </div>
            </div>
          </div>
        </Panel>

        {/* ── W4: SECTOR MATRIX ─────────────────────── */}
        <Panel style={{gridColumn:'2/3',gridRow:'2/3'}}>
          <PanelHeader icon={<Target size={13}/>} title="Sector Attractiveness Matrix" badge="L2 LAYER"/>
          <div style={{padding:'14px 16px'}}>
            <SectorScatter/>
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginTop:'10px'}}>
              {[['HOT','#00ffc8'],['RISING','#ffd700'],['STABLE','#00d4ff'],['COOLING','#ff4466']].map(([l,c])=>(
                <div key={l} style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'9px',color:`${c}80`,padding:'3px 8px',background:`${c}10`,borderRadius:'10px',border:`1px solid ${c}20`}}>
                  <div style={{width:'6px',height:'6px',borderRadius:'50%',background:c}}/>
                  {l}
                </div>
              ))}
            </div>
            <Link href="/investment-analysis" style={{display:'block',textAlign:'center',padding:'7px',marginTop:'10px',background:'rgba(0,212,255,0.05)',border:'1px solid rgba(0,212,255,0.12)',borderRadius:'7px',textDecoration:'none',fontSize:'10px',fontWeight:700,color:'rgba(0,212,255,0.7)'}}>
              Full Investment Analysis →
            </Link>
          </div>
        </Panel>

        {/* ── W5: INVESTMENT ZONES ──────────────────── */}
        <Panel style={{gridColumn:'3/4',gridRow:'2/3'}}>
          <PanelHeader icon={<Globe size={13}/>} title="Special Investment Zones" badge="L3 LAYER"/>
          <div style={{padding:'12px 16px'}}>
            {ZONES.map(z=>{
              const pct=(z.total-z.avail)/z.total*100;
              return(
                <div key={z.name} style={{marginBottom:'10px',padding:'10px 12px',background:'rgba(255,255,255,0.02)',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.04)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}>
                    <div>
                      <div style={{fontSize:'11px',fontWeight:700,color:'rgba(232,244,248,0.85)'}}>{z.name}</div>
                      <div style={{fontSize:'9px',color:'rgba(232,244,248,0.35)'}}>{z.type}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:'15px',fontWeight:900,color:z.color,fontFamily:"'JetBrains Mono',monospace"}}>{z.avail}<span style={{fontSize:'9px',color:'rgba(232,244,248,0.3)',fontWeight:400}}>% avail</span></div>
                    </div>
                  </div>
                  <div style={{height:'4px',background:'rgba(255,255,255,0.05)',borderRadius:'2px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg, ${z.color}40, ${z.color})`,borderRadius:'2px'}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* ── W6: POLICIES & INCENTIVES ─────────────────────────────── */}
        <Panel style={{gridColumn:'1/3',gridRow:'3/4'}}>
          <PanelHeader icon={<Activity size={13}/>} title="Policy & Incentives Monitor" badge="LIVE"/>
          <div style={{padding:'12px 16px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            {POLICIES.map(p=>(
              <div key={p.policy} style={{padding:'12px 14px',background:'rgba(255,255,255,0.02)',borderRadius:'9px',border:`1px solid ${p.c}18`,borderLeft:`3px solid ${p.c}`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'7px'}}>
                    <span style={{fontSize:'16px'}}>{p.flag}</span>
                    <span style={{fontSize:'12px',fontWeight:700,color:'rgba(232,244,248,0.8)'}}>{p.country}</span>
                  </div>
                  <span style={{fontSize:'8px',fontWeight:800,padding:'2px 7px',borderRadius:'4px',background:p.status==='NEW'?'rgba(0,255,200,0.1)':'rgba(0,180,216,0.1)',color:p.status==='NEW'?'#00ffc8':'#00b4d8',letterSpacing:'0.06em'}}>{p.status}</span>
                </div>
                <div style={{fontSize:'12px',color:'rgba(232,244,248,0.65)',lineHeight:1.5,marginBottom:'4px'}}>{p.policy}</div>
                <div style={{fontSize:'9px',color:'rgba(232,244,248,0.3)',fontFamily:"'JetBrains Mono',monospace"}}>{p.date}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* ── W BOTTOM: QUICK LINKS ─────────────────────────────────── */}
        <Panel style={{gridColumn:'3/5',gridRow:'3/4'}}>
          <PanelHeader icon={<ChevronRight size={13}/>} title="Platform Navigation" />
          <div style={{padding:'14px 16px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
            {[
              {href:'/gfr',icon:'🏆',l:'GFR Ranking',d:'25 economies · 6 dimensions',c:'#ffd700'},
              {href:'/reports',icon:'📄',l:'PDF Reports',d:'4-page AI intelligence',c:'#e67e22'},
              {href:'/pmp',icon:'🎯',l:'Mission Planning',d:'4 guided workflows',c:'#ff4466'},
              {href:'/sources',icon:'📡',l:'Data Sources',d:'304+ official sources',c:'#00d4ff'},
            ].map(({href,icon,l,d,c})=>(
              <Link key={href} href={href} style={{padding:'12px',background:'rgba(255,255,255,0.02)',border:`1px solid rgba(255,255,255,0.04)`,borderRadius:'9px',textDecoration:'none',display:'flex',gap:'10px',alignItems:'center',transition:'all 200ms ease'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=`${c}25`;e.currentTarget.style.background=`${c}06`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.04)';e.currentTarget.style.background='rgba(255,255,255,0.02)';}}>
                <span style={{fontSize:'22px'}}>{icon}</span>
                <div>
                  <div style={{fontSize:'12px',fontWeight:700,color:'rgba(232,244,248,0.8)'}}>{l}</div>
                  <div style={{fontSize:'10px',color:`${c}70`}}>{d}</div>
                </div>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <Footer/>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
