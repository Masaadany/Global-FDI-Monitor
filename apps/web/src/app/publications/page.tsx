'use client';
import { useState } from 'react';
import { BookOpen, Download, Shield, Filter, Search, Calendar, FileText, Star, ArrowRight } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';
import PreviewGate from '@/components/PreviewGate';
import ReadOnlyOverlay from '@/components/ReadOnlyOverlay';
import Link from 'next/link';

const CATEGORIES = ['All','Annual Report','Quarterly Brief','Sector Study','Policy Paper','Data Compendium','Outlook'];

const PUBLICATIONS = [
  {id:'P001',cat:'Annual Report',   title:'Global FDI Monitor Annual Intelligence Report 2025',
   desc:'Comprehensive review of global FDI flows, corridors, sector trends, and investment policy for 2025.',
   pages:92,date:'Jan 2026',   access:'Professional',icon:'📕'},
  {id:'P002',cat:'Quarterly Brief', title:'FDI Intelligence Brief Q4 2025',
   desc:'Key FDI developments, signal highlights, GFR movers, and sector intelligence for Q4 2025.',
   pages:28,date:'Jan 2026',   access:'Free',      icon:'📄'},
  {id:'P003',cat:'Sector Study',    title:'Technology & AI Infrastructure: FDI Hotspots 2026',
   desc:'Deep-dive into $487B technology FDI. Data centres, AI, cloud, fintech across 45 economies.',
   pages:44,date:'Feb 2026',   access:'Professional',icon:'💻'},
  {id:'P004',cat:'Policy Paper',    title:'Investment Zone Reform: Which Economies Are Winning?',
   desc:'Analysis of 1,400+ special economic zones. Policy reform trends and occupancy performance.',
   pages:36,date:'Feb 2026',   access:'Free',      icon:'📋'},
  {id:'P005',cat:'Data Compendium', title:'FDI Data Compendium 2025: 215 Economies',
   desc:'Complete FDI flows, GFR scores, and Investment Analysis scores for all 215 covered economies.',
   pages:215,date:'Dec 2025',  access:'Professional',icon:'📊'},
  {id:'P006',cat:'Outlook',         title:'Global FDI Outlook 2026–2028: Navigating Uncertainty',
   desc:'Three-scenario forecast for global FDI including geopolitical, green transition, and AI growth scenarios.',
   pages:58,date:'Jan 2026',   access:'Professional',icon:'🔭'},
  {id:'P007',cat:'Quarterly Brief', title:'FDI Intelligence Brief Q3 2025',
   desc:'Key FDI developments, PLATINUM signal digest, GFR changes, and corridor intelligence Q3 2025.',
   pages:28,date:'Oct 2025',   access:'Free',      icon:'📄'},
  {id:'P008',cat:'Sector Study',    title:'Renewable Energy FDI: The $385B Race to 2030',
   desc:'Solar, wind, hydrogen and battery storage investment flows. Policy incentives and zone readiness.',
   pages:40,date:'Mar 2026',   access:'Professional',icon:'☀'},
  {id:'P009',cat:'Policy Paper',    title:'MENA Investment Climate 2026: Structural Reform Gains',
   desc:'Assessing Vision 2030, UAE economic diversification, and the region\'s rising GFR scores.',
   pages:32,date:'Mar 2026',   access:'Free',      icon:'🌍'},
  {id:'P010',cat:'Data Compendium', title:'ASEAN FDI Data Compendium 2025',
   desc:'Complete FDI, GFR, GOSA, and sector data for all 10 ASEAN member states.',
   pages:88,date:'Nov 2025',   access:'Professional',icon:'🗂'},
];

const ACCESS_C: Record<string,string> = {Free:'#74BB65',Professional:'#0A3D62'};

export default function PublicationsPage() {
  const [cat,    setCat]    = useState('All');
  const [search, setSearch] = useState('');

  const filtered = PUBLICATIONS.filter(p=>
    (cat==='All'||p.cat===cat) &&
    (!search||p.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/><TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'40px 24px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
              <BookOpen size={16} color="#74BB65"/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>Publications</span>
            </div>
            <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'6px'}}>Intelligence Publications</h1>
            <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>
              Annual reports · Quarterly briefs · Sector studies · Policy papers · Data compendia
            </p>
          </div>
          <div style={{display:'flex',gap:'18px'}}>
            {[['10','Publications'],['4','Open Access'],['6','Pro Only'],['2026','Latest']].map(([v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:'18px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'24px',display:'flex',flexDirection:'column',gap:'16px'}}>
        {/* Filters */}
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center'}}>
          <Filter size={13} color="#696969"/>
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setCat(c)}
              style={{padding:'6px 13px',borderRadius:'16px',border:'none',cursor:'pointer',fontSize:'12px',
                fontWeight:700,background:cat===c?'#0A3D62':'rgba(10,61,98,0.07)',color:cat===c?'white':'#0A3D62'}}>
              {c}
            </button>
          ))}
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'6px'}}>
            <Search size={13} color="#696969"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search publications…"
              style={{padding:'6px 12px',borderRadius:'7px',border:'1px solid rgba(10,61,98,0.15)',
                fontSize:'12px',outline:'none',color:'#000',background:'white',width:'180px'}}/>
          </div>
          <span style={{fontSize:'12px',color:'#696969'}}>{filtered.length} publications</span>
        </div>

        {/* Publications grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'14px'}}>
          {filtered.map(pub=>(
            <div key={pub.id} style={{background:'white',borderRadius:'12px',padding:'20px',
              boxShadow:'0 2px 8px rgba(10,61,98,0.06)',border:'1px solid rgba(10,61,98,0.07)',
              display:'flex',gap:'16px',alignItems:'flex-start'}}>
              <div style={{width:'48px',height:'60px',borderRadius:'8px',
                background:'rgba(10,61,98,0.06)',border:'1px solid rgba(10,61,98,0.1)',
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',flexShrink:0}}>
                {pub.icon}
              </div>
              <div style={{flex:1}}>
                <div style={{display:'flex',gap:'8px',marginBottom:'7px',alignItems:'center',flexWrap:'wrap'}}>
                  <span style={{fontSize:'10px',fontWeight:700,padding:'2px 8px',borderRadius:'8px',
                    background:`${ACCESS_C[pub.access]}12`,color:ACCESS_C[pub.access]}}>{pub.cat}</span>
                  <span style={{fontSize:'10px',fontWeight:700,padding:'2px 7px',borderRadius:'8px',
                    background:pub.access==='Free'?'rgba(116,187,101,0.1)':'rgba(10,61,98,0.08)',
                    color:pub.access==='Free'?'#74BB65':'#0A3D62'}}>
                    {pub.access==='Free'?'FREE ACCESS':'PRO ONLY'}
                  </span>
                </div>
                <h3 style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'6px',lineHeight:'1.4'}}>{pub.title}</h3>
                <p style={{fontSize:'12px',color:'#696969',lineHeight:'1.55',marginBottom:'10px'}}>{pub.desc}</p>
                <div style={{display:'flex',gap:'14px',alignItems:'center',fontSize:'11px',color:'#696969'}}>
                  <span style={{display:'flex',alignItems:'center',gap:'3px'}}><Calendar size={10}/>{pub.date}</span>
                  <span style={{display:'flex',alignItems:'center',gap:'3px'}}><FileText size={10}/>{pub.pages} pages</span>
                  <div style={{marginLeft:'auto'}}>
                    {pub.access==='Free' ? (
                      <button style={{display:'flex',alignItems:'center',gap:'4px',padding:'6px 12px',
                        background:'#74BB65',color:'white',border:'none',borderRadius:'7px',
                        cursor:'pointer',fontSize:'11px',fontWeight:700}}>
                        <Download size={11}/> Download PDF
                      </button>
                    ) : (
                      <ReadOnlyOverlay feature="download_publication">
                        <button style={{display:'flex',alignItems:'center',gap:'4px',padding:'6px 12px',
                          background:'#0A3D62',color:'white',border:'none',borderRadius:'7px',
                          cursor:'pointer',fontSize:'11px',fontWeight:700}}>
                          <Download size={11}/> Download PDF
                        </button>
                      </ReadOnlyOverlay>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{textAlign:'center',padding:'28px',background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',borderRadius:'14px'}}>
          <div style={{fontSize:'15px',fontWeight:700,color:'white',marginBottom:'8px'}}>
            Access all 10 publications with a Professional subscription
          </div>
          <p style={{color:'rgba(226,242,223,0.75)',fontSize:'13px',marginBottom:'16px'}}>
            Including full data compendia, sector studies, and annual intelligence reports
          </p>
          <Link href="/contact" style={{display:'inline-flex',alignItems:'center',gap:'6px',
            padding:'11px 24px',background:'#74BB65',color:'white',borderRadius:'9px',
            textDecoration:'none',fontWeight:800,fontSize:'14px'}}>
            Get Professional Access <ArrowRight size={13}/>
          </Link>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
