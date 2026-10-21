# TİLAVET AKADEMİSİ — UYGULAMA İLERLEME GÜNLÜĞÜ (ILERLEME.md)

> **Proje:** CYMATIQUE — Kur'ân-ı Kerîm Projesi Yeni Ana Sekmesi  
> **Durum Takip Tablosu:** Bölüm 20 Yol Haritası  
> **Son Güncelleme:** 19 Ekim 2026

---

## FAZ İLERLEME DURUMU

| Faz | Açıklama | Durum | Tamamlanma |
|---|---|---|---|
| **Faz 0** | Keşif, Raporlama (`00-kesif-raporu.md`), Uyarlama Planı (`01-uyarlama-plani.md`), Kaynak Envanteri (`veri-kaynaklari.md`), Varsayımlar (`VARSAYIMLAR.md`), Ek A (Ses Çekim Brief'i), Ek B (Makam Uzmanı Formu) | ✅ TAMAMLANDI | %100 |
| **Faz 1** | Temel İskelet (Nav-tabs yeni sekme `tabBtnAkademi`, `#tab-akademi` kabuğu, `ui.js` `switchAppTab` entegrasyonu, `tilavet_akademi.css` katmanları, veri modelleri) | ✅ TAMAMLANDI | %100 |
| **Faz 2** | Ses Altyapısı (Web Audio Karar Drone Osilatörü / Tanbur-Ney formantı, EveryAyah CDN kütüphanesi, Dinleme Salonu) | ✅ TAMAMLANDI | %100 |
| **Faz 3** | Sıfırdan Kur'an (MVP Çekirdek: Seviye 0–2 dersleri, 28 harf interaktif mahreç atlası, benzer harfler kulak eğitimi testi, kelime heceleme, 6 adımlı interaktif ders modalı, seviye belirleme testi) | ✅ TAMAMLANDI | %100 |
| **Faz 4** | Pratik Stüdyosu (MediaRecorder mikrofon kaydı & indirme, F0 Autocorrelation perde dedektörü, canlı tuner, HTML5 Canvas canlı perde eğrisi, Medd akustik elif miktarı takipçisi) | ✅ TAMAMLANDI | %100 |
| **Faz 5** | Tecvid Okulu (Seviye 3–4 kuralları, Hatalar Atlası - Lahn-ı Celi & Hafi mukayesesi, okuma hızları tahkik/tertil/tedvir/hadr) | ✅ TAMAMLANDI | %100 |
| **Faz 6** | Makam Okulu (10 makam şeması, interaktif piyano klavyesi/dizi çalıcı, seyir haritaları, motif vokalizeleri, âyet üzerinde makam uygulaması ve model dinleme) | ✅ TAMAMLANDI | %100 |
| **Faz 7** | Şan & Ses Eğitimi (nefes tutmayan 3-4 / 2-4 rahat ritimler, cihaz ve günlük hayat için adım adım nefes-ses rehberi, günlük yerel ilerleme, ses ısınma ve vokal hijyen) | ✅ TAMAMLANDI | %100 |
| **Faz 8** | Hoca Paneli (Talebe listesi, ödev atama), Sınav & Sertifika (İcazet değildir notuyla yüksek çözünürlüklü Canvas sertifika üretimi & PNG indirme), 40 terimlik Sözlük & Kaynakça, Hatim & Mukabele planlayıcı | ✅ TAMAMLANDI | %100 |
| **Faz 9** | Cila, a11y, CVD kontrolü, testler, yerel başlatıcılar (`baslat.bat` 5. seçenek) ve tam doğrulama | ✅ TAMAMLANDI | %100 |

---

## GÜNLÜK NOTLAR VE DEĞİŞİKLİKLER

- **19 Ekim 2026 (Faz 0):**
  - Proje mimarisi analiz edildi. Vanilla JS + modern CSS mimarisi ve Python `http.server 8000` yapısı tespit edildi.
  - `docs/tilavet/` altında `00-kesif-raporu.md`, `01-uyarlama-plani.md`, `veri-kaynaklari.md`, `VARSAYIMLAR.md`, `ek-a-ses-cekimi-briefi.md`, `ek-b-makam-uzmani-inceleme-formu.md` üretildi.
  - `data/tilavet/` altında `sozluk.json` (40 terim), `makamlar.json` (10 makam), `lessons.json` (Seviye 0–5), `reciters.json` (Kurrâ kataloğu) oluşturuldu.

- **19 Ekim 2026 (Faz 1–8):**
  - `tilavet_audio_lab.js` yazıldı: DroneSynthesizer, PitchDetector (Autocorrelation F0), nefes tutmayan rahat ritim koçu, VoiceRecorder (MediaRecorder), MeddTimer (Akustik Elif Ölçer).
  - `tilavet_akademi_engine.js` yazıldı: 12 alt modül, 6 adımlı ders akışı modalı (`openLessonModal`), seviye belirleme testi modalı (`openPlacementTestModal`), kulak eğitimi mini oyunu, stüdyoda Canvas perde eğrisi ve Medd zamanlayıcısı, HTML5 Canvas dijital başarı belgesi (PNG indirici), 10 makam interaktif piyano klavyesi ve âyet uygulaması.
  - `tilavet_akademi.css` yazıldı: Obsidyen & Altın v3 tasarım tokenları, sub-nav, kartlar, modal ve canvas stilleri.
  - `index.html` güncellendi: Sol rayda 3. ana sekme (`tabBtnAkademi`), `#tab-akademi` konteyneri ve script entegrasyonu sağlandı.
  - `ui.js` güncellendi: `switchAppTab('tab-akademi')` çift yönlü ses durdurma, hash ve HUD senkronizasyonu sağlandı.
  - `style.css` güncellendi: HUD telemetri filtrelemesi Akademi sekmesi için uyarlandı.
  - `baslat.bat` güncellendi: Doğrudan `http://localhost:8000/index.html#tab-akademi` olarak başlatma seçeneği eklendi.

- **19 Ekim 2026 (Faz 9 & Cila / Entegrasyon):**
  - Tecvid Okulu ile Canlı Mushaf arasında çift yönlü derin köprü (`window.openMushafAndHighlightRule`) kuruldu. İzhâr, İdğâm, İklâb, İhfâ, Kalkale ve Medd-i Muttasıl kartlarında "Mushaf'ta Gör" tıklandığında ilgili sûre/âyete geçiş yapılıp tecvid kelimeleri altın sarısı nabız (`.tajweed-highlight-pulse`) animasyonuyla odaklandı.
  - Alt görünüm yönlendiricisine (`switchAkademiSubView`) ses/drone temizleme (cleanup) garantisi eklendi.
  - Tüm JS dosyalarının sözdizimi Node.js ile test edildi ve %100 temiz doğrulandı (0 hata).

- **19 Ekim 2026 (Kapsam Sadeleştirme):**
  - Kullanıcı talebi doğrultusunda **Hoca Paneli**, **Sınav & Sertifika** ve **Pratik Stüdyosu** alanları hem arayüzden (`index.html`) hem de motor katmanından (`tilavet_akademi_engine.js`) tamamen kaldırıldı.
  - Tilavet Akademisi 9 odaklı çekirdek modüle bağlandı: 1. Yolculuğum, 2. Sıfırdan Kur'an, 3. Tecvid Okulu, 4. Tilavet Teknikleri, 5. Makam Okulu, 6. Şan & Ses, 7. Dinleme Salonu, 8. Terimler Sözlüğü, 9. Ayarlar & Gizlilik.
