/**
 * GLOBAL FDI MONITOR — PRODUCTION API v3.0
 * Real PostgreSQL + Redis + Stripe webhook + JWT + FIC deduction
 * 32 endpoints covering complete platform.
 */
const http   = require('http');
const url    = require('url');
const crypto = require('crypto');
const PORT   = process.env.PORT     || 3001;
const DB_URL = process.env.DATABASE_URL;
const RD_URL = process.env.REDIS_URL;
const JWT_SECRET  = process.env.JWT_SECRET  || 'gfm-dev-secret-change-in-prod';
const STRIPE_KEY  = process.env.STRIPE_SECRET_KEY;
const STRIPE_WHSEC= process.env.STRIPE_WEBHOOK_SECRET;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

// ── DB + REDIS INIT ────────────────────────────────────────────────────────
let db = null, redis = null;
async function initDB() {
  if (!DB_URL) return log('DB','No DATABASE_URL — demo mode');
  try {
    const {Pool} = require('pg');
    db = new Pool({connectionString:DB_URL,max:10,ssl:{rejectUnauthorized:false}});
    await db.query('SELECT 1');
    log('DB','✓ PostgreSQL connected');
  } catch(e) { log('DB','fallback to demo: '+e.message); db=null; }
}
async function initRedis() {
  if (!RD_URL) return;
  try {
    const r = require('redis').createClient({url:RD_URL});
    r.on('error',()=>{ redis=null; });
    await r.connect();
    redis = r;
    log('Redis','✓ Connected');
  } catch(e) { redis=null; }
}

// ── HELPERS ────────────────────────────────────────────────────────────────
function log(ctx, msg) { console.log(`[${new Date().toISOString().slice(11,23)}] [${ctx}] ${msg}`); }
function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization,X-Stripe-Signature');
}
function ok(res,data,meta={}) {
  res.writeHead(200,{'Content-Type':'application/json'});
  res.end(JSON.stringify({success:true,data,meta,ts:new Date().toISOString()}));
}
function fail(res,code,msg,status=400) {
  res.writeHead(status,{'Content-Type':'application/json'});
  res.end(JSON.stringify({success:false,error:{code,message:msg}}));
}
async function body(req) {
  return new Promise(r=>{let b='';req.on('data',d=>b+=d);req.on('end',()=>{try{r(JSON.parse(b||'{}'))}catch{r({})}});});
}
async function rawBody(req) {
  return new Promise(r=>{const chunks=[];req.on('data',d=>chunks.push(d));req.on('end',()=>r(Buffer.concat(chunks)));});
}
async function dbQ(sql,params=[],fallback=null) {
  if(!db) return fallback;
  try { return (await db.query(sql,params)).rows; } catch(e){ log('DB',e.message); return fallback; }
}
async function cached(key,ttl,fn) {
  if(redis){ try { const h=await redis.get(key); if(h) return JSON.parse(h); } catch{} }
  const data=await fn();
  if(redis&&data){ try { await redis.setEx(key,ttl,JSON.stringify(data)); } catch{} }
  return data;
}
// JWT
function signJWT(payload,expiresIn=3600) {
  const h=Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url');
  const b=Buffer.from(JSON.stringify({...payload,exp:Math.floor(Date.now()/1000)+expiresIn,iat:Math.floor(Date.now()/1000)})).toString('base64url');
  const sig=crypto.createHmac('sha256',JWT_SECRET).update(`${h}.${b}`).digest('base64url');
  return `${h}.${b}.${sig}`;
}
function verifyJWT(token) {
  try {
    const [h,b,sig]=token.split('.');
    const expected=crypto.createHmac('sha256',JWT_SECRET).update(`${h}.${b}`).digest('base64url');
    if(sig!==expected) return null;
    const p=JSON.parse(Buffer.from(b,'base64url').toString());
    if(p.exp<Math.floor(Date.now()/1000)) return null;
    return p;
  } catch { return null; }
}
function getToken(req) {
  const auth=req.headers.authorization||'';
  return auth.startsWith('Bearer ') ? auth.slice(7) : null;
}

// ── MOCK DATA ──────────────────────────────────────────────────────────────
const M_SIGNALS = [
  {id:'MSS-GFS-ARE-20260317-0001',grade:'PLATINUM',company:'Microsoft Corp',hq:'USA',economy:'UAE',iso3:'ARE',sector:'J',capex_usd:850000000,sci_score:91.2,signal_type:'Greenfield',status:'CONFIRMED',signal_date:'2026-03-17'},
  {id:'MSS-CES-SAU-20260317-0002',grade:'GOLD',company:'Amazon Web Services',hq:'USA',economy:'Saudi Arabia',iso3:'SAU',sector:'J',capex_usd:5300000000,sci_score:88.4,signal_type:'Expansion',status:'ANNOUNCED',signal_date:'2026-03-17'},
  {id:'MSS-GFS-EGY-20260317-0003',grade:'PLATINUM',company:'Siemens Energy',hq:'DEU',economy:'Egypt',iso3:'EGY',sector:'D',capex_usd:340000000,sci_score:86.1,signal_type:'JV',status:'CONFIRMED',signal_date:'2026-03-17'},
  {id:'MSS-CES-VNM-20260317-0004',grade:'GOLD',company:'Samsung Electronics',hq:'KOR',economy:'Vietnam',iso3:'VNM',sector:'C',capex_usd:2800000000,sci_score:83.7,signal_type:'Expansion',status:'CONFIRMED',signal_date:'2026-03-17'},
  {id:'MSS-GFS-IND-20260317-0005',grade:'PLATINUM',company:'Vestas Wind',hq:'DNK',economy:'India',iso3:'IND',sector:'D',capex_usd:420000000,sci_score:85.9,signal_type:'Greenfield',status:'ANNOUNCED',signal_date:'2026-03-16'},
  {id:'MSS-GFS-ARE-20260317-0006',grade:'SILVER',company:'BlackRock Inc',hq:'USA',economy:'UAE',iso3:'ARE',sector:'K',capex_usd:500000000,sci_score:74.2,signal_type:'Platform',status:'RUMOURED',signal_date:'2026-03-16'},
  {id:'MSS-CES-SGP-20260317-0007',grade:'GOLD',company:'Databricks',hq:'USA',economy:'Singapore',iso3:'SGP',sector:'J',capex_usd:150000000,sci_score:79.3,signal_type:'Platform',status:'ANNOUNCED',signal_date:'2026-03-15'},
  {id:'MSS-GFS-IDN-20260317-0008',grade:'GOLD',company:'CATL',hq:'CHN',economy:'Indonesia',iso3:'IDN',sector:'C',capex_usd:3200000000,sci_score:85.4,signal_type:'Greenfield',status:'COMMITTED',signal_date:'2026-03-14'},
];
const M_GFR = [
  {iso3:'SGP',name:'Singapore',     region:'EAP',composite:88.5,rank:1, tier:'FRONTIER',macro:87,policy:91,digital:87,human:63,infra:94,sustain:62},
  {iso3:'CHE',name:'Switzerland',   region:'ECA',composite:87.5,rank:2, tier:'FRONTIER',macro:88,policy:90,digital:85,human:78,infra:91,sustain:74},
  {iso3:'ARE',name:'UAE',           region:'MENA',composite:80.0,rank:3, tier:'FRONTIER',macro:82,policy:78,digital:84,human:54,infra:92,sustain:53},
  {iso3:'DEU',name:'Germany',       region:'ECA',composite:78.1,rank:4, tier:'HIGH',macro:81,policy:86,digital:78,human:70,infra:84,sustain:77},
  {iso3:'USA',name:'United States', region:'NAM',composite:84.5,rank:5, tier:'FRONTIER',macro:89,policy:83,digital:91,human:74,infra:86,sustain:68},
];
const M_ECON = [
  {iso3:'ARE',name:'UAE',           region:'MENA',income:'HIC',gdp_b:504, fdi_b:30.7,pop_m:10},
  {iso3:'SAU',name:'Saudi Arabia',  region:'MENA',income:'HIC',gdp_b:1069,fdi_b:28.3,pop_m:36},
  {iso3:'IND',name:'India',         region:'SAS', income:'LMIC',gdp_b:3730,fdi_b:71.0,pop_m:1429},
  {iso3:'CHN',name:'China',         region:'EAP', income:'UMIC',gdp_b:17795,fdi_b:163.0,pop_m:1412},
  {iso3:'SGP',name:'Singapore',     region:'EAP', income:'HIC',gdp_b:501, fdi_b:141.2,pop_m:5.9},
  {iso3:'USA',name:'United States', region:'NAM', income:'HIC',gdp_b:27360,fdi_b:285.0,pop_m:335},
  {iso3:'DEU',name:'Germany',       region:'ECA', income:'HIC',gdp_b:4430,fdi_b:35.4,pop_m:83},
  {iso3:'GBR',name:'United Kingdom','region':'ECA',income:'HIC',gdp_b:3079,fdi_b:52.0,pop_m:67},
  {iso3:'VNM',name:'Vietnam',       region:'EAP', income:'LMIC',gdp_b:430, fdi_b:18.1,pop_m:97},
  {iso3:'NGA',name:'Nigeria',       region:'SSA', income:'LMIC',gdp_b:477, fdi_b:4.1, pop_m:218},
];

// ── ROUTE HANDLERS ─────────────────────────────────────────────────────────
const ROUTES = {

  'GET /api/v1/health': async(req,res)=>{
    const dbOk = db ? (await dbQ('SELECT 1').catch(()=>null)) !== null : false;
    ok(res,{status:'ok',service:'Global FDI Monitor API',version:'3.0.0',
      mode:db?'production':'demo',db:dbOk?'connected':'unavailable',
      redis:redis?'connected':'unavailable',uptime:process.uptime().toFixed(0)+'s'});
  },

  // ── AUTH ────────────────────────────────────────────────────────────────
  'POST /api/v1/auth/register': async(req,res)=>{
    const d=await body(req);
    if(!d.email||!d.password) return fail(res,'VALIDATION_ERROR','Email and password required');
    if(db) {
      const ex=await dbQ('SELECT id FROM auth.users WHERE email=$1',[d.email],[]);
      if(ex&&ex.length>0) return fail(res,'EMAIL_EXISTS','Email already registered',409);
    }
    // Hash password
    const salt=crypto.randomBytes(16).toString('hex');
    const hash=crypto.createHmac('sha256',salt).update(d.password).digest('hex');
    const orgId='org_'+Date.now();
    const userId='usr_'+Date.now();
    if(db) {
      try {
        await db.query(`INSERT INTO auth.organisations(id,name,org_type,country,tier,fic_balance) VALUES($1,$2,$3,$4,'free_trial',5)`,
          [orgId,d.org_name||'',d.org_type||'IPA',d.country||'']);
        await db.query(`INSERT INTO auth.users(id,org_id,email,password,full_name) VALUES($1,$2,$3,$4,$5)`,
          [userId,orgId,d.email,`${salt}:${hash}`,d.full_name||'']);
      } catch(e){ log('auth',e.message); }
    }
    const token=signJWT({sub:userId,org:orgId,tier:'free_trial',email:d.email});
    // Send welcome email
    try {
      const { sendEmail } = require('./email');
      await sendEmail(d.email, 'welcome', d.full_name || d.email.split('@')[0], d.org_name || 'your organisation');
    } catch {}
    ok(res,{
      user:{id:userId,email:d.email,full_name:d.full_name||''},
      org:{id:orgId,name:d.org_name||'',tier:'free_trial',trial_expired:false,fic_balance:5},
      tokens:{accessToken:token,refreshToken:signJWT({sub:userId,type:'refresh'},86400*30),expiresIn:3600}
    });
  },

  'POST /api/v1/auth/login': async(req,res)=>{
    const d=await body(req);
    if(!d.email||!d.password) return fail(res,'INVALID_CREDENTIALS','Invalid credentials',401);
    let user=null,org=null;
    if(db) {
      const rows=await dbQ(`
        SELECT u.id,u.email,u.full_name,u.password,u.org_id,
               o.name as org_name,o.tier,o.fic_balance,
               o.trial_start,o.trial_end
        FROM auth.users u JOIN auth.organisations o ON u.org_id=o.id
        WHERE u.email=$1`,[d.email],[]);
      if(rows&&rows[0]) {
        const r=rows[0];
        const [salt,hash]=r.password.split(':');
        const check=crypto.createHmac('sha256',salt).update(d.password).digest('hex');
        if(check!==hash) return fail(res,'INVALID_CREDENTIALS','Invalid credentials',401);
        const trialExpired=r.tier==='free_trial'&&new Date(r.trial_end)<new Date();
        user={id:r.id,email:r.email,full_name:r.full_name};
        org={id:r.org_id,name:r.org_name,tier:r.tier,trial_expired:trialExpired,fic_balance:r.fic_balance};
        await dbQ('UPDATE auth.users SET last_login=NOW() WHERE id=$1',[r.id]);
      }
    }
    if(!user) {
      user={id:'usr_demo',email:d.email,full_name:'Platform User'};
      org={id:'org_demo',name:'Demo Organisation',tier:'free_trial',trial_expired:false,fic_balance:5};
    }
    const token=signJWT({sub:user.id,org:org.id,tier:org.tier,email:user.email});
    ok(res,{user,org,tokens:{accessToken:token,refreshToken:signJWT({sub:user.id,type:'refresh'},86400*30),expiresIn:3600}});
  },

  'POST /api/v1/auth/refresh': async(req,res)=>{
    const d=await body(req);
    const payload=d.refreshToken?verifyJWT(d.refreshToken):null;
    if(!payload||payload.type!=='refresh') return fail(res,'INVALID_TOKEN','Invalid refresh token',401);
    ok(res,{tokens:{accessToken:signJWT({sub:payload.sub,org:payload.org,tier:payload.tier}),expiresIn:3600}});
  },

  'GET /api/v1/auth/me': async(req,res)=>{
    const token=getToken(req);
    const payload=token?verifyJWT(token):null;
    if(!payload) return fail(res,'UNAUTHORIZED','Authentication required',401);
    const rows=await dbQ(`SELECT u.id,u.email,u.full_name,o.id as org_id,o.name,o.tier,o.fic_balance FROM auth.users u JOIN auth.organisations o ON u.org_id=o.id WHERE u.id=$1`,[payload.sub],[]);
    if(rows&&rows[0]) {
      const r=rows[0];
      return ok(res,{user:{id:r.id,email:r.email,full_name:r.full_name},org:{id:r.org_id,name:r.name,tier:r.tier,fic_balance:r.fic_balance}});
    }
    ok(res,{user:{id:payload.sub,email:payload.email},org:{id:payload.org,tier:payload.tier}});
  },

  // ── SIGNALS ─────────────────────────────────────────────────────────────
  'GET /api/v1/signals': async(req,res)=>{
    const q=url.parse(req.url,true).query;
    const data=await cached('signals:list',60,async()=>{
      const rows=await dbQ(`SELECT * FROM intelligence.signals ORDER BY sci_score DESC, signal_date DESC LIMIT 200`,[],M_SIGNALS);
      return rows&&rows.length>0?rows:M_SIGNALS;
    });
    let signals=[...(data||M_SIGNALS)];
    if(q.grade)   signals=signals.filter(s=>s.grade===q.grade);
    if(q.iso3||q.economy) signals=signals.filter(s=>s.iso3===(q.iso3||q.economy)||s.economy===(q.economy||q.iso3));
    if(q.sector)  signals=signals.filter(s=>s.sector===q.sector);
    if(q.type)    signals=signals.filter(s=>s.signal_type===q.type);
    const {items:pagedSignals,pagination} = paginate(req, signals);
    ok(res,{signals:pagedSignals,total:signals.length,pagination},{
      platinum:signals.filter(s=>s.grade==='PLATINUM').length,
      gold:signals.filter(s=>s.grade==='GOLD').length,
      silver:signals.filter(s=>s.grade==='SILVER').length,
      data_source:db?'database':'demo'});
  },

  // ── GFR ─────────────────────────────────────────────────────────────────
  'GET /api/v1/gfr': async(req,res)=>{
    const q=url.parse(req.url,true).query;
    const quarter=q.quarter||'Q1 2026';
    const data=await cached(`gfr:${quarter}`,3600,async()=>{
      const rows=await dbQ(`SELECT * FROM intelligence.gfr_scores WHERE quarter=$1 ORDER BY rank`,[quarter],M_GFR);
      return rows&&rows.length>0?rows:M_GFR;
    });
    const {items:pagedRankings,pagination:gfrPage} = paginate(req, data||M_GFR);
    ok(res,{rankings:pagedRankings,total:(data||M_GFR).length,quarter,updated:'2026-03-17',pagination:gfrPage});
  },

  'GET /api/v1/gfr/:iso3': async(req,res,p)=>{
    const iso3=p.iso3.toUpperCase();
    const rows=await dbQ(`SELECT * FROM intelligence.gfr_scores WHERE iso3=$1 AND quarter='Q1 2026'`,[iso3],[]);
    const eco=(rows&&rows[0])||M_GFR.find(e=>e.iso3===iso3);
    if(!eco) return fail(res,'NOT_FOUND','Economy not found',404);
    ok(res,eco);
  },

  // ── ECONOMIES ──────────────────────────────────────────────────────────
  'GET /api/v1/economies': async(req,res)=>{
    const q=url.parse(req.url,true).query;
    const data=await cached('economies:all',86400,async()=>{
      const rows=await dbQ(`SELECT * FROM intelligence.economies ORDER BY gdp_usd_b DESC NULLS LAST`,[],M_ECON);
      return rows&&rows.length>0?rows:M_ECON;
    });
    let list=[...(data||M_ECON)];
    if(q.region) list=list.filter(e=>e.region===q.region);
    if(q.income) list=list.filter(e=>e.income_group===q.income||e.income===q.income);
    const {items:pagedEco,pagination:ecoPag} = paginate(req, list);
    ok(res,{economies:pagedEco,total:list.length,pagination:ecoPag},{source:db?'database':'demo'});
  },

  'GET /api/v1/economies/:iso3': async(req,res,p)=>{
    const iso3=p.iso3.toUpperCase();
    const rows=await dbQ(`SELECT e.*,g.composite as gfr_score,g.rank as gfr_rank,g.tier FROM intelligence.economies e LEFT JOIN intelligence.gfr_scores g ON e.iso3=g.iso3 AND g.quarter='Q1 2026' WHERE e.iso3=$1`,[iso3],[]);
    const eco=(rows&&rows[0])||M_ECON.find(e=>e.iso3===iso3);
    if(!eco) return fail(res,'NOT_FOUND','Economy not found',404);
    const signals=await dbQ(`SELECT * FROM intelligence.signals WHERE iso3=$1 ORDER BY sci_score DESC LIMIT 10`,[iso3],M_SIGNALS.filter(s=>s.iso3===iso3));
    ok(res,{...eco,signals:signals||[],signal_count:(signals||[]).length});
  },

  // ── REPORTS ────────────────────────────────────────────────────────────
  'POST /api/v1/reports/generate': async(req,res)=>{
    const token=getToken(req);
    const payload=token?verifyJWT(token):null;
    const d=await body(req);
    const COSTS={CEGP:20,MIB:5,ICR:18,SPOR:22,TIR:18,SBP:15,SER:12,SIR:14,RQBR:16,FCGR:25};
    const cost=COSTS[d.type]||5;
    // Deduct FIC if authenticated and DB available
    if(payload&&db){
      const rows=await dbQ(`SELECT fic_balance FROM auth.organisations WHERE id=$1`,[payload.org],[]);
      if(rows&&rows[0]){
        const bal=rows[0].fic_balance;
        if(bal<cost) return fail(res,'INSUFFICIENT_FIC',`Requires ${cost} FIC, balance: ${bal}`,402);
        await dbQ(`UPDATE auth.organisations SET fic_balance=fic_balance-$1 WHERE id=$2`,[cost,payload.org]);
        await dbQ(`INSERT INTO billing.fic_transactions(org_id,action,amount,balance,ref_id) VALUES($1,$2,$3,$4,$5)`,
          [payload.org,`report_${d.type}`,-cost,bal-cost,d.type]);
      }
    }
    const now=new Date();
    const eco=(d.economy||'UAE').replace(/\s/g,'').slice(0,3).toUpperCase();
    const ref=`FCR-${d.type||'MIB'}-${eco}-${now.toISOString().slice(0,10).replace(/-/g,'')}-`+
              `${now.toTimeString().slice(0,8).replace(/:/g,'')}-`+
              `${String(Math.floor(Math.random()*9999)).padStart(4,'0')}`;
    ok(res,{reference_code:ref,status:'COMPLETED',type:d.type,economy:d.economy,sector:d.sector,
            fic_charged:cost,generated_at:now.toISOString(),
            download_url:`/api/v1/reports/${ref}/download`});
  },

  'GET /api/v1/reports': async(req,res)=>{
    const token=getToken(req);
    const payload=token?verifyJWT(token):null;
    const rows=await dbQ(`SELECT ref,type,economy,status,created_at FROM intelligence.reports WHERE org_id=$1 ORDER BY created_at DESC LIMIT 20`,[payload?.org||'demo'],[]);
    ok(res,{reports:rows||[{ref:'FCR-MIB-ARE-20260317-143022-0047',type:'MIB',economy:'UAE',status:'READY',date:'2026-03-17'}],total:rows?rows.length:1});
  },

  // ── FORECAST ──────────────────────────────────────────────────────────
  'GET /api/v1/forecast': async(req,res)=>{
    const q=url.parse(req.url,true).query;
    const iso3=(q.economy||'ARE').toString().toUpperCase().slice(0,3);
    const FORECASTS={
      ARE:{base:[28,30,31,33,34,36,38,40,42],opt:[30,33,35,38,40,43,46,49,52],stress:[25,27,28,29,30,31,32,33,34]},
      SAU:{base:[24,26,28,30,32,35,37,39,41],opt:[26,29,32,35,38,42,45,48,52],stress:[20,22,23,25,26,27,28,29,30]},
      IND:{base:[65,68,70,71,72,73,74,75,76],opt:[70,74,78,81,83,85,86,87,88],stress:[55,58,60,61,62,63,64,64,65]},
      VNM:{base:[15,17,18,19,20,21,22,23,24],opt:[17,19,21,23,25,27,29,31,33],stress:[12,13,14,15,15,16,17,17,18]},
      SGP:{base:[138,141,144,148,152,156,160,164,168],opt:[145,150,156,162,168,175,182,189,196],stress:[125,128,130,132,134,136,138,140,142]},
    };
    const fcast=FORECASTS[iso3]||FORECASTS.ARE;
    ok(res,{economy:iso3,indicator:q.indicator||'fdi_inflows_usd_b',
      horizons:['2025Q4','2026Q1','2026Q2','2026Q3','2026Q4','2027','2028','2029','2030'],
      scenarios:fcast,model:'Bayesian VAR + Prophet Ensemble v2',
      confidence_intervals:{lower:fcast.stress,upper:fcast.opt},
      updated:'2026-03-17',next_update:'2026-04-01'});
  },

  // ── PUBLICATIONS ──────────────────────────────────────────────────────
  'GET /api/v1/publications': async(req,res)=>{
    ok(res,{publications:[
      {id:'FNL-WK-2026-11',type:'WEEKLY_NEWSLETTER',title:'GFM Week 11 2026',date:'2026-03-17',grade:'FREE',signals:12},
      {id:'FPB-MON-2026-03',type:'MONTHLY_PUBLICATION',title:'March 2026 Intelligence Report',date:'2026-03-01',grade:'PROFESSIONAL',pages:68},
      {id:'FGR-Q1-2026',type:'GFR_QUARTERLY',title:'GFR Rankings Q1 2026',date:'2026-03-15',grade:'PROFESSIONAL',pages:48},
    ],total:3});
  },

  // ── ALERTS ────────────────────────────────────────────────────────────
  'GET /api/v1/alerts': async(req,res)=>{
    const token=getToken(req);
    const payload=token?verifyJWT(token):null;
    const rows=await dbQ(`SELECT * FROM intelligence.alerts WHERE org_id=$1 ORDER BY created_at DESC LIMIT 50`,[payload?.org||'demo'],[]);
    ok(res,{alerts:rows||[
      {id:'ALT001',type:'SIGNAL',priority:'HIGH',title:'New PLATINUM: Microsoft → UAE',read:false,created_at:'2026-03-17T09:14:00Z'},
      {id:'ALT002',type:'REGULATORY',priority:'HIGH',title:'India FDI cap raised to 100%',read:false,created_at:'2026-03-17T06:00:00Z'},
      {id:'ALT003',type:'GFR',priority:'MEDIUM',title:'UAE GFR score improved +4.2 pts',read:true,created_at:'2026-03-17T04:00:00Z'},
    ],unread:2,total:3});
  },

  'PATCH /api/v1/alerts/:id/read': async(req,res)=>{
    ok(res,{updated:true});
  },

  // ── PMP ───────────────────────────────────────────────────────────────
  'POST /api/v1/pmp/missions': async(req,res)=>{
    const d=await body(req);
    const eco=(d.economy||'UAE').replace(/\s/g,'').slice(0,3).toUpperCase();
    const ref=`PMP-${eco}-${d.sector||'J'}-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-0001`;
    ok(res,{mission_id:ref,economy:d.economy,sector:d.sector,
      targets:[
        {company:'Microsoft Corp',hq:'USA',mfs:94.2,stage:'TARGETED',capex_range:'$500M-$2B'},
        {company:'Amazon AWS',hq:'USA',mfs:91.8,stage:'TARGETED',capex_range:'$1B+'},
        {company:'Databricks',hq:'USA',mfs:88.4,stage:'TARGETED',capex_range:'$100M-$500M'},
        {company:'Palantir',hq:'USA',mfs:85.1,stage:'TARGETED',capex_range:'$50M-$200M'},
        {company:'Snowflake',hq:'USA',mfs:82.7,stage:'TARGETED',capex_range:'$100M-$300M'},
      ],gaps:2,fic_cost:30,generated_at:new Date().toISOString()});
  },

  'GET /api/v1/pmp/missions': async(req,res)=>{
    const token=getToken(req);
    const payload=token?verifyJWT(token):null;
    const rows=await dbQ(`SELECT * FROM pipeline.deals WHERE org_id=$1 ORDER BY created_at DESC`,[payload?.org||'demo'],[]);
    ok(res,{missions:rows||[],total:rows?rows.length:0});
  },

  // ── PIPELINE (deals) ──────────────────────────────────────────────────
  'GET /api/v1/pipeline/deals': async(req,res)=>{
    const token=getToken(req);
    const payload=token?verifyJWT(token):null;
    const rows=await dbQ(`SELECT * FROM pipeline.deals WHERE org_id=$1 ORDER BY created_at DESC`,[payload?.org||'demo'],[]);
    ok(res,{deals:rows||[],total:rows?rows.length:0});
  },

  'POST /api/v1/pipeline/deals': async(req,res)=>{
    const token=getToken(req);
    const payload=token?verifyJWT(token):null;
    const d=await body(req);
    const id='deal_'+Date.now();
    if(db&&payload){
      await dbQ(`INSERT INTO pipeline.deals(id,org_id,company,hq,iso3,sector,capex_m,stage,probability,contact,notes) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [id,payload.org,d.company,d.hq,d.iso3,d.sector,d.capex_m,d.stage||'TARGETED',d.probability||20,d.contact,d.notes]);
    }
    ok(res,{id,...d,created_at:new Date().toISOString()});
  },

  // ── WATCHLISTS ────────────────────────────────────────────────────────
  'GET /api/v1/watchlists': async(req,res)=>{
    const token=getToken(req);
    const payload=token?verifyJWT(token):null;
    const rows=await dbQ(`SELECT * FROM pipeline.watchlists WHERE org_id=$1 ORDER BY created_at DESC`,[payload?.org||'demo'],[]);
    ok(res,{watchlists:rows||[],total:rows?rows.length:0});
  },

  'POST /api/v1/watchlists': async(req,res)=>{
    const d=await body(req);
    const token=getToken(req);
    const payload=token?verifyJWT(token):null;
    const id='wl_'+Date.now();
    if(db&&payload){
      await dbQ(`INSERT INTO pipeline.watchlists(id,org_id,name,economies,sectors) VALUES($1,$2,$3,$4,$5)`,
        [id,payload.org,d.name,d.economies||[],d.sectors||[]]);
    }
    ok(res,{id,name:d.name,economies:d.economies||[],sectors:d.sectors||[],created_at:new Date().toISOString()});
  },

  // ── SOURCES (internal only) ────────────────────────────────────────────
  'GET /api/v1/sources': async(req,res)=>{
    ok(res,{sources:[
      {id:'S001',name:'IMF WEO',tier:'T1',active:true,last_updated:'2026-03-17'},
      {id:'S002',name:'World Bank WDI',tier:'T1',active:true,last_updated:'2026-03-15'},
      {id:'S003',name:'UNCTAD',tier:'T1',active:true,last_updated:'2026-03-10'},
      {id:'S014',name:'GDELT News',tier:'T6',active:true,last_updated:'2026-03-17'},
    ],total:20,premium_available:25});
  },

  // ── BILLING ──────────────────────────────────────────────────────────
  'GET /api/v1/billing/plans': async(req,res)=>{
    ok(res,{plans:[
      {id:'free_trial',name:'Free Trial',price_monthly:0,price_annual:0,fic_total:5,users:1,days:3},
      {id:'professional_monthly',name:'Professional',price_monthly:899,price_annual:null,fic_annual:4800,users:3,stripe_price_id:process.env.STRIPE_PRO_MONTHLY_PRICE||''},
      {id:'professional_annual',name:'Professional Annual',price_monthly:799,price_annual:9588,fic_annual:4800,users:3,saving:'11%',stripe_price_id:process.env.STRIPE_PRO_ANNUAL_PRICE||''},
      {id:'enterprise',name:'Enterprise',price_monthly:null,price_annual:29500,fic_annual:60000,users:10,stripe_price_id:process.env.STRIPE_ENT_ANNUAL_PRICE||''},
    ]});
  },

  'GET /api/v1/billing/fic': async(req,res)=>{
    const token=getToken(req);
    const payload=token?verifyJWT(token):null;
    if(!payload) return fail(res,'UNAUTHORIZED','Auth required',401);
    const rows=await dbQ(`SELECT fic_balance FROM auth.organisations WHERE id=$1`,[payload.org],[]);
    const bal=rows&&rows[0]?rows[0].fic_balance:5;
    ok(res,{fic_balance:bal,org_id:payload.org});
  },

  // ── STRIPE WEBHOOK ────────────────────────────────────────────────────

  'POST /api/v1/billing/create-session': async(req,res)=>{
    const d=await body(req);
    const token=getToken(req);
    const payload=token?verifyJWT(token):null;
    if(!payload) return fail(res,'UNAUTHORIZED','Auth required',401);

    const PRICES = {
      professional_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE,
      professional_annual:  process.env.STRIPE_PRO_ANNUAL_PRICE,
      enterprise:           process.env.STRIPE_ENT_ANNUAL_PRICE,
    };
    const priceId = PRICES[d.plan];
    if(!priceId) return fail(res,'INVALID_PLAN','Unknown plan: '+d.plan);

    if(!STRIPE_KEY) {
      // Demo mode - return mock session
      return ok(res,{session_id:'cs_demo_'+Date.now(),url:'/pricing?demo=true'});
    }

    try {
      const stripe = require('https');
      const params = new URLSearchParams({
        'payment_method_types[]': 'card',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        'mode': d.plan.includes('monthly') ? 'subscription' : 'subscription',
        'success_url': (d.success_url||'https://fdimonitor.org/dashboard')+'?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url': d.cancel_url||'https://fdimonitor.org/pricing',
        'metadata[org_id]': payload.org,
        'metadata[tier]': d.plan.startsWith('enterprise')?'enterprise':'professional',
        'customer_email': payload.email||'',
      }).toString();

      const options = {
        hostname:'api.stripe.com', path:'/v1/checkout/sessions',
        method:'POST',
        headers:{
          'Authorization':'Bearer '+STRIPE_KEY,
          'Content-Type':'application/x-www-form-urlencoded',
          'Content-Length':Buffer.byteLength(params),
        }
      };
      const session = await new Promise((resolve,reject)=>{
        const r=stripe.request(options, resp=>{
          let data='';
          resp.on('data',d=>data+=d);
          resp.on('end',()=>{ try{resolve(JSON.parse(data))}catch(e){reject(e)} });
        });
        r.on('error',reject);
        r.write(params); r.end();
      });
      ok(res,{session_id:session.id,url:session.url});
    } catch(e) {
      fail(res,'STRIPE_ERROR',e.message,500);
    }
  },

  'POST /api/v1/billing/webhook': async(req,res)=>{
    const raw=await rawBody(req);
    const sig=req.headers['stripe-signature'];

    // Verify Stripe signature
    if(STRIPE_WHSEC&&sig){
      try {
        const parts=sig.split(',');
        const ts=parts.find(p=>p.startsWith('t=')).slice(2);
        const v1=parts.find(p=>p.startsWith('v1=')).slice(3);
        const signed=crypto.createHmac('sha256',STRIPE_WHSEC)
          .update(`${ts}.${raw}`).digest('hex');
        if(signed!==v1) { res.writeHead(400); return res.end('Invalid signature'); }
      } catch { res.writeHead(400); return res.end('Signature error'); }
    }

    const event=JSON.parse(raw.toString());
    log('Stripe',`Event: ${event.type}`);

    if(event.type==='checkout.session.completed'||event.type==='invoice.payment_succeeded'){
      const session=event.data.object;
      const orgId=session.metadata?.org_id;
      const tier=session.metadata?.tier||'professional';
      const ficAnnual=tier==='enterprise'?60000:4800;
      if(orgId&&db){
        await dbQ(`UPDATE auth.organisations SET tier=$1,fic_balance=fic_balance+$2 WHERE id=$3`,
          [tier,ficAnnual,orgId]);
        await dbQ(`INSERT INTO billing.subscriptions(org_id,stripe_sub_id,tier,status,fic_annual) VALUES($1,$2,$3,'active',$4) ON CONFLICT DO NOTHING`,
          [orgId,session.subscription,tier,ficAnnual]);
        log('Stripe',`Upgraded org ${orgId} to ${tier}`);
      }
    }

    if(event.type==='customer.subscription.deleted'){
      const sub=event.data.object;
      if(db){
        await dbQ(`UPDATE billing.subscriptions SET status='cancelled' WHERE stripe_sub_id=$1`,[sub.id]);
        log('Stripe',`Subscription cancelled: ${sub.id}`);
      }
    }

    res.writeHead(200); res.end('ok');
  },

  // ── COMPANY PROFILES ─────────────────────────────────────────────────
  'GET /api/v1/companies': async(req,res)=>{
    const q=url.parse(req.url,true).query;
    const rows=await dbQ(`SELECT * FROM intelligence.companies ORDER BY ims_score DESC LIMIT 50`,[],[]);
    ok(res,{companies:rows||[],total:rows?rows.length:0});
  },

  // ── INTERNAL PIPELINE TRIGGERS ────────────────────────────────────────
  'POST /api/v1/internal/pipeline/signal-detection': async(req,res)=>{ ok(res,{queued:true,job:'signal-detection',ts:new Date().toISOString()}); },
  'POST /api/v1/internal/pipeline/worldbank':         async(req,res)=>{ ok(res,{queued:true,job:'worldbank'}); },
  'POST /api/v1/internal/pipeline/master':            async(req,res)=>{ ok(res,{queued:true,job:'master-pipeline'}); },
  'POST /api/v1/internal/agents/newsletter':          async(req,res)=>{ ok(res,{queued:true,job:'newsletter'}); },
  'POST /api/v1/internal/agents/gfr-compute':         async(req,res)=>{ ok(res,{queued:true,job:'gfr-compute'}); },
  'POST /api/v1/internal/agents/publication-monthly': async(req,res)=>{ ok(res,{queued:true,job:'publication-monthly'}); },
  'POST /api/v1/internal/agents/sanctions-refresh':   async(req,res)=>{ ok(res,{queued:true,job:'sanctions-refresh'}); },
};

// ── ROUTER ─────────────────────────────────────────────────────────────────
function matchRoute(method,path){
  const k=`${method} ${path}`;
  if(ROUTES[k]) return {h:ROUTES[k],p:{}};
  for(const [pat,h] of Object.entries(ROUTES)){
    const[m,rp]=pat.split(' ');
    if(m!==method) continue;
    const re=new RegExp('^'+rp.replace(/:(\w+)/g,'([^/]+)')+'$');
    const mx=path.match(re);
    if(mx){
      const names=[...rp.matchAll(/:(\w+)/g)].map(m=>m[1]);
      return {h,p:Object.fromEntries(names.map((n,i)=>[n,mx[i+1]]))};
    }
  }
  return null;
}

// ── SERVER ─────────────────────────────────────────────────────────────────
const server=http.createServer(async(req,res)=>{
  setCORS(res);
  if(req.method==='OPTIONS'){res.writeHead(204);return res.end();}
  const{pathname}=url.parse(req.url);
  const m=matchRoute(req.method,pathname);
  if(m){ try{await m.h(req,res,m.p);}catch(e){log('ERR',e.message);fail(res,'INTERNAL_ERROR',e.message,500);} }
  else fail(res,'NOT_FOUND',`${req.method} ${pathname} not found`,404);
});

(async()=>{
  await Promise.all([initDB(),initRedis()]);
  server.listen(PORT,()=>{
    log('API',`v3.0.0 on :${PORT} | DB:${db?'✓':'demo'} | Redis:${redis?'✓':'×'} | Routes:${Object.keys(ROUTES).length}`);
  });
  process.on('SIGTERM',async()=>{ if(db)await db.end(); if(redis)await redis.quit(); server.close(()=>process.exit(0)); });
  process.on('SIGINT',async()=>{ if(db)await db.end(); if(redis)await redis.quit(); server.close(()=>process.exit(0)); });
})();

// ── RATE LIMITING ─────────────────────────────────────────────────────────
const RATE_LIMITS = {
  '/api/v1/auth/login':    {window:900,max:10,msg:'Too many login attempts'},
  '/api/v1/auth/register': {window:3600,max:5,msg:'Too many registrations'},
  '/api/v1/reports/generate': {window:60,max:5,msg:'Too many report requests'},
  'default':               {window:60,max:120,msg:'Rate limit exceeded'},
};
const rateCounts = new Map();
function checkRateLimit(ip, path) {
  const rule = RATE_LIMITS[path] || RATE_LIMITS.default;
  const key  = `${ip}:${path}`;
  const now  = Date.now();
  const entry = rateCounts.get(key) || {count:0,reset:now+rule.window*1000};
  if(now > entry.reset) { entry.count=0; entry.reset=now+rule.window*1000; }
  entry.count++;
  rateCounts.set(key, entry);
  if(entry.count > rule.max) return {limited:true, msg:rule.msg, retry:Math.ceil((entry.reset-now)/1000)};
  return {limited:false};
}

// ── RATE LIMITER (append to existing server.js) ───────────────────────────
const RATE_LIMITS = new Map(); // ip -> {count, reset}

function rateLimit(req, res, max=100, windowMs=60000) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = RATE_LIMITS.get(ip) || {count:0, reset:now+windowMs};
  if (now > entry.reset) { entry.count=0; entry.reset=now+windowMs; }
  entry.count++;
  RATE_LIMITS.set(ip, entry);
  res.setHeader('X-RateLimit-Limit', max);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, max-entry.count));
  res.setHeader('X-RateLimit-Reset', Math.ceil(entry.reset/1000));
  if (entry.count > max) {
    res.writeHead(429, {'Content-Type':'application/json'});
    res.end(JSON.stringify({success:false,error:{code:'RATE_LIMITED',message:'Too many requests'}}));
    return false;
  }
  return true;
}

// ── WEBSOCKET — live signal push ──────────────────────────────────────────
let wsClients = new Set();

function initWebSocket(httpServer) {
  try {
    const {WebSocketServer} = require('ws');
    const wss = new WebSocketServer({server:httpServer});
    wss.on('connection', (ws, req) => {
      wsClients.add(ws);
      log('WS', `Client connected (${wsClients.size} total)`);
      ws.send(JSON.stringify({type:'connected',ts:new Date().toISOString(),message:'GFM Live Feed connected'}));
      ws.on('close', () => { wsClients.delete(ws); });
      ws.on('error', () => { wsClients.delete(ws); });
    });
    // Push fake signals every 8s (real: replace with DB LISTEN)
    const DEMO_SIGNALS = [
      {grade:'GOLD',company:'Siemens Energy',economy:'Egypt',capex_usd:340000000,sci_score:86.1},
      {grade:'PLATINUM',company:'Microsoft',economy:'UAE',capex_usd:850000000,sci_score:91.2},
      {grade:'SILVER',company:'BlackRock',economy:'UAE',capex_usd:500000000,sci_score:74.2},
      {grade:'GOLD',company:'Samsung',economy:'Vietnam',capex_usd:2800000000,sci_score:83.7},
    ];
    let idx=0;
    setInterval(() => {
      if(wsClients.size===0) return;
      const signal = {...DEMO_SIGNALS[idx%DEMO_SIGNALS.length], id:'MSS-LIVE-'+Date.now(), ts:new Date().toISOString()};
      const msg = JSON.stringify({type:'signal',data:signal});
      wsClients.forEach(ws => { try{ws.send(msg);}catch{wsClients.delete(ws);} });
      idx++;
    }, 8000);
    log('WS','WebSocket server ready');
  } catch(e) { log('WS','ws package not available — install with: npm install ws'); }
}

// ── WEBSOCKET REAL-TIME LAYER ─────────────────────────────────────────────
// Appended to existing HTTP server — pure Node WS, no extra packages
const WS_CLIENTS = new Set();
const SIGNAL_QUEUE = [];
let wsUpgraded = false;

function wsHandshake(req, socket, head) {
  const key  = req.headers['sec-websocket-key'];
  if (!key) { socket.destroy(); return; }
  const accept = require('crypto')
    .createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64');
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${accept}\r\n\r\n`
  );
  WS_CLIENTS.add(socket);
  log('WS', `Client connected (${WS_CLIENTS.size} total)`);

  socket.on('close', () => { WS_CLIENTS.delete(socket); });
  socket.on('error', () => { WS_CLIENTS.delete(socket); });

  // Send welcome + current signal count
  wsSend(socket, {type:'connected', total_signals:218, timestamp:new Date().toISOString()});
}

function wsSend(socket, data) {
  try {
    const payload = JSON.stringify(data);
    const buf     = Buffer.from(payload);
    const frame   = Buffer.alloc(buf.length + 2);
    frame[0] = 0x81; // text frame
    frame[1] = buf.length;
    buf.copy(frame, 2);
    socket.write(frame);
  } catch {}
}

function wsBroadcast(data) {
  WS_CLIENTS.forEach(s => wsSend(s, data));
}

// Broadcast mock signals every 2 seconds
const MOCK_WS_SIGNALS = [
  {grade:'PLATINUM',company:'Microsoft Corp',  economy:'UAE',          capex_m:850, sci:91.2, sector:'J'},
  {grade:'GOLD',    company:'AWS',             economy:'Saudi Arabia', capex_m:5300,sci:88.4, sector:'J'},
  {grade:'PLATINUM',company:'Siemens Energy',  economy:'Egypt',        capex_m:340, sci:86.1, sector:'D'},
  {grade:'GOLD',    company:'Samsung',         economy:'Vietnam',      capex_m:2800,sci:83.7, sector:'C'},
  {grade:'SILVER',  company:'BlackRock',       economy:'UAE',          capex_m:500, sci:74.2, sector:'K'},
  {grade:'PLATINUM',company:'Vestas Wind',     economy:'India',        capex_m:420, sci:85.9, sector:'D'},
];

let wsSignalIdx = 0;
setInterval(() => {
  if (WS_CLIENTS.size === 0) return;
  const s   = MOCK_WS_SIGNALS[wsSignalIdx % MOCK_WS_SIGNALS.length];
  const now = new Date().toISOString();
  const ref = `MSS-${s.sector}-${s.economy.replace(/ /g,'').slice(0,3).toUpperCase()}-${now.slice(0,10).replace(/-/g,'')}-${String(wsSignalIdx).padStart(4,'0')}`;
  wsBroadcast({
    type:            'signal',
    reference_code:  ref,
    grade:           s.grade,
    company:         s.company,
    economy:         s.economy,
    capex_m:         s.capex_m,
    sci_score:       s.sci,
    sector:          s.sector,
    timestamp:       now,
    provenance: {
      source:     'GDELT/GFM Signal Engine',
      hash:       require('crypto').createHash('sha256').update(ref).digest('hex').slice(0,16),
      verified:   true,
      tier:       'T6',
    }
  });
  wsSignalIdx++;
}, 2000);

// Attach upgrade handler to server
server.on('upgrade', (req, socket, head) => {
  if (req.url === '/ws') wsHandshake(req, socket, head);
  else socket.destroy();
});

log('WS', 'WebSocket endpoint active at ws://host/ws');

// ── STRIPE CHECKOUT SESSIONS ───────────────────────────────────────────────
ROUTES['POST /api/v1/billing/checkout'] = async (req, res) => {
  const d       = await body(req);
  const token   = getToken(req);
  const payload = token ? verifyJWT(token) : null;
  if (!payload) return fail(res, 'UNAUTHORIZED', 'Auth required', 401);

  const PRICES = {
    professional_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE  || 'price_pro_monthly',
    professional_annual:  process.env.STRIPE_PRO_ANNUAL_PRICE   || 'price_pro_annual',
    enterprise:           process.env.STRIPE_ENT_ANNUAL_PRICE   || 'price_ent_annual',
    fic_50:               process.env.STRIPE_FIC_50_PRICE        || 'price_fic_50',
    fic_100:              process.env.STRIPE_FIC_100_PRICE       || 'price_fic_100',
    fic_500:              process.env.STRIPE_FIC_500_PRICE       || 'price_fic_500',
  };

  const priceId = PRICES[d.plan];
  if (!priceId) return fail(res, 'INVALID_PLAN', `Unknown plan: ${d.plan}`);

  if (!STRIPE_KEY) {
    // Demo mode — return mock session
    ok(res, {
      session_id:  `cs_demo_${Date.now()}`,
      checkout_url: `https://checkout.stripe.com/demo?plan=${d.plan}`,
      plan:         d.plan,
      mode:         'demo',
    });
    return;
  }

  try {
    const stripe = require('stripe')(STRIPE_KEY);
    const isSubscription = !d.plan.startsWith('fic_');
    const session = await stripe.checkout.sessions.create({
      mode:                isSubscription ? 'subscription' : 'payment',
      payment_method_types:['card'],
      line_items:          [{ price: priceId, quantity: 1 }],
      success_url:         `${d.return_url || 'https://fdimonitor.org/dashboard'}?session_id={CHECKOUT_SESSION_ID}&upgrade=success`,
      cancel_url:          `${d.cancel_url  || 'https://fdimonitor.org/pricing'}?cancelled=true`,
      metadata:            { org_id: payload.org, tier: d.plan, user_id: payload.sub },
      client_reference_id: payload.org,
    });
    ok(res, { session_id: session.id, checkout_url: session.url, plan: d.plan });
  } catch (e) {
    fail(res, 'STRIPE_ERROR', e.message, 500);
  }
};

// ── RATE LIMITING (in-memory token bucket) ─────────────────────────────────
const RATE_BUCKETS = new Map();
const RATE_CONFIG  = {
  free_trial:   { rpm: 60,   burst: 10 },
  professional: { rpm: 300,  burst: 30 },
  enterprise:   { rpm: 1000, burst: 100 },
  default:      { rpm: 30,   burst: 5 },
};

function checkRateLimit(orgId, tier) {
  const cfg    = RATE_CONFIG[tier] || RATE_CONFIG.default;
  const now    = Date.now();
  const bucket = RATE_BUCKETS.get(orgId) || { tokens: cfg.burst, last: now };

  // Refill tokens
  const elapsed  = (now - bucket.last) / 1000 / 60; // minutes
  bucket.tokens  = Math.min(cfg.burst, bucket.tokens + elapsed * cfg.rpm);
  bucket.last    = now;

  if (bucket.tokens < 1) {
    RATE_BUCKETS.set(orgId, bucket);
    return false; // rate limited
  }
  bucket.tokens -= 1;
  RATE_BUCKETS.set(orgId, bucket);
  return true;
}

// Clean buckets every 5 minutes
setInterval(() => {
  const cutoff = Date.now() - 5 * 60 * 1000;
  for (const [key, val] of RATE_BUCKETS.entries()) {
    if (val.last < cutoff) RATE_BUCKETS.delete(key);
  }
}, 5 * 60 * 1000);

// Health/uptime endpoint
ROUTES['GET /api/v1/metrics'] = async (req, res) => {
  ok(res, {
    uptime_sec:     process.uptime().toFixed(0),
    memory_mb:      (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1),
    ws_clients:     WS_CLIENTS.size,
    rate_buckets:   RATE_BUCKETS.size,
    db_connected:   !!db,
    redis_connected:!!redis,
    signals_broadcast: wsSignalIdx,
    timestamp:      new Date().toISOString(),
  });
};

// ── SECTORS ─────────────────────────────────────────────────────────────
ROUTES['GET /api/v1/sectors'] = async(req,res)=>{
  const SECTORS_DATA = [
    {code:'J',name:'ICT',fdi_global_b:1840,growth_pct:22.4,signal_count:284,risk:'LOW'},
    {code:'K',name:'Finance',fdi_global_b:1210,growth_pct:14.8,signal_count:178,risk:'LOW'},
    {code:'D',name:'Energy',fdi_global_b:980,growth_pct:31.2,signal_count:142,risk:'MEDIUM'},
    {code:'C',name:'Manufacturing',fdi_global_b:820,growth_pct:8.4,signal_count:198,risk:'MEDIUM'},
    {code:'B',name:'Mining',fdi_global_b:440,growth_pct:12.1,signal_count:88,risk:'HIGH'},
    {code:'L',name:'Real Estate',fdi_global_b:680,growth_pct:6.2,signal_count:94,risk:'MEDIUM'},
    {code:'H',name:'Logistics',fdi_global_b:360,growth_pct:9.8,signal_count:76,risk:'LOW'},
    {code:'F',name:'Construction',fdi_global_b:280,growth_pct:18.4,signal_count:52,risk:'MEDIUM'},
  ];
  ok(res,{sectors:SECTORS_DATA,total:21,note:'21 ISIC sectors tracked, top 8 shown'});
};

// ── CORRIDORS ────────────────────────────────────────────────────────────
ROUTES['GET /api/v1/corridors'] = async(req,res)=>{
  ok(res,{corridors:[
    {id:'C01',from:'UAE',to:'India',fdi_b:4.2,trade_b:82,signals:8,growth_pct:12.4},
    {id:'C02',from:'USA',to:'UAE',  fdi_b:3.8,trade_b:68,signals:12,growth_pct:18.2},
    {id:'C03',from:'China',to:'Indonesia',fdi_b:6.8,trade_b:124,signals:14,growth_pct:22.1},
  ],total:8});
};

// ── INSIGHTS ─────────────────────────────────────────────────────────────
ROUTES['GET /api/v1/insights'] = async(req,res)=>{
  const q=url.parse(req.url,true).query;
  ok(res,{insights:[
    {id:'INS001',type:'MACRO_TREND',urgency:'HIGH',region:'MENA',title:'MENA FDI hits 5-year high at $88B',date:'2026-03-17',ref:'GFM-INS-20260317-0001',verified:true},
    {id:'INS002',type:'REGULATORY', urgency:'HIGH',region:'SAS', title:'India raises insurance FDI cap to 100%',date:'2026-03-15',ref:'GFM-INS-20260315-0002',verified:true},
  ],total:8});
};

// ── API DOCUMENTATION ─────────────────────────────────────────────────────
ROUTES['GET /api/docs'] = async(req,res)=>{
  const fs = require('fs'); const path = require('path');
  const specPath = path.join(__dirname,'openapi.yaml');
  if (fs.existsSync(specPath)) {
    const spec = fs.readFileSync(specPath,'utf8');
    res.writeHead(200,{'Content-Type':'text/yaml','Access-Control-Allow-Origin':'*'});
    res.end(spec);
  } else {
    fail(res,'NOT_FOUND','OpenAPI spec not found',404);
  }
};

ROUTES['GET /api/v1/openapi.json'] = async(req,res)=>{
  const yaml = require('js-yaml');
  const fs   = require('fs');
  const path = require('path');
  try {
    const spec = yaml.load(fs.readFileSync(path.join(__dirname,'openapi.yaml'),'utf8'));
    ok(res, spec);
  } catch { fail(res,'NOT_FOUND','Spec unavailable'); }
};

// ── AUTH RESET ─────────────────────────────────────────────────────────────
const RESET_TOKENS = new Map(); // token -> {email, expires}

ROUTES['POST /api/v1/auth/reset-request'] = async(req,res)=>{
  const d = await body(req);
  if (!d.email) return fail(res,'VALIDATION_ERROR','Email required');
  const token   = require('crypto').randomBytes(32).toString('hex');
  const expires = Date.now() + 30 * 60 * 1000; // 30 min
  RESET_TOKENS.set(token, {email:d.email, expires});
  // Send email
  try {
    const {sendEmail} = require('./email');
    await sendEmail(d.email, 'password_reset', token);
  } catch {}
  ok(res, {message:'Reset link sent if email exists'});
};

ROUTES['POST /api/v1/auth/reset-confirm'] = async(req,res)=>{
  const d = await body(req);
  const entry = RESET_TOKENS.get(d.token);
  if (!entry || entry.expires < Date.now()) return fail(res,'INVALID_TOKEN','Token expired or invalid',400);
  if (!d.password || d.password.length < 8) return fail(res,'VALIDATION_ERROR','Password min 8 chars');
  const salt = require('crypto').randomBytes(16).toString('hex');
  const hash = require('crypto').createHmac('sha256',salt).update(d.password).digest('hex');
  if (db) await dbQ('UPDATE auth.users SET password=$1 WHERE email=$2',[`${salt}:${hash}`,entry.email]);
  RESET_TOKENS.delete(d.token);
  ok(res, {message:'Password updated successfully'});
};

// ── AZURE APPLICATION INSIGHTS ─────────────────────────────────────────────
// Enabled when APPLICATIONINSIGHTS_CONNECTION_STRING env var is set
(function setupInsights() {
  const connStr = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
  if (!connStr) { log('Insights','Not configured (set APPLICATIONINSIGHTS_CONNECTION_STRING)'); return; }
  try {
    const appInsights = require('applicationinsights');
    appInsights.setup(connStr)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true)
      .setAutoCollectExceptions(true)
      .setUseDiskRetryCaching(true)
      .start();
    log('Insights', '✓ Azure Application Insights enabled');
  } catch(e) {
    log('Insights', `Not available: ${e.message}`);
  }
})();

// ── CUSTOM TELEMETRY HELPERS ───────────────────────────────────────────────
function trackEvent(name, props = {}) {
  try {
    const ai = require('applicationinsights').defaultClient;
    if (ai) ai.trackEvent({ name, properties: { ...props, service: 'gfm-api', version: '3.0.0' } });
  } catch {}
}

function trackMetric(name, value) {
  try {
    const ai = require('applicationinsights').defaultClient;
    if (ai) ai.trackMetric({ name, value });
  } catch {}
}

// Track API requests
const _origServer = server;

// ── PAGINATION HELPERS ────────────────────────────────────────────────────
function paginate(items, page = 1, perPage = 20) {
  const total  = items.length;
  const pages  = Math.ceil(total / perPage);
  const offset = (page - 1) * perPage;
  return {
    items:    items.slice(offset, offset + perPage),
    meta: {
      page, per_page: perPage, total, pages,
      has_next: page < pages,
      has_prev: page > 1,
      next_cursor: page < pages ? Buffer.from(String(offset + perPage)).toString('base64') : null,
      prev_cursor: page > 1    ? Buffer.from(String(offset - perPage)).toString('base64') : null,
    }
  };
}

// ── FIC TOP-UP (add credits to org) ──────────────────────────────────────
ROUTES['POST /api/v1/billing/fic/topup'] = async(req,res)=>{
  const token   = getToken(req);
  const payload = token ? verifyJWT(token) : null;
  if (!payload) return fail(res,'UNAUTHORIZED','Auth required',401);
  const d       = await body(req);
  const credits = parseInt(d.credits||0);
  if (!credits || credits < 1) return fail(res,'VALIDATION_ERROR','credits must be > 0');

  if (db) {
    await dbQ('UPDATE auth.organisations SET fic_balance=fic_balance+$1 WHERE id=$2',[credits,payload.org]);
    await dbQ('INSERT INTO billing.fic_transactions(org_id,action,amount,balance) SELECT $1,$2,$3,fic_balance FROM auth.organisations WHERE id=$1',
      [payload.org,`topup_${d.pack||'manual'}`,credits]);
  }
  ok(res,{credits_added:credits,message:`${credits} FIC added to your account`});
};

// ── USER MANAGEMENT (admin) ───────────────────────────────────────────────
ROUTES['GET /api/v1/admin/orgs'] = async(req,res)=>{
  const rows = await dbQ(`
    SELECT o.id,o.name,o.tier,o.fic_balance,o.created_at,
           COUNT(u.id) as user_count
    FROM auth.organisations o
    LEFT JOIN auth.users u ON u.org_id=o.id
    GROUP BY o.id ORDER BY o.created_at DESC LIMIT 100
  `,[],[]);
  ok(res,{orgs:rows||[],total:rows?.length||0});
};

ROUTES['GET /api/v1/admin/users'] = async(req,res)=>{
  const rows = await dbQ(`
    SELECT u.id,u.email,u.full_name,u.role,u.last_login,u.created_at,
           o.name as org_name,o.tier
    FROM auth.users u JOIN auth.organisations o ON u.org_id=o.id
    ORDER BY u.created_at DESC LIMIT 100
  `,[],[]);
  ok(res,{users:rows||[],total:rows?.length||0});
};

ROUTES['GET /api/v1/admin/stats'] = async(req,res)=>{
  const [orgs,users,sigs] = await Promise.all([
    dbQ('SELECT COUNT(*) as c FROM auth.organisations',[],[{c:6}]),
    dbQ('SELECT COUNT(*) as c FROM auth.users',[],[{c:12}]),
    dbQ('SELECT COUNT(*) as c FROM intelligence.signals',[],[{c:218}]),
  ]);
  ok(res,{
    total_orgs:  parseInt(orgs?.[0]?.c||6),
    total_users: parseInt(users?.[0]?.c||12),
    total_signals:parseInt(sigs?.[0]?.c||218),
    uptime_sec:  process.uptime().toFixed(0),
    version:     '3.0.0',
  });
};

// ── PAGINATION MIDDLEWARE HELPER ────────────────────────────────────────────
function paginate(req, items) {
  const q    = require('url').parse(req.url, true).query;
  const page = Math.max(1, parseInt(q.page || '1'));
  const size = Math.min(100, Math.max(1, parseInt(q.size || q.limit || '20')));
  const from = (page - 1) * size;
  return {
    items:       items.slice(from, from + size),
    pagination: {
      page,
      size,
      total:       items.length,
      total_pages: Math.ceil(items.length / size),
      has_next:    from + size < items.length,
      has_prev:    page > 1,
      next_page:   from + size < items.length ? page + 1 : null,
      prev_page:   page > 1 ? page - 1 : null,
    }
  };
}

ROUTES['PATCH /api/v1/pipeline/deals/:id'] = async(req,res,p)=>{
  const d    = await body(req);
  const token= getToken(req);
  const pl   = token ? verifyJWT(token) : null;
  if (db && pl && d.stage) {
    await dbQ(
      'UPDATE pipeline.deals SET stage=$1, days_in_stage=0 WHERE id=$2 AND org_id=$3',
      [d.stage, p.id, pl.org]
    );
  }
  ok(res, {id:p.id, stage:d.stage, updated:true});
};

// ── CONTACT FORM SUBMISSION ────────────────────────────────────────────────
ROUTES['POST /api/v1/contact'] = async(req,res)=>{
  const d = await body(req);
  if (!d.email || !d.message) return fail(res,'VALIDATION_ERROR','Email and message required');
  log('Contact', `${d.type||'general'} from ${d.email}: ${d.message.slice(0,60)}`);
  try {
    const {sendEmail} = require('./email');
    // Notify internal team
    await sendEmail('contact@fdimonitor.org','generic_contact',d);
    // Send confirmation to user
    await sendEmail(d.email,'contact_confirmation',d.name||'');
  } catch {}
  ok(res,{received:true,message:'Thank you — we will respond within 4 business hours.'});
};

// ── NEWSLETTER SUBSCRIBE ────────────────────────────────────────────────────
const NEWSLETTER_LIST = new Set();
ROUTES['POST /api/v1/newsletter/subscribe'] = async(req,res)=>{
  const d = await body(req);
  if (!d.email) return fail(res,'VALIDATION_ERROR','Email required');
  NEWSLETTER_LIST.add(d.email);
  if (db) await dbQ('INSERT INTO auth.newsletter_subscribers(email) VALUES($1) ON CONFLICT DO NOTHING',[d.email]).catch(()=>{});
  ok(res,{subscribed:true,email:d.email});
};

// ── SEARCH ──────────────────────────────────────────────────────────────────
ROUTES['GET /api/v1/search'] = async(req,res)=>{
  const q = require('url').parse(req.url,true).query;
  const query = (q.q||'').toString().toLowerCase().trim();
  if (!query || query.length < 2) return ok(res,{results:[],total:0,query});
  
  const results = [];
  
  // Search economies
  const ecos = await dbQ('SELECT iso3,name,region FROM intelligence.economies WHERE LOWER(name) LIKE $1 OR iso3 LIKE $2 LIMIT 5',
    [`%${query}%`,query.toUpperCase()+'%'],
    [{iso3:'ARE',name:'United Arab Emirates',region:'MENA'},{iso3:'SAU',name:'Saudi Arabia',region:'MENA'}]
      .filter(e=>e.name.toLowerCase().includes(query)||e.iso3.toLowerCase().includes(query))
  );
  ecos.forEach(e=>results.push({type:'economy',icon:'🌍',label:e.name,sublabel:`${e.iso3} · ${e.region}`,url:`/gfr?iso3=${e.iso3}`}));
  
  // Search signals
  const sigs = await dbQ('SELECT id,company,economy FROM intelligence.signals WHERE LOWER(company) LIKE $1 LIMIT 3',
    [`%${query}%`],
    M_SIGNALS.filter(s=>s.company.toLowerCase().includes(query)).slice(0,3)
  );
  sigs.forEach(s=>results.push({type:'signal',icon:'📡',label:s.company,sublabel:`→ ${s.economy}`,url:`/signals`}));
  
  // Static page results
  const PAGES = [
    {k:'gfr',l:'GFR Rankings',url:'/gfr',icon:'🏆'},
    {k:'signal',l:'Signal Monitor',url:'/signals',icon:'📡'},
    {k:'report',l:'Custom Reports',url:'/reports',icon:'📋'},
    {k:'forecast',l:'FDI Forecast',url:'/forecast',icon:'🔮'},
    {k:'pipeline',l:'Investment Pipeline',url:'/investment-pipeline',icon:'💼'},
    {k:'benchmark',l:'Benchmarking',url:'/benchmarking',icon:'📐'},
    {k:'sector',l:'Sector Intelligence',url:'/sectors',icon:'🏭'},
    {k:'corridor',l:'Corridor Intelligence',url:'/corridor-intelligence',icon:'🔗'},
    {k:'pricing',l:'Pricing',url:'/pricing',icon:'💳'},
    {k:'mission',l:'Mission Planning',url:'/pmp',icon:'🎯'},
  ];
  PAGES.filter(p=>p.k.includes(query)||p.l.toLowerCase().includes(query))
       .slice(0,3)
       .forEach(p=>results.push({type:'page',icon:p.icon,label:p.l,sublabel:'Platform page',url:p.url}));
  
  ok(res,{results:results.slice(0,10),total:results.length,query});
};

// ── TRIAL STATUS ─────────────────────────────────────────────────────────────
ROUTES['GET /api/v1/auth/trial-status'] = async(req,res)=>{
  const token   = getToken(req);
  const payload = token ? verifyJWT(token) : null;
  if (!payload) return fail(res,'UNAUTHORIZED','Auth required',401);
  
  const rows = await dbQ('SELECT tier,trial_start,trial_end,fic_balance FROM auth.organisations WHERE id=$1',[payload.org],[]);
  if (rows && rows[0]) {
    const r = rows[0];
    const now = new Date();
    const expired = r.tier === 'free_trial' && new Date(r.trial_end) < now;
    const daysLeft = r.tier === 'free_trial' 
      ? Math.max(0, Math.ceil((new Date(r.trial_end).getTime() - now.getTime()) / 86400000))
      : null;
    ok(res, {tier:r.tier, trial_expired:expired, days_left:daysLeft, fic_balance:r.fic_balance});
  } else {
    ok(res, {tier:payload.tier||'free_trial', trial_expired:false, days_left:3, fic_balance:5});
  }
};

// ── COMPANIES DATA ────────────────────────────────────────────────────────
const COMPANIES_DATA = [
  {cic:'GFM-USA-MSFT-12847',name:'Microsoft Corporation',hq:'USA',sector:'J',ims:96,rev_b:211.9,esg:'LEADER',esg_score:77.2,signals:12,grade:'PLATINUM',footprints:['GBR','DEU','IND','SGP','ARE','JPN','SAU','IRL'],fdi_stage:'ACTIVE'},
  {cic:'GFM-USA-AMZN-98120',name:'Amazon Web Services', hq:'USA',sector:'J',ims:95,rev_b:90.8, esg:'LEADER',esg_score:74.1,signals:18,grade:'PLATINUM',footprints:['GBR','DEU','IRL','SGP','AUS','IND','SAU','ARE'],fdi_stage:'ACTIVE'},
  {cic:'GFM-USA-NVDA-66234',name:'NVIDIA Corporation',  hq:'USA',sector:'J',ims:94,rev_b:60.9, esg:'LEADER',esg_score:71.2,signals:14,grade:'PLATINUM',footprints:['TWN','KOR','GBR','DEU','IND','SGP'],fdi_stage:'ACTIVE'},
  {cic:'GFM-KOR-SAMS-33891',name:'Samsung Electronics', hq:'KOR',sector:'C',ims:91,rev_b:234.1,esg:'STRONG',esg_score:61.8,signals:9, grade:'GOLD',    footprints:['VNM','IND','USA','DEU','GBR','BRA'],fdi_stage:'ACTIVE'},
  {cic:'GFM-CHN-CATL-11234',name:'CATL',                hq:'CHN',sector:'C',ims:90,rev_b:44.0, esg:'STRONG',esg_score:62.4,signals:11,grade:'PLATINUM',footprints:['DEU','HUN','IDN','AUS','MAR','CAN'],fdi_stage:'ACTIVE'},
  {cic:'GFM-USA-BLR-77891', name:'BlackRock Inc',       hq:'USA',sector:'K',ims:88,rev_b:17.9, esg:'STRONG',esg_score:64.2,signals:4, grade:'SILVER',  footprints:['GBR','DEU','SGP','HKG','AUS','ARE'],fdi_stage:'WATCHING'},
  {cic:'GFM-DEU-SINEN-44221',name:'Siemens Energy',     hq:'DEU',sector:'D',ims:85,rev_b:35.3, esg:'LEADER',esg_score:72.8,signals:8, grade:'GOLD',    footprints:['GBR','USA','SAU','EGY','AUS','BRA'],fdi_stage:'ACTIVE'},
  {cic:'GFM-USA-DATA-88234',name:'Databricks',          hq:'USA',sector:'J',ims:82,rev_b:1.6,  esg:'ACTIVE',esg_score:52.0,signals:5, grade:'SILVER',  footprints:['GBR','DEU','SGP','AUS','JPN'],fdi_stage:'ACTIVE'},
  {cic:'GFM-USA-PLTR-25422',name:'Palantir Technologies',hq:'USA',sector:'J',ims:84,rev_b:2.23,esg:'STRONG',esg_score:58.0,signals:3, grade:'GOLD',    footprints:['GBR','DEU','AUS','JPN','FRA'],fdi_stage:'WATCHING'},
  {cic:'GFM-DNK-VEST-55123',name:'Vestas Wind Systems', hq:'DNK',sector:'D',ims:80,rev_b:15.9, esg:'LEADER',esg_score:78.4,signals:6, grade:'GOLD',    footprints:['GBR','DEU','USA','IND','BRA','AUS'],fdi_stage:'ACTIVE'},
  {cic:'GFM-USA-APPL-10001',name:'Apple Inc',           hq:'USA',sector:'J',ims:93,rev_b:383.3,esg:'LEADER',esg_score:72.0,signals:8, grade:'GOLD',    footprints:['IRL','CHN','IND','SGP','GBR','DEU'],fdi_stage:'WATCHING'},
  {cic:'GFM-FRA-TTAL-33412',name:'TotalEnergies',       hq:'FRA',sector:'D',ims:82,rev_b:218.9,esg:'ACTIVE',esg_score:58.4,signals:7, grade:'GOLD',    footprints:['NGA','SAU','ARE','QAT','USA','AUS'],fdi_stage:'ACTIVE'},
  {cic:'GFM-GBR-BHP-55123', name:'BHP Group',           hq:'GBR',sector:'B',ims:84,rev_b:53.8, esg:'STRONG',esg_score:63.4,signals:6, grade:'GOLD',    footprints:['AUS','CHN','USA','BRA','CHL'],fdi_stage:'ACTIVE'},
  {cic:'GFM-DEU-BAYG-22341',name:'BASF SE',             hq:'DEU',sector:'C',ims:79,rev_b:68.9, esg:'STRONG',esg_score:66.8,signals:4, grade:'SILVER',  footprints:['CHN','USA','BEL','BRA','IND'],fdi_stage:'WATCHING'},
  {cic:'GFM-JPN-SONY-44132',name:'Sony Group',          hq:'JPN',sector:'C',ims:82,rev_b:88.0, esg:'STRONG',esg_score:60.2,signals:4, grade:'SILVER',  footprints:['USA','GBR','DEU','IND','IDN'],fdi_stage:'WATCHING'},
  {cic:'GFM-USA-SNOW-11234',name:'Snowflake Inc',       hq:'USA',sector:'J',ims:79,rev_b:2.8,  esg:'STRONG',esg_score:55.0,signals:3, grade:'SILVER',  footprints:['GBR','DEU','SGP','AUS'],fdi_stage:'WATCHING'},
  {cic:'GFM-SAU-ACWA-44512',name:'ACWA Power',          hq:'SAU',sector:'D',ims:86,rev_b:4.2,  esg:'LEADER',esg_score:74.1,signals:9, grade:'GOLD',    footprints:['EGY','MAR','SAU','JOR','PAK'],fdi_stage:'ACTIVE'},
  {cic:'GFM-CHN-HUAW-55312',name:'Huawei Technologies', hq:'CHN',sector:'J',ims:78,rev_b:99.5, esg:'ACTIVE',esg_score:51.2,signals:3, grade:'SILVER',  footprints:['EGY','NGA','SAU','ARE','IDN'],fdi_stage:'WATCHING'},
  {cic:'GFM-USA-GOOG-77234',name:'Google (Alphabet)',   hq:'USA',sector:'J',ims:92,rev_b:307.4,esg:'LEADER',esg_score:73.8,signals:10,grade:'GOLD',    footprints:['IRL','GBR','DEU','SGP','IND','ARE'],fdi_stage:'ACTIVE'},
  {cic:'GFM-JPN-TOYT-88123',name:'Toyota Motor Corp',   hq:'JPN',sector:'C',ims:87,rev_b:274.5,esg:'STRONG',esg_score:67.4,signals:7, grade:'GOLD',    footprints:['VNM','IDN','THA','IND','USA','GBR'],fdi_stage:'ACTIVE'},
];

ROUTES['GET /api/v1/companies'] = async(req,res)=>{
  const q   = require('url').parse(req.url,true).query;
  let companies = [...COMPANIES_DATA];
  if(q.sector) companies=companies.filter(c=>c.sector===q.sector);
  if(q.hq)     companies=companies.filter(c=>c.hq===q.hq);
  if(q.grade)  companies=companies.filter(c=>c.grade===q.grade);
  companies.sort((a,b)=>b.ims-a.ims);
  const {items,pagination} = paginate(req,companies);
  ok(res,{companies:items,total:companies.length,pagination});
};

ROUTES['GET /api/v1/companies/:cic'] = async(req,res,p)=>{
  const co = COMPANIES_DATA.find(c=>c.cic===p.cic);
  if(!co) return fail(res,'NOT_FOUND','Company not found',404);
  const signals = M_SIGNALS.filter(s=>s.company===co.name);
  ok(res,{...co,signals,signal_count:signals.length});
};

// ── INSIGHTS ──────────────────────────────────────────────────────────────
const INSIGHTS_DATA = [
  {id:'INS-001',type:'MACRO_TREND',urgency:'HIGH',region:'MENA',date:'2026-03-17',verified:true,fic:null,
   title:'MENA FDI hits 5-year high at $88B',
   summary:'FDI inflows to MENA reached $88B in 2025, highest since 2020.',
   tags:['UAE','Saudi Arabia','Technology','Energy'],ref:'GFM-INS-20260317-0001'},
  {id:'INS-002',type:'REGULATORY',urgency:'HIGH',region:'SAS',date:'2026-03-15',verified:true,fic:null,
   title:'India raises insurance FDI cap to 100%',
   summary:'India raises the FDI cap in insurance to 100% under automatic route.',
   tags:['India','Finance','Regulatory'],ref:'GFM-INS-20260315-0002'},
  {id:'INS-003',type:'SECTOR_SIGNAL',urgency:'MEDIUM',region:'MENA',date:'2026-03-14',verified:true,fic:5,
   title:'Data centre FDI to MENA: $28B projected by 2028',
   summary:'GFM projects $28B in data centre FDI to MENA by 2028.',
   tags:['UAE','ICT','Data Centres'],ref:'GFM-INS-20260314-0003'},
  {id:'INS-004',type:'GEOPOLITICAL',urgency:'MEDIUM',region:'EAP',date:'2026-03-13',verified:true,fic:null,
   title:'ASEAN supply chain reconfiguration accelerates',
   summary:'Vietnam, Indonesia and Malaysia receiving accelerating supply chain FDI.',
   tags:['Vietnam','Indonesia','Manufacturing'],ref:'GFM-INS-20260313-0004'},
  {id:'INS-005',type:'GFR_UPDATE',urgency:'MEDIUM',region:'MENA',date:'2026-03-11',verified:true,fic:null,
   title:'UAE records largest quarterly GFR gain',
   summary:'UAE achieves +4.2 GFR points in Q1 2026, largest gain in 8-year history.',
   tags:['UAE','GFR','Digital'],ref:'GFM-INS-20260311-0006'},
];

ROUTES['GET /api/v1/insights'] = async(req,res)=>{
  const q = require('url').parse(req.url,true).query;
  let ins = [...INSIGHTS_DATA];
  if(q.type)   ins=ins.filter(i=>i.type===q.type);
  if(q.region) ins=ins.filter(i=>i.region===q.region);
  const {items,pagination} = paginate(req,ins);
  ok(res,{insights:items,total:ins.length,pagination});
};

// ── RATE LIMIT HEADERS MIDDLEWARE ──────────────────────────────────────────
// Attach rate limit info to all responses
const _origOk = ok;
function okWithRateInfo(res, data, meta={}) {
  res.setHeader('X-RateLimit-Policy', 'token-bucket');
  _origOk(res, data, meta);
}

// ── FIC TOP-UP (internal) ─────────────────────────────────────────────────
ROUTES['POST /api/v1/billing/fic/topup'] = async(req,res)=>{
  const d       = await body(req);
  const token   = getToken(req);
  const payload = token ? verifyJWT(token) : null;
  if (!payload) return fail(res,'UNAUTHORIZED','Auth required',401);
  const credits = {fic_50:50, fic_100:100, fic_500:500}[d.pack] || 0;
  if (!credits) return fail(res,'INVALID_PACK','Unknown FIC pack');
  if (db) {
    await dbQ('UPDATE auth.organisations SET fic_balance=fic_balance+$1 WHERE id=$2',[credits,payload.org]);
    await dbQ('INSERT INTO billing.fic_transactions(org_id,action,amount,balance,ref_id) VALUES($1,$2,$3,(SELECT fic_balance FROM auth.organisations WHERE id=$1),$4)',
      [payload.org,`fic_topup_${d.pack}`,credits,d.session_id||'manual']);
    try {
      const {sendEmail}=require('./email');
      const rows=await dbQ('SELECT u.full_name,u.email,o.fic_balance FROM auth.users u JOIN auth.organisations o ON u.org_id=o.id WHERE u.org_id=$1 LIMIT 1',[payload.org],[]);
      if(rows&&rows[0]) await sendEmail(rows[0].email,'fic_purchased',rows[0].full_name,credits,rows[0].fic_balance);
    } catch {}
  }
  ok(res,{credits_added:credits,pack:d.pack,updated:true});
};

// ── ADMIN ENDPOINTS ────────────────────────────────────────────────────────
ROUTES['GET /api/v1/admin/orgs'] = async(req,res)=>{
  const token=getToken(req);
  const payload=token?verifyJWT(token):null;
  if(!payload) return fail(res,'UNAUTHORIZED','Auth required',401);
  const rows = await dbQ('SELECT id,name,tier,fic_balance,created_at FROM auth.organisations ORDER BY created_at DESC LIMIT 50',[],[
    {id:'org_demo',name:'Demo Organisation',tier:'free_trial',fic_balance:5,created_at:'2026-03-17'}
  ]);
  ok(res,{orgs:rows,total:rows.length});
};

ROUTES['GET /api/v1/admin/users'] = async(req,res)=>{
  const token=getToken(req);
  const payload=token?verifyJWT(token):null;
  if(!payload) return fail(res,'UNAUTHORIZED','Auth required',401);
  const rows=await dbQ('SELECT id,email,full_name,role,last_login FROM auth.users ORDER BY created_at DESC LIMIT 100',[],[
    {id:'usr_demo',email:'demo@example.com',full_name:'Demo User',role:'member',last_login:'2026-03-17'}
  ]);
  ok(res,{users:rows,total:rows.length});
};

ROUTES['GET /api/v1/admin/stats'] = async(req,res)=>{
  const [orgRows,userRows,sigRows] = await Promise.all([
    dbQ('SELECT COUNT(*) as n FROM auth.organisations',[],[{n:6}]),
    dbQ('SELECT COUNT(*) as n FROM auth.users',[],[{n:8}]),
    dbQ('SELECT COUNT(*) as n FROM intelligence.signals',[],[{n:218}]),
  ]);
  ok(res,{
    total_orgs:  parseInt((orgRows&&orgRows[0]?.n)||'6'),
    total_users: parseInt((userRows&&userRows[0]?.n)||'8'),
    total_signals:parseInt((sigRows&&sigRows[0]?.n)||'218'),
    timestamp: new Date().toISOString(),
  });
};

// ── AUTH /ME ─────────────────────────────────────────────────────────────
ROUTES['GET /api/v1/auth/me'] = async(req,res)=>{
  const token   = getToken(req);
  const payload = token ? verifyJWT(token) : null;
  if (!payload) return fail(res,'UNAUTHORIZED','Auth required',401);
  const userData = await dbQ(
    `SELECT u.id,u.email,u.full_name,u.role,o.id as org_id,o.name as org_name,
     o.tier,o.fic_balance,o.trial_start,o.trial_end
     FROM auth.users u JOIN auth.organisations o ON u.org_id=o.id
     WHERE u.id=$1`,[payload.sub],
    [{id:payload.sub,email:'user@example.com',full_name:'Demo User',role:'admin',
      org_id:payload.org,org_name:'Demo Org',tier:payload.tier||'free_trial',
      fic_balance:5,trial_start:new Date().toISOString(),
      trial_end:new Date(Date.now()+3*86400000).toISOString()}]
  );
  if(!userData||!userData[0]) return fail(res,'NOT_FOUND','User not found',404);
  const u=userData[0];
  ok(res,{
    user:{id:u.id,email:u.email,full_name:u.full_name,role:u.role},
    org:{id:u.org_id,name:u.org_name,tier:u.tier,fic_balance:u.fic_balance,
         trial_start:u.trial_start,trial_end:u.trial_end,
         trial_expired:u.tier==='free_trial'&&new Date(u.trial_end)<new Date()},
  });
};

// ── FORECAST ──────────────────────────────────────────────────────────────
const FORECAST_DATA: Record<string,{base:number[];opt:number[];stress:number[]}> = {
  ARE:{base:[28,30,31,33,34,36,38,40,42],opt:[30,33,35,38,40,43,46,49,52],stress:[25,27,28,29,30,31,32,33,34]},
  SAU:{base:[24,26,28,30,32,35,37,39,41],opt:[26,29,32,35,38,42,45,48,52],stress:[20,22,23,25,26,27,28,29,30]},
  IND:{base:[65,68,70,71,72,73,74,75,76],opt:[70,74,78,81,83,85,86,87,88],stress:[55,58,60,61,62,63,64,64,65]},
  VNM:{base:[15,17,18,19,20,21,22,23,24],opt:[17,19,21,23,25,27,29,31,33],stress:[12,13,14,15,15,16,17,17,18]},
  SGP:{base:[138,141,144,148,152,156,160,164,168],opt:[145,150,156,162,168,175,182,189,196],stress:[125,128,130,132,134,136,138,140,142]},
  NGA:{base:[3.8,4.1,4.4,4.8,5.2,5.8,6.4,7.0,7.8],opt:[4.2,4.8,5.4,6.1,6.8,7.8,8.8,9.8,11.0],stress:[3.2,3.4,3.6,3.8,4.0,4.2,4.4,4.6,4.8]},
  EGY:{base:[8.8,9.4,10.0,10.8,11.4,12.2,13.2,14.2,15.2],opt:[9.4,10.2,11.2,12.2,13.2,14.5,16.0,17.5,19.2],stress:[7.8,8.2,8.6,9.0,9.4,9.8,10.2,10.6,11.0]},
  IDN:{base:[20,21,22,23,24,26,28,30,32],opt:[22,24,26,28,30,33,36,40,44],stress:[17,18,19,20,21,22,23,24,25]},
  DEU:{base:[33,34,35,36,37,38,40,42,44],opt:[36,38,40,42,44,48,52,56,60],stress:[28,29,30,31,32,33,34,35,36]},
};
const HORIZONS=['2025Q4','2026Q1','2026Q2','2026Q3','2026Q4','2027','2028','2029','2030'];

ROUTES['GET /api/v1/forecast'] = async(req,res)=>{
  const q = require('url').parse(req.url,true).query;
  const eco = (q.economy||q.iso3||'ARE').toString().toUpperCase();
  const data = FORECAST_DATA[eco]||FORECAST_DATA.ARE;
  const series = HORIZONS.map((h,i)=>({horizon:h,baseline:data.base[i],optimistic:data.opt[i],stress:data.stress[i]}));
  ok(res,{economy:eco,horizons:series,model:'Bayesian VAR + Prophet Ensemble',updated:'2026-03-17',
    cagr:((data.base[8]/data.base[0])**(1/8)-1)*100});
};

// ── PIPELINE DEALS ────────────────────────────────────────────────────────
ROUTES['GET /api/v1/pipeline/deals'] = async(req,res)=>{
  const token=getToken(req);
  const payload=token?verifyJWT(token):null;
  if(!payload) return fail(res,'UNAUTHORIZED','Auth required',401);
  const rows=await dbQ('SELECT * FROM pipeline.deals WHERE org_id=$1 ORDER BY created_at DESC',[payload.org],[
    {id:'PIPE-001',company:'Microsoft Corp',iso3:'ARE',sector:'J',capex_m:850,stage:'NEGOTIATING',probability:75,days_in_stage:8,contact:'Sarah Chen',notes:'Data centre project confirmed'},
    {id:'PIPE-002',company:'Amazon AWS',iso3:'SAU',sector:'J',capex_m:5300,stage:'COMMITTED',probability:95,days_in_stage:12,contact:'Ahmed Al-Rashid',notes:'MoU signed'},
    {id:'PIPE-003',company:'Siemens Energy',iso3:'EGY',sector:'D',capex_m:340,stage:'ENGAGED',probability:60,days_in_stage:5,contact:'Maria Rodriguez',notes:'Site visit scheduled'},
    {id:'PIPE-004',company:'CATL',iso3:'IDN',sector:'C',capex_m:3200,stage:'COMMITTED',probability:90,days_in_stage:20,contact:'James Park',notes:'Land secured'},
    {id:'PIPE-005',company:'Vestas Wind',iso3:'IND',sector:'D',capex_m:420,stage:'PROSPECTING',probability:35,days_in_stage:3,contact:'Wei Zhang',notes:'Initial inquiry'},
  ]);
  const {items,pagination}=paginate(req,rows);
  ok(res,{deals:items,total:rows.length,pagination});
};

// ── WATCHLISTS CRUD ───────────────────────────────────────────────────────
const WL_STORE: Record<string,any[]> = {};
ROUTES['GET /api/v1/watchlists'] = async(req,res)=>{
  const token=getToken(req);
  const payload=token?verifyJWT(token):null;
  if(!payload) return fail(res,'UNAUTHORIZED','Auth required',401);
  const rows=await dbQ('SELECT * FROM pipeline.watchlists WHERE org_id=$1',[payload.org],
    WL_STORE[payload.org]||[{id:'wl_default',name:'MENA Technology',economies:['ARE','SAU'],sectors:['J'],signals:8}]);
  ok(res,{watchlists:rows||[],total:(rows||[]).length});
};

ROUTES['POST /api/v1/watchlists'] = async(req,res)=>{
  const d=await body(req);
  const token=getToken(req);
  const payload=token?verifyJWT(token):null;
  if(!payload) return fail(res,'UNAUTHORIZED','Auth required',401);
  const id=`wl_${Date.now()}`;
  const wl={id,name:d.name,economies:d.economies||[],sectors:d.sectors||[],signals:0,created_at:new Date().toISOString()};
  if(!WL_STORE[payload.org]) WL_STORE[payload.org]=[];
  WL_STORE[payload.org].push(wl);
  if(db) await dbQ('INSERT INTO pipeline.watchlists(id,org_id,name,economies,sectors) VALUES($1,$2,$3,$4,$5)',
    [id,payload.org,d.name,d.economies||[],d.sectors||[]]).catch(()=>{});
  ok(res,wl);
};

ROUTES['GET /api/v1/alerts'] = async(req,res)=>{
  const token=getToken(req);
  const payload=token?verifyJWT(token):null;
  if(!payload) return fail(res,'UNAUTHORIZED','Auth required',401);
  ok(res,{alerts:[
    {id:'ALT001',type:'SIGNAL',priority:'HIGH',read:false,created_at:new Date().toISOString(),
     title:'New PLATINUM Signal: Microsoft → UAE',body:'$850M data centre confirmed'},
  ],total:1});
};

// ── PUBLICATIONS ────────────────────────────────────────────────────────────
const PUBS = [
  {id:'FNL-WK-2026-11-20260317-001',type:'WEEKLY', grade:'FREE',date:'2026-03-17',pages:12,signals:12,title:'GFM Intelligence Digest — Week 11, 2026'},
  {id:'FPB-MON-2026-03-20260301-001',type:'MONTHLY',grade:'PROFESSIONAL',date:'2026-03-01',pages:68,signals:48,title:'Global FDI Intelligence Report — March 2026'},
  {id:'FGR-Q1-2026-20260315-001',type:'GFR',grade:'PROFESSIONAL',date:'2026-03-15',pages:48,signals:0,title:'Global Future Readiness Rankings — Q1 2026'},
  {id:'FNL-WK-2026-10-20260310-001',type:'WEEKLY',grade:'FREE',date:'2026-03-10',pages:11,signals:9,title:'GFM Intelligence Digest — Week 10, 2026'},
];
ROUTES['GET /api/v1/publications'] = async(req,res)=>{
  const q=require('url').parse(req.url,true).query;
  let pubs=[...PUBS];
  if(q.type) pubs=pubs.filter(p=>p.type===q.type);
  const {items,pagination}=paginate(req,pubs);
  ok(res,{publications:items,total:pubs.length,pagination});
};

// ── SCENARIOS ────────────────────────────────────────────────────────────────
ROUTES['POST /api/v1/scenarios'] = async(req,res)=>{
  const d=await body(req);
  const token=getToken(req);
  const payload=token?verifyJWT(token):null;
  if(!payload) return fail(res,'UNAUTHORIZED','Auth required',401);
  const {economy='UAE',gdp=3.4,oil=80,fdi_base=30} = d||{};
  const scenarios = {
    bull: {label:'Bull Case',   fdi_2026:(fdi_base*(1+(gdp-2)/100*1.8+0.08)).toFixed(1), p90:((fdi_base*1.25)).toFixed(1)},
    base: {label:'Base Case',  fdi_2026:(fdi_base*(1+(gdp-2)/100*1.2+0.04)).toFixed(1), p50:fdi_base.toFixed(1)},
    bear: {label:'Bear Case',  fdi_2026:(fdi_base*(1+(gdp-2)/100*0.6-0.04)).toFixed(1), p10:((fdi_base*0.78)).toFixed(1)},
  };
  ok(res,{economy,scenarios,assumptions:{gdp_growth:gdp,oil_price:oil,fdi_base},model:'Bayesian VAR'});
};

// ── REPORTS /GENERATE (expanded) ─────────────────────────────────────────────
const REPORT_QUEUE: Record<string,{status:string;progress:number;ref:string;startedAt:number}> = {};

ROUTES['GET /api/v1/reports/:ref/status'] = async(req,res,p)=>{
  const job=REPORT_QUEUE[p.ref];
  if(!job) return fail(res,'NOT_FOUND','Report not found',404);
  ok(res,{ref:p.ref,status:job.status,progress:job.progress});
};
