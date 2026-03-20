import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — FDI Monitor',
  description: 'FDI Monitor Terms of Service. Subscriptions, reports, API, intelligence credits, watermarks, and governing law (DIFC Courts).',
};

const SECTIONS = [
  { n:'1',  t:'Acceptance',
    b:'By accessing or using FDI Monitor ("Platform"), you agree to these Terms. If accessing on behalf of an organisation, you confirm authority to bind that organisation. Continued use constitutes acceptance of any updates notified under Section 12.' },
  { n:'2',  t:'Service Description',
    b:'FDI Monitor provides: (a) real-time FDI signals graded PLATINUM to BRONZE via the Signal Confidence Index (SCI); (b) Global Future Readiness (GFR) rankings for 215 economies updated quarterly; (c) AI-powered intelligence reports in PDF format only; (d) foresight and scenario planning tools; (e) REST API with WebSocket live feed; (f) intelligence credits for report generation and data exports.' },
  { n:'3',  t:'Free Trial',
    b:'A 3-day free trial provides read-only dashboard access: signals, GFR rankings, foresight tools, benchmarking, and corridor intelligence. Report generation, data downloads, and API access are disabled during the trial. No credit card is required. Trial access is non-transferable and limited to one per registered email domain.' },
  { n:'4',  t:'Professional Subscription',
    b:'Professional tier: $799/month or $679/month (annual billing, save 15%). Includes: unlimited PDF report generation; watermarked data exports; API access at 500 requests/minute; 200 intelligence credits/month; 3 user seats. Subscriptions auto-renew. Cancel before the billing period end to prevent renewal. Annual subscriptions are non-refundable after the 14-day cooling-off period.' },
  { n:'5',  t:'Enterprise Tier',
    b:'Enterprise pricing is custom and contracted separately. Enterprise clients receive: unlimited user seats; custom API SLA and rate limits; white-label option; dedicated account team; custom training and onboarding; and DIFC-LCIA contractual framework. Contact contact@fdimonitor.org for enterprise enquiries.' },
  { n:'6',  t:'Intelligence Credits',
    b:'Credits are consumed upon generating reports or exporting data. Costs: MIB=5 · ICR=18 · FCGR=25 · PMP=30 · Custom=35 credits. Professional subscribers receive 200 credits/month included. Additional credits are available for purchase. Credits do not expire. Credits are non-refundable once consumed to generate a report.' },
  { n:'7',  t:'Report Watermarks',
    b:'All generated PDF reports contain a dynamic watermark: your registered email, UTC generation timestamp, IP address, and a unique reference code committed to SHA-256. Reports are licensed for your internal business use only. Redistribution, resale, or publication without written consent is prohibited. Generating a report constitutes acceptance of this watermark policy and its audit trail implications.' },
  { n:'8',  t:'API Terms',
    b:'Professional: 500 requests/minute. Enterprise: contracted SLA. Rate limit headers accompany every response. Prohibited: bulk automated harvesting beyond reasonable business use; reverse engineering; building competing intelligence products using API data; sharing API keys with third parties. Violations may result in immediate suspension without refund.' },
  { n:'9',  t:'Intellectual Property',
    b:'All platform content, the GFR formula and dimensions, the SCI formula, the signal grading system, agent logic, and software are the intellectual property of FDI Monitor. You receive a limited, non-exclusive, non-transferable licence for internal business use. No right to reproduce, distribute, or create derivative works is granted without prior written consent.' },
  { n:'10', t:'Data Accuracy Disclaimer',
    b:'FDI Monitor applies Z3 formal verification, SHA-256 provenance, and multi-source cross-validation. However, signals are intelligence indicators — not confirmed corporate announcements. Forecasts are probabilistic models — not guarantees. GFR scores are composite indices — not investment ratings. Nothing on this Platform constitutes investment advice. You accept full responsibility for all decisions made using Platform data.' },
  { n:'11', t:'Prohibited Uses',
    b:'You may not: use the Platform for unlawful purposes; circumvent trial restrictions or paywall controls; submit false registration information; abuse API rate limits or automated scraping; reverse engineer the Platform software or agent logic; or use Platform data to build competing intelligence products.' },
  { n:'12', t:'Limitation of Liability',
    b:'Liability is capped at fees paid in the preceding 12 months. FDI Monitor is not liable for: indirect, incidental, or consequential damages; losses from investment decisions based on Platform data; service interruptions beyond our SLA; or data loss. Some jurisdictions do not permit these limitations — where applicable, liability is capped to the maximum extent permitted.' },
  { n:'13', t:'Governing Law & Disputes',
    b:'These Terms are governed by DIFC law. Disputes shall be submitted to the exclusive jurisdiction of the DIFC Courts. Disputes not resolved by negotiation within 30 days will be referred to arbitration under DIFC-LCIA Arbitration Rules. The seat of arbitration is DIFC, Dubai, UAE. The language of arbitration is English.' },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-10">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#74BB65'}}>Legal</div>
          <h1 className="text-3xl font-extrabold mb-1" style={{color:'#0A3D62'}}>Terms of Service</h1>
          <p className="text-sm" style={{color:'#696969'}}>Effective: 1 January 2026 · FDI Monitor · DIFC, Dubai, UAE</p>
          <div className="flex gap-4 mt-3 text-xs" style={{color:'#696969'}}>
            <span>13 sections</span><span>·</span><span>DIFC Courts governing</span><span>·</span><span>DIFC-LCIA arbitration</span>
          </div>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-3">
        {SECTIONS.map(s=>(
          <div key={s.n} className="gfm-card p-5">
            <h2 className="font-extrabold text-sm mb-2" style={{color:'#74BB65'}}>{s.n}. {s.t}</h2>
            <p className="text-sm leading-relaxed" style={{color:'#696969'}}>{s.b}</p>
          </div>
        ))}
        <div className="pt-3 flex gap-4 text-sm flex-wrap" style={{color:'#696969'}}>
          <span>Legal: <span style={{color:'#74BB65'}}>legal@fdimonitor.org</span></span>
          <span>·</span>
          <Link href="/privacy" style={{color:'#74BB65'}}>Privacy Policy →</Link>
        </div>
      </div>
    </div>
  );
}
