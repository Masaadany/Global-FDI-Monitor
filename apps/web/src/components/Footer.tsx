'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Globe, Mail, MapPin, Linkedin, Twitter, ArrowRight } from 'lucide-react';

const FOOTER_LINKS = {
  'Platform': [
    {label:'Global Dashboard',      href:'/dashboard'},
    {label:'Investment Analysis',   href:'/investment-analysis'},
    {label:'FDI Signals',           href:'/signals'},
    {label:'Mission Planning',      href:'/pmp'},
    {label:'Foresight 2050',        href:'/forecast'},
    {label:'Benchmarking',          href:'/benchmarking'},
  ],
  'Intelligence': [
    {label:'Analytics',             href:'/analytics'},
    {label:'Publications',          href:'/publications'},
    {label:'Corridor Intelligence', href:'/corridor-intelligence'},
    {label:'Company Profiles',      href:'/company-profiles'},
    {label:'Market Insights',       href:'/market-insights'},
    {label:'Data Sources',          href:'/sources'},
  ],
  'Company': [
    {label:'About Us',              href:'/about'},
    {label:'Contact Us',            href:'/contact'},
    {label:'Pricing',               href:'/pricing'},
    {label:'API Documentation',     href:'/api-docs'},
    {label:'Platform Health',       href:'/health'},
    {label:'FAQ',                   href:'/faq'},
  ],
  'Legal': [
    {label:'Terms of Service',      href:'/terms'},
    {label:'Privacy Policy',        href:'/privacy'},
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (email) { setSubmitted(true); setEmail(''); }
  }

  return (
    <footer style={{background:'#061E30',borderTop:'1px solid rgba(116,187,101,0.1)'}}>
      {/* Newsletter bar */}
      <div style={{background:'rgba(116,187,101,0.06)',borderBottom:'1px solid rgba(116,187,101,0.1)',padding:'24px 40px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'20px',flexWrap:'wrap'}}>
          <div>
            <div style={{fontSize:'14px',fontWeight:700,color:'white',marginBottom:'3px'}}>Stay ahead of global FDI trends</div>
            <div style={{fontSize:'12px',color:'rgba(226,242,223,0.6)'}}>Weekly intelligence briefing — no spam, unsubscribe anytime.</div>
          </div>
          {submitted ? (
            <div style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',fontWeight:700,color:'#74BB65'}}>
              ✓ Subscribed — thank you!
            </div>
          ) : (
            <form onSubmit={handleNewsletter} style={{display:'flex',gap:'0'}}>
              <input value={email} onChange={e=>setEmail(e.target.value)}
                type="email" placeholder="your@email.com" required
                style={{padding:'10px 16px',borderRadius:'8px 0 0 8px',border:'1px solid rgba(116,187,101,0.3)',
                  borderRight:'none',fontSize:'13px',background:'rgba(255,255,255,0.07)',
                  color:'white',outline:'none',minWidth:'220px'}}/>
              <button type="submit"
                style={{padding:'10px 16px',borderRadius:'0 8px 8px 0',background:'#74BB65',
                  color:'white',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:700,
                  display:'flex',alignItems:'center',gap:'5px'}}>
                Subscribe <ArrowRight size={13}/>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main footer */}
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'48px 40px 32px'}}>
        <div style={{display:'grid',gridTemplateColumns:'240px 1fr 1fr 1fr 1fr',gap:'32px',marginBottom:'40px'}}>
          {/* Brand */}
          <div>
            <Link href="/" style={{textDecoration:'none',display:'flex',alignItems:'baseline',gap:'2px',marginBottom:'14px'}}>
              <span style={{fontSize:'17px',fontWeight:900,color:'white',letterSpacing:'-0.5px'}}>GLOBAL</span>
              <span style={{fontSize:'17px',fontWeight:900,color:'#74BB65',letterSpacing:'-0.5px',marginLeft:'4px'}}>FDI</span>
              <span style={{fontSize:'17px',fontWeight:900,color:'white',letterSpacing:'-0.5px',marginLeft:'4px'}}>MONITOR</span>
            </Link>
            <p style={{fontSize:'12px',color:'rgba(226,242,223,0.55)',lineHeight:'1.7',marginBottom:'16px'}}>
              The global standard for foreign direct investment intelligence. Real-time signals for 215 economies.
            </p>
            <div style={{display:'flex',flexDirection:'column',gap:'7px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'7px',fontSize:'12px',color:'rgba(226,242,223,0.55)'}}>
                <MapPin size={12} color="#74BB65"/><span>DIFC, Dubai, UAE</span>
              </div>
              <a href="mailto:info@fdimonitor.org"
                style={{display:'flex',alignItems:'center',gap:'7px',fontSize:'12px',color:'rgba(226,242,223,0.55)',textDecoration:'none'}}>
                <Mail size={12} color="#74BB65"/><span>info@fdimonitor.org</span>
              </a>
            </div>
            <div style={{display:'flex',gap:'8px',marginTop:'14px'}}>
              <a href="https://linkedin.com/company/fdimonitor" target="_blank" rel="noopener"
                style={{display:'flex',alignItems:'center',justifyContent:'center',width:'32px',height:'32px',
                  borderRadius:'8px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',
                  color:'rgba(226,242,223,0.7)',textDecoration:'none'}}>
                <Linkedin size={14}/>
              </a>
              <a href="https://twitter.com/fdimonitor" target="_blank" rel="noopener"
                style={{display:'flex',alignItems:'center',justifyContent:'center',width:'32px',height:'32px',
                  borderRadius:'8px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',
                  color:'rgba(226,242,223,0.7)',textDecoration:'none'}}>
                <Twitter size={14}/>
              </a>
              <Link href="/ar"
                style={{display:'flex',alignItems:'center',justifyContent:'center',width:'32px',height:'32px',
                  borderRadius:'8px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',
                  color:'rgba(226,242,223,0.7)',textDecoration:'none',fontSize:'13px',fontWeight:700}}>
                ع
              </Link>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <div style={{fontSize:'11px',fontWeight:800,color:'#74BB65',textTransform:'uppercase',
                letterSpacing:'0.1em',marginBottom:'14px'}}>{title}</div>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {links.map(l => (
                  <Link key={l.href} href={l.href}
                    style={{fontSize:'12px',color:'rgba(226,242,223,0.55)',textDecoration:'none',
                      transition:'color 0.15s'}}
                    onMouseEnter={(e:any)=>e.target.style.color='#74BB65'}
                    onMouseLeave={(e:any)=>e.target.style.color='rgba(226,242,223,0.55)'}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:'22px',
          display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'10px'}}>
          <div style={{fontSize:'11px',color:'rgba(226,242,223,0.35)'}}>
            © 2026 Global FDI Monitor · DIFC, Dubai, UAE · All rights reserved
          </div>
          <div style={{display:'flex',gap:'14px'}}>
            {[
              {label:'DIFC',  color:'#74BB65'},
              {label:'GDPR',  color:'rgba(226,242,223,0.5)'},
              {label:'SSL',   color:'rgba(226,242,223,0.5)'},
            ].map(({label,color})=>(
              <span key={label} style={{fontSize:'10px',fontWeight:700,color,
                padding:'2px 7px',borderRadius:'5px',border:`1px solid ${color}40`}}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
