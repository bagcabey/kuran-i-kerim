# TİLAVET AKADEMİSİ — MİMARİ VE SİSTEM TASARIMI

> **Doküman Kodu:** `DOC-TL-ARCH-01`  
> **Sürüm:** 1.0.0  
> **Tarih:** 19 Ekim 2026  
> **Durum:** Onaylandı

---

## 1. GENEL MİMARİ BAKIŞ (CLEAN ARCHITECTURE)

Tilavet Akademisi, katmanlı ve framework-agnostik bir mimari prensibiyle inşa edilmiştir.

```
┌─────────────────────────────────────────────────────────────┐
│                 React 18 + Vite UI Katmanı                  │
│  (TilavetShell, Pages: Journey, Lesson, Makam, Voice, etc.) │
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

## 2. TEMEL KATMANLAR VE SORUMLULUKLAR

### 2.1. Core Motor Katmanı (`src/tilavet/core/`)
- **Framework bağımsızlığı:** Tarayıcı arayüz kütüphanelerinden (React/Vue/Angular) ve Node.js runtime'ından tamamen bağımsız saf algoritmalar.
- **Ses Motoru (`audio/`):**
  - `pitch.ts`: de Cheveigné & Kawahara (2002) YIN algoritması. O(W·N) otokorelasyon ve kümülatif ortalama normalize fark hesabı.
  - `tracker.ts`: Web Audio AnalyserNode üzerinden canlı mikrofon akışı ve 5 elemanlı hareketli medyan filtre (`MedianSmoother`).
  - `drone.ts`: Karar perdesi için Web Audio API osilatör sentezleyicisi (Ney ve Tanbur rezonans filtreleri).
  - `recorder.ts`: `MediaRecorder` tabanlı istemci tarafı ses kaydı ve dinamik MIME algılama.
  - `player.ts`: Çift tamponlu ses çalıcı; kelime ve ayet senkronizasyonu, döngü (`loop`), bekleme aralığı (`gap`), perde korumalı hız kontrolü (`preservesPitch`).
  - `contour.ts`: Perde konturu normalizasyonu ve Sakoe-Chiba bant kısıtlamalı Dinamik Zaman Bükmesi (DTW) algoritması.
- **Makam Motoru (`makam/tuning.ts`):**
  - Türk musikisi 53 Arel-Ezgi-Uzdilek (AEU) koma sistemi (\(1\text{ koma} \approx 22.64\text{ cent}\)) ve 24 çeyrek ton Arap sistemi.
  - Ses aralığı tespiti (`vocalRange`), kullanıcı sesine uygun karar perdesi önerisi (`suggestKarar`).
- **Öğrenme Motoru (`learning/`):**
  - `srs.ts`: SüperMemo SM-2 aralıklı tekrar algoritması (\(\text{EF}' = \text{EF} + (0.1 - (5 - q) \cdot (0.08 + (5 - q) \cdot 0.02))\), taban \(1.3\)).
  - `progress.ts`: Ön koşul kilit açma mantığı, seviye tamamlama yüzdesi ve ardışık gün serisi (`streak`).
  - `quiz.ts`: Tekli/çoklu seçim ve dinleme soruları değerlendirmesi, Fisher-Yates karıştırma.
  - `badges.ts`: 12 kural tabanlı rozet kazanım değerlendiricisi.
- **Metin Motoru (`text/`):**
  - `arabic.ts`: Harekelerin ve tatweel karakterlerinin temizlenmesi, hemze ve elif normalizasyonu.
  - `align.ts`: Levenshtein mesafe matrisi ve geri izleme (backtracking) ile Kelime Hata Oranı (WER) ve eksik kelime tespiti.

### 2.2. Arayüz Katmanı (`src/tilavet/ui/` ve `src/tilavet/pages/`)
- Atomic bileşenler: `AyahView`, `PlayerBar`, `TunerGauge`, `PitchContour`, `RecorderPanel`, `ScaleBar`, `DronePanel`, `MakamDetail`, `MakamGrid`, `QuizView`, `Warmup`, `BreathTimer`, `RangeTest`.
- WCAG 2.1 AA erişilebilirlik standartları: yüksek kontrast, ARIA rolleri, ekran okuyucu uyumluluğu.
- `tilavet.css`: Emerald ve Gold obsidian tasarım sistemi, CSS custom properties tabanlı aydınlık/karanlık tema.

### 2.3. Sunucu ve Veri Katmanı (`server/tilavet/`, `db/migrations/`)
- Express REST API:
  - İstemciye API sırrı ifşa etmeyen Quran Foundation OAuth2 token ve ayet proxy'si.
  - `reciters.ts`: mp3quran CDN proxy'si ve TTL bellek önbelleği.
  - `progress.ts` & `attempts.ts`: Kullanıcı ilerleme ve performans analizi.
- **Gizlilik İlkesi:** Kullanıcının ham ses kayıtları sunucuya gönderilmez veya veritabanında saklanmaz; yalnızca matematiksel analiz özetleri (WER, perde sapması, cent farkı) kaydedilir.
- GDPR / KVKK uyumlu "Tüm Verimi Sil" (`DELETE /api/tilavet/progress/all`) uç noktası.

---

## 3. DOĞRULAMA VE TEST STRATEJİSİ
- **Vitest Test Paketi:**
  - `pitch.test.ts`: 110–440 Hz sinüs sinyallerinde \(\pm 1.5\text{ Hz}\) doğruluk ve sessizlikte null dönme testi.
  - `tuning.test.ts`: 1200 cent oktav, 31 koma saf beşli (\(\approx 702\text{ cent}\)) ve Rast Neva eşleşmesi.
  - `srs.test.ts`: SM-2 aralık ilerlemesi, sıfırlanma ve 1.3 kolaylık tabanı.
  - `align.test.ts`: Arapça normalizasyon, %100 doğruluk ve eksik kelime tespiti.
  - `progress.test.ts`: Ön koşul kilitleri, sıradaki ders ve streak hesabı.
  - `content.test.ts`: Ders kimlikleri benzersizliği, quiz ilişkileri, 0..53 koma dizileri ve veri bütünlüğü.
- **Statik Tip Kontrolü:** `tsc --noEmit` ile 0 hata garantisi.
