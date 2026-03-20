'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';

const FAQ_SECTIONS = [
  { section:'Getting Started', icon:'🚀', items:[
    { q:'What is FDI Monitor?',
      a:'FDI Monitor is a global investment intelligence platform built for investment promotion agencies, institutional investors, sovereign wealth funds, and strategy consultants. It provides real-time FDI signals, Global Future Readiness (GFR) rankings for 215 economies, AI-powered reports, foresight to 2050, and a full-featured analytics dashboard.' },
    { q:'How does the 3-day free trial work?',
      a:'Create an account with no credit card required. You get full read-only dashboard access: 218+ live signals, GFR rankings for all 215 economies, foresight and scenario tools, company profiles, and corridor intelligence. Report generation, data downloads, and API access require a Professional subscription.' },
    { q:'What does "read-only" mean in the trial?',
      a:'During the trial you can view all intelligence, filter signals, explore country profiles, run scenario planning, and navigate the full dashboard. You cannot generate PDF reports, export data to CSV, or make API calls. Upgrading immediately unlocks all capabilities.' },
    { q:'What happens when my trial expires?',
      a:'Your account remains active but access is restricted to the registration page with an upgrade prompt. No data is deleted. Upgrade any time to instantly restore full access.' },
  ]},
  { section:'Signals & Intelligence', icon:'📡', items:[
    { q:'What is a FDI Signal?',
      a:'An FDI signal is a scored, verified indicator of foreign direct investment intent by a specific company into a specific economy. Signals are graded PLATINUM, GOLD, SILVER, or BRONZE based on the Signal Confidence Index (SCI): SCI = (Source_Weight×0.30) + (Cross_Validation×0.25) + (Recency×0.25) + (Specificity×0.20).' },
    { q:'What is the Signal Confidence Index (SCI)?',
      a:'The SCI is a composite 0–100 score. PLATINUM signals score ≥90, GOLD 75–89, SILVER 60–74, BRONZE 40–59. The score reflects source tier weight (T1 official bodies = 1.0, T5 media = 0.65), cross-validation (minimum 2 independent sources), recency (90-day half-life decay), and specificity (company + amount + location = maximum score).' },
    { q:'What is Z3 verification?',
      a:'Z3 is a formal theorem prover developed by Microsoft Research. We apply Z3 to check 14 logical constraint sets per signal — including geographic consistency, sector alignment, and amount plausibility. Only signals passing all Z3 constraints receive a SHA-256 provenance hash and enter the scored feed.' },
    { q:'How often are signals updated?',
      a:'The signal feed refreshes every 15 minutes from T1–T3 sources, and every 2 hours from T4–T5 sources. WebSocket connections deliver new signals to live dashboard users within 2 seconds of scoring completion.' },
  ]},
  { section:'GFR Rankings', icon:'🏆', items:[
    { q:'What is the Global Future Readiness (GFR) ranking?',
      a:'The GFR is a quarterly ranking of 215 economies across 6 weighted dimensions: Macro-Economic Resilience (20%), Policy & Governance (18%), Digital Foundations (15%), Human Capital (15%), Infrastructure Quality (15%), and Sustainability & ESG (17%). Scores range from 0–100. FRONTIER tier requires ≥75.' },
    { q:'How frequently is the GFR updated?',
      a:'The GFR is updated quarterly — Q1 (March), Q2 (June), Q3 (September), Q4 (December). Intra-quarter updates occur for significant policy changes, sovereign rating changes, or major FDI events. All updates are Z3 verified and SHA-256 stamped.' },
    { q:'What data sources feed the GFR?',
      a:'The GFR draws on IMF, World Bank, UNCTAD, OECD, UN Comtrade, national central banks, the World Economic Forum, ITU, and 40+ additional official sources. All sources are classified T1–T3 and carry source-weight scores that propagate to the composite ranking.' },
  ]},
  { section:'Reports & Credits', icon:'📋', items:[
    { q:'Why are all reports PDF only?',
      a:'PDF is the only export format to enable dynamic watermarking. Every generated report contains a watermark with your registered email, generation timestamp (UTC), IP address, and a unique reference code committed to SHA-256. This creates an immutable audit trail and deters unauthorised redistribution.' },
    { q:'What is in each report type?',
      a:'There are 10 report types: Market Intelligence Brief (5–8 pages), Sector & Economy Report (12–15pp), Investment Climate Report (15–20pp), Targeted Investment Report (18–22pp), Country Economic Growth Profile (12–15pp), Regional Quarterly Brief (10–14pp), Signal Package Brief (8–10pp), Sector Opportunity Report (15–18pp), Flagship GFR Report (30–40pp), and Mission Planning Dossier (35–45pp).' },
    { q:'How do Intelligence Credits work?',
      a:'Credits are consumed when generating reports or exporting data. Professional subscribers receive 200 credits/month (included). Additional credits can be purchased via the Credits page. Credits never expire. Report costs range from 3 credits (CSV export) to 35 credits (custom report).' },
  ]},
  { section:'Technical & API', icon:'🔑', items:[
    { q:'What authentication method does the API use?',
      a:'The API uses JWT Bearer tokens with a 15-minute expiry. Tokens are obtained via POST /api/v1/auth/login and refreshed via PUT /api/v1/auth/refresh. Include the token in every request: Authorization: Bearer <token>. API keys can also be generated in Settings → API.' },
    { q:'What is the API rate limit?',
      a:'Professional subscribers: 500 requests/minute. Enterprise: custom SLA agreed by contract. Free trial users do not have API access. Rate limit headers (X-RateLimit-Remaining, X-RateLimit-Reset) are returned with every response.' },
    { q:'Does the platform have a WebSocket feed?',
      a:'Yes. Connect to wss://api.fdimonitor.org/ws with ?token=Bearer_JWT to receive real-time signal events. The WebSocket stream delivers new PLATINUM and GOLD signals within 2 seconds of scoring. Professional subscription required.' },
  ]},
];

export default function FAQPage() {
  const [open, setOpen] = useState<string|null>(null);
  const toggle = (k:string) => setOpen(o=>o===k?null:k);

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-10">
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <h1 className="text-3xl font-extrabold mb-2" style={{color:'#0A3D62'}}>Frequently Asked Questions</h1>
          <p className="text-sm" style={{color:'#696969'}}>Answers to common questions about the platform, signals, GFR rankings, reports, and the API.</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-5 space-y-6">
        {FAQ_SECTIONS.map(sec=>(
          <div key={sec.section}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{sec.icon}</span>
              <h2 className="font-extrabold text-sm uppercase tracking-widest" style={{color:'#74BB65'}}>{sec.section}</h2>
            </div>
            <div className="space-y-2">
              {sec.items.map((item,i)=>{
                const k = `${sec.section}-${i}`;
                return (
                  <div key={k} className="gfm-card overflow-hidden">
                    <button onClick={()=>toggle(k)} className="w-full text-left px-5 py-4 flex items-center justify-between gap-3">
                      <span className="font-semibold text-sm" style={{color:'#0A3D62'}}>{item.q}</span>
                      <span className="flex-shrink-0 text-lg transition-transform" style={{color:'#74BB65',transform:open===k?'rotate(180deg)':''}}>▾</span>
                    </button>
                    {open === k && (
                      <div className="px-5 pb-4 text-sm leading-relaxed border-t" style={{color:'#696969',borderTopColor:'rgba(10,61,98,0.1)'}}>
                        <div className="pt-3">{item.a}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div className="text-center pt-2">
          <p className="text-sm mb-3" style={{color:'#696969'}}>Still have questions?</p>
          <Link href="/contact" className="gfm-btn-primary px-8 py-2.5 text-sm">Contact Support →</Link>
        </div>
      </div>
    </div>
  );
}
