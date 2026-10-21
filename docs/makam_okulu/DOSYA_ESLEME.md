# 🗺️ MAKAM OKULU v3 — DOSYA VE MODÜL EŞLEME TABLOSU (DOSYA_ESLEME.md)

> **Doküman Kodu:** `ESLEME-MAKAM-OKULU-2026-V3`  
> **Kural:** Blueprint veya rapor ile repo arasında dosya adı çelişirse repo kazanır. Aşağıdaki tablo, mantıksal mimari ile fiziksel disk konumları arasındaki kesin bağıntıyı gösterir.

---

## 1. Mimari Bileşen Eşleme Tablosu

| Blueprint / Hedef Mantıksal Yol | Fiziksel Repo Konumu | Açıklama / Rol |
|:---|:---|:---|
| `data/makamlar.json` | `makam_okulu/data/makamlar.json` | Tek doğruluk kaynağı makam nazariyatı (53-koma, tam diziler, motifler) |
| `data/kayitlar.json` | `makam_okulu/data/kayitlar.json` | 40 kayıt kataloğu + kanıt katmanı ve güven seviyesi |
| `data/sozluk.json` | `makam_okulu/data/sozluk.json` | Makam ve musiki terimleri sözlüğü |
| `audio/tuning.js` | `makam_okulu/audio/tuning.js` | Saf matematik motoru: 53-koma, cent, Hz, perde eşleme |
| `audio/audio_hub.js` | `makam_okulu/audio/audio_hub.js` | AudioContext yaşam döngüsü, master gain, tek ses kaynağı kuralı |
| `audio/instruments.js` | `makam_okulu/audio/instruments.js` | Drone synthesizer, tanbur mızrabı, ney, sürekli ton osilatörleri |
| `audio/scheduler.js` | `makam_okulu/audio/scheduler.js` | `currentTime` tabanlı mikrotonal dizi ve motif çalıcı (jitter-free) |
| `audio/pitch_yin.js` | `makam_okulu/audio/pitch_yin.js` | YIN algoritması mikrofon perde tespiti (F0 analizi) |
| `ui/makam_okulu.js` | `makam_okulu/ui/makam_okulu.js` | Modern UI kontrolörü (XSS-safe DOM, sekme gezintisi) |
| `ui/makam_okulu.css` | `makam_okulu/ui/makam_okulu.css` | Obsidyen & Altın v3, WCAG 2.2 AA, responsive CSS |
| `compat/legacy_bridge.js` | `makam_okulu/compat/legacy_bridge.js` | Eski global bağımlılıkları (`window.*`) izole eden güvenli köprü |
| `tools/validate_makam_data.mjs` | `makam_okulu/tools/validate_makam_data.mjs` | Makam nazariyat verisi doğrulama aracı |
| `tools/validate_recordings.mjs` | `makam_okulu/tools/validate_recordings.mjs` | Kayıt kataloğu doğrulama aracı |
| `tools/audit_urls.mjs` | `makam_okulu/tools/audit_urls.mjs` | EveryAyah ses URL'leri HTTP HEAD denetleyicisi |
| `tests/tuning.test.mjs` | `makam_okulu/tests/tuning.test.mjs` | `audio/tuning.js` birim testleri (node:test) |

---

## 2. Mevcut Vanilla & React Dosyaları Eşlemesi

| Mevcut Kod / Dosya | Dosya Yolu | Durum ve v3 Dönüşüm Planı |
|:---|:---|:---|
| `tilavet_akademi_data.js` | `kimatik_lab/tilavet_akademi_data.js` | İçindeki eski `makamlar` dizisi (`kararFreq`, `scale[].cents`) Faz 1'de yeni `makamlar.json`'dan beslenecek şekilde güncellenir. |
| `tilavet_akademi_engine.js` | `kimatik_lab/tilavet_akademi_engine.js` | `renderMakamView()` nazariyat, kaynak/inceleme durumu, çoklu kâri örnekleri ve makama göre geçki navigasyonunu sunar. Teori JSON'u yüklenirken örnek kataloğu korunarak birleştirilir. |
| `tilavet_audio_lab.js` | `kimatik_lab/tilavet_audio_lab.js` | `DroneSynthesizer` içindeki yarış durumu (A-02) ve format filtreleri Faz 3'te düzeltilir. |
| `tilavet_akademi.css` | `kimatik_lab/tilavet_akademi.css` | Makam Okulu bölümü responsive ve erişilebilir hale getirilir; `makam_okulu.css` ile modülerleştirilir. |
| `index.html` | `kimatik_lab/index.html` | Makam Okulu görünüm kapsülü (`#akademi-view-makam`). |
| React `tuning.ts` | `src/tilavet/core/makam/tuning.ts` | Saf `tuning.js` üzerine ince tip sarmalayıcıya dönüştürülür. |
| React Makam JSON'ları | `src/tilavet/data/makam/*.json` | Dağınık JSON dosyaları tek kaynak `data/makamlar.json` ile senkronize edilir. |

---

## 3. Web Sunucusu ve Çalışma Yolu Bağlantısı

Yerel sunucu (`python -m http.server 8000`) `kimatik_lab/` kök dizininde çalışmaktadır.  
Makam Okulu modülünün hem kök dizinden Node testleri tarafından çalıştırılabilmesi hem de tarayıcı tarafından `http://localhost:8000/makam_okulu/` yolundan doğrudan yüklenebilmesi için:
- **Fiziksel Konum:** `makam_okulu/`
- **Junction Bağlantısı:** `kimatik_lab/makam_okulu` -> `makam_okulu`
Bu sayede çift kopya tutulmadan tek kaynak ilkesi korunmuştur.

## 4. Makam Okulu örnekleri ve inceleme durumu

`kimatik_lab/data/tilavet/makamlar.json` makam nazariyatı, kaynak ve inceleme metaverisini taşır. `kimatik_lab/tilavet_akademi_data.js` ise mevcut âyet/kâri ses örneklerini sağlar. Uygulama, harici nazariyat verisi yüklendiğinde bu iki kaydı makam kimliği üzerinden birleştirir; nazariyat kaydı örnek listesini içermiyorsa mevcut örnekler silinmez.

Ekrandaki kaynak bağlantıları nazariyat verisinin dayanaklarını gösterir. `needsReview` ve `confidence` alanları inceleme durumunu açıklar; ses örnekleri veya tahlil notları uzman onayı gibi sunulmaz. Her makamın örnekleri kâriye göre filtrelenebilir, geçki kartları da hedef makam ekranına doğrudan geçiş sağlar.
