'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTrial } from '@/lib/trialContext';
import Link from 'next/link';
import type { ReactNode } from 'react';

// Pages that are always accessible (no gate)
const PUBLIC_PATHS = [
  '/contact', '/auth/login', '/auth/reset', '/register',
  '/pricing', '/terms', '/privacy', '/faq', '/about',
  '/',
];

interface TrialGateProps { children: ReactNode }

export default function TrialGate({ children }: TrialGateProps) {
  const trial   = useTrial();
  const router  = useRouter();
  const path    = usePathname();
  const [shown, setShown] = useState(false);

  const isPublic = PUBLIC_PATHS.some(p =>
    path === p || path?.startsWith('/auth/') || path?.startsWith('/fic/')
  );

  useEffect(() => {
    if (!trial.isSoftLocked || isPublic) { setShown(false); return; }
    // Build contextual redirect URL
    const url = trial.demoUrl || '/contact?reason=trial_expired';
    // Show overlay briefly then redirect
    setShown(true);
    const t = setTimeout(() => {
      router.push(url);
    }, 2800);
    return () => clearTimeout(t);
  }, [trial.isSoftLocked, isPublic, trial.demoUrl, router]);

  if (!trial.isSoftLocked || isPublic) return <>{children}</>;

  if (shown) {
    return (
      <>
        {/* Blurred page underneath */}
        <div style={{filter:'blur(4px)',pointerEvents:'none',userSelect:'none',opacity:0.3}} aria-hidden="true">
          {children}
        </div>
        {/* Lock overlay */}
        <div role="dialog" aria-modal="true" aria-labelledby="lock-title"
          style={{
            position:'fixed',inset:0,zIndex:9999,
            background:'rgba(10,61,98,0.85)',backdropFilter:'blur(8px)',
            display:'flex',alignItems:'center',justifyContent:'center',
            padding:'24px',
          }}>
          <div style={{
            background:'white',borderRadius:'20px',maxWidth:'480px',width:'100%',
            padding:'40px 36px',textAlign:'center',boxShadow:'0 24px 80px rgba(10,61,98,0.3)',
          }}>
            {/* Lock icon */}
            <div style={{
              width:'72px',height:'72px',borderRadius:'50%',
              background:'rgba(229,115,115,0.1)',border:'2px solid rgba(229,115,115,0.3)',
              display:'flex',alignItems:'center',justifyContent:'center',
              margin:'0 auto 20px',fontSize:'32px',
            }}>
              🔒
            </div>

            <h2 id="lock-title" style={{fontSize:'22px',fontWeight:800,color:'#0A3D62',marginBottom:'10px'}}>
              Trial Limit Reached
            </h2>

            {/* Contextual lock reason */}
            <div style={{
              padding:'12px 16px',borderRadius:'10px',marginBottom:'18px',
              background:'rgba(229,115,115,0.06)',border:'1px solid rgba(229,115,115,0.2)',
              fontSize:'14px',color:'#C62828',fontWeight:600,lineHeight:'1.5',
            }}>
              {trial.lockReason || 'Your free trial has ended.'}
            </div>

            <p style={{fontSize:'14px',color:'#696969',lineHeight:'1.6',marginBottom:'24px'}}>
              Your account is now in <b style={{color:'#0A3D62'}}>read-only mode</b>. All interactive features — filters, search, downloads, and report generation — have been disabled.
            </p>

            {/* Progress bar — redirecting */}
            <div style={{marginBottom:'24px'}}>
              <div style={{fontSize:'12px',color:'#696969',marginBottom:'6px'}}>Redirecting to demo request…</div>
              <div style={{height:'4px',borderRadius:'2px',background:'rgba(10,61,98,0.08)',overflow:'hidden'}}>
                <div style={{
                  height:'100%',borderRadius:'2px',background:'#74BB65',
                  animation:'progressFill 2.8s linear forwards',
                }}/>
              </div>
            </div>

            {/* CTAs */}
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              <Link href={trial.demoUrl || '/contact?reason=trial_expired'}
                style={{
                  display:'block',padding:'14px',borderRadius:'10px',fontWeight:800,
                  fontSize:'15px',background:'#74BB65',color:'white',textDecoration:'none',
                  boxShadow:'0 4px 16px rgba(116,187,101,0.3)',
                }}>
                Request Platform Demo →
              </Link>
              <Link href="/pricing"
                style={{
                  display:'block',padding:'11px',borderRadius:'10px',fontWeight:600,
                  fontSize:'14px',border:'1px solid rgba(10,61,98,0.15)',color:'#0A3D62',textDecoration:'none',
                }}>
                View Pricing Plans
              </Link>
            </div>

            <p style={{fontSize:'11px',color:'#696969',marginTop:'16px',lineHeight:'1.5'}}>
              Access to platform pages is restricted until a demo request is submitted or your account is upgraded to Professional.
            </p>
          </div>
        </div>

        <style>{`
          @keyframes progressFill {
            from { width: 0%; }
            to   { width: 100%; }
          }
        `}</style>
      </>
    );
  }

  // Fallback: redirect immediately without flash
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#E2F2DF'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'32px',marginBottom:'12px'}}>🔒</div>
        <div style={{fontSize:'15px',fontWeight:700,color:'#0A3D62'}}>Redirecting…</div>
      </div>
    </div>
  );
}
