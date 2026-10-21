# EK A — ÖZEL SES ÇEKİMİ BRİEF'İ (Katman B)

> **Amaç:** Tilavet Akademisi için yüksek çözünürlüklü, stüdyo ortamında kaydedilmiş, izole makam, mahreç ve tecvid model okuma kütüphanesinin oluşturulması.

---

## 1. GENEL STANDARTLAR VE SANATÇI PROFİLİ

- **Ses Sanatçıları:**
  - İcazetli ve tilavet/tecvid sahasında temayüz etmiş kurrâ veya hâfız.
  - Türk makam ekolü ve Mısır/Arap ekolü seyirlerine vakıf ses icracısı.
  - Türkçe teorik kural açıklamaları ve yönergeler için diksiyonu düzgün eğitmen sesi.
  - Kadın kullanıcılar için pedagojik olarak uygun bağlamda kadın eğitmen sesi opsiyonu.
- **Kayıt Ortamı:** Profesyonel akustik oda (akustik yutuculu, sıfır arka plan gürültüsü, reverb < 0.2s).
- **Format:**
  - Ana Kayıt: 48 kHz / 24-bit WAV (uncompressed PCM).
  - Dağıtım: Opus (96 kbps) ve AAC (128 kbps).
  - Seviye: Tutarlı −16 LUFS (±1 LUFS tolerans), tepe noktası (True Peak) max −1 dBTP.
  - Her ses kaydının başında ve sonunda tam 500 ms mutlak sessizlik.

---

## 2. ÇEKİM LİSTESİ VE REPERTUVAR

### 2.1 Elif-Ba ve Mahreç Seti (Seviye 1)
- 28 Arap harfi:
  - Tek başına cezimli çıkış (أَبْ، أَتْ، أَثْ...)
  - Üstün, esre, ötreli tekil telaffuz
  - Mahreç benzerliği olan çiftler (ث/س/ص, ذ/ز/ظ, ت/ط, ح/ه/خ, ع/ء, ق/ك, ض/د) — 3 sn ara ile model telaffuz
  - Yaygın telaffuz hatası (yanlış) ve ardından düzeltilmiş (doğru) mukayese kaydı.

### 2.2 Tecvid Kuralları Seti (Seviye 3)
- İzhâr, İdğâm-ı Maalgunne, İdğâm-ı Bilâgunne, İklâb, İhfâ için 5'er örnek âyet parçası.
- Medd-i Muttasıl, Munfasıl, Lâzım, Ârız için tam 4 elif miktarı (tutarlı metronom ile) okuyuş.
- Kalkale harfleri (ق ط ب ج د) suğra ve kübra örnekleri.
- Her örnek için **yavaş (tahkik)** ve **orta (tedvir)** hızda iki ayrı çekim.

### 2.3 Okuma Hızları Mukayesesi (Seviye 4)
- Fâtiha Sûresi ve Bakara Sûresi 285. âyetin (Âmene'r-Rasûlü) aynı sanatçı tarafından:
  1. **Tahkik** (en yavaş, tecvid detaylı)
  2. **Tertil** (orta-yavaş, tefekkür ritmi)
  3. **Tedvir** (orta hız)
  4. **Hadr** (hızlı, hatim kıraati) hızlarında 4 ayrı kaydı.

### 2.4 Makam Eğitimi Seti (Seviye 5 — 10 Makam)
Her makam (Rast, Uşşak, Hicaz, Buselik/Nihavend, Segâh, Sabâ, Kürdî, Acem, Neva, Hüzzam) için:
1. **Karar Perdesi Fonasyonu:** 10 saniye sabit karar sesi ("Ââââh").
2. **Dizi Çıkıcı ve İnici:** Karardan tize, tizden karara basamak basamak seslendirme.
3. **8–12 Karakteristik Motif:** Makamın geleneksel seyrini gösteren kısa vokalizeler.
4. **Kısa Sûre Uygulaması:** İhlâs, Felak, Nâs veya Fâtiha sûresinin o makamdaki icrası.
5. **Düz (Makamsız) vs. Makamlı Kıyas:** Aynı âyetin önce düz tertil, sonra makamlı tertil icrası.

### 2.5 Şan & Ses Isınma Seti (Bölüm 7)
- Rahat nefes ritmi yönergeleri (3 saniye rahatça al, 4 saniye yumuşakça ver; nefes tutma ve zorlayıcı süre hedefi yok).
- Dudak titreşimi (Lip trill) ve humming vokalize şablonları.
- Göğüs ve kafa rezonansı geçiş egzersizleri.

---

## 3. HUKUKİ VE METADATA ŞARTI

- Ses icracısıyla **"Fikri Hakların Devri ve Süresiz Dijital Eğitim Lisansı"** sözleşmesi imzalanır.
- Her ses dosyasına gömülü metadata: `Reciter_Name`, `School`, `Makam`, `Ayah_Key`, `Tempo_BPM`, `Recording_Date`, `Verified_By`.
