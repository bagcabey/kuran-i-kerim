# 18. BÖLÜM 18: EKLER: KATALOG–ÇÖZÜM EŞLEME MATRİSİ VE DOĞRULAMA LİSTESİ

## 18.1. Hata Kataloğu – Çözüm Eşleme Matrisi

Aşağıdaki matris, `ses lab.md` denetiminde tespit edilen tüm hataların v4.0.0 kod tabanında hangi dosya, sınıf ve fonksiyon ile kesin çözüme kavuşturulduğunu gösterir:

| Hata ID | Kategori | Çözüm Dosyası | Çözüm Sınıfı / Fonksiyonu | Uygulanan Kesin Mühendislik Çözümü |
|:---:|:---|:---|:---|:---|
| **A1** | Ses Yönetimi | `instruments/drone_v2.js` | `DroneSynthesizerV2.play / stopImmediate` | `setTimeout(450)` iptal edildi; `generation` kimliği ve AudioParam rampaları kuruldu. |
| **A2** | Ses Yönetimi | `core/medd_engine.js` | `MEDD_CARDS` | Sabit 220 Hz yerine her karta özel makam ve harf karar frekansı (`exemplarHz`) atandı. |
| **A3** | Ses Yönetimi | `core/audio_focus_manager.js` | `AudioFocusManager.requestFocus / stopAll` | `exclusive` ve `ambient` öncelik sınıfları; istasyon geçişinde tam yaşam döngüsü temizliği. |
| **A4** | Akustik | `core/mic_manager.js` | `MicrophoneManager.handleWorkletMessage` | Anti-Drone Feedback Guard: F0 ile aktif drone korelasyon denetimi ve kulaklık uyarısı. |
| **A5** | DSP / Çıkış | `core/master_bus.js` | `MasterBus.ensureContext` | `DynamicsCompressorNode` (Brickwall Limiter) ve Master Gain kazanç yumuşatması eklendi. |
| **A6** | İşlevsellik | `ui/reading_modal.js` | `ReadingModal.playModelAudio / playUserAudio` | A-B oynatıcısı bağlandı; MediaRecorder Blob URL'i ile model EveryAyah sesi dinlenebilir oldu. |
| **A7** | Platform | `core/mic_manager.js` | `MicrophoneManager.start` | Safari tek-stream kısıtlaması: Tek `getUserMedia` akışı tuner ve kayıtçıya dağıtıldı. |
| **A8** | Platform | `core/mic_manager.js` | `MicrophoneManager.startRecording` | iOS Safari için `audio/mp4` MIME tipi fallback desteği getirildi. |
| **B1** | DSP Yakalama | `core/mic_manager.js` | `MicrophoneManager.start` | `echoCancellation: false, noiseSuppression: false, autoGainControl: false` ile ham sinyal alındı. |
| **B2** | Algoritma | `core/yin_processor.worklet.js` | `YINPitchProcessor.analyzeFrame` | $O(N^2)$ otokorelasyon yerine CMNDF ve parabolik enterpolasyonlu YIN kuruldu. |
| **B3** | Matematik | `core/tuning_core.js` | `TuningCore.hzToCentDifference` | `Math.floor` kaynaklı 1 cent negatif kayması `Math.round` ile düzeltildi. |
| **B4** | Mimari | `core/yin_processor.worklet.js` | `AudioWorkletProcessor` | Web Worker yerine ses iş parçacığı (AudioWorklet) kullanıldı; donmalar engellendi. |
| **B5** | Zamanlama | `core/yin_processor.worklet.js` | `YINPitchProcessor.hopSize` | rAF bağımlılığı kaldırıldı; 10 ms (100 FPS) düzenli hop size ile jitter sıfırlandı. |
| **B6** | Nazariyat | `core/tuning_core.js` | `TuningCore.resolvePitch` | 12-TET zorlaması kırıldı; Türk 53-Koma (AEU) ve Segâh perdesi (244.26 Hz) tam tanımlandı. |
| **B7** | Normalizasyon | `core/tuning_core.js` | `TuningCore.hzToCentDifference` | [0.92, 1.85] kısıtı kaldırıldı; mutlak logaritmik oran $1200 \log_2(f/f_{\text{ref}})$ işletildi. |
| **C1** | Terminoloji | `core/tuning_core.js` | `TuningCore.system` | Türk 53-koma ve Arap 24-EDO sistemleri iki ayrı motor olarak ayrıştırıldı. |
| **C2** | Akort Değeri | `core/tuning_core.js` | `PITCH_TABLE_53` | Segâh kararı 241 Hz'den bilimsel $220 \cdot 2^{8/53} \approx 244.26\text{ Hz}$ değerine çekildi. |
| **C3** | İlmi Dürüstlük | `scripts/extract_reference_contour.mjs` | `extractF0FromPCM` | 9 noktalı sentetik eğriler atıldı; gerçek kâri seslerinden çıkarılan 10 ms F0 JSON hattı kuruldu. |
| **C4** | Dini Metin | `ui/reading_modal.js` | `ReadingModal.open` | Kısaltılmış metinler yerine tam Mushaf hattı ve durak gülleri (`۝`) entegre edildi. |
| **C5** | Görsel Etiket | `ui/studio_ui.js` | `StudioUI.populateKeyboard` | Sabit Rast kararı yerine seçili ahenge göre dinamik derece ve frekans üretildi. |
| **C6** | Tecvid | `core/medd_engine.js` | `MEDD_CARDS.ruleExplanationTr` | Tarîk ve vecih ihtilafları (kasr, tevassut, tûl) kart notlarına ilave edildi. |
| **D1** | Etkileşim | `ui/studio_ui.js` | `StudioUI.bindGlobalEvents` | Medd çalışma kartlarına tıklama dinleyicileri bağlandı; aktif kart seçimi sağlandı. |
| **D2** | Ölçüm | `core/medd_engine.js` | `MeddEngine.processFrame` | Mikro kesintilerde sayacın sıfırlanmasını önleyen 130 ms hangover debounce tamponu kuruldu. |
| **D3** | Algoritma | `core/medd_engine.js` | `MeddEngine.calculatedElif` | 1-6 arası tüm elifler kesintisiz oranlandı; 3 ve 6 elif lambaları aktif edildi. |
| **D4** | Pedagoji | `core/medd_engine.js` | `MeddEngine.startCalibration` | Sabit 280 ms atıldı; bireysel $T_{\text{harakah}}$ kalibratörü ve 4 tempo modu (Hadr..Tahkik) eklendi. |
| **D5** | Raporlama | `core/medd_engine.js` | `MeddEngine.state: FROZEN_RESULT` | Ses kesildiğinde sayacın silinmesi engellendi; sonuç dondurularak karneye dönüştürüldü. |
| **E1** | Veri Bütünlüğü | `ui/reading_modal.js` | `ReadingModal.userSamples` | Yapay ve gerçek centlerin karışması engellendi; kullanıcı konturu izole dizide toplandı. |
| **E2** | Değerlendirme | `core/dtw_v2.js` | `DTWAnalyzerV2.compare` | Sahte zamanlama puanı kaldırıldı; warping yolu eğim sapmasıyla gerçek ritim skoru hesaplandı. |
| **E3** | Çözünürlük | `core/dtw_v2.js` | `DTWAnalyzerV2` | 50 nokta sınırlaması kaldırıldı; 10 ms hop size ile tam nağme çözünürlüğü sağlandı. |
| **E4** | Grafik | `ui/reading_modal.js` | `ReadingModal.drawContours` | Dinamik `maxT` yerine sabit referans penceresi konuldu; canvas sıçraması engellendi. |
| **E5** | Hukukî / İlmî | `core/dtw_v2.js` | `DTWComparisonResult.legalNotice` | "Fem-i muhsin icazeti değildir" fıkhî güvencesi karneye bağlandı. |
| **E6** | UI Estetik | `core/dtw_v2.js` | `DTWAnalyzerV2.drawSplineContour` | Köşeli çizgiler yerine Catmull-Rom kübik spline çizimi uygulandı. |
| **F1** | DSP Spektrum | `core/spectrum_analyzer.js` | `SpectrumAnalyzerV2.getBandsEnergy` | 64 eleman kısıtı kaldırıldı; 2048 FFT üzerinden Hayşûm ve Kâri Formantı (3.5 kHz) açıldı. |
| **F2** | Görsel | `core/spectrum_analyzer.js` | `SpectrumAnalyzerV2.drawOscilloscope` | Sıfır-geçişli (zero-crossing) tetikleme eklendi; dalga durağanlaştırıldı, merkezlendi. |
| **F3** | Akış | `ui/studio_ui.js` | `StudioUI.renderLayout` | İstasyon 4 paneline mikrofon durum uyarısı ve doğrudan mikrofon anahtarı bağlandı. |
| **G1** | Nefes Testi | `core/breath_coach_v2.js` | `BreathCoachV2.processVADFrame` | Manuel buton basımı kaldırıldı; VAD ile ses başlayınca/bitince otomatik ölçüm kuruldu. |
| **G2** | Animasyon | `core/breath_coach_v2.js` | `BreathCoachV2.loop` | CSS geçişi yerine rAF ile matematiksel SVG `strokeDashoffset` senkronizasyonu yapıldı. |
| **G3** | Pedagoji | `core/breath_coach_v2.js` | `BREATH_MODES` | Yoga 4-4-8 moduna ek olarak 2-4-12 tilâvet uzun nefes modu geliştirildi. |
| **G4** | Bellek Sızıntısı| `core/breath_coach_v2.js` | `BreathCoachV2.stop` | `cancelAnimationFrame` ile döngüler güvenle temizlendi. |
| **H1** | Mimari Çöküş | `ui/studio_ui.js` | `StudioUI.init / renderLayout` | `innerHTML` tüm sayfa yıkımı yasaklandı; şablon bir kez render edilip hedefli güncellendi. |
| **H2** | Ergonomi | `ui/studio_ui.js` | `StudioUI.renderLayout (.sl-sticky-bar)` | Sayfadan bağımsız sabit (sticky) alt kontrol çubuğu tasarlandı. |
| **H3** | Okuma Alanı | `ui/reading_modal.js` | `ReadingModal.mount / open` | Ekranı kaplayan modal ile dev hatlı (clamp 2.4rem+) Okuma Penceresi inşa edildi. |
| **H4** | Ölü Kod | `ui/reading_modal.js` | `ReadingModal.bindEvents` | "Mushaf'ta Aç" butonu `window.locateAndSelectSurahAyah` köprüsüne bağlandı. |
| **H5** | Hata Yönetimi | `ui/studio_ui.js` | `StudioUI.bindGlobalEvents` | `alert()` pencereleri kaldırıldı; satır içi kullanıcı dostu bildirimler uygulandı. |
| **H6** | Stil / A11y | `ui/ses_lab_v4.css` | Tasarım Token'ları | 11px fontlar ve emojiler kaldırıldı; SVG ikon sistemi ve WCAG 2.2 AA kontrastı uygulandı. |
| **H7** | Çelişki | `core/tuning_core.js` | `TuningCore.inTuneToleranceCent` | Vanilla ve React için $\pm 15\text{ cent}$ tek bir standart sabit olarak eşitlendi. |
| **H8** | Perde Dili | `core/tuning_core.js` | `PITCH_TABLE_53.nameTr` | A3/C4 yerine Dügâh, Çargâh, Nevâ, Segâh gibi İslâm mûsikîsi perde adları öne çıkarıldı. |
| **H9** | Deneyim | `ui/reading_modal.js` | `ReadingModal.startCountdownAndRecord` | Hazırlıksız okumayı önleyen 3-2-1 görsel ve ritmik geri sayım sayacı eklendi. |
| **H10**| Erişilebilirlik | `ui/studio_ui.js` | `StudioUI.renderLayout` | `tablist, tabpanel, aria-selected, aria-controls, focus-visible` standartları uygulandı. |
| **H11**| Gizlilik / KVKK| `ui/reading_modal.js` | Veri Mimarisi | Seslerin sunucuya gitmediği, %100 tarayıcı içinde yerel işlendiği garantilendi. |
| **I1** | Kod Kalitesi | `ui/studio_store.js` | `StudioStore` | Pencereye asılı global değişkenler atıldı; kapsüllenmiş Pub/Sub deposu kuruldu. |
| **I2** | Tip Güvenliği | `core/types.ts` | TypeScript Tipleri | React ve Vanilla için merkezi tip sözleşmesi hazırlandı. |
| **I3** | CSS Yönetimi | `ui/ses_lab_v4.css` | BEM Mimarisi | `.sl-` modüler ad alanı ve CSS Custom Properties standardı kuruldu. |
| **I4** | Bellek Yönetimi| `core/mic_manager.js` | `MicrophoneManager.stop` | Tüm dinleyiciler ve ses bağlantıları `disconnect` ile güvenle temizlendi. |
| **I5** | DRY Prensibi | `core/tuning_core.js` | `TuningCore` | Cent ve frekans dönüşümleri tek bir çekirdek sınıfta merkezileştirildi. |
| **I6** | Test Eksikliği | `tests/` | Vitest Test Paketi | Sentetik sinyaller, medd ve DTW için %100 doğrulayıcı test paketi yazıldı. |
| **J** | Donanım Uyumu | `core/master_bus.js` | `MasterBus.sampleRate` | 44.1, 48 ve 96 kHz örnekleme hızları dinamik tampon hesaplarıyla senkronize edildi. |

---

## 18.2. Uzman Onayına Tâbi Konular Listesi (`needsReview`)
Aşağıdaki maddeler yazılımsal olarak eksiksiz uygulanmış olup, mûsikî ve kıraat heyetinin nihai tasvibine sunulacaktır:
1. **Medd-i Munfasıl Tarîk İhtilafları:** Şâtıbiyye tarîkinde 4 elif vacip iken, Tayyibetü'n-Neşr tarîkinde hadr okuyuşunda 2 elif (kasr) caizdir. Arayüzde talebeye hangi tarîke göre okuduğu sorulabilir.
2. **Kâri Ses Dosyası Telif Hakları:** EveryAyah üzerindeki Mahmud Halil el-Husarî ve Abdussamed kayıtları kamu malı/vakıf statüsündedir; diğer kârilerin hakları kontrol edilmelidir.
3. **Bölgesel Çeyrek Ton Mikrofon İcraları:** Mısır mektebi ile Türk mûsikisi arasındaki Segâh perdesi basım farkı ($\approx 15-20\text{ cent}$) nazariyat hocalarıyla teyit edilmelidir.
