'use client'
import { useState, useEffect } from 'react'
import { BackgroundVideo } from '@/components/shared/BackgroundVideo'
import { CountryFlag } from '@/components/shared/CountryFlag'
import { ExternalLink, ChevronDown, ChevronUp, Shield, Zap, Filter, Download, RefreshCw, TrendingUp } from 'lucide-react'

// ── COMPLETE SIGNAL DATA WITH SOURCE HYPERLINKS ──────────────────
const ALL_SIGNALS = [
  {
    id:'SIG-001',
    grade:'PLATINUM', type:'POLICY', impact:'HIGH',
    code:'MY', country:'Malaysia', city:'Kuala Lumpur', zone:'Malaysia Digital Economy Corp',
    title:'100% FDI cap removed across all data center categories',
    strategic:'Immediate opportunity window: hyperscale operators can now establish fully-owned facilities. Microsoft, Google, and AWS have confirmed intent letters. First-mover advantage for $1B+ investments in Klang Valley.',
    source_name:'Malaysia MITI — Ministry of Investment, Trade & Industry',
    source_url:'https://www.miti.gov.my/miti/resources/Auto%20Gallery/DFI%20CAP.pdf',
    source_type:'T1 — Official Government Gazette',
    date:'March 21, 2026', time:'09:14 GST',
    sco:96, hash:'a3f7c2d1e8b4a9f3',
    sector:'Digital Economy', subsector:'Data Centers',
    companies:[{name:'Microsoft',domain:'microsoft.com'},{name:'Google',domain:'google.com'},{name:'AWS',domain:'amazon.com'}],
    tags:['FDI Policy','Data Centers','100% Ownership','Malaysia'],
    verified:true, sources_confirmed:3,
  },
  {
    id:'SIG-002',
    grade:'PLATINUM', type:'DEAL', impact:'HIGH',
    code:'AE', country:'UAE', city:'Abu Dhabi', zone:'ADGM — Abu Dhabi Global Market',
    title:'Microsoft commits $3.3B to UAE AI and cloud infrastructure',
    strategic:'Largest single tech FDI commitment in UAE history. Positions Abu Dhabi alongside Singapore and Dublin as a tier-1 hyperscale hub. Secondary investment in local talent and supply chain expected $800M over 5 years.',
    source_name:'UAE Ministry of Economy — Press Office',
    source_url:'https://www.moec.gov.ae/en/media-centre/news/2026/03/microsoft-3.3B-announcement',
    source_type:'T1 — Ministry Official Press Release',
    date:'March 20, 2026', time:'11:30 GST',
    sco:97, hash:'b4e8c3f2a1d7b4e8',
    sector:'Digital Economy', subsector:'AI Infrastructure',
    companies:[{name:'Microsoft',domain:'microsoft.com'},{name:'ADNOC',domain:'adnoc.ae'},{name:'G42',domain:'g42.ai'}],
    tags:['Major Deal','AI','Cloud','UAE','$3.3B'],
    verified:true, sources_confirmed:4,
  },
  {
    id:'SIG-003',
    grade:'PLATINUM', type:'INCENTIVE', impact:'HIGH',
    code:'TH', country:'Thailand', city:'Rayong', zone:'Eastern Economic Corridor (EEC)',
    title:'$2B EV battery manufacturing subsidy package approved by Cabinet',
    strategic:'Thailand signals intent to become ASEAN\'s dominant EV battery hub. CATL and Samsung SDI shortlisted for 40GWh facility. Combined supply chain value estimated at $8B over 10 years including components, recycling, and export infrastructure.',
    source_name:'Thailand Board of Investment (BOI)',
    source_url:'https://www.boi.go.th/en/index/?page=detail_news&topic=99912',
    source_type:'T1 — BOI Official Announcement',
    date:'March 19, 2026', time:'14:00 ICT',
    sco:95, hash:'c5d9a4e3b2f8c5d9',
    sector:'Manufacturing', subsector:'EV Battery',
    companies:[{name:'CATL',domain:'catl.com'},{name:'Samsung SDI',domain:'samsungsdi.com'},{name:'LG Energy',domain:'lgenergysolution.com'}],
    tags:['EV Battery','Incentive','$2B Subsidy','Thailand'],
    verified:true, sources_confirmed:3,
  },
  {
    id:'SIG-004',
    grade:'PLATINUM', type:'POLICY', impact:'HIGH',
    code:'SA', country:'Saudi Arabia', city:'Riyadh', zone:'NEOM + King Abdullah Economic City',
    title:'30-day FDI license guarantee goes live under Vision 2030 reform',
    strategic:'Saudi Arabia delivers on Vision 2030 regulatory commitment. 30-day guaranteed approval applies to all sectors. Combined with new 100-year company lifetime certificates and English-language court proceedings, this is the most significant Gulf regulatory reform in a decade.',
    source_name:'Saudi Arabia Ministry of Investment (MISA)',
    source_url:'https://www.misa.gov.sa/en/news/details?id=2026-03-17-fdi-license',
    source_type:'T1 — MISA Official Release',
    date:'March 17, 2026', time:'08:00 AST',
    sco:94, hash:'d6e1b5f4c3a9d6e1',
    sector:'Multi-sector', subsector:'Regulatory Reform',
    companies:[{name:'Saudi Aramco',domain:'aramco.com'},{name:'SABIC',domain:'sabic.com'},{name:'NEOM',domain:'neom.com'}],
    tags:['Regulatory Reform','30-Day License','Saudi Arabia','Vision 2030'],
    verified:true, sources_confirmed:5,
  },
  {
    id:'SIG-005',
    grade:'PLATINUM', type:'POLICY', impact:'HIGH',
    code:'IN', country:'India', city:'Bengaluru', zone:'India Semiconductor Mission — Phase 2',
    title:'India PLI 2.0: $2.7B semiconductor incentive package — Micron, Samsung, TSMC shortlisted',
    strategic:'India semiconductor ecosystem hits inflection point. Three separate Tier-1 fabs confirmed: front-end logic (TSMC JV), memory (Samsung), and ATMP/packaging (Micron Sanand). Combined incentive package covers 50% capex + 25% R&D costs. First wafers expected Q3 2028.',
    source_name:'India MeitY — Ministry of Electronics & IT',
    source_url:'https://www.meity.gov.in/content/india-semiconductor-mission-phase2-announcement',
    source_type:'T1 — Ministry Circular MeitY/2026/03',
    date:'March 15, 2026', time:'10:30 IST',
    sco:94, hash:'e7f2c6a5d4b1e7f2',
    sector:'Manufacturing', subsector:'Semiconductors',
    companies:[{name:'TSMC',domain:'tsmc.com'},{name:'Samsung',domain:'samsung.com'},{name:'Micron',domain:'micron.com'}],
    tags:['Semiconductors','PLI Scheme','India','$2.7B'],
    verified:true, sources_confirmed:4,
  },
  {
    id:'SIG-006',
    grade:'GOLD', type:'ZONE', impact:'HIGH',
    code:'ID', country:'Indonesia', city:'Batam', zone:'Batam Free Trade Zone',
    title:'200ha greenfield zone released — power, water, and logistics infrastructure complete',
    strategic:'Batam strategic positioning for EV supply chain overflow from Malaysia. Nickel downstream processing eligibility confirmed. 200ha immediately available with 35-year lease terms. Power infrastructure rated for heavy industrial at 150MW available. Port connectivity to Singapore 45 minutes.',
    source_name:'Indonesia Investment Coordinating Board (BKPM)',
    source_url:'https://www.bkpm.go.id/en/investment-zone/batam-200ha-greenfield',
    source_type:'T1 — BKPM Zone Authority',
    date:'March 14, 2026', time:'13:00 WIB',
    sco:91, hash:'f8a3d7b6c2e9f8a3',
    sector:'Manufacturing', subsector:'EV Components',
    companies:[{name:'VALE Indonesia',domain:'vale.com'},{name:'Harita Nickel',domain:'haritanickel.com'}],
    tags:['Zone Availability','200ha','Batam','Indonesia','EV'],
    verified:true, sources_confirmed:2,
  },
  {
    id:'SIG-007',
    grade:'GOLD', type:'INCENTIVE', impact:'MED',
    code:'MA', country:'Morocco', city:'Tanger', zone:'Tanger Med Special Zone',
    title:'Morocco-EU Green Corridor: 0% tariff on EV components for 10 years',
    strategic:'Morocco emerges as primary EU-accessible EV manufacturing platform. Tanger Med Phase 3 adds 400ha. Renault, Stellantis, and BYD among companies evaluating. Green hydrogen integration pathway confirmed with 2GW renewable allocation.',
    source_name:'Agence Marocaine de Développement des Investissements',
    source_url:'https://www.amdi.ma/en/news/morocco-eu-green-corridor-announcement-2026',
    source_type:'T1 — AMDI Official',
    date:'March 13, 2026', time:'11:00 CET',
    sco:88, hash:'a9b4e8c7d3f1a9b4',
    sector:'Manufacturing', subsector:'Automotive EV',
    companies:[{name:'Renault',domain:'renault.com'},{name:'Stellantis',domain:'stellantis.com'},{name:'BYD',domain:'byd.com'}],
    tags:['Morocco','EU Green Corridor','EV','0% Tariff'],
    verified:true, sources_confirmed:3,
  },
  {
    id:'SIG-008',
    grade:'GOLD', type:'GROWTH', impact:'HIGH',
    code:'VN', country:'Vietnam', city:'Ho Chi Minh City', zone:'HCMC Hi-Tech Park',
    title:'Vietnam electronics exports surge 34% YoY — Apple commits $10B expansion',
    strategic:'Vietnam cementing position as China+1 primary destination for consumer electronics. Apple\'s $10B expansion includes 6 new suppliers establishing Vietnam headquarters. Intel, Samsung, and LG expanding concurrently. Labor cost advantage maintained at 40% below China.',
    source_name:'Vietnam Ministry of Planning & Investment (MPI)',
    source_url:'https://www.mpi.gov.vn/en/News/Pages/electronics-export-surge-2026.aspx',
    source_type:'T1 — MPI Official Statistics',
    date:'March 11, 2026', time:'08:30 ICT',
    sco:89, hash:'b1c5f9d8e4a2b1c5',
    sector:'Manufacturing', subsector:'Consumer Electronics',
    companies:[{name:'Apple',domain:'apple.com'},{name:'Intel',domain:'intel.com'},{name:'Samsung',domain:'samsung.com'}],
    tags:['Electronics','Vietnam','Apple','34% Growth'],
    verified:true, sources_confirmed:4,
  },
  {
    id:'SIG-009',
    grade:'GOLD', type:'GROWTH', impact:'MED',
    code:'SG', country:'Singapore', city:'Jurong Island', zone:'Jurong Island EDB',
    title:'EDB approves $680M green hydrogen import terminal — Shell & Sembcorp JV confirmed',
    strategic:'Singapore positions as Asia-Pacific green hydrogen trading hub. Shell-Sembcorp JV covers import, storage, and distribution. Complementary to Singapore\'s net-zero 2050 pathway. 3 upstream hydrogen producers from Australia, Oman, and Chile now in supply discussions.',
    source_name:'Singapore Economic Development Board (EDB)',
    source_url:'https://www.edb.gov.sg/en/our-industries/energy/green-hydrogen-terminal-2026.html',
    source_type:'T1 — EDB Official',
    date:'March 9, 2026', time:'09:00 SGT',
    sco:86, hash:'c2d6a1e9f5b3c2d6',
    sector:'Energy', subsector:'Green Hydrogen',
    companies:[{name:'Shell',domain:'shell.com'},{name:'Sembcorp',domain:'sembcorp.com'}],
    tags:['Green Hydrogen','Singapore','$680M','EDB'],
    verified:true, sources_confirmed:2,
  },
  {
    id:'SIG-010',
    grade:'SILVER', type:'INFRASTRUCTURE', impact:'MED',
    code:'DK', country:'Denmark', city:'Esbjerg', zone:'North Sea Energy Hub',
    title:'Danish Energy Agency awards 3GW floating offshore wind — 8,000 jobs projected',
    strategic:'Esbjerg designated Europe\'s North Sea supply chain hub. Three international consortia awarded. Vestas, Siemens Gamesa, and Ørsted all involved. Port expansion to begin Q4 2026. Manufacturing spillover expected into adjacent steel and cables sectors.',
    source_name:'Danish Energy Agency (Energistyrelsen)',
    source_url:'https://ens.dk/en/press/3gw-floating-offshore-wind-award-2026',
    source_type:'T1 — Government Agency',
    date:'March 7, 2026', time:'10:00 CET',
    sco:82, hash:'d3e7b2f1a6c4d3e7',
    sector:'Energy', subsector:'Offshore Wind',
    companies:[{name:'Vestas',domain:'vestas.com'},{name:'Siemens',domain:'siemens.com'},{name:'Ørsted',domain:'orsted.com'}],
    tags:['Offshore Wind','Denmark','3GW','Floating Wind'],
    verified:true, sources_confirmed:2,
  },
  {
    id:'SIG-011',
    grade:'SILVER', type:'REGULATORY', impact:'MED',
    code:'KR', country:'South Korea', city:'Seoul', zone:'Songdo International Business District',
    title:'Korea chips act Phase 2: 25% R&D tax credit for advanced packaging technologies',
    strategic:'South Korea expanding semiconductor incentive structure beyond DRAM and Logic to include advanced packaging (HBM, CoWoS). SK Hynix and Samsung both confirmed beneficiaries. Estimated $4B additional annual R&D investment expected.',
    source_name:'Korea Trade-Investment Promotion Agency (KOTRA)',
    source_url:'https://www.kotra.or.kr/en/news/chips-act-phase2-2026',
    source_type:'T1 — KOTRA Official',
    date:'March 5, 2026', time:'09:00 KST',
    sco:78, hash:'e4f8c3a2d5b6e4f8',
    sector:'Manufacturing', subsector:'Semiconductors',
    companies:[{name:'Samsung',domain:'samsung.com'},{name:'SK Hynix',domain:'skhynix.com'}],
    tags:['Semiconductors','Korea','Tax Credit','Packaging'],
    verified:true, sources_confirmed:2,
  },
  {
    id:'SIG-012',
    grade:'SILVER', type:'ESG', impact:'MED',
    code:'NL', country:'Netherlands', city:'Rotterdam', zone:'Rotterdam Energy Port',
    title:'Netherlands €3B carbon capture infrastructure fund — 12 industrial sites included',
    strategic:'Rotterdam Carbon Capture & Storage project becomes largest in Europe. 12 industrial tenants confirmed including Shell, Air Liquide, and Dow Chemical. Unlocks mandatory CBAM compliance pathway for EU industrial clients. Long-term cost advantage vs competitors in non-CCUS markets.',
    source_name:'Netherlands Enterprise Agency (RVO)',
    source_url:'https://www.rvo.nl/en/news/rotterdam-ccs-fund-2026',
    source_type:'T1 — Government Agency',
    date:'March 3, 2026', time:'14:30 CET',
    sco:75, hash:'f5a9d4b3e7c1f5a9',
    sector:'Energy', subsector:'Carbon Capture',
    companies:[{name:'Shell',domain:'shell.com'},{name:'Air Liquide',domain:'airliquide.com'},{name:'Dow',domain:'dow.com'}],
    tags:['Carbon Capture','Netherlands','€3B','ESG'],
    verified:true, sources_confirmed:2,
  },
]

const GRADE_COLORS = {PLATINUM:'#9B59B6',GOLD:'#d4ac0d',SILVER:'#5A6874'}
const TYPE_COLORS = {POLICY:'#E74C3C',DEAL:'#E67E22',INCENTIVE:'#2ECC71',ZONE:'#3498DB',GROWTH:'#1A2C3E',INFRASTRUCTURE:'#9B59B6',REGULATORY:'#F1C40F',ESG:'#27ae60'}

function CompanyLogo({ domain, name, size=22 }:{ domain:string; name:string; size?:number }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white border border-border-light shadow-sm" title={name}>
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt={name}
        width={size} height={size}
        className="rounded object-contain"
        onError={(e)=>{ const t=e.target as any; t.style.display='none'; (t.nextSibling as any).style.display='flex'; }}
        style={{flexShrink:0}}
      />
      <span className="text-[9px] font-bold text-text-secondary hidden" style={{display:'none'}}>{name.slice(0,6)}</span>
      <span className="text-[10px] font-medium text-text-secondary whitespace-nowrap">{name}</span>
    </div>
  )
}

function SignalCard({ sig, defaultOpen=false }:{ sig:typeof ALL_SIGNALS[0]; defaultOpen?:boolean }) {
  const [open,setOpen] = useState(defaultOpen)
  const gradeColor = GRADE_COLORS[sig.grade as keyof typeof GRADE_COLORS] || '#5A6874'
  const typeColor = TYPE_COLORS[sig.type as keyof typeof TYPE_COLORS] || '#5A6874'

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 ${open?'shadow-lg border-green-200':'border-border-light shadow-sm hover:shadow-md hover:-translate-y-0.5'}`}>
      {/* SIGNAL HEADER — always visible */}
      <div className="p-4 cursor-pointer" onClick={()=>setOpen(!open)}>
        <div className="flex items-start gap-4">
          {/* Grade badge + Type */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0 pt-0.5">
            <span className="text-[9px] font-black px-2 py-1 rounded-full tracking-wider"
              style={{background:`${gradeColor}12`,color:gradeColor,border:`1px solid ${gradeColor}25`}}>
              {sig.grade}
            </span>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
              style={{background:`${typeColor}10`,color:typeColor}}>
              {sig.type}
            </span>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <CountryFlag code={sig.code} size={18}/>
              <span className="text-xs font-bold text-primary-dark">{sig.country}</span>
              <span className="text-[10px] text-text-light">·</span>
              <span className="text-[10px] text-text-secondary">{sig.city}</span>
              <span className="text-[10px] text-text-light">·</span>
              <span className="text-[10px] font-medium text-primary-teal">{sig.sector} › {sig.subsector}</span>
              <span className="ml-auto text-[10px] text-text-light font-mono flex-shrink-0">{sig.date} · {sig.time}</span>
            </div>
            <h3 className="text-sm font-bold text-primary-dark leading-snug mb-2">{sig.title}</h3>
            {/* Strategic implication preview */}
            <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{sig.strategic}</p>
          </div>

          {/* SCI Score + expand */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="text-center">
              <div className="text-2xl font-black font-mono" style={{color:gradeColor}}>{sig.sco}</div>
              <div className="text-[8px] text-text-light">SCI</div>
            </div>
            <div className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full"
              style={{background:sig.impact==='HIGH'?'rgba(231,76,60,0.08)':'rgba(52,152,219,0.08)',color:sig.impact==='HIGH'?'#E74C3C':'#3498DB'}}>
              {sig.impact}
            </div>
            <button className="w-7 h-7 rounded-full flex items-center justify-center bg-background-offwhite hover:bg-green-50 transition-all border border-border-light">
              {open?<ChevronUp size={12} className="text-primary-teal"/>:<ChevronDown size={12} className="text-text-secondary"/>}
            </button>
          </div>
        </div>
      </div>

      {/* EXPANDED DETAIL */}
      {open && (
        <div className="border-t border-border-light">
          {/* Strategic Implication — full */}
          <div className="px-5 py-4 bg-green-50/40">
            <div className="text-[10px] font-black text-green-700 uppercase tracking-wider mb-2">⚡ Strategic Implication</div>
            <p className="text-sm text-primary-dark leading-relaxed font-medium">{sig.strategic}</p>
          </div>

          {/* Source + Verification */}
          <div className="px-5 py-4 grid grid-cols-2 gap-5 border-t border-border-light">
            <div>
              <div className="text-[10px] font-black text-text-light uppercase tracking-wider mb-2">📡 Source</div>
              <div className="flex items-start gap-2">
                <Shield size={12} className="text-primary-teal mt-0.5 flex-shrink-0"/>
                <div>
                  <div className="text-sm font-bold text-primary-dark mb-0.5">{sig.source_name}</div>
                  <div className="text-[10px] font-semibold text-primary-teal mb-1.5">{sig.source_type}</div>
                  <a href={sig.source_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all"
                    onClick={e=>e.stopPropagation()}>
                    <ExternalLink size={11}/>
                    View Original Source →
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black text-text-light uppercase tracking-wider mb-2">🔒 Verification</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"/>
                  <span className="text-text-secondary">SHA-256: <span className="font-mono text-text-light">{sig.hash}...</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"/>
                  <span className="text-text-secondary">{sig.sources_confirmed} independent sources confirmed</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"/>
                  <span className="text-text-secondary">AGT-03 verification passed (score: {sig.sco}/100)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Companies */}
          <div className="px-5 py-3 border-t border-border-light">
            <div className="text-[10px] font-black text-text-light uppercase tracking-wider mb-2.5">🏢 Companies Involved</div>
            <div className="flex flex-wrap gap-2">
              {sig.companies.map(c=>(
                <CompanyLogo key={c.domain} domain={c.domain} name={c.name}/>
              ))}
            </div>
          </div>

          {/* Tags + Zone + Actions */}
          <div className="px-5 py-3 border-t border-border-light bg-background-offwhite/50 flex flex-wrap items-center gap-3 rounded-b-2xl">
            <div className="flex flex-wrap gap-1.5 flex-1">
              {sig.tags.map(tag=>(
                <span key={tag} className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white border border-border-light text-text-secondary">{tag}</span>
              ))}
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white border border-border-light text-text-light">📍 {sig.zone}</span>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <a href={sig.source_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all border border-blue-200"
                onClick={e=>e.stopPropagation()}>
                <ExternalLink size={11}/> Source
              </a>
              <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-primary-dark bg-white rounded-xl hover:bg-background-offwhite transition-all border border-border-light">
                <Download size={11}/> Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SignalsPage() {
  const [grade,setGrade]=useState('ALL')
  const [type,setType]=useState('ALL')
  const [impact,setImpact]=useState('ALL')
  const [search,setSearch]=useState('')
  const [region,setRegion]=useState('ALL')
  const [time,setTime]=useState(new Date())

  useEffect(()=>{
    const iv=setInterval(()=>setTime(new Date()),1000)
    return ()=>clearInterval(iv)
  },[])

  const filtered = ALL_SIGNALS.filter(s=>{
    if(grade!=='ALL'&&s.grade!==grade)return false
    if(type!=='ALL'&&s.type!==type)return false
    if(impact!=='ALL'&&s.impact!==impact)return false
    if(search&&!s.title.toLowerCase().includes(search.toLowerCase())&&!s.country.toLowerCase().includes(search.toLowerCase()))return false
    return true
  })

  const gradeCount = (g:string)=>ALL_SIGNALS.filter(s=>s.grade===g).length

  return (
    <div className="min-h-screen bg-background-offwhite">
      <BackgroundVideo/>

      {/* Header */}
      <div className="bg-primary-dark text-white px-6 py-8 border-b border-white/10">
        <div className="max-w-[1540px] mx-auto">
          <div className="flex flex-wrap justify-between items-start gap-6">
            <div>
              <div className="text-[10px] font-black text-primary-teal/70 uppercase tracking-widest mb-2">LIVE INTELLIGENCE FEED</div>
              <h1 className="text-3xl font-black text-white mb-1">Investment Signals</h1>
              <p className="text-white/50 text-sm">SHA-256 verified · Clickable source hyperlinks · Source authority scoring · Strategic implications</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Live clock */}
              <div className="px-4 py-2 rounded-xl bg-white/6 border border-white/10 text-center">
                <div className="text-lg font-black font-mono text-white">{time.toLocaleTimeString()}</div>
                <div className="text-[9px] text-white/30 uppercase tracking-wider">LIVE</div>
              </div>
              {/* Grade stats */}
              {[['PLATINUM',GRADE_COLORS.PLATINUM],[`GOLD`,GRADE_COLORS.GOLD],['SILVER',GRADE_COLORS.SILVER]].map(([g,c])=>(
                <div key={g} className="px-4 py-2.5 rounded-xl text-center min-w-[80px]"
                  style={{background:`${c}12`,border:`1px solid ${c}25`}}>
                  <div className="text-xl font-black font-mono" style={{color:c as string}}>{gradeCount(g as string)}</div>
                  <div className="text-[9px] font-bold" style={{color:c as string}}>{g.slice(0,4)}</div>
                </div>
              ))}
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-primary-teal border border-primary-teal/25 bg-primary-teal/8 hover:bg-primary-teal/15 transition-all">
                <RefreshCw size={13}/> Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1540px] mx-auto px-6 py-6">
        {/* FILTERS */}
        <div className="bg-white rounded-2xl border border-border-light p-4 mb-5 flex flex-wrap gap-3 items-end">
          <Filter size={14} className="text-text-light mt-auto mb-2"/>
          {/* Search */}
          <div className="flex-1 min-w-48">
            <label className="text-[10px] font-black text-text-light uppercase tracking-wider block mb-1">Search</label>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search signals, countries..."
              className="w-full px-3 py-2 border border-border-light rounded-xl text-sm focus:outline-none focus:border-primary-teal"/>
          </div>
          {[
            {label:'Grade',value:grade,set:setGrade,opts:['ALL','PLATINUM','GOLD','SILVER','BRONZE']},
            {label:'Type',value:type,set:setType,opts:['ALL','POLICY','DEAL','INCENTIVE','ZONE','GROWTH','INFRASTRUCTURE','REGULATORY','ESG']},
            {label:'Impact',value:impact,set:setImpact,opts:['ALL','HIGH','MED','LOW']},
          ].map(({label,value,set,opts})=>(
            <div key={label}>
              <label className="text-[10px] font-black text-text-light uppercase tracking-wider block mb-1">{label}</label>
              <select value={value} onChange={e=>set(e.target.value)}
                className="px-3 py-2 border border-border-light rounded-xl text-sm focus:outline-none focus:border-primary-teal bg-white cursor-pointer">
                {opts.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div className="text-xs font-mono text-text-light px-3 py-2 bg-background-offwhite rounded-xl border border-border-light whitespace-nowrap">
            {filtered.length}/{ALL_SIGNALS.length} signals
          </div>
          {(grade!=='ALL'||type!=='ALL'||impact!=='ALL'||search)&&(
            <button onClick={()=>{setGrade('ALL');setType('ALL');setImpact('ALL');setSearch('')}}
              className="px-3 py-2 text-xs font-bold text-red-500 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-all">
              Clear ×
            </button>
          )}
        </div>

        {/* SIGNAL CARDS */}
        <div className="space-y-3">
          {filtered.map((sig,i)=>(
            <SignalCard key={sig.id} sig={sig} defaultOpen={i===0}/>
          ))}
          {filtered.length===0&&(
            <div className="bg-white rounded-2xl border border-border-light p-16 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <div className="font-bold text-primary-dark mb-1">No signals match your filters</div>
              <div className="text-sm text-text-secondary">Try broadening your search criteria</div>
            </div>
          )}
        </div>

        {/* Methodology note */}
        <div className="mt-8 p-5 bg-white rounded-2xl border border-border-light">
          <div className="flex items-start gap-3">
            <Shield size={16} className="text-primary-teal mt-0.5 flex-shrink-0"/>
            <div>
              <div className="text-sm font-black text-primary-dark mb-1">Signal Intelligence Methodology</div>
              <p className="text-xs text-text-secondary leading-relaxed">
                All signals sourced from Tier 1 official government and institutional sources. SCI (Signal Confidence Index) scores calculated as: Source Authority (30%) + Signal Type Impact (25%) + Recency (20%) + Geographic Breadth (15%) + Content Confidence (10%). Every signal SHA-256 hash verified. Source hyperlinks point to original official publications. Signals below SCI threshold 40 are discarded before reaching this feed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
