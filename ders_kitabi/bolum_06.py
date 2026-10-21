# -*- coding: utf-8 -*-
"""
Yazarlar İçin Edebiyat Kuramı Ders Kitabı
Bölüm 6: Güncel Alanlar (2000–2026)
"""


def yaz(pdf):
    """Bölüm 6 içeriğini PDF nesnesine yazar."""

    # ═════════════════════════════════════════════════════════════════════════
    # BÖLÜM GİRİŞİ
    # ═════════════════════════════════════════════════════════════════════════
    pdf.bolum_basligi(6, "Güncel Alanlar (2000–2026)")

    pdf.paragraf(
        "Yirmi birinci yüzyılın ilk çeyreği, edebiyat kuramı ve eleştirisinde köklü bir paradigma "
        "değişimine sahne olmuştur. Yirminci yüzyılın ikinci yarısına damgasını vuran yüksek kuram "
        "(yapısalcılık, postyapısalcılık ve erken dönem postmodernizm), metni büyük ölçüde kendi içine "
        "kapanan dilsel bir oyun, dünyayı ise bütünüyle bir söylem kurgusu olarak görme eğilimindeydi. "
        "Oysa 2000 sonrasında patlak veren küresel krizler; iklim felaketleri, dijitalleşme, yapay zekânın "
        "yükselişi, salgınlar, küresel göç dalgaları ve biyolojik-teknolojik melezleşmeler, edebiyat "
        "çalışmalarını yeniden maddesel dünyaya, bedene, duyguya ve yeryüzüne döndürmüştür."
    )

    pdf.paragraf(
        "Günümüz edebiyat kuramı artık tek bir hâkim yönteme yaslanmaz; aksine disiplinlerarası bir "
        "kesişim noktasında durur. Nörobilimden ekolojiye, bilgisayar bilimlerinden ontolojiye kadar "
        "pek çok alanla diyaloğa giren yeni yaklaşımlar, yazarlar ve eleştirmenler için metin üretme "
        "ve anlama süreçlerini zenginleştiren yepyeni imkânlar sunmaktadır. Bu bölümde, 2000–2026 yılları "
        "arasında edebiyat dünyasını derinden sarsan ve dönüştüren on beş temel güncel alanı ayrıntılarıyla "
        "inceleyecek; her birinin yaratıcı yazarlık pratiğine kazandırdığı somut araçları keşfedeceğiz."
    )

    pdf.bilgi_kutusu(
        "21. Yüzyılda Kuramın Yönü",
        "Güncel kuramsal hareketler; saf metin merkezcilikten 'maddesel ve bedensel gerçekliğe', "
        "alaycı mesafeden 'yeni içtenliğe', insan merkezcilikten 'türlerarası müşterekliğe' ve "
        "yalnızca şüpheci okumadan metinle 'onarıcı bağ kurmaya' doğru evrilmektedir."
    )

    # ═════════════════════════════════════════════════════════════════════════
    # 6.1 BİLİŞSEL POETİKA VE EMPİRİK EDEBİYAT ÇALIŞMALARI
    # ═════════════════════════════════════════════════════════════════════════
    pdf.alt_bolum("Bilişsel Poetika ve Empirik Edebiyat Çalışmaları")

    pdf.alt_alt_bolum("Tarihsel ve Kuramsal Arka Plan")
    pdf.paragraf(
        "Bilişsel poetika, 1990'ların sonundan itibaren bilişsel bilim, nöroloji, psikoloji ve "
        "dilbilimdeki devrim niteliğindeki bulguların edebi metin incelemelerine uyarlanmasıyla doğmuştur. "
        "Mark Turner, Peter Stockwell, Lisa Zunshine ve David Miall gibi araştırmacıların öncülük ettiği bu alan, "
        "edebiyatı insan beyninin ve zihninin evrimsel bir uzantısı olarak ele alır. Formalist yaklaşımların "
        "metni laboratuvar nesnesine dönüştürmesine karşılık bilişsel poetika, edebiyatın ancak bir okur "
        "zihninde işlendiğinde ete kemiğe bürünen dinamik bir deneyim olduğunu savunur."
    )

    pdf.alt_alt_bolum("Temel Soru")
    pdf.italic_paragraf(
        "Bir edebi metin insan zihninde nasıl canlanır, soyut sözcükler okurun beyninde nasıl fiziksel "
        "bir simülasyona dönüşür ve karakterlerin iç dünyasını nasıl kendi zihnimiz gibi kavrarız?"
    )

    pdf.alt_alt_bolum("Anahtar Kavramlar")
    pdf.kavram_tanimi(
        "Zihin Kuramı (Theory of Mind)",
        "İnsanın başkalarının zihinsel durumlarını (inançlar, arzular, niyetler, duygular) anlama ve "
        "yorumlama yetisidir. Lisa Zunshine'a göre roman okumak, okurun bu bilişsel mekanizmasını "
        "sürekli çalıştıran karmaşık bir zihinsel jimnastiktir."
    )
    pdf.kavram_tanimi(
        "Duygudaşlık / Empati (Empathy)",
        "Okurun kurgusal bir karakterin acısını, sevincini ve korkusunu kendi bedeninde hissederek "
        "onunla rezonansa girmesi sürecidir. Ayna nöronlar vasıtasıyla metindeki eylemler okurun "
        "sinir sisteminde fiziki bir karşılık bulur."
    )
    pdf.kavram_tanimi(
        "Bilişsel Simülasyon (Simulation)",
        "Okuma esnasında beynin, gerçek bir fiziksel eylemi yaparken veya algılarken kullandığı aynı motor "
        "ve duyusal korteks bölgelerini harekete geçirmesi; metni adeta zihinsel bir simülatörde yaşamasıdır."
    )
    pdf.kavram_tanimi(
        "Deneyimimsilik (Experientiality)",
        "Monika Fludernik'in ortaya koyduğu kavram; anlatıyı salt olaylar dizisi olmaktan çıkarıp, "
        "insani bir bilincin dünyayı deneyimleme biçiminin metindeki iz düşümü olarak tanımlar."
    )
    pdf.kavram_tanimi(
        "Şema Kuramı (Schema Theory)",
        "Zihnin dünyayı kavramak için oluşturduğu kalıplaşmış bilgi yapılarıdır. Edebiyat, var olan "
        "şemaları tazeler, bozar (schema disruption) veya yeni şemalar inşa eder."
    )

    pdf.alt_alt_bolum("Metinleri Nasıl Okur?")
    pdf.paragraf(
        "Bilişsel eleştiri, metindeki betimlemelerin ve söz diziminin okur zihninde hangi duyusal alanları "
        "uyardığını inceler. Karakterlerin zihinlerinin nasıl temsil edildiğini, anlatıcının zihinsel takibini "
        "(metarepresentation) ve okurun beklenti ufkunun şema kırılmalarıyla nasıl manipüle edildiğini "
        "nörobilişsel kanıtlarla çözümler."
    )

    pdf.alt_alt_bolum("Yaratıcı Yazar İçin Pratik Çıkarımlar")
    pdf.madde_listesi([
        "Soyut kavramlar yerine motor korteksi uyaran somut eylemler ve duyusal ayrıntılar seçin (örn. 'üzüldü' demek yerine 'boğazındaki düğüm nefesini tıkadı').",
        "Karakterler arası zihin okuma katmanlarını derinleştirin: A karakteri, B'nin C hakkında ne düşündüğünü tahmin ederken yanılsın; bu durum okurun Zihin Kuramı mekanizmasını diri tutar.",
        "Okurun zihnindeki şemaları bilinçli olarak bozun; aşina olunan bir meclisi veya duyguyu alışılmadık bir perspektifle sunarak algıyı tazeleyin."
    ])

    pdf.alt_alt_bolum("Sınırlar ve Eleştiriler")
    pdf.paragraf(
        "Bilişsel poetikaya yöneltilen en sert eleştiri, 'biyolojik indirgemecilik' tehlikesidir. Edebi "
        "deneyimin kültürel, sınıfsal, tarihsel ve politik boyutlarının beyin dalgalarına veya nöron "
        "ateşlemelerine indirgenemeyeceği; aynı metnin farklı kültürlerde tamamen farklı deneyimler "
        "doğurabileceği unutulmamalıdır."
    )

    pdf.ornek_kutusu(
        "Sait Faik Abasıyanık - Haritada Bir Nokta",
        "Balıkçıların ağları denizden çekerken çıkardıkları soluk, kasların gerilişi ve pul pul parlayan "
        "balıkların çırpınışı anlatıcının gözünden aktarılır: 'Yazmasam deli olacaktım.'",
        "Sait Faik, okurun motor ve görsel korteksini somut duyusal verilerle harekete geçirir. 'Yazmasam "
        "deli olacaktım' cümlesi, Fludernik'in 'deneyimimsilik' kavramına kusursuz bir örnektir; anlatılan şey "
        "salt balık avı değil, yaratıcı bilincin dünyayla temasındaki varoluşsal sarsıntıdır."
    )

    pdf.etkinlik_kutusu(
        "Bilişsel Simülasyon Egzersizi",
        [
            "Bir karakterin aşırı soğuk bir havada donmuş kapı kolunu tuttuğu anı, hiçbir soyut sıfat kullanmadan sadece deri, kas ve kemik tepkileriyle yazın.",
            "Üç kişilik bir sahnede, birinci karakterin ikinci karakterin niyetini yanlış anladığı, üçüncünün ise bu yanlış anlamayı fark edip sessiz kaldığı bir diyalog kurun."
        ]
    )

    pdf.tartisma_sorulari([
        "Ayna nöronlar ve zihin kuramı, edebiyatın empati üretme gücünün biyolojik kanıtı sayılabilir mi?",
        "Bilişsel yaklaşımlar edebiyatın ideolojik ve politik direncini görmezden gelmeye mahkûm mudur?"
    ])

    # ═════════════════════════════════════════════════════════════════════════
    # 6.2 DUYGULANIM VE DUYGU KURAMI
    # ═════════════════════════════════════════════════════════════════════════
    pdf.alt_bolum("Duygulanım ve Duygu Kuramı")

    pdf.alt_alt_bolum("Tarihsel ve Kuramsal Arka Plan")
    pdf.paragraf(
        "2000'li yıllarda beşeri bilimlerde 'Duygulanımsal Dönüş' (Affective Turn) olarak adlandırılan "
        "hareket; Brian Massumi, Eve Kosofsky Sedgwick, Lauren Berlant ve Sara Ahmed gibi düşünürlerin "
        "katkılarıyla şekillenmiştir. Postyapısalcılığın 'her şey dilden ibarettir' kabulüne meydan "
        "okuyan bu kuram, dil öncesi, bilinçdışı ve bedensel rezonansların toplumsal ve edebi gücünü inceler. "
        "Spinoza ve Deleuze'ün duygulanım (affectus) felsefesine dayanan kuram, duyguların sadece kişisel iç "
        "durumlar değil, bedenler arasında dolaşan politik güçler olduğunu ileri sürer."
    )

    pdf.alt_alt_bolum("Temel Soru")
    pdf.italic_paragraf(
        "Dilden önce gelen bedensel sarsıntılar, havadaki atmosfer ve bedenler arasında dolaşan duygusal "
        "yükler edebi metinde nasıl maddi bir güç olarak varlık gösterir?"
    )

    pdf.alt_alt_bolum("Anahtar Kavramlar")
    pdf.kavram_tanimi(
        "Duygulanım (Affect)",
        "Kişinin henüz dille adlandırmadığı, bilinç düzeyine ulaşmamış, bedensel yoğunluk ve titreşim "
        "hâlidir. Duygu (emotion) ise bu akışın toplumsal olarak kodlanıp dille adlandırılmış biçimidir."
    )
    pdf.kavram_tanimi(
        "Duyguların Dolaşımı ve Yapışkanlığı (Circulation & Stickiness)",
        "Sara Ahmed'in kavramlaştırması: Duygular bireylerin içinde hapsolmuş şeyler değildir; bedenler, "
        "nesneler ve işaretler arasında dolaşır. Tekrarlandıkça belirli kimliklere ve bedenlere 'yapışarak' "
        "toplumsal kutuplaşmalar ve ortaklıklar üretir."
    )
    pdf.kavram_tanimi(
        "Zalim İyimserlik (Cruel Optimism)",
        "Lauren Berlant'ın ifadesiyle; kişinin arzuladığı, bağlandığı ve peşinden koştuğu bir idealin "
        "(başarı, evlilik, refah) aslında onun gelişimini ve mutluluğunu imkânsız kılması durumudur."
    )

    pdf.alt_alt_bolum("Metinleri Nasıl Okur?")
    pdf.paragraf(
        "Duygulanım kuramı, metnin mantıksal argümanlarından ziyade yarattığı bedensel iklimi inceler: "
        "cümlelerin nefes darlığı, metindeki duraklamalar, karakterlerin mekândaki klostrofobik sıkışmışlığı "
        "ve nesnelerin üzerine sinen utanç, arzu veya keder tortuları çözümlenir."
    )

    pdf.alt_alt_bolum("Yaratıcı Yazar İçin Pratik Çıkarımlar")
    pdf.madde_listesi([
        "Duyguyu doğrudan adlandırmayın; 'korktu' veya 'öfkelendi' demek yerine ortamın ritmini, sıcaklığını ve bedensel tekinsizliği inşa edin.",
        "Nesnelere duygusal yapışkanlık kazandırın: Evdeki eski bir halı veya kırık bir bardak karakterin geçmiş travmalarının duygulanımsal taşıyıcısı olsun.",
        "Karakterlerinizin arzularını 'zalim iyimserlik' çelişkisiyle kurun; onları yıkan şey bizzat kurtuluş sandıkları hayalleri olsun."
    ])

    pdf.alt_alt_bolum("Sınırlar ve Eleştiriler")
    pdf.paragraf(
        "Duygulanımın bütünüyle dil-dışı ve söylem-öncesi olarak konumlandırılması, edebiyat gibi harflerden "
        "ve sembolik dilden oluşan bir sanat dalı için paradoksaldır. Duygunun politik analizi yapılırken "
        "dilsel yapının gözden kaçırılması eleştirilmiştir."
    )

    pdf.ornek_kutusu(
        "Tezer Özlü - Çocukluğun Soğuk Geceleri",
        "'Evlerin içindeki sessizlik soğuktu. Odaların tavanları yüksek, döşemeler buz gibiydi. "
        "Annemin elleri deterjan kokardı, babamın paltosu ıslak tütün.'",
        "Tezer Özlü psikolojik bir tahlil yapmaz; soğukluk, yüksek tavanlar ve tütün kokusuyla bedeni "
        "kuşatan boğucu bir duygulanım alanı (affective atmosphere) kurar. Duygular dille açıklanmaz, "
        "mekânın teninde titreşir."
    )

    pdf.etkinlik_kutusu(
        "Duygulanımsal Atmosfer Yazımı",
        [
            "Bir ailenin akşam yemeği sahnesini yazın; hiç kimse tartışmasın ama masadaki çatal bıçak sesleri ve ekmek kırıntıları üzerinden bastırılmış bir öfke akımı hissedilsin.",
            "Bir karakterin peşinden koştuğu kariyer hedefinin onu nasıl günden güne tükettiğini (Zalim İyimserlik) anlatan kısa bir kesit oluşturun."
        ]
    )

    pdf.tartisma_sorulari([
        "Bir roman okurken hissettiğimiz ürperti veya ağlama hissi metnin dilsel anlamından mı yoksa duygulanımsal ritminden mi kaynaklanır?",
        "Sara Ahmed'in 'yapışkan duygular' kavramı günümüz toplumsal kutuplaşmalarını edebiyatta yansıtmak için nasıl kullanılabilir?"
    ])

    # ═════════════════════════════════════════════════════════════════════════
    # 6.3 EKOELEŞTİRİ, ANTROPOSEN VE İKLİM ANLATILARI
    # ═════════════════════════════════════════════════════════════════════════
    pdf.alt_bolum("Ekoeleştiri, Antroposen ve İklim Anlatıları")

    pdf.alt_alt_bolum("Tarihsel ve Kuramsal Arka Plan")
    pdf.paragraf(
        "Ekoeleştiri (Ecocriticism), 1990'larda Cheryl Glotfelty ve Lawrence Buell'in öncülüğünde edebiyat "
        "ve fiziksel çevre arasındaki ilişkiyi inceleyerek başlamıştır. 2000'li yıllarda jeologların "
        "dünyanın yeni bir jeolojik çağa, insanın yeryüzünü geri dönülmez şekilde değiştirdiği 'Antroposen' "
        "(İnsan Çağı) çağına girdiğini ilan etmesiyle kuram radikal bir dönüşüm geçirmiştir. Timothy Morton, "
        "Rob Nixon ve Amitav Ghosh gibi kuramcılar, iklim krizinin salt bir çevre meselesi değil, doğrudan "
        "bir hayal gücü ve temsil krizi olduğunu vurgulamışlardır."
    )

    pdf.alt_alt_bolum("Temel Soru")
    pdf.italic_paragraf(
        "İnsan-merkezci yanılsamayı aşıp yeryüzünün, nehirlerin, havanın ve iklim felaketlerinin hikâyesini "
        "edebiyatta nasıl kurabiliriz; temsil edilemez büyüklükteki ekolojik yıkım nasıl anlatılır?"
    )

    pdf.alt_alt_bolum("Anahtar Kavramlar")
    pdf.kavram_tanimi(
        "Doğa Yazını (Nature Writing)",
        "Gözleme dayalı, yaban hayatı ve insan dışı çevreyi derinlikli ve estetik bir dille kaydeden "
        "klasik edebi gelenektir."
    )
    pdf.kavram_tanimi(
        "Doğasız Ekoloji (Ecology Without Nature)",
        "Timothy Morton'ın kışkırtıcı tezi: İnsanın karşısına koyduğu romantik ve dokunulmaz 'Doğa' "
        "kavramı ortadan kaldırılmalıdır; çünkü insan zaten ekolojinin tam içinde, her türlü pisliği ve "
        "dolaşıklığıyla bir parçasıdır."
    )
    pdf.kavram_tanimi(
        "Hiper-nesneler (Hyperobjects)",
        "Zaman ve mekân ölçeğinde o kadar devasa boyuttadır ki insanın doğrudan duyularıyla tek bir "
        "bakışta kavrayamayacağı varlıklardır (örn. Küresel ısınma, plütonyum, okyanuslardaki plastik adaları)."
    )
    pdf.kavram_tanimi(
        "Yavaş Şiddet (Slow Violence)",
        "Rob Nixon'ın kavramı: Anlık, sansasyonel patlamalar yerine zamana yayılan, görünmez, sessiz "
        "ve uzun vadeli ekolojik yıkımlardır (toprak erozyonu, kimyasal zehirlenme, radyoaktif sızıntı)."
    )
    pdf.kavram_tanimi(
        "İklim Kurgusu (Cli-Fi / Climate Fiction)",
        "İklim değişikliği ve ekolojik çöküşü doğrudan anlatının merkezine alan, distopik veya spekülatif "
        "yeni edebi türdür."
    )

    pdf.alt_alt_bolum("Metinleri Nasıl Okur?")
    pdf.paragraf(
        "Ekoeleştirel okuma, metindeki doğanın sadece pasif bir fon veya insan dramının aynası olup olmadığını "
        "sorgular. Çevrenin karakterler üzerindeki maddi etkilerini, sömürgecilik ile çevre katliamı arasındaki "
        "bağları ve insan-dışı faillerin metindeki eylemlilik payını açığa çıkarır."
    )

    pdf.alt_alt_bolum("Yaratıcı Yazar İçin Pratik Çıkarımlar")
    pdf.madde_listesi([
        "Çevreyi pasif bir dekor olarak kurmaktan vazgeçin; hava durumu, toprak kalitesi veya kuraklık anlatının seyrini değiştiren bir karaktere dönüşsün.",
        "Yavaş şiddeti görünür kılın: Felaketi ani bir göktaşı çarpması yerine bir kasabanın suyuna karışan sinsi zehrin on yıllara yayılan sessiz tahribatıyla işleyin.",
        "İnsan dışı ölçekleri (jeolojik zaman, hayvan bakışı, mikrobik yaşam) insan ölçeğiyle yan yana getiren çok katmanlı kurgular deneyin."
    ])

    pdf.alt_alt_bolum("Sınırlar ve Eleştiriler")
    pdf.paragraf(
        "Ekoeleştirinin didaktik bir çevre vaazına veya apokaliptik karamsarlık pornografisine dönüşme riski "
        "bulunmaktadır. Sanatsal derinlikten yoksun salt propaganda metinleri estetik değerini hızla yitirir."
    )

    pdf.ornek_kutusu(
        "Yaşar Kemal - Hüyükteki Nar Ağacı",
        "Çukurova'ya inen traktörlerin toprağı altüst edişi, kuşların yuvalarını terk edişi ve mevsimlik "
        "işçilerin bozulan doğayla birlikte açlığa sürüklenişi anlatılır.",
        "Yaşar Kemal, traktörü sadece tarımsal bir makine olarak değil, ekosistemi ve kadim yaşam biçimini "
        "yıkan şiddetli bir fail olarak kurgular. İnsan sömürüsü ile doğa sömürüsünün ayrılmazlığı Rob Nixon'ın "
        "'yavaş şiddet' teziyle birebir örtüşür."
    )

    pdf.etkinlik_kutusu(
        "Ekolojik Odak Değişimi",
        [
            "Geleneksel bir aşk ayrılığı sahnesi yazın; ancak ayrılığın asıl sebebi tarafların duyguları değil, yaşadıkları nehrin kuruması ve kentin susuz kalması olsun.",
            "Bir plastik şişenin denize atıldıktan sonraki 300 yıllık yolculuğunu ve karşılaştığı deniz canlılarını anlatan kısa bir spekülatif anlatı kaleme alın."
        ]
    )

    pdf.tartisma_sorulari([
        "Amitav Ghosh'un 'Büyük Yanılgı' kitabında belirttiği gibi modern roman, doğası gereği iklim krizini anlatmakta yetersiz midir?",
        "Doğaya bilinç atfetmek onu gerçekten anlamak mıdır yoksa insan-merkezciliğin başka bir kılık değiştirmesi midir?"
    ])

    # ═════════════════════════════════════════════════════════════════════════
    # 6.4 POSTHÜMANİZM, YENİ MATERYALİZM VE HAYVAN ÇALIŞMALARI
    # ═════════════════════════════════════════════════════════════════════════
    pdf.alt_bolum("Posthümanizm, Yeni Materyalizm ve Hayvan Çalışmaları")

    pdf.alt_alt_bolum("Tarihsel ve Kuramsal Arka Plan")
    pdf.paragraf(
        "Rönesans hümanizminin yarattığı 'akıl sahibi, beyaz, erkek ve doğanın efendisi olan insan' "
        "modeli 21. yüzyılda çökmüştür. Donna Haraway, Rosi Braidotti, Jane Bennett ve Bruno Latour gibi "
        "düşünürler, insanın makineyle, hayvanla ve cansız maddeyle iç içe geçmiş melez bir varlık "
        "olduğunu savunur. Yeni materyalizm ise maddenin atıl, pasif ve ölü olduğu fikrini yıkarak "
        "nesnelerin de bir eyleme gücü (agency) olduğunu ilan eder."
    )

    pdf.alt_alt_bolum("Temel Soru")
    pdf.italic_paragraf(
        "İnsan ayrıcalığı yıkıldığında madde, makineler ve diğer hayvan türleri edebiyatta nasıl özneleşir; "
        "hiyerarşik olmayan bir türlerarası kurgu nasıl inşa edilir?"
    )

    pdf.alt_alt_bolum("Anahtar Kavramlar")
    pdf.kavram_tanimi(
        "Siborg (Cyborg)",
        "Donna Haraway'in kavramı: Biyolojik olanla teknolojik olanın, doğayla yapaylığın sınırlarını "
        "yıkan melez varlıktır. İkili karşıtlıkları (kadın/erkek, insan/makine) altüst eder."
    )
    pdf.kavram_tanimi(
        "Belayla Kalmak (Staying with the Trouble)",
        "Haraway'in çaresizlik veya boş ümit yerine, yaralı ve karmaşık yeryüzü koşullarında diğer türlerle "
        "birlikte yaşama ve hayatta kalma yollarını ısrarla arama çağrısıdır."
    )
    pdf.kavram_tanimi(
        "Posthüman Özne (Posthuman Subject)",
        "Rosi Braidotti'nin tanımıyla; evrenin merkezinde durmayan, sınırları geçirgen, diğer canlılarla "
        "ve teknolojiyle sürekli ortaklaşa dönüşen (becoming-with) ilişkisel öznedir."
    )
    pdf.kavram_tanimi(
        "Aktör-Ağ Kuramı (Actor-Network Theory)",
        "Bruno Latour'un geliştirdiği kuram: Toplumsal süreçler sadece insanların değil, nesnelerin, "
        "belgelerin ve mikropların da eşit aktörler (actant) olarak yer aldığı ağlar bütünüdür."
    )
    pdf.kavram_tanimi(
        "Canlı Madde (Vibrant Matter)",
        "Jane Bennett'in kavramı: Cansız sanılan metal, çöp, elektrik veya kimyasalların insan iradesinden "
        "bağımsız bir canlılığa, itici güce ve eyleyiciliğe sahip olması durumudur."
    )

    pdf.alt_alt_bolum("Metinleri Nasıl Okur?")
    pdf.paragraf(
        "Posthümanist okuma, metinlerdeki hayvanların ve nesnelerin sadece insanın ahlaki metaforu "
        "(fabl geleneği) olarak mı kullanıldığını yoksa kendi başına bir faillik taşıyıp taşımadığını "
        "inceler. Teknolojinin bedene entegrasyonunu ve insanı aşan melez ağları ifşa eder."
    )

    pdf.alt_alt_bolum("Yaratıcı Yazar İçin Pratik Çıkarımlar")
    pdf.madde_listesi([
        "Hayvanları insan gibi konuşturup hissettirmekten (antropomorfizm) kaçının; onların koku, işitme ve yönelim dünyalarını kendi biyolojilerine sadık kalarak kurgulayın.",
        "Cansız nesneleri aktif birer fail yapın: Masadaki paslı bir çivi veya bayatlamış ekmek sahnedeki insan iradesini bozacak bir eyleme gücü göstersin.",
        "Teknolojiyi bir araç değil, karakterin bedeninin ve zihninin organik bir uzantısı olarak tasarlayın."
    ])

    pdf.alt_alt_bolum("Sınırlar ve Eleştiriler")
    pdf.paragraf(
        "Maddenin ve hayvanların eyleyiciliğini savunurken, insanın ahlaki, yasal ve politik sorumluluğunun "
        "buharlaşması riski doğar. Suç ve adalet kavramları insan-dışı ağlar içinde kaybolabilir."
    )

    pdf.ornek_kutusu(
        "Latife Tekin - Berci Kristin Çöp Masalları",
        "Gecekondu mahallesinde çöp tepeleri rüzgârla hareket eder, kokular nefes alır, tenekeler "
        "insanların kaderini belirler: 'Çöp tepeleşti, soludu, kendi dilini kurdu.'",
        "Latife Tekin, Jane Bennett'in 'Canlı Madde' kuramından yıllar önce çöpü eyleyici bir özne kılmıştır. "
        "Çöp pasif bir atık değil, gecekondu halkıyla birlikte direnen, konuşan ve dönüşen bir aktördür."
    )

    pdf.etkinlik_kutusu(
        "İnsan-Dışı Bakış Açısı",
        [
            "Bir terk edilmiş fabrikada yaşayan sahipsiz bir köpeğin sabah saatlerini, tamamen koku katmanları ve ses titreşimleri üzerinden birinci tekil şahısla yazın.",
            "Bir odadaki akıllı telefonun, sahibinin uyku esnasındaki nefesini ve veri trafiğini bir nesne gözüyle izlediği bir metin kurun."
        ]
    )

    pdf.tartisma_sorulari([
        "Edebiyat bütünüyle insan diliyle yazıldığına göre, gerçek anlamda 'insan-merkezci olmayan' bir roman yazmak mantıksal olarak mümkün müdür?",
        "Siborglaşan insan bedeni yaratıcı yazarlıkta geleneksel ruh-beden çatışmasını nasıl dönüştürür?"
    ])

    # ═════════════════════════════════════════════════════════════════════════
    # 6.5 TRAVMA, BELLEK VE TANIKLIK
    # ═════════════════════════════════════════════════════════════════════════
    pdf.alt_bolum("Travma, Bellek ve Tanıklık")

    pdf.alt_alt_bolum("Tarihsel ve Kuramsal Arka Plan")
    pdf.paragraf(
        "Yirminci yüzyılın soykırımları, savaşları ve askeri darbeleri sonrasında doğan travma kuramı; "
        "Cathy Caruth, Shoshana Felman, Dori Laub ve Marianne Hirsch'ün çalışmalarıyla edebi analizin "
        "temel direklerinden biri haline gelmiştir. Freud'un 'ertelenmiş anlam' (Nachträglichkeit) kavramına "
        "dayanan Caruth, travmanın yaşandığı anda tam olarak deneyimlenemediğini, ancak sonradan gelen "
        "tekrarlarla, kâbuslarla ve bedensel semptomlarla bilinci istila ettiğini belirtir. 2000'li yıllarda "
        "Michael Rothberg bu alanı 'çok-yönlü bellek' kavramıyla küreselleştirmiştir."
    )

    pdf.alt_alt_bolum("Temel Soru")
    pdf.italic_paragraf(
        "Dille ifade edilmesi imkânsız olan bir dehşet edebiyatta nasıl temsil edilir; geçmişin yarası "
        "kuşaktan kuşağa nasıl aktarılır ve tanıklık etiği nasıl kurulur?"
    )

    pdf.alt_alt_bolum("Anahtar Kavramlar")
    pdf.kavram_tanimi(
        "Travma ve Ertelenmiş Anlam (Nachträglichkeit)",
        "Olay anında zihnin algılama kapasitesini aşan şokun, zamana yayılarak ve sonradan tetiklenerek "
        "bilince geri dönmesi; temsil edilemeyen bir boşluk olarak kalmasıdır."
    )
    pdf.kavram_tanimi(
        "Tanıklık (Testimony)",
        "Yaşanan felaketin dilsizleştirdiği kurbanın yerine konuşma veya bu acıya dinleyici olarak şahitlik "
        "etme etiğidir. Felman ve Laub'a göre edebiyat, tarihin susturduklarına tanıklık etme alanıdır."
    )
    pdf.kavram_tanimi(
        "Post-bellek / Sonradan Bellek (Postmemory)",
        "Marianne Hirsch'ün kavramı: Travmayı bizzat yaşamayan ikinci ve üçüncü kuşakların, ebeveynlerinin "
        "anlattığı (veya suskunlukla gizlediği) hikâyeler, fotoğraflar ve davranışlar yoluyla bu travmayı "
        "kendi anılarıymışçasına derinlemesine hissetmesidir."
    )
    pdf.kavram_tanimi(
        "Çok-yönlü Bellek (Multidirectional Memory)",
        "Michael Rothberg'in tezi: Farklı toplulukların tarihsel acıları birbirini dışlayan bir rekabet "
        "içinde değildir; aksine kolektif bellekler birbirini besler, tercüme eder ve ortak bir adalet "
        "zemini kurar."
    )

    pdf.alt_alt_bolum("Metinleri Nasıl Okur?")
    pdf.paragraf(
        "Travma odaklı okuma, metnin düz çizgisel akışındaki kırılmalara bakar: kronolojinin dağılması, "
        "anlatıcının aniden susması, tekrarlanan motifler (flashback), güvenilmez anlatıcılar ve dildeki "
        "kekelemeler bastırılmış travmatik çekirdeğin metindeki semptomları olarak çözümlenir."
    )

    pdf.alt_alt_bolum("Yaratıcı Yazar İçin Pratik Çıkarımlar")
    pdf.madde_listesi([
        "Büyük acıları melodramatik şekilde bağıra çağıra anlatmayın; travmanın asıl gücü suskunluklarda, söylenemeyen kelimelerde ve anlatıdaki boşluklardadır.",
        "Kronolojiyi parçalayın: Karakterin bugününde yürürken karşılaştığı sıradan bir ses veya koku onu aniden geçmişin kriz anına fırlatsın.",
        "Kuşaklararası aktarımı nesneler üzerinden kurun: Anneanneden kalan eski bir düğme torununun bilinçdışında açıklanamayan bir keder üretsin."
    ])

    pdf.alt_alt_bolum("Sınırlar ve Eleştiriler")
    pdf.paragraf(
        "Travmanın bir anlatı klişesine ve tüketim nesnesine dönüştürülmesi ('travma pornografisi') "
        "en büyük tehlikedir. Her kurgusal karakterin mutlaka çocukluk travmasına bağlanması edebi derinliği "
        "ucuz bir psikolojizme hapseder."
    )

    pdf.ornek_kutusu(
        "Adalet Ağaoğlu - Ölmeye Yatmak",
        "Aysel bir otel odasında soyunup yatağa uzanır; intihar kararı ile Cumhuriyet modernleşmesinin "
        "kendi bedeninde ve zihninde yarattığı kırılmalar kesik kesik hatırlanır.",
        "Ağaoğlu, zamanı dondurur. Olay akışı durur ve Aysel'in bilincinde tarihsel travmalar parçalı "
        "hatırlamalarla fışkırır. Travma doğrusal bir anlatıyla değil, ertelenmiş iç hesaplaşmalarla verilir."
    )

    pdf.etkinlik_kutusu(
        "Suskunluğun Metni",
        [
            "Büyük bir felaketten sağ kurtulmuş bir karakterin, kahvaltı hazırlarken yaşadığı bir ânı yazın; felaketin adını asla anmayın, sadece elinin titremesi ve ekmeği kesişindeki ritim üzerinden travmayı hissettirin.",
            "Eski bir aile fotoğrafına bakan bir gencin, hiç tanımadığı dedesinin sürgün hikâyesini kendi bedeninde duyumsadığı bir 'post-bellek' monoloğu kurun."
        ]
    )

    pdf.tartisma_sorulari([
        "Edebiyat, bizzat yaşanmamış bir acının temsilini üstlendiğinde estetik bir sömürü yapmış olur mu?",
        "Kolektif travmaların edebiyat yoluyla iyileştirilmesi (yas çalışması) gerçekten mümkün müdür?"
    ])

    # ═════════════════════════════════════════════════════════════════════════
    # 6.6 POSTKRİTİK VE YENİ OKUMA BİÇİMLERİ
    # ═════════════════════════════════════════════════════════════════════════
    pdf.alt_bolum("Postkritik ve Yeni Okuma Biçimleri")

    pdf.alt_alt_bolum("Tarihsel ve Kuramsal Arka Plan")
    pdf.paragraf(
        "2010'lu yıllarda Rita Felski, Eve Kosofsky Sedgwick, Sharon Marcus ve Stephen Best gibi kuramcılar, "
        "edebiyat eleştirisinde neredeyse bir yüzyıldır tartışmasız kabul gören 'şüphe hermeneutiği'ni "
        "(hermeneutics of suspicion) sorgulamaya açmıştır. Paul Ricoeur'ün Marx, Nietzsche ve Freud'a "
        "dayandırdığı bu gelenek, metni her zaman arkasında gizli bir ideoloji, sınıf çıkarı veya bastırılmış "
        "saplantı saklayan bir 'suçlu' gibi sorguluyordu. Postkritik (eleştiri-sonrası), bu paranoyak dedektif "
        "tavrının edebiyatı kuruttuğunu savunarak yeni okuma modelleri önermiştir."
    )

    pdf.alt_alt_bolum("Temel Soru")
    pdf.italic_paragraf(
        "Metinleri sürekli gizli bir suç arayan şüpheci savcılar gibi sorgulamaktan vazgeçip onlarla nasıl "
        "duygusal, estetik ve onarıcı ortaklıklar kurabiliriz?"
    )

    pdf.alt_alt_bolum("Anahtar Kavramlar")
    pdf.kavram_tanimi(
        "Yüzey Okuması (Surface Reading)",
        "Sharon Marcus ve Stephen Best'in önerisi: Metnin derinliklerinde gizli tuzaklar aramak yerine, "
        "metnin yüzeyinde apaçık duran biçimsel, dilsel ve duygusal dokuya saygıyla yaklaşma yöntemidir."
    )
    pdf.kavram_tanimi(
        "Paranoyak ve Onarıcı Okuma (Paranoid vs Reparative Reading)",
        "Eve Sedgwick'in ayrımı: Paranoyak okuma her zaman en kötüyü bekler ve metindeki ideolojik hataları "
        "avlar. Onarıcı okuma ise metnin sunduğu teselliyi, güzelliği, neşeyi ve şifayı keşfetmeye odaklanır."
    )
    pdf.kavram_tanimi(
        "Eleştirinin Sınırları (The Limits of Critique)",
        "Rita Felski'nin manifestosu: Eleştirinin tek biçiminin 'mesafeli ve alaycı bir teşhir' olamayacağını, "
        "okurların metinlerle kurduğu büyülenme, bağlanma ve şok deneyimlerinin kuramsal değerini savunur."
    )

    pdf.alt_alt_bolum("Metinleri Nasıl Okur?")
    pdf.paragraf(
        "Postkritik yaklaşım, metni alt edilmesi gereken bir düşman veya ifşa edilecek bir ideolojik kurnazlık "
        "olarak görmez. Okurun metinle kurduğu duygusal rezonansı, estetik zevki ve metnin okurda yarattığı "
        "dönüşümü çözümlemenin merkezine yerleştirir."
    )

    pdf.alt_alt_bolum("Yaratıcı Yazar İçin Pratik Çıkarımlar")
    pdf.madde_listesi([
        "Okurunuzu sürekli ters köşe yapmaya veya ona ahlaki dersler vermeye odaklanmayın; metnin yüzeyindeki dilsel zevki ve müzikaliteyi zenginleştirin.",
        "Onarıcı bir poetika kurun: Dünyanın yıkıcılığına karşı karakterlerinize ve okurlarınıza sığınacakları duygusal limanlar ve samimi anlar bağışlayın.",
        "Metninizin altına gizli şifreler gömmektense, açıkta duran ayrıntıların parıltısına güvenin."
    ])

    pdf.alt_alt_bolum("Sınırlar ve Eleştiriler")
    pdf.paragraf(
        "Postkritiğe yöneltilen en ciddi itiraz, eleştirel dikkatin zayıflaması ve metinlerdeki ırkçı, "
        "cinsiyetçi veya sömürgeci ideolojilerin 'estetik zevk' perdesi arkasında aklanması riskidir. "
        "Eleştiriyi bırakmak iktidara teslim olmak anlamına gelebilir."
    )

    pdf.ornek_kutusu(
        "Ahmet Hamdi Tanpınar - Huzur",
        "Mümtaz ve Nuran'ın Boğaz'da yaptıkları sandal gezintisi, akşam güneşinin sular üzerindeki "
        "yansımaları ve radyodan yükselen Itrî'nin Neva Kâr'ı.",
        "Paranoyak bir okuma bu sahnede Doğu-Batı çatışmasının burjuva kaçışını ve sınıfsal körlüğü "
        "ifşa etmeye çalışır. Oysa postkritik ve onarıcı bir okuma, sahnenin sunduğu benzersiz müzikal "
        "ve estetik teselliyi, ölüm korkusuna karşı sanatın kurduğu büyülenmeyi önceler."
    )

    pdf.etkinlik_kutusu(
        "Onarıcı Okuma ve Yazma Deneyi",
        [
            "Çok sevdiğiniz ama ideolojik açıdan 'kusurlu' bulunan bir klasiği, onun eksiklerini teşhir etmek için değil, size yaşattığı estetik büyülenmeyi açıklamak için inceleyin.",
            "Bir karakterin kaybettiği umudu sıradan bir nesneyle (örneğin sıcak bir fincan çay) yeniden bulduğu onarıcı bir sahne kaleme alın."
        ]
    )

    pdf.tartisma_sorulari([
        "Eleştirmenin görevi sadece metindeki ideolojik yanılsamaları ifşa etmek midir yoksa edebiyatın iyileştirici gücünü açığa çıkarmak mı?",
        "Postkritik dalga, neoliberal çağın siyasi mücadeleden kaçan bir konfor alanı arayışı mıdır?"
    ])

    # ═════════════════════════════════════════════════════════════════════════
    # 6.7 DÜNYA EDEBİYATI, DOLAŞIM VE ÇEVİRİ
    # ═════════════════════════════════════════════════════════════════════════
    pdf.alt_bolum("Dünya Edebiyatı, Dolaşım ve Çeviri")

    pdf.alt_alt_bolum("Tarihsel ve Kuramsal Arka Plan")
    pdf.paragraf(
        "Goethe'nin 1827'de ortaya attığı 'Weltliteratur' (Dünya Edebiyatı) kavramı, 2000'li yıllarda David Damrosch, "
        "Pascale Casanova, Emily Apter ve Lawrence Venuti'nin çalışmalarıyla bambaşka bir kuramsal derinlik "
        "kazanmıştır. Damrosch dünya edebiyatını sabit bir kanon değil, metinlerin kendi ulusal sınırlarını "
        "aşarak çeviri yoluyla kazandığı bir 'dolaşım tarzı' olarak yeniden tanımlamıştır. Casanova ise "
        "dünya edebiyat alanının Paris, Londra ve New York gibi merkezlerin tahakkümü altında işleyen "
        "eşitsiz bir mücadele alanı olduğunu göstermiştir."
    )

    pdf.alt_alt_bolum("Temel Soru")
    pdf.italic_paragraf(
        "Bir metin kendi doğduğu dili ve yerelliği aşıp küresel ölçekte dolaşıma girdiğinde ne kazanır, "
        "ne kaybeder; çeviri bir zenginleşme midir yoksa tektipleşme mi?"
    )

    pdf.alt_alt_bolum("Anahtar Kavramlar")
    pdf.kavram_tanimi(
        "Dünya Edebiyatı (Weltliteratur)",
        "David Damrosch'un tanımıyla: Kendi ulusal dil ve kültür sınırlarının ötesine geçerek başka "
        "dillerde ve kültürlerde etkin biçimde okunan, çevrildikçe anlamı zenginleşen metinlerdir."
    )
    pdf.kavram_tanimi(
        "Dünya Edebiyat Cumhuriyeti (The World Republic of Letters)",
        "Pascale Casanova'nın kuramı: Dünya edebiyatı tarafsız bir kütüphane değildir; edebi meşruiyetin "
        "ve prestijin Batılı metropoller tarafından dağıtıldığı eşitsiz ve rekabetçi bir güç alanıdır."
    )
    pdf.kavram_tanimi(
        "Çevrilemezlik (Untranslatability)",
        "Emily Apter'ın kavramı: Kültürlerin özgül felsefi ve tarihsel nüanslarının küresel İngilizcede "
        "kolayca eritilmesine karşı direnen, diller arasındaki aşılamaz semantik uçurumlardır."
    )
    pdf.kavram_tanimi(
        "Yerlileştirme ve Yabancılaştırma (Domestication vs Foreignization)",
        "Lawrence Venuti'nin çeviri etiği: Yerlileştirme hedef kültürün konforu için metnin pürüzlerini yok "
        "eder; yabancılaştırma ise kaynak metnin kültürel tuhaflığını ve farkını hedef dile dayatarak okuru sarsar."
    )

    pdf.alt_alt_bolum("Metinleri Nasıl Okur?")
    pdf.paragraf(
        "Küresel dolaşım odaklı okuma, metnin çeviride neleri kaybettiğini veya kazandığını, Batılı okur "
        "beklentilerine göre 'otantiklik' üretip üretmediğini ve küresel yayın piyasasındaki sermaye "
        "akışlarını inceler."
    )

    pdf.alt_alt_bolum("Yaratıcı Yazar İçin Pratik Çıkarımlar")
    pdf.madde_listesi([
        "Sırf 'küresel pazarda satılsın' diye metninizi Batılı klişelerin talep ettiği egzotikDoğu/taşra kalıplarına hapsetmeyin.",
        "Kendi dilinizin çevrilemez özgül deyimlerini, ritmini ve yerel rengini koruyun; evrensele giden yol soyut bir küresellikten değil, radikal bir yerellikten geçer.",
        "Çeviriyi yazma sürecinin bir parçası olarak görün: Metninizin başka bir dilde nasıl yankılanacağını hayal etmek kendi dilinizin sınırlarını genişletir."
    ])

    pdf.alt_alt_bolum("Sınırlar ve Eleştiriler")
    pdf.paragraf(
        "Küresel pazarın yarattığı 'havaalanı romanı' veya 'küresel roman' (global novel) tek-tipleşmesi "
        "en büyük tehdittir. Herkes tarafından kolayca anlaşılsın diye dili düzleştirilmiş ve yerel çelişkileri "
        "törpülenmiş metinler edebiyatı yoksullaştırır."
    )

    pdf.ornek_kutusu(
        "Orhan Pamuk - Benim Adım Kırmızı",
        "16. yüzyıl Osmanlı nakkaşlarının Doğu ve Batı resim anlayışları arasındaki çatışması, cinayet "
        "ve aşk kurgusu içinde anlatılır.",
        "Pamuk, Osmanlı minyatür sanatının yerel felsefesini evrensel bir polisiye kurguyla buluşturarak "
        "Damrosch'un bahsettiği küresel dolaşım gücünü yakalamıştır. Metin, hem yerel belleği korur "
        "hem de dünya edebiyat cumhuriyetinde meşruiyet kazanır."
    )

    pdf.etkinlik_kutusu(
        "Çeviri ve Yabancılaştırma Pratiği",
        [
            "Türkçeye özgü bir deyimi (örn. 'Gönül koymak' veya 'İç çekmek') İngilizceye çevirirken anlam kaybını en aza indiren ve kültürel farkı koruyan bir yabancılaştırma stratejisi geliştirin.",
            "Bir Türk yazarın küresel bir okur kitlesi için yazdığı açıkça belli olan bir sahne tasarlayın; ardından aynı sahneyi tamamen içe dönük bir yerel dille yeniden yazın."
        ]
    )

    pdf.tartisma_sorulari([
        "Bir Türk yazarın Nobel veya uluslararası ödüller alabilmesi için Batı'nın beklediği 'Doğu krizlerini' anlatması zorunlu mudur?",
        "Emily Apter'ın 'Çevrilemezlik' savı kültürlerarası diyaloğu imkânsız kılan bir kültürel izolasyona yol açar mı?"
    ])

    # ═════════════════════════════════════════════════════════════════════════
    # 6.8 DİJİTAL BEŞERİ BİLİMLER VE HESAPLAMALI EDEBİYAT
    # ═════════════════════════════════════════════════════════════════════════
    pdf.alt_bolum("Dijital Beşeri Bilimler ve Hesaplamalı Edebiyat")

    pdf.alt_alt_bolum("Tarihsel ve Kuramsal Arka Plan")
    pdf.paragraf(
        "Dijitalleşme ve büyük veri çağında edebiyat çalışmaları sadece tekil kitapların satır satır "
        "okunmasıyla sınırlı kalamaz hale gelmiştir. Franco Moretti, Matthew Jockers ve Ted Underwood gibi "
        "araştırmacıların başlattığı hesaplamalı edebiyat çalışmaları (Computational Literary Studies); "
        "binlerce romanı algoritmalar, doğal dil işleme ve istatistiksel modellerle tarayarak edebiyat "
        "tarihindeki görünmeyen kalıpları ortaya çıkarmıştır. Stanford Edebiyat Laboratuvarı bu alanda "
        "çığır açıcı analizler üretmiştir."
    )

    pdf.alt_alt_bolum("Temel Soru")
    pdf.italic_paragraf(
        "Bir insanın ömrü boyunca okuyamayacağı on binlerce metni bilgisayar algoritmalarıyla taradığımızda "
        "türlerin evrimi, üslup değişimleri ve edebiyat tarihi hakkında neleri keşfederiz?"
    )

    pdf.alt_alt_bolum("Anahtar Kavramlar")
    pdf.kavram_tanimi(
        "Uzaktan Okuma (Distant Reading)",
        "Franco Moretti'nin kavramı: Tekil metinlerin derinlemesine analizi (close reading) yerine, yüzlerce "
        "yıllık binlerce eserin büyük veri setleri, grafikler, haritalar ve ağlar üzerinden uzaktan incelenmesidir."
    )
    pdf.kavram_tanimi(
        "Makroanaliz (Macroanalysis)",
        "Matthew Jockers'ın kavramlaştırması: Edebi külliyatların bilgisayar destekli metin madenciliği "
        "yöntemleriyle tematik, biçimsel ve dilsel eğilimlerinin haritalandırılmasıdır."
    )
    pdf.kavram_tanimi(
        "Biçemölçüm / Üslup Ölçümü (Stylometry)",
        "Bir yazarın kelime sıklıkları, cümle uzunlukları ve söz dizimi alışkanlıklarının istatistiksel "
        "olarak hesaplanması; anonim metinlerin kime ait olduğunun tespiti ve üslup parmak izinin çıkarılmasıdır."
    )
    pdf.kavram_tanimi(
        "Konu Modelleme (Topic Modeling)",
        "Geniş metin yığınlarındaki anlamsal olarak ilişkili sözcük öbeklerini istatistiksel olarak kümeleyerek "
        "dönemlerin gizli temalarını saptayan denetimsiz makine öğrenimi tekniğidir."
    )
    pdf.kavram_tanimi(
        "Ağ Analizi (Network Analysis)",
        "Bir romandaki karakterlerin diyalog ve karşılaşma sıklıklarını matematiksel çizge (graph) "
        "kuramıyla görselleştirerek anlatının güç ve iletişim merkezlerini ortaya çıkarma yöntemidir."
    )
    pdf.kavram_tanimi(
        "Ölçeklenebilir Okuma (Scalable Reading)",
        "Büyük veri analizi (uzaktan okuma) ile tekil metin analizi (yakından okuma) arasında sürekli gidip "
        "gelen dengeli okuma metodolojisidir."
    )

    pdf.alt_alt_bolum("Metinleri Nasıl Okur?")
    pdf.paragraf(
        "Hesaplamalı eleştiri, edebiyatı kanonik birkaç başyapıttan ibaret görmez; dönemin unutulmuş "
        "bütün metinlerini sisteme katar. Cinsiyet temsillerini, mekân adlarının sıklığını ve duygusal "
        "arkların (sentiment analysis) matematiksel iniş çıkışlarını nesnel verilerle çözümler."
    )

    pdf.alt_alt_bolum("Yaratıcı Yazar İçin Pratik Çıkarımlar")
    pdf.madde_listesi([
        "Kendi metinlerinizin kelime bulutlarını ve sıklıklarını analiz edin; farkında olmadan tekrar ettiğiniz takıntı sözcükleri ve klişeleri tespit edin.",
        "Karakterlerinizin ağ haritasını çıkarın: Bazı karakterler anlatıda gereksiz yere mi yer kaplıyor yoksa merkezdeki bağları güçlü mü?",
        "Hikâyenizin duygu eğrisini (gerilim-rahatlama grafiği) hesaplamalı olarak test edin; anlatı temposunun nerelerde sarktığını görselleştirin."
    ])

    pdf.alt_alt_bolum("Sınırlar ve Eleştiriler")
    pdf.paragraf(
        "Veri fetişizmi ve sayısallaştırma yanılsaması en büyük handikaptır. İroni, parodi, tekinsizlik "
        "ve edebi derinlik algoritmalar tarafından kolayca ıskalanabilir; edebiyat sayılara kurban edilemez."
    )

    pdf.ornek_kutusu(
        "Türk Romanında Ağ Analizi ve Mekân Taraması",
        "Tanzimat'tan Cumhuriyet'e uzanan 100 Türk romanının dijital ortamda taranması: Kadın karakterlerin "
        "kapalı ev içi mekânlarla, erkek karakterlerin ise sokak ve dairelerle kurduğu bağlantının sıklığı.",
        "Hesaplamalı analiz, Berna Moran ve Jale Parla'nın sosyolojik tespitlerini binlerce sayfalık "
        "büyük veride istatistiksel olarak kanıtlar: Türk modernleşmesinde kadının kamusal alandan "
        "dışlanışı nesnel veri grafikleriyle görünür kılınır."
    )

    pdf.etkinlik_kutusu(
        "Karakter Ağ Haritası Çizimi",
        [
            "Yazdığınız veya okuduğunuz bir öyküdeki tüm karakterleri birer düğüm (node) olarak belirleyin; aralarındaki her konuşmayı bir çizgiyle (edge) birleştirerek anlatının iletişim ağını kâğıda dökün.",
            "Kendi yazdığınız 5 sayfalık bir metinde en çok kullandığınız 10 fiili listeleyin ve bu fiillerin karakterinizin eylemlilik kapasitesini nasıl sınırladığını tartışın."
        ]
    )

    pdf.tartisma_sorulari([
        "Bir romanı algoritmalarla analiz etmek edebi eserin 'ruhunu' ve sanatsal gizemini yok eder mi?",
        "Uzaktan okuma yöntemi edebiyat kanonunu demokratikleştirir mi yoksa kanon dışı metinleri değersiz istatistiklere mi dönüştürür?"
    ])

    # ═════════════════════════════════════════════════════════════════════════
    # 6.9 YAPAY ZEKÂ VE EDEBİYAT
    # ═════════════════════════════════════════════════════════════════════════
    pdf.alt_bolum("Yapay Zekâ ve Edebiyat")

    pdf.alt_alt_bolum("Tarihsel ve Kuramsal Arka Plan")
    pdf.paragraf(
        "2020 sonrasında Büyük Dil Modellerinin (Large Language Models - LLM) olağanüstü gelişimi, "
        "edebiyatın ontolojisini ve yazar kavramını tarihte hiç olmadığı kadar radikal bir tartışmanın "
        "içine çekmiştir. Roland Barthes'ın 1967'de ilan ettiği 'Yazarın Ölümü' tezi, algoritmik metin "
        "üretimiyle somut bir gerçekliğe bürünmüştür. İnsan bilinci, ıstırabı ve bedeni olmaksızın milyarlarca "
        "parametrelik olasılık hesaplarıyla kusursuz şiirler ve öyküler üreten makineler; yaratıcılık, "
        "orijinallik ve estetik değer kavramlarını yeniden tanımlamamızı zorunlu kılmaktadır."
    )

    pdf.alt_alt_bolum("Temel Soru")
    pdf.italic_paragraf(
        "Bilinçsiz algoritmalar anlam üretebilir mi; yazarın biyolojik bir varlık olmadığı bir dünyada "
        "yaratıcılık kime aittir ve edebiyat insan tekelinden çıkmış mıdır?"
    )

    pdf.alt_alt_bolum("Anahtar Kavramlar")
    pdf.kavram_tanimi(
        "Yazar ve Kasıt (Author / Intent)",
        "Geleneksel kuramda metnin anlamını yazarın zihinsel niyetine bağlayan kabulün yapay zekâ çağında "
        "çökmesidir. Makinenin bir 'kastı' (intention) yoktur; sadece istatistiksel sözcük dizilimi üretir."
    )
    pdf.kavram_tanimi(
        "Yaratıcılık ve Özgünlük (Creativity / Originality)",
        "Yapay zekânın geçmiş külliyatın devasa bir kolajını yapması karşısında yaratıcılığın tanımı: "
        "Yeni bir şey yaratmak mı yoksa var olanları daha önce görülmemiş biçimde birleştirmek mi?"
    )
    pdf.kavram_tanimi(
        "Telif ve Algoritmik Müşterekler (Copyright & Commons)",
        "Yapay zekânın milyonlarca yazarın telifli eserleriyle eğitilmesi sonucu ortaya çıkan hukuki ve "
        "etik kriz; insan emeğinin anonimleştirilerek sermayeye dönüştürülmesi tartışmasıdır."
    )
    pdf.kavram_tanimi(
        "Okur ve Anlam İnşası (Reader / Meaning)",
        "Anlamın metni üreten makinede değil, o metni okuyup ona insani duygular atfeden okurun zihninde "
        "üretildiği gerçeğidir."
    )
    pdf.kavram_tanimi(
        "Hesaplamalı Anlatıbilim (Computational Narratology)",
        "Anlatı yapılarının, olay örgüsü formüllerinin ve karakter arklarının yapay zekâ tarafından "
        "modellenebilir ve üretilebilir matematiksel kodlara dönüştürülmesidir."
    )

    pdf.alt_alt_bolum("Metinleri Nasıl Okur?")
    pdf.paragraf(
        "Yapay zekâ edebiyatı eleştirisi, makine üretimi metinlerdeki olasılık kalıplarını, 'halüsinasyon' "
        "(hallucination) anlarındaki yaratıcı kırılmaları ve insan ile makinenin ortak yazarlık (co-authorship) "
        "dinamiklerini inceler."
    )

    pdf.alt_alt_bolum("Yaratıcı Yazar İçin Pratik Çıkarımlar")
    pdf.madde_listesi([
        "Yapay zekâyı bir rakip değil, yaratıcı bir kısıt (Oulipo tarzı bir biçimsel ortak) ve beyin fırtınası partneri olarak kullanın.",
        "Yapay zekânın kolayca ürettiği basmakalıp anlatı şablonlarından kaçının; insan deneyiminin kırılgan, tutarsız, rasyonel olmayan derinliklerine odaklanın.",
        "Prompt (komut) yazarlığını yeni bir edebi tür olarak keşfedin: Algoritmaya verilen yönergelerin felsefi derinliği çıktının estetik kalitesini belirler."
    ])

    pdf.alt_alt_bolum("Sınırlar ve Eleştiriler")
    pdf.paragraf(
        "Yapay zekânın ürettiği metinler ortalamaya yakınsama (regression to the mean) ve klişe üretme "
        "eğilimindedir. Yaşanmış bir bedensel acı, ölüm bilinci ve varoluşsal kaygı taşımayan metinlerin "
        "derin bir etik ağırlık kurması son derece zordur."
    )

    pdf.ornek_kutusu(
        "Yapay Zekâ ile Ortak Yazarlık (Cyborg Writing)",
        "Bir yazarın kendi çocukluk anılarını prompt olarak girdiği ve modelin bu anıları sürrealist "
        "bir bilimkurgu distopyasına dönüştürdüğü hibrit metin denemeleri.",
        "Bu süreçte metnin yazarı tek başına ne insan ne de makinedir; ortaya çıkan ürün Haraway'in bahsettiği "
        "'siborg' anlatıdır. Yaratıcılık, iki bilincin (biyolojik hafıza ile algoritmik hafıza) temas "
        "noktasında parıldar."
    )

    pdf.etkinlik_kutusu(
        "Yapay Zekâ ile Karşılaştırmalı Yazma",
        [
            "Bir yapay zekâ modeline 'yağmurlu bir günde gelen mektup' konulu 200 kelimelik bir öykü yazdırın. Ardından aynı konuyu tamamen kendi kişisel ve bedensel hislerinizle kaleme alın; iki metin arasındaki farkları listeleyin.",
            "Yapay zekânın yazdığı bir metindeki klişeleri ayıklayıp onu deneysel bir şiire dönüştüren bir 'yeniden yazım' (remix) çalışması yapın."
        ]
    )

    pdf.tartisma_sorulari([
        "Bir romanı okurken ağladığınızda, o romanın bir yapay zekâ tarafından yazıldığını öğrenirseniz gözyaşlarınız sahteleşir mi?",
        "Yapay zekânın edebiyat üretmesi insan yazarlığını ortadan kaldıracak mıdır yoksa yazarlığı salt zanaatkarlıktan felsefi bir tasarımcılığa mı yükseltecektir?"
    ])

    # ═════════════════════════════════════════════════════════════════════════
    # 6.10 METAMODERNİZM VE YENİ İÇTENLİK
    # ═════════════════════════════════════════════════════════════════════════
    pdf.alt_bolum("Metamodernizm ve Yeni İçtenlik")

    pdf.alt_alt_bolum("Tarihsel ve Kuramsal Arka Plan")
    pdf.paragraf(
        "Postmodernizmin her şeyi alaya alan, hiçbir değere inanmayan, safi parodi ve kinizmden ibaret "
        "kalan dünyası 2000 sonrasında tıkandı. David Foster Wallace'ın 'Artık alaycılıktan bıktık, yeni bir "
        "içtenliğe ihtiyacımız var' çağrısı, 2010'da Timotheus Vermeulen ve Robin van den Akker tarafından "
        "'Metamodernizm' kuramıyla formüle edildi. Metamodernizm, modernizmin inanç ve umut arayışı ile "
        "postmodernizmin şüphe ve ironisi arasında sürekli salınan (oscillation) yeni bir duyarlık biçimidir."
    )

    pdf.alt_alt_bolum("Temel Soru")
    pdf.italic_paragraf(
        "Postmodern ironi ve şüphecilik çağının ardından samimiyet, saf inanç ve sahici duygu edebiyatta "
        "safdillik (naiflik) tuzağına düşmeden nasıl yeniden inşa edilebilir?"
    )

    pdf.alt_alt_bolum("Anahtar Kavramlar")
    pdf.kavram_tanimi(
        "İroni ile İçtenlik Arasında Salınım (Oscillation)",
        "Metamodernizmin temel dinamiği: Bir sarkaç gibi modern umut ile postmodern kuşku, samimiyet ile "
        "ironi arasında durmaksızın gidip gelme; hiçbir uçta sabitlenmeme hâlidir."
    )
    pdf.kavram_tanimi(
        "Yeni İçtenlik (New Sincerity)",
        "Alaycı zırhları bir kenara bırakarak savunmasızlığı, kırılganlığı ve sahici duygusal bağları "
        "edebiyatın merkezine koyan, ancak ironinin farkında olmayı da sürdüren anlatı tavrıdır."
    )
    pdf.kavram_tanimi(
        "Otantiklik Arayışı (Authenticity)",
        "Gösteri toplumunun ve sosyal medyanın ürettiği sahte imajlara karşı, insanın kendi varoluşsal "
        "hakikatiyle ve başkalarıyla kurmaya çalıştığı dürüst temas arzusudur."
    )

    pdf.alt_alt_bolum("Metinleri Nasıl Okur?")
    pdf.paragraf(
        "Metamodernist okuma, metindeki ironik mesafenin altında yatan derin kederi ve samimiyet arzusunu "
        "keşfeder. Ne saf bir nostaljiye teslim olur ne de nihilist bir alaycılıkta karar kılar; metnin iki "
        "kutup arasındaki gerilimini açığa çıkarır."
    )

    pdf.alt_alt_bolum("Yaratıcı Yazar İçin Pratik Çıkarımlar")
    pdf.madde_listesi([
        "Karakterlerinizin alaycı ve zeki esprilerinin arkasına saklanmasına izin vermeyin; onları rezil olma pahasına duygularını açıkça ifade etmeye zorlayın.",
        "İroniyi bir amaç değil, samimiyete giden yoldaki koruyucu bir filtre olarak kullanın.",
        "Okurla aranızdaki kibirli 'her şeyi bilen yazar' mesafesini kaldırın; kusurlarınızı ve kararsızlıklarınızı metne dahil edin."
    ])

    pdf.alt_alt_bolum("Sınırlar ve Eleştiriler")
    pdf.paragraf(
        "Yeni içtenliğin sınırları gevşediğinde, metin kolayca sulugöz bir melodrama, bayat bir kişisel "
        "gelişim edebiyatına veya naif bir melankoliye kayabilir. Sanatsal denge hayati önemdedir."
    )

    pdf.ornek_kutusu(
        "Barış Bıçakçı - Bizim Büyük Çaresizliğimiz",
        "Ender ve Çetin'in dostluğu, evlerine sığınan Nihal'e duydukları aşk ve gündelik hayatın hüzünlü "
        "ayrıntıları: 'İnsan hiçbir şeye alışmıyor, sadece alışmış gibi yapıyor.'",
        "Bıçakçı tam bir metamodernist salınım ustasıdır. Karakterler hem durumun saçmalığının ve kendi "
        "beceriksizliklerinin farkında olup ince ince kendileriyle dalga geçerler (ironi), hem de dostluk "
        "ve aşka sonsuz bir masumiyetle bağlanırlar (yeni içtenlik)."
    )

    pdf.etkinlik_kutusu(
        "İroni ve Samimiyet Sarkacı",
        [
            "Bir karakterin aşırı ciddi bir cenaze töreninde aklına gelen komik bir anı yüzünden gülümsemesini ve hemen ardından gelen derin kederi anlatan bir sahne yazın.",
            "Sosyal medyada sürekli alaycı paylaşımlar yapan bir gencin, gece odasında tek başınayken günlüğüne yazdığı dürüst ve savunmasız bir itiraf metni oluşturun."
        ]
    )

    pdf.tartisma_sorulari([
        "David Foster Wallace'ın öngördüğü gibi alaycılık günümüz insanını gerçekten yalnızlığa ve duyarsızlığa mı mahkûm etmiştir?",
        "Metamodernizm yeni bir kuramsal çağ mıdır yoksa postmodernizmin içindeki geçici bir duygu dalgası mıdır?"
    ])

    # ═════════════════════════════════════════════════════════════════════════
    # 6.11 OTOKURGU, OTOKURAM VE YAŞAM ANLATILARI
    # ═════════════════════════════════════════════════════════════════════════
    pdf.alt_bolum("Otokurgu, Otokuram ve Yaşam Anlatıları")

    pdf.alt_alt_bolum("Tarihsel ve Kuramsal Arka Plan")
    pdf.paragraf(
        "Serge Doubrovsky'nin 1977'de ortaya attığı 'Otokurgu' (Autofiction) terimi, 2000'li yıllarda Karl Ove "
        "Knausgaard, Annie Ernaux, Rachel Cusk ve Maggie Nelson gibi yazarların başyapıtlarıyla küresel bir "
        "anlatı patlamasına dönüşmüştür. Philippe Lejeune'ün 'Otobiyografik Sözleşme' kuramını altüst eden "
        "otokurgu, yazarın kendi adını taşıyan bir anlatıcı yaratıp gerçek yaşantılarını kurmacanın araçlarıyla "
        "yeniden yazmasıdır. Son yıllarda buna eklenen 'Otokuram' (Autotheory) ise yazarın kişisel ve bedensel "
        "deneyimlerini felsefi kuramlarla harmanlayan yeni bir tür olarak parlamıştır."
    )

    pdf.alt_alt_bolum("Temel Soru")
    pdf.italic_paragraf(
        "Metinde 'ben' diyen kimdir; yazar kendi hayatının mahrem yaralarını kurmacanın ve felsefi teorinin "
        "bir laboratuvarına nasıl dönüştürebilir?"
    )

    pdf.alt_alt_bolum("Anahtar Kavramlar")
    pdf.kavram_tanimi(
        "Otobiyografik Sözleşme (Autobiographical Pact)",
        "Philippe Lejeune'ün kuramı: Yazar, anlatıcı ve ana karakterin aynı adı taşıdığı ve okura 'gerçeği "
        "anlatacağına' dair zımni bir söz verdiği sözleşmedir. Otokurgu bu sözleşmeyi bilerek ihlal eder."
    )
    pdf.kavram_tanimi(
        "Otokurgu (Autofiction)",
        "Yazarın kendi hayat hikâyesini, gerçek olayları ve isimleri kullanarak ancak roman sanatının "
        "kurgusal, stilistik ve hayali imkânlarıyla dönüştürerek yazmasıdır."
    )
    pdf.kavram_tanimi(
        "Otokuram (Autotheory)",
        "Maggie Nelson ve Paul B. Preciado ile anılan kavram: Yazarın kendi bedensel, cinsel, ailesel veya "
        "tıbbi yaşantılarını doğrudan yüksek felsefi/kuramsal metinlerle iç içe geçirerek anlatmasıdır."
    )

    pdf.alt_alt_bolum("Metinleri Nasıl Okur?")
    pdf.paragraf(
        "Otokurgusal okuma, metnin 'gerçek mi kurmaca mı' ikiliğine sıkıştırılmasına karşı çıkar. Yazarın "
        "kendi benliğini nasıl bir kurgusal persona haline getirdiğini, hafızanın yanılsamalarını ve mahremiyetin "
        "politik boyutlarını sorgular."
    )

    pdf.alt_alt_bolum("Yaratıcı Yazar İçin Pratik Çıkarımlar")
    pdf.madde_listesi([
        "Kendi hayatınızı yazarken kendinizi aklama veya kahramanlaştırma tuzağına düşmeyin; en zayıf, utanç verici ve çelişkili anlarınızı cesaretle deşin.",
        "Kişisel acınızı evrensel kılın: Yaşadığınız bir ayrılık veya hastalık sadece size ait bir trajedi olmaktan çıkıp çağın toplumsal krizinin bir aynası olsun.",
        "Teoriyi ve felsefeyi soyut bir süs olarak değil, hayatınızın en somut kriz anlarında sığındığınız bir alet çantası olarak metne yedirin."
    ])

    pdf.alt_alt_bolum("Sınırlar ve Eleştiriler")
    pdf.paragraf(
        "Narsizm, teşhircilik ve 'benmerkezcilik' en temel eleştirilerdir. Yazarın kendi küçük dünyasını "
        "dünyanın merkezi sanması ve edebi hayal gücünü terk edip salt bir dedikodu edebiyatı üretmesi "
        "otokurgunun en büyük açmazıdır."
    )

    pdf.ornek_kutusu(
        "Murat Gülsoy - Baba, Oğul ve Kutsal Roman",
        "Yazarın babasının ölümünün ardından yaşadığı yas süreci, romancılık üzerine kuramsal düşünceler "
        "ve kurmaca ile gerçeklik arasındaki sınırın sürekli ihlal edilişi.",
        "Murat Gülsoy, kişisel bir kaybı salt bir anı olarak bırakmaz; anlatıcı yazar Murat Gülsoy olarak "
        "kurmacanın nasıl inşa edildiğini metnin içinde ifşa eder. Bu, otokurgu ile üstkurmacanın kusursuz "
        "bir sentezidir."
    )

    pdf.etkinlik_kutusu(
        "Otokurgusal İtiraf ve Teori",
        [
            "Kendi adınızı verdiğiniz bir karakterin, çocukken işlediği küçük ve utanç verici bir suçu anlattığı, ancak araya hafızanın güvenilmezliğine dair felsefi yorumlar kattığı bir pasaj yazın.",
            "Son bir yıl içinde yaşadığınız kişisel bir hayal kırıklığını, Sevgi Soysal veya Walter Benjamin'in bir kavramıyla ilişkilendirerek (otokuram tarzında) kaleme alın."
        ]
    )

    pdf.tartisma_sorulari([
        "Annie Ernaux'nun Nobel kazanması otokurgunun geleneksel roman kurgusuna karşı kesin zaferi midir?",
        "Otokurgu yazmak yazarın çevresindeki gerçek insanların mahremiyetini ihlal eden etik dışı bir sömürüye dönüşebilir mi?"
    ])

    # ═════════════════════════════════════════════════════════════════════════
    # 6.12 SPEKÜLATİF KURGU, AFROFÜTÜRİZM VE KÜRESEL GÜNEY
    # ═════════════════════════════════════════════════════════════════════════
    pdf.alt_bolum("Spekülatif Kurgu, Afrofütürizm ve Küresel Güney")

    pdf.alt_alt_bolum("Tarihsel ve Kuramsal Arka Plan")
    pdf.paragraf(
        "Klasik bilimkurgu ve fantezi uzun yıllar Batı merkezli, beyaz erkek kahramanların galaksileri "
        "fethettiği teknolojik bir sömürgecilik fantezisi olarak gelişti. 2000 sonrasında Mark Dery, Kodwo Eshun, "
        "Octavia Butler ve N.K. Jemisin gibi figürlerle yükselen Afrofütürizm ve Küresel Güney spekülatif kurgusu, "
        "gelecek tahayyülünü marjinalleştirilenlerin ellerine vermiştir. Darko Suvin'in 'bilişsel yabancılaşma' "
        "kavramı yerel mitler, sömürgecilik karşıtı mücadeleler ve alternatif tarihlerle harmanlanmıştır."
    )

    pdf.alt_alt_bolum("Temel Soru")
    pdf.italic_paragraf(
        "Gelecek sadece Batılı metropollerin tekelinde midir; ezilenlerin hafızası, yerel efsaneler ve "
        "Küresel Güney'in krizleri alternatif dünyaları nasıl yeniden inşa eder?"
    )

    pdf.alt_alt_bolum("Anahtar Kavramlar")
    pdf.kavram_tanimi(
        "Bilişsel Yabancılaşma (Cognitive Estrangement)",
        "Darko Suvin'in bilimkurgu tanımı: Okuru alışık olduğu dünyadan koparan radikal bir yenilik (novum) "
        "yaratırken, aynı zamanda bu yeni dünyayı rasyonel ve mantıksal bir kavrayışla açıklama durumudur."
    )
    pdf.kavram_tanimi(
        "Afrofütürizm (Afrofuturism)",
        "Afrika diasporasının tarihsel kölelik ve sömürge travmalarını bilimkurgu, teknoloji, fütürizm "
        "ve kozmolojiyle birleştirerek siyah kimliğini ve geleceğini yeniden kuran kültürel harekettir."
    )
    pdf.kavram_tanimi(
        "Spekülatif Kurgu (Speculative Fiction)",
        "Bilimkurgu, distopya, ütopya, fantezi ve büyüleyici gerçekçiliği kapsayan; 'Ya şöyle olsaydı?' "
        "(What if?) sorusuyla şimdiki zamanın sınırlarını esneten geniş şemsiye türdür."
    )

    pdf.alt_alt_bolum("Metinleri Nasıl Okur?")
    pdf.paragraf(
        "Spekülatif eleştiri, metindeki yabancı gezegenlerin, canavarların veya gelecek teknolojilerinin "
        "aslında günümüzün hangi sömürgeci, ırkçı veya sınıfsal eşitsizliklerini yansıtan metaforlar "
        "olduğunu ifşa eder."
    )

    pdf.alt_alt_bolum("Yaratıcı Yazar İçin Pratik Çıkarımlar")
    pdf.madde_listesi([
        "Distopya yazarken Amerikan veya Avrupa şablonlarını kopyalamayın; kendi coğrafyanızın bürokratik absürtlüklerini ve yerel krizlerini spekülatif bir boyuta taşıyın.",
        "Yerel mitolojiyi ve halk hikâyelerini bilimsel ve teknolojik novumlarla kaynaştırın.",
        "Geleceği sadece zenginlerin uçan arabaları olarak değil, çevre mahallelerin susuzluğu ve çöp toplayıcılarının alternatif teknolojileri üzerinden kurgulayın."
    ])

    pdf.alt_alt_bolum("Sınırlar ve Eleştiriler")
    pdf.paragraf(
        "Küresel Güney'in acılarını Batılı okura 'otantik ve egzotik bir kıyamet masalı' olarak pazarlama "
        "tehlikesi mevcuttur. Spekülasyonun politik direncini yitirip eğlenceli bir kaçış edebiyatına "
        "dönüşmesi riski vardır."
    )

    pdf.ornek_kutusu(
        "Doğu Yücel - Varolmayanlar",
        "İstanbul'un kadim sokaklarında kadim inançlar, metafizik güçler ve modern tüketim toplumunun "
        "çatışması spekülatif bir dille kurgulanır.",
        "Doğu Yücel, Batı tarzı fantezi klişelerini kullanmak yerine İstanbul'un kendine has kaosunu "
        "ve Doğu mistisizmini bilişsel bir yabancılaşmayla buluşturur; yerel bir şehir spekülasyonu kurar."
    )

    pdf.etkinlik_kutusu(
        "Yerel Spekülatif Kurgu Tasarımı",
        [
            "İstanbul veya Anadolu'nun bir kasabasında, internetin ve elektriğin 10 yıl önce tamamen çöktüğü bir gelecekte haberleşmenin eski Osmanlı posta teşkilatıyla sağlandığı bir sahne yazın.",
            "Bir Anadolu efsanesindeki yaratığı (örneğin Şahmeran veya Alkarısı) yapay zekâ çağının genetik bir deney ürünü olarak yeniden kurgulayın."
        ]
    )

    pdf.tartisma_sorulari([
        "Spekülatif kurgu gerçekçi edebiyattan daha güçlü bir siyasi muhalefet üretebilir mi?",
        "Afrofütürizm ve yerel fütürizmler Batı'nın teknolojik tekno-kapitalist anlatısına karşı gerçek bir alternatif sunabilmekte midir?"
    ])

    # ═════════════════════════════════════════════════════════════════════════
    # 6.13 ENGELLİLİK ÇALIŞMALARI VE KESİŞİMSELLİK
    # ═════════════════════════════════════════════════════════════════════════
    pdf.alt_bolum("Engellilik Çalışmaları ve Kesişimsellik")

    pdf.alt_alt_bolum("Tarihsel ve Kuramsal Arka Plan")
    pdf.paragraf(
        "Engellilik Çalışmaları (Disability Studies), 1990'ların sonundan itibaren David Mitchell, "
        "Sharon Snyder, Lennard Davis ve Rosemarie Garland-Thomson'ın öncülüğünde edebiyat kuramına dahil "
        "olmuştur. Bu yaklaşım, sakatlığı ve bedensel farklılığı tıbbi bir 'kusur' veya kişisel bir 'trajedi' "
        "olarak değil, toplumun normatif beden dayatmalarının ürettiği politik bir durum olarak inceler. "
        "Kimberlé Crenshaw'ın geliştirdiği 'Kesişimsellik' (Intersectionality) kuramı ise bedensel farklılığın "
        "cinsiyet, ırk ve sınıfla nasıl kesişerek katmerli bir ayrımcılık ürettiğini ortaya koyar."
    )

    pdf.alt_alt_bolum("Temel Soru")
    pdf.italic_paragraf(
        "Edebiyat normatif bedeni nasıl inşa eder; sakatlık salt ahlaki bir ceza veya trajik bir metafor "
        "olmaktan çıkarılıp çok boyutlu bir insani varoluş olarak nasıl temsil edilir?"
    )

    pdf.alt_alt_bolum("Anahtar Kavramlar")
    pdf.kavram_tanimi(
        "Anlatı Protezi (Narrative Prosthesis)",
        "Mitchell ve Snyder'ın kavramı: Edebiyat tarihinin sakat bedenleri sürekli bir 'anlatısal baston' "
        "olarak kullanması; yani bir karakterin sakatlığını ya kötü ruhunun simgesi (Kaptan Hook, Richard III) "
        "ya da aşırı bir ahlaki masumiyetin metaforu yapıp gerçek bedensel deneyimi silmesidir."
    )
    pdf.kavram_tanimi(
        "Kesişimsellik (Intersectionality)",
        "Kimberlé Crenshaw'ın kavramı: Bireyin kimliğini oluşturan cinsiyet, sınıf, ırk, cinsel yönelim ve "
        "engellilik hallerinin birbirinden bağımsız değil, birbirini dönüştüren ve katlayan baskı sistemleri "
        "olarak birlikte işlemesidir."
    )
    pdf.kavram_tanimi(
        "Erişilebilirlik ve Sakat Kuramı (Crip Theory)",
        "Robert McRuer'in geliştirdiği alan: Zorunlu sağlam-bedenlilik (compulsory able-bodiedness) normunu "
        "sorgulayarak, dünyanın ve edebiyatın sakat bedenlerin hızına, ritmine ve mekânsal ihtiyaçlarına göre "
        "yeniden düşünülmesidir."
    )

    pdf.alt_alt_bolum("Metinleri Nasıl Okur?")
    pdf.paragraf(
        "Metindeki engelli karakterlerin birer 'ibret vesilesi' veya 'acıma nesnesi' yapılıp yapılmadığını "
        "denetler. Sağlam beden varsayımının anlatının diline, mekân kullanımına ve bakış açısına nasıl "
        "sızdığını teşhir eder."
    )

    pdf.alt_alt_bolum("Yaratıcı Yazar İçin Pratik Çıkarımlar")
    pdf.madde_listesi([
        "Engelli karakterlerinizi salt bir 'engel'den ibaret görmeyin; onların arzuları, kusurları, mizah anlayışları ve aşkları olsun.",
        "Anlatı protezi tuzağından kaçının: Karakterinizin topallamasını onun kötü kalpliliğinin veya aşırı çaresizliğinin bir sembolü yapmayın; o bedenin gündelik pratik zorluklarına ve kendine has ritmine odaklanın.",
        "Mekânı kurgularken sağlam-bedenli ayrıcalığınızı sorgulayın: Karakterinizin tekerlekli sandalyeyle bir kaldırıma çıkamayışı anlatıda gerçek bir sınıfsal ve kentsel çatışma doğursun."
    ])

    pdf.alt_alt_bolum("Sınırlar ve Eleştiriler")
    pdf.paragraf(
        "Kuramın aşırı politik doğrucu bir sansür mekanizmasına dönüşmesi ve edebiyattaki metaforik zenginliği "
        "bütünüyle yasaklama eğilimi eleştirilmiştir. Edebi metinlerin birer tıbbi veya ahlaki denetim "
        "raporuna indirgenmemesi gerekir."
    )

    pdf.ornek_kutusu(
        "Peyami Safa - Dokuzuncu Hariciye Koğuşu",
        "Hasta dizinden muzdarip adsız gencin hastane koridorlarındaki çaresizliği, Nüzhet'e duyduğu aşk "
        "ve Paşa köşküne girdiğinde hissettiği sınıfsal aşağılanma.",
        "Peyami Safa'nın romanı, Mitchell ve Snyder'ın 'Anlatı Protezi' savı ile Crenshaw'ın 'Kesişimsellik' "
        "kuramının ders kitabıdır. Gencin dizindeki sızı, hem Cumhuriyet modernleşmesindeki Doğu-Batı "
        "sancısının metaforudur hem de yoksulluk ile fiziksel sakatlığın kesiştiği sınıfsal bir yaradır."
    )

    pdf.etkinlik_kutusu(
        "Normativiteyi Bozma Egzersizi",
        [
            "Görme engelli bir karakterin kütüphaneye girdiği bir sahneyi, görme duyusuna ait hiçbir sözcük (ışık, karanlık, renk) kullanmadan, tamamen sesler, koku ve kâğıt dokuları üzerinden yazın.",
            "Bedensel farklılığı olan bir karakterin, kendisine 'acıyan' sağlam-bedenli bir yakınıyla yaptığı gerilimli ve ironik bir diyaloğu kaleme alın."
        ]
    )

    pdf.tartisma_sorulari([
        "Edebiyatta metafor kullanmak kaçınılmaz olduğuna göre, bir hastalığı veya sakatlığı metaforlaştırmak her zaman etik bir kusur mudur?",
        "Sağlam-bedenli bir yazarın engelli bir karakterin iç sesini yazması bir kültürel temellük (appropriation) sayılabilir mi?"
    ])

    # ═════════════════════════════════════════════════════════════════════════
    # 6.14 OYUN, TRANSMEDYA VE HAYRAN KURGUSU
    # ═════════════════════════════════════════════════════════════════════════
    pdf.alt_bolum("Oyun, Transmedya ve Hayran Kurgusu")

    pdf.alt_alt_bolum("Tarihsel ve Kuramsal Arka Plan")
    pdf.paragraf(
        "21. yüzyıl medya ortamında metin artık basılı sayfalara hapsolmuş sabit bir nesne değildir. "
        "Espen Aarseth'in 1997'de 'siber-metin' (cybertext) ve 'ergodik edebiyat' kavramlarıyla başlattığı "
        "çizgi; Jesper Juul'ün ludoloji (oyun bilimi) tartışmaları, Henry Jenkins'in 'Yakınsama Kültürü' "
        "(Convergence Culture) ve transmedya anlatı kuramıyla zirveye ulaşmıştır. Okurlar artık sadece pasif "
        "tüketiciler değil; hayran kurguları (fan fiction) yazan, alternatif sonlar üreten ve anlatı "
        "evrenlerine müdahale eden aktif katılımcılardır."
    )

    pdf.alt_alt_bolum("Temel Soru")
    pdf.italic_paragraf(
        "Okur bir oyuncuya ve anlatının ortak üreticisine dönüştüğünde yazar otoritesi nereye gider; "
        "hikâye birden fazla medya platformuna dağıldığında edebiyat nasıl hayatta kalır?"
    )

    pdf.alt_alt_bolum("Anahtar Kavramlar")
    pdf.kavram_tanimi(
        "Siber-metin ve Ergodik Edebiyat (Cybertext & Ergodic)",
        "Espen Aarseth'in kavramı: Okurun metinde ilerleyebilmek için sayfaları sırayla çevirmenin ötesinde "
        "aktif bir fiziksel ve zihinsel çaba (seçim yapma, labirent çözme, kod girme) harcamasını gerektiren "
        "etkileşimli metinlerdir."
    )
    pdf.kavram_tanimi(
        "Ludoloji ve Anlatıbilim (Ludology vs Narratology)",
        "Dijital oyunların ve etkileşimli anlatıların hikâye kurallarıyla mı (narratology) yoksa oyun kuralları "
        "ve mekanikleriyle mi (ludology) çözümlenmesi gerektiğine dair temel kuramsal çatışma ve sentezdir."
    )
    pdf.kavram_tanimi(
        "Yakınsama Kültürü ve Transmedya (Convergence Culture & Transmedia)",
        "Henry Jenkins'in kuramı: Tek bir hikâyenin roman, çizgi roman, video oyunu, sinema ve podcast gibi "
        "farklı platformlara parçalar halinde dağıtılması; her mecranın hikâyeye benzersiz bir derinlik katmasıdır."
    )
    pdf.kavram_tanimi(
        "Hayran Kurgusu ve Katılımcı Kültür (Fan Fiction)",
        "Okurların sevdikleri edebi eserlerin evrenlerini ve karakterlerini ödünç alarak kendi arzuları, "
        "politik görüşleri veya alternatif sonları doğrultusunda yeniden yazdıkları taban hareketi edebiyatıdır."
    )

    pdf.alt_alt_bolum("Metinleri Nasıl Okur?")
    pdf.paragraf(
        "Transmedya analizi, anlatının melez yapısını, okura tanınan interaktif serbestiyi ve hayranların "
        "ürettiği metinlerin orijinal kanonla nasıl müzakere ettiğini inceler."
    )

    pdf.alt_alt_bolum("Yaratıcı Yazar İçin Pratik Çıkarımlar")
    pdf.madde_listesi([
        "Tek bir kitaba sığmaya çalışmayın; anlattığınız dünyanın arka plan tarihini veya yan karakterlerini dijital platformlarda veya kısa öykülerde dallandırın.",
        "Çizgisel olmayan anlatı mekanizmaları kurun: Okura farklı okuma rotaları sunan fragmanter yapılar veya alternatif perspektifler tasarlayın.",
        "Okurlarınızın metninize müdahale etmesine, hayran teorileri üretmesine açık boşluklar (indeterminacy) bırakın."
    ])

    pdf.alt_alt_bolum("Sınırlar ve Eleştiriler")
    pdf.paragraf(
        "Hikâyenin derinliğinin ticari franchise mantığına kurban gitmesi ve oyun mekaniklerinin edebi dil "
        "işçiliğini arka plana itmesi en büyük risktir. Edebiyat sadece bir pazar evrenine indirgenemez."
    )

    pdf.ornek_kutusu(
        "Levent Cantek - Dumankara: Hayat Siyah Bir Baysungur",
        "Ankara'nın tekinsiz sokakları, grafiti kültürü, çizgi roman estetiği ve edebiyatın iç içe geçtiği "
        "melez bir anlatı.",
        "Levent Cantek, edebiyatı salt metin olmaktan çıkarıp görsel bir transmedya atmosferine dönüştürür. "
        "Çizgi roman kareleri ile edebi dilin buluşması, Aarseth ve Jenkins'in işaret ettiği türlerarası "
        "yakınsamanın yetkin bir örneğidir."
    )

    pdf.etkinlik_kutusu(
        "Dallanan Anlatı Tasarımı",
        [
            "Bir dedektifin olay mahalline geldiği bir açılış yazın; ardından okura iki seçenek sunarak hikâyeyi iki farklı yöne akıtan interaktif (ergodik) bir sayfa kurgulayın.",
            "Çok sevdiğiniz bir Türk edebiyatı klasiğinin (örneğin Aşk-ı Memnu) bir yan karakterini (örneğin Beşir veya Matmazel) ana kahraman yapan bir hayran kurgusu fragmanı kaleme alın."
        ]
    )

    pdf.tartisma_sorulari([
        "Video oyunları çağında basılı roman sanatı modası geçmiş bir mecraya mı dönüşmektedir?",
        "Hayran kurgusu yazarları orijinal eserin telif hakkını ve yazar otoritesini ihlal eden korsanlar mıdır yoksa edebiyatı canlandıran demokratik özneler mi?"
    ])

    # ═════════════════════════════════════════════════════════════════════════
    # 6.15 TÜRKÇE BAĞLAMDA KURAM: YEREL MODERNLEŞME, ELEŞTİRİ VE POETİKALAR
    # ═════════════════════════════════════════════════════════════════════════
    pdf.alt_bolum("Türkçe Bağlamda Kuram: Yerel Modernleşme, Eleştiri ve Poetikalar")

    pdf.paragraf(
        "Edebiyat kuramı Türkiye'de uzun yıllar Batı'da üretilen kavramların gecikmeli bir tercümesi "
        "olarak algılanmıştır. Oysa 20. yüzyılın ortalarından itibaren Türk edebiyat eleştirmenleri, "
        "yazarları ve kuramcıları; Türkiye'nin kendine has gecikmiş modernleşme sancılarını, Doğu-Batı "
        "çatışmasını, dil devrimini ve kültürel yarılmalarını açıklamak üzere son derece özgün, yerel "
        "ve kuramsal alet çantaları inşa etmişlerdir. Bu kuramcılar metne sadece Batılı formülleri "
        "uygulamamış; Türk romanının ve şiirinin epistemolojik temellerini kazıyarak dünya edebiyat "
        "kuramına katkı sunacak kavramlar üretmişlerdir."
    )

    pdf.alt_alt_bolum("Öncü Kuramcılar ve Temel Yaklaşımları")

    # 1. Tanpınar
    pdf.bold_paragraf("1. Ahmet Hamdi Tanpınar (1901–1962): Zaman, Rüya ve Mazi-Hâl Sürekliliği")
    pdf.paragraf(
        "Tanpınar, Türk modernleşmesinin radikal kopuş (eskiyi bütünüyle reddetme) projesine karşı "
        "Bergson felsefesinden ilham alan bir süreklilik poetikası kurmuştur. 'Ne içindeyim zamanın / Ne de "
        "büsbütün dışında' dizelerinde özetlenen bu yaklaşım; 'Huzur' ve 'Saatleri Ayarlama Enstitüsü'nde "
        "kuramsal bir derinliğe ulaşır. Tanpınar'a göre Türk aydını iki medeniyet arasında sıkışmış, "
        "organik bir sentez üretemediği için sürekli bir 'kültürel ikilik' ve saatleri ayarlayamama traji-komedisi "
        "yaşamaktadır. Rüya poetikası ise bastırılmış Doğu estetiğinin bilinçdışından fışkırma aracıdır."
    )

    # 2. Berna Moran
    pdf.bold_paragraf("2. Berna Moran (1921–1993): Metin Odaklı ve Çoğulcu Eleştiri")
    pdf.paragraf(
        "'Türk Romanına Eleştirel Bir Bakış' (3 cilt) ve 'Edebiyat Kuramları ve Eleştiri' adlı anıt eserleriyle "
        "Türk eleştirisini duygusal takdir veya ideolojik yargılama sığlığından kurtarmıştır. Moran, "
        "Yeni Eleştiri'nin metin içi yapısal analizini toplumsal-tarihsel bağlamla buluşturan 'çoğulcu bir yöntem' "
        "geliştirmiştir. Ahmet Mithat'tan Orhan Pamuk'a uzanan çizgide Türk romanının omurgasını oluşturan "
        "'yanlış Batılılaşma', 'alafrangalık züppeliği' ve roman tekniğindeki yapısal dönüşümleri ilk kez "
        "sistematik bir kuramsal çerçeveye oturtmuştur."
    )

    # 3. Jale Parla
    pdf.bold_paragraf("3. Jale Parla (1945–): Epistemoloji, Babalar ve Oğullar")
    pdf.paragraf(
        "'Babalar ve Oğullar: Tanzimat Romanının Epistemolojik Temelleri' ve 'Don Kişot'tan Bugüne Roman' "
        "eserleriyle Türk roman kuramına felsefi bir derinlik kazandırmıştır. Parla, Tanzimat romancılarının "
        "Doğu'nun koruyucu ve buyurgan 'baba' figürünü (mutlak otorite ve mutlak hakikat metinleri) "
        "kaybetmenin yarattığı epistemolojik krizle yazıya başladıklarını savunur. Batı romanı babayı "
        "öldürerek (bireyleşerek) gelişirken, Türk romanı sürekli 'hayırlı bir baba' arayışının ve yetimliğin "
        "gerilimiyle yoğrulmuştur."
    )

    # 4. Nurdan Gürbilek
    pdf.bold_paragraf("4. Nurdan Gürbilek (1956–): Kültürel Eleştiri, Taşra ve Kırılgan Benlik")
    pdf.paragraf(
        "'Kör Ayna Kayıp Şark', 'Vitrinde Yaşamak', 'Sessizliğin Sesi' ve 'Benden Önce Bir Başkası' gibi "
        "kitaplarıyla edebiyatı psikanaliz, Frankfurt Okulu ve kültür kuramıyla harmanlayan en özgün çağdaş "
        "sesimizdir. Gürbilek, Türk edebiyatındaki 'taşra sıkıntısı', 'yaralı erkeklik', 'mağduriyet ve gurur' "
        "diyalektiğini benzersiz bir üslupla inceler. Ona göre yazar, daima kendisinden önce konuşmuş olan "
        "büyük bir 'başkası'nın (Batı'nın, devletin, babanın) gölgesinde kendi sesini arayan kırılgan bir öznedir."
    )

    # 5. Tahsin Yücel
    pdf.bold_paragraf("5. Tahsin Yücel (1933–2016): Göstergebilim, Yapısalcılık ve Anlatı Yerlemleri")
    pdf.paragraf(
        "Fransız yapısalcılığı ve göstergebilimini (özellikle A.J. Greimas ve Roland Barthes) Türkiye'ye taşıyan "
        "ve yerleştiren öncüdür. 'Anlatı Yerlemleri' ve 'Yapısalcılık' kitaplarında metnin yüzeyindeki olayların "
        "altında yatan anlamsal eksenleri, aktan modellerini ve göstergebilimsel kareleri çözümlemiştir. "
        "Aynı zamanda 'Gökdelen', 'Yalan' gibi romanlarında dili ve bürokrasiyi göstergebilimsel bir hicivle "
        "eleştirerek kuramcı-yazar kimliğini birleştirmiştir."
    )

    # 6. Yıldız Ecevit
    pdf.bold_paragraf("6. Yıldız Ecevit (1946–2021): Türk Romanında Postmodernist Açılımlar")
    pdf.paragraf(
        "'Türk Romanında Postmodernist Açılımlar', 'Kurmaca Bir Dünyadan' ve Oğuz Atay monografisi 'Ben Buradayım' "
        "ile Türk edebiyatındaki avangard ve postmodernist kırılmanın haritasını çıkarmıştır. Üstkurmaca, metinlerarasılık, "
        "parodi ve çoğulculuk tekniklerinin Türk romancılığında (Ahmet Hamdi Tanpınar, Oğuz Atay, Bilge Karasu, "
        "Orhan Pamuk, Latife Tekin) nasıl geliştiğini kuramsallaştırmıştır."
    )

    # 7. Orhan Pamuk
    pdf.bold_paragraf("7. Orhan Pamuk (1952–): Saf ve Düşünceli Romancı")
    pdf.paragraf(
        "Harvard Üniversitesi'nde verdiği Charles Eliot Norton derslerinden oluşan 'Saf ve Düşünceli Romancı' "
        "kitabıyla Schiller'in 'naif ve sentimental' ayrımını roman kuramına uyarlamıştır. Pamuk'a göre roman "
        "yazmak ve okumak; dünyanın doğallığına inanan saf (naif) zihin ile metnin kurmaca yapısını, tekniğini "
        "ve gizli merkezini sürekli hesaplayan düşünceli (sentimental) zihnin eşzamanlı çalışmasıdır. Romanın "
        "merkezindeki 'manzara' ve görsel düşünme süreçleri üzerine derinlikli bir yazar poetikası sunar."
    )

    pdf.alt_alt_bolum("Türkçe Bağlamda Temel Kavramlar")
    pdf.kavram_tanimi(
        "Mazi-Hâl Sürekliliği (Tanpınar)",
        "Geçmişin yok edilmesi gereken bir yük değil, şimdiki zamanın içinde yaşayan ve geleceği besleyen "
        "canlı bir organik akış (durée) olduğu fikridir."
    )
    pdf.kavram_tanimi(
        "Çoğulcu Eleştiri Yöntemi (Berna Moran)",
        "Metni tek bir kuramın şablonuna hapsetmek yerine; biçimsel, tarihsel, sosyolojik ve psikolojik "
        "araçları metnin kendi doğasına göre bir arada kullanan esnek eleştiri tarzıdır."
    )
    pdf.kavram_tanimi(
        "Epistemolojik Kriz ve Babasızlık (Jale Parla)",
        "Tanzimat aydınının geleneksel kutsal metinlerin ve mutlak baba otoritesinin çöküşüyle yaşadığı "
        "bilgi, ahlak ve kimlik boşluğudur."
    )
    pdf.kavram_tanimi(
        "Kültürel Yarılma ve Mağduriyet (Nurdan Gürbilek)",
        "Türkiye'de edebiyatın Batı karşısında duyulan aşağılık kompleksi ile yerli gurur arasında salınan "
        "yaralı bir öznellikten doğması durumudur."
    )
    pdf.kavram_tanimi(
        "Anlatı Yerlemleri (Tahsin Yücel)",
        "Anlatıdaki kişilerin, nesnelerin ve mekânların aldıkları anlamsal konumlar ve aralarındaki karşıtlık "
        "ilişkileridir."
    )
    pdf.kavram_tanimi(
        "Üstkurmaca Oyunu (Yıldız Ecevit)",
        "Yazarın kurmacanın yapaylığını gizlemeyip, kurgu sürecini romanın bir olayına dönüştürerek okuru "
        "oyuna ortak etmesidir."
    )
    pdf.kavram_tanimi(
        "Saf ve Düşünceli Zihin (Orhan Pamuk)",
        "Romancının hem kendiliğinden akan hayatın büyüsüne kapılması hem de metnin mimarisini santim santim "
        "denetleyen bir teknisyen olması gerilimidir."
    )

    # Tablo: Kuramcılar Özeti
    pdf.alt_alt_bolum("Türk Kuramcılar ve Odak Alanları")
    tablo_headers = ["Kuramcı", "Temel Eseri", "Anahtar Kavramı", "Edebi Odağı"]
    tablo_rows = [
        ["A.H. Tanpınar", "Huzur / Edebiyat Üzerine Makaleler", "Mazi-Hâl Sürekliliği, Rüya", "Zaman, Kimlik, Doğu-Batı"],
        ["Berna Moran", "Türk Romanına Eleştirel Bir Bakış", "Çoğulcu Eleştiri, Yanlış Batılılaşma", "Metin İçi Yapı ve Sosyoloji"],
        ["Jale Parla", "Babalar ve Oğullar / Don Kişot'tan Bugüne", "Epistemolojik Kriz, Babasızlık", "Romanın Felsefi Temelleri"],
        ["Nurdan Gürbilek", "Kör Ayna Kayıp Şark / Vitrinde Yaşamak", "Kırılgan Benlik, Taşra, Mağduriyet", "Psikanaliz ve Kültürel Eleştiri"],
        ["Tahsin Yücel", "Anlatı Yerlemleri / Yapısalcılık", "Göstergebilim, Aktan Modeli", "Biçim ve Anlambilim"],
        ["Yıldız Ecevit", "Türk Romanında Postmodernist Açılımlar", "Üstkurmaca, Oyun, Metinlerarasılık", "Postmodernizm ve Avangard"],
        ["Orhan Pamuk", "Saf ve Düşünceli Romancı", "Saf/Düşünceli Zihin, Görsel Merkez", "Roman Sanatı ve Poetikası"]
    ]
    pdf.tablo_basit(tablo_headers, tablo_rows, [35, 60, 50, 45])

    pdf.ornek_kutusu(
        "Ahmet Hamdi Tanpınar - Saatleri Ayarlama Enstitüsü",
        "Hayri İrdal ve Halit Ayarcı'nın kurduğu enstitü: Olmayan bir saati ayarlama ve ceza kesme "
        "sistemi üzerinden Doğu ile Batı arasında kalmış bürokrasinin hicvi.",
        "Berna Moran bu romanı 'iki uygarlık arasında bocalayan Türk toplumunun sembolik hicvi' olarak "
        "çözümlerken; Jale Parla Hayri İrdal'ın Halit Ayarcı'da aradığı 'yeni baba' figürünü epistemolojik bir "
        "çaresizlik olarak okur. Nurdan Gürbilek ise Hayri İrdal'ın acınası 'küçük adam' gururundaki yaralı "
        "öznelliği deşer. Üç büyük Türk kuramcısının aynı metinde buluşması yerel kuramın zenginliğidir."
    )

    pdf.etkinlik_kutusu(
        "Türk Kuramcılarının Merceğinden Yazma",
        [
            "Jale Parla'nın 'Babasızlık ve Epistemolojik Kriz' kavramını temel alarak, ailesinin geçmişine dair sırları arayan ama hiçbir güvenilir belge bulamayan genç bir karakterin iç çatışmasını yazın.",
            "Nurdan Gürbilek'in 'Taşra ve Yaralı Gurur' analizinden esinlenerek, büyük şehre gelip bir sanat ortamına giren kasabalı bir gencin yaşadığı hayranlık ve öfke nöbetini kurgulayın."
        ]
    )

    pdf.tartisma_sorulari([
        "Türk edebiyat kuramı Batı'dan bağımsız, bütünüyle yerli bir kuramsal paradigma üretebilmiş midir?",
        "Tanpınar'ın 'mazi-hâl sürekliliği' tezi günümüzün hızlı dijital tüketim çağında hâlâ geçerli bir estetik sığınak olabilir mi?"
    ])

    # ═════════════════════════════════════════════════════════════════════════
    # BÖLÜM ÖZETİ
    # ═════════════════════════════════════════════════════════════════════════
    pdf.bolum_ozeti([
        "2000–2026 dönemi, edebiyat kuramının saf metin merkezcilikten bedene, duyguya, ekolojiye, teknolojiye ve küresel dolaşıma doğru genişlediği bir dönemdir.",
        "Bilişsel poetika, okumanın beyindeki simülasyon ve zihin kuramı mekanizmalarını inceleyerek edebiyatın biyolojik temellerini açığa çıkarır.",
        "Duygulanım kuramı, dilden önce gelen bedensel rezonansları ve nesneler arasında dolaşan yapışkan duyguları edebi atmosferin merkezine yerleştirir.",
        "Ekoeleştiri ve Antroposen kuramları, insan merkezciliği yıkarak edebiyatı yavaş şiddet, iklim krizi ve insan dışı varlıkların failliğiyle buluşturur.",
        "Posthümanizm ve yeni materyalizm, insan ayrıcalığını reddederek siborgları, canlı maddeyi ve hayvan öznelliğini anlatının eşit aktörleri kılar.",
        "Travma ve bellek çalışmaları, temsil edilemeyen felaketlerin metindeki suskunluklarını, ertelenmiş anlamlarını ve kuşaklararası post-bellek bağlarını deşer.",
        "Postkritik, paranoyak şüpheciliğin yerine metinle onarıcı, estetik ve duygusal ortaklıklar kuran yüzey okumasını önerir.",
        "Dünya edebiyatı ve çeviri kuramı, metinlerin küresel eşitsizlikler içinde nasıl dolaşıma girdiğini ve çevrilemezlik direncini tartışır.",
        "Dijital beşeri bilimler ve hesaplamalı edebiyat, büyük veri ve uzaktan okuma yöntemleriyle kanon dışı binlerce eseri ve gizli kalıpları haritalandırır.",
        "Yapay zekâ ve üretken dil modelleri, yazar kastını, orijinalliği ve telifi sorgulatarak hesaplamalı anlatıbilim ve siborg yazarlık çağını başlatmıştır.",
        "Metamodernizm, postmodern alaycılığı aşarak ironi ile yeni içtenlik arasında salınan savunmasız ve sahici bir duyarlık üretir.",
        "Otokurgu ve otokuram, yazarın kendi bedenini ve mahrem yaşantılarını kurmacanın ve felsefi teorinin bir laboratuvarına dönüştürür.",
        "Spekülatif kurgu ve Afrofütürizm, gelecek tahayyülünü Batı tekelinden kurtararak Küresel Güney'in ve ezilenlerin hafızasıyla yeniden yazar.",
        "Engellilik çalışmaları ve kesişimsellik, sağlam-beden normativitesini sorgular; sakatlığın anlatı protezi olarak sömürülmesini engeller.",
        "Oyun ve transmedya kuramları, okuru pasif alıcıdan ergodik bir oyuncuya ve katılımcı hayran kurgusu üreticisine dönüştürür.",
        "Türkçe bağlamda kuram; Tanpınar, Moran, Parla, Gürbilek, Yücel, Ecevit ve Pamuk gibi düşünürlerle gecikmiş modernleşme, Doğu-Batı yarılması, epistemolojik kriz ve taşra hallerini açıklayan son derece özgün bir yerel alet çantası sunmuştur."
    ])
