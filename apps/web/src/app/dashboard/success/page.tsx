import Link from 'next/link';
export default function DashboardSuccessPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="gfm-card p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-5">🎉</div>
        <h1 className="text-3xl font-extrabold text-deep mb-2">Welcome to GFM Pro</h1>
        <p className="text-slate-500 mb-6">Your Professional subscription is active. You now have access to all 215 economies, PLATINUM signals, and 4,800 FIC credits per year.</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[['4,800','FIC Credits'],['215','Economies'],['3','Seats']].map(([v,l])=>(
            <div key={l} className="bg-surface rounded-xl border border-slate-200 p-3 text-center">
              <div className="text-xl font-extrabold text-primary font-mono">{v}</div>
              <div className="text-xs text-slate-400">{l}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard"  className="gfm-btn-primary px-6 py-3">Go to Dashboard</Link>
          <Link href="/onboarding" className="gfm-btn-outline px-6 py-3">Platform Tour</Link>
        </div>
      </div>
    </div>
  );
}
