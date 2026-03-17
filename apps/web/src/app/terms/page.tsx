import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Terms of Service | GFM', description: 'Terms governing access to the Global FDI Monitor platform.' };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-12">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Legal</div>
          <h1 className="text-4xl font-extrabold">Terms of Service</h1>
          <p className="text-white/60 mt-2">Effective: 1 January 2026 · Version 3.0</p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {[
          ['1. Acceptance', 'By accessing or using the Global FDI Monitor platform ("GFM"), you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform. These Terms apply to all users, including Free Trial, Professional, and Enterprise subscribers.'],
          ['2. Platform Access', 'Access is granted via subscription. Free Trial accounts receive 5 FIC (Forecasta Intelligence Credits) and expire after 3 days. Subscription plans are billed monthly or annually as selected. You are responsible for maintaining the security of your account credentials.'],
          ['3. FIC Credits', 'FIC credits are consumed when generating intelligence reports, unlocking signals, or executing analysis. Credits are non-refundable once consumed. Top-up packages are available at the rates listed on our pricing page. Unused credits roll over for Professional subscribers.'],
          ['4. Data Usage', 'GFM intelligence data is licensed for your internal business use only. Redistribution, resale, or republication of platform data, reports, or signals without written consent from Forecasta Ltd is strictly prohibited. You may export data for personal internal analysis.'],
          ['5. Intellectual Property', 'All GFR scores, proprietary factors (IRES, IMS, SCI, FZII, PAI, GCI), methodology, and platform design are the exclusive intellectual property of Forecasta Ltd. The GFM brand, logo, and product names are registered trademarks.'],
          ['6. Limitations', 'GFM provides intelligence, analysis, and data for informational purposes. Nothing on the platform constitutes investment advice, legal advice, or a recommendation to buy, sell, or hold any investment. Users are solely responsible for their investment decisions.'],
          ['7. Liability', 'Forecasta Ltd is not liable for any loss, damage, or consequential harm arising from use of platform data. Our maximum liability in any case is limited to the subscription fees paid in the preceding 3 months.'],
          ['8. Termination', 'We may suspend or terminate access for breach of these Terms, non-payment, or misuse of the platform. Subscribers may cancel at any time; cancellation takes effect at the end of the current billing period.'],
          ['9. Governing Law', 'These Terms are governed by the laws of the United Arab Emirates (DIFC jurisdiction). Disputes shall be subject to DIFC Courts arbitration.'],
          ['10. Contact', 'Forecasta Ltd · DIFC, Dubai, UAE · legal@fdimonitor.org · +971 50 286 7070'],
        ].map(([title, body]) => (
          <div key={String(title)} className="gfm-card p-6">
            <h2 className="font-extrabold text-deep text-lg mb-2">{title}</h2>
            <p className="text-slate-600 text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
