# TİLAVET AKADEMİSİ — DOĞRULANMIŞ KAYNAKÇA ENVENTERİ (SOURCES.md)

> **Doküman Kodu:** `REF-TL-SRC-01`  
> **Sürüm:** 2.0.0  
> **Tarih:** 19 Ekim 2026  
> **Durum:** Onaylandı / Üretim Standardı

---

## 1. KUR'AN-I KERİM METİN VE RESM-İ OSMANİ KAYNAKLARI

1. **Tanzil Project (Tanzil.net)**
   - **Kullanım:** Ayet metinleri, Uthmani imlası, sure/ayet dizini, secavend durak işaretleri.
   - **Doğrulama:** Dünya genelinde yüzlerce İslamî yazılım tarafından kullanılan ve Mushaf kurulları tarafından teyit edilmiş dijital metin standardı.
   - **Lisans:** Creative Commons Attribution 3.0.

2. **King Fahd Glorious Quran Printing Complex (KFGQPC / مجمع الملك فهد لطباعة المصحف الشريف)**
   - **Kullanım:** Medine Mushafı hattı, karakter glifleri ve kelime sınırları.
   - **Erişim:** Resmi KFGQPC dijital yazı tipi paketleri.

3. **Diyanet İşleri Başkanlığı Mushafları İnceleme ve Kıraat Kurulu**
   - **Kullanım:** Türkiye'de basılan ve okunan Mushafların imlâ ve secavend ölçütleri.

---

## 2. KIRAAT VE TECVİD İLMİ KAYNAK ESERLERİ

1. **İbnü'l-Cezerî (v. 833/1429)**
   - *el-Mukaddimetü'l-Cezeriyye fi't-Tecvîd*: Mahreçler, harflerin sıfatları, nûn-ı sâkin, medd hükümleri ve vakıf kaideleri.
   - *en-Neşr fi'l-Kırââti'l-Aşr*: Aşere-i mütevâtire kıraat imamları, râvileri ve usûl farklılıkları.
   - *Tayyibetü'n-Neşr fi'l-Kırââti'l-Aşr*: Kıraat tariklerinin manzum ana kaynağı.

2. **İmam eş-Şâtıbî (v. 590/1194)**
   - *Hırzü'l-Emânî ve Vechü't-Tehânî (eş-Şâtıbiyye)*: Yedi kıraat imamı ve râvilerinin usûl ve ferş kuralları.

3. **Süleyman b. Hüseyin el-Cemzûrî (v. 1198/1784)**
   - *Tuhfetü'l-Etfâl ve'l-Gılmân fî Tecvîdi'l-Kur'ân*: Nûn-ı sâkin, tenvin, mîm-i sâkin ve medd çeşitleri temel ders metni.

4. **Abdurrahman el-Karabaşî (v. 904/1498)**
   - *Karabaş Tecvidi*: Osmanlı medreselerinde yüzyıllardır okutulan uygulamalı Türkçe tecvid klasiği.

5. **Abdülfettâh el-Mersafî**
   - *Hidayetü'l-Kârî ilâ Tecvîdi Kelâmi'l-Bârî*: Çağdaş kıraat ve tecvid tedrisatında müracaat edilen geniş hacimli akademik kaynak.

---

## 3. MUSİKİ, MAKAMLAR VE AKORT NAZARİYATI

1. **Rauf Yekta Bey**
   - *Türk Musikisi Nazariyatı*: 53 Arel-Ezgi-Uzdilek (AEU) koma sisteminin tarihi temelleri.

2. **Dr. Suphi Ezgi & Hüseyin Sadettin Arel**
   - *Nazarî ve Amelî Türk Musikisi*: Aralıklar, çeşniler (dörtlü ve beşliler), makam dizileri ve seyir kuralları.

3. **İsmail Hakkı Özkan**
   - *Türk Mûsikîsi Nazariyatı ve Usûlleri*: Karar, güçlü, asma karar ve seyir yönleri (çıkıcı, inici, inici-çıkıcı).

4. **Dr. Subhi Enver & Şeyh Mahmud et-Tantâvî**
   - *Makamâtü'l-Kur'an*: Mısır tilavet ekolünde Kur'an tilavetinde makamların kullanımı, caiz olan ve olmayan icralar.

5. **Maqam World**
   - Arap geleneksel makam sistemi, 24-çeyrek ton (quarter-tone) aralıkları ve cins yapıları.

---

## 4. DİJİTAL SES İŞLEME (DSP) VE MÜHENDİSLİK KAYNAKLARI

1. **Alain de Cheveigné & Hideki Kawahara (2002)**
   - *"YIN, a fundamental frequency estimator for speech and music"*, Journal of the Acoustical Society of America, 111(4), 1917–1930.
   - **Kullanım:** `src/tilavet/core/audio/pitch.ts` temel frekans (F0) hesaplama motoru.

2. **Hiroaki Sakoe & Seibi Chiba (1978)**
   - *"Dynamic programming algorithm optimization for spoken word recognition"*, IEEE Transactions on Acoustics, Speech, and Signal Processing, 26(1), 43–49.
   - **Kullanım:** `src/tilavet/core/audio/contour.ts` Sakoe-Chiba bant kısıtlamalı DTW karşılaştırması.

3. **Piotr Woźniak (1990)**
   - *SuperMemo 2 (SM-2) Spaced Repetition Algorithm*.
   - **Kullanım:** `src/tilavet/core/learning/srs.ts` aralıklı tekrar hafıza aralıkları.

4. **W3C Web Audio API Recommendation**
   - Web Audio Context, AnalyserNode, OscillatorNode, BiquadFilterNode formant filtreleri.

5. **Prof. Dr. Erol Belgin (Hacettepe Üniversitesi)**
   - *Ses Eğitimi, Akustik ve Vokal Hijyen İlkeleri*.
   - **Kullanım:** Diyafram 4-4-8 ritmik nefes koçu ve ses sağlığı güvenlik uyarıları.

---

## 5. TİLAVET SES KAYITLARI VE AÇIK ARŞİVLER

- **EveryAyah.com:**
  - Şeyh Muhammed Sıddîk el-Minşâvî (Murattal / Tahkik)
  - Şeyh Mahmûd Halîl el-Husarî (Murattal / Muallim)
  - Şeyh Abdülbâsit Abdüssamed (Murattal)
  - Şeyh Mustafa İsmâil (Murattal)
  - Şeyh Mişârî Râşid el-Afâsî (Murattal)
- **Kullanım Şekli:** Yalnızca istemci tarafında streaming (doğrudan CDN akışı); re-host veya izinsiz depolama yapılmaz.
