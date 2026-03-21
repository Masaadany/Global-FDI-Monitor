'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, ChevronRight, Download, Globe, Zap, BarChart3, Target, Filter, RefreshCw, ExternalLink } from 'lucide-react';

// ── MASTER DATA ───────────────────────────────────────────────────────────────
const TOP_ECONOMIES = [
  {iso3:'SGP',name:'Singapore',    flag:'🇸🇬',score:88.4,l1:92.1,l2:85.3,l3:87.2,l4:89.0,trend:+0.2,tier:'TOP',region:'Asia Pacific',lat:1.35,lng:103.8},
  {iso3:'NZL',name:'New Zealand',  flag:'🇳🇿',score:86.7,l1:89.5,l2:84.1,l3:85.8,l4:87.3,trend:-0.1,tier:'TOP',region:'Oceania',     lat:-41.3,lng:174.8},
  {iso3:'DNK',name:'Denmark',      flag:'🇩🇰',score:85.3,l1:87.2,l2:83.5,l3:84.9,l4:85.6,trend:+0.3,tier:'TOP',region:'Europe',      lat:55.7,lng:12.6},
  {iso3:'KOR',name:'South Korea',  flag:'🇰🇷',score:84.1,l1:86.0,l2:82.8,l3:83.5,l4:84.2,trend:+0.1,tier:'TOP',region:'Asia Pacific',lat:37.6,lng:127.0},
  {iso3:'USA',name:'United States',flag:'🇺🇸',score:83.9,l1:85.3,l2:82.1,l3:83.0,l4:85.1,trend:-0.2,tier:'TOP',region:'Americas',    lat:38.9,lng:-77.0},
  {iso3:'GBR',name:'United Kingdom',flag:'🇬🇧',score:82.5,l1:84.1,l2:81.4,l3:82.2,l4:82.3,trend:-0.1,tier:'TOP',region:'Europe',     lat:51.5,lng:-0.1},
  {iso3:'MYS',name:'Malaysia',     flag:'🇲🇾',score:81.2,l1:82.5,l2:80.7,l3:81.8,l4:79.8,trend:+0.4,tier:'HIGH',region:'Asia Pacific',lat:3.1,lng:101.7},
  {iso3:'THA',name:'Thailand',     flag:'🇹🇭',score:80.7,l1:81.8,l2:80.2,l3:81.0,l4:79.8,trend:+0.2,tier:'HIGH',region:'Asia Pacific',lat:13.7,lng:100.5},
  {iso3:'VNM',name:'Vietnam',      flag:'🇻🇳',score:79.4,l1:80.5,l2:79.1,l3:78.9,l4:79.1,trend:+0.5,tier:'HIGH',region:'Asia Pacific',lat:21.0,lng:105.8},
  {iso3:'IDN',name:'Indonesia',    flag:'🇮🇩',score:77.8,l1:78.9,l2:77.3,l3:77.5,l4:77.5,trend:+0.1,tier:'HIGH',region:'Asia Pacific',lat:-6.2,lng:106.8},
  {iso3:'ARE',name:'UAE',          flag:'🇦🇪',score:82.1,l1:83.4,l2:81.2,l3:82.8,l4:81.0,trend:+1.2,tier:'TOP',region:'Middle East', lat:25.2,lng:55.3},
  {iso3:'SAU',name:'Saudi Arabia', flag:'🇸🇦',score:79.1,l1:77.3,l2:80.4,l3:82.1,l4:76.6,trend:+2.1,tier:'HIGH',region:'Middle East', lat:24.7,lng:46.7},
  {iso3:'DEU',name:'Germany',      flag:'🇩🇪',score:80.2,l1:83.2,l2:78.4,l3:78.9,l4:80.3,trend:-0.3,tier:'TOP',region:'Europe',      lat:52.5,lng:13.4},
  {iso3:'IND',name:'India',        flag:'🇮🇳',score:73.2,l1:69.8,l2:74.6,l3:74.8,l4:73.6,trend:+0.8,tier:'HIGH',region:'Asia Pacific',lat:28.6,lng:77.2},
  {iso3:'BRA',name:'Brazil',       flag:'🇧🇷',score:71.3,l1:68.4,l2:72.8,l3:71.2,l4:72.8,trend:+0.4,tier:'HIGH',region:'Americas',   lat:-23.5,lng:-46.6},
  {iso3:'MAR',name:'Morocco',      flag:'🇲🇦',score:66.8,l1:63.8,l2:68.2,l3:68.4,l4:66.8,trend:+0.6,tier:'HIGH',region:'Africa',     lat:34.0,lng:-6.8},
];

const DB_DATA: Record<string, Record<string,number>> = {
  VNM:{starting_business:84,construction_permits:62,getting_electricity:78,registering_property:71,getting_credit:80,protecting_investors:82,paying_taxes:73,trading_borders:91,enforcing_contracts:65,resolving_insolvency:68},
  SGP:{starting_business:96,construction_permits:88,getting_electricity:98,registering_property:90,getting_credit:92,protecting_investors:95,paying_taxes:91,trading_borders:99,enforcing_contracts:87,resolving_insolvency:89},
  MYS:{starting_business:88,construction_permits:72,getting_electricity:82,registering_property:75,getting_credit:78,protecting_investors:80,paying_taxes:75,trading_borders:88,enforcing_contracts:70,resolving_insolvency:72},
  THA:{starting_business:82,construction_permits:70,getting_electricity:76,registering_property:68,getting_credit:75,protecting_investors:78,paying_taxes:71,trading_borders:85,enforcing_contracts:68,resolving_insolvency:65},
  ARE:{starting_business:93,construction_permits:85,getting_electricity:95,registering_property:88,getting_credit:85,protecting_investors:88,paying_taxes:92,trading_borders:96,enforcing_contracts:82,resolving_insolvency:80},
  SAU:{starting_business:85,construction_permits:74,getting_electricity:88,registering_property:78,getting_credit:72,protecting_investors:79,paying_taxes:80,trading_borders:82,enforcing_contracts:75,resolving_insolvency:70},
};
const DB_LABELS: Record<string,string> = {
  starting_business:'Starting a Business',construction_permits:'Construction Permits',getting_electricity:'Getting Electricity',
  registering_property:'Registering Property',getting_credit:'Getting Credit',protecting_investors:'Protecting Investors',
  paying_taxes:'Paying Taxes',trading_borders:'Trading Across Borders',enforcing_contracts:'Enforcing Contracts',resolving_insolvency:'Resolving Insolvency'
};

const SECTORS = [
  {name:'EV/Battery',     x:85,y:92,size:32,color:'#2ecc71',inv:'$15B'},
  {name:'Semiconductors', x:82,y:89,size:26,color:'#9b59b6',inv:'$8B'},
  {name:'AI Data Centers',x:78,y:85,size:28,color:'#3498db',inv:'$12B'},
  {name:'Digital Economy',x:74,y:80,size:22,color:'#2ecc71',inv:'$5B'},
  {name:'Agribusiness',   x:71,y:72,size:16,color:'#f1c40f',inv:'$2B'},
  {name:'Renewables',     x:76,y:78,size:20,color:'#1abc9c',inv:'$6B'},
  {name:'Fintech',        x:79,y:76,size:18,color:'#e67e22',inv:'$3B'},
  {name:'Pharma',         x:68,y:68,size:14,color:'#e74c3c',inv:'$2B'},
];

const ZONES = [
  {name:'Ho Chi Minh High-Tech Park',country:'Vietnam',  flag:'🇻🇳',occ:85,avail:120,infra:'Premium',incentive:'CIT 10% · 5yr holiday',tenants:'Samsung, Intel, LG'},
  {name:'VSIP Binh Duong',            country:'Vietnam',  flag:'🇻🇳',occ:65,avail:85, infra:'Standard',incentive:'Customs waiver',       tenants:'Nestlé, Unilever'},
  {name:'Dinh Vu Industrial Zone',    country:'Vietnam',  flag:'🇻🇳',occ:45,avail:200,infra:'Developing',incentive:'Land cost 50% off',  tenants:'New zone'},
  {name:'King Abdullah Econ. City',   country:'Saudi Arabia',flag:'🇸🇦',occ:35,avail:800,infra:'Premium', incentive:'0% income tax',     tenants:'SABIC, Alfanar'},
  {name:'Dubai Multi Commodities',    country:'UAE',      flag:'🇦🇪',occ:78,avail:45, infra:'Premium',incentive:'0% tax 50yr',         tenants:'Aramex, Agility'},
  {name:'Penang Science Park',        country:'Malaysia', flag:'🇲🇾',occ:72,avail:38, infra:'Premium',incentive:'MSC Status benefits',  tenants:'Intel, Dell, HP'},
];

const POLICIES = [
  {status:'NEW',    country:'Vietnam',     flag:'🇻🇳',sector:'Manufacturing',    title:'EV Battery Tax Holiday',            body:'50% CIT reduction for first 5 years for EV battery manufacturers in approved zones.',source:'Ministry of Finance Vietnam',valid:'Dec 2028',color:'#2ecc71'},
  {status:'ACTIVE', country:'Thailand',    flag:'🇹🇭',sector:'EV Sector',         title:'8-Year Corporate Tax Exemption',    body:'Full CIT exemption for EV battery, cells, and module manufacturing (standard rate 20%).',source:'Thailand BOI',valid:'Dec 2030',color:'#3498db'},
  {status:'EXPIRING',country:'Malaysia',   flag:'🇲🇾',sector:'High-Tech',         title:'Pioneer Status Incentive',          body:'70% income tax exemption expires December 2026 — apply within 90 days.',source:'MIDA Malaysia',valid:'Sep 2026',color:'#f1c40f'},
  {status:'NEW',    country:'Saudi Arabia',flag:'🇸🇦',sector:'All Sectors',       title:'Vision 2030 FDI Fast-Track',        body:'30-day investment license guarantee under new FDI acceleration framework.',source:'MISA Saudi Arabia',valid:'Dec 2030',color:'#2ecc71'},
  {status:'ACTIVE', country:'UAE',         flag:'🇦🇪',sector:'Digital Economy',   title:'100% Foreign Ownership',            body:'100% foreign ownership now permitted across all mainland sectors.',source:'MOEI UAE',valid:'Permanent',color:'#3498db'},
];

const LIVE_SIGNALS = [
  {id:1,type:'POLICY CHANGE',   cls:'signal-policy',   eco:'Malaysia',  flag:'🇲🇾',title:'FDI cap in data centers raised to 100%',implication:'Positions Malaysia as most accessible data center hub in SEA — $5B+ expected.',time:'2m',impact:'HIGH',source:'MITI Malaysia',color:'#e74c3c'},
  {id:2,type:'NEW INCENTIVE',   cls:'signal-incentive',eco:'Thailand',   flag:'🇹🇭',title:'$2B EV battery subsidy package approved',implication:'Strengthens EV supply chain competitiveness — 5-8 new facilities by 2028.',time:'1h',impact:'HIGH',source:'Thailand BOI',color:'#2ecc71'},
  {id:3,type:'SECTOR GROWTH',   cls:'signal-growth',   eco:'Vietnam',    flag:'🇻🇳',title:'Electronics exports surge 34% YoY',implication:'Vietnam solidifies #2 ASEAN electronics exporter position.',time:'3h',impact:'MEDIUM',source:'GSO Vietnam',color:'#3498db'},
  {id:4,type:'ZONE AVAILABILITY',cls:'signal-zone',    eco:'Indonesia',  flag:'🇮🇩',title:'New Batam zone — 200ha ready for occupancy',implication:'Alleviates land shortage, opens manufacturing relocation opportunities.',time:'5h',impact:'MEDIUM',source:'Batam Authority',color:'#f1c40f'},
  {id:5,type:'COMPETITOR MOVE', cls:'signal-competitor',eco:'Indonesia',  flag:'🇮🇩',title:'$15B nickel processing investment confirmed',implication:'Strengthens nickel dominance — EV competitors face higher raw material costs.',time:'1d',impact:'HIGH',source:'Ministry of Investment',color:'#9b59b6'},
];

function scoreColor(s: number) { return s>=80?'#2ecc71':s>=60?'#3498db':s>=40?'#f1c40f':'#e74c3c'; }
function TrendIcon({v}:{v:number}) {
  if(v>0) return <TrendingUp size={11} color="#2ecc71"/>;
  if(v<0) return <TrendingDown size={11} color="#e74c3c"/>;
  return <Minus size={11} color="#7f8c8d"/>;
}

// ── GLOBE ─────────────────────────────────────────────────────────────────────
function GlobeViz({onSelect, selected}:{onSelect:(iso3:string)=>void, selected:string}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotRef = useRef(0);
  const animRef = useRef(0);
  const hovRef = useRef('');
  const pauseRef = useRef(false);

  useEffect(()=>{
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const W=canvas.width, H=canvas.height, cx=W/2, cy=H/2, R=Math.min(W,H)*0.42;

    function proj(lat:number,lng:number) {
      const phi=(90-lat)*Math.PI/180, th=(lng+rotRef.current)*Math.PI/180;
      const x=R*Math.sin(phi)*Math.cos(th), y=R*Math.cos(phi), z=R*Math.sin(phi)*Math.sin(th);
      return {x:cx+x,y:cy-y,z,vis:z>-R*0.1};
    }

    function draw() {
      ctx.clearRect(0,0,W,H);
      // Base
      const grad=ctx.createRadialGradient(cx-R*.25,cy-R*.25,R*.05,cx,cy,R);
      grad.addColorStop(0,'#1e3a5f'); grad.addColorStop(.6,'#1a2c3e'); grad.addColorStop(1,'#0d1b2a');
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.fillStyle=grad; ctx.fill();
      // Atmosphere glow
      const atm=ctx.createRadialGradient(cx,cy,R*.9,cx,cy,R*1.1);
      atm.addColorStop(0,'transparent'); atm.addColorStop(1,'rgba(46,204,113,0.12)');
      ctx.beginPath(); ctx.arc(cx,cy,R*1.05,0,Math.PI*2); ctx.fillStyle=atm; ctx.fill();
      // Grid
      ctx.strokeStyle='rgba(46,204,113,0.05)'; ctx.lineWidth=.5;
      [-60,-30,0,30,60].forEach(lat=>{
        ctx.beginPath(); let f=true;
        for(let lng=-180;lng<=180;lng+=3){const p=proj(lat,lng);if(p.vis){f?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);f=false;}else f=true;} ctx.stroke();
      });
      for(let lng=-150;lng<180;lng+=30){
        ctx.beginPath(); let f=true;
        for(let lat=-80;lat<=80;lat+=3){const p=proj(lat,lng);if(p.vis){f?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);f=false;}else f=true;} ctx.stroke();
      }
      // Economies
      const visible=TOP_ECONOMIES.map(e=>({...e,p:proj(e.lat,e.lng)})).filter(e=>e.p.vis).sort((a,b)=>b.p.z-a.p.z);
      visible.forEach(e=>{
        const {x,y}=e.p; const c=scoreColor(e.score);
        const isSel=e.iso3===selected, isHov=e.iso3===hovRef.current;
        const r=isSel?9:e.score>=80?7:e.score>=65?5:4;
        // Pulse ring for selected
        if(isSel){
          ctx.beginPath(); ctx.arc(x,y,r+8,0,Math.PI*2);
          ctx.strokeStyle=c+'60'; ctx.lineWidth=2; ctx.stroke();
          ctx.beginPath(); ctx.arc(x,y,r+4,0,Math.PI*2);
          ctx.strokeStyle=c+'80'; ctx.lineWidth=1; ctx.stroke();
        }
        // Glow
        if(isSel||isHov){ctx.shadowBlur=16;ctx.shadowColor=c;}
        ctx.beginPath(); ctx.arc(x,y,r+2,0,Math.PI*2);
        ctx.fillStyle=c+'25'; ctx.fill();
        ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
        ctx.fillStyle=isSel?c:c+'cc'; ctx.fill();
        ctx.shadowBlur=0;
        // Labels
        if(e.score>=83||isSel){
          ctx.font=`${isSel?'bold ':''}10px Inter,sans-serif`;
          ctx.fillStyle=isSel?'white':'rgba(255,255,255,0.85)';
          ctx.fillText(e.name,x+r+4,y+3);
        }
      });
      // Edge
      const edge=ctx.createRadialGradient(cx,cy,R*.82,cx,cy,R);
      edge.addColorStop(0,'transparent'); edge.addColorStop(1,'rgba(46,204,113,0.1)');
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.fillStyle=edge; ctx.fill();
      if(!pauseRef.current) rotRef.current+=.1;
      animRef.current=requestAnimationFrame(draw);
    }
    draw();

    function onClick(e:MouseEvent){
      const r=canvas.getBoundingClientRect(), sx=W/r.width, sy=H/r.height;
      const px=(e.clientX-r.left)*sx, py=(e.clientY-r.top)*sy;
      let best='',bestD=22;
      TOP_ECONOMIES.forEach(eco=>{const p=proj(eco.lat,eco.lng);if(!p.vis)return;const d=Math.hypot(p.x-px,p.y-py);if(d<bestD){bestD=d;best=eco.iso3;}});
      if(best)onSelect(best);
    }
    function onMove(e:MouseEvent){
      const r=canvas.getBoundingClientRect(), sx=W/r.width, sy=H/r.height;
      const px=(e.clientX-r.left)*sx, py=(e.clientY-r.top)*sy;
      let best='',bestD=22;
      TOP_ECONOMIES.forEach(eco=>{const p=proj(eco.lat,eco.lng);if(!p.vis)return;const d=Math.hypot(p.x-px,p.y-py);if(d<bestD){bestD=d;best=eco.iso3;}});
      hovRef.current=best; canvas.style.cursor=best?'pointer':'default';
    }
    function onEnter(){pauseRef.current=true;} function onLeave(){pauseRef.current=false;}
    canvas.addEventListener('click',onClick); canvas.addEventListener('mousemove',onMove);
    canvas.addEventListener('mouseenter',onEnter); canvas.addEventListener('mouseleave',onLeave);
    return()=>{cancelAnimationFrame(animRef.current);canvas.removeEventListener('click',onClick);canvas.removeEventListener('mousemove',onMove);canvas.removeEventListener('mouseenter',onEnter);canvas.removeEventListener('mouseleave',onLeave);};
  },[selected]);

  return <canvas ref={canvasRef} width={520} height={520} style={{width:'100%',height:'auto',maxWidth:'520px',filter:'drop-shadow(0 0 30px rgba(46,204,113,0.15))'}}/>;
}

// ── SECTOR MATRIX SVG ─────────────────────────────────────────────────────────
function SectorMatrix({hoverSector,setHoverSector}:{hoverSector:string,setHoverSector:(s:string)=>void}) {
  const W=300, H=220, padL=36, padB=30, padR=12, padT=12;
  const iW=W-padL-padR, iH=H-padT-padB;
  function px(x:number){return padL+(x-60)/(100-60)*iW;}
  function py(y:number){return padT+(100-y)/(100-60)*iH;}
  return (
    <svg width={W} height={H} style={{overflow:'visible',width:'100%'}}>
      <defs>
        <radialGradient id="sectorBg" cx="50%" cy="50%"><stop offset="0%" stopColor="#f8fff8"/><stop offset="100%" stopColor="#f0f8ff"/></radialGradient>
      </defs>
      <rect x={padL} y={padT} width={iW} height={iH} fill="url(#sectorBg)" rx="6"/>
      {[.25,.5,.75].map(t=>(
        <g key={t}>
          <line x1={padL+t*iW} y1={padT} x2={padL+t*iW} y2={padT+iH} stroke="rgba(26,44,62,0.06)" strokeWidth=".5" strokeDasharray="3,3"/>
          <line x1={padL} y1={padT+t*iH} x2={padL+iW} y2={padT+t*iH} stroke="rgba(26,44,62,0.06)" strokeWidth=".5" strokeDasharray="3,3"/>
        </g>
      ))}
      <line x1={padL} y1={padT+iH} x2={padL+iW} y2={padT+iH} stroke="rgba(26,44,62,0.15)" strokeWidth="1"/>
      <line x1={padL} y1={padT} x2={padL} y2={padT+iH} stroke="rgba(26,44,62,0.15)" strokeWidth="1"/>
      <text x={padL+iW/2} y={H-4} fontSize="9" fill="#7f8c8d" textAnchor="middle">Country Readiness →</text>
      <text x={10} y={padT+iH/2} fontSize="9" fill="#7f8c8d" textAnchor="middle" transform={`rotate(-90,10,${padT+iH/2})`}>Opportunity →</text>
      {SECTORS.map(s=>{
        const bx=px(s.x), by=py(s.y), r=s.size/2;
        const isHov=hoverSector===s.name;
        return (
          <g key={s.name} onMouseEnter={()=>setHoverSector(s.name)} onMouseLeave={()=>setHoverSector('')} style={{cursor:'pointer'}}>
            <circle cx={bx} cy={by} r={r+3} fill={s.color} fillOpacity={isHov?.15:.05}/>
            <circle cx={bx} cy={by} r={r} fill={s.color} fillOpacity={isHov?.9:.7} stroke={s.color} strokeWidth="1.5"/>
            <text x={bx} y={by-r-4} fontSize={isHov?9:8} fill="#1a2c3e" textAnchor="middle" fontWeight={isHov?"700":"600"}>{s.name}</text>
            {isHov&&<text x={bx} y={by+r+12} fontSize={8} fill={s.color} textAnchor="middle" fontWeight="800">{s.inv} invested</text>}
          </g>
        );
      })}
    </svg>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [sel, setSel] = useState('VNM');
  const [sigFilter, setSigFilter] = useState('ALL');
  const [signals, setSignals] = useState(LIVE_SIGNALS);
  const [hoverSector, setHoverSector] = useState('');
  const [tick, setTick] = useState(0);

  const eco = TOP_ECONOMIES.find(e=>e.iso3===sel)||TOP_ECONOMIES[0];
  const dbData = DB_DATA[sel]||DB_DATA.VNM;
  const top5 = [...TOP_ECONOMIES].sort((a,b)=>b.score-a.score).slice(0,5);

  useEffect(()=>{
    const iv=setInterval(()=>{
      setTick(t=>t+1);
      if(Math.random()>.65){
        const types=[{t:'POLICY CHANGE',cls:'signal-policy',c:'#e74c3c'},{t:'NEW INCENTIVE',cls:'signal-incentive',c:'#2ecc71'},{t:'SECTOR GROWTH',cls:'signal-growth',c:'#3498db'},{t:'ZONE AVAILABILITY',cls:'signal-zone',c:'#f1c40f'}];
        const ecos=[{eco:'Singapore',flag:'🇸🇬'},{eco:'UAE',flag:'🇦🇪'},{eco:'Vietnam',flag:'🇻🇳'},{eco:'Malaysia',flag:'🇲🇾'}];
        const tp=types[Math.floor(Math.random()*types.length)];
        const eo=ecos[Math.floor(Math.random()*ecos.length)];
        const titles=['New investment incentive announced','FDI policy framework updated','Sector investment record set','Zone expansion confirmed'];
        setSignals(p=>[{id:Date.now(),...tp,type:tp.t,...eo,title:titles[Math.floor(Math.random()*4)],implication:'Strategic significance under analysis.',time:'Now',impact:'MEDIUM',source:'Official source',color:tp.c},...p.slice(0,11)]);
      }
    },5000);
    return()=>clearInterval(iv);
  },[]);

  const filtSigs=sigFilter==='ALL'?signals:signals.filter(s=>s.type===sigFilter);

  const impactC:Record<string,string>={HIGH:'#e74c3c',MEDIUM:'#f1c40f',LOW:'#2ecc71'};

  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8',fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <NavBar/>

      {/* Dashboard Header */}
      <div style={{background:'linear-gradient(135deg,#0f1e2a 0%,#1a2c3e 60%,#1e3a5f 100%)',padding:'18px 24px',borderBottom:'1px solid rgba(46,204,113,0.1)'}}>
        <div style={{maxWidth:'1600px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'4px'}}>
              <span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#2ecc71',display:'inline-block',animation:'livePulse 2s infinite'}}/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#2ecc71',letterSpacing:'0.1em'}}>LIVE · {signals.length} Active Signals · Real-time Updates</span>
            </div>
            <h1 style={{fontSize:'20px',fontWeight:900,color:'white',letterSpacing:'-0.3px'}}>Global FDI Intelligence Dashboard</h1>
          </div>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            <Link href="/investment-analysis" style={{padding:'8px 18px',background:'#2ecc71',color:'#0f1e2a',borderRadius:'8px',textDecoration:'none',fontSize:'12px',fontWeight:800,display:'flex',alignItems:'center',gap:'6px'}}>
              <BarChart3 size={13}/> Investment Analysis
            </Link>
            <Link href="/reports" style={{padding:'8px 16px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.85)',borderRadius:'8px',textDecoration:'none',fontSize:'12px',fontWeight:600,display:'flex',alignItems:'center',gap:'6px'}}>
              <Download size={13}/> PDF Report
            </Link>
            <Link href="/signals" style={{padding:'8px 16px',border:'1px solid rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.7)',borderRadius:'8px',textDecoration:'none',fontSize:'12px',fontWeight:600,display:'flex',alignItems:'center',gap:'6px'}}>
              <Zap size={13}/> All Signals
            </Link>
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1600px',margin:'0 auto',padding:'20px 24px'}}>

        {/* WIDGET 1: GLOBAL OPPORTUNITY MAP — Full width */}
        <div style={{background:'#1a2c3e',borderRadius:'16px',padding:'0',marginBottom:'16px',boxShadow:'0 20px 40px rgba(0,0,0,0.25)',overflow:'hidden',border:'1px solid rgba(46,204,113,0.1)'}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(46,204,113,0.1)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <Globe size={14} color="#2ecc71"/>
              <span style={{fontSize:'13px',fontWeight:700,color:'#2ecc71'}}>Global Opportunity Map</span>
              <span style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>Click any economy to update all widgets</span>
            </div>
            <div style={{display:'flex',gap:'14px'}}>
              {[{c:'#2ecc71',l:'Top Tier (80-100)'},{c:'#3498db',l:'High Tier (60-79)'},{c:'#f1c40f',l:'Developing (<60)'}].map(({c,l})=>(
                <div key={l} style={{display:'flex',alignItems:'center',gap:'5px'}}>
                  <div style={{width:'8px',height:'8px',borderRadius:'50%',background:c}}/>
                  <span style={{fontSize:'10px',color:'rgba(255,255,255,0.5)'}}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',minHeight:'500px'}}>
            {/* Globe */}
            <div style={{flex:'0 0 560px',display:'flex',justifyContent:'center',alignItems:'center',padding:'24px'}}>
              <GlobeViz onSelect={setSel} selected={sel}/>
            </div>
            {/* Selected country panel */}
            <div style={{flex:1,padding:'24px 24px 24px 0'}}>
              <div style={{marginBottom:'16px'}}>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'4px'}}>Selected Economy</div>
                <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <span style={{fontSize:'36px'}}>{eco.flag}</span>
                  <div>
                    <div style={{fontSize:'22px',fontWeight:900,color:'white',letterSpacing:'-0.3px'}}>{eco.name}</div>
                    <div style={{fontSize:'12px',color:'rgba(255,255,255,0.5)'}}>{eco.region}</div>
                  </div>
                  <div style={{marginLeft:'auto',textAlign:'right'}}>
                    <div style={{fontSize:'36px',fontWeight:900,color:scoreColor(eco.score),fontFamily:"'JetBrains Mono',monospace",lineHeight:1}}>{eco.score}</div>
                    <div style={{display:'flex',alignItems:'center',gap:'4px',justifyContent:'flex-end',marginTop:'3px'}}>
                      <TrendIcon v={eco.trend}/>
                      <span style={{fontSize:'12px',fontWeight:700,color:eco.trend>0?'#2ecc71':eco.trend<0?'#e74c3c':'#7f8c8d'}}>{eco.trend>0?'+':''}{eco.trend} MoM</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'16px'}}>
                {[['L1: Doing Business',eco.l1,0.30],['L2: Sector',eco.l2,0.20],['L3: Zones',eco.l3,0.25],['L4: Market Intel',eco.l4,0.25]].map(([l,v,w])=>(
                  <div key={l as string} style={{padding:'10px 12px',background:'rgba(255,255,255,0.05)',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.07)'}}>
                    <div style={{fontSize:'9px',color:'rgba(255,255,255,0.4)',marginBottom:'3px',textTransform:'uppercase',letterSpacing:'0.05em'}}>{l} <span style={{color:'rgba(46,204,113,0.6)'}}>w:{(w as number)*100}%</span></div>
                    <div style={{fontSize:'18px',fontWeight:900,color:'white',fontFamily:"'JetBrains Mono',monospace"}}>{(v as number).toFixed(1)}</div>
                    <div style={{height:'3px',background:'rgba(255,255,255,0.08)',borderRadius:'2px',marginTop:'4px'}}>
                      <div style={{height:'100%',width:`${v}%`,background:scoreColor(v as number),borderRadius:'2px'}}/>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:'12px',background:'rgba(46,204,113,0.08)',borderRadius:'10px',border:'1px solid rgba(46,204,113,0.2)'}}>
                <div style={{fontSize:'10px',color:'rgba(46,204,113,0.8)',fontWeight:700,marginBottom:'4px',letterSpacing:'0.06em',textTransform:'uppercase'}}>GOSA Formula</div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,0.7)',fontFamily:"'JetBrains Mono',monospace"}}>
                  ({eco.l1.toFixed(1)}×0.30)+({eco.l2.toFixed(1)}×0.20)+({eco.l3.toFixed(1)}×0.25)+({eco.l4.toFixed(1)}×0.25) = <span style={{color:'#2ecc71',fontWeight:700}}>{eco.score}</span>
                </div>
              </div>
              <div style={{marginTop:'14px',display:'flex',gap:'8px'}}>
                <Link href="/investment-analysis" style={{padding:'8px 16px',background:'#2ecc71',color:'#0f1e2a',borderRadius:'7px',textDecoration:'none',fontSize:'12px',fontWeight:700,display:'flex',alignItems:'center',gap:'5px'}}>
                  Full Analysis <ChevronRight size={12}/>
                </Link>
                <Link href="/reports" style={{padding:'8px 14px',border:'1px solid rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.8)',borderRadius:'7px',textDecoration:'none',fontSize:'12px',fontWeight:600}}>
                  Generate PDF
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* WIDGETS 2+3: Investment Analysis + Doing Business — side by side */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:'16px',marginBottom:'16px'}}>
          
          {/* WIDGET 2: Global Investment Analysis */}
          <div className="card">
            <div className="widget-header">
              <div className="widget-title"><BarChart3 size={13} color="#2ecc71"/> Global Investment Analysis</div>
              <Link href="/investment-analysis" style={{fontSize:'11px',color:'#2ecc71',fontWeight:700,textDecoration:'none',display:'flex',alignItems:'center',gap:'2px'}}>
                View Full <ChevronRight size={11}/>
              </Link>
            </div>
            <div style={{padding:'12px 16px'}}>
              <div style={{fontSize:'10px',fontWeight:700,color:'#7f8c8d',marginBottom:'10px'}}>Top 5 by Global Opportunity Score</div>
              {top5.map((e,i)=>(
                <div key={e.iso3} onClick={()=>setSel(e.iso3)}
                  style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 10px',borderRadius:'10px',cursor:'pointer',marginBottom:'3px',
                    background:sel===e.iso3?'rgba(46,204,113,0.08)':'transparent',
                    border:sel===e.iso3?'1px solid rgba(46,204,113,0.2)':'1px solid transparent',transition:'all 0.15s'}}>
                  <span style={{fontSize:'11px',fontWeight:700,color:'#7f8c8d',minWidth:'16px'}}>{i+1}</span>
                  <span style={{fontSize:'18px'}}>{e.flag}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'12px',fontWeight:700,color:'#1a2c3e'}}>{e.name}</div>
                    <div style={{height:'3px',background:'rgba(26,44,62,0.07)',borderRadius:'2px',marginTop:'4px'}}>
                      <div style={{height:'100%',width:`${e.score}%`,background:scoreColor(e.score),borderRadius:'2px'}}/>
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'14px',fontWeight:900,color:'#1a2c3e',fontFamily:"'JetBrains Mono',monospace"}}>{e.score}</div>
                    <div style={{display:'flex',alignItems:'center',gap:'2px',justifyContent:'flex-end'}}>
                      <TrendIcon v={e.trend}/>
                      <span style={{fontSize:'10px',fontWeight:700,color:e.trend>0?'#2ecc71':'#e74c3c'}}>{e.trend>0?'+':''}{e.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/investment-analysis" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'4px',marginTop:'12px',padding:'9px',background:'rgba(46,204,113,0.06)',border:'1px solid rgba(46,204,113,0.15)',borderRadius:'8px',textDecoration:'none',fontSize:'12px',fontWeight:700,color:'#2ecc71'}}>
                View Full Analysis →
              </Link>
            </div>
          </div>

          {/* WIDGET 3: Doing Business Indicators */}
          <div className="card">
            <div className="widget-header">
              <div className="widget-title"><Filter size={13} color="#2ecc71"/> Doing Business Indicators Panel</div>
              <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
                <span style={{fontSize:'12px',fontWeight:700,color:'#1a2c3e'}}>{eco.flag} {eco.name}</span>
                <span style={{fontSize:'10px',color:'#7f8c8d'}}>(from map selection)</span>
              </div>
            </div>
            <div style={{padding:'14px 20px'}}>
              <div style={{display:'flex',gap:'12px',marginBottom:'14px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'5px'}}><div style={{width:'10px',height:'4px',background:'linear-gradient(90deg,#2c4c6e,#2ecc71)',borderRadius:'2px'}}/><span style={{fontSize:'10px',color:'#7f8c8d'}}>Selected economy</span></div>
                <div style={{display:'flex',alignItems:'center',gap:'5px'}}><div style={{width:'10px',height:'4px',background:'rgba(26,44,62,0.12)',borderRadius:'2px'}}/><span style={{fontSize:'10px',color:'#7f8c8d'}}>Global average</span></div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'7px'}}>
                {Object.entries(DB_LABELS).map(([key,label])=>{
                  const score=dbData[key]||65, globalAvg=Math.round(score*.82);
                  return (
                    <div key={key}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}>
                        <span style={{fontSize:'11px',color:'#2c3e50',fontWeight:500}}>{label}</span>
                        <span style={{fontSize:'11px',fontWeight:700,color:'#1a2c3e',fontFamily:"'JetBrains Mono',monospace"}}>{score}/100</span>
                      </div>
                      <div style={{height:'6px',borderRadius:'3px',background:'rgba(26,44,62,0.06)',position:'relative'}}>
                        <div style={{position:'absolute',height:'100%',width:`${globalAvg}%`,background:'rgba(26,44,62,0.12)',borderRadius:'3px'}}/>
                        <div style={{position:'absolute',height:'100%',width:`${score}%`,background:`linear-gradient(90deg,#2c4c6e,${scoreColor(score)})`,borderRadius:'3px',transition:'width 0.8s ease'}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{display:'flex',gap:'8px',marginTop:'14px'}}>
                <button style={{flex:1,padding:'8px',background:'rgba(26,44,62,0.05)',border:'1px solid rgba(26,44,62,0.1)',borderRadius:'7px',cursor:'pointer',fontSize:'11px',fontWeight:600,color:'#1a2c3e',fontFamily:'inherit'}}>
                  Historical Trends
                </button>
                <Link href="/investment-analysis?tab=benchmark" style={{flex:1,padding:'8px',background:'rgba(46,204,113,0.06)',border:'1px solid rgba(46,204,113,0.2)',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:600,color:'#2ecc71',textAlign:'center',display:'block'}}>
                  Compare Countries
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* WIDGET 4: Sector Attractiveness Matrix — Full width */}
        <div className="card" style={{marginBottom:'16px'}}>
          <div className="widget-header">
            <div className="widget-title"><Target size={13} color="#2ecc71"/> Sector Attractiveness Matrix</div>
            <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
              <span style={{fontSize:'11px',color:'#7f8c8d'}}>Y: Opportunity Score · X: Country Readiness · Size: Investment Volume</span>
            </div>
          </div>
          <div style={{padding:'16px 20px',display:'flex',gap:'24px',alignItems:'flex-start'}}>
            <div style={{flex:'0 0 340px'}}>
              <SectorMatrix hoverSector={hoverSector} setHoverSector={setHoverSector}/>
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginTop:'12px'}}>
                {SECTORS.map(s=>(
                  <div key={s.name} style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'10px',padding:'3px 8px',borderRadius:'12px',background:`${s.color}12`,border:`1px solid ${s.color}30`,cursor:'pointer'}}
                    onMouseEnter={()=>setHoverSector(s.name)} onMouseLeave={()=>setHoverSector('')}>
                    <div style={{width:'7px',height:'7px',borderRadius:'50%',background:s.color}}/>
                    <span style={{color:'#2c3e50',fontWeight:500}}>{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Detail panel */}
            <div style={{flex:1}}>
              {hoverSector ? (()=>{
                const s=SECTORS.find(x=>x.name===hoverSector)!;
                return (
                  <div style={{padding:'20px',background:`${s.color}08`,borderRadius:'12px',border:`1px solid ${s.color}20`}}>
                    <div style={{fontSize:'18px',fontWeight:900,color:'#1a2c3e',marginBottom:'4px'}}>{s.name}</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginTop:'12px'}}>
                      {[['Opportunity Score',s.y+'/100'],['Country Readiness',s.x+'/100'],['Investment (12mo)',s.inv],['Market Position','Top Tier']].map(([l,v])=>(
                        <div key={l} style={{padding:'10px 14px',background:'white',borderRadius:'8px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
                          <div style={{fontSize:'10px',color:'#7f8c8d',marginBottom:'2px',textTransform:'uppercase',letterSpacing:'0.05em'}}>{l}</div>
                          <div style={{fontSize:'16px',fontWeight:800,color:s.color,fontFamily:"'JetBrains Mono',monospace"}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })() : (
                <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e',marginBottom:'4px'}}>Top Sector Opportunities</div>
                  {SECTORS.slice(0,4).map(s=>(
                    <div key={s.name} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 14px',borderRadius:'10px',background:'rgba(26,44,62,0.02)',border:'1px solid rgba(26,44,62,0.07)'}}>
                      <div style={{width:'10px',height:'10px',borderRadius:'50%',background:s.color,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'12px',fontWeight:700,color:'#1a2c3e'}}>{s.name}</div>
                        <div style={{height:'4px',background:'rgba(26,44,62,0.06)',borderRadius:'2px',marginTop:'4px'}}>
                          <div style={{height:'100%',width:`${s.y}%`,background:s.color,borderRadius:'2px'}}/>
                        </div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontSize:'13px',fontWeight:800,color:s.color,fontFamily:"'JetBrains Mono',monospace"}}>{s.y}</div>
                        <div style={{fontSize:'10px',color:'#7f8c8d'}}>{s.inv}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{padding:'0 20px 14px',display:'flex',gap:'8px',flexWrap:'wrap'}}>
            {['Region: All','Investment Size: All','Sector Category: All'].map(f=>(
              <select key={f} style={{padding:'6px 10px',border:'1px solid rgba(26,44,62,0.1)',borderRadius:'7px',fontSize:'11px',fontFamily:'inherit',background:'white',color:'#1a2c3e',outline:'none',cursor:'pointer'}}>
                <option>{f}</option>
              </select>
            ))}
          </div>
        </div>

        {/* WIDGET 5: Special Investment Zones */}
        <div className="card" style={{marginBottom:'16px'}}>
          <div className="widget-header">
            <div className="widget-title">🏭 Special Investment Zones Map</div>
            <div style={{display:'flex',gap:'8px'}}>
              <button className="btn-ghost">View All Zones</button>
              <button className="btn-ghost">Compare Zones</button>
              <Link href="/reports" style={{padding:'6px 12px',background:'#2ecc71',color:'#0f1e2a',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:700}}>
                Generate Zone Report → PDF
              </Link>
            </div>
          </div>
          <div style={{padding:'16px 20px',display:'flex',flexDirection:'column',gap:'10px'}}>
            {ZONES.map(z=>{
              const occColor=z.occ>=80?'#e74c3c':z.occ>=60?'#f1c40f':'#2ecc71';
              const availStatus=z.occ<=40?{l:'Very High',c:'#2ecc71'}:z.occ<=65?{l:'High',c:'#3498db'}:z.occ<=80?{l:'Medium',c:'#f1c40f'}:{l:'Low',c:'#e74c3c'};
              return (
                <div key={z.name} style={{padding:'14px 16px',borderRadius:'12px',background:'rgba(26,44,62,0.02)',border:'1px solid rgba(26,44,62,0.07)',display:'grid',gridTemplateColumns:'1fr auto auto',gap:'16px',alignItems:'center'}}>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                      <span style={{fontSize:'16px'}}>{z.flag}</span>
                      <div>
                        <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e'}}>{z.name}</div>
                        <div style={{fontSize:'11px',color:'#7f8c8d'}}>{z.country} · {z.infra} Infrastructure · {z.incentive}</div>
                      </div>
                      <span style={{fontSize:'9px',fontWeight:800,padding:'2px 8px',borderRadius:'10px',background:`${availStatus.c}15`,color:availStatus.c,border:`1px solid ${availStatus.c}30`,marginLeft:'4px'}}>
                        {availStatus.l} Availability
                      </span>
                    </div>
                    <div style={{fontSize:'11px',color:'#7f8c8d'}}>Tenants: {z.tenants}</div>
                  </div>
                  <div style={{textAlign:'center',minWidth:'100px'}}>
                    <div style={{fontSize:'11px',color:'#7f8c8d',marginBottom:'4px'}}>Occupancy</div>
                    <div style={{height:'6px',width:'100px',background:'rgba(26,44,62,0.08)',borderRadius:'3px'}}>
                      <div style={{height:'100%',width:`${z.occ}%`,background:occColor,borderRadius:'3px'}}/>
                    </div>
                    <div style={{fontSize:'12px',fontWeight:800,color:occColor,marginTop:'3px',fontFamily:"'JetBrains Mono',monospace"}}>{z.occ}%</div>
                  </div>
                  <div style={{textAlign:'center',minWidth:'80px'}}>
                    <div style={{fontSize:'11px',color:'#7f8c8d',marginBottom:'2px'}}>Available</div>
                    <div style={{fontSize:'18px',fontWeight:900,color:'#2ecc71',fontFamily:"'JetBrains Mono',monospace"}}>{z.avail}</div>
                    <div style={{fontSize:'10px',color:'#7f8c8d'}}>hectares</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* WIDGET 6: Policy & Incentives */}
        <div className="card" style={{marginBottom:'16px'}}>
          <div className="widget-header">
            <div className="widget-title">📋 Policy & Incentives Widget</div>
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
              {['Country: All','Sector: All','Status: Active'].map(f=>(
                <select key={f} style={{padding:'5px 10px',border:'1px solid rgba(26,44,62,0.1)',borderRadius:'7px',fontSize:'11px',background:'white',color:'#1a2c3e',outline:'none',cursor:'pointer',fontFamily:'inherit'}}>
                  <option>{f}</option>
                </select>
              ))}
              <Link href="/signals" style={{padding:'6px 12px',background:'rgba(26,44,62,0.06)',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:600,color:'#1a2c3e'}}>View All Policies</Link>
            </div>
          </div>
          <div style={{padding:'16px 20px',display:'flex',flexDirection:'column',gap:'10px'}}>
            {POLICIES.map(p=>(
              <div key={p.title} style={{padding:'14px 16px',borderRadius:'12px',border:`1px solid ${p.color}20`,background:`${p.color}04`,borderLeft:`4px solid ${p.color}`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px'}}>
                  <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
                    <span style={{fontSize:'9px',fontWeight:800,padding:'2px 8px',borderRadius:'10px',background:`${p.color}18`,color:p.color}}>{p.status}</span>
                    <span style={{fontSize:'13px'}}>{p.flag}</span>
                    <span style={{fontSize:'12px',fontWeight:700,color:'#1a2c3e'}}>{p.title}</span>
                    <span style={{fontSize:'10px',color:'#7f8c8d'}}>· {p.country} · {p.sector}</span>
                  </div>
                  <span style={{fontSize:'10px',color:'#7f8c8d',flexShrink:0}}>Valid: {p.valid}</span>
                </div>
                <div style={{fontSize:'12px',color:'#2c3e50',lineHeight:'1.6',marginBottom:'8px'}}>{p.body}</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:'10px',color:'#7f8c8d'}}>Source: {p.source}</span>
                  <button style={{fontSize:'11px',fontWeight:600,color:p.color,background:`${p.color}10`,border:`1px solid ${p.color}30`,borderRadius:'6px',padding:'4px 10px',cursor:'pointer',fontFamily:'inherit'}}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WIDGET 7: Investment Signals Feed */}
        <div className="card" style={{marginBottom:'16px'}}>
          <div className="widget-header">
            <div className="widget-title">
              <Zap size={13} color="#2ecc71"/>
              Investment Signals Feed
              <span style={{fontSize:'10px',fontWeight:600,color:'rgba(46,204,113,0.7)',background:'rgba(46,204,113,0.1)',padding:'2px 7px',borderRadius:'10px'}}>WebSocket · Live</span>
            </div>
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap',alignItems:'center'}}>
              {['ALL','POLICY CHANGE','NEW INCENTIVE','SECTOR GROWTH','ZONE AVAILABILITY'].map(f=>(
                <button key={f} onClick={()=>setSigFilter(f)}
                  style={{padding:'4px 10px',border:'none',borderRadius:'14px',cursor:'pointer',fontSize:'9px',fontWeight:800,letterSpacing:'0.04em',
                    background:sigFilter===f?'#1a2c3e':'rgba(26,44,62,0.07)',
                    color:sigFilter===f?'white':'#7f8c8d',transition:'all 0.15s'}}>
                  {f}
                </button>
              ))}
              <Link href="/signals" style={{fontSize:'11px',color:'#2ecc71',fontWeight:700,textDecoration:'none',display:'flex',alignItems:'center',gap:'2px'}}>View All <ExternalLink size={10}/></Link>
            </div>
          </div>
          <div style={{padding:'16px 20px',display:'flex',flexDirection:'column',gap:'8px'}}>
            {filtSigs.slice(0,5).map((s)=>(
              <div key={s.id} className={`signal-card ${s.cls}`} style={{animation:'fadeInUp 0.3s ease'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'5px'}}>
                  <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
                    <span style={{fontSize:'9px',fontWeight:800,padding:'2px 8px',borderRadius:'10px',background:`${s.color}15`,color:s.color}}>{s.type}</span>
                    <span style={{fontSize:'14px'}}>{s.flag}</span>
                    <span style={{fontSize:'12px',fontWeight:700,color:'#1a2c3e'}}>{s.eco}</span>
                  </div>
                  <div style={{display:'flex',gap:'8px',alignItems:'center',flexShrink:0}}>
                    <span style={{fontSize:'9px',fontWeight:800,padding:'2px 7px',borderRadius:'8px',background:(impactC[s.impact]||'#7f8c8d')+'15',color:impactC[s.impact]||'#7f8c8d'}}>
                      {s.impact}
                    </span>
                    <span style={{fontSize:'10px',color:'#7f8c8d'}}>{s.time}</span>
                  </div>
                </div>
                <div style={{fontSize:'13px',fontWeight:600,color:'#1a2c3e',marginBottom:'4px'}}>{s.title}</div>
                <div style={{fontSize:'11px',color:'#7f8c8d',lineHeight:'1.55',marginBottom:'6px'}}>
                  <span style={{fontWeight:600,color:'#2c3e50'}}>Strategic: </span>{s.implication}
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:'10px',color:'#7f8c8d'}}>Source: {s.source}</span>
                  <button style={{fontSize:'11px',fontWeight:600,color:s.color,background:`${s.color}10`,border:'none',borderRadius:'6px',padding:'4px 10px',cursor:'pointer',fontFamily:'inherit'}}>View Signal Details</button>
                </div>
              </div>
            ))}
          </div>
          {/* Subscribe */}
          <div style={{padding:'14px 20px',borderTop:'1px solid rgba(26,44,62,0.06)',display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap'}}>
            <span style={{fontSize:'12px',color:'#7f8c8d'}}>Subscribe to signals:</span>
            <input type="email" placeholder="your@organisation.com" style={{flex:1,minWidth:'200px',padding:'7px 12px',border:'1px solid rgba(26,44,62,0.12)',borderRadius:'7px',fontSize:'12px',fontFamily:'inherit',outline:'none'}}/>
            <button style={{padding:'7px 16px',background:'#1a2c3e',color:'white',border:'none',borderRadius:'7px',cursor:'pointer',fontSize:'12px',fontWeight:700,fontFamily:'inherit'}}>Subscribe</button>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div style={{background:'#1a2c3e',borderRadius:'14px',padding:'16px 24px',display:'flex',gap:'12px',flexWrap:'wrap',alignItems:'center',justifyContent:'center',border:'1px solid rgba(46,204,113,0.1)'}}>
          <span style={{fontSize:'12px',fontWeight:700,color:'rgba(255,255,255,0.6)',marginRight:'8px'}}>QUICK ACTIONS</span>
          {[
            {l:'Go to Investment Analysis',h:'/investment-analysis',primary:true},
            {l:'Generate PDF Report',h:'/reports',primary:false},
            {l:'Compare Countries',h:'/investment-analysis?tab=benchmark',primary:false},
            {l:'Export Dashboard Data',h:'/signals',primary:false},
          ].map(({l,h,primary})=>(
            <Link key={l} href={h}
              style={{padding:'9px 18px',background:primary?'#2ecc71':'rgba(255,255,255,0.08)',color:primary?'#0f1e2a':'rgba(255,255,255,0.8)',
                border:primary?'none':'1px solid rgba(255,255,255,0.12)',borderRadius:'8px',textDecoration:'none',
                fontSize:'12px',fontWeight:primary?800:600,transition:'all 0.2s'}}>
              {l}
            </Link>
          ))}
        </div>

      </div>
      <Footer/>
    </div>
  );
}
