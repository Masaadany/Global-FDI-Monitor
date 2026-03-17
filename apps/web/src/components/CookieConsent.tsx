'use client';
import { useState, useEffect } from 'react';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const c = typeof window !== 'undefined' ? localStorage.getItem('gfm_cookie_consent') : null;
    if (!c) setShow(true);
  }, []);

  function accept() {
    if (typeof window !== 'undefined') localStorage.setItem('gfm_cookie_consent','accepted');
    setShow(false);
  }
  function decline() {
    if (typeof window !== 'undefined') localStorage.setItem('gfm_cookie_consent','declined');
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-[#0A2540] text-white rounded-2xl shadow-2xl border border-blue-800 p-5 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="font-black text-sm mb-1">🍪 Cookie Notice</div>
          <p className="text-blue-200 text-xs leading-relaxed">
            We use cookies to improve your experience and analyse platform usage. 
            No advertising cookies. Full privacy policy at{' '}
            <a href="/privacy" className="underline hover:text-white">fdimonitor.org/privacy</a>.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={decline}
            className="border border-blue-700 text-blue-300 text-xs font-bold px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
            Decline
          </button>
          <button onClick={accept}
            className="bg-[#1D4ED8] text-white text-xs font-bold px-5 py-2 rounded-lg hover:bg-blue-500 transition-colors">
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
