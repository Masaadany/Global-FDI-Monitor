import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing — Global FDI Monitor',
  description: 'Global FDI Monitor 3-day free trial. Full platform access — signals, GFR rankings, foresight, mission planning. Contact us for full access.',
};

const TRIAL_FEATURES = [
  {icon:'📡',feat:'218+ Live FDI Signals',    limit:'Read-only access'},
  {icon:'🏆',feat:'GFR Rankings (215 economies)',limit:'Full view access'},
  {icon:'📊',feat:'Global Dashboard',           limit:'Full view access'},
  {icon:'🔮',feat:'Foresight & Scenario 2050',  limit:'Full view access'},
  {icon:'⚖️',feat:'Benchmarking & Comparison',  limit:'Up to 3 economies'},
  {icon:'🌐',feat:'Corridor Intelligence',       limit:'Read-only'},
  {icon:'📋',feat:'Report Generation',           limit:'2 PDF reports max'},
  {icon:'📥',feat:'Data Downloads',              limit:'❌ Not included'},
  {icon:'🔑',feat:'API Access',                  limit:'❌ Not included'},
  {icon:'🏢',feat:'Company Profiles',            limit:'Summary only'},
  {icon:'🗂',feat:'Country Profiles',            limit:'Summary only'},
  {icon:'✈️',feat:'Mission Planning',            limit:'Read-only'},
];

export default function PricingPage() {
  return (
    <div style={{minHeight:'100vh',background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62,#1a6b9e)',padding:'60px 24px',textAlign:'center'}}>
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          <div style={{fontSize:'12px',fontWeight:'700',color:'#74BB65',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'12px'}}>Access</div>
          <h1 style={{fontSize:'36px',fontWeight:'800',color:'white',marginBottom:'12px'}}>Explore the Platform Free</h1>
          <p style={{color:'rgba(255,255,255,0.75)',fontSize:'16px',lineHeight:'1.6',marginBottom:'32px'}}>
            Start with a full 3-day trial — no credit card required. For full platform access including API, downloads, and unlimited reports, contact our team.
          </p>
          <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/register" style={{background:'#74BB65',color:'white',fontWeight:'700',padding:'14px 32px',borderRadius:'8px',textDecoration:'none',fontSize:'15px'}}>
              Start Free Trial →
            </Link>
            <Link href="/contact" style={{background:'transparent',color:'white',fontWeight:'700',padding:'14px 32px',borderRadius:'8px',textDecoration:'none',fontSize:'15px',border:'2px solid rgba(255,255,255,0.4)'}}>
              Request Full Access
            </Link>
          </div>
        </div>
      </section>

      <div style={{maxWidth:'900px',margin:'0 auto',padding:'64px 24px'}}>
        {/* Trial card */}
        <div style={{background:'white',borderRadius:'16px',padding:'40px',marginBottom:'40px',boxShadow:'0 4px 20px rgba(10,61,98,0.08)',border:'2px solid #74BB65'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'16px',marginBottom:'28px'}}>
            <div>
              <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'rgba(116,187,101,0.1)',borderRadius:'20px',padding:'4px 12px',marginBottom:'8px'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#74BB65'}}/>
                <span style={{fontSize:'12px',fontWeight:'700',color:'#74BB65'}}>FREE TRIAL</span>
              </div>
              <h2 style={{fontSize:'24px',fontWeight:'700',color:'#0A3D62',margin:0}}>3-Day Trial Access</h2>
              <p style={{color:'#696969',fontSize:'14px',marginTop:'6px'}}>Full view access to signals, rankings, foresight, and more</p>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:'40px',fontWeight:'800',color:'#74BB65',fontFamily:'JetBrains Mono,monospace'}}>Free</div>
              <div style={{fontSize:'13px',color:'#696969'}}>3 days · No credit card</div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'28px'}}>
            {TRIAL_FEATURES.map(({icon,feat,limit})=>(
              <div key={feat} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',borderRadius:'8px',background:'#f9f9f9',gap:'8px'}}>
                <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                  <span style={{fontSize:'16px'}}>{icon}</span>
                  <span style={{fontSize:'13px',color:'#333',fontWeight:'500'}}>{feat}</span>
                </div>
                <span style={{fontSize:'11px',color:limit.startsWith('❌')?'#E57373':'#74BB65',fontWeight:'600',minWidth:'90px',textAlign:'right'}}>{limit}</span>
              </div>
            ))}
          </div>
          <Link href="/register" style={{display:'block',width:'100%',textAlign:'center',background:'#74BB65',color:'white',fontWeight:'700',padding:'14px',borderRadius:'8px',textDecoration:'none',fontSize:'15px'}}>
            Start Free Trial — No Credit Card →
          </Link>
        </div>

        {/* Full access CTA */}
        <div style={{background:'#0A3D62',borderRadius:'16px',padding:'40px',textAlign:'center',color:'white'}}>
          <h2 style={{fontSize:'24px',fontWeight:'700',color:'white',marginBottom:'8px'}}>Need Full Platform Access?</h2>
          <p style={{color:'rgba(255,255,255,0.8)',fontSize:'15px',lineHeight:'1.6',marginBottom:'24px'}}>
            Unlimited reports, data downloads, API access, company profiles, and dedicated intelligence support. Contact our team to request a full platform demo and discuss access options.
          </p>
          <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/contact" style={{background:'#74BB65',color:'white',fontWeight:'700',padding:'12px 28px',borderRadius:'8px',textDecoration:'none',fontSize:'14px'}}>
              Request Full Access →
            </Link>
            <Link href="/demo" style={{background:'transparent',color:'white',fontWeight:'700',padding:'12px 28px',borderRadius:'8px',textDecoration:'none',fontSize:'14px',border:'2px solid rgba(255,255,255,0.3)'}}>
              View Platform Demo
            </Link>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
