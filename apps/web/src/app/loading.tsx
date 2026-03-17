export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full"/>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"/>
        </div>
        <div className="text-sm font-semibold text-slate-400">Loading intelligence…</div>
        <div className="text-xs text-slate-300">Global FDI Monitor</div>
      </div>
    </div>
  );
}
