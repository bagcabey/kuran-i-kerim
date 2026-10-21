-- ============================================================================
-- TİLAVET AKADEMİSİ — MİGRASYON 002: SİSTEM SERTLEŞTİRME VE GÜVENLİK
-- Tarih: 20 Ekim 2026
-- Hedef: tl_users, KVKK rıza/silme logları, icazet başvuruları, sertifikalar,
--        yabancı anahtar kısıtlamaları (FK) ve performans indeksleri.
-- ============================================================================

-- 1. Kullanıcı Tablosu (Kimlik Doğrulama & Yetkilendirme)
CREATE TABLE IF NOT EXISTS tl_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  display_name  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tl_users_email ON tl_users (email);

-- 2. Açık Rıza ve İzin Kayıtları (KVKK / GDPR Uyum)
CREATE TABLE IF NOT EXISTS tl_consents (
  user_id      UUID NOT NULL REFERENCES tl_users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL, -- 'cloud_recordings', 'analytics', 'terms_of_service'
  granted_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip           TEXT,
  user_agent   TEXT,
  PRIMARY KEY (user_id, consent_type)
);

-- 3. Anonim Silme Denetim Kaydı (KVKK 5 Yıl Saklama Yükümlülüğü)
CREATE TABLE IF NOT EXISTS tl_deletion_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash TEXT NOT NULL, -- SHA-256(user_id + salt)
  requested_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tl_deletion_hash ON tl_deletion_log (user_id_hash);

-- 4. Hoca / Fem-i Muhsin İcazet Başvuru Havuzu
CREATE TABLE IF NOT EXISTS tl_teacher_applications (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES tl_users(id) ON DELETE CASCADE,
  icazet_doc_url TEXT,
  referee        TEXT,
  notes          TEXT,
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at    TIMESTAMPTZ,
  reviewed_by    UUID REFERENCES tl_users(id)
);

-- 5. Teori ve Tilavet Başarı Belgeleri (İcazet Değildir)
CREATE TABLE IF NOT EXISTS tl_certificates (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES tl_users(id) ON DELETE CASCADE,
  level             INTEGER NOT NULL,
  score             INTEGER NOT NULL,
  teacher_id        UUID REFERENCES tl_users(id),
  verification_hash TEXT NOT NULL UNIQUE,
  is_theory_only    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tl_cert_verify ON tl_certificates (verification_hash);

-- 6. tl_submissions Tablosuna Sıfır Ham Ses Uyum Alanı (analysis_summary) Ekleme
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tl_submissions' AND column_name = 'analysis_summary'
  ) THEN
    ALTER TABLE tl_submissions ADD COLUMN analysis_summary JSONB;
  END IF;
END $$;

-- 7. Performans ve Sorgu İndeksleri
CREATE INDEX IF NOT EXISTS idx_tl_progress_user ON tl_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_tl_activity_user ON tl_activity_days (user_id, day DESC);
CREATE INDEX IF NOT EXISTS idx_tl_submissions_student ON tl_submissions (student_id);
CREATE INDEX IF NOT EXISTS idx_tl_submissions_assignment ON tl_submissions (assignment_id);
CREATE INDEX IF NOT EXISTS idx_tl_assignments_class ON tl_assignments (class_id);
CREATE INDEX IF NOT EXISTS idx_tl_classes_teacher ON tl_classes (teacher_id);
