# 🔍 MAKAM OKULU v3 — FAZ 0 KEŞİF RAPORU (KESIF.md)

**Tarih:** 20 Ekim 2026  
**Durum:** Faz 0 Keşif Tamamlandı  
**Baseline Git Etiketi:** `pre-makam-v3`  
**Aktif Dal:** `feat/makam-okulu-v3`  

---

## 1. Makam Okulu İle İlgili Dosyalar

Aşağıdaki komut çalıştırılmıştır:
```bash
git grep -l -E "renderMakamView|DroneSynthesizer|MAKAMLAR|akademi-view-makam"
```

**Çıktı:**
```
MAKAM_OKULU_MASTER_BLUEPRINT_VE_KOD_REHBERI.md
README.md
TILAVET_AKADEMISI_MASTER_BLUEPRINT_VE_KOD_REHBERI.md
docs/SOURCES.md
docs/tilavet/01-uyarlama-plani.md
docs/tilavet/ILERLEME.md
kimatik_lab/docs/tilavet/01-uyarlama-plani.md
kimatik_lab/docs/tilavet/ILERLEME.md
kimatik_lab/index.html
kimatik_lab/tilavet_akademi_engine.js
kimatik_lab/tilavet_audio_lab.js
scripts/build_makam_spec_document.js
```

Ayrıca React/TypeScript mimarisinde:
```
src/tilavet/core/makam/tuning.ts
src/tilavet/data/makam/*.json (10 adet makam json dosyası)
src/tilavet/pages/MakamPage.tsx
src/tilavet/ui/MakamDetail.tsx
src/tilavet/ui/MakamGrid.tsx
src/tilavet/ui/DronePanel.tsx
```

---

## 2. K-01: Eski Global Bağımlılıkların Taraması

Aşağıdaki komut çalıştırılmıştır:
```bash
git grep -n -E "getAudioContext|TilavetAudioManager|showToast|getAyahAudioUrl|playQariRecitation|switchAppTab|locateAndSelectSurahAyah|saveState|stopMakamAudio|updateMakamAudioUI|formatAudioTime"
```

### Özet Eşleme ve Karşılıklar:
1. `getAudioContext`: `kimatik_lab/tilavet_audio_lab.js:16` içinde yerel/global tanımlı, `src/tilavet/core/audio/context.ts` içinde ES modül olarak var.
2. `state`: `kimatik_lab/tilavet_akademi_engine.js:13` içinde yerel değişken; localStorage `tilavet_akademi_state_v1` ile saklanıyor.
3. `saveState`: `kimatik_lab/tilavet_akademi_engine.js:49` içinde tanımlı.
4. `makamAudioPlayer`: `kimatik_lab/tilavet_akademi_engine.js:2519` içinde modül içi `let` değişkeni.
5. `currentMakamAudioItem`: `kimatik_lab/tilavet_akademi_engine.js:2520` içinde modül içi `let` değişkeni.
6. `stopMakamAudio`: `kimatik_lab/tilavet_akademi_engine.js:2523` içinde fonksiyon, `TilavetAudioManager`'a register ediliyor.
7. `updateMakamAudioUI`: `kimatik_lab/tilavet_akademi_engine.js:2569` içinde DOM güncelleme fonksiyonu.
8. `formatAudioTime`: `kimatik_lab/tilavet_akademi_engine.js:2619` içinde saniye → `mm:ss` çevirici.
9. `window.TilavetAudioManager`: `kimatik_lab/tilavet_audio_lab.js:980` ve `kimatik_lab/tilavet_engine.js` içinde merkezi ses yöneticisi (kategori çakışmalarını önler: `mushaf`, `makam`, `inceleme`, `drone`).
10. `window.showToast`: `kimatik_lab/tilavet_engine.js:3684` ve `kimatik_lab/inceleme_engine.js` içinde tanımlı `#toast` popup bildirim göstericisi.
11. `window.getAyahAudioUrl`: `kimatik_lab/tilavet_engine.js:827` içinde everyayah.com ses url oluşturucu.
12. `window.playQariRecitation`: `kimatik_lab/tilavet_engine.js:2201` içinde ana kâri tilavet oynatıcısı.
13. `window.switchAppTab`: `kimatik_lab/ui.js:416` içinde sekmeler arası yönlendirici (`tab-tilavet`, `tab-inceleme`, `tab-akademi`).
14. `window.locateAndSelectSurahAyah`: `kimatik_lab/tilavet_engine.js:2851` içinde Mushaf sayfasını açıp ilgili âyeti vurgulayan fonksiyon.

---

## 3. CSS Responsive & Erişilebilirlik Taraması

Aşağıdaki komut çalıştırılmıştır:
```powershell
$cssFiles = git grep -l -E "makam-chip|piano-key" -- "*.css"
# kimatik_lab/tilavet_akademi.css
```

**Sonuçlar:**
- `kimatik_lab/tilavet_akademi.css` içinde toplam `@media` bloğu: **8 adet** (Makam Okulu bileşenlerine özel `@media` bloğu: **1 adet**, yalnızca `.makam-header-row` için max-width 960px).
- `.piano-key` ve `.piano-scale-strip` için mobil breakpoint / responsive düzenleme: **0 adet** (min-width: 60px * 8 tuş = telefonda yatay taşma).
- `:focus-visible` tanımı: Makam bileşenlerinde **0 adet** (genel dosyada yalnızca 1 adet).
- `prefers-reduced-motion`: Makam Okulu ses dalgalarında ve animasyonlarında **0 adet**.
- Font boyutları: `key-degree`, `drone-title` vb. 9 yerde **11–12px** (0.7rem - 0.75rem).

---

## 4. Çalışma Ortamı ve Taban Çizgisi Ölçümleri

- **Port 8000 Durumu:** Aktif, `python -m http.server 8000` çalışıyor.
- **HTTP Durum Kodu:** `200 OK` (localhost:8000/).
- **Konsol Hataları:** Headless Chrome CDP üzerinden yakalanan konsol hatası sayısı: **0**.
- **Konsol Uyarıları:** **0**.
- **Ekran Görüntüleri:**
  - Masaüstü (1280x800): `docs/makam_okulu/baseline/desktop-1280.png` (203.9 KB)
  - Mobil (390x844): `docs/makam_okulu/baseline/mobile-390.png` (252.3 KB)
