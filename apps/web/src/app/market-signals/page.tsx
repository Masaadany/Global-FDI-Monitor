import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FDI Signal Types — FDI Monitor',
  description: 'Understanding FDI signal types: Greenfield, Expansion, M&A, JV, Franchise, Reinvestment. Signal Confidence Index (SCI) explained.',
};

const SIGNAL_TYPES = [
  { type:'Greenfield',     icon:'🌱', color:'#22c55e',
    def:'New investment creating productive capacity from scratch — land acquisition, construction, and operation of a new facility.',
    example:'Microsoft building a new AI data centre in UAE — $850M greenfield ICT investment.',
    sci_bonus:'Specificity score highest when company, location, and CapEx amount are all confirmed.' },
  { type:'Expansion',      icon:'📈', color:'#74BB65',
    def:'Capital injection into an existing facility to increase capacity, add new product lines, or enter new markets from an established base.',
    example:'Google Cloud expanding its Singapore data centre capacity — $620M expansion.',
    sci_bonus:'Typically receives high cross-validation scores when expansion plans appear in earnings calls and filings.' },
  { type:'M&A',            icon:'🤝', color:'#74BB65',
    def:'Acquisition of or merger with a foreign entity, resulting in foreign control of assets, revenue streams, or market share.',
    example:'A Gulf sovereign wealth fund acquiring a European logistics company.',
    sci_bonus:'Multiple SEC/filings sources usually push cross-validation score to maximum.' },
  { type:'Joint Venture',  icon:'⚡', color:'#0A3D62',
    def:'Creation of a new entity jointly owned by a foreign investor and a domestic partner to share capital, risk, and market access.',
    example:'A Japanese automaker forming a JV with a Saudi industrial group for EV manufacturing.',
    sci_bonus:'IPA announcements (T3) typically confirm JV details, boosting source weight composite.' },
  { type:'Franchise',      icon:'🏪', color:'#696969',
    def:'A foreign company entering a market through licensed operations to a domestic operator, contributing brand, IP, and operational systems.',
    example:'An international retailer granting franchise rights to a local operator in a new market.',
    sci_bonus:'Lower SCI than capital-intensive signals — specificity score limited by nature of the model.' },
  { type:'Reinvestment',   icon:'🔄', color:'#696969',
    def:'Foreign-owned profits reinvested locally rather than repatriated — counted as new FDI inflow under OECD balance of payments methodology.',
    example:'A multinational reinvesting $200M of local profits into new production equipment.',
    sci_bonus:'Often detected through company disclosures and earnings transcripts (T4 sources).' },
];

const GRADE_THRESHOLDS = [
  { grade:'PLATINUM', range:'SCI ≥ 90', color:'#0A3D62', count:22,
    desc:'Highest confidence signals. Minimum 3 T1–T3 sources. Z3 verified. Company + CapEx + destination + timeline all confirmed.' },
  { grade:'GOLD',     range:'SCI 75–89', color:'#74BB65', count:76,
    desc:'High confidence. 2+ independent T1–T4 sources. Core investment details confirmed. Timeline may be indicative.' },
  { grade:'SILVER',   range:'SCI 60–74', color:'#696969', count:84,
    desc:'Moderate confidence. 2 sources minimum but may include T4–T5. CapEx estimate or destination approximate.' },
  { grade:'BRONZE',   range:'SCI 40–59', color:'#696969', count:36,
    desc:'Early-stage intelligence. Single-source or speculative. Monitored for corroborating evidence before upgrading.' },
];

export default function MarketSignalsPage() {
  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-10">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#74BB65'}}>Signal Intelligence Guide</div>
          <h1 className="text-3xl font-extrabold mb-2" style={{color:'#0A3D62'}}>FDI Signal Types</h1>
          <p className="text-sm max-w-2xl" style={{color:'#696969'}}>Understanding the 6 signal types · SCI scoring · PLATINUM to BRONZE grading · Z3 verified</p>
          <div className="flex gap-6 mt-5 flex-wrap">
            {[['6','Signal Types'],['4','Grade Levels'],['Z3','All Verified'],['SHA-256','Provenance'],['218','Live Signals']].map(([v,l])=>(
              <div key={l}><div className="text-xl font-extrabold font-data" style={{color:'#74BB65'}}>{v}</div><div className="text-xs mt-0.5" style={{color:'#696969'}}>{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-8">
        {/* Signal types */}
        <div>
          <h2 className="text-xl font-extrabold mb-5" style={{color:'#0A3D62'}}>6 FDI Signal Types</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {SIGNAL_TYPES.map(s=>(
              <div key={s.type} className="gfm-card p-5" style={{borderLeft:`4px solid ${s.color}`}}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{s.icon}</span>
                  <div className="font-extrabold text-sm" style={{color:s.color}}>{s.type}</div>
                </div>
                <p className="text-sm leading-relaxed mb-2" style={{color:'#696969'}}>{s.def}</p>
                <div className="text-xs p-2 rounded-lg mb-2" style={{background:'rgba(10,61,98,0.04)0.6)',color:'#0A3D62'}}>
                  <span style={{color:'#696969'}}>Example: </span>{s.example}
                </div>
                <div className="text-xs" style={{color:'#696969'}}>
                  <span style={{color:s.color}}>SCI note:</span> {s.sci_bonus}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grade thresholds */}
        <div>
          <h2 className="text-xl font-extrabold mb-5" style={{color:'#0A3D62'}}>Grade Thresholds</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {GRADE_THRESHOLDS.map(g=>(
              <div key={g.grade} className="gfm-card p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className={`gfm-badge grade-${g.grade}`}>{g.grade}</span>
                  <div className="text-right">
                    <div className="font-extrabold font-data" style={{color:g.color}}>{g.range}</div>
                    <div className="text-xs" style={{color:'#696969'}}>{g.count} active signals</div>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{color:'#696969'}}>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SCI formula reference */}
        <div className="gfm-card p-6">
          <h2 className="font-extrabold text-sm mb-3" style={{color:'#0A3D62'}}>Signal Confidence Index (SCI)</h2>
          <div className="p-4 rounded-xl font-mono text-sm mb-3" style={{background:'rgba(10,61,98,0.04)0.8)',color:'#0A3D62'}}>
            SCI = (Source_Weight × 0.30) + (Cross_Validation × 0.25) + (Recency × 0.25) + (Specificity × 0.20)
          </div>
          <p className="text-sm" style={{color:'#696969'}}>All signals passing Z3 formal verification receive a SHA-256 hash committing to the source data state. Only signals with SCI ≥ 40 enter the graded feed.</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link href="/signals"  className="gfm-btn-primary text-sm py-2 px-5">View Live Signal Feed →</Link>
          <Link href="/sources"  className="gfm-btn-outline text-sm py-2 px-5" style={{color:'#696969'}}>Data Sources</Link>
          <Link href="/gfr/methodology" className="gfm-btn-outline text-sm py-2 px-5" style={{color:'#696969'}}>GFR Methodology</Link>
        </div>
      </div>
    </div>
  );
}
