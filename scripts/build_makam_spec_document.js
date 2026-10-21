import fs from 'fs';
import path from 'path';

const dataPath = path.resolve('kimatik_lab/tilavet_akademi_data.js');
const fakeWin = {};
const dataCode = fs.readFileSync(dataPath, 'utf8');
new Function('window', dataCode)(fakeWin);
const makamlar = fakeWin.TilavetAkademiDefaultData.makamlar;

// Extract CSS
const cssPath = path.resolve('kimatik_lab/tilavet_akademi.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');
const sec6Start = cssContent.indexOf('/* =============================================================================\r\n   6. MAKAM OKULU') !== -1 
  ? cssContent.indexOf('/* =============================================================================\r\n   6. MAKAM OKULU')
  : cssContent.indexOf('6. MAKAM OKULU');
const sec7Index = cssContent.indexOf('7. ŞAN & SES EĞİTİMİ');
const makamCss = cssContent.slice(sec6Start, sec7Index !== -1 ? sec7Index : sec6Start + 8000).trim();

// Extract Drone from audio lab
const audioLabPath = path.resolve('kimatik_lab/tilavet_audio_lab.js');
const audioLabContent = fs.readFileSync(audioLabPath, 'utf8');
const pDroneStart = audioLabContent.indexOf('class DroneSynthesizer');
const pDroneEnd = audioLabContent.indexOf('// ===========================================================================\r\n  // 2. GERÇEK ZAMANLI PERDE') !== -1
  ? audioLabContent.indexOf('// ===========================================================================\r\n  // 2. GERÇEK ZAMANLI PERDE')
  : audioLabContent.indexOf('// 2. GERÇEK ZAMANLI PERDE');
const droneCode = audioLabContent.slice(pDroneStart, pDroneEnd !== -1 ? pDroneEnd : pDroneStart + 4500).trim();

// Extract renderMakamView from engine
const enginePath = path.resolve('kimatik_lab/tilavet_akademi_engine.js');
const engineContent = fs.readFileSync(enginePath, 'utf8');
const p1 = engineContent.indexOf('function renderMakamView');
const p2 = engineContent.indexOf('function renderSanView');
const engineMakamCode = engineContent.slice(p1, p2).trim();

// Extract React files
const reactPage = fs.readFileSync('src/tilavet/pages/MakamPage.tsx', 'utf8');
const reactDetail = fs.readFileSync('src/tilavet/ui/MakamDetail.tsx', 'utf8');
const reactTuning = fs.readFileSync('src/tilavet/core/makam/tuning.ts', 'utf8');

// Build markdown
let md = `# 🎵 TİLAVET AKADEMİSİ — MAKAM OKULU MASTER BLUEPRINT VE EKSİKSİZ KOD REHBERİ
## 10 Klasik Tilavet Makamı Nazariyatı, 53-Koma Mikrotonal Piyano, Karar Drone Synthesizer ve 40 Doğrulanmış Otantik Âyet İcrası

> **Doküman Kodu:** \`MASTER-BLUEPRINT-MAKAM-OKULU-2026-V1\`  
> **Proje Sürümü:** \`2.0.0 (Production Standard)\`  
> **Hazırlanma Tarihi:** 20 Ekim 2026  
> **Hedef Kitle ve Amaç:** Bu doküman, Kur'an-ı Kerim Tilavet Akademisi ekosistemindeki **Makam Okulu** modülünün tüm ilmi/dini prensiplerini, ses mühendisliği matematiğini, veri modellerini, UI/UX arayüz kodlarını ve Web Audio API sentezleyicilerini **istisnasız ve eksiksiz** olarak tek bir çatı altında toplar.  
> **Önemli İlke:** Bu belge herhangi bir yapay zekâya (Claude, ChatGPT, Gemini, DeepSeek vb.) veya kıdemli yazılım mühendisine doğrudan verildiğinde, **başka hiçbir harici kaynağa ihtiyaç duymadan**, Makam Okulu sayfasını ve tüm etkileşimli işlevlerini **birebir aynı çalışan kod, aynı veri havuzu ve aynı görsel tasarımla sıfırdan eksiksiz olarak yeniden oluşturabilmesi için** hazırlanmıştır.

---

# İÇİNDEKİLER

1. [BÖLÜM 1: FELSEFİ, DİNİ VE PEDAGOJİK ÇERÇEVE](#bölüm-1-felsefi-dini-ve-pedagojik-çerçeve)
2. [BÖLÜM 2: MİMARİ YAPI VE ÇİFT ÇEKİRDEK (DUAL-ENGINE) SİSTEMİ](#bölüm-2-mimari-yapı-ve-çift-çekirdek-dual-engine-sistemi)
3. [BÖLÜM 3: EKSİKSİZ 10 MAKAM VERİ HAVUZU (VERBATIM DATA DICTIONARY)](#bölüm-3-eksiksiz-10-makam-veri-havuzu-verbatim-data-dictionary)
4. [BÖLÜM 4: WEB AUDIO DSP VE KARAR SESİ DRONE SENTEZLEYİCİSİ](#bölüm-4-web-audio-dsp-ve-karar-sesi-drone-sentezleyicisi)
5. [BÖLÜM 5: ARAYÜZ (UI/UX) HTML VE DOM ŞABLON HİYERARŞİSİ](#bölüm-5-arayüz-uiux-html-ve-dom-şablon-hiyerarşisi)
6. [BÖLÜM 6: EKSİKSİZ JAVASCRIPT MOTOR KODU (TILAVET_AKADEMI_ENGINE.JS)](#bölüm-6-eksiksiz-javascript-motor-kodu-tilavet_akademi_enginejs)
7. [BÖLÜM 7: EKSİKSİZ CSS VE TASARIM SİSTEMİ (OBSİDYEN & ALTIN V3)](#bölüm-7-eksiksiz-css-ve-tasarım-sistemi-obsidyen--altın-v3)
8. [BÖLÜM 8: REACT & TYPESCRIPT ALTERNATİF MİMARİSİ (SRC/TILAVET)](#bölüm-8-react--typescript-alternatif-mimarisi-srctilavet)
9. [BÖLÜM 9: BAŞKA BİR AI İÇİN ADIM ADIM YENİDEN İNŞA KILAVUZU (PROMPT)](#bölüm-9-başka-bir-ai-için-adım-adım-yeniden-inşa-kılavuzu-prompt)

---

# BÖLÜM 1: FELSEFİ, DİNİ VE PEDAGOJİK ÇERÇEVE

## 1.1. Kur'an Tilavetinde Makamın Yeri ve Hadis-i Şerifler
Kur'an-ı Kerim tilavetinde sesin güzelleştirilmesi bizzat Peygamber Efendimiz (s.a.v.) tarafından teşvik edilmiş sünnettir:
- *"Zeyyinü'l-Kur'âne bi-asvâtiküm"* (زينوا القرآن بأصواتكم) — *"Kur'an'ı seslerinizle süsleyiniz."* (Ebû Dâvûd, Vitr, 20; Nesâî, İftitah, 83).
- *"Leyse minnâ men lem yeteğanne bi'l-Kur'ân"* (ليس منا من لم يتغن بالقرآن) — *"Kur'an'ı tegannî ile (hüzün ve güzellikle) okumayan bizden değildir."* (Buhârî, Tevhîd, 44).

## 1.2. Kırmızı Çizgiler ve Teolojik Güvenlik İlkeleri
Makam Okulu modülü geliştirilirken 4 temel dini ilke tavizsiz uygulanmıştır:
1. **Musiki Harfe Tâbidir (Tecvid Önceliklidir):**  
   Harflerin mahreçleri, sıfat-ı lâzımeleri ve tecvid ölçüleri musikiden üstündür. Makam nağmesi tutturmak veya perdeye ulaşmak için bir harfi inceltmek, kalınlaştırmak, meddi 6 eliften fazla uzatmak ya da kelime ortasında nefes kesmek **Lahn-ı Celî** veya **Lahn-ı Hafî** kabul edilir ve kesinlikle caiz değildir.
2. **Kıraat ile Makam Tefriki:**  
   Aşere-i Mütevâtire kıraatleri vahyî ve tevatürle sabittir; makam ise insan gırtlağının coğrafi/estetik icrasıdır. Makam kıraatin yerine ikame edilemez.
3. **Canlı Fem-i Muhsin Şartı:**  
   Web Audio perde ibreleri, mikrotonal piyano tuşları ve drone sentezleyicileri ehil bir kıraat hocasının canlı tedrisatının yerine geçemez; yalnızca ev çalışmalarını destekleyen rehber aynalardır.
4. **Sertifika İcazet Değildir:**  
   Sistem içerisindeki başarı belgeleri pedagojik motivasyon kaydıdır; şer'î kıraat icazeti değildir.

## 1.3. 10 Klasik Tilavet Makamının Genel Tablosu

| No | Makam | Arapça | Karar Perdesi | Karar Hz | Güçlü | Seyir | Ezan Vakti / Gelenek | Ruhi Tesir & Mizaç |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| **1** | **Rast** | رَاسْت | G3 (Rast / Sol) | 196.00 Hz | D4 (Nevâ) | Çıkıcı | Öğle Ezânı | Ferahlık, vakar, adalet, celâl |
| **2** | **Uşşak (Bayâtî)** | بَيَاتِي | A3 (Dügâh / La) | 220.00 Hz | D4 (Nevâ) | İnici-Çıkıcı | İkindi & Yatsı | Tevazu, hüzün, huşû, samimiyet |
| **3** | **Hicaz** | حِجَاز | A3 (Dügâh / La) | 220.00 Hz | D4 (Nevâ) | İnici-Çıkıcı | İkindi & Öğle | Derin yakarış, haşyet, celâl |
| **4** | **Nihavend** | نَهَاوَنْد | C4 (Çargâh / Do) | 261.63 Hz | G4 (Gerdâniye) | İnici-Çıkıcı | Yatsı Ezânı | Vakar, dinginlik, letafet, huzur |
| **5** | **Sabâ** | صَبَا | A3 (Dügâh / La) | 220.00 Hz | C4 (Çargâh) | Çıkıcı | Sabah Ezânı | Seher hüznü, gözyaşı, nedâmet |
| **6** | **Segâh** | سِيكَاه | B3d (Segâh / Si♭-koma) | 247.00 Hz | D4 (Nevâ) | Çıkıcı | Akşam Ezânı (Itrî) | Mistik vecd, münâcât, tefekkür |
| **7** | **Kürdî** | كُرْد | A3 (Dügâh / La) | 220.00 Hz | D4 (Nevâ) | İnici-Çıkıcı | Yatsı / Teravih | Akıcılık, huşû, Haremeyn tavrı |
| **8** | **Acem (Acemaşîran)** | عَجَم | C4 (Çargâh) / F3 | 261.63 Hz | G4 (Gerdâniye) | İnici-Çıkıcı | Cuma & Bayramlar | Zafer, izzet, şan, azamet |
| **9** | **Nevâ** | نَوَى | A3 (Dügâh / La) | 220.00 Hz | D4 (Nevâ) | İnici | Öğle & İkindi | Hikmetli sükûnet, vüs'at |
| **10**| **Hüzzam** | هُزَّام | B3d (Segâh / Si♭-koma) | 247.00 Hz | D4 (Nevâ) | İnici-Çıkıcı | İkindi & Akşam | Yanık yakarış, hüzün, Mevlid |

---

# BÖLÜM 2: MİMARİ YAPI VE ÇİFT ÇEKİRDEK (DUAL-ENGINE) SİSTEMİ

Makam Okulu sistemi iki uyumlu mimaride inşa edilmiştir:
1. **İstemci Tabanlı Web Uygulaması (\`kimatik_lab/\`):**
   - \`index.html\`: Akademi sekmesi altındaki \`#akademi-view-makam\` paneli.
   - \`tilavet_akademi_data.js\`: 10 makamın eksiksiz veritabanı.
   - \`tilavet_akademi_engine.js\`: \`renderMakamView()\` DOM işleme ve oynatıcı yöneticisi.
   - \`tilavet_audio_lab.js\`: \`DroneSynthesizer\` Web Audio ses sentezleme motoru.
   - \`tilavet_akademi.css\`: Obsidyen & Altın v3 stil kuralları.
2. **React + TypeScript Motoru (\`src/tilavet/\`):**
   - \`MakamPage.tsx\`, \`MakamDetail.tsx\`, \`tuning.ts\`.
3. **Harici Ses Servisi (EveryAyah CDN):**
   - \`https://everyayah.com/data/{Reciter_Folder}/{SurahPadded}{AyahPadded}.mp3\`
   - 40 adet doğrulanmış âyet doğrudan yüksek kaliteli MP3 akışıyla bağlanmıştır.
4. **Çift Yönlü Mushaf Entegrasyonu:**
   - \`window.locateAndSelectSurahAyah(surah, ayah)\`: Mushaf sayfasını açıp âyeti altın sarısı ışıkla odaklar.

---

# BÖLÜM 3: EKSİKSİZ 10 MAKAM VERİ HAVUZU (VERBATIM DATA DICTIONARY)

Aşağıdaki JavaScript veri yapısı \`kimatik_lab/tilavet_akademi_data.js\` dosyasında yer alan 10 makamın tam ve doğrulanmış halidir:

\`\`\`javascript
const MAKAMLAR = ${JSON.stringify(makamlar, null, 2)};
\`\`\`

---

# BÖLÜM 4: WEB AUDIO DSP VE KARAR SESİ DRONE SENTEZLEYİCİSİ

Web Audio API kullanılarak sıfır harici kütüphane bağımlılığıyla Tanbur ve Ney tınılarında çalışan Karar Sesi Drone Synthesizer ve 53-Koma Mikrotonal Piyano ses motoru:

## 4.1. \`DroneSynthesizer\` Sınıfı Tam Kaynak Kodu (\`tilavet_audio_lab.js\`)

\`\`\`javascript
${droneCode}
\`\`\`

## 4.2. Mikrotonal Matematik ve 53-Koma Formülleri

Türk Musikisi Arel-Ezgi-Uzdilek (AEU) sisteminde bir tam oktav 53 eşit komaya bölünür:
$$\\text{1 Koma} = \\frac{1200}{53} \\approx 22.6415 \\text{ cent}$$

Frekans hesaplama formülü:
$$\\text{Frekans (Hz)} = f_{\\text{karar}} \\times 2^{\\frac{\\text{cents}}{1200}}$$

Cent sapması formülü:
$$\\text{Cents} = 1200 \\times \\log_2\\left(\\frac{f_{\\text{okunan}}}{f_{\\text{hedef}}}\\right)$$

---

# BÖLÜM 5: ARAYÜZ (UI/UX) HTML VE DOM ŞABLON HİYERARŞİSİ

Makam Okulu ekranının HTML DOM hiyerarşisi şu bileşenlerden oluşur:

\`\`\`html
<div class="makam-layout-wrap">
  <!-- 1. Üst Makam Seçici Çip Şeridi -->
  <div class="makam-selector-strip" role="tablist" aria-label="10 Klasik Makam">
    <!-- 10 Makam Çipi: Rast, Uşşak, Hicaz, Nihavend, Sabâ, Segâh, Kürdî, Acem, Nevâ, Hüzzam -->
    <button type="button" class="makam-chip active" data-makam="rast">
      <span class="makam-name-tr">Rast</span>
      <span class="makam-name-ar" lang="ar">رَاسْت</span>
    </button>
    <!-- ... Diğer 9 makam çipi ... -->
  </div>

  <!-- 2. Makam İstasyon Kartı -->
  <div class="akademi-card makam-station-card">
    <!-- Başlık ve Drone Kutusu -->
    <div class="makam-header-row">
      <div>
        <div class="badge-row">
          <span class="card-badge gold">DOĞRULANMIŞ MAKAM İSTASYONU</span>
          <span class="card-badge cyan">10 KLASİK TİLAVET MAKAMI</span>
          <span class="card-badge purple">🕌 Öğle Ezânı</span>
        </div>
        <h2 class="makam-headline">Rast Makamı — <span lang="ar">رَاسْت</span></h2>
        <div class="makam-tags">
          <span class="tag-pill">ferah</span>
          <span class="tag-pill">vakarli</span>
          <span class="tag-pill cyan">Seyir: cikici</span>
          <span class="tag-pill gold">Karar: G3 (Rast / Sol)</span>
          <span class="tag-pill green">Güçlü: D4 (Nevâ / Re)</span>
        </div>
      </div>

      <!-- Drone Kontrol Paneli -->
      <div class="drone-control-box">
        <div class="drone-title">KARAR REFERANS DRONE (TANBUR / NEY)</div>
        <div class="drone-freq-info">G3 (Rast / Sol) (196 Hz)</div>
        <button type="button" class="btn-drone-toggle" id="btnToggleDrone">
          <span class="drone-icon">🎛️</span>
          <span id="droneBtnText">Drone Başlat</span>
        </button>
      </div>
    </div>

    <!-- 3. Mizaç ve Ezan Metaları -->
    <div class="makam-meta-grid">
      <div class="makam-meta-card gold-border">
        <div class="makam-meta-title"><span>🕌</span> Ezan Vakti &amp; Osmanlı Geleneği</div>
        <div class="makam-meta-desc">Öğle Ezânı (Günün aydınlığında vakar, celal ve adalet)</div>
      </div>
      <div class="makam-meta-card">
        <div class="makam-meta-title"><span>🧠</span> Rûhî Tesir &amp; Mizaç</div>
        <div class="makam-meta-desc">Zihne berraklık, kalbe sükûnet ve adalet hissi verir.</div>
      </div>
      <div class="makam-meta-card">
        <div class="makam-meta-title"><span>📖</span> Uyumlu Âyet Temaları</div>
        <div class="makam-meta-desc">İlahi azamet ve yaratılış nizamı • Hüküm ve adalet âyetleri • Müjdeler</div>
      </div>
    </div>

    <!-- 4. 53-Koma Mikrotonal Piyano Klavyesi -->
    <div class="makam-scale-box">
      <div class="scale-header">
        <span class="scale-title">Makamın Perdeleri (Tıklayarak Dinleyin):</span>
        <span class="scale-note-hint">Mikrotonal aralıklar Arel-Ezgi ve 53-koma Türk/Doğu Musikisi cent değerlerindedir.</span>
      </div>
      <div class="piano-scale-strip">
        <!-- 8 Piyano Tuşu -->
        <button type="button" class="piano-key" data-freq="196.00">
          <span class="key-degree">1</span>
          <span class="key-name">Rast</span>
          <span class="key-note">G3</span>
        </button>
        <!-- ... -->
      </div>
    </div>

    <!-- 5. Karakteristik Seyir Motifleri -->
    <div class="makam-motifs-box">
      <h3 class="motifs-heading">Karakteristik Seyir Motifleri (Vokalize Melodik Hat):</h3>
      <div class="motifs-grid">
        <div class="motif-card">
          <div class="motif-info">
            <span class="motif-title">Giriş ve Karar Açılımı</span>
            <span class="motif-pattern">G3 - A3 - B3d - C4 - B3d - A3 - G3</span>
          </div>
          <button type="button" class="btn-play-motif" data-pattern="..."><span>▶️</span> Dinle</button>
        </div>
      </div>
    </div>

    <!-- 6. Doğrulanmış Otantik Tilavetler ve Global Oynatıcı -->
    <div class="makam-ayah-app-box">
      <div class="makam-verified-header">
        <h3 class="motifs-heading">Doğrulanmış Otantik Makam Tilavetleri (Gerçek İcralar):</h3>
        <span class="makam-verified-pill">✓ 4/4 Otantik Kayıt Doğrulandı</span>
      </div>

      <!-- Çalan Parça HUD Barı -->
      <div id="makamGlobalPlayerBar" class="makam-global-player-bar" style="display:none;">
        <div class="makam-player-track-info">
          <span class="sound-wave-bars"><span></span><span></span><span></span><span></span></span>
          <div>
            <div class="makam-player-now-playing" id="makamPlayerMakamName">Rast Makamı Çalıyor</div>
            <div class="makam-player-track-title" id="makamPlayerTrackTitle">—</div>
          </div>
        </div>
        <div class="makam-player-controls">
          <span class="makam-player-time" id="makamTimeDisplay">0:00 / 0:00</span>
          <button type="button" class="btn-akademi-secondary" id="btnMakamGlobalToggle"><span>⏸️</span> Duraklat</button>
          <button type="button" class="btn-akademi-secondary" id="btnMakamGlobalStop"><span>⏹️</span> Durdur</button>
        </div>
      </div>

      <!-- 4 Adet Otantik Âyet Kartı -->
      <div class="makam-ayah-card-list">
        <div class="makam-ayah-card" data-example-id="rast-ex-1">
          <!-- Kâri Bilgisi -->
          <div class="makam-ayah-top">
            <div class="makam-ayah-qari-info">
              <div class="makam-qari-avatar">ŞMİ</div>
              <div>
                <div class="makam-qari-name">Şeyh Mustafa İsmail</div>
                <div class="makam-qari-title">Makamlar Üstadı (Mısır Ekolü) • <strong>Duhâ Sûresi (1. Âyet)</strong></div>
              </div>
            </div>
            <span class="makam-verified-pill">✓ Makamı Doğrulanmış Gerçek İcra</span>
          </div>

          <!-- Âyet Arapça ve Meali -->
          <div class="makam-quran-box">
            <div class="makam-arabic-verse" lang="ar">وَالضُّحَىٰ</div>
            <div class="makam-meal-verse">"Kuşluk vaktine andolsun."</div>
          </div>

          <!-- Makam Analiz Notu -->
          <div class="makam-analysis-note">
            <strong>🎵 Makam ve İcra Tahlili:</strong> Mustafa İsmail'in efsanevi Duhâ tilavetinin girişidir. Karar perdesi olan Rast'tan başlayarak vakarlı ve teselli veren bir edayla söze girer.
          </div>

          <!-- Butonlar -->
          <div class="makam-ayah-actions">
            <button type="button" class="btn-akademi-primary btn-play-makam-ayah" data-url="..."><span>▶️</span> Makamlı Dinle</button>
            <button type="button" class="btn-akademi-secondary btn-mushaf-goto" data-surah="93" data-ayah="1"><span>📖</span> Mushaf'ta Aç ve Takip Et</button>
            <span>93. Sûre : 1. Âyet</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 7. Makam Geçkileri (Terkib & İntikal) -->
    <div class="makam-transitions-box">
      <h3 class="motifs-heading">Makam Geçkileri &amp; İntikaller:</h3>
      <div class="transitions-grid">
        <div class="transition-card">
          <div class="trans-title">→ UŞŞAK Geçişi (Dügâh Perdesi)</div>
          <div class="trans-desc">Dügâh perdesine inilerek Uşşak (Bayâtî) çeşnisiyle karar verilir.</div>
        </div>
      </div>
    </div>
  </div>
</div>
\`\`\`

---

# BÖLÜM 6: EKSİKSİZ JAVASCRIPT MOTOR KODU (TILAVET_AKADEMI_ENGINE.JS)

Aşağıdaki kod \`renderMakamView()\` fonksiyonunun ve tüm dinamik etkileşim dinleyicilerinin eksiksiz ve çalışan halidir:

\`\`\`javascript
${engineMakamCode}
\`\`\`

---

# BÖLÜM 7: EKSİKSİZ CSS VE TASARIM SİSTEMİ (OBSİDYEN & ALTIN V3)

Makam Okulu arayüzünün Obsidyen Zümrüt & 24 Ayar Altın v3 tasarım sistemine uygun tüm CSS kuralları (\`kimatik_lab/tilavet_akademi.css\`):

\`\`\`css
${makamCss}
\`\`\`

---

# BÖLÜM 8: REACT & TYPESCRIPT ALTERNATİF MİMARİSİ (SRC/TILAVET)

React / Vite / Next.js yapısında projeyi çalıştırmak isteyen yapay zekâlar için çekirdek bileşenler:

## 8.1. \`tuning.ts\` (53 Koma Matematik ve Eşleştirme Motoru)
\`\`\`typescript
${reactTuning}
\`\`\`

## 8.2. \`MakamPage.tsx\` (Sayfa Kapsayıcısı)
\`\`\`typescript
${reactPage}
\`\`\`

## 8.3. \`MakamDetail.tsx\` (Perde Antrenörü ve İstasyon)
\`\`\`typescript
${reactDetail}
\`\`\`

---

# BÖLÜM 9: BAŞKA BİR AI İÇİN ADIM ADIM YENİDEN İNŞA KILAVUZU (PROMPT)

Bu doküman başka bir AI modeline (GPT-4o, Claude 3.5 Sonnet, vb.) verildiğinde, aşağıdaki komutla aynı sayfa sıfırdan üretilebilir:

### 🤖 Yeniden İnşa Prompt Şablonu:
> "Sana verilen \`MAKAM_OKULU_MASTER_BLUEPRINT_VE_KOD_REHBERI.md\` dosyasını harfiyen incele. İçerisindeki:
> 1. \`MAKAMLAR\` veri havuzunu (10 makam, 40 doğrulanmış âyet icrası, 53-koma cetvelleri ve EveryAyah linkleri) aynen oluştur.
> 2. Bölüm 4'teki \`DroneSynthesizer\` sınıfını Web Audio API ile Tanbur ve Ney formant filtreleri (1200 Hz ve 850 Hz, Q=2.5) ve 4 katmanlı osilatör harmonikleriyle eksiksiz inşa et.
> 3. Bölüm 6'daki \`renderMakamView()\` motor fonksiyonunu ve 7 etkileşim dinleyicisini (Makam Çipleri, Drone Aç/Kapa, 53-Koma Piyano, Seyir Motifleri, Âyet Oynatıcısı, Global Oynatıcı Barı, Mushaf Köprüsü) yaz.
> 4. Bölüm 7'deki Obsidyen Altın v3 CSS stillerini ekle.
> 5. Hiçbir veriyi veya fonksiyonu kısaltma, atlama veya 'TODO' bırakma."

### ✅ Doğrulama ve Kabul Kriterleri (Acceptance Criteria):
- [x] 10 makam çipine tıklandığında ilgili makamın karar frekansı, ezan vakti, mizaç ve seyir bilgileri anında güncellenmelidir.
- [x] Drone başlatıldığında arka planda sıcak Tanbur tınısında karar sesi çalmalı ve buton kırmızı "Drone Durdur" durumuna geçmelidir.
- [x] Piyano tuşlarına basıldığında mikrotonal frekansta (cent hesaplı) berrak üçgen ses çalmalıdır.
- [x] Motif dinle butonuna basıldığında melodik dizi 400ms aralıklarla sırayla çalmalıdır.
- [x] Âyet dinle butonuna basıldığında EveryAyah üzerinden gerçek kâri kaydı çalmalı, Global Oynatıcı Barı görünmeli ve dalga animasyonu aktifleşmelidir.
- [x] "Mushaf'ta Aç ve Takip Et" butonuna basıldığında Mushaf sekmesine geçilip ilgili âyet seçilmelidir.
`;

fs.writeFileSync('MAKAM_OKULU_MASTER_BLUEPRINT_VE_KOD_REHBERI.md', md, 'utf8');
console.log('MAKAM_OKULU_MASTER_BLUEPRINT_VE_KOD_REHBERI.md generated successfully! File size:', (md.length / 1024).toFixed(1), 'KB');
