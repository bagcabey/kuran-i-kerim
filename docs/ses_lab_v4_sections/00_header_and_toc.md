# 🎙️ KUR'ÂN-I KERÎM TÎLÂVET AKADEMİSİ: SES LABORATUVARI & AKUSTİK TAHLİL STÜDYOSU v4.0.0
## Kapsamlı Mimari Yenileme, AudioWorklet YIN DSP, Okuma Penceresi, DTW v2 ve Eksiksiz Kod Rehberi

> **Doküman Kodu:** `SES-LAB-MASTER-V4-2026`  
> **Sürüm:** `4.0.0 (Production / Multi-Engine Standard)`  
> **Tarih:** 20 Ekim 2026  
> **Hedef Kitle:** Kıdemli Frontend / DSP Mühendisleri, UI/UX Tasarımcıları ve Yapay Zekâ Kod Ajanları.  
> **İlke:** Bu belge okunduğunda, harici başka hiçbir koda veya taslağa ihtiyaç duyulmadan, Ses Laboratuvarı modülü sıfırdan çalışan tam kodlarıyla inşa edilebilecek detaydadır. Kısaltma ve yer tutucu (`...`, `TODO`, `kalanı benzer`) içermez.

---

# İÇİNDEKİLER

0. [BÖLÜM 0: Özet ve v3 → v4 Değişiklik Günlüğü](#0-bölüm-0-özet-ve-v3--v4-değişiklik-günlüğü)
1. [BÖLÜM 1: Sorun Denetim Raporu ve Hata Kataloğu](#1-bölüm-1-sorun-denetim-raporu-ve-hata-kataloğu)
2. [BÖLÜM 2: Hedef Mimari, Modül Sözleşmeleri ve Veri Akışı](#2-bölüm-2-hedef-mimari-modül-sözleşmeleri-ve-veri-akışı)
3. [BÖLÜM 3: Ses Odağı Yöneticisi (AudioFocusManager) + Master Bus + Drone v2](#3-bölüm-3-ses-odağı-yöneticisi-audiofocusmanager--master-bus--drone-v2)
4. [BÖLÜM 4: DSP Çekirdeği: AudioWorklet YIN, VAD, Mikrofon ve Gecikme Telafisi](#4-bölüm-4-dsp-çekirdeği-audioworklet-yin-vad-mikrofon-ve-gecikme-telafisi)
5. [BÖLÜM 5: Perde ve Akort Sistemi: 12-TET, 53-Koma (AEU), Arap 24-EDO ve Ahenkler](#5-bölüm-5-perde-ve-akort-sistemi-12-tet-53-koma-aeu-arap-24-edo-ve-ahenkler)
6. [BÖLÜM 6: Medd Motoru v2: Hece Kalibrasyonu ve Kararlı Ölçüm](#6-bölüm-6-medd-motoru-v2-hece-kalibrasyonu-ve-kararlı-ölçüm)
7. [BÖLÜM 7: Kontur Çıkarma, DTW v2 ve Dürüst Akustik Karne](#7-bölüm-7-kontur-çıkarma-dtw-v2-ve-dürüst-akustik-karne)
8. [BÖLÜM 8: Spektrum ve Rezonans v2: Logaritmik 2048-FFT ve Osiloskop](#8-bölüm-8-spektrum-ve-rezonans-v2-logaritmik-2048-fft-ve-osiloskop)
9. [BÖLÜM 9: Nefes Koçu v2 ve Otomatik VAD Kapasite Ölçümü](#9-bölüm-9-nefes-koçu-v2-ve-otomatik-vad-kapasite-ölçümü)
10. [BÖLÜM 10: Okuma Penceresi (Odak Modu - Focus Mode Modal)](#10-bölüm-10-okuma-penceresi-odak-modu---focus-mode-modal)
11. [BÖLÜM 11: Durum Deposu (Store) ve İstasyon UI Motoru](#11-bölüm-11-durum-deposu-store-ve-istasyon-ui-motoru)
12. [BÖLÜM 12: CSS Tasarım Sistemi: Obsidyen & Altın v4 (WCAG 2.2 AA)](#12-bölüm-12-css-tasarım-sistemi-obsidyen--altın-v4-wcag-22-aa)
13. [BÖLÜM 13: Modern React & TypeScript Entegrasyonu](#13-bölüm-13-modern-react--typescript-entegrasyonu)
14. [BÖLÜM 14: Referans Veri Hattı (Çevrimdışı Kontur Çıkarıcı & JSON Şeması)](#14-bölüm-14-referans-veri-hattı-çevrimdışı-kontur-çıkarıcı--json-şeması)
15. [BÖLÜM 15: Test Planı ve Vitest Sinyal Testleri](#15-bölüm-15-test-planı-ve-vitest-sinyal-testleri)
16. [BÖLÜM 16: Kabul Kriterleri, Bilinen Sınırlar ve Fıkhî/İlmî Güvenceler](#16-bölüm-16-kabul-kriterleri-bilinen-sınırlar-ve-fıkhîilmî-güvenceler)
17. [BÖLÜM 17: Başka Bir Yapay Zekâ İçin Yeniden Üretim Kılavuzu](#17-bölüm-17-başka-bir-yapay-zekâ-için-yeniden-üretim-kılavuzu)
18. [BÖLÜM 18: Ekler: Katalog–Çözüm Eşleme Matrisi ve Doğrulama Listesi](#18-bölüm-18-ekler-katalogçözüm-eşleme-matrisi-ve-doğrulama-listesi)

---
