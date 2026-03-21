import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  const sections = [
    ['Acceptance of Terms','By accessing Global FDI Monitor, you agree to these terms. If you do not agree, do not use the platform. These terms apply to all users including free trial, professional, and enterprise subscribers.'],
    ['Free Trial','The 7-day free trial provides access to the full platform with usage limits: 2 PDF report downloads and 3 country searches. No credit card is required to start a trial. The trial expires automatically after 7 days with no charges.'],
    ['Subscription Services','Professional and Enterprise subscriptions provide expanded access as described in the pricing page. Subscriptions auto-renew unless cancelled. Annual subscriptions are non-refundable after 30 days.'],
    ['Data and Intelligence','All investment intelligence, GOSA scores, GFR rankings, and signals are provided for informational purposes only. They do not constitute investment advice. Users should conduct independent due diligence before making investment decisions.'],
    ['Intellectual Property','All content on Global FDI Monitor — including GOSA methodology, GFR ranking framework, platform design, and AI-generated reports — is proprietary to Forecasta. Users may not reproduce, redistribute, or commercialize this content without written permission.'],
    ['API Usage','API access is provided under Professional and Enterprise plans. Rate limits apply as described in the API documentation. Users may not use the API to build competing FDI intelligence products.'],
    ['Limitation of Liability','Global FDI Monitor is not liable for investment decisions made based on platform intelligence. Accuracy of signals and scores is provided on a best-efforts basis using SHA-256 verified official sources, but we do not guarantee completeness or timeliness.'],
    ['Governing Law','These terms are governed by the laws of the United Arab Emirates. Disputes shall be resolved through arbitration in Dubai International Arbitration Centre (DIAC).'],
  ];

  return (
    <div style={{minHeight:'100vh',background:'#020c14',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{maxWidth:'800px',margin:'0 auto',padding:'48px 24px'}}>
        <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.5)',letterSpacing:'0.2em',marginBottom:'8px',fontFamily:"'Orbitron','Inter',sans-serif"}}>LEGAL</div>
        <h1 style={{fontSize:'28px',fontWeight:900,color:'#e8f4f8',marginBottom:'6px'}}>Terms of Service</h1>
        <p style={{fontSize:'13px',color:'rgba(232,244,248,0.4)',marginBottom:'40px'}}>Last updated: March 2026 · Effective immediately</p>
        {sections.map(([title, body]) => (
          <div key={title} style={{marginBottom:'28px',paddingBottom:'28px',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
            <h2 style={{fontSize:'16px',fontWeight:700,color:'#e8f4f8',marginBottom:'8px'}}>{title}</h2>
            <p style={{fontSize:'13px',color:'rgba(232,244,248,0.55)',lineHeight:1.85}}>{body}</p>
          </div>
        ))}
        <div style={{padding:'16px',background:'rgba(0,255,200,0.04)',borderRadius:'10px',border:'1px solid rgba(0,255,200,0.1)',fontSize:'12px',color:'rgba(232,244,248,0.45)'}}>
          Questions? Contact <a href="mailto:info@fdimonitor.org" style={{color:'#00ffc8',textDecoration:'none'}}>info@fdimonitor.org</a>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
