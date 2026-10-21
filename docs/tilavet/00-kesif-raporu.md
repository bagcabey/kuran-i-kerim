# TİLAVET AKADEMİSİ — KEŞİF RAPORU (00-kesif-raporu.md)

> **Tarih:** 19 Ekim 2026  
> **Proje:** CYMATIQUE — Kur'ân-ı Kerîm Mushaf, Tilavet & Tefsir Laboratuvarı  
> **Konum:** `c:\Users\omerb\OneDrive\Desktop\YAZARLIK 101\kimatik_lab\`  
> **Hazırlayan:** Antigravity AI Geliştirici Ajan  
> **Durum:** Tamamlandı

---

## 1. YÖNETİCİ ÖZETİ

Mevcut proje, 604 sayfalık geleneksel 15 satırlık Medine Mushaf-ı Şerif tertibini dijital ortama aktaran, dinamik tecvid renklendirmesi yapan, Kâbe İmamı Şeyh Yâsir ed-Devserî, Nâsır el-Katâmî ve Meşâri el-Afâsî tilavetlerini çalan, yapay zekâ destekli "Beni Bul" ayet konumlandırıcıya ve 6 büyük İslam âliminin tefsir meclisini içeren "Âyet İnceleme" modülüne sahip **yüksek performanslı, saf (vanilla) web tabanlı bir istasyondur.**

Bu keşif raporu, projeye eklenecek **"Tilavet Akademisi"** (Sıfırdan Kur'an, Tecvid Okulu, Tilavet Teknikleri, Makam Okulu, Şan & Ses Eğitimi, Dinleme Salonu, Pratik Stüdyosu, Hoca Paneli ve Sınav/Sertifika) modülünün mevcut mimariyle %100 uyumlu, kesintisiz ve sıfır bağımlılık ilkesiyle entegre edilmesini sağlamak amacıyla hazırlanmıştır.

---

## 2. MEVCUT TEKNOLOJİ YIĞINI ANALİZİ

| Alan | Mevcut Durum | Değerlendirme & Tilavet Akademisi Uyumu |
|---|---|---|
| **Çekirdek Dil / Framework** | Saf HTML5 + Modern Vanilla JavaScript (ES2022+) + CSS3. Framework (React, Vue, Angular) veya Tailwind **kullanılmıyor**. | **Mükemmel.** Sıfır derleme adımı (no-build), anında sıcak yenileme, maksimum taşınabilirlik ve tarayıcı performansı. Tilavet Akademisi de saf ES modülleri / sınıfları ile bu yapıya tam uyum sağlayacaktır. |
| **Stil Sistemi & Tema** | "Obsidyen & Altın v2/v3" tasarım dili. Modern CSS Custom Properties (CSS Değişkenleri), CSS `@layer` katmanlama mimarisi (`reset`, `tokens`, `base`, `shell`, `components`, `mushaf`, `companion`, `overlays`, `utilities`). Koyu tema (`#07090e`, `#0e121a`), altın (`#e5b869`), camgöbeği (`#00e5ff`) ve zümrüt yeşili (`#00e676`). | **Doğrudan Yeniden Kullanım.** Mevcut tasarım tokenları (`--bg-base`, `--bg-surface`, `--accent-gold` vb.) Tilavet Akademisi'nde aynen kullanılacak; makam ve şan bileşenleri bu estetikle bütünleşecektir. |
| **Gezinti & Router** | Sol dikey rayda (`.nav-tabs`) sekme temelli geçiş + URL Hash senkronizasyonu (`#tab-tilavet`, `#tab-inceleme`). `ui.js` içindeki `switchAppTab(tabId)` fonksiyonu `history.replaceState` ile URL'i günceller. | **Genişletme:** Ray üzerine 3. ana sekme olarak `tab-akademi` ("Tilavet Akademisi") eklenecek, alt rotalar hash ve alt-panel seçicilerle yönetilecektir (`#tab-akademi/makam`, `#tab-akademi/san` vb.). |
| **State (Durum) Yönetimi** | `window.TilavetState` ve `window.IncelemeState` küresel reaktif durum nesneleri. `localStorage` ile kalıcı tercihler (font ölçeği, CVD renk körlüğü modu). | **Uyum:** `window.AkademiState` nesnesi oluşturulacak; öğrenci ilerlemesi, sınav sonuçları, ses ayarları `localStorage` üzerinde şifreli/yapılandırılmış JSON olarak tutulacak, backend'e hazır arayüz sunulacaktır. |
| **Veritabanı & Kalıcılık** | Tarayıcı `localStorage` + RAM içi önbellekler (`PAGE_CACHE`, `SURAH_LIST`, `SURAH_START_PAGE`, statik nüzul ve âlim sözlükleri). | **Uyum:** Tilavet Akademisi müfredatı (`lessons.json`), makam modelleri (`makamlar.json`), terimler sözlüğü (`sozluk.json`) statik JSON veri tabanları olarak yapılandırılacak, kullanıcı pratikleri ve ilerlemeleri `localStorage`'da saklanacaktır. |
| **Kimlik Doğrulama (Auth)** | Şu anda yerel/tekil kullanıcı çalışma modu (masaüstü & offline odaklı). | **Genişletme:** Rol bazlı mock/yerel auth profili (`student`, `teacher`, `expert_reviewer`, `admin`) `localStorage`'da desteklenecek, Hoca Paneli bu profillere göre filtrelenecektir. |
| **Çalıştırma & Dağıtım** | Python yerel sunucusu (`python -m http.server 8000`), `baslat.bat`, `baslat_masaustu.bat` (Chrome/Edge `--app` pencere modu, 1420×920), `create_shortcut.ps1`. | **Tam Uyum:** Sistem 8000 portunda tek bir komutla ayağa kalkmaya devam edecektir. Ekstra derleme aracı veya sunucu zorunluluğu yoktur. |
| **i18n & Dil Desteği** | Türkçe arayüz (`lang="tr"`), Kur'an âyetleri ve Arapça metinlerde `lang="ar"` + `dir="rtl"` işaretlemesi. | **Doğrudan Uygulama:** Tilavet Akademisi terimleri ve yönergeleri Türkçe birincil, Arapça orijinal lafızlar RTL destekli, İngilizce anahtarlar yedekli tutulacaktır. |
| **Ses Motoru (Audio)** | 1. HTML5 `Audio` ile EveryAyah CDN üzerinden âyet akışı (Devserî, Katâmî, Afâsî).<br>2. Web Audio API `AudioContext` + `AnalyserNode` ile gerçek zamanlı RMS akustik enerji ve sessizlik/süre takibi (madd, vakıf).<br>3. Web Speech API (`webkitSpeechRecognition`) ile Arapça fonetik tanıma (`ar-SA`). | **Geliştirme & Yeniden Kullanım:**<br>- Web Audio API altyapısı genişletilerek Makam Okulu için **Dinamik Drone Sentezleyici** (harmonik zenginlikli karar sesi osilatörü) ve **Gerçek Zamanlı Perde Dedektörü (Autocorrelation / YIN F0)** eklenecektir.<br>- Dinleme Salonu için perde korumalı hız kontrolü (`preservesPitch = true`), A–B döngüsü ve ayet arası boşluk özelliği entegre edilecektir. |
| **Kur'an Veri Kaynağı** | `api.alquran.cloud` üzerinden `quran-uthmani`, `tr.diyanet` meali ve `en.transliteration` çekimi; `tilavet_engine.js` içinde hazır 1, 2, 50. sayfa önbellekleri; `inceleme_engine.js` içinde 114 sûre meta kataloğu. | **Yeniden Kullanım:** Mevcut sûre listesi, sayfa-ayet haritaları ve Uthmani veri akışı Tilavet Akademisi derslerinde ve Dinleme Salonu'nda doğrudan kullanılacaktır. |

---

## 3. MEVCUT DOSYA YAPISI VE İLİŞKİLER

```
c:\Users\omerb\OneDrive\Desktop\YAZARLIK 101\kimatik_lab\
├── index.html                   -> Ana uygulama kabuğu (Header + Nav-tabs + Mushaf Sekmesi + İnceleme Sekmesi)
├── inceleme.html                -> İnceleme sekmesinin bağımsız / doğrudan açılabilir versiyonu
├── style.css                    -> Obsidyen & Altın v2/v3 tema stili (tüm bileşenler, katmanlar)
├── tilavet_engine.js            -> Mushaf render, Uthmani hat, EveryAyah oynatıcı, Web Audio RMS, Beni Bul
├── inceleme_engine.js           -> 114 sûre nüzul kataloğu, 6 âlim tefsir meclisi, lugat & belagat tahlili
├── ui.js                        -> UI orkestrasyonu, a11y, CVD toggle, font scale, switchAppTab()
├── baslat.bat                   -> Yerel Python sunucusunu başlatan ve tarayıcıyı açan ana script
├── baslat_masaustu.bat          -> Chrome/Edge bağımsız pencere (--app) modunda başlatan script
├── create_shortcut.ps1          -> Masaüstü kısayollarını oluşturan PowerShell scripti
└── docs/tilavet/                -> [YENİ] Tilavet Akademisi mimari, veri, müfredat ve ilerleme dokümantasyonu
```

---

## 4. BİLEŞEN VE KOD YENİDEN KULLANIM PLANI

Mevcut projede halihazırda mükemmel çalışan ve Tilavet Akademisi'nde çoğaltılmadan **yeniden kullanılacak** yapılar:

1. **`app-header` & Telemetri HUD'ı:** Üst bardaki marka alanı ve telemetri kapsülleri korunur; Tilavet Akademisi aktifken HUD üzerinde "AKADEMİ: Seviye / Makam / Günlük Süre" durum rozetleri gösterilir.
2. **`nav-tabs` (Sol Dikey Ray):** `tabBtnTilavet` ve `tabBtnInceleme` yanına `tabBtnAkademi` ("Tilavet Akademisi") eklenir. `ui.js` içindeki `switchAppTab` otomatik olarak bu sekmeyi tanır ve yönetir.
3. **Tecvid Renk Sistemi (`--tj-*` Tokenları):** `style.css` içindeki `--tj-madd`, `--tj-ihfa`, `--tj-kalkale`, `--tj-lafz`, `--tj-iklab`, `--tj-vakif` renk ailesi Tecvid Okulu ve tecvidli mushaf okuyucuda %100 aynı kalır.
4. **Toast Bildirim Sistemi (`#toast`):** `tilavet_engine.js` içindeki `showToast(msg)` fonksiyonu ders tamamlama, rozet kazanma ve kayıt bildirimlerinde kullanılır.
5. **Ses Oynatıcı Mantığı:** `playQariRecitation` ve `stopAllAudioPlayback` fonksiyonları kütüphane ve örnek dinleme modüllerine bağlanır.
6. **Sûre & Âyet Meta Veritabanı:** `SURAH_LIST` (114 sûre adı, âyet sayısı, iniş yeri) ve sayfa haritaları doğrudan miras alınır.

---

## 5. TESPİT EDİLEN TEKNİK RİSKLER VE KORUMA TEDBİRLERİ

1. **Mevcut 42 DOM ID'sinin Korunması:** `tilavet_engine.js` tarafından sıkı sıkıya aranan 42 adet DOM ID'si (`realMushafPage`, `btnPlayActiveAyah`, `selectReciter`, `activeAyahTitle` vb.) kesinlikle bozulmayacak ve çakışma yaratılmayacaktır. Tilavet Akademisi elemanları `akademi-` önekiyle isimlendirilecektir.
2. **Web Audio Context Tekilliği:** Tarayıcılarda birden fazla `AudioContext` oluşturulması bellek sızıntısına ve mobil kısıtlamalara yol açabilir. `window.AudioContextSingleton` deseniyle mevcut ses bağlamı ortak kullanılacaktır.
3. **Klavye Kısayolları (Spacebar / Yön Tuşları):** `ui.js` içindeki Spacebar koruması (`initSpacebarProtection`) gözetilerek, ders ve sınav formlarında yazarken kısayolların engellenmesi mekanizması korunacaktır.
4. **Dini İçerik Bütünlüğü:** Âyetler dinamik olarak `api.alquran.cloud` veya doğrulanmış yerel veri setinden çekilecek, elle yazılmayacaktır.

---

## 6. SONUÇ VE İLERLEME ONAYI

Projenin altyapısı temiz, derleme bağımsızlığı sayesinde son derece çevik ve genişletilebilir durumdadır. Tilavet Akademisi modülü bu sağlam temel üzerine inşa edilecek, hiçbir mevcut işlev kesintiye uğratılmayacaktır.
