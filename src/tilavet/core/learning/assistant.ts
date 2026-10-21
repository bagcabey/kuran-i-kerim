import { trNormalize } from '../text/trNormalize.js';

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  references?: string[];
  disclaimer?: string;
  suggestedActions?: { label: string; actionType: 'navigate' | 'query'; payload: string }[];
}

export const GUARDRAIL_DISCLAIMER =
  "⚠ Bu asistan pedagojik ve teknik rehberlik amaçlıdır. Bir kıraat hocasının (fem-i muhsin) canlı denetiminin yerine geçemez; ayetler üzerinde kesin dinî fetva veya hüküm veremez.";

export const ASSISTANT_TOPICS = [
  { id: 'elifba', label: 'Kur’an harfleri ve mahreç', prompts: ['Arapça harfleri çalışmak istiyorum', 'Mahreçleri nasıl öğrenebilirim?'] },
  { id: 'tecvid', label: 'Tecvid kuralları', prompts: ['Tecvid kurallarına nereden başlamalıyım?', 'Nûn-ı sâkin ve tenvin hükümleri nelerdir?'] },
  { id: 'vakif', label: 'Vakıf, ibtidâ ve duraklar', prompts: ['Durak işaretlerini açıklar mısın?', 'Nerede durup nereden başlamalıyım?'] },
  { id: 'qiraat', label: 'Kıraat ve rivayet', prompts: ['Hafs rivayeti nedir?', 'Kıraat ile makam arasındaki fark nedir?'] },
  { id: 'makam', label: 'Makam ve tilavet geleneği', prompts: ['Makamlar tilavette nasıl kullanılır?', 'Rast makamı nedir?'] },
  { id: 'ses', label: 'Ses, nefes ve sağlık', prompts: ['Güvenli nefes egzersizi önerir misin?', 'Sesimi yormadan nasıl çalışırım?'] },
  { id: 'study', label: 'Ezber ve çalışma planı', prompts: ['Yeni başlayanlar için günlük plan hazırla', 'Ezberimi nasıl tekrar etmeliyim?'] },
  { id: 'meaning', label: 'Kur’an’ın anlamı ve kavramlar', prompts: ['Meal ile tefsir arasındaki fark nedir?', 'Bir âyetin bağlamını nasıl incelemeliyim?'] },
  { id: 'religion', label: 'İslam hakkında genel bilgi', prompts: ['İslam hakkında hangi konularda yardımcı olabilirsin?', 'Hadis ve sünnet kavramlarını açıkla'] },
  { id: 'fiqh', label: 'İbadet ve fıkıh soruları', prompts: ['Namazla ilgili genel bilgi istiyorum', 'Fıkhî bir konuda güvenilir merciye nasıl başvururum?'] }
] as const;

const KNOWLEDGE_BASE: { keywords: string[]; title: string; answer: string; references: string[] }[] = [
  {
    keywords: ['izhar', 'izhar nedir', 'izhar harfleri', 'bogaz harfleri'],
    title: 'İzhâr Kuralı (Açığa Çıkarma)',
    answer: 'İzhâr; sözlükte açığa çıkarmak, beyan etmek demektir. Tecvid ıstılahında, nûn-ı sâkin veya tenvinden sonra boğaz harflerinden biri (ء, هـ, ع, ح, غ, خ - Hemze, Hâ, Ayn, Hâ, Gayn, Hâ) geldiğinde, nûn harfini gunnesiz, tabii mahrecinde net olarak okumaktır.\n\nÖrnekler:\n- مَنْ آمَنَ (Men âmene)\n- أَنْعَمْتَ (En\'amte)\n- عَفُوًّا غَفُورًا (Afuvven Gafûrâ)\n\nÖlçü: Nûn sesi duraklamadan, sarsılmadan veya uzatılmadan berrak biçimde telaffuz edilir.',
    references: ['İbnü\'l-Cezerî, el-Mukaddimetü\'l-Cezeriyye', 'Tuhfetü\'l-Etfâl', 'Tecvîd-i Karabaş']
  },
  {
    keywords: ['ihfa', 'ihfa nedir', 'ihfa harfleri', 'haysum'],
    title: 'İhfâ Kuralı (Gizleme ve Geniz Sesi)',
    answer: 'İhfâ; gizlemek demektir. Nûn-ı sâkin veya tenvinden sonra 15 ihfâ harfinden biri geldiğinde (ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك), nûn sesi izhâr ile idğâm arasında, genizden (hayşum) gunneyle okunur. Ölçüyü hareke üzerinden, kendi rivayetinizin talimine göre çalışın.\n\nÖrnekler:\n- أَنْ كَانَ (Eng kâne)\n- مِنْ قَبْلِ (Ming kabli)\n- كِتَابٌ كَرِيمٌ (Kitâbung kerîm)\n\nÖnemli: Harfi doğru mahrecinde çıkarın; uygulama için hocadan dinleyip okuyuşunuza düzeltme alın.',
    references: ['Süleyman Çelebi, Tecvîd-i Karabaş', 'Tuhfetü\'l-Etfâl', 'el-Cezeriyye']
  },
  {
    keywords: ['idgam', 'idgam nedir', 'idgam-i maal gunne', 'idgam-i bila gunne', 'idgam cesitleri'],
    title: 'İdğâm Kuralları (Birbirine Katma)',
    answer: 'İdğâm; sâkin bir harfi sonraki harekeli harfe katarak şeddeli tek bir harf gibi okumaktır:\n1. İdğâm-ı Ma\'a\'l-Gunne (Gunneli): Nûn-ı sâkin veya tenvinden sonra Y-M-N-V (ي م ن و - Yemnu) harfleri geldiğinde gunneyle okunur (Örn: مَنْ يَقُولُ - Meyyekūlu).\n2. İdğâm-ı Bilâ-Gunne (Gunnesiz): L ve R (ل ر) harfleri geldiğinde gunnesiz idğâm yapılır (Örn: مِنْ رَبِّهِمْ - Mirrabbihim).\n3. İdğâm-ı Misleyn: Aynı iki harf peş peşe geldiğinde (Örn: عَصَوْا وَكَانُوا).\n4. İdğâm-ı Mütecâniseyn: Mahreçleri bir, sıfatları farklı harflerde (Örn: قَدْ تَبَيَّنَ).\n5. İdğâm-ı Mütekāribeyn: Mahreç veya sıfatları yakın harflerde (Örn: قُلْ رَبِّ).\nGunne ve süre ölçüsünü kendi rivayetiniz ve hocanızın talimine göre çalışın.',
    references: ['el-Cezeriyye, Bâbu\'l-İdğâm', 'Hidâyetü\'l-Kārî']
  },
  {
    keywords: ['iklab', 'iklab nedir', 'mimleme'],
    title: 'İklâb Kuralı (Mîm\'e Çevirme)',
    answer: 'İklâb; bir sesi başka bir sese çevirmek demektir. Nûn-ı sâkin veya tenvinden sonra B (ب) harfi geldiğinde nûn sesi mîm sesine çevrilir ve gunneyle okunur; dudaklar aşırı bastırılmaz. Gunne ölçüsünü kendi rivayetiniz ve hocanızın talimine göre çalışın.\n\nÖrnekler:\n- مِنْ بَعْدِ (Mim-ba\'di)\n- كَلَّا لَيُنْبَذَنَّ (Leyümbezenne)\n- سَمِيعٌ بَصِيرٌ (Semî\'um-basîr)',
    references: ['Hidayetü\'l-Kârî', 'Tuhfetü\'l-Etfâl']
  },
  {
    keywords: ['medd', 'medd cesitleri', 'meddi muttasil', 'meddi munfasil', 'elif miktari'],
    title: 'Medd Hükümleri ve Ölçüsü',
    answer: 'Medd; uzatmak demektir. Harf-i med (Elif, Vâv, Yâ) üzerine sebeb-i med (Hemze veya Sükûn) gelmesiyle oluşur:\n- Medd-i Tabîî: Sebeb-i med olmadan harfin doğal ölçüsünde uzatılmasıdır.\n- Medd-i Muttasıl: Harf-i med ile hemze aynı kelimede birleşir.\n- Medd-i Munfasıl: Harf-i med bir kelimenin sonunda, hemze diğer kelimenin başında olur.\nUzatma miktarları rivayet, tarik ve okuyuş usulüne göre öğretilir; saniyeye sabitlemek doğru değildir. Kendi okuyuş yolunuz için hocanızın ölçüsünü izleyin.',
    references: ['İbnü\'l-Cezerî, et-Temhîd fî İlmi\'t-Tecvîd', 'Şâtıbiyye']
  },
  {
    keywords: ['meddi ariz', 'medd-i ariz', 'ariz sukun', 'vakif halleri'],
    title: 'Medd-i Ârız ve Vakıf Hükümleri',
    answer: 'Medd-i Ârız; harf-i medden sonra durak (vakıf) sebebiyle sonradan ortaya çıkan geçici (ârızî) sükûn geldiğinde oluşur.\n\nHükmü câizdir. Son harfin harekesine göre çekme ve vecih imkanları:\n- Üstün ise: Tûl (4 elif), Tevessut (2-3 elif), Kasr (1 elif) - 3 vecih.\n- Esre ise: 3 vecih + Revm (hafif hareke fısıltısı) ile 4 vecih.\n- Ötre ise: 3 vecih + İşmâm (dudakları öne toplama) + Revm ile 7 vecih câizdir.',
    references: ['Cezeriyye Şerhleri', 'Tecvîd-i Karabaş']
  },
  {
    keywords: ['meddi lazim', 'medd-i lazim', 'kelime musakkale', 'kelime muhaffefe'],
    title: 'Medd-i Lâzım Hükmü',
    answer: 'Medd-i Lâzım; harf-i medden sonra aslî (vakfen ve vaslen baki kalan) sükûn geldiğinde meydana gelir.\n\nHükmü ittifakla VACİPTİR. Bütün imamlara göre 4 elif miktarı uzatılır.\n4 kısımdır:\n1. Kelime-i Musakkale: Şeddeli kelimede (Örn: وَلَا الضَّالِّينَ - ed-Dââllîn)\n2. Kelime-i Muhaffefe: Cezimli kelimede (Örn: آلْآنَ - Âl-âne)\n3. Harf-i Musakkale: Hurûf-ı mukattaada şeddeli idğam olanlar (Örn: Elif-Lâââm-Mîîîm\'deki Lâm)\n4. Harf-i Muhaffefe: Cezimli harflerde (Örn: Sâââd, Kāââf).',
    references: ['el-Mukaddimetü\'l-Cezeriyye']
  },
  {
    keywords: ['meddi lin', 'medd-i lin', 'lin harfleri'],
    title: 'Medd-i Lîn Kuralı',
    answer: 'Medd-i Lîn; lîn harfleri olan sâkin Vâv (و) veya Yâ (ي) harflerinden önceki harf fethalı (üstünlü) olup, sonrasında duruş sebebiyle sükûn geldiğinde oluşur.\n\nÖrnekler:\n- خَوْفٍ (Vakıf halinde: Havvff)\n- قُرَيْشٍ (Vakıf halinde: Kureyyş)\n\nHükmü câizdir. Vakıf halinde Tûl (4), Tevessut (2-3) veya Kasr (1) ile durulur; geçişte (vasl) med yapılmaz.',
    references: ['Tuhfetü\'l-Etfâl', 'Tecvîd-i Karabaş']
  },
  {
    keywords: ['seddeli mim', 'seddeli nun', 'gunne', 'gunneli nun'],
    title: 'Şeddeli Mîm ve Nûn Hükmü',
    answer: 'Şeddeli Nûn (نّ) ve Şeddeli Mîm (مّ) harfleri tecvid ilminde gunnenin kuvvetli mertebelerindendir.\n\nOkunuşu: Harfin mahrecini koruyarak gunne verilir; ölçüsü hareke üzerinden ve hocanın talimiyle çalışılır.\nÖrnekler:\n- إِنَّ (İnne)\n- ثُمَّ (Sümme)\n- عَمَّ يَتَسَاءَلُونَ (Amme yetesâelûn)',
    references: ['el-Cezeriyye']
  },
  {
    keywords: ['kalkale', 'kalkale harfleri', 'kutbu cedin'],
    title: 'Kalkale Hükmü (Kuvvetli Sarsıntı)',
    answer: 'Kalkale; sâkin olduklarında ses organında kuvvetli bir tınlama ve sarsılma ile telaffuz edilen 5 harftir:\nKaf, Tâ, Bâ, Cîm, Dâl (ق ط ب ج د - Kutbu Cedin).\n\nMertebeleri:\n1. Kalkale-i Kübrâ (En büyük): Kelime sonunda şeddeli ve vakıf halinde (Örn: وَتَبَّ)\n2. Kalkale-i Vustâ (Orta): Kelime sonunda cezimli vakıf halinde (Örn: الفَلَقِ)\n3. Kalkale-i Sugrâ (Küçük): Kelime ortasında sâkin olduğunda (Örn: يَطْمَعُ, يَدْخُلُونَ).',
    references: ['el-Cezeriyye, Bâbu\'l-Kalkale']
  },
  {
    keywords: ['hukmurra', 'ra harfi', 'ra nasil okunur', 'kalin ra', 'ince ra'],
    title: 'Hükmü\'r-Râ (Râ Harfinin Halleri)',
    answer: 'Râ (ر) harfi harekesine ve çevresindeki seslere göre kalın veya ince okunur:\n- Kalın Okunduğu Yerler: Harekesi üstün veya ötre olduğunda; sâkin olup öncesi üstün/ötre olduğunda; öncesi ârızî hemze olduğunda.\n- İnce Okunduğu Yerler: Harekesi esre olduğunda; sâkin olup öncesi aslî esre olduğunda ve peşinden istilâ harfi gelmediğinde; sâkin Yâ\'dan sonra durulduğunda (Örn: خَبِيرٌ - Habîr).\n- Her İki Şekilde de Câiz Olanlar: فِرْقٍ (Fırk) kelimesi gibi istilâ harfinin esreli olduğu durumlar.',
    references: ['el-Cezeriyye']
  },
  {
    keywords: ['sekte', 'sekteler', 'kuran sekteleri'],
    title: 'Kur\'an-ı Kerim\'deki Dört Sekte',
    answer: 'Sekte; nefes almadan, sesi yaklaşık bir elif miktarı (bir saniye) kesip tilavete devam etmektir. Âsım kıraati Hafs rivayetinde Kur\'an\'da 4 yerde vacip sekte vardır:\n1. Kehf Sûresi 1-2. ayet: ...عِوَجًا ۜ قَيِّمًا (Ivecâ - Kayyimâ)\n2. Yâsîn Sûresi 52. ayet: ...مِنْ مَرْقَدِنَا ۜ هٰذَا (Mirkadinâ - Hâzâ)\n3. Kıyâme Sûresi 27. ayet: وَقِيلَ مَنْ ۜ رَاقٍ (Men - Râk)\n4. Mutaffifîn Sûresi 14. ayet: كَلَّا بَلْ ۜ رَانَ (Bel - Râne - burada idğam yapılmaz, sekte sebebiyle lâmlar net okunur).',
    references: ['Şâtıbiyye', 'Diyanet Kur\'an Kursları Kıraat Rehberi']
  },
  {
    keywords: ['rast', 'rast makami', 'rast nasil'],
    title: 'Rast Makamı Özellikleri',
    answer: 'Rast makamı; ferah, dengeli, vakur ve sevinçli bir ruha sahiptir. Klasik musikide "Makamların Babası" sayılır.\n- Karar Perdesi: G3 (Rast / Sol)\n- Güçlüsü: D4 (Nevâ / Re)\n- Karakteristik Derecesi: Üçüncü derecesi Segâh (koma bemollü) perdesidir.\nTilavette Fâtiha, Duhâ, Rahmân ve müjde, saadet, hidâyet anlatan âyet-i kerîmelerde tercih edilir.',
    references: ['Rauf Yekta Bey, Türk Musikisi Nazariyatı', 'Dr. Subhi Enver, Makamatü\'l-Kur\'an']
  },
  {
    keywords: ['ussak', 'bayati', 'ussak makami', 'bayati makami'],
    title: 'Uşşak ve Bayatî Makamları',
    answer: 'Uşşak ve Bayatî birbirine çok yakın akraba makamlardır. Kur\'an tilavetinde en yaygın ve tabii makamlardandır.\n- Karar Perdesi: Dügâh (A3 / La)\n- Karakteristiği: İkinci derecesi Segâh (koma bemol) perdesidir.\n- Farkı: Uşşak çıkıcı seyrederken, Bayatî inici-çıkıcı seyreder ve hüzünlü, içten, samimi bir yakarış taşır.\nÖğüt, ibret ve dua âyetlerinde çok etkilidir.',
    references: ['İsmail Hakkı Özkan, Türk Musikisi Nazariyatı ve Usulleri']
  },
  {
    keywords: ['hicaz', 'hicaz makami'],
    title: 'Hicaz Makamı Özellikleri',
    answer: 'Hicaz makamı; yakarıcı, tesirli, hüzünlü ve celâlli bir karaktere sahiptir.\n- Karar Perdesi: Dügâh (A3 / La)\n- Çeşnisi: Hicaz dörtlüsü (Si Dik Kürdî - Do Nim Hicaz - Re Nevâ)\n- Karakteristiği: İkinci ve üçüncü perdeleri arasındaki "artmış 2\'li" aralığı derhal tanınmasını sağlar.\nKıyamet manzaraları, ilâhî haşyet, tevbe ve cehennem ikazı içeren âyetlerde sıkça tilavet edilir.',
    references: ['Makamât fî Tilâveti\'l-Kur\'ân', 'İsmail Hakkı Özkan']
  },
  {
    keywords: ['segah', 'segah makami'],
    title: 'Segâh Makamı Özellikleri',
    answer: 'Segâh makamı; mistik, uhrevî, derin bir sükûnet ve huşû hissi verir. Türk din musikisinin en kadîm makamlarındandır (Itri\'nin Tekbîr ve Salât-ı Ümmiye\'si Segâh\'tır).\n- Karar Perdesi: Segâh (B3b1 koma bemol / Si)\n- Güçlüsü: Nevâ (Re)\nTilavette vakur, kalbi dinlendiren ve derin huşû gerektiren âyetlerde icra edilir.',
    references: ['Rauf Yekta Bey', 'Dr. Subhi Enver']
  },
  {
    keywords: ['saba', 'saba makami'],
    title: 'Sabâ Makamı Özellikleri',
    answer: 'Sabâ makamı; ince bir keder, içli bir sızı ve derin bir tevazu hissettirir.\n- Karar Perdesi: Dügâh (A3 / La)\n- Karakteristiği: Dördüncü derecesi Çargâh (Do) ile Çargâh perdesinin bir koma pestindeki Hicaz çeşnisidir.\nSabah ezanlarında ve kalbi rikkate getiren hüzün ve tefekkür âyetlerinde tercih edilir.',
    references: ['Makamâtü\'l-Kur\'ân', 'Türk Musikisi Rehberi']
  },
  {
    keywords: ['nihavend', 'nihavend makami'],
    title: 'Nihâvend Makamı Özellikleri',
    answer: 'Nihâvend makamı; Batı müziğindeki armoni minör dizisine yakındır; asil, berrak ve lirik bir anlatıma sahiptir.\n- Karar Perdesi: Rast (Sol)\n- Güçlüsü: Nevâ (Re)\nTilavette nizam, kâinatın yaratılışı ve hikmet âyetlerinde zevkle icra edilir.',
    references: ['İsmail Hakkı Özkan']
  },
  {
    keywords: ['nefes', 'diyafram', 'nefes egzersizi', '4-4-8'],
    title: 'Diyafram ve Nefes Yönetimi',
    answer: 'Tilavette nefes kontrolü göğüsten değil, karın boşluğunu genişleten diyafram kasından sağlanmalıdır. Önerilen 4-4-8 kuralı:\n1. 4 saniye burundan derin diyafram nefesi al (omuzları kaldırmadan göbeği şişir).\n2. 4 saniye nefesi diyaframda tut.\n3. 8 saniye boyunca ince bir "S" sesiyle nefesi kontrollü ver.\nBu egzersiz akciğer kapasitesini ve medd sürelerini uzatmada en güvenli yöntemdir.',
    references: ['Prof. Dr. Erol Belgin, Ses Eğitimi ve Vokal Hijyen']
  },
  {
    keywords: ['plan', 'calisma plani', 'nasil calismaliyim', 'gunluk program'],
    title: '20 Dakikalık Dengeli Günlük Tilavet Çalışma Planı',
    answer: 'Günlük 20 dakikalık ideal çalışma döngüsü:\n- 0–4 dk: Diyafram nefes egzersizi (4-4-8) ve hafif ses ısınması (mırıldanma)\n- 4–9 dk: Bir önceki günün tecvid konusunun veya harflerinin tekrarı (SRS)\n- 9–14 dk: Usta bir kurrâdan (Minşâvî veya Husarî) örnek ayet dinleme\n- 14–19 dk: Ayeti mikrofona okuma ve perde eğrisini inceleme\n- 19–20 dk: Günlük ilerlemeyi kaydetme ve not alma.',
    references: ['Tilavet Akademisi Öğretim Tasarımı']
  },
  {
    keywords: ['meal tefsir farki', 'meal nedir', 'tefsir nedir'],
    title: 'Meal ve Tefsir Arasındaki Fark',
    answer: 'Meal, Kur’an âyetlerinin anlamını başka bir dilde yaklaşık olarak aktarmaya çalışır; hiçbir meal Kur’an metninin kendisiyle özdeş değildir. Tefsir ise âyetleri dil, bağlam, rivayet ve ilim geleneği çerçevesinde daha geniş biçimde açıklar. Bir âyetin anlamını incelerken güvenilir mealleri ve ehil müfessirlerin açıklamalarını karşılaştırmak, bağlamı ve kaynağın yaklaşımını belirtmek önemlidir.',
    references: ['TDV İslâm Ansiklopedisi: Tefsir', 'Diyanet Kur’an Yolu Tefsiri']
  },
  {
    keywords: ['hadis nedir', 'sunnet nedir', 'hadis sunnet'],
    title: 'Hadis ve Sünnet Kavramları',
    answer: 'Hadis, Hz. Peygamber’in söz, fiil ve takrirlerini aktaran rivayetler için kullanılan terimdir. Sünnet, İslam ilimlerinde Hz. Peygamber’in örnekliği ve yolu anlamında kullanılır; kavramların kapsamı ve delil değeri ilim dalına göre farklı biçimlerde açıklanabilir. Belirli bir rivayetin sıhhati veya hükme etkisi soruluyorsa rivayetin kaynağı ve uzman değerlendirmesi gerekir.',
    references: ['TDV İslâm Ansiklopedisi: Hadis ve Sünnet']
  },
  {
    keywords: ['tilavet adabi', 'kur an okuma adabi', 'kurana nasil baslanir'],
    title: 'Kur’an Tilavetine Hazırlık ve Edep',
    answer: 'Tilavette temiz ve dikkat dağıtmayan bir ortam hazırlamak, acele etmeden tertîl üzere okumak ve anlam üzerinde düşünmek yararlı öğrenme alışkanlıklarıdır. Abdest ve tilavetin fıkhî hükümleri mezhep ve duruma göre sorulabilecek ayrı konulardır; bu asistan kişisel hüküm veya fetva vermez.',
    references: ['İmam Nevevî, et-Tibyân fî Âdâbi Hameleti’l-Kur’ân', 'Diyanet İslam İlmihali']
  }
];

export function queryAssistant(rawQuery: string): AssistantMessage {
  const q = trNormalize(rawQuery);
  const createMessage = (
    text: string,
    options: { label: string; actionType: 'navigate' | 'query'; payload: string }[] = [],
    references: string[] = [],
    disclaimer?: string
  ): AssistantMessage => ({
    id: 'msg-' + Date.now(),
    sender: 'assistant',
    text,
    timestamp: new Date().toISOString(),
    references,
    disclaimer,
    suggestedActions: options
  });

  const topicActions = (topics: readonly (typeof ASSISTANT_TOPICS)[number][] = ASSISTANT_TOPICS) => topics.map(topic => ({
    label: topic.label,
    actionType: 'query' as const,
    payload: `Konu menüsü: ${topic.id}`
  }));

  const menuIntent = ['yardim', 'yardim et', 'menu', 'konular', 'konu sec', 'bilmiyorum'];
  if (!q || menuIntent.includes(q)) {
    return createMessage(
      'Sorun değil; önce konu başlığını seçebilir, ardından hazır sorulardan ilerleyebilirsin. Cevapları anlayamazsan “Bunu anlamadım” yaz; konuyu yeniden açıklamak veya seçenek sunmak için yardımcı olurum.',
      topicActions()
    );
  }

  const topicMenuMatch = q.match(/^konu menusu\s*:?\s*(.+)$/);
  if (topicMenuMatch) {
    const topic = ASSISTANT_TOPICS.find(item => item.id === topicMenuMatch[1]);
    if (topic) {
      return createMessage(
        `${topic.label}\n\nBu başlıkta şu sorularla başlayabilirsin:`,
        topic.prompts.map(prompt => ({ label: prompt, actionType: 'query' as const, payload: prompt }))
      );
    }
  }

  if (/\banlamadim\b|\btekrar anlat\b/.test(q) || ['daha basit anlat', 'ornekle acikla', 'mini alistirma'].includes(q)) {
    return createMessage(
      'Sorun değil; aynı konuyu farklı biçimde çalışabiliriz. Aşağıdan anlatım biçimini seç veya konu menüsünden başlığı aç.',
      [
        { label: 'Daha basit anlat', actionType: 'query', payload: 'Daha basit anlat' },
        { label: 'Örnekle açıkla', actionType: 'query', payload: 'Örnekle açıkla' },
        { label: 'Mini alıştırma', actionType: 'query', payload: 'Mini alıştırma' },
        ...topicActions()
      ]
    );
  }

  const teachingMode = q.match(/^(daha basit anlat|ornekle acikla|mini alistirma)\s*:?\s*(.*)$/);
  if (teachingMode) {
    const mode = teachingMode[1];
    const target = teachingMode[2];
    const item = target ? KNOWLEDGE_BASE.find(entry =>
      trNormalize(entry.title).includes(target) || entry.keywords.some(keyword => trNormalize(keyword).includes(target))
    ) : undefined;
    if (!item) {
      return createMessage(
        'Elbette. Karışan konuyu veya terimi yaz; onu kısa açıklama, somut örnek ya da seviyene uygun alıştırmayla yeniden ele alayım.',
        topicActions()
      );
    }
    if (mode === 'daha basit anlat') {
      const shortAnswer = item.answer.split(/\n+/).map(line => line.trim()).find(line => line.length > 0) || item.answer;
      return createMessage(`Kısaca — ${item.title}:\n\n${shortAnswer}\n\nHangi kelimeyi veya adımı biraz daha açmamı istersin?`, [], item.references);
    }
    if (mode === 'ornekle acikla') {
      const examples = item.answer.split(/\n+/).filter(line => /ornek|مثال/.test(trNormalize(line)));
      return createMessage(
        `${item.title} için örnekli tekrar:\n\n${examples.length ? examples.join('\n') : item.answer}\n\nTelaffuzunu hocadan dinleyerek kontrol et.`,
        [],
        item.references
      );
    }
    return createMessage(
      `Mini alıştırma — ${item.title}:\n\nKuralı kendi cümlenle açıkla ve bir örnek yaz. Yanıtını gönder; bildiğim kaynaklarda eşleşme varsa kontrol etmene yardımcı olayım. Uygulama ve telaffuz için hocanın düzeltmesini esas al.`,
      [],
      item.references
    );
  }

  // Fetva veya yetki aşımı kontrolü
  const fatwaKeywords = ['fetva', 'helal mi', 'haram mi', 'caiz mi', 'gunah mi', 'namaz bozulur mu', 'abdest bozulur mu', 'namazim kabul', 'abdestim gecerli', 'oruç bozulur mu', 'oruc bozulur mu'];
  const specificFiqhQuestion = /(?:namaz|abdest|oruc|zekat|hac).{0,40}(?:bozul|gecerli|kabul|sahih|caiz|helal|haram|gunah|farz|vacip)/.test(q);
  if (fatwaKeywords.some(k => q.includes(trNormalize(k))) || specificFiqhQuestion) {
    return createMessage(
      'Sorunuz fıkhî bir hüküm veya fetva gerektiriyor olabilir. Bu asistan fetva vermez; ayrıntılar mezhep ve duruma göre değişebilir. Diyanet İşleri Başkanlığı Din İşleri Yüksek Kurulu’na veya yetkili bir müftülüğe danışın.',
      topicActions(ASSISTANT_TOPICS.filter(topic => topic.id === 'fiqh')),
      ['Diyanet İşleri Başkanlığı Din İşleri Yüksek Kurulu'],
      GUARDRAIL_DISCLAIMER
    );
  }

  // Bilgi tabanından normalizasyonlu en uygun eşleştirme (en uzun anahtar kelime öncelikli)
  let match: typeof KNOWLEDGE_BASE[0] | null = null;
  let bestKeywordLen = 0;

  for (const item of KNOWLEDGE_BASE) {
    for (const word of item.keywords) {
      const normWord = trNormalize(word);
      if (q.includes(normWord) && normWord.length > bestKeywordLen) {
        match = item;
        bestKeywordLen = normWord.length;
      }
    }
  }

  if (match) {
    return createMessage(
      `### ${match.title}\n\n${match.answer}`,
      [
        { label: 'Bunu anlamadım', actionType: 'query', payload: 'anlamadım' },
        { label: 'Örnekle çalış', actionType: 'query', payload: `Örnekle açıkla: ${match.title}` },
        { label: 'Tecvid Okuluna Git', actionType: 'navigate', payload: '/tilavet/tecvid' },
        { label: 'Makam Okuluna Git', actionType: 'navigate', payload: '/tilavet/makam' },
        { label: 'Pratik Stüdyosu', actionType: 'navigate', payload: '/tilavet/studyo' }
      ],
      match.references,
      GUARDRAIL_DISCLAIMER
    );
  }

  const queryTokens = q.split(' ').filter(token => token.length > 2 && !['nedir', 'nasil', 'hakkinda', 'lutfen', 'bir', 'icin', 'ile', 'misin'].includes(token));
  const nearbyMatches = KNOWLEDGE_BASE.map(item => {
    const searchable = trNormalize(`${item.title} ${item.keywords.join(' ')}`);
    const score = queryTokens.reduce((total, token) => {
      if (searchable.includes(token)) return total + 2;
      return total + (searchable.split(' ').some(word => token.length >= 4 && editDistanceAtMostOne(word, token)) ? 1 : 0);
    }, 0);
    return { item, score };
  }).filter(result => result.score > 0).sort((a, b) => b.score - a.score).slice(0, 4);

  if (nearbyMatches.length) {
    const top = nearbyMatches[0];
    const tied = nearbyMatches.filter(result => result.score >= top.score - 1);
    return createMessage(
      'Sorunu tam eşleştiremedim. Şunlardan hangisini kastettin? Yakın seçeneklerden birine dokunabilir veya sorunu başka kelimelerle yazabilirsin.',
      tied.map(({ item }) => ({ label: item.title, actionType: 'query', payload: item.keywords[0] }))
    );
  }

  const matchingTopics = ASSISTANT_TOPICS.filter(topic => {
    const topicWords = trNormalize(`${topic.label} ${topic.id} ${topic.prompts.join(' ')}`).split(' ');
    return queryTokens.some(token => topicWords.some(word => word.includes(token) || (token.length >= 4 && editDistanceAtMostOne(word, token))));
  }).slice(0, 3);
  if (matchingTopics.length) {
    return createMessage(
      'Sorunu henüz netleştiremedim. Yakın görünen başlıklardan birini seçebilir veya sorunu başka kelimelerle yazabilirsin.',
      topicActions(matchingTopics)
    );
  }

  // Eşleşmeyen genel pedagojik yönlendirme
  return createMessage(
    `“${rawQuery}” sorusu için doğrulanmış bir yanıt eşleştiremedim. Soruyu daha kısa yazabilir, önemli bir kelime ekleyebilir veya aşağıdaki konu menülerinden ilerleyebilirsin. Fıkhî ve kişisel dinî hükümler için ehil bir âlime ya da yetkili kuruma danış.`,
    topicActions(),
    [],
    GUARDRAIL_DISCLAIMER
  );
}

function editDistanceAtMostOne(left: string, right: string): boolean {
  if (Math.abs(left.length - right.length) > 1) return false;
  let leftIndex = 0;
  let rightIndex = 0;
  let differences = 0;
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] === right[rightIndex]) {
      leftIndex++;
      rightIndex++;
      continue;
    }
    differences++;
    if (differences > 1) return false;
    if (left.length > right.length) leftIndex++;
    else if (right.length > left.length) rightIndex++;
    else {
      leftIndex++;
      rightIndex++;
    }
  }
  return differences + (leftIndex < left.length || rightIndex < right.length ? 1 : 0) <= 1;
}
