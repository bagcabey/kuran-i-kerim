# KUR'ÂN-I KERÎM — Tilavet, Tecvid, Mushaf & Âyet İnceleme Laboratuvarı

Bu proje; Kur'ân-ı Kerîm'in 604 sayfalık geleneksel 15 satırlık Medine Mushaf-ı Şerif tertibini dijital ortama taşıyan, kelime kelime ve harf harf tecvid kurallarını dinamik olarak renklendiren, Kâbe İmamı Şeyh Yâsir ed-Devserî, Nâsır el-Katâmî ve Meşâri el-Afâsî tilavetleriyle seslendiren, yapay zekâ destekli **Beni Bul** ayet arama motoruna ve 114 sûre ile 6236 âyetin nüzul sebeplerini, kıssalarını ve 6 büyük İslâm âliminin tefsirlerini içeren **Derinlemesine Âyet İnceleme Sayfası**na sahip profesyonel bir Kur'an istasyonudur.

---

## 🚀 Hızlı Başlangıç (Nasıl Çalıştırılır?)

1. **`baslat.bat`** veya **`baslat_masaustu.bat`** dosyasına çift tıklayın.
2. Uygulama otomatik olarak `http://localhost:8000/` adresinde başlatılır.
   *(Web Audio API ve mikrofon erişimi tam ve güvenli yerel sunucu üzerinden çalışır).*
3. İnceleme sayfasına gitmek için üst bardaki **"📚 Âyet İnceleme & Tefsir"** butonuna tıklayabilir veya doğrudan `http://localhost:8000/inceleme.html` adresini açabilirsiniz.

---

## 📖 Temel Özellikler

### 1. 15 Satırlık Geleneksel Medine Mushafı (Uthmani Hat)
* Her sayfada tam 15 satır orijinal Mushaf düzeni.
* Çiçekli altın ayet sonu madalyonları ve sayfa üstü/altı cüz, sure, sayfa numarası bordürleri.
* Sayfa üzerindeki herhangi bir ayete tıklandığında anında o ayete odaklanma ve tilaveti başlatma.

### 2. Âyet & Tilavet Master Oynatıcı
* **Kâri Seçenekleri:** Kâbe İmamı Şeyh Yâsir ed-Devserî, Nâsır el-Katâmî, Meşâri el-Afâsî.
* **Klavye Kısayolu:** `[Boşluk]` (Space) tuşu ile çalan ayeti anında duraklatma / devam ettirme.
* **Tüm Sayfayı Oynat:** Sayfadaki ayetleri sırayla kesintisiz dinleme.

### 3. ÂYET İNCELEME, ESBÂB-I NÜZÛL & TEFSİR MECLİSİ (`inceleme.html`)
* **Âyetin Hikayesi & Nüzul Sebebi:** Âyet ne zaman, nerede, hangi tarihi olay veya soru üzerine indi? Sahabe tanıklıkları ve peygamber kıssaları.
* **Tefsir Meclisi:** Kaynak ve uzman onayı doğrulanmış içerik yayımlanana kadar kullanıma açık değildir.
* **Bugüne ve Hayatımıza Dersler:** Modern müminin kalbine dokunan ahlaki prensipler.
* **Lügat & Belâgat İncelikleri:** Anahtar kavramların kök tahlili ve lafız mucizesi.
* **Dinamik Sentez:** 114 sûre ve 6236 âyetin tamamı seçilebilir ve anında tahlil edilir.

### 4. BENİ BUL (Akıllı Ayet Konumlandırıcı)
* **Sesli Arama:** Mikrofona ayeti okuyarak doğrudan ilgili sayfaya gitme.
* **Metinle Arama:** Sure adı, ayet numarası (örn: `2:255`), fonetik arama veya mealden kelime arama.

### 5. Canlı Mikrofon Denetimi & Skor Karnesi
* Kendi tilavetinizi mikrofona okuyarak tecvid denetimi yapma ve anlık karne puanı alma.
* Hata algılama test simülatörü.

---

## 📁 Dosya Yapısı

* `index.html`: 15 satırlık Medine Mushafı, tilavet çalar ve tecvid istasyonu.
* `inceleme.html`: Âyet inceleme, esbâb-ı nüzûl, kıssalar ve büyük âlimler tefsir meclisi sayfası.
* `inceleme_engine.js`: İnceleme motoru, 114 sure meta kataloğu, meşhur nüzul veritabanı ve dinamik tefsir sentezleyici.
* `tilavet_engine.js`: Bağımsız tilavet motoru, Web Audio RMS analizörü, 604 sayfa Uthmani hat ayrıştırıcı ve Beni Bul arama algoritması.
* `style.css`: Obsidyen & Altın v2 tema tasarımı, Mushaf ve tefsir tipografisi.
* `baslat.bat` & `baslat_masaustu.bat`: Hızlı yerel başlatıcılar.
