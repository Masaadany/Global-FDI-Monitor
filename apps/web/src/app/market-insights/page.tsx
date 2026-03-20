'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import PreviewGate from '@/components/PreviewGate';

const TYPES    = ['All','Sector Analysis','Regional Brief','Policy Note','Investment Signal','Market Insight','Country Report'];
const TOPICS   = ['All Topics','Technology','Energy','Real Estate','Finance','Manufacturing','Infrastructure','Healthcare'];
const REGIONS2 = ['All Regions','MENA','Asia-Pacific','Europe','Americas','Africa','South Asia'];

const PUBS = [
  { id:1,  type:'Sector Analysis',  topic:'Technology',      region:'MENA',          title:'UAE ICT Investment Surge Q1 2026',                  date:'2026-03-18', readMin:5,  icon:'💻', featured:true,
    summary:'Technology FDI into the UAE surged 45% in Q1 2026, driven by cloud and AI infrastructure projects from Microsoft, Oracle and AWS.' },
  { id:2,  type:'Sector Analysis',  topic:'Energy',          region:'Asia-Pacific',   title:'Southeast Asia Battery Manufacturing Boom',           date:'2026-03-15', readMin:7,  icon:'⚡', featured:true,
    summary:'CATL, BYD and Samsung SDI are driving $12B in greenfield battery manufacturing FDI across Indonesia, Vietnam and Thailand.' },
  { id:3,  type:'Regional Brief',   topic:'All Topics',      region:'MENA',           title:'GCC Investment Climate Report Q1 2026',               date:'2026-03-12', readMin:8,  icon:'🌍', featured:false,
    summary:'GCC economies attracted $42.5B in FDI in Q1 2026, with UAE and Saudi Arabia accounting for 72% of total inflows.' },
  { id:4,  type:'Market Insight',   topic:'Technology',      region:'All Regions',    title:'GFR Quarterly Update: FRONTIER Movers',              date:'2026-03-10', readMin:6,  icon:'🏆', featured:false,
    summary:'UAE (+3 ranks), Saudi Arabia (+8) and Vietnam (+6) achieved the strongest GFR improvements in Q1 2026.' },
  { id:5,  type:'Policy Note',      topic:'Energy',          region:'Europe',         title:'EU Green Deal FDI Implications 2026',                 date:'2026-03-08', readMin:9,  icon:'🌱', featured:false,
    summary:'The EU Green Deal is reshaping FDI patterns in renewable energy, with offshore wind investments up 38% year-on-year.' },
  { id:6,  type:'Investment Signal', topic:'Finance',        region:'Asia-Pacific',   title:'Singapore FinTech Investment Signal Analysis',        date:'2026-03-05', readMin:4,  icon:'💰', featured:false,
    summary:'Singapore recorded 12 PLATINUM-grade FinTech signals in February 2026, signalling continued dominance in APAC financial services FDI.' },
  { id:7,  type:'Regional Brief',   topic:'Manufacturing',   region:'Asia-Pacific',   title:'ASEAN Manufacturing FDI Review 2026',                 date:'2026-02-28', readMin:10, icon:'🏭', featured:false,
    summary:'ASEAN attracted $38.2B in manufacturing FDI in 2025, with Vietnam and Indonesia leading greenfield investment activity.' },
  { id:8,  type:'Country Report',   topic:'All Topics',      region:'MENA',           title:'Saudi Vision 2030 FDI Progress Report',              date:'2026-02-25', readMin:12, icon:'🇸🇦', featured:false,
    summary:'Saudi Arabia achieved 78% of its FDI targets under Vision 2030 by end of 2025, with the non-oil sector contributing 65% of new inflows.' },
];

const TYPE_C: Record<string,string> = {
  'Sector Analysis':'#0A3D62','Regional Brief':'#1B6CA8','Policy Note':'#74BB65',
  'Investment Signal':'#E57373','Market Insight':'#696969','Country Report':'#74BB65'
};

export default function MarketInsightsPage() {
  const [type,   setType]   = useState('All');
  const [topic,  setTopic]  = useState('All Topics');
  const [region, setRegion] = useState('All Regions');
  const [search, setSearch] = useState('');

  const filtered = PUBS.filter(p => {
    const mt = type   === 'All'         || p.type   === type;
    const mp = topic  === 'All Topics'  || p.topic  === topic || p.topic === 'All Topics';
    const mr = region === 'All Regions' || p.region === region || p.region === 'All Regions';
    const ms = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return mt && mp && mr && ms;
  });

  const featured = filtered.filter(p=>p.featured);
  const rest     = filtered.filter(p=>!p.featured);

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'40px 24px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <h1 style={{fontSize:'32px',fontWeight:800,color:'white',marginBottom:'6px'}}>Resources & Insights</h1>
          <p style={{color:'rgba(226,242,223,0.8)',marginBottom:'20px'}}>
            Sector analysis · Regional briefs · Policy notes · Investment signals · Country reports
          </p>
          {/* Search + filters */}
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'center'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="🔍 Search publications…"
              style={{padding:'9px 16px',borderRadius:'8px',border:'none',fontSize:'13px',
                background:'rgba(255,255,255,0.15)',color:'white',outline:'none',minWidth:'200px'}}/>
            {[
              [TYPES, type, setType, 'Type'],
              [TOPICS, topic, setTopic, 'Topic'],
              [REGIONS2, region, setRegion, 'Region'],
            ].map(([opts,val,setter,label]:[any,any,any,any])=>(
              <select key={label} value={val} onChange={e=>setter(e.target.value)}
                style={{padding:'8px 12px',borderRadius:'8px',border:'none',fontSize:'13px',
                  background:'rgba(255,255,255,0.15)',color:'white',cursor:'pointer',outline:'none'}}>
                {opts.map((o:string)=><option key={o} style={{background:'#0A3D62'}}>{o}</option>)}
              </select>
            ))}
            <span style={{marginLeft:'auto',fontSize:'13px',color:'rgba(226,242,223,0.7)'}}>{filtered.length} publications</span>
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'28px 24px'}}>

        {/* Featured */}
        {featured.length > 0 && (
          <div style={{marginBottom:'28px'}}>
            <div style={{fontSize:'12px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'#0A3D62',marginBottom:'14px'}}>
              Featured Publications
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              {featured.map(pub=>(
                <div key={pub.id} className="gfm-card" style={{padding:'24px',borderTop:'4px solid #74BB65'}}>
                  <div style={{display:'flex',gap:'12px',marginBottom:'12px'}}>
                    <span style={{fontSize:'32px'}}>{pub.icon}</span>
                    <div>
                      <span style={{fontSize:'11px',fontWeight:700,padding:'2px 8px',borderRadius:'12px',
                        background:`${TYPE_C[pub.type]}12`,color:TYPE_C[pub.type],display:'inline-block',marginBottom:'5px'}}>
                        {pub.type}
                      </span>
                      <h3 style={{fontSize:'16px',fontWeight:700,color:'#0A3D62',lineHeight:'1.3',margin:0}}>{pub.title}</h3>
                    </div>
                  </div>
                  <p style={{fontSize:'13px',color:'#696969',lineHeight:'1.6',marginBottom:'14px'}}>{pub.summary}</p>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{fontSize:'11px',color:'#696969'}}>{pub.date} · {pub.readMin} min read · {pub.region}</div>
                    <button className="gfm-btn-primary" style={{padding:'7px 16px',fontSize:'12px'}}>Read More →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All publications */}
        <div style={{fontSize:'12px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'#0A3D62',marginBottom:'14px'}}>
          {type==='All' && region==='All Regions' && topic==='All Topics' && !search ? 'Recent Publications' : `${filtered.length} Results`}
        </div>
        <PreviewGate feature="downloads">
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px'}}>
            {(featured.length>0 ? rest : filtered).map(pub=>(
              <div key={pub.id} className="gfm-card" style={{padding:'18px',cursor:'pointer'}}>
                <div style={{fontSize:'28px',marginBottom:'10px'}}>{pub.icon}</div>
                <span style={{fontSize:'10px',fontWeight:700,padding:'2px 7px',borderRadius:'10px',
                  background:`${TYPE_C[pub.type]}12`,color:TYPE_C[pub.type],display:'inline-block',marginBottom:'7px'}}>
                  {pub.type}
                </span>
                <h4 style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',lineHeight:'1.3',marginBottom:'8px'}}>{pub.title}</h4>
                <p style={{fontSize:'11px',color:'#696969',lineHeight:'1.5',marginBottom:'10px'}}>{pub.summary.slice(0,80)}…</p>
                <div style={{fontSize:'10px',color:'#696969'}}>{pub.date} · {pub.readMin} min</div>
              </div>
            ))}
          </div>
        </PreviewGate>

        {filtered.length === 0 && (
          <div style={{textAlign:'center',padding:'48px',color:'#696969'}}>
            <div style={{fontSize:'40px',marginBottom:'12px'}}>📚</div>
            <div style={{fontWeight:700,color:'#0A3D62'}}>No publications found</div>
            <div style={{fontSize:'13px',marginTop:'4px'}}>Try adjusting your filters</div>
          </div>
        )}
      </div>
    </div>
  );
}
