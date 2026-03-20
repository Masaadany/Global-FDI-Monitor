import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'API Documentation — FDI Monitor',
  description: 'FDI Monitor REST API: 64 endpoints, WebSocket, JWT auth, rate limiting, PDF reports.',
};

const API_GROUPS = [
  { group:'Authentication', color:'#22c55e', endpoints:[
    {m:'POST',p:'/api/v1/auth/register',    d:'Register new user + organisation',     auth:false},
    {m:'POST',p:'/api/v1/auth/login',       d:'Authenticate and get JWT token',       auth:false},
    {m:'POST',p:'/api/v1/auth/logout',      d:'Invalidate current session token',     auth:true },
    {m:'GET', p:'/api/v1/auth/me',          d:'Get current user profile',             auth:true },
    {m:'PUT', p:'/api/v1/auth/refresh',     d:'Refresh JWT (returns new 15-min token)',auth:true },
    {m:'POST',p:'/api/v1/auth/reset-request',d:'Request password reset email',        auth:false},
  ]},
  { group:'FDI Signals', color:'#74BB65', endpoints:[
    {m:'GET', p:'/api/v1/signals',          d:'List signals (grade, iso3, sector filters)',auth:true},
    {m:'GET', p:'/api/v1/signals/:ref',     d:'Get signal by reference code',         auth:true},
    {m:'GET', p:'/api/v1/search',           d:'Search signals, GFR, companies',       auth:true},
  ]},
  { group:'GFR Rankings', color:'#0A3D62', endpoints:[
    {m:'GET', p:'/api/v1/gfr',             d:'List GFR rankings (limit, iso3, tier)', auth:true},
    {m:'GET', p:'/api/v1/gfr/:iso3',       d:'Get GFR score for one economy',        auth:true},
    {m:'GET', p:'/api/v1/gfr/methodology', d:'GFR weights, formula, tier thresholds',auth:false},
  ]},
  { group:'Analytics & Forecast', color:'#74BB65', endpoints:[
    {m:'GET', p:'/api/v1/analytics',        d:'FDI trend data, regional/sector breakdown',auth:true},
    {m:'GET', p:'/api/v1/forecast',         d:'P10/P50/P90 projections by economy',   auth:true},
    {m:'GET', p:'/api/v1/corridors',        d:'Bilateral investment corridor data',   auth:true},
    {m:'POST',p:'/api/v1/scenario/run',     d:'Run Monte Carlo scenario with sliders',auth:true},
  ]},
  { group:'Company Intelligence', color:'#696969', endpoints:[
    {m:'GET', p:'/api/v1/companies',        d:'List companies (grade, sector filter)', auth:true},
    {m:'GET', p:'/api/v1/companies/:cic',   d:'Get company intelligence profile',     auth:true},
    {m:'GET', p:'/api/v1/market-insights',  d:'Editorial intelligence articles',      auth:true},
    {m:'GET', p:'/api/v1/publications',     d:'Publication library',                  auth:true},
  ]},
  { group:'Reports', color:'#EF4444', endpoints:[
    {m:'POST',p:'/api/v1/reports/generate', d:'Generate PDF report (subscription required)',auth:true},
    {m:'GET', p:'/api/v1/reports',          d:'List generated reports for user',      auth:true},
    {m:'POST',p:'/api/v1/pmp/dossier',      d:'Generate Mission Planning dossier PDF',auth:true},
  ]},
  { group:'Pipeline CRM', color:'#0A66C2', endpoints:[
    {m:'GET', p:'/api/v1/pipeline/deals',   d:'List investment pipeline deals',       auth:true},
    {m:'PATCH',p:'/api/v1/pipeline/deals/:id',d:'Update deal stage and probability', auth:true},
    {m:'GET', p:'/api/v1/pipeline/summary', d:'Pipeline stage count + CapEx total',  auth:true},
  ]},
  { group:'User & Account', color:'#696969', endpoints:[
    {m:'GET', p:'/api/v1/watchlists',       d:'List user watchlists',                 auth:true},
    {m:'POST',p:'/api/v1/watchlists',       d:'Create watchlist',                     auth:true},
    {m:'DELETE',p:'/api/v1/watchlists/:id', d:'Delete watchlist',                     auth:true},
    {m:'GET', p:'/api/v1/alerts',           d:'List user alerts',                     auth:true},
    {m:'PUT', p:'/api/v1/alerts/:id/read',  d:'Mark alert as read',                  auth:true},
    {m:'GET', p:'/api/v1/settings',         d:'Get user preferences',                 auth:true},
    {m:'PATCH',p:'/api/v1/settings',        d:'Update user preferences',              auth:true},
    {m:'GET', p:'/api/v1/subscription',     d:'Get subscription tier + status',       auth:true},
    {m:'POST',p:'/api/v1/billing/subscribe',d:'Initiate Stripe checkout session',     auth:true},
  ]},
  { group:'Admin', color:'#EF4444', endpoints:[
    {m:'GET', p:'/api/v1/admin/metrics',    d:'Platform KPIs (admin only)',           auth:true},
    {m:'GET', p:'/api/v1/admin/users',      d:'User list (admin only)',               auth:true},
    {m:'POST',p:'/api/v1/admin/jobs/:id/toggle',d:'Toggle pipeline job (admin only)', auth:true},
  ]},
  { group:'Platform', color:'#22c55e', endpoints:[
    {m:'GET', p:'/api/v1/health',           d:'Service health check',                 auth:false},
    {m:'GET', p:'/api/v1/sectors',          d:'All investment sectors with live FDI data',   auth:false},
    {m:'GET', p:'/api/v1/faq',              d:'FAQ sections and question count',      auth:false},
    {m:'POST',p:'/api/v1/contact',          d:'Submit contact form',                  auth:false},
  ]},
];

const METHOD_COLORS: Record<string,string> = {
  GET:'#22c55e', POST:'#74BB65', PUT:'#0A3D62', PATCH:'#74BB65', DELETE:'#EF4444'
};

export default function APIDocsPage() {
  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>
      <section className="gfm-hero px-6 py-12">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#74BB65'}}>Developer Reference</div>
          <h1 className="text-3xl font-extrabold mb-2" style={{color:'#0A3D62'}}>API Documentation</h1>
          <p className="text-sm max-w-2xl" style={{color:'#696969'}}>REST API · JWT Authentication · WebSocket live feed · 500 req/min (Professional)</p>
          <div className="flex gap-8 mt-5 flex-wrap">
            {[['64','Endpoints'],['JWT','Auth'],['500/min','Rate Limit'],['WebSocket','Live Feed'],['gzip','Compression']].map(([v,l])=>(
              <div key={l}><div className="text-xl font-extrabold font-data" style={{color:'#74BB65'}}>{v}</div><div className="text-xs mt-0.5" style={{color:'#696969'}}>{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 py-6 grid lg:grid-cols-4 gap-6">
        {/* Quick-start sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="gfm-card p-4">
            <div className="font-extrabold text-xs uppercase tracking-widest mb-3" style={{color:'#696969'}}>Base URL</div>
            <div className="font-data text-xs p-2 rounded-lg break-all" style={{background:'rgba(10,61,98,0.04)0.8)',color:'#0A3D62'}}>
              https://api.fdimonitor.org
            </div>
          </div>
          <div className="gfm-card p-4">
            <div className="font-extrabold text-xs uppercase tracking-widest mb-3" style={{color:'#696969'}}>Authentication</div>
            <div className="font-data text-xs p-2 rounded-lg" style={{background:'rgba(10,61,98,0.04)0.8)',color:'#0A3D62'}}>
              Authorization: Bearer {'<token>'}
            </div>
            <div className="text-xs mt-2" style={{color:'#696969'}}>Tokens expire in 15 minutes. Use <span className="font-data" style={{color:'#696969'}}>PUT /auth/refresh</span> to renew.</div>
          </div>
          <div className="gfm-card p-4">
            <div className="font-extrabold text-xs uppercase tracking-widest mb-3" style={{color:'#696969'}}>WebSocket</div>
            <div className="font-data text-xs p-2 rounded-lg break-all" style={{background:'rgba(10,61,98,0.04)0.8)',color:'#0A3D62'}}>
              wss://api.fdimonitor.org/ws
            </div>
            <div className="text-xs mt-2" style={{color:'#696969'}}>Streams live signal events. Authenticate via query param: <span className="font-data">?token=Bearer_JWT</span></div>
          </div>
          <div className="gfm-card p-4">
            <div className="font-extrabold text-xs uppercase tracking-widest mb-3" style={{color:'#696969'}}>Rate Limiting</div>
            <div className="space-y-1 text-xs" style={{color:'#696969'}}>
              <div>Professional: <span style={{color:'#0A3D62'}}>500 req/min</span></div>
              <div>Enterprise: <span style={{color:'#0A3D62'}}>Custom SLA</span></div>
              <div>Free Trial: <span style={{color:'#EF4444'}}>No API access</span></div>
            </div>
          </div>
        </div>

        {/* Endpoint groups */}
        <div className="lg:col-span-3 space-y-5">
          {API_GROUPS.map(group=>(
            <div key={group.group} className="gfm-card overflow-hidden">
              <div className="px-5 py-3 border-b flex items-center gap-2" style={{borderBottomColor:'rgba(10,61,98,0.1)',borderLeft:`3px solid ${group.color}`}}>
                <span className="font-extrabold text-sm" style={{color:group.color}}>{group.group}</span>
                <span className="text-xs" style={{color:'#696969'}}>{group.endpoints.length} endpoints</span>
              </div>
              <div className="divide-y" style={{borderColor:'rgba(10,61,98,0.06)'}}>
                {group.endpoints.map(ep=>(
                  <div key={ep.p} className="px-5 py-3 flex items-center gap-3 hover:bg-white/2 transition-all">
                    <span className="text-xs font-extrabold w-14 flex-shrink-0 font-data" style={{color:METHOD_COLORS[ep.m]||'#696969'}}>{ep.m}</span>
                    <span className="text-xs font-data flex-1 min-w-0 truncate" style={{color:'#0A3D62'}}>{ep.p}</span>
                    <span className="text-xs hidden md:block flex-1" style={{color:'#696969'}}>{ep.d}</span>
                    {ep.auth
                      ? <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0" style={{background:'rgba(116,187,101,0.1)',color:'#74BB65'}}>🔒 auth</span>
                      : <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0" style={{background:'rgba(34,197,94,0.1)',color:'#22c55e'}}>public</span>
                    }
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Response format */}
          <div className="gfm-card p-5">
            <div className="font-extrabold text-sm mb-3" style={{color:'#0A3D62'}}>Response Format</div>
            <pre className="text-xs overflow-x-auto p-4 rounded-xl" style={{background:'rgba(10,61,98,0.04)0.8)',color:'#0A3D62'}}>
{`{
  "data": { ... },   // Success payload
  "meta": {          // Optional pagination
    "page": 1, "limit": 20, "total": 218
  }
}

// Error response
{
  "error": "UNAUTHORIZED",
  "message": "Auth required",
  "status": 401
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
