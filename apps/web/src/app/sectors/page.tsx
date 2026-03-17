'use client';
import { useState } from 'react';
import Link from 'next/link';
import { exportCSV } from '@/lib/export';
const SECTORS=[
  {code:'J',name:'ICT & Technology',     icon:'💻',color:'#0A66C2',fdi_global_b:1840,growth:12.4,signals:48,risk:'LOW',  leaders:['USA','CHN','IRL'],desc:'Cloud infrastructure, AI data centres, semiconductor manufacturing, software platforms.'},
  {code:'K',name:'Finance',              icon:'🏦',color:'#059669',fdi_global_b:1210,growth:8.1, signals:32,risk:'LOW',  leaders:['GBR','USA','SGP'],desc:'Regional HQs, fintech, Islamic banking, asset management, insurance.'},
  {code:'D',name:'Energy & Renewables',  icon:'⚡',color:'#D97706',fdi_global_b:980, growth:14.8,signals:28,risk:'MED',  leaders:['SAU','ARE','DEU'],desc:'Solar, wind, green hydrogen, LNG, power grid infrastructure.'},
  {code:'C',name:'Manufacturing',        icon:'🏭',color:'#7C3AED',fdi_global_b:820, growth:5.2, signals:24,risk:'MED',  leaders:['CHN','VNM','MEX'],desc:'EV batteries, semiconductors, electronics, automotive, pharmaceutical.'},
  {code:'H',name:'Logistics & Transport',icon:'🚚',color:'#0891B2',fdi_global_b:420, growth:9.4, signals:14,risk:'LOW',  leaders:['SGP','ARE','NLD'],desc:'Port infrastructure, cold chain, e-commerce logistics, rail corridors.'},
  {code:'L',name:'Real Estate',          icon:'🏢',color:'#DB2777',fdi_global_b:380, growth:6.8, signals:18,risk:'MED',  leaders:['GBR','ARE','USA'],desc:'Commercial office, data centre real estate, logistics parks, residential.'},
  {code:'B',name:'Mining & Resources',   icon:'⛏️',color:'#78716C',fdi_global_b:440, growth:11.2,signals:16,risk:'HIGH', leaders:['AUS','CAN','CHL'],desc:'Critical minerals, copper, lithium, cobalt, iron ore.'},
  {code:'G',name:'Retail & E-commerce',  icon:'🛒',color:'#EA580C',fdi_global_b:210, growth:7.6, signals:10,risk:'MED',  leaders:['USA','GBR','CHN'],desc:'Omnichannel retail, marketplace platforms, last-mile delivery.'},
  {code:'I',name:'Education',            icon:'🎓',color:'#16A34A',fdi_global_b:140, growth:5.8, signals:8, risk:'LOW',  leaders:['GBR','USA','AUS'],desc:'Higher education campuses, EdTech platforms, vocational training.'},
  {code:'Q',name:'Healthcare',           icon:'🏥',color:'#DC2626',fdi_global_b:290, growth:9.9, signals:12,risk:'LOW',  leaders:['USA','GBR','DEU'],desc:'Hospital networks, pharma manufacturing, medical devices, biotech R&D.'},
  {code:'I2',name:'Tourism & Hospitality',icon:'✈️',color:'#0284C7',fdi_global_b:165, growth:13.4,signals:9, risk:'MED',  leaders:['ARE','THA','FRA'],desc:'Luxury hotels, MICE venues, theme parks, cultural tourism.'},
  {code:'A',name:'Agri & Food Tech',     icon:'🌾',color:'#65A30D',fdi_global_b:120, growth:8.2, signals:6, risk:'MED',  leaders:['BRA','NLD','AUS'],desc:'Precision agriculture, food processing, cold chain, AgriTech.'},
];
const RISK_CFG: Record<string,{bg:string;text:string}> = {LOW:{bg:'bg-emerald-100',text:'text-emerald-700'},MED:{bg:'bg-amber-100',text:'text-amber-700'},HIGH:{bg:'bg-red-100',text:'text-red-700'}};
export default function SectorsPage() {
  const [selected,setSelected]=useState<typeof SECTORS[0]|null>(null);
  const [sort,setSort]=useState<'fdi_global_b'|'growth'|'signals'>('fdi_global_b');
  const sorted=[...SECTORS].sort((a,b)=>b[sort]-a[sort]);
  return(
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-12">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Investment Sectors</div>
          <h1 className="text-4xl font-extrabold mb-2">Sector Intelligence</h1>
          <p className="text-white/70">21 ISIC sectors · Global FDI flows · Signal counts · Risk profiles</p>
        </div>
      </section>
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-screen-xl mx-auto flex gap-2 items-center">
          <span className="text-xs font-bold text-slate-400">Sort by:</span>
          {[['fdi_global_b','FDI Volume'],['growth','Growth'],['signals','Signals']].map(([k,l])=>(
            <button key={k} onClick={()=>setSort(k as any)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${sort===k?'bg-primary text-white':'border border-slate-200 text-slate-500 hover:border-primary'}`}>{l}</button>
          ))}
          <button onClick={()=>exportCSV(SECTORS.map(s=>({Code:s.code,Sector:s.name,'FDI $B':s.fdi_global_b,'Growth%':s.growth,Signals:s.signals,Risk:s.risk})),'GFM_Sectors')} className="ml-auto gfm-btn-outline text-xs py-1.5">Export CSV</button>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-6 py-6 grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sorted.map(s=>{
          const rc=RISK_CFG[s.risk];
          const isSel=selected?.code===s.code;
          return(
            <div key={s.code} onClick={()=>setSelected(isSel?null:s)}
              className={`gfm-card p-5 cursor-pointer ${isSel?'ring-2 ring-primary':''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="sector-icon text-xl" style={{background:`${s.color}18`,color:s.color}}>{s.icon}</div>
                <span className={`gfm-badge ${rc.bg} ${rc.text} text-xs`}>{s.risk}</span>
              </div>
              <div className="font-bold text-deep text-sm mb-1">{s.name}</div>
              <div className="text-xs text-slate-400 font-mono mb-3">ISIC {s.code}</div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div><div className="text-lg font-extrabold font-mono" style={{color:s.color}}>${s.fdi_global_b >= 1000?(s.fdi_global_b/1000).toFixed(1)+'T':s.fdi_global_b+'B'}</div><div className="text-xs text-slate-400">Global FDI</div></div>
                <div><div className="text-lg font-extrabold font-mono text-emerald-600">+{s.growth}%</div><div className="text-xs text-slate-400">YoY Growth</div></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 gfm-progress"><div className="gfm-progress-fill" style={{width:`${Math.min(100,s.fdi_global_b/22)}%`,background:s.color}}/></div>
                <span className="text-xs font-mono text-slate-500">{s.signals} signals</span>
              </div>
              {isSel&&(
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                  <div><div className="text-xs font-bold text-slate-400 mb-1">Top Destinations</div><div className="flex gap-1.5">{s.leaders.map(l=><span key={l} className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded font-mono">{l}</span>)}</div></div>
                  <Link href="/signals" className="text-xs text-primary font-semibold hover:underline">View {s.signals} signals →</Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
