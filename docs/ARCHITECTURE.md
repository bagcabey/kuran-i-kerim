# TİLAVET AKADEMİSİ — SİSTEM MİMARİSİ (ARCHITECTURE.md)

> **Doküman Kodu:** `ARCH-TL-SYS-01`  
> **Sürüm:** 2.0.0  
> **Tarih:** 19 Ekim 2026  
> **Durum:** Onaylandı / Üretim Standardı

---

## 1. MİMARİ YAKLAŞIM VE İLKELER (CLEAN ARCHITECTURE)

Tilavet Akademisi, yüksek ölçeklenebilirlik, platform bağımsızlığı ve katı veri güvenliği sağlamak amacıyla **Clean Architecture** prensipleriyle yapılandırılmıştır.

```
┌─────────────────────────────────────────────────────────────┐
│                 React 18 + Vite UI Katmanı                  │
│   (TilavetShell, Atomic UI, 12 Page Modülü, Canvas Grafikler)│
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      Core Motor Katmanı      │ │     API İstemci Katmanı    │
│  (Frameworksüz Saf TS / ES)  │ │      (Typed REST Fetch)    │
│  - audio/ (YIN, DTW, Drone)  │ └─────────────┬──────────────┘
│  - makam/ (53-koma, Tuning)  │               │
│  - learning/ (SM-2, Progress)│               │ HTTP / JSON
│  - text/ (Normalizasyon, WER)│               ▼
└──────────────────────────────┘ ┌────────────────────────────┐
                                 │     Express Backend API    │
                                 │ - Rate Limiting & Auth     │
                                 │ - Quran Foundation Proxy   │
                                 │ - mp3quran Proxy + Cache   │
                                 │ - Progress & SRS Routes    │
                                 └─────────────┬──────────────┘
                                               │
                                               ▼
                                 ┌────────────────────────────┐
                                 │      PostgreSQL Veritabanı │
                                 │    (001_tilavet.sql şeması)│
                                 └────────────────────────────┘
```

---

## 2. KATMANLAR VE TEKNİK BİLEŞENLER

### 2.1. Core Motor Katmanı (`src/tilavet/core/`)
Bu katman hiçbir UI kütüphanesine (React/Vue/Svelte) veya sunucu framework'üne bağımlı değildir; saf TypeScript algoritmalarından oluşur.
- **Audio Pipeline (`audio/`):**
  - `pitch.ts`: de Cheveigné & Kawahara (2002) **YIN algoritması**. O(W·N) otokorelasyon ve kümülatif ortalama normalize fark hesabı ile temel frekans (F0) tespiti. 5 elemanlı `MedianSmoother` ile oktav atlama ve mikro gürültü temizleme.
  - `tracker.ts`: Web Audio API `AnalyserNode` (fftSize = 4096) üzerinden canlı mikrofon perde takibi (`PitchTracker`).
  - `drone.ts`: Karar perdesi için Web Audio osilatör sentezleyicisi (Ney ve Tanbur formant filtreleri).
  - `recorder.ts`: `MediaRecorder` tabanlı istemci ses kaydı; dinamik webm/mp4 MIME tespiti.
  - `player.ts`: Çift tamponlu ses çalıcı; kelime/ayet senkronizasyonu, `loop()`, bekleme aralığı (`gap`), perde korumalı hız kontrolü (`preservesPitch`).
  - `contour.ts`: Perde konturu normalizasyonu ve Sakoe-Chiba bant kısıtlamalı Dinamik Zaman Bükmesi (**DTW**) algoritması.
- **Makam Motoru (`makam/tuning.ts`):**
  - Türk musikisi 53 Arel-Ezgi-Uzdilek (AEU) koma sistemi (\(1\text{ koma} \approx 22.64\text{ cent}\)) ve 24 çeyrek ton Arap sistemi.
  - Perde sapması tespiti, ses aralığı ölçümü (`vocalRange`), kullanıcı sesine uygun karar perdesi önerisi (`suggestKarar`).
- **Öğrenme Motoru (`learning/`):**
  - `srs.ts`: SüperMemo SM-2 aralıklı tekrar algoritması (\(\text{EF}' = \text{EF} + (0.1 - (5 - q) \cdot (0.08 + (5 - q) \cdot 0.02))\), taban \(1.3\)).
  - `progress.ts`: Ön koşul kilit açma, seviye ilerleme yüzdesi ve ardışık gün serisi (`streak`).
  - `quiz.ts`: Sınav değerlendirme motoru, Fisher-Yates karıştırma.
  - `assistant.ts`: Teolojik güvenlik çitli (guardrails) pedagojik öğrenme asistanı.
- **Metin Motoru (`text/`):**
  - `arabic.ts`: Harekelerin ve tatweel karakterlerinin temizlenmesi, hemze ve elif normalizasyonu.
  - `align.ts`: Levenshtein mesafe matrisi ve geri izleme ile Kelime Hata Oranı (WER) ve eksik kelime tespiti.

### 2.2. Arayüz Katmanı (`src/tilavet/ui/` ve `src/tilavet/pages/`)
- Atomic bileşenler: `AyahView`, `PlayerBar`, `TunerGauge`, `PitchContour`, `RecorderPanel`, `ScaleBar`, `DronePanel`, `MakamDetail`, `MakamGrid`, `QuizView`, `Warmup`, `BreathTimer`, `RangeTest`.
- Sayfalar: `JourneyPage`, `LessonPage`, `MakamPage`, `VoicePage`, `ListeningPage`, `QiraatPage`, `AssistantPage`, `StudioPage`, `ExamPage`, `GlossaryPage`, `SettingsPage`, `TeacherPage`.
- Yönlendirme: `src/tilavet/index.tsx` (React Router v6 lazy loading).
- `tilavet.css`: Obsidyen Zümrüt & Altın v3 tasarım jetonları, CSS custom properties, karanlık ve aydınlık tema.

### 2.3. Sunucu ve Veri Katmanı (`server/tilavet/`, `db/migrations/`)
- Express REST API (`server/tilavet/router.ts`):
  - `quranFoundation.ts`: Quran Foundation OAuth2 token ve ayet proxy'si (sırları istemciden gizler).
  - `reciters.ts`: mp3quran CDN proxy'si ve TTL in-memory önbellek.
  - `progress.ts`, `srs.ts`, `attempts.ts`, `teacher.ts`: Veritabanı uç noktaları.
- PostgreSQL Veritabanı (`001_tilavet.sql`):
  - `tl_user_progress`, `tl_user_activity`, `tl_srs_cards`, `tl_attempts`, `tl_badges`, `tl_user_settings`, `tl_classes`, `tl_class_members`, `tl_assignments`, `tl_submissions`, `tl_audio_assets`, `tl_reviews`, `tl_api_cache`, `tl_gdpr_audit`.

---

## 3. GİZLİLİK VE VERİ GÜVENLİĞİ (ZERO RAW AUDIO RETENTION)

1. **İstemci Tarafı İşleme:** Kullanıcının mikrofonundan alınan ses sinyalleri tarayıcının Web Audio API katmanında gerçek zamanlı olarak çözümlenir (F0, RMS, spektrum).
2. **Ham Ses Saklanmaz:** Kullanıcının ham ses dosyaları sunucuya gönderilmez veya veritabanında depolanmaz. Sunucuya yalnızca matematiksel analiz özetleri (WER skoru, ortalama cent farkı, süre) iletilir.
3. **KVKK / GDPR Uyumu:** Kullanıcı istediği anda `DELETE /api/tilavet/progress/all` çağrısı ile tüm ilerleme ve analiz verilerini tek tıkla silebilir.
