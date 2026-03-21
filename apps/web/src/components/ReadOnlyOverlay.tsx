'use client';
import { useTrial } from '@/lib/trialContext';
import Link from 'next/link';
import type { ReactNode } from 'react';

type Feature = 'download' | 'generate_report' | 'export' | 'filter' | 'search' | 'api' | 'view';

interface Props {
  children:     ReactNode;
  feature?:     Feature;
  showUpgrade?: boolean;
}

export default function ReadOnlyOverlay({ children, feature = 'download', showUpgrade = true }: Props) {
  const trial = useTrial();

  const isBlocked = (() => {
    if (trial.isProfessional) return false;
    if (trial.isSoftLocked)   return true;   // ALL features blocked when soft-locked
    // Active trial restrictions
    if (feature === 'download' || feature === 'export' || feature === 'api')   return true;
    if (feature === 'generate_report' && !trial.canGenerateReport)              return true;
    return false;
  })();

  if (!isBlocked) return <>{children}</>;

  const LABELS: Record<Feature, string> = {
    download:        'Download unavailable on access',
    generate_report: trial.isSoftLocked ? 'Report generation disabled' : `${trial.reportsLeft} report${trial.reportsLeft!==1?'s':''} remaining`,
    export:          'Data export requires Professional',
    filter:          'Filtering disabled — trial expired',
    search:          'Search disabled — trial expired',
    api:             'API access requires Professional',
    view:            'Full view requires Professional',
  };

  return (
    <div style={{position:'relative',cursor:'not-allowed'}}>
      <div style={{opacity:0.3,pointerEvents:'none',userSelect:'none'}} aria-hidden="true">
        {children}
      </div>
      {showUpgrade && (
        <div style={{
          position:'absolute',inset:0,display:'flex',flexDirection:'column',
          alignItems:'center',justifyContent:'center',
          background:'rgba(226,242,223,0.92)',backdropFilter:'blur(3px)',
          borderRadius:'inherit',gap:'8px',padding:'16px',
        }}>
          <div style={{fontSize:'22px'}}>🔒</div>
          <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',textAlign:'center'}}>{LABELS[feature]}</div>
          {trial.isSoftLocked && trial.lockReason && (
            <div style={{fontSize:'11px',color:'#696969',textAlign:'center',maxWidth:'220px',lineHeight:'1.4'}}>{trial.lockReason}</div>
          )}
          <div style={{display:'flex',gap:'6px',marginTop:'4px'}}>
            <Link href={trial.demoUrl || '/contact?reason=trial_expired'}
              style={{padding:'6px 14px',borderRadius:'6px',background:'#74BB65',color:'white',textDecoration:'none',fontSize:'12px',fontWeight:700}}>
              Request Demo
            </Link>
            <Link href="/pricing"
              style={{padding:'6px 12px',borderRadius:'6px',border:'1px solid rgba(10,61,98,0.2)',color:'#0A3D62',textDecoration:'none',fontSize:'12px',fontWeight:600}}>
              Pricing
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
