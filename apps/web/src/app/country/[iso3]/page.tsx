import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';

// 31 static ISOs
const ISOS = ['ARE','SAU','SGP','USA','GBR','DEU','FRA','JPN','CHN','IND','IDN','VNM',
              'AUS','CAN','BRA','MEX','ZAF','NGA','EGY','MAR','KEN','ETH','QAT','KWT',
              'OMN','BHR','JOR','TUR','POL','ESP','KOR'];

const COUNTRY_DATA: Record<string,{name:string;flag:string;gfr:number;tier:string;rank:number;capex_bn:number;signals:number}> = {
  ARE:{name:'United Arab Emirates',flag:'🇦🇪',gfr:80.0,tier:'FRONTIER',rank:6, capex_bn:12.4,signals:18},
  SAU:{name:'Saudi Arabia',         flag:'🇸🇦',gfr:72.1,tier:'HIGH',    rank:10,capex_bn:9.8, signals:14},
  SGP:{name:'Singapore',            flag:'🇸🇬',gfr:88.5,tier:'FRONTIER',rank:1, capex_bn:18.5,signals:22},
  USA:{name:'United States',        flag:'🇺🇸',gfr:84.5,tier:'FRONTIER',rank:3, capex_bn:62.1,signals:31},
  GBR:{name:'United Kingdom',       flag:'🇬🇧',gfr:78.5,tier:'HIGH',    rank:7, capex_bn:14.8,signals:19},
  DEU:{name:'Germany',              flag:'🇩🇪',gfr:78.1,tier:'HIGH',    rank:8, capex_bn:12.8,signals:17},
  FRA:{name:'France',               flag:'🇫🇷',gfr:70.8,tier:'HIGH',    rank:12,capex_bn:11.2,signals:14},
  JPN:{name:'Japan',                flag:'🇯🇵',gfr:76.8,tier:'HIGH',    rank:9, capex_bn:10.4,signals:13},
  CHN:{name:'China',                flag:'🇨🇳',gfr:62.1,tier:'MEDIUM',  rank:32,capex_bn:42.8,signals:28},
  IND:{name:'India',                flag:'🇮🇳',gfr:58.4,tier:'MEDIUM',  rank:48,capex_bn:12.3,signals:24},
  IDN:{name:'Indonesia',            flag:'🇮🇩',gfr:55.2,tier:'MEDIUM',  rank:54,capex_bn:11.2,signals:16},
  VNM:{name:'Vietnam',              flag:'🇻🇳',gfr:54.8,tier:'MEDIUM',  rank:56,capex_bn:8.9, signals:12},
  AUS:{name:'Australia',            flag:'🇦🇺',gfr:82.1,tier:'FRONTIER',rank:5, capex_bn:14.2,signals:18},
  CAN:{name:'Canada',               flag:'🇨🇦',gfr:68.4,tier:'HIGH',    rank:14,capex_bn:13.1,signals:16},
  BRA:{name:'Brazil',               flag:'🇧🇷',gfr:54.2,tier:'MEDIUM',  rank:58,capex_bn:14.8,signals:15},
  MEX:{name:'Mexico',               flag:'🇲🇽',gfr:53.8,tier:'MEDIUM',  rank:60,capex_bn:10.2,signals:12},
  ZAF:{name:'South Africa',         flag:'🇿🇦',gfr:52.1,tier:'MEDIUM',  rank:63,capex_bn:5.8, signals:10},
  NGA:{name:'Nigeria',              flag:'🇳🇬',gfr:42.8,tier:'DEVELOPING',rank:94,capex_bn:4.2,signals:8},
  EGY:{name:'Egypt',                flag:'🇪🇬',gfr:51.4,tier:'MEDIUM',  rank:67,capex_bn:6.4, signals:11},
  MAR:{name:'Morocco',              flag:'🇲🇦',gfr:53.2,tier:'MEDIUM',  rank:61,capex_bn:5.1, signals:9},
  KEN:{name:'Kenya',                flag:'🇰🇪',gfr:46.8,tier:'MEDIUM',  rank:82,capex_bn:3.2, signals:7},
  ETH:{name:'Ethiopia',             flag:'🇪🇹',gfr:41.2,tier:'DEVELOPING',rank:98,capex_bn:2.8,signals:6},
  QAT:{name:'Qatar',                flag:'🇶🇦',gfr:69.2,tier:'HIGH',    rank:13,capex_bn:8.4, signals:11},
  KWT:{name:'Kuwait',               flag:'🇰🇼',gfr:62.4,tier:'MEDIUM',  rank:30,capex_bn:4.8, signals:8},
  OMN:{name:'Oman',                 flag:'🇴🇲',gfr:58.8,tier:'MEDIUM',  rank:45,capex_bn:3.8, signals:7},
  BHR:{name:'Bahrain',              flag:'🇧🇭',gfr:61.2,tier:'MEDIUM',  rank:35,capex_bn:3.2, signals:8},
  JOR:{name:'Jordan',               flag:'🇯🇴',gfr:52.8,tier:'MEDIUM',  rank:62,capex_bn:2.4, signals:6},
  TUR:{name:'Turkey',               flag:'🇹🇷',gfr:55.8,tier:'MEDIUM',  rank:52,capex_bn:7.2, signals:12},
  POL:{name:'Poland',               flag:'🇵🇱',gfr:63.4,tier:'HIGH',    rank:18,capex_bn:8.8, signals:13},
  ESP:{name:'Spain',                flag:'🇪🇸',gfr:66.3,tier:'HIGH',    rank:16,capex_bn:9.4, signals:14},
  KOR:{name:'South Korea',          flag:'🇰🇷',gfr:71.4,tier:'HIGH',    rank:11,capex_bn:10.8,signals:15},
};

export async function generateStaticParams() {
  return ISOS.map(iso3=>({ iso3 }));
}

export async function generateMetadata({ params }: { params: { iso3: string } }): Promise<Metadata> {
  const d = COUNTRY_DATA[params.iso3.toUpperCase()];
  if (!d) return { title: 'Economy Profile — FDI Monitor' };
  return {
    title: `${d.flag} ${d.name} FDI Profile — GFR ${d.gfr} | FDI Monitor`,
    description: `${d.name} Global Future Readiness ranking: ${d.rank} globally (${d.tier}). GFR score: ${d.gfr}. ${d.signals} active FDI signals. $${d.capex_bn}B active CapEx pipeline.`,
  };
}

const TIER_C: Record<string,string> = {FRONTIER:'#0A3D62',HIGH:'#74BB65',MEDIUM:'#696969',DEVELOPING:'#696969'};
const DIMS = ['Macro','Policy','Digital','Human','Infra','Sustain'];
const DIM_W = [0.20,0.18,0.15,0.15,0.15,0.17];

export default function CountryProfilePage({ params }: { params: { iso3: string } }) {
  const iso3 = params.iso3.toUpperCase();
  const d = COUNTRY_DATA[iso3];

  if (!d) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <div className="text-center">
        <div className="text-5xl mb-4">🌍</div>
        <h1 className="text-2xl font-extrabold mb-3" style={{color:'#0A3D62'}}>Economy not found</h1>
        <Link href="/gfr" className="gfm-btn-primary px-6 py-2.5">← Back to Rankings</Link>
      </div>
    </div>
  );

  // Generate 6 dimension scores from composite
  const dimScores = DIMS.map((_,i) => {
    const variance = [+3,-2,+4,-6,+5,-4][i];
    return Math.min(99, Math.max(30, Math.round(d.gfr + variance)));
  });

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>

      {/* Hero */}
      <section className="gfm-hero px-6 py-12">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-6xl">{d.flag}</span>
                <div>
                  <h1 className="text-3xl font-extrabold" style={{color:'#0A3D62'}}>{d.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded" style={{background:`${TIER_C[d.tier]}20`,color:TIER_C[d.tier]}}>{d.tier}</span>
                    <span className="text-xs" style={{color:'#696969'}}>#{d.rank} globally · GFR {d.gfr}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-5 flex-wrap">
              {[
                {v:d.gfr,         l:'GFR Score',    c:'#74BB65'},
                {v:`#${d.rank}`,  l:'Global Rank',  c:'#74BB65'},
                {v:`$${d.capex_bn}B`,l:'Active CapEx',c:'#0A3D62'},
                {v:d.signals,     l:'Live Signals',  c:'#22c55e'},
              ].map(k=>(
                <div key={k.l} className="text-center">
                  <div className="text-2xl font-extrabold font-data" style={{color:k.c}}>{k.v}</div>
                  <div className="text-xs mt-0.5" style={{color:'#696969'}}>{k.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 py-5 grid lg:grid-cols-3 gap-5">
        {/* GFR Dimensions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="gfm-card p-5">
            <div className="font-extrabold text-sm mb-4" style={{color:'#0A3D62'}}>GFR Dimension Scores</div>
            <div className="space-y-3">
              {DIMS.map((dim,i)=>(
                <div key={dim} className="flex items-center gap-3">
                  <span className="text-xs w-16 font-bold flex-shrink-0" style={{color:'#696969'}}>{dim}</span>
                  <div className="flex-1 bg-white/5 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full" style={{width:`${dimScores[i]}%`,background:`linear-gradient(90deg,#FF6600,#FFBE00)`}}/>
                  </div>
                  <span className="text-sm font-extrabold font-data w-8 text-right" style={{color:'#74BB65'}}>{dimScores[i]}</span>
                  <span className="text-xs w-10 text-right" style={{color:'#696969'}}>{(DIM_W[i]*100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t flex justify-between items-center" style={{borderTopColor:'rgba(10,61,98,0.1)'}}>
              <span className="text-xs font-bold" style={{color:'#696969'}}>GFR Composite</span>
              <span className="text-2xl font-extrabold font-data" style={{color:'#74BB65'}}>{d.gfr}</span>
            </div>
          </div>

          {/* Investment history */}
          <div className="gfm-card p-5">
            <div className="font-extrabold text-sm mb-3" style={{color:'#0A3D62'}}>5-Year FDI History ($B)</div>
            <div className="flex items-end gap-2 h-24">
              {[2021,2022,2023,2024,2025].map((yr,i)=>{
                const base = d.capex_bn * 0.6;
                const val  = +(base * (1 + (i * 0.12))).toFixed(1);
                const pct  = (val / (d.capex_bn * 1.05)) * 100;
                return (
                  <div key={yr} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-data" style={{color:'#696969'}}>${val}B</span>
                    <div className="w-full rounded-t-lg" style={{height:`${pct}%`,background:i===4?'#74BB65':'rgba(116,187,101,0.4)',minHeight:8}}/>
                    <span className="text-xs" style={{color:'#696969'}}>{yr}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <div className="gfm-card p-5">
            <div className="font-extrabold text-sm mb-3" style={{color:'#0A3D62'}}>Investment Profile</div>
            <div className="space-y-2">
              {[
                ['GFR Tier',    d.tier,       TIER_C[d.tier]],
                ['Global Rank', `#${d.rank}`, '#74BB65'],
                ['GFR Score',   `${d.gfr}/100`,'#74BB65'],
                ['Live Signals',`${d.signals}`,'#22c55e'],
                ['Active CapEx',`$${d.capex_bn}B`,'#0A3D62'],
              ].map(([l,v,c])=>(
                <div key={String(l)} className="flex justify-between text-sm py-1 border-b" style={{borderBottomColor:'rgba(10,61,98,0.06)'}}>
                  <span style={{color:'#696969'}}>{l}</span>
                  <span className="font-extrabold font-data" style={{color:c as string}}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="gfm-card p-5">
            <div className="font-extrabold text-sm mb-3" style={{color:'#0A3D62'}}>Quick Actions</div>
            <div className="space-y-2">
              <Link href="/signals" className="block gfm-btn-primary text-center text-xs py-2.5">View {iso3} Signals →</Link>
              <Link href="/reports" className="block gfm-btn-outline text-center text-xs py-2.5" style={{color:'#696969'}}>Generate ICR Report</Link>
              <Link href="/benchmarking" className="block gfm-btn-outline text-center text-xs py-2.5" style={{color:'#696969'}}>Benchmark {iso3}</Link>
            </div>
          </div>

          <div className="gfm-card p-4">
            <Link href="/gfr" className="text-xs font-bold flex items-center gap-2" style={{color:'#74BB65'}}>
              ← Back to GFR Rankings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
