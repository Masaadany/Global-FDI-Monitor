'use strict';
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');

const app = express();
const server = createServer(app);

let wss = null;
try {
  const { WebSocketServer } = require('ws');
  wss = new WebSocketServer({ server, path:'/ws/signals' });
  console.log('WebSocket active on /ws/signals');
} catch(e) { console.warn('WS unavailable:', e.message); }

app.use(cors({ origin:'*', credentials:true }));
app.use(express.json());

app.get('/health', (req,res) => res.json({
  status:'ok', version:'3.0.0', ws:wss?'active':'unavailable', timestamp:new Date().toISOString()
}));

const COUNTRIES = [
  {id:'SGP',name:'Singapore',flag:'🇸🇬',gosa:88.4,l1:92.1,l2:85.3,l3:87.2,l4:89.0,trend:0.2,tier:'TOP',region:'Asia Pacific'},
  {id:'NZL',name:'New Zealand',flag:'🇳🇿',gosa:86.7,l1:89.5,l2:84.1,l3:85.8,l4:87.3,trend:-0.1,tier:'TOP',region:'Oceania'},
  {id:'DNK',name:'Denmark',flag:'🇩🇰',gosa:85.3,l1:87.2,l2:83.5,l3:84.9,l4:85.6,trend:0.3,tier:'TOP',region:'Europe'},
  {id:'KOR',name:'South Korea',flag:'🇰🇷',gosa:84.1,l1:86.0,l2:82.8,l3:83.5,l4:84.2,trend:0.1,tier:'TOP',region:'Asia Pacific'},
  {id:'USA',name:'United States',flag:'🇺🇸',gosa:83.9,l1:85.3,l2:82.1,l3:83.0,l4:85.1,trend:-0.2,tier:'TOP',region:'Americas'},
  {id:'GBR',name:'United Kingdom',flag:'🇬🇧',gosa:82.5,l1:84.1,l2:81.4,l3:82.2,l4:82.3,trend:-0.1,tier:'TOP',region:'Europe'},
  {id:'ARE',name:'UAE',flag:'🇦🇪',gosa:82.1,l1:83.4,l2:81.2,l3:82.8,l4:81.0,trend:1.2,tier:'TOP',region:'Middle East'},
  {id:'MYS',name:'Malaysia',flag:'🇲🇾',gosa:81.2,l1:82.5,l2:80.7,l3:81.8,l4:79.8,trend:0.4,tier:'HIGH',region:'Asia Pacific'},
  {id:'THA',name:'Thailand',flag:'🇹🇭',gosa:80.7,l1:81.8,l2:80.2,l3:81.0,l4:79.8,trend:0.2,tier:'HIGH',region:'Asia Pacific'},
  {id:'VNM',name:'Vietnam',flag:'🇻🇳',gosa:79.4,l1:80.5,l2:79.1,l3:78.9,l4:79.1,trend:0.5,tier:'HIGH',region:'Asia Pacific'},
  {id:'SAU',name:'Saudi Arabia',flag:'🇸🇦',gosa:79.1,l1:77.3,l2:80.4,l3:82.1,l4:76.6,trend:2.1,tier:'HIGH',region:'Middle East'},
  {id:'IDN',name:'Indonesia',flag:'🇮🇩',gosa:77.8,l1:78.9,l2:77.3,l3:77.5,l4:77.5,trend:0.1,tier:'HIGH',region:'Asia Pacific'},
  {id:'IND',name:'India',flag:'🇮🇳',gosa:73.2,l1:69.8,l2:74.6,l3:74.8,l4:73.6,trend:0.8,tier:'HIGH',region:'Asia Pacific'},
  {id:'BRA',name:'Brazil',flag:'🇧🇷',gosa:71.3,l1:68.4,l2:72.8,l3:71.2,l4:72.8,trend:0.4,tier:'HIGH',region:'Americas'},
  {id:'MAR',name:'Morocco',flag:'🇲🇦',gosa:66.8,l1:63.8,l2:68.2,l3:68.4,l4:66.8,trend:0.6,tier:'HIGH',region:'Africa'},
];
const SIGNALS = [
  {id:1,type:'POLICY_CHANGE',grade:'PLATINUM',country:'Malaysia',flag:'🇲🇾',title:'FDI cap in data centers raised to 100%',impact:'HIGH',sco:96},
  {id:2,type:'NEW_INCENTIVE',grade:'PLATINUM',country:'Thailand',flag:'🇹🇭',title:'$2B EV battery subsidy package approved',impact:'HIGH',sco:95},
  {id:3,type:'SECTOR_GROWTH',grade:'GOLD',country:'Vietnam',flag:'🇻🇳',title:'Electronics exports surge 34% YoY',impact:'MEDIUM',sco:92},
  {id:4,type:'ZONE_AVAIL',grade:'GOLD',country:'Indonesia',flag:'🇮🇩',title:'New Batam zone 200ha ready',impact:'MEDIUM',sco:91},
  {id:5,type:'COMPETITOR_MOVE',grade:'PLATINUM',country:'Indonesia',flag:'🇮🇩',title:'$15B nickel processing investment confirmed',impact:'HIGH',sco:93},
];

app.get('/api/v1/countries', (req,res) => {
  let data = [...COUNTRIES];
  if(req.query.region) data = data.filter(c=>c.region===req.query.region);
  if(req.query.tier) data = data.filter(c=>c.tier===req.query.tier);
  if(req.query.search) data = data.filter(c=>c.name.toLowerCase().includes(String(req.query.search).toLowerCase()));
  res.json({success:true,count:data.length,data});
});
app.get('/api/v1/countries/:id', (req,res) => {
  const c = COUNTRIES.find(c=>c.id===req.params.id.toUpperCase());
  if(!c) return res.status(404).json({success:false,error:'Not found'});
  res.json({success:true,data:c});
});
app.get('/api/v1/signals', (req,res) => res.json({success:true,count:SIGNALS.length,data:SIGNALS}));
app.post('/api/v1/reports/generate', (req,res) => {
  const c = COUNTRIES.find(x=>x.id===req.body.country_id)||COUNTRIES[0];
  res.json({success:true,data:{report_id:`RPT-${Date.now()}`,country:c.name,gosa:c.gosa,download_url:`https://api.fdimonitor.org/reports/GFM_${c.id}_${Date.now()}.html`,generated_at:new Date().toISOString()}});
});
app.post('/api/v1/auth/register', (req,res) => {
  const {email,name} = req.body;
  if(!email||!name) return res.status(400).json({success:false,error:'Name and email required'});
  res.json({success:true,data:{user_id:`USR-${Date.now()}`,email,name,tier:'trial',trial_end:new Date(Date.now()+7*86400000).toISOString(),token:`gfm_trial_${Date.now()}`}});
});
app.post('/api/v1/auth/login', (req,res) => {
  const {email} = req.body;
  if(!email) return res.status(400).json({success:false,error:'Email required'});
  res.json({success:true,data:{user_id:'USR-demo',email,tier:'professional',token:`gfm_pro_${Date.now()}`}});
});
app.get('/api/v1/agents/health', (req,res) => res.json({success:true,agents:[
  {id:'AGT-01',name:'Data Collection',status:'active',last_run:'2m ago'},
  {id:'AGT-02',name:'Signal Detection',status:'active',last_run:'2m ago'},
  {id:'AGT-03',name:'Verification',status:'active',last_run:'2m ago'},
  {id:'AGT-04',name:'GOSA Scoring',status:'active',last_run:'5m ago'},
  {id:'AGT-05',name:'GFR Ranking',status:'active',last_run:'10m ago'},
  {id:'AGT-06',name:'Newsletter',status:'idle',last_run:'6d ago'},
]}));
app.get('/api/v1/agents/run', async (req,res) => {
  const t=Date.now(); await new Promise(r=>setTimeout(r,80));
  res.json({success:true,data:{pipeline:'completed',duration_ms:Date.now()-t,stages:6,signals:28,economies:15}});
});

if(wss) {
  const types=['POLICY_CHANGE','NEW_INCENTIVE','SECTOR_GROWTH','ZONE_AVAIL','COMPETITOR_MOVE'];
  const ctrs=['Malaysia','Thailand','Vietnam','Indonesia','UAE','Singapore'];
  wss.on('connection',ws=>{
    SIGNALS.forEach(s=>ws.send(JSON.stringify({type:'signal',data:s})));
    const iv=setInterval(()=>{
      if(ws.readyState===1) ws.send(JSON.stringify({type:'signal',data:{id:Date.now(),type:types[Math.floor(Math.random()*types.length)],country:ctrs[Math.floor(Math.random()*ctrs.length)],title:'Live signal update',impact:'MEDIUM',sco:72+Math.floor(Math.random()*18),grade:'SILVER',timestamp:new Date().toISOString()}}));
    },8000);
    ws.on('close',()=>clearInterval(iv));
  });
}

const PORT = process.env.PORT||3001;
server.listen(PORT,()=>console.log(`GFM API v3.0 on port ${PORT}`));
