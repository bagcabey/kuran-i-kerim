# TİLAVET AKADEMİSİ — UYARLAMA PLANI (01-uyarlama-plani.md)

> **Tarih:** 19 Ekim 2026  
> **Proje:** CYMATIQUE — Kur'ân-ı Kerîm Mushaf, Tilavet & Tefsir Laboratuvarı  
> **Hedef:** Spesifikasyonun Proje Yığınına Birebir Eşlenmesi  
> **Durum:** Onaylandı / Uygulama Aşamasında

---

## 1. MİMARİ VE DOSYA EŞLEME TABLOSU

| Spesifikasyon Bölümü | Yığın Karşılığı | Dosya / Konum | Açıklama |
|---|---|---|---|
| **Sekme Yapısı & Shell** | HTML5 Semantik `section` + Nav Butonu | `index.html` (`#tab-akademi`, `#tabBtnAkademi`) | Sol navigasyon rayında "Tilavet Akademisi" sekmesi, ana çalışma alanında lazy-rendered görünüm |
| **Tasarım & Tema** | CSS Variables + Layers | `style.css` & `tilavet_akademi.css` | Obsidyen & Altın v3 tokenları, makam perdeleri, tuner, dalga formları, piyano klavyesi ve seyir haritaları |
| **Akademi Çekirdek Motoru** | Vanilla JS ES2022 Sınıfları | `tilavet_akademi_engine.js` | Ders akışı, seviye ilerlemesi, aralıklı tekrar (SM-2), puanlama, yerel depolama |
| **Ses Laboratuvarı & DSP** | Web Audio API + AudioWorklet/ScriptProcessor | `tilavet_audio_lab.js` | Karar perdesi Drone sentezleyici, gerçek zamanlı F0 perde tespiti (Autocorrelation/YIN), Tuner (cent sapması), perde eğrisi karşılaştırma |
| **Gezinti & Entegrasyon** | UI Katmanı | `ui.js` | `switchAppTab('tab-akademi')` desteği, HUD rozet güncelleme, ses çakışmasını durdurma |
| **Makam Veritabanı** | Yapılandırılmış JSON | `data/tilavet/makamlar.json` | 10 makam (Rast, Uşşak, Hicaz, Buselik/Nihavend, Segâh, Sabâ, Kürdî, Acem, Neva, Hüzzam), perdeler, seyirler, motifler |
| **Müfredat & Dersler** | Şemalı JSON | `data/tilavet/lessons.json` | Seviye 0–5 dersleri, ses referansları, mahreç diyagramları, test soruları (`needsReview: true` etiketli) |
| **Terminoloji Sözlüğü** | Yapılandırılmış JSON | `data/tilavet/sozluk.json` | 40 temel kavram (mahreç, sıfat, med, makam, koma vb.) ses ve âyet örnekleriyle |
| **Kurrâ Kütüphanesi** | Birleşik Model JSON | `data/tilavet/reciters.json` | Mısır, Hicaz, Türk ekolü kâri profilleri, makam etiketleri ve akış URL'leri |

---

## 2. 12 ALT ALANIN ARAYÜZ VE BİLEŞEN TASARIMI

Tilavet Akademisi açıldığında üstte **Yolculuk Alt-Gezinti Çubuğu (Sub-Nav Tabs)** ile 12 ana modüle anında erişim sağlanır:

```
[ 🎙️ Tilavet Akademisi ]
  ├── 1. Yolculuğum (Dashboard)       → #akademi-view-yolculuk
  ├── 2. Sıfırdan Kur'an (Seviye 0-2) → #akademi-view-elifba
  ├── 3. Tecvid Okulu (Seviye 2-4)    → #akademi-view-tecvid
  ├── 4. Tilavet Teknikleri (4-5)     → #akademi-view-teknik
  ├── 5. Makam Okulu                  → #akademi-view-makam
  ├── 6. Şan & Ses Eğitimi            → #akademi-view-san
  ├── 7. Dinleme Salonu (Kurrâ)       → #akademi-view-dinleme
  ├── 8. Pratik Stüdyosu              → #akademi-view-studyo
  ├── 9. Sınav & Sertifika            → #akademi-view-sinav
  ├── 10. Hoca Paneli                 → #akademi-view-hoca
  ├── 11. Kaynaklar & Sözlük          → #akademi-view-sozluk
  └── 12. Ayarlar & Gizlilik          → #akademi-view-ayarlar
```

---

## 3. MEVCUT BİLEŞENLERİN ENTEGRASYONU

1. **EveryAyah & Kurrâ Entegrasyonu:**
   `tilavet_engine.js` içindeki `getAyahAudioUrl()` mekanizması, Dinleme Salonu ve Ders örneklerinde doğrudan kullanılacak; Mısır ekolü (Minşâvî, Husarî, Abdülbâsıt) ve Suudi ekolü kâriler dinamik olarak beslenecektir.
2. **Kelime & Âyet Seçimi:**
   Kullanıcı bir derste "Âyet Uygulaması" yaptığında, `locateAndSelectSurahAyah(s, a)` fonksiyonu tetiklenerek Mushaf sekmesinde ilgili âyetin sayfasına tek tıkla geçiş imkânı sunulacaktır.
3. **Tecvid Renk Ailesi:**
   `style.css` içindeki `--tj-madd`, `--tj-ihfa`, `--tj-kalkale`, `--tj-lafz`, `--tj-iklab`, `--tj-vakif` CSS değişkenleri, interaktif Elif-Ba ve Tecvid Okulu'nda birebir kullanılacaktır.
4. **HUD Telemetrisi:**
   Akademi sekmesine geçildiğinde üst header telemetrisinde aktif ders/makam ve günlük pratik dakikası gösterilecektir.

---

## 4. VERİ İÇE AKTARMA (ETL) VE YEREL VERİ PLANI

- **Mevcut Veriler:** Projede zaten mevcut olan 114 sûre bilgisi, 604 sayfa başlangıç ayetleri ve EveryAyah ses CDN yolları doğrudan çekilecektir.
- **Makam & Ses Verileri:** Özel çekim kayıtları tamamlanana kadar (Katman B), EveryAyah üzerindeki klasik kurrâ kayıtları (Minşâvî - Bayâtî/Rast, Mustafa İsmail - Hicaz/Segâh vb.) ve açık kaynak tecvid sesleri `needsReview: true` olarak eşlenecektir.
- **Web Audio Sentezi:** Piyano ve karar perdesi drone sesleri tarayıcı içinde Web Audio API harmonik osilatörüyle sıfır dosya boyutuyla dinamik olarak sentezlenecektir.
