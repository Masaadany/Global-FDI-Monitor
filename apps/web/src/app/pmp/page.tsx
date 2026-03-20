'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Globe4D from '@/components/Globe4D';

const REGIONS = ['Middle East & North Africa','Asia-Pacific','Europe','Americas','Africa','South Asia'];

const ECONOMIES: Record<string,{fdi:string,growth:string,flag:string,rank:number,topSectors:string[],freezones:number}> = {
  'UAE':           {fdi:'$25.3B',growth:'▲12%',flag:'🇦🇪',rank:5, topSectors:['Technology','Renewable Energy','Finance','Logistics'],freezones:45},
  'Saudi Arabia':  {fdi:'$18.2B',growth:'▲15%',flag:'🇸🇦',rank:15,topSectors:['Energy','Technology','Healthcare','Tourism'],freezones:8},
  'Qatar':         {fdi:'$8.7B', growth:'▲8%', flag:'🇶🇦',rank:22,topSectors:['Finance','Sports','Logistics','Real Estate'],freezones:3},
  'Egypt':         {fdi:'$9.2B', growth:'▲5%', flag:'🇪🇬',rank:52,topSectors:['Tourism','Agriculture','Manufacturing','Energy'],freezones:10},
  'Singapore':     {fdi:'$18.5B',growth:'▲6%', flag:'🇸🇬',rank:1, topSectors:['Finance','Technology','Biotech','Logistics'],freezones:12},
  'India':         {fdi:'$12.3B',growth:'▲9%', flag:'🇮🇳',rank:15,topSectors:['Technology','Manufacturing','Pharma','Renewables'],freezones:24},
  'Vietnam':       {fdi:'$8.9B', growth:'▲14%',flag:'🇻🇳',rank:16,topSectors:['Manufacturing','Technology','Agriculture','Tourism'],freezones:18},
  'Germany':       {fdi:'$14.2B',growth:'▲3%', flag:'🇩🇪',rank:4, topSectors:['Auto','Engineering','Tech','Chemicals'],freezones:0},
  'USA':           {fdi:'$28.5B',growth:'▲7%', flag:'🇺🇸',rank:3, topSectors:['Technology','Finance','Healthcare','Defense'],freezones:85},
};

const COMPANIES = [
  {name:'Microsoft Corporation',cic:'CIC-MSFT-001',hq:'🇺🇸 USA',sector:'Technology',ims:94.2,sci:96,grade:'PLATINUM',rev:'$245B',emp:'228K',
   history:[{y:2025,eco:'UAE',amt:'$5.2B'},{y:2023,eco:'UAE',amt:'$1.2B'}],signals:3},
  {name:'Google (Alphabet Inc.)',cic:'CIC-GOOG-001',hq:'🇺🇸 USA',sector:'Technology',ims:91.5,sci:94,grade:'PLATINUM',rev:'$307B',emp:'182K',
   history:[{y:2025,eco:'Singapore',amt:'$2.8B'},{y:2024,eco:'India',amt:'$1.5B'}],signals:2},
  {name:'Amazon Web Services',  cic:'CIC-AMZN-001',hq:'🇺🇸 USA',sector:'Technology',ims:89.8,sci:92,grade:'GOLD',    rev:'$620B',emp:'1.5M',
   history:[{y:2025,eco:'Saudi Arabia',amt:'$5.4B'},{y:2024,eco:'UAE',amt:'$1.8B'}],signals:4},
  {name:'Siemens AG',           cic:'CIC-SIEM-001',hq:'🇩🇪 Germany',sector:'Energy',  ims:85.2,sci:88,grade:'GOLD',    rev:'$84B',emp:'311K',
   history:[{y:2025,eco:'UAE',amt:'$2.1B'},{y:2023,eco:'Saudi Arabia',amt:'$0.9B'}],signals:2},
  {name:'CATL',                 cic:'CIC-CATL-001',hq:'🇨🇳 China',  sector:'Manufacturing',ims:88.5,sci:93,grade:'PLATINUM',rev:'$42B',emp:'98K',
   history:[{y:2025,eco:'Indonesia',amt:'$3.2B'},{y:2024,eco:'Vietnam',amt:'$1.1B'}],signals:3},
  {name:'BlackRock Inc.',       cic:'CIC-BLK-001', hq:'🇺🇸 USA',sector:'Finance',   ims:83.1,sci:79,grade:'SILVER',  rev:'$17.9B',emp:'20K',
   history:[{y:2025,eco:'UK',amt:'$0.9B'},{y:2024,eco:'UAE',amt:'$1.2B'}],signals:1},
];

const GOV_ENTITIES = [
  {name:'UAE Ministry of Economy',  type:'MINISTRY',  iso:'🇦🇪',sectors:['All Sectors'],website:'economy.gov.ae'},
  {name:'Dubai Investment Development Agency',type:'IPA',iso:'🇦🇪',sectors:['Technology','Finance','Logistics'],website:'investindubai.gov.ae'},
  {name:'Abu Dhabi Investment Office',type:'IPA',     iso:'🇦🇪',sectors:['Technology','Renewables','Healthcare'],website:'investinabudhabi.ae'},
  {name:'JAFZA — Jebel Ali Free Zone',type:'FREE_ZONE',iso:'🇦🇪',sectors:['Manufacturing','Logistics'],website:'jafza.ae'},
  {name:'DIFC — Dubai International Financial Centre',type:'FREE_ZONE',iso:'🇦🇪',sectors:['Finance','Technology'],website:'difc.ae'},
  {name:'INVEST Saudi',             type:'IPA',       iso:'🇸🇦',sectors:['All Sectors'],website:'invest.gov.sa'},
  {name:'Saudi Vision 2030 Office', type:'MINISTRY',  iso:'🇸🇦',sectors:['Technology','Tourism','Entertainment'],website:'vision2030.gov.sa'},
  {name:'Singapore EDB',            type:'IPA',       iso:'🇸🇬',sectors:['All Sectors'],website:'edb.gov.sg'},
];

const SECTOR_LEADS = [
  {name:'H.E. Omar Al Olama',  eco:'🇦🇪 UAE',  sector:'AI & Technology',  role:'Minister of State for Artificial Intelligence', entity:'UAE Ministry of AI'},
  {name:'H.E. Suhail Al Mazrouei',eco:'🇦🇪 UAE',sector:'Energy',          role:'Minister of Energy & Infrastructure',           entity:'UAE Ministry of Energy'},
  {name:'Abdullah Al-Swaha',   eco:'🇸🇦 Saudi', sector:'Technology',      role:'Minister of Communications & IT',               entity:'Saudi MCIT'},
  {name:'Abdulla Bin Touq',    eco:'🇦🇪 UAE',  sector:'Economy',          role:'Minister of Economy',                          entity:'UAE Ministry of Economy'},
];

const OPPORTUNITIES = [
  {title:'Green Hydrogen Hub',   eco:'🇦🇪 Abu Dhabi',    range:'$2B–$5B', match:96, sector:'Energy',     partners:'Masdar · ADNOC · Mubadala', jobs:1200},
  {title:'AI & Cloud Campus',    eco:'🇦🇪 Dubai South',  range:'$1.5B–$3B',match:94, sector:'Technology', partners:'Dubai Future Foundation · DEWA',jobs:3500},
  {title:'EV Giga-factory',      eco:'🇸🇦 Neom',         range:'$3B–$6B', match:91, sector:'Manufacturing',partners:'Vision 2030 · ACWA Power',   jobs:5000},
  {title:'FinTech Innovation Hub',eco:'🇶🇦 Qatar',        range:'$0.8B–$1.5B',match:88,sector:'Finance',  partners:'QFC · QIIB',               jobs:800},
];

const GRADE_C:  Record<string,string> = {PLATINUM:'#0A3D62',GOLD:'#74BB65',SILVER:'#696969'};
const GRADE_BG: Record<string,string> = {PLATINUM:'rgba(10,61,98,0.1)',GOLD:'rgba(116,187,101,0.12)',SILVER:'rgba(105,105,105,0.1)'};
const TYPE_C:   Record<string,string> = {MINISTRY:'#0A3D62',IPA:'#74BB65',FREE_ZONE:'#1B6CA8',SECTOR_LEAD:'#696969'};

export default function PMPPage() {
  const [tab,       setTab]       = useState<'destinations'|'opportunities'|'companies'|'gov'|'dossier'>('destinations');
  const [selected,  setSelected]  = useState<string[]>(['UAE','Saudi Arabia']);
  const [selCos,    setSelCos]    = useState<string[]>([]);
  const [coSearch,  setCoSearch]  = useState('');
  const [expanded,  setExpanded]  = useState<string|null>(null);

  const coFiltered = COMPANIES.filter(c =>
    !coSearch || c.name.toLowerCase().includes(coSearch.toLowerCase()) ||
    c.sector.toLowerCase().includes(coSearch.toLowerCase())
  );

  const TABS = [
    {id:'destinations',  label:'Destination Countries'},
    {id:'opportunities', label:'Investment Opportunities'},
    {id:'companies',     label:'Target Companies'},
    {id:'gov',           label:'Government Entities'},
    {id:'dossier',       label:'Mission Dossier'},
  ];

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'36px 24px 0'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto'}}>
          <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'8px'}}>
            Investment Promotion Mission Planning
          </h1>
          <p style={{color:'rgba(226,242,223,0.8)',marginBottom:'20px',fontSize:'14px'}}>
            Select destination economies · Match investors · Identify opportunities · Generate mission dossier
          </p>
          <div style={{display:'flex',gap:'0',overflowX:'auto'}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id as any)}
                style={{padding:'12px 18px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:600,whiteSpace:'nowrap',
                  borderBottom:tab===t.id?'3px solid #74BB65':'3px solid transparent',
                  background:'transparent',color:tab===t.id?'white':'rgba(226,242,223,0.6)',transition:'all 0.2s'}}>
                {t.label}
                {t.id==='companies' && selCos.length>0 && (
                  <span style={{marginLeft:'6px',background:'#74BB65',color:'white',fontSize:'10px',
                    padding:'1px 6px',borderRadius:'10px',fontWeight:800}}>{selCos.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1400px',margin:'0 auto',padding:'24px'}}>

        {/* DESTINATIONS */}
        {tab==='destinations' && (
          <div style={{display:'grid',gridTemplateColumns:'340px 1fr',gap:'20px'}}>
            {/* Selector */}
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              <div style={{background:'white',borderRadius:'12px',padding:'16px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
                <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'10px'}}>Select Destination Countries</div>
                <input placeholder="🔍 Search 215 countries…"
                  style={{width:'100%',padding:'8px 12px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                    fontSize:'12px',marginBottom:'10px',outline:'none',color:'#000',background:'white'}}/>
                {REGIONS.map(reg=>(
                  <div key={reg} style={{marginBottom:'8px'}}>
                    <div style={{fontSize:'11px',fontWeight:700,color:'#696969',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'4px'}}>{reg}</div>
                    {Object.entries(ECONOMIES).filter(([,v])=>{
                      if(reg==='Middle East & North Africa') return ['UAE','Saudi Arabia','Qatar','Egypt'].includes(Object.entries(ECONOMIES).find(([k])=>k)?.[0]||'');
                      return true;
                    }).slice(0,3).map(([eco,data])=>(
                      <label key={eco} style={{display:'flex',alignItems:'center',gap:'7px',padding:'5px 0',cursor:'pointer',fontSize:'12px'}}>
                        <input type="checkbox" checked={selected.includes(eco)}
                          onChange={()=>setSelected(s=>s.includes(eco)?s.filter(x=>x!==eco):[...s,eco])}/>
                        <span style={{fontSize:'16px'}}>{data.flag}</span>
                        <span style={{fontWeight:600,color:'#0A3D62',flex:1}}>{eco}</span>
                        <span style={{fontSize:'10px',color:'#696969'}}>{data.fdi}</span>
                        <span style={{fontSize:'10px',fontWeight:700,color:'#74BB65'}}>{data.growth}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Economy intelligence panels */}
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              {selected.map(eco=>{
                const data = ECONOMIES[eco];
                if(!data) return null;
                return (
                  <div key={eco} style={{background:'white',borderRadius:'12px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)',overflow:'hidden'}}>
                    <div style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'14px 18px',display:'flex',alignItems:'center',gap:'12px'}}>
                      <span style={{fontSize:'32px'}}>{data.flag}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'16px',fontWeight:800,color:'white'}}>{eco}</div>
                        <div style={{fontSize:'11px',color:'rgba(226,242,223,0.7)'}}>GFR Rank #{data.rank} · {data.fdi} FDI · {data.growth}</div>
                      </div>
                    </div>
                    <div style={{padding:'16px',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px',marginBottom:'12px'}}>
                      {[
                        {l:'FDI Inflows',v:data.fdi,c:'#0A3D62'},
                        {l:'Growth',v:data.growth,c:'#74BB65'},
                        {l:'GFR Rank',v:`#${data.rank}`,c:'#1B6CA8'},
                        {l:'Free Zones',v:`${data.freezones}`,c:'#696969'},
                      ].map(({l,v,c})=>(
                        <div key={l} style={{textAlign:'center',padding:'10px',borderRadius:'8px',background:'rgba(10,61,98,0.03)'}}>
                          <div style={{fontSize:'18px',fontWeight:800,color:c,fontFamily:'monospace'}}>{v}</div>
                          <div style={{fontSize:'10px',color:'#696969',marginTop:'2px'}}>{l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{padding:'0 16px 16px'}}>
                      <div style={{fontSize:'11px',fontWeight:700,color:'#696969',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'6px'}}>Top FDI Sectors</div>
                      <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                        {data.topSectors.map(s=>(
                          <span key={s} style={{fontSize:'11px',padding:'3px 10px',borderRadius:'12px',
                            background:'rgba(116,187,101,0.1)',color:'#0A3D62',fontWeight:600}}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* OPPORTUNITIES */}
        {tab==='opportunities' && (
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}>
              <h2 style={{fontSize:'16px',fontWeight:700,color:'#0A3D62'}}>Investment Opportunities · Matched to Your Mission</h2>
              <span style={{fontSize:'12px',fontWeight:700,color:'#74BB65'}}>🟢 3 NEW</span>
            </div>
            {OPPORTUNITIES.map(opp=>(
              <div key={opp.title} style={{background:'white',borderRadius:'12px',padding:'22px',
                boxShadow:'0 2px 8px rgba(10,61,98,0.06)',borderLeft:'4px solid #74BB65'}}>
                <div style={{display:'flex',gap:'16px',alignItems:'flex-start',flexWrap:'wrap'}}>
                  <div style={{flex:1,minWidth:'200px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px',flexWrap:'wrap'}}>
                      <h3 style={{fontSize:'16px',fontWeight:700,color:'#0A3D62',margin:0}}>{opp.title}</h3>
                      <span style={{fontSize:'11px',padding:'2px 8px',borderRadius:'10px',background:'rgba(116,187,101,0.12)',color:'#0A3D62',fontWeight:600}}>{opp.sector}</span>
                    </div>
                    <div style={{fontSize:'13px',color:'#696969',marginBottom:'8px'}}>{opp.eco} · {opp.range}</div>
                    <div style={{fontSize:'12px',color:'#696969'}}>Partners: <span style={{color:'#0A3D62',fontWeight:600}}>{opp.partners}</span></div>
                    <div style={{fontSize:'12px',color:'#696969',marginTop:'2px'}}>Est. jobs: <span style={{color:'#74BB65',fontWeight:700}}>{opp.jobs.toLocaleString()}</span></div>
                  </div>
                  <div style={{flexShrink:0,textAlign:'center'}}>
                    <div style={{fontSize:'24px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{opp.match}%</div>
                    <div style={{fontSize:'10px',color:'#696969'}}>Match Score</div>
                  </div>
                  <div style={{display:'flex',gap:'6px',flexWrap:'wrap',alignSelf:'flex-start'}}>
                    {['VIEW DETAILS','EXPRESS INTEREST','ADD TO MISSION'].map(a=>(
                      <button key={a} style={{padding:'7px 12px',border:'1px solid rgba(10,61,98,0.15)',borderRadius:'7px',
                        background:a==='ADD TO MISSION'?'#74BB65':'transparent',
                        color:a==='ADD TO MISSION'?'white':'#0A3D62',fontSize:'11px',fontWeight:700,cursor:'pointer'}}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COMPANIES */}
        {tab==='companies' && (
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div style={{display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap'}}>
              <input value={coSearch} onChange={e=>setCoSearch(e.target.value)}
                placeholder="🔍 Search companies, sectors…"
                style={{padding:'9px 14px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',fontSize:'13px',background:'white',color:'#000',outline:'none',minWidth:'240px'}}/>
              <div style={{fontSize:'13px',color:'#696969'}}>{coFiltered.length} results</div>
              {selCos.length>0 && (
                <span style={{fontSize:'13px',fontWeight:700,color:'#74BB65'}}>{selCos.length} selected for dossier</span>
              )}
            </div>

            {coFiltered.map(co=>(
              <div key={co.cic} style={{background:'white',borderRadius:'12px',
                boxShadow:'0 2px 8px rgba(10,61,98,0.06)',overflow:'hidden',
                border:selCos.includes(co.cic)?'2px solid #74BB65':'1px solid rgba(10,61,98,0.06)'}}>
                <div style={{padding:'16px 18px',display:'flex',gap:'14px',alignItems:'flex-start',cursor:'pointer'}}
                  onClick={()=>setExpanded(expanded===co.cic?null:co.cic)}>
                  <label style={{display:'flex',alignItems:'flex-start',gap:'10px',flex:1,cursor:'pointer'}}>
                    <input type="checkbox" checked={selCos.includes(co.cic)} style={{marginTop:'3px'}}
                      onChange={()=>setSelCos(s=>s.includes(co.cic)?s.filter(x=>x!==co.cic):[...s,co.cic])}
                      onClick={e=>e.stopPropagation()}/>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap',marginBottom:'4px'}}>
                        <span style={{fontSize:'15px',fontWeight:700,color:'#0A3D62'}}>{co.name}</span>
                        <span style={{fontSize:'11px',fontWeight:700,padding:'2px 8px',borderRadius:'10px',
                          background:GRADE_BG[co.grade],color:GRADE_C[co.grade]}}>{co.grade}</span>
                        <span style={{fontSize:'11px',padding:'2px 8px',borderRadius:'10px',background:'rgba(10,61,98,0.06)',color:'#0A3D62'}}>{co.sector}</span>
                      </div>
                      <div style={{fontSize:'12px',color:'#696969'}}>
                        HQ: {co.hq} · Rev: {co.rev} · {co.emp} employees · IMS: <b style={{color:'#74BB65'}}>{co.ims}</b> · SCI: <b style={{color:GRADE_C[co.grade]}}>{co.sci}%</b>
                      </div>
                    </div>
                  </label>
                  <span style={{color:'#696969',fontSize:'18px'}}>{expanded===co.cic?'▲':'▼'}</span>
                </div>
                {expanded===co.cic && (
                  <div style={{padding:'0 18px 16px',borderTop:'1px solid rgba(10,61,98,0.06)'}}>
                    <div style={{fontSize:'11px',fontWeight:700,color:'#696969',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'8px',marginTop:'12px'}}>
                      Investment History · {co.signals} active signals
                    </div>
                    <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                      {co.history.map(h=>(
                        <div key={h.y} style={{padding:'8px 14px',borderRadius:'8px',background:'rgba(10,61,98,0.04)',border:'1px solid rgba(10,61,98,0.08)',fontSize:'12px'}}>
                          <span style={{fontWeight:700,color:'#0A3D62'}}>{h.y}</span>
                          <span style={{color:'#696969',margin:'0 4px'}}>·</span>
                          <span style={{color:'#696969'}}>{h.eco}</span>
                          <span style={{color:'#696969',margin:'0 4px'}}>·</span>
                          <span style={{fontWeight:700,color:'#74BB65',fontFamily:'monospace'}}>{h.amt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* GOV ENTITIES + SECTOR LEADS */}
        {tab==='gov' && (
          <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
            <div>
              <h2 style={{fontSize:'16px',fontWeight:700,color:'#0A3D62',marginBottom:'14px'}}>Government Entities & Investment Authorities</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'12px'}}>
                {GOV_ENTITIES.map(g=>(
                  <div key={g.name} className="gfm-card" style={{padding:'16px',borderLeft:`4px solid ${TYPE_C[g.type]}`}}>
                    <div style={{display:'flex',gap:'8px',alignItems:'flex-start',marginBottom:'8px'}}>
                      <span style={{fontSize:'20px'}}>{g.iso}</span>
                      <div>
                        <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',lineHeight:'1.3',marginBottom:'3px'}}>{g.name}</div>
                        <span style={{fontSize:'10px',fontWeight:700,padding:'1px 7px',borderRadius:'10px',
                          background:`${TYPE_C[g.type]}12`,color:TYPE_C[g.type]}}>
                          {g.type.replace('_',' ')}
                        </span>
                      </div>
                    </div>
                    <div style={{fontSize:'11px',color:'#696969',marginBottom:'6px'}}>
                      {g.sectors.join(' · ')}
                    </div>
                    <a href={`https://${g.website}`} target="_blank" rel="noopener"
                      style={{fontSize:'11px',color:'#1B6CA8',fontWeight:600}}>↗ {g.website}</a>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 style={{fontSize:'16px',fontWeight:700,color:'#0A3D62',marginBottom:'14px'}}>Sector Leads</h2>
              <div className="gfm-card" style={{overflow:'hidden'}}>
                <table className="gfm-table">
                  <thead><tr><th>Name</th><th>Economy</th><th>Sector</th><th>Role</th><th>Entity</th></tr></thead>
                  <tbody>
                    {SECTOR_LEADS.map(sl=>(
                      <tr key={sl.name}>
                        <td style={{fontWeight:600,color:'#0A3D62'}}>{sl.name}</td>
                        <td>{sl.eco}</td>
                        <td><span style={{fontSize:'11px',padding:'2px 8px',borderRadius:'10px',background:'rgba(116,187,101,0.1)',color:'#0A3D62',fontWeight:600}}>{sl.sector}</span></td>
                        <td style={{fontSize:'12px',color:'#696969'}}>{sl.role}</td>
                        <td style={{fontSize:'12px',color:'#696969'}}>{sl.entity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DOSSIER */}
        {tab==='dossier' && (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div className="gfm-card" style={{padding:'24px'}}>
              <h2 style={{fontSize:'16px',fontWeight:700,color:'#0A3D62',marginBottom:'16px'}}>Mission Dossier Configuration</h2>
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
                  {[{l:'Destinations',v:selected.length},{l:'Companies',v:selCos.length},{l:'Opportunities',v:OPPORTUNITIES.length}].map(({l,v})=>(
                    <div key={l} style={{textAlign:'center',padding:'12px 20px',borderRadius:'10px',background:'rgba(116,187,101,0.08)'}}>
                      <div style={{fontSize:'24px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                      <div style={{fontSize:'11px',color:'#696969'}}>{l}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'8px'}}>Include Sections:</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                    {['Executive Summary','Destination Country Profiles','Sector Analysis','Selected Company Profiles','Investment History','Signals Analysis','Investment Opportunities','Meeting Preparation Guide','Risk Assessment'].map(s=>(
                      <label key={s} style={{display:'flex',alignItems:'center',gap:'5px',padding:'5px 10px',borderRadius:'8px',
                        background:'rgba(10,61,98,0.04)',fontSize:'12px',color:'#0A3D62',cursor:'pointer',fontWeight:600}}>
                        <input type="checkbox" defaultChecked/> {s}
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
                  <select style={{padding:'8px 12px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',fontSize:'13px',color:'#0A3D62'}}>
                    <option>Comprehensive (30–40 pages)</option><option>Brief (5–7 pages)</option>
                  </select>
                  <span style={{fontSize:'12px',color:'#696969'}}>Format: PDF ONLY · Watermarked & Secure</span>
                </div>
                <button className="gfm-btn-primary" style={{padding:'14px 28px',fontSize:'15px',fontWeight:700,alignSelf:'flex-start'}}>
                  Generate Mission Dossier →
                </button>
                <div style={{fontSize:'11px',color:'#696969'}}>30 intelligence credits · Estimated: 35–45 seconds</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
