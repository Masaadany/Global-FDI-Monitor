'use client';
// Email HTML preview — responsive, branded newsletter template
// This renders the HTML email template that gets sent to 12,847 subscribers

export default function EmailPreviewPage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <title>Global FDI Monitor — Weekly Intelligence Brief #047</title>
  <style>
    body{margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif}
    .wrapper{max-width:650px;margin:0 auto;background:white}
    .header{background:linear-gradient(135deg,#1a2c3e 0%,#0d1f2d 100%);padding:32px 40px;text-align:center}
    .logo{font-size:22px;font-weight:900;color:white;letter-spacing:-0.5px}
    .logo .fdi{color:#2ecc71}
    .issue-badge{display:inline-block;margin-top:10px;padding:4px 16px;border:1px solid rgba(46,204,113,0.4);
      border-radius:20px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.7);letter-spacing:0.1em}
    .hero{background:#1a2c3e;padding:28px 40px;border-top:1px solid rgba(46,204,113,0.2)}
    .hero-label{font-size:10px;font-weight:800;color:#2ecc71;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:8px}
    .hero-headline{font-size:20px;font-weight:900;color:white;line-height:1.35}
    .body{padding:36px 40px;background:white}
    .section-title{font-size:11px;font-weight:800;color:#1a2c3e;text-transform:uppercase;letter-spacing:0.12em;
      border-left:3px solid #2ecc71;padding-left:10px;margin:24px 0 14px}
    .summary-box{background:#f8f9fa;border-left:4px solid #2ecc71;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:10px}
    .summary-box p{margin:0;font-size:13px;color:#333;line-height:1.7}
    .regional-grid{display:table;width:100%;border-collapse:separate;border-spacing:8px}
    .regional-cell{display:table-cell;width:33%;background:#f8f9fa;border-radius:8px;padding:14px;vertical-align:top}
    .regional-score{font-size:22px;font-weight:900;color:#1a2c3e;font-family:monospace}
    .regional-change-up{color:#2ecc71;font-weight:700;font-size:12px}
    .regional-change-dn{color:#e74c3c;font-weight:700;font-size:12px}
    .signal-row{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid #f0f0f0}
    .signal-num{font-size:14px;font-weight:900;color:#ccc;font-family:monospace;min-width:22px}
    .signal-type{font-size:10px;font-weight:800;color:#2ecc71}
    .signal-text{font-size:12px;color:#333;font-weight:600}
    .cta-block{background:linear-gradient(135deg,#1a2c3e,#0d1f2d);border-radius:12px;padding:28px;text-align:center;margin:28px 0}
    .cta-title{font-size:18px;font-weight:900;color:white;margin-bottom:8px}
    .cta-sub{font-size:13px;color:rgba(255,255,255,0.7);line-height:1.65;margin-bottom:18px}
    .cta-btn{display:inline-block;background:#2ecc71;color:white;padding:12px 32px;border-radius:8px;
      text-decoration:none;font-weight:800;font-size:14px;letter-spacing:0.02em}
    .footer{background:#1a2c3e;padding:24px 40px;text-align:center}
    .footer p{font-size:11px;color:rgba(255,255,255,0.4);margin:4px 0;line-height:1.6}
    .footer a{color:rgba(46,204,113,0.7);text-decoration:none}
    @media(max-width:600px){
      .header,.hero,.body{padding-left:20px;padding-right:20px}
      .hero-headline{font-size:17px}
      .regional-grid,.regional-cell{display:block;width:100%;margin-bottom:8px}
    }
  </style>
</head>
<body>
<div class="wrapper">
  <!-- HEADER -->
  <div class="header">
    <div class="logo">GLOBAL <span class="fdi">FDI</span> MONITOR</div>
    <div class="issue-badge">WEEKLY INTELLIGENCE BRIEF &nbsp;·&nbsp; ISSUE #047 &nbsp;·&nbsp; MARCH 24, 2026</div>
  </div>

  <!-- HERO -->
  <div class="hero">
    <div class="hero-label">🚀 Top Global Update</div>
    <div class="hero-headline">
      Vietnam, Thailand, Malaysia Form "ASEAN EV Corridor" —<br/>$25B Supply Chain Investment Reshapes Southeast Asia
    </div>
  </div>

  <!-- BODY -->
  <div class="body">
    <!-- Executive Summary -->
    <div class="section-title">Executive Summary</div>
    <div class="summary-box">
      <p>This week's intelligence confirms a structural shift in global supply chains toward Southeast Asia. 
      The ASEAN EV Corridor represents the most significant regional investment integration in a decade, 
      with Vietnam, Thailand, and Malaysia capturing $25B in committed capital.</p>
    </div>
    <div class="summary-box">
      <p><strong>For Investors:</strong> Vietnam offers fastest land acquisition; Thailand provides strongest 
      incentives; Malaysia delivers most mature semiconductor base. Diversify across all three.</p>
    </div>

    <!-- Regional -->
    <div class="section-title">Regional Investment Analysis</div>
    <div class="regional-grid">
      <div class="regional-cell">
        <div style="font-size:10px;font-weight:800;color:#999;text-transform:uppercase;margin-bottom:5px">Asia Pacific</div>
        <div class="regional-score">78.4</div>
        <span class="regional-change-up">▲ +0.6</span>
        <div style="font-size:11px;color:#333;margin-top:5px">Vietnam — EV battery subsidy approved</div>
      </div>
      <div class="regional-cell">
        <div style="font-size:10px;font-weight:800;color:#999;text-transform:uppercase;margin-bottom:5px">Europe & Middle East</div>
        <div class="regional-score">74.2</div>
        <span class="regional-change-dn">▼ -0.2</span>
        <div style="font-size:11px;color:#333;margin-top:5px">UAE — $10B AI fund launched</div>
      </div>
      <div class="regional-cell">
        <div style="font-size:10px;font-weight:800;color:#999;text-transform:uppercase;margin-bottom:5px">Americas & Africa</div>
        <div class="regional-score">69.8</div>
        <span class="regional-change-up">▲ +0.3</span>
        <div style="font-size:11px;color:#333;margin-top:5px">Brazil — $5B data center investment</div>
      </div>
    </div>

    <!-- Top 5 Signals -->
    <div class="section-title">Top 5 Investment Signals This Week</div>
    ${[
      {n:1,c:'🔴',t:'POLICY CHANGE',eco:'Malaysia',txt:'FDI cap in data centers raised to 100%'},
      {n:2,c:'🟢',t:'NEW INCENTIVE',eco:'Thailand',txt:'$2B EV battery subsidy package approved'},
      {n:3,c:'🔵',t:'SECTOR GROWTH',eco:'Vietnam',txt:'Electronics exports surge 34% YoY'},
      {n:4,c:'🟡',t:'ZONE AVAILABILITY',eco:'Indonesia',txt:'New Batam zone with 200ha ready'},
      {n:5,c:'🔵',t:'COMPETITOR MOVEMENT',eco:'Indonesia',txt:'$15B nickel processing investment'},
    ].map(s=>`
    <div class="signal-row">
      <span class="signal-num">#${s.n}</span>
      <span style="font-size:16px">${s.c}</span>
      <div>
        <div class="signal-type">${s.t} &nbsp;·&nbsp; ${s.eco}</div>
        <div class="signal-text">${s.txt}</div>
      </div>
    </div>`).join('')}
    <div style="text-align:right;margin-top:8px">
      <a href="https://fdimonitor.org/signals" style="font-size:11px;color:#2ecc71;font-weight:700;text-decoration:none">
        View all 218+ live signals →
      </a>
    </div>

    <!-- CTA -->
    <div class="cta-block">
      <div class="cta-title">Download the Full 4-Page PDF Brief</div>
      <div class="cta-sub">Full analysis, regional breakdowns, sector intelligence, and Investment Analysis methodology.</div>
      <a href="https://fdimonitor.org/publications" class="cta-btn">Download PDF Publication</a>
    </div>

    <div style="text-align:center;margin-top:16px">
      <a href="https://fdimonitor.org/investment-analysis" style="font-size:12px;color:#2ecc71;font-weight:700;text-decoration:none">
        Run Your Own Investment Analysis → fdimonitor.org/investment-analysis
      </a>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <p><strong style="color:rgba(255,255,255,0.7)">Global FDI Monitor</strong> &nbsp;·&nbsp; info@fdimonitor.org</p>
    <p><a href="https://fdimonitor.org">www.fdimonitor.org</a> &nbsp;·&nbsp; <a href="mailto:info@fdimonitor.org">info@fdimonitor.org</a></p>
    <p style="margin-top:12px">
      <a href="https://fdimonitor.org/newsletter/unsubscribe">Unsubscribe</a> &nbsp;·&nbsp; 
      <a href="https://fdimonitor.org/privacy">Privacy Policy</a> &nbsp;·&nbsp; 
      © 2026 Global FDI Monitor. All rights reserved.
    </p>
  </div>
</div>
</body>
</html>`;

  return (
    <div style={{background:'#f4f4f4',minHeight:'100vh',padding:'20px'}}>
      <div style={{maxWidth:'700px',margin:'0 auto'}}>
        <div style={{background:'white',borderRadius:'8px',padding:'12px 16px',marginBottom:'12px',
          display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
          <span style={{fontWeight:700,fontSize:'14px',color:'#1a2c3e'}}>📧 Email Template Preview — Issue #047</span>
          <div style={{display:'flex',gap:'8px'}}>
            <a href="/newsletter" style={{padding:'7px 14px',border:'1px solid rgba(10,61,98,0.15)',borderRadius:'7px',
              color:'#696969',textDecoration:'none',fontSize:'12px',fontWeight:600}}>← Admin Review</a>
            <a href="/newsletter/preview" style={{padding:'7px 14px',background:'#1a2c3e',borderRadius:'7px',
              color:'white',textDecoration:'none',fontSize:'12px',fontWeight:700}}>PDF Preview →</a>
          </div>
        </div>
        <div dangerouslySetInnerHTML={{__html: html}}/>
      </div>
    </div>
  );
}
