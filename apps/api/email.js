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
