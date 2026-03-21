'use client';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const SIGNAL_DB = [
  {id:1,type:'POLICY CHANGE',eco:'Malaysia',flag:'🇲🇾',region:'Asia Pacific',sector:'Digital Economy',text:'100% FDI ownership in data center sector approved — removes previous 30% local equity requirement.',grade:'PLATINUM',sci:94.2,time:'2 min ago',color:'#e74c3c',impact:'HIGH'},
  {id:2,type:'NEW INCENTIVE',eco:'Thailand',flag:'🇹🇭',region:'Asia Pacific',sector:'Manufacturing',text:'$2B EV battery manufacturing subsidy — 15-year tax holiday, 50% land cost reduction.',grade:'GOLD',sci:88.7,time:'8 min ago',color:'#2ecc71',impact:'HIGH'},
  {id:3,type:'SECTOR GROWTH',eco:'Vietnam',flag:'🇻🇳',region:'Asia Pacific',sector:'Manufacturing',text:'Electronics and semiconductor FDI inflows reach record $8.4B in Q1 2026, up 34% YoY.',grade:'GOLD',sci:85.1,time:'15 min ago',color:'#3498db',impact:'HIGH'},
  {id:4,type:'ZONE AVAILABLE',eco:'Indonesia',flag:'🇮🇩',region:'Asia Pacific',sector:'Manufacturing',text:'Batam FTZ opens 200 hectares for greenfield manufacturing — Tier 1 infrastructure ready.',grade:'SILVER',sci:79.3,time:'24 min ago',color:'#f1c40f',impact:'MEDIUM'},
  {id:5,type:'COMPETITOR MOVE',eco:'Indonesia',flag:'🇮🇩',region:'Asia Pacific',sector:'Manufacturing',text:'$15B nickel processing mega-investment confirmed by Korean consortium in Sulawesi.',grade:'PLATINUM',sci:91.4,time:'31 min ago',color:'#3498db',impact:'HIGH'},
  {id:6,type:'POLICY CHANGE',eco:'Saudi Arabia',flag:'🇸🇦',region:'Middle East',sector:'All Sectors',text:'Vision 2030 FDI framework overhaul — fast-track 30-day investment license now mandatory.',grade:'PLATINUM',sci:92.8,time:'45 min ago',color:'#e74c3c',impact:'HIGH'},
  {id:7,type:'NEW INCENTIVE',eco:'UAE',flag:'🇦🇪',region:'Middle East',sector:'Digital Economy',text:'Dubai launches $10B AI and cloud infrastructure investment fund — co-investment terms available.',grade:'GOLD',sci:87.6,time:'1 hr ago',color:'#2ecc71',impact:'HIGH'},
  {id:8,type:'SECTOR GROWTH',eco:'India',flag:'🇮🇳',region:'Asia Pacific',sector:'Manufacturing',text:'Semiconductor FDI approvals reach $24B — PLI scheme attracting 12 new global chip makers.',grade:'PLATINUM',sci:89.2,time:'1 hr ago',color:'#3498db',impact:'HIGH'},
  {id:9,type:'ZONE AVAILABLE',eco:'Morocco',flag:'🇲🇦',region:'Africa',sector:'Manufacturing',text:'Casablanca Atlantic Free Zone — Phase 2 industrial land release: 450 plots available.',grade:'SILVER',sci:76.4,time:'2 hrs ago',color:'#f1c40f',impact:'MEDIUM'},
  {id:10,type:'NEW INCENTIVE',eco:'Singapore',flag:'🇸🇬',region:'Asia Pacific',sector:'Financial Services',text:'MAS announces enhanced financial sector development program — $500M incentive pool.',grade:'GOLD',sci:86.9,time:'2 hrs ago',color:'#2ecc71',impact:'MEDIUM'},
  {id:11,type:'POLICY CHANGE',eco:'Kenya',flag:'🇰🇪',region:'Africa',sector:'Digital Economy',text:'ICT sector FDI restrictions lifted — 100% foreign ownership now permitted.',grade:'SILVER',sci:72.1,time:'3 hrs ago',color:'#e74c3c',impact:'MEDIUM'},
  {id:12,type:'SECTOR GROWTH',eco:'Philippines',flag:'🇵🇭',region:'Asia Pacific',sector:'Digital Economy',text:'BPO sector FDI grows 28% — 6 new economic zones designated for digital services.',grade:'GOLD',sci:81.3,time:'4 hrs ago',color:'#3498db',impact:'MEDIUM'},
  {id:13,type:'NEW INCENTIVE',eco:'Poland',flag:'🇵🇱',region:'Europe',sector:'Manufacturing',text:'Polish Investment Zone expansion — 14 new special economic zones with 12-year CIT exemption.',grade:'SILVER',sci:74.8,time:'5 hrs ago',color:'#2ecc71',impact:'LOW'},
  {id:14,type:'COMPETITOR MOVE',eco:'Vietnam',flag:'🇻🇳',region:'Asia Pacific',sector:'Manufacturing',text:'Samsung announces $3.3B DRAM memory expansion — confirms long-term manufacturing commitment.',grade:'PLATINUM',sci:90.1,time:'6 hrs ago',color:'#3498db',impact:'HIGH'},
  {id:15,type:'POLICY CHANGE',eco:'Rwanda',flag:'🇷🇼',region:'Africa',sector:'All Sectors',text:'Rwanda Investment Policy 2026 — fastest FDI approval globally at 3 business days.',grade:'SILVER',sci:71.6,time:'8 hrs ago',color:'#e74c3c',impact:'MEDIUM'},
  {id:16,type:'ZONE AVAILABLE',eco:'Saudi Arabia',flag:'🇸🇦',region:'Middle East',sector:'Manufacturing',text:'KAEC Phase 3 industrial zones — 800ha premium industrial land with 0% income tax.',grade:'GOLD',sci:84.7,time:'9 hrs ago',color:'#f1c40f',impact:'HIGH'},
];

const TYPES = ['ALL','POLICY CHANGE','NEW INCENTIVE','SECTOR GROWTH','ZONE AVAILABLE','COMPETITOR MOVE'];
const REGIONS = ['All Regions','Asia Pacific','Middle East','Europe','Africa','Americas'];
const SECTORS = ['All Sectors','Manufacturing','Digital Economy','Financial Services','All Sectors'];
const GRADES = ['All Grades','PLATINUM','GOLD','SILVER'];
const IMPACTS = ['All Impact','HIGH','MEDIUM','LOW'];

const GRADE_COLORS: Record<string,string> = {PLATINUM:'#9b59b6',GOLD:'#f1c40f',SILVER:'#95a5a6'};
const TYPE_COLORS: Record<string,string> = {'POLICY CHANGE':'#e74c3c','NEW INCENTIVE':'#2ecc71','SECTOR GROWTH':'#3498db','ZONE AVAILABLE':'#f1c40f','COMPETITOR MOVE':'#9b59b6'};

export default function SignalsPage() {
  const [signals, setSignals] = useState(SIGNAL_DB);
  const [typeF, setTypeF] = useState('ALL');
  const [regionF, setRegionF] = useState('All Regions');
  const [gradeF, setGradeF] = useState('All Grades');
  const [impactF, setImpactF] = useState('All Impact');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number|null>(null);
  const [liveCount, setLiveCount] = useState(SIGNAL_DB.length);

  useEffect(()=>{
    const iv = setInterval(()=>{
      if(Math.random()>0.5){
        const types = Object.keys(TYPE_COLORS);
        const ecos = [{eco:'Singapore',flag:'🇸🇬',region:'Asia Pacific'},{eco:'UAE',flag:'🇦🇪',region:'Middle East'},{eco:'Thailand',flag:'🇹🇭',region:'Asia Pacific'}];
        const e = ecos[Math.floor(Math.random()*ecos.length)];
        const t = types[Math.floor(Math.random()*types.length)];
        const newSig = {
          id: Date.now(), type:t, ...e, sector:'Digital Economy',
          text:'New investment development detected — analysis in progress.',
          grade:['PLATINUM','GOLD','SILVER'][Math.floor(Math.random()*3)] as string,
          sci: 70+Math.random()*25,
          time:'Just now', color:TYPE_COLORS[t], impact:'MEDIUM'
        };
        setSignals(p=>[newSig,...p]);
        setLiveCount(c=>c+1);
      }
    },8000);
    return ()=>clearInterval(iv);
  },[]);

  const filtered = signals.filter(s=>{
    if(typeF!=='ALL' && s.type!==typeF) return false;
    if(regionF!=='All Regions' && s.region!==regionF) return false;
    if(gradeF!=='All Grades' && s.grade!==gradeF) return false;
    if(impactF!=='All Impact' && s.impact!==impactF) return false;
    if(search && !s.eco.toLowerCase().includes(search.toLowerCase()) && !s.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8',fontFamily:'Helvetica Neue,Segoe UI,Arial,sans-serif'}}>
      <NavBar/>
      <section style={{background:'linear-gradient(135deg,#1a2c3e,#2c4a6e)',padding:'20px 24px'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'10px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
              <span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#2ecc71',display:'inline-block'}}/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#2ecc71',letterSpacing:'0.1em'}}>LIVE · {liveCount} Signals Active · Auto-updating</span>
            </div>
            <h1 style={{fontSize:'22px',fontWeight:900,color:'white'}}>⚡ Investment Signals Intelligence Feed</h1>
          </div>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            {[['PLATINUM','#9b59b6'],['GOLD','#f1c40f'],['HIGH IMPACT','#2ecc71']].map(([l,c])=>(
              <div key={l} style={{padding:'6px 12px',background:`${c}20`,border:`1px solid ${c}40`,borderRadius:'20px',fontSize:'11px',fontWeight:800,color:c}}>{l}</div>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1400px',margin:'0 auto',padding:'16px 24px'}}>
        {/* Filters */}
        <div style={{background:'white',borderRadius:'12px',padding:'14px 16px',marginBottom:'14px',boxShadow:'0 1px 4px rgba(0,0,0,0.05)',display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="🔍 Search economy or keyword..."
            style={{flex:'1',minWidth:'180px',padding:'8px 12px',border:'1px solid rgba(26,44,62,0.12)',borderRadius:'8px',fontSize:'13px',outline:'none'}}/>
          {[
            {val:typeF,set:setTypeF,opts:TYPES,label:'Type'},
            {val:regionF,set:setRegionF,opts:REGIONS,label:'Region'},
            {val:gradeF,set:setGradeF,opts:GRADES,label:'Grade'},
            {val:impactF,set:setImpactF,opts:IMPACTS,label:'Impact'},
          ].map(({val,set,opts,label})=>(
            <select key={label} value={val} onChange={e=>set(e.target.value)}
              style={{padding:'8px 12px',border:'1px solid rgba(26,44,62,0.12)',borderRadius:'8px',fontSize:'12px',background:'white',outline:'none',cursor:'pointer'}}>
              {opts.map(o=><option key={o}>{o}</option>)}
            </select>
          ))}
          <div style={{fontSize:'12px',color:'#666',marginLeft:'auto',flexShrink:0}}>{filtered.length} signals</div>
        </div>

        {/* Type quick-filter buttons */}
        <div style={{display:'flex',gap:'6px',marginBottom:'14px',flexWrap:'wrap'}}>
          {TYPES.map(t=>{
            const c = t==='ALL'?'#1a2c3e':TYPE_COLORS[t]||'#666';
            return (
              <button key={t} onClick={()=>setTypeF(t)}
                style={{padding:'6px 14px',border:'none',borderRadius:'20px',cursor:'pointer',fontSize:'11px',fontWeight:700,
                  background:typeF===t?c:'rgba(26,44,62,0.06)',color:typeF===t?'white':'#666',transition:'all 0.15s'}}>
                {t}
              </button>
            );
          })}
        </div>

        {/* Signals List */}
        <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
          {filtered.map(s=>(
            <div key={s.id}
              style={{background:'white',borderRadius:'12px',overflow:'hidden',
                borderLeft:`4px solid ${s.color}`,
                boxShadow:'0 1px 4px rgba(0,0,0,0.05)',
                animation:s.time==='Just now'?'fadeIn 0.4s ease':'none'}}>
              <div onClick={()=>setExpanded(expanded===s.id?null:s.id)}
                style={{padding:'14px 16px',cursor:'pointer',display:'flex',alignItems:'center',gap:'12px'}}>
                <span style={{fontSize:'20px'}}>{s.flag}</span>
                <div style={{flex:1}}>
                  <div style={{display:'flex',gap:'8px',alignItems:'center',marginBottom:'4px',flexWrap:'wrap'}}>
                    <span style={{fontSize:'10px',fontWeight:800,padding:'2px 8px',borderRadius:'10px',background:`${s.color}15`,color:s.color}}>{s.type}</span>
                    <span style={{fontSize:'10px',fontWeight:800,padding:'2px 7px',borderRadius:'10px',background:`${GRADE_COLORS[s.grade]}15`,color:GRADE_COLORS[s.grade]}}>{s.grade}</span>
                    <span style={{fontSize:'10px',color:'#999'}}>{s.eco} · {s.sector}</span>
                    <span style={{fontSize:'10px',color:'#999',marginLeft:'auto'}}>{s.time}</span>
                  </div>
                  <div style={{fontSize:'13px',fontWeight:600,color:'#1a2c3e',lineHeight:'1.4'}}>{s.text}</div>
                </div>
                <div style={{textAlign:'right',flexShrink:0,marginLeft:'8px'}}>
                  <div style={{fontSize:'18px',fontWeight:900,color:'#1a2c3e',fontFamily:'monospace'}}>{s.sci.toFixed(1)}</div>
                  <div style={{fontSize:'9px',color:'#999'}}>SCI Score</div>
                </div>
              </div>
              {expanded===s.id && (
                <div style={{padding:'0 16px 14px 52px',borderTop:'1px solid rgba(26,44,62,0.05)'}}>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',marginTop:'10px'}}>
                    {[
                      {l:'Region',v:s.region},{l:'Impact Level',v:s.impact},{l:'Signal Grade',v:s.grade},
                    ].map(({l,v})=>(
                      <div key={l} style={{padding:'8px 10px',background:'rgba(26,44,62,0.03)',borderRadius:'7px'}}>
                        <div style={{fontSize:'9px',color:'#999',marginBottom:'2px'}}>{l}</div>
                        <div style={{fontSize:'12px',fontWeight:700,color:'#1a2c3e'}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:'10px',padding:'10px 12px',background:'rgba(46,204,113,0.05)',borderRadius:'8px',border:'1px solid rgba(46,204,113,0.15)'}}>
                    <div style={{fontSize:'10px',fontWeight:700,color:'#2ecc71',marginBottom:'3px'}}>STRATEGIC IMPLICATION</div>
                    <div style={{fontSize:'12px',color:'#444',lineHeight:'1.6'}}>
                      This signal indicates {s.impact.toLowerCase()} investment opportunity in {s.eco}. 
                      Recommend immediate review against your current {s.sector} pipeline strategy.
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'8px',marginTop:'10px'}}>
                    <Link href="/reports" style={{padding:'7px 14px',background:'#1a2c3e',color:'white',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:700}}>
                      Generate Report →
                    </Link>
                    <Link href="/investment-analysis" style={{padding:'7px 14px',border:'1px solid rgba(26,44,62,0.15)',color:'#1a2c3e',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:600}}>
                      View Full Analysis
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
