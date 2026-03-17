import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy | GFM', description: 'How Global FDI Monitor collects, uses, and protects your data.' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-12">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Legal</div>
          <h1 className="text-4xl font-extrabold">Privacy Policy</h1>
          <p className="text-white/60 mt-2">Effective: 1 January 2026 · GDPR & UAE PDPL Compliant</p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {[
          ['Data We Collect', 'We collect: account information (name, email, organisation), usage data (pages visited, reports generated, signals viewed), billing information (processed via Stripe — we never store card details), and voluntary feedback. We do not collect sensitive personal data.'],
          ['How We Use Data', 'Your data is used to: provide platform access, generate personalised intelligence, process billing, send service emails (report notifications, FIC low balance), and improve the platform. We never sell or share your data with advertisers.'],
          ['Cookies', 'We use essential cookies (authentication, session) and optional analytics cookies. You can control cookie preferences via the cookie consent banner. No advertising or tracking cookies are used. See our Cookie Policy for full details.'],
          ['Data Retention', 'Account data is retained while your subscription is active and for 90 days after cancellation. Generated reports are retained for 12 months. Usage logs are anonymised after 30 days. You may request deletion at any time.'],
          ['Your Rights (GDPR)', 'You have the right to: access your data, correct inaccuracies, delete your account, export your data (CSV/JSON), restrict processing, and object to processing. Submit requests to privacy@fdimonitor.org.'],
          ['Security', 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We use Azure PostgreSQL and Redis in UAE North with strict access controls. Regular security audits are conducted. We maintain SOC 2 Type II compliance.'],
          ['Third Parties', 'We use: Stripe (billing), Resend (email), Azure (infrastructure). Each is bound by data processing agreements. We do not use Google Analytics, Facebook Pixel, or any advertising networks.'],
          ['Contact DPO', 'Data Protection Officer: Forecasta Ltd · DIFC, Dubai, UAE · privacy@fdimonitor.org · +971 50 286 7070'],
        ].map(([title, body]) => (
          <div key={String(title)} className="gfm-card p-6">
            <h2 className="font-extrabold text-deep text-lg mb-2">{title}</h2>
            <p className="text-slate-600 text-sm leading-relaxed">{body}</p>
          </div>
        ))}
        <div className="gfm-card p-5 bg-blue-50 border-blue-200">
          <div className="text-sm font-bold text-primary mb-1">🍪 Cookie Preferences</div>
          <p className="text-sm text-slate-600">You can update your cookie preferences at any time using the cookie consent banner at the bottom of any page.</p>
        </div>
      </div>
    </div>
  );
}
