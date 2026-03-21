'use client';
import { useTrial } from '@/lib/trialContext';
import Link from 'next/link';

export default function SoftLockBanner() {
  const { isSoftLocked, lockReason, daysLeft, reportsUsed, reportsMax } = useTrial();

  if (!isSoftLocked) return null;

  return (
    <div role="alert" aria-live="assertive" style={{
      position:'sticky', top:'112px', zIndex:45,
      background:'linear-gradient(90deg,#E57373 0%,#C62828 100%)',
      padding:'10px 24px',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      gap:'12px', flexWrap:'wrap',
      boxShadow:'0 2px 12px rgba(198,40,40,0.25)',
    }}>
      <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
        <span style={{fontSize:'18px'}}>🔒</span>
        <div>
          <div style={{fontWeight:800,color:'white',fontSize:'13px'}}>Account Read-Only</div>
          <div style={{color:'rgba(255,255,255,0.85)',fontSize:'12px',marginTop:'1px'}}>
            {lockReason || 'Your access has ended.'} Upgrade to continue generating reports and exporting data.
          </div>
        </div>
      </div>
      <div style={{display:'flex',gap:'8px',flexShrink:0}}>
        <Link href="/contact" style={{
          padding:'7px 18px', borderRadius:'7px', fontWeight:700, fontSize:'13px',
          background:'rgba(10,22,40,0.8)', color:'#C62828', textDecoration:'none',
          border:'none', cursor:'pointer',
        }}>
          Request Demo →
        </Link>
        <Link href="/pricing" style={{
          padding:'7px 14px', borderRadius:'7px', fontWeight:600, fontSize:'12px',
          background:'rgba(255,255,255,0.15)', color:'white', textDecoration:'none',
          border:'1px solid rgba(255,255,255,0.3)',
        }}>
          View Plans
        </Link>
      </div>
    </div>
  );
}
