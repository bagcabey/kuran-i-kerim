# -*- coding: utf-8 -*-
"""
Yazarlar İçin Edebiyat Kuramı Ders Kitabı
Bölüm 9: Sözlük
Bölüm 10: Kaynakça, Sınırlar ve Güncelleme Notu
"""


def yaz(pdf):
    """Bölüm 9 ve Bölüm 10 içeriklerini PDF nesnesine yazar."""

    # =========================================================================
    # BÖLÜM 9: SÖZLÜK
    # =========================================================================
    pdf.bolum_basligi(9, "Sözlük")

    pdf.paragraf(
        "Edebiyat kuramı ve eleştirisi, soyut felsefi spekülasyonlardan ibaret kapalı bir alan "
        "değildir; tersine bir edebi metnin görünmeyen dikiş izlerini, anlatı stratejilerini, "
        "temsil mekanizmalarını ve ideolojik bilinçdışını görünür kılan incelikli bir analitik "
        "alet çantasıdır. Bir yazar ya da edebiyat araştırmacısı için kuramsal kavramları bilmek, "
        "metinleri ezberlenmiş kalıplara hapsetmek anlamına gelmez; aksine metnin kendi estetik ve "
        "düşünsel olanaklarını derinlemesine keşfetme duyarlılığı kazandırır."
    )

    pdf.paragraf(
        "Bu sözlük, kitabımız boyunca ele alınan temel kuramların, anlatıbilimsel araçların ve "
        "çağdaş felsefi yönelimlerin kilit kavramlarını kapsamlı bir biçimde bir araya getirmektedir. "
        "Kavramlar, Türkçe alfabeye göre sıralanmış olup her maddenin tanımında kavramın özgün dildeki "
        "karşılığı, kavrama öncülük eden kuramcı veya düşünce okulu ve kavramın edebi çözümlemelerde "
        "üstlendiği işlev açıklanmıştır."
    )

    pdf.bilgi_kutusu(
        "Sözlük Nasıl Kullanılmalı?",
        "Bu sözlükteki terimleri mekanik formüller olarak ezberlemek yerine, bir kavramın diğer "
        "kavramlarla kurduğu diyalojik bağı kavramaya çalışınız. Örneğin 'yazarın ölümü' kavramını "
        "'ima edilen yazar' ve 'yazar-işlevi' ile; 'mimesis' kavramını 'simülakr' ve 'üstkurmaca' ile "
        "birlikte düşünmek, edebiyat kuramının tarihsel dönüşümünü bütünlüklü kavramanın en sağlıklı yoludur."
    )

    pdf.bos_satir(1)

    # ─── A ───
    pdf.alt_alt_bolum("── A ──")

    pdf.kavram_tanimi(
        "Abject (İğrenç / Düşük)",
        "Fransız psikanalist ve kuramcı Julia Kristeva'nın 'Korkunun Güçleri' (Pouvoirs de l'horreur, "
        "1980) adlı yapıtında geliştirdiği kavram (Fransızca: l'abject); özne ile nesne arasındaki "
        "sınırların çöktüğü, benliğin temiz kalabilmek adına bedeninden dışarı attığı fakat asla tamamen "
        "kurtulamadığı eşik öğeleri (ceset, dışkı, kusmuk, çürüyen et) tanımlar. Benliği hem dehşete "
        "düşüren hem de tekinsiz bir biçimde büyüleyen abject, toplumsal tabuların ve temiz kimlik "
        "kurgularının kırılganlığını gösterir. Edebiyatta gotik kurgulardan modern beden politikalarına "
        "ve kimlik bunalımlarına kadar pek çok alanda bastırılanın geri dönüşünü anlamada kilit bir araçtır."
    )

    pdf.kavram_tanimi(
        "Açık Yapıt (Opera Aperta)",
        "İtalyan göstergebilimci ve yazar Umberto Eco'nun 1962 tarihli aynı adlı kitabında kuramsallaştırdığı "
        "kavram (İtalyanca: Opera Aperta; İngilizce: Open Work); anlamı tek bir yazar niyetine veya nihai "
        "bir mesaja kilitlenmemiş, okurun yorumlama ve anlam üretme edimine yapısal olarak alan bırakan "
        "metinleri tanımlar. Geleneksel 'kapalı' yapıtlar okuru önceden belirlenmiş tek bir sonuca "
        "yönlendirirken, açık yapıtlar çoklu yorumlama ihtimallerini bilinçli bir estetik strateji olarak "
        "bünyesinde taşır. James Joyce'un kurmacaları, modern şiir ve çağdaş üstkurmacalar açık yapıtın "
        "en yetkin örnekleridir."
    )

    pdf.kavram_tanimi(
        "Aktant (Eyleyen)",
        "Litvanyalı-Fransız göstergebilimci Algirdas Julien Greimas tarafından Vladimir Propp'un masal "
        "morfolojisinden esinlenerek geliştirilen kavram (Fransızca: actant); anlatıdaki psikolojik "
        "karakterlerden ziyade, olay örgüsünün işleyişinde belirli eylemleri ve yapısal rolleri üstlenen "
        "işlevsel birimleri belirtir. Greimas'ın geliştirdiği 'Aktantlar Modeli'nde özne, nesne, gönderici, "
        "alıcı, yardımcı ve engelleyici olmak üzere altı temel rol yer alır. Bu yaklaşım, karakterleri "
        "bireysel mizaçlarından soyutlayarak anlatının motor gücünü oluşturan eylemler ağı içindeki nesnel "
        "yerlerini kavramayı sağlar."
    )

    pdf.kavram_tanimi(
        "Anagnorisis (Tanıma / Aydınlanma)",
        "Antik Yunan filozofu Aristoteles'in 'Poetika'sında tragedyanın doruk anlarını açıklamak için "
        "kullandığı terim (Grekçe: Anagnorisis; İngilizce: Recognition); karakterin derin bir bilgisizlik "
        "veya yanılgı durumundan kesin bir bilgi ve bilinç durumuna geçiş ânını ifade eder. Bu dramatik "
        "aydınlanma, genellikle trajik kahramanın kendi kimliğini, ailesel bağlarını ya da işlediği telafisi "
        "imkânsız hatayı (hamartia) dehşetle fark etmesiyle gerçekleşir. Sofokles'in 'Kral Oidipus'unda "
        "Oidipus'un katilini aradığı kişinin bizzat kendisi olduğunu anladığı sahne, edebiyat tarihinin en "
        "kusursuz anagnorisis örneğidir."
    )

    pdf.kavram_tanimi(
        "Analepsis ve Prolepsis (Geriye Dönüş ve İleriye Sıçrama)",
        "Fransız anlatıbilimci Gérard Genette'in 'Anlatının Söylemi' (Figures III, 1972) adlı yapıtında "
        "geliştirdiği bu ikili terim; anlatının kronolojik olay sırası ile metindeki aktarılış sırası "
        "arasındaki zamansal sapmaları (anakroni) çözümler. Analepsis (İngilizce: flashback), anlatı "
        "şimdisinden önceki bir zamana yapılan geriye dönüşleri adlandırırken; prolepsis (İngilizce: "
        "flashforward), henüz gerçekleşmemiş gelecekteki olayların erkenden aktarılmasını ifade eder. "
        "Bu teknikler, anlatıcının bilgi akışını kontrol ederek gerilim, nostalji, kaçınılmazlık ve trajedi "
        "hissi yaratmasının başlıca kurgusal araçlarıdır."
    )

    pdf.kavram_tanimi(
        "Anlatılmış Monolog (Narrated Monologue)",
        "Karşılaştırmalı edebiyatçı Dorrit Cohn'un 'Şeffaf Zihinler' (Transparent Minds, 1978) kitabında "
        "kuramsallaştırdığı kavram (Almanca: erlebte Rede; Fransızca: monologue narré); bir roman "
        "karakterinin içsel düşüncelerinin, tırnak işareti veya konuşma fiili kullanılmaksızın üçüncü şahıs "
        "geçmiş zaman kipiyle ve karakterin kendi söz dağarcığıyla yansıtılmasıdır. Klasik iç monologdan "
        "farklı olarak burada anlatıcının sesiyle karakterin bilinci kusursuzca kaynaşır; okur hem "
        "karakterin zihinsel akışına tanık olur hem de anlatının mesafeli dokusunu korur. Virginia Woolf "
        "ve Gustave Flaubert romanlarında karakterlerin iç dünyasını yansıtmada sıkça başvurulan temel bir yöntemdir."
    )

    pdf.kavram_tanimi(
        "Aporia (Apori / Çıkmaz)",
        "Antik Yunan retoriğinde 'çıkış yolu bulunamayan geçit' anlamına gelen bu kavram, Jacques Derrida'nın "
        "yapısökümcü (deconstruction) felsefesinde metnin kendi iç mantığı içinde çözülemez bir çelişkiye, "
        "düğüme veya kararsızlık ânına sürüklendiği noktayı tanımlar. Bir metin belirli bir tezi kesin bir "
        "dille savunurken, dipnotlarında, metaforlarında veya sözdizimsel boşluklarında kendi savını baltalayan "
        "karşıt anlamlar üretir ve bu ikilem asla tek bir senteze kavuşturulamaz. Edebi çözümlemede aporia "
        "aramak, metnin yazarının denetiminden kaçan çatlakları ve dilin doğasındaki kayganlığı görünür kılmaktır."
    )

    pdf.kavram_tanimi(
        "Arketip (Archetype)",
        "İsviçreli psikanalist Carl Gustav Jung'un analitik psikolojisinde 'kolektif bilinçdışının kalıtsal "
        "imgeleri' olarak tanımlanan ve edebiyat kuramında Northrop Frye tarafından 'Eleştirinin Anatomisi' "
        "(1957) ile merkezileştirilen kavram; insanlık tarihi boyunca kültürler üstü bir süreklilikle "
        "tekrarlanan evrensel motifleri, sembolleri, karakter tiplerini ve anlatı şablonlarını belirtir. "
        "'Kahramanın Yolculuğu', 'Bilge Yaşlı Adam', 'Büyük Anne', 'Yeniden Doğuş' veya 'Kurban Edilen Masum' "
        "gibi arketipler; edebi metinlerin bireysel muhayyilenin ötesinde ortak insanlık hafızasına nasıl "
        "eklemlendiğini kavramayı sağlar."
    )

    pdf.kavram_tanimi(
        "Aura (Hale / Özgünlük Halesi)",
        "Alman Marksist düşünür ve kültür eleştirmeni Walter Benjamin'in 'Tekniğin Olanaklarıyla Çoğaltılabildiği "
        "Çağda Sanat Yapıtı' (1936) başlıklı çığır açıcı makalesinde ortaya attığı kavram; bir sanat eserinin "
        "özgünlüğünden, tekilliğinden, tarihsel varlığından ve mekânsal köklerinden kaynaklanan 'erişilmezlik "
        "ve kutsallık halesini' ifade eder. Benjamin'e göre matbaa, fotoğraf ve sinema gibi kitlesel çoğaltım "
        "teknolojileri sanat yapıtının aurasını aşındırır; ancak bu kayıp sanatı dinsel bir ritüel nesnesi "
        "olmaktan çıkarıp politik bir mücadele alanına dönüştürme potansiyeli de taşır."
    )

    pdf.kavram_tanimi(
        "Ayna Evresi (Mirror Stage / Stade du miroir)",
        "Fransız psikanalist Jacques Lacan'ın geliştirdiği kurucu psikanalitik kavram; 6 ila 18 aylık bir "
        "bebeğin aynadaki bütünlüklü görüntüsünü tanıyarak kendisiyle özdeşleştiği, ancak bu görüntünün "
        "dışsal bir yanılsamadan ibaret olduğu gelişimsel eşiği tanımlar. Özne, kendi bedensel parçalanmışlığını "
        "dışsal, tersyüz edilmiş ve ideal bir imge üzerinden aşmaya çalışırken 'İmgesel Düzen'e adım atar "
        "ve benliğini temelde bir başkalık/yabancılaşma üzerine kurar. Edebiyat incelemelerinde ayna evresi; "
        "karakterlerin aynalar, portreler, ikizler (doppelgänger) veya kurgusal ötekiler aracılığıyla yaşadığı "
        "benlik yarılmalarını çözümlemede temel bir anahtardır."
    )

    # ─── B ───
    pdf.alt_alt_bolum("── B ──")

    pdf.kavram_tanimi(
        "Beklenti Ufku (Horizont der Erwartung)",
        "Alman kuramcı Hans Robert Jauss'un 'Alımlama Estetiği' (Rezeptionsästhetik) çerçevesinde geliştirdiği "
        "kavram (İngilizce: Horizon of Expectation); belirli bir tarihsel dönemdeki okur kitlesinin edebiyata "
        "dair paylaştığı ön kabulleri, estetik normları, tür kalıplarını ve değer yargılarını ifade eder. "
        "Bir edebiyat yapıtı yayımlandığında mevcut beklenti ufkunu ya doğrular (popüler edebiyat) ya da "
        "bu ufku yıkarak okuru sarsar ve yeni bir algılama biçimi yaratır (avangard edebiyat). Jauss'a göre "
        "bir eserin edebi değeri ve tarihsel etkisi, mevcut beklenti ufku ile eserin getirdiği estetik "
        "yenilik arasındaki mesafeyle ('estetik mesafe') doğrudan ölçülür."
    )

    pdf.kavram_tanimi(
        "Bilinç Akışı (Stream of Consciousness)",
        "İlk olarak psikolog William James tarafından zihinsel deneyimin kesintisiz doğasını betimlemek için "
        "kullanılan, edebiyatta ise Virginia Woolf, James Joyce ve William Faulkner tarafından kusursuzlaştırılan "
        "bu teknik; karakterin düşünce, duygu, çağrışım ve duyusal izlenimlerinin dilbilgisel ve mantıksal "
        "kurallarla denetlenmeden, zihinde belirdiği anlık karmaşasıyla aktarılmasıdır. Mantıksal sıçramalar, "
        "eksiltili cümleler, anıların araya girmesi ve zamansal kırılmalar bu tekniğin belirleyici "
        "özellikleridir. Yazar, aracı anlatıcıyı bütünüyle geri çekerek okuru doğrudan doğruya karakterin "
        "bilinç akıntısının içine fırlatır."
    )

    pdf.kavram_tanimi(
        "Biyoiktidar (Biopower / Biopouvoir)",
        "Fransız filozof Michel Foucault'nun 'Cinselliğin Tarihi' (1976) ve derslerinde geliştirdiği kavram; "
        "modern devletlerin artık yalnızca ölüm ve ceza tehdidiyle değil, yaşamın kendisini, bedeni, sağlığı, "
        "doğurganlığı ve nüfus hareketlerini denetleyip optimize ederek kurduğu iktidar biçimini tanımlar. "
        "Geleneksel egemenin 'öldürme ve yaşamasına izin verme' hakkı, yerini 'yaşatma ve ölüme terk etme' "
        "teknolojilerine bırakmıştır. Edebiyat eleştirisinde biyoiktidar; distopyalarda, beden politikalarında, "
        "salgın anlatılarında ve bireysel bedenlerin tıbbi veya hukuki kurumlarca nasıl disipline edildiğini "
        "inceleyen kurmaca metinlerde merkezi bir kavrayış sunar."
    )

    # ─── Ç ───
    pdf.alt_alt_bolum("── Ç ──")

    pdf.kavram_tanimi(
        "Çokseslilik (Polifoni / Polyphony)",
        "Rus edebiyat bilimci Mihail Bahtin'in 'Dostoyevski Poetikasının Sorunları' (1929) adlı eserinde "
        "geliştirdiği kavram; romanda yazarın kendi ideolojik sesinin karakterlere tahakküm etmediği, "
        "her bir karakterin eşit haklara sahip bağımsız birer bilinç ve ses olarak bir arada var olduğu "
        "anlatı yapısını belirtir. Monolojik (tek sesli) geleneksel romanda anlatıcı tüm karakterleri "
        "nesneleştirip nihai bir hakikate bağlarken, polifonik romanda hakikat karakterlerin çatışan ve "
        "diyalog kuran seslerinin etkileşiminden doğar. Dostoyevski'nin 'Karamazov Kardeşler' veya "
        "'Suç ve Ceza'sı çoksesli romanın edebiyat tarihindeki en yetkin doruklarıdır."
    )

    # ─── D ───
    pdf.alt_alt_bolum("── D ──")

    pdf.kavram_tanimi(
        "Decorum (Uygunluk / Ölçülülük)",
        "Klasik Antik Çağ retoriğinde ve özellikle Horatius'un 'Ars Poetica'sında (Şiir Sanatı) temellenen "
        "bu kuralcı ilke; bir edebi metinde üslup, konu, tür ve karakterin toplumsal konumu arasındaki "
        "mutlak uyum ve ölçülülüğü ifade eder. Örneğin soylu bir kraliyet ailesi yalnızca yüksek ve ağırbaşlı "
        "bir dille tragedyalarda yer alabilirken, sıradan halk veya köylüler yalnızca kaba ve güldürücü bir "
        "dille komedyalarda boy gösterebilirdi. 19. yüzyıl gerçekçiliği ve modernizm, toplumsal sınırları ve "
        "dildeki hiyerarşiyi dayatan decorum ilkesini yıkarak sıradan insanın trajedisini yüksek edebiyatın "
        "merkezine taşımıştır."
    )

    pdf.kavram_tanimi(
        "Différance (Fark ve Erteleme)",
        "Jacques Derrida'nın Saussure'cü dilbilimi kökten dönüştürmek için Fransızca 'farklılaşmak' (différer) "
        "ve 'ertelemek' fiillerini kaynaştırarak türettiği neolojizm; göstergelerin anlamının asla durağan "
        "veya tam bir mevcudiyete (presence) kavuşamadığını, her zaman başka göstergelerle olan farklar ağı "
        "içinde sürekli ötelendiğini belirtir. Yazılı Fransızcada 'difference' (fark) sözcüğüyle aynı telaffuz "
        "edilen ancak 'a' harfiyle yazılarak yalnızca görsel olarak ayırt edilebilen bu terim, ses-merkezciliği "
        "(fonosantrizm) yıkar. Edebiyat incelemelerinde différance, bir metnin nihai tek bir mesaja indirgenemeyeceğini, "
        "anlamın sonsuz bir göstergeler zinciri boyunca aktığını gösterir."
    )

    pdf.kavram_tanimi(
        "Diyalojiklik (Dialogism)",
        "Mihail Bahtin'in dil ve edebiyat felsefesinin merkezinde yer alan kavram; her sözcenin, düşüncenin ve "
        "edebi metnin daha önce söylenmiş sözlerle kaçınılmaz bir ilişki içinde olduğu ve gelecekte gelecek "
        "yanıtlara yöneldiği ilkesini ifade eder. Bahtin'e göre hiçbir sözcük masum, el değmemiş ya da tek bir "
        "kişiye ait değildir; her sözcük tarihsel, sınıfsal ve ideolojik çatışmaların izlerini taşır ve ancak "
        "bir 'öteki' ile kurduğu diyalog sayesinde anlam kazanır. Romanda diyalojiklik; karakterlerin yalnızca "
        "birbirleriyle konuşması değil, metindeki üslupların, türlerin ve dünya görüşlerinin birbirini "
        "sorgulayıp yankılamasıdır."
    )

    pdf.kavram_tanimi(
        "Dominant (Egemen Öğe)",
        "Rus Biçimciliği ekolünden Roman Jakobson'ın kuramlaştırdığı kavram; bir sanat eserinin diğer tüm "
        "unsurlarını yöneten, belirleyen, dönüştüren ve yapısal bütünlüğü sağlayan odak bileşeni ifade eder. "
        "Bir metindeki hiçbir unsur tesadüfi değildir; belirli bir çağda veya türde ritim, olay örgüsü, "
        "kafiye veya dilbilgisel oyunlardan biri 'dominant' hale gelerek diğerlerini kendi mantığına tabi "
        "kılar. Edebiyat tarihi Jakobson'a göre sabit bir evrim çizgisi değil, egemen öğenin sürekli yer "
        "değiştirdiği dinamik bir başkalaşım sürecidir."
    )

    pdf.kavram_tanimi(
        "Dönüm Noktası (Turning Point / Plot Point)",
        "Aristoteles'in 'peripeteia' kavramından türeyerek çağdaş anlatıbilim ve senaryo kuramında "
        "vazgeçilmezleşen bu terim; olay örgüsünün akışını kökten değiştiren, kahramanın hedefine giden "
        "yolda geri dönüşü olmayan yeni bir yönelime girmesini sağlayan kilit olay veya kırılma ânını tanımlar. "
        "Klasik dramatik yapıda genellikle ana çatışmayı başlatan birinci dönüm noktası ile doruk noktasına "
        "(kriz) giden yolu açan ikinci dönüm noktası bulunur. Dönüm noktaları, karakterin eylemleriyle olay "
        "örgüsünün iç dinamiklerinin zorunlu ve inandırıcı bir nedensellikle kesiştiği kavşaklardır."
    )

    pdf.kavram_tanimi(
        "Duygu Yapısı (Structure of Feeling)",
        "İngiliz Marksist kültür kuramcısı Raymond Williams'ın 'Uzun Devrim' (1961) ve 'Marksizm ve Edebiyat' "
        "(1977) yapıtlarında geliştirdiği kavram; belirli bir tarihsel dönemde henüz kurumsallaşmamış, ideolojik "
        "doktrinlere dönüşmemiş fakat toplumun gündelik deneyiminde, duyuşunda ve sezgilerinde hissedilen "
        "canlı anlam kalıplarını tanımlar. Bu yapılar, resmi ideolojinin katılaştığı yerlerde değil, edebiyatın "
        "ve sanatın henüz adlandırılmamış duygusal aralıklarında ilk ifadesini bulur. Dolayısıyla edebi metinler, "
        "bir çağın resmi yasalarının veya istatistiklerinin yakalayamadığı 'tarihsel duyuş tonunu' kavramak için "
        "eşsiz birer belgedir."
    )

    pdf.kavram_tanimi(
        "Duygulanım (Affect)",
        "Baruch Spinoza ve Gilles Deleuze'ün felsefi mirasından esinlenerek Brian Massumi ve çağdaş kuramcılar "
        "tarafından geliştirilen bu terim; öznenin bilinçli olarak adlandırdığı ve toplumsal kodlara tercüme "
        "ettiği 'duygu'dan (emotion) farklı olarak, bedenin maruz kaldığı dil-öncesi, içgüdüsel ve bedensel "
        "yoğunlukları ifade eder. Duygulanım, bir bedenin başka bir bedeni etkileme ya da ondan etkilenme "
        "kapasitesidir; tüylerin ürpermesi, kasların kasılması veya göğüsteki ani bir sıkışma gibi söze "
        "dökülemeyen kinetik enerjileri kapsar. Edebiyat eleştirisinde metnin yalnızca ne 'anlattığı' değil, "
        "okurun bedeninde nasıl bir somatik rezonans yarattığı duygulanım kuramıyla incelenir."
    )

    # ─── E ───
    pdf.alt_alt_bolum("── E ──")

    pdf.kavram_tanimi(
        "Edebîlik (Literariness / Literaturnost)",
        "Rus Biçimcisi Roman Jakobson'ın 1921'de formüle ettiği ve biçimci poetikanın temel amentüsü haline "
        "gelen kavram; 'edebiyat biliminin konusunun edebiyat değil, belirli bir metni edebi bir yapıt kılan "
        "şey, yani edebîlik' olduğu ilkesine dayanır. Edebîlik, metnin felsefi içeriğinde veya yazarın "
        "biyografisinde değil; dildeki sapmalarda, ritmik düzenlemelerde, mecazlarda ve dilin kendi biçimsel "
        "yapısına dikkat çekmesinde aranır. Gündelik iletişim dili pratik bilgi aktarmayı hedeflerken, edebîlik "
        "taşıyan dil kendi sesine, dokusuna ve kurgusuna odaklanarak dili 'yabancılaştırır'."
    )

    pdf.kavram_tanimi(
        "Ekokritik (Ecocriticism / Çevreci Eleştiri)",
        "1990'larda Cheryll Glotfelty, Harold Fromm ve Lawrence Buell öncülüğünde kurumsallaşan bu eleştirel "
        "yaklaşım; edebiyat ile fiziki çevre, doğa ve insan-dışı varlıklar arasındaki karşılıklı ilişkiyi inceler. "
        "İnsan-merkezci (antroposentrik) dünya görüşünü sorgulayan ekokritik; edebiyat metinlerinde doğanın sadece "
        "pasif bir dekor veya insanın ruh halini yansıtan bir ayna mı olduğunu, yoksa kendi failliği olan bir "
        "ekosistem olarak mı temsil edildiğini araştırır. İklim krizi ve türlerin yok oluşu çağında metinlerin "
        "ekolojik etik sorumlulukla nasıl kesiştiğini ortaya koyar."
    )

    pdf.kavram_tanimi(
        "Epifani (Epiphany)",
        "Aslen Hristiyan teolojisinde İsa'nın tanrısallığının kâhinlere görünmesini belirten bu kavram, modern "
        "İrlandalı yazar James Joyce tarafından edebi alana taşınmış ve gündelik, sıradan bir nesne, jest veya "
        "cümlenin aniden parlayarak karakterin zihninde derin bir aydınlanma ve hakikat ifşası yaratması "
        "durumunu tanımlamak için kullanılmıştır. Joyce'un 'Dublinliler'inde sıkça görülen epifani anlarında; "
        "büyük dramatik olaylar değil, kaldırımdaki bir paspas veya uzaktan gelen bir melodi karakterin bütün "
        "hayatını ve kendi acizliğini çıplak bir berraklıkla görmesini sağlar."
    )

    # ─── F ───
    pdf.alt_alt_bolum("── F ──")

    pdf.kavram_tanimi(
        "Fabula ve Syuzhet (Öykü ve Olay Örgüsü)",
        "Viktor Şklovski ve Boris Tomaşevski gibi Rus Biçimcileri tarafından geliştirilen bu temel ayrım; "
        "anlatıdaki olayların kronolojik-nedensel dizilişi (fabula) ile bu olayların yazar tarafından metinde "
        "sanatsal bir etki yaratmak amacıyla kurgulanıp sıraya sokulmuş biçimi (syuzhet) arasındaki farkı açıklar. "
        "Fabula cinayetin işlenişinden katilin yakalanışına kadar hayatın olağan zaman akışıyken; syuzhet "
        "dedektifin cesedi bulmasıyla başlayan, geriye dönüşler ve yanıltmacalarla örülen romanın fiili kurgusudur. "
        "Sanat, olayların kendisinde değil, syuzhet'nin fabulayı nasıl bozup yeniden inşa ettiğinde gizlidir."
    )

    # ─── G ───
    pdf.alt_alt_bolum("── G ──")

    pdf.kavram_tanimi(
        "Gösteren ve Gösterilen (Signifiant / Signifié)",
        "İsviçreli dilbilimci Ferdinand de Saussure'ün 'Genel Dilbilim Dersleri' (1916) yapıtında dilsel "
        "göstergeyi (signe) tanımlamak için ortaya koyduğu ikili kavramdır. Gösteren (signifier), bir sözcüğün "
        "maddi, işitsel veya görsel boyutunu (harfler, ses imgesi) temsil ederken; gösterilen (signified), bu ses "
        "imgesinin zihnimizde uyandırdığı kavramsal anlamdır. Saussure'e göre gösteren ile gösterilen arasındaki "
        "bağ bütünüyle nedensizdir (arbitrary); yani 'köpek' kavramı ile 'k-ö-p-e-k' sesleri arasında doğal hiçbir "
        "zorunluluk yoktur ve anlam yalnızca göstergelerin birbirleriyle olan karşıtlıklarından doğar."
    )

    # ─── H ───
    pdf.alt_alt_bolum("── H ──")

    pdf.kavram_tanimi(
        "Habitus (Yatkınlıklar Bütünü)",
        "Fransız sosyolog Pierre Bourdieu'nün geliştirdiği bu kavram; bireylerin toplumsal sınıf, aile ve eğitim "
        "gibi yapısal koşullar içinde edindikleri, bilinçdışı olarak içselleştirdikleri ve bedenselleştirdikleri "
        "kalıcı düşünme, algılama, beğenme ve eyleme yatkınlıkları matrisidir. Habitus ne tamamen belirlenmiş mekanik "
        "bir kaderdir ne de bütünüyle özgür bir bireysel seçim; toplumsal yapının bedene kazınmış ve doğallaşmış "
        "refleksleridir. Edebi çözümlemede habitus; karakterlerin sofra adabından konuşma aksanına, edebi "
        "beğenilerinden sınıfsal çatışmalar karşısındaki reflekslerine kadar tüm kurmaca davranışların sosyolojik "
        "kökenlerini anlamayı sağlar."
    )

    pdf.kavram_tanimi(
        "Hamartia (Trajik Kusur / Yanılgı)",
        "Aristoteles'in 'Poetika'sında tragedya kahramanının felakete sürüklenmesine yol açan temel unsuru betimlemek "
        "için kullandığı terim (Grekçe: hamartanein - hedefi ıskalamak, yanılmak); ahlaki bir kötülükten ziyade, bilgi "
        "eksikliği, körleşme veya aşırı özgüven (hubris) sebebiyle yapılan trajik bir hata veya hesaplama yanılgısıdır. "
        "Kahraman temelde erdemli ve soylu bir kişidir; ancak işlediği bu ölümcül hata, kaçınılmaz bir sebep-sonuç "
        "zincirini tetikleyerek hem kendisinin hem de çevresindekilerin yıkımına yol açar. Kral Oidipus'un kaderinden "
        "kaçmaya çalışırken bilmeden kendi yazgısını örmesi veya Othello'nun yalanlara kanması hamartia'nın tipik görünümleridir."
    )

    pdf.kavram_tanimi(
        "Hegemonya (Hegemony)",
        "İtalyan Marksist düşünür Antonio Gramsci'nin 'Hapishane Defterleri'nde geliştirdiği kavram; egemen sınıfların "
        "toplum üzerindeki tahakkümlerini yalnızca kaba kuvvet, polis ve yasa zoruyla değil; eğitim, din, medya ve "
        "edebiyat gibi sivil toplum kurumları aracılığıyla ezilen sınıfların 'rızasını' (consent) kazanarak sürdürme "
        "biçimini tanımlar. Hegemonya, egemen sınıfın dünya görüşünü toplumun tamamı için 'doğal, evrensel ve sağduyuya "
        "uygun' tek gerçeklik gibi kabul ettirmesidir. Edebi metinler, hâkim hegemonyanın değerlerini yeniden üreten "
        "ideolojik araçlar olabilecekleri gibi, karşı-hegemonik (counter-hegemonic) alternatif bilinçler üreten direniş "
        "alanları da olabilirler."
    )

    pdf.kavram_tanimi(
        "Hermeneutik Daire (Hermeneutic Circle)",
        "Friedrich Schleiermacher, Wilhelm Dilthey, Martin Heidegger ve Hans-Georg Gadamer tarafından geliştirilen "
        "bu felsefi yorumlama ilkesi; bir metnin bütününü anlamak için tek tek parçalarını kavramak gerektiğini, ancak "
        "parçaları doğru anlayabilmek için de metnin bütününe dair bir kavrayışa sahip olunması gerektiğini savunan dairesel "
        "devinimi tanımlar. Yorumcu metne asla mutlak bir boşlukla yaklaşmaz; her zaman bir 'ön-anlama' (fore-understanding) "
        "ile başlar ve metinle girdikçe ön-varsayımlarını revize ederek daha derin bir kavrayışa ulaşır. Edebiyat eleştirisinde "
        "hermeneutik daire, okuma eyleminin doğrusal bir tüketim değil, metin ile okur arasında sürekli derinleşen diyalektik "
        "bir ufuk kaynaşması olduğunu gösterir."
    )

    pdf.kavram_tanimi(
        "Heteronormatiflik (Heteronormativity)",
        "Michael Warner ve queer kuramcıları tarafından yaygınlaştırılan, Judith Butler'ın cinsiyet felsefesiyle "
        "derinleşen kavram; biyolojik cinsiyet, toplumsal cinsiyet rolleri ve heteroseksüel arzunun birbirinin zorunlu "
        "ve 'doğal' uzantısı olduğunu varsayan, bunun dışındaki tüm cinsel yönelimleri ve cinsiyet kimliklerini sapma veya "
        "marjinal sayan kurumsal ve kültürel düzeni belirtir. Edebiyat eleştirisinde heteronormatiflik analizi; anlatılarda "
        "heteroseksüel evlilik ve arzu kalıplarının nasıl normatif tek gerçeklik olarak inşa edildiğini ve bu normu bozan "
        "çatlakların metinlerde nasıl temsil edildiğini veya susturulduğunu ifşa eder."
    )

    pdf.kavram_tanimi(
        "Hyperobjects (Hiper-nesneler)",
        "Ekolojik felsefeci Timothy Morton'ın 'Hyperobjects: Philosophy and Ecology after the End of the World' (2013) "
        "kitabında ortaya attığı kavram; zamansal ve mekânsal olarak insan algısının ve kavrayış sınırlarının o kadar "
        "ötesine taşan olguları (küresel ısınma, plütonyum atıkları, okyanuslardaki mikroplastikler, biyosfer) tanımlar ki "
        "tek bir bakışta nesneleştirilemezler. Hiper-nesneler 'yapışkandır' (onlardan kaçamayız), 'yerel-olmayandır' ve "
        "'zaman-mekânı bükerler'. Edebiyat kuramında hiper-nesneler; geleneksel gerçekçi romanın dar insan-merkezci olay "
        "örgüsü kalıplarının iklim krizini ve gezegensel ölçeği temsil etmede neden yetersiz kaldığını ve çağdaş kurmacanın "
        "yeni estetik formlara ihtiyaç duyduğunu açıklar."
    )

    # ─── İ ───
    pdf.alt_alt_bolum("── İ ──")

    pdf.kavram_tanimi(
        "İç Monolog (Interior Monologue)",
        "Fransız yazar Édouard Dujardin tarafından bilinçli bir teknik olarak başlatılan ve James Joyce ile dünya edebiyatına "
        "mal olan bu yöntem; bir karakterin söze dökülmemiş, zihninden geçirdiği kesintisiz düşünce silsilesinin birinci şahıs "
        "zamiri ('ben') ve şimdiki zaman kipiyle, tırnak işareti olmaksızın aktarılmasıdır. Anlatılmış monologdan farklı olarak "
        "burada üçüncü şahıs anlatıcının sesi tamamen devreden çıkar ve okur karakterin içsel sesiyle baş başa kalır. Bilinç "
        "akışına öncülük eden bu teknik, karakterin zihinsel mahremiyetini doğrudan ve filtresiz bir sahneye dönüştürür."
    )

    pdf.kavram_tanimi(
        "İdeoloji (Ideology)",
        "Marksist gelenekte Karl Marx tarafından egemen sınıfın çıkarlarını evrensel hakikat gibi sunan 'yanlış bilinç' olarak "
        "kuramlaştırılan, Louis Althusser tarafından ise 'bireylerin gerçek varoluş koşullarıyla kurdukları hayali ilişkinin "
        "temsili' olarak yeniden tanımlanan kavram; dünyayı algılama, anlama ve anlamlandırma biçimlerimizi belirleyen görünmez "
        "inançlar, değerler ve pratikler sistemidir. Althusser'e göre ideoloji bireyleri 'özne' olarak çağırır (interpellation) "
        "ve kendini dil, aile, okul ve sanat yoluyla yeniden üretir. Edebiyat metinleri ideolojinin dışında duran saf estetik "
        "adacıklar değildir; metinler ideolojiyi hem bünyelerinde taşır hem de estetik mesafeleri sayesinde ideolojinin dikiş "
        "izlerini okura görünür kılarlar."
    )

    pdf.kavram_tanimi(
        "İma Edilen Yazar (Implied Author)",
        "Amerikalı edebiyat eleştirmeni Wayne C. Booth'un 'Kurmacanın Retoriği' (The Rhetoric of Fiction, 1961) kitabında edebiyat "
        "dünyasına kazandırdığı kavram; biyografik ve kanlı-canlı gerçek yazardan farklı olarak, metnin tamamından (üslup, ahlaki "
        "tercihler, ton, yapısal seçimler) okurun zihninde beliren 'yazarın metinsel sureti veya ideal ikizi'dir. Gerçek yazar "
        "gündelik hayatında bencil veya zayıf bir birey olabilir; oysa ima edilen yazar, o özgül eserin yaratıcısı olarak metnin "
        "benimsediği estetik ve ahlaki duruşun taşıyıcısıdır. Anlatıcı ise bu ima edilen yazarın hikâyeyi anlatmak için kurguladığı maskedir."
    )

    # ─── J ───
    pdf.alt_alt_bolum("── J ──")

    pdf.kavram_tanimi(
        "Jinokritik (Gynocritics)",
        "Amerikalı feminist kuramcı Elaine Showalter'ın 'Towards a Feminist Poetics' (1979) makalesinde geliştirdiği terim; "
        "kadınların edebi metinlerde erkek yazarlarca nasıl temsil edildiğini inceleyen eleştiriden ayrılarak, doğrudan 'kadınların "
        "ürettiği edebiyatı, kadın yazarlığını ve kadın deneyimini' merkeze alan kuramsal ve eleştirel çerçevedir. Jinokritik; kadın "
        "yazarların metinlerindeki özgül temaları, kadınlık dilini, edebi dostlukları ve erkek egemen kanon tarafından unutturulmuş "
        "kadın edebiyat tarihini gün yüzüne çıkarmayı hedefler. Virginia Woolf, George Eliot veya Sevgi Soysal gibi yazarların metinleri "
        "jinokritik yaklaşımla özgül gelenekleri içinde değerlendirilir."
    )

    # ─── K ───
    pdf.alt_alt_bolum("── K ──")

    pdf.kavram_tanimi(
        "Karnavalesk (Carnivalesque)",
        "Mihail Bahtin'in 'François Rabelais ve Ortaçağ-Rönesans Halk Kültürü' (1965) kitabında kuramlaştırdığı kavram; Orta Çağ "
        "sokak karnavallarında resmi kilise ve feodal hiyerarşinin askıya alındığı, soylularla dilencilerin eşitlendiği, kutsalın alaya "
        "alındığı ve bedensel taşkınlığın yüceltildiği dönüştürücü halk gücünü tanımlar. Karnaval mantığı edebiyata sızdığında "
        "(karnavallaşma); tek sesli dogmalar yıkılır, yüksek ile alçak, kutsal ile dünyevi birbirine karışır ve kahkaha otoriteyi "
        "sarsan yıkıcı bir güce dönüşür. Edebiyatta parodi, grotesk beden imgeleri ve taç giyme/tahttan indirme ritüelleri karnavalesk "
        "ruhun başlıca göstergeleridir."
    )

    pdf.kavram_tanimi(
        "Katharsis (Arınma / Katarsis)",
        "Aristoteles'in 'Poetika'sında tragedyanın nihai amacı olarak tanımladığı psikolojik ve estetik kavram (Grekçe: Katharsis; "
        "İngilizce: Catharsis); seyircide uyandırılan 'acıma' (eleos) ve 'korku' (phobos) duyguları aracılığıyla ruhun bu tür yıkıcı "
        "tutkulardan arınmasını ve dinginliğe kavuşmasını ifade eder. Trajik kahramanın felaketi karşısında seyirci kendi kırılganlığını "
        "hatırlar, yoğun bir duygusal boşalma yaşar ve oyun bittiğinde ahlaki ve zihinsel bir berraklıkla tiyatrodan ayrılır. Modern "
        "kuramda katharsis; bireyin bastırılmış toplumsal gerilimlerinin estetik yolla sağaltılması veya ideolojik olarak yatıştırılması "
        "bağlamında da tartışılmaktadır."
    )

    pdf.kavram_tanimi(
        "Kontrapuntal Okuma (Contrapuntal Reading)",
        "Edward Said'in 'Kültür ve Emperyalizm' (1993) adlı yapıtında müzikteki çok sesli kontrpuan tekniğinden esinlenerek kuramsallaştırdığı "
        "eleştirel okuma yöntemi; bir metni okurken hem metnin anlattığı görünür hikâyeyi hem de metnin sessiz kaldığı veya arka plana ittiği "
        "sömürgeci/emperyal bağlamı aynı anda ve eşzamanlı olarak duyma çabasıdır. Örneğin Jane Austen'ın 'Mansfield Park' romanını okurken "
        "İngiltere'deki pastoral kır malikânesinin zarafetiyle, o zarafeti finanse eden Antigua'daki köle plantasyonlarını birbirinden koparmadan "
        "birlikte düşünmek kontrapuntal bir okumadır. Bu yöntem, Batı edebiyat kanonunun emperyalizmle olan iç içe geçmişliğini deşifre eder."
    )

    pdf.kavram_tanimi(
        "Kronotop (Zaman-Uzam / Chronotope)",
        "Mihail Bahtin'in Einstein'ın izafiyet kuramından esinlenerek edebiyat kuramına uyarladığı kavram (Grekçe: chronos - zaman ve topos - mekân); "
        "edebiyatta zaman ve mekân ilişkilerinin ayrılmaz biçimde kaynaşarak metnin somut olay örgüsünü ve türsel kimliğini inşa eden temel eksenidir. "
        "Bahtin'e göre romanda zaman mekâna siner ve ete kemiğe bürünür; mekân ise zamanın akışıyla renklenir ve anlam kazanır. 'Yol kronotopu' "
        "tesadüfi karşılaşmaları ve toplumsal çeşitliliği mümkün kılarken; 'şato kronotopu' gotik dehşeti, 'taşra kasabası kronotopu' ise döngüsel "
        "çürümeyi kurmaca mekânda somutlaştırır."
    )

    pdf.kavram_tanimi(
        "Kültür Endüstrisi (Kulturindustrie / Culture Industry)",
        "Frankfurt Okulu düşünürleri Theodor Adorno ve Max Horkheimer'ın 'Aydınlanmanın Diyalektiği' (1944) kitabında ortaya attıkları eleştirel "
        "kavram; kapitalist düzende sanat ve kültürün tıpkı fabrikasyon tüketim malları gibi kitlelerin pasifleşmesi, standartlaşması ve oyalanması "
        "amacıyla kâr odaklı üretilip pazarlanmasını tanımlar. Kültür endüstrisi, sanatın eleştirel ve dönüştürücü gücünü ehlileştirerek insanları "
        "standart eğlence reçeteleriyle uyuşturur ve mevcut sosyo-ekonomik sisteme uyumlu hale getirir. Edebiyat bağlamında çok-satar formülleri, "
        "kalıplaşmış türsel şablonlar ve piyasa mantığı kültür endüstrisinin doğrudan uzantılarıdır."
    )

    # ─── M ───
    pdf.alt_alt_bolum("── M ──")

    pdf.kavram_tanimi(
        "Madun (Subaltern)",
        "İlk olarak Antonio Gramsci'nin faşist sansürü aşmak için ezilen sınıfları tanımlamakta kullandığı, daha sonra Gayatri Chakravorty Spivak "
        "ve Madun Çalışmaları Grubu tarafından sömürgecilik-sonrası kuramın merkezine yerleştirilen kavram; egemen toplumsal, sınıfsal ve sömürgeci "
        "hiyerarşilerin en altında yer alan, kurumsal temsil mekanizmalarına ve kendi sesini duyurma kanallarına bütünüyle erişimi engellenmiş kesimleri "
        "ifade eder. Spivak'ın meşhur 'Madun Konuşabilir mi?' (1988) sorusu, madunun adına konuşan aydınların veya sömürgecilerin onu yeniden nesneleştirdiğini "
        "vurgular. Edebiyat eleştirisinde madun kavramı; susturulmuşların, göçmenlerin ve marjinalleştirilmişlerin temsiliyet krizlerini sorgulamada kullanılır."
    )

    pdf.kavram_tanimi(
        "Melezlik (Hybridity)",
        "Sömürgecilik-sonrası kuramcı Homi K. Bhabha'nın 'Kültürün Konumu' (1994) kitabında kuramlaştırdığı kavram; sömürgeci ile sömürgeleştirilen "
        "kültürlerin karşılaşma alanı olan 'üçüncü uzam'da (third space) ortaya çıkan, saf kimlik ve köken iddialarını yerle bir eden geçişken kimlik "
        "durumunu belirtir. Bhabha'ya göre hiçbir kültür saf veya homojen değildir; sömürgeci iktidarın dayattığı normlar sömürgeleştirilen özneler "
        "tarafından taklit edilirken (mimicry) aynı zamanda tahrif edilir ve melezleşerek iktidarın otoritesini içten içe sarsar. Çağdaş edebiyatta "
        "melezlik; göçmen edebiyatında ve çokdilli metinlerde kimliğin sabit değil akışkan bir inşa olduğunu gösterir."
    )

    pdf.kavram_tanimi(
        "Metalepsis (Anlatı Düzeylerinin İhlali)",
        "Gérard Genette'in anlatıbilime kazandırdığı ve çağdaş kurmaca kuramında büyük önem taşıyan bu terim; anlatıdaki farklı ontolojik düzeyler "
        "(örneğin kurguyu anlatan yazar/anlatıcı düzeyi ile hikâyedeki karakterlerin kurgusal dünyası) arasındaki sınırın kural dışı ve şaşırtıcı "
        "biçimde aşılması durumudur. Bir yazarın birdenbire kendi yazdığı romanın içine girip karakteriyle konuşması veya bir karakterin elindeki "
        "kitabın sayfalarını yırtarak anlatıcısına müdahale etmesi metalepsis örneğidir. Üstkurmacanın en gözde oyunlarından biri olan bu teknik; "
        "kurmacanın yapaylığını teşhir eder ve gerçeklik ile kurmaca arasındaki ontolojik eşiği yıkar."
    )

    pdf.kavram_tanimi(
        "Metinlerarasılık (Intertextuality)",
        "Julia Kristeva'nın Mihail Bahtin'in diyalojiklik düşüncesinden esinlenerek 1960'ların sonunda türettiği kavram; hiçbir metnin sıfırdan "
        "ve mutlak bir özgünlükle yaratılamayacağını, her metnin kendinden önceki ve çağdaşı olan diğer metinlerin bir 'mozaik'i, alıntılar ve "
        "göndermeler kavşağı olduğunu belirtir. Roland Barthes ve Gérard Genette tarafından zenginleştirilen bu kuram; edebi üretimin bireysel dehadan "
        "ziyade metinler arasındaki devasa bir kültürel hafıza ağı içinde gerçekleştiğini savunur. Parodi, pastiş, alıntı, anıştırma ve yeniden yazım "
        "metinlerarasılığın somut teknikleridir."
    )

    pdf.kavram_tanimi(
        "Mimesis (Taklit / Temsil / Yeniden Yaratım)",
        "Antik Yunan felsefesinin en köklü kavramlarından biri olan mimesis; Platon tarafından gerçeğin (ideaların) soluk ve yanıltıcı bir kopyası "
        "sayılarak yerilirken, Aristoteles tarafından insanın doğuştan gelen öğrenme ve estetik haz alma yetisi olarak yüceltilmiştir. Aristoteles'e "
        "göre sanatçı doğayı mekanik bir ayna gibi kopyalamaz; insan eylemlerini olasılık ve zorunluluk yasalarına göre dönüştürerek, yani 'olabilecek "
        "olanı' kurmaca yoluyla yeniden yaratarak mimesis gerçekleştirir. Erich Auerbach'ın anıtsal eseri 'Mimesis: Batı Edebiyatında Gerçekliğin Temsili' "
        "(1946), edebiyat tarihini mimesis anlayışının Homeros'tan Virginia Woolf'a uzanan evrimi olarak inceler."
    )

    pdf.kavram_tanimi(
        "Model Okur (Model Reader / Lettore Modello)",
        "Umberto Eco'nun 'Anlatı Ormanlarında Altı Gezinti' ve 'Lector in Fabula' (1979) yapıtlarında ortaya koyduğu kavram; somut ve yaşayan "
        "bireysel okurdan farklı olarak, bir metnin kendi kurgusal stratejileriyle öngördüğü, yönlendirdiği ve işbirliğine davet ettiği 'hipotetik "
        "ve ideal okur tipi'dir. Her metin belirli bir yetkinlik düzeyine sahip bir model okur tasarlar; metindeki ipuçlarını çözen, boşlukları "
        "dolduran ve metnin estetik oyununa katılan bu okur, eserin anlam üretim sürecinin vazgeçilmez bir parçasıdır. Model okur, metnin yazar "
        "tarafından önceden kurulmuş alımlama haritasıdır."
    )

    pdf.kavram_tanimi(
        "Motivasyon (Motivation)",
        "Rus Biçimcisi Boris Tomaşevski'nin 'Yazın Kuramı'nda geliştirdiği kavram; bir anlatıda yer alan her bir temanın, motifin veya biçimsel "
        "tekniğin olay örgüsü bütünü içinde haklılaştırılması, meşrulaştırılması ve inandırıcı kılınması sistemini açıklar. Tomaşevski üç tür motivasyon "
        "tanımlar: Olayların günlük mantığa uygun görünmesini sağlayan 'gerçekçi motivasyon'; metnin türsel kalıplarına dayanan 'türsel motivasyon' ve "
        "okurun dikkatini biçimsel yeniliğe çeken 'estetik motivasyon'. Anton Çehov'un meşhur 'İlk perdede duvarda asılı bir tüfek varsa, son perdede "
        "mutlaka patlamalıdır' ilkesi, kusursuz bir kompozisyonel motivasyon örneğidir."
    )

    pdf.kavram_tanimi(
        "Mythos (Mitos / Olay Örgüsü)",
        "Aristoteles'in 'Poetika'sında tragedyanın altı öğesi arasında 'en önemlisi, tragedyanın ruhu' olarak nitelendirdiği kavram (Grekçe: Mythos); "
        "dağınık eylemlerin ve olayların anlamlı, bütünlüklü ve organik bir yapı oluşturacak biçimde düzenlenmesidir. Günlük dildeki 'efsane/masal' "
        "anlamından farklı olarak Aristotelesçi poetikada mythos, başlangıcı, ortası ve sonu olan, parçalarından biri çıkarıldığında bütünün dağıldığı "
        "kusursuz olay örgüsü mimarisini ifade eder. Aristoteles'e göre karakterler eylemleri belirlemez; tersine eylemlerin ve olay örgüsünün "
        "zorunluluğu karakterleri sahneye taşır."
    )

    # ─── O ───
    pdf.alt_alt_bolum("── O ──")

    pdf.kavram_tanimi(
        "Odaklanma (Focalization)",
        "Gérard Genette'in anlatıbilime kazandırdığı ve geleneksel 'bakış açısı' kavramını çok daha hassas bir zemine oturtan bu terim; 'Kimin "
        "konuştuğu?' (anlatıcı) sorusu ile 'Kimin gördüğü/algıladığı?' (odaklayıcı) sorusunu birbirinden kesin çizgilerle ayırır. Genette üç "
        "odaklanma türü belirler: Anlatıcının karakterden daha çok şey bildiği 'sıfır odaklanma' (tanrısal bakış açısı); anlatının olayları tek "
        "bir karakterin algı süzgecinden aktardığı 'iç odaklanma' ve anlatıcının karakterin zihnine giremeyip yalnızca dışarıdan gözlemlediği "
        "'dış odaklanma'. Odaklanma kavramı, bir anlatıda bilginin nasıl filtrelendiğini çözümlemenin en yetkin aracıdır."
    )

    pdf.kavram_tanimi(
        "Olay Örgüsü (Plot)",
        "E. M. Forster'ın 'Roman Sanatı' (Aspects of the Novel, 1927) kitabındaki klasikleşmiş tanımıyla; olayların yalnızca zamansal ardışıklıkla "
        "sıralanması olan 'hikâye'den (story) farklı olarak, olayların neden-sonuç bağıntısı ve mantıksal nedensellikle birbirine bağlandığı anlatı "
        "omurgasıdır. Forster'ın örneğiyle: 'Kral öldü, sonra kraliçe de öldü' bir hikâyedir; oysa 'Kral öldü, kraliçe de kederinden öldü' bir olay "
        "örgüsüdür. Olay örgüsü; merak, gerilim ve estetik tatmin yaratmak amacıyla çatışmaların, dönüm noktalarının ve doruk anlarının bilinçli bir "
        "kompozisyon halinde yapılandırılmasıdır."
    )

    pdf.kavram_tanimi(
        "Oryantalizm (Şarkiyatçılık / Orientalism)",
        "Filistinli-Amerikalı karşılaştırmalı edebiyat profesörü Edward W. Said'in 1978 tarihli 'Oryantalizm' adlı çığır açıcı kitabında kuramlaştırdığı "
        "kavram; Batı'nın Doğu'yu tanımak, denetlemek, yönetmek ve kendi üstün kimliğini inşa etmek amacıyla ürettiği kurumsal, edebi ve akademik "
        "söylemler bütünüdür. Said'e göre Doğu, coğrafi bir gerçeklikten ziyade Batı muhayyilesinde 'gizemli, egzotik, rasyonellikten uzak, pasif, "
        "tehlikeli ve kadınsı' olarak kurgulanmış bir fantezi nesnesidir. Foucault'nun söylem ve iktidar kuramından beslenen bu yaklaşım, edebi "
        "metinlerin sömürgeci tahakkümle nasıl suç ortaklığı kurduğunu ifşa eder."
    )

    pdf.kavram_tanimi(
        "Ostranenie (Alışkanlığı Kırma / Yabancılaştırma)",
        "Rus Biçimcisi Viktor Şklovski'nin 'Sanat Bir Yöntem Olarak' (1917) makalesinde ortaya koyduğu kavram (Rusça: ostranenie - acayipleştirme, "
        "yabancı kılma); gündelik hayatın tekdüzeliği içinde körleştiğimiz ve kanıksadığımız nesneleri, durumları ve dili alışılmadık bir perspektiften "
        "sunarak onlara yeniden ilk kez görüyormuşçasına bakmamızı sağlayan sanatsal tekniktir. Şklovski'ye göre sanatın amacı nesneleri 'tanımamızı' "
        "(bilişsel otomatikleşme) değil, onları bütün duyusal ağırlıklarıyla 'hissetmemizi' sağlamaktır. Tolstoy'un bir sahneyi bir atın gözünden "
        "anlatması veya eşyaların adlarını anmadan onları yabancı bir gözle betimlemesi ostranenie'nin doruk örnekleridir."
    )

    # ─── P ───
    pdf.alt_alt_bolum("── P ──")

    pdf.kavram_tanimi(
        "Panoptikon (Panopticon)",
        "18. yüzyılda İngiliz filozof Jeremy Bentham tarafından merkezdeki tek bir gözetleme kulesinden tüm mahkûmların her an izlenebildiği ancak "
        "gözetmeni göremediği ideal hapishane modeli olarak tasarlanan mimari yapı; Michel Foucault'nun 'Hapishanenin Doğuşu' (1975) kitabında modern "
        "disiplinci toplumun temel metaforuna dönüştürülmüştür. Birey her an gözetlenebileceği ihtimalini içselleştirerek kendi kendisinin gardiyanı "
        "haline gelir. Edebiyatta George Orwell'ın '1984'ündeki 'Büyük Birader'den çağdaş dijital gözetim distopyalarına kadar denetim ve paranoya "
        "mekanizmalarını çözümlemede temel kavramsal kaynaktır."
    )

    pdf.kavram_tanimi(
        "Pastiş (Pastiche)",
        "Amerikalı Marksist kuramcı Fredric Jameson'ın 'Postmodernizm ya da Geç Kapitalizmin Kültürel Mantığı' (1991) kitabında postmodern estetiğin "
        "merkezine yerleştirdiği kavram; başka metinlerin, dönemlerin veya yazarların üslubunu hiciv veya alay amacı gütmeksizin, boş bir taklit ve "
        "öykünmeyle yeniden üretme pratiğidir. Jameson pastişi 'kahkahasını yitirmiş parodi' veya 'dilsiz bir taklit' olarak tanımlar. Modernizmin "
        "özgün üslup ve bireysel yaratıcılık ideali tükenince, postmodern yazar geçmişin biçimsel maskelerini ve hazır kalıplarını birer nostalji "
        "nesnesi olarak bir araya getirir."
    )

    pdf.kavram_tanimi(
        "Performativite (Performativity)",
        "Dil filozofu J. L. Austin'in 'Söylemek ve Yapmak' (1962) kitabında geliştirdiği 'edimsel sözce' kavramından yola çıkarak Judith Butler tarafından "
        "toplumsal cinsiyet kuramına uyarlanan terim; kimliğin önceden var olan sabit ve biyolojik bir öz olmadığını, tekrarlanan bedensel jestler, "
        "roller ve dilsel edimler yoluyla sürekli 'icra edilerek' inşa edildiğini savunur. Butler'a göre cinsiyet doğuştan 'olunan' bir şey değil, "
        "durmaksızın 'yapılan' performatif bir kurgudur. Edebiyat eleştirisinde performativite, karakterlerin kimliklerinin ve edebi metinlerin "
        "anlamlarının eylem ve sahneleme pratikleri içinde nasıl üretildiğini açığa çıkarır."
    )

    pdf.kavram_tanimi(
        "Peripeteia (Talih Dönüşü)",
        "Aristoteles'in 'Poetika'sında tragedyanın dramatik yapısını oluşturan temel dinamiklerden biri olarak tanımlanan kavram (Grekçe: Peripeteia; "
        "İngilizce: Reversal); olayların gidişatının bir anda tam zıddına dönmesi, kahramanın kaderinin mutluluktan felakete (tragedya) veya felaketten "
        "esenliğe (komedya) evrilmesidir. Aristoteles'e göre en kusursuz peripeteia, bir niyetin tam tersi bir sonuç doğurmasıyla ve tanıma anı "
        "(anagnorisis) ile eşzamanlı olarak gerçekleşen dönüştür. Kral Oidipus'a müjdeli haber vererek onu rahatlatmak isteyen habercinin, açıkladığı "
        "gerçekle Oidipus'un mahvına yol açması bu kavramın klasik örneğidir."
    )

    pdf.kavram_tanimi(
        "Posthümanizm (Posthumanism / İnsan-Sonrası Kuram)",
        "Rosi Braidotti, Donna Haraway, Cary Wolfe ve Katherine Hayles gibi kuramcıların öncülük ettiği bu çağdaş felsefi yönelim; Aydınlanma "
        "hümanizminin rasyonel, beyaz, erkek ve dünyayı sömürme hakkını kendinde gören 'evrensel insan' kurgusunu kökten reddeder. İnsanı doğadan, "
        "hayvanlardan ve teknolojiden üstün kılan hiyerarşiyi yıkarak; insanın sibernetik protezlerle, genetik mühendislikle ve insan-dışı ekosistemlerle "
        "kurduğu geçişken simbiyotik bağları vurgular. Edebiyatta posthümanizm; bilimkurgu metinlerindeki sayborglardan yapay zekâ anlatılarına ve "
        "türcülük karşıtı ekolojik kurmacalara kadar yeni varoluş imkânlarını tartışır."
    )

    pdf.kavram_tanimi(
        "Postmemory (Art-Bellek / Kuşaklararası Bellek)",
        "Amerikalı edebiyat ve kültür kuramcısı Marianne Hirsch'in Holokost kurtulanlarının çocukları üzerine yaptığı incelemelerle geliştirdiği kavram; "
        "bireylerin bizzat yaşamadıkları, ancak ebeveynlerinin ve atalarının maruz kaldığı derin travmatik olayların (soykırım, savaş, sürgün, zorunlu "
        "göç) anılarıyla büyümesi sonucu bu travmayı kendi doğrudan hafızalarıymışçasına içselleştirmeleri durumudur. Art-bellek 'hatırlanan' bir şeyden "
        "ziyade aile içi fısıltılar, suskunluklar, fotoğraflar ve hayal gücüyle yeniden kurulan dolaylı bir bellektir. Edebiyat eleştirisinde postmemory, "
        "travmanın kuşaklararası aktarımını ve tarihsel yaraların kurgusal metinlerde nasıl yankı bulduğunu inceler."
    )

    # ─── Q ───
    pdf.alt_alt_bolum("── Q ──")

    pdf.kavram_tanimi(
        "Queer Kuramı (Queer Theory)",
        "1990'ların başında Teresa de Lauretis, Judith Butler ve Eve Kosofsky Sedgwick öncülüğünde şekillenen bu radikal eleştirel yaklaşım; cinsiyet, "
        "toplumsal cinsiyet ve cinselliği ikili karşıtlıklar (kadın/erkek, eşcinsel/heteroseksüel) içine hapseden normatif yapıları yapısöküme uğratır. "
        "'Queer' sözcüğü tarihsel olarak bir hakaretken, kuramcılar tarafından normatif kalıplara sığmayan, akışkan, sınırları ihlal eden ve 'yoldan çıkmış' "
        "tüm kimlik biçimlerini kucaklayan politik ve estetik bir direniş alanına dönüştürülmüştür. Edebiyat incelemelerinde metinlerin alt metinlerindeki "
        "bastırılmış arzuları, cinsiyet rollerinin istikrarsızlığını ve normu sarsan performatif anları ortaya çıkarır."
    )

    # ─── R ───
    pdf.alt_alt_bolum("── R ──")

    pdf.kavram_tanimi(
        "Rizom (Rhizome / Kök-Sap)",
        "Fransız filozoflar Gilles Deleuze ve Félix Guattari'nin 'Bin Yayla' (1980) kitabında botanikten esinlenerek geliştirdikleri felsefi model; "
        "kökleri hiyerarşik tek bir merkeze veya gövdeye bağlı 'ağaçsı' (arborescent) düşünce sisteminin aksine, her bir noktasının herhangi başka "
        "bir noktayla bağlantı kurabildiği yatay, merkezsiz, açık uçlu ve çok yönlü ağ yapısını tanımlar. Rizomun başı veya sonu yoktur; her zaman "
        "'ortada'dır, kırıldığı yerden yeni sürgünler verir. Edebiyatta doğrusal olmayan olay örgüleri, hipermetinler, çok katmanlı anlatılar ve "
        "sınır tanımaz metinlerarası geçişler rizomatik bir mantıkla işler."
    )

    # ─── S ───
    pdf.alt_alt_bolum("── S ──")

    pdf.kavram_tanimi(
        "Serbest Dolaylı Anlatım (Free Indirect Discourse)",
        "Gustave Flaubert'in 'Madame Bovary'siyle modern romana egemen olan bu teknik (Fransızca: style indirect libre); üçüncü şahıs nesnel "
        "anlatıcı ile karakterin iç sesinin gramatikal olarak ayırt edilemez biçimde kaynaşmasıdır. Doğrudan anlatımdaki tırnak işaretleri ve "
        "konuşma fiilleri ('Ali düşündü: Gideceğim') veya dolaylı anlatımdaki bağımlı yan cümleler ('Ali gideceğini düşündü') olmaksızın, "
        "karakterin sübjektif yargıları doğrudan üçüncü şahıs anlatıcının cümlesine sızar ('Ah, bu kasabada çürümek zorunda mıydı?'). Bu yöntem "
        "okura anlatıcının karakterle alay mı ettiğini yoksa onunla özdeşleşti mi olduğunu bilerek belirsiz bırakan zengin bir ironi alanı açar."
    )

    pdf.kavram_tanimi(
        "Simülakr (Simulacrum)",
        "Fransız sosyolog ve kültür kuramcısı Jean Baudrillard'ın 'Simülakrlar ve Simülasyon' (1981) kitabında kitle iletişim çağını açıklamak için "
        "geliştirdiği kavram; aslı, kökeni ya da fiziksel bir gerçekliği bulunmayan, gerçekliğin yerini alan ve kendi gerçekliğini üreten sahte "
        "göstergeleri ve kopyaları tanımlar. Baudrillard'a göre hiper-gerçeklik çağında imajlar aşama aşama gerçekliği yansıtmaktan çıkmış, gerçekliğin "
        "yokluğunu örtmüş ve nihayet hiçbir gerçeklikle ilişkisi kalmayarak saf bir simülakra dönüşmüştür. Medya çağı edebiyatında simülakr kavramı; "
        "sanal evrenlerden gerçeklik algısını yitirmiş modern karakterlerin yabancılaşmasına kadar uzanan temaları analiz etmede merkezidir."
    )

    pdf.kavram_tanimi(
        "Söylem (Discourse / Discours)",
        "Michel Foucault'nun 'Bilginin Arkeolojisi' ve 'Cinselliğin Tarihi' eserlerinde felsefi ve eleştirel bir merkeze oturttuğu kavram; belirli "
        "bir tarihsel dönemde hakikatin ne olduğunu, neyin söylenip neyin söylenemeyeceğini belirleyen, dili, bilgiyi ve iktidarı birbirine bağlayan "
        "kurallar, pratikler ve kavramsal çerçeveler sistemidir. Foucault'ya göre söylem masum bir iletişim aracı değildir; delilik, cinsellik, suç "
        "ve hastalık gibi kategorileri bizzat inşa eden iktidar mekanizmasıdır. Edebiyat metinleri bağımsız dehaların ürünleri değil; çağlarının "
        "tıbbi, hukuki, ahlaki ve edebi söylemlerinin kesişim noktaları ve çatışma alanlarıdır."
    )

    pdf.kavram_tanimi(
        "Sublime (Yüce / The Sublime)",
        "Antik çağ retorikçisi Longinos'un 'Yücelik Üzerine' risalesiyle başlayan, Edmund Burke ve Immanuel Kant tarafından 18. yüzyılda estetiğin "
        "doruğuna yerleştirilen kavram; insan kavrayışını ve hayal gücünü aşan, ölçülemez büyüklük, sonsuzluk ve kudret (fırtınalı okyanuslar, dipsiz "
        "uçurumlar, yıldızlı gökyüzü) karşısında duyulan dehşet ile hayranlığın, acı ile estetik hazzın çelişkili birlikteliğidir. 'Güzel' olan ölçülü "
        "ve uyumluyken; 'yüce' olan ölçüyü yıkar, benliği sarsar ve sonrasında aklın kendi aşkın gücünü fark etmesiyle derin bir tinsel doyum üretir. "
        "Romantik şiirden gotik romana ve çağdaş bilimkurguya kadar insan sınırlarının zorlandığı tüm metinlerde yüce duygusu esastır."
    )

    # ─── T ───
    pdf.alt_alt_bolum("── T ──")

    pdf.kavram_tanimi(
        "Tekinsiz (The Uncanny / Das Unheimliche)",
        "Sigmund Freud'un 1919 tarihli klasik makalesinde kuramsallaştırdığı kavram (Almanca: heimlich - tanıdık, evcil, gizli; unheimlich - tekinsiz, "
        "yabancı); tanıdık, bildik ve güvenli olan bir şeyin aniden yabancı, tekinsiz ve ürkütücü bir kimliğe bürünmesiyle yaşanan derin psişik "
        "rahatsızlığı tanımlar. Freud'a göre tekinsiz hissi yeni bir korkudan değil, zihnin derinliklerine bastırılmış çocuksu komplekslerin, batıl "
        "inançların veya animistik düşüncelerin (canlanan bebekler, doppelgänger/ikizler, kesilmiş uzuvlar, istemsiz tekrarlar) beklenmedik biçimde "
        "yeniden yüzeye çıkmasından doğar. Gotik ve fantastik edebiyatın tamamında tekinsiz, bilinçdışı yarıntıları çözümlemenin en yetkin psikanalitik aracıdır."
    )

    # ─── Ü ───
    pdf.alt_alt_bolum("── Ü ──")

    pdf.kavram_tanimi(
        "Üstkurmaca (Metafiction)",
        "Patricia Waugh'un 'Metafiction: The Theory and Practice of Self-Conscious Fiction' (1984) kitabında sistematikleştirdiği terim; kendi kurmaca "
        "yapısının, yazılma sürecinin, dilsel illüzyonunun ve metin oluşunun bilinçli olarak farkında olan ve bunu açıkça okura sergileyen edebiyat "
        "yapıtlarını tanımlar. Gerçekçi roman okurda gerçek bir dünyayı izliyormuş illüzyonu (mimetik yanılsama) yaratmaya çalışırken, üstkurmaca yazarın "
        "yazma sancılarını, alternatif sonları, metnin yapaylığını ve kurgu olma durumunu teşhir ederek bu büyüyü bozar. Cervantes'in 'Don Kişot'undan "
        "Borges'e, Italo Calvino'dan Orhan Pamuk'un 'Kara Kitap'ına kadar üstkurmaca modern ve postmodern kurmacanın en temel stratejisidir."
    )

    # ─── Y ───
    pdf.alt_alt_bolum("── Y ──")

    pdf.kavram_tanimi(
        "Yabancılaştırma Efekti (Verfremdungseffekt / V-Effekt)",
        "Alman tiyatro kuramcısı ve oyun yazarı Bertolt Brecht'in epik ve diyalektik tiyatro kuramının temel taşı olan bu teknik; seyircinin sahnedeki "
        "olaylarla ve karakterlerle duygusal olarak özdeşleşmesini ve pasif bir katharsis yaşamasını engelleyerek, onun eleştirel, sorgulayıcı ve "
        "politik bir bilinçle olaylara uzaktan bakmasını sağlamayı hedefler. Şarkılar, tabelalar, seyirciye doğrudan hitap eden replikler ve "
        "oyuncunun rolüyle arasına mesafe koyması bu tekniğin araçlarıdır. Brechtian yabancılaştırma, sahnedeki durumların 'kader ya da doğa kanunu' "
        "olmadığını, insanların değiştirebileceği tarihsel ve toplumsal koşulların ürünü olduğunu göstermeyi amaçlar."
    )

    pdf.kavram_tanimi(
        "Yapısöküm (Deconstruction / Déconstruction)",
        "Jacques Derrida'nın 1960'ların sonunda geliştirdiği ve Batı felsefe geleneğinin dayandığı akıl/beden, gösteren/gösterilen, konuşma/yazı, "
        "doğa/kültür, erkek/kadın gibi ikili hiyerarşileri altüst eden felsefi ve eleştirel okuma yöntemidir. Yapısöküm metinleri yok etmek ya da "
        "anlamsız kılmak değildir; bir metnin dayandığı merkezi kavramların kendi içinde nasıl istikrarsızlaştığını, bastırılan ikincil kavram "
        "olmadan birincil kavramın var olamayacağını ve metnin dikiş yerlerindeki aporiaları görünür kılmaktır. Edebi metinlerin tek, homojen ve "
        "kapatılmış bir anlama hapsedilemeyeceğini, dilin iç çelişkileri sebebiyle anlamın sürekli kendi kendini yapısöküme uğrattığını savunur."
    )

    pdf.kavram_tanimi(
        "Yavaş Şiddet (Slow Violence)",
        "Rob Nixon'ın 'Slow Violence and the Environmentalism of the Poor' (2011) kitabında geliştirdiği ufuk açıcı kavram; bombalar veya patlamalar gibi "
        "anlık ve görsel olarak dramatik şiddet biçimlerinin aksine, zamana yayılan, yavaş yavaş biriken, çoğu zaman görünmez kalan ve genellikle "
        "yoksul halkları ve ekosistemleri vuran felaketleri (kimyasal sızıntılar, radyasyon birikimi, iklim krizi) tanımlar. Yavaş şiddetin temsiliyet "
        "krizi vardır; çünkü medya ve geleneksel olay örgüsü anlık patlamaları takip etmeye programlıdır. Edebiyat kuramında yavaş şiddet; çağdaş "
        "ekolojik kurmacanın zamana yayılmış bu görünmez felaketleri görünür kılmak için nasıl yeni anlatı formları icat ettiğini analiz eder."
    )

    pdf.kavram_tanimi(
        "Yazar-İşlevi (Author Function / Fonction-auteur)",
        "Michel Foucault'nun 'Yazar Nedir?' (1969) başlıklı çığır açıcı makalesinde geliştirdiği kavram; yazarı kanlı canlı bir insan veya bireysel "
        "yaratıcı deha olarak değil, belirli bir metinler grubunun dolaşımını, sınıflandırılmasını, meşruiyetini ve yasal mülkiyetini denetleyen "
        "söylemsel bir işlev olarak tanımlar. Bir metne 'Shakespeare' veya 'Dostoyevski' imzasının atılması, o metnin nasıl okunacağını, hangi değerle "
        "alımlanacağını ve toplumdaki yerini belirleyen kurumsal bir filtre işlevi görür. Foucault'ya göre yazar-işlevi evrensel değildir; modern "
        "kapitalizm, mülkiyet hukuku ve birey kavramıyla birlikte tarihsel olarak inşa edilmiştir."
    )

    pdf.kavram_tanimi(
        "Yazarın Ölümü (The Death of the Author / La mort de l'auteur)",
        "Fransız göstergebilimci Roland Barthes'ın 1967 tarihli ünlü manifestosuyla edebiyat kuramında devrim yaratan düşünce; bir edebi metnin nihai "
        "anlamının yazarın niyetinde, biyografisinde ya da psikolojisinde aranamayacağını, metnin anlamının ancak okuma eylemi esnasında 'okurun "
        "zihninde' doğduğunu savunur. Barthes'a göre metin tek bir Tanrı-Yazarın mesajı değil, farklı kültürlerden gelen alıntıların buluştuğu bir "
        "yankı alanıdır; dolayısıyla 'yazarın ölümü, okurun doğumunun bedelidir'. Bu yaklaşım, edebiyat eleştirisinin merkezini yazarın niyetinden "
        "çıkarıp metnin dilsel dokusuna ve okurun çoğul alımlama süreçlerine kaydırmıştır."
    )

    pdf.bos_satir(1)

    pdf.uyari_kutusu(
        "Kavramları Şablon Olarak Metne Dayatmanın Tehlikesi: Kuram kavramları, edebi metinlerin "
        "üzerine yapıştırılacak hazır etiketler değildir. Bir metinde 'üstkurmaca' veya 'polifoni' "
        "bulmak kendi başına bir eleştirel başarı sayılmaz; önemli olan o kavramın o özgül metinde "
        "nasıl bir anlam, gerilim ve estetik deneyim ürettiğini gösterebilmektir."
    )

    pdf.ornek_kutusu(
        "Kavramsal Çözümleme: Sabahattin Ali - Kürk Mantolu Madonna",
        "Raif Efendi'nin içine kapanık dünyası ve Maria Puder ile ilişkisi, salt bir melankoli hikâyesi "
        "değildir. Metinde Raif Efendi'nin defteri bir 'iç anlatı' (metadiegesis) oluştururken, "
        "anlatıcı ile Raif Efendi arasındaki ilişki Wayne Booth'un 'ima edilen yazar' ve Genette'in "
        "'iç odaklanma' kavramlarıyla çözümlenebilir. Ayrıca Raif Efendi'nin portre karşısında yaşadığı "
        "sarsıntı, Lacancı 'ayna evresi'nin ve Walter Benjamin'in 'aura' kavramının somut bir yansımasıdır.",
        "Metin, karakterin yabancılaşmasını (habitus çatışması) yalnızca psikolojik değil, sosyolojik ve "
        "kuramsal katmanlarıyla okura hissettirir."
    )

    pdf.etkinlik_kutusu(
        "Kavram Eşleştirme ve Kuramsal Uygulama",
        [
            "Okuduğunuz son çağdaş Türk romanından bir pasaj seçiniz. Bu pasajı 'odaklanma' ve 'serbest dolaylı anlatım' ilkelerine göre tahlil ediniz.",
            "Viktor Şklovski'nin 'ostranenie' (alışkanlığı kırma) kavramını kullanarak, son derece sıradan bir gündelik nesneyi (örneğin eski bir çay bardağını) yabancı bir gözle betimleyen kısa bir metin yazınız.",
            "Roland Barthes'ın 'Yazarın Ölümü' tezi ile Wayne Booth'un 'İma Edilen Yazar' kavramı arasındaki temel felsefi ayrımı tartışan bir paragraflık karşılaştırma hazırlayınız."
        ]
    )

    pdf.tartisma_sorulari([
        "Roland Barthes 'Yazarın ölümü, okurun doğumudur' derken okura nasıl bir sorumluluk yüklemektedir?",
        "Edebiyat kuramı kavramları olmaksızın bir edebi metni 'tam anlamıyla' anlamak mümkün müdür, yoksa kuram edebiyatın büyüsünü bozar mı?",
        "Posthümanizm ve ekokritik gibi yeni alanlar, Aristoteles'ten bu yana gelen mimesis ve olay örgüsü anlayışımızı nasıl dönüştürmektedir?"
    ])

    pdf.bolum_ozeti([
        "Edebiyat kuramı sözlüğü, edebi metinlerin yüzeyindeki olayların ardındaki derin yapıları çözümleyen analitik bir pusuladır.",
        "Her kavram, belirli bir felsefi geleneğin, tarihsel dönemin ve estetik tartışmanın ürünü olarak doğmuştur.",
        "Kavramlar birbirleriyle sürekli etkileşim halindedir; tek bir kavramı bilmek değil, kavramlar arasındaki diyalojik ağları kavramak esastır.",
        "Kuram bir kural koyucu değil, edebi muhayyileyi ve eleştirel okuma kapasitesini özgürleştiren bir görme biçimidir."
    ])

    # =========================================================================
    # BÖLÜM 10: KAYNAKÇA, SINIRLAR VE GÜNCELLEME NOTU
    # =========================================================================
    pdf.bolum_basligi(10, "Kaynakça, Sınırlar ve Güncelleme Notu")

    # ─── 10.1 TEMEL KAYNAKÇA ───
    pdf.alt_bolum("Temel Kaynakça ve İleri Okuma Kılavuzu")

    pdf.paragraf(
        "Edebiyat kuramı alanında derinleşmek isteyen yazarlar, edebiyat öğrencileri ve araştırmacılar "
        "için hazırlanmış bu kaynakça; kurama ilk adımı atanlardan ileri düzey felsefi metinlerle "
        "yüzleşmek isteyenlere kadar aşamalı bir okuma rotası sunmaktadır. Her eser, içeriği, pedagojik "
        "düzeyi ve edebiyat kuramına sağladığı temel metodolojik katkı özetlenerek sunulmuştur."
    )

    pdf.alt_alt_bolum("10.1.1 Başlangıç Düzeyi: Kurama Giriş ve Temel Kılavuzlar")

    pdf.paragraf(
        "• Jonathan Culler, Edebiyat Teorisi: Çok Kısa Bir Başlangıç (Çev. Işık Ergüden, Dost Kitabevi Yayınları):\n"
        "Kurama yeni başlayanlar için ideal bir kılavuzdur. Culler, okulları kronolojik olarak sıralamak yerine "
        "'Edebiyat nedir?', 'Dil ve anlam nasıl işler?', 'Kimlik nasıl inşa edilir?' gibi temel sorular ekseninde "
        "kuramsal düşüncenin mantığını son derece berrak ve akıcı bir üslupla açıklar."
    )

    pdf.paragraf(
        "• Terry Eagleton, Edebiyat Kuramı: Giriş (Çev. Tuncay Birkan, Ayrıntı Yayınları):\n"
        "Alanında modern bir klasik sayılan bu yapıt; Rus Biçimciliğinden psikanalize, yapısalcılıktan post-yapısalcılığa "
        "kadar tüm temel okulları hem açıklar hem de Marksist bir perspektifle keskin bir eleştiriye tabi tutar. "
        "Eagleton'ın zekice kurgulanmış ironik üslubu, kuramın ideolojiden asla bağımsız olamayacağını kanıtlar."
    )

    pdf.paragraf(
        "• Peter Barry, Beginning Theory: An Introduction to Literary and Cultural Theory (Manchester University Press):\n"
        "İngiliz üniversitelerinde en çok okutulan el kitaplarından biridir. Her kuramsal akımı 'Ne yapar?', 'Tarihsel "
        "kökleri nedir?' ve 'Bir edebi metne nasıl uygulanır?' soruları çerçevesinde adım adım formüle eder; örnek "
        "çözümleme modelleriyle yeni başlayanlara eşsiz bir pratik rehberlik sunar."
    )

    pdf.paragraf(
        "• Mary Klages, Edebiyat Kuramı: Yeni Başlayanlar İçin Rehber (Çev. Deniz Özçetin, Dipnot Yayınları):\n"
        "Soyut felsefi terimleri gündelik hayatın somut örnekleriyle açıklayan, birinci sınıf öğrencileri için "
        "özel olarak tasarlanmış sıcak ve didaktik bir giriş kitabıdır."
    )

    pdf.alt_alt_bolum("10.1.2 Orta Düzey: Anlatıbilim, Biçim ve Yapı İncelemeleri")

    pdf.paragraf(
        "• Gérard Genette, Anlatının Söylemi (Figures III / Narrative Discourse, Cornell University Press):\n"
        "Modern anlatıbilimin (narratology) kurucu anıtıdır. Zaman, odaklanma, kip, ses ve anlatı düzeyleri "
        "kavramlarını Marcel Proust'un 'Kayıp Zamanın İzinde' romanı üzerinden cerrahi bir titizlikle inşa eder. "
        "Her kurmaca yazarının ve kuramcısının masa başında bulundurması gereken temel bir başvuru eseridir."
    )

    pdf.paragraf(
        "• Wayne C. Booth, Kurmacanın Retoriği (The Rhetoric of Fiction, Metis Yayınları):\n"
        "Yazarın metindeki varlığını savunan, 'ima edilen yazar', 'güvenilmez anlatıcı' ve anlatıcının ahlaki "
        "mesafesi kavramlarını edebiyat eleştirisinin merkezine yerleştiren çığır açıcı bir poetika klasiğidir."
    )

    pdf.paragraf(
        "• Seymour Chatman, Öykü ve Söylem: Filmde ve Kurmacada Anlatı Yapısı (Çev. Özgür Yaren, De Ki Basım Yayım):\n"
        "Anlatıbilimsel araçları hem edebiyata hem de sinemaya başarıyla uygulayan; olay, karakter, mekân ve "
        "zaman eksenlerini göstergebilimsel bir berraklıkla sistematize eden mükemmel bir sentez çalışmasıdır."
    )

    pdf.paragraf(
        "• Umberto Eco, Açık Yapıt ve Anlatı Ormanlarında Altı Gezinti (Can Yayınları):\n"
        "Okurun metindeki yerini, 'model okur' kavramını ve yorumlama sınırlarını eğlenceli ve derinlikli bir dille "
        "tartışan, yaratıcı yazarlar için ufuk açıcı iki temel metindir."
    )

    pdf.paragraf(
        "• Mihail Bahtin, Karnavaldan Romansıya ve Diyalogik Muhayyile (Ayrıntı Yayınları):\n"
        "Roman türünün çoksesli, diyalojik ve karnavalesk doğasını ortaya koyan; dilin yaşayan, çatışan toplumsal "
        "doğasını edebiyatın kalbine yerleştiren vazgeçilmez bir kuramsal külliyattır."
    )

    pdf.alt_alt_bolum("10.1.3 İleri Düzey: Felsefi ve Politik Kuramın Kurucu Metinleri")

    pdf.paragraf(
        "• Michel Foucault, Kelimeler ve Şeyler ile Bilginin Arkeolojisi (Ayrıntı Yayınları):\n"
        "Episteme, söylem ve iktidar ilişkilerini inceleyen; Batı düşüncesinde insan kavramının nasıl icat edildiğini "
        "gösteren temel felsefi başvuru kaynaklarıdır."
    )

    pdf.paragraf(
        "• Jacques Derrida, Gramatoloji (De la grammatologie, Çev. İsmet Birkan, Bilgesu Yayıncılık):\n"
        "Yapısökümün manifestosu niteliğindedir. Ses-merkezciliği, mevcudiyet metafiziğini ve yazının felsefe "
        "tarihindeki ikincilleştirilmesini kökten sarsan, okunması yoğun emek isteyen zirve bir metindir."
    )

    pdf.paragraf(
        "• Roland Barthes, S/Z ve Göstergebilimsel Serüven (Yapı Kredi Yayınları):\n"
        "Balzac'ın 'Sarrasine' novellasını beş ayrı koda bölerek satır satır çözümleyen S/Z, metnin çoğul "
        "anlamlar üreten bir kumaş olduğunu kanıtlayan yapısalcılık-sonrası bir başyapıttır."
    )

    pdf.paragraf(
        "• Edward W. Said, Oryantalizm ve Kültür ve Emperyalizm (Metis Yayınları):\n"
        "Sömürgecilik-sonrası kuramın doğuşunu simgeleyen bu eserler, Batı edebi kanonunun emperyal siyasetle, "
        "coğrafyayla ve tahakküm mekanizmalarıyla olan suç ortaklığını çarpıcı bir biçimde belgeler."
    )

    pdf.paragraf(
        "• Judith Butler, Cinsiyet Belası: Feminizm ve Kimliğin Altüst Edilmesi (Metis Yayınları):\n"
        "Toplumsal cinsiyetin performatif doğasını, biyolojik cinsiyet kurgusunu ve heteronormatif matriksi "
        "sarsan, çağdaş feminist ve queer kuramın kurucu metnidir."
    )

    pdf.paragraf(
        "• Fredric Jameson, Postmodernizm ya da Geç Kapitalizmin Kültürel Mantığı (Yordam Kitap):\n"
        "Postmodern estetik biçimlerin (pastiş, nostalji, parçalanmışlık) geç kapitalizmin ekonomik mantığıyla "
        "olan doğrudan bağını kuran en kapsamlı Marksist kültür çözümlemesidir."
    )

    pdf.alt_alt_bolum("10.1.4 Türkçe Telif Eserler ve Türk Edebiyatı Kuramı Kitaplığı")

    pdf.paragraf(
        "• Berna Moran, Edebiyat Kuramları ve Eleştiri (İletişim Yayınları):\n"
        "Türkiye'de edebiyat kuramı öğretiminin tartışmasız başyapıtıdır. Platon'dan başlayarak yansıtma, anlatımcılık, "
        "yeni eleştiri, Rus biçimciliği ve yapısalcılığı olağanüstü duru bir Türkçe ve kusursuz pedagojik yöntemle açıklar."
    )

    pdf.paragraf(
        "• Berna Moran, Türk Romanına Eleştirel Bir Bakış (3 Cilt, İletişim Yayınları):\n"
        "Batı kuramlarının Türk romanına nasıl ustalıkla ve yaratıcı bir biçimde uygulanabileceğini gösteren, Ahmet Mithat "
        "Efendi'den Orhan Pamuk'a uzanan eşsiz bir kanon incelemesidir."
    )

    pdf.paragraf(
        "• Jale Parla, Don Kişot'tan Bugüne Roman ve Babalar ve Oğullar (İletişim Yayınları):\n"
        "Roman türünün epistemolojik temellerini, Don Kişot'un kurucu mirasını ve Tanzimat romanındaki Doğu-Batı "
        "yarılmasını dünya edebiyatı kuramlarıyla harmanlayarak inceleyen ufuk açıcı çalışmalardır."
    )

    pdf.paragraf(
        "• Nurdan Gürbilek, Vitrinde Yaşamak, Kör Ayna Kayıp Şark ve Benden Önce Bir Başkası (Metis Yayınları):\n"
        "Türk edebiyatında kuram ile yaratıcı denemeyi en kusursuz kaynaştıran eleştirmendir. Tanpınar, Oğuz Atay, "
        "Bilge Karasu ve Dostoyevski metinlerini psikanalitik ve kültürel derinlikle yeniden yorumlar."
    )

    pdf.paragraf(
        "• Mehmet Rifat, XX. Yüzyılda Dil ve Edebiyat Kuramları ve Göstergebilimin ABC'si (Yapı Kredi / Say Yayınları):\n"
        "Göstergebilim, biçimcilik ve alımlama estetiğini Türkiye'ye tanıtan, kuramsal metinleri Türkçeleştiren "
        "öncü bir başvuru külliyatıdır."
    )

    pdf.paragraf(
        "• Tahsin Yücel, Yapısalcılık ve Yazın, Gene Yazın (Can Yayınları):\n"
        "Fransız yapısalcılığını ve göstergebilimini yetkinlikle aktaran, dilin edebiyattaki kurucu gücünü savunan "
        "klasikleşmiş bir kaynaktır."
    )

    pdf.bos_satir(1)

    # Karşılaştırmalı Okuma Rotası Tablosu
    pdf.bold_paragraf("Edebiyat Kuramı Okuma Rotası ve Düzey Dağılımı")
    tablo_basliklar = ["Düzey", "Önerilen Temel Eser", "Odak Alanı", "Kazanılacak Temel Yetkinlik"]
    tablo_satirlar = [
        ["Başlangıç", "Jonathan Culler - Edebiyat Teorisi", "Temel kavramsal sorular", "Kuramsal düşünme refleksi"],
        ["Başlangıç", "Berna Moran - Edebiyat Kuramları", "Tarihsel kuramlar ve okullar", "Klasik okulların haritası"],
        ["Orta Düzey", "Gérard Genette - Anlatının Söylemi", "Anlatıbilim, zaman ve odaklanma", "Metin mimarisini çözümleme"],
        ["Orta Düzey", "Wayne C. Booth - Kurmacanın Retoriği", "Anlatıcı tipleri ve retorik", "Yazarın kurgusal stratejisi"],
        ["İleri Düzey", "Roland Barthes - S/Z", "Yapısalcılık-sonrası okuma", "Metnin çoklu kodlarını deşifre"],
        ["İleri Düzey", "Michel Foucault - Bilginin Arkeolojisi", "Söylem, iktidar ve özne", "Tarihsel ve epistemik analiz"],
        ["Telif Uygulama", "Jale Parla - Don Kişot'tan Bugüne", "Roman kuramı ve Türk romanı", "Kuramı yerli metne uyarlama"]
    ]
    pdf.tablo_basit(tablo_basliklar, tablo_satirlar, [25, 60, 50, 55])

    pdf.bos_satir(1)

    # ─── 10.2 SINIRLAR ───
    pdf.alt_bolum("Sınırlar: Bu Ders Kitabı Ne Yapar, Ne Yapmaz?")

    pdf.paragraf(
        "Her kuramsal çalışma, kendi metodolojik tercihlerinin ve pedagojik önceliklerinin çizdiği "
        "sınırlar içinde var olur. Bu ders kitabı; edebiyat kuramına sıfırdan başlayan bir öğrencinin, "
        "genç bir araştırmacının veya kendi yazarlık serüveninde kuramsal bilinç arayan bir yazarın "
        "ihtiyaç duyduğu temel kavramsal omurgayı sağlamak üzere tasarlanmıştır."
    )

    pdf.alt_alt_bolum("10.2.1 Bu Kitabın Kapsamı ve Misyonu (Ne Yapar?)")
    pdf.madde_listesi([
        "Temel Kuramsal Okulları Tanıtır: Antik mimesis geleneğinden Rus Biçimciliğine, yapısalcılıktan post-yapısalcılığa, psikanalizden sömürgecilik-sonrası ve ekokritik kuramlara kadar geniş bir harita sunar.",
        "Anlatıbilimsel Alet Çantası Kazandırır: Olay örgüsü, zaman anakronileri, odaklanma türleri ve anlatıcı stratejilerini somut metin örnekleriyle görünür kılar.",
        "Eleştirel Okuma ve Yazma Bilinci İnşa Eder: Bir metnin yalnızca 'ne söylediğine' değil, 'nasıl söylediğine' ve hangi ideolojik bağlamda var olduğuna dair analitik bir bakış açısı aşılar.",
        "Türk Edebiyatıyla Sürekli Köprü Kurar: Kuramsal ilkeleri yabancı metinlerin soyutluğunda bırakmaz; Ahmet Mithat'tan Sevgi Soysal'a, Tanpınar'dan Bilge Karasu'ya uzanan zengin Türk edebiyatı metinleriyle somutlaştırır."
    ])

    pdf.alt_alt_bolum("10.2.2 Kitabın Kapsam Dışı Bıraktığı Alanlar (Ne Yapmaz?)")
    pdf.madde_listesi([
        "Felsefe Tarihinin Tamamını İkame Etmez: Edebiyat kuramı Kant, Hegel, Marx, Freud, Nietzsche ve Heidegger gibi devasa felsefi geleneklerle beslenir. Bu kitap bir felsefe tarihi değildir; kuramın edebiyatla kesiştiği alanlara odaklanır.",
        "Mekanik Bir Yazarlık Reçetesi Vermez: Kuram bilmek doğrudan iyi bir roman yazmayı garantilemez. Kuram bir formül kitabı değil, yaratıcı sezgiyi besleyen ve yazarın kendi metnine mesafeyle bakmasını sağlayan bir zihinsel antrenmandır.",
        "Her Kuramın Tüm İç Çatışmalarını Tüketmez: Feminizm, Marksizm veya yapısöküm kendi içinde onlarca farklı fraksiyona ayrılır. Bu kitap başlangıç düzeyini gözeterek ana omurgayı berraklaştırmış, derinleşmeyi kaynakçaya bırakmıştır."
    ])

    pdf.alt_alt_bolum("10.2.3 Kuramın Doğası: Bitimsiz Bir Diyalog")
    pdf.paragraf(
        "Edebiyat kuramı, nihai tanımların yapılıp dosyaların kapatıldığı statik bir kütüphane değildir. "
        "Tersine kuram, Mihail Bahtin'in ifadesiyle 'bitimsiz bir diyalog', sürekli birbirini sorgulayan, "
        "çürüten, dönüştüren ve genişleten canlı bir tartışma alanıdır. Yeni Eleştiri metni dünyadan koparırken "
        "Marksizm onu tarihe fırlatmış; Yapısalcılık dili matematiksel bir sisteme dönüştürürken Yapısöküm "
        "dilin kendi altını oyduğunu göstermiş; Hümanizm insanı yüceltirken Posthümanizm insanın gezegendeki "
        "tahakkümünü sorgulamıştır."
    )

    pdf.paragraf(
        "Dolayısıyla edebiyat kuramını öğrenmek, tek bir doğru kuramı seçip diğerlerini çöpe atmak "
        "değildir. Yetkin bir okur ve yazar, farklı kuramları metnin farklı katmanlarını aydınlatan "
        "birer prizma gibi kullanabilen, gerektiğinde bu prizmaları birbirine düşürerek metindeki "
        "çelişkileri yakalayan kişidir."
    )

    pdf.uyari_kutusu(
        "Metne Karşı Kuramsal Şiddet Uygulamamak: Kuram, edebi metni ezmek için kullanılan bir "
        "baskı aracı olmamalıdır. Edebi metin kuramın basit bir kanıtı ya da kurbanı değildir. "
        "Gerçekten yetkin bir edebi eser, çoğu zaman kuramın kendisini aşar, kuramcının formüllerini "
        "bozar ve kuramı kendini yeniden düşünmeye zorlar."
    )

    pdf.bos_satir(1)

    # ─── 10.3 GÜNCELLEME NOTU ───
    pdf.alt_bolum("Güncelleme Notu: Edebiyat Kuramının Çağdaş Ufukları")

    pdf.paragraf(
        "21. yüzyılın ilk çeyreğini geride bıraktığımız bu dönemde, dijital teknolojiler, yapay zekâ, "
        "gezegen ölçeğindeki ekolojik krizler ve küresel politik dönüşümler edebiyat kuramının sınırlarını "
        "hızla genişletmektedir. Aşağıdaki başlıklar, kuramın bugün en hararetle tartıştığı ve önümüzdeki "
        "on yıllarda edebiyatı derinden şekillendirecek olan canlı araştırma alanlarını özetlemektedir."
    )

    pdf.alt_alt_bolum("10.3.1 Yapay Zekâ, Üretici Algoritmalar ve Dağıtık Yazar-İşlevi")
    pdf.paragraf(
        "Büyük Dil Modellerinin (LLM) insan dilini taklit edebilme ve kurmaca metinler üretebilme kapasitesi, "
        "Barthes ve Foucault'nun 'Yazarın Ölümü' ve 'Yazar-İşlevi' tartışmalarını bambaşka bir boyuta taşımıştır. "
        "Artık metin, yalnızca bir insan bilincinin değil, milyonlarca metinden beslenen devasa algoritmik "
        "korpusların ortak ürünü haline gelmektedir. Yaratıcılık nerede başlar? İstem (prompt) yazarlığı yeni bir "
        "retorik türü müdür? İnsan-olmayan bir failin yazdığı metin kime aittir? Bu sorular, telif hukuku, özgünlük, "
        "üslup ve niyet kavramlarının bütünüyle yeniden tanımlanmasını zorunlu kılmaktadır."
    )

    pdf.alt_alt_bolum("10.3.2 Sayısal Beşeri Bilimler ve Hesaplamalı Edebiyat (Distant Reading)")
    pdf.paragraf(
        "Franco Moretti'nin öncülük ettiği 'Uzaktan Okuma' (Distant Reading) ve Sayısal Beşeri Bilimler "
        "(Digital Humanities); tek bir metne mikroskopla bakan geleneksel 'yakın okuma' (close reading) "
        "yönteminin yanına, on binlerce romanı algoritmalarla tarayan makro-analitik bir perspektif eklemiştir. "
        "Büyük veri madenciliği, biçem-ölçüm (stylometry), duygu analizi ve ağ çözümlemeleri sayesinde edebiyat "
        "tarihi, kanonun dışına itilmiş 'okunmayan çoğunluğun' (the great unread) izini sürebilmektedir."
    )

    pdf.alt_alt_bolum("10.3.3 Otokuram (Autotheory): Bedenin ve Felsefenin Kaynaşması")
    pdf.paragraf(
        "Maggie Nelson (The Argonauts), Paul B. Preciado (Testo Junkie) ve Chris Kraus gibi yazarların "
        "öncülük ettiği 'Otokuram' (Autotheory); kişisel otobiyografik anlatı, bedensel deneyim ve güncel "
        "felsefi kuramı melez bir tür içinde birleştirmektedir. Kuramı soyut, mesafeli ve akademik bir dil "
        "olmaktan çıkarıp doğrudan yaşayan bedene, cinsiyete, tıbbi müdahalelere ve kırılganlığa eklemleyen "
        "bu yönelim, edebiyat ile kuram arasındaki geleneksel tür sınırlarını yıkmaktadır."
    )

    pdf.alt_alt_bolum("10.3.4 Post-Eleştiri (Postcritique) ve Şüphenin Ötesinde Okuma")
    pdf.paragraf(
        "Rita Felski'nin 'The Limits of Critique' (Eleştirinin Sınırları, 2015) kitabıyla alevlenen "
        "'Post-Eleştiri' tartışması; Paul Ricoeur'ün 'şüphe hermeneutiği' (hermeneutics of suspicion) olarak "
        "adlandırdığı ve metni sürekli suçüstü yakalamaya, ideolojik dikişlerini teşhir etmeye odaklanan paranoyak "
        "eleştiri tarzını sorgulamaktadır. Post-eleştiri; okurun metinle kurduğu şefkat, bağlanma, estetik büyülenme, "
        "merak ve rezonans gibi olumlu duygusal bağları da eleştirinin meşru bir parçası olarak yeniden "
        "tanımlamayı önermektedir."
    )

    pdf.alt_alt_bolum("10.3.5 Antroposen Çağında Yeni Materyalizm ve Nesne-Yönelimli Ontoloji")
    pdf.paragraf(
        "Timothy Morton, Jane Bennett ve Bruno Latour gibi düşünürlerin geliştirdiği Yeni Materyalizm ve Nesne-Yönelimli "
        "Ontoloji (OOO); edebiyatın insan-merkezci dar çerçevesini sarsmaktadır. Maddenin, nesnelerin, virüslerin, "
        "okyanusların ve plastik atıkların kendi failliklerine (thing-power) sahip olduğu bu ontolojide; edebiyat "
        "yalnızca insanların birbirine anlattığı hikâyeler değil, gezegensel maddenin dile geliş alanı olarak "
        "yeniden düşünülmektedir."
    )

    pdf.alt_alt_bolum("10.3.6 Kuramsal Canlılığı Korumak İçin Tavsiyeler")
    pdf.paragraf(
        "Edebiyat kuramı alanında güncel kalmak ve kuramsal donanımınızı sürekli canlı tutmak için "
        "aşağıdaki stratejileri uygulayabilirsiniz:"
    )
    pdf.madde_listesi([
        "Akademik ve Edebi Dergileri Düzenli Takip Edin: Türkiye'de Varlık, Notos, Monokl, Pasaj, Kebikeç ve Doğu Batı; uluslararası alanda ise Critical Inquiry, PMLA, New Literary History ve Poetics Today gibi yayınlar çağdaş kuramın nabzını tutar.",
        "Açık Erişim Dijital Arşivlerden Yararlanın: Stanford Encyclopedia of Philosophy, The Johns Hopkins Guide to Literary Theory and Criticism ve modern üniversitelerin açık ders platformları kuramsal güncellemeler için zengin birer kaynaktır.",
        "Kuramı Kendi Yazı Atölyenize Dahil Edin: Bir kuramı kavramanın en yaratıcı yolu, o kuramın ilkelerini kendi kurgusal denemelerinizde test etmektir. Bir sahneyi farklı odaklanma türleriyle yeniden yazmak, kuramı canlandırır.",
        "Kritik ve Sorgulayıcı Kalın: Hiçbir kuramsal metni tartışmasız bir kutsal kitap gibi benimsemeyiniz. Kuramları daima kendi tarihsel bağlamları, sınırlılıkları ve çelişkileri içinde eleştirel bir mesafeyle okuyunuz."
    ])

    pdf.bos_satir(1)

    pdf.etkinlik_kutusu(
        "Geleceğin Kuramını Tasarlamak",
        [
            "Bir yapay zekâ sohbet robotuna kısa bir öykü yazdırınız. Ardından Roland Barthes'ın 'Yazarın Ölümü' ve Michel Foucault'nun 'Yazar-İşlevi' kavramlarını kullanarak bu metnin yazarlık statüsünü sorgulayan iki sayfalık bir eleştiri raporu kaleme alınız.",
            "Rob Nixon'ın 'Yavaş Şiddet' ve Timothy Morton'ın 'Hiper-nesneler' kavramlarını temel alarak, bir sanayi tesisinin yakınındaki nehrin kirlenmesini konu alan kısa bir olay örgüsü taslağı (syuzhet) çıkarınız.",
            "Rita Felski'nin 'Post-eleştiri' yaklaşımını benimseyerek, sizi çocukluğunuzda derinden etkilemiş bir kitaba dönünüz; metni ideolojik açıklarını aramak yerine, sizde uyandırdığı estetik bağlanma ve büyülenme duygusu üzerinden yeniden çözümleyiniz."
        ]
    )

    pdf.tartisma_sorulari([
        "Algoritmaların kusursuz metinler üretebildiği bir çağda 'edebîlik' (literariness) nerede aranmalıdır?",
        "Post-eleştiri hareketi, Marksist ve feminist eleştirinin eleştirel ve politik keskinliğini zayıflatma riski taşır mı?",
        "İklim krizi ve Antroposen çağında insanın merkezde olmadığı bir edebiyat nasıl kurgulanabilir?"
    ])

    pdf.bolum_ozeti([
        "Temel kaynakça, başlangıç kılavuzlarından ileri düzey felsefi başyapıtlara ve zengin Türkçe literatüre uzanan aşamalı bir okuma rotası sunar.",
        "Ders kitabı metodolojik bir alet çantası kazandırmayı amaçlar; ancak mekanik bir formül kitabı ya da felsefe tarihi iddiası taşımaz.",
        "Edebiyat kuramı tamamlanmış bir dogma değil; çatışmalarla ve yeni açılımlarla sürekli devinen yaşayan bir diyalogdur.",
        "Yapay zekâ, sayısal beşeri bilimler, otokuram, post-eleştiri ve yeni materyalizm kuramın 21. yüzyıldaki en dinamik araştırma ufuklarıdır.",
        "Kuramsal yetkinlik, metne dışarıdan zorla şablon dayatmak değil; metnin kendi iç olanaklarını derin bir analitik duyarlılıkla açığa çıkarabilmektir."
    ])
