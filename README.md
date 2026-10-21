# 📖 TİLAVET AKADEMİSİ — KUR’AN TİLAVETİ, MAKAMLAR VE SES EĞİTİMİ EKOSİSTEMİ

> **Kapsamlı ve Profesyonel Dijital Kur'an ve Tilavet Atölyesi**  
> *Kur'an-ı Kerim Keşfi • Tecvid Okulu • 10 Makam Nazariyatı • Mahreç Atlası • Canlı Ses Analizi (YIN & DTW) • Diyafram Nefes Koçu • Aşere-i Mütevâtire Kıraat Kataloğu • Pedagojik Yapay Zekâ Asistanı*

---

## 🌟 PROJENİN AMACI VE FELSEFESİ

Tilavet Akademisi; Kur'an tilavetini dinleme, anlama ve doğru usullerle icra etme sürecini destekleyen, doğrulanmış akademik ve dini kaynaklar ile modern dijital ses işleme (DSP) teknolojilerini bir araya getiren bütünleşik bir eğitim ekosistemidir.

### 🛡️ Temel Dini ve İlmi İlkeler:
1. **Canlı Fem-i Muhsin Şartı:** Bu platformdaki tüm araçlar tamamlayıcıdır; ehil bir kıraat hocasının canlı tedrisatının yerini tutamaz.
2. **Tecvidin Önceliği:** Makam ve musiki, harflerin mahreç ve sıfatlarına tâbidir. Tecvidi bozan hiçbir nağme veya makam icrası caiz kabul edilemez.
3. **Kıraat ile Makam Ayrımı:** Kıraat ve rivayetler vahyî ve tevatürle sabit okuyuşlardır; makam ise insan sesinin geleneksel estetik icrasıdır.
4. **Sertifika İcazet Değildir:** Modül sonlarında üretilen başarı belgeleri uygulama içi pedagojik motivasyon kaydıdır; şer'î kıraat icazeti değildir.
5. **Ses Gizliliği (Zero Raw Audio Retention):** Kullanıcının ham ses kayıtları hiçbir zaman sunucuda saklanmaz; yalnızca tarayıcı üzerinde yerel işlenir. Sunucuya yalnızca matematiksel analiz özetleri kaydedilir.

---

## 🚀 MODÜLLER VE ÖZELLİKLER

| Modül | Açıklama |
|---|---|
| **1. Kur'an Keşfi ve Okuma** | Sure/ayet arama, Uthmani Mushaf metni, ayet ve sure bazında oynatma, döngü (`loop`), tekrar ve bekleme aralığı (`gap`). |
| **2. Dinleme Salonu** | Minşâvî, Husarî, Abdülbâsit, Mustafa İsmâil ve Afâsî'den kelime senkronlu tilavet akışı; perde korumalı hız kontrolü. |
| **3. Makam Akademisi** | 10 Makam (Rast, Bayatî, Hicaz, Sabâ, Segâh, Hüseynî, Uşşak, Nihavent, Kürdî, Acemaşîran) 53-koma AEU cetvelleri, piyano klavyesi ve karar sesi drone sentezleyicisi. |
| **4. Tecvid Okulu** | İzhâr, İdğâm, İklâb, İhfâ, Medd hükümleri, Kalkale, Râ, Lafzatullah, Lahn-ı Celî & Hafî atlası; Canlı Mushaf tecvid vurgusu. |
| **5. Mahreç Laboratuvarı** | 28 Arap harfinin anatomik mahreç atlası, harf sıfatları, benzer harfler (minimal pairs) kulak eğitimi testi. |
| **6. Şan ve Ses Eğitimi** | Diyafram 4-4-8 ritmik nefes koçu animasyonu, 5/10 dk vokal ısınma rutinleri, ses aralığı testi (`vocalRange`). |
| **7. Pratik Stüdyosu** | Web Audio YIN algoritması ile canlı F0 perde ibresi, HTML5 Canvas perde eğrisi, akustik elif sayacı, Sakoe-Chiba DTW karşılaştırması. |
| **8. Kıraat & Rivayet** | Aşere-i Mütevâtire (10 İmam ve 20 Râvisi) tam kataloğu, Hafs vs Verş vs Kālûn usûl mukayese matrisi. |
| **9. Kişisel Çalışma Planı** | SüperMemo SM-2 aralıklı tekrar kuyruğu, günlük streak sayacı, seviye ilerleme yüzdesi. |
| **10. Sınav ve Belgeler** | Çoktan seçmeli ve dinlemeli sınavlar, yüksek çözünürlüklü dijital başarı belgesi üretimi ve PNG indirme. |
| **11. Hoca Paneli** | Sınıf açma, davet kodu yönetimi, ödev atama ve talebe analizi izleme ekranı. |
| **12. Tilavet Asistanı** | Teolojik güvenlik çitli (guardrails) pedagojik yapay zekâ rehberi. |
| **13. Terimler Sözlüğü** | 40 temel kıraat ve tecvid teriminin ansiklopedik açıklaması. |
| **14. Ayarlar ve Gizlilik** | Yazı boyutu, tema (aydınlık/karanlık), tecvid renkleri, tuning seçimi, KVKK/GDPR "Tüm Verilerimi Sil" seçeneği. |

---

## 🛠️ TEKNİK MİMARİ VE YIĞIN

- **Çalışan web arayüzü:** `kimatik_lab/` altında bağımsız HTML, CSS ve JavaScript uygulaması.
- **TypeScript uygulama katmanı:** `src/tilavet/` içinde React 18 ve React Router tabanlı modüller; mevcut paket yapılandırmasında Vite istemci derleyicisi bulunmuyor.
- **Stil & Tasarım:** Obsidyen Zümrüt & Altın CSS jetonları; duyarlı arayüz hedefi.
- **Sunucu & API:** Node.js, Express, Zod doğrulama ve rate limiting (`npm start`).
- **Veritabanı:** PostgreSQL (`db/migrations/` altındaki şemalar).
- **Doğrulama:** Vitest otomatik testleri ve `tsc --noEmit` tip denetimi (`npm test`, `npm run typecheck`). Test sayısı ve geçme durumu çalışma anındaki sonuçlara göre değerlendirilmelidir.

---

## 📦 KURULUM VE ÇALIŞTIRMA

### 1. Bağımlılıkların Yüklenmesi
```bash
npm install
```

### 2. Tip Denetimi ve Testlerin Çalıştırılması
```bash
# TypeScript tip kontrolü (0 hata garantisi)
npx tsc --noEmit

# Vitest test paketlerini çalıştırma
npx vitest run
```

### 3. Uygulamayı Başlatma
- **Hızlı Başlatıcı (Windows):** `baslat.bat` çift tıklanarak doğrudan başlatılabilir.
- **Yerel Geliştirici Sunucusu:**
  ```bash
  # Web arayüzü
  cd kimatik_lab
  python -m http.server 8000
  # Tarayıcıda: http://localhost:8000/
  ```

---

## 📚 PROJE DOKÜMANTASYON İNDEKSİ

Proje kararları, teknik notlar ve doğrulama planı `docs/` klasöründedir:
- [`docs/PRODUCT_SPEC.md`](./docs/PRODUCT_SPEC.md): Ürün vizyonu ve modül şartnamesi.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md): Mimari, ses hattı ve veri akışı.
- [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md): Tasarım jetonları, tipografi ve erişilebilirlik.
- [`docs/CONTENT_STANDARDS.md`](./docs/CONTENT_STANDARDS.md): Ders, makam, sınav ve içerik inceleme standartları.
- [`docs/TEST_PLAN.md`](./docs/TEST_PLAN.md): Kalite güvence senaryoları.
- [`docs/ROADMAP.md`](./docs/ROADMAP.md): Fazlar ve öncelik matrisi.
- [`docs/SOURCES.md`](./docs/SOURCES.md): Kaynakça.
- [`docs/tilavet/ILERLEME.md`](./docs/tilavet/ILERLEME.md): Geliştirme günlüğü.
