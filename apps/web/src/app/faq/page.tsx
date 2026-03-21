'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const FAQS = [
  { cat:'Platform',q:'What is Global FDI Monitor?',a:'Global FDI Monitor is the world\'s most advanced FDI intelligence platform. We combine World Bank Doing Business methodology (L1), sector-level indicators (L2), special investment zone intelligence (L3), and real-time market signals (L4) to produce a 4-layer GOSA composite score for 215+ economies — updated weekly by our 6-stage AI agent pipeline.'},
  { cat:'Platform',q:'How is the GOSA score calculated?',a:'GOSA (Global Opportunity Scoring Algorithm) = (0.30 × L1 Doing Business) + (0.20 × L2 Sector) + (0.25 × L3 Investment Zones) + (0.25 × L4 Market Intelligence). Each layer is scored 0-100 using 304+ official T1/T2 government sources. AGT-04 processes all inputs weekly and publishes updated scores every Tuesday.'},
  { cat:'Platform',q:'How does the GFR Ranking compare to IMD WCR or Kearney GCR?',a:'The Global Future Readiness Ranking is designed to be comparable in methodology and rigour to IMD World Competitiveness Ranking, Kearney Global Cities Report, and the World Happiness Report. It covers 25 economies across 6 weighted dimensions (ETR, ICT, TCM, DTF, SGT, GRP), with transparent weighting and verifiable source attribution.'},
  { cat:'Platform',q:'How current is the data?',a:'Investment signals update every 2-5 seconds via WebSocket from our live AGT-02 pipeline. GOSA scores and GFR rankings update weekly (every Tuesday at 08:00 GMT). Country economic statistics (GDP, FDI inflows) update quarterly based on official government releases.'},
  { cat:'Platform',q:'How are signals verified?',a:'Every signal goes through 3 verification stages: (1) AGT-01 harvests raw data from 304+ official T1/T2 sources, (2) AGT-03 applies SHA-256 provenance hashing and deduplication, (3) AGT-02 applies SCI scoring (0-100) based on source authority, timeliness, and investment relevance. Only signals scoring 70+ are published to the feed.'},
  { cat:'Pricing',q:'Do I need a credit card for the free trial?',a:'No. The 7-day free trial requires no credit card and expires automatically with no charges. The trial includes full platform access with usage limits: 2 PDF report downloads and 3 country profile searches.'},
  { cat:'Pricing',q:'What does the Professional plan include?',a:'Professional ($9,588/year) includes: unlimited PDF reports, unlimited searches, full API access (1,000 calls/day), weekly Intelligence Brief delivery, mission planning module, benchmark tool, and all 67+ platform pages. Billed annually.'},
  { cat:'Pricing',q:'Is there an Enterprise plan?',a:'Enterprise plans are custom-priced and include: unlimited API access, white-label PDF reports, custom data integrations, unlimited team seats, dedicated account manager, 99.9% SLA, SSO/SAML, and on-site briefings. Contact info@fdimonitor.org.'},
  { cat:'Data',q:'Where does the data come from?',a:'All data comes from 304+ official T1/T2 verified sources categorised into 8 groups: International Financial Institutions (18 sources), Investment Promotion Agencies (62), Central Banks (48), Statistical Authorities (44), Special Economic Zone Authorities (38), Trade Databases (42), Rating Agencies (28), and Sector Intelligence Sources (24). See /sources for the full list.'},
  { cat:'Data',q:'Is the data GDPR compliant?',a:'All data on the platform is derived from publicly available official government sources and does not include personal data. User account data is GDPR compliant — see our Privacy Policy for full details. We use SendGrid, Stripe, and AWS, all GDPR-certified.'},
  { cat:'Technical',q:'Does the platform have an API?',a:'Yes. The Global FDI Monitor REST API is available on Professional and Enterprise plans. It includes 8 endpoints covering countries, signals, reports, and authentication, plus a WebSocket endpoint for live signal streaming. See /api-docs for full documentation.'},
  { cat:'Technical',q:'What is the AI agent pipeline?',a:'The platform runs a 6-stage AI agent pipeline: AGT-01 (Data Collection — 304+ sources, 30min cycle), AGT-02 (Signal Detection — SCI scoring), AGT-03 (Verification — SHA-256 provenance), AGT-04 (GOSA Scoring — weekly composite), AGT-05 (GFR Ranking — weekly 25-economy update), AGT-06 (Newsletter — weekly brief generation).'},
];

const CATS = ['All', ...Array.from(new Set(FAQS.map(f=>f.cat)))];

export default function FAQPage() {
  const [open, setOpen] = useState<number|null>(null);
  const [cat, setCat] = useState('All');

  const filtered = cat === 'All' ? FAQS : FAQS.filter(f=>f.cat===cat);

  return (
    <div style={{minHeight:'100vh',background:'#020c14',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{background:'linear-gradient(135deg,#020c14,#060f1a)',padding:'48px 24px',textAlign:'center',borderBottom:'1px solid rgba(0,255,200,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{position:'relative'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.5)',letterSpacing:'0.2em',marginBottom:'8px',fontFamily:"'Orbitron','Inter',sans-serif"}}>FAQ</div>
          <h1 style={{fontSize:'28px',fontWeight:900,color:'#e8f4f8',marginBottom:'8px'}}>Frequently Asked Questions</h1>
          <p style={{fontSize:'13px',color:'rgba(232,244,248,0.45)'}}>Platform · Pricing · Data · Technical</p>
        </div>
      </div>

      <div style={{maxWidth:'760px',margin:'0 auto',padding:'36px 24px'}}>
        {/* Category tabs */}
        <div style={{display:'flex',gap:'8px',marginBottom:'24px',flexWrap:'wrap'}}>
          {CATS.map(c => (
            <button key={c} onClick={()=>setCat(c)}
              style={{padding:'7px 16px',borderRadius:'20px',border:`1px solid ${cat===c?'rgba(0,255,200,0.3)':'rgba(255,255,255,0.08)'}`,background:cat===c?'rgba(0,255,200,0.08)':'rgba(255,255,255,0.03)',cursor:'pointer',fontSize:'12px',fontWeight:cat===c?700:400,color:cat===c?'#00ffc8':'rgba(232,244,248,0.5)',fontFamily:"'Inter',sans-serif",transition:'all 150ms'}}>
              {c}
            </button>
          ))}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'7px'}}>
          {filtered.map((faq, i) => (
            <div key={faq.q} style={{background:'rgba(10,22,40,0.7)',borderRadius:'10px',border:'1px solid rgba(0,180,216,0.1)',overflow:'hidden',transition:'border-color 200ms',borderColor:open===i?'rgba(0,255,200,0.2)':'rgba(0,180,216,0.1)'}}>
              <button onClick={()=>setOpen(open===i?null:i)}
                style={{width:'100%',padding:'16px 18px',background:'transparent',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Inter',sans-serif"}}>
                <span style={{fontSize:'14px',fontWeight:600,color:'rgba(232,244,248,0.85)',textAlign:'left'}}>{faq.q}</span>
                <div style={{display:'flex',alignItems:'center',gap:'10px',flexShrink:0,marginLeft:'12px'}}>
                  <span style={{fontSize:'9px',fontWeight:800,padding:'2px 7px',borderRadius:'4px',background:'rgba(0,255,200,0.07)',color:'rgba(0,255,200,0.5)',letterSpacing:'0.06em'}}>{faq.cat}</span>
                  <span style={{fontSize:'18px',color:'rgba(0,255,200,0.5)',transition:'transform 200ms ease',transform:open===i?'rotate(45deg)':'none',lineHeight:1}}>+</span>
                </div>
              </button>
              {open===i && (
                <div style={{padding:'0 18px 16px',fontSize:'13px',color:'rgba(232,244,248,0.6)',lineHeight:1.8,borderTop:'1px solid rgba(0,255,200,0.06)',paddingTop:'12px'}}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>

        <div style={{marginTop:'32px',padding:'20px',background:'rgba(0,255,200,0.04)',borderRadius:'12px',border:'1px solid rgba(0,255,200,0.1)',textAlign:'center'}}>
          <div style={{fontSize:'14px',fontWeight:700,color:'#e8f4f8',marginBottom:'6px'}}>Can't find your answer?</div>
          <div style={{fontSize:'12px',color:'rgba(232,244,248,0.45)',marginBottom:'16px'}}>Our team responds within 24 hours</div>
          <Link href="/contact" style={{padding:'10px 24px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'#020c14',borderRadius:'9px',textDecoration:'none',fontSize:'13px',fontWeight:800}}>
            Contact Us →
          </Link>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
