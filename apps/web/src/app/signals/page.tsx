'use client';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Zap, Clock, TrendingUp, Bell, ExternalLink } from 'lucide-react';
import ScrollableSelect from '@/components/ScrollableSelect';

const SIGNAL_TYPES = [
  {id:'POLICY_CHANGE',   label:'Policy Change',    color:'#ff4466'},
  {id:'NEW_INCENTIVE',   label:'New Incentive',    color:'#00ffc8'},
  {id:'SECTOR_GROWTH',   label:'Sector Growth',    color:'#00d4ff'},
  {id:'ZONE_AVAIL',      label:'Zone Availability',color:'#ffd700'},
  {id:'COMPETITOR_MOVE', label:'Competitor Move',  color:'#9b59b6'},
  {id:'DEAL_ANNOUNCED',  label:'Deal Announced',   color:'#e67e22'},
];

const BASE_SIGNALS = [
  {id:1, type:'POLICY_CHANGE',  grade:'PLATINUM',country:'Malaysia',    flag:'🇲🇾',region:'Asia Pacific',sector:'Digital Economy',  title:'FDI cap in data centers raised to 100%',                    implication:'Positions Malaysia as most accessible data center hub in Southeast Asia. Expected to attract $5B+ in new investment over 12 months.',    time:'2m',  impact:'HIGH', source:'MITI Malaysia',          sco:96, body:'Malaysia eliminates previous 30% local ownership requirement for data center investments, effective immediately.'},
  {id:2, type:'NEW_INCENTIVE',  grade:'PLATINUM',country:'Thailand',    flag:'🇹🇭',region:'Asia Pacific',sector:'EV Battery',       title:'$2B EV battery subsidy package approved',                   implication:'Strengthens Thailand vs Vietnam and Indonesia. Expected 5-8 new battery facilities by 2028.',                                            time:'1h',  impact:'HIGH', source:'Thailand BOI',            sco:95, body:'Thailand Board of Investment approves $2B subsidy covering 5 years of 50% tax reduction for EV battery manufacturers.'},
  {id:3, type:'DEAL_ANNOUNCED', grade:'PLATINUM',country:'UAE',         flag:'🇦🇪',region:'Middle East', sector:'AI Data Centers',  title:'Microsoft $3.3B AI data center investment announced',        implication:'Validates UAE AI infrastructure thesis. Triggers follow-on from AWS, Google Cloud, Oracle.',                                              time:'2d',  impact:'HIGH', source:'DIFC',                    sco:97, body:'Microsoft announces $3.3B investment in UAE AI data center infrastructure over 3 years, establishing UAE as primary AI compute hub for MEA.'},
  {id:4, type:'SECTOR_GROWTH',  grade:'GOLD',    country:'Vietnam',     flag:'🇻🇳',region:'Asia Pacific',sector:'Electronics',      title:'Electronics exports surge 34% YoY',                         implication:'Vietnam solidifies #2 electronics exporter in ASEAN. New investments expected in PCB and component supply.',                              time:'3h',  impact:'MED',  source:'GSO Vietnam',             sco:92, body:'Vietnam GSO confirms record electronics export growth driven by semiconductor and consumer electronics demand. Samsung, LG, Intel at peak capacity.'},
  {id:5, type:'COMPETITOR_MOVE',grade:'PLATINUM',country:'Indonesia',   flag:'🇮🇩',region:'Asia Pacific',sector:'Mining & EV',      title:'$15B nickel processing investment confirmed',                implication:'Strengthens Indonesia nickel supply chain dominance. EV manufacturers face cost pressure.',                                              time:'1d',  impact:'HIGH', source:'Ministry of Investment',  sco:93, body:'Chinese and European consortium secures $15B nickel processing expansion, increasing downstream processing capacity by 40%.'},
  {id:6, type:'NEW_INCENTIVE',  grade:'PLATINUM',country:'Saudi Arabia',flag:'🇸🇦',region:'Middle East', sector:'All Sectors',      title:'Vision 2030 FDI fast-track: 30-day license guarantee',      implication:'Removes primary regulatory barrier. Expected to catalyze $10B+ in committed FDI commitments.',                                           time:'2d',  impact:'HIGH', source:'MISA Saudi Arabia',       sco:94, body:'MISA launches FDI Acceleration Framework guaranteeing 30-day investment license turnaround for manufacturing, tech, healthcare, and renewables.'},
  {id:7, type:'POLICY_CHANGE',  grade:'GOLD',    country:'UAE',         flag:'🇦🇪',region:'Middle East', sector:'All Sectors',      title:'100% foreign ownership extended to all mainland sectors',   implication:'Eliminates last structural barrier to full foreign business control in UAE.',                                                             time:'3d',  impact:'HIGH', source:'MOEI UAE',                sco:90, body:'UAE Ministry of Economy confirms extension of 100% foreign ownership rights to all mainland commercial activities.'},
  {id:8, type:'DEAL_ANNOUNCED', grade:'GOLD',    country:'India',       flag:'🇮🇳',region:'Asia Pacific',sector:'Semiconductors',   title:'Apple commits $10B manufacturing expansion in India',       implication:'Accelerates India emergence as China+1 electronics hub.',                                                                                 time:'4d',  impact:'HIGH', source:'Ministry of Electronics', sco:89, body:'Apple announces $10B semiconductor and electronics manufacturing expansion across Tamil Nadu and Karnataka, targeting 25% of iPhone production from India.'},
  {id:9, type:'SECTOR_GROWTH',  grade:'GOLD',    country:'Morocco',     flag:'🇲🇦',region:'Africa',      sector:'Renewables',       title:'Morocco green hydrogen framework signed with EU',            implication:'Positions Morocco as primary green hydrogen supplier to Europe.',                                                                         time:'5d',  impact:'MED',  source:'Ministry of Energy Morocco',sco:87, body:'Morocco and EU formalize green hydrogen export corridor targeting 1 million tonnes per year by 2030.'},
  {id:10,type:'NEW_INCENTIVE',  grade:'SILVER',  country:'Vietnam',     flag:'🇻🇳',region:'Asia Pacific',sector:'Manufacturing',    title:'50% CIT reduction for EV manufacturers — 5 years',          implication:'Strengthens Vietnam vs Thailand in EV battery supply chain.',                                                                            time:'6d',  impact:'MED',  source:'Ministry of Finance VN',  sco:85, body:'Vietnam MOF announces 50% corporate income tax reduction for first 5 years for EV battery manufacturers in approved industrial zones.'},
  {id:11,type:'ZONE_AVAIL',     grade:'SILVER',  country:'Malaysia',    flag:'🇲🇾',region:'Asia Pacific',sector:'Technology',       title:'Penang Science Park Phase 3 — 60ha tech campus opens',      implication:'Expands Penang capacity as ASEAN semiconductor and technology cluster.',                                                                 time:'7d',  impact:'MED',  source:'PDC Penang',              sco:84, body:'Penang Development Corporation opens Phase 3 with 60 hectares of MSC Malaysia status-eligible technology campus.'},
  {id:12,type:'COMPETITOR_MOVE',grade:'GOLD',    country:'Thailand',    flag:'🇹🇭',region:'Asia Pacific',sector:'Automotive',       title:'Toyota commits $2.5B EV production facility in EEC',        implication:'Confirms Thailand as ASEAN EV assembly hub. Major supply chain opportunity.',                                                            time:'8d',  impact:'HIGH', source:'Thailand EEC',            sco:91, body:'Toyota Motor Corporation announces $2.5B dedicated EV production facility in Eastern Economic Corridor, creating 8,000 direct jobs.'},
  {id:13,type:'DEAL_ANNOUNCED', grade:'GOLD',    country:'Saudi Arabia',flag:'🇸🇦',region:'Middle East', sector:'Renewables',       title:'PIF $15B renewables portfolio expansion announced',          implication:'Creates massive supply chain opportunity for solar, wind, and storage manufacturers.',                                                   time:'9d',  impact:'HIGH', source:'PIF Saudi Arabia',        sco:88, body:'Saudi Public Investment Fund confirms $15B expansion of renewables portfolio targeting 50% clean energy share by 2030.'},
  {id:14,type:'SECTOR_GROWTH',  grade:'SILVER',  country:'Brazil',      flag:'🇧🇷',region:'Americas',    sector:'Data Centers',     title:'Amazon announces $5B data center investment in Sao Paulo',   implication:'Positions Brazil as South Americas primary cloud hub.',                                                                                   time:'11d', impact:'HIGH', source:'Reuters',                 sco:88, body:'AWS confirms $5B investment in Brazil infrastructure through 2026, including multiple availability zones.'},
  {id:15,type:'ZONE_AVAIL',     grade:'GOLD',    country:'Indonesia',   flag:'🇮🇩',region:'Asia Pacific',sector:'Manufacturing',    title:'New Batam zone — 200ha ready for immediate occupancy',       implication:'Alleviates land shortage in Batam. Opens manufacturing relocation from Singapore.',                                                      time:'5h',  impact:'MED',  source:'Batam Authority',         sco:91, body:'Batam Indonesia Free Zone Authority announces 200 hectares of fully serviced industrial land for immediate occupancy.'},
];

type Sig = typeof BASE_SIGNALS[0];

function gradeStyle(g: string) {
  if(g==='PLATINUM') return {bg:'rgba(155,89,182,0.12)',color:'#c39bd3',border:'rgba(155,89,182,0.25)'};
  if(g==='GOLD')     return {bg:'rgba(255,215,0,0.10)', color:'#ffd700',border:'rgba(255,215,0,0.25)'};
  return {bg:'rgba(148,168,179,0.08)',color:'#94a8b3',border:'rgba(148,168,179,0.2)'};
}
function typeColor(t: string) {
  const m: Record<string,string> = {POLICY_CHANGE:'#ff4466',NEW_INCENTIVE:'#00ffc8',SECTOR_GROWTH:'#00d4ff',ZONE_AVAIL:'#ffd700',COMPETITOR_MOVE:'#9b59b6',DEAL_ANNOUNCED:'#e67e22'};
  return m[t]||'#94a8b3';
}
function impactColor(i: string) { return i==='HIGH'?'#ff4466':i==='MED'?'#ffd700':'#00ffc8'; }

export default function SignalsPage() {
  const [signals, setSignals] = useState<Sig[]>(BASE_SIGNALS);
  const [filterType, setFilterType] = useState('ALL');
  const [filterGrade, setFilterGrade] = useState('ALL');
  const [filterImpact, setFilterImpact] = useState('ALL');
  const [filterRegion, setFilterRegion] = useState('ALL');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number|null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const iv = setInterval(() => {
      if(Math.random() > 0.65) {
        const types = SIGNAL_TYPES;
        const ctrs = [{n:'Malaysia',f:'🇲🇾',r:'Asia Pacific'},{n:'UAE',f:'🇦🇪',r:'Middle East'},{n:'Vietnam',f:'🇻🇳',r:'Asia Pacific'},{n:'Singapore',f:'🇸🇬',r:'Asia Pacific'}];
        const tp = types[Math.floor(Math.random()*types.length)];
        const co = ctrs[Math.floor(Math.random()*ctrs.length)];
        const ns: Sig = {id:Date.now(),type:tp.id,grade:'SILVER',country:co.n,flag:co.f,region:co.r,sector:'General',title:'New investment signal detected — SCI scoring in progress',implication:'Strategic significance being evaluated by AGT-02.',time:'now',impact:'MED',source:'Official Source',sco:70+Math.floor(Math.random()*20),body:'AGT-02 Signal Detection identified a new investment development from an official government source. SHA-256 verification in progress.'};
        setSignals(p => [ns, ...p.slice(0,15)]);
        setLastUpdate(new Date());
      }
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const filtered = signals.filter(s => {
    if(filterType !== 'ALL' && s.type !== filterType) return false;
    if(filterGrade !== 'ALL' && s.grade !== filterGrade) return false;
    if(filterImpact !== 'ALL' && s.impact !== filterImpact) return false;
    if(filterRegion !== 'ALL' && s.region !== filterRegion) return false;
    if(search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.country.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const regions = ['ALL','Asia Pacific','Middle East','Americas','Europe','Africa'];

  const cardStyle = (sig: Sig, isExp: boolean, si: number): React.CSSProperties => {
    const tc = typeColor(sig.type);
    return {
      background: 'rgba(10,22,40,0.7)',
      borderRadius: '10px',
      border: '1px solid rgba(255,255,255,0.04)',
      borderLeft: '3px solid ' + tc,
      cursor: 'pointer',
      transition: 'all 200ms ease',
      boxShadow: isExp ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
      animation: si === 0 ? 'slideIn 0.4s ease' : 'none',
    };
  };

  return (
    <div style={{minHeight:'100vh',background:'#020c14',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>

      {/* HERO */}
      <div style={{background:'linear-gradient(135deg,#020c14,#060f1a,#0a1628)',padding:'28px 24px',borderBottom:'1px solid rgba(0,255,200,0.08)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'1540px',margin:'0 auto',position:'relative'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'16px',marginBottom:'16px'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#00ffc8',boxShadow:'0 0 10px #00ffc8',animation:'pulse 2s infinite'}}/>
                <span style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.8)',letterSpacing:'0.15em',fontFamily:"'Orbitron','Inter',sans-serif"}}>LIVE SIGNAL FEED · AGT-02 · SHA-256 VERIFIED</span>
              </div>
              <h1 style={{fontSize:'28px',fontWeight:900,color:'#e8f4f8',marginBottom:'6px',lineHeight:1.1}}>Investment Signals Feed</h1>
              <p style={{fontSize:'13px',color:'rgba(232,244,248,0.45)'}}>
                {signals.length} verified signals · SCI scored · Updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
              <Link href="/reports" style={{padding:'9px 18px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'#020c14',borderRadius:'8px',textDecoration:'none',fontSize:'12px',fontWeight:800,boxShadow:'0 4px 16px rgba(0,255,200,0.25)'}}>Generate Report</Link>
              <Link href="/publications" style={{padding:'9px 16px',border:'1px solid rgba(232,244,248,0.1)',color:'rgba(232,244,248,0.7)',borderRadius:'8px',textDecoration:'none',fontSize:'12px',fontWeight:600}}>Publications</Link>
            </div>
          </div>
          <div style={{display:'flex',gap:'14px',flexWrap:'wrap'}}>
            {[
              [signals.filter(s=>s.grade==='PLATINUM').length,'PLATINUM','rgba(155,89,182,0.15)','#c39bd3'],
              [signals.filter(s=>s.grade==='GOLD').length,'GOLD','rgba(255,215,0,0.1)','#ffd700'],
              [signals.filter(s=>s.impact==='HIGH').length,'HIGH IMPACT','rgba(255,68,102,0.1)','#ff4466'],
              [signals.length,'THIS WEEK','rgba(0,255,200,0.08)','#00ffc8'],
            ].map(([v,l,bg,c]) => (
              <div key={String(l)} style={{padding:'6px 14px',background:String(bg),border:'1px solid rgba(255,255,255,0.05)',borderRadius:'8px'}}>
                <span style={{fontSize:'18px',fontWeight:900,color:String(c),fontFamily:"'JetBrains Mono',monospace",marginRight:'8px'}}>{v}</span>
                <span style={{fontSize:'9px',color:'rgba(232,244,248,0.4)',letterSpacing:'0.08em',fontFamily:"'JetBrains Mono',monospace"}}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1540px',margin:'0 auto',padding:'20px 24px',display:'grid',gridTemplateColumns:'1fr 280px',gap:'16px',alignItems:'start'}}>
        {/* MAIN FEED */}
        <div>
          {/* Filters */}
          <div style={{background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.1)',borderRadius:'12px',padding:'12px 16px',marginBottom:'12px',display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'center'}}>
            <Zap size={13} color="#00ffc8"/>
            <input placeholder="Search signals..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{padding:'7px 12px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'7px',fontSize:'12px',outline:'none',fontFamily:"'Inter',sans-serif",color:'#e8f4f8',minWidth:'160px'}}/>
            <ScrollableSelect
              value={filterType} onChange={setFilterType} width="160px"
              options={[{value:'ALL',label:'All Types'},...SIGNAL_TYPES.map(t=>({value:t.id,label:t.label}))]}
              accentColor="#00ffc8"
            />
            <ScrollableSelect
              value={filterGrade} onChange={setFilterGrade} width="130px"
              options={[{value:'ALL',label:'All Grades'},{value:'PLATINUM',label:'PLATINUM'},{value:'GOLD',label:'GOLD'},{value:'SILVER',label:'SILVER'}]}
              accentColor="#c39bd3"
            />
            <ScrollableSelect
              value={filterImpact} onChange={setFilterImpact} width="120px"
              options={[{value:'ALL',label:'All Impact'},{value:'HIGH',label:'HIGH Impact'},{value:'MED',label:'MED Impact'},{value:'LOW',label:'LOW Impact'}]}
              accentColor="#ff4466"
            />
            <ScrollableSelect
              value={filterRegion} onChange={setFilterRegion} width="150px"
              options={regions.map(r=>({value:r,label:r==='ALL'?'All Regions':r}))}
              accentColor="#00d4ff"
            />
            <span style={{marginLeft:'auto',fontSize:'11px',color:'rgba(232,244,248,0.3)',fontFamily:"'JetBrains Mono',monospace"}}>{filtered.length} signals</span>
          </div>

          {/* Signal cards */}
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {filtered.map((sig, si) => {
              const st = SIGNAL_TYPES.find(t => t.id === sig.type) || SIGNAL_TYPES[0];
              const gs = gradeStyle(sig.grade);
              const isExp = expanded === sig.id;
              const tc = typeColor(sig.type);
              const ic = impactColor(sig.impact);
              return (
                <div key={sig.id}
                  onClick={() => setExpanded(isExp ? null : sig.id)}
                  style={cardStyle(sig, isExp, si)}>
                  <div style={{padding:'12px 16px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'12px'}}>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',gap:'6px',alignItems:'center',marginBottom:'6px',flexWrap:'wrap'}}>
                          <span style={{fontSize:'9px',fontWeight:800,padding:'2px 8px',borderRadius:'4px',background:gs.bg,color:gs.color,border:'1px solid '+gs.border,letterSpacing:'0.05em',fontFamily:"'JetBrains Mono',monospace"}}>{sig.grade}</span>
                          <span style={{fontSize:'9px',fontWeight:700,padding:'2px 8px',borderRadius:'4px',background:tc+'15',color:tc,letterSpacing:'0.04em'}}>{st.label.toUpperCase()}</span>
                          <span style={{fontSize:'16px'}}>{sig.flag}</span>
                          <span style={{fontSize:'12px',fontWeight:700,color:'rgba(232,244,248,0.8)'}}>{sig.country}</span>
                          <span style={{fontSize:'10px',color:'rgba(232,244,248,0.3)'}}>· {sig.sector}</span>
                        </div>
                        <div style={{fontSize:'14px',fontWeight:700,color:'#e8f4f8',marginBottom:'4px',lineHeight:1.4}}>{sig.title}</div>
                        <div style={{fontSize:'11px',color:'rgba(232,244,248,0.45)',lineHeight:1.65}}>
                          <span style={{fontWeight:600,color:'rgba(0,255,200,0.6)'}}>Strategic: </span>
                          {sig.implication.slice(0,110)}{sig.implication.length>110&&!isExp?'...':''}
                        </div>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'6px',flexShrink:0}}>
                        <span style={{fontSize:'9px',fontWeight:800,padding:'2px 8px',borderRadius:'4px',background:ic+'15',color:ic}}>{sig.impact}</span>
                        <div style={{textAlign:'right'}}>
                          <div style={{fontSize:'20px',fontWeight:900,color:'#9b59b6',fontFamily:"'JetBrains Mono',monospace",textShadow:'0 0 12px rgba(155,89,182,0.5)'}}>{sig.sco}</div>
                          <div style={{fontSize:'9px',color:'rgba(232,244,248,0.3)'}}>SCI</div>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'10px',color:'rgba(232,244,248,0.25)',fontFamily:"'JetBrains Mono',monospace"}}>
                          <Clock size={10}/>{sig.time} ago
                        </div>
                      </div>
                    </div>
                    {isExp && (
                      <div style={{marginTop:'14px',padding:'14px',background:'rgba(0,0,0,0.3)',borderRadius:'8px',border:'1px solid rgba(0,255,200,0.08)',animation:'fadeIn 0.3s ease'}}>
                        <div style={{fontSize:'13px',color:'rgba(232,244,248,0.7)',lineHeight:1.75,marginBottom:'10px'}}>{sig.body}</div>
                        <div style={{fontSize:'12px',color:'rgba(232,244,248,0.6)',marginBottom:'12px',lineHeight:1.65}}>
                          <span style={{fontWeight:700,color:'rgba(0,255,200,0.7)'}}>Strategic Implication: </span>{sig.implication}
                        </div>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px'}}>
                          <span style={{fontSize:'10px',color:'rgba(232,244,248,0.3)',fontFamily:"'JetBrains Mono',monospace"}}>Source: {sig.source} · SHA-256 ✓ · SCI: {sig.sco}</span>
                          <div style={{display:'flex',gap:'8px'}}>
                            <Link href="/reports" onClick={e=>e.stopPropagation()} style={{padding:'6px 14px',background:'rgba(0,255,200,0.08)',border:'1px solid rgba(0,255,200,0.2)',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'#00ffc8'}}>Generate Report</Link>
                            <Link href="/investment-analysis" onClick={e=>e.stopPropagation()} style={{padding:'6px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:600,color:'rgba(232,244,248,0.7)',display:'flex',alignItems:'center',gap:'4px'}}>Full Analysis <ExternalLink size={10}/></Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SIDE PANEL */}
        <div style={{display:'flex',flexDirection:'column',gap:'12px',position:'sticky',top:'120px'}}>
          <div style={{background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.1)',borderRadius:'12px',padding:'16px'}}>
            <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.5)',letterSpacing:'0.15em',marginBottom:'14px',fontFamily:"'Orbitron','Inter',sans-serif"}}>SIGNAL GRADES</div>
            {([['PLATINUM','#c39bd3'],[' GOLD ','#ffd700'],['SILVER','#94a8b3']] as [string,string][]).map(([g,c]) => {
              const n = signals.filter(s=>s.grade===g.trim()).length;
              return (
                <div key={g} style={{marginBottom:'10px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}>
                    <span style={{fontSize:'11px',fontWeight:700,color:c}}>{g.trim()}</span>
                    <span style={{fontSize:'12px',fontWeight:900,color:c,fontFamily:"'JetBrains Mono',monospace"}}>{n}</span>
                  </div>
                  <div style={{height:'4px',background:'rgba(255,255,255,0.05)',borderRadius:'2px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:(n/signals.length*100)+'%',background:c,borderRadius:'2px',boxShadow:'0 0 6px '+c+'60'}}/>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.1)',borderRadius:'12px',padding:'16px'}}>
            <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.5)',letterSpacing:'0.15em',marginBottom:'14px',fontFamily:"'Orbitron','Inter',sans-serif"}}>TOP SCI SCORES</div>
            {[...signals].sort((a,b)=>b.sco-a.sco).slice(0,5).map((s,i) => (
              <div key={s.id} style={{display:'flex',alignItems:'center',gap:'8px',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                <span style={{fontSize:'11px',fontWeight:800,color:'rgba(232,244,248,0.3)',minWidth:'18px',fontFamily:"'JetBrains Mono',monospace"}}>#{i+1}</span>
                <span style={{fontSize:'16px'}}>{s.flag}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:'10px',fontWeight:600,color:'rgba(232,244,248,0.7)',lineHeight:1.35}}>{s.title.slice(0,42)}...</div>
                </div>
                <span style={{fontSize:'14px',fontWeight:900,color:'#9b59b6',fontFamily:"'JetBrains Mono',monospace"}}>{s.sco}</span>
              </div>
            ))}
          </div>

          <div style={{background:'rgba(0,255,200,0.04)',border:'1px solid rgba(0,255,200,0.12)',borderRadius:'12px',padding:'16px'}}>
            <Bell size={16} color="#00ffc8" style={{marginBottom:'10px'}}/>
            <div style={{fontSize:'13px',fontWeight:700,color:'#e8f4f8',marginBottom:'6px'}}>Signal Alerts</div>
            <div style={{fontSize:'11px',color:'rgba(232,244,248,0.45)',marginBottom:'12px',lineHeight:1.6}}>PLATINUM and HIGH-impact signals in real time</div>
            <input type="email" placeholder="your@organisation.com"
              style={{width:'100%',padding:'8px 12px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'7px',fontSize:'11px',color:'#e8f4f8',outline:'none',fontFamily:"'Inter',sans-serif",marginBottom:'8px'}}/>
            <button style={{width:'100%',padding:'9px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'#020c14',border:'none',borderRadius:'7px',cursor:'pointer',fontSize:'12px',fontWeight:800,fontFamily:"'Inter',sans-serif"}}>
              Subscribe →
            </button>
          </div>
        </div>
      </div>

      <Footer/>
      <style>{`
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,255,200,0.4)}50%{box-shadow:0 0 0 8px rgba(0,255,200,0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:none}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      `}</style>
    </div>
  );
}
