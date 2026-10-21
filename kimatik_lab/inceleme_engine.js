/**
 * KUR'ÂN-I KERÎM — Âyet İnceleme, Esbâb-ı Nüzûl ve Büyük Âlimler Tefsir Motoru
 * =============================================================================
 * Her âyet için:
 * 1. Orijinal Uthmani Hat & Fonetik Latin Okunuşu & Kâbe İmamı Tilavet Sesi
 * 2. Türkçe Diyanet Meali ve Kelime Vurguları
 * 3. Varsa kaynak ve uzman onayı bulunan tefsir/tahlil kaydı
 * 5. Günlük Hayata Yansımalar ve Tefekkür Notları
 * 6. Lügat & Belâgat İncelikleri (İ'câzü'l-Kur'ân)
 * 7. Ayet metni için doğrulanmış API yanıtı; çevrimdışı durumda açık hata
 * =============================================================================
 */

// 114 Sure Meta Bilgisi (İniş Sırası, Nüzul Yeri, Ayet Sayısı, Ana Teması)
const SURAH_METADATA = [
  { no: 1, name: "Fâtiha", arabic: "الفاتحة", ayahs: 7, place: "Mekke", order: 5, theme: "Kur'an'ın Özü, Hamd, Tevhid, Dua ve Doğru Yol (Sırât-ı Müstakîm)" },
  { no: 2, name: "Bakara", arabic: "البقرة", ayahs: 286, place: "Medine", order: 87, theme: "İman Esasları, Hukuk, İbadet, İsrâiloğulları Tarihi, Âyetü'l-Kürsî ve İnfak" },
  { no: 3, name: "Âl-i İmrân", arabic: "آل عمران", ayahs: 200, place: "Medine", order: 89, theme: "Tevhid Mücadelesi, Uhud Savaşı İmtihanı, Hz. Meryem ve Hz. İsa Kıssası" },
  { no: 4, name: "Nisâ", arabic: "النساء", ayahs: 176, place: "Medine", order: 92, theme: "Kadın Hakları, Aile Hukuku, Miras, Adalet, Emanet ve Toplumsal Düzen" },
  { no: 5, name: "Mâide", arabic: "المائدة", ayahs: 120, place: "Medine", order: 112, theme: "Ahitlere Vefa, Helal-Haram Gıdalar, Dinin Kemâle Ermesi ve Hukuk" },
  { no: 6, name: "En'âm", arabic: "الأنعام", ayahs: 165, place: "Mekke", order: 55, theme: "Tevhid İnancı, Kâinattaki İlahî Deliller, Şirkin Reddi ve Hz. İbrahim'in Tefekkürü" },
  { no: 7, name: "A'râf", arabic: "الأعراف", ayahs: 206, place: "Mekke", order: 39, theme: "Peygamberler Tarihi, Hz. Âdem ve İblis, Ashâb-ı A'râf, Hz. Musa ve Firavun" },
  { no: 8, name: "Enfâl", arabic: "الأنفال", ayahs: 75, place: "Medine", order: 88, theme: "Bedir Zaferi, Ganimet Hukuku, İlahî Yardım ve Müminlerin Nitelikleri" },
  { no: 9, name: "Tevbe", arabic: "التوبة", ayahs: 129, place: "Medine", order: 113, theme: "Tebük Seferi, Münafıkların Deşifresi, Tövbenin Kabulü ve Samimiyet" },
  { no: 10, name: "Yûnus", arabic: "يونس", ayahs: 109, place: "Mekke", order: 51, theme: "Vahyin Hakikati, Kaza ve Kader, Hz. Nuh, Hz. Musa ve Hz. Yunus Kıssaları" },
  { no: 11, name: "Hûd", arabic: "هود", ayahs: 123, place: "Mekke", order: 52, theme: "Peygamberlerin Tevhid Mücadelesi, Nuh Tufanı, Ad ve Semud Kavimleri ('Beni Hûd Suresi İhtiyarlattı')" },
  { no: 12, name: "Yûsuf", arabic: "يوسف", ayahs: 111, place: "Mekke", order: 53, theme: "Ahsenü'l-Kasas (Kıssaların En Güzeli), Sabır, İffet, Kuyu, Zindan ve Saray İmtihanı" },
  { no: 13, name: "Ra'd", arabic: "الرعد", ayahs: 43, place: "Medine", order: 96, theme: "Gök Gürültüsünün Tesbihi, Kalplerin Allah'ın Zikriyle Huzur Bulması ve Kâinat Delilleri" },
  { no: 14, name: "İbrâhîm", arabic: "إبراهيم", ayahs: 52, place: "Mekke", order: 72, theme: "İnsanlığı Karanlıklardan Aydınlığa Çıkarmak, Güzel Kelime Misali ve Hz. İbrahim'in Duası" },
  { no: 15, name: "Hicr", arabic: "الحجر", ayahs: 99, place: "Mekke", order: 54, theme: "Kur'an'ın Korunması Garantisi, İblis'in Kibri, Hicr Halkı ve İlahî Rahmet" },
  { no: 16, name: "Nahl", arabic: "النحل", ayahs: 128, place: "Mekke", order: 70, theme: "Nimetler Suresi, Bal Arısının Mucizesi, Adalet ve İhsan Emri (Nahl 90)" },
  { no: 17, name: "İsrâ", arabic: "الإسراء", ayahs: 111, place: "Mekke", order: 50, theme: "İsrâ ve Miraç Mucizesi, Anne-Babaya İyilik, Ahlak Manifestosu ve Ruhun Mahiyeti" },
  { no: 18, name: "Kehf", arabic: "الكهف", ayahs: 110, place: "Mekke", order: 69, theme: "Ashâb-ı Kehf, İki Bahçe Sahibi, Hz. Musa ve Hızır, Zülkarneyn ve Deccal Fitnesine Kalkan" },
  { no: 19, name: "Meryem", arabic: "مريم", ayahs: 98, place: "Mekke", order: 44, theme: "Hz. Zekeriyya'nın Duası, Hz. Yahya ve Hz. Meryem'in Mucizevi Doğumu, Hz. İsa'nın Beşikte Konuşması" },
  { no: 20, name: "Tâhâ", arabic: "طه", ayahs: 135, place: "Mekke", order: 45, theme: "Kur'an'ın İnsana Güç Vermesi, Hz. Musa'nın Tur Dağı Tecellisi, Asâ ve Tâhâ Nidası" },
  { no: 21, name: "Enbiyâ", arabic: "الأنبياء", ayahs: 112, place: "Mekke", order: 73, theme: "Peygamberlerin Duaları ve İmtihanları, 'Âlemlere Rahmet' Hz. Muhammed (s.a.v.)" },
  { no: 22, name: "Hac", arabic: "الحج", ayahs: 78, place: "Medine", order: 103, theme: "Kıyamet Sarsıntısı, Hac İbadetinin Hikmeti, Kurban ve Tevhid Şiarları" },
  { no: 23, name: "Mü'minûn", arabic: "المؤمنون", ayahs: 118, place: "Mekke", order: 74, theme: "Kurtuluşa Eren Müminlerin 7 Vasıfı, İnsanın Anne Karnındaki Yaratılış Evreleri" },
  { no: 24, name: "Nûr", arabic: "النور", ayahs: 64, place: "Medine", order: 102, theme: "Âyetü'n-Nûr (Göklerin ve Yerin Nuru), İffet, İfk Hadisesi, Tesettür ve Aile Mahremiyeti" },
  { no: 25, name: "Furkân", arabic: "الفرقان", ayahs: 77, place: "Mekke", order: 42, theme: "Hakkı Bâtıldan Ayıran Kitap, İbâdü'r-Rahmân (Rahmân'ın Seçkin Kullarının Özellikleri)" },
  { no: 26, name: "Şuarâ", arabic: "الشعراء", ayahs: 227, place: "Mekke", order: 47, theme: "Peygamberlerin Tevhid Daveti, Şairlerin Durumu ve 'İnne ma'iye Rabbî' Tevekkülü" },
  { no: 27, name: "Neml", arabic: "النمل", ayahs: 93, place: "Mekke", order: 48, theme: "Hz. Süleyman, Hüdhüd ve Karınca Vadisi, Belkıs Kıssası ve İlahi İlim" },
  { no: 28, name: "Kasas", arabic: "القصص", ayahs: 88, place: "Mekke", order: 49, theme: "Hz. Musa'nın Doğumu, Nil'e Bırakılışı, Medyen Yılları ve Karun'un Kibri" },
  { no: 29, name: "Ankebût", arabic: "العنكبوت", ayahs: 69, place: "Mekke", order: 85, theme: "İman İddiasının İmtihanı, Örümcek Ağı Misali Sahte Güçlerin Çürüklüğü" },
  { no: 30, name: "Rûm", arabic: "الروم", ayahs: 60, place: "Mekke", order: 84, theme: "Bizans'ın Zaferi Gayb Haberi, Evlilik ve Muhabbet Ayeti, Fıtrat Dini" },
  { no: 31, name: "Lokmân", arabic: "لقمان", ayahs: 34, place: "Mekke", order: 57, theme: "Hz. Lokman'ın Oğluna Öğütleri: Tevhid, Namaz, Sabır, Kibir Yasağı ve Anne-Babaya İyilik" },
  { no: 32, name: "Secde", arabic: "السجدة", ayahs: 30, place: "Mekke", order: 75, theme: "Vahyin Şüphesizliği, Yaratılış, Gece Namazı ve Secde Eden Müminler" },
  { no: 33, name: "Ahzâb", arabic: "الأحزاب", ayahs: 73, place: "Medine", order: 90, theme: "Hendek Savaşı Kuşatması, Üsve-i Hasene (En Güzel Örnek), Salavat Ayeti ve Ahzâb Birlikleri" },
  { no: 34, name: "Sebe'", arabic: "سبإ", ayahs: 54, place: "Mekke", order: 58, theme: "Hz. Davud ve Süleyman'ın Şükrü, Sebe Kavmi ve Arim Selinde Yok Oluşları" },
  { no: 35, name: "Fâtır", arabic: "فاطر", ayahs: 45, place: "Mekke", order: 43, theme: "Gökleri ve Yeri Yoktan Yaratan Allah, Âlimlerin Haşyeti ve Kur'an'a Vâris Olanlar" },
  { no: 36, name: "Yâsîn", arabic: "يس", ayahs: 83, place: "Mekke", order: 41, theme: "Kur'an'ın Kalbi, Risalet, Antakya ve Habîb-i Neccâr Kıssası, Yeniden Diriliş (Haşir)" },
  { no: 37, name: "Sâffât", arabic: "الصافات", ayahs: 182, place: "Mekke", order: 56, theme: "Sıra Sıra Dizilen Melekler, Hz. İbrahim'in Kurban İmtihanı ve Hz. Yunus" },
  { no: 38, name: "Sâd", arabic: "ص", ayahs: 88, place: "Mekke", order: 38, theme: "Zikir Dolu Kur'an, Hz. Davud'un Tövbesi, Hz. Eyyub'un Sabrı ve İblis'in İsyanı" },
  { no: 39, name: "Zümer", arabic: "الزمر", ayahs: 75, place: "Mekke", order: 59, theme: "Dini Yalnız Allah'a Has Kılmak, Rahmetinden Ümit Kesmeme Ayeti (Zümer 53)" },
  { no: 40, name: "Mü'min (Gâfir)", arabic: "غافر", ayahs: 85, place: "Mekke", order: 60, theme: "Günahları Bağışlayan ve Tövbeleri Kabul Eden, Firavun Hanedanından İmanını Gizleyen Mümin" },
  { no: 41, name: "Fussilet", arabic: "فصلت", ayahs: 54, place: "Mekke", order: 61, theme: "Âyetleri Açıklanmış Kitap, İnsanın Kendi Organlarının Şahitliği, Kâinattaki Âfâkî Deliller" },
  { no: 42, name: "Şûrâ", arabic: "الشورى", ayahs: 53, place: "Mekke", order: 62, theme: "İstişare Prensibi, Peygamberlerin Ortak Şeriatı ve İlahi Vahyin Teşekkülü" },
  { no: 43, name: "Zuhruf", arabic: "الزخرف", ayahs: 89, place: "Mekke", order: 63, theme: "Dünya Hayatının Altın ve Yaldızı, Kur'an'ın Rehberliği ve Hakiki Zenginlik" },
  { no: 44, name: "Duhân", arabic: "الدخان", ayahs: 59, place: "Mekke", order: 64, theme: "Mübarek Gecede İndirilen Kitap, Gökyüzünü Kaplayan Duman ve Firavun'un Sonu" },
  { no: 45, name: "Câsiye", arabic: "الجاثية", ayahs: 37, place: "Mekke", order: 65, theme: "Diz Üstü Çöken Ümmetler, Dehrîlerin İtirazı ve İlahî Hüküm Günü" },
  { no: 46, name: "Ahkâf", arabic: "الأحقاف", ayahs: 35, place: "Mekke", order: 66, theme: "Kum Tepeleri Kavmi Âd, Anne-Babaya İyilik ve Kur'an Dinleyen Cinler" },
  { no: 47, name: "Muhammed", arabic: "محمد", ayahs: 38, place: "Medine", order: 95, theme: "İman Edenlerin Amellerinin Islahı, Cihad Hukuku ve Münafıkların Hali" },
  { no: 48, name: "Fetih", arabic: "الفتح", ayahs: 29, place: "Medine", order: 111, theme: "Hudeybiye Barışı ve Feth-i Mübîn, Bey'atü'r-Rıdvân, Ashabın Vasıfları" },
  { no: 49, name: "Hucurât", arabic: "الحجرات", ayahs: 18, place: "Medine", order: 106, theme: "İslam Ahlak ve Nezaket Anayasası: Gıybet, Tecessüs, Alay Yasağı, İman ve Takva Kardeşliği" },
  { no: 50, name: "Kâf", arabic: "ق", ayahs: 45, place: "Mekke", order: 34, theme: "İnsana Şah Damarından Daha Yakın Olan Allah, Ölüm Sekeratı ve Mahşer Çağrısı" },
  { no: 51, name: "Zâriyât", arabic: "الذاريات", ayahs: 60, place: "Mekke", order: 67, theme: "Genişleyen Evren Mucizesi, Cinlerin ve İnsanların Yalnızca Kulluk İçin Yaratılışı" },
  { no: 52, name: "Tûr", arabic: "الطور", ayahs: 49, place: "Mekke", order: 76, theme: "Tur Dağı, Beyt-i Ma'mur, Vuku Bulacak Kıyamet Azabı ve Cennet Nimetleri" },
  { no: 53, name: "Necm", arabic: "النجم", ayahs: 62, place: "Mekke", order: 23, theme: "Miraç Mucizesi, Sidretü'l-Müntehâ, 'O Hevasından Konuşmaz' ve Secde Âyeti" },
  { no: 54, name: "Kamer", arabic: "القمر", ayahs: 55, place: "Mekke", order: 37, theme: "Ayın Yarılması Mucizesi, 'Kur'an'ı Anlamak İçin Kolaylaştırdık' Nakaratı" },
  { no: 55, name: "Rahmân", arabic: "الرحمن", ayahs: 78, place: "Medine", order: 97, theme: "Kur'an'ın Gelini (Arûsü'l-Kur'ân), İki Denizin Birbirine Karışmaması, 31 Kez 'Hangi Nimetini Yalanlarsınız?' Nidası" },
  { no: 56, name: "Vâkıa", arabic: "الواقعة", ayahs: 96, place: "Mekke", order: 46, theme: "Kaçınılmaz Kıyamet, İnsanların 3 Gruba Ayrılması: Sâbikûn, Ashâb-ı Meymene, Ashâb-ı Meş'eme" },
  { no: 57, name: "Hadîd", arabic: "الحديد", ayahs: 29, place: "Medine", order: 94, theme: "Demirin Gökten İndirilmesi ve Kuvveti, Allah Yolunda İnfak ve Kalplerin Yumuşaması" },
  { no: 58, name: "Mücâdele", arabic: "المجادلة", ayahs: 22, place: "Medine", order: 105, theme: "Zihar Yapan Kadının Şikayetini İşiten Allah, Gizli Fısıldaşmalar ve Hizbullah" },
  { no: 59, name: "Haşr", arabic: "الحشر", ayahs: 24, place: "Medine", order: 101, theme: "Nadir Oğulları Sürgünü, 'Hüvallâhüllezî' Esma-i Hüsna Zirvesi ve Dağları Sarsan Kur'an" },
  { no: 60, name: "Mümtehine", arabic: "الممتحنة", ayahs: 13, place: "Medine", order: 91, theme: "Mekke'den Hicret Eden Kadınların İmtihanı, Gayrimüslimlerle İlişkiler ve Adalet" },
  { no: 61, name: "Saff", arabic: "الصف", ayahs: 14, place: "Medine", order: 109, theme: "'Yapmayacağınız Şeyi Niçin Söylersiniz?', Kurşunla Kaynatılmış Binalar Gibi Saf Tutmak" },
  { no: 62, name: "Cuma", arabic: "الجمعة", ayahs: 11, place: "Medine", order: 110, theme: "Kitap Yüklü Merkepler Misali, Cuma Namazı Emri ve Alışverişi Bırakıp Zikre Koşmak" },
  { no: 63, name: "Münâfikûn", arabic: "المنافقون", ayahs: 11, place: "Medine", order: 104, theme: "Münafıkların İkiyüzlülüğü, Abdullah b. Übeyy'in Sözleri ve Ölüm Gelmeden İnfak" },
  { no: 64, name: "Teğâbün", arabic: "التغابن", ayahs: 18, place: "Medine", order: 108, theme: "Büyük Aldanış Günü, Malların ve Evlatların Birer İmtihan Oluşu" },
  { no: 65, name: "Talâk", arabic: "الطلاق", ayahs: 12, place: "Medine", order: 99, theme: "Boşanma Hukuku, İddet Müddeti, 'Kim Allah'tan Korkarsa Ona Bir Çıkış Yolu Nasip Eder'" },
  { no: 66, name: "Tahrîm", arabic: "التحريم", ayahs: 12, place: "Medine", order: 107, theme: "Aile Mahremiyeti, Firavun'un Mümin Hanımı Âsiye, Hz. Meryem ve Nasûh Tövbesi" },
  { no: 67, name: "Mülk (Tebâreke)", arabic: "الملك", ayahs: 30, place: "Mekke", order: 77, theme: "Kabir Azabına Kalkan, Hayat ve Ölümün İmtihan İçin Yaratılışı, Kusursuz Gökyüzü Nizamı" },
  { no: 68, name: "Kalem", arabic: "القلم", ayahs: 52, place: "Mekke", order: 2, theme: "Kaleme ve Satırlara Yemin, Peygamberimizin Yüce Ahlakı ('Ve inneke le'alâ hulukın azîm')" },
  { no: 69, name: "Hâkka", arabic: "الحاقة", ayahs: 52, place: "Mekke", order: 78, theme: "Kaçınılmaz Kıyamet Gerçeği, Amel Defterinin Sağdan ve Soldan Verilmesi" },
  { no: 70, name: "Meâric", arabic: "المعارج", ayahs: 44, place: "Mekke", order: 79, theme: "Yükseliş Dereceleri, İnsanın Sabırsız ve Açgözlü Fıtratı, Namaza Devam Edenler" },
  { no: 71, name: "Nûh", arabic: "نوح", ayahs: 28, place: "Mekke", order: 71, theme: "Hz. Nuh'un 950 Yıllık Sabırlı Tebliği, İstiğfarın Bereketi ve Tufan Helaki" },
  { no: 72, name: "Cin", arabic: "الجن", ayahs: 28, place: "Mekke", order: 40, theme: "Kur'an Dinleyip İman Eden Cinler, Gayb İlimleri ve Tevhid Vurgusu" },
  { no: 73, name: "Müzzemmil", arabic: "المزمل", ayahs: 20, place: "Mekke", order: 3, theme: "Örtüsüne Bürünen Peygamber, Gece Kıyamı (Teheccüd), Kur'an'ı Tertil ile Okuma Emri" },
  { no: 74, name: "Müddessir", arabic: "المدثر", ayahs: 56, place: "Mekke", order: 4, theme: "'Kalk ve Uyar!', Elbiseni Temiz Tut, Sekar Cehennemi ve 19 Koruyucu Melek" },
  { no: 75, name: "Kıyâme", arabic: "القيامة", ayahs: 40, place: "Mekke", order: 31, theme: "Kıyamet Günü, Kendini Kınayan Nefs-i Levvâme, Parmak Uçlarının Yeniden Yaratılışı" },
  { no: 76, name: "İnsân", arabic: "الإنسان", ayahs: 31, place: "Medine", order: 98, theme: "İnsanın Yokluktan Varlığa Çıkarılışı, Yoksula, Yetim ve Esire Karşılıksız Yediren Ebrar" },
  { no: 77, name: "Mürselât", arabic: "المرسلات", ayahs: 50, place: "Mekke", order: 33, theme: "Birbiri Ardınca Gönderilen Rüzgarlar ve Melekler, Yalanlayanların Vay Haline!" },
  { no: 78, name: "Nebe (Amme)", arabic: "النبإ", ayahs: 40, place: "Mekke", order: 80, theme: "Büyük Haber (Kıyamet), Yeryüzünün Beşik Dağların Kazık Kılınması, Sûr Üflenişi" },
  { no: 79, name: "Nâziât", arabic: "النازعات", ayahs: 46, place: "Mekke", order: 81, theme: "Ruhları Söküp Çıkaran Melekler, Hz. Musa ve Firavun'un Haddini Aşması, Tâme-i Kübrâ" },
  { no: 80, name: "Abese", arabic: "عبس", ayahs: 42, place: "Mekke", order: 24, theme: "Âmâ Sahabi Abdullah İbn Ümmü Mektûm Nüzul Sebebi, İlahî İkaz ve Mahşer Kaçışı" },
  { no: 81, name: "Tekvîr", arabic: "التكوير", ayahs: 29, place: "Mekke", order: 7, theme: "Güneşin Dürülmesi, Yıldızların Dökülmesi, Diri Diri Gömülen Kız Çocuğuna Sorulması" },
  { no: 82, name: "İnfitâr", arabic: "الانفطار", ayahs: 19, place: "Mekke", order: 82, theme: "Göğün Yarılması, 'Ey İnsan! Seni Kerîm Olan Rabbine Karşı Ne Aldattı?' Hitabı" },
  { no: 83, name: "Mutaffifîn", arabic: "المطففين", ayahs: 36, place: "Mekke", order: 86, theme: "Ölçü ve Tartıda Hile Yapanlar, İlliyyûn ve Siccîn Defterleri" },
  { no: 84, name: "İnşikâk", arabic: "الانشقاق", ayahs: 25, place: "Mekke", order: 83, theme: "Göğün Çatlaması, İnsanın Rabbine Doğru Çabası ve Amel Defterinin Verilişi" },
  { no: 85, name: "Bürûc", arabic: "البروج", ayahs: 22, place: "Mekke", order: 27, theme: "Burçlar Sahibi Gökyüzü, Ashâb-ı Uhdûd (Ateş Hendekleri Şehitleri) ve Levh-i Mahfûz" },
  { no: 86, name: "Târık", arabic: "الطارق", ayahs: 17, place: "Mekke", order: 36, theme: "Gece Gelen Delip Geçen Parlak Yıldız, İnsanın Koruyucusu ve Sırların Açılacağı Gün" },
  { no: 87, name: "A'lâ", arabic: "الأعلى", ayahs: 19, place: "Mekke", order: 8, theme: "Yüce Rabbin İsmini Tesbih, Peygamberimize Kur'an'ı Unutturmama Müjdesi" },
  { no: 88, name: "Gâşiye", arabic: "الغاشية", ayahs: 26, place: "Mekke", order: 68, theme: "Her Şeyi Kaplayan Kıyamet, Devenin Yaratılışı, Dağların Dikilişi ve İlahî Hatırlatma" },
  { no: 89, name: "Fecr", arabic: "الفجر", ayahs: 30, place: "Mekke", order: 10, theme: "Tanyerine ve On Geceye Yemin, İrem Şehri Helaki, Nefs-i Mutmainne Çağrısı" },
  { no: 90, name: "Beled", arabic: "البلد", ayahs: 20, place: "Mekke", order: 35, theme: "Mekke Şehrine Yemin, İnsanın Zorluklar İçinde Yaratılışı ve Sarp Yokuşu Aşmak (Yetimi Doyurmak)" },
  { no: 91, name: "Şems", arabic: "الشمس", ayahs: 15, place: "Mekke", order: 26, theme: "Güneşe, Aya ve Nefse 11 Yemin; 'Nefsini Arındıran Kurtuldu, Kirleten Ziyan Etti'" },
  { no: 92, name: "Leyl", arabic: "الليل", ayahs: 21, place: "Mekke", order: 9, theme: "Gece ve Gündüz Zıtlığı, Cömertlik Edip Sakınana Kolaylığın Kolaylaştırılması" },
  { no: 93, name: "Duhâ", arabic: "الضحى", ayahs: 11, place: "Mekke", order: 11, theme: "Vahyin Kesilme Hüznü, 'Rabbin Seni Terk Etmedi ve Darılmadı', Yetimi Ezmeme Öğüdü" },
  { no: 94, name: "İnşirâh", arabic: "الشرح", ayahs: 8, place: "Mekke", order: 12, theme: "Göğsün Genişletilmesi, Ağır Yükün Kaldırılması, 'Her Zorlukla Beraber Mutlaka Bir Kolaylık Vardır'" },
  { no: 95, name: "Tîn", arabic: "التين", ayahs: 8, place: "Mekke", order: 28, theme: "İncir, Zeytin ve Sina Dağına Yemin; İnsanın En Güzel Surette (Ahsen-i Takvîm) Yaratılışı" },
  { no: 96, name: "Alak", arabic: "العلق", ayahs: 19, place: "Mekke", order: 1, theme: "İlk İnen Vahiy: 'Yaratan Rabbinin Adıyla Oku!', Kalemle Öğretme ve Ebû Cehil'in Kibri" },
  { no: 97, name: "Kadir", arabic: "القدر", ayahs: 5, place: "Mekke", order: 25, theme: "Kur'an'ın İndirildiği Kadir Gecesi, Bin Aydan Hayırlı Gece, Meleklerin ve Ruh'un İnişi" },
  { no: 98, name: "Beyyine", arabic: "البينة", ayahs: 8, place: "Medine", order: 100, theme: "Apaçık Delil Kur'an, Dini Yalnızca Allah'a Halis Kılma ve Yaratılmışların En Hayırlıları" },
  { no: 99, name: "Zilzâl", arabic: "الزلزلة", ayahs: 8, place: "Medine", order: 93, theme: "Yerin Dehşetle Sarsılışı, Toprağın Konuşması, Zerre Ağırlığınca Hayır ve Şerrin Görülmesi" },
  { no: 100, name: "Âdiyât", arabic: "العاديات", ayahs: 11, place: "Mekke", order: 14, theme: "Soluk Soluğa Koşan Savaş Atları, İnsanın Nankörlüğü ve Kabirdekilerin Dışarı Atılması" },
  { no: 101, name: "Kâria", arabic: "القارعة", ayahs: 11, place: "Mekke", order: 30, theme: "Yürekleri Çarpan Kıyamet, İnsanların Saçılmış Pervaneler Dağların Atılmış Yün Gibi Oluşu" },
  { no: 102, name: "Tekâsür", arabic: "التكاثر", ayahs: 8, place: "Mekke", order: 16, theme: "Çoklukla Övünme Tutkusu ve Kabirleri Ziyaret, Nimetlerden Mutlaka Hesaba Çekilme" },
  { no: 103, name: "Asr", arabic: "العصر", ayahs: 3, place: "Mekke", order: 13, theme: "Asra Yemin; İnsan Hüsrandadır, Ancak İman Eden, Salih Amel İşleyen, Hakkı ve Sabrı Tavsiye Edenler Müstesna" },
  { no: 104, name: "Hümeze", arabic: "الهمزة", ayahs: 9, place: "Mekke", order: 32, theme: "Arkadan Çekiştiren, Ayıp Arayan ve Malını Sayıp Sonsuz Sananların Hutame Cehennemi" },
  { no: 105, name: "Fîl", arabic: "الفيل", ayahs: 5, place: "Mekke", order: 19, theme: "Ebrehe'nin Fil Ordusunun Kâbe Baskını ve Ebâbîl Kuşlarının Pişkin Tuğla Taşlarıyla Yok Oluş" },
  { no: 106, name: "Kureyş", arabic: "قريش", ayahs: 4, place: "Mekke", order: 29, theme: "Kureyş'in Kış ve Yaz Ticaret Güvenliği, Açlıktan Doyuran ve Korkudan Emin Kılan Kâbe'nin Rabbine Kulluk" },
  { no: 107, name: "Mâûn", arabic: "الماعون", ayahs: 7, place: "Mekke", order: 17, theme: "Dini Yalanlayan, Yetimi İtip Kakan, Namazlarından Gafil Olan, Gösteriş Yapan ve Ufacık Yardımı Esirgeyenler" },
  { no: 108, name: "Kevser", arabic: "الكوثر", ayahs: 3, place: "Mekke", order: 15, theme: "Tükenmez Hayır Kevser'in Verilişi, 'Rabbin İçin Namaz Kıl ve Kurban Kes', Asıl Soyu Kesik Olanın Düşman Oluşu" },
  { no: 109, name: "Kâfirûn", arabic: "الكافرون", ayahs: 6, place: "Mekke", order: 18, theme: "Tevhid ile Şirkin Uzlaşmazlığı: 'Ben Sizin Taptıklarınıza Tapmam, Sizin Dininiz Size Benim Dinim Bana'" },
  { no: 110, name: "Nasr", arabic: "النصر", ayahs: 3, place: "Medine", order: 114, theme: "Allah'ın Yardımı ve Mekke Fethi, İnsanların Dalga Dalga İslâm'a Girmesi ve İstiğfar Emri" },
  { no: 111, name: "Tebbet (Mesed)", arabic: "المسد", ayahs: 5, place: "Mekke", order: 6, theme: "Ebû Leheb ve Karısının İhaneti, İki Elinin Kuruması ve Boynundaki Hurma Lifinden İp" },
  { no: 112, name: "İhlâs", arabic: "الإخلاص", ayahs: 4, place: "Mekke", order: 22, theme: "Saf Tevhid Manifestosu: 'De ki: O Allah Bir'dir. Allah Samed'dir. Doğurmamış ve Doğmamıştır. Hiçbir Dengi Yoktur'" },
  { no: 113, name: "Felak", arabic: "الفلق", ayahs: 5, place: "Mekke", order: 20, theme: "Sabahın Rabbine Sığınma; Karanlığın Şerrinden, Düğümlere Üfleyen Büyücülerden ve Hasetçinin Hasedinden Korunma" },
  { no: 114, name: "Nâs", arabic: "الناس", ayahs: 6, place: "Mekke", order: 21, theme: "İnsanların Rabbine, Hükümranına ve İlahına Sığınma; Kalplere Sinsice Vesvese Veren Cin ve İnsan Şeytanlarından Korunma" }
];

// =============================================================================
// ÖZEL HAZIRLANMIŞ MEŞHUR ÂYETLER KÜTÜPHANESİ (HİKÂYE, ESBÂB-I NÜZÛL, TEFSİRLER)
// =============================================================================
const PROMINENT_AYAH_STORIES = {
  // 1:1 - Fâtiha Başı (Besmele)
  "1:1": {
    storyTitle: "Besmele-i Şerîfe'nin Nüzulü ve Kâinatın Anahtarı",
    story: `İbn Abbas (r.a.) şöyle rivayet eder: Hz. Peygamber (s.a.v.) Cebrail (a.s.) kendisine "Bismillâhirrahmânirrahîm"i indirinceye kadar sûrelerin bittiğini ve yenisinin başladığını kesin olarak bilmezdi. Mekke döneminde müşrikler putlarının adıyla (Lât ve Uzzâ adına) işlerine başlarken, İslâm bu âyetle bütün varlığı yalnızca Rahmân ve Rahîm olan Allah'ın ismiyle başlatma inkılabını getirdi. Besmele, kâinat kitabının ve Mushaf-ı Şerif'in ilk anahtarıdır.`,
    scholars: {
      ibnKesir: "Besmele, her hayırlı amelin mukaddimesidir. Hadis-i şerifte: 'Besmele ile başlanmayan her mühim iş bereketsiz ve güdüktür (ebter)' buyrulmuştur. İbn Kesîr, buradaki 'Rahmân' isminin yalnız Cenâb-ı Hakk'a mahsus olup dünyada mümin-kâfir ayrımı yapmaksızın tüm mahlûkâta şamil olduğunu; 'Rahîm' isminin ise hususiyle ahirette mümin kullarına tecelli edecek merhameti ifade ettiğini vurgular.",
      razi: "Fahreddin er-Râzî, Besmele'deki sırları tahlil ederken aklî ve kelamî bir şaheser ortaya koyar: 'Allah lafzı zâtı, Rahmân ezelî ve umumi nimeti, Rahîm ise ebedî saadeti remzeder. İnsan varlığa çıkarken Rahmân'ın lütfuyla yaratılmış, hata edince Rahîm'in mağfiretiyle korunmuştur. Bu âyet, kulun aczini itiraf edip mutlak kudrete sığınma fermanıdır.'",
      kurtubi: "İmam Kurtubî ahkâm açısından ele alır: İmam Şâfiî'ye göre Besmele, Fâtiha'nın müstakil bir âyetidir ve namazda okunması farzdır. İmam Mâlik'e göre ise sûrelerin arasını ayıran teberrük âyetidir. Kurtubî, helal hayvan kesiminden yemeğe ve yazıya kadar her meşru fiilde Besmele'nin fıkhî lüzumunu ve bereketini açıklar.",
      taberi: "İmam Taberî, ilk müfessirlerin nakillerini cem ederek der ki: 'Allah Teâlâ peygamberine ve onun şahsında bütün kullarına terbiye vermiştir. Yapacağınız her fiilden önce benim adımı anın ki o amel meşruiyet ve nur kazansın.'",
      elmalili: "Elmalılı Hamdi Yazır, Türk tefsir klasiğinde Besmele'yi 'Kâinatın Nüvesi' olarak niteler: 'Bismillah demek, ben bu işi kendi cılız nefsim adına değil, kâinatın Hâlıkı ve Mâliki olan Allah adına icra ediyorum demektir. Bu şuur insana kâinat çapında bir mesuliyet ve kudret aşılar.'",
      gazali: "İmam-ı Gazâlî, İhyâ'da kalbî boyutu serer: 'Besmele'yi sadece dilinle söyleyip kalbini gaflette bırakma. Allah dediğinde O'nun azametini, Rahmân dediğinde nimetlerini, Rahîm dediğinde günahlarına rağmen seni hemen cezalandırmayan sabrını tefekkür et. Kalp titremeli, dil öyle telaffuz etmelidir.'"
    },
    lessons: [
      "Güne, söze, karara ve her işe Allah'ın adıyla başlamak ameli ibadete dönüştürür.",
      "Rahmân tecellisi bize bütün mahlukata şefkatle yaklaşma ahlakı kazandırır.",
      "Kendi gücümüze değil, sonsuz kudret ve merhamete sığınmanın huzurunu yaşatır."
    ],
    lugat: "B-S-M (İsim kökü): Bir şeyi belirgin kılan alâmet. ALLAH: İbadete layık tek zât. RAHMÂN: Özünde merhamet sahibi (mübalağa). RAHÎM: Merhametini fiilen tecelli ettiren."
  },

  // 1:5 - İyyâke na'büdü ve iyyâke nesta'în
  "1:5": {
    storyTitle: "Kulluk ve Tevhidin Zirve Ahdi: İyyâke Na'büdü",
    story: `Fâtiha Suresi'nin tam kalbinde yer alan bu âyet, kulu 'üçüncü şahıs' (gıyab) kipinden doğrudan Cenâb-ı Hakk'ın huzuruna (hitap makamına) yükseltir. İlk dört âyette Allah'ın kemal sıfatlarını ikrar eden kul, beşinci âyette adeta miracın manevi basamağına vararak doğrudan 'Yalnız Sana kulluk ederiz ve yalnız Senden yardım dileriz' der. Bu, bütün şirk, riya ve sahte güçlere karşı mutlak bir istiklal beyannamesidir.`,
    scholars: {
      ibnKesir: "İbn Kesîr şöyle nakleder: Bu âyette ibadet yardım istemekten öne alınmıştır; çünkü vesile gayeden önce gelir. Kul önce kulluğunu arz eder, sonra yardım talep eder. Hadis-i Kudsî'de Allah Teâlâ buyurur: 'Bu âyet benimle kulum arasındadır. Kuluma istediği verilecektir.' Çoğul kipiyle 'ederiz/dileriz' denmesi, müminin cemaat şuurunu ve ümmet vahdetini simgeler.",
      razi: "Râzî der ki: 'Bu âyet kibir ve ümitsizlik hastalıklarının yegâne devasıdır. İyyâke na'büdü (Yalnız Sana kulluk ederiz) riyayı ve kibri yok eder; İyyâke nesta'în (Yalnız Senden dileriz) ise acziyeti giderip sahte sebeplere tapınmayı yıkar.'",
      kurtubi: "Kurtubî fıkhî ve ahlakî tahlilinde: Kulun kendi ameline güvenmesini men eder. İbadet etmek dahi ancak Allah'ın tevfiki ve yardımı iledir. Dolayısıyla kul ibadetiyle övünemez, çünkü o ibadeti yapabilmesi de yine Allah'ın yardımı iledir.",
      taberi: "Taberî: İbn Abbas'tan nakille: 'Yalnız Sana boyun eğer, yalnız Senin emrine itaat ederiz. Başkasına değil, yalnızca Sana iltica ederiz.'",
      elmalili: "Elmalılı: 'Arapça nahiv kaidesine göre mef'ûlün (İyyâke) fiilden önce gelmesi hasr (tahsis) ifade eder. Yani Sen'den gayrı hiçbir varlığa en ufak bir ubudiyyet ve istiane caiz değildir.'",
      gazali: "Gazâlî: 'Namaz kılan kimse dilinde İyyâke na'büdü derken kalbinde makam, şehvet veya insanların övgüsü varsa bu bir tenakuzdur. Hakiki tevhid, kalpte Allah'tan başka hiçbir efendinin kalmamasıdır.'"
    },
    lessons: [
      "Hayatta karşılaşılan hiçbir güç, zorluk veya otorite karşısında kula kulluk edilmez.",
      "Tüm meşru sebeplere sarıldıktan sonra neticeyi yalnızca Allah'tan beklemek gerekir.",
      "Dualarımızda yalnız kendimizi değil, 'biz' diyerek bütün mümin kardeşlerimizi kuşatmalıyız."
    ],
    lugat: "İYYÂKE: Yalnızca Sana (hasr). NA'BÜDÜ: İbadet ve itaat ederiz (ubûdiyyet kökü). NESTA'ÎN: Yardım, inayet ve muvaffakiyet dileriz (avn kökü)."
  },

  // 2:255 - Âyetü'l-Kürsî
  "2:255": {
    storyTitle: "Seyyidü Âyi'l-Kur'ân: Âyetü'l-Kürsî ve İsm-i A'zam Sırrı",
    story: `Hz. Peygamber (s.a.v.) bir gün Übey b. Ka'b'a: "Ey Ebü'l-Münzir! Allah'ın Kitabı'nda hangi âyet en büyüktür?" diye sordu. Übey: "Allahu lâ ilâhe illâ hüve'l-Hayyu'l-Kayyûm..." diye okuyunca Efendimiz onun göğsüne vurup: "İlim sana mübarek olsun ey Ebü'l-Münzir!" buyurdu. Âyet indiğinde yeryüzündeki putların sarsıldığı, şeytanların kaçıştığı rivayet edilir. İçerisinde 10 müstakil tevhid cümlesi barındıran bu âyet, Kur'an'ın en muazzam marifetullah haritasıdır.`,
    scholars: {
      ibnKesir: "İbn Kesîr: Bu âyet Allah Teâlâ'nın zâtı, sıfatları ve hâkimiyeti hakkında 10 ana esası vazeder. 'Uyuklama ve uyku O'nu tutmaz' ibaresi, yaratılmışların acziyetine mukabil O'nun her an kâinatı gözetlediğini gösterir. Resûlullah (s.a.v.) her farz namazın ardından bu âyeti okuyanın cennete girmesine yalnız ölümün engel olduğunu müjdelemiştir.",
      razi: "Fahreddin er-Râzî: Âyetü'l-Kürsî'deki 'Kürsî' kavramını felsefî ve kelamî derinlikle tahlil eder. Kürsî, Allah'ın cismanî bir tahtı değil; O'nun sonsuz ilminin, mutlak kudretinin ve mülkündeki tasarrufunun ihâtasıdır. Gökler ve yer O'nun kudreti karşısında bir çöle atılmış yüzük halkası gibidir.",
      kurtubi: "Kurtubî: Bu âyette İsm-i A'zam (en büyük ilahî isim) bulunmaktadır; bu isim el-Hayy (ezelî ve ebedî hayat sahibi) ve el-Kayyûm (bütün varlığı ayakta tutan) isimleridir. Varlık alemindeki hiçbir şey Allah'ın izni olmadan şefaat dahi edemez.",
      taberi: "Taberî: 'Gökleri ve yeri koruyup gözetmek O'na asla ağır gelmez.' İnsanlar en ufak bir mülkü korurken yorulup bıkarken, O milyarlarca galaksiyi ve zerreyi tek bir an gaflet olmaksızın yönetir.",
      elmalili: "Elmalılı: 'Bu âyet İslâm tevhid akidesinin kristalize olmuş halidir. Hiçbir şirk unsuru, hiçbir aracı ve hiçbir teslis safsatası bu berrak mantık karşısında barınamaz. Hayat O'ndan kaynaklanır, nizam O'nunla kaimdir.'",
      gazali: "Gazâlî: Kalp bu âyeti okurken ürpermeli ve teslim olmalıdır. 'O, kulların önlerindekini ve arkalarındakini bilir' dendiğinde, geçmişinin, geleceğinin ve göğsünde gizlediğin en gizli fısıltının O'na aşikâr olduğunu hissetmelisin."
    },
    lessons: [
      "Kâinatta tesadüfe, başıboşluğa yer yoktur; her an Hayy ve Kayyûm olan Allah'ın tasarrufundadır.",
      "Uykusu ve yorgunluğu olmayan bir Rabbe sığınan mümin, vesvese ve korkulardan azade olur.",
      "Gerçek ilim ve kudret Allah'a aittir; insanın bildiği ancak O'nun dilediği kadardır."
    ],
    lugat: "EL-HAYY: Ezelî ve ebedî diri, hayat veren. EL-KAYYÛM: Kendi zâtıyla kaim, her şeyi ayakta tutan. SİNEH: Uyuklama hali. NEVM: Derin uyku. KÜRSÎ: İlahî hükümranlık ve ilim alanı."
  },

  // 2:285 - Âmenerrasûlü
  "2:285": {
    storyTitle: "Miraç Hediyesi: Âmenerrasûlü ve Ağlayan Sahabeler",
    story: `Bakara Suresi'nin 284. âyeti ('İçinizdekini açığa vursanız da gizleseniz de Allah sizi onunla hesaba çeker') nazil olunca sahabeler dehşete düştü. Hz. Ebû Bekir, Hz. Ömer ve ashab gözyaşları içinde Efendimiz'e gelip diz çöktüler: 'Yâ Resûlallah! Namaz, oruç gibi amellere gücümüz yetiyor ama kalbimizden geçen vesveselerden nasıl kurtuluruz?' dediler. Efendimiz: 'İsrailoğulları gibi İşittik ve isyan ettik mi diyeceksiniz? İşittik ve itaat ettik deyiniz!' buyurdu. Sahabeler boyun eğip teslim olunca Allah Teâlâ bu teslimiyet üzerine 285 ve 286. âyetleri (Âmenerrasûlü) indirerek müminleri taltif etti ve 'Allah kimseye gücünün yettiğinden fazlasını yüklemez' müjdesiyle kalpleri teskin etti. Bu âyetler Miraç gecesinde vasıtasız vahyedilen ilahî hediyelerdendir.`,
    scholars: {
      ibnKesir: "İbn Kesîr: Hadiste buyrulur: 'Bakara sûresinin sonundaki iki âyeti geceleyin okuyana bu iki âyet her türlü keder ve kötülükten korunmak için yeter.' Peygamberler arasında ayrım yapmaksızın hepsine iman etmek İslâm'ın evrensel şümulünü gösterir.",
      razi: "Râzî: Bu âyet kulun teslimiyet mertebesini açıklar. Akıl ilahî emri anlamakta yetersiz kalsa dahi mümin 'Semi'nâ ve eta'nâ' (İşittik ve itaat ettik) der. İtaat ameli, gufran ise o ameldeki kusurların bağışlanması talebidir.",
      kurtubi: "Kurtubî: Âyette geçen 've ileyke'l-masîr' (Dönüş ancak Sana'dır) ifadesi, dünya hayatının bir imtihan olduğunu ve nihai mahkemenin Allah'ın huzurunda kurulacağını beyan eder.",
      taberi: "Taberî: Sahabenin ihlaslı itaati üzerine Allah'ın ağır teklifi nasıl hafiflettiğini ve 'Gufrâneke Rabbenâ' niyazının kabul olunuşunu nakleder.",
      elmalili: "Elmalılı: 'Bu âyet bir ümmetin iman manifestosudur. İman; Allah'a, meleklerine, kitaplarına ve peygamberlerine hiçbir tefrika sokmadan bir bütün olarak bağlanmaktır.'",
      gazali: "Gazâlî: Kulun 'Semi'nâ ve eta'nâ' deyişi sadece kuru bir iddia olmamalıdır. Emir geldiğinde nefsin hevasını çiğneyip Hakk'a boyun eğenler hakiki teslimiyet ehlidir."
    },
    lessons: [
      "Zorluklar karşısında isyan değil, 'İşittik ve itaat ettik' teslimiyeti ilahî rahmet kapılarını açar.",
      "Allah'ın dininde peygamberler arasında ayrım yapılmaz; İslâm bütün peygamberlerin hak dinidir.",
      "İbadet ve taat ne kadar çok olursa olsun, kul her daim 'Gufrâneke Rabbenâ' diyerek bağışlanma dilemelidir."
    ],
    lugat: "ÂMENE: İman etti, kalben tasdik etti. SEMİ'NÂ: İşittik, kavradık. ETA'NÂ: İtaat ettik, boyun eğdik. GUFRÂNEKE: Bağışlamanı dileriz. MASÎR: Varılacak son durak."
  },

  // 3:103 - Hep birlikte Allah'ın ipine sımsıkı sarılın
  "3:103": {
    storyTitle: "120 Yıllık Kan Davasını Bitiren Âyet: Evs ve Hazrec Barışı",
    story: `Medine'de Evs ve Hazrec kabileleri İslâm'dan önce tam 120 yıl boyunca süren kanlı Buâs harpleriyle birbirini tüketmişti. Peygamberimiz Medine'ye gelince bu iki düşman kabile İslâm potasında eriyip kardeş oldu. Bir gün yahudi Şas b. Kays, Evs ve Hazrec gençlerinin bir arada sevgiyle oturduğunu görünce hasedinden çatladı. Bir genci aralarına gönderip eski Buâs savaşında söylenen kışkırtıcı şiirleri okuttu. Gençler galeyana gelip kılıçlarına sarıldılar ve 'Silah başı! Karşılaşma yerimiz Harre olsun!' dediler. Hadiseyi duyan Efendimiz (s.a.v.) derhal olay yerine koştu ve: 'Ey Müslümanlar! Ben henüz aranızdayken yine cahiliye davası mı güdüyorsunuz? Allah sizi İslâm ile şereflendirip küfürden kurtarmışken tekrar ateşe mi döneceksiniz?' buyurdu. Sahabeler şeytanın fitnesine kapıldıklarını anlayıp kılıçlarını attılar ve ağlaşarak birbirlerine sarıldılar. İşte bu hadise üzerine bu muazzam vahdet âyeti indi.`,
    scholars: {
      ibnKesir: "İbn Kesîr: Âyetteki 'Hablullâh' (Allah'ın İpi) tabiri bizzat Kur'an-ı Kerim ve Allah'ın ahdidir. Hadiste: 'Kur'an, semadan yeryüzüne uzatılmış sağlam bir iptir. Ona sarılan kurtulur, bırakan helak olur' buyrulmuştur.",
      razi: "Râzî: Fırkalara ayrılmak (tefrika) toplumu zayıflatıp ateşe sürükler. Ayrılık zilleti, birlik ise izzeti doğurur. Tefrika şeytanın, vahdet ise Rahmân'ın emridir.",
      kurtubi: "Kurtubî: Fıkhî olarak bu âyet, ümmetin icmaına sarılmanın ve fitne çıkaran bozgunculara karşı uyanık olmanın farz olduğuna delildir.",
      taberi: "Taberî: İbn Mes'ud'dan rivayetle: 'Allah'ın ipi cemaattir. Hoşunuza gitmeyen şeylerle cemaatte kalmanız, nefsinizin hoşuna giden ayrılıktan çok daha hayırlıdır.'",
      elmalili: "Elmalılı: 'Uçuruma yuvarlanmakta olan bir topluluğu ancak yukarıdan sarkıtılan sağlam bir urgan kurtarabilir. O urgan Kur'an ve İslâm ahlakıdır. Onu bırakanlar kendi kabile ve ırk taassuplarının uçurumunda helak olurlar.'",
      gazali: "Gazâlî: Hakiki kardeşlik, kalplerin Allah sevgisinde birleşmesidir. Nefislerin ortaklığı dünyalık menfaat bitince dağılır; fakat Allah için kardeş olanların bağı ebedîdir."
    },
    lessons: [
      "Etnik köken, mezhep, hizip ve menfaat taassubu şeytanın ümmeti parçalama tuzağıdır.",
      "Kur'an ve sünnet etrafında kenetlenmek toplumsal dirliğin ve izzetin tek teminatıdır.",
      "Fitne ve kışkırtma karşısında anında teennî ile hareket edip kardeşlik hukuku korunmalıdır."
    ],
    lugat: "İ'TASIMÛ: Sımsıkı sarılın, tutunun (ısmet kökü). HABLİLLÂH: Allah'ın ipi (Kur'an ve İslâm). LÂ TEFERRAKÛ: Parçalanıp fırkalara bölünmeyin. ŞEFÂ: Uçurumun tam kenarı."
  },

  // 12:3 - Yûsuf Suresi Ahsenü'l-Kasas
  "12:3": {
    storyTitle: "Ahsenü'l-Kasas: Kıssaların En Güzeli ve İmtihanların Zirvesi",
    story: `Mekkeli müşrikler Medine Yahudilerine adam göndererek: 'Muhammed'in peygamber olup olmadığını nasıl anlarız?' diye sordular. Yahudi hahamlar: 'Ona Yakub'un oğlunun (Yusuf'un) Şam'dan Mısır'a nasıl gittiğini ve başından geçenleri sorun. Bunu ancak hakiki bir nebi bilebilir' dediler. Mekke'de müminlerin işkence ve boykot altında bunaldığı bir dönemde Allah Teâlâ bu sûreyi toptan indirerek hem Yahudilerin meydan okumasına cevap verdi hem de Hz. Yusuf'un kuyu, kölelik, iftira ve zindan zincirinden nasıl Mısır'ın azizliğine çıkarıldığını göstererek Resûlullah'a ve ashabına eşsiz bir sabır ve ümit aşıladı.`,
    scholars: {
      ibnKesir: "İbn Kesîr: Bu kıssaya 'Ahsenü'l-Kasas' (Kıssaların En Güzeli) denmesinin sebebi; içinde peygamberlerin, meleklerin, hükümdarların, kölelerin, âlimlerin, kadınların, hilelerin, sabrın, tevhidin ve affın en ibretli tablolarını bir arada barındırmasıdır.",
      razi: "Râzî: Yusuf kıssası gösterir ki, kuyuya atılmak helak değil saraya giden yoldur; zindan hapis değil ilahî terbiyenin medresesidir. İnsanların tuzakları Allah'ın takdirini engelleyemez.",
      kurtubi: "Kurtubî: Kıssa rüya tabirinden devlet yönetimine, kardeşler arası kıskançlıktan iffetin muhafazasına kadar pek çok fıkhî ve ahlakî hükmün kaynağıdır.",
      taberi: "Taberî: Sûrenin nüzul ortamında sahabenin yaşadığı ağır hüznü bu kıssanın nasıl sevinç ve dirence dönüştürdüğünü rivayetlerle izah eder.",
      elmalili: "Elmalılı: 'Bu kıssa bir beşerî dram değil, kaderin nakış nakış işlendiği ilahî bir tablodur. Kardeş hasediyle başlayan serüven, cihanşümul bir af ve merhametle taçlanır.'",
      gazali: "Gazâlî: Yusuf'un Züleyha karşısındaki iffeti, nefsin arzusunu Allah korkusuna feda etmenin timsalidir. Kalbini şehvetin kölesi yapmayan insan, zindanda olsa dahi hürdür."
    },
    lessons: [
      "Zorluklar ve haksızlıklar, Allah'ın samimi kulları için birer yükseliş basamağıdır.",
      "Kardeş kıskançlığı ve haset, aileleri yıkan en tehlikeli manevi zehirdir.",
      "Sabır ve takva ile hareket eden kul, eninde sonunda hakkına kavuşur ve izzete erer."
    ],
    lugat: "AHSEN: En güzel, en yetkin. EL-KASAS: Tarihi hakikatleri adım adım takip ederek anlatılan kıssa. GÂFİLÎN: Önceden bundan habersiz olanlar."
  },

  // 18:10 - Kehf Suresi Mağara Gençleri
  "18:10": {
    storyTitle: "Ashâb-ı Kehf: Putperest İmparatora Meydan Okuyan Mağara Gençleri",
    story: `Roma İmparatoru Dakyanus (Decius) putlara kurban kesmeyen herkesi acımasızca katlediyordu. Sarayda yüksek mevki sahibi olan bir grup asil genç, sarayın şatafatını ve putperestliği terk ederek tek olan Allah'a iman ettiler. İnançlarını imparatorun yüzüne haykırdıktan sonra idam edilmemek için yanlarındaki köpekleri (Kıtmîr) ile birlikte şehirden kaçıp dağdaki bir mağaraya sığındılar. Mağaranın kapısında ellerini semaya açıp: 'Rabbimiz! Bize katından bir rahmet ver ve işimizde bize bir kurtuluş yolu lütfet!' diye yalvardılar. Allah Teâlâ bu samimi duayı kabul ederek onları 309 yıl süren mucizevi bir uykuya daldırdı ve zalim krallık tarihten silindikten sonra uyandırdı.`,
    scholars: {
      ibnKesir: "İbn Kesîr: Bu gençlerin kıssası, hakikati arayan gençlerin batıl düzene boyun eğmeyişinin şaheseridir. Allah'a sığınan kimseyi mağara saraydan daha geniş ve emniyetli kılar.",
      razi: "Râzî: Âyette 'gençler' (fityeh) denmesi manidardır. Gençlik dönemi hevanın ve arzuların en coşkulu olduğu çağdır. Buna rağmen onlar nefislerini değil imanı seçmişlerdir.",
      kurtubi: "Kurtubî: Zulümden kaçıp dini ve imanı muhafaza etmek için hicret etmenin cevazına ve lüzumuna bu âyet delildir.",
      taberi: "Taberî: İbn Abbas'tan nakille mağaranın coğrafi konumunu, güneşin sağdan ve soldan onları rahatsız etmeyecek şekilde doğup batmasını ilahî nizam delili olarak anlatır.",
      elmalili: "Elmalılı: 'Dünya zulümle dolsa dahi bir avuç gencin ihlaslı imanı koca bir imparatorluğun karanlığını aydınlatmaya yeter. Mağara sembolü, müminin kalbindeki tahassüngâhtır.'",
      gazali: "Gazâlî: Ashâb-ı Kehf'in duası tam bir acziyet ve tevekkül duasıdır: 'Ve heyyi' lenâ min emrinâ reşedâ' (İşimizde bizi doğruya ulaştır). Kendi aklına değil, Allah'ın rüşd ve irşadına güvenen yolunu şaşırmaz."
    },
    lessons: [
      "Hakikat çoğunluğun değil, ihlasla Allah'a bağlanan samimi yüreklerin yanındadır.",
      "İman uğruna feda edilen konfor ve lüks, ilahî rahmet ve ebedî şeref olarak geri döner.",
      "En dar ve çaresiz anlarda dahi ümitsizliğe düşmeyip mağara duasını zikir edinmek gerekir."
    ],
    lugat: "EVÂ: Sığındı, iltica etti. EL-KEHF: Dağdaki geniş mağara. FİTYEH: İmanlı, cesur ve civanmert gençler. REŞEDÂ: Doğruluk, isabet ve hayırlı kurtuluş yolu."
  },

  // 36:20 - Yâsîn Habib-i Neccar
  "36:20": {
    storyTitle: "Şehrin En Uzak Ucundan Koşarak Gelen Yiğit: Habîb-i Neccâr",
    story: `Antakya şehrine İsa (a.s.) tarafından tevhidi tebliğ etmek üzere iki elçi gönderilmiş, onlar yalanlanınca üçüncü bir elçiyle desteklenmişti. Şehir halkı elçileri taşlamak ve işkenceyle öldürmekle tehdit ettiğinde, şehrin en uzak yerinden marangozluk yapan Habîb-i Neccâr isimli bir mümin koşarak geldi. 'Ey kavmim! Sizden hiçbir ücret istemeyen ve doğru yolda olan bu elçilere uyun!' diye haykırdı. Gözü dönmüş putperest kavim bu fedakâr adamı acımasızca şehit etti. O ise son nefesini verirken ve cennete girerken dahi kavmine kin gütmeyip: 'Keşke kavmim Rabbimin beni bağışladığını ve ikram edilenlerden kıldığını bilseydi!' diyerek merhamet abidesi oldu.`,
    scholars: {
      ibnKesir: "İbn Kesîr: Bu âyet, bâtıl karşısında susmayan ve hakikati tebliğ etmek için mesafeleri hiçe sayıp koşan hakiki dava adamının portresidir. Habîb-i Neccâr hayatında da ölümünde de kavminin hayrını istemiştir.",
      razi: "Râzî: Akıllı bir insanın iki ölçüsü vardır: 1. Tebliğcinin dünyalık bir menfaat ve ücret istememesi, 2. Anlattığı davanın akl-ı selime uygun olması. Habîb bu iki bürhan ile kavmini susturmuştur.",
      kurtubi: "Kurtubî: İyiliği emredip kötülükten men etme (Emr-i bi'l-maruf) yolunda canını feda eden şehitlerin faziletine bu âyet kesin hüccettir.",
      taberi: "Taberî: Habîb'in marangozluk yapıp kazancının yarısını fakirlere dağıtan velî bir zat olduğunu rivayet eder.",
      elmalili: "Elmalılı: 'Şehrin öte başından koşmak; tembelliği, nemelazımcılığı ve korkaklığı ayaklar altına alıp hakikat yangınını söndürmek için canını ortaya koymaktır.'",
      gazali: "Gazâlî: Hakiki mümin kalbinde kin ve intikam barındırmaz. Şehit edilirken bile 'Kavmim bilseydi' diyen Habîb, nebevî ahlakın zirvesini temsil eder."
    },
    lessons: [
      "Toplum sapkınlığa sürüklendiğinde 'Bana ne' demeyip hakkı haykırmak müminin boynunun borcudur.",
      "Hak davanın tebliğinde kimseden menfaat, alkış veya ücret beklenmez.",
      "Kötülük edenlere karşı dahi kalpte hidayet temennisi ve merhamet taşımak velâyet alâmetidir."
    ],
    lugat: "CÂE: Geldi. AKSÂ: En uzak uç, sınır. YES'Â: Hızla koşarak, çaba göstererek. İTTEBİ'Û: Uyun, tabi olun. ECRAN: Ücret, dünyalık bedel."
  },

  // 67:1 - Mülk (Tebâreke)
  "67:1": {
    storyTitle: "Kabir Azabına Zırh: Mülk Suresi ve Kainat Nizamı",
    story: `Peygamber Efendimiz (s.a.v.) bu sûre hakkında şöyle buyurmuştur: 'Kur'an'da otuz âyetlik bir sûre vardır ki, bir adama şefaat etmiş ve nihayet o adam bağışlanmıştır. O sûre Tebârekellezî bi-yedihi'l-mülk sûresidir.' Başka bir hadiste ise bu sûrenin kabir azabını engelleyen bir 'Mânia' ve koruyucu bir 'Münciye' olduğu bildirilmiştir. Âyet, kâinatın mülk ve tasarrufunun bütünüyle Allah'ın kudret elinde olduğunu ve ölüm ile hayatın hangimizin daha güzel amel yapacağını sınamak için yaratıldığını ilan eder.`,
    scholars: {
      ibnKesir: "İbn Kesîr: Tebâreke lafzı, Allah'ın hayır ve bereketinin sonsuzluğunu, yüceliğini ve noksanlıklardan münezzeh olduğunu ifade eder. Mülk O'nundur; dilediğini aziz, dilediğini zelil kılar.",
      razi: "Râzî: Ölüm bir yok oluş değil; bu âyette hayat gibi müstakil bir 'yaratılış' (halaka'l-mevte ve'l-hayâte) olarak zikredilmiştir. Hayat amel etme, ölüm ise o amelin semeresini biçme mekânına geçiştir.",
      kurtubi: "Kurtubî: Âyette 'hanginizin daha çok amel yapacağı' değil, 'hanginizin DAHA GÜZEL amel yapacağı' (ehsenü amelen) buyrulmuştur. Mühim olan amelin kemiyeti (çokluğu) değil, ihlas ve keyfiyetidir.",
      taberi: "Taberî: Resûlullah'ın bu sûreyi her gece okumadan uyumadığını ve ashabına da bunu tavsiye ettiğini nakleder.",
      elmalili: "Elmalılı: 'Bu âyet dünya hayatının bir oyun ve eğlence olmadığını, her nefesin ilahî bir test ve sınav gereği bahşedildiğini haykırır.'",
      gazali: "Gazâlî: Ölümü sıkça tefekkür etmek kalbin pasını siler, tûl-i emeli (dünyaya kazık çakma arzusunu) kırar. Kabir azabından emin olmak isteyen, Mülk sûresinin ahkâmıyla amel etmelidir."
    },
    lessons: [
      "Varlık aleminde mutlak malik ve tasarruf sahibi Allah'tır; insanın sahiplik iddiaları emanettir.",
      "Hayat da ölüm de başıboş değildir; asıl hedef amelin 'en güzeli'ni (ihlaslı olanını) üretmektir.",
      "Her gece bu sûreyi okuyup tefekkür etmek kabir karanlığına bir nur feneri olur."
    ],
    lugat: "TEBÂREKE: Şanı yüce, bereketi ve lütfu sonsuz oldu. BİYEDİHİ: O'nun kudret elindedir. EL-MÜLK: Hükümranlık, egemenlik. KADÎR: Her şeye gücü yeten."
  },

  // 93:1 - Duhâ Suresi
  "93:1": {
    storyTitle: "Hüznün Dağıldığı An: 'Rabbin Seni Terk Etmedi ve Darılmadı'",
    story: `Mekke'de bir müddet vahiy kesilmişti (Fetret-i Vahiy). Cebrail (a.s.) gelmeyince Peygamberimiz derin bir hüzne boğuldu; 'Acaba Rabbimi incitecek bir hata mı yaptım?' diye kıvranıyordu. Ebû Leheb'in karısı Ümmü Cemîl yanına gelip alayla: 'Ey Muhammed! Görüyorum ki şeytanın seni terk etmiş, artık sana uğramıyor!' dedi. Efendimiz bu zehirli sözlere çok üzüldü. İşte tam bu kırılma anında semadan Duhâ Sûresi indi: 'Kuşluk vaktine ve sükûna erdiği zaman geceye yemin olsun ki; Rabbin seni terk etmedi ve sana darılmadı!' Bu âyetler Efendimiz'in yaralı kalbine en tatlı merhem oldu.`,
    scholars: {
      ibnKesir: "İbn Kesîr: Kuşluk vakti aydınlığı, gece ise sükuneti temsil eder. Vahyin gelişi aydınlık, gecikmesi ise dinlenme ve şevki artırma dönemidir. Allah sevdiği kulunu asla terk etmez.",
      razi: "Râzî: Âyetteki 've mâ kalâ' (sana darılmadı) ifadesinde edeb-i ilahî vardır. 'Seni terk etmedi' derken 'sen' zamiri kullanılmış, fakat 'darılmadı' derken kırıcı olmasın diye muhatap zamiri dahi zikredilmemiştir.",
      kurtubi: "Kurtubî: Sûrenin sonundaki 'Yetimi sakın ezme, isteyeni azarlama, Rabbinin nimetini anlat' emirleri, kulun kendi geçmişteki acılarını unutmaksızın mazlumlara kol kanat germesi gerektiğini gösterir.",
      taberi: "Taberî: Bu sûre indiğinde Resûlullah'ın ferahlayıp 'Allahu Ekber' diyerek tekbir getirdiğini ve o günden beri Duhâ'dan itibaren sûre sonlarında tekbir getirmenin sünnet olduğunu anlatır.",
      elmalili: "Elmalılı: 'Her müminin hayatında fetret, yalnızlık ve imtihan geceleri olur. Fakat arkasından mutlaka ilahî bir Duhâ (kuşluk aydınlığı) doğacaktır.'",
      gazali: "Gazâlî: Kul, duaları hemen kabul edilmeyince veya kalbine darlık gelince Allah'ın kendisini terk ettiğini zannetmemelidir. Vahyin kesilmesi gibi, kulun sabrı ve iştiyakı sınanmaktadır."
    },
    lessons: [
      "Hüzün ve yalnızlık anlarında şeytanın vesveselerine kulak asmayıp Allah'ın rahmetine sığınmalıdır.",
      "Gelecek, geçmişten ve şu anki meşakkatten mutlaka daha hayırlı olacaktır ('Ve le'l-âhiratü hayrun leke mine'l-ûlâ').",
      "Yetimi korumak, yoksulu doyurmak ve muhtaç olanı azarlamamak şükrün fiilî ifadesidir."
    ],
    lugat: "ED-DUHÂ: Güneşin yükseldiği aydınlık kuşluk vakti. SECÂ: Karanlığı çöküp sakinleştiği an. VE MA KALÂ: Seni asla terk etmedi, darılmadı."
  },

  // 94:1 - İnşirâh Suresi
  "94:1": {
    storyTitle: "Genişleyen Göğüsler: 'Her Zorlukla Beraber Bir Kolaylık Vardır'",
    story: `Müşriklerin zulmü, tebliğin ağırlığı ve Mekke sokaklarındaki alaylar Peygamberimiz'in göğsünü daraltıyordu. Fakir ve zayıf müminlerin çektiği işkenceler Efendimiz'in yüreğine taş gibi oturmuştu. Allah Teâlâ İnşirâh Sûresi'ni indirerek: 'Biz senin göğsünü açıp genişletmedik mi? Belini büken o ağır yükü üzerinden kaldırmadık mı? Ve senin şanını yüceltmedik mi?' buyurdu. Ardından gelen o muhteşem ilahi kanun kalpleri diriltti: 'Şüphesiz zorlukla beraber bir kolaylık vardır. Evet, muhakkak zorlukla beraber bir kolaylık vardır!'`,
    scholars: {
      ibnKesir: "İbn Kesîr: Hadis-i şerifte Efendimiz şöyle buyurmuştur: 'Bir zorluk iki kolaylığı asla yenemez!' Çünkü âyette 'el-Usr' (zorluk) marife/belirli olarak tek bir zorluğu ifade ederken, 'Yusran' (kolaylık) nekire/belirsiz gelerek iki ayrı ve kat kat kolaylığı müjdeler.",
      razi: "Râzî: Şakk-ı sadr (göğsün yarılıp genişletilmesi) hem manevi hikmet ve ilimle kalbin inşirah bulması, hem de Efendimiz'in mucizevi göğüs açılma hadisesidir. İman giren kalp daralmaz, fezalar gibi genişler.",
      kurtubi: "Kurtubî: 'Boş kaldığın zaman hemen başka bir hayırlı işe koyul ve yalnız Rabbine yönel' âyeti, İslâm'da tembelliğe, boş vakit öldürmeye ve gayesizliğe asla yer olmadığını ferman eder.",
      taberi: "Taberî: İbn Abbas'tan nakille: Dünyada hiçbir mümin yoktur ki bir darlığa düşsün de ardından Allah ona bir ferahlık ve inşirah kapısı açmasın.",
      elmalili: "Elmalılı: 'Zorluk kolaylığın ardından değil, onunla beraberdir (mea'l-usri). Yani sıkıntının tohumunun içinde ferahlığın meyvesi gizlidir. Sabreden o meyveyi devşirir.'",
      gazali: "Gazâlî: Kalp inşirahı, dünyanın faniliğini idrak edip ebediyet yurduna yönelmekle hâsıl olur. Kalbi dünyalık hırslarla dolu olanın göğsü daima dar ve sıkıntılı kalır."
    },
    lessons: [
      "Daraldığın ve tükendiğini hissettiğin her an, ilahî kolaylığın ve ferecin en yakın olduğu andır.",
      "Bir iş bittiğinde atalete düşmeyip hemen yeni bir salih amele, hizmete ve duaya koşulmalıdır.",
      "Zorluklar mümini ezmek için değil, kalbini genişletip pişirmek için gönderilir."
    ],
    lugat: "NEŞRAH: Açıp genişletmek, ferahlatmak. VIZRAKE: Ağır yükün, belini büken ağırlık. İNKADA: Çıtlatmak, belini bükmek. USR: Zorluk, meşakkat. YUSR: Kolaylık, genişlik."
  },

  // 103:1 - Asr Suresi
  "103:1": {
    storyTitle: "Zamanın ve Kurtuluşun Dört Esası: Asr Suresi",
    story: `İmam Şâfiî bu muazzam sûre hakkında meşhur sözünü söylemiştir: 'Eğer Kur'an'da başka hiçbir sûre inmeyip yalnız bu sûre inseydi, insanlara dünya ve ahiret saadetleri için yeterdi.' Sahabe-i Kiram birbirleriyle karşılaştıklarında Asr sûresini okumadan ve birbirlerine hakkı ve sabrı tavsiye etmeden ayrılmazlardı. Zaman (Asr) akıp giden bir sermayedir; insan eriyen bir buz kalıbı gibi her saniye tükenmektedir. Bu mutlak hüsrandan kurtulmanın ise yalnızca dört yolu vardır.`,
    scholars: {
      ibnKesir: "İbn Kesîr: Asr; çağ, ikindi vakti ve insan ömrüdür. Bütün insanlık hüsran (ziyan) çukurundadır. Ancak 4 vasfı cem edenler kurtulur: 1. Sahih iman, 2. Salih amel, 3. Hakkı tavsiye, 4. Sabrı tavsiye.",
      razi: "Râzî: Bir buz satıcısının çarşıda: 'Sermayesi eriyen bu adama merhamet edin!' diye bağırmasını işiten bir âlim bayılmıştır. Asr sûresinin sırrı buradadır: Ömür buz gibi erimektedir, onu salih amelle ebediyete çevirmeyen mutlak iflastadır.",
      kurtubi: "Kurtubî: Fert olarak iman ve amel yetmez; toplumsal boyutta emr-i bi'l-maruf (hakkı tavsiye) ve musibetlere karşı sabrı tavsiye etmek de kurtuluşun şartıdır.",
      taberi: "Taberî: İbn Abbas'tan rivayetle: Zamanın kendisinde bir kötülük yoktur; kötülük zamanı haram ve gafletle heba eden insanın kendi amellerindedir.",
      elmalili: "Elmalılı: 'Asr sûresi üç kısa âyette felsefelerin, anayasaların ve nizamların binlerce sayfada anlatamadığı insanlık kurtuluş reçetesini hülasa etmiştir.'",
      gazali: "Gazâlî: Zaman en kıymetli mücevherdir; kaybettiğin altını geri alabilirsin ama geçen bir tek nefesi milyarlar versen geri getiremezsin. Vaktini Allah yolunda harcamayan kendi katilidir."
    },
    lessons: [
      "Zaman geri dönüşü olmayan en değerli sermayedir; onu heba etmek en büyük iflastır.",
      "Yalnızca bireysel dindarlık yetmez; çevremize hakkı, adaleti ve sabrı hatırlatmak da boynumuzun borcudur.",
      "Zorluklar ve imtihanlar karşısında sabrı tavsiye etmek toplumun manevi direğidir."
    ],
    lugat: "EL-ASR: Akıp giden zaman, çağ, ikindi vakti. HUSR: İflas, sermayeyi kaybetme, hüsran. TEVÂSAV: Birbirlerine kuvvetle ve sevgiyle tavsiye ettiler."
  },

  // 108:1 - Kevser Suresi
  "108:1": {
    storyTitle: "Ebû Cehil'in Alayına İlahi Cevap: Kevser Müjdesi",
    story: `Peygamber Efendimiz'in (s.a.v.) Hz. Hatice'den doğan oğlu Abdullah vefat ettiğinde, Kureyş'in azılı müşriklerinden Âs b. Vâil el-Sehmî ve Ebû Cehil sokaklarda sevinç çığlıkları atarak: 'Muhammed'in erkek çocuğu kalmadı, artık o ebterdir (soyu kesiktir)! Ölünce adı sanı unutulup gidecektir!' diye bayram yaptılar. Efendimiz bu acımasız ve gaddar alay karşısında derin bir keder hissetti. İşte bu an semavatın kapıları açıldı ve Kur'an'ın en kısa fakat en müjdeli sûresi indi: 'Şüphesiz biz sana Kevser'i (tükenmez hayrı ve cennet havuzunu) verdik. O halde Rabbin için namaz kıl ve kurban kes. Asıl sonu kesik ve adı silinecek olan, sana kin besleyendir!'`,
    scholars: {
      ibnKesir: "İbn Kesîr: Kevser, cennetteki havuzun adıdır; kıyıları altından, kadehlerinin sayısı gökteki yıldızlar kadardır. Ancak aynı zamanda Resûlullah'a verilen nubuvvet, Kur'an, şefaat, ümmetin çokluğu ve kıyamete kadar minarelerde yankılanacak şerefli namdır. Bugün dünyada milyarlarca Muhammed ismi yaşarken, Âs b. Vâil'in adı ancak lanetle anılır.",
      razi: "Râzî: Müşrikler soyun erkek çocukla devam edeceğini zannettiler. Oysa manevi soy ve risalet mirası fiziki nesepten kat kat üstündür. Hz. Fatıma yoluyla gelen Seyyidler ve Şerifler silsilesi kıyamete kadar Kevser pınarı gibi akacaktır.",
      kurtubi: "Kurtubî: 'Venhar' emrini ahkâm açısından izah eder: Namaz kıl ve kurban kes. Müşrikler putları için kurban keserken, mümin yalnız Âlemlerin Rabbi için kurban keser.",
      taberi: "Taberî: İbn Abbas'tan nakille: Kevser 'el-Hayru'l-Kesîr'dir (pek çok ve bitmez tükenmez hayırdır). Cennetteki havuz bu hayrın yalnızca bir tecellisidir.",
      elmalili: "Elmalılı: 'Bu sûre mazluma yapılan alay ve hakaretin ilahî adalette nasıl tersyüz olduğunu gösteren bir mucizedir. Dün yetim ve kederli olan Nebî bugün iki cihanın sultanı; O'na ebter diyenler ise tarihin çöp sepetindedir.'",
      gazali: "Gazâlî: Kalbinde peygambere ve Hakk'a karşı kin (şenân) besleyen kimse hakikatte kendi manevi neslini kurutur. Kevser havuzundan içmek isteyen, o nebevî ahlak pınarından kana kana içmelidir."
    },
    lessons: [
      "Zalimlerin ve nasipsizlerin alayları geçicidir; Allah'ın lütfu ve vaadi ise ebedîdir.",
      "Nimetin büyüklüğü karşısında kula düşen şükür; huşû ile namaz kılmak ve fedakârca kurban/infak etmektir.",
      "Hakiki şeref dünyalık soy ve zenginlikte değil, ilahî rızaya ermiş salih bir ömürdedir."
    ],
    lugat: "EL-KEVSER: Kesret kökünden; bitip tükenmeyen sonsuz hayır, ilim, şeref ve cennet havuzu. İNHAR: Kurban kes, göğsünü kıbleye ver. ŞÂNİEKE: Sana kin besleyen, haset eden düşman. EL-EBTÉR: Soyu kesik, kökü kurumuş, hayırsız."
  },

  // 112:1 - İhlâs Suresi
  "112:1": {
    storyTitle: "Tevhidin Saf Özü: 'De ki: O Allah Bir'dir'",
    story: `Mekkeli müşrikler Resûlullah'a (s.a.v.) gelip: 'Ey Muhammed! Bize Rabbinin nesebini anlat. O altından mıdır, gümüşten midir, yakuttan mıdır, neden yapılmıştır?' diye hadsizce sordular. Başka bir rivayette ise Medine'deki Yahudiler Tevrat'taki vasıflarla kıyaslamak istediler. Bunun üzerine Allah Teâlâ Tevhidin özeti olan İhlâs Sûresi'ni indirdi: 'De ki: O Allah Bir'dir. Allah Samed'dir. O doğurmamış ve doğmamıştır. Hiçbir şey O'na denk ve benzer değildir.' Bu sûre Allah'ı bütün noksan sıfatlardan tenzih edip kemal sıfatlarla tavsif ettiği için Kur'an'ın üçte birine denk kılınmıştır.`,
    scholars: {
      ibnKesir: "İbn Kesîr: Hadis-i şerifte: 'İhlâs sûresi Kur'an'ın üçte birine denktir' buyrulmuştur. Çünkü Kur'an'ın konuları üçe ayrılır: 1. Ahkâm (hukuk ve ibadetler), 2. Kıssalar, 3. Tevhid ve esmâ-i hüsnâ. Bu sûre tevhid ilmini bütünüyle cem etmiştir.",
      razi: "Râzî: Bu sûre şirk, teslis (üçleme), putperestlik ve ateizmin her türlüsünü dört âyette kökünden çürütür. 'Ehad' zâtında teklik, 'Samed' hiçbir şeye muhtaç olmayıp her şeyin O'na muhtaç olması, 'Lem yelid ve lem yûled' zaman ve mekândan münezzeh olmasıdır.",
      kurtubi: "Kurtubî: Bir sahabi her namazda bu sûreyi okurdu. Efendimiz sebebini sorduğunda: 'Çünkü bu sûre Rahmân'ın sıfatlarını anlatıyor, ben onu okumayı çok seviyorum' dedi. Efendimiz: 'Ona olan sevgin seni cennete koyacaktır' buyurdu.",
      taberi: "Taberî: Samed lafzının tefsirinde: 'İhtiyaç anında herkesin yöneldiği mutlak merci, içinde boşluk olmayan, yemeyen, içmeyen ve zeval bulmayan ulu Zât'tır.",
      elmalili: "Elmalılı: 'İhlâs; arı, duru, içine hiçbir şaibe karışmamış samimi inanç demektir. Bu sûreyi kalbiyle tasdik eden, aklını kâinatın sahte rablerinden kurtarıp hakiki hürriyete kavuşur.'",
      gazali: "Gazâlî: Tevhidin dört derecesi vardır: Dil ile söylemek, akıl ile kavramak, kalp ile müşahede etmek ve varlıkta O'ndan başkasını görmemek. İhlâs sûresi bu dört mertebenin de zirve pusulasıdır."
    },
    lessons: [
      "Allah zâtında, sıfatlarında ve fiillerinde tektir; O'na hiçbir varlık ortak ve denk tutulamaz.",
      "Her an her nefeste O'na muhtacız; fakat O hiçbir kula, hiçbir makama ve hiçbir maddeye muhtaç değildir (Samed).",
      "Bu sûreyi sevmek ve tefekkürle okumak cennet kapılarını açan ilahî bir sevgidir."
    ],
    lugat: "EHAD: Asla bölünmeyen, benzeri ve parçası olmayan tek. ES-SAMED: Herkesin muhtaç olduğu, kendisi hiçbir şeye muhtaç olmayan. KÜFÜVEN: Denk, benzer, eş."
  }
};

// =============================================================================
// GLOBAL İNCELEME STATE & KONTROL SINIFI
// =============================================================================
const IncelemeState = {
  currentSurah: 2,
  currentAyah: 255,
  audioInstance: null,
  isPlayingAudio: false,
  activeScholarTab: 'all', // 'all', 'ibnKesir', 'razi', 'kurtubi', 'taberi', 'elmalili', 'gazali'
  cachedAyahs: {},
  ayahLoadGeneration: 0
};

function getApprovedAyahAnalysis(surahNo, ayahNo) {
  const item = PROMINENT_AYAH_STORIES[`${surahNo}:${ayahNo}`];
  if (
    item?.status !== 'approved' ||
    !item.source ||
    typeof item.storyTitle !== 'string' ||
    typeof item.story !== 'string'
  ) {
    return null;
  }
  return item;
}

function announceIncelemeStatus(message) {
  const status = document.getElementById('ayahSearchStatus');
  if (status) status.textContent = message;
}

// Tilavet Kârisi Sesi URL Üretici (Seçili Kâri & Fallback Desteği)
function getAyahAudioUrlForInceleme(surahNo, ayahNo, reciterId = null) {
  if (typeof window.getAyahAudioUrl === 'function' && window.getAyahAudioUrl !== getAyahAudioUrlForInceleme) {
    return window.getAyahAudioUrl(surahNo, ayahNo, reciterId);
  }
  const sPad = String(surahNo).padStart(3, '0');
  const aPad = String(ayahNo).padStart(3, '0');
  return `https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/${sPad}${aPad}.mp3`;
}

// 114 Sure Seçicisini Doldur (Âyet İnceleme Modülü)
function populateIncelemeSurahSelect() {
  const select = document.getElementById('selectSurahInceleme');
  if (!select) return;

  select.innerHTML = '';
  SURAH_METADATA.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.no;
    opt.textContent = `${s.no}. ${s.name} Sûresi (${s.arabic}) - [${s.ayahs} Âyet]`;
    select.appendChild(opt);
  });

  select.onchange = () => {
    const sNo = parseInt(select.value, 10);
    IncelemeState.currentSurah = sNo;
    populateAyahSelect(sNo, 1);
    loadAndRenderAyahInceleme(sNo, 1);
  };
}

// Seçilen Sûrenin Âyet Seçicisini Doldur
function populateAyahSelect(surahNo, targetAyah = 1) {
  const select = document.getElementById('selectAyahInceleme');
  if (!select) return;

  const surahMeta = SURAH_METADATA.find(s => s.no === surahNo) || { ayahs: 7 };
  select.innerHTML = '';

  for (let i = 1; i <= surahMeta.ayahs; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${i}. Âyet`;
    if (i === targetAyah) opt.selected = true;
    select.appendChild(opt);
  }

  select.onchange = () => {
    const aNo = parseInt(select.value, 10);
    IncelemeState.currentAyah = aNo;
    loadAndRenderAyahInceleme(IncelemeState.currentSurah, aNo);
  };
}

// Çevrimdışı ve Anında Yükleme için Meşhur Âyetlerin Orijinal Metinleri
const PROMINENT_AYAH_RAW = {
  "1:1": {
    uthmani: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translit: "Bismillâhir-rahmânir-rahîm",
    diyanet: "Rahmân ve Rahîm olan Allah'ın adıyla."
  },
  "1:5": {
    uthmani: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    translit: "İyyâke na'büdü ve iyyâke nesta'în",
    diyanet: "(Rabbimiz!) Yalnız sana kulluk eder ve yalnız senden yardım dileriz."
  },
  "2:255": {
    uthmani: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    translit: "Allâhu lâ ilâhe illâ hüve'l-hayyu'l-kayyûm, lâ te'huzühû sinetün ve lâ nevm, lehû mâ fî's-semâvâti ve mâ fî'l-ard, men zellezî yeşfe'u 'ındehû illâ bi-iznih, ya'lemü mâ beyne eydîhim ve mâ halfehüm, ve lâ yuhîtûne bi-şey'in min 'ılmihî illâ bimâ şâ', vesi'a kürsiyyühü's-semâvâti ve'l-ard, ve lâ yeûdühû hıfzuhümâ, ve hüve'l-'aliyyü'l-'azîm.",
    diyanet: "Allah, kendisinden başka hiçbir ilâh olmayandır. Diridir (hayy), her şeyi ayakta tutandır (kayyûm). O'nu ne bir uyuklama tutabilir, ne de bir uyku. Göklerdeki her şey, yerdeki her şey O'nundur. İzni olmaksızın O'nun katında şefaatte bulunacak kimdir? O, kulların önlerindekileri ve arkalarındakileri bilir. Onlar O'nun ilminden, kendisinin dilediği kadarından başka hiçbir şeyi kavrayamazlar. O'nun kürsüsü bütün gökleri ve yeri kaplayıp kuşatmıştır. O ikisini koruyup gözetmek O'na güç gelmez. O, yücedir, büyüktür."
  },
  "2:285": {
    uthmani: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ",
    translit: "Âmener-rasûlü bimâ ünzile ileyhi mir-rabbihî vel-mü'minûn, küllün âmene billâhi ve melâiketihî ve kütübihî ve rusulih, lâ nüferriku beyne ehadin mir-rusulih, ve kâlû semi'nâ ve ata'nâ gufrâneke rabbenâ ve ileyke'l-masîr.",
    diyanet: "Peygamber, Rabbinden kendisine indirilene iman etti, müminler de. Her biri Allah'a, meleklerine, kitaplarına ve peygamberlerine iman ettiler. 'Biz O'nun peygamberleri arasında hiçbir ayrım yapmayız' dediler ve eklediler: 'İşittik ve itaat ettik! Bağışlamanı dileriz ey Rabbimiz, dönüş sanadır!'"
  },
  "3:103": {
    uthmani: "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا ۚ وَاذْكُرُوا نِعْمَتَ اللَّهِ عَلَيْكُمْ إِذْ كُنتُمْ أَعْدَاءً فَأَلَّفَ بَيْنَ قُلُوبِكُمْ فَأَصْبَحْتُم بِنِعْمَتِهِ إِخْوَانًا",
    translit: "Va'tasımû bi-hablillâhi cemî'an ve lâ teferrakû, vezkürû ni'metallâhi 'aleyküm iz küntüm a'dâ'en fe-ellefe beyne kulûbiküm fe-asbahtüm bi-ni'metihî ihvânâ.",
    diyanet: "Hep birlikte Allah'ın ipine (Kur'an'a) sımsıkı sarılın, parçalanıp bölünmeyin! Allah'ın size olan nimetini hatırlayın: Hani siz birbirinize düşmandınız da O kalplerinizi kaynaştırdı ve O'nun lütfuyla kardeş oldunuz."
  },
  "12:3": {
    uthmani: "نَحْنُ نَقُصُّ عَلَيْكَ أَحْسَنَ الْقَصَصِ بِمَا أَوْحَيْنَا إِلَيْكَ هَٰذَا الْقُرْآنَ وَإِن كُنتَ مِن قَبْلِهِ لَمِنَ الْغَافِلِينَ",
    translit: "Nahnu nakussu 'aleyke ahsene'l-kasası bimâ evhaynâ ileyke hâze'l-kur'âne ve in künte min kablihî lemine'l-gâfilîn.",
    diyanet: "Biz, bu Kur'an'ı sana vahyetmekle kıssaların en güzelini sana anlatıyoruz. Gerçek şu ki, sen bundan önce elbette bunlardan habersiz olanlardandın."
  },
  "18:10": {
    uthmani: "إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ فَقَالُوا رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
    translit: "İz eve'l-fityetü ile'l-kehfi fe-kâlû rabbenâ âtinâ min ledünke rahmeten ve heyyi' lenâ min emrinâ raşedâ.",
    diyanet: "Hani o gençler mağaraya sığınmışlardı da: 'Ey Rabbimiz! Bize katından bir rahmet ver ve şu durumumuzda bize bir kurtuluş ve hayırlı bir çıkış yolu hazırla!' demişlerdi."
  },
  "36:20": {
    uthmani: "وَجَاءَ مِنْ أَقْصَى الْمَدِينَةِ رَجُلٌ يَسْعَىٰ قَالَ يَا قَوْمِ اتَّبِعُوا الْمُرْسَلِينَ",
    translit: "Ve câe min aksa'l-medîneti racülün yes'â kâle yâ kavmit-tebi'u'l-murselîn.",
    diyanet: "Şehrin ta öbür ucundan bir adam (Habîb-i Neccâr) koşarak geldi ve: 'Ey kavmim! Bu elçilere uyun!' dedi."
  },
  "67:1": {
    uthmani: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    translit: "Tebârekezî bi-yedihi'l-mülkü ve hüve 'alâ külli şey'in kadîr.",
    diyanet: "Hükümranlık elinde olan Allah ne yücedir! O, her şeye hakkıyla gücü yetendir."
  },
  "93:1": {
    uthmani: "وَالضُّحَىٰ ۙ وَاللَّيْلِ إِذَا سَجَىٰ ۙ مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
    translit: "Ved-duhâ. Vel-leyli izâ secâ. Mâ vedde'ake rabbüke ve mâ kalâ.",
    diyanet: "Kuşluk vaktine ve sükûna erdiği zaman geceye yemin olsun ki; Rabbin seni terk etmedi ve sana darılmadı."
  },
  "94:1": {
    uthmani: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۙ وَوَضَعْنَا عَنكَ وِزْرَكَ",
    translit: "Elem neşrah leke sadrak. Ve vada'nâ 'anke vizrak.",
    diyanet: "Biz senin göğsünü açıp genişletmedik mi? Belini büken ağır yükünü üzerinden kaldırmadık mı?"
  },
  "103:1": {
    uthmani: "وَالْعَصْرِ ۙ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۙ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ",
    translit: "Vel-'asr. İnne'l-insâne le-fî husr. İllellezîne âmenû ve 'amilu's-sâlihât.",
    diyanet: "Asra yemin olsun ki insan hüsrandadır. Ancak iman edip salih ameller işleyenler müstesna."
  },
  "108:1": {
    uthmani: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۙ فَصَلِّ لِرَبِّكَ وَانحَرْ",
    translit: "İnnâ a'taynâke'l-kevser. Fe-salli li-rabbike venhar.",
    diyanet: "Şüphesiz biz sana bol nimet (Kevser) verdik. Şu halde Rabbin için namaz kıl ve kurban kes."
  },
  "112:1": {
    uthmani: "قُلْ هُوَ اللَّهُ أَحَدٌ ۚ اللَّهُ الصَّمَدُ ۚ لَمْ يَلِدْ وَلَمْ يُولَدْ ۚ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    translit: "Kul hüvallâhu ehad. Allâhü's-samed. Lem yelid ve lem yûled. Ve lem yekün lehû küfüven ehad.",
    diyanet: "De ki: O, Allah'tır, bir tektir. Allah Samed'dir. O doğurmamış ve doğmamıştır. Hiçbir şey O'na denk değildir."
  }
};

// API'den Âyet Verisi Çek (Uthmani Arapça, Diyanet Meali, Fonetik Latin)
async function fetchAyahRawData(surahNo, ayahNo) {
  const surahMeta = SURAH_METADATA.find(s => s.no === surahNo);
  if (!surahMeta || !Number.isInteger(ayahNo) || ayahNo < 1 || ayahNo > surahMeta.ayahs) {
    throw new Error('Geçersiz sûre veya ayet numarası.');
  }

  const key = `${surahNo}:${ayahNo}`;
  if (IncelemeState.cachedAyahs[key]) {
    return IncelemeState.cachedAyahs[key];
  }

  const curated = PROMINENT_AYAH_RAW[key];
  if (
    curated?.status === 'approved' &&
    curated.source &&
    curated.uthmani &&
    curated.diyanet &&
    curated.translit
  ) {
    IncelemeState.cachedAyahs[key] = curated;
    return curated;
  }

  const response = await fetch(
    `https://api.alquran.cloud/v1/ayah/${surahNo}:${ayahNo}/editions/quran-uthmani,tr.diyanet,en.transliteration`
  );
  if (!response.ok) {
    throw new Error(`Ayet kaynağı HTTP ${response.status} yanıtı verdi.`);
  }

  const json = await response.json();
  if (json.code !== 200 || !Array.isArray(json.data) || json.data.length < 3) {
    throw new Error('Ayet kaynağından beklenen metin alanları alınamadı.');
  }

  const [quran, meal, transliteration] = json.data;
  if (![quran?.text, meal?.text, transliteration?.text].every(value => typeof value === 'string' && value.trim())) {
    throw new Error('Ayet metni, meal veya transkripsiyon eksik.');
  }

  const data = {
    uthmani: quran.text,
    diyanet: meal.text,
    translit: transliteration.text
  };
  IncelemeState.cachedAyahs[key] = data;
  return data;
}

// Âyeti Yükle ve Bütün İnceleme Arayüzünü Render Et
async function loadAndRenderAyahInceleme(surahNo, ayahNo) {
  const surahMeta = SURAH_METADATA.find(s => s.no === surahNo);
  if (!surahMeta || !Number.isInteger(ayahNo) || ayahNo < 1 || ayahNo > surahMeta.ayahs) {
    announceIncelemeStatus('Geçersiz sûre veya âyet numarası. Lütfen seçimleri kontrol edin.');
    return;
  }

  const loadGeneration = ++IncelemeState.ayahLoadGeneration;
  IncelemeState.currentSurah = surahNo;
  IncelemeState.currentAyah = ayahNo;
  stopAyahAudio();

  // URL'yi güncelle (sayfa yenilense de aynı ayet gelsin)
  const url = new URL(window.location);
  url.searchParams.set('surah', surahNo);
  url.searchParams.set('ayah', ayahNo);
  window.history.replaceState({}, '', url);

  // Seçicileri güncelle
  const surahSelect = document.getElementById('selectSurahInceleme');
  if (surahSelect && parseInt(surahSelect.value, 10) !== surahNo) {
    surahSelect.value = surahNo;
    populateAyahSelect(surahNo, ayahNo);
  } else {
    const ayahSelect = document.getElementById('selectAyahInceleme');
    if (ayahSelect) ayahSelect.value = ayahNo;
  }

  // Telemetri ve Üst Bar Bilgilerini Güncelle
  const badgeEl = document.getElementById('hudActiveAyahBadge');
  if (badgeEl) badgeEl.textContent = `${surahMeta.no}. ${surahMeta.name} Sûresi — ${ayahNo}. Âyet`;
  const introAyah = document.getElementById('studyIntroAyah');
  if (introAyah) introAyah.textContent = `${surahMeta.name} · ${ayahNo}`;
  document.querySelectorAll('.quick-discovery-pill').forEach(button => {
    const isCurrent = Number(button.getAttribute('data-surah')) === surahNo
      && Number(button.getAttribute('data-ayah')) === ayahNo;
    button.setAttribute('aria-pressed', String(isCurrent));
  });
  announceIncelemeStatus(`${surahMeta.name} sûresi ${ayahNo}. âyet yükleniyor.`);

  const placeEl = document.getElementById('hudSurahPlace');
  if (placeEl) placeEl.textContent = `${surahMeta.place} Dönemi (${surahMeta.order}. Sırada İndi)`;

  const totalEl = document.getElementById('hudSurahTotal');
  if (totalEl) totalEl.textContent = `Toplam ${surahMeta.ayahs} Âyet`;

  const returnMushafLink = document.getElementById('btnReturnToMushafLink');
  if (returnMushafLink) {
    returnMushafLink.href = `index.html?surah=${surahNo}&ayah=${ayahNo}`;
  }

  const arEl = document.getElementById('heroAyahArabic');
  const latinEl = document.getElementById('heroAyahLatin');
  const mealEl = document.getElementById('heroAyahMeal');
  const storyTitleEl = document.getElementById('kissaTitle');
  const storyBodyEl = document.getElementById('kissaBody');
  const playButton = document.getElementById('btnPlayAyahAudio');

  if (arEl) arEl.textContent = 'Ayet yükleniyor…';
  if (latinEl) latinEl.textContent = '';
  if (mealEl) mealEl.textContent = '';
  if (storyTitleEl) storyTitleEl.textContent = 'Doğrulanmış tahlil aranıyor…';
  if (storyBodyEl) storyBodyEl.textContent = '';
  if (playButton) playButton.disabled = true;

  let raw;
  try {
    raw = await fetchAyahRawData(surahNo, ayahNo);
  } catch (error) {
    if (loadGeneration !== IncelemeState.ayahLoadGeneration) return;

    console.error('Ayet verisi yüklenemedi:', error);
    const reason = error instanceof Error ? error.message : String(error);
    if (arEl) arEl.textContent = 'Ayet metni yüklenemedi.';
    if (latinEl) latinEl.textContent = '';
    if (mealEl) mealEl.textContent = 'Kaynak ayet verisine şu anda erişilemiyor. Lütfen bağlantıyı kontrol edip yeniden deneyin.';
    if (storyTitleEl) storyTitleEl.textContent = 'Tahlil gösterilemiyor';
    if (storyBodyEl) storyBodyEl.textContent = `Ayet verisi yüklenemedi: ${reason}`;
    announceIncelemeStatus(`${surahMeta.name} sûresi ${ayahNo}. âyet yüklenemedi.`);
    return;
  }

  if (loadGeneration !== IncelemeState.ayahLoadGeneration) return;

  const analysis = getApprovedAyahAnalysis(surahNo, ayahNo);

  // Vitrin (Hero) Kartını Doldur
  if (arEl) {
    arEl.textContent = raw.uthmani;
  }

  if (latinEl) {
    latinEl.textContent = raw.translit;
  }

  if (mealEl) {
    mealEl.textContent = raw.diyanet;
  }

  if (playButton) playButton.disabled = false;

  if (storyTitleEl) {
    storyTitleEl.textContent = analysis?.storyTitle || 'Doğrulanmış tahlil kaydı bulunmuyor';
  }

  if (storyBodyEl) {
    if (analysis) {
      storyBodyEl.innerHTML = `<p>${analysis.story.replace(/\n\n/g, '</p><p>')}</p>`;
    } else {
      storyBodyEl.textContent = 'Bu ayet için kaynak bilgisi ve uzman onayı doğrulanmış tefsir/tahlil kaydı henüz bulunmuyor.';
    }
    announceIncelemeStatus(`${surahMeta.name} sûresi ${ayahNo}. âyet yüklendi.`);
  }

  // Sayfayı pürüzsüzce en üste kaydır (tüm kontroller ve vitrin görünsün)
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Büyük Âlimlerin Yorumlarını Render Et (Kaldırıldı - geriye dönük uyumluluk için no-op)
function renderScholarsSection() {}

// Âyeti Dinle / Durdur (Kâri Seçimi & Akıllı Fallback Entegrasyonu)
function toggleAyahAudio() {
  const btn = document.getElementById('btnPlayAyahAudio');
  if (IncelemeState.isPlayingAudio) {
    stopAyahAudio();
    return;
  }

  // Tilavet motorunun merkezi oynatıcısı varsa seçili kâri kaydını kullan.
  if (typeof window.playQariRecitation === 'function') {
    IncelemeState.isPlayingAudio = true;
    if (btn) {
      btn.innerHTML = `⏸ Âyeti Durdur`;
      btn.classList.add('is-playing');
    }
    const heroCard = document.getElementById('heroCard');
    if (heroCard) heroCard.classList.add('audio-active-glow');

    window.playQariRecitation(
      IncelemeState.currentSurah, 
      IncelemeState.currentAyah, 
      () => { stopAyahAudio(); },
      null,
      () => { stopAyahAudio(); },
      'inceleme'
    );
    return;
  }

  if (typeof window.TilavetAudioManager !== 'undefined') {
    window.TilavetAudioManager.notifyPlay('inceleme');
  }

  const audioUrl = getAyahAudioUrlForInceleme(IncelemeState.currentSurah, IncelemeState.currentAyah);
  IncelemeState.audioInstance = new Audio(audioUrl);
  IncelemeState.isPlayingAudio = true;

  if (btn) {
    btn.innerHTML = `⏸ Âyeti Durdur`;
    btn.classList.add('is-playing');
  }

  const heroCard = document.getElementById('heroCard');
  if (heroCard) heroCard.classList.add('audio-active-glow');

  IncelemeState.audioInstance.play().catch(e => {
    console.warn("Ses çalınamadı:", e);
    stopAyahAudio();
  });

  IncelemeState.audioInstance.onended = () => {
    stopAyahAudio();
  };
}

function stopAyahAudio() {
  // Merkezi Tilavet oynatıcısını sustur
  if (typeof window.stopAllAudioPlayback === 'function') {
    try { window.stopAllAudioPlayback('inceleme_stop'); } catch (_) {}
  }
  if (typeof window.TilavetAudioManager !== 'undefined') {
    try { window.TilavetAudioManager.stopAll('inceleme_stop'); } catch (_) {}
  }

  if (IncelemeState.audioInstance) {
    try {
      IncelemeState.audioInstance.pause();
      IncelemeState.audioInstance.currentTime = 0;
      IncelemeState.audioInstance.removeAttribute('src');
    } catch (_) {}
    IncelemeState.audioInstance = null;
  }
  IncelemeState.isPlayingAudio = false;

  const btn = document.getElementById('btnPlayAyahAudio');
  if (btn) {
    btn.innerHTML = `▶ Âyeti Dinle`;
    btn.classList.remove('is-playing');
  }

  const heroCard = document.getElementById('heroCard');
  if (heroCard) heroCard.classList.remove('audio-active-glow');
}

// Merkezi ses yöneticisine İnceleme sayfasını kaydet
if (typeof window.TilavetAudioManager !== 'undefined') {
  window.TilavetAudioManager.register('inceleme', { stop: stopAyahAudio, category: 'inceleme' });
}

// Önceki Âyet
function goPrevAyah() {
  let sNo = IncelemeState.currentSurah;
  let aNo = IncelemeState.currentAyah - 1;

  if (aNo < 1) {
    sNo = sNo - 1;
    if (sNo < 1) sNo = 114;
    const prevSurahMeta = SURAH_METADATA.find(s => s.no === sNo);
    aNo = prevSurahMeta ? prevSurahMeta.ayahs : 1;
  }

  loadAndRenderAyahInceleme(sNo, aNo);
}

// Sonraki Âyet
function goNextAyah() {
  let sNo = IncelemeState.currentSurah;
  let aNo = IncelemeState.currentAyah + 1;
  const curSurahMeta = SURAH_METADATA.find(s => s.no === sNo);
  const maxAyah = curSurahMeta ? curSurahMeta.ayahs : 1;

  if (aNo > maxAyah) {
    sNo = sNo + 1;
    if (sNo > 114) sNo = 1;
    aNo = 1;
  }

  loadAndRenderAyahInceleme(sNo, aNo);
}

// Rastgele Bir Hikmetli Âyet İncele
function goRandomAyah() {
  const approvedKeys = Object.keys(PROMINENT_AYAH_STORIES).filter(key => {
    const [surah, ayah] = key.split(':').map(Number);
    return getApprovedAyahAnalysis(surah, ayah) !== null;
  });

  if (approvedKeys.length > 0) {
    const [surah, ayah] = approvedKeys[Math.floor(Math.random() * approvedKeys.length)]
      .split(':')
      .map(Number);
    loadAndRenderAyahInceleme(surah, ayah);
    return;
  }

  const surah = SURAH_METADATA[Math.floor(Math.random() * SURAH_METADATA.length)];
  const ayah = Math.floor(Math.random() * surah.ayahs) + 1;
  loadAndRenderAyahInceleme(surah.no, ayah);
}

// Arama Kutusu İncelemesi (Örn: "2:255", "Kehf", "Yusuf", "kurban", "cennet")
function executeIncelemeSearch(query) {
  const trimmedQuery = typeof query === 'string' ? query.trim() : '';
  if (!trimmedQuery) {
    announceIncelemeStatus('Aramak için bir sûre adı, âyet numarası veya konu yazın.');
    document.getElementById('inputIncelemeSearch')?.focus();
    return;
  }
  const q = trimmedQuery.toLowerCase();

  // 1. "2:255" veya "2 255" formatı
  const colonMatch = q.match(/^(\d+)[\s:.]+(\d+)$/);
  if (colonMatch) {
    const s = parseInt(colonMatch[1], 10);
    const a = parseInt(colonMatch[2], 10);
    const surahMeta = SURAH_METADATA.find(item => item.no === s);
    if (surahMeta && a >= 1 && a <= surahMeta.ayahs) {
      loadAndRenderAyahInceleme(s, a);
      return;
    }
    announceIncelemeStatus('Âyet numarası seçilen sûrenin sınırları dışında.');
    return;
  }

  // 2. Sure Adı Eşleşmesi (Örn: "ihlas", "yasin", "fatiha", "kehf")
  const matchedSurah = SURAH_METADATA.find(s => 
    s.name.toLowerCase().includes(q) || 
    s.name.toLowerCase().replace(/['\^]/g, '').includes(q)
  );

  if (matchedSurah) {
    loadAndRenderAyahInceleme(matchedSurah.no, 1);
    return;
  }

  // 3. Meşhur Hikaye Anahtar Kelimeleri (Örn: "kürsi", "musa", "ebabil", "uhud")
  for (const key of Object.keys(PROMINENT_AYAH_STORIES)) {
    const [surah, ayah] = key.split(':').map(Number);
    const item = getApprovedAyahAnalysis(surah, ayah);
    if (!item) continue;

    if (item.storyTitle.toLowerCase().includes(q) || item.story.toLowerCase().includes(q)) {
      loadAndRenderAyahInceleme(surah, ayah);
      return;
    }
  }

  announceIncelemeStatus(`"${trimmedQuery}" ile eşleşen sûre veya kayıt bulunamadı. Lütfen sûre adı veya '2:255' şeklinde yazınız.`);
}

// URL Parametrelerini Çözümle (?surah=X&ayah=Y)
function initFromUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const sParam = params.get('surah');
  const aParam = params.get('ayah');

  let s = 2; // Varsayılan: Bakara

  if (sParam) {
    const parsedS = parseInt(sParam, 10);
    if (parsedS >= 1 && parsedS <= 114) s = parsedS;
  }
  const surahMeta = SURAH_METADATA.find(item => item.no === s);
  let a = s === 2 ? 255 : 1;
  if (aParam) {
    const parsedA = Number(aParam);
    if (Number.isInteger(parsedA) && parsedA >= 1 && parsedA <= (surahMeta?.ayahs ?? 0)) {
      a = parsedA;
    }
  }

  populateIncelemeSurahSelect();
  populateAyahSelect(s, a);
  loadAndRenderAyahInceleme(s, a);
}

// Event Listeners ve Başlatıcı
document.addEventListener('DOMContentLoaded', () => {
  initFromUrlParams();

  // Âyeti Dinle Butonu
  document.getElementById('btnPlayAyahAudio')?.addEventListener('click', toggleAyahAudio);

  // Önceki / Sonraki Âyet Butonları
  document.getElementById('btnPrevAyahInceleme')?.addEventListener('click', goPrevAyah);
  document.getElementById('btnNextAyahInceleme')?.addEventListener('click', goNextAyah);
  document.getElementById('btnRandomAyahInceleme')?.addEventListener('click', goRandomAyah);

  // Hızlı Keşif Hapları
  const pillBtns = document.querySelectorAll('.quick-discovery-pill');
  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const s = parseInt(btn.getAttribute('data-surah'), 10);
      const a = parseInt(btn.getAttribute('data-ayah'), 10);
      if (s && a) {
        loadAndRenderAyahInceleme(s, a);
      }
    });
  });

  // Arama Girişi
  const searchInput = document.getElementById('inputIncelemeSearch');
  const searchBtn = document.getElementById('btnExecIncelemeSearch');
  searchBtn?.addEventListener('click', () => {
    executeIncelemeSearch(searchInput?.value ?? '');
  });
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeIncelemeSearch(searchInput.value);
    }
  });

  // Klavye Kısayolları (Sol: Önceki Âyet | Sağ: Sonraki Âyet | Boşluk: Ses Çal/Durdur)
  window.addEventListener('keydown', (e) => {
    // Eğer Mushaf sekmesi aktifse, klavye kısayollarını ona devret
    if (document.getElementById('tab-tilavet')?.classList.contains('active')) {
      return;
    }

    if (
      e.repeat ||
      (e.target instanceof Element && e.target.closest(
        'input, textarea, select, button, a, [contenteditable="true"], [role="button"], [role="textbox"]'
      ))
    ) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrevAyah();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNextAyah();
    } else if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      toggleAyahAudio();
    }
  });
});

// Global nesneleri pencereye (window) bağla
window.IncelemeState = IncelemeState;
window.loadAndRenderAyahInceleme = loadAndRenderAyahInceleme;
window.stopAyahAudio = stopAyahAudio;
window.SURAH_METADATA = SURAH_METADATA;
window.PROMINENT_AYAH_STORIES = Object.freeze(Object.fromEntries(
  Object.keys(PROMINENT_AYAH_STORIES)
    .filter(key => {
      const [surah, ayah] = key.split(':').map(Number);
      return getApprovedAyahAnalysis(surah, ayah) !== null;
    })
    .map(key => [key, PROMINENT_AYAH_STORIES[key]])
));
