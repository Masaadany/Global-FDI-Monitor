'use client';
import { useState, useMemo } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { TrendingUp, TrendingDown, ChevronUp, ChevronDown, Filter, Download, Info } from 'lucide-react';

const DIMS = [
  { code:'ETR', name:'Economic & Trade Resilience',  weight:0.20, color:'#1a2c3e', desc:'Macro stability, trade openness, external balance, currency resilience' },
  { code:'ICT', name:'Innovation & Creative Talent',  weight:0.18, color:'#2ecc71', desc:'R&D spend, patent filings, STEM graduates, startup ecosystem' },
  { code:'TCM', name:'Trade & Capital Mobility',      weight:0.18, color:'#3498db', desc:'FDI inflows, capital controls, current account, trade facilitation' },
  { code:'DTF', name:'Digital & Tech Frontier',       weight:0.16, color:'#9b59b6', desc:'Broadband, cloud adoption, digital government, AI readiness' },
  { code:'SGT', name:'Sustainable Growth Trajectory', weight:0.15, color:'#27ae60', desc:'Green investment, carbon intensity, ESG governance, SDG progress' },
  { code:'GRP', name:'Governance & Policy',           weight:0.13, color:'#f1c40f', desc:'Rule of law, regulatory quality, political stability, anti-corruption' },
];

const COUNTRIES = [
  { rank:1,  name:'Singapore',     flag:'🇸🇬', gfr:91.2, etr:93.1, ict:89.4, tcm:94.2, dtf:91.8, sgt:82.1, grp:96.4, trend:+0.3, tier:'TOP',  region:'Asia Pacific' },
  { rank:2,  name:'Denmark',       flag:'🇩🇰', gfr:89.8, etr:88.2, ict:91.4, tcm:86.3, dtf:90.1, sgt:94.2, grp:95.1, trend:+0.2, tier:'TOP',  region:'Europe' },
  { rank:3,  name:'Switzerland',   flag:'🇨🇭', gfr:89.1, etr:91.0, ict:92.3, tcm:88.4, dtf:87.6, sgt:88.3, grp:93.8, trend:+0.1, tier:'TOP',  region:'Europe' },
  { rank:4,  name:'Netherlands',   flag:'🇳🇱', gfr:87.4, etr:86.8, ict:88.2, tcm:89.1, dtf:89.4, sgt:87.6, grp:91.2, trend:-0.1, tier:'TOP',  region:'Europe' },
  { rank:5,  name:'South Korea',   flag:'🇰🇷', gfr:86.9, etr:84.3, ict:93.1, tcm:82.6, dtf:94.8, sgt:78.4, grp:88.2, trend:+0.4, tier:'TOP',  region:'Asia Pacific' },
  { rank:6,  name:'New Zealand',   flag:'🇳🇿', gfr:86.3, etr:83.1, ict:84.6, tcm:87.2, dtf:85.4, sgt:89.8, grp:94.6, trend:-0.2, tier:'TOP',  region:'Oceania' },
  { rank:7,  name:'Sweden',        flag:'🇸🇪', gfr:85.8, etr:82.4, ict:90.2, tcm:83.4, dtf:88.6, sgt:92.4, grp:92.8, trend:+0.1, tier:'TOP',  region:'Europe' },
  { rank:8,  name:'United Kingdom',flag:'🇬🇧', gfr:84.2, etr:81.6, ict:87.4, tcm:85.8, dtf:86.2, sgt:81.4, grp:89.6, trend:-0.3, tier:'TOP',  region:'Europe' },
  { rank:9,  name:'UAE',           flag:'🇦🇪', gfr:83.8, etr:86.4, ict:82.1, tcm:88.6, dtf:84.2, sgt:76.8, grp:88.4, trend:+1.4, tier:'TOP',  region:'Middle East' },
  { rank:10, name:'Germany',       flag:'🇩🇪', gfr:83.1, etr:84.2, ict:85.6, tcm:81.4, dtf:82.8, sgt:85.6, grp:88.2, trend:-0.2, tier:'TOP',  region:'Europe' },
  { rank:11, name:'United States', flag:'🇺🇸', gfr:82.6, etr:83.8, ict:88.4, tcm:84.2, dtf:89.6, sgt:72.4, grp:82.8, trend:-0.1, tier:'TOP',  region:'Americas' },
  { rank:12, name:'Japan',         flag:'🇯🇵', gfr:81.4, etr:79.8, ict:84.2, tcm:78.6, dtf:82.4, sgt:82.6, grp:86.8, trend:+0.2, tier:'TOP',  region:'Asia Pacific' },
  { rank:13, name:'Canada',        flag:'🇨🇦', gfr:80.8, etr:78.4, ict:82.6, tcm:82.4, dtf:81.6, sgt:80.4, grp:88.4, trend:0.0,  tier:'TOP',  region:'Americas' },
  { rank:14, name:'Malaysia',      flag:'🇲🇾', gfr:79.2, etr:78.6, ict:76.4, tcm:81.8, dtf:78.2, sgt:74.6, grp:82.4, trend:+0.6, tier:'HIGH', region:'Asia Pacific' },
  { rank:15, name:'Saudi Arabia',  flag:'🇸🇦', gfr:78.6, etr:82.4, ict:74.2, tcm:80.6, dtf:76.8, sgt:68.4, grp:82.6, trend:+2.2, tier:'HIGH', region:'Middle East' },
  { rank:16, name:'Thailand',      flag:'🇹🇭', gfr:77.4, etr:75.8, ict:72.6, tcm:78.4, dtf:74.6, sgt:72.8, grp:78.4, trend:+0.3, tier:'HIGH', region:'Asia Pacific' },
  { rank:17, name:'Vietnam',       flag:'🇻🇳', gfr:76.8, etr:74.2, ict:71.4, tcm:77.6, dtf:72.4, sgt:74.2, grp:74.8, trend:+0.8, tier:'HIGH', region:'Asia Pacific' },
  { rank:18, name:'India',         flag:'🇮🇳', gfr:75.6, etr:72.8, ict:76.4, tcm:74.2, dtf:72.8, sgt:68.6, grp:76.2, trend:+1.1, tier:'HIGH', region:'Asia Pacific' },
  { rank:19, name:'Indonesia',     flag:'🇮🇩', gfr:74.2, etr:72.4, ict:68.6, tcm:74.8, dtf:68.4, sgt:70.4, grp:74.6, trend:+0.4, tier:'HIGH', region:'Asia Pacific' },
  { rank:20, name:'Brazil',        flag:'🇧🇷', gfr:70.8, etr:68.4, ict:69.2, tcm:70.4, dtf:66.8, sgt:72.6, grp:68.4, trend:+0.6, tier:'HIGH', region:'Americas' },
  { rank:21, name:'Morocco',       flag:'🇲🇦', gfr:68.4, etr:66.8, ict:64.2, tcm:68.6, dtf:62.4, sgt:66.8, grp:70.2, trend:+0.8, tier:'HIGH', region:'Africa' },
  { rank:22, name:'Mexico',        flag:'🇲🇽', gfr:67.2, etr:65.4, ict:64.8, tcm:68.2, dtf:62.8, sgt:64.4, grp:66.8, trend:+0.2, tier:'HIGH', region:'Americas' },
  { rank:23, name:'Turkey',        flag:'🇹🇷', gfr:64.8, etr:63.2, ict:63.6, tcm:65.4, dtf:62.4, sgt:62.8, grp:62.4, trend:-0.4, tier:'HIGH', region:'Europe' },
  { rank:24, name:'Egypt',         flag:'🇪🇬', gfr:62.4, etr:60.8, ict:58.6, tcm:62.4, dtf:56.8, sgt:62.4, grp:64.8, trend:+0.4, tier:'HIGH', region:'Africa' },
  { rank:25, name:'Nigeria',       flag:'🇳🇬', gfr:54.6, etr:52.4, ict:50.8, tcm:54.2, dtf:48.6, sgt:56.4, grp:52.8, trend:+0.2, tier:'DEV',  region:'Africa' },
];

function scoreColor(s: number) {
  if(s>=80) return '#2ecc71';
  if(s>=60) return '#3498db';
  if(s>=40) return '#f1c40f';
  return '#e74c3c';
}
function tierBg(t: string) {
  if(t==='TOP') return { bg:'rgba(46,204,113,0.12)', color:'#1e8449', border:'rgba(46,204,113,0.25)' };
  if(t==='HIGH') return { bg:'rgba(52,152,219,0.12)', color:'#1a6ea8', border:'rgba(52,152,219,0.25)' };
  return { bg:'rgba(241,196,15,0.12)', color:'#7a6400', border:'rgba(241,196,15,0.25)' };
}

// Radar chart SVG
function RadarChart({ data }: { data: typeof COUNTRIES[0] }) {
  const dims2 = ['ETR','ICT','TCM','DTF','SGT','GRP'];
  const vals = [data.etr, data.ict, data.tcm, data.dtf, data.sgt, data.grp];
  const n = dims2.length;
  const cx = 100, cy = 100, r = 75;
  function point(i: number, v: number) {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    const dist = (v / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  }
  const polyPts = vals.map((v, i) => point(i, v));
  const poly = polyPts.map(p => `${p.x},${p.y}`).join(' ');
  const gridLevels = [20, 40, 60, 80, 100];
  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      {gridLevels.map(level => {
        const pts = dims2.map((_, i) => point(i, level));
        return <polygon key={level} points={pts.map(p=>`${p.x},${p.y}`).join(' ')}
          fill="none" stroke="rgba(26,44,62,0.08)" strokeWidth="0.5"/>;
      })}
      {dims2.map((_, i) => {
        const p = point(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(26,44,62,0.08)" strokeWidth="0.5"/>;
      })}
      <polygon points={poly} fill="rgba(46,204,113,0.2)" stroke="#2ecc71" strokeWidth="1.5"/>
      {dims2.map((label, i) => {
        const p = point(i, 115);
        return <text key={label} x={p.x} y={p.y} fontSize="8" fill="#7f8c8d" textAnchor="middle" dominantBaseline="middle">{label}</text>;
      })}
      {polyPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#2ecc71"/>
      ))}
    </svg>
  );
}

export default function GFRPage() {
  const [sortCol, setSortCol] = useState('rank');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
  const [selRegion, setSelRegion] = useState('ALL');
  const [selTier, setSelTier] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selCountry, setSelCountry] = useState(COUNTRIES[0]);
  const [activeTab, setActiveTab] = useState('ranking');

  const filtered = useMemo(() => {
    let d = [...COUNTRIES];
    if(selRegion !== 'ALL') d = d.filter(c => c.region === selRegion);
    if(selTier !== 'ALL') d = d.filter(c => c.tier === selTier);
    if(search) d = d.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    d.sort((a,b) => {
      const av = (a as any)[sortCol], bv = (b as any)[sortCol];
      return sortDir==='asc' ? (av>bv?1:-1) : (av<bv?1:-1);
    });
    return d;
  }, [sortCol, sortDir, selRegion, selTier, search]);

  function SortBtn({col}: {col:string}) {
    const active = sortCol === col;
    return (
      <span onClick={()=>{ if(active) setSortDir(d=>d==='asc'?'desc':'asc'); else { setSortCol(col); setSortDir('desc'); } }}
        style={{cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'2px'}}>
        {col.toUpperCase()}
        <span style={{display:'flex', flexDirection:'column', gap:'0'}}>
          <ChevronUp size={9} color={active&&sortDir==='asc'?'#2ecc71':'#bdc3c7'}/>
          <ChevronDown size={9} color={active&&sortDir==='desc'?'#2ecc71':'#bdc3c7'}/>
        </span>
      </span>
    );
  }

  const regions = ['ALL', ...Array.from(new Set(COUNTRIES.map(c=>c.region)))];

  return (
    <div style={{minHeight:'100vh', background:'#f0f4f8', fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <NavBar/>
      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#0f1e2a,#1a2c3e)', padding:'24px', borderBottom:'1px solid rgba(46,204,113,0.1)'}}>
        <div style={{maxWidth:'1440px', margin:'0 auto'}}>
          <div style={{fontSize:'10px', fontWeight:800, color:'#2ecc71', letterSpacing:'0.12em', marginBottom:'4px'}}>GFR RANKING</div>
          <h1 style={{fontSize:'24px', fontWeight:900, color:'white', marginBottom:'4px'}}>Global Future Readiness Ranking</h1>
          <p style={{color:'rgba(255,255,255,0.6)', fontSize:'13px', marginBottom:'16px'}}>
            6-Dimension composite scoring · 25 economies · Weekly AI-updated via AGT-05 · ETR · ICT · TCM · DTF · SGT · GRP
          </p>
          {/* 6 dimensions */}
          <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
            {DIMS.map(d=>(
              <div key={d.code} style={{padding:'6px 12px', background:'rgba(255,255,255,0.06)', borderRadius:'8px', border:`1px solid ${d.color}30`}}>
                <span style={{fontSize:'11px', fontWeight:800, color:d.color}}>{d.code}</span>
                <span style={{fontSize:'10px', color:'rgba(255,255,255,0.5)', marginLeft:'4px'}}>{(d.weight*100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
          {/* GFR Formula */}
          <div style={{marginTop:'12px', padding:'10px 14px', background:'rgba(46,204,113,0.08)', borderRadius:'8px', border:'1px solid rgba(46,204,113,0.15)'}}>
            <span style={{fontSize:'10px', fontWeight:700, color:'rgba(46,204,113,0.8)', letterSpacing:'0.06em'}}>GFR FORMULA  </span>
            <span style={{fontSize:'11px', color:'rgba(255,255,255,0.7)', fontFamily:"'JetBrains Mono',monospace"}}>
              = (0.20×ETR) + (0.18×ICT) + (0.18×TCM) + (0.16×DTF) + (0.15×SGT) + (0.13×GRP)
            </span>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{background:'white', borderBottom:'2px solid rgba(26,44,62,0.08)'}}>
        <div style={{maxWidth:'1440px', margin:'0 auto', padding:'0 24px', display:'flex', gap:0}}>
          {[['ranking','GFR Ranking Table'],['methodology','Methodology'],['compare','Compare Economies']].map(([t,l])=>(
            <button key={t} onClick={()=>setActiveTab(t)}
              style={{padding:'14px 22px', border:'none', borderBottom:`3px solid ${activeTab===t?'#2ecc71':'transparent'}`,
                background:'transparent', fontSize:'13px', fontWeight:activeTab===t?700:500,
                color:activeTab===t?'#1a2c3e':'#7f8c8d', cursor:'pointer', fontFamily:'inherit', marginBottom:'-2px'}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:'1440px', margin:'0 auto', padding:'20px 24px'}}>
        {activeTab === 'ranking' && (
          <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:'16px', alignItems:'start'}}>
            {/* Main table */}
            <div style={{background:'white', borderRadius:'16px', border:'1px solid rgba(26,44,62,0.08)', overflow:'hidden', boxShadow:'0 4px 6px -2px rgba(0,0,0,0.05)'}}>
              {/* Filters */}
              <div style={{padding:'14px 20px', borderBottom:'1px solid rgba(26,44,62,0.06)', display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center'}}>
                <div style={{position:'relative', flex:'1', minWidth:'180px'}}>
                  <input placeholder="Search economy..." value={search} onChange={e=>setSearch(e.target.value)}
                    style={{width:'100%', padding:'7px 12px', border:'1px solid rgba(26,44,62,0.12)', borderRadius:'8px', fontSize:'12px', outline:'none', fontFamily:'inherit'}}/>
                </div>
                <select value={selRegion} onChange={e=>setSelRegion(e.target.value)}
                  style={{padding:'7px 12px', border:'1px solid rgba(26,44,62,0.12)', borderRadius:'8px', fontSize:'12px', background:'white', outline:'none', cursor:'pointer', fontFamily:'inherit'}}>
                  {regions.map(r=><option key={r}>{r}</option>)}
                </select>
                <select value={selTier} onChange={e=>setSelTier(e.target.value)}
                  style={{padding:'7px 12px', border:'1px solid rgba(26,44,62,0.12)', borderRadius:'8px', fontSize:'12px', background:'white', outline:'none', cursor:'pointer', fontFamily:'inherit'}}>
                  {['ALL','TOP','HIGH','DEV'].map(t=><option key={t}>{t}</option>)}
                </select>
                <button style={{padding:'7px 14px', background:'rgba(46,204,113,0.08)', border:'1px solid rgba(46,204,113,0.2)', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:600, color:'#2ecc71', display:'flex', alignItems:'center', gap:'5px', fontFamily:'inherit'}}>
                  <Download size={12}/> Export
                </button>
              </div>
              {/* Table */}
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px'}}>
                  <thead>
                    <tr style={{background:'rgba(26,44,62,0.03)'}}>
                      {[['rank','#'],['name','Economy'],['gfr','GFR Score'],['etr','ETR'],['ict','ICT'],['tcm','TCM'],['dtf','DTF'],['sgt','SGT'],['grp','GRP'],['trend','Δ MoM']].map(([col,label])=>(
                        <th key={col} style={{padding:'10px 12px', textAlign:col==='name'?'left':'center', fontWeight:700, color:'#7f8c8d', textTransform:'uppercase', fontSize:'10px', letterSpacing:'0.06em', borderBottom:'1px solid rgba(26,44,62,0.08)', whiteSpace:'nowrap', cursor:'pointer'}}
                          onClick={()=>{ if(sortCol===col) setSortDir(d=>d==='asc'?'desc':'asc'); else { setSortCol(col); setSortDir(col==='rank'?'asc':'desc'); } }}>
                          {label}
                          {sortCol===col && <span style={{marginLeft:'3px'}}>{sortDir==='asc'?'↑':'↓'}</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c, ri) => {
                      const tb = tierBg(c.tier);
                      const isSel = c.name === selCountry.name;
                      return (
                        <tr key={c.name} onClick={()=>setSelCountry(c)}
                          style={{cursor:'pointer', background:isSel?'rgba(46,204,113,0.04)':'ri%2===0?"#fafafa":"white"',
                            borderBottom:'1px solid rgba(26,44,62,0.05)', transition:'background 0.15s'}}>
                          <td style={{padding:'10px 12px', textAlign:'center', fontWeight:700, color:'#7f8c8d', fontFamily:"'JetBrains Mono',monospace"}}>{c.rank}</td>
                          <td style={{padding:'10px 12px'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                              <span style={{fontSize:'18px'}}>{c.flag}</span>
                              <div>
                                <div style={{fontWeight:700, color:'#1a2c3e'}}>{c.name}</div>
                                <div style={{fontSize:'10px', color:'#7f8c8d'}}>{c.region}</div>
                              </div>
                              <span style={{marginLeft:'4px', fontSize:'9px', fontWeight:800, padding:'2px 7px', borderRadius:'10px', background:tb.bg, color:tb.color, border:`1px solid ${tb.border}`}}>{c.tier}</span>
                            </div>
                          </td>
                          <td style={{padding:'10px 12px', textAlign:'center'}}>
                            <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'3px'}}>
                              <span style={{fontSize:'14px', fontWeight:900, color:scoreColor(c.gfr), fontFamily:"'JetBrains Mono',monospace"}}>{c.gfr}</span>
                              <div style={{width:'50px', height:'4px', background:'rgba(26,44,62,0.06)', borderRadius:'2px'}}>
                                <div style={{height:'100%', width:`${c.gfr}%`, background:scoreColor(c.gfr), borderRadius:'2px'}}/>
                              </div>
                            </div>
                          </td>
                          {[c.etr,c.ict,c.tcm,c.dtf,c.sgt,c.grp].map((v,vi)=>(
                            <td key={vi} style={{padding:'10px 8px', textAlign:'center', fontSize:'12px', fontWeight:600, color:scoreColor(v), fontFamily:"'JetBrains Mono',monospace"}}>{v}</td>
                          ))}
                          <td style={{padding:'10px 12px', textAlign:'center'}}>
                            <span style={{display:'flex', alignItems:'center', gap:'3px', justifyContent:'center', fontSize:'11px', fontWeight:700,
                              color:c.trend>0?'#2ecc71':c.trend<0?'#e74c3c':'#7f8c8d'}}>
                              {c.trend>0?<TrendingUp size={11}/>:c.trend<0?<TrendingDown size={11}/>:null}
                              {c.trend>0?'+':''}{c.trend}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{padding:'12px 20px', borderTop:'1px solid rgba(26,44,62,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{fontSize:'12px', color:'#7f8c8d'}}>{filtered.length} economies · Sorted by {sortCol.toUpperCase()}</span>
                <div style={{display:'flex', gap:'8px'}}>
                  {[['TOP','#2ecc71'],['HIGH','#3498db'],['DEV','#f1c40f']].map(([tier,c])=>(
                    <div key={tier} style={{display:'flex', alignItems:'center', gap:'4px', fontSize:'10px', color:'#7f8c8d'}}>
                      <div style={{width:'8px', height:'8px', borderRadius:'50%', background:c}}/>
                      {tier} {tier==='TOP'?'(≥80)':tier==='HIGH'?'(60-79)':'(<60)'}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side panel - country detail */}
            <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
              <div style={{background:'white', borderRadius:'16px', border:'1px solid rgba(26,44,62,0.08)', overflow:'hidden', boxShadow:'0 4px 6px -2px rgba(0,0,0,0.05)'}}>
                <div style={{background:'#1a2c3e', padding:'16px 18px'}}>
                  <div style={{fontSize:'10px', color:'rgba(255,255,255,0.4)', letterSpacing:'0.1em', marginBottom:'4px'}}>SELECTED ECONOMY</div>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <span style={{fontSize:'32px'}}>{selCountry.flag}</span>
                    <div>
                      <div style={{fontSize:'18px', fontWeight:900, color:'white'}}>{selCountry.name}</div>
                      <div style={{fontSize:'11px', color:'rgba(255,255,255,0.5)'}}>{selCountry.region} · Rank #{selCountry.rank}</div>
                    </div>
                  </div>
                  <div style={{marginTop:'12px', textAlign:'center'}}>
                    <div style={{fontSize:'42px', fontWeight:900, color:'#2ecc71', fontFamily:"'JetBrains Mono',monospace", lineHeight:1}}>{selCountry.gfr}</div>
                    <div style={{fontSize:'12px', color:'rgba(255,255,255,0.6)', marginTop:'2px'}}>
                      {tierBg(selCountry.tier).color ? selCountry.tier+' TIER' : ''}
                    </div>
                  </div>
                </div>
                <div style={{padding:'14px 18px'}}>
                  <div style={{display:'flex', justifyContent:'center', marginBottom:'12px'}}>
                    <RadarChart data={selCountry}/>
                  </div>
                  {DIMS.map(dim => {
                    const v = (selCountry as any)[dim.code.toLowerCase()];
                    return (
                      <div key={dim.code} style={{marginBottom:'8px'}}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'2px'}}>
                          <span style={{fontSize:'11px', fontWeight:600, color:'#2c3e50'}}>{dim.code} <span style={{color:'#7f8c8d', fontSize:'10px'}}>({(dim.weight*100).toFixed(0)}%)</span></span>
                          <span style={{fontSize:'11px', fontWeight:800, color:dim.color, fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>
                        </div>
                        <div style={{height:'5px', background:'rgba(26,44,62,0.07)', borderRadius:'3px'}}>
                          <div style={{height:'100%', width:`${v}%`, background:dim.color, borderRadius:'3px', transition:'width 0.6s ease'}}/>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{marginTop:'14px', display:'flex', gap:'8px'}}>
                    <Link href="/investment-analysis?tab=benchmark" style={{flex:1, padding:'8px', background:'rgba(46,204,113,0.06)', border:'1px solid rgba(46,204,113,0.2)', borderRadius:'8px', textDecoration:'none', fontSize:'11px', fontWeight:600, color:'#2ecc71', textAlign:'center', display:'block'}}>
                      Benchmark
                    </Link>
                    <Link href="/reports" style={{flex:1, padding:'8px', background:'rgba(26,44,62,0.05)', border:'1px solid rgba(26,44,62,0.1)', borderRadius:'8px', textDecoration:'none', fontSize:'11px', fontWeight:600, color:'#1a2c3e', textAlign:'center', display:'block'}}>
                      Generate Report
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'methodology' && (
          <div style={{background:'white', borderRadius:'16px', border:'1px solid rgba(26,44,62,0.08)', padding:'28px', boxShadow:'0 4px 6px -2px rgba(0,0,0,0.05)'}}>
            <h2 style={{fontSize:'22px', fontWeight:800, color:'#1a2c3e', marginBottom:'6px'}}>GFR Ranking Methodology</h2>
            <p style={{fontSize:'13px', color:'#7f8c8d', marginBottom:'24px'}}>The Global Future Readiness Ranking is a 6-dimension composite index measuring an economy's readiness to attract and retain foreign direct investment in the medium-to-long term.</p>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px'}}>
              {DIMS.map(dim => (
                <div key={dim.code} style={{padding:'20px', background:'rgba(26,44,62,0.02)', borderRadius:'12px', border:'1px solid rgba(26,44,62,0.07)', borderLeft:`4px solid ${dim.color}`}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                    <span style={{fontSize:'18px', fontWeight:900, color:dim.color}}>{dim.code}</span>
                    <span style={{fontSize:'12px', fontWeight:800, padding:'3px 10px', borderRadius:'12px', background:`${dim.color}15`, color:dim.color}}>{(dim.weight*100).toFixed(0)}%</span>
                  </div>
                  <div style={{fontSize:'13px', fontWeight:700, color:'#1a2c3e', marginBottom:'6px'}}>{dim.name}</div>
                  <div style={{fontSize:'12px', color:'#7f8c8d', lineHeight:'1.65'}}>{dim.desc}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:'24px', padding:'18px', background:'rgba(26,44,62,0.03)', borderRadius:'12px', border:'1px solid rgba(46,204,113,0.15)'}}>
              <div style={{fontSize:'12px', fontWeight:700, color:'#2ecc71', letterSpacing:'0.06em', marginBottom:'6px'}}>GFR FORMULA</div>
              <div style={{fontSize:'14px', color:'#1a2c3e', fontFamily:"'JetBrains Mono',monospace"}}>
                GFR = (0.20×ETR) + (0.18×ICT) + (0.18×TCM) + (0.16×DTF) + (0.15×SGT) + (0.13×GRP)
              </div>
              <div style={{marginTop:'10px', fontSize:'12px', color:'#7f8c8d'}}>
                Score ranges: <strong style={{color:'#2ecc71'}}>80–100 Top Tier</strong> · <strong style={{color:'#3498db'}}>60–79 High Tier</strong> · <strong style={{color:'#f1c40f'}}>Below 60 Developing Tier</strong>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <div style={{background:'white', borderRadius:'16px', border:'1px solid rgba(26,44,62,0.08)', padding:'28px', boxShadow:'0 4px 6px -2px rgba(0,0,0,0.05)', textAlign:'center'}}>
            <div style={{fontSize:'40px', marginBottom:'12px'}}>📊</div>
            <h2 style={{fontSize:'20px', fontWeight:800, color:'#1a2c3e', marginBottom:'8px'}}>Economy Comparison</h2>
            <p style={{fontSize:'13px', color:'#7f8c8d', marginBottom:'20px'}}>Compare multiple economies across all 6 GFR dimensions side-by-side</p>
            <Link href="/investment-analysis?tab=benchmark" style={{display:'inline-block', padding:'12px 28px', background:'#2ecc71', color:'#0f1e2a', borderRadius:'9px', textDecoration:'none', fontSize:'13px', fontWeight:800}}>
              Go to Benchmark Tool →
            </Link>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
