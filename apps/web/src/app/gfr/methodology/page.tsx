'use client';
import { BookOpen, CheckCircle, Globe, Shield, BarChart3, Target, Database, TrendingUp, ArrowRight } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';
import DimensionWheel from '@/components/DimensionWheel';
import SourceBadge from '@/components/SourceBadge';
import PreviewGate from '@/components/PreviewGate';
import Link from 'next/link';

const DIMENSIONS = [
  {code:'ETR',name:'Economic & Trade Resilience',  weight:20,color:'#0A3D62',
   indicators:['GDP Growth Rate','Current Account Balance','Inflation Rate','Debt/GDP Ratio','Export Diversification'],
   sources:['IMF WEO','World Bank WDI','OECD National Accounts']},
  {code:'ICT',name:'Innovation & Creative Talent',  weight:18,color:'#74BB65',
   indicators:['Global Innovation Index','R&D Expenditure (% GDP)','Patent Filings','STEM Graduate Rate','Startup Density'],
   sources:['WIPO GII','UNESCO Science Report','OECD MSTI']},
  {code:'TCM',name:'Trade & Capital Mobility',      weight:18,color:'#1B6CA8',
   indicators:['FDI Inflows (% GDP)','Trade Openness Index','Capital Account Restrictions','Free Trade Agreements','Logistics Performance'],
   sources:['UNCTAD WIR','World Bank LPI','IMF BOP Statistics']},
  {code:'DTF',name:'Digital & Tech Frontier',       weight:16,color:'#2E86AB',
   indicators:['Broadband Penetration','Cloud Adoption Index','E-Government Development','AI Readiness Score','ICT Export Share'],
   sources:['ITU Digital Development','Oxford Insights AI Government','World Bank ICT']},
  {code:'SGT',name:'Sustainable Growth Trajectory', weight:15,color:'#74BB65',
   indicators:['Renewable Energy Share','Carbon Intensity (declining)','ESG Governance Score','Green Investment Share','SDG Progress Index'],
   sources:['IEA World Energy','Climate Change Performance Index','UN SDG Report']},
  {code:'GRP',name:'Governance & Policy',           weight:13,color:'#0A3D62',
   indicators:['World Justice Project Rule of Law','World Bank Government Effectiveness','Transparency International CPI','Political Stability Index','Regulatory Quality'],
   sources:['World Justice Project','World Bank WGI','Transparency International']},
];

const NORMALISATION_STEPS = [
  {n:1, title:'Raw Data Collection',      desc:'Source data collected from T1–T4 verified sources. Each indicator has a defined source, update frequency, and coverage scope.'},
  {n:2, title:'Distance-to-Frontier',     desc:'Each indicator score: DTF = (Actual − Min) / (Frontier − Max) × 100. Frontier is the best global performance observed.'},
  {n:3, title:'Outlier Treatment',        desc:'Values beyond 3 standard deviations are Winsorised to prevent extreme scores distorting dimension averages.'},
  {n:4, title:'Dimension Aggregation',    desc:'Unweighted average of normalised indicator scores within each dimension. Missing data interpolated using 3-year trend.'},
  {n:5, title:'GFR Score Computation',    desc:'GFR = (ETR×0.20) + (ICT×0.18) + (TCM×0.18) + (DTF×0.16) + (SGT×0.15) + (GRP×0.13). Rounded to 1 decimal place.'},
  {n:6, title:'Tier Classification',      desc:'VERY HIGH ≥90 · HIGH 70–89 · MEDIUM 50–69 · LOW <50. Tier transitions require ≥2 consecutive quarters.'},
];

export default function GFRMethodologyPage() {
  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/><TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'44px 24px'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
              <BookOpen size={16} color="#74BB65"/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>GFR Methodology</span>
            </div>
            <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'6px'}}>
              Global Future Readiness — Assessment Methodology
            </h1>
            <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>
              6 dimensions · 38 indicators · Distance-to-Frontier normalisation · Quarterly recalculation
            </p>
          </div>
          <div style={{display:'flex',gap:'20px'}}>
            {[['6','Dimensions'],['38','Indicators'],['215','Economies'],['Q1 2026','Edition']].map(([v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:'20px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'28px 24px',display:'flex',flexDirection:'column',gap:'20px'}}>
        {/* Dimension Wheel + Overview */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',alignItems:'start'}}>
          <div className="gfm-card" style={{padding:'24px'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
              <BarChart3 size={14} color="#74BB65"/> Dimension Weights & Structure
            </div>
            <DimensionWheel/>
          </div>
          <div className="gfm-card" style={{padding:'24px'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'14px',display:'flex',alignItems:'center',gap:'6px'}}>
              <Shield size={14} color="#74BB65"/> GFR Score Formula
            </div>
            <div style={{fontFamily:'monospace',fontSize:'12px',color:'#0A3D62',
              background:'rgba(10,61,98,0.04)',padding:'16px',borderRadius:'9px',
              border:'1px solid rgba(10,61,98,0.1)',lineHeight:'2.0',marginBottom:'16px'}}>
              GFR = (ETR × 0.20)<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;+ (ICT × 0.18)<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;+ (TCM × 0.18)<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;+ (DTF × 0.16)<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;+ (SGT × 0.15)<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;+ (GRP × 0.13)
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'8px'}}>
              {[{tier:'VERY HIGH',range:'≥ 90',color:'#74BB65'},{tier:'HIGH',range:'70–89',color:'#0A3D62'},
                {tier:'MEDIUM',range:'50–69',color:'#FFB347'},{tier:'LOW',range:'< 50',color:'#E57373'}].map(t=>(
                <div key={t.tier} style={{padding:'10px',borderRadius:'8px',background:`${t.color}08`,
                  border:`1px solid ${t.color}20`,textAlign:'center'}}>
                  <div style={{fontSize:'13px',fontWeight:800,color:t.color,fontFamily:'monospace'}}>{t.range}</div>
                  <div style={{fontSize:'10px',fontWeight:700,color:t.color,marginTop:'2px'}}>{t.tier}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:'16px',paddingTop:'14px',borderTop:'1px solid rgba(10,61,98,0.06)'}}>
              <div style={{fontSize:'12px',fontWeight:700,color:'#0A3D62',marginBottom:'8px'}}>Investment Analysis Integration</div>
              <p style={{fontSize:'12px',color:'#696969',lineHeight:'1.6',marginBottom:'10px'}}>
                GFR scores feed into the Investment Analysis module as part of Layer 4 (Market Intelligence Matrix). The Global Opportunity Score Analysis (GOSA) builds upon GFR with Doing Business, Sector, and Zone indicators.
              </p>
              <Link href="/investment-analysis" style={{display:'inline-flex',alignItems:'center',gap:'5px',
                padding:'8px 16px',background:'#74BB65',color:'white',borderRadius:'7px',
                textDecoration:'none',fontSize:'12px',fontWeight:700}}>
                Open Investment Analysis <ArrowRight size={12}/>
              </Link>
            </div>
          </div>
        </div>

        {/* 6 dimensions */}
        <div className="gfm-card" style={{padding:'24px'}}>
          <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'18px',display:'flex',alignItems:'center',gap:'6px'}}>
            <Globe size={14} color="#74BB65"/> 6 Dimensions — Indicators & Sources
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {DIMENSIONS.map(dim=>(
              <div key={dim.code} style={{padding:'16px',borderRadius:'10px',
                background:`${dim.color}04`,border:`1px solid ${dim.color}18`,borderLeft:`4px solid ${dim.color}`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'8px',marginBottom:'10px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <span style={{fontSize:'14px',fontWeight:900,color:dim.color,fontFamily:'monospace'}}>{dim.code}</span>
                    <span style={{fontSize:'13px',fontWeight:700,color:'#0A3D62'}}>{dim.name}</span>
                  </div>
                  <span style={{fontSize:'11px',fontWeight:800,padding:'3px 10px',borderRadius:'10px',
                    background:`${dim.color}12`,color:dim.color}}>Weight: {dim.weight}%</span>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                  <div>
                    <div style={{fontSize:'10px',fontWeight:700,color:'#696969',textTransform:'uppercase',
                      letterSpacing:'0.05em',marginBottom:'5px'}}>Indicators</div>
                    <div style={{display:'flex',flexDirection:'column',gap:'3px'}}>
                      {dim.indicators.map(ind=>(
                        <div key={ind} style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'11px',color:'#696969'}}>
                          <CheckCircle size={9} color={dim.color}/>{ind}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize:'10px',fontWeight:700,color:'#696969',textTransform:'uppercase',
                      letterSpacing:'0.05em',marginBottom:'5px'}}>Sources</div>
                    <div style={{display:'flex',flexDirection:'column',gap:'3px'}}>
                      {dim.sources.map(src=>(
                        <div key={src} style={{fontSize:'11px',color:'#696969',fontFamily:'monospace'}}>{src}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Normalisation pipeline */}
        <PreviewGate feature="full_profile">
          <div className="gfm-card" style={{padding:'24px'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'18px',display:'flex',alignItems:'center',gap:'6px'}}>
              <Database size={14} color="#74BB65"/> 6-Step Normalisation Pipeline
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
              {NORMALISATION_STEPS.map(step=>(
                <div key={step.n} style={{display:'flex',gap:'10px',padding:'14px',borderRadius:'10px',
                  background:'rgba(10,61,98,0.02)',border:'1px solid rgba(10,61,98,0.07)'}}>
                  <div style={{width:'28px',height:'28px',borderRadius:'50%',flexShrink:0,
                    background:'#0A3D62',color:'white',display:'flex',alignItems:'center',
                    justifyContent:'center',fontSize:'12px',fontWeight:800}}>{step.n}</div>
                  <div>
                    <div style={{fontSize:'12px',fontWeight:700,color:'#0A3D62',marginBottom:'4px'}}>{step.title}</div>
                    <div style={{fontSize:'11px',color:'#696969',lineHeight:'1.5'}}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PreviewGate>

        {/* Source transparency */}
        <div className="gfm-card" style={{padding:'22px'}}>
          <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'14px',display:'flex',alignItems:'center',gap:'6px'}}>
            <TrendingUp size={14} color="#74BB65"/> Data Transparency & Source Attribution
          </div>
          <p style={{fontSize:'13px',color:'#696969',lineHeight:'1.75',marginBottom:'14px'}}>
            Every GFR score is traceable to its source data. Hover over any score on the platform to see the contributing source, update date, and GFM reference code.
          </p>
          <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
            {[{src:'IMF World Economic Outlook',ref:'GFM-SRC-000001',date:'Apr 2026'},
              {src:'UNCTAD World Investment Report',ref:'GFM-SRC-000002',date:'Jun 2025'},
              {src:'World Bank WDI',ref:'GFM-SRC-000003',date:'2025'}].map(s=>(
              <SourceBadge key={s.ref} source={s.src} date={s.date} accessed="20 Mar 2026" refCode={s.ref}>
                <span style={{fontSize:'11px',padding:'4px 10px',borderRadius:'7px',
                  background:'rgba(10,61,98,0.05)',border:'1px solid rgba(10,61,98,0.1)',
                  color:'#696969',cursor:'default',display:'inline-block'}}>{s.src}</span>
              </SourceBadge>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
