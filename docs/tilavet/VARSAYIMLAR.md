# TİLAVET AKADEMİSİ — ÇALIŞMA VARSAYIMLARI (VARSAYIMLAR.md)

> **Tarih:** 19 Ekim 2026  
> **Kapsam:** Kararlar, Tasarım Tercihleri ve Makul Varsayımlar

---

## 1. MİMARİ VE YIĞIN VARSAYIMLARI

1. **Sıfır Derleme (No-Build) İlkesi:**
   Mevcut projenin en büyük gücü `baslat.bat` ve `baslat_masaustu.bat` ile anında, harici bir Node/Webpack/Vite derleme zinciri olmadan Python 3 yerel HTTP sunucusu üzerinden çalışmasıdır. Tilavet Akademisi de saf ES6+ modüler JavaScript ve modern CSS katmanları (`@layer`) ile inşa edilecek, harici karmaşık paket yöneticisi dayatılmayacaktır.
2. **Yerel Öncelikli (Local-First) Depolama:**
   Öğrenci ilerlemesi, aralıklı tekrar (SM-2) kuyrukları, sınav karneleri ve ayarlar `localStorage` üzerinde saklanacaktır. Bu sayede uygulama internet olmadan veya çevrimdışı masaüstü modunda tam işlevsel kalır. Gelecekteki bir backend API'ye bağlanabilmesi için durum katmanı servis soyutlamasıyla (`AkademiStorageService`) tasarlanmıştır.
3. **Rol Bazlı Erişim Simülasyonu:**
   Hoca Paneli, Uzman İnceleme ve Öğrenci rolleri tekil kullanıcı ortamında profil seçici (`Öğrenci`, `Hoca`, `Uzman`) ile anında test edilebilir kılınmıştır.

---

## 2. SES VE TEKNOLOJİ VARSAYIMLARI

4. **Web Audio Harmonik Sentezleyici:**
   Piyano notaları, tanbur ve ney tınılı karar perdesi "Drone" sesleri için harici yüzlerce megabaytlık ses dosyası indirmek yerine, Web Audio API osilatörleri ve formant filtreleri kullanılmıştır. Bu sayede sıfır gecikme, sınırsız perde transpozesi ve sıfır dosya boyutu elde edilmiştir.
5. **Ses Kaydı ve KVKK/Gizlilik:**
   Öğrencinin mikrofon kayıtları `MediaRecorder` ile doğrudan tarayıcı belleğinde (`Blob` / `AudioBuffer`) tutulur. Kullanıcının açık rızası olmadan hiçbir ses verisi sunucuya yüklenmez.
6. **Perde (Pitch) Tespiti:**
   F0 frekans tespiti için saf JavaScript tabanlı Autocorrelation / YIN algoritması uygulanmıştır. Ayrı bir Python veya C++ kütüphanesi gerektirmeden tarayıcıda 60 FPS akıcılıkla çalışır.
7. **Konuşma Tanıma (ASR):**
   Mevcut projedeki Web Speech API (`ar-SA`) altyapısı korunmuş, tecvid hatalarında ise süre/enerji/sessizlik akustik takipçisi kullanılmıştır.

---

## 3. DİNİ İÇERİK VE İNCELEME VARSAYIMLARI

8. **İcazet Değildir İlkesi:**
   Verilen rozet ve sertifikalar "Tilavet Akademisi Başarı Belgesi"dir. Asla resmi/dini icazet yerine geçmez; arayüzün her noktasında "Yetkili bir hocayla meşkediniz" uyarısı yer alır.
9. **`needsReview: true` Varsayımı:**
   Henüz icazetli bir kurul veya tecvid/makam uzmanı tarafından fiziki olarak imzalanmamış tüm makam-ayet eşleşmeleri ve ders içerikleri `needsReview: true` olarak işaretlenmiştir.
