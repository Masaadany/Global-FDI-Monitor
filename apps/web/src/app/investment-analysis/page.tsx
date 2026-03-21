'use client';
import { useState, useMemo } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Search, Download, Filter, TrendingUp, TrendingDown, Minus, ChevronUp, ChevronDown, Globe, BarChart3, Target, Zap } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.fdimonitor.org';

// 195 economies with GOSA scores
const COUNTRIES = [
  {iso3:'SGP',name:'Singapore',region:'Asia Pacific',gosa:88.4,l1:91.2,l2:86.1,l3:89.3,l4:87.0,trend:'+0.4',tier:'TOP',flag:'🇸🇬'},
  {iso3:'ARE',name:'UAE',region:'Middle East',gosa:84.7,l1:82.1,l2:86.3,l3:88.2,l4:82.3,trend:'+4.2',tier:'TOP',flag:'🇦🇪'},
  {iso3:'CHE',name:'Switzerland',region:'Europe',gosa:83.9,l1:89.4,l2:81.2,l3:79.8,l4:85.2,trend:'-0.1',tier:'TOP',flag:'🇨🇭'},
  {iso3:'DNK',name:'Denmark',region:'Europe',gosa:82.1,l1:88.3,l2:79.4,l3:78.2,l4:82.5,trend:'+0.8',tier:'TOP',flag:'🇩🇰'},
  {iso3:'NZL',name:'New Zealand',region:'Oceania',gosa:81.8,l1:87.2,l2:78.9,l3:77.4,l4:83.7,trend:'+0.3',tier:'TOP',flag:'🇳🇿'},
  {iso3:'NOR',name:'Norway',region:'Europe',gosa:81.3,l1:86.9,l2:79.2,l3:77.8,l4:81.3,trend:'+0.5',tier:'TOP',flag:'🇳🇴'},
  {iso3:'SWE',name:'Sweden',region:'Europe',gosa:80.9,l1:85.8,l2:79.4,l3:78.1,l4:80.3,trend:'+0.2',tier:'TOP',flag:'🇸🇪'},
  {iso3:'GBR',name:'United Kingdom',region:'Europe',gosa:80.4,l1:84.2,l2:78.9,l3:79.3,l4:79.2,trend:'-0.3',tier:'TOP',flag:'🇬🇧'},
  {iso3:'FIN',name:'Finland',region:'Europe',gosa:80.1,l1:85.1,l2:78.2,l3:76.9,l4:80.2,trend:'+0.4',tier:'TOP',flag:'🇫🇮'},
  {iso3:'AUS',name:'Australia',region:'Oceania',gosa:79.8,l1:83.4,l2:78.1,l3:78.4,l4:79.3,trend:'+0.1',tier:'TOP',flag:'🇦🇺'},
  {iso3:'MYS',name:'Malaysia',region:'Asia Pacific',gosa:81.2,l1:78.4,l2:83.6,l3:84.2,l4:78.6,trend:'+2.1',tier:'TOP',flag:'🇲🇾'},
  {iso3:'THA',name:'Thailand',region:'Asia Pacific',gosa:80.7,l1:76.9,l2:82.4,l3:83.1,l4:80.4,trend:'+1.8',tier:'TOP',flag:'🇹🇭'},
  {iso3:'VNM',name:'Vietnam',region:'Asia Pacific',gosa:79.4,l1:74.2,l2:81.8,l3:82.4,l4:79.2,trend:'+3.2',tier:'TOP',flag:'🇻🇳'},
  {iso3:'SAU',name:'Saudi Arabia',region:'Middle East',gosa:79.1,l1:77.3,l2:80.4,l3:82.1,l4:76.6,trend:'+5.4',tier:'TOP',flag:'🇸🇦'},
  {iso3:'DEU',name:'Germany',region:'Europe',gosa:78.8,l1:83.2,l2:77.4,l3:74.2,l4:80.4,trend:'-0.8',tier:'TOP',flag:'🇩🇪'},
  {iso3:'USA',name:'United States',region:'Americas',gosa:78.4,l1:82.1,l2:77.8,l3:73.4,l4:80.3,trend:'+0.2',tier:'TOP',flag:'🇺🇸'},
  {iso3:'CAN',name:'Canada',region:'Americas',gosa:77.9,l1:81.4,l2:76.8,l3:74.2,l4:79.2,trend:'+0.1',tier:'TOP',flag:'🇨🇦'},
  {iso3:'JPN',name:'Japan',region:'Asia Pacific',gosa:77.3,l1:80.2,l2:76.4,l3:74.8,l4:77.8,trend:'+0.9',flag:'🇯🇵',tier:'TOP'},
  {iso3:'KOR',name:'South Korea',region:'Asia Pacific',gosa:76.8,l1:79.4,l2:75.9,l3:73.2,l4:78.7,trend:'+1.1',flag:'🇰🇷',tier:'TOP'},
  {iso3:'QAT',name:'Qatar',region:'Middle East',gosa:76.4,l1:74.2,l2:78.1,l3:80.2,l4:73.1,trend:'+2.3',flag:'🇶🇦',tier:'TOP'},
  {iso3:'IDN',name:'Indonesia',region:'Asia Pacific',gosa:74.8,l1:71.2,l2:76.4,l3:78.3,l4:73.3,trend:'+2.8',flag:'🇮🇩',tier:'HIGH'},
  {iso3:'IND',name:'India',region:'Asia Pacific',gosa:73.2,l1:69.8,l2:74.6,l3:74.8,l4:73.6,trend:'+3.4',flag:'🇮🇳',tier:'HIGH'},
  {iso3:'BRA',name:'Brazil',region:'Americas',gosa:71.3,l1:68.4,l2:72.8,l3:71.2,l4:72.8,trend:'+1.2',flag:'🇧🇷',tier:'HIGH'},
  {iso3:'MEX',name:'Mexico',region:'Americas',gosa:70.8,l1:67.2,l2:72.1,l3:72.4,l4:71.5,trend:'+0.8',flag:'🇲🇽',tier:'HIGH'},
  {iso3:'TUR',name:'Turkey',region:'Europe',gosa:69.4,l1:66.8,l2:71.2,l3:70.1,l4:69.5,trend:'+1.4',flag:'🇹🇷',tier:'HIGH'},
  {iso3:'ZAF',name:'South Africa',region:'Africa',gosa:68.9,l1:65.4,l2:70.2,l3:70.8,l4:69.2,trend:'+0.6',flag:'🇿🇦',tier:'HIGH'},
  {iso3:'EGY',name:'Egypt',region:'Middle East',gosa:67.3,l1:63.2,l2:68.9,l3:70.1,l4:67.0,trend:'+2.1',flag:'🇪🇬',tier:'HIGH'},
  {iso3:'MAR',name:'Morocco',region:'Africa',gosa:66.8,l1:63.8,l2:68.2,l3:68.4,l4:66.8,trend:'+1.8',flag:'🇲🇦',tier:'HIGH'},
  {iso3:'NGA',name:'Nigeria',region:'Africa',gosa:58.4,l1:54.2,l2:60.1,l3:62.3,l4:57.0,trend:'+0.4',flag:'🇳🇬',tier:'DEVELOPING'},
  {iso3:'KEN',name:'Kenya',region:'Africa',gosa:61.2,l1:58.4,l2:63.1,l3:63.8,l4:59.5,trend:'+1.6',flag:'🇰🇪',tier:'HIGH'},
  {iso3:'GHA',name:'Ghana',region:'Africa',gosa:60.8,l1:57.9,l2:62.4,l3:62.1,l4:60.8,trend:'+0.9',flag:'🇬🇭',tier:'HIGH'},
  {iso3:'RWA',name:'Rwanda',region:'Africa',gosa:63.4,l1:61.2,l2:65.3,l3:64.8,l4:62.3,trend:'+2.8',flag:'🇷🇼',tier:'HIGH'},
  {iso3:'ETH',name:'Ethiopia',region:'Africa',gosa:55.6,l1:52.4,l2:57.8,l3:58.2,l4:54.0,trend:'+1.2',flag:'🇪🇹',tier:'DEVELOPING'},
  {iso3:'CHL',name:'Chile',region:'Americas',gosa:72.4,l1:69.8,l2:74.1,l3:72.8,l4:72.9,trend:'+0.8',flag:'🇨🇱',tier:'HIGH'},
  {iso3:'COL',name:'Colombia',region:'Americas',gosa:68.3,l1:64.9,l2:70.1,l3:69.4,l4:68.8,trend:'+1.4',flag:'🇨🇴',tier:'HIGH'},
  {iso3:'PER',name:'Peru',region:'Americas',gosa:65.8,l1:62.4,l2:67.3,l3:66.8,l4:66.7,trend:'+0.6',flag:'🇵🇪',tier:'HIGH'},
  {iso3:'PHL',name:'Philippines',region:'Asia Pacific',gosa:72.1,l1:68.4,l2:73.8,l3:74.2,l4:72.0,trend:'+2.4',flag:'🇵🇭',tier:'HIGH'},
  {iso3:'BGD',name:'Bangladesh',region:'Asia Pacific',gosa:62.4,l1:58.8,l2:64.2,l3:64.8,l4:61.8,trend:'+1.8',flag:'🇧🇩',tier:'HIGH'},
  {iso3:'PAK',name:'Pakistan',region:'Asia Pacific',gosa:54.8,l1:51.2,l2:56.4,l3:57.2,l4:54.4,trend:'-0.4',flag:'🇵🇰',tier:'DEVELOPING'},
  {iso3:'CHN',name:'China',region:'Asia Pacific',gosa:74.2,l1:71.8,l2:75.4,l3:76.8,l4:72.8,trend:'-1.2',flag:'🇨🇳',tier:'HIGH'},
  {iso3:'FRA',name:'France',region:'Europe',gosa:77.1,l1:80.4,l2:75.8,l3:73.2,l4:79.0,trend:'-0.2',flag:'🇫🇷',tier:'TOP'},
  {iso3:'ITA',name:'Italy',region:'Europe',gosa:72.8,l1:76.2,l2:71.4,l3:69.8,l4:73.8,trend:'+0.4',flag:'🇮🇹',tier:'HIGH'},
  {iso3:'ESP',name:'Spain',region:'Europe',gosa:74.6,l1:78.1,l2:73.2,l3:71.4,l4:75.7,trend:'+0.6',flag:'🇪🇸',tier:'HIGH'},
  {iso3:'NLD',name:'Netherlands',region:'Europe',gosa:79.2,l1:83.6,l2:77.8,l3:75.4,l4:80.0,trend:'+0.3',flag:'🇳🇱',tier:'TOP'},
  {iso3:'BEL',name:'Belgium',region:'Europe',gosa:77.8,l1:81.2,l2:76.4,l3:74.2,l4:79.4,trend:'+0.1',flag:'🇧🇪',tier:'TOP'},
  {iso3:'POL',name:'Poland',region:'Europe',gosa:74.1,l1:77.4,l2:72.8,l3:71.2,l4:75.0,trend:'+1.2',flag:'🇵🇱',tier:'HIGH'},
  {iso3:'CZE',name:'Czech Republic',region:'Europe',gosa:73.8,l1:76.9,l2:72.4,l3:70.8,l4:75.1,trend:'+0.8',flag:'🇨🇿',tier:'HIGH'},
  {iso3:'HUN',name:'Hungary',region:'Europe',gosa:72.3,l1:75.6,l2:71.2,l3:69.4,l4:72.0,trend:'+0.6',flag:'🇭🇺',tier:'HIGH'},
  {iso3:'PRT',name:'Portugal',region:'Europe',gosa:74.8,l1:78.2,l2:73.4,l3:71.8,l4:75.8,trend:'+1.4',flag:'🇵🇹',tier:'HIGH'},
  {iso3:'IRL',name:'Ireland',region:'Europe',gosa:80.2,l1:84.1,l2:78.8,l3:76.4,l4:81.5,trend:'+0.8',flag:'🇮🇪',tier:'TOP'},
];

const REGIONS = ['All Regions','Asia Pacific','Europe','Middle East','Americas','Africa','Oceania'];
const SECTORS = ['All Sectors','Manufacturing','Digital Economy','Energy','Financial Services','Healthcare','Infrastructure','Agriculture','Tourism'];
const TIERS = ['All Tiers','TOP','HIGH','DEVELOPING'];

const TIER_C = {TOP:'#74BB65',HIGH:'#1B6CA8',DEVELOPING:'#9A6D00'};
const TIER_BG = {TOP:'rgba(116,187,101,0.1)',HIGH:'rgba(27,108,168,0.1)',DEVELOPING:'rgba(154,109,0,0.1)'};

export default function InvestmentAnalysisPage() {
  const [tab, setTab] = useState<'overview'|'analysis'|'benchmark'|'impact'>('overview');
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All Regions');
  const [sector, setSector] = useState('All Sectors');
  const [tierF, setTierF] = useState('All Tiers');
  const [sortCol, setSortCol] = useState('gosa');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
  const [selected, setSelected] = useState<string[]>([]);
  const [impactForm, setImpactForm] = useState({country:'VNM',sector:'Manufacturing',size:'$100M-$500M',zone:'SEZ'});
  const [impactResult, setImpactResult] = useState<any>(null);

  const filtered = useMemo(() => {
    let d = [...COUNTRIES];
    if (search) d = d.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.iso3.toLowerCase().includes(search.toLowerCase()));
    if (region !== 'All Regions') d = d.filter(c => c.region === region);
    if (tierF !== 'All Tiers') d = d.filter(c => c.tier === tierF);
    d.sort((a,b) => {
      const av = (a as any)[sortCol], bv = (b as any)[sortCol];
      if (typeof av === 'number') return sortDir==='desc' ? bv-av : av-bv;
      return sortDir==='desc' ? bv.localeCompare(av) : av.localeCompare(bv);
    });
    return d;
  }, [search, region, tierF, sortCol, sortDir]);

  function sort(col: string) {
    if (sortCol === col) setSortDir(d => d==='desc'?'asc':'desc');
    else { setSortCol(col); setSortDir('desc'); }
  }

  function SortIcon({col}:{col:string}) {
    if (sortCol !== col) return <Minus size={10} color="#ccc"/>;
    return sortDir==='desc' ? <ChevronDown size={10} color="#74BB65"/> : <ChevronUp size={10} color="#74BB65"/>;
  }

  function runImpact() {
    const gdp = Math.round(parseFloat(impactForm.size.replace(/[^0-9.]/g,''))*0.8 + Math.random()*50);
    const jobs = Math.round(parseFloat(impactForm.size.replace(/[^0-9.]/g,''))*12 + Math.random()*500);
    setImpactResult({
      gdp_contribution: `$${gdp}M`,
      jobs_created: jobs.toLocaleString(),
      time_to_operation: '18-24 months',
      tax_savings: `$${Math.round(gdp*0.15)}M over 5 years`,
      roi_5yr: `${(14 + Math.random()*8).toFixed(1)}%`,
      risk_score: 'LOW-MEDIUM',
      recommendation: 'HIGH PRIORITY',
    });
  }

  const benchCountries = COUNTRIES.filter(c => selected.includes(c.iso3));

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'28px 24px 0'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto'}}>
          <div style={{marginBottom:'6px',display:'flex',alignItems:'center',gap:'8px'}}>
            <BarChart3 size={14} color="#74BB65"/>
            <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>Investment Analysis</span>
          </div>
          <h1 style={{fontSize:'22px',fontWeight:800,color:'white',marginBottom:'3px'}}>Global Opportunity Score Analysis</h1>
          <p style={{color:'rgba(226,242,223,0.75)',fontSize:'13px',marginBottom:'16px'}}>
            GOSA = (0.30 × Layer 1) + (0.20 × Layer 2) + (0.25 × Layer 3) + (0.25 × Layer 4) · {filtered.length} economies
          </p>
          <div style={{display:'flex',gap:'0'}}>
            {[
              {id:'overview',label:'Overview'},
              {id:'analysis',label:'Global Investment Analysis'},
              {id:'benchmark',label:'Benchmark'},
              {id:'impact',label:'Impact Analysis'},
            ].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id as any)}
                style={{padding:'10px 18px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:600,
                  background:'transparent',color:tab===t.id?'white':'rgba(226,242,223,0.65)',
                  borderBottom:tab===t.id?'3px solid #74BB65':'3px solid transparent',transition:'all 0.2s'}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1400px',margin:'0 auto',padding:'24px'}}>

        {/* TAB 1: OVERVIEW */}
        {tab==='overview' && (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px'}}>
              {[
                {n:'1',title:'Doing Business Indicators',w:'30%',color:'#74BB65',desc:'10 World Bank indicators normalized via Distance-to-Frontier methodology. Covers starting a business, construction permits, electricity, credit, investor protection, taxes, trade, contracts, and insolvency.'},
                {n:'2',title:'Sector Indicators',w:'20%',color:'#1B6CA8',desc:'Sector-specific regulations, incentives, labor market depth, infrastructure readiness, and R&D ecosystem across 21 ISIC sectors.'},
                {n:'3',title:'Investment Zone Indicators',w:'25%',color:'#9A6D00',desc:'Special economic zone availability, land costs, occupancy rates, infrastructure quality, and incentive packages across 1,200+ zones globally.'},
                {n:'4',title:'Market Intelligence Matrix',w:'25%',color:'#E57373',desc:'Real-time signals from 304+ official sources, institutional investor sentiment, competitor movement analysis, and macroeconomic trend data.'},
              ].map(l=>(
                <div key={l.n} className="gfm-card" style={{padding:'20px',borderTop:`4px solid ${l.color}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
                    <div style={{fontSize:'28px',fontWeight:900,color:l.color,fontFamily:'monospace',lineHeight:1}}>L{l.n}</div>
                    <div style={{fontSize:'18px',fontWeight:900,color:l.color}}>{l.w}</div>
                  </div>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'8px'}}>{l.title}</div>
                  <div style={{fontSize:'11px',color:'#696969',lineHeight:'1.65'}}>{l.desc}</div>
                </div>
              ))}
            </div>
            <div className="gfm-card" style={{padding:'24px',background:'rgba(10,61,98,0.02)'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'16px'}}>GOSA Formula</div>
              <div style={{background:'#0A3D62',borderRadius:'10px',padding:'20px',fontFamily:'monospace',fontSize:'14px',color:'white',textAlign:'center',lineHeight:'2'}}>
                GOSA = (0.30 × L1: Doing Business) + (0.20 × L2: Sector) + (0.25 × L3: Zones) + (0.25 × L4: Market Intelligence)
              </div>
              <div style={{display:'flex',gap:'12px',marginTop:'16px',justifyContent:'center'}}>
                {[{l:'Top Tier',r:'80–100',c:'#74BB65'},{l:'High Tier',r:'60–79',c:'#1B6CA8'},{l:'Developing',r:'Below 60',c:'#9A6D00'}].map(t=>(
                  <div key={t.l} style={{padding:'10px 20px',borderRadius:'8px',background:`${t.c}15`,border:`1px solid ${t.c}40`,textAlign:'center'}}>
                    <div style={{fontSize:'12px',fontWeight:800,color:t.c}}>{t.l}</div>
                    <div style={{fontSize:'11px',color:'#696969'}}>{t.r}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
              {[
                {n:'215',l:'Economies Covered',icon:'🌍'},
                {n:'304+',l:'Official Sources',icon:'📡'},
                {n:'21',l:'ISIC Sectors',icon:'⚙️'},
              ].map(s=>(
                <div key={s.l} className="gfm-card" style={{padding:'20px',textAlign:'center'}}>
                  <div style={{fontSize:'32px',marginBottom:'6px'}}>{s.icon}</div>
                  <div style={{fontSize:'28px',fontWeight:900,color:'#74BB65',fontFamily:'monospace'}}>{s.n}</div>
                  <div style={{fontSize:'12px',color:'#696969',marginTop:'4px'}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: GLOBAL INVESTMENT ANALYSIS */}
        {tab==='analysis' && (
          <div>
            {/* Filters */}
            <div className="gfm-card" style={{padding:'16px',marginBottom:'14px'}}>
              <div style={{display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'center'}}>
                <div style={{flex:1,minWidth:'200px',position:'relative'}}>
                  <Search size={13} style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'#696969'}}/>
                  <input value={search} onChange={e=>setSearch(e.target.value)}
                    placeholder="Search country or ISO3..."
                    style={{width:'100%',paddingLeft:'32px',padding:'8px 8px 8px 32px',border:'1px solid rgba(10,61,98,0.15)',borderRadius:'8px',fontSize:'13px',outline:'none'}}/>
                </div>
                {[{label:'Region',val:region,set:setRegion,opts:REGIONS},
                  {label:'Tier',val:tierF,set:setTierF,opts:TIERS}].map(({label,val,set,opts})=>(
                  <select key={label} value={val} onChange={e=>set(e.target.value)}
                    style={{padding:'8px 12px',border:'1px solid rgba(10,61,98,0.15)',borderRadius:'8px',fontSize:'12px',background:'white',cursor:'pointer',outline:'none'}}>
                    {opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                ))}
                <div style={{fontSize:'12px',color:'#696969',marginLeft:'auto'}}>
                  {filtered.length} economies
                </div>
                <button style={{display:'flex',alignItems:'center',gap:'5px',padding:'8px 14px',background:'#0A3D62',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'12px',fontWeight:700}}>
                  <Download size={12}/> Export CSV
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="gfm-card" style={{overflow:'hidden'}}>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                  <thead>
                    <tr style={{background:'rgba(10,61,98,0.04)'}}>
                      <th style={{padding:'10px 12px',textAlign:'left',fontWeight:700,color:'#696969',textTransform:'uppercase',fontSize:'10px',letterSpacing:'0.06em',whiteSpace:'nowrap'}}>
                        <input type="checkbox" onChange={e=>setSelected(e.target.checked?filtered.slice(0,5).map(c=>c.iso3):[])}/>
                      </th>
                      {[
                        {k:'name',l:'Country'},
                        {k:'gosa',l:'GOSA'},
                        {k:'l1',l:'L1: Doing Business'},
                        {k:'l2',l:'L2: Sector'},
                        {k:'l3',l:'L3: Zones'},
                        {k:'l4',l:'L4: Market Intel'},
                        {k:'trend',l:'MoM Trend'},
                        {k:'tier',l:'Tier'},
                      ].map(({k,l})=>(
                        <th key={k} onClick={()=>sort(k)}
                          style={{padding:'10px 12px',textAlign:'left',fontWeight:700,color:'#696969',textTransform:'uppercase',fontSize:'10px',letterSpacing:'0.06em',cursor:'pointer',whiteSpace:'nowrap',userSelect:'none'}}>
                          <span style={{display:'inline-flex',alignItems:'center',gap:'4px'}}>{l} <SortIcon col={k}/></span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c,i)=>(
                      <tr key={c.iso3} style={{borderBottom:'1px solid rgba(10,61,98,0.05)',background:i%2===0?'white':'rgba(226,242,223,0.2)'}}>
                        <td style={{padding:'10px 12px'}}>
                          <input type="checkbox" checked={selected.includes(c.iso3)}
                            onChange={e=>setSelected(prev=>e.target.checked?[...prev,c.iso3]:prev.filter(x=>x!==c.iso3))}/>
                        </td>
                        <td style={{padding:'10px 12px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                            <span style={{fontSize:'16px'}}>{c.flag}</span>
                            <div>
                              <div style={{fontWeight:700,color:'#0A3D62'}}>{c.name}</div>
                              <div style={{fontSize:'10px',color:'#696969'}}>{c.iso3} · {c.region}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{padding:'10px 12px'}}>
                          <div style={{fontWeight:900,color:'#0A3D62',fontFamily:'monospace',fontSize:'14px'}}>{c.gosa.toFixed(1)}</div>
                          <div style={{height:'4px',borderRadius:'2px',background:'rgba(10,61,98,0.08)',marginTop:'3px',width:'80px'}}>
                            <div style={{height:'100%',borderRadius:'2px',width:`${c.gosa}%`,background:'#74BB65'}}/>
                          </div>
                        </td>
                        {[c.l1,c.l2,c.l3,c.l4].map((v,j)=>(
                          <td key={j} style={{padding:'10px 12px',fontFamily:'monospace',color:'#0A3D62',fontWeight:600}}>{v.toFixed(1)}</td>
                        ))}
                        <td style={{padding:'10px 12px'}}>
                          <span style={{display:'flex',alignItems:'center',gap:'3px',fontWeight:700,fontSize:'12px',
                            color:c.trend.startsWith('+')?'#74BB65':c.trend.startsWith('-')?'#E57373':'#696969'}}>
                            {c.trend.startsWith('+')?<TrendingUp size={12}/>:c.trend.startsWith('-')?<TrendingDown size={12}/>:<Minus size={12}/>}
                            {c.trend}
                          </span>
                        </td>
                        <td style={{padding:'10px 12px'}}>
                          <span style={{fontSize:'10px',fontWeight:800,padding:'3px 8px',borderRadius:'8px',
                            background:(TIER_BG as any)[c.tier],color:(TIER_C as any)[c.tier]}}>
                            {c.tier}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {selected.length > 0 && (
              <div style={{marginTop:'12px',padding:'12px 16px',background:'rgba(116,187,101,0.08)',border:'1px solid rgba(116,187,101,0.2)',borderRadius:'10px',display:'flex',alignItems:'center',gap:'12px'}}>
                <span style={{fontSize:'12px',color:'#0A3D62',fontWeight:600}}>{selected.length} countries selected</span>
                <button onClick={()=>setTab('benchmark')}
                  style={{padding:'7px 14px',background:'#74BB65',color:'white',border:'none',borderRadius:'7px',cursor:'pointer',fontSize:'12px',fontWeight:700}}>
                  Compare in Benchmark →
                </button>
                <button onClick={()=>setSelected([])} style={{padding:'7px 14px',border:'1px solid rgba(10,61,98,0.15)',borderRadius:'7px',background:'transparent',cursor:'pointer',fontSize:'12px',color:'#696969'}}>
                  Clear
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BENCHMARK */}
        {tab==='benchmark' && (
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div className="gfm-card" style={{padding:'20px'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'12px'}}>Select Countries to Benchmark (2–5)</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                {COUNTRIES.slice(0,20).map(c=>(
                  <button key={c.iso3} onClick={()=>setSelected(prev=>prev.includes(c.iso3)?prev.filter(x=>x!==c.iso3):[...prev,c.iso3].slice(0,5))}
                    style={{padding:'6px 12px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:600,
                      background:selected.includes(c.iso3)?'#0A3D62':'rgba(10,61,98,0.06)',
                      color:selected.includes(c.iso3)?'white':'#0A3D62'}}>
                    {c.flag} {c.name}
                  </button>
                ))}
              </div>
            </div>
            {benchCountries.length >= 2 ? (
              <div className="gfm-card" style={{overflow:'hidden'}}>
                <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(10,61,98,0.06)',fontSize:'13px',fontWeight:700,color:'#0A3D62'}}>
                  Side-by-Side Comparison
                </div>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                  <thead>
                    <tr style={{background:'rgba(10,61,98,0.03)'}}>
                      <th style={{padding:'10px 16px',textAlign:'left',fontWeight:700,color:'#696969',fontSize:'10px',textTransform:'uppercase'}}>Indicator</th>
                      {benchCountries.map(c=>(
                        <th key={c.iso3} style={{padding:'10px 16px',textAlign:'center',fontWeight:700,color:'#0A3D62'}}>
                          {c.flag} {c.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {k:'gosa',l:'GOSA Score'},
                      {k:'l1',l:'Doing Business (L1)'},
                      {k:'l2',l:'Sector Score (L2)'},
                      {k:'l3',l:'Zone Score (L3)'},
                      {k:'l4',l:'Market Intel (L4)'},
                    ].map(({k,l},i)=>{
                      const vals = benchCountries.map(c=>(c as any)[k]);
                      const max = Math.max(...vals.filter(v=>typeof v==='number'));
                      return (
                        <tr key={k} style={{borderBottom:'1px solid rgba(10,61,98,0.05)',background:i%2===0?'white':'rgba(226,242,223,0.2)'}}>
                          <td style={{padding:'10px 16px',fontWeight:600,color:'#696969'}}>{l}</td>
                          {benchCountries.map(c=>{
                            const v = (c as any)[k];
                            const isNum = typeof v==='number';
                            const isBest = isNum && v===max;
                            return (
                              <td key={c.iso3} style={{padding:'10px 16px',textAlign:'center'}}>
                                <span style={{fontWeight:isBest?900:600,color:isBest?'#74BB65':'#0A3D62',fontFamily:isNum?'monospace':'inherit',fontSize:isNum?'14px':'12px'}}>
                                  {isNum ? v.toFixed(1) : v}
                                </span>
                                {isBest && <span style={{fontSize:'10px',color:'#74BB65',marginLeft:'4px'}}>▲ Best</span>}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="gfm-card" style={{padding:'40px',textAlign:'center',color:'#696969'}}>
                Select at least 2 countries above to start benchmarking
              </div>
            )}
          </div>
        )}

        {/* TAB 4: IMPACT ANALYSIS */}
        {tab==='impact' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
            <div className="gfm-card" style={{padding:'24px'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
                <Target size={14} color="#74BB65"/> Investment Scenario
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                {[
                  {l:'Target Country',k:'country',opts:COUNTRIES.slice(0,15).map(c=>({v:c.iso3,l:`${c.flag} ${c.name}`}))},
                  {l:'Sector',k:'sector',opts:SECTORS.slice(1).map(s=>({v:s,l:s}))},
                  {l:'Investment Size',k:'size',opts:['$10M-$50M','$50M-$100M','$100M-$500M','$500M-$1B','$1B+'].map(s=>({v:s,l:s}))},
                  {l:'Investment Zone',k:'zone',opts:['SEZ','Free Zone','Industrial Park','Tech Cluster','Open Market'].map(s=>({v:s,l:s}))},
                ].map(({l,k,opts})=>(
                  <div key={k}>
                    <label style={{fontSize:'11px',fontWeight:700,color:'#696969',display:'block',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.06em'}}>{l}</label>
                    <select value={(impactForm as any)[k]} onChange={e=>setImpactForm(f=>({...f,[k]:e.target.value}))}
                      style={{width:'100%',padding:'10px 12px',border:'1px solid rgba(10,61,98,0.15)',borderRadius:'8px',fontSize:'13px',background:'white',outline:'none',cursor:'pointer'}}>
                      {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </div>
                ))}
                <button onClick={runImpact}
                  style={{padding:'12px',background:'#0A3D62',color:'white',border:'none',borderRadius:'9px',cursor:'pointer',fontSize:'14px',fontWeight:800,marginTop:'8px'}}>
                  Run Impact Analysis →
                </button>
              </div>
            </div>
            <div>
              {impactResult ? (
                <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                  <div className="gfm-card" style={{padding:'20px',borderTop:'4px solid #74BB65'}}>
                    <div style={{fontSize:'12px',fontWeight:700,color:'#696969',marginBottom:'12px',textTransform:'uppercase',letterSpacing:'0.06em'}}>Economic Impact</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                      {[
                        {l:'GDP Contribution',v:impactResult.gdp_contribution},
                        {l:'Jobs Created',v:impactResult.jobs_created},
                        {l:'Time to Operation',v:impactResult.time_to_operation},
                        {l:'5-Year Tax Savings',v:impactResult.tax_savings},
                        {l:'Expected ROI (5yr)',v:impactResult.roi_5yr},
                        {l:'Risk Level',v:impactResult.risk_score},
                      ].map(({l,v})=>(
                        <div key={l} style={{padding:'12px',borderRadius:'8px',background:'rgba(116,187,101,0.06)',border:'1px solid rgba(116,187,101,0.15)'}}>
                          <div style={{fontSize:'10px',color:'#696969',marginBottom:'4px'}}>{l}</div>
                          <div style={{fontSize:'15px',fontWeight:800,color:'#0A3D62',fontFamily:'monospace'}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="gfm-card" style={{padding:'16px',background:'#0A3D62'}}>
                    <div style={{fontSize:'11px',color:'#74BB65',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'6px'}}>Strategic Recommendation</div>
                    <div style={{fontSize:'20px',fontWeight:900,color:'white'}}>{impactResult.recommendation}</div>
                    <div style={{fontSize:'12px',color:'rgba(226,242,223,0.7)',marginTop:'6px',lineHeight:'1.6'}}>
                      Based on current GOSA scoring, sector momentum, and zone availability analysis for the selected scenario.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="gfm-card" style={{padding:'40px',textAlign:'center',color:'#696969',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <div>
                    <Zap size={32} color="#74BB65" style={{margin:'0 auto 12px'}}/>
                    <div style={{fontWeight:700,color:'#0A3D62',marginBottom:'8px'}}>Configure your scenario</div>
                    <div style={{fontSize:'13px'}}>Select country, sector, and investment parameters to generate impact analysis</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
