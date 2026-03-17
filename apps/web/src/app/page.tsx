import Link from 'next/link';
import dynamic from 'next/dynamic';
import { OrganizationJsonLd, SoftwareAppJsonLd, FAQJsonLd } from '@/components/JsonLd';

const GlobeMap = dynamic(() => import('@/components/GlobeMap'), { ssr:false });

async function getLiveStats() {
  try {
    const API = process.env.NEXT_PUBLIC_API_URL || '';
    const r = await fetch(`${API}/api/v1/health`, { next:{ revalidate:120 } });
    const d = await r.json();
    return { signals: d?.data?.signals_broadcast || 218 };
  } catch { return { signals: 218 }; }
}

export default async function HomePage() {
  const stats = await getLiveStats();

  const FAQS = [
    { q:'What is Global FDI Monitor?', a:"GFM is the world's first fully integrated FDI intelligence platform covering 215 economies with real-time signals, GFR rankings, and AI-powered reports." },
    { q:'How much does it cost?', a:'Professional plan starts at $899/month. A 3-day free trial with 5 FIC credits is available — no credit card required.' },
    { q:'What data sources does GFM use?', a:'IMF, World Bank, UNCTAD, OECD, IEA, ILO, Freedom House, TI, GDELT, and more. Every data point carries full SHA-256 provenance.' },
    { q:'What are FIC credits?', a:'Forecasta Intelligence Credits unlock premium intelligence: Platinum signals, custom reports, and mission planning dossiers.' },
  ];

  const PLATFORM_NUMBERS = [
    { n:'215', l:'Countries Tracked' },
    { n:'1,400+', l:'Free Zones' },
    { n:'21', l:'Sectors' },
    { n:'+20 yrs', l:'Historical Archive' },
    { n:String(stats.signals), l:'Live Signal Count' },
    { n:'140,000+', l:'Company Profiles' },
    { n:'300+', l:'Data Sources' },
    { n:'50+', l:'Capabilities' },
  ];

  const FEATURES = [
    { icon:'📡', title:'Live Market Signals Dashboard', desc:'Real-time PLATINUM to BRONZE FDI signals. Every 2 seconds across 215 economies.', href:'/signals' },
    { icon:'🏆', title:'Future Readiness Ranking', desc:'GFR composite index: 6 dimensions, 40+ indicators, 215 economies. Quarterly update.', href:'/gfr' },
    { icon:'🎯', title:'Investment Mission Planning', desc:'AI-generated company targets ranked by Mission Feasibility Score. FlightRadar-style map.', href:'/pmp' },
    { icon:'📋', title:'Custom Intelligence Reports', desc:'10 AI-powered report types. Z3 verified. SHA-256 provenance on every claim.', href:'/reports' },
    { icon:'🔮', title:'Forecast & Outlook', desc:'FDI forecasts 2025–2030. Bayesian VAR + Prophet. 3 scenarios with Monte Carlo.', href:'/forecast' },
    { icon:'💡', title:'Resources & Insights', desc:'12 intelligence items weekly: macro trends, regulatory updates, sector signals.', href:'/market-insights' },
    { icon:'📰', title:'Publications Library', desc:'Weekly digests, monthly reports, quarterly GFR publications. Archive since 2025.', href:'/publications' },
    { icon:'🌐', title:'Latest News & Signals', desc:'GDELT-powered signal detection. Verified from 300+ trusted sources.', href:'/analytics' },
  ];

  const WHY_GFM = [
    { icon:'⚡', title:'Live Data', desc:'Real-time updates every 2 seconds from 300+ verified sources' },
    { icon:'📊', title:'Investor Signals', desc:'Early-stage indicators before they hit mainstream news' },
    { icon:'🏢', title:'Company Profiles', desc:'140,000+ company intelligence profiles with investment history' },
    { icon:'📈', title:'Trends Analysis', desc:'Advanced analytics with 20+ years of historical FDI data' },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <OrganizationJsonLd/>
      <SoftwareAppJsonLd/>
      <FAQJsonLd faqs={FAQS}/>

      {/* ── HERO ── */}
      <section className="gfm-hero text-white relative overflow-hidden" style={{minHeight:'520px'}}>
        {/* Animated grid */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_,i) => (
            <div key={i} className="absolute w-px bg-white/5" style={{left:`${(i+1)*12.5}%`,top:0,bottom:0}}/>
          ))}
          {[...Array(5)].map((_,i) => (
            <div key={i} className="absolute h-px bg-white/5" style={{top:`${(i+1)*20}%`,left:0,right:0}}/>
          ))}
          {/* Glow orb */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full opacity-10" style={{background:'radial-gradient(circle,#0A66C2,transparent)'}}/>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
          {/* Live badge */}
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 live-dot"/>
            <span className="text-xs font-bold tracking-wide text-emerald-300">LIVE</span>
            <span className="text-white/60 text-xs">·</span>
            <span className="text-xs text-white/80 font-mono">{stats.signals} signals processing</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5 tracking-tight">
            Real-Time &amp; Live<br/>
            <span style={{background:'linear-gradient(90deg,#60A5FA,#A78BFA)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
              Global Investment Data Monitor
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed">
            The world&apos;s most comprehensive FDI intelligence platform. 215 economies · 50 AI agents · Real-time signals · GFR Rankings.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="gfm-btn-primary text-base px-8 py-3.5 rounded-lg shadow-blue" style={{background:'#0A66C2'}}>
              Explore Platform →
            </Link>
            <Link href="/demo" className="gfm-btn-outline text-base px-8 py-3.5 rounded-lg" style={{color:'white',borderColor:'rgba(255,255,255,.4)',background:'rgba(255,255,255,.08)'}}>
              View Live Demo
            </Link>
          </div>
          <p className="text-xs text-white/40 mt-5 font-mono">3 days free · 5 FIC credits · No credit card</p>
        </div>
      </section>

      {/* ── WHY GFM ── */}
      <section className="bg-deep py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Comprehensive database of cross-border investment projects</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {WHY_GFM.map(w => (
              <div key={w.title} className="text-center p-4">
                <div className="text-2xl mb-2">{w.icon}</div>
                <div className="font-bold text-sm text-white mb-1">{w.title}</div>
                <p className="text-xs text-white/50 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM IN NUMBERS ── */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">By The Numbers</div>
            <h2 className="text-3xl font-extrabold text-deep">Global FDI Monitor in Numbers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {PLATFORM_NUMBERS.map(s => (
              <div key={s.l} className="gfm-card p-5 text-center">
                <div className="stat-number text-3xl font-bold mb-1" style={{color:'var(--primary)'}}>{s.n}</div>
                <div className="text-xs text-slate-500 font-medium">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GLOBE MAP ── */}
      <section className="py-14 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Live Coverage</div>
            <h2 className="text-2xl font-extrabold text-deep">FDI Intelligence Coverage</h2>
          </div>
          <GlobeMap/>
        </div>
      </section>

      {/* ── PLATFORM FEATURES ── */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Platform Features</div>
            <h2 className="text-3xl font-extrabold text-deep">Everything You Need to Lead on FDI</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {FEATURES.map(f => (
              <Link key={f.title} href={f.href}
                className="gfm-card p-5 group block hover:border-primary transition-colors">
                <div className="sector-icon mb-3 group-hover:bg-primary group-hover:text-white transition-colors">{f.icon}</div>
                <h3 className="font-bold text-sm text-deep mb-1.5 leading-tight">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                <div className="text-xs text-primary font-semibold mt-3 group-hover:underline">Explore →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6" style={{background:'var(--gradient-primary)'}}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">Start Your Free Trial Today</h2>
          <p className="text-white/70 mb-8">Professional intelligence from <strong className="text-white">$899/month</strong>. Start with a free 3-day trial.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="gfm-btn-primary text-base px-8 py-3.5 rounded-lg bg-white text-primary hover:bg-white/90">
              Start Free Trial
            </Link>
            <Link href="/contact?type=demo" className="gfm-btn-outline text-base px-8 py-3.5 rounded-lg" style={{color:'white',borderColor:'rgba(255,255,255,.4)'}}>
              Request Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}

        {/* Social Proof */}
        <section className="bg-white py-14 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Trusted By Investment Leaders</div>
              <h2 className="text-2xl font-extrabold text-deep">What professionals say about GFM</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { quote:"GFM reduced our signal-to-decision time from weeks to hours. The PLATINUM grade accuracy is exceptional.", author:"Head of FDI Intelligence", org:"MENA Investment Promotion Agency", flag:"🇦🇪" },
                { quote:"The GFR methodology is the most comprehensive ranking framework available. We reference it in every board presentation.", author:"Chief Strategy Officer", org:"Sovereign Wealth Fund", flag:"🇸🇦" },
                { quote:"Mission Planning maps cut our outreach preparation by 70%. The IMS scores are a game-changer for company targeting.", author:"Director, Investment Attraction", org:"Asia-Pacific IPA", flag:"🇸🇬" },
              ].map((t,i)=>(
                <div key={i} className="gfm-card p-6">
                  <div className="text-amber-400 text-base mb-3">★★★★★</div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{t.flag}</span>
                    <div>
                      <div className="text-xs font-bold text-deep">{t.author}</div>
                      <div className="text-xs text-slate-400">{t.org}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      <footer className="bg-deep text-white px-6 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm" style={{background:'linear-gradient(135deg,#0A2540,#0A66C2)'}}>G</div>
              <span className="font-extrabold text-white">Global FDI Monitor</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              The world&apos;s most comprehensive FDI intelligence platform.
            </p>
            <div className="text-sm text-white/40 space-y-0.5 font-mono">
              <div>info@fdimonitor.org</div>
              <div>+971 50 286 7070</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Platform</div>
              {[['Dashboard','/dashboard'],['Signals','/signals'],['GFR','/gfr'],['Forecast','/forecast'],['Reports','/reports'],['Missions','/pmp']].map(([l,h])=>(
                <Link key={l} href={h} className="block text-sm text-white/60 hover:text-white py-0.5 transition-colors">{l}</Link>
              ))}
            </div>
            <div>
              <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Company</div>
              {[['About','/about'],['Publications','/publications'],['Contact','/contact'],['Pricing','/pricing'],['Privacy','/privacy'],['Terms','/terms']].map(([l,h])=>(
                <Link key={l} href={h} className="block text-sm text-white/60 hover:text-white py-0.5 transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/30">
          © 2026 Global FDI Monitor. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
