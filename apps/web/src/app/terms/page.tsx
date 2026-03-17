import Link from 'next/link';
export const metadata = { title: 'Terms of Service — Global FDI Monitor', description: 'Terms and conditions for using Global FDI Monitor.' };
export default function TermsPage() {
  const SECTIONS = [
    { title: '1. Acceptance of Terms', content: 'By accessing Global FDI Monitor ("GFM", "the Platform"), you agree to these Terms of Service and our Privacy Policy. If you do not agree, do not use the Platform. These terms form a binding agreement between you and Forecasta Ltd.' },
    { title: '2. Platform Licence', content: 'Forecasta grants you a non-exclusive, non-transferable, revocable licence to access and use the Platform strictly in accordance with your subscription tier. You may not: (a) share account credentials; (b) resell, redistribute, or white-label Platform outputs without written consent; (c) reverse-engineer our models, algorithms, or scoring systems; (d) use automated scraping or crawling tools against the Platform.' },
    { title: '3. Subscription Tiers', content: 'Free Trial: 3-day access with 5 FIC credits, no credit card required. Professional: Monthly or annual subscription, 4,800 FIC credits/year, 3 seats. Enterprise: Annual subscription, 60,000 FIC credits/year, 10 seats, SLA. Seat limits apply per organisation. Sharing accounts across organisations is prohibited.' },
    { title: '4. Forecasta Intelligence Credits (FIC)', content: 'FIC credits are the Platform\'s intelligence currency. They are consumed when accessing Platinum signals, generating custom reports, or running mission plans. FIC credits are: Non-refundable once consumed. Valid for 12 months from allocation. Non-transferable between organisations. Annual subscription FIC are allocated at subscription start. Top-up packs are available at any time.' },
    { title: '5. Payment and Billing', content: 'All payments are processed by Stripe. Subscriptions auto-renew unless cancelled at least 7 days before the renewal date. Annual plans: Full refund within 14 days if fewer than 3 reports generated. Monthly plans: No refund for the current billing period after 7 days. FIC top-ups: Non-refundable. Price changes: 30 days notice via email.' },
    { title: '6. Data and Intelligence', content: 'All intelligence, signals, GFR rankings, forecasts, and reports are for informational purposes only. Nothing on the Platform constitutes financial, investment, legal, or tax advice. Forecasta does not guarantee the accuracy, completeness, or timeliness of any data. Users must independently verify information before making investment decisions.' },
    { title: '7. Intellectual Property', content: 'All Platform content — including GFR methodology, signal detection models, scoring algorithms, reports, and branding — is the intellectual property of Forecasta Ltd. You may use outputs for internal business purposes within your organisation. You may not reproduce, publish, or distribute outputs commercially without written consent.' },
    { title: '8. Prohibited Use', content: 'You may not use the Platform to: Process data relating to sanctioned entities or jurisdictions. Facilitate money laundering or financial crime. Create competing intelligence products. Harass, abuse, or harm other users. Circumvent security measures. Upload malicious code. Any breach results in immediate account suspension without refund.' },
    { title: '9. Uptime and Service Levels', content: 'Enterprise customers: 99.9% uptime SLA, measured monthly, excluding scheduled maintenance (notified 48h in advance). Professional customers: Best-effort uptime, typically >99.5%. Free Trial: No uptime guarantee. Compensation for SLA breaches (Enterprise only): Credit equal to 10x the downtime percentage of monthly fee.' },
    { title: '10. Limitation of Liability', content: 'To the maximum extent permitted by law: Forecasta\'s total liability is limited to fees paid in the 12 months preceding the claim. We are not liable for indirect, consequential, or punitive damages. We are not liable for investment decisions made using Platform intelligence. We are not liable for third-party data errors.' },
    { title: '11. Indemnification', content: 'You agree to indemnify Forecasta against claims arising from: Your violation of these Terms. Your misuse of Platform intelligence. Your breach of applicable law. Your violation of third-party rights.' },
    { title: '12. Termination', content: 'Forecasta may terminate your account immediately for material breach of these Terms. You may cancel your subscription at any time via account settings. On termination, your access ends immediately. Your data is retained for 90 days and then deleted on request.' },
    { title: '13. Governing Law and Disputes', content: 'These Terms are governed by the laws of the United Arab Emirates (Dubai International Financial Centre). Disputes shall be subject to the exclusive jurisdiction of the DIFC Courts. For claims under $10,000, we offer non-binding mediation before court proceedings.' },
    { title: '14. Changes to Terms', content: 'We may update these Terms. Material changes will be communicated by email at least 30 days in advance for paid subscribers. Continued use of the Platform after the effective date constitutes acceptance of the revised Terms.' },
  ];
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0A2540] text-white px-6 py-14">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-black mb-2">Terms of Service</h1>
          <p className="text-blue-300">Last updated: March 2026 · Effective: March 1, 2026</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-700">
          <strong>Key points:</strong> Free trial is 3 days with 5 FIC. FIC credits are non-refundable once used. Annual refund available within 14 days. Platform intelligence is not financial advice. Governed by DIFC Courts, Dubai.
        </div>
        {SECTIONS.map(s => (
          <div key={s.title}>
            <h2 className="text-xl font-black text-[#0A2540] mb-3">{s.title}</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{s.content}</p>
          </div>
        ))}
        <div className="pt-6 border-t border-slate-100 flex gap-6">
          <Link href="/privacy" className="text-blue-600 font-bold hover:underline">Privacy Policy →</Link>
          <Link href="/contact" className="text-blue-600 font-bold hover:underline">Contact us →</Link>
        </div>
      </div>
    </div>
  );
}
