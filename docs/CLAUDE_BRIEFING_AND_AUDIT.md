# CLAUDE İNCELEME, BRİFİNG VE UZMAN DEĞERLENDİRME DOKÜMANI
## Kur’an-ı Kerim, Tilavet, Makam Akademisi ve Ses Analizi Platformu
### En Baştan En Sona Tasarım Özeti, Yapılan Değişiklikler ve Kritik Danışma Soruları

> **Doküman Kodu:** `DOC-TL-CLAUDE-01`  
> **Tarih:** 19 Ekim 2026  
> **Hazırlayan:** Antigravity Principal Product Designer & Lead Architect  
> **Muhatap:** Claude (Senior AI Design & Audio DSP Reviewer)  
> **Proje:** YAZARLIK 101 — Tilavet Akademisi & Mushaf İstasyonu (`kimatik_lab` & `src/tilavet`)

---

## 1. YÖNETİCİ ÖZETİ: PROJE NEDİR VE NE HEDEFLİYOR?

Bu proje; Kur’an-ı Kerim tilavetinin ilahî vakar ve huşûuna uygun, 604 sayfalık geleneksel 15 satırlık Medine Mushafı düzenini dijital ortama aktaran; kelime düzeyinde tecvid kurallarını dinamik olarak renklendiren; 114 sûre ve 6236 âyetin nüzul sebeplerini ve 6 büyük İslâm âliminin tefsirlerini içeren; 10 makamlık müzikolojik eğitim (53-koma AEU sistemi), Web Audio F0 perde takibi (YIN algoritması), akustik Medd elif sayacı, interaktif sınavlar ve eğitmen yönetim panelini bir araya getiren **profesyonel ve yaşayan bir tilavet atölyesidir**.

Platform sıradan bir ses oynatıcı veya şablon bir SaaS paneli değildir. Üç temel ilkeye dayanır:
1. **Hocanın (Fem-i Muhsin) Yerini Almaz:** Yapay zekâ ve algoritmalar ehil bir hocanın talebe yetiştirmesine yardımcı çalışma ve pekiştirme araçlarıdır.
2. **Tecvid Makamdan Önce Gelir:** Harflerin sıfatları, mahreçleri ve tecvid hükümleri musiki kurallarından daima önceliklidir; harfi bozan nağme caiz değildir.
3. **Sıfır Ham Ses Saklama (Zero Raw Audio Retention):** Kullanıcının ham mikrofon kayıtları asla harici sunuculara yüklenmez; Web Audio API ile tamamen tarayıcıda yerel işlenir, sunucuya yalnızca matematiksel analiz özetleri (WER %, cent sapması, süre) iletilir.

---

## 2. EN BAŞTAN EN SONA ARAYÜZ VE TASARIM MİMARİSİ

Platform, kullanıcının zihnini yormamak ve bağlamına göre odaklanmasını sağlamak amacıyla **"Okuma Odası ve İlmî Atölye" (Obsidyen Zümrüt & Altın v3)** felsefesiyle tasarlanmıştır.

### 2.1. Ana Gezinti Mimarisi (Sol Ray — 3 Ana Dünya)
1. **📖 Mushaf & Tilavet (`tab-tilavet`):**
   - 604 sayfalık orijinal Uthmani hatlı Medine Mushafı (Amiri Quran fontu, 15 satır tertibi).
   - Sayfadaki herhangi bir ayete tıklandığında anında odaklanma ve tilaveti başlatma.
   - Kâbe İmamı Şeyh Yâsir ed-Devserî, Nâsır el-Katâmî ve Meşâri el-Afâsî kârileri.
   - Sayfa altı mürekkep lejantı (Madd, İhfâ, Kalkale, Vakıf, İklâb, Lafzatullâh) ve CVD (renk körlüğü) renk-dışı ipucu kipi.
   - Sağ refakatçi kolonda: Fonetik Latin okunuşu, Diyanet meali, ayet tecvid analizi, canlı mikrofon denetimi ve hata simülatörü.
   - Klavye kısayolları: `[Boşluk]` tuşu ile durdur/oynat, `[←]` ve `[→]` tuşlarıyla sayfa çevirme.
2. **📚 Âyet İnceleme & Esbâb-ı Nüzûl (`tab-inceleme`):**
   - 114 sûre ve 6236 ayetin tamamını kapsayan inceleme motoru ([`inceleme_engine.js`](file:///c:/Users/omerb/OneDrive/Desktop/YAZARLIK%20101/kimatik_lab/inceleme_engine.js)).
   - Esbâb-ı Nüzûl (Âyetin iniş sebebi, kıssası ve tarihî arka planı).
   - Orijinal Uthmani metin, fonetik Latin okunuşu ve Türkçe Diyanet Meali.
   - Kâbe İmamı Şeyh Yâsir ed-Devserî'den tilavet dinleme ve Mushaf sayfasına hızlı geçiş köprüsü.
3. **🎙️ Tilavet Akademisi (`tab-akademi`):**
   - Yatay alt gezinti barı ([`akademi-sub-nav`](file:///c:/Users/omerb/OneDrive/Desktop/YAZARLIK%20101/kimatik_lab/index.html#L646-L658)) ile yönetilen 12 çekirdek modül.

### 2.2. Tilavet Akademisi 12 Alt Modülü (Uygulanan Tasarım)
1. **🧭 Yolculuğum (`yolculuk`):** Günlük hedef çemberi (15 dk), seri ateşi (streak), 6 seviyeli müfredat haritası, seviye tespit testi ve 6 adımlı interaktif ders modalı.
2. **📖 Sıfırdan Kur'an (`elifba`):** 28 Arap harfinin anatomik mahreç atlası (boğaz, dil, dudak, cevf), benzer harfler kulak eğitimi oyunu ve kelime heceleme.
3. **🎨 Tecvid Okulu (`tecvid`):** İzhâr, İdğâm, İklâb, İhfâ, Kalkale, Medd atlası. **Çift Yönlü Canlı Köprü:** "Mushaf'ta Gör" tıklandığında doğrudan canlı Mushaf sayfasına geçip ilgili kelimeleri altın sarısı nabızla ([`.tajweed-highlight-pulse`](file:///c:/Users/omerb/OneDrive/Desktop/YAZARLIK%20101/kimatik_lab/tilavet_akademi.css#L1232-L1239)) parlatma.
4. **⚡ Tilavet Teknikleri (`teknik`):** Lahn-ı Celî (büyük hata) ve Lahn-ı Hafî (gizli hata) mukayesesi; Tahkik, Tertil, Tedvir ve Hadr okuma hızları.
5. **🎵 Makam Okulu (`makam`):** 10 makam şeması (Rast, Uşşak, Hicaz, Sabâ, Segâh, Hüseynî, Nihavent, Kürdî, Acemaşîran, Eviç), 53-koma AEU mikrotonal interaktif piyano klavyesi, Karar Sesi Drone Synthesizer (Tanbur/Ney formant filtreleri), karakteristik vokalize motifleri ve model kâri dinleme.
6. **🫁 Şan & Ses (`san`):** Diyafram 4-4-8 saniye ritmik nefes çemberi animasyonu, vokal hijyen kuralları ve ses sağlığı güvenlik ilkeleri.
7. **🔬 Ses Laboratuvarı & Pratik Stüdyosu (`studyo`):**
   - *Canlı Perde Tuneri:* YIN/Autocorrelation ile canlı F0 Hz tespiti, en yakın nota adı, $\pm 50\text{ cent}$ ibresi ve koma sapması.
   - *Akustik Medd Elif Sayacı:* 1 ila 6 elif arasındaki uzatmayı milisaniye bazında ölçen ve 6 çubuklu görsel barda canlı dolduran mekanizma.
   - *HTML5 Canvas Çift Konturlu Görselleştirici:* Referans kurrâ konturu (altın) ile kullanıcının ses konturunu (zümrüt) zaman ekseninde karşılaştırma.
   - *Kayıt & Skor Karnesi:* Benzerlik skoru (%0-100), ortalama cent sapması, DTW süre skoru ve pedagojik değerlendirme.
8. **🎧 Dinleme Salonu (`dinleme`):** Mısır, Körfez ve Türk tilavet mekteplerinin kârileri, biyografileri ve meşhur makamları.
9. **🎓 Sınavlar & Başarı Belgesi (`sinav`):** Seviye yetkinlik sınavları, anında soru analizi, HTML5 Canvas ile 1000x700 piksel yüksek çözünürlüklü tezhib bordürlü dijital başarı belgesi ve tek tıkla PNG indirme. Belge üzerinde zorunlu teolojik uyarı: *"DİKKAT: Bu belge dijital öğrenme ve gelişim kaydıdır; şer'î kıraat icazeti teşkil etmez."*
10. **👨‍🏫 Eğitmen & Hoca Paneli (`hoca`):** Sınıf ortalama metrikleri, arama/filtreleme destekli talebe ilerleme tablosu, yeni ödev atama modalı ve gelen tilavet inceleme kuyruğu.
11. **📚 Terimler Sözlüğü (`sozluk`):** 40 kavramlık canlı arama destekli kıraat, tecvid ve musiki lügati.
12. **⚙️ Ayarlar & Gizlilik (`ayarlar`):** Yerel ses kaydı gizliliği (KVKK), çocuk emniyet modu ve tek tıkla veri sıfırlama.

---

## 3. TASARIM VE KOD TABANINDA YAPILAN DEĞİŞİKLİKLER

1. **[`kimatik_lab/index.html`](file:///c:/Users/omerb/OneDrive/Desktop/YAZARLIK%20101/kimatik_lab/index.html):** Alt navigasyona `studyo`, `sinav` ve `hoca` butonları ve `#akademi-view-studyo`, `#akademi-view-sinav`, `#akademi-view-hoca` panel konteynerleri eklendi.
2. **[`kimatik_lab/tilavet_akademi_engine.js`](file:///c:/Users/omerb/OneDrive/Desktop/YAZARLIK%20101/kimatik_lab/tilavet_akademi_engine.js):** Alt görünüm kilidi kaldırılarak `renderStudyoView()`, `renderSinavView()` ve `renderHocaView()` modülleri entegre edildi. TypeScript'ten kalan sözdizimi uyuşmazlığı giderildi.
3. **[`kimatik_lab/tilavet_akademi.css`](file:///c:/Users/omerb/OneDrive/Desktop/YAZARLIK%20101/kimatik_lab/tilavet_akademi.css):** Tuner paneli, cent ibresi, akustik medd çubukları, canvas çerçeveleri, sınav kartları, eğitmen tablosu ve 360px–1440px responsive kuralları yazıldı.
4. **[`docs/DESIGN_DECISIONS.md`](file:///c:/Users/omerb/OneDrive/Desktop/YAZARLIK%20101/docs/DESIGN_DECISIONS.md):** 10 ana tasarım kararı, alternatif analizleri ve kabul gerekçeleri belgelendi.
5. **Testler ve Tip Güvenliği:** 27 Vitest birim testi %100 geçti; `tsc --noEmit` sıfır hatayla derlendi.

---

## 4. CLAUDE'A DANIŞILAN KRİTİK SORULAR (DÜZELTMELER İÇİN FİKİR TALEBİ)

Aşağıdaki 6 teknik ve pedagojik sorunun Claude tarafından değerlendirilmesi ve sunulacak çözümlerin projeye aynen uygulanması hedeflenmektedir:

### Soru 1: Web Audio F0 ve YIN Algoritması Performansı
> **Mevcut Durum:** [tilavet_audio_lab.js](file:///c:/Users/omerb/OneDrive/Desktop/YAZARLIK%20101/kimatik_lab/tilavet_audio_lab.js) dosyasında ana iş parçacığı (main thread) üzerinde `requestAnimationFrame` ile 2048 pencereli Autocorrelation ve [pitch.ts](file:///c:/Users/omerb/OneDrive/Desktop/YAZARLIK%20101/src/tilavet/core/audio/pitch.ts) dosyasında YIN F0 algoritması çalışıyor.
> **Soru:** Düşük donanımlı Android/iOS cihazlarda ana iş parçacığının UI çizimini yavaşlatmaması için bu analizi bir `AudioWorkletNode` veya Web Worker katmanına taşımalı mıyız? Tarayıcı uyumluluğu ve gecikme (latency) açısından en pürüzsüz yaklaşım nedir?

### Soru 2: Akustik Medd Elif Ölçerinin Okuma Hızına (Tempo) Adaptasyonu
> **Mevcut Durum:** Medd ölçer sabit milisaniye aralıkları kullanıyor: 1 Elif için 900–1800 ms, 2 Elif için 1800–3200 ms, 4 Elif için 3200–5500 ms.
> **Soru:** Bir okuyucu *Tahkik* (ağır ve tane tane) okurken 1 elif süresi 1500 ms olabilirken, *Hadr* (hızlı tilavet) okurken 600 ms'ye düşebilir. Medd ölçer sabit ms yerine kullanıcının önceki 5 hecedeki ortalama okuma hızını (tempo çarpanını) baz alan dinamik/adaptif bir elif eşiği mi kullanmalıdır? Bu algoritmayı nasıl kurmalıyız?

### Soru 3: Dinamik Zaman Bükmesi (DTW) ve Çoklu Kâri Referansı
> **Mevcut Durum:** Talebenin perde konturu yalnızca seçilen tek bir referans kâri (örn: Dossary) ile Sakoe-Chiba bant kısıtlamalı DTW üzerinden kıyaslanıyor.
> **Soru:** Kârilerin nefes durakları ve süsleme (nağme/titreşim) tarzları birbirinden farklıdır. Talebenin okuyuşunu tek kâriye bağımlı kılmak yerine, aynı makamdaki 3 kârinin medyan konturunu çıkararak bir "Tolerans Bandı (Confidence Corridor)" oluşturmak pedagojik olarak daha adil bir skorlama sağlar mı?

### Soru 4: Tecvid ve Mushaf Entegrasyonunda Görsel Odaklama
> **Mevcut Durum:** Tecvid Okulu'ndan Mushaf'a geçildiğinde `openMushafAndHighlightRule` fonksiyonu sayfadaki ilgili ayeti bulup tecvid kelimelerini sarı nabız (`tajweed-highlight-pulse`) animasyonuyla parlatıyor.
> **Soru:** Çok uzun ayetlerde (örn: Âyetü'l-Kürsî veya Âmenerrasûlü) birden fazla kural varsa kullanıcının gözü yorulabiliyor. Vurgulanan kelime dışındaki diğer ayet metnini hafifçe karartmak (spotlight efekti) okunabilirliği artırır mı yoksa Mushaf bütünlüğünü zedeler mi?

### Soru 5: Teolojik Doğrulama ve Belge Kriptografisi
> **Mevcut Durum:** Sınav başarı belgesi Canvas üzerinde dinamik çiziliyor ve üzerinde "İcazet Değildir" şerhi yer alıyor. Doğrulama kodu rastgele üretilen bir metin (`TL-2026-AKD-99`).
> **Soru:** Bu belgenin doğrulanabilirliğini ve ciddiyetini artırmak için öğrencinin adı, tamamladığı seviye ve tarihi içeren bir SHA-256 hash'i ve belgenin köşesine taranabilir bir QR kod yerleştirmeli miyiz?

### Soru 6: Eğitmen-Talebe İletişiminde Ses Aktarımı (KVKK / Zero Raw Audio)
> **Mevcut Durum:** Ham ses sunucuya yüklenmiyor; eğitmen tablosunda sadece matematiksel karne (WER skoru, cent farkı) gösteriliyor.
> **Soru:** Bir eğitmen öğrencisinin ses kaydını bizzat dinlemek istediğinde, KVKK ve ses gizliliği ilkelerimizi bozmadan bu sesi nasıl aktarmalıyız? Uçtan uca şifreli geçici (TTL 24 saat) bir depolama mı yoksa doğrudan P2P WebRTC ses transferi mi önerirsin?

---

## 5. CLAUDE'UN YANITLARI İÇİN UYGULAMA PROTOKOLÜ

Claude bu dokümanı ve soruları inceledikten sonra verdiği her tavsiye aşağıdaki adımlarla projeye uygulanacaktır:
1. Mimari veya algoritma önerisi gelirse (örn: Adaptif Medd çarpanı veya AudioWorklet), ilgili kod bloğu [tilavet_audio_lab.js](file:///c:/Users/omerb/OneDrive/Desktop/YAZARLIK%20101/kimatik_lab/tilavet_audio_lab.js) ve [contour.ts](file:///c:/Users/omerb/OneDrive/Desktop/YAZARLIK%20101/src/tilavet/core/audio/contour.ts) içine işlenecektir.
2. Görsel/UX önerisi gelirse (örn: Spotlight vurgusu, QR kodlu tezhib çerçevesi), [tilavet_akademi.css](file:///c:/Users/omerb/OneDrive/Desktop/YAZARLIK%20101/kimatik_lab/tilavet_akademi.css) ve `renderSinavView()` içine yansıtılacaktır.
3. Yapılan her güncelleme `vitest run` ve `tsc --noEmit` testlerinden geçirilerek sistemin kusursuz çalışması güvenceye alınacaktır.
