'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = typeof window !== 'undefined' ? localStorage.getItem('gfm_cookie_consent') : null;
    if (!consent) setShow(true);
  }, []);

  function accept() {
    localStorage.setItem('gfm_cookie_consent', 'accepted');
    setShow(false);
  }
  function decline() {
    localStorage.setItem('gfm_cookie_consent', 'declined');
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-5">
        <div className="font-bold text-sm text-[#0A2540] mb-2">Cookie preferences</div>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          We use essential cookies to operate the platform and analytics cookies to improve your experience.{' '}
          <Link href="/about" className="text-blue-600 hover:underline">Learn more</Link>
        </p>
        <div className="flex gap-2">
          <button onClick={accept}
            className="flex-1 bg-[#0A2540] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors">
            Accept all
          </button>
          <button onClick={decline}
            className="flex-1 border border-slate-200 text-slate-500 text-xs font-semibold py-2 rounded-lg hover:border-slate-300 transition-colors">
            Essential only
          </button>
        </div>
      </div>
    </div>
  );
}
