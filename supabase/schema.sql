-- ============================================================
-- Hudl ATS — Supabase Schema
-- Run this in your Supabase project's SQL editor.
-- ============================================================

-- ── Stages ──────────────────────────────────────────────────
CREATE TABLE stages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  color        TEXT NOT NULL DEFAULT '#94A3B8',
  order_index  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Candidates ──────────────────────────────────────────────
CREATE TABLE candidates (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name        TEXT NOT NULL,
  surname           TEXT NOT NULL,
  email             TEXT NOT NULL UNIQUE,
  referred_by       TEXT,
  address           TEXT,
  education_level   TEXT,
  linkedin_url      TEXT,
  cv_url            TEXT,
  current_stage_id  UUID REFERENCES stages(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Stage History ────────────────────────────────────────────
CREATE TABLE stage_history (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id  UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  stage_id      UUID NOT NULL REFERENCES stages(id) ON DELETE RESTRICT,
  stage_name    TEXT NOT NULL,
  moved_at      TIMESTAMPTZ DEFAULT NOW(),
  notes         TEXT
);

-- ── Scorecards ───────────────────────────────────────────────
CREATE TABLE scorecards (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id      UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  stage_id          UUID NOT NULL REFERENCES stages(id) ON DELETE RESTRICT,
  stage_name        TEXT NOT NULL,
  interviewer_name  TEXT NOT NULL,
  rating            INTEGER CHECK (rating BETWEEN 1 AND 5),
  recommendation    TEXT CHECK (recommendation IN ('strong_yes', 'yes', 'neutral', 'no', 'strong_no')),
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Default seed data ────────────────────────────────────────
INSERT INTO stages (name, color, order_index) VALUES
  ('Applied',       '#94A3B8', 0),
  ('Phone Screen',  '#60A5FA', 1),
  ('Interview 1',   '#34D399', 2),
  ('Interview 2',   '#FBBF24', 3),
  ('Offer',         '#A78BFA', 4),
  ('Hired',         '#22C55E', 5),
  ('Rejected',      '#EF4444', 6);

-- ── RLS Policies ─────────────────────────────────────────────
-- Enable Row Level Security on all tables.
-- Adjust policies to match your auth setup (e.g. Supabase Auth roles).

ALTER TABLE stages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates     ENABLE ROW LEVEL SECURITY;
ALTER TABLE stage_history  ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorecards     ENABLE ROW LEVEL SECURITY;

-- For a quick internal start, allow all authenticated users full access:
CREATE POLICY "Allow all for authenticated users" ON stages         FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON candidates     FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON stage_history  FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON scorecards     FOR ALL USING (true);

-- ── Storage bucket ───────────────────────────────────────────
-- Run in Supabase Dashboard > Storage > New Bucket:
--   Name: cvs
--   Public: true  (or false + use signed URLs for production)
--
-- Or via SQL (storage schema must be available):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', true);
