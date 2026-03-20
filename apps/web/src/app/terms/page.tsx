'use client';
import { FileText, Shield, CheckCircle, Globe, Scale, AlertTriangle } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';

const SECTIONS = [
  {id:'1', title:'Acceptance of Terms', content:`By accessing or using Global FDI Monitor ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, you may not use the Platform. These Terms apply to all users, including free trial users, Professional subscribers, and Enterprise clients.`},
  {id:'2', title:'Free Trial Terms', content:`The free trial provides 7 calendar days of access from registration, a maximum of 2 PDF report downloads, and a maximum of 3 search or result views. The first limit to be reached triggers transition to read-only mode. Read-only mode disables all interactive features including filters, search, downloads, and report generation. Submitting a demo request lifts read-only restrictions for the session only.`},
  {id:'3', title:'Intellectual Property', content:`All content on the Platform, including investment intelligence data, GFR assessment scores, signal intelligence, and methodology, is proprietary to Global FDI Monitor. PDF reports are watermarked and secured. You may not reproduce, redistribute, or re-sell any content without express written permission. API data may only be used for internal business purposes as defined in your subscription agreement.`},
  {id:'4', title:'Permitted Use', content:`You may use the Platform for lawful business intelligence and investment decision-making purposes. You may not: (a) attempt to reverse-engineer our scoring methodology; (b) use automated bots or scrapers; (c) share your account credentials; (d) remove watermarks from reports; (e) resell Platform content; or (f) use the Platform for competitive intelligence products.`},
  {id:'5', title:'Data Accuracy & Disclaimer', content:`Global FDI Monitor aggregates data from 300+ sources using proprietary verification methods including Z3 formal proof and SHA-256 provenance. However, all investment intelligence is provided for informational purposes only. We do not provide investment advice. Past performance data does not guarantee future results. Users should conduct independent due diligence before making investment decisions.`},
  {id:'6', title:'API Usage Terms', content:`API access is available to Professional and Enterprise subscribers only. API credits are allocated annually and do not roll over. API keys must be secured by the subscriber. Global FDI Monitor is not liable for unauthorised use resulting from key compromise. Excessive API usage beyond plan limits may result in temporary rate limiting.`},
  {id:'7', title:'Report Security Obligations', content:`Downloaded PDF reports are licensed for internal use only within your organisation. Dynamic watermarks identify the downloading account. Redistribution of watermarked reports is prohibited and may result in account termination. We maintain audit trails of all report downloads as required by our data licensing agreements.`},
  {id:'8', title:'Subscription & Payment', content:`Professional subscriptions are billed annually at $9,588 USD. Payments are processed via Stripe. Subscriptions renew automatically unless cancelled 30 days before renewal. No refunds are provided for unused periods. Enterprise pricing is negotiated separately. VAT or applicable taxes may be added for certain jurisdictions.`},
  {id:'9', title:'Termination', content:`We reserve the right to terminate accounts that violate these Terms. You may terminate your account at any time by contacting support@fdimonitor.org. Upon termination, your data is retained for 90 days then permanently deleted, except audit logs which are retained for 5 years.`},
  {id:'10', title:'Limitation of Liability', content:`To the maximum extent permitted by law, Global FDI Monitor's liability is limited to the amount paid by you in the 12 months preceding the claim. We are not liable for indirect, consequential, or investment losses. Some jurisdictions do not permit liability limitations, so these may not apply to you.`},
  {id:'11', title:'Governing Law', content:`These Terms are governed by the laws of the Dubai International Financial Centre (DIFC). Any disputes shall be subject to the exclusive jurisdiction of the DIFC Courts. For users outside the UAE, local mandatory consumer protection laws may also apply.`},
  {id:'12', title:'Changes to Terms', content:`We will provide 30 days' notice of material changes via email and platform notification. Continued use after the notice period constitutes acceptance. If you do not agree to updated Terms, you may terminate your account before the effective date.`},
  {id:'13', title:'Contact', content:`Legal enquiries: legal@fdimonitor.org · Support: support@fdimonitor.org · Global FDI Monitor, DIFC, Dubai, UAE. Company registration: DIFC Authority.`},
];

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'40px 24px'}}>
        <div style={{maxWidth:'860px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
            <FileText size={16} color="#74BB65"/>
            <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>Legal</span>
          </div>
          <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'6px'}}>Terms of Service</h1>
          <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>Last updated: March 2026 · DIFC registered · Governing law: DIFC Courts</p>
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
          background:'rgba(229,115,115,0.05)',border:'1px solid rgba(229,115,115,0.2)',
          display:'flex',alignItems:'flex-start',gap:'10px'}}>
          <AlertTriangle size={16} color="#E57373" style={{flexShrink:0,marginTop:'1px'}}/>
          <div style={{fontSize:'13px',color:'#696969',lineHeight:'1.6'}}>
            <b style={{color:'#0A3D62'}}>Investment Disclaimer:</b> Global FDI Monitor provides investment intelligence data for informational purposes only. Nothing on this platform constitutes investment advice, financial advice, or a recommendation to buy, sell, or hold any investment. Always conduct independent due diligence.
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
