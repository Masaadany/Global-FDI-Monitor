/**
 * GFM EMAIL NOTIFICATION SYSTEM
 * Sends transactional emails via Azure Communication Services or SMTP.
 * Falls back to console logging in development.
 */
const crypto = require('crypto');

const EMAIL_FROM = process.env.EMAIL_FROM || 'notifications@fdimonitor.org';
const SMTP_HOST  = process.env.SMTP_HOST;
const SMTP_PORT  = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER  = process.env.SMTP_USER;
const SMTP_PASS  = process.env.SMTP_PASS;

// Email templates
const TEMPLATES = {
  welcome: (name, org) => ({
    subject: 'Welcome to Global FDI Monitor — Your 3-Day Trial Is Active',
    html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc">
  <div style="background:#0A2540;padding:24px;text-align:center">
    <h1 style="color:white;margin:0;font-size:22px">Global FDI Monitor</h1>
    <p style="color:#94a3b8;margin:8px 0 0">World's First Fully Integrated FDI Intelligence Platform</p>
  </div>
  <div style="padding:32px">
    <h2 style="color:#0A2540">Welcome, ${name}!</h2>
    <p style="color:#475569">Your 3-day free trial for <strong>${org}</strong> is now active.</p>
    <div style="background:#f1f5f9;border-radius:12px;padding:20px;margin:20px 0">
      <p style="margin:0 0 8px;font-weight:bold;color:#0A2540">Your trial includes:</p>
      <ul style="margin:0;padding-left:20px;color:#475569">
        <li>5 FIC credits (no credit card charged)</li>
        <li>Live Gold + Silver signals</li>
        <li>GFR Rankings preview</li>
        <li>Market Insights digest</li>
      </ul>
    </div>
    <div style="text-align:center;margin:24px 0">
      <a href="https://fdimonitor.org/dashboard" 
         style="background:#1D4ED8;color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:bold;display:inline-block">
        Open Dashboard →
      </a>
    </div>
    <p style="color:#94a3b8;font-size:13px">
      Questions? Reply to this email or contact <a href="mailto:support@fdimonitor.org">support@fdimonitor.org</a>
    </p>
  </div>
  <div style="background:#f1f5f9;padding:16px;text-align:center">
    <p style="color:#94a3b8;font-size:12px;margin:0">
      © 2026 Global FDI Monitor · <a href="https://fdimonitor.org/pricing">Upgrade Plan</a> · 
      <a href="https://fdimonitor.org/contact">Contact</a>
    </p>
  </div>
</div>`,
  }),

  signal_alert: (grade, company, economy, value, refCode) => ({
    subject: `${grade} Signal: ${company} → ${economy} (${value})`,
    html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <div style="background:#0A2540;padding:20px">
    <h2 style="color:white;margin:0">🚨 New ${grade} Signal</h2>
  </div>
  <div style="padding:24px">
    <div style="background:#f8fafc;border-radius:8px;padding:16px;border-left:4px solid #1D4ED8">
      <h3 style="margin:0 0 8px;color:#0A2540">${company}</h3>
      <p style="margin:0;color:#475569">Economy: ${economy} · Value: ${value}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;font-family:monospace">${refCode}</p>
    </div>
    <div style="text-align:center;margin:20px 0">
      <a href="https://fdimonitor.org/signals" style="background:#0A2540;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
        View Full Signal →
      </a>
    </div>
  </div>
</div>`,
  }),

  password_reset: (token) => ({
    subject: 'Reset your Global FDI Monitor password',
    html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc">
  <div style="background:#0A2540;padding:24px;text-align:center">
    <h1 style="color:white;margin:0;font-size:22px">Password Reset</h1>
    <p style="color:#94a3b8;margin:8px 0 0">Global FDI Monitor</p>
  </div>
  <div style="padding:32px">
    <h2 style="color:#0A2540">Reset your password</h2>
    <p style="color:#475569">Click the button below to reset your password. This link expires in 30 minutes.</p>
    <div style="text-align:center;margin:28px 0">
      <a href="https://fdimonitor.org/auth/reset?token=${token}"
         style="background:#1D4ED8;color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:bold;display:inline-block">
        Reset Password →
      </a>
    </div>
    <p style="color:#94a3b8;font-size:13px">If you didn't request this, you can ignore this email. Your password won't change.</p>
    <p style="color:#94a3b8;font-size:12px;font-family:monospace">Token (manual): ${token.slice(0,16)}…</p>
  </div>
</div>`,
  }),

  fic_low: (balance, orgName) => ({
    subject: `FIC Balance Low — ${balance} credits remaining`,
    html: `
<div style="font-family:Arial,sans-serif;max-width:600px">
  <div style="background:#f59e0b;padding:20px"><h2 style="color:white;margin:0">⭐ FIC Credits Running Low</h2></div>
  <div style="padding:24px">
    <p>Hi ${orgName}, your FIC balance is down to <strong>${balance} credits</strong>.</p>
    <a href="https://fdimonitor.org/fic" style="background:#0A2540;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
      Buy FIC Credits →
    </a>
  </div>
</div>`,
  }),
};

async function sendEmail(to, template, ...args) {
  const { subject, html } = TEMPLATES[template]?.(...args) || {};
  if (!subject) { console.warn(`Unknown template: ${template}`); return false; }

  // Try SMTP if configured
  if (SMTP_HOST && SMTP_USER) {
    try {
      const nodemailer = require('nodemailer');
      const transport  = nodemailer.createTransport({
        host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_PORT === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
      await transport.sendMail({ from: EMAIL_FROM, to, subject, html });
      console.log(`[Email] Sent "${subject}" to ${to}`);
      return true;
    } catch(e) {
      console.warn(`[Email] SMTP failed: ${e.message}`);
    }
  }

  // Dev fallback
  console.log(`[Email DEV] To: ${to} | Subject: ${subject}`);
  return true;
}

module.exports = { sendEmail, TEMPLATES };

// Additional email templates
Object.assign(TEMPLATES, {
  password_reset: (token) => ({
    subject: 'Reset Your GFM Password',
    html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <div style="background:#0A2540;padding:20px;text-align:center">
    <h1 style="color:white;margin:0;font-size:20px">Global FDI Monitor</h1>
  </div>
  <div style="padding:28px">
    <h2 style="color:#0A2540">Password Reset Request</h2>
    <p style="color:#475569">Click the button below to reset your password. This link expires in 30 minutes.</p>
    <div style="text-align:center;margin:24px 0">
      <a href="https://fdimonitor.org/auth/reset?token=${token}" 
         style="background:#1D4ED8;color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:bold">
        Reset Password →
      </a>
    </div>
    <p style="color:#94a3b8;font-size:12px">If you didn't request this, ignore this email. Your password won't change.</p>
    <p style="color:#94a3b8;font-size:12px">Link: https://fdimonitor.org/auth/reset?token=${token}</p>
  </div>
</div>`,
  }),

  signal_weekly: (count, platinum, topSignal) => ({
    subject: `GFM Week ${new Date().toISOString().slice(0,10)} — ${count} new signals, ${platinum} PLATINUM`,
    html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <div style="background:#0A2540;padding:20px">
    <h1 style="color:white;margin:0">📡 Weekly Signal Summary</h1>
    <p style="color:#94a3b8;margin:4px 0 0">Global FDI Monitor · ${new Date().toLocaleDateString()}</p>
  </div>
  <div style="padding:24px">
    <div style="display:flex;gap:16px;margin-bottom:20px">
      <div style="flex:1;background:#f8fafc;border-radius:8px;padding:16px;text-align:center">
        <div style="font-size:28px;font-weight:900;color:#0A2540">${count}</div>
        <div style="font-size:12px;color:#64748b">New Signals</div>
      </div>
      <div style="flex:1;background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:16px;text-align:center">
        <div style="font-size:28px;font-weight:900;color:#d97706">${platinum}</div>
        <div style="font-size:12px;color:#64748b">Platinum</div>
      </div>
    </div>
    ${topSignal ? `
    <div style="background:#f1f5f9;border-radius:8px;padding:16px;margin-bottom:20px">
      <div style="font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;margin-bottom:8px">TOP SIGNAL THIS WEEK</div>
      <div style="font-weight:700;color:#0A2540">${topSignal.company} → ${topSignal.economy}</div>
      <div style="color:#3b82f6;font-size:18px;font-weight:900">${topSignal.value}</div>
    </div>` : ''}
    <a href="https://fdimonitor.org/signals" style="background:#0A2540;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
      View All Signals →
    </a>
  </div>
</div>`,
  }),

  trial_expiring: (name, daysLeft, ficBalance) => ({
    subject: `Your GFM Trial Expires in ${daysLeft} Day${daysLeft>1?'s':''}`,
    html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <div style="background:#f59e0b;padding:20px">
    <h1 style="color:white;margin:0">⏰ Trial Ending Soon</h1>
  </div>
  <div style="padding:24px">
    <p>Hi ${name}, your GFM free trial expires in <strong>${daysLeft} day${daysLeft>1?'s':''}</strong>.</p>
    <p>You have <strong>${ficBalance} FIC credits</strong> remaining.</p>
    <p>Upgrade to Professional ($899/month) to keep access to:</p>
    <ul style="color:#475569">
      <li>All PLATINUM + GOLD signals</li>
      <li>4,800 FIC credits/year</li>
      <li>Custom reports + mission planning</li>
      <li>GFR deep-dives for all 215 economies</li>
    </ul>
    <a href="https://fdimonitor.org/pricing" style="background:#1D4ED8;color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:bold;display:inline-block;margin-top:8px">
      Upgrade Now →
    </a>
    <p style="color:#94a3b8;font-size:12px;margin-top:16px">Questions? Reply to this email or contact sales@fdimonitor.org</p>
  </div>
</div>`,
  }),

  fic_purchased: (name, credits, newBalance) => ({
    subject: `⭐ ${credits} FIC Credits Added — Balance: ${newBalance}`,
    html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <div style="background:#0A2540;padding:20px">
    <h1 style="color:white;margin:0">⭐ FIC Credits Added</h1>
  </div>
  <div style="padding:24px;text-align:center">
    <div style="font-size:64px;margin-bottom:8px">⭐</div>
    <h2 style="color:#0A2540">+${credits} FIC credits added, ${name}!</h2>
    <p style="color:#64748b">New balance: <strong style="font-size:24px;color:#0A2540">${newBalance} FIC</strong></p>
    <a href="https://fdimonitor.org/reports" style="background:#1D4ED8;color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:bold;display:inline-block;margin-top:16px">
      Generate a Report →
    </a>
  </div>
</div>`,
  }),
});
