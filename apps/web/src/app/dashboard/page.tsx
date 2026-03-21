'use client'
import { useState, useEffect } from 'react'
import { BackgroundVideo } from '@/components/shared/BackgroundVideo'
import { CountryFlag } from '@/components/shared/CountryFlag'
import { Globe3D } from '@/components/hero/Globe3D'
import { LollipopChart } from '@/components/charts/LollipopChart'
import { BulletChart } from '@/components/charts/BulletChart'
import { RadarChart } from '@/components/charts/RadarChart'
import Link from 'next/link'
import { Filter, Zap, Globe, Shield, Target, BarChart3, Activity, ChevronRight } from 'lucide-react'

const ECONOMIES = [
  {id:'SGP',code:'SG',name:'Singapore',    gosa:88.4,trend:+0.2,fdi:'$91B', category:'TOP',  region:'Asia Pacific'},
  {id:'DNK',code:'DK',name:'Denmark',      gosa:85.3,trend:+0.3,fdi:'$22B', category:'TOP',  region:'Europe'},
  {id:'KOR',code:'KR',name:'South Korea',  gosa:84.1,trend:+0.1,fdi:'$17B', category:'TOP',  region:'Asia Pacific'},
  {id:'USA',code:'US',name:'United States',gosa:83.9,trend:-0.2,fdi:'$349B',category:'TOP',  region:'Americas'},
  {id:'GBR',code:'GB',name:'United Kingdom',gosa:82.5,trend:-0.1,fdi:'$50B',category:'TOP',  region:'Europe'},
  {id:'ARE',code:'AE',name:'UAE',          gosa:82.1,trend:+1.2,fdi:'$23B', category:'TOP',  region:'Middle East'},
  {id:'MYS',code:'MY',name:'Malaysia',     gosa:81.2,trend:+0.4,fdi:'$22B', category:'HIGH', region:'Asia Pacific'},
  {id:'THA',code:'TH',name:'Thailand',     gosa:80.7,trend:+0.2,fdi:'$14B', category:'HIGH', region:'Asia Pacific'},
  {id:'VNM',code:'VN',name:'Vietnam',      gosa:79.4,trend:+0.5,fdi:'$24B', category:'HIGH', region:'Asia Pacific'},
  {id:'SAU',code:'SA',name:'Saudi Arabia', gosa:79.1,trend:+2.1,fdi:'$36B', category:'HIGH', region:'Middle East'},
  {id:'IDN',code:'ID',name:'Indonesia',    gosa:77.8,trend:+0.1,fdi:'$22B', category:'HIGH', region:'Asia Pacific'},
  {id:'IND',code:'IN',name:'India',        gosa:73.2,trend:+0.8,fdi:'$71B', category:'HIGH', region:'Asia Pacific'},
  {id:'BRA',code:'BR',name:'Brazil',       gosa:71.3,trend:+0.4,fdi:'$74B', category:'HIGH', region:'Americas'},
  {id:'MAR',code:'MA',name:'Morocco',      gosa:66.8,trend:+0.6,fdi:'$4B',  category:'HIGH', region:'Africa'},
  {id:'NZL',code:'NZ',name:'New Zealand',  gosa:86.7,trend:-0.1,fdi:'$9B',  category:'TOP',  region:'Oceania'},
]

const SECTOR_RADAR_DATA = [
  {scores:[88,92,76,84,90],color:'#2ECC71',label:'EV Battery'},
  {scores:[84,88,92,86,78],color:'#3498DB',label:'Data Centers'},
  {scores:[82,76,88,72,94],color:'#F1C40F',label:'Renewables'},
]

const POLICIES = [
  {code:'MY',country:'Malaysia',   policy:'100% FDI in data centers',          status:'NEW',   date:'Mar 2026'},
  {code:'AE',country:'UAE',        policy:'100% mainland foreign ownership',    status:'ACTIVE',date:'Feb 2026'},
  {code:'TH',country:'Thailand',   policy:'$2B EV battery incentive package',   status:'NEW',   date:'Mar 2026'},
  {code:'VN',country:'Vietnam',    policy:'50% CIT reduction EV manufacturing', status:'ACTIVE',date:'Jan 2026'},
  {code:'SA',country:'Saudi Arabia','policy':'30-day FDI license guarantee',     status:'NEW',   date:'Mar 2026'},
  {code:'IN',country:'India',      policy:'PLI Scheme 2.0 — $2.7B incentives',  status:'NEW',   date:'Mar 2026'},
]

const LIVE_SIGNALS = [
  {id:1,grade:'PLATINUM',type:'POLICY',  code:'MY',country:'Malaysia',   title:'FDI cap raised to 100% in data centers',   sco:96,ts:'2m'},
  {id:2,grade:'PLATINUM',type:'DEAL',    code:'AE',country:'UAE',         title:'Microsoft $3.3B AI commitment',             sco:97,ts:'1h'},
  {id:3,grade:'PLATINUM',type:'INCENTIVE',code:'TH',country:'Thailand',  title:'$2B EV battery subsidy approved',            sco:95,ts:'3h'},
  {id:4,grade:'GOLD',    type:'POLICY',  code:'SA',country:'Saudi Arabia','title':'30-day FDI license guarantee live',         sco:94,ts:'6h'},
  {id:5,grade:'GOLD',    type:'GROWTH',  code:'VN',country:'Vietnam',     title:'Electronics exports surge 34% YoY',          sco:92,ts:'1d'},
  {id:6,grade:'GOLD',    type:'ZONE',    code:'ID',country:'Indonesia',   title:'New Batam zone — 200ha greenfield ready',    sco:91,ts:'2d'},
]

const ZONES = [
  {name:'Jurong Island, SG',     code:'SG',type:'Industrial',avail:18,color:'#E74C3C'},
  {name:'Jebel Ali FZ, UAE',     code:'AE',type:'Multi-use', avail:14,color:'#E74C3C'},
  {name:'VSIP Binh Duong, VN',   code:'VN',type:'Manufacturing',avail:47,color:'#2ECC71'},
  {name:'Tanger Med, Morocco',   code:'MA',type:'Manufacturing',avail:62,color:'#2ECC71'},
  {name:'EEC Rayong, Thailand',  code:'TH',type:'EV / Auto',avail:58,color:'#2ECC71'},
  {name:'NEOM Industrial, SA',   code:'SA',type:'Mixed-use', avail:78,color:'#2ECC71'},
]

export default function Dashboard() {
  const [selId, setSelId] = useState<string>('SGP')
  const [filterCat, setFilterCat] = useState('ALL')
  const [filterRegion, setFilterRegion] = useState('ALL')
  const [filterSector, setFilterSector] = useState('ALL')
  const [filterGrade, setFilterGrade] = useState('ALL')
  const [signals, setSignals] = useState(LIVE_SIGNALS)
  const [time, setTime] = useState(new Date())

  useEffect(()=>{
    const iv=setInterval(()=>{
      setTime(new Date())
      if(Math.random()>0.65){
        const eco=ECONOMIES[Math.floor(Math.random()*6)]
        setSignals(p=>[{id:Date.now(),grade:'GOLD',type:'GROWTH',code:eco.code,country:eco.name,title:'New signal detected — scoring in progress',sco:70+Math.floor(Math.random()*20),ts:'now'},...p.slice(0,9)])
      }
    },4000)
    return ()=>clearInterval(iv)
  },[])

  const filteredEcos = ECONOMIES.filter(e=>{
    if(filterCat!=='ALL'&&e.category!==filterCat)return false
    if(filterRegion!=='ALL'&&e.region!==filterRegion)return false
    return true
  })

  const filteredSigs = signals.filter(s=>{
    if(filterGrade!=='ALL'&&s.grade!==filterGrade)return false
    return true
  })

  const selEco = ECONOMIES.find(e=>e.id===selId)||ECONOMIES[0]
  const regions = Array.from(new Set(ECONOMIES.map(e=>e.region)))
  const sc = (v:number)=>v>=80?'#2ECC71':v>=60?'#3498DB':'#F1C40F'

  const SelectField = ({label,value,options,onChange}:{label:string;value:string;options:string[];onChange:(v:string)=>void}) => (
    <div>
      <label className="text-[10px] font-bold text-text-light uppercase tracking-wider block mb-1">{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)}
        className="w-full px-3 py-2 bg-white border border-border-light rounded-xl text-sm text-text-primary focus:border-primary-teal focus:outline-none cursor-pointer">
        {options.map(o=><option key={o}>{o}</option>)}
      </select>
    </div>
  )

  return (
    <div className="min-h-screen bg-background-offwhite">
      <BackgroundVideo/>

      {/* TOP BAR */}
      <div className="sticky top-16 z-40 bg-white/98 backdrop-blur border-b border-border-light px-6 py-3 shadow-sm">
        <div className="max-w-[1920px] mx-auto flex items-center gap-4 flex-wrap">
          <div className="flex-1">
            <div className="text-[10px] font-bold text-text-light uppercase tracking-widest">Intelligence Dashboard</div>
            <div className="text-lg font-black text-primary-dark">Global FDI Monitor — Live</div>
          </div>
          {/* KPIs */}
          {[[`${filteredEcos.length} Economies`,'#2ECC71'],[`${filteredSigs.length} Signals`,'#3498DB'],['3 Agents LIVE','#F1C40F']].map(([l,c])=>(
            <div key={l} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{background:`${c}12`,color:c,border:`1px solid ${c}20`}}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:c}}/>
              {l}
            </div>
          ))}
          {/* Clock */}
          <div className="px-3 py-2 bg-background-offwhite rounded-xl border border-border-light text-center">
            <div className="text-sm font-black text-primary-dark font-mono">{time.toLocaleTimeString()}</div>
            <div className="text-[9px] text-text-light">{time.toLocaleDateString('en-GB',{day:'2-digit',month:'short'}).toUpperCase()}</div>
          </div>
          <Link href="/pipeline-report" className="btn-primary flex items-center gap-1.5 text-xs !px-4 !py-2">
            <BarChart3 size={11}/> Agent Report
          </Link>
        </div>
      </div>

      {/* ═══ 3-COLUMN LAYOUT ═══ */}
      <div className="max-w-[1920px] mx-auto px-4 py-4 grid gap-4" style={{gridTemplateColumns:'280px 1fr 300px',alignItems:'start'}}>

        {/* LEFT — FILTERS + ECONOMY LIST */}
        <div className="flex flex-col gap-4 sticky top-[120px]">

          {/* Filters */}
          <div className="floating-card !p-4">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border-light">
              <Filter size={13} className="text-primary-teal"/>
              <span className="text-xs font-black text-primary-dark uppercase tracking-wide">Dashboard Filters</span>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600">{filteredEcos.length}</span>
            </div>
            <div className="space-y-3">
              <SelectField label="Country Category" value={filterCat}
                options={['ALL','TOP','HIGH','DEV']}
                onChange={setFilterCat}/>
              <SelectField label="Region" value={filterRegion}
                options={['ALL',...regions]}
                onChange={setFilterRegion}/>
              <SelectField label="Sector Focus" value={filterSector}
                options={['ALL','EV Battery','Data Centers','Semiconductors','Renewables','AI & Technology']}
                onChange={setFilterSector}/>
              {(filterCat!=='ALL'||filterRegion!=='ALL'||filterSector!=='ALL')&&(
                <button onClick={()=>{setFilterCat('ALL');setFilterRegion('ALL');setFilterSector('ALL')}}
                  className="w-full py-2 text-xs font-semibold text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-all">
                  Clear Filters ×
                </button>
              )}
            </div>
          </div>

          {/* WIDGET 2: Lollipop — Top Economies */}
          <div className="floating-card !p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-border-light bg-background-offwhite flex items-center gap-2">
              <Globe size={13} className="text-primary-teal"/>
              <span className="text-xs font-black text-primary-dark uppercase tracking-wide flex-1">Investment Analysis</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600">GOSA</span>
            </div>
            <div className="p-3 max-h-[340px] overflow-y-auto">
              <LollipopChart economies={filteredEcos} selected={selId} onSelect={setSelId}/>
            </div>
            <div className="px-4 py-2.5 border-t border-border-light">
              <Link href="/investment-analysis" className="block text-center text-xs font-bold text-primary-teal py-2 bg-green-50 rounded-xl hover:bg-green-100 transition-all">
                Full Analysis Platform →
              </Link>
            </div>
          </div>

          {/* Country Detail */}
          <div className="floating-card !p-4">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border-light">
              <BarChart3 size={13} className="text-primary-teal"/>
              <span className="text-xs font-black text-primary-dark uppercase tracking-wide flex-1">{selEco.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600">GOSA</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background-offwhite rounded-xl mb-3">
              <CountryFlag code={selEco.code} size={40}/>
              <div className="flex-1">
                <div className="text-xs text-text-secondary">{selEco.region}</div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${selEco.category==='TOP'?'badge-top':'badge-high'}`}>{selEco.category}</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black font-mono" style={{color:sc(selEco.gosa)}}>{selEco.gosa}</div>
                <div className="text-xs font-bold" style={{color:selEco.trend>0?'#2ECC71':'#E74C3C'}}>
                  {selEco.trend>0?`▲+${selEco.trend}`:`▼${selEco.trend}`}
                </div>
              </div>
            </div>
            {[['L1 Doing Business',selEco.gosa*1.04,'#2ECC71'],['L2 Sector',selEco.gosa*0.97,'#3498DB'],['L3 Zones',selEco.gosa*1.01,'#F1C40F'],['L4 Intelligence',selEco.gosa*0.99,'#9B59B6']].map(([l,v,c])=>(
              <div key={String(l)} className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-text-secondary">{l}</span>
                  <span className="text-xs font-black font-mono" style={{color:String(c)}}>{Math.min(100,Math.round(v as number))}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{width:Math.min(100,v as number)+'%',background:String(c)}}/>
                </div>
              </div>
            ))}
            <div className="flex gap-2 mt-3">
              <Link href={'/country/'+selEco.id} className="flex-1 py-2 text-center text-xs font-bold text-primary-teal bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-all">Profile</Link>
              <Link href="/reports" className="flex-1 py-2 text-center text-xs font-bold text-text-primary bg-background-offwhite rounded-xl border border-border-light hover:border-primary-dark transition-all">Report</Link>
            </div>
          </div>
        </div>

        {/* CENTER — GLOBE + CHARTS */}
        <div className="flex flex-col gap-4">

          {/* WIDGET 1: Globe */}
          <div className="floating-card !p-5">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border-light">
              <Globe size={14} className="text-primary-teal"/>
              <span className="text-xs font-black text-primary-dark uppercase tracking-wide flex-1">Global Opportunity Map</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600">{filteredEcos.length} LIVE</span>
              <Link href="/pipeline-report" className="text-[10px] font-bold px-2 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all">
                Agent Report
              </Link>
            </div>
            <Globe3D onSelect={(code)=>{ const eco=ECONOMIES.find(e=>e.code===code); if(eco)setSelId(eco.id) }}/>
          </div>

          {/* WIDGET 3 + 4: Bullet + Radar side by side */}
          <div className="grid grid-cols-2 gap-4">
            {/* WIDGET 3: Bullet Chart — Doing Business */}
            <div className="floating-card !p-4">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border-light">
                <Shield size={13} className="text-primary-teal"/>
                <span className="text-xs font-black text-primary-dark uppercase tracking-wide flex-1">Doing Business</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">L1 LAYER</span>
              </div>
              <BulletChart/>
            </div>

            {/* WIDGET 4: Radar — Sector Matrix */}
            <div className="floating-card !p-4">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border-light">
                <Target size={13} className="text-primary-teal"/>
                <span className="text-xs font-black text-primary-dark uppercase tracking-wide flex-1">Sector Radar</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600">L2 LAYER</span>
              </div>
              <div className="flex gap-4 items-start">
                <RadarChart
                  datasets={SECTOR_RADAR_DATA}
                  labels={['Regs','Incentives','Labor','Infra','Export']}
                  size={170}/>
                <div className="flex-1 space-y-2">
                  {SECTOR_RADAR_DATA.map(sec=>(
                    <div key={sec.label} className="p-2 rounded-xl bg-background-offwhite border border-border-light">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-2.5 h-1 rounded-full" style={{background:sec.color}}/>
                        <span className="text-[11px] font-bold text-primary-dark flex-1">{sec.label}</span>
                        <span className="text-xs font-black font-mono" style={{color:sec.color}}>
                          {Math.round(sec.scores.reduce((a,b)=>a+b)/sec.scores.length)}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{width:Math.round(sec.scores.reduce((a,b)=>a+b)/sec.scores.length)+'%',background:sec.color}}/>
                      </div>
                    </div>
                  ))}
                  <Link href="/sectors" className="block text-center text-[10px] font-bold text-primary-teal py-2 bg-green-50 rounded-xl mt-2">Sector Monitor →</Link>
                </div>
              </div>
            </div>
          </div>

          {/* WIDGET 5: Investment Zones */}
          <div className="floating-card !p-4">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border-light">
              <Globe size={13} className="text-primary-teal"/>
              <span className="text-xs font-black text-primary-dark uppercase tracking-wide flex-1">Special Investment Zones</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">L3 LAYER</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {ZONES.map(z=>(
                <div key={z.name} className="p-3 bg-background-offwhite rounded-xl border border-border-light hover:border-primary-teal transition-all cursor-pointer group">
                  <div className="flex items-center gap-2 mb-2">
                    <CountryFlag code={z.code} size={18}/>
                    <span className="text-[10px] font-bold text-text-secondary truncate">{z.type}</span>
                  </div>
                  <div className="text-[11px] font-bold text-primary-dark mb-2 leading-tight">{z.name.split(',')[0]}</div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] text-text-light">Available</span>
                    <span className="text-sm font-black font-mono" style={{color:z.color}}>{z.avail}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{width:z.avail+'%',background:z.color}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WIDGET 6: Policy Monitor */}
          <div className="floating-card !p-4">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border-light">
              <Activity size={13} className="text-primary-teal"/>
              <span className="text-xs font-black text-primary-dark uppercase tracking-wide flex-1">Policy & Incentives Monitor</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600">LIVE</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {POLICIES.map(p=>(
                <div key={p.country} className="p-3 bg-background-offwhite rounded-xl border border-border-light hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <CountryFlag code={p.code} size={22}/>
                    <span className={`badge-${p.status.toLowerCase()}`}>{p.status}</span>
                  </div>
                  <div className="text-xs font-bold text-primary-dark mb-1">{p.country}</div>
                  <div className="text-[10px] text-text-secondary leading-snug mb-1.5">{p.policy}</div>
                  <div className="text-[9px] text-text-light font-mono">{p.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — SIGNAL FILTERS + FEED + QUICK NAV */}
        <div className="flex flex-col gap-4 sticky top-[120px]">

          {/* Signal Filters */}
          <div className="floating-card !p-4">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border-light">
              <Filter size={13} className="text-primary-teal"/>
              <span className="text-xs font-black text-primary-dark uppercase tracking-wide">Signal Filters</span>
            </div>
            <div className="space-y-3">
              <SelectField label="Grade" value={filterGrade}
                options={['ALL','PLATINUM','GOLD','SILVER']}
                onChange={setFilterGrade}/>
              <div className="text-[10px] font-mono text-text-light text-center py-2 bg-background-offwhite rounded-xl">
                {filteredSigs.length} signals · {time.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* WIDGET 7: Signals Feed */}
          <div className="floating-card !p-0 overflow-hidden flex-1">
            <div className="px-4 py-3 border-b border-border-light bg-background-offwhite flex items-center gap-2">
              <Zap size={13} className="text-primary-teal"/>
              <span className="text-xs font-black text-primary-dark uppercase tracking-wide flex-1">Investment Signals</span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary-teal">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-teal animate-pulse"/>
                LIVE
              </div>
            </div>
            <div className="max-h-[420px] overflow-y-auto p-2 space-y-1.5">
              {filteredSigs.map((sig,i)=>{
                const gc=sig.grade==='PLATINUM'?'#9B59B6':'#F1C40F'
                const tc=sig.type==='POLICY'?'#E74C3C':sig.type==='DEAL'?'#E67E22':sig.type==='INCENTIVE'?'#2ECC71':'#3498DB'
                return (
                  <div key={sig.id} className="p-2.5 rounded-xl bg-background-offwhite border-l-2 transition-all hover:bg-white hover:translate-x-0.5"
                    style={{borderColor:tc,animation:i===0?'slideInRight 0.4s ease both':'none'}}>
                    <div className="flex justify-between mb-1.5">
                      <div className="flex gap-1">
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full" style={{background:`${gc}15`,color:gc}}>{sig.grade.slice(0,4)}</span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold" style={{background:`${tc}10`,color:tc}}>{sig.type}</span>
                      </div>
                      <span className="text-[9px] font-black font-mono" style={{color:'#9B59B6'}}>{sig.sco}</span>
                    </div>
                    <div className="text-[11px] font-medium text-primary-dark leading-snug mb-1.5">{sig.title}</div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1.5">
                        <CountryFlag code={sig.code} size={12}/>
                        <span className="text-[9px] text-text-secondary">{sig.country}</span>
                      </div>
                      <span className="text-[9px] text-text-light font-mono">{sig.ts} ago</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="p-2.5 border-t border-border-light">
              <Link href="/signals" className="block text-center text-xs font-bold text-primary-teal py-2 bg-green-50 rounded-xl hover:bg-green-100 transition-all">
                Full Signals Feed →
              </Link>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="floating-card !p-4">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border-light">
              <ChevronRight size={13} className="text-primary-teal"/>
              <span className="text-xs font-black text-primary-dark uppercase tracking-wide">Platform</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                {href:'/gfr',         icon:'🏆',l:'GFR Ranking',      d:'25 economies'},
                {href:'/corridors',   icon:'🔀',l:'Corridors',         d:'12 bilateral'},
                {href:'/pipeline',    icon:'📋',l:'Pipeline',          d:'Deal board'},
                {href:'/scenario-planner',icon:'🔬',l:'Scenario',      d:'IRR/NPV'},
                {href:'/pipeline-report',icon:'📊',l:'Agent Report',   d:'Pipeline data'},
                {href:'/sources',     icon:'📡',l:'Sources',           d:'1000+'},
              ].map(({href,icon,l,d})=>(
                <Link key={href} href={href}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-background-offwhite border border-border-light hover:border-primary-teal hover:bg-green-50 transition-all">
                  <span className="text-base">{icon}</span>
                  <div><div className="text-[11px] font-bold text-primary-dark">{l}</div><div className="text-[9px] text-text-light">{d}</div></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
