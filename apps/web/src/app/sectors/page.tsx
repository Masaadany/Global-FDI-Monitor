'use client'
import { useState } from 'react'
import { BackgroundVideo } from '@/components/shared/BackgroundVideo'
import { CountryFlag } from '@/components/shared/CountryFlag'
import { TrendingUp, TrendingDown, ChevronRight, Download } from 'lucide-react'
import { RadarChart } from '@/components/charts/RadarChart'

const SECTORS = [
  {
    id:'ev-battery', icon:'⚡', name:'EV Battery Manufacturing',
    parent:'Manufacturing', hot:true,
    color:'#2ECC71', gradient:['#1A2C3E','#2ECC71'],
    momentum:94, trend:+3.2, signals:47, deals:12,
    desc:'Global EV battery supply chain investment — cells, modules, packs, and BMS. Cathode, anode, and electrolyte material supply chains.',
    topCountries:['VN','TH','MY','ID','PL'],
    topCompanies:[{name:'CATL',domain:'catl.com'},{name:'Samsung SDI',domain:'samsungsdi.com'},{name:'LG Energy',domain:'lgenergysolution.com'},{name:'BYD',domain:'byd.com'}],
    kpis:[{l:'Total FDI 2025',v:'$48B'},{l:'Active Deals',v:'73'},{l:'Zones Available',v:18}],
    radarScores:[92,88,84,90,86],
    subsectors:['Lithium-ion Cells','Solid-State Batteries','Battery Modules','BMS Electronics','Recycling'],
  },
  {
    id:'data-centers', icon:'🖥', name:'Data Centers & Cloud',
    parent:'Digital Economy', hot:true,
    color:'#3498DB', gradient:['#1A2C3E','#3498DB'],
    momentum:91, trend:+2.8, signals:39, deals:9,
    desc:'Hyperscale, edge, and AI-optimized data center infrastructure. Colocation facilities, cooling systems, and renewable energy integration.',
    topCountries:['SG','MY','AE','IN','IE'],
    topCompanies:[{name:'Microsoft',domain:'microsoft.com'},{name:'Google',domain:'google.com'},{name:'AWS',domain:'amazon.com'},{name:'Meta',domain:'meta.com'}],
    kpis:[{l:'Total FDI 2025',v:'$62B'},{l:'Active Deals',v:'58'},{l:'MW Committed',v:'8,400'}],
    radarScores:[94,90,88,92,82],
    subsectors:['Hyperscale','Edge Computing','AI-Optimized','Colocation','Cooling Systems'],
  },
  {
    id:'semiconductors', icon:'💾', name:'Semiconductors & Chips',
    parent:'Manufacturing', hot:true,
    color:'#9B59B6', gradient:['#1A2C3E','#9B59B6'],
    momentum:89, trend:+1.9, signals:34, deals:8,
    desc:'Front-end fab, packaging, testing, and equipment. Advanced logic, memory, and specialty chips for automotive, AI, and industrial applications.',
    topCountries:['KR','TW','IN','JP','US'],
    topCompanies:[{name:'TSMC',domain:'tsmc.com'},{name:'Samsung',domain:'samsung.com'},{name:'Intel',domain:'intel.com'},{name:'Micron',domain:'micron.com'}],
    kpis:[{l:'Total FDI 2025',v:'$89B'},{l:'Active Fabs',v:'31'},{l:'Jobs Pipeline',v:'85K'}],
    radarScores:[90,94,82,96,80],
    subsectors:['Logic Fabs','Memory','Advanced Packaging','Equipment','Materials'],
  },
  {
    id:'renewables', icon:'🌬', name:'Renewable Energy',
    parent:'Energy', hot:false,
    color:'#F1C40F', gradient:['#1A2C3E','#E67E22'],
    momentum:86, trend:+1.4, signals:28, deals:15,
    desc:'Solar PV, onshore and offshore wind, green hydrogen, battery storage, and smart grid infrastructure. CCUS and carbon markets.',
    topCountries:['DK','DE','AU','IN','MA'],
    topCompanies:[{name:'Vestas',domain:'vestas.com'},{name:'Siemens Gamesa',domain:'siemensgamesa.com'},{name:'Ørsted',domain:'orsted.com'},{name:'RWE',domain:'rwe.com'}],
    kpis:[{l:'Total FDI 2025',v:'$312B'},{l:'GW Committed',v:'840'},{l:'Countries Active',v:'94'}],
    radarScores:[88,78,86,72,94],
    subsectors:['Offshore Wind','Solar PV','Green Hydrogen','Battery Storage','Smart Grids'],
  },
  {
    id:'green-hydrogen', icon:'💧', name:'Green Hydrogen',
    parent:'Energy', hot:true,
    color:'#27ae60', gradient:['#1A2C3E','#27ae60'],
    momentum:88, trend:+4.1, signals:22, deals:7,
    desc:'Electrolysis, storage, transport, and end-use applications. Power-to-X pathways, ammonia production, and hydrogen export infrastructure.',
    topCountries:['SA','AU','NL','SG','CL'],
    topCompanies:[{name:'Shell',domain:'shell.com'},{name:'Air Products',domain:'airproducts.com'},{name:'Linde',domain:'linde.com'},{name:'Siemens',domain:'siemens.com'}],
    kpis:[{l:'Total FDI 2025',v:'$28B'},{l:'Active Projects',v:'47'},{l:'GW Electrolysis',v:'24'}],
    radarScores:[82,76,88,74,96],
    subsectors:['Electrolysis','Ammonia','Storage','Export Terminals','Power-to-X'],
  },
  {
    id:'logistics', icon:'🚢', name:'Logistics & Ports',
    parent:'Infrastructure', hot:false,
    color:'#E74C3C', gradient:['#1A2C3E','#E74C3C'],
    momentum:82, trend:+0.8, signals:19, deals:11,
    desc:'Port expansion, inland logistics, cold chain, e-commerce fulfillment, and cross-border trade infrastructure. Free zone logistics hubs.',
    topCountries:['AE','SG','MA','SA','NL'],
    topCompanies:[{name:'DP World',domain:'dpworld.com'},{name:'Maersk',domain:'maersk.com'},{name:'DB Schenker',domain:'dbschenker.com'},{name:'DHL',domain:'dhl.com'}],
    kpis:[{l:'Total FDI 2025',v:'$44B'},{l:'Port Projects',v:'28'},{l:'TEU Capacity Added',v:'14M'}],
    radarScores:[84,74,88,78,80],
    subsectors:['Container Ports','Inland Logistics','Cold Chain','E-commerce Fulfillment','Rail Freight'],
  },
  {
    id:'fintech', icon:'💳', name:'Fintech & Digital Finance',
    parent:'Services', hot:false,
    color:'#16a085', gradient:['#1A2C3E','#16a085'],
    momentum:79, trend:+1.1, signals:16, deals:6,
    desc:'Digital payments, banking-as-a-service, regtech, wealthtech, and embedded finance. Cross-border remittance and DeFi infrastructure.',
    topCountries:['SG','GB','AE','IN','BR'],
    topCompanies:[{name:'Stripe',domain:'stripe.com'},{name:'Visa',domain:'visa.com'},{name:'Mastercard',domain:'mastercard.com'},{name:'Revolut',domain:'revolut.com'}],
    kpis:[{l:'Total FDI 2025',v:'$18B'},{l:'Unicorns Active',v:'34'},{l:'Licenses Issued',v:'428'}],
    radarScores:[88,86,84,90,74],
    subsectors:['Payments','Banking-as-a-Service','Regtech','Wealthtech','Embedded Finance'],
  },
  {
    id:'agribusiness', icon:'🌾', name:'Agribusiness & Food Security',
    parent:'Agriculture', hot:false,
    color:'#8e44ad', gradient:['#1A2C3E','#8e44ad'],
    momentum:74, trend:+0.5, signals:12, deals:9,
    desc:'Precision agriculture, vertical farming, food processing, aquaculture, and agricultural technology. Food security strategic investments.',
    topCountries:['NZ','BR','MA','VN','NL'],
    topCompanies:[{name:'Cargill',domain:'cargill.com'},{name:'Archer Daniels',domain:'adm.com'},{name:'John Deere',domain:'deere.com'},{name:'BASF',domain:'basf.com'}],
    kpis:[{l:'Total FDI 2025',v:'$22B'},{l:'Active Projects',v:'41'},{l:'Zones Available',v:12}],
    radarScores:[76,72,74,68,84],
    subsectors:['Precision Agriculture','Vertical Farming','Food Processing','Aquaculture','AgTech'],
  },
  {
    id:'healthcare', icon:'🏥', name:'Healthcare & Pharmaceuticals',
    parent:'Services', hot:false,
    color:'#2980b9', gradient:['#1A2C3E','#2980b9'],
    momentum:77, trend:+1.2, signals:14, deals:7,
    desc:'Pharmaceutical manufacturing, medical devices, digital health, biotech R&D, and hospital infrastructure investment.',
    topCountries:['SG','IN','IE','DE','SA'],
    topCompanies:[{name:'Pfizer',domain:'pfizer.com'},{name:'Johnson & Johnson',domain:'jnj.com'},{name:'Novartis',domain:'novartis.com'},{name:'Roche',domain:'roche.com'}],
    kpis:[{l:'Total FDI 2025',v:'$31B'},{l:'Active Facilities',v:'22'},{l:'R&D Centers',v:'18'}],
    radarScores:[80,78,76,82,74],
    subsectors:['Pharma Manufacturing','Medical Devices','Biotech R&D','Digital Health','Hospital Infrastructure'],
  },
]

function CompanyLogoBadge({ domain, name }:{ domain:string; name:string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white border border-border-light shadow-sm">
      <img src={`https://logo.clearbit.com/${domain}`} alt={name} width={16} height={16}
        className="rounded object-contain flex-shrink-0"
        onError={e=>{(e.target as any).style.display='none'}}/>
      <span className="text-[9px] font-medium text-text-secondary whitespace-nowrap">{name}</span>
    </div>
  )
}

export default function SectorsPage() {
  const [sel,setSel] = useState<string|null>(null)
  const selSec = SECTORS.find(s=>s.id===sel)
  const [tab,setTab] = useState<'grid'|'compare'>('grid')

  return (
    <div className="min-h-screen bg-background-offwhite">
      <BackgroundVideo/>
      <div className="max-w-[1540px] mx-auto px-6 py-10">

        <div className="text-[10px] font-black text-primary-teal uppercase tracking-widest mb-2">Sector Intelligence</div>
        <h1 className="text-4xl font-black text-primary-dark mb-2">Sector Monitor</h1>
        <p className="text-text-secondary mb-8">9 sectors · 48 subsectors · Real-time momentum scoring · Leading company tracking</p>

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[['9','Active Sectors','#2ECC71'],['231','Total Signals','#3498DB'],['$654B','Total FDI Pipeline','#F1C40F'],['94','Hot Momentum Score','#9B59B6']].map(([v,l,c])=>(
            <div key={l} className="floating-card text-center !py-5">
              <div className="text-3xl font-black font-mono mb-1" style={{color:c as string}}>{v}</div>
              <div className="text-xs text-text-secondary font-medium">{l}</div>
            </div>
          ))}
        </div>

        {/* ── SECTOR CARDS GRID ── */}
        <div className="grid grid-cols-3 gap-5">
          {SECTORS.map(sec=>{
            const isSelected = sel===sec.id
            return (
              <div key={sec.id} onClick={()=>setSel(isSelected?null:sec.id)}
                className={`bg-white rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 ${isSelected?'shadow-xl border-l-4 col-span-3 grid grid-cols-[1fr_420px]':'shadow-sm border-border-light hover:shadow-md hover:-translate-y-1'}`}
                style={{borderLeftColor:isSelected?sec.color:undefined}}>

                {/* Cover strip */}
                <div className={`relative ${isSelected?'':'h-28'} overflow-hidden`}
                  style={{background:`linear-gradient(135deg,${sec.gradient[0]},${sec.gradient[1]})`,...(isSelected?{}:{height:'112px'})}}>
                  <div className="absolute inset-0 opacity-10"
                    style={{backgroundImage:'radial-gradient(circle at 80% 20%, white, transparent 50%)'}}/>
                  <div className={`absolute ${isSelected?'text-8xl top-8 left-8 opacity-15':'text-5xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20'}`}>{sec.icon}</div>
                  {isSelected && (
                    <div className="absolute top-6 left-6 right-6 bottom-6 flex flex-col justify-between">
                      <div>
                        <div className="text-[9px] font-black text-white/50 uppercase tracking-widest">{sec.parent}</div>
                        <div className="text-2xl font-black text-white">{sec.name}</div>
                        <div className="text-white/60 text-sm mt-1">{sec.desc}</div>
                      </div>
                      <div className="flex gap-4">
                        {sec.kpis.map(({l,v})=>(
                          <div key={l} className="text-center bg-white/10 rounded-xl px-4 py-2">
                            <div className="text-xl font-black text-white font-mono">{v}</div>
                            <div className="text-[9px] text-white/50">{l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {!isSelected && (
                    <>
                      {sec.hot && <div className="absolute top-2 right-2 text-[8px] font-black px-2 py-0.5 rounded-full bg-white/15 text-white border border-white/20">🔥 HOT</div>}
                      <div className="absolute bottom-2 left-3">
                        <div className="text-[8px] font-bold text-white/50">{sec.parent}</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Card body */}
                <div className={`p-4 ${isSelected?'border-t border-border-light':''}`}>
                  {!isSelected && (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-black text-primary-dark text-sm leading-tight">{sec.name}</div>
                        <div className="text-xl font-black font-mono" style={{color:sec.color}}>{sec.momentum}</div>
                      </div>
                      <div className="flex items-center gap-1 mb-3 text-xs" style={{color:sec.trend>0?'#2ECC71':'#E74C3C'}}>
                        {sec.trend>0?<TrendingUp size={12}/>:<TrendingDown size={12}/>}
                        <span className="font-bold">{sec.trend>0?'+':''}{sec.trend}</span>
                        <span className="text-text-light ml-1">{sec.signals} signals · {sec.deals} deals</span>
                      </div>
                      <div className="flex gap-1 mb-3 flex-wrap">
                        {sec.topCountries.map(c=><CountryFlag key={c} code={c} size={16} className="bg-background-offwhite rounded px-1 py-0.5 border border-border-light"/>)}
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {sec.topCompanies.slice(0,2).map(c=><CompanyLogoBadge key={c.domain} domain={c.domain} name={c.name}/>)}
                      </div>
                    </>
                  )}

                  {/* Expanded */}
                  {isSelected && (
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Left: subsectors + countries */}
                        <div>
                          <div className="text-[10px] font-black text-text-light uppercase tracking-wider mb-3">Subsectors</div>
                          <div className="space-y-2 mb-5">
                            {sec.subsectors.map(s=>(
                              <div key={s} className="flex items-center gap-2 p-2.5 rounded-xl bg-background-offwhite border border-border-light">
                                <div className="w-1.5 h-1.5 rounded-full" style={{background:sec.color}}/>
                                <span className="text-xs font-medium text-primary-dark">{s}</span>
                              </div>
                            ))}
                          </div>
                          <div className="text-[10px] font-black text-text-light uppercase tracking-wider mb-3">Top Destinations</div>
                          <div className="flex flex-wrap gap-2">
                            {sec.topCountries.map(c=><CountryFlag key={c} code={c} size={22} className="bg-white px-2 py-1.5 rounded-xl border border-border-light shadow-sm"/>)}
                          </div>
                        </div>
                        {/* Right: companies + radar */}
                        <div>
                          <div className="text-[10px] font-black text-text-light uppercase tracking-wider mb-3">Key Companies</div>
                          <div className="grid grid-cols-2 gap-2 mb-5">
                            {sec.topCompanies.map(c=>(
                              <div key={c.domain} className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-border-light shadow-sm">
                                <img src={`https://logo.clearbit.com/${c.domain}`} alt={c.name} width={20} height={20}
                                  className="rounded object-contain" onError={e=>{(e.target as any).style.display='none'}}/>
                                <span className="text-xs font-semibold text-primary-dark">{c.name}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-center">
                            <RadarChart datasets={[{scores:sec.radarScores,color:sec.color}]}
                              labels={['Regs','Incentives','Labor','Infra','Export']} size={180}/>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4 pt-4 border-t border-border-light">
                        <button className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-white"
                          style={{background:sec.color}}>
                          <Download size={13}/> Export Sector Report
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-primary-dark border border-border-light bg-white hover:border-primary-dark transition-all">
                          View All Signals <ChevronRight size={13}/>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
