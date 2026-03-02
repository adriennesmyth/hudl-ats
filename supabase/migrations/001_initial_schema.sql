-- ============================================================
-- Hudl ATS — Migration 001: Initial Schema
-- Project: ankrisccmpepjcgwzyzb
-- ============================================================

-- ── Drop old tables if re-running ───────────────────────────
DROP TABLE IF EXISTS scorecards       CASCADE;
DROP TABLE IF EXISTS interviews       CASCADE;
DROP TABLE IF EXISTS candidate_stages CASCADE;
DROP TABLE IF EXISTS stage_history    CASCADE;
DROP TABLE IF EXISTS candidates       CASCADE;
DROP TABLE IF EXISTS stages           CASCADE;

-- ── 1. stages ────────────────────────────────────────────────
CREATE TABLE stages (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  color        TEXT        NOT NULL DEFAULT '#94A3B8',
  order_index  INTEGER     NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. candidates ────────────────────────────────────────────
CREATE TABLE candidates (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name        TEXT        NOT NULL,
  surname           TEXT        NOT NULL,
  email             TEXT        NOT NULL UNIQUE,
  referred_by       TEXT,
  address           TEXT,
  education_level   TEXT,
  linkedin_url      TEXT,
  cv_url            TEXT,
  current_stage_id  UUID        REFERENCES stages(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on every change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 3. candidate_stages (pipeline history) ───────────────────
CREATE TABLE candidate_stages (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id  UUID        NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  stage_id      UUID        NOT NULL REFERENCES stages(id)    ON DELETE RESTRICT,
  moved_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  moved_by      TEXT                                          -- recruiter name / email
);

-- ── 4. scorecards ────────────────────────────────────────────
CREATE TABLE scorecards (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id     UUID        NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  stage_id         UUID        NOT NULL REFERENCES stages(id)    ON DELETE RESTRICT,
  interviewer_name TEXT        NOT NULL,
  overall_rating   INTEGER     CHECK (overall_rating BETWEEN 1 AND 5),
  strengths        TEXT,
  concerns         TEXT,
  recommendation   TEXT        CHECK (recommendation IN
                     ('strong_yes', 'yes', 'neutral', 'no', 'strong_no')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 5. interviews ────────────────────────────────────────────
CREATE TABLE interviews (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id      UUID        NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  stage_id          UUID        NOT NULL REFERENCES stages(id)    ON DELETE RESTRICT,
  scheduled_at      TIMESTAMPTZ NOT NULL,
  interviewer_email TEXT        NOT NULL,
  calendar_event_id TEXT,
  meeting_link      TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Seed: default pipeline stages ───────────────────────────
INSERT INTO stages (name, color, order_index) VALUES
  ('Applied',      '#94A3B8', 0),
  ('Phone Screen', '#60A5FA', 1),
  ('Interview 1',  '#34D399', 2),
  ('Interview 2',  '#FBBF24', 3),
  ('Offer',        '#A78BFA', 4),
  ('Hired',        '#22C55E', 5),
  ('Rejected',     '#EF4444', 6);

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE stages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates       ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorecards       ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews       ENABLE ROW LEVEL SECURITY;

-- Open policy for internal use (tighten with Supabase Auth when ready)
-- Tables are freshly created above so no prior policies exist on them,
-- but guard storage.objects which is a shared system table.
CREATE POLICY "open_access" ON stages           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_access" ON candidates       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_access" ON candidate_stages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_access" ON scorecards       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_access" ON interviews       FOR ALL USING (true) WITH CHECK (true);

-- ── Storage bucket: cvs ──────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cvs',
  'cvs',
  true,
  10485760,  -- 10 MB
  ARRAY['application/pdf','application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Drop storage policies before recreating (storage.objects is a shared system
-- table so its policies survive a re-run, unlike our app tables above)
DROP POLICY IF EXISTS "public_read_cvs" ON storage.objects;
DROP POLICY IF EXISTS "upload_cvs"      ON storage.objects;
DROP POLICY IF EXISTS "delete_cvs"      ON storage.objects;

CREATE POLICY "public_read_cvs" ON storage.objects FOR SELECT USING (bucket_id = 'cvs');
CREATE POLICY "upload_cvs"      ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cvs');
CREATE POLICY "delete_cvs"      ON storage.objects FOR DELETE USING (bucket_id = 'cvs');
