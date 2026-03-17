import Link from 'next/link';
export default function DashboardSuccessPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="gfm-card p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">✅</div>
        <h1 className="font-extrabold text-2xl text-deep mb-2">You&apos;re all set!</h1>
        <p className="text-slate-500 text-sm mb-6">Your account is active. You have <strong className="text-primary">5 FIC</strong> to start exploring premium intelligence.</p>
        <div className="space-y-3">
          <Link href="/signals"   className="block gfm-btn-primary py-3 rounded-xl">Explore Live Signals →</Link>
          <Link href="/gfr"       className="block gfm-btn-outline py-3 rounded-xl">View GFR Rankings →</Link>
          <Link href="/dashboard" className="block text-sm text-slate-400 hover:text-primary py-2">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
