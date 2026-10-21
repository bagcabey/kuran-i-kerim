# TİLAVET AKADEMİSİ — TEST PLANI VE KALİTE GÜVENCESİ (TEST_PLAN.md)

> **Doküman Kodu:** `QA-TL-PLAN-01`  
> **Sürüm:** 2.0.0  
> **Tarih:** 19 Ekim 2026  
> **Durum:** Onaylandı / Üretim Standardı

---

## 1. TEST STRATEJİSİ VE KAPSAMI

Tilavet Akademisi test altyapısı, algoritmik hassasiyet, içerik doğruluğu ve statik tip güvenliğini teminat altına almak üzere Vitest ve TypeScript üzerine kurulmuştur.

```
┌─────────────────────────────────────────────────────────────┐
│                 CI / CD Test Koşum Hattı                     │
├──────────────────────────────┬──────────────────────────────┤
│ 1. Statik Tip Denetimi       │ npx tsc --noEmit (0 hata)    │
│ 2. Çekirdek DSP & Algoritmik │ YIN, DTW, SM-2, Tuning       │
│ 3. Metin & ASR Hizalama      │ Normalizasyon, WER           │
│ 4. İçerik & Veri Bütünlüğü   │ 10 Makam (0..53), Dersler    │
└──────────────────────────────┴──────────────────────────────┘
```

---

## 2. OTOMATİK BİRİM VE ENTEGRASYON TESTLERİ (`tests/tilavet/`)

### 2.1. `tests/tilavet/pitch.test.ts` (YIN Perde Algılama)
- **Kapsam:** YIN algoritmasının (\(O(W \cdot N)\)) matematiksel doğruluğu.
- **Senaryolar:**
  - 110 Hz, 146.83 Hz, 220 Hz, 261.63 Hz, 440 Hz saf sinüs dalgalarında \(\pm 1.5\text{ Hz}\) tolerans ile F0 tespiti.
  - Sıfır genlikli (sessizlik) tamponda gürültü kapısının çalışması ve `null` dönmesi.

### 2.2. `tests/tilavet/tuning.test.ts` (Makam Akort ve Koma Matematiği)
- **Kapsam:** Türk ve Arap musiki akort dönüşümleri.
- **Senaryolar:**
  - Oktavın tam 1200 cent vermesi.
  - Cent \(\rightarrow\) Hz \(\rightarrow\) Cent çift yönlü dönüşüm tutarlılığı.
  - 31 koma \(\approx 702\text{ cent}\) (saf beşli) doğrulaması.
  - 53 koma = tam 1200 cent eşitliği.
  - Rast makamında Nevâ perdesinin 196 Hz karara göre \(\pm 1\text{ cent}\) hassasiyetle doğru eşleşmesi.

### 2.3. `tests/tilavet/srs.test.ts` (SM-2 Aralıklı Tekrar Algoritması)
- **Kapsam:** SuperMemo SM-2 hafıza aralıkları.
- **Senaryolar:**
  - İlk doğru cevapta 1 gün, ikinci doğru cevapta 3 gün aralık katlanması.
  - Hatalı cevapta (lapse) tekrar sayısının sıfırlanması ve aralığın 1 güne düşmesi.
  - Sürekli başarısızlık durumunda bile kolaylık faktörünün (Ease Factor) \(1.3\) taban değerinin altına inmemesi.

### 2.4. `tests/tilavet/align.test.ts` (Arapça Metin ve Okuma Hizalama)
- **Kapsam:** Harekelerin arındırılması ve Levenshtein hizalaması.
- **Senaryolar:**
  - `بِسْمِ ٱللَّهِ` metninin `بسم الله` şeklinde eksiksiz normalizasyonu.
  - Birebir aynı ayet okunuşunda %100 doğruluk (`accuracy = 100`).
  - Ayetten kelime atlandığında (örn. 'الرحمن' eksik) `missed` dizisinde 3. kelime indeksinin doğru yakalanması.

### 2.5. `tests/tilavet/progress.test.ts` (İlerleme ve Seri Takibi)
- **Kapsam:** Müfredat kilit açma mantığı ve çalışma serisi.
- **Senaryolar:**
  - Ön koşul ders tamamlanmadan sonraki dersin kilitli kalması.
  - Ön koşul tamamlandığında sıradaki dersin kilidinin açılması.
  - Ardışık çalışma günlerinden güncel streak sayısının doğru hesaplanması.

### 2.6. `tests/tilavet/content.test.ts` (İçerik Bütünlüğü — CI Zorunlu)
- **Kapsam:** JSON veri dosyalarının katı bütünlüğü.
- **Senaryolar:**
  - Tüm ders ID'lerinin benzersiz olması.
  - Derslerde referans verilen tüm sınav ID'lerinin `quiz/` klasöründe mevcut olması.
  - Tüm ön koşul ID'lerinin gerçek derslere işaret etmesi.
  - Tüm ayet anahtarlarının `^\d{1,3}:\d{1,3}$` formatında olması.
  - `status: "published"` olan içeriklerde `needsReview: false` olma zorunluluğu.
  - **10 Makamın tamamında perdelerin 0 komadan başlayıp, kesin artan sırada 53 komada sonlanması.**

---

## 3. TEST KOMUTLARI VE ÇALIŞTIRMA

```bash
# Tip denetimi
npx tsc --noEmit

# Test paketini tek seferde koşma
npx vitest run

# Canlı izleme modunda çalıştırma
npx vitest
```
