# 16. BÖLÜM 16: KABUL KRİTERLERİ, BİLİNEN SINIRLAR VE FIKHÎ/İLMÎ GÜVENCELER

## 16.1. Kabul Kriterleri Kontrol Listesi

Aşağıdaki 10 kabul kriteri, v4.0.0 sürümünün eksiksiz ve hatasız tamamlandığının nesnel kanıtlarıdır:

| No | Kriter Açıklaması | Doğrulama Yöntemi | Hedef Metrik | Durum |
|:---:|:---|:---|:---|:---:|
| **1** | **Ses Çakışması ve Yaşam Döngüsü:** Drone çalarken istasyon değiştirildiğinde ses arkada açık kalmaz; tını değişiminde ses kesilmez. | `AudioFocusManager` ve `DroneSynthesizerV2` testleri. | 0 adet başıboş (orphan) ses düğümü. | ✅ TAMAM |
| **2** | **AudioWorklet Gerçek Zamanlı F0:** YIN algoritması ana iş parçacığını dondurmadan ayrı iş parçacığında çalışır. | Chrome DevTools Performance Profiler. | Ana iş parçacığı DSP yükü < %2; 10 ms hop size. | ✅ TAMAM |
| **3** | **53-Koma ve Segâh Akort Doğruluğu:** Segâh kararı (244.26 Hz) okunduğunda tuner ibresi tam merkezde yeşil yanar. | `tests/studio_dsp.test.ts` sentetik sinyal testi. | Hata payı < 0.5 Hz / 1 cent. | ✅ TAMAM |
| **4** | **Hece Kalibrasyonlu Medd Ölçümü:** 1 elif keyfi 280 ms değil, $T_{\text{harakah}}$ üzerinden dinamik ölçülür; 1-6 elif lambaları eksiksiz çalışır. | `tests/medd_engine.test.ts` birim testi. | 6/6 elif lambası aktif; 130 ms hangover koruması. | ✅ TAMAM |
| **5** | **Sakoe-Chiba FastDTW Skorlama:** Model ile kullanıcı karşılaştırmasında perde ve ritim bağımsız ölçülür; sahte puan üretilmez. | `tests/dtw_scoring.test.ts` çift skor testi. | $O(N \cdot R)$ karmaşıklık; köşegen sapması hesabı. | ✅ TAMAM |
| **6** | **2048 FFT Spektrum ve Rezonans:** Hayşûm (1.5-2.5 kHz) ve Kâri Formantı (2.5-3.5 kHz) gerçek frekanslardan tahlil edilir. | `SpectrumAnalyzerV2` bant çıkış analizi. | 5/5 rezonans bandı canlı; sıfır-geçişli dalga. | ✅ TAMAM |
| **7** | **VAD Destekli Otomatik Nefes Testi:** Nefes kapasitesi mikrofon sesine göre otomatik başlar ve durur; elle butona basılmaz. | `BreathCoachV2` VAD testi. | 1.2 sn sessizlikte otomatik kapanma. | ✅ TAMAM |
| **8** | **Okuma Penceresi (Odak Modu Modal):** Talebe âyet okurken dev hatlı modal açılır, A-B dinleme ve Mushaf köprüsü kusursuz çalışır. | `ReadingModal` DOM ve olay testi. | `<dialog>` odak tuzağı; fluid font (2.4rem+). | ✅ TAMAM |
| **9** | **Sabit Kontrol Barı ve Kısmi Render:** Sayfa kaydırılsa da alt kontrol barı sabittir; tını değişiminde `innerHTML` yıkımı yapılmaz. | `StudioUI` kısmi render denetimi. | 0 DOM yeniden inşası; CSS sticky bar. | ✅ TAMAM |
| **10**| **Erişilebilirlik ve Kontrast (WCAG 2.2 AA):** Tüm renkler ve butonlar standartlara uygundur; mobil dokunma hedefleri $\ge 44\text{px}$'dir. | Lighthouse Accessibility Audit. | WCAG 2.2 AA kontrast skoru $\ge 95$. | ✅ TAMAM |

---

## 16.2. Bilinen Donanım ve Ortam Sınırları
1. **Kulaklık Zorunluluğu:** Karar demi (drone) veya model tilâvet dinlenirken hoparlör kullanılırsa ses mikrofona sızarak geri besleme (acoustic feedback) yaratabilir. Sistem kullanıcıya kulaklık takması yönünde görsel bildirim sunar.
2. **Ortam Akustiği:** Aşırı yankılı (reverberant) odalarda YIN algoritmasının CMNDF dip eşiği etkilenebilir. Sessiz ve yankısız odalar tavsiye edilir.
3. **Donanım Örnekleme Hızı:** Sistem 44.1 kHz, 48 kHz ve 96 kHz örnekleme hızlarını `masterBus.sampleRate` üzerinden dinamik ölçekler.

---

## 16.3. Fıkhî ve İlmî Kırmızı Çizgiler
- **Mûsikî Harfe Tâbidir:** Hiçbir arayüz öğesi, skor veya egzersiz; tecvid kuralını veya harf mahrecini mûsikî nağmesi uğruna feda etmeyi teşvik edemez.
- **Makam ≠ Kıraat:** Makam, kıraatin yerine ikame edilemez.
- **Canlı Fem-i Muhsin Şartı:** Yazılımsal skorlar bir yapay zekâ modellemesidir. Asla ehil bir Kur'ân hocasının canlı tilâvet dinlemesi ve icazet vermesi yerine geçmez. Arayüzde bu ikaz kalıcı olarak yer alır.
