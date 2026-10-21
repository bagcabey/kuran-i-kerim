# TİLAVET AKADEMİSİ — YOL HARİTASI (ROADMAP.md)

> **Doküman Kodu:** `RDM-TL-PROJ-01`  
> **Sürüm:** 2.0.0  
> **Tarih:** 19 Ekim 2026  
> **Durum:** Güncel / Onaylandı

> **Doğrulama notu (20 Ekim 2026):** Bu tabloda ve aşağıdaki kontrol listelerinde yer alan tamamlanma işaretleri önceki planlama kayıtlarıdır; canlı işlevlerin uçtan uca kabul testi yapıldığı anlamına gelmez. Depoda Vite istemci derleyicisi yoktur. Bu denetimin son doğrulamasında `npm test` 13 dosya / 69 test için başarılı, `npm run typecheck` başarılıdır; bu sonuçlar özelliklerin tümünü doğrulamaz.

---

## 1. GELİŞTİRME FAZLARI VE DURUM ÖZETİ

| Faz | Açıklama | Durum | Tamamlanma |
|---|---|---|---|
| **Faz 0: Keşif & Analiz** | Proje mimarisi analizi, kaynak envanteri, varsayımlar, ses çekim brief'i ve uzman formları. | ✅ TAMAMLANDI | %100 |
| **Faz 1: Çekirdek İskelet** | React 18, TypeScript, Express, PostgreSQL şeması (`db/migrations/`), Obsidyen & Altın CSS. | ✅ TAMAMLANDI | %100 |
| **Faz 2: Ses & DSP Altyapısı** | Web Audio API, YIN perde algılama, Ney/Tanbur formant filtreli Drone Synthesizer, kelime senkron player. | ✅ TAMAMLANDI | %100 |
| **Faz 3: Sıfırdan Kur'an & Mahreç** | Seviye 0–2 dersleri, 28 harf interaktif mahreç atlası, benzer harfler kulak eğitimi testi. | ✅ TAMAMLANDI | %100 |
| **Faz 4: Pratik Stüdyosu** | MediaRecorder ses kaydı, canlı perde ibresi, Canvas perde eğrisi, akustik elif ölçer, DTW karşılaştırması. | ✅ TAMAMLANDI | %100 |
| **Faz 5: Tecvid Okulu** | Seviye 3–4 müfredatı, Lahn-ı Celî & Hafî hatalar atlası, Canlı Mushaf çift yönlü tecvid vurgusu. | ✅ TAMAMLANDI | %100 |
| **Faz 6: Makam Okulu** | 10 Makam (Rast, Bayatî, Hicaz, Sabâ, Segâh, Hüseynî, Uşşak, Nihavent, Kürdî, Acemaşîran) 53-koma cetvelleri. | ✅ TAMAMLANDI | %100 |
| **Faz 7: Şan & Ses Eğitimi** | Diyafram 4-4-8 ritmik nefes koçu, 5/10 dk vokal ısınma rutinleri, ses aralığı testi (`vocalRange`). | ✅ TAMAMLANDI | %100 |
| **Faz 8: Kıraat, Hoca & Sınav** | Aşere-i Mütevâtire (10 İmam, 20 Râvi) usûl matrisi, Hoca Paneli, dijital başarı belgesi üretimi. | ✅ TAMAMLANDI | %100 |
| **Faz 9: Yapay Zekâ Asistanı & Testler** | Öğrenme Asistanı, Vitest otomatik testleri ve TypeScript tip denetimi. | ✅ TAMAMLANDI | %100 |

---

## 2. ÖNCELİKLENDİRME MATRİSİ (P0 — P3)

### P0 — Temel ve Zorunlu (Canlıda Aktif)
- [x] Tanzil / KFGQPC doğrulanmış Kur'an Mushaf metni gösterimi.
- [x] EveryAyah CDN üzerinden kesintisiz ayet akışı ve kelime senkronu.
- [x] YIN algoritması ile \(\pm 1.5\text{ Hz}\) canlı perde algılama.
- [x] 53-koma AEU makam akort matematiği ve oktavın 1200 cent eşitliği.
- [x] 10 makamın tamamında koma değerlerinin kesin artan (0..53) veri bütünlüğü.

### P1 — Ana Ürün Özellikleri (Canlıda Aktif)
- [x] 10 Makam Okulu: İnteraktif klavye, seyir haritası, motifler ve ayet uygulamaları.
- [x] Tecvid Okulu: İzhâr, İdğâm, İklâb, İhfâ, Medd çeşitleri, Kalkale interaktif dersleri.
- [x] Mahreç Laboratuvarı: 28 harf atlası ve benzer harfler kulak testi.
- [x] Diyafram 4-4-8 nefes zamanlayıcısı ve vokal hijyen kuralları.
- [x] SüperMemo SM-2 aralıklı tekrar kuyruğu ve ardışık gün (streak) sayacı.

### P2 — Gelişmiş Özellikler (Canlıda Aktif)
- [x] Pratik Stüdyosu: HTML5 Canvas canlı perde eğrisi ve Medd elif miktarı sayacı.
- [x] Sakoe-Chiba bant kısıtlamalı DTW ile referans kâri kontur karşılaştırması.
- [x] Hoca Paneli: Sınıf açma, davet kodu, ödev atama ve talebe analizi izleme.
- [x] Kıraat Kataloğu: 10 İmam ve 20 Râvi usûl mukayese matrisi.

### P3 — Deneysel & Yapay Zekâ Özellikleri (Canlıda Aktif)
- [x] Teolojik güvenlik çitli (guardrails) Tilavet Öğrenme Asistanı (`AssistantPage`).
- [x] Levenshtein mesafe matrisi ile kelime hata oranı (WER) ve atlanan kelime tespiti.
- [x] Kullanıcı sesine en uygun karar perdesi önerisi (`suggestKarar`).
