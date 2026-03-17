'use client';
import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';

interface Toast { id:string; type:'success'|'error'|'info'|'warning'; message:string; duration?:number; }
interface ToastCtx { add:(t:Omit<Toast,'id'>)=>void; remove:(id:string)=>void; }

const ToastContext = createContext<ToastCtx>({add:()=>{},remove:()=>{}});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((t: Omit<Toast,'id'>) => {
    const id = `toast_${Date.now()}`;
    setToasts(prev => [...prev, {...t, id}].slice(-5));
    setTimeout(() => setToasts(prev => prev.filter(x=>x.id!==id)), t.duration || 4000);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(x => x.id !== id));
  }, []);

  const ICONS:   Record<string,string> = {success:'✓',error:'✗',info:'ℹ',warning:'⚠'};
  const STYLES:  Record<string,string> = {
    success: 'bg-emerald-600 text-white',
    error:   'bg-red-600 text-white',
    info:    'bg-blue-600 text-white',
    warning: 'bg-amber-500 text-white',
  };

  return (
    <ToastContext.Provider value={{ add, remove }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-xs w-full pointer-events-none">
        {toasts.map(t => (
          <div key={t.id}
            className={`${STYLES[t.type]} px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 pointer-events-auto animate-in slide-in-from-right-2`}>
            <span className="text-sm font-black flex-shrink-0 w-5 text-center">{ICONS[t.type]}</span>
            <span className="text-sm font-semibold flex-1">{t.message}</span>
            <button onClick={()=>remove(t.id)} className="text-white/70 hover:text-white text-lg leading-none flex-shrink-0">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() { return useContext(ToastContext); }
