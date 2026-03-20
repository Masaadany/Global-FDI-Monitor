import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — FDI Monitor',
  description: 'FDI Monitor Privacy Policy. GDPR, DIFC Law No.5/2020, UAE Federal Law No.45/2021. Data retention, watermarks, your rights.',
};

const SECTIONS = [
  { n:'1', t:'Data Controller',
    b:'FDI Monitor operates this platform. For privacy matters contact privacy@fdimonitor.org. Registered in the Dubai International Financial Centre (DIFC), Dubai, UAE.' },
  { n:'2', t:'Data We Collect',
    b:'Account data: name, work email, organisation, role, password (bcrypt with salt). Usage data: pages, features, API calls, session timestamps. Payment data: processed entirely by Stripe — we store only subscription tier and status. Technical data: IP address, browser type, device identifiers. Communications: support requests and contact form submissions.' },
  { n:'3', t:'Purposes & Legal Bases',
    b:'We process your data to: provide and personalise the Platform (contract performance); process subscriptions and credit purchases (contract); apply report watermarks — email + timestamp + IP + SHA-256 reference (legitimate interests); send service notifications (legitimate interests); prevent fraud and ensure security (legitimate interests); comply with legal obligations (legal obligation). Marketing relies on consent, withdrawable at any time.' },
  { n:'4', t:'Report Watermarks',
    b:'Every generated PDF report contains a dynamic watermark with your registered email, generation timestamp (UTC), IP address at generation, and a unique SHA-256 committed reference code. This watermark is immutable and forms part of our signal provenance system. Generating a report constitutes acceptance of this watermark processing.' },
  { n:'5', t:'GDPR & DIFC Compliance',
    b:'For EEA users: we comply with the EU General Data Protection Regulation (GDPR). For DIFC users: we comply with DIFC Law No. 5 of 2020 on the Protection of Personal Data. For UAE users: we comply with UAE Federal Law No. 45 of 2021 on Personal Data Protection. We conduct Data Protection Impact Assessments for high-risk processing activities.' },
  { n:'6', t:'Third-Party Processors',
    b:'Data is shared only with: Stripe (payments, USA — EU Standard Contractual Clauses); Azure UAE North (cloud hosting — data residency preserved); Anthropic (AI report generation — anonymised where possible). All processors are bound by Data Processing Agreements and prohibited from using your data for their own purposes. We never sell personal data.' },
  { n:'7', t:'International Transfers',
    b:'Primary data is hosted in Azure UAE North. AI processing may involve US-based services protected by Standard Contractual Clauses and Transfer Impact Assessments. We apply appropriate safeguards as required by GDPR Art. 46 and DIFC Law No. 5 of 2020 Chapter 8.' },
  { n:'8', t:'Data Retention',
    b:'Account data: subscription duration + 2 years. Watermark audit logs: 7 years (legal compliance). API call logs: 12 months then anonymised. Billing records: 7 years (tax). Support communications: 3 years. You may request deletion at any time, subject to legal retention obligations we cannot override.' },
  { n:'9', t:'Your Rights',
    b:'You have the right to: access your personal data; correct inaccurate data; request deletion (right to be forgotten); restrict or object to processing; data portability (structured, machine-readable format); withdraw consent at any time. Submit requests to privacy@fdimonitor.org — we respond within 30 days. You may also lodge a complaint with the DIFC Commissioner of Data Protection.' },
  { n:'10', t:'Cookies & Tracking',
    b:'Essential cookies: authentication tokens, session management, CSRF protection — cannot be disabled without breaking core functionality. Optional analytics: anonymised usage analysis to improve the platform — manageable via the cookie banner on first visit. We do not use advertising cookies or share cookie data with advertising networks.' },
  { n:'11', t:'Security Measures',
    b:'TLS 1.3 for all data in transit. AES-256 encryption at rest. bcrypt with salt for password hashing. JWT tokens with 15-minute expiry and rotation. SHA-256 signal provenance hashes. Z3 formal verification on all intelligence signals. Azure SOC 2 Type II compliant infrastructure in UAE North. Annual penetration testing.' },
  { n:'12', t:'Policy Changes',
    b:'Material changes are communicated by email to all registered users at least 14 days before taking effect. Continued use of the Platform after the effective date constitutes acceptance. Historical versions are available on request from privacy@fdimonitor.org.' },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-10">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#74BB65'}}>Legal</div>
          <h1 className="text-3xl font-extrabold mb-1" style={{color:'#0A3D62'}}>Privacy Policy</h1>
          <p className="text-sm" style={{color:'#696969'}}>Effective: 1 January 2026 · FDI Monitor · DIFC, Dubai, UAE</p>
          <div className="flex gap-3 mt-3 flex-wrap text-xs" style={{color:'#696969'}}>
            <span>✓ GDPR</span><span>·</span>
            <span>✓ DIFC Law No. 5/2020</span><span>·</span>
            <span>✓ UAE Federal Law No. 45/2021</span>
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
          <span>Privacy: <span style={{color:'#74BB65'}}>privacy@fdimonitor.org</span></span>
          <span>·</span>
          <Link href="/terms" style={{color:'#74BB65'}}>Terms of Service →</Link>
        </div>
      </div>
    </div>
  );
}
