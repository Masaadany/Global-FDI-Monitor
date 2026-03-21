'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';

// ── DATA ─────────────────────────────────────────────────────────────────────

const ECONOMIES = [
  {iso3:'SGP',name:'Singapore',flag:'🇸🇬',score:88.4,l1:91.2,l2:86.1,l3:89.3,l4:87.0,trend:+0.4,tier:'TOP',region:'Asia Pacific',lat:1.35,lng:103.8},
  {iso3:'ARE',name:'UAE',flag:'🇦🇪',score:84.7,l1:82.1,l2:86.3,l3:88.2,l4:82.3,trend:+4.2,tier:'TOP',region:'Middle East',lat:25.2,lng:55.3},
  {iso3:'CHE',name:'Switzerland',flag:'🇨🇭',score:83.9,l1:89.4,l2:81.2,l3:79.8,l4:85.2,trend:-0.1,tier:'TOP',region:'Europe',lat:47.4,lng:8.5},
  {iso3:'MYS',name:'Malaysia',flag:'🇲🇾',score:81.2,l1:78.4,l2:83.6,l3:84.2,l4:78.6,trend:+2.1,tier:'TOP',region:'Asia Pacific',lat:3.1,lng:101.7},
  {iso3:'THA',name:'Thailand',flag:'🇹🇭',score:80.7,l1:76.9,l2:82.4,l3:83.1,l4:80.4,trend:+1.8,tier:'TOP',region:'Asia Pacific',lat:13.7,lng:100.5},
  {iso3:'IRL',name:'Ireland',flag:'🇮🇪',score:80.2,l1:84.1,l2:78.8,l3:76.4,l4:81.5,trend:+0.8,tier:'TOP',region:'Europe',lat:53.3,lng:-6.3},
  {iso3:'VNM',name:'Vietnam',flag:'🇻🇳',score:79.4,l1:74.2,l2:81.8,l3:82.4,l4:79.2,trend:+3.2,tier:'TOP',region:'Asia Pacific',lat:21.0,lng:105.8},
  {iso3:'SAU',name:'Saudi Arabia',flag:'🇸🇦',score:79.1,l1:77.3,l2:80.4,l3:82.1,l4:76.6,trend:+5.4,tier:'TOP',region:'Middle East',lat:24.7,lng:46.7},
  {iso3:'DEU',name:'Germany',flag:'🇩🇪',score:78.8,l1:83.2,l2:77.4,l3:74.2,l4:80.4,trend:-0.8,tier:'TOP',region:'Europe',lat:52.5,lng:13.4},
  {iso3:'USA',name:'United States',flag:'🇺🇸',score:78.4,l1:82.1,l2:77.8,l3:73.4,l4:80.3,trend:+0.2,tier:'TOP',region:'Americas',lat:38.9,lng:-77.0},
  {iso3:'GBR',name:'United Kingdom',flag:'🇬🇧',score:80.4,l1:84.2,l2:78.9,l3:79.3,l4:79.2,trend:-0.3,tier:'TOP',region:'Europe',lat:51.5,lng:-0.1},
  {iso3:'NLD',name:'Netherlands',flag:'🇳🇱',score:79.2,l1:83.6,l2:77.8,l3:75.4,l4:80.0,trend:+0.3,tier:'TOP',region:'Europe',lat:52.4,lng:4.9},
  {iso3:'CHN',name:'China',flag:'🇨🇳',score:74.2,l1:71.8,l2:75.4,l3:76.8,l4:72.8,trend:-1.2,tier:'HIGH',region:'Asia Pacific',lat:39.9,lng:116.4},
  {iso3:'IND',name:'India',flag:'🇮🇳',score:73.2,l1:69.8,l2:74.6,l3:74.8,l4:73.6,trend:+3.4,tier:'HIGH',region:'Asia Pacific',lat:28.6,lng:77.2},
  {iso3:'IDN',name:'Indonesia',flag:'🇮🇩',score:74.8,l1:71.2,l2:76.4,l3:78.3,l4:73.3,trend:+2.8,tier:'HIGH',region:'Asia Pacific',lat:-6.2,lng:106.8},
  {iso3:'BRA',name:'Brazil',flag:'🇧🇷',score:71.3,l1:68.4,l2:72.8,l3:71.2,l4:72.8,trend:+1.2,tier:'HIGH',region:'Americas',lat:-23.5,lng:-46.6},
  {iso3:'MEX',name:'Mexico',flag:'🇲🇽',score:70.8,l1:67.2,l2:72.1,l3:72.4,l4:71.5,trend:+0.8,tier:'HIGH',region:'Americas',lat:19.4,lng:-99.1},
  {iso3:'PHL',name:'Philippines',flag:'🇵🇭',score:72.1,l1:68.4,l2:73.8,l3:74.2,l4:72.0,trend:+2.4,tier:'HIGH',region:'Asia Pacific',lat:14.6,lng:121.0},
  {iso3:'MAR',name:'Morocco',flag:'🇲🇦',score:66.8,l1:63.8,l2:68.2,l3:68.4,l4:66.8,trend:+1.8,tier:'HIGH',region:'Africa',lat:34.0,lng:-6.8},
  {iso3:'EGY',name:'Egypt',flag:'🇪🇬',score:67.3,l1:63.2,l2:68.9,l3:70.1,l4:67.0,trend:+2.1,tier:'HIGH',region:'Middle East',lat:30.0,lng:31.2},
  {iso3:'ZAF',name:'South Africa',flag:'🇿🇦',score:68.9,l1:65.4,l2:70.2,l3:70.8,l4:69.2,trend:+0.6,tier:'HIGH',region:'Africa',lat:-26.2,lng:28.0},
  {iso3:'KEN',name:'Kenya',flag:'🇰🇪',score:61.2,l1:58.4,l2:63.1,l3:63.8,l4:59.5,trend:+1.6,tier:'HIGH',region:'Africa',lat:-1.3,lng:36.8},
  {iso3:'NGA',name:'Nigeria',flag:'🇳🇬',score:58.4,l1:54.2,l2:60.1,l3:62.3,l4:57.0,trend:+0.4,tier:'DEVELOPING',region:'Africa',lat:6.4,lng:3.4},
];

const SIGNALS = [
  {id:1,type:'POLICY',eco:'Malaysia',text:'FDI cap in data centers raised to 100%',color:'#e74c3c',time:'2m',grade:'PLATINUM'},
  {id:2,type:'INCENTIVE',eco:'Thailand',text:'$2B EV battery subsidy package approved',color:'#2ecc71',time:'8m',grade:'GOLD'},
  {id:3,type:'GROWTH',eco:'Vietnam',text:'Electronics exports surge 34% YoY',color:'#3498db',time:'15m',grade:'GOLD'},
  {id:4,type:'ZONE',eco:'Indonesia',text:'New Batam zone: 200ha available',color:'#f1c40f',time:'24m',grade:'SILVER'},
  {id:5,type:'POLICY',eco:'Saudi Arabia',text:'Vision 2030 FDI framework expanded',color:'#e74c3c',time:'45m',grade:'PLATINUM'},
  {id:6,type:'INCENTIVE',eco:'UAE',text:'Dubai launches $10B AI infrastructure fund',color:'#2ecc71',time:'1h',grade:'GOLD'},
  {id:7,type:'GROWTH',eco:'India',text:'Semiconductor FDI up 280% YoY',color:'#3498db',time:'1h',grade:'PLATINUM'},
  {id:8,type:'ZONE',eco:'Morocco',text:'Casablanca Finance City: new tech cluster',color:'#f1c40f',time:'2h',grade:'SILVER'},
];

const DB_INDICATORS = [
  {name:'Starting a Business',platform:82,global:71},
  {name:'Construction Permits',platform:78,global:66},
  {name:'Getting Electricity',platform:85,global:74},
  {name:'Registering Property',platform:79,global:68},
  {name:'Getting Credit',platform:76,global:63},
  {name:'Protecting Investors',platform:83,global:72},
  {name:'Paying Taxes',platform:81,global:69},
  {name:'Trading Across Borders',platform:77,global:65},
  {name:'Enforcing Contracts',platform:74,global:61},
  {name:'Resolving Insolvency',platform:72,global:58},
];

const SECTORS = [
  {name:'EV Battery',readiness:82,opportunity:94,size:28,color:'#2ecc71'},
  {name:'AI Data Centers',readiness:78,opportunity:87,size:22,color:'#3498db'},
  {name:'Semiconductors',readiness:74,opportunity:89,size:24,color:'#9b59b6'},
  {name:'Renewables',readiness:80,opportunity:81,size:19,color:'#1abc9c'},
  {name:'Pharma',readiness:71,opportunity:76,size:16,color:'#e74c3c'},
  {name:'Fintech',readiness:76,opportunity:82,size:18,color:'#f39c12'},
  {name:'Logistics',readiness:69,opportunity:73,size:14,color:'#2ecc71'},
  {name:'Aerospace',readiness:72,opportunity:78,size:15,color:'#3498db'},
];

const ZONES = [
  {name:'Dubai Multi Commodities Centre',country:'UAE',avail:'High',occupancy:72,incentive:'0% Tax 50yr',sector:'Commodities'},
  {name:'Singapore Science Park',country:'Singapore',avail:'Medium',occupancy:89,incentive:'IP Tax 5%',sector:'Tech'},
  {name:'Batam Free Trade Zone',country:'Indonesia',avail:'Very High',occupancy:41,incentive:'Tax Holiday 15yr',sector:'Manufacturing'},
  {name:'Casablanca Finance City',country:'Morocco',avail:'High',occupancy:58,incentive:'Tax 8.75%',sector:'Finance'},
  {name:'King Abdullah Economic City',country:'Saudi Arabia',avail:'Very High',occupancy:35,incentive:'0% Income Tax',sector:'Industrial'},
  {name:'Ho Chi Minh City Hi-Tech Park',country:'Vietnam',avail:'Medium',occupancy:76,incentive:'CIT 10% 15yr',sector:'Hi-Tech'},
];

const POLICIES = [
  {country:'Malaysia',flag:'🇲🇾',type:'NEW',title:'100% FDI in Data Centers',sector:'Digital Economy',valid:'Dec 2026',color:'#2ecc71'},
  {country:'Thailand',flag:'🇹🇭',type:'ACTIVE',title:'EV Battery Investment Incentive',sector:'Manufacturing',valid:'Mar 2027',color:'#3498db'},
  {country:'Saudi Arabia',flag:'🇸🇦',type:'NEW',title:'Vision 2030 FDI Framework',sector:'All Sectors',valid:'Dec 2030',color:'#2ecc71'},
  {country:'Vietnam',flag:'🇻🇳',type:'ACTIVE',title:'Hi-Tech Enterprise Tax Holiday',sector:'Technology',valid:'Jun 2028',color:'#3498db'},
  {country:'UAE',flag:'🇦🇪',type:'EXPIRING',title:'Startup Visa Free Zone Program',sector:'Services',valid:'Sep 2026',color:'#f1c40f'},
];

function scoreColor(s: number) {
  if (s >= 80) return '#2ecc71';
  if (s >= 70) return '#3498db';
  if (s >= 60) return '#f1c40f';
  return '#e74c3c';
}

// ── GLOBE COMPONENT ───────────────────────────────────────────────────────────
function Globe3D({onSelect, selected}: {onSelect:(iso3:string)=>void, selected:string}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rot = useRef(0);
  const animRef = useRef(0);
  const hovRef = useRef<string>('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    const cx = W/2, cy = H/2, R = Math.min(W,H)*0.4;

    function proj(lat: number, lng: number) {
      const phi = (90-lat)*Math.PI/180;
      const th = (lng+rot.current)*Math.PI/180;
      const x = R*Math.sin(phi)*Math.cos(th);
      const y = R*Math.cos(phi);
      const z = R*Math.sin(phi)*Math.sin(th);
      return {x:cx+x, y:cy-y, z, vis:z>-R*0.15};
    }

    function draw() {
      ctx.clearRect(0,0,W,H);
      // Globe base
      const g = ctx.createRadialGradient(cx-R*0.25,cy-R*0.25,R*0.05,cx,cy,R);
      g.addColorStop(0,'#1e3a5f');
      g.addColorStop(0.5,'#1a2c3e');
      g.addColorStop(1,'#0d1b2a');
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
      ctx.fillStyle=g; ctx.fill();
      // Atmosphere
      const atm = ctx.createRadialGradient(cx,cy,R*0.92,cx,cy,R*1.08);
      atm.addColorStop(0,'rgba(46,204,113,0.08)');
      atm.addColorStop(1,'transparent');
      ctx.beginPath(); ctx.arc(cx,cy,R*1.05,0,Math.PI*2);
      ctx.fillStyle=atm; ctx.fill();
      // Grid
      ctx.strokeStyle='rgba(46,204,113,0.06)'; ctx.lineWidth=0.5;
      [-60,-30,0,30,60].forEach(lat=>{
        ctx.beginPath(); let f=true;
        for(let lng=-180;lng<=180;lng+=2){
          const p=proj(lat,lng);
          if(p.vis){f?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);f=false;}else f=true;
        } ctx.stroke();
      });
      for(let lng=-150;lng<180;lng+=30){
        ctx.beginPath(); let f=true;
        for(let lat=-80;lat<=80;lat+=2){
          const p=proj(lat,lng);
          if(p.vis){f?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);f=false;}else f=true;
        } ctx.stroke();
      }
      // Economies
      const visible = ECONOMIES.map(e=>({...e,p:proj(e.lat,e.lng)}))
        .filter(e=>e.p.vis).sort((a,b)=>b.p.z-a.p.z);
      visible.forEach(e=>{
        const {x,y}=e.p;
        const c=scoreColor(e.score);
        const r=e.score>=80?7:e.score>=70?5:4;
        const isSel=e.iso3===selected;
        const isHov=e.iso3===hovRef.current;
        // Halo
        ctx.beginPath();ctx.arc(x,y,r+(isSel?6:isHov?4:2),0,Math.PI*2);
        ctx.fillStyle=c+(isSel?'55':isHov?'33':'18');ctx.fill();
        // Dot
        ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
        ctx.fillStyle=isSel||isHov?c:c+'cc';
        if(isSel){ctx.shadowBlur=12;ctx.shadowColor=c;}
        ctx.fill();ctx.shadowBlur=0;
        // Label for top scores
        if(e.score>=82||isSel){
          ctx.fillStyle='rgba(255,255,255,0.9)';
          ctx.font=`${isSel?'bold 10px':'9px'} Helvetica Neue,sans-serif`;
          ctx.fillText(e.name,x+r+3,y+3);
        }
      });
      // Edge glow
      const edge=ctx.createRadialGradient(cx,cy,R*0.8,cx,cy,R);
      edge.addColorStop(0,'transparent');edge.addColorStop(1,'rgba(46,204,113,0.12)');
      ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fillStyle=edge;ctx.fill();

      rot.current+=0.12;
      animRef.current=requestAnimationFrame(draw);
    }
    draw();

    // Click handler
    function onClick(e: MouseEvent) {
      const rect=canvas.getBoundingClientRect();
      const mx=e.clientX-rect.left, my=e.clientY-rect.top;
      const scaleX=W/rect.width, scaleY=H/rect.height;
      const px=mx*scaleX, py=my*scaleY;
      let best='',bestD=20;
      ECONOMIES.forEach(eco=>{
        const p=proj(eco.lat,eco.lng);
        if(!p.vis)return;
        const d=Math.sqrt((p.x-px)**2+(p.y-py)**2);
        if(d<bestD){bestD=d;best=eco.iso3;}
      });
      if(best) onSelect(best);
    }
    function onMove(e: MouseEvent) {
      const rect=canvas.getBoundingClientRect();
      const mx=e.clientX-rect.left, my=e.clientY-rect.top;
      const scaleX=W/rect.width, scaleY=H/rect.height;
      const px=mx*scaleX, py=my*scaleY;
      let best='',bestD=20;
      ECONOMIES.forEach(eco=>{
        const p=proj(eco.lat,eco.lng);
        if(!p.vis)return;
        const d=Math.sqrt((p.x-px)**2+(p.y-py)**2);
        if(d<bestD){bestD=d;best=eco.iso3;}
      });
      hovRef.current=best;
      canvas.style.cursor=best?'pointer':'default';
    }
    canvas.addEventListener('click',onClick);
    canvas.addEventListener('mousemove',onMove);
    return ()=>{cancelAnimationFrame(animRef.current);canvas.removeEventListener('click',onClick);canvas.removeEventListener('mousemove',onMove);};
  },[selected]);

  return <canvas ref={canvasRef} width={480} height={480} style={{width:'100%',height:'auto',maxWidth:'480px'}}/>;
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [selectedEco, setSelectedEco] = useState('SGP');
  const [sigFilter, setSigFilter] = useState('ALL');
  const [signals, setSignals] = useState(SIGNALS);

  const eco = ECONOMIES.find(e=>e.iso3===selectedEco)||ECONOMIES[0];

  // Live signal updates
  useEffect(()=>{
    const iv=setInterval(()=>{
      if(Math.random()>0.6){
        const types=['POLICY','INCENTIVE','GROWTH','ZONE'];
        const ecos=ECONOMIES.slice(0,8).map(e=>e.name);
        const texts=['New investment zone announced','FDI incentive package expanded','Sector investment surges','Trade agreement activated'];
        const grades=['PLATINUM','GOLD','SILVER'];
        const colors=['#e74c3c','#2ecc71','#3498db','#f1c40f'];
        const ti=Math.floor(Math.random()*4);
        setSignals(p=>[{id:Date.now(),type:types[ti],eco:ecos[Math.floor(Math.random()*ecos.length)],
          text:texts[Math.floor(Math.random()*texts.length)],color:colors[ti],time:'Now',
          grade:grades[Math.floor(Math.random()*3)]},...p.slice(0,11)]);
      }
    },6000);
    return()=>clearInterval(iv);
  },[]);

  const filtSigs = sigFilter==='ALL'?signals:signals.filter(s=>s.type===sigFilter);

  // Top 10 by score
  const top10 = [...ECONOMIES].sort((a,b)=>b.score-a.score).slice(0,10);

  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8',fontFamily:'Helvetica Neue,Segoe UI,Arial,sans-serif'}}>
      <NavBar/>

      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#1a2c3e 0%,#2c4a6e 100%)',padding:'16px 24px'}}>
        <div style={{maxWidth:'1600px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'10px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'3px'}}>
              <span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#2ecc71',display:'inline-block',animation:'livePulse 2s infinite'}}/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#2ecc71',letterSpacing:'0.1em'}}>LIVE · 218 Active Signals · {ECONOMIES.length} Economies</span>
            </div>
            <h1 style={{fontSize:'20px',fontWeight:900,color:'white'}}>Global FDI Intelligence Dashboard</h1>
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <Link href="/investment-analysis" style={{padding:'8px 16px',background:'#2ecc71',color:'#1a2c3e',borderRadius:'7px',textDecoration:'none',fontSize:'12px',fontWeight:800}}>
              📊 Investment Analysis →
            </Link>
            <Link href="/signals" style={{padding:'8px 16px',border:'1px solid rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.85)',borderRadius:'7px',textDecoration:'none',fontSize:'12px',fontWeight:600}}>
              ⚡ All Signals
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div style={{maxWidth:'1600px',margin:'0 auto',padding:'16px 24px',display:'grid',gridTemplateColumns:'1.2fr 1fr 1fr',gridTemplateRows:'auto auto auto',gap:'14px'}}>

        {/* 1. GLOBAL OPPORTUNITY MAP */}
        <div style={{gridRow:'1/3',background:'#1a2c3e',borderRadius:'14px',padding:'20px',display:'flex',flexDirection:'column',alignItems:'center',boxShadow:'0 4px 20px rgba(26,44,62,0.25)'}}>
          <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#2ecc71'}}>🌍 Global Opportunity Map</div>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,0.5)'}}>Click country to update dashboard</div>
          </div>
          <Globe3D onSelect={setSelectedEco} selected={selectedEco}/>
          {/* Selected country info */}
          <div style={{width:'100%',marginTop:'12px',padding:'12px 16px',background:'rgba(46,204,113,0.1)',borderRadius:'10px',border:'1px solid rgba(46,204,113,0.25)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <div style={{fontSize:'16px',fontWeight:900,color:'white'}}>{eco.flag} {eco.name}</div>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.5)'}}>{eco.region}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'24px',fontWeight:900,color:scoreColor(eco.score),fontFamily:'monospace'}}>{eco.score}</div>
                <div style={{fontSize:'11px',color:eco.trend>0?'#2ecc71':'#e74c3c',fontWeight:700}}>{eco.trend>0?'+':''}{eco.trend} MoM</div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px',marginTop:'10px'}}>
              {[['L1 Doing Business',eco.l1],['L2 Sector',eco.l2],['L3 Zones',eco.l3],['L4 Market Intel',eco.l4]].map(([l,v])=>(
                <div key={l as string} style={{padding:'6px 8px',background:'rgba(255,255,255,0.06)',borderRadius:'6px'}}>
                  <div style={{fontSize:'9px',color:'rgba(255,255,255,0.4)'}}>{l}</div>
                  <div style={{fontSize:'13px',fontWeight:800,color:'white',fontFamily:'monospace'}}>{(v as number).toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Legend */}
          <div style={{display:'flex',gap:'12px',marginTop:'10px'}}>
            {[{c:'#2ecc71',l:'Top ≥80'},{c:'#3498db',l:'High 60-79'},{c:'#f1c40f',l:'Dev <60'}].map(t=>(
              <div key={t.l} style={{display:'flex',alignItems:'center',gap:'4px'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:t.c}}/>
                <span style={{fontSize:'9px',color:'rgba(255,255,255,0.5)'}}>{t.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. GLOBAL INVESTMENT ANALYSIS WIDGET */}
        <div style={{background:'white',borderRadius:'14px',padding:'16px',boxShadow:'0 2px 8px rgba(0,0,0,0.06)',overflow:'hidden'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e'}}>📈 Global Investment Analysis</div>
            <Link href="/investment-analysis" style={{fontSize:'11px',color:'#2ecc71',fontWeight:700,textDecoration:'none'}}>Full Analysis →</Link>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
            {top10.map((e,i)=>(
              <div key={e.iso3} onClick={()=>setSelectedEco(e.iso3)}
                style={{display:'flex',alignItems:'center',gap:'8px',padding:'7px 8px',borderRadius:'8px',cursor:'pointer',
                  background:selectedEco===e.iso3?'rgba(46,204,113,0.1)':'transparent',
                  border:selectedEco===e.iso3?'1px solid rgba(46,204,113,0.3)':'1px solid transparent',transition:'all 0.15s'}}>
                <span style={{fontSize:'11px',fontWeight:700,color:'rgba(26,44,62,0.3)',minWidth:'14px'}}>{i+1}</span>
                <span style={{fontSize:'14px'}}>{e.flag}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:'12px',fontWeight:700,color:'#1a2c3e'}}>{e.name}</div>
                  <div style={{height:'3px',borderRadius:'2px',background:'rgba(26,44,62,0.06)',marginTop:'2px'}}>
                    <div style={{height:'100%',width:`${e.score}%`,borderRadius:'2px',background:scoreColor(e.score)}}/>
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'13px',fontWeight:900,color:'#1a2c3e',fontFamily:'monospace'}}>{e.score.toFixed(1)}</div>
                  <div style={{fontSize:'10px',fontWeight:700,color:e.trend>0?'#2ecc71':'#e74c3c'}}>{e.trend>0?'+':''}{e.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. INVESTMENT SIGNALS FEED */}
        <div style={{background:'white',borderRadius:'14px',padding:'16px',boxShadow:'0 2px 8px rgba(0,0,0,0.06)',overflow:'hidden'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e'}}>⚡ Investment Signals</div>
            <div style={{display:'flex',gap:'3px'}}>
              {['ALL','POLICY','INCENTIVE','ZONE'].map(f=>(
                <button key={f} onClick={()=>setSigFilter(f)}
                  style={{padding:'3px 7px',border:'none',borderRadius:'5px',cursor:'pointer',fontSize:'9px',fontWeight:700,
                    background:sigFilter===f?'#1a2c3e':'rgba(26,44,62,0.06)',color:sigFilter===f?'white':'#666'}}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'5px',maxHeight:'320px',overflowY:'auto'}}>
            {filtSigs.slice(0,12).map(s=>(
              <div key={s.id} style={{padding:'8px 10px',borderRadius:'8px',borderLeft:`3px solid ${s.color}`,background:'rgba(26,44,62,0.02)',animation:'fadeIn 0.3s ease'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'2px'}}>
                  <span style={{fontSize:'9px',fontWeight:800,color:s.color}}>{s.type}</span>
                  <span style={{fontSize:'9px',color:'#999'}}>{s.time}</span>
                </div>
                <div style={{fontSize:'11px',fontWeight:600,color:'#1a2c3e'}}><b>{s.eco}</b> — {s.text}</div>
                <span style={{fontSize:'9px',fontWeight:800,padding:'1px 5px',borderRadius:'4px',background:s.color+'15',color:s.color}}>{s.grade}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. DOING BUSINESS INDICATORS PANEL */}
        <div style={{background:'white',borderRadius:'14px',padding:'16px',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
          <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e',marginBottom:'12px'}}>📊 Doing Business Indicators</div>
          <div style={{display:'flex',flexDirection:'column',gap:'7px'}}>
            {DB_INDICATORS.map(ind=>(
              <div key={ind.name}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'2px'}}>
                  <span style={{fontSize:'10px',color:'#666'}}>{ind.name}</span>
                  <span style={{fontSize:'10px',fontWeight:700,color:'#1a2c3e',fontFamily:'monospace'}}>{ind.platform}</span>
                </div>
                <div style={{height:'5px',borderRadius:'3px',background:'rgba(26,44,62,0.06)',position:'relative'}}>
                  <div style={{position:'absolute',height:'100%',width:`${ind.global}%`,borderRadius:'3px',background:'rgba(26,44,62,0.12)'}}/>
                  <div style={{position:'absolute',height:'100%',width:`${ind.platform}%`,borderRadius:'3px',background:'linear-gradient(90deg,#2c4a6e,#2ecc71)'}}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:'12px',marginTop:'8px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'4px'}}><div style={{width:'10px',height:'3px',background:'linear-gradient(90deg,#2c4a6e,#2ecc71)',borderRadius:'2px'}}/><span style={{fontSize:'9px',color:'#999'}}>Platform avg</span></div>
            <div style={{display:'flex',alignItems:'center',gap:'4px'}}><div style={{width:'10px',height:'3px',background:'rgba(26,44,62,0.12)',borderRadius:'2px'}}/><span style={{fontSize:'9px',color:'#999'}}>Global avg</span></div>
          </div>
        </div>

        {/* 5. SECTOR ATTRACTIVENESS MATRIX */}
        <div style={{background:'white',borderRadius:'14px',padding:'16px',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
          <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e',marginBottom:'12px'}}>🎯 Sector Attractiveness Matrix</div>
          <svg width="100%" viewBox="0 0 280 180" style={{overflow:'visible'}}>
            <defs>
              <linearGradient id="gridGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f8fff8"/>
                <stop offset="100%" stopColor="#f0f8ff"/>
              </linearGradient>
            </defs>
            <rect x={30} y={5} width={245} height={155} fill="url(#gridGrad)" rx={6}/>
            {/* Grid */}
            {[0.25,0.5,0.75].map(t=>(
              <g key={t}>
                <line x1={30+t*245} y1={5} x2={30+t*245} y2={160} stroke="rgba(26,44,62,0.06)" strokeWidth={0.5}/>
                <line x1={30} y1={5+t*155} x2={275} y2={5+t*155} stroke="rgba(26,44,62,0.06)" strokeWidth={0.5}/>
              </g>
            ))}
            {/* Quadrant labels */}
            <text x={152} y={15} fontSize={8} fill="rgba(26,44,62,0.2)" textAnchor="middle">High Readiness</text>
            <text x={55} y={95} fontSize={7} fill="rgba(26,44,62,0.2)" textAnchor="middle" transform="rotate(-90,55,95)">Opportunity</text>
            {/* Axes */}
            <line x1={30} y1={160} x2={275} y2={160} stroke="rgba(26,44,62,0.15)" strokeWidth={1}/>
            <line x1={30} y1={5} x2={30} y2={160} stroke="rgba(26,44,62,0.15)" strokeWidth={1}/>
            <text x={152} y={175} fontSize={9} fill="#999" textAnchor="middle">Country Readiness →</text>
            {/* Bubbles */}
            {SECTORS.map(s=>{
              const px=30+((s.readiness-60)/(100-60))*245;
              const py=5+((100-s.opportunity)/(100-60))*155;
              return (
                <g key={s.name}>
                  <circle cx={px} cy={py} r={s.size/2} fill={s.color} fillOpacity={0.75} stroke={s.color} strokeWidth={1.5}/>
                  <text x={px} y={py-s.size/2-3} fontSize={8} fill="#1a2c3e" textAnchor="middle" fontWeight="bold">{s.name}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 6. SPECIAL INVESTMENT ZONES */}
        <div style={{background:'white',borderRadius:'14px',padding:'16px',boxShadow:'0 2px 8px rgba(0,0,0,0.06)',overflow:'hidden'}}>
          <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e',marginBottom:'12px'}}>🏭 Special Investment Zones</div>
          <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
            {ZONES.map(z=>{
              const availColor=z.avail==='Very High'?'#2ecc71':z.avail==='High'?'#3498db':z.avail==='Medium'?'#f1c40f':'#e74c3c';
              const occpct=z.occupancy;
              return (
                <div key={z.name} style={{padding:'9px 12px',borderRadius:'9px',background:'rgba(26,44,62,0.02)',border:'1px solid rgba(26,44,62,0.07)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                    <div style={{fontSize:'11px',fontWeight:700,color:'#1a2c3e',maxWidth:'180px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{z.name}</div>
                    <span style={{fontSize:'9px',fontWeight:800,padding:'1px 6px',borderRadius:'5px',background:availColor+'18',color:availColor}}>{z.avail}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <div style={{fontSize:'10px',color:'#999'}}>{z.country} · {z.sector}</div>
                      <div style={{fontSize:'10px',fontWeight:600,color:'#2ecc71'}}>{z.incentive}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:'9px',color:'#999',marginBottom:'2px'}}>Occupancy {occpct}%</div>
                      <div style={{width:'60px',height:'4px',borderRadius:'2px',background:'rgba(26,44,62,0.08)'}}>
                        <div style={{height:'100%',width:`${occpct}%`,borderRadius:'2px',background:occpct>80?'#e74c3c':occpct>60?'#f1c40f':'#2ecc71'}}/>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. POLICY & INCENTIVES */}
        <div style={{gridColumn:'2/4',background:'white',borderRadius:'14px',padding:'16px',boxShadow:'0 2px 8px rgba(0,0,0,0.06)',overflow:'hidden'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e'}}>📋 Policy & Incentives</div>
            <Link href="/signals" style={{fontSize:'11px',color:'#2ecc71',fontWeight:700,textDecoration:'none'}}>View all →</Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'8px'}}>
            {POLICIES.map(p=>{
              const tc=p.type==='NEW'?'#2ecc71':p.type==='ACTIVE'?'#3498db':'#f1c40f';
              return (
                <div key={p.title} style={{padding:'12px',borderRadius:'10px',border:`1px solid ${tc}25`,background:`${tc}06`,borderTop:`3px solid ${tc}`}}>
                  <div style={{display:'flex',gap:'6px',alignItems:'center',marginBottom:'6px'}}>
                    <span style={{fontSize:'16px'}}>{p.flag}</span>
                    <span style={{fontSize:'9px',fontWeight:800,padding:'1px 6px',borderRadius:'5px',background:tc+'18',color:tc}}>{p.type}</span>
                  </div>
                  <div style={{fontSize:'11px',fontWeight:700,color:'#1a2c3e',marginBottom:'4px',lineHeight:'1.3'}}>{p.title}</div>
                  <div style={{fontSize:'10px',color:'#999'}}>{p.country} · {p.sector}</div>
                  <div style={{fontSize:'10px',color:tc,fontWeight:600,marginTop:'3px'}}>Valid: {p.valid}</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
      <Footer/>
    </div>
  );
}
