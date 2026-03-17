import Link from 'next/link';
export default function FICSuccessPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="gfm-card p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-5">⭐</div>
        <h1 className="text-3xl font-extrabold text-deep mb-2">FIC Credits Added</h1>
        <p className="text-slate-500 mb-6">Your Forecasta Intelligence Credits have been added to your account. Start unlocking premium intelligence now.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/reports"   className="gfm-btn-primary px-6 py-3">Generate Report</Link>
          <Link href="/signals"   className="gfm-btn-outline px-6 py-3">View Signals</Link>
        </div>
        <Link href="/dashboard" className="block text-xs text-slate-400 hover:text-slate-600 mt-5">← Back to Dashboard</Link>
      </div>
    </div>
  );
}
