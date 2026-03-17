'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const STEPS = [
  { id:'welcome', title:'Welcome to GFM', icon:'🌍',
    content:'You have <strong>3 days</strong> and <strong>5 FIC credits</strong>. Here\'s how to get the most value.',
    cta:'Let\'s go', ctaNext:'dashboard' },
  { id:'signals', title:'Live Signal Feed', icon:'📡',
    content:'Your signals dashboard shows real-time FDI announcements ranked by Signal Confidence Index (SCI). Filter by country, sector, or grade.',
    cta:'View Signals', ctaNext:'/signals' },
  { id:'gfr', title:'GFR Rankings', icon:'🏆',
    content:'Explore GFR rankings for all 215 economies. Each profile shows 6 core dimensions plus 6 proprietary factors: IRES, IMS, SCI, FZII, PAI, GCI.',
    cta:'Explore GFR', ctaNext:'/gfr' },
  { id:'reports', title:'Generate a Report', icon:'📋',
    content:'Use 5 FIC credits to generate a Market Intelligence Brief for any economy and sector. Choose from 10 AI-powered report types.',
    cta:'Generate Report', ctaNext:'/reports' },
  { id:'done', title:'You\'re Ready', icon:'🚀',
    content:'Explore the full platform. Need more FIC credits? Top-up any time. Questions? Email info@fdimonitor.org.',
    cta:'Go to Dashboard', ctaNext:'/dashboard' },
];
export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const s = STEPS[step];
  function next() {
    if (step < STEPS.length-1) setStep(s=>s+1);
    else router.push('/dashboard');
  }
  function goTo(href: string) {
    if (href.startsWith('/')) router.push(href);
    else next();
  }
  return (
    <div className="min-h-screen bg-deep flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="flex justify-center gap-1.5 mb-10">
          {STEPS.map((_,i)=><div key={i} className={`h-1 rounded-full transition-all ${i<=step?'bg-primary':'bg-white/20'}`} style={{width:`${100/STEPS.length}%`}}/>)}
        </div>
        <div className="gfm-card p-10">
          <div className="text-5xl mb-5">{s.icon}</div>
          <h1 className="text-2xl font-extrabold text-deep mb-3">{s.title}</h1>
          <p className="text-slate-500 mb-8 leading-relaxed" dangerouslySetInnerHTML={{__html:s.content}}/>
          <button onClick={()=>goTo(s.ctaNext)} className="w-full gfm-btn-primary py-3.5 rounded-xl text-base mb-3">{s.cta} →</button>
          {step < STEPS.length-1 && (
            <button onClick={()=>router.push('/dashboard')} className="text-xs text-slate-400 hover:text-slate-600">Skip intro</button>
          )}
        </div>
        <div className="text-xs text-white/40 mt-5">{step+1} of {STEPS.length}</div>
      </div>
    </div>
  );
}
