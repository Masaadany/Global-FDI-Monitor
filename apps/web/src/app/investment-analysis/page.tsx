'use client'
import { useState } from 'react'
import { BackgroundVideo } from '@/components/shared/BackgroundVideo'
import { CountryFlag } from '@/components/shared/CountryFlag'
import { RadarChart } from '@/components/charts/RadarChart'
import { Download, TrendingUp, TrendingDown } from 'lucide-react'

const COUNTRIES = [
  {rank:1, code:'SG',name:'Singapore',    region:'Asia Pacific',sector:'Multi-sector',  size:'$1B+',  gosa:88.4,l1:92.1,l2:85.3,l3:87.2,l4:89.0,trend:+0.2,category:'TOP',   highlights:'#1 Trading Across Borders'},
  {rank:2, code:'NZ',name:'New Zealand',  region:'Oceania',       sector:'Agribusiness', size:'$250M+',gosa:86.7,l1:89.5,l2:84.1,l3:85.8,l4:87.3,trend:-0.1,category:'TOP',   highlights:'#1 Starting a Business'},
  {rank:3, code:'DK',name:'Denmark',      region:'Europe',        sector:'Renewables',   size:'$500M+',gosa:85.3,l1:87.2,l2:83.5,l3:84.9,l4:85.6,trend:+0.3,category:'TOP',   highlights:'#1 Contract Enforcement'},
  {rank:4, code:'KR',name:'South Korea',  region:'Asia Pacific',  sector:'Semiconductors',size:'$1B+', gosa:84.1,l1:86.0,l2:82.8,l3:83.5,l4:84.2,trend:+0.1,category:'TOP',   highlights:'#2 Electronics'},
  {rank:5, code:'AU',name:'Australia',    region:'Oceania',       sector:'Mining',       size:'$1B+',  gosa:82.8,l1:83.2,l2:82.4,l3:81.8,l4:83.6,trend:+0.1,category:'TOP',   highlights:'#1 Critical Minerals'},
  {rank:6, code:'US',name:'United States',region:'Americas',      sector:'AI Tech',      size:'$1B+',  gosa:83.9,l1:85.3,l2:82.1,l3:83.0,l4:85.1,trend:-0.2,category:'TOP',   highlights:'#1 AI Infrastructure'},
  {rank:7, code:'GB',name:'United Kingdom',region:'Europe',       sector:'Fintech',      size:'$500M+',gosa:82.5,l1:84.1,l2:81.4,l3:82.2,l4:82.3,trend:-0.1,category:'TOP',   highlights:'#1 Financial Services'},
  {rank:8, code:'AE',name:'UAE',          region:'Middle East',   sector:'Logistics',    size:'$250M+',gosa:82.1,l1:83.4,l2:81.2,l3:82.8,l4:81.0,trend:+1.2,category:'TOP',   highlights:'#1 ME Business Hub'},
  {rank:9, code:'MY',name:'Malaysia',     region:'Asia Pacific',  sector:'Data Centers', size:'$250M+',gosa:81.2,l1:82.5,l2:80.7,l3:81.8,l4:79.8,trend:+0.4,category:'HIGH',  highlights:'100% FDI approved'},
  {rank:10,code:'TH',name:'Thailand',     region:'Asia Pacific',  sector:'EV Battery',   size:'$250M+',gosa:80.7,l1:81.8,l2:80.2,l3:81.0,l4:79.8,trend:+0.2,category:'HIGH',  highlights:'EEC incentives'},
  {rank:11,code:'VN',name:'Vietnam',      region:'Asia Pacific',  sector:'Electronics',  size:'$100M+',gosa:79.4,l1:80.5,l2:79.1,l3:78.9,l4:79.1,trend:+0.5,category:'HIGH',  highlights:'Samsung supplier base'},
  {rank:12,code:'SA',name:'Saudi Arabia', region:'Middle East',   sector:'Renewables',   size:'$500M+',gosa:79.1,l1:77.3,l2:80.4,l3:82.1,l4:76.6,trend:+2.1,category:'HIGH',  highlights:'Vision 2030 reforms'},
  {rank:13,code:'ID',name:'Indonesia',    region:'Asia Pacific',  sector:'EV Battery',   size:'$500M+',gosa:77.8,l1:78.9,l2:77.3,l3:77.5,l4:77.5,trend:+0.1,category:'HIGH',  highlights:'Nickel reserves #1'},
  {rank:14,code:'IN',name:'India',        region:'Asia Pacific',  sector:'Semiconductors',size:'$1B+', gosa:73.2,l1:69.8,l2:74.6,l3:74.8,l4:73.6,trend:+0.8,category:'HIGH',  highlights:'PLI Scheme 2.0'},
  {rank:15,code:'BR',name:'Brazil',       region:'Americas',      sector:'Agribusiness', size:'$250M+',gosa:71.3,l1:68.4,l2:72.8,l3:71.2,l4:72.8,trend:+0.4,category:'HIGH',  highlights:'#1 Agri exports'},
  {rank:16,code:'MA',name:'Morocco',      region:'Africa',        sector:'Automotive',   size:'$100M+',gosa:66.8,l1:63.8,l2:68.2,l3:68.4,l4:66.8,trend:+0.6,category:'HIGH',  highlights:'EU corridor access'},
  {rank:17,code:'CN',name:'China',        region:'Asia Pacific',  sector:'Manufacturing',size:'$1B+',  gosa:64.2,l1:72.4,l2:66.8,l3:68.2,l4:49.4,trend:-0.4,category:'HIGH',  highlights:'Manufacturing scale'},
  {rank:18,code:'FR',name:'France',       region:'Europe',        sector:'AI / Energy',  size:'$500M+',gosa:81.6,l1:82.4,l2:81.8,l3:80.4,l4:81.8,trend:+0.2,category:'TOP',   highlights:'Choose France summit'},
  {rank:19,code:'DE',name:'Germany',      region:'Europe',        sector:'Automotive',   size:'$1B+',  gosa:83.1,l1:84.2,l2:85.6,l3:81.4,l4:82.8,trend:-0.2,category:'TOP',   highlights:'#1 EU Industrial'},
  {rank:20,code:'JP',name:'Japan',        region:'Asia Pacific',  sector:'Semiconductors',size:'$1B+', gosa:81.4,l1:79.8,l2:84.2,l3:78.6,l4:82.4,trend:+0.2,category:'TOP',   highlights:'Chip Act beneficiary'},
]

const REGIONS = ['All Regions','Asia Pacific','Europe','Middle East','Americas','Africa','Oceania']
const SECTORS = ['All Sectors','EV Battery','Data Centers','Semiconductors','Renewables','AI Technology','Automotive','Fintech']
const SIZES   = ['All Sizes','$10M-$50M','$50M-$250M','$250M-$1B','$1B+']

const sc=(v:number)=>v>=80?'#2ECC71':v>=60?'#3498DB':'#F1C40F'

function Tab1_Overview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-primary-dark mb-2">Investment Analysis Overview</h2>
        <p className="text-text-secondary leading-relaxed">The Investment Analysis module provides comprehensive tools for evaluating global investment opportunities across countries, sectors, and special investment zones using our proprietary GOSA methodology.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          {icon:'📊',title:'Global Investment Analysis',desc:'Full country analysis with GOSA scores, trends, and breakdowns across 215+ economies.',tab:1},
          {icon:'📈',title:'Benchmark Tool',desc:'Compare 2-5 countries side-by-side across all 10 Doing Business indicators.',tab:2},
          {icon:'💹',title:'Impact Analysis',desc:'Model investment scenarios with GDP, job, and incentive projections.',tab:3},
        ].map(({icon,title,desc})=>(
          <div key={title} className="floating-card-sm">
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="font-black text-primary-dark mb-2">{title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-primary-dark rounded-2xl p-6 text-white">
        <h3 className="font-bold mb-3 text-white/80 text-sm uppercase tracking-wider">GOSA Formula — Global Opportunity Score Analysis</h3>
        <code className="font-mono text-primary-teal text-lg font-bold block mb-4">
          GOSA = (0.30×L1) + (0.20×L2) + (0.25×L3) + (0.25×L4)
        </code>
        <div className="grid grid-cols-4 gap-4">
          {[['L1 — 30%','Doing Business Indicators','#2ECC71'],['L2 — 20%','Sector Intelligence','#3498DB'],['L3 — 25%','Investment Zones','#F1C40F'],['L4 — 25%','Market Intelligence','#9B59B6']].map(([l,d,c])=>(
            <div key={l} className="p-3 rounded-xl" style={{background:'rgba(255,255,255,0.06)'}}>
              <div className="font-bold text-sm mb-1" style={{color:c as string}}>{l}</div>
              <div className="text-xs text-white/50">{d}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        {[['#2ECC71','80-100: Top Category'],['#3498DB','60-79: High Category'],['#F1C40F','Below 60: Developing']].map(([c,l])=>(
          <div key={l} className="flex items-center gap-2 text-sm text-text-secondary">
            <div className="w-3 h-3 rounded-full" style={{background:c as string}}/>
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}

function Tab2_GlobalAnalysis() {
  const [region,setRegion]=useState('All Regions')
  const [sector,setSector]=useState('All Sectors')
  const [size,setSize]=useState('All Sizes')
  const [search,setSearch]=useState('')

  const filtered=COUNTRIES.filter(c=>{
    if(region!=='All Regions'&&c.region!==region)return false
    if(sector!=='All Sectors'&&c.sector!==sector&&!c.sector.includes(sector.split(' ')[0]))return false
    if(search&&!c.name.toLowerCase().includes(search.toLowerCase()))return false
    return true
  })

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {label:'Region',value:region,opts:REGIONS,set:setRegion},
          {label:'Sector',value:sector,opts:SECTORS,set:setSector},
          {label:'Investment Size',value:size,opts:SIZES,set:setSize},
        ].map(({label,value,opts,set})=>(
          <div key={label}>
            <label className="text-[10px] font-bold text-text-light uppercase tracking-wider block mb-1">{label}</label>
            <select value={value} onChange={e=>set(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-border-light rounded-xl text-sm text-text-primary focus:border-primary-teal focus:outline-none cursor-pointer">
              {opts.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div>
          <label className="text-[10px] font-bold text-text-light uppercase tracking-wider block mb-1">Search</label>
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search country..."
            className="w-full px-3 py-2 bg-white border border-border-light rounded-xl text-sm focus:border-primary-teal focus:outline-none"/>
        </div>
      </div>

      {/* ★ GFR RANKING TABLE — CORE FEATURE ★ */}
      <div className="overflow-x-auto rounded-2xl border border-border-light">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-background-offwhite border-b border-border-light">
            <tr>
              {['Rank','Country','GOSA','L1','L2','L3','L4','Trend','Δ MoM','Category','Region','Investment Highlights'].map(h=>(
                <th key={h} className={`px-3 py-3 text-[10px] font-black text-text-light uppercase tracking-wider whitespace-nowrap ${h==='Country'||h==='Investment Highlights'?'text-left':'text-center'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c,i)=>(
              <tr key={c.code} className="border-b border-border-light hover:bg-background-offwhite/50 transition-all cursor-pointer">
                <td className="px-3 py-3 text-center font-mono font-black text-text-light text-xs">{c.rank===1?'🥇':c.rank===2?'🥈':c.rank===3?'🥉':c.rank}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <CountryFlag code={c.code} size={22}/>
                    <span className="font-bold text-primary-dark whitespace-nowrap">{c.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="font-black font-mono text-base" style={{color:sc(c.gosa)}}>{c.gosa}</div>
                  <div className="w-10 h-1 rounded-full mx-auto mt-1 overflow-hidden bg-gray-100">
                    <div className="h-full rounded-full" style={{width:c.gosa+'%',background:sc(c.gosa)}}/>
                  </div>
                </td>
                {[c.l1,c.l2,c.l3,c.l4].map((v,vi)=>(
                  <td key={vi} className="px-2 py-3 text-center font-mono font-bold text-xs" style={{color:sc(v)}}>{v}</td>
                ))}
                <td className="px-2 py-3 text-center text-sm">
                  {c.trend>0?<TrendingUp size={14} className="text-green-500 mx-auto"/>:<TrendingDown size={14} className="text-red-500 mx-auto"/>}
                </td>
                <td className="px-2 py-3 text-center font-mono font-bold text-xs" style={{color:c.trend>=0?'#2ECC71':'#E74C3C'}}>
                  {c.trend>=0?`+${c.trend}`:c.trend}
                </td>
                <td className="px-2 py-3 text-center">
                  <span className={c.category==='TOP'?'badge-top':'badge-high'}>{c.category}</span>
                </td>
                <td className="px-2 py-3 text-center text-xs text-text-secondary whitespace-nowrap">{c.region}</td>
                <td className="px-3 py-3 text-xs text-text-secondary">{c.highlights}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-xs text-text-light">
          {[['#2ECC71','TOP (≥80)'],['#3498DB','HIGH (60-79)'],['#F1C40F','DEV (<60)']].map(([c,l])=>(
            <span key={l} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{background:c as string}}/>{l}
            </span>
          ))}
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download size={14}/> Generate PDF Report
        </button>
      </div>
    </div>
  )
}

function Tab3_Benchmark() {
  const [selected,setSelected]=useState(['VN','TH','MY'])
  const countries={VN:{name:'Vietnam',gosa:79.4,l1:80.5,l2:79.1,l3:78.9,l4:79.1},TH:{name:'Thailand',gosa:80.7,l1:81.8,l2:80.2,l3:81.0,l4:79.8},MY:{name:'Malaysia',gosa:81.2,l1:82.5,l2:80.7,l3:81.8,l4:79.8},ID:{name:'Indonesia',gosa:77.8,l1:78.9,l2:77.3,l3:77.5,l4:77.5},SG:{name:'Singapore',gosa:88.4,l1:92.1,l2:85.3,l3:87.2,l4:89.0}}
  const colors=['#2ECC71','#3498DB','#F1C40F','#9B59B6','#E74C3C']
  const DB_INDS=['Starting Business','Permits','Electricity','Property','Credit','Investors','Taxes','Trading','Contracts','Insolvency']
  const DB_SCORES:{[k:string]:number[]}={VN:[80,68,74,62,72,66,78,91,64,58],TH:[82,72,90,68,74,78,80,82,68,64],MY:[85,74,92,72,80,82,78,88,72,70],ID:[75,66,88,60,68,72,74,74,62,54],SG:[97,88,99,90,88,88,91,99,84,88]}

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-bold text-text-primary block mb-3">Select Countries to Compare (2-5)</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {selected.map((code,i)=>(
            <div key={code} className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 text-sm font-medium" style={{borderColor:colors[i],background:`${colors[i]}10`,color:colors[i]}}>
              <CountryFlag code={code} size={18}/>
              {(countries as any)[code]?.name}
              <button onClick={()=>setSelected(selected.filter(c=>c!==code))} className="opacity-60 hover:opacity-100 font-black ml-1">×</button>
            </div>
          ))}
          {selected.length<5&&(
            <div className="flex gap-1.5">
              {Object.entries(countries).filter(([k])=>!selected.includes(k)).map(([code,data])=>(
                <button key={code} onClick={()=>setSelected([...selected,code])}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-border-light rounded-full text-xs text-text-secondary hover:border-primary-teal hover:text-primary-teal transition-all">
                  <CountryFlag code={code} size={14}/>{(data as any).name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* GOSA Comparison bars */}
      <div className="floating-card-sm">
        <h3 className="font-black text-primary-dark mb-4">Global Opportunity Score Comparison</h3>
        {selected.map((code,i)=>{
          const d=(countries as any)[code]
          return (
            <div key={code} className="flex items-center gap-3 mb-3">
              <div className="w-28 flex items-center gap-2"><CountryFlag code={code} size={20}/><span className="text-sm font-medium">{d.name}</span></div>
              <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden relative">
                <div className="h-full rounded-full flex items-center justify-end pr-3 text-white text-xs font-black transition-all"
                  style={{width:`${d.gosa}%`,background:`linear-gradient(90deg,${colors[i]}60,${colors[i]})`}}>
                  {d.gosa}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* DB Indicators table */}
      <div className="overflow-x-auto rounded-2xl border border-border-light">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-background-offwhite">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-black text-text-light uppercase">Indicator</th>
              {selected.map((code,i)=>(
                <th key={code} className="px-3 py-3 text-center text-xs font-black uppercase" style={{color:colors[i]}}>
                  <div className="flex flex-col items-center gap-1">
                    <CountryFlag code={code} size={18}/>
                    {(countries as any)[code]?.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DB_INDS.map(ind=>{
              const scores=selected.map(code=>(DB_SCORES[code]||[])[DB_INDS.indexOf(ind)]||0)
              const best=Math.max(...scores)
              return (
                <tr key={ind} className="border-t border-border-light hover:bg-background-offwhite/50">
                  <td className="px-4 py-2.5 text-xs text-text-secondary font-medium">{ind}</td>
                  {scores.map((s,i)=>(
                    <td key={i} className="px-3 py-2.5 text-center font-mono font-bold text-sm" style={{color:s===best?colors[i]:'#5A6874'}}>
                      {s===best?`★ ${s}`:s}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary flex items-center gap-2"><Download size={14}/> Generate Benchmark Report → PDF</button>
      </div>
    </div>
  )
}

function Tab4_ImpactAnalysis() {
  const [ran,setRan]=useState(false)
  const [country,setCountry]=useState('Vietnam')
  const [sector,setSector]=useState('EV Battery Manufacturing')
  const [investment,setInvestment]=useState('$250M')
  const [zone,setZone]=useState('VSIP Binh Duong')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {label:'Country',value:country,set:setCountry,opts:['Vietnam','Thailand','Malaysia','Indonesia','UAE','Saudi Arabia','India']},
          {label:'Sector',value:sector,set:setSector,opts:['EV Battery Manufacturing','Data Centers','Semiconductors','Renewable Energy','AI & Technology']},
          {label:'Investment Size',value:investment,set:setInvestment,opts:['$50M','$100M','$250M','$500M','$1B+']},
          {label:'Zone',value:zone,set:setZone,opts:['VSIP Binh Duong','HCMC High-Tech Park','Hanoi Industrial Zone']},
        ].map(({label,value,set,opts})=>(
          <div key={label}>
            <label className="text-[10px] font-bold text-text-light uppercase tracking-wider block mb-1">{label}</label>
            <select value={value} onChange={e=>set(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-border-light rounded-xl text-sm focus:border-primary-teal focus:outline-none cursor-pointer">
              {opts.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button onClick={()=>setRan(true)} className="btn-primary px-10 py-3 text-base">
          Run Impact Analysis
        </button>
      </div>

      {ran&&(
        <div className="space-y-4 animate-slide-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {icon:'📊',title:'Economic Impact',items:['GDP Contribution: +0.8% over 5yr','Jobs: 2,500 direct, 5,000 indirect','Value Added: $180M/yr'],color:'#2ECC71'},
              {icon:'⏱',title:'Operational Feasibility',items:['Time to Operation: 18 months','Regulatory Risk: LOW','Key Permits: 4 (avg 45 days)'],color:'#3498DB'},
              {icon:'💰',title:'Incentive Impact',items:['Tax Savings: $8.5M over 5yr','CIT Exemption: 50% × 4yr','Incentive Value: $12M total'],color:'#F1C40F'},
              {icon:'⚠️',title:'Risk Assessment',items:['Political Risk: LOW (3.2/10)','Market Risk: MEDIUM (5.1/10)','Operational Risk: LOW (2.8/10)'],color:'#9B59B6'},
            ].map(({icon,title,items,color})=>(
              <div key={title} className="floating-card-sm border-t-2" style={{borderTopColor:color}}>
                <div className="text-2xl mb-2">{icon}</div>
                <h3 className="font-black text-primary-dark text-sm mb-3">{title}</h3>
                {items.map(i=><div key={i} className="text-xs text-text-secondary py-1 border-b border-border-light last:border-0">{i}</div>)}
              </div>
            ))}
          </div>

          {/* Sensitivity Analysis */}
          <div className="floating-card-sm">
            <h3 className="font-black text-primary-dark mb-4">Sensitivity Analysis — ROI by Investment Size</h3>
            <div className="space-y-3">
              {[['$50M','12.4%','#F1C40F'],['$100M','15.8%','#3498DB'],['$250M','18.2%','#2ECC71'],['$500M','21.4%','#2ECC71'],['$1B+','24.6%','#2ECC71']].map(([s,roi,c])=>(
                <div key={s} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-text-primary w-14 font-mono">{s}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div className="h-full rounded-full flex items-center px-3 text-white text-xs font-black"
                      style={{width:`${parseFloat(roi)*3}%`,background:`linear-gradient(90deg,${c}60,${c})`}}>
                      {roi}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button className="btn-primary flex items-center gap-2"><Download size={14}/> Generate Impact Report → PDF</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function InvestmentAnalysisPage() {
  const [tab,setTab]=useState(0)
  const tabs=['Overview','Global Investment Analysis','Benchmark','Impact Analysis']
  return (
    <div className="min-h-screen bg-background-offwhite">
      <BackgroundVideo/>
      <div className="max-w-[1540px] mx-auto px-6 py-10">
        <div className="section-label">Investment Intelligence</div>
        <h1 className="page-title">Investment Analysis</h1>
        <p className="page-sub">4-layer GOSA methodology · 215+ economies · Real-time data · AI-generated reports</p>

        <div className="flex gap-1 border-b border-border-light mb-8">
          {tabs.map((t,i)=>(
            <button key={i} onClick={()=>setTab(i)}
              className={`tab-btn ${tab===i?'tab-active':'tab-inactive'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="floating-card">
          {tab===0&&<Tab1_Overview/>}
          {tab===1&&<Tab2_GlobalAnalysis/>}
          {tab===2&&<Tab3_Benchmark/>}
          {tab===3&&<Tab4_ImpactAnalysis/>}
        </div>
      </div>
    </div>
  )
}
