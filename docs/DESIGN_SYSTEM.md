# TİLAVET AKADEMİSİ — TASARIM SİSTEMİ (DESIGN_SYSTEM.md)

> **Doküman Kodu:** `DS-TL-SPEC-01`  
> **Sürüm:** 2.0.0  
> **Tarih:** 19 Ekim 2026  
> **Durum:** Onaylandı / Üretim Standardı

---

## 1. GÖRSEL KİMLİK VE FELSEFE

Tilavet Akademisi tasarım dili; **Kur'an tilavetinin vakar ve huşûuna uygun, gözü yormayan, yüksek kontrastlı ve modern bir atölye deneyimi** sunar. Kur'an okuyucu ve akademi yüzeyleri açık ve koyu temada tek zümrüt-yeşil vurgu rengi kullanır; tecvid renkleri yalnızca kural anlamı taşıdıkları Mushaf alanlarında korunur.

Tasarım sistemi üç ana sütun üzerine oturur:
1. **Sakin Zemin:** Açık temada nötr yüzeyler (`#f5f7f4`, `#ffffff`); koyu temada derin yeşil-siyah yüzeyler (`#111914`, `#1a251d`).
2. **Zümrüt Yeşili (Emerald):** Açık temada `#216b50`, koyu temada `#7fbd9b`; ana aksiyonları, etkileşim ve öğrenme durumlarını belirtir.
3. **Anlam Renkleri:** Hata ve uyarılar kendi erişilebilir durum renklerini korur; Mushaf tecvid renkleri kural anlamını taşıdıkları için arayüz vurgularından ayrı tutulur.

---

## 2. RENK JETONLARI (COLOR TOKENS)

| Jeton Adı | CSS Değişkeni | Değer (Karanlık Tema) | Değer (Aydınlık Tema) | Kullanım Alanı |
|---|---|---|---|---|
| **Ana Arka Plan** | `--bg-primary` | `#111914` | `#f5f7f4` | Ekranın en alt zemin katmanı |
| **Yüzey Katmanı 1** | `--surface` | `#1a251d` | `#ffffff` | Kartlar, modüller, navigasyon paneli |
| **Yüzey Katmanı 2** | `--surface-2` | `#202c23` | `#f7f9f7` | İç içe kartlar, vurgulu bloklar |
| **Sınır Çizgisi** | `--tl-border` | `#2a3b30` | `#dce5dd` | Ayrım çizgileri ve kenarlıklar |
| **Birincil Vurgu** | `--accent-green` / `--accent-cyan` | `#7fbd9b` | `#216b50` | Butonlar, aktif sekmeler ve etkileşimler |
| **Tek Arayüz Vurgusu** | `--accent-gold` | `#7fbd9b` | `#216b50` | Eski bileşenlerle uyum için aynı vurgu rengine eşlenir |
| **Ana Metin** | `--text-main` | `#edf2ed` | `#243229` | Başlıklar ve gövde metinleri |
| **Soluk Metin** | `--text-soft` | `#c2cdc3` | `#43564a` | Açıklamalar, metaveriler ve dipnotlar |
| **Hata / Uyarı** | `--tl-danger` | `#ff8a73` | `#b3361f` | Perde sapması, yanlış cevap, uyarılar |

---

## 3. TİPOGRAFİ (TYPOGRAPHY)

### 3.1. Arapça Kur'an Metni
- **Font Ailesi:** `'Amiri Quran', 'Scheherazade New', 'Traditional Arabic', serif`
- **Satır Yüksekliği:** `2.0` (Harekelerin ve secavend işaretlerinin birbirine girmemesi için geniş satır aralığı zorunludur).
- **Yazı Boyutu:**
  - Ayet Görünümü: `1.85rem` (29.6px)
  - Kelime Vurgusu: `2.25rem` (36px)
  - İnceleme Modu: `2.6rem` (41.6px)

### 3.2. Arayüz ve Latin Metinler
- **Font Ailesi:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Hiyerarşi:**
  - H1 Başlık: `1.75rem` (28px), `font-weight: 700`
  - H2 Alt Başlık: `1.35rem` (21.6px), `font-weight: 600`
  - H3 Kart Başlığı: `1.1rem` (17.6px), `font-weight: 600`
  - Gövde (Body): `0.95rem` (15.2px), `line-height: 1.55`
  - Meta/Dipnot: `0.8rem` (12.8px), `color: var(--tl-text-dim)`

---

## 4. TEMEL BİLEŞENLER (ATOMIC COMPONENTS)

1. **Butonlar (`.tl-btn`):**
   - `.tl-btn`: Zümrüt dolgulu ana aksiyon butonu; dokunmatik kullanım için en az 44px yükseklik.
   - `.tl-btn--ghost`: Yüzey dolgusu olmayan, kenarlıklı yardımcı buton.
   - `.tl-btn--gold`: Aynı zümrüt dolgusunu kullanan uyumlu ikincil aksiyon butonu.
2. **Çipler (`.tl-chip`):**
   - Kategori etiketleri, makam perdeleri ve filtre seçimleri için 9999px yuvarlak hap butonlar.
3. **Kartlar (`.tl-card`):**
   - 16px yuvarlatılmış köşeler, 1px zarif sınır çizgisi, düşük kontrastlı derinlik gölgesi.
4. **Tuner İbresi (`.tl-tuner`):**
   - Canlı mikrofon perde takip ibresi; yeşil (merkez $\pm 10\text{ cent}$), sarı ($\pm 25\text{ cent}$), kırmızı ($> 25\text{ cent}$).
5. **Ses Oynatıcı Barı (`.tl-player`):**
   - Sabit alt panel, ayet bilgisi, oynat/duraklat, döngü, tekrar sayısı ve perde korumalı hız seçici.

---

## 5. DUYARLI TASARIM VE ERİŞİLEBİLİRLİK (WCAG 2.1 AA)

- **Kırılma Noktaları (Breakpoints):**
  - Mobil: `≤ 800px` (Tek sütun okuma akışı, sabit alt gezinme ve dokunmaya uygun kontroller).
  - Tablet: `801px - 1200px` (Kompakt modül rayı ve Mushaf/okuma paneli için iki sütun).
  - Masaüstü: `> 1200px` (Geniş modül rayı ve çift panelli okuma düzeni).
- Ana uygulamada masaüstü modül rayı kullanılır; mobilde dört hedefli sabit alt gezinmeye geçilir. Ayrı âyet inceleme ekranında dar genişliklerde tekrarlanan üst bilgi sadeleştirilir, keşif kısayolları kendi satırında yatay kaydırılır. Taşan Akademi ve keşif menülerinde açık temada ince, görünür kaydırma çubukları kullanılır; mobilde doğal yatay dokunma kaydırması korunur.
- **Erişilebilirlik:**
  - Kontrast oranı: Metin/zemin minimum $4.5:1$, başlıklar için $7:1$.
  - Odak göstergeleri: Klavyeyle gezinmede görünür, zümrüt odak halkası (`outline: 3px solid var(--tl-focus)`).
  - Ekran okuyucu uyumu: Tüm buton ve sekmelerde geçerli `aria-label`, `aria-selected` ve `role="tab"`.
  - Hareket azaltma tercihi: Kullanıcının `prefers-reduced-motion` sistem ayarı desteklenir.

## 6. UYGULAMA YÜZEYLERİ

- `kimatik_lab/design-system.css` ve `kimatik_lab/design-system.js`, Mushaf, âyet inceleme, tefsir ve ses/akademi modüllerinde ortak sayfa düzenini, duyarlı gezinmeyi ve açık/koyu temayı uygular.
- Masaüstünde sol modül menüsü, mobilde güvenli ekran alanlarını gözeten sabit alt gezinme kullanılır. Mobil okuyucuda Mushaf sayfası ve seçili âyetin okuma paneli tek sütunda sunulur; “Bir âyet bulun” girişi arama panelini açar.
- Akademi modüllerinde kartlar, formlar ve metin renkleri açık/koyu temaya göre uyarlanır; ses analiz grafikleri ve piyano tuşları gibi koyu çalışma yüzeyleri kontrastını korur.
- Dekoratif arka plan gradyanları ve metin yerine kullanılan süs ikonları kullanılmaz; butonların hover, focus ve seçili durumları aynı zümrüt vurgu ve düz yüzey dilini izler. Oynatma ve uyarı gibi doğrudan anlam taşıyan işaretler korunur.
- Açık temada seçili filtreler, stüdyo kontrolleri ve hata/vasl açıklama kartları kendi yüzeyleriyle yeterli metin kontrastı sağlayacak şekilde eşleştirilir.
- Elifba harf ve seçenek ızgaraları dar ekranlarda sütunlarını küçültür; açık temadaki eğitim kartları ile hover, focus ve seçili durumları aynı yüksek kontrastlı yüzey tokenlarını kullanır.
- Dokunmatik işaretleyicilerde eğitim kartlarının hover yükselmesi ve gölgesi sıfırlanır; uzun heceleme başlıkları satıra geçebilir ve harf etiketleri kelime içinden bölünmez.
- Tilavet hızı örnek ve tecvid vurguları yapılandırılmış kayıtların metin etiketleriyle gösterilir; geçersiz değerler güvenli metinlerle değiştirilir, nesne gösterimi yapılmaz.
- `src/tilavet/styles/tilavet.css`, React tabanlı ders, makam, dinleme, sınav ve ayar ekranlarında açık/koyu tema tokenlarını sağlar.
