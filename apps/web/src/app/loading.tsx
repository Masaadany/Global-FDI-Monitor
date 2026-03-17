export default function Loading() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative w-14 h-14 mx-auto">
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full"/>
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"/>
        </div>
        <div className="text-sm font-semibold text-slate-400">Loading intelligence…</div>
        <div className="text-xs text-slate-300 font-mono">Global FDI Monitor</div>
      </div>
    </div>
  );
}
