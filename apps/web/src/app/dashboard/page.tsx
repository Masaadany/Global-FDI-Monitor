'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { Footer } from '@/components/shared/Footer'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import dynamic from 'next/dynamic'
import { TrendingUp, TrendingDown, Filter, ExternalLink, ChevronDown, X, Search } from 'lucide-react'

const GlobeWidget = dynamic(
  () => import('@/components/hero/Globe3D').then(m => ({ default: m.Globe3D })),
  { ssr: false, loading: () => <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a1628',borderRadius:8}}><div style={{width:36,height:36,border:'2px solid rgba(46,204,113,0.35)',borderRadius:'50%',borderTopColor:'#2ECC71',animation:'spin 0.8s linear infinite'}}/></div> }
)

// ─── Data ─────────────────────────────────────────────────────────────────────
const ECOS = [
  {id:'SGP',code:'SG',name:'Singapore',    gosa:88.4,t:+0.2,fdi:91,  jobs:42000,  deals:12, rank:1,  tier:'TOP',  region:'Asia & Pacific',   city:'Singapore City', sector:'Digital Economy',   src:'https://www.edb.gov.sg'},
  {id:'DNK',code:'DK',name:'Denmark',      gosa:85.3,t:+0.3,fdi:22,  jobs:18000,  deals:8,  rank:2,  tier:'TOP',  region:'Western Europe',   city:'Copenhagen',     sector:'Renewables',        src:'https://www.investindk.com'},
  {id:'KOR',code:'KR',name:'South Korea',  gosa:84.1,t:+0.1,fdi:17,  jobs:35000,  deals:9,  rank:3,  tier:'TOP',  region:'Asia & Pacific',   city:'Seoul',          sector:'Semiconductors',    src:'https://www.kotra.or.kr'},
  {id:'USA',code:'US',name:'United States',gosa:83.9,t:-0.2,fdi:349, jobs:120000, deals:28, rank:4,  tier:'TOP',  region:'North America',    city:'New York',       sector:'AI Technology',     src:'https://www.selectusa.gov'},
  {id:'GBR',code:'GB',name:'UK',           gosa:82.5,t:-0.1,fdi:50,  jobs:45000,  deals:14, rank:5,  tier:'TOP',  region:'Western Europe',   city:'London',         sector:'Fintech',           src:'https://www.great.gov.uk'},
  {id:'ARE',code:'AE',name:'UAE',          gosa:82.1,t:+1.2,fdi:23,  jobs:38000,  deals:11, rank:6,  tier:'TOP',  region:'N.Africa & M.East',city:'Dubai',          sector:'Logistics',         src:'https://www.moec.gov.ae'},
  {id:'MYS',code:'MY',name:'Malaysia',     gosa:81.2,t:+0.4,fdi:22,  jobs:29000,  deals:9,  rank:7,  tier:'TOP',  region:'Asia & Pacific',   city:'Kuala Lumpur',   sector:'Data Centers',      src:'https://www.mida.gov.my'},
  {id:'THA',code:'TH',name:'Thailand',     gosa:80.7,t:+0.2,fdi:14,  jobs:22000,  deals:7,  rank:8,  tier:'HIGH', region:'Asia & Pacific',   city:'Bangkok',        sector:'EV Battery',        src:'https://www.boi.go.th'},
  {id:'VNM',code:'VN',name:'Vietnam',      gosa:79.4,t:+0.5,fdi:24,  jobs:62000,  deals:15, rank:9,  tier:'HIGH', region:'Asia & Pacific',   city:'Ho Chi Minh City',sector:'Electronics',      src:'https://www.mpi.gov.vn'},
  {id:'SAU',code:'SA',name:'Saudi Arabia', gosa:79.1,t:+2.1,fdi:36,  jobs:55000,  deals:13, rank:10, tier:'HIGH', region:'N.Africa & M.East',city:'Riyadh',         sector:'Multi-sector',      src:'https://www.misa.gov.sa'},
  {id:'IDN',code:'ID',name:'Indonesia',    gosa:77.8,t:+0.1,fdi:22,  jobs:48000,  deals:10, rank:11, tier:'HIGH', region:'Asia & Pacific',   city:'Jakarta',        sector:'EV Battery',        src:'https://www.bkpm.go.id'},
  {id:'IND',code:'IN',name:'India',        gosa:73.2,t:+0.8,fdi:71,  jobs:95000,  deals:18, rank:12, tier:'HIGH', region:'Asia & Pacific',   city:'Mumbai',         sector:'Semiconductors',    src:'https://www.investindia.gov.in'},
  {id:'BRA',code:'BR',name:'Brazil',       gosa:71.3,t:+0.4,fdi:74,  jobs:82000,  deals:16, rank:13, tier:'HIGH', region:'Latin America',    city:'São Paulo',      sector:'Agribusiness',      src:'https://www.investimentos.mdic.gov.br'},
  {id:'MAR',code:'MA',name:'Morocco',      gosa:66.8,t:+0.6,fdi:4,   jobs:12000,  deals:5,  rank:14, tier:'HIGH', region:'N.Africa & M.East',city:'Casablanca',     sector:'Automotive',        src:'https://www.amdi.ma'},
  {id:'CHN',code:'CN',name:'China',        gosa:64.2,t:-0.4,fdi:163, jobs:240000, deals:42, rank:15, tier:'HIGH', region:'Asia & Pacific',   city:'Shanghai',       sector:'Manufacturing',     src:'https://www.ndrc.gov.cn'},
]

const DB_IND = ['Starting a Business','Construction Permits','Getting Electricity','Registering Property','Getting Credit','Protecting Investors','Paying Taxes','Cross-Border Trade','Enforcing Contracts','Insolvency Resolution']
const DB_SCORES: Record<string,number[]> = {
  SGP:[94,86,98,83,70,90,88,99,59,81],  DNK:[90,78,92,82,56,88,84,88,82,88],
  KOR:[87,72,89,74,88,72,82,86,64,82],  USA:[84,80,90,76,86,82,84,86,74,80],
  GBR:[86,80,88,74,70,80,78,88,72,82],  ARE:[90,78,90,88,74,74,94,98,62,74],
  MYS:[84,72,84,78,74,74,78,88,56,74],  THA:[82,68,88,74,72,76,78,88,58,68],
  VNM:[80,68,74,62,74,68,68,91,65,52],  SAU:[88,78,92,86,68,72,90,86,66,72],
  IDN:[78,66,78,64,56,66,72,80,54,60],  IND:[68,56,70,50,64,50,64,80,46,48],
  BRA:[64,52,68,52,62,54,50,72,42,50],  MAR:[68,60,70,62,52,56,68,74,46,56],
  CHN:[72,62,78,68,60,62,64,74,46,52],
}
const SECTORS = ['All Sectors','Manufacturing','EV Battery','Semiconductors','AI Technology','Data Centers','Renewable Energy','Logistics','Fintech','Electronics','Agribusiness','Automotive']
const REGIONS  = ['All Regions','Asia & Pacific','Western Europe','North America','Latin America','N.Africa & M.East']
const DURATIONS= ['Last Month','Last 6 Months','1 Year','2 Years','3 Years','5 Years']
const RADAR_LABELS = ['Regulatory','Incentives','Labor','Infrastructure','Export Potential']
const RADAR_DATA: Record<string,number[]> = {
  SGP:[94,88,82,92,96], DNK:[88,84,86,90,88], KOR:[84,80,90,88,86],
  USA:[82,84,78,90,84], GBR:[84,80,84,86,84], ARE:[88,92,78,82,94],
  MYS:[82,84,74,78,86], THA:[80,86,72,74,82], VNM:[80,88,74,68,90],
  SAU:[84,90,70,80,88], IDN:[78,80,72,68,82], IND:[70,82,74,66,80],
  BRA:[66,70,68,62,72], MAR:[64,74,68,60,76], CHN:[72,78,80,78,76],
}
const SIGNALS = [
  {id:'s1',grade:'PLATINUM',type:'POLICY',  code:'MY',eid:'MYS',country:'Malaysia',   title:'100% FDI cap lifted — all data center categories',        strategic:'Microsoft, Google, AWS confirmed intent letters.',src:'MITI Malaysia', url:'https://www.miti.gov.my',sco:96,impact:'HIGH',ts:'2m',  hash:'a3f7c2'},
  {id:'s2',grade:'PLATINUM',type:'DEAL',    code:'AE',eid:'ARE',country:'UAE',         title:'Microsoft $3.3B AI & cloud infrastructure commitment',      strategic:'Largest tech FDI in UAE history. Abu Dhabi becomes tier-1 hub.',src:'UAE MoE',url:'https://www.moec.gov.ae',sco:97,impact:'HIGH',ts:'1h',  hash:'b4e8c3'},
  {id:'s3',grade:'PLATINUM',type:'INCENTIVE',code:'TH',eid:'THA',country:'Thailand',  title:'$2B EV battery manufacturing subsidy package approved',     strategic:'CATL and Samsung SDI shortlisted. Supply chain $8B over 10yr.',src:'BOI Thailand',url:'https://www.boi.go.th',sco:95,impact:'HIGH',ts:'3h',  hash:'c5d9a4'},
  {id:'s4',grade:'GOLD',    type:'POLICY',  code:'SA',eid:'SAU',country:'Saudi Arabia','title':'30-day FDI license guarantee live under Vision 2030',    strategic:'Most significant Gulf reform in a decade. English courts operational.',src:'MISA',url:'https://www.misa.gov.sa',sco:94,impact:'HIGH',ts:'6h',  hash:'d6e1b5'},
  {id:'s5',grade:'GOLD',    type:'GROWTH',  code:'VN',eid:'VNM',country:'Vietnam',     title:'Electronics exports surge 34% YoY — Apple $10B expansion', strategic:'6 new Apple suppliers establishing Vietnam HQ.',src:'Vietnam MPI',url:'https://www.mpi.gov.vn',sco:92,impact:'HIGH',ts:'1d',hash:'e7f2c6'},
  {id:'s6',grade:'GOLD',    type:'ZONE',    code:'IN',eid:'IND',country:'India',        title:'PLI 2.0 — $2.7B semiconductor incentives, TSMC shortlisted','strategic':'Three Tier-1 fabs confirmed. 50% capex covered.',src:'MeitY India',url:'https://www.meity.gov.in',sco:90,impact:'HIGH',ts:'2d',hash:'f8a3d7'},
  {id:'s7',grade:'GOLD',    type:'GROWTH',  code:'SG',eid:'SGP',country:'Singapore',   title:'EDB approves $680M green hydrogen terminal — Shell/Sembcorp JV','strategic':'Singapore positions as Asia-Pacific green hydrogen hub.',src:'EDB',url:'https://www.edb.gov.sg',sco:86,impact:'MED',ts:'3d',hash:'g9b2e8'},
  {id:'s8',grade:'SILVER',  type:'REGULATORY',code:'KR',eid:'KOR',country:'S.Korea',  title:'Korea Chips Act Phase 2: 25% R&D tax credit for packaging',  strategic:'SK Hynix and Samsung confirmed. $4B additional R&D expected.',src:'KOTRA',url:'https://www.kotra.or.kr',sco:78,impact:'MED',ts:'5d',hash:'h1c4f9'},
]

const sc = (v:number) => v>=80?'#2ECC71':v>=60?'#3498DB':'#F1C40F'
const GC: Record<string,string> = {PLATINUM:'#9B59B6',GOLD:'#d4ac0d',SILVER:'#5A6874'}
const TC: Record<string,string> = {POLICY:'#E74C3C',DEAL:'#E67E22',INCENTIVE:'#2ECC71',ZONE:'#3498DB',GROWTH:'#1abc9c',REGULATORY:'#F1C40F'}

// ─── Radar SVG ─────────────────────────────────────────────────────────────────
function RadarSVG({scores,size=160}:{scores:number[];size?:number}){
  const cx=size/2,cy=size/2,r=(size/2)-22,axes=5
  const rings=[0.2,0.4,0.6,0.8,1]
  const pt=(s:number,i:number):[number,number]=>{
    const a=(i/axes)*Math.PI*2-Math.PI/2,rr=r*(s/100)
    return [cx+rr*Math.cos(a),cy+rr*Math.sin(a)]
  }
  const pts=scores.map((s,i)=>pt(s,i))
  const d='M'+pts.map(([x,y])=>`${x.toFixed(1)},${y.toFixed(1)}`).join('L')+'Z'
  return(
    <svg width={size} height={size}>
      {rings.map(ring=>Array.from({length:axes}).map((_,i)=>{
        const [x1,y1]=pt(ring*100,i),[x2,y2]=pt(ring*100,(i+1)%axes)
        return<line key={`${ring}-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2a3a4a" strokeWidth="1"/>
      }))}
      {Array.from({length:axes}).map((_,i)=>{
        const [x,y]=pt(100,i)
        return<line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#2a3a4a" strokeWidth="1"/>
      })}
      <path d={d} fill="rgba(46,204,113,0.18)" stroke="#2ECC71" strokeWidth="1.5"/>
      {pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3" fill="#2ECC71"/>)}
      {RADAR_LABELS.map((l,i)=>{
        const [x,y]=pt(118,i)
        return<text key={l} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="#8a9bb0" fontFamily="Inter,sans-serif">{l}</text>
      })}
    </svg>
  )
}

export default function Dashboard(){
  const { filters, setFilter } = useDashboardStore()
  const [tab,      setTab]      = useState<'flows'|'signals'|'analysis'>('flows')
  const [selId,    setSelId]    = useState('VNM')
  const [selSig,   setSelSig]   = useState<string|null>(null)
  const [search,   setSearch]   = useState('')
  const [region,   setRegion]   = useState('All Regions')
  const [sector,   setSector]   = useState('All Sectors')
  const [duration, setDuration] = useState('1 Year')
  const [time,     setTime]     = useState(new Date())
  const [sidebarOn,setSidebar]  = useState(true)

  useEffect(()=>{ const iv=setInterval(()=>setTime(new Date()),1000); return()=>clearInterval(iv) },[])

  const filtered = useMemo(()=>ECOS.filter(e=>{
    if(region!=='All Regions' && e.region!==region) return false
    if(sector!=='All Sectors' && !e.sector.includes(sector.split(' ')[0])) return false
    if(search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.city.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }),[region,sector,search])

  const sel   = ECOS.find(e=>e.id===selId)||ECOS[8]  // default Vietnam
  const dbSc  = DB_SCORES[sel.code]||DB_SCORES.VNM
  const rdSc  = RADAR_DATA[sel.code]||RADAR_DATA.VNM
  const sigSel= SIGNALS.find(s=>s.id===selSig)

  const totalFDI  = filtered.reduce((a,e)=>a+e.fdi,0)
  const totalJobs = filtered.reduce((a,e)=>a+e.jobs,0)
  const totalDeals= filtered.reduce((a,e)=>a+e.deals,0)
  const avgGOSA   = filtered.length ? Math.round(filtered.reduce((a,e)=>a+e.gosa,0)/filtered.length*10)/10 : 0

  const filtSigs = selSig ? SIGNALS : SIGNALS.filter(s=> region==='All Regions'||ECOS.find(e=>e.id===s.eid)?.region===region)

  return(
    <div style={{minHeight:'100vh',background:'#0f172a',fontFamily:"Arial,sans-serif",color:'white',paddingTop:64}}>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        .card{background:#1e293b;padding:15px;border-radius:10px;transition:0.2s}
        .card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.35)}
        .signal-item{background:#2c3e50;padding:10px 12px;margin-bottom:8px;cursor:pointer;border-radius:6px;transition:all 0.15s;border:1px solid transparent}
        .signal-item:hover{border-color:#2ECC71;background:#334155}
        .signal-item.active{background:#1e3a2f;border-color:#2ECC71}
        select{width:100%;margin-bottom:10px;padding:8px 10px;border:none;background:#1e293b;color:white;border-radius:6px;font-size:12px;cursor:pointer;outline:none}
        select:focus{outline:1px solid #2ECC71}
        .tab-btn{flex:1;padding:10px;background:#1e293b;color:#94a3b8;text-align:center;cursor:pointer;border-radius:6px;transition:0.2s;font-size:13px;font-weight:600;border:1px solid transparent}
        .tab-btn.active{background:#2ECC71;color:#0f172a}
        .tab-btn:hover:not(.active){background:#334155;color:white}
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:#1e293b} ::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}
      `}</style>

      {/* ═══ TOP OPERATIONS BAR ═══════════════════════════════════════════ */}
      <div style={{background:'#1e293b',borderBottom:'1px solid #334155',padding:'8px 20px',position:'sticky',top:64,zIndex:100,boxShadow:'0 1px 8px rgba(0,0,0,0.3)'}}>
        <div style={{maxWidth:1920,margin:'0 auto',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <button onClick={()=>setSidebar(!sidebarOn)} style={{display:'flex',alignItems:'center',gap:5,padding:'5px 11px',background:sidebarOn?'rgba(46,204,113,0.15)':'#334155',border:`1px solid ${sidebarOn?'rgba(46,204,113,0.3)':'#475569'}`,borderRadius:7,cursor:'pointer',fontSize:11,fontWeight:700,color:sidebarOn?'#2ECC71':'#94a3b8',transition:'all 0.15s'}}>
            <Filter size={12}/>{sidebarOn?'Hide':'Show'} Filters
          </button>
          <div style={{flex:1}}>
            <div style={{fontSize:9,fontWeight:700,color:'#475569',textTransform:'uppercase',letterSpacing:'0.12em'}}>Intelligence Dashboard</div>
            <div style={{fontSize:15,fontWeight:900,color:'white',lineHeight:1.1}}>Global FDI Monitor — Live Operations</div>
          </div>
          {[[`${filtered.length} Economies`,'#2ECC71'],[`${filtSigs.length} Signals`,'#3498DB'],['Agents LIVE','#9B59B6']].map(([l,c])=>(
            <div key={String(l)} style={{display:'flex',alignItems:'center',gap:5,padding:'4px 11px',background:`${c}15`,border:`1px solid ${c}30`,borderRadius:18,fontSize:10,fontWeight:700,color:String(c)}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:String(c),animation:'pulse 1.5s infinite'}}/>{l}
            </div>
          ))}
          <div style={{padding:'5px 12px',background:'#334155',borderRadius:9,border:'1px solid #475569',textAlign:'center'}}>
            <div style={{fontSize:13,fontWeight:800,color:'white',fontFamily:'monospace'}}>{time.toLocaleTimeString()}</div>
            <div style={{fontSize:8,color:'#64748b',marginTop:1}}>{time.toLocaleDateString('en-GB',{day:'2-digit',month:'short'}).toUpperCase()}</div>
          </div>
          <Link href="/pipeline-report" style={{display:'flex',alignItems:'center',gap:5,padding:'6px 12px',background:'linear-gradient(135deg,#2ECC71,#27ae60)',color:'#0f172a',borderRadius:20,textDecoration:'none',fontSize:10,fontWeight:800,boxShadow:'0 3px 12px rgba(46,204,113,0.3)'}}>
            <span>📊</span> Agent Report
          </Link>
        </div>
      </div>

      {/* ═══ KPI ROW ══════════════════════════════════════════════════════ */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,padding:'14px 16px 0'}}>
        {[
          {label:'Total FDI Inflows', v:`$${totalFDI}B`,   src:'https://unctad.org/wir',  clr:'#2ECC71', icon:'💰', prev:totalFDI*0.88},
          {label:'Jobs Pipeline',     v:`${(totalJobs/1000).toFixed(0)}K`, src:'https://www.ilo.org', clr:'#3498DB',icon:'👥',prev:totalJobs*0.87},
          {label:'Active Deals',      v:`${totalDeals}`,    src:'https://fdimarkets.com',  clr:'#9B59B6', icon:'🤝', prev:totalDeals*0.82},
          {label:'Avg GOSA Score',    v:avgGOSA,            src:'https://fdimonitor.org',  clr:'#F1C40F', icon:'📊', prev:avgGOSA-2.1},
        ].map(({label,v,src,clr,icon,prev})=>{
          const num=typeof v==='number'?v:parseFloat(String(v).replace(/[^0-9.]/g,''))
          const pct=typeof prev==='number'?((num-prev)/prev*100).toFixed(1):null
          return(
            <div key={label} className="card" style={{textAlign:'center',cursor:'default',border:'1px solid #334155'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                <p style={{margin:0,fontSize:10,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.07em',textAlign:'left'}}>{label}</p>
                <span style={{fontSize:18}}>{icon}</span>
              </div>
              <h2 style={{margin:'4px 0 4px',fontSize:28,fontWeight:900,color:clr,fontFamily:'monospace'}}>{v}</h2>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <a href={src} target="_blank" rel="noopener noreferrer" style={{color:'#2ECC71',fontSize:10,display:'flex',alignItems:'center',gap:3}}>
                  <ExternalLink size={9}/>[source]
                </a>
                {pct&&<span style={{fontSize:10,fontWeight:700,color:Number(pct)>0?'#2ECC71':'#E74C3C'}}>
                  {Number(pct)>0?'↑':'↓'}{Math.abs(Number(pct))}%
                </span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* ═══ TABS ═════════════════════════════════════════════════════════ */}
      <div style={{display:'flex',gap:6,padding:'12px 16px 0'}}>
        {([['flows','🌍 Investment Flows'],['signals','⚡ Market Signals'],['analysis','📊 Investment Analysis']] as const).map(([id,label])=>(
          <div key={id} className={`tab-btn${tab===id?' active':''}`} onClick={()=>setTab(id)}>{label}</div>
        ))}
      </div>

      {/* ═══ MAIN 3-COLUMN GRID ═══════════════════════════════════════════ */}
      <div style={{display:'grid',gap:12,padding:'12px 16px',alignItems:'start',
        gridTemplateColumns:sidebarOn?'260px 1fr 300px':'1fr 300px'}}>

        {/* ═══ LEFT: Filter Panel (#2c3e50) ════════════════════════════════ */}
        {sidebarOn&&(
          <div style={{background:'#2c3e50',padding:15,borderRadius:10,position:'sticky',top:128}}>
            <h3 style={{margin:'0 0 12px',fontSize:14,color:'white',display:'flex',alignItems:'center',gap:6}}>
              <Filter size={13} color="#2ECC71"/> Filters
            </h3>

            {/* Search */}
            <div style={{position:'relative',marginBottom:10}}>
              <Search size={12} style={{position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',color:'#64748b'}}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search countries / cities…"
                style={{width:'100%',padding:'8px 8px 8px 26px',border:'1px solid #334155',background:'#1e293b',color:'white',borderRadius:6,fontSize:12,outline:'none',boxSizing:'border-box'}}/>
            </div>

            <label style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.1em',display:'block',marginBottom:4}}>📍 REGION</label>
            <select value={region} onChange={e=>setRegion(e.target.value)}>
              {REGIONS.map(r=><option key={r}>{r}</option>)}
            </select>

            <label style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.1em',display:'block',marginBottom:4}}>🌍 COUNTRY</label>
            <select value={selId} onChange={e=>{setSelId(e.target.value);setSelSig(null)}}>
              {filtered.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
            </select>

            <label style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.1em',display:'block',marginBottom:4}}>🏙️ CITY</label>
            <select value={sel.city} onChange={()=>{}}>
              <option>{sel.city}</option>
            </select>

            <label style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.1em',display:'block',marginBottom:4}}>🏭 SECTOR</label>
            <select value={sector} onChange={e=>setSector(e.target.value)}>
              {SECTORS.map(s=><option key={s}>{s}</option>)}
            </select>

            <label style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.1em',display:'block',marginBottom:4}}>⏱️ DURATION</label>
            <select value={duration} onChange={e=>setDuration(e.target.value)}>
              {DURATIONS.map(d=><option key={d}>{d}</option>)}
            </select>

            <label style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.1em',display:'block',marginBottom:4}}>💰 INVESTMENT TYPE</label>
            <select><option>All Types</option><option>Greenfield</option><option>M&A</option><option>Joint Venture</option></select>

            <label style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.1em',display:'block',marginBottom:4}}>🚀 FUTURE READINESS</label>
            <select><option>All</option><option>Top Performance (80–100)</option><option>Medium (60–79)</option><option>Developing (&lt;60)</option></select>

            <button style={{width:'100%',marginTop:8,padding:'10px',background:'linear-gradient(135deg,#2ECC71,#27ae60)',color:'#0f172a',border:'none',borderRadius:8,fontSize:12,fontWeight:800,cursor:'pointer',boxShadow:'0 3px 12px rgba(46,204,113,0.3)'}}>
              📄 Export Report (PDF)
            </button>
          </div>
        )}

        {/* ═══ CENTER: Tab Content ══════════════════════════════════════════ */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>

          {/* ─── TAB: INVESTMENT FLOWS ─── */}
          {tab==='flows'&&(
            <>
              {/* Globe map */}
              <div className="card" style={{border:'1px solid #334155'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                  <h3 style={{fontSize:13,fontWeight:700,color:'white'}}>🌍 Global Investment Map</h3>
                  <div style={{display:'flex',gap:10}}>
                    {[['#2ECC71','TOP ≥80'],['#3498DB','HIGH 60-79'],['#F1C40F','DEV <60']].map(([c,l])=>(
                      <div key={l} style={{display:'flex',alignItems:'center',gap:4,fontSize:9,color:'#94a3b8',fontWeight:600}}>
                        <div style={{width:7,height:7,borderRadius:'50%',background:c as string}}/>{l}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{borderRadius:8,overflow:'hidden',height:290,background:'#0a1628',border:'1px solid #334155'}}>
                  <GlobeWidget onSelect={code=>{const e=ECOS.find(x=>x.code===code);if(e)setSelId(e.id)}}/>
                </div>
              </div>

              {/* Lollipop / GFR bars */}
              <div className="card" style={{border:'1px solid #334155'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                  <h3 style={{fontSize:13,fontWeight:700,color:'white'}}>📊 Global Future Readiness Score</h3>
                  <span style={{fontSize:9,fontWeight:800,padding:'2px 8px',borderRadius:12,background:'rgba(46,204,113,0.15)',color:'#2ECC71',border:'1px solid rgba(46,204,113,0.25)'}}>CLICK BAR TO DRILL</span>
                </div>
                <div style={{maxHeight:320,overflowY:'auto'}}>
                  {filtered.slice(0,13).map((eco,i)=>{
                    const pct=Math.max(3,((eco.gosa-58)/(96-58))*100),color=sc(eco.gosa),isSel=selId===eco.id
                    return(
                      <div key={eco.id} onClick={()=>{setSelId(eco.id);setSelSig(null)}}
                        style={{display:'flex',alignItems:'center',gap:7,padding:'5px 7px',borderRadius:7,cursor:'pointer',marginBottom:2,transition:'all 0.14s',
                          background:isSel?`${color}12`:'transparent',border:`1.5px solid ${isSel?color+'35':'transparent'}`}}
                        onMouseEnter={e=>{if(!isSel)(e.currentTarget as any).style.background='#334155'}}
                        onMouseLeave={e=>{if(!isSel)(e.currentTarget as any).style.background='transparent'}}>
                        <span style={{fontSize:8,color:'#475569',minWidth:14,fontFamily:'monospace'}}>#{i+1}</span>
                        <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${eco.code}.svg`} width="17" height="11" style={{borderRadius:2,flexShrink:0}} alt="" onError={e=>{(e.target as any).style.display='none'}}/>
                        <span style={{fontSize:11,color:isSel?'white':'#94a3b8',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:isSel?700:400}}>{eco.name}</span>
                        <div style={{width:60,height:5,background:'#334155',borderRadius:3,overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${color}55,${color})`,borderRadius:3,transition:'width 0.5s ease'}}/>
                        </div>
                        <div style={{width:7,height:7,borderRadius:'50%',background:color,border:'2px solid #1e293b',flexShrink:0}}/>
                        <span style={{fontSize:11,fontWeight:900,color,fontFamily:'monospace',minWidth:30,textAlign:'right'}}>{eco.gosa}</span>
                        <a href={eco.src} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{color:'#475569',fontSize:9,display:'flex'}}><ExternalLink size={8}/></a>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {/* ─── TAB: MARKET SIGNALS ─── */}
          {tab==='signals'&&(
            <div className="card" style={{border:'1px solid #334155'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <h3 style={{fontSize:13,fontWeight:700,color:'white'}}>⚡ Market Signals</h3>
                <div style={{display:'flex',alignItems:'center',gap:6,padding:'3px 9px',background:'rgba(46,204,113,0.1)',border:'1px solid rgba(46,204,113,0.2)',borderRadius:14}}>
                  <div style={{width:5,height:5,borderRadius:'50%',background:'#2ECC71',animation:'pulse 1.5s infinite'}}/>
                  <span style={{fontSize:9,fontWeight:700,color:'#2ECC71'}}>LIVE</span>
                </div>
              </div>
              <div style={{maxHeight:480,overflowY:'auto'}}>
                {filtSigs.map(sig=>{
                  const gc=GC[sig.grade]||'#5A6874',tc=TC[sig.type]||'#5A6874'
                  const isExp=selSig===sig.id,isSel=selId===sig.eid
                  return(
                    <div key={sig.id} className={`signal-item${isExp?' active':''}`}
                      onClick={()=>{setSelSig(isExp?null:sig.id);setSelId(sig.eid)}}
                      style={{borderLeft:`3px solid ${tc}`,background:isSel?'#1a2e3d':'#2c3e50'}}>
                      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                        <span style={{fontSize:8,fontWeight:800,padding:'2px 6px',borderRadius:5,background:`${gc}20`,color:gc}}>{sig.grade}</span>
                        <span style={{fontSize:8,padding:'2px 5px',borderRadius:5,background:`${tc}18`,color:tc,fontWeight:600}}>{sig.type}</span>
                        <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${sig.code}.svg`} width="13" height="9" style={{borderRadius:2}} alt="" onError={e=>{(e.target as any).style.display='none'}}/>
                        <span style={{fontSize:10,fontWeight:600,color:'white',flex:1}}>{sig.country}</span>
                        <span style={{fontSize:10,fontWeight:900,color:gc,fontFamily:'monospace'}}>{sig.sco}</span>
                        <span style={{fontSize:9,color:'#64748b',fontFamily:'monospace'}}>{sig.ts} ago</span>
                      </div>
                      <div style={{fontSize:11,fontWeight:600,color:'#cbd5e1',lineHeight:1.4}}>{sig.title}</div>
                      {isExp&&(
                        <div style={{marginTop:8,paddingTop:8,borderTop:'1px solid #334155'}}>
                          <div style={{fontSize:11,color:'#94a3b8',lineHeight:1.6,marginBottom:6}}><strong style={{color:'white'}}>Strategic: </strong>{sig.strategic}</div>
                          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                            <a href={sig.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
                              style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:10,fontWeight:600,color:'#3498DB',textDecoration:'none',padding:'3px 8px',background:'rgba(52,152,219,0.12)',borderRadius:6}}>
                              <ExternalLink size={9}/>{sig.src} [source]
                            </a>
                            <span style={{fontSize:9,color:'#475569',fontFamily:'monospace'}}>SHA: {sig.hash}…</span>
                            <span style={{fontSize:9,padding:'2px 7px',borderRadius:6,background:'rgba(231,76,60,0.12)',color:'#E74C3C',fontWeight:700}}>{sig.impact}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <Link href="/signals" style={{display:'block',textAlign:'right',color:'#2ECC71',fontSize:11,fontWeight:700,marginTop:8}}>Full Signal Feed →</Link>
            </div>
          )}

          {/* ─── TAB: INVESTMENT ANALYSIS ─── */}
          {tab==='analysis'&&(
            <>
              {/* Radar */}
              <div className="card" style={{border:'1px solid #334155'}}>
                <h3 style={{fontSize:13,fontWeight:700,color:'white',marginBottom:10}}>
                  🎯 Sector Assessment — {sel.name}
                </h3>
                <div style={{display:'flex',gap:16,alignItems:'center'}}>
                  <RadarSVG scores={rdSc} size={170}/>
                  <div style={{flex:1}}>
                    {RADAR_LABELS.map((l,i)=>(
                      <div key={l} style={{marginBottom:8}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                          <span style={{fontSize:10,color:'#94a3b8'}}>{l}</span>
                          <span style={{fontSize:11,fontWeight:800,color:'#2ECC71',fontFamily:'monospace'}}>{rdSc[i]}</span>
                        </div>
                        <div style={{height:5,background:'#334155',borderRadius:3,overflow:'hidden'}}>
                          <div style={{height:'100%',width:rdSc[i]+'%',background:'linear-gradient(90deg,#27ae60,#2ECC71)',borderRadius:3,transition:'width 0.5s ease'}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bullet chart */}
              <div className="card" style={{border:'1px solid #334155'}}>
                <h3 style={{fontSize:13,fontWeight:700,color:'white',marginBottom:10}}>
                  🛡️ Doing Business Indicators — {sel.name}
                  <span style={{marginLeft:8,fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:10,background:'rgba(52,152,219,0.15)',color:'#3498DB'}}>L1</span>
                </h3>
                {DB_IND.map((ind,i)=>{
                  const score=dbSc[i]||70, glob=72
                  const color=sc(score)
                  return(
                    <div key={ind} style={{marginBottom:7}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                        <span style={{fontSize:9,color:'#94a3b8',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'60%'}}>{ind}</span>
                        <div style={{display:'flex',gap:8}}>
                          <span style={{fontSize:9,color:'#475569'}}>Global avg: {glob}</span>
                          <span style={{fontSize:10,fontWeight:800,color,fontFamily:'monospace'}}>{score}</span>
                        </div>
                      </div>
                      <div style={{height:7,background:'#334155',borderRadius:4,overflow:'hidden',position:'relative'}}>
                        <div style={{position:'absolute',left:glob+'%',top:0,bottom:0,width:2,background:'rgba(255,255,255,0.25)',zIndex:1}}/>
                        <div style={{height:'100%',width:score+'%',background:`linear-gradient(90deg,${color}55,${color})`,borderRadius:4,transition:'width 0.5s ease'}}/>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* ═══ RIGHT: Details + Analysis ══════════════════════════════════ */}
        <div style={{display:'flex',flexDirection:'column',gap:12,position:'sticky',top:128}}>

          {/* Selected country details */}
          <div className="card" style={{border:'1px solid #334155',textAlign:'center'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
              <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${sel.code}.svg`} width="44" height="30" style={{borderRadius:4,boxShadow:'0 2px 8px rgba(0,0,0,0.3)'}} alt="" onError={e=>{(e.target as any).style.display='none'}}/>
              <span style={{fontSize:9,fontWeight:800,padding:'3px 9px',borderRadius:12,...(sel.tier==='TOP'?{background:'rgba(46,204,113,0.15)',color:'#2ECC71',border:'1px solid rgba(46,204,113,0.25)'}:{background:'rgba(52,152,219,0.15)',color:'#3498DB',border:'1px solid rgba(52,152,219,0.25)'})}}>{sel.tier} TIER</span>
            </div>
            <h3 id="countryName" style={{margin:'0 0 4px',fontSize:18,fontWeight:900,color:'white'}}>{sel.name}</h3>
            <h2 style={{margin:'0 0 4px',fontSize:34,fontWeight:900,color:sc(sel.gosa),fontFamily:'monospace'}}>
              {sel.gosa} <a href={sel.src} target="_blank" rel="noopener noreferrer" style={{color:'#2ECC71',fontSize:11}}>[source]</a>
            </h2>
            <p style={{margin:'0 0 12px',fontSize:11,color:'#64748b'}}>Rank #{sel.rank} | {sel.tier} Tier | {sel.city}</p>
            <div style={{display:'flex',justifyContent:'space-between',gap:6,marginBottom:8}}>
              {[['FDI','$'+sel.fdi+'B','#2ECC71'],['Jobs',`${(sel.jobs/1000).toFixed(0)}K`,'#3498DB'],['Deals',sel.deals,'#9B59B6']].map(([l,v,c])=>(
                <div key={String(l)} style={{flex:1,padding:'7px 4px',background:'#334155',borderRadius:8}}>
                  <div style={{fontSize:8,color:'#64748b',textTransform:'uppercase',marginBottom:2}}>{l}</div>
                  <div style={{fontSize:14,fontWeight:900,color:String(c),fontFamily:'monospace'}}>{v}</div>
                </div>
              ))}
            </div>
            {sel.t!==0&&<p style={{margin:0,fontSize:11,fontWeight:700,color:sel.t>0?'#2ECC71':'#E74C3C',display:'flex',alignItems:'center',justifyContent:'center',gap:3}}>
              {sel.t>0?<TrendingUp size={11}/>:<TrendingDown size={11}/>}{sel.t>0?'+':''}{sel.t} MoM change
            </p>}
          </div>

          {/* Latest Insights for selected country */}
          <div className="card" style={{border:'1px solid #334155'}}>
            <h4 style={{margin:'0 0 10px',fontSize:12,fontWeight:800,color:'white',display:'flex',alignItems:'center',gap:6}}>
              📡 Latest Insights — {sel.name}
            </h4>
            <ul style={{margin:0,padding:0,listStyle:'none'}}>
              {SIGNALS.filter(s=>s.eid===sel.id).concat(SIGNALS.slice(0,3)).slice(0,4).map((s,i)=>(
                <li key={i} style={{fontSize:11,color:'#cbd5e1',padding:'6px 0',borderBottom:'1px solid #334155',display:'flex',alignItems:'flex-start',gap:6,lineHeight:1.5}}>
                  <span style={{fontSize:10,flexShrink:0}}>{['✅','✅','⚠️','✅'][i]}</span>
                  <span style={{flex:1}}>{s.title.slice(0,55)}…</span>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" style={{color:'#2ECC71',fontSize:9,flexShrink:0,display:'flex',alignItems:'center',gap:1}}>
                    <ExternalLink size={8}/>[src]
                  </a>
                </li>
              ))}
            </ul>
            <button onClick={()=>{setTab('analysis')}} style={{width:'100%',marginTop:10,padding:'8px',background:'rgba(46,204,113,0.1)',border:'1px solid rgba(46,204,113,0.2)',borderRadius:7,cursor:'pointer',fontSize:11,fontWeight:700,color:'#2ECC71',transition:'all 0.14s'}}
              onMouseEnter={e=>{(e.currentTarget as any).style.background='rgba(46,204,113,0.18)'}}
              onMouseLeave={e=>{(e.currentTarget as any).style.background='rgba(46,204,113,0.1)'}}>
              View Full Analysis →
            </button>
          </div>

          {/* Economy selector */}
          <div className="card" style={{border:'1px solid #334155'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <h4 style={{margin:0,fontSize:12,fontWeight:700,color:'white'}}>Economies</h4>
              <span style={{fontSize:9,color:'#64748b'}}>{filtered.length} shown</span>
            </div>
            <div style={{maxHeight:240,overflowY:'auto'}}>
              {filtered.slice(0,12).map((eco,i)=>(
                <div key={eco.id} onClick={()=>{setSelId(eco.id);setSelSig(null)}}
                  style={{display:'flex',alignItems:'center',gap:6,padding:'5px 6px',borderRadius:7,cursor:'pointer',transition:'all 0.12s',marginBottom:1,
                    background:selId===eco.id?`${sc(eco.gosa)}12`:'transparent',border:`1px solid ${selId===eco.id?sc(eco.gosa)+'25':'transparent'}`}}
                  onMouseEnter={e=>{if(selId!==eco.id)(e.currentTarget as any).style.background='#334155'}}
                  onMouseLeave={e=>{if(selId!==eco.id)(e.currentTarget as any).style.background='transparent'}}>
                  <span style={{fontSize:8,color:'#475569',minWidth:14,fontFamily:'monospace'}}>#{i+1}</span>
                  <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${eco.code}.svg`} width="15" height="10" style={{borderRadius:2,flexShrink:0}} alt="" onError={e=>{(e.target as any).style.display='none'}}/>
                  <span style={{fontSize:10,color:selId===eco.id?'white':'#94a3b8',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:selId===eco.id?700:400}}>{eco.name}</span>
                  <span style={{fontSize:10,fontWeight:900,color:sc(eco.gosa),fontFamily:'monospace'}}>{eco.gosa}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ═══════════════════════════════════════════════════════ */}
      <Footer/>
    </div>
  )
}
