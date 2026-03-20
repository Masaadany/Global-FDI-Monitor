'use client';
import { useState } from 'react';
import { Database, Shield, CheckCircle, Globe, TrendingUp, BarChart3, Search, Filter, Clock } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';
import SourceBadge from '@/components/SourceBadge';
import PreviewGate from '@/components/PreviewGate';
import Link from 'next/link';

const TIERS = [
  {tier:'T1',label:'Primary Official',color:'#0A3D62',bg:'rgba(10,61,98,0.07)',
   desc:'Authoritative primary sources: multilateral organisations, central banks, national statistics offices.',
   count:38, verif:'Z3 + SHA-256',
   sources:[
     {name:'IMF World Economic Outlook',     org:'IMF',     freq:'Quarterly',  ref:'GFM-SRC-000001'},
     {name:'UNCTAD World Investment Report',  org:'UNCTAD',  freq:'Annual',     ref:'GFM-SRC-000002'},
     {name:'World Bank WDI',                 org:'World Bank',freq:'Annual',   ref:'GFM-SRC-000003'},
     {name:'World Bank Doing Business',       org:'World Bank',freq:'Annual',   ref:'GFM-SRC-000004'},
     {name:'OECD FDI Statistics',            org:'OECD',    freq:'Quarterly',  ref:'GFM-SRC-000005'},
     {name:'OECD National Accounts',         org:'OECD',    freq:'Quarterly',  ref:'GFM-SRC-000006'},
     {name:'Bank for International Settlements',org:'BIS',  freq:'Quarterly',  ref:'GFM-SRC-000007'},
     {name:'UN Comtrade',                     org:'UN',      freq:'Monthly',    ref:'GFM-SRC-000008'},
   ]},
  {tier:'T2',label:'Research & Analytics',color:'#74BB65',bg:'rgba(116,187,101,0.07)',
   desc:'Leading research institutions, independent analytical bodies, and major index providers.',
   count:64, verif:'SHA-256',
   sources:[
     {name:'fDi Markets Intelligence',       org:'FT',       freq:'Real-time', ref:'GFM-SRC-000101'},
     {name:'IMD World Competitiveness',      org:'IMD',      freq:'Annual',    ref:'GFM-SRC-000102'},
     {name:'Global Innovation Index (GII)',  org:'WIPO',     freq:'Annual',    ref:'GFM-SRC-000103'},
     {name:'World Justice Project Rule of Law',org:'WJP',   freq:'Annual',    ref:'GFM-SRC-000104'},
     {name:'Transparency International CPI', org:'TI',       freq:'Annual',    ref:'GFM-SRC-000105'},
     {name:'Oxford Insights AI Government',  org:'Oxford',   freq:'Annual',    ref:'GFM-SRC-000106'},
     {name:'ITU Digital Development Index',  org:'ITU',      freq:'Annual',    ref:'GFM-SRC-000107'},
     {name:'Climate Change Performance Index',org:'CAN',     freq:'Annual',    ref:'GFM-SRC-000108'},
   ]},
  {tier:'T3',label:'Intelligence Feeds',color:'#1B6CA8',bg:'rgba(27,108,168,0.07)',
   desc:'Real-time news agencies, official press releases, regulatory filings, and diplomatic channels.',
   count:124, verif:'Extraction confidence',
   sources:[
     {name:'Reuters FDI Wire',               org:'Reuters',  freq:'Real-time', ref:'GFM-SRC-000201'},
     {name:'Bloomberg Terminal',             org:'Bloomberg',freq:'Real-time', ref:'GFM-SRC-000202'},
     {name:'SEC EDGAR Filings',              org:'SEC',      freq:'Real-time', ref:'GFM-SRC-000203'},
     {name:'European Commission Press',      org:'EC',       freq:'As-issued', ref:'GFM-SRC-000204'},
     {name:'IPA Official Announcements',     org:'Various',  freq:'As-issued', ref:'GFM-SRC-000205'},
     {name:'Central Bank Publications',      org:'Various',  freq:'Monthly',   ref:'GFM-SRC-000206'},
     {name:'Stock Exchange Filings',         org:'Various',  freq:'Real-time', ref:'GFM-SRC-000207'},
     {name:'Ministry of Investment Releases',org:'Various',  freq:'As-issued', ref:'GFM-SRC-000208'},
   ]},
  {tier:'T4',label:'Supplementary',color:'#696969',bg:'rgba(105,105,105,0.06)',
   desc:'Supplementary intelligence: industry associations, zone authorities, academic research, partner feeds.',
   count:78, verif:'Manual review',
   sources:[
     {name:'WAIPA Member Database',          org:'WAIPA',   freq:'Monthly',   ref:'GFM-SRC-000301'},
     {name:'SEZ Authority Data',             org:'Various', freq:'Monthly',   ref:'GFM-SRC-000302'},
     {name:'UNCTAD E-Regulations',           org:'UNCTAD',  freq:'Monthly',   ref:'GFM-SRC-000303'},
     {name:'Academic Research Database',     org:'Various', freq:'Quarterly', ref:'GFM-SRC-000304'},
     {name:'Industry Association Reports',   org:'Various', freq:'Quarterly', ref:'GFM-SRC-000305'},
     {name:'Embassy Trade Reports',          org:'Various', freq:'Monthly',   ref:'GFM-SRC-000306'},
     {name:'Partner Intelligence Feeds',     org:'Private', freq:'Real-time', ref:'GFM-SRC-000307'},
     {name:'Corporate Annual Reports',       org:'Various', freq:'Annual',    ref:'GFM-SRC-000308'},
   ]},
];

const PIPELINE_STEPS = [
  {n:1,title:'Ingestion',       color:'#0A3D62',desc:'Automated crawlers scrape 300+ sources every 2s. RSS, API, HTML parsing.'},
  {n:2,title:'Extraction',      color:'#74BB65',desc:'NLP models extract structured fields: economy, company, amount, sector, type.'},
  {n:3,title:'Validation',      color:'#1B6CA8',desc:'Schema validation, field completeness check, outlier detection.'},
  {n:4,title:'Z3 Verification', color:'#0A3D62',desc:'14 Z3 formal constraints for PLATINUM/GOLD candidates. Rejects on failure.'},
  {n:5,title:'SHA Provenance',  color:'#74BB65',desc:'SHA-256 hash seals verified records. Tamper-evident audit trail.'},
  {n:6,title:'SCI Scoring',     color:'#1B6CA8',desc:'5-component Signal Confidence Index assigned. Grade assigned PLATINUM–BRONZE.'},
];

export default function SourcesPage() {
  const [activeTier, setActiveTier] = useState('T1');
  const [search, setSearch] = useState('');

  const current = TIERS.find(t=>t.tier===activeTier);
  const allSources = current?.sources.filter(s=>!search||s.name.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/><TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'40px 24px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
              <Database size={16} color="#74BB65"/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>Data Sources</span>
            </div>
            <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'6px'}}>Source Registry</h1>
            <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>
              304 verified sources · 4-tier hierarchy · Z3 + SHA-256 verification · GFM-SRC reference codes
            </p>
          </div>
          <div style={{display:'flex',gap:'18px'}}>
            {[['304','Total Sources'],['T1–T4','Tiers'],['Z3','Top Tier'],['100%','Cited']].map(([v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:'18px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'24px',display:'flex',flexDirection:'column',gap:'20px'}}>
        {/* Tier cards */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px'}}>
          {TIERS.map(t=>(
            <div key={t.tier} onClick={()=>setActiveTier(t.tier)}
              style={{background:activeTier===t.tier?`linear-gradient(135deg,${t.color} 0%,${t.color}CC 100%)`:'white',
                borderRadius:'12px',padding:'18px',cursor:'pointer',
                boxShadow:activeTier===t.tier?`0 8px 24px ${t.color}30`:'0 2px 8px rgba(10,61,98,0.06)',
                border:activeTier===t.tier?'none':'1px solid rgba(10,61,98,0.07)',transition:'all 0.2s'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                <span style={{fontSize:'14px',fontWeight:900,
                  color:activeTier===t.tier?'white':t.color,fontFamily:'monospace'}}>{t.tier}</span>
                <span style={{fontSize:'11px',fontWeight:800,
                  color:activeTier===t.tier?'rgba(255,255,255,0.7)':'#696969'}}>{t.count} sources</span>
              </div>
              <div style={{fontSize:'13px',fontWeight:700,
                color:activeTier===t.tier?'white':'#0A3D62',marginBottom:'5px'}}>{t.label}</div>
              <div style={{fontSize:'11px',lineHeight:'1.5',
                color:activeTier===t.tier?'rgba(255,255,255,0.8)':'#696969'}}>{t.desc.slice(0,80)}…</div>
            </div>
          ))}
        </div>

        {/* Source list */}
        {current && (
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
              <Search size={13} color="#696969"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Filter sources…"
                style={{padding:'7px 12px',borderRadius:'7px',border:'1px solid rgba(10,61,98,0.15)',
                  fontSize:'12px',outline:'none',color:'#000',background:'white',width:'200px'}}/>
              <div style={{marginLeft:'8px',fontSize:'12px',color:'#696969'}}>
                Verification: <b style={{color:current.color}}>{current.verif}</b>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'10px'}}>
              {allSources.map(src=>(
                <div key={src.ref} style={{display:'flex',gap:'12px',alignItems:'flex-start',padding:'14px',
                  background:'white',borderRadius:'10px',boxShadow:'0 2px 8px rgba(10,61,98,0.05)',
                  border:'1px solid rgba(10,61,98,0.06)'}}>
                  <div style={{width:'8px',height:'8px',borderRadius:'50%',flexShrink:0,
                    background:current.color,marginTop:'5px'}}/>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'8px'}}>
                      <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62'}}>{src.name}</div>
                      <div style={{display:'flex',gap:'5px',alignItems:'center',flexShrink:0}}>
                        <span style={{fontSize:'10px',color:'#696969'}}>{src.freq}</span>
                        <SourceBadge source={src.name} date="2026" accessed="20 Mar 2026" refCode={src.ref}>
                          <span style={{fontSize:'10px',fontWeight:700,padding:'1px 6px',borderRadius:'6px',
                            background:`${current.color}10`,color:current.color,cursor:'default'}}>
                            {src.ref.split('-').pop()}
                          </span>
                        </SourceBadge>
                      </div>
                    </div>
                    <div style={{fontSize:'11px',color:'#696969',marginTop:'2px'}}>{src.org}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pipeline */}
        <PreviewGate feature="full_profile">
          <div className="gfm-card" style={{padding:'24px'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
              <Shield size={14} color="#74BB65"/> 6-Step Verification Pipeline
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'10px'}}>
              {PIPELINE_STEPS.map(step=>(
                <div key={step.n} style={{textAlign:'center',padding:'14px 10px',borderRadius:'10px',
                  background:`${step.color}05`,border:`1px solid ${step.color}15`}}>
                  <div style={{width:'32px',height:'32px',borderRadius:'50%',background:step.color,
                    color:'white',display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:'13px',fontWeight:800,margin:'0 auto 8px'}}>
                    {step.n}
                  </div>
                  <div style={{fontSize:'12px',fontWeight:700,color:step.color,marginBottom:'5px'}}>{step.title}</div>
                  <div style={{fontSize:'10px',color:'#696969',lineHeight:'1.4'}}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </PreviewGate>
      </div>
      <Footer/>
    </div>
  );
}
