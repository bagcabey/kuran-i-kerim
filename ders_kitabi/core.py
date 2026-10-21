# -*- coding: utf-8 -*-
"""
Yazarlar İçin Edebiyat Kuramı Ders Kitabı - Profesyonel Kitap Tasarımı Çekirdeği
Akademik ve yayıncılık standartlarına tam uyumlu dizgi motoru.
"""

from fpdf import FPDF
import os

FONT_DIR = r"C:\Windows\Fonts"

# Renk Paleti (Scholarly Petrol & Clean Slate)
COLOR_PRIMARY = (20, 75, 105)      # Koyu Kurumsal Petrol Mavisi
COLOR_SECONDARY = (13, 148, 136)   # Canlı Zümrüt / Teal
COLOR_TEXT = (45, 55, 72)          # Yumuşak Füme Gövde Metni
COLOR_TEXT_MUTED = (113, 128, 150) # Gri Açıklama / Sayfa Numarası
COLOR_BORDER = (226, 232, 240)     # Zarif İnce Çizgi Rengi
COLOR_BG_ALT = (248, 250, 252)     # Çok Hafif Kırık Beyaz / Zemin


class DersKitabi(FPDF):
    """Yüksek standartlı akademik ders kitabı PDF sınıfı."""

    def __init__(self):
        super().__init__(orientation="P", unit="mm", format="A4")
        
        # Standart Kitap Kenar Boşlukları (Margin: 18mm)
        self.set_margins(18, 18, 18)
        self.set_auto_page_break(auto=True, margin=20)
        
        self.content_w = 174  # 210 - 18 - 18 = 174 mm yazılabilir net genişlik
        self.r_margin_x = 192 # 18 + 174 = 192 mm sağ sınır
        
        self._setup_fonts()
        self.chapter_num = 0
        self.sub_section_num = 0
        self.toc_entries = []
        self.current_chapter_title = ""

    def _setup_fonts(self):
        """Türkçe karakter destekli sistem fontlarını yükle."""
        self.add_font("Arial", "", os.path.join(FONT_DIR, "arial.ttf"))
        self.add_font("Arial", "B", os.path.join(FONT_DIR, "arialbd.ttf"))
        self.add_font("Arial", "I", os.path.join(FONT_DIR, "ariali.ttf"))
        self.add_font("Arial", "BI", os.path.join(FONT_DIR, "arialbi.ttf"))
        
        self.add_font("TimesNewRoman", "", os.path.join(FONT_DIR, "times.ttf"))
        self.add_font("TimesNewRoman", "B", os.path.join(FONT_DIR, "timesbd.ttf"))
        self.add_font("TimesNewRoman", "I", os.path.join(FONT_DIR, "timesi.ttf"))
        self.add_font("TimesNewRoman", "BI", os.path.join(FONT_DIR, "timesbi.ttf"))

    def set_font(self, family=None, style="", size=0):
        """Times çağrılarını otomatik olarak Türkçe destekli TimesNewRoman TTF'e yönlendir."""
        if family and family.lower() in ("times", "times-roman"):
            family = "TimesNewRoman"
        return super().set_font(family, style, size)

    # ─── Üstbilgi ve Altbilgi ───
    def header(self):
        """Akademik sayfa üstbilgisi."""
        if self.page_no() > 3:  # Kapak ve İçindekiler sayfalarını atla
            self.set_font("Arial", "I", 8)
            self.set_text_color(*COLOR_TEXT_MUTED)
            self.set_y(10)
            self.set_x(self.l_margin)
            
            # Sol üst: Kitap Başlığı
            self.cell(self.content_w / 2, 6, "Yazarlar İçin Kuram Notu — Ders Kitabı", 0, 0, "L")
            
            # Sağ üst: Geçerli Bölüm Başlığı
            if self.current_chapter_title:
                self.cell(self.content_w / 2, 6, self.current_chapter_title[:55], 0, 0, "R")
            else:
                self.cell(self.content_w / 2, 6, "", 0, 0, "R")
                
            self.ln(6)
            self.set_draw_color(*COLOR_BORDER)
            self.set_line_width(0.3)
            self.line(self.l_margin, self.get_y(), self.r_margin_x, self.get_y())
            self.set_line_width(0.2)
            self.set_text_color(*COLOR_TEXT)
            self.set_y(18)  # İçeriğin başlangıç Y noktası

    def footer(self):
        """Akademik sayfa altbilgisi."""
        if self.page_no() > 1:  # Kapak hariç
            self.set_y(-14)
            self.set_draw_color(*COLOR_BORDER)
            self.set_line_width(0.3)
            self.line(self.l_margin, self.get_y(), self.r_margin_x, self.get_y())
            self.set_line_width(0.2)
            
            self.set_font("Arial", "", 8.5)
            self.set_text_color(*COLOR_TEXT_MUTED)
            self.set_x(self.l_margin)
            self.cell(self.content_w, 8, f"Sayfa {self.page_no()}", 0, 0, "C")
            self.set_text_color(*COLOR_TEXT)

    # ─── Kapak Sayfası ───
    def kapak_sayfasi(self):
        """Tam kitap standartlarında kapak tasarımı."""
        self.add_page()
        self.set_x(self.l_margin)
        
        # Üst dekoratif renk şeridi
        self.set_fill_color(*COLOR_PRIMARY)
        self.rect(self.l_margin, 25, self.content_w, 4, "F")
        self.set_fill_color(*COLOR_SECONDARY)
        self.rect(self.l_margin, 29, 35, 2, "F")
        
        self.set_y(55)
        
        # Üst Kategori
        self.set_font("Arial", "B", 12)
        self.set_text_color(*COLOR_SECONDARY)
        self.cell(self.content_w, 8, "YAZARLIK 101  |  DERS KİTAPÇIĞI SERİSİ", 0, 1, "C")
        self.ln(8)
        
        # Ana Başlık
        self.set_font("Arial", "B", 30)
        self.set_text_color(*COLOR_PRIMARY)
        self.multi_cell(self.content_w, 13, "Yazarlar İçin\nKuram Notu", 0, "C", new_x="LMARGIN", new_y="NEXT")
        self.ln(6)
        
        # Alt Başlık
        self.set_font("Arial", "I", 13)
        self.set_text_color(80, 95, 115)
        self.multi_cell(
            self.content_w, 7.5,
            "Edebiyat ve anlatı kuramına kapsamlı giriş:\nkavramlar, okullar, yöntemler ve güncel alanlar",
            0, "C", new_x="LMARGIN", new_y="NEXT"
        )
        self.ln(12)
        
        # İnce Ayırıcı Hat
        self.set_draw_color(*COLOR_SECONDARY)
        self.set_line_width(0.6)
        line_w = 60
        self.line(105 - line_w/2, self.get_y(), 105 + line_w/2, self.get_y())
        self.set_line_width(0.2)
        self.ln(12)
        
        # Araştırma, Tasarım ve Yazar Paneli
        card_w = self.content_w
        card_h = 62
        x = self.l_margin
        y = self.get_y()
        
        self.set_fill_color(248, 250, 252)
        self.rect(x, y, card_w, card_h, "F")
        self.set_draw_color(*COLOR_BORDER)
        self.rect(x, y, card_w, card_h, "D")
        self.set_fill_color(*COLOR_PRIMARY)
        self.rect(x, y, 3.5, card_h, "F")
        
        self.set_xy(x + 8, y + 5)
        self.set_font("Arial", "B", 10.5)
        self.set_text_color(*COLOR_SECONDARY)
        self.cell(card_w - 16, 5.5, "ARAŞTIRMA VE İÇERİK YÖNETİMİ", 0, 1, "L")
        
        self.set_xy(x + 8, y + 12)
        self.set_font("Arial", "B", 11)
        self.set_text_color(*COLOR_PRIMARY)
        self.cell(card_w - 16, 6, "'SALİHA' KİTABININ YAZARI ÖMER BAĞÇABAŞI", 0, 1, "L")
        
        self.set_xy(x + 8, y + 20)
        self.set_font("TimesNewRoman", "", 9.8)
        self.set_text_color(*COLOR_TEXT)
        promo_text = (
            "Bu ders kitabı ve bünyesindeki tüm kuramsal içeriklerin araştırma, kurgu ve metodolojik yönetim "
            "liderliği; edebiyat dünyasında derin iz bırakan 'Saliha' kitabının yazarı Ömer Bağçabaşı tarafından "
            "özel olarak tasarlanmıştır.\n\n"
            "Edebiyat kuramını soğuk akademik soyutlamalardan kurtarıp doğrudan yaşayan bir anlatı zanaatına "
            "dönüştüren bu başucu eseri; 'Saliha'nın edebi mimarisindeki anlatı ustalığını, kurgusal derinliğini "
            "ve araştırma vizyonunu yaratıcı yazarlık sınıflarına taşımaktadır."
        )
        self.multi_cell(card_w - 16, 5.1, promo_text, 0, "J", new_x="LMARGIN", new_y="NEXT")
        
        # Sayfa Altı Künye
        self.set_y(245)
        self.set_font("Arial", "B", 10.5)
        self.set_text_color(*COLOR_PRIMARY)
        self.cell(self.content_w, 6, "Araştırma ve Yönetim: Ömer Bağçabaşı", 0, 1, "C")
        self.set_font("Arial", "", 9.5)
        self.set_text_color(*COLOR_TEXT_MUTED)
        self.cell(self.content_w, 6, "2026 Akademik ve Yaratıcı Yazarlık Ders Kitabı Sürümü", 0, 1, "C")
        
        self.set_text_color(*COLOR_TEXT)

    # ─── İçindekiler Sayfası ───
    def icindekiler_sayfasi(self, toc_data):
        """Noktalı lider çizgili, kusursuz hizalanmış İçindekiler tablosu."""
        self.add_page()
        self.current_chapter_title = "İçindekiler"
        self.set_x(self.l_margin)
        
        self.set_y(22)
        self.set_font("Arial", "B", 22)
        self.set_text_color(*COLOR_PRIMARY)
        self.cell(self.content_w, 9, "İçindekiler", 0, 1, "L")
        self.ln(2)
        
        self.set_draw_color(*COLOR_PRIMARY)
        self.set_line_width(0.7)
        self.line(self.l_margin, self.get_y(), self.l_margin + 50, self.get_y())
        self.set_line_width(0.2)
        self.ln(6)
        
        for ch_num, sub_num, title, pageno in toc_data:
            if self.get_y() > 265:
                self.add_page()
                self.current_chapter_title = "İçindekiler"
                self.set_y(22)
                self.set_font("Arial", "B", 14)
                self.set_text_color(*COLOR_PRIMARY)
                self.cell(self.content_w, 8, "İçindekiler (Devam)", 0, 1, "L")
                self.ln(2)
                self.set_draw_color(*COLOR_BORDER)
                self.line(self.l_margin, self.get_y(), self.r_margin_x, self.get_y())
                self.ln(5)

            self.set_x(self.l_margin)

            if sub_num is None:
                # Ana Bölüm Başlığı
                self.ln(2.5)
                self.set_font("Arial", "B", 10)
                self.set_text_color(*COLOR_PRIMARY)
                prefix = f"{ch_num}. {title}"
            else:
                # Alt Başlık
                self.set_font("Arial", "", 9.5)
                self.set_text_color(*COLOR_TEXT)
                prefix = f"    {ch_num}.{sub_num} {title}"

            page_str = f" {pageno}"
            self.set_font("Arial", "B" if sub_num is None else "", 9.5)
            page_w = self.get_string_width(page_str) + 4
            
            # Başlık metnini ölç ve gerekiyorsa kısalt
            max_prefix_w = self.content_w - page_w - 6
            cur_prefix = prefix
            self.set_font("Arial", "B" if sub_num is None else "", 9.5)
            while self.get_string_width(cur_prefix) > max_prefix_w and len(cur_prefix) > 20:
                cur_prefix = cur_prefix[:-4] + "..."

            prefix_w = self.get_string_width(cur_prefix)
            space_w = self.content_w - prefix_w - page_w

            # Başlığı yaz
            self.cell(prefix_w, 5.2, cur_prefix, 0, 0, "L")

            # Noktalı lider çizgisi
            if space_w > 4:
                self.set_font("Arial", "", 9)
                self.set_text_color(180, 190, 205)
                dot_w = self.get_string_width(" .")
                dots_count = int(space_w / dot_w)
                self.cell(space_w, 5.2, " ." * dots_count, 0, 0, "C")
            else:
                self.cell(max(0, space_w), 5.2, "", 0, 0)

            # Sayfa numarası
            self.set_font("Arial", "B" if sub_num is None else "", 9.5)
            self.set_text_color(*COLOR_PRIMARY if sub_num is None else COLOR_TEXT)
            self.cell(page_w, 5.2, page_str, 0, 1, "R")
            
        self.ln(6)
        self.set_x(self.l_margin)

    # ─── Bölüm Başlıkları ───
    def bolum_basligi(self, num, title):
        """Bölüm başlığı - her zaman temiz yeni bir sayfada başlar."""
        self.chapter_num = num
        self.sub_section_num = 0
        self.current_chapter_title = f"{num}. {title}"
        self.add_page()
        self.toc_entries.append((num, None, title, self.page_no()))
        
        self.set_x(self.l_margin)
        self.set_y(24)
        
        # Bölüm Etiketi
        self.set_font("Arial", "B", 10.5)
        self.set_text_color(*COLOR_SECONDARY)
        self.cell(self.content_w, 6, f"BÖLÜM {num}", 0, 1, "L")
        
        # Ana Bölüm Başlığı
        self.set_font("Arial", "B", 20)
        self.set_text_color(*COLOR_PRIMARY)
        self.multi_cell(self.content_w, 8.5, f"{num}. {title}", 0, "L", new_x="LMARGIN", new_y="NEXT")
        self.ln(2)
        
        # Şık Alt Çizgi
        self.set_draw_color(*COLOR_PRIMARY)
        self.set_line_width(0.8)
        self.line(self.l_margin, self.get_y(), self.l_margin + 60, self.get_y())
        self.set_line_width(0.2)
        self.ln(6)
        self.set_x(self.l_margin)

    def alt_bolum(self, title):
        """Alt bölüm başlığı (Örn: 1.1 Tanım)."""
        self.sub_section_num += 1
        num_str = f"{self.chapter_num}.{self.sub_section_num}"
        
        if self.get_y() > 245:
            self.add_page()
            
        self.toc_entries.append((self.chapter_num, self.sub_section_num, title, self.page_no()))
        
        self.ln(4)
        self.set_x(self.l_margin)
        self.set_font("Arial", "B", 13.5)
        self.set_text_color(*COLOR_PRIMARY)
        self.multi_cell(self.content_w, 7, f"{num_str}  {title}", 0, "L", new_x="LMARGIN", new_y="NEXT")
        self.ln(1)
        
        self.set_draw_color(*COLOR_BORDER)
        self.line(self.l_margin, self.get_y(), self.l_margin + 90, self.get_y())
        self.ln(3.5)
        self.set_x(self.l_margin)

    def alt_alt_bolum(self, title):
        """3. Seviye Alt Başlık."""
        if self.get_y() > 250:
            self.add_page()
            
        self.ln(3)
        self.set_x(self.l_margin)
        self.set_font("Arial", "B", 11)
        self.set_text_color(51, 65, 85)
        self.multi_cell(self.content_w, 6, str(title), 0, "L", new_x="LMARGIN", new_y="NEXT")
        self.ln(1.5)
        self.set_x(self.l_margin)

    # ─── Metin Paragrafları ───
    def paragraf(self, text, indent=False):
        """Standart kitap gövde metni paragrafı."""
        self.set_x(self.l_margin)
        self.set_font("TimesNewRoman", "", 10.5)
        self.set_text_color(*COLOR_TEXT)
        self.multi_cell(self.content_w, 5.6, str(text), 0, "J", new_x="LMARGIN", new_y="NEXT")
        self.ln(2.2)
        self.set_x(self.l_margin)

    def bold_paragraf(self, text):
        """Vurgulu kalın paragraf."""
        self.set_x(self.l_margin)
        self.set_font("TimesNewRoman", "B", 10.5)
        self.set_text_color(*COLOR_PRIMARY)
        self.multi_cell(self.content_w, 5.6, str(text), 0, "J", new_x="LMARGIN", new_y="NEXT")
        self.ln(2.2)
        self.set_x(self.l_margin)

    def italic_paragraf(self, text):
        """İtalik açıklama paragrafı."""
        self.set_x(self.l_margin)
        self.set_font("TimesNewRoman", "I", 10.5)
        self.set_text_color(75, 85, 99)
        self.multi_cell(self.content_w, 5.6, str(text), 0, "J", new_x="LMARGIN", new_y="NEXT")
        self.ln(2.2)
        self.set_x(self.l_margin)

    def kavram_tanimi(self, kavram, tanim):
        """Kavram ve tanımını net hiyerarşiyle yazar."""
        if self.get_y() > 265:
            self.add_page()
            
        self.set_x(self.l_margin)
        self.set_font("Arial", "B", 9.5)
        self.set_text_color(*COLOR_PRIMARY)
        self.write(5.5, "•  " + str(kavram) + ": ")
        
        self.set_font("TimesNewRoman", "", 10.5)
        self.set_text_color(*COLOR_TEXT)
        self.write(5.5, str(tanim))
        self.ln(6.5)
        self.set_x(self.l_margin)

    def madde_listesi(self, items, numbered=False):
        """Madde imli veya numaralı liste."""
        self.set_font("TimesNewRoman", "", 10.5)
        self.set_text_color(*COLOR_TEXT)
        
        for i, item in enumerate(items, 1):
            if self.get_y() > 265:
                self.add_page()
            prefix = f"{i}. " if numbered else "•  "
            self.set_x(self.l_margin + 3)
            self.multi_cell(self.content_w - 3, 5.5, f"{prefix}{item}", 0, "J", new_x="LMARGIN", new_y="NEXT")
            self.ln(1)
            
        self.ln(2)
        self.set_x(self.l_margin)

    # ─── Profesyonel Panel / Kart Çizim Motoru ───
    def _ciz_panel(self, baslik, icerik_listesi, bar_rgb, bg_rgb, border_rgb, title_rgb, text_rgb, is_italic=False):
        """Taşmayan, milimetrik kenar boşluklu ve sol şeritli modern çağrı paneli."""
        font_style = "I" if is_italic else ""
        title_h = 7.5
        inner_w = self.content_w - 12  # İç metin genişliği (174 - 12 = 162 mm)
        
        # İç satır yüksekliklerini dry_run ile hatasız hesapla
        self.set_font("TimesNewRoman", font_style, 10)
        lines_count = 0
        for itm in icerik_listesi:
            l = self.multi_cell(inner_w, 5.2, str(itm), 0, "L", False, dry_run=True, output="LINES")
            lines_count += len(l)
            
        inner_h = lines_count * 5.2 + len(icerik_listesi) * 2
        total_h = title_h + inner_h + 4.5
        
        # Sayfa sonu kontrolü: Kutu sayfaya sığmıyorsa temiz bir yeni sayfaya geçir
        if self.get_y() + total_h > 272:
            self.add_page()
            
        x = self.l_margin
        y = self.get_y()
        
        # 1. Zemin Dolgusu
        self.set_fill_color(*bg_rgb)
        self.rect(x, y, self.content_w, total_h, "F")
        
        # 2. Sol Vurgu Şeridi (Accent Bar)
        self.set_fill_color(*bar_rgb)
        self.rect(x, y, 3.5, total_h, "F")
        
        # 3. İnce Dış Kenarlık
        self.set_draw_color(*border_rgb)
        self.rect(x, y, self.content_w, total_h, "D")
        
        # 4. Kutu Başlığı
        self.set_xy(x + 7, y + 2.5)
        self.set_font("Arial", "B", 9.5)
        self.set_text_color(*title_rgb)
        self.cell(inner_w, 6, str(baslik), 0, 0, "L")
        
        # 5. Kutu İçi Metinleri Yaz
        self.set_font("TimesNewRoman", font_style, 10)
        self.set_text_color(*text_rgb)
        cur_y = y + title_h + 2.5
        
        for itm in icerik_listesi:
            self.set_xy(x + 7, cur_y)
            self.multi_cell(inner_w, 5.2, str(itm), 0, "L", False, new_x="LMARGIN", new_y="NEXT")
            cur_y = self.get_y() + 2
            
        # Pozisyonu kutunun altına al ve sol kenara sıfırla
        self.set_xy(self.l_margin, y + total_h + 4)
        self.set_text_color(*COLOR_TEXT)

    # ─── Özelleşmiş Kutu Metotları ───
    def ornek_kutusu(self, baslik, metin, cozumleme=""):
        """Edebi metin ve çözümleme örnek paneli (Mavi)."""
        icerik = [metin]
        if cozumleme:
            icerik.append(f"Çözümleme: {cozumleme}")
            
        self._ciz_panel(
            baslik=f"ÖRNEK METİN: {baslik}",
            icerik_listesi=icerik,
            bar_rgb=(20, 75, 105),       # Deep Petrol
            bg_rgb=(244, 248, 253),      # Ice Blue Soft
            border_rgb=(191, 219, 254),  # Soft Blue Border
            title_rgb=(20, 75, 105),     # Deep Petrol Title
            text_rgb=(30, 41, 59),       # Dark Slate
            is_italic=True
        )

    def bilgi_kutusu(self, *args):
        """Bilgi ve püf noktası paneli (Amber/Gold)."""
        if len(args) >= 2:
            baslik, metin = str(args[0]), str(args[1])
        elif len(args) == 1:
            baslik, metin = "BİLGİ NOTU", str(args[0])
        else:
            return
            
        self._ciz_panel(
            baslik=f"BİLGİ NOTU: {baslik}",
            icerik_listesi=[metin],
            bar_rgb=(217, 119, 6),       # Warm Amber
            bg_rgb=(255, 251, 235),      # Soft Cream
            border_rgb=(253, 230, 138),  # Amber Border
            title_rgb=(146, 64, 14),     # Deep Amber Title
            text_rgb=(120, 53, 15),      # Amber Dark Text
            is_italic=False
        )

    def uyari_kutusu(self, *args):
        """Kritik uyarı ve tuzak paneli (Kırmızı/Rose)."""
        if len(args) >= 2:
            baslik, metin = str(args[0]), str(args[1])
        elif len(args) == 1:
            baslik, metin = "DİKKAT", str(args[0])
        else:
            return
            
        self._ciz_panel(
            baslik=f"DİKKAT: {baslik}",
            icerik_listesi=[metin],
            bar_rgb=(220, 38, 38),       # Crimson Red
            bg_rgb=(254, 242, 242),      # Soft Rose
            border_rgb=(254, 202, 202),  # Rose Border
            title_rgb=(153, 27, 27),     # Dark Red Title
            text_rgb=(127, 29, 29),      # Red Text
            is_italic=False
        )

    def etkinlik_kutusu(self, baslik, items):
        """Uygulama ve atölye etkinlik paneli (Zümrüt Yeşil)."""
        formatted_items = [f"{i}.  {itm}" for i, itm in enumerate(items, 1)]
        self._ciz_panel(
            baslik=f"UYGULAMA VE ETKİNLİK: {baslik}",
            icerik_listesi=formatted_items,
            bar_rgb=(16, 149, 106),      # Emerald Green
            bg_rgb=(240, 253, 244),      # Mint Soft
            border_rgb=(167, 243, 208),  # Green Border
            title_rgb=(6, 95, 70),       # Dark Green Title
            text_rgb=(6, 78, 59),        # Forest Text
            is_italic=False
        )

    def tartisma_sorulari(self, sorular):
        """Sınıf içi müzakere ve tartışma paneli (Mor/Lavanta)."""
        formatted_questions = [f"{i}.  {q}" for i, q in enumerate(sorular, 1)]
        self._ciz_panel(
            baslik="TARTIŞMA VE ANALİZ SORULARI",
            icerik_listesi=formatted_questions,
            bar_rgb=(124, 58, 237),      # Purple / Violet
            bg_rgb=(245, 243, 255),      # Soft Lavender
            border_rgb=(221, 214, 254),  # Lavender Border
            title_rgb=(91, 33, 182),     # Dark Violet Title
            text_rgb=(76, 29, 149),      # Purple Text
            is_italic=False
        )

    def bolum_ozeti(self, items):
        """Bölüm sonu kazanım özeti paneli (Koyu Mavi / Slate)."""
        formatted_items = [f"•  {itm}" for itm in items]
        self._ciz_panel(
            baslik="BÖLÜM ÖZETİ",
            icerik_listesi=formatted_items,
            bar_rgb=(20, 75, 105),       # Deep Petrol
            bg_rgb=(248, 250, 252),      # Slate Tint
            border_rgb=(203, 213, 225),  # Slate Border
            title_rgb=(20, 75, 105),     # Deep Petrol Title
            text_rgb=(30, 41, 59),       # Dark Slate Text
            is_italic=False
        )

    # ─── Tablolar ───
    def tablo_basit(self, headers, rows, col_widths=None):
        """Tam sayfa genişlikli, şık akademik tablo motoru."""
        if self.get_y() > 230:
            self.add_page()
            
        n = len(headers)
        if col_widths is None:
            col_widths = [self.content_w / n] * n
        else:
            # Sütun genişliklerini tam content_w'ye oranla
            total_w = sum(col_widths)
            col_widths = [(w / total_w) * self.content_w for w in col_widths]
            
        x_base = self.l_margin
        
        # 1. Başlık Satırı
        self.set_x(x_base)
        self.set_font("Arial", "B", 9)
        self.set_fill_color(*COLOR_PRIMARY)
        self.set_text_color(255, 255, 255)
        self.set_draw_color(*COLOR_BORDER)
        
        header_h = 8
        for i, h in enumerate(headers):
            self.cell(col_widths[i], header_h, str(h), 1, 0, "C", True)
        self.ln(header_h)
        self.set_x(x_base)
        
        # 2. Veri Satırları
        self.set_font("TimesNewRoman", "", 9)
        self.set_text_color(*COLOR_TEXT)
        fill = False
        
        for row in rows:
            # Satır yüksekliğini hesapla
            max_h = 7
            for i, cell in enumerate(row):
                lines = self.multi_cell(col_widths[i] - 3, 4.8, str(cell), 0, "L", False, dry_run=True, output="LINES")
                h = len(lines) * 4.8 + 2.5
                if h > max_h:
                    max_h = h

            # Sayfa taşma kontrolü
            if self.get_y() + max_h > 270:
                self.add_page()
                self.set_x(x_base)
                # Başlığı yeni sayfada tekrarla
                self.set_font("Arial", "B", 9)
                self.set_fill_color(*COLOR_PRIMARY)
                self.set_text_color(255, 255, 255)
                for i, h in enumerate(headers):
                    self.cell(col_widths[i], header_h, str(h), 1, 0, "C", True)
                self.ln(header_h)
                self.set_x(x_base)
                self.set_font("TimesNewRoman", "", 9)
                self.set_text_color(*COLOR_TEXT)

            # Satır arka planı
            if fill:
                self.set_fill_color(248, 250, 252)
            else:
                self.set_fill_color(255, 255, 255)

            y_start = self.get_y()
            current_x = x_base
            
            for i, cell in enumerate(row):
                w = col_widths[i]
                self.set_xy(current_x, y_start)
                # Hücre sınırını ve dolgusunu çiz
                self.rect(current_x, y_start, w, max_h, "DF")
                # Hücre iç metnini yaz (sol iç boşluk: 1.5mm)
                self.set_xy(current_x + 1.5, y_start + 1.2)
                self.multi_cell(w - 3, 4.8, str(cell), 0, "L", False)
                current_x += w

            self.set_xy(x_base, y_start + max_h)
            fill = not fill
            
        self.ln(3.5)
        self.set_x(self.l_margin)

    def sayfa_sonu(self):
        """Sayfa sonu boşluğu."""
        self.ln(6)
        self.set_x(self.l_margin)

    def bos_satir(self, n=1):
        """Boş satır aralığı."""
        self.ln(n * 4)
        self.set_x(self.l_margin)
