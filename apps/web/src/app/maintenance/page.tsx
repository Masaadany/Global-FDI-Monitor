export default function MaintenancePage() {
  return (
    <html lang="en">
      <head>
        <title>Global FDI Monitor — Under Development</title>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <meta name="robots" content="noindex,nofollow"/>
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          body{min-height:100vh;background:linear-gradient(135deg,#061E30 0%,#0A3D62 50%,#0E4F7A 100%);
            display:flex;align-items:center;justify-content:center;font-family:'Segoe UI',sans-serif;
            position:relative;overflow:hidden}
          .grid{position:absolute;inset:0;
            background-image:linear-gradient(rgba(116,187,101,0.06) 1px,transparent 1px),
              linear-gradient(90deg,rgba(116,187,101,0.06) 1px,transparent 1px);
            background-size:48px 48px}
          .card{position:relative;z-index:1;max-width:560px;width:100%;text-align:center;padding:24px}
          .logo{font-size:28px;font-weight:900;letter-spacing:-0.5px;margin-bottom:32px}
          .logo .global{color:white}
          .logo .fdi{color:#74BB65;margin:0 6px}
          .logo .monitor{color:white}
          .icon-wrap{width:80px;height:80px;border-radius:50%;
            background:rgba(116,187,101,0.1);border:2px solid rgba(116,187,101,0.3);
            display:flex;align-items:center;justify-content:center;margin:0 auto 24px;
            animation:pulse 3s infinite}
          @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(116,187,101,0.3)}
            50%{box-shadow:0 0 0 20px rgba(116,187,101,0)}}
          .title{font-size:clamp(22px,4vw,32px);font-weight:900;color:white;margin-bottom:12px;line-height:1.2}
          .subtitle{font-size:15px;color:rgba(226,242,223,0.75);line-height:1.75;margin-bottom:32px}
          .badge{display:inline-flex;align-items:center;gap:8px;
            background:rgba(116,187,101,0.1);border:1px solid rgba(116,187,101,0.3);
            padding:8px 20px;border-radius:24px;margin-bottom:28px}
          .dot{width:9px;height:9px;border-radius:50%;background:#74BB65;animation:blink 1.5s infinite}
          @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
          .badge-text{font-size:12px;font-weight:800;color:#74BB65;letter-spacing:0.08em;text-transform:uppercase}
          .features{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:32px}
          .feat{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);
            border-radius:10px;padding:14px;text-align:left}
          .feat-icon{font-size:20px;margin-bottom:6px}
          .feat-title{font-size:12px;font-weight:700;color:white;margin-bottom:3px}
          .feat-desc{font-size:11px;color:rgba(226,242,223,0.6);line-height:1.4}
          .cta{background:rgba(116,187,101,0.1);border:1px solid rgba(116,187,101,0.2);
            border-radius:12px;padding:20px;margin-bottom:24px}
          .cta-title{font-size:14px;font-weight:700;color:white;margin-bottom:8px}
          .cta-form{display:flex;gap:0}
          .cta-input{flex:1;padding:11px 16px;border-radius:8px 0 0 8px;
            border:1px solid rgba(116,187,101,0.3);border-right:none;
            background:rgba(255,255,255,0.08);color:white;font-size:13px;outline:none}
          .cta-input::placeholder{color:rgba(226,242,223,0.4)}
          .cta-btn{padding:11px 18px;background:#74BB65;color:white;border:none;
            border-radius:0 8px 8px 0;cursor:pointer;font-size:13px;font-weight:700;
            white-space:nowrap}
          .footer-note{font-size:11px;color:rgba(226,242,223,0.35);line-height:1.6}
          .footer-note a{color:rgba(116,187,101,0.6);text-decoration:none}
        `}</style>
      </head>
      <body>
        <div className="grid"/>
        <div className="card">
          <div className="logo">
            <span className="global">GLOBAL</span>
            <span className="fdi">FDI</span>
            <span className="monitor">MONITOR</span>
          </div>
          <div className="icon-wrap">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#74BB65" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="badge">
            <span className="dot"/>
            <span className="badge-text">Under Development</span>
          </div>
          <h1 className="title">Investment Intelligence<br/>Platform — Coming Soon</h1>
          <p className="subtitle">
            Global FDI Monitor is being upgraded with new features including Investment Analysis, 
            live signal intelligence for 215 economies, and AI-powered weekly briefs.
          </p>
          <div className="features">
            {[{i:'⚡',t:'218+ Live FDI Signals',d:'Real-time intelligence, Z3 verified'},
              {i:'📊',t:'Investment Analysis',d:'GOSA scoring for 215 economies'},
              {i:'🎯',t:'Mission Planning',d:'Destination targeting & dossiers'},
              {i:'📄',t:'Weekly Intelligence Brief',d:'AI-generated PDF publication'},
            ].map(({i,t,d},idx)=>(
              <div key={idx} className="feat">
                <div className="feat-icon">{i}</div>
                <div className="feat-title">{t}</div>
                <div className="feat-desc">{d}</div>
              </div>
            ))}
          </div>
          <div className="cta">
            <div className="cta-title">Get notified when we launch</div>
            <div className="cta-form">
              <input className="cta-input" type="email" placeholder="your@organisation.com"/>
              <button className="cta-btn">Notify Me</button>
            </div>
          </div>
          <p className="footer-note">
            DIFC, Dubai, UAE · <a href="mailto:info@fdimonitor.org">info@fdimonitor.org</a>
            <br/>© 2026 Global FDI Monitor. All rights reserved.
          </p>
        </div>
      </body>
    </html>
  );
}
