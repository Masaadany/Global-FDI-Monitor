import Link from 'next/link';
export const metadata = { title: 'Privacy Policy — Global FDI Monitor' };
const SECTIONS = [
  {t:'1. Who We Are',c:'Global FDI Monitor is operated by Forecasta Ltd ("Forecasta", "we", "us"), headquartered in Dubai, UAE. Contact: privacy@fdimonitor.org'},
  {t:'2. Data We Collect',c:'Account data: name, work email, organisation, country, role. Usage data: pages visited, features used, API calls. Payment data: processed by Stripe — we never store card numbers. Technical data: IP address, browser type, cookie identifiers. We do NOT collect sensitive personal categories.'},
  {t:'3. How We Use Your Data',c:'To provide and personalise the platform. To authenticate users and maintain session security. To process payments via Stripe. To send transactional emails (welcome, reset, FIC alerts). To send the weekly newsletter if subscribed (opt-out anytime). We NEVER sell personal data. We NEVER use data for advertising.'},
  {t:'4. Cookies',c:'Essential: JWT authentication tokens, session identifiers, user preferences. Analytics: privacy-respecting usage analytics (can be declined). We do NOT use advertising, tracking, or retargeting cookies.'},
  {t:'5. Data Sharing',c:'Stripe: payment processing. Azure (Microsoft): cloud hosting in UAE North — data does not leave the region. Resend: transactional email. No data brokers, no advertising networks.'},
  {t:'6. Data Retention',c:'Account data: duration of subscription plus 90 days. Usage logs: 30 days rolling. Payment records: 7 years (legal). Deleted accounts: all personal data deleted within 30 days of request.'},
  {t:'7. Security',c:'TLS 1.3 in transit · AES-256 at rest · JWT tokens (1-hour expiry) · bcrypt password hashing · Azure UAE North SOC 2 compliant · Annual third-party penetration testing.'},
  {t:'8. Your Rights',c:'Under GDPR and UAE data protection law: access, correct, delete, export, and object to processing. Email privacy@fdimonitor.org — we respond within 72 hours.'},
  {t:'9. Contact',c:'Data Controller: Forecasta Ltd\nEmail: privacy@fdimonitor.org\nAddress: Dubai, UAE\nResponse: Within 72 hours'},
];
export default function PrivacyPage() {
  return(
    <div className="min-h-screen bg-surface">
      <section className="gfm-hero text-white px-6 py-12"><div className="max-w-3xl mx-auto relative z-10"><h1 className="text-4xl font-extrabold mb-2">Privacy Policy</h1><p className="text-blue-300 text-sm">Last updated: March 2026 · Effective: March 1, 2026</p></div></section>
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-700"><strong>Summary:</strong> We collect only what we need. We never sell your data. We never advertise to you. Hosted on Azure UAE North. Delete your account any time.</div>
        {SECTIONS.map(s=><div key={s.t}><h2 className="text-lg font-extrabold text-deep mb-2">{s.t}</h2><p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">{s.c}</p></div>)}
        <div className="pt-6 border-t border-slate-100 flex gap-6"><Link href="/contact" className="text-primary font-bold hover:underline text-sm">Contact us →</Link><Link href="/terms" className="text-primary font-bold hover:underline text-sm">Terms of Service →</Link></div>
      </div>
    </div>
  );
}
