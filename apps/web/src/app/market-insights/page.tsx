'use client';
import { useState } from 'react';
import { BookOpen, TrendingUp, Globe, Filter, Search, ArrowRight, BarChart3, Tag, Calendar, Clock } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import PreviewGate from '@/components/PreviewGate';
import Footer from '@/components/Footer';
import Link from 'next/link';

const CATEGORIES = ['All','Market Brief','Sector Analysis','Country Intelligence','Policy Update','FDI Data','Signal Watch'];

const INSIGHTS = [
  {id:'I001',type:'Market Brief',   title:'MENA FDI Outlook Q1 2026: Technology & Renewables Lead Growth',      date:'Mar 18 2026',readMin:8, featured:true,  region:'MENA',       color:'#0A3D62'},
  {id:'I002',type:'Signal Watch',   title:'PLATINUM Signals Surge: Microsoft, AWS, CATL Drive $14B in 3 Weeks', date:'Mar 15 2026',readMin:5, featured:true,  region:'Global',     color:'#74BB65'},
  {id:'I003',type:'Sector Analysis',title:'EV Battery Manufacturing: Top 10 Investment Destinations 2026',       date:'Mar 12 2026',readMin:12,featured:false, region:'Asia',       color:'#1B6CA8'},
  {id:'I004',type:'Policy Update',  title:'Saudi Arabia Raises FDI Cap in Digital Economy Sectors to 100%',     date:'Mar 10 2026',readMin:4, featured:false, region:'MENA',       color:'#2E86AB'},
  {id:'I005',type:'Country Intelligence','title':'Vietnam 2026: Why Southeast Asia\'s Manufacturing Star Keeps Rising',date:'Mar 8 2026',readMin:10,featured:false,region:'Asia', color:'#0A3D62'},
  {id:'I006',type:'FDI Data',       title:'Global FDI Flows Q4 2025: Final Data Shows 14% YoY Growth',           date:'Mar 5 2026',readMin:6, featured:false, region:'Global',     color:'#74BB65'},
  {id:'I007',type:'Market Brief',   title:'UAE vs Saudi Arabia: Investment Climate Comparison 2026',             date:'Mar 3 2026',readMin:9, featured:false, region:'MENA',       color:'#0A3D62'},
  {id:'I008',type:'Sector Analysis',title:'Renewable Energy FDI: The $2.2T Opportunity to 2050',               date:'Feb 28 2026',readMin:14,featured:false, region:'Global',    color:'#74BB65'},
  {id:'I009',type:'Signal Watch',   title:'Weekly Signal Digest: 48 New Signals Across 22 Economies',           date:'Feb 24 2026',readMin:3, featured:false, region:'Global',     color:'#1B6CA8'},
  {id:'I010',type:'Policy Update',  title:'New RCEP Implementation Rules: Impact on Manufacturing FDI',          date:'Feb 20 2026',readMin:7, featured:false, region:'Asia',       color:'#2E86AB'},
];

const TYPE_ICONS: Record<string,string> = {
  'Market Brief':'📊','Sector Analysis':'⚙','Country Intelligence':'🌍',
  'Policy Update':'📋','FDI Data':'📈','Signal Watch':'⚡'
};



export default function MarketInsightsPage() {
  const [cat,    setCat]    = useState('All');
  const [search, setSearch] = useState('');

  const filtered = INSIGHTS.filter(i=>{
    const mc = cat==='All'||i.type===cat;
    const ms = !search||i.title.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });
  const featured = filtered.filter(i=>i.featured);
  const regular  = filtered.filter(i=>!i.featured);

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'40px 24px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
              <BookOpen size={16} color="#74BB65"/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>Resources & Insights</span>
            </div>
            <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'6px'}}>FDI Intelligence Hub</h1>
            <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>
              Market briefs · Sector deep dives · Policy updates · Signal watches · Country intelligence
            </p>
          </div>
          <div style={{display:'flex',gap:'20px'}}>
            {[['10+','This month'],['6','Categories'],['Weekly','Briefings']].map(([v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:'20px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'24px',display:'flex',flexDirection:'column',gap:'20px'}}>
        {/* Filters */}
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center'}}>
          <Filter size={14} color="#696969"/>
          <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
            {CATEGORIES.map(c=>(
              <button key={c} onClick={()=>setCat(c)}
                style={{padding:'6px 13px',borderRadius:'16px',border:'none',cursor:'pointer',
                  fontSize:'12px',fontWeight:700,transition:'all 0.15s',
                  background:cat===c?'#0A3D62':'rgba(10,61,98,0.07)',
                  color:cat===c?'white':'#0A3D62'}}>
                {c!=='All' && <span style={{marginRight:'4px'}}>{TYPE_ICONS[c]}</span>}{c}
              </button>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'6px',marginLeft:'auto'}}>
            <Search size={13} color="#696969"/>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search insights…"
              style={{padding:'6px 12px',borderRadius:'7px',border:'1px solid rgba(10,61,98,0.15)',
                fontSize:'12px',outline:'none',color:'#000',background:'white',width:'160px'}}/>
          </div>
          <span style={{fontSize:'12px',color:'#696969'}}>{filtered.length} articles</span>
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'16px'}}>
            {featured.map(ins=>(
              <div key={ins.id} style={{background:`linear-gradient(135deg,${ins.color} 0%,${ins.color}CC 100%)`,
                borderRadius:'14px',padding:'28px',position:'relative',overflow:'hidden',cursor:'pointer'}}>
                <div style={{position:'absolute',top:'-30px',right:'-30px',width:'150px',height:'150px',
                  borderRadius:'50%',background:'rgba(255,255,255,0.06)'}}/>
                <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'10px'}}>
                  <span>{TYPE_ICONS[ins.type]}</span>
                  <span style={{fontSize:'10px',fontWeight:800,color:'rgba(255,255,255,0.8)',
                    textTransform:'uppercase',letterSpacing:'0.07em'}}>{ins.type} · FEATURED</span>
                </div>
                <h3 style={{fontSize:'16px',fontWeight:700,color:'white',lineHeight:'1.4',marginBottom:'12px'}}>{ins.title}</h3>
                <div style={{display:'flex',gap:'12px',alignItems:'center',fontSize:'11px',color:'rgba(255,255,255,0.65)'}}>
                  <span style={{display:'flex',alignItems:'center',gap:'3px'}}><Calendar size={10}/>{ins.date}</span>
                  <span style={{display:'flex',alignItems:'center',gap:'3px'}}><Clock size={10}/>{ins.readMin} min read</span>
                  <span style={{display:'flex',alignItems:'center',gap:'3px'}}><Globe size={10}/>{ins.region}</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'4px',marginTop:'14px',fontSize:'12px',
                  fontWeight:700,color:'rgba(255,255,255,0.85)'}}>
                  Read more <ArrowRight size={12}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Article grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
          {regular.map(ins=>(
            <div key={ins.id} style={{background:'white',borderRadius:'12px',padding:'18px',
              boxShadow:'0 2px 8px rgba(10,61,98,0.06)',cursor:'pointer',
              borderTop:`3px solid ${ins.color}`,transition:'all 0.15s'}}
              onMouseEnter={e=>(e.currentTarget.style.boxShadow='0 6px 20px rgba(10,61,98,0.12)')}
              onMouseLeave={e=>(e.currentTarget.style.boxShadow='0 2px 8px rgba(10,61,98,0.06)')}>
              <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'8px'}}>
                <span>{TYPE_ICONS[ins.type]}</span>
                <span style={{fontSize:'10px',fontWeight:700,color:ins.color,textTransform:'uppercase',letterSpacing:'0.05em'}}>{ins.type}</span>
              </div>
              <h4 style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',lineHeight:'1.45',marginBottom:'10px'}}>{ins.title}</h4>
              <div style={{display:'flex',gap:'10px',fontSize:'10px',color:'#696969',flexWrap:'wrap'}}>
                <span style={{display:'flex',alignItems:'center',gap:'3px'}}><Calendar size={9}/>{ins.date}</span>
                <span style={{display:'flex',alignItems:'center',gap:'3px'}}><Clock size={9}/>{ins.readMin} min</span>
                <span style={{display:'flex',alignItems:'center',gap:'3px'}}><Globe size={9}/>{ins.region}</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'4px',marginTop:'12px',
                fontSize:'11px',fontWeight:700,color:ins.color}}>
                Read more <ArrowRight size={11}/>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',borderRadius:'14px',padding:'32px',
          display:'flex',justifyContent:'space-between',alignItems:'center',gap:'20px',flexWrap:'wrap'}}>
          <div>
            <div style={{fontSize:'15px',fontWeight:700,color:'white',marginBottom:'5px'}}>
              Get weekly FDI intelligence delivered to your inbox
            </div>
            <div style={{fontSize:'12px',color:'rgba(226,242,223,0.7)'}}>
              Join 2,400+ investment professionals. No spam, unsubscribe anytime.
            </div>
          </div>
          <div style={{display:'flex',gap:'0'}}>
            <input placeholder="your@email.com"
              style={{padding:'11px 16px',borderRadius:'8px 0 0 8px',border:'none',
                fontSize:'13px',background:'rgba(255,255,255,0.1)',color:'white',
                outline:'none',minWidth:'200px'}}/>
            <button style={{padding:'11px 18px',background:'#74BB65',color:'white',border:'none',
              borderRadius:'0 8px 8px 0',cursor:'pointer',fontSize:'13px',fontWeight:700,
              display:'flex',alignItems:'center',gap:'5px',whiteSpace:'nowrap'}}>
              Subscribe <ArrowRight size={13}/>
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
