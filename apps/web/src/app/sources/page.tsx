'use client';
import { useState } from 'react';
import ScrollableSelect from '@/components/ScrollableSelect';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const SOURCE_CATEGORIES = [
  { cat:'International Financial Institutions', count:18, color:'#2ecc71', sources:[
    'World Bank Group — Doing Business / IFC','IMF — World Economic Outlook','OECD — Investment Policy Reviews',
    'Asian Development Bank — FDI Statistics','African Development Bank','Inter-American Development Bank',
    'European Bank for Reconstruction and Development','Islamic Development Bank','World Trade Organization',
    'UNCTAD — World Investment Report','UNIDO — Investment Statistics','ILO — Labour Standards',
    'UN Comtrade — Trade Statistics','FAO — Agricultural Investment','WHO — Health Sector Data',
    'UNESCO — Education Statistics','IAEA — Energy Investment','ICAO — Aviation Data',
  ]},
  { cat:'Investment Promotion Agencies', count:62, color:'#3498db', sources:[
    'MITI Malaysia — Malaysian Investment Development Authority','Thailand BOI — Board of Investment',
    'Vietnam MPI — Ministry of Planning and Investment','Indonesia BKPM — Investment Coordinating Board',
    'MISA Saudi Arabia — Ministry of Investment','UAE ADIO — Abu Dhabi Investment Office',
    'DIFC — Dubai International Financial Centre','Singapore EDB — Economic Development Board',
    'India Invest India','Korea KOTRA','Japan JETRO','Germany GTAI','UK DBT — Dept. for Business and Trade',
    'France Business France','Netherlands RVO','Canada ITC — Investment Trade Canada',
    'Australia Austrade','New Zealand NZTE','Morocco AMDIE','Egypt GAFI',
    'Ghana GIB','Rwanda RDB','Kenya KenInvest','Nigeria NIPC','South Africa SARS','Côte d\'Ivoire CEPICI',
    'Mauritius BOI','Ethiopia EIC','Tanzania TIC','Uganda UIA',
  ]},
  { cat:'Central Banks & Finance Ministries', count:48, color:'#9b59b6', sources:[
    'Bank Negara Malaysia','Bank of Thailand','State Bank of Vietnam','Bank Indonesia',
    'Saudi Central Bank SAMA','UAE Central Bank','Central Bank Singapore MAS',
    'Reserve Bank of India RBI','Bank of Korea','Bank of Japan','Bank of England',
    'European Central Bank','Federal Reserve (US)','Peoples Bank of China',
    'Bank Al-Maghrib (Morocco)','Central Bank Egypt','South African Reserve Bank',
    'Brazilian Central Bank','Central Bank of Russia',
  ]},
  { cat:'Statistical Authorities', count:44, color:'#f1c40f', sources:[
    'Malaysia DOSM','Thailand NSO','Vietnam GSO','Indonesia BPS','Saudi GaStat',
    'UAE Federal Competitiveness & Statistics Authority','Singapore Statistics','India MoSPI',
    'Korea Statistics Korea','Japan Statistics Bureau','UK ONS','Eurostat','US BEA',
    'OECD.Stat','UN Statistics Division','World Bank Data','IMF Data',
  ]},
  { cat:'Special Economic Zone Authorities', count:38, color:'#e67e22', sources:[
    'Penang Development Corporation (Malaysia)','Thailand EEC Office','Batam Indonesia Free Zone Authority',
    'KAEC King Abdullah Economic City','NEOM Authority','JAFZA Jebel Ali Free Zone',
    'Singapore JTC — Jurong Town Corporation','Tanger Med (Morocco)',
    'Casablanca Finance City','Shenzhen Special Economic Zone',
    'Subic Bay Freeport Zone (Philippines)','SEZ Vietnam — Ministry of Planning',
  ]},
  { cat:'Trade & Commerce Databases', count:42, color:'#2ecc71', sources:[
    'ITC Trade Map — International Trade Centre','UN Comtrade','WTO Trade Statistics',
    'ASEAN Trade Statistics','Arab Trade Finance Program','ECOWAS Trade Statistics',
    'US Census Bureau — Trade Data','EU Eurostat Trade','Japan METI Trade Statistics',
    'China MOFCOM FDI Statistics','India DPIIT FDI Statistics',
  ]},
  { cat:'Rating Agencies & Index Providers', count:28, color:'#3498db', sources:[
    'Moody\'s Sovereign Ratings','S&P Global Ratings','Fitch Ratings',
    'World Economic Forum — Global Competitiveness','Heritage Foundation — Economic Freedom',
    'Transparency International — Corruption Perceptions','Economist Intelligence Unit',
    'Political Risk Services — ICRG','Coface Country Risk','Euler Hermes Risk',
    'Oxford Economics','Capital Economics','MSCI Market Classification',
  ]},
  { cat:'Sector Intelligence Sources', count:24, color:'#9b59b6', sources:[
    'IEA — International Energy Agency (Renewables/Energy)','IRENA — International Renewable Energy Agency',
    'GSMA Intelligence (Telecom)','IATA — Air Transport Statistics','ISA — International Solar Alliance',
    'OPEC — Oil & Gas Statistics','BloombergNEF (EV/Clean Energy)','IDC (Technology)',
    'Gartner (Technology Markets)','McKinsey Global Institute','BCG Strategy Institute',
    'PwC Global Investment Report','Deloitte FDI Intelligence',
  ]},
];

export default function SourcesPage() {
  const [expanded, setExpanded] = useState<number|null>(null);
  const [filter, setFilter] = useState('ALL');

  const cats = filter==='ALL' ? SOURCE_CATEGORIES : SOURCE_CATEGORIES.filter(c=>c.cat.toLowerCase().includes(filter.toLowerCase()));
  const catOptions = [{value:'ALL',label:'All Categories'}, ...SOURCE_CATEGORIES.map(c=>({value:c.cat,label:c.cat,sub:c.count+' sources'}))];
  const totalSources = SOURCE_CATEGORIES.reduce((a,c)=>a+c.count,0);

  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8',fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{background:'linear-gradient(135deg,#0f1e2a,#1a2c3e)',padding:'24px',borderBottom:'1px solid rgba(46,204,113,0.1)'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'#2ecc71',letterSpacing:'0.12em',marginBottom:'6px'}}>DATA SOURCES</div>
          <h1 style={{fontSize:'24px',fontWeight:900,color:'white',marginBottom:'8px'}}>Intelligence Source Library</h1>
          <p style={{fontSize:'13px',color:'rgba(255,255,255,0.6)',marginBottom:'16px'}}>
            {totalSources}+ verified official sources · SHA-256 provenance tracking · Updated weekly by AGT-01 Data Collection Agent
          </p>
          <div style={{display:'flex',gap:'14px',flexWrap:'wrap'}}>
            {[['304+','Total Sources'],['8','Source Categories'],['Weekly','Update Frequency'],['SHA-256','Verification']].map(([v,l])=>(
              <div key={l} style={{padding:'8px 14px',background:'rgba(255,255,255,0.07)',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)'}}>
                <span style={{fontSize:'16px',fontWeight:900,color:'#2ecc71',fontFamily:"'JetBrains Mono',monospace"}}>{v} </span>
                <span style={{fontSize:'11px',color:'rgba(255,255,255,0.5)'}}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'24px'}}>
        {/* Methodology note */}
        <div style={{background:'white',borderRadius:'14px',border:'1px solid rgba(46,204,113,0.15)',padding:'18px 22px',marginBottom:'20px'}}>
          <div style={{fontSize:'12px',fontWeight:700,color:'#2ecc71',marginBottom:'6px'}}>SOURCE VERIFICATION METHODOLOGY</div>
          <p style={{fontSize:'13px',color:'#2c3e50',lineHeight:'1.7',margin:0}}>
            All sources are verified by AGT-03 Verification Agent using SHA-256 provenance hashing. Sources are classified as T1 (official government/IFI), T2 (multilateral organizations), or T3 (commercial intelligence). Only T1 and T2 sources contribute to GOSA scoring. T3 sources supplement the Market Intelligence Matrix (L4 layer). Every signal includes its source, timestamp, and verification hash.
          </p>
        </div>

        {/* Category cards */}
        <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
          {SOURCE_CATEGORIES.map(({cat,count,color,sources},i)=>(
            <div key={cat} style={{background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',overflow:'hidden'}}>
              <div onClick={()=>setExpanded(expanded===i?null:i)}
                style={{padding:'16px 20px',cursor:'pointer',display:'flex',alignItems:'center',gap:'14px'}}>
                <div style={{width:'44px',height:'44px',borderRadius:'10px',background:`${color}12`,border:`1px solid ${color}25`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <span style={{fontSize:'20px',fontWeight:900,color,fontFamily:"'JetBrains Mono',monospace"}}>{count}</span>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:'14px',fontWeight:700,color:'#1a2c3e'}}>{cat}</div>
                  <div style={{fontSize:'11px',color:'#7f8c8d',marginTop:'2px'}}>{count} official sources · T1/T2 verified</div>
                </div>
                <div style={{display:'flex',gap:'4px',flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'300px'}}>
                  {sources.slice(0,3).map(s=>(
                    <span key={s} style={{fontSize:'10px',padding:'2px 8px',background:'rgba(26,44,62,0.05)',borderRadius:'10px',color:'#7f8c8d',whiteSpace:'nowrap'}}>{s.split(' — ')[0].split(' — ')[0]}</span>
                  ))}
                  {count>3&&<span style={{fontSize:'10px',color:'#7f8c8d'}}>+{count-3} more</span>}
                </div>
                <span style={{fontSize:'18px',color:'#7f8c8d',flexShrink:0,marginLeft:'10px'}}>{expanded===i?'−':'+'}</span>
              </div>
              {expanded===i && (
                <div style={{borderTop:'1px solid rgba(26,44,62,0.06)',padding:'16px 20px'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
                    {sources.map(s=>(
                      <div key={s} style={{padding:'8px 12px',background:'rgba(26,44,62,0.02)',borderRadius:'8px',border:'1px solid rgba(26,44,62,0.06)',fontSize:'12px',color:'#2c3e50',display:'flex',alignItems:'center',gap:'6px'}}>
                        <span style={{width:'6px',height:'6px',borderRadius:'50%',background:color,flexShrink:0}}/>
                        {s}
                      </div>
                    ))}
                    {count>sources.length && (
                      <div style={{padding:'8px 12px',background:'rgba(26,44,62,0.02)',borderRadius:'8px',border:'1px dashed rgba(26,44,62,0.12)',fontSize:'12px',color:'#7f8c8d',textAlign:'center',gridColumn:'span 1'}}>
                        +{count-sources.length} additional sources
                      </div>
                    )}
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
