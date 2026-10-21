# Arayüz v5 — Değişiklik Notu (21 Ekim 2026)

Referanslar: **Quran.com/tr** (iskelet, okuma, palet yapısı), **Brilliant** (ders akışı, sekme hapları, düğmeler), **Headspace** (ikonlar, açılır pencereler, hareket).
Ana renk: zümrüt `#0f6b4f` + altın vurgu `#e2af56`. Yazı tipleri: Figtree (arayüz), Newsreader (başlık ve meal), Amiri Quran / Amiri (Arapça).
Temalar: Aydınlık, Sepya (okuma tonu) ve Karanlık. Tema düğmesi bu üçü arasında döner.

## Dosyalar

| Dosya | Durum | Ne değişti |
|---|---|---|
| `kimatik_lab/ui-v5.css` | yeni | Tasarım sisteminin tamamı: jetonlar, 3 tema, kabuk, Mushaf, İnceleme, Âyet bul, Akademi'nin 12 bölümü ve alt sekmeleri. En son yüklenir, tüm kurallar `#v5` altındadır. |
| `kimatik_lab/ui-v5.js` | yeni | Yalnızca görünüm: ikonlar, mobil âyet paneli, okuma ayarları düğmesi, başlık araması, açılır pencere perdesi, düğmelerdeki emoji temizliği. İş mantığına dokunmaz. |
| `kimatik_lab/design-system.js` | güncellendi | Tema seçimi 2'li yerine 3'lü (sepya = `data-theme="light"` + `data-tone="sepia"`, eski aydınlık kurallar da geçerli kalır). |
| `kimatik_lab/index.html` | güncellendi | `<body id="v5">`, yeni yazı tipleri, `ui-v5.css`/`ui-v5.js` bağlantıları, marka işareti, SVG menü ikonları, Fem-i muhsin notu, "Âyet bul" penceresi metinleri. |
| `kimatik_lab/inceleme.html` | güncellendi | Aynı katman ayrı İnceleme sayfasına da bağlandı. |

Eski CSS dosyaları (`style.css`, `tilavet_akademi.css`, `design-system.css`, `ses_lab_v4.css`) silinmedi. Eski renk değişkenleri yeni jetonlara bağlandı. Yedek: `_tasarim_yedek_2026-10-21/`.

## Kaldırılan / gizlenen / taşınan öğeler

Arayüz öğeleri DOM'dan silinmedi, CSS ile gizlendi. JS'in kullandığı tüm `id` ve `data-*` adları korundu. Dinî ve eğitsel içerikte değişiklik yok.

- **Başlık:** Mikrofon, kârî, sayfa, dönem ve kapsam rozetleri gizlendi (aynı bilgi araç çubuğunda ve kartlarda var). Yerine arama kutusu geldi.
- **Sol menü:** "Çalışma alanı" başlığı, sayaç rozetleri ("604 S." vb.), "Beni Bul" kartı (başlık aramasıyla aynı) ve sürüm yazısı kaldırıldı.
- **Mushaf:** Tanıtım bloğu ("Oku, dinle, üzerinde düşün") ve araç çubuğundaki "Âyet İnceleme" düğmesi (yan paneldeki ile aynı) kaldırıldı. "Hata Algılama Test Simülatörü" gizlendi (geliştirici aracı). Meal okunuştan önceye taşındı.
- **İnceleme:** "Şu an inceleniyor" kutusu ve başlıktaki âyet rozeti kaldırıldı (âyet kart başlığında yazıyor). Kayıt bulunmayan "Kıssa" ve "Tefsir Meclisi" bölümleri iki boş kart yerine yan yana sessiz not olarak gösteriliyor.
- **Akademi:** Tanıtım başlığı yalnız "Yolculuğum"da gösteriliyor. "Hoca rehberliğiyle..." notu ve çekmecedeki "Cymatique v3 · Atölye" yazısı kaldırıldı. Düğme ve sekmelerdeki emojiler temizlendi. Asistan konularındaki "undefined" yazısı temizlendi (veri hatası; kaynağı `tilavet_akademi_engine.js` içinde ikon alanı).

## Ekran boyutuna özel çözümler

- **Telefon:** Âyet paneli alttan açılan panel (kapalıyken mini oynatıcı). Kârî ve yazı boyutu "ayarlar" düğmesinin arkasında. Sekme şeritleri yatay kayar. Elifba harfleri iki sıralı kaydırmalı şerit, ayrıntı hemen altında. "Âyet bul" tam ekran. Tablolar kendi içinde kayar.
- **Tablet:** Tek sütun Mushaf + alttan panel, sol menü yerine alt gezinti.
- **Dizüstü:** Sol menü yalnız ikon, Mushaf + 320 px panel.
- **Masaüstü / geniş ekran:** Tam menü, okuma genişliği 760 px ile sınırlı.

## Bilinen eksikler

- Mushaf, meal ve ses verileri dış API'lerden geliyor. Önizleme bu verilerle test edildi ama ses çalma ve mikrofon gerçek cihazda denenmedi.
- Ses Laboratuvarı'ndaki grafikler (canvas) kendi koyu zeminini JS ile çiziyor; açık temada da koyu görünür.
- Eski CSS dosyalarındaki ölü kurallar temizlenmedi. Bir sonraki adımda `ui-v5.css` eski dosyaların yerini tamamen alacak şekilde sadeleştirilebilir.
