# TİLAVET AKADEMİSİ — VERİ KAYNAKLARI VE LİSANS ENVANTERİ (veri-kaynaklari.md)

> **Tarih:** 19 Ekim 2026  
> **Kapsam:** Kur'an Metni, Tecvid, Kurrâ Sesleri, Makam Eşleşmeleri ve Telif Hakları

---

## 1. KUR'AN METNİ VE MEAL KAYNAKLARI

| Kaynak | Kullanım Alanı | Format / Erişim | Lisans / Kullanım Şartı |
|---|---|---|---|
| **Al-Quran Cloud (api.alquran.cloud)** | Uthmani Hat Âyet Metni (`quran-uthmani`), Diyanet Meali (`tr.diyanet`), Latin Transkripsiyon (`en.transliteration`) | REST API (JSON) | Kullanım koşulları ve atıf yükümlülükleri kaynağından doğrulanmalıdır; sorgular sınırlandırılmalı ve önbelleklenmelidir. |
| **KFGQPC Medine Mushafı (Kral Fehd Matbaası)** | Yazı Tipi (Uthmanic Hafs Fontu) ve 604 sayfa tertibi | TTF/WOFF2 font & SVG | Ücretsiz dini/eğitim amaçlı dağıtım. Harekelerin ve lafızların değiştirilmemesi zorunludur. |
| **Tanzil.net / QUL (Quranic Universal Library)** | Tecvid işaretli XML metni ve doğrulama | XML / Uthmani Tajweed | Creative Commons Attribution 3.0. Hash doğrulaması (6236 ayet) zorunludur. |

---

## 2. SES KAYNAKLARI VE LİSANSLAMA (3 KATMANLI MODEL)

### Katman A: Lisanslı ve Açık Kurrâ Arşivleri (Dinleme Salonu & Mukabele)
- **EveryAyah.com:**
  - *İçerik:* Âyet bazlı yüksek kaliteli MP3 kayıtları (128 kbps).
  - *Kurrâ:* Şeyh Yâsir ed-Devserî, Nâsır el-Katâmî, Meşâri el-Afâsî, Mahmûd Halîl el-Husarî, Muhammed Sıddîk el-Minşâvî, Abdülbâsıt Abdüssamed.
  - *Lisans:* Bu çalışmada sesler CDN üzerinden kaynak URL'lerinden dinlenir; indirilmiş kayıtlar uygulamayla yeniden dağıtılmaz. HerAyah sayfalarında tüm kayıtlar için açık bir lisans beyanı doğrulanmadığından, ticari kullanım veya yeniden dağıtım öncesinde hak sahibi koşulları ayrıca teyit edilmelidir.
- **mp3quran.net API v3:**
  - *İçerik:* Sûre bazlı ve **Mushaf-ı Muallim** (eğitim amaçlı yavaş okuma) kayıtları.
  - *Erişim:* `https://api.mp3quran.net/api/v3/reciters?language=tr`.
  - *Lisans:* Genel API, eğitim amaçlı ücretsiz akış.

### Katman B: Özel Stüdyo Çekimleri ("Eğitim Kayıtları")
- *Gerekçe:* İnternetteki kurrâ arşivlerinde makam isimleri, izole harf mahreçleri ve yavaşlatılmış tecvid kalıpları etiketli değildir. "Hicaz karar perdesi", "Rast inici seyir motifi" gibi spesifik ders parçaları için stüdyo kaydı esastır.
- *Uygulama:* Ek A'daki **Ses Çekim Brief'i** hazırlanmış olup, stüdyo kayıtları tamamlanana kadar Katman A kayıtları uzman onayı (`needsReview: true`) ile eşlenmiştir.
- *Hukuki Durum:* Ses sanatçısıyla telif devri / eğitim amaçlı dijital kullanım sözleşmesi yapılır.

### Katman C: Sentez (TTS / Web Audio Osilatör) — KESİN SINIRLAR
- **Kur'an âyetleri için ASLA yapay zekâ veya TTS kullanılmaz.** (Bölüm 3 İlke 1).
- **Web Audio Sentezi:** Yalnızca müzikal referans sesleri (Piyano notaları, Tanbur/Ney karar perdesi drone sesi) için tarayıcı içi saf matematiksel dalga osilatörü (sinüs + zengin harmonikler) kullanılır.

---

## 3. VERİ BÜTÜNLÜĞÜ VE KORUMA PROTOKOLÜ

1. **Kur'an Metin Bütünlüğü:**
   - Toplam Sûre Sayısı: **114**
   - Toplam Âyet Sayısı: **6236** (Besmeleler Fatiha hariç sûre başı ayeti sayılmaz)
   - Mushaf Sayfa Sayısı: **604**
2. **Kıraat:** Varsayılan rivayet **Âsım'dan Hafs** rivayetidir.
3. **Makam Etiketleme:** Makamlar müzikal bir ekoldür; ayet-makam eşleşmeleri kesin dini hüküm gibi sunulamaz. Her eşleşme "geleneksel olarak tercih edilen" kaydıyla sunulur ve `needsReview: true` rozetini taşır.

## 4. GERÇEK ZAMANLI ÂYET KONTURU: KAYNAK, YÖNTEM VE SINIRLAR

### İncelenen içerik ve kaynaklar

- **Metin/meâl:** Her seçilen âyet için `https://api.alquran.cloud/v1/ayah/{sure}:{ayet}/editions/quran-uthmani,tr.diyanet` çağrısı kullanılır. Örnek `112:1` sorgusu Uthmani metni, Diyanet mealini ve sûre/âyet numarasını ayrı alanlarda döndürmüştür. Kaynak metin uygulamada HTML olarak yorumlanmaz; metin düğümüne yazılır.
- **Ses:** Seçilen kâri ve âyet için EveryAyah'ın âyet dosyası (`https://everyayah.com/data/{kâri-klasörü}/{SSSAAA}.mp3`) kullanılır. Örnek olarak `Husary_128kbps/001001.mp3` erişilebilir MP3 ve kâri metaverisiyle doğrulanmıştır. Her seçimde kayıt ayrı indirilip çözülür; kâri, dosya URL'si ve sûre/âyet kimliği birlikte tutulur.
- **Ders materyali incelemesi:** `kimatik_lab/data/tilavet/lessons.json` içindeki dersler mahreç, harfler, harekeler ve medd gibi okuma/tecvid konularını anlatır. Bu içerikte ses zaman kodları veya kâriye özgü F0 konturları bulunmadığından, ders metinleri makam eğrisi üretmek ya da belirli bir makamı doğrulamak için kaynak kabul edilmez.
- `kimatik_lab/audio_lab/data/qari_contours/fatiha_1_1_husari.json` dosyası önceki taslak örnektir; canlı uygulamada yüklenmez ve örnek noktaları bağımsız olarak doğrulanmış referans veri sayılmaz.
- **Perde çıkarımı:** Ses `decodeAudioData()` ile PCM'e çözülür. Tarayıcıdaki YIN-türü fark fonksiyonu ve kümülatif normalize fark hesabı, 40 ms aralıklı pencerelerde temel frekansı (F0) tahmin eder; grafik noktaları doğrudan bu örneklerden oluşur. Zaman ekseni çözülmüş kaydın gerçek süresidir.
- **Göreli ölçek:** Cent ekseni, o kaydın sesli F0 örneklerinin alt yüzde 20'sindeki ölçümden türetilen referansa göredir. Bu değer **makam kararı değildir**. Kâri değişince kontur ve referans da seçilen kayda göre yeniden hesaplanır.

### Doğruluk ve ürün sınırları

- Sabit makam eğrileri, tahmini süreler ve kâriye göre uydurma transpozisyonlar kullanılmaz. Kaynak kayda erişilemez, CORS engeli oluşur veya güvenilir F0 örneği çıkarılamazsa grafik ve DTW puanı boş bırakılır; kullanıcıya hata durumu gösterilir.
- F0 bir akustik ölçümdür; tek başına makam tespiti, tecvid/mahreç doğrulaması veya kıraat hükmü değildir. Makam adları ancak kaynak kaydı dinleyip uzman tarafından etiketlenip onaylandığında gösterilmelidir.
- Kontur, seçilen her âyet için istek üzerine oluşturulur ve tarayıcıda en fazla 160 ses referansı önbelleklenir. Toplu indirme, uygulama paketine ses gömme veya sunucuda kullanıcı sesini saklama yapılmaz.
- `±40 cent` DTW koridoru bir yazılım parametresidir; akustik karşılaştırma eşiği olarak açıklanır, eğitim/tecvid standardı veya uzman onayı gibi sunulmaz.

### Kaynaklar

1. Alain de Cheveigné ve Hideki Kawahara, “YIN, a fundamental frequency estimator for speech and music”, *Journal of the Acoustical Society of America*, 111(4), 1917–1930 (2002), [DOI: 10.1121/1.1458024](https://doi.org/10.1121/1.1458024).
2. MDN, [`BaseAudioContext.decodeAudioData()`](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData) ve [`AudioBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer) Web Audio API belgeleri.
3. [Al-Quran Cloud](https://alquran.cloud/api) ayet metni/meâl API'si; [örnek 112:1 JSON yanıtı](https://api.alquran.cloud/v1/ayah/112:1/editions/quran-uthmani,tr.diyanet).
4. [EveryAyah](https://everyayah.com/) âyet bazlı ses arşivi; [örnek Husarî 1:1 MP3](https://everyayah.com/data/Husary_128kbps/001001.mp3). Ses kaynağının dağıtım/lisans koşulları ayrıca doğrulanmalıdır.
