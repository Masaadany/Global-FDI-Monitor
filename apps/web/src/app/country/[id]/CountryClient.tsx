'use client';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Download, Zap } from 'lucide-react';

export const COUNTRIES: Record<string, any> = {
  SGP:{ name:'Singapore',flag:'🇸🇬',region:'Asia Pacific',tier:'TOP',gosa:88.4,gfr:91.2,l1:92.1,l2:85.3,l3:87.2,l4:89.0,trend:0.2,
    capital:'Singapore City',currency:'SGD',gdp:'$466B',gdp_growth:'3.2%',fdi_inflow:'$91B',population:'5.9M',
    dims:{etr:93.1,ict:89.4,tcm:94.2,dtf:91.8,sgt:82.1,grp:96.4},
    zones:['Jurong Island','Changi Business Park','One-North','Seletar Aerospace'],
    sectors:['Semiconductors','Biomedical','Logistics','Fintech','Advanced Manufacturing'],
    signals:[
      {type:'POLICY',title:'100% foreign ownership all sectors',impact:'HIGH',sco:94},
      {type:'INCENTIVE',title:'Global Investor Programme expanded',impact:'HIGH',sco:91},
    ],
    doing_business:[
      {ind:'Starting a Business',score:96.2,rank:1},{ind:'Construction Permits',score:89.1,rank:4},
      {ind:'Getting Electricity',score:98.8,rank:1},{ind:'Registering Property',score:87.4,rank:18},
      {ind:'Getting Credit',score:85.0,rank:3},{ind:'Protecting Investors',score:92.6,rank:3},
      {ind:'Paying Taxes',score:91.4,rank:7},{ind:'Trading Across Borders',score:99.2,rank:1},
      {ind:'Enforcing Contracts',score:87.3,rank:2},{ind:'Resolving Insolvency',score:87.1,rank:27},
    ],
  },
  MYS:{ name:'Malaysia',flag:'🇲🇾',region:'Asia Pacific',tier:'HIGH',gosa:81.2,gfr:79.2,l1:82.5,l2:80.7,l3:81.8,l4:79.8,trend:0.4,
    capital:'Kuala Lumpur',currency:'MYR',gdp:'$400B',gdp_growth:'4.1%',fdi_inflow:'$22B',population:'33M',
    dims:{etr:78.6,ict:76.4,tcm:81.8,dtf:78.2,sgt:74.6,grp:82.4},
    zones:['Penang Free Industrial Zone','Port Klang FTZ','Johor Bahru Industrial Park','KLIA Aeropolis'],
    sectors:['Electronics','Data Centers','EV Battery','Halal Foods','Medical Devices'],
    signals:[
      {type:'POLICY',title:'FDI cap data centers raised to 100%',impact:'HIGH',sco:96},
      {type:'INCENTIVE',title:'MSC Malaysia status extended',impact:'HIGH',sco:89},
    ],
    doing_business:[
      {ind:'Starting a Business',score:82.3,rank:15},{ind:'Construction Permits',score:74.8,rank:11},
      {ind:'Getting Electricity',score:87.2,rank:6},{ind:'Registering Property',score:78.4,rank:33},
      {ind:'Getting Credit',score:75.0,rank:20},{ind:'Protecting Investors',score:81.8,rank:12},
      {ind:'Paying Taxes',score:78.6,rank:72},{ind:'Trading Across Borders',score:82.4,rank:49},
      {ind:'Enforcing Contracts',score:72.1,rank:41},{ind:'Resolving Insolvency',score:82.4,rank:40},
    ],
  },
  THA:{ name:'Thailand',flag:'🇹🇭',region:'Asia Pacific',tier:'HIGH',gosa:80.7,gfr:77.4,l1:81.8,l2:80.2,l3:81.0,l4:79.8,trend:0.2,
    capital:'Bangkok',currency:'THB',gdp:'$544B',gdp_growth:'2.8%',fdi_inflow:'$14B',population:'72M',
    dims:{etr:75.8,ict:72.6,tcm:78.4,dtf:74.6,sgt:72.8,grp:78.4},
    zones:['Eastern Economic Corridor','Amata City','WHA Industrial Estate','IEAT Laem Chabang'],
    sectors:['EV Assembly','Automotive','Electronics','Petrochemicals','Tourism Infrastructure'],
    signals:[{type:'INCENTIVE',title:'$2B EV battery subsidy approved',impact:'HIGH',sco:95}],
    doing_business:[
      {ind:'Starting a Business',score:78.8,rank:36},{ind:'Construction Permits',score:72.1,rank:31},
      {ind:'Getting Electricity',score:81.3,rank:6},{ind:'Registering Property',score:73.2,rank:62},
      {ind:'Getting Credit',score:65.0,rank:40},{ind:'Protecting Investors',score:74.0,rank:18},
      {ind:'Paying Taxes',score:71.2,rank:67},{ind:'Trading Across Borders',score:68.4,rank:62},
      {ind:'Enforcing Contracts',score:67.9,rank:45},{ind:'Resolving Insolvency',score:61.8,rank:26},
    ],
  },
  VNM:{ name:'Vietnam',flag:'🇻🇳',region:'Asia Pacific',tier:'HIGH',gosa:79.4,gfr:76.8,l1:80.5,l2:79.1,l3:78.9,l4:79.1,trend:0.5,
    capital:'Hanoi',currency:'VND',gdp:'$449B',gdp_growth:'6.1%',fdi_inflow:'$24B',population:'98M',
    dims:{etr:74.2,ict:71.4,tcm:77.6,dtf:72.4,sgt:74.2,grp:74.8},
    zones:['Binh Duong Industrial Parks','Hanoi Industrial Zone','VSIP','Long An Industrial Park'],
    sectors:['Electronics','EV Battery','Textiles','Food Processing','Software'],
    signals:[{type:'GROWTH',title:'Electronics exports surge 34% YoY',impact:'HIGH',sco:92}],
    doing_business:[
      {ind:'Starting a Business',score:79.2,rank:24},{ind:'Construction Permits',score:68.4,rank:25},
      {ind:'Getting Electricity',score:87.2,rank:27},{ind:'Registering Property',score:62.8,rank:60},
      {ind:'Getting Credit',score:75.0,rank:25},{ind:'Protecting Investors',score:72.4,rank:26},
      {ind:'Paying Taxes',score:68.7,rank:109},{ind:'Trading Across Borders',score:73.1,rank:104},
      {ind:'Enforcing Contracts',score:62.3,rank:62},{ind:'Resolving Insolvency',score:61.5,rank:122},
    ],
  },
  ARE:{ name:'UAE',flag:'🇦🇪',region:'Middle East',tier:'TOP',gosa:82.1,gfr:83.8,l1:83.4,l2:81.2,l3:82.8,l4:81.0,trend:1.2,
    capital:'Abu Dhabi',currency:'AED',gdp:'$508B',gdp_growth:'4.4%',fdi_inflow:'$23B',population:'9.9M',
    dims:{etr:86.4,ict:82.1,tcm:88.6,dtf:84.2,sgt:76.8,grp:88.4},
    zones:['ADGM','Dubai Internet City','Jebel Ali Free Zone'],
    sectors:['AI & Data Centers','Financial Services','Renewables','Logistics','Aerospace'],
    signals:[{type:'DEAL',title:'Microsoft $3.3B AI data center announced',impact:'HIGH',sco:97}],
    doing_business:[
      {ind:'Starting a Business',score:91.4,rank:2},{ind:'Construction Permits',score:88.2,rank:6},
      {ind:'Getting Electricity',score:99.1,rank:1},{ind:'Registering Property',score:94.2,rank:3},
      {ind:'Getting Credit',score:55.0,rank:62},{ind:'Protecting Investors',score:74.0,rank:18},
      {ind:'Paying Taxes',score:99.4,rank:1},{ind:'Trading Across Borders',score:94.8,rank:8},
      {ind:'Enforcing Contracts',score:72.4,rank:9},{ind:'Resolving Insolvency',score:61.2,rank:20},
    ],
  },
  SAU:{ name:'Saudi Arabia',flag:'🇸🇦',region:'Middle East',tier:'HIGH',gosa:79.1,gfr:78.6,l1:77.3,l2:80.4,l3:82.1,l4:76.6,trend:2.1,
    capital:'Riyadh',currency:'SAR',gdp:'$1.07T',gdp_growth:'2.6%',fdi_inflow:'$36B',population:'35M',
    dims:{etr:82.4,ict:74.2,tcm:80.6,dtf:76.8,sgt:68.4,grp:82.6},
    zones:['KAEC','Riyadh City','NEOM','Ras Al-Khair Industrial City'],
    sectors:['Renewables','Tourism','Advanced Manufacturing','Mining','Defense'],
    signals:[{type:'POLICY',title:'30-day FDI license guarantee launched',impact:'HIGH',sco:94}],
    doing_business:[
      {ind:'Starting a Business',score:84.1,rank:38},{ind:'Construction Permits',score:72.8,rank:28},
      {ind:'Getting Electricity',score:93.7,rank:4},{ind:'Registering Property',score:76.8,rank:25},
      {ind:'Getting Credit',score:65.0,rank:40},{ind:'Protecting Investors',score:75.0,rank:15},
      {ind:'Paying Taxes',score:91.1,rank:3},{ind:'Trading Across Borders',score:78.2,rank:54},
      {ind:'Enforcing Contracts',score:64.2,rank:54},{ind:'Resolving Insolvency',score:45.2,rank:65},
    ],
  },
  IND:{ name:'India',flag:'🇮🇳',region:'Asia Pacific',tier:'HIGH',gosa:73.2,gfr:75.6,l1:69.8,l2:74.6,l3:74.8,l4:73.6,trend:0.8,
    capital:'New Delhi',currency:'INR',gdp:'$3.75T',gdp_growth:'6.5%',fdi_inflow:'$71B',population:'1.44B',
    dims:{etr:72.8,ict:76.4,tcm:74.2,dtf:72.8,sgt:68.6,grp:76.2},
    zones:['Bangalore Technology Park','GIFT City','Chennai SEZ','Pune Industrial Corridor'],
    sectors:['Semiconductors','IT Services','Pharmaceuticals','EV Manufacturing','Renewables'],
    signals:[{type:'DEAL',title:'Apple $10B manufacturing expansion confirmed',impact:'HIGH',sco:89}],
    doing_business:[
      {ind:'Starting a Business',score:78.2,rank:136},{ind:'Construction Permits',score:71.3,rank:27},
      {ind:'Getting Electricity',score:84.7,rank:22},{ind:'Registering Property',score:58.7,rank:154},
      {ind:'Getting Credit',score:80.0,rank:25},{ind:'Protecting Investors',score:74.0,rank:13},
      {ind:'Paying Taxes',score:67.0,rank:115},{ind:'Trading Across Borders',score:62.0,rank:68},
      {ind:'Enforcing Contracts',score:41.2,rank:163},{ind:'Resolving Insolvency',score:62.0,rank:52},
    ],
  },
};

function scoreColor(s: number) {
  if(s>=80) return '#2ecc71'; if(s>=60) return '#3498db'; if(s>=40) return '#f1c40f'; return '#e74c3c';
}

export default function CountryClient({ id }: { id: string }) {
  const key = id?.toUpperCase();
  const c = COUNTRIES[key];

  if(!c) return (
    <div style={{minHeight:'100vh',background:'#f0f4f8',fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{maxWidth:'800px',margin:'80px auto',textAlign:'center',padding:'24px'}}>
        <div style={{fontSize:'60px',marginBottom:'20px'}}>🌍</div>
        <h1 style={{fontSize:'28px',fontWeight:900,color:'#1a2c3e',marginBottom:'12px'}}>Economy not found: {id}</h1>
        <p style={{color:'#7f8c8d',marginBottom:'24px'}}>Try: SGP, MYS, THA, VNM, ARE, SAU, IND</p>
        <Link href="/investment-analysis" style={{padding:'12px 28px',background:'#2ecc71',color:'#0f1e2a',borderRadius:'10px',textDecoration:'none',fontWeight:800}}>View All Countries</Link>
      </div>
      <Footer/>
    </div>
  );

  const dimData = [
    {code:'ETR',v:c.dims.etr,color:'#1a2c3e'},{code:'ICT',v:c.dims.ict,color:'#2ecc71'},
    {code:'TCM',v:c.dims.tcm,color:'#3498db'},{code:'DTF',v:c.dims.dtf,color:'#9b59b6'},
    {code:'SGT',v:c.dims.sgt,color:'#27ae60'},{code:'GRP',v:c.dims.grp,color:'#f1c40f'},
  ];

  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8',fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{background:'linear-gradient(135deg,#0f1e2a,#1a2c3e)',padding:'28px 24px',borderBottom:'1px solid rgba(46,204,113,0.1)'}}>
        <div style={{maxWidth:'1440px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'20px',flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:'18px'}}>
              <span style={{fontSize:'52px'}}>{c.flag}</span>
              <div>
                <h1 style={{fontSize:'26px',fontWeight:900,color:'white',marginBottom:'4px'}}>{c.name}</h1>
                <div style={{display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap'}}>
                  <span style={{fontSize:'12px',color:'rgba(255,255,255,0.5)'}}>{c.region}</span>
                  <span style={{fontSize:'9px',fontWeight:800,padding:'2px 8px',borderRadius:'10px',background:'rgba(46,204,113,0.12)',color:'#2ecc71'}}>{c.tier} TIER</span>
                  <span style={{fontSize:'11px',color:'rgba(255,255,255,0.5)'}}>GDP: {c.gdp} · Growth: {c.gdp_growth}</span>
                </div>
              </div>
            </div>
            <div style={{display:'flex',gap:'16px',alignItems:'center'}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',marginBottom:'2px'}}>GOSA</div>
                <div style={{fontSize:'38px',fontWeight:900,color:'#2ecc71',fontFamily:"'JetBrains Mono',monospace",lineHeight:1}}>{c.gosa}</div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:'10px',color:'rgba(255,255,255,0.4)',marginBottom:'2px'}}>GFR</div>
                <div style={{fontSize:'38px',fontWeight:900,color:'#f1c40f',fontFamily:"'JetBrains Mono',monospace",lineHeight:1}}>{c.gfr}</div>
              </div>
              <Link href="/reports" style={{padding:'9px 18px',background:'#2ecc71',color:'#0f1e2a',borderRadius:'8px',textDecoration:'none',fontSize:'12px',fontWeight:800,display:'flex',alignItems:'center',gap:'5px'}}>
                <Download size={12}/> PDF Report
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1440px',margin:'0 auto',padding:'20px 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',marginBottom:'14px'}}>
          <div style={{background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',padding:'18px'}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'#7f8c8d',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'14px'}}>Key Indicators</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              {[['Capital',c.capital],['Currency',c.currency],['GDP',c.gdp],['GDP Growth',c.gdp_growth],['FDI Inflow',c.fdi_inflow],['Population',c.population]].map(([l,v])=>(
                <div key={l} style={{padding:'8px 10px',background:'rgba(26,44,62,0.02)',borderRadius:'7px'}}>
                  <div style={{fontSize:'10px',color:'#7f8c8d',marginBottom:'2px',textTransform:'uppercase'}}>{l}</div>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e'}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',padding:'18px'}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'#7f8c8d',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'14px'}}>GFR 6 Dimensions</div>
            {dimData.map(dim=>(
              <div key={dim.code} style={{marginBottom:'8px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'2px'}}>
                  <span style={{fontSize:'11px',fontWeight:600,color:'#2c3e50'}}>{dim.code}</span>
                  <span style={{fontSize:'11px',fontWeight:800,color:dim.color,fontFamily:"'JetBrains Mono',monospace"}}>{dim.v}</span>
                </div>
                <div style={{height:'5px',background:'rgba(26,44,62,0.07)',borderRadius:'3px'}}>
                  <div style={{height:'100%',width:`${dim.v}%`,background:dim.color,borderRadius:'3px'}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',padding:'18px',marginBottom:'14px'}}>
          <div style={{fontSize:'11px',fontWeight:700,color:'#7f8c8d',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'14px'}}>Doing Business — 10 Indicators</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'8px'}}>
            {c.doing_business.map(({ind,score,rank}: any)=>(
              <div key={ind} style={{padding:'10px',background:'rgba(26,44,62,0.02)',borderRadius:'9px',border:'1px solid rgba(26,44,62,0.06)',textAlign:'center'}}>
                <div style={{fontSize:'9px',color:'#7f8c8d',marginBottom:'4px',lineHeight:'1.4'}}>{ind}</div>
                <div style={{fontSize:'18px',fontWeight:900,color:scoreColor(score),fontFamily:"'JetBrains Mono',monospace"}}>{score}</div>
                <div style={{fontSize:'9px',color:'#7f8c8d',marginTop:'1px'}}>#{rank}</div>
                <div style={{height:'3px',background:'rgba(26,44,62,0.06)',borderRadius:'2px',marginTop:'4px'}}>
                  <div style={{height:'100%',width:`${score}%`,background:scoreColor(score),borderRadius:'2px'}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',marginBottom:'14px'}}>
          <div style={{background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',padding:'18px'}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'#7f8c8d',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'12px'}}>Investment Zones</div>
            {c.zones.map((z: string)=>(
              <div key={z} style={{padding:'8px 12px',background:'rgba(46,204,113,0.04)',borderRadius:'7px',border:'1px solid rgba(46,204,113,0.1)',marginBottom:'5px',fontSize:'12px',fontWeight:500,color:'#1a2c3e'}}>{z}</div>
            ))}
          </div>
          <div style={{background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',padding:'18px'}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'#7f8c8d',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'12px'}}><Zap size={11} style={{marginRight:'4px',display:'inline',color:'#2ecc71'}}/> Signals</div>
            {c.signals.map((sig: any)=>{
              const tc: Record<string,string> = {POLICY:'#e74c3c',INCENTIVE:'#2ecc71',ZONE:'#f1c40f',DEAL:'#e67e22',GROWTH:'#3498db'};
              const col = tc[sig.type]||'#7f8c8d';
              return (
                <div key={sig.title} style={{padding:'9px 12px',borderRadius:'8px',border:'1px solid rgba(26,44,62,0.06)',marginBottom:'6px',borderLeft:`3px solid ${col}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'2px'}}>
                    <span style={{fontSize:'9px',fontWeight:800,color:col}}>{sig.type}</span>
                    <span style={{fontSize:'11px',fontWeight:800,color:'#9b59b6'}}>{sig.sco}</span>
                  </div>
                  <div style={{fontSize:'12px',fontWeight:600,color:'#1a2c3e'}}>{sig.title}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{background:'#1a2c3e',borderRadius:'14px',padding:'20px 24px',display:'flex',gap:'16px',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',border:'1px solid rgba(46,204,113,0.1)'}}>
          <div>
            <div style={{fontSize:'15px',fontWeight:800,color:'white',marginBottom:'3px'}}>Generate Full Report for {c.name}</div>
            <div style={{fontSize:'12px',color:'rgba(255,255,255,0.5)'}}>4-page PDF · GOSA deep-dive · Zone recommendations</div>
          </div>
          <div style={{display:'flex',gap:'10px'}}>
            <Link href="/reports" style={{padding:'10px 22px',background:'#2ecc71',color:'#0f1e2a',borderRadius:'9px',textDecoration:'none',fontSize:'13px',fontWeight:800}}>Generate Report →</Link>
            <Link href="/investment-analysis" style={{padding:'10px 18px',border:'1px solid rgba(255,255,255,0.2)',color:'white',borderRadius:'9px',textDecoration:'none',fontSize:'13px',fontWeight:600}}>Compare Countries</Link>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
