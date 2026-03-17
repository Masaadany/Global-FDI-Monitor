const http = require('http');
const url  = require('url');

const PORT = process.env.PORT || 3001;

const ROUTES = {
  '/api/v1/health': (req, res) => {
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify({
      status: 'ok',
      service: 'Global FDI Monitor API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production'
    }));
  },

  '/api/v1/auth/register': (req, res) => {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (!data.email || !data.password) {
          res.writeHead(400, {'Content-Type':'application/json'});
          return res.end(JSON.stringify({success:false,error:{code:'VALIDATION_ERROR',message:'Email and password required'}}));
        }
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({
          success: true,
          data: {
            user: { id: 'usr_' + Date.now(), email: data.email, full_name: data.full_name || '' },
            org:  { id: 'org_' + Date.now(), name: data.org_name || '', tier: 'free_trial', trial_expired: false },
            tokens: {
              accessToken:  'gfm_at_' + Buffer.from(data.email).toString('base64') + '_' + Date.now(),
              refreshToken: 'gfm_rt_' + Date.now()
            }
          }
        }));
      } catch(e) {
        res.writeHead(400, {'Content-Type':'application/json'});
        res.end(JSON.stringify({success:false,error:{code:'INVALID_JSON'}}));
      }
    });
  },

  '/api/v1/auth/login': (req, res) => {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (!data.email || !data.password) {
          res.writeHead(401, {'Content-Type':'application/json'});
          return res.end(JSON.stringify({success:false,error:{code:'INVALID_CREDENTIALS',message:'Incorrect email or password'}}));
        }
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({
          success: true,
          data: {
            user: { id: 'usr_001', email: data.email },
            org:  { id: 'org_001', tier: 'free_trial', trial_expired: false, fic_balance: 5 },
            tokens: {
              accessToken:  'gfm_at_' + Date.now(),
              refreshToken: 'gfm_rt_' + Date.now()
            }
          }
        }));
      } catch(e) {
        res.writeHead(400, {'Content-Type':'application/json'});
        res.end(JSON.stringify({success:false,error:{code:'INVALID_JSON'}}));
      }
    });
  },

  '/api/v1/signals': (req, res) => {
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify({
      success: true,
      data: {
        signals: [
          {id:'SIG001',grade:'PLATINUM',company:'Microsoft Corp',economy:'UAE',sector:'J',capex_usd:850000000,sci_score:91.2,signal_code:'MSS-GFS-ARE-20260317-0001'},
          {id:'SIG002',grade:'GOLD',company:'Amazon Web Services',economy:'Saudi Arabia',sector:'J',capex_usd:5300000000,sci_score:88.4,signal_code:'MSS-CES-SAU-20260317-0002'},
          {id:'SIG003',grade:'PLATINUM',company:'Siemens Energy',economy:'Egypt',sector:'D',capex_usd:340000000,sci_score:86.1,signal_code:'MSS-GFS-EGY-20260317-0003'},
        ],
        total: 3,
        page: 1
      }
    }));
  },

  '/api/v1/economies': (req, res) => {
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify({success:true,data:{total:215,economies:[]}}));
  }
};

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const pathname = url.parse(req.url).pathname;
  const handler  = ROUTES[pathname];

  if (handler) {
    handler(req, res);
  } else {
    res.writeHead(404, {'Content-Type':'application/json'});
    res.end(JSON.stringify({success:false,error:{code:'NOT_FOUND',message:`${pathname} not found`}}));
  }
});

server.listen(PORT, () => {
  console.log(`GFM API running on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/v1/health`);
});
