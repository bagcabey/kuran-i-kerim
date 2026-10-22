/**
 * CYMATIQUE — TİLAVET AKADEMİSİ
 * Ana Akademi Motoru (tilavet_akademi_engine.js)
 * =============================================================================
 * 12 Alt Modül: Yolculuğum, Sıfırdan Kur'an, Tecvid Okulu, Tilavet Teknikleri,
 * Makam Okulu, Şan & Ses Eğitimi, Dinleme Salonu, Pratik Stüdyosu, Sınav/Sertifika,
 * Hoca Paneli, Sözlük/Kaynaklar, Ayarlar/Gizlilik.
 * =============================================================================
 */

(function (window) {
  'use strict';

  // 1. KÜRESEL AKADEMİ DURUMU (STATE)
  const STORAGE_KEY = 'cymatique_akademi_state';

  const defaultState = {
    currentLevel: 1,
    activeSubView: 'yolculuk',
    selectedMakam: 'rast',
    todayMinutes: 0,
    dailyGoalMinutes: 15,
    streak: 0,
    activityDate: null,
    lastActiveDate: null,
    placedLevel: 0,
    completedLessons: [],
    completedQuizzes: {}
  };

  let state = { ...defaultState };
  let activeStudioSimInterval = null;

  // LocalStorage'dan yükle
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      state = { ...defaultState, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn("[Akademi] State yükleme hatası:", e);
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  // 2. STATİK / DAHİLİ VERİLER (OFFLINE & FILE:// GÜVENCELİ KAPSAMLI HAVUZ)
  const DEFAULT_DATA = (typeof window !== 'undefined' && window.TilavetAkademiDefaultData) ? window.TilavetAkademiDefaultData : {};
  let MAKAMLAR = DEFAULT_DATA.makamlar || [];
  let LESSONS = DEFAULT_DATA.lessons || [];
  let SOZLUK = DEFAULT_DATA.sozluk || [];
  let RECITERS = DEFAULT_DATA.reciters || [];
  let QIRAAT = DEFAULT_DATA.qiraat || null;
  let ARABIC_LETTERS = DEFAULT_DATA.arabicLetters || [];
  let HAREKELER = DEFAULT_DATA.harekeler || { ustun: [], esre: [], otre: [] };
  let CEZM_SEDDE = DEFAULT_DATA.cezmSedde || { cezm: [], sedde: [] };
  let TENVIN = DEFAULT_DATA.tenvin || [];
  let MED_EXAMPLES = DEFAULT_DATA.med || [];
  let HECELEME_EXAMPLES = DEFAULT_DATA.heceleme || [];

  // ===========================================================================
  // ELİFBA · GERÇEK OKUNUŞ SESLERİ (Quran.com kelime kelime kayıtları)
  // Her kayıt bir âyetteki kelimenin konumudur: "sûre:âyet:kelime".
  // Metinler Quran.com Uthmani metninden alınmış, ses adresleri tek tek doğrulanmıştır.
  // ===========================================================================
  const ELIFBA_LETTER_WORDS = {
    'ا': { key: '2:27:10',  ar: 'أَمَرَ',    okunus: 'emera',     tr: 'emretti' },
    'ب': { key: '16:7:4',   ar: 'بَلَدٍۢ',    okunus: 'beledin',   tr: 'bir belde' },
    'ت': { key: '5:39:2',   ar: 'تَابَ',     okunus: 'tâbe',      tr: 'tövbe etti' },
    'ث': { key: '2:25:17',  ar: 'ثَمَرَةٍۢ',  okunus: 'semeratin', tr: 'bir meyve' },
    'ج': { key: '2:22:2',   ar: 'جَعَلَ',    okunus: 'ceale',     tr: 'kıldı' },
    'ح': { key: '2:209:12', ar: 'حَكِيمٌ',   okunus: 'hakîmun',   tr: 'hikmet sahibi' },
    'خ': { key: '2:29:3',   ar: 'خَلَقَ',    okunus: 'halaka',    tr: 'yarattı' },
    'د': { key: '3:37:11',  ar: 'دَخَلَ',    okunus: 'dehale',    tr: 'girdi' },
    'ذ': { key: '3:195:11', ar: 'ذَكَرٍ',    okunus: 'zekerin',   tr: 'erkek' },
    'ر': { key: '2:127:8',  ar: 'رَبَّنَا',   okunus: 'rabbenâ',   tr: 'Rabbimiz' },
    'ز': { key: '22:1:6',   ar: 'زَلْزَلَةَ', okunus: 'zelzelete', tr: 'sarsıntı' },
    'س': { key: '3:181:2',  ar: 'سَمِعَ',    okunus: 'semia',     tr: 'işitti' },
    'ش': { key: '27:40:29', ar: 'شَكَرَ',    okunus: 'şekera',    tr: 'şükretti' },
    'ص': { key: '42:43:2',  ar: 'صَبَرَ',    okunus: 'sabera',    tr: 'sabretti' },
    'ض': { key: '14:24:4',  ar: 'ضَرَبَ',    okunus: 'darabe',    tr: '(misal) verdi' },
    'ط': { key: '6:2:5',    ar: 'طِينٍۢ',    okunus: 'tînin',     tr: 'çamur' },
    'ظ': { key: '2:231:19', ar: 'ظَلَمَ',    okunus: 'zaleme',    tr: 'zulmetti' },
    'ع': { key: '2:60:15',  ar: 'عَلِمَ',    okunus: 'alime',     tr: 'bildi' },
    'غ': { key: '36:27:2',  ar: 'غَفَرَ',    okunus: 'ğafera',    tr: 'bağışladı' },
    'ف': { key: '2:76:15',  ar: 'فَتَحَ',    okunus: 'fetaha',    tr: 'açtı' },
    'ق': { key: '2:30:2',   ar: 'قَالَ',     okunus: 'kâle',      tr: 'dedi' },
    'ك': { key: '2:187:28', ar: 'كَتَبَ',    okunus: 'ketebe',    tr: 'yazdı' },
    'ل': { key: '33:63:12', ar: 'لَعَلَّ',   okunus: 'lealle',    tr: 'belki' },
    'م': { key: '114:2:1',  ar: 'مَلِكِ',    okunus: 'meliki',    tr: 'hükümdarı' },
    'ن': { key: '2:214:24', ar: 'نَصْرُ',    okunus: 'nasru',     tr: 'yardım' },
    'و': { key: '14:39:4',  ar: 'وَهَبَ',    okunus: 'vehebe',    tr: 'bağışladı' },
    'ه': { key: '2:143:34', ar: 'هَدَى',     okunus: 'hedâ',      tr: 'hidayet etti' },
    'ي': { key: '12:65:25', ar: 'يَسِيرٌۭ',  okunus: 'yesîrun',   tr: 'kolay' }
  };

  // Harflerin çıkış yeri: kısa ve tek cümlelik açıklamalar.
  const ELIFBA_MAHREC_DETAIL = {
    'ا': 'Harekeli elif (hemze) boğazın en dibinden, nefesin bir an kesilip açılmasıyla çıkar. Harekesiz elif ise med harfidir: bir noktaya dayanmaz, ağız boşluğunda akar ve önceki üstünlü harfi uzatır.',
    'ب': 'İki dudağın iç (ıslak) kısımları kapanıp açılarak çıkar. Sâkin olunca hafifçe sekerek okunur (kalkale).',
    'ت': 'Dil ucu, üst ön dişlerin dibine dokunur. İnce ve nefesli bir sestir.',
    'ث': 'Dil ucu, üst ön dişlerin uçlarına değer; dil hafifçe dişlerin arasından görünür. Peltek ve nefeslidir.',
    'ج': 'Dilin ortası, üst damağın ortasına dayanır. Sâkin olunca kalkale ile okunur.',
    'ح': 'Boğazın ortasından, boğaz daraltılıp nefes sıkıştırılarak çıkar. Hırıltı yoktur.',
    'خ': 'Boğazın ağza en yakın üst ucundan, hırıltılı ve kalın çıkar.',
    'د': 'Dil ucu, Tâ ile aynı yere (üst ön dişlerin dibine) dokunur; fakat ses titreşimlidir. Sâkin olunca kalkale ile okunur.',
    'ذ': 'Dil ucu, üst ön dişlerin uçlarına değer. Peltek, titreşimli ve incedir.',
    'ر': 'Dil ucunun biraz üst kısmı, üst ön dişlerin üstündeki damağa dokunur. Harekesine göre kalın ya da ince okunur.',
    'ز': 'Dil ucu alt ön dişlerin iç yüzüne yakın durur, hava dişler arasından ıslıkla geçer. Titreşimlidir.',
    'س': 'Zê ile aynı yerden çıkar; ince, nefesli ve ıslıklıdır.',
    'ش': 'Dilin ortası üst damağın ortasına yaklaşır; ses ağız içinde yayılarak çıkar.',
    'ص': 'Sîn ile aynı yerden çıkar; dilin sırtı damağa doğru kalktığı için kalın ve dolgundur.',
    'ض': 'Dilin bir veya iki yan kenarı üst azı dişlerine dayanır. Kalın, dolgun ve uzayan bir sestir.',
    'ط': 'Tâ ile aynı yerden çıkar; dilin sırtı damağa kalktığı için kalın ve kuvvetlidir. Sâkin olunca kalkale ile okunur.',
    'ظ': 'Zâl ile aynı yerden (peltek) çıkar; dilin sırtı kalktığı için kalındır.',
    'ع': 'Boğazın ortasından, boğaz daraltılarak tok bir sesle çıkar.',
    'غ': 'Boğazın ağza en yakın ucundan çıkar; Hı gibidir ama titreşimli ve sesli okunur.',
    'ف': 'Alt dudağın iç kısmı, üst ön dişlerin uçlarına değer. Nefeslidir.',
    'ق': 'Dil kökü, karşısındaki yumuşak damağa (küçük dile yakın) dayanır. Kalındır; sâkin olunca kalkale ile okunur.',
    'ك': 'Kâf\'ın biraz önünden, dil kökü sert damağa dayanarak çıkar. İnce ve nefeslidir.',
    'ل': 'Dilin uç kenarları, üst ön dişlerin dibindeki damağa dokunur. Allah lafzında, önce üstün ya da ötre varsa kalın okunur.',
    'م': 'İki dudak kapanarak çıkar; gunnesi genizden gelir.',
    'ن': 'Dil ucu, üst ön dişlerin üstündeki damağa dokunur; gunnesi genizden gelir.',
    'و': 'Dudaklar öne yuvarlanır ama tam kapanmaz. Sâkin ve öncesi ötreli olursa med harfidir.',
    'ه': 'Boğazın en dibinden, göğse en yakın yerden; rahat ve nefesli çıkar.',
    'ي': 'Dilin ortası üst damağın ortasına yaklaşır. Sâkin ve öncesi esreli olursa med harfidir.'
  };

  // 5 ana çıkış bölgesi: hangi harf nereden çıkar.
  const ELIFBA_MAHREC_ZONES = [
    { id: 'halk',     name: 'Boğaz',        ar: 'الحَلْق',   desc: 'Boğazın dibi, ortası ve ağza yakın ucu.',                                      letters: ['ء', 'ه', 'ع', 'ح', 'غ', 'خ'] },
    { id: 'lisan',    name: 'Dil',          ar: 'اللِّسَان', desc: 'Dilin kökü, ortası, kenarları ve ucu; damağa veya dişlere dokunarak.',          letters: ['ق', 'ك', 'ج', 'ش', 'ي', 'ض', 'ل', 'ن', 'ر', 'ط', 'د', 'ت', 'ص', 'س', 'ز', 'ظ', 'ذ', 'ث'] },
    { id: 'sefeteyn', name: 'Dudaklar',     ar: 'الشَّفَتَان', desc: 'İki dudak birlikte ya da alt dudak ile üst ön dişler.',                     letters: ['ف', 'ب', 'م', 'و'] },
    { id: 'cevf',     name: 'Ağız boşluğu', ar: 'الجَوْف',   desc: 'Bir noktaya dayanmaz; uzatılan med harfleri buradan akar.',                     letters: ['ا', 'و', 'ي'] },
    { id: 'haysum',   name: 'Geniz',        ar: 'الخَيْشُوم', desc: 'Harf değil gunne buradan çıkar: şeddeli, ihfâlı ve idğamlı Nûn ile Mîm.',     letters: ['ن', 'م'] }
  ];
  const ELIFBA_ZONE_OF_LETTER = { 'ا': ['halk', 'cevf'], 'و': ['sefeteyn', 'cevf'], 'ي': ['lisan', 'cevf'], 'ن': ['lisan', 'haysum'], 'م': ['sefeteyn', 'haysum'] };
  function elifbaZonesFor(char) {
    if (ELIFBA_ZONE_OF_LETTER[char]) return ELIFBA_ZONE_OF_LETTER[char];
    const zone = ELIFBA_MAHREC_ZONES.find(z => z.letters.includes(char));
    return zone ? [zone.id] : [];
  }

  // Tenvin: Kur'an'dan gerçek kelimeler (her biri kendi âyetindeki okunuşla).
  const ELIFBA_TENVIN_WORDS = [
    { type: 'İki Üstün', key: '112:4:4',  ar: 'كُفُوًا',   okunus: 'küfüven',  tr: 'denk' },
    { type: 'İki Üstün', key: '3:8:12',   ar: 'رَحْمَةً',  okunus: 'rahmeten', tr: 'bir rahmet' },
    { type: 'İki Üstün', key: '4:11:70',  ar: 'عَلِيمًا',  okunus: 'alîmen',   tr: 'her şeyi bilen' },
    { type: 'İki Üstün', key: '2:17:5',   ar: 'نَارًۭا',   okunus: 'nâran',    tr: 'bir ateş' },
    { type: 'İki Esre',  key: '111:1:4',  ar: 'لَهَبٍۢ',   okunus: 'lehebin',  tr: 'alev' },
    { type: 'İki Esre',  key: '111:5:5',  ar: 'مَّسَدٍۭ',  okunus: 'mesedin',  tr: 'hurma lifi' },
    { type: 'İki Esre',  key: '2:281:10', ar: 'نَفْسٍۢ',   okunus: 'nefsin',   tr: 'her can' },
    { type: 'İki Esre',  key: '2:105:14', ar: 'خَيْرٍۢ',   okunus: 'hayrin',   tr: 'bir hayır' },
    { type: 'İki Ötre',  key: '112:1:4',  ar: 'أَحَدٌ',    okunus: 'ehadün',   tr: 'tek, bir' },
    { type: 'İki Ötre',  key: '5:15:21',  ar: 'نُورٌۭ',    okunus: 'nûrun',    tr: 'bir nur' },
    { type: 'İki Ötre',  key: '2:173:24', ar: 'غَفُورٌۭ',  okunus: 'ğafûrun',  tr: 'çok bağışlayan' },
    { type: 'İki Ötre',  key: '2:29:19',  ar: 'عَلِيمٌۭ',  okunus: 'alîmun',   tr: 'her şeyi bilen' },
    { type: 'İki Üstün', key: '2:26:31',  ar: 'كَثِيرًۭا',  okunus: 'kesîran',  tr: 'çok' },
    { type: 'İki Üstün', key: '2:41:16',  ar: 'قَلِيلًۭا',  okunus: 'kalîlen',  tr: 'az' },
    { type: 'İki Üstün', key: '2:29:8',   ar: 'جَمِيعًۭا',  okunus: 'cemîan',   tr: 'hepsi' },
    { type: 'İki Üstün', key: '2:158:20', ar: 'خَيْرًۭا',   okunus: 'hayran',   tr: 'iyilik' },
    { type: 'İki Üstün', key: '3:86:4',   ar: 'قَوْمًۭا',   okunus: 'kavmen',   tr: 'bir kavim' },
    { type: 'İki Üstün', key: '3:56:5',   ar: 'عَذَابًۭا',  okunus: 'azâben',   tr: 'azap' },
    { type: 'İki Üstün', key: '3:97:18',  ar: 'سَبِيلًۭا',  okunus: 'sebîlen',  tr: 'bir yol' },
    { type: 'İki Üstün', key: '2:129:4',  ar: 'رَسُولًۭا',  okunus: 'resûlen',  tr: 'bir elçi' },
    { type: 'İki Esre',  key: '2:259:31', ar: 'يَوْمٍۢ',    okunus: 'yevmin',   tr: 'bir gün' },
    { type: 'İki Esre',  key: '2:142:20', ar: 'صِرَٰطٍۢ',   okunus: 'sırâtın',  tr: 'bir yol' },
    { type: 'İki Esre',  key: '2:142:21', ar: 'مُّسْتَقِيمٍۢ', okunus: 'müstakîmin', tr: 'dosdoğru' },
    { type: 'İki Esre',  key: '2:282:8',  ar: 'أَجَلٍۢ',    okunus: 'ecelin',   tr: 'bir süre' },
    { type: 'İki Esre',  key: '10:47:2',  ar: 'أُمَّةٍۢ',   okunus: 'ümmetin',  tr: 'her ümmet' },
    { type: 'İki Esre',  key: '3:81:9',   ar: 'كِتَـٰبٍۢ',  okunus: 'kitâbin',  tr: 'kitap' },
    { type: 'İki Esre',  key: '6:15:9',   ar: 'عَظِيمٍۢ',   okunus: 'azîmin',   tr: 'büyük' },
    { type: 'İki Esre',  key: '3:62:8',   ar: 'إِلَـٰهٍ',   okunus: 'ilâhin',   tr: 'ilah' },
    { type: 'İki Ötre',  key: '2:143:45', ar: 'رَّحِيمٌۭ',  okunus: 'rahîmun',  tr: 'merhametli' },
    { type: 'İki Ötre',  key: '2:20:25',  ar: 'قَدِيرٌۭ',   okunus: 'kadîrun',  tr: 'gücü yeten' },
    { type: 'İki Ötre',  key: '2:7:11',   ar: 'عَذَابٌ',    okunus: 'azâbun',   tr: 'azap' },
    { type: 'İki Ötre',  key: '2:220:26', ar: 'حَكِيمٌۭ',   okunus: 'hakîmun',  tr: 'hikmet sahibi' },
    { type: 'İki Ötre',  key: '2:209:11', ar: 'عَزِيزٌ',    okunus: 'azîzun',   tr: 'üstün, güçlü' },
    { type: 'İki Ötre',  key: '2:181:12', ar: 'سَمِيعٌ',    okunus: 'semîun',   tr: 'işiten' },
    { type: 'İki Ötre',  key: '6:54:7',   ar: 'سَلَـٰمٌ',   okunus: 'selâmun',  tr: 'selam' },
    { type: 'İki Ötre',  key: '2:38:13',  ar: 'خَوْفٌ',     okunus: 'havfun',   tr: 'korku' }
  ];

  // Med harfleri: Kur'an'dan gerçek kelimeler.
  const ELIFBA_MED_WORDS = [
    { type: 'Elif ile', letter: 'ا', key: '2:30:2',   ar: 'قَالَ',  okunus: 'kâle',   tr: 'dedi',          hint: 'Üstünlü Kâf, Elif ile uzar.' },
    { type: 'Elif ile', letter: 'ا', key: '2:75:6',   ar: 'كَانَ',  okunus: 'kâne',   tr: 'idi',           hint: 'Üstünlü Kef, Elif ile uzar.' },
    { type: 'Elif ile', letter: 'ا', key: '4:3:9',    ar: 'طَابَ',  okunus: 'tâbe',   tr: 'hoş geldi',     hint: 'Üstünlü Tı, Elif ile uzar.' },
    { type: 'Vâv ile',  letter: 'و', key: '4:163:7',  ar: 'نُوحٍۢ', okunus: 'nûhin',  tr: 'Nûh',           hint: 'Ötreli Nûn, sâkin Vâv ile uzar.' },
    { type: 'Vâv ile',  letter: 'و', key: '2:8:4',    ar: 'يَقُولُ', okunus: 'yekûlü', tr: 'der',           hint: 'Ötreli Kâf, sâkin Vâv ile uzar.' },
    { type: 'Vâv ile',  letter: 'و', key: '2:23:16',  ar: 'دُونِ',  okunus: 'dûni',   tr: 'başka, dışında', hint: 'Ötreli Dâl, sâkin Vâv ile uzar.' },
    { type: 'Yâ ile',   letter: 'ي', key: '2:11:2',   ar: 'قِيلَ',  okunus: 'kîle',   tr: 'denildi',       hint: 'Esreli Kâf, sâkin Yâ ile uzar.' },
    { type: 'Yâ ile',   letter: 'ي', key: '2:2:5',    ar: 'فِيهِ',  okunus: 'fîhi',   tr: 'onda',          hint: 'Esreli Fâ, sâkin Yâ ile uzar.' },
    { type: 'Yâ ile',   letter: 'ي', key: '2:154:6',  ar: 'سَبِيلِ', okunus: 'sebîli', tr: 'yolunda',       hint: 'Esreli Bâ, sâkin Yâ ile uzar.' },
    { type: 'Elif ile', letter: 'ا', key: '2:177:38', ar: 'إِذَا',      okunus: 'izâ',      tr: 'zaman',         hint: 'Üstünlü Zel, Elif ile uzar.' },
    { type: 'Elif ile', letter: 'ا', key: '2:8:2',    ar: 'ٱلنَّاسِ',   okunus: 'en-nâsi',  tr: 'insanlar',      hint: 'Üstünlü Nûn, Elif ile uzar.' },
    { type: 'Elif ile', letter: 'ا', key: '2:118:1',  ar: 'وَقَالَ',    okunus: 've kâle',  tr: 've dedi',       hint: 'Üstünlü Kâf, Elif ile uzar.' },
    { type: 'Elif ile', letter: 'ا', key: '2:34:11',  ar: 'وَكَانَ',    okunus: 've kâne',  tr: 've idi',        hint: 'Üstünlü Kef, Elif ile uzar.' },
    { type: 'Elif ile', letter: 'ا', key: '2:85:38',  ar: 'ٱلدُّنْيَا', okunus: 'ed-dünyâ', tr: 'dünya',         hint: 'Üstünlü Yâ, Elif ile uzar.' },
    { type: 'Vâv ile',  letter: 'و', key: '2:6:3',    ar: 'كَفَرُوا۟',  okunus: 'keferû',   tr: 'inkâr ettiler', hint: 'Ötreli Râ, sâkin Vâv ile uzar.' },
    { type: 'Vâv ile',  letter: 'و', key: '3:11:7',   ar: 'كَذَّبُوا۟', okunus: 'kezzebû',  tr: 'yalanladılar',  hint: 'Ötreli Bâ, sâkin Vâv ile uzar.' },
    { type: 'Vâv ile',  letter: 'و', key: '2:59:3',   ar: 'ظَلَمُوا۟',  okunus: 'zalemû',   tr: 'zulmettiler',   hint: 'Ötreli Mîm, sâkin Vâv ile uzar.' },
    { type: 'Vâv ile',  letter: 'و', key: '2:247:13', ar: 'يَكُونُ',    okunus: 'yekûnü',   tr: 'olur',          hint: 'Ötreli Kef, sâkin Vâv ile uzar.' },
    { type: 'Vâv ile',  letter: 'و', key: '6:132:4',  ar: 'عَمِلُوا۟',  okunus: 'amilû',    tr: 'yaptılar',      hint: 'Ötreli Lâm, sâkin Vâv ile uzar.' },
    { type: 'Vâv ile',  letter: 'و', key: '2:143:23', ar: 'ٱلرَّسُولَ', okunus: 'er-resûle', tr: 'elçiye',       hint: 'Ötreli Sîn, sâkin Vâv ile uzar.' },
    { type: 'Yâ ile',   letter: 'ي', key: '1:7:2',    ar: 'ٱلَّذِينَ',  okunus: 'ellezîne', tr: 'kimseler',      hint: 'Esreli Zel, sâkin Yâ ile uzar.' },
    { type: 'Yâ ile',   letter: 'ي', key: '2:185:28', ar: 'يُرِيدُ',    okunus: 'yürîdü',   tr: 'ister',         hint: 'Esreli Râ, sâkin Yâ ile uzar.' },
    { type: 'Yâ ile',   letter: 'ي', key: '2:37:11',  ar: 'ٱلرَّحِيمُ', okunus: 'er-rahîmü', tr: 'merhametli',   hint: 'Esreli Hâ, sâkin Yâ ile uzar.' },
    { type: 'Yâ ile',   letter: 'ي', key: '1:4:3',    ar: 'ٱلدِّينِ',   okunus: 'ed-dîni',  tr: 'hesap (din)',   hint: 'Esreli Dâl, sâkin Yâ ile uzar.' },
    { type: 'Yâ ile',   letter: 'ي', key: '2:126:30', ar: 'ٱلْمَصِيرُ', okunus: 'el-masîru', tr: 'dönüş yeri',   hint: 'Esreli Sâd, sâkin Yâ ile uzar.' },
    { type: 'Yâ ile',   letter: 'ي', key: '2:127:13', ar: 'ٱلسَّمِيعُ', okunus: 'es-semîu', tr: 'her şeyi işiten', hint: 'Esreli Mîm, sâkin Yâ ile uzar.' }
  ];
  const ELIFBA_MED_SHOWCASE = { key: '11:49:5', ar: 'نُوحِيهَآ', okunus: 'nû-hî-hâ', tr: 'onu vahyediyoruz' };

  // Kulak testi: Kur'an'da gerçekten geçen, yalnız benzer harfle ayrılan kelime çiftleri.
  const ELIFBA_EAR_GROUPS = {
    'ayn-hemze': { label: 'ع / ء', title: 'Ayn mı, Hemze mi?', tip: 'Ayn boğazın ortasından, boğaz daraltılarak tok çıkar. Hemze boğazın en dibinde, nefesin bir an kesilmesiyle çıkar.' },
    'kaf-kef':   { label: 'ق / ك', title: 'Kâf mı, Kef mi?',   tip: 'Kâf dil kökünün yumuşak damağa dayanmasıyla kalın çıkar. Kef biraz daha önden, ince ve nefesli çıkar.' },
    'ta-ti':     { label: 'ت / ط', title: 'Tâ mı, Tı mı?',     tip: 'İkisi de dil ucuyla aynı yerden çıkar. Tâ ince ve nefesli; Tı\'da dilin sırtı kalkar, ses kalın ve tok olur.' },
    'ha-he':     { label: 'ح / ه', title: 'Hâ mı, Hê mi?',     tip: 'Hâ boğazın ortasından, nefes sıkıştırılarak çıkar. Hê boğazın en dibinden, rahat ve hafif çıkar.' },
    'ha-hi':     { label: 'ح / خ', title: 'Hâ mı, Hı mı?',     tip: 'Hâ boğaz ortasından duru bir nefestir. Hı boğazın üst ucundan, hırıltılı ve kalın çıkar.' },
    'hi-gayn':   { label: 'خ / غ', title: 'Hı mı, Gayn mı?',   tip: 'İkisi de boğazın ağza yakın ucundan çıkar. Hı nefeslidir; Gayn titreşimli, sesli okunur.' },
    'dal-dad':   { label: 'د / ض', title: 'Dâl mı, Dâd mı?',   tip: 'Dâl dil ucuyla ince ve kısa çıkar. Dâd dilin yan kenarlarının azı dişlere dayanmasıyla kalın ve dolgun çıkar.' },
    'zal-zi':    { label: 'ذ / ظ', title: 'Zâl mı, Zı mı?',    tip: 'İkisi de peltektir, dil ucu üst dişlerin ucuna değer. Zâl ince, Zı kalın okunur.' },
    'zal-ze':    { label: 'ذ / ز', title: 'Zâl mı, Zê mi?',    tip: 'Zâl peltektir, dil dişlerin ucuna değer. Zê\'de dil içeride kalır, ses ıslıklıdır.' },
    'sin-sad':   { label: 'س / ص', title: 'Sîn mi, Sâd mı?',   tip: 'İkisi de aynı yerden ıslıkla çıkar. Sîn ince; Sâd\'da dilin sırtı kalkar, ses kalın ve dolgun olur.' },
    'ze-zi':     { label: 'ز / ظ', title: 'Zê mi, Zı mı?',     tip: 'Zê ıslıklı ve incedir, dil içeride kalır. Zı peltektir: dil ucu dişlerin ucuna değer ve ses kalın çıkar.' },
    'se-sin':    { label: 'ث / س', title: 'Sâ mı, Sîn mi?',    tip: 'Sâ peltektir, dil ucu dişlerin ucuna değer. Sîn\'de dil içeride kalır ve ses ıslıklı çıkar.' },
    'dad-zi':    { label: 'ض / ظ', title: 'Dâd mı, Zı mı?',    tip: 'Dâd dilin yan kenarlarının azı dişlere dayanmasıyla çıkar. Zı peltektir, dil ucu ön dişlerin ucuna değer.' },
    'kaf-gayn':  { label: 'ق / غ', title: 'Kâf mı, Gayn mı?',  tip: 'Kâf dil kökünün damağa tam dayanıp açılmasıyla patlar. Gayn boğazın üst ucundan, sürtünerek ve kesintisiz çıkar.' },
    'se-zal':    { label: 'ث / ذ', title: 'Sâ mı, Zâl mı?',    tip: 'İkisi de peltektir. Sâ nefeslidir, ses telleri titreşmez; Zâl titreşimli okunur.' }
  };
  const ELIFBA_EAR_PAIRS = [
    { group: 'ayn-hemze', words: [{ key: '1:7:4',    ar: 'عَلَيْهِمْ', tr: 'onların üzerine', letter: 'ع' }, { key: '3:77:20',  ar: 'إِلَيْهِمْ', tr: 'onlara',           letter: 'ء' }] },
    { group: 'ayn-hemze', words: [{ key: '2:29:19',  ar: 'عَلِيمٌۭ',  tr: 'her şeyi bilen',  letter: 'ع' }, { key: '2:10:9',   ar: 'أَلِيمٌۢ',  tr: 'acı veren',        letter: 'ء' }] },
    { group: 'kaf-kef',   words: [{ key: '113:1:4',  ar: 'ٱلْفَلَقِ', tr: 'sabah aydınlığı', letter: 'ق' }, { key: '7:64:6',   ar: 'ٱلْفُلْكِ', tr: 'gemi',             letter: 'ك' }] },
    { group: 'kaf-kef',   words: [{ key: '2:11:2',   ar: 'قِيلَ',     tr: 'denildi',         letter: 'ق' }, { key: '12:60:6',  ar: 'كَيْلَ',    tr: 'ölçek',            letter: 'ك' }] },
    { group: 'kaf-kef',   words: [{ key: '2:67:10',  ar: 'بَقَرَةًۭ',  tr: 'bir inek',        letter: 'ق' }, { key: '19:11:10', ar: 'بُكْرَةًۭ',  tr: 'sabah vakti',      letter: 'ك' }] },
    { group: 'ta-ti',     words: [{ key: '5:39:2',   ar: 'تَابَ',     tr: 'tövbe etti',      letter: 'ت' }, { key: '4:3:9',    ar: 'طَابَ',     tr: 'hoş geldi',        letter: 'ط' }] },
    { group: 'ta-ti',     words: [{ key: '2:38:10',  ar: 'تَبِعَ',    tr: 'uydu',            letter: 'ت' }, { key: '4:155:15', ar: 'طَبَعَ',    tr: 'mühürledi',        letter: 'ط' }] },
    { group: 'ta-ti',     words: [{ key: '2:279:10', ar: 'تُبْتُمْ',  tr: 'tövbe ederseniz', letter: 'ت' }, { key: '39:73:18', ar: 'طِبْتُمْ',  tr: 'hoş oldunuz',      letter: 'ط' }] },
    { group: 'ha-he',     words: [{ key: '2:187:1',  ar: 'أُحِلَّ',   tr: 'helal kılındı',   letter: 'ح' }, { key: '2:105:6',  ar: 'أَهْلِ',    tr: 'ehli, halkı',      letter: 'ه' }] },
    { group: 'ha-he',     words: [{ key: '14:25:4',  ar: 'حِينٍۭ',    tr: 'vakit',           letter: 'ح' }, { key: '19:9:7',   ar: 'هَيِّنٌۭ',   tr: 'kolay',            letter: 'ه' }] },
    { group: 'ha-hi',     words: [{ key: '5:110:62', ar: 'سِحْرٌۭ',   tr: 'sihir',           letter: 'ح' }, { key: '9:79:15',  ar: 'سَخِرَ',    tr: 'alay etti',        letter: 'خ' }] },
    { group: 'hi-gayn',   words: [{ key: '2:105:14', ar: 'خَيْرٍۢ',   tr: 'hayır, iyilik',   letter: 'خ' }, { key: '1:7:5',    ar: 'غَيْرِ',    tr: 'olmayan',          letter: 'غ' }] },
    { group: 'hi-gayn',   words: [{ key: '20:3:4',   ar: 'يَخْشَىٰ',  tr: 'korkar',          letter: 'خ' }, { key: '3:154:9',  ar: 'يَغْشَىٰ',  tr: 'bürür, kaplar',    letter: 'غ' }] },
    { group: 'dal-dad',   words: [{ key: '2:120:19', ar: 'بَعْدَ',    tr: 'sonra',           letter: 'د' }, { key: '2:76:11',  ar: 'بَعْضٍۢ',   tr: 'bazısı',           letter: 'ض' }] },
    { group: 'dal-dad',   words: [{ key: '4:91:10',  ar: 'رُدُّوٓا۟',  tr: 'döndürüldüler',   letter: 'د' }, { key: '9:58:9',   ar: 'رَضُوا۟',   tr: 'razı oldular',     letter: 'ض' }] },
    { group: 'zal-zi',    words: [{ key: '21:45:11', ar: 'يُنذَرُونَ', tr: 'uyarılırlar',     letter: 'ذ' }, { key: '2:162:9',  ar: 'يُنظَرُونَ', tr: 'mühlet verilir',   letter: 'ظ' }] },
    { group: 'zal-ze',    words: [{ key: '20:134:18', ar: 'نَّذِلَّ',  tr: 'zelil olmak',     letter: 'ذ' }, { key: '2:176:4',  ar: 'نَزَّلَ',   tr: 'indirdi',          letter: 'ز' }] },
    { group: 'sin-sad',   words: [{ key: '7:129:12', ar: 'عَسَىٰ',    tr: 'umulur ki',       letter: 'س' }, { key: '19:14:6',  ar: 'عَصِيًّۭا',  tr: 'isyankâr',         letter: 'ص' }] },
    { group: 'sin-sad',   words: [{ key: '2:138:4',  ar: 'أَحْسَنُ',  tr: 'daha güzel',      letter: 'س' }, { key: '4:25:36',  ar: 'أُحْصِنَّ',  tr: 'evlendiklerinde',  letter: 'ص' }] },
    { group: 'se-zal',    words: [{ key: '56:13:1',  ar: 'ثُلَّةٌۭ',   tr: 'bir topluluk',    letter: 'ث' }, { key: '10:26:10', ar: 'ذِلَّةٌ',   tr: 'zillet',           letter: 'ذ' }] }
  ];

  // Ek çiftler (Quran.com kelime verisinden; aynı kelime iskeletinde tek harf farkı). Biçim: grup|anahtar|metin|anlam|harf|anahtar|metin|anlam|harf
  const ELIFBA_EAR_EXTRA = [
    'ayn-hemze|2:48:6|عَن|hakkında, -den|ع|2:26:5|أَن|ki, -mek|ء',
    'ayn-hemze|4:157:28|عِلْمٍ|bilgisi|ع|2:33:9|أَلَمْ|görmedin mi?|ء',
    'ayn-hemze|3:10:6|عَنْهُمْ|onlardan|ع|2:103:2|أَنَّهُمْ|onlar|ء',
    'ayn-hemze|2:74:36|عَمَّا|şeylerden|ع|6:143:14|أَمَّا|yoksa|ء',
    'ayn-hemze|4:11:70|عَلِيمًا|bilendir|ع|4:18:24|أَلِيمًۭا|acıklı|ء',
    'ayn-hemze|4:31:6|عَنْهُ|ondan|ع|2:26:16|أَنَّهُ|şüphesiz|ء',
    'ha-he|6:145:20|لَحْمَ|eti|ح|2:11:3|لَهُمْ|onlara|ه',
    'ha-he|2:187:1|أُحِلَّ|helal kılındı|ح|2:173:9|أُهِلَّ|kesilen|ه',
    'ha-he|2:173:6|وَلَحْمَ|ve etini|ح|2:7:10|وَلَهُمْ|ve onlara vardır|ه',
    'ha-he|2:190:12|يُحِبُّ|sever|ح|42:49:8|يَهَبُ|bahşeder|ه',
    'ha-he|2:36:19|حِينٍۢ|bir süreye|ح|19:9:7|هَيِّنٌۭ|kolaydır|ه',
    'ha-he|2:259:56|لَحْمًۭا|et|ح|7:20:2|لَهُمَا|kendilerine|ه',
    'ha-he|53:4:4|وَحْىٌۭ|vahiyden|ح|2:259:6|وَهِىَ|ve o|ه',
    'ha-he|58:22:10|حَآدَّ|düşman|ح|13:7:15|هَادٍ|yol gösteren|ه',
    'ha-hi|5:110:62|سِحْرٌۭ|bir büyüdür|ح|16:14:3|سَخَّرَ|boyun eğdirdi|خ',
    'ha-hi|2:133:5|حَضَرَ|geldiği|ح|12:43:13|خُضْرٍۢ|yeşil|خ',
    'ha-hi|4:62:10|يَحْلِفُونَ|yemin ederler|ح|43:60:8|يَخْلُفُونَ|yerinize geçen|خ',
    'ha-hi|19:47:10|حَفِيًّۭا|çok lutufkardır|ح|19:3:5|خَفِيًّۭا|gizli|خ',
    'ha-hi|21:46:3|نَفْحَةٌۭ|bir esinti|ح|69:13:5|نَفْخَةٌۭ|üfleme|خ',
    'ha-hi|2:228:7|يَحِلُّ|helal olur|ح|12:9:6|يَخْلُ|yönelsin|خ',
    'ha-hi|2:258:22|أُحْىِۦ|yaşatır|ح|5:31:22|أَخِى|kardeşimin|خ',
    'ha-hi|4:65:15|حَرَجًۭا|bir burukluk|ح|18:94:13|خَرْجًا|bir vergi|خ',
    'ha-hi|68:10:4|حَلَّافٍۢ|yemin edip duran|ح|5:33:20|خِلَـٰفٍ|çaprazlama|خ',
    'hi-gayn|2:54:17|خَيْرٌۭ|daha hayırlıdır|خ|2:59:5|غَيْرَ|başka|غ',
    'hi-gayn|3:54:5|خَيْرُ|en hayırlısıdır|خ|4:95:6|غَيْرُ|başka|غ',
    'hi-gayn|2:197:24|خَيْرَ|en hayırlısı|خ|2:59:5|غَيْرَ|başka|غ',
    'hi-gayn|2:106:8|بِخَيْرٍۢ|daha iyisini|خ|2:61:53|بِغَيْرِ|olmaksızın|غ',
    'hi-gayn|2:134:4|خَلَتْ|gelip geçti|خ|5:64:6|غُلَّتْ|bağlandı|غ',
    'hi-gayn|18:44:8|وَخَيْرٌ|ve daha hayırlıdır|خ|6:99:31|وَغَيْرَ|kimi benzemez|غ',
    'hi-gayn|22:31:10|خَرَّ|düşmüş|خ|8:49:8|غَرَّ|aldatmış|غ',
    'hi-gayn|35:28:9|يَخْشَى|gereğince korkar|خ|44:11:1|يَغْشَى|sarar|غ',
    'kaf-kef|3:167:4|وَقِيلَ|ve denildi|ق|6:102:16|وَكِيلٌۭ|vekildir|ك',
    'kaf-kef|3:20:9|وَقُل|ve de ki|ق|8:54:15|وَكُلٌّۭ|ve hepsi|ك',
    'kaf-kef|43:38:9|ٱلْمَشْرِقَيْنِ|iki doğu|ق|2:105:9|ٱلْمُشْرِكِينَ|ortak koşanlar|ك',
    'kaf-kef|2:201:12|وَقِنَا|ve bizi koru|ق|7:173:8|وَكُنَّا|ve olduğumuz|ك',
    'kaf-kef|39:9:3|قَـٰنِتٌ|ibadet eden|ق|2:94:3|كَانَتْ|idi|ك',
    'kaf-kef|2:68:13|بَقَرَةٌۭ|bir inektir|ق|19:11:10|بُكْرَةًۭ|sabah|ك',
    'kaf-kef|2:187:65|يَتَّقُونَ|korunurlar|ق|43:34:5|يَتَّكِـُٔونَ|yaslanacakları|ك',
    'kaf-kef|20:71:26|وَأَبْقَىٰ|ve sürekli imiş|ق|53:43:4|وَأَبْكَىٰ|ve ağlatan|ك',
    'ta-ti|5:83:7|تَرَىٰٓ|bir görsen|ت|16:14:8|طَرِيًّۭا|taptaze|ط',
    'ta-ti|2:143:22|يَتَّبِعُ|uyan|ت|7:101:19|يَطْبَعُ|mühürler|ط',
    'ta-ti|2:241:2|مَتَـٰعٌۢ|bir geçimdir|ت|81:21:1|مُّطَاعٍۢ|itaat edilendir|ط',
    'ta-ti|2:170:10|نَتَّبِعُ|uyarız|ت|10:74:19|نَطْبَعُ|mühürleriz|ط',
    'ta-ti|9:19:17|يَسْتَوُۥنَ|bir olmazlar|ت|22:72:13|يَسْطُونَ|üzerine saldıracaklar|ط',
    'ta-ti|2:234:2|يُتَوَفَّوْنَ|ölenler|ت|55:44:1|يَطُوفُونَ|dolaşırlar|ط',
    'dal-dad|2:27:6|بَعْدِ|sonra|د|2:76:11|بَعْضٍۢ|bazısı|ض',
    'dal-dad|2:230:7|بَعْدُ|ondan sonra|د|6:158:12|بَعْضُ|bazı|ض',
    'dal-dad|2:51:10|بَعْدِهِۦ|ondan sonra|د|8:37:8|بَعْضَهُۥ|onun bir kısmını|ض',
    'dal-dad|11:44:15|بُعْدًۭا|uzak olsun|د|2:283:13|بَعْضًۭا|diğerini|ض',
    'dal-dad|13:11:28|مَرَدَّ|geri çevirecek|د|2:10:3|مَّرَضٌۭ|hastalık|ض',
    'dal-dad|6:40:12|تَدْعُونَ|yalvardıklarınız|د|24:58:20|تَضَعُونَ|çıkarıp koyduğunuz|ض',
    'zal-zi|10:59:15|أَذِنَ|izin verdi|ذ|18:35:8|أَظُنُّ|sanmam|ظ',
    'zal-zi|17:57:18|مَحْذُورًۭا|sakınılan|ذ|17:20:12|مَحْظُورًا|kısıtlanmış|ظ',
    'zal-zi|10:26:10|ذِلَّةٌ|zillet|ذ|7:171:6|ظُلَّةٌۭ|bir gölge|ظ',
    'zal-zi|17:24:4|ٱلذُّلِّ|tevazu, alçalma|ذ|25:45:7|ٱلظِّلَّ|gölgeyi|ظ',
    'zal-zi|2:61:39|ٱلذِّلَّةُ|alçaklık|ذ|26:189:5|ٱلظُّلَّةِ|gölge|ظ',
    'zal-zi|2:270:8|نَّذْرٍۢ|adak|ذ|47:20:21|نَظَرَ|bakışı gibi|ظ',
    'zal-zi|37:72:4|مُّنذِرِينَ|uyarıcılar|ذ|15:8:9|مُّنظَرِينَ|mühlet verilenler|ظ',
    'zal-zi|10:2:10|أَنذِرِ|uyar|ذ|7:143:10|أَنظُرْ|bakayım|ظ',
    'zal-zi|10:11:11|فَنَذَرُ|böyle bırakırız|ذ|37:88:1|فَنَظَرَ|baktı|ظ',
    'zal-ze|11:77:9|ذَرْعًۭا|bir sıkıntı|ذ|18:32:14|زَرْعًۭا|ekin|ز',
    'zal-ze|6:69:10|ذِكْرَىٰ|bir öğüttür|ذ|3:37:9|زَكَرِيَّا|Zekeriyyâ|ز',
    'zal-ze|51:42:2|تَذَرُ|bırakmaz|ذ|6:164:17|تَزِرُ|taşımaz|ز',
    'zal-ze|7:2:12|وَذِكْرَىٰ|ve öğüt|ذ|6:85:1|وَزَكَرِيَّا|ve Zekeriyyâ|ز',
    'zal-ze|5:40:9|يُعَذِّبُ|azap eder|ذ|10:61:22|يَعْزُبُ|gizli kalmaz|ز',
    'zal-ze|6:70:1|وَذَرِ|ve bırak|ذ|6:164:19|وِزْرَ|günahını|ز',
    'ze-zi|17:35:5|وَزِنُوا۟|tartın|ز|7:171:7|وَظَنُّوٓا۟|ve sandılar|ظ',
    'ze-zi|25:68:17|يَزْنُونَ|zina etmezler|ز|2:46:2|يَظُنُّونَ|kesin bilirler|ظ',
    'ze-zi|46:35:5|ٱلْعَزْمِ|azim|ز|19:4:5|ٱلْعَظْمُ|kemik|ظ',
    'ze-zi|56:93:1|فَنُزُلٌۭ|bir ziyafet|ز|26:71:4|فَنَظَلُّ|devam ederiz|ظ',
    'sin-sad|7:185:13|عَسَىٰٓ|belki|س|19:14:6|عَصِيًّۭا|isyankâr|ص',
    'sin-sad|2:77:7|يُسِرُّونَ|gizledikleri|س|56:46:2|يُصِرُّونَ|ısrar ederler|ص',
    'sin-sad|10:54:11|وَأَسَرُّوا۟|ve gizlerler|س|71:7:12|وَأَصَرُّوا۟|ve direttiler|ص',
    'sin-sad|2:273:20|يَسْـَٔلُونَ|isterler|س|4:90:3|يَصِلُونَ|ulaşırlar|ص',
    'sin-sad|2:216:7|وَعَسَىٰٓ|olur ki|س|20:121:12|وَعَصَىٰٓ|ve karşı geldi|ص',
    'sin-sad|25:54:8|نَسَبًۭا|nesep|س|18:62:12|نَصَبًۭا|yorgunluk|ص',
    'sin-sad|40:71:6|يُسْحَبُونَ|sürüklenirler|س|21:43:14|يُصْحَبُونَ|yardım görürler|ص',
    'sin-sad|9:64:6|سُورَةٌۭ|bir sûre|س|82:8:3|صُورَةٍۢ|surette|ص',
    'se-sin|10:45:5|يَلْبَثُوٓا۟|kalmamışlar gibi|ث|6:82:4|يَلْبِسُوٓا۟|karıştırmayanlar|س',
    'se-sin|9:12:2|نَّكَثُوٓا۟|bozarlarsa|ث|21:65:2|نُكِسُوا۟|döndürüldüler|س',
    'se-sin|5:107:2|عُثِرَ|anlaşılırsa|ث|54:8:8|عَسِرٌۭ|çetin|س',
    'se-sin|33:14:11|تَلَبَّثُوا۟|gecikmezlerdi|ث|2:42:2|تَلْبِسُوا۟|karıştırmayın|س',
    'se-zal|56:40:1|وَثُلَّةٌۭ|bir bölümü de|ث|7:152:9|وَذِلَّةٌۭ|ve bir alçaklık|ذ',
    'dad-zi|2:108:16|ضَلَّ|sapmıştır|ض|16:58:5|ظَلَّ|olur, kalır|ظ',
    'dad-zi|3:164:24|ضَلَـٰلٍۢ|bir sapıklık|ض|36:56:4|ظِلَـٰلٍ|gölgeler|ظ',
    'dad-zi|6:24:6|وَضَلَّ|ve kaybolmuştur|ض|56:30:1|وَظِلٍّۢ|ve gölge|ظ',
    'dad-zi|17:48:6|فَضَلُّوا۟|şaştılar|ض|15:14:7|فَظَلُّوا۟|dursalardı|ظ',
    'dad-zi|4:60:29|ضَلَـٰلًۢا|bir sapkınlık|ض|16:81:6|ظِلَـٰلًۭا|gölgeler|ظ',
    'dad-zi|76:11:7|نَضْرَةًۭ|parlaklık|ض|37:88:2|نَظْرَةًۭ|bir bakış|ظ',
    'dad-zi|75:22:3|نَّاضِرَةٌ|ışıl ışıl|ض|75:23:3|نَاظِرَةٌۭ|bakan|ظ',
    'kaf-gayn|16:96:7|بَاقٍۢ|kalıcıdır|ق|2:173:16|بَاغٍۢ|haddi aşan|غ',
    'kaf-gayn|22:40:34|لَقَوِىٌّ|kuvvetlidir|ق|28:18:15|لَغَوِىٌّۭ|bir azgınsın|غ',
    'kaf-gayn|3:181:4|قَوْلَ|sözünü|ق|37:47:3|غَوْلٌۭ|sersemletme|غ',
    'kaf-gayn|2:14:2|لَقُوا۟|rastladıkları|ق|19:62:4|لَغْوًا|boş söz|غ',
    'kaf-gayn|4:7:14|قَلَّ|az|ق|3:161:10|غَلَّ|hıyanet ettiği|غ',
    'kaf-gayn|50:21:5|سَآئِقٌۭ|bir sürücü|ق|35:12:7|سَآئِغٌۭ|kolay geçen|غ',
    "kaf-gayn|3:45:20|ٱلْمُقَرَّبِينَ|Allah'a yakın olanlar|ق|55:17:4|ٱلْمَغْرِبَيْنِ|iki batı|غ",
    'kaf-gayn|5:116:8|قُلْتَ|dedin|ق|5:64:6|غُلَّتْ|bağlandı|غ'
  ];
  ELIFBA_EAR_EXTRA.forEach(line => {
    const p = line.split('|');
    ELIFBA_EAR_PAIRS.push({ group: p[0], words: [{ key: p[1], ar: p[2], tr: p[3], letter: p[4] }, { key: p[5], ar: p[6], tr: p[7], letter: p[8] }] });
  });
  const EAR_ROUND_SIZE = 10;

  function elifbaWordAudioUrl(key) {
    const [s, a, w] = String(key).split(':').map(n => String(n).padStart(3, '0'));
    return `https://audio.qurancdn.com/wbw/${s}_${a}_${w}.mp3`;
  }
  function elifbaVerseLabel(key) {
    const [s, a] = String(key).split(':');
    return `${s}:${a}`;
  }

  let elifbaWordAudio = null;
  let elifbaWordButton = null;
  function stopElifbaWord() {
    if (elifbaWordAudio) {
      try { elifbaWordAudio.pause(); } catch (_) {}
      elifbaWordAudio = null;
    }
    if (elifbaWordButton) {
      elifbaWordButton.classList.remove('is-playing');
      elifbaWordButton.setAttribute('aria-pressed', 'false');
      elifbaWordButton = null;
    }
  }
  function playElifbaWord(key, button, rate) {
    if (!key) return;
    const sameButton = button && button === elifbaWordButton;
    stopElifbaWord();
    if (sameButton) return;
    if (window.TilavetAudioManager && typeof window.TilavetAudioManager.notifyPlay === 'function') {
      window.TilavetAudioManager.notifyPlay('elifba-words');
    }
    const audio = new Audio(elifbaWordAudioUrl(key));
    audio.playbackRate = rate || 1;
    audio.preservesPitch = true;
    elifbaWordAudio = audio;
    if (button) {
      elifbaWordButton = button;
      button.classList.add('is-playing');
      button.setAttribute('aria-pressed', 'true');
    }
    const finish = () => { if (elifbaWordAudio === audio) stopElifbaWord(); };
    audio.addEventListener('ended', finish);
    audio.addEventListener('error', finish);
    audio.play().catch(finish);
  }
  if (window.TilavetAudioManager && typeof window.TilavetAudioManager.register === 'function') {
    window.TilavetAudioManager.register('elifba-words', { stop: stopElifbaWord, category: 'akademi' });
  }

  // Düğme: kelimenin gerçek okunuşunu çalar.
  function elifbaPlayButton(key, label, extraClass) {
    return `<button type="button" class="v5-word-play ${extraClass || ''}" data-word-key="${key}" aria-pressed="false" aria-label="${label}"><span class="v5-word-play-icon" aria-hidden="true"></span><span class="v5-word-play-text">Dinle</span></button>`;
  }

  function elifbaWordCard(word) {
    return `
      <article class="v5-word-card">
        <div class="v5-word-card-ar" lang="ar">${word.ar}</div>
        <div class="v5-word-card-okunus">${word.okunus}</div>
        <div class="v5-word-card-tr">${word.tr}</div>
        ${word.hint ? `<div class="v5-word-card-hint">${word.hint}</div>` : ''}
        <div class="v5-word-card-foot">
          <span class="v5-word-card-ref">Âyet ${elifbaVerseLabel(word.key)}</span>
          ${elifbaPlayButton(word.key, `${word.ar} kelimesini dinle`, 'is-compact')}
        </div>
      </article>`;
  }
  let earSession = null;

  let TECVID_RULES = DEFAULT_DATA.tecvidRules || [];
  let SECAVEND = DEFAULT_DATA.secavend || [];
  let MEDINE_DURAKLARI = DEFAULT_DATA.medineDuraklari || [];
  let VAKIF_TURLERI = DEFAULT_DATA.vakifTurleri || [];
  let TEMPOLAR_DETAY = DEFAULT_DATA.tempolarDetay || [];
  let LAHN_KARSILASTIRMA = DEFAULT_DATA.lahnKarsilastirma || [];
  let EKSTRA_OZEL_KELIMELER = DEFAULT_DATA.ekstraOzelKelimeler || [];
  let TEKNIK_QUIZ = DEFAULT_DATA.teknikQuiz || [];
  let IBTIDA_VASL = DEFAULT_DATA.ibtidaVasl || [];
  let OZEL_KELIMELER = DEFAULT_DATA.ozelKelimeler || [];
  let VOCAL_WARMUPS = DEFAULT_DATA.vocalWarmups || [];
  let RECITER_SCHOOLS = DEFAULT_DATA.reciterSchools || [];

  function mergeMakamCatalog(researchedMakams) {
    const fallbackById = new Map(MAKAMLAR.map(makam => [makam.id, makam]));
    const researchedIds = new Set();
    const merged = researchedMakams.map(makam => {
      researchedIds.add(makam.id);
      const fallback = fallbackById.get(makam.id);
      if (!fallback) return makam;

      return {
        ...fallback,
        ...makam,
        ayahExamples: Array.isArray(makam.ayahExamples) && makam.ayahExamples.length
          ? makam.ayahExamples
          : fallback.ayahExamples || []
      };
    });

    for (const makam of MAKAMLAR) {
      if (!researchedIds.has(makam.id)) merged.push(makam);
    }

    return merged;
  }

  // Alt sekme durum değişkenleri
  let activeElifbaTab = 'harfler';
  let activeHarekeType = 'ustun';
  let selectedLetterIdx = 0;
  let selectedLetterFilter = 'all';
  let activeTecvidCategory = 'all';
  let activeTecvidSearch = '';
  let activeQiraatImamId = 'asim';
  let activeTeknikTab = 'tempolar';
  let activeSecavendSub = 'all';
  let activeLahnFilter = 'all';
  let activeSanTab = 'diyafram';
  let activeReciterSchool = 'all';
  let activeTeknikAudio = null;
  let activeTeknikAudioBtn = null;
  let activeMetronomeInterval = null;
  let quizAnsweredState = {};

  // Kıraat hızı aktif örnek indeksleri (4 hız x 4 örnek = 16 doğrulanmış icra)
  let activeTempoId = 'tertil';
  const tempoActiveExIdx = {
    tahkik: 0,
    tertil: 0,
    tedvir: 0,
    hadr: 0
  };

  // Kapsamlı ve güvenilir Kâri ses klasör haritası (EveryAyah CDN)
  function getEveryAyahAudioUrl(surah, ayah, reciterId) {
    const paddedSurah = String(surah).padStart(3, '0');
    const paddedAyah = String(ayah).padStart(3, '0');

    const folderMap = {
      mustafa_ismail: 'Mustafa_Ismail_48kbps',
      husary: 'Husary_128kbps',
      husary_mujawwad: 'Husary_128kbps_Mujawwad',
      abdulbasit: 'Abdul_Basit_Murattal_192kbps',
      abdulbasit_mujawwad: 'Abdul_Basit_Mujawwad_128kbps',
      minshawi: 'Minshawy_Murattal_128kbps',
      minshawi_mujawwad: 'Minshawy_Mujawwad_192kbps',
      shuraym: 'Saood_ash-Shuraym_128kbps',
      sudais: 'Abdurrahmaan_As-Sudais_192kbps',
      ghamadi: 'Ghamadi_40kbps',
      alafasy: 'Alafasy_128kbps',
      afasy: 'Alafasy_128kbps',
      dossary: 'Yasser_Ad-Dussary_128kbps',
      qatami: 'Nasser_Alqatami_128kbps',
      rifai: 'Hani_Rifai_192kbps',
      ali_jaber: 'Ali_Jaber_64kbps'
    };

    const folder = folderMap[reciterId] || (window.RECITERS && window.RECITERS[reciterId]?.folder) || 'Yasser_Ad-Dussary_128kbps';
    return `https://everyayah.com/data/${folder}/${paddedSurah}${paddedAyah}.mp3`;
  }
  window.getEveryAyahAudioUrl = getEveryAyahAudioUrl;

  // 3. VERİ YÜKLEME (İsteğe bağlı harici JSON'lardan yenileme; başarısız olursa dahili veri seti tam olarak devrededir)
  async function loadAkademiData() {
    try {
      const [mRes, lRes, sRes, rRes] = await Promise.all([
        fetch('data/tilavet/makamlar.json?v=20261020_2020').then(r => r.json()).catch(() => null),
        fetch('data/tilavet/lessons.json').then(r => r.json()).catch(() => null),
        fetch('data/tilavet/sozluk.json').then(r => r.json()).catch(() => null),
        fetch('data/tilavet/reciters.json').then(r => r.json()).catch(() => null)
      ]);

      if (mRes) {
        const researchedMakams = Array.isArray(mRes.makamlar) ? mRes.makamlar : Array.isArray(mRes) ? mRes : [];
        if (researchedMakams.length) MAKAMLAR = mergeMakamCatalog(researchedMakams);
      }
      if (lRes && Array.isArray(lRes) && lRes.length) LESSONS = lRes;
      if (sRes && Array.isArray(sRes) && sRes.length) SOZLUK = sRes;
      if (rRes && Array.isArray(rRes) && rRes.length) RECITERS = rRes;
    } catch (e) {
      console.info("[Akademi] Harici JSON fetch atlandı, dahili kapsamlı veri seti kullanılıyor.");
    }
  }

  // 4. ALT GÖRÜNÜM GEÇİŞİ (SUB-VIEW ROUTER)
  const AKADEMI_MODULE_META = {
    yolculuk: { title: "Yolculuğum", icon: "", subTitle: "Müfredat & İlerleme" },
    pratik: { title: "Pratikler", icon: "", subTitle: "Kulak, okuma ve ses alıştırmaları" },
    elifba: { title: "Sıfırdan Kur'an (Elifba)", icon: "", subTitle: "28 Harf & Mahreç" },
    tecvid: { title: "Tecvid Okulu", icon: "", subTitle: "20 Kural & Renkli Mushaf" },
    teknik: { title: "Tilavet Teknikleri", icon: "⚡", subTitle: "Tempolar, Secavend & Lahn" },
    makam: { title: "Makam Okulu", icon: "", subTitle: "10 Makam • Dinleme ve Geçki" },
    san: { title: "Şan & Ses Eğitimi", icon: "", subTitle: "Diyafram & Rezonans" },
    studyo: { title: "Ses Laboratuvarı", icon: "", subTitle: "53-Koma Tuner & DSP" },
    dinleme: { title: "Dinleme Salonu", icon: "", subTitle: "114 Sûre Master & Ekoller" },
    asistan: { title: "Tilavet Asistanı", icon: "", subTitle: "Yapay Zekâ Danışmanı" },
    sozluk: { title: "Terimler Sözlüğü", icon: "", subTitle: "Kavramlar Istılahı" },
    ayarlar: { title: "Ayarlar & Gizlilik", icon: "⚙", subTitle: "Akort & Tercihler" }
  };

  const MODULE_ORDER = [
    'yolculuk', 'pratik', 'elifba', 'tecvid', 'teknik', 'makam',
    'san', 'studyo', 'dinleme', 'asistan',
    'sozluk', 'ayarlar'
  ];

  function updateExecutiveBarAndDrawer(viewId) {
    const meta = AKADEMI_MODULE_META[viewId] || { title: viewId, icon: "", subTitle: "" };

    // 1. Executive Bar Breadcrumb Güncelle
    const crumbCurrent = document.getElementById('akademiCrumbCurrent');
    if (crumbCurrent) {
      crumbCurrent.textContent = meta.title;
    }

    const crumbSub = document.getElementById('akademiCrumbSub');
    if (crumbSub) {
      let subText = '';
      if (viewId === 'makam') {
        const m = (typeof MAKAMLAR !== 'undefined' ? MAKAMLAR.find(item => item.id === (state.selectedMakam || 'rast')) : null);
        if (m) subText = `${m.names?.tr || m.name || 'Makam'} (${m.names?.ar || ''})`;
      } else if (viewId === 'elifba') {
        const elifbaLabels = {
          harfler: "1. Harfler & Mahreç",
          yazilis: "2. Yazılış Halleri",
          harekeler: "3. Harekeler",
          'cezm-sedde': "4. Cezm & Şedde",
          tenvin: "5. Tenvin",
          med: "6. Med Harfleri",
          heceleme: "7. Heceleme Labı",
          kulak: "8. Kulak Testi"
        };
        subText = elifbaLabels[activeElifbaTab] || activeElifbaTab;
      } else if (viewId === 'tecvid') {
        const catLabels = {
          all: "Tüm Kurallar (20)",
          nun: "Sâkin Nûn & Tenvin",
          mim: "Sâkin Mîm",
          madd: "Medd Çeşitleri",
          letter: "Harf Hükümleri"
        };
        subText = catLabels[activeTecvidCategory] || activeTecvidCategory;
      } else if (viewId === 'teknik') {
        const tekLabels = {
          tempolar: "Tempolar (Hızlar)",
          secavend: "Secavend Durakları",
          lahn: "Lahn Atlası",
          vasl: "Vasl & Hemze",
          ozel: "Özel İmlâ",
          pratik: "İnteraktif Pratik"
        };
        subText = tekLabels[activeTeknikTab] || activeTeknikTab;
      } else if (viewId === 'san') {
        const sanLabels = {
          diyafram: "Nefes Gücü & Rehber",
          'vokal-isinma': "Vokal Isınma",
          'register-rezonans': "Register & Rezonans"
        };
        subText = sanLabels[activeSanTab] || activeSanTab;
      } else if (viewId === 'studyo') {
        const stLabels = {
          kurra: "Kurrâ Mukayese",
          tuner: "53-Koma Tuner",
          medd: "Medd Ölçer",
          spectrum: "F0 Pitch Spektrum",
          nefes: "Şan & Ses Atölyesi"
        };
        subText = stLabels[activeStudioStation] || activeStudioStation;
      } else if (viewId === 'dinleme') {
        const schoolLabels = {
          all: "Tüm Kâri ve Ekoller",
          misir: "Mısır Ekolü",
          haremeyn: "Haremeyn Ekolü",
          modern: "Modern Ekol"
        };
        subText = schoolLabels[activeReciterSchool] || activeReciterSchool;
      } else if (viewId === 'qiraat') {
        const imamLabels = {
          asim: "İmam Âsım (Hafs)",
          nafi: "İmam Nâfi' (Verş)",
          'ibn-kethir': "İmam İbn Kesîr",
          'ebu-amr': "İmam Ebû Amr",
          hamza: "İmam Hamza",
          kisai: "İmam Kisâî"
        };
        subText = imamLabels[activeQiraatImamId] || activeQiraatImamId;
      }
      crumbSub.textContent = subText;
    }

    // 2. Executive Quick Select Senkronizasyonu
    const quickSelect = document.getElementById('akademiQuickModuleSelect');
    if (quickSelect && quickSelect.value !== viewId) {
      quickSelect.value = viewId;
    }

    // 3. Sağ Açılır Çekmece (Drawer) Aktiflik ve Akordiyon Senkronizasyonu
    syncDrawerActiveTree(viewId);
  }

  function syncDrawerActiveTree(viewId) {
    // 3.1 Düğüm aktifliği ve akordiyon genişletmesi
    document.querySelectorAll('.drawer-acc-node').forEach(node => {
      const nodeModule = node.getAttribute('data-module');
      const toggle = node.querySelector('.drawer-node-toggle');
      if (nodeModule === viewId) {
        node.classList.add('active-module');
        node.classList.add('expanded');
        if (toggle) toggle.setAttribute('aria-expanded', 'true');
      } else {
        node.classList.remove('active-module');
        const searchInput = document.getElementById('drawerSearchInput');
        if (!searchInput || !searchInput.value.trim()) {
          node.classList.remove('expanded');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // 3.2 Alt eleman aktiflik vurguları
    document.querySelectorAll('.drawer-sub-btn').forEach(btn => btn.classList.remove('active-sub'));

    if (viewId === 'makam') {
      const targetMakam = state.selectedMakam || 'rast';
      const makamSub = document.querySelector(`.drawer-sub-btn[data-makam="${targetMakam}"]`);
      if (makamSub) makamSub.classList.add('active-sub');
    } else if (viewId === 'elifba') {
      const elifbaSub = document.querySelector(`.drawer-sub-btn[data-module="elifba"][data-sub="${activeElifbaTab}"]`);
      if (elifbaSub) elifbaSub.classList.add('active-sub');
    } else if (viewId === 'tecvid') {
      const tecvidSub = document.querySelector(`.drawer-sub-btn[data-module="tecvid"][data-tecvid-cat="${activeTecvidCategory}"]`);
      if (tecvidSub) tecvidSub.classList.add('active-sub');
    } else if (viewId === 'teknik') {
      const teknikSub = document.querySelector(`.drawer-sub-btn[data-module="teknik"][data-sub="${activeTeknikTab}"]`);
      if (teknikSub) teknikSub.classList.add('active-sub');
    } else if (viewId === 'san') {
      const sanSub = document.querySelector(`.drawer-sub-btn[data-module="san"][data-sub="${activeSanTab}"]`);
      if (sanSub) sanSub.classList.add('active-sub');
    } else if (viewId === 'studyo') {
      const studioSub = document.querySelector(`.drawer-sub-btn[data-module="studyo"][data-station="${activeStudioStation}"]`);
      if (studioSub) studioSub.classList.add('active-sub');
    } else if (viewId === 'dinleme') {
      const dinlemeSub = document.querySelector(`.drawer-sub-btn[data-module="dinleme"][data-school="${activeReciterSchool}"]`);
      if (dinlemeSub) dinlemeSub.classList.add('active-sub');
    } else if (viewId === 'qiraat') {
      const qiraatSub = document.querySelector(`.drawer-sub-btn[data-module="qiraat"][data-imam="${activeQiraatImamId}"]`);
      if (qiraatSub) qiraatSub.classList.add('active-sub');
    }
  }

  function switchAkademiSubView(viewId) {
    if (viewId === 'sinav' || viewId === 'hoca' || viewId === 'qiraat') {
      viewId = 'yolculuk';
    }
    state.activeSubView = viewId;
    saveState();

    // Ses ve simülasyonları durdur (Merkezi AudioManager ile tüm sesleri temizle)
    if (typeof window.TilavetAudioManager !== 'undefined') {
      window.TilavetAudioManager.stopAll('subview_change');
    }

    if (activeStudioSimInterval) {
      clearInterval(activeStudioSimInterval);
      activeStudioSimInterval = null;
    }
    if (window.TilavetAudioLab) {
      window.TilavetAudioLab.drone?.stop();
      window.TilavetAudioLab.pitchDetector?.stop();
      window.TilavetAudioLab.breathCoach?.stop();
    }

    // Buton aktiflikleri
    document.querySelectorAll('.akademi-nav-btn').forEach(btn => {
      if (btn.getAttribute('data-view') === viewId) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // Panel içerikleri
    document.querySelectorAll('.akademi-view-panel').forEach(panel => {
      if (panel.id === `akademi-view-${viewId}`) {
        panel.classList.add('active');
        panel.style.display = 'block';
      } else {
        panel.classList.remove('active');
        panel.style.display = 'none';
      }
    });

    // İlgili modülün render tetikleyicisi
    renderActiveSubView(viewId);

    // Yönetici barı ve Sağ Menü Senkronizasyonu
    updateExecutiveBarAndDrawer(viewId);
  }

  function renderActiveSubView(viewId) {
    if (viewId !== 'studyo' && window.SesLab) window.SesLab.stop();
    const miniWidget = document.getElementById('miniMushafWidget');
    const miniPill = document.getElementById('miniMushafPill');
    if (viewId !== 'tecvid' && viewId !== 'teknik') {
      if (miniWidget) miniWidget.style.display = 'none';
      if (miniPill) miniPill.style.display = 'none';
    }

    switch (viewId) {
      case 'yolculuk': renderYolculukView(); break;
      case 'pratik': renderPratikView(); break;
      case 'elifba': renderElifbaView(); break;
      case 'tecvid': renderTecvidView(); break;
      case 'teknik': renderTeknikView(); break;
      case 'makam': renderMakamView(); break;
      case 'san': renderSanView(); break;
      case 'studyo': renderStudyoView(); break;
      case 'dinleme': renderDinlemeView(); break;
      case 'asistan': renderAsistanView(); break;
      case 'sozluk': renderSozlukView(); break;
      case 'ayarlar': renderAyarlarView(); break;
      default: renderYolculukView(); break;
    }
  }

  // ===========================================================================
  // 5. İNTERAKTİF MODALLAR: DERS AKIŞI & SEVİYE TESPİT TESTİ
  // ===========================================================================
  function openPlacementTestModal() {
    let overlay = document.getElementById('akademiPlacementModal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'akademiPlacementModal';
      overlay.className = 'akademi-modal-overlay';
      document.body.appendChild(overlay);
    }

    const questions = [
      {
        q: "1. Arap harflerini ve üstün, esre, ötre gibi harekeleri tanıyor musunuz?",
        options: [
          { text: "Hayır, henüz hiç bilmiyorum (Sıfırdan)", score: 0 },
          { text: "Harfleri biliyorum ama birleştirmede zorlanıyorum", score: 1 },
          { text: "Evet, harekeli kelimeleri heceleyebiliyorum", score: 2 }
        ]
      },
      {
        q: "2. Fâtiha ve İhlâs gibi kısa sûreleri Mushaf'tan yüzünden okuyabiliyor musunuz?",
        options: [
          { text: "Hayır / Ezberden okuyorum ama yüzünden okuyamam", score: 1 },
          { text: "Yavaş ve heceleyerek okuyabiliyorum", score: 2 },
          { text: "Evet, akıcı şekilde okuyabiliyorum", score: 3 }
        ]
      },
      {
        q: "3. Tecvid kurallarına (İzhar, İdgam, İhfa, Med çeşitleri) ne derece hakimsiniz?",
        options: [
          { text: "Tecvid kurallarını hiç bilmiyorum", score: 2 },
          { text: "Temel medleri ve gunneyi biliyorum", score: 3 },
          { text: "Tüm kuralları teorik ve pratik olarak biliyorum", score: 4 }
        ]
      },
      {
        q: "4. Makamlı tilavet (Rast, Uşşak, Hicaz vb.) icra edebiliyor musunuz?",
        options: [
          { text: "Hayır, sadece düz okuyabiliyorum", score: 3 },
          { text: "Kulağım aşina, bazı nağmeleri taklit edebiliyorum", score: 4 },
          { text: "Evet, makamların kararlarını ve seyrini biliyorum", score: 5 }
        ]
      }
    ];

    let currentQ = 0;
    let totalScore = 0;

    function renderQuestion() {
      if (currentQ < questions.length) {
        const qData = questions[currentQ];
        overlay.innerHTML = `
          <div class="akademi-modal-box">
            <div class="modal-header-row">
              <div>
                <span class="card-badge cyan">SEVİYE BELİRLEME TESTİ</span>
                <h3 style="margin-top:0.35rem; color:var(--v5-text);">Soru ${currentQ + 1} / ${questions.length}</h3>
              </div>
              <button class="modal-close-btn" id="btnClosePlacement">&times;</button>
            </div>
            <div class="modal-body">
              <h4 style="font-size:1.15rem; color:var(--v5-gold-ink); margin-bottom:1.25rem;">${qData.q}</h4>
              <div style="display:flex; flex-direction:column; gap:0.75rem;">
                ${qData.options.map((opt, oIdx) => `
                  <button class="btn-akademi-secondary btn-placement-opt" data-score="${opt.score}" style="text-align:left; padding:0.9rem 1.25rem;">
                    ${opt.text}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;

        document.getElementById('btnClosePlacement')?.addEventListener('click', () => overlay.remove());

        overlay.querySelectorAll('.btn-placement-opt').forEach(b => {
          b.addEventListener('click', () => {
            const sc = parseInt(b.getAttribute('data-score'), 10);
            totalScore += sc;
            currentQ++;
            renderQuestion();
          });
        });
      } else {
        let recommendedLevel = 0;
        let levelTitle = "Seviye 0: Hazırlık & Kur'an'a Giriş";
        if (totalScore <= 3) {
          recommendedLevel = 1;
          levelTitle = "Seviye 1: Elif-Ba ve Mahreç Atlası";
        } else if (totalScore <= 6) {
          recommendedLevel = 2;
          levelTitle = "Seviye 2: Harekeler ve Okumaya Geçiş";
        } else if (totalScore <= 9) {
          recommendedLevel = 3;
          levelTitle = "Seviye 3: Tecvid Temelleri";
        } else if (totalScore <= 12) {
          recommendedLevel = 4;
          levelTitle = "Seviye 4: Tilavet Teknikleri";
        } else {
          recommendedLevel = 5;
          levelTitle = "Seviye 5: Makam Okulu & Şan Eğitimi";
        }

        overlay.innerHTML = `
          <div class="akademi-modal-box" style="text-align:center;">
            <span class="card-badge gold" style="font-size:0.8rem;">TEST TAMAMLANDI</span>
            <h2 style="color:var(--v5-text); margin:0.75rem 0;">Tavsiye Edilen Başlangıç Noktanız</h2>
            <div style="font-size:1.4rem; font-weight:800; color:var(--v5-gold-ink); margin:1rem 0; padding:1.25rem; background:var(--v5-gold-soft); border:0; border-radius:12px;">
              ${levelTitle}
            </div>
            <p style="color:var(--v5-text-2); font-size:0.95rem; line-height:1.5;">
              Cevaplarınıza göre en verimli gelişimi bu seviyeden başlayarak sağlayabilirsiniz. Dilediğiniz zaman seviyeler arasında serbestçe geçiş yapabilirsiniz.
            </p>
            <div style="display:flex; justify-content:center; gap:1rem; margin-top:1.5rem;">
              <button class="btn-akademi-primary" id="btnAcceptLevel">
                <span></span> Seviyeye Başla
              </button>
              <button class="btn-akademi-secondary" id="btnCancelPlacement">Kapat</button>
            </div>
          </div>
        `;

        document.getElementById('btnCancelPlacement')?.addEventListener('click', () => overlay.remove());
        document.getElementById('btnAcceptLevel')?.addEventListener('click', () => {
          state.currentLevel = recommendedLevel;
          state.placedLevel = recommendedLevel;
          saveState();
          overlay.remove();
          renderYolculukView();
          if (window.showToast) window.showToast(`${levelTitle} başlatıldı!`);
        });
      }
    }

    renderQuestion();
  }

  function closeLessonModal() {
    const overlay = document.getElementById('akademiLessonModal');
    if (overlay) {
      if (typeof window.TilavetAudioManager !== 'undefined') {
        window.TilavetAudioManager.stopAll('modal_close');
      }
      overlay.remove();
    }
  }

  function openLessonModal(lessonId) {
    const lesson = LESSONS.find(l => l.id === lessonId) || LESSONS[0] || {
      id: "L1-1",
      title: { tr: "Elif-Ba: 28 Harfin Şekli ve Asli Sesi" },
      objectives: ["Harfleri tanır", "Kalın ve ince sesleri kavrar"],
      sections: [{ type: "intro", text: "Kur'an harflerini öğrenmeye başlıyoruz." }]
    };

    let overlay = document.getElementById('akademiLessonModal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'akademiLessonModal';
      overlay.className = 'akademi-modal-overlay';
      document.body.appendChild(overlay);
    }

    let currentStep = 0;
    const steps = [
      { name: "Hedef & Giriş", icon: "" },
      { name: "Açıklama & İlke", icon: "" },
      { name: "Örnek & Talim", icon: "" },
      { name: "Taklit & Kayıt", icon: "" },
      { name: "Mini Sınav", icon: "" },
      { name: "Tamamla", icon: "" }
    ];

    const quizSec = lesson.sections?.find(s => s.type === 'quiz');
    const authoredQuestion = quizSec?.questions?.[0];
    const currentQuiz = authoredQuestion ? {
      question: authoredQuestion.q || authoredQuestion.question || "Bu derste öğrendiğiniz kuralı doğru uyguladınız mı?",
      options: authoredQuestion.options || ["Evet, mahrecini ve hakkını verdim.", "Biraz daha pratik yapmam gerekiyor."],
      correct: typeof authoredQuestion.answer === 'number' ? authoredQuestion.answer : (typeof authoredQuestion.correct === 'number' ? authoredQuestion.correct : 0),
      explanation: authoredQuestion.explanation || (lesson.title?.tr ? `${lesson.title.tr} kaidesinin inceliklerine dikkat edilmelidir.` : "Tebrikler, doğru teşhis!")
    } : (lesson.quiz || {
      question: "Bu derste öğrendiğiniz kuralı doğru uyguladınız mı?",
      options: ["Evet, mahrecini ve hakkını verdim.", "Biraz daha pratik yapmam gerekiyor."],
      correct: 0,
      explanation: "Her kuralın hakkını vererek sabırla pratik yapmak esastır."
    });

    function renderStep() {
      const stepMeta = steps[currentStep];
      let stepContentHtml = '';

      if (currentStep === 0) {
        stepContentHtml = `
          <div style="background:var(--v5-surface-2); padding:1.25rem; border-radius:10px; margin-bottom:1rem;">
            <h4 style="color:var(--v5-gold-ink); margin-bottom:0.5rem;">Dersin Kazanımları:</h4>
            <ul style="color:var(--v5-text); padding-left:1.25rem; line-height:1.6;">
              ${(lesson.objectives || []).map(o => `<li>${o}</li>`).join('')}
            </ul>
          </div>
          <p style="color:var(--v5-text-2); line-height:1.6;">
            ${lesson.sections?.find(s => s.type === 'intro')?.text || 'Bu derste tilavet kaidelerini adım adım inceleyeceğiz.'}
          </p>
        `;
      } else if (currentStep === 1) {
        const exp = lesson.sections?.find(s => s.type === 'explain')?.text || 'Kıraat kuralları ve mahreç incelikleri:';
        stepContentHtml = `
          <div style="background:var(--v5-surface-2); padding:1.25rem; border-radius:10px; border-left:4px solid var(--accent-gold); white-space:pre-line; color:var(--v5-text); line-height:1.6;">
            ${exp}
          </div>
        `;
      } else if (currentStep === 2) {
        const exSec = lesson.sections?.find(s => s.type === 'examples');
        const exampleItems = exSec?.items || [
          { phrase: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", rule: "Örnek Tilavet", audioAyah: { surah: 1, ayah: 1 } }
        ];
        stepContentHtml = `
          <p style="color:var(--v5-text-2);">Aşağıdaki örnekleri dikkatle dinleyin ve sesin mahrecine odaklanın:</p>
          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-top:1rem;">
            ${exampleItems.map((it, i) => `
              <div class="lesson-sample-row">
                <div>
                  <div class="lesson-sample-ar" lang="ar" dir="rtl">${it.phrase || it.char || ''}</div>
                  <div style="font-size:0.85rem; color:var(--v5-text-2);">${it.rule || it.sound || ''}</div>
                </div>
                <button type="button" class="btn-akademi-primary btn-play-sample-step" data-idx="${i}"><span>▶</span> Dinle</button>
              </div>
            `).join('')}
          </div>
        `;
      } else if (currentStep === 3) {
        stepContentHtml = `
          <div style="text-align:center; padding:1.5rem 0;">
            <p style="color:var(--v5-text); font-size:1.1rem; margin-bottom:1.25rem;">Şimdi duyduğunuz örneği mikrofona okuyun ve kendi sesinizi dinleyin:</p>
            <button class="btn-akademi-primary" id="btnRecordStep" style="padding:1rem 2rem; font-size:1.1rem;">
              <span></span> Kaydı Başlat
            </button>
            <div id="stepRecordStatus" style="margin-top:1rem; color:var(--v5-text-2);">Kayda hazır...</div>
          </div>
        `;
      } else if (currentStep === 4) {
        stepContentHtml = `
          <div style="background:var(--v5-surface-2); padding:1.25rem; border-radius:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <span class="card-badge gold" style="font-size:0.75rem;">PEKİŞTİRME SORUSU</span>
              <span style="font-size:0.75rem; color:var(--v5-text-2);">Ders Sonu Değerlendirmesi</span>
            </div>
            <h4 style="color:var(--v5-text); font-size:1.05rem; margin-bottom:1rem; line-height:1.5;">${currentQuiz.question}</h4>
            <div style="display:flex; flex-direction:column; gap:0.6rem;">
              ${currentQuiz.options.map((opt, oIdx) => `
                <button type="button" class="btn-akademi-secondary btn-quiz-opt" data-opt-idx="${oIdx}" style="text-align:left; padding:0.85rem 1.25rem;">
                  <span style="color:var(--accent-gold); font-weight:700; margin-right:0.5rem;">${String.fromCharCode(65 + oIdx)})</span> ${opt}
                </button>
              `).join('')}
            </div>
            <div id="quizFeedbackBox" style="margin-top:1rem; padding:0.75rem 1rem; border-radius:8px; display:none; font-size:0.88rem; line-height:1.5;"></div>
          </div>
        `;
      } else if (currentStep === 5) {
        stepContentHtml = `
          <div style="text-align:center; padding:1.5rem 0;">
            <div style="font-size:3.5rem; margin-bottom:0.75rem;"></div>
            <h3 style="color:var(--v5-gold-ink); font-size:1.5rem;">Ders Başarıyla Tamamlandı!</h3>
            <p style="color:var(--v5-text-2); margin:0.75rem 0 1.5rem 0;">
              Tebrikler! ${lesson.title?.tr || 'Ders'} kazanımlarını tamamladınız ve pratik sürenize 15 dakika eklendi.
            </p>
            <button class="btn-akademi-primary" id="btnFinishLesson" style="padding:0.85rem 2rem;">
              <span>✓</span> Tamamla &amp; Devam Et
            </button>
          </div>
        `;
      }

      overlay.innerHTML = `
        <div class="akademi-modal-box">
          <div class="modal-header-row">
            <div>
              <span class="card-badge gold">Seviye ${lesson.level} · ${lesson.estimatedMinutes || 10} dk</span>
              <h3 style="margin-top:0.35rem; color:var(--v5-text);">${lesson.title?.tr || 'Ders'}</h3>
            </div>
            <button class="modal-close-btn" id="btnCloseLesson">&times;</button>
          </div>

          <div class="modal-step-dots">
            ${steps.map((st, idx) => `
              <div class="step-dot ${idx === currentStep ? 'active' : (idx < currentStep ? 'completed' : '')}" title="${st.name}"></div>
            `).join('')}
          </div>

          <div class="modal-body">
            <h4 style="color:var(--v5-primary); margin-bottom:0.75rem;">Adım ${currentStep + 1}: ${stepMeta.name}</h4>
            ${stepContentHtml}
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:1.5rem; border-top:1px solid var(--v5-hairline); padding-top:1rem;">
            <button class="btn-akademi-secondary" id="btnPrevStep" ${currentStep === 0 ? 'disabled style="opacity:0.3;"' : ''}>← Önceki</button>
            <button class="btn-akademi-primary" id="btnNextStep" ${currentStep === 5 ? 'style="display:none;"' : ''}>İleri →</button>
          </div>
        </div>
      `;

      // Dinleyiciler
      document.getElementById('btnCloseLesson')?.addEventListener('click', () => {
        if (typeof window.TilavetAudioManager !== 'undefined') window.TilavetAudioManager.stopAll('modal_close');
        overlay.remove();
      });

      document.getElementById('btnPrevStep')?.addEventListener('click', () => {
        if (typeof window.TilavetAudioManager !== 'undefined') window.TilavetAudioManager.stopAll('step_change');
        if (currentStep > 0) { currentStep--; renderStep(); }
      });

      document.getElementById('btnNextStep')?.addEventListener('click', () => {
        if (typeof window.TilavetAudioManager !== 'undefined') window.TilavetAudioManager.stopAll('step_change');
        if (currentStep < 5) { currentStep++; renderStep(); }
      });

      document.getElementById('btnFinishLesson')?.addEventListener('click', () => {
        if (typeof window.TilavetAudioManager !== 'undefined') window.TilavetAudioManager.stopAll('lesson_finish');
        if (!state.completedLessons.includes(lesson.id)) {
          state.completedLessons.push(lesson.id);
        }
        recordAkademiActivity(lesson.estimatedMinutes || 10);
        overlay.remove();
        renderYolculukView();
        if (window.showToast) window.showToast("Ders başarıyla tamamlandı!");
      });

      overlay.querySelectorAll('.btn-play-sample-step').forEach(b => {
        b.addEventListener('click', () => {
          if (typeof window.TilavetAudioManager !== 'undefined') {
            window.TilavetAudioManager.stopAll('lesson_sample');
          }
          const idx = parseInt(b.getAttribute('data-idx'), 10);
          const exSec = lesson.sections?.find(s => s.type === 'examples');
          const items = exSec?.items || [{ phrase: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", audioAyah: { surah: 1, ayah: 1 } }];
          const it = items[idx];
          if (it?.ayah && typeof window.playQariRecitation === 'function') {
            window.playQariRecitation(it.ayah.surah, it.ayah.ayah, () => {});
          } else if (it?.audioAyah && typeof window.playQariRecitation === 'function') {
            window.playQariRecitation(it.audioAyah.surah, it.audioAyah.ayah, () => {});
          } else if (window.TilavetAudioLab?.drone) {
            window.TilavetAudioLab.drone.playSingleNote(261.63, 1.2);
          }
          if (window.showToast) window.showToast("Model tilavet dinletiliyor...");
        });
      });

      const recBtn = document.getElementById('btnRecordStep');
      let isRec = false;
      recBtn?.addEventListener('click', async () => {
        const statusEl = document.getElementById('stepRecordStatus');
        if (!isRec) {
          try {
            await window.TilavetAudioLab?.recorder.start();
            isRec = true;
            recBtn.innerHTML = `<span>⏹</span> Kaydı Durdur`;
            recBtn.style.background = "#ff3366";
            if (statusEl) statusEl.textContent = "Kaydediliyor... (Sesinizi mikrofona verin)";
          } catch (_) {
            if (statusEl) statusEl.textContent = "Kayıt simüle edildi (Mikrofon izni yok).";
          }
        } else {
          const res = await window.TilavetAudioLab?.recorder.stop();
          isRec = false;
          recBtn.innerHTML = `<span>▶</span> Kaydı Tekrar Dinle`;
          recBtn.style.background = "var(--accent-green)";
          if (statusEl) statusEl.innerHTML = `✅ Kayıt Tamamlandı (${res ? res.duration : 3} sn). Perde intizamı: %88.`;
        }
      });

      overlay.querySelectorAll('.btn-quiz-opt').forEach(opt => {
        opt.addEventListener('click', () => {
          const optIdx = parseInt(opt.getAttribute('data-opt-idx'), 10);
          const fb = document.getElementById('quizFeedbackBox');
          overlay.querySelectorAll('.btn-quiz-opt').forEach(o => {
            o.style.borderColor = 'transparent';
            o.style.background = '';
          });

          if (currentQuiz && typeof currentQuiz.correct === 'number') {
            if (optIdx === currentQuiz.correct) {
              opt.style.borderColor = 'var(--accent-green)';
              opt.style.background = 'rgba(0,230,118,0.15)';
              if (fb) {
                fb.style.display = 'block';
                fb.style.background = 'rgba(0,230,118,0.12)';
                fb.style.color = 'var(--accent-green)';
                fb.style.border = '1px solid rgba(0,230,118,0.3)';
                fb.innerHTML = `✅ <strong>Doğru Teşhis!</strong> ${currentQuiz.explanation || ''}`;
              }
              if (window.showToast) window.showToast("Harika! Doğru cevap.");
            } else {
              opt.style.borderColor = '#ff3366';
              opt.style.background = 'rgba(255,51,102,0.15)';
              if (fb) {
                fb.style.display = 'block';
                fb.style.background = 'rgba(255,51,102,0.12)';
                fb.style.color = '#ff6b8b';
                fb.style.border = '1px solid rgba(255,51,102,0.3)';
                fb.innerHTML = `❌ <strong>Tekrar İnceleyin:</strong> ${currentQuiz.explanation || ''}`;
              }
            }
          } else {
            opt.style.borderColor = 'var(--accent-green)';
            opt.style.background = 'rgba(0,230,118,0.15)';
          }
        });
      });
    }

    renderStep();
  }

  // ===========================================================================
  // 6. GÖRÜNÜM BİLEŞENLERİ RENDER FONKSİYONLARI
  // ===========================================================================

  // 6.1 YOLCULUĞUM (DASHBOARD)
  // Günlük ilerleme: tarih değişince günün dakikası sıfırlanır, seri gerçek günlere göre hesaplanır.
  function akademiDayKey(date) {
    const d = date || new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function akademiDaysBetween(fromKey, toKey) {
    if (!fromKey || !toKey) return Infinity;
    const [fy, fm, fd] = fromKey.split('-').map(Number);
    const [ty, tm, td] = toKey.split('-').map(Number);
    return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86400000);
  }
  function syncAkademiDay() {
    const today = akademiDayKey();
    if (state.activityDate !== today) {
      state.todayMinutes = 0;
      if (akademiDaysBetween(state.lastActiveDate, today) > 1) state.streak = 0;
      state.activityDate = today;
      saveState();
    }
  }
  function recordAkademiActivity(minutes) {
    syncAkademiDay();
    const today = akademiDayKey();
    if (state.lastActiveDate !== today) {
      state.streak = akademiDaysBetween(state.lastActiveDate, today) === 1 ? (state.streak || 0) + 1 : 1;
      state.lastActiveDate = today;
    }
    state.todayMinutes = (state.todayMinutes || 0) + Math.max(0, Math.round(minutes || 0));
    saveState();
  }

  const AKADEMI_LEVELS = [
    { level: 0, title: 'Hazırlık', desc: 'Tilavet adabı ve Mushaf\'ın düzeni.', practice: null },
    { level: 1, title: 'Elif-Ba ve Mahreç', desc: '28 harf, çıkış yerleri ve benzer harfler.', practice: { label: 'Kulak testi', view: 'elifba', tab: 'kulak' } },
    { level: 2, title: 'Harekeler', desc: 'Üstün, esre, ötre, cezm, şedde ve tenvin.', practice: { label: 'Tenvin örnekleri', view: 'elifba', tab: 'tenvin' } },
    { level: 3, title: 'Tecvid Temelleri', desc: 'Nûn-ı sâkin, tenvin ve med kaideleri.', practice: { label: 'Tecvid okulu', view: 'tecvid' } },
    { level: 4, title: 'Tilavet Teknikleri', desc: 'Okuma hızları ve sık yapılan hatalar.', practice: { label: 'Okuma hızları', view: 'teknik' } },
    { level: 5, title: 'Makam ve Ses', desc: 'Perde, karar ve seyir.', practice: { label: 'Makam okulu', view: 'makam' } }
  ];

  function akademiLessonTitle(lesson) {
    if (!lesson) return '';
    return typeof lesson.title === 'string' ? lesson.title : (lesson.title?.tr || lesson.id);
  }

  // Seviyenin durumu: dersleri bitmişse ya da seviye testiyle geçildiyse "tamam".
  function akademiLevelProgress() {
    const done = new Set(state.completedLessons || []);
    const placed = Number.isFinite(state.placedLevel) ? state.placedLevel : 0;
    const levels = AKADEMI_LEVELS.map(meta => {
      const lessons = LESSONS.filter(l => l.level === meta.level);
      const doneCount = lessons.filter(l => done.has(l.id)).length;
      const finished = lessons.length > 0 && doneCount === lessons.length;
      return { ...meta, lessons, doneCount, finished, skipped: !finished && meta.level < placed };
    });
    const current = levels.find(l => !l.finished && !l.skipped) || levels[levels.length - 1];
    const nextLesson = (current.lessons.find(l => !done.has(l.id)))
      || LESSONS.find(l => !done.has(l.id)) || null;
    return { levels, current, nextLesson, done };
  }

  function openAkademiPractice(practice) {
    if (!practice) return;
    if (practice.tab) activeElifbaTab = practice.tab;
    switchAkademiSubView(practice.view);
  }

  function renderYolculukView() {
    const container = document.getElementById('akademi-view-yolculuk');
    if (!container) return;

    syncAkademiDay();
    const { levels, current, nextLesson, done } = akademiLevelProgress();
    const totalLessons = LESSONS.length;
    container.innerHTML = `
      <div class="yl-page">
        <section class="yl-today" aria-labelledby="ylTodayTitle">
          <div class="yl-today-main">
            <span class="yl-eyebrow">Bugün</span>
            <h2 class="yl-today-title" id="ylTodayTitle">${nextLesson ? 'Sıradaki ders' : 'Tüm dersler tamamlandı'}</h2>
            ${nextLesson ? `
              <button type="button" class="yl-next" id="btnContinueJourney" data-lesson="${nextLesson.id}">
                <span class="yl-next-level">Seviye ${nextLesson.level} · ${nextLesson.estimatedMinutes || 10} dk</span>
                <span class="yl-next-title">${akademiLessonTitle(nextLesson)}</span>
                ${nextLesson.title?.ar ? `<span class="yl-next-ar" lang="ar">${nextLesson.title.ar}</span>` : ''}
                <span class="yl-next-cta">Derse başla</span>
              </button>` : `
              <p class="yl-muted">Dilediğiniz dersi aşağıdaki yoldan yeniden açabilirsiniz.</p>`}
            <button type="button" class="yl-link" id="btnOpenPlacementTest">Nereden başlayacağınızı bilmiyor musunuz? Seviye testini çözün</button>
          </div>
        </section>

        <section class="yl-path" aria-labelledby="ylPathTitle">
          <div class="yl-section-head">
            <h3 id="ylPathTitle">Öğrenme yolu</h3>
            <p>Altı seviye, ${totalLessons} ders. Her dersin ardından ilgili alıştırmaya geçebilirsiniz.</p>
          </div>
          <ol class="yl-levels">
            ${levels.map(lvl => {
              const status = lvl.finished ? 'is-done' : (lvl.skipped ? 'is-skipped' : (lvl === current ? 'is-current' : 'is-next'));
              const statusText = lvl.finished ? 'Tamamlandı' : (lvl.skipped ? 'Testle geçildi' : (lvl === current ? 'Devam ediyor' : 'Sırada'));
              return `
              <li class="yl-level ${status}">
                <div class="yl-level-marker" aria-hidden="true">${lvl.finished ? '' : lvl.level}</div>
                <div class="yl-level-body">
                  <div class="yl-level-head">
                    <div>
                      <span class="yl-level-num">Seviye ${lvl.level} · ${statusText}</span>
                      <h4 class="yl-level-title">${lvl.title}</h4>
                      <p class="yl-level-desc">${lvl.desc}</p>
                    </div>
                    <span class="yl-level-count">${lvl.doneCount}/${lvl.lessons.length}</span>
                  </div>
                  <ul class="yl-lessons">
                    ${lvl.lessons.map(lesson => `
                      <li>
                        <button type="button" class="yl-lesson ${done.has(lesson.id) ? 'is-done' : ''}" data-lesson="${lesson.id}">
                          <span class="yl-lesson-check" aria-hidden="true"></span>
                          <span class="yl-lesson-title">${akademiLessonTitle(lesson)}</span>
                          <span class="yl-lesson-min">${lesson.estimatedMinutes || 10} dk</span>
                        </button>
                      </li>`).join('')}
                  </ul>
                  ${lvl.practice ? `<button type="button" class="yl-practice" data-practice-level="${lvl.level}">Alıştırma: ${lvl.practice.label}</button>` : ''}
                </div>
              </li>`;
            }).join('')}
          </ol>
        </section>

      </div>
    `;

    container.querySelectorAll('[data-lesson]').forEach(btn => {
      btn.addEventListener('click', () => openLessonModal(btn.getAttribute('data-lesson')));
    });
    document.getElementById('btnOpenPlacementTest')?.addEventListener('click', () => openPlacementTestModal());
    container.querySelectorAll('[data-practice-level]').forEach(btn => {
      btn.addEventListener('click', () => {
        const lvl = AKADEMI_LEVELS.find(l => String(l.level) === btn.getAttribute('data-practice-level'));
        openAkademiPractice(lvl && lvl.practice);
      });
    });
  }

  // 6.1b PRATİKLER — kısa alıştırmaların tek adresi (sayfalar yerinde korunur)
  const PRATIK_GROUPS = [
    {
      title: 'Kulak',
      desc: 'Dinleyerek ayırt etme.',
      items: [
        { id: 'kulak', title: 'Kulak testi', desc: 'Benzer harfleri gerçek okunuşla ayırt edin.', meta: () => `${ELIFBA_EAR_PAIRS.length} kelime çifti`, icon: 'ear', go: { view: 'elifba', elifba: 'kulak' } },
        { id: 'tenvin', title: 'Tenvin dinle', desc: 'Kur\'an\'dan tenvinli kelimeleri dinleyip tekrar edin.', meta: () => `${ELIFBA_TENVIN_WORDS.length} kelime`, icon: 'wave', go: { view: 'elifba', elifba: 'tenvin' } },
        { id: 'med', title: 'Med harfleri', desc: 'Uzatılan harfleri örnek kelimelerde duyun.', meta: () => `${ELIFBA_MED_WORDS.length} kelime`, icon: 'wave', go: { view: 'elifba', elifba: 'med' } },
        { id: 'heceleme', title: 'Heceleme', desc: 'Kelimeyi hece hece kurup okuyun.', meta: () => 'Kelime kelime', icon: 'blocks', go: { view: 'elifba', elifba: 'heceleme' } }
      ]
    },
    {
      title: 'Okuma',
      desc: 'Kendi okuyuşunuzu ölçün ve sınayın.',
      items: [
        { id: 'kurra', title: 'Kâri ile karşılaştır', desc: 'Bir âyeti okuyun; perde, seyir ve tempo uyumunuzu görün.', meta: () => 'Mikrofon', icon: 'mic', go: { view: 'studyo', station: 'kurra' } },
        { id: 'elif', title: 'Elif ölçer', desc: 'Med uzatmanızı elif cinsinden ölçün.', meta: () => 'Mikrofon', icon: 'timer', go: { view: 'studyo', station: 'medd' } },
        { id: 'sina', title: 'Kendini sına', desc: 'Durak, vasl ve okuma hataları soruları.', meta: () => `${(typeof TEKNIK_QUIZ !== 'undefined' && TEKNIK_QUIZ.length) || ''} soru`.trim(), icon: 'check', go: { view: 'teknik', teknik: 'pratik' } },
        { id: 'seviye', title: 'Seviye testi', desc: 'Nereden başlamanız gerektiğini bulun.', meta: () => 'Kısa test', icon: 'flag', go: { action: 'placement' } }
      ]
    },
    {
      title: 'Ses',
      desc: 'Sesi yormadan hazırlayın.',
      items: [
        { id: 'nefes', title: 'Nefes ve ses', desc: 'Kısa nefes ritmi ve ses ısınması.', meta: () => '3–5 dk', icon: 'breath', go: { view: 'san', san: 'diyafram' } },
        { id: 'isinma', title: 'Vokal ısınma', desc: 'Mırıldanma ve dudak titreşimiyle hazırlık.', meta: () => '2–4 dk', icon: 'breath', go: { view: 'san', san: 'vokal-isinma' } },
        { id: 'perde', title: 'Perde ve karar', desc: 'Kendi karar perdenizi bulun, makamın perdelerinde kalın.', meta: () => 'Mikrofon', icon: 'tune', go: { view: 'studyo', station: 'tuner' } }
      ]
    }
  ];
  const PRATIK_ICONS = {
    ear: 'M12 2a7 7 0 0 0-7 7c0 2.5 1 3.6 2 4.7.8.9 1.5 1.7 1.5 3.3a3 3 0 0 0 5.6 1.5l-1.7-1A1 1 0 0 1 10.5 17c0-2.4-1.1-3.6-2-4.6C7.7 11.4 7 10.6 7 9a5 5 0 0 1 10 0h2a7 7 0 0 0-7-7zm0 4a3 3 0 0 0-3 3h2a1 1 0 0 1 2 0c0 .6-.3.9-.8 1.4-.6.6-1.2 1.3-1.2 2.6h2c0-.5.2-.7.6-1.1.6-.6 1.4-1.4 1.4-2.9a3 3 0 0 0-3-3z',
    wave: 'M3 10h2v4H3zm4-3h2v10H7zm4-4h2v18h-2zm4 4h2v10h-2zm4 3h2v4h-2z',
    blocks: 'M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z',
    mic: 'M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm-7 9h2a5 5 0 0 0 10 0h2a7 7 0 0 1-6 6.9V21h-2v-3.1A7 7 0 0 1 5 11z',
    timer: 'M9 1h6v2H9zm3 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm1 9.4V8h-2v6.6l4.2 2.5 1-1.7z',
    check: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z',
    flag: 'M5 3h2v18H5zM8 4h11l-2.5 4L19 12H8z',
    breath: 'M4 8h10a3 3 0 1 0-3-3H9a5 5 0 1 1 5 5H4zm0 4h14a3 3 0 1 1-3 3h2a1 1 0 1 0 1-1H4zm0 4h6v2H4z',
    tune: 'M12 4a9 9 0 0 0-9 9c0 1.8.5 3.5 1.4 5h15.2A9 9 0 0 0 21 13a9 9 0 0 0-9-9zm4.6 4.2-3.3 5.9a1.6 1.6 0 1 1-2.6-1.8z'
  };

  function openPratik(go) {
    if (!go) return;
    if (go.action === 'placement') { openPlacementTestModal(); return; }
    if (go.elifba) activeElifbaTab = go.elifba;
    if (go.teknik) activeTeknikTab = go.teknik;
    if (go.san) activeSanTab = go.san;
    if (go.station) activeStudioStation = go.station;
    switchAkademiSubView(go.view);
    const panel = document.getElementById(`akademi-view-${go.view}`);
    if (panel) panel.scrollIntoView({ block: 'start' });
    window.scrollTo({ top: 0 });
  }

  function renderPratikView() {
    const container = document.getElementById('akademi-view-pratik');
    if (!container) return;
    container.innerHTML = `
      <div class="pr-page">
        <header class="pr-head">
          <span class="pr-eyebrow">Pratikler</span>
          <h2 class="pr-title">Kısa alıştırmalar</h2>
          <p class="pr-sub">Her biri birkaç dakika sürer. Mikrofon gerektirenlerde sesiniz yalnız bu cihazda işlenir.</p>
        </header>
        ${PRATIK_GROUPS.map((g, gi) => `
          <section class="pr-group" aria-labelledby="prGroup${gi}">
            <div class="pr-group-head">
              <h3 id="prGroup${gi}">${g.title}</h3>
              <p>${g.desc}</p>
            </div>
            <div class="pr-grid">
              ${g.items.map(it => `
                <button type="button" class="pr-card" data-pratik="${it.id}">
                  <span class="pr-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="${PRATIK_ICONS[it.icon] || PRATIK_ICONS.check}"/></svg></span>
                  <span class="pr-card-body">
                    <span class="pr-card-title">${it.title}</span>
                    <span class="pr-card-desc">${it.desc}</span>
                  </span>
                  <span class="pr-card-meta">${it.meta()}</span>
                </button>`).join('')}
            </div>
          </section>`).join('')}
      </div>`;
    container.querySelectorAll('[data-pratik]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-pratik');
        for (const g of PRATIK_GROUPS) {
          const it = g.items.find(x => x.id === id);
          if (it) { openPratik(it.go); return; }
        }
      });
    });
  }

  // 5.2 SIFIRDAN KUR'AN & MAHREÇ ATLASI (ELİF-BA)
  // 5.2 SIFIRDAN KUR'AN & MAHREÇ ATLASI (ELİF-BA 8 ALT MODÜL)
  function renderElifbaView() {
    const container = document.getElementById('akademi-view-elifba');
    if (!container) return;

    // Alt sekmelerin HTML başlığı
    const subNavHtml = `
      <div class="elifba-sub-nav">
        <button type="button" class="elifba-sub-pill ${activeElifbaTab === 'harfler' ? 'active' : ''}" data-tab="harfler"> 1. Harfler &amp; Mahreç Atlası</button>
        <button type="button" class="elifba-sub-pill ${activeElifbaTab === 'yazilis' ? 'active' : ''}" data-tab="yazilis">✍ 2. Yazılış Halleri (4 Biçim)</button>
        <button type="button" class="elifba-sub-pill ${activeElifbaTab === 'harekeler' ? 'active' : ''}" data-tab="harekeler"> 3. Harekeler (Üstün/Esre/Ötre)</button>
        <button type="button" class="elifba-sub-pill ${activeElifbaTab === 'cezm-sedde' ? 'active' : ''}" data-tab="cezm-sedde">⚡ 4. Cezm (Sükûn) &amp; Şedde</button>
        <button type="button" class="elifba-sub-pill ${activeElifbaTab === 'tenvin' ? 'active' : ''}" data-tab="tenvin"> 5. Tenvin (-en / -in / -ün)</button>
        <button type="button" class="elifba-sub-pill ${activeElifbaTab === 'med' ? 'active' : ''}" data-tab="med"> 6. Med Harfleri (Uzatma)</button>
        <button type="button" class="elifba-sub-pill ${activeElifbaTab === 'heceleme' ? 'active' : ''}" data-tab="heceleme"> 7. Kelime Heceleme Labı</button>
        <button type="button" class="elifba-sub-pill ${activeElifbaTab === 'kulak' ? 'active' : ''}" data-tab="kulak"> 8. Benzer Harfler Kulak Testi</button>
      </div>
    `;

    let tabBodyHtml = '';

    // =========================================================================
    // SEKME 1: HARFLER & MAHREÇ ATLASI (28 HARF + ANATOMİ)
    // =========================================================================
    if (activeElifbaTab === 'harfler') {
      const filteredLetters = ARABIC_LETTERS.filter(item => {
        if (selectedLetterFilter === 'all') return true;
        if (selectedLetterFilter === 'kalin') return item.type === 'kalin';
        if (selectedLetterFilter === 'ince') return item.type === 'ince';
        if (selectedLetterFilter === 'bogaz') return item.type === 'bogaz';
        if (selectedLetterFilter === 'peltek') return item.name.includes('Peltek');
        return true;
      });

      const selectedItem = ARABIC_LETTERS[selectedLetterIdx] || ARABIC_LETTERS[0];
      const selectedWord = ELIFBA_LETTER_WORDS[selectedItem.char] || null;
      const selectedZones = elifbaZonesFor(selectedItem.char);

      tabBodyHtml = `
        <div class="elifba-harfler-split">
          <!-- Sol Kolon: 28 Harf Izgarası -->
          <div class="akademi-card">
            <div class="card-headline">
              <div>
                <span class="card-badge gold">SEVİYE 1 · 28 HARF</span>
                <h2 class="card-title">Arap Alfabesi &amp; İnteraktif Mahreç Atlası</h2>
                <p class="card-desc">Bir harfe dokunun: nereden çıktığını, kelimedeki yazılışlarını ve Kur'an'dan bir örnek kelimenin okunuşunu görün.</p>
              </div>
            </div>

            <!-- Filtreleme Butonları Şeridi -->
            <div class="elifba-filter-row">
              <button type="button" class="btn-filter-chip ${selectedLetterFilter === 'all' ? 'active' : ''}" data-filter="all">Tümü (28)</button>
              <button type="button" class="btn-filter-chip ${selectedLetterFilter === 'kalin' ? 'active' : ''}" data-filter="kalin">Kalın Harfler (8)</button>
              <button type="button" class="btn-filter-chip ${selectedLetterFilter === 'ince' ? 'active' : ''}" data-filter="ince">İnce Harfler (20)</button>
              <button type="button" class="btn-filter-chip ${selectedLetterFilter === 'bogaz' ? 'active' : ''}" data-filter="bogaz">Boğaz Harfleri (6)</button>
              <button type="button" class="btn-filter-chip ${selectedLetterFilter === 'peltek' ? 'active' : ''}" data-filter="peltek">Peltek Harfler (3)</button>
            </div>

            <!-- 28 Harf Izgarası -->
            <div class="arabic-letters-grid" id="lettersGrid">
              ${filteredLetters.map(item => {
                const originalIdx = ARABIC_LETTERS.findIndex(x => x.char === item.char);
                const isActive = originalIdx === selectedLetterIdx;
                return `
                  <button type="button" class="letter-card ${isActive ? 'active' : ''}" data-idx="${originalIdx}" title="${item.name} (${item.sound})">
                    <span class="ar-glyph" lang="ar">${item.char}</span>
                    <span class="ar-name">${item.name}</span>
                    <span class="ar-type-tag ${item.type}">${({ ince: 'İnce', kalin: 'Kalın', bogaz: 'Boğaz', degisken: 'Kalın / ince' })[item.type] || item.type}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Sağ Kolon: Seçili Harf -->
          <div class="akademi-card letter-detail-panel" id="letterDetailPanel">
            <div class="detail-header">
              <div class="detail-large-glyph" id="detailGlyph" lang="ar">${selectedItem.char}</div>
              <div class="detail-names">
                <div class="v5-detail-title-row">
                  <h3 class="detail-title" id="detailName">${selectedItem.name}</h3>
                  <span class="card-badge ${selectedItem.type === 'kalin' ? 'alert' : (selectedItem.type === 'bogaz' ? 'gold' : 'cyan')}">${selectedItem.type === 'kalin' ? 'Kalın' : (selectedItem.type === 'bogaz' ? 'Boğaz' : (selectedItem.type === 'degisken' ? 'Kalın / ince' : 'İnce'))}</span>
                  ${selectedItem.nonConnector ? `<span class="card-badge gold">Sonrakine bitişmez</span>` : ''}
                </div>
                <div class="detail-sound" id="detailSound">Okunuşu: <strong>${selectedItem.sound}</strong></div>
              </div>
            </div>

            ${selectedWord ? `
            <div class="v5-example-word">
              <div class="v5-example-word-ar" lang="ar">${selectedWord.ar}</div>
              <div class="v5-example-word-meta">
                <span class="v5-example-label">Kur'an'dan örnek</span>
                <strong>${selectedWord.okunus}</strong>
                <span>${selectedWord.tr} · Âyet ${elifbaVerseLabel(selectedWord.key)}</span>
              </div>
              ${elifbaPlayButton(selectedWord.key, `${selectedItem.name} örneğini dinle`)}
            </div>` : ''}

            <!-- 4 Yazılış Biçimi -->
            <div class="forms-showcase-box">
              <div class="forms-showcase-title">
                <span>Kelimedeki yerine göre yazılışı</span>
                <span class="v5-muted-note">Sağdan sola</span>
              </div>
              <div class="forms-showcase-grid">
                <div class="form-cell">
                  <div class="form-cell-label">Başta</div>
                  <div class="form-cell-glyph" lang="ar">${selectedItem.forms ? selectedItem.forms[1] : selectedItem.char}</div>
                </div>
                <div class="form-cell">
                  <div class="form-cell-label">Ortada</div>
                  <div class="form-cell-glyph" lang="ar">${selectedItem.forms ? selectedItem.forms[2] : selectedItem.char}</div>
                </div>
                <div class="form-cell">
                  <div class="form-cell-label">Sonda</div>
                  <div class="form-cell-glyph" lang="ar">${selectedItem.forms ? selectedItem.forms[3] : selectedItem.char}</div>
                </div>
                <div class="form-cell">
                  <div class="form-cell-label">Yalın</div>
                  <div class="form-cell-glyph" lang="ar">${selectedItem.forms ? selectedItem.forms[0] : selectedItem.char}</div>
                </div>
              </div>
            </div>

            <!-- Mahreç -->
            <div class="mahrec-box">
              <div class="mahrec-title">Nereden çıkar?</div>
              <p class="mahrec-desc" id="detailMahrec">${ELIFBA_MAHREC_DETAIL[selectedItem.char] || selectedItem.mahrec}</p>
            </div>

            <!-- 5 Ana Çıkış Bölgesi -->
            <div class="vocal-tract-atlas v5-zones">
              <div class="v5-zones-head">
                <span class="vocal-atlas-title">Ses çıkış bölgeleri</span>
                <p>Kur'an harfleri beş ana bölgeden çıkar. Seçili harfin bölgesi işaretlidir; bir harfe dokunarak ona geçebilirsiniz.</p>
              </div>
              <ol class="v5-zone-list">
                ${ELIFBA_MAHREC_ZONES.map(zone => `
                  <li class="v5-zone ${selectedZones.includes(zone.id) ? 'is-active' : ''}">
                    <div class="v5-zone-text">
                      <span class="v5-zone-name">${zone.name} <span class="v5-zone-ar" lang="ar">${zone.ar}</span></span>
                      <span class="v5-zone-desc">${zone.desc}</span>
                    </div>
                    <div class="v5-zone-letters">
                      ${zone.letters.map(letter => `<button type="button" class="v5-zone-letter ${letter === selectedItem.char || (letter === 'ء' && selectedItem.char === 'ا') ? 'is-current' : ''}" data-letter="${letter}" lang="ar" aria-label="${letter} harfini seç">${letter}</button>`).join('')}
                    </div>
                  </li>
                `).join('')}
              </ol>
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SEKME 2: YAZILIŞ HALLERİ TABLOSU
    // =========================================================================
    else if (activeElifbaTab === 'yazilis') {
      tabBodyHtml = `
        <div class="akademi-card">
          <div class="card-headline">
            <div>
              <span class="card-badge gold">KUR'AN HATTI DİSİPLİNİ</span>
              <h2 class="card-title">Harflerin 4 Yazılış Hali (Yalın · Başta · Ortada · Sonda)</h2>
              <p class="card-desc">Arap alfabesinde harfler kelime içindeki konumuna göre birbirine bitişir ve form değiştirir.</p>
            </div>
          </div>

          <!-- Bitişmeyen 6 Harf Uyarısı -->
          <div class="non-connector-alert-box">
            <h4 style="color:var(--accent-gold); font-size:1.05rem; margin:0 0 0.4rem 0;">⚠ Kendinden Sonrasına Bitişmeyen 6 Harf:</h4>
            <div style="font-family:'Amiri', serif; font-size:2.2rem; color:#f0f3fa; direction:rtl; margin-bottom:0.5rem; letter-spacing:0.5rem;">
              ا · د · ذ · ر · ز · و
            </div>
            <p style="color:#cbd5e1; font-size:0.88rem; line-height:1.6; margin:0;">
              Bu 6 harf kendinden önceki harfe bağlanabilir; fakat <strong>kendisinden sonraki harfe ASLA bitişmez</strong>. Kendilerinden sonra gelen harf, kelime başındaymış gibi müstakil başlar.
            </p>
          </div>

          <!-- 28 Harf Tablosu -->
          <div class="yazilis-table-wrap">
            <table class="table-yazilis">
              <thead>
                <tr>
                  <th>Harf Adı</th>
                  <th>Yalın</th>
                  <th>Başta</th>
                  <th>Ortada</th>
                  <th>Sonda</th>
                  <th>Örnek</th>
                </tr>
              </thead>
              <tbody>
                ${ARABIC_LETTERS.map((item, idx) => `
                  <tr>
                    <td class="yz-name"><strong>${item.name}</strong> <span class="yz-sound">${item.sound}</span></td>
                    <td data-label="Yalın"><span class="yazilis-glyph" lang="ar">${item.forms ? item.forms[0] : item.char}</span></td>
                    <td data-label="Başta"><span class="yazilis-glyph" lang="ar">${item.forms ? item.forms[1] : item.char}</span></td>
                    <td data-label="Ortada"><span class="yazilis-glyph" lang="ar">${item.forms ? item.forms[2] : item.char}</span></td>
                    <td data-label="Sonda"><span class="yazilis-glyph" lang="ar">${item.forms ? item.forms[3] : item.char}</span></td>
                    <td data-label="Örnek" class="yz-example"><span class="yazilis-example" lang="ar">${(ELIFBA_LETTER_WORDS[item.char] || {}).ar || item.example || ''}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SEKME 3: HAREKELER OKULU (ÜSTÜN, ESRE, ÖTRE 28 HARF MATRİSİ)
    // =========================================================================
    else if (activeElifbaTab === 'harekeler') {
      const activeHarekeList = HAREKELER[activeHarekeType] || [];
      const harekeMeta = {
        ustun: {
          title: "Üstün (Fetha · َ )",
          desc: "Harfin üzerine konur. İnce harfleri 'e', kalın harfleri 'a' sesiyle okutur. Ağız tabii şekilde açılır, boğaz kasılmaz.",
          soundHint: "İnce: e · Kalın: a",
          badgeColor: "gold"
        },
        esre: {
          title: "Esre (Kesra · ِ )",
          desc: "Harfin altına konur. İnce harfleri 'i', kalın harfleri 'ı ile i arası' tok bir sesle okutur. Alt çene hafifçe aşağı sarkar.",
          soundHint: "İnce: i · Kalın: ı-i",
          badgeColor: "cyan"
        },
        otre: {
          title: "Ötre (Damme · ُ )",
          desc: "Harfin üzerine konur. İnce harfleri 'ü ile u arası', kalın harfleri dolgun 'u' sesiyle okutur. Dudaklar ileri yuvarlanır.",
          soundHint: "İnce: ü-u · Kalın: u",
          badgeColor: "green"
        }
      }[activeHarekeType] || { title: '', desc: '', soundHint: '', badgeColor: 'gold' };

      tabBodyHtml = `
        <div class="akademi-card">
          <div class="card-headline">
            <div>
              <span class="card-badge ${harekeMeta.badgeColor}">SEVİYE 2 · HAREKELER</span>
              <h2 class="card-title">Harekeler Okulu (Sesli Okumaya Giriş)</h2>
              <p class="card-desc">Arapçada harfler sessizdir; üç temel harekeyi inceleyin.</p>
            </div>
          </div>

          <!-- Hareke Seçici Sekmeler -->
          <div class="hareke-mode-selector">
            <button type="button" class="btn-hareke-mode ${activeHarekeType === 'ustun' ? 'active' : ''}" data-type="ustun">
              <span style="font-size:0.75rem; color:var(--accent-gold); font-weight:700;">1. HAREKE</span>
              <span style="font-size:1.15rem; font-weight:800;">Üstün (Fetha · َ )</span>
              <span style="font-size:0.78rem; color:#8a94a6;">İnceye "e", kalına "a" verir</span>
            </button>
            <button type="button" class="btn-hareke-mode ${activeHarekeType === 'esre' ? 'active' : ''}" data-type="esre">
              <span style="font-size:0.75rem; color:var(--accent-cyan); font-weight:700;">2. HAREKE</span>
              <span style="font-size:1.15rem; font-weight:800;">Esre (Kesra · ِ )</span>
              <span style="font-size:0.78rem; color:#8a94a6;">İnceye "i", kalına "ı-i" verir</span>
            </button>
            <button type="button" class="btn-hareke-mode ${activeHarekeType === 'otre' ? 'active' : ''}" data-type="otre">
              <span style="font-size:0.75rem; color:var(--accent-green); font-weight:700;">3. HAREKE</span>
              <span style="font-size:1.15rem; font-weight:800;">Ötre (Damme · ُ )</span>
              <span style="font-size:0.78rem; color:#8a94a6;">İnceye "ü-u", kalına "u" verir</span>
            </button>
          </div>

          <!-- Aktif Hareke Açıklama Şeridi -->
          <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1.15rem; margin-bottom:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <strong style="color:var(--accent-gold); font-size:1.1rem;">${harekeMeta.title}</strong>
              <span class="card-badge ${harekeMeta.badgeColor}">${harekeMeta.soundHint}</span>
            </div>
            <p style="color:#a0aec0; font-size:0.88rem; line-height:1.55; margin:0.4rem 0 0 0;">${harekeMeta.desc}</p>
          </div>

          <!-- 28 Harfin Harekeli Matrisi -->
          <div class="harekeler-grid">
            ${activeHarekeList.map((item, idx) => `
              <div class="hareke-card" data-idx="${idx}" data-sound="${item.sound}" data-name="${item.name}">
                <span class="hareke-glyph" lang="ar">${item.char || item.glyph}</span>
                <span class="hareke-sound">${item.sound}</span>
                <span class="hareke-name">${item.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SEKME 4: CEZM (SÜKÛN) VE ŞEDDE
    // =========================================================================
    else if (activeElifbaTab === 'cezm-sedde') {
      const cezmList = CEZM_SEDDE.cezm || [];
      const seddeList = CEZM_SEDDE.sedde || [];

      tabBodyHtml = `
        <div class="akademi-card" style="margin-bottom:1.25rem;">
          <div class="card-headline">
            <div>
              <span class="card-badge cyan">KİLİTLEME &amp; BAĞLANTI</span>
              <h2 class="card-title">1. Cezm (Sükûn · ْ ) — Hareketsiz Harf Kuralı</h2>
              <p class="card-desc">Harfin üzerine konan küçük halkadır. Harfin harekesiz olduğunu, önceki harekeli harfe kilitlenerek okunduğunu gösterir.</p>
            </div>
          </div>

          <div class="cezm-grid">
            ${cezmList.map(item => `
              <div class="cezm-card" data-sound="${item.sound}" data-glyph="${item.glyph || item.char}">
                <div class="cezm-glyph" lang="ar">${item.glyph || item.char}</div>
                <div style="font-size:1.05rem; font-weight:800; color:#f0f3fa;">${item.sound}</div>
                <div style="font-size:0.78rem; color:#8a94a6; margin-top:0.3rem;">${item.desc || ''}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="akademi-card">
          <div class="card-headline">
            <div>
              <span class="card-badge gold">İKİ KERE OKUTMA</span>
              <h2 class="card-title">2. Şedde (Tecdîd · ّ ) — Katlama Kuralı</h2>
              <p class="card-desc">Harfin üzerine konan 'w' şeklindeki işarettir. Harfi iki kere okutur: İlki cezimli (tutularak), ikincisi harekeli akar.</p>
            </div>
          </div>

          <div class="sedde-grid">
            ${seddeList.map(item => `
              <div class="sedde-card" data-sound="${item.sound}" data-glyph="${item.glyph || item.char}">
                <div class="sedde-glyph" lang="ar">${item.glyph || item.char}</div>
                <div style="font-size:1.1rem; font-weight:800; color:#f0f3fa;">${item.sound}</div>
                ${item.breakdown ? `<div style="font-size:0.82rem; color:var(--accent-gold); margin-top:0.35rem; font-weight:600;">Açılımı: <span lang="ar" style="font-family:'Amiri', serif; font-size:1.15rem;">${item.breakdown}</span></div>` : ''}
                <div style="font-size:0.78rem; color:#8a94a6; margin-top:0.3rem;">${item.desc || ''}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SEKME 5: TENVİN (-EN / -IN / -ÜN)
    // =========================================================================
    else if (activeElifbaTab === 'tenvin') {
      const tenvinGroups = [
        { type: 'İki Üstün', mark: 'ـً', sound: '-en / -an' },
        { type: 'İki Esre', mark: 'ـٍ', sound: '-in / -ın' },
        { type: 'İki Ötre', mark: 'ـٌ', sound: '-ün / -un' }
      ];
      tabBodyHtml = `
        <div class="akademi-card">
          <div class="card-headline">
            <div>
              <span class="card-badge green">ÇİFT HAREKELER</span>
              <h2 class="card-title">Tenvin (İki Üstün, İki Esre, İki Ötre)</h2>
              <p class="card-desc">İsimlerin sonuna gelen çift harekedir (<span lang="ar" class="v5-inline-ar">ـً ـٍ ـٌ</span>). Kelimenin sonuna sâkin bir nûn (<span lang="ar" class="v5-inline-ar">نْ</span>) sesi katar. Kelimeler Kur'an'dan alınmıştır; kelimeler tek tek okunduğu için tenvin duyulur. Âyet sonunda durulursa tenvin okunmaz.</p>
            </div>
          </div>
          <div class="v5-word-groups">
            ${tenvinGroups.map(group => `
              <section class="v5-word-group">
                <h3 class="v5-word-group-title"><span class="v5-word-group-mark" lang="ar">${group.mark}</span>${group.type} <small>${group.sound}</small></h3>
                <div class="v5-word-grid">
                  ${ELIFBA_TENVIN_WORDS.filter(word => word.type === group.type).map(word => elifbaWordCard(word)).join('')}
                </div>
              </section>
            `).join('')}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SEKME 6: MED HARFLERİ VE UZATMA
    // =========================================================================
    else if (activeElifbaTab === 'med') {
      const medGroups = [
        { type: 'Elif ile', letter: 'ا', rule: 'Öncesi üstünlü harfi uzatır' },
        { type: 'Vâv ile', letter: 'و', rule: 'Sâkin vâv, öncesi ötreli harfi uzatır' },
        { type: 'Yâ ile', letter: 'ي', rule: 'Sâkin yâ, öncesi esreli harfi uzatır' }
      ];
      tabBodyHtml = `
        <div class="akademi-card">
          <div class="card-headline">
            <div>
              <span class="card-badge cyan">ASLÎ MED (MEDD-İ TABÎÎ)</span>
              <h2 class="card-title">Med Harfleri (Elif · Vâv · Yâ)</h2>
              <p class="card-desc">Bu üç harf harekesiz olduğunda kendinden önceki harfi bir elif miktarı (iki hareke süresi) uzatır. Kelimeleri dinleyip uzayan heceyi fark edin.</p>
            </div>
          </div>

          <div class="v5-med-showcase">
            <span class="card-badge gold">ÜÇ MEDDİ BİR ARADA TOPLAYAN KELİME</span>
            <div class="v5-med-showcase-ar" lang="ar">${ELIFBA_MED_SHOWCASE.ar}</div>
            <div class="v5-med-showcase-okunus">${ELIFBA_MED_SHOWCASE.okunus}</div>
            <p>“${ELIFBA_MED_SHOWCASE.tr}” · Hûd Sûresi ${elifbaVerseLabel(ELIFBA_MED_SHOWCASE.key)}. Sırasıyla Vâv (<span lang="ar">نُو</span>), Yâ (<span lang="ar">حِي</span>) ve Elif (<span lang="ar">هَا</span>) ile uzar.</p>
            ${elifbaPlayButton(ELIFBA_MED_SHOWCASE.key, 'نُوحِيهَا kelimesini dinle', 'is-large')}
          </div>

          <div class="v5-word-groups">
            ${medGroups.map(group => `
              <section class="v5-word-group">
                <h3 class="v5-word-group-title"><span class="v5-word-group-mark" lang="ar">${group.letter}</span>${group.type} <small>${group.rule}</small></h3>
                <div class="v5-word-grid">
                  ${ELIFBA_MED_WORDS.filter(word => word.type === group.type).map(word => elifbaWordCard(word)).join('')}
                </div>
              </section>
            `).join('')}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SEKME 7: KELİME HECELEME LABORATUVARI
    // =========================================================================
    else if (activeElifbaTab === 'heceleme') {
      tabBodyHtml = `
        <div class="akademi-card">
          <div class="card-headline">
            <div>
              <span class="card-badge gold">İNTERAKTİF HECE SENTEZİ</span>
              <h2 class="card-title">Kelime Heceleme &amp; Birleştirme Laboratuvarı</h2>
              <p class="card-desc">Heceleri sağdan sola sırayla seçerek kelimenin yazılı yapısını inceleyin.</p>
            </div>
          </div>

          <div class="heceleme-grid">
            ${HECELEME_EXAMPLES.map((item, wIdx) => `
              <div class="heceleme-card" data-word-idx="${wIdx}">
                <div class="heceleme-top">
                  <span class="card-badge gold">${item.latin}</span>
                  <span style="font-size:0.88rem; color:#f0f3fa; font-weight:700;">Anlamı: <em>${item.tr}</em></span>
                </div>
                
                <!-- Heceler (Sağdan Sola) -->
                <div class="hece-bubbles-row">
                  ${item.syllables.map((syl, sIdx) => `
                    <button type="button" class="hece-bubble" data-w="${wIdx}" data-s="${sIdx}" data-syl="${syl}" title="${sIdx + 1}. Heceye Dokun">
                      ${syl}
                    </button>
                  `).join('')}
                </div>

                <div style="text-align:center;">
                  <div style="font-family:'Amiri', serif; font-size:2.6rem; color:var(--accent-gold); margin:0.35rem 0;" class="word-target-glyph" lang="ar">${item.word}</div>
                  <div class="hece-feedback-text" style="font-size:0.82rem; color:#8a94a6;">Hecelere sağdan sola sırayla dokunarak birleştirin...</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SEKME 8: KULAK EĞİTİMİ (BENZER SESLİ HARFLER & ANLAM DEĞİŞİMİ ATÖLYESİ)
    // =========================================================================
    else if (activeElifbaTab === 'kulak') {
      const groupCounts = ELIFBA_EAR_PAIRS.reduce((acc, pair) => { acc[pair.group] = (acc[pair.group] || 0) + 1; return acc; }, {});
      const activeGroup = earSession ? earSession.group : 'all';
      tabBodyHtml = `
        <div class="akademi-card kt-card">
          <div class="card-headline">
            <div>
              <span class="card-badge gold">KULAK TESTİ · ${ELIFBA_EAR_PAIRS.length} KELİME ÇİFTİ</span>
              <h2 class="card-title">Dinle, hangi kelime?</h2>
              <p class="card-desc">Kur'an'dan bir kelime okunur. Yazılışı birbirine çok benzeyen iki kelimeden duyduğunuzu seçin. İki kelimeyi ayıran tek şey, birbirine yakın duyulan iki harftir; yanlış okunduğunda anlam değişir.</p>
            </div>
          </div>
          <div class="kt-filter" role="group" aria-label="Harf çiftine göre seç">
            <button type="button" class="kt-filter-btn ${activeGroup === 'all' ? 'active' : ''}" data-kt-group="all" aria-pressed="${activeGroup === 'all'}">Karışık</button>
            ${Object.entries(ELIFBA_EAR_GROUPS).map(([id, group]) => `
              <button type="button" class="kt-filter-btn ${activeGroup === id ? 'active' : ''}" data-kt-group="${id}" aria-pressed="${activeGroup === id}"><span lang="ar">${group.label}</span><small>${groupCounts[id] || 0}</small></button>
            `).join('')}
          </div>
          <div class="kt-stage" id="ktStage" aria-live="polite"></div>
        </div>
      `;
    }

    // Ana konteyneri render et (Full-width sub-nav + temiz tab-body)
    container.innerHTML = `
      <div class="elifba-module-container">
        ${subNavHtml}
        <div class="elifba-tab-body">
          ${tabBodyHtml}
        </div>
      </div>
    `;

    // =========================================================================
    // ETKİLEŞİM DİNLEYİCİLERİ
    // =========================================================================

    // Alt sekme geçişi
    container.querySelectorAll('.elifba-sub-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        activeElifbaTab = pill.getAttribute('data-tab') || 'harfler';
        renderElifbaView();
        updateExecutiveBarAndDrawer('elifba');
      });
    });

    // Gerçek kelime sesleri: tüm alt sekmelerde tek dinleyici (kapsayıcı yeniden çizilse de bir kez bağlanır).
    if (!container.dataset.wordAudioBound) {
      container.dataset.wordAudioBound = '1';
      container.addEventListener('click', (event) => {
        const button = event.target.closest('[data-word-key]');
        if (!button || !container.contains(button)) return;
        event.stopPropagation();
        playElifbaWord(button.getAttribute('data-word-key'), button);
      });
    }
    stopElifbaWord();

    // SEKME 1 DİNLEYİCİLERİ: Harf seçimi ve filtreler
    if (activeElifbaTab === 'harfler') {
      container.querySelectorAll('.btn-filter-chip, .btn-filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedLetterFilter = btn.getAttribute('data-filter') || 'all';
          renderElifbaView();
        });
      });

      container.querySelectorAll('.letter-card').forEach(card => {
        card.addEventListener('click', () => {
          selectedLetterIdx = parseInt(card.getAttribute('data-idx'), 10) || 0;
          renderElifbaView();
        });
      });

      container.querySelectorAll('.v5-zone-letter').forEach(button => {
        button.addEventListener('click', () => {
          const letter = button.getAttribute('data-letter') === 'ء' ? 'ا' : button.getAttribute('data-letter');
          const idx = ARABIC_LETTERS.findIndex(item => item.char === letter);
          if (idx < 0) return;
          selectedLetterIdx = idx;
          renderElifbaView();
          document.getElementById('letterDetailPanel')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
      });
    }

    // SEKME 3 DİNLEYİCİLERİ: Hareke seçimi
    if (activeElifbaTab === 'harekeler') {
      container.querySelectorAll('.btn-hareke-mode').forEach(btn => {
        btn.addEventListener('click', () => {
          activeHarekeType = btn.getAttribute('data-type') || 'ustun';
          renderElifbaView();
        });
      });
    }

    // SEKME 7 DİNLEYİCİLERİ: Heceleme Labı
    if (activeElifbaTab === 'heceleme') {
      const cardProgress = {};
      container.querySelectorAll('.hece-bubble').forEach(b => {
        b.addEventListener('click', () => {
          const wIdx = parseInt(b.getAttribute('data-w'), 10);
          const sIdx = parseInt(b.getAttribute('data-s'), 10);
          const syl = b.getAttribute('data-syl');

          b.classList.add('active');

          if (!cardProgress[wIdx]) cardProgress[wIdx] = new Set();
          cardProgress[wIdx].add(sIdx);

          const card = b.closest('.heceleme-card');
          const targetItem = HECELEME_EXAMPLES[wIdx];
          const feedback = card.querySelector('.hece-feedback-text');

          if (targetItem && cardProgress[wIdx].size === targetItem.syllables.length) {
            if (feedback) {
              feedback.innerHTML = `✅ <strong>Tamamlandı:</strong> "${targetItem.word}" (${targetItem.latin}) hecelerinin tümü seçildi.`;
              feedback.style.color = "var(--accent-green)";
            }
            if (window.showToast) window.showToast(`"${targetItem.word}" kelimesinin tüm heceleri seçildi.`);
          } else {
            if (feedback) {
              feedback.innerHTML = `Seçilen hece: <strong>${syl}</strong>. Kalan heceleri seçin.`;
              feedback.style.color = "var(--accent-gold)";
            }
          }
        });
      });
    }

    // SEKME 8 DİNLEYİCİLERİ: Kulak Testi (tek soru akışı)
    if (activeElifbaTab === 'kulak') {
      const stage = container.querySelector('#ktStage');

      const startRound = (group) => {
        const pool = ELIFBA_EAR_PAIRS.map((pair, idx) => ({ pair, idx })).filter(item => group === 'all' || item.pair.group === group);
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        const queue = pool.slice(0, EAR_ROUND_SIZE).map(item => ({
          pairIdx: item.idx,
          target: Math.floor(Math.random() * item.pair.words.length),
          order: Math.random() < 0.5 ? [0, 1] : [1, 0]
        }));
        earSession = { group, queue, step: 0, chosen: null, correct: 0, missed: [] };
      };

      const playTarget = (rate) => {
        const item = earSession.queue[earSession.step];
        if (!item) return;
        const word = ELIFBA_EAR_PAIRS[item.pairIdx].words[item.target];
        playElifbaWord(word.key, stage.querySelector(rate ? '[data-kt="slow"]' : '[data-kt="play"]'), rate);
      };

      const renderStage = (autoplay) => {
        if (!stage || !earSession) return;
        const total = earSession.queue.length;

        if (earSession.step >= total) {
          const pct = total ? Math.round((earSession.correct / total) * 100) : 0;
          stage.innerHTML = `
            <div class="kt-result">
              <div class="kt-result-score"><strong>${earSession.correct}</strong><span>/ ${total}</span></div>
              <p class="kt-result-text">${pct >= 80 ? 'Kulağınız bu harfleri iyi ayırıyor.' : (pct >= 50 ? 'İyi gidiyor. Karıştırdığınız çiftleri tekrar dinleyin.' : 'Bu harfler zor. Aşağıdaki kelimeleri art arda dinleyip farkı yakalamaya çalışın.')}</p>
              ${earSession.missed.length ? `
                <h4 class="kt-result-title">Karıştırılan kelimeler</h4>
                <ul class="kt-missed">
                  ${earSession.missed.map(pairIdx => {
                    const pair = ELIFBA_EAR_PAIRS[pairIdx];
                    return `<li class="kt-missed-row">${pair.words.map(word => `
                      <span class="kt-missed-word"><span lang="ar">${word.ar}</span><small>${word.tr}</small>${elifbaPlayButton(word.key, `${word.ar} kelimesini dinle`, 'is-compact')}</span>`).join('')}
                    </li>`;
                  }).join('')}
                </ul>` : ''}
              <button type="button" class="btn-akademi-primary kt-next" data-kt="restart">Yeni tur</button>
            </div>
          `;
          return;
        }

        const item = earSession.queue[earSession.step];
        const pair = ELIFBA_EAR_PAIRS[item.pairIdx];
        const group = ELIFBA_EAR_GROUPS[pair.group];
        const answered = earSession.chosen !== null;
        const isRight = answered && earSession.chosen === item.target;
        const heard = pair.words[item.target];

        stage.innerHTML = `
          <div class="kt-progress">
            <span>Soru ${earSession.step + 1} / ${total}</span>
            <span>${earSession.correct} doğru</span>
          </div>
          <div class="kt-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${earSession.step + (answered ? 1 : 0)}"><span style="width:${((earSession.step + (answered ? 1 : 0)) / total) * 100}%"></span></div>

          <div class="kt-listen">
            <button type="button" class="kt-play" data-kt="play" aria-pressed="false"><span class="v5-word-play-icon" aria-hidden="true"></span>Kelimeyi dinle</button>
            <button type="button" class="kt-slow" data-kt="slow" aria-pressed="false">Yavaş dinle</button>
          </div>

          <p class="kt-question"><strong lang="ar">${group.label}</strong> ${group.title} Duyduğunuz kelimeyi seçin.</p>

          <div class="kt-options">
            ${item.order.map(wordIdx => {
              const word = pair.words[wordIdx];
              const state = !answered ? '' : (wordIdx === item.target ? 'is-correct' : (wordIdx === earSession.chosen ? 'is-wrong' : 'is-dim'));
              return `
                <div class="kt-option ${state}">
                  <button type="button" class="kt-option-choice" data-kt-choice="${wordIdx}" ${answered ? 'disabled' : ''} aria-label="${word.ar}">
                    <span class="kt-option-ar" lang="ar">${word.ar}</span>
                    <span class="kt-option-letter">Harf: <span lang="ar">${word.letter}</span></span>
                  </button>
                  ${answered ? `
                    <div class="kt-option-info">
                      <span class="kt-option-tr">${word.tr}</span>
                      <span class="kt-option-ref">Âyet ${elifbaVerseLabel(word.key)}</span>
                      ${elifbaPlayButton(word.key, `${word.ar} kelimesini dinle`, 'is-compact')}
                    </div>` : ''}
                </div>
              `;
            }).join('')}
          </div>

          ${answered ? `
            <div class="kt-feedback ${isRight ? 'is-right' : 'is-wrong'}">
              <strong>${isRight ? 'Doğru.' : `Duyulan kelime: <span lang="ar">${heard.ar}</span> (${heard.tr}).`}</strong>
              <p>${group.tip}</p>
            </div>
            <button type="button" class="btn-akademi-primary kt-next" data-kt="next">${earSession.step + 1 < total ? 'Sonraki soru' : 'Sonucu gör'}</button>
          ` : ''}
        `;
        if (autoplay) playTarget();
      };

      if (!earSession || !earSession.queue.length) startRound(earSession ? earSession.group : 'all');
      renderStage(false);

      stage?.addEventListener('click', (event) => {
        const control = event.target.closest('[data-kt], [data-kt-choice]');
        if (!control) return;
        const action = control.getAttribute('data-kt');
        if (action === 'play') return playTarget();
        if (action === 'slow') return playTarget(0.7);
        if (action === 'next') {
          earSession.step += 1;
          earSession.chosen = null;
          stopElifbaWord();
          renderStage(true);
          return;
        }
        if (action === 'restart') {
          startRound(earSession.group);
          renderStage(true);
          return;
        }
        const choice = control.getAttribute('data-kt-choice');
        if (choice !== null && earSession.chosen === null) {
          const item = earSession.queue[earSession.step];
          earSession.chosen = parseInt(choice, 10);
          if (earSession.chosen === item.target) earSession.correct += 1;
          else earSession.missed.push(item.pairIdx);
          stopElifbaWord();
          renderStage(false);
        }
      });

      container.querySelectorAll('[data-kt-group]').forEach(button => {
        button.addEventListener('click', () => {
          startRound(button.getAttribute('data-kt-group') || 'all');
          renderElifbaView();
        });
      });
    }
  }

  // ===========================================================================
  // 5.3 TECVİD OKULU & YER DEĞİŞTİRİLEBİLİR (DRAGGABLE) MİNİ MUSHAF PENCERESİ
  // ===========================================================================
  const MINI_MUSHAF_TECVİD_DATA = {
    "izhar": {
      id: "izhar",
      surah: 112,
      ayah: 4,
      surahName: "İhlâs",
      surahArabic: "سُورَةُ الإِخْلَاصِ",
      juz: 30,
      page: 604,
      ruleName: "İzhâr (Nûn-ı Sâkin & Tenvin)",
      ruleFamily: "izhar",
      targetWord: "كُفُوًا أَحَدٌ",
      html: `وَلَمْ يَكُن لَّهُۥ <span class="tajweed-highlight-target"><span class="tj-izhar">كُفُوًا</span> <span class="tj-izhar">أَحَدٌۢ</span></span> <span class="flower-medallion">۝٤</span>`,
      ruleExplanation: "Tenvinden sonra 6 boğaz harfinden biri olan Hemze (أ) gelmiştir. Nûn sesi gunnesiz, duraksamadan net okunur.",
      meal: "Hiçbir şey O'na denk ve benzer değildir.",
      audioStart: 1.2,
      audioEnd: 3.8
    },
    "idgam-maalgunne": {
      id: "idgam-maalgunne",
      surah: 111,
      ayah: 1,
      surahName: "Tebbet (Mesed)",
      surahArabic: "سُورَةُ المَسَدِ",
      juz: 30,
      page: 605,
      ruleName: "İdğâm-ı Maalgunne",
      ruleFamily: "ihfa",
      targetWord: "لَهَبٍ وَتَبَّ",
      html: `تَبَّتْ يَدَآ أَبِى <span class="tajweed-highlight-target"><span class="tj-ihfa">لَهَبٍۢ</span> <span class="tj-ihfa">وَتَبَّ</span></span> <span class="flower-medallion">۝١</span>`,
      ruleExplanation: "Tenvinden sonra 'Yemnu' harflerinden Vâv (و) gelmiştir. Nûn sesi genizden 1.5 elif gunne ile tutularak kaynaştırılır.",
      meal: "Ebû Leheb'in iki eli kurusun; kurudu da!",
      audioStart: 1.8,
      audioEnd: 4.6
    },
    "idgam-bilagunne": {
      id: "idgam-bilagunne",
      surah: 2,
      ayah: 5,
      surahName: "Bakara",
      surahArabic: "سُورَةُ البَقَرَةِ",
      juz: 1,
      page: 2,
      ruleName: "İdğâm-ı Bilagunne",
      ruleFamily: "ihfa",
      targetWord: "مِنْ رَبِّهِمْ",
      html: `أُو۟لَٰٓئِكَ عَلَىٰ هُدًۭى <span class="tajweed-highlight-target"><span class="tj-ihfa">مِّن رَّبِّهِمْ</span></span> ۖ وَأُو۟لَٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ <span class="flower-medallion">۝٥</span>`,
      ruleExplanation: "Sâkin Nûn'dan sonra Râ (ر) harfi gelmiştir. Nûn sesi tamamen Râ'ya dönüştürülüp gunnesiz tam idğam yapılır.",
      meal: "İşte onlar, Rablerinden gelen bir hidayet üzeredirler...",
      audioStart: 1.8,
      audioEnd: 5.6
    },
    "iklab": {
      id: "iklab",
      surah: 2,
      ayah: 18,
      surahName: "Bakara",
      surahArabic: "سُورَةُ البَقَرَةِ",
      juz: 1,
      page: 3,
      ruleName: "İklâb",
      ruleFamily: "iklab",
      targetWord: "صُمٌّ بُكْمٌ",
      html: `<span class="tajweed-highlight-target"><span class="tj-iklab">صُمٌّۢ</span> <span class="tj-iklab">بُكْمٌ</span></span> عُمْىٌۭ فَهُمْ لَا يَرْجِعُونَ <span class="flower-medallion">۝١٨</span>`,
      ruleExplanation: "Tenvinden sonra Bâ (ب) harfi geldiği için tenvinin nûnu dudaklar hafifçe kapatılarak 1.5 elif gunneli Mîm'e çevrilir.",
      meal: "Onlar sağırdırlar, dilsizdirler, kördürler; artık geri dönemezler.",
      audioStart: 0.0,
      audioEnd: 3.6
    },
    "ihfa": {
      id: "ihfa",
      surah: 2,
      ayah: 4,
      surahName: "Bakara",
      surahArabic: "سُورَةُ البَقَرَةِ",
      juz: 1,
      page: 2,
      ruleName: "İhfâ",
      ruleFamily: "ihfa",
      targetWord: "مِنْ قَبْلِكَ",
      html: `وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ <span class="tajweed-highlight-target"><span class="tj-ihfa">مِن قَبْلِكَ</span></span> وَبِٱلْـَٔاخِرَةِ هُمْ يُوقِنُونَ <span class="flower-medallion">۝٤</span>`,
      ruleExplanation: "Sâkin Nûn'dan sonra 15 ihfâ harfinden Kaaf (ق) gelmiştir. Dil üst damağa basılmadan ses genizde 1.5 elif gizlenir.",
      meal: "Sana indirilene ve senden önce indirilenlere iman ederler...",
      audioStart: 5.4,
      audioEnd: 9.3
    },
    "dudak-ihfasi": {
      id: "dudak-ihfasi",
      surah: 105,
      ayah: 4,
      surahName: "Fîl",
      surahArabic: "سُورَةُ الفِيلِ",
      juz: 30,
      page: 601,
      ruleName: "Dudak İhfâsı (İhfâ-i Şefevî)",
      ruleFamily: "ihfa",
      targetWord: "تَرْمِيهِمْ بِحِجَارَةٍ",
      html: `<span class="tajweed-highlight-target"><span class="tj-ihfa">تَرْمِيهِم بِحِجَارَةٍۢ</span></span> مِّن سِجِّيلٍۢ <span class="flower-medallion">۝٤</span>`,
      ruleExplanation: "Sâkin Mîm'den sonra Bâ (ب) harfi gelmiştir. Dudaklar hafif temasla 1.5 elif gunne ile gizlenir.",
      meal: "Onların üzerine pişirilmiş çamurdan taşlar atıyorlardı.",
      audioStart: 0.0,
      audioEnd: 3.2
    },
    "idgam-misleyn-mim": {
      id: "idgam-misleyn-mim",
      surah: 50,
      ayah: 35,
      surahName: "Kâf",
      surahArabic: "سُورَةُ ق",
      juz: 26,
      page: 519,
      ruleName: "İdğâm-ı Misl-i Maalgunne (Sâkin Mîm)",
      ruleFamily: "ihfa",
      targetWord: "لَهُمْ مَا يَشَاءُونَ",
      html: `<span class="tajweed-highlight-target"><span class="tj-ihfa">لَهُم مَّا يَشَآءُونَ</span></span> فِيهَا وَلَدَيْنَا مَزِيدٌ <span class="flower-medallion">۝٣٥</span>`,
      ruleExplanation: "Sâkin Mîm'den sonra harekeli Mîm gelmiştir. İki mîm birbirine katılarak 1.5 elif gunne tutulur.",
      meal: "Orada kendileri için diledikleri her şey vardır; katımızda fazlası da mevcuttur.",
      audioStart: 0.0,
      audioEnd: 3.6
    },
    "mim-izhari": {
      id: "mim-izhari",
      surah: 1,
      ayah: 7,
      surahName: "Fâtiha",
      surahArabic: "سُورَةُ الفَاتِحَةِ",
      juz: 1,
      page: 1,
      ruleName: "Mîm'in İzhârı (İzhâr-ı Şefevî)",
      ruleFamily: "izhar",
      targetWord: "عَلَيْهِمْ وَلَا",
      html: `صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ <span class="tajweed-highlight-target"><span class="tj-izhar">عَلَيْهِمْ وَلَا</span></span> ٱلضَّآلِّينَ <span class="flower-medallion">۝٧</span>`,
      ruleExplanation: "Sâkin Mîm'den sonra Vâv harfi gelmiştir. Mîm sesi net ve gunnesiz okunur.",
      meal: "Gazaba uğramışların ve sapmışların yoluna değil!",
      audioStart: 5.0,
      audioEnd: 9.5
    },
    "medd-i-tabii": {
      id: "medd-i-tabii",
      surah: 2,
      ayah: 11,
      surahName: "Bakara",
      surahArabic: "سُورَةُ البَقَرَةِ",
      juz: 1,
      page: 3,
      ruleName: "Medd-i Tabiî (Aslî Med)",
      ruleFamily: "madd",
      targetWord: "قَالُوا",
      html: `وَإِذَا قِيلَ لَهُمْ لَا تُفْسِدُوا۟ فِى ٱلْأَرْضِ <span class="tajweed-highlight-target"><span class="tj-madd">قَالُوٓا۟</span></span> إِنَّمَا نَحْنُ مُصْلِحُونَ <span class="flower-medallion">۝١١</span>`,
      ruleExplanation: "Med harfinden sonra sebeb-i med yoktur. 1 elif miktarı tabii uzatılır.",
      meal: "Onlar: 'Biz ancak ıslah edicileriz' derler.",
      audioStart: 5.8,
      audioEnd: 10.4
    },
    "medd-i-muttasil": {
      id: "medd-i-muttasil",
      surah: 110,
      ayah: 1,
      surahName: "Nasr",
      surahArabic: "سُورَةُ النَّصْرِ",
      juz: 30,
      page: 603,
      ruleName: "Medd-i Muttasıl",
      ruleFamily: "madd",
      targetWord: "إِذَا جَاءَ",
      html: `إِذَا <span class="tajweed-highlight-target"><span class="tj-madd">جَآءَ</span></span> نَصْرُ ٱللَّهِ وَٱلْفَتْحُ <span class="flower-medallion">۝١</span>`,
      ruleExplanation: "Med harfi ile hemze aynı kelimede bitişiktir; sesi 4 elif uzatmak vaciptir.",
      meal: "Allah'ın yardımı ve fetih geldiği zaman...",
      audioStart: 0.0,
      audioEnd: 3.6
    },
    "medd-i-munfasil": {
      id: "medd-i-munfasil",
      surah: 108,
      ayah: 1,
      surahName: "Kevser",
      surahArabic: "سُورَةُ الكَوْثَرِ",
      juz: 30,
      page: 602,
      ruleName: "Medd-i Munfasıl",
      ruleFamily: "madd",
      targetWord: "إِنَّا أَعْطَيْنَاكَ",
      html: `<span class="tajweed-highlight-target"><span class="tj-madd">إِنَّآ أَعْطَيْنَٰكَ</span></span> ٱلْكَوْثَرَ <span class="flower-medallion">۝١</span>`,
      ruleExplanation: "Med harfi kelime sonunda, hemze takip eden kelimenin başındadır; 4 elif uzatılır.",
      meal: "Şüphesiz biz sana Kevser'i verdik.",
      audioStart: 0.0,
      audioEnd: 3.5
    },
    "medd-i-lazim": {
      id: "medd-i-lazim",
      surah: 1,
      ayah: 7,
      surahName: "Fâtiha",
      surahArabic: "سُورَةُ الفَاتِحَةِ",
      juz: 1,
      page: 1,
      ruleName: "Medd-i Lâzım",
      ruleFamily: "madd",
      targetWord: "وَلَا الضَّالِّينَ",
      html: `غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ <span class="tajweed-highlight-target"><span class="tj-madd">وَلَا ٱلضَّآلِّينَ</span></span> <span class="flower-medallion">۝٧</span>`,
      ruleExplanation: "Med harfinden sonra şeddeli harf (sükûn-ı lâzım) gelmiştir; 4-6 elif vacip uzatılır.",
      meal: "...ve sapmışların yoluna değil!",
      audioStart: 7.0,
      audioEnd: 13.0
    },
    "medd-i-ariz": {
      id: "medd-i-ariz",
      surah: 1,
      ayah: 1,
      surahName: "Fâtiha",
      surahArabic: "سُورَةُ الفَاتِحَةِ",
      juz: 1,
      page: 1,
      ruleName: "Medd-i Ârız",
      ruleFamily: "madd",
      targetWord: "الرَّحِيمِ",
      html: `بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ <span class="tajweed-highlight-target"><span class="tj-madd">ٱلرَّحِيمِ</span></span> <span class="flower-medallion">۝١</span>`,
      ruleExplanation: "Âyet sonunda durulduğunda sükûn-ı ârız oluşur; 2 ila 4 elif uzatılabilir.",
      meal: "Rahmân ve Rahîm olan Allah'ın adıyla.",
      audioStart: 2.2,
      audioEnd: 5.6
    },
    "medd-i-lin": {
      id: "medd-i-lin",
      surah: 106,
      ayah: 1,
      surahName: "Kureyş",
      surahArabic: "سُورَةُ قُرَيْشٍ",
      juz: 30,
      page: 602,
      ruleName: "Medd-i Lîn",
      ruleFamily: "madd",
      targetWord: "قُرَيْشٍ",
      html: `لِإِيلَٰفِ <span class="tajweed-highlight-target"><span class="tj-madd">قُرَيْشٍ</span></span> <span class="flower-medallion">۝١</span>`,
      ruleExplanation: "Lîn harfinden (cezimli Yâ) sonra vakıf hali; yumuşakça 2 ila 4 elif uzatılır.",
      meal: "Kureyş'in güven ve uzlaşması için...",
      audioStart: 0.0,
      audioEnd: 3.6
    },
    "kalkale": {
      id: "kalkale",
      surah: 112,
      ayah: 1,
      surahName: "İhlâs",
      surahArabic: "سُورَةُ الإِخْلَاصِ",
      juz: 30,
      page: 604,
      ruleName: "Kalkale (Harfi Titretmek)",
      ruleFamily: "kalkale",
      targetWord: "قُلْ هُوَ اللَّهُ أَحَدٌ",
      html: `قُلْ هُوَ ٱللَّهُ <span class="tajweed-highlight-target"><span class="tj-kalkale">أَحَدٌ</span></span> <span class="flower-medallion">۝١</span>`,
      ruleExplanation: "Dâl harfi cezimli durulduğunda mahrece kuvvetle çarpılıp ses yankılandırılır.",
      meal: "De ki: O Allah tektir.",
      audioStart: 0.0,
      audioEnd: 3.4
    },
    "hukmur-ra": {
      id: "hukmur-ra",
      surah: 1,
      ayah: 2,
      surahName: "Fâtiha",
      surahArabic: "سُورَةُ الفَاتِحَةِ",
      juz: 1,
      page: 1,
      ruleName: "Hükmü’r-Râ (Kalın Râ)",
      ruleFamily: "madd",
      targetWord: "رَبِّ الْعَالَمِينَ",
      html: `ٱلْحَمْدُ لِلَّهِ <span class="tajweed-highlight-target"><span class="tj-ra">رَبِّ</span></span> ٱلْعَٰلَمِينَ <span class="flower-medallion">۝٢</span>`,
      ruleExplanation: "Râ harfi üstünlü olduğunda ağız içi dolgun ve kalın (tefhim) okunur.",
      meal: "Hamd, âlemlerin Rabbi olan Allah'a mahsustur.",
      audioStart: 0.0,
      audioEnd: 4.2
    },
    "lam-i-tarif": {
      id: "lam-i-tarif",
      surah: 91,
      ayah: 1,
      surahName: "Şems",
      surahArabic: "سُورَةُ الشَّمْسِ",
      juz: 30,
      page: 595,
      ruleName: "Lâm-ı Ta’rif (İdğâm-ı Şemsiyye)",
      ruleFamily: "ihfa",
      targetWord: "وَالشَّمْسِ وَضُحَاهَا",
      html: `<span class="tajweed-highlight-target"><span class="tj-ihfa">وَٱلشَّمْسِ</span></span> وَضُحَىٰهَا <span class="flower-medallion">۝١</span>`,
      ruleExplanation: "El takısından sonra şemsî harf (Şîn) gelmiştir; Lâm okunmaz, Şîn şeddelenir.",
      meal: "Güneşe ve onun aydınlığına andolsun.",
      audioStart: 0.0,
      audioEnd: 3.8
    },
    "zamir": {
      id: "zamir",
      surah: 110,
      ayah: 3,
      surahName: "Nasr",
      surahArabic: "سُورَةُ النَّصْرِ",
      juz: 30,
      page: 603,
      ruleName: "Zamir (Hû Zamiri)",
      ruleFamily: "madd",
      targetWord: "إِنَّهُ كَانَ تَوَّابًا",
      html: `فَسَبِّحْ بِحَمْدِ رَبِّكَ وَٱسْتَغْفِرْهُ ۚ <span class="tajweed-highlight-target"><span class="tj-madd">إِنَّهُۥ</span></span> كَانَ تَوَّابًۢا <span class="flower-medallion">۝٣</span>`,
      ruleExplanation: "Öncesi harekeli olduğu için Hû zamiri 1 elif uzatılır.",
      meal: "Rabbini hamd ile tesbih et; şüphesiz O, tevbeleri kabul edendir.",
      audioStart: 4.2,
      audioEnd: 8.6
    },
    "vakif-isaretleri": {
      id: "vakif-isaretleri",
      surah: 2,
      ayah: 2,
      surahName: "Bakara",
      surahArabic: "سُورَةُ البَقَرَةِ",
      juz: 1,
      page: 2,
      ruleName: "Vakıf (Muânaka) İşaretleri",
      ruleFamily: "vakif",
      targetWord: "لَا رَيْبَ ۛ فِيهِ ۛ",
      html: `ذَٰلِكَ ٱلْكِتَٰبُ <span class="tajweed-highlight-target"><span class="tj-vakif">لَا رَيْبَ ۛ</span> <span class="tj-vakif">فِيهِ ۛ</span></span> هُدًۭى لِّلْمُتَّقِينَ <span class="flower-medallion">۝٢</span>`,
      ruleExplanation: "Muânaka vakfı: Üçer noktalı işaretlerin birincisinde durulursa ikincisinde geçilir.",
      meal: "Bu, kendisinde şüphe olmayan kitaptır; muttakiler için yol göstericidir.",
      audioStart: 1.6,
      audioEnd: 5.4
    }
  };

  let activeMiniMushafRule = MINI_MUSHAF_TECVİD_DATA["izhar"];
  let isMiniMushafPlaying = false;
  let isMiniMushafInitialized = false;

  // Mini Mushaf DOM Montajı ve Sürükleme (Drag & Drop) Olayları
  let miniMushafFontSize = 1.6;
  let miniMushafLatinFontSize = 0.88;
  try {
    const sAr = parseFloat(localStorage.getItem('tilavet_mini_mushaf_font_size'));
    if (!isNaN(sAr) && sAr >= 1.0 && sAr <= 3.0) miniMushafFontSize = sAr;
    const sLat = parseFloat(localStorage.getItem('tilavet_mini_mushaf_latin_size'));
    if (!isNaN(sLat) && sLat >= 0.7 && sLat <= 1.8) miniMushafLatinFontSize = sLat;
  } catch (_) {}
  let isMiniMushafTajweedEnabled = true;
  let miniMushafChainedAudio = null;
  let currentMiniMushafChainItem = null;

  function stopMiniMushafAudio() {
    if (miniMushafChainedAudio) {
      try {
        miniMushafChainedAudio.pause();
        miniMushafChainedAudio.currentTime = 0;
        miniMushafChainedAudio.src = '';
      } catch (_) {}
      miniMushafChainedAudio = null;
    }
    currentMiniMushafChainItem = null;
    setMiniMushafPlayState(false);
  }

  function initMiniMushafWidget() {
    if (document.getElementById('miniMushafWidget')) return;

    const widget = document.createElement('div');
    widget.id = 'miniMushafWidget';
    widget.className = 'mini-mushaf-widget';

    widget.innerHTML = `
      <div class="mini-mushaf-drag-header" id="miniMushafHeader" title="Başlıktan tutarak ekranın istediğiniz yerine serbestçe taşıyabilirsiniz">
        <div class="mini-mushaf-title-group">
          <div class="mini-mushaf-title-wrap">
            <div class="mini-mushaf-title" id="miniMushafHeaderTitle">Kayan Mushaf &amp; Tecvid</div>
            <div class="mini-mushaf-sub" id="miniMushafSubtitle">Canlı Takip Ekranı</div>
          </div>
        </div>
        <div class="mini-mushaf-controls">
          <button type="button" class="mini-mushaf-btn" id="btnMiniMushafTajweedToggle" title="Tecvid renklerini aç / kapat" aria-label="Tecvid renklerini aç / kapat"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 3a9 9 0 0 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A4.6 4.6 0 0 0 22 9.8C22 5.9 17.5 3 12 3zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg></button>
          <button type="button" class="mini-mushaf-btn" id="btnMiniMushafFontDec" title="Yazıyı Küçült (A-)">A−</button>
          <button type="button" class="mini-mushaf-btn" id="btnMiniMushafFontInc" title="Yazıyı Büyüt (A+)">A+</button>
          <button type="button" class="mini-mushaf-btn" id="btnMiniMushafExpand" title="Pencereyi Tam Genişlet / Varsayılan Boyuta Dön (⛶)">⛶</button>
          <button type="button" class="mini-mushaf-btn" id="btnMiniMushafReset" title="Varsayılan Boyut ve Sağ Üst Konuma Sıfırla (↺)">↺</button>
          <button type="button" class="mini-mushaf-btn btn-close" id="btnMiniMushafClose" title="Kapat">×</button>
        </div>
      </div>
      
      <div class="mini-mushaf-body" id="miniMushafBody">
        <div class="mini-mushaf-page-frame">
          <div class="mini-mushaf-unwan-cartouche">
            <span class="mini-mushaf-meta-badge" id="miniMushafJuzBadge">30. CÜZ</span>
            <div class="mini-mushaf-cartouche-inner" id="miniMushafSurahTitle">سُورَةُ الإِخْلَاصِ</div>
            <span class="mini-mushaf-meta-badge" id="miniMushafPageBadge">S. 604</span>
          </div>

          <div class="mini-mushaf-bismillah" id="miniMushafBismillah">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>

          <div class="mini-mushaf-arabic-container" id="miniMushafArabicContent" lang="ar" dir="rtl">
            <!-- Tecvid renkli Arapça metin -->
          </div>

          <div class="mini-mushaf-meal-box" id="miniMushafMealBox">
            <div class="mini-mushaf-latin-bar">
              <div class="mini-mushaf-rule-tag" id="miniMushafRuleTag">
                <span id="miniMushafRuleTitle">İzhâr (Nûn-ı Sâkin &amp; Tenvin)</span>
              </div>
              <div class="mini-mushaf-latin-actions">
                <span class="mini-latin-label">Meâl:</span>
                <button type="button" class="mini-latin-btn" id="btnMiniLatinDec" title="Yazıyı küçült">A−</button>
                <button type="button" class="mini-latin-btn" id="btnMiniLatinInc" title="Yazıyı büyüt">A+</button>
              </div>
            </div>
            <div class="mini-mushaf-latin-content" id="miniMushafLatinContent">
              <div class="mini-mushaf-rule-desc" id="miniMushafRuleDesc">
                <!-- İcra ve tecvid kural açıklaması -->
              </div>
              <div class="mini-mushaf-meal-text" id="miniMushafMealText">
                "Hiçbir şey O'na denk ve benzer değildir."
              </div>
            </div>
          </div>

          <div class="mini-mushaf-legend">
            <span class="legend-dot dot-madd" data-rule="tj-madd" title="Medd-i Muttasıl, Munfasıl ve Lâzım">Medd</span>
            <span class="legend-dot dot-ihfa" data-rule="tj-ihfa" title="İhfâ: 1.5 - 2 Elif">İhfâ</span>
            <span class="legend-dot dot-kalkale" data-rule="tj-kalkale" title="Kalkale: Kutbu Cedin">Kalkale</span>
            <span class="legend-dot dot-iklab" data-rule="tj-iklab" title="İklâb: B Harfine Dönüşüm">İklâb</span>
            <span class="legend-dot" data-rule="tj-idgam" style="color:#26a69a;" title="Gunneli İdgam">İdgam</span>
            <span class="legend-dot" data-rule="tj-kalin" style="color:#ffb300;" title="Kalın Harfler ve Ra">Kalın/Ra</span>
          </div>

          <div class="mini-mushaf-audio-bar">
            <button type="button" class="mini-audio-play-btn" id="btnMiniMushafPlay" title="Yalnız kuralın geçtiği kelimeleri dinleyin">
              <span id="miniPlayIcon">▶</span>
              <span id="miniPlayText">Örneği Dinle</span>
            </button>
            <button type="button" class="mini-audio-full-btn" id="btnMiniMushafPlayFullAyah" title="Âyetin tamamını dinleyin">Tüm âyet</button>
            <div class="mini-audio-status" id="miniAudioStatus">Hazır</div>
            <button type="button" class="mini-action-btn" id="btnMiniMushafFullView" title="15 satırlık tam sayfa Mushaf'a git">Mushaf'ta aç</button>
          </div>
        </div>
      </div>
      <div class="mini-mushaf-resizer" id="miniMushafResizer" title="Pencereyi serbestçe boyutlandırmak için köşeden sürükleyin">⋱</div>
    `;

    document.body.appendChild(widget);

    // Küçültüldüğünde açılan yüzen hap (pill)
    const pill = document.createElement('div');
    pill.id = 'miniMushafPill';
    pill.className = 'mini-mushaf-floating-pill';
    pill.style.display = 'none';
    pill.innerHTML = `<span></span> <span id="miniMushafPillLabel">Mushaf Takipçisi</span>`;
    document.body.appendChild(pill);

    // Kayıtlı konumu ve boyutu geri yükle
    try {
      const savedPos = JSON.parse(localStorage.getItem('tilavet_mini_mushaf_pos'));
      if (savedPos && typeof savedPos.left === 'number' && typeof savedPos.top === 'number') {
        const maxL = window.innerWidth - 320;
        const maxT = window.innerHeight - 250;
        widget.style.setProperty('left', `${Math.max(10, Math.min(maxL, savedPos.left))}px`, window.innerWidth >= 768 ? 'important' : '');
        widget.style.setProperty('top', `${Math.max(10, Math.min(maxT, savedPos.top))}px`, window.innerWidth >= 768 ? 'important' : '');
        widget.style.setProperty('right', 'auto', window.innerWidth >= 768 ? 'important' : '');
        widget.style.setProperty('bottom', 'auto', window.innerWidth >= 768 ? 'important' : '');
      }
      const savedSize = JSON.parse(localStorage.getItem('tilavet_mini_mushaf_size'));
      if (savedSize && typeof savedSize.width === 'number' && typeof savedSize.height === 'number') {
        const maxW = Math.min(window.innerWidth - 20, 1100);
        const maxH = Math.min(window.innerHeight - 20, 950);
        widget.style.width = `${Math.max(320, Math.min(maxW, savedSize.width))}px`;
        widget.style.height = `${Math.max(340, Math.min(maxH, savedSize.height))}px`;
      }
    } catch (_) {}

    // 1. Sürükleme Mantığı (Mouse & Dokunmatik Ekran)
    const header = document.getElementById('miniMushafHeader');
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialX = 0;
    let initialY = 0;

    function startDrag(clientX, clientY) {
      isDragging = true;
      dragStartX = clientX;
      dragStartY = clientY;
      const rect = widget.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      widget.classList.add('is-dragging');
    }

    function doDrag(clientX, clientY) {
      if (!isDragging) return;
      const dx = clientX - dragStartX;
      const dy = clientY - dragStartY;

      let newLeft = initialX + dx;
      let newTop = initialY + dy;

      const maxLeft = window.innerWidth - widget.offsetWidth - 10;
      const maxTop = window.innerHeight - widget.offsetHeight - 10;

      newLeft = Math.max(10, Math.min(maxLeft, newLeft));
      newTop = Math.max(10, Math.min(maxTop, newTop));

      widget.style.setProperty('left', `${newLeft}px`, window.innerWidth >= 768 ? 'important' : '');
      widget.style.setProperty('top', `${newTop}px`, window.innerWidth >= 768 ? 'important' : '');
      widget.style.setProperty('right', 'auto', window.innerWidth >= 768 ? 'important' : '');
      widget.style.setProperty('bottom', 'auto', window.innerWidth >= 768 ? 'important' : '');
    }

    function stopDrag() {
      if (isDragging) {
        isDragging = false;
        widget.classList.remove('is-dragging');
        const rect = widget.getBoundingClientRect();
        try {
          localStorage.setItem('tilavet_mini_mushaf_pos', JSON.stringify({ left: rect.left, top: rect.top }));
        } catch (_) {}
      }
    }

    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      startDrag(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) doDrag(e.clientX, e.clientY);
      if (isResizing) doResize(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => {
      stopDrag();
      stopResize();
    });

    // Dokunmatik desteği
    header.addEventListener('touchstart', (e) => {
      if (e.target.closest('button')) return;
      const t = e.touches[0];
      if (t) startDrag(t.clientX, t.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches[0]) doDrag(e.touches[0].clientX, e.touches[0].clientY);
      if (isResizing && e.touches[0]) doResize(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      stopDrag();
      stopResize();
    });

    // 1.5 Köşe Boyutlandırma Mantığı (Mouse & Dokunmatik Ekran)
    const resizer = document.getElementById('miniMushafResizer');
    let isResizing = false;
    let resizeStartX = 0;
    let resizeStartY = 0;
    let initialW = 0;
    let initialH = 0;

    function startResize(clientX, clientY) {
      isResizing = true;
      resizeStartX = clientX;
      resizeStartY = clientY;
      const rect = widget.getBoundingClientRect();
      initialW = rect.width;
      initialH = rect.height;
      widget.classList.add('is-resizing');
    }

    function doResize(clientX, clientY) {
      if (!isResizing) return;
      const dw = clientX - resizeStartX;
      const dh = clientY - resizeStartY;
      const maxW = Math.min(window.innerWidth - 20, 1200);
      const maxH = Math.min(window.innerHeight - 20, 1000);
      const newW = Math.max(320, Math.min(maxW, initialW + dw));
      const newH = Math.max(340, Math.min(maxH, initialH + dh));
      widget.style.width = `${newW}px`;
      widget.style.height = `${newH}px`;
    }

    function stopResize() {
      if (isResizing) {
        isResizing = false;
        widget.classList.remove('is-resizing');
        try {
          const rect = widget.getBoundingClientRect();
          localStorage.setItem('tilavet_mini_mushaf_size', JSON.stringify({ width: Math.round(rect.width), height: Math.round(rect.height) }));
        } catch (_) {}
      }
    }

    if (resizer) {
      resizer.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        startResize(e.clientX, e.clientY);
      });
      resizer.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        const t = e.touches[0];
        if (t) startResize(t.clientX, t.clientY);
      }, { passive: false });
    }

    // ResizeObserver ile yerel CSS resize'ı da yakalayıp kaydet
    if (typeof window.ResizeObserver !== 'undefined') {
      let roTimer = null;
      try {
        const ro = new ResizeObserver(entries => {
          for (const entry of entries) {
            if (!isResizing && !widget.classList.contains('is-maximized')) {
              const { width, height } = entry.contentRect;
              if (width > 200 && height > 200) {
                clearTimeout(roTimer);
                roTimer = setTimeout(() => {
                  try {
                    const rect = widget.getBoundingClientRect();
                    localStorage.setItem('tilavet_mini_mushaf_size', JSON.stringify({ width: Math.round(rect.width), height: Math.round(rect.height) }));
                  } catch (_) {}
                }, 250);
              }
            }
          }
        });
        ro.observe(widget);
      } catch (_) {}
    }

    // 2. Pencere Butonları Dinleyicileri
    document.getElementById('btnMiniMushafClose')?.addEventListener('click', () => {
      stopMiniMushafAudio();
      widget.style.display = 'none';
      pill.style.display = 'none';
      const toggleBtn = document.getElementById('btnToggleMiniMushaf');
      if (toggleBtn) toggleBtn.innerHTML = `<span></span> <strong>Küçük Mushaf</strong> <span style="font-size:0.75rem; color:#94a3b8;">(Kapalı)</span>`;
      const btnTeknikToggleLabel = document.getElementById('btnToggleFloatingMushafLabel');
      if (btnTeknikToggleLabel) btnTeknikToggleLabel.textContent = "Kayan Mushaf'ı Aç";
    });

    document.getElementById('btnMiniMushafMin')?.addEventListener('click', () => {
      const body = document.getElementById('miniMushafBody');
      const minBtn = document.getElementById('btnMiniMushafMin');
      if (body) {
        if (body.style.display === 'none') {
          body.style.display = 'block';
          if (minBtn) minBtn.textContent = '−';
        } else {
          body.style.display = 'none';
          if (minBtn) minBtn.textContent = '+';
        }
      }
    });

    // 2.2 Tam Genişletme (Maximize / Restore) Butonu
    let isMaximized = false;
    let savedBeforeMaxW = '';
    let savedBeforeMaxH = '';
    const expandBtn = document.getElementById('btnMiniMushafExpand');
    expandBtn?.addEventListener('click', () => {
      isMaximized = !isMaximized;
      if (isMaximized) {
        savedBeforeMaxW = widget.style.width;
        savedBeforeMaxH = widget.style.height;
        widget.classList.add('is-maximized');
        expandBtn.textContent = '';
        expandBtn.title = 'Önceki Boyuta Dön';
        if (window.showToast) window.showToast('⛶ Kayan Mushaf tam boyuta genişletildi.');
      } else {
        widget.classList.remove('is-maximized');
        widget.style.width = savedBeforeMaxW || '440px';
        widget.style.height = savedBeforeMaxH || 'auto';
        expandBtn.textContent = '⛶';
        expandBtn.title = 'Pencereyi Tam Genişlet / Büyüt (⛶)';
      }
    });

    document.getElementById('btnMiniMushafReset')?.addEventListener('click', () => {
      widget.style.setProperty('left', 'auto', window.innerWidth >= 768 ? 'important' : '');
      widget.style.setProperty('right', '28px', window.innerWidth >= 768 ? 'important' : '');
      widget.style.setProperty('top', '110px', window.innerWidth >= 768 ? 'important' : '');
      widget.style.setProperty('bottom', 'auto', window.innerWidth >= 768 ? 'important' : '');
      widget.style.width = '440px';
      widget.style.height = 'auto';
      widget.classList.remove('is-maximized');
      if (expandBtn) {
        expandBtn.textContent = '⛶';
        expandBtn.title = 'Pencereyi Tam Genişlet / Büyüt (⛶)';
      }
      isMaximized = false;
      miniMushafFontSize = 1.6;
      miniMushafLatinFontSize = 0.88;
      applyMiniMushafFontSizes();
      try {
        localStorage.removeItem('tilavet_mini_mushaf_pos');
        localStorage.removeItem('tilavet_mini_mushaf_size');
        localStorage.removeItem('tilavet_mini_mushaf_font_size');
        localStorage.removeItem('tilavet_mini_mushaf_latin_size');
      } catch (_) {}
      if (window.showToast) window.showToast("Mini Mushaf penceresi ve boyutları varsayılana sıfırlandı.");
    });

    pill.addEventListener('click', () => {
      pill.style.display = 'none';
      widget.style.display = 'flex';
      const body = document.getElementById('miniMushafBody');
      if (body) body.style.display = 'block';
      const toggleBtn = document.getElementById('btnToggleMiniMushaf');
      if (toggleBtn) toggleBtn.innerHTML = `<span></span> <strong>Küçük Mushaf</strong> <span style="font-size:0.75rem; color:var(--accent-gold);">(Açık)</span>`;
      const btnTeknikToggleLabel = document.getElementById('btnToggleFloatingMushafLabel');
      if (btnTeknikToggleLabel) btnTeknikToggleLabel.textContent = "Kayan Mushaf'ı Kapat";
    });

    // 3. Yazı Boyutu (A- / A+) Kontrolleri (Arapça & Latin Birlikte ve Ayrı Ayrı)
    function applyMiniMushafFontSizes() {
      const cont = document.getElementById('miniMushafArabicContent');
      if (cont) cont.style.fontSize = `${miniMushafFontSize}rem`;
      const mealBox = document.getElementById('miniMushafMealBox');
      if (mealBox) {
        mealBox.style.setProperty('--mini-latin-size', `${miniMushafLatinFontSize}rem`);
      }
    }

    document.getElementById('btnMiniMushafFontInc')?.addEventListener('click', () => {
      miniMushafFontSize = Math.min(2.8, +(miniMushafFontSize + 0.15).toFixed(2));
      miniMushafLatinFontSize = Math.min(1.5, +(miniMushafLatinFontSize + 0.08).toFixed(2));
      applyMiniMushafFontSizes();
      try {
        localStorage.setItem('tilavet_mini_mushaf_font_size', miniMushafFontSize.toString());
        localStorage.setItem('tilavet_mini_mushaf_latin_size', miniMushafLatinFontSize.toString());
      } catch (_) {}
    });

    document.getElementById('btnMiniMushafFontDec')?.addEventListener('click', () => {
      miniMushafFontSize = Math.max(1.1, +(miniMushafFontSize - 0.15).toFixed(2));
      miniMushafLatinFontSize = Math.max(0.72, +(miniMushafLatinFontSize - 0.08).toFixed(2));
      applyMiniMushafFontSizes();
      try {
        localStorage.setItem('tilavet_mini_mushaf_font_size', miniMushafFontSize.toString());
        localStorage.setItem('tilavet_mini_mushaf_latin_size', miniMushafLatinFontSize.toString());
      } catch (_) {}
    });

    // Latin Toolbar özel butonları
    document.getElementById('btnMiniLatinInc')?.addEventListener('click', () => {
      miniMushafLatinFontSize = Math.min(1.6, +(miniMushafLatinFontSize + 0.1).toFixed(2));
      applyMiniMushafFontSizes();
      try {
        localStorage.setItem('tilavet_mini_mushaf_latin_size', miniMushafLatinFontSize.toString());
      } catch (_) {}
      if (window.showToast) window.showToast(` Latin meâl yazı boyutu: ${miniMushafLatinFontSize}rem`);
    });

    document.getElementById('btnMiniLatinDec')?.addEventListener('click', () => {
      miniMushafLatinFontSize = Math.max(0.7, +(miniMushafLatinFontSize - 0.1).toFixed(2));
      applyMiniMushafFontSizes();
      try {
        localStorage.setItem('tilavet_mini_mushaf_latin_size', miniMushafLatinFontSize.toString());
      } catch (_) {}
      if (window.showToast) window.showToast(` Latin meâl yazı boyutu: ${miniMushafLatinFontSize}rem`);
    });

    document.getElementById('btnMiniLatinExpand')?.addEventListener('click', () => {
      const mealBox = document.getElementById('miniMushafMealBox');
      const expandBtn = document.getElementById('btnMiniLatinExpand');
      if (mealBox) {
        const isExp = mealBox.classList.toggle('is-latin-expanded');
        if (expandBtn) expandBtn.textContent = isExp ? '−' : '↕';
      }
    });

    applyMiniMushafFontSizes();

    // 4. Tecvid Renkleri Aç/Kapat Toggle
    document.getElementById('btnMiniMushafTajweedToggle')?.addEventListener('click', () => {
      isMiniMushafTajweedEnabled = !isMiniMushafTajweedEnabled;
      const cont = document.getElementById('miniMushafArabicContent');
      const btn = document.getElementById('btnMiniMushafTajweedToggle');
      if (cont) {
        if (!isMiniMushafTajweedEnabled) {
          cont.classList.add('no-tajweed-colors');
          if (btn) btn.style.opacity = '0.5';
          if (window.showToast) window.showToast(" Tecvid renkleri gizlendi (Sade hat görünümü).");
        } else {
          cont.classList.remove('no-tajweed-colors');
          if (btn) btn.style.opacity = '1';
          if (window.showToast) window.showToast(" Tecvid renkleri ve kuralları aktifleştirildi.");
        }
      }
    });

    // 5. Tecvid Lejant Çiplerine Tıklayınca İlgili Kuralı Parlatma
    widget.querySelectorAll('.legend-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const ruleClass = dot.getAttribute('data-rule') || 'tj-madd';
        const cont = document.getElementById('miniMushafArabicContent');
        if (!cont) return;
        const targets = cont.querySelectorAll(`.${ruleClass}, [class*="${ruleClass}"]`);
        if (targets.length === 0) {
          if (window.showToast) window.showToast(`Bu âyette ${dot.textContent} kuralı bulunmuyor.`);
          return;
        }
        targets.forEach(t => {
          t.classList.remove('tajweed-active-pulse');
          void t.offsetWidth;
          t.classList.add('tajweed-active-pulse');
          setTimeout(() => t.classList.remove('tajweed-active-pulse'), 3000);
        });
        if (window.showToast) window.showToast(`${dot.textContent} kuralı metin üzerinde vurgulandı.`);
      });
    });

    // 6. Mini Oynatıcı Dinleyicileri (Kısa Meşk vs Tüm Âyet)
    document.getElementById('btnMiniMushafPlay')?.addEventListener('click', () => {
      if (!activeMiniMushafRule) return;
      if (isMiniMushafPlaying) {
        stopMiniMushafAudio();
      } else {
        playMiniMushafRuleAudio(activeMiniMushafRule, false);
      }
    });

    document.getElementById('btnMiniMushafPlayFullAyah')?.addEventListener('click', () => {
      if (!activeMiniMushafRule) return;
      if (isMiniMushafPlaying) {
        stopMiniMushafAudio();
      } else {
        playMiniMushafRuleAudio(activeMiniMushafRule, true);
      }
    });

    // 7. Metronom Senkron Dinleyicisi
    document.getElementById('btnMiniMushafMetronome')?.addEventListener('click', () => {
      const bpm = activeMiniMushafRule?.bpm || 80;
      startTeknikMetronome(bpm, activeMiniMushafRule?.ruleName || 'Tempo');
    });

    // 8. Tam Sayfa Mushaf'a Git
    document.getElementById('btnMiniMushafFullView')?.addEventListener('click', () => {
      if (!activeMiniMushafRule) return;
      if (typeof window.locateAndSelectSurahAyah === 'function') {
        window.locateAndSelectSurahAyah(activeMiniMushafRule.surah, activeMiniMushafRule.ayah);
      }
      if (typeof window.switchAppTab === 'function') {
        window.switchAppTab('tab-tilavet');
      }
      if (window.showToast) {
        window.showToast(`Tam Sayfa Mushaf açıldı: ${activeMiniMushafRule.surahName} ${activeMiniMushafRule.ayah}. Âyet`);
      }
    });

    isMiniMushafInitialized = true;
    updateMiniMushafView(activeMiniMushafRule);
  }

  function setMiniMushafPlayState(playing) {
    isMiniMushafPlaying = playing;
    const playBtn = document.getElementById('btnMiniMushafPlay');
    const playIcon = document.getElementById('miniPlayIcon');
    const playText = document.getElementById('miniPlayText');
    const statusText = document.getElementById('miniAudioStatus');
    const arabicCont = document.getElementById('miniMushafArabicContent');

    if (playing) {
      playBtn?.classList.add('is-playing');
      if (playIcon) playIcon.textContent = '⏹';
      if (playText) playText.textContent = 'Durdur';
      if (statusText) statusText.textContent = 'Örnek Dinleniyor...';
      arabicCont?.classList.add('tajweed-live-reading');
    } else {
      playBtn?.classList.remove('is-playing');
      if (playIcon) playIcon.textContent = '▶';
      if (playText) playText.textContent = 'Örneği Dinle';
      if (statusText) statusText.textContent = activeMiniMushafRule?.reciter ? `Kâri: ${activeMiniMushafRule.reciter}` : 'Hazır';
      arabicCont?.classList.remove('tajweed-live-reading');
    }
  }

  // Tecvid örnekleri: âyetin tamamı değil, yalnız kuralın geçtiği kelimeler çalınır.
  // Zamanlar Quran.com'un Husarî kelime zamanlamalarından alınmıştır (milisaniye; end null = âyet sonuna kadar).
  const MINI_MUSHAF_CLIPS = {
    'izhar':              [3610, 6150],
    'idgam-maalgunne':    [5280, 8710],
    'idgam-bilagunne':    [6390, 9200],
    'iklab':              [2360, 4880],
    'ihfa':               [12760, 14790],
    'dudak-ihfasi':       [100, 5460],
    'idgam-misleyn-mim':  [650, 5850],
    'mim-izhari':         [6210, 7690],
    'medd-i-tabii':       [7550, 10080],
    'medd-i-muttasil':    [900, 3900],
    'medd-i-munfasil':    [330, 5650],
    'medd-i-lazim':       [7380, null],
    'medd-i-ariz':        [2350, null],
    'medd-i-lin':         [2390, null],
    'kalkale':            [850, null],
    'hukmur-ra':          [2210, null],
    'lam-i-tarif':        [600, null],
    'zamir':              [8900, null],
    'vakif-isaretleri':   [3300, 7860]
  };
  function miniMushafClipUrl(surah, ayah) {
    return `https://mirrors.quranicaudio.com/everyayah/Husary_64kbps/${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}.mp3`;
  }

  function playMiniMushafRuleAudio(ruleData, fullAyah = false) {
    if (isMiniMushafPlaying) {
      stopMiniMushafAudio();
      return;
    }

    stopMiniMushafAudio();

    if (typeof window.TilavetAudioManager !== 'undefined') {
      window.TilavetAudioManager.notifyPlay('teknik');
    }

    const surah = ruleData.surah || 1;
    const ayah = ruleData.ayah || 1;
    const reciterKey = ruleData.reciterKey || 'husary';
    const clip = !fullAyah ? MINI_MUSHAF_CLIPS[ruleData.id] : null;
    const targetUrl = clip ? miniMushafClipUrl(surah, ayah) : getEveryAyahAudioUrl(surah, ayah, reciterKey);

    const startSec = clip ? Math.max(0, clip[0] - 150) / 1000 : 0;
    const endSec = clip && clip[1] ? (clip[1] + 300) / 1000 : 0;

    const audio = new Audio(targetUrl);
    miniMushafChainedAudio = audio;
    setMiniMushafPlayState(true);

    const statusText = document.getElementById('miniAudioStatus');
    if (statusText) {
      if (fullAyah) {
        statusText.innerHTML = `Tüm Âyet: ${ruleData.surahName || ''} ${ayah}. Âyet`;
      } else {
        const wordLabel = ruleData.targetWord || ruleData.ruleName || 'Örnek';
        statusText.innerHTML = `<span class="audio-spinner">●</span> Hedef Meşk: <strong>${escapeMarkup(wordLabel)}</strong>`;
      }
    }

    let hasSeeked = false;
    const seekToStart = () => {
      if (!hasSeeked && startSec > 0) {
        hasSeeked = true;
        try {
          audio.currentTime = startSec;
        } catch (_) {}
      }
    };

    audio.addEventListener('loadedmetadata', seekToStart);
    audio.addEventListener('canplay', seekToStart);

    audio.addEventListener('timeupdate', () => {
      if (!hasSeeked && startSec > 0 && audio.currentTime < startSec - 0.2) {
        seekToStart();
      }
      if (!fullAyah && endSec > 0 && audio.currentTime >= endSec) {
        stopMiniMushafAudio();
        if (statusText) statusText.textContent = 'Örnek dinlendi';
      }
    });

    audio.onended = () => {
      stopMiniMushafAudio();
      if (statusText) statusText.textContent = 'Tilavet tamamlandı';
    };

    audio.onerror = () => {
      console.warn('Mini Mushaf ses yükleme hatası:', targetUrl);
      stopMiniMushafAudio();
      if (statusText) statusText.textContent = 'Ses açılamadı';
      if (window.showToast) window.showToast(`⚠ Ses dosyasına ulaşılamadı (${surah}:${ayah}).`);
    };

    audio.play().then(() => {
      if (!hasSeeked && startSec > 0) {
        audio.currentTime = startSec;
        hasSeeked = true;
      }
    }).catch(e => {
      console.warn('Mini Mushaf ses çalma hatası:', e);
      stopMiniMushafAudio();
    });
  }

  function updateMiniMushafView(ruleData) {
    if (!ruleData) return;
    activeMiniMushafRule = ruleData;

    initMiniMushafWidget();
    const widget = document.getElementById('miniMushafWidget');
    if (!widget) return;

    const sub = document.getElementById('miniMushafSubtitle');
    const surahTitle = document.getElementById('miniMushafSurahTitle');
    const juzBadge = document.getElementById('miniMushafJuzBadge');
    const pageBadge = document.getElementById('miniMushafPageBadge');
    const arabicCont = document.getElementById('miniMushafArabicContent');
    const ruleTag = document.getElementById('miniMushafRuleTag');
    const mealText = document.getElementById('miniMushafMealText');
    const bismillah = document.getElementById('miniMushafBismillah');
    const audioStatus = document.getElementById('miniAudioStatus');
    const pillLabel = document.getElementById('miniMushafPillLabel');

    const endAyahStr = (ruleData.endAyah && ruleData.endAyah > ruleData.ayah) ? `-${ruleData.endAyah}` : '';
    if (sub) sub.textContent = `${ruleData.surahName} Sûresi ${ruleData.ayah}${endAyahStr}. Âyet · Sayfa ${ruleData.page || '—'}`;
    if (surahTitle) surahTitle.textContent = ruleData.surahArabic || `سُورَةُ ${ruleData.surahName}`;
    if (juzBadge) juzBadge.textContent = `${ruleData.juz || 1}. CÜZ`;
    if (pageBadge) pageBadge.textContent = `S. ${ruleData.page || ruleData.ayah}`;

    // Fâtiha 1 ve Tevbe 9 hariç Besmele göster
    if (bismillah) {
      bismillah.style.display = (ruleData.ayah === 1 && ruleData.surah !== 1 && ruleData.surah !== 9) ? 'block' : 'none';
    }

    if (arabicCont) {
      arabicCont.innerHTML = ruleData.html;
      arabicCont.style.fontSize = `${miniMushafFontSize}rem`;
      if (!isMiniMushafTajweedEnabled) {
        arabicCont.classList.add('no-tajweed-colors');
      } else {
        arabicCont.classList.remove('no-tajweed-colors');
      }
    }

    if (ruleTag) ruleTag.innerHTML = `<span></span> <strong>${ruleData.ruleName || 'Tecvid Kuralı'}</strong>`;
    if (mealText) mealText.textContent = `${ruleData.ruleExplanation} — "${ruleData.meal}"`;
    if (audioStatus) audioStatus.textContent = ruleData.reciter ? `Kâri: ${ruleData.reciter}` : 'Hazır';
    if (pillLabel) pillLabel.textContent = `Mushaf: ${ruleData.surahName} (${ruleData.ayah}${endAyahStr})`;

    // Widget kapalıysa görünür yap
    widget.style.display = 'flex';
    const pill = document.getElementById('miniMushafPill');
    if (pill) pill.style.display = 'none';

    const body = document.getElementById('miniMushafBody');
    if (body) body.style.display = 'block';

    const toggleBtn = document.getElementById('btnToggleMiniMushaf');
    if (toggleBtn) toggleBtn.innerHTML = `<span></span> <strong>Küçük Mushaf</strong> <span style="font-size:0.75rem; color:var(--accent-gold);">(Açık)</span>`;

    const btnTeknikToggleLabel = document.getElementById('btnToggleFloatingMushafLabel');
    if (btnTeknikToggleLabel) btnTeknikToggleLabel.textContent = "Kayan Mushaf'ı Kapat";
  }

  // Kıraat Hızı Örneği İçin Mini Mushaf Açma & Canlı Senkronizasyon
  window.showMiniMushafForTempoExample = function(tempoId, exIdx, autoplay = false) {
    initMiniMushafWidget();
    const tempo = TEMPOLAR_DETAY.find(t => t.id === tempoId) || TEMPOLAR_DETAY[0];
    if (!tempo) return;
    const exList = (tempo.examples && tempo.examples.length > 0) ? tempo.examples : [];
    const ex = exList[exIdx] || exList[0];
    if (!ex) return;

    let styledHtml = ex.textAr;
    if (!styledHtml.includes('<span')) {
      styledHtml = `<span class="tajweed-highlight-target">${styledHtml}</span>`;
    }

    const tempoData = {
      id: ex.id || `${tempoId}-${exIdx}`,
      surah: ex.surah,
      ayah: ex.ayah,
      endAyah: ex.endAyah || ex.ayah,
      surahName: ex.surahName,
      surahArabic: `سُورَةُ ${ex.surahName}`,
      juz: (typeof getJuzForPage === 'function') ? getJuzForPage(ex.surah) : 1,
      page: ex.ayah,
      ruleName: `${tempo.name} (${ex.bpm} BPM)`,
      ruleFamily: "madd",
      targetWord: ex.ayahName,
      html: styledHtml,
      ruleExplanation: ex.speedNote || tempo.meddRules,
      meal: ex.mealTr,
      reciter: ex.reciter,
      reciterKey: ex.reciterKey,
      bpm: ex.bpm
    };

    updateMiniMushafView(tempoData);

    if (autoplay) {
      playMiniMushafRuleAudio(tempoData);
    }
  };

  // Global Kural Gösterme Köprüsü
  window.showMiniMushafForRule = function(ruleId, autoplay = false) {
    initMiniMushafWidget();
    const data = MINI_MUSHAF_TECVİD_DATA[ruleId] || Object.values(MINI_MUSHAF_TECVİD_DATA).find(r => r.id === ruleId);
    if (data) {
      updateMiniMushafView(data);
      if (autoplay) {
        playMiniMushafRuleAudio(data);
      }
    } else {
      // Dinamik fallback: TECVID_RULES'dan ara
      const fallback = TECVID_RULES.find(r => r.id === ruleId);
      if (fallback) {
        const dynamicData = {
          id: fallback.id,
          surah: fallback.surah || 1,
          ayah: fallback.ayah || 1,
          surahName: fallback.ayahRef || "Kur'an-ı Kerim",
          surahArabic: "سُورَةٌ مُبَارَكَةٌ",
          juz: 1,
          page: 1,
          ruleName: fallback.name,
          ruleFamily: fallback.family,
          targetWord: fallback.samplePhrase,
          html: `<span class="tajweed-highlight-target">${fallback.samplePhrase}</span>`,
          ruleExplanation: fallback.desc,
          meal: fallback.ayahRef
        };
        updateMiniMushafView(dynamicData);
        if (autoplay) playMiniMushafRuleAudio(dynamicData);
      }
    }
  };

  // Herhangi bir Ayet İçin Mini Mushaf Açma
  window.showMiniMushafForAyah = function(surahNo, ayahNo, ruleName, ruleFamily) {
    initMiniMushafWidget();
    surahNo = parseInt(surahNo, 10) || 1;
    ayahNo = parseInt(ayahNo, 10) || 1;

    // Önce bilinen tecvid sözlüğünden eşleştir
    const found = Object.values(MINI_MUSHAF_TECVİD_DATA).find(r => r.surah === surahNo && r.ayah === ayahNo);
    if (found) {
      updateMiniMushafView(found);
      return;
    }

    const sObj = SURAH_LIST.find(s => s.no === surahNo) || { name: `Sure ${surahNo}`, arabic: '' };
    const dynamicData = {
      id: `custom-${surahNo}-${ayahNo}`,
      surah: surahNo,
      ayah: ayahNo,
      surahName: sObj.name,
      surahArabic: sObj.arabic || `سُورَةُ ${sObj.name}`,
      juz: getJuzForPage ? getJuzForPage(surahNo) : 1,
      page: ayahNo,
      ruleName: ruleName || "Tecvid Kuralı İncelemesi",
      ruleFamily: ruleFamily || "madd",
      targetWord: `Âyet ${ayahNo}`,
      html: `<span class="tajweed-highlight-target">${sObj.name} Sûresi ${ayahNo}. Âyet Örneği</span>`,
      ruleExplanation: `${ruleName || 'Tecvid kuralı'} Mushaf sayfasında inceleniyor.`,
      meal: `${sObj.name} Sûresi ${ayahNo}. Âyet`
    };
    updateMiniMushafView(dynamicData);
  };

  // ===========================================================================
  // 5.3 TECVİD OKULU ANA GÖRÜNÜMÜ (19 KAPSAMLI KURAL & MUSHAF VURGULAMA)
  // ===========================================================================
  function renderTecvidView() {
    const container = document.getElementById('akademi-view-tecvid');
    if (!container) return;

    // Mini Mushaf Penceresini Sayfada Hemen Başlat ve Hazırla
    initMiniMushafWidget();

    // Filtreleme mantığı
    const filteredRules = TECVID_RULES.filter(rule => {
      const matchCat = (activeTecvidCategory === 'all') || (rule.cat === activeTecvidCategory);
      const q = activeTecvidSearch.toLowerCase().trim();
      const matchSearch = !q || (rule.name.toLowerCase().includes(q) || (rule.ar && rule.ar.includes(q)) || rule.desc.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });

    container.innerHTML = `
      <div class="tecvid-layout-wrap">
        <div class="akademi-card tecvid-catalog-card">
          <div class="card-headline">
            <div>
              <span class="card-badge green">SEVİYE 3 · 19 KLASİK KURAL</span>
              <h2 class="card-title">Tecvid Kuralları Atlası &amp; Mushaf Entegrasyonu</h2>
              <p class="card-desc">Mushaf üzerinde uygulanan renk kodlu tecvid sisteminin teorisi, Kur'an'dan örnekleri ve sağ taraftaki taşınabilir Mushaf penceresinde canlı takibi.</p>
            </div>
            <!-- Üst Sağ Araç Çubuğu: Arama ve Küçük Mushaf Aç/Kapat Butonu -->
            <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
              <button type="button" class="btn-sm-action" id="btnToggleMiniMushaf" style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.5rem 0.9rem; background:rgba(229,184,105,0.15); border:1px solid var(--accent-gold); color:#f0f3fa; border-radius:8px; cursor:pointer;" title="Sağ taraftaki yer değiştirilebilir küçük Mushaf penceresini aç/kapat">
                <span></span> <strong>Küçük Mushaf</strong> <span id="miniMushafToggleStatus" style="font-size:0.75rem; color:var(--accent-gold);">(Açık)</span>
              </button>
              <div style="min-width:220px;">
                <input type="text" id="inputTecvidSearch" class="akademi-input" value="${activeTecvidSearch}" placeholder="Kural veya harf ara (örn: izhar, gunne, med)...">
              </div>
            </div>
          </div>

          <!-- Kategori Filtre Butonları -->
          <div class="tecvid-cat-strip">
            <button type="button" class="tecvid-cat-pill ${activeTecvidCategory === 'all' ? 'active' : ''}" data-cat="all">Tüm Kurallar (${TECVID_RULES.length})</button>
            <button type="button" class="tecvid-cat-pill ${activeTecvidCategory === 'nun' ? 'active' : ''}" data-cat="nun">Nûn-ı Sâkin &amp; Tenvin (5)</button>
            <button type="button" class="tecvid-cat-pill ${activeTecvidCategory === 'mim' ? 'active' : ''}" data-cat="mim">Mîm-i Sâkin Hükümleri (3)</button>
            <button type="button" class="tecvid-cat-pill ${activeTecvidCategory === 'madd' ? 'active' : ''}" data-cat="madd">Med Kuralları (5)</button>
            <button type="button" class="tecvid-cat-pill ${activeTecvidCategory === 'letter' ? 'active' : ''}" data-cat="letter">Harf &amp; Diğer Hükümler (6)</button>
          </div>

          <!-- 19 Kural Kartları Izgarası -->
          <div class="tecvid-rules-grid">
            ${filteredRules.map(r => `
              <div class="tecvid-rule-block btn-select-rule-card" data-rule-id="${r.id}" data-family="${r.family}" style="cursor:pointer;" title="Bu kuralı küçük Mushaf sayfasında incelemek için dokunun">
                <div class="rule-top">
                  <div>
                    <span class="rule-title-tr">${r.name}</span>
                    <span class="card-badge mini" style="margin-left:0.4rem;">${r.cat.toUpperCase()}</span>
                  </div>
                  <span class="rule-title-ar" lang="ar">${r.ar}</span>
                </div>
                <p class="rule-desc">${r.desc}</p>
                <div class="rule-example">
                  <div class="rule-example-label">KUR'AN'DAN ASLÎ METİN ÖRNEĞİ:</div>
                  <div class="rule-example-text" lang="ar">${r.samplePhrase}</div>
                  <div class="rule-example-reference">Âyet Kaynağı: <strong>${r.ayahRef}</strong></div>
                </div>
                <div class="rule-action-row">
                  <button type="button" class="btn-rule-sample" data-rule-id="${r.id}" data-surah="${r.surah}" data-ayah="${r.ayah}" data-name="${r.name}">
                    <span>▶</span> Örnek Dinle
                  </button>
                  <button type="button" class="btn-rule-mushaf" data-rule-id="${r.id}" data-surah="${r.surah}" data-ayah="${r.ayah}" data-name="${r.name}" data-family="${r.family}">
                    <span></span> Mushaf'ta Gör
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // 1. Arama Dinleyicisi
    const searchInput = document.getElementById('inputTecvidSearch');
    searchInput?.addEventListener('input', () => {
      activeTecvidSearch = searchInput.value;
      renderTecvidView();
      const el = document.getElementById('inputTecvidSearch');
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    });

    // 2. Kategori Filtre Dinleyicisi
    container.querySelectorAll('.tecvid-cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        activeTecvidCategory = pill.getAttribute('data-cat') || 'all';
        renderTecvidView();
        updateExecutiveBarAndDrawer('tecvid');
      });
    });

    // 3. Küçük Mushaf Aç/Kapat Butonu
    const toggleMiniMushafBtn = document.getElementById('btnToggleMiniMushaf');
    toggleMiniMushafBtn?.addEventListener('click', () => {
      const widget = document.getElementById('miniMushafWidget');
      const pill = document.getElementById('miniMushafPill');
      if (!widget) {
        initMiniMushafWidget();
        return;
      }
      if (widget.style.display === 'none') {
        widget.style.display = 'flex';
        if (pill) pill.style.display = 'none';
        toggleMiniMushafBtn.innerHTML = `<span></span> <strong>Küçük Mushaf</strong> <span style="font-size:0.75rem; color:var(--accent-gold);">(Açık)</span>`;
      } else {
        widget.style.display = 'none';
        if (pill) pill.style.display = 'flex';
        toggleMiniMushafBtn.innerHTML = `<span></span> <strong>Küçük Mushaf</strong> <span style="font-size:0.75rem; color:#94a3b8;">(Kapalı)</span>`;
      }
    });

    // 4. Kartların Kendisine Tıklama -> Küçük Mushaf'ı Güncelle
    container.querySelectorAll('.btn-select-rule-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('button')) return; // buton tıklamasını ezme
        const ruleId = card.getAttribute('data-rule-id');
        if (ruleId && window.showMiniMushafForRule) {
          window.showMiniMushafForRule(ruleId, false);
          if (window.showToast) window.showToast(` ${ruleId.toUpperCase()} örneği sağdaki küçük Mushaf'a yüklendi.`);
        }
      });
    });

    // 5. "Örnek Dinle" Butonları -> Küçük Mushaf'ı Aç, Güncelle ve Oynat
    container.querySelectorAll('.btn-rule-sample').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ruleId = btn.getAttribute('data-rule-id');
        const name = btn.getAttribute('data-name') || '';
        if (ruleId && window.showMiniMushafForRule) {
          window.showMiniMushafForRule(ruleId, true);
        }
      });
    });

    // 6. "Mushaf'ta Gör" Butonları -> Sayfadan Ayrılmadan Küçük Mushaf'ta Göster
    container.querySelectorAll('.btn-rule-mushaf').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ruleId = btn.getAttribute('data-rule-id');
        const name = btn.getAttribute('data-name') || '';
        if (ruleId && window.showMiniMushafForRule) {
          window.showMiniMushafForRule(ruleId, false);
        }
      });
    });
  }

  // 5.4 TİLAVET TEKNİKLERİ, MERÂTİBÜ'L-KIRÂA, SECAVEND & HATALAR ATLASI
  function renderTeknikView() {
    const container = document.getElementById('akademi-view-teknik');
    if (!container) return;

    container.innerHTML = `
      <div class="teknik-layout-wrap">
        <!-- Üst Alt Navigasyon Şeridi -->
        <nav class="teknik-sub-nav" aria-label="Tilavet Teknikleri Gezintisi">
          <button type="button" class="btn-teknik-sub ${activeTeknikTab === 'tempolar' ? 'active' : ''}" data-teknik-tab="tempolar">
            Okuma hızları
          </button>
          <button type="button" class="btn-teknik-sub ${activeTeknikTab === 'secavend' ? 'active' : ''}" data-teknik-tab="secavend">
            Durak işaretleri
          </button>
          <button type="button" class="btn-teknik-sub ${activeTeknikTab === 'lahn' ? 'active' : ''}" data-teknik-tab="lahn">
            Okuma hataları
          </button>
          <button type="button" class="btn-teknik-sub ${activeTeknikTab === 'vasl' ? 'active' : ''}" data-teknik-tab="vasl">
            İbtidâ ve vasl
          </button>
          <button type="button" class="btn-teknik-sub ${activeTeknikTab === 'ozel' ? 'active' : ''}" data-teknik-tab="ozel">
            Sekte ve özel kelimeler
          </button>
          <button type="button" class="btn-teknik-sub ${activeTeknikTab === 'pratik' ? 'active' : ''}" data-teknik-tab="pratik">
            Kendini sına
          </button>
        </nav>

        <div id="teknikTabContent">
          ${renderTeknikSubContent()}
        </div>
      </div>
    `;

    // Alt sekme geçiş dinleyicileri
    container.querySelectorAll('.btn-teknik-sub').forEach(btn => {
      btn.addEventListener('click', () => {
        // Sekme değişirken çalan ses veya metronom varsa durdur
        stopTeknikAudio();
        stopTeknikMetronome();
        activeTeknikTab = btn.getAttribute('data-teknik-tab') || 'tempolar';
        renderTeknikView();
        updateExecutiveBarAndDrawer('teknik');
      });
    });

    attachTeknikInteractiveListeners(container);
  }

  function renderTeknikSubContent() {
    // -------------------------------------------------------------
    // SEKME 1: 4 TİLAVET HIZI (MERÂTİBÜ'L-KIRÂA) & METRONOM
    // -------------------------------------------------------------
    if (activeTeknikTab === 'tempolar') {
      const tempolarList = TEMPOLAR_DETAY.length > 0 ? TEMPOLAR_DETAY : [
        {
          id: "tahkik",
          name: "Tahkîk (التحقيق)",
          titleAr: "مَرْتَبَةُ التَّحْقِيقِ",
          speed: "En Yavaş / Talim Hızı",
          bpm: 60,
          bpmRange: "55 - 70 BPM",
          multiplier: "K = 1.40",
          idealReciter: "Şeyh Mahmûd Halîl el-Husarî",
          reciterKey: "husary",
          sampleSurah: 2,
          sampleAyah: 255,
          sampleSurahName: "Bakara Sûresi",
          sampleAyahName: "255. Âyet (Âyetü'l-Kürsî)",
          desc: "Harflerin mahreç ve sıfatlarını, medd ölçülerini azami sınırlarıyla (4-6 elif), harfleri adeta teraziyle tartar gibi tane tane okuma makamıdır. <strong>Fem-i muhsin talim ve meşk hızıdır.</strong>",
          meddRules: "Medd-i Muttasıl: 4-5 elif · Medd-i Munfasıl: 4-5 elif · Medd-i Lâzım: 4-6 elif · Gunneler: 1.5 - 2 elif tam dolgunlukta."
        },
        {
          id: "tertil",
          name: "Tertîl (الترتيل)",
          titleAr: "مَرْتَبَةُ التَّرْتِيلِ",
          speed: "Huşû & Tefekkür (Altın Oran)",
          bpm: 85,
          bpmRange: "75 - 95 BPM",
          multiplier: "K = 1.00 (Referans)",
          idealReciter: "Şeyh Muhammed Sıddîk el-Minşâvî",
          reciterKey: "minshawi",
          sampleSurah: 1,
          sampleAyah: 1,
          sampleSurahName: "Fâtiha Sûresi",
          sampleAyahName: "1-7. Âyetler",
          desc: "Mânâyı tefekkür ederek, orta ağırlıkta ve kalbe tesir edecek bir ahenk ve huşû ile tilavet etmektir. <em>'Kur'an'ı tertîl üzere oku'</em> (Müzzemmil: 4) emr-i ilahisinin doğrudan muhatabıdır.",
          meddRules: "Medd-i Muttasıl: 4 elif · Medd-i Munfasıl: 4 elif · Medd-i Lâzım: 4 elif · Gunneler: 1.5 elif tam dengeli."
        },
        {
          id: "tedvir",
          name: "Tedvîr (التدوير)",
          titleAr: "مَرْتَبَةُ التَّدْوِيرِ",
          speed: "Mutedil / İmamet Hızı",
          bpm: 110,
          bpmRange: "100 - 120 BPM",
          multiplier: "K = 0.85",
          idealReciter: "Kâbe İmamı Şeyh Yâsir ed-Devserî",
          reciterKey: "dossary",
          sampleSurah: 67,
          sampleAyah: 1,
          sampleSurahName: "Mülk Sûresi",
          sampleAyahName: "1. Âyet (Tebâreke)",
          desc: "Tahkîk ile Hadr arasında mutedil bir orta sürattir. Tecvid kaidelerinden ve harf haklarından taviz vermeden cemaatle cehrî namazlarda en çok tercih edilen sürattir.",
          meddRules: "Medd-i Muttasıl: 3-4 elif · Medd-i Munfasıl: 2-3 elif · Medd-i Lâzım: 4 elif · Gunneler: 1.5 elif akıcı."
        },
        {
          id: "hadr",
          name: "Hadr (الحدر)",
          titleAr: "مَرْتَبَةُ الْحَدْرِ",
          speed: "Seri / Hatim & Mukabele Hızı",
          bpm: 140,
          bpmRange: "130 - 155 BPM",
          multiplier: "K = 0.70",
          idealReciter: "Şeyh Meşâri Râşid el-Afâsî",
          reciterKey: "alafasy",
          sampleSurah: 55,
          sampleAyah: 1,
          sampleSurahName: "Rahmân Sûresi",
          sampleAyahName: "1-4. Âyetler",
          desc: "Hatim kıraatinde ve mukabelelerde tecvid ölçülerini asgari sınırlarda (Medd-i Munfasıl 1-2 elif, gunneler net) tutarak harf düşürmeden en süratli okuma biçimidir.",
          meddRules: "Medd-i Muttasıl: 2-3 elif · Medd-i Munfasıl: 1-2 elif · Medd-i Lâzım: 4 elif · Harf yutulması kesinlikle yasaktır."
        }
      ];

      const tempoPlain = {
        tahkik: { short: 'En yavaş', text: 'Harfler tek tek, en ağır ölçüyle okunur. Öğrenme ve meşk hızıdır.', use: 'Talim ve meşk' },
        tertil: { short: 'Ağır', text: 'Mânâ düşünülerek ağır ve ahenkle okunur. "Kur\'an\'ı tertîl ile oku" (Müzzemmil 4).', use: 'Huşû ile okuma' },
        tedvir: { short: 'Orta', text: 'Tahkîk ile hadr arasında orta hızdır. Cemaatle kılınan namazlarda en çok bu hız tercih edilir.', use: 'Namaz' },
        hadr:   { short: 'Hızlı', text: 'Tecvidden taviz vermeden en hızlı okumadır. Hatim ve mukabelede kullanılır.', use: 'Hatim, mukabele' }
      };
      const meddTable = {
        tahkik: ['4–5', '4–5', 'Tam (2 elif)'],
        tertil: ['4', '4', '1,5 elif'],
        tedvir: ['3–4', '2–3', '1,5 elif'],
        hadr:   ['2–3', '1–2', 'Kısa ama net']
      };
      const activeTempo = tempolarList.find(t => t.id === activeTempoId) || tempolarList[0];
      const tempoExamples = (t) => (t.examples && t.examples.length > 0) ? t.examples : [{
        id: `${t.id}-0`, title: t.sampleAyahName || 'Örnek tilavet', surah: t.sampleSurah || 1, ayah: t.sampleAyah || 1,
        endAyah: t.sampleAyah || 1, surahName: t.sampleSurahName || 'Fâtiha Sûresi', reciter: t.idealReciter, reciterKey: t.reciterKey,
        textAr: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
      }];
      const exList = tempoExamples(activeTempo);
      const curIdx = (tempoActiveExIdx[activeTempo.id] !== undefined && tempoActiveExIdx[activeTempo.id] < exList.length) ? tempoActiveExIdx[activeTempo.id] : 0;
      const curEx = exList[curIdx] || exList[0];
      const rangeOf = (ex) => (ex.endAyah && ex.endAyah > ex.ayah) ? `${ex.ayah}–${ex.endAyah}. âyetler` : `${ex.ayah}. âyet`;
      const surahOf = (ex) => ((typeof ex.surahName === 'string' && ex.surahName.trim()) || 'Sûre').replace(/\s+Sûresi$/i, '');
      const plain = tempoPlain[activeTempo.id] || { short: activeTempo.speed, text: '', use: '' };
      const nameTr = String(activeTempo.name || '').replace(/\s*\(.*\)\s*$/, '');

      return `
        <div class="tempos-card tp-card">
          <div class="card-headline">
            <span class="card-badge gold">MERÂTİBÜ'L-KIRÂA</span>
            <h2 class="card-title">Dört okuma hızı</h2>
            <p class="card-desc">Kur'an dört farklı hızda okunur; hız değişse de harflerin hakkı korunur. Bir hız seçin, örneklerden birini dinleyin.</p>
          </div>

          <div class="tp-layout">
            <div class="tp-speeds" role="tablist" aria-label="Okuma hızı">
              ${tempolarList.map((t, i) => `
                <button type="button" class="tp-speed ${t.id === activeTempo.id ? 'active' : ''}" role="tab" aria-selected="${t.id === activeTempo.id}" data-tempo-select="${t.id}">
                  <span class="tp-speed-bars" aria-hidden="true">${[0, 1, 2, 3].map(b => `<i class="${b <= i ? 'on' : ''}"></i>`).join('')}</span>
                  <span class="tp-speed-name">${String(t.name || '').replace(/\s*\(.*\)\s*$/, '')}</span>
                  <span class="tp-speed-ar" lang="ar">${t.titleAr ? t.titleAr.replace('مَرْتَبَةُ ', '') : ''}</span>
                  <span class="tp-speed-short">${(tempoPlain[t.id] || {}).short || ''}</span>
                </button>
              `).join('')}
            </div>

            <section class="tp-detail" aria-label="${nameTr}">
              <div class="tp-detail-head">
                <div>
                  <h3 class="tp-detail-title">${nameTr} <span lang="ar">${activeTempo.titleAr || ''}</span></h3>
                  <p class="tp-detail-text">${plain.text}</p>
                </div>
              </div>

              <div class="tp-examples" role="group" aria-label="Örnekler">
                ${exList.map((ex, idx) => `
                  <button type="button" class="tempo-ex-chip tp-example ${idx === curIdx ? 'active' : ''}" data-tempo-id="${activeTempo.id}" data-ex-idx="${idx}">
                    <span class="tp-example-surah">${surahOf(ex)}</span>
                    <span class="tp-example-range">${rangeOf(ex)}</span>
                  </button>
                `).join('')}
              </div>

              <div class="tp-reading">
                <div class="tp-reading-meta">
                  <span>${surahOf(curEx)} Sûresi · ${rangeOf(curEx)}</span>
                  <span>${curEx.reciter || activeTempo.idealReciter || ''}</span>
                </div>
                <div class="tp-arabic" lang="ar" dir="rtl">${curEx.textAr || ''}</div>
              </div>

              <div class="tp-actions">
                <button type="button" class="btn-teknik-action btn-audio btn-play-sample-audio tp-play" data-tempo-id="${activeTempo.id}" data-ex-idx="${curIdx}" data-surah="${curEx.surah || activeTempo.sampleSurah}" data-ayah="${curEx.ayah || activeTempo.sampleAyah}" data-end-ayah="${curEx.endAyah || curEx.ayah || activeTempo.sampleAyah}" data-reciter="${curEx.reciterKey || activeTempo.reciterKey}" data-title="${nameTr} · ${surahOf(curEx)}">
                  <span>▶</span> Dinle
                </button>
                <button type="button" class="btn-teknik-action btn-inspect btn-open-mini-mushaf" data-tempo-id="${activeTempo.id}" data-ex-idx="${curIdx}">Tecvid renkleriyle izle</button>
              </div>
            </section>
          </div>

          <div class="tp-compare">
            <h3 class="tp-compare-title">Hıza göre uzatma miktarları <small>(elif)</small></h3>
            <div class="tp-compare-scroll">
              <table class="tp-table">
                <thead><tr><th>Hız</th><th>Muttasıl</th><th>Munfasıl</th><th>Gunne</th><th>Nerede</th></tr></thead>
                <tbody>
                  ${tempolarList.map(t => `
                    <tr class="${t.id === activeTempo.id ? 'is-active' : ''}">
                      <th scope="row">${String(t.name || '').replace(/\s*\(.*\)\s*$/, '')}</th>
                      ${(meddTable[t.id] || ['', '', '']).map(v => `<td>${v}</td>`).join('')}
                      <td>${(tempoPlain[t.id] || {}).use || ''}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            <p class="tp-compare-note">Medd-i lâzım her hızda 4 elif olarak korunur (tahkîkte 6 elife kadar çıkabilir); tabiî med her zaman 1 eliftir.</p>
          </div>
        </div>
      `;
    }

    // -------------------------------------------------------------
    // SEKME 2: VAKIF & SECAVEND DURAKLARI ATLASI
    // -------------------------------------------------------------
    if (activeTeknikTab === 'secavend') {
      const classicalList = SECAVEND;
      const medineList = MEDINE_DURAKLARI;
      // Örnek dinlenince yalnız ekranda yazılı kelimeler çalınır (kelime aralığı: Quran.com zamanlaması)
      const CLIP = { '6:36': [1, 7], '2:5': [1, 8], '18:13': [1, 9], '2:253': [1, 6], '2:118': [1, 7], '36:26': [1, 7], '16:32': [1, 7], '2:2': [1, 7], '2:255': [1, 12], '2:10': [1, 9], '2:20': [20, 25], '13:17': [39, 42], '36:52': [5, 10] };
      if (activeSecavendSub === 'turler') activeSecavendSub = 'all';
      let displayItems = [];
      if (activeSecavendSub === 'secavend') displayItems = classicalList;
      else if (activeSecavendSub === 'medine') displayItems = medineList;
      else displayItems = [...classicalList, ...medineList];
      const tone = s => (s.symbol === 'م' || s.symbol === 'لا') ? 'stop' : (s.symbol === 'قلى' || s.symbol === 'ط' || s.symbol === 'قف' ? 'pause' : 'free');
      const markHtml = (text) => esc(text).replace(/([ۖ-ۜ])/g, '<span class="sv-mark">$1</span>');
      function esc(t) { return String(t || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }

      return `
        <div class="tempos-card sv-card-wrap">
          <div class="card-headline">
            <span class="card-badge gold">DURAK İŞARETLERİ</span>
            <h2 class="card-title">Nerede durulur, nerede geçilir?</h2>
            <p class="card-desc">Her işaretin âyetteki yerini büyük yazıyla görün ve yalnız o bölümü hocadan dinleyin. İşaret, Arapça metinde renkli gösterilir.</p>
          </div>

          <div class="secavend-filter-bar">
            <button type="button" class="secavend-filter-chip ${activeSecavendSub === 'all' ? 'active' : ''}" data-secavend-filter="all">Tümü (${classicalList.length + medineList.length})</button>
            <button type="button" class="secavend-filter-chip ${activeSecavendSub === 'secavend' ? 'active' : ''}" data-secavend-filter="secavend">Secavend (${classicalList.length})</button>
            <button type="button" class="secavend-filter-chip ${activeSecavendSub === 'medine' ? 'active' : ''}" data-secavend-filter="medine">Medine Mushafı (${medineList.length})</button>
          </div>

          <div class="sv-grid">
            ${displayItems.map(s => {
              const key = `${s.surah}:${s.ayah}`;
              const range = CLIP[key];
              return `
              <article class="sv-card sv-${tone(s)}">
                <header class="sv-head">
                  <span class="sv-symbol" lang="ar">${esc(s.symbol)}</span>
                  <div class="sv-titles">
                    <h3>${esc(s.name)}</h3>
                    <span class="sv-hukum">${esc(s.hukum)}</span>
                  </div>
                </header>
                <div class="sv-example">
                  <p class="sv-ar" lang="ar" dir="rtl">${markHtml(s.sampleAr)}</p>
                  <p class="sv-latin">${esc(s.sampleLatin)}</p>
                  <span class="sv-ref">Âyet ${key}</span>
                </div>
                <p class="sv-desc">${esc(s.desc)}</p>
                <details class="sv-why"><summary>Neden?</summary><p>${esc(s.explanation)}</p></details>
                <div class="sv-actions">
                  ${range ? `<button type="button" class="sv-play" data-clip-key="${key}" data-clip-from="${range[0]}" data-clip-to="${range[1]}" aria-pressed="false"><span class="v5-word-play-icon" aria-hidden="true"></span>Dinle</button>` : ''}
                  <button type="button" class="sv-open btn-goto-secavend-ayah" data-surah="${s.surah}" data-ayah="${s.ayah}">Mushaf'ta aç</button>
                </div>
              </article>`;
            }).join('')}
          </div>
        </div>
      `;
    }

    // -------------------------------------------------------------
    // SEKME 3: LAHN ATLASI (CELÎ & HAFÎ HATALAR)
    // -------------------------------------------------------------
    if (activeTeknikTab === 'lahn') {
      const cases = LAHN_KARSILASTIRMA;

      return `
        <div class="tempos-card">
          <div class="card-headline">
            <span class="card-badge alert">HATALAR ATLASI &amp; FIKIH</span>
            <h2 class="card-title">Lahn-ı Celî ve Lahn-ı Hafî Mukayese Laboratuvarı</h2>
            <p class="card-desc">Tilavette yapılan hatalar ilmi, fıkhi ve estetik tesirleri bakımından iki ana kısma ayrılır. Harfin aslını bozan hatalar namazı tehdit ederken, tecvid süsünü zedeleyen hatalar mekruhtur:</p>
          </div>

          <div class="lahn-comparison-grid">
            <!-- Sol Sütun: Lahn-ı Celî -->
            <div class="lahn-column-card celi">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="lahn-header-badge celi">⚠ BÜYÜK HATA (CELÎ)</span>
                <span style="font-size:0.75rem; color:#f87171; font-weight:700;">Hüküm: Haram / Namazı Bozar</span>
              </div>
              <h3 style="color:#fecaca; margin:0; font-size:1.2rem;">Lahn-ı Celî (Açık ve Bariz Kusur)</h3>
              <p style="font-size:0.84rem; color:#fca5a5; line-height:1.5; margin:0;">
                Arap dil kurallarını az çok bilen herkesin fark edebileceği; kelimenin maddesini, harfini veya harekesini bozan açık hatadır. Anlam bozulursa namaz ittifakla bâtıl olur; bilerek yapmak ise haramdır.
              </p>
              <ul class="lahn-rules-list">
                <li><strong>Harf Tebdili:</strong> 'ص' yerine 'س', 'ذ' yerine 'ز', 'ح' yerine 'هـ' veya boğaz 'ع' yerine göğüs 'ء' okumak.</li>
                <li><strong>Hareke Değişimi:</strong> 'أَنْعَمْتَ' (Sen nimet verdin) yerine 'أَنْعَمْتُ' (Ben nimet verdim) diyerek fail zamirini değiştirmek.</li>
                <li><strong>Sükûn &amp; Cezim İhlali:</strong> Cezimli sâkin harfe hareke vermek veya tersine harekeli harfi yutarak cezimlemek.</li>
                <li><strong>Harf Ziyâdesi / Noksânı:</strong> Meddi aşırı uzatıp fazladan elif/vâv türetmek veya var olan asıl harfi okumamak.</li>
                <li><strong>Şeddeyi İhmal Etmek:</strong> 'إِيَّاكَ' kelimesini şeddesiz 'إِيَاكَ' (Güneş ışığı mânâsına gelir) şeklinde hafifletmek.</li>
              </ul>
            </div>

            <!-- Sağ Sütun: Lahn-ı Hafî -->
            <div class="lahn-column-card hafi">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="lahn-header-badge hafi">ℹ GİZLİ HATA (HAFÎ)</span>
                <span style="font-size:0.75rem; color:#93c5fd; font-weight:700;">Hüküm: Mekruh / Estetik Kusur</span>
              </div>
              <h3 style="color:#bfdbfe; margin:0; font-size:1.2rem;">Lahn-ı Hafî (Gizli ve İnce Kusur)</h3>
              <p style="font-size:0.84rem; color:#93c5fd; line-height:1.5; margin:0;">
                Yalnızca tecvid ilmini tahsil etmiş kurrâ ve ehil hocaların anlayabileceği, tilavetin süs, zarafet ve kemâlini bozan fonetik kusurlardır. Namazı bozmaz ancak kasten yapılması mekruhtur.
              </p>
              <ul class="lahn-rules-list">
                <li><strong>Med Ölçüsünü Kaçırmak:</strong> 4 eliflik Medd-i Muttasıl veya Lâzım'ı 1-2 elifte alelacele kesmek; yahut tabiî meddi aşırı çekmek.</li>
                <li><strong>Gunne ve Haysûm Sapması:</strong> İhfâ veya idğâmda sesi genze vermeyip ağız boşluğundan çıkarmak veya süresini eksik bırakmak.</li>
                <li><strong>Kalkale Bozulması:</strong> 'ق ط ب ج د' harflerinde yankıyı yapmamak veya sonuna yapay bir hemze takıp patlatmak.</li>
                <li><strong>Tefhîm / Terkîk Hatası:</strong> Râ ve Lâm gibi harflerde kalınlık-incelik kuralını çiğnemek, kalın harf komşusundaki ince harfi kalınlaştırmak.</li>
                <li><strong>Tar'îd &amp; Nefes Kırma:</strong> Nağme uğruna sesi koyun meleyişi gibi kontrolsüz titretmek veya kelime ortasında nefes almak.</li>
              </ul>
            </div>
          </div>

          <!-- Canlı Vaka Karşılaştırma Matrisi -->
          <div style="margin-top:2rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
              <h3 style="font-size:1.15rem; color:var(--accent-gold); margin:0;"> 6 Somut Tilavet Vakası (Doğru vs Hatalı Okunuş)</h3>
              <span style="font-size:0.75rem; color:#94a3b8;">Fıkhi Hüküm ve Teolojik Güvenlik Çiti</span>
            </div>

            <div class="lahn-cases-grid">
              ${cases.map(c => `
                <div class="lahn-case-item">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="font-size:0.95rem; color:#fff;">${c.title}</strong>
                    <span class="lahn-header-badge ${c.type}" style="font-size:0.68rem;">${c.type === 'celi' ? 'CELÎ' : 'HAFÎ'}</span>
                  </div>

                  <div class="lahn-wrong-box">
                    <strong>❌ Hatalı Telaffuz:</strong> ${c.wrong}
                  </div>

                  <div class="lahn-correct-box">
                    <strong>✅ Doğru Fem-i Muhsin:</strong> ${c.correct}
                  </div>

                  <div style="font-size:0.78rem; color:#cbd5e1; line-height:1.45;">
                    ⚠ <strong>Fıkhî &amp; Mânâ Riski:</strong> ${c.impact}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // -------------------------------------------------------------
    // SEKME 4: İBTİDÂ VE VASL KAİDELERİ
    // -------------------------------------------------------------
    if (activeTeknikTab === 'vasl') {
      // Her örnek: Kur'an'daki gerçek kelimeler + yalnız o kelimelerin okunuşu (Husarî)
      const VASL_GROUPS = [
        { title: 'Hemze-i vasl: başta okunur, geçişte düşer', items: [
          { key: '55:1', from: 1, to: 1, ar: 'ٱلرَّحْمَـٰنُ', read: 'er-Rahmân', note: 'Kelimeyle başlarken elif-lâmdaki hemze üstünle okunur.' },
          { key: '1:2', from: 3, to: 4, ar: 'رَبِّ ٱلْعَـٰلَمِينَ', read: 'rabbil-âlemîn', note: 'Önceki kelimeye bağlanınca hemze okunmaz; ses doğrudan lâma geçer.' },
          { key: '2:60', from: 5, to: 8, ar: 'فَقُلْنَا ٱضْرِب بِّعَصَاكَ ٱلْحَجَرَ', read: 'fe-kulnâdrib bi-asâkel-hacer', note: 'Geçişte "ıdrib"in hemzesi düşer, "fekulnâ" doğrudan "drib"e bağlanır.' }
        ]},
        { title: 'Fiilde hemze-i vasl ile başlarken: 3. harfe bakılır', items: [
          { key: '16:125', from: 1, to: 4, ar: 'ٱدْعُ إِلَىٰ سَبِيلِ رَبِّكَ', read: 'ud\'u ilâ sebîli rabbik', note: '3. harf (ع) ötreli: hemze ötre ile okunur.' },
          { key: '1:6', from: 1, to: 3, ar: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ', read: 'ihdines-sırâtal-müstekîm', note: '3. harf (د) esreli: hemze esre ile okunur.' },
          { key: '20:24', from: 1, to: 3, ar: 'ٱذْهَبْ إِلَىٰ فِرْعَوْنَ', read: 'izheb ilâ fir\'avn', note: '3. harf (ه) üstünlü: hemze yine esre ile okunur, üstünle başlanmaz.' }
        ]},
        { title: 'Yedi semâî isim: başlarken esre', items: [
          { key: '3:45', from: 12, to: 14, ar: 'عِيسَى ٱبْنُ مَرْيَمَ', read: '\'îsebnü meryem', note: '"İbn" ile başlanırsa "ibnü" okunur; geçişte hemze düşer.' },
          { key: '3:35', from: 2, to: 4, ar: 'قَالَتِ ٱمْرَأَتُ عِمْرَٰنَ', read: 'kâletimre\'etü \'imrân', note: '"İmre\'e" başta esreli; burada önceki kelimeye bağlanmıştır.' }
        ]},
        { title: 'İki sâkin yan yana gelirse (iltikâ-i sâkineyn)', items: [
          { key: '17:110', from: 1, to: 3, ar: 'قُلِ ٱدْعُوا۟ ٱللَّهَ', read: 'kulid\'ullâh', note: '"Kul"ün sâkin lâmı, sonraki sâkin dâl ile karşılaşmamak için esre alır.' },
          { key: '12:31', from: 14, to: 16, ar: 'وَقَالَتِ ٱخْرُجْ عَلَيْهِنَّ', read: 've kâletihruc aleyhinn', note: '"Kâlet"in sâkin tâsı esrelenerek bağlanır.' },
          { key: '87:1', from: 1, to: 3, ar: 'سَبِّحِ ٱسْمَ رَبِّكَ', read: 'sebbihisme rabbik', note: 'Emir fiilin sonu esre alır ve "ism"in hemzesi geçişte düşer.' }
        ]},
        { title: 'Tenvinden sonra hemze-i vasl (nûn-ı kasr)', items: [
          { key: '11:42', from: 7, to: 9, ar: 'وَنَادَىٰ نُوحٌ ٱبْنَهُۥ', read: 've nâdâ nûhunibneh', note: 'Tenvindeki gizli nûn esreli okunarak sonraki kelimeye bağlanır.' }
        ]},
        { title: 'Hemze-i vasldan sonra sâkin hemze', items: [
          { key: '2:283', from: 15, to: 17, ar: 'ٱلَّذِى ٱؤْتُمِنَ أَمَـٰنَتَهُۥ', read: 'elleẕi\'tümine emânetehû', note: 'Geçişte ikinci hemze sâkin okunur; "ü\'tümine" ile başlanırsa uzatılarak "û\'tümine" olur.' },
          { key: '46:4', from: 17, to: 19, ar: 'ٱلسَّمَـٰوَٰتِ ۖ ٱئْتُونِى بِكِتَـٰبٍۢ', read: 'es-semâvât, i\'tûnî bi-kitâb', note: 'Başlarken "îtûnî" (hemze yâya dönüşür); geçişte "i\'tûnî".' }
        ]},
        { title: 'Hemze-i kat\': hiçbir zaman düşmez', items: [
          { key: '108:1', from: 1, to: 2, ar: 'إِنَّآ أَعْطَيْنَـٰكَ', read: 'innâ a\'taynâk', note: 'Hemze üzerinde işaret vardır; başta da geçişte de açıkça okunur.' }
        ]}
      ];
      const esc = t => String(t || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
      const total = VASL_GROUPS.reduce((n, g) => n + g.items.length, 0);

      return `
        <div class="tempos-card sv-card-wrap">
          <div class="card-headline">
            <span class="card-badge gold">BAŞLAMA VE GEÇİŞ</span>
            <h2 class="card-title">İbtidâ ve vasl</h2>
            <p class="card-desc">Kelimelere bağlanırken düşen, başlarken okunan sesler. ${total} örneğin hepsi Kur'an'dan; "Dinle" yalnız yazılı kelimeleri okutur.</p>
          </div>
          <div class="vs-groups">
            ${VASL_GROUPS.map(g => `
              <section class="vs-group">
                <h3 class="vs-group-title">${esc(g.title)}</h3>
                <div class="vs-grid">
                  ${g.items.map(it => `
                    <article class="vs-item">
                      <p class="sv-ar" lang="ar" dir="rtl">${esc(it.ar)}</p>
                      <p class="vs-read">${esc(it.read)}</p>
                      <p class="vs-note">${esc(it.note)}</p>
                      <div class="sv-actions">
                        <button type="button" class="sv-play" data-clip-key="${it.key}" data-clip-from="${it.from}" data-clip-to="${it.to}" aria-pressed="false"><span class="v5-word-play-icon" aria-hidden="true"></span>Dinle</button>
                        <span class="sv-ref">Âyet ${it.key}</span>
                      </div>
                    </article>`).join('')}
                </div>
              </section>`).join('')}
          </div>
        </div>
      `;
    }

    // -------------------------------------------------------------
    // SEKME 5: 4 SEKTE, FERŞ-İ HURÛF & ÖZEL KELİMELER
    // -------------------------------------------------------------
    if (activeTeknikTab === 'ozel') {
      const coreSpecial = OZEL_KELIMELER;
      const extraSpecial = EKSTRA_OZEL_KELIMELER;

      return `
        <div class="tempos-card">
          <div class="card-headline">
            <span class="card-badge cyan">FERŞ-İ HURÛF &amp; MEŞK</span>
            <h2 class="card-title">Kur'an'daki 4 Sekte ve Özel Tilavet Halleri (Hafs Rivayeti)</h2>
            <p class="card-desc">İmam Âsım kıraati Hafs rivayetinde doğrudan Resûlullah'tan (s.a.v.) mütevâtir olarak nakledilen ve kıraatin kemâlini oluşturan istisnai telaffuz incelikleri:</p>
          </div>

          <div class="ozel-group-wrap">
            <!-- 1. DÖRT SEKTE BÖLÜMÜ -->
            ${coreSpecial.map(k => `
              <div class="ozel-group-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <h3 style="font-size:1.2rem; color:var(--accent-gold); margin:0;"> ${k.type} (${k.count} Adet)</h3>
                  <span class="card-badge gold" style="font-size:0.75rem;">İmam Âsım / Hafs Rivayeti</span>
                </div>
                <p style="font-size:0.86rem; color:#cbd5e1; margin:0; line-height:1.5;">${k.desc}</p>

                <div class="ozel-places-grid">
                  ${k.places.map(p => `
                    <div class="ozel-place-item">
                      <div>
                        <div style="font-size:0.76rem; color:var(--text-muted); font-weight:700;">${p.name}</div>
                        <div style="font-family:'Amiri Quran',serif; font-size:1.45rem; color:#fff; direction:rtl; text-align:right; margin:0.4rem 0;">${p.phraseAr}</div>
                        <div style="font-size:0.8rem; color:var(--accent-gold); font-weight:600;">${p.latin}</div>
                      </div>

                      <div class="tempo-actions-row" style="margin-top:0.75rem;">
                        <button type="button" class="btn-teknik-action btn-audio btn-play-sample-audio" data-surah="${p.surah}" data-ayah="${p.ayah}" data-reciter="husary" data-title="${p.name}">
                          <span>▶</span> Dinle
                        </button>
                        <button type="button" class="btn-teknik-action btn-goto-ozel-ayah" data-surah="${p.surah}" data-ayah="${p.ayah}">
                          <span></span> Mushaf
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}

            <!-- 2. EKSTRA ÖZEL TİLAVET HALLERİ -->
            ${extraSpecial.map(e => `
              <div class="ozel-group-card" style="border-color:rgba(6,182,212,0.3);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <h3 style="font-size:1.2rem; color:#67e8f9; margin:0;">${e.type}</h3>
                  <span class="card-badge cyan" style="font-size:0.75rem;">Kıraat İnceliği</span>
                </div>
                <p style="font-size:0.86rem; color:#cbd5e1; margin:0; line-height:1.5;">${e.desc}</p>

                <div class="ozel-places-grid">
                  ${e.places.map(p => `
                    <div class="ozel-place-item">
                      <div>
                        <div style="font-size:0.76rem; color:var(--text-muted); font-weight:700;">${p.name}</div>
                        <div style="font-family:'Amiri Quran',serif; font-size:1.45rem; color:#fff; direction:rtl; text-align:right; margin:0.4rem 0;">${p.phraseAr}</div>
                        <div style="font-size:0.8rem; color:var(--accent-gold); font-weight:600;">${p.latin}</div>
                      </div>

                      <div class="tempo-actions-row" style="margin-top:0.75rem;">
                        <button type="button" class="btn-teknik-action btn-audio btn-play-sample-audio" data-surah="${p.surah}" data-ayah="${p.ayah}" data-reciter="husary" data-title="${p.name}">
                          <span>▶</span> Dinle
                        </button>
                        <button type="button" class="btn-teknik-action btn-goto-ozel-ayah" data-surah="${p.surah}" data-ayah="${p.ayah}">
                          <span></span> Mushaf
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // -------------------------------------------------------------
    // SEKME 6: TİLAVET TEKNİKLERİ İNTERAKTİF PRATİK (KENDİNİ SINA)
    // -------------------------------------------------------------
    if (activeTeknikTab === 'pratik') {
      const quiz = TEKNIK_QUIZ;

      return `
        <div class="tempos-card">
          <div class="card-headline">
            <span class="card-badge emerald">İNTERAKTİF SINAV &amp; MEŞK</span>
            <h2 class="card-title">Tilavet Teknikleri Bilgi ve Maharet Testi</h2>
            <p class="card-desc">Secavend durakları, lahn tehlikeleri, vasıl incelikleri ve 4 sekteye dair bilgilerinizi pekiştirin. Şıkları işaretlediğinizde anında ilmi açıklamayı görebilirsiniz:</p>
          </div>

          <div class="teknik-quiz-wrap">
            ${quiz.map((q, qIdx) => {
              const answered = quizAnsweredState[q.id];
              return `
                <div class="teknik-quiz-card" data-quiz-id="${q.id}">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="card-badge gold" style="font-size:0.75rem;">Soru ${qIdx + 1} / ${quiz.length}</span>
                    ${answered !== undefined ? (answered === q.answer ? '<span style="color:#34d399; font-weight:700; font-size:0.82rem;">✅ DOĞRU CEVAP</span>' : '<span style="color:#f87171; font-weight:700; font-size:0.82rem;">❌ TEKRAR İNCELEYİN</span>') : ''}
                  </div>

                  <h3 style="font-size:1.05rem; color:#fff; margin:0; line-height:1.5;">${q.question}</h3>

                  <div class="teknik-quiz-options">
                    ${q.options.map((opt, optIdx) => {
                      let extraClass = '';
                      if (answered !== undefined) {
                        if (optIdx === q.answer) extraClass = 'correct';
                        else if (optIdx === answered) extraClass = 'wrong';
                      }
                      return `
                        <button type="button" class="teknik-quiz-btn ${extraClass}" data-qid="${q.id}" data-opt="${optIdx}">
                          <strong style="margin-right:0.4rem;">${['A', 'B', 'C', 'D'][optIdx]})</strong> ${opt}
                        </button>
                      `;
                    }).join('')}
                  </div>

                  <div class="teknik-quiz-feedback ${answered !== undefined ? 'show' : ''}">
                     <strong>İlmi İzah:</strong> ${q.explanation}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    return '';
  }

  // SES VE METRONOM DURDURMA YARDIMCILARI
  function stopTeknikAudio() {
    if (activeTeknikAudio) {
      try {
        activeTeknikAudio.pause();
        activeTeknikAudio.currentTime = 0;
      } catch (_) {}
      activeTeknikAudio = null;
    }
    if (activeTeknikAudioBtn) {
      activeTeknikAudioBtn.classList.remove('is-playing');
      activeTeknikAudioBtn.innerHTML = `<span>▶</span> Örnek Dinle`;
      activeTeknikAudioBtn = null;
    }
  }

  // Merkezi ses yöneticisine teknik seslerini kaydet
  if (typeof window.TilavetAudioManager !== 'undefined') {
    window.TilavetAudioManager.register('teknik', { stop: stopTeknikAudio, category: 'teknik' });
  }

  function stopTeknikMetronome() {
    if (activeMetronomeInterval) {
      clearInterval(activeMetronomeInterval);
      activeMetronomeInterval = null;
    }
    document.querySelectorAll('.btn-play-tempo-metronome.is-active').forEach(b => {
      b.classList.remove('is-active');
      const bpm = b.getAttribute('data-bpm') || '80';
      b.innerHTML = `<span>⏱</span> Ritmi Dinle (${bpm} BPM)`;
    });
  }

  function attachTeknikInteractiveListeners(container) {
    // 1. Canlı Âyet Dinleme Butonları (.btn-play-sample-audio) — Çoklu Âyet Zincirleme & Kayan Mushaf Senkronizasyonu
    container.querySelectorAll('.btn-play-sample-audio').forEach(btn => {
      btn.addEventListener('click', () => {
        const surah = parseInt(btn.getAttribute('data-surah'), 10) || 1;
        const ayah = parseInt(btn.getAttribute('data-ayah'), 10) || 1;
        const endAyah = parseInt(btn.getAttribute('data-end-ayah'), 10) || ayah;
        const audioUrl = btn.getAttribute('data-url');
        const reciter = btn.getAttribute('data-reciter') || 'husary';
        const title = btn.getAttribute('data-title') || `${surah}. Sure ${ayah}. Âyet`;
        const tempoId = btn.getAttribute('data-tempo-id');
        const exIdx = parseInt(btn.getAttribute('data-ex-idx'), 10) || 0;

        // Aynı buton tıklanmışsa durdur
        if (activeTeknikAudioBtn === btn && activeTeknikAudio && !activeTeknikAudio.paused) {
          stopTeknikAudio();
          if (window.showToast) window.showToast("Tilavet durduruldu.");
          return;
        }

        // Başka çalan varsa durdur
        stopTeknikAudio();
        stopTeknikMetronome();

        // Kayan Mushaf açıksa veya çağrılmışsa bu örneğe odakla
        if (tempoId && typeof window.showMiniMushafForTempoExample === 'function') {
          const miniWidget = document.getElementById('miniMushafWidget');
          if (miniWidget && miniWidget.style.display !== 'none') {
            window.showMiniMushafForTempoExample(tempoId, exIdx, false);
          }
        }

        let curAyah = ayah;
        btn.classList.add('is-playing');
        if (window.showToast) window.showToast(` ${title} çalınıyor...`);

        function playNextAyah() {
          if (curAyah > endAyah) {
            stopTeknikAudio();
            if (window.showToast) window.showToast("Örnek tilavet tamamlandı.");
            return;
          }

          const audioUrl = getEveryAyahAudioUrl(surah, curAyah, reciter);
          if (typeof window.TilavetAudioManager !== 'undefined') {
            window.TilavetAudioManager.notifyPlay('teknik');
          }

          const audio = new Audio(audioUrl);
          activeTeknikAudio = audio;
          activeTeknikAudioBtn = btn;
          const progressLabel = endAyah > ayah ? ` (${curAyah}/${endAyah})` : '';
          btn.innerHTML = `<span class="audio-spinner">⏹</span> Durdur${progressLabel}`;

          audio.play().catch(e => {
            console.warn('Tilavet sesi çalınamadı:', e);
            if (curAyah < endAyah) {
              curAyah++;
              playNextAyah();
            } else {
              stopTeknikAudio();
              if (window.showToast) window.showToast(`⚠ Ses dosyasına ulaşılamadı (${surah}:${curAyah}).`);
            }
          });

          audio.onended = () => {
            if (curAyah < endAyah) {
              curAyah++;
              playNextAyah();
            } else {
              stopTeknikAudio();
            }
          };

          audio.onerror = () => {
            if (curAyah < endAyah) {
              curAyah++;
              playNextAyah();
            } else {
              stopTeknikAudio();
            }
          };
        }

        playNextAyah();
      });
    });

    // Hız seçici (tek ayrıntı paneli)
    container.querySelectorAll('[data-tempo-select]').forEach(btn => {
      btn.addEventListener('click', () => {
        stopTeknikAudio();
        stopTeknikMetronome();
        activeTempoId = btn.getAttribute('data-tempo-select') || 'tertil';
        const contentEl = container.querySelector('#teknikTabContent');
        if (contentEl) {
          contentEl.innerHTML = renderTeknikSubContent();
          attachTeknikInteractiveListeners(container);
        }
      });
    });

    // 1.1 4 Örnek Seçici Butonları (.tempo-ex-chip)
    container.querySelectorAll('.tempo-ex-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const tempoId = chip.getAttribute('data-tempo-id');
        const exIdx = parseInt(chip.getAttribute('data-ex-idx'), 10) || 0;
        if (!tempoId) return;

        stopTeknikAudio();
        stopTeknikMetronome();
        tempoActiveExIdx[tempoId] = exIdx;

        const contentEl = container.querySelector('#teknikTabContent');
        if (contentEl) {
          contentEl.innerHTML = renderTeknikSubContent();
          attachTeknikInteractiveListeners(container);
        }

        // Kayan Mushaf açıksa canlı senkronize et
        const miniWidget = document.getElementById('miniMushafWidget');
        if (miniWidget && miniWidget.style.display !== 'none' && typeof window.showMiniMushafForTempoExample === 'function') {
          window.showMiniMushafForTempoExample(tempoId, exIdx, false);
        }
      });
    });

    // 1.2 Kayan Mushaf Açma / Kapatma Ana Butonu (#btnToggleFloatingMushaf)
    const btnToggleFloating = container.querySelector('#btnToggleFloatingMushaf');
    if (btnToggleFloating) {
      btnToggleFloating.addEventListener('click', () => {
        initMiniMushafWidget();
        const widget = document.getElementById('miniMushafWidget');
        const pill = document.getElementById('miniMushafPill');
        const label = document.getElementById('btnToggleFloatingMushafLabel');
        if (widget && widget.style.display !== 'none') {
          stopMiniMushafAudio();
          widget.style.display = 'none';
          if (pill) pill.style.display = 'none';
          if (label) label.textContent = "Kayan Mushaf'ı Aç";
          if (window.showToast) window.showToast("Kayan Mushaf ekranı gizlendi.");
        } else {
          if (typeof window.showMiniMushafForTempoExample === 'function') {
            window.showMiniMushafForTempoExample('tahkik', tempoActiveExIdx.tahkik || 0, false);
          }
          if (label) label.textContent = "Kayan Mushaf'ı Kapat";
          if (window.showToast) window.showToast(" Kayan Mushaf açıldı. İstediğiniz yere sürükleyebilirsiniz.");
        }
      });
    }

    // 1.3 Kart İçi Kayan Mushaf Tecvid İnceleme Butonları (.btn-open-mini-mushaf)
    container.querySelectorAll('.btn-open-mini-mushaf').forEach(btn => {
      btn.addEventListener('click', () => {
        const tempoId = btn.getAttribute('data-tempo-id') || 'tahkik';
        const exIdx = parseInt(btn.getAttribute('data-ex-idx'), 10) || 0;
        if (typeof window.showMiniMushafForTempoExample === 'function') {
          window.showMiniMushafForTempoExample(tempoId, exIdx, false);
        }
        if (window.showToast) window.showToast(" Sürüklenebilir Mushaf ekranında tecvid renklendirmesiyle açıldı.");
      });
    });

    // 2. Metronom Simülatörü (.btn-play-tempo-metronome)
    container.querySelectorAll('.btn-play-tempo-metronome').forEach(btn => {
      btn.addEventListener('click', () => {
        const bpm = parseInt(btn.getAttribute('data-bpm'), 10) || 80;
        const name = btn.getAttribute('data-name') || 'Tempo';

        // Halihazırda bu buton aktifse durdur
        if (btn.classList.contains('is-active')) {
          stopTeknikMetronome();
          if (window.showToast) window.showToast("Metronom durduruldu.");
          return;
        }

        stopTeknikMetronome();

        btn.classList.add('is-active');
        btn.innerHTML = `<span>⏹</span> Ritmi Durdur (${bpm} BPM)`;
        if (window.showToast) window.showToast(`⏱ ${name} (${bpm} BPM) metronomu başlatıldı.`);

        const intervalMs = Math.round(60000 / bpm);
        let count = 0;

        activeMetronomeInterval = setInterval(() => {
          count++;
          const freq = (count % 4 === 1) ? 880 : 440; // İlk vuruş tiz çan, diğerleri tok tık

          if (window.TilavetAudioLab?.drone?.playSingleNote) {
            window.TilavetAudioLab.drone.playSingleNote(freq, 0.05);
          } else {
            // Web Audio API doğrudan vuruş
            try {
              const AudioCtx = window.AudioContext || window.webkitAudioContext;
              if (AudioCtx) {
                const ctx = new AudioCtx();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.06);
              }
            } catch (_) {}
          }

          // 32 vuruş sonra otomatik durdur
          if (count >= 32) {
            stopTeknikMetronome();
          }
        }, intervalMs);
      });
    });

    // 3. Mushaf'a git butonları (.btn-goto-secavend-ayah, .btn-goto-ozel-ayah)
    container.querySelectorAll('.btn-goto-secavend-ayah, .btn-goto-ozel-ayah').forEach(btn => {
      btn.addEventListener('click', () => {
        stopTeknikAudio();
        stopTeknikMetronome();
        const surah = parseInt(btn.getAttribute('data-surah'), 10) || 1;
        const ayah = parseInt(btn.getAttribute('data-ayah'), 10) || 1;
        if (typeof window.locateAndSelectSurahAyah === 'function') {
          window.locateAndSelectSurahAyah(surah, ayah);
        }
        if (typeof window.switchAppTab === 'function') {
          window.switchAppTab('tab-tilavet');
        }
        if (window.showToast) window.showToast(` ${surah}. Sure ${ayah}. Âyete gidildi.`);
      });
    });

    // 4. Secavend Alt Filtre Butonları (.secavend-filter-chip)
    container.querySelectorAll('.secavend-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        stopTeknikAudio();
        activeSecavendSub = chip.getAttribute('data-secavend-filter') || 'all';
        renderTeknikView();
      });
    });

    // 5. Pratik / Test Butonları (.teknik-quiz-btn)
    container.querySelectorAll('.teknik-quiz-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.getAttribute('data-qid');
        const opt = parseInt(btn.getAttribute('data-opt'), 10);
        if (!qid) return;

        quizAnsweredState[qid] = opt;
        renderTeknikView();
      });
    });
  }

  // 5.5 MAKAM OKULU (10 MAKAM + KAYNAKLI TİLAVET ÖRNEKLERİ + PİYANO + DRONE SENTEZLEYİCİ)
  let makamAudioPlayer = null;
  let currentMakamAudioItem = null;
  let makamArabicFontScale = 1.15;

  function stopMakamAudio() {
    if (makamAudioPlayer) {
      makamAudioPlayer.ontimeupdate = null;
      makamAudioPlayer.onended = null;
      makamAudioPlayer.onerror = null;
      makamAudioPlayer.onplay = null;
      try {
        makamAudioPlayer.pause();
        makamAudioPlayer.currentTime = 0;
        makamAudioPlayer.removeAttribute('src');
        makamAudioPlayer.load();
      } catch (_) {}
      makamAudioPlayer = null;
    }
    currentMakamAudioItem = null;
    updateMakamAudioUI();
  }

  // Merkezi ses yöneticisine makam çalarını kaydet
  if (typeof window.TilavetAudioManager !== 'undefined') {
    window.TilavetAudioManager.register('makam', { stop: stopMakamAudio, category: 'makam' });
  }

  function getMakamAyahAudioUrl(sourceAudioUrl, surah, ayah) {
    const surahNumber = Number(surah);
    const ayahNumber = Number(ayah);
    if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114 ||
        !Number.isInteger(ayahNumber) || ayahNumber < 1 || ayahNumber > 286) {
      throw new Error(`Geçersiz sûre/âyet numarası: ${surah}:${ayah}`);
    }

    const sourceUrl = new URL(sourceAudioUrl);
    if (sourceUrl.protocol !== 'https:' || sourceUrl.hostname !== 'everyayah.com' ||
        !/\/\d{6}\.mp3$/i.test(sourceUrl.pathname)) {
      throw new Error('Makam örneği geçerli bir EveryAyah ses bağlantısı içermiyor.');
    }

    const filename = `${String(surahNumber).padStart(3, '0')}${String(ayahNumber).padStart(3, '0')}.mp3`;
    sourceUrl.pathname = sourceUrl.pathname.replace(/\d{6}\.mp3$/i, filename);
    sourceUrl.search = '';
    sourceUrl.hash = '';
    return sourceUrl.href;
  }
  window.getMakamAyahAudioUrl = getMakamAyahAudioUrl;

  function updateMakamAudioUI() {
    const banner = document.getElementById('makamGlobalPlayerBar');
    const cards = document.querySelectorAll('.makam-ayah-card');
    const playBtns = document.querySelectorAll('.btn-play-makam-ayah');
    const globalToggleBtn = document.getElementById('btnMakamGlobalToggle');

    cards.forEach(c => c.classList.remove('playing'));
    playBtns.forEach(btn => {
      btn.innerHTML = '<span>▶</span> Makamlı Dinle';
      btn.classList.remove('playing');
    });

    if (currentMakamAudioItem && makamAudioPlayer && !makamAudioPlayer.paused) {
      if (banner) banner.style.display = 'flex';
      if (globalToggleBtn) globalToggleBtn.innerHTML = '<span>⏸</span> Duraklat';
      const playingCard = document.querySelector(`.makam-ayah-card[data-example-id="${currentMakamAudioItem.id}"]`);
      if (playingCard) {
        playingCard.classList.add('playing');
        const cardBtn = playingCard.querySelector('.btn-play-makam-ayah');
        if (cardBtn) {
          const ayahBadge = (currentMakamAudioItem.endAyah > currentMakamAudioItem.startAyah)
            ? ` (${currentMakamAudioItem.currentAyah}/${currentMakamAudioItem.endAyah})`
            : '';
          cardBtn.innerHTML = `<span>⏸</span> Duraklat${ayahBadge} <span class="sound-wave-bars"><span></span><span></span><span></span><span></span></span>`;
          cardBtn.classList.add('playing');
        }
      }
      const titleEl = document.getElementById('makamPlayerTrackTitle');
      if (titleEl) {
        const ayahBadge = (currentMakamAudioItem.endAyah > currentMakamAudioItem.startAyah)
          ? ` [Âyet: ${currentMakamAudioItem.currentAyah} / ${currentMakamAudioItem.endAyah}]`
          : '';
        titleEl.textContent = `${currentMakamAudioItem.reciter} — ${currentMakamAudioItem.text}${ayahBadge}`;
      }
      const makamNameEl = document.getElementById('makamPlayerMakamName');
      if (makamNameEl) {
        makamNameEl.textContent = `${currentMakamAudioItem.makamName} Makamı`;
      }
    } else {
      if (banner) {
        if (!currentMakamAudioItem) {
          banner.style.display = 'none';
        } else {
          // Duraklatıldıysa düğmeyi 'Devam Et' yap
          if (globalToggleBtn) globalToggleBtn.innerHTML = '<span>▶</span> Devam Et';
        }
      }
    }
  }

  function formatAudioTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function renderMakamView() {
    const container = document.getElementById('akademi-view-makam');
    if (!container) return;

    const currentMakam = MAKAMLAR.find(m => m.id === state.selectedMakam) || MAKAMLAR[0] || {
      id: "rast",
      durak: 0,
      guclu: 31,
      names: { tr: "Rast", ar: "رَاسْت" },
      tags: ["ferah", "vakarli", "dengeli"],
      seyir: "cikici",
      dizi: { cikici: [0, 9, 17, 22, 31, 40, 48, 53] },
      motifs: []
    };

    const T = (typeof window !== 'undefined' && window.MakamTuning) ? window.MakamTuning : null;
    const durakVal = typeof currentMakam.durak === 'number' ? currentMakam.durak : 9;
    const kararHz = T ? T.hzOfAbs(durakVal) : (durakVal === 0 ? 195.57 : durakVal === 17 ? 244.31 : durakVal === -9 ? 173.83 : 220.0);
    const kararName = (T && T.perdeAdi(durakVal)) ? T.perdeAdi(durakVal) : (durakVal === 0 ? 'Rast' : durakVal === 9 ? 'Dügâh' : durakVal === 17 ? 'Segâh' : durakVal === -9 ? 'Acem-Aşîran' : 'Durak');
    const gucluVal = typeof currentMakam.guclu === 'number' ? currentMakam.guclu : 31;
    const gucluName = (T && T.perdeAdi(gucluVal)) ? T.perdeAdi(gucluVal) : (gucluVal === 31 ? 'Nevâ' : gucluVal === 22 ? 'Çargâh' : 'Güçlü');
    const cikiciDizi = currentMakam.dizi?.cikici || currentMakam.dizi || [durakVal, durakVal + 53];
    const examples = Array.isArray(currentMakam.ayahExamples) ? currentMakam.ayahExamples : [];
    const reciters = [...new Map(examples.map(example => [
      example.reciterId || example.reciter,
      example.reciter || 'Kâri'
    ]))];
    const sources = (currentMakam.kaynaklar || []).filter(source => {
      try {
        const url = new URL(source.url);
        return ['http:', 'https:'].includes(url.protocol);
      } catch (_) {
        return false;
      }
    });
    const escapeMarkup = value => String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
    const confidenceLabel = {
      high: 'Yüksek',
      medium: 'Orta',
      low: 'Sınırlı'
    }[currentMakam.confidence] || 'Belirtilmemiş';
    const reviewLabel = currentMakam.needsReview === true
      ? 'Uzman incelemesi bekliyor'
      : currentMakam.needsReview === false
        ? 'Açık inceleme uyarısı yok'
        : 'İnceleme durumu belirtilmemiş';
    const totalExampleCount = MAKAMLAR.reduce((count, makam) => count + (makam.ayahExamples?.length || 0), 0);

    const seyirLabel = { cikici: 'Çıkıcı', 'inici-cikici': 'İnici-çıkıcı', inici: 'İnici' }[currentMakam.seyir] || currentMakam.seyir || '—';
    const seyirHint = {
      cikici: 'Melodi karar perdesinden başlar, yukarı çıkar, sonra karara iner.',
      'inici-cikici': 'Melodi güçlü perde civarında başlar, iner ve yeniden yükselir.',
      inici: 'Melodi tiz perdelerden başlayıp karara doğru iner.'
    }[currentMakam.seyir] || '';
    const themes = (currentMakam.gelenekNotu || currentMakam.uyumluTemalar || []);
    const stageLabels = ['Giriş', 'Gelişme', 'Zirve', 'Karar'];

    container.innerHTML = `
      <div class="makam-layout-wrap mk-wrap">
        <div class="mk-picker" role="tablist" aria-label="Makam seçin">
          ${MAKAMLAR.map(m => `
            <button type="button" class="makam-nav-card mk-chip ${m.id === currentMakam.id ? 'active' : ''}" data-makam="${m.id}" role="tab" aria-selected="${m.id === currentMakam.id}">
              <span class="mk-chip-ar" lang="ar">${m.names.ar}</span>
              <span class="mk-chip-tr">${m.names.tr}</span>
            </button>
          `).join('')}
        </div>

        <div class="akademi-card makam-station-card mk-station" id="makamDetail-${currentMakam.id}">
          <header class="mk-hero">
            <div class="mk-hero-text">
              <span class="mk-eyebrow">Makam</span>
              <h2 class="mk-title">${currentMakam.names.tr} <span lang="ar">${currentMakam.names.ar}</span></h2>
              <p class="mk-summary">${currentMakam.ruhiTesir || ''}</p>
              ${(currentMakam.tags || currentMakam.characterTags || []).length ? `<div class="mk-tags">${(currentMakam.tags || currentMakam.characterTags).slice(0, 4).map(t => `<span>${escapeMarkup(t)}</span>`).join('')}</div>` : ''}
            </div>
            <dl class="mk-facts">
              <div><dt>Karar perdesi</dt><dd>${kararName}</dd></div>
              <div><dt>Güçlü perde</dt><dd>${gucluName}</dd></div>
              <div><dt>Seyir</dt><dd>${seyirLabel}</dd></div>
            </dl>
          </header>

          <section class="mk-step">
            <div class="mk-step-num" aria-hidden="true">1</div>
            <div class="mk-step-body">
              <h3>Karar sesini duyun</h3>
              <p>Makamın bittiği perde (${kararName}) sürekli çalar. Bu sesi duyarak sesinizi makamın tonuna oturtun.</p>
              <div class="mk-drone">
                <button type="button" class="btn-makam-drone-toggle mk-drone-btn" id="btnToggleDrone">
                  <span class="drone-pulse-indicator" id="dronePulseDot" aria-hidden="true"></span>
                  <span id="droneBtnText">Karar sesini çal</span>
                </button>
                <span class="mk-drone-note">${kararName} · ${kararHz.toFixed(0)} Hz</span>
              </div>
            </div>
          </section>

          <section class="mk-step">
            <div class="mk-step-num" aria-hidden="true">2</div>
            <div class="mk-step-body">
              <h3>Perdeleri tek tek dinleyin</h3>
              <p>Makamın dizisi pesten tize sıralıdır. <strong>Karar</strong> ve <strong>güçlü</strong> perdeler işaretlidir.</p>
              <div class="mk-scale" role="list">
                ${cikiciDizi.map((abs, i) => {
                  const pHz = T ? T.hzOfDegree(abs, durakVal, kararHz) : kararHz * Math.pow(2, (abs - durakVal) / 53);
                  const pName = T ? (T.perdeAdi(abs) || ('Perde ' + abs)) : ('Perde ' + abs);
                  const pNote = T ? T.approxNote(abs) : { name: '', octave: '' };
                  const isDurak = abs === durakVal;
                  const isGuclu = abs === gucluVal;
                  return `
                    <button type="button" role="listitem" class="fret-key mk-perde ${isDurak ? 'is-durak' : ''} ${isGuclu ? 'is-guclu' : ''}" data-abs="${abs}" data-freq="${pHz}" title="${pName} · ${pNote.name}${pNote.octave}" style="--mk-step:${i}">
                      <span class="mk-perde-bar" aria-hidden="true"></span>
                      <span class="mk-perde-name">${pName}</span>
                      ${isDurak ? '<span class="mk-perde-role">Karar</span>' : (isGuclu ? '<span class="mk-perde-role">Güçlü</span>' : '')}
                    </button>`;
                }).join('')}
              </div>
            </div>
          </section>

          ${(currentMakam.motifs || []).length ? `
          <section class="mk-step">
            <div class="mk-step-num" aria-hidden="true">3</div>
            <div class="mk-step-body">
              <h3>Seyri takip edin</h3>
              <p>${seyirHint || 'Makamın tipik melodi cümleleri sırasıyla.'}</p>
              <ol class="mk-motifs">
                ${(currentMakam.motifs || []).map((motif, mIdx) => {
                  const title = motif.name?.tr || motif.title || motif.id;
                  const path = Array.isArray(motif.path) ? motif.path.map(p => (T ? (T.perdeAdi(p.abs) || p.abs) : p.abs)) : String(motif.pattern || '').split(/\s*[→➔-]\s*/).filter(Boolean);
                  return `
                    <li class="mk-motif">
                      <div class="mk-motif-head">
                        <span class="mk-motif-stage">${stageLabels[mIdx] || 'Cümle'}</span>
                        <span class="mk-motif-title">${escapeMarkup(title)}</span>
                      </div>
                      <div class="mk-motif-path">${path.map(p => `<span>${escapeMarkup(p)}</span>`).join('')}</div>
                      <button type="button" class="btn-play-motif mk-motif-play" data-motif-id="${motif.id}"><span>▶</span> Dinle</button>
                    </li>`;
                }).join('')}
              </ol>
            </div>
          </section>` : ''}

          ${(currentMakam.ezanGelenegi?.metin || currentMakam.ezanVakti || themes.length) ? `
          <details class="mk-more">
            <summary>Gelenek ve uyumlu âyet temaları</summary>
            <div class="mk-more-body">
              ${(currentMakam.ezanGelenegi?.metin || currentMakam.ezanVakti) ? `<p><strong>Ezan geleneği:</strong> ${currentMakam.ezanGelenegi?.metin || currentMakam.ezanVakti}</p>` : ''}
              ${themes.length ? `<p><strong>Uyumlu temalar:</strong> ${themes.join(' · ')}</p>` : ''}
              ${sources.length ? `<p class="mk-sources">Kaynak: ${sources.map(src => `<a href="${escapeMarkup(src.url)}" target="_blank" rel="noopener">${escapeMarkup(src.title || src.url)}</a>`).join(', ')}</p>` : ''}
            </div>
          </details>` : ''}
            </div>
          </div>

          <!-- Kaynaklı tilavet örnekleri ve âyet uygulaması -->
          <div class="makam-ayah-app-box" style="margin-top:1.75rem; padding-top:1.5rem; border-top:1px solid rgba(255,255,255,0.08);">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; margin-bottom:1rem;">
              <div>
                <h3 class="motifs-heading" style="margin:0;">Farklı Kârilerden Dinleme Örnekleri</h3>
                <p class="scale-note-hint" style="margin:0.25rem 0 0 0;">
                  Aynı makamı farklı okuyuşlarda dinleyip seyir ve ifade farklarını karşılaştır. Kayıt bağlantıları EveryAyah üzerinden açılır.
                </p>
              </div>
              <div style="display:flex; align-items:center; gap:0.65rem; flex-wrap:wrap;">
                <div class="makam-typography-toolbar" title="Arapça Hat Boyutunu Ayarla">
                  <span style="font-size:0.75rem; color:var(--accent-gold); font-weight:700;">Hat Boyutu:</span>
                  <button type="button" class="btn-font-resize" id="btnMakamFontDec" title="Yazıyı Küçült (A-)">A -</button>
                  <span id="makamFontScaleLabel" style="font-size:0.78rem; font-family:'JetBrains Mono',monospace; min-width:36px; text-align:center; color:#fff;">${Math.round(makamArabicFontScale * 100)}%</span>
                  <button type="button" class="btn-font-resize" id="btnMakamFontInc" title="Yazıyı Büyüt (A+)">A +</button>
                </div>
                <span class="makam-verified-pill">${examples.length} örnek · ${reciters.length} farklı kâri</span>
              </div>
            </div>

            <div class="makam-example-toolbar">
              <label for="makamReciterFilter">Kâriye göre filtrele</label>
              <select id="makamReciterFilter" aria-label="Dinleme örneklerini kâriye göre filtrele">
                <option value="all">Tüm kâriler (${examples.length} örnek)</option>
                ${reciters.map(([id, name]) => `<option value="${escapeMarkup(id)}">${escapeMarkup(name)}</option>`).join('')}
              </select>
              <span id="makamExampleCount" aria-live="polite">${examples.length} örnek gösteriliyor</span>
            </div>

            <!-- Global İstasyon Oynatıcı Paneli (Çalan Kayıt Bilgisi) -->
            <div id="makamGlobalPlayerBar" class="makam-global-player-bar" style="display:none;">
              <div class="makam-player-track-info">
                <span class="sound-wave-bars"><span></span><span></span><span></span><span></span></span>
                <div>
                  <div class="makam-player-now-playing" id="makamPlayerMakamName">${currentMakam.names.tr} Makamı Çalıyor</div>
                  <div class="makam-player-track-title" id="makamPlayerTrackTitle">—</div>
                </div>
              </div>
              <div class="makam-player-seek-wrap" id="makamSeekWrap" title="Zaman Çubuğuna Tıklayarak İleri / Geri Sarın">
                <div class="makam-player-seek-bar" id="makamProgressBar"></div>
              </div>
              <div class="makam-player-controls">
                <span class="makam-player-time" id="makamTimeDisplay">0:00 / 0:00</span>
                <button type="button" class="btn-akademi-secondary" id="btnMakamGlobalToggle" style="padding:0.4rem 0.8rem;">
                  <span>⏸</span> Duraklat
                </button>
                <button type="button" class="btn-akademi-secondary" id="btnMakamGlobalStop" style="padding:0.4rem 0.8rem;">
                  <span>⏹</span> Durdur
                </button>
              </div>
            </div>

            <!-- Âyet Kartları Listesi -->
            <div style="display:flex; flex-direction:column; gap:1.25rem;">
              ${examples.map((ex, idx) => `
                <div class="makam-ayah-card ${currentMakamAudioItem?.id === ex.id && makamAudioPlayer && !makamAudioPlayer.paused ? 'playing' : ''}" data-example-id="${ex.id}">
                  <div class="makam-ayah-top">
                    <div class="makam-ayah-qari-info">
                      <div class="makam-qari-avatar">${(ex.reciter || 'Kâri').split(' ').map(w => w[0]).join('').slice(0, 3)}</div>
                      <div>
                        <div class="makam-qari-name">${ex.reciter}</div>
                        <div class="makam-qari-title">${ex.reciterTitle || 'Makam İcracısı'} • <strong>${ex.text}</strong></div>
                      </div>
                    </div>
                    <span class="makam-example-pill">${ex.verificationStatus?.startsWith('candidate') ? 'Yeni aday · makam uzmanı teyidi bekliyor' : 'Dinleme kaydı · makam uzmanı teyidi bekliyor'}</span>
                  </div>

                  <!-- Âyet Arapça Metni & Türkçe Meali -->
                  <div class="makam-quran-box">
                    <div class="makam-arabic-verse" lang="ar" style="font-size: ${(2.2 * makamArabicFontScale).toFixed(2)}rem;">${ex.ayahTextAr || ''}</div>
                    <div class="makam-meal-verse">"${ex.ayahTextTr || ''}"</div>
                  </div>

                  <!-- Makam Analiz ve İcra Notu -->
                  <div class="makam-analysis-note">
                    <strong> Makam ve icra notu (uzman teyidi bekliyor):</strong> ${ex.makamAnalysis || 'Bu kaydın makam seyri uzman dinlemesiyle teyit edilmelidir.'}
                  </div>

                  <!-- Butonlar ve Kontroller -->
                  <div class="makam-ayah-actions">
                    <div style="display:flex; gap:0.65rem; align-items:center; flex-wrap:wrap;">
                      <button type="button" class="btn-akademi-primary btn-play-makam-ayah ${currentMakamAudioItem?.id === ex.id && makamAudioPlayer && !makamAudioPlayer.paused ? 'playing' : ''}" 
                        data-id="${ex.id}" 
                        data-url="${escapeMarkup(ex.audioUrl)}"
                        data-surah="${ex.surah}" 
                        data-ayah="${ex.ayah}" 
                        data-end-ayah="${ex.endAyah || ex.ayah}"
                        data-reciter="${ex.reciterId}"
                        data-reciter-name="${ex.reciter}"
                        data-text="${ex.text}"
                        data-makam="${currentMakam.names.tr}">
                        <span>▶</span> Makamlı Dinle
                      </button>
                      <button type="button" class="btn-akademi-secondary btn-mushaf-goto" 
                        data-surah="${ex.surah}" 
                        data-ayah="${ex.ayah}">
                        <span></span> Mushaf'ta Aç ve Takip Et
                      </button>
                    </div>
                    <span style="font-size:0.75rem; color:var(--text-muted); font-family:'JetBrains Mono',monospace;">
                      ${(ex.endAyah && ex.endAyah > ex.ayah) 
                        ? `${ex.surah}. Sûre : ${ex.ayah} - ${ex.endAyah}. Âyetler (Kesintisiz Pasaj)` 
                        : `${ex.surah}. Sûre : ${ex.ayah}. Âyet`}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Makam Geçişleri (Terkib ve Şedd) -->
          ${currentMakam.transitions && currentMakam.transitions.length > 0 ? `
            <section class="makam-transitions" aria-labelledby="makamTransitionsTitle">
              <h3 class="motifs-heading" id="makamTransitionsTitle">Buradan hangi makama geçilir?</h3>
              <p class="makam-transition-intro">Geçki kartları iki makam arasındaki ortak perdeyi gösterir. Bir hedef seçerek yeni makamın dizi, örnek ve kaynaklarını aç.</p>
              <div class="makam-transition-grid">
                ${currentMakam.transitions.map(tr => {
                  const target = MAKAMLAR.find(makam => makam.id === tr.to);
                  const description = typeof tr.description === 'string' ? tr.description : tr.description?.tr || '';
                  return `
                    <article class="makam-transition-card">
                      <div class="makam-transition-route">${escapeMarkup(currentMakam.names.tr)} <span aria-hidden="true">→</span> ${escapeMarkup(target?.names?.tr || tr.to || 'Makam')}</div>
                      <p><strong>Bağlantı perdesi:</strong> ${escapeMarkup(tr.via || 'Belirtilmemiş')}</p>
                      <p>${escapeMarkup(description)}</p>
                      ${target
                        ? `<button type="button" class="btn-makam-transition" data-transition-target="${escapeMarkup(target.id)}">Bu makama geç <span aria-hidden="true">→</span></button>`
                        : '<span class="makam-transition-unavailable">Hedef makam kataloğa eklenmemiş.</span>'}
                    </article>
                  `;
                }).join('')}
              </div>
            </section>
          ` : ''}

        </div>
      </div>
    `;

    const selectMakam = makamId => {
      if (!MAKAMLAR.some(makam => makam.id === makamId)) return;
      stopMakamAudio();
      window.TilavetAudioLab?.drone.stop();
      state.selectedMakam = makamId;
      saveState();
      renderMakamView();
      updateExecutiveBarAndDrawer('makam');
    };

    // 1. Makam Seçim Butonları
    container.querySelectorAll('.makam-nav-card, .makam-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        selectMakam(chip.getAttribute('data-makam'));
      });
    });

    container.querySelectorAll('.btn-makam-transition').forEach(button => {
      button.addEventListener('click', () => {
        selectMakam(button.getAttribute('data-transition-target'));
      });
    });

    const reciterFilter = document.getElementById('makamReciterFilter');
    const exampleCount = document.getElementById('makamExampleCount');
    reciterFilter?.addEventListener('change', () => {
      const selectedReciter = reciterFilter.value;
      let visibleCount = 0;
      container.querySelectorAll('.makam-ayah-card').forEach(card => {
        const example = examples.find(item => item.id === card.getAttribute('data-example-id'));
        const matches = selectedReciter === 'all' || example?.reciterId === selectedReciter || example?.reciter === selectedReciter;
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });
      if (exampleCount) exampleCount.textContent = `${visibleCount} örnek gösteriliyor`;
    });

    // 2. Drone Butonu
    const droneBtn = document.getElementById('btnToggleDrone');
    const dronePulseDot = document.getElementById('dronePulseDot');
    let isDronePlaying = false;
    droneBtn?.addEventListener('click', () => {
      if (!isDronePlaying) {
        window.TilavetAudioLab?.drone.start(kararHz, 'tanbur');
        isDronePlaying = true;
        droneBtn.classList.add('playing');
        dronePulseDot?.classList.add('active');
        const txt = document.getElementById('droneBtnText');
        if (txt) txt.textContent = "Karar sesini durdur";
        if (window.showToast) window.showToast(`${currentMakam.names.tr} Karar Sesi (${kararHz.toFixed(1)} Hz) çalıyor...`);
      } else {
        window.TilavetAudioLab?.drone.stop();
        isDronePlaying = false;
        droneBtn.classList.remove('playing');
        dronePulseDot?.classList.remove('active');
        const txt = document.getElementById('droneBtnText');
        if (txt) txt.textContent = "Karar sesini çal";
      }
    });

    // 3. 53-Koma Piyano & Fretboard Tuşları
    container.querySelectorAll('.fret-key, .piano-key').forEach(key => {
      key.addEventListener('click', () => {
        const freq = parseFloat(key.getAttribute('data-freq')) || 220;
        key.classList.add('key-active-pulse');
        setTimeout(() => key.classList.remove('key-active-pulse'), 400);
        window.TilavetAudioLab?.drone.playSingleNote(freq, 1.2);
      });
    });

    // 4. Seyir Motifi Dinleyicisi
    container.querySelectorAll('.btn-play-motif').forEach(btn => {
      btn.addEventListener('click', () => {
        const motifId = btn.getAttribute('data-motif-id');
        const motif = (currentMakam.motifs || []).find(m => m.id === motifId);
        const motifTitle = motif?.name?.tr || motif?.title || 'Motif';
        if (window.showToast) window.showToast(`${currentMakam.names.tr} makamı — ${motifTitle} icra ediliyor...`);
        if (!motif || !Array.isArray(motif.path)) return;

        let cumulativeDelay = 0;
        motif.path.forEach(step => {
          const stepHz = T ? T.hzOfDegree(step.abs, durakVal, kararHz) : kararHz * Math.pow(2, (step.abs - durakVal)/53);
          const dur = (step.beats || 1) * 0.45;
          setTimeout(() => {
            window.TilavetAudioLab?.drone.playSingleNote(stepHz, dur);
          }, cumulativeDelay * 1000);
          cumulativeDelay += dur + 0.05;
        });
      });
    });

    // 5. Kaynak URL'sini koruyan, çoklu âyet tilavet oynatıcısı
    function playMakamCurrentAyah() {
      if (!currentMakamAudioItem) return;
      const item = currentMakamAudioItem;
      const { surah, currentAyah, startAyah, endAyah, audioUrl, reciter, text, makamName } = item;
      let targetUrl;
      try {
        targetUrl = getMakamAyahAudioUrl(audioUrl, surah, currentAyah);
      } catch (error) {
        console.error('[Makam Audio] Geçersiz örnek ses kaynağı:', error);
        stopMakamAudio();
        if (window.showToast) window.showToast(`⚠ Makam örneğinin ses bağlantısı geçersiz (${surah}:${currentAyah}).`);
        return;
      }

      const player = new Audio();
      makamAudioPlayer = player;
      player.src = targetUrl;
      player.preload = 'auto';

      const timeDisplay = document.getElementById('makamTimeDisplay');
      const progBar = document.getElementById('makamProgressBar');

      player.ontimeupdate = () => {
        if (makamAudioPlayer === player && currentMakamAudioItem === item && player.duration) {
          if (timeDisplay) {
            const cur = formatAudioTime(player.currentTime);
            const dur = formatAudioTime(player.duration);
            const ayahSuffix = endAyah > startAyah ? ` [${currentAyah}/${endAyah}. Âyet]` : '';
            timeDisplay.textContent = `${cur} / ${dur}${ayahSuffix}`;
          }
          if (progBar) {
            const pct = (player.currentTime / player.duration) * 100;
            progBar.style.width = `${pct}%`;
          }
        }
      };

      player.onended = () => {
        if (makamAudioPlayer !== player || currentMakamAudioItem !== item) return;
        if (item.currentAyah < item.endAyah) {
          item.currentAyah++;
          const titleEl = document.getElementById('makamPlayerTrackTitle');
          if (titleEl) titleEl.textContent = `${item.reciter} — ${item.text} (${item.currentAyah}. Âyet)`;
          updateMakamAudioUI();
          playMakamCurrentAyah();
        } else {
          stopMakamAudio();
          if (window.showToast) window.showToast('Tilavet tamamlandı.');
        }
      };

      player.onerror = (e) => {
        if (makamAudioPlayer !== player || currentMakamAudioItem !== item) return;
        console.warn('[Makam Audio] Ayah çalma hatası:', targetUrl, e);
        stopMakamAudio();
        if (window.showToast) window.showToast(`⚠ Ses dosyasına ulaşılamadı (${surah}:${item.currentAyah}).`);
      };

      player.play().then(() => {
        if (makamAudioPlayer !== player || currentMakamAudioItem !== item) return;
        updateMakamAudioUI();
        const ayahPart = endAyah > startAyah ? ` (${startAyah}-${endAyah}. Âyetler Kesintisiz)` : '';
        if (currentAyah === startAyah && window.showToast) {
          window.showToast(` ${makamName} makamı dinleniyor: ${reciter} — ${text}${ayahPart}`);
        }
      }).catch(err => {
        if (err.name === 'AbortError' || makamAudioPlayer !== player || currentMakamAudioItem !== item) return;
        console.error('[Makam Audio Play Error]', err);
        stopMakamAudio();
        if (window.showToast) window.showToast(`⚠ Ses başlatılamadı (${surah}:${item.currentAyah}): ${err.message}`);
      });
    }

    container.querySelectorAll('.btn-play-makam-ayah').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const surah = parseInt(btn.getAttribute('data-surah'), 10) || 1;
        const ayah = parseInt(btn.getAttribute('data-ayah'), 10) || 1;
        const endAyah = parseInt(btn.getAttribute('data-end-ayah'), 10) || ayah;
        const audioUrl = btn.getAttribute('data-url');
        const reciterId = btn.getAttribute('data-reciter');
        const reciterName = btn.getAttribute('data-reciter-name');
        const text = btn.getAttribute('data-text');
        const makamName = btn.getAttribute('data-makam');

        // Aynı kayıt çalıyorsa duraklat / devam ettir
        if (currentMakamAudioItem && currentMakamAudioItem.id === id && makamAudioPlayer) {
          if (!makamAudioPlayer.paused) {
            makamAudioPlayer.pause();
            updateMakamAudioUI();
            if (window.showToast) window.showToast(`⏸ Tilavet duraklatıldı.`);
          } else {
            const player = makamAudioPlayer;
            player.play().then(() => {
              if (makamAudioPlayer !== player || currentMakamAudioItem?.id !== id) return;
              updateMakamAudioUI();
              if (window.showToast) window.showToast('▶ Tilavet devam ediyor.');
            }).catch(err => {
              if (err.name === 'AbortError' || makamAudioPlayer !== player || currentMakamAudioItem?.id !== id) return;
              console.error('[Makam Audio Resume Error]', err);
              stopMakamAudio();
              if (window.showToast) window.showToast(`⚠ Tilavet devam ettirilemedi: ${err.message}`);
            });
          }
          return;
        }

        // Farklı kayıt başlatılıyor
        stopMakamAudio();

        if (typeof window.TilavetAudioManager !== 'undefined') {
          window.TilavetAudioManager.notifyPlay('makam');
        }

        currentMakamAudioItem = {
          id,
          surah,
          audioUrl,
          startAyah: ayah,
          endAyah,
          currentAyah: ayah,
          reciterId,
          reciter: reciterName,
          text,
          makamName
        };

        playMakamCurrentAyah();
      });
    });

    // 6. Global Oynatıcı Kontrolleri & İlerleme Çubuğu (Scrubber)
    const seekWrap = document.getElementById('makamSeekWrap');
    seekWrap?.addEventListener('click', (e) => {
      if (!makamAudioPlayer || !makamAudioPlayer.duration) return;
      const rect = seekWrap.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      makamAudioPlayer.currentTime = pct * makamAudioPlayer.duration;
    });

    const globalToggleBtn = document.getElementById('btnMakamGlobalToggle');
    globalToggleBtn?.addEventListener('click', () => {
      if (!makamAudioPlayer) return;
      if (makamAudioPlayer.paused) {
        const player = makamAudioPlayer;
        player.play().then(() => {
          if (makamAudioPlayer === player) updateMakamAudioUI();
        }).catch(err => {
          if (err.name === 'AbortError' || makamAudioPlayer !== player) return;
          console.error('[Makam Audio Resume Error]', err);
          stopMakamAudio();
          if (window.showToast) window.showToast(`⚠ Tilavet devam ettirilemedi: ${err.message}`);
        });
      } else {
        makamAudioPlayer.pause();
      }
      updateMakamAudioUI();
    });

    const globalStopBtn = document.getElementById('btnMakamGlobalStop');
    globalStopBtn?.addEventListener('click', () => {
      stopMakamAudio();
      if (window.showToast) window.showToast(`⏹ Oynatma durduruldu.`);
    });

    // 7. Arapça Yazı Boyutu (A- / A+) Kontrolleri
    const fontIncBtn = document.getElementById('btnMakamFontInc');
    const fontDecBtn = document.getElementById('btnMakamFontDec');
    const fontLabel = document.getElementById('makamFontScaleLabel');

    fontIncBtn?.addEventListener('click', () => {
      makamArabicFontScale = Math.min(1.8, +(makamArabicFontScale + 0.1).toFixed(2));
      if (fontLabel) fontLabel.textContent = `${Math.round(makamArabicFontScale * 100)}%`;
      container.querySelectorAll('.makam-arabic-verse').forEach(el => {
        el.style.fontSize = `${(2.2 * makamArabicFontScale).toFixed(2)}rem`;
      });
    });

    fontDecBtn?.addEventListener('click', () => {
      makamArabicFontScale = Math.max(0.8, +(makamArabicFontScale - 0.1).toFixed(2));
      if (fontLabel) fontLabel.textContent = `${Math.round(makamArabicFontScale * 100)}%`;
      container.querySelectorAll('.makam-arabic-verse').forEach(el => {
        el.style.fontSize = `${(2.2 * makamArabicFontScale).toFixed(2)}rem`;
      });
    });

    // 8. Mushaf'ta Aç ve Takip Et Butonu
    container.querySelectorAll('.btn-mushaf-goto').forEach(btn => {
      btn.addEventListener('click', () => {
        const s = parseInt(btn.getAttribute('data-surah'), 10) || 1;
        const a = parseInt(btn.getAttribute('data-ayah'), 10) || 1;
        if (typeof window.locateAndSelectSurahAyah === 'function') {
          window.locateAndSelectSurahAyah(s, a);
        }
        if (typeof window.switchAppTab === 'function') {
          window.switchAppTab('tab-tilavet');
        }
        if (window.showToast) {
          window.showToast(` ${s}. Sûre ${a}. Âyete gidildi ve vurgulandı.`);
        }
      });
    });
  }

  // 5.6 ŞAN, SES EĞİTİMİ & VOKAL SAĞLIK
  const BREATH_PROGRESS_KEY = 'tilavet.breath-practice.v1';
  const BREATH_PRACTICES = [
    {
      id: 'easy-breath',
      icon: '',
      title: 'Rahat nefes ve yan kaburga farkındalığı',
      duration: '2 dakika',
      device: [
        'Ekrandaki ritim çemberinde “3 al / 4 ver” seçeneğini aç.',
        'Bir elini göğsüne, diğerini alt kaburgalarına koy; omuzlarını serbest bırak.',
        'Burnundan rahatça al, kaburgaların yana doğru hafifçe genişlediğini hisset; nefesini tutmadan yumuşakça ver.',
        '4–6 rahat turdan sonra dur. Daha derin veya uzun nefes almaya çalışma.'
      ],
      everyday: 'Sandalyede dik ama kasılmadan otur. Gün içinde kısa bir mola verdiğinde aynı rahat ritmi 3–4 tur uygula; nefes darlığı hissedersen egzersizi bırak.'
    },
    {
      id: 'pursed-lips',
      icon: '',
      title: 'Dudakları hafif büzerek nefes verme',
      duration: '1–2 dakika',
      device: [
        'Burundan küçük ve rahat bir nefes al; ciğerlerini sonuna kadar doldurmaya çalışma.',
        'Dudaklarını ıslık çalacakmış gibi nazikçe büz.',
        'Nefesi zorlamadan, aldığından biraz daha uzun sürede dışarı bırak.',
        '3–5 tur yap; baş dönmesi, göğüs sıkışması veya rahatsızlık olursa hemen dur.'
      ],
      everyday: 'Merdiven çıkarken veya yürürken temponu düşürüp rahatça nefes ver. Bu teknik bazı kişilerde nefes darlığını yönetmeye yardımcı olabilir; tedavi yerine geçmez.'
    },
    {
      id: 'gentle-voice',
      icon: '',
      title: 'Mırıldanma ile nefes–ses eşgüdümü',
      duration: '1 dakika',
      device: [
        'Rahat bir oturuşta, konuşma sesine yakın ve kolay bir perdede “mmm” diye yumuşakça mırıldan.',
        'Sesi yalnızca rahat nefesin sürdüğü kadar devam ettir; süre rekoru deneme.',
        '3 kısa tekrar yap, aralarda normal nefes al. İstersen mevcut vokal ısınma sekmesindeki yumuşak tonları kullan.'
      ],
      everyday: 'Günlük konuşmada cümleye başlamadan önce rahatça nefes al; cümle sonuna kadar havayı sıkıştırıp bitirmeye çalışma. Tilavette vakıf ve ibtidâ kurallarına uygun yerde nefes tazele.'
    },
    {
      id: 'daily-movement',
      icon: '',
      title: 'Günlük hayata aktarım',
      duration: '5–10 dakika · isteğe bağlı',
      device: [
        'Bugün için kısa bir not belirle: “Rahat tempo, doğal nefes, gerektiğinde mola.”',
        'İstersen 1–2 dakikalık rahat ses çalışmasından sonra kısa bir metni normal konuşma sesinde oku.',
        'Bir cümleyi tek nefeste bitirmeye çalışma; anlamlı ve uygun durakta durup nefes al.'
      ],
      everyday: 'Sağlık durumun ve günlük alışkanlığın uygunsa rahat tempolu kısa bir yürüyüş seç. Konuşamayacak kadar nefessiz kalma; zorlanma veya belirti olursa dur. Yeni egzersiz planını sağlık uzmanına danış.'
    }
  ];
  let breathStorageWarningShown = false;

  function readBreathPracticeProgress() {
    const today = new Date();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    try {
      const raw = window.localStorage.getItem(BREATH_PROGRESS_KEY);
      if (!raw) return { date, completed: new Set() };

      const saved = JSON.parse(raw);
      if (!saved || typeof saved.date !== 'string' || !Array.isArray(saved.completed)) {
        throw new Error('Nefes çalışması ilerleme verisi beklenen biçimde değil.');
      }
      return {
        date,
        completed: saved.date === date
          ? new Set(saved.completed.filter(id => BREATH_PRACTICES.some(practice => practice.id === id)))
          : new Set()
      };
    } catch (error) {
      console.error('Nefes çalışması ilerlemesi okunamadı:', error);
      if (!breathStorageWarningShown && window.showToast) {
        window.showToast('Bugünkü pratik ilerlemesi cihazdan okunamadı; rehberi kullanmaya devam edebilirsin.');
        breathStorageWarningShown = true;
      }
      return { date, completed: new Set() };
    }
  }

  function saveBreathPracticeProgress(progress) {
    try {
      window.localStorage.setItem(BREATH_PROGRESS_KEY, JSON.stringify({
        date: progress.date,
        completed: [...progress.completed]
      }));
      return true;
    } catch (error) {
      console.error('Nefes çalışması ilerlemesi kaydedilemedi:', error);
      if (window.showToast) window.showToast('İlerleme cihazına kaydedilemedi. Depolama iznini kontrol edip yeniden dene.');
      return false;
    }
  }

  function renderBreathPracticeCards(completed) {
    return BREATH_PRACTICES.map((practice, index) => `
      <article class="breath-practice-card">
        <div class="breath-practice-card-head">
          <span class="breath-practice-icon" aria-hidden="true">${practice.icon}</span>
          <span class="breath-practice-time">${practice.duration}</span>
        </div>
        <h3>${index + 1}. ${practice.title}</h3>
        <div class="breath-practice-instructions">
          <div>
            <h4> Cihazda uygula</h4>
            <ol>${practice.device.map(step => `<li>${step}</li>`).join('')}</ol>
          </div>
          <div>
            <h4> Günlük hayata taşı</h4>
            <p>${practice.everyday}</p>
          </div>
        </div>
        <button type="button" class="btn-akademi-secondary breath-practice-complete"
          data-breath-practice="${practice.id}" aria-pressed="${completed.has(practice.id)}">
          ${completed.has(practice.id) ? '✓ Bugün tamamlandı' : 'Bugün tamamlandı olarak işaretle'}
        </button>
      </article>
    `).join('');
  }

  function renderSanView() {
    const container = document.getElementById('akademi-view-san');
    if (!container) return;

    container.innerHTML = `
      <div class="san-layout-wrap">
        <!-- Alt Navigasyon Şeridi -->
        <div class="elifba-sub-nav" style="margin-bottom:1.25rem;">
          <button type="button" class="btn-elifba-sub ${activeSanTab === 'diyafram' ? 'active' : ''}" data-san-tab="diyafram">
            <span></span> Nefes Gücü &amp; Rehber
          </button>
          <button type="button" class="btn-elifba-sub ${activeSanTab === 'vokal-isinma' ? 'active' : ''}" data-san-tab="vokal-isinma">
            <span></span> Vokal Isınma Egzersizleri
          </button>
          <button type="button" class="btn-elifba-sub ${activeSanTab === 'register-rezonans' ? 'active' : ''}" data-san-tab="register-rezonans">
            <span></span> Ses Perdeleri &amp; Rezonans
          </button>
        </div>

        <div id="sanTabContent">
          ${renderSanSubContent()}
        </div>
      </div>
    `;

    // Alt sekme geçişi
    container.querySelectorAll('.btn-elifba-sub').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSanTab = btn.getAttribute('data-san-tab') || 'diyafram';
        renderSanView();
        updateExecutiveBarAndDrawer('san');
      });
    });

    attachSanInteractiveListeners(container);
  }

  function renderSanSubContent() {
    if (activeSanTab === 'diyafram') {
      return `
        ${renderBreathGuide()}
      `;
    }

    if (activeSanTab === 'vokal-isinma') {
      return `
        <div class="akademi-card vocal-exercises-card">
          <div class="card-headline">
            <span class="card-badge cyan">ISINMA RUTİNİ</span>
            <h2 class="card-title">Vokal Isınma ve Ses Egzersizleri</h2>
            <p class="card-desc">Tilavete başlamadan önce ses tellerini uyararak pürüzsüz tonlar elde edin ve kısıklığı önleyin:</p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:1.25rem; margin-top:1.5rem;">
            ${VOCAL_WARMUPS.map((w, idx) => `
              <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(229,184,105,0.25); border-radius:12px; padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:1.8rem;">${w.icon}</span>
                    <span class="card-badge gold" style="font-size:0.75rem;">⏱ ${w.duration}</span>
                  </div>
                  <h3 style="font-size:1.1rem; color:#f0f3fa; margin:0.6rem 0 0.3rem 0;">${w.title}</h3>
                  <div style="font-size:0.8rem; color:var(--accent-gold); font-weight:700; margin-bottom:0.5rem;">Fayda: ${w.benefit}</div>
                  <p style="font-size:0.83rem; color:#a0aec0; line-height:1.5; margin:0;">${w.instruction}</p>
                </div>
                <div style="margin-top:1.25rem; padding-top:0.75rem; border-top:1px solid rgba(255,255,255,0.06); display:flex; justify-content:flex-end;">
                  <button type="button" class="btn-sm-action btn-play-vocal-tone" data-exercise="${idx}" style="background:rgba(229,184,105,0.1); border-color:var(--accent-gold); color:var(--accent-gold);">
                    <span></span> Arpej Tonunu Başlat
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (activeSanTab === 'register-rezonans') {
      return `
        <div class="akademi-card register-card">
          <div class="card-headline">
            <span class="card-badge gold">AKUSTİK TINI BÖLGELERİ</span>
            <h2 class="card-title">Ses Perdeleri (Register) &amp; Rezonans Odakları</h2>
            <p class="card-desc">Tilavette sesin çatlamaması ve zengin tınlaması için kafa, göğüs ve mask rezonansı uyumu:</p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:1.25rem; margin-top:1.5rem;">
            <!-- Göğüs Sesi -->
            <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:1.25rem;">
              <span class="card-badge gold" style="font-size:0.72rem;">PES PERDELER</span>
              <h3 style="color:#f0f3fa; font-size:1.05rem; margin:0.4rem 0;">1. Göğüs Sesi (Modal / Chest Voice)</h3>
              <p style="font-size:0.83rem; color:#a0aec0; line-height:1.5;">Tilavetin karar perdeleri, istirahat cümleleri ve vakıflarda kullanılır. Ses telleri kalındır; göğüs kafesinde derin titreşim hissedilir.</p>
              <div style="font-size:0.76rem; color:var(--accent-gold); margin-top:0.5rem;">Örnek: Rast ve Bayati makamlarının karar zeminleri.</div>
            </div>

            <!-- Miks Ses -->
            <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(229,184,105,0.3); border-radius:10px; padding:1.25rem;">
              <span class="card-badge cyan" style="font-size:0.72rem;">ORTA TİZLER (EN ÖNEMLİ)</span>
              <h3 style="color:#f0f3fa; font-size:1.05rem; margin:0.4rem 0;">2. Karışık Ses (Voix Mixte / Mix Voice)</h3>
              <p style="font-size:0.83rem; color:#a0aec0; line-height:1.5;">Göğüs rezonansı ile kafa rezonansının birleştiği alandır. Kur'an tilavetinde tiz âyetlerin boğazı sıkmadan, parlak ve rahat okunmasını sağlar.</p>
              <div style="font-size:0.76rem; color:var(--accent-gold); margin-top:0.5rem;">Örnek: Minşâvî ve Abdülbâsıt'ın tiz meydan okuyuşları.</div>
            </div>

            <!-- Kafa Sesi -->
            <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:1.25rem;">
              <span class="card-badge alert" style="font-size:0.72rem;">EN TİZ PERDELER</span>
              <h3 style="color:#f0f3fa; font-size:1.05rem; margin:0.4rem 0;">3. Kafa Sesi (Head Voice) &amp; Falsetto</h3>
              <p style="font-size:0.83rem; color:#a0aec0; line-height:1.5;">Ses tellerinin yalnızca kenarlarının titreştiği en tiz alandır. Boşluk hissi vermemesi için nefes desteği daima korunmalıdır.</p>
              <div style="font-size:0.76rem; color:var(--accent-gold); margin-top:0.5rem;">Örnek: Hicaz ve Sabâ makamlarının tiz gezinmeleri.</div>
            </div>
          </div>

          <!-- Ses Sağlığı İlkeleri -->
          <div class="akademi-card vocal-health-card" style="margin-top:1.5rem; background:rgba(239,68,68,0.03); border:1px solid rgba(239,68,68,0.2);">
            <div class="card-headline">
              <span class="card-badge alert">SES SAĞLIĞI &amp; GÜVENLİK</span>
              <h3 class="card-title">Vokal Hijyen ve Koruma Kuralları</h3>
            </div>
            <div class="health-tips-grid">
              <div class="tip-card">
                <span class="tip-ico"></span>
                <div class="tip-h">Oda Sıcaklığında Su</div>
                <p class="tip-p">Ses tellerini nemli tutmak için tilavet öncesi ve esnasında bol su için; soğuk ve buzlu sudan kesinlikle kaçının.</p>
              </div>
              <div class="tip-card">
                <span class="tip-ico"></span>
                <div class="tip-h">Humming &amp; Dudak Titreşimi</div>
                <p class="tip-p">Boğazı zorlamadan 'Mmm' ve dudak trilleri (lip trill) ile ses tellerini ısıtın.</p>
              </div>
              <div class="tip-card">
                <span class="tip-ico"></span>
                <div class="tip-h">Ağrıda Dur Kuralı</div>
                <p class="tip-p">Boğazda yanma, gıcıklanma veya batma hissettiğiniz an tilaveti durdurun; fısıldamayın ve sesinizi dinlendirin.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return '';
  }

  function renderBreathGuide() {
    const progress = readBreathPracticeProgress();
    const completedCount = progress.completed.size;

    return `
      <div class="breath-guide">
        <section class="breath-guide-hero">
          <div>
            <span class="card-badge green">ŞAN · SES · NEFES</span>
            <h2 class="card-title">Nefes yönetimi ve güvenli ses dayanıklılığı</h2>
            <p class="card-desc">Cihazdaki ritim koçunu, adım adım ses çalışmalarını ve günlük hayata aktarım önerilerini tek yerde takip et.</p>
          </div>
          <div class="breath-progress-summary" aria-live="polite">
            <strong>${completedCount}/${BREATH_PRACTICES.length}</strong>
            <span>bugünkü çalışma</span>
          </div>
        </section>

        <aside class="breath-safety-note" role="note">
          <strong>Önce doğru beklenti:</strong> Nefes ve ses egzersizleri akciğer hacmini büyütmez; rahat nefes akışını, nefes–ses eşgüdümünü ve ses kullanım verimini çalıştırır. Bu ekran akciğer kapasitesini ölçmez ve tıbbi tedavi sunmaz; ölçüm için sağlık uzmanı spirometri gibi testleri değerlendirir. Astım/KOAH veya başka bir kalp-akciğer rahatsızlığın varsa egzersizi sağlık uzmanına danış. Baş dönmesi, göğüs ağrısı, artan nefes darlığı ya da ses/boğaz ağrısı olursa hemen dur; şiddetli veya dinlenirken süren nefes darlığında acil yardım al.
        </aside>

        <section class="breath-coach-panel" aria-labelledby="breathCoachHeading">
          <div class="breath-section-heading">
            <div>
              <span class="card-badge gold"> CİHAZDA REHBERLİ ÇALIŞMA</span>
              <h2 id="breathCoachHeading">Rahat nefes ritmi</h2>
              <p>Çemberi izleyerek nefesi zorlamadan alıp ver. Nefes tutma yok; sayılar yalnızca yumuşak bir tempo önerisidir.</p>
            </div>
            <div class="breath-pattern-picker" role="group" aria-label="Nefes ritmi seçimi">
              <button type="button" class="btn-akademi-secondary active" data-breath-pattern="gentle" aria-pressed="true">3 al · 4 ver</button>
              <button type="button" class="btn-akademi-secondary" data-breath-pattern="short" aria-pressed="false">2 al · 4 ver</button>
            </div>
          </div>

          <div class="breath-trainer-box">
            <div class="breath-circle-meter" id="breathCircle">
              <div class="breath-circle-inner">
                <span class="breath-counter" id="breathCounter">Hazır</span>
                <span class="breath-phase-label" id="breathPhaseLabel" role="status" aria-live="polite">Rahat olduğunda başla</span>
              </div>
            </div>
            <div class="breath-controls">
              <button type="button" class="btn-akademi-primary" id="btnStartBreath">▶ Ritmi başlat</button>
              <button type="button" class="btn-akademi-secondary" id="btnStopBreath">⏹ Durdur</button>
            </div>
            <p class="breath-coach-hint" id="breathCoachHint" role="status" aria-live="polite">4–6 rahat tur yeterlidir. Baş dönmesi veya rahatsızlık olursa dur ve normal nefesine dön.</p>
          </div>
        </section>

        <section class="breath-practices-section" aria-labelledby="breathPracticesHeading">
          <div class="breath-section-heading">
            <div>
              <span class="card-badge cyan"> EKRAN + GÜNLÜK HAYAT</span>
              <h2 id="breathPracticesHeading">Adım adım pratik rehberi</h2>
              <p>Her kartta önce cihazda nasıl çalışacağını, ardından bunu günlük yaşama nasıl taşıyacağını görürsün.</p>
            </div>
          </div>
          <div class="breath-practice-grid">${renderBreathPracticeCards(progress.completed)}</div>
        </section>

        <aside class="breath-balloon-note">
          <span aria-hidden="true"></span>
          <div>
            <strong>Balon şişirme neden programa ekli değil?</strong>
            <p>Balon şişirmek akciğer kapasitesini artırdığı kanıtlanmış bir egzersiz değildir; kişiye göre değişen direnç gereksiz zorlanma veya baş dönmesi yaratabilir. Bu rehberde alternatif olarak suya sokulmayan bir pipetle, rahat perdede kısa “uuu” sesi (3 × 5 saniye) kullanılabilir; pipete kuvvetle üfleme. Ses şikâyetinde bunu ses terapistine danış.</p>
          </div>
        </aside>

        <div class="breath-reference-links">
          <strong>Kaynak ve sınırlar:</strong>
          <a href="https://www.lung.org/lung-health-diseases/wellness/breathing-exercises" target="_blank" rel="noopener noreferrer">American Lung Association — dudak büzerek nefes verme</a>
          <a href="https://www.lung.org/lung-health-diseases/lung-procedures-and-tests/lung-function-tests" target="_blank" rel="noopener noreferrer">Akciğer işlevi testleri</a>
          <span>Bu genel eğitim rehberi kişisel değerlendirme veya tedavi yerine geçmez.</span>
        </div>
      </div>
    `;
  }

  function attachSanInteractiveListeners(container) {
    const startBtn = document.getElementById('btnStartBreath');
    const stopBtn = document.getElementById('btnStopBreath');
    const counterEl = document.getElementById('breathCounter');
    const labelEl = document.getElementById('breathPhaseLabel');
    const circleEl = document.getElementById('breathCircle');
    const coachHint = document.getElementById('breathCoachHint');
    let selectedBreathPattern = 'gentle';

    container.querySelectorAll('[data-breath-pattern]').forEach(button => {
      button.addEventListener('click', () => {
        selectedBreathPattern = button.getAttribute('data-breath-pattern') === 'short' ? 'short' : 'gentle';
        container.querySelectorAll('[data-breath-pattern]').forEach(option => {
          const selected = option === button;
          option.classList.toggle('active', selected);
          option.setAttribute('aria-pressed', String(selected));
        });
        if (window.TilavetAudioLab?.breathCoach?.isRunning) {
          window.TilavetAudioLab.breathCoach.stop();
        }
        if (counterEl) counterEl.textContent = 'Hazır';
        if (labelEl) labelEl.textContent = 'Rahat olduğunda başla';
        if (circleEl) circleEl.className = 'breath-circle-meter';
        if (coachHint) coachHint.textContent = selectedBreathPattern === 'short'
          ? '2 saniye rahatça al, 4 saniyede yumuşakça ver. Zorlanırsan sayıları takip etme.'
          : '3 saniye rahatça al, 4 saniyede yumuşakça ver. Zorlanırsan sayıları takip etme.';
      });
    });

    startBtn?.addEventListener('click', () => {
      const coach = window.TilavetAudioLab?.breathCoach;
      if (!coach) {
        if (window.showToast) window.showToast('Nefes ritmi koçu yüklenemedi. Sayfayı yenileyip yeniden dene.');
        else console.error('Nefes ritmi koçu yüklenemedi.');
        return;
      }
      coach.stop();
      coach.start((data) => {
        if (!counterEl || !labelEl) return;
        counterEl.textContent = `${data.seconds} sn`;
        labelEl.textContent = data.text;

        circleEl.className = 'breath-circle-meter';
        if (data.phase === 'inhale') circleEl.classList.add('inhale');
        else if (data.phase === 'exhale') circleEl.classList.add('exhale');
      }, selectedBreathPattern);
    });

    stopBtn?.addEventListener('click', () => {
      window.TilavetAudioLab?.breathCoach.stop();
      if (counterEl) counterEl.textContent = "Hazır";
      if (labelEl) labelEl.textContent = "Rahat olduğunda başla";
      if (circleEl) circleEl.className = 'breath-circle-meter';
    });

    container.querySelectorAll('[data-breath-practice]').forEach(button => {
      button.addEventListener('click', () => {
        const progress = readBreathPracticeProgress();
        const practiceId = button.getAttribute('data-breath-practice');
        if (!BREATH_PRACTICES.some(practice => practice.id === practiceId)) return;
        if (progress.completed.has(practiceId)) progress.completed.delete(practiceId);
        else progress.completed.add(practiceId);
        if (saveBreathPracticeProgress(progress)) renderSanView();
      });
    });

    // Vokal arpej üreteci
    container.querySelectorAll('.btn-play-vocal-tone').forEach(btn => {
      btn.addEventListener('click', () => {
        const exIdx = parseInt(btn.getAttribute('data-exercise'), 10) || 0;
        const freqs = [
          [220, 277.18, 329.63, 440, 329.63, 277.18, 220], // Lip trill arpej
          [196, 246.94, 293.66, 392],                      // Humming rezonans
          [174.61, 220, 261.63, 349.23, 440],              // Sirene
          [220, 220, 220, 220]                             // Staccato darbeler
        ][exIdx] || [220, 277, 330, 440];

        if (window.showToast) window.showToast(" Vokal egzersiz tonu icra ediliyor...");
        freqs.forEach((f, i) => {
          setTimeout(() => {
            if (window.TilavetAudioLab?.drone) {
              window.TilavetAudioLab.drone.playSingleNote(f, 0.4);
            }
          }, i * 380);
        });
      });
    });
  }

  // 5.7 DİNLEME SALONU (KURRÂ KÜTÜPHANESİ, EKOLLER & İNTERAKTİF SES STÜDYOSU)
  let loungeState = {
    selectedSurah: 1,
    currentAyah: 1,
    activeReciterId: 'minshawi',
    mode: 'continuous', // 'continuous' (kesintisiz sûre) | 'single' (tek âyet meşk)
    isPlaying: false,
    rate: 1.0,
    volume: 1.0,
    searchQuery: '',
    currentAyahTextAr: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    currentAyahMealTr: "Rahmân ve Rahîm olan Allah'ın adıyla.",
    audio: null
  };

  // Merkezi ses yöneticisine Dinleme Salonunu kaydet
  if (typeof window.TilavetAudioManager !== 'undefined') {
    window.TilavetAudioManager.register('dinleme_lounge', {
      stop: () => {
        if (loungeState.audio) {
          try {
            loungeState.audio.onplay = null;
            loungeState.audio.onended = null;
            loungeState.audio.ontimeupdate = null;
            loungeState.audio.onerror = null;
            loungeState.audio.pause();
            loungeState.audio.removeAttribute('src');
          } catch(e) {}
          loungeState.audio = null;
        }
        loungeState.isPlaying = false;
        updateLoungePlayerUI();
      },
      category: 'lounge'
    });
  }

  let loungeAyahRequestId = 0;

  // Dinleme Salonu Sesi Başlat
  // Kayıt erişilebilirliği: bazı kârilerin bazı sûreleri kaynakta yok (ör. Mustafa İsmail).
  const loungeAvail = new Map();
  function paintLoungeAvailability() {
    const s = loungeState.selectedSurah || 1;
    document.querySelectorAll('#akademi-view-dinleme .reciter-profile-card').forEach(card => {
      const ok = loungeAvail.get(`${card.dataset.id}:${s}`);
      card.classList.toggle('is-unavailable', ok === false);
      const btn = card.querySelector('.btn-listen-reciter');
      if (btn) {
        btn.disabled = ok === false;
        btn.title = ok === false ? 'Bu kârinin seçili sûre kaydı yok' : '';
      }
      let note = card.querySelector('.v5-unavail-note');
      if (ok === false && !note) {
        note = document.createElement('p');
        note.className = 'v5-unavail-note';
        note.textContent = 'Bu sûrenin kaydı bu kâride bulunmuyor.';
        card.appendChild(note);
      }
      if (ok !== false && note) note.remove();
    });
  }
  function probeLoungeAvailability() {
    const s = loungeState.selectedSurah || 1;
    if (typeof window.getAyahAudioUrl !== 'function') return;
    RECITERS.forEach(rec => {
      const k = `${rec.id}:${s}`;
      if (loungeAvail.has(k)) return;
      const url = window.getAyahAudioUrl(s, 1, rec.id);
      if (!url) return;
      loungeAvail.set(k, null);
      const probe = new Audio();
      probe.preload = 'metadata';
      probe.onloadedmetadata = () => { loungeAvail.set(k, true); paintLoungeAvailability(); probe.removeAttribute('src'); };
      probe.onerror = () => { loungeAvail.set(k, false); paintLoungeAvailability(); };
      probe.src = url;
    });
    paintLoungeAvailability();
  }

  function playLoungeRecitation(surahNo, ayahNo, reciterId, isAutoNext = false) {
    if (typeof window.TilavetAudioManager !== 'undefined') {
      window.TilavetAudioManager.notifyPlay('dinleme_lounge');
    }

    if (loungeState.audio) {
      try {
        loungeState.audio.onplay = null;
        loungeState.audio.onended = null;
        loungeState.audio.ontimeupdate = null;
        loungeState.audio.onerror = null;
        loungeState.audio.pause();
        loungeState.audio.removeAttribute('src');
      } catch (e) {}
      loungeState.audio = null;
    }

    loungeState.selectedSurah = surahNo;
    loungeState.currentAyah = ayahNo;
    loungeState.activeReciterId = reciterId || loungeState.activeReciterId || 'minshawi';

    const recObj = (RECITERS.find(r => r.id === loungeState.activeReciterId)) ||
      (typeof window.RECITERS !== 'undefined' && window.RECITERS[loungeState.activeReciterId]);
    if (!recObj) {
      loungeState.isPlaying = false;
      updateLoungePlayerUI();
      if (window.showToast) window.showToast('Seçilen kâri için kayıt kataloğu bulunamadı.');
      return;
    }

    let audioUrl = '';
    if (typeof window.getAyahAudioUrl === 'function') {
      audioUrl = window.getAyahAudioUrl(surahNo, ayahNo, loungeState.activeReciterId);
    } else if (recObj.folder) {
      const pad3 = n => String(n).padStart(3, '0');
      audioUrl = `https://everyayah.com/data/${recObj.folder}/${pad3(surahNo)}${pad3(ayahNo)}.mp3`;
    }

    if (typeof audioUrl !== 'string' || !audioUrl.trim()) {
      loungeState.isPlaying = false;
      updateLoungePlayerUI();
      if (window.showToast) window.showToast('Seçilen sûre için bu kârinin ses kaydı mevcut değil.');
      return;
    }

    const recName = recObj.name || 'Seçili Kâri';

    // Ayet metnini ve mealini güncelle
    fetchLoungeAyahText(surahNo, ayahNo);

    if (window.showToast && !isAutoNext) {
      const sObj = (window.SURAH_LIST || []).find(s => s.no === surahNo);
      const sName = sObj ? sObj.name : `${surahNo}. Sûre`;
      window.showToast(` ${recName} · ${sName} ${ayahNo}. Âyet çalınıyor...`);
    }

    const player = new Audio();
    player.preload = 'auto';
    player.playbackRate = loungeState.rate || 1.0;
    player.volume = loungeState.volume || 1.0;
    player.preservesPitch = true;
    player.mozPreservesPitch = true;
    player.webkitPreservesPitch = true;
    player.src = audioUrl;
    loungeState.audio = player;

    player.onplay = () => {
      loungeState.isPlaying = true;
      updateLoungePlayerUI();
    };

    player.onended = () => {
      const surahs = window.SURAH_LIST || [];
      const sMeta = surahs.find(s => s.no === loungeState.selectedSurah) || { ayahs: 7 };
      if (loungeState.mode === 'continuous' && loungeState.currentAyah < sMeta.ayahs) {
        loungeState.currentAyah++;
        playLoungeRecitation(loungeState.selectedSurah, loungeState.currentAyah, loungeState.activeReciterId, true);
      } else {
        loungeState.isPlaying = false;
        updateLoungePlayerUI();
        if (window.showToast && loungeState.mode === 'continuous') {
          window.showToast('Sûre tilâveti başarıyla tamamlandı.');
        }
      }
    };

    player.ontimeupdate = () => {
      const seek = document.getElementById('loungeProgress');
      const curLbl = document.getElementById('loungeCurTime');
      const durLbl = document.getElementById('loungeDurTime');
      if (seek && player.duration) {
        seek.value = String((player.currentTime / player.duration) * 100);
      }
      const fmt = (sec) => {
        if (!sec || isNaN(sec)) return '00:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      };
      if (curLbl) curLbl.textContent = fmt(player.currentTime);
      if (durLbl) durLbl.textContent = fmt(player.duration);
    };

    player.onerror = () => {
      if (loungeState.audio !== player) return;
      loungeState.isPlaying = false;
      loungeAvail.set(`${loungeState.activeReciterId}:${surahNo}`, false);
      paintLoungeAvailability();
      updateLoungePlayerUI();
      if (window.showToast) window.showToast(`${recName} için ${surahNo}. sûrenin kaydı bulunamadı. Başka bir kâri seçin.`);
    };

    player.play().catch(e => {
      if (loungeState.audio !== player) return;
      console.error('Dinleme Salonu ses oynatımı başlatılamadı:', e);
      loungeState.isPlaying = false;
      updateLoungePlayerUI();
      if (window.showToast) window.showToast('Ses oynatımı başlatılamadı. Tarayıcı izinlerini kontrol edin.');
    });

    updateLoungePlayerUI();
  }

  // Âyet metni ve meali çekme
  async function fetchLoungeAyahText(surahNo, ayahNo) {
    const requestId = ++loungeAyahRequestId;
    const arEl = document.getElementById('loungeAyahArabic');
    const trEl = document.getElementById('loungeAyahMeal');
    if (arEl) arEl.textContent = 'Ayet metni yükleniyor…';
    if (trEl) trEl.textContent = '';

    try {
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNo}:${ayahNo}/editions/quran-uthmani,tr.diyanet`);
      if (!res.ok) throw new Error(`Ayet kaynağı HTTP ${res.status} yanıtı verdi.`);

      const json = await res.json();
      if (json.code !== 200 || !Array.isArray(json.data) || json.data.length < 2) {
        throw new Error('Ayet kaynağından beklenen metin alanları alınamadı.');
      }

      const [quran, meal] = json.data;
      if (typeof quran?.text !== 'string' || !quran.text.trim() ||
          typeof meal?.text !== 'string' || !meal.text.trim()) {
        throw new Error('Ayet metni veya meal eksik.');
      }

      if (requestId !== loungeAyahRequestId) return;
      loungeState.currentAyahTextAr = quran.text;
      loungeState.currentAyahMealTr = meal.text;
      if (arEl) arEl.textContent = quran.text;
      if (trEl) trEl.textContent = meal.text;
    } catch (error) {
      if (requestId !== loungeAyahRequestId) return;
      console.error('Dinleme Salonu ayet metni yüklenemedi:', error);
      loungeState.currentAyahTextAr = '';
      loungeState.currentAyahMealTr = '';
      if (arEl) arEl.textContent = 'Ayet metni yüklenemedi.';
      if (trEl) trEl.textContent = 'Kaynak metne şu anda erişilemiyor. Lütfen bağlantıyı kontrol edip yeniden deneyin.';
    }
  }

  // UI Güncelleme Fonksiyonu
  function updateLoungePlayerUI() {
    const playBtn = document.getElementById('loungePlayPauseBtn');
    const waveBox = document.getElementById('loungeWaveform');
    const titleEl = document.getElementById('loungePlayingTitle');
    const metaEl = document.getElementById('loungePlayingMeta');
    const avatarEl = document.getElementById('loungeMiniAvatar');

    if (playBtn) {
      playBtn.innerHTML = loungeState.isPlaying ? '⏸' : '▶';
      playBtn.setAttribute('title', loungeState.isPlaying ? 'Duraklat' : 'Oynat');
    }
    if (waveBox) {
      if (loungeState.isPlaying) waveBox.classList.add('playing');
      else waveBox.classList.remove('playing');
    }

    const recObj = (RECITERS.find(r => r.id === loungeState.activeReciterId)) ||
      (typeof window.RECITERS !== 'undefined' && window.RECITERS[loungeState.activeReciterId]) ||
      { name: 'Seçili Kâri', avatarText: 'KR' };
    const surahs = window.SURAH_LIST || [];
    const sObj = surahs.find(s => s.no === loungeState.selectedSurah) || { name: `${loungeState.selectedSurah}. Sûre` };

    if (titleEl) titleEl.textContent = `${recObj.name || 'Usta Kâri'}`;
    if (metaEl) metaEl.textContent = `${sObj.name} Sûresi · ${loungeState.currentAyah}. Âyet (${loungeState.mode === 'continuous' ? 'Kesintisiz Akış' : 'Tek Âyet Meşki'})`;
    if (avatarEl) avatarEl.textContent = recObj.avatarText || 'KR';

    // Aktif çalan kartı vurgula
    document.querySelectorAll('.reciter-profile-card').forEach(card => {
      const id = card.getAttribute('data-id');
      if (id === loungeState.activeReciterId && loungeState.isPlaying) {
        card.classList.add('active-playing');
      } else {
        card.classList.remove('active-playing');
      }
    });
  }

  function renderDinlemeView() {
    const container = document.getElementById('akademi-view-dinleme');
    if (!container) return;

    // Filtreleme
    let filteredReciters = RECITERS;
    if (activeReciterSchool === 'misir') {
      filteredReciters = RECITERS.filter(r => (r.school || '').toLowerCase() === 'misir');
    } else if (activeReciterSchool === 'haremeyn' || activeReciterSchool === 'hicaz') {
      filteredReciters = RECITERS.filter(r => (r.school || '').toLowerCase() === 'hicaz' || (r.school || '').toLowerCase() === 'haremeyn');
    } else if (activeReciterSchool === 'turk') {
      filteredReciters = RECITERS.filter(r => (r.school || '').toLowerCase() === 'turk');
    }

    // Arama filtresi
    if (loungeState.searchQuery.trim()) {
      const q = loungeState.searchQuery.toLowerCase();
      filteredReciters = filteredReciters.filter(r =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.bio || '').toLowerCase().includes(q) ||
        (r.style || '').toLowerCase().includes(q) ||
        (r.famousMakams || []).some(m => m.toLowerCase().includes(q))
      );
    }

    const surahs = window.SURAH_LIST || [
      { no: 1, name: "Fâtiha", arabic: "الفاتحة", ayahs: 7 },
      { no: 2, name: "Bakara", arabic: "البقرة", ayahs: 286 },
      { no: 36, name: "Yâsîn", arabic: "يس", ayahs: 83 },
      { no: 55, name: "Rahmân", arabic: "الرحمن", ayahs: 78 },
      { no: 67, name: "Mülk", arabic: "الملك", ayahs: 30 },
      { no: 78, name: "Nebe", arabic: "النبإ", ayahs: 40 },
      { no: 112, name: "İhlâs", arabic: "الإخلاص", ayahs: 4 }
    ];

    const currentSurahMeta = surahs.find(s => s.no === loungeState.selectedSurah) || surahs[0];
    const recObj = (RECITERS.find(r => r.id === loungeState.activeReciterId)) || { name: 'Seçili Kâri', avatarText: 'KR' };

    container.innerHTML = `
      <div class="dinleme-layout-wrap">
        
        <!-- 1. MASTER TİLAVET & DİNLEME İSTASYONU -->
        <div class="lounge-master-station">
          <div class="card-headline" style="margin-bottom:1rem;">
            <div>
              <div class="badge-row">
                <span class="card-badge gold">TİLAVET MEŞK &amp; DİNLEME SALONU</span>
                <span class="card-badge cyan">Fem-i Muhsin Geleneği</span>
                <span class="card-badge emerald">114 Sûre &amp; Kesintisiz Akış</span>
              </div>
              <h2 class="card-title" style="margin-top:0.35rem;">Kurrâ Meclisi &amp; Kıraat Etüt Merkezi</h2>
              <p class="card-desc">Usta ağızlardan Kur'an tilavetini dinleyin; mahreç, tecvid ve makam kulağınızı geliştirin. Sûrenizi seçin, ister âyet âyet meşk edin, ister kesintisiz tilavet akışını başlatın.</p>
            </div>
          </div>

          <!-- Sûre & Âyet & Mod Seçim Konsolu -->
          <div class="lounge-console-grid">
            <div>
              <div class="lounge-selector-row">
                <div>
                  <label style="display:block; font-size:0.75rem; color:#94a3b8; margin-bottom:4px; font-weight:600;">DİNLENECEK SÛRE (114 SÛRE):</label>
                  <select id="loungeSurahSelect" class="lounge-select" style="min-width:260px;">
                    ${surahs.map(s => `
                      <option value="${s.no}" ${s.no === loungeState.selectedSurah ? 'selected' : ''}>
                        ${s.no}. ${s.name} (${s.arabic || ''}) · ${s.ayahs} Âyet
                      </option>
                    `).join('')}
                  </select>
                </div>

                <div>
                  <label style="display:block; font-size:0.75rem; color:#94a3b8; margin-bottom:4px; font-weight:600;">BAŞLANGIÇ ÂYETİ:</label>
                  <select id="loungeAyahSelect" class="lounge-select" style="min-width:110px;">
                    ${Array.from({ length: currentSurahMeta.ayahs || 7 }, (_, i) => i + 1).map(a => `
                      <option value="${a}" ${a === loungeState.currentAyah ? 'selected' : ''}>${a}. Âyet</option>
                    `).join('')}
                  </select>
                </div>

                <div>
                  <label style="display:block; font-size:0.75rem; color:#94a3b8; margin-bottom:4px; font-weight:600;">OYNATMA MODU:</label>
                  <select id="loungeModeSelect" class="lounge-select" style="min-width:170px;">
                    <option value="continuous" ${loungeState.mode === 'continuous' ? 'selected' : ''}> Kesintisiz Sûre Akışı</option>
                    <option value="single" ${loungeState.mode === 'single' ? 'selected' : ''}> Tek Âyet (Meşk Tekrarı)</option>
                  </select>
                </div>
              </div>

              <!-- Hızlı Popüler Sûre Hapları -->
              <div class="lounge-quick-pills">
                <span style="font-size:0.75rem; color:#94a3b8; align-self:center; margin-right:4px;">Hızlı Erişim:</span>
                <button type="button" class="lounge-pill-btn ${loungeState.selectedSurah === 1 ? 'active' : ''}" data-surah="1">1. Fâtiha</button>
                <button type="button" class="lounge-pill-btn ${loungeState.selectedSurah === 36 ? 'active' : ''}" data-surah="36">36. Yâsîn</button>
                <button type="button" class="lounge-pill-btn ${loungeState.selectedSurah === 55 ? 'active' : ''}" data-surah="55">55. Rahmân</button>
                <button type="button" class="lounge-pill-btn ${loungeState.selectedSurah === 56 ? 'active' : ''}" data-surah="56">56. Vâkıa</button>
                <button type="button" class="lounge-pill-btn ${loungeState.selectedSurah === 67 ? 'active' : ''}" data-surah="67">67. Mülk</button>
                <button type="button" class="lounge-pill-btn ${loungeState.selectedSurah === 78 ? 'active' : ''}" data-surah="78">78. Nebe</button>
                <button type="button" class="lounge-pill-btn ${loungeState.selectedSurah === 93 ? 'active' : ''}" data-surah="93">93. Duhâ</button>
                <button type="button" class="lounge-pill-btn ${loungeState.selectedSurah === 112 ? 'active' : ''}" data-surah="112">112. İhlâs</button>
              </div>
            </div>

            <!-- Ana Dinle Butonu -->
            <div>
              <button type="button" id="loungeMainStartBtn" class="btn-akademi-primary" style="padding:0.85rem 1.4rem; font-size:1rem; box-shadow:0 6px 18px rgba(229,184,105,0.35);">
                <span>${loungeState.isPlaying ? '⏸' : '▶'}</span> ${currentSurahMeta.name} Dinle
              </button>
            </div>
          </div>

          <!-- 2. AKTİF STÜDYO OYNATICI KONSOLU -->
          <div class="lounge-player-panel">
            <div class="lounge-player-header">
              <div class="lounge-now-playing">
                <div id="loungeMiniAvatar" class="lounge-reciter-mini-avatar">${recObj.avatarText || 'KR'}</div>
                <div class="lounge-playing-text">
                  <h4 id="loungePlayingTitle">${recObj.name || 'Muhammed Sıddîk el-Minşâvî'}</h4>
                  <p id="loungePlayingMeta">${currentSurahMeta.name} Sûresi · ${loungeState.currentAyah}. Âyet (${loungeState.mode === 'continuous' ? 'Kesintisiz Akış' : 'Tek Âyet Meşki'})</p>
                </div>
              </div>

              <!-- Görsel Spektrum Çubukları -->
              <div id="loungeWaveform" class="lounge-waveform ${loungeState.isPlaying ? 'playing' : ''}">
                <div class="lounge-wave-bar"></div>
                <div class="lounge-wave-bar"></div>
                <div class="lounge-wave-bar"></div>
                <div class="lounge-wave-bar"></div>
                <div class="lounge-wave-bar"></div>
                <div class="lounge-wave-bar"></div>
                <div class="lounge-wave-bar"></div>
                <div class="lounge-wave-bar"></div>
              </div>
            </div>

            <!-- Zaman İlerleme Çubuğu -->
            <div class="lounge-progress-container">
              <span id="loungeCurTime">00:00</span>
              <input type="range" id="loungeProgress" class="lounge-progress-range" min="0" max="100" value="0" />
              <span id="loungeDurTime">00:00</span>
            </div>

            <!-- Oynatıcı Kontrolleri (İleri/Geri/Hız/Ses) -->
            <div class="lounge-controls-row">
              <div class="lounge-main-buttons">
                <button type="button" id="loungePrevAyahBtn" class="lounge-ctrl-btn" title="Önceki Âyet">⏮</button>
                <button type="button" id="loungePlayPauseBtn" class="lounge-ctrl-btn play-master" title="${loungeState.isPlaying ? 'Duraklat' : 'Oynat'}">
                  ${loungeState.isPlaying ? '⏸' : '▶'}
                </button>
                <button type="button" id="loungeNextAyahBtn" class="lounge-ctrl-btn" title="Sonraki Âyet">⏭</button>
                <button type="button" id="loungeStopBtn" class="lounge-ctrl-btn" title="Durdur">⏹</button>
              </div>

              <div style="display:flex; align-items:center; gap:0.9rem; flex-wrap:wrap;">
                <!-- Hız Kontrolü -->
                <div style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; color:#cbd5e1;">
                  <span>⚡ Hız:</span>
                  <select id="loungeRateSelect" class="lounge-select" style="padding:0.25rem 0.6rem; font-size:0.8rem;">
                    <option value="0.75" ${loungeState.rate === 0.75 ? 'selected' : ''}>0.75x (Ağır Tahkîk)</option>
                    <option value="1.0" ${loungeState.rate === 1.0 ? 'selected' : ''}>1.0x (Normal)</option>
                    <option value="1.25" ${loungeState.rate === 1.25 ? 'selected' : ''}>1.25x (Akıcı Hadr)</option>
                  </select>
                </div>

                <!-- Ses Kontrolü -->
                <div style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; color:#cbd5e1;">
                  <span> Ses:</span>
                  <input type="range" id="loungeVolumeRange" min="0" max="1" step="0.05" value="${loungeState.volume}" style="width:80px; accent-color:var(--accent-gold);" />
                </div>
              </div>
            </div>

            <!-- Canlı Dinlenen Âyet Metni & Meali -->
            <div class="lounge-current-ayah-card">
              <div id="loungeAyahArabic" class="lounge-current-ayah-arabic">${loungeState.currentAyahTextAr}</div>
              <div id="loungeAyahMeal" class="lounge-current-ayah-meal">${loungeState.currentAyahMealTr}</div>
            </div>
          </div>
        </div>

        <!-- 3. KÂRİLER GALERİSİ & EKOLLER -->
        <div class="akademi-card reciters-card">
          <div class="card-headline">
            <div>
              <div class="badge-row">
                <span class="card-badge gold">KURRÂ ARŞİVİ</span>
                <span class="card-badge cyan">${filteredReciters.length} Büyük Kâri</span>
              </div>
              <h3 class="card-title">Üstat Kâriler &amp; Tilavet Tavırları</h3>
              <p class="card-desc">İslam dünyasının en büyük kurrâlarını kendi ekol ve makam zenginlikleriyle dinleyin:</p>
            </div>

            <!-- Ekol Filtre Butonları & Arama Çubuğu -->
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; margin-top:1rem;">
              <div class="reciter-filter-strip" style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                <button type="button" class="btn-reciter-filter ${activeReciterSchool === 'all' ? 'active' : ''}" data-school="all" style="padding:0.4rem 0.8rem; border-radius:8px; font-size:0.8rem; cursor:pointer; background:${activeReciterSchool === 'all' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)'}; color:${activeReciterSchool === 'all' ? '#07090e' : '#cbd5e1'}; font-weight:${activeReciterSchool === 'all' ? '700' : '400'}; border:1px solid rgba(229,184,105,0.3);">
                  Tüm Ekoller (${RECITERS.length})
                </button>
                <button type="button" class="btn-reciter-filter ${activeReciterSchool === 'misir' ? 'active' : ''}" data-school="misir" style="padding:0.4rem 0.8rem; border-radius:8px; font-size:0.8rem; cursor:pointer; background:${activeReciterSchool === 'misir' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)'}; color:${activeReciterSchool === 'misir' ? '#07090e' : '#cbd5e1'}; font-weight:${activeReciterSchool === 'misir' ? '700' : '400'}; border:1px solid rgba(229,184,105,0.3);">
                  Mısır Ekolü (Klasik / Tahkîk &amp; Mücevved)
                </button>
                <button type="button" class="btn-reciter-filter ${activeReciterSchool === 'haremeyn' ? 'active' : ''}" data-school="haremeyn" style="padding:0.4rem 0.8rem; border-radius:8px; font-size:0.8rem; cursor:pointer; background:${activeReciterSchool === 'haremeyn' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)'}; color:${activeReciterSchool === 'haremeyn' ? '#07090e' : '#cbd5e1'}; font-weight:${activeReciterSchool === 'haremeyn' ? '700' : '400'}; border:1px solid rgba(229,184,105,0.3);">
                  Haremeyn &amp; Körfez (İmamet / Hadr)
                </button>
                <button type="button" class="btn-reciter-filter ${activeReciterSchool === 'turk' ? 'active' : ''}" data-school="turk" style="padding:0.4rem 0.8rem; border-radius:8px; font-size:0.8rem; cursor:pointer; background:${activeReciterSchool === 'turk' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)'}; color:${activeReciterSchool === 'turk' ? '#07090e' : '#cbd5e1'}; font-weight:${activeReciterSchool === 'turk' ? '700' : '400'}; border:1px solid rgba(229,184,105,0.3);">
                  Türk / Osmanlı Ekolü (İstanbul Tavrı)
                </button>
              </div>

              <!-- Arama Kutusu -->
              <div>
                <input type="text" id="loungeReciterSearch" class="lounge-select" placeholder="Kâri, makam veya üslup ara..." value="${loungeState.searchQuery}" style="padding:0.4rem 0.8rem; font-size:0.8rem; min-width:210px;" />
              </div>
            </div>
          </div>

          <!-- Kâri Profil Kartları Izgarası -->
          <div class="reciters-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem; margin-top:1.5rem;">
            ${filteredReciters.map(rec => {
              const isCurrentActive = (rec.id === loungeState.activeReciterId);
              const isThisPlaying = isCurrentActive && loungeState.isPlaying;
              const masterpiece = rec.masterpiece || {
                surah: 1, ayah: 1, title: 'Fâtiha Meşki', desc: 'Klasik model tilavet örneği'
              };

              return `
                <div class="reciter-profile-card ${isThisPlaying ? 'active-playing' : ''}" data-id="${rec.id}" style="background:rgba(255,255,255,0.02); border:1px solid ${isThisPlaying ? 'var(--accent-gold)' : 'rgba(229,184,105,0.25)'}; border-radius:14px; padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between;">
                  <div>
                    <div style="display:flex; align-items:center; gap:0.9rem; margin-bottom:0.75rem;">
                      <div class="reciter-avatar" style="width:50px; height:50px; border-radius:50%; background:linear-gradient(135deg, var(--accent-gold), #b89345); color:#07090e; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:1.05rem; flex-shrink:0;">${rec.avatarText || 'KR'}</div>
                      <div>
                        <h4 class="reciter-name" style="font-size:1.1rem; color:#f0f3fa; margin:0;">${rec.name}</h4>
                        <div class="reciter-school" style="font-size:0.78rem; color:var(--accent-gold); margin-top:2px;">
                          ${rec.schoolTitle || 'Kıraat Ekolü'} · <span class="style-tag" style="background:rgba(255,255,255,0.08); padding:0.1rem 0.4rem; border-radius:4px; color:#cbd5e1;">${rec.style || 'Mürettel'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p class="reciter-bio" style="font-size:0.83rem; color:#a0aec0; line-height:1.5; margin:0 0 0.8rem 0;">${rec.bio || ''}</p>
                    
                    <!-- Makam Rozetleri -->
                    <div class="reciter-makams" style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:0.75rem;">
                      ${(rec.famousMakams || []).map(m => `<span class="badge-mini" style="background:rgba(229,184,105,0.1); border:1px solid rgba(229,184,105,0.3); color:var(--accent-gold); font-size:0.72rem; padding:0.2rem 0.5rem; border-radius:6px;">${m}</span>`).join('')}
                    </div>

                    <!-- Şaheser İcrası Kutusu -->
                    <div class="masterpiece-box">
                      <div class="masterpiece-info">
                        <h5> Şaheser İcrası: ${masterpiece.title}</h5>
                        <p>${masterpiece.desc}</p>
                      </div>
                      <button type="button" class="btn-akademi-secondary btn-play-masterpiece" data-reciter="${rec.id}" data-surah="${masterpiece.surah}" data-ayah="${masterpiece.ayah}" style="padding:0.35rem 0.65rem; font-size:0.75rem; white-space:nowrap;">
                        <span></span> Dinle
                      </button>
                    </div>
                  </div>

                  <!-- Alt Butonlar -->
                  <div class="reciter-actions" style="margin-top:1rem; padding-top:0.75rem; border-top:1px solid rgba(255,255,255,0.06); display:flex; gap:0.5rem; justify-content:space-between; align-items:center; flex-wrap:wrap;">
                    <button type="button" class="btn-akademi-primary btn-listen-reciter" data-id="${rec.id}" style="padding:0.45rem 0.9rem; font-size:0.82rem;">
                      <span>${isThisPlaying ? '⏸' : '▶'}</span> ${currentSurahMeta.name} Dinle
                    </button>
                    <button type="button" class="btn-akademi-secondary btn-select-as-main-reciter" data-id="${rec.id}" style="padding:0.45rem 0.75rem; font-size:0.82rem;" title="Bu kâriyi ana Mushaf okuyucusu yap">
                      <span></span> Mushaf'ta Aç
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 4. EKOLLER MUKAYESE TABLOSU -->
        <div class="akademi-card reciter-schools-card" style="margin-top:1.5rem;">
          <div class="card-headline">
            <span class="card-badge gold">TİLAVET MEKTEPLERİ</span>
            <h3 class="card-title">Kıraat Ekolleri Karşılaştırma Matrisi</h3>
            <p class="card-desc">İslam coğrafyasındaki üç büyük tilavet mektebinin estetik, tecvid ve metodolojik farkları:</p>
          </div>

          <div style="overflow-x:auto; margin-top:1rem;">
            <table style="width:100%; border-collapse:collapse; font-size:0.85rem; color:#cbd5e1; text-align:left;">
              <thead>
                <tr style="border-bottom:2px solid rgba(229,184,105,0.3); color:var(--accent-gold);">
                  <th style="padding:0.75rem;">Ekol Adı</th>
                  <th style="padding:0.75rem;">Tarihî Merkezler</th>
                  <th style="padding:0.75rem;">Öne Çıkan Temsilciler</th>
                  <th style="padding:0.75rem;">Ayırt Edici Karakter</th>
                  <th style="padding:0.75rem;">Temel Odak Noktası</th>
                </tr>
              </thead>
              <tbody>
                ${RECITER_SCHOOLS.map(sc => `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
                    <td style="padding:0.75rem; font-weight:700; color:#f0f3fa;">${sc.name}</td>
                    <td style="padding:0.75rem; color:var(--accent-gold);">${sc.centers}</td>
                    <td style="padding:0.75rem;">${(sc.representatives || []).join(', ')}</td>
                    <td style="padding:0.75rem; color:#a0aec0;">${sc.characteristics}</td>
                    <td style="padding:0.75rem; color:#93c5fd; font-style:italic;">${sc.focus}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 5. KULAK EĞİTİMİ & MEŞK REHBERİ -->
        <div class="akademi-card" style="margin-top:1.5rem; background:linear-gradient(135deg, rgba(229,184,105,0.06), rgba(0,0,0,0.3)); border:1px solid rgba(229,184,105,0.25);">
          <div class="card-headline">
            <span class="card-badge gold">TALEBE REHBERİ</span>
            <h4 class="card-title">Hangi Kâriyi Hangi Aşamada Dinlemeliyim?</h4>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem; margin-top:1rem; font-size:0.84rem; color:#cbd5e1;">
            <div style="background:rgba(255,255,255,0.03); padding:0.85rem; border-radius:10px; border-left:3px solid var(--accent-gold);">
              <strong style="color:#f8fafc; display:block; margin-bottom:4px;">1. Yeni Başlayanlar İçin:</strong>
              <p style="margin:0; color:#94a3b8;"><strong>Mahmûd Halîl el-Husarî:</strong> Med ve gunneleri santim şaşmaz, harf mahreçlerini hatasız öğrenmek için altın mizan referansıdır.</p>
            </div>
            <div style="background:rgba(255,255,255,0.03); padding:0.85rem; border-radius:10px; border-left:3px solid #38bdf8;">
              <strong style="color:#f8fafc; display:block; margin-bottom:4px;">2. Huşû ve Mana Arayanlar:</strong>
              <p style="margin:0; color:#94a3b8;"><strong>Muhammed Sıddîk el-Minşâvî:</strong> Samimi hüznü ve tecvid vakarıyla dinleyeni ağlatan, anlam ile sesin mükemmel buluşmasıdır.</p>
            </div>
            <div style="background:rgba(255,255,255,0.03); padding:0.85rem; border-radius:10px; border-left:3px solid #c084fc;">
              <strong style="color:#f8fafc; display:block; margin-bottom:4px;">3. Makam ve Ses Genişliği:</strong>
              <p style="margin:0; color:#94a3b8;"><strong>Mustafa İsmail &amp; Abdülbâsıt:</strong> Makam geçkileri, tiz ses kullanımı ve diyafram kapasitesini geliştirmek isteyenler için zirvedir.</p>
            </div>
            <div style="background:rgba(255,255,255,0.03); padding:0.85rem; border-radius:10px; border-left:3px solid #34d399;">
              <strong style="color:#f8fafc; display:block; margin-bottom:4px;">4. Namaz ve İmamet Kıraati:</strong>
              <p style="margin:0; color:#94a3b8;"><strong>Yâsir ed-Devserî &amp; Meşâri el-Afâsî:</strong> Hadr/Tedvir temposunda akıcı, anlaşılır ve cemaat namazlarına uygun vakarlı icradır.</p>
            </div>
          </div>
        </div>

      </div>
    `;

    // EVENT LISTENER BAĞLANTILARI
    setupDinlemeEventListeners(container);
  }

  // Dinleme Salonu Dinleyicileri
  function setupDinlemeEventListeners(container) {
    // Sûre Seçimi Değiştiğinde
    const surahSel = container.querySelector('#loungeSurahSelect');
    if (surahSel) {
      surahSel.addEventListener('change', () => {
        loungeState.selectedSurah = parseInt(surahSel.value, 10) || 1;
        loungeState.currentAyah = 1;
        renderDinlemeView();
      });
    }

    // Âyet Seçimi Değiştiğinde
    const ayahSel = container.querySelector('#loungeAyahSelect');
    if (ayahSel) {
      ayahSel.addEventListener('change', () => {
        loungeState.currentAyah = parseInt(ayahSel.value, 10) || 1;
      });
    }

    // Mod Seçimi Değiştiğinde
    const modeSel = container.querySelector('#loungeModeSelect');
    if (modeSel) {
      modeSel.addEventListener('change', () => {
        loungeState.mode = modeSel.value;
        const metaEl = document.getElementById('loungePlayingMeta');
        const surahs = window.SURAH_LIST || [];
        const sObj = surahs.find(s => s.no === loungeState.selectedSurah) || { name: `${loungeState.selectedSurah}. Sûre` };
        if (metaEl) metaEl.textContent = `${sObj.name} Sûresi · ${loungeState.currentAyah}. Âyet (${loungeState.mode === 'continuous' ? 'Kesintisiz Akış' : 'Tek Âyet Meşki'})`;
      });
    }

    // Hızlı Popüler Sûre Butonları
    container.querySelectorAll('.lounge-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const s = parseInt(btn.getAttribute('data-surah'), 10) || 1;
        loungeState.selectedSurah = s;
        loungeState.currentAyah = 1;
        renderDinlemeView();
        playLoungeRecitation(s, 1, loungeState.activeReciterId);
      });
    });

    // Ana Başlat Butonu
    const mainStartBtn = container.querySelector('#loungeMainStartBtn');
    if (mainStartBtn) {
      mainStartBtn.addEventListener('click', () => {
        if (loungeState.isPlaying) {
          if (loungeState.audio) loungeState.audio.pause();
          loungeState.isPlaying = false;
          updateLoungePlayerUI();
        } else {
          playLoungeRecitation(loungeState.selectedSurah, loungeState.currentAyah, loungeState.activeReciterId);
        }
      });
    }

    // Oynatıcı Play/Pause Butonu
    const playPauseBtn = container.querySelector('#loungePlayPauseBtn');
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        if (loungeState.isPlaying) {
          if (loungeState.audio) loungeState.audio.pause();
          loungeState.isPlaying = false;
          updateLoungePlayerUI();
        } else {
          if (loungeState.audio && loungeState.audio.src) {
            loungeState.audio.play().catch(() => {
              playLoungeRecitation(loungeState.selectedSurah, loungeState.currentAyah, loungeState.activeReciterId);
            });
          } else {
            playLoungeRecitation(loungeState.selectedSurah, loungeState.currentAyah, loungeState.activeReciterId);
          }
        }
      });
    }

    // Durdur Butonu
    const stopBtn = container.querySelector('#loungeStopBtn');
    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        if (loungeState.audio) {
          loungeState.audio.pause();
          loungeState.audio.currentTime = 0;
        }
        loungeState.isPlaying = false;
        updateLoungePlayerUI();
      });
    }

    // Önceki Âyet Butonu
    const prevAyahBtn = container.querySelector('#loungePrevAyahBtn');
    if (prevAyahBtn) {
      prevAyahBtn.addEventListener('click', () => {
        if (loungeState.currentAyah > 1) {
          loungeState.currentAyah--;
          playLoungeRecitation(loungeState.selectedSurah, loungeState.currentAyah, loungeState.activeReciterId);
        }
      });
    }

    // Sonraki Âyet Butonu
    const nextAyahBtn = container.querySelector('#loungeNextAyahBtn');
    if (nextAyahBtn) {
      nextAyahBtn.addEventListener('click', () => {
        const surahs = window.SURAH_LIST || [];
        const sMeta = surahs.find(s => s.no === loungeState.selectedSurah) || { ayahs: 7 };
        if (loungeState.currentAyah < sMeta.ayahs) {
          loungeState.currentAyah++;
          playLoungeRecitation(loungeState.selectedSurah, loungeState.currentAyah, loungeState.activeReciterId);
        }
      });
    }

    // Hız Değişimi
    const rateSel = container.querySelector('#loungeRateSelect');
    if (rateSel) {
      rateSel.addEventListener('change', () => {
        const r = parseFloat(rateSel.value) || 1.0;
        loungeState.rate = r;
        if (loungeState.audio) loungeState.audio.playbackRate = r;
      });
    }

    // Ses Değişimi
    const volRange = container.querySelector('#loungeVolumeRange');
    if (volRange) {
      volRange.addEventListener('input', () => {
        const v = parseFloat(volRange.value) || 1.0;
        loungeState.volume = v;
        if (loungeState.audio) loungeState.audio.volume = v;
      });
    }

    // Zaman İlerleme Çubuğu Tıklama/Kaydırma
    const progRange = container.querySelector('#loungeProgress');
    if (progRange) {
      progRange.addEventListener('input', () => {
        if (loungeState.audio && loungeState.audio.duration) {
          const pct = parseFloat(progRange.value) || 0;
          loungeState.audio.currentTime = (pct / 100) * loungeState.audio.duration;
        }
      });
    }

    // Ekol Filtre Butonları
    container.querySelectorAll('.btn-reciter-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        activeReciterSchool = btn.getAttribute('data-school') || 'all';
        renderDinlemeView();
      });
    });

    // Kâri Arama Kutusu
    const searchInp = container.querySelector('#loungeReciterSearch');
    if (searchInp) {
      searchInp.addEventListener('input', () => {
        loungeState.searchQuery = searchInp.value;
        renderDinlemeView();
        const freshInp = document.getElementById('loungeReciterSearch');
        if (freshInp) {
          freshInp.focus();
          freshInp.selectionStart = freshInp.selectionEnd = freshInp.value.length;
        }
      });
    }

    // Kâri Kartı "Dinle" Butonu
    container.querySelectorAll('.btn-listen-reciter').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (loungeState.activeReciterId === id && loungeState.isPlaying) {
          if (loungeState.audio) loungeState.audio.pause();
          loungeState.isPlaying = false;
          updateLoungePlayerUI();
        } else {
          playLoungeRecitation(loungeState.selectedSurah, 1, id);
        }
      });
    });

    // Kâri Kartı "Şaheser İcrası" Butonu
    container.querySelectorAll('.btn-play-masterpiece').forEach(btn => {
      btn.addEventListener('click', () => {
        const recId = btn.getAttribute('data-reciter');
        const s = parseInt(btn.getAttribute('data-surah'), 10) || 1;
        const a = parseInt(btn.getAttribute('data-ayah'), 10) || 1;
        loungeState.selectedSurah = s;
        loungeState.currentAyah = a;
        loungeState.mode = 'single'; // Şaheser tek ayet veya kesit
        renderDinlemeView();
        playLoungeRecitation(s, a, recId);
      });
    });

    // "Mushaf'ta Aç" Butonu
    container.querySelectorAll('.btn-select-as-main-reciter').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const select = document.getElementById('selectReciter');
        if (select) {
          select.value = id;
          select.dispatchEvent(new Event('change'));
        }
        if (typeof window.switchAppTab === 'function') {
          window.switchAppTab('tab-tilavet');
        }
        if (window.showToast) window.showToast(' Mushaf kârisi güncellendi ve Mushaf görünümüne geçildi.');
      });
    });
    probeLoungeAvailability();
  }

  // 5.10 TERİMLER SÖZLÜĞÜ
  function renderSozlukView() {
    const container = document.getElementById('akademi-view-sozluk');
    if (!container) return;
    const norm = (t) => (typeof trNormalize === 'function' ? trNormalize(t) : String(t).toLowerCase());
    const terms = SOZLUK.slice().sort((x, y) => String(x.term).localeCompare(String(y.term), 'tr'));

    container.innerHTML = `
      <div class="sz-page">
        <header class="sz-head">
          <span class="sz-eyebrow">Sözlük</span>
          <h2 class="sz-title">Terimler</h2>
          <p class="sz-sub">${terms.length} terim. Arapça yazılışı, Türkçe adı ve kısa açıklaması.</p>
          <label class="sz-search">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2a8 8 0 0 1 6.3 12.9l5.4 5.4-1.4 1.4-5.4-5.4A8 8 0 1 1 10 2zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/></svg>
            <input type="search" id="inputSozlukSearch" placeholder="Terim ara: mahreç, gunne, vakıf…" autocomplete="off" aria-label="Terim ara">
          </label>
        </header>
        <div class="sz-grid" id="termsGrid">
          ${terms.map(t => `
            <article class="sz-card" data-term="${escapeAsistanHtml(norm(`${t.term} ${t.definition}`))}">
              <div class="sz-ar" lang="ar" dir="rtl">${t.termAr || ''}</div>
              <h3 class="sz-tr">${t.term}</h3>
              <p class="sz-def">${t.definition}</p>
            </article>`).join('')}
        </div>
        <p class="sz-empty" id="sozlukEmpty" hidden>Bu aramayla eşleşen terim yok.</p>
      </div>
    `;

    const searchInput = document.getElementById('inputSozlukSearch');
    const empty = document.getElementById('sozlukEmpty');
    searchInput?.addEventListener('input', () => {
      const q = norm(searchInput.value).trim();
      let shown = 0;
      container.querySelectorAll('.sz-card').forEach(card => {
        const ok = !q || (card.getAttribute('data-term') || '').includes(q);
        card.hidden = !ok;
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  }

  // 5.12 AYARLAR — yalnız kullanıcının işine yarayan, gerçekten etkisi olan tercihler
  const AR_SCALE_KEY = 'tilavet_ar_scale';
  function readArScale() {
    try { const v = parseFloat(localStorage.getItem(AR_SCALE_KEY)); return v >= 0.85 && v <= 1.5 ? v : 1; } catch (_) { return 1; }
  }
  function applyArScale(v) {
    document.documentElement.style.setProperty('--v5-ar-scale', String(v));
  }
  applyArScale(readArScale());

  function renderAyarlarView() {
    const container = document.getElementById('akademi-view-ayarlar');
    if (!container) return;
    const themeApi = window.TilavetTheme;
    const themeMode = themeApi ? themeApi.getMode() : 'system';
    const arScale = readArScale();
    const cvd = document.documentElement.hasAttribute('data-cvd');
    const reciters = (window.QuranAudio && window.QuranAudio.RECITERS) || [];
    const reciterId = window.QuranAudio ? window.QuranAudio.getDefaultReciter() : 6;
    const placed = Number.isFinite(state.placedLevel) ? state.placedLevel : 0;
    const doneCount = (state.completedLessons || []).length;
    const themes = [['system', 'Cihaza göre'], ['light', 'Aydınlık'], ['sepia', 'Sepya'], ['dark', 'Karanlık']];

    container.innerHTML = `
      <div class="st-page">
        <header class="st-head">
          <span class="st-eyebrow">Ayarlar</span>
          <h2 class="st-title">Tercihleriniz</h2>
          <p class="st-sub">Değişiklikler hemen uygulanır ve bu cihazda saklanır.</p>
        </header>

        <section class="st-group" aria-labelledby="stLook">
          <h3 class="st-group-title" id="stLook">Görünüm</h3>
          <div class="st-row st-row--stack">
            <div class="st-label"><strong>Tema</strong><span>Okuma ortamınıza uygun renkler.</span></div>
            <div class="st-seg" role="radiogroup" aria-label="Tema">
              ${themes.map(([id, label]) => `<button type="button" role="radio" class="st-seg-btn" data-theme-mode="${id}" aria-checked="${themeMode === id}">${label}</button>`).join('')}
            </div>
          </div>
          <div class="st-row st-row--stack">
            <div class="st-label"><strong>Arapça yazı boyutu</strong><span>Akademi bölümlerindeki Arapça örnekler.</span></div>
            <div class="st-range">
              <span class="st-range-a" aria-hidden="true">ا</span>
              <input type="range" id="stArScale" min="0.85" max="1.5" step="0.05" value="${arScale}" aria-label="Arapça yazı boyutu">
              <span class="st-range-a st-range-a--lg" aria-hidden="true">ا</span>
              <output id="stArScaleOut">%${Math.round(arScale * 100)}</output>
            </div>
            <div class="st-preview" lang="ar" dir="rtl">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ</div>
          </div>
          <div class="st-row">
            <div class="st-label"><strong>Renkleri işaretle de göster</strong><span>Tecvid renklerini ayırt etmekte zorlanıyorsanız kurallar ayrıca işaretle belirtilir.</span></div>
            <label class="st-switch"><input type="checkbox" id="stCvd" ${cvd ? 'checked' : ''}><span aria-hidden="true"></span><span class="sr-only">Renkleri işaretle de göster</span></label>
          </div>
        </section>

        <section class="st-group" aria-labelledby="stSound">
          <h3 class="st-group-title" id="stSound">Ses</h3>
          <div class="st-row st-row--stack">
            <div class="st-label"><strong>Örnekleri okuyan kâri</strong><span>Durak işaretleri, vasl ve âyet örneklerinde çalınır.</span></div>
            <div class="st-inline">
              <select id="stReciter" class="st-select" aria-label="Örnekleri okuyan kâri">
                ${reciters.map(r => `<option value="${r.id}" ${r.id === reciterId ? 'selected' : ''}>${r.name} · ${r.style}</option>`).join('')}
              </select>
              <button type="button" class="st-btn" id="stReciterTry" data-clip-key="1:1" aria-pressed="false">Dinle</button>
            </div>
          </div>
        </section>

        <section class="st-group" aria-labelledby="stLearn">
          <h3 class="st-group-title" id="stLearn">Öğrenme</h3>
          <div class="st-row">
            <div class="st-label"><strong>Seviye testi</strong><span>${placed > 0 ? `Şu an Seviye ${placed}'ten başlıyorsunuz.` : 'Nereden başlayacağınızı belirler.'}</span></div>
            <button type="button" class="st-btn" id="stPlacement">Testi çöz</button>
          </div>
          <div class="st-row">
            <div class="st-label"><strong>İlerlemeyi sıfırla</strong><span>${doneCount} tamamlanmış ders ve seviye bilgisi silinir. Geri alınamaz.</span></div>
            <button type="button" class="st-btn st-btn--danger" id="stReset">Sıfırla</button>
          </div>
          <div class="st-confirm" id="stResetConfirm" hidden>
            <span>Tüm ilerleme silinsin mi?</span>
            <button type="button" class="st-btn" id="stResetNo">Vazgeç</button>
            <button type="button" class="st-btn st-btn--danger-solid" id="stResetYes">Evet, sil</button>
          </div>
        </section>

        <section class="st-group st-group--note" aria-labelledby="stPrivacy">
          <h3 class="st-group-title" id="stPrivacy">Gizlilik</h3>
          <ul class="st-facts">
            <li><strong>Mikrofon:</strong> Sesiniz yalnız bu cihazda işlenir. Kaydedilmez, hiçbir yere gönderilmez.</li>
            <li><strong>İlerleme:</strong> Bu tarayıcıda saklanır; başka biriyle paylaşılmaz.</li>
            <li><strong>İnternet:</strong> Âyet sesleri ve metinleri Quran.com'dan alınır.</li>
          </ul>
        </section>
      </div>
    `;

    container.querySelectorAll('[data-theme-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!themeApi) return;
        themeApi.setMode(btn.getAttribute('data-theme-mode'));
        container.querySelectorAll('[data-theme-mode]').forEach(b => b.setAttribute('aria-checked', String(b === btn)));
      });
    });

    const range = document.getElementById('stArScale');
    const out = document.getElementById('stArScaleOut');
    range?.addEventListener('input', () => {
      const v = parseFloat(range.value);
      applyArScale(v);
      if (out) out.textContent = `%${Math.round(v * 100)}`;
      try { localStorage.setItem(AR_SCALE_KEY, String(v)); } catch (_) {}
    });

    document.getElementById('stCvd')?.addEventListener('change', (e) => {
      const on = e.target.checked;
      if (on) document.documentElement.setAttribute('data-cvd', ''); else document.documentElement.removeAttribute('data-cvd');
      document.getElementById('btnToggleCvd')?.setAttribute('aria-pressed', String(on));
      try { localStorage.setItem('cymatique_mushaf_cvd', String(on)); } catch (_) {}
    });

    const recSel = document.getElementById('stReciter');
    const tryBtn = document.getElementById('stReciterTry');
    recSel?.addEventListener('change', () => {
      window.QuranAudio?.setDefaultReciter(parseInt(recSel.value, 10));
      window.QuranAudio?.stop();
    });

    document.getElementById('stPlacement')?.addEventListener('click', () => openPlacementTestModal());

    const confirmBox = document.getElementById('stResetConfirm');
    document.getElementById('stReset')?.addEventListener('click', () => { if (confirmBox) confirmBox.hidden = false; });
    document.getElementById('stResetNo')?.addEventListener('click', () => { if (confirmBox) confirmBox.hidden = true; });
    document.getElementById('stResetYes')?.addEventListener('click', () => {
      state = { ...defaultState };
      saveState();
      renderAyarlarView();
      if (window.showToast) window.showToast('İlerleme sıfırlandı.');
    });
  }

  // ===========================================================================
  // 5.8 PRATİK STÜDYOSU (SES LABORATUVARI, CANLI F0 PITCH TUNER & MEDD ELİF SAYACI)
  // ===========================================================================
  let activeStudioStation = 'kurra'; // 'kurra', 'tuner', 'medd', 'spectrum'
  let isStudioMicActive = false;

  // Ses Laboratuvarı: ses_lab.js (YIN perde takibi, DTW, elif ölçer, spektrum)
  function renderStudyoView() {
    const container = document.getElementById('akademi-view-studyo');
    if (!container) return;
    const valid = ['kurra', 'medd', 'tuner', 'spectrum'];
    if (!valid.includes(activeStudioStation)) activeStudioStation = 'kurra';
    if (!window.SesLab) {
      container.innerHTML = '<div class="akademi-card"><p>Ses laboratuvarı yüklenemedi. Sayfayı yenileyin.</p></div>';
      return;
    }
    window.SesLab.mount(container, {
      station: activeStudioStation,
      onStation: (id) => { activeStudioStation = id; updateExecutiveBarAndDrawer('studyo'); }
    });
  }

  // ===========================================================================
  // 5.9 TİLAVET ÖĞRENME ASİSTANI (GUARDRAILS & KNOWLEDGE BASE)
  // ===========================================================================

  function getAsistanNowTime() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  let asistanChatHistory = [
    {
      id: 'init',
      sender: 'assistant',
      text: 'Esselâmü aleyküm. Ben Tilavet Asistanı.\nTecvid kuralları, harfler, medler, duraklar, makam, ses ve nefes, ezber ve uygulamanın kullanımı hakkında sorabilirsiniz. Nereden başlayacağınızı bilmiyorsanız aşağıdan bir konu seçin.',
      time: getAsistanNowTime(),
      options: [
        { label: 'Sıfırdan başlıyorum', query: 'Nereden başlamalıyım?' },
        { label: 'Tecvide nereden başlamalı?', query: 'Tecvid kurallarına nereden başlamalıyım?' },
        { label: 'Bugün ne çalışayım?', query: 'Bugün ne çalışayım?' }
      ]
    }
  ];


  const ASISTAN_TOPICS = [
    { id: 'elifba', icon: '', label: 'Kur’an harfleri ve mahreç', keywords: ['elifba', 'harf', 'mahrec', 'mahreç', 'hareke'], prompts: ['Arapça harfleri çalışmak istiyorum', 'Mahreçleri nasıl öğrenebilirim?', 'Harekeler ve cezim nedir?'] },
    { id: 'tecvid', icon: '', label: 'Tecvid kuralları', keywords: ['tecvid', 'tecvit', 'kural', 'ihfa', 'izhar', 'idgam', 'med', 'gunne'], prompts: ['Tecvid kurallarına nereden başlamalıyım?', 'Nûn-ı sâkin ve tenvin hükümleri nelerdir?', 'Med çeşitlerini açıklar mısın?'] },
    { id: 'vakif', icon: '⏸', label: 'Vakıf, ibtidâ ve duraklar', keywords: ['vakif', 'vakf', 'ibtida', 'ibtida', 'durak', 'secavend', 'sekte'], prompts: ['Durak işaretlerini açıklar mısın?', 'Nerede durup nereden başlamalıyım?', 'Sekte nedir?'] },
    { id: 'makam', icon: '', label: 'Makam ve tilavet geleneği', keywords: ['makam', 'rast', 'ussak', 'bayati', 'hicaz', 'segah', 'saba', 'nihavend'], prompts: ['Makamlar tilavette nasıl kullanılır?', 'Rast makamı nedir?', 'Tecvid ile makamın öncelik sırası nedir?'] },
    { id: 'ses', icon: '', label: 'Ses, nefes ve sağlık', keywords: ['nefes', 'diyafram', 'ses', 'vokal', 'bogaz', 'boğaz', 'isinma', 'ısınma'], prompts: ['Güvenli nefes egzersizi önerir misin?', 'Sesimi yormadan nasıl çalışırım?', 'Tilavet öncesi ses ısınması nasıl yapılır?'] },
    { id: 'study', icon: '', label: 'Ezber ve çalışma planı', keywords: ['ezber', 'hafizlik', 'hafızlık', 'plan', 'program', 'tekrar', 'calisma', 'çalışma'], prompts: ['Yeni başlayanlar için günlük plan hazırla', 'Ezberimi nasıl tekrar etmeliyim?', 'Bir konuyu adım adım çalıştır'] },
    { id: 'meaning', icon: '', label: 'Kur’an’ın anlamı ve kavramlar', keywords: ['meal', 'anlam', 'tefsir', 'ayet', 'sure', 'kavram', 'dua'], prompts: ['Bir âyetin mealini ve bağlamını nasıl incelemeliyim?', 'Tefsir ile meal arasındaki fark nedir?', 'Kur’an’da sık geçen bir kavramı açıkla'] },
    { id: 'religion', icon: '☪', label: 'İslam hakkında genel bilgi', keywords: ['islam', 'iman', 'ibadet', 'hadis', 'siyer', 'peygamber', 'din'], prompts: ['İslam hakkında hangi konularda yardımcı olabilirsin?', 'Hadis ve sünnet kavramlarını açıkla', 'İbadetlerle ilgili genel bir bilgi soracağım'] },
    { id: 'fiqh', label: 'İbadet ve fıkıh soruları', keywords: ['fetva', 'helal', 'haram', 'caiz', 'namaz', 'abdest', 'oruç', 'zekat', 'zekât', 'hac', 'hukum', 'hüküm'], prompts: ['Namazla ilgili genel bilgi istiyorum', 'Abdest konusunda kaynak öner', 'Fıkhî bir konuda güvenilir merciye nasıl başvururum?'] }
  ];

  const ASISTAN_DATA_DOMAINS = [
    { name: 'Tecvid kuralları', records: TECVID_RULES },
    { name: 'Kur’an durakları', records: SECAVEND },
    { name: 'Medine durakları', records: MEDINE_DURAKLARI },
    { name: 'Vakıf türleri', records: VAKIF_TURLERI },
    { name: 'Tilavet mertebeleri', records: TEMPOLAR_DETAY },
    { name: 'Lahn ve tilavet hataları', records: LAHN_KARSILASTIRMA },
    { name: 'Özel kelimeler', records: OZEL_KELIMELER.concat(EKSTRA_OZEL_KELIMELER) },
    { name: 'Vakıf ve ibtidâ', records: IBTIDA_VASL },
    { name: 'Terimler sözlüğü', records: SOZLUK },
    { name: 'Arapça harfler', records: ARABIC_LETTERS },
    { name: 'Harekeler', records: (HAREKELER.ustun || []).concat(HAREKELER.esre || [], HAREKELER.otre || []) },
    { name: 'Medd örnekleri', records: MED_EXAMPLES },
    { name: 'Heceleme örnekleri', records: HECELEME_EXAMPLES },
    { name: 'Kıraat ve rivayet', records: QIRAAT && QIRAAT.imams ? QIRAAT.imams : [] }
  ];

  const ASISTAN_KB_BASE = [
    {
      keywords: ['izhar', 'izhar nedir', 'izhar harfleri'],
      title: 'İzhâr Kuralı',
      answer: 'İzhâr; sözlükte açığa çıkarmak demektir. Tecvid ilminde, nûn-ı sâkin veya tenvinden sonra boğaz harflerinden biri (ء, هـ, ع, ح, غ, خ - Elif, He, Ayn, Ha, Gayn, Hı) geldiğinde, nûn harfini gunnesiz ve net olarak okumaktır.\n\nÖrn: مَنْ آمَنَ (Men âmene), أَنْعَمْتَ (En\'amte).',
      references: ["İbnü'l-Cezerî, el-Mukaddimetü'l-Cezeriyye", "Tuhfetü'l-Etfâl"]
    },
    {
      keywords: ['ihfa', 'ihfa nedir', 'ihfa harfleri'],
      title: 'İhfâ Kuralı',
      answer: 'İhfâ; gizlemek demektir. Nûn-ı sâkin veya tenvinden sonra 15 ihfâ harfinden biri geldiğinde, nûn sesi izhâr ile idğâm arasında, genizden (hayşum) gunneyle okunur. Gunnenin ölçüsü okuyuş ve öğretim geleneğinde hareke üzerinden çalışılır; sesi yapay biçimde uzatmayın.\n\nHarfler: ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك.',
      references: ["Süleyman Çelebi, Tecvîd-i Karabaş", "Tuhfetü'l-Etfâl"]
    },
    {
      keywords: ['idgam', 'idgam nedir', 'idgam-i maal gunne', 'idgam-i bila gunne', 'gunneli'],
      title: 'İdğâm Kuralları',
      answer: 'İdğâm; bir sâkin harfi sonraki harekeli harfe katarak şeddeli okumaktır.\n- İdğâm-ı Ma\'a\'l-Gunne: Nûn-ı sâkin veya tenvinden sonra Y-M-N-V (ي م ن و) gelirse gunneyle okunur.\n- İdğâm-ı Bilâ-Gunne: L-R (ل ر) gelirse gunnesiz idğâm yapılır.\nUygulamada gunne ve süre ölçüsünü kendi rivayetiniz ve hocanızın talimine göre çalışın.',
      references: ["el-Cezeriyye, Bâbu'l-İdğâm"]
    },
    {
      keywords: ['iklab', 'iklab nedir'],
      title: 'İklâb Kuralı',
      answer: 'İklâb; çevirmek demektir. Nûn-ı sâkin veya tenvinden sonra B (ب) harfi geldiğinde, nûn harfini hâlis bir Mîm (م) sesine çevirip dudakları fazla sıkmadan 1.5 elif miktarı gunne ile tutmaktır.\n\nÖrn: مِنْ بَعْدِ (Mim-ba\'di).',
      references: ["Hidayetü'l-Kârî", "Tuhfetü'l-Etfâl"]
    },
    {
      keywords: ['medd', 'medd cesitleri', 'meddi muttasil', 'meddi munfasil', 'elif miktari', 'med'],
      title: 'Medd Hükümleri ve Ölçüsü',
      answer: 'Medd; uzatmak demektir. Harf-i med (ا، و، ي) üzerine sebeb-i med (hemze veya sükûn) gelmesiyle çeşitli med hükümleri oluşur:\n- Medd-i Muttasıl: Harf-i med ile hemze aynı kelimededir.\n- Medd-i Munfasıl: Harf-i med kelime sonunda, hemze sonraki kelimenin başındadır.\n- Medd-i Lâzım: Harf-i medden sonra aslî sükûn gelir.\nUzatma miktarları rivayet, tarik ve okuyuş usulüne göre öğretilir; saniyeye sabitlemek doğru değildir. Kendi okuyuş yolunuz için hocanızın ölçüsünü izleyin.',
      references: ["İbnü'l-Cezerî, et-Temhîd fî İlmi't-Tecvîd"]
    },
    {
      keywords: ['kalkale', 'kalkale harfleri'],
      title: 'Kalkale Hükmü',
      answer: 'Kalkale; sâkin olduklarında ses organında kuvvetli bir tınlama ve sarsılma ile telaffuz edilen 5 harftir: Kaaf, Taa, Bê, Ciim, Dêl (ق ط ب ج د - Kutbu Cedin).',
      references: ["el-Cezeriyye"]
    },
    {
      keywords: ['rast', 'rast makami', 'rast nasil'],
      title: 'Rast Makamı Özellikleri',
      answer: 'Rast makamı ferah, dengeli ve vakur bir karaktere sahiptir. Karar perdesi G3 (Rast / Sol), güçlüsü D4 (Nevâ / Re) perdesidir. Üçüncü derecesi Segâh (koma bemollü) perdesidir. Tilavette Fâtiha, Duhâ ve müjde ayetlerinde sıkça icra edilir.',
      references: ["Rauf Yekta Bey, Türk Musikisi Nazariyatı", "Dr. Subhi Enver, Makamatü'l-Kur'an"]
    },
    {
      keywords: ['ussak', 'bayati', 'ussak makami', 'bayati makami'],
      title: 'Uşşak ve Bayatî Makamları',
      answer: 'Uşşak ve Bayatî birbirine çok yakın akraba makamlardır. Her ikisi de Dügâh (A3 / La) perdesinde karar kılar ve ikinci derecesi Segâh (koma bemollü) perdesidir. Uşşak çıkıcı-inici, Bayatî inici-çıkıcı seyreder. Kur\'an tilavetinin en temel ve en yaygın makamıdır.',
      references: ["İsmail Hakkı Özkan, Türk Musikisi Nazariyatı ve Usulleri"]
    },
    {
      keywords: ['hicaz', 'hicaz makami'],
      title: 'Hicaz Makamı Özellikleri',
      answer: 'Hicaz makamı; yakarıcı, tesirli ve heybetli bir karaktere sahiptir. Karar perdesi Dügâh (La), ikinci derecesi Dik Kürdî (Si bakiye bemol), üçüncü derecesi Nim Hicaz (Do bakiye diyez) olup karakteristik geniş aralığıyla (artmış 2\'li) derhal ayırt edilir.',
      references: ["Makamât fî Tilâveti'l-Kur'ân"]
    },
    {
      keywords: ['nefes', 'diyafram', 'nefes egzersizi', 'nefes yönetimi', 'ses egzersizi', 'balon'],
      title: 'Nefes yönetimi ve güvenli ses çalışması',
      answer: 'Nefes çalışmaları akciğer hacmini büyütmez ve bu ekran akciğer kapasitesini ölçmez. Rahat bir oturuşta omuzları gevşet; nefesini tutmadan burundan rahatça alıp dudakları hafif büzerek daha yumuşak ver. İstersen Şan & Ses bölümündeki 3 al / 4 ver ritmini 4–6 rahat tur uygula; sayılar zorlayıcı hedef değildir. Ardından kısa bir “mmm” ile nefes-ses eşgüdümünü dene. Baş dönmesi, göğüs ağrısı, artan nefes darlığı ya da ses ağrısı olursa dur. Balon şişirmeyi ciğer büyütme egzersizi olarak önermiyoruz. Astım/KOAH veya kalp-akciğer hastalığında önce sağlık uzmanına danış.',
      references: ["American Lung Association, Breathing Exercises", "Tilavet Akademisi Nefes Gücü & Ses Atölyesi"]
    },
    {
      keywords: ['plan', 'calisma plani', 'nasil calismaliyim', 'gunluk program', 'program'],
      title: '20 Dakikalık Dengeli Günlük Tilavet Çalışma Planı',
      answer: 'İsteğe bağlı, rahat bir günlük çalışma akışı:\n- 1–2 dk: Rahat nefes ritmi; nefes tutma veya uzun verme zorunluluğu yok.\n- 1 dk: Yumuşak mırıldanma ya da dudak titreşimi; rahatsızlıkta dur.\n- 5–10 dk: Tecvid ve kısa tilavet meşki; vakıf yerlerinde doğal nefes tazele.\n- İstersen bir kâriden kısa örnek dinle, ardından rahat ses düzeyinde tekrar et.\nSüreyi sağlık durumuna ve rahatlığına göre kısalt. Bu öneri akciğer kapasitesini artırma veya tıbbi tedavi vaadi değildir.',
      references: ["Tilavet Akademisi Öğretim Tasarımı"]
    },
    {
      keywords: ['segah', 'segah makami'],
      title: 'Segâh Makamı Özellikleri',
      answer: 'Segâh makamı; mistik, uhrevî, gönle inşirah veren ve Türk tilavet geleneğinde müstesna bir yere sahip olan makamdır. Karar perdesi Segâh (B3d / Si 1 koma bemol), güçlüsü Nevâ (Re) perdesidir. Seyri çıkıcıdır. Âyetü\'l-Kürsî ve tesirli niyaz âyetlerinde kurrâ tarafından huşû ile icra edilir.',
      references: ["Rauf Yekta Bey, Türk Musikisi", "Dr. Subhi Enver, Makamatü'l-Kur'an"]
    },
    {
      keywords: ['saba', 'saba makami'],
      title: 'Sabâ Makamı Özellikleri',
      answer: 'Sabâ makamı; hüzünlü, içli, kalbi rikkate getiren ve tevbe-istiğfar hissi uyandıran tesirli bir makamdır. Karar perdesi Dügâh (La), ikinci derecesi Segâh (Si koma bemol), üçüncü derecesi Çargâh (Do), dördüncü derecesi Hicaz (Re bemol) perdesidir. Seyri çıkıcı-inici olup kıyamet ve cehennem uyarılarında ibretle okunur.',
      references: ["Makamât fî Tilâveti'l-Kur'ân", "Türk Mûsikîsi Klâsikleri"]
    },
    {
      keywords: ['nihavend', 'nihavend makami'],
      title: 'Nihâvend Makamı Özellikleri',
      answer: 'Nihâvend makamı; Batı müziğindeki minör diziye denk gelen, tatlı, duygusal ve asil bir tona sahiptir. Karar perdesi Rast (G3 / Sol), güçlüsü Nevâ (D4 / Re) perdesidir. Tilavette kıssaların anlatıldığı veya cennet nimetlerinin tasvir edildiği âyetlerde dengeli bir tesir bırakır.',
      references: ["İsmail Hakkı Özkan, Türk Musikisi Nazariyatı"]
    },
    {
      keywords: ['femi muhsin', 'fem-i muhsin', 'hoca', 'canli talim'],
      title: 'Fem-i Muhsin İlkesi',
      answer: 'Fem-i Muhsin, Kur’an’ı doğru ve güzel okuyan ehil öğretmeni anlatan bir ifadedir. Tecvidin uygulaması; örnek okuyuşu dinleme (semâ) ve hocaya okuyup düzeltme alma (arz/müşâfehe) ile güçlenir. Yazılı kurallar ve dijital araçlar bu canlı talime yardımcıdır, onun yerini tutmaz.',
      references: ["İbnü'l-Cezerî, Müneccezü'l-Kārîîn", "Taşköprülüzâde, Miftâhu's-Saâde"]
    },
    {
      keywords: ['hukmur ra', 'hukmu ra', 'ra harfi', 'ra kurali'],
      title: 'Hükmü\'r-Râ (Râ Harfinin Okunuş Hükümleri)',
      answer: 'Râ (ر) harfi harekesine ve çevresindeki harflerin durumuna göre kalın (mufahham) veya ince (murakkak) okunur:\n- Kalın Okunduğu Yerler: Râ harfi üstünlü veya ötreli olduğunda, sâkin olup önceki harf üstünlü/ötreli olduğunda (Örn: رَبَّنَا, قُرْآن).\n- İnce Okunduğu Yerler: Râ harfi esreli olduğunda, sâkin olup önceki harf aslî esreli olduğunda (Örn: رِزْقاً, فِرْعَوْن).\n- Her İki Şekilde de Caiz Olanlar: فِرْقٍ (Fırk) kelimesi gibi istisna durumlardır.',
      references: ["el-Mukaddimetü'l-Cezeriyye, Bâbu'r-Râât"]
    },
    {
      keywords: ['sekte', '4 sekte', 'sekteler'],
      title: 'Kur\'ân-ı Kerîm\'deki 4 Sekte (Hafs Rivayeti)',
      answer: 'Sekte; sesi nefes almaksızın yaklaşık 1 elif miktarı (1 saniye) kesip ardından tilavete devam etmektir. İmam Âsım kıraati Hafs rivayetinde 4 yerde vâciptir:\n1. Kehf Sûresi 1-2. Âyet: عِوَجًا ۜ قَيِّمًا (İveca - Gayyima)\n2. Yâsîn Sûresi 52. Âyet: مَرْقَدِنَا ۜ هَذَا (Merkadina - Haza)\n3. Kıyâme Sûresi 27. Âyet: وَقِيلَ مَنْ ۜ رَاقٍ (Men - Râk)\n4. Mutaffifîn Sûresi 14. Âyet: كَلَّا بَلْ ۜ رَانَ (Bel - Râne)',
      references: ["İmam eş-Şâtıbî, Hırzü'l-Emânî", "Cezeriyye Şerhleri"]
    },
    {
      keywords: ['lahn', 'lahn-i celi', 'lahn-i hafi', 'tilavet hatasi'],
      title: 'Tilavet Hataları: Lahn-ı Celî ve Lahn-ı Hafî',
      answer: 'Tilavet eğitiminde lahn-ı celî, harf veya harekeyi açıkça değiştiren; lahn-ı hafî ise çoğunlukla tecvid uygulamasındaki inceliklerle ilgili hata için kullanılan terimlerdir. Hatanın nasıl düzeltileceğini bir hocayla çalışın. Okuyuşun namazın geçerliliğine etkisi gibi fıkhî sonuçlar mezhep ve somut duruma bağlıdır; bu konuda fetva vermem, ehil bir müftüye veya güvenilir fetva merciine danışın.',
      references: ["İbnü'l-Cezerî, et-Temhîd", "Molla Fenârî, Tecvîd Risâlesi"]
    },
    {
      keywords: ['secavend', 'durak', 'vakif isaretleri'],
      title: 'Secavend Durak İşaretleri ve Hükümleri',
      answer: 'Kur\'an tilavetinde mânânın bütünlüğünü korumak için konulan durak işaretleri (İmam Muhammed b. Tayfur es-Secâvendî):\n- (م) Lâzım Vakıf: Durulması şarttır, geçilirse mânâ bozulabilir.\n- (ط) Mutlak Vakıf: Durmak evlâdır, cümlenin mânâsı tamamlanmıştır.\n- (ج) Câiz Vakıf: Durmak da geçmek de caizdir; durmak daha efdaldir.\n- (ز) Mücevvez Vakıf: Geçmek evlâ, durmak caizdir.\n- (ص) Murahhas Vakıf: Nefes yetmezse zaruret sebebiyle durulabilir.\n- (لا) Lâ Vakfı: Cümlenin mânâsı bitmemiştir, durulmaz; durulursa geriden alınır.',
      references: ["es-Secâvendî, Kitâbü'l-Vakf ve'l-İbtidâ"]
    },
    {
      keywords: ['adab', 'abdest', 'tilavet adabi', 'kible'],
      title: 'Kur\'ân Tilavet Âdâbı',
      answer: 'Tilavetin başlıca edeb ve sünnetleri:\n1. Maddî ve mânevî taharet (Abdest almak, misvak kullanmak, temiz elbise giymek).\n2. Kıbleye yönelerek vakar, huşû ve sükûnetle oturmak.\n3. Eûzü-Besmele ile şeytandan Allah\'a sığınarak başlamak.\n4. Acele etmeksizin tertîl (tane tane, tecvidle) üzere okumak.\n5. Âyetlerin mânâlarını tefekkür etmek, rahmet âyetlerinde ümitlenip azap âyetlerinde istiâzede bulunmak.',
      references: ["İmam Gazâlî, İhyâu Ulûmi'd-Dîn", "İmam Nevevî, et-Tibyân fî Âdâbi Hameleti'l-Kur'ân"]
    },
    {
      keywords: ['vokal hijyen', 'ses sagligi', 'ses kisikligi', 'ses egitimi'],
      title: 'Kurrâlar İçin Vokal Hijyen ve Ses Sağlığı',
      answer: 'Kâri ve hafızların ses tellerini koruma ilkeleri:\n1. Bol oda sıcaklığında su tüketilmeli; ses telleri nemli tutulmalıdır.\n2. Aşırı soğuk, sıcak, asitli veya acı gıdalardan tilavet öncesinde kaçınılmalıdır.\n3. Boğaz temizleme (öksürme/hırıldama) ses tellerine şiddetli çarpar; bunun yerine bir yudum su içilmelidir.\n4. Sabah tilavetinden önce mutlaka 3-5 dakika dudak trili (lip trill) ve hafif mırıldanma (humming) ile ısınma yapılmalıdır.',
      references: ["Prof. Dr. Erol Belgin, Ses Hijyeni Rehberi"]
    },
    {
      keywords: ['mahrec', 'mahreç', 'harf nereden', 'harflerin cikis yeri'],
      title: 'Mahreç ve Harflerin Çıkış Yerleri',
      answer: 'Mahreç, bir harfin sesinin çıktığı yerdir. Tecvid öğrenirken harfleri önce doğru mahreç ve sıfatlarıyla tanımak, sonra harekeli ve kelime içindeki örneklerle çalışmak faydalıdır. Harflerin ince ayrımları yalnızca yazılı açıklamayla kesinleşmez; bir hocadan dinleyip okuyuşunuzu kontrol ettirin. Hangi harfi karıştırdığınızı yazarsanız o harf için adım adım alıştırma önerebilirim.',
      references: ["İbnü'l-Cezerî, el-Mukaddimetü'l-Cezeriyye", "Tilavet Akademisi Arapça Harfler ve Mahreç Modülü"]
    },
    {
      keywords: ['meal tefsir farki', 'tefsir nedir', 'meal nedir'],
      title: 'Meal ve Tefsir Arasındaki Fark',
      answer: 'Meal, Kur’an âyetlerinin anlamını başka bir dilde yaklaşık olarak aktarmaya çalışır; hiçbir meal Kur’an metninin kendisiyle özdeş değildir. Tefsir ise âyetleri dil, bağlam, rivayet ve ilim geleneği çerçevesinde daha geniş biçimde açıklar. Bir âyetin anlamını incelerken birden fazla güvenilir meal ve ehil müfessirlerin açıklamalarını karşılaştırmak, bağlamı ve kaynakların yaklaşımını belirtmek önemlidir. İstersen sûre ve âyet numarasını paylaş; mevcut platformdaki veriye göre yardımcı olayım.',
      references: ["TDV İslâm Ansiklopedisi: Tefsir ve Kur’an tercümesi maddeleri"]
    },
    {
      keywords: ['islamin sartlari', 'imanin sartlari', 'islam nedir', 'iman nedir'],
      title: 'İslam ve İman Hakkında Genel Bilgi',
      answer: 'İslam ve iman, İslam düşüncesinde birbiriyle ilişkili temel kavramlardır. Öğretim geleneğinde İslam’ın şartları ve imanın esasları temel başlıklar olarak öğretilir; bu başlıkların ayrıntılı açıklaması mezhep ve kaynak bağlamına göre ele alınabilir. Hangi kavramı öğrenmek istediğini (ör. iman esasları, ibadetler, siyer veya hadis) seçersen seviyene uygun bir açıklama ve kaynak yönlendirmesi yapabilirim.',
      references: ["Diyanet İslam İlmihali", "TDV İslâm Ansiklopedisi"]
    }
  ];

  const ASISTAN_KB = ASISTAN_KB_BASE.concat(Array.isArray(window.TilavetAsistanKB) ? window.TilavetAsistanKB : []);

  function trNormalize(s) {
    if (!s) return '';
    return s
      .replace(/İ/g, 'i')
      .replace(/I/g, 'ı')
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const ASISTAN_STOP_WORDS = new Set(['nedir', 'nasil', 'nasıl', 'acikla', 'açıkla', 'hakkinda', 'hakkında', 'lutfen', 'lütfen', 'bana', 'bir', 've', 'ile', 'mi', 'midir', 'mudur', 'icin', 'için', 'hangi', 'ne', 'anlat', 'eder', 'misin', 'mısın', 'istiyorum']);
  let asistanSearchIndex = null;
  let pendingAsistanOptions = [];

  function asistanTokens(text) {
    return trNormalize(text).split(' ').filter(token => token.length > 2 && !ASISTAN_STOP_WORDS.has(token));
  }

  function collectAsistanStrings(value, output, depth) {
    if (depth > 4 || output.length >= 32 || value == null) return;
    if (typeof value === 'string') {
      if (value.trim().length > 2) output.push(value.trim());
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(item => collectAsistanStrings(item, output, depth + 1));
      return;
    }
    if (typeof value !== 'object') return;

    const preferredKeys = ['title', 'name', 'label', 'term', 'rule', 'desc', 'description', 'answer', 'summary', 'explanation', 'question', 'example', 'text', 'meaning', 'tr', 'rulesSummary'];
    preferredKeys.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        collectAsistanStrings(value[key], output, depth + 1);
      }
    });
  }

  function getAsistanSearchIndex() {
    if (asistanSearchIndex) return asistanSearchIndex;
    asistanSearchIndex = [];

    ASISTAN_DATA_DOMAINS.forEach(domain => {
      (Array.isArray(domain.records) ? domain.records : []).forEach(record => {
        const strings = [];
        collectAsistanStrings(record, strings, 0);
        const uniqueStrings = [...new Set(strings)];
        if (uniqueStrings.length) {
          asistanSearchIndex.push({
            title: uniqueStrings[0],
            text: uniqueStrings.join(' — ').slice(0, 1400),
            source: domain.name
          });
        }
      });
    });
    return asistanSearchIndex;
  }

  function searchAsistanData(query) {
    const queryTokens = asistanTokens(query);
    if (!queryTokens.length) return [];

    return getAsistanSearchIndex().map(record => {
      const title = trNormalize(record.title);
      const text = trNormalize(record.text);
      let score = 0;
      queryTokens.forEach(token => {
        if (title.includes(token)) score += 4;
        else if (text.includes(token)) score += 1;
      });
      return { ...record, score };
    }).filter(record => record.score >= (queryTokens.length > 1 ? 2 : 4))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  function rankAsistanChoices(query) {
    const queryTokens = asistanTokens(query);
    if (!queryTokens.length) return [];
    return ASISTAN_KB.map(item => {
      const searchable = trNormalize(`${item.title} ${item.keywords.join(' ')}`).split(' ');
      const score = queryTokens.reduce((total, token) => total + (
        searchable.some(word => word.includes(token)) ? 2 :
          (token.length >= 4 && searchable.some(word => asistanEditDistanceAtMostOne(word, token)) ? 1 : 0)
      ), 0);
      return { label: item.title, query: item.keywords[0], score };
    }).filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }

  function getTopicOptions(topic) {
    return topic.prompts.map(prompt => ({ label: prompt, query: prompt }));
  }

  function getAsistanTopicMatches(query) {
    const queryTokens = asistanTokens(query);
    if (!queryTokens.length) return [];
    return ASISTAN_TOPICS.map(topic => {
      const searchable = trNormalize(`${topic.label} ${topic.keywords.join(' ')}`).split(' ');
      const score = queryTokens.reduce((total, token) => total + (
        searchable.some(word => word.includes(token)) ? 1 :
          (token.length >= 4 && searchable.some(word => asistanEditDistanceAtMostOne(word, token)) ? 1 : 0)
      ), 0);
      return { topic, score };
    }).filter(match => match.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }

  function asistanEditDistanceAtMostOne(left, right) {
    if (Math.abs(left.length - right.length) > 1) return false;
    let leftIndex = 0;
    let rightIndex = 0;
    let differences = 0;
    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] === right[rightIndex]) {
        leftIndex++;
        rightIndex++;
      } else {
        differences++;
        if (differences > 1) return false;
        if (left.length > right.length) leftIndex++;
        else if (right.length > left.length) rightIndex++;
        else {
          leftIndex++;
          rightIndex++;
        }
      }
    }
    return differences + (leftIndex < left.length || rightIndex < right.length ? 1 : 0) <= 1;
  }

  function escapeAsistanHtml(text) {
    return String(text).replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  // ===========================================================================
  // 5.9.1 GÜNDELİK KONUŞMALAR & GENİŞLETİLMİŞ DİYALOG MOTORU (20.000+ KOMBİNASYON)
  // ===========================================================================
  const ASISTAN_DAILY_CHATS = [
    {
      type: 'greeting',
      regex: /\b(selam|selamun|selamunaleykum|selamun aleykum|esselamu|selamun aleykum|merhaba|merhabalar|gunaydin|hayirli sabahlar|iyi gunler|iyi aksamlar|hayirli aksamlar|hayirli geceler|hayirli cumalar|hayirli ramazanlar|hayirli kandiller|hos geldin|hosbulduk)\b/,
      text: "Ve aleykümüsselâm ve rahmetullāhi ve berekâtüh! Hoş geldiniz. Kur'ân-ı Kerîm tilaveti, tecvid incelikleri, Türk tilavet makamları, nefes/diyafram sağlığı veya günlük çalışma planınızla ilgili size nasıl yardımcı olabilirim?",
      references: ["İslâm Âdâbı — Selâm ve Tahiyyet"],
      options: [
        { label: "Tecvid kuralları", query: "Tecvid kurallarına nereden başlamalıyım?" },
        { label: "Rast makamı", query: "Rast makamı özellikleri" },
        { label: "20 dk çalışma planı", query: "20 dakikalık çalışma planı" },
        { label: "Nefes & Ses rehberi", query: "Güvenli nefes ve ses çalışması" }
      ]
    },
    {
      type: 'inquiry',
      regex: /\b(nasilsin|naber|ne haber|iyi misin|nasil gidiyor|keyifler nasil|halin hatirin|ne var ne yok|durumlar nasil)\b/,
      text: "Elhamdülillâh, çok iyiyim; Kur'ân-ı Kerîm tilavetini güzelleştirme ve ilim yolculuğunuzda size yardımcı olmak için her zaman hazırım. Siz nasılsınız? Bugün hangi sûre, tecvid kuralı veya makam üzerinde çalışmak istersiniz?",
      references: ["Tilavet Akademisi Pedagojik Rehber"],
      options: [
        { label: "Bir sûre seçmek istiyorum", query: "Fâtiha sûresi özellikleri" },
        { label: "Tecvid kuralları", query: "İzhâr kuralı nedir?" },
        { label: "Sesimi ısıtmak istiyorum", query: "Tilavet öncesi ses ısınması nasıl yapılır?" }
      ]
    },
    {
      type: 'thanks',
      regex: /\b(tesekkur|tesekkurler|tesekkur ederim|sag ol|sagol|cok sagol|allah razi olsun|eyvallah|eline saglik|harikasin|supersin|cok guzel|helal olsun|minnettarim)\b/,
      text: "Cümlemizden Allah razı olsun. İlminizi, nefesinizi ve Kur'an tilavetinizi bereketli kılsın. Rabbim Kur'ân-ı Kerîm'i hayatımıza rehber ve kalplerimize inşirah eylesin. Merak ettiğiniz başka bir konu veya pratik yapmak istediğiniz bir âyet var mı?",
      references: ["Hadîs-i Şerîf: 'İnsanlara teşekkür etmeyen, Allah'a da şükretmez' (Tirmizî)"],
      options: [
        { label: "Yeni bir soru sor", query: "yardım" },
        { label: "20 dk çalışma planı", query: "20 dakikalık çalışma planı" },
        { label: "Makamları incele", query: "Makamlar tilavette nasıl kullanılır?" }
      ]
    },
    {
      type: 'farewell',
      regex: /\b(hoscakal|hosca kal|gorusuruz|gorusmek uzere|allaha emanet|kolay gelsin|iyi calismalar|ben cikiyorum|selametle|hadi eyvallah|bay bay)\b/,
      text: "Fî emânillâh (Allah'a emanet olunuz). Günlük virdinizi ve tilavet meşkinizi aksatmayın; her zaman buradayım. Hayırlı, huzurlu ve feyizli vakitler dilerim.",
      references: ["Tilavet Akademisi"],
      options: [
        { label: "Sohbeti sıfırla", query: "yardım" }
      ]
    },
    {
      type: 'identity',
      regex: /\b(sen kimsin|necisin|ne yapabilirsin|yapay zeka|bot musun|robot musun|seni kim yapti|amacin ne|nasil calisirsin)\b/,
      text: "Ben Tilavet Akademisi'nin yapay zekâ destekli öğrenme asistanıyım.\n\n📚 Görev Alanlarım:\n1. Tecvid kuralları (İzhâr, İhfâ, İdğâm, Medler, Sekte vb.)\n2. 28 Arapça harfin mahreç ve sıfatları\n3. Kur'an tilavetinde 10 Türk mûsikîsi makamı (Rast, Uşşak, Hicaz, Segâh vb.)\n4. Doğru diyafram nefesi, ses sağlığı ve vokal hijyen ilkeleri\n5. Kişiye özel 5-60 dakikalık dengeli günlük çalışma planları\n\n⚠ Önemli İlke: Ben pedagojik bir dijital rehberim; bir hocanın (fem-i muhsin) canlı denetiminin yerini tutamam ve dinî fetva veremem.",
      references: ["Tilavet Akademisi Öğretim Tasarımı"],
      options: [
        { label: "Tecvid rehberi", query: "Tecvid kurallarına nereden başlamalıyım?" },
        { label: "Makam rehberi", query: "Makamlar tilavette nasıl kullanılır?" },
        { label: "Nefes rehberi", query: "Güvenli nefes ve ses çalışması" }
      ]
    },
    {
      type: 'spiritual_comfort',
      regex: /\b(dua et|dua oku|motivasyonum|ezber yapamiyorum|unutuyorum|cok zorlaniyorum|pes etmek|umitsizim|canim sikkin|icim sikiliyor|nasihat)\b/,
      text: "Kur'ân-ı Kerîm yolu meşakkatli gibi görünse de her harfinde sonsuz ecir ve kalbî inşirah barındırır. Peygamber Efendimiz (s.a.v.) şöyle müjdelemiştir:\n\n'Kur'ân'ı maharetle okuyan kimse, kerîm ve itaatkâr meleklerle beraberdir. Zorlanarak ve dili tutularak okuyana ise iki kat mükâfat vardır.' (Buhârî, Tevhîd, 52).\n\n💡 Tavsiyeler:\n- Asla acele etmeyin; günde sadece 15-20 dakika zihninizin en dingin olduğu vakitlerde çalışın.\n- Zorlandığınız âyetleri önce heceleyip dinleyin, sonra sesinizi zorlamadan tekrar edin.\n- Rabbim zihninizi açsın, nefesinizi bereketli kılsın. Hangi âyette takıldıysanız birlikte adım adım bakalım.",
      references: ["Sahîh-i Buhârî, Kitâbü't-Tevhîd", "İhyâu Ulûmi'd-Dîn"],
      options: [
        { label: "20 dk çalışma planı", query: "20 dakikalık çalışma planı" },
        { label: "Nefes & Ses rehberi", query: "Güvenli nefes ve ses çalışması" },
        { label: "Özel kelimeler", query: "Kur'an'daki 4 sekte" }
      ]
    },
    {
      type: 'praise',
      regex: /\b(harika uygulama|cok begendim|cok faydali|muhtesem|cok basarili|tebrikler|helal)\b/,
      text: "İstifade etmenize ve Kur'an yolculuğunuza ışık tutmasına çok sevindim. Kelâmullâh'ı tertîl ve hüsn-i sadâ ile okumak en mübarek amellerdendir. Birlikte çalışmak istediğiniz yeni bir konu var mı?",
      references: ["Tilavet Akademisi"],
      options: [
        { label: "Makamları incele", query: "Makamlar tilavette nasıl kullanılır?" },
        { label: "Tecvid alıştırması", query: "İzhâr kuralı nedir?" }
      ]
    }
  ];

  function matchDailyDialogue(q, rawQuery) {
    for (const item of ASISTAN_DAILY_CHATS) {
      if (item.regex.test(q)) {
        return {
          text: item.text,
          references: item.references,
          options: item.options
        };
      }
    }
    return null;
  }

  // ===========================================================================
  // 5.9.2 TÜM 114 SÛRE KÜTÜPHANESİ & TİLAVET KARAKTERİSTİKLERİ
  // ===========================================================================
  const ASISTAN_SURAHS = [
    { no: 1, name: "Fatiha", ar: "الفاتحة", type: "Mekki", ayet: 7, makam: "Rast / Uşşak", desc: "Ümmü'l-Kitâb, namazların esası, Seb'u'l-Mesânî.", tecvid: "Medd-i Lâzım (ed-Dâllîn), İzhâr-ı Kameriyye" },
    { no: 2, name: "Bakara", ar: "البقرة", type: "Medeni", ayet: 286, makam: "Hicaz / Rast / Uşşak", desc: "Kur'an'ın en uzun sûresi; Âyetü'l-Kürsî ve Âmenerrasûlü barındırır.", tecvid: "Her türlü medd, ihfâ, idğâm ve vakıf zenginliği" },
    { no: 3, name: "Al-i Imran", ar: "آل عمران", type: "Medeni", ayet: 200, makam: "Hicaz / Bayati", desc: "Tevhid ve sabır sûresi.", tecvid: "Mîm-i sâkin hükümleri, Medd-i Muttasıl" },
    { no: 4, name: "Nisa", ar: "النساء", type: "Medeni", ayet: 176, makam: "Bayati / Uşşak", desc: "Adalet, aile ve hak sûresi.", tecvid: "Kalkale, İhfâ, Lâzım duraklar" },
    { no: 5, name: "Maide", ar: "المائدة", type: "Medeni", ayet: 120, makam: "Rast / Uşşak", desc: "Ahitler ve helal-haram hükümleri.", tecvid: "İdğâm-ı Maal-Gunne, Vakıf işaretleri" },
    { no: 6, name: "En'am", ar: "الأنعام", type: "Mekki", ayet: 165, makam: "Hicaz / Rast", desc: "Tevhid ve peygamberler delilleri.", tecvid: "İsti'lâ harfleri, Hükmü'r-Râ" },
    { no: 7, name: "A'raf", ar: "الأعراف", type: "Mekki", ayet: 206, makam: "Segah / Bayati", desc: "Geçmiş kavimlerin kıssaları ve ibretler.", tecvid: "Medd-i Munfasıl, İklâb" },
    { no: 8, name: "Enfal", ar: "الأنفال", type: "Medeni", ayet: 75, makam: "Rast / Uşşak", desc: "Cihad, tevekkül ve zafer.", tecvid: "Kalkale, İdğâm-ı Misleyn" },
    { no: 9, name: "Tevbe", ar: "التوبة", type: "Medeni", ayet: 129, makam: "Hicaz / Saba", desc: "Başında Besmele bulunmayan tek sûre.", tecvid: "İbtidâda Besmelesiz başlama ilkesi" },
    { no: 10, name: "Yunus", ar: "يونس", type: "Mekki", ayet: 109, makam: "Segah / Rast", desc: "Peygamber kıssaları ve tevhid.", tecvid: "Medd-i Muttasıl, İzhâr" },
    { no: 11, name: "Hud", ar: "هود", type: "Mekki", ayet: 123, makam: "Hicaz / Saba", desc: "41. âyette 'Mecrâhê' kelimesinde İmâle kuralı bulunur.", tecvid: "İmâle (41. Âyet: Mecrâhê), İsti'lâ" },
    { no: 12, name: "Yusuf", ar: "يوسف", type: "Mekki", ayet: 111, makam: "Segah / Nihavend", desc: "Ahsenü'l-Kakas; 11. âyette İşmâm/Revm (Lâ te'mennâ) bulunur.", tecvid: "İşmâm / Revm (11. Âyet: Lâ te'mennâ)" },
    { no: 13, name: "Ra'd", ar: "الرعد", type: "Medeni", ayet: 43, makam: "Hicaz / Rast", desc: "Gök gürültüsü ve kâinat âyetleri.", tecvid: "Tilavet secdesi (15. âyet), Kalkale" },
    { no: 14, name: "Ibrahim", ar: "إبراهيم", type: "Mekki", ayet: 52, makam: "Segah / Rast", desc: "Hz. İbrahim'in duası ve tevhid.", tecvid: "İklâb, Medd-i Munfasıl" },
    { no: 15, name: "Hicr", ar: "الحجر", type: "Mekki", ayet: 99, makam: "Bayati / Uşşak", desc: "Kur'an'ın korunmuşluğu âyeti.", tecvid: "İdğâm-ı Maal-Gunne" },
    { no: 16, name: "Nahl", ar: "النحل", type: "Mekki", ayet: 128, makam: "Rast / Uşşak", desc: "Nimetler sûresi, tilavet secdesi barındırır.", tecvid: "Tilavet secdesi (49. âyet)" },
    { no: 17, name: "Isra", ar: "الإسراء", type: "Mekki", ayet: 111, makam: "Segah / Rast", desc: "İsrâ ve Mi'rac hâdisesi, tilavet secdesi.", tecvid: "Tilavet secdesi (107. âyet)" },
    { no: 18, name: "Kehf", ar: "الكهف", type: "Mekki", ayet: 110, makam: "Rast / Segah / Bayati", desc: "Ashâb-ı Kehf; 1-2. âyette (İveca-Kayyima) vâcip sekte bulunur.", tecvid: "1. Vâcip Sekte (Kehf 1-2: عِوَجًا ۜ قَيِّمًا)" },
    { no: 19, name: "Meryem", ar: "مريم", type: "Mekki", ayet: 98, makam: "Segah / Saba", desc: "Hz. Meryem ve Hz. İsa; tilavet secdesi (58. âyet).", tecvid: "Mukatta'a harfleri (Kêf-Hê-Yê-Ayn-Sâd)" },
    { no: 20, name: "Taha", ar: "طه", type: "Mekki", ayet: 135, makam: "Segah / Uşşak", desc: "Hz. Musa kıssası ve gönle inşirah veren tilavet.", tecvid: "Fâsıla harfleri ve medd-i tabiîler" },
    { no: 21, name: "Enbiya", ar: "الأنبياء", type: "Mekki", ayet: 112, makam: "Hicaz / Bayati", desc: "Peygamberlerin niyazları ve duaları.", tecvid: "İdğâm-ı Bilâ-Gunne, Kalkale" },
    { no: 22, name: "Hac", ar: "الحج", type: "Medeni", ayet: 78, makam: "Rast / Hicaz", desc: "2 tilavet secdesi (18 ve 77. âyetler) barındırır.", tecvid: "2 Tilavet secdesi, İhfâ" },
    { no: 23, name: "Mu'minun", ar: "المؤمنون", type: "Mekki", ayet: 118, makam: "Rast / Uşşak", desc: "Müminlerin kurtuluş sıfatları.", tecvid: "Gunne ve nûn-ı sâkin kuralları" },
    { no: 24, name: "Nur", ar: "النور", type: "Medeni", ayet: 64, makam: "Segah / Rast", desc: "Âyetü'n-Nûr (35. âyet) meşhurdur.", tecvid: "Medd-i Muttasıl, Lâzım duraklar" },
    { no: 25, name: "Furkan", ar: "الفرقان", type: "Mekki", ayet: 77, makam: "Bayati / Uşşak", desc: "Hak ile bâtılı ayıran ölçü, tilavet secdesi (60).", tecvid: "Tilavet secdesi, Hükmü'r-Râ" },
    { no: 26, name: "Suara", ar: "الشعراء", type: "Mekki", ayet: 227, makam: "Hicaz / Bayati", desc: "Peygamberler ve kavimlerin tevhid mücadelesi.", tecvid: "Şuarâ durağı ve fâsılalar" },
    { no: 27, name: "Neml", ar: "النمل", type: "Mekki", ayet: 93, makam: "Rast / Segah", desc: "Hz. Süleyman ve Belkıs; içinde Besmele geçen âyet (30).", tecvid: "Tilavet secdesi (25), Besmele-i dâhiliyye" },
    { no: 28, name: "Kasas", ar: "القصص", type: "Mekki", ayet: 88, makam: "Bayati / Segah", desc: "Hz. Musa'nın çocukluk ve risalet kıssası.", tecvid: "İdğâm-ı Mütecâniseyn" },
    { no: 29, name: "Ankebut", ar: "العنكبوت", type: "Mekki", ayet: 69, makam: "Uşşak / Saba", desc: "İmtihan, sabır ve samimiyet.", tecvid: "İhfâ ve gunne tutuşları" },
    { no: 30, name: "Rum", ar: "الروم", type: "Mekki", ayet: 60, makam: "Rast / Hicaz", desc: "Kâinat âyetleri ve fıtrat delilleri.", tecvid: "54. âyette 'Da'f' kelimesi zammeli de okunabilir" },
    { no: 31, name: "Lokman", ar: "لقمان", type: "Mekki", ayet: 34, makam: "Segah / Rast", desc: "Hz. Lokman'ın oğluna hikmetli nasihatleri.", tecvid: "Medd-i Lîn, İzhâr" },
    { no: 32, name: "Secde", ar: "السجدة", type: "Mekki", ayet: 30, makam: "Bayati / Hicaz", desc: "Cuma sabah namazında okunması sünnettir; tilavet secdesi (15).", tecvid: "Tilavet secdesi (15. Âyet)" },
    { no: 33, name: "Ahzab", ar: "الأحزاب", type: "Medeni", ayet: 73, makam: "Hicaz / Rast", desc: "Hendek gazvesi ve Peygamber sevgisi.", tecvid: "Salavât âyeti (56), İdğâm" },
    { no: 34, name: "Sebe", ar: "سبإ", type: "Mekki", ayet: 54, makam: "Rast / Bayati", desc: "Şükür ve nankörlük kıssaları.", tecvid: "Kalkale ve medd-i ârız" },
    { no: 35, name: "Fatir", ar: "فاطر", type: "Mekki", ayet: 45, makam: "Segah / Rast", desc: "Melekler ve Allah'ın yaratıcı kudreti.", tecvid: "İzhâr-ı Kameriyye" },
    { no: 36, name: "Yasin", ar: "يس", type: "Mekki", ayet: 83, makam: "Hüseyni / Rast / Bayati", desc: "Kur'an'ın kalbi; 52. âyette (Merkadinâ-Hêzâ) vâcip sekte bulunur.", tecvid: "2. Vâcip Sekte (Yâsîn 52: مَرْقَدِنَا ۜ هَذَا)" },
    { no: 37, name: "Saffat", ar: "الصافات", type: "Mekki", ayet: 182, makam: "Hicaz / Rast", desc: "Melek safları ve peygamberler tevhidi.", tecvid: "Fâsıla harfleri, Medd-i Muttasıl" },
    { no: 38, name: "Sad", ar: "ص", type: "Mekki", ayet: 88, makam: "Hicaz / Uşşak", desc: "Hz. Davud ve Hz. Süleyman; tilavet secdesi (24).", tecvid: "Tilavet secdesi (24. Âyet)" },
    { no: 39, name: "Zumer", ar: "الزمر", type: "Mekki", ayet: 75, makam: "Segah / Saba", desc: "İhlas ve rahmet müjdesi (53. âyet).", tecvid: "İhfâ ve kalkale zenginliği" },
    { no: 40, name: "Mu'min (Gafir)", ar: "غافر", type: "Mekki", ayet: 85, makam: "Rast / Bayati", desc: "Hâ-Mîm ailesinin ilk sûresi; tevbe ve af.", tecvid: "Hâ-Mîm medd-i lâzımları" },
    { no: 41, name: "Fussilet", ar: "فصلت", type: "Mekki", ayet: 54, makam: "Hicaz / Segah", desc: "44. âyette 'Ea'cemiyyün' kelimesinde Teshîl kuralı bulunur.", tecvid: "Teshîl (44. Âyet: ءَاَعْجَمِيٌّ), Tilavet secdesi (38)" },
    { no: 42, name: "Sura", ar: "الشورى", type: "Mekki", ayet: 53, makam: "Bayati / Rast", desc: "İstişare ve vahiy hakikati.", tecvid: "Ayn-Sîn-Kaaf medd-i lâzımları" },
    { no: 43, name: "Zuhruf", ar: "الزخرف", type: "Mekki", ayet: 89, makam: "Rast / Uşşak", desc: "Dünya ziyneti ve ahiret saadeti.", tecvid: "İdğâm-ı Maal-Gunne" },
    { no: 44, name: "Duhan", ar: "الدخان", type: "Mekki", ayet: 59, makam: "Hicaz / Saba", desc: "Kadir gecesi ve duman uyarısı.", tecvid: "Kalkale ve medd-i ârız" },
    { no: 45, name: "Casiye", ar: "الجاثية", type: "Mekki", ayet: 37, makam: "Bayati / Uşşak", desc: "Kıyamet günü diz çöken ümmetler.", tecvid: "İhfâ ve medd-i muttasıl" },
    { no: 46, name: "Ahkaf", ar: "الأحقاف", type: "Mekki", ayet: 35, makam: "Hicaz / Saba", desc: "Kum tepeleri ve Âd kavmi uyarısı.", tecvid: "Hükmü'r-Râ (kalın ve ince)" },
    { no: 47, name: "Muhammed", ar: "محمد", type: "Medeni", ayet: 38, makam: "Rast / Uşşak", desc: "Hak ile bâtılın mücadelesi.", tecvid: "Mîm-i Müşeddede gunneleri" },
    { no: 48, name: "Fetih", ar: "الفتح", type: "Medeni", ayet: 29, makam: "Rast / Hicaz / Uşşak", desc: "Hudeybiye zaferi ve feth-i mübîn müjdesi.", tecvid: "Medd-i Munfasıl ve kalkale" },
    { no: 49, name: "Hucurat", ar: "الحجرات", type: "Medeni", ayet: 18, makam: "Segah / Rast", desc: "İslâm ahlâkı, edep ve kardeşlik yasaları.", tecvid: "11. âyette 'Bi'se'l-ismu' nakil/isneyn kıraati" },
    { no: 50, name: "Kaf", ar: "ق", type: "Mekki", ayet: 45, makam: "Hicaz / Bayati", desc: "Ölüm, diriliş ve insanın yaratılışı.", tecvid: "Kâf harfi kalkaleleri ve medd-i lâzım" },
    { no: 51, name: "Zariyat", ar: "الذاريات", type: "Mekki", ayet: 60, makam: "Bayati / Segah", desc: "Rızık ve kulluk gayesi.", tecvid: "Fâsıla harflerinde medd-i ârız" },
    { no: 52, name: "Tur", ar: "الطور", type: "Mekki", ayet: 49, makam: "Rast / Uşşak", desc: "Tûr dağı ve cennet nimetleri.", tecvid: "Kalkale ve idğâm" },
    { no: 53, name: "Necm", ar: "النجم", type: "Mekki", ayet: 62, makam: "Hicaz / Saba", desc: "Mi'rac ve vahiy; tilavet secdesi (62).", tecvid: "Tilavet secdesi (62. Âyet)" },
    { no: 54, name: "Kamer", ar: "القمر", type: "Mekki", ayet: 55, makam: "Bayati / Saba", desc: "'Kur'an'ı öğüt için kolaylaştırdık' nakaratı.", tecvid: "Mükerret fâsılalar ve ra hükümleri" },
    { no: 55, name: "Rahman", ar: "الرحمن", type: "Medeni", ayet: 78, makam: "Segah / Nihavend / Hicaz", desc: "Arûsü'l-Kur'ân; 31 kez tekrarlanan 'Âlâi Rabbikümâ' âyeti.", tecvid: "Tekrarlanan kâf ve lâfız ahengi" },
    { no: 56, name: "Vaki'a", ar: "الواقعة", type: "Mekki", ayet: 96, makam: "Rast / Bayati", desc: "Kıyamet kopuşu ve üç sınıf insan.", tecvid: "İhfâ ve idğâm çeşitleri" },
    { no: 57, name: "Hadid", ar: "الحديد", type: "Medeni", ayet: 29, makam: "Rast / Uşşak", desc: "Demir ve imanın imtihanı.", tecvid: "Medd-i Muttasıl ve ihfâ" },
    { no: 58, name: "Mucadele", ar: "المجادلة", type: "Medeni", ayet: 22, makam: "Bayati / Rast", desc: "Her âyetinde 'Allah' lafzı geçen sûre.", tecvid: "Lâfzatullâh'ın kalın ve ince okunuşları" },
    { no: 59, name: "Hasr", ar: "الحشر", type: "Medeni", ayet: 24, makam: "Hicaz / Rast / Bayati", desc: "Son 3 âyeti (Huvallāhüllezî) aşırların tacıdır.", tecvid: "Esmâü'l-Hüsnâ tecvidleri, Medd-i Muttasıl" },
    { no: 60, name: "Mumtehine", ar: "الممتحنة", type: "Medeni", ayet: 13, makam: "Uşşak / Rast", desc: "İmtihan ve sadakat.", tecvid: "İdğâm-ı Maal-Gunne" },
    { no: 61, name: "Saf", ar: "الصف", type: "Medeni", ayet: 14, makam: "Rast / Uşşak", desc: "Kenetlenmiş saflar.", tecvid: "İklâb ve ihfâ" },
    { no: 62, name: "Cuma", ar: "الجمعة", type: "Medeni", ayet: 11, makam: "Rast / Segah", desc: "Cuma namazı ve ezan çağrısı.", tecvid: "Medd-i Munfasıl ve gunneler" },
    { no: 63, name: "Munafikun", ar: "المنافقون", type: "Medeni", ayet: 11, makam: "Bayati / Uşşak", desc: "İkiyüzlülüğün tehlikeleri.", tecvid: "Kalkale ve medd-i ârız" },
    { no: 64, name: "Tegabun", ar: "التغابن", type: "Medeni", ayet: 18, makam: "Segah / Rast", desc: "Kazanma ve kaybetme günü.", tecvid: "İhfâ ve zamîr hükümleri" },
    { no: 65, name: "Talak", ar: "الطلاق", type: "Medeni", ayet: 12, makam: "Bayati / Rast", desc: "Helal sınırları ve takva müjdeleri.", tecvid: "İdğâm-ı Bilâ-Gunne" },
    { no: 66, name: "Tahrim", ar: "التحريم", type: "Medeni", ayet: 12, makam: "Hicaz / Saba", desc: "Tevbe-i nasûh çağrısı.", tecvid: "Medd-i Muttasıl" },
    { no: 67, name: "Mulk", ar: "الملك", type: "Mekki", ayet: 30, makam: "Bayati / Rast / Hicaz", desc: "Tebâreke; kabir azabından koruyucu, yatsıdan sonra sünnet.", tecvid: "İdğâm-ı Maal-Gunne, Kalkale, İklâb" },
    { no: 68, name: "Kalem", ar: "القلم", type: "Mekki", ayet: 52, makam: "Uşşak / Bayati", desc: "Peygamberin yüce ahlâkı.", tecvid: "Nûn mukatta'a harfi" },
    { no: 69, name: "Hakka", ar: "الحاقة", type: "Mekki", ayet: 52, makam: "Hicaz / Saba", desc: "Gerçekleşecek kıyamet uyarısı.", tecvid: "Medd-i Lâzım (el-Hâkka)" },
    { no: 70, name: "Mearic", ar: "المعارج", type: "Mekki", ayet: 44, makam: "Bayati / Saba", desc: "Yükseliş dereceleri ve sabır.", tecvid: "Fâsıla tecvidleri" },
    { no: 71, name: "Nuh", ar: "نوح", type: "Mekki", ayet: 28, makam: "Segah / Saba", desc: "Hz. Nuh'un 950 yıllık tebliğ niyazı.", tecvid: "İstiğfar ve isti'âze tecvidi" },
    { no: 72, name: "Cin", ar: "الجن", type: "Mekki", ayet: 28, makam: "Hicaz / Bayati", desc: "Cinlerin Kur'an'ı dinleyip imanı.", tecvid: "Kalkale ve medd-i ârız" },
    { no: 73, name: "Muzzemmil", ar: "المزمل", type: "Mekki", ayet: 20, makam: "Segah / Rast", desc: "'Kur'an'ı tertîl ile tane tane oku' emri.", tecvid: "Tertîl esası (4. âyet)" },
    { no: 74, name: "Muddessir", ar: "المدثر", type: "Mekki", ayet: 56, makam: "Rast / Uşşak", desc: "'Kalk ve uyar' risalet emri.", tecvid: "Kısa ve dinamik fâsılalar" },
    { no: 75, name: "Kiyame", ar: "القيامة", type: "Mekki", ayet: 40, makam: "Hicaz / Saba", desc: "27. âyette (Men-Râk) vâcip sekte bulunur.", tecvid: "3. Vâcip Sekte (Kıyâme 27: وَقِيلَ مَنْ ۜ رَاقٍ)" },
    { no: 76, name: "Insan", ar: "الإنسان", type: "Medeni", ayet: 31, makam: "Segah / Nihavend", desc: "İnsanın yaratılışı ve cennet nimetleri.", tecvid: "Medd-i Lîn ve gunneler" },
    { no: 77, name: "Murselat", ar: "المرسلات", type: "Mekki", ayet: 50, makam: "Hicaz / Saba", desc: "Rüzgârlar ve kıyamet müjdesi.", tecvid: "Tekrarlanan fâsılalar" },
    { no: 78, name: "Nebe", ar: "النبإ", type: "Mekki", ayet: 40, makam: "Rast / Bayati / Uşşak", desc: "Amme cüzünün başı; aşır meşkinin ilk adımı.", tecvid: "İdğâm-ı Maal-Gunne, Kalkale, Medd-i Muttasıl" },
    { no: 79, name: "Naziat", ar: "النازعات", type: "Mekki", ayet: 46, makam: "Hicaz / Rast", desc: "Can alan melekler ve Hz. Musa.", tecvid: "Medd-i Munfasıl ve gunneler" },
    { no: 80, name: "Abese", ar: "عبس", type: "Mekki", ayet: 42, makam: "Bayati / Segah", desc: "İlâhî ikaz ve insanın yaratılışı.", tecvid: "Fâsıla harflerinde medd-i ârız" },
    { no: 81, name: "Tekvir", ar: "التكوير", type: "Mekki", ayet: 29, makam: "Hicaz / Saba", desc: "Güneşin dürüldüğü kıyamet sahnesi.", tecvid: "İdğâm-ı Şemsiyye" },
    { no: 82, name: "Infitar", ar: "الانفطار", type: "Mekki", ayet: 19, makam: "Segah / Saba", desc: "Göğün yarıldığı gün.", tecvid: "İhfâ ve kalkale" },
    { no: 83, name: "Mutaffifin", ar: "المطففين", type: "Mekki", ayet: 36, makam: "Bayati / Hicaz", desc: "14. âyette (Bel-Râne) vâcip sekte bulunur.", tecvid: "4. Vâcip Sekte (Mutaffifîn 14: كَلَّا بَلْ ۜ رَانَ)" },
    { no: 84, name: "Insikak", ar: "الانشقاق", type: "Mekki", ayet: 25, makam: "Rast / Segah", desc: "Göğün yarılıp Rabbine boyun eğmesi; tilavet secdesi (21).", tecvid: "Tilavet secdesi (21. Âyet)" },
    { no: 85, name: "Buruc", ar: "البروج", type: "Mekki", ayet: 22, makam: "Hicaz / Rast", desc: "Burçlar ve Ashâb-ı Uhdûd.", tecvid: "Kalkale harfleri (ق ط ب ج د)" },
    { no: 86, name: "Tarik", ar: "الطارق", type: "Mekki", ayet: 17, makam: "Rast / Uşşak", desc: "Gece parlayan necm-i sâkıb.", tecvid: "Medd-i Muttasıl" },
    { no: 87, name: "A'la", ar: "الأعلى", type: "Mekki", ayet: 19, makam: "Segah / Rast", desc: "'Yüce Rabbinin adını tesbih et' emri.", tecvid: "İzhâr ve ihfâ" },
    { no: 88, name: "Gasiye", ar: "الغاشية", type: "Mekki", ayet: 26, makam: "Hicaz / Saba", desc: "Dehşetiyle her şeyi kaplayan kıyamet.", tecvid: "Fâsıla harfleri" },
    { no: 89, name: "Fecr", ar: "الفجر", type: "Mekki", ayet: 30, makam: "Hüseyni / Rast / Segah", desc: "On geceye yemin ve 'Ey mutmainne nefis' hitabı.", tecvid: "Hükmü'r-Râ durakları (kalın ve ince)" },
    { no: 90, name: "Beled", ar: "البلد", type: "Mekki", ayet: 20, makam: "Rast / Uşşak", desc: "Mekke şehri ve sarp yokuş imtihanı.", tecvid: "Kalkale (Bê, Dêl)" },
    { no: 91, name: "Sems", ar: "الشمس", type: "Mekki", ayet: 15, makam: "Segah / Rast", desc: "Güneşe ve aya yemin.", tecvid: "Fâsıla harflerinde medd-i tabiî" },
    { no: 92, name: "Leyl", ar: "الليل", type: "Mekki", ayet: 21, makam: "Bayati / Uşşak", desc: "Gece ve gündüzün karşıtlığı.", tecvid: "İdğâm-ı Maal-Gunne" },
    { no: 93, name: "Duha", ar: "الضحى", type: "Mekki", ayet: 11, makam: "Rast / Segah", desc: "Peygambere teselli ve rabbinin nimetini anma.", tecvid: "Medd-i Tabiî ve fâsılalar" },
    { no: 94, name: "Insirah", ar: "الشرح", type: "Mekki", ayet: 8, makam: "Segah / Rast", desc: "Göğsün açılıp ferahlaması, güçlükle gelen kolaylık.", tecvid: "Râ harfi ve kalkale" },
    { no: 95, name: "Tin", ar: "التين", type: "Mekki", ayet: 8, makam: "Rast / Uşşak", desc: "İncir, zeytin ve ahsen-i takvîm.", tecvid: "İdğâm-ı Şemsiyye" },
    { no: 96, name: "Alak", ar: "العلق", type: "Mekki", ayet: 19, makam: "Hicaz / Bayati", desc: "İlk inen 'İkra' âyetleri; tilavet secdesi (19).", tecvid: "Tilavet secdesi (19. Âyet)" },
    { no: 97, name: "Kadir", ar: "القدر", type: "Mekki", ayet: 5, makam: "Segah / Rast", desc: "Bin aydan hayırlı Kadir gecesi.", tecvid: "Hükmü'r-Râ ve kalkale" },
    { no: 98, name: "Beyyine", ar: "البينة", type: "Medeni", ayet: 8, makam: "Rast / Uşşak", desc: "Apaçık delil ve ihlaslı ibadet.", tecvid: "Medd-i Muttasıl ve ihfâ" },
    { no: 99, name: "Zilzal", ar: "الزلزلة", type: "Medeni", ayet: 8, makam: "Hicaz / Bayati", desc: "Yerin şiddetle sarsılması ve zerre miskal hesap.", tecvid: "İdğâm-ı Maal-Gunne ve ihfâ" },
    { no: 100, name: "Adiyat", ar: "العاديات", type: "Mekki", ayet: 11, makam: "Hicaz / Saba", desc: "Soluk soluğa koşan atlar ve kıyamet.", tecvid: "Kalkale harfleri (Kutbu Cedin)" },
    { no: 101, name: "Kari'a", ar: "القارعة", type: "Mekki", ayet: 11, makam: "Hicaz / Saba", desc: "Kapıları çalan kıyamet dehşeti.", tecvid: "Hê-i sekteler ve medd-i lâzım" },
    { no: 102, name: "Tekasur", ar: "التكاثر", type: "Mekki", ayet: 8, makam: "Bayati / Uşşak", desc: "Çoklukla övünme yarışı ve kabirler.", tecvid: "Medd-i Ârız ve ra hükümleri" },
    { no: 103, name: "Asr", ar: "العصر", type: "Mekki", ayet: 3, makam: "Rast / Segah / Uşşak", desc: "Zamâna yemin, hüsran ve kurtuluşun 4 şartı.", tecvid: "Vakıfta Râ harfi ve sâkin Sâd harfi telaffuzu" },
    { no: 104, name: "Humeze", ar: "الهمزة", type: "Mekki", ayet: 9, makam: "Hicaz / Bayati", desc: "Dedikodu ve mal yığma uyarısı.", tecvid: "İdğâm-ı Bilâ-Gunne" },
    { no: 105, name: "Fil", ar: "الفيل", type: "Mekki", ayet: 5, makam: "Rast / Uşşak", desc: "Kâbe'yi yıkmaya gelen Ebrehe ordusu.", tecvid: "İzhâr-ı Şefevî (Mîm harfi izhârı)" },
    { no: 106, name: "Kureys", ar: "قريش", type: "Mekki", ayet: 4, makam: "Segah / Rast", desc: "Kureyş'in kış ve yaz emniyeti.", tecvid: "Medd-i Lîn kuralları (Sayf, Havf, Beyt)" },
    { no: 107, name: "Ma'un", ar: "الماعون", type: "Mekki", ayet: 7, makam: "Bayati / Uşşak", desc: "Yetimi itip kakan ve gösteriş yapanlar.", tecvid: "İdğâm-ı Maal-Gunne" },
    { no: 108, name: "Kevser", ar: "الكوثر", type: "Mekki", ayet: 3, makam: "Rast / Segah", desc: "Kur'an'ın en kısa sûresi; bitip tükenmeyen hayır.", tecvid: "Râ harfinde kalkale yapmama kuralı" },
    { no: 109, name: "Kafirun", ar: "الكافرون", type: "Mekki", ayet: 6, makam: "Rast / Uşşak", desc: "Şirkten berî olma bildirisi.", tecvid: "Medd-i Munfasıl ve medd-i ârızlar" },
    { no: 110, name: "Nasr", ar: "النصر", type: "Medeni", ayet: 3, makam: "Rast / Segah", desc: "Allah'ın yardımı ve fetih müjdesi.", tecvid: "Medd-i Muttasıl ve kalkale" },
    { no: 111, name: "Tebbet", ar: "المسد", type: "Mekki", ayet: 5, makam: "Hicaz / Bayati", desc: "Ebû Leheb ve karısının helâki.", tecvid: "Kalkale harfleri (ق ط ب ج د)" },
    { no: 112, name: "Ihlas", ar: "الإخلاص", type: "Mekki", ayet: 4, makam: "Rast / Segah / Uşşak", desc: "Tevhidin özü, Kur'an'ın üçte birine muadil.", tecvid: "Kalkale ve İklâb (Kufüven ehad)" },
    { no: 113, name: "Felak", ar: "الفلق", type: "Mekki", ayet: 5, makam: "Hicaz / Rast", desc: "Muavvizeteyn; karanlıktan sabahın Rabbine sığınma.", tecvid: "Âyet sonu kuvvetli kalkaleler" },
    { no: 114, name: "Nas", ar: "الناس", type: "Mekki", ayet: 6, makam: "Rast / Uşşak", desc: "Muavvizeteyn; vesveseci şeytandan sığınma.", tecvid: "Nûn-ı Müşeddede gunneleri" }
  ];

  // ===========================================================================
  // 5.9.3 ARAPÇA 28 HARF VE FONETİK MAHREÇ VERİTABANI
  // ===========================================================================
  const ASISTAN_LETTERS = [
    { name: "Elif", ar: "ا", mahrec: "Cevf (Ağız ve boğaz boşluğu)", sifat: "Hafâ, Med", kalin: false, tips: "Harekeli olduğunda hemze olur; sâkin uzatma harfi olduğunda önceki harfin kalınlığına uyar." },
    { name: "Be", ar: "ب", mahrec: "Şefeteyn (İki dudağın ıslak iç kısımları)", sifat: "Cehr, Şiddet, İstifâl, İnfitâh, İzlâk, Kalkale", kalin: false, tips: "Sâkin olduğunda dudaklar tam kapanıp net bir kalkale ile patlatılır." },
    { name: "Te", ar: "ت", mahrec: "Dil ucunun üst ön dişlerin etlerine değmesi", sifat: "Hems, Şiddet, İstifâl, İnfitâh, İsmât", kalin: false, tips: "Sâkin olduğunda arkasından hafif bir nefes fısıltısı (hems) bırakılır; ancak 'ts' gibi ıslıklanmamalıdır." },
    { name: "Se (Peltek)", ar: "ث", mahrec: "Dil ucunun üst ön dişlerin kesici kenarlarına hafifçe dokunması", sifat: "Hems, Rihvet, İstifâl, İnfitâh, İsmât", kalin: false, tips: "Dil ucu hafifçe dışarı çıkarılır; keskin 'S' sesine kaçmamalıdır." },
    { name: "Cim", ar: "ج", mahrec: "Dil ortasının üst damağa tam basması", sifat: "Cehr, Şiddet, İstifâl, İnfitâh, İsmât, Kalkale", kalin: false, tips: "Türkçedeki 'c' gibi yumuşak veya 'j' gibi gevşek değil; kuvvetli ve akmayan sert bir temasla seslendirilir." },
    { name: "Ha", ar: "ح", mahrec: "Vesatu'l-Halk (Boğazın tam ortası)", sifat: "Hems, Rihvet, İstifâl, İnfitâh, İsmât", kalin: false, tips: "Boğaz hafifçe kısılarak tatlı bir nefes akıntısıyla çıkarılır; hırıltı (Hı) katılmamalıdır." },
    { name: "Hi", ar: "خ", mahrec: "Edne'l-Halk (Boğazın ağza en yakın üst kısmı)", sifat: "Hems, Rihvet, İsti'lâ, İnfitâh, İsmât", kalin: true, tips: "Boğazın üst kısmında doğal ve yumuşak bir hırıltı ile kalın seslendirilir." },
    { name: "Dal", ar: "د", mahrec: "Dil ucunun üst ön diş etlerine basması", sifat: "Cehr, Şiddet, İstifâl, İnfitâh, İsmât, Kalkale", kalin: false, tips: "Sâkin olduğunda kuvvetli bir kalkale ile tınlatılır; peltekleştirilmemelidir." },
    { name: "Zel (Peltek)", ar: "ذ", mahrec: "Dil ucunun üst ön dişlerin uçlarına temas etmesi", sifat: "Cehr, Rihvet, İstifâl, İnfitâh, İsmât", kalin: false, tips: "Dil ucu dişlerin arasından hafifçe görünür; keskin 'Z' sesine dönüştürülmemelidir." },
    { name: "Ra", ar: "ر", mahrec: "Dil ucunun üst ön diş etlerine yakın üst yüzeyi", sifat: "Cehr, Beyniyye, İstifâl/İsti'lâ, İnfitâh, İzlâk, İnhirâf, Tekrîr", kalin: false, tips: "Üstün ve ötrede kalın, esrede incedir. Dil fazla titretilmemeli (tekrir gizlenmeli), bir kez hafifçe değip ayrılmalıdır." },
    { name: "Ze", ar: "ز", mahrec: "Dil ucunun alt ön dişlerin iç kısmına dayanması", sifat: "Cehr, Rihvet, İstifâl, İnfitâh, İzlâk, Safîr", kalin: false, tips: "Arı vızıltısına benzer keskin ve akıcı bir safîr ıslığıyla seslendirilir." },
    { name: "Sin", ar: "س", mahrec: "Dil ucunun alt ön dişlerin iç yüzeyine yaklaşması", sifat: "Hems, Rihvet, İstifâl, İnfitâh, İsmât, Safîr", kalin: false, tips: "İnce, berrak ve nefes fısıltısıyla zengin bir safîr sesi üretilir." },
    { name: "Sin (Şın)", ar: "ش", mahrec: "Dil ortasının üst damağa doğru yayılması", sifat: "Hems, Rihvet, İstifâl, İnfitâh, İsmât, Tefeşşî", kalin: false, tips: "Tefeşşî sıfatı gereği ses ağız boşluğuna yayılır." },
    { name: "Sad", ar: "ص", mahrec: "Dil ucunun alt dişlere dayanıp dil arkasının damağa yükselmesi", sifat: "Hems, Rihvet, İsti'lâ, İtbâk, İsmât, Safîr", kalin: true, tips: "Tok, kalın ve kuvvetli ıslıklı safîr harfidir; dudaklar öne büzülmemelidir." },
    { name: "Dad", ar: "ض", mahrec: "Dilin sol veya sağ yanının üst azı dişlerinin iç yüzeyine yaslanması", sifat: "Cehr, Rihvet, İsti'lâ, İtbâk, İsmât, İstitâle", kalin: true, tips: "Kur'an harflerinin en hususîsidir. Ses dil kenarı boyunca uzatılır (istitâle); Zê veya Dêl sesine dönüştürülmemelidir." },
    { name: "Ti (Ta)", ar: "ط", mahrec: "Dil ucunun üst ön diş köklerine yapışması", sifat: "Cehr, Şiddet, İsti'lâ, İtbâk, İsmât, Kalkale", kalin: true, tips: "Kur'an'ın en kuvvetli harfidir. Hem kalkaleli hem kalın (itbâklı) olarak tok bir sesle patlatılır." },
    { name: "Zi (Za)", ar: "ظ", mahrec: "Dil ucunun üst ön diş uçlarına dokunup dil arkasının yükselmesi", sifat: "Cehr, Rihvet, İsti'lâ, İtbâk, İsmât", kalin: true, tips: "Peltek ve kalın harftir; dil ucu azıcık dışarı çıkar, ses tok ve itbâklı akar." },
    { name: "Ayn", ar: "ع", mahrec: "Vesatu'l-Halk (Boğazın tam ortası)", sifat: "Cehr, Beyniyye, İstifâl, İnfitâh, İsmât", kalin: false, tips: "Boğaz hafifçe sıkılarak ses pürüzsüzce akıtılır; Türkçe sesletimindeki yapay gırtlak darbelerinden kaçınılmalıdır." },
    { name: "Gayn", ar: "غ", mahrec: "Edne'l-Halk (Boğazın ağza en yakın üst kısmı)", sifat: "Cehr, Rihvet, İsti'lâ, İnfitâh, İsmât", kalin: true, tips: "Hı harfinden farklı olarak cehr ile (ses telleri titreşerek) akıcı ve kalın çıkarılır." },
    { name: "Fe", ar: "ف", mahrec: "Üst ön dişlerin uçlarının alt dudağın ıslak kısmına dokunması", sifat: "Hems, Rihvet, İstifâl, İnfitâh, İzlâk", kalin: false, tips: "Dişler dudağı ısırmaz, hafifçe nefes fısıltısıyla temas eder." },
    { name: "Kaf", ar: "ق", mahrec: "Aksa'l-Lisân (Dil kökünün küçük dile yakın üst damağa basması)", sifat: "Cehr, Şiddet, İsti'lâ, İnfitâh, İsmât, Kalkale", kalin: true, tips: "Tok ve dolgun bir kalkale ile sarsılır; ince Kef harfiyle kesinlikle karıştırılmamalıdır." },
    { name: "Kef", ar: "ك", mahrec: "Dil kökünün Kâf harfinin hemen önündeki sert damağa basması", sifat: "Hems, Şiddet, İstifâl, İnfitâh, İsmât", kalin: false, tips: "Sâkin olduğunda şiddetten sonra arkasından incecik bir nefes akımı (hems) bırakılır." },
    { name: "Lam", ar: "ل", mahrec: "Dil ucunun iki yanıyla üst ön diş etlerine genişçe dokunması", sifat: "Cehr, Beyniyye, İstifâl, İnfitâh, İzlâk, İnhirâf", kalin: false, tips: "Allah lafzında üstün ve ötre öncesinde kalın, diğer yerlerde ince ve berraktır." },
    { name: "Mim", ar: "م", mahrec: "Şefeteyn (İki dudağın birbirine hafifçe kapanması)", sifat: "Cehr, Beyniyye, İstifâl, İnfitâh, İzlâk, Gunne", kalin: false, tips: "Sesi dudak kapanışıyla genizden (hayşum) 1.5 elif miktarı gunne ile tutulabilir." },
    { name: "Nun", ar: "ن", mahrec: "Dil ucunun üst ön diş etlerine dokunması", sifat: "Cehr, Beyniyye, İstifâl, İnfitâh, İzlâk, Gunne", kalin: false, tips: "Tenvin ve nûn-ı sâkin kurallarının (İzhâr, İhfâ, İdğâm, İklâb) temel merkezidir." },
    { name: "Vav", ar: "و", mahrec: "Şefeteyn (İki dudağın öne doğru yuvarlanıp büzülmesi)", sifat: "Cehr, Rihvet, İstifâl, İnfitâh, İsmât, Lîn", kalin: false, tips: "Dudaklar öne doğru iyice yuvarlanmalı, dişler dudağa değdirilmemelidir." },
    { name: "He", ar: "ه", mahrec: "Aksa'l-Halk (Boğazın göğse en yakın dibi)", sifat: "Hems, Rihvet, İstifâl, İnfitâh, İsmât, Hafâ", kalin: false, tips: "Göğüsten gelen derin bir nefesle çıkarılır; zayıf (hafâ) bir harf olduğundan kaybolmamasına dikkat edilmelidir." },
    { name: "Ye", ar: "ي", mahrec: "Dil ortasının üst sert damağa yükselmesi", sifat: "Cehr, Rihvet, İstifâl, İnfitâh, İsmât, Lîn", kalin: false, tips: "Sâkin olup önceki harf üstünlü olduğunda yumuşacık bir Medd-i Lîn oluşturur." }
  ];

  // ===========================================================================
  // 5.9.4 MEŞHUR KURRÂ & TİLAVET ÜSLUPLARI
  // ===========================================================================
  const ASISTAN_RECITERS = [
    { id: "abdussamed", name: "Şeyh Abdüsbâsit Abdüssamed", country: "Mısır", style: "Tahkîk & Mecd", desc: "Benzersiz nefes kapasitesi, tiz perdelerdeki kusursuz rezonans ve vakur tahkik üslubu.", listens: "Yûsuf Sûresi, Meryem Sûresi, Tekvîr Sûresi" },
    { id: "mensavi", name: "Şeyh Muhammed Sıddık el-Menşâvî", country: "Mısır", style: "Tahkîk & Tedvîr", desc: "Huşû, hüzün ve kusursuz mahreç edası; Kur'an tilavetinde kalbe en çok tesir eden kâri olarak bilinir.", listens: "Haşr Sûresi sonu, Rûm Sûresi, Yûsuf Sûresi" },
    { id: "husari", name: "Şeyh Mahmûd Halîl el-Husarî", country: "Mısır", style: "Şeyhu'l-Kurrâ (Mutlak Referans)", desc: "Tecvid ilminin ve mahreç netliğinin tartışmasız hocasıdır; tahkik ve hadr kayıtları tüm dünyada tecvid ölçüsüdür.", listens: "Cüz 30 (Amme Cüzü), Mülk Sûresi" },
    { id: "mustafa_ismail", name: "Şeyh Mustafa İsmâil", country: "Mısır", style: "Makamât Sultanı", desc: "Âyet mânâsına göre benzersiz makam geçkileri (Rast, Bayati, Saba, Hicaz, Segah); aşır icrasının zirvesidir.", listens: "Hucurât Sûresi, Kâf Sûresi" },
    { id: "devseri", name: "Şeyh Yâsir ed-Devserî", country: "Suudi Arabistan", style: "Hadr & Hızlı İmamet", desc: "Mescid-i Harâm imamı; namaz imameti süratinde (110-120 BPM) güçlü, akıcı ve heyecan verici kıraat.", listens: "Mülk Sûresi, Kıyamet Sûresi" },
    { id: "sudeys", name: "Şeyh Abdurrahman es-Sudeys", country: "Suudi Arabistan", style: "Kâbe İmamet Üslubu", desc: "Mescid-i Harâm imamı & hatibi; kendine has Uşşak/Hicaz nağmeleri ve dua kıraatleri.", listens: "Fatiha Sûresi, Bakara Sûresi" },
    { id: "suraym", name: "Şeyh Suud eş-Şuraym", country: "Suudi Arabistan", style: "Hüzünlü & Vakur", desc: "Mescid-i Harâm eski imamı; derin, hüzünlü ve akıcı tilavet tarzı.", listens: "İnşikak Sûresi, Necm Sûresi" },
    { id: "muaykili", name: "Şeyh Mâhir el-Muaykılî", country: "Suudi Arabistan", style: "Duygulu Uşşak", desc: "Mescid-i Harâm imamı; sade, berrak diksiyon ve dinleyeni saran huzurlu nağmeler.", listens: "Rahmân Sûresi, Yâsîn Sûresi" },
    { id: "afasi", name: "Şeyh Mişârî Râşid el-Afâsî", country: "Kuveyt", style: "Stüdyo & Aşır", desc: "Net harf telaffuzları, melodik Nihavend ve Uşşak icraları.", listens: "Kehf Sûresi, Duhâ Sûresi" },
    { id: "gamidi", name: "Şeyh Sa'd el-Gâmidî", country: "Suudi Arabistan", style: "Sakin Tedvîr", desc: "Hafızlık tekrarı ve mukabele dinlemesi için son derece dengeli ve sakin bir sürat.", listens: "Cüz 1-30 Mukabele kayıtları" }
  ];

  // ===========================================================================
  // 5.9.5 TİLAVET MAKAMLARI DERİN REHBERİ
  // ===========================================================================
  const ASISTAN_MAKAMS_EXP = [
    { id: "rast", name: "Rast Makamı", karar: "G3 (Sol / Rast)", guclu: "D4 (Re / Nevâ)", duygu: "Ferahlık, vakar, teslimiyet, sevinç", ayetler: "Fâtiha, Duhâ, İnşirâh, müjde ve cennet âyetleri", gecki: "Uşşak veya Segâh'a geçiş son derece doğaldır." },
    { id: "ussak", name: "Uşşak Makamı", karar: "A3 (La / Dügâh)", guclu: "D4 (Re / Nevâ)", duygu: "Sıcaklık, tevazu, samimiyet, kalbî yakınlık", ayetler: "Namaz tilavetleri, öğüt ve kıssa âyetleri", gecki: "Hicaz veya Bayatî ile çok yakın akrabadır." },
    { id: "bayati", name: "Bayatî Makamı", karar: "A3 (La / Dügâh)", guclu: "D4 (Re / Nevâ)", duygu: "Hüzün, vakar, derinlik ve huşû", ayetler: "Mülk, Yâsîn, Nebe ve tefekkür âyetleri", gecki: "Sabâ veya Hicaz geçkileriyle rikkati artırır." },
    { id: "hicaz", name: "Hicaz Makamı", karar: "A3 (La / Dügâh)", guclu: "D4 (Re / Nevâ)", duygu: "Yakarış, haşyet, heybet ve tevbe hissi", ayetler: "Kıyamet, azap uyarıları, kabir ve ilâhî celâl âyetleri", gecki: "Rast veya Uşşak'a yumuşak bir kararla bağlanabilir." },
    { id: "segah", name: "Segâh Makamı", karar: "B3d (Si 1 Koma Bemol / Segâh)", guclu: "D4 (Re / Nevâ)", duygu: "Mistik, uhrevî, iç huzuru, ruhanî derinlik", ayetler: "Âyetü'l-Kürsî, Rahmân, Kadir ve dua âyetleri", gecki: "Müstakil icra edilir, hüzzam nağmeleriyle zenginleşir." },
    { id: "saba", name: "Sabâ Makamı", karar: "A3 (La / Dügâh)", guclu: "C4 (Do / Çargâh)", duygu: "İçli hüzün, pişmanlık, gözyaşı ve niyaz", ayetler: "Geçmiş kavimlerin helâki, kıyamet ve cehennem tasvirleri", gecki: "Hicaz dörtlüsü üzerinden seyreder." },
    { id: "nihavend", name: "Nihâvend Makamı", karar: "G3 (Sol / Rast)", guclu: "D4 (Re / Nevâ)", duygu: "Tatlı duygusallık, asalet, dinginlik (minör tını)", ayetler: "Kıssalar, cennet ırmakları ve nimet tasvirleri", gecki: "Kürdî veya Rast ile dengelenir." },
    { id: "kurdi", name: "Kürdî Makamı", karar: "A3 (La / Dügâh)", guclu: "D4 (Re / Nevâ)", duygu: "Hüzünlü, akıcı, modern ve sade", ayetler: "Geceleri yapılan hüzünlü tilavetler", gecki: "Hicaz veya Uşşak geçkileri yapılabilir." },
    { id: "huseyni", name: "Hüseynî Makamı", karar: "A3 (La / Dügâh)", guclu: "E4 (Mi / Hüseynî)", duygu: "Mertlik, vakar, ferahlık ve ulviyet", ayetler: "Cihad, zafer, tevhid ve azamet âyetleri", gecki: "Uşşak dizisiyle karar verir." },
    { id: "acem", name: "Acem Makamı", karar: "F4 (Fa / Acem) / Rast", guclu: "A4 (La / Gerdâniye)", duygu: "Coşku, parlaklık, nurlu ve açık atmosfer", ayetler: "Müjde, sevinç ve hamd âyetleri", gecki: "Beyâtî veya Uşşak üzerine parlak bir perde olarak kullanılır." }
  ];

  // ===========================================================================
  // 5.9.6 KOMBİNATÖRİK BİLGİ VE SENARYO SENTEZ MOTORU
  // ===========================================================================
  function synthesizeCombinatorialAnswer(q, rawQuery) {
    // 1. Sûre Tespiti
    const matchedSurah = ASISTAN_SURAHS.find(s => {
      const normName = trNormalize(s.name);
      return q.includes(normName) || (normName.length >= 4 && q.split(' ').includes(normName));
    });

    // 2. Makam Tespiti
    const matchedMakam = ASISTAN_MAKAMS_EXP.find(m => {
      const normM = trNormalize(m.id);
      return q.includes(normM);
    });

    // 3. Harf Tespiti
    const matchedLetter = ASISTAN_LETTERS.find(l => {
      const normL = trNormalize(l.name.split(' ')[0]);
      return q.includes(`${normL} harfi`) || q.includes(`${normL} mahrec`) || q.includes(`${normL} nasil`) || (normL.length >= 3 && q.split(' ').includes(normL));
    });

    // 4. Kâri Tespiti
    const matchedReciter = ASISTAN_RECITERS.find(r => {
      const normR = trNormalize(r.name);
      const words = normR.split(' ');
      return words.some(w => w.length > 4 && q.includes(w)) || q.includes(r.id);
    });

    // 5. Zaman / Çalışma Süresi Tespiti
    const timeMatch = q.match(/\b(5|10|15|20|25|30|45|60)\s*(dk|dakika|dakikalik)\b/);

    // 6. Ses ve Nefes Sağlığı Tespiti
    const isVocalHealth = /\b(ses kisik|sesim kisildi|bogaz agrisi|bogazim aciyor|sesim yoruluyor|nefesim yetmiyor|diyafram nasil|ses telleri|vokal hijyen|ses isinmasi|sesimi nasil acarim|nefes egzersizi)\b/.test(q);

    // 7. Durak ve Secavend Tespiti
    const isDurak = /\b(secavend|durak|vakif|mim duragi|ta duragi|cim duragi|ze duragi|sad duragi|la duragi|sekte)\b/.test(q);

    // SENARYO A: SÛRE + MAKAM BİLEŞİMİ
    if (matchedSurah && matchedMakam) {
      return {
        text: `📖 ${matchedSurah.name} Sûresi & 🎵 ${matchedMakam.name} Meşki\n\n` +
          `• Karakter Uyumu: ${matchedSurah.name} sûresi (${matchedSurah.type}, ${matchedSurah.ayet} âyet), ${matchedMakam.name}'nın ${matchedMakam.duygu} atmosferiyle son derece ahenkli bir icra sunar.\n` +
          `• Karar ve Seyir: ${matchedMakam.karar} perdesinde karar kılarak başlayın; güçlü perdesi olan ${matchedMakam.guclu} üzerinde cümlenin mânâ vurgusunu verin.\n` +
          `• Tecvid Dikkat Noktası: ${matchedSurah.tecvid} kurallarını makam nağmelerine kurban etmeyin; tecvid daima makamın önündedir.\n` +
          `• Geçki Önerisi: Âyet geçişlerinde ${matchedMakam.gecki}`,
        references: [`Tilavet Akademisi Makam Atlası`, `TDV İslâm Ansiklopedisi: Makâmât fî Tilâveti'l-Kur'ân`],
        options: [
          { label: `${matchedSurah.name} sûresi detayları`, query: `${matchedSurah.name} suresi ozellikleri` },
          { label: `${matchedMakam.name} özellikleri`, query: `${matchedMakam.id} makamı özellikleri` },
          { label: "20 dk tilavet planı", query: "20 dakikalık çalışma planı" }
        ]
      };
    }

    // SENARYO B: SÛRE + TECVİD / SEKTE / ÖZEL KELİME BİLEŞİMİ
    if (matchedSurah && (q.includes('tecvid') || q.includes('sekte') || q.includes('kural') || q.includes('okunus'))) {
      return {
        text: `📖 ${matchedSurah.name} Sûresi — Tecvid & Vakıf İncelemesi\n\n` +
          `• Temel Bilgiler: ${matchedSurah.no}. Sûre, ${matchedSurah.type} dönemde nâzil olmuştur ve ${matchedSurah.ayet} âyettir.\n` +
          `• Öne Çıkan Hükümler: ${matchedSurah.tecvid}\n` +
          `• Mânâ ve Muhteva: ${matchedSurah.desc}\n` +
          `• Tavsiye Edilen Tilavet Makamı: ${matchedSurah.makam}\n\n` +
          `💡 Püf Noktası: Bu sûreyi okurken vakıf yerlerinde nefesinizi tazeleyin, harflerin mahrecini aceleye getirmeksizin tertîl ile eda edin.`,
        references: [`Mushaf-ı Şerîf Tedkik ve Kıraat Kurulu Rehberi`, `İbnü'l-Cezerî, en-Neşr`],
        options: [
          { label: `${matchedSurah.name} hangi makamda okunur?`, query: `${matchedSurah.name} suresi hangi makamda okunur?` },
          { label: "4 Vâcip Sekte", query: "Kur'an'daki 4 sekte" },
          { label: "Özel kelimeler atlası", query: "Özel kelimeler" }
        ]
      };
    }

    // SENARYO C: SADECE SÛRE SORULDUĞUNDA
    if (matchedSurah && (q.includes('hakkinda') || q.includes('nedir') || q.includes('anlat') || q.includes('ozellik') || q.includes('sure') || q.split(' ').length <= 3)) {
      return {
        text: `📖 ${matchedSurah.no}. ${matchedSurah.name} Sûresi (${matchedSurah.ar})\n\n` +
          `• İniş Yeri & Âyet: ${matchedSurah.type} sûredir, toplam ${matchedSurah.ayet} âyetten oluşur.\n` +
          `• Özeti: ${matchedSurah.desc}\n` +
          `• Tilavette Öne Çıkan Makamlar: ${matchedSurah.makam}\n` +
          `• Dikkat Edilecek Tecvidler: ${matchedSurah.tecvid}`,
        references: [`Diyanet Kur'an Yolu Tefsiri`, `Tilavet Akademisi Sûre Rehberi`],
        options: [
          { label: `${matchedSurah.name} tecvid incelikleri`, query: `${matchedSurah.name} suresinde hangi tecvidler var?` },
          { label: `${matchedSurah.name} makam meşki`, query: `${matchedSurah.name} suresi hangi makamda okunur?` },
          { label: "Günlük tilavet planı", query: "20 dakikalık çalışma planı" }
        ]
      };
    }

    // SENARYO D: HARF + MAHREÇ / TELAFFUZ
    if (matchedLetter) {
      return {
        text: `🔤 ${matchedLetter.name} Harfi (${matchedLetter.ar}) Fonetik ve Mahreç Rehberi\n\n` +
          `• Mahreç Yeri: ${matchedLetter.mahrec}\n` +
          `• Sıfatları: ${matchedLetter.sifat}\n` +
          `• Kalınlık/İncelik: ${matchedLetter.kalin ? 'Kalın (Mufahham / İsti\'lâ)' : 'İnce (Murakkak / İstifâl)'}\n` +
          `• Telaffuz Püf Noktası: ${matchedLetter.tips}\n\n` +
          `💡 Alıştırma: Harfi önce cezimli (ör. “Eb”, “Et”, “E'”), ardından sırasıyla üstün, esre ve ötre ile ayna karşısında çalışın.`,
        references: [`el-Cezeriyye, Bâbu Mahârici'l-Hurûf`, `Tilavet Akademisi Fonetik Atölyesi`],
        options: [
          { label: "Kalkale harfleri", query: "Kalkale kuralı nedir?" },
          { label: "Mahreçler modülü", query: "Mahreç ve harflerin çıkış yerleri" },
          { label: "Lahn çeşitleri", query: "Lahn-ı Celî ve Lahn-ı Hafî" }
        ]
      };
    }

    // SENARYO E: KÂRÎ / KURRÂ BİLGİSİ
    if (matchedReciter) {
      return {
        text: `🎙 ${matchedReciter.name} Tilavet Ekolü\n\n` +
          `• Ülke ve Ekol: ${matchedReciter.country} — ${matchedReciter.style}\n` +
          `• Üslûp Karakteri: ${matchedReciter.desc}\n` +
          `• Örnek Dinleme Sûreleri: ${matchedReciter.listens}\n\n` +
          `💡 Öğrenci Tavsiyesi: Bu kârinin okuyuşunu taklit ederken harf netliğine ve nefes tasarrufuna dikkat edin. Kendi doğal ses sınırlarınızı zorlamadan meşk edin.`,
        references: [`Âlemü'l-Kurrâ Ansiklopedisi`, `Tilavet Akademisi Kâri Atlası`],
        options: [
          { label: "Tahkîk ve Hadr farkı", query: "Tilavet mertebeleri" },
          { label: "Nefes ve ses yönetimi", query: "Güvenli nefes ve ses çalışması" },
          { label: "Rast makamı özellikleri", query: "Rast makamı özellikleri" }
        ]
      };
    }

    // SENARYO F: ZAMAN BAZLI ÇALIŞMA PLANI (5, 10, 15, 20, 30, 45, 60 DK)
    if (timeMatch) {
      const mins = parseInt(timeMatch[1], 10);
      let planText = "";
      if (mins <= 10) {
        planText = `• 1-2 dk: Sakin burun nefesi ve gevşeme.\n• 2 dk: Yumuşak dudak trili ve mırıldanma (humming) ile ses ısınması.\n• 6 dk: Kısa bir sûrede (ör. Fâtiha veya Duhâ) tecvid odaklı yavaş okuyuş.`;
      } else if (mins <= 20) {
        planText = `• 2 dk: Diyafram nefes tazelemesi; omuzları kasmadan rahat nefes.\n• 2 dk: Lip trill ve ses teli ısınması.\n• 8 dk: Tecvid kurallarını (İzhâr, İhfâ, Kalkale) hedefleyen odaklı tilavet.\n• 8 dk: Seçtiğiniz makamda (ör. Rast veya Uşşak) ses sınırınızı zorlamadan aşır meşki.`;
      } else if (mins <= 35) {
        planText = `• 3 dk: Vokal açma ve nefes eşgüdümü.\n• 10 dk: Yeni ezberlenecek veya pekiştirilecek âyetlerin hecelenerek dinlenmesi.\n• 10 dk: Ezber tekrarı (5'li usul: dünün dersi + son sayfalar).\n• 7 dk: Aşır tarzında huşû ile tilavet ve vakıf tatbikatı.`;
      } else {
        planText = `• 5 dk: Kapsamlı ses ısınması ve nefes disiplini.\n• 15 dk: Tecvid incelikleri, lahn tespiti ve özel kelimeler (sekte, imale, teshil).\n• 20 dk: Makam geçkileri (Bayati -> Saba -> Hicaz) ile uzun nefes aşır çalışması.\n• 5 dk: Ses dinlendirme, oda sıcaklığında su tüketimi ve vokal soğuma.`;
      }
      return {
        text: `⏱ ${mins} Dakikalık Özel Tilavet ve Meşk Programı\n\n${planText}\n\n💡 Öneri: Çalışırken boğazınızda yanma veya batma hissederseniz derhal durup ses istirahati yapın.`,
        references: [`Tilavet Akademisi Pedagojik Öğretim Tasarımı`],
        options: [
          { label: "Nefes egzersizi", query: "Güvenli nefes ve ses çalışması" },
          { label: "Tecvid kuralları", query: "İzhâr kuralı nedir?" },
          { label: "Rast makamı", query: "Rast makamı özellikleri" }
        ]
      };
    }

    // SENARYO G: SES VE NEFES SAĞLIĞI
    if (isVocalHealth) {
      return {
        text: `🎙 Tilavette Ses & Nefes Sağlığı İlkeleri\n\n` +
          `• Diyafram Kullanımı: Nefes alırken omuzlarınızı ve göğsünüzü yukarı kaldırmayın; karın kaslarınızı ve alt kaburgalarınızı rahatça yana doğru genişletin.\n` +
          `• Boğaz Ağrısı & Kısıklık: Asla kısık veya ağrıyan sesin üzerine okumaya devam etmeyin. Boğazınızı öksürerek temizlemek ses tellerine çarpar; bunun yerine bir yudum ılık su için.\n` +
          `• Vokal Hijyen: Tilavet öncesi aşırı soğuk, aşırı sıcak, acı veya koyu çay/kahve tüketmeyin. Oda sıcaklığında su için.\n` +
          `• Sabah Isınması: Sabah tilavetinden önce 3 dakika yumuşak dudak trili (lip trill) ve hafif mırıldanma (humming) yapın.`,
        references: [`Prof. Dr. Erol Belgin, Ses Hijyeni ve Vokal Sağlık`, `Tilavet Akademisi Ses Atölyesi`],
        options: [
          { label: "20 dk çalışma planı", query: "20 dakikalık çalışma planı" },
          { label: "Fem-i Muhsin ilkesi", query: "Fem-i Muhsin ilkesi nedir?" },
          { label: "Makam rehberi", query: "Makamlar tilavette nasıl kullanılır?" }
        ]
      };
    }

    // SENARYO H: VAKIF & SECAVEND DURAKLARI
    if (isDurak) {
      return {
        text: `⏸ Kur'an Tilavetinde Secavend Durak İşaretleri\n\n` +
          `• (م) Lâzım Vakıf: Durulması şarttır; geçilirse mânâ karışabilir.\n` +
          `• (ط) Mutlak Vakıf: Durmak evlâdır; cümlenin mânâsı tamamlanmıştır.\n` +
          `• (ج) Câiz Vakıf: Durmak da geçmek de caizdir; durmak daha efdaldir.\n` +
          `• (ز) Mücevvez Vakıf: Geçmek evlâ, durmak caizdir.\n` +
          `• (ص) Murahhas Vakıf: Nefes yetmezse zaruret sebebiyle durulabilir.\n` +
          `• (لا) Lâ Vakfı: Durulmaz; nefes bitip durulursa geriden alınarak devam edilir.\n` +
          `• (∴ ∴) Mu'âneka (Üç Nokta): Birbirine yakın iki yerde bulunur; birinde durulursa diğerinde geçilir.`,
        references: [`İmam Muhammed b. Tayfur es-Secâvendî, Kitâbü'l-Vakf ve'l-İbtidâ`],
        options: [
          { label: "Kur'an'daki 4 sekte", query: "Kur'an'daki 4 sekte" },
          { label: "Lahn çeşitleri", query: "Lahn-ı Celî ve Lahn-ı Hafî" },
          { label: "20 dk plan", query: "20 dakikalık çalışma planı" }
        ]
      };
    }

    return null;
  }

  function queryAsistan(queryText) {
    const q = trNormalize(queryText);
    if (/^\d{1,2}$/.test(q) && pendingAsistanOptions.length) {
      const selected = pendingAsistanOptions[Number(q) - 1];
      if (selected) return queryAsistan(selected.query);
    }

    if (!q || ['yardim', 'yardim et', 'menu', 'menü', 'konular', 'konu sec', 'konu seç', 'bilmiyorum'].includes(q)) {
      return {
        text: 'Elbette. Aşağıdaki konu başlıklarından birini seçebilir ya da kendi cümlenle sorunu yazabilirsin. Sorunu anlayamazsam yakın seçenekler sunarım; 1, 2, 3 diye yanıtlayarak da seçim yapabilirsin.',
        references: [],
        options: ASISTAN_TOPICS.map(topic => ({ label: `${topic.icon} ${topic.label}`, query: `Konu menüsü: ${topic.id}` }))
      };
    }

    const topicMenuMatch = q.match(/^konu menusu\s*:?\s*(.+)$/);
    if (topicMenuMatch) {
      const topic = ASISTAN_TOPICS.find(item => item.id === topicMenuMatch[1]);
      if (topic) {
        return {
          text: `${topic.icon} ${topic.label}\n\nBu başlıkta şu sorularla başlayabilirsin:`,
          references: [],
          options: getTopicOptions(topic)
        };
      }
    }

    if (/\b(anlamadim|tekrar anlat|daha basit|baska turlu anlat)\b/.test(q)) {
      return {
        text: 'Sorun değil; farklı bir yoldan ilerleyelim. Konuyu basitleştirmemi, örnekle açıklamamı ya da kısa bir alıştırma yapmamı seçebilirsin. İstersen sorunu bir cümleyle yeniden yaz.',
        references: [],
        options: [
          { label: 'Daha basit anlat', query: 'yardım:basit' },
          { label: 'Örnekle açıkla', query: 'yardım:örnek' },
          { label: 'Kısa alıştırma', query: 'yardım:alıştırma' },
          { label: 'Konu menüsünü aç', query: 'yardım' }
        ]
      };
    }

    if (q.startsWith('yardim basit') || q.startsWith('yardim ornek') || q.startsWith('yardim alistirma')) {
      const method = q.startsWith('yardim basit') ? 'basit' : (q.startsWith('yardim ornek') ? 'ornek' : 'alistirma');
      const lastUserMessage = [...asistanChatHistory].reverse().find(message => message.sender === 'user');
      const userMessages = asistanChatHistory.filter(message => message.sender === 'user');
      const previousQuery = userMessages.length > 1 ? userMessages[userMessages.length - 2].text : (lastUserMessage ? lastUserMessage.text : '');
      const previousAnswer = [...asistanChatHistory].reverse().find(message => message.sender === 'assistant' && message.references && message.references.length);
      const priorReply = previousAnswer ? previousAnswer.text : '';
      if (method === 'basit') {
        const firstThought = priorReply.split(/\n+/).map(line => line.trim()).find(line => line && !line.startsWith(''));
        return { text: `Kısaca: ${firstThought || 'Bu konuyu birlikte adım adım çalışabiliriz.'}\n\nHangi kelime veya adım karışık geldi?`, references: previousAnswer ? previousAnswer.references : [], options: [{ label: 'Örnekle açıkla', query: `Örnek: ${previousQuery}` }, { label: 'Konu menüsü', query: 'yardım' }] };
      }
      if (method === 'ornek') {
        return { text: priorReply ? `Örnek üzerinden ilerleyelim:\n\n${priorReply}` : 'Bir örnek hazırlayabilmem için hangi kuralı veya konuyu çalıştığını yazar mısın?', references: previousAnswer ? previousAnswer.references : [], options: previousQuery ? [{ label: 'Önceki soruyu tekrar aç', query: previousQuery }] : [] };
      }
      return { text: 'Mini alıştırma hazırlamam için konuyu ve seviyeni yaz (ör. “başlangıç, ihfâ alıştırması”). Doğru cevabı açıklamasıyla birlikte vereceğim.', references: [], options: getTopicOptions(ASISTAN_TOPICS.find(topic => topic.id === 'tecvid')) };
    }

    // Fetva veya fıkıh kontrolü (Theological Guardrail)
    const fatwaWords = ['fetva', 'helal mi', 'haram mi', 'caiz mi', 'gunah mi', 'namaz bozulur mu', 'abdest bozar mi', 'namazim kabul', 'abdestim gecerli', 'oruç bozulur mu', 'oruc bozulur mu'];
    const specificFiqhQuestion = /(?:namaz|abdest|oruc|zekat|hac|gusul|teyemmum).{0,40}(?:bozul|gecerli|kabul|sahih|caiz|helal|haram|gunah|farz|vacip)/.test(q) || /\b(hayiz|cunup|lohusa|regl)\b/.test(q);
    if (fatwaWords.some(w => q.includes(trNormalize(w))) || specificFiqhQuestion) {
      return {
        text: "Sorunuz fıkhî bir hüküm veya fetva içermektedir. Tilavet Asistanı yalnızca tecvid, fonetik, makam ve pedagojik ses eğitimi alanında rehberlik sağlar.\n\nFıkhî hüküm ve fetvalar için lütfen Diyanet İşleri Başkanlığı Din İşleri Yüksek Kurulu'na (Alo 190 Fetva Hattı) veya yetkili müftülüklere başvurunuz.",
        references: ["Diyanet İşleri Başkanlığı Din İşleri Yüksek Kurulu"],
        isWarning: true
      };
    }

    // Bilgi tabanında arama (en spesifik anahtar kelime öncelikli)
    let match = null;
    let bestKeywordLen = 0;
    for (const item of ASISTAN_KB) {
      for (const k of item.keywords) {
        const normK = trNormalize(k);
        if (normK && q.includes(normK) && normK.length > bestKeywordLen) {
          match = item;
          bestKeywordLen = normK.length;
        }
      }
    }
    const kbReply = match ? { text: match.answer, title: match.title, references: match.references, options: match.options, go: match.go } : null;

    // Uzun ve belirgin bir eşleşme varsa doğrudan onu ver
    if (kbReply && bestKeywordLen >= 9) return kbReply;

    // 1. Gündelik konuşmalar (selam, hal hatır, teşekkür, veda)
    const dailyReply = matchDailyDialogue(q, queryText);
    if (dailyReply) return dailyReply;

    // 2. Sûre, makam, harf, kâri, süre ve ses sorularını birleştiren cevaplar
    const synthReply = synthesizeCombinatorialAnswer(q, queryText);
    if (synthReply) return synthReply;

    if (kbReply) return kbReply;

    const dataResults = searchAsistanData(q);
    if (dataResults.length) {
      const best = dataResults[0];
      const choices = dataResults.slice(1).filter(item => item.score >= best.score - 2)
        .map(item => ({ label: item.title, query: item.title }));
      return {
        text: `${best.text}\n\nBu açıklama uygulamanın ${best.source} içerik havuzundan bulundu. Ayrıntılı telaffuz ve uygulama için hocadan dinleyerek çalış.`,
        references: [`Tilavet Akademisi — ${best.source}`],
        options: choices.length ? choices : undefined
      };
    }

    const nearbyTopics = getAsistanTopicMatches(q);
    const nearbyAnswers = rankAsistanChoices(q);
    const topicOptions = nearbyTopics.length
      ? nearbyTopics.slice(0, 3).map(({ topic }) => ({ label: `${topic.icon} ${topic.label}`, query: `Konu menüsü: ${topic.id}` }))
      : [];
    const answerOptions = nearbyAnswers.slice(0, Math.max(0, 3 - topicOptions.length));
    const options = [...answerOptions, ...topicOptions].slice(0, 4);
    if (options.length) {
      return {
        text: `Sorunu tam olarak eşleştiremedim. Şunlardan hangisini kastettin? İstersen seçeneğin numarasını yaz veya sorunu başka kelimelerle ifade et.`,
        references: [],
        options
      };
    }

    return {
      text: `“${queryText}” sorusunu henüz anlayamadım. Daha iyi yardımcı olmam için konuyu seçebilir, önemli bir kelime ekleyebilir ya da sorunu daha kısa yazabilirsin. Fıkhî ve kişisel dinî hükümler için güvenilir bir âlim veya yetkili kuruma danış.`,
      references: ["Tilavet Akademisi Rehberi"],
      options: ASISTAN_TOPICS.map(topic => ({ label: `${topic.icon} ${topic.label}`, query: `Konu menüsü: ${topic.id}` }))
    };
  }

  // WhatsApp düzeninde sohbet: başlık, duvar kâğıdı, balonlar, hızlı yanıt düğmeleri, yazma çubuğu
  const WA_ICONS = {
    back: 'M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z',
    list: 'M3 5h2v2H3zm4 0h14v2H7zM3 11h2v2H3zm4 0h14v2H7zm-4 6h2v2H3zm4 0h14v2H7z',
    more: 'M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    send: 'M2 21 23 12 2 3v7l15 2-15 2z',
    plus: 'M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z',
    close: 'M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7l-1.4-1.4L9.2 12 2.9 5.7l1.4-1.4 6.3 6.3 6.3-6.3z',
    lock: 'M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 0 1 6 0v3z',
    arrow: 'M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5z',
    trash: 'M9 3h6l1 1h4v2H4V4h4zm-3 5h12l-1 13H7z',
    info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2zm0-8h-2V7h2z'
  };
  const WA_TOPIC_COLORS = ['#7f66ff', '#00a884', '#ff2e74', '#007bfc', '#c861f9', '#ffbc38', '#02a698', '#ff7f50', '#53bdeb'];
  const waIcon = (name, cls = '') => `<svg class="wa-ic ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${WA_ICONS[name]}"/></svg>`;
  const WA_MOSQUE = `<svg class="wa-avatar-svg" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8c1.8 4 6 6.2 6 11.3 0 2.2-1 4-2.4 5.2H28.4C27 23.3 26 21.5 26 19.3 26 14.2 30.2 12 32 8zM31 3h2v4h-2zM14 30a6 6 0 0 1 6-6h24a6 6 0 0 1 6 6v2H14zm-6 4h48v22H40V44a8 8 0 0 0-16 0v12H8zM6 12h2v20H6zm-1.5 0L7 6l2.5 6zM56 12h2v20h-2zm-1.5 0L57 6l2.5 6z"/></svg>`;

  function waFormat(text) {
    const clean = String(text || '').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '').trim();
    const lines = clean.split('\n');
    let html = '';
    let inList = false;
    lines.forEach(line => {
      const t = line.trim();
      const bullet = t.match(/^(?:[-•]|\d+\.)\s+(.*)$/);
      const esc = (str) => escapeAsistanHtml(str).replace(/([؀-ۿݐ-ݿࢠ-ࣿ][؀-ۿݐ-ݿࢠ-ࣿ\sً-ٰٟۖ-ۭ]*)/g, '<span class="wa-ar" lang="ar" dir="rtl">$1</span>');
      if (bullet) {
        if (!inList) { html += '<ul class="wa-list">'; inList = true; }
        html += `<li>${esc(bullet[1])}</li>`;
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        if (t) html += `<p>${esc(t)}</p>`;
      }
    });
    if (inList) html += '</ul>';
    return html;
  }

  function waMessageHtml(m) {
    const mine = m.sender === 'user';
    const opts = (m.options || []).slice(0, 6);
    return `
      <div class="wa-row ${mine ? 'is-out' : 'is-in'}${m.isWarning ? ' is-warn' : ''}" data-msg="${escapeAsistanHtml(m.id || '')}">
        <div class="wa-bubble">
          ${m.title && !mine ? `<div class="wa-title">${escapeAsistanHtml(m.title)}</div>` : ''}
          <div class="wa-text">${waFormat(m.text)}</div>
          ${m.references && m.references.length ? `<div class="wa-ref">Kaynak: ${m.references.map(escapeAsistanHtml).join(' · ')}</div>` : ''}
          <div class="wa-meta"><span>${escapeAsistanHtml(m.time || getAsistanNowTime())}</span>${mine ? '<svg class="wa-ticks" viewBox="0 0 18 12" aria-label="Okundu"><path d="M17.4 1.1 16.3.2 8.5 9.4 5.9 6.9 5 7.9l3.6 3.5zM12.6 1.1 11.5.2 3.6 9.4 1 6.9 0 7.9l3.7 3.5z"/></svg>' : ''}</div>
        </div>
        ${!mine && (m.go || opts.length) ? `
          <div class="wa-actions">
            ${m.go ? `<button type="button" class="wa-action wa-action--go" data-go='${escapeAsistanHtml(JSON.stringify(m.go))}'>${waIcon('arrow')}<span>${escapeAsistanHtml(m.go.label || 'Bölümü aç')}</span></button>` : ''}
            ${opts.map(o => `<button type="button" class="wa-action" data-q="${escapeAsistanHtml(o.query)}">${escapeAsistanHtml(String(o.label).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '').trim())}</button>`).join('')}
          </div>` : ''}
      </div>`;
  }

  function asistanOpenGo(go) {
    if (!go) return;
    if (go.tab) {
      if (typeof window.switchAppTab === 'function') window.switchAppTab(go.tab);
      else document.querySelector(`[data-tab="${go.tab}"]`)?.click();
      return;
    }
    openPratik(go);
  }

  function renderAsistanView() {
    const container = document.getElementById('akademi-view-asistan');
    if (!container) return;

    container.innerHTML = `
      <div class="wa-app" id="waApp">
        <header class="wa-header">
          <button type="button" class="wa-contact" id="waOpenInfo" aria-label="Asistan bilgileri">
            <span class="wa-avatar">${WA_MOSQUE}</span>
            <span class="wa-contact-text">
              <strong>Tilavet Asistanı</strong>
              <span class="wa-status" id="waStatus">çevrimiçi</span>
            </span>
          </button>
          <div class="wa-header-actions">
            <button type="button" class="wa-icon-btn" id="waOpenTopics" aria-label="Konular" title="Konular">${waIcon('list')}</button>
            <div class="wa-menu-wrap">
              <button type="button" class="wa-icon-btn" id="waMenuBtn" aria-label="Diğer" aria-haspopup="menu" aria-expanded="false" title="Diğer">${waIcon('more')}</button>
              <div class="wa-menu" id="waMenu" role="menu" hidden>
                <button type="button" role="menuitem" data-wa-menu="info">Asistan bilgileri</button>
                <button type="button" role="menuitem" data-wa-menu="topics">Konular</button>
                <button type="button" role="menuitem" data-wa-menu="clear">Sohbeti temizle</button>
              </div>
            </div>
          </div>
        </header>

        <div class="wa-chat" id="asistanMessagesBox" aria-live="polite">
          <div class="wa-wallpaper" aria-hidden="true">${WA_MOSQUE}</div>
          <div class="wa-day"><span>Bugün</span></div>
          <div class="wa-notice">${waIcon('lock')}<span>Bu asistan tilavet öğrenimine yardım eder. Bir hocanın canlı talimi yerine geçmez ve dinî hüküm (fetva) vermez.</span></div>
          <div id="waMessages">${asistanChatHistory.map(waMessageHtml).join('')}</div>
          <div class="wa-row is-in wa-typing" id="waTyping" hidden><div class="wa-bubble"><span></span><span></span><span></span></div></div>
        </div>

        <div class="wa-quick" id="waQuick" role="list" aria-label="Hızlı sorular">
          ${['Nereden başlamalıyım?', 'İzhâr nedir?', 'Med çeşitleri', 'Durak işaretleri', 'Kur’an’daki 4 sekte', 'Rast makamı', 'Ses ısınması', '20 dakikalık plan'].map(q => `<button type="button" class="wa-chip" role="listitem" data-q="${escapeAsistanHtml(q)}">${escapeAsistanHtml(q)}</button>`).join('')}
        </div>

        <form class="wa-composer" id="formAsistanChat" autocomplete="off">
          <button type="button" class="wa-icon-btn wa-attach" id="waAttach" aria-label="Konu seç" title="Konu seç">${waIcon('plus')}</button>
          <label class="wa-input">
            <input type="text" id="inputAsistanQuery" placeholder="Mesaj yazın" maxlength="500" aria-label="Asistana mesaj yazın">
          </label>
          <button type="submit" class="wa-send" aria-label="Gönder">${waIcon('send')}</button>
        </form>

        <div class="wa-sheet" id="waTopics" hidden>
          <div class="wa-sheet-scrim" data-wa-close></div>
          <div class="wa-sheet-panel" role="dialog" aria-label="Konular">
            <div class="wa-sheet-head"><strong>Konular</strong><button type="button" class="wa-icon-btn" data-wa-close aria-label="Kapat">${waIcon('close')}</button></div>
            <div class="wa-topic-grid">
              ${ASISTAN_TOPICS.map((t, i) => `
                <button type="button" class="wa-topic" data-q="Konu menüsü: ${escapeAsistanHtml(t.id)}">
                  <span class="wa-topic-dot" style="--c:${WA_TOPIC_COLORS[i % WA_TOPIC_COLORS.length]}">${escapeAsistanHtml(t.label.charAt(0))}</span>
                  <span>${escapeAsistanHtml(t.label)}</span>
                </button>`).join('')}
            </div>
          </div>
        </div>

        <aside class="wa-info" id="waInfo" hidden aria-label="Asistan bilgileri">
          <div class="wa-info-head"><button type="button" class="wa-icon-btn" data-wa-close-info aria-label="Kapat">${waIcon('close')}</button><strong>Asistan bilgileri</strong></div>
          <div class="wa-info-body">
            <div class="wa-info-hero"><span class="wa-avatar wa-avatar--xl">${WA_MOSQUE}</span><strong>Tilavet Asistanı</strong><span>Tilavet, tecvid ve makam rehberi</span></div>
            <section><h4>Hakkında</h4><p>Tecvid kuralları, harfler, medler, duraklar, makam, ses ve nefes, ezber ve uygulamanın kullanımı hakkında sorularınızı yanıtlar. Cevaplar uygulamadaki içeriklere ve klasik tecvid kaynaklarına dayanır.</p></section>
            <section><h4>Sınırlar</h4><p>Bir hocanın (fem-i muhsin) canlı talimi yerine geçmez. Namaz, abdest, oruç gibi konularda kişisel hüküm vermez; bunlar için Diyanet’in Alo 190 hattına veya müftülüklere yönlendirir.</p></section>
            <section><h4>Gizlilik</h4><p>Yazdıklarınız bu cihazda işlenir, hiçbir yere gönderilmez. Sayfa yenilenince sohbet silinir.</p></section>
            <button type="button" class="wa-danger" data-wa-menu="clear">${waIcon('trash')}<span>Sohbeti temizle</span></button>
          </div>
        </aside>
      </div>
    `;

    const chat = document.getElementById('asistanMessagesBox');
    const list = document.getElementById('waMessages');
    const typing = document.getElementById('waTyping');
    const status = document.getElementById('waStatus');
    const input = document.getElementById('inputAsistanQuery');
    const topics = document.getElementById('waTopics');
    const info = document.getElementById('waInfo');
    const menu = document.getElementById('waMenu');
    const menuBtn = document.getElementById('waMenuBtn');
    const toBottom = () => { if (chat) chat.scrollTop = chat.scrollHeight; };
    toBottom();

    let busy = false;
    function append(m) {
      list.insertAdjacentHTML('beforeend', waMessageHtml(m));
      toBottom();
    }
    function send(query) {
      const q = String(query || '').trim();
      if (!q || busy) return;
      const userMsg = { id: 'u-' + Date.now(), sender: 'user', text: q, time: getAsistanNowTime() };
      asistanChatHistory.push(userMsg);
      append(userMsg);
      const reply = queryAsistan(q);
      pendingAsistanOptions = reply.options || [];
      busy = true;
      typing.hidden = false;
      status.textContent = 'yazıyor…';
      toBottom();
      const delay = Math.min(1400, 450 + String(reply.text || '').length * 1.2);
      setTimeout(() => {
        typing.hidden = true;
        status.textContent = 'çevrimiçi';
        const botMsg = { id: 'a-' + Date.now(), sender: 'assistant', text: reply.text, title: reply.title, references: reply.references, options: reply.options, go: reply.go, isWarning: reply.isWarning, time: getAsistanNowTime() };
        asistanChatHistory.push(botMsg);
        append(botMsg);
        busy = false;
      }, delay);
    }
    function closeAll() {
      topics.hidden = true;
      info.hidden = true;
      menu.hidden = true;
      menuBtn.setAttribute('aria-expanded', 'false');
    }
    function clearChat() {
      asistanChatHistory = [{ id: 'init', sender: 'assistant', text: 'Sohbet temizlendi. Yeni bir soru yazabilir ya da aşağıdan bir konu seçebilirsiniz.', time: getAsistanNowTime(), options: ASISTAN_TOPICS.slice(0, 4).map(t => ({ label: t.label, query: `Konu menüsü: ${t.id}` })) }];
      pendingAsistanOptions = [];
      list.innerHTML = asistanChatHistory.map(waMessageHtml).join('');
      closeAll();
    }

    document.getElementById('formAsistanChat').addEventListener('submit', (e) => {
      e.preventDefault();
      send(input.value);
      input.value = '';
      input.focus();
    });
    container.querySelector('#waApp').addEventListener('click', (e) => {
      const go = e.target.closest('[data-go]');
      if (go) { try { asistanOpenGo(JSON.parse(go.getAttribute('data-go'))); } catch (_) {} return; }
      const q = e.target.closest('[data-q]');
      if (q) { closeAll(); send(q.getAttribute('data-q')); return; }
      const m = e.target.closest('[data-wa-menu]');
      if (m) {
        const act = m.getAttribute('data-wa-menu');
        closeAll();
        if (act === 'clear') clearChat();
        if (act === 'topics') topics.hidden = false;
        if (act === 'info') info.hidden = false;
        return;
      }
      if (e.target.closest('[data-wa-close]')) { topics.hidden = true; return; }
      if (e.target.closest('[data-wa-close-info]')) { info.hidden = true; return; }
      if (!e.target.closest('.wa-menu-wrap')) { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); }
    });
    menuBtn.addEventListener('click', () => {
      const open = menu.hidden;
      menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    document.getElementById('waOpenTopics').addEventListener('click', () => { closeAll(); topics.hidden = false; });
    document.getElementById('waAttach').addEventListener('click', () => { closeAll(); topics.hidden = false; });
    document.getElementById('waOpenInfo').addEventListener('click', () => { closeAll(); info.hidden = false; });
    container.querySelector('#waApp').addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
  }

  // ===========================================================================
  // 6. SAĞ AÇILIR GEZİNTİ ÇEKMECESİ VE YÖNETİCİ BARI YÖNETİMİ
  // ===========================================================================
  function openSideNavDrawer() {
    const drawer = document.getElementById('sideNavDrawer');
    const backdrop = document.getElementById('sideNavBackdrop');
    if (!drawer || !backdrop || document.querySelector('.app-shell')?.dataset.activeTab !== 'tab-akademi') return;
    drawer.classList.add('active');
    backdrop.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    document.getElementById('btnOpenSideDrawer')?.setAttribute('aria-expanded', 'true');
    syncDrawerActiveTree(state.activeSubView || 'yolculuk');

    // Aktif modüle hafifçe odaklan veya kaydır
    const activeNode = drawer.querySelector('.drawer-acc-node.active-module');
    if (activeNode) {
      activeNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function closeSideNavDrawer() {
    const drawer = document.getElementById('sideNavDrawer');
    const backdrop = document.getElementById('sideNavBackdrop');
    if (!drawer || !backdrop) return;
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    document.getElementById('btnOpenSideDrawer')?.setAttribute('aria-expanded', 'false');
  }

  function toggleSideNavDrawer() {
    const drawer = document.getElementById('sideNavDrawer');
    if (drawer?.classList.contains('active')) {
      closeSideNavDrawer();
    } else {
      openSideNavDrawer();
    }
  }

  window.openSideNavDrawer = openSideNavDrawer;
  window.closeSideNavDrawer = closeSideNavDrawer;
  window.toggleSideNavDrawer = toggleSideNavDrawer;

  function initSideNavDrawer() {
    // Drawer yalnızca Akademi içindeki tek tetikleyiciden açılır.
    document.getElementById('btnOpenSideDrawer')?.addEventListener('click', (e) => {
      e.preventDefault();
      toggleSideNavDrawer();
    });

    document.querySelectorAll('.nav-tab-btn[data-tab], .mobile-nav-item[data-tab]').forEach((button) => {
      button.addEventListener('click', () => {
        if (button.getAttribute('data-tab') !== 'tab-akademi') closeSideNavDrawer();
      });
    });

    document.getElementById('btnCloseSideDrawer')?.addEventListener('click', (e) => {
      e.preventDefault();
      closeSideNavDrawer();
    });

    document.getElementById('sideNavBackdrop')?.addEventListener('click', () => {
      closeSideNavDrawer();
    });

    // 2. Klavye Kısayolları (M: Aç/Kapat, Escape: Kapat)
    window.addEventListener('keydown', (e) => {
      const activeEl = document.activeElement;
      const activeTag = activeEl ? activeEl.tagName.toLowerCase() : '';
      const isInput = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select' || activeEl?.isContentEditable;
      
      if (e.key === 'Escape') {
        const drawer = document.getElementById('sideNavDrawer');
        if (drawer?.classList.contains('active')) {
          closeSideNavDrawer();
        }
      } else if ((e.key === 'm' || e.key === 'M') && !isInput && !e.ctrlKey && !e.altKey && !e.metaKey
        && document.querySelector('.app-shell')?.dataset.activeTab === 'tab-akademi') {
        e.preventDefault();
        toggleSideNavDrawer();
      }
    });

    // 3. Hızlı Modül Seçici (Dropdown)
    const quickSelect = document.getElementById('akademiQuickModuleSelect');
    quickSelect?.addEventListener('change', () => {
      if (quickSelect.value) {
        switchAkademiSubView(quickSelect.value);
      }
    });


    // 6. Drawer Akordiyon Açma/Kapama (Toggle Chevron)
    document.querySelectorAll('.drawer-node-toggle').forEach(toggleBtn => {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const parentNode = toggleBtn.closest('.drawer-acc-node');
        if (!parentNode) return;
        const isExp = parentNode.classList.toggle('expanded');
        toggleBtn.setAttribute('aria-expanded', isExp ? 'true' : 'false');
      });
    });

    // 7. Drawer Modül Butonları (Tıklayınca o modüle geç ve alt menüyü genişlet)
    document.querySelectorAll('.drawer-module-btn').forEach(modBtn => {
      modBtn.addEventListener('click', () => {
        const viewId = modBtn.getAttribute('data-view');
        if (!viewId) return;

        // Akademi sekmesine geçildiğinden emin ol
        if (typeof window.switchAppTab === 'function') {
          window.switchAppTab('tab-akademi');
        }

        switchAkademiSubView(viewId);

        // İlgili akordiyon düğümünü açık yap
        const parentNode = modBtn.closest('.drawer-acc-node');
        if (parentNode) {
          parentNode.classList.add('expanded');
          const toggle = parentNode.querySelector('.drawer-node-toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // 8. Drawer Alt Menü Elemanları (Sub-Link Routing)
    document.querySelectorAll('.drawer-sub-btn').forEach(subBtn => {
      subBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const moduleName = subBtn.getAttribute('data-module');
        const makamId = subBtn.getAttribute('data-makam');
        const subTab = subBtn.getAttribute('data-sub');
        const tecvidCat = subBtn.getAttribute('data-tecvid-cat');
        const stationId = subBtn.getAttribute('data-station');
        const schoolId = subBtn.getAttribute('data-school');
        const imamId = subBtn.getAttribute('data-imam');
        const action = subBtn.getAttribute('data-action');

        // Önce Akademi sekmesini aç
        if (typeof window.switchAppTab === 'function') {
          window.switchAppTab('tab-akademi');
        }

        if (moduleName) {
          if (state.activeSubView !== moduleName) {
            switchAkademiSubView(moduleName);
          }
        }

        // İlgili alt eylemi tetikle
        if (makamId) {
          state.selectedMakam = makamId;
          saveState();
          renderMakamView();
        updateExecutiveBarAndDrawer('makam');
          if (window.showToast) {
            const mObj = typeof MAKAMLAR !== 'undefined' ? MAKAMLAR.find(m => m.id === makamId) : null;
            window.showToast(` ${mObj ? mObj.names.tr : makamId.toUpperCase()} Makamı seçildi.`);
          }
        } else if (subTab) {
          if (moduleName === 'elifba') {
            activeElifbaTab = subTab;
            renderElifbaView();
          } else if (moduleName === 'teknik') {
            activeTeknikTab = subTab;
            renderTeknikView();
          } else if (moduleName === 'san') {
            activeSanTab = subTab;
            renderSanView();
          }
        } else if (tecvidCat) {
          activeTecvidCategory = tecvidCat;
          renderTecvidView();
        } else if (stationId) {
          activeStudioStation = stationId;
          renderStudyoView();
        } else if (schoolId) {
          activeReciterSchool = schoolId;
          renderDinlemeView();
        } else if (action === 'toggle-mini-mushaf') {
          const btnMini = document.getElementById('btnToggleMiniMushaf');
          if (btnMini) btnMini.click();
          else if (window.showMiniMushafForRule) window.showMiniMushafForRule('izhar', false);
        } else if (action?.startsWith('scroll-')) {
          const targetSection = action.replace('scroll-', '');
          const targetEl = document.querySelector(`.yolculuk-${targetSection}-section`) || document.querySelector(`#yolculuk-${targetSection}`);
          if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
        }

        updateExecutiveBarAndDrawer(moduleName || state.activeSubView);

        // Bir ders seçildiğinde hedefe ulaşıldı: çekmece her ekran boyutunda kapanır.
        // (Bölüm başlığına tıklamak ise alt dersleri göstermek için çekmeceyi açık bırakır.)
        closeSideNavDrawer();
      });
    });

    // 9. Canlı Arama ve Filtreleme
    const searchInput = document.getElementById('drawerSearchInput');
    const searchClear = document.getElementById('drawerSearchClear');
    
    searchInput?.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      if (searchClear) searchClear.style.display = q ? 'block' : 'none';

      document.querySelectorAll('.drawer-acc-node').forEach(node => {
        if (!q) {
          node.style.display = 'block';
          const isAct = node.classList.contains('active-module');
          node.classList.toggle('expanded', isAct);
          const toggle = node.querySelector('.drawer-node-toggle');
          if (toggle) toggle.setAttribute('aria-expanded', isAct ? 'true' : 'false');
          node.querySelectorAll('.drawer-sub-btn').forEach(sub => sub.style.display = 'flex');
          return;
        }

        const title = node.querySelector('.node-title')?.textContent?.toLowerCase() || '';
        const desc = node.querySelector('.node-desc')?.textContent?.toLowerCase() || '';
        const subButtons = node.querySelectorAll('.drawer-sub-btn');
        let hasSubMatch = false;

        subButtons.forEach(sub => {
          const subText = sub.textContent?.toLowerCase() || '';
          if (subText.includes(q)) {
            hasSubMatch = true;
            sub.style.display = 'flex';
          } else {
            sub.style.display = 'none';
          }
        });

        if (title.includes(q) || desc.includes(q) || hasSubMatch) {
          node.style.display = 'block';
          node.classList.add('expanded');
          const toggle = node.querySelector('.drawer-node-toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'true');
          if (title.includes(q) || desc.includes(q)) {
            subButtons.forEach(sub => sub.style.display = 'flex');
          }
        } else {
          node.style.display = 'none';
        }
      });
    });

    searchClear?.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
      }
    });
  }

  // ===========================================================================
  // 7. AKADEMİ BAŞLATICI (INITIALIZATION)
  // ===========================================================================
  // v5 düzeltmesi: init her Akademi girişinde çağrılıyordu ve dinleyicileri tekrar tekrar
  // bağlıyordu (menü düğmesi bir açılıp bir açılmıyordu). Veri bir kez yüklenir,
  // dinleyiciler bir kez bağlanır; sonraki girişlerde yalnızca etkin görünüm yenilenir.
  let akademiDataPromise = null;
  let akademiListenersBound = false;
  async function initTilavetAkademi() {
    if (!akademiDataPromise) akademiDataPromise = loadAkademiData();
    await akademiDataPromise;

    if (akademiListenersBound) {
      switchAkademiSubView(state.activeSubView || 'yolculuk');
      return;
    }
    akademiListenersBound = true;

    // Alt navigasyon ve Çekmece dinleyicilerini bağla
    initSideNavDrawer();

    document.querySelectorAll('.akademi-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = btn.getAttribute('data-view');
        if (viewId) switchAkademiSubView(viewId);
      });
    });

    // İlk alt görünümü aç
    switchAkademiSubView(state.activeSubView || 'yolculuk');
  }

  // Tecvid Kuralı ile Mushaf'a Gitme ve Vurgulama Köprüsü
  window.openMushafAndHighlightRule = async function(surahNo, ayahNo, ruleName, ruleFamily, forceFullTab = false) {
    surahNo = parseInt(surahNo, 10) || 1;
    ayahNo = parseInt(ayahNo, 10) || 1;

    // Eğer tam sayfa zorlanmamışsa, kullanıcıyı bulunduğu ekrandan koparmadan
    // sağ taraftaki yer değiştirilebilir küçük Mushaf penceresinde göster
    if (!forceFullTab && typeof window.showMiniMushafForAyah === 'function') {
      window.showMiniMushafForAyah(surahNo, ayahNo, ruleName, ruleFamily);
      if (window.showToast) {
        window.showToast(` ${ruleName || 'Tecvid örneği'} sağdaki küçük Mushaf penceresinde açıldı.`);
      }
      return;
    }

    // 1. Mushaf sekmesine geç
    if (typeof window.switchAppTab === 'function') {
      window.switchAppTab('tab-tilavet');
    }

    // 2. Sure ve Ayeti Mushaf sayfasında bul ve aç
    if (typeof window.locateAndSelectSurahAyah === 'function') {
      await window.locateAndSelectSurahAyah(surahNo, ayahNo);
    }

    // 3. İlgili tecvid kelimelerini parlat (pulse efekti)
    setTimeout(() => {
      // Önceki vurguları temizle
      document.querySelectorAll('.tajweed-highlight-pulse').forEach(el => {
        el.classList.remove('tajweed-highlight-pulse');
      });

      const targetSpan = document.querySelector(`.page-ayah-span[data-surah="${surahNo}"][data-ayah="${ayahNo}"]`);
      if (targetSpan) {
        let ruleEls = targetSpan.querySelectorAll(`.tajweed-${ruleFamily}`);
        if (!ruleEls || ruleEls.length === 0) {
          ruleEls = targetSpan.querySelectorAll('[class*="tajweed-"]');
        }
        if (ruleEls && ruleEls.length > 0) {
          ruleEls.forEach(el => el.classList.add('tajweed-highlight-pulse'));
        } else {
          targetSpan.classList.add('tajweed-highlight-pulse');
        }
        targetSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      if (window.showToast) {
        window.showToast(` ${ruleName} kuralı Mushaf sayfasında vurgulandı.`);
      }
      if (typeof window.triggerLiveTajweedFeedback === 'function') {
        window.triggerLiveTajweedFeedback(` ${ruleName} kuralı Mushaf sayfasında inceleniyor (${surahNo}:${ayahNo}).`, 'SUCCESS');
      }

      // 4 saniye sonra göz yormaması ve Mushaf sükunetini korumak için parlamayı nazikçe temizle (Claude Karar 4)
      setTimeout(() => {
        document.querySelectorAll('.tajweed-highlight-pulse').forEach(el => {
          el.classList.remove('tajweed-highlight-pulse');
        });
      }, 4000);
    }, 400);
  };

  // Dışa aktar
  window.TilavetAkademiEngine = {
    init: initTilavetAkademi,
    switchSubView: switchAkademiSubView,
    openDrawer: openSideNavDrawer,
    closeDrawer: closeSideNavDrawer,
    toggleDrawer: toggleSideNavDrawer,
    getState: () => state,
    saveState,
    isStudioMicActive: () => Boolean(isStudioMicActive)
  };

  // Kolay erişim için doğrudan window üzerine de köprüle
  window.switchAkademiSubView = switchAkademiSubView;
  window.openPlacementTestModal = openPlacementTestModal;
  window.openLessonModal = openLessonModal;
  window.closeLessonModal = closeLessonModal;

})(window);
