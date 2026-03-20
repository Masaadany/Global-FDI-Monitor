'use client';
import { useState } from 'react';
import { Code, Key, Shield, Globe, Zap, BookOpen, CheckCircle, Server, ArrowRight } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import PreviewGate from '@/components/PreviewGate';
import Footer from '@/components/Footer';
import Link from 'next/link';

const GROUPS = [
  {id:'auth',      label:'Authentication',        icon:Key,           color:'#696969', count:8,  base:'/api/v1/auth',
   endpoints:[
     {method:'POST',path:'/register',desc:'Register new user account'},
     {method:'POST',path:'/login',desc:'Authenticate user, returns JWT'},
     {method:'POST',path:'/refresh',desc:'Refresh access token'},
     {method:'POST',path:'/logout',desc:'Invalidate session'},
     {method:'GET', path:'/me',desc:'Get current user profile'},
     {method:'PUT', path:'/me',desc:'Update profile'},
     {method:'POST',path:'/reset',desc:'Request password reset'},
     {method:'POST',path:'/reset/confirm',desc:'Confirm password reset'},
   ]},
  {id:'signals',   label:'FDI Signals',           icon:Zap,           color:'#74BB65', count:7,  base:'/api/v1/signals',
   endpoints:[
     {method:'GET',path:'/',desc:'List signals — filter by grade, sector, region, economy'},
     {method:'GET',path:'/:ref',desc:'Get full signal detail by reference ID'},
     {method:'GET',path:'/live',desc:'WebSocket stream of live signal updates'},
     {method:'GET',path:'/grades',desc:'Signal grade distribution summary'},
     {method:'GET',path:'/sectors',desc:'Signals grouped by sector'},
     {method:'GET',path:'/corridors',desc:'Corridor-level signal aggregates'},
     {method:'POST',path:'/alert',desc:'Create alert rule for signal criteria'},
   ]},
  {id:'ia',        label:'Investment Analysis',    icon:BarChart3Icon, color:'#0A3D62', count:4,  base:'/api/v1/investment-analysis',
   endpoints:[
     {method:'GET',path:'/countries',desc:'Country analysis data — GOSA scores, all 4 layers, tier'},
     {method:'GET',path:'/country/:iso3',desc:'Full country detail — DB indicators, zones, signals'},
     {method:'POST',path:'/impact',desc:'Run impact analysis — economic projections for a scenario'},
     {method:'GET',path:'/benchmark',desc:'Benchmark multiple countries on all dimensions'},
   ]},
  {id:'gfr',       label:'GFR Assessment',         icon:Award,         color:'#74BB65', count:6,  base:'/api/v1/gfr',
   endpoints:[
     {method:'GET',path:'/',desc:'GFR assessment data for all 215 economies'},
     {method:'GET',path:'/:iso3',desc:'Full GFR profile for specific economy'},
     {method:'GET',path:'/dimensions',desc:'Dimension weights and methodology'},
     {method:'GET',path:'/tiers',desc:'Tier distribution summary'},
     {method:'GET',path:'/trends',desc:'Historical GFR score trends'},
     {method:'GET',path:'/compare',desc:'Multi-economy comparison data'},
   ]},
  {id:'analytics', label:'Analytics & Corridors',  icon:TrendUpIcon,   color:'#1B6CA8', count:8,  base:'/api/v1/analytics',
   endpoints:[
     {method:'GET',path:'/overview',desc:'Global FDI aggregates and KPIs'},
     {method:'GET',path:'/regions',desc:'FDI by region breakdown'},
     {method:'GET',path:'/sectors',desc:'FDI by sector breakdown'},
     {method:'GET',path:'/corridors',desc:'Top 10 bilateral corridors'},
     {method:'GET',path:'/corridors/:id',desc:'Specific corridor detail'},
     {method:'GET',path:'/trends',desc:'Historical FDI trend data'},
     {method:'GET',path:'/forecast',desc:'2050 foresight model data'},
     {method:'POST',path:'/scenario',desc:'Run custom scenario analysis'},
   ]},
  {id:'reports',   label:'Reports',                icon:DocIcon,       color:'#2E86AB', count:5,  base:'/api/v1/reports',
   endpoints:[
     {method:'GET', path:'/',desc:'List generated reports for user'},
     {method:'POST',path:'/generate',desc:'Generate PDF report — country/sector/corridor/impact'},
     {method:'GET', path:'/:id',desc:'Get report status and download URL'},
     {method:'DELETE',path:'/:id',desc:'Delete report from history'},
     {method:'GET', path:'/types',desc:'List available report types and credit costs'},
   ]},
  {id:'pmp',       label:'Mission Planning',       icon:Target,        color:'#74BB65', count:6,  base:'/api/v1/pmp',
   endpoints:[
     {method:'GET',path:'/destinations',desc:'Investment destination analysis for selected economies'},
     {method:'GET',path:'/opportunities',desc:'Matched investment opportunities'},
     {method:'GET',path:'/companies',desc:'Target company profiles with IMS scores'},
     {method:'GET',path:'/zones',desc:'Special investment zone data'},
     {method:'GET',path:'/gov-entities',desc:'Government entities and IPA contacts'},
     {method:'POST',path:'/dossier',desc:'Generate mission planning dossier PDF'},
   ]},
  {id:'trial',     label:'Trial & Access',         icon:Key,           color:'#696969', count:3,  base:'/api/v1/trial',
   endpoints:[
     {method:'GET',path:'/status',desc:'Current trial status — tier, days left, quotas used'},
     {method:'POST',path:'/consume',desc:'Record consumption of trial quota (report or search)'},
     {method:'POST',path:'/demo-request',desc:'Submit demo request — lifts access restriction'},
   ]},
  {id:'user',      label:'User Management',        icon:UsersIcon,     color:'#696969', count:8,  base:'/api/v1/user',
   endpoints:[
     {method:'GET', path:'/watchlists',desc:'List user watchlists'},
     {method:'POST',path:'/watchlists',desc:'Create new watchlist'},
     {method:'PUT', path:'/watchlists/:id',desc:'Update watchlist'},
     {method:'DELETE',path:'/watchlists/:id',desc:'Delete watchlist'},
     {method:'GET', path:'/alerts',desc:'List alert rules'},
     {method:'POST',path:'/alerts',desc:'Create alert rule'},
     {method:'GET', path:'/pipeline',desc:'Investment pipeline deals'},
     {method:'POST',path:'/pipeline',desc:'Add deal to pipeline'},
   ]},
  {id:'admin',     label:'Admin',                  icon:Server,        color:'#E57373', count:3,  base:'/api/v1/admin',
   endpoints:[
     {method:'GET', path:'/metrics',desc:'Platform metrics — API calls, users, reports'},
     {method:'GET', path:'/jobs',desc:'Background job status'},
     {method:'POST',path:'/jobs/:id/toggle',desc:'Pause or resume a background job'},
   ]},
  {id:'platform',  label:'Platform',               icon:Globe,         color:'#696969', count:7,  base:'/api/v1',
   endpoints:[
     {method:'GET',path:'/health',desc:'System health check'},
     {method:'GET',path:'/countries',desc:'List all 215 countries with metadata'},
     {method:'GET',path:'/sectors',desc:'List all 21 ISIC sectors'},
     {method:'GET',path:'/sources',desc:'Data source registry — all 304 sources'},
     {method:'GET',path:'/demo/request',desc:'Submit demo request (unauthenticated)'},
     {method:'POST',path:'/contact',desc:'Submit contact form'},
     {method:'GET',path:'/sitemap.xml',desc:'Platform sitemap'},
   ]},
];

// Stub icon functions
function BarChart3Icon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>; }
function Award(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="8" r="6"/><path strokeLinecap="round" d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>; }
function TrendUpIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>; }
function DocIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>; }
function Target(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>; }
function UsersIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>; }

const METHOD_C: Record<string,string> = {GET:'#74BB65',POST:'#0A3D62',PUT:'#FFB347',DELETE:'#E57373',PATCH:'#2E86AB'};

export default function ApiDocsPage() {
  const [active, setActive] = useState('ia');

  const totalRoutes = GROUPS.reduce((s,g)=>s+g.count, 0);
  const current = GROUPS.find(g=>g.id===active);

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'40px 24px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
              <Code size={16} color="#74BB65"/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>API Documentation</span>
            </div>
            <h1 style={{fontSize:'26px',fontWeight:800,color:'white',marginBottom:'4px'}}>Global FDI Monitor API</h1>
            <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>
              REST API · JWT Auth · {totalRoutes} endpoints · 100 req/min · JSON responses
            </p>
          </div>
          <div style={{display:'flex',gap:'18px'}}>
            {[[`${totalRoutes}`,'Endpoints'],['JWT','Auth'],['100/min','Rate Limit'],['v1','Version']].map(([v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:'18px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'24px',display:'grid',gridTemplateColumns:'220px 1fr',gap:'20px',alignItems:'start'}}>
        {/* Sidebar */}
        <div style={{position:'sticky',top:'80px',display:'flex',flexDirection:'column',gap:'4px'}}>
          <div style={{padding:'10px',borderRadius:'9px',background:'white',
            boxShadow:'0 1px 4px rgba(10,61,98,0.06)',marginBottom:'6px'}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'#696969',textTransform:'uppercase',
              letterSpacing:'0.06em',marginBottom:'8px'}}>Base URL</div>
            <div style={{fontFamily:'monospace',fontSize:'10px',color:'#0A3D62',
              background:'rgba(10,61,98,0.04)',padding:'6px 8px',borderRadius:'5px',lineHeight:'1.4'}}>
              https://api.fdimonitor.org
            </div>
          </div>
          {GROUPS.map(g=>{
            const Icon = g.icon;
            return (
              <button key={g.id} onClick={()=>setActive(g.id)}
                style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                  padding:'8px 12px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'12px',
                  fontWeight:600,textAlign:'left',transition:'all 0.15s',
                  background:active===g.id?g.color:'white',
                  color:active===g.id?'white':'#0A3D62',
                  boxShadow:active===g.id?`0 2px 8px ${g.color}30`:'0 1px 4px rgba(10,61,98,0.06)'}}>
                <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                  <Icon size={13} style={{color:active===g.id?'white':g.color, width:13, height:13}}/>
                  {g.label}
                </div>
                <span style={{fontSize:'10px',fontWeight:800,padding:'1px 5px',borderRadius:'6px',
                  background:active===g.id?'rgba(255,255,255,0.2)':'rgba(10,61,98,0.07)',
                  color:active===g.id?'white':'#696969'}}>{g.count}</span>
              </button>
            );
          })}
        </div>

        {/* Main */}
        {current && (
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div className="gfm-card" style={{padding:'20px'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'6px'}}>{current.label}</div>
              <div style={{fontFamily:'monospace',fontSize:'13px',color:'#74BB65',
                background:'rgba(10,61,98,0.04)',padding:'8px 12px',borderRadius:'7px',
                border:'1px solid rgba(10,61,98,0.08)'}}>
                {current.base}
              </div>
            </div>
            {/* Auth note */}
            <div style={{padding:'12px 16px',borderRadius:'9px',background:'rgba(116,187,101,0.06)',
              border:'1px solid rgba(116,187,101,0.2)',fontSize:'12px',color:'#696969',
              display:'flex',alignItems:'center',gap:'8px'}}>
              <Shield size={13} color="#74BB65"/>
              All endpoints require <code style={{background:'rgba(10,61,98,0.07)',padding:'1px 6px',borderRadius:'4px',fontSize:'11px',color:'#0A3D62'}}>Authorization: Bearer &lt;jwt&gt;</code> header unless marked public.
            </div>
            {/* Endpoints */}
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {current.endpoints.map((ep,i)=>(
                <div key={i} style={{background:'white',borderRadius:'10px',padding:'16px 18px',
                  boxShadow:'0 2px 8px rgba(10,61,98,0.06)',display:'flex',gap:'14px',alignItems:'center',flexWrap:'wrap'}}>
                  <span style={{fontSize:'11px',fontWeight:800,padding:'3px 9px',borderRadius:'5px',flexShrink:0,
                    background:`${METHOD_C[ep.method]}15`,color:METHOD_C[ep.method],fontFamily:'monospace'}}>
                    {ep.method}
                  </span>
                  <code style={{fontSize:'13px',color:'#0A3D62',fontFamily:'monospace',flex:1,minWidth:'200px'}}>
                    {current.base}{ep.path}
                  </code>
                  <span style={{fontSize:'12px',color:'#696969'}}>{ep.desc}</span>
                </div>
              ))}
            </div>
            {/* Example */}
            <div className="gfm-card" style={{padding:'18px'}}>
              <div style={{fontSize:'12px',fontWeight:700,color:'#696969',marginBottom:'10px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Example Request</div>
              <pre style={{fontFamily:'monospace',fontSize:'12px',color:'#0A3D62',
                background:'rgba(10,61,98,0.04)',padding:'14px',borderRadius:'8px',
                overflow:'auto',margin:0,lineHeight:'1.7'}}>
{`curl -X GET \\
  "${`https://api.fdimonitor.org${current.base}${current.endpoints[0].path}`}" \\
  -H "Authorization: Bearer <your-jwt-token>" \\
  -H "Content-Type: application/json"

# Response:
{
  "success": true,
  "data": { ... },
  "ts": "2026-03-20T12:00:00Z"
}`}
              </pre>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
