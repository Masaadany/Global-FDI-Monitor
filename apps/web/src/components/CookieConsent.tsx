'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem('gfm_cookies_accepted')) {
        setTimeout(() => setShow(true), 2000);
      }
    } catch {}
  }, []);

  function accept() {
    try { localStorage.setItem('gfm_cookies_accepted', 'true'); } catch {}
    setShow(false);
  }

  function reject() {
    try { localStorage.setItem('gfm_cookies_accepted', 'essential'); } catch {}
    setShow(false);
  }

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
      width: 'min(640px, calc(100vw - 40px))',
      background: 'rgba(8,20,36,0.97)',
      border: '1px solid rgba(0,255,200,0.2)',
      borderRadius: '14px',
      padding: '18px 22px',
      zIndex: 9999,
      backdropFilter: 'blur(20px)',
      boxShadow: '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,200,0.08)',
      display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap',
      animation: 'slideUp 0.4s ease',
    }}>
      <div style={{flex:1,minWidth:'200px'}}>
        <div style={{fontSize:'13px',fontWeight:700,color:'#e8f4f8',marginBottom:'3px'}}>🍪 We use cookies</div>
        <div style={{fontSize:'11px',color:'rgba(232,244,248,0.5)',lineHeight:1.6}}>
          Essential cookies only — no advertising trackers. See our{' '}
          <Link href="/privacy" style={{color:'#00ffc8',textDecoration:'none',fontWeight:600}}>Privacy Policy</Link>.
        </div>
      </div>
      <div style={{display:'flex',gap:'8px',flexShrink:0}}>
        <button onClick={reject} style={{padding:'8px 16px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',cursor:'pointer',fontSize:'12px',fontWeight:600,color:'rgba(232,244,248,0.6)',fontFamily:"'Inter',sans-serif"}}>
          Essential only
        </button>
        <button onClick={accept} style={{padding:'8px 20px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'#020c14',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'12px',fontWeight:800,fontFamily:"'Inter',sans-serif"}}>
          Accept All
        </button>
      </div>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
    </div>
  );
}
