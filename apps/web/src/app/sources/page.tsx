import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Data Sources — FDI Monitor',
  description: 'FDI Monitor 300+ verified sources across 5 tiers. Z3 formal verification, SHA-256 provenance, 15-minute ingestion.',
};

const TIERS = [
  { tier:'T1', name:'Official International Bodies',         weight:1.00, color:'#0A3D62', refresh:'Daily',
    sources:['IMF World Economic Outlook','World Bank FDI database','UNCTAD World Investment Report','OECD FDI Statistics','UN Comtrade','IFC/MIGA data','WTO Trade Statistics'],
    desc:'Primary multilateral institutions with the highest data quality and verification standards. Z3 constraint sets applied to all T1 signals.' },
  { tier:'T2', name:'National Central Banks & Ministries',   weight:0.92, color:'#74BB65', refresh:'Daily',
    sources:['UAE Central Bank','Saudi Arabian Monetary Authority','Reserve Bank of India','Bundesbank','Bank of England','Monetary Authority of Singapore','US Federal Reserve / BEA'],
    desc:'National financial authorities providing official balance of payments, FDI inflow/outflow, and reserve data.' },
  { tier:'T3', name:'Investment Promotion Agencies',         weight:0.85, color:'#74BB65', refresh:'2 hours',
    sources:['InvestAD (UAE)','SAGIA (Saudi Arabia)','EDB Bahrain','Invest India','JETRO (Japan)','Germany Trade & Invest','Singapore EDB'],
    desc:'National IPAs publishing investment incentive data, project registrations, and sector-level announcements.' },
  { tier:'T4', name:'Corporate Intelligence & Filings',      weight:0.76, color:'#696969', refresh:'4 hours',
    sources:['SEC EDGAR filings','Companies House UK','Earnings call transcripts','Corporate press releases','M&A databases (Bloomberg/Refinitiv)','Patent registrations'],
    desc:'Primary corporate disclosures providing direct investment intent evidence. Highest specificity for greenfield and M&A signals.' },
  { tier:'T5', name:'Media & Alternative Data',              weight:0.65, color:'#696969', refresh:'8 hours',
    sources:['Reuters / AP wire','Financial Times','Zawya MENA','Construction intelligence (Dodge)','Conference announcements','Site selector interviews'],
    desc:'Corroborative signals always cross-validated against T1–T4 before inclusion in scored intelligence.' },
];

const PIPELINE_STEPS = [
  { num:'01', title:'Collection',        icon:'📡', desc:'Automated ingestion from 300+ sources via API, RSS, and structured scraping. T1–T3 refresh every 15 minutes. T4–T5 every 2–8 hours.' },
  { num:'02', title:'Extraction',        icon:'🔍', desc:'NLP entity extraction identifies investor, destination economy, sector, CapEx amount, and signal type from raw source content.' },
  { num:'03', title:'Cross-Validation',  icon:'⚖️', desc:'Minimum 2 independent T1–T4 sources required. Single-source signals are quarantined until a second source confirms.' },
  { num:'04', title:'Z3 Verification',   icon:'✓',  desc:'Microsoft Z3 SMT theorem prover checks 14 logical constraint sets per signal: geographic, sector, amount, and timeline consistency.' },
  { num:'05', title:'SCI Scoring',       icon:'📊', desc:'SCI = (Source_Weight × 0.30) + (Cross_Validation × 0.25) + (Recency × 0.25) + (Specificity × 0.20). Scores 0–100.' },
  { num:'06', title:'SHA-256 Provenance',icon:'🔒', desc:'Every scored signal receives a SHA-256 hash committing to the source data state at time of scoring. Immutable audit trail.' },
];

const FRESHNESS = [
  { tier:'T1', interval:'Daily',    last_refresh:'08:00 UTC', status:'fresh', signals:62  },
  { tier:'T2', interval:'Daily',    last_refresh:'09:30 UTC', status:'fresh', signals:48  },
  { tier:'T3', interval:'2 hours',  last_refresh:'12 min ago',status:'fresh', signals:54  },
  { tier:'T4', interval:'4 hours',  last_refresh:'1h 22m ago',status:'fresh', signals:38  },
  { tier:'T5', interval:'8 hours',  last_refresh:'3h 45m ago',status:'fresh', signals:16  },
];

export default function SourcesPage() {
  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-12">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#74BB65'}}>Data Intelligence</div>
          <h1 className="text-3xl font-extrabold mb-2" style={{color:'#0A3D62'}}>Data Sources & Verification</h1>
          <p className="text-sm max-w-2xl" style={{color:'#696969'}}>300+ verified sources · 5 tiers · Z3 formal verification · SHA-256 provenance · 15-min ingestion</p>
          <div className="flex gap-8 mt-6 flex-wrap">
            {[['300+','Sources'],['5','Tiers'],['Z3','Verified'],['SHA-256','Provenance'],['14','Constraints'],['15min','Fastest Refresh']].map(([v,l])=>(
              <div key={l}><div className="text-2xl font-extrabold font-data" style={{color:'#74BB65'}}>{v}</div><div className="text-xs mt-0.5" style={{color:'#696969'}}>{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-10">

        {/* Data freshness dashboard */}
        <div>
          <h2 className="text-lg font-extrabold mb-4" style={{color:'#0A3D62'}}>Live Data Freshness</h2>
          <div className="grid md:grid-cols-5 gap-3">
            {FRESHNESS.map(f=>(
              <div key={f.tier} className="gfm-card p-4 text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{background:'#22c55e'}}/>
                </div>
                <div className="font-extrabold font-data text-2xl mb-0.5" style={{color:'#74BB65'}}>{f.tier}</div>
                <div className="text-xs mb-1" style={{color:'#696969'}}>{f.interval}</div>
                <div className="text-xs" style={{color:'#696969'}}>Last: {f.last_refresh}</div>
                <div className="font-data font-bold mt-1" style={{color:'#22c55e'}}>{f.signals} signals</div>
              </div>
            ))}
          </div>
        </div>

        {/* 6-step pipeline */}
        <div>
          <h2 className="text-lg font-extrabold mb-4" style={{color:'#0A3D62'}}>6-Step Verification Pipeline</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {PIPELINE_STEPS.map(s=>(
              <div key={s.num} className="gfm-card p-5" style={{borderLeft:'3px solid #FF6600'}}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-extrabold font-data" style={{color:'#74BB65'}}>{s.num}</span>
                  <span className="text-xl">{s.icon}</span>
                  <span className="font-extrabold text-sm" style={{color:'#0A3D62'}}>{s.title}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{color:'#696969'}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SCI formula */}
        <div className="gfm-card p-6">
          <h2 className="font-extrabold text-sm mb-3" style={{color:'#0A3D62'}}>Signal Confidence Index (SCI)</h2>
          <div className="p-4 rounded-xl font-mono text-sm overflow-x-auto mb-4" style={{background:'rgba(10,61,98,0.04)0.8)',color:'#0A3D62'}}>
            SCI = (Source_Weight × 0.30) + (Cross_Validation × 0.25) + (Recency × 0.25) + (Specificity × 0.20)
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[['Source Weight (30%)',   'T1=1.00, T2=0.92, T3=0.85, T4=0.76, T5=0.65','#74BB65'],
              ['Cross-Validation (25%)','Independent source confirmation ratio','#74BB65'],
              ['Recency (25%)',         '90-day half-life decay function','#0A3D62'],
              ['Specificity (20%)',     'Company + amount + destination = maximum','#696969']
            ].map(([t,d,c])=>(
              <div key={t} className="p-3 rounded-xl" style={{background:'rgba(10,61,98,0.04)0.6)'}}>
                <div className="text-xs font-bold mb-1" style={{color:c}}>{t}</div>
                <div className="text-xs" style={{color:'#696969'}}>{d}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs" style={{color:'#696969'}}>
            Grade thresholds: <span style={{color:'#0A3D62'}}>PLATINUM ≥90</span> · <span style={{color:'#74BB65'}}>GOLD 75–89</span> · <span style={{color:'#696969'}}>SILVER 60–74</span> · <span style={{color:'#696969'}}>BRONZE 40–59</span>
          </div>
        </div>

        {/* 5 tiers */}
        <div>
          <h2 className="text-lg font-extrabold mb-4" style={{color:'#0A3D62'}}>Source Tiers</h2>
          <div className="space-y-4">
            {TIERS.map(t=>(
              <div key={t.tier} className="gfm-card overflow-hidden">
                <div className="p-5" style={{borderLeft:`4px solid ${t.color}`}}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-center w-16">
                      <div className="text-2xl font-extrabold font-data" style={{color:t.color}}>{t.tier}</div>
                      <div className="text-xs" style={{color:'#696969'}}>w={t.weight}</div>
                      <div className="text-xs mt-0.5" style={{color:'#696969'}}>{t.refresh}</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-extrabold text-sm mb-1" style={{color:'#0A3D62'}}>{t.name}</div>
                      <p className="text-xs leading-relaxed mb-3" style={{color:'#696969'}}>{t.desc}</p>
                      <div className="flex flex-wrap gap-1">
                        {t.sources.map(s=>(
                          <span key={s} className="text-xs px-2 py-0.5 rounded" style={{background:`${t.color}12`,color:t.color,border:`1px solid ${t.color}25`}}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link href="/signals"  className="gfm-btn-primary text-sm py-2 px-5">View Live Signals →</Link>
          <Link href="/gfr/methodology" className="gfm-btn-outline text-sm py-2 px-5" style={{color:'#696969'}}>GFR Methodology</Link>
          <Link href="/contact"  className="gfm-btn-outline text-sm py-2 px-5" style={{color:'#696969'}}>Request Data Source</Link>
        </div>
      </div>
    </div>
  );
}
