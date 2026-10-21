-- Not: "users" tablosu projede zaten var varsayılır (id UUID veya BIGINT). Tip farklıysa aşağıdaki user_id tiplerini uyarla.

CREATE TABLE IF NOT EXISTS tl_progress (
  user_id      UUID NOT NULL,
  lesson_id    TEXT NOT NULL,
  status       TEXT NOT NULL CHECK (status IN ('not_started','in_progress','completed','mastered')),
  score        INTEGER,
  attempts     INTEGER NOT NULL DEFAULT 0,
  seconds      INTEGER NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS tl_activity_days (
  user_id   UUID NOT NULL,
  day       DATE NOT NULL,
  minutes   INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);

CREATE TABLE IF NOT EXISTS tl_srs_cards (
  user_id    UUID NOT NULL,
  card_id    TEXT NOT NULL,            -- örn. "letter:ع", "rule:izhar", "motif:rast-m1"
  ease       REAL NOT NULL DEFAULT 2.5,
  interval   INTEGER NOT NULL DEFAULT 0,
  reps       INTEGER NOT NULL DEFAULT 0,
  lapses     INTEGER NOT NULL DEFAULT 0,
  due        TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_reviewed TIMESTAMPTZ,
  PRIMARY KEY (user_id, card_id)
);
CREATE INDEX IF NOT EXISTS idx_tl_srs_due ON tl_srs_cards (user_id, due);

CREATE TABLE IF NOT EXISTS tl_attempts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL,
  lesson_id     TEXT,
  ayah_key      TEXT,
  makam_id      TEXT,
  reciter_id    TEXT,
  duration_ms   INTEGER,
  pitch_score   INTEGER,
  align_accuracy INTEGER,
  mean_cents_diff INTEGER,
  analysis      JSONB,                 -- kelime hataları, kontur özeti (ham ses DEĞİL)
  audio_url     TEXT,                  -- yalnızca açık rıza ile doldurulur
  consent_cloud BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tl_attempts_user ON tl_attempts (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tl_user_badges (
  user_id   UUID NOT NULL,
  badge_id  TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS tl_settings (
  user_id UUID PRIMARY KEY,
  quran_scale REAL NOT NULL DEFAULT 1,
  tajweed_colors BOOLEAN NOT NULL DEFAULT TRUE,
  theme TEXT NOT NULL DEFAULT 'auto',
  daily_goal_minutes INTEGER NOT NULL DEFAULT 10,
  karar_id TEXT NOT NULL DEFAULT 'D3',
  tuning TEXT NOT NULL DEFAULT 'tr-53',
  cloud_recordings BOOLEAN NOT NULL DEFAULT FALSE,
  reminders BOOLEAN NOT NULL DEFAULT FALSE
);

-- Hoca / sınıf
CREATE TABLE IF NOT EXISTS tl_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL,
  name TEXT NOT NULL,
  invite_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tl_class_members (
  class_id UUID NOT NULL REFERENCES tl_classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (class_id, student_id)
);
CREATE TABLE IF NOT EXISTS tl_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES tl_classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  ayah_key TEXT,
  makam_id TEXT,
  speed TEXT CHECK (speed IN ('tahkik','tertil','tedvir','hadr')),
  due_at TIMESTAMPTZ,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tl_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES tl_assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  attempt_id UUID REFERENCES tl_attempts(id),
  teacher_comment TEXT,
  teacher_score INTEGER,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

-- Ses varlıkları (özel çekimler ve doğrulanmış etiketler)
CREATE TABLE IF NOT EXISTS tl_audio_assets (
  id TEXT PRIMARY KEY,                -- "A-3-2-001"
  url TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('letter','rule','makam','voice','reciter','other')),
  reciter TEXT,
  school TEXT,
  makam_id TEXT,
  speed TEXT,
  ayah_key TEXT,
  duration_ms INTEGER,
  license TEXT NOT NULL,              -- lisans satırı ZORUNLU
  source TEXT NOT NULL,
  makam_verified BOOLEAN NOT NULL DEFAULT FALSE,
  contour_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- İçerik inceleme akışı
CREATE TABLE IF NOT EXISTS tl_content_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('lesson','makam','quiz','audio','glossary')),
  content_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft','expert_review','approved','published','rejected')),
  reviewer_id UUID,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tl_reviews_content ON tl_content_reviews (content_type, content_id, created_at DESC);

-- Kurrâ önbelleği (API yanıtlarının kopyası)
CREATE TABLE IF NOT EXISTS tl_reciter_cache (
  source TEXT NOT NULL,               -- 'mp3quran' | 'qf'
  key TEXT NOT NULL,
  payload JSONB NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (source, key)
);

-- Geri bildirim ("bu içerik yanlış mı?")
CREATE TABLE IF NOT EXISTS tl_content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
