# CYMATIQUE — Kur'ân-ı Kerîm Mushaf & Tilavet Laboratuvarı
# UI/UX Radikal Dönüşüm Ana Planı (Uygulayıcı AI Rehberi)

> **Dosya:** `UI_UX_RADICAL_TRANSFORMATION_MASTERPLAN.md` — proje kökünde, `README.md` ile aynı dizine konur (projede başka bir dokümantasyon klasörü yoktur).
> **Hazırlanma temeli:** Aşağıdaki 8 gerçek dosya satır satır incelenmiştir: `index.html` (358 satır), `style.css` (845), `tilavet_engine.js` (2905), `README.md`, `baslat.bat`, `baslat_masaustu.bat`, `baslat_sessiz.vbs`, `create_shortcut.ps1`.
> **İncelenmeyen / erişilemeyen:** Çalışan uygulamanın ekran görüntüsü veya canlı ekranı bu inceleme sırasında **görülmedi**; görsel sorunlar kaynak koddan çıkarılmıştır ve "(çıkarım)" ile işaretlidir. Hiçbir performans ölçümü yapılmadı; performans iddiaları yalnızca kod yapısına dayanır.
> **Bu dosya kod değiştirmez.** Uygulayıcı AI bu belgeyi sırayla uygulayacaktır. Belge içindeki her kod bloğunun hedef dosyası başlığında yazılıdır.

---

## İçindekiler

1. Yönetici özeti ve tasarım vizyonu
2. Proje analizi ve mevcut mimari
3. Önceki talimatlarla uyumluluk
4. Korunacak işlevler ve tasarım özgürlüğünün sınırları
5. Mevcut tasarımın sorun analizi
6. Yeni UI/UX konsepti ve gerekçeleri
7. Bilgi mimarisi ve kullanıcı akışları
8. Tasarım tokenları ve görsel sistem
9. Bileşen mimarisi
10. Teknoloji seçimi ve entegrasyon stratejisi
11. Sayfa bazlı tasarım dönüşümü
12. Gerekli kodlar ve dosya bazlı uygulamalar
13. Animasyon ve mikro etkileşim sistemi
14. Responsive tasarım
15. Erişilebilirlik
16. Performans ve teknik riskler
17. Uygulama yol haritası
18. Önceliklendirme ve etki analizi
19. Test planı ve kabul kriterleri
20. Tamamlanma kontrol listesi

---

## 1. Yönetici özeti ve tasarım vizyonu

**Ürün:** Tek sayfalık, saf HTML/CSS/JS bir Kur'an okuma ve tilavet istasyonu. Mushaf sayfasını gösterir, âyet seçilince sağ kolonda Latin okunuşu, Diyanet meali ve tecvid kartlarını sunar; üç kâriyle âyet/sayfa dinletir; mikrofonla tecvid denetimi yapar; "Beni Bul" ile âyet arar. Yerel Python sunucusu üzerinden, Chrome/Edge `--app` penceresinde çalışır.

**Mevcut durum (v2 "Obsidyen & Altın"):** Koyu cam yüzeyler, cyan + altın vurgular, neon "siber HUD" estetiği. Önceki küçültme işleminde Canlı Rezonans/Galeri/Deney modülleri silindi; ancak HTML/JS'te hiç karşılığı olmayan **81 CSS sınıfı kalıntı olarak duruyor** (77'si güvenle silinebilir; 4'ü `is-recording`, `listening`, `success`, `warning` dinamik/ileride bağlanacak durum sınıflarıdır, Bölüm 12.2) ve arayüzün dili hâlâ "laboratuvar telemetrisi" kökenli.

**Vizyon — "Okuma Odası" (Reading Room):** Bir Kur'an okuma aracının dili sakin, odaklı ve kitabî olmalıdır; teknik laboratuvar dili değil. Karar özeti:

| # | Karar | Kısa gerekçe |
|---|---|---|
| V1 | **Mushaf sahnenin kahramanı olur**; kabuk (header, kolon, kartlar) geri çekilir. | Kullanıcının asıl işi sayfayı okumak. Şu an üst bar + toolbar + kısayol şeridi + Beni Bul paneli sayfayı aşağı itiyor. |
| V2 | **Tek tecvid renk dili**: sayfadaki mürekkep, lejant, sağ kart ve hata rozeti aynı token ailesinden beslenir. | Bugün lejanttaki renkler sayfadaki renklerle **eşleşmiyor** (Bölüm 5, S1). |
| V3 | **Vurgu ekonomisi**: Altın = marka/Mushaf, cyan = yalnızca "canlı/etkileşim" sinyali. Latin ve Meal kartlarındaki ayrı cyan/yeşil/altın şeritler kalkar. | Aynı kolonda 3 vurgu rengi + emoji gürültüsü. |
| V4 | **Beni Bul → komut-paleti tarzı kaplama (overlay)**; sayfa akışını itmez. | Şu an açılınca Mushaf'ı aşağı kaydırıyor; Esc ile kapanmıyor. |
| V5 | **Oynatıcı mobilde sabit "dock"**; masaüstünde sağ kolonun tepesinde sabit. | ≤1180px'te kolon sayfanın altına düşüyor; çal/durdur kontrolü kaybolur (çıkarım). |
| V6 | **Erişilebilirlik birinci sınıf**: klavyeyle âyet seçimi, `lang="ar"`, doğru Space davranışı, tecvid renginin yanında renk-dışı ipucu seçeneği. | Mevcut durumda âyet `<span>`'ları klavyeyle erişilemez. |
| V7 | **Sıfır yeni bağımlılık.** Framework, Tailwind, GSAP eklenmez. | Motor DOM'u `innerHTML` ile imperatif yazıyor; bir framework çakışır (Bölüm 10). |

**Radikal olan ne?** Renk değiştirmek değil, **bilgi hiyerarşisini ve etkileşim modelini** yeniden kurmak: (a) kabuk inceltme, (b) renk anlamının tek kaynağa bağlanması, (c) overlay + dock etkileşimi, (d) JS'e dokunmadan çalışan, `MutationObserver` tabanlı bir **UI katmanı (`ui.js`)** ile durum→görsel eşlemesi (mikrofon HUD'ı, çalan âyete otomatik kaydırma, klavye erişimi).

---

## 2. Proje analizi ve mevcut mimari

### 2.1 Dosya envanteri (incelenen gerçek dosyalar)

| Dosya | Boyut | Rol |
|---|---|---|
| `index.html` | 358 satır | Tek sayfa iskeleti. 25 `<button>`, 2 `<select>`, 2 `<input>`, 3 `<details>`. Başlık etiketi (`<h1>`–`<h6>`) **yok**. |
| `style.css` | 845 satır | "Obsidyen & Altın v2": token'lar, buton/form/kart kütüphanesi, Mushaf kâğıdı, sağ kolon, responsive. |
| `tilavet_engine.js` | 2905 satır | Tek motor: veri (SURAH_LIST, SURAH_START_PAGE, PRELOADED sayfa 1/2/50, BENİ BUL ön eşleşmeleri), render, ses, mikrofon, tecvid denetimi, Beni Bul, olaylar, "BÖLÜM 9" UI yardımcıları. |
| `README.md` | 53 satır | Özellik özeti ve dosya yapısı. |
| `baslat.bat` | 15 satır | `python -m http.server 8000` + varsayılan tarayıcı. |
| `baslat_masaustu.bat` | 18 satır | Sunucuyu gizli başlatır; **Chrome `--app` → yoksa Edge `--app` → yoksa varsayılan tarayıcı** (1420×920 pencere). |
| `baslat_sessiz.vbs`, `create_shortcut.ps1` | 5 / 22 satır | Masaüstü kısayolu ve gizli başlatıcı. Tasarımla ilgisi yok; **dokunulmaz.** |

### 2.2 Çalışma zamanı mimarisi (kodda doğrulandı)

```
index.html ──► style.css
           └─► tilavet_engine.js  (DOMContentLoaded → initTilavetEngine)
                 ├─ populateSurahSelect()           → #selectSurah (114 <option>)
                 ├─ loadMushafPage(50, 285)         → varsayılan açılış: Sayfa 50, Bakara 285
                 │     ├─ PAGE_CACHE (sayfa 1, 2, 50 hazır; diğerleri API)
                 │     └─ fetch api.alquran.cloud ×3 (quran-uthmani, tr.diyanet, en.transliteration)
                 ├─ renderMushafPage()              → #realMushafPage.innerHTML = (kurdele+başlık+gövde+altlık)
                 │     └─ selectAyahOnPage()        → #activeAyahTitle/#activeAyahJuzBadge/#activeAyahLatin/
                 │                                    #activeAyahMeal/#activeAyahTajweedRules doldurur
                 ├─ playQariRecitation()            → everyayah.com mp3 (new Audio)
                 ├─ toggleTilavetListening()        → Web Audio RMS + Web Speech (ar-SA)
                 ├─ executeBeniBulSearch()          → 5 katman: söz dizimi, sure adı, ön eşleşme, bulanık, API
                 └─ setupTilavetEventListeners / setupMushafToolbarListeners (klavye: Boşluk, ←/→)
```

### 2.3 Motorun DOM sözleşmesi — **42 kimlik**

Motor aşağıdaki `id`'leri `getElementById` ile arar ve **içeriklerini/sınıflarını dinamik değiştirir**. Bu kimlikler yeniden tasarımda **aynen kalmak zorundadır**:

| Grup | ID'ler |
|---|---|
| Gezinti | `btnPrevPage`, `inputPageNum`, `btnGoToPage`, `btnNextPage`, `selectSurah` |
| Beni Bul | `btnOpenBeniBulModal`, `beniBulDeck`, `btnStartBeniBulVoice`, `btnToggleBeniBulLang`, `inputBeniBulText`, `btnClearBeniBulText`, `btnExecuteBeniBulSearch`, `beniBulStatus`, `beniBulResultsContainer`, `beniBulResultsList` |
| Mushaf | `realMushafPage` |
| Oynatıcı | `activeAyahTitle`, `activeAyahJuzBadge`, `btnPlayActiveAyah`, `activeReciterSubText`, `selectReciter`, `btnPlayCurrentPage`, `liveFeedbackBanner` |
| Okuma | `activeAyahLatin`, `activeAyahMeal`, `activeAyahTajweedRules` |
| Denetim | `tilavetLiveBadge`, `btnListenTilavet`, `tilavetRecognizedWord`, `tilavetScoreVal`, `tilavetErrCount`, `btnResetTilavetScore`, `tilavetErrorList` |
| Simülatör | `btnSimErrorMadd`, `btnSimErrorMaddShort`, `btnSimErrorWaqfLa`, `btnSimErrorWaqfMust`, `btnSimErrorIhfa` |
| Sistem | `toast`, `activeReciterBadge` |
| HTML'de var, JS'de **kullanılmıyor** | `micHudDot`, `hudMicStatus` (eski `app.js` silindiği için hiçbir kod bunları güncellemiyor) |

### 2.4 Motorun dinamik olarak ürettiği / değiştirdiği sınıflar

Bunlar CSS'ten **silinemez**:
- `.page-ayah-span[data-surah][data-ayah]`, `.flower-medallion`
- `.active-page-ayah`, `.page-ayah-playing`
- `.tajweed-madd/-ihfa/-kalkale/-lafzatullah/-iklab/-vakif`
- `.mushaf-side-ribbon`, `.mushaf-page-header`, `.mushaf-header-meta`, `.mushaf-unwan-cartouche`, `.mushaf-unwan-title`, `.mushaf-15lines-body`, `.mushaf-inner-surah-divider`, `.mushaf-bismillah-banner`, `.mushaf-page-footer`, `.page-num-arabic-pill`
- `.tajweed-edu-card` (+`--rule` inline), `.tajweed-card-top/-word/-badge`, `.tajweed-action-strip`, `.tajweed-detail-text`
- `.is-playing` + `.master-play-icon/.master-play-title-wrap/.master-play-main-text/.master-play-sub-text/.space-shortcut-pill`
- `.live-feedback-banner` + `info|alert|error|success|warning`
- `.recording`
- `.tilavet-error-item`, `.error-badge`
- `.beni-bul-result-card`, `.result-card-header`, `.result-badge`, `.result-actions`, `.btn-quick-listen`, `.btn-open-fullpage`, `.result-arabic-preview`, `.result-meal`
- `.hidden` + inline `style.display`
- `.page-turn`, `.btn-page-shortcut.active`
- `.toast.show`
- `.word-correct-highlight`

---

## 3. Önceki talimatlarla uyumluluk

| Kod | Kural | Kaynak |
|---|---|---|
| C1 | Proje **yalnızca** Kur'an Tilaveti & Mushaf ekranıdır. Canlı Rezonans, Galeri, Deney Odası, `design_lab.html`, sol sekme rayı geri getirilmez. | Kullanıcı talimatı |
| C2 | Çalışma altyapısı (JS motoru, Python sunucu, `.bat/.vbs/.ps1` başlatıcılar) **bozulmaz**: "tıkır tıkır çalışmalı". | Kullanıcı talimatı |
| C3 | Yeni örnek tasarım/demo/yedek (`.bak`) dosyası **bırakılmaz**. Yalnızca çalışan proje dosyaları kalır. | Kullanıcı talimatı |
| C4 | Spacebar = çalan âyeti durdur/oynat; ← / → = sayfa değiştirme **davranışı** korunur. | README + motor |
| C5 | 42 `id` korunur (Bölüm 2.3). | Motor sözleşmesi |
| C6 | Tecvid kural mantığı, ses motoru, mikrofon ve Beni Bul algoritması **yeniden yazılmaz**. | Bu belge Bölüm 4 |
| C7 | Arayüz dili Türkçe kalır; Arapça içerik `lang="ar"` ve RTL ile işaretlenir. | `index.html` |
| C8 | Dinî metin içeriği (âyet metni, meal, kural açıklamaları) arayüz tasarımı gerekçesiyle **kısaltılmaz/değiştirilmez**. | Doğruluk gereği |

---

## 4. Korunacak işlevler ve tasarım özgürlüğünün sınırları

### 4.1 Korunur (değiştirilmez)
* `renderMushafPage`, `selectAyahOnPage`, `loadMushafPage`, `PAGE_CACHE` ve veri yapıları (`pageData.ayahs[].words[].tajweed`).
* Ses: `playQariRecitation`, `playActiveAyahAudio`, `playCurrentPageAudio`, `stopAllAudioPlayback`, `RECITERS`, `getAyahAudioUrl`.
* Mikrofon/tecvid: `toggleMicrophone`, `toggleTilavetListening`, `startAcousticTimingTracker`, eşikler (`0.08`, `650 ms`, `450 ms`, `200 ms`), `TAJWEED_RULES`, puanlama (`-5`, taban `10`).
* Beni Bul: `executeBeniBulSearch` katmanları, `BENI_BUL_PRESETS`, `SURAH_ALIASES`, debounce süreleri.
* Klavye: Boşluk, ←/→ ve "form elemanında yazarken kısayol çalışmaz" kuralı.
* Ağ uç noktaları ve harici servisler.

### 4.2 Serbest (yeniden tasarlanır)
Yerleşim, grid, tipografi, renk, tokenlar, buton/kart/panel görünümü, ikonlar, animasyonlar, boş/yükleme/hata durumları, responsive davranış, Beni Bul'un **sunum biçimi** (açılma şekli — açma/kapama mantığı aynı butonla aynı kalır), HUD içeriği, lejantın konumu.

---

## 5. Mevcut tasarımın sorun analizi
- S1: Tecvid renkleri üç ayrı yerde üç ayrı paletten geliyor.
- S2: Kontrast sorunları (özellikle sarı/altın kâğıt üstünde 3:1 altı).
- S3: Mikrofon HUD'ı ölü; statik rozetler bilgi taşımıyor.
- S4: "Kayıt" durumunun görseli yok (yalnızca yazı değişiyor).
- S5: Klavye ve ekran okuyucu erişimi kısıtlı.
- S6: Tipografi ölçeğinde aşırı küçük (<10px) etiketler var.
- S7: 77 ölü CSS sınıfı ve inline stil kirliliği.
- S8: Yerleşimde Mushaf'ın aşağı itilmesi ve mobilde oynatıcının kaybolması.
- S9: Görsel dilde emoji karmaşası.
- S10: `playQariRecitation` içinde `playBtn` tanımsız değişken hatası.

---

## 6. Yeni UI/UX konsepti ve gerekçeleri
- Konsept: "Okuma Odası" (Reading Room).
- Sahne: Mushaf sayfası sıcak kâğıt, altın kılcal çerçeveler, merkezde tek kahraman.
- Çalışma Masası: Sağ kolon mat obsidyen, altın hairline, düzenli kartlar.
- Kaplama: Beni Bul komut paleti kaplaması.
- Kararlar: K1 tek tecvid token ailesi, K2 lejant sahne altında, K3 ince 52px header, K4 overlay Beni Bul, K5 mobil oynatıcı dock'u, K6 `ui.js` MutationObserver katmanı, K7 SVG ikon hazırlığı, K8 yazı boyutu kontrolü (A-/A+).

---

## 7. Bilgi mimarisi ve kullanıcı akışları
- Sayfa iskeleti: `skip-link` -> `ambient-bg` -> `app-shell` -> `app-header` -> `main.workspace` -> `mushaf-global-toolbar` -> `quick-page-shortcuts` -> `#beniBulDeck` (fixed overlay) -> `mushaf-split-workspace` (`.mushaf-page-container` [page + legend bar] | `aside.mushaf-companion-sidebar` [player hero + reader + tajweed + 2 details]).

---

## 8. Tasarım tokenları ve görsel sistem
- Renkler, tecvid ailesi (`--tj-madd`, `--tj-ihfa`, `--tj-kalkale`, `--tj-lafz`, `--tj-iklab`, `--tj-vakif` ve `--tj-*-ui`), tipografi, boşluklar, katmanlar (`@layer reset, tokens, base, shell, components, mushaf, companion, overlays, utilities;`).

---

## 9. Bileşen mimarisi
- Butonlar, form kontrolleri, çipler, kartlar, header, toolbar, Mushaf sayfası, oynatıcı dock, tecvid sistemi, Beni Bul kaplaması, geri bildirimler, durum blokları.

---

## 10. Teknoloji seçimi ve entegrasyon stratejisi
- Saf HTML + CSS + JS (sıfır bağımlılık).
- `ui.js` bağımsız UI orkestrasyonu (MutationObserver ile motorun DOM değişikliklerini yakalar, durumu görselleştirir).

---

## 11. Sayfa bazlı tasarım dönüşümü
- `index.html` üzerinde radikal okuma odası dönüşümü.

---

## 12. Gerekli kodlar ve dosya bazlı uygulamalar
- 12.1: `index.html` değişiklikleri (E1-E10).
- 12.2: `style.css` 77 ölü sınıfın temizlenmesi, 4 dinamik sınıfın korunması.
- 12.3: `style.css` katmanlı bloklar (B-0'dan B-9'a).
- 12.4: `tilavet_engine.js` T1-T4 temizlikleri.
- 12.5: Tecvid kartlarının aileye bağlanması (`tajweed-edu-card[data-family]`).
- 12.6: `ui.js` tam uygulaması.
