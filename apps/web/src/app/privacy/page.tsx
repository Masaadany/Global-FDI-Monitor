import Link from 'next/link';
export const metadata={title:'Privacy Policy — Global FDI Monitor'};
export default function PrivacyPage() {
  const SECTIONS=[
    {title:'Data We Collect',content:'We collect account information (name, email, organisation), usage analytics, and session data necessary to provide the platform. We do not collect or sell personal data to third parties for advertising.'},
    {title:'How We Use Data',content:'Account data is used to authenticate users, personalise the platform, and communicate about your subscription. Usage analytics improve platform performance. We never use your data for advertising.'},
    {title:'Data Sources',content:'GFM aggregates publicly available data from international organisations (IMF, World Bank, UNCTAD, OECD, IEA) and licensed news intelligence sources. All data carries provenance attribution.'},
    {title:'Data Retention',content:'Account data is retained for the duration of your subscription plus 90 days. You may request deletion at any time by emailing privacy@fdimonitor.org.'},
    {title:'Security',content:'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We use Azure\'s enterprise security infrastructure based in UAE North. JWT authentication with 1-hour expiry.'},
    {title:'Cookies',content:'We use essential cookies for authentication and preferences. Analytics cookies are optional. We do not use advertising or tracking cookies. See our Cookie Notice on first visit.'},
    {title:'Your Rights',content:'You have the right to access, correct, port, or delete your personal data. Under GDPR and applicable UAE data protection law, contact privacy@fdimonitor.org.'},
    {title:'Contact',content:'Data Controller: Forecasta Ltd. Email: privacy@fdimonitor.org. We respond to all data requests within 72 hours.'},
  ];
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0A2540] text-white px-6 py-14">
        <div className="max-w-3xl mx-auto"><h1 className="text-4xl font-black mb-2">Privacy Policy</h1><p className="text-blue-200">Last updated: March 2026</p></div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        {SECTIONS.map(s=>(
          <div key={s.title}>
            <h2 className="text-xl font-black text-[#0A2540] mb-3">{s.title}</h2>
            <p className="text-slate-600 leading-relaxed">{s.content}</p>
          </div>
        ))}
        <div className="pt-6 border-t border-slate-100">
          <Link href="/contact" className="text-blue-600 font-bold hover:underline">Contact us with privacy questions →</Link>
        </div>
      </div>
    </div>
  );
}
