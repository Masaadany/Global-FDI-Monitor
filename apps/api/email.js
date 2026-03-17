/**
 * GFM Email Service
 * Uses Resend API for transactional emails.
 * Falls back to console.log in development.
 */

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.FROM_EMAIL || 'noreply@fdimonitor.org';
const APP_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api','').replace('api.','') || 'https://fdimonitor.org';

const TEMPLATES = {
  welcome: (name, fic) => ({
    subject: 'Welcome to Global FDI Monitor',
    html: `<div style="font-family:Inter,sans-serif;max-width:540px;margin:0 auto;padding:40px 20px">
      <div style="background:linear-gradient(135deg,#0A2540,#0A66C2);padding:32px;border-radius:16px;text-align:center;margin-bottom:32px">
        <div style="font-size:40px;margin-bottom:8px">🌍</div>
        <h1 style="color:white;margin:0;font-size:24px">Welcome to GFM</h1>
        <p style="color:rgba(255,255,255,0.7);margin:8px 0 0">Your free trial is active</p>
      </div>
      <p style="color:#334155;font-size:15px">Hi ${name},</p>
      <p style="color:#334155">You have <strong>${fic} FIC credits</strong> to explore premium FDI intelligence. Here's what to do first:</p>
      <div style="background:#F8FAFC;border-radius:12px;padding:20px;margin:20px 0">
        <p style="margin:0 0 12px;font-weight:bold;color:#0A2540">Quick Start:</p>
        <ol style="color:#64748B;margin:0;padding-left:20px;line-height:2">
          <li>Explore live signals at <a href="${APP_URL}/signals" style="color:#0A66C2">fdimonitor.org/signals</a></li>
          <li>Check your economy's GFR score at <a href="${APP_URL}/gfr" style="color:#0A66C2">fdimonitor.org/gfr</a></li>
          <li>Generate your first report with 5 FIC credits</li>
        </ol>
      </div>
      <a href="${APP_URL}/dashboard" style="display:block;background:#0A66C2;color:white;padding:14px;border-radius:10px;text-align:center;font-weight:bold;text-decoration:none;margin:20px 0">Go to Dashboard →</a>
      <p style="color:#94A3B8;font-size:12px;text-align:center">© 2026 Global FDI Monitor · Forecasta Ltd · Dubai, UAE</p>
    </div>`,
  }),

  password_reset: (name, link) => ({
    subject: 'Reset your GFM password',
    html: `<div style="font-family:Inter,sans-serif;max-width:540px;margin:0 auto;padding:40px 20px">
      <h2 style="color:#0A2540">Password Reset</h2>
      <p style="color:#334155">Hi ${name}, click below to reset your password. This link expires in 1 hour.</p>
      <a href="${link}" style="display:block;background:#0A66C2;color:white;padding:14px;border-radius:10px;text-align:center;font-weight:bold;text-decoration:none;margin:20px 0">Reset Password →</a>
      <p style="color:#94A3B8;font-size:12px">If you didn't request this, ignore this email.</p>
    </div>`,
  }),

  fic_purchased: (name, credits, newBalance) => ({
    subject: `${credits} FIC credits added to your account`,
    html: `<div style="font-family:Inter,sans-serif;max-width:540px;margin:0 auto;padding:40px 20px">
      <div style="background:#FEF3C7;border:1px solid #FCD34D;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
        <div style="font-size:36px">⭐</div>
        <div style="font-size:28px;font-weight:900;color:#92400E">${credits}</div>
        <div style="color:#78350F">FIC Credits Added</div>
      </div>
      <p style="color:#334155">Hi ${name}, your new balance is <strong>${newBalance} FIC</strong>.</p>
      <a href="${APP_URL}/reports" style="display:block;background:#0A66C2;color:white;padding:14px;border-radius:10px;text-align:center;font-weight:bold;text-decoration:none">Generate Intelligence Reports →</a>
    </div>`,
  }),

  report_ready: (name, reportType, refCode) => ({
    subject: `Your ${reportType} report is ready`,
    html: `<div style="font-family:Inter,sans-serif;max-width:540px;margin:0 auto;padding:40px 20px">
      <h2 style="color:#0A2540">Report Ready</h2>
      <p style="color:#334155">Hi ${name}, your <strong>${reportType}</strong> has been generated.</p>
      <div style="background:#F8FAFC;border-radius:8px;padding:12px;font-family:monospace;font-size:12px;color:#64748B;margin:16px 0">${refCode}</div>
      <a href="${APP_URL}/reports" style="display:block;background:#0A66C2;color:white;padding:14px;border-radius:10px;text-align:center;font-weight:bold;text-decoration:none">Download Report →</a>
    </div>`,
  }),

  fic_low: (name, balance) => ({
    subject: `Low FIC balance: ${balance} credits remaining`,
    html: `<div style="font-family:Inter,sans-serif;max-width:540px;margin:0 auto;padding:40px 20px">
      <h2 style="color:#D97706">⚠ Low FIC Balance</h2>
      <p style="color:#334155">Hi ${name}, you have <strong>${balance} FIC credits</strong> remaining.</p>
      <a href="${APP_URL}/fic" style="display:block;background:#D97706;color:white;padding:14px;border-radius:10px;text-align:center;font-weight:bold;text-decoration:none">Top Up FIC Credits →</a>
    </div>`,
  }),
};

async function sendEmail(to, template, ...args) {
  const tmpl = TEMPLATES[template];
  if (!tmpl) { console.error('[Email] Unknown template:', template); return false; }

  const { subject, html } = tmpl(...args);

  if (!RESEND_KEY) {
    console.log(`[Email DEV] To: ${to} | Subject: ${subject}`);
    return true;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_KEY}` },
      body:    JSON.stringify({ from: FROM, to, subject, html }),
    });
    const data = await res.json();
    if (!res.ok) { console.error('[Email]', data); return false; }
    console.log(`[Email] Sent: ${subject} → ${to}`);
    return true;
  } catch(err) {
    console.error('[Email] Error:', err.message);
    return false;
  }
}

module.exports = { sendEmail, TEMPLATES };
