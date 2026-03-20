'use client';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastCtx {
  toasts: Toast[];
  toast: (t: Omit<Toast,'id'>) => void;
  success: (title: string, message?: string) => void;
  error:   (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info:    (title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastCtx | null>(null);

const TYPE_CONFIG: Record<ToastType, {icon:string; bg:string; border:string; color:string}> = {
  success: { icon:'✓', bg:'rgba(34,197,94,0.08)',   border:'rgba(34,197,94,0.25)',   color:'#22c55e' },
  error:   { icon:'✕', bg:'rgba(239,68,68,0.08)',   border:'rgba(239,68,68,0.25)',   color:'#EF4444' },
  warning: { icon:'⚠', bg:'rgba(10,61,98,0.08)',   border:'rgba(10,61,98,0.25)',   color:'#0A3D62' },
  info:    { icon:'ℹ', bg:'rgba(116,187,101,0.08)',   border:'rgba(116,187,101,0.25)',   color:'#74BB65' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((t: Omit<Toast,'id'>) => {
    const id = Math.random().toString(36).slice(2);
    const duration = t.duration ?? 4000;
    setToasts(prev => [...prev.slice(-4), { ...t, id }]); // max 5 toasts
    if (duration > 0) setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  const success = useCallback((title: string, message?: string) => toast({type:'success',title,message}), [toast]);
  const error   = useCallback((title: string, message?: string) => toast({type:'error',  title,message}), [toast]);
  const warning = useCallback((title: string, message?: string) => toast({type:'warning',title,message}), [toast]);
  const info    = useCallback((title: string, message?: string) => toast({type:'info',   title,message}), [toast]);

  return (
    <ToastContext.Provider value={{ toasts, toast, success, error, warning, info, dismiss }}>
      {children}
      {/* Toast container */}
      <div role="alert" aria-live="polite" aria-atomic="true" className="fixed bottom-4 right-4 z-[100] space-y-2 max-w-sm w-full px-4 pointer-events-none">
        {toasts.map(t => {
          const cfg = TYPE_CONFIG[t.type];
          return (
            <div key={t.id}
              className="animate-fadeIn pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg"
              style={{background:cfg.bg, border:`1px solid ${cfg.border}`, backdropFilter:'blur(10px)'}}>
              <span className="font-extrabold text-sm flex-shrink-0 mt-0.5" style={{color:cfg.color}}>{cfg.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm" style={{color:'#0A3D62'}}>{t.title}</div>
                {t.message && <div className="text-xs mt-0.5 leading-relaxed" style={{color:'#696969'}}>{t.message}</div>}
              </div>
              <button onClick={()=>dismiss(t.id)} className="text-fog hover:text-bright text-lg leading-none flex-shrink-0">×</button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default ToastProvider;
