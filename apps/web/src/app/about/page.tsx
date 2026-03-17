'use client';
import Link from 'next/link';

const TEAM_VALUES = [
  { icon:'🎯', title:'Intelligence First', desc:'Every feature is built around actionable intelligence, not raw data. We turn 3,000+ sources into decisions.' },
  { icon:'🔬', title:'Methodologically Rigorous', desc:'GFR Rankings and signal scores use peer-reviewed frameworks. Every data point carries source attribution and verification hash.' },
  { icon:'⚡', title:'Real-Time by Design', desc:'2-second signal delivery via WebSocket. No batch processing delays. Investment intelligence at the speed of markets.' },
  { icon:'🌍', title:'Truly Global', desc:'215 economies, 40 languages, 21 ISIC sectors. Not a US-centric or EU-centric product — built for the world\'s IPAs and investors.' },
];

const PLATFORM_STATS = [
  { value:'215', label:'Economies covered', detail:'All World Bank economies' },
  { value:'50',  label:'AI agents', detail:'Specialized intelligence modules' },
  { value:'3,000+', label:'Data sources', detail:'67 active free + premium ready' },
  { value:'10', label:'Report types', detail:'On-demand custom reports' },
  { value:'2s', label:'Signal latency', detail:'WebSocket real-time delivery' },
  { value:'40', label:'Languages', detail:'10 at launch, 30 pipeline' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#0A2540] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4">About Global FDI Monitor</div>
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Built for the world&apos;s investment promotion professionals
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto leading-relaxed">
            Global FDI Monitor is the world&apos;s first fully integrated investment and trade intelligence platform —
            designed specifically for IPAs, economic development agencies, and institutional investors.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Our Mission</div>
              <h2 className="text-3xl font-black text-[#0A2540] mb-5">
                Make global investment intelligence accessible to every IPA and investor
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Investment promotion agencies spend millions on consultants and fragmented data subscriptions
                to answer questions that should take seconds. We built Global FDI Monitor to change that.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                50 specialized AI agents continuously analyze 3,000+ sources — UNCTAD, World Bank, IMF,
                national statistics offices, newswires, satellite data, and social media — to surface
                the signals that matter before your competitors see them.
              </p>
              <Link href="/register"
                className="inline-block bg-[#1D4ED8] text-white font-black px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors">
                Start Free Trial
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {PLATFORM_STATS.map(s => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="text-2xl font-black text-[#0A2540]">{s.value}</div>
                  <div className="text-xs font-bold text-slate-600 mt-1">{s.label}</div>
                  <div className="text-xs text-slate-400">{s.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Our Principles</div>
            <h2 className="text-3xl font-black text-[#0A2540]">How we build</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {TEAM_VALUES.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="text-3xl mb-3">{v.icon}</div>
                <div className="font-black text-[#0A2540] mb-2">{v.title}</div>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GFR methodology callout */}
      <section className="py-16 px-6 bg-[#0A2540] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-4">The GFR Ranking Methodology</h2>
          <p className="text-blue-200 max-w-2xl mx-auto mb-6 text-sm leading-relaxed">
            The Global Future Readiness Ranking scores all 215 economies across six weighted dimensions:
            Macro Foundations (20%), Policy &amp; Institutional (18%), Digital Foundations (15%),
            Human Capital (15%), Infrastructure (15%), and Sustainability (17%).
            Updated quarterly using 40+ authoritative data sources.
          </p>
          <Link href="/gfr"
            className="inline-block border border-blue-400 text-blue-200 font-bold px-6 py-3 rounded-xl hover:bg-white/5 transition-colors">
            View GFR Rankings →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-[#0A2540] mb-4">Ready to try it?</h2>
          <p className="text-slate-500 mb-6">3-day free trial. No credit card. Access to live signals for your chosen economy.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/register"
              className="bg-[#0A2540] text-white font-black px-6 py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors">
              Start Free Trial
            </Link>
            <Link href="/contact"
              className="border border-slate-300 text-slate-600 font-semibold px-6 py-3 rounded-xl hover:border-blue-400 transition-colors">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
