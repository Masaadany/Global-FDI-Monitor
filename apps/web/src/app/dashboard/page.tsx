'use client';
import { useState, useEffect, useRef } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Globe, TrendingUp, Zap, BarChart3, Filter, RefreshCw, Download, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.fdimonitor.org';

// Top economies data
const TOP_ECON = [
  {iso3:'SGP',name:'Singapore',flag:'🇸🇬',score:88.4,tier:'TOP',region:'Asia Pacific',trend:'+0.4'},
  {iso3:'ARE',name:'UAE',flag:'🇦🇪',score:84.7,tier:'TOP',region:'Middle East',trend:'+4.2'},
  {iso3:'MYS',name:'Malaysia',flag:'🇲🇾',score:81.2,tier:'TOP',region:'Asia Pacific',trend:'+2.1'},
  {iso3:'THA',name:'Thailand',flag:'🇹🇭',score:80.7,tier:'TOP',region:'Asia Pacific',trend:'+1.8'},
  {iso3:'VNM',name:'Vietnam',flag:'🇻🇳',score:79.4,tier:'TOP',region:'Asia Pacific',trend:'+3.2'},
  {iso3:'SAU',name:'Saudi Arabia',flag:'🇸🇦',score:79.1,tier:'TOP',region:'Middle East',trend:'+5.4'},
  {iso3:'IND',name:'India',flag:'🇮🇳',score:73.2,tier:'HIGH',region:'Asia Pacific',trend:'+3.4'},
  {iso3:'IDN',name:'Indonesia',flag:'🇮🇩',score:74.8,tier:'HIGH',region:'Asia Pacific',trend:'+2.8'},
];

// Live signals
const SIGNALS = [
  {id:1,type:'POLICY CHANGE',color:'#E57373',eco:'Malaysia',text:'FDI cap in data centers raised to 100%',grade:'PLATINUM',time:'2m ago'},
  {id:2,type:'NEW INCENTIVE',color:'#74BB65',eco:'Thailand',text:'$2B EV battery subsidy package approved',grade:'GOLD',time:'8m ago'},
  {id:3,type:'SECTOR GROWTH',color:'#1B6CA8',eco:'Vietnam',text:'Electronics exports surge 34% YoY',grade:'GOLD',time:'15m ago'},
  {id:4,type:'ZONE AVAILABLE',color:'#FFB347',eco:'Indonesia',text:'New Batam zone: 200ha ready for investment',grade:'SILVER',time:'24m ago'},
  {id:5,type:'COMPETITOR MOVE',color:'#1B6CA8',eco:'Indonesia',text:'$15B nickel processing investment confirmed',grade:'PLATINUM',time:'31m ago'},
  {id:6,type:'POLICY CHANGE',color:'#E57373',eco:'Saudi Arabia',text:'Vision 2030 new FDI framework activated',grade:'PLATINUM',time:'45m ago'},
  {id:7,type:'NEW INCENTIVE',color:'#74BB65',eco:'UAE',text:'Dubai launches $10B AI infrastructure fund',grade:'GOLD',time:'1h ago'},
  {id:8,type:'SECTOR GROWTH',color:'#1B6CA8',eco:'India',text:'Semiconductor manufacturing FDI up 280%',grade:'PLATINUM',time:'1h ago'},
];

// Doing Business indicators
const DB_INDICATORS = [
  {name:'Starting a Business',score:82,global_avg:71},
  {name:'Construction Permits',score:78,global_avg:66},
  {name:'Getting Electricity',score:85,global_avg:74},
  {name:'Registering Property',score:79,global_avg:68},
  {name:'Getting Credit',score:76,global_avg:63},
  {name:'Protecting Investors',score:83,global_avg:72},
  {name:'Paying Taxes',score:81,global_avg:69},
  {name:'Trading Across Borders',score:77,global_avg:65},
  {name:'Enforcing Contracts',score:74,global_avg:61},
  {name:'Resolving Insolvency',score:72,global_avg:58},
];

// Sector data for scatter
const SECTORS_DATA = [
  {name:'EV Battery',x:82,y:92,size:24,color:'#74BB65'},
  {name:'AI Data Centers',x:78,y:85,size:20,color:'#1B6CA8'},
  {name:'Semiconductors',x:75,y:88,size:22,color:'#9A6D00'},
  {name:'Renewables',x:80,y:79,size:18,color:'#74BB65'},
  {name:'Pharma',x:72,y:74,size:16,color:'#E57373'},
  {name:'Logistics',x:69,y:71,size:14,color:'#1B6CA8'},
  {name:'Fintech',x:76,y:80,size:17,color:'#9A6D00'},
  {name:'Aerospace',x:71,y:76,size:15,color:'#74BB65'},
];

// Regional scores
const REGIONS = [
  {name:'Asia Pacific',score:78.4,change:'+0.6',color:'#74BB65',countries:45},
  {name:'Middle East',score:76.8,change:'+2.1',color:'#1B6CA8',countries:18},
  {name:'Europe',score:74.2,change:'-0.2',color:'#9A6D00',countries:44},
  {name:'Americas',score:69.8,change:'+0.3',color:'#E57373',countries:35},
  {name:'Africa',score:62.4,change:'+1.4',color:'#FFB347',countries:54},
  {name:'Oceania',score:80.8,change:'+0.2',color:'#74BB65',countries:14},
];

function GlobeMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const rotRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;
    const cx = W/2, cy = H/2, R = Math.min(W,H)*0.38;

    const DOTS = [
      // Asia Pacific
      {lat:1.35,lng:103.8,score:88,name:'Singapore'},{lat:25.2,lng:55.3,score:85,name:'UAE'},
      {lat:3.1,lng:101.7,score:81,name:'Malaysia'},{lat:13.7,lng:100.5,score:81,name:'Thailand'},
      {lat:21.0,lng:105.8,score:79,name:'Vietnam'},{lat:24.7,lng:46.7,score:79,name:'Riyadh'},
      {lat:28.6,lng:77.2,score:73,name:'India'},{lat:-6.2,lng:106.8,score:75,name:'Jakarta'},
      {lat:35.7,lng:139.7,score:77,name:'Tokyo'},{lat:37.6,lng:127.0,score:77,name:'Seoul'},
      {lat:31.2,lng:121.5,score:74,name:'Shanghai'},{lat:22.3,lng:114.2,score:80,name:'HK'},
      // Europe
      {lat:51.5,lng:-0.1,score:80,name:'London'},{lat:48.9,lng:2.3,score:77,name:'Paris'},
      {lat:52.5,lng:13.4,score:79,name:'Berlin'},{lat:52.4,lng:4.9,score:79,name:'Amsterdam'},
      {lat:47.4,lng:8.5,score:84,name:'Zurich'},{lat:59.9,lng:10.8,score:81,name:'Oslo'},
      // Americas
      {lat:40.7,lng:-74.0,score:78,name:'New York'},{lat:37.8,lng:-122.4,score:78,name:'SF'},
      {lat:-23.5,lng:-46.6,score:71,name:'Sao Paulo'},{lat:19.4,lng:-99.1,score:71,name:'Mexico City'},
      // Africa
      {lat:-26.2,lng:28.0,score:69,name:'Joburg'},{lat:30.0,lng:31.2,score:67,name:'Cairo'},
      {lat:-1.3,lng:36.8,score:61,name:'Nairobi'},{lat:6.4,lng:3.4,score:58,name:'Lagos'},
    ];

    function project(lat: number, lng: number, rot: number) {
      const phi = (90 - lat) * Math.PI/180;
      const theta = (lng + rot) * Math.PI/180;
      const x = R * Math.sin(phi) * Math.cos(theta);
      const y = R * Math.cos(phi);
      const z = R * Math.sin(phi) * Math.sin(theta);
      return {x: cx + x, y: cy - y, z, visible: z > -R*0.1};
    }

    function draw() {
      ctx.clearRect(0,0,W,H);

      // Globe background
      const grad = ctx.createRadialGradient(cx-R*0.2, cy-R*0.2, R*0.1, cx, cy, R);
      grad.addColorStop(0, '#1a4a6e');
      grad.addColorStop(1, '#0A1520');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI*2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Grid lines
      ctx.strokeStyle = 'rgba(116,187,101,0.08)';
      ctx.lineWidth = 0.5;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let first = true;
        for (let lng = -180; lng <= 180; lng += 3) {
          const p = project(lat, lng, rotRef.current);
          if (p.visible) {
            if (first) { ctx.moveTo(p.x, p.y); first = false; }
            else ctx.lineTo(p.x, p.y);
          } else first = true;
        }
        ctx.stroke();
      }
      for (let lng = -180; lng < 180; lng += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat = -80; lat <= 80; lat += 3) {
          const p = project(lat, lng, rotRef.current);
          if (p.visible) {
            if (first) { ctx.moveTo(p.x, p.y); first = false; }
            else ctx.lineTo(p.x, p.y);
          } else first = true;
        }
        ctx.stroke();
      }

      // Cities/dots
      const visible = DOTS.map(d => ({...d, proj: project(d.lat, d.lng, rotRef.current)}))
        .filter(d => d.proj.visible)
        .sort((a,b) => b.proj.z - a.proj.z);

      visible.forEach(d => {
        const {x,y} = d.proj;
        const color = d.score >= 80 ? '#74BB65' : d.score >= 70 ? '#1B6CA8' : '#9A6D00';
        const r = d.score >= 80 ? 5 : d.score >= 70 ? 4 : 3;

        ctx.beginPath();
        ctx.arc(x, y, r+2, 0, Math.PI*2);
        ctx.fillStyle = color.replace(')', ',0.2)').replace('rgb','rgba').replace('#','');
        ctx.fillStyle = color + '33';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();

        if (d.score >= 80) {
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText(d.name, x+r+3, y+3);
        }
      });

      // Globe edge glow
      const edgeGrad = ctx.createRadialGradient(cx, cy, R*0.85, cx, cy, R);
      edgeGrad.addColorStop(0, 'transparent');
      edgeGrad.addColorStop(1, 'rgba(116,187,101,0.15)');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI*2);
      ctx.fillStyle = edgeGrad;
      ctx.fill();

      rotRef.current += 0.15;
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas ref={canvasRef} width={400} height={400}
      style={{borderRadius:'50%',boxShadow:'0 0 60px rgba(116,187,101,0.2)'}}/>
  );
}

function DoingBusinessChart() {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
      {DB_INDICATORS.map(ind => (
        <div key={ind.name}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'2px'}}>
            <span style={{fontSize:'10px',color:'#696969'}}>{ind.name}</span>
            <span style={{fontSize:'10px',fontWeight:700,color:'#0A3D62',fontFamily:'monospace'}}>{ind.score}</span>
          </div>
          <div style={{height:'6px',borderRadius:'3px',background:'rgba(10,61,98,0.08)',position:'relative'}}>
            <div style={{height:'100%',borderRadius:'3px',width:`${ind.global_avg}%`,background:'rgba(10,61,98,0.15)',position:'absolute'}}/>
            <div style={{height:'100%',borderRadius:'3px',width:`${ind.score}%`,background:'linear-gradient(90deg,#1B6CA8,#74BB65)',position:'absolute'}}/>
          </div>
        </div>
      ))}
      <div style={{display:'flex',gap:'12px',marginTop:'4px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'4px'}}><div style={{width:'10px',height:'4px',borderRadius:'2px',background:'linear-gradient(90deg,#1B6CA8,#74BB65)'}}/><span style={{fontSize:'10px',color:'#696969'}}>Platform avg</span></div>
        <div style={{display:'flex',alignItems:'center',gap:'4px'}}><div style={{width:'10px',height:'4px',borderRadius:'2px',background:'rgba(10,61,98,0.15)'}}/><span style={{fontSize:'10px',color:'#696969'}}>Global avg</span></div>
      </div>
    </div>
  );
}

function SectorMatrix() {
  const W = 260, H = 180;
  const pad = 30;
  return (
    <svg width={W} height={H}>
      {/* Axes */}
      <line x1={pad} y1={H-pad} x2={W-10} y2={H-pad} stroke="rgba(10,61,98,0.15)" strokeWidth={1}/>
      <line x1={pad} y1={10} x2={pad} y2={H-pad} stroke="rgba(10,61,98,0.15)" strokeWidth={1}/>
      <text x={W/2} y={H-4} textAnchor="middle" fontSize={9} fill="#696969">Country Readiness →</text>
      <text x={10} y={H/2} textAnchor="middle" fontSize={9} fill="#696969" transform={`rotate(-90,10,${H/2})`}>Opportunity →</text>
      {/* Quadrant lines */}
      <line x1={pad+(W-pad)/2} y1={10} x2={pad+(W-pad)/2} y2={H-pad} stroke="rgba(10,61,98,0.08)" strokeDasharray="3,3"/>
      <line x1={pad} y1={(H-pad)/2} x2={W-10} y2={(H-pad)/2} stroke="rgba(10,61,98,0.08)" strokeDasharray="3,3"/>
      {SECTORS_DATA.map(s => {
        const px = pad + ((s.x-60)/(100-60))*(W-pad-10);
        const py = H-pad - ((s.y-60)/(100-60))*(H-pad-10);
        return (
          <g key={s.name}>
            <circle cx={px} cy={py} r={s.size/2} fill={s.color} fillOpacity={0.7} stroke={s.color} strokeWidth={1}/>
            <text x={px} y={py-s.size/2-3} textAnchor="middle" fontSize={8} fill="#0A3D62" fontWeight="bold">{s.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function DashboardPage() {
  const [liveSignals, setLiveSignals] = useState(SIGNALS);
  const [filter, setFilter] = useState('ALL');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const iv = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate new signal arriving
      if (Math.random() > 0.7) {
        const newSig = {
          id: Date.now(),
          type: ['POLICY CHANGE','NEW INCENTIVE','SECTOR GROWTH','ZONE AVAILABLE'][Math.floor(Math.random()*4)],
          color: ['#E57373','#74BB65','#1B6CA8','#FFB347'][Math.floor(Math.random()*4)],
          eco: ['Singapore','UAE','Vietnam','Malaysia','Indonesia'][Math.floor(Math.random()*5)],
          text: ['New investment zone opened','FDI incentive expanded','Sector growth confirmed'][Math.floor(Math.random()*3)],
          grade: ['PLATINUM','GOLD','SILVER'][Math.floor(Math.random()*3)],
          time: 'Just now',
        };
        setLiveSignals(prev => [newSig, ...prev.slice(0,9)]);
      }
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const filteredSignals = filter === 'ALL' ? liveSignals : liveSignals.filter(s => s.type === filter);

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>

      {/* Header */}
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'20px 24px'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'10px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
              <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#74BB65',animation:'pulse 1.5s infinite'}}/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em'}}>LIVE · {liveSignals.length} Active Signals</span>
              <span style={{fontSize:'11px',color:'rgba(226,242,223,0.5)'}}>Updated {lastUpdate.toLocaleTimeString()}</span>
            </div>
            <h1 style={{fontSize:'22px',fontWeight:800,color:'white'}}>Global FDI Intelligence Dashboard</h1>
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <Link href="/investment-analysis" style={{padding:'9px 16px',background:'#74BB65',color:'white',borderRadius:'8px',textDecoration:'none',fontSize:'12px',fontWeight:700,display:'flex',alignItems:'center',gap:'5px'}}>
              <BarChart3 size={13}/> Investment Analysis
            </Link>
            <Link href="/signals" style={{padding:'9px 16px',border:'1px solid rgba(255,255,255,0.25)',color:'rgba(226,242,223,0.9)',borderRadius:'8px',textDecoration:'none',fontSize:'12px',fontWeight:600,display:'flex',alignItems:'center',gap:'5px'}}>
              <Zap size={13}/> All Signals
            </Link>
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1400px',margin:'0 auto',padding:'20px 24px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'14px'}}>

        {/* ROW 1: Globe + Regional Scores + Signals */}

        {/* Globe */}
        <div className="gfm-card" style={{padding:'20px',gridColumn:'1',display:'flex',flexDirection:'column',alignItems:'center'}}>
          <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'12px',width:'100%',display:'flex',alignItems:'center',gap:'6px'}}>
            <Globe size={13} color="#74BB65"/> Global Opportunity Map
          </div>
          <GlobeMap/>
          <div style={{display:'flex',gap:'12px',marginTop:'12px'}}>
            {[{c:'#74BB65',l:'Top Tier (80+)'},{c:'#1B6CA8',l:'High (60-79)'},{c:'#9A6D00',l:'Developing (<60)'}].map(t=>(
              <div key={t.l} style={{display:'flex',alignItems:'center',gap:'4px'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:t.c}}/>
                <span style={{fontSize:'9px',color:'#696969'}}>{t.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Scores */}
        <div className="gfm-card" style={{padding:'20px'}}>
          <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'14px',display:'flex',alignItems:'center',gap:'6px'}}>
            <TrendingUp size={13} color="#74BB65"/> Regional Investment Scores
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {REGIONS.map(r => (
              <div key={r.name}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                  <span style={{fontSize:'12px',fontWeight:600,color:'#0A3D62'}}>{r.name}</span>
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    <span style={{fontSize:'11px',fontWeight:700,color:r.change.startsWith('+')?'#74BB65':'#E57373'}}>{r.change}</span>
                    <span style={{fontSize:'14px',fontWeight:900,color:'#0A3D62',fontFamily:'monospace'}}>{r.score}</span>
                  </div>
                </div>
                <div style={{height:'8px',borderRadius:'4px',background:'rgba(10,61,98,0.08)'}}>
                  <div style={{height:'100%',borderRadius:'4px',width:`${r.score}%`,background:r.color,opacity:0.8}}/>
                </div>
                <div style={{fontSize:'10px',color:'#696969',marginTop:'2px'}}>{r.countries} economies</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Signals */}
        <div className="gfm-card" style={{padding:'20px',overflow:'hidden'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',display:'flex',alignItems:'center',gap:'6px'}}>
              <Zap size={13} color="#74BB65"/> Live Signal Feed
            </div>
            <div style={{display:'flex',gap:'4px'}}>
              {['ALL','POLICY CHANGE','NEW INCENTIVE'].map(f=>(
                <button key={f} onClick={()=>setFilter(f)}
                  style={{padding:'3px 8px',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'10px',fontWeight:700,
                    background:filter===f?'#0A3D62':'rgba(10,61,98,0.06)',
                    color:filter===f?'white':'#696969'}}>
                  {f==='ALL'?'All':f==='POLICY CHANGE'?'Policy':'Incentive'}
                </button>
              ))}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'6px',maxHeight:'360px',overflowY:'auto'}}>
            {filteredSignals.map(s => (
              <div key={s.id} style={{padding:'10px',borderRadius:'8px',background:'rgba(10,61,98,0.02)',border:'1px solid rgba(10,61,98,0.07)',borderLeft:`3px solid ${s.color}`}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}>
                  <span style={{fontSize:'10px',fontWeight:700,color:s.color}}>{s.type}</span>
                  <span style={{fontSize:'10px',color:'#696969'}}>{s.time}</span>
                </div>
                <div style={{fontSize:'12px',fontWeight:600,color:'#0A3D62',marginBottom:'2px'}}>{s.eco} — {s.text}</div>
                <span style={{fontSize:'10px',padding:'1px 6px',borderRadius:'4px',background:`${s.color}15`,color:s.color,fontWeight:700}}>{s.grade}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2: Investment Analysis + Doing Business + Sector Matrix */}

        {/* Top Economies */}
        <div className="gfm-card" style={{padding:'20px',gridColumn:'1'}}>
          <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{display:'flex',alignItems:'center',gap:'6px'}}><BarChart3 size={13} color="#74BB65"/> Investment Analysis</span>
            <Link href="/investment-analysis" style={{fontSize:'11px',color:'#74BB65',fontWeight:700,textDecoration:'none',display:'flex',alignItems:'center',gap:'2px'}}>
              Full Analysis <ChevronRight size={11}/>
            </Link>
          </div>
          {TOP_ECON.map((e,i) => (
            <div key={e.iso3} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 0',borderBottom:'1px solid rgba(10,61,98,0.05)'}}>
              <span style={{fontSize:'12px',fontWeight:700,color:'#696969',minWidth:'16px'}}>{i+1}</span>
              <span style={{fontSize:'16px'}}>{e.flag}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:'12px',fontWeight:700,color:'#0A3D62'}}>{e.name}</div>
                <div style={{fontSize:'10px',color:'#696969'}}>{e.region}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'14px',fontWeight:900,color:'#0A3D62',fontFamily:'monospace'}}>{e.score}</div>
                <div style={{fontSize:'10px',fontWeight:700,color:e.trend.startsWith('+')?'#74BB65':'#E57373'}}>{e.trend}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Doing Business */}
        <div className="gfm-card" style={{padding:'20px'}}>
          <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'14px',display:'flex',alignItems:'center',gap:'6px'}}>
            <Filter size={13} color="#74BB65"/> Doing Business Indicators
          </div>
          <DoingBusinessChart/>
        </div>

        {/* Sector Matrix */}
        <div className="gfm-card" style={{padding:'20px'}}>
          <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'12px',display:'flex',alignItems:'center',gap:'6px'}}>
            <TrendingUp size={13} color="#74BB65"/> Sector Opportunity Matrix
          </div>
          <SectorMatrix/>
          <div style={{marginTop:'10px',display:'flex',flexWrap:'wrap',gap:'6px'}}>
            {SECTORS_DATA.slice(0,4).map(s=>(
              <div key={s.name} style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'10px'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:s.color}}/>
                <span style={{color:'#696969'}}>{s.name}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:'12px',padding:'10px',background:'rgba(116,187,101,0.06)',borderRadius:'8px',border:'1px solid rgba(116,187,101,0.15)'}}>
            <div style={{fontSize:'10px',fontWeight:700,color:'#74BB65',marginBottom:'3px'}}>Top Opportunity</div>
            <div style={{fontSize:'12px',fontWeight:700,color:'#0A3D62'}}>EV Battery Manufacturing · Momentum 92/100</div>
          </div>
        </div>

      </div>
      <Footer/>
    </div>
  );
}
