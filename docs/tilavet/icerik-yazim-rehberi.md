# TİLAVET AKADEMİSİ — İÇERİK YAZIM VE EDİTÖRYAL REHBERİ

> **Doküman Kodu:** `DOC-TL-CONT-01`  
> **Sürüm:** 1.0.0  
> **Tarih:** 19 Ekim 2026  
> **Hedef Kitle:** Müfredat Yazarları, Makam ve Tecvid Uzmanları, Editörler

---

## 1. DERS FORMATI VE KURALLARI (`src/tilavet/data/lessons/`)

Tüm dersler JSON formatında ve katı şema kurallarına uygun olarak oluşturulmalıdır.

### 1.1. Dosya ve ID Adlandırma
- Dosya adı ve `id` alanı birebir aynı olmalıdır: `L{seviye}-{sira}-{kisa-ad}.json`
  - Örnek: `L1-1-harfler.json`, `L3-2-izhar.json`
- `prerequisites` dizisi yalnızca mevcut ve geçerli ders ID'lerini içermelidir.
- `level` değeri 0 ile 5 arasında olmalıdır.

### 1.2. Bölüm (Section) Tipleri
Bir derste aşağıdaki bölüm tipleri kullanılabilir:
1. `text`: Açıklama metni, kurallar ve püf noktaları.
2. `audio`: Dinleme ve kulak eğitimi kesitleri.
3. `examples`: Örnek kelimeler veya ayetler. `ayah` anahtarı mutlaka `^\d{1,3}:\d{1,3}$` formatında olmalıdır (örn: `1:1`, `78:1`).
4. `imitate`: Model kâriden dinleyip mikrofona tekrar etme egzersizi.
5. `quiz`: İlgili mini sınava referans (`quizId`).

### 1.3. Onay ve Yayınlama Döngüsü
- Yeni hazırlanan tüm derslerde:
  ```json
  "status": "draft",
  "needsReview": true
  ```
- Yalnızca alanında yetkin kıraat ve tecvid uzmanı tarafından incelenip onaylanan içeriklerde `needsReview` alanı `false` yapılır ve `status: "published"` değerine çekilir. CI testleri yayınlanan içeriklerde `needsReview: false` kuralını otomatik olarak denetler.

---

## 2. MAKAM DOSYALARI VE PERDE KURALLARI (`src/tilavet/data/makam/`)

Makam dizileri Türk musikisi Arel-Ezgi-Uzdilek 53 koma sistemine göre kodlanır:
- `degrees` dizisi:
  1. İlk derece mutlaka `0` koma (karar perdesi) olmalıdır (`komas: 0`).
  2. Son derece mutlaka `53` koma (tiz durak / oktav) olmalıdır (`komas: 53`).
  3. Ara dereceler kesinlikle **kesin artan** sırada olmalıdır (\(k_i > k_{i-1}\)).
- Her makam dosyasında seyir tipi (`inici`, `cikici`, `inici-cikici`), karar perdesi, güçlü perdesi ve asma kararlar belirtilmelidir.

---

## 3. SINAV DOSYALARI (`src/tilavet/data/quiz/`)

Sınavlar `src/tilavet/data/quiz/Q-{seviye}-{ders}.json` altında konumlanır:
- Soru tipleri:
  - `single`: Tek doğru seçenekli çoktan seçmeli.
  - `multi`: Birden fazla doğru seçeneği olan soru (`correct` dizi formatında).
  - `listen`: Ses kaydı dinletilerek tecvid kuralı veya makam tespiti yaptırılan soru.
- Her soru için net bir `explanation` (çözüm açıklaması) bulunmalıdır.

---

## 4. DİNİ VE ETİK İLKELER

Her içerik ve arayüz alanında aşağıdaki üç temel ilke açıkça vurgulanmalıdır:
1. **Hocanın Yerine Geçmez:** Bu uygulama bir rehber ve pratik aracıdır; canlı bir fem-i muhsin (ehil hoca) tedrisatının yerine geçemez.
2. **Tecvid Makamdan Önceliklidir:** Tilavette harflerin sıfatları ve tecvid hükümleri daima musiki ve makam kurallarından önceliklidir. Harfi bozan makam caiz değildir.
3. **Sertifika İcazet Değildir:** Modül sonlarında verilen başarı belgeleri yalnızca dijital katılım/başarı kaydıdır; şer'i bir kıraat icazeti teşkil etmez.
