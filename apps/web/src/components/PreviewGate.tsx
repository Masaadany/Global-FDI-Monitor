'use client';
import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';

type Feature = 'reports' | 'downloads' | 'full_profile' | 'api';

const FEATURE_LABELS: Record<Feature, { title: string; desc: string; icon: string }> = {
  reports:      { title:'Intelligence Reports', desc:'Generate PDF reports with AI analysis',       icon:'📋' },
  downloads:    { title:'Data Downloads',        desc:'Export signals, GFR data, and analytics',    icon:'⬇️' },
  full_profile: { title:'Full Intelligence Profile', desc:'Access complete company & country data', icon:'🔍' },
  api:          { title:'API Access',            desc:'Programmatic access to all endpoints',       icon:'🔑' },
};

export default function PreviewGate({
  feature,
  children,
  preview,
}: {
  feature: Feature;
  children: ReactNode;
  preview?: ReactNode;
}) {
  const [isTrial, setIsTrial] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    try {
      const start = localStorage.getItem('gfm_trial_start');
      const token = localStorage.getItem('gfm_token');
      if (token && start) {
        const daysLeft = 7 - Math.floor((Date.now() - +start) / 86400000);
        setIsTrial(daysLeft > 0);
      }
    } catch {}
  }, []);

  if (!isTrial) return <>{children}</>;

  const meta = FEATURE_LABELS[feature];

  return (
    <>
      {preview || (
        <div role="region" aria-label="Premium feature preview" className="relative rounded-xl overflow-hidden" style={{filter:'blur(3px)',pointerEvents:'none'}}>
          {children}
        </div>
      )}

      <div className="mt-3 p-4 rounded-xl text-center" style={{background:'rgba(116,187,101,0.06)',border:'1px solid rgba(116,187,101,0.15)'}}>
        <div className="text-xl mb-2">{meta.icon}</div>
        <div className="font-extrabold text-sm mb-1" style={{color:'#0A3D62'}}>{meta.title}</div>
        <div className="text-xs mb-3" style={{color:'#696969'}}>{meta.desc} — requires a paid subscription.</div>
        <div className="flex gap-2 justify-center">
          <Link href="/subscription" className="gfm-btn-primary text-xs py-1.5 px-5">Upgrade Now</Link>
          <button onClick={()=>setShowModal(true)} className="gfm-btn-outline text-xs py-1.5 px-4" style={{color:'#696969'}}>Learn more</button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={()=>setShowModal(false)}>
          <div className="gfm-card p-7 max-w-md w-full text-center" onClick={e=>e.stopPropagation()}>
            <div className="text-4xl mb-3">{meta.icon}</div>
            <h3 className="font-extrabold text-lg mb-2" style={{color:'#0A3D62'}}>{meta.title}</h3>
            <p className="text-sm mb-5" style={{color:'#696969'}}>
              {meta.desc}. Available on Professional ($799/month) and Enterprise plans.
              Your 3-day free trial provides read-only access to all dashboards.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/subscription" className="gfm-btn-primary text-sm px-6 py-2.5">Upgrade to Professional</Link>
              <button onClick={()=>setShowModal(false)} className="gfm-btn-outline text-sm px-6 py-2.5" style={{color:'#696969'}}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
