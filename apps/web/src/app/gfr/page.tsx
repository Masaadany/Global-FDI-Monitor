'use client'
import { useState } from 'react'
import { BackgroundVideo } from '@/components/shared/BackgroundVideo'
import { CountryFlag } from '@/components/shared/CountryFlag'
import { RadarChart } from '@/components/charts/RadarChart'
import { TrendingUp, TrendingDown, Download } from 'lucide-react'

const DIMS=[
  {code:'ETR',name:'Economic & Trade Resilience',weight:0.20,color:'#2ECC71',desc:'Macro stability, trade openness, external balance'},
  {code:'ICT',name:'Innovation & Creative Talent', weight:0.18,color:'#3498DB',desc:'R&D spend, patent filings, STEM graduates'},
  {code:'TCM',name:'Trade & Capital Mobility',     weight:0.18,color:'#F1C40F',desc:'FDI inflows, capital controls, trade facilitation'},
  {code:'DTF',name:'Digital & Tech Frontier',      weight:0.16,color:'#9B59B6',desc:'Broadband penetration, cloud adoption, AI readiness'},
  {code:'SGT',name:'Sustainable Growth',           weight:0.15,color:'#E74C3C',desc:'Green investment, carbon intensity, ESG'},
  {code:'GRP',name:'Governance & Policy',          weight:0.13,color:'#1A2C3E',desc:'Rule of law, regulatory quality, political stability'},
]

const COUNTRIES=[
  {rank:1, code:'SG',name:'Singapore',    gfr:91.2,etr:93.1,ict:89.4,tcm:94.2,dtf:91.8,sgt:82.1,grp:96.4,trend:+0.3,cat:'TOP'},
  {rank:2, code:'DK',name:'Denmark',      gfr:89.8,etr:88.2,ict:91.4,tcm:86.3,dtf:90.1,sgt:94.2,grp:95.1,trend:+0.2,cat:'TOP'},
  {rank:3, code:'CH',name:'Switzerland',  gfr:89.1,etr:91.0,ict:92.3,tcm:88.4,dtf:87.6,sgt:88.3,grp:93.8,trend:+0.1,cat:'TOP'},
  {rank:4, code:'NL',name:'Netherlands',  gfr:87.4,etr:86.8,ict:88.2,tcm:89.1,dtf:89.4,sgt:87.6,grp:91.2,trend:-0.1,cat:'TOP'},
  {rank:5, code:'NZ',name:'New Zealand',  gfr:86.3,etr:83.1,ict:84.6,tcm:87.2,dtf:85.4,sgt:89.8,grp:94.6,trend:-0.2,cat:'TOP'},
  {rank:6, code:'KR',name:'South Korea',  gfr:86.9,etr:84.3,ict:93.1,tcm:82.6,dtf:94.8,sgt:78.4,grp:88.2,trend:+0.4,cat:'TOP'},
  {rank:7, code:'AE',name:'UAE',          gfr:83.8,etr:86.4,ict:82.1,tcm:88.6,dtf:84.2,sgt:76.8,grp:88.4,trend:+1.4,cat:'TOP'},
  {rank:8, code:'DE',name:'Germany',      gfr:83.1,etr:84.2,ict:85.6,tcm:81.4,dtf:82.8,sgt:85.6,grp:88.2,trend:-0.2,cat:'TOP'},
  {rank:9, code:'US',name:'United States',gfr:82.6,etr:83.8,ict:88.4,tcm:84.2,dtf:89.6,sgt:72.4,grp:82.8,trend:-0.1,cat:'TOP'},
  {rank:10,code:'MY',name:'Malaysia',     gfr:79.2,etr:78.6,ict:76.4,tcm:81.8,dtf:78.2,sgt:74.6,grp:82.4,trend:+0.6,cat:'HIGH'},
  {rank:11,code:'SA',name:'Saudi Arabia', gfr:78.6,etr:82.4,ict:74.2,tcm:80.6,dtf:76.8,sgt:68.4,grp:82.6,trend:+2.2,cat:'HIGH'},
  {rank:12,code:'TH',name:'Thailand',     gfr:77.4,etr:75.8,ict:72.6,tcm:78.4,dtf:74.6,sgt:72.8,grp:78.4,trend:+0.3,cat:'HIGH'},
  {rank:13,code:'VN',name:'Vietnam',      gfr:76.8,etr:74.2,ict:71.4,tcm:77.6,dtf:72.4,sgt:74.2,grp:74.8,trend:+0.8,cat:'HIGH'},
  {rank:14,code:'IN',name:'India',        gfr:75.6,etr:72.8,ict:76.4,tcm:74.2,dtf:72.8,sgt:68.6,grp:76.2,trend:+1.1,cat:'HIGH'},
  {rank:15,code:'MA',name:'Morocco',      gfr:68.4,etr:66.8,ict:64.2,tcm:68.6,dtf:62.4,sgt:66.8,grp:70.2,trend:+0.8,cat:'HIGH'},
]

const sc=(v:number)=>v>=80?'#2ECC71':v>=60?'#3498DB':'#F1C40F'
const COMPARE_COLS=['#2ECC71','#3498DB','#F1C40F','#9B59B6']

export default function GFRPage() {
  const [tab,setTab]=useState<'ranking'|'compare'|'method'>('ranking')
  const [selCode,setSelCode]=useState('SG')
  const [compare,setCompare]=useState(['SG','AE','MY'])

  const selC=COUNTRIES.find(c=>c.code===selCode)||COUNTRIES[0]
  const compareC=COUNTRIES.filter(c=>compare.includes(c.code))

  function toggleCompare(code:string){
    setCompare(p=>p.includes(code)?p.filter(x=>x!==code):[...p.slice(-3),code])
  }

  return (
    <div className="min-h-screen bg-background-offwhite">
      <BackgroundVideo/>
      <div className="max-w-[1540px] mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <div className="section-label">Global Future Readiness</div>
            <h1 className="page-title">GFR Ranking 2026</h1>
            <p className="text-text-secondary text-sm">6-dimension composite · 25 economies · Comparable to IMD WCR · Kearney GCR · World Happiness Report</p>
          </div>
          <div className="px-4 py-3 bg-primary-dark/5 rounded-xl border border-border-light text-sm font-mono text-text-secondary">
            GFR = (0.20×ETR) + (0.18×ICT) + (0.18×TCM) + (0.16×DTF) + (0.15×SGT) + (0.13×GRP)
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border-light mb-6">
          {[['ranking','📊 Ranking Table'],['compare','⚖ Compare'],['method','🔬 Methodology']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t as any)}
              className={`tab-btn ${tab===t?'tab-active':'tab-inactive'}`}>{l}</button>
          ))}
        </div>

        {/* RANKING TAB */}
        {tab==='ranking'&&(
          <div className="grid grid-cols-[1fr_300px] gap-5">
            <div className="floating-card !p-0 overflow-hidden">
              <div className="px-5 py-4 bg-background-offwhite border-b border-border-light flex gap-3 items-center flex-wrap">
                <input type="text" placeholder="Search economy..." className="px-3 py-2 border border-border-light rounded-xl text-sm focus:outline-none focus:border-primary-teal flex-1 min-w-32"/>
                <button className="btn-primary flex items-center gap-1.5 text-xs !px-4 !py-2">
                  <Download size={12}/> Export
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-background-offwhite">
                    <tr>
                      {['#','Economy','GFR Score','ETR (20%)','ICT (18%)','TCM (18%)','DTF (16%)','SGT (15%)','GRP (13%)','Trend','Category'].map(h=>(
                        <th key={h} className={`px-3 py-3 text-[10px] font-black text-text-light uppercase whitespace-nowrap border-b border-border-light ${h==='Economy'?'text-left':'text-center'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COUNTRIES.map(c=>(
                      <tr key={c.code} onClick={()=>setSelCode(c.code)}
                        className={`border-b border-border-light cursor-pointer transition-all ${selCode===c.code?'bg-green-50':'hover:bg-background-offwhite/50'}`}>
                        <td className="px-3 py-3 text-center font-mono font-black text-text-light text-xs">{c.rank<=3?['🥇','🥈','🥉'][c.rank-1]:c.rank}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5">
                            <CountryFlag code={c.code} size={24}/>
                            <span className="font-bold text-primary-dark">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="text-lg font-black font-mono" style={{color:sc(c.gfr)}}>{c.gfr}</div>
                          <div className="w-10 h-1 rounded-full mx-auto mt-1 overflow-hidden bg-gray-100">
                            <div className="h-full rounded-full" style={{width:c.gfr+'%',background:sc(c.gfr)}}/>
                          </div>
                        </td>
                        {[c.etr,c.ict,c.tcm,c.dtf,c.sgt,c.grp].map((v,i)=>(
                          <td key={i} className="px-2 py-3 text-center font-mono font-bold text-xs" style={{color:sc(v)}}>{v}</td>
                        ))}
                        <td className="px-2 py-3 text-center">
                          <div className="flex items-center justify-center gap-0.5 text-xs font-bold" style={{color:c.trend>0?'#2ECC71':c.trend<0?'#E74C3C':'#5A6874'}}>
                            {c.trend>0?<TrendingUp size={11}/>:c.trend<0?<TrendingDown size={11}/>:null}
                            {c.trend!==0?(c.trend>0?'+':'')+c.trend:'—'}
                          </div>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <span className={c.cat==='TOP'?'badge-top':'badge-high'}>{c.cat}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side panel */}
            <div className="floating-card !p-5">
              <div className="text-[10px] font-black text-text-light uppercase tracking-widest mb-4">Selected Economy</div>
              <div className="flex items-center gap-3 mb-4 p-3 bg-background-offwhite rounded-xl">
                <CountryFlag code={selC.code} size={40}/>
                <div className="flex-1">
                  <div className="font-black text-primary-dark">{selC.name}</div>
                  <span className={selC.cat==='TOP'?'badge-top':'badge-high'}>Rank #{selC.rank}</span>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black font-mono" style={{color:sc(selC.gfr)}}>{selC.gfr}</div>
                  <div className="text-xs font-bold" style={{color:selC.trend>0?'#2ECC71':'#E74C3C'}}>
                    {selC.trend>0?`▲+${selC.trend}`:`▼${selC.trend}`}
                  </div>
                </div>
              </div>
              <div className="flex justify-center mb-4">
                <RadarChart
                  datasets={[{scores:[selC.etr,selC.ict,selC.tcm,selC.dtf,selC.sgt,selC.grp],color:'#2ECC71'}]}
                  labels={DIMS.map(d=>d.code)} size={200}/>
              </div>
              {DIMS.map(d=>{
                const v=(selC as any)[d.code.toLowerCase()]
                return (
                  <div key={d.code} className="mb-2.5">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-text-secondary font-medium">{d.code} <span className="text-text-light text-[10px]">({(d.weight*100).toFixed(0)}%)</span></span>
                      <span className="text-xs font-black font-mono" style={{color:d.color}}>{v}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{width:v+'%',background:d.color}}/>
                    </div>
                  </div>
                )
              })}
              <button onClick={()=>{toggleCompare(selC.code);setTab('compare')}}
                className="w-full mt-4 py-2 text-xs font-bold text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition-all">
                {compare.includes(selC.code)?'Remove from Compare':'Add to Compare ⚖'}
              </button>
            </div>
          </div>
        )}

        {/* COMPARE TAB */}
        {tab==='compare'&&(
          <div>
            <div className="floating-card !p-5 mb-5">
              <div className="text-sm font-bold text-text-primary mb-3">Select up to 4 economies to compare</div>
              <div className="flex flex-wrap gap-2">
                {COUNTRIES.map(c=>{
                  const idx=compare.indexOf(c.code)
                  const isIn=idx!==-1
                  return (
                    <button key={c.code} onClick={()=>toggleCompare(c.code)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border-2"
                      style={{borderColor:isIn?COMPARE_COLS[idx]+'60':'#ECF0F1',background:isIn?COMPARE_COLS[idx]+'12':'white',color:isIn?COMPARE_COLS[idx]:'#5A6874'}}>
                      <CountryFlag code={c.code} size={14}/>
                      {c.name}
                      {isIn&&<span className="font-black ml-0.5">#{idx+1}</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            {compareC.length>=2&&(
              <>
                <div className="floating-card !p-5 mb-5">
                  <h3 className="font-black text-primary-dark mb-5">Radar Comparison — All 6 Dimensions</h3>
                  <div className="grid grid-cols-[240px_1fr] gap-8 items-center">
                    <div className="flex flex-col items-center">
                      <RadarChart
                        datasets={compareC.map((c,i)=>({scores:[c.etr,c.ict,c.tcm,c.dtf,c.sgt,c.grp],color:COMPARE_COLS[i]}))}
                        labels={DIMS.map(d=>d.code)} size={230}/>
                      <div className="flex gap-3 flex-wrap justify-center mt-2">
                        {compareC.map((c,i)=>(
                          <div key={c.code} className="flex items-center gap-1.5 text-xs" style={{color:COMPARE_COLS[i]}}>
                            <div className="w-2.5 h-1 rounded-full" style={{background:COMPARE_COLS[i]}}/>
                            <CountryFlag code={c.code} size={14}/>{c.name}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      {DIMS.map(dim=>{
                        const vals=compareC.map(c=>(c as any)[dim.code.toLowerCase()])
                        const best=Math.max(...vals)
                        return (
                          <div key={dim.code}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-black font-mono" style={{color:dim.color,minWidth:'32px'}}>{dim.code}</span>
                              <span className="text-xs text-text-secondary">{dim.name} ({(dim.weight*100).toFixed(0)}%)</span>
                            </div>
                            <div className="flex gap-3">
                              {vals.map((v,i)=>(
                                <div key={i} className="flex-1 text-center">
                                  <div className="w-full h-10 bg-gray-100 rounded-lg overflow-hidden flex items-end">
                                    <div className="w-full rounded-t-lg transition-all"
                                      style={{height:`${v/100*40}px`,background:COMPARE_COLS[i],boxShadow:v===best?`0 0 8px ${COMPARE_COLS[i]}60`:'none'}}/>
                                  </div>
                                  <div className="flex items-center justify-center gap-1 mt-1">
                                    <CountryFlag code={compareC[i].code} size={10}/>
                                    <span className="text-[10px] font-black font-mono" style={{color:v===best?COMPARE_COLS[i]:'#5A6874'}}>
                                      {v===best?`★${v}`:v}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Scorecard table */}
                <div className="floating-card !p-0 overflow-hidden">
                  <div className="px-5 py-3 bg-background-offwhite border-b border-border-light text-xs font-black text-text-light uppercase tracking-wider">Scorecard — All Dimensions</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-background-offwhite/50">
                          <th className="px-4 py-3 text-left text-xs font-black text-text-light uppercase">Dimension</th>
                          {compareC.map((c,i)=>(
                            <th key={c.code} className="px-4 py-3 text-center text-xs font-black uppercase" style={{color:COMPARE_COLS[i]}}>
                              <div className="flex flex-col items-center gap-1">
                                <CountryFlag code={c.code} size={20}/>
                                {c.name}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[{code:'GFR',name:'GFR Total',weight:1},...DIMS].map(dim=>{
                          const vals=compareC.map(c=>(c as any)[dim.code.toLowerCase()])
                          const best=Math.max(...vals)
                          return (
                            <tr key={dim.code} className="border-t border-border-light hover:bg-background-offwhite/50">
                              <td className="px-4 py-3 text-xs font-semibold text-text-secondary">{(dim as any).name||dim.code} {dim.weight<1&&<span className="text-text-light">({((dim as any).weight*100).toFixed(0)}%)</span>}</td>
                              {vals.map((v,ci)=>(
                                <td key={ci} className="px-4 py-3 text-center font-mono font-black" style={{fontSize:dim.code==='GFR'?'17px':'13px',color:v===best?COMPARE_COLS[ci]:sc(v)}}>
                                  {v===best?`★ ${v}`:v}
                                </td>
                              ))}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            {compareC.length<2&&(
              <div className="floating-card text-center py-16">
                <div className="text-4xl mb-4">⚖</div>
                <div className="font-bold text-text-primary text-lg mb-2">Select at least 2 economies above</div>
                <div className="text-text-secondary text-sm">Radar overlay, bar charts, and full scorecard will appear</div>
              </div>
            )}
          </div>
        )}

        {/* METHODOLOGY TAB */}
        {tab==='method'&&(
          <div className="floating-card">
            <h2 className="text-2xl font-black text-primary-dark mb-3">GFR Methodology</h2>
            <p className="text-text-secondary mb-6 leading-relaxed max-w-2xl">The Global Future Readiness Ranking measures an economy's preparedness to attract and sustain FDI over the medium-to-long term. Designed to be comparable in rigour to IMD WCR, Kearney GCR, and the World Happiness Report.</p>
            <div className="grid grid-cols-3 gap-4">
              {DIMS.map(d=>(
                <div key={d.code} className="p-5 rounded-2xl border-l-4" style={{borderLeftColor:d.color,background:`${d.color}06`}}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-black font-mono" style={{color:d.color}}>{d.code}</span>
                    <span className="text-sm font-black px-3 py-1 rounded-full" style={{background:`${d.color}15`,color:d.color}}>{(d.weight*100).toFixed(0)}%</span>
                  </div>
                  <div className="font-bold text-primary-dark mb-2">{d.name}</div>
                  <div className="text-xs text-text-secondary leading-relaxed">{d.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
