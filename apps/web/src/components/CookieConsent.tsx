'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('gfm_cookie_consent');
      if (!consent) setShow(true);
    } catch {}
  }, []);

  function accept() {
    try { localStorage.setItem('gfm_cookie_consent', JSON.stringify({ accepted: true, ts: Date.now() })); } catch {}
    setShow(false);
  }

  function decline() {
    try { localStorage.setItem('gfm_cookie_consent', JSON.stringify({ accepted: false, ts: Date.now() })); } catch {}
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-fadeIn">
      <div className="gfm-card p-5 shadow-lg" style={{border:'1px solid rgba(116,187,101,0.2)',background:'rgba(240,248,238,0.97)',backdropFilter:'blur(20px)'}}>
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl flex-shrink-0">🍪</span>
          <div>
            <div className="font-extrabold text-sm mb-1" style={{color:'#0A3D62'}}>We use cookies</div>
            <div className="text-xs leading-relaxed" style={{color:'#696969'}}>
              We use essential cookies for authentication and optional analytics cookies to improve the platform.
              {' '}<Link href="/privacy" className="underline" style={{color:'#74BB65'}}>Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={accept} aria-label="Accept all cookies" className="gfm-btn-primary text-xs py-2 px-5 flex-1">Accept All</button>
          <button onClick={decline} aria-label="Accept essential cookies only" className="gfm-btn-outline text-xs py-2 px-4" style={{color:'#696969'}}>Essential Only</button>
          <button onClick={decline} className="text-fog hover:text-bright transition-colors text-xl flex-shrink-0 px-1">×</button>
        </div>
      </div>
    </div>
  );
}
