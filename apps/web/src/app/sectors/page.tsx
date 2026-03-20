import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Investment Sectors — FDI Monitor',
  description: 'FDI intelligence across all major investment sectors. Real-time signal monitoring, CapEx tracking and growth trends.',
};

const SECTORS = [
  { id:'AGR', name:'Agriculture, Forestry & Fishing',   icon:'🌾', signals:12, capex_bn:8.4,  growth:14, tier:'MEDIUM'   },
  { id:'MIN', name:'Mining & Quarrying',                icon:'⛏', signals:18, capex_bn:24.2, growth:8,  tier:'HIGH'     },
  { id:'MFG', name:'Manufacturing',                     icon:'🏭', signals:42, capex_bn:86.4, growth:11, tier:'HIGH'     },
  { id:'ENE', name:'Energy Supply',                     icon:'⚡', signals:38, capex_bn:72.1, growth:22, tier:'FRONTIER' },
  { id:'WAT', name:'Water & Waste Management',          icon:'💧', signals:8,  capex_bn:6.8,  growth:9,  tier:'MEDIUM'   },
  { id:'CON', name:'Construction',                      icon:'🏗', signals:22, capex_bn:18.4, growth:7,  tier:'MEDIUM'   },
  { id:'TRD', name:'Wholesale & Retail Trade',          icon:'🛒', signals:14, capex_bn:9.2,  growth:5,  tier:'MEDIUM'   },
  { id:'TRN', name:'Transportation & Logistics',        icon:'🚚', signals:19, capex_bn:14.8, growth:12, tier:'HIGH'     },
  { id:'HOS', name:'Accommodation & Food Services',     icon:'🏨', signals:11, capex_bn:7.4,  growth:6,  tier:'MEDIUM'   },
  { id:'ICT', name:'Information & Communication (ICT)', icon:'💻', signals:56, capex_bn:94.8, growth:28, tier:'FRONTIER' },
  { id:'FIN', name:'Financial Services',                icon:'💰', signals:28, capex_bn:38.2, growth:9,  tier:'HIGH'     },
  { id:'REA', name:'Real Estate',                       icon:'🏢', signals:16, capex_bn:28.4, growth:5,  tier:'HIGH'     },
  { id:'PRO', name:'Professional & Scientific Services',icon:'🔬', signals:14, capex_bn:8.8,  growth:11, tier:'HIGH'     },
  { id:'ADM', name:'Administrative Services',           icon:'📋', signals:7,  capex_bn:4.2,  growth:6,  tier:'MEDIUM'   },
  { id:'PUB', name:'Public Administration',             icon:'🏛', signals:4,  capex_bn:2.8,  growth:3,  tier:'MEDIUM'   },
  { id:'EDU', name:'Education',                         icon:'🎓', signals:9,  capex_bn:5.4,  growth:8,  tier:'MEDIUM'   },
  { id:'HEA', name:'Healthcare & Life Sciences',        icon:'🏥', signals:16, capex_bn:12.8, growth:14, tier:'HIGH'     },
  { id:'ART', name:'Arts, Entertainment & Recreation',  icon:'🎭', signals:6,  capex_bn:4.6,  growth:7,  tier:'MEDIUM'   },
  { id:'OTH', name:'Other Service Activities',          icon:'🔧', signals:5,  capex_bn:3.2,  growth:4,  tier:'MEDIUM'   },
  { id:'HHD', name:'Household Activities',              icon:'🏠', signals:2,  capex_bn:1.2,  growth:2,  tier:'MEDIUM'   },
  { id:'EXT', name:'Extraterritorial Organisations',    icon:'🌍', signals:3,  capex_bn:2.1,  growth:5,  tier:'MEDIUM'   },
];

const TIER_C: Record<string,string> = {FRONTIER:'#0A3D62',HIGH:'#74BB65',MEDIUM:'#696969'};

export default function SectorsPage() {
  const totalSignals = SECTORS.reduce((a,s)=>a+s.signals,0);
  const totalCapex   = SECTORS.reduce((a,s)=>a+s.capex_bn,0);
  const frontier     = SECTORS.filter(s=>s.tier==='FRONTIER').length;

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-10">
        <div className="max-w-screen-xl mx-auto relative z-10 flex flex-wrap justify-between gap-4 items-end">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#74BB65'}}>All Sectors</div>
            <h1 className="text-3xl font-extrabold" style={{color:'#0A3D62'}}>Investment Sectors</h1>
            <p className="text-sm mt-1" style={{color:'#696969'}}>21 sectors · Live signal monitoring · CapEx pipeline tracking</p>
          </div>
          <div className="flex gap-5">
            {[['21','Sectors'],[totalSignals,'Total Signals'],['$'+(totalCapex/1000).toFixed(0)+'T','Active CapEx'],[frontier,'FRONTIER']].map(([v,l])=>(
              <div key={String(l)} className="text-center">
                <div className="text-xl font-extrabold font-data" style={{color:'#74BB65'}}>{v}</div>
                <div className="text-xs mt-0.5" style={{color:'#696969'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 py-5">
        <div className="gfm-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="gfm-table">
              <thead><tr>
                <th>#</th><th>Sector</th><th>Live Signals</th>
                <th>Active CapEx</th><th>YoY Growth</th><th>FDI Tier</th><th></th>
              </tr></thead>
              <tbody>
                {SECTORS.map((s,i)=>(
                  <tr key={s.id}>
                    <td className="font-data text-xs" style={{color:'#696969'}}>{String(i+1).padStart(2,'0')}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span>{s.icon}</span>
                        <span className="font-semibold" style={{color:'#0A3D62'}}>{s.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="font-extrabold font-data" style={{color:'#22c55e'}}>{s.signals}</span>
                    </td>
                    <td className="font-extrabold font-data" style={{color:'#74BB65'}}>${s.capex_bn}B</td>
                    <td className="font-bold" style={{color:'#22c55e'}}>+{s.growth}%</td>
                    <td>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded"
                        style={{background:`${TIER_C[s.tier]||'#696969'}15`,color:TIER_C[s.tier]||'#696969'}}>
                        {s.tier}
                      </span>
                    </td>
                    <td>
                      <Link href="/signals" className="text-xs font-bold px-2 py-1 rounded"
                        style={{color:'#74BB65',background:'rgba(116,187,101,0.08)'}}>
                        Signals →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs mt-3" style={{color:'#696969'}}>
          Sector classifications follow international investment reporting standards. Methodology references available in the GFR documentation.
        </p>
      </div>
    </div>
  );
}
