import Link from 'next/link';
export const metadata = { title: 'Terms of Service — Global FDI Monitor' };
const SECTIONS = [
  {t:'1. Acceptance',c:'By accessing Global FDI Monitor, you agree to these Terms and our Privacy Policy. These form a binding agreement between you and Forecasta Ltd.'},
  {t:'2. Platform Licence',c:'Forecasta grants a non-exclusive, non-transferable, revocable licence to use the Platform per your subscription tier. You may not: share credentials, resell outputs without consent, reverse-engineer models, or use automated scraping.'},
  {t:'3. Subscription Tiers',c:'Free Trial: 3 days, 5 FIC, no card. Professional: monthly or annual, 4,800 FIC/year, 3 seats. Enterprise: annual, custom FIC, 10+ seats. Seat limits apply per organisation.'},
  {t:'4. FIC Credits',c:'Forecasta Intelligence Credits are non-refundable once consumed, valid 12 months from allocation, and non-transferable between organisations. Annual plan FIC allocated at subscription start. Top-ups available any time.'},
  {t:'5. Payment & Billing',c:'All payments via Stripe. Subscriptions auto-renew unless cancelled 7 days before renewal. Annual plans: full refund within 14 days if fewer than 3 reports generated. Monthly: no refund after 7 days. FIC top-ups: non-refundable.'},
  {t:'6. Data Disclaimer',c:'All intelligence, signals, GFR rankings, forecasts, and reports are for informational purposes only. Nothing constitutes financial, investment, legal, or tax advice. Always independently verify before making investment decisions.'},
  {t:'7. Intellectual Property',c:'All Platform content — GFR methodology, signal models, scoring algorithms, reports, and branding — is the intellectual property of Forecasta Ltd. Outputs may be used for internal business purposes only.'},
  {t:'8. Prohibited Use',c:'You may not use the Platform to process sanctioned entities, facilitate financial crime, create competing products, or circumvent security measures. Breach results in immediate account suspension without refund.'},
  {t:'9. Uptime SLA',c:'Enterprise: 99.9% monthly uptime, compensation 10× downtime percentage. Professional: best-effort, typically >99.5%. Free Trial: no guarantee.'},
  {t:'10. Liability',c:'Forecasta\'s total liability is limited to fees paid in the 12 months preceding the claim. We are not liable for indirect damages, investment decisions, or third-party data errors.'},
  {t:'11. Governing Law',c:'These Terms are governed by the laws of the UAE (Dubai International Financial Centre). Disputes subject to exclusive jurisdiction of the DIFC Courts.'},
];
export default function TermsPage() {
  return(
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-12"><div className="max-w-3xl mx-auto relative z-10"><h1 className="text-4xl font-extrabold mb-2">Terms of Service</h1><p className="text-blue-300 text-sm">Last updated: March 2026 · Effective: March 1, 2026</p></div></section>
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-700"><strong>Key points:</strong> Free trial is 3 days with 5 FIC. FIC non-refundable once used. Platform intelligence is not financial advice. Governed by DIFC Courts, Dubai.</div>
        {SECTIONS.map(s=><div key={s.t}><h2 className="text-lg font-extrabold text-deep mb-2">{s.t}</h2><p className="text-slate-600 leading-relaxed text-sm">{s.c}</p></div>)}
        <div className="pt-6 border-t border-slate-100 flex gap-6"><Link href="/privacy" className="text-primary font-bold hover:underline text-sm">Privacy Policy →</Link><Link href="/contact" className="text-primary font-bold hover:underline text-sm">Contact us →</Link></div>
      </div>
    </div>
  );
}
