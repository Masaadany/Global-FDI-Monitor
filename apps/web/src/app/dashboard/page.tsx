'use client';
import { useState, useEffect, useRef } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ScrollableSelect from '@/components/ScrollableSelect';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Zap, Globe, Shield, Target, BarChart3, Activity, Bell, Settings, Download, RefreshCw, Filter } from 'lucide-react';

// ══════ DATA ══════════════════════════════════════════════════════
const ECONOMIES = [
  {id:'SGP',code:'SG',name:'Singapore',    gosa:88.4,trend:+0.2,fdi:'$91B', category:'TOP',  region:'Asia Pacific',  dot:{x:73,y:46},color:'#2ECC71'},
  {id:'NZL',code:'NZ',name:'New Zealand',  gosa:86.7,trend:-0.1,fdi:'$9B',  category:'TOP',  region:'Oceania',       dot:{x:84,y:74},color:'#2ECC71'},
  {id:'DNK',code:'DK',name:'Denmark',      gosa:85.3,trend:+0.3,fdi:'$22B', category:'TOP',  region:'Europe',        dot:{x:49,y:24},color:'#2ECC71'},
  {id:'KOR',code:'KR',name:'South Korea',  gosa:84.1,trend:+0.1,fdi:'$17B', category:'TOP',  region:'Asia Pacific',  dot:{x:78,y:34},color:'#2ECC71'},
  {id:'AUS',code:'AU',name:'Australia',    gosa:82.8,trend:+0.1,fdi:'$68B', category:'TOP',  region:'Oceania',       dot:{x:77,y:68},color:'#2ECC71'},
  {id:'USA',code:'US',name:'United States',gosa:83.9,trend:-0.2,fdi:'$349B',category:'TOP',  region:'Americas',      dot:{x:18,y:35},color:'#2ECC71'},
  {id:'GBR',code:'GB',name:'United Kingdom',gosa:82.5,trend:-0.1,fdi:'$50B',category:'TOP',  region:'Europe',        dot:{x:46,y:26},color:'#2ECC71'},
  {id:'ARE',code:'AE',name:'UAE',          gosa:82.1,trend:+1.2,fdi:'$23B', category:'TOP',  region:'Middle East',   dot:{x:57,y:41},color:'#2ECC71'},
  {id:'FRA',code:'FR',name:'France',       gosa:81.6,trend:+0.2,fdi:'$40B', category:'TOP',  region:'Europe',        dot:{x:47,y:28},color:'#2ECC71'},
  {id:'MYS',code:'MY',name:'Malaysia',     gosa:81.2,trend:+0.4,fdi:'$22B', category:'HIGH', region:'Asia Pacific',  dot:{x:70,y:46},color:'#3498DB'},
  {id:'THA',code:'TH',name:'Thailand',     gosa:80.7,trend:+0.2,fdi:'$14B', category:'HIGH', region:'Asia Pacific',  dot:{x:69,y:43},color:'#3498DB'},
  {id:'VNM',code:'VN',name:'Vietnam',      gosa:79.4,trend:+0.5,fdi:'$24B', category:'HIGH', region:'Asia Pacific',  dot:{x:71,y:41},color:'#3498DB'},
  {id:'SAU',code:'SA',name:'Saudi Arabia', gosa:79.1,trend:+2.1,fdi:'$36B', category:'HIGH', region:'Middle East',   dot:{x:55,y:43},color:'#3498DB'},
  {id:'IDN',code:'ID',name:'Indonesia',    gosa:77.8,trend:+0.1,fdi:'$22B', category:'HIGH', region:'Asia Pacific',  dot:{x:72,y:52},color:'#3498DB'},
  {id:'IND',code:'IN',name:'India',        gosa:73.2,trend:+0.8,fdi:'$71B', category:'HIGH', region:'Asia Pacific',  dot:{x:65,y:40},color:'#3498DB'},
  {id:'BRA',code:'BR',name:'Brazil',       gosa:71.3,trend:+0.4,fdi:'$74B', category:'HIGH', region:'Americas',      dot:{x:26,y:58},color:'#F1C40F'},
  {id:'MAR',code:'MA',name:'Morocco',      gosa:66.8,trend:+0.6,fdi:'$4B',  category:'HIGH', region:'Africa',        dot:{x:44,y:41},color:'#F1C40F'},
  {id:'CHN',code:'CN',name:'China',        gosa:64.2,trend:-0.4,fdi:'$163B',category:'HIGH', region:'Asia Pacific',  dot:{x:73,y:35},color:'#F1C40F'},
  {id:'DEU',code:'DE',name:'Germany',      gosa:83.1,trend:-0.2,fdi:'$40B', category:'TOP',  region:'Europe',        dot:{x:50,y:25},color:'#2ECC71'},
  {id:'JPN',code:'JP',name:'Japan',        gosa:81.4,trend:+0.2,fdi:'$30B', category:'TOP',  region:'Asia Pacific',  dot:{x:80,y:32},color:'#2ECC71'},
];

const DB_INDICATORS = [
  {ind:'Starting a Business',   score:82.3,avg:72.4},
  {ind:'Construction Permits',  score:74.8,avg:67.1},
  {ind:'Getting Electricity',   score:87.2,avg:78.6},
  {ind:'Registering Property',  score:71.4,avg:61.8},
  {ind:'Getting Credit',        score:75.0,avg:65.4},
  {ind:'Protecting Investors',  score:81.8,avg:71.2},
  {ind:'Paying Taxes',          score:78.6,avg:64.8},
  {ind:'Trading Across Borders',score:82.4,avg:74.2},
  {ind:'Enforcing Contracts',   score:72.1,avg:58.4},
  {ind:'Resolving Insolvency',  score:82.4,avg:61.6},
];

const SECTORS_RADAR = [
  {name:'EV Battery',   scores:[88,92,76,84,90],color:'#2ECC71',hot:true},
  {name:'Data Centers', scores:[84,88,92,86,78],color:'#3498DB',hot:true},
  {name:'Renewables',   scores:[82,76,88,72,94],color:'#F1C40F',hot:false},
];

const POLICIES = [
  {code:'MY',country:'Malaysia',   policy:'100% FDI in data centers',         status:'NEW',   date:'Mar 2026'},
  {code:'AE',country:'UAE',        policy:'100% mainland foreign ownership',   status:'ACTIVE',date:'Feb 2026'},
  {code:'TH',country:'Thailand',   policy:'$2B EV battery subsidy package',    status:'NEW',   date:'Mar 2026'},
  {code:'VN',country:'Vietnam',    policy:'50% CIT reduction EV manufacturing',status:'ACTIVE',date:'Jan 2026'},
  {code:'SA',country:'Saudi Arabia','policy':'30-day FDI license guarantee',    status:'NEW',   date:'Mar 2026'},
  {code:'IN',country:'India',      policy:'PLI Scheme 2.0 — $2.7B incentives', status:'NEW',   date:'Mar 2026'},
];

const LIVE_SIGNALS = [
  {id:1,grade:'PLATINUM',type:'POLICY',  code:'MY',country:'Malaysia',   title:'FDI cap raised to 100% in data centers',      sco:96,impact:'HIGH',ts:'2m'},
  {id:2,grade:'PLATINUM',type:'DEAL',    code:'AE',country:'UAE',         title:'Microsoft $3.3B AI infrastructure committed',  sco:97,impact:'HIGH',ts:'1h'},
  {id:3,grade:'PLATINUM',type:'INCENTIVE',code:'TH',country:'Thailand',  title:'$2B EV battery subsidy approved',               sco:95,impact:'HIGH',ts:'3h'},
  {id:4,grade:'GOLD',    type:'POLICY',  code:'SA',country:'Saudi Arabia','title':'30-day FDI license guarantee live',            sco:94,impact:'HIGH',ts:'6h'},
  {id:5,grade:'GOLD',    type:'GROWTH',  code:'VN',country:'Vietnam',     title:'Electronics exports surge 34% YoY',             sco:92,impact:'MED', ts:'1d'},
  {id:6,grade:'GOLD',    type:'ZONE',    code:'ID',country:'Indonesia',   title:'New Batam zone — 200ha greenfield ready',       sco:91,impact:'MED', ts:'2d'},
  {id:7,grade:'GOLD',    type:'GROWTH',  code:'IN',country:'India',       title:'Apple commits $10B manufacturing expansion',    sco:89,impact:'HIGH',ts:'3d'},
];

function sc(v:number){return v>=80?'#2ECC71':v>=60?'#3498DB':'#F1C40F';}

// ══════ MINI RADAR ════════════════════════════════════════════════
function RadarMini({datasets,size=120}:{datasets:{scores:number[],color:string}[],size?:number}){
  const n=5,cx=size/2,cy=size/2,r=size*0.38;
  function pt(i:number,v:number){const a=(Math.PI*2*i/n)-Math.PI/2;return{x:cx+(v/100)*r*Math.cos(a),y:cy+(v/100)*r*Math.sin(a)};}
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[25,50,75,100].map(l=>{const ps=Array.from({length:n},(_,i)=>pt(i,l));return <polygon key={l} points={ps.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke="#ECF0F1" strokeWidth="0.8"/>;
      })}
      {Array.from({length:n},(_,i)=>{const p=pt(i,100);return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#ECF0F1" strokeWidth="0.8"/>;
      })}
      {datasets.map((ds,di)=>{
        const pts=ds.scores.map((v,i)=>pt(i,v));
        return <g key={di}><polygon points={pts.map(p=>`${p.x},${p.y}`).join(' ')} fill={ds.color+'18'} stroke={ds.color} strokeWidth="1.5"/>{pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="2.5" fill={ds.color}/>)}</g>;
      })}
      {['Reg','Inc','Lab','Inf','Exp'].map((l,i)=>{const p=pt(i,120);return <text key={l} x={p.x} y={p.y} fontSize="7" fill="#5A6874" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter,sans-serif">{l}</text>;})}
    </svg>
  );
}

// ══════ INTERACTIVE SVG WORLD MAP ═════════════════════════════════
function WorldMap({economies,selected,onSelect,highlight}:{economies:typeof ECONOMIES,selected:string|null,onSelect:(id:string)=>void,highlight:string[]}){
  const [hovered,setHovered]=useState<string|null>(null);

  const visible = highlight.length>0 ? economies.filter(e=>highlight.includes(e.id)) : economies;

  return(
    <div style={{position:'relative',width:'100%',aspectRatio:'2/1',background:'linear-gradient(180deg,#EBF5FF 0%,#E0EEF8 100%)',borderRadius:'14px',overflow:'hidden',border:'1px solid #DCE9F3'}}>
      <svg viewBox="0 0 100 55" style={{width:'100%',height:'100%',display:'block'}} preserveAspectRatio="xMidYMid meet">
        {/* Grid */}
        {[0,10,20,30,40,50].map(y=><line key={'h'+y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(0,80,140,0.05)" strokeWidth="0.3"/>)}
        {[0,10,20,30,40,50,60,70,80,90,100].map(x=><line key={'v'+x} x1={x} y1="0" x2={x} y2="55" stroke="rgba(0,80,140,0.05)" strokeWidth="0.3"/>)}

        {/* Continents — simplified shapes */}
        {/* North America */}
        <path d="M5,12 L22,12 L28,18 L26,28 L22,35 L18,38 L12,35 L8,28 L5,20 Z" fill="rgba(26,44,62,0.06)" stroke="rgba(26,44,62,0.12)" strokeWidth="0.3"/>
        {/* South America */}
        <path d="M18,40 L28,38 L32,42 L30,54 L24,55 L18,50 Z" fill="rgba(26,44,62,0.06)" stroke="rgba(26,44,62,0.12)" strokeWidth="0.3"/>
        {/* Europe */}
        <path d="M40,14 L58,14 L58,22 L54,26 L46,26 L40,22 Z" fill="rgba(26,44,62,0.06)" stroke="rgba(26,44,62,0.12)" strokeWidth="0.3"/>
        {/* Africa */}
        <path d="M42,26 L56,26 L58,34 L56,48 L46,50 L40,42 L40,32 Z" fill="rgba(26,44,62,0.06)" stroke="rgba(26,44,62,0.12)" strokeWidth="0.3"/>
        {/* Middle East */}
        <path d="M52,28 L66,28 L66,36 L56,38 L52,34 Z" fill="rgba(26,44,62,0.06)" stroke="rgba(26,44,62,0.12)" strokeWidth="0.3"/>
        {/* Asia */}
        <path d="M58,10 L90,10 L92,16 L88,22 L84,28 L74,32 L64,30 L60,26 L58,18 Z" fill="rgba(26,44,62,0.06)" stroke="rgba(26,44,62,0.12)" strokeWidth="0.3"/>
        {/* SE Asia */}
        <path d="M68,36 L80,34 L82,42 L76,48 L68,46 L66,40 Z" fill="rgba(26,44,62,0.06)" stroke="rgba(26,44,62,0.12)" strokeWidth="0.3"/>
        {/* Australia */}
        <path d="M72,56 L90,54 L92,66 L84,70 L72,68 Z" fill="rgba(26,44,62,0.06)" stroke="rgba(26,44,62,0.12)" strokeWidth="0.3"/>

        {/* Region labels */}
        {[{x:14,y:22,l:'AMERICAS'},{x:48,y:16,l:'EUROPE'},{x:62,y:18,l:'ASIA PACIFIC'},{x:48,y:40,l:'AFRICA'},{x:57,y:34,l:'MIDDLE EAST'},{x:80,y:63,l:'OCEANIA'}].map(({x,y,l})=>(
          <text key={l} x={x} y={y} textAnchor="middle" fontSize="2.4" fill="rgba(26,44,62,0.2)" fontFamily="Inter,sans-serif" fontWeight="700" letterSpacing="0.1em">{l}</text>
        ))}

        {/* Country dots */}
        {visible.map(eco=>{
          const isSelected=selected===eco.id;
          const isHovered=hovered===eco.id;
          const active=isSelected||isHovered;
          // Scale dots to map viewBox (x: 0-100, y: 0-55)
          const mx=eco.dot.x;
          const my=(eco.dot.y/100)*55;
          const r=active?5:3;
          return(
            <g key={eco.id} style={{cursor:'pointer'}} onClick={()=>onSelect(eco.id)} onMouseEnter={()=>setHovered(eco.id)} onMouseLeave={()=>setHovered(null)}>
              {/* Pulse ring */}
              <circle cx={mx} cy={my} r={r+2} fill={eco.color+'15'} stroke={eco.color+'30'} strokeWidth="0.5">
                {active && <animate attributeName="r" values={`${r+2};${r+5};${r+2}`} dur="1.5s" repeatCount="indefinite"/>}
                {active && <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1.5s" repeatCount="indefinite"/>}
              </circle>
              {/* Main dot */}
              <circle cx={mx} cy={my} r={isSelected?4.5:active?3.5:2.8} fill={isSelected?eco.color:eco.color+'CC'} stroke="white" strokeWidth={isSelected?1.2:0.6}
                style={{filter:active?`drop-shadow(0 0 ${isSelected?5:3}px ${eco.color})`:'none',transition:'r 0.2s'}}/>
              {/* GOSA label on hover/select */}
              {active && (
                <g>
                  <rect x={mx-6} y={my-8.5} width="12" height="6.5" fill="white" stroke={eco.color} strokeWidth="0.3" rx="1.2" style={{filter:'drop-shadow(0 1px 3px rgba(0,0,0,0.15))'}}/>
                  <text x={mx} y={my-4.5} textAnchor="middle" fontSize="2" fill="#1A2C3E" fontWeight="800" fontFamily="Inter,sans-serif">{eco.name}</text>
                  <text x={mx} y={my-2.2} textAnchor="middle" fontSize="1.8" fill={eco.color} fontWeight="700" fontFamily="JetBrains Mono,monospace">{eco.gosa}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div style={{position:'absolute',bottom:'10px',left:'50%',transform:'translateX(-50%)',display:'flex',gap:'12px',background:'rgba(255,255,255,0.9)',backdropFilter:'blur(6px)',padding:'5px 14px',borderRadius:'20px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',border:'1px solid rgba(0,0,0,0.06)'}}>
        {[['#2ECC71','TOP (≥80)'],['#3498DB','HIGH (60-79)'],['#F1C40F','DEV (<60)']].map(([c,l])=>(
          <div key={l} style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'10px',color:'#5A6874',fontWeight:600}}>
            <div style={{width:'8px',height:'8px',borderRadius:'50%',background:c as string}}/>
            {l}
          </div>
        ))}
        <div style={{borderLeft:'1px solid #ECF0F1',paddingLeft:'12px',fontSize:'10px',color:'#C8D0D6',display:'flex',alignItems:'center',gap:'4px'}}>
          <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#2ECC71',boxShadow:'0 0 6px #2ECC71'}}/>
          Click dot to select
        </div>
      </div>
      {/* Live indicator */}
      <div style={{position:'absolute',top:'10px',right:'12px',display:'flex',alignItems:'center',gap:'5px',background:'rgba(255,255,255,0.9)',backdropFilter:'blur(6px)',padding:'4px 10px',borderRadius:'20px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',border:'1px solid rgba(0,0,0,0.06)'}}>
        <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#2ECC71',animation:'pulseGreen 2s infinite'}}/>
        <span style={{fontSize:'10px',fontWeight:700,color:'#27ae60'}}>LIVE</span>
        <span style={{fontSize:'10px',color:'#C8D0D6'}}>{ECONOMIES.length} economies</span>
      </div>
    </div>
  );
}

// ══════ MAIN DASHBOARD ════════════════════════════════════════════
export default function Dashboard(){
  const [selId,setSelId]=useState<string|null>('SGP');
  const [signals,setSignals]=useState(LIVE_SIGNALS);
  const [time,setTime]=useState(new Date());
  const [lastRefresh,setLastRefresh]=useState(new Date());

  // LEFT PANEL FILTERS
  const [filterCategory,setFilterCategory]=useState('ALL');
  const [filterRegion,setFilterRegion]=useState('ALL');
  const [filterSector,setFilterSector]=useState('ALL');
  const [filterGrade,setFilterGrade]=useState('ALL');

  // RIGHT PANEL FILTERS
  const [signalType,setSignalType]=useState('ALL');
  const [signalImpact,setSignalImpact]=useState('ALL');

  useEffect(()=>{
    const iv=setInterval(()=>{
      setTime(new Date());
      if(Math.random()>0.6){
        const eco=ECONOMIES[Math.floor(Math.random()*6)];
        setSignals(p=>[{id:Date.now(),grade:'GOLD',type:'GROWTH',code:eco.code,country:eco.name,title:'New signal detected — scoring in progress',sco:70+Math.floor(Math.random()*20),impact:'MED',ts:'now'},...p.slice(0,9)]);
        setLastRefresh(new Date());
      }
    },4000);
    return ()=>clearInterval(iv);
  },[]);

  const selEco=ECONOMIES.find(e=>e.id===selId)||ECONOMIES[0];

  // Filter economies
  const filteredEcos=ECONOMIES.filter(e=>{
    if(filterCategory!=='ALL'&&e.category!==filterCategory)return false;
    if(filterRegion!=='ALL'&&e.region!==filterRegion)return false;
    return true;
  });

  const highlightIds=filteredEcos.map(e=>e.id);

  // Filter signals
  const filteredSignals=signals.filter(s=>{
    if(filterGrade!=='ALL'&&s.grade!==filterGrade)return false;
    if(signalType!=='ALL'&&s.type!==signalType)return false;
    if(signalImpact!=='ALL'&&s.impact!==signalImpact)return false;
    return true;
  });

  const categoryOpts=[{value:'ALL',label:'All Categories'},{value:'TOP',label:'TOP (≥80)'},{value:'HIGH',label:'HIGH (60-79)'},{value:'DEV',label:'DEV (<60)'}];
  const regionOpts=[{value:'ALL',label:'All Regions'},...Array.from(new Set(ECONOMIES.map(e=>e.region))).map(r=>({value:r,label:r}))];
  const sectorOpts=[{value:'ALL',label:'All Sectors'},{value:'EV Battery',label:'EV Battery'},{value:'Data Centers',label:'Data Centers'},{value:'Renewables',label:'Renewables'},{value:'Semiconductors',label:'Semiconductors'},{value:'AI Tech',label:'AI & Technology'}];
  const gradeOpts=[{value:'ALL',label:'All Grades'},{value:'PLATINUM',label:'PLATINUM'},{value:'GOLD',label:'GOLD'},{value:'SILVER',label:'SILVER'}];
  const typeOpts=[{value:'ALL',label:'All Types'},{value:'POLICY',label:'Policy'},{value:'DEAL',label:'Deal'},{value:'INCENTIVE',label:'Incentive'},{value:'GROWTH',label:'Growth'},{value:'ZONE',label:'Zone'}];
  const impactOpts=[{value:'ALL',label:'All Impact'},{value:'HIGH',label:'HIGH'},{value:'MED',label:'MED'},{value:'LOW',label:'LOW'}];

  const CardW=({children,style={}}:{children:any,style?:any})=>(
    <div style={{background:'#FFFFFF',borderRadius:'14px',boxShadow:'0 4px 16px rgba(0,0,0,0.06)',border:'1px solid #ECF0F1',overflow:'hidden',...style}}>{children}</div>
  );

  const PanelHeader=({icon,title,badge,extra}:{icon:any,title:string,badge?:string,extra?:any})=>(
    <div style={{padding:'11px 14px',borderBottom:'1px solid #F8F9FA',display:'flex',alignItems:'center',gap:'8px',background:'#FAFBFC',flexShrink:0}}>
      <span style={{color:'#2ECC71',display:'flex'}}>{icon}</span>
      <span style={{fontSize:'11px',fontWeight:800,color:'#1A2C3E',letterSpacing:'0.06em',textTransform:'uppercase',flex:1,fontFamily:"'Inter',sans-serif"}}>{title}</span>
      {badge&&<span style={{fontSize:'9px',fontWeight:800,padding:'2px 8px',borderRadius:'20px',background:'rgba(46,204,113,0.1)',color:'#27ae60',border:'1px solid rgba(46,204,113,0.2)',letterSpacing:'0.05em'}}>{badge}</span>}
      {extra}
    </div>
  );

  return(
    <div style={{minHeight:'100vh',background:'#F0F2F5',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>

      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <div style={{background:'#FFFFFF',borderBottom:'1px solid #ECF0F1',padding:'10px 20px',position:'sticky',top:'64px',zIndex:200,boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
        <div style={{maxWidth:'1920px',margin:'0 auto',display:'flex',alignItems:'center',gap:'14px',flexWrap:'wrap'}}>
          <div style={{flex:1}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'#C8D0D6',textTransform:'uppercase',letterSpacing:'0.1em'}}>Intelligence Dashboard</div>
            <div style={{fontSize:'18px',fontWeight:900,color:'#1A2C3E',lineHeight:1.1}}>Global FDI Monitor — Live Operations</div>
          </div>
          {/* KPI chips */}
          {[
            ['🌍',filteredEcos.length+' Economies','#2ECC71'],
            ['⚡',filteredSignals.length+' Signals','#3498DB'],
            ['🏆',filteredEcos.filter(e=>e.category==='TOP').length+' TOP Category','#F1C40F'],
          ].map(([icon,label,c])=>(
            <div key={String(label)} style={{display:'flex',alignItems:'center',gap:'5px',padding:'6px 12px',background:`${c}08`,border:`1px solid ${c}20`,borderRadius:'20px',fontSize:'11px',fontWeight:700,color:String(c)}}>
              <span>{icon}</span>{label as string}
            </div>
          ))}
          {/* Live clock */}
          <div style={{padding:'6px 14px',background:'#F8F9FA',borderRadius:'10px',border:'1px solid #ECF0F1',textAlign:'center'}}>
            <div style={{fontSize:'15px',fontWeight:800,color:'#1A2C3E',fontFamily:"'JetBrains Mono',monospace"}}>{time.toLocaleTimeString()}</div>
            <div style={{fontSize:'9px',color:'#5A6874',marginTop:'1px'}}>{time.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase()}</div>
          </div>
          {/* Agent status */}
          {[['AGT-02','SIGNAL','#2ECC71'],['AGT-04','GOSA','#3498DB'],['AGT-05','GFR','#F1C40F']].map(([a,l,c])=>(
            <div key={a} style={{display:'flex',alignItems:'center',gap:'4px',padding:'5px 10px',background:'#F8F9FA',border:'1px solid #ECF0F1',borderRadius:'16px'}}>
              <div style={{width:'5px',height:'5px',borderRadius:'50%',background:c as string,boxShadow:`0 0 5px ${c}`}}/>
              <span style={{fontSize:'10px',fontWeight:700,color:'#5A6874',fontFamily:"'JetBrains Mono',monospace"}}>{a}</span>
            </div>
          ))}
          <Link href="/pipeline-report" style={{display:'flex',alignItems:'center',gap:'5px',padding:'7px 14px',background:'linear-gradient(135deg,#2ECC71,#27ae60)',color:'white',borderRadius:'20px',textDecoration:'none',fontSize:'11px',fontWeight:800,boxShadow:'0 3px 10px rgba(46,204,113,0.3)'}}>
            <BarChart3 size={11}/> Pipeline Report
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          THREE-COLUMN LAYOUT:
          LEFT (280px) | CENTER (flex) | RIGHT (300px)
          ══════════════════════════════════════════════════════════ */}
      <div style={{maxWidth:'1920px',margin:'0 auto',padding:'14px 16px',display:'grid',gridTemplateColumns:'280px 1fr 300px',gap:'12px',alignItems:'start',minHeight:'calc(100vh - 130px)'}}>

        {/* ═══════════════════════════════════════════════════════
            LEFT PANEL — FILTERS + ECONOMY LIST + COUNTRY DETAIL
            ═══════════════════════════════════════════════════════ */}
        <div style={{display:'flex',flexDirection:'column',gap:'10px',position:'sticky',top:'130px'}}>

          {/* Filter Panel */}
          <CardW>
            <PanelHeader icon={<Filter size={13}/>} title="Dashboard Filters" badge={`${filteredEcos.length} SHOWING`}/>
            <div style={{padding:'12px 14px',display:'flex',flexDirection:'column',gap:'10px'}}>
              <ScrollableSelect label="Country Category" value={filterCategory} options={categoryOpts} onChange={setFilterCategory} width="100%" accentColor="#2ECC71"/>
              <ScrollableSelect label="Region" value={filterRegion} options={regionOpts} onChange={setFilterRegion} width="100%" accentColor="#3498DB"/>
              <ScrollableSelect label="Sector Focus" value={filterSector} options={sectorOpts} onChange={setFilterSector} width="100%" accentColor="#F1C40F"/>
              {(filterCategory!=='ALL'||filterRegion!=='ALL'||filterSector!=='ALL') && (
                <button onClick={()=>{setFilterCategory('ALL');setFilterRegion('ALL');setFilterSector('ALL');}}
                  style={{padding:'7px',background:'rgba(231,76,60,0.06)',border:'1px solid rgba(231,76,60,0.15)',borderRadius:'8px',cursor:'pointer',fontSize:'11px',fontWeight:600,color:'#e74c3c',fontFamily:'Inter,sans-serif',width:'100%'}}>
                  Clear All Filters ×
                </button>
              )}
            </div>
          </CardW>

          {/* Top Economies — Lollipop list */}
          <CardW>
            <PanelHeader icon={<Globe size={13}/>} title="Investment Analysis" badge="GOSA"/>
            <div style={{padding:'6px 10px',maxHeight:'320px',overflowY:'auto'}}>
              {filteredEcos.slice(0,12).map((eco,i)=>(
                <div key={eco.id} onClick={()=>setSelId(eco.id)}
                  style={{display:'flex',alignItems:'center',gap:'8px',padding:'7px 6px',borderRadius:'8px',cursor:'pointer',transition:'all 0.15s',background:selId===eco.id?'rgba(46,204,113,0.06)':'transparent',border:selId===eco.id?'1px solid rgba(46,204,113,0.18)':'1px solid transparent',marginBottom:'2px'}}
                  onMouseEnter={e=>{if(selId!==eco.id)e.currentTarget.style.background='#F8F9FA';}}
                  onMouseLeave={e=>{if(selId!==eco.id)e.currentTarget.style.background='transparent';}}>
                  <span style={{fontSize:'9px',fontWeight:700,color:'#C8D0D6',minWidth:'16px',fontFamily:"'JetBrains Mono',monospace"}}>#{i+1}</span>
                  <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${eco.code}.svg`} width="18" height="12" style={{borderRadius:'2px',flexShrink:0,boxShadow:'0 1px 2px rgba(0,0,0,0.1)'}} onError={e=>{(e.target as any).style.display='none';}}/>
                  <span style={{fontSize:'11px',fontWeight:selId===eco.id?700:500,color:selId===eco.id?'#1A2C3E':'#5A6874',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{eco.name}</span>
                  {/* Mini lollipop */}
                  <div style={{width:'40px',height:'4px',background:'#F0F2F4',borderRadius:'2px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${eco.gosa}%`,background:`linear-gradient(90deg,${sc(eco.gosa)}50,${sc(eco.gosa)})`,borderRadius:'2px'}}/>
                  </div>
                  <span style={{fontSize:'12px',fontWeight:900,color:sc(eco.gosa),fontFamily:"'JetBrains Mono',monospace",minWidth:'32px',textAlign:'right'}}>{eco.gosa}</span>
                </div>
              ))}
            </div>
            <div style={{padding:'8px 10px',borderTop:'1px solid #F8F9FA'}}>
              <Link href="/investment-analysis" style={{display:'block',textAlign:'center',padding:'7px',background:'rgba(46,204,113,0.06)',borderRadius:'8px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'#27ae60',border:'1px solid rgba(46,204,113,0.15)'}}>
                Full Investment Analysis →
              </Link>
            </div>
          </CardW>

          {/* Selected Country Detail */}
          <CardW>
            <PanelHeader icon={<BarChart3 size={13}/>} title={selEco.name} badge="GOSA"/>
            <div style={{padding:'12px 14px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px',padding:'10px',background:'#F8F9FA',borderRadius:'10px'}}>
                <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${selEco.code}.svg`} width="36" height="24" style={{borderRadius:'4px',boxShadow:'0 2px 6px rgba(0,0,0,0.1)',flexShrink:0}} onError={e=>{(e.target as any).style.display='none';}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:'12px',color:'#5A6874'}}>{selEco.region}</div>
                  <div style={{fontSize:'10px',padding:'2px 7px',borderRadius:'10px',display:'inline-block',marginTop:'2px',...(selEco.category==='TOP'?{background:'rgba(46,204,113,0.1)',color:'#27ae60'}:{background:'rgba(52,152,219,0.1)',color:'#2980b9'})}}>{selEco.category}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'30px',fontWeight:900,color:sc(selEco.gosa),fontFamily:"'JetBrains Mono',monospace",lineHeight:1}}>{selEco.gosa}</div>
                  <div style={{fontSize:'10px',fontWeight:700,color:selEco.trend>0?'#27ae60':'#e74c3c',display:'flex',alignItems:'center',gap:'2px',justifyContent:'flex-end'}}>
                    {selEco.trend>0?<TrendingUp size={9}/>:<TrendingDown size={9}/>}{selEco.trend>0?'+':''}{selEco.trend}
                  </div>
                </div>
              </div>
              {/* Layer bars */}
              {[['L1 Doing Business',selEco.gosa*1.04,'#2ECC71'],['L2 Sector',selEco.gosa*0.97,'#3498DB'],['L3 Inv. Zones',selEco.gosa*1.01,'#F1C40F'],['L4 Intelligence',selEco.gosa*0.99,'#9b59b6']].map(([l,v,c])=>(
                <div key={String(l)} style={{marginBottom:'7px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'2px'}}>
                    <span style={{fontSize:'10px',color:'#5A6874'}}>{l as string}</span>
                    <span style={{fontSize:'11px',fontWeight:800,color:String(c),fontFamily:"'JetBrains Mono',monospace"}}>{Math.min(100,Math.round(v as number))}</span>
                  </div>
                  <div style={{height:'4px',background:'#F0F2F4',borderRadius:'2px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:Math.min(100,v as number)+'%',background:String(c),borderRadius:'2px'}}/>
                  </div>
                </div>
              ))}
              <div style={{display:'flex',gap:'6px',marginTop:'10px'}}>
                <Link href={'/country/'+selEco.id} style={{flex:1,padding:'7px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(46,204,113,0.2)',borderRadius:'8px',textDecoration:'none',fontSize:'10px',fontWeight:700,color:'#27ae60',textAlign:'center'}}>Profile</Link>
                <Link href="/reports" style={{flex:1,padding:'7px',background:'#F8F9FA',border:'1px solid #ECF0F1',borderRadius:'8px',textDecoration:'none',fontSize:'10px',fontWeight:700,color:'#1A2C3E',textAlign:'center'}}>Report</Link>
              </div>
            </div>
          </CardW>
        </div>

        {/* ═══════════════════════════════════════════════════════
            CENTER PANEL — LARGE WORLD MAP + WIDGETS BELOW
            ═══════════════════════════════════════════════════════ */}
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>

          {/* ── MAIN WORLD MAP ──────────────────────────────────── */}
          <CardW>
            <PanelHeader icon={<Globe size={14}/>} title="Global Opportunity Map" badge={`${filteredEcos.length} ECONOMIES LIVE`}
              extra={
                <div style={{display:'flex',gap:'6px'}}>
                  <Link href="/pipeline-report" style={{fontSize:'9px',fontWeight:700,padding:'3px 8px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(46,204,113,0.2)',borderRadius:'8px',textDecoration:'none',color:'#27ae60'}}>
                    Agent Report
                  </Link>
                </div>
              }/>
            <div style={{padding:'14px 16px 16px'}}>
              <WorldMap
                economies={filteredEcos}
                selected={selId}
                onSelect={(id)=>setSelId(id)}
                highlight={highlightIds}
              />
            </div>
          </CardW>

          {/* ── ROW 2: Doing Business (Bullet) + Sector (Radar) ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>

            {/* Bullet Chart — Doing Business */}
            <CardW>
              <PanelHeader icon={<Shield size={13}/>} title="Doing Business Indicators" badge="L1 LAYER"/>
              <div style={{padding:'12px 14px'}}>
                {DB_INDICATORS.map(({ind,score,avg})=>(
                  <div key={ind} style={{marginBottom:'8px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'2px'}}>
                      <span style={{fontSize:'10px',color:'#5A6874'}}>{ind}</span>
                      <div style={{display:'flex',gap:'5px',alignItems:'center'}}>
                        <span style={{fontSize:'9px',color:'#C8D0D6'}}>avg {avg}</span>
                        <span style={{fontSize:'11px',fontWeight:800,color:sc(score),fontFamily:"'JetBrains Mono',monospace"}}>{score}</span>
                      </div>
                    </div>
                    <div style={{position:'relative',height:'7px',background:'#F0F2F4',borderRadius:'4px',overflow:'hidden'}}>
                      {/* Global avg reference band */}
                      <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${avg}%`,background:'#E8EAED',borderRadius:'4px'}}/>
                      {/* Actual score */}
                      <div style={{position:'absolute',left:0,top:'1px',height:'5px',width:`${score}%`,background:`linear-gradient(90deg,${sc(score)}50,${sc(score)})`,borderRadius:'3px'}}/>
                      {/* Target line */}
                      <div style={{position:'absolute',left:`${avg}%`,top:0,width:'1.5px',height:'100%',background:'#9BA8B5'}}/>
                    </div>
                  </div>
                ))}
                <div style={{display:'flex',gap:'12px',marginTop:'8px',paddingTop:'6px',borderTop:'1px solid #F8F9FA'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'9px',color:'#5A6874'}}><div style={{width:'12px',height:'4px',background:'#E8EAED',borderRadius:'2px'}}/>Avg</div>
                  <div style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'9px',color:'#5A6874'}}><div style={{width:'12px',height:'4px',background:'#2ECC71',borderRadius:'2px'}}/>Score</div>
                  <div style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'9px',color:'#5A6874'}}><div style={{width:'2px',height:'10px',background:'#9BA8B5',borderRadius:'1px'}}/>Target ref</div>
                </div>
              </div>
            </CardW>

            {/* Radar Chart — Sector Attractiveness */}
            <CardW>
              <PanelHeader icon={<Target size={13}/>} title="Sector Attractiveness Radar" badge="L2 LAYER"/>
              <div style={{padding:'12px 14px',display:'flex',gap:'14px',alignItems:'flex-start'}}>
                <RadarMini datasets={SECTORS_RADAR.map(s=>({scores:s.scores,color:s.color}))} size={160}/>
                <div style={{flex:1}}>
                  {SECTORS_RADAR.map((sec,i)=>(
                    <div key={sec.name} style={{marginBottom:'10px',padding:'9px',background:sec.hot?'rgba(46,204,113,0.04)':'#FAFBFC',borderRadius:'9px',border:`1px solid ${sec.hot?'rgba(46,204,113,0.14)':'#F0F2F4'}`}}>
                      <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'4px'}}>
                        <div style={{width:'10px',height:'3px',borderRadius:'2px',background:sec.color}}/>
                        <span style={{fontSize:'11px',fontWeight:700,color:'#1A2C3E',flex:1}}>{sec.name}</span>
                        {sec.hot&&<span style={{fontSize:'8px',fontWeight:800,padding:'1px 6px',borderRadius:'8px',background:'rgba(46,204,113,0.1)',color:'#27ae60',border:'1px solid rgba(46,204,113,0.2)'}}>HOT</span>}
                        <span style={{fontSize:'13px',fontWeight:900,color:sec.color,fontFamily:"'JetBrains Mono',monospace"}}>{Math.round(sec.scores.reduce((a,b)=>a+b)/sec.scores.length)}</span>
                      </div>
                      <div style={{height:'4px',background:'#F0F2F4',borderRadius:'2px',overflow:'hidden'}}>
                        <div style={{height:'100%',width:Math.round(sec.scores.reduce((a,b)=>a+b)/sec.scores.length)+'%',background:sec.color,borderRadius:'2px'}}/>
                      </div>
                    </div>
                  ))}
                  <Link href="/sectors" style={{display:'block',textAlign:'center',padding:'7px',marginTop:'4px',background:'#F8F9FA',borderRadius:'8px',textDecoration:'none',fontSize:'10px',fontWeight:700,color:'#1A2C3E',border:'1px solid #ECF0F1'}}>
                    Full Sector Monitor →
                  </Link>
                </div>
              </div>
            </CardW>
          </div>

          {/* ── ROW 3: Policy Monitor ──────────────────────────── */}
          <CardW>
            <PanelHeader icon={<Activity size={13}/>} title="Policy & Incentives Monitor" badge="LIVE"/>
            <div style={{padding:'12px 14px',display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'9px'}}>
              {POLICIES.map(p=>(
                <div key={p.policy} style={{padding:'11px 12px',background:'#FAFBFC',borderRadius:'11px',border:'1px solid #F0F2F4',transition:'all 0.2s'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='#F4F6F8';e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 6px 16px rgba(0,0,0,0.06)';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='#FAFBFC';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'7px'}}>
                    <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${p.code}.svg`} width="22" height="15" style={{borderRadius:'3px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}} onError={e=>{(e.target as any).style.display='none';}}/>
                    <span style={{fontSize:'8px',fontWeight:800,padding:'2px 6px',borderRadius:'10px',...(p.status==='NEW'?{background:'rgba(46,204,113,0.1)',color:'#27ae60',border:'1px solid rgba(46,204,113,0.2)'}:{background:'rgba(52,152,219,0.1)',color:'#2980b9',border:'1px solid rgba(52,152,219,0.2)'})}}>{p.status}</span>
                  </div>
                  <div style={{fontSize:'11px',fontWeight:700,color:'#1A2C3E',marginBottom:'3px',lineHeight:1.35}}>{p.country}</div>
                  <div style={{fontSize:'10px',color:'#5A6874',lineHeight:1.4,marginBottom:'4px'}}>{p.policy}</div>
                  <div style={{fontSize:'9px',color:'#C8D0D6',fontFamily:"'JetBrains Mono',monospace"}}>{p.date}</div>
                </div>
              ))}
            </div>
          </CardW>
        </div>

        {/* ═══════════════════════════════════════════════════════
            RIGHT PANEL — SIGNAL FILTERS + LIVE FEED + QUICK NAV
            ═══════════════════════════════════════════════════════ */}
        <div style={{display:'flex',flexDirection:'column',gap:'10px',position:'sticky',top:'130px'}}>

          {/* Signal Filters */}
          <CardW>
            <PanelHeader icon={<Filter size={13}/>} title="Signal Filters"/>
            <div style={{padding:'12px 14px',display:'flex',flexDirection:'column',gap:'10px'}}>
              <ScrollableSelect label="Grade" value={filterGrade} options={gradeOpts} onChange={setFilterGrade} width="100%" accentColor="#9b59b6"/>
              <ScrollableSelect label="Signal Type" value={signalType} options={typeOpts} onChange={setSignalType} width="100%" accentColor="#2ECC71"/>
              <ScrollableSelect label="Impact" value={signalImpact} options={impactOpts} onChange={setSignalImpact} width="100%" accentColor="#e74c3c"/>
              <div style={{fontSize:'10px',color:'#5A6874',textAlign:'center',padding:'4px',background:'#F8F9FA',borderRadius:'7px',fontFamily:"'JetBrains Mono',monospace"}}>
                {filteredSignals.length} signals · refreshed {lastRefresh.toLocaleTimeString()}
              </div>
            </div>
          </CardW>

          {/* Live Signals Feed */}
          <CardW style={{flex:'0 1 auto'}}>
            <PanelHeader icon={<Zap size={13}/>} title="Investment Signals" badge="LIVE"/>
            <div style={{height:'360px',overflowY:'auto',padding:'6px 8px'}}>
              {filteredSignals.map((sig,i)=>{
                const gc=sig.grade==='PLATINUM'?'#9b59b6':sig.grade==='GOLD'?'#d4ac0d':'#5A6874';
                const tc=sig.type==='POLICY'?'#e74c3c':sig.type==='DEAL'?'#e67e22':sig.type==='INCENTIVE'?'#2ECC71':sig.type==='GROWTH'?'#3498DB':'#5A6874';
                return(
                  <div key={sig.id} style={{padding:'10px 11px',borderRadius:'10px',marginBottom:'5px',background:'#FAFBFC',border:'1px solid #F0F2F4',borderLeft:`3px solid ${tc}`,transition:'all 0.15s',animation:i===0?'slideInRight 0.4s ease both':'none'}}
                    onMouseEnter={e=>{e.currentTarget.style.background='#F4F6F8';e.currentTarget.style.transform='translateX(2px)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background='#FAFBFC';e.currentTarget.style.transform='none';}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                      <div style={{display:'flex',gap:'4px'}}>
                        <span style={{fontSize:'8px',fontWeight:800,padding:'2px 5px',borderRadius:'4px',background:`${gc}12`,color:gc}}>{sig.grade.slice(0,4)}</span>
                        <span style={{fontSize:'8px',padding:'2px 5px',background:`${tc}10`,color:tc,borderRadius:'4px',fontWeight:600}}>{sig.type}</span>
                      </div>
                      <span style={{fontSize:'12px',fontWeight:900,color:'#9b59b6',fontFamily:"'JetBrains Mono',monospace"}}>{sig.sco}</span>
                    </div>
                    <div style={{fontSize:'11px',color:'#1A2C3E',lineHeight:1.4,marginBottom:'4px',fontWeight:500}}>{sig.title}</div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
                        <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${sig.code}.svg`} width="12" height="8" style={{borderRadius:'1px'}} onError={e=>{(e.target as any).style.display='none';}}/>
                        <span style={{fontSize:'9px',color:'#5A6874'}}>{sig.country}</span>
                      </div>
                      <span style={{fontSize:'9px',color:'#C8D0D6',fontFamily:"'JetBrains Mono',monospace"}}>{sig.ts} ago</span>
                    </div>
                  </div>
                );
              })}
              {filteredSignals.length===0&&<div style={{padding:'24px',textAlign:'center',fontSize:'12px',color:'#C8D0D6'}}>No signals match filters</div>}
            </div>
            <div style={{padding:'8px',borderTop:'1px solid #F8F9FA'}}>
              <Link href="/signals" style={{display:'block',textAlign:'center',padding:'8px',background:'rgba(46,204,113,0.06)',borderRadius:'9px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'#27ae60',border:'1px solid rgba(46,204,113,0.15)'}}>
                Full Signals Platform →
              </Link>
            </div>
          </CardW>

          {/* Quick Nav */}
          <CardW>
            <PanelHeader icon={<BarChart3 size={13}/>} title="Platform"/>
            <div style={{padding:'10px 12px',display:'flex',flexDirection:'column',gap:'5px'}}>
              {[
                {href:'/gfr',       icon:'🏆',l:'GFR Ranking',       d:'25 economies'},
                {href:'/corridors', icon:'🔀',l:'Corridors',          d:'12 routes'},
                {href:'/pipeline',  icon:'📋',l:'Pipeline',           d:'Deal board'},
                {href:'/scenario-planner',icon:'🔬',l:'Scenario Planner',d:'IRR/NPV'},
                {href:'/pipeline-report',icon:'📊',l:'Agent Report',  d:'Full pipeline'},
                {href:'/sources',   icon:'📡',l:'Data Sources',       d:'1000+ sources'},
              ].map(({href,icon,l,d})=>(
                <Link key={href} href={href} style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 10px',background:'#FAFBFC',border:'1px solid #F0F2F4',borderRadius:'9px',textDecoration:'none',transition:'all 0.15s'}}
                  onMouseEnter={e=>{(e.currentTarget as any).style.background='#F0F2F4';(e.currentTarget as any).style.borderColor='#2ECC71';}}
                  onMouseLeave={e=>{(e.currentTarget as any).style.background='#FAFBFC';(e.currentTarget as any).style.borderColor='#F0F2F4';}}>
                  <span style={{fontSize:'16px'}}>{icon}</span>
                  <div><div style={{fontSize:'11px',fontWeight:700,color:'#1A2C3E'}}>{l}</div><div style={{fontSize:'9px',color:'#C8D0D6'}}>{d}</div></div>
                </Link>
              ))}
            </div>
          </CardW>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
