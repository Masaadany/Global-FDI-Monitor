'use client'
import { CountryFlag } from '@/components/shared/CountryFlag'
import { X, Download, BarChart3, TrendingUp, TrendingDown, ExternalLink, Shield } from 'lucide-react'

interface Props { entity: any; signals: any[]; onClose: () => void }

const ENTITY_DATA: Record<string, any> = {
  SGP:{ strengths:['Trading Across Borders: 99/100 – #1 globally','EDB incentives: 5–10yr tax exemption','Tech hub – 4,000+ MNCs established','Green energy: 5GW solar target by 2030'], challenges:['Land scarcity limits manufacturing scale','High labor costs relative to ASEAN peers','Tight immigration for blue-collar workers'], fdi:'$91B', evDeals:2, gosaYoY:'+2.1', fdiYoY:'+18%', dealsYoY:'+1', strongestIndicator:'Trading Across Borders', strongestScore:99, weakestIndicator:'Resolving Insolvency', weakestScore:81, comparison:{gosaChange:'+2.1',fdiChange:'+18%',dealsChange:'+1'} },
  MYS:{ strengths:['100% FDI now permitted in data centers','Penang FIZ — 31% land still available','Pioneer Status incentives: 10yr CIT exemption','English common law jurisdiction'], challenges:['Skilled EV battery technician shortage','Construction Permits: 74/100 – 90-day avg','Ringgit volatility risk'], fdi:'$22B', evDeals:4, gosaYoY:'+3.8', fdiYoY:'+42%', dealsYoY:'+3', strongestIndicator:'Trading Across Borders', strongestScore:88, weakestIndicator:'Enforcing Contracts', weakestScore:72, comparison:{gosaChange:'+3.8',fdiChange:'+42%',dealsChange:'+3'} },
  THA:{ strengths:['$2B EV battery subsidy approved March 2026','Eastern Economic Corridor — 58% land available','8-year CIT exemption via BOI','Strong automotive supply chain (Detroit of ASEAN)'], challenges:['Political stability risk (military influence)','Construction Permits: 72/100 – slower than VN','Aging workforce demographics'], fdi:'$14B', evDeals:3, gosaYoY:'+2.4', fdiYoY:'+28%', dealsYoY:'+2', strongestIndicator:'Getting Electricity', strongestScore:90, weakestIndicator:'Starting a Business', weakestScore:78, comparison:{gosaChange:'+2.4',fdiChange:'+28%',dealsChange:'+2'} },
  VNM:{ strengths:['Electronics exports +34% YoY — capturing China share','VSIP Binh Duong: 47% zone land available','50% CIT exemption for EV manufacturing','Low labor cost: 40% below China'], challenges:['Construction Permits: 68/100 – avg 120 days','Enforcing Contracts: 65/100 – legal backlog','EV battery technicians shortage'], fdi:'$24B', evDeals:5, gosaYoY:'+5.3', fdiYoY:'+60%', dealsYoY:'+4', strongestIndicator:'Trading Across Borders', strongestScore:91, weakestIndicator:'Construction Permits', weakestScore:68, comparison:{gosaChange:'+5.3',fdiChange:'+60%',dealsChange:'+4'} },
  ARE:{ strengths:['100% mainland foreign ownership allowed','30-day business setup guarantee','0% corporate tax in free zones','ADNOC $5.2B green hydrogen commitment'], challenges:['High expatriate cost of living','Limited domestic market size','Water scarcity for industrial processes'], fdi:'$23B', evDeals:3, gosaYoY:'+4.2', fdiYoY:'+35%', dealsYoY:'+2', strongestIndicator:'Trading Across Borders', strongestScore:96, weakestIndicator:'Resolving Insolvency', weakestScore:72, comparison:{gosaChange:'+4.2',fdiChange:'+35%',dealsChange:'+2'} },
  SAU:{ strengths:['30-day FDI license now guaranteed','100-year company lifetime certificates','NEOM Phase 2: $1.8B contracts issued','English-language commercial courts live'], challenges:['Cultural adaptation requirements','Construction Permits: 77/100 – improving','Limited private sector depth outside energy'], fdi:'$36B', evDeals:2, gosaYoY:'+6.1', fdiYoY:'+82%', dealsYoY:'+2', strongestIndicator:'Getting Electricity', strongestScore:88, weakestIndicator:'Starting a Business', weakestScore:73, comparison:{gosaChange:'+6.1',fdiChange:'+82%',dealsChange:'+2'} },
  IND:{ strengths:['PLI 2.0: $2.7B semiconductor incentives','3 Tier-1 fabs confirmed (TSMC, Samsung, Micron)','Largest working-age population globally','IT services ecosystem — 5M+ tech workers'], challenges:['Construction Permits: 69/100 – bureaucratic delays','Enforcing Contracts: 63/100 – court backlog','Infrastructure gaps outside major metros'], fdi:'$71B', evDeals:6, gosaYoY:'+4.8', fdiYoY:'+38%', dealsYoY:'+5', strongestIndicator:'Protecting Investors', strongestScore:82, weakestIndicator:'Enforcing Contracts', weakestScore:63, comparison:{gosaChange:'+4.8',fdiChange:'+38%',dealsChange:'+5'} },
}

export function AnalysisPanel({ entity, signals, onClose }: Props) {
  const data = ENTITY_DATA[entity.id] || ENTITY_DATA[entity.code] || ENTITY_DATA.VNM
  const entitySignals = signals.filter((_,i)=>i<3)
  const sc = (v:number) => v>=80?'#2ECC71':v>=60?'#3498DB':'#F1C40F'
  const tierBg = entity.category==='TOP'?'rgba(46,204,113,0.1)':'rgba(52,152,219,0.1)'
  const tierColor = entity.category==='TOP'?'#27ae60':'#2980b9'

  return (
    <div style={{background:'#FFFFFF',borderRadius:20,border:'1px solid #ECF0F1',boxShadow:'0 20px 50px rgba(0,0,0,0.12)',overflow:'hidden',animation:'slideUpFade 0.4s cubic-bezier(0.2,0.9,0.4,1.1) both'}}>
      {/* Header */}
      <div style={{padding:'20px 24px 16px',borderBottom:'1px solid #F8F9FA',display:'flex',alignItems:'flex-start',gap:16,background:'linear-gradient(135deg,#FAFBFC,#FFFFFF)'}}>
        <img src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${entity.code||'SG'}.svg`} width={56} height={38} style={{borderRadius:6,boxShadow:'0 2px 8px rgba(0,0,0,0.12)',flexShrink:0}} onError={e=>{(e.target as any).style.display='none'}} alt=""/>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4,flexWrap:'wrap'}}>
            <h2 style={{fontSize:22,fontWeight:900,color:'#1A2C3E',margin:0,fontFamily:'Inter,sans-serif'}}>{entity.name}</h2>
            <span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:20,background:tierBg,color:tierColor}}>{entity.category} TIER</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:36,fontWeight:900,color:sc(entity.gosa),fontFamily:'JetBrains Mono,monospace',lineHeight:1}}>{entity.gosa}</span>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:entity.trend>0?'#27ae60':'#E74C3C',display:'flex',alignItems:'center',gap:4}}>
                {entity.trend>0?<TrendingUp size={14}/>:<TrendingDown size={14}/>}
                {entity.trend>0?'+':''}{entity.trend} MoM
              </div>
              <div style={{fontSize:10,color:'#C8D0D6',textTransform:'uppercase',letterSpacing:'0.08em'}}>GOSA Score</div>
            </div>
            <div style={{marginLeft:8}}>
              <div style={{fontSize:14,fontWeight:800,color:'#1A2C3E',fontFamily:'JetBrains Mono,monospace'}}>{data.fdi}</div>
              <div style={{fontSize:10,color:'#C8D0D6',textTransform:'uppercase',letterSpacing:'0.08em'}}>FDI Inflow</div>
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{background:'rgba(0,0,0,0.06)',border:'none',cursor:'pointer',borderRadius:8,padding:'6px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'background 0.15s'}}
          onMouseEnter={e=>{(e.currentTarget as any).style.background='rgba(231,76,60,0.1)'}}
          onMouseLeave={e=>{(e.currentTarget as any).style.background='rgba(0,0,0,0.06)'}}>
          <X size={16} color="#5A6874"/>
        </button>
      </div>

      <div style={{padding:'20px 24px',display:'flex',flexDirection:'column',gap:20}}>
        {/* Brief Analysis */}
        <div style={{padding:'14px 16px',background:'#F8F9FA',borderRadius:12,borderLeft:'3px solid #2ECC71'}}>
          <div style={{fontSize:11,fontWeight:800,color:'#2ECC71',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>📋 Brief Analysis</div>
          <p style={{margin:0,fontSize:13,color:'#1A2C3E',lineHeight:1.7,fontFamily:'Inter,sans-serif'}}>
            <strong>{entity.name}</strong> maintains a <strong>{entity.category} Tier</strong> GOSA score of <strong style={{color:sc(entity.gosa)}}>{entity.gosa}</strong>, {entity.trend>0?`up +${entity.trend}`:`down ${Math.abs(entity.trend)}`} from last month. The <strong>{data.strongestIndicator}</strong> indicator ({data.strongestScore}/100) remains the strongest performer, while <strong>{data.weakestIndicator}</strong> ({data.weakestScore}/100) represents the primary bottleneck for investors.
          </p>
        </div>

        {/* YoY Comparison */}
        <div>
          <div style={{fontSize:11,fontWeight:800,color:'#5A6874',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:10}}>📊 Year-over-Year Comparison</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
            {[['GOSA Score',entity.gosa,data.comparison.gosaChange],['FDI Inflows',data.fdi,data.comparison.fdiChange],['Deals Signed',data.evDeals+'',data.comparison.dealsChange]].map(([label,val,chg])=>(
              <div key={label} style={{padding:'12px',background:'#F8F9FA',borderRadius:12,textAlign:'center',border:'1px solid #ECF0F1'}}>
                <div style={{fontSize:10,color:'#C8D0D6',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4}}>{label}</div>
                <div style={{fontSize:18,fontWeight:900,color:'#1A2C3E',fontFamily:'JetBrains Mono,monospace',marginBottom:2}}>{val}</div>
                <div style={{fontSize:11,fontWeight:700,color:String(chg).startsWith('+')?'#27ae60':'#E74C3C'}}>{chg} vs prev yr</div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths + Challenges */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div style={{padding:'14px',background:'rgba(46,204,113,0.05)',borderRadius:12,border:'1px solid rgba(46,204,113,0.15)'}}>
            <div style={{fontSize:11,fontWeight:800,color:'#27ae60',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8}}>✓ Key Strengths</div>
            {data.strengths.map((s:string,i:number)=>(
              <div key={i} style={{fontSize:12,color:'#1A2C3E',padding:'4px 0',borderBottom:i<data.strengths.length-1?'1px solid rgba(46,204,113,0.1)':'none',lineHeight:1.5,fontFamily:'Inter,sans-serif'}}>• {s}</div>
            ))}
          </div>
          <div style={{padding:'14px',background:'rgba(231,76,60,0.04)',borderRadius:12,border:'1px solid rgba(231,76,60,0.12)'}}>
            <div style={{fontSize:11,fontWeight:800,color:'#E74C3C',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8}}>⚠ Key Challenges</div>
            {data.challenges.map((c:string,i:number)=>(
              <div key={i} style={{fontSize:12,color:'#1A2C3E',padding:'4px 0',borderBottom:i<data.challenges.length-1?'1px solid rgba(231,76,60,0.08)':'none',lineHeight:1.5,fontFamily:'Inter,sans-serif'}}>• {c}</div>
            ))}
          </div>
        </div>

        {/* Latest Signals */}
        <div>
          <div style={{fontSize:11,fontWeight:800,color:'#5A6874',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:10}}>📡 Latest Investment Signals (Past 7 Days)</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {entitySignals.map((sig:any,i:number)=>{
              const gc=sig.grade==='PLATINUM'?'#9B59B6':sig.grade==='GOLD'?'#d4ac0d':'#5A6874'
              return (
                <div key={i} style={{padding:'12px',borderRadius:12,border:`1px solid ${gc}20`,background:`${gc}06`}}>
                  <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
                    <span style={{fontSize:9,fontWeight:800,padding:'2px 8px',borderRadius:8,background:`${gc}15`,color:gc}}>{sig.grade}</span>
                    <span style={{fontSize:10,color:'#C8D0D6',fontFamily:'JetBrains Mono,monospace'}}>{sig.ts} ago</span>
                  </div>
                  <div style={{fontSize:12,fontWeight:700,color:'#1A2C3E',marginBottom:4,fontFamily:'Inter,sans-serif'}}>{sig.title}</div>
                  <div style={{fontSize:11,color:'#5A6874',lineHeight:1.5,fontFamily:'Inter,sans-serif'}}>{sig.strategic}</div>
                  {sig.source_url&&<a href={sig.source_url} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:'#3498DB',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:4,marginTop:4}}>
                    <ExternalLink size={9}/>{sig.source_name} →
                  </a>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{display:'flex',gap:10,paddingTop:4,borderTop:'1px solid #F8F9FA'}}>
          <button style={{flex:1,padding:'11px',background:'#1A2C3E',color:'white',border:'none',borderRadius:12,fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Inter,sans-serif',display:'flex',alignItems:'center',justifyContent:'center',gap:7,transition:'all 0.2s'}}
            onMouseEnter={e=>{(e.currentTarget as any).style.background='#243d56'}}
            onMouseLeave={e=>{(e.currentTarget as any).style.background='#1A2C3E'}}>
            <Download size={14}/> Export Full Report
          </button>
          <button style={{flex:1,padding:'11px',background:'rgba(52,152,219,0.08)',color:'#2980b9',border:'1px solid rgba(52,152,219,0.2)',borderRadius:12,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif',display:'flex',alignItems:'center',justifyContent:'center',gap:7,transition:'all 0.2s'}}
            onMouseEnter={e=>{(e.currentTarget as any).style.background='rgba(52,152,219,0.14)'}}
            onMouseLeave={e=>{(e.currentTarget as any).style.background='rgba(52,152,219,0.08)'}}>
            <BarChart3 size={14}/> Compare Countries
          </button>
        </div>
      </div>
    </div>
  )
}
