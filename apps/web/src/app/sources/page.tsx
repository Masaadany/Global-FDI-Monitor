'use client';
import { useState } from 'react';

const SOURCES = [
  // Tier 1 - International Organisations
  {id:'S001',name:'IMF World Economic Outlook',     org:'IMF',       tier:'T1',type:'IO',        premium:false,freq:'Biannual', coverage:'215 economies',indicators:['GDP','Inflation','Unemployment','Current Account'],status:'ACTIVE'},
  {id:'S002',name:'World Bank WDI',                 org:'World Bank',tier:'T1',type:'IO',        premium:false,freq:'Annual',   coverage:'217 economies',indicators:['FDI Inflows','GDP per capita','Internet Users','Literacy'],status:'ACTIVE'},
  {id:'S003',name:'UNCTAD Investment Statistics',   org:'UNCTAD',    tier:'T1',type:'IO',        premium:false,freq:'Annual',   coverage:'196 economies',indicators:['FDI Flows','FDI Stock','M&A','Greenfield'],status:'ACTIVE'},
  {id:'S004',name:'ILO STAT',                       org:'ILO',       tier:'T1',type:'IO',        premium:false,freq:'Annual',   coverage:'189 economies',indicators:['Labour Force','Wages','Productivity'],status:'ACTIVE'},
  {id:'S005',name:'IEA Energy Statistics',          org:'IEA',       tier:'T1',type:'IO',        premium:false,freq:'Annual',   coverage:'150+ economies',indicators:['Energy Mix','Renewables','Carbon Intensity'],status:'ACTIVE'},
  {id:'S006',name:'IRENA Renewable Energy',         org:'IRENA',     tier:'T1',type:'IO',        premium:false,freq:'Annual',   coverage:'170+ economies',indicators:['RE Capacity','Investment','Jobs'],status:'ACTIVE'},
  {id:'S007',name:'WTO Statistics Portal',          org:'WTO',       tier:'T1',type:'IO',        premium:false,freq:'Annual',   coverage:'164 members',  indicators:['Trade Flows','Tariffs','Services'],status:'ACTIVE'},
  {id:'S008',name:'OECD Data Portal',               org:'OECD',      tier:'T1',type:'IO',        premium:false,freq:'Quarterly',coverage:'38 members',   indicators:['FDI','Trade','Tax','Education'],status:'ACTIVE'},
  {id:'S009',name:'UN Comtrade',                    org:'UN',        tier:'T1',type:'IO',        premium:false,freq:'Monthly',  coverage:'200+ economies',indicators:['Bilateral Trade','HS codes'],status:'ACTIVE'},
  {id:'S010',name:'Federal Reserve FRED',           org:'US Fed',    tier:'T1',type:'CENTRAL_BANK',premium:false,freq:'Daily', coverage:'USA + Global', indicators:['Interest Rates','Exchange Rates','Money Supply'],status:'ACTIVE'},
  // NGO & Research
  {id:'S011',name:'Transparency International CPI', org:'TI',        tier:'T4',type:'NGO',       premium:false,freq:'Annual',  coverage:'180+ economies',indicators:['Corruption Index'],status:'ACTIVE'},
  {id:'S012',name:'Freedom House',                  org:'FH',        tier:'T4',type:'NGO',       premium:false,freq:'Annual',  coverage:'210 territories',indicators:['Political Freedom','Civil Liberties'],status:'ACTIVE'},
  {id:'S013',name:'World Justice Project',          org:'WJP',       tier:'T4',type:'NGO',       premium:false,freq:'Annual',  coverage:'140 economies',indicators:['Rule of Law'],status:'ACTIVE'},
  {id:'S014',name:'GDELT News Intelligence',        org:'GDELT',     tier:'T6',type:'MEDIA',     premium:false,freq:'15 min',  coverage:'Global media',  indicators:['News Signals','Event Detection'],status:'ACTIVE'},
  // National Statistics
  {id:'S015',name:'UAE Federal Statistics Centre',  org:'FCSA UAE',  tier:'T1',type:'GOVERNMENT',premium:false,freq:'Quarterly',coverage:'UAE',          indicators:['GDP','CPI','Trade','FDI'],status:'ACTIVE'},
  {id:'S016',name:'GASTAT Saudi Arabia',            org:'GASTAT',    tier:'T1',type:'GOVERNMENT',premium:false,freq:'Quarterly',coverage:'Saudi Arabia', indicators:['GDP','Population','Trade'],status:'ACTIVE'},
  // Premium Sources
  {id:'S017',name:'Bloomberg Terminal API',         org:'Bloomberg', tier:'T3',type:'COMMERCIAL',premium:true, freq:'Real-time',coverage:'Global markets',indicators:['All financial data'],status:'INACTIVE'},
  {id:'S018',name:'fDi Markets (Financial Times)',  org:'FT',        tier:'T4',type:'COMMERCIAL',premium:true, freq:'Daily',    coverage:'Global FDI',   indicators:['Greenfield projects','Capex','Jobs'],status:'INACTIVE'},
  {id:'S019',name:'Oxford Economics',               org:'OE',        tier:'T4',type:'COMMERCIAL',premium:true, freq:'Monthly',  coverage:'200 economies',indicators:['Macro forecasts','Scenarios'],status:'INACTIVE'},
  {id:'S020',name:'PitchBook VC/PE/M&A',            org:'PitchBook', tier:'T4',type:'COMMERCIAL',premium:true, freq:'Daily',    coverage:'Global deals', indicators:['M&A','VC rounds','PE'],status:'INACTIVE'},
];

const TIER_COLORS: Record<string,string> = {
  T1:'bg-emerald-100 text-emerald-700', T2:'bg-blue-100 text-blue-700',
  T3:'bg-violet-100 text-violet-700',   T4:'bg-amber-100 text-amber-700',
  T6:'bg-slate-100 text-slate-600',
};

export default function SourcesPage() {
  const [filter,   setFilter]   = useState<'all'|'active'|'premium'>('all');
  const [selected, setSelected] = useState(SOURCES[0]);

  const filtered = SOURCES.filter(s =>
    filter === 'all'     ? true :
    filter === 'active'  ? !s.premium :
    s.premium
  );

  const active  = SOURCES.filter(s => !s.premium).length;
  const premium = SOURCES.filter(s => s.premium).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#0A2540] text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black mb-2">Data Sources</h1>
          <p className="text-blue-200 text-sm">Every data point on this platform carries source attribution and SHA-256 verification.</p>
          <div className="flex gap-6 mt-4 text-sm">
            <div><span className="text-2xl font-black text-emerald-400">{active}</span><span className="text-blue-300 ml-2">Active free sources</span></div>
            <div><span className="text-2xl font-black text-amber-400">{premium}</span><span className="text-blue-300 ml-2">Premium sources ready</span></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5">
        <div className="flex gap-2 mb-5">
          {[['all','All Sources'],['active','Free & Active'],['premium','Premium']].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter===v ? 'bg-[#0A2540] text-white' : 'bg-white border border-slate-200 text-slate-500'
              }`}>{l}</button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Source','Org','Tier','Frequency','Status'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} onClick={() => setSelected(s)}
                    className={`border-b border-slate-50 cursor-pointer transition-colors ${
                      selected.id===s.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                    }`}>
                    <td className="px-4 py-3 font-semibold text-[#0A2540]">{s.name}</td>
                    <td className="px-4 py-3 text-slate-500">{s.org}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded font-bold ${TIER_COLORS[s.tier]}`}>{s.tier}</span></td>
                    <td className="px-4 py-3 text-slate-500">{s.freq}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        s.status==='ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                      }`}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="font-black text-[#0A2540] mb-1">{selected.name}</div>
            <div className="text-xs text-slate-400 mb-4">{selected.org} · {selected.type}</div>
            <div className="space-y-2 mb-4">
              {[
                {l:'Tier',     v:selected.tier},
                {l:'Frequency',v:selected.freq},
                {l:'Coverage', v:selected.coverage},
                {l:'Status',   v:selected.status},
              ].map(f => (
                <div key={f.l} className="flex justify-between text-xs">
                  <span className="text-slate-400">{f.l}</span>
                  <span className="font-bold text-[#0A2540]">{f.v}</span>
                </div>
              ))}
            </div>
            <div className="text-xs font-bold text-slate-400 mb-2">Indicators</div>
            <div className="flex flex-wrap gap-1">
              {selected.indicators.map(ind => (
                <span key={ind} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">{ind}</span>
              ))}
            </div>
            {selected.premium && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                <strong>Premium source</strong> — contact enterprise@fdimonitor.org to activate.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
