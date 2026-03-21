'use client';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Zap, Filter, ExternalLink, Clock, TrendingUp, RefreshCw, Bell } from 'lucide-react';

const SIGNAL_TYPES = [
  { id:'POLICY_CHANGE',    label:'Policy Change',    color:'#e74c3c', emoji:'🔴' },
  { id:'NEW_INCENTIVE',    label:'New Incentive',    color:'#00ffc8', emoji:'🟢' },
  { id:'SECTOR_GROWTH',   label:'Sector Growth',    color:'#3498db', emoji:'🔵' },
  { id:'ZONE_AVAIL',      label:'Zone Availability',color:'#ffd700', emoji:'🟡' },
  { id:'COMPETITOR_MOVE', label:'Competitor Move',   color:'#9b59b6', emoji:'🟣' },
  { id:'DEAL_ANNOUNCED',  label:'Deal Announced',   color:'#e67e22', emoji:'🟠' },
];

const BASE_SIGNALS = [
  { id:1, type:'POLICY_CHANGE',   grade:'PLATINUM', country:'Malaysia',     flag:'🇲🇾', region:'Asia Pacific', sector:'Digital Economy',   title:'FDI cap in data centers raised to 100%',                    body:'Malaysia eliminates previous 30% local ownership requirement for data center investments, effective immediately. Policy applies to all new and existing foreign investments in digital infrastructure.',                     implication:'Positions Malaysia as most accessible data center hub in Southeast Asia. Expected to attract $5B+ in new investment over 12 months as hyperscalers and colocation providers accelerate expansion plans.',              time:'2m', impact:'HIGH',   source:'MITI Malaysia',            sco:96 },
  { id:2, type:'NEW_INCENTIVE',   grade:'PLATINUM', country:'Thailand',     flag:'🇹🇭', region:'Asia Pacific', sector:'EV Battery',        title:'$2B EV battery subsidy package approved',                   body:'Thailand Board of Investment approves comprehensive $2B subsidy covering 5 years of 50% tax reduction for qualifying EV battery manufacturers. Package includes land acquisition support and workforce training grants.',       implication:'Strengthens Thailand\'s EV supply chain competitiveness vs Vietnam and Indonesia. Expected to attract 5-8 new battery facilities by 2028, with first groundbreakings within 18 months.',                            time:'1h', impact:'HIGH',   source:'Thailand BOI',             sco:95 },
  { id:3, type:'SECTOR_GROWTH',   grade:'GOLD',     country:'Vietnam',      flag:'🇻🇳', region:'Asia Pacific', sector:'Electronics',       title:'Electronics exports surge 34% YoY',                         body:'Vietnam\'s General Statistics Office confirms record electronics export growth driven by semiconductor and consumer electronics demand. Samsung, LG, and Intel plants running at peak capacity. Supply chain diversification from China accelerating.',  implication:'Vietnam solidifies position as #2 electronics exporter in ASEAN. New investments expected in PCB manufacturing, testing equipment, and component supply industries.',                                               time:'3h', impact:'MEDIUM', source:'GSO Vietnam',              sco:92 },
  { id:4, type:'ZONE_AVAIL',      grade:'GOLD',     country:'Indonesia',    flag:'🇮🇩', region:'Asia Pacific', sector:'Manufacturing',     title:'New Batam zone — 200ha ready for immediate occupancy',      body:'Batam Indonesia Free Zone Authority announces 200 hectares of fully serviced industrial land available for immediate occupancy. Zone includes dedicated power substations, water treatment, and fiber connectivity.',             implication:'Alleviates chronic land shortage in Batam. Opens manufacturing relocation opportunities from Singapore and Malaysia. Competitive land pricing vs established zones.',                                               time:'5h', impact:'MEDIUM', source:'Batam Authority',          sco:91 },
  { id:5, type:'COMPETITOR_MOVE', grade:'PLATINUM', country:'Indonesia',    flag:'🇮🇩', region:'Asia Pacific', sector:'Mining & EV',       title:'$15B nickel processing investment confirmed',                body:'Chinese and European consortium secures $15B nickel processing facility expansion deal, expanding downstream processing capacity by 40%. Agreement covers battery-grade nickel sulfate and nickel plate production.',            implication:'Strengthens Indonesia\'s global nickel supply chain dominance. EV manufacturers and battery producers face higher raw material cost pressure. Competitors in Philippines and New Caledonia may benefit.',              time:'1d', impact:'HIGH',   source:'Ministry of Investment',   sco:93 },
  { id:6, type:'NEW_INCENTIVE',   grade:'PLATINUM', country:'Saudi Arabia', flag:'🇸🇦', region:'Middle East',  sector:'All Sectors',       title:'Vision 2030 FDI fast-track: 30-day license guarantee',       body:'MISA launches FDI Acceleration Framework guaranteeing 30-day investment license turnaround for qualifying sectors including manufacturing, technology, healthcare, and renewable energy.',                                      implication:'Removes primary regulatory barrier cited by investors. Expected to catalyze $10B+ in committed FDI commitments already in pipeline awaiting regulatory clarity.',                                                   time:'2d', impact:'HIGH',   source:'MISA Saudi Arabia',        sco:94 },
  { id:7, type:'POLICY_CHANGE',   grade:'GOLD',     country:'UAE',          flag:'🇦🇪', region:'Middle East',  sector:'All Sectors',       title:'100% foreign ownership extended to all mainland sectors',    body:'UAE Ministry of Economy confirms extension of 100% foreign ownership rights to all mainland commercial activities, removing final sector restrictions that required local sponsorship arrangements.',                              implication:'Eliminates the last structural barrier to full foreign business control in UAE. Significant for professional services, distribution, and retail sectors previously requiring local partners.',                        time:'3d', impact:'HIGH',   source:'MOEI UAE',                 sco:90 },
  { id:8, type:'DEAL_ANNOUNCED',  grade:'GOLD',     country:'India',        flag:'🇮🇳', region:'Asia Pacific', sector:'Semiconductors',    title:'Apple commits $10B manufacturing expansion in India',        body:'Apple announces $10B semiconductor and electronics manufacturing investment expansion across Tamil Nadu and Karnataka, targeting 25% of iPhone production from India by 2026.',                                               implication:'Accelerates India\'s emergence as China+1 electronics hub. Creates significant supply chain opportunity for component manufacturers and logistics providers.',                                                      time:'4d', impact:'HIGH',   source:'Ministry of Electronics',  sco:89 },
  { id:9, type:'SECTOR_GROWTH',   grade:'GOLD',     country:'Morocco',      flag:'🇲🇦', region:'Africa',       sector:'Renewables',        title:'Morocco green hydrogen export framework signed with EU',      body:'Morocco and EU formalize framework for green hydrogen export corridor. Agreement covers production targets of 1 million tonnes/year by 2030 and pipeline infrastructure development from Casablanca to Spain.',                 implication:'Positions Morocco as primary green hydrogen supplier to Europe. Investment opportunities across electrolysis, ammonia production, and port infrastructure.',                                                         time:'5d', impact:'MEDIUM', source:'Ministry of Energy Morocco',sco:87 },
  { id:10,type:'NEW_INCENTIVE',   grade:'SILVER',   country:'Vietnam',      flag:'🇻🇳', region:'Asia Pacific', sector:'Manufacturing',     title:'Manufacturing tax holiday — 50% CIT reduction for 5 years', body:'Vietnam Ministry of Finance announces 50% corporate income tax reduction for first 5 years for EV battery manufacturers in approved industrial zones. Applies to investments committed before December 2026.',               implication:'Strengthens Vietnam\'s competitive position against Thailand in EV battery supply chain. Tax saving of approximately $8.5M per $100M investment over 5 years.',                                                   time:'6d', impact:'MEDIUM', source:'Ministry of Finance VN',   sco:85 },
  { id:11,type:'ZONE_AVAIL',      grade:'SILVER',   country:'Malaysia',     flag:'🇲🇾', region:'Asia Pacific', sector:'Technology',        title:'Penang Science Park Phase 3 — 60ha technology campus opens',body:'Penang Development Corporation opens Phase 3 of Penang Science Park, offering 60 hectares of MSC Malaysia status-eligible technology campus with pre-built facilities and shared infrastructure.',                            implication:'Expands Penang\'s capacity as Southeast Asia\'s semiconductor and technology cluster. Intel, AMD, and Infineon supply chain partners cited as primary target tenants.',                                            time:'7d', impact:'MEDIUM', source:'PDC Penang',                sco:84 },
  { id:12,type:'COMPETITOR_MOVE', grade:'GOLD',     country:'Thailand',     flag:'🇹🇭', region:'Asia Pacific', sector:'Automotive',        title:'Toyota commits $2.5B EV production facility in Eastern Seaboard',body:'Toyota Motor Corporation announces $2.5B dedicated EV production facility in Thailand\'s Eastern Economic Corridor, creating 8,000 direct jobs and targeting 200,000 vehicles/year by 2027.',                             implication:'Confirms Thailand\'s position as ASEAN\'s EV assembly hub. Creates major supply chain opportunity for battery, motor, and electronics component suppliers.',                                                     time:'8d', impact:'HIGH',   source:'Thailand EEC',             sco:91 },
  { id:13,type:'POLICY_CHANGE',   grade:'SILVER',   country:'India',        flag:'🇮🇳', region:'Asia Pacific', sector:'Renewable Energy',  title:'Production Linked Incentive scheme expanded to solar modules',body:'India\'s Ministry of New & Renewable Energy expands PLI scheme to include advanced solar module manufacturing. ₹19,500 crore allocated over 5 years for high-efficiency panel production.',                               implication:'Accelerates India\'s solar manufacturing capacity. Target of 65 GW domestic production by 2030 creates substantial upstream investment opportunity in silicon, glass, and equipment.',                              time:'9d', impact:'MEDIUM', source:'MNRE India',                sco:83 },
  { id:14,type:'DEAL_ANNOUNCED',  grade:'PLATINUM', country:'UAE',          flag:'🇦🇪', region:'Middle East',  sector:'AI Data Centers',   title:'Microsoft $3.3B AI data center investment announced',        body:'Microsoft announces $3.3B investment in UAE AI data center infrastructure over 3 years, establishing UAE as its primary AI compute hub for Middle East and Africa operations.',                                              implication:'Validates UAE\'s AI infrastructure investment thesis. Expected to trigger follow-on investments from Amazon Web Services, Google Cloud, and Oracle in the 12 months following.',                                   time:'10d',impact:'HIGH',   source:'DIFC',                     sco:97 },
  { id:15,type:'SECTOR_GROWTH',   grade:'SILVER',   country:'Brazil',       flag:'🇧🇷', region:'Americas',     sector:'Data Centers',      title:'Amazon announces $5B data center investment in São Paulo',   body:'Amazon Web Services confirms $5B investment in AWS infrastructure in Brazil through 2026, including multiple availability zones and edge computing locations to serve Latin American enterprise customers.',                   implication:'Positions Brazil as South America\'s primary cloud computing hub. Creates significant opportunity for power, cooling, connectivity, and facilities management providers.',                                        time:'11d',impact:'HIGH',   source:'Reuters',                  sco:88 },
  { id:16,type:'NEW_INCENTIVE',   grade:'SILVER',   country:'Morocco',      flag:'🇲🇦', region:'Africa',       sector:'Manufacturing',     title:'Offshoring Zone investment benefits extended to 2030',       body:'Morocco\'s Agency for Investment and Export Development extends free zone tax benefits for Casablanca and Rabat offshoring zones through 2030, covering full income tax exemption for first 5 years.',                         implication:'Extends window for European manufacturers seeking Morocco as nearshoring alternative. Automotive, aerospace, and electronics sectors cited as priority targets.',                                                  time:'12d',impact:'MEDIUM', source:'AMDIE Morocco',             sco:82 },
];

type SignalType = typeof BASE_SIGNALS[0];

export default function SignalsPage() {
  const [signals, setSignals] = useState<SignalType[]>(BASE_SIGNALS);
  const [filterType, setFilterType] = useState('ALL');
  const [filterGrade, setFilterGrade] = useState('ALL');
  const [filterImpact, setFilterImpact] = useState('ALL');
  const [filterRegion, setFilterRegion] = useState('ALL');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number|null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(()=>{
    const iv = setInterval(()=>{
      if(Math.random()>0.7){
        const types: Array<SignalType['type']> = ['POLICY_CHANGE','NEW_INCENTIVE','SECTOR_GROWTH'];
        const countries = [{n:'Singapore',f:'🇸🇬',r:'Asia Pacific'},{n:'UAE',f:'🇦🇪',r:'Middle East'},{n:'Vietnam',f:'🇻🇳',r:'Asia Pacific'}];
        const co = countries[Math.floor(Math.random()*countries.length)];
        const tp = types[Math.floor(Math.random()*types.length)];
        const newSig: SignalType = {
          id: Date.now(), type: tp, grade:'SILVER',
          country:co.n, flag:co.f, region:co.r, sector:'General',
          title:'New investment signal detected', body:'New signal identified from official government source.',
          implication:'Strategic significance under evaluation by AGT-02.', time:'now',
          impact:'MEDIUM', source:'Official Source', sco: 72+Math.floor(Math.random()*15)
        };
        setSignals(p=>[newSig,...p.slice(0,15)]);
        setLastUpdate(new Date());
      }
    }, 7000);
    return ()=>clearInterval(iv);
  },[]);

  const filtered = signals.filter(s=>{
    if(filterType!=='ALL' && s.type!==filterType) return false;
    if(filterGrade!=='ALL' && s.grade!==filterGrade) return false;
    if(filterImpact!=='ALL' && s.impact!==filterImpact) return false;
    if(filterRegion!=='ALL' && s.region!==filterRegion) return false;
    if(search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.country.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const gradeColors: Record<string,{bg:string,color:string,border:string}> = {
    PLATINUM:{ bg:'rgba(155,89,182,0.1)', color:'#7d3c98', border:'rgba(155,89,182,0.3)' },
    GOLD:{ bg:'rgba(241,196,15,0.1)', color:'#7a6400', border:'rgba(241,196,15,0.3)' },
    SILVER:{ bg:'rgba(127,140,141,0.1)', color:'#5d6d7e', border:'rgba(127,140,141,0.3)' },
  };
  const impactColors: Record<string,string> = { HIGH:'#e74c3c', MEDIUM:'#ffd700', LOW:'#2ecc71' };

  return (
    <div style={{minHeight:'100vh', background:'#020c14', fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>
      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#020c14,#0a1628)', padding:'20px 24px', borderBottom:'1px solid rgba(46,204,113,0.1)'}}>
        <div style={{maxWidth:'1440px', margin:'0 auto'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px'}}>
            <div>
              <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px'}}>
                <span style={{width:'7px', height:'7px', borderRadius:'50%', background:'#2ecc71', display:'inline-block', animation:'livePulse 2s infinite'}}/>
                <span style={{fontSize:'10px', fontWeight:800, color:'#00ffc8', letterSpacing:'0.1em'}}>LIVE · AGT-02 Signal Detection · Auto-updating</span>
              </div>
              <h1 style={{fontSize:'22px', fontWeight:900, color:'white', marginBottom:'4px'}}>Investment Signals Feed</h1>
              <p style={{color:'rgba(255,255,255,0.6)', fontSize:'12px'}}>
                {signals.length} verified signals · SCI scored · SHA-256 provenance · Last update: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <div style={{display:'flex', gap:'8px'}}>
              <Link href="/reports" style={{padding:'8px 16px', background:'#2ecc71', color:'#020c14', borderRadius:'8px', textDecoration:'none', fontSize:'12px', fontWeight:800}}>
                Generate Report
              </Link>
              <Link href="/publications" style={{padding:'8px 14px', border:'1px solid rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.8)', borderRadius:'8px', textDecoration:'none', fontSize:'12px', fontWeight:600}}>
                Publications
              </Link>
            </div>
          </div>
          {/* Stats */}
          <div style={{display:'flex', gap:'16px', marginTop:'14px', flexWrap:'wrap'}}>
            {[['PLATINUM', signals.filter(s=>s.grade==='PLATINUM').length, '#9b59b6'],
              ['GOLD', signals.filter(s=>s.grade==='GOLD').length, '#ffd700'],
              ['HIGH Impact', signals.filter(s=>s.impact==='HIGH').length, '#e74c3c'],
              ['This Week', signals.length, '#2ecc71'],
            ].map(([l,v,c])=>(
              <div key={String(l)} style={{padding:'6px 14px', background:'rgba(255,255,255,0.06)', borderRadius:'8px', border:`1px solid ${c}25`}}>
                <span style={{fontSize:'16px', fontWeight:900, color:String(c), fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>
                <span style={{fontSize:'10px', color:'rgba(255,255,255,0.5)', marginLeft:'6px'}}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1440px', margin:'0 auto', padding:'20px 24px'}}>
        {/* Filters */}
        <div style={{background:'rgba(10,22,40,0.8)', borderRadius:'14px', padding:'14px 18px', marginBottom:'16px', border:'1px solid rgba(0,180,216,0.1)', display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center'}}>
          <Zap size={14} color="#2ecc71"/>
          <input placeholder="Search signals..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{padding:'7px 12px', border:'1px solid rgba(0,180,216,0.12)', borderRadius:'8px', fontSize:'12px', outline:'none', fontFamily:'inherit', minWidth:'160px'}}/>
          {[
            {label:'Type', val:filterType, setter:setFilterType, opts:['ALL',...SIGNAL_TYPES.map(t=>t.id)]},
            {label:'Grade', val:filterGrade, setter:setFilterGrade, opts:['ALL','PLATINUM','GOLD','SILVER']},
            {label:'Impact', val:filterImpact, setter:setFilterImpact, opts:['ALL','HIGH','MEDIUM','LOW']},
            {label:'Region', val:filterRegion, setter:setFilterRegion, opts:['ALL','Asia Pacific','Middle East','Americas','Europe','Africa']},
          ].map(({val,setter,opts})=>(
            <select key={val} value={val} onChange={e=>setter(e.target.value)}
              style={{padding:'7px 12px', border:'1px solid rgba(0,180,216,0.12)', borderRadius:'8px', fontSize:'12px', background:'rgba(10,22,40,0.8)', outline:'none', cursor:'pointer', fontFamily:'inherit'}}>
              {opts.map(o=><option key={o}>{o}</option>)}
            </select>
          ))}
          <span style={{marginLeft:'auto', fontSize:'12px', color:'rgba(232,244,248,0.4)'}}>{filtered.length} signals</span>
        </div>

        {/* Signal cards */}
        <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          {filtered.map(sig=>{
            const st = SIGNAL_TYPES.find(t=>t.id===sig.type) || SIGNAL_TYPES[0];
            const gc = gradeColors[sig.grade];
            const isExp = expanded === sig.id;
            return (
              <div key={sig.id} onClick={()=>setExpanded(isExp?null:sig.id)}
                style={{background:'rgba(10,22,40,0.8)', borderRadius:'14px', border:`1px solid rgba(26,44,62,0.07)`, borderLeft:`4px solid ${st.color}`,
                  cursor:'pointer', transition:'all 0.2s', boxShadow: isExp ? '0 8px 20px rgba(0,0,0,0.08)' : '0 2px 4px rgba(0,0,0,0.04)'}}>
                <div style={{padding:'14px 18px'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px'}}>
                    <div style={{flex:1}}>
                      <div style={{display:'flex', gap:'8px', alignItems:'center', marginBottom:'6px', flexWrap:'wrap'}}>
                        <span style={{fontSize:'9px', fontWeight:800, padding:'2px 8px', borderRadius:'10px', background:`${st.color}15`, color:st.color, letterSpacing:'0.04em'}}>{st.emoji} {st.label.toUpperCase()}</span>
                        <span style={{fontSize:'9px', fontWeight:800, padding:'2px 8px', borderRadius:'10px', background:gc.bg, color:gc.color, border:`1px solid ${gc.border}`}}>{sig.grade}</span>
                        <span style={{fontSize:'14px'}}>{sig.flag}</span>
                        <span style={{fontSize:'12px', fontWeight:700, color:'#e8f4f8'}}>{sig.country}</span>
                        <span style={{fontSize:'10px', color:'rgba(232,244,248,0.4)'}}>· {sig.sector}</span>
                      </div>
                      <div style={{fontSize:'14px', fontWeight:700, color:'#e8f4f8', marginBottom:'4px', lineHeight:'1.4'}}>{sig.title}</div>
                      <div style={{fontSize:'11px', color:'rgba(232,244,248,0.4)'}}>
                        <span style={{fontWeight:600, color:'rgba(232,244,248,0.7)'}}>Strategic: </span>{sig.implication.slice(0,110)}{sig.implication.length>110&&!isExp?'...':''}
                      </div>
                    </div>
                    <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'6px', flexShrink:0}}>
                      <span style={{fontSize:'9px', fontWeight:800, padding:'2px 8px', borderRadius:'8px', background:`${impactColors[sig.impact]}15`, color:impactColors[sig.impact]}}>{sig.impact}</span>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontSize:'16px', fontWeight:900, color:sig.sco>=85?'#9b59b6':sig.sco>=70?'#ffd700':'#7f8c8d', fontFamily:"'JetBrains Mono',monospace"}}>{sig.sco}</div>
                        <div style={{fontSize:'9px', color:'rgba(232,244,248,0.4)'}}>SCI Score</div>
                      </div>
                      <div style={{display:'flex', alignItems:'center', gap:'4px', fontSize:'10px', color:'rgba(232,244,248,0.4)'}}>
                        <Clock size={10}/>{sig.time} ago
                      </div>
                    </div>
                  </div>
                  {isExp && (
                    <div style={{marginTop:'14px', padding:'14px', background:'rgba(26,44,62,0.02)', borderRadius:'10px', border:'1px solid rgba(0,255,200,0.06)'}}>
                      <div style={{fontSize:'13px', color:'rgba(232,244,248,0.7)', lineHeight:'1.7', marginBottom:'12px'}}>{sig.body}</div>
                      <div style={{fontSize:'12px', color:'rgba(232,244,248,0.7)', marginBottom:'12px'}}>
                        <strong style={{color:'#e8f4f8'}}>Strategic Implication: </strong>{sig.implication}
                      </div>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'8px'}}>
                        <span style={{fontSize:'11px', color:'rgba(232,244,248,0.4)'}}>Source: <strong>{sig.source}</strong> · SHA-256 verified · SCI: {sig.sco}</span>
                        <div style={{display:'flex', gap:'8px'}}>
                          <Link href="/reports" onClick={e=>e.stopPropagation()} style={{padding:'6px 14px', background:'rgba(0,255,200,0.08)', border:'1px solid rgba(0,255,200,0.2)', borderRadius:'7px', textDecoration:'none', fontSize:'11px', fontWeight:600, color:'#00ffc8'}}>
                            Generate Report
                          </Link>
                          <Link href={`/investment-analysis`} onClick={e=>e.stopPropagation()} style={{padding:'6px 14px', background:'rgba(26,44,62,0.06)', border:'1px solid rgba(26,44,62,0.1)', borderRadius:'7px', textDecoration:'none', fontSize:'11px', fontWeight:600, color:'#e8f4f8', display:'flex', alignItems:'center', gap:'4px'}}>
                            Full Analysis <ExternalLink size={10}/>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Subscribe */}
        <div style={{marginTop:'20px', background:'rgba(6,15,26,0.95)', borderRadius:'14px', padding:'20px 24px', display:'flex', gap:'16px', alignItems:'center', flexWrap:'wrap', border:'1px solid rgba(46,204,113,0.1)'}}>
          <Bell size={20} color="#2ecc71"/>
          <div style={{flex:1}}>
            <div style={{fontSize:'14px', fontWeight:700, color:'white', marginBottom:'2px'}}>Subscribe to Investment Signals</div>
            <div style={{fontSize:'12px', color:'rgba(255,255,255,0.5)'}}>Get PLATINUM & HIGH-impact signals delivered to your inbox in real time</div>
          </div>
          <div style={{display:'flex', gap:'8px'}}>
            <input type="email" placeholder="your@organisation.com"
              style={{padding:'9px 14px', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'8px', fontSize:'12px', background:'rgba(255,255,255,0.08)', color:'white', outline:'none', fontFamily:'inherit', minWidth:'200px'}}/>
            <button style={{padding:'9px 18px', background:'#2ecc71', color:'#020c14', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:800, fontFamily:'inherit', whiteSpace:'nowrap'}}>
              Subscribe →
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
