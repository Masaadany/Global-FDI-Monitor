import Link from 'next/link';
export default function NotFound() {
  const SUGGESTIONS = [
    {href:'/dashboard',   icon:'🗂', label:'Dashboard',     desc:'Your intelligence home'},
    {href:'/signals',     icon:'📡', label:'Live Signals',  desc:'Real-time FDI signals'},
    {href:'/gfr',         icon:'🏆', label:'GFR Rankings',  desc:'215 economy rankings'},
    {href:'/demo',        icon:'🎯', label:'Live Demo',     desc:'No login required'},
    {href:'/pricing',     icon:'💳', label:'Pricing',       desc:'From $899/month'},
    {href:'/register',    icon:'🚀', label:'Free Trial',    desc:'3 days free'},
  ];
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-2xl w-full">
        <div className="text-8xl font-extrabold text-slate-200 mb-4 font-mono select-none">404</div>
        <h1 className="text-2xl font-extrabold text-deep mb-2">Intelligence not found</h1>
        <p className="text-slate-500 mb-10">The page you're looking for doesn't exist or has moved.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {SUGGESTIONS.map(s=>(
            <Link key={s.href} href={s.href} className="gfm-card p-4 text-left group hover:border-primary">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-bold text-sm text-deep group-hover:text-primary transition-colors">{s.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.desc}</div>
            </Link>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="gfm-btn-primary px-6 py-2.5">← Home</Link>
          <Link href="/contact" className="gfm-btn-outline px-6 py-2.5">Report issue</Link>
        </div>
      </div>
    </div>
  );
}
