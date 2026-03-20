'use client';
import { Shield, Lock, Eye, Globe, CheckCircle, Mail } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';

const SECTIONS = [
  {id:'1', title:'Information We Collect', content:`We collect information you provide directly: name, email, organisation, and country when you register. We collect usage data including pages visited, signals viewed, and reports generated. We collect technical data: IP address, browser type, device, and session identifiers. We do not sell, rent, or share your personal data with third parties for marketing purposes.`},
  {id:'2', title:'How We Use Your Information', content:`We use your information to provide and improve the Global FDI Monitor platform, deliver reports and intelligence content you request, send transactional emails (account confirmation, report delivery), enforce our Trial terms (tracking 7-day period, report quota, and search quota), and respond to support requests. We use aggregated, anonymised data to improve our investment intelligence algorithms.`},
  {id:'3', title:'Trial Account Monitoring', content:`During your free trial, we track: (a) days elapsed since registration; (b) number of PDF report downloads (maximum 2); and (c) number of search or result views (maximum 3). When any limit is reached, your account transitions to read-only mode and you are redirected to our demo request page. This monitoring is necessary to enforce our trial terms as described at /pricing.`},
  {id:'4', title:'Report Security & Watermarking', content:`All PDF reports are secured with dynamic watermarks containing your email address, generation timestamp, IP address, and a unique reference code. Reports are protected against copying, printing, and screenshots. We maintain an audit trail of all generated and downloaded reports. This is to protect our intellectual property and your data.`},
  {id:'5', title:'Data Storage & Security', content:`Your data is stored on Microsoft Azure infrastructure in the UAE North (Dubai) region. We use industry-standard encryption in transit (TLS 1.3) and at rest (AES-256). Access controls follow the principle of least privilege. We perform regular security audits and penetration testing. Report PDFs are stored for 30 days then automatically deleted.`},
  {id:'6', title:'Cookies & Tracking', content:`We use essential cookies for authentication and session management. We use analytics cookies (Google Analytics) to understand platform usage. You can disable non-essential cookies through our cookie consent banner. We do not use advertising cookies or share data with advertising platforms.`},
  {id:'7', title:'GDPR & DIFC Compliance', content:`For users in the European Union, we comply with GDPR. You have rights to: access your data, correct inaccuracies, request deletion, data portability, and withdraw consent. For users in the Dubai International Financial Centre (DIFC), we comply with DIFC Data Protection Law No. 5 of 2020. To exercise your rights, contact privacy@fdimonitor.org.`},
  {id:'8', title:'API Data Usage', content:`If you use our API (Professional and Enterprise plans), API call logs are retained for 90 days for security and billing purposes. API keys are hashed using SHA-256 before storage. You are responsible for securing your API keys. Report any suspected compromise immediately to security@fdimonitor.org.`},
  {id:'9', title:'Third-Party Integrations', content:`We use: Microsoft Azure (infrastructure), Stripe (payment processing — we do not store card details), PostHog (analytics), and Resend (transactional email). Each provider processes data under their own privacy policies and our data processing agreements.`},
  {id:'10', title:'Data Retention', content:`Account data is retained while your account is active and for 90 days after deletion. Usage logs are retained for 12 months. Report audit trails are retained for 5 years for compliance purposes. Anonymised analytics data may be retained indefinitely.`},
  {id:'11', title:'Children\'s Privacy', content:`Global FDI Monitor is intended for professional use only. We do not knowingly collect data from individuals under 18 years of age. If you believe we have collected data from a minor, contact privacy@fdimonitor.org immediately.`},
  {id:'12', title:'Changes to This Policy', content:`We will notify you of material changes to this Privacy Policy via email and a prominent notice on the platform. Continued use of the platform after changes constitutes acceptance of the updated policy.`},
  {id:'13', title:'Contact', content:`Data Controller: Global FDI Monitor, DIFC, Dubai, UAE. Privacy enquiries: privacy@fdimonitor.org. Security issues: security@fdimonitor.org. Response time: within 5 business days.`},
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'40px 24px'}}>
        <div style={{maxWidth:'860px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
            <Shield size={16} color="#74BB65"/>
            <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>Legal</span>
          </div>
          <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'6px'}}>Privacy Policy</h1>
          <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>Last updated: March 2026 · GDPR & DIFC compliant</p>
        </div>
      </section>
      <div style={{maxWidth:'860px',margin:'0 auto',padding:'32px 24px',display:'flex',flexDirection:'column',gap:'0'}}>
        {SECTIONS.map((s,i)=>(
          <div key={s.id} style={{padding:'22px 0',borderBottom:i<SECTIONS.length-1?'1px solid rgba(10,61,98,0.08)':'none'}}>
            <div style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
              <div style={{width:'28px',height:'28px',borderRadius:'8px',background:'rgba(116,187,101,0.1)',
                flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',marginTop:'2px'}}>
                <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65'}}>{s.id}</span>
              </div>
              <div>
                <h2 style={{fontSize:'15px',fontWeight:700,color:'#0A3D62',marginBottom:'8px'}}>{s.title}</h2>
                <p style={{fontSize:'13px',color:'#696969',lineHeight:'1.75',margin:0}}>{s.content}</p>
              </div>
            </div>
          </div>
        ))}
        <div style={{marginTop:'24px',padding:'16px',borderRadius:'10px',
          background:'rgba(10,61,98,0.04)',border:'1px solid rgba(10,61,98,0.1)',
          display:'flex',alignItems:'center',gap:'10px'}}>
          <Mail size={16} color="#74BB65"/>
          <div style={{fontSize:'13px',color:'#696969'}}>
            Questions? Contact <a href="mailto:privacy@fdimonitor.org" style={{color:'#0A3D62',fontWeight:700}}>privacy@fdimonitor.org</a> · DIFC, Dubai, UAE
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
