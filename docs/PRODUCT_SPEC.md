# TİLAVET AKADEMİSİ — ÜRÜN ŞARTNAMESİ (PRODUCT_SPEC.md)

> **Doküman Kodu:** `SPEC-TL-PROD-01`  
> **Sürüm:** 2.0.0  
> **Tarih:** 19 Ekim 2026  
> **Durum:** Onaylandı / Üretim Standardı

---

## 1. ÜRÜN VİZYONU VE TEMEL İLKE

**Tilavet Akademisi**; Kur’an-ı Kerim tilaveti, tecvid hükümleri, kıraat ve rivayetler, makam nazariyatı, ses ve nefes eğitimi ile canlı ses analizini tek bir çatıda birleştiren, bilimsel ve dinî doğrulanabilirliği en üst düzeyde tutulmuş profesyonel bir dijital eğitim ekosistemidir.

Bu platform; sıradan bir ses oynatıcı veya birkaç makam kartından ibaret bir web sitesi değildir. Kullanıcının tilaveti dinleyebildiği, usta kurrâ okuyuşlarını kelime düzeyinde inceleyebildiği, 53-koma AEU sistemiyle makamları işitsel ve teorik olarak öğrenebildiği, YIN algoritması ve DTW karşılaştırmasıyla sesini analiz edebildiği ve eğitmeniyle birlikte gelişimini takip edebildiği yaşayan bir atölyedir.

### Temel Dini ve İlmi Kırmızı Çizgiler:
1. **Hocanın Yerine Geçmez:** Canlı bir fem-i muhsin (ehil hoca) tedrisatının yerini hiçbir yapay zekâ veya algoritma alamaz. Uygulama bir yardımcı ve pekiştirici çalışma aracıdır.
2. **Tecvid Makamdan Önceliklidir:** Tilavette harflerin sıfatları, mahreçleri ve tecvid hükümleri daima musiki kurallarından önceliklidir. Harfi veya manayı bozan nağme kesinlikle caiz değildir.
3. **Kıraat ile Makam Ayrımı:** Kıraat ve rivayetler vahyî ve tevatürle sabit okuyuşlardır; makam ise insan sesinin geleneksel estetik icrasıdır. İkisi asla birbirine karıştırılamaz.
4. **Sertifika İcazet Değildir:** Modül sonu sınavları ve başarı belgeleri yalnızca uygulama içi öğrenme kaydıdır; şer'î kıraat icazeti teşkil etmez.
5. **Ses Gizliliği (Zero Raw Audio Retention):** Kullanıcının ham ses kayıtları sunucuda saklanmaz; yalnızca tarayıcı üzerinde işlenir ve sunucuya sadece matematiksel analiz özetleri (WER, perde sapması, cent farkı) gönderilir.

---

## 2. HEDEF KULLANICI PROFİLLERİ

| Profil | Tanım | Temel İhtiyaçları | Platform Çözümü |
|---|---|---|---|
| **A. Yeni Başlayan** | Elifba ve temel harekeleri yeni öğrenen veya hiç bilmeyen kullanıcı. | Sade arayüz, harf mahreç çizimleri, yavaş dinleme, heceleme, temel başarı rozetleri. | Seviye 0–2 dersleri, 28 harflik interaktif mahreç atlası, benzer harfler kulak eğitimi testi, hece hece oynatıcı. |
| **B. Orta Seviye Öğrenci** | Kur'an okuyabilen fakat tecvid kurallarını pekiştirmek ve makamları tanımak isteyen. | Düzenli çalışma planı, kural örnekleri, ayet üzerinde tecvid vurgusu, makam kulağı. | Seviye 3–4 Tecvid Okulu, interaktif 10 makam klavyesi, karar sesi drone synthesizer, SM-2 aralıklı tekrar. |
| **C. İleri Seviye Öğrenci / Hâfız** | Makam geçişlerini (seyir), nefes hakimiyetini ve uzun tilavet dengesini geliştirmek isteyen. | Ses dalga biçimi, F0 perde eğrisi, referans kâri ile DTW kontur hizalama, akustik elif ölçer. | Pratik Stüdyosu, Medd-i Tabiî/Muttasıl/Lâzım akustik elif sayacı, YIN perde takipçisi, ses sınır testi. |
| **D. Eğitmen (Fem-i Muhsin)** | Talebelerini uzaktan takip etmek ve ödev vermek isteyen Kur'an kursu / medrese hocası. | Sınıf yönetimi, davet kodu, ödev tanımlama, talebe analiz özetlerini inceleme, geri bildirim. | Hoca Paneli (`TeacherPage`), sınıf kodu üretici, ödev takibi, GDPR uyumlu performans analizi görüntüleyici. |
| **E. Araştırmacı / Kıraat Uzmanı** | Aşere-i Mütevâtire rivayetlerini, kaynakları ve tarihi makam seyirlerini incelemek isteyen. | 10 İmam ve 20 Râvi usûl tablosu, akademik kaynakça (*en-Neşr*, *Şâtıbiyye*), 53-koma cetvelleri. | Kıraat ve Rivayet Kataloğu (`QiraatPage`), Terimler Sözlüğü, akademik kaynak doğrulama durumları. |

---

## 3. MODÜL VE KAPSAM KATALOĞU (18 ÇEKİRDEK ALAN)

### 3.1. Modül 1: Kur’an-ı Kerim Keşif ve Okuma Alanı
- Sure ve ayet listesi, arama motoru, Mushaf metni (Uthmani yazı karakterleri).
- Doğrulanmış metin kaynakları (Tanzil, KFGQPC).
- Ayet bazında oynatma, sure dinleme, seçili ayet aralığını döngüye alma (`loop`), tekrar sayısı (`repeat`) ve bekleme boşluğu (`gap`).

### 3.2. Modül 2: Kur’an Tilaveti Dinleme Merkezi
- Çoklu kâri seçimi (Muhammed Sıddîk el-Minşâvî, Mahmûd Halîl el-Husarî, Abdülbâsit Abdüssamed, Mustafa İsmâil, Mişârî Râşid el-Afâsî).
- Perde korumalı hız kontrolü (0.5x, 0.75x, 1.0x, 1.25x).
- Kelime senkron vurgulaması, favoriler ve son kalınan ayet hafızası.

### 3.3. Modül 3: Makam Akademisi
- 10 Makam Kataloğu: Rast, Bayatî, Hicaz, Sabâ, Segâh, Hüseynî, Uşşak, Nihavent, Kürdî, Acemaşîran.
- Arel-Ezgi-Uzdilek 53-koma mikrotonal tuning ve 24-çeyrek ton Arap ses sistemi.
- İnteraktif piyano klavyesi, dizi çalıcı, seyir rehberi ve motif vokalizeleri.
- Karar sesi drone sentezleyicisi (Ney ve Tanbur formant filtreleri).

### 3.4. Modül 4: Tecvid Akademisi
- Müfredat: Mahreçler, Sıfatlar, Nûn-ı Sâkin ve Tenvin hükümleri (İzhâr, İdğâm-ı Maalgunne, İdğâm-ı Bilagunne, İklâb, İhfâ), Medd çeşitleri (Tabiî, Muttasıl, Munfasıl, Lâzım, Ârız, Lîn), Kalkale, Kalın ve İnce Râ hükümleri, Lafzatullah, Vakıf ve İbtidâ, Sekte, Hemze.
- Lahn-ı Celî ve Lahn-ı Hafî hatalar atlası.
- Ayet üzerinde tecvid kuralını altın sarısı nabız ile odaklama köprüsü.

### 3.5. Modül 5: Mahreç ve Telaffuz Laboratuvarı
- 28 Arap harfinin anatomik boğaz, dil ve dudak mahreç atlası.
- Sıfatlar (Hams, Cehr, Şiddet, Rihvet, Beyniyye, İsti'lâ, İstifâle, Itbâk, İnfitâh, Safîr, Kalkale, Lîn, İnhirâf, Tekrîr, Tefeşşî, İstitâle).
- Minimal pairs (birbirine benzeyen harfler) kulak eğitimi testi: Dâd / Zâ, Sîn / Sâd, Tê / Tâ, Hê / Hâ vb.

### 3.6. Modül 6: Nefes, Ses ve Okuyuş Çalışmaları
- Diyafram 4-4-8 ritmik nefes koçu animasyonu (4 sn al, 4 sn tut, 8 sn ver).
- 5 ve 10 dakikalık vokal ısınma rutinleri.
- Ses sınırı (vocal range) frekans ölçer ve kullanıcıya en uygun karar perdesi önerisi (`suggestKarar`).
- Vokal hijyen kuralları ve ses sağlığı güvenlik uyarıları.

### 3.7. Modül 7: Ses Analizi ve Karşılaştırma Motoru
- Web Audio API tabanlı **YIN algoritması** ile canlı temel frekans (F0) tahmini.
- 5 elemanlı medyan filtre (`MedianSmoother`) ile gürültü arındırma.
- HTML5 Canvas canlı perde eğrisi gösterimi.
- Akustik Medd Elif Ölçer (1 ila 6 elif arası akustik süre analizi).
- Sakoe-Chiba bant kısıtlamalı **Dinamik Zaman Bükmesi (DTW)** ile kullanıcı kaydını referans kâri konturu ile karşılaştırma.

### 3.8. Modül 8: Kıraat, Rivayet ve Okuyuş Bilgileri
- Aşere-i Mütevâtire (10 İmam ve 20 Râvisi) tam kataloğu.
- Temel Usûl Karşılaştırma Matrisi (Hafs 'an Âsım, Verş 'an Nâfi', Kālûn, Dûrî, Sûsî, Hamza).
- İmâle, Nakil, Sıla-i Mîm, İdğâm-ı Kebîr mukayeseli kuralları.

### 3.9. Modül 9: Kişisel Eğitim Planı
- SüperMemo SM-2 algoritması tabanlı aralıklı tekrar sistemi (`newCard`, `review`, `isDue`).
- Günlük çalışma hedefi ve ardışık gün serisi (streak) sayacı.
- Seviye tamamlama yüzdesi ve önerilen sıradaki ders algoritması.

### 3.10. Modül 10: Sınavlar ve Etkileşimli Öğrenme
- Çoktan seçmeli tekli (`single`), çoklu (`multi`) ve ses dinlemeli (`listen`) sınavlar.
- Seviye tamamlama sonrası yüksek çözünürlüklü dijital başarı belgesi üretimi ve PNG indirme (açık "İcazet Değildir" şerhi ile).

### 3.11. Modül 11: Ses ve İçerik Kütüphanesi
- EveryAyah CDN ve Quran Foundation API proxy altyapısı.
- Tam lisans ve kaynak üstverisi (Minshawi, Hussary, Abdulbasit vb.).

### 3.12. Modül 12: Uzman, Eğitmen ve Yönetim Paneli
- Sınıf açma, davet kodu yönetimi, ödev atama.
- Talebe ilerleme özeti görüntüleme.
- İçerik yayınlama durumları (`draft`, `review`, `published`).

### 3.13. Modül 13: Yapay Zekâ Destekli Öğrenme Asistanı
- Katı teolojik güvenlik çiti (guardrails): Ayet/hadis uyduramaz, dinî fetva vermez.
- Tecvid, makam, nefes ve kişisel çalışma planı sorularına pedagojik yanıtlar.

### 3.14. Modül 14: Ses Kaydı, Gizlilik ve Veri Güvenliği
- GDPR / KVKK uyumlu gizlilik mimarisi.
- Ham ses sunucuya yüklenmez; yerel işlenir.
- "Tüm Verilerimi Sil" seçeneği.

---

## 4. KABUL KRİTERLERİ

1. `npx tsc --noEmit` sıfır tip hatasıyla tamamlanmalıdır.
2. `npx vitest run` tüm test paketlerini %100 başarıyla geçirmelidir.
3. 10 makamın tamamı 53-koma sıralama kuralına uymalıdır.
4. WCAG 2.1 AA erişilebilirlik gereksinimleri karşılanmalıdır.
