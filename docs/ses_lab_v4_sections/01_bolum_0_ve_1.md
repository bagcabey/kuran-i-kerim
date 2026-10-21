# 0. BÖLÜM 0: ÖZET VE v3 → v4 DEĞİŞİKLİK GÜNLÜĞÜ

## 0.1. Yönetici Özeti ve Dönüşümün Felsefesi
Bu doküman, Kur'ân-ı Kerîm Tilâvet Akademisi ekosistemindeki **Ses Laboratuvarı & Akustik Tahlil Stüdyosu** modülünün mimarisini v3.0'dan üretim standartlarındaki **v4.0.0 (Production / Multi-Engine Standard)** seviyesine yükseltmek için hazırlanmış eksiksiz teknik şartname ve kod rehberidir.

v3 sürümünün denetiminde; seslerin üst üste binip tarayıcıyı kilitlediği (A1, A2, A3), hoparlörden çıkan drone sesinin mikrofona girerek sahte skorlar ürettiği (A4), perde tespitinin ana iş parçacığını donduran ilkel otokorelasyona dayandığı (B2, B5), medd süresinin keyfi milisaniyelerle ölçülüp 3 ve 6 elif çubuklarının hiç yanmadığı (D3), DTW kontur eğrilerinin gerçek kâri kayıtları yerine elle uydurulmuş 9 noktalı sahte veriler içerdiği (C3) ve kullanıcı okuma yaparken ekranın küçük bir köşesine sıkıştırıldığı (H3) tespit edilmiştir.

v4.0.0 ile sistem; **AudioWorklet tabanlı gerçek zamanlı YIN DSP çekirdeği**, **çoklu kaynak ses yöneticisi (AudioFocusManager)**, **hece kalibrasyonlu medd motoru**, **FastDTW (Sakoe-Chiba) kontur analizörü**, **akustik rezonans spektrumu** ve hepsinden önemlisi tilâvet talebesini tüm dikkat dağıtıcı unsurlardan arındıran **Okuma Penceresi (Focus Mode Modal)** ile yeniden inşa edilmiştir.

## 0.2. v3 → v4 Mimari Dönüşüm Karşılaştırma Matrisi

| Bileşen / Özellik | v3 (Eski / Hatalı Durum) | v4.0.0 (Yeni Üretim Standardı) |
|:---|:---|:---|
| **Ses Yaşam Döngüsü** | Başıboş osilatörler, 450 ms sonra yeni osilatörü öldüren `setTimeout` yarış durumu (A1). | `AudioFocusManager` + Master Bus (Brickwall Limiter) + deterministik Web Audio otomasyonu. |
| **Ses Odağı (Audio Focus)** | Tek yönlü, yetersiz bildirim; istasyon değişiminde sesler arkada çalmaya devam eder (A3). | `exclusive` ve `ambient` öncelik sınıfları; otomatik ducking (-18 dB); `visibilitychange` temizliği. |
| **Geri Besleme Koruması** | Hoparlörden çıkan drone mikrofona girip "Tam Karar" skoru üretir (A4). | Anti-Drone Feedback Guard: mikrofon F0 ile drone frekansı korelasyon analizi + kulaklık denetimi. |
| **F0 Perde Tespiti** | Ana iş parçacığında rAF (~26 FPS) ile çalışan O(N²) otokorelasyon; takılmalar ve jitter (B2, B5). | Ayrı ses iş parçacığında (AudioWorklet) 10 ms hop size ile çalışan YIN / pYIN-lite algoritması. |
| **Ses Sistemi & Akort** | Sadece 12-TET; Segâh, Sabâ ve Uşşak mikrotonları Batı notasına zorlanır (B6). | 12-TET + Türk 53-Koma (AEU) + Arap 24-EDO çoklu akort motoru; 6 klasik Türk ahengi ve otomatik karar tespiti. |
| **Medd (Elif) Ölçümü** | Sabit 280 ms katsayı; kısa kesintide sıfırlanan sayaç; 3 ve 6 elif çubukları ölü (D1..D4). | Bireysel hece kalibrasyonu ($T_{\text{harakah}}$); 120 ms hangover debounce; donan nihai karne. |
| **Model Tilâvet & DTW** | Elle yazılmış 9-13 noktalı sahte eğriler (C3); zamanlamayı ölçmeyen sahte skor formülleri (E2). | Gerçek kâri seslerinden çıkarılmış 10 ms F0 referansları; Sakoe-Chiba kısıtlı FastDTW; şekil + ritim skoru. |
| **Spektrum & Rezonans** | 2048 FFT verisi 64 elemanlı diziye basılır (0-1.5 kHz); Hayşûm ve Boğaz bantları sahtedir (F1). | 2048-bin gerçek frekans eşlemeli logaritmik analiz; Göğüs, Boğaz, Hayşûm ve Kâri Formantı (2.5-3.5 kHz). |
| **Osiloskop** | Tetiklemesiz 128 örnek; mikrofon kapalıyken tepeye çizilen bulanık çizgi (F2). | Sıfır-geçiş (zero-crossing) tetiklemeli durağan dalga formu; DPR ölçekli keskin Retina Canvas. |
| **Nefes Egzersizi** | Salt manuel kronometre; mikrofonu kullanmaz; halka CSS süresiyle desenkronize (G1, G2). | VAD destekli otomatik başlayan/biten mikrofonik kapasite testi; rAF senkronlu parametrik SVG halkası. |
| **Kullanıcı Deneyimi (UX)** | Sayfa içinde gömülü, 11px fontlu küçük okuma alanı; tüm DOM'u yıkan `innerHTML` (H1, H3). | Yerel `<dialog>` ile açılan dev hatlı **Okuma Penceresi**; A-B kıyaslama oynatıcısı; reaktif durum deposu. |
| **Erişilebilirlik & UI** | 0 focus-visible; 0 prefers-reduced-motion; emoji ikonlar; küçük dokunma alanları (H6, H10). | WCAG 2.2 AA kontrastı; tam klavye tuzağı; SVG ikon kütüphanesi; min 44px dokunma hedefleri. |
| **Test Güvencesi** | Hiçbir test yok (I6). | Vitest + sentetik sinüzoidal, harmonik ve gürültülü sinyallerle 100% DSP doğrulama paketi. |

---

# 1. BÖLÜM 1: SORUN DENETİM RAPORU VE HATA KATALOĞU

Aşağıdaki katalog, `ses lab.md` dokümanı ve mevcut kod tabanı üzerinde gerçekleştirilen satır satır denetimin kanıtlı bulgularını içerir.

| Hata ID | Kategori | Önem | Belirti (Symptom) | Kök Neden (Root Cause) | Çözüm Modülü / Bölüm |
|:---|:---|:---:|:---|:---|:---|
| **A1** | Ses Yönetimi | 🔴 Kritik | Makam veya tını değiştirilince drone 0.45 sn sonra aniden susar veya eski sesle yenisi üst üste biner. | `DroneSynthesizer.stop()` içindeki `setTimeout(..., 450)` çağrısı, yeni oluşturulan osilatörleri asenkron olarak durdurmaktadır. | Bölüm 3 (`drone_v2.js`) |
| **A2** | Ses Yönetimi | 🟠 Yüksek | "Örnek Sesi Çal" düğmesi hangi kelimeye basılırsa basılsın hep 220 Hz çalmaktadır. | Kart verisindeki nota/harf analiz edilmeden sabit `freq = 220` parametresi geçilmiştir. | Bölüm 6 (`medd_engine.js`) |
| **A3** | Ses Yönetimi | 🔴 Kritik | İstasyon veya sayfa değiştirildiğinde drone, nefes sayacı ve spektrum çizimi arka planda çalışmaya devam eder. | Yaşam döngüsü (lifecycle) yönetimi ve `stopAll()` senkronizasyonu yoktur. | Bölüm 3 (`audio_focus_manager.js`) |
| **A4** | Ses / Akustik | 🔴 Kritik | Hoparlör açıkken drone sesi mikrofona girer; tuner kullanıcının sesi sanıp sahte skor üretir. | Akustik geri besleme engelleme ve kulaklık zorunluluğu / uyarısı mekanizması bulunmamaktadır. | Bölüm 4 (`mic_manager.js`) |
| **A5** | DSP / Çıkış | 🟠 Yüksek | Osilatör geçişlerinde hoparlörden çatlama/patlama (click/pop) sesleri gelir; ses seviyesi sınırlayıcı yoktur. | Master çıkışta `DynamicsCompressorNode` ve kazanç yumuşatma (ramp) eksiktir. | Bölüm 3 (`master_bus.js`) |
| **A6** | İşlevsellik | 🟠 Yüksek | "Model Tilaveti Dinle" butonu hiçbir ses çalmaz; kullanıcı kendi kaydını dinleyemez. | Oynatıcı olay dinleyicisi tanımlanmamış, MediaRecorder blob URL'i UI'a bağlanmamıştır. | Bölüm 10 (`reading_modal.js`) |
| **A7** | Platform / Ses | 🟠 Yüksek | Mobil Safari'de ses kaydı başlatılınca tuner mikrofonu tamamen susar. | `PitchDetector` ve `VoiceRecorder` için iki ayrı `getUserMedia` akışı açılmıştır. | Bölüm 4 (`mic_manager.js`) |
| **A8** | Platform | 🟡 Orta | iOS cihazlarda ses kaydı başlamaz veya bozuk dosya üretir. | `MediaRecorder` formatı `audio/webm` olarak sabitlenmiştir; Safari `mp4/aac` ister. | Bölüm 4 (`mic_manager.js`) |
| **B1** | DSP Yakalama | 🟠 Yüksek | Perde tespiti kararsızdır; ses tizleştikçe frekans yutulur. | Tarayıcının yerleşik gürültü engelleme ve AGC filtreleri müzikal sinyali bozar. | Bölüm 4 (`mic_manager.js`) |
| **B2** | Algoritma | 🔴 Kritik | Perde ibresi oktav sıçramaları yapar; sessizlikte dahi rastgele frekanslar fırlar. | Temel otokorelasyonda eşikleme, parabolik enterpolasyon ve VAD güvencesi yoktur. | Bölüm 4 (`yin_processor.worklet.js`) |
| **B3** | Matematik | 🟡 Orta | Cent hesaplaması negatif sapmalarda sistematik olarak 1 cent hatalıdır. | `Math.round` yerine `Math.floor` kullanılmıştır. | Bölüm 5 (`tuning_core.js`) |
| **B4** | Mimari | 🟠 Yüksek | Web Worker kilitlenirse perde tespiti sonsuza kadar donar; ana iş parçacığı kasar. | Hata yakalama (`onerror`), timeout emniyeti ve bellek temizliği yoktur. | Bölüm 4 (`yin_processor.worklet.js`) |
| **B5** | Zamanlama | 🔴 Kritik | Canlı eğri çiziminde zaman kaymaları (jitter) ve arka plan sekmede donma olur. | Analiz `requestAnimationFrame` içinde ana iş parçacığında yapılmaktadır. | Bölüm 4 (`yin_processor.worklet.js`) |
| **B6** | Müzik Nazariyatı| 🔴 Kritik | Segâh makamında (244 Hz) okuyan talebe için ibre asla yeşil "Tam Karar" yanmaz. | Tuner, 53-koma makam perdeleri yerine yalnızca 12-TET Batı notalarına eşleme yapar. | Bölüm 5 (`tuning_core.js`) |
| **B7** | Normalizasyon | 🟠 Yüksek | Karar sesinin altına inen perdeler 0 cent değerine yapışır; eğri kesilir. | Cent dönüşüm formülü [0.92, 1.85] dışındaki oranları kırpmaktadır. | Bölüm 5 & 7 (`tuning_core.js`) |
| **C1** | Terminoloji | 🟡 Orta | Türk Arel-Ezgi sistemi ile Arap Maqamat sistemleri aynı tabloda çelişkili verilmiştir. | İki ayrı mûsiki geleneği tefrik edilmeden rastgele centler atanmıştır. | Bölüm 5 (`tuning_core.js`) |
| **C2** | Akort Değeri | 🟠 Yüksek | Segâh karar frekansı 241 Hz olarak verilmiştir (B3 doğal 246.9 Hz iken 1 koma bemol ~244.3 Hz olmalıdır). | Bilimsel 53-koma formülü yerine yuvarlatılmış kaba frekans yazılmıştır. | Bölüm 5 (`tuning_core.js`) |
| **C3** | İlmi Dürüstlük | 🔴 Kritik | Model âyet konturları gerçek kâri kaydı değil, 9 noktalı sentetik uydurmadır. | Gerçek ses dosyası işleme hattı kurulmamış, elle JSON uydurulmuştur. | Bölüm 7 & 14 (`extract_reference_contour.mjs`) |
| **C4** | Dini Metin | 🟠 Yüksek | Âyetü'l-Kürsî ve Fecr âyetleri kısaltılmış, âyet sonu durak numaraları eksiktir. | Mushaf veri tabanından dinamik çekilmeyip eksik metin gömülmüştür. | Bölüm 10 (`reading_modal.js`) |
| **C5** | Görsel Etiket | 🟡 Orta | Tüm makamlarda piyano üstü etiketler Rast kararına göre (Sol) gösterilir. | Makamın durak perdesine göre dinamik derece üretilmemektedir. | Bölüm 5 & 11 (`studio_ui.js`) |
| **C6** | Tecvid | 🟡 Orta | Medd kartlarında "4 elif + 1.5 elif ğunne" gibi kesin ifadeler yer almaktadır. | Kıraat imamlarının farklı tarîk ve vecihleri ihtiyatla belirtilmemiştir. | Bölüm 6 (`medd_engine.js`) |
| **D1** | Etkileşim | 🟠 Yüksek | Medd çalışma kartlarına tıklandığında hiçbir tepki verilmez. | Kartlar için DOM olay dinleyicisi yazılmamıştır. | Bölüm 6 & 11 (`studio_ui.js`) |
| **D2** | Ölçüm | 🔴 Kritik | Kullanıcı nefes alırken veya heceler arası mikrosaniyelik duraksamada sayaç sıfırlanır. | Ses enerjisinde eşik dalgalanmalarına karşı debounce (hangover) koruması yoktur. | Bölüm 6 (`medd_engine.js`) |
| **D3** | Algoritma | 🟠 Yüksek | 3 elif ve 6 elif gösterge lambaları hiçbir okuyuşta yanmaz. | `evaluateElifAmount` fonksiyonu sadece 1, 2, 4, 5 üretmektedir; 3 ve 6 aralık dışıdır. | Bölüm 6 (`medd_engine.js`) |
| **D4** | Pedagoji | 🔴 Kritik | 1 elif süresi 280 ms olarak sabitlenmiştir; hızlı (Hadr) veya yavaş (Tahkik) okuyan yanılır. | Kullanıcının kendi doğal hareke süresini ölçen kalibrasyon adımı işletilmemiştir. | Bölüm 6 (`medd_engine.js`) |
| **D5** | Raporlama | 🟡 Orta | Medd okuması biter bitmez sayaç silinir; talebe sonucunu inceleyemez. | Ölçüm bitiminde nihai sonucu donduran (freeze) durum makinesi eksiktir. | Bölüm 6 & 10 (`reading_modal.js`) |
| **E1** | Veri Bütünlüğü | 🔴 Kritik | "Kayıt Al" basıldığında hem yapay centler hem gerçek centler aynı diziye basılır. | İki farklı dinleyici aynı anda global `userStudioPitchSamples` dizisine push yapar. | Bölüm 7 (`dtw_v2.js`) |
| **E2** | Değerlendirme | 🔴 Kritik | Zamanlama skoru gerçekte zamanı ölçmez; sadece perde farkından üretilir. | DTW warping yolu eğim sapması hesaba katılmamış, sahte puan yazılmıştır. | Bölüm 7 (`dtw_v2.js`) |
| **E3** | Çözünürlük | 🟠 Yüksek | 7 saniyelik tilâvet sadece 50 noktaya indirgenir; nağme kıvrımları silinir. | 140 ms'lik kaba örnekleme ve sessiz alanların yapay interpolasyonu nağmeyi yok eder. | Bölüm 7 (`dtw_v2.js`) |
| **E4** | Grafik | 🟡 Orta | Kullanıcı referanstan 1 saniye bile uzun okusa x ekseni zıplayarak yeniden çizilir. | Sabit referans penceresi yerine dinamik `maxT` ile ani canvas dönüşümü yapılmıştır. | Bölüm 7 & 10 (`reading_modal.js`) |
| **E5** | Hukukî / İlmî | 🟠 Yüksek | "Skor %88: Başarılı İcazet Düzeyi" gibi yanıltıcı bildirimler mevcuttur. | "Bu ölçüm bir fem-i muhsin icazeti değildir" fıkhî uyarısı gizlenmiştir. | Bölüm 7 & 16 |
| **E6** | UI Estetik | 🟡 Orta | Referans kontur köşeli ve kırık bir çizgi olarak çizilir. | Catmull-Rom veya Monotone Kübik spline enterpolasyonu uygulanmamıştır. | Bölüm 7 & 10 (`reading_modal.js`) |
| **F1** | DSP Spektrum | 🔴 Kritik | Hayşûm (Geniz) rezonansı 1500-3500 Hz olarak etiketlenmiş ama FFT 1500 Hz'de kesilmiştir. | 2048 FFT boyutu 64 elemanlık diziye kopyalanmış; 1.5 kHz üstü tamamen atılmıştır. | Bölüm 8 (`spectrum_analyzer.js`) |
| **F2** | Görsel | 🟠 Yüksek | Osiloskop dalgası durağan değildir; mikrofon kapalıyken y=20 çizgisine yapışır. | Sıfır-geçiş (zero-crossing) tetikleme mantığı ve sıfır merkezleme eksiktir. | Bölüm 8 (`spectrum_analyzer.js`) |
| **F3** | Akış | 🟡 Orta | İstasyon 4'e geçildiğinde mikrofonu açacak bir yönlendirme veya buton yoktur. | Boş durum (empty state) tasarımı ve mikrofon kontrol butonu yerleştirilmemiştir. | Bölüm 8 & 11 (`studio_ui.js`) |
| **G1** | Nefes Testi | 🔴 Kritik | "Kesintisiz Nefes Kapasitesi" testi mikrofonu dinlemez, talebenin butona basışını ölçer. | VAD (Voice Activity Detector) ile ses başlangıç ve bitişi otomatik bağlanmamıştır. | Bölüm 9 (`breath_coach_v2.js`) |
| **G2** | Animasyon | 🟡 Orta | 4-4-8 nefes halkası CSS geçişi 1 saniyede biterken nefes fazı 8 saniye sürer. | CSS süresi ile JavaScript faz durumu senkronize edilmemiştir. | Bölüm 9 (`breath_coach_v2.js`) |
| **G3** | Pedagoji | 🟡 Orta | Yoga kaynaklı 4-4-8 tekniği tilâvet nefesini tam simüle etmez. | Hızlı alış - uzun kontrollü veriş (2-4-12) tilâvet nefes modu bulunmamaktadır. | Bölüm 9 (`breath_coach_v2.js`) |
| **G4** | Bellek Sızıntısı| 🟠 Yüksek | Nefes sayacı çalışırken başka sekmeye geçilirse arkada console hataları fırlar. | `clearInterval` ve rAF iptali yapılmamış, kopuk DOM'a yazılmaya çalışılmıştır. | Bölüm 9 (`breath_coach_v2.js`) |
| **H1** | Mimari Çöküş | 🔴 Kritik | Tını veya tempo değiştiğinde `innerHTML` tüm sayfayı yıkar; çalışan canlı tuner ölür. | Durum odaklı kısmi DOM güncellemesi yerine tüm istasyon HTML'i baştan yazılmaktadır. | Bölüm 11 (`studio_ui.js`) |
| **H2** | Ergonomi | 🟠 Yüksek | Mikrofon butonu en tepedeki dev rehber banner içine gömülüdür; aşağı kayınca kaybolur. | Sabit (sticky) alt/üst kontrol barı yerine statik metin kutusuna konulmuştur. | Bölüm 11 (`studio_ui.js`) |
| **H3** | Okuma Alanı | 🔴 Kritik | Talebe âyet okurken küçücük bir kutuya bakmak zorunda kalır; harfleri seçemez. | Okuma esnasında odaklanmayı sağlayan modüler büyük pencere (modal) yoktur. | Bölüm 10 (`reading_modal.js`) |
| **H4** | Ölü Kod | 🟠 Yüksek | "Bu Âyeti Mushaf'ta Aç" butonu ve Medd kartı tıklamaları hiçbir işlem yapmaz. | Fonksiyon gövdeleri boş bırakılmış veya dinleyiciler bağlanmamıştır. | Bölüm 10 & 11 (`studio_ui.js`) |
| **H5** | Hata Yönetimi | 🟡 Orta | Mikrofon izni verilmediğinde tarayıcı `alert()` kutusu fırlatır; sayfa kilitlenir. | Kullanıcı dostu, satır içi (inline) rehber kapsülü tasarlanmamıştır. | Bölüm 11 (`studio_ui.js`) |
| **H6** | Stil / A11y | 🟡 Orta | 11px fontlar, `:focus-visible` eksikliği, platforma göre değişen emoji ikonlar mevcuttur. | Tasarım token'ları ve SVG ikon sistemi kurulmamıştır. | Bölüm 12 (`ses_lab_v4.css`) |
| **H7** | Çelişki | 🟡 Orta | Vanilla arayüzde ibre eşiği ±15 cent iken React kodunda ±12 centtir. | İki ayrı motor için farklı tolerans sabitleri kodlanmıştır. | Bölüm 5 & 13 |
| **H8** | Perde Dili | 🟡 Orta | Arayüzde "A3, C#4" gibi Batı nota kodları yazar; "Dügâh, Çargâh" gibi İslâm perdeleri yoktur. | Perde sözlüğü ve Türk mûsikisi perde adı eşleyicisi UI'a bağlanmamıştır. | Bölüm 5 & 11 |
| **H9** | Deneyim | 🟡 Orta | Talebe "Kayıt Al" dediği anda hazırlıksız yakalanır; doğrudan ses beklenir. | 3-2-1 görsel ve ritmik geri sayım sayacı eksiktir. | Bölüm 10 (`reading_modal.js`) |
| **H10**| Erişilebilirlik | 🟠 Yüksek | Ekran okuyucu istasyon sekmelerini buton sanır; canlı perde değişimini duyuramaz. | ARIA rolleri (`tablist`, `tabpanel`, `aria-live="polite"` ) tanımlanmamıştır. | Bölüm 11 & 12 |
| **H11**| Gizlilik / KVKK| 🟡 Orta | Kullanıcının sesi nereye gidiyor belirsizdir; yerel kayıt geçmişi tutulmaz. | Tüm sesin yerel çalıştığını belirten KVKK güvencesi ve IndexedDB kaydı yoktur. | Bölüm 10 & 16 |
| **I1** | Kod Kalitesi | 🟠 Yüksek | `studioPitchSamples` gibi global değişkenler pencereye asılmış, bellek sızıntısına yol açmaktadır. | Kapsüllenmemiş global durum yapısı mevcuttur. | Bölüm 11 (`studio_store.js`) |
| **I2** | Tip Güvenliği | 🟡 Orta | React ve Vanilla bileşenleri arasında veri yapıları uyumsuzdur. | Paylaşımlı TypeScript tip sözleşmesi bulunmamaktadır. | Bölüm 2 (`types.ts`) |
| **I3** | CSS Yönetimi | 🟡 Orta | BEM standardı olmayan, global selector çakışmaları yaratan stil kuralları vardır. | Modüler ad alanı (`sl-`) ve CSS custom properties mimarisi eksiktir. | Bölüm 12 (`ses_lab_v4.css`) |
| **I4** | Olay Yönetimi | 🟠 Yüksek | DOM elementleri silindiğinde dinleyiciler (`addEventListener`) temizlenmemektedir. | Bellek sızıntısı (memory leak) oluşturan açık dinleyiciler vardır. | Bölüm 11 (`studio_ui.js`) |
| **I5** | DRY Prensibi | 🟡 Orta | Cent-frekans dönüşüm formülleri 4 farklı dosyada tekrar tekrar yazılmıştır. | Merkezi tuning çekirdeği kullanılmamaktadır. | Bölüm 5 (`tuning_core.js`) |
| **I6** | Test Eksikliği | 🔴 Kritik | Kritik DSP algoritmaları için birim ve entegrasyon testi bulunmamaktadır. | Test altyapısı ve sentetik sinyal üreteçleri kurulmamıştır. | Bölüm 15 (`tests/`) |
| **J** | Donanım Uyumu | 🟠 Yüksek | Farklı donanım örnekleme frekanslarında (44.1 kHz, 48 kHz, 96 kHz) tampon ve hop-size hesapları sapmaktadır. | Dinamik `audioContext.sampleRate` senkronizasyonu yapılmamıştır. | Bölüm 4 (`yin_processor.worklet.js`) |
