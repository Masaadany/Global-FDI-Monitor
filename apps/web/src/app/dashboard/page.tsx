'use client'
import { useState, useEffect, useMemo } from 'react'
import { BackgroundVideo } from '@/components/shared/BackgroundVideo'
import { Footer } from '@/components/shared/Footer'
import { FilterPanel } from '@/components/dashboard/FilterPanel'
import { AnalysisPanel } from '@/components/dashboard/AnalysisPanel'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  TrendingUp, TrendingDown, Globe, Shield, Target,
  BarChart3, Activity, ChevronRight, Download, Filter,
  X, ExternalLink, Zap, RefreshCw
} from 'lucide-react'

const Globe3DWidget = dynamic(
  () => import('@/components/hero/Globe3D').then(m => ({ default: m.Globe3D })),
  { ssr: false, loading: () => (
    <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'#080f1c',borderRadius:12}}>
      <div style={{width:36,height:36,border:'2px solid rgba(46,204,113,0.35)',borderRadius:'50%',borderTopColor:'#2ECC71',animation:'spin 0.8s linear infinite'}}/>
    </div>
  )}
)

// ─── Data ────────────────────────────────────────────────────────────────────
const ECOS = [
  {id:'SGP',code:'SG',name:'Singapore',    gosa:88.4,t:+0.2,fdi:91,  jobs:42000, deals:12,r:'Asia & Pacific',  sec:'Digital Economy',  cat:'TOP',  l1:[96,92,88,94,90,84],l2:[93,89,94,92,82,96]},
  {id:'DNK',code:'DK',name:'Denmark',      gosa:85.3,t:+0.3,fdi:22,  jobs:18000, deals:8, r:'Western Europe',  sec:'Renewables',       cat:'TOP',  l1:[90,88,84,86,94,92],l2:[88,91,86,90,94,95]},
  {id:'KOR',code:'KR',name:'South Korea',  gosa:84.1,t:+0.1,fdi:17,  jobs:35000, deals:9, r:'Asia & Pacific',  sec:'Semiconductors',   cat:'TOP',  l1:[88,90,82,86,78,88],l2:[84,93,83,95,78,88]},
  {id:'USA',code:'US',name:'United States',gosa:83.9,t:-0.2,fdi:349, jobs:120000,deals:28,r:'North America',   sec:'AI Technology',    cat:'TOP',  l1:[86,84,80,90,72,84],l2:[84,88,84,90,72,83]},
  {id:'GBR',code:'GB',name:'UK',           gosa:82.5,t:-0.1,fdi:50,  jobs:45000, deals:14,r:'Western Europe',  sec:'Fintech',          cat:'TOP',  l1:[84,82,86,88,80,90],l2:[84,81,82,88,80,90]},
  {id:'ARE',code:'AE',name:'UAE',          gosa:82.1,t:+1.2,fdi:23,  jobs:38000, deals:11,r:'N.Africa & M.East',sec:'Logistics',       cat:'TOP',  l1:[90,82,88,84,76,88],l2:[86,82,89,84,77,88]},
  {id:'MYS',code:'MY',name:'Malaysia',     gosa:81.2,t:+0.4,fdi:22,  jobs:29000, deals:9, r:'Asia & Pacific',  sec:'Data Centers',     cat:'TOP',  l1:[84,80,82,78,74,82],l2:[83,76,82,78,75,82]},
  {id:'THA',code:'TH',name:'Thailand',     gosa:80.7,t:+0.2,fdi:14,  jobs:22000, deals:7, r:'Asia & Pacific',  sec:'EV Battery',       cat:'HIGH', l1:[82,74,80,76,70,80],l2:[82,74,80,76,70,80]},
  {id:'VNM',code:'VN',name:'Vietnam',      gosa:79.4,t:+0.5,fdi:24,  jobs:62000, deals:15,r:'Asia & Pacific',  sec:'Electronics',      cat:'HIGH', l1:[80,68,74,62,74,78],l2:[81,76,80,74,74,77]},
  {id:'SAU',code:'SA',name:'Saudi Arabia', gosa:79.1,t:+2.1,fdi:36,  jobs:55000, deals:13,r:'N.Africa & M.East',sec:'Multi-sector',    cat:'HIGH', l1:[82,78,80,84,68,84],l2:[82,75,81,77,68,83]},
  {id:'IDN',code:'ID',name:'Indonesia',    gosa:77.8,t:+0.1,fdi:22,  jobs:48000, deals:10,r:'Asia & Pacific',  sec:'EV Battery',       cat:'HIGH', l1:[78,76,74,72,68,74],l2:[79,74,78,72,68,75]},
  {id:'IND',code:'IN',name:'India',        gosa:73.2,t:+0.8,fdi:71,  jobs:95000, deals:18,r:'Asia & Pacific',  sec:'Semiconductors',   cat:'HIGH', l1:[68,76,70,62,64,72],l2:[70,76,74,73,64,73]},
  {id:'BRA',code:'BR',name:'Brazil',       gosa:71.3,t:+0.4,fdi:74,  jobs:82000, deals:16,r:'Latin America',   sec:'Agribusiness',     cat:'HIGH', l1:[66,70,68,62,62,68],l2:[68,73,71,70,62,68]},
  {id:'MAR',code:'MA',name:'Morocco',      gosa:66.8,t:+0.6,fdi:4,   jobs:12000, deals:5, r:'N.Africa & M.East',sec:'Automotive',     cat:'HIGH', l1:[64,68,66,62,58,70],l2:[64,68,66,62,58,70]},
  {id:'CHN',code:'CN',name:'China',        gosa:64.2,t:-0.4,fdi:163, jobs:240000,deals:42,r:'Asia & Pacific',  sec:'Manufacturing',    cat:'HIGH', l1:[72,80,74,82,58,54],l2:[72,80,74,82,58,55]},
]
const DB_INDICATORS = ['Starting a Business','Dealing with Permits','Getting Electricity','Registering Property','Getting Credit','Protecting Investors','Paying Taxes','Trading Across Borders','Enforcing Contracts','Resolving Insolvency']
const GFR_DIMS = [
  {code:'ETR',name:'Economic & Trade Resilience', w:'20%',color:'#2ECC71'},
  {code:'ICT',name:'Innovation & Creative Talent',w:'18%',color:'#3498DB'},
  {code:'TCM',name:'Trade & Capital Mobility',    w:'18%',color:'#9B59B6'},
  {code:'DTF',name:'Digital & Tech Frontier',     w:'16%',color:'#F1C40F'},
  {code:'SGT',name:'Sustainable Growth Trajectory',w:'15%',color:'#E74C3C'},
  {code:'GRP',name:'Governance & Regulatory Policy',w:'13%',color:'#27ae60'},
]
const ALL_SIGNALS = [
  {id:'s1',grade:'PLATINUM',type:'POLICY',  code:'MY',eid:'MYS',country:'Malaysia',    title:'100% FDI cap lifted — all data center categories',      strategic:'Microsoft, Google, AWS confirmed intent letters. First-mover advantage for $1B+ investments.',src:'MITI Malaysia',url:'https://www.miti.gov.my',sco:96,impact:'HIGH',ts:'2m',hash:'a3f7c2'},
  {id:'s2',grade:'PLATINUM',type:'DEAL',    code:'AE',eid:'ARE',country:'UAE',          title:'Microsoft $3.3B AI & cloud infrastructure commitment',    strategic:'Largest tech FDI in UAE history. Abu Dhabi becomes tier-1 hyperscale hub alongside Singapore.',src:'UAE Ministry of Economy',url:'https://www.moec.gov.ae',sco:97,impact:'HIGH',ts:'1h',hash:'b4e8c3'},
  {id:'s3',grade:'PLATINUM',type:'INCENTIVE',code:'TH',eid:'THA',country:'Thailand',   title:'$2B EV battery manufacturing subsidy package approved',   strategic:'CATL and Samsung SDI shortlisted for combined 40GWh facility. Supply chain value $8B over 10 years.',src:'BOI Thailand',url:'https://www.boi.go.th',sco:95,impact:'HIGH',ts:'3h',hash:'c5d9a4'},
  {id:'s4',grade:'GOLD',    type:'POLICY',  code:'SA',eid:'SAU',country:'Saudi Arabia', title:'30-day FDI license guarantee now live under Vision 2030', strategic:'Most significant Gulf regulatory reform in a decade. English commercial courts operational.',src:'MISA Saudi Arabia',url:'https://www.misa.gov.sa',sco:94,impact:'HIGH',ts:'6h',hash:'d6e1b5'},
  {id:'s5',grade:'GOLD',    type:'GROWTH',  code:'VN',eid:'VNM',country:'Vietnam',      title:'Electronics exports surge 34% YoY — Apple $10B expansion', strategic:'6 new Apple suppliers establishing Vietnam HQ. Samsung and LG expanding concurrently.',src:'Vietnam MPI',url:'https://www.mpi.gov.vn',sco:92,impact:'HIGH',ts:'1d',hash:'e7f2c6'},
  {id:'s6',grade:'GOLD',    type:'ZONE',    code:'IN',eid:'IND',country:'India',         title:'PLI 2.0 — $2.7B semiconductor incentives, TSMC shortlisted', strategic:'Three Tier-1 fabs confirmed. First wafers expected Q3 2028. 50% capex + 25% R&D covered.',src:'India MeitY',url:'https://www.meity.gov.in',sco:90,impact:'HIGH',ts:'2d',hash:'f8a3d7'},
  {id:'s7',grade:'GOLD',    type:'GROWTH',  code:'SG',eid:'SGP',country:'Singapore',    title:'EDB approves $680M green hydrogen terminal — Shell/Sembcorp JV', strategic:'Singapore positions as Asia-Pacific green hydrogen hub. Upstream suppliers from AU, OM, CL in talks.',src:'Singapore EDB',url:'https://www.edb.gov.sg',sco:86,impact:'MED',ts:'3d',hash:'c2d6a1'},
  {id:'s8',grade:'SILVER',  type:'REGULATORY',code:'KR',eid:'KOR',country:'South Korea','title':'Korea Chips Act Phase 2: 25% R&D tax credit for packaging', strategic:'SK Hynix and Samsung confirmed beneficiaries. $4B additional annual R&D expected.',src:'KOTRA Korea',url:'https://www.kotra.or.kr',sco:78,impact:'MED',ts:'5d',hash:'d3e7b2'},
]

const sc = (v:number) => v>=80?'#2ECC71':v>=60?'#3498DB':'#F1C40F'
const SECTOR_RADAR_DATA: Record<string,{scores:number[];color:string;label:string}[]> = {
  'EV Battery':    [{scores:[95,92,88,86,94],color:'#2ECC71',label:'EV Battery'},{scores:[88,86,90,84,80],color:'#3498DB',label:'Data Centers'},{scores:[82,78,86,74,92],color:'#F1C40F',label:'Renewables'}],
  'Data Centers':  [{scores:[90,96,84,92,82],color:'#3498DB',label:'Data Centers'},{scores:[86,84,94,88,76],color:'#2ECC71',label:'AI/Cloud'},{scores:[82,76,86,72,90],color:'#9B59B6',label:'Semiconductors'}],
  'Semiconductors':[{scores:[88,94,82,96,78],color:'#9B59B6',label:'Semiconductors'},{scores:[84,90,86,92,80],color:'#3498DB',label:'AI Tech'},{scores:[80,76,88,74,86],color:'#2ECC71',label:'Electronics'}],
  'DEFAULT':       [{scores:[92,95,82,88,94],color:'#2ECC71',label:'EV Battery'},{scores:[88,92,96,90,80],color:'#3498DB',label:'Data Centers'},{scores:[86,78,90,74,96],color:'#F1C40F',label:'Renewables'}],
}

function Card({children,style={}}:{children:any;style?:any}){
  return <div style={{background:'#FFFFFF',borderRadius:16,border:'1px solid #ECF0F1',boxShadow:'0 2px 12px rgba(0,0,0,0.05)',overflow:'hidden',...style}}>{children}</div>
}
function CardHead({icon,title,badge,extra,bg='#FAFBFC'}:{icon:any;title:string;badge?:string;extra?:any;bg?:string}){
  return (
    <div style={{padding:'10px 14px',borderBottom:'1px solid #F8F9FA',display:'flex',alignItems:'center',gap:7,background:bg,flexShrink:0}}>
      <span style={{color:'#2ECC71',display:'flex'}}>{icon}</span>
      <span style={{fontSize:10.5,fontWeight:800,color:'#1A2C3E',letterSpacing:'0.06em',textTransform:'uppercase',flex:1,fontFamily:'Inter,sans-serif'}}>{title}</span>
      {badge&&<span style={{fontSize:8.5,fontWeight:800,padding:'2px 8px',borderRadius:20,background:'rgba(46,204,113,0.1)',color:'#27ae60',border:'1px solid rgba(46,204,113,0.2)',letterSpacing:'0.04em'}}>{badge}</span>}
      {extra}
    </div>
  )
}

export default function Dashboard(){
  const { filters, setFilter } = useDashboardStore()
  const [selId,      setSelId]     = useState('VNM')
  const [showAnalysis,setShowAn]  = useState(false)
  const [sidebarOn,  setSidebar]  = useState(true)
  const [expandedSig,setExpSig]   = useState<string|null>(null)
  const [time, setTime] = useState(new Date())
  const [signalNote, setSignalNote] = useState<string|null>(null)

  useEffect(()=>{ const iv=setInterval(()=>setTime(new Date()),1000); return()=>clearInterval(iv) },[])

  // ── Derived filtered data ────────────────────────────────────────────────
  const filtered = useMemo(()=>ECOS.filter(e=>{
    if(filters.region!=='All' && e.r!==filters.region) return false
    if(filters.country && !e.name.toLowerCase().includes(filters.country.toLowerCase())) return false
    if(filters.sector!=='All' && !e.sec.includes(filters.sector.split(',')[0])) return false
    if(filters.futureReadiness==='Top Performance (80–100)'   && e.gosa<80) return false
    if(filters.futureReadiness==='Medium Performance (60–79)' && (e.gosa<60||e.gosa>=80)) return false
    if(filters.futureReadiness==='Developing Performance (<60)'&& e.gosa>=60) return false
    return true
  }),[filters])

  // When filter changes, auto-select first eco in filtered list
  useEffect(()=>{
    if(filtered.length>0 && !filtered.find(e=>e.id===selId)){
      setSelId(filtered[0].id)
    }
  },[filtered])

  const selEco = ECOS.find(e=>e.id===selId)||ECOS[0]

  // ── KPI aggregates — update with filters ────────────────────────────────
  const totalFDI   = filtered.reduce((s,e)=>s+e.fdi,0)
  const totalJobs  = filtered.reduce((s,e)=>s+e.jobs,0)
  const totalDeals = filtered.reduce((s,e)=>s+e.deals,0)
  const avgGOSA    = filtered.length ? Math.round(filtered.reduce((s,e)=>s+e.gosa,0)/filtered.length*10)/10 : 0

  // ── Signal filtering — update with country/sector ───────────────────────
  const filteredSignals = useMemo(()=>{
    let sigs = ALL_SIGNALS
    if(filters.country) sigs = sigs.filter(s=>s.country.toLowerCase().includes(filters.country.toLowerCase()))
    if(filters.sector!=='All') sigs = sigs.filter(s=>{
      const eco = ECOS.find(e=>e.id===s.eid)
      return eco && eco.sec.includes(filters.sector.split(',')[0])
    })
    return sigs
  },[filters])

  // ── Sector radar — updates when sector filter or selected eco changes ───
  const radarData = useMemo(()=>{
    if(filters.sector!=='All' && SECTOR_RADAR_DATA[filters.sector]) return SECTOR_RADAR_DATA[filters.sector]
    if(SECTOR_RADAR_DATA[selEco.sec]) return SECTOR_RADAR_DATA[selEco.sec]
    return SECTOR_RADAR_DATA.DEFAULT
  },[filters.sector, selEco])

  // ── Bullet chart data — updates with selected economy ───────────────────
  const bulletData = DB_INDICATORS.map((ind,i)=>{
    const base = selEco.l1[i] || 75
    return { label: ind.replace('Dealing with Permits','Const. Permits').replace('Protecting Investors','Investor Protect').replace('Trading Across Borders','Cross-Border Trade').replace('Resolving Insolvency','Insolvency Res.'), score: base, global: 72 }
  })

  // ── ACTION 1: Click lollipop bar ─────────────────────────────────────────
  const handleBarClick = (id:string) => {
    setSelId(id)
    setShowAn(false)
    setSignalNote(null)
    setExpSig(null)
  }
  // ── ACTION 3: Click signal card ──────────────────────────────────────────
  const handleSignalClick = (sig: typeof ALL_SIGNALS[0]) => {
    setSelId(sig.eid)
    setExpSig(sig.id)
    setSignalNote(sig.strategic)
    setShowAn(true)
    // scroll to analysis panel
    setTimeout(()=>document.getElementById('analysis-panel')?.scrollIntoView({behavior:'smooth',block:'start'}),120)
  }

  const GRADE_C: Record<string,string> = {PLATINUM:'#9B59B6',GOLD:'#d4ac0d',SILVER:'#5A6874'}
  const TYPE_C:  Record<string,string> = {POLICY:'#E74C3C',DEAL:'#E67E22',INCENTIVE:'#2ECC71',ZONE:'#3498DB',GROWTH:'#1A2C3E',REGULATORY:'#F1C40F'}

  return (
    <>
    <div style={{minHeight:'100vh',background:'#F0F2F5',fontFamily:"'Inter','Helvetica Neue',sans-serif",paddingTop:64}}>
      <BackgroundVideo/>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .hover-lift{transition:all 0.18s}.hover-lift:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.10)!important}
      `}</style>

      {/* ══ STICKY TOP BAR ══════════════════════════════════════════════ */}
      <div style={{background:'#FFFFFF',borderBottom:'1px solid #ECF0F1',padding:'7px 20px',position:'sticky',top:64,zIndex:100,boxShadow:'0 1px 6px rgba(0,0,0,0.04)'}}>
        <div style={{maxWidth:1920,margin:'0 auto',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <button onClick={()=>setSidebar(!sidebarOn)} style={{display:'flex',alignItems:'center',gap:5,padding:'5px 11px',background:sidebarOn?'rgba(46,204,113,0.1)':'#F8F9FA',border:`1px solid ${sidebarOn?'rgba(46,204,113,0.25)':'#ECF0F1'}`,borderRadius:8,cursor:'pointer',fontSize:11,fontWeight:700,color:sidebarOn?'#27ae60':'#5A6874',transition:'all 0.15s'}}>
            <Filter size={12}/>{sidebarOn?'Hide':'Show'} Filters
          </button>
          <div style={{flex:1}}>
            <div style={{fontSize:9,fontWeight:700,color:'#C8D0D6',textTransform:'uppercase',letterSpacing:'0.12em'}}>Intelligence Dashboard</div>
            <div style={{fontSize:15,fontWeight:900,color:'#1A2C3E',lineHeight:1.1}}>Global FDI Monitor — Live Operations</div>
          </div>
          {/* KPI chips update with filters */}
          {[[`${filtered.length} Economies`,'#2ECC71'],[`${filteredSignals.length} Signals`,'#3498DB'],['Agents LIVE','#9B59B6']].map(([l,c])=>(
            <div key={String(l)} style={{display:'flex',alignItems:'center',gap:4,padding:'4px 10px',background:`${c}0e`,border:`1px solid ${c}22`,borderRadius:18,fontSize:10,fontWeight:700,color:String(c)}}>
              <div style={{width:5,height:5,borderRadius:'50%',background:String(c),animation:'pulse 1.5s infinite'}}/>{l}
            </div>
          ))}
          <div style={{padding:'5px 12px',background:'#F8F9FA',borderRadius:9,border:'1px solid #ECF0F1',textAlign:'center'}}>
            <div style={{fontSize:13,fontWeight:800,color:'#1A2C3E',fontFamily:'JetBrains Mono,monospace'}}>{time.toLocaleTimeString()}</div>
            <div style={{fontSize:8,color:'#C8D0D6',marginTop:1}}>{time.toLocaleDateString('en-GB',{day:'2-digit',month:'short'}).toUpperCase()}</div>
          </div>
          <Link href="/pipeline-report" style={{display:'flex',alignItems:'center',gap:5,padding:'6px 12px',background:'linear-gradient(135deg,#2ECC71,#27ae60)',color:'white',borderRadius:20,textDecoration:'none',fontSize:10,fontWeight:800,boxShadow:'0 3px 10px rgba(46,204,113,0.28)'}}>
            <BarChart3 size={10}/> Agent Report
          </Link>
        </div>
      </div>

      {/* ══ THREE-COLUMN MAIN LAYOUT ════════════════════════════════════ */}
      <div style={{maxWidth:1920,margin:'0 auto',padding:'12px 16px',display:'grid',gap:12,alignItems:'start',
        gridTemplateColumns:sidebarOn?'260px 1fr 280px':'1fr 280px'}}>

        {/* ════ LEFT: Filter Panel ═══════════════════════════════════════ */}
        {sidebarOn && (
          <div style={{position:'sticky',top:128}}>
            <FilterPanel/>
          </div>
        )}

        {/* ════ CENTER: Main Visualizations ══════════════════════════════ */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>

          {/* ── CENTER TOP: KPI Cards (4) ── update with filters */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
            {[
              {label:'Total FDI Inflows', value:`$${totalFDI}B`,  sub:`${filtered.length} economies`,  color:'#2ECC71',icon:'💰',prev:totalFDI*0.88},
              {label:'Jobs Pipeline',     value:totalJobs>=1000?`${(totalJobs/1000).toFixed(0)}K`:totalJobs,sub:'projected roles', color:'#3498DB',icon:'👥',prev:totalJobs*0.87},
              {label:'Active Deals',      value:totalDeals,        sub:'tracked investments',color:'#9B59B6',icon:'🤝',prev:totalDeals*0.82},
              {label:'Avg GOSA Score',    value:avgGOSA,           sub:'composite score',   color:'#F1C40F',icon:'📊',prev:avgGOSA-2.1},
            ].map(({label,value,sub,color,icon,prev})=>{
              const chg = typeof value==='number' ? ((value-prev)/prev*100).toFixed(1) : null
              return (
                <Card key={label} className="hover-lift" style={{cursor:'default'}}>
                  <div style={{padding:'14px 15px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                      <span style={{fontSize:9.5,fontWeight:700,color:'#5A6874',textTransform:'uppercase',letterSpacing:'0.08em',lineHeight:1.4,maxWidth:'75%'}}>{label}</span>
                      <div style={{width:30,height:30,borderRadius:9,background:`${color}12`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>{icon}</div>
                    </div>
                    <div style={{fontSize:24,fontWeight:900,color:color,fontFamily:'JetBrains Mono,monospace',lineHeight:1,marginBottom:2}}>{value}</div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div style={{fontSize:9,color:'#C8D0D6'}}>{sub}</div>
                      {chg&&<div style={{fontSize:9,fontWeight:700,color:Number(chg)>0?'#27ae60':'#E74C3C',display:'flex',alignItems:'center',gap:1}}>
                        {Number(chg)>0?<TrendingUp size={8}/>:<TrendingDown size={8}/>}{Number(chg)>0?'+':''}{chg}%
                      </div>}
                    </div>
                    <div style={{marginTop:8,height:3,background:'#F0F2F4',borderRadius:2,overflow:'hidden'}}>
                      <div style={{height:'100%',width:'100%',background:`linear-gradient(90deg,${color}30,${color})`,borderRadius:2}}/>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* ── CENTER: Globe ── */}
          <Card>
            <CardHead icon={<Globe size={13}/>} title="Global Opportunity Map" badge={`${filtered.length} ECONOMIES`}
              extra={<div style={{display:'flex',gap:8,alignItems:'center'}}>
                {[['#2ECC71','TOP ≥80'],['#3498DB','HIGH 60-79'],['#F1C40F','DEV <60']].map(([c,l])=>(
                  <div key={l} style={{display:'flex',alignItems:'center',gap:4,fontSize:9,color:'#5A6874',fontWeight:600}}>
                    <div style={{width:7,height:7,borderRadius:'50%',background:c as string}}/>{l}
                  </div>
                ))}
              </div>}/>
            <div style={{padding:'10px 12px 12px'}}>
              <div style={{borderRadius:12,overflow:'hidden',height:280,background:'#080f1c',border:'1px solid rgba(255,255,255,0.06)'}}>
                <Globe3DWidget onSelect={code=>{
                  const eco=ECOS.find(e=>e.code===code)
                  if(eco){ setSelId(eco.id); setShowAn(true); setSignalNote(null) }
                }}/>
              </div>
            </div>
          </Card>

          {/* ── CENTER MIDDLE: Lollipop Chart (click bar → update all) ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <Card>
              <CardHead icon={<BarChart3 size={13}/>} title="Global Future Readiness Score" badge="GFR · CLICK TO DRILL"/>
              <div style={{padding:'6px 10px',maxHeight:340,overflowY:'auto'}}>
                {filtered.slice(0,13).map((eco,i)=>{
                  const pct=Math.max(4,((eco.gosa-58)/(96-58))*100)
                  const color=sc(eco.gosa), isSel=selId===eco.id
                  return (
                    <div key={eco.id} onClick={()=>handleBarClick(eco.id)}
                      title={`Click to drill into ${eco.name}`}
                      style={{display:'flex',alignItems:'center',gap:7,padding:'5px 7px',borderRadius:9,cursor:'pointer',marginBottom:2,
                        transition:'all 0.16s',
                        background:isSel?`${color}0d`:'transparent',
                        border:`1.5px solid ${isSel?color+'30':'transparent'}`}}
                      onMouseEnter={e=>{if(!isSel){(e.currentTarget as any).style.background='#F4F6F8'}}}
                      onMouseLeave={e=>{if(!isSel){(e.currentTarget as any).style.background='transparent'}}}>
                      <span style={{fontSize:8,fontWeight:700,color:'#C8D0D6',minWidth:14,fontFamily:'JetBrains Mono,monospace'}}>#{i+1}</span>
                      <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${eco.code}.svg`} width="17" height="11" style={{borderRadius:2,flexShrink:0}} alt="" onError={e=>{(e.target as any).style.display='none'}}/>
                      <span style={{fontSize:10.5,color:isSel?'#1A2C3E':'#5A6874',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:isSel?700:400}}>{eco.name}</span>
                      <div style={{width:52,height:5,background:'#F0F2F4',borderRadius:3,overflow:'hidden',position:'relative'}}>
                        <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${color}60,${color})`,borderRadius:3,transition:'width 0.5s ease'}}/>
                      </div>
                      <div style={{width:7,height:7,borderRadius:'50%',background:color,border:'2px solid white',boxShadow:`0 0 5px ${color}70`,flexShrink:0}}/>
                      <span style={{fontSize:11,fontWeight:900,color:color,fontFamily:'JetBrains Mono,monospace',minWidth:32,textAlign:'right'}}>{eco.gosa}</span>
                    </div>
                  )
                })}
              </div>
              <div style={{padding:'7px 10px',borderTop:'1px solid #F8F9FA'}}>
                <Link href="/investment-analysis" style={{display:'block',textAlign:'center',padding:'6px',background:'rgba(46,204,113,0.06)',borderRadius:8,textDecoration:'none',fontSize:10,fontWeight:700,color:'#27ae60',border:'1px solid rgba(46,204,113,0.12)'}}>Full Benchmark & Impact Analysis →</Link>
              </div>
            </Card>

            {/* ── CENTER MIDDLE: Bullet Chart (updates with selected economy) ── */}
            <Card>
              <CardHead icon={<Shield size={13}/>} title="Doing Business Indicators" badge={selEco.name.toUpperCase()}/>
              <div style={{padding:'8px 12px'}}>
                {bulletData.map(({label,score,global})=>(
                  <div key={label} style={{marginBottom:6}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                      <span style={{fontSize:9,color:'#5A6874',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'62%'}}>{label}</span>
                      <div style={{display:'flex',gap:8}}>
                        <span style={{fontSize:9,color:'#C8D0D6'}}>Avg:{global}</span>
                        <span style={{fontSize:10,fontWeight:800,color:sc(score),fontFamily:'JetBrains Mono,monospace'}}>{score}</span>
                      </div>
                    </div>
                    <div style={{height:6,background:'#F0F2F4',borderRadius:3,overflow:'hidden',position:'relative'}}>
                      {/* Global average reference */}
                      <div style={{position:'absolute',left:global+'%',top:0,bottom:0,width:1.5,background:'rgba(0,0,0,0.15)',zIndex:1}}/>
                      <div style={{height:'100%',width:score+'%',background:`linear-gradient(90deg,${sc(score)}50,${sc(score)})`,borderRadius:3,transition:'width 0.6s ease'}}/>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* ── CENTER BOTTOM: Radar Chart (updates with sector filter/selected economy) ── */}
          <Card>
            <CardHead icon={<Target size={13}/>} title="Sector Assessment" badge={filters.sector!=='All'?filters.sector.toUpperCase():'ALL SECTORS · 5 DIMENSIONS'}/>
            <div style={{padding:'10px 12px',display:'flex',gap:14,alignItems:'center'}}>
              {/* Inline SVG radar */}
              <div style={{flexShrink:0}}>
                {(()=>{
                  const size=180,cx=90,cy=90,r=70,axes=5
                  const rings=[0.2,0.4,0.6,0.8,1]
                  const labels=['Regulatory','Incentives','Labor','Infrastructure','Export']
                  const pts=(scores:number[])=>scores.map((s,i)=>{
                    const angle=(i/axes)*Math.PI*2-Math.PI/2
                    const rr=r*(s/100)
                    return [cx+rr*Math.cos(angle),cy+rr*Math.sin(angle)]
                  })
                  return (
                    <svg width={size} height={size}>
                      {rings.map(ring=>
                        Array.from({length:axes}).map((_,i)=>{
                          const a1=(i/axes)*Math.PI*2-Math.PI/2,a2=((i+1)/axes)*Math.PI*2-Math.PI/2
                          return <line key={`${ring}-${i}`} x1={cx+(r*ring)*Math.cos(a1)} y1={cy+(r*ring)*Math.sin(a1)} x2={cx+(r*ring)*Math.cos(a2)} y2={cy+(r*ring)*Math.sin(a2)} stroke="#F0F2F4" strokeWidth="1"/>
                        })
                      )}
                      {Array.from({length:axes}).map((_,i)=>{
                        const a=(i/axes)*Math.PI*2-Math.PI/2
                        return <line key={i} x1={cx} y1={cy} x2={cx+r*Math.cos(a)} y2={cy+r*Math.sin(a)} stroke="#ECF0F1" strokeWidth="1"/>
                      })}
                      {radarData.map((ds,di)=>{
                        const p=pts(ds.scores)
                        const d='M'+p.map(([x,y])=>`${x},${y}`).join('L')+'Z'
                        return <g key={di}><path d={d} fill={ds.color+'18'} stroke={ds.color} strokeWidth="1.5"/>{p.map(([x,y],j)=><circle key={j} cx={x} cy={y} r="3" fill={ds.color}/>)}</g>
                      })}
                      {labels.map((l,i)=>{
                        const a=(i/axes)*Math.PI*2-Math.PI/2
                        const lx=cx+(r+12)*Math.cos(a),ly=cy+(r+12)*Math.sin(a)
                        return <text key={l} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#5A6874" fontFamily="Inter,sans-serif" fontWeight="600">{l}</text>
                      })}
                    </svg>
                  )
                })()}
              </div>
              <div style={{flex:1,display:'flex',flexDirection:'column',gap:7}}>
                {radarData.map(sec=>(
                  <div key={sec.label} style={{padding:'8px 10px',background:'#FAFBFC',borderRadius:9,border:'1px solid #F0F2F4'}}>
                    <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
                      <div style={{width:8,height:3,borderRadius:2,background:sec.color,flexShrink:0}}/>
                      <span style={{fontSize:11,fontWeight:700,color:'#1A2C3E',flex:1}}>{sec.label}</span>
                      <span style={{fontSize:13,fontWeight:900,color:sec.color,fontFamily:'JetBrains Mono,monospace'}}>{Math.round(sec.scores.reduce((a,b)=>a+b)/sec.scores.length)}</span>
                    </div>
                    <div style={{height:3.5,background:'#F0F2F4',borderRadius:2,overflow:'hidden'}}>
                      <div style={{height:'100%',width:Math.round(sec.scores.reduce((a,b)=>a+b)/sec.scores.length)+'%',background:sec.color,borderRadius:2,transition:'width 0.5s ease'}}/>
                    </div>
                  </div>
                ))}
                <Link href="/sectors" style={{display:'block',textAlign:'center',padding:'6px',background:'#F8F9FA',borderRadius:8,textDecoration:'none',fontSize:10,fontWeight:700,color:'#1A2C3E',border:'1px solid #ECF0F1'}}>Sector Monitor →</Link>
              </div>
            </div>
          </Card>

          {/* ── BOTTOM LEFT: Signal Feed (click → drills to country) ── */}
          <Card id="signal-feed">
            <CardHead icon={<Zap size={13}/>} title="Live Investment Signals" badge={`${filteredSignals.length} SIGNALS`}
              extra={<div style={{display:'flex',alignItems:'center',gap:5,padding:'2px 8px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(46,204,113,0.18)',borderRadius:14}}>
                <div style={{width:5,height:5,borderRadius:'50%',background:'#2ECC71',animation:'pulse 1.5s infinite'}}/>
                <span style={{fontSize:9,fontWeight:700,color:'#27ae60'}}>LIVE</span>
              </div>}/>
            <div style={{maxHeight:420,overflowY:'auto',padding:'8px 10px',display:'flex',flexDirection:'column',gap:6}}>
              {filteredSignals.map(sig=>{
                const gc=GRADE_C[sig.grade]||'#5A6874'
                const tc=TYPE_C[sig.type]||'#5A6874'
                const isExp=expandedSig===sig.id
                const isSel=selId===sig.eid
                return (
                  <div key={sig.id} onClick={()=>handleSignalClick(sig)}
                    style={{borderRadius:11,border:`1.5px solid ${isSel?tc+'40':tc+'15'}`,borderLeft:`3px solid ${tc}`,
                      background:isExp?`${tc}04`:isSel?`${gc}05`:'#FAFBFC',cursor:'pointer',
                      transition:'all 0.16s',boxShadow:isSel?`0 2px 12px ${tc}14`:'none'}}
                    onMouseEnter={e=>{if(!isExp)(e.currentTarget as any).style.background=`${tc}06`}}
                    onMouseLeave={e=>{if(!isExp)(e.currentTarget as any).style.background=isSel?`${gc}05`:'#FAFBFC'}}>
                    <div style={{padding:'8px 10px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                        <span style={{fontSize:8,fontWeight:800,padding:'2px 6px',borderRadius:5,background:`${gc}14`,color:gc}}>{sig.grade}</span>
                        <span style={{fontSize:8,padding:'2px 6px',borderRadius:5,background:`${tc}12`,color:tc,fontWeight:600}}>{sig.type}</span>
                        <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${sig.code}.svg`} width="13" height="9" style={{borderRadius:1}} alt="" onError={e=>{(e.target as any).style.display='none'}}/>
                        <span style={{fontSize:10,fontWeight:600,color:'#1A2C3E',flex:1}}>{sig.country}</span>
                        <span style={{fontSize:9,fontWeight:900,color:gc,fontFamily:'JetBrains Mono,monospace'}}>{sig.sco}</span>
                        <span style={{fontSize:8,color:'#C8D0D6',fontFamily:'JetBrains Mono,monospace'}}>{sig.ts}</span>
                      </div>
                      <div style={{fontSize:11,fontWeight:600,color:'#1A2C3E',lineHeight:1.4}}>{sig.title}</div>
                    </div>
                    {isExp&&(
                      <div style={{padding:'0 10px 10px',borderTop:'1px solid #F0F2F4',animation:'fadeIn 0.25s ease'}}>
                        <div style={{fontSize:11,color:'#5A6874',lineHeight:1.6,margin:'8px 0'}}><strong style={{color:'#1A2C3E'}}>Strategic: </strong>{sig.strategic}</div>
                        <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                          <a href={sig.url} target="_blank" rel="noopener noreferrer"
                            onClick={e=>e.stopPropagation()}
                            style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:10,fontWeight:600,color:'#3498DB',textDecoration:'none',padding:'3px 8px',background:'rgba(52,152,219,0.08)',borderRadius:7,border:'1px solid rgba(52,152,219,0.15)'}}>
                            <ExternalLink size={9}/>{sig.src}
                          </a>
                          <span style={{fontSize:9,color:'#C8D0D6',fontFamily:'JetBrains Mono,monospace'}}>SHA: {sig.hash}…</span>
                          <span style={{fontSize:9,padding:'2px 7px',borderRadius:7,background:sig.impact==='HIGH'?'rgba(231,76,60,0.08)':'rgba(52,152,219,0.08)',color:sig.impact==='HIGH'?'#E74C3C':'#3498DB',fontWeight:700}}>{sig.impact}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              {filteredSignals.length===0&&<div style={{padding:20,textAlign:'center',fontSize:11,color:'#C8D0D6'}}>No signals match current filters</div>}
            </div>
            <div style={{padding:'8px 14px',borderTop:'1px solid #F8F9FA',display:'flex',justifyContent:'space-between'}}>
              <span style={{fontSize:10,color:'#C8D0D6'}}>{filteredSignals.length} signals · click card to drill</span>
              <Link href="/signals" style={{fontSize:11,fontWeight:700,color:'#2ECC71',textDecoration:'none'}}>Full Signal Feed →</Link>
            </div>
          </Card>

          {/* ── BOTTOM RIGHT: Analysis Section (slides in on click) ── */}
          {showAnalysis && (
            <div id="analysis-panel" style={{animation:'slideUp 0.4s cubic-bezier(0.2,0.9,0.4,1) both'}}>
              <Card>
                <CardHead icon={<Activity size={13}/>} title={`Investment Climate — ${selEco.name}`}
                  extra={<button onClick={()=>setShowAn(false)} style={{background:'none',border:'none',cursor:'pointer',padding:3,borderRadius:6,display:'flex',transition:'background 0.12s'}}
                    onMouseEnter={e=>{(e.currentTarget as any).style.background='rgba(231,76,60,0.1)'}}
                    onMouseLeave={e=>{(e.currentTarget as any).style.background='none'}}>
                    <X size={13} color="#E74C3C"/>
                  </button>}/>
                <div style={{padding:'16px 18px'}}>
                  {/* Signal context if opened via signal click */}
                  {signalNote&&(
                    <div style={{padding:'10px 14px',background:'rgba(52,152,219,0.06)',borderRadius:10,border:'1px solid rgba(52,152,219,0.15)',marginBottom:14,display:'flex',gap:8,alignItems:'flex-start'}}>
                      <Zap size={14} color="#3498DB" style={{flexShrink:0,marginTop:1}}/>
                      <div>
                        <div style={{fontSize:10,fontWeight:800,color:'#2980b9',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:3}}>Signal Strategic Implication</div>
                        <div style={{fontSize:12,color:'#1A2C3E',lineHeight:1.6}}>{signalNote}</div>
                      </div>
                    </div>
                  )}
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                    <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${selEco.code}.svg`} width="50" height="34" style={{borderRadius:5,boxShadow:'0 2px 8px rgba(0,0,0,0.1)',flexShrink:0}} alt="" onError={e=>{(e.target as any).style.display='none'}}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:18,fontWeight:900,color:'#1A2C3E'}}>{selEco.name}</div>
                      <div style={{display:'flex',gap:8,alignItems:'center',marginTop:3}}>
                        <span style={{fontSize:26,fontWeight:900,color:sc(selEco.gosa),fontFamily:'JetBrains Mono,monospace'}}>{selEco.gosa}</span>
                        <div>
                          <div style={{fontSize:11,fontWeight:700,color:selEco.t>0?'#27ae60':'#E74C3C',display:'flex',gap:3,alignItems:'center'}}>
                            {selEco.t>0?<TrendingUp size={11}/>:<TrendingDown size={11}/>}{selEco.t>0?'+':''}{selEco.t} MoM
                          </div>
                          <div style={{fontSize:9,color:'#C8D0D6'}}>GOSA Score</div>
                        </div>
                        <span style={{marginLeft:4,fontSize:10,fontWeight:800,padding:'3px 9px',borderRadius:20,...(selEco.cat==='TOP'?{background:'rgba(46,204,113,0.1)',color:'#27ae60'}:{background:'rgba(52,152,219,0.1)',color:'#2980b9'})}}>{selEco.cat} TIER</span>
                      </div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:20,fontWeight:900,color:'#1A2C3E',fontFamily:'JetBrains Mono,monospace'}}>${selEco.fdi}B</div>
                      <div style={{fontSize:9,color:'#C8D0D6'}}>FDI Inflow</div>
                      <div style={{fontSize:13,fontWeight:800,color:'#3498DB',marginTop:4}}>{selEco.jobs.toLocaleString()}</div>
                      <div style={{fontSize:9,color:'#C8D0D6'}}>Jobs Pipeline</div>
                    </div>
                  </div>
                  <div style={{padding:'12px 14px',background:'#F8F9FA',borderRadius:10,borderLeft:'3px solid #2ECC71',marginBottom:14}}>
                    <div style={{fontSize:10,fontWeight:800,color:'#2ECC71',textTransform:'uppercase',letterSpacing:'0.09em',marginBottom:6}}>📋 Investment Climate Analysis</div>
                    <p style={{margin:0,fontSize:12,color:'#1A2C3E',lineHeight:1.7}}>
                      <strong>{selEco.name}</strong> maintains a <strong style={{color:sc(selEco.gosa)}}>{selEco.cat} Tier</strong> GOSA score of <strong style={{color:sc(selEco.gosa)}}>{selEco.gosa}</strong>, {selEco.t>0?`up +${selEco.t}`:`down ${Math.abs(selEco.t)}`} month-on-month. The country's <strong>{selEco.sec}</strong> sector is driving the majority of new investment interest, supported by {selEco.deals} active deals in the pipeline. With <strong>${selEco.fdi}B</strong> in tracked FDI inflows and {selEco.jobs.toLocaleString()} projected jobs, {selEco.name} remains one of the most monitored economies on the platform.
                    </p>
                  </div>
                  <div style={{display:'flex',gap:10,marginTop:6}}>
                    <Link href={'/country/'+selEco.id} style={{flex:1,padding:'10px',textAlign:'center',background:'#1A2C3E',color:'white',borderRadius:10,textDecoration:'none',fontSize:11,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:5}}>
                      <Download size={12}/> Full Country Report
                    </Link>
                    <Link href="/scenario-planner" style={{flex:1,padding:'10px',textAlign:'center',background:'rgba(52,152,219,0.08)',color:'#2980b9',borderRadius:10,textDecoration:'none',fontSize:11,fontWeight:700,border:'1px solid rgba(52,152,219,0.18)',display:'flex',alignItems:'center',justifyContent:'center',gap:5}}>
                      <Target size={12}/> Scenario Planner
                    </Link>
                    <Link href="/pmp" style={{flex:1,padding:'10px',textAlign:'center',background:'rgba(46,204,113,0.07)',color:'#27ae60',borderRadius:10,textDecoration:'none',fontSize:11,fontWeight:700,border:'1px solid rgba(46,204,113,0.18)',display:'flex',alignItems:'center',justifyContent:'center',gap:5}}>
                      <Globe size={12}/> Mission Planning
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* ════ RIGHT COLUMN ══════════════════════════════════════════ */}
        <div style={{display:'flex',flexDirection:'column',gap:12,position:'sticky',top:128}}>

          {/* ── RIGHT TOP: Details Panel (updates on bar click + filter) ── */}
          <Card>
            <CardHead icon={<BarChart3 size={13}/>} title="Details Panel" badge={selEco.name.toUpperCase()}
              extra={showAnalysis&&<button onClick={()=>setShowAn(false)} style={{background:'none',border:'none',cursor:'pointer',padding:2,borderRadius:5,display:'flex'}}><X size={12} color="#E74C3C"/></button>}/>
            <div style={{padding:'12px 14px'}}>
              <div style={{display:'flex',alignItems:'center',gap:9,padding:'10px',background:'#F8F9FA',borderRadius:11,marginBottom:12}}>
                <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${selEco.code}.svg`} width="40" height="27" style={{borderRadius:4,boxShadow:'0 2px 6px rgba(0,0,0,0.08)',flexShrink:0}} alt="" onError={e=>{(e.target as any).style.display='none'}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:900,color:'#1A2C3E'}}>{selEco.name}</div>
                  <span style={{fontSize:9,fontWeight:800,padding:'2px 7px',borderRadius:10,...(selEco.cat==='TOP'?{background:'rgba(46,204,113,0.1)',color:'#27ae60'}:{background:'rgba(52,152,219,0.1)',color:'#2980b9'})}}>{selEco.cat}</span>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:28,fontWeight:900,color:sc(selEco.gosa),fontFamily:'JetBrains Mono,monospace',lineHeight:1}}>{selEco.gosa}</div>
                  <div style={{fontSize:10,fontWeight:700,color:selEco.t>0?'#27ae60':'#E74C3C',display:'flex',alignItems:'center',gap:2,justifyContent:'flex-end'}}>
                    {selEco.t>0?<TrendingUp size={9}/>:<TrendingDown size={9}/>}{selEco.t>0?'+':''}{selEco.t}
                  </div>
                </div>
              </div>

              {/* Metrics grid */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:12}}>
                {[['FDI Inflows','$'+selEco.fdi+'B','#2ECC71'],['Jobs',selEco.jobs.toLocaleString(),'#3498DB'],['Deals',selEco.deals,'#9B59B6'],['Sector',selEco.sec.split(' ').slice(0,2).join(' '),'#F1C40F']].map(([l,v,c])=>(
                  <div key={String(l)} style={{padding:'8px 10px',background:'#F8F9FA',borderRadius:9,border:'1px solid #F0F2F4'}}>
                    <div style={{fontSize:8,color:'#C8D0D6',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:1}}>{l}</div>
                    <div style={{fontSize:13,fontWeight:900,color:String(c),fontFamily:'JetBrains Mono,monospace'}}>{v}</div>
                  </div>
                ))}
              </div>

              {/* GOSA layers */}
              {[['L1 Doing Business',selEco.l1.slice(0,4).reduce((a,b)=>a+b)/4,'#2ECC71'],
                ['L2 Sector Attraction',selEco.l2.slice(0,3).reduce((a,b)=>a+b)/3,'#3498DB'],
                ['L3 Zone Availability',selEco.l1.slice(4,6).reduce((a,b)=>a+b)/2,'#F1C40F'],
                ['L4 Market Intelligence',selEco.l2.slice(3,6).reduce((a,b)=>a+b)/3,'#9B59B6'],
              ].map(([l,v,c])=>(
                <div key={String(l)} style={{marginBottom:7}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:1}}>
                    <span style={{fontSize:9.5,color:'#5A6874'}}>{l}</span>
                    <span style={{fontSize:10,fontWeight:800,color:String(c),fontFamily:'JetBrains Mono,monospace'}}>{Math.round(v as number)}</span>
                  </div>
                  <div style={{height:4,background:'#F0F2F4',borderRadius:2,overflow:'hidden'}}>
                    <div style={{height:'100%',width:(v as number)+'%',background:String(c),borderRadius:2,transition:'width 0.6s ease'}}/>
                  </div>
                </div>
              ))}

              <button onClick={()=>setShowAn(!showAnalysis)}
                style={{width:'100%',marginTop:10,padding:'9px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(46,204,113,0.18)',borderRadius:10,cursor:'pointer',fontSize:11,fontWeight:700,color:'#27ae60',display:'flex',alignItems:'center',justifyContent:'center',gap:5,transition:'all 0.14s'}}
                onMouseEnter={e=>{(e.currentTarget as any).style.background='rgba(46,204,113,0.14)'}}
                onMouseLeave={e=>{(e.currentTarget as any).style.background='rgba(46,204,113,0.08)'}}>
                {showAnalysis?'Hide':'View'} Full Analysis <ChevronRight size={12}/>
              </button>
            </div>
          </Card>

          {/* ── RIGHT BOTTOM: GFR Dimension Scores (updates with selected country) ── */}
          <Card>
            <CardHead icon={<Activity size={13}/>} title="GFR Dimension Scores" badge={selEco.code}/>
            <div style={{padding:'12px 14px'}}>
              {GFR_DIMS.map((dim,i)=>{
                const score=selEco.l2[i]||80
                return (
                  <div key={dim.code} style={{marginBottom:8}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:2}}>
                      <div style={{display:'flex',alignItems:'center',gap:5}}>
                        <span style={{fontSize:9,fontWeight:800,color:dim.color,fontFamily:'JetBrains Mono,monospace'}}>{dim.code}</span>
                        <span style={{fontSize:8.5,color:'#C8D0D6',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:130}}>{dim.name}</span>
                      </div>
                      <div style={{display:'flex',gap:6,alignItems:'center'}}>
                        <span style={{fontSize:8,color:'#C8D0D6'}}>{dim.w}</span>
                        <span style={{fontSize:12,fontWeight:900,color:dim.color,fontFamily:'JetBrains Mono,monospace'}}>{score}</span>
                      </div>
                    </div>
                    <div style={{height:4,background:'#F0F2F4',borderRadius:2,overflow:'hidden'}}>
                      <div style={{height:'100%',width:score+'%',background:`linear-gradient(90deg,${dim.color}50,${dim.color})`,borderRadius:2,transition:'width 0.65s ease'}}/>
                    </div>
                  </div>
                )
              })}
              <Link href="/gfr" style={{display:'block',textAlign:'center',padding:'7px',background:'#F8F9FA',borderRadius:8,textDecoration:'none',fontSize:10,fontWeight:700,color:'#1A2C3E',border:'1px solid #ECF0F1',marginTop:6}}>Full GFR Ranking →</Link>
            </div>
          </Card>


        </div>
      </div>
    </div>

    <Footer/>
    </>
  )
}