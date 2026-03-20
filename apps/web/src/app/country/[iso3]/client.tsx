'use client';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import { fetchWithAuth } from '@/lib/shared';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const STATIC_ISOS = [
  'ARE','SAU','QAT','BHR','KWT','OMN','EGY','JOR','MAR','IRQ',
  'SGP','IND','VNM','IDN','CHN','JPN','KOR','AUS','THA','MYS',
  'USA','GBR','DEU','FRA','NLD','CHE','SWE','POL','ESP','ITA','ZAF',
];

const FLAGS: Record<string,string> = {
  ARE:'🇦🇪',SAU:'🇸🇦',QAT:'🇶🇦',BHR:'🇧🇭',KWT:'🇰🇼',OMN:'🇴🇲',EGY:'🇪🇬',JOR:'🇯🇴',MAR:'🇲🇦',IRQ:'🇮🇶',
  SGP:'🇸🇬',IND:'🇮🇳',VNM:'🇻🇳',IDN:'🇮🇩',CHN:'🇨🇳',JPN:'🇯🇵',KOR:'🇰🇷',AUS:'🇦🇺',THA:'🇹🇭',MYS:'🇲🇾',
  USA:'🇺🇸',GBR:'🇬🇧',DEU:'🇩🇪',FRA:'🇫🇷',NLD:'🇳🇱',CHE:'🇨🇭',SWE:'🇸🇪',POL:'🇵🇱',ESP:'🇪🇸',ITA:'🇮🇹',ZAF:'🇿🇦',
};

const NAMES: Record<string,string> = {
  ARE:'United Arab Emirates',SAU:'Saudi Arabia',QAT:'Qatar',BHR:'Bahrain',KWT:'Kuwait',OMN:'Oman',EGY:'Egypt',JOR:'Jordan',MAR:'Morocco',IRQ:'Iraq',
  SGP:'Singapore',IND:'India',VNM:'Vietnam',IDN:'Indonesia',CHN:'China',JPN:'Japan',KOR:'South Korea',AUS:'Australia',THA:'Thailand',MYS:'Malaysia',
  USA:'United States',GBR:'United Kingdom',DEU:'Germany',FRA:'France',NLD:'Netherlands',CHE:'Switzerland',SWE:'Sweden',POL:'Poland',ESP:'Spain',ITA:'Italy',ZAF:'South Africa',
};

// Demo data per country
function getCountryData(iso3: string) {
  const base: Record<string, any> = {
    ARE:{ fdi:25.3,growth:12,gfr:80.0,rank:6, tier:'FRONTIER',gdp_bn:498, gdp_growth:4.2, pop:'9.9M',capital:'Abu Dhabi',currency:'AED',tz:'GMT+4',signals:22,platinum:5 },
    SAU:{ fdi:18.2,growth:15,gfr:72.1,rank:12,tier:'HIGH',    gdp_bn:1110,gdp_growth:3.8, pop:'36.9M',capital:'Riyadh',   currency:'SAR',tz:'GMT+3',signals:18,platinum:4 },
    SGP:{ fdi:18.5,growth:6, gfr:88.5,rank:1, tier:'FRONTIER',gdp_bn:501, gdp_growth:3.2, pop:'5.9M', capital:'Singapore',currency:'SGD',tz:'GMT+8',signals:15,platinum:3 },
    IND:{ fdi:12.3,growth:9, gfr:58.4,rank:48,tier:'MEDIUM',  gdp_bn:3730,gdp_growth:7.2, pop:'1.44B',capital:'New Delhi',currency:'INR',tz:'GMT+5:30',signals:14,platinum:3 },
    USA:{ fdi:182, growth:4, gfr:84.5,rank:3, tier:'FRONTIER',gdp_bn:27360,gdp_growth:2.8,pop:'335M', capital:'Washington DC',currency:'USD',tz:'Multiple',signals:30,platinum:8 },
    DEU:{ fdi:12.8,growth:4, gfr:78.1,rank:8, tier:'HIGH',    gdp_bn:4082,gdp_growth:1.4, pop:'84M',  capital:'Berlin',   currency:'EUR',tz:'GMT+1',signals:10,platinum:2 },
    GBR:{ fdi:14.8,growth:2, gfr:78.5,rank:7, tier:'HIGH',    gdp_bn:3088,gdp_growth:1.8, pop:'68M',  capital:'London',   currency:'GBP',tz:'GMT+0',signals:12,platinum:2 },
    CHN:{ fdi:42.8,growth:-2,gfr:62.1,rank:32,tier:'MEDIUM',  gdp_bn:17963,gdp_growth:5.2,pop:'1.4B', capital:'Beijing',  currency:'CNY',tz:'GMT+8',signals:20,platinum:3 },
    JPN:{ fdi:9.8, growth:3, gfr:76.8,rank:9, tier:'HIGH',    gdp_bn:4231,gdp_growth:1.9, pop:'124M', capital:'Tokyo',    currency:'JPY',tz:'GMT+9',signals:8, platinum:1 },
    AUS:{ fdi:14.2,growth:7, gfr:82.1,rank:5, tier:'FRONTIER',gdp_bn:1724,gdp_growth:2.4, pop:'26M',  capital:'Canberra', currency:'AUD',tz:'GMT+10',signals:11,platinum:2 },
  };
  return base[iso3] || { fdi:5, growth:5, gfr:55, rank:60, tier:'MEDIUM', gdp_bn:200, gdp_growth:3, pop:'10M', capital:'Capital', currency:'USD', tz:'GMT+0', signals:5, platinum:1 };
}

export default function CountryProfileClient({ iso3 }: { iso3: string }) {
  const [tab,     setTab]     = useState<'overview'|'signals'|'sectors'|'fz'>('overview');
  const [signals, setSignals] = useState<any[]>([]);

  const flag  = FLAGS[iso3]  || '🌍';
  const name  = NAMES[iso3]  || iso3;
  const data  = getCountryData(iso3);
  const tier  = data.tier;
  const tierColors: Record<string,string> = { FRONTIER:'#FFBE00', HIGH:'#FF9200', MEDIUM:'#87A19E', DEVELOPING:'#496767' };
  const tc = tierColors[tier] || '#87A19E';

  useEffect(() => {
    fetchWithAuth(`${API}/api/v1/signals?iso3=${iso3}&limit=8`)
      .then(r=>r.json())
      .then(d=>{ const s=d.data?.signals||d.signals; if(s?.length) setSignals(s.slice(0,6)); })
      .catch(()=>{});
  }, [iso3]);

  const DEMO_SIGNALS = [
    { reference_code:`GFM-${iso3}-MSFT-2026-PL01`, company:'Microsoft',  grade:'PLATINUM', capex_m:850,  signal_type:'Greenfield' },
    { reference_code:`GFM-${iso3}-GOOG-2026-GD01`, company:'Google',     grade:'GOLD',     capex_m:420,  signal_type:'Expansion'  },
    { reference_code:`GFM-${iso3}-ACWA-2026-GD02`, company:'ACWA Power', grade:'GOLD',     capex_m:380,  signal_type:'Greenfield' },
  ];
  const displaySignals = signals.length ? signals : DEMO_SIGNALS;
  const GRADE_COLORS: Record<string,string> = {PLATINUM:'#FFBE00',GOLD:'#FF9200',SILVER:'#87A19E',BRONZE:'#496767'};

  return (
    <div className="min-h-screen" style={{background:'#0F0A0A'}}>
      <NavBar/>
      <section className="gfm-hero px-6 py-12">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="flex items-start gap-5 flex-wrap">
            <div className="text-7xl">{flag}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="text-4xl font-extrabold" style={{color:'#FAFAF0'}}>{name}</h1>
                <span className="text-sm font-extrabold px-3 py-1 rounded-full" style={{background:`${tc}20`,color:tc,border:`1px solid ${tc}40`}}>{tier}</span>
                <span className="text-sm font-extrabold font-data px-2 py-1 rounded" style={{background:'rgba(255,102,0,0.15)',color:'#FF6600'}}>GFR #{data.rank}</span>
              </div>
              <div className="text-sm" style={{color:'#87A19E'}}>
                Capital: {data.capital} · Currency: {data.currency} · Timezone: {data.tz} · Population: {data.pop}
              </div>
              <div className="flex gap-6 mt-5 flex-wrap">
                {[
                  {l:'FDI Inflows', v:`$${data.fdi}B`, c:'#FF6600'},
                  {l:'Growth YoY',  v:`${data.growth>0?'+':''}${data.growth}%`, c:data.growth>0?'#22c55e':'#EF4444'},
                  {l:'GFR Score',   v:data.gfr,         c:tc},
                  {l:'GDP (2025)',  v:`$${(data.gdp_bn/1000).toFixed(1)}T`,  c:'#FF9200'},
                  {l:'GDP Growth',  v:`+${data.gdp_growth}%`, c:'#87A19E'},
                  {l:'Live Signals',v:data.signals,     c:'#FF6600'},
                ].map(k=>(
                  <div key={k.l}>
                    <div className="text-2xl font-extrabold font-data" style={{color:k.c}}>{k.v}</div>
                    <div className="text-xs mt-0.5" style={{color:'#496767'}}>{k.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 z-30 flex gap-0 border-b px-6 overflow-x-auto" style={{background:'rgba(15,25,26,0.96)',borderBottomColor:'rgba(135,161,158,0.15)',backdropFilter:'blur(10px)'}}>
        {[['overview','📊 Overview'],['signals','📡 Signals'],['sectors','🏭 Sectors'],['fz','🏢 Free Zones']].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t as any)} className={`dash-tab ${tab===t?'active':''}`}>{l}</button>
        ))}
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-5">
        {tab === 'overview' && (
          <div className="space-y-5">
            {/* GFR dimensions mini */}
            <div className="gfm-card p-5">
              <div className="font-extrabold text-sm mb-4" style={{color:'#FAFAF0'}}>GFR Dimension Scores</div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  {d:'Macro',   s:Math.round(data.gfr+2),  c:'#FF6600'},
                  {d:'Policy',  s:Math.round(data.gfr-2),  c:'#FF9200'},
                  {d:'Digital', s:Math.round(data.gfr+4),  c:'#FFBE00'},
                  {d:'Human',   s:Math.round(data.gfr-8),  c:'#87A19E'},
                  {d:'Infra',   s:Math.round(data.gfr+6),  c:'#22c55e'},
                  {d:'Sustain', s:Math.round(data.gfr-5),  c:'#87A19E'},
                ].map(dim=>(
                  <div key={dim.d} className="p-3 rounded-xl text-center" style={{background:'rgba(15,37,38,0.7)'}}>
                    <div className="text-xs mb-1" style={{color:'#496767'}}>{dim.d}</div>
                    <div className="text-2xl font-extrabold font-data" style={{color:dim.c}}>{dim.s}</div>
                    <div className="gfm-progress mt-2 h-1"><div className="gfm-progress-bar h-1" style={{width:`${dim.s}%`,background:dim.c}}/></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-3">
              <Link href={`/pmp?iso3=${iso3}`}       className="gfm-btn-primary text-sm py-2 px-5">Mission Planning →</Link>
              <Link href={`/benchmarking?iso3=${iso3}`} className="gfm-btn-outline text-sm py-2 px-5">Compare Economy</Link>
              <Link href="/gfr"                       className="gfm-btn-outline text-sm py-2 px-5" style={{color:'#87A19E'}}>GFR Assessments</Link>
            </div>
          </div>
        )}

        {tab === 'signals' && (
          <div className="gfm-card overflow-hidden">
            <div className="px-5 py-3 border-b flex items-center gap-2" style={{borderBottomColor:'rgba(135,161,158,0.1)'}}>
              <span className="live-dot"/><span className="text-xs font-extrabold uppercase tracking-widest" style={{color:'#496767'}}>Live Signals — {name}</span>
            </div>
            <div className="divide-y" style={{borderColor:'rgba(135,161,158,0.06)'}}>
              {displaySignals.map((s,i)=>(
                <div key={i} className="px-5 py-4 flex items-center gap-4">
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full" style={{background:`${GRADE_COLORS[s.grade]||'#87A19E'}20`,color:GRADE_COLORS[s.grade]||'#87A19E'}}>{s.grade}</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm" style={{color:'#FAFAF0'}}>{s.company}</div>
                    <div className="text-xs" style={{color:'#496767'}}>{s.signal_type} · {s.reference_code?.slice(0,28)}</div>
                  </div>
                  <div className="font-extrabold font-data text-sm" style={{color:'#FF9200'}}>${s.capex_m}M</div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t text-center" style={{borderTopColor:'rgba(135,161,158,0.08)'}}>
              <Link href={`/signals?iso3=${iso3}`} className="text-xs font-bold" style={{color:'#FF6600'}}>View all {data.signals} signals →</Link>
            </div>
          </div>
        )}

        {tab === 'sectors' && (
          <div className="gfm-card p-5">
            <div className="font-extrabold text-sm mb-4" style={{color:'#FAFAF0'}}>Top FDI Sectors — {name}</div>
            <div className="space-y-3">
              {[
                {sector:'💻 ICT',          pct:42, fdi:`$${(data.fdi*0.42).toFixed(1)}B`},
                {sector:'⚡ Energy',        pct:24, fdi:`$${(data.fdi*0.24).toFixed(1)}B`},
                {sector:'🏭 Manufacturing', pct:16, fdi:`$${(data.fdi*0.16).toFixed(1)}B`},
                {sector:'💰 Finance',       pct:11, fdi:`$${(data.fdi*0.11).toFixed(1)}B`},
                {sector:'🏥 Healthcare',    pct:7,  fdi:`$${(data.fdi*0.07).toFixed(1)}B`},
              ].map(s=>(
                <div key={s.sector} className="flex items-center gap-3">
                  <span className="text-sm w-28 flex-shrink-0" style={{color:'#87A19E'}}>{s.sector}</span>
                  <div className="flex-1 bg-white/5 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{width:`${s.pct}%`,background:'linear-gradient(90deg,#FF6600,#FFBE00)'}}/>
                  </div>
                  <span className="text-xs font-extrabold font-data w-14 text-right" style={{color:'#FF6600'}}>{s.fdi}</span>
                  <span className="text-xs w-8 text-right" style={{color:'#87A19E'}}>{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'fz' && (
          <div className="gfm-card p-5">
            <div className="font-extrabold text-sm mb-4" style={{color:'#FAFAF0'}}>Free Zones — {name}</div>
            <div className="grid md:grid-cols-3 gap-3">
              {(iso3 === 'ARE' ? [
                {name:'JAFZA',       focus:'Logistics/Industrial',   companies:9500, tax:'0%'},
                {name:'DIFC',        focus:'Financial Services',      companies:2500, tax:'0%'},
                {name:'ADGM',        focus:'Financial/Professional',  companies:1200, tax:'0%'},
                {name:'Dubai South', focus:'Aviation/Logistics',      companies:800,  tax:'0%'},
                {name:'Masdar City', focus:'Clean Energy',            companies:400,  tax:'0%'},
                {name:'DMCC',        focus:'Commodities/Trade',       companies:22000,tax:'0%'},
              ] : [
                {name:'Export Processing Zone',focus:'Manufacturing/Export', companies:500, tax:'0-5%'},
                {name:'Technology Park',        focus:'ICT/R&D',             companies:200, tax:'0%'},
                {name:'Financial Centre',       focus:'Financial Services',  companies:300, tax:'0%'},
              ]).map(fz=>(
                <div key={fz.name} className="p-4 rounded-xl" style={{background:'rgba(15,37,38,0.7)',border:'1px solid rgba(255,190,0,0.12)'}}>
                  <div className="font-extrabold text-sm mb-1" style={{color:'#FFBE00'}}>{fz.name}</div>
                  <div className="text-xs mb-1" style={{color:'#87A19E'}}>{fz.focus}</div>
                  <div className="flex justify-between text-xs">
                    <span style={{color:'#496767'}}>{fz.companies.toLocaleString()} companies</span>
                    <span style={{color:'#22c55e'}}>Tax: {fz.tax}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
