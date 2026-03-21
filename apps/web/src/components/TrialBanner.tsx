'use client';
import Link from 'next/link';
import { useTrial } from '@/lib/trialContext';

export default function TrialBanner() {
  const { tier, daysLeft, reportsUsed, reportsMax, isSoftLocked, isProfessional } = useTrial();

  if (isProfessional) return null;

  if (isSoftLocked) {
    return (
      <div role="alert" style={{
        background:'linear-gradient(90deg,#E57373 0%,#C62828 100%)',
        padding:'8px 24px', display:'flex', alignItems:'center',
        justifyContent:'space-between', gap:'12px', flexWrap:'wrap',
        boxShadow:'0 2px 8px rgba(198,40,40,0.2)',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <span>🔒</span>
          <span style={{fontSize:'12px',fontWeight:700,color:'white'}}>
            Account Read-Only — Your access has ended. Downloads, exports and report generation are disabled.
          </span>
        </div>
        <div style={{display:'flex',gap:'6px'}}>
          <Link href="/contact" style={{padding:'5px 14px',borderRadius:'6px',fontWeight:700,fontSize:'12px',background:'rgba(10,22,40,0.8)',color:'#C62828',textDecoration:'none'}}>
            Request Demo →
          </Link>
          <Link href="/pricing" style={{padding:'5px 12px',borderRadius:'6px',fontWeight:600,fontSize:'11px',background:'rgba(255,255,255,0.15)',color:'white',textDecoration:'none',border:'1px solid rgba(255,255,255,0.3)'}}>
            Pricing
          </Link>
        </div>
      </div>
    );
  }

  if (tier === 'free_trial') {
    const reportsLeft = reportsMax - reportsUsed;
    return (
      <div style={{
        background:'linear-gradient(90deg,#0A3D62 0%,#1B6CA8 100%)',
        padding:'7px 24px', display:'flex', alignItems:'center',
        justifyContent:'space-between', gap:'12px', flexWrap:'wrap',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#74BB65',animation:'pulse 2s infinite',flexShrink:0}}/>
          <span style={{fontSize:'12px',fontWeight:600,color:'rgba(226,242,223,0.9)'}}>
            <b style={{color:'#74BB65'}}>Access</b> — {daysLeft} day{daysLeft!==1?'s':''} remaining · {reportsLeft} of {reportsMax} report{reportsMax!==1?'s':''} available
          </span>
        </div>
        <Link href="/contact" style={{
          padding:'5px 14px', borderRadius:'6px', fontWeight:700, fontSize:'12px',
          background:'#74BB65', color:'white', textDecoration:'none',
          flexShrink:0,
        }}>
          Request Full Access →
        </Link>
      </div>
    );
  }

  return null;
}
