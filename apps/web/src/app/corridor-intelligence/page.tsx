'use client';
import PreviewGate from '@/components/PreviewGate';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/shared';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const DEMO_CORRIDORS = [
  { id:'usa-uk',   from:'🇺🇸 USA',   to:'🇬🇧 UK',          fdi_bn:48.2, growth:4,  trend:[38,40,42,44,45,48], sectors:'Finance · Tech'         },
  { id:'usa-ire',  from:'🇺🇸 USA',   to:'🇮🇪 Ireland',      fdi_bn:38.4, growth:7,  trend:[28,30,32,35,36,38], sectors:'Tech · Finance'          },
  { id:'cn-asean', from:'🇨🇳 China', to:'🌏 ASEAN Hub',      fdi_bn:32.1, growth:18, trend:[18,20,23,26,28,32], sectors:'Manufacturing · Logistics'},
  { id:'us-sg',    from:'🇺🇸 USA',   to:'🇸🇬 Singapore',    fdi_bn:24.8, growth:6,  trend:[18,19,21,22,23,25], sectors:'Finance · ICT'           },
  { id:'eu-uae',   from:'🇪🇺 EU',    to:'🇦🇪 UAE',          fdi_bn:22.4, growth:22, trend:[12,14,16,18,20,22], sectors:'Finance · Energy'        },
  { id:'us-ind',   from:'🇺🇸 USA',   to:'🇮🇳 India',        fdi_bn:19.6, growth:12, trend:[12,13,15,17,18,20], sectors:'Tech · Healthcare'       },
  { id:'gcc-asia', from:'🌙 GCC',    to:'🌏 Asia',          fdi_bn:18.2, growth:28, trend:[8,10,12,14,16,18],  sectors:'Energy · Finance'        },
  { id:'uk-ind',   from:'🇬🇧 UK',    to:'🇮🇳 India',        fdi_bn:14.8, growth:9,  trend:[10,11,12,13,14,15], sectors:'Finance · Pharma'        },
  { id:'jp-viet',  from:'🇯🇵 Japan', to:'🇻🇳 Vietnam',      fdi_bn:12.4, growth:14, trend:[7,8,9,10,11,12],   sectors:'Manufacturing · Tech'    },
  { id:'ger-pol',  from:'🇩🇪 Germany',to:'🇵🇱 Poland',      fdi_bn:11.2, growth:8,  trend:[7,8,9,10,10,11],   sectors:'Automotive · Manufacturing'},
];

const YEARS = ['2020','2021','2022','2023','2024','2025'];

function MiniBar({ trend, color }: { trend: number[]; color: string }) {
  const max = Math.max(...trend);
  return (
    <div className="flex items-end gap-0.5 h-10">
      {trend.map((v,i)=>(
        <div key={i} className="flex-1 rounded-sm transition-all" style={{height:`${(v/max)*100}%`,background:i===trend.length-1?color:`${color}60`,minHeight:3}}/>
      ))}
    </div>
  );
}

export default function CorridorIntelligencePage() {
  const [corridors, setCorridors] = useState(DEMO_CORRIDORS);
  const [selected,  setSelected]  = useState('usa-uk');

  useEffect(() => {
    fetchWithAuth(`${API}/api/v1/corridors`).then(r=>r.json())
      .then(d=>{ const c=d.data?.corridors||d.corridors; if(c?.length) setCorridors(c); }).catch(()=>{});
  }, []);

  const active = corridors.find(c=>c.id===selected) || corridors[0];

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-10">
        <div className="max-w-screen-xl mx-auto relative z-10 flex flex-wrap justify-between gap-4 items-end">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#74BB65'}}>Bilateral Intelligence</div>
            <h1 className="text-3xl font-extrabold" style={{color:'#0A3D62'}}>Corridor Intelligence</h1>
            <p className="text-sm mt-1" style={{color:'#696969'}}>Top 10 bilateral FDI corridors · 5-year historical trends · Sector breakdown</p>
          </div>
          <div className="flex gap-5">
            {[['10','Corridors'],['$232B','Total Flow'],['2020–2025','Coverage'],['5yr','Trend Data']].map(([v,l])=>(
              <div key={l} className="text-center">
                <div className="text-xl font-extrabold font-data" style={{color:'#74BB65'}}>{v}</div>
                <div className="text-xs mt-0.5" style={{color:'#696969'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 py-5 grid lg:grid-cols-3 gap-5">
        {/* Corridor list */}
        <div className="space-y-2">
          {corridors.map((c,i)=>(
            <button key={c.id} onClick={()=>setSelected(c.id)}
              className={`w-full gfm-card p-4 text-left transition-all ${selected===c.id?'border-radiance/40':''}`}
              style={selected===c.id?{borderColor:'rgba(116,187,101,0.3)',background:'rgba(116,187,101,0.04)'}:{}}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold font-data" style={{color:'#696969'}}>#{i+1}</span>
                  <span className="text-sm font-bold" style={{color:'#0A3D62'}}>{c.from} → {c.to}</span>
                </div>
                <span className="text-xs font-extrabold font-data" style={{color:'#74BB65'}}>${c.fdi_bn}B</span>
              </div>
              <div className="flex items-end justify-between gap-3">
                <MiniBar trend={c.trend} color={selected===c.id?'#74BB65':'#696969'}/>
                <span className="text-xs font-bold flex-shrink-0" style={{color:'#22c55e'}}>▲{c.growth}%</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2 space-y-4">
          {active && (
            <>
              <div className="gfm-card p-6">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <h2 className="text-xl font-extrabold mb-1" style={{color:'#0A3D62'}}>{active.from} → {active.to}</h2>
                    <div className="text-sm" style={{color:'#696969'}}>{active.sectors}</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-extrabold font-data" style={{color:'#74BB65'}}>${active.fdi_bn}B</div>
                      <div className="text-xs" style={{color:'#696969'}}>2025 FDI Flow</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-extrabold font-data" style={{color:'#22c55e'}}>+{active.growth}%</div>
                      <div className="text-xs" style={{color:'#696969'}}>YoY Growth</div>
                    </div>
                  </div>
                </div>

                {/* Full bar chart */}
                <div className="mt-4">
                  <div className="flex items-end gap-2 h-32">
                    {active.trend.map((v,i)=>{
                      const max = Math.max(...active.trend);
                      const pct = (v/max)*100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-xs font-data" style={{color:'#696969'}}>${v}B</span>
                          <div className="w-full rounded-t-lg transition-all" style={{height:`${pct}%`,background:i===active.trend.length-1?'#74BB65':'rgba(116,187,101,0.4)',minHeight:8}}/>
                          <span className="text-xs" style={{color:'#696969'}}>{YEARS[i]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sector breakdown */}
              <div className="gfm-card p-5">
                <div className="font-extrabold text-sm mb-3" style={{color:'#0A3D62'}}>Sector Composition</div>
                <div className="space-y-2">
                  {active.sectors.split(' · ').map((s,i,arr)=>{
                    const pct = Math.round((1/(i+1))*(100/arr.length)*2.5+30);
                    const c = ['#74BB65','#74BB65','#0A3D62'][i]||'#696969';
                    return (
                      <div key={s} className="flex items-center gap-3">
                        <span className="text-sm w-36 flex-shrink-0" style={{color:'#696969'}}>{s}</span>
                        <div className="flex-1 bg-white/5 rounded-full h-2">
                          <div className="h-2 rounded-full" style={{width:`${pct}%`,background:c}}/>
                        </div>
                        <span className="text-xs font-extrabold font-data" style={{color:c}}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
