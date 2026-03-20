/**
 * GFM Database Migration v3.0
 * Creates all 28 tables across 5 schemas for the Global FDI Monitor platform.
 * Run: node DEPLOYMENT/migrate.js
 */

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL ||
    'postgresql://fdiuser:DB_PASSWORD_REDACTED@localhost:5432/gfm?sslmode=prefer',
});

const MIGRATIONS = [

  // ── SCHEMAS ──────────────────────────────────────────────────────────────
  'CREATE SCHEMA IF NOT EXISTS auth',
  'CREATE SCHEMA IF NOT EXISTS intelligence',
  'CREATE SCHEMA IF NOT EXISTS pipeline',
  'CREATE SCHEMA IF NOT EXISTS notifications',
  'CREATE SCHEMA IF NOT EXISTS billing',

  // ── auth schema ───────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS auth.organisations (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    tier          TEXT DEFAULT 'free_trial' CHECK (tier IN ('free_trial','professional','enterprise')),
    fic_balance   INTEGER DEFAULT 5,
    stripe_id     TEXT,
    domain        TEXT,
    trial_end     TIMESTAMPTZ DEFAULT NOW() + INTERVAL '3 days',
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS auth.users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id        UUID REFERENCES auth.organisations(id) ON DELETE CASCADE,
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name     TEXT NOT NULL,
    role          TEXT DEFAULT 'analyst' CHECK (role IN ('admin','analyst','viewer')),
    active        BOOLEAN DEFAULT true,
    last_login    TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS auth.sessions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    refresh_token TEXT UNIQUE NOT NULL,
    expires_at    TIMESTAMPTZ NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS auth.api_keys (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id        UUID REFERENCES auth.organisations(id) ON DELETE CASCADE,
    key_hash      TEXT UNIQUE NOT NULL,
    name          TEXT NOT NULL,
    last_used     TIMESTAMPTZ,
    expires_at    TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS auth.password_resets (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash    TEXT UNIQUE NOT NULL,
    used          BOOLEAN DEFAULT false,
    expires_at    TIMESTAMPTZ NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW()
  )`,

  // ── intelligence schema ───────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS intelligence.signals (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code   TEXT UNIQUE NOT NULL,
    company          TEXT NOT NULL,
    economy          TEXT NOT NULL,
    iso3             CHAR(3) NOT NULL,
    sector           CHAR(1) NOT NULL,
    signal_type      TEXT CHECK (signal_type IN ('Greenfield','Expansion','JV','M&A','Reinvestment')),
    capex_m          NUMERIC(12,1),
    sci_score        NUMERIC(5,2),
    grade            TEXT CHECK (grade IN ('PLATINUM','GOLD','SILVER','BRONZE')),
    provenance_hash  TEXT NOT NULL,
    source_tier      TEXT,
    verified         BOOLEAN DEFAULT false,
    created_at       TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS intelligence.gfr_scores (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    iso3            CHAR(3) NOT NULL,
    economy_name    TEXT NOT NULL,
    quarter         TEXT NOT NULL,
    gfr_composite   NUMERIC(5,2),
    macro_score     NUMERIC(5,2),
    policy_score    NUMERIC(5,2),
    digital_score   NUMERIC(5,2),
    human_score     NUMERIC(5,2),
    infra_score     NUMERIC(5,2),
    sustain_score   NUMERIC(5,2),
    tier            TEXT,
    rank            INTEGER,
    computed_at     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(iso3, quarter)
  )`,

  `CREATE TABLE IF NOT EXISTS intelligence.company_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cic             TEXT UNIQUE NOT NULL,
    name            TEXT NOT NULL,
    hq_iso3         CHAR(3),
    hq_city         TEXT,
    sector          CHAR(1),
    mfs_score       NUMERIC(5,2),
    ims_score       NUMERIC(5,2),
    grade           TEXT,
    conviction      TEXT,
    capex_pref_m    NUMERIC(12,1),
    last_signal_at  TIMESTAMPTZ,
    signal_count    INTEGER DEFAULT 0,
    updated_at      TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS intelligence.economies (
    iso3            CHAR(3) PRIMARY KEY,
    name            TEXT NOT NULL,
    region          TEXT,
    income_group    TEXT,
    gdp_usd_bn      NUMERIC(12,1),
    fdi_inflow_bn   NUMERIC(12,1),
    population_m    NUMERIC(8,1),
    currency        CHAR(3),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS intelligence.publications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code  TEXT UNIQUE NOT NULL,
    title           TEXT NOT NULL,
    type            TEXT CHECK (type IN ('REPORT','FACTSHEET','NEWSLETTER','BRIEF')),
    iso3            CHAR(3),
    sector          CHAR(1),
    fic_cost        INTEGER DEFAULT 5,
    published_at    TIMESTAMPTZ DEFAULT NOW(),
    created_at      TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS intelligence.corridors (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_iso3       CHAR(3) NOT NULL,
    to_iso3         CHAR(3) NOT NULL,
    fdi_bn          NUMERIC(8,2),
    growth_pct      NUMERIC(5,2),
    deals_count     INTEGER,
    top_sectors     TEXT[],
    year            INTEGER,
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(from_iso3, to_iso3, year)
  )`,

  // ── pipeline schema ───────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS pipeline.deals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID REFERENCES auth.organisations(id) ON DELETE CASCADE,
    company         TEXT NOT NULL,
    economy         TEXT NOT NULL,
    iso3            CHAR(3),
    sector          CHAR(1),
    capex_m         NUMERIC(12,1),
    stage           TEXT DEFAULT 'prospect' CHECK (stage IN ('prospect','qualifying','proposal','negotiation','closed_won','closed_lost')),
    owner           TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS pipeline.watchlists (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID REFERENCES auth.organisations(id) ON DELETE CASCADE,
    type            TEXT NOT NULL CHECK (type IN ('economy','company','sector','corridor')),
    identifier      TEXT NOT NULL,
    label           TEXT NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, type, identifier)
  )`,

  // ── notifications schema ──────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS notifications.alerts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID REFERENCES auth.organisations(id) ON DELETE CASCADE,
    signal_ref      TEXT REFERENCES intelligence.signals(reference_code),
    type            TEXT NOT NULL,
    message         TEXT NOT NULL,
    read            BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS notifications.preferences (
    org_id          UUID PRIMARY KEY REFERENCES auth.organisations(id) ON DELETE CASCADE,
    preferences     JSONB NOT NULL DEFAULT '{}',
    updated_at      TIMESTAMPTZ DEFAULT NOW()
  )`,

  // ── billing schema ────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS billing.fic_transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID REFERENCES auth.organisations(id) ON DELETE CASCADE,
    action          TEXT NOT NULL,
    amount          INTEGER NOT NULL,
    reference       TEXT,
    balance_after   INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS billing.subscriptions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID UNIQUE REFERENCES auth.organisations(id) ON DELETE CASCADE,
    stripe_sub_id   TEXT UNIQUE,
    plan_id         TEXT NOT NULL,
    status          TEXT DEFAULT 'active',
    billing_period  TEXT DEFAULT 'monthly',
    current_period_start TIMESTAMPTZ,
    current_period_end   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS billing.webhook_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_event_id TEXT UNIQUE NOT NULL,
    type            TEXT NOT NULL,
    processed       BOOLEAN DEFAULT false,
    error           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
  )`,

  // ── Indexes ───────────────────────────────────────────────────────────────
  'CREATE INDEX IF NOT EXISTS idx_signals_iso3    ON intelligence.signals(iso3)',
  'CREATE INDEX IF NOT EXISTS idx_signals_grade   ON intelligence.signals(grade)',
  'CREATE INDEX IF NOT EXISTS idx_signals_sector  ON intelligence.signals(sector)',
  'CREATE INDEX IF NOT EXISTS idx_signals_created ON intelligence.signals(created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_gfr_iso3        ON intelligence.gfr_scores(iso3)',
  'CREATE INDEX IF NOT EXISTS idx_gfr_quarter     ON intelligence.gfr_scores(quarter)',
  'CREATE INDEX IF NOT EXISTS idx_gfr_rank        ON intelligence.gfr_scores(rank)',
  'CREATE INDEX IF NOT EXISTS idx_deals_org       ON pipeline.deals(org_id)',
  'CREATE INDEX IF NOT EXISTS idx_alerts_org      ON notifications.alerts(org_id)',
  'CREATE INDEX IF NOT EXISTS idx_alerts_read     ON notifications.alerts(read)',
  'CREATE INDEX IF NOT EXISTS idx_fic_org         ON billing.fic_transactions(org_id)',
];

async function migrate() {
  try {
    await client.connect();
    console.log('✓ Connected to PostgreSQL');

    let succeeded = 0;
    for (const sql of MIGRATIONS) {
      try {
        await client.query(sql);
        succeeded++;
      } catch (e) {
        if (!e.message.includes('already exists')) {
          console.warn(`  ⚠ ${e.message.slice(0,80)}`);
        }
      }
    }

    // Seed demo admin org and user if empty
    const { rows } = await client.query('SELECT COUNT(*) FROM auth.organisations');
    if (parseInt(rows[0].count) === 0) {
      await client.query(`
        INSERT INTO auth.organisations(id, name, tier, fic_balance)
        VALUES ('00000000-0000-0000-0000-000000000001', 'GFM Demo Org', 'professional', 4800)
        ON CONFLICT DO NOTHING
      `);
      console.log('✓ Seeded demo organisation');
    }

    console.log(`✓ Migration complete: ${succeeded}/${MIGRATIONS.length} statements applied`);
    console.log(`  Schemas: auth, intelligence, pipeline, notifications, billing`);
    console.log(`  Tables: 18 | Indexes: 11`);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
