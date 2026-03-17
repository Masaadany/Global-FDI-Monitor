'use client';
import { useState, createContext, useContext, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';
interface ToastMsg { id: string; type: ToastType; title: string; body?: string; }
type ToastFn = (title: string, body?: string) => void;

interface ToastContextValue {
  success: ToastFn; error: ToastFn; warning: ToastFn; info: ToastFn;
}

const ToastContext = createContext<ToastContextValue>({
  success:()=>{}, error:()=>{}, warning:()=>{}, info:()=>{}
});

const TYPE_CONFIG: Record<ToastType,{bg:string;icon:string;border:string}> = {
  success: { bg:'bg-emerald-50', icon:'✓',  border:'border-emerald-200' },
  error:   { bg:'bg-red-50',     icon:'✗',  border:'border-red-200'     },
  warning: { bg:'bg-amber-50',   icon:'⚠',  border:'border-amber-200'   },
  info:    { bg:'bg-blue-50',    icon:'ℹ',  border:'border-blue-200'    },
};

const TYPE_ICON_COLOR: Record<ToastType,string> = {
  success:'text-emerald-600', error:'text-red-600', warning:'text-amber-600', info:'text-blue-600',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const show = useCallback((type: ToastType) => (title: string, body?: string) => {
    const id = `toast_${Date.now()}`;
    setToasts(t => [...t, { id, type, title, body }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const value: ToastContextValue = {
    success: show('success'),
    error:   show('error'),
    warning: show('warning'),
    info:    show('info'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[9999] space-y-2 pointer-events-none">
        {toasts.map(t => {
          const cfg  = TYPE_CONFIG[t.type];
          const icol = TYPE_ICON_COLOR[t.type];
          return (
            <div key={t.id}
              className={`${cfg.bg} border ${cfg.border} rounded-xl shadow-lg p-4 min-w-72 max-w-sm pointer-events-auto flex items-start gap-3 animate-fade-in`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${icol} bg-white`}>
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-deep">{t.title}</div>
                {t.body && <div className="text-xs text-slate-500 mt-0.5">{t.body}</div>}
              </div>
              <button onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))}
                className="text-slate-300 hover:text-slate-500 text-lg leading-none flex-shrink-0">×</button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

export default ToastProvider;
