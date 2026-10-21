# -*- coding: utf-8 -*-
"""
Yazarlar İçin Edebiyat Kuramı Ders Kitabı - PDF Derleyici
Tüm bölümleri birleştirip İçindekiler tablosuyla birlikte eksiksiz bir PDF oluşturur.
"""

import sys
import os

# Konsol kodlaması güvenliği
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Modül yolunu ekle
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from core import DersKitabi

MODULES = [
    ("bolum_01_02", "Bölüm 1-2: Kuram Nedir? & Kuramın Kısa Tarihi"),
    ("bolum_03", "Bölüm 3: Klasik Temel - Antik Çağdan Romantizme"),
    ("bolum_04a", "Bölüm 4A: Yirminci Yüzyılın Büyük Okulları (4.1 - 4.8)"),
    ("bolum_04b", "Bölüm 4B: Yirminci Yüzyılın Büyük Okulları (4.9 - 4.16)"),
    ("bolum_05", "Bölüm 5: Anlatıbilim - Yazarın En Doğrudan Aracı"),
    ("bolum_06", "Bölüm 6: Güncel Alanlar (2000-2026)"),
    ("bolum_07_08", "Bölüm 7-8: Yöntemler & Yazar İçin Uygulama"),
    ("bolum_09_10", "Bölüm 9-10: Sözlük, Kaynakça ve Sınırlar"),
]


def build_pdf(output_path):
    """Tüm bölümleri ve İçindekiler bölümünü birleştirip nihai PDF'i oluşturur."""
    print("=" * 65)
    print("YAZARLAR ICIN EDEBIYAT KURAMI DERS KITABI - NIHAI DERLEME")
    print("=" * 65)

    # ─── 1. AŞAMA: Sayfa Numaralarını ve İçindekiler Verisini Çıkar ───
    print("[1/3] On derleme: Bolum ve baslik sayfa numaralari olculuyor...")
    temp_pdf = DersKitabi()
    temp_pdf.kapak_sayfasi()

    for mod_name, desc in MODULES:
        mod = __import__(mod_name)
        mod.yaz(temp_pdf)

    raw_toc = temp_pdf.toc_entries

    # TOC sayfa sayısını hesapla
    dummy_toc_pdf = DersKitabi()
    dummy_toc_pdf.kapak_sayfasi()
    p_start = dummy_toc_pdf.page_no()
    dummy_toc_pdf.icindekiler_sayfasi(raw_toc)
    toc_page_count = dummy_toc_pdf.page_no() - p_start
    print(f"      -> Icindekiler bolumu {toc_page_count} sayfa tutuyor.")

    # Sayfa numaralarını TOC kaymasıyla güncelle
    final_toc = []
    for ch_num, sub_num, title, pageno in raw_toc:
        final_toc.append((ch_num, sub_num, title, pageno + toc_page_count))

    # ─── 2. AŞAMA: Nihai Kitabı Oluştur ───
    print("[2/3] Nihai kitap derleniyor (Kapak + Icindekiler + 10 Bolum)...")
    pdf = DersKitabi()

    # Kapak
    print("      -> Kapak sayfasi olusturuldu.")
    pdf.kapak_sayfasi()

    # İçindekiler
    print("      -> Icindekiler tablosu yerlestirildi.")
    pdf.icindekiler_sayfasi(final_toc)

    # Bölümler
    for mod_name, desc in MODULES:
        print(f"      -> {desc} yaziliyor...")
        mod = __import__(mod_name)
        mod.yaz(pdf)
        print(f"         (Guncel sayfa: {pdf.page_no()})")

    # ─── 3. AŞAMA: Diske Kaydet ───
    print(f"\n[3/3] PDF diske kaydediliyor: {output_path}")
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    pdf.output(output_path)

    file_size = os.path.getsize(output_path)
    print("\n" + "=" * 65)
    print("DERS KITABI PDF BASARIYLA VE EKSIKSIZ TAMAMLANDI!")
    print(f"Dosya Yolu   : {output_path}")
    print(f"Dosya Boyutu : {file_size / 1024:.1f} KB ({file_size / (1024*1024):.2f} MB)")
    print(f"Toplam Sayfa : {pdf.page_no()} Sayfa")
    print(f"Bolum Sayisi : 10 Ana Bolum + Ayrintili Sozluk + Kaynakca")
    print("=" * 65)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        out = sys.argv[1]
    else:
        out = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "..",
            "Yazarlar_Icin_Edebiyat_Kurami_Ders_Kitabi.pdf"
        )
    build_pdf(out)
