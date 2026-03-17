import Link from 'next/link';

export const metadata = {
  title: 'About — Global FDI Monitor',
  description:'Global FDI Monitor methodology, data sources, team, and mission.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#0A2540] text-white px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4">About GFM</div>
          <h1 className="text-4xl font-black mb-5">We make FDI intelligence accessible to every IPA</h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Global FDI Monitor is the world's first fully integrated FDI intelligence platform —
            combining real-time signals, AI-powered analytics, and rigorous methodology to give
            investment promotion agencies a decisive edge.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-black text-[#0A2540] mb-4">Our Mission</h2>
              <p className="text-slate-500 leading-relaxed mb-4">
                FDI intelligence has historically been inaccessible — locked behind $300K+ Bloomberg subscriptions
                or fragmented across dozens of sources. We built GFM to change that.
              </p>
              <p className="text-slate-500 leading-relaxed mb-4">
                Our platform aggregates 14 authoritative sources, applies AI signal detection, and packages
                intelligence into actionable tools that any IPA, government ministry, or investor can use —
                starting at $899/month.
              </p>
              <p className="text-slate-500 leading-relaxed">
                Every data point carries full provenance. Every AI claim passes logical verification.
                Every output carries a traceable reference code.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {n:'215',l:'Economies Tracked',c:'text-blue-600'},
                {n:'50',  l:'AI Agents Active',c:'text-emerald-600'},
                {n:'14',  l:'Data Sources',    c:'text-amber-600'},
                {n:'2s',  l:'Update Speed',    c:'text-violet-600'},
              ].map(s=>(
                <div key={s.l} className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
                  <div className={`text-4xl font-black ${s.c}`}>{s.n}</div>
                  <div className="text-slate-500 text-sm mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GFR Methodology */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-[#0A2540] mb-3">GFR Methodology</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            The Global Future Readiness Ranking (GFR) is a composite index scoring 215 economies
            across 6 weighted dimensions using 40+ underlying indicators. Quarterly updates.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {dim:'Macro Foundations',    wt:'20%',ind:8,  desc:'GDP growth, inflation, current account balance, sovereign ratings, debt sustainability.',  icon:'📊'},
              {dim:'Policy & Institutional',wt:'18%',ind:7,  desc:'Ease of doing business, rule of law, corruption perceptions, regulatory quality.',       icon:'⚖️'},
              {dim:'Digital Foundations',  wt:'15%',ind:6,  desc:'Internet penetration, 5G coverage, digital government index, AI readiness.',              icon:'💻'},
              {dim:'Human Capital',        wt:'15%',ind:7,  desc:'Tertiary enrolment, PISA scores, ILO skills index, labour productivity, language capacity.',icon:'🎓'},
              {dim:'Infrastructure',       wt:'15%',ind:6,  desc:'LPI score, airport connectivity, port efficiency, energy reliability, construction index.',  icon:'🏗️'},
              {dim:'Sustainability',       wt:'17%',ind:6,  desc:'EPI score, renewable energy share, carbon pricing, climate resilience, ESG policy.',       icon:'🌱'},
            ].map(d=>(
              <div key={d.dim} className="bg-slate-50 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{d.icon}</span>
                  <div>
                    <div className="font-black text-[#0A2540]">{d.dim}</div>
                    <div className="flex gap-3 text-xs text-slate-400">
                      <span className="font-bold text-blue-600">{d.wt} weight</span>
                      <span>{d.ind} indicators</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-700">
            <strong>Composite Formula:</strong> GFR = (Macro×0.20) + (Policy×0.18) + (Digital×0.15) + (Human×0.15) + (Infra×0.15) + (Sustain×0.17)
          </div>
        </div>
      </section>

      {/* Data sources */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-[#0A2540] mb-3">Data Integrity</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Every data point in GFM carries full provenance: source name, URL, retrieval timestamp,
            SHA-256 verification hash, and a unique GFM reference code. AI outputs pass through our
            Z3 logical verification layer before delivery.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {icon:'🏛️',title:'Tier 1 International Organisations',sources:['IMF WEO','World Bank WDI','UNCTAD WIR','OECD FDI Statistics','IEA Energy Investment','ILO STAT']},
              {icon:'📰',title:'Intelligence & News Sources',     sources:['GDELT GKG (real-time)','Reuters','Financial Times','Bloomberg (signals only)']},
              {icon:'📊',title:'NGO & Research',                 sources:['Transparency International CPI','Freedom House','Heritage Foundation EFI','Yale EPI']},
            ].map(g=>(
              <div key={g.title} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="text-2xl mb-2">{g.icon}</div>
                <div className="font-black text-[#0A2540] text-sm mb-3">{g.title}</div>
                <ul className="space-y-1">
                  {g.sources.map(s=>(
                    <li key={s} className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="text-emerald-500">✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#0A2540] text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-black mb-4">Start with a free trial</h2>
          <p className="text-blue-200 mb-8">3 days free. 5 FIC credits. No credit card required.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="bg-[#1D4ED8] text-white font-black px-7 py-3.5 rounded-xl hover:bg-blue-500 transition-colors">Start Free Trial</Link>
            <Link href="/contact"  className="border border-blue-400 text-blue-200 font-semibold px-7 py-3.5 rounded-xl hover:bg-white/5 transition-colors">Talk to Sales</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
