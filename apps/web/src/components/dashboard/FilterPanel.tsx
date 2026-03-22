'use client'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { useState } from 'react'
import { X, ChevronDown, ChevronUp, Search } from 'lucide-react'

const REGIONS = ['All','Western Europe','Central & Southeastern Europe','Eastern Europe & Central Asia','North America','Latin America','North Africa & Middle East','Sub-Saharan Africa','Asia & Pacific']
const COUNTRIES: Record<string,{name:string;code:string}[]> = {
  'All':[],
  'Asia & Pacific':[{name:'Singapore',code:'SG'},{name:'Malaysia',code:'MY'},{name:'Thailand',code:'TH'},{name:'Vietnam',code:'VN'},{name:'Indonesia',code:'ID'},{name:'India',code:'IN'},{name:'Japan',code:'JP'},{name:'South Korea',code:'KR'},{name:'Australia',code:'AU'},{name:'New Zealand',code:'NZ'},{name:'China',code:'CN'},{name:'Philippines',code:'PH'},{name:'Bangladesh',code:'BD'},{name:'Sri Lanka',code:'LK'}],
  'Middle East':[], 'North Africa & Middle East':[{name:'UAE',code:'AE'},{name:'Saudi Arabia',code:'SA'},{name:'Qatar',code:'QA'},{name:'Kuwait',code:'KW'},{name:'Bahrain',code:'BH'},{name:'Oman',code:'OM'},{name:'Egypt',code:'EG'},{name:'Morocco',code:'MA'},{name:'Jordan',code:'JO'},{name:'Israel',code:'IL'}],
  'Western Europe':[{name:'United Kingdom',code:'GB'},{name:'Germany',code:'DE'},{name:'France',code:'FR'},{name:'Netherlands',code:'NL'},{name:'Switzerland',code:'CH'},{name:'Denmark',code:'DK'},{name:'Sweden',code:'SE'},{name:'Norway',code:'NO'},{name:'Finland',code:'FI'},{name:'Belgium',code:'BE'},{name:'Austria',code:'AT'},{name:'Ireland',code:'IE'},{name:'Spain',code:'ES'},{name:'Italy',code:'IT'},{name:'Portugal',code:'PT'}],
  'North America':[{name:'United States',code:'US'},{name:'Canada',code:'CA'},{name:'Mexico',code:'MX'}],
  'Latin America':[{name:'Brazil',code:'BR'},{name:'Argentina',code:'AR'},{name:'Chile',code:'CL'},{name:'Colombia',code:'CO'},{name:'Peru',code:'PE'},{name:'Uruguay',code:'UY'}],
  'Sub-Saharan Africa':[{name:'South Africa',code:'ZA'},{name:'Nigeria',code:'NG'},{name:'Kenya',code:'KE'},{name:'Ghana',code:'GH'},{name:'Rwanda',code:'RW'},{name:'Ethiopia',code:'ET'}],
  'Central & Southeastern Europe':[{name:'Poland',code:'PL'},{name:'Czech Republic',code:'CZ'},{name:'Hungary',code:'HU'},{name:'Romania',code:'RO'},{name:'Bulgaria',code:'BG'},{name:'Croatia',code:'HR'},{name:'Greece',code:'GR'},{name:'Turkey',code:'TR'}],
  'Eastern Europe & Central Asia':[{name:'Kazakhstan',code:'KZ'},{name:'Ukraine',code:'UA'},{name:'Georgia',code:'GE'},{name:'Armenia',code:'AM'},{name:'Azerbaijan',code:'AZ'}],
}
const ALL_COUNTRIES = Object.values(COUNTRIES).flat().filter((c,i,a)=>a.findIndex(x=>x.code===c.code)===i).sort((a,b)=>a.name.localeCompare(b.name))
const CITIES: Record<string,string[]> = { VN:['Ho Chi Minh City','Hanoi','Da Nang','Binh Duong','Hai Phong'], MY:['Kuala Lumpur','Penang','Johor Bahru','Cyberjaya'], AE:['Dubai','Abu Dhabi','Sharjah'], SG:['Singapore City','Jurong','Changi'], TH:['Bangkok','Rayong','Chonburi'], IN:['Mumbai','Bengaluru','Chennai','Hyderabad','Pune'], US:['New York','San Francisco','Austin','Chicago'], SA:['Riyadh','NEOM','Jeddah','KAEC'], DE:['Berlin','Munich','Frankfurt','Hamburg'], GB:['London','Manchester','Edinburgh'], JP:['Tokyo','Osaka','Nagoya'], KR:['Seoul','Busan','Incheon'], }
const SECTORS = ['All','Agriculture, Forestry, Fishing','Mining, Quarrying, Oil & Gas','Utilities','Construction','Manufacturing','Wholesale Trade','Retail Trade','Transportation & Warehousing','Information & Technology','Finance & Insurance','Real Estate','Professional & Business Services','Education & Health Services','Leisure & Hospitality','Emerging Sectors']
const SUB_SECTORS: Record<string,string[]> = { 'Manufacturing':['EV Battery','Semiconductors','Automotive','Aerospace','Medical Devices','Chemicals','Pharmaceuticals','Electronics','Food Processing'], 'Information & Technology':['AI Data Centers','Cloud Computing','Software Development','Cybersecurity','Fintech','IoT','Blockchain'], 'Energy':['Solar PV','Offshore Wind','Green Hydrogen','Battery Storage','Oil & Gas'], 'Mining, Quarrying, Oil & Gas':['Lithium','Nickel','Cobalt','Natural Gas','Petroleum'], }
const DURATIONS = ['Last Month','Last 6 Months','1 Year','2 Years','3 Years','4 Years','5 Years','Custom Range']
const INVESTMENT_TYPES = ['All','Greenfield','M&A','Joint Venture','Expansion','Reinvestment']
const CAPITAL_RANGES = ['All','$1M–$50M','$50M–$250M','$250M–$1B','$1B+']
const JOB_RANGES = ['All','1–100','100–500','500–1,000','1,000–5,000','5,000+']
const OPPORTUNITIES = ['All','Active','Upcoming','Expiring Soon']
const POLICIES = ['All','Active','Proposed','Recent Changes (30 days)']
const INCENTIVES = ['All','Tax Holidays','CIT Reductions','Import Duty Waivers','Land Subsidies','R&D Grants']
const FUTURE_READINESS = ['All','Top Performance (80–100)','Medium Performance (60–79)','Developing Performance (<60)']
const CATEGORIES = ['All','Mainland','Free Zones','Special Economic Zones','Industrial Parks']

type Section = string
function Section({ title, children, defaultOpen=false }: { title:string; children:any; defaultOpen?:boolean }) {
  const [open,setOpen] = useState(defaultOpen)
  return (
    <div style={{borderBottom:'1px solid #F0F2F5',paddingBottom:12,marginBottom:12}}>
      <button onClick={()=>setOpen(!open)} style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',background:'none',border:'none',cursor:'pointer',padding:'4px 0',fontFamily:'Inter,sans-serif'}}>
        <span style={{fontSize:10,fontWeight:800,color:'#5A6874',letterSpacing:'0.1em',textTransform:'uppercase'}}>{title}</span>
        {open?<ChevronUp size={13} color="#5A6874"/>:<ChevronDown size={13} color="#5A6874"/>}
      </button>
      {open && <div style={{marginTop:8}}>{children}</div>}
    </div>
  )
}
function Radio({ label, name, checked, onChange }: any) {
  return (
    <label style={{display:'flex',alignItems:'center',gap:8,padding:'4px 6px',borderRadius:7,cursor:'pointer',transition:'background 0.12s',background:checked?'rgba(46,204,113,0.07)':'transparent'}}
      onMouseEnter={e=>{if(!checked)(e.currentTarget as any).style.background='#F8F9FA'}}
      onMouseLeave={e=>{if(!checked)(e.currentTarget as any).style.background='transparent'}}>
      <div style={{width:14,height:14,borderRadius:'50%',border:`2px solid ${checked?'#2ECC71':'#C8D0D6'}`,background:checked?'#2ECC71':'transparent',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}>
        {checked&&<div style={{width:5,height:5,borderRadius:'50%',background:'white'}}/>}
      </div>
      <span style={{fontSize:12,color:checked?'#1A2C3E':'#5A6874',fontWeight:checked?600:400,fontFamily:'Inter,sans-serif',lineHeight:1.4}}>{label}</span>
    </label>
  )
}

export function FilterPanel() {
  const { filters, activeFilters, setFilter, clearFilters, removeFilter } = useDashboardStore()
  const sf = (k: any, v: string) => setFilter(k, v)
  const availCountries = filters.region === 'All' ? ALL_COUNTRIES : (COUNTRIES[filters.region] || ALL_COUNTRIES)
  const selCountry = availCountries.find(c=>c.name===filters.country||c.code===filters.country)
  const availCities = selCountry ? (CITIES[selCountry.code]||[]) : []
  const availSubs = SUB_SECTORS[filters.sector] || []
  const activeCount = Object.keys(activeFilters).length

  return (
    <div style={{background:'#FFFFFF',borderRadius:20,border:'1px solid #ECF0F1',boxShadow:'0 4px 16px rgba(0,0,0,0.06)',overflow:'hidden',display:'flex',flexDirection:'column',height:'calc(100vh - 140px)',position:'sticky',top:90}}>
      {/* Header */}
      <div style={{padding:'16px 16px 12px',borderBottom:'1px solid #F0F2F5',flexShrink:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <span style={{fontSize:13,fontWeight:800,color:'#1A2C3E',fontFamily:'Inter,sans-serif'}}>Filters</span>
          {activeCount>0&&<button onClick={clearFilters} style={{fontSize:11,fontWeight:600,color:'#E74C3C',background:'rgba(231,76,60,0.08)',border:'none',borderRadius:6,padding:'3px 8px',cursor:'pointer',fontFamily:'Inter,sans-serif'}}>Clear {activeCount}</button>}
        </div>
        <div style={{position:'relative'}}>
          <Search size={13} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'#C8D0D6'}}/>
          <input value={filters.search} onChange={e=>sf('search',e.target.value)} placeholder="Search countries, cities..." style={{width:'100%',padding:'7px 10px 7px 28px',border:'1px solid #ECF0F1',borderRadius:9,fontSize:12,fontFamily:'Inter,sans-serif',color:'#1A2C3E',outline:'none',boxSizing:'border-box'}} onFocus={e=>{e.target.style.border='1px solid #2ECC71'}} onBlur={e=>{e.target.style.border='1px solid #ECF0F1'}}/>
        </div>
        {/* Active filter tags */}
        {activeCount>0&&(
          <div style={{display:'flex',flexWrap:'wrap',gap:4,marginTop:8}}>
            {Object.entries(activeFilters).slice(0,6).map(([k,v])=>(
              <span key={k} style={{display:'flex',alignItems:'center',gap:4,fontSize:10,padding:'2px 7px',background:'rgba(46,204,113,0.1)',color:'#1A2C3E',borderRadius:20,border:'1px solid rgba(46,204,113,0.2)',fontFamily:'Inter,sans-serif'}}>
                {String(v).length>12?String(v).slice(0,12)+'…':v}
                <button onClick={()=>removeFilter(k)} style={{background:'none',border:'none',cursor:'pointer',padding:0,color:'#5A6874',lineHeight:1}}><X size={9}/></button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Scrollable filters */}
      <div style={{overflowY:'auto',flex:1,padding:'12px 16px 16px'}}>
        <Section title="📍 Region" defaultOpen>
          {REGIONS.map(r=><Radio key={r} label={r} name="region" checked={filters.region===r} onChange={()=>sf('region',r)}/>)}
        </Section>
        <Section title="🌍 Country" defaultOpen>
          <select value={filters.country} onChange={e=>sf('country',e.target.value)} style={{width:'100%',padding:'7px 10px',border:'1px solid #ECF0F1',borderRadius:9,fontSize:12,fontFamily:'Inter,sans-serif',color:'#1A2C3E',background:'white',cursor:'pointer',outline:'none'}}>
            <option value="">All Countries</option>
            {availCountries.map(c=><option key={c.code} value={c.name}>{c.name}</option>)}
          </select>
        </Section>
        <Section title="🏙️ City">
          <select value={filters.city} onChange={e=>sf('city',e.target.value)} disabled={!filters.country||availCities.length===0} style={{width:'100%',padding:'7px 10px',border:'1px solid #ECF0F1',borderRadius:9,fontSize:12,fontFamily:'Inter,sans-serif',color:(!filters.country||availCities.length===0)?'#C8D0D6':'#1A2C3E',background:'white',cursor:(!filters.country||availCities.length===0)?'not-allowed':'pointer',outline:'none'}}>
            <option value="">{!filters.country?'Select country first':'All Cities'}</option>
            {availCities.map(c=><option key={c}>{c}</option>)}
          </select>
        </Section>
        <Section title="🏢 Category">
          {CATEGORIES.map(c=><Radio key={c} label={c} name="category" checked={filters.category===c} onChange={()=>sf('category',c)}/>)}
        </Section>
        <Section title="⏱️ Duration" defaultOpen>
          {DURATIONS.map(d=><Radio key={d} label={d} name="duration" checked={filters.duration===d} onChange={()=>sf('duration',d)}/>)}
          {filters.duration==='Custom Range'&&(
            <div style={{display:'flex',gap:6,marginTop:6}}>
              <input type="date" value={filters.customStart} onChange={e=>sf('customStart',e.target.value)} style={{flex:1,padding:'5px 8px',border:'1px solid #ECF0F1',borderRadius:7,fontSize:11,fontFamily:'Inter,sans-serif'}}/>
              <input type="date" value={filters.customEnd} onChange={e=>sf('customEnd',e.target.value)} style={{flex:1,padding:'5px 8px',border:'1px solid #ECF0F1',borderRadius:7,fontSize:11,fontFamily:'Inter,sans-serif'}}/>
            </div>
          )}
        </Section>
        <Section title="💰 Investment Type">
          {INVESTMENT_TYPES.map(t=><Radio key={t} label={t} name="investmentType" checked={filters.investmentType===t} onChange={()=>sf('investmentType',t)}/>)}
        </Section>
        <Section title="🏭 Sector">
          <select value={filters.sector} onChange={e=>{sf('sector',e.target.value);sf('subSector','')}} style={{width:'100%',padding:'7px 10px',border:'1px solid #ECF0F1',borderRadius:9,fontSize:12,fontFamily:'Inter,sans-serif',color:'#1A2C3E',background:'white',cursor:'pointer',outline:'none',marginBottom:6}}>
            {SECTORS.map(s=><option key={s}>{s}</option>)}
          </select>
          {availSubs.length>0&&(
            <>
              <div style={{fontSize:10,fontWeight:700,color:'#5A6874',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:4}}>Sub-Sector</div>
              <select value={filters.subSector} onChange={e=>sf('subSector',e.target.value)} style={{width:'100%',padding:'7px 10px',border:'1px solid #ECF0F1',borderRadius:9,fontSize:12,fontFamily:'Inter,sans-serif',color:'#1A2C3E',background:'white',cursor:'pointer',outline:'none'}}>
                <option value="">All Sub-sectors</option>
                {availSubs.map(s=><option key={s}>{s}</option>)}
              </select>
            </>
          )}
        </Section>
        <Section title="💵 Investment Capital">
          {CAPITAL_RANGES.map(r=><Radio key={r} label={r} name="capital" checked={filters.investmentCapital===r} onChange={()=>sf('investmentCapital',r)}/>)}
        </Section>
        <Section title="👥 Number of Jobs">
          {JOB_RANGES.map(r=><Radio key={r} label={r} name="jobs" checked={filters.jobs===r} onChange={()=>sf('jobs',r)}/>)}
        </Section>
        <Section title="📈 Investment Opportunities">
          {OPPORTUNITIES.map(o=><Radio key={o} label={o} name="opp" checked={filters.opportunities===o} onChange={()=>sf('opportunities',o)}/>)}
        </Section>
        <Section title="⚖️ Investment Policy">
          {POLICIES.map(p=><Radio key={p} label={p} name="policy" checked={filters.policy===p} onChange={()=>sf('policy',p)}/>)}
        </Section>
        <Section title="🎁 Investment Incentives">
          {INCENTIVES.map(i=><Radio key={i} label={i} name="incentives" checked={filters.incentives===i} onChange={()=>sf('incentives',i)}/>)}
        </Section>
        <Section title="🚀 Future Readiness (GFR)">
          {FUTURE_READINESS.map(f=><Radio key={f} label={f} name="fr" checked={filters.futureReadiness===f} onChange={()=>sf('futureReadiness',f)}/>)}
        </Section>
        <button style={{width:'100%',marginTop:8,padding:'11px',background:'#2ECC71',color:'white',border:'none',borderRadius:12,fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Inter,sans-serif',boxShadow:'0 4px 14px rgba(46,204,113,0.3)',transition:'all 0.2s'}}
          onMouseEnter={e=>{(e.currentTarget as any).style.transform='translateY(-1px)';(e.currentTarget as any).style.boxShadow='0 8px 20px rgba(46,204,113,0.4)'}}
          onMouseLeave={e=>{(e.currentTarget as any).style.transform='none';(e.currentTarget as any).style.boxShadow='0 4px 14px rgba(46,204,113,0.3)'}}>
          📄 Export Report (PDF)
        </button>
      </div>
    </div>
  )
}
