/**
 * GFM DATABASE MIGRATION
 * Run once after Azure PostgreSQL is connected.
 * Command: node DEPLOYMENT/migrate.js
 * Or via Azure Container Job.
 */
const { Pool } = require('pg');

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const MIGRATIONS = [

  // ── SCHEMAS ────────────────────────────────────────────────────────────
  `CREATE SCHEMA IF NOT EXISTS auth`,
  `CREATE SCHEMA IF NOT EXISTS intelligence`,
  `CREATE SCHEMA IF NOT EXISTS sources`,
  `CREATE SCHEMA IF NOT EXISTS billing`,
  `CREATE SCHEMA IF NOT EXISTS pipeline`,

  // ── AUTH ───────────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS auth.organisations (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name        TEXT NOT NULL,
    org_type    TEXT DEFAULT 'IPA',
    country     TEXT,
    tier        TEXT DEFAULT 'free_trial',
    fic_balance INT  DEFAULT 5,
    trial_start TIMESTAMPTZ DEFAULT NOW(),
    trial_end   TIMESTAMPTZ DEFAULT NOW() + INTERVAL '3 days',
    stripe_id   TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS auth.users (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    org_id      TEXT REFERENCES auth.organisations(id),
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    full_name   TEXT,
    role        TEXT DEFAULT 'member',
    last_login  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
  )`,

  // ── INTELLIGENCE ───────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS intelligence.economies (
    iso3        CHAR(3)  PRIMARY KEY,
    iso2        CHAR(2),
    name        TEXT NOT NULL,
    region      TEXT,
    income_group TEXT,
    population_m NUMERIC,
    gdp_usd_b   NUMERIC,
    fdi_inflows_b NUMERIC,
    updated_at  TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS intelligence.signals (
    id          TEXT PRIMARY KEY,
    grade       TEXT NOT NULL CHECK (grade IN ('PLATINUM','GOLD','SILVER','BRONZE')),
    company     TEXT NOT NULL,
    hq          TEXT,
    iso3        CHAR(3),
    economy     TEXT,
    sector      TEXT,
    capex_usd   BIGINT,
    sci_score   NUMERIC(5,2),
    signal_type TEXT,
    status      TEXT,
    description TEXT,
    source_urls TEXT[],
    signal_date DATE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS intelligence.gfr_scores (
    iso3        CHAR(3)  NOT NULL,
    quarter     TEXT     NOT NULL,
    composite   NUMERIC(5,2),
    macro       SMALLINT, policy SMALLINT, digital SMALLINT,
    human       SMALLINT, infra  SMALLINT, sustain SMALLINT,
    tier        TEXT,
    rank        SMALLINT,
    PRIMARY KEY (iso3, quarter)
  )`,

  `CREATE TABLE IF NOT EXISTS intelligence.companies (
    cic         TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    hq          TEXT,
    sector      TEXT,
    ims_score   NUMERIC(5,2),
    revenue_b   NUMERIC,
    employees   INT,
    listed      BOOLEAN DEFAULT true,
    esg_tier    TEXT,
    esg_score   NUMERIC(5,2),
    footprints  TEXT[],
    updated_at  TIMESTAMPTZ DEFAULT NOW()
  )`,

  // ── SOURCES ────────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS sources.data_points (
    id          BIGSERIAL PRIMARY KEY,
    indicator   TEXT NOT NULL,
    iso3        TEXT,
    year        SMALLINT,
    value       DOUBLE PRECISION,
    unit        TEXT,
    source      TEXT,
    source_url  TEXT,
    hash        CHAR(16) UNIQUE,
    fetched_at  TIMESTAMPTZ DEFAULT NOW()
  )`,

  // ── BILLING ────────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS billing.subscriptions (
    id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    org_id        TEXT REFERENCES auth.organisations(id),
    stripe_sub_id TEXT,
    tier          TEXT NOT NULL,
    status        TEXT DEFAULT 'active',
    price_monthly NUMERIC,
    fic_annual    INT,
    current_period_end TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS billing.fic_transactions (
    id        BIGSERIAL PRIMARY KEY,
    org_id    TEXT,
    action    TEXT NOT NULL,
    amount    INT  NOT NULL,
    balance   INT  NOT NULL,
    ref_id    TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // ── PIPELINE ───────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS pipeline.deals (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    org_id      TEXT,
    company     TEXT NOT NULL,
    hq          TEXT,
    iso3        CHAR(3),
    sector      TEXT,
    capex_m     NUMERIC,
    stage       TEXT DEFAULT 'TARGETED',
    probability SMALLINT DEFAULT 20,
    contact     TEXT,
    notes       TEXT,
    days_in_stage INT DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS pipeline.watchlists (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    org_id      TEXT,
    name        TEXT NOT NULL,
    economies   TEXT[],
    sectors     TEXT[],
    created_at  TIMESTAMPTZ DEFAULT NOW()
  )`,

  // ── INDEXES ────────────────────────────────────────────────────────────
  `CREATE INDEX IF NOT EXISTS idx_signals_grade   ON intelligence.signals(grade)`,
  `CREATE INDEX IF NOT EXISTS idx_signals_iso3    ON intelligence.signals(iso3)`,
  `CREATE INDEX IF NOT EXISTS idx_signals_date    ON intelligence.signals(signal_date DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_gfr_rank        ON intelligence.gfr_scores(rank)`,
  `CREATE INDEX IF NOT EXISTS idx_dp_indicator    ON sources.data_points(indicator)`,
  `CREATE INDEX IF NOT EXISTS idx_dp_iso3         ON sources.data_points(iso3)`,
  `CREATE INDEX IF NOT EXISTS idx_users_email     ON auth.users(email)`,

  // ── SEED: 30 key economies ─────────────────────────────────────────────
  `INSERT INTO intelligence.economies (iso3,iso2,name,region,income_group,gdp_usd_b,fdi_inflows_b) VALUES
    ('ARE','AE','United Arab Emirates','MENA','HIC',504,30.7),
    ('SAU','SA','Saudi Arabia','MENA','HIC',1069,28.3),
    ('QAT','QA','Qatar','MENA','HIC',236,5.2),
    ('EGY','EG','Egypt','MENA','LMIC',395,9.8),
    ('IND','IN','India','SAS','LMIC',3730,71.0),
    ('CHN','CN','China','EAP','UMIC',17795,163.0),
    ('SGP','SG','Singapore','EAP','HIC',501,141.2),
    ('VNM','VN','Vietnam','EAP','LMIC',430,18.1),
    ('IDN','ID','Indonesia','EAP','UMIC',1371,22.0),
    ('USA','US','United States','NAM','HIC',27360,285.0),
    ('GBR','GB','United Kingdom','ECA','HIC',3079,52.0),
    ('DEU','DE','Germany','ECA','HIC',4430,35.4),
    ('FRA','FR','France','ECA','HIC',2924,28.1),
    ('IRL','IE','Ireland','ECA','HIC',529,94.5),
    ('NLD','NL','Netherlands','ECA','HIC',1081,92.4),
    ('AUS','AU','Australia','EAP','HIC',1688,59.4),
    ('JPN','JP','Japan','EAP','HIC',4213,30.5),
    ('KOR','KR','South Korea','EAP','HIC',1710,18.4),
    ('BRA','BR','Brazil','LAC','UMIC',2130,65.1),
    ('MEX','MX','Mexico','LAC','UMIC',1328,36.1),
    ('NGA','NG','Nigeria','SSA','LMIC',477,4.1),
    ('ZAF','ZA','South Africa','SSA','UMIC',373,5.4),
    ('KEN','KE','Kenya','SSA','LMIC',118,1.8),
    ('NOR','NO','Norway','ECA','HIC',485,12.3),
    ('CHE','CH','Switzerland','ECA','HIC',884,26.4),
    ('CAN','CA','Canada','NAM','HIC',2140,48.3),
    ('KAZ','KZ','Kazakhstan','ECA','UMIC',259,8.1),
    ('TUR','TR','Turkey','ECA','UMIC',1108,12.4),
    ('MYS','MY','Malaysia','EAP','UMIC',430,14.2),
    ('THA','TH','Thailand','EAP','UMIC',545,9.8)
  ON CONFLICT (iso3) DO UPDATE SET
    gdp_usd_b=EXCLUDED.gdp_usd_b, fdi_inflows_b=EXCLUDED.fdi_inflows_b`,

  // ── SEED: GFR Q1 2026 top 10 ──────────────────────────────────────────
  `INSERT INTO intelligence.gfr_scores (iso3,quarter,composite,macro,policy,digital,human,infra,sustain,tier,rank) VALUES
    ('SGP','Q1 2026',88.5,87,91,87,63,94,62,'FRONTIER',1),
    ('USA','Q1 2026',84.5,89,83,91,74,86,68,'FRONTIER',2),
    ('ARE','Q1 2026',80.0,82,78,84,54,92,53,'FRONTIER',3),
    ('DEU','Q1 2026',78.1,81,86,78,70,84,77,'HIGH',4),
    ('GBR','Q1 2026',78.5,80,84,82,71,80,72,'HIGH',5),
    ('NOR','Q1 2026',83.2,85,88,84,75,82,91,'FRONTIER',6),
    ('SAU','Q1 2026',68.1,74,62,68,45,72,47,'HIGH',7),
    ('IND','Q1 2026',62.3,68,56,59,69,65,38,'MEDIUM',8),
    ('BRA','Q1 2026',54.2,58,52,55,62,56,48,'MEDIUM',9),
    ('NGA','Q1 2026',42.1,48,38,40,44,38,35,'EMERGING',10)
  ON CONFLICT (iso3,quarter) DO UPDATE SET composite=EXCLUDED.composite`,

  // ── SEED: admin user ──────────────────────────────────────────────────
  `INSERT INTO auth.organisations (id,name,org_type,tier,fic_balance)
   VALUES ('org_admin','Global FDI Monitor','PLATFORM','enterprise',999999)
   ON CONFLICT (id) DO NOTHING`,
];

async function migrate() {
  console.log('\n════════════════════════════════════════');
  console.log('  GFM Database Migration');
  console.log('════════════════════════════════════════\n');

  let success = 0, failed = 0;
  for (const sql of MIGRATIONS) {
    const label = sql.trim().slice(0,60).replace(/\s+/g,' ') + '…';
    try {
      await db.query(sql);
      console.log(`  ✓ ${label}`);
      success++;
    } catch(e) {
      if (e.code === '42P07' || e.code === '42P01') {
        console.log(`  ○ ${label} (exists)`);
        success++;
      } else {
        console.error(`  ✗ ${label}`);
        console.error(`    ${e.message}`);
        failed++;
      }
    }
  }

  console.log(`\n  ${success} OK  ${failed} failed`);

  // Verify
  const counts = await db.query(`
    SELECT 'economies' as t, COUNT(*) FROM intelligence.economies
    UNION ALL SELECT 'gfr_scores', COUNT(*) FROM intelligence.gfr_scores
    UNION ALL SELECT 'signals', COUNT(*) FROM intelligence.signals
    UNION ALL SELECT 'users', COUNT(*) FROM auth.users
  `);
  console.log('\n  Seeded data:');
  for (const row of counts.rows) {
    console.log(`    ${row.t}: ${row.count}`);
  }
  console.log('\n  Migration complete.\n');
  await db.end();
}

migrate().catch(e => { console.error(e); process.exit(1); });

// ── ADDITIONAL TABLES ─────────────────────────────────────────────────────
const EXTRA_TABLES = [
  `CREATE SCHEMA IF NOT EXISTS pipeline`,
  `CREATE SCHEMA IF NOT EXISTS notifications`,
  `CREATE SCHEMA IF NOT EXISTS billing`,

  `CREATE TABLE IF NOT EXISTS pipeline.deals (
    id          TEXT PRIMARY KEY,
    org_id      TEXT NOT NULL,
    company     TEXT NOT NULL,
    hq          TEXT,
    iso3        TEXT,
    sector      TEXT,
    capex_m     NUMERIC,
    stage       TEXT DEFAULT 'PROSPECTING',
    probability SMALLINT DEFAULT 20,
    contact     TEXT,
    days        SMALLINT DEFAULT 0,
    notes       TEXT,
    grade       TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS pipeline.watchlists (
    id          TEXT PRIMARY KEY,
    org_id      TEXT NOT NULL,
    name        TEXT NOT NULL,
    economies   TEXT[],
    sectors     TEXT[],
    created_at  TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS notifications.alerts (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    org_id      TEXT NOT NULL,
    type        TEXT NOT NULL,
    priority    TEXT DEFAULT 'MEDIUM',
    title       TEXT NOT NULL,
    body        TEXT,
    read        BOOLEAN DEFAULT false,
    created_at  TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS billing.fic_transactions (
    id          BIGSERIAL PRIMARY KEY,
    org_id      TEXT NOT NULL,
    action      TEXT NOT NULL,
    amount      NUMERIC NOT NULL,
    balance     NUMERIC,
    ref_id      TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS intelligence.gfr_scores (
    iso3        TEXT NOT NULL,
    quarter     TEXT NOT NULL,
    composite   NUMERIC(5,2),
    macro       NUMERIC(5,2),
    policy      NUMERIC(5,2),
    digital     NUMERIC(5,2),
    human       NUMERIC(5,2),
    infra       NUMERIC(5,2),
    sustain     NUMERIC(5,2),
    tier        TEXT,
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (iso3, quarter)
  )`,

  `CREATE INDEX IF NOT EXISTS idx_pipeline_deals_org ON pipeline.deals(org_id)`,
  `CREATE INDEX IF NOT EXISTS idx_watchlists_org ON pipeline.watchlists(org_id)`,
  `CREATE INDEX IF NOT EXISTS idx_alerts_org_read ON notifications.alerts(org_id, read)`,
  `CREATE INDEX IF NOT EXISTS idx_fic_org ON billing.fic_transactions(org_id, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_gfr_composite ON intelligence.gfr_scores(composite DESC)`,
];

async function runExtra() {
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  for (const sql of EXTRA_TABLES) {
    try {
      await pool.query(sql);
      console.log('  ✓', sql.substring(0, 60).replace(/\s+/g,' '));
    } catch(e) {
      if (!e.message?.includes('already exists')) console.warn('  ⚠', e.message);
    }
  }
  await pool.end();
  console.log('✅ Additional tables ready');
}

runExtra().catch(e => console.error('Migration error:', e.message));
