import Link from 'next/link';
export const metadata = { title: 'About Global FDI Monitor — Vision, Mission, Methodology', description: 'About Global FDI Monitor — our vision, mission, philosophy, and data methodology.' };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="gfm-hero text-white px-6 py-20">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4">About Us</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">Global FDI Monitor</h1>
          <p className="text-xl text-white/70 leading-relaxed">
            The world&apos;s most comprehensive investment intelligence platform, empowering governments, IPAs, and corporations with real-time data and predictive insights.
          </p>
        </div>
      </section>

      {/* About section */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-sm text-slate-600 leading-relaxed text-center max-w-3xl mx-auto">
            <p className="mb-4">
              <strong className="text-deep">GLOBAL FDI MONITOR</strong> is the world&apos;s most comprehensive investment intelligence platform. We combine 20+ years of historical investment data, real-time signals from 300+ trusted sources, and advanced analytics to deliver actionable intelligence that was once available only to the world&apos;s largest institutions.
            </p>
            <p>We believe investment decisions should be guided by evidence, not intuition.</p>
          </div>
        </div>
      </section>

      {/* Vision / Mission / Philosophy — cards */}
      <section className="py-14 px-6 bg-surface">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              title:'Our Vision',
              icon:'🌍',
              text:'To become the world\'s most trusted source of investment intelligence, setting the global standard for evidence-based investment decisions that drive sustainable economic growth worldwide.'
            },
            {
              title:'Our Mission',
              icon:'🎯',
              text:'To democratize access to world-class investment intelligence, enabling organizations of all sizes to make informed decisions with confidence, speed, and precision.'
            },
            {
              title:'Our Philosophy',
              icon:'💡',
              text:'We believe investment decisions should be guided by evidence, not intuition. In a world of increasing complexity, access to accurate, timely, and comprehensive investment intelligence is a necessity.'
            },
          ].map(v=>(
            <div key={v.title} className="gfm-card p-7">
              <div className="text-4xl mb-4">{v.icon}</div>
              <h2 className="text-xl font-extrabold text-deep mb-3">{v.title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Data Integrity</div>
            <h2 className="text-3xl font-extrabold text-deep mb-3">Our Methodology</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-slate-600 leading-relaxed mb-5">
                We integrate data from trusted sources including World Bank, IMF, UNCTAD, and OECD, applying rigorous validation protocols at every stage. Our proprietary verification system ensures factual accuracy of all generated content.
              </p>
              <p className="text-slate-600 leading-relaxed mb-5">
                Our <strong className="text-deep">Waterfall Enrichment</strong> architecture queries multiple sources until the most complete and reliable data is found. Every data point passes Z3 logical constraint verification before acceptance.
              </p>
              <div className="gfm-card p-5 bg-surface border-l-4 border-primary">
                <div className="font-bold text-sm text-deep mb-3">Every data point includes:</div>
                <ul className="space-y-2">
                  {['🔗 Source hyperlink to original publication','📅 Timestamp of retrieval','🔐 SHA-256 hash for tamper detection','📝 Reference code for audit trail','✓ Z3 logical verification result'].map(item=>(
                    <li key={item} className="text-xs text-slate-600">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Authoritative Data Sources</div>
              {[
                {tier:'T1',sources:['IMF World Economic Outlook','World Bank WDI','UNCTAD WIR','OECD FDI Statistics'],color:'bg-emerald-50 border-emerald-200 text-emerald-700'},
                {tier:'T1',sources:['IEA Energy Investment','ILO Statistics','Yale EPI'],color:'bg-emerald-50 border-emerald-200 text-emerald-700'},
                {tier:'T2',sources:['Transparency International CPI','Freedom House','Heritage Foundation EFI'],color:'bg-blue-50 border-blue-200 text-blue-700'},
                {tier:'T6',sources:['GDELT Signal Detection Engine','GFM Proprietary Intelligence'],color:'bg-violet-50 border-violet-200 text-violet-700'},
              ].map((g,i)=>(
                <div key={i} className={`border rounded-xl p-3 ${g.color.split(' ').slice(1).join(' ')}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${g.color}`}>{g.tier}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {g.sources.map(s=><span key={s} className="text-xs font-medium">{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GFR Methodology */}
      <section className="py-14 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Ranking System</div>
            <h2 className="text-3xl font-extrabold text-deep mb-2">GFR Composite Formula</h2>
            <div className="text-sm font-mono text-primary bg-primary-light inline-block px-4 py-2 rounded-lg mt-2">
              GFR = Macro×0.20 + Policy×0.18 + Digital×0.15 + Human×0.15 + Infra×0.15 + Sustain×0.17
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {dim:'Economic Resilience (20%)',     icon:'📊',desc:'GDP growth, sovereign ratings, fiscal sustainability, trade openness.'},
              {dim:'Policy & Institutional (18%)',  icon:'⚖️',desc:'Rule of law, ease of doing business, FDI policy, corruption control.'},
              {dim:'Digital Foundations (15%)',     icon:'💻',desc:'Internet penetration, 5G, AI readiness, digital government index.'},
              {dim:'Human Capital (15%)',            icon:'🎓',desc:'Tertiary enrolment, PISA scores, labour productivity, skills index.'},
              {dim:'Infrastructure (15%)',           icon:'🏗️',desc:'LPI logistics, airport connectivity, port efficiency, energy reliability.'},
              {dim:'Sustainability (17%)',           icon:'🌱',desc:'Yale EPI score, renewable energy share, climate resilience, ESG policy.'},
            ].map(d=>(
              <div key={d.dim} className="gfm-card p-5 flex gap-4">
                <div className="sector-icon flex-shrink-0">{d.icon}</div>
                <div>
                  <div className="font-bold text-sm text-deep mb-1">{d.dim}</div>
                  <p className="text-xs text-slate-500 leading-relaxed">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-6" style={{background:'var(--gradient-primary)'}}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">Join the Platform</h2>
          <p className="text-white/70 mb-8">Start with a free 3-day trial. No credit card required.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="gfm-btn-primary text-base px-8 py-3.5 rounded-lg bg-white text-primary">Start Free Trial</Link>
            <Link href="/contact" className="gfm-btn-outline text-base px-8 py-3.5 rounded-lg" style={{color:'white',borderColor:'rgba(255,255,255,.4)'}}>Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
