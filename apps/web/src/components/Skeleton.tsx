'use client';

interface Props { type?: 'card'|'signal'|'table'|'chart'|'text'|'profile'; count?: number; }

export default function Skeleton({ type='card', count=1 }: Props) {
  const items = Array(count).fill(null);

  if (type === 'card') return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((_,i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 animate-pulse">
          <div className="h-3 bg-slate-100 rounded w-20 mb-2"/>
          <div className="h-7 bg-slate-200 rounded w-16 mb-1"/>
          <div className="h-2 bg-slate-100 rounded w-24"/>
        </div>
      ))}
    </div>
  );

  if (type === 'signal') return (
    <div className="space-y-2">
      {items.map((_,i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-100 p-3.5 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-slate-200 rounded-full"/>
            <div className="flex-1 space-y-1.5">
              <div className="flex gap-2"><div className="h-3 bg-slate-200 rounded w-32"/><div className="h-3 bg-slate-100 rounded w-20"/></div>
              <div className="flex gap-3"><div className="h-2 bg-slate-100 rounded w-16"/><div className="h-2 bg-slate-100 rounded w-12"/></div>
            </div>
            <div className="h-4 bg-slate-200 rounded w-16"/>
          </div>
        </div>
      ))}
    </div>
  );

  if (type === 'table') return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex gap-4">
        {[8,16,12,8,8,8].map((w,i)=><div key={i} className={`h-3 bg-slate-200 rounded w-${w}`}/>)}
      </div>
      {items.map((_,i)=>(
        <div key={i} className="px-4 py-3 border-b border-slate-50 flex gap-4 items-center">
          <div className="h-3 bg-slate-100 rounded w-6"/>
          <div className="flex gap-2 flex-1"><div className="h-3 bg-slate-200 rounded w-24"/><div className="h-2 bg-slate-100 rounded w-16"/></div>
          <div className="h-3 bg-slate-100 rounded w-12"/>
          <div className="h-3 bg-slate-100 rounded w-10"/>
          <div className="h-3 bg-slate-100 rounded w-10"/>
        </div>
      ))}
    </div>
  );

  if (type === 'chart') return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-4 bg-slate-200 rounded w-32"/>
        <div className="flex gap-2"><div className="h-6 bg-slate-100 rounded w-16"/><div className="h-6 bg-slate-100 rounded w-16"/></div>
      </div>
      <div className="flex items-end gap-2 h-40">
        {[60,45,75,55,85,70,90,65,80,72,88,76].map((h,i)=>(
          <div key={i} className="flex-1 bg-slate-100 rounded-t" style={{height:`${h}%`}}/>
        ))}
      </div>
    </div>
  );

  if (type === 'text') return (
    <div className="space-y-2 animate-pulse">
      {items.map((_,i)=>(
        <div key={i} className="space-y-1.5">
          <div className="h-3 bg-slate-200 rounded w-full"/>
          <div className="h-3 bg-slate-100 rounded w-5/6"/>
          <div className="h-3 bg-slate-100 rounded w-3/4"/>
        </div>
      ))}
    </div>
  );

  if (type === 'profile') return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 bg-slate-200 rounded-2xl"/>
        <div className="flex-1 space-y-2"><div className="h-5 bg-slate-200 rounded w-40"/><div className="h-3 bg-slate-100 rounded w-28"/></div>
        <div className="w-12 h-12 bg-slate-100 rounded-xl"/>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {Array(4).fill(null).map((_,i)=><div key={i} className="h-12 bg-slate-100 rounded-lg"/>)}
      </div>
      <div className="space-y-2">
        {Array(3).fill(null).map((_,i)=><div key={i} className="h-2 bg-slate-100 rounded" style={{width:`${[100,85,70][i]}%`}}/>)}
      </div>
    </div>
  );

  return null;
}
