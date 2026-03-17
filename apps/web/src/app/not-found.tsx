import Link from 'next/link';
export default function NotFound() {
  const SUGGESTIONS = [
    { href:'/dashboard',   icon:'🗂',  label:'Dashboard',      desc:'Your intelligence home' },
    { href:'/signals',     icon:'📡',  label:'Live Signals',   desc:'Real-time FDI signals' },
    { href:'/gfr',         icon:'🏆',  label:'GFR Rankings',   desc:'215 economy rankings' },
    { href:'/demo',        icon:'🎯',  label:'Live Demo',      desc:'No login required' },
    { href:'/pricing',     icon:'💳',  label:'Pricing',        desc:'From $899/month' },
    { href:'/register',    icon:'🚀',  label:'Free Trial',     desc:'3 days free' },
  ];
  return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-2xl w-full">
        <div className="text-9xl font-black text-blue-900 mb-4 select-none">404</div>
        <h1 className="text-3xl font-black text-white mb-3">Intelligence not found</h1>
        <p className="text-blue-300 text-lg mb-10">The page you&apos;re looking for doesn&apos;t exist or has moved to a new location.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {SUGGESTIONS.map(s => (
            <Link key={s.href} href={s.href}
              className="bg-[#0d1f35] border border-blue-900 hover:border-blue-600 rounded-xl p-4 text-left transition-all group">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-black text-white text-sm group-hover:text-blue-300 transition-colors">{s.label}</div>
              <div className="text-blue-500 text-xs mt-0.5">{s.desc}</div>
            </Link>
          ))}
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="bg-[#1D4ED8] text-white font-black px-6 py-3 rounded-xl hover:bg-blue-500 transition-colors">
            ← Home
          </Link>
          <Link href="/contact" className="border border-blue-700 text-blue-300 font-bold px-6 py-3 rounded-xl hover:bg-white/5 transition-colors">
            Report issue
          </Link>
        </div>
      </div>
    </div>
  );
}
