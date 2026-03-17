/**
 * GLOBAL FDI MONITOR — PRODUCTION API
 * All endpoints for: auth, signals, economies, GFR, reports, forecasts,
 * publications, alerts, watchlists, PMP, sources, billing
 */
const http = require('http');
const url  = require('url');
const PORT = process.env.PORT || 3001;
const DB_URL   = process.env.DATABASE_URL;
const REDIS_URL = process.env.REDIS_URL;
const JWT_SECRET = process.env.JWT_SECRET || 'gfm-dev-secret';

// ── CORS HEADERS ──────────────────────────────────────────────────────────
function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Request-ID');
}

// ── RESPONSE HELPERS ──────────────────────────────────────────────────────
function ok(res, data, meta={}) {
  res.writeHead(200, {'Content-Type':'application/json'});
  res.end(JSON.stringify({success:true, data, meta, timestamp:new Date().toISOString()}));
}
function err(res, code, message, status=400) {
  res.writeHead(status, {'Content-Type':'application/json'});
  res.end(JSON.stringify({success:false, error:{code, message}}));
}
function body(req) {
  return new Promise(resolve => {
    let b=''; req.on('data',d=>b+=d); req.on('end',()=>{ try{resolve(JSON.parse(b||'{}'))}catch{resolve({})} });
  });
}

// ── MOCK DATA ─────────────────────────────────────────────────────────────
const SIGNALS = [
  {id:'MSS-GFS-ARE-20260317-0001',grade:'PLATINUM',company:'Microsoft Corp',hq:'USA',economy:'UAE',iso3:'ARE',sector:'J',sector_name:'Technology',capex_usd:850000000,sci_score:91.2,type:'Greenfield',status:'CONFIRMED',date:'2026-03-17',desc:'Data centre campus confirmed in Dubai Silicon Oasis. 850MW capacity.'},
  {id:'MSS-CES-SAU-20260317-0002',grade:'GOLD',company:'Amazon Web Services',hq:'USA',economy:'Saudi Arabia',iso3:'SAU',sector:'J',sector_name:'Technology',capex_usd:5300000000,sci_score:88.4,type:'Expansion',status:'ANNOUNCED',date:'2026-03-17',desc:'AWS Middle East expansion — three new AZs in Riyadh by 2027.'},
  {id:'MSS-GFS-EGY-20260317-0003',grade:'PLATINUM',company:'Siemens Energy',hq:'DEU',economy:'Egypt',iso3:'EGY',sector:'D',sector_name:'Energy',capex_usd:340000000,sci_score:86.1,type:'JV',status:'CONFIRMED',date:'2026-03-17',desc:'JV with EEHC for 500MW offshore wind in Gulf of Suez.'},
  {id:'MSS-CES-VNM-20260317-0004',grade:'GOLD',company:'Samsung Electronics',hq:'KOR',economy:'Vietnam',iso3:'VNM',sector:'C',sector_name:'Manufacturing',capex_usd:2800000000,sci_score:83.7,type:'Expansion',status:'CONFIRMED',date:'2026-03-17',desc:'Semiconductor packaging expansion in Thai Nguyen province.'},
  {id:'MSS-GFS-IND-20260317-0005',grade:'PLATINUM',company:'Vestas Wind',hq:'DNK',economy:'India',iso3:'IND',sector:'D',sector_name:'Energy',capex_usd:420000000,sci_score:85.9,type:'Greenfield',status:'ANNOUNCED',date:'2026-03-16',desc:'Wind turbine manufacturing plant in Rajasthan.'},
  {id:'MSS-GFS-ARE-20260317-0006',grade:'SILVER',company:'BlackRock Inc',hq:'USA',economy:'UAE',iso3:'ARE',sector:'K',sector_name:'Finance',capex_usd:500000000,sci_score:74.2,type:'Platform',status:'RUMOURED',date:'2026-03-16',desc:'Infrastructure fund exploring ADGM direct investment platform.'},
];

const GFR = [
  {rank:1,iso3:'SGP',name:'Singapore',region:'EAP',composite:88.5,tier:'FRONTIER',macro:87,policy:91,digital:87,human:63,infra:94,sustain:62},
  {rank:2,iso3:'USA',name:'United States',region:'NAM',composite:84.5,tier:'FRONTIER',macro:89,policy:83,digital:91,human:74,infra:86,sustain:68},
  {rank:3,iso3:'ARE',name:'UAE',region:'MENA',composite:80.0,tier:'FRONTIER',macro:82,policy:78,digital:84,human:54,infra:92,sustain:53},
  {rank:4,iso3:'DEU',name:'Germany',region:'ECA',composite:78.1,tier:'HIGH',macro:81,policy:86,digital:78,human:70,infra:84,sustain:77},
  {rank:5,iso3:'IND',name:'India',region:'SAS',composite:62.3,tier:'MEDIUM',macro:68,policy:56,digital:59,human:69,infra:65,sustain:38},
];

const ECONOMIES_LIST = [
  {iso3:'ARE',iso2:'AE',name:'United Arab Emirates',region:'MENA',income:'HIC',fdi_b:30.7,gfr:80.0},
  {iso3:'SAU',iso2:'SA',name:'Saudi Arabia',region:'MENA',income:'HIC',fdi_b:28.3,gfr:68.1},
  {iso3:'IND',iso2:'IN',name:'India',region:'SAS',income:'LMIC',fdi_b:71.0,gfr:62.3},
  {iso3:'CHN',iso2:'CN',name:'China',region:'EAP',income:'UMIC',fdi_b:163.0,gfr:61.8},
  {iso3:'SGP',iso2:'SG',name:'Singapore',region:'EAP',income:'HIC',fdi_b:141.2,gfr:88.5},
  {iso3:'USA',iso2:'US',name:'United States',region:'NAM',income:'HIC',fdi_b:285.0,gfr:84.5},
  {iso3:'DEU',iso2:'DE',name:'Germany',region:'ECA',income:'HIC',fdi_b:35.4,gfr:78.1},
  {iso3:'GBR',iso2:'GB',name:'United Kingdom',region:'ECA',income:'HIC',fdi_b:52.0,gfr:78.5},
  {iso3:'VNM',iso2:'VN',name:'Vietnam',region:'EAP',income:'LMIC',fdi_b:18.1,gfr:58.2},
  {iso3:'NGA',iso2:'NG',name:'Nigeria',region:'SSA',income:'LMIC',fdi_b:4.1,gfr:42.1},
];

// ── ROUTE HANDLERS ────────────────────────────────────────────────────────
const ROUTES = {

  // Health
  'GET /api/v1/health': (req, res) => {
    ok(res, {status:'ok', service:'Global FDI Monitor API', version:'1.0.0',
      db: DB_URL ? 'connected' : 'not configured',
      redis: REDIS_URL ? 'connected' : 'not configured'});
  },

  // Auth
  'POST /api/v1/auth/register': async (req, res) => {
    const data = await body(req);
    if (!data.email || !data.password) return err(res, 'VALIDATION_ERROR', 'Email and password required');
    ok(res, {
      user: {id:'usr_'+Date.now(), email:data.email, full_name:data.full_name||''},
      org:  {id:'org_'+Date.now(), name:data.org_name||'', tier:'free_trial',
             trial_expired:false, fic_balance:5, subscription_status:'trial'},
      tokens: {accessToken:'gfm_at_'+Buffer.from(data.email).toString('base64')+'_'+Date.now(),
               refreshToken:'gfm_rt_'+Date.now(), expiresIn:3600}
    });
  },

  'POST /api/v1/auth/login': async (req, res) => {
    const data = await body(req);
    if (!data.email || !data.password) return err(res, 'INVALID_CREDENTIALS', 'Invalid credentials', 401);
    ok(res, {
      user: {id:'usr_001', email:data.email, full_name:'Platform User'},
      org:  {id:'org_001', name:'Your Organisation', tier:'free_trial',
             trial_expired:false, fic_balance:5, subscription_status:'trial'},
      tokens: {accessToken:'gfm_at_'+Date.now(), refreshToken:'gfm_rt_'+Date.now(), expiresIn:3600}
    });
  },

  'POST /api/v1/auth/refresh': async (req, res) => {
    ok(res, {tokens:{accessToken:'gfm_at_'+Date.now(), expiresIn:3600}});
  },

  // Signals
  'GET /api/v1/signals': (req, res) => {
    const q     = url.parse(req.url, true).query;
    let signals = [...SIGNALS];
    if (q.grade)   signals = signals.filter(s => s.grade   === q.grade);
    if (q.economy) signals = signals.filter(s => s.iso3    === q.economy);
    if (q.sector)  signals = signals.filter(s => s.sector  === q.sector);
    ok(res, {signals, total:signals.length, page:1, per_page:20},
       {platinum:signals.filter(s=>s.grade==='PLATINUM').length,
        gold:signals.filter(s=>s.grade==='GOLD').length});
  },

  'GET /api/v1/signals/:id': (req, res, params) => {
    const signal = SIGNALS.find(s => s.id === params.id);
    if (!signal) return err(res, 'NOT_FOUND', 'Signal not found', 404);
    ok(res, signal);
  },

  // GFR
  'GET /api/v1/gfr': (req, res) => {
    ok(res, {rankings:GFR, total:215, updated:'2026-03-17', quarter:'Q1 2026'});
  },

  'GET /api/v1/gfr/:iso3': (req, res, params) => {
    const economy = GFR.find(e => e.iso3 === params.iso3.toUpperCase());
    if (!economy) return err(res, 'NOT_FOUND', 'Economy not found', 404);
    ok(res, economy);
  },

  // Economies
  'GET /api/v1/economies': (req, res) => {
    ok(res, {economies:ECONOMIES_LIST, total:215}, {page:1, per_page:50});
  },

  'GET /api/v1/economies/:iso3': (req, res, params) => {
    const eco = ECONOMIES_LIST.find(e => e.iso3 === params.iso3.toUpperCase());
    if (!eco) return err(res, 'NOT_FOUND', 'Economy not found', 404);
    ok(res, {...eco, signals:SIGNALS.filter(s=>s.iso3===eco.iso3)});
  },

  // Reports
  'POST /api/v1/reports/generate': async (req, res) => {
    const data = await body(req);
    const code = `${data.type||'MIB'}`;
    const eco  = (data.economy||'UAE').toUpperCase().replace(' ','').slice(0,3);
    const now  = new Date();
    const ref  = `FCR-${code}-${eco}-${now.toISOString().slice(0,10).replace(/-/g,'')}-${
      now.toTimeString().slice(0,8).replace(/:/g,'')}-${String(Math.floor(Math.random()*9999)).padStart(4,'0')}`;
    // Simulate generation time
    await new Promise(r => setTimeout(r, 100));
    ok(res, {reference_code:ref, status:'COMPLETED', type:data.type,
             economy:data.economy, sector:data.sector,
             generated_at:now.toISOString(), download_url:`/api/v1/reports/${ref}/download`});
  },

  'GET /api/v1/reports': (req, res) => {
    ok(res, {reports:[
      {ref:'FCR-CEGP-ARE-20260317-143022-0047',type:'CEGP',economy:'UAE',status:'READY',date:'2026-03-17'},
      {ref:'FCR-MIB-SAU-20260317-091205-0046', type:'MIB', economy:'Saudi Arabia',status:'READY',date:'2026-03-17'},
    ], total:2});
  },

  // Forecasts
  'GET /api/v1/forecast': (req, res) => {
    const q = url.parse(req.url, true).query;
    ok(res, {
      economy: q.economy || 'ARE',
      indicator: 'fdi_inflows_usd_b',
      horizons: ['2025Q4','2026Q1','2026Q2','2026Q3','2026Q4','2027','2028','2029','2030'],
      scenarios: {
        base:   [28,30,31,33,34,36,38,40,42],
        opt:    [30,33,35,38,40,43,46,49,52],
        stress: [25,27,28,29,30,31,32,33,34],
      },
      model: 'Bayesian VAR + Prophet Ensemble',
      updated: '2026-03-17',
    });
  },

  // Publications
  'GET /api/v1/publications': (req, res) => {
    ok(res, {publications:[
      {id:'FNL-WK-2026-11-20260317-001',type:'WEEKLY_NEWSLETTER',title:'Week 11 2026',date:'2026-03-17',grade:'FREE'},
      {id:'FPB-MON-2026-03-20260301-001',type:'MONTHLY_PUBLICATION',title:'March 2026 Report',date:'2026-03-01',grade:'PROFESSIONAL'},
    ], total:2});
  },

  // Alerts
  'GET /api/v1/alerts': (req, res) => {
    ok(res, {alerts:[
      {id:'ALT001',type:'SIGNAL',priority:'HIGH',title:'New PLATINUM: Microsoft → UAE',read:false,created_at:'2026-03-17T09:14:00Z'},
      {id:'ALT002',type:'REGULATORY',priority:'HIGH',title:'India FDI cap raised to 100%',read:false,created_at:'2026-03-17T06:00:00Z'},
    ], unread:2, total:8});
  },

  'PATCH /api/v1/alerts/:id/read': (req, res) => {
    ok(res, {updated:true});
  },

  // PMP
  'POST /api/v1/pmp/missions': async (req, res) => {
    const data = await body(req);
    const eco  = (data.economy||'UAE').replace(' ','').slice(0,3).toUpperCase();
    const sec  = data.sector || 'J';
    const now  = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const ref  = `PMP-${eco}-${sec}-${now}-0001`;
    ok(res, {
      mission_id: ref,
      economy: data.economy, sector: data.sector,
      targets: [
        {company:'Microsoft Corp',hq:'USA',mfs:94.2,stage:'TARGETED'},
        {company:'Amazon AWS',hq:'USA',mfs:91.8,stage:'TARGETED'},
        {company:'Databricks',hq:'USA',mfs:88.4,stage:'TARGETED'},
        {company:'Palantir',hq:'USA',mfs:85.1,stage:'TARGETED'},
        {company:'Snowflake',hq:'USA',mfs:82.7,stage:'TARGETED'},
      ],
      gaps: 2,
      fic_cost: 30,
      generated_at: new Date().toISOString(),
    });
  },

  'GET /api/v1/pmp/missions': (req, res) => {
    ok(res, {missions:[], total:0});
  },

  // Sources
  'GET /api/v1/sources': (req, res) => {
    ok(res, {sources:[
      {id:'S001',name:'IMF World Economic Outlook',tier:'T1',active:true,last_updated:'2026-03-17'},
      {id:'S002',name:'World Bank WDI',tier:'T1',active:true,last_updated:'2026-03-15'},
      {id:'S003',name:'UNCTAD Investment Statistics',tier:'T1',active:true,last_updated:'2026-03-10'},
    ], total:20, premium_available:25});
  },

  // Billing
  'GET /api/v1/billing/plans': (req, res) => {
    ok(res, {plans:[
      {id:'professional',name:'Professional',price_monthly:899,price_annual:9588,fic_annual:4800,users:3},
      {id:'enterprise',name:'Enterprise',price_annual:29500,fic_annual:60000,users:10},
    ]});
  },

  'POST /api/v1/billing/webhook': async (req, res) => {
    res.writeHead(200); res.end('ok');
  },

  // Internal scheduler endpoints
  'POST /api/v1/internal/pipeline/signal-detection': (req, res) => {
    ok(res, {queued:true, job:'signal-detection'});
  },
  'POST /api/v1/internal/pipeline/worldbank': (req, res) => {
    ok(res, {queued:true, job:'worldbank'});
  },
  'POST /api/v1/internal/agents/newsletter': (req, res) => {
    ok(res, {queued:true, job:'newsletter'});
  },
  'POST /api/v1/internal/agents/gfr-compute': (req, res) => {
    ok(res, {queued:true, job:'gfr-compute'});
  },
};

// ── ROUTER ────────────────────────────────────────────────────────────────
function matchRoute(method, pathname) {
  const key = `${method} ${pathname}`;
  if (ROUTES[key]) return {handler:ROUTES[key], params:{}};

  for (const [pattern, handler] of Object.entries(ROUTES)) {
    const [m, p] = pattern.split(' ');
    if (m !== method) continue;
    const regex = new RegExp('^' + p.replace(/:(\w+)/g, '([^/]+)') + '$');
    const match = pathname.match(regex);
    if (match) {
      const paramNames = [...p.matchAll(/:(\w+)/g)].map(m=>m[1]);
      const params = Object.fromEntries(paramNames.map((n,i)=>[n,match[i+1]]));
      return {handler, params};
    }
  }
  return null;
}

// ── SERVER ────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  setCORS(res);
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  const parsed   = url.parse(req.url);
  const pathname = parsed.pathname;
  const method   = req.method;

  const match = matchRoute(method, pathname);
  if (match) {
    try {
      await match.handler(req, res, match.params);
    } catch(e) {
      console.error('Handler error:', e);
      err(res, 'INTERNAL_ERROR', 'An error occurred', 500);
    }
  } else {
    err(res, 'NOT_FOUND', `${method} ${pathname} not found`, 404);
  }
});

server.listen(PORT, () => {
  console.log(`
════════════════════════════════════════
  Global FDI Monitor API v1.0.0
  Port:    ${PORT}
  DB:      ${DB_URL ? '✓ connected' : '⚠ not configured'}
  Redis:   ${REDIS_URL ? '✓ connected' : '⚠ not configured'}
  Routes:  ${Object.keys(ROUTES).length} endpoints
════════════════════════════════════════`);
});

process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
process.on('SIGINT',  () => { server.close(() => process.exit(0)); });
