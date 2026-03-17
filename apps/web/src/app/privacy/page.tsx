import Link from 'next/link';
export const metadata = { title: 'Privacy Policy — Global FDI Monitor', description: 'How Global FDI Monitor collects, uses, and protects your data.' };
export default function PrivacyPage() {
  const SECTIONS = [
    { title: '1. Who We Are', content: 'Global FDI Monitor is operated by Forecasta Ltd ("Forecasta", "we", "us"). We are headquartered in the United Arab Emirates and serve investment professionals globally. Contact: privacy@fdimonitor.org' },
    { title: '2. Data We Collect', content: 'Account data: name, work email, organisation name and type, country, role. Usage data: pages visited, features used, session duration, API calls. Payment data: processed entirely by Stripe — we never store card numbers. Technical data: IP address, browser type, device type, cookie identifiers. We do NOT collect or store sensitive personal categories (health, ethnicity, political views).' },
    { title: '3. How We Use Your Data', content: 'To provide and personalise the platform. To authenticate users and maintain session security. To process payments and manage subscriptions via Stripe. To send transactional emails (welcome, password reset, FIC balance alerts). To send the weekly newsletter if you subscribe (opt-out at any time). To improve platform performance through aggregated analytics. We NEVER sell personal data to third parties. We NEVER use personal data for advertising.' },
    { title: '4. Data Sources We Aggregate', content: 'GFM aggregates publicly available economic and investment data from international organisations including IMF, World Bank, UNCTAD, OECD, IEA, ILO, and others. This data is attributed and sourced in full on every output. We do not create profiles of private individuals — only public companies and governments.' },
    { title: '5. Cookies', content: 'Essential cookies: Authentication tokens (JWT, 1-hour expiry), session identifiers, user preferences. These are required for the platform to function. Analytics cookies: We use privacy-respecting analytics to understand platform usage. These can be declined via our cookie banner. We do NOT use advertising, tracking, or third-party retargeting cookies.' },
    { title: '6. Data Sharing', content: 'Stripe: Payment processing (their privacy policy applies). Azure (Microsoft): Cloud hosting infrastructure in UAE North — data does not leave the region by default. Resend/SMTP: Transactional email delivery. We do NOT share data with data brokers, advertising networks, or any other third parties.' },
    { title: '7. Data Retention', content: 'Account data: Retained for the duration of your subscription plus 90 days after termination. Usage logs: 30 days rolling. Payment records: 7 years (legal requirement). Deleted accounts: All personal data deleted within 30 days of request, except where legal retention obligations apply.' },
    { title: '8. Security', content: 'Encryption in transit: TLS 1.3 on all connections. Encryption at rest: AES-256 on Azure infrastructure. Authentication: JWT tokens (1-hour expiry), bcrypt password hashing with salt. Infrastructure: Azure UAE North, SOC 2 Type II certified data centres. Access controls: Role-based access, MFA required for admin accounts. Penetration testing: Annual third-party security assessment.' },
    { title: '9. Your Rights', content: 'Under GDPR and applicable UAE data protection law, you have the right to: Access your personal data. Correct inaccurate data. Request deletion ("right to be forgotten"). Receive a copy of your data (data portability). Object to processing. Withdraw consent at any time. To exercise these rights, email privacy@fdimonitor.org. We respond within 72 hours.' },
    { title: '10. Children', content: 'Global FDI Monitor is a professional B2B platform and is not intended for persons under 18. We do not knowingly collect data from minors.' },
    { title: '11. Changes', content: 'We may update this policy. Material changes will be notified by email at least 14 days in advance. Continued use of the platform after the effective date constitutes acceptance.' },
    { title: '12. Contact', content: 'Data Controller: Forecasta Ltd\nEmail: privacy@fdimonitor.org\nAddress: Dubai, United Arab Emirates\nResponse time: Within 72 hours' },
  ];
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0A2540] text-white px-6 py-14">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
          <p className="text-blue-300">Last updated: March 2026 · Effective: March 1, 2026</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-700">
          <strong>Summary:</strong> We collect only what we need to run the platform. We never sell your data. We never advertise to you. All data is hosted on Azure UAE North. You can delete your account at any time.
        </div>
        {SECTIONS.map(s => (
          <div key={s.title}>
            <h2 className="text-xl font-black text-[#0A2540] mb-3">{s.title}</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{s.content}</p>
          </div>
        ))}
        <div className="pt-6 border-t border-slate-100 flex gap-6">
          <Link href="/contact" className="text-blue-600 font-bold hover:underline">Contact us →</Link>
          <Link href="/terms"   className="text-blue-600 font-bold hover:underline">Terms of Service →</Link>
        </div>
      </div>
    </div>
  );
}
