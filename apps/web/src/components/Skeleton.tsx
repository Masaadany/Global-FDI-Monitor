'use client';

export function SkeletonLine({ w = '100%', h = '1rem' }: { w?: string; h?: string }) {
  return (
    <div className="bg-slate-200 rounded animate-pulse" style={{ width: w, height: h }} />
  );
}

export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-3">
      <SkeletonLine w="60%" h="1.25rem" />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonLine key={i} w={`${90 - i * 10}%`} h="0.875rem" />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <div className="bg-slate-50 p-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonLine key={i} w={`${100 / cols}%`} h="0.75rem" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="border-t border-slate-50 p-3 flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonLine key={c} w={`${100 / cols}%`} h="0.875rem" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonSignal() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-2">
      <div className="flex gap-3">
        <div className="w-2 h-2 rounded-full bg-slate-200 animate-pulse mt-1.5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <SkeletonLine w="4rem" h="1.25rem" />
            <SkeletonLine w="7rem" h="1.25rem" />
          </div>
          <SkeletonLine w="12rem" h="0.75rem" />
        </div>
        <SkeletonLine w="3rem" h="1.25rem" />
      </div>
    </div>
  );
}

export function SkeletonGlobe() {
  return (
    <div className="bg-[#030d1a] rounded-2xl border border-blue-900 overflow-hidden animate-pulse">
      <div className="h-12 bg-blue-950" />
      <div className="aspect-video bg-gradient-to-br from-blue-950 to-[#030d1a]" />
      <div className="h-16 bg-blue-950" />
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-4">
      {/* Trust badges */}
      <div className="bg-[#0d1f35] rounded-xl border border-blue-900 p-4">
        <SkeletonLine w="12rem" h="0.75rem" />
        <div className="flex gap-2 mt-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-7 w-20 bg-blue-950 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
      {/* KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[#0d1f35] rounded-xl border border-blue-900 p-4 animate-pulse">
            <div className="h-3 w-16 bg-blue-950 rounded mb-2" />
            <div className="h-8 w-12 bg-blue-900 rounded" />
            <div className="h-2.5 w-20 bg-blue-950 rounded mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
