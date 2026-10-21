# -*- coding: utf-8 -*-
"""
Yazarlar İçin Edebiyat Kuramı Ders Kitabı
Bölüm 7: Yöntemler
Bölüm 8: Yazar İçin Uygulama
"""


def yaz(pdf):
    # =========================================================================
    # BÖLÜM 7: YÖNTEMLER
    # =========================================================================
    pdf.bolum_basligi(7, "Yöntemler")

    # -------------------------------------------------------------------------
    # 7.1 Kuram, Yöntem ve Metin
    # -------------------------------------------------------------------------
    pdf.alt_bolum("Kuram, Yöntem ve Metin")

    pdf.paragraf(
        "Edebiyat incelemesi ve yaratıcı yazarlık pratiğinde en sık karşılaşılan "
        "kavramsal karışıklıklardan biri kuram (teori), yöntem (metodoloji) ve metin "
        "(inceleme nesnesi) arasındaki ilişkinin yanlış anlaşılmasıdır. Çoğu zaman "
        "bu üç öge birbirinden bağımsız kompartımanlar gibi düşünülür; oysa nitelikli "
        "bir edebi okuma ve bilinçli bir yazma eylemi, bu üçlünün birbirine kenetlendiği "
        "sağlam bir sacayağı üzerinde yükselir."
    )

    pdf.paragraf(
        "Bu ilişkiyi en yalın biçimde anlamanın yolu sordukları sorulara bakmaktır: "
        "Kuram 'Ne ve Niçin?' sorularını sorar; yöntem ise 'Nasıl?' sorusuna yanıt arar. "
        "Metin ise bu soruların somutlaştığı, etten kemikten bir dilsel varlığa büründüğü "
        "alanın kendisidir. Kuramsız bir yöntem, nereye gideceğini bilmeden haritayı "
        "ezberleyen bir yolcunun şaşkınlığına benzer; mekanik ve ruhsuz bir teknik "
        "dökümden öteye geçemez. Yöntemsiz bir kuram ise havada asılı kalan, metne temas "
        "etmeyen soyut gevezeliklere ve temelsiz spekülasyonlara dönüşür."
    )

    pdf.kavram_tanimi(
        "Kuram (Teori)",
        "Edebiyatın doğasını, işlevini, anlamın kaynağını ve metin ile dünya arasındaki "
        "bağlantıyı açıklayan felsefi ve kavramsal dünya görüşüdür. Bize metne hangi "
        "gözlükle bakacağımızı fısıldar."
    )

    pdf.kavram_tanimi(
        "Yöntem (Metodoloji)",
        "Seçilen kuramsal bakış açısının bir metin üzerinde adım adım, tutarlı ve "
        "yinelenebilir bir biçimde hayata geçirilmesini sağlayan analiz araçları ve "
        "uygulama stratejileridir."
    )

    pdf.kavram_tanimi(
        "Metinsel Kanıt (Textual Evidence)",
        "İleri sürülen herhangi bir kuramsal yorumun metindeki sözcükler, sözdizimi, "
        "yapısal örüntüler, ton veya imgesel tercihlerle somut olarak doğrulanmasıdır."
    )

    pdf.kavram_tanimi(
        "Hermeneutik Çember (Yorum Sarmalı)",
        "Bir metnin bütününü anlamak için parçalarını, parçalarını anlamak içinse bütününü "
        "anlamak gerektiğini öne süren döngüsel anlama sürecidir. Okur parça ile bütün "
        "arasında sürekli gidip gelerek anlamı derinleştirir."
    )

    pdf.paragraf(
        "Başarılı bir eleştirel okur ya da poetik bilince sahip bir yazar, metin ile "
        "kuram arasında tek yönlü bir tahakküm ilişkisi kurmaz. Kuram metne dayatılan "
        "bir dogma değil; metnin derinliklerindeki saklı yapıları aydınlatan bir ışıktır. "
        "Aynı zamanda metin de kuramı sınar, bazen kuramın yetersiz kaldığı çatlakları "
        "göstererek onu genişletmeye veya sorgulamaya zorlar."
    )

    pdf.bilgi_kutusu(
        "Kuram Bir Gözlüktür, Zindan Değil",
        "Edebiyat kuramları, metinleri içine tıkıştırdığımız hazır kutular değildir. "
        "Her kuram metne farklı bir dalga boyunda ışık tutar: Psikanaliz bilinçdışı "
        "katmanları gösterirken, Marksizm sınıfsal gerilimleri, Anlatıbilim ise zaman ve "
        "odaklanım mimarisini görünür kılar. Amaç tek bir kuramı mutlaklaştırmak değil, "
        "araştırma sorusuna en uygun alet çantasını seçebilmektir."
    )

    pdf.uyari_kutusu(
        "Prokrustes'in Yatağı Yanılgısına Düşmeyin! Yunan mitolojisinde Prokrustes, "
        "yolcuları demir bir yatağa yatırır; boyu kısa gelenleri çekerek uzatır, uzun "
        "gelenlerin bacaklarını keserek yatağa uydururdu. Metne kuram giydirirken en büyük "
        "tuzak, metnin kendi estetik ve anlamsal biricikliğini hiçe sayıp onu seçtiğiniz "
        "kuramın kalıbına sokmak için zorlamaktır. Metinde olmayan şeyleri varmış gibi "
        "uydurmak yöntemsel bir cinayettir."
    )

    # -------------------------------------------------------------------------
    # 7.2 Başlıca Yöntemler
    # -------------------------------------------------------------------------
    pdf.alt_bolum("Başlıca Yöntemler")

    pdf.paragraf(
        "Edebiyat biliminde ve yazarlık atölyelerinde kullanılan yöntemler, "
        "metne yaklaşım biçimlerine göre çeşitlilik gösterir. Aşağıda çağdaş edebiyat "
        "çalışmalarının omurgasını oluşturan on iki temel yöntem; ne yaptıkları, "
        "tipik uygulama adımları, dayandıkları kuramlar ve Türk edebiyatından somut "
        "örneklerle ayrıntılı olarak incelenmiştir."
    )

    # 1. Yakın Okuma
    pdf.alt_alt_bolum("1. Yakın Okuma (Close Reading)")
    pdf.paragraf(
        "Yakın okuma, metnin dışındaki biyografik, tarihsel ya da sosyolojik verilere "
        "başvurmadan; metnin doğrudan kendi dilsel dokusuna, sözcük tercihlerine, sözdizimine, "
        "ses örüntülerine ve metaforik ağına mikroskobik bir dikkatle odaklanan okuma biçimidir. "
        "Metnin ne söylediğinden ziyade nasıl söylediğini araştırır."
    )
    pdf.madde_listesi([
        "Tipik Adımlar: Metni harfi harfine okuyup ilk anlamı saptamak; kilit sözcüklerin yan anlamlarını ve etimolojisini taramak; sözdizimindeki kırılmaları ve ritmi incelemek; zıtlıkları, çokanlamlılıkları ve gerilimleri belirlemek.",
        "Dayandığı Kuramlar: Anglo-Amerikan Yeni Eleştirisi (New Criticism - Brooks, Wimsatt, Beardsley), I.A. Richards'ın Pratik Eleştirisi ve Rus Biçimciliği.",
    ])
    pdf.ornek_kutusu(
        "Yakın Okuma - Ahmet Haşim'in 'Merdiven' Şiiri",
        "Ağır, ağır çıkacaksın bu merdivenlerden,\n"
        "Eteklerinde güneş rengi bir yığın yaprak,\n"
        "Ve bir zaman bakacaksın semâya ağlayarak...\n\n"
        "Sular sarardı... yüzün perde perde solmakta,\n"
        "Kızıl havaları seyret ki akşam olmakta...",
        "İlk dizedeki 'ağır, ağır' ikilemesi ve virgül kullanımı, okuma ritmini fiziksel olarak "
        "yavaşlatır ve merdiven çıkma eyleminin yorgunluğunu dilde yaşatır. 'Merdiven' sadece "
        "bir nesne değil, hayatın sonuna doğru atılan basamaklardır. 'Güneş rengi yapraklar' "
        "ölüm ve sonbahar çağrışımını altın renginin görkemiyle çatıştırarak hüzünlü bir "
        "tezat (oxymoron) yaratır. 'Perde perde solmak' ifadesi tiyatral bir illüzyonun "
        "kapanışını ve yüzün tabiatla birlikte silinip gidişini imler."
    )

    # 2. Biçimsel ve Yapısal Anlatı Çözümlemesi
    pdf.alt_alt_bolum("2. Biçimsel ve Yapısal Anlatı Çözümlemesi")
    pdf.paragraf(
        "Bu yöntem kurmacayı bir mimari yapı olarak ele alır. Olayların kronolojik "
        "sıralanışı (fabula) ile anlatıda sunuluş biçimi (sjuzhet) arasındaki farkı, "
        "anlatıcının konumunu, bakış açısını (odaklayıcı), anlatı zamanını ve anlatı "
        "hızını matematiksel bir kesinlikle inceler."
    )
    pdf.madde_listesi([
        "Tipik Adımlar: Olay örgüsünü kronolojik eksene ve anlatı eksenine ayırmak; anlatıcı tipini ve odaklayıcıyı (sıfır, iç, dış odaklanım) belirlemek; geçmişe dönüş (analepsis) ve geleceğe sıçrama (prolepsis) anlarını haritalamak; anlatı hızını (sahne, özet, duraklama, atlama) ölçmek.",
        "Dayandığı Kuramlar: Gérard Genette'in Anlatıbilimi, Vladimir Propp'un Biçimsel Masal Morfolojisi, Tzvetan Todorov ve Roland Barthes'ın Yapısalcılığı.",
    ])
    pdf.ornek_kutusu(
        "Yapısal Anlatı Çözümlemesi - Sabahattin Ali'nin 'Kürk Mantolu Madonna'sı",
        "Roman, genç ve işsiz bir memurun bankada Raif Efendi ile karşılaşmasıyla başlar. "
        "İlk 60 sayfa dış anlatıcının gözünden silik, içine kapanık, herkesin hor gördüğü "
        "bir Raif Efendi portresi çizer. Ardından Raif Efendi hastalanıp çekmecesindeki "
        "siyah kaplı defteri anlatıcıya teslim eder. Defterin açılmasıyla anlatıcı değişir "
        "ve 12 yıl önceki Berlin günlerine devasa bir geçmişe dönüş (analepsis) yapılır.",
        "Burada iç içe geçmiş iki anlatı düzeyi (çerçeve anlatı ve gömülü anlatı) bulunur. "
        "Dış çerçevede anlatıcı 'ben', odaklayıcı ise Raif Efendi'nin dış kabuğudur. İç "
        "defterde ise odaklayıcı bizzat Raif Efendi'nin iç dünyasına kayar. Bu yapısal "
        "kırılma, sıradan bir insanın içindeki volkanik tutkuyu okura hissettirmek için "
        "hesaplanmış kusursuz bir anlatıbilimsel mimaridir."
    )

    # 3. Karşılaştırmalı Okuma
    pdf.alt_alt_bolum("3. Karşılaştırmalı Okuma (Comparative Reading)")
    pdf.paragraf(
        "Farklı yazarlara, dönemlere, dillere ya da kültürlere ait iki veya daha fazla "
        "metni ortak bir izlek, motif, karakter tipi veya biçimsel sorun etrafında yan "
        "yana getirerek çözümleme yöntemidir. Amaç basit bir benzerlik avı değil; metinlerin "
        "birbirini nasıl açımladığını ve kültürel/felsefi ayrışmaları görmektir."
    )
    pdf.madde_listesi([
        "Tipik Adımlar: Karşılaştırma eksenini (üçüncü ortak terim / tertium comparationis) netleştirmek; her iki metnin kendi tarihsel-estetik bağlamını ortaya koymak; benzerlikleri ve derin ayrışma noktalarını tespit etmek; ayrışmaların felsefi ve ideolojik nedenlerini sentezlemek.",
        "Dayandığı Kuramlar: Karşılaştırmalı Edebiyat, Kültürel İncelemeler, Çeviribilim.",
    ])
    pdf.ornek_kutusu(
        "Karşılaştırmalı Okuma - Tanzimat Romanında Alafrangalık",
        "Ahmet Mithat Efendi'nin 'Felatun Bey ile Râkım Efendi'si (1875) ile Recaizade Mahmut "
        "Ekrem'in 'Araba Sevdası' (1896) romanları, Tanzimat döneminin yanlış Batılılaşmış "
        "züppe tipini ele alır.",
        "Felatun Bey karikatürize edilmiş, ahlaken mahkûm edilen ve didaktik olarak gülünç "
        "düşürülen bir tiptir; karşısında çalışkan ve Doğulu değerleri koruyan Râkım Efendi "
        "idealize edilir. Oysa Bihruz Bey ('Araba Sevdası') psikolojik derinliği olan, "
        "iç monologlarla konuşan ve trajikomik bir yabancılaşma yaşayan bireydir. Karşılaştırma, "
        "Türk romanının yirmi yıl içinde kaba ahlakçı allegoriden modern psikolojik gerçekçiliğe "
        "nasıl evrildiğini açıkça kanıtlar."
    )

    # 4. Tarihselci ve Bağlamsal Okuma
    pdf.alt_alt_bolum("4. Tarihselci ve Bağlamsal Okuma")
    pdf.paragraf(
        "Metni yalıtılmış bir fildişi kule ürünü olarak değil; üretildiği çağın ekonomik, "
        "siyasal, toplumsal ve zihniyet dünyasının canlı bir müdahalesi ve yansıması olarak "
        "okur. Stephen Greenblatt'ın formülüyle 'metnin tarihselliğini ve tarihin "
        "metinselliğini' birlikte inceler."
    )
    pdf.madde_listesi([
        "Tipik Adımlar: Eserin yazıldığı ve yayımlandığı dönemin maddî ve siyasi koşullarını belgelemek; dönemin egemen ideolojileri ile metnin çatışma noktalarını bulmak; metnin iktidar yapılarına uyum mu sağladığını yoksa onları altüst mü ettiğini araştırmak.",
        "Dayandığı Kuramlar: Yeni Tarihselcilik (Greenblatt, Montrose), Kültürel Materyalizm (Williams, Dollimore) ve Tarihselci Marksizm.",
    ])
    pdf.ornek_kutusu(
        "Tarihselci Okuma - Yakup Kadri'nin 'Yaban'ı",
        "Ahmet Celal, I. Dünya Savaşı'nda bir kolunu kaybettikten sonra emir eri Mehmet'in "
        "Porsuk Çayı kenarındaki köyüne sığınır. Roman, Türk aydını ile Anadolu köylüsü "
        "arasındaki uçurumu acımasız bir dille sergiler.",
        "Tarihselci okuma, Ahmet Celal'in nefret ve hüsranını yalnızca bireysel bir kibir "
        "olarak görmez. 1920'lerin Millî Mücadele koşullarında, Tanzimat'tan beri köylüyü "
        "yalnızca vergi ve asker kaynağı olarak gören Osmanlı aydın sınıfının köylüyle "
        "kuramadığı ontolojik bağın tarihsel iflasını ortaya koyar. Metin, Erken Cumhuriyet "
        "aydınının köye yönelik suçluluk psikolojisinin ve reform ihtiyacının tarihsel "
        "bir belgesidir."
    )

    # 5. Söylem Çözümlemesi
    pdf.alt_alt_bolum("5. Söylem Çözümlemesi (Discourse Analysis)")
    pdf.paragraf(
        "Dilin yalnızca dünyayı tasvir eden masum bir araç olmadığını; tersine iktidar "
        "ilişkilerini, öznellikleri, meşruiyetleri ve tabuları kuran bir güç alanı olduğunu "
        "varsayar. Metinde 'kimin konuştuğunu, kimin adına konuştuğunu, kimin sesinin "
        "kısıldığını ve hangi kavramların doğallaştırıldığını' araştırır."
    )
    pdf.madde_listesi([
        "Tipik Adımlar: Anahtar sözcüklerin, metaforik karşıtlıkların ve nitelemelerin dökümünü çıkarmak; öznelerin nasıl konumlandırıldığını ve hiyerarşik ilişkileri belirlemek; metinde 'tartışmasız hakikat' gibi sunulan ideolojik kabulleri görünür kılmak.",
        "Dayandığı Kuramlar: Michel Foucault'nun İktidar/Bilgi kuramı, Eleştirel Söylem Çözümlemesi (Fairclough, van Dijk).",
    ])
    pdf.ornek_kutusu(
        "Söylem Çözümlemesi - Peyami Safa'nın 'Fatih-Harbiye'si",
        "Romanda Neriman Doğu ile Batı arasında bocalar. Fatih semti tasvir edilirken "
        "'kandiller, ezan sesleri, vakar, tevekkül, sessizlik ve haysiyet' kelimeleri "
        "kullanılır. Harbiye ve Beyoğlu tasvir edilirken ise 'caz, apartman katları, "
        "göz kamaştırıcı vitrinler, şımarıklık, yapay kahkahalar ve şehvet' söylemi öne çıkar.",
        "Yazarın dili tarafsız bir mekân betimlemesi yapmaz; semtleri ahlaki ve ontolojik "
        "bir iktidar kavgasına sokar. Fatih meşru, temiz ve ulusal öznenin evi olarak "
        "kurulurken; Harbiye yozlaşmış, yapay ve kadın iffetini tehdit eden tehlikeli bir "
        "söylemsel alan olarak inşa edilir. Söylem, okuru ahlakçı bir Doğu tercihine mecbur bırakır."
    )

    # 6. Metinlerarası Okuma
    pdf.alt_alt_bolum("6. Metinlerarası Okuma (Intertextual Reading)")
    pdf.paragraf(
        "Hiçbir metnin bir adada tek başına doğmadığını, her metnin kendinden önceki "
        "metinlerin bir kavşak noktası ve yeniden yazımı olduğunu savunur. Gérard Genette, "
        "bu ilişkiyi 'Transtextuality' (Aşkınmetinsellik) başlığı altında beş türe ayırır:"
    )
    pdf.madde_listesi([
        "1. Metinlerarasılık (Intertextualité): Bir metnin içinde başka bir metnin varlığı (doğrudan alıntı, intihal, örtük anıştırma/gönderme).",
        "2. Yanmetinsellik (Paratextualité): Metni çevreleyen eşik metinler (başlık, alt başlık, önsöz, epigraf, dipnot, son söz, kapak görseli).",
        "3. Üstmetinsellik (Metatextualité): Bir metnin başka bir metni doğrudan adını anarak eleştirmesi, tefsir etmesi veya yorumlaması.",
        "4. Türevmetinsellik (Hypertextualité): Bir kök metnin (hypotext) parodi, pastiş, dönüştürme veya yeniden yazımla yeni bir metne (hypertext) evrilmesi.",
        "5. Mimarmetinsellik (Architextualité): Metnin kendisini belirli bir türe (roman, trajedi, pastoral şiir) ait ilan etmesi veya ima etmesi.",
    ])
    pdf.ornek_kutusu(
        "Metinlerarasılık - Orhan Pamuk'un 'Kara Kitap'ı",
        "Galip, kaybolan karısı Rüya'yı ve gizemli köşe yazarı Celâl Salik'i aramak için "
        "İstanbul'un karlı sokaklarında, apartman dairelerinde ve yeraltı dehlizlerinde dolaşır.",
        "Roman, Şeyh Gâlib'in 18. yüzyıl tasavvufi mesnevisi 'Hüsn ü Aşk'ın postmodern bir "
        "türevmetinsel (hypertextual) yeniden yazımıdır. Galip 'Aşk'ı, Rüya 'Hüsn'ü (Güzellik), "
        "Celâl ise mürşidi temsil eder. Aşk'ın sevgilisine kavuşmak için 'Diyâr-ı Kalb'e "
        "yaptığı çetin seyahat, Galip'in İstanbul sokaklarındaki arayışına dönüştürülmüştür."
    )

    # 7. Şüpheci (Semptomatik) Okuma
    pdf.alt_alt_bolum("7. Şüpheci (Semptomatik) Okuma")
    pdf.paragraf(
        "Paul Ricoeur'ün 'Şüphe Hermeneutiği' (Marx, Freud, Nietzsche) ve Louis Althusser'in "
        "'Semptomatik Okuma' kavramlarından doğmuştur. Metnin yüzeyde iddia ettiği anlama "
        "inanmaz; metnin kekelediği, çelişkiye düştüğü, aşırı telaşla savunduğu ya da "
        "tamamen suskun kaldığı çatlakları birer 'semptom' olarak okur. Metnin ideolojik "
        "ve psikolojik bilinçdışını açığa çıkarır."
    )
    pdf.madde_listesi([
        "Tipik Adımlar: Metnin yüzeyindeki ahenk iddiasına kuşkuyla yaklaşmak; yazarın bilerek ya da bilmeyerek üstünü örttüğü boşlukları (aporia) saptamak; metnin görünüşteki temasıyla alt metindeki korkuları karşılaştırmak.",
        "Dayandığı Kuramlar: Psikanalitik Eleştiri (Freud, Lacan), İdeoloji Eleştirisi (Althusser, Macherey, Jameson).",
    ])
    pdf.ornek_kutusu(
        "Semptomatik Okuma - Halit Ziya'nın 'Aşk-ı Memnu'su",
        "Romanda Adnan Bey, genç karısı Bihter ile kızı Nihal arasında bir denge kurmaya "
        "çalışan müşfik, saygın ve dürüst bir baba olarak takdim edilir. Konak hayatı "
        "ise sükûnet ve asalet timsalidir.",
        "Semptomatik okuma yüzeydeki 'müşfik baba' kurgusunu deşer: Adnan Bey'in Nihal'e "
        "yönelik aşırı korumacı tavrı, yaşlanan bir erkeğin iktidarını koruma arzusunun ve "
        "örtük bir elektra karmaşasının semptomudur. Metin Adnan Bey'i masum gösterdikçe, "
        "onun genç bir kadını konağa hapsedip cinsellikten ve hayattan tecrit eden ataerkil "
        "şiddeti daha görünür hâle gelir. Bihter'in intiharı ahlaksızlığın cezası değil, "
        "bu boğucu yapının patlama semptomudur."
    )

    # 8. Yüzey ve Onarıcı Okuma
    pdf.alt_alt_bolum("8. Yüzey ve Onarıcı Okuma (Surface & Reparative Reading)")
    pdf.paragraf(
        "Eve Kosofsky Sedgwick ve Rita Felski gibi çağdaş kuramcılar tarafından geliştirilen "
        "bu yöntem, edebiyat eleştirisini sürekli bir 'suçlu arama dedektifliğine' ve "
        "paranoyak bir şüpheciliğe hapseden yaklaşımlara tepki olarak doğmuştur. Metnin "
        "derinliklerinde gizli bir kötülük ya da ideolojik yalan aramak yerine, metnin "
        "yüzeyinde cömertçe sunduğu duyusal zenginliğe, duygu tonuna (afekt) ve okuru "
        "onaran, iyileştiren estetik deneyime odaklanır."
    )
    pdf.madde_listesi([
        "Tipik Adımlar: Metni yargılamadan, yüzeydeki dilsel ve duyusal niteliklerini ayrıntılı olarak betimlemek; metnin bedende uyandırdığı duygulanımlara (neşe, keder, merhamet) dikkat kesilmek; metinle şefkatli ve onarıcı bir ortaklık kurmak.",
        "Dayandığı Kuramlar: Duygulanım Kuramı (Affect Theory), Kuir Teori (Sedgwick), Post-Eleştiri (Rita Felski).",
    ])
    pdf.ornek_kutusu(
        "Onarıcı Okuma - Sait Faik'in 'Semaver'i",
        "Ali sabah fabrikaya gitmeden önce annesinin uyandırdığı anı, kaynayan semaverin "
        "sesini ve buğusunu büyük bir huşu içinde yaşar. Semaver onun için adeta yaşayan, "
        "altın kalpli bir dosttur.",
        "Şüpheci bir okuma bu metinde derhal 'erken kapitalizmin işçi sınıfını afyonlayan "
        "yanılsamalı bir aile idili' teşhisi koyabilir. Oysa onarıcı okuma, Ali'nin semaver "
        "başında hissettiği saf şükranı, yoksul bir sabahın içindeki kırılgan yaşama "
        "sevincini ve anne sevgisinin teselli edici gücünü yüzeyde olduğu gibi kucaklar. "
        "Metin ideolojik bir aldatmaca değil, insana hayatta kalma gücü veren estetik bir sığınaktır."
    )

    # 9. Kontrapuntal ve Karşı Okuma
    pdf.alt_alt_bolum("9. Kontrapuntal ve Karşı Okuma (Contrapuntal Reading)")
    pdf.paragraf(
        "Edward Said'in klasik Batı müziğindeki kontrpuan (çokseslilik) tekniğinden "
        "esinlenerek edebiyata uyarladığı yöntemdir. Bir eserin merkezindeki egemen, "
        "uygar ve ışıltılı anlatıyı dinlerken; aynı anda arka planda bastırılmış, "
        "sömürgeleştirilmiş ya da görünmez kılınmış madun (öteki) sesleri birlikte duymayı "
        "amaçlar. Metni kendi tahakkümüne karşı okur."
    )
    pdf.madde_listesi([
        "Tipik Adımlar: Metnin görünürdeki kahramanını ve merkezî mekânını belirlemek; bu kahramanın konforunu sağlayan görünmez emek, sömürülen çevre veya susturulan kimlikleri açığa çıkarmak; iki melodiyi aynı anda tınlatarak çatışmayı sergilemek.",
        "Dayandığı Kuramlar: Postkolonyal Kuram (Said, Spivak, Bhabha), Maduniyet Çalışmaları (Subaltern Studies).",
    ])
    pdf.ornek_kutusu(
        "Kontrapuntal Okuma - Halide Edip'in 'Vurun Kahpeye'si",
        "İstanbullu idealist öğretmen Aliye, Anadolu kasabasına aydınlanma ve Millî Mücadele "
        "inancını taşımak için gider; fakat gerici kasaba eşrafının kışkırtmasıyla linç edilir.",
        "Egemen okuma metni fedakâr Türk kadını ve aydınlanma mitosu üzerinden tek sesli "
        "okur. Kontrapuntal okuma ise Aliye'nin sesini dinlerken, arka plandaki köylülerin "
        "ve kasabalı kadınların neden bu denli yabancılaştığını, İstanbullu merkezin "
        "taşrayı nasıl 'ıslah edilmesi gereken barbar bir karanlık' olarak kodladığını "
        "aynı anda duyar. Aydınlanma anlatısı ile taşranın sessizliği kontrapuntal bir gerilim üretir."
    )

    # 10. Okur-Tepki ve Empirik Yöntem
    pdf.alt_alt_bolum("10. Okur-Tepki ve Empirik Yöntem")
    pdf.paragraf(
        "Metnin sayfalar arasında donmuş bir nesne olmadığını, ancak bir okurun zihninde "
        "canlandığı zaman gerçek anlamını kazandığını öne sürer. Empirik yöntemler ise "
        "okuma eylemini spekülatif bir yorum olmaktan çıkarıp gerçek okurların tepkilerini "
        "anketler, odak grupları, sesli düşünme protokolleri ve göz izleme (eye-tracking) "
        "cihazlarıyla ölçülebilir verilere dönüştürür."
    )
    pdf.madde_listesi([
        "Tipik Adımlar: Metindeki anlam boşluklarını ve belirsizlikleri (Iser'in Leerstelle kavramı) saptamak; farklı okur kitlelerinin beklenti ufuklarını (Jauss) belirlemek; gerçek okurlardan deney yoluyla okuma süreci verisi toplamak.",
        "Dayandığı Kuramlar: Alımlama Estetiği (Iser, Jauss), Duygusal Yanılsama / Yorumlayıcı Cemaatler (Fish), Bilişsel Poetik.",
    ])
    pdf.ornek_kutusu(
        "Okur-Tepki Çözümlemesi - Oğuz Atay'ın 'Tutunamayanlar'ı",
        "1972 yılında yayımlandığında dönemin egemen 'toplumcu-gerçekçi' beklenti ufkuna "
        "çarpan 'Tutunamayanlar', edebiyat çevrelerinde neredeyse tamamen görmezden gelindi "
        "ve ilk baskısı yıllarca tüketilmedi.",
        "Ancak 1980 darbesi sonrasında toplumsal ütopyaları kırılan, bireyin iç yabancılaşmasını "
        "ve varoluş krizini derinden hisseden yeni bir okur kuşağı doğdu. 1990'larda İletişim "
        "Yayınları baskısıyla birlikte okur cemaatinin beklenti ufku radikal biçimde değişti "
        "ve Atay'ın metnindeki boşluklar (Leerstelle) kült bir başyapıt olarak dolduruldu."
    )

    # 11. Hesaplamalı Yöntem
    pdf.alt_alt_bolum("11. Hesaplamalı Yöntem (Computational Literary Studies)")
    pdf.paragraf(
        "Franco Moretti'nin 'Uzak Okuma' (Distant Reading) kavramından ilham alan bu yöntem, "
        "tek bir metne mikroskopla bakmak yerine yüzlerce ya da binlerce metinden oluşan "
        "büyük veri (corpus) kümelerini bilgisayar algoritmalarıyla inceler. Doğal dil "
        "işleme (NLP), sözcük sıklığı, duygu analizi ve ağ analizi (network analysis) "
        "araçlarıyla edebiyat tarihindeki makro örüntüleri ortaya çıkarır."
    )
    pdf.madde_listesi([
        "Tipik Adımlar: Geniş bir metin külliyatını dijital ortama aktarıp temizlemek (korpus hazırlığı); n-gram sıklıkları, duygu skorları ve karakter etkileşim ağlarını algoritmalarla hesaplamak; ortaya çıkan sayısal örüntüleri edebiyat kuramıyla yorumlamak.",
        "Dayandığı Kuramlar: Dijital Beşeri Bilimler (Digital Humanities), Sayısal Anlatıbilim, Korpus Dilbilim.",
    ])
    pdf.ornek_kutusu(
        "Hesaplamalı Yöntem - Tanzimat'tan Cumhuriyet'e Duygu Değişimi",
        "1870-1940 yılları arasında yazılmış 120 Türk romanı dijital ortama aktarılıp "
        "duygu analizi (sentiment analysis) sözlükleriyle tarandığında çarpıcı bir grafik elde edilir.",
        "Tanzimat romanlarında hüzün ve keder sözcüklerinin tepe noktası ölüm ve verem "
        "sahneleriyken; 1908 Meşrutiyet romanlarında coşku ve ümit grafiklerinin yükseldiği, "
        "1930'lar romanında ise mekânsal hareketlilik fiillerinin (gitmek, koşmak, inşa etmek) "
        "Cumhuriyet modernleşmesiyle paralel olarak yüzde 340 arttığı sayısal olarak kanıtlanabilir."
    )

    # 12. Uygulamaya Dayalı Araştırma
    pdf.alt_alt_bolum("12. Uygulamaya Dayalı Araştırma (Practice-Based Research)")
    pdf.paragraf(
        "Özellikle Yaratıcı Yazarlık lisansüstü programlarında uygulanan bu yöntem, "
        "'yazma eyleminin kendisinin kuramsal bir bilgi üretme süreci olduğunu' kabul eder. "
        "Yazar yalnızca başkalarının kuramlarını uygulamaz; bir roman, şiir veya oyun "
        "yazarken karşılaştığı estetik krizleri, taslak aşamalarını ve biçimsel arayışları "
        "belgeleyerek kendi poetikasını (exegesis) inşa eder."
    )
    pdf.madde_listesi([
        "Tipik Adımlar: Yaratıcı bir araştırma sorusu tanımlamak (Örn: 'Tarihî bir travma çoksesli anlatıcıyla nasıl kurgulanır?'); yaratıcı eseri yazarken eş zamanlı refleksif süreç günlüğü tutmak; taslak revizyonlarını kaydetmek; eserin yanına kuramsal analizini eklemek.",
        "Dayandığı Kuramlar: Donald Schön'ün 'Eylem İçinde Yansıtma' kuramı, Sanat Temelli Araştırma (Arts-Based Research), Otoetnografi.",
    ])
    pdf.ornek_kutusu(
        "Uygulamaya Dayalı Araştırma - Bir Romanın Doğuş Günlüğü",
        "Bir yazar, 1955 yılı 6-7 Eylül olaylarını anlatan bir roman yazmaya başlar. "
        "Karakterlerden birini Rum bir terzi, diğerini ise yağmaya katılan taşralı bir genç olarak kurgular.",
        "Yazar her yazma seansının ardından süreç günlüğü tutar: 'Bugün yağma sahnesinde "
        "üçüncü şahıs anlatıcının fazla yargılayıcı olduğunu fark ettim. Bakış açısını "
        "iç odaklanıma kaydırdığımda dilin ideolojik şiddeti daha somut belirdi.' Bu günlük "
        "ve tamamlanan roman, yaratıcı sürecin kuramsal bir tefsirine dönüşür."
    )

    # -------------------------------------------------------------------------
    # 7.3 Yakın Okuma İçin Yedi Adım
    # -------------------------------------------------------------------------
    pdf.alt_bolum("Yakın Okuma İçin Yedi Adım")

    pdf.paragraf(
        "Yakın okuma rastgele bir ayrıntı avcılığı değil, belirli bir disiplin ve sıra "
        "takip eden derinlemesine bir kazı çalışmasıdır. Aşağıdaki yedi adımlı kılavuz, "
        "herhangi bir şiir veya düzyazı pasajını adım adım çözümlemek için geliştirilmiştir. "
        "Bu adımların tamamı, Ahmet Hamdi Tanpınar'ın ünlü 'Ne İçindeyim Zamanın' "
        "şiirinin açılış dörtlüğü üzerinde somut olarak uygulanmıştır."
    )

    pdf.bold_paragraf(
        "İncelenecek Örnek Metin:\n"
        "'Ne içindeyim zamanın,\n"
        "Ne de büsbütün dışında;\n"
        "Yekpâre, geniş bir ânın\n"
        "Parçalanmaz akışında.'"
    )

    pdf.madde_listesi([
        "1. Adım: İlk Temas ve Harfi Harfine Anlama (Literal Sense). Metni sesli okuyun. Cümlelerin gramatikal anlamını çıkarın. Şiirde konuşan özne nerede duruyor? Zamanın ne içinde ne de dışındadır; tek parça, geniş bir anın akışı içindedir. Harfi harfine bakıldığında fiziksel olarak imkânsız bir varoluş durumu tarif edilmektedir.",
        "2. Adım: Sözcük Dağarcığı, Etimoloji ve Yan Anlamlar (Diction & Connotation). Kilit sözcüklere büyüteçle bakın: 'Yekpâre' (Farsça: tek parça, bölünmemiş, yekvücut); 'an' (Arapça: en küçük zaman birimi, lahza); 'akış' (Türkçe: su gibi hareket eden). Burada dikkat çekici olan, donuk ve yekpare bir şey ile hareket eden 'akış'ın aynı tamlamada ('yekpare anın parçalanmaz akışı') birleştirilmesidir.",
        "3. Adım: Sözdizimi, Noktalama ve Ritim (Syntax & Rhythm). 'Ne... ne...' bağlacı ikili bir askıda kalma, arafta durma duygusu kurar. Şiir 8'li hece ölçüsüyle yazılmıştır (4+4 duraklı). Hece ritmi ve kafiye örgüsü (dışında / akışında) metne sakin, hipnotik ve meditatif bir musiki kazandırır.",
        "4. Adım: İmgelem ve Figüratif Dil (Imagery & Tropes). Zaman hem geniş bir mekân ('içinde/dışında') hem de akıp giden bir sıvı ('akış') olarak cisimleştirilmiştir. Burada soyut bir kavram olan zaman, dokunulabilir bir kristal fanusa ve aynı zamanda bir nehre dönüştürülmüştür.",
        "5. Adım: Ton ve Anlatıcı Sesi (Tone & Voice). Anlatıcının sesi iddiacı veya öfkeli değildir; tam tersine içe kapanmış, mistik bir uyanış ve rüya hâlini yaşayan dingin bir bilincin fısıltısıdır.",
        "6. Adım: Çatlaklar, Paradokslar ve İç Gerilimler (Paradoxes & Tensions). Metnin merkezinde çözülmez bir paradoks (oxymoron) yatar: 'Parçalanmaz' olan şey nasıl 'akar'? Akış parçalanmayı, değişimi ve geçiciliği gerektirir; yekparelik ise donmayı ve ebediyeti imler. Şair akış ile donmayı birleştirerek zamanı dondurmuştur.",
        "7. Adım: Bütünleme ve Yorum Tezinin İnşası (Synthesis & Claim). Tüm bu verileri sentezleyerek bir tez cümlesi kurarız: 'Tanpınar, bu dörtlükte Bergson'un saf süre (durée) felsefesini Türkçeleştirerek, mekanik saat zamanının parçalayıcılığına karşı bilincin kesintisiz, rüya benzeri ebediyet deneyimini estetik bir sığınak olarak inşa eder.'",
    ], numbered=True)

    # -------------------------------------------------------------------------
    # 7.4 Hangi Soru, Hangi Kuram?
    # -------------------------------------------------------------------------
    pdf.alt_bolum("Hangi Soru, Hangi Kuram?")

    pdf.paragraf(
        "Metin çözümlemeye veya yaratıcı bir projeye başlarken en kritik adım, elinizdeki "
        "sorunun hangi kuramsal ve yöntemsel araçla çözülebileceğini doğru tayin etmektir. "
        "Yanlış aletle doğru iş yapılamaz; örneğin bir metnin psikolojik bastırmalarını "
        "çözmek için Rus Biçimciliğinin hece sayma araçları yetersiz kalacaktır."
    )

    # Karar Tablosu
    headers_7 = ["Sorduğunuz Soru", "Önerilen Kuram", "Yöntemsel Yaklaşım", "Odaklandığı Alan"]
    rows_7 = [
        ["Metin nasıl inşa edilmiş? Sözcükler ve ritim anlamı nasıl üretiyor?", "Yeni Eleştiri / Biçimcilik", "Yakın Okuma", "Dil, biçim, kafiye, iç çelişki"],
        ["Olay örgüsü nasıl akıyor? Anlatıcı kim ve olayları nereden görüyor?", "Anlatıbilim (Narratology)", "Yapısal Anlatı Analizi", "Süre, odaklayıcı, analepsis"],
        ["Karakterin gizli arzusu ne? Neyi bastırıyor ve dili nerede sürçüyor?", "Psikanalitik Kuram", "Semptomatik Okuma", "Bilinçdışı, rüya, Oidipal arzu"],
        ["Metindeki sınıfsal çatışma nedir? Parayı ve mülkiyeti kim kontrol ediyor?", "Marksist Kuram", "Tarihsel Materyalist Analiz", "Emek, ideoloji, alt-orta sınıf"],
        ["Cinsiyet rolleri nasıl kurgulanmış? Kadın özne mi yoksa arzu nesnesi mi?", "Feminist Kuram", "Toplumsal Cinsiyet Okuması", "Ataerki, kadın dili, tahakküm"],
        ["Metin hangi önceki metinlerle konuşuyor? Hangi klasiği dönüştürüyor?", "Metinlerarasılık", "Transtextual Analiz (Genette)", "Pastiş, parodi, alıntı, altmetin"],
        ["Metnin yazıldığı dönemin siyasi krizleri ve iktidar ilişkileri neler?", "Yeni Tarihselcilik", "Bağlamsal / Söylem Analizi", "Dönem zihniyeti, iktidar/bilgi"],
        ["Merkez anlatının dışladığı, ötekileştirdiği ve susturduğu kim?", "Postkolonyal Kuram", "Kontrapuntal Okuma (Said)", "Doğu-Batı, maduniyet, melezlik"],
        ["Doğa ve çevre nasıl temsil edilmiş? İnsanmerkezci bir kibir var mı?", "Ekoeleştiri (Ecocriticism)", "Yeşil Okuma (Ecocritical)", "Doğa, hayvanlar, çevre adaleti"],
        ["Gerçek okurlar bu metni nasıl anlıyor? Tarih içinde alımlama nasıl değişti?", "Alımlama Estetiği", "Okur-Tepki / Empirik Yöntem", "Beklenti ufku, anlam boşluğu"],
        ["Yüzlerce romanda belirli bir temanın zaman içindeki değişimi nedir?", "Dijital Beşeri Bilimler", "Uzak Okuma (Distant Reading)", "Büyük veri, sözcük sıklığı"],
        ["Ben yazarken hangi biçimsel kararları aldım ve poetikam ne?", "Yaratıcı Yazarlık Pedagojisi", "Uygulamaya Dayalı Araştırma", "Süreç günlüğü, taslak analizi"],
    ]
    pdf.tablo_basit(headers_7, rows_7, [45, 45, 50, 50])

    pdf.etkinlik_kutusu(
        "Bölüm 7 Uygulama Alıştırmaları",
        [
            "Bir Şiire Yakın Okuma: Cahit Sıtkı Tarancı'nın 'Otuz Beş Yaş' şiirinin ilk iki bendini seçin. Metindeki zaman belirteçlerini, ikilemeleri ve tezatları 'Yedi Adım' kılavuzuna göre listeleyin.",
            "Transtextuality Dedektifliği: Çok sevdiğiniz çağdaş bir Türk romanı seçin (örn: İhsan Oktay Anar veya Latife Tekin). Genette'in beş kategorisinden (yanmetin, metinlerarasılık, türevmetin vb.) en az üçünü metinde somut olarak bulun.",
            "Semptomatik Okuma Denemesi: Popüler bir televizyon dizisi veya klasik bir öyküdeki en 'kusursuz, fedakâr' görünen karakteri seçin. Karakterin hangi bencillikleri ya da korkuları bastırdığını semptomatik olarak yazın.",
            "Uzak Okuma Tasarımı: Eğer elinizde 100 yıllık tüm Türk romanlarının dijital metinleri olsaydı, hangi iki sözcüğün frekansını karşılaştırmak isterdiniz? Bir araştırma hipotezi kurun.",
        ]
    )

    pdf.tartisma_sorulari([
        "Bir edebi metni çözümlerken yazarın niyetini bilmek gerçekten gerekli midir, yoksa Wimsatt ve Beardsley'nin dediği gibi 'Kasıt Yanılsaması'na (Intentional Fallacy) mı düşeriz?",
        "Şüpheci okuma ile onarıcı okuma arasındaki gerilimde siz bir okur olarak kendinizi nereye yakın hissediyorsunuz? Metinlerde daima bir yalan mı aramalayız, yoksa teselli mi?",
        "Dijital araçlarla binlerce romanı tarayan 'Uzak Okuma' yöntemi, tek bir dizeyi günlerce düşünen 'Yakın Okuma'nın yerini tutabilir mi?",
        "Söylem çözümlemesi açısından bakıldığında, edebiyatta tamamen tarafsız, ideolojiden arınmış masum bir cümle kurmak mümkün müdür?",
    ])

    pdf.bolum_ozeti([
        "Kuram 'ne ve niçin' sorularını sorarak kavramsal gözlük sunar; yöntem 'nasıl' sorusuna yanıt vererek metin üzerinde adım adım analiz araçları sağlar.",
        "Metinden kopuk kuram boş spekülasyona, kuramsız yöntem ise ezbere şablonculuğa yol açar; yetkin bir inceleme metinsel kanıtla kuramı buluşturur.",
        "Yakın Okuma, Biçimsel Anlatı Analizi, Metinlerarasılık, Söylem Çözümlemesi, Semptomatik Okuma gibi 12 temel yöntem edebiyat araştırmalarının zengin alet çantasını oluşturur.",
        "Yakın Okuma Yedi Adım Kılavuzu: Harfi harfine anlama, sözcük dağarcığı, sözdizimi, imgelem, ton, paradoks ve tezin inşası sırasını izler.",
        "Doğru metin çözümlemesi, sorulan soru ile seçilen kuram ve yöntemin tam uyum içinde olmasına bağlıdır.",
    ])

    # =========================================================================
    # BÖLÜM 8: YAZAR İÇİN UYGULAMA
    # =========================================================================
    pdf.bolum_basligi(8, "Yazar İçin Uygulama")

    # -------------------------------------------------------------------------
    # 8.1 Kuramı Yazarken Nasıl Kullanırsınız?
    # -------------------------------------------------------------------------
    pdf.alt_bolum("Kuramı Yazarken Nasıl Kullanırsınız?")

    pdf.paragraf(
        "Pek çok yazar adayı kuramdan korkar; kuramın yaratıcı coşkuyu öldüreceğini, "
        "içtenliği kurutacağını ve metni yapay bir laboratuvar deneyine çevireceğini düşünür. "
        "Bu kaygı, kuramın yalnızca metin bittikten sonra onu parçalayan bir 'otopsi bıçağı' "
        "olarak görülmesinden kaynaklanır. Oysa büyük yazarlar için kuram otopsi aleti "
        "değil; inşaat iskelesi, pusula ve kör noktaları aydınlatan güçlü bir projektördür."
    )

    pdf.paragraf(
        "Kuram masada yazarken arka planda fısıldayan bilge bir danışmandır. Sizi "
        "farkında olmadan içine düştüğünüz klişelerden, melodram tuzaklarından, sığ "
        "karakter çizimlerinden ve ideolojik saflıklardan korur. Aşağıdaki tablo, her bir "
        "kuramsal okulun yazara hangi kritik soruyu sordurduğunu ve yaratıcı masadaki "
        "somut karşılığını göstermektedir."
    )

    headers_8 = ["Edebiyat Kuramı", "Yazara Fısıldadığı Kritik Soru", "Yaratıcı Masadaki Pratik Karşılığı"]
    rows_8 = [
        [
            "Rus Biçimciliği",
            "Bu sahneyi okurun ezberini bozacak şekilde nasıl yabancılaştırabilirsin?",
            "Otomatikleşmiş betimlemeleri sil. Nesneyi ilk kez gören bir çocuğun veya uzaylının gözüyle anlat; algıyı yavaşlat."
        ],
        [
            "Yeni Eleştiri",
            "Metninin iç gerilimi nerede? Hangi imge organik bir omurga kuruyor?",
            "Açıklama yapma, imgeye yükle. Birbiriyle çatışan iki duyguyu tek bir nesnede (örneğin donmuş bir soba) düğümle."
        ],
        [
            "Yapısalcılık & Anlatıbilim",
            "Bu sahneyi kim görüyor, kim anlatıyor? Zaman hızı doğru mu?",
            "Anlatıcı ile odaklayıcıyı ayır. Kritik dramatik anda sahneyi yavaşlat (duraklama), önemsiz yılları tek cümleyle geç (özet)."
        ],
        [
            "Psikanalitik Kuram",
            "Karakterin bilincine bile itiraf edemediği gizli, bastırılmış arzusu ne?",
            "Karakterin söyledikleriyle yaptıkları arasına çelişki koy. Dil sürçmeleri, tikler ve tekrar eden rüyalar yerleştir."
        ],
        [
            "Marksizm & Sosyal Kuram",
            "Bu karakterlerin kirasını kim ödüyor? Sınıfsal baskı ilişkileri nerede?",
            "Karakterleri boşlukta yaşatma. Cüzdanlarını, çalışma saatlerini, borçlarını ve sınıfsal aidiyetlerinin dildeki izini göster."
        ],
        [
            "Feminist Kuram",
            "Kadın karakterler sadece erkeklerin yolculuğuna fon mu oluşturuyor?",
            "Kadınlara kendi bağımsız arzularını, çelişkilerini ve iç seslerini ver. 'Kutsal anne' veya 'femme fatale' klişelerini kır."
        ],
        [
            "Postyapısalcılık & Yapısöküm",
            "Metninin kendi kendisiyle çeliştiği, anlamın kaydığı kırılma noktası nerede?",
            "Karakterlerine kesin doğrular söyletme. Dilin yetersiz kaldığı, suskunluğun konuştuğu aporia anları inşa et."
        ],
        [
            "Postkolonyal Kuram",
            "Kurguladığın dünyada 'biz' kim, 'ötekiler' kim? Kültürel melezlik nerede?",
            "Ötekileştirilen karakterleri tek tip bir egzotizmle çizme; onların kendi dilini, aksanını ve bakış açısını merkeze al."
        ],
        [
            "Ekoeleştiri",
            "Mekân ve doğa yalnızca pasif bir dekor mu, yoksa yaşayan bir aktör mü?",
            "Hava durumunu, sokak hayvanlarını, toprağı ve bitkileri insan eylemine maruz kalan değil, insanı etkileyen bir özne yap."
        ],
        [
            "Alımlama Estetiği",
            "Okura metni tamamlaması için yeterince anlam boşluğu (Leerstelle) bıraktın mı?",
            "Her şeyi gevezelikle açıklama. Olayın en can alıcı sonucunu satır arasına gizle; okurun zihnini ortak yazar hâline getir."
        ],
    ]
    pdf.tablo_basit(headers_8, rows_8, [40, 50, 100])

    pdf.paragraf(
        "Görüldüğü üzere kuram, yazarın elini kolunu bağlayan kurallar manzumesi değil; "
        "aksine metnin her bir vidasını daha sağlam sıkmasını sağlayan profesyonel bir "
        "atölye aletidir. Kuramsal bilince sahip bir yazar, yazdığı her cümlenin estetik, "
        "psikolojik ve politik ağırlığını tartarak ilerler."
    )

    # -------------------------------------------------------------------------
    # 8.2 Bir Sahneyi Altı Kuramla Okumak
    # -------------------------------------------------------------------------
    pdf.alt_bolum("Bir Sahneyi Altı Kuramla Okumak")

    pdf.paragraf(
        "Kuramların aynı metinsel gerçekliğe baktıklarında nasıl bambaşka evrenler, "
        "çatışmalar ve anlam katmanları keşfettiğini görmenin en berrak yolu, tek bir "
        "somut sahneyi farklı kuramsal gözlüklerle okumaktır. Aşağıdaki üç cümlelik "
        "kısa sahne, edebiyat kuramının gücünü sınamak için özel olarak seçilmiştir:"
    )

    pdf.ornek_kutusu(
        "İncelenecek Temel Sahne",
        "Fatma Hanım oğlunun odasının kapısını yarım bırakıp mutfağa döndü. "
        "Çaydanlığın altını kıstı ama kulağı hâlâ yukarıdaydı. Sonra kendi kendine, "
        "bu evin duvarlarının ne kadar ince olduğunu düşündü.",
        "Bu sahne hiçbir olağanüstü olay, cinayet veya fırtına içermez; son derece sıradan "
        "bir gündelik aile anıdır. Ancak altı farklı kuram bu sahneyi masaya yatırdığında, "
        "üç cümlenin altından devasa felsefi ve dramatik dünyalar fışkıracaktır."
    )

    # 1. Biçimci Okuma
    pdf.alt_alt_bolum("1. Biçimci Okuma (Russian Formalism)")
    pdf.paragraf(
        "Biçimci okuma, bu sahnedeki duyusal ayrıntıların ve mekânsal eylemlerin gündelik "
        "alışkanlığı nasıl kırdığına (yabancılaştırma / defamiliarization) odaklanır. "
        "Fatma Hanım kapıyı kapatmaz ya da ardına kadar açmaz; 'yarım bırakır'. Bu 'yarım'lık, "
        "mekânın sınırlarını belirsizleştiren biçimsel bir geciktirme (retardation) aygıtıdır. "
        "Çaydanlığın altının kısılması eylemi, mutfaktaki kaynama sesini azaltarak işitsel "
        "odağı yukarıya ('kulağı hâlâ yukarıdaydı') kaydırır. Sesin kısılması, yukarıdaki "
        "sessizliği daha gürültülü ve tekinsiz kılar. 'Duvarların ince olması' ise mimari "
        "bir veri olmaktan çıkar; algının maddeselleşmesi ve sesin mekândaki geçirgenliğinin "
        "biçimsel bir aygıt olarak kurgulanmasıdır."
    )

    # 2. Yeni Eleştiri Okuması
    pdf.alt_alt_bolum("2. Yeni Eleştiri Okuması (New Criticism)")
    pdf.paragraf(
        "Yeni Eleştiri, sahnenin dışındaki hiçbir veriye bakmadan metnin kendi içindeki "
        "organik bütünlüğü, zıtlıkları ve sembolik gerilimleri (tension) araştırır. Metnin "
        "merkezinde 'kapalı/açık' ve 'yakın/uzak' paradoksu yatar. 'Yarım bırakılan kapı', "
        "mahremiyet ile gözetleme arasındaki kararsızlığın nesnel karşılığıdır (objective "
        "correlative). Çaydanlığın altını kısmak içsel kaynamayı ve tedirginliği dengelerken; "
        "'kulağın yukarıda, bedenin mutfakta' olması ruh ile bedenin bölünmüşlüğünü simgeler. "
        "'Duvarların inceliği' ise evin koruyucu bir sığınak değil, sırları saklayamayan "
        "kırılgan ve her an çatlayabilecek sembolik bir kabuk olduğunu gösterir. Bütün imgeler "
        "birbirini yankılayarak tekinsiz bir iç gerilim inşa eder."
    )

    # 3. Psikanalitik Okuma
    pdf.alt_alt_bolum("3. Psikanalitik Okuma (Psychoanalytic Theory)")
    pdf.paragraf(
        "Psikanalitik okuma, sahneyi bilinçdışı arzular, ayrılma anksiyetesi ve Oidipal "
        "bağın çözülemeyişi ekseninde çözer. Anne, yetişkinleşen oğlunun odasının kapısını "
        "tamamen kapatamaz; çünkü kapıyı kapatmak göbek bağını kesmek, oğlunun kendi cinsel "
        "ve bireysel mahremiyetini kabul etmek demektir. Kapının 'yarım' kalması, annenin "
        "ayrılma kaygısının ve oğlunun sınırlarını ihlal etme arzusunun semptomudur. Çaydanlığın "
        "altını kısmak, annenin kendi içinde kaynayan bastırılmış dürtülerini ve kaygısını "
        "frenleme çabasıdır. Duvarların inceliğinden şikâyet etmesi ise klasik bir yansıtmadır "
        "(projection): Aslında ince olan evin duvarları değil, anne ile oğul arasındaki benlik "
        "sınırlarıdır. Anne oğlunun iç dünyasına sızmak istemekte, ama aynı zamanda onun "
        "kendi gizli arzularını duymasından dehşet duymaktadır."
    )

    # 4. Marksist Okuma
    pdf.alt_alt_bolum("4. Marksist Okuma (Marxist Theory)")
    pdf.paragraf(
        "Marksist okuma, bu sahnedeki görünmeyen sınıfsal ve mekânsal koşulları ortaya serer. "
        "Fatma Hanım'ın evi terk edemeyişi ve mutfağa dönmesi, kadının hane içindeki "
        "ücretsiz ve görünmeyen bakım emeğinin (çay demlemek, evi gözetmek) doğal bir "
        "sonucudur. Mutfak kadının üretim ve hapis alanıdır. 'Duvarların ne kadar ince "
        "olduğu' tespiti ise doğrudan modern kentsel yoksulluğun ve alt-orta sınıf konut "
        "sektörünün bir eleştirisidir. Yalıtımsız, ucuz malzemeyle yapılmış apartman daireleri, "
        "işçi ve alt-orta sınıfa mahremiyet hakkı tanımaz. Burjuva bireyciliğinin en temel "
        "şartı olan 'özel alan ve ses yalıtımı', bu evde maddî imkânsızlık yüzünden "
        "yok edilmiştir. İnce duvarlar, yoksulluğun ev içindeki fiziksel şiddetidir."
    )

    # 5. Feminist Okuma
    pdf.alt_alt_bolum("5. Feminist Okuma (Feminist Theory)")
    pdf.paragraf(
        "Feminist okuma, mekânın cinsiyetlendirilmesini ve ataerkil aile yapısının kadına "
        "yüklediği gözetleme rolünü çözümler. Evin içinde erkek evlat kendine ait kapalı "
        "bir 'özel oda' hakkına sahipken, anneye sadece hizmet ürettiği mutfak layık görülmüştür. "
        "Fatma Hanım oğlunun odasına rahatça giremez; kapıyı yarım bırakıp çekilmek zorundadır. "
        "Ataerki kadını hem evin ahlak bekçisi ve gözetleyicisi yapar ('kulağı yukarıda') "
        "hem de onu kendi evinde yabancılaştırır. Duvarların inceliği, ataerkil ev içi "
        "düzenin kadına hiçbir mahrem kaçış alanı bırakmadığını; kadının sürekli bir "
        "panoptikon gibi hem gözetleyen hem gözetlenen konumunda sıkışıp kaldığını gösterir."
    )

    # 6. Alımlama Estetiği ve Anlatıbilimsel Okuma
    pdf.alt_alt_bolum("6. Alımlama Estetiği ve Anlatıbilimsel Okuma")
    pdf.paragraf(
        "Anlatıbilimsel açıdan metin 'iç odaklanım' (internal focalization) ile kurulmuştur: "
        "Anlatıcı her şeyi bilen tanrısal bir konumda değil, Fatma Hanım'ın algı süzgecindedir. "
        "Okur oğlun odasında ne olduğunu bilmez; sadece Fatma Hanım'ın işittiği kadarını "
        "işitebilir. Alımlama estetiği açısından ise bu üç cümle devasa bir anlam boşluğu "
        "(Leerstelle) yaratır: Kapı neden yarım bırakıldı? Yukarıdaki odada ne var? Oğul "
        "biriyle mi konuşuyor, ağlıyor mu, yoksa evden kaçmaya mı hazırlanıyor? Metin bu "
        "soruların hiçbirine cevap vermeyerek okurun zihnini hummalı bir tamamlama "
        "faaliyetine davet eder. Duvarların inceliği, okurun merakını ve tekinsizlik "
        "duygusunu zirveye taşıyan bir anlatı kancasıdır (hook)."
    )

    pdf.bilgi_kutusu(
        "Kuramsal Zenginliğin Yazara Dersi",
        "Gördüğünüz gibi, tek bir paragraf kuramlar değiştikçe altı farklı dramatik "
        "damara açıldı. Bir yazar olarak bu sahneyi yazarken hangi kuramsal damarı "
        "güçlendirmek istediğinizi bilirseniz; bir sonraki cümleyi tesadüflere bırakmaz, "
        "karakterinizin kaderini bilinçli bir estetik mimariyle örersiniz."
    )

    # -------------------------------------------------------------------------
    # 8.3 On İki Haftalık Çalışma Planı
    # -------------------------------------------------------------------------
    pdf.alt_bolum("On İki Haftalık Çalışma Planı")

    pdf.paragraf(
        "Edebiyat kuramını sindirmek ve onu yaratıcı yazma pratiğinizin ayrılmaz bir "
        "refleksi hâline getirmek sabırlı bir çıraklık gerektirir. Aşağıdaki on iki haftalık "
        "müfredat, bir yazar adayının ya da edebiyat öğrencisinin adım adım kuramsal "
        "bilinç kazanmasını sağlamak üzere tasarlanmıştır. Her hafta kuramsal bir okuma, "
        "çözümlenecek bir edebi başyapıt, somut bir yazma egzersizi ve bir poetik kazanım içerir."
    )

    haftalar = [
        (
            "1. Hafta: Edebiyat Nedir? Kuram Neden Gereklidir?",
            "Terry Eagleton - 'Edebiyat Kuramı: Giriş' (1. Bölüm: Edebiyatın Doğası).",
            "Sait Faik Abasıyanık - 'Haritada Bir Nokta' öyküsü.",
            "Yazma Egzersizi: Bir cinayet veya kaza haberini önce tamamen tarafsız bir polis tutanağı gibi yazın, ardından aynı olayı edebi bir üslupla yeniden kaleme alarak aradaki farkı analiz edin.",
            "Poetik Kazanım: Dilin bilgi aktarma işlevi ile estetik/yazınsal işlevi arasındaki ayrımı kavramak."
        ),
        (
            "2. Hafta: Rus Biçimciliği ve Yabancılaştırma",
            "Viktor Şklovski - 'Bir Teknik Olarak Sanat' (Sanat Algıyı Yavaşlatma Aygıtıdır).",
            "Lev Tolstoy - 'Kholstomer' (Bir atın gözünden mülkiyet ve insan dünyası) veya Tanpınar - 'Saatleri Ayarlama Enstitüsü'.",
            "Yazma Egzersizi: Çok sıradan bir ev eşyasını (çaydanlık, makas, kapı kolu) adını hiç anmadan ve onu ilk kez gören yabancı bir varlığın gözüyle 300 sözcükle anlatın.",
            "Poetik Kazanım: Otomatikleşmiş algıyı kırmak ve dili tazeleyerek okura dünyayı yeniden hissettirmek."
        ),
        (
            "3. Hafta: Yeni Eleştiri ve Yakın Okuma Pratiği",
            "Cleanth Brooks - 'İyi İşlenmiş Vazo' (The Well Wrought Urn) paradoks ve ironi bölümleri.",
            "Ahmet Haşim - 'Göl Saatleri' ve 'Piyâle' şiirleri.",
            "Yazma Egzersizi: İçinde tek bir açıklama veya duygu sıfatı ('üzgündü', 'korkmuştu') yer almayan, yalnızca nesnelerin ve fiziksel hareketlerin zıtlığıyla derin bir kederi hissettiren tek sayfalık bir sahne yazın.",
            "Poetik Kazanım: 'Gösterme, hissettir' ilkesini nesnel karşılık (objective correlative) ve gerilimle inşa etmek."
        ),
        (
            "4. Hafta: Yapısalcılık ve Anlatıbilim (Narratology)",
            "Gérard Genette - 'Anlatının Söylemi' (Zaman, Odaklanım, Kip).",
            "Sabahattin Ali - 'Kürk Mantolu Madonna' veya Bilge Karasu - 'Göçmüş Kediler Bahçesi'.",
            "Yazma Egzersizi: Üç dakikalık bir sokak kavgasını, geçmişe dönüşler (analepsis) ve zaman genişletmeleri kullanarak üç sayfaya yayarak yazın.",
            "Poetik Kazanım: Anlatı zamanını bir akordeon gibi uzatıp kısaltma ve bakış açısını kusursuz kontrol etme becerisi."
        ),
        (
            "5. Hafta: Psikanalitik Kuram ve Karakterin Bilinçdışı",
            "Sigmund Freud - 'Sanatçı ve Hayal Kurma', 'Tekinsiz' (Das Unheimliche).",
            "Peyami Safa - 'Dokuzuncu Hariciye Koğuşu' veya Halit Ziya Uşaklıgil - 'Aşk-ı Memnu'.",
            "Yazma Egzersizi: Karakterinize görünüşte son derece mantıklı bir yalan söyletin; ancak bir el hareketi, dil sürçmesi veya nesneyle olan takıntısıyla gerçek arzusunu okura faş edin.",
            "Poetik Kazanım: Çok boyutlu, bastırılmış çatışmaları olan derinlikli karakter inşası."
        ),
        (
            "6. Hafta: Marksizm, İdeoloji ve Maddî Koşullar",
            "Louis Althusser - 'İdeoloji ve Devletin İdeolojik Aygıtları' veya Georg Lukács - 'Tarihî Roman'.",
            "Orhan Kemal - 'Bereketli Topraklar Üzerinde' veya Yaşar Kemal - 'İnce Memed'.",
            "Yazma Egzersizi: İki karakterin diyalog kurduğu bir sahne yazın; ancak konuşmanın ritmini ve kullanılan kelimeleri tamamen onların cüzdanındaki para ve sınıfsal aidiyetleri yönlendirsin.",
            "Poetik Kazanım: Karakterleri soyut felsefi tipler olmaktan çıkarıp somut sosyo-ekonomik gerçekliğe oturtmak."
        ),
        (
            "7. Hafta: Feminist Eleştiri ve Toplumsal Cinsiyet",
            "Virginia Woolf - 'Kendine Ait Bir Oda' ve Hélène Cixous - 'Medusa'nın Kahkahası'.",
            "Leylâ Erbil - 'Tuhaf Bir Kadın' veya Sevgi Soysal - 'Tante Rosa'.",
            "Yazma Egzersizi: Geleneksel polisiyelerdeki 'kurban kadın' klişesini altüst eden; cinayeti çözen değil, kurulu erkek düzeninin dilini reddeden özerk bir kadın karakter sahnesi yazın.",
            "Poetik Kazanım: Ataerkil dil kalıplarını sorgulamak ve kadın iç sesine özgün bir gramer kazandırmak."
        ),
        (
            "8. Hafta: Postyapısalcılık ve Yapısöküm",
            "Jacques Derrida - 'Platon'un Eczanesi' (Pharmakon kavramı) ve Roland Barthes - 'Yazarın Ölümü'.",
            "Oğuz Atay - 'Tutunamayanlar' veya Latife Tekin - 'Berci Kristin Çöp Masalları'.",
            "Yazma Egzersizi: Kendi kendini yalanlayan, anlatıcının güvenilmezliğini açıkça itiraf ettiği ve metnin bir kurmaca olduğunu hatırlatan postmodern bir öykü başlangıcı yazın.",
            "Poetik Kazanım: Dilin mutlak temsil gücünü sorgulamak ve metinsel oyunu estetik bir hazza dönüştürmek."
        ),
        (
            "9. Hafta: Postkolonyalizm, Merkez ve Çevre",
            "Edward Said - 'Oryantalizm' (Giriş) ve Homi Bhabha - 'Kültürel Melezlik'.",
            "Ahmet Hamdi Tanpınar - 'Huzur' veya Kemal Tahir - 'Devlet Ana'.",
            "Yazma Egzersizi: Avrupa'dan memleketine dönen bir gencin aile evindeki ilk akşam yemeğini, dildeki aksan kırılmaları ve kültürel yarılmalar üzerinden anlatın.",
            "Poetik Kazanım: 'Biz' ve 'Öteki' dikotomisini kırmak, kültürel temas alanlarındaki gerilimi yakalamak."
        ),
        (
            "10. Hafta: Ekoeleştiri ve Mekân Kuramları",
            "Cheryll Glotfelty - 'Ekoeleştiri Okur Kitabı' ve Gaston Bachelard - 'Mekânın Poetikası'.",
            "Yaşar Kemal - 'Deniz Küstü' veya Latife Tekin - 'Ormanda Ölüm Yokmuş'.",
            "Yazma Egzersizi: Bir mahallenin kentsel dönüşümle yıkılışını bir insanın değil, kesilmek üzere olan yüz yıllık bir çınar ağacının veya sokak köpeğinin algısıyla yazın.",
            "Poetik Kazanım: İnsanmerkezci (antropomorfik) kibri kırmak ve doğayı yaşayan bir karaktere dönüştürmek."
        ),
        (
            "11. Hafta: Alımlama Estetiği ve Boşlukların İnşası",
            "Wolfgang Iser - 'Okuma Eylemi' (Metinsel Boşluklar ve İletişim).",
            "Vüs'at O. Bener - 'Dost' ve 'Havva' öyküleri.",
            "Yazma Egzersizi: Çok büyük bir trajedinin (bir ayrılık veya ölüm) yaşandığı bir günde geçen, ancak o trajedinin adının tek bir kez bile anılmadığı minimalist bir metin yazın.",
            "Poetik Kazanım: Okurun zihnini ortak bir yaratıcı olarak metne davet etmek, suskunluğun gücünü kullanmak."
        ),
        (
            "12. Hafta: Kendi Poetikanızı Yazmak - Sentez ve Atölye",
            "Italo Calvino - 'Amerika Dersleri: Gelecek Binyıl İçin Altı Not'.",
            "Kendi yazdığınız en güçlü öykü veya roman taslağı.",
            "Yazma Egzersizi: Son 12 haftada yazdığınız metinlerden birini seçin; bu metnin hangi kuramlardan beslendiğini ve nerede tıkandığını açıklayan 500 sözcükten oluşan bir 'Yazar Tefsiri' (Exegesis) kaleme alın.",
            "Poetik Kazanım: Refleksif bir yazar kimliği kazanarak kuram ile yaratıcılığı organik olarak birleştirmek."
        ),
    ]

    for hafta, kuram_oku, edebi_oku, egzersiz, kazanim in haftalar:
        pdf.alt_alt_bolum(hafta)
        pdf.madde_listesi([
            f"Kuramsal Okuma: {kuram_oku}",
            f"Edebi Metin Çözümlemesi: {edebi_oku}",
            f"Yazma Egzersizi: {egzersiz}",
            f"Yazar İçin Poetik Kazanım: {kazanim}",
        ])

    # -------------------------------------------------------------------------
    # 8.4 Okuma Haritası
    # -------------------------------------------------------------------------
    pdf.alt_bolum("Okuma Haritası")

    pdf.paragraf(
        "Edebiyat kuramı deryasında kaybolmamak için doğru sırayla okuma yapmak hayati "
        "önem taşır. Doğrudan Derrida veya Lacan okuyarak başlayan bir yazar adayı "
        "büyük olasılıkla yılgınlığa kapılacaktır. Sağlam bir kuramsal formasyon, "
        "kapsamlı giriş kitaplarından başlayarak okullara ve oradan özgün felsefi "
        "metinlere doğru basamak basamak inşa edilmelidir."
    )

    pdf.alt_alt_bolum("1. Düzey: Başlangıç ve Temel Giriş Kaynakları")
    pdf.madde_listesi([
        "Terry Eagleton - Edebiyat Kuramı: Giriş (Ayrıntı Yayınları): Edebiyat kuramının doğuşunu, Yeni Eleştiri'den Yapısöküme kadar olan evrimini zekice ve son derece akıcı bir üslupla anlatan, alanın dünyadaki tartışmasız bir numaralı başvuru klasiğidir.",
        "Peter Barry - Çevirisini Arayan Kuram: Başlangıç İçin Edebiyat Kuramı: Karmaşık kavramları ilk kez öğrenenler için pratik alıştırmalar ve özet tablolarla sunan en berrak pedagojik el kitabıdır.",
        "Jonathan Culler - Edebiyat Teorisi: Çok Kısa Bir Başlangıç (Dost Kitabevi): Teori nedir, dil nedir, edebi yetkinlik nedir gibi temel soruları felsefi berraklıkla tartışır.",
        "Raman Selden & Peter Widdowson - Çağdaş Edebiyat Kuramı: Okulları kronolojik ve tematik sırayla ele alan, temel argümanları şematize eden yetkin bir rehber.",
    ])

    pdf.alt_alt_bolum("2. Düzey: Orta Düzey ve Okul Odaklı Derinleşme")
    pdf.madde_listesi([
        "Gérard Genette - Anlatının Söylemi (Yapı Kredi Yayınları): Roman ve öykü yazarları için bir kutsal kitap niteliğindedir; zaman, odaklayıcı ve anlatıcı tiplerini cerrahi bir hassasiyetle sınıflandırır.",
        "Mihail Bahtin - Karnavaldan Romancaya (Ayrıntı Yayınları): Diyalojizm, çokseslilik (polifoni) ve heteroglossia kavramlarını öğrenmek isteyen her yazarın mutlaka okuması gereken bir başyapıttır.",
        "Roland Barthes - Yazının Sıfır Derecesi ve Bir Aşk Söyleminden Parçalar: Burjuva dilinin yapaylığını ve dilin bedensel, tutkulu hazzını gösteren kuramsal metinler.",
        "Eve Kosofsky Sedgwick - Dokunma Hissi: Duygulanım, Pedagoji, Performatiflik: Şüpheci paranoyaya karşı onarıcı okumayı ve post-eleştirel bakışı kuran çağdaş dönemeç.",
    ])

    pdf.alt_alt_bolum("3. Düzey: İleri Düzey ve Özgün Felsefi Metinler")
    pdf.madde_listesi([
        "Michel Foucault - Kelimeler ve Şeyler & Cinselliğin Tarihi: Episteme, söylem ve iktidar ağlarının dili nasıl biçimlendirdiğini kökten kavratan felsefi anıtlar.",
        "Jacques Derrida - Gramatoloji & Yazı ve Fark: Batı metafiziğinin merkezci mantığını ve sözmerkezciliği (logocentrism) sarsan yapısökümcü kurucu metinler.",
        "Edward Said - Şarkiyatçılık & Kültür ve Emperyalizm: Temsil politikalarını, emperyalizm ile edebiyat arasındaki derin suç ortaklığını ifşa eden kontrapuntal okuma klasiği.",
        "Fredric Jameson - Siyasal Bilinçdışı: Bir Anlatı Eylemi Olarak Edebiyat: Marksist ideoloji eleştirisini psikanaliz ve yapısalcılıkla sentezleyen anıtsal eser.",
    ])

    pdf.alt_alt_bolum("4. Temel Türkçe Kuram ve Eleştiri Külliyatı")
    pdf.paragraf(
        "Batı kuramlarını ezbere ithal etmek yerine Türk edebiyatının somut metinleri "
        "üzerinde başarıyla sınayan yerli kuramcılarımız, her yazar adayının kütüphanesinde "
        "başköşede durmalıdır:"
    )
    pdf.madde_listesi([
        "Berna Moran - Edebiyat Kuramları ve Eleştiri (İletişim Yayınları): Türkçede yazılmış en berrak kuram kitabıdır; yansıtma, anlatımcılık ve biçimcilik ekollerini Türk edebiyatından eşsiz örneklerle anlatır. Üç ciltlik 'Türk Romanına Eleştirel Bir Bakış' ise kuramın yerli metinlere nasıl uygulanacağının şaheseridir.",
        "Jale Parla - Don Kişot'tan Bugüne Roman & Babalar ve Oğullar (İletişim Yayınları): Doğu ve Batı roman poetikasını, Tanzimat'tan modernizme Türk aydınının epistemolojik krizlerini kuramsal derinlikle çözümler.",
        "Nurdan Gürbilek - Kör Ayna, Kayıp Şark & Ev Ödevi (Metis Yayınları): Edebiyat eleştirisini yaratıcı bir sanata dönüştüren, Türk edebiyatının yaralarını, taşra sıkıntısını ve kültürel yarılmalarını benzersiz bir duyarlılıkla tahlil eden yaşayan en büyük eleştirmenimizdir.",
        "Murat Belge - Edebiyat Üstüne Yazılar & Genesis: Marksist ve sosyolojik eleştirinin Türkiye'deki en yetkin ve lezzetli örneklerini sunar.",
        "Mehmet Rifat - Göstergebilimin ABC'si & XX. Yüzyılda Dil ve Edebiyat Kuramları: Fransız yapısalcılığını ve göstergebilimi Türkçeye kazandıran temel metodolojik rehberler.",
    ])

    pdf.etkinlik_kutusu(
        "Bölüm 8 Yaratıcı Uygulama Atölyesi",
        [
            "Fatma Hanım Sahnesine Yeni Bir Kuram Ekleyin: Bölümde ele alınan Fatma Hanım sahnesini Ekoeleştiri (sobanın isi, çay yaprakları, şehir havası) veya Postkolonyal kuram (göçmenlik, taşralılık) açısından 200 sözcükle yeniden okuyun.",
            "Kendi Klişenizi Teşhis Edin: Geçmişte yazdığınız bir öyküdeki kadın veya erkek karakteri seçin. Bu karakterin hangi toplumsal cinsiyet klişelerine yaslandığını Feminist kuram gözlüğüyle acımasızca eleştirin.",
            "Zaman Manipülasyonu: Bir ayrılık anını Gérard Genette'in hız kategorilerini (özet, sahne, duraklama, atlama) kullanarak yeniden kurgulayın.",
            "On İki Haftalık Planı Başlatın: 1. Haftanın egzersizini hemen bugün tamamlayarak yazarlık dosyanıza ekleyin.",
        ]
    )

    pdf.tartisma_sorulari([
        "Yazarken kuramsal olarak aşırı bilinçli olmak bir yazarın ilhamını ve sezgisel doğallığını köreltir mi, yoksa onu vasatlıktan koruyan bir filtre midir?",
        "Fatma Hanım sahnesindeki altı farklı okumadan hangisi sizce metnin özüne en yakındır? Bir metnin 'tek bir gerçek anlamı' olabilir mi?",
        "Nurdan Gürbilek'in 'eleştirmenin de bir yazar gibi metne yaratıcı bir aşkla yaklaşması gerektiği' tezi hakkında ne düşünüyorsunuz?",
        "Türkiye'de edebiyat kuramının genellikle üniversite amfilerine hapsolup sokaktaki yazarla temas kuramamasının nedenleri nelerdir?",
    ])

    pdf.bolum_ozeti([
        "Edebiyat kuramı yazar için bir engel değil; klişeleri kıran, karakterleri derinleştiren ve mimariyi sağlamlaştıran profesyonel bir pusuladır.",
        "Tek bir sahne (Fatma Hanım örneği); Biçimcilik, Yeni Eleştiri, Psikanaliz, Marksizm, Feminizm ve Anlatıbilim ile okunduğunda altı farklı zengin dünyaya açılır.",
        "On İki Haftalık Çalışma Planı; kuramsal okuma, edebi analiz, yaratıcı yazma ve poetik kazanım döngüsüyle yazara sağlam bir kuramsal refleks kazandırır.",
        "Okuma Haritası; Başlangıç (Eagleton, Barry), Orta Düzey (Genette, Bahtin), İleri Düzey (Foucault, Derrida) ve Temel Türkçe Kaynaklar (Moran, Parla, Gürbilek) hiyerarşisiyle izlenmelidir.",
        "Yetkin bir yazar, kendi eserinin ilk ve en acımasız kuramsal eleştirmeni olabilen yazardır.",
    ])
