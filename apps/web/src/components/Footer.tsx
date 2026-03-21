'use client';
import Link from 'next/link';

const COLS = [
  { title: 'Platform', links: [
    {l:'Dashboard',h:'/dashboard'},{l:'Investment Analysis',h:'/investment-analysis'},
    {l:'Market Signals',h:'/signals'},{l:'GFR Ranking',h:'/gfr'},
    {l:'Sector Monitor',h:'/sectors'},{l:'Corridor Intel',h:'/corridors'},
    {l:'Pipeline Tracker',h:'/pipeline'},{l:'Scenario Planner',h:'/scenario-planner'},
  ]},
  { title: 'Intelligence', links: [
    {l:'Country Profiles',h:'/country/MYS'},{l:'Market Insights',h:'/insights'},
    {l:'Watchlists',h:'/watchlists'},{l:'Alerts Centre',h:'/alerts'},
    {l:'Publications',h:'/publications'},{l:'Sector Monitor',h:'/sectors'},
    {l:'GOSA Methodology',h:'/about#gosa'},{l:'Data Sources',h:'/sources'},
  ]},
  { title: 'Company', links: [
    {l:'About Us',h:'/about'},{l:'Contact',h:'/contact'},
    {l:'FAQ',h:'/faq'},{l:'API Documentation',h:'/api-docs'},
    {l:'Privacy Policy',h:'/privacy'},{l:'Terms of Service',h:'/terms'},
  ]},
];

export default function Footer() {
  return (
    <footer style={{ background: '#1A2C3E', color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
      <div style={{ maxWidth: '1540px', margin: '0 auto', padding: '56px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <svg width="28" height="28" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" stroke="#2ECC71" strokeWidth="2" fill="none"/>
                <ellipse cx="16" cy="16" rx="7" ry="14" stroke="#2ECC71" strokeWidth="1.5" fill="none"/>
                <line x1="2" y1="16" x2="30" y2="16" stroke="#2ECC71" strokeWidth="1.5"/>
                <circle cx="22" cy="10" r="4" fill="#2ECC71"/>
              </svg>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.05em' }}>GLOBAL FDI MONITOR</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>Investment Intelligence Platform</div>
              </div>
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
              Global investment intelligence. Real-time. Verified. Smart.
            </p>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              <a href="mailto:info@fdimonitor.org" style={{ color: '#2ECC71', textDecoration: 'none' }}>info@fdimonitor.org</a>
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {col.links.map(link => (
                  <Link key={link.l} href={link.h} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as any).style.color = '#2ECC71'; }}
                    onMouseLeave={e => { (e.currentTarget as any).style.color = 'rgba(255,255,255,0.55)'; }}>
                    {link.l}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>© 2026 Global FDI Monitor. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[['1000+','Official Sources'],['23+','Country Profiles'],['215+','Economies Tracked']].map(([v,l]) => (
              <div key={l} style={{ padding: '4px 12px', background: 'rgba(46,204,113,0.08)', borderRadius: '20px', fontSize: '11px', color: 'rgba(255,255,255,0.5)', display: 'flex', gap: '5px' }}>
                <span style={{ fontWeight: 700, color: '#2ECC71' }}>{v}</span> {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
