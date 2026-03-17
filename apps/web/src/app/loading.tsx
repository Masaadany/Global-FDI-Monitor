export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"/>
        <div className="text-sm text-slate-400 font-semibold">Loading intelligence…</div>
      </div>
    </div>
  );
}
