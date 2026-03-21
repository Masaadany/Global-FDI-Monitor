'use client';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ScrollableSelect from '@/components/ScrollableSelect';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Zap, Globe, Shield, Target, BarChart3, Activity, ChevronRight } from 'lucide-react';

const ALL_ECONOMIES = [
  {id:'SGP',code:'SG',name:'Singapore',    gosa:88.4,trend:+0.2,fdi:'$91B', l1:92.1,l2:85.3,l3:87.2,l4:89.0,category:'TOP',  region:'Asia Pacific'},
  {id:'DNK',code:'DK',name:'Denmark',      gosa:85.3,trend:+0.3,fdi:'$22B', l1:87.2,l2:83.5,l3:84.9,l4:85.6,category:'TOP',  region:'Europe'},
  {id:'KOR',code:'KR',name:'South Korea',  gosa:84.1,trend:+0.1,fdi:'$17B', l1:86.0,l2:82.8,l3:83.5,l4:84.2,category:'TOP',  region:'Asia Pacific'},
  {id:'USA',code:'US',name:'United States',gosa:83.9,trend:-0.2,fdi:'$349B',l1:85.3,l2:82.1,l3:83.0,l4:85.1,category:'TOP',  region:'Americas'},
  {id:'GBR',code:'GB',name:'United Kingdom',gosa:82.5,trend:-0.1,fdi:'$50B',l1:84.1,l2:81.4,l3:82.2,l4:82.3,category:'TOP',  region:'Europe'},
  {id:'ARE',code:'AE',name:'UAE',          gosa:82.1,trend:+1.2,fdi:'$23B', l1:83.4,l2:81.2,l3:82.8,l4:81.0,category:'TOP',  region:'Middle East'},
  {id:'MYS',code:'MY',name:'Malaysia',     gosa:81.2,trend:+0.4,fdi:'$22B', l1:82.5,l2:80.7,l3:81.8,l4:79.8,category:'HIGH', region:'Asia Pacific'},
  {id:'THA',code:'TH',name:'Thailand',     gosa:80.7,trend:+0.2,fdi:'$14B', l1:81.8,l2:80.2,l3:81.0,l4:79.8,category:'HIGH', region:'Asia Pacific'},
  {id:'VNM',code:'VN',name:'Vietnam',      gosa:79.4,trend:+0.5,fdi:'$24B', l1:80.5,l2:79.1,l3:78.9,l4:79.1,category:'HIGH', region:'Asia Pacific'},
  {id:'SAU',code:'SA',name:'Saudi Arabia', gosa:79.1,trend:+2.1,fdi:'$36B', l1:77.3,l2:80.4,l3:82.1,l4:76.6,category:'HIGH', region:'Middle East'},
  {id:'IDN',code:'ID',name:'Indonesia',    gosa:77.8,trend:+0.1,fdi:'$22B', l1:78.9,l2:77.3,l3:77.5,l4:77.5,category:'HIGH', region:'Asia Pacific'},
  {id:'IND',code:'IN',name:'India',        gosa:73.2,trend:+0.8,fdi:'$71B', l1:69.8,l2:74.6,l3:74.8,l4:73.6,category:'HIGH', region:'Asia Pacific'},
  {id:'BRA',code:'BR',name:'Brazil',       gosa:71.3,trend:+0.4,fdi:'$74B', l1:68.4,l2:72.8,l3:71.2,l4:72.8,category:'HIGH', region:'Americas'},
  {id:'MAR',code:'MA',name:'Morocco',      gosa:66.8,trend:+0.6,fdi:'$4B',  l1:63.8,l2:68.2,l3:68.4,l4:66.8,category:'HIGH', region:'Africa'},
  {id:'NZL',code:'NZ',name:'New Zealand',  gosa:86.7,trend:-0.1,fdi:'$9B',  l1:89.5,l2:84.1,l3:85.8,l4:87.3,category:'TOP',  region:'Oceania'},
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

const SECTOR_RADAR = [
  {sector:'EV Battery',   scores:[88,92,76,84,90,82],color:'#2ECC71'},
  {sector:'Data Centers', scores:[84,88,92,86,78,80],color:'#3498DB'},
  {sector:'Renewables',   scores:[82,76,88,72,94,78],color:'#F1C40F'},
];

const POLICIES = [
  {country:'Malaysia',   code:'MY',policy:'100% FDI in data centers',    status:'NEW',    date:'Mar 2026'},
  {country:'UAE',        code:'AE',policy:'100% mainland ownership law',  status:'ACTIVE', date:'Feb 2026'},
  {country:'Thailand',   code:'TH',policy:'$2B EV battery incentive',     status:'NEW',    date:'Mar 2026'},
  {country:'Vietnam',    code:'VN',policy:'50% CIT reduction EV mfg',     status:'ACTIVE', date:'Jan 2026'},
  {country:'Saudi Arabia',code:'SA',policy:'30-day license guarantee',    status:'NEW',    date:'Mar 2026'},
];

const SIGNALS = [
  {grade:'PLATINUM',type:'POLICY',  code:'MY',country:'Malaysia',   title:'FDI cap raised to 100% in data centers',    sco:96,impact:'HIGH',ts:'2m'},
  {grade:'PLATINUM',type:'DEAL',    code:'AE',country:'UAE',         title:'Microsoft $3.3B AI data center committed',  sco:97,impact:'HIGH',ts:'1h'},
  {grade:'PLATINUM',type:'INCENTIVE',code:'TH',country:'Thailand',  title:'$2B EV battery subsidy approved',           sco:95,impact:'HIGH',ts:'3h'},
  {grade:'GOLD',    type:'POLICY',  code:'SA',country:'Saudi Arabia','title':'30-day FDI license guarantee live',        sco:94,impact:'HIGH',ts:'6h'},
  {grade:'GOLD',    type:'GROWTH',  code:'VN',country:'Vietnam',     title:'Electronics exports surge 34% YoY',         sco:92,impact:'MED', ts:'1d'},
  {grade:'GOLD',    type:'ZONE',    code:'ID',country:'Indonesia',   title:'New Batam zone — 200ha greenfield ready',   sco:91,impact:'MED', ts:'2d'},
];

function sc(v: number) { return v >= 80 ? '#2ECC71' : v >= 60 ? '#3498DB' : '#F1C40F'; }

function RadarChart({ datasets, size = 160 }: { datasets: { scores: number[]; color: string }[]; size?: number }) {
  const n = 6; const cx = size/2, cy = size/2, r = size*0.38;
  const labels = ['Regulations','Incentives','Labor','Infra','Export','Market'];
  function pt(i: number, v: number) {
    const a = (Math.PI*2*i/n) - Math.PI/2;
    return { x: cx + (v/100)*r*Math.cos(a), y: cy + (v/100)*r*Math.sin(a) };
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[25,50,75,100].map(l => {
        const ps = Array.from({length:n},(_,i)=>pt(i,l));
        return <polygon key={l} points={ps.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke="#ECF0F1" strokeWidth="0.8"/>;
      })}
      {Array.from({length:n},(_,i) => { const p=pt(i,100); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#ECF0F1" strokeWidth="0.8"/>; })}
      {datasets.map((ds,di) => {
        const pts = ds.scores.map((v,i) => pt(i, v));
        return (
          <g key={di}>
            <polygon points={pts.map(p=>`${p.x},${p.y}`).join(' ')} fill={ds.color+'20'} stroke={ds.color} strokeWidth="1.5"/>
            {pts.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill={ds.color}/>)}
          </g>
        );
      })}
      {labels.map((label,i) => { const p=pt(i,118); return <text key={label} x={p.x} y={p.y} fontSize="7.5" fill="#5A6874" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter,sans-serif">{label}</text>; })}
    </svg>
  );
}

export default function Dashboard() {
  const [selCountry, setSelCountry] = useState(ALL_ECONOMIES[0]);
  const [filterCountry, setFilterCountry] = useState('ALL');
  const [filterRegion, setFilterRegion] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [signals, setSignals] = useState(SIGNALS);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const iv = setInterval(() => {
      setTime(new Date());
      if (Math.random() > 0.6) {
        const countries = ALL_ECONOMIES.slice(0,5);
        const co = countries[Math.floor(Math.random()*countries.length)];
        setSignals(p => [{grade:'GOLD',type:'GROWTH',code:co.code,country:co.name,title:'New investment signal detected — scoring in progress',sco:70+Math.floor(Math.random()*25),impact:'MED',ts:'now'},...p.slice(0,7)]);
      }
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (filterCountry !== 'ALL') {
      const f = ALL_ECONOMIES.find(e => e.id === filterCountry);
      if (f) setSelCountry(f);
    }
  }, [filterCountry]);

  const filteredEconomies = ALL_ECONOMIES.filter(e => {
    if (filterCountry !== 'ALL' && e.id !== filterCountry) return false;
    if (filterRegion !== 'ALL' && e.region !== filterRegion) return false;
    if (filterCategory !== 'ALL' && e.category !== filterCategory) return false;
    return true;
  });

  const countryOpts = [{value:'ALL',label:'All Countries'},...ALL_ECONOMIES.map(e=>({value:e.id,label:e.name,flag:e.code,sub:`GOSA ${e.gosa}`}))];
  const regionOpts = [{value:'ALL',label:'All Regions'},...Array.from(new Set(ALL_ECONOMIES.map(e=>e.region))).map(r=>({value:r,label:r}))];
  const categoryOpts = [{value:'ALL',label:'All Categories'},{value:'TOP',label:'TOP (≥80)'},{value:'HIGH',label:'HIGH (60-79)'}];

  const Card = ({children,style={},className=''}:{children:any,style?:any,className?:string}) => (
    <div className={`card ${className}`} style={{background:'#FFFFFF',borderRadius:'20px',boxShadow:'0 10px 28px -8px rgba(0,0,0,0.08)',border:'1px solid #ECF0F1',overflow:'hidden',...style}}>
      {children}
    </div>
  );

  const CardHeader = ({icon,title,badge}:{icon:any,title:string,badge?:string}) => (
    <div style={{padding:'14px 18px',borderBottom:'1px solid #F8F9FA',display:'flex',alignItems:'center',gap:'9px',background:'#FAFBFC'}}>
      <span style={{color:'#2ECC71',display:'flex',alignItems:'center'}}>{icon}</span>
      <span style={{fontSize:'12px',fontWeight:700,color:'#1A2C3E',letterSpacing:'0.04em',flex:1,textTransform:'uppercase'}}>{title}</span>
      {badge && <span style={{fontSize:'9px',fontWeight:800,padding:'2px 8px',borderRadius:'20px',background:'rgba(46,204,113,0.1)',color:'#27ae60',border:'1px solid rgba(46,204,113,0.25)',letterSpacing:'0.06em'}}>{badge}</span>}
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#F8F9FA',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>

      {/* Header */}
      <div style={{background:'#FFFFFF',borderBottom:'1px solid #ECF0F1',padding:'14px 24px',position:'sticky',top:'64px',zIndex:200}}>
        <div style={{maxWidth:'1900px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'10px',flexWrap:'wrap'}}>
            <div style={{flex:1}}>
              <div style={{fontSize:'11px',fontWeight:700,color:'#5A6874',textTransform:'uppercase',letterSpacing:'0.1em'}}>Intelligence Dashboard</div>
              <div style={{fontSize:'20px',fontWeight:900,color:'#1A2C3E'}}>Global FDI Monitor — Live Operations</div>
            </div>
            <div style={{padding:'8px 16px',background:'#F8F9FA',borderRadius:'10px',border:'1px solid #ECF0F1',textAlign:'center'}}>
              <div style={{fontSize:'16px',fontWeight:800,color:'#1A2C3E',fontFamily:"'JetBrains Mono',monospace"}}>{time.toLocaleTimeString()}</div>
              <div style={{fontSize:'9px',color:'#5A6874',marginTop:'1px'}}>{time.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase()}</div>
            </div>
            {[['AGT-02','SIGNAL'],['AGT-04','GOSA'],['AGT-05','GFR']].map(([a,l])=>(
              <div key={a} style={{display:'flex',alignItems:'center',gap:'5px',padding:'6px 12px',background:'#F8F9FA',border:'1px solid #ECF0F1',borderRadius:'20px'}}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#2ECC71',boxShadow:'0 0 6px #2ECC71'}}/>
                <span style={{fontSize:'10px',fontWeight:700,color:'#5A6874',fontFamily:"'JetBrains Mono',monospace"}}>{a} {l}</span>
              </div>
            ))}
          </div>
          {/* Filters */}
          <div style={{display:'flex',gap:'10px',alignItems:'flex-end',flexWrap:'wrap'}}>
            <ScrollableSelect label="Country" value={filterCountry} options={countryOpts} onChange={setFilterCountry} width="190px" accentColor="#2ECC71"/>
            <ScrollableSelect label="Region"  value={filterRegion}  options={regionOpts}  onChange={setFilterRegion}  width="150px" accentColor="#3498DB"/>
            <ScrollableSelect label="Category" value={filterCategory} options={categoryOpts} onChange={setFilterCategory} width="150px" accentColor="#F1C40F"/>
            {(filterCountry!=='ALL'||filterRegion!=='ALL'||filterCategory!=='ALL') && (
              <button onClick={()=>{setFilterCountry('ALL');setFilterRegion('ALL');setFilterCategory('ALL');}} style={{padding:'6px 14px',background:'#F8F9FA',border:'1px solid #ECF0F1',borderRadius:'20px',cursor:'pointer',fontSize:'11px',fontWeight:600,color:'#5A6874',fontFamily:'Inter,sans-serif',alignSelf:'flex-end'}}>
                Clear ×
              </button>
            )}
            <span style={{marginLeft:'auto',fontSize:'11px',color:'#5A6874',fontFamily:"'JetBrains Mono',monospace",alignSelf:'flex-end',paddingBottom:'1px'}}>
              {filteredEconomies.length}/{ALL_ECONOMIES.length} economies
            </span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div style={{maxWidth:'1900px',margin:'0 auto',padding:'16px 24px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr 320px',gridTemplateRows:'auto auto auto',gap:'14px'}}>

        {/* W1: LOLLIPOP — Global Investment Analysis */}
        <Card style={{gridColumn:'1/3'}} className="animate-card-1">
          <CardHeader icon={<Globe size={14}/>} title="Global Investment Analysis" badge={`${filteredEconomies.length} ECONOMIES`}/>
          <div style={{padding:'16px 20px'}}>
            {filteredEconomies.slice(0,10).map((eco,i) => (
              <div key={eco.id} onClick={()=>setSelCountry(eco)} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 0',borderBottom:i<9?'1px solid #F8F9FA':'none',cursor:'pointer',borderRadius:'8px',transition:'background 0.15s'}}
                onMouseEnter={e=>{e.currentTarget.style.padding='8px 10px';e.currentTarget.style.background='#F8F9FA';}}
                onMouseLeave={e=>{e.currentTarget.style.padding='8px 0';e.currentTarget.style.background='transparent';}}>
                <span style={{fontSize:'11px',fontWeight:700,color:'#C8D0D6',minWidth:'20px',fontFamily:"'JetBrains Mono',monospace"}}>#{i+1}</span>
                <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${eco.code}.svg`} width="22" height="14" style={{borderRadius:'2px',flexShrink:0,boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}} onError={e=>{(e.target as any).style.display='none';}}/>
                <span style={{fontSize:'13px',fontWeight:600,color:'#1A2C3E',minWidth:'130px'}}>{eco.name}</span>
                {/* Lollipop bar */}
                <div style={{flex:1,position:'relative',height:'5px',background:'#F0F2F4',borderRadius:'3px',overflow:'hidden'}}>
                  <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${eco.gosa}%`,background:`linear-gradient(90deg,${sc(eco.gosa)}40,${sc(eco.gosa)})`,borderRadius:'3px',animation:`lollipopGrow 0.7s ease ${i*0.05}s both`}}/>
                </div>
                <div style={{width:'12px',height:'12px',borderRadius:'50%',background:sc(eco.gosa),border:'2px solid white',boxShadow:`0 0 6px ${sc(eco.gosa)}60`,flexShrink:0,marginLeft:'-6px'}}/>
                <span style={{fontSize:'17px',fontWeight:900,color:'#1A2C3E',fontFamily:"'JetBrains Mono',monospace",minWidth:'48px',textAlign:'right'}}>{eco.gosa}</span>
                <span style={{fontSize:'11px',fontWeight:700,color:eco.trend>0?'#27ae60':'#e74c3c',minWidth:'36px',fontFamily:"'JetBrains Mono',monospace"}}>{eco.trend>0?'▲':'▼'}{Math.abs(eco.trend)}</span>
                <span style={{fontSize:'9px',fontWeight:700,padding:'2px 7px',borderRadius:'12px',minWidth:'42px',textAlign:'center',...(eco.category==='TOP'?{background:'rgba(46,204,113,0.1)',color:'#27ae60'}:{background:'rgba(52,152,219,0.1)',color:'#2980b9'})}}>{eco.category}</span>
              </div>
            ))}
            <Link href="/investment-analysis" style={{display:'block',textAlign:'center',padding:'10px',marginTop:'8px',background:'#F8F9FA',borderRadius:'10px',textDecoration:'none',fontSize:'12px',fontWeight:700,color:'#1A2C3E',border:'1px solid #ECF0F1',transition:'all 0.15s'}}
              onMouseEnter={e=>{(e.currentTarget as any).style.borderColor='#2ECC71';(e.currentTarget as any).style.color='#2ECC71';}}
              onMouseLeave={e=>{(e.currentTarget as any).style.borderColor='#ECF0F1';(e.currentTarget as any).style.color='#1A2C3E';}}>
              Full Investment Analysis Platform →
            </Link>
          </div>
        </Card>

        {/* W3: BULLET CHART — Doing Business */}
        <Card className="animate-card-2">
          <CardHeader icon={<Shield size={14}/>} title="Doing Business Indicators" badge="L1 LAYER"/>
          <div style={{padding:'14px 18px'}}>
            {DB_INDICATORS.map(({ind,score,avg}) => (
              <div key={ind} style={{marginBottom:'9px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'3px'}}>
                  <span style={{fontSize:'10px',color:'#5A6874',fontWeight:500}}>{ind}</span>
                  <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
                    <span style={{fontSize:'9px',color:'#C8D0D6'}}>avg {avg}</span>
                    <span style={{fontSize:'12px',fontWeight:800,color:sc(score),fontFamily:"'JetBrains Mono',monospace"}}>{score}</span>
                  </div>
                </div>
                {/* Bullet chart: gray=avg range, colored=actual */}
                <div style={{position:'relative',height:'8px',background:'#F0F2F4',borderRadius:'4px',overflow:'hidden'}}>
                  {/* Average reference */}
                  <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${avg}%`,background:'#E8EAED',borderRadius:'4px'}}/>
                  {/* Actual score */}
                  <div style={{position:'absolute',left:0,top:'1px',height:'calc(100%-2px)',width:`${score}%`,background:`linear-gradient(90deg,${sc(score)}60,${sc(score)})`,borderRadius:'4px',animation:`lollipopGrow 0.8s ease both`}}/>
                  {/* Target marker */}
                  <div style={{position:'absolute',left:`${avg}%`,top:0,width:'2px',height:'100%',background:'#C8D0D6'}}/>
                </div>
              </div>
            ))}
            <div style={{display:'flex',gap:'12px',marginTop:'10px',paddingTop:'8px',borderTop:'1px solid #F8F9FA'}}>
              <div style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'9px',color:'#5A6874'}}><div style={{width:'12px',height:'5px',background:'#E8EAED',borderRadius:'2px'}}/>Global Avg</div>
              <div style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'9px',color:'#5A6874'}}><div style={{width:'12px',height:'5px',background:'linear-gradient(90deg,#2ECC7160,#2ECC71)',borderRadius:'2px'}}/>Score</div>
            </div>
          </div>
        </Card>

        {/* W7: Signals */}
        <Card style={{gridColumn:'4/5',gridRow:'1/3'}} className="animate-card-7">
          <CardHeader icon={<Zap size={14}/>} title="Investment Signals" badge="LIVE"/>
          <div style={{height:'560px',overflowY:'auto',padding:'8px'}}>
            {signals.map((sig,i)=>{
              const gc = sig.grade==='PLATINUM'?'#9b59b6':sig.grade==='GOLD'?'#d4ac0d':'#5A6874';
              const tc = sig.type==='POLICY'?'#e74c3c':sig.type==='DEAL'?'#e67e22':sig.type==='INCENTIVE'?'#2ECC71':sig.type==='GROWTH'?'#3498DB':'#5A6874';
              return (
                <div key={i} style={{padding:'11px 12px',borderRadius:'12px',marginBottom:'6px',background:'#FAFBFC',border:'1px solid #F0F2F4',borderLeft:`3px solid ${tc}`,transition:'all 0.2s',animation:i===0?'slideInRight 0.4s ease both':'none'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='#F4F6F8';e.currentTarget.style.transform='translateX(2px)';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='#FAFBFC';e.currentTarget.style.transform='none';}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'5px'}}>
                    <div style={{display:'flex',gap:'4px'}}>
                      <span style={{fontSize:'8px',fontWeight:800,padding:'2px 6px',borderRadius:'4px',background:`${gc}15`,color:gc,letterSpacing:'0.04em'}}>{sig.grade}</span>
                      <span style={{fontSize:'8px',fontWeight:700,padding:'2px 6px',borderRadius:'4px',background:`${tc}12`,color:tc}}>{sig.type}</span>
                    </div>
                    <span style={{fontSize:'13px',fontWeight:900,color:'#9b59b6',fontFamily:"'JetBrains Mono',monospace"}}>{sig.sco}</span>
                  </div>
                  <div style={{fontSize:'12px',color:'#1A2C3E',lineHeight:1.4,marginBottom:'5px',fontWeight:500}}>{sig.title}</div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                      <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${sig.code}.svg`} width="14" height="10" style={{borderRadius:'1px'}} onError={e=>{(e.target as any).style.display='none';}}/>
                      <span style={{fontSize:'10px',color:'#5A6874',fontWeight:500}}>{sig.country}</span>
                    </div>
                    <span style={{fontSize:'9px',color:'#C8D0D6',fontFamily:"'JetBrains Mono',monospace"}}>{sig.ts} ago</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{padding:'10px 12px',borderTop:'1px solid #F8F9FA'}}>
            <Link href="/signals" style={{display:'block',textAlign:'center',padding:'8px',background:'rgba(46,204,113,0.08)',borderRadius:'10px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'#27ae60',border:'1px solid rgba(46,204,113,0.18)'}}>
              Full Signals Feed →
            </Link>
          </div>
        </Card>

        {/* W4: RADAR — Sector Attractiveness */}
        <Card className="animate-card-3">
          <CardHeader icon={<Target size={14}/>} title="Sector Attractiveness" badge="RADAR"/>
          <div style={{padding:'14px 18px',display:'flex',gap:'16px',alignItems:'flex-start'}}>
            <RadarChart datasets={SECTOR_RADAR.map(s=>({scores:s.scores,color:s.color}))} size={180}/>
            <div style={{flex:1}}>
              <div style={{fontSize:'10px',fontWeight:700,color:'#5A6874',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'10px'}}>Sector Scores</div>
              {SECTOR_RADAR.map((sec,i) => (
                <div key={sec.sector} style={{marginBottom:'8px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'3px'}}>
                    <div style={{width:'10px',height:'3px',borderRadius:'2px',background:sec.color}}/>
                    <span style={{fontSize:'11px',fontWeight:600,color:'#1A2C3E'}}>{sec.sector}</span>
                    <span style={{marginLeft:'auto',fontSize:'12px',fontWeight:800,color:sec.color,fontFamily:"'JetBrains Mono',monospace"}}>{Math.round(sec.scores.reduce((a,b)=>a+b)/sec.scores.length)}</span>
                  </div>
                  <div style={{height:'4px',background:'#F0F2F4',borderRadius:'2px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:(Math.round(sec.scores.reduce((a,b)=>a+b)/sec.scores.length))+'%',background:sec.color,borderRadius:'2px',animation:`lollipopGrow 0.8s ease ${i*0.1}s both`}}/>
                  </div>
                </div>
              ))}
              <Link href="/sectors" style={{display:'block',textAlign:'center',padding:'7px',marginTop:'12px',background:'#F8F9FA',borderRadius:'8px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'#1A2C3E',border:'1px solid #ECF0F1'}}>Sector Monitor →</Link>
            </div>
          </div>
        </Card>

        {/* W5: Selected country detail */}
        <Card className="animate-card-4">
          <CardHeader icon={<BarChart3 size={14}/>} title="Country Detail" badge="GOSA"/>
          <div style={{padding:'14px 18px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'14px',padding:'12px',background:'#F8F9FA',borderRadius:'12px'}}>
              <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${selCountry.code}.svg`} width="40" height="26" style={{borderRadius:'4px',boxShadow:'0 2px 6px rgba(0,0,0,0.1)'}} onError={e=>{(e.target as any).style.display='none';}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:'16px',fontWeight:800,color:'#1A2C3E'}}>{selCountry.name}</div>
                <div style={{fontSize:'11px',color:'#5A6874'}}>{selCountry.region} · {selCountry.category}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'36px',fontWeight:900,color:sc(selCountry.gosa),fontFamily:"'JetBrains Mono',monospace",lineHeight:1}}>{selCountry.gosa}</div>
                <div style={{fontSize:'11px',fontWeight:700,color:selCountry.trend>0?'#27ae60':'#e74c3c',display:'flex',alignItems:'center',gap:'2px',justifyContent:'flex-end'}}>
                  {selCountry.trend>0?<TrendingUp size={10}/>:<TrendingDown size={10}/>}{selCountry.trend>0?'+':''}{selCountry.trend}
                </div>
              </div>
            </div>
            {[['L1 Doing Business',selCountry.l1,'#2ECC71'],['L2 Sector Intelligence',selCountry.l2,'#3498DB'],['L3 Investment Zones',selCountry.l3,'#F1C40F'],['L4 Market Intelligence',selCountry.l4,'#9b59b6']].map(([l,v,c])=>(
              <div key={String(l)} style={{marginBottom:'8px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}>
                  <span style={{fontSize:'10px',color:'#5A6874',fontWeight:500}}>{l as string}</span>
                  <span style={{fontSize:'12px',fontWeight:800,color:String(c),fontFamily:"'JetBrains Mono',monospace"}}>{v as number}</span>
                </div>
                <div style={{height:'5px',background:'#F0F2F4',borderRadius:'3px',overflow:'hidden'}}>
                  <div style={{height:'100%',width:(v as number)+'%',background:String(c),borderRadius:'3px',animation:'lollipopGrow 0.8s ease both'}}/>
                </div>
              </div>
            ))}
            <div style={{display:'flex',gap:'8px',marginTop:'14px'}}>
              <Link href={'/country/'+selCountry.id} style={{flex:1,padding:'8px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(46,204,113,0.2)',borderRadius:'9px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'#27ae60',textAlign:'center'}}>Profile</Link>
              <Link href="/reports" style={{flex:1,padding:'8px',background:'#F8F9FA',border:'1px solid #ECF0F1',borderRadius:'9px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'#1A2C3E',textAlign:'center'}}>Report</Link>
            </div>
          </div>
        </Card>

        {/* W6: Policies */}
        <Card style={{gridColumn:'1/3'}} className="animate-card-5">
          <CardHeader icon={<Activity size={14}/>} title="Policy & Incentives Monitor" badge="LIVE"/>
          <div style={{padding:'14px 18px',display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'10px'}}>
            {POLICIES.map(p => (
              <div key={p.policy} style={{padding:'12px',background:'#FAFBFC',borderRadius:'12px',border:'1px solid #F0F2F4',transition:'all 0.2s'}}
                onMouseEnter={e=>{e.currentTarget.style.background='#F4F6F8';e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 6px 16px rgba(0,0,0,0.06)';}}
                onMouseLeave={e=>{e.currentTarget.style.background='#FAFBFC';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                  <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${p.code}.svg`} width="24" height="16" style={{borderRadius:'3px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}} onError={e=>{(e.target as any).style.display='none';}}/>
                  <span className={`badge-base badge-${p.status.toLowerCase()}`} style={{fontSize:'8px',fontWeight:800,padding:'2px 7px',borderRadius:'10px',...(p.status==='NEW'?{background:'rgba(46,204,113,0.1)',color:'#27ae60'}:{background:'rgba(52,152,219,0.1)',color:'#2980b9'})}}>{p.status}</span>
                </div>
                <div style={{fontSize:'11px',fontWeight:700,color:'#1A2C3E',marginBottom:'3px'}}>{p.country}</div>
                <div style={{fontSize:'11px',color:'#5A6874',lineHeight:1.45}}>{p.policy}</div>
                <div style={{fontSize:'10px',color:'#C8D0D6',marginTop:'6px',fontFamily:"'JetBrains Mono',monospace"}}>{p.date}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* W2: Quick navigation */}
        <Card style={{gridColumn:'3/4'}} className="animate-card-6">
          <CardHeader icon={<ChevronRight size={14}/>} title="Platform Navigation"/>
          <div style={{padding:'14px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
            {[
              {href:'/gfr',       icon:'🏆',l:'GFR Ranking',     d:'25 economies · 6 dims'},
              {href:'/reports',   icon:'📄',l:'PDF Reports',      d:'AI-generated reports'},
              {href:'/pmp',       icon:'🎯',l:'Mission Planning', d:'4 guided workflows'},
              {href:'/pipeline',  icon:'📋',l:'Pipeline Tracker', d:'Deal management'},
              {href:'/scenario-planner',icon:'🔬',l:'Scenario Planner',d:'IRR/NPV modelling'},
              {href:'/corridors', icon:'🔀',l:'Corridors',        d:'12 bilateral routes'},
            ].map(({href,icon,l,d})=>(
              <Link key={href} href={href} style={{padding:'12px',background:'#FAFBFC',border:'1px solid #F0F2F4',borderRadius:'12px',textDecoration:'none',display:'flex',gap:'10px',alignItems:'center',transition:'all 0.2s'}}
                onMouseEnter={e=>{(e.currentTarget as any).style.background='#F0F2F4';(e.currentTarget as any).style.borderColor='#2ECC71';(e.currentTarget as any).style.transform='translateY(-1px)';}}
                onMouseLeave={e=>{(e.currentTarget as any).style.background='#FAFBFC';(e.currentTarget as any).style.borderColor='#F0F2F4';(e.currentTarget as any).style.transform='none';}}>
                <span style={{fontSize:'18px'}}>{icon}</span>
                <div><div style={{fontSize:'11px',fontWeight:700,color:'#1A2C3E'}}>{l}</div><div style={{fontSize:'9px',color:'#5A6874'}}>{d}</div></div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Footer/>
    </div>
  );
}
