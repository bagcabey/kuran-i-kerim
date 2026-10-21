# -*- coding: utf-8 -*-
"""
Bölüm 5: Anlatıbilim — Yazarın En Doğrudan Aracı
Yazarlar İçin Edebiyat Kuramı Ders Kitabı

Bu bölüm, yaratıcı yazarlar için edebiyat kuramının en somut, en pratik ve 
en dönüştürücü disiplini olan anlatıbilimi (narratoloji) kapsamlı biçimde ele alır.
Hikâye-olay örgüsü ayrımından yapısalcı modellere, Genette'in anlatı söyleminden 
bilinç sunumu tekniklerine, evrensel yapı şablonlarından tür kuramına kadar 
yazarın kurmaca inşa ederken ihtiyaç duyduğu tüm kavramsal araçları sunar.
"""


def yaz(pdf):
    # ─────────────────────────────────────────────────────────────────────────
    # BÖLÜM GİRİŞİ
    # ─────────────────────────────────────────────────────────────────────────
    pdf.bolum_basligi(5, "Anlatıbilim: Yazarın En Doğrudan Aracı")

    pdf.paragraf(
        "Edebiyat kuramları içinde yaratıcı yazarın çalışma masasına doğrudan "
        "konuk olan, taslakları incelerken bir mikroskop, kurguyu çatarken bir mimari cetvel "
        "işlevi gören en somut disiplin anlatıbilimdir (narratoloji). Fransız kuramcı "
        "Tzvetan Todorov'un 1969 yılında 'Grammaire du Décaméron' adlı eserinde ilk kez "
        "kullandığı bu terim, en yalın tanımıyla 'anlatıların doğasını, yapısını, işleyiş "
        "kurallarını ve etkileme mekanizmalarını inceleyen kuramsal alan' olarak tarif edilir."
    )

    pdf.paragraf(
        "Felsefi ve sosyolojik kuramlar çoğunlukla metnin 'ne söylediği' veya 'toplumsal "
        "bağlamının ne olduğu' sorularıyla ilgilenirken, anlatıbilim odağını bütünüyle "
        "'bu metnin nasıl inşa edildiği' sorusuna çevirir. Bir metin okurda merakı nasıl "
        "canlı tutar? Zaman nasıl bükülür de on yıllık bir ömür iki sayfaya sığarken, "
        "bir saniyelik bir kurşun sesi üç bölüm boyunca yankılanır? Okur, cinayeti işleyen "
        "karaktere nasıl olur da şefkat duyar? Bir anlatıcı ne zaman ve nasıl güvenilmez hale "
        "gelir? İşte bu soruların tamamı, anlatıbilimin çalışma alanına girer."
    )

    pdf.paragraf(
        "Yazar adayı için anlatıbilim öğrenmek, bir müzisyenin armoni ve nota bilgisi "
        "edinmesine benzer. Sezgileriyle yazan bir yazar tıkandığında nerede hata yaptığını "
        "kolay kolay kestiremez; oysa anlatıbilimsel araçlara hâkim bir yazar, temposu düşen "
        "bir sahnede odaklanma hatası mı yaptığını, süreyi mi yanlış ayarladığını yoksa "
        "nedensellik bağlarını mı gevşettiğini cerrah titizliğiyle teşhis edebilir."
    )

    pdf.kavram_tanimi(
        "Anlatıbilim (Narratoloji)",
        "Anlatıların ortak yapısal unsurlarını, söylem biçimlerini, zaman ve bakış açısı "
        "düzenlemelerini, olay örgüsü mekanizmalarını sistemli ve kuramsal olarak inceleyen "
        "edebiyat bilimi dalı."
    )

    pdf.bilgi_kutusu(
        "Yazarın Atölyesinde Anlatıbilim",
        "Anlatıbilim formüller dayatarak yaratıcılığı kısıtlamaz; aksine, daha önce farkında "
        "olmadığınız anlatı olanaklarını görünür kılarak hayal gücünüze geniş bir hareket alanı "
        "açar. Bir teknik kuralı çiğnemek bile, önce o kuralın mekanizmasını derinlemesine "
        "anlamaktan geçer."
    )

    pdf.bos_satir(1)

    # ─────────────────────────────────────────────────────────────────────────
    # 5.1 TEMEL AYRIM: HİKÂYE, OLAY ÖRGÜSÜ VE ANLATI
    # ─────────────────────────────────────────────────────────────────────────
    pdf.alt_bolum("Temel Ayrım: Hikâye, Olay Örgüsü ve Anlatı")

    pdf.paragraf(
        "Anlatı kuramının ilk ve en hayati adımı, 'yaşanan olaylar zinciri' ile 'bu olayların "
        "metin içinde okura sunuluş biçimi' arasındaki köklü ayrımı kavramaktır. Günlük dilde "
        "birbirinin yerine kullanılan hikâye, masal, olay ve kurgu sözcükleri, kuramsal "
        "düzlemde birbirine indirgenemez farklı kavramsal katmanlara karşılık gelir."
    )

    pdf.paragraf(
        "İngiliz yazar ve eleştirmen E. M. Forster, 1927 tarihli 'Roman Sanatı' (Aspects of the Novel) "
        "adlı başvuru eserinde bu ayrımı tarihe geçen yalın bir örnekle özetlemiştir: "
        "'Kral öldü, arkasından kraliçe de öldü' derseniz bu bir hikâyedir. Çünkü sadece zamansal "
        "bir ardışıklığı bildirir. Fakat 'Kral öldü, arkasından kraliçe kahrından öldü' derseniz "
        "bu bir olay örgüsüdür. Zira araya nedensellik (illiyet) bağı girmiştir."
    )

    pdf.paragraf(
        "Forster'ın bu çarpıcı ayrımı, olay örgüsünün salt zaman akışına dayalı bir kronoloji "
        "değil, olaylar arasındaki neden-sonuç ilişkilerini ve psikolojik dinamikleri kuran "
        "zihinsel bir mimari olduğunu gösterir. Bir adım daha ileri gidildiğinde ise merak ve "
        "gizem boyutu devreye girer: 'Kraliçe öldü, kimse nedenini anlayamadı; sonunda kralın acısından "
        "öldüğü ortaya çıktı' dediğimizde, olay örgüsü bilginin okura veriliş sırasını da "
        "yöneterek estetik bir merak ve erteleme (retardasyon) mekanizması üretir."
    )

    pdf.kavram_tanimi(
        "Fabula (Hammadde / Hikâye)",
        "Anlatılan olayların gerçek veya varsayımsal dünyada gerçekleştiği varsayılan nesnel, "
        "kesintisiz ve kronolojik sırası; anlatının ham maddesi."
    )

    pdf.kavram_tanimi(
        "Sjuzhet (Biçimleniş / Olay Örgüsü)",
        "Fabula unsurlarının yazar tarafından seçilerek, yeniden sıralanarak, hızlandırılarak "
        "veya geciktirilerek metin yüzeyinde sanatsal bir etki yaratacak biçimde kurgulanmış hali."
    )

    pdf.kavram_tanimi(
        "Anlatı Söylemi (Discourse)",
        "Olay örgüsünün belirli bir dille, belirli bir anlatıcı sesi ve bakış açısı aracılığıyla "
        "somut bir metne (sözel veya yazılı) dökülmüş nihai sunumu."
    )

    pdf.paragraf(
        "Farklı kuramsal ekoller bu temel iki veya üç katmanlı ayrımı benzer temeller üzerinde "
        "çeşitli terimlerle adlandırmışlardır. Aşağıdaki karşılaştırmalı tablo, bu kavram "
        "çeşitliliğini ve aralarındaki örtüşmeleri netleştirmektedir:"
    )

    pdf.tablo_basit(
        ["Kuramcı / Ekol", "Kronolojik Olaylar (Hammadde)", "Kurgusal Düzenleme (Tasarım)", "Metinsel Dışavurum (Söylem)"],
        [
            ["Rus Biçimcileri\n(Şklovski, Tomaşevski)", "Fabula (Olaylar dizisi)", "Sjuzhet (Sanatsal tertip)", "Metin (Faktura)"],
            ["E. M. Forster", "Story (Hikâye / Zaman bağı)", "Plot (Olay Örgüsü / Nedensellik)", "Novel (Roman metni)"],
            ["Seymour Chatman", "Story (What / Ne anlatılıyor)", "Discourse (How / Nasıl anlatılıyor)", "Text / Performance"],
            ["Gérard Genette", "Histoire (Hikâye / Anlatılan)", "Récit (Anlatı söylemi)", "Narration (Anlatma eylemi)"],
            ["Mieke Bal", "Fabula (Olay unsurları)", "Story (Düzenlenmiş hikâye)", "Text (Dilsel işaretler)"]
        ],
        [40, 50, 50, 50]
    )

    pdf.ornek_kutusu(
        "Aynı Olaylar, Farklı Kurgusal Düzenler",
        "Fabula (Kronolojik sıra):\n"
        "1. Selim Bey, 2010 yılında şirketin kasasından gizlice para alır.\n"
        "2. Muhasebeci Tahsin bu açığı fark eder fakat susar.\n"
        "3. 2018'de şirket iflas eder; Selim Bey borç batağına saplanır.\n"
        "4. 2024 baharında Selim Bey, Tahsin'in şantaj mektubuyla intihara sürüklenir.\n\n"
        "Sjuzhet A (Polisiye / Merak Odaklı Düzenleme):\n"
        "Anlatı 2024'te Selim Bey'in çalışma odasındaki cesedi ve masadaki gizemli mektupla başlar. "
        "Dedektif mektubun izini sürerken geriye dönüşlerle (analepsis) 2018 iflasına, en sonunda da "
        "2010'daki gizli hırsızlığa ulaşılır.\n\n"
        "Sjuzhet B (Tragedya / Kaçınılmaz Çöküş Düzenlemesi):\n"
        "Anlatı 2010 yılındaki ilk vicdani kırılmayla başlar. Okur paranın çalındığını bilir; sonraki "
        "on dört yıl boyunca faturanın ne zaman ve nasıl kesileceğini dehşet ve çaresizlikle bekler.",
        "Aynı kronolojik ham olaylar dizisi (fabula), yazarın tercih ettiği söylem sırası (sjuzhet) "
        "sayesinde bambaşka türsel ve duygusal etkilere bürünür. İlk düzende 'merak' (kim yaptı/neden oldu?) "
        "hâkimken, ikinci düzende 'gerilim' (felaket ne zaman kopacak?) ön plana çıkar."
    )

    pdf.uyari_kutusu(
        "Kronolojiye körü körüne teslim olmak, bir kurmaca yazarının düşebileceği en ölümcül "
        "tuzaktır. Hayatta olaylar zamana hapsolmuş biçimde akar; sanatta ise olaylar anlam, merak "
        "ve dramatik çarpıcılık yaratacak biçimde yazarın iradesiyle parçalanır ve yeniden birleştirilir."
    )

    pdf.etkinlik_kutusu(
        "Kendi Fabulanızı Yeniden Sıralayın",
        [
            "Sıradan bir gününüzde gerçekleşen üç basit eylemi kronolojik sırayla yazın (örn: anahtarı unuttunuz, otobüsü kaçırdınız, önemli bir mülakata geç kaldınız).",
            "Bu üç olayı nedensellik bağı içerecek şekilde E. M. Forster tarzı tek bir cümlede birleştirin.",
            "Aynı olaylar zincirini sondan başa doğru (geriye dönüşlü kurguyla) kurgulayan 150 sözcüklük çarpıcı bir açılış paragrafı kaleme alın."
        ]
    )

    pdf.tartisma_sorulari([
        "Bir romanın olay örgüsünü bütünüyle çözüp kronolojik özetini çıkarmak, o eserin edebi değerini anlamak için yeterli midir? Neden?",
        "Tarih yazıcılığı ile kurmaca yazarlığı arasındaki temel sınır, sizce fabula ve sjuzhet ilişkisinde nerede başlar ve biter?"
    ])

    pdf.bos_satir(1)

    # ─────────────────────────────────────────────────────────────────────────
    # 5.2 YAPISALCI ANLATIBİLİM
    # ─────────────────────────────────────────────────────────────────────────
    pdf.alt_bolum("Yapısalcı Anlatıbilim")

    pdf.paragraf(
        "20. yüzyılın ortalarında dilbilimdeki yapısalcı devrim (özellikle Ferdinand de Saussure'ün "
        "görüşleri), edebiyat araştırmacılarını devrimci bir varsayıma yöneltti: Tıpkı sınırlı sayıda "
        "gramer kuralıyla sonsuz sayıda cümle kurulabilmesi gibi, insanlığın ürettiği sayısız hikâyenin "
        "altında da sınırlı sayıda evrensel anlatı kuralları, roller ve eylemler dizisi yatıyor olabilir miydi?"
    )

    pdf.paragraf(
        "Yapısalcı anlatıbilimciler, tekil metinlerin eşsizliğiyle değil; bu metinleri mümkün kılan "
        "soyut sistemle, yani 'anlatının grameriyle' ilgilendiler. Bu arayış, yaratıcı yazarlara "
        "hikâye kurmanın iskeletini ve temel arketiplerini sunan görkemli modeller kazandırdı."
    )

    # Vladimir Propp
    pdf.alt_alt_bolum("Vladimir Propp: Masalın Morfolojisi ve İşlevler")

    pdf.paragraf(
        "Rus folklorcu Vladimir Propp, 1928 yılında yayımlanan 'Masalın Morfolojisi' (Morfologiya Skazki) "
        "adlı çığır açıcı çalışmasında yüz Rus masalını cerrahi bir dikkatle inceledi. Propp, masallarda "
        "karakterlerin isimleri, fiziksel özellikleri veya mekânları sürekli değişse bile, yerine "
        "getirdikleri görevlerin ve olayların akışındaki işlevlerinin hiç değişmediğini keşfetti."
    )

    pdf.paragraf(
        "Propp'a göre anlatının temel yapı taşı 'işlev'dir (fonksiyon). İşlev, bir karakterin "
        "olay örgüsünün gelişimi açısından taşıdığı eylemsel anlamdır. Propp, tüm masalların "
        "en fazla 31 değişmez işlevden oluştuğunu ve bu işlevlerin anlatıdaki kronolojik dizilişinin "
        "sabit olduğunu öne sürdü. Elbette her masal 31 işlevin tamamını içermek zorunda değildir; "
        "fakat var olan işlevler daima aynı mantıksal sıra içinde ortaya çıkar."
    )

    pdf.kavram_tanimi(
        "Anlatısal İşlev (Propp)",
        "Bir karakterin, anlatının gidişatı ve olay örgüsünün bir sonraki aşamaya evrilmesi "
        "bakımından taşıdığı yapısal eylem (örn: Yasaklama, Yasağın Çiğnenmesi, Eksiklik, Sınav)."
    )

    pdf.paragraf(
        "31 işlevin yazarlar açısından en kritik olanları dört ana evrede toplanabilir:\n"
        "1. Hazırlık Evresi: Aileden birinin evden uzaklaşması (Ayrılış), kahramana getirilen Yasaklama "
        "ve bu Yasağın Çiğnenmesi, Kötücül gücün bilgi toplaması ve hile yapması.\n"
        "2. Düğümlenme Evresi: Kötülük veya bir Eksikliğin baş göstermesi, Kahramanın göreve çağrılması "
        "ve yola çıkması (Bağlantı anı).\n"
        "3. Bağışçı ve Yardımcı Evresi: Kahramanın bir Bağışçı (Donör) tarafından sınanması, büyülü "
        "veya yardımcı bir nesneyi/gücü elde etmesi, aranan yere varması.\n"
        "4. Çözüm Evresi: Kötücül güçle doğrudan Çarpışma, Kahramanın yaralanması veya işaretlenmesi, "
        "Zafer kazanılması, Eksikliğin giderilmesi, Sahte Kahramanın maskesinin düşürülmesi ve Düğün/Taç giyme."
    )

    pdf.paragraf(
        "Propp ayrıca masallardaki sonsuz karakter çeşitliliğini '7 Eylem Alanı' (Sphere of Action) "
        "altında toplamıştır: 1. Saldırgan/Kötü Kişi, 2. Bağışçı/Sağlayıcı, 3. Yardımcı, "
        "4. Aranan Kişi (Prenses) ve Babası, 5. Gönderici, 6. Kahraman, 7. Sahte Kahraman."
    )

    pdf.ornek_kutusu(
        "Propp Modelinin Bir Türk Masalına Uygulanması",
        "Masal: 'Keloğlan ve Değirmenci Dev'\n\n"
        "1. Yasaklama: Annesi Keloğlan'a 'Karanlık ormanın arkasındaki eski değirmene asla yaklaşma' der.\n"
        "2. Yasağın Çiğnenmesi: Keloğlan merakına yenilip değirmenin kapısını aralar.\n"
        "3. Eksiklik / Zarar: Değirmenci Dev kasabanın tek su kaynağını kesmiştir; halk açlık ve kuraklık çekmektedir.\n"
        "4. Gönderici: Kasabanın muhtarı/padişahı suyu getirene ödül vaat eder; Keloğlan göreve talip olur.\n"
        "5. Bağışçı ve Sınav: Yolda karşılaştığı yaralı bir ak güvercin Keloğlan'dan ekmek ister. Keloğlan son lokmasını verir (Sınavı geçer).\n"
        "6. Büyülü Nesne: Güvercin ak sakallı bir dervişe dönüşüp Keloğlan'a görünmezlik sağlayan bir ayna verir.\n"
        "7. Mücadele ve Zafer: Keloğlan ayna sayesinde deve görünmeden değirmenin çarkını çeviren tılsımlı taşı kırar.\n"
        "8. Düğün / Ödül: Su kasabaya döner; Keloğlan padişahın kızıyla evlenir veya baş vezir olur.",
        "Görüldüğü üzere, geleneksel bir Türk halk masalı Propp'un morfolojik omurgasını kusursuz "
        "biçimde sergiler. Bu omurga sadece masallarda değil; 'Star Wars', 'Harry Potter' ve "
        "'Yüzüklerin Efendisi' gibi modern fantastik epiklerde de neredeyse birebir işler."
    )

    # Greimas
    pdf.alt_alt_bolum("A. J. Greimas: Aktant (Eyleyen) Modeli")

    pdf.paragraf(
        "Litvanya asıllı Fransız göstergebilimci Algirdas Julien Greimas, Propp'un masallara has "
        "7 eylem alanını çok daha soyut ve evrensel bir düzeye taşıyarak tüm dramatik anlatılara "
        "uygulanabilecek 'Aktant Modeli'ni (Modèle Actantiel) geliştirdi. Bir 'aktör' metindeki somut "
        "bir karakter iken (Ahmet, Ayşe, konuşan kedi), 'aktant' (eyleyen) bu karakterin anlatı "
        "sisteminde oynadığı soyut yapısal rol veya işlevdir."
    )

    pdf.paragraf(
        "Greimas modelinde 6 aktant, birbirini kesen 3 temel dinamik eksen üzerinde konumlanır:\n"
        "• İSTEK / ARZU EKSENİ (Özne —> Nesne): Anlatının motor gücüdür. Bir Özne (kahraman), "
        "ulaşmak istediği bir Nesne'ye (güç, aşk, adalet, bilgi, hazine) tutkuyla yönelir.\n"
        "• İLETİŞİM EKSENİ (Gönderici —> Alıcı): Nesneyi arzu edilir kılan, görevi başlatan otorite "
        "Gönderici'dir; nesnenin elde edilmesinden nihai faydayı sağlayacak olan ise Alıcı'dır.\n"
        "• GÜÇ / YARDIM EKSENİ (Yardımcı <— Özne —> Engelleyici): Öznenin hedefe yürüyüşünde "
        "ona destek veren güçler Yardımcı, onun önüne set çeken unsurlar ise Engelleyici'dir."
    )

    pdf.kavram_tanimi(
        "Aktant (Eyleyen)",
        "Bir anlatı metninde somut bir varlıktan ziyade, eylemin yönünü ve çatışmanın taraflarını "
        "belirleyen soyut rol kategorisi (Özne, Nesne, Gönderici, Alıcı, Yardımcı, Engelleyici)."
    )

    pdf.ornek_kutusu(
        "Greimas Aktant Modelinin Türk Romanına Uygulanması",
        "Eser: Sabahattin Ali — 'Kuyucaklı Yusuf'\n\n"
        "• ÖZNE: Kuyucaklı Yusuf (Doğal, saf, dürüst taşra delikanlısı).\n"
        "• NESNE: Muazzez ile sakin, temiz ve onurlu bir hayat kurabilmek.\n"
        "• GÖNDERİCİ: Yusuf'un içsel adalet duygusu, çocukluk bağı ve onu evlat edinen kaymakama vefası.\n"
        "• ALICI: Yusuf ve Muazzez (aynı zamanda kasabanın ezilen masum insanları).\n"
        "• YARDIMCI: Ali (Yusuf'un dostu), vicdanlı yanıyla Kaymakam Selâhattin Bey.\n"
        "• ENGELLEYİCİ: Hilmi Bey ve oğlu Şakir (kasabanın ahlaksız zenginleri), Hacı Ethem, yozlaşmış kasaba bürokrasisi.",
        "Bu aktant şeması, Yusuf'un bireysel bir aşk mücadelesi verirken aslında nasıl bir toplumsal "
        "sömürü ağıyla (feodal ve yozlaşmış bürokrasi) çatıştığını matematiksel bir netlikle ortaya koyar. "
        "Engelleyicilerin gücü Yardımcıları ezdiğinde kaçınılmaz dramatik trajedi doğar."
    )

    # Todorov
    pdf.alt_alt_bolum("Tzvetan Todorov: Denge ve Bozulma Modeli ile Fantastik")

    pdf.paragraf(
        "Todorov, anlatının en temel dinamiğini 'denge durumlarının dönüşümü' olarak tanımlar. "
        "Her kurmaca metin, durağan bir durumdan başka bir duruma geçişi anlatır. Todorov'a göre "
        "klasik bir anlatı zorunlu olarak 5 evreden geçer:\n"
        "1. Başlangıç Dengesi (Equilibrium): Hayatın kendi doğal akışında sürdüğü durum.\n"
        "2. Dengenin Bozulması (Disruption / Force of Disruption): Dışarıdan veya içeriden gelen bir olayla düzenin yıkılması.\n"
        "3. Bozulmanın Farkına Varılması (Recognition): Karakterlerin krizin boyutlarını idrak etmesi.\n"
        "4. Dengeyi Onarma Çabası (Attempt to Repair): Çatışma, mücadele ve engelleri aşma süreci.\n"
        "5. Yeni Bir Dengenin Kurulması (New Equilibrium): Huzurun yeniden tesisi; ancak bu yeni durum "
        "asla başlangıçtaki durumun aynısı değildir; yaşanan deneyim dünyayı ve karakteri geri dönülmez biçimde değiştirmiştir."
    )

    pdf.paragraf(
        "Todorov'un anlatıbilime yaptığı bir diğer devrimci katkı ise 'Fantastiğin Kuramı'dır (1970). "
        "Todorov'a göre fantastik bir tür olmaktan önce metinsel bir 'kararsızlık ve tereddüt anı'dır. "
        "Gündelik dünyada açıklanamaz bir doğaüstü olayla karşılaşıldığında, karakter ve okur iki "
        "ihtimal arasında tereddüde düşer: Bu bir halüsinasyon, rüya veya illüzyon mudur (Tekinsiz / Uncanny)? "
        "Yoksa dünyanın doğa yasaları gerçekten farklı mıdır ve doğaüstü güçler sahiden var mıdır (Mucizevi / Marvelous)? "
        "İşte bu iki açıklama arasında kalınan o gergin kararsızlık anı 'Saf Fantastik'tir."
    )

    pdf.kavram_tanimi(
        "Tereddüt İlkesi (Todorov)",
        "Okurun ve karakterin, metinde gerçekleşen olağandışı bir olayın mantıksal mı (tekinsiz) "
        "yoksa doğaüstü mü (mucizevi) olduğuna karar veremediği o askıda kalma durumu."
    )

    pdf.ornek_kutusu(
        "Peyami Safa'da Tereddüt ve Denge Bozulması",
        "Eser: Peyami Safa — 'Matmazel Noraliya'nın Koltuğu'\n\n"
        "Tıp öğrencisi Ferit, pansiyondaki odasında gece vakti boş koltuğun kendi kendine sallandığını, "
        "üzerinde belirsiz bir gölgenin kıpırdadığını ve odada açıklanamayan sesler yankılandığını fark eder.\n\n"
        "• Denge Bozulması: Ferit'in rasyonel ve kuşkucu zihniyeti, bu tekinsiz olayla kökten sarsılır.\n"
        "• Tereddüt Hali (Saf Fantastik): Ferit kendi kendine sorar: 'Uykusuzluktan ve sinir buhranından "
        "dolayı hezeyan mı görüyorum (Tekinsiz), yoksa ölen Matmazel Noraliya'nın ruhu bu odada sahiden "
        "dolaşıyor mu (Mucizevi)?'\n"
        "• Yeni Denge: Ferit yaşadığı buhranın ardından mistik bir aydınlanmaya ulaşarak hayatına yeni "
        "bir manevi yön çizer.",
        "Peyami Safa, okuru uzun bölümler boyunca Ferit'in tıbbi-psikiyatrik açıklamaları ile metafizik "
        "açıklamaları arasında tereddütte bırakır. Yazar, tereddüdü canlı tutarak gerilimi zirveye taşır."
    )

    # Roland Barthes
    pdf.alt_alt_bolum("Roland Barthes: Anlatı Düzeyleri ve Beş Kod")

    pdf.paragraf(
        "Roland Barthes, 1966 tarihli ünlü makalesinde anlatı birimlerini iki büyük gruba ayırır:\n"
        "1. İŞLEVLER (Functions): Yatay, eylemsel bağlardır.\n"
        "   - Çekirdek İşlevler (Noyaux / Kardinal İşlevler): Olay örgüsünün yönünü değiştiren, "
        "anlatı mantığı açısından geri dönüşü olmayan ana dönüm noktalarıdır (örn: tetiğin çekilmesi, mektubun yakılması).\n"
        "   - Tamamlayıcı İşlevler (Catalyses): Çekirdek işlevlerin arasını dolduran, ritmi yavaşlatan, "
        "ayrıntı ve atmosfer sağlayan ara eylemlerdir (örn: tetiği çekmeden önce sigara yakmak).\n"
        "2. BELİRTİLER (Indices): Dikey, anlamsal bağlardır.\n"
        "   - Belirtiler (Saf İpuçları): Karakterin psikolojisi, gizli niyetleri veya atmosfer hakkında "
        "dolaylı bilgi veren anlamsal göstergelerdir.\n"
        "   - Bilgilendiriciler (Informants): Mekân, tarih, yaş gibi olgusal verileri doğrudan bildiren unsurlardır."
    )

    pdf.paragraf(
        "Barthes daha sonra 1970 tarihli başyapıtı 'S/Z'de Balzac'ın bir öyküsünü çözümleyerek metinlerin "
        "dokunduğu 'Beş Anlamsal Kod'u ortaya koymuştur. Bu kodlar, bir yazarın metin kurarken "
        "okurun zihninde hangi düğmelere bastığını anlamak için paha biçilmez bir haritadır:"
    )

    pdf.tablo_basit(
        ["Barthes Kodu", "Kodun Niteliği", "Yazarın Kendine Sorması Gereken Kılavuz Soru"],
        [
            ["1. Hermeneutik Kod\n(HER / Gizem Kodu)", "Merak, soru işaretleri, sırlar ve gerçeğin ertelenmesi.", "Okura hangi soruyu sordurdum ve cevabı ne kadar geciktirerek gerilim üretiyorum?"],
            ["2. Proairetik Kod\n(ACT / Eylem Kodu)", "Eylemlerin dizilişi, neden-sonuç zinciri ve olayların temposu.", "Bu eylem bir sonrakini mantıksal veya dramatik olarak nasıl tetikliyor?"],
            ["3. Semik Kod\n(SEM / Karakter Kodu)", "Kişilere ve mekânlara yüklenen çağrışımsal nitelikler, ayrıntılar.", "Seçtiğim sıfatlar, giysiler ve nesneler karakterin hangi gizli yönünü ele veriyor?"],
            ["4. Sembolik Kod\n(SYM / Karşıtlık Kodu)", "Metnin derinindeki ikili karşıtlıklar, metaforlar ve temalar.", "Hikâyemin altında hangi temel çatışma (yaşam/ölüm, düzen/kaos) çarpışıyor?"],
            ["5. Kültürel Kod\n(REF / Referans Kodu)", "Toplumun ortak bilgisine, bilime, tarihe ve atasözlerine göndermeler.", "Okurun gerçek dünya hakkındaki hangi ortak kabullerine yaslanıyorum?"]
        ],
        [35, 60, 95]
    )

    pdf.etkinlik_kutusu(
        "Yapısalcı Cerrahi Masası",
        [
            "Taslak halindeki bir öykünüzün ana karakterini Greimas'ın 6 aktantı açısından haritalandırın. Öznünüzün Nesnesi sahiden somut ve arzu dolu mu?",
            "Öykünüzün ilk sahnesinden bir Çekirdek İşlev seçin. Bu çekirdeğin etrafına metnin gerilimini tırmandıracak iki adet Tamamlayıcı İşlev (kataliz) ve bir adet Belirti (ipucu) ekleyin.",
            "Metninizdeki Hermeneutik Kodu bulun: Okur hangi sayfada bir soru sormaya başlıyor ve bu sorunun yanıtını ne zaman alıyor?"
        ]
    )

    pdf.tartisma_sorulari([
        "Propp'un masal işlevleri ile günümüz popüler sinemasındaki (örneğin süper kahraman filmleri) formüller arasındaki benzerlik, edebiyatın yaratıcılığını öldürür mü yoksa kolektif bilinçdışının kaçınılmaz bir yansıması mıdır?",
        "Bir öyküde 'Tamamlayıcı İşlevler' (ayrıntılar, beklemeler) aşırı uzatılırsa okurda ne tür bir algı oluşur? Yazar bu riski nasıl yönetmelidir?"
    ])

    pdf.bos_satir(1)

    # ─────────────────────────────────────────────────────────────────────────
    # 5.3 GÉRARD GENETTE: ANLATI SÖYLEMİ (YAZARIN ALET ÇANTASI)
    # ─────────────────────────────────────────────────────────────────────────
    pdf.alt_bolum("Gérard Genette: Anlatı Söylemi (Yazarın Alet Çantası)")

    pdf.paragraf(
        "Fransız anlatıbilimci Gérard Genette'in 1972 yılında yayımlanan 'Figures III' (Türkçede "
        "'Anlatı Söylemi') adlı eseri, modern kurmaca yazarlığı için yazılmış en kusursuz "
        "kılavuzdur. Genette, Marcel Proust'un anıtsal eseri 'Kayıp Zamanın İzinde'yi laboratuvar "
        "olarak kullanarak bir hikâyenin söze dökülürken geçirdiği tüm biçimsel dönüşümleri "
        "beş ana başlık altında sınıflandırmıştır: Düzen, Süre, Sıklık, Kip ve Ses."
    )

    # 1. DÜZEN
    pdf.alt_alt_bolum("1. DÜZEN (Ordre): Zamanın Yeniden Kurgulanması")

    pdf.paragraf(
        "Düzen, hikâye zamanı (olayların gerçek hayattaki kronolojik sırası) ile anlatı zamanı "
        "(olayların metinde okura sunulma sırası) arasındaki uyum veya uyumsuzluktur. Genette, "
        "bu iki zaman arasındaki her türlü sapmaya zamandışılaşma (anachrony) adını verir."
    )

    pdf.kavram_tanimi(
        "Geriye Dönüş (Analepsis / Flashback)",
        "Anlatıcının metnin şimdiki zaman çizgisinde durup, geçmişte yaşanmış bir olayı anlatmak "
        "üzere kronolojiyi geriye doğru bükmesi."
    )

    pdf.kavram_tanimi(
        "İleriye Fırlama (Prolepsis / Flashforward)",
        "Anlatıcının henüz gerçekleşmemiş gelecekteki bir olayı önceden haber vermesi, sezdirmesi "
        "veya doğrudan anlatması."
    )

    pdf.paragraf(
        "Genette analepsisleri menzil (portée - geçmişe ne kadar uzağa gidildiği) ve kapsam "
        "(amplitude - geçmişte geçirilen sürenin uzunluğu) bakımından inceler. Ayrıca:\n"
        "• Dış Geriye Dönüş (External Analepsis): Ana anlatının başlangıç noktasından daha eskiye giden dönüşler "
        "(karakterin çocukluğuna dönüp travmasını aydınlatmak gibi).\n"
        "• İç Geriye Dönüş (Internal Analepsis): Ana anlatının başladığı tarihten sonra gerçekleşmiş ama "
        "anlatılmadan atlanmış bir boşluğu doldurmak için yapılan dönüşler."
    )

    pdf.ornek_kutusu(
        "Gabriel García Márquez'in Efsanevi Prolepsis Açılışı",
        "'Yüzyıllık Yalnızlık'ın açılış cümlesi:\n"
        "'Albay Aureliano Buendía, yıllar sonra idam mangasının karşısına dikildiğinde, babasının "
        "onu buzu keşfetmeye götürdüğü o çok uzaklarda kalmış ikindi vaktini hatırlayacaktı.'",
        "Bu tek cümlede Genette'in tüm zaman oyunları iç içe geçer:\n"
        "1. Şimdiki Zaman: Henüz çocukluk dönemidir.\n"
        "2. İleriye Fırlama (Prolepsis): Yıllar sonraki idam mangasının karşısındaki ana sıçranır.\n"
        "3. Geriye Dönüş (Analepsis): İdam mangasındaki yetişkin adamın zihninden çocukluktaki buz sahnesine dönülür.\n"
        "Sonuç: Okurda muazzam bir kader duygusu ve merak patlaması yaratılır."
    )

    # 2. SÜRE
    pdf.alt_alt_bolum("2. SÜRE (Durée): Anlatısal Ritim ve Hız")

    pdf.paragraf(
        "Süre, hikâyede geçen zaman (dakikalar, aylar, yıllar) ile bu zamanın metinde kapladığı "
        "alan (satırlar, sayfalar) arasındaki orandır. Yazar bu oranı değiştirerek anlatının ritmini "
        "ve temposunu yönetir. Genette dört temel hız hareketi tanımlar:"
    )

    pdf.kavram_tanimi(
        "Duraklama (Pause)",
        "Hikâye zamanının tamamen durduğu, metnin ise akmaya devam ettiği andır (Hikâye Zamanı = 0, "
        "Metin Zamanı = Sonsuz). Yazar olayları dondurur; ayrıntılı bir mekân betimlemesi yapar, "
        "karakterin portresini çizer veya felsefi bir yoruma girişir."
    )

    pdf.kavram_tanimi(
        "Sahne (Scène)",
        "Hikâye zamanı ile metin zamanının neredeyse birbirine eşit olduğu andır (Hikâye = Metin). "
        "Genellikle diyaloglarda ve dramatik anlarda görülür; olaylar adeta gerçek zamanda tiyatro "
        "sahnesindeymiş gibi cereyan eder."
    )

    pdf.kavram_tanimi(
        "Özet (Sommaire)",
        "Uzun bir zaman diliminin birkaç cümle veya sayfayla hızla toparlanıp geçiştirilmesidir "
        "(Hikâye > Metin). Örneğin: 'Aradan üç yıl geçti; Selim Bey bu süre zarfında Anadolu'nun "
        "çeşitli kasabalarını dolaşarak küçük işlerle hayatını kazandı.'"
    )

    pdf.kavram_tanimi(
        "Eksilti / Atlama (Ellipsis)",
        "Hikâyede geçen belirli bir zaman diliminin metinde tamamen yok sayılması, sessizlikle "
        "atlanmasıdır (Hikâye = N gün/yıl, Metin = 0). 'Ertesi sabah uyandığında...' veya bölümler "
        "arasına konan boş bir satır en yaygın eksilti biçimidir."
    )

    pdf.bilgi_kutusu(
        "Yazar İçin Ritim Kuralı",
        "Tüm romanı 'sahne' hızında yazarsanız metin hantallaşır ve gereksiz ayrıntılarda boğulur. "
        "Tüm romanı 'özet' hızında yazarsanız metin duygu üretmeyen kuru bir rapora dönüşür. Büyük "
        "yazarlar, önemsiz geçişleri 'özet' ve 'eksilti' ile hızla aşar; can alıcı kriz anlarında "
        "ise 'sahne' ve 'duraklama'ya geçerek zamanı genişletir."
    )

    # 3. SIKLIK
    pdf.alt_alt_bolum("3. SIKLIK (Fréquence): Tekrar ve Alışkanlık")

    pdf.paragraf(
        "Sıklık, bir olayın gerçekte kaç kez gerçekleştiği ile metinde kaç kez anlatıldığı "
        "arasındaki ilişkidir. Üç temel biçimi vardır:"
    )

    pdf.kavram_tanimi(
        "Tekil Anlatı (Récit Singulatif)",
        "Bir kez gerçekleşen bir olayın bir kez anlatılmasıdır (1x / 1x). En temel anlatı tarzıdır: "
        "'Dün akşam kapı çalındı ve içeri Ali girdi.'"
    )

    pdf.kavram_tanimi(
        "Yinelenişli / Alışkısal Anlatı (Récit Itératif)",
        "Gerçekte pek çok kez tekrarlanan bir olayın metinde tek bir kez toptan anlatılmasıdır "
        "(Nx / 1x). Genellikle geçmiş zamanın rivayeti veya geniş zamanla kurulur: 'Proust'un "
        "anlatıcısının 'Uzun zaman geceleri erkenden yatardım' demesi veya 'Her pazar sabahı "
        "erkenden kalkar, balıkçı kahvesinde çay içerdi' ifadesi buna örnektir. Karakterin "
        "rutinini ve dünyasını kurmak için kullanılır."
    )

    pdf.kavram_tanimi(
        "Yinelemeli Anlatı (Récit Répétitif)",
        "Gerçekte yalnızca bir kez yaşanmış bir olayın metinde defalarca, farklı açılardan veya "
        "farklı biçimlerde anlatılmasıdır (1x / Nx). Travmatik deneyimlerin yansıtılmasında "
        "veya 'Rashomon' benzeri çoklu bakış açısı kurgularında hayati rol oynar."
    )

    # 4. KİP
    pdf.alt_alt_bolum("4. KİP (Mode): Mesafe ve Odaklanma")

    pdf.paragraf(
        "Kip, anlatı bilgisinin okura hangi filtreden ve ne kadar mesafeyle aktarıldığını belirler. "
        "Genette burada Platon'dan beri tartışılan iki temel aktarım tarzını yeniden formüle eder:\n"
        "• Gösterme (Mimesis): Araya anlatıcının yorumu girmeden olayların ve konuşmaların dolaysız "
        "sunulması ('Show, don't tell' ilkesinin atası).\n"
        "• Anlatma (Diegesis): Olayların anlatıcının filtresinden geçirilerek, özetlenerek ve "
        "yorumlanarak aktarılması."
    )

    pdf.paragraf(
        "Kip başlığının en devrimci kavramı ise Odaklanma'dır (Focalisation). Genette, 'Kim konuşuyor?' "
        "(anlatıcı) sorusu ile 'Kim görüyor/algılıyor?' (odaklayıcı) sorusunu kesin çizgilerle "
        "birbirinden ayırmıştır. Odaklanma üçe ayrılır:"
    )

    pdf.kavram_tanimi(
        "Sıfır Odaklanma (İlahi / Hâkim Bakış)",
        "Anlatıcı karakterlerden çok daha fazlasını bilir (Anlatıcı > Karakter). Karakterlerin "
        "aklından geçenleri, geçmişlerini, geleceklerini ve aynı anda başka yerlerde olan olayları "
        "tüm çıplaklığıyla görür. Geleneksel 19. yüzyıl klasik romanının temel kipidir."
    )

    pdf.kavram_tanimi(
        "İç Odaklanma (Sınırlı / Kahraman Bakışı)",
        "Anlatı bütünüyle belirli bir karakterin algı, duyu ve bilgi sınırlarına hapsedilir "
        "(Anlatıcı = Karakter). Okur, yalnızca o karakterin gördüklerini görür, bildiklerini bilir. "
        "Sabit iç odaklanma (tek karakter), değişken iç odaklanma (farklı bölümlerde farklı karakterler) "
        "veya çoğul iç odaklanma (aynı olayı farklı karakterlerin zihninden art arda izleme) olabilir."
    )

    pdf.kavram_tanimi(
        "Dış Odaklanma (Nesnel / Kamera Bakışı)",
        "Anlatıcı karakterlerden daha azını bilir (Anlatıcı < Karakter). Karakterlerin zihnine, "
        "duygularına asla girilmez; adeta soğuk bir kamera gibi sadece dışarıdan görünen eylemler, "
        "jestler ve konuşmalar kaydedilir. Karakterin sırları ve niyetleri okur için bir muammadır "
        "(Dedektif kurguları ve Hemingway tarzı katı realizm)."
    )

    pdf.ornek_kutusu(
        "Odaklanma Değişiminin Türk Romanındaki Gücü",
        "Eser: Ahmet Hamdi Tanpınar — 'Huzur'\n\n"
        "Tanpınar roman boyunca kamerasını Mümtaz'ın omzuna ve zihnine yerleştirir (İç Odaklanma). "
        "İstanbul'un sokakları, eski musiki, Boğaz'ın suları ve Nuran'ın güzelliği salt nesnel "
        "birer dekor değildir; bütünüyle Mümtaz'ın estetik hassasiyeti, melankolisi ve zihinsel "
        "çağrışımlarıyla renklenir. Okur Nuran'ı bağımsız bir nesne olarak değil, Mümtaz'ın arzu dolu "
        "ve kaygılı bilincinin ona giydirdiği tülün ardından tanır.",
        "İç odaklanma tercihi, metni sıradan bir aşk hikâyesi olmaktan çıkarıp derinlikli bir içsel "
        "monoloğa ve medeniyet buhranının ruhsal anatomisine dönüştürür."
    )

    # 5. SES VE METALEPSİS
    pdf.alt_alt_bolum("5. SES (Voix) ve Anlatısal Aşırma (Metalepsis)")

    pdf.paragraf(
        "Ses, anlatma eyleminin kendisine, yani 'Kim konuşuyor?' sorusuna odaklanır. "
        "Genette anlatıcıyı üç eksende sınıflandırır:\n\n"
        "A. Zaman İlişkisi:\n"
        "• Sonradan Anlatım (Ulterior): Olaylar bittikten sonra geçmiş zamanla anlatım (en yaygın).\n"
        "• Önceden Anlatım (Anterior): Gelecek zaman kipiyle, kehanet biçiminde anlatım.\n"
        "• Eşzamanlı Anlatım (Simultaneous): Olay anında, şimdiki zaman kipiyle anlatım.\n"
        "• Araya Girerek Anlatım (Intercalated): Mektup veya günlük romanlarında olduğu gibi, olaylar "
        "yaşanırken parça parça kaleme alınan anlatım.\n\n"
        "B. Düzey İlişkisi:\n"
        "• Çerçeve/Metin-dışı Anlatıcı (Extradiegetic): Hikâyenin dışındaki ilk anlatıcı sesi.\n"
        "• Metin-içi Anlatıcı (Intradiegetic): Çerçeve anlatının içindeki bir karakterin anlatıcı olması (örn: Binbir Gece Masalları'nda Şehrazat).\n"
        "• Alt-anlatı (Metadiegetic): Karakterin anlattığı hikâyenin içindeki bir başka hikâye.\n\n"
        "C. Kişi / Katılım İlişkisi:\n"
        "• Heterodiegetik Anlatıcı: Kendi anlatmadığı bir hikâyeyi üçüncü şahıs olarak aktaran anlatıcı.\n"
        "• Homodiegetik Anlatıcı: Hikâyenin içinde bir karakter (tanık veya yardımcı) olan birinci şahıs anlatıcı (örn: Sherlock Holmes'u anlatan Dr. Watson).\n"
        "• Otodiegetik Anlatıcı: Hikâyenin bizzat başkahramanı olan birinci şahıs anlatıcı."
    )

    pdf.kavram_tanimi(
        "Metalepsis (Anlatısal Aşırma / Sınır İhlali)",
        "Anlatı düzeyleri arasındaki ontolojik sınırın kasıtlı, şaşırtıcı ve tekinsiz biçimde "
        "ihlal edilmesidir. Örneğin yazarın aniden metnin içine girip kahramanıyla tartışması, "
        "veya bir karakterin sayfaları çeviren okura doğrudan seslenerek kitaptan çıkmaya çalışması."
    )

    pdf.ornek_kutusu(
        "Türk Edebiyatında Metalepsis",
        "Eser: Oğuz Atay — 'Tutunamayanlar'\n\n"
        "Romanın çeşitli yerlerinde anlatıcı, yazdığı metnin bir roman olduğunu açıkça ilan eder; "
        "karakterler yazarla, dipnotlarla ve metnin biçimsel sınırlarıyla alay eder. Turgut Özben "
        "kitabın sonlarına doğru kendi varoluşunun bir kurmaca olduğunu sezer ve okura hitap eder.",
        "Metalepsis, kurmacanın bir yanılsama (illüzyon) olduğu gerçeğini yüzümüze vurarak modernizmin "
        "ve postmodernizmin en güçlü yabancılaştırma araçlarından biri haline gelir."
    )

    pdf.etkinlik_kutusu(
        "Genette Alet Çantası Uygulamaları",
        [
            "DÜZEN: Kronolojik olarak yazılmış bir ayrılık sahnesini, önce bir prolepsis (geleceği haber verme) ile başlatıp ardından dış geriye dönüşle (çocukluk anısıyla) derinleştirin.",
            "SÜRE: Karakterinizin hayatındaki sıkıcı 5 yılı tek bir 'özet' cümlesiyle geçin; ardından gelen 30 saniyelik bir tartışmayı iki sayfalık ayrıntılı bir 'sahne' olarak yazın.",
            "KİP: Aynı odaya giren iki kişinin karşılaşmasını önce 'Dış Odaklanma' (soğuk bir kamera) ile, ardından taraflardan birinin 'İç Odaklanması' ile kaleme alın."
        ]
    )

    pdf.tartisma_sorulari([
        "Bir romanda 'Sıfır Odaklanma' (İlahi Bakış) kullanmak yazara muazzam bir özgürlük sağlarken, okurun karakterle özdeşleşmesini nasıl zedeleyebilir?",
        "Genette'in süre kategorilerini bilinçli kullanmayan bir yazarın metninde ne tür ritim ve tempo kusurları ortaya çıkar?"
    ])

    pdf.bos_satir(1)

    # ─────────────────────────────────────────────────────────────────────────
    # 5.4 ANLATICI, BAKIŞ VE BİLİNÇ SUNUMU
    # ─────────────────────────────────────────────────────────────────────────
    pdf.alt_bolum("Anlatıcı, Bakış ve Bilinç Sunumu")

    pdf.paragraf(
        "Anlatıbilimin en büyüleyici cephesi, insan zihninin ve iç dünyasının kurmaca metin "
        "üzerinde nasıl temsil edildiğini inceleyen alandır. Yazarın sesi kimdir? Sayfadaki kelimeler "
        "ile karakterin bilinci arasındaki perde nasıl aralanır?"
    )

    # Booth
    pdf.alt_alt_bolum("Wayne C. Booth: Örtük Yazar ve Güvenilmez Anlatıcı")

    pdf.paragraf(
        "Amerikalı kuramcı Wayne C. Booth, 1961 tarihli 'Kurmacanın Retoriği' (The Rhetoric of Fiction) "
        "kitabında edebiyat kuramına iki vazgeçilmez kavram kazandırmıştır:\n"
        "1. ÖRTÜK YAZAR (Implied Author): Kanlı canlı etten kemikten yazar ile anlatıcı arasındaki "
        "ikinci benliktir. Metnin bütününe sinmiş etik, estetik ve felsefi duruştur. Yazar gerçek "
        "hayatta huysuz veya bencil biri olabilir; fakat romanın örtük yazarı merhametli ve bilge "
        "bir dünya görüşünü temsil edebilir.\n"
        "2. GÜVENİLMEZ ANLATICI (Unreliable Narrator): Bildirdikleri, iddiaları veya ahlaki yargıları "
        "örtük yazarın değerler sistemiyle açıkça çatışan anlatıcıdır."
    )

    pdf.kavram_tanimi(
        "Güvenilmez Anlatıcı",
        "Olayları eksik, taraflı, yanıltıcı veya çarpıtılmış biçimde aktaran; akli dengesizliği, "
        "yaş küçüklüğü, aşırı kibri, ideolojik körlüğü veya suçluluğu sebebiyle aktardıklarına "
        "şüpheyle yaklaşılması gereken anlatıcı figürü."
    )

    pdf.ornek_kutusu(
        "Türk Edebiyatında Kusursuz Bir Güvenilmez Anlatıcı",
        "Eser: Yusuf Atılgan — 'Anayurt Oteli'\n\n"
        "Anlatıcı, otel kâtibi Zebercet'in iç dünyasını ve gündelik rutinini aktarırken Zebercet'in "
        "zihinsel saplantılarını, 'gecikmeli Ankara treniyle gelen kadın'a dair gerçek dışı fantezilerini "
        "ve bastırılmış saldırganlığını son derece sıradan ve doğal olaylarmış gibi yansıtır.",
        "Okur, anlatılanların nesnel bir gerçeklik mi yoksa Zebercet'in giderek cinnete ve intihara "
        "sürüklenen marazi zihninin birer hezeyanı mı olduğunu satır aralarındaki çatlaklardan "
        "keşfetmek zorundadır. Yazar okuru doğrudan uyarmaz; gerçeği örtük yazarın ipuçlarıyla sezdirir."
    )

    # Stanzel
    pdf.alt_alt_bolum("Franz K. Stanzel: Üç Anlatı Durumu")

    pdf.paragraf(
        "Avusturyalı kuramcı Franz K. Stanzel, 'A Theory of Narrative' (1979) adlı eserinde anlatıları "
        "üç ana tipik durum etrafında dairesel bir eksende modeller:\n"
        "1. Ben-Anlatı Durumu (First-Person Narrative): Anlatıcı kendi hikâyesini bizzat 'ben' diyerek "
        "anlatır; deneyimleyen ben (erlebendes Ich) ile anlatan ben (erzählendes Ich) arasındaki mesafe esere derinlik katar.\n"
        "2. Yazar-Anlatıcı Durumu (Authorial Narrative): Üçüncü şahısla konuşan, olayların dışındaki, "
        "her şeyi bilen, zaman zaman okura doğrudan seslenip dersler veren geleneksel anlatıcıdır (örn: Ahmet Mithat Efendi geleneği).\n"
        "3. Figüral Anlatı Durumu (Figural Narrative): Dışarıda bağımsız bir anlatıcı sesi yok gibidir; "
        "olaylar bütünüyle roman kişisinin (reflektör figür) algı süzgecinden akar. Anlatıcı adeta "
        "karakterin arkasına saklanıp saydamlaşmıştır."
    )

    # Dorrit Cohn
    pdf.alt_alt_bolum("Dorrit Cohn: Bilinç Sunumunun Üç Yolu")

    pdf.paragraf(
        "Dorrit Cohn, 1978 tarihli 'Transparent Minds' (Şeffaf Zihinler) adlı başyapıtında kurmaca "
        "kişilerinin iç dünyalarının, düşüncelerinin ve bilinç akışlarının metne nasıl döküldüğünü "
        "üç kusursuz teknik kategoriye ayırır. Bu tablo, her yazarın ezbere bilmesi gereken bir zanaat haritasıdır:"
    )

    pdf.tablo_basit(
        ["Teknik", "Anlatıcı Varlığı", "Gramer ve Kip", "Türkçe Örnek Cümle"],
        [
            ["1. Psiko-anlatı\n(Psycho-narration)", "En yüksek düzeyde;\nanlatıcı açıklar.", "3. Tekil şahıs,\ngeçmiş zaman.", "İçinde kabaran öfkenin asıl nedeninin kıskançlık olduğunu kendisine bile itiraf edemiyordu."],
            ["2. Alıntılanmış Monolog\n(Quoted Monologue)", "Sıfır düzeyde;\nkarakter doğrudan konuşur.", "1. Tekil şahıs,\nşimdiki/geniş zaman.", "'Neden buradayım ki?' diye düşündü. 'Beni asla anlamayacaklar, hemen çekip gitmeliyim.'"],
            ["3. Anlatılan Monolog\n(Serbest Dolaylı Anlatım)", "Anlatıcı ve karakterin\nsesi iç içe geçer.", "3. Tekil şahıs,\ngeçmiş zaman kipi.", "Neden buradaydı sanki? Onu asla anlamayacaklardı; hemen oradan çekip gitmeliydi!"]
        ],
        [40, 40, 45, 65]
    )

    pdf.paragraf(
        "Serbest Dolaylı Anlatım (Anlatılan Monolog), modern edebiyatın en büyük icatlarından biridir. "
        "Gustave Flaubert ile mükemmelleşen bu teknikte tırnak işaretleri ve 'diye düşündü' gibi takılar "
        "kalkar; dilbilgisel olarak üçüncü şahıs geçmiş zaman sürerken, seçilen sözcükler, ünlemler ve "
        "ritim bütünüyle karakterin iç sesine dönüşür. Anlatıcı ile karakter arasındaki mesafe erir."
    )

    # Postklasik Anlatıbilim
    pdf.alt_alt_bolum("Postklasik Anlatıbilimdeki Yeni Ufuklar")

    pdf.paragraf(
        "1980'lerden sonra klasik yapısalcı anlatıbilim kabuğunu kırarak disiplinlerarası yeni "
        "pencereler açmıştır. Yazar adayının bu güncel eğilimleri tanıması kurgu ufkunu genişletir:\n"
        "• Bilişsel Anlatıbilim (Cognitive Narratology): Okurun metni okurken zihninde nasıl bir dünya "
        "kurduğunu, 'Zihin Teorisi' (Theory of Mind) mekanizmasıyla karakterlerin niyetlerini nasıl "
        "çözümlediğini ve empati süreçlerini inceler (Monika Fludernik, Lisa Zunshine).\n"
        "• Retorik Anlatıbilim (Rhetorical Narratology): Anlatının yazar ile okur arasında etik ve "
        "duygusal bir iletişim ve ikna eylemi olduğunu savunur (James Phelan).\n"
        "• Feminist Anlatıbilim: Anlatı sesinin, bakış açısının ve olay örgüsü modellerinin cinsiyetçi "
        "kodlarını sorgular; alternatif kadın anlatı yapıları önerir (Susan Lanser, Robyn Warhol).\n"
        "• Olası Dünyalar Kuramı (Possible Worlds Theory): Kurmacayı boş bir fantezi değil, gerçekleşmemiş "
        "mantıksal olası dünyalar bütünü olarak kuramsallaştırır (Marie-Laure Ryan, Lubomír Doležel).\n"
        "• Doğal Olmayan / Gayritabii Anlatıbilim (Unnatural Narratology): Fiziksel veya mantıksal olarak "
        "imkânsız anlatıları inceler: Ölü bir anlatıcının mezardan konuşması, ikinci şahısla ('sen') "
        "yazılan romanlar, döngüsel veya çelişkili zamanlar (Jan Alber, Brian Richardson).\n"
        "• Transmedya Anlatıbilim: Aynı hikâye evreninin roman, çizgi roman, video oyunu ve sinema "
        "arasında parçalara ayrılarak çoklu mecralarda genişletilmesini araştırır."
    )

    pdf.etkinlik_kutusu(
        "Bilinç Sunumu Laboratuvarı",
        [
            "Çok sevdiği bir dostunun başarısını kıskanan bir karakter hayal edin. Bu kıskançlık krizini önce 'Psiko-anlatı' yöntemiyle, anlatıcı olarak dışarıdan tahlil edin.",
            "Aynı sahneyi karakterin kafasının içine girerek 'Alıntılanmış İç Monolog' (doğrudan düşünce) olarak yazın.",
            "Son olarak sahneyi 'Serbest Dolaylı Anlatım'a dönüştürün: Üçüncü şahıs zamirlerini koruyun ama kıskançlığın yarattığı alaycı ve öfkeli dili anlatıcının sesine bulaştırın."
        ]
    )

    pdf.tartisma_sorulari([
        "Serbest Dolaylı Anlatım tekniğinin yaygınlaşması, okurun metindeki ahlaki yargıları belirlemesini neden zorlaştırır? Bu durum edebiyat için bir zenginlik midir?",
        "Güvenilmez bir anlatıcı yaratırken ipin ucunu kaçırıp okuru tamamen yabancılaştırma ve anlatıdan soğutma tehlikesi nasıl bertaraf edilebilir?"
    ])

    pdf.bos_satir(1)

    # ─────────────────────────────────────────────────────────────────────────
    # 5.5 ANLATI YAPI MODELLERİ (MİMARİ ŞABLONLAR)
    # ─────────────────────────────────────────────────────────────────────────
    pdf.alt_bolum("Anlatı Yapı Modelleri")

    pdf.paragraf(
        "Kurmaca metin bir ilham patlamasından ibaret değildir; sağlam bir iskelet ve mimari "
        "plan gerektirir. Yüzyıllar boyunca tiyatro yazarları, romancılar ve senaristler, "
        "okurun merakını ve duygulanımını en üst noktaya taşıyan yapısal kalıplar geliştirmişlerdir. "
        "Aşağıdaki karşılaştırmalı tablo, dünya edebiyatında ve dramatik sanatlarda en sık kullanılan "
        "büyük yapı modellerini özetlemektedir:"
    )

    pdf.tablo_basit(
        ["Model / Kuramcı", "Aşama Sayısı", "Temel Felsefe", "Güçlü Yönü", "Risk / Zayıf Yönü"],
        [
            ["Aristoteles\n(Poetika)", "3 Parça\n(Baş-Orta-Son)", "Organik bütünlük ve nedensellik bağı.", "Evrensel sadelik ve sağlam omurga.", "Ayrıntılı rehberlik sunmaz, çok geneldir."],
            ["Gustav Freytag\n(Piramit)", "5 Evre\n(Giriş-Yükseliş-Zirve-İniş-Yıkım)", "Klasik dramatik trajedi tırmanışı.", "Dramatik gerilimi doruğa tırmandırma gücü.", "Trajedi odaklıdır; açık uçlu modern metinlere uymaz."],
            ["Syd Field\n(Üç Perde)", "3 Perde\n(2 Kırılma Noktası)", "Tez, antitez, sentez dengesi.", "Olay akışını kusursuz tempo ile yönetme.", "Aşırı formülcülük ve mekanik kurgu tehlikesi."],
            ["Joseph Campbell\n(Kahramanın Yolculuğu)", "12-17 Aşama\n(Monomit)", "Kolektif bilinçdışı ve ruhsal olgunlaşma.", "Derin arketipsel rezonans ve mitik güç.", "Tekrara düşme, klişeleşme ve ataerkil kalıplar."],
            ["Robert McKee\n(Öykü Tasarımı)", "Olay Tasarımı\n(Tetikleyici-Kriz-Doruk)", "Değer yüklerinin zıddına dönmesi.", "Karakterin içsel dönüşümünü eylemle sınama.", "Geleneksel olay örgüsüz metinleri dışlama eğilimi."],
            ["Dan Harmon\n(Story Circle)", "8 Adım\n(Konfor-İstek-Arayış-Dönüş)", "Döngüsel karakter yolculuğu.", "Hızlı, dinamik ve modern kurgu tasarımı.", "Hafif ve popüler anlatılara hapsolma riski."],
            ["Blake Snyder\n(Save the Cat)", "15 Vuruş\n(Beat Sheet)", "Dakika/Sayfa bazlı kesin ritim planı.", "Sektörel standart ve kusursuz ticari tempo.", "Özgünlüğü öldüren katı şablonculuk."],
            ["Kishōtenketsu\n(Doğu Geleneği)", "4 Aşama\n(Giriş-Gelişme-Dönüş-Bağlantı)", "Çatışmasız, yan yana getirme estetiği.", "Batı tipi 'çatışma' dayatmasını kırma özgürlüğü.", "Batılı okura fazla durağan veya dağınık gelebilme."]
        ],
        [35, 25, 45, 45, 40]
    )

    pdf.paragraf(
        "Bu modeller arasında iki tanesi özellikle derinlemesine incelenmeyi hak eder:\n\n"
        "1. KAHRAMANIN YOLCULUĞU (Campbell / Vogler): Kahraman 'Ayrılış' (Olağan Dünya, Maceraya Çağrı, "
        "Çağrının Reddi, Akıl Hocası, İlk Eşiği Aşma), 'Erginlenme' (Sınavlar, Dostlar, Düşmanlar, "
        "En Derin Mağara, Çile/Ölüm ve Yeniden Doğuş, Ödül) ve 'Dönüş' (Geri Dönüş Yolu, Diriliş, "
        "İksirle Dönüş) evrelerinden geçer. Bu yapı aslında insanın kendi içsel karanlığıyla yüzleşip "
        "olgunlaşmasını simgeleyen psikolojik bir metafordur."
    )

    pdf.paragraf(
        "2. KISHŌTENKETSU (Doğu Asya Modeli): Çin ve Japon şiir ve anlatı geleneğinden doğan bu model, "
        "Batı anlatısının merkezinde yer alan 'çatışma ve düşman' kavramına dayanmaz:\n"
        "• Ki (Giriş): Karakterler ve durum tanıtılır.\n"
        "• Shō (Gelişme): Durum derinleştirilir, genişletilir.\n"
        "• Ten (Dönüş / Twist): Önceki iki aşamayla görünürde hiçbir alakası olmayan bambaşka, şaşırtıcı yeni bir unsur sahneye girer.\n"
        "• Ketsu (Bağlantı / Çözüm): Son aşama bu beklenmedik üçüncü unsuru ilk iki aşamayla öyle bir "
        "köprüyle bağlar ki okurun zihninde derin bir aydınlanma ve anlam bütünlüğü parlar."
    )

    pdf.uyari_kutusu(
        "Yapı şablonları yazar için bir hapishane değil, bir iskelettir. İskeleti olmayan bir beden "
        "nasıl bir et yığınına dönüşürse, yapısı olmayan metin de dağılır. Ancak sadece iskeletten ibaret "
        "kalan bir metin de yaşayan bir insan olamaz; ona eti, kanı ve ruhu verecek olan yazarın özgün "
        "dili ve gözlem gücüdür."
    )

    pdf.etkinlik_kutusu(
        "Kishōtenketsu Çatışmasız Kurgu Denemesi",
        [
            "Ki (Giriş): Bir sahaf dükkânında tozlu kitapları tasnif eden ihtiyar bir adamı tanıtın.",
            "Shō (Gelişme): Adamın kitaplara olan sevgisini ve dükkândaki huzurlu rutini anlatın.",
            "Ten (Dönüş): Tamamen alakasız yeni bir sahneye geçin: Okyanusta fırtınaya yakalanmış bir yük gemisinde telsiz başında çaresizce bekleyen genç bir denizciyi yazın.",
            "Ketsu (Bağlantı): Dördüncü paragrafta bu iki dünyayı sarsıcı ve şiirsel bir bağla (örneğin sahafın elindeki 50 yıllık bir seyir defteriyle) birleştirin."
        ]
    )

    pdf.tartisma_sorulari([
        "Hollywood tarzı 'Save the Cat' veya 'Üç Perde' şablonlarının küresel anlatı kültürünü tek tipleştirdiği eleştirisine katılıyor musunuz? Neden?",
        "Çatışma (conflict) olmadan gerçek anlamda sürükleyici bir kurmaca inşa etmek mümkün müdür? Kishōtenketsu bu iddiaya nasıl bir cevap üretir?"
    ])

    pdf.bos_satir(1)

    # ─────────────────────────────────────────────────────────────────────────
    # 5.6 TÜR KURAMI (GENRE THEORY) VE OKUR SÖZLEŞMESİ
    # ─────────────────────────────────────────────────────────────────────────
    pdf.alt_bolum("Tür Kuramı ve Okur Sözleşmesi")

    pdf.paragraf(
        "Edebi türler (polisiye, bilimkurgu, melodram, gotik, tarihsel roman vb.), kütüphanecilerin "
        "kitapları raflara dizmek için kullandığı basit etiketlerden çok daha fazlasıdır. Anlatıbilimsel "
        "açıdan tür, 'yazar ile okur arasında zımnen imzalanmış bağlayıcı bir sözleşmedir' (pacte générique). "
        "Bir kitabın kapağında 'Polisiye Roman' yazdığı an okur, metnin başında bir suç işleneceğini, "
        "bir soruşturma yürütüleceğini ve rasyonel ipuçları üzerinden gerçeğin aydınlatılacağını peşinen "
        "kabul eder. Yazar bu beklentileri yönetmek, beslemek veya sarsmakla yükümlüdür."
    )

    # Northrop Frye
    pdf.alt_alt_bolum("Northrop Frye: Dört Temel Mythos ve Beş Mod")

    pdf.paragraf(
        "Kanadalı büyük kuramcı Northrop Frye, 1957 tarihli 'Eleştirinin Anatomisi' (Anatomy of Criticism) "
        "adlı anıtsal yapıtında insanlık tarihindeki tüm edebi türleri doğanın döngüsüyle (mevsimlerle) "
        "özdeşleştirdiği 'Dört Temel Mythos' (Anlatı Arketipi) altında toplamıştır:\n"
        "1. Bahar Mythos'u (Komedi): Gençlerin aşkının önündeki engeller kalkar; kaos yerini evliliğe, "
        "şenliğe ve toplumsal uzlaşmaya bırakır. Diriliş ve sevinç mevsimidir.\n"
        "2. Yaz Mythos'u (Romance / Destan): Kahramanın canavarlarla savaşıp zafer kazandığı, masalsı "
        "ve erdemli arayışların (quest) zirve yaptığı altın çağdır.\n"
        "3. Güz Mythos'u (Tragedya): Bireyin kaçınılmaz kadere, tanrılara veya toplumsal düzene yenik "
        "düşerek yalnızlaşması, düşüşü ve ölümüdür. Hüzün ve kaçınılmaz son mevsimidir.\n"
        "4. Kış Mythos'u (İroni ve Hiciv): Dünyanın düzeltilemez bir çürüme içinde olduğu, ideallerin "
        "yıkıldığı, kahramanlığın yerini absürde bıraktığı karanlık ve soğuk gerçeklik halidir."
    )

    pdf.paragraf(
        "Frye ayrıca kahramanın eylem gücüne ve çevreye olan üstünlüğüne göre beş temel edebi mod belirler:\n"
        "• Mitos Modu: Kahraman hem diğer insanlardan hem doğa yasalarından üstündür (Tanrılar).\n"
        "• Romantik Mod: Kahraman diğer insanlardan ve doğadan derece olarak üstündür (Masal kahramanları, şövalyeler).\n"
        "• Yüksek Mimetik Mod: Kahraman diğer insanlardan üstündür ama doğa yasalarına boyun eğer (Tragedya kralları, destan liderleri).\n"
        "• Düşük Mimetik Mod: Kahraman ne insanlardan ne doğadan üstündür; bizimle tamamen aynı düzeydedir (Realist ve natüralist roman kişileri).\n"
        "• İronik Mod: Kahraman güç, zekâ veya ahlak bakımından bizden daha zayıf, ezilen veya acınası durumdadır (Kafka'nın Gregor Samsa'sı)."
    )

    pdf.kavram_tanimi(
        "Tür Sözleşmesi (Genre Contract)",
        "Yazarın belirli bir türün kurallarını, motiflerini ve vaatlerini kullanarak okurda "
        "yarattığı beklenti ufku ve bu ufkun metin boyunca idare ediliş biçimi."
    )

    pdf.kavram_tanimi(
        "Tür Melezliği (Genre Hybridity)",
        "Farklı edebi türlerin (örneğin bilimkurgu ile polisiyenin veya tarihsel roman ile "
        "büyülü gerçekçiliğin) bilinçli olarak iç içe geçirilerek yeni bir estetik alan açılması."
    )

    pdf.ornek_kutusu(
        "Türk Edebiyatında Türlerin Melezleşmesi",
        "Eser: İhsan Oktay Anar — 'Puslu Kıtalar Atlası'\n\n"
        "Roman ilk bakışta 17. yüzyıl Osmanlısında geçen bir 'Tarihsel Macera Romanı' gibi kurulur. "
        "Fakat içine girildikçe felsefi bir sorgulama (Descartes'ın 'Düşünüyorum öyleyse varım' "
        "önermesi ve Rendekâr), gizemli bir hafiye/casus teşkilatı kurgusu, Doğu masallarının "
        "büyülü atmosferi ve kabadayı hikâyeleri birbirine harmanlanır.",
        "Anar, tek bir türün sınırlarına sığınmak yerine türlerin kodlarını birbiriyle çarpıştırır. "
        "Tarihsel gerçeklik ile metafizik rüya arasındaki sınır erir; ortaya postmodern bir tür melezliği çıkar."
    )

    pdf.bilgi_kutusu(
        "Yazarın Tür Stratejisi",
        "Tür kalıplarını bütünüyle reddetmek çoğu zaman okurla kurulan bağı koparır; tür kalıplarına "
        "körü körüne teslim olmak ise metni bayat bir klişeye dönüştürür. Usta yazar, türün kurallarını "
        "çok iyi bildiğini okura hissettirir, okurun beklentisini inşa eder ve tam en rahatladığı "
        "anda o beklentiyi zekice altüst ederek (subversion) şaşırtır."
    )

    pdf.etkinlik_kutusu(
        "Tür Sözleşmesini Kırma Egzersizi",
        [
            "Klasik bir 'Cinayet Masası Polisiye' açılışı yazın: Yağmurlu bir gecede cinayet mahalline gelen tecrübeli komiser cesedi incelesin.",
            "İkinci sayfada tür sözleşmesini beklenmedik biçimde kırın: Olayı bilimkurguya (zaman yolcusu cesedi) veya metafizik masala dönüştürecek bir ipucu yerleştirin.",
            "Komiserin bu tür kırılması karşısındaki şaşkınlığını Serbest Dolaylı Anlatım kipiyle kaleme alın."
        ]
    )

    pdf.tartisma_sorulari([
        "Postmodern edebiyatta tür sınırlarının bu denli belirsizleşmesi, tür kuramını hükümsüz kılmış mıdır yoksa tam tersine tür bilgisini yazar için daha mı hayati hale getirmiştir?",
        "Northrop Frye'ın 'Kış / İroni' mythos'unun 20. ve 21. yüzyıl edebiyatına bu denli egemen olmasının arkasında hangi tarihsel ve toplumsal kırılmalar yatmaktadır?"
    ])

    pdf.bos_satir(1)

    # ─────────────────────────────────────────────────────────────────────────
    # BÖLÜM ÖZETİ
    # ─────────────────────────────────────────────────────────────────────────
    pdf.bolum_ozeti([
        "Anlatıbilim, metnin 'ne anlama geldiğini' değil; 'nasıl inşa edildiğini' ve okur üzerindeki etkisini hangi yapısal mekanizmalarla ürettiğini inceleyen en doğrudan yazar aletidir.",
        "Fabula (ham olaylar kronolojisi) ile Sjuzhet (olayların metindeki sanatsal kurgusu) ayrımı; E. M. Forster'ın nedensellik bağıyla temellendirdiği hikâye-olay örgüsü ayrımıyla buluşur.",
        "Vladimir Propp masallarda isimler değişse de 31 temel işlevin ve 7 eylem alanının sabit kaldığını kanıtlamış; bu omurga modern epik anlatıların temeli olmuştur.",
        "Greimas'ın Aktant Modeli, anlatıdaki rolleri 3 temel eksen (Arzu, İletişim, Güç) üzerinde 6 soyut işleve (Özne, Nesne, Gönderici, Alıcı, Yardımcı, Engelleyici) bağlar.",
        "Todorov, anlatının 5 evreli denge dönüşümü olduğunu formüle etmiş; doğaüstü olaylar karşısındaki 'tereddüt anı'nı saf fantastik olarak tanımlamıştır.",
        "Roland Barthes, metinlerin Çekirdek ve Tamamlayıcı işlevler ile Belirtilerden örüldüğünü; S/Z'deki beş temel kodun (HER, ACT, SEM, SYM, REF) okuma eylemini yönettiğini gösterir.",
        "Gérard Genette'in anlatı söylemi anatomisi; Düzen (analepsis, prolepsis), Süre (duraklama, sahne, özet, eksilti), Sıklık (tekil, alışkısal, yinelemeli), Kip (sıfır, iç, dış odaklanma) ve Ses (zaman, düzey, kişi) kategorileriyle yazara eksiksiz bir teknik alet çantası sunar.",
        "Metalepsis, anlatı düzeyleri arasındaki duvarların kasıtlı olarak yıkılmasıyla kurmacanın illüzyonunu açık eden sarsıcı bir modern ve postmodern stratejidir.",
        "Wayne C. Booth'un 'Örtük Yazar' ve 'Güvenilmez Anlatıcı' kavramları, kurmacanın etik ve retorik boyutunu kavramak için vazgeçilmezdir.",
        "Dorrit Cohn'un bilinç sunumu sınıflaması (Psiko-anlatı, Alıntılanmış Monolog, Anlatılan Monolog / Serbest Dolaylı Anlatım), zihnin metne tercümesindeki temel üç yolu belirler.",
        "Aristoteles'ten Freytag'a, Üç Perde'den Campbell ve Kishōtenketsu'ya kadar anlatı yapı şablonları, formülcülüğe saplanmadan kullanıldığında yazarın mimari iskeletidir.",
        "Edebi türler yazar ile okur arasında imzalanmış birer beklenti sözleşmesidir; usta yazar türün kurallarını derinlemesine bilerek onları zekice dönüştürür ve melezleştirir."
    ])
