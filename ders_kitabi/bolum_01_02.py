# -*- coding: utf-8 -*-
"""
Yazarlar İçin Edebiyat Kuramı Ders Kitabı
Bölüm 1: Kuram Nedir?
Bölüm 2: Kuramın Kısa Tarihi
"""


def yaz(pdf):
    # =========================================================================
    # BÖLÜM 1: KURAM NEDİR?
    # =========================================================================
    pdf.bolum_basligi(1, "Kuram Nedir?")

    # -------------------------------------------------------------------------
    # 1.1 Tanım: Edebiyat Kuramına Giriş
    # -------------------------------------------------------------------------
    pdf.alt_bolum("Tanım: Edebiyat Kuramına Giriş")

    pdf.paragraf(
        "Yazarlık yolculuğuna çıkan hemen her hevesli kalemin zihninde benzer bir "
        "önyargı pusuda bekler: 'Edebiyat ilhamla, saf duyguyla, kalpten kopup gelen "
        "coşkuyla yapılır; kuram ise bu canlı organizmayı masaya yatırıp parçalayan, "
        "soğuk ve akademik bir otopsi aletidir.' Oysa edebiyat kuramı sanatı "
        "öldüren bir canavar değil, tam aksine metnin görünmeyen damarlarında "
        "dolaşan kanı, dilin gizli kaldıraçlarını ve anlatının iç mantığını görmemizi "
        "sağlayan güçlü bir aydınlatma feneridir."
    )

    pdf.paragraf(
        "Kelime kökeni olarak 'kuram' (Türkçede kurmak fiilinden türetilmiştir), Batı "
        "dillerindeki karşılığı olan 'teori' (Yunanca 'theoria') sözcüğüne dayanır. "
        "Antik Yunancada theoria; 'dikkatle bakmak', 'seyretmek', 'temaşa etmek', "
        "'bir olguyu derinlemesine kavramak amacıyla tefekküre dalmak' demektir. "
        "Dolayısıyla kuram, hayatın ve sanatın karmaşasına uzaktan ama keskin bir "
        "dikkatle bakıp onun altındaki düzeni, ilkeleri ve yasaları keşfetme çabasıdır. "
        "Edebiyat kuramı ise en yalın tanımıyla: 'Edebiyat nedir?', 'Bir metin nasıl "
        "anlam üretir?', 'Yazar, metin, dünya ve okur arasındaki görünmez bağlar "
        "nasıl çalışır?' sorularına sistemli, tutarlı ve kavramsal cevaplar arayan "
        "düşünce disiplinidir."
    )

    pdf.paragraf(
        "Kuramın ne olduğunu daha iyi kavrayabilmek için edebiyat kuramcılarının "
        "sıklıkla başvurduğu üç temel gündelik analojiye yakından bakalım:"
    )

    pdf.madde_listesi([
        "Gözlük Analojisi: Çıplak gözle dünyaya baktığınızda nesnelerin sadece dış "
        "yüzeyini görürsünüz. Yeşil camlı bir güneş gözlüğü taktığınızda doğadaki "
        "kontrastlar belirginleşir; kızılötesi bir termal gözlük taktığınızda ise "
        "karanlıkta saklanan ısı kaynaklarını fark edersiniz. Her edebiyat kuramı "
        "farklı bir mercektir. Marksist kuram gözlüğüyle baktığınızda metindeki "
        "sınıfsal çatışmaları; psikanalitik kuram gözlüğüyle baktığınızda karakterlerin "
        "bastırılmış bilinçdışı arzularını; biçimci gözlükle baktığınızda ise "
        "cümlelerin ritmini ve kelime oyunlarını görürsünüz. Hiçbir gözlük dünyanın "
        "tamamını tek başına tüketemez, ancak her biri varlığın farklı bir katmanını "
        "görünür kılar.",

        "Harita Analojisi: Bilmediğiniz devasa bir kente ilk kez adım attığınızda, "
        "dar sokaklarda kaybolabilir, çıkmaz yollara sapabilirsiniz. Harita kentin "
        "bizzat kendisi değildir; haritanın üzerinde yürüyemez ya da bir haritayı "
        "koklayamazsınız. Fakat haritayı açtığınız an, bulunduğunuz sokağın hangi "
        "ana caddeye bağlandığını, kentin nehirle nasıl bölündüğünü ve hangi tepelerin "
        "arkasında yeni yerleşimlerin olduğunu yukarıdan bir bakışla anlarsınız. "
        "Kuram, edebiyat arazisinin haritasıdır; yazara ve okura nerede durduğunu "
        "ve hangi yöne gidebileceğini gösterir.",

        "Röntgen Aygıtı Analojisi: Bir insan bedenine dışarıdan baktığınızda "
        "tenin rengini, giysilerin zarafetini, saçın biçimini görürsünüz. Röntgen "
        "filmi ise bu estetik yüzeyin altındaki iskeleti, çatlakları, eklem "
        "noktalarını ve yük taşıyan kemikleri açığa çıkarır. Bir romanın akıcı dili, "
        "heyecanlı olay örgüsü ve büyüleyici betimlemeleri tenidir; edebiyat "
        "kuramı ise o romanın taşıyıcı kolonlarını, çatışma akslarını ve ideolojik "
        "omurgasını ortaya koyan röntgen aygıtıdır."
    ])

    pdf.bilgi_kutusu(
        "Kuramın Kökeni: Theoria",
        "Eski Yunan'da 'theoros', başka bir kente ya da kutsal bir şölene resmi gözlemci "
        "olarak gönderilen elçiye verilirdi. Theoros olayların içine karışmaz, tarafsız "
        "bir dikkatle seyreder, olup biteni anlamlandırır ve kentine dönüp rapor ederdi. "
        "Kuramcı da edebiyatın bayramını ve trajedisini tarafsız bir kavrayışla temaşa "
        "eden zihinsel elçidir."
    )

    # 1.1.1 Kavram Kargaşasını Gidermek
    pdf.alt_alt_bolum("Kavram Kargaşasını Gidermek: Terimlerin Sınırları")

    pdf.paragraf(
        "Edebiyat sohbetlerinde, atölyelerde ve eleştiri yazılarında en sık düşülen "
        "tuzak, birbirine yakın duran kavramların birbirinin yerine gelişigüzel "
        "kullanılmasıdır. Bir yazar adayı için bu terimlerin sınırlarını bilmek, "
        "marangozun keski ile rende arasındaki farkı bilmesi kadar hayatidir. "
        "Şimdi bu sekiz temel kavramı netleştirelim:"
    )

    pdf.kavram_tanimi(
        "Kuram (Teori)",
        "Edebiyatın doğasını, işlevini, anlam üretme yasalarını ve metin-toplum-birey "
        "ilişkilerini açıklayan evrensel, kapsayıcı, sistematik ve soyut modeller "
        "bütünüdür (Örn: Yapısalcılık, Marksist Edebiyat Kuramı, Psikanalitik Kuram)."
    )

    pdf.kavram_tanimi(
        "Eleştiri (Kritik)",
        "Belli bir tekil eseri, yazarı veya dönemi kuramsal ölçütler ve çözümleme "
        "araçlarıyla inceleme, yorumlama, estetik ve anlamsal değerini tartma "
        "pratiğidir. Kuram bir alet çantası ise, eleştiri o aletler kullanılarak "
        "somut bir bina üzerinde yapılan inceleme ve restorasyon çalışmasıdır."
    )

    pdf.kavram_tanimi(
        "Poetika (Şiir Sanatı)",
        "Bir yazarın ya da dönemin kendi edebi yaratım ilkelerini, güzellik "
        "anlayışını ve zanaat kurallarını formüle ettiği iç tüzüktür. Aristoteles'in "
        "Poetika'sından Tanpınar'ın 'Antalyalı Genç Kıza Mektup'una, Valéry'den "
        "Edip Cansever'in 'Şiiri Şiirle Ölçmek' metinlerine kadar her poetika, "
        "yazarın kendi yazı mutfağının manifestosudur."
    )

    pdf.kavram_tanimi(
        "Yöntem (Metodoloji)",
        "Bir edebi metni çözümlerken ya da üretirken adım adım izlenen dizgesel, "
        "tekrarlanabilir araştırma prosedürüdür. Örneğin Vladimir Propp'un masallardaki "
        "31 işlevi tespit etme adımları veya Gérard Genette'in anlatı zamanını "
        "(düzen, süre, sıklık) inceleme yöntemi birer metodolojidir."
    )

    pdf.kavram_tanimi(
        "Okul / Akım",
        "Tarihsel olarak belirli bir zaman diliminde, ortak bir felsefi, estetik ya da "
        "siyasal dünya görüşü etrafında toplanan yazarların oluşturduğu harekettir "
        "(Örn: Romantizm, Realizm, Sürrealizm, Türk edebiyatında Garip veya İkinci Yeni)."
    )

    pdf.kavram_tanimi(
        "Kavram (Konsept)",
        "Bir kuramın ya da düşünce sisteminin temel yapı taşı olan soyut zihinsel "
        "birimdir. Tek bir anahtar kelimeyle geniş bir mekanizmayı özetler (Örn: "
        "Şklovski'nin 'alışkanlıktan çıkarma'sı, Bahtin'in 'karnaval'ı, Derrida'nın "
        "'yapısöküm'ü)."
    )

    pdf.kavram_tanimi(
        "Estetik",
        "Güzelliğin, yüceliğin, sanatın doğasını ve insanın duyusal algılama "
        "(aisthesis) süreçlerini felsefi düzeyde soruşturan temel felsefe dalıdır."
    )

    pdf.kavram_tanimi(
        "Edebiyat Tarihi",
        "Edebi metinleri, yazarları, akımları ve edebi kurumları kronolojik bir akış "
        "ve neden-sonuç zinciri içinde, olgusal belgelere dayanarak kaydeden bilim dalıdır."
    )

    pdf.bos_satir(1)

    pdf.tablo_basit(
        ["Terim", "Odak Noktası", "Açıklayıcı Soru ve Örnek"],
        [
            [
                "Kuram",
                "Evrensel mekanizmalar ve soyut modeller",
                "'Edebi metin anlamı nasıl üretir?' (Örn: Yapısalcılık, Postkolonyalizm)"
            ],
            [
                "Eleştiri",
                "Somut eserin çözümlenmesi ve değerlendirilmesi",
                "'Saatleri Ayarlama Enstitüsü'nde Doğu-Batı çatışması nasıl işlenmiştir?'"
            ],
            [
                "Poetika",
                "Yazarın kendi zanaat ve yaratım ilkeleri",
                "'Ben şiirimi hangi ritim, imge ve dize mantığıyla inşa ediyorum?'"
            ],
            [
                "Yöntem",
                "Uygulanan somut çözümleme basamakları",
                "'Metindeki anlatı zamanı sıçramalarını kronolojik cetvelle nasıl çıkarırım?'"
            ],
            [
                "Okul / Akım",
                "Dönemsel ve kolektif estetik hareket",
                "'Garipçiler şiirde vezin ve kafiyeyi neden bütünüyle reddetti?'"
            ],
            [
                "Kavram",
                "Kuramın anahtar düşünce birimi",
                "'Mimesis', 'Metinlerarasılık', 'Yabancılaştırma', 'Polifoni'"
            ],
            [
                "Estetik",
                "Güzellik ve sanat felsefesi",
                "'Trajik olan ile komik olan arasındaki duyusal sınır nedir?'"
            ],
            [
                "Edebiyat Tarihi",
                "Kronolojik gelişim ve olgusal arşiv",
                "'Tanzimat'tan Cumhuriyet'e Türk romanında köylü tipi nasıl değişti?'"
            ]
        ],
        [32, 48, 110]
    )

    # 1.1.2 Betimleyici ve Kural Koyucu Kuramlar
    pdf.alt_alt_bolum("Betimleyici ve Kural Koyucu Kuramlar")

    pdf.paragraf(
        "Edebiyat kuramları tarih boyunca benimsedikleri tavır ve amaç bakımından iki "
        "büyük kampa ayrılır: Kural koyucu (preskriptif / normatif) kuramlar ve "
        "betimleyici (deskriptif) kuramlar. Bu ayrımı anlamak, yazarın kuramla "
        "kuracağı ilişkinin özgürleştirici mi yoksa kısıtlayıcı mı olacağını belirler."
    )

    pdf.bold_paragraf("1. Kural Koyucu (Preskriptif / Normatif) Kuramlar:")
    pdf.paragraf(
        "Bu yaklaşım edebiyatın 'nasıl olması gerektiğini' buyurur. Yazara kurallar, "
        "sınırlar, yasaklar ve şablonlar dayatır. Bu kurallara uymayan eserleri kusurlu, "
        "ahlaksız ya da 'sanat dışı' ilan eder. Örneğin Antik Çağ ve Klasisizm döneminde "
        "tragedyada 'üç birlik kuralı' (zaman, mekân, olay birliği) katı bir zorunluluktu; "
        "bir oyun tek bir günde, tek bir mekânda ve tek bir olay çizgisiyle geçmek "
        "zorundaydı. Benzer şekilde 1934 Sovyet Yazarlar Birliği Kongresi'nde ilan edilen "
        "Sosyalist Gerçekçilik kuramı; edebiyatın partili olmasını, burjuva çürümesini "
        "yermesini ve mutlaka geleceğe umutla bakan 'olumlu kahraman' (pozitivny geroy) "
        "barındırmasını şart koşmuştu."
    )

    pdf.bold_paragraf("2. Betimleyici (Deskriptif) Kuramlar:")
    pdf.paragraf(
        "Modern edebiyat kuramlarının büyük çoğunluğu betimleyicidir. Bu yaklaşım "
        "edebiyata ahlaki ya da teknik reçeteler yazmaz; 'Edebiyat ne yapmalıdır?' diye "
        "değil, 'Var olan edebi metinler fiilen ne yapıyor ve nasıl işliyor?' diye sorar. "
        "Tıpkı bir botanikçinin ormandaki zehirli bir sarmaşığı ya da nadide bir orkideyi "
        "yargılamadan, yaprak yapısını ve kök sistemini incelemesi gibi; betimleyici "
        "kuramcı da metni yargılamaz, onun dilsel ve yapısal mekanizmalarını çözümler. "
        "Rus Biçimciliği'nin 'edebiyatı edebiyat yapan sır nedir?' sorusu ya da modern "
        "anlatıbilimin anlatıcı tiplerini sınıflandırması tamamen betimleyicidir."
    )

    pdf.ornek_kutusu(
        "Kural Koyucu ve Betimleyici Bakışın Karşılaşması",
        "Metin: James Joyce'un Ulysses romanından Molly Bloom'un iç monoloğu (Noktalama "
        "işareti içermeyen, çağrışımlarla akan 40 küsur sayfalık kesintisiz zihin akışı).\n\n"
        "Kural Koyucu Eleştirmen: 'Bu metin kabul edilemez bir dil anarşisidir. Cümleler "
        "bölünmemiş, gramer kuralları çiğnenmiş, edep sınırları aşılmıştır. Bir roman "
        "okuruna saygı duymalı, mantıklı bir sözdizimi ve ahlaki bir gaye taşımalıdır!'\n\n"
        "Betimleyici Kuramcı: 'Burada yazar, insan bilincinin uyanıklık ile uyku "
        "arasındaki katmanlı yapısını dilde yeniden üretmek için noktalama işaretlerini "
        "bilinçli olarak askıya almıştır. Metin, zihnin çağrışımsal sıçramalarını ve "
        "içsel polifoniyi taklit eden özgün bir 'bilinç akışı' tekniği sergilemektedir.'",
        "Kural koyucu tavır kapıyı kapatırken, betimleyici tavır metnin zanaat sırrını "
        "yazarın ve okurun önüne açar. Çağdaş yazar için kuram, bir ceza kanunu değil, "
        "sonsuz imkânlar sunan bir teknik dağarcıktır."
    )

    # -------------------------------------------------------------------------
    # 1.2 Kuramların Haritası: Beş Yön
    # -------------------------------------------------------------------------
    pdf.alt_bolum("Kuramların Haritası: Beş Yön")

    pdf.paragraf(
        "Amerikalı edebiyat kuramcısı ve eleştirmeni M.H. Abrams, 1953 yılında "
        "yayımlanan çığır açıcı eseri 'Ayna ve Lamba'da (The Mirror and the Lamp), "
        "Batı düşüncesinde edebiyat üzerine geliştirilen tüm kuramları dört temel "
        "kutup etrafında toplayan dahiyane bir koordinat sistemi önerdi. Abrams'a "
        "göre bir edebi olayın var olabilmesi için dört temel unsur şarttır: "
        "DÜNYA (Evren), SANATÇI (Yazar), ESER (Metin) ve DİNLEYİCİ/OKUR. Her kuram bu "
        "dört unsurdan birini merkezine alıp diğerlerini ona göre konumlandırır."
    )

    pdf.paragraf(
        "20. yüzyılın ikinci yarısından itibaren gelişen postyapısalcılık, kültürel "
        "incelemeler ve yayın sosyolojisi, Abrams'ın bu dörtlü modeline iki kritik "
        "boyut daha ekledi: DİL VE İKTİDAR İLİŞKİLERİ ile MADDİ DOLAŞIM KOŞULLARI. "
        "Böylece edebiyatı kavrayabileceğimiz beş temel yön ortaya çıktı:"
    )

    pdf.madde_listesi([
        "1. Dünya Odaklı (Mimetik / Yansıtmacı) Yön: Sanatın merkezine dış dünyayı, "
        "toplumu, tarihi ve doğayı koyar. Eser dünyayı yansıtan bir 'ayna'dır. Temel soru: "
        "'Metin gerçekliği ne kadar doğru, derinlikli ve adil yansıtıyor?' (Platon, "
        "Aristoteles, Klasik Realizm, Lukács ve Ortodoks Marksist kuram).",

        "2. Yazar Odaklı (Anlatımcı / Dışavurumcu) Yön: Sanatın merkezine yaratıcının "
        "öznelliğini, dehasını, iç dünyasını ve bilinçdışını yerleştirir. Eser dış dünyayı "
        "değil, sanatçının ruhunu aydınlatan bir 'lamba'dır. Temel soru: 'Metin yazarın "
        "hangi bastırılmış travmalarını, psikolojik çatışmalarını veya samimi hislerini "
        "dışa vuruyor?' (Romantizm, Biyografik Eleştiri, Psikanalitik Kuram).",

        "3. Metin Odaklı (Nesnel / Biçimci) Yön: Eseri dünyadan, yazardan ve okurdan "
        "özerk, kendi içine kapalı bağımsız bir dil anıtı olarak görür. Temel soru: "
        "'Metnin iç kurgusu, dili, ritmi, simgeleri ve biçimsel düzeni nasıl işliyor?' "
        "(Rus Biçimciliği, Anglo-Amerikan Yeni Eleştirisi, Yapısalcılık, Fransız Anlatıbilimi).",

        "4. Okur Odaklı (Pragmatik / Alımlama) Yön: Eserin anlamının sayfada donup "
        "kalmadığını, ancak bir okurun zihninde canlandığı an üretildiğini savunur. "
        "Temel soru: 'Metin okurda hangi estetik, zihinsel ve duygusal tepkileri "
        "tetikliyor? Okur metindeki boşlukları nasıl dolduruyor?' (Retorik Kuramları, "
        "Iser ve Jauss'un Alımlama Estetiği, Stanley Fish'in Yorumlayıcı Cemaatleri).",

        "5. Dil ve İktidar Odaklı (Kültürel / Postyapısalcı) Yön: Metnin masum bir "
        "dil oyunu olmadığını; ideolojilerin, cinsiyet rollerinin, sömürgeci mirasın "
        "ve iktidar ilişkilerinin dili biçimlendirdiğini öne sürer. Temel soru: 'Metin "
        "hangi hâkim ideolojileri meşrulaştırıyor ya da hangi bastırılmış sesleri "
        "fısıldıyor?' (Foucault, Derrida, Feminist Kuram, Postkolonyalizm, Yeni Tarihselcilik)."
    ])

    pdf.bos_satir(1)

    pdf.tablo_basit(
        ["Yön", "İnceleme Odağı", "Temel Soru", "Örnek Kuramlar"],
        [
            [
                "Dünya",
                "Dış gerçeklik, toplum, tarih, sosyo-ekonomik yapı",
                "'Eser gerçekliği nasıl yansıtır ya da çarpıtır?'",
                "Mimesis, Realizm, Marksizm, Tarihsel Maddecilik"
            ],
            [
                "Yazar",
                "Sanatçının ruhu, dehası, biyografisi, bilinçdışı",
                "'Yazarın iç dünyası esere nasıl sirayet etmiştir?'",
                "Romantizm, Psikanaliz (Freud/Jung), Biyografizm"
            ],
            [
                "Metin",
                "Dil, kurgu, biçim, izlek, retorik araçlar",
                "'Edebi aygıtlar ve biçim nasıl anlam kurar?'",
                "Rus Biçimciliği, Yeni Eleştiri, Yapısalcılık"
            ],
            [
                "Okur",
                "Alımlama süreci, estetik etki, yorum ufkundaki değişim",
                "'Okur metindeki boşlukları nasıl tamamlar?'",
                "Alımlama Estetiği, Okur-Tepki Kuramı, Fenomenoloji"
            ],
            [
                "İktidar/Dil",
                "Söylem, hegemonya, toplumsal cinsiyet, sömürgecilik",
                "'Metin hangi iktidar yapısını pekiştirir/sarsar?'",
                "Postyapısalcılık, Feminizm, Postkolonyalizm, Kültürel İnceleme"
            ]
        ],
        [28, 42, 60, 60]
    )

    # 1.2.1 Somut Bir Örnek: Sait Faik'in "Hişt, Hişt!.." Hikâyesi
    pdf.alt_alt_bolum("Tek Bir Metin, Beş Farklı Bakış: 'Hişt, Hişt!..'")

    pdf.paragraf(
        "Kuramsal yönlerin gücünü anlamanın en berrak yolu, tek bir edebi metni masaya "
        "koyup beş yönün o metne hangi bambaşka sorularla yaklaştığını görmektir. "
        "Türk edebiyatının başyapıtlarından biri olan Sait Faik Abasıyanık'ın "
        "'Hişt, Hişt!..' hikâyesini ele alalım. Hikâyede anlatıcı Burgazada'da "
        "yürürken nereden geldiğini kestiremediği bir 'hişt' sesi duyar; sesin "
        "kaynağını arar (otlar mı, böcekler mi, bahçıvan mı?), bulamaz ve hikâye "
        "o unutulmaz feryatla biter: 'Nereden gelirse gelsin... bir hişt sesi gelmeliydi "
        "de nereden gelirse gelsin!..'"
    )

    pdf.ornek_kutusu(
        "Sait Faik'in 'Hişt, Hişt!..' Hikâyesinde Beş Kuramsal Rota",
        "1. Dünya Odaklı Bakış: 1950'ler İstanbul'unun çeperinde, Burgazada'nın doğasında "
        "ekonomik hayat nasıldır? Bahçıvan papazın oğludur; toprağı kazmakta, ter dökmektedir. "
        "Hikâye, hızla modernleşen Türkiye'de doğa ile insan emeği arasındaki kadim ilişkiyi "
        "ve sınıfsal tecrit edilmişliği yansıtır.\n\n"
        "2. Yazar Odaklı Bakış: Sait Faik bu metni yazdığı dönemde siroz hastalığının pençesindedir "
        "ve ölümün soğuk nefesini ensesinde hissetmektedir. O 'hişt' sesi, yazarın kendi "
        "yalnızlığından, ölüm korkusundan ve hayata tutunma arzusundan kaynaklanan bir "
        "iç ses, yaşama sevincinin psişik feryadıdır.\n\n"
        "3. Metin Odaklı Bakış: Yazar 'hişt' yansıma sözcüğünü (onomatope) bir leitmotif "
        "olarak nasıl kullanmıştır? Anlatıcının iç monoloğundaki soru-cevap ritmi, cümle "
        "uzunluklarının kısalıp uzaması ve doğa tasvirlerindeki sıfat dizilimi metnin "
        "kendi içinde özerk bir müzikalite ve gerilim eğrisi kurmasını sağlar.\n\n"
        "4. Okur Odaklı Bakış: Metin sesin sahibini açıkça söylemez; boşluğu (Leerstelle) "
        "okura bırakır. Okur adada yürüyen anlatıcıyla birlikte meraklanır, tedirgin olur ve "
        "son cümlede kendi varoluşsal yalnızlığıyla yüzleşerek anlatıcıyla derin bir "
        "empati bağı kurar.\n\n"
        "5. İktidar ve Kültürel Bakış: Metinde bahçıvan ile anlatıcı arasındaki sessizlik, "
        "azınlıkların ve ötekileştirilmiş ada sakinlerinin kamusal alandaki dilsel "
        "konumunu düşündürür. 'Hişt', dile gelemeyen, normatif toplum düzeninin dışına "
        "itilmiş tekinsiz ve bastırılmış seslerin sembolik bir çatlağıdır.",
        "Görüldüğü üzere metin aynı metindir; fakat sorulan kuramsal sorular değiştikçe "
        "hikâyenin açtığı anlam dehlizleri muazzam bir zenginliğe kavuşur."
    )

    # -------------------------------------------------------------------------
    # 1.3 Yazar İçin Neden Kuram?
    # -------------------------------------------------------------------------
    pdf.alt_bolum("Yazar İçin Neden Kuram?")

    pdf.paragraf(
        "Pek çok yazar adayı şu samimi soruyu sorar: 'Ben kuramcı ya da akademisyen "
        "olmayacağım; ben roman, öykü ya da senaryo yazmak istiyorum. O halde neden "
        "bunca kuramla, kavramla ve felsefi tartışmayla zihnimi yorayım?' Bu soru son "
        "derece meşrudur. Cevap ise yazarlığın tabiatında gizlidir: Kuram, yaratıcı "
        "yazara pranga vurmak için değil, onu sıradanlıktan ve kör tesadüflerden "
        "kurtarmak için gereklidir. İşte bir yazarın kurama ihtiyaç duymasının beş "
        "temel gerekçesi:"
    )

    pdf.bold_paragraf("1. Okuma Ustalığı ve Derinlik (Metinleri Röntgenlemek):")
    pdf.paragraf(
        "İyi bir yazar, her şeyden önce sıradışı bir okurdur. Kuramsal donanıma sahip "
        "olmayan bir yazar adayı, sevdiği bir romanı okurken sadece 'ne kadar heyecanlı "
        "bir hikâye' duygusuna kapılır; olayın büyüsüne kapılıp sürüklenir. Oysa kuram "
        "bilen bir yazar, metni röntgenler gibi okur: Yazarın olayları hangi sırayla "
        "aktardığını (anakroni), anlatıcının güvenilir olup olmadığını, karakterin "
        "bilinç akışının hangi çağrışım zincirleriyle örüldüğünü ve hangi ideolojik "
        "boşlukların sessizce geçiştirildiğini anında fark eder. Başkalarının nasıl "
        "inşa ettiğini görmeyen, kendisi sağlam bir bina kuramaz."
    )

    pdf.bold_paragraf("2. Bilinçli Tercihler Repertuarı (Zanaat Genişlemesi):")
    pdf.paragraf(
        "Kuramsız yazarlık, elinde sadece çekiç olan bir marangoza benzer; her sorunu "
        "çivi çakarak çözmeye çalışır. Kuram öğrenen yazar ise devasa bir zanaat "
        "alet çantasına kavuşur. 'Bu sahneyi ilahi bakış açısıyla mı yazmalıyım, yoksa "
        "sınırlı üçüncü tekil şahısla mı? Zamanı çizgisel mi akıtmalıyım, yoksa "
        "geçmiş ile şimdiyi iç içe geçiren döngüsel bir zaman kurgusu mu denemeliyim? "
        "Metnimde parodi mi yapıyorum yoksa pastiş mi?' Bu soruların cevabını bilen yazar, "
        "artık sezgilerinin insafına kalmış bir acemi değil; estetik tercihlerini "
        "özgürce ve ustalıkla kullanan bir kurgu mimarıdır."
    )

    pdf.bold_paragraf("3. Kendi Eserine İsim Koyabilme ve Konumlandırma:")
    pdf.paragraf(
        "Bir eseri yazıp bitirdiğinizde dosyanız editörün, yayınevinin veya eleştirmenin "
        "masasına gidecektir. 'Siz ne tür bir metin yazdınız? Eseriniz Türk ve dünya "
        "edebiyatında hangi damarla konuşuyor, hangi geleneğe kafa tutuyor?' soruları "
        "karşısında kekelememek için yazarın kendi metninin poetik koordinatlarını "
        "adlandırabilmesi şarttır. Kendi metninin ne yaptığını kavrayamayan bir yazar, "
        "onu başkalarına da savunamaz."
    )

    pdf.bold_paragraf("4. Klişelerden Kaçınma ve Alışkanlığı Kırma (Yabancılaştırma):")
    pdf.paragraf(
        "Gündelik dil ve popüler kültür, anlatı kalıplarını hızla tüketir ve klişeleştirir. "
        "Aşk hep aynı cümlelerle anlatılır, ölüm hep aynı hüzünlü sıfatlarla betimlenir. "
        "Kuram -özellikle Rus Biçimcileri'nin ortaya koyduğu 'yabancılaştırma' kavramı- "
        "yazara şunu öğretir: Sanatın amacı, alışkanlığın körleştirdiği nesneleri ve "
        "duyguları bize yeniden, ilk kez görüyormuşuz gibi hissettirmektir. Kuram "
        "sayesinde yazar, kendi zihnindeki hazır şablonları fark eder ve onları kırarak "
        "özgün imgeler inşa eder."
    )

    pdf.bold_paragraf("5. Eleştiriyi Doğru Anlama ve Savunma:")
    pdf.paragraf(
        "Kuram bilmeyen yazar, aldığı olumsuz bir eleştiriyi şahsına yapılmış bir "
        "hakaret sanır; küser veya hırçınlaşır. Oysa kuramsal koordinatları tanıyan "
        "yazar, eleştirmenin hangi kuramsal gözlükle konuştuğunu kavrar: 'Bu eleştirmen "
        "benim metnime Ortodoks Marksist bir yansıtmacılıkla yaklaşıyor; oysa ben "
        "postmodern bir parodi yazdım. Eleştirisi benim zayıflığımdan değil, onun "
        "benimsediği kuramsal merceğin bu türe uygun olmamasından kaynaklanıyor.' "
        "Bu bilinç, yazara sarsılmaz bir entelektüel özgüven kazandırır."
    )

    # 1.3.1 Üç Hayati Uyarı
    pdf.alt_alt_bolum("Kuramın Kötüye Kullanımı: Üç Tehlike")

    pdf.uyari_kutusu(
        "Yazar İçin Üç Kuramsal Tuzak:\n\n"
        "1. Şablonculuk (Kuramı Metne Giydirmek): Eseri bağımsız bir kuramın tezini "
        "ispatlama vasıtasına dönüştürmeyin. Bir roman 'Lacan'ın ayna evresi kuramı "
        "doğrudur' demek için yazılmaz. Kuram iskelettir; et, kan ve can ise "
        "hikâyenin bizzat kendisidir. Şabloncu metinler didaktik ve ölü doğar.\n\n"
        "2. Jargon Fetişizmi (Anlaşılmazlık Kibri): Kuramsal kavramları metnin içine "
        "gelişigüzel serperek yapay bir derinlik yanılsaması yaratmayın. Büyük edebiyat, "
        "en karmaşık felsefi açmazları en duru ve sahici dille anlatan edebiyattır.\n\n"
        "3. Sezgiyi Felç Etmek (Yazarken Kuram Düşünmek): Yazma eylemi esnasında "
        "içinizdeki kuramcıyı susturun. Taslak yazılırken sezgiler, coşkular ve "
        "hayal gücü başrolde olmalıdır. Kuramcı şapkanızı masa başına değil, revizyon "
        "(düzelti ve yeniden yazım) aşamasına saklayın."
    )

    # -------------------------------------------------------------------------
    # 1.4 Bu Kitabın Okuma Düzeni
    # -------------------------------------------------------------------------
    pdf.alt_bolum("Bu Kitabın Okuma Düzeni")

    pdf.paragraf(
        "Bu ders kitabı, akademik bir ezber yığını olarak değil; bir yazarın çalışma "
        "masasında her an elinin altında bulunacak modüler bir yol haritası olarak "
        "tasarlanmıştır. Kitap boyunca ele alınacak her edebiyat kuramı, pedagojik "
        "olarak sabit bir yapısal şablon izler:"
    )

    pdf.madde_listesi([
        "1. Kavram Etiketi ve Tanım: Kuramın en yalın, duru ve akılda kalıcı tanımı; "
        "anahtar kavramların sözlük niteliğinde açıklamaları.",
        "2. Tarihsel ve Felsefi Bağlam: Bu kuram hangi çağda, hangi toplumsal krizin ya "
        "da hangi önceki kurama tepki olarak doğdu? Neden o dönemde ortaya çıkmak zorundaydı?",
        "3. Kilit Düşünürler ve Eserleri: Kuramın kurucu isimleri ve edebiyat dünyasını "
        "sarsan temel metinleri.",
        "4. Yazarın Atölyesi (Zanaat Çözümlemesi): Bu kuram bir yazarın elinde hangi somut "
        "anlatı aygıtlarına dönüşür? Kurgu, karakter, zaman ve mekân inşasında nasıl kullanılır?",
        "5. Somut Türkçe Metin Çözümlemesi: Türk edebiyatından seçilmiş kanonik bir şiir, "
        "öykü ya da roman pasajı üzerinde kuramın adım adım uygulanması.",
        "6. Etkinlikler ve Yazma Egzersizleri: Yazar adayının kuramı kendi kaleminde "
        "deneyimlemesini sağlayacak yaratıcı yazarlık alıştırmaları.",
        "7. Tartışma Soruları ve Bölüm Özeti: Zihni kışkırtan felsefi sorular ve bölümün "
        "özet kazanım maddeleri."
    ])

    pdf.bilgi_kutusu(
        "Bu Kitaptan En Yüksek Verimi Nasıl Alırsınız?",
        "Kitabı roman gibi baştan sona hızla okuyup geçmeyin. Her kuram bölümünden sonra "
        "verilen yazma etkinliklerini bizzat masaya oturup yazarak deneyimleyin. Yanınızda "
        "mutlaka bir 'Yazarın Kuram Defteri' bulundurun ve okuduğunuz her kuramın "
        "kendi devam eden projelerinize hangi kapıları açabileceğini not edin."
    )

    # Bölüm 1 Sonu Kutuları
    pdf.etkinlik_kutusu(
        "Bölüm 1 Alıştırmaları",
        [
            "Gözlük Değiştirme Egzersizi: Kendi yazdığınız ya da çok sevdiğiniz 2 sayfalık "
            "kısa bir öyküyü masaya koyun. Önce sadece 'Dünya/Mimetik' gözlüğüyle inceleyip "
            "sosyal gerçekliği nasıl yansıttığını 1 paragrafta yazın; ardından 'Metin/Biçimci' "
            "gözlüğüyle sadece cümle yapılarını ve kelime tekrarlarını analiz edin.",

            "Kavram Ayrıştırma Tablosu: Okuduğunuz son üç kitabın hangi 'akım'a dahil olduğunu, "
            "yazarlarının nasıl bir 'poetika' benimsediğini ve bu kitapları çözümlerken hangi "
            "'kuram'dan yararlanılabileceğini bir sayfalık şemada gösterin.",

            "Kural Bozan Metin Yazımı: Klasik hikâyenin en temel kurallarından birini (örneğin "
            "neden-sonuç zinciri, zamanın ileriye akışı ya da tekil anlatıcı) bilinçli olarak "
            "seçin ve bu kuralı kasıtlı olarak ihlal eden 300 kelimelik deneysel bir pasaj yazın."
        ]
    )

    pdf.tartisma_sorulari([
        "Hiçbir kuramdan haberi olmayan 'saf ve doğal' bir yazar olabilir mi, yoksa her yazar "
        "farkında olmadan içinde yaşadığı çağın hâkim kuramlarını mı uygular?",
        "Edebiyat kuramı metnin büyüsünü ve gizemini bozar mı, yoksa görünmeyen yeni büyü "
        "katmanları mı keşfetmemizi sağlar?",
        "Kural koyucu (preskriptif) kuramların günümüz yaratıcı yazarlık kurslarında "
        "('İlk 10 sayfada kancayı at', 'Kahramanın Sonsuz Yolculuğu şablonuna uy') yeniden "
        "hortladığı söylenebilir mi? Bu durum edebiyatı zenginleştirir mi, tekdüzeleştirir mi?",
        "Bir eserin gerçek anlamını kim belirler: Yazarın niyeti mi, metnin dilsel yapısı mı, "
        "yoksa okurun yorumu mu?"
    ])

    pdf.bolum_ozeti([
        "Kuram, edebiyatı soğuk bir otopsiyle parçalamak değil; metnin görünmeyen anlam "
        "mekanizmalarını aydınlatan bir gözlük, harita ve röntgen aygıtıdır.",
        "Kuram, eleştiri, poetika, yöntem, okul/akım ve kavram terimleri arasındaki "
        "kesin ayrımlar bilinmeden sağlıklı bir edebiyat tartışması yürütülemez.",
        "Kural koyucu kuramlar edebiyata reçete ve yasak dayatırken; betimleyici kuramlar "
        "metinlerin nasıl işlediğini tarafsızca çözümleyerek yazara zengin bir zanaat atlası sunar.",
        "Abrams'ın dört kutuplu haritası (Dünya, Yazar, Metin, Okur) ve buna eklenen dil/iktidar "
        "boyutu, edebiyatı tek bir merceğe hapsolmadan çok boyutlu kavramamızı sağlar.",
        "Yazar için kuram; okuma ustalığı, genişleyen bir teknik repertuar, klişeleri kırma "
        "ve eleştiriyi olgunlukla karşılama gücü veren vazgeçilmez bir özgürleşme alanıdır."
    ])

    pdf.bos_satir(2)

    # =========================================================================
    # BÖLÜM 2: KURAMIN KISA TARİHİ
    # =========================================================================
    pdf.bolum_basligi(2, "Kuramın Kısa Tarihi")

    # -------------------------------------------------------------------------
    # 2.1 Tarihsel Çizelge: Antik Çağ'dan 2026'ya
    # -------------------------------------------------------------------------
    pdf.alt_bolum("Tarihsel Çizelge: Antik Çağ'dan 2026'ya")

    pdf.paragraf(
        "Edebiyat kuramı gökten zembille inmiş soyut bir kurallar manzumesi değildir. "
        "Aksine, insanlığın 2500 yıllık felsefi, siyasi, teknolojik ve toplumsal "
        "çalkantılarına verilmiş tutkulu cevapların toplamıdır. Her çağ kendi krizini "
        "yaşamış, her kriz yeni bir dünya görüşü doğurmuş ve her dünya görüşü de kendi "
        "edebiyat kuramını yaratmıştır. Antik Yunan pazar yerlerinden 2026'nın yapay "
        "zekâ algoritmalarına uzanan bu büyük düşünce nehrini kavramak, bugünün "
        "yazarına hem derin bir tarihsel kök hem de geleceğe bakan sağlam bir vizyon sunar."
    )

    # 1. Antik Çağ
    pdf.alt_alt_bolum("1. Antik Çağ (MÖ 5. Yy - MS 1. Yy): Mimesis ve Sanatın Savunusu")

    pdf.paragraf(
        "Batı edebiyat kuramının temelleri Antik Yunan'da atıldı. Tartışmanın merkezinde "
        "bugün de güncelliğini koruyan tek bir kavram vardı: Mimesis (Taklit / Yansıtma). "
        "Platon, ünlü eseri 'Devlet'in (özellikle 10. Kitap) sayfalarında edebiyata ve "
        "sanata tarihin en sert suçlamasını yöneltti. Platon'un İdealar Dünyası kuramına "
        "göre, asıl ve kusursuz hakikat aşkın idealar âlemindedir. İçinde yaşadığımız maddi "
        "dünya o ideaların kusurlu bir kopyasıdır. Sanatçı ise bu kopyanın da kopyasını "
        "yapan kişidir; dolayısıyla hakikatten üç derece uzaktır. Üstelik şairler akla "
        "değil, kontrolsüz duygulara ve tutkulara hitap ederek yurttaşların dengesini bozar. "
        "Bu gerekçeyle Platon, şairlerin başına defne taçları takılarak ideal siteden "
        "kovulması gerektiğini savundu."
    )

    pdf.paragraf(
        "Platon'un öğrencisi Aristoteles ise hocasının bu suçlamasına tarihin en parlak "
        "savunmasıyla cevap verdi: 'Poetika' (Şiir Sanatı). Aristoteles'e göre mimesis "
        "basit bir papağan taklidi değildir; insan öğrenmesinin ve anlamlandırmasının "
        "en doğal yoludur. Dahası Aristoteles, edebiyatı tarihten daha üstün ve felsefi "
        "ilan etti: Tarihçi olmuş olanı (tekili ve tesadüfi olanı) anlatırken, şair "
        "'olabilir olanı' (evrensel ve zorunlu olanı) anlatır. Aristoteles tragedya türünü "
        "incelerken kilit kavramlar hediye etti: Kahramanın trajik yanılgısı (Hamartia), "
        "talihin tersine dönmesi (Peripeteia), gerçeği fark etme (Anagnorisis) ve izleyicinin "
        "korku ve merhamet duygularıyla arınması (Katharsis). Bu kavramlar bugün Hollywood "
        "senaryo yazımından çağdaş romana kadar tüm kurgusal metinlerin temel yapı taşlarıdır."
    )

    pdf.paragraf(
        "Antik Roma döneminde Horatius 'Ars Poetica'sında sanatın işlevini özetledi: "
        "'Docere et delectare' (Eğitmek ve zevk vermek/eğlendirmek). Sanat hem ruha estetik "
        "haz vermeli hem de insana ahlaki olgunluk kazandırmalıdır. Longinus ise 'Yücelik "
        "Üzerine' (Peri Hypsous) adlı risalesinde kuramın ibresini kurallardan duyguya "
        "çevirdi: Gerçek sanat sadece kurallara uyarak ikna eden değil, okuru coşkuyla "
        "sarsan, vecde getiren ve yücelten sanattır."
    )

    # 2. Orta Çağ ve Rönesans
    pdf.alt_alt_bolum("2. Orta Çağ ve Rönesans (14. - 17. Yy): Alegoriden İnsan Merkezli Yaratıma")

    pdf.paragraf(
        "Orta Çağ boyunca edebiyat kuramı büyük ölçüde teolojinin ve kutsal metin "
        "yorumculuğunun (hermenötik) vesayeti altındaydı. Dante Alighieri, 'İlahi Komedya'yı "
        "açıklarken metinlerin dört katmanlı anlam sistemine sahip olduğunu formüle etti: "
        "1. Harfi (lafzi) anlam, 2. Alegorik anlam (inanç düzeyindeki gizli hakikat), "
        "3. Ahlaki anlam (bireyin ruhsal kurtuluşu), 4. Anagojik/Mistik anlam (ebedi "
        "hakikatler). Edebi metin, hakikatin üstüne örtülmüş kutsal bir tül gibi görüldü."
    )

    pdf.paragraf(
        "Rönesans ile birlikte hümanizm doğdu; düşüncenin merkezine Tanrı'nın yerine "
        "insan yerleşti. İngiltere'de Sir Philip Sidney, 1595'te yayımlanan 'Şiirin "
        "Savunusu'nda (An Apology for Poetry) edebiyata yönelik ahlakçı suçlamaları bir "
        "kez daha görkemli biçimde püskürttü. Sidney'in şu tespiti kuram tarihine altın "
        "harflerle geçti: 'Şair hiçbir şeyi iddia etmez, dolayısıyla asla yalan söylemez. "
        "Çünkü yalan söylemek bir şeyin gerçek olduğunu ileri sürmektir; oysa şair bize "
        "neyin olduğunu değil, neyin olabileceğini hayal ettirir.' 17. yüzyıl Fransız "
        "Klasisizmi ise (Boileau öncülüğünde) aklı, sağduyuyu, ölçülülüğü ve Antik kuralları "
        "katı bir nizam haline getirdi."
    )

    # 3. Aydınlanma ve Romantizm
    pdf.alt_alt_bolum("3. Aydınlanma ve Romantizm (18. Yy Sonu - 19. Yy): Deha ve Özerklik")

    pdf.paragraf(
        "18. yüzyıl sonunda Immanuel Kant, 'Yargı Yetisinin Eleştirisi' (1790) eseriyle "
        "estetiği bağımsız bir felsefe disiplini olarak tescilledi. Kant'a göre sanat "
        "eserinden aldığımız estetik haz, gündelik fayda ya da ahlaki menfaatlerden "
        "bağımsız 'çıkarsız bir beğeni'dir (interesseloses Wohlgefallen). Sanat eseri "
        "'amaçsız bir amaçlılığa' sahiptir; yani kendi içinde kusursuz bir uyum taşır "
        "ama pratik bir alet gibi dışsal bir amaca hizmet etmez. Sanata bu özerkliği veren "
        "ise kuralları doğadan alan yaratıcı 'deha'dır (Genie)."
    )

    pdf.paragraf(
        "Kant'ın açtığı bu kapıdan giren Romantizm dalgası (Wordsworth, Coleridge, Keats, "
        "Shelley, Schlegel kardeşler, Victor Hugo), Klasisizm'in katı kurallarını yerle "
        "bir etti. Wordsworth, 'Lyrical Ballads' önsözünde (1800) şiiri 'güçlü duyguların "
        "kendiliğinden taşması' olarak tanımladı. Şair artık doğayı taklit eden bir kâtip "
        "değil; kendi iç dünyasından yepyeni evrenler doğuran bir peygamber, bir yaratıcı "
        "tanrıdır. Victor Hugo 'Cromwell' önsözünde (1827) Antik Çağ'ın dışladığı 'çirkin'i, "
        "'grotesk'i ve 'kusurlu'yu edebiyatın merkezine taşıyarak modern edebiyatın "
        "kapılarını ardına kadar açtı."
    )

    # 4. Pozitivizm, Marksizm ve Psikanaliz
    pdf.alt_alt_bolum("4. 19. Yüzyıl Sonu: Bilim, İdeoloji ve Bilinçdışı")

    pdf.paragraf(
        "19. yüzyılın ikinci yarısında Sanayi Devrimi ve doğa bilimlerindeki sıçramalar "
        "edebiyat kuramını radikal bir dönüşüme uğrattı. Fransız düşünür Hippolyte Taine, "
        "pozitivist bir yaklaşımla edebiyatın arkasındaki üç nesnel gücü formüle etti: "
        "Irk (genetik miras), Çevre (coğrafi ve toplumsal koşullar) ve An (tarihsel dönem - "
        "la race, le milieu, le moment). Taine'e göre bir yazar incelenirken laboratuvardaki "
        "bir kimyasal bileşik gibi bu üç faktörün bileşkesi olarak ele alınmalıydı."
    )

    pdf.paragraf(
        "Karl Marx ve Friedrich Engels ise edebiyatı toplumsal üretim ilişkileri ve sınıf "
        "mücadeleleri bağlamına oturttu. Marksist kurama göre toplumun ekonomik temeli "
        "(altyapı), hukuki, dini, siyasi ve sanatsal kurumları (üstyapı) belirler. "
        "Edebi eser havada asılı duran soyut bir deha ürünü değil; içinde doğduğu çağın "
        "sınıfsal çatışmalarını ve hâkim ideolojisini taşıyan ya da onu deşifre eden "
        "tarihsel bir belgedir."
    )

    pdf.paragraf(
        "20. yüzyılın eşiğinde Sigmund Freud, psikanaliz kuramıyla edebiyat dünyasında "
        "gerçek bir zihinsel deprem yarattı. İnsan bilincinin sadece bir buzdağının "
        "görünen tepesi olduğunu; asıl belirleyici gücün bastırılmış arzuların, travmaların "
        "ve korkuların kaynadığı 'bilinçdışı' olduğunu gösterdi. Freud, 'Yaratıcı Yazarlar "
        "ve Gündüz Düşleri' (1908) adlı makalesinde yazarın çocukluktaki oyun oynama "
        "arzusunu yetişkinlikte sanat yoluyla sürdürdüğünü savundu. Metindeki karakterler, "
        "imgeler ve simgeler; yazarın bastırılmış çatışmalarının kılık değiştirmiş "
        "(yüceltilmiş) tezahürleridir."
    )

    # 5. Biçimci Devrim
    pdf.alt_alt_bolum("5. 20. Yüzyılın İlk Yarısı: Biçimci Devrim ve 'Metne Dönüş'")

    pdf.paragraf(
        "1910'lardan itibaren edebiyat kuramında devrim niteliğinde bir kopuş yaşandı: "
        "Edebiyatı yazarın psikolojisine, toplumsal tarihe ya da felsefi mesajlara indirgeyen "
        "dışsal yaklaşımlar reddedildi. 'Edebiyatı edebiyat yapan şey nedir?' sorusu "
        "merkeze alındı. Bu hareketin öncüsü Rus Biçimcileri (Viktor Şklovski, Roman "
        "Jakobson, Boris Eikhenbaum) oldu. Roman Jakobson, araştırmalarının konusunun "
        "edebiyat değil, 'yazınsallık' (literariness) -yani bir metni edebi kılan dilsel "
        "nitelikler- olduğunu ilan etti."
    )

    pdf.paragraf(
        "Viktor Şklovski, modern kuramın en parlak kavramlarından birini armağan etti: "
        "'Alışkanlıktan Çıkarma' (Ostranenie / Defamiliarization / Yabancılaştırma). "
        "Gündelik hayatta her şeyi otomatik bir algıyla yaşarız; masaya, ağaca, ölüme "
        "kanar, onları gerçekten görmeyiz. Sanatın görevi, nesnelerin üzerindeki bu "
        "alışkanlık perdesini yırtmak, 'taşı taş gibi hissettirmek' ve dünyaya yabancı "
        "bir gözle bakmamızı sağlamaktır. Rus Biçimcileri ayrıca 'olay örgüsü' (syujet) ile "
        "'kronolojik hammadde' (fabula) arasındaki ayrımı kurarak modern kurgu "
        "kuramının temelini attılar."
    )

    pdf.paragraf(
        "Eşzamanlı olarak Anglo-Amerikan dünyasında Yeni Eleştiri (New Criticism - T.S. Eliot, "
        "I.A. Richards, Cleanth Brooks) egemen oldu. Yeni Eleştiri 'metne yakın okuma' (close "
        "reading) yöntemini geliştirdi ve iki büyük yanılgıyı lanetledi: Yazarın niyetini "
        "aramak olan 'Kasıt Yanılgısı' (Intentional Fallacy) ve eseri okurda uyandırdığı "
        "duygularla ölçmek olan 'Duygusal Yanılgı' (Affective Fallacy). Metin sayfada duran "
        "sözcüklerden ibaretti ve kendi başına incelenmeliydi."
    )

    # 6. Yapısalcılık ve Postyapısalcılık
    pdf.alt_alt_bolum("6. 1960 - 1980'ler: Yapısalcılık ve Postyapısalcı Kırılma")

    pdf.paragraf(
        "1960'larda Ferdinand de Saussure'ün dilbilim teorisi (gösteren ve gösterilen "
        "arasındaki nedensiz ilişki) temel alınarak Yapısalcılık (Structuralism) doğdu. "
        "Claude Lévi-Strauss antropolojide, Roland Barthes kültürde, Gérard Genette ise "
        "anlatıbilimde (narratologie) metinlerin altındaki evrensel grameri ortaya koydu. "
        "Genette anlatı zamanını (anakroniler: geçmişe dönüş ve geleceğe sıçrama), anlatı "
        "sesini ve odaklanmayı cerrahi bir hassasiyetle sınıflandırdı."
    )

    pdf.paragraf(
        "1968 Mayıs olaylarının yarattığı sarsıntıyla birlikte Yapısalcılık kendi içinden "
        "Postyapısalcılığı (Poststructuralism) doğurdu. Roland Barthes 1967 tarihli "
        "ünlü manifestosuyla 'Yazarın Ölümü'nü (La mort de l'auteur) ilan etti: Metni var "
        "eden artık yazarın tanrısal iradesi değil, dilin ve metinlerarasılığın sonsuz "
        "oyunudur; yazar öldüğü an okur doğar. Jacques Derrida ise Yapısöküm (Deconstruction) "
        "yöntemiyle Batı metafiziğinin merkezci yapısını sarstı: Dilde anlam asla bir "
        "yerde sabitlenmez; anlam sürekli ertelenir ve farklılaşır (différance). Metinler "
        "kendi içinde çözülen çatlaklar ve çelişkiler barındırır."
    )

    pdf.paragraf(
        "Michel Foucault ise bilgi ile iktidarın birbirinden ayrılamaz olduğunu kanıtladı. "
        "Dil masum bir iletişim aracı değildir; her çağın kendi 'söylem'i (discourse) vardır "
        "ve delilik, cinsellik, hapishane gibi tüm kurumlar bu söylem yoluyla iktidar üretir. "
        "Foucault'ya göre yazar da ebedi bir dahi değil, modern çağın icat ettiği bir "
        "'yazar işlevi'dir (author-function)."
    )

    # 7. Kültürel Dönemeç
    pdf.alt_alt_bolum("7. 1980 - 2000'ler: Kültürel Dönemeç ve Çoğul Kuramlar")

    pdf.paragraf(
        "1980'lerden itibaren edebiyat kuramı fildişi kulelerden sokağa, kimlik mücadelelerine "
        "ve ezilenlerin sesine yöneldi. Feminist Kuram (Simone de Beauvoir, Virginia Woolf "
        "mirası, Hélène Cixous, Julia Kristeva ve Judith Butler'ın toplumsal cinsiyetin "
        "performatif olduğunu savunan çalışmaları), edebiyat kanonunun eril dilini ve "
        "ataerkil kalıplarını kökten sorguladı."
    )

    pdf.paragraf(
        "Edward Said'in 1978 tarihli 'Oryantalizm' (Şarkiyatçılık) eseriyle Postkolonyal "
        "Kuram sahneye çıktı. Said, Batı edebiyatının Doğu'yu egzotik, tembel, pasif ve "
        "yönetilmeye muhtaç bir 'Öteki' olarak kurguladığını deşifre etti. Gayatri Spivak "
        "('Madun Konuşabilir mi?') ve Homi Bhabha (melezlik ve taklit kavramları) bu alanı "
        "derinleştirdi. Stephen Greenblatt öncülüğündeki Yeni Tarihselcilik ise edebiyat "
        "ile tarihi birbirini besleyen eşdeğer kültürel metinler olarak okudu."
    )

    # 8. 21. Yüzyıl ve 2026 Ufku
    pdf.alt_alt_bolum("8. 21. Yüzyıl ve 2026 Ufku: Ekoloji, Zihin ve Algoritmik Sanat")

    pdf.paragraf(
        "21. yüzyılın ilk çeyreği, edebiyat kuramını insan merkezcilikten çıkaran devasa "
        "krizlerle karşıladı. İklim krizi ve küresel ekolojik felaketler Ekoeleştiri "
        "(Ecocriticism) ve Antroposen edebiyatı kuramlarını doğurdu. Edebiyat artık "
        "sadece insan karakterlerin dramını değil; nehirleri, dağları, nesli tükenen "
        "canlıları ve gezegenin jeolojik belleğini metnin öznesi kılan bir duyarlılıkla "
        "incelenmektedir."
    )

    pdf.paragraf(
        "Bilişsel Anlatıbilim (Cognitive Narratology), beyin araştırmaları ve sinirbilimle "
        "edebiyatı buluşturdu. Okurun bir karakterle empati kurarken beynindeki ayna "
        "nöronların nasıl çalıştığını, metinlerin zihinsel haritaları nasıl inşa ettiğini "
        "somut verilerle araştırmaktadır. Franco Moretti ise dijital teknolojileri "
        "kullanarak binlerce romanı algoritmalarla tarayan 'Uzak Okuma' (Distant Reading) "
        "yöntemini geliştirdi."
    )

    pdf.paragraf(
        "Nihayet 2022-2026 döneminde dünya edebiyatı en radikal sınavıyla yüzleşti: Üretken "
        "Büyük Dil Modelleri ve Yapay Zekâ. Milyarlarca sayfalık edebi külliyatı saniyeler "
        "içinde işleyip kusursuz vezinle şiir yazan, kurmaca üreten algoritmalar; 'Yazar kimdir?', "
        "'İlham ve yaratıcılık insana mı özgüdür?', 'İnsan ile makinenin ortak yazarlığı "
        "(hibrit yaratım) edebiyatı nereye taşır?' sorularını kuramın merkezine yerleştirdi. "
        "Kuram bugün, insan bilincinin en mahrem sığınağı olan yaratıcılığı yeniden "
        "tanımlamanın eşiğindedir."
    )

    pdf.bos_satir(1)

    pdf.tablo_basit(
        ["Dönem", "Kilit Düşünürler", "Temel Edebi Soru / İlke"],
        [
            [
                "Antik Çağ",
                "Platon, Aristoteles, Horatius, Longinus",
                "Mimesis, Katharsis, Trajedinin yapısı, Sanatın ahlaki işlevi"
            ],
            [
                "Orta Çağ / Rönesans",
                "Dante, Philip Sidney, Boileau",
                "Dörtlü alegorik okuma, Şairin savunuşu, Klasik akılcılık"
            ],
            [
                "Romantizm / Aydınlanma",
                "Kant, Hegel, Wordsworth, Victor Hugo",
                "Çıkarsız estetik haz, Deha kültü, Duygunun coşkusu, Grotesk"
            ],
            [
                "19. Yy Sonu",
                "Taine, Marx, Engels, Freud",
                "Tarihsel determinizm, Sınıf ideolojisi, Bilinçdışı ve rüyalar"
            ],
            [
                "Biçimci Devrim (1910-50)",
                "Şklovski, Jakobson, Eliot, Brooks",
                "Yazınsallık, Alışkanlıktan çıkarma, Kasıt yanılgısı, Yakın okuma"
            ],
            [
                "Yapısalcılık & Sonrası",
                "Barthes, Genette, Derrida, Foucault",
                "Yazarın ölümü, Anlatıbilim, Yapısöküm, Bilgi/iktidar söylemi"
            ],
            [
                "Kültürel Dönemeç",
                "Said, Butler, Spivak, Greenblatt",
                "Toplumsal cinsiyet, Oryantalizm, Maduniyet, Yeni tarihselcilik"
            ],
            [
                "21. Yy ve 2026 Ufku",
                "Moretti, Bilişselciler, Ekoeleştirmenler",
                "Ekoeleştiri, Posthümanizm, Uzak okuma, Algoritmik/YZ yazarlık"
            ]
        ],
        [35, 55, 100]
    )

    # -------------------------------------------------------------------------
    # 2.2 'Kuram Öldü Mü?' Tartışması
    # -------------------------------------------------------------------------
    pdf.alt_bolum("'Kuram Öldü Mü?' Tartışması")

    pdf.paragraf(
        "2000'li yılların başında edebiyat ve akademi dünyasını sarsan provokatif bir "
        "çığlık yükseldi: 'Kuram öldü!' Ünlü İngiliz Marksist edebiyat kuramcısı Terry "
        "Eagleton, 2003 yılında yayımladığı 'Kuramdan Sonra' (After Theory) adlı sarsıcı "
        "kitabında, 1960'lardan 1980'lere kadar süren 'büyük kuramlar altın çağının' "
        "(Lacan, Barthes, Foucault, Althusser, Derrida çağı) sona erdiğini ilan etti."
    )

    pdf.paragraf(
        "Eagleton'a göre kuram iki büyük çıkmaza saplanmıştı: Birincisi, üniversite "
        "kampüslerine ve fildişi kulelere hapsolmuş, kendi ürettiği anlaşılmaz jargona "
        "âşık olmuş, yaşayan toplumla bağını koparmıştı. İkincisi ise kültürel "
        "çalışmaların aşırı mikro alanlarına savrulmuştu. Eagleton muzip ve zehirli bir "
        "dille şunu soruyordu: Kuram; aşk, ölüm, ahlak, adalet, trajedi ve devrim gibi "
        "insanlığın can alıcı büyük sorularını tartışmayı bırakıp '1950'ler popüler "
        "çizgi romanlarında kadın giyim kuşamının altmetinleri' gibi mikro ayrıntılarda "
        "boğulurken, dünya küresel savaşlar, sömürü ve ekolojik yıkımlarla sarsılıyordu. "
        "Kuram büyük sorular sormaktan vazgeçtiği için etkisini yitirmişti."
    )

    pdf.paragraf(
        "Peki kuram gerçekten öldü mü? Edebiyat kuramcılarının büyük çoğunluğuna göre "
        "cevap kesin bir 'HAYIR'dır. Ölen şey, kuramın kendisi değil; her şeyi tek bir "
        "formülle açıklayabileceğini iddia eden kaskatı, monolitik ve dogmatik 'Büyük "
        "Sistemler' anlayışıdır. Kuram ölmemiş, aksine kılcal damarlara sızmıştır."
    )

    pdf.paragraf(
        "Günümüzde içinde yaşadığımız 'Post-Teori' (Kuram-Sonrası) çağı, kuramın ortadan "
        "kalktığı değil, çoğulculaştığı, hibritleştiği ve demokratikleştiği bir dönemdir. "
        "Bugün hiçbir çağdaş yazar ya da eleştirmen sadece katı bir biçimci ya da saf bir "
        "yansıtmacı değildir. Aksine, bir yazar masaya oturduğunda hem metninin dilsel "
        "ritmini (biçimcilik) hem karakterinin psikolojik derinliğini (psikanaliz) hem de "
        "toplumsal cinsiyet adaletini (feminizm) aynı anda gözeten esnek, pragmatik ve "
        "zengin bir alet çantası kullanır."
    )

    pdf.bilgi_kutusu(
        "Kuramın Doğallaşması: Suyun İçindeki Balık",
        "Bir düşünce biçimi o kadar benimsenir ve kültürün içine o denli sindirilir ki "
        "artık onun bir kuram olduğunu bile fark etmeyiz. Bugün herhangi bir yazar 'burada "
        "bir ironi var', 'karakterin bastırılmış bir korkusu var' ya da 'metin başka bir "
        "esere gönderme yapıyor' dediğinde, farkında olmadan Yeni Eleştiri'yi, Freud'u "
        "ve Metinlerarasılık kuramını kullanmaktadır. Kuram ölmemiş; soluduğumuz havanın "
        "tabii bir parçası haline gelmiştir."
    )

    pdf.ornek_kutusu(
        "Türk Romanında Paradigma Değişimi: Ahmet Mithat'tan Tanpınar'a",
        "Kuramın tarihsel seyrini Türk edebiyatında görmek çarpıcı bir aydınlanma sağlar:\n\n"
        "1. Kural Koyucu / Yansıtmacı Aşama (Tanzimat): Ahmet Mithat Efendi, 'Felâtun Bey "
        "ile Râkım Efendi'de (1875) okura doğrudan seslenir: 'Ey kaari! Gördün ya alafrangalık "
        "budalalığını...' Anlatıcı kural koyucudur, ahlak öğretmenidir; metin toplumu ıslah "
        "etmek için bir araçtır.\n\n"
        "2. Modernist ve Estetik Kırılma (Cumhuriyet): Ahmet Hamdi Tanpınar, 'Huzur'da (1949) "
        "ve 'Saatleri Ayarlama Enstitüsü'nde (1961) doğrudan vaaz vermez. Bergson'un zaman "
        "felsefesini, Freud'un psikanalizini ve Doğu-Batı çatışmasını ironik bir dil dokusuyla "
        "iç içe geçirir. Anlatıcı artık her şeyi bilen bir vaiz değil; ironinin ve içsel "
        "zamanın labirentlerinde dolaşan modern bir bilinçtir.",
        "Tanzimat'tan Modernizme geçiş, edebiyat kuramının kural koyucu ahlakçılıktan "
        "metin odaklı estetik derinliğe evrilmesinin kusursuz bir kanıtıdır."
    )

    # Bölüm 2 Sonu Kutuları
    pdf.etkinlik_kutusu(
        "Bölüm 2 Alıştırmaları",
        [
            "Tarihsel Dönem Karşılaştırması: Antik Çağ'dan bir düşünürün (örneğin Aristoteles) "
            "ve 20. yüzyıldan bir biçimcinin (örneğin Viktor Şklovski) edebiyat anlayışlarını "
            "karşılaştırın. Her ikisinin de bir cinayet romanına nasıl bakacağını 2'şer "
            "paragrafla kaleme alın.",

            "Eagleton ile Diyalog: Terry Eagleton'ın 'Kuram büyük soruları unuttu' eleştirisine "
            "katılıyor musunuz? Günümüzün bir yazar adayı olarak, sizin yazacağınız romanda "
            "kuramın hangi 'büyük insani yaraya' (ölüm, adalet, yalnızlık, ekoloji) merhem "
            "olabileceğini açıklayan bir manifesto taslağı yazın.",

            "Yapay Zekâ ve Yazarlık Deneyi: Bir yapay zekâ aracına kısa bir öykü yazdırın. "
            "Ardından o öyküyü masaya yatırın: Bu metinde Aristoteles'in katharsisi var mı? "
            "Şklovski'nin 'alışkanlıktan çıkarma'sı başarılmış mı? Yoksa sadece var olan "
            "klişelerin kusursuz bir istatistiksel tekrarı mı? Çözümlemenizi not edin."
        ]
    )

    pdf.tartisma_sorulari([
        "Platon bugün yaşasaydı ve distopya romanlarını ya da sinemadaki bilimkurgu filmlerini "
        "izleseydi, onları da 'hakikatten uzaklaştıran zararlı kopyalar' olarak görüp sitenin "
        "dışına sürer miydi?",
        "Aristoteles'in 2300 yıl önce yazdığı 'Poetika'daki dramatik yapı kuralları, bugün "
        "dijital platform dizilerinde ve çağdaş romanda hâlâ neden bu kadar güçlü biçimde işlemektedir?",
        "Roland Barthes'ın 'Yazarın Ölümü' tezi dijital çağda geçerliliğini koruyor mu? "
        "Sosyal medyada yazarın her an görünür olduğu, biyografisiyle pazarlandığı günümüzde "
        "yazar gerçekten öldü mü, yoksa hiç olmadığı kadar dirildi mi?",
        "Üretken yapay zekânın metin üretebildiği bir dünyada, edebiyatı insanileştiren yegâne "
        "özellik nedir: Acı çekebilme kapasitesi mi, ölümlülük bilinci mi, yoksa kusur yapabilme "
        "özgürlüğü mü?"
    ])

    pdf.bolum_ozeti([
        "Edebiyat kuramı 2500 yıllık bir serüvendir; Platon'un mimesis suçlamasına karşı "
        "Aristoteles'in geliştirdiği 'olabilirlik ve katharsis' savunusuyla temellenmiştir.",
        "Aydınlanma ve Romantizm, sanatı faydacı ahlakçılıktan kurtararak Kant'ın 'özerk estetik' "
        "ve Romantiklerin 'yaratıcı deha' anlayışıyla taçlandırmıştır.",
        "19. yüzyıl sonu ve 20. yüzyıl başında pozitivizm, Marksizm ve psikanaliz edebiyatın "
        "toplumsal ve bilinçdışı köklerini deşifre etmiş; Rus Biçimciliği ise odağı doğrudan "
        "metne ve 'yazınsallık' sorununa çekmiştir.",
        "Yapısalcılık ve Postyapısalcılık dilin egemenliğini ve iktidar ilişkilerini açığa "
        "çıkarırken, Kültürel Dönemeç kimlik, toplumsal cinsiyet ve sömürgecilik karşıtı "
        "sesleri merkeze taşımıştır.",
        "Kuram ölmemiştir; tekçi ve katı dogmalardan sıyrılarak 21. yüzyılda ekoeleştiri, "
        "bilişsel bilimler ve yapay zekâ çağında yazarın en zengin çoğulcu pusulasına dönüşmüştür."
    ])
