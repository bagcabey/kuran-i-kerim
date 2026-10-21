# TİLAVET AKADEMİSİ — İÇERİK ÜRETİM STANDARTLARI (CONTENT_STANDARDS.md)

> **Doküman Kodu:** `STD-TL-CONT-01`  
> **Sürüm:** 2.0.0  
> **Tarih:** 19 Ekim 2026  
> **Durum:** Onaylandı / Üretim Standardı

---

## 1. İÇERİK FELSEFESİ VE DİNİ HASSASİYETLER

Kur'an-ı Kerim tilaveti, tecvid ve kıraat alanındaki içerik üretimi; sıradan bir yabancı dil veya müzik dersi gibi ele alınamaz. İlahi kelamın aslına uygun korunması ve nesilden nesile aktarılmış sahih usullere riayet esastır.

### Temel Dini İlkeler:
1. **Canlı Fem-i Muhsin Şartı:** Bu platformdaki eğitimler tamamlayıcıdır; ehil bir kıraat hocasının rehberliğinin yerini tutamaz.
2. **Tecvidin Önceliği:** Makam ve musiki, harflerin mahreç ve sıfatlarına tâbidir. Tecvidi bozan hiçbir makam icrası meşru kabul edilemez.
3. **Kıraat İcazeti Şerhi:** Dijital sınavlar sonucu verilen başarı belgeleri yalnızca pedagojik motivasyon amaçlıdır; şer'î kıraat icazeti teşkil etmez.
4. **Tahmini Geri Bildirim:** Otomatik ses analizi (ASR ve perde tahmini) kesin hüküm değil, "tahmini analiz" olarak etiketlenmelidir.

---

## 2. MODÜL İÇERİK ŞABLONLARI

### 2.1. Ders Şablonu (`src/tilavet/data/lessons/L{seviye}-{sira}-{slug}.json`)
```json
{
  "id": "L3-2-izhar",
  "title": { "tr": "İzhâr Kuralı", "en": "Izhar Rule", "ar": "حكم الإظهار" },
  "level": 3,
  "prerequisites": ["L3-1-nun-sakin-giris"],
  "minutes": 15,
  "sections": [
    { "type": "text", "body": "İzhâr kuralının tanımı..." },
    { "type": "examples", "items": [{ "ayah": "1:1", "wordIndex": 2, "rule": "izhar" }] },
    { "type": "imitate", "ayah": "1:1", "reciter": "minshawi" },
    { "type": "quiz", "quizId": "Q-3-2" }
  ],
  "needsReview": true,
  "status": "draft"
}
```

### 2.2. Makam Şablonu (`src/tilavet/data/makam/{makamId}.json`)
- `degrees` dizisi:
  - İlk derece mutlaka `0` koma (`komas: 0`).
  - Son derece mutlaka `53` koma (`komas: 53`).
  - Ara dereceler kesinlikle artan sırada olmalıdır (\(k_i > k_{i-1}\)).
- Seyir tipi (`inici`, `cikici`, `inici-cikici`), karar perdesi, güçlü perdesi ve asma kararlar belirtilmelidir.

### 2.3. Sınav Şablonu (`src/tilavet/data/quiz/Q-{seviye}-{ders}.json`)
- Soru tipleri:
  - `single`: Tek doğru seçenekli.
  - `multi`: Çoktan seçmeli.
  - `listen`: Ses kaydı dinletilerek kural/makam tespiti yaptırılan soru.
- Her soruda kapsamlı `explanation` (çözüm gerekçesi) bulunmalıdır.

---

## 3. DOĞRULAMA VE İNCELEME DÖNGÜSÜ

```
[İçerik Taslağı] ──> [Kaynak Teyidi] ──> [Makam / Tecvid İncelemesi] ──> [Yayın Onayı]
 (status: draft,     (Kaynaklar belgelenir)   (Uzman formu Ek B doldurulur)  (status: published,
  needsReview: true)                                                         needsReview: false)
```

CI testleri (`content.test.ts`), `status: "published"` olan hiçbir içeriğin `needsReview: true` olarak yayına girmesine izin vermez.

---

## 4. TELİF VE SES KAYNAKLARI STANDARDI

- **EveryAyah CDN:** Yalnızca açık akış (streaming) olarak kullanılır; yerel depolama veya re-host yapılmaz.
- **Quran Foundation API:** Doğrulanmış Uthmani Mushaf metinleri ve kelime düzeyinde zaman damgaları kullanılır.
- **Kâri Hakları:** Minşâvî, Husarî, Abdülbâsit gibi üstatların kayıtları açık kamuya mal olmuş vakıf/arşiv kayıtları çerçevesinde sunulur.
