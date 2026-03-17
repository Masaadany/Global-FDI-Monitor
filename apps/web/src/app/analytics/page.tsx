'use client';
import { useState, useEffect } from 'react';

const FIC_HISTORY = [
  {month:'Oct 25',allocated:400,used:312,reports:8,signals:48},
  {month:'Nov 25',allocated:400,used:388,reports:10,signals:54},
  {month:'Dec 25',allocated:400,used:356,reports:9,signals:51},
  {month:'Jan 26',allocated:400,used:290,reports:7,signals:42},
  {month:'Feb 26',allocated:400,used:408,reports:11,signals:58},
  {month:'Mar 26',allocated:400,used:187,reports:5,signals:32},
];

const REPORT_HISTORY = [
  {ref:'FCR-CEGP-ARE-20260315',type:'CEGP',eco:'UAE',     date:'15 Mar 2026',fic:20,dl:3},
  {ref:'FCR-MIB-SAU-20260312', type:'MIB', eco:'Saudi Arabia',date:'12 Mar 2026',fic:5, dl:1},
  {ref:'FCR-SPOR-IND-20260310',type:'SPOR',eco:'India',   date:'10 Mar 2026',fic:22,dl:2},
  {ref:'FCR-TIR-DEU-20260308', type:'TIR', eco:'Germany', date:'08 Mar 2026',fic:18,dl:1},
  {ref:'FCR-ICR-SGP-20260305', type:'ICR', eco:'Singapore',date:'05 Mar 2026',fic:18,dl:4},
  {ref:'FCR-MIB-EGY-20260301', type:'MIB', eco:'Egypt',   date:'01 Mar 2026',fic:5, dl:1},
];

const SIGNAL_BREAKDOWN = [
  {grade:'PLATINUM',count:12,pct:8,  fic_spent:12,color:'bg-amber-400'},
  {grade:'GOLD',    count:89,pct:59, fic_spent:0, color:'bg-emerald-500'},
  {grade:'SILVER',  count:42,pct:28, fic_spent:0, color:'bg-blue-400'},
  {grade:'BRONZE',  count:8, pct:5,  fic_spent:0, color:'bg-slate-400'},
];

const TOP_ECONOMIES = [
  {flag:'🇦🇪',name:'UAE',        signals:89, pct:100},
  {flag:'🇸🇦',name:'Saudi Arabia',signals:74, pct:83},
  {flag:'🇮🇳',name:'India',      signals:68, pct:76},
  {flag:'🇩🇪',name:'Germany',    signals:52, pct:58},
  {flag:'🇸🇬',name:'Singapore',  signals:38, pct:43},
];

function SparkBar({data, maxVal}: {data: {allocated:number,used:number}[], maxVal: number}) {
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d,i) => (
        <div key={i} className="flex-1 flex flex-col gap-0.5 items-center">
          <div className="w-full flex flex-col gap-0.5" style={{height:56}}>
            <div className="w-full bg-slate-100 rounded-t overflow-hidden flex-1 relative">
              <div className="absolute bottom-0 w-full bg-blue-200 rounded-t"
                style={{height:`${(d.allocated/maxVal)*100}%`}}/>
              <div className="absolute bottom-0 w-full bg-blue-600 rounded-t"
                style={{height:`${(d.used/maxVal)*100}%`}}/>
            </div>
          </div>
          <div className="text-[9px] text-slate-400 text-center leading-none">{d.month}</div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [ficBalance, setFicBalance] = useState(4213);
  const [period, setPeriod] = useState<'30d'|'90d'|'12m'>('30d');

  const totalFICUsed   = FIC_HISTORY.slice(-3).reduce((s,m) => s+m.used, 0);
  const totalReports   = REPORT_HISTORY.length;
  const totalSignals   = SIGNAL_BREAKDOWN.reduce((s,g) => s+g.count, 0);
  const totalFICSpent  = REPORT_HISTORY.reduce((s,r) => s+r.fic, 0);

  useEffect(() => {
    const id = setInterval(() => {
      setFicBalance(b => Math.max(0, b + (Math.random() > 0.8 ? -5 : 0)));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-3 sticky top-14 z-30">
        <span className="font-black text-sm text-[#0A2540]">Usage Analytics</span>
        <div className="flex gap-1.5 ml-4">
          {(['30d','90d','12m'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${period===p ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'}`}>
              Last {p}
            </button>
          ))}
        </div>
        <button className="ml-auto bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-4 py-2 rounded-lg hover:border-blue-300 transition-colors">
          ↓ Export Usage Report
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {label:'FIC Balance',     value:ficBalance.toLocaleString(), sub:'of 4,800 annual (professional)', color:'text-blue-700', bg:'bg-blue-50'},
            {label:'FIC Used (90d)',  value:totalFICUsed.toLocaleString(), sub:'Avg 328/month',              color:'text-slate-700', bg:'bg-slate-50'},
            {label:'Reports Generated',value:String(totalReports),        sub:`${totalFICSpent} FIC spent`,   color:'text-violet-700',bg:'bg-violet-50'},
            {label:'Signals Viewed',  value:String(totalSignals),         sub:'7-day period',                color:'text-emerald-700',bg:'bg-emerald-50'},
          ].map(k => (
            <div key={k.label} className={`${k.bg} rounded-xl p-4 border border-white`}>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{k.label}</div>
              <div className={`text-2xl font-black ${k.color}`}>{k.value}</div>
              <div className="text-xs text-slate-400 mt-1">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* FIC usage chart + breakdown */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="font-bold text-sm text-[#0A2540] mb-0.5">FIC Credit Usage — 6 Months</div>
            <div className="text-xs text-slate-400 mb-4">Blue bars: used. Light bars: allocated monthly equivalent</div>
            <SparkBar data={FIC_HISTORY} maxVal={500}/>
            <div className="flex justify-between text-xs mt-3 text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 bg-blue-600 rounded-sm inline-block"/>FIC Used
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 bg-blue-200 rounded-sm inline-block"/>FIC Allocated
              </span>
              <span className="text-blue-600 font-semibold">
                {Math.round(totalFICUsed / 3)}/month avg
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="font-bold text-sm text-[#0A2540] mb-4">FIC Breakdown by Category</div>
            {[
              {label:'Report Generation',  pct:58, fic:253, color:'bg-blue-600'},
              {label:'Platinum Signal Views',pct:18,fic:78, color:'bg-amber-400'},
              {label:'GFR Profiles (PDF)',   pct:12,fic:52, color:'bg-violet-500'},
              {label:'Forecast Data Packs',  pct:8, fic:35, color:'bg-emerald-500'},
              {label:'Other',               pct:4, fic:17, color:'bg-slate-400'},
            ].map(c => (
              <div key={c.label} className="flex items-center gap-2 mb-2.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:c.color.replace('bg-','').replace('-400','').replace('-500','').replace('-600','')}}/>
                <div className={`w-2 h-2 rounded-sm flex-shrink-0 ${c.color}`}/>
                <span className="text-xs text-slate-600 flex-1">{c.label}</span>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${c.color} rounded-full`} style={{width:`${c.pct}%`}}/>
                </div>
                <span className="text-xs font-bold text-slate-600 w-10 text-right">{c.fic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signal stats + report history */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="font-bold text-sm text-[#0A2540] mb-4">Signals Viewed — Grade Breakdown (7d)</div>
            {SIGNAL_BREAKDOWN.map(g => (
              <div key={g.grade} className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-slate-500 w-16">{g.grade}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${g.color} rounded-full`} style={{width:`${g.pct}%`}}/>
                </div>
                <span className="text-xs font-black text-slate-700 w-6 text-right">{g.count}</span>
                {g.fic_spent > 0 && (
                  <span className="text-xs text-amber-600 font-bold w-14 text-right">{g.fic_spent} FIC</span>
                )}
              </div>
            ))}
            <div className="border-t border-slate-100 pt-3 mt-3">
              <div className="font-bold text-xs text-[#0A2540] mb-2">Top Economies Tracked</div>
              {TOP_ECONOMIES.map(e => (
                <div key={e.name} className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm">{e.flag}</span>
                  <span className="text-xs text-slate-600 flex-1">{e.name}</span>
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{width:`${e.pct}%`}}/>
                  </div>
                  <span className="text-xs font-bold text-slate-600 w-6 text-right">{e.signals}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="font-bold text-sm text-[#0A2540] mb-4">Report Generation History</div>
            <div className="space-y-2.5">
              {REPORT_HISTORY.map(r => (
                <div key={r.ref} className="flex gap-3 items-start py-2 border-b border-slate-50 last:border-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-blue-600 flex-shrink-0">
                    {r.type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#0A2540]">{r.eco} — {r.type} Report</div>
                    <div className="text-xs text-slate-400">{r.date} · {r.fic} FIC · {r.dl} download{r.dl!==1?'s':''}</div>
                    <div className="text-xs text-slate-300 font-mono mt-0.5 truncate">{r.ref}</div>
                  </div>
                  <button className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-semibold flex-shrink-0">
                    ↓
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FIC projection */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="font-bold text-sm text-[#0A2540] mb-3">Annual FIC Projection</div>
          <div className="grid grid-cols-3 gap-4">
            {[
              {label:'Annual Allowance',  value:'4,800 FIC',    note:'Professional plan — resets annually'},
              {label:'Used to Date',      value:'587 FIC',      note:'Oct 2025 – Mar 2026 (5 months)'},
              {label:'Projected Year-End',value:'1,408 FIC',    note:'At current usage rate — 2,413 remaining'},
            ].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-400 font-medium mb-1">{s.label}</div>
                <div className="text-xl font-black text-[#0A2540]">{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.note}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>FIC utilisation: 12.2% of annual allowance</span>
              <span>4,213 credits remaining</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{width:'12.2%'}}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
