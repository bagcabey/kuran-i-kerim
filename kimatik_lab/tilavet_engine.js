/**
 * CYMATIQUE - Kur'an-ı Kerim Tilavet & Tecvid Denetleme Motoru
 * 114 Sure, Uthmani Metin, Kelime Kelime Tecvid Analizi ve Canlı Hata Bildirimi
 */

// =========================================================
// MERKEZİ SES KOORDİNATÖRÜ (GLOBAL AUDIO MANAGER)
// - Projedeki tüm ses kaynaklarının (Mushaf, Akademi, Dinleme Salonu, Makam, Elifba vb.) tek elden yönetimi
// - Seslerin üst üste binmesini %100 önler
// - Sekme geçişlerinde ve arka planda hayalet sesleri temizler
// =========================================================
const TilavetAudioManager = (function() {
  const registeredPlayers = new Map();
  let currentActiveId = null;

  // Akış tercihi: 'auto_advance' (kesintisiz devam) | 'stay_on_ayah' (seçili âyette sabit kal)
  let flowMode = 'auto_advance';
  try {
    const saved = localStorage.getItem('cymatique_playback_flow_mode');
    if (saved === 'stay_on_ayah' || saved === 'auto_advance') {
      flowMode = saved;
    }
  } catch(_) {}

  return {
    getFlowMode() {
      return flowMode;
    },
    setFlowMode(mode) {
      if (mode === 'auto_advance' || mode === 'stay_on_ayah') {
        flowMode = mode;
        try { localStorage.setItem('cymatique_playback_flow_mode', mode); } catch(_) {}
        this.updateFlowUI();
      }
    },
    toggleFlowMode() {
      const newMode = (flowMode === 'auto_advance') ? 'stay_on_ayah' : 'auto_advance';
      this.setFlowMode(newMode);
      if (typeof window.showToast === 'function') {
        const msg = (newMode === 'auto_advance')
          ? ' Kesintisiz Akış Modu Açıldı (Âyet ve sayfalar otomatik devam eder)'
          : ' Sabit Kal Modu Açıldı (Seçili âyet bitince durur, meşk için beklenir)';
        window.showToast(msg);
      }
      return newMode;
    },
    updateFlowUI() {
      const textEl = document.getElementById('flowModeText');
      const btn = document.getElementById('btnTogglePlaybackFlow');
      if (flowMode === 'auto_advance') {
        if (textEl) textEl.textContent = 'Kesintisiz Akış';
        if (btn) {
          btn.title = 'Şu an: Kesintisiz Akış Modu (Âyet ve sayfa bitince otomatik devam eder). Tıklayarak Sabit Kal moduna geçin.';
          btn.style.borderColor = 'var(--accent-gold)';
          btn.style.color = 'var(--accent-gold)';
          btn.style.background = 'rgba(229, 184, 105, 0.12)';
        }
      } else {
        if (textEl) textEl.textContent = 'Âyette Sabit Kal';
        if (btn) {
          btn.title = 'Şu an: Sabit Kal Modu (Seçili âyet bitince durur, meşk için sabit kalınır). Tıklayarak Kesintisiz Akışa geçin.';
          btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          btn.style.color = '#94a3b8';
          btn.style.background = 'rgba(255, 255, 255, 0.04)';
        }
      }
    },
    register(id, playerObj) {
      registeredPlayers.set(id, playerObj);
    },
    unregister(id) {
      registeredPlayers.delete(id);
    },
    notifyPlay(sourceId) {
      currentActiveId = sourceId;
      registeredPlayers.forEach((player, id) => {
        if (id !== sourceId && typeof player.stop === 'function') {
          try { player.stop(); } catch(e) { console.warn(`[AudioManager] Error stopping ${id}:`, e); }
        }
      });
    },
    stopAll(reason = 'manual') {
      currentActiveId = null;
      registeredPlayers.forEach((player, id) => {
        if (typeof player.stop === 'function') {
          try { player.stop(reason); } catch(e) { console.warn(`[AudioManager] Error stopping ${id}:`, e); }
        }
      });
    },
    getActiveSource() {
      return currentActiveId;
    }
  };
})();
window.TilavetAudioManager = TilavetAudioManager;

// Tüm 114 Sure Listesi (İsim, Sure No, Ayet Sayısı, Nüzul Yeri)
const SURAH_LIST = [
  { no: 1, name: "Fâtiha", arabic: "الفاتحة", ayahs: 7, place: "Mekke" },
  { no: 2, name: "Bakara", arabic: "البقرة", ayahs: 286, place: "Medine" },
  { no: 3, name: "Âl-i İmrân", arabic: "آل عمران", ayahs: 200, place: "Medine" },
  { no: 4, name: "Nisâ", arabic: "النساء", ayahs: 176, place: "Medine" },
  { no: 5, name: "Mâide", arabic: "المائدة", ayahs: 120, place: "Medine" },
  { no: 6, name: "En'âm", arabic: "الأنعام", ayahs: 165, place: "Mekke" },
  { no: 7, name: "A'râf", arabic: "الأعراف", ayahs: 206, place: "Mekke" },
  { no: 8, name: "Enfâl", arabic: "الأنفال", ayahs: 75, place: "Medine" },
  { no: 9, name: "Tevbe", arabic: "التوبة", ayahs: 129, place: "Medine" },
  { no: 10, name: "Yûnus", arabic: "يونس", ayahs: 109, place: "Mekke" },
  { no: 11, name: "Hûd", arabic: "هود", ayahs: 123, place: "Mekke" },
  { no: 12, name: "Yûsuf", arabic: "يوسف", ayahs: 111, place: "Mekke" },
  { no: 13, name: "Ra'd", arabic: "الرعد", ayahs: 43, place: "Medine" },
  { no: 14, name: "İbrâhîm", arabic: "إبراهيم", ayahs: 52, place: "Mekke" },
  { no: 15, name: "Hicr", arabic: "الحجر", ayahs: 99, place: "Mekke" },
  { no: 16, name: "Nahl", arabic: "النحل", ayahs: 128, place: "Mekke" },
  { no: 17, name: "İsrâ", arabic: "الإسراء", ayahs: 111, place: "Mekke" },
  { no: 18, name: "Kehf", arabic: "الكهف", ayahs: 110, place: "Mekke" },
  { no: 19, name: "Meryem", arabic: "مريم", ayahs: 98, place: "Mekke" },
  { no: 20, name: "Tâhâ", arabic: "طه", ayahs: 135, place: "Mekke" },
  { no: 21, name: "Enbiyâ", arabic: "الأنبياء", ayahs: 112, place: "Mekke" },
  { no: 22, name: "Hac", arabic: "الحج", ayahs: 78, place: "Medine" },
  { no: 23, name: "Mü'minûn", arabic: "المؤمنون", ayahs: 118, place: "Mekke" },
  { no: 24, name: "Nûr", arabic: "النور", ayahs: 64, place: "Medine" },
  { no: 25, name: "Furkân", arabic: "الفرقان", ayahs: 77, place: "Mekke" },
  { no: 26, name: "Şuarâ", arabic: "الشعراء", ayahs: 227, place: "Mekke" },
  { no: 27, name: "Neml", arabic: "النمل", ayahs: 93, place: "Mekke" },
  { no: 28, name: "Kasas", arabic: "القصص", ayahs: 88, place: "Mekke" },
  { no: 29, name: "Ankebût", arabic: "العنكبوت", ayahs: 69, place: "Mekke" },
  { no: 30, name: "Rûm", arabic: "الروم", ayahs: 60, place: "Mekke" },
  { no: 31, name: "Lokmân", arabic: "لقمان", ayahs: 34, place: "Mekke" },
  { no: 32, name: "Secde", arabic: "السجدة", ayahs: 30, place: "Mekke" },
  { no: 33, name: "Ahzâb", arabic: "الأحزاب", ayahs: 73, place: "Medine" },
  { no: 34, name: "Sebe'", arabic: "سبإ", ayahs: 54, place: "Mekke" },
  { no: 35, name: "Fâtır", arabic: "فاطر", ayahs: 45, place: "Mekke" },
  { no: 36, name: "Yâsîn", arabic: "يس", ayahs: 83, place: "Mekke" },
  { no: 37, name: "Sâffât", arabic: "الصافات", ayahs: 182, place: "Mekke" },
  { no: 38, name: "Sâd", arabic: "ص", ayahs: 88, place: "Mekke" },
  { no: 39, name: "Zümer", arabic: "الزمر", ayahs: 75, place: "Mekke" },
  { no: 40, name: "Mü'min (Gâfir)", arabic: "غافر", ayahs: 85, place: "Mekke" },
  { no: 41, name: "Fussilet", arabic: "فصلت", ayahs: 54, place: "Mekke" },
  { no: 42, name: "Şûrâ", arabic: "الشورى", ayahs: 53, place: "Mekke" },
  { no: 43, name: "Zuhruf", arabic: "الزخرف", ayahs: 89, place: "Mekke" },
  { no: 44, name: "Duhân", arabic: "الدخان", ayahs: 59, place: "Mekke" },
  { no: 45, name: "Câsiye", arabic: "الجاثية", ayahs: 37, place: "Mekke" },
  { no: 46, name: "Ahkâf", arabic: "الأحقاف", ayahs: 35, place: "Mekke" },
  { no: 47, name: "Muhammed", arabic: "محمد", ayahs: 38, place: "Medine" },
  { no: 48, name: "Fetih", arabic: "الفتح", ayahs: 29, place: "Medine" },
  { no: 49, name: "Hucurât", arabic: "الحجرات", ayahs: 18, place: "Medine" },
  { no: 50, name: "Kâf", arabic: "ق", ayahs: 45, place: "Mekke" },
  { no: 51, name: "Zâriyât", arabic: "الذاريات", ayahs: 60, place: "Mekke" },
  { no: 52, name: "Tûr", arabic: "الطور", ayahs: 49, place: "Mekke" },
  { no: 53, name: "Necm", arabic: "النجم", ayahs: 62, place: "Mekke" },
  { no: 54, name: "Kamer", arabic: "القمر", ayahs: 55, place: "Mekke" },
  { no: 55, name: "Rahmân", arabic: "الرحمن", ayahs: 78, place: "Medine" },
  { no: 56, name: "Vâkıa", arabic: "الواقعة", ayahs: 96, place: "Mekke" },
  { no: 57, name: "Hadîd", arabic: "الحديد", ayahs: 29, place: "Medine" },
  { no: 58, name: "Mücâdele", arabic: "المجادلة", ayahs: 22, place: "Medine" },
  { no: 59, name: "Haşr", arabic: "الحشر", ayahs: 24, place: "Medine" },
  { no: 60, name: "Mümtehine", arabic: "الممتحنة", ayahs: 13, place: "Medine" },
  { no: 61, name: "Saff", arabic: "الصف", ayahs: 14, place: "Medine" },
  { no: 62, name: "Cuma", arabic: "الجمعة", ayahs: 11, place: "Medine" },
  { no: 63, name: "Münâfikûn", arabic: "المنافقون", ayahs: 11, place: "Medine" },
  { no: 64, name: "Teğâbün", arabic: "التغابن", ayahs: 18, place: "Medine" },
  { no: 65, name: "Talâk", arabic: "الطلاق", ayahs: 12, place: "Medine" },
  { no: 66, name: "Tahrîm", arabic: "التحريم", ayahs: 12, place: "Medine" },
  { no: 67, name: "Mülk (Tebâreke)", arabic: "الملك", ayahs: 30, place: "Mekke" },
  { no: 68, name: "Kalem", arabic: "القلم", ayahs: 52, place: "Mekke" },
  { no: 69, name: "Hâkka", arabic: "الحاقة", ayahs: 52, place: "Mekke" },
  { no: 70, name: "Meâric", arabic: "المعارج", ayahs: 44, place: "Mekke" },
  { no: 71, name: "Nûh", arabic: "نوح", ayahs: 28, place: "Mekke" },
  { no: 72, name: "Cin", arabic: "الجن", ayahs: 28, place: "Mekke" },
  { no: 73, name: "Müzzemmil", arabic: "المزمل", ayahs: 20, place: "Mekke" },
  { no: 74, name: "Müddessir", arabic: "المدثر", ayahs: 56, place: "Mekke" },
  { no: 75, name: "Kıyâme", arabic: "القيامة", ayahs: 40, place: "Mekke" },
  { no: 76, name: "İnsân", arabic: "الإنسان", ayahs: 31, place: "Medine" },
  { no: 77, name: "Mürselât", arabic: "المرسلات", ayahs: 50, place: "Mekke" },
  { no: 78, name: "Nebe (Amme)", arabic: "النبإ", ayahs: 40, place: "Mekke" },
  { no: 79, name: "Nâziât", arabic: "النازعات", ayahs: 46, place: "Mekke" },
  { no: 80, name: "Abese", arabic: "عبس", ayahs: 42, place: "Mekke" },
  { no: 81, name: "Tekvîr", arabic: "التكوير", ayahs: 29, place: "Mekke" },
  { no: 82, name: "İnfitâr", arabic: "الانفطار", ayahs: 19, place: "Mekke" },
  { no: 83, name: "Mutaffifîn", arabic: "المطففين", ayahs: 36, place: "Mekke" },
  { no: 84, name: "İnşikâk", arabic: "الانشقاق", ayahs: 25, place: "Mekke" },
  { no: 85, name: "Bürûc", arabic: "البروج", ayahs: 22, place: "Mekke" },
  { no: 86, name: "Târık", arabic: "الطارق", ayahs: 17, place: "Mekke" },
  { no: 87, name: "A'lâ", arabic: "الأعلى", ayahs: 19, place: "Mekke" },
  { no: 88, name: "Gâşiye", arabic: "الغاشية", ayahs: 26, place: "Mekke" },
  { no: 89, name: "Fecr", arabic: "الفجر", ayahs: 30, place: "Mekke" },
  { no: 90, name: "Beled", arabic: "البلد", ayahs: 20, place: "Mekke" },
  { no: 91, name: "Şems", arabic: "الشمس", ayahs: 15, place: "Mekke" },
  { no: 92, name: "Leyl", arabic: "الليل", ayahs: 21, place: "Mekke" },
  { no: 93, name: "Duhâ", arabic: "الضحى", ayahs: 11, place: "Mekke" },
  { no: 94, name: "İnşirâh", arabic: "الشرح", ayahs: 8, place: "Mekke" },
  { no: 95, name: "Tîn", arabic: "التين", ayahs: 8, place: "Mekke" },
  { no: 96, name: "Alak", arabic: "العلق", ayahs: 19, place: "Mekke" },
  { no: 97, name: "Kadir", arabic: "القدر", ayahs: 5, place: "Mekke" },
  { no: 98, name: "Beyyine", arabic: "البينة", ayahs: 8, place: "Medine" },
  { no: 99, name: "Zilzâl", arabic: "الزلزلة", ayahs: 8, place: "Medine" },
  { no: 100, name: "Âdiyât", arabic: "العاديات", ayahs: 11, place: "Mekke" },
  { no: 101, name: "Kâria", arabic: "القارعة", ayahs: 11, place: "Mekke" },
  { no: 102, name: "Tekâsür", arabic: "التكاثر", ayahs: 8, place: "Mekke" },
  { no: 103, name: "Asr", arabic: "العصر", ayahs: 3, place: "Mekke" },
  { no: 104, name: "Hümeze", arabic: "الهمزة", ayahs: 9, place: "Mekke" },
  { no: 105, name: "Fîl", arabic: "الفيل", ayahs: 5, place: "Mekke" },
  { no: 106, name: "Kureyş", arabic: "قريش", ayahs: 4, place: "Mekke" },
  { no: 107, name: "Mâûn", arabic: "الماعون", ayahs: 7, place: "Mekke" },
  { no: 108, name: "Kevser", arabic: "الكوثر", ayahs: 3, place: "Mekke" },
  { no: 109, name: "Kâfirûn", arabic: "الكافرون", ayahs: 6, place: "Mekke" },
  { no: 110, name: "Nasr", arabic: "النصر", ayahs: 3, place: "Medine" },
  { no: 111, name: "Tebbet (Mesed)", arabic: "المسد", ayahs: 5, place: "Mekke" },
  { no: 112, name: "İhlâs", arabic: "الإخلاص", ayahs: 4, place: "Mekke" },
  { no: 113, name: "Felak", arabic: "الفلق", ayahs: 5, place: "Mekke" },
  { no: 114, name: "Nâs", arabic: "الناس", ayahs: 6, place: "Mekke" }
];

// Çevrimdışı hazır Fâtiha Suresi (Kelime kelime detaylı tecvid ve Latin okunuş anotasyonları)
const PRELOADED_FATIHA = {
  surahNo: 1,
  name: "Fâtiha",
  bismillah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  ayahs: [
    {
      ayahNo: 1,
      textUthmani: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      latin: "Bismillâhir-rahmânir-rahîm",
      turkishMeal: "Rahmân ve Rahîm olan Allah'ın adıyla.",
      words: [
        { ar: "بِسْمِ", tajweed: null },
        { ar: "اللَّهِ", tajweed: { rule: "lafzatullah", desc: "Lafzatullah ince okunur" } },
        { ar: "الرَّحْمَٰنِ", tajweed: { rule: "madd-tabii", targetDurationMs: 400, desc: "1 Elif uzatma (Madd-i Tabii)" } },
        { ar: "الرَّحِيمِ ۝", tajweed: { rule: "madd-ariz", targetDurationMs: 1200, stop: true, desc: "Durakta 2-4 Elif uzatma ve durma" } }
      ]
    },
    {
      ayahNo: 2,
      textUthmani: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      latin: "El-hamdü lillâhi rabbil-'âlemîn",
      turkishMeal: "Hamd, Âlemlerin Rabbi olan Allah'a mahsustur.",
      words: [
        { ar: "الْحَمْدُ", tajweed: { rule: "izhar", desc: "İzhâr: Mim harfinde tutulmaz, net geçilir" } },
        { ar: "لِلَّهِ", tajweed: { rule: "lafzatullah", desc: "Lafzatullah ince okunur" } },
        { ar: "رَبِّ", tajweed: { rule: "ra-kalin", desc: "Ra harfi kalın okunur" } },
        { ar: "الْعَالَمِينَ ۝", tajweed: { rule: "madd-ariz", targetDurationMs: 1200, stop: true, desc: "Durakta en az 2-4 elif uzat ve dur" } }
      ]
    },
    {
      ayahNo: 3,
      textUthmani: "الرَّحْمَٰنِ الرَّحِيمِ",
      latin: "Er-rahmânir-rahîm",
      turkishMeal: "O, Rahmândır ve Rahîmdir.",
      words: [
        { ar: "الرَّحْمَٰنِ", tajweed: { rule: "madd-tabii", targetDurationMs: 400, desc: "1 elif uzatma" } },
        { ar: "الرَّحِيمِ ۝", tajweed: { rule: "madd-ariz", targetDurationMs: 1200, stop: true, desc: "Durakta uzatma ve durma" } }
      ]
    },
    {
      ayahNo: 4,
      textUthmani: "مَالِكِ يَوْمِ الدِّينِ",
      latin: "Mâliki yevmid-dîn",
      turkishMeal: "Ceza ve hesap gününün mâlikidir.",
      words: [
        { ar: "مَالِكِ", tajweed: { rule: "madd-tabii", targetDurationMs: 400, desc: "Mim harfini 1 elif uzat" } },
        { ar: "يَوْمِ", tajweed: { rule: "lin", desc: "Lîn harfi yumuşak okunur" } },
        { ar: "الدِّينِ ۝", tajweed: { rule: "madd-ariz", targetDurationMs: 1200, stop: true, desc: "Durak uzatması" } }
      ]
    },
    {
      ayahNo: 5,
      textUthmani: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      latin: "İyyâke na'büdü ve iyyâke neste'în",
      turkishMeal: "(Rabbimiz!) Ancak sana kulluk eder ve yalnız senden yardım dileriz.",
      words: [
        { ar: "إِيَّاكَ", tajweed: { rule: "sedde", desc: "Şeddeyi hakkıyla basarak oku" } },
        { ar: "نَعْبُدُ", tajweed: null },
        { ar: "وَإِيَّاكَ", tajweed: { rule: "sedde", desc: "Şeddeli ya" } },
        { ar: "نَسْتَعِينُ ۝", tajweed: { rule: "madd-ariz", targetDurationMs: 1200, stop: true, desc: "Ayet sonu durak ve uzatma" } }
      ]
    },
    {
      ayahNo: 6,
      textUthmani: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      latin: "İhdinas-sırâtal-müstakîm",
      turkishMeal: "Bizi doğru yola ilet.",
      words: [
        { ar: "اهْدِنَا", tajweed: null },
        { ar: "الصِّرَاطَ", tajweed: { rule: "kalin", desc: "Sad ve Ra harfleri kalın okunur" } },
        { ar: "الْمُسْتَقِيمَ ۝", tajweed: { rule: "madd-ariz", targetDurationMs: 1200, stop: true, desc: "Ayet sonu durak" } }
      ]
    },
    {
      ayahNo: 7,
      textUthmani: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
      latin: "Sırâtallezîne en'amte 'aleyhim, ğayril-mağdûbi 'aleyhim veled-dâllîn",
      turkishMeal: "Nimet verdiğin kimselerin yoluna; gazaba uğrayanların ve sapıtanların yoluna değil.",
      words: [
        { ar: "صِرَاطَ", tajweed: null },
        { ar: "الَّذِينَ", tajweed: { rule: "madd-tabii", targetDurationMs: 400, desc: "1 Elif uzatma" } },
        { ar: "أَنْعَمْتَ", tajweed: { rule: "izhar", desc: "İzhâr: Tutmadan, net oku" } },
        { ar: "عَلَيْهِمْ", tajweed: { rule: "izhar-sefevi", desc: "Dudak izhârı" } },
        { ar: "غَيْرِ", tajweed: null },
        { ar: "الْمَغْضُوبِ", tajweed: null },
        { ar: "عَلَيْهِمْ", tajweed: { rule: "vakif-caiz", desc: "Burada nefes biterse durulabilir (ج)" } },
        { ar: "وَلَا", tajweed: { rule: "madd-munfasil", targetDurationMs: 1200, desc: "Lâ harfini uzat (Madd-i Munfasıl)" } },
        { ar: "الضَّالِّينَ ۝", tajweed: { rule: "madd-lazim", targetDurationMs: 1800, stop: true, desc: "EN AZ 4-6 ELİF UZATMAN LAZIM! (Madd-i Lâzım)" } }
      ]
    }
  ]
};

// --- DOĞU ARAPÇA RAKAMLARI DÖNÜŞTÜRÜCÜ (RESİM 1 ROZETLERİ İÇİN) ---
function toArabicDigits(num) {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/[0-9]/g, d => arabicDigits[d]);
}

// 114 Sure Başlangıç Sayfaları Tablosu (Mushaf Standart 604 Sayfa)
const SURAH_START_PAGE = {
  1: 1, 2: 2, 3: 50, 4: 77, 5: 106, 6: 128, 7: 151, 8: 177, 9: 187, 10: 208,
  11: 221, 12: 235, 13: 249, 14: 255, 15: 262, 16: 267, 17: 282, 18: 293, 19: 305, 20: 312,
  21: 322, 22: 332, 23: 342, 24: 350, 25: 359, 26: 367, 27: 377, 28: 385, 29: 396, 30: 404,
  31: 411, 32: 415, 33: 418, 34: 428, 35: 434, 36: 440, 37: 446, 38: 453, 39: 458, 40: 467,
  41: 477, 42: 483, 43: 489, 44: 496, 45: 499, 46: 502, 47: 507, 48: 511, 49: 515, 50: 518,
  51: 520, 52: 523, 53: 526, 54: 528, 55: 531, 56: 534, 57: 537, 58: 542, 59: 545, 60: 549,
  61: 551, 62: 553, 63: 554, 64: 556, 65: 558, 66: 560, 67: 562, 68: 564, 69: 566, 70: 568,
  71: 570, 72: 572, 73: 574, 74: 575, 75: 577, 76: 578, 77: 580, 78: 582, 79: 583, 80: 585,
  81: 586, 82: 587, 83: 587, 84: 589, 85: 590, 86: 591, 87: 591, 88: 592, 89: 593, 90: 594,
  91: 595, 92: 595, 93: 596, 94: 596, 95: 597, 96: 597, 97: 598, 98: 598, 99: 599, 100: 599,
  101: 600, 102: 600, 103: 601, 104: 601, 105: 601, 106: 602, 107: 602, 108: 602, 109: 603,
  110: 603, 111: 603, 112: 604, 113: 604, 114: 604
};

function getJuzForPage(pageNum) {
  if (pageNum <= 21) return 1;
  if (pageNum <= 41) return 2;
  if (pageNum <= 61) return 3;
  return Math.min(30, Math.ceil((pageNum - 1) / 20));
}

function getEstimatedPageForAyah(surahNo, ayahNo) {
  if (surahNo === 2 && ayahNo >= 283) return 50;
  if (surahNo === 2 && ayahNo === 255) return 42;
  if (surahNo === 1) return 1;
  const startPage = SURAH_START_PAGE[surahNo] || 1;
  const sObj = SURAH_LIST.find(s => s.no === surahNo);
  if (!sObj || sObj.ayahs <= 1) return startPage;
  const nextSurahStart = SURAH_START_PAGE[surahNo + 1] || 604;
  const totalPagesInSurah = Math.max(1, nextSurahStart - startPage);
  const ratio = (ayahNo - 1) / sObj.ayahs;
  return Math.min(604, Math.max(1, Math.round(startPage + ratio * totalPagesInSurah)));
}

// RESİM 1: DİYANET BASKISI SAYFA 50 (BAKARA 283-286 / ÂMENERRASÛLÜ)
const PRELOADED_PAGE_50 = {
  pageNum: 50,
  surahNo: 2,
  surahName: "Bakara",
  arabicTitle: "سُورَةُ البَقَرَةِ",
  juzNo: 3,
  ayahs: [
    {
      surahNo: 2,
      ayahNo: 283,
      latin: "Ve in küntüm 'alâ seferiv-ve lem tecidû kâtiben ferihânüm-makbûdah, fe in emine ba'duküm ba'dan felyü'eddillezî'tümine emânetehû velyettekıllâhe rabbeh, ve lâ tektümüş-şehâdeh, ve mey-yektümhâ fe innehû âsimün kalbüh, vallâhü bimâ ta'melûne 'alîm.",
      turkishMeal: "Eğer yolculukta olur da bir kâtip bulamazsanız, o takdirde alınan rehinler yeterlidir. Birbirinize güvendiğiniz takdirde, kendisine güvenilen kimse emaneti tastamam ödesin ve Rabbi olan Allah'tan korksun. Şahitliği gizlemeyin; kim onu gizlerse şüphesiz onun kalbi günahkârdır. Allah yaptıklarınızı hakkıyla bilendir.",
      tajweedRules: [
        { word: "وَإِنْ كُنْتُمْ", rule: "İhfa (1.5 Elif)", desc: "Sâkin nun'dan sonra kef ve te harfleri gelmiştir, genizden tutulur." },
        { word: "فَرِهَانٌ مَقْبُوضَةٌ", rule: "İdgam-ı Meal Gunne", desc: "Tenvin'den sonra mim harfi gelmiştir, 1.5 elif tutulur." },
        { word: "اللَّهَ", rule: "Lafzatullâh", desc: "Üstün harften sonra geldiği için kalın okunur." },
        { word: "آثِمٌ قَلْبُهُ", rule: "İhfa (1.5 Elif)", desc: "Tenvin'den sonra kaf harfi gelmiştir." },
        { word: "عَلِيمٌ ۝", rule: "Madd-i Ârız (Durak)", desc: "Âyet sonunda 2-4 elif uzatılarak vakıf yapılır." }
      ],
      words: [
        { ar: "وَإِنْ", tajweed: { rule: "ihfa", desc: "İhfa: 1.5 Elif tut" } },
        { ar: "كُنْتُمْ", tajweed: { rule: "ihfa", desc: "İhfa: Nun'u genizden tut" } },
        { ar: "عَلَىٰ", tajweed: null },
        { ar: "سَفَرٍ", tajweed: null },
        { ar: "وَلَمْ", tajweed: null },
        { ar: "تَجِدُوا", tajweed: { rule: "kalkale", desc: "Kalkale: Cim harfini sarsarak çıkar" } },
        { ar: "كَاتِبًا", tajweed: null },
        { ar: "فَرِهَانٌ", tajweed: { rule: "ihfa", desc: "İdgam meal gunne" } },
        { ar: "مَقْبُوضَةٌ", tajweed: { rule: "kalkale", desc: "Kalkale: Kaf harfi" } },
        { ar: "ۖ", tajweed: { rule: "vakif", desc: "Vakf-ı Caiz: Durulabilir veya geçilebilir" } },
        { ar: "فَإِنْ", tajweed: null },
        { ar: "أَمِنَ", tajweed: null },
        { ar: "بَعْضُكُمْ", tajweed: null },
        { ar: "بَعْضًا", tajweed: null },
        { ar: "فَلْيُؤَدِّ", tajweed: null },
        { ar: "الَّذِي", tajweed: null },
        { ar: "اؤْتُمِنَ", tajweed: null },
        { ar: "أَمَانَتَهُ", tajweed: null },
        { ar: "وَلْيَتَّقِ", tajweed: null },
        { ar: "اللَّهَ", tajweed: { rule: "lafzatullah", desc: "Lafzatullâh kalın okunur" } },
        { ar: "رَبَّهُ", tajweed: null },
        { ar: "ۗ", tajweed: { rule: "vakif", desc: "Vakf-ı Mücevvez: Durmak evladır" } },
        { ar: "وَلَا", tajweed: null },
        { ar: "تَكْتُمُوا", tajweed: null },
        { ar: "الشَّهَادَةَ", tajweed: null },
        { ar: "ۚ", tajweed: { rule: "vakif", desc: "Vakf-ı Câiz" } },
        { ar: "وَمَنْ", tajweed: { rule: "ihfa", desc: "İdgam meal gunne" } },
        { ar: "يَكْتُمْهَا", tajweed: null },
        { ar: "فَإِنَّهُ", tajweed: { rule: "ihfa", desc: "Şeddeli Nun: Gunne" } },
        { ar: "آثِمٌ", tajweed: { rule: "ihfa", desc: "İhfa" } },
        { ar: "قَلْبُهُ", tajweed: null },
        { ar: "ۗ", tajweed: { rule: "vakif", desc: "Vakf-ı Mücevvez" } },
        { ar: "وَاللَّهُ", tajweed: { rule: "lafzatullah", desc: "Lafzatullâh kalın" } },
        { ar: "بِمَا", tajweed: null },
        { ar: "تَعْمَلُونَ", tajweed: null },
        { ar: "عَلِيمٌ", tajweed: { rule: "madd-ariz", desc: "Madd-i Ârız: 2-4 Elif uzat" } }
      ]
    },
    {
      surahNo: 2,
      ayahNo: 284,
      latin: "Lillâhi mâ fis-semâvâti ve mâ fil-ard, ve in tübdû mâ fî enfüsiküm ev tuhfûhü yühâsibküm bihillâh, fe yağfiru limey-yeşâ'ü ve yü'azzibü mey-yeşâ', vallâhü 'alâ külli şey'in kadîr.",
      turkishMeal: "Göklerde ve yerde ne varsa hepsi Allah'ındır. İçinizdekini açığa vursanız da gizleseniz de Allah sizi onunla hesaba çeker. Sonra dilediğini bağışlar, dilediğine de azap eder. Allah her şeye hakkıyla kadirdir.",
      tajweedRules: [
        { word: "لِلَّهِ", rule: "Lafzatullâh", desc: "Esreli harften sonra geldiği için ince okunur." },
        { word: "فِي أَنْفُسِكُمْ", rule: "Madd-i Munfasıl & İhfa", desc: "Ayrı kelimelerde hemze ve med harfi birleştiği için 4 elif uzatılır." },
        { word: "مَنْ يَشَاءُ", rule: "İdgam-ı Meal Gunne & Madd-i Muttasıl", desc: "Tek kelimede bitişik hemze: En az 4 elif uzatman lazım!" },
        { word: "قَدِيرٌ ۝", rule: "Madd-i Ârız & Kalkale", desc: "Dal harfi kalkale yapılır ve durakta 2-4 elif uzatılır." }
      ],
      words: [
        { ar: "لِلَّهِ", tajweed: { rule: "lafzatullah", desc: "Lafzatullah ince" } },
        { ar: "مَا", tajweed: null },
        { ar: "فِي", tajweed: null },
        { ar: "السَّمَاوَاتِ", tajweed: { rule: "madd-tabii", desc: "1 Elif uzatma" } },
        { ar: "وَمَا", tajweed: null },
        { ar: "فِي", tajweed: null },
        { ar: "الْأَرْضِ", tajweed: null },
        { ar: "ۗ", tajweed: { rule: "vakif", desc: "Durak" } },
        { ar: "وَإِنْ", tajweed: { rule: "ihfa", desc: "İhfa" } },
        { ar: "تُبْدُوا", tajweed: { rule: "kalkale", desc: "Kalkale: Be harfi" } },
        { ar: "مَا", tajweed: null },
        { ar: "فِي", tajweed: { rule: "madd-munfasil", desc: "Madd-i Munfasıl: 4 Elif" } },
        { ar: "أَنْفُسِكُمْ", tajweed: { rule: "ihfa", desc: "İhfa: 1.5 Elif" } },
        { ar: "أَوْ", tajweed: null },
        { ar: "تُخْفُوهُ", tajweed: null },
        { ar: "يُحَاسِبْكُمْ", tajweed: { rule: "kalkale", desc: "Kalkale: Be harfi" } },
        { ar: "بِهِ", tajweed: null },
        { ar: "اللَّهُ", tajweed: { rule: "lafzatullah", desc: "Lafzatullâh kalın" } },
        { ar: "ۖ", tajweed: { rule: "vakif", desc: "Vakf-ı Câiz" } },
        { ar: "فَيَغْفِرُ", tajweed: null },
        { ar: "لِمَنْ", tajweed: { rule: "ihfa", desc: "İdgam meal gunne" } },
        { ar: "يَشَاءُ", tajweed: { rule: "madd-muttasil", desc: "Madd-i Muttasıl: 4 Elif uzat!" } },
        { ar: "وَيُعَذِّبُ", tajweed: null },
        { ar: "مَنْ", tajweed: { rule: "ihfa", desc: "İdgam meal gunne" } },
        { ar: "يَشَاءُ", tajweed: { rule: "madd-muttasil", desc: "Madd-i Muttasıl: 4 Elif uzat!" } },
        { ar: "ۗ", tajweed: { rule: "vakif", desc: "Durak" } },
        { ar: "وَاللَّهُ", tajweed: { rule: "lafzatullah", desc: "Lafzatullâh" } },
        { ar: "عَلَىٰ", tajweed: null },
        { ar: "كُلِّ", tajweed: null },
        { ar: "شَيْءٍ", tajweed: { rule: "ihfa", desc: "İhfa" } },
        { ar: "قَدِيرٌ", tajweed: { rule: "madd-ariz", desc: "Madd-i Ârız durak" } }
      ]
    },
    {
      surahNo: 2,
      ayahNo: 285,
      latin: "Âmener-rasûlü bimâ ünzile ileyhi mir-rabbihî vel-mü'minûn, küllün âmene billâhi ve melâiketihî ve kütübihî ve rusulih, lâ nüferriku beyne ehadin mir-rusulih, ve kâlû semi'nâ ve ata'nâ gufrâneke rabbenâ ve ileykel-masîr.",
      turkishMeal: "Peygamber, Rabbinden kendisine indirilene iman etti, müminler de. Her biri Allah'a, meleklerine, kitaplarına ve peygamberlerine inandı. 'O'nun elçileri arasında hiçbirini ayırt etmeyiz' dediler ve eklediler: 'İşittik ve itaat ettik! Bağışlamanı dileriz ey Rabbimiz, dönüş yalnız sanadır!'",
      tajweedRules: [
        { word: "آمَنَ", rule: "Madd-i Bedel", desc: "1 Elif uzatma ile okunur." },
        { word: "أُنْزِلَ", rule: "İhfa (1.5 Elif)", desc: "Sâkin nun'dan sonra ze harfi gelmiştir, ses genizden tutulur." },
        { word: "مِنْ رَبِّهِ", rule: "İdgam-ı Bîla Gunne", desc: "Sâkin nun ra harfine katılır, tutulmadan net okunur." },
        { word: "وَمَلَائِكَتِهِ", rule: "Madd-i Muttasıl (4 Elif)", desc: "Kelime içinde med harfi ve kırık hemze: En az 4 elif uzatılmalıdır!" },
        { word: "الْمَصِيرُ ۝", rule: "Madd-i Ârız", desc: "Durak uzatması ve ra harfi ince sesle durulur." }
      ],
      words: [
        { ar: "آمَنَ", tajweed: { rule: "madd-tabii", desc: "Madd-i Bedel: 1 Elif" } },
        { ar: "الرَّسُولُ", tajweed: null },
        { ar: "بِمَا", tajweed: null },
        { ar: "أُنْزِلَ", tajweed: { rule: "ihfa", desc: "İhfa: 1.5 Elif tut" } },
        { ar: "إِلَيْهِ", tajweed: null },
        { ar: "مِنْ", tajweed: { rule: "izhar", desc: "İdgam bila gunne" } },
        { ar: "رَبِّهِ", tajweed: null },
        { ar: "وَالْمُؤْمِنُونَ", tajweed: null },
        { ar: "ۚ", tajweed: { rule: "vakif", desc: "Vakf-ı Câiz" } },
        { ar: "كُلٌّ", tajweed: { rule: "ihfa", desc: "İhfa" } },
        { ar: "آمَنَ", tajweed: null },
        { ar: "بِاللَّهِ", tajweed: { rule: "lafzatullah", desc: "Lafzatullah ince" } },
        { ar: "وَمَلَائِكَتِهِ", tajweed: { rule: "madd-muttasil", desc: "Madd-i Muttasıl: 4 Elif Uzat!" } },
        { ar: "وَكُتُبِهِ", tajweed: null },
        { ar: "وَرُسُلِهِ", tajweed: null },
        { ar: "لَا", tajweed: null },
        { ar: "نُفَرِّقُ", tajweed: null },
        { ar: "بَيْنَ", tajweed: null },
        { ar: "أَحَدٍ", tajweed: { rule: "izhar", desc: "İdgam bila gunne" } },
        { ar: "مِنْ", tajweed: { rule: "izhar", desc: "İdgam bila gunne" } },
        { ar: "رُسُلِهِ", tajweed: null },
        { ar: "ۚ", tajweed: { rule: "vakif", desc: "Vakf-ı Câiz" } },
        { ar: "وَقَالُوا", tajweed: null },
        { ar: "سَمِعْنَا", tajweed: null },
        { ar: "وَأَطَعْنَا", tajweed: { rule: "kalkale", desc: "Kalkale: Tâ harfi" } },
        { ar: "ۖ", tajweed: { rule: "vakif", desc: "Vakıf" } },
        { ar: "غُفْرَانَكَ", tajweed: null },
        { ar: "رَبَّنَا", tajweed: null },
        { ar: "وَإِلَيْكَ", tajweed: null },
        { ar: "الْمَصِيرُ", tajweed: { rule: "madd-ariz", desc: "Madd-i Ârız durak" } }
      ]
    },
    {
      surahNo: 2,
      ayahNo: 286,
      latin: "Lâ yükellifullâhü nefsen illâ vüs'ahâ, lehâ mâ kesebet ve 'aleyhâ mektesebet, rabbenâ lâ tüâhiznâ in nesînâ ev ahta'nâ, rabbenâ ve lâ tahmil 'aleynâ ısran kemâ hameltehû 'alellezîne min kablinâ, rabbenâ ve lâ tühammilnâ mâ lâ tâkate lenâ bih, va'fü 'annâ vağfir lenâ verhamnâ, ente mevlânâ fensurnâ 'alel-kavmil-kâfirîn.",
      turkishMeal: "Allah hiçbir kimseyi gücünün yetmediği bir şeyle yükümlü kılmaz. Kazandığı iyilik kendi lehine, işlediği kötülük de kendi aleyhinedir. 'Ey Rabbimiz! Unutur veya yanılırsak bizi sorumlu tutma! Ey Rabbimiz! Bize, bizden öncekilere yüklediğin gibi ağır yük yükleme! Ey Rabbimiz! Gücümüzün yetmeyeceği şeyleri bize taşıtma! Bizi affet, bizi bağışla, bize acı! Sen bizim Mevlâmızsın, kâfirler topluluğuna karşı bize yardım et!'",
      tajweedRules: [
        { word: "لَا يُكَلِّفُ اللَّهُ", rule: "Lafzatullâh", desc: "Ötreli harften sonra geldiği için kalın ve dolgun okunur." },
        { word: "نَفْسًا إِلَّا", rule: "İzhâr", desc: "Tenvin'den sonra boğaz harfi hemze geldiği için tutulmadan net okunur." },
        { word: "لَا تُؤَاخِذْنَا", rule: "Madd-i Munfasıl (4 Elif)", desc: "Ayrı kelimelerde med harfi ve hemze." },
        { word: "أَوْ أَخْطَأْنَا", rule: "Kalkale", desc: "Tâ harfi sarsarak cezimli çıkarılır." },
        { word: "مِنْ قَبْلِنَا", rule: "İhfa ve Kalkale", desc: "Nun harfi tutulur, Be harfi sarsılarak kuvvetli okunur." },
        { word: "وَاعْفُ عَنَّا", rule: "Şeddeli Gunne", desc: "Şeddeli nun 1.5 elif genizden tutulur." },
        { word: "الْكَافِرِينَ ۝", rule: "Madd-i Ârız", desc: "Sure ve sayfa sonu durak uzatması." }
      ],
      words: [
        { ar: "لَا", tajweed: null },
        { ar: "يُكَلِّفُ", tajweed: null },
        { ar: "اللَّهُ", tajweed: { rule: "lafzatullah", desc: "Lafzatullâh kalın" } },
        { ar: "نَفْسًا", tajweed: { rule: "izhar", desc: "İzhâr: Net geç" } },
        { ar: "إِلَّا", tajweed: null },
        { ar: "وُسْعَهَا", tajweed: null },
        { ar: "ۚ", tajweed: { rule: "vakif", desc: "Vakf-ı Câiz" } },
        { ar: "لَهَا", tajweed: null },
        { ar: "مَا", tajweed: null },
        { ar: "كَسَبَتْ", tajweed: null },
        { ar: "وَعَلَيْهَا", tajweed: null },
        { ar: "مَا", tajweed: null },
        { ar: "اكْتَسَبَتْ", tajweed: null },
        { ar: "ۗ", tajweed: { rule: "vakif", desc: "Durak" } },
        { ar: "رَبَّنَا", tajweed: null },
        { ar: "لَا", tajweed: { rule: "madd-munfasil", desc: "Madd-i Munfasıl" } },
        { ar: "تُؤَاخِذْنَا", tajweed: null },
        { ar: "إِنْ", tajweed: { rule: "ihfa", desc: "İdgam misleyn" } },
        { ar: "نَسِينَا", tajweed: null },
        { ar: "أَوْ", tajweed: null },
        { ar: "أَخْطَأْنَا", tajweed: { rule: "kalkale", desc: "Kalkale: Tâ harfi" } },
        { ar: "ۚ", tajweed: { rule: "vakif", desc: "Vakıf" } },
        { ar: "رَبَّنَا", tajweed: null },
        { ar: "وَلَا", tajweed: null },
        { ar: "تَحْمِلْ", tajweed: null },
        { ar: "عَلَيْنَا", tajweed: null },
        { ar: "إِصْرًا", tajweed: { rule: "izhar", desc: "İzhâr" } },
        { ar: "كَمَا", tajweed: null },
        { ar: "حَمَلْتَهُ", tajweed: null },
        { ar: "عَلَى", tajweed: null },
        { ar: "الَّذِينَ", tajweed: null },
        { ar: "مِنْ", tajweed: { rule: "ihfa", desc: "İhfa: 1.5 Elif" } },
        { ar: "قَبْلِنَا", tajweed: { rule: "kalkale", desc: "Kalkale: Be harfi" } },
        { ar: "ۚ", tajweed: { rule: "vakif", desc: "Vakıf" } },
        { ar: "رَبَّنَا", tajweed: null },
        { ar: "وَلَا", tajweed: null },
        { ar: "تُحَمِّلْنَا", tajweed: null },
        { ar: "مَا", tajweed: null },
        { ar: "لَا", tajweed: null },
        { ar: "طَاقَةَ", tajweed: null },
        { ar: "لَنَا", tajweed: null },
        { ar: "بِهِ", tajweed: null },
        { ar: "ۖ", tajweed: { rule: "vakif", desc: "Vakıf" } },
        { ar: "وَاعْفُ", tajweed: null },
        { ar: "عَنَّا", tajweed: { rule: "ihfa", desc: "Şeddeli Gunne" } },
        { ar: "وَاغْفِرْ", tajweed: null },
        { ar: "لَنَا", tajweed: null },
        { ar: "وَارْحَمْنَا", tajweed: null },
        { ar: "ۚ", tajweed: { rule: "vakif", desc: "Vakıf" } },
        { ar: "أَنْتَ", tajweed: { rule: "ihfa", desc: "İhfa" } },
        { ar: "مَوْلَانَا", tajweed: null },
        { ar: "فَانْصُرْنَا", tajweed: { rule: "ihfa", desc: "İhfa: Sad harfi" } },
        { ar: "عَلَى", tajweed: null },
        { ar: "الْقَوْمِ", tajweed: null },
        { ar: "الْكَافِرِينَ", tajweed: { rule: "madd-ariz", desc: "Madd-i Ârız: Sayfa Sonu Durak" } }
      ]
    }
  ]
};

// Çevrimdışı Hazır Sayfa 1 (Fâtiha Suresi)
const PRELOADED_PAGE_1 = {
  pageNum: 1,
  surahNo: 1,
  surahName: "Fâtiha",
  arabicTitle: "سُورَةُ الفَاتِحَةِ",
  juzNo: 1,
  ayahs: PRELOADED_FATIHA.ayahs.map(ay => ({
    surahNo: 1,
    ayahNo: ay.ayahNo,
    latin: ay.latin,
    turkishMeal: ay.turkishMeal,
    tajweedRules: ay.words.filter(w => w.tajweed).map(w => ({ word: w.ar, rule: w.tajweed.rule, desc: w.tajweed.desc })),
    words: ay.words
  }))
};

// Çevrimdışı Hazır Sayfa 2 (Bakara 1-5 / Elif-Lâm-Mîm - 0ms Açılış)
const PRELOADED_PAGE_2 = {
  pageNum: 2,
  surahNo: 2,
  surahName: "Bakara",
  arabicTitle: "سُورَةُ البَقَرَةِ",
  juzNo: 1,
  ayahs: [
    {
      surahNo: 2,
      ayahNo: 1,
      isSurahStart: true,
      bismillahText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      latin: "Alif-Lâm-Mîm",
      turkishMeal: "Elif, Lâm, Mîm.",
      tajweedRules: [
        { word: "الٓمٓ", rule: "Madd-i Lâzım (4-6 Elif)", desc: "Lâm ve Mîm harflerinde en az 4 elif uzatman lazım!" },
        { word: "الٓمٓ", rule: "İdgam-ı Misleyn Meal Gunne", desc: "Lâm ile Mîm arasında dudaklar kapanıp 1.5 elif tutulur." }
      ],
      words: [
        { ar: "الٓمٓ", tajweed: { rule: "madd-lazim", targetDurationMs: 1800, stop: true, desc: "Madd-i Lâzım: En az 4-6 Elif uzatman lazım!" } }
      ]
    },
    {
      surahNo: 2,
      ayahNo: 2,
      latin: "Zâlikel-kitâbü lâ raybe fîh, hüdel-lil-müttekîn.",
      turkishMeal: "Bu, doğruluğu şüphe götürmeyen ve Allah'a karşı gelmekten sakınanlara yol gösteren Kitap'tır.",
      tajweedRules: [
        { word: "ذَٰلِكَ", rule: "Madd-i Tabii", desc: "1 Elif uzatma" },
        { word: "لَا رَيْبَ", rule: "Madd-i Tabii & Lîn", desc: "Raybe yumuşak ve akıcı geçilir" },
        { word: "ۛ فِيهِ ۛ", rule: "Muâneka (Müanaka)", desc: "İki duraktan yalnız birinde durulur, ikisinde birden durulmaz" },
        { word: "هُدًى لِّلْمُتَّقِينَ", rule: "İdgam-ı Bilâ Gunne", desc: "Tenvin'den sonra Lâm harfi; tutmadan şeddeli bağlanır" },
        { word: "لِّلْمُتَّقِينَ ۝", rule: "Madd-i Ârız (Durak)", desc: "Âyet sonunda 2-4 elif uzatılarak vakıf yapılır" }
      ],
      words: [
        { ar: "ذَٰلِكَ", tajweed: { rule: "madd-tabii", desc: "1 Elif uzatma" } },
        { ar: "الْكِتَابُ", tajweed: { rule: "madd-tabii", desc: "1 Elif uzatma" } },
        { ar: "لَا", tajweed: { rule: "madd-tabii", desc: "1 Elif uzatma" } },
        { ar: "رَيْبَ", tajweed: null },
        { ar: "ۛ", tajweed: { rule: "vakif", desc: "Muâneka Noktası: Birincisinde durursan ikincisinde geç" } },
        { ar: "فِيهِ", tajweed: null },
        { ar: "ۛ", tajweed: { rule: "vakif", desc: "Muâneka Noktası" } },
        { ar: "هُدًى", tajweed: { rule: "ihfa", desc: "İdgam bila gunne" } },
        { ar: "لِلْمُتَّقِينَ", tajweed: { rule: "madd-ariz", desc: "Madd-i Ârız: 2-4 Elif uzat ve dur" } }
      ]
    },
    {
      surahNo: 2,
      ayahNo: 3,
      latin: "Ellezîne yü'minûne bil-ğaybi ve yükîmûnes-salâte ve mimmâ razaknâhüm yünfikûn.",
      turkishMeal: "Onlar gaybe inanırlar, namazı kılarlar, kendilerine verdiğimiz rızıktan yerli yerince sarfederler.",
      tajweedRules: [
        { word: "الَّذِينَ", rule: "Madd-i Tabii", desc: "1 Elif uzatma" },
        { word: "بِالْغَيْبِ", rule: "Lîn Harfi", desc: "Yumuşak ve akıcı telaffuz" },
        { word: "وَمِمَّا", rule: "Şeddeli Mîm (Gunne)", desc: "1.5 Elif tutularak genizden okunur" },
        { word: "رَزَقْنَاهُمْ", rule: "Kalkale", desc: "Kaf harfi sarsarak çıkarılır" },
        { word: "يُنْفِقُونَ", rule: "İhfa", desc: "Nun harfi genizde 1.5 elif tutulur" },
        { word: "يُنْفِقُونَ ۝", rule: "Madd-i Ârız (Durak)", desc: "2-4 Elif uzatma" }
      ],
      words: [
        { ar: "الَّذِينَ", tajweed: { rule: "madd-tabii", desc: "1 Elif" } },
        { ar: "يُؤْمِنُونَ", tajweed: null },
        { ar: "بِالْغَيْبِ", tajweed: null },
        { ar: "وَيُقِيمُونَ", tajweed: { rule: "madd-tabii", desc: "1 Elif" } },
        { ar: "الصَّلَاةَ", tajweed: { rule: "madd-tabii", desc: "1 Elif" } },
        { ar: "وَمِمَّا", tajweed: { rule: "ihfa", desc: "Şeddeli Gunne: 1.5 Elif" } },
        { ar: "رَزَقْنَاهُمْ", tajweed: { rule: "kalkale", desc: "Kalkale: Kaf harfi" } },
        { ar: "يُنْفِقُونَ", tajweed: { rule: "ihfa", desc: "İhfa: Nun harfi" } }
      ]
    },
    {
      surahNo: 2,
      ayahNo: 4,
      latin: "Vellezîne yü'minûne bimâ ünzile ileyke ve mâ ünzile min kablike ve bil-âhirati hüm yûkınûn.",
      turkishMeal: "Onlar sana indirilene de senden önce indirilenlere de inanırlar; ahirete de yalnız onlar kesin olarak inanırlar.",
      tajweedRules: [
        { word: "بِمَا أُنْزِلَ", rule: "Madd-i Munfasıl & İhfa", desc: "4 Elif uzatma ve Zâ harfinde ihfa" },
        { word: "وَمَا أُنْزِلَ", rule: "Madd-i Munfasıl & İhfa", desc: "4 Elif uzatma ve Zâ harfinde ihfa" },
        { word: "مِنْ قَبْلِكَ", rule: "İhfa & Kalkale", desc: "Kaf harfinde ihfa, Be harfinde kalkale" },
        { word: "يُوقِنُونَ ۝", rule: "Madd-i Ârız (Durak)", desc: "2-4 Elif uzatma" }
      ],
      words: [
        { ar: "وَالَّذِينَ", tajweed: { rule: "madd-tabii", desc: "1 Elif" } },
        { ar: "يُؤْمِنُونَ", tajweed: null },
        { ar: "بِمَا", tajweed: { rule: "madd-munfasil", desc: "Madd-i Munfasıl: 4 Elif" } },
        { ar: "أُنْزِلَ", tajweed: { rule: "ihfa", desc: "İhfa: 1.5 Elif" } },
        { ar: "إِلَيْكَ", tajweed: null },
        { ar: "وَمَا", tajweed: { rule: "madd-munfasil", desc: "Madd-i Munfasıl: 4 Elif" } },
        { ar: "أُنْزِلَ", tajweed: { rule: "ihfa", desc: "İhfa: 1.5 Elif" } },
        { ar: "مِنْ", tajweed: { rule: "ihfa", desc: "İhfa: Kaf harfi" } },
        { ar: "قَبْلِكَ", tajweed: { rule: "kalkale", desc: "Kalkale: Be harfi" } },
        { ar: "وَبِالْآخِرَةِ", tajweed: null },
        { ar: "هُمْ", tajweed: null },
        { ar: "يُوقِنُونَ", tajweed: { rule: "madd-ariz", desc: "Madd-i Ârız: 2-4 Elif uzat" } }
      ]
    },
    {
      surahNo: 2,
      ayahNo: 5,
      latin: "Ülâ'ike 'alâ hüdem-mir-rabbihim ve ülâ'ike hümül-müflihûn.",
      turkishMeal: "İşte Rab'lerinin yolunda olanlar ve saadete erişenler bunlardır.",
      tajweedRules: [
        { word: "أُولَٰئِكَ", rule: "Madd-i Muttasıl", desc: "EN AZ 4 ELİF UZATMAN LAZIM!" },
        { word: "هُدًى مِنْ", rule: "İdgam-ı Meal Gunne", desc: "1.5 Elif genizden tutulur" },
        { word: "مِنْ رَبِّهِمْ", rule: "İdgam-ı Bilâ Gunne", desc: "Tutulmadan Ra harfine bağlanır" },
        { word: "الْمُفْلِحُونَ ۝", rule: "Madd-i Ârız (Sayfa Sonu)", desc: "Sayfa sonu durak ve 2-4 elif uzatma" }
      ],
      words: [
        { ar: "أُولَٰئِكَ", tajweed: { rule: "madd-muttasil", targetDurationMs: 1400, desc: "Madd-i Muttasıl: 4 Elif Uzat!" } },
        { ar: "عَلَىٰ", tajweed: null },
        { ar: "هُدًى", tajweed: { rule: "ihfa", desc: "İdgam meal gunne" } },
        { ar: "مِنْ", tajweed: { rule: "ihfa", desc: "İdgam bila gunne" } },
        { ar: "رَبِّهِمْ", tajweed: null },
        { ar: "ۖ", tajweed: { rule: "vakif", desc: "Vakf-ı Caiz" } },
        { ar: "وَأُولَٰئِكَ", tajweed: { rule: "madd-muttasil", targetDurationMs: 1400, desc: "Madd-i Muttasıl: 4 Elif Uzat!" } },
        { ar: "هُمُ", tajweed: null },
        { ar: "الْمُفْلِحُونَ", tajweed: { rule: "madd-ariz", targetDurationMs: 1200, stop: true, desc: "Madd-i Ârız: Sayfa Sonu Durak" } }
      ]
    }
  ]
};

// Sayfa Hafıza Önbelleği (0ms Sayfa Geçişi İçin)
const PAGE_CACHE = {
  1: PRELOADED_PAGE_1,
  2: PRELOADED_PAGE_2,
  50: PRELOADED_PAGE_50
};

// =========================================================
// TİLAVET KÂRİLERİ KONFİGÜRASYONU & SES AKIŞ YÖNETİCİSİ
// 1. Kâbe İmamı Şeyh Yâsir ed-Devserî (Al-Dossary) - Varsayılan
// 2. Şeyh Nâsır el-Katâmî (Nasser Al-Qatami)
// 3. Şeyh Meşâri Râşid el-Afâsî (Mishary Alafasy)
// =========================================================
const RECITERS = {
  dossary: {
    id: "dossary",
    name: "Kâbe İmamı Şeyh Yâsir ed-Devserî",
    title: " Kâbe İmamı Şeyh Yâsir ed-Devserî",
    shortName: "Dossary",
    folder: "Yasser_Ad-Dussary_128kbps"
  },
  qatami: {
    id: "qatami",
    name: "Şeyh Nâsır el-Katâmî",
    title: " Şeyh Nâsır el-Katâmî",
    shortName: "Katâmî",
    folder: "Nasser_Alqatami_128kbps"
  },
  alafasy: {
    id: "alafasy",
    name: "Şeyh Meşâri Râşid el-Afâsî",
    title: " Şeyh Meşâri Râşid el-Afâsî",
    shortName: "Afâsî",
    folder: "Alafasy_128kbps"
  },
  minshawi: {
    id: "minshawi",
    name: "Muhammed Sıddîk el-Minşâvî (Mürettel)",
    title: " Muhammed Sıddîk el-Minşâvî",
    shortName: "Minşâvî",
    folder: "Minshawy_Murattal_128kbps"
  },
  minshawi_mujawwad: {
    id: "minshawi_mujawwad",
    name: "Muhammed Sıddîk el-Minşâvî (Mücevved / Makam Zirvesi)",
    title: " M. S. el-Minşâvî (Mücevved)",
    shortName: "Minşâvî Mücevved",
    folder: "Minshawy_Mujawwad_192kbps"
  },
  mustafa_ismail: {
    id: "mustafa_ismail",
    name: "Şeyh Mustafa İsmail (Makamlar Üstadı)",
    title: " Şeyh Mustafa İsmail",
    shortName: "Mustafa İsmail",
    folder: "Mustafa_Ismail_48kbps"
  },
  abdulbasit: {
    id: "abdulbasit",
    name: "Abdülbâsıt Abdüssamed (Mürettel)",
    title: "Abdülbâsıt Abdüssamed",
    shortName: "Abdülbâsıt",
    folder: "Abdul_Basit_Murattal_192kbps"
  },
  abdulbasit_mujawwad: {
    id: "abdulbasit_mujawwad",
    name: "Abdülbâsıt Abdüssamed (Mücevved / Makam & Tizler)",
    title: "Abdülbâsıt (Mücevved)",
    shortName: "Abdülbâsıt Mücevved",
    folder: "Abdul_Basit_Mujawwad_128kbps"
  },
  husary: {
    id: "husary",
    name: "Mahmûd Halîl el-Husarî (Mürettel / Hatasız Mizan)",
    title: " Mahmûd Halîl el-Husarî",
    shortName: "Husarî",
    folder: "Husary_128kbps"
  },
  husary_mujawwad: {
    id: "husary_mujawwad",
    name: "Mahmûd Halîl el-Husarî (Mücevved)",
    title: " Husarî (Mücevved)",
    shortName: "Husarî Mücevved",
    folder: "Husary_128kbps_Mujawwad"
  },
  ali_jaber: {
    id: "ali_jaber",
    name: "Şeyh Ali Câbir (Mekke Ekolü)",
    title: " Şeyh Ali Câbir",
    shortName: "Ali Câbir",
    folder: "Ali_Jaber_64kbps"
  },
  shuraym: {
    id: "shuraym",
    name: "Şeyh Suûd eş-Şüraym (Hicaz / Kâbe İmamı)",
    title: " Şeyh Suûd eş-Şüraym",
    shortName: "Şüraym",
    folder: "Saood_ash-Shuraym_128kbps"
  }
};
// Okuyucu rumuzları ve alias eşleştirmeleri
RECITERS.katami = RECITERS.qatami;
RECITERS.afasy = RECITERS.alafasy;
RECITERS.ismail = RECITERS.mustafa_ismail;
RECITERS.dussary = RECITERS.dossary;
RECITERS.hussary = RECITERS.husary;
RECITERS["turk-ekol"] = {
  id: "turk-ekol",
  name: "Türk Makam Ekolü Seçkisi (Ali Tel / İstanbul Tavrı)",
  title: " Türk Makam Ekolü",
  shortName: "Türk Ekolü",
  folder: "Alafasy_128kbps"
};

// Global dışa aktarmalar
window.SURAH_LIST = SURAH_LIST;

// Tercih edilen kâriyi yerel hafızadan yükle
let activeReciterId = 'dossary';
try {
  const savedRec = localStorage.getItem('cymatique_preferred_reciter');
  if (savedRec && RECITERS[savedRec]) {
    activeReciterId = savedRec;
  }
} catch(_) {}

function getAyahAudioUrl(surahNo, ayahNo, reciterId = activeReciterId) {
  const safeId = (reciterId && RECITERS[reciterId]) ? reciterId : (activeReciterId || 'dossary');
  const rec = RECITERS[safeId] || RECITERS.dossary;
  const paddedSurah = String(surahNo).padStart(3, '0');
  const paddedAyah = String(ayahNo).padStart(3, '0');
  return `https://everyayah.com/data/${rec.folder}/${paddedSurah}${paddedAyah}.mp3`;
}
window.RECITERS = RECITERS;
window.getAyahAudioUrl = getAyahAudioUrl;

// "BENİ BUL" Kapsamlı Eşleşme İndeksi (Namaz Sureleri, Meşhur Ayetler ve Fonetik İfadeler)
const BENI_BUL_PRESETS = [
  // FÂTİHA SURESİ (1)
  { surahNo: 1, ayahNo: 1, page: 1, query: "bismillahirrahmanirrahim bismillah besmele", name: "Fâtiha Suresi", desc: "1. Âyet", ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", lt: "Bismillâhir-rahmânir-rahîm", tr: "Rahmân ve Rahîm olan Allah'ın adıyla." },
  { surahNo: 1, ayahNo: 2, page: 1, query: "elhamdülillahi rabbil alemin elhamdu lillahi hamd", name: "Fâtiha Suresi", desc: "2. Âyet", ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", lt: "El-hamdü lillâhi rabbil-'âlemîn", tr: "Hamd, Âlemlerin Rabbi olan Allah'a mahsustur." },
  { surahNo: 1, ayahNo: 7, page: 1, query: "siratallezine enamte aleyhim gayril magdubi aleyhim veleddallin ve leddallin amin", name: "Fâtiha Suresi", desc: "7. Âyet", ar: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", lt: "Sırâtallezîne en'amte 'aleyhim, ğayril-mağdûbi 'aleyhim veled-dâllîn", tr: "Nimet verdiğin kimselerin yoluna; gazaba uğrayanların ve sapıtanların yoluna değil." },

  // BAKARA SURESİ (2) - Âyetü'l-Kürsî & Âmenerrasûlü
  { surahNo: 2, ayahNo: 255, page: 42, query: "allahu la ilahe illa huvel hayyul kayyum la te huzuhu sinetuv vela nevm ayetel kursi ayet el kursi kursi", name: "Bakara Suresi (Âyetü'l-Kürsî)", desc: "255. Âyet", ar: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ", lt: "Allâhü lâ ilâhe illâ hüvel-hayyül-kayyûm, lâ te'huzühû sinetün velâ nevm...", tr: "Allah O'dur ki, O'ndan başka ilah yoktur. Hayy'dır, Kayyûm'dur." },
  { surahNo: 2, ayahNo: 285, page: 50, query: "amenerrasulu bima unzile ileyhi mir rabbihi vel mu minun amenerresulu amene er rasulu", name: "Bakara Suresi (Âmenerrasûlü)", desc: "285. Âyet", ar: "آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ", lt: "Âmener-rasûlü bimâ ünzile ileyhi mir-rabbihî vel-mü'minûn...", tr: "Peygamber, Rabbinden kendisine indirilene iman etti, müminler de..." },
  { surahNo: 2, ayahNo: 286, page: 50, query: "la yukellifullahu nefsen illa vus aha leha ma kesebet rabbena la tuahizna", name: "Bakara Suresi (Âmenerrasûlü Sonu)", desc: "286. Âyet", ar: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", lt: "Lâ yükellifullâhü nefsen illâ vüs'ahâ...", tr: "Allah hiçbir kimseyi gücünün yetmediği bir şeyle yükümlü kılmaz..." },

  // ÂL-İ İMRÂN (3)
  { surahNo: 3, ayahNo: 26, page: 53, query: "kulillahumme malikel mulki tu til mulke men tesa u kul illahumme", name: "Âl-i İmrân Suresi", desc: "26. Âyet", ar: "قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَنْ تَشَاءُ", lt: "Kulillâhumme mâlikel-mülki tü'til-mülke men teşâ'ü...", tr: "De ki: Ey mülkün gerçek sahibi olan Allah'ım! Sen mülkü dilediğine verirsin..." },

  // YÂSÎN SURESİ (36)
  { surahNo: 36, ayahNo: 1, page: 440, query: "yasin vel kur'anil hakim inneke leminel murselin yasin suresi", name: "Yâsîn Suresi", desc: "1-3. Âyetler", ar: "يس ۝ وَالْقُرْآنِ الْحَكِيمِ ۝ إِنَّكَ لَمِنَ الْمُرْسَلِينَ", lt: "Yâsîn, vel-Kur'ânil-hakîm, inneke leminel-mürselîn", tr: "Yâsîn. Hikmet dolu Kur'an'a andolsun ki, sen şüphesiz peygamberlerdensin." },
  { surahNo: 36, ayahNo: 82, page: 445, query: "innema emruhu iza erade sey en en yekule lehu kun feyekun kun fe yekun", name: "Yâsîn Suresi", desc: "82. Âyet", ar: "إِنَّما أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَنْ يَقُولَ لَهُ كُنْ فَيَكُونُ", lt: "İnnemâ emruhû izâ erâde şey'en en yekûle lehû kün fe-yekûn", tr: "Bir şeyi dilediği zaman, O'nun buyruğu sadece 'Ol' demektir; o da hemen oluverir." },

  // FETİH SURESİ (48)
  { surahNo: 48, ayahNo: 1, page: 511, query: "inna fetahna leke fetham mubina fetih suresi", name: "Fetih Suresi", desc: "1. Âyet", ar: "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا", lt: "İnnâ fetahnâ leke fethan mübînâ", tr: "Şüphesiz biz sana apaçık bir fetih verdik." },

  // RAHMÂN SURESİ (55)
  { surahNo: 55, ayahNo: 1, page: 531, query: "er rahman allemel kur an halakal insan febi eyyi alai rabbikuma tukezziban rahman suresi", name: "Rahmân Suresi", desc: "1-4. Âyetler", ar: "الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ ۝ خَلَقَ الْإِنْسَانَ", lt: "Er-Rahmân, 'allemel-Kur'ân, halakal-insân", tr: "Rahmân. Kur'an'ı öğretti. İnsanı yarattı." },

  // VÂKIA SURESİ (56)
  { surahNo: 56, ayahNo: 1, page: 534, query: "iza vekaatil vakiah leyse livak atiha kazibeh vakia suresi", name: "Vâkıa Suresi", desc: "1-2. Âyetler", ar: "إِذَا وَقَعَتِ الْوَاقِعَةُ ۝ لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ", lt: "İzâ veka'atil-vâkı'ah, leyse li-vak'atihâ kâzibeh", tr: "Kıyamet koptuğu zaman; onun kopuşunu yalanlayacak hiç kimse yoktur." },

  // HAŞR SURESİ (59) - Hüvallâhüllezî / Lev Enzelnâ
  { surahNo: 59, ayahNo: 21, page: 548, query: "lev enzelna hazel kur ane ala cebelin leraeytehu hasian hasr suresi", name: "Haşr Suresi (Lev Enzelnâ)", desc: "21. Âyet", ar: "لَوْ أَنْزَلْنَا هَٰذَا الْقُرْآنَ عَلَىٰ جَبَلٍ لَرَأَيْتَهُ خَاشِعًا", lt: "Lev enzelnâ hâzel-Kur'âne 'alâ cebelin lera'eytehû hâşi'an...", tr: "Eğer biz bu Kur'an'ı bir dağa indirseydik, muhakkak ki onu Allah korkusundan baş eğerek parça parça olmuş görürdün..." },
  { surahNo: 59, ayahNo: 22, page: 548, query: "huvallahullezi la ilahe illa hu alimul gaybi ves sehadeti huver rahmanur rahim huvallahullezi", name: "Haşr Suresi (Hüvallâhüllezî)", desc: "22. Âyet", ar: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ ۖ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ", lt: "Hüvallâhüllezî lâ ilâhe illâ hû, 'âlimül-ğaybi veş-şehâdeh...", tr: "O, kendisinden başka hiçbir ilah bulunmayan Allah'tır. Gaybı da, görünen âlemi de bilendir. O, Rahmân'dır, Rahîm'dir." },

  // CUM'A SURESİ (62)
  { surahNo: 62, ayahNo: 9, page: 554, query: "ya eyyuhellezine amenu iza nudiye lis salati min yevmil cumati cuma suresi", name: "Cum'a Suresi", desc: "9. Âyet", ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِنْ يَوْمِ الْجُمُعَةِ", lt: "Yâ eyyühellezîne âmenû izâ nûdiye lis-salâti min yevmil-cumu'ati...", tr: "Ey iman edenler! Cuma günü namaza çağrıldığınız zaman, hemen Allah'ı anmaya koşun..." },

  // MÜLK SURESİ (67) - Tebâreke
  { surahNo: 67, ayahNo: 1, page: 562, query: "tebarekellezi biyedihil mulk ve huve ala kulli sey in kadir tebareke mulk suresi", name: "Mülk (Tebâreke) Suresi", desc: "1. Âyet", ar: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", lt: "Tebârekellezî bi-yedihil-mülkü ve hüve 'alâ külli şey'in kadîr", tr: "Hükümranlık elinde olan Allah yüceler yücesidir. O her şeye hakkıyla kadirdir." },

  // NEBE SURESİ (78) - Amme
  { surahNo: 78, ayahNo: 1, page: 582, query: "amme yetesaelun anin nebeil azim amme suresi nebe suresi", name: "Nebe (Amme) Suresi", desc: "1-2. Âyetler", ar: "عَمَّ يَتَسَاءَلُونَ ۝ عَنِ النَّبَإِ الْعَظِيمِ", lt: "'Amme yetesâelûn, 'anin-nebeil-'azîm", tr: "Birbirlerine neyi sorup duruyorlar? O büyük haberi mi?" },

  // TEKVÎR SURESİ (81)
  { surahNo: 81, ayahNo: 1, page: 586, query: "izessemsu kuvviret ve izennucumun kederet tekvir suresi", name: "Tekvîr Suresi", desc: "1-2. Âyetler", ar: "إِذَا الشَّمْسُ كُوِّرَتْ ۝ وَإِذَا النُّجُومُ انْكَدَرَتْ", lt: "İzeş-şemsü küvviret, ve izen-nücûmün-kederat", tr: "Güneş dürüldüğü zaman, yıldızlar döküldüğü zaman..." },

  // İNFİTÂR SURESİ (82)
  { surahNo: 82, ayahNo: 1, page: 587, query: "izessemaun fetarat ve izel kevakibun teseret infitar suresi", name: "İnfitâr Suresi", desc: "1-2. Âyetler", ar: "إِذَا السَّمَاءُ انْفَطَرَتْ ۝ وَإِذَا الْكَوَاكِبُ انْتَثَرَتْ", lt: "İzes-semâun-fetarat, ve izel-kevâkibün-teserat", tr: "Gök yarıldığı zaman, yıldızlar saçıldığı zaman..." },

  // DUHÂ SURESİ (93)
  { surahNo: 93, ayahNo: 1, page: 596, query: "vedduha vel leyli iza seca ma veddeake rabbuke ve ma kala duha suresi", name: "Duhâ Suresi", desc: "1-3. Âyetler", ar: "وَالضُّحَىٰ ۝ وَاللَّيْلِ إِذَا سَجَىٰ ۝ مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ", lt: "Ved-duhâ, vel-leyli izâ secâ, mâ vedde'ake rabbüke ve mâ kalâ", tr: "Kuşluk vaktine andolsun, sükûna erdiği zaman geceye andolsun ki, Rabbin seni terk etmedi ve sana darılmadı." },

  // İNŞİRÂH SURESİ (94)
  { surahNo: 94, ayahNo: 1, page: 596, query: "elem nesrah leke sadrak ve vedana anke vizrak feinne meal usri yusra insirah suresi", name: "İnşirâh Suresi", desc: "1-2. Âyetler", ar: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۝ وَوَضَعْنَا عَنْكَ وِزْرَكَ", lt: "Elem neşrah leke sadrak, ve veda'nâ 'anke vizrak", tr: "Biz senin göğsünü açıp genişletmedik mi? Yükünü üzerinden indirmedik mi?" },

  // TÎN SURESİ (95)
  { surahNo: 95, ayahNo: 1, page: 597, query: "vettini vez zeytuni ve turi sinin tin suresi", name: "Tîn Suresi", desc: "1-2. Âyetler", ar: "وَالتِّينِ وَالزَّيْتُونِ ۝ وَطُورِ سِينِينَ", lt: "Vet-tîni vez-zeytûn, ve tûri sînîn", tr: "İncire ve zeytine andolsun, Sînâ dağına andolsun..." },

  // ALAK SURESİ (96) - İlk Vahiy
  { surahNo: 96, ayahNo: 1, page: 597, query: "ikra bismi rabbikellezi halak halakal insane min alak alak suresi oku", name: "Alak Suresi", desc: "1-2. Âyetler", ar: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ ۝ خَلَقَ الْإِنْسَانَ مِنْ عَلَقٍ", lt: "İkra' bismi rabbikellezî halak, halakal-insâne min 'alak", tr: "Yaratan Rabbinin adıyla oku! O, insanı bir aşılanmış yumurtadan (alaktan) yarattı." },

  // KADİR SURESİ (97)
  { surahNo: 97, ayahNo: 1, page: 598, query: "inna enzelnahu fi leyletil kadr ve ma edrake ma leyletul kadr kadir suresi", name: "Kadir Suresi", desc: "1-2. Âyetler", ar: "إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ ۝ وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ", lt: "İnnâ enzelnâhü fî leyletil-kadr, ve mâ edrâke mâ leyletül-kadr", tr: "Şüphesiz biz onu Kadir gecesinde indirdik. Kadir gecesinin ne olduğunu sen ne bileceksin?" },

  // ZİLZÂL SURESİ (99)
  { surahNo: 99, ayahNo: 1, page: 599, query: "iza zulziletil ardu zilzaleha ve ahracetil ardu eskaleha zilzal suresi zelzele", name: "Zilzâl Suresi", desc: "1-2. Âyetler", ar: "إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا ۝ وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا", lt: "İzâ zülziletil-ardu zilzâlehâ, ve ahracetil-ardu eskâlehâ", tr: "Yer o yaman sarsıntısıyla sarsıldığı, yer ağırlıklarını dışarı çıkardığı zaman..." },

  // ASR SURESİ (103)
  { surahNo: 103, ayahNo: 1, page: 601, query: "vel asr innel insane lefi husr illellezine amenu asr suresi", name: "Asr Suresi", desc: "1-3. Âyetler", ar: "وَالْعَصْرِ ۝ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا", lt: "Vel-'asr, innel-insâne le-fî husr, illellezîne âmenû...", tr: "Asra andolsun ki, insan gerçekten ziyan içindedir. Ancak iman edip iyi ameller işleyenler müstesna." },

  // FÎL SURESİ (105)
  { surahNo: 105, ayahNo: 1, page: 601, query: "elem tera keyfe feale rabbuke bi ashabil fil elemtere keyfe fil suresi", name: "Fîl Suresi", desc: "1. Âyet", ar: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ", lt: "Elem tera keyfe fe'ale rabbüke bi-ashâbil-fîl", tr: "Görmedin mi Rabbin fil sahiplerine ne yaptı?" },

  // KUREYŞ SURESİ (106)
  { surahNo: 106, ayahNo: 1, page: 602, query: "li ilafi kureysin ilafihim rihletes sitai ves sayf kureys suresi", name: "Kureyş Suresi", desc: "1-2. Âyetler", ar: "لِإِيلَافِ قُرَيْشٍ ۝ إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ", lt: "Li-îlâfi kureyş, îlâfihim rıhleteş-şitâi ves-sayf", tr: "Kureyş'i alıştırmak, onları kış ve yaz yolculuğuna alıştırmak için..." },

  // MÂÛN SURESİ (107)
  { surahNo: 107, ayahNo: 1, page: 602, query: "eraeytellezi yukezzibu bid din fezalikellezi yeduul yetim maun suresi", name: "Mâûn Suresi", desc: "1-2. Âyetler", ar: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ۝ فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ", lt: "Era'eytellezî yükezzibü bid-dîn, fe-zâlikellezî yedu''ul-yetîm", tr: "Dini yalanlayanı gördün mü? İşte yetimi itip kakan odur." },

  // KEVSER SURESİ (108)
  { surahNo: 108, ayahNo: 1, page: 602, query: "inna a taynakel kevser inna ateynakel kevser fesalli lirabbike venhar kevser suresi", name: "Kevser Suresi", desc: "1-2. Âyetler", ar: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۝ فَصَلِّ لِرَبِّكَ وَانْحَرْ", lt: "İnnâ a'taynâkel-kevser, fe-salli li-rabbike venhar", tr: "Şüphesiz biz sana Kevser'i verdik. O halde Rabbin için namaz kıl ve kurban kes." },

  // KÂFİRÛN SURESİ (109)
  { surahNo: 109, ayahNo: 1, page: 603, query: "kul ya eyyuhel kafirun la a budu ma ta budun kafirun suresi", name: "Kâfirûn Suresi", desc: "1-2. Âyetler", ar: "قُلْ يَا أَيُّهَا الْكَافِرُونَ ۝ لَا أَعْبُدُ مَا تَعْبُدُونَ", lt: "Kul yâ eyyühel-kâfirûn, lâ a'büdü mâ ta'büdûn", tr: "De ki: Ey kâfirler! Ben sizin ibadet ettiklerinize ibadet etmem." },

  // NASR SURESİ (110)
  { surahNo: 110, ayahNo: 1, page: 603, query: "iza cae nasrullahi vel fethu ve raeyten nase nasr suresi", name: "Nasr Suresi", desc: "1-2. Âyetler", ar: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ ۝ وَرَأَيْتَ النَّاسَ", lt: "İzâ câe nasrullâhi vel-feth, ve ra'eyten-nâse...", tr: "Allah'ın yardımı ve fetih geldiği zaman, insanların bölük bölük Allah'ın dinine girdiğini gördüğünde..." },

  // TEBBET SURESİ (111)
  { surahNo: 111, ayahNo: 1, page: 603, query: "tebbet yeda ebileheb ebi leheb ebilehebin ebi lehebin ve tebb ma agna anhu maluhu tebbet suresi mesed tebbet yeda ebu leheb", name: "Tebbet Suresi", desc: "1-2. Âyetler", ar: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ ۝ مَا أَغْنَىٰ عَنْهُ مَالُهُ", lt: "Tebbet yedâ ebî lehebin ve tebb, mâ ağnâ 'anhü mâlühû...", tr: "Ebu Leheb'in iki eli kurusun! Kurudu da. Malı ve kazandıkları ona fayda vermedi." },

  // İHLÂS SURESİ (112)
  { surahNo: 112, ayahNo: 1, page: 604, query: "kul huvallahu ehad allahu samed lem yelid ve lem yuled ve lem yekun lehu kufuven ehad ihlas suresi", name: "İhlâs Suresi", desc: "1-4. Âyetler", ar: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ", lt: "Kul hüvellâhü ehad, Allâhüs-samed, lem yelid ve lem yûled...", tr: "De ki: O, Allah birdir. Allah Samed'dir. O, doğurmamış ve doğmamıştır." },

  // FELAK SURESİ (113)
  { surahNo: 113, ayahNo: 1, page: 604, query: "kul euzu birabbil felak min serri ma halak felak suresi", name: "Felak Suresi", desc: "1-2. Âyetler", ar: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ", lt: "Kul e'ûzü bi-rabbil-felak, min şerri mâ halak", tr: "De ki: Yarattığı şeylerin şerrinden sabahın Rabbine sığınırım." },

  // NÂS SURESİ (114)
  { surahNo: 114, ayahNo: 1, page: 604, query: "kul euzu birabbin nas melikin nas ilahin nas min serril vesvasil hannas nas suresi", name: "NÂs Suresi", desc: "1-4. Âyetler", ar: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ", lt: "Kul e'ûzü bi-rabbin-nâs, melikin-nâs, ilâhin-nâs...", tr: "De ki: İnsanların kalplerine vesvese sokan sinsi vesvesecinin şerrinden insanların Rabbine sığınırım." }
];

// Surelerin Türkçe halk ve alternatif arama adları
const SURAH_ALIASES = {
  1: ["fatiha", "elham", "elhamdulillah", "fatihah"],
  2: ["bakara", "ayetel kursi", "ayet el kursi", "kursi", "amenerrasulu", "amenerresulu"],
  3: ["ali imran", "al i imran", "kulillahumme"],
  36: ["yasin", "yasiniserif"],
  48: ["fetih", "inna fetahna"],
  55: ["rahman", "allemel kuran"],
  56: ["vakia", "iza vekaatil vakia"],
  59: ["hasr", "huvallahullezi", "lev enzelna"],
  62: ["cuma", "cuma suresi"],
  67: ["mulk", "tebareke", "tebarekellezi"],
  78: ["nebe", "amme", "amme yetesaelun"],
  81: ["tekvir", "izessemsu"],
  82: ["infitar", "izessemaun"],
  87: ["ala", "sebbihisme"],
  93: ["duha", "vedduha"],
  94: ["insirah", "elem nesrah", "serh"],
  95: ["tin", "vettini"],
  96: ["alak", "ikra"],
  97: ["kadir", "kadr", "inna enzelnahu"],
  99: ["zilzal", "zelzele", "iza zulziletil ard"],
  100: ["adiyat", "vel adiyati"],
  101: ["karia", "el karia"],
  102: ["tekasur", "elhakumut tekasur"],
  103: ["asr", "vel asr"],
  104: ["humeze", "veylun li kulli humezeh"],
  105: ["fil", "elemtere", "elem tere"],
  106: ["kureys", "li ilafi"],
  107: ["maun", "eraeytellezi"],
  108: ["kevser", "inna ateyna"],
  109: ["kafirun", "kul ya eyyuhel kafirun"],
  110: ["nasr", "iza cae nasrullah"],
  111: ["tebbet", "mesed", "tebbet yeda"],
  112: ["ihlas", "kul huvallahu ehad", "allahu samed"],
  113: ["felak", "kul euzu birabbil felak"],
  114: ["nas", "kul euzu birabbin nas"]
};

// Akıllı Türkçe / Arapça Normalizasyon Fonksiyonu
function normalizeSearchText(str) {
  if (!str) return '';
  return str
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ı/g, 'i')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Bütün kombine aksan, şapka ve uzatmaları temizle
    // Türkçe özel karakterler
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    // Arapça Harekeler (Tashkeel / Diacritics)
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    // Arapça harf varyantlarını normalize et
    .replace(/[إأآٱا]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[يىئ]/g, 'ي')
    .replace(/[ؤو]/g, 'و')
    .replace(/[ـ]/g, '')
    // Kesme, tire, parantez ve noktalama işaretleri
    .replace(/['’`\-_–—\.,:;!?()\[\]{}"\/\\#*~]/g, ' ')
    // Çoklu boşlukları teke indir
    .replace(/\s+/g, ' ')
    .trim();
}

// Sure ve Ayet Sözdizimi Ayrıştırıcı (Örn: "112:1", "Bakara 255", "Sure 112")
function parseChapterAyahSyntax(text) {
  if (!text) return null;
  const clean = text.trim().toLowerCase();
  
  // Örnek: "Sayfa 50", "s 50", "page 50", "p 50"
  const pageMatch = clean.match(/^(?:sayfa|s|page|p)\.?\s*(\d{1,3})$/);
  if (pageMatch) {
    const pNo = parseInt(pageMatch[1], 10);
    if (pNo >= 1 && pNo <= 604) {
      return { page: pNo, type: 'page_direct' };
    }
  }

  // Örnek: "112:1", "112/2", "2:255"
  const colonMatch = clean.match(/^(\d{1,3})[:\/.\s](\d{1,3})$/);
  if (colonMatch) {
    const sNo = parseInt(colonMatch[1], 10);
    const aNo = parseInt(colonMatch[2], 10);
    if (sNo >= 1 && sNo <= 114) {
      const sObj = SURAH_LIST.find(s => s.no === sNo);
      if (sObj && aNo >= 1 && aNo <= sObj.ayahs) {
        return { surahNo: sNo, ayahNo: aNo, surahName: `${sNo}. ${sObj.name} Suresi`, type: 'exact_syntax' };
      }
    }
  }
  
  // Örnek: "Sure 112" veya sadece "112"
  const singleNumber = clean.match(/^(?:sure\s*)?(\d{1,3})(?:\.?\s*sure)?$/);
  if (singleNumber) {
    const sNo = parseInt(singleNumber[1], 10);
    if (sNo >= 1 && sNo <= 114) {
      const sObj = SURAH_LIST.find(s => s.no === sNo);
      if (sObj) {
        return { surahNo: sNo, ayahNo: 1, surahName: `${sNo}. ${sObj.name} Suresi`, type: 'surah_number' };
      }
    }
  }
  
  // Örnek: "Bakara 255", "Fatiha 2", "Yasin 82"
  const nameAndNumber = clean.match(/^([a-zğüşıöçâîû\s]+?)\s+(\d{1,3})(?:\.?\s*(?:ayet|âyet)?)?$/);
  if (nameAndNumber) {
    const rawName = normalizeSearchText(nameAndNumber[1]);
    const aNo = parseInt(nameAndNumber[2], 10);
    const foundSurah = SURAH_LIST.find(s => {
      const normName = normalizeSearchText(s.name);
      const aliases = SURAH_ALIASES[s.no] || [];
      return normName === rawName || aliases.includes(rawName);
    });
    if (foundSurah && aNo >= 1 && aNo <= foundSurah.ayahs) {
      return { surahNo: foundSurah.no, ayahNo: aNo, surahName: `${foundSurah.no}. ${foundSurah.name} Suresi`, type: 'name_and_ayah' };
    }
  }
  
  return null;
}

// Akıllı Benzerlik ve Olasılık Skoru Hesaplayıcı (%0 - %100)
function calculateFuzzyMatchScore(queryNorm, targetNorm) {
  if (!queryNorm || !targetNorm) return 0;
  if (queryNorm === targetNorm) return 100;
  
  // Substring kapsama
  if (targetNorm.includes(queryNorm)) {
    return Math.round(75 + (queryNorm.length / targetNorm.length) * 25);
  }
  if (queryNorm.includes(targetNorm)) {
    return Math.round(70 + (targetNorm.length / queryNorm.length) * 25);
  }
  
  // Boşluksuz (space-insensitive) karşılaştırma (örn: "tebbet yeda ebileheb" vs "tebbet yeda ebi lehebin...")
  const qNoSpace = queryNorm.replace(/\s+/g, '');
  const tNoSpace = targetNorm.replace(/\s+/g, '');
  if (qNoSpace.length >= 4 && tNoSpace.length >= 4) {
    if (tNoSpace.includes(qNoSpace)) {
      return Math.round(85 + Math.min(15, (qNoSpace.length / tNoSpace.length) * 25));
    }
    if (qNoSpace.includes(tNoSpace)) {
      return Math.round(80 + Math.min(15, (tNoSpace.length / qNoSpace.length) * 25));
    }
  }

  // Kelime örtüşmesi (Jaccard similarity)
  const qWords = queryNorm.split(' ').filter(w => w.length > 1);
  const tWords = targetNorm.split(' ').filter(w => w.length > 1);
  if (qWords.length > 0 && tWords.length > 0) {
    let matchCount = 0;
    qWords.forEach(qw => {
      if (tWords.some(tw => tw.includes(qw) || qw.includes(tw) || (qw.length >= 4 && tw.length >= 4 && (qw.startsWith(tw) || tw.startsWith(qw))))) {
        matchCount++;
      }
    });
    if (matchCount > 0) {
      const jaccard = matchCount / Math.max(qWords.length, tWords.length);
      return Math.round(50 + jaccard * 45);
    }
  }
  
  // Bigram Dice Benzerliği
  const getBigrams = (s) => {
    const clean = s.replace(/\s+/g, '');
    const bg = new Set();
    for (let i = 0; i < clean.length - 1; i++) bg.add(clean.substring(i, i + 2));
    return bg;
  };
  const bg1 = getBigrams(queryNorm);
  const bg2 = getBigrams(targetNorm);
  if (bg1.size === 0 || bg2.size === 0) return 0;
  
  let intersection = 0;
  bg1.forEach(b => { if (bg2.has(b)) intersection++; });
  const dice = (2 * intersection) / (bg1.size + bg2.size);
  return Math.round(dice * 80);
}

// Tecvid Hata Türleri ve Uyarı Mesajları
const TAJWEED_RULES = {
  "MADD_UZAT": {
    badge: " UZATMAN LAZIM",
    color: "#ff3d71",
    getMsg: (word, rule) => `"${word}" kelimesinde UZATMAN LAZIM! (${rule || 'Madd-i Muttasıl/Lâzım'}: En az 4 elif uzatılmalıdır).`
  },
  "MADD_KISALT": {
    badge: " KISALT",
    color: "#ffc837",
    getMsg: (word) => `"${word}" kelimesini KISALT! (Madd-i Tabii 1 eliften fazla uzatılamaz).`
  },
  "VAKIF_DUR": {
    badge: " ORADA DURMAN LAZIM",
    color: "#ff3d71",
    getMsg: (word, sign) => `"${word}" üzerinde DURMAN LAZIM! (${sign || 'Vakf-ı Lâzım - م'}: Mana bozulmaması için durmak şarttır).`
  },
  "VAKIF_GEC": {
    badge: "⛔ DURMAMAN LAZIM",
    color: "#ff9100",
    getMsg: (word) => `"${word}" üzerinde DURMAMAN LAZIM! (Lâ Vakfe - لا: Durursan geriden alman gerekir).`
  },
  "IHFA_TUT": {
    badge: " 1.5 ELİF TUTMAN LAZIM",
    color: "#00e676",
    getMsg: (word) => `"${word}" ifadesinde 1.5 ELİF TUTMAN LAZIM! (İhfa / Gunne: Sesi genizden tutmalısın).`
  },
  "KALKALE": {
    badge: " KALKALE YAP",
    color: "#00e5ff",
    getMsg: (word) => `"${word}" kelimesinde KALKALE YAPMAN LAZIM! (Kutbu-Cedin harfini sarsarak çıkar).`
  }
};

// Tilavet Yöneticisi Durumu
const TilavetState = {
  currentPage: 50,
  currentSurah: 2,
  currentAyah: 285,
  isListening: false,
  activeAyahObj: null,
  
  // Canlı analiz zamanlayıcıları
  voiceStartTime: 0,
  voiceDurationMs: 0,
  lastSilenceTime: 0,
  silenceDurationMs: 0,
  
  // İstatistik ve Karnesi
  errors: [],
  totalWordsChecked: 0,
  correctWordsCount: 0,
  score: 100,
  
  // Çevrimiçi ses çalıcı (Mishary Alafasy)
  audioPlayer: null,
  isPlayingReference: false
};

// --- TİLAVET MOTORU BAŞLATICI ---
function initTilavetEngine() {
  populateSurahSelect();
  populateBeniBulSurahSelect();

  // URL query parametrelerini kontrol et (?surah=X&ayah=Y veya ?page=P)
  const urlParams = new URLSearchParams(window.location.search);
  const pParam = parseInt(urlParams.get('page'), 10);
  const sParam = parseInt(urlParams.get('surah'), 10);
  const aParam = parseInt(urlParams.get('ayah'), 10);

  if (pParam >= 1 && pParam <= 604) {
    loadMushafPage(pParam, aParam || null, sParam || null);
  } else if (sParam >= 1 && sParam <= 114) {
    locateAndSelectSurahAyah(sParam, aParam || 1);
  } else {
    loadMushafPage(50, 285); // Varsayılan: Sayfa 50, Âmenerrasûlü
  }

  setupTilavetEventListeners();
  setupMushafToolbarListeners();
}

// 114 Sure Dropdown Menüsünü Doldur
function populateSurahSelect() {
  const selectEl = document.getElementById('selectSurah');
  if (!selectEl) return;
  
  selectEl.innerHTML = '';
  SURAH_LIST.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.no;
    opt.textContent = `${s.no}. ${s.name} (${s.arabic}) - ${s.ayahs} Âyet [${s.place}]`;
    if (s.no === 2) opt.selected = true;
    selectEl.appendChild(opt);
  });
}

// Beni Bul Konsolu İçin 114 Sure Seçiciyi Doldur ve Âyet Sayılarını Senkronize Et
function populateBeniBulSurahSelect() {
  const selectEl = document.getElementById('beniBulSurahSelect');
  if (!selectEl) return;

  selectEl.innerHTML = '';
  SURAH_LIST.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.no;
    opt.dataset.ayahs = s.ayahs;
    opt.textContent = `${s.no}. ${s.name} (${s.arabic}) — ${s.ayahs} Âyet`;
    if (s.no === (TilavetState.currentSurah || 2)) opt.selected = true;
    selectEl.appendChild(opt);
  });

  updateBeniBulAyahInputBounds();
}

function updateBeniBulAyahInputBounds() {
  const surahSel = document.getElementById('beniBulSurahSelect');
  const ayahInput = document.getElementById('beniBulAyahInput');
  const maxLabel = document.getElementById('beniBulAyahMaxLabel');
  if (!surahSel || !ayahInput) return;

  const sNo = parseInt(surahSel.value, 10) || 1;
  const sObj = SURAH_LIST.find(s => s.no === sNo);
  const maxAyahs = sObj ? sObj.ayahs : 7;

  ayahInput.max = maxAyahs;
  ayahInput.placeholder = `1 - ${maxAyahs}`;
  if (maxLabel) maxLabel.textContent = `/ ${maxAyahs} Âyet`;

  const curVal = parseInt(ayahInput.value, 10);
  if (!curVal || curVal < 1) {
    ayahInput.value = 1;
  } else if (curVal > maxAyahs) {
    ayahInput.value = maxAyahs;
  }
}

function syncToolbarSurahSelect(surahNo) {
  const select = document.getElementById('selectSurah');
  if (select && select.value != surahNo) {
    select.value = surahNo;
  }
}

// Latin harfli okunuşu daha akıcı ve Türkçeye uygun fonetik hale getir
function formatLatinPhonetics(str) {
  if (!str) return '';
  return str
    .replace(/aa/g, 'â')
    .replace(/ee/g, 'î')
    .replace(/oo/g, 'û')
    .replace(/uu/g, 'û')
    .replace(/ii/g, 'î')
    .replace(/kh/g, 'h')
    .replace(/dh/g, 'z')
    .replace(/sh/g, 'ş')
    .replace(/gh/g, 'ğ');
}

// Arapça kelimeden otomatik tecvid kurallarını çıkaran kural tabanlı motor
function detectWordTajweedRules(word) {
  // Madd-i Muttasıl / Lâzım işareti (~ veya ٓ dalga işareti)
  if (word.includes('ٓ') || word.includes('آ') || word.includes('ـٰٓ')) {
    return {
      rule: "madd-muttasil",
      targetDurationMs: 1400,
      desc: "4 Elif Uzatman Lazım! (Madd-i Muttasıl / Lâzım)"
    };
  }
  // Lafzatullâh
  if (word.includes('اللَّه') || word.includes('لِلَّه')) {
    return {
      rule: "lafzatullah",
      desc: "Lafzatullâh"
    };
  }
  // Vakf-ı Lâzım işareti (ۘ veya مۘ)
  if (word.includes('ۘ') || word.includes('ـمۘ')) {
    return {
      rule: "vakif-lazim",
      stop: true,
      desc: "Kesinlikle Durman Lazım! (Vakf-ı Lâzım)"
    };
  }
  // Lâ Vakfe işareti (ۙ veya لا)
  if (word.includes('ۙ') || word.includes('ـلا')) {
    return {
      rule: "vakif-la",
      stop: false,
      desc: "Burada Durmaman Lazım! (Lâ Vakfe)"
    };
  }
  // İhfa ve Gunne (Tenvin veya Nun-u Sakin)
  if (word.includes('ً') || word.includes('ٍ') || word.includes('ٌ') || word.includes('نْ')) {
    return {
      rule: "ihfa",
      targetDurationMs: 800,
      desc: "1.5 Elif Tutman Lazım (İhfa / Gunne)"
    };
  }
  // Kalkale harfleri (ق ط ب ج د)
  const kalkaleChars = ['قْ', 'طْ', 'بْ', 'جْ', 'دْ'];
  if (kalkaleChars.some(k => word.includes(k))) {
    return {
      rule: "kalkale",
      desc: "Kalkale: Harfi sarsarak çıkar"
    };
  }
  return null;
}

// =========================================================
// GERÇEK MUSHAF SAYFASI ÇİZDİRİCİ (RESİM 1 BİREBİR REPLİKASI)
// =========================================================
function renderMushafPage(pageData, targetAyahNo = null, targetSurahNo = null) {
  const container = document.getElementById('realMushafPage');
  if (!container || !pageData) return;

  const arabicPageNum = toArabicDigits(pageData.pageNum);
  const arabicJuzNum = toArabicDigits(pageData.juzNo);

  // 15 Satırlık Uthmani Ayetleri, Sure Başlıkları ve Tecvid Renklerini Birleştir
  let ayahsHtml = '';
  let prevSurahNo = null;

  pageData.ayahs.forEach((ay, idx) => {
    // Sayfa içinde yeni bir sure başlıyorsa (örn: sayfa ortasında sure geçişi)
    if (idx > 0 && ay.surahNo !== prevSurahNo) {
      const newSurahObj = SURAH_LIST.find(s => s.no === ay.surahNo);
      const surahTitle = newSurahObj ? `سُورَةُ ${newSurahObj.arabic.replace('سُورَةُ ', '')}` : `سُورَةُ ${ay.surahNo}`;
      ayahsHtml += `<div class="mushaf-inner-surah-divider">${surahTitle}</div>`;
    }

    // Sure Başı Besmelesi (Fâtiha 1 ve Tevbe 9 hariç)
    if (ay.isSurahStart || (ay.ayahNo === 1 && ay.surahNo !== 1 && ay.surahNo !== 9)) {
      ayahsHtml += `<div class="mushaf-bismillah-banner">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>`;
    }

    prevSurahNo = ay.surahNo;

    let wordsHtml = '';
    ay.words.forEach(w => {
      let tajweedClass = '';
      if (w.tajweed) {
        const r = w.tajweed.rule;
        if (r.includes('madd')) tajweedClass = 'tajweed-madd';
        else if (r.includes('ihfa') || r.includes('gunne')) tajweedClass = 'tajweed-ihfa';
        else if (r.includes('kalkale')) tajweedClass = 'tajweed-kalkale';
        else if (r.includes('lafzatullah')) tajweedClass = 'tajweed-lafzatullah';
        else if (r.includes('iklab')) tajweedClass = 'tajweed-iklab';
        else if (r.includes('vakif')) tajweedClass = 'tajweed-vakif';
      }
      wordsHtml += `<span class="${tajweedClass}">${w.ar}</span> `;
    });

    const arabicAyahNo = toArabicDigits(ay.ayahNo);
    ayahsHtml += `
      <span class="page-ayah-span" data-surah="${ay.surahNo}" data-ayah="${ay.ayahNo}" title="Âyet ${ay.ayahNo} (İncelemek için tıklayınız)">
        ${wordsHtml}
        <span class="flower-medallion" title="Âyet ${ay.ayahNo}">۝${arabicAyahNo}</span>
      </span>
    `;
  });

  // Resim 1 Birebir İskeleti: Dış Kırmızı Bordür, İç Altın Kılcal, Yan Kırmızı Kurdele, Tezhip Ünvan Kartuşu
  container.innerHTML = `
    <!-- Resim 1: Sağ Kenar Kırmızı Kurdele Sekmesi -->
    <div class="mushaf-side-ribbon">${pageData.surahName} Sûresi / ${pageData.juzNo}. Cüz</div>

    <!-- Üst Bilgi Başlığı (Cüz & Sure Kartuşu & Sayfa No) -->
    <div class="mushaf-page-header">
      <div class="mushaf-header-meta">
        <span>${pageData.juzNo}. CÜZ</span>
      </div>

      <div class="mushaf-unwan-cartouche">
        <div class="mushaf-unwan-title">${pageData.arabicTitle || 'سُورَةُ ' + pageData.surahName}</div>
      </div>

      <div class="mushaf-header-meta">
        <span>Sayfa ${pageData.pageNum} / ${arabicPageNum}</span>
      </div>
    </div>

    <!-- 15 Satırlık Mushaf Metin Gövdesi -->
    <div class="mushaf-15lines-body">
      ${ayahsHtml}
    </div>

    <!-- Sayfa Alt Bilgisi (Footer) -->
    <div class="mushaf-page-footer">
      <span>${pageData.surahName} Sûresi</span>
      <span class="page-num-arabic-pill">${arabicPageNum}</span>
      <span>${pageData.juzNo}. Cüz</span>
    </div>
  `;

  // Üst HUD Telemetrisindeki Mushaf Sayfa Rozetini Güncelle
  const hudMushafBadge = document.getElementById('hudMushafPageValue');
  if (hudMushafBadge) {
    hudMushafBadge.textContent = `${pageData.pageNum}. Sayfa (${pageData.juzNo}. Cüz)`;
  }

  // Sayfadaki ayet tıklama dinleyicilerini bağla (Ayete tıklandığında anında atla & çal)
  container.querySelectorAll('.page-ayah-span').forEach(span => {
    span.addEventListener('click', (e) => {
      const sNo = parseInt(span.dataset.surah, 10);
      const aNo = parseInt(span.dataset.ayah, 10);
      
      // 1. Ayeti seç ve paneli güncelle
      selectAyahOnPage(sNo, aNo);

      // 2. Eğer sayfa çalma modundaysak, doğrudan tıklanan ayete ATLA ve sıradan devam et!
      if (isPlayingPage) {
        const pageData = PAGE_CACHE[TilavetState.currentPage];
        if (pageData && pageData.ayahs) {
          const newIdx = pageData.ayahs.findIndex(a => a.surahNo === sNo && a.ayahNo === aNo);
          if (newIdx >= 0) {
            pageAudioIndex = newIdx;
            playNextAyahInPageQueue();
            return;
          }
        }
      }

      // 3. Eğer tekil ayet dinleniyorsa, tıklanan yeni ayete anında atla ve çal!
      if (TilavetState.isPlayingReference) {
        playQariRecitation(sNo, aNo);
        return;
      }

      // 4. Durak gülüne tıklandıysa veya çift tıklandıysa doğrudan seslendir
      if (e.target.classList.contains('flower-medallion') || e.detail >= 2) {
        playQariRecitation(sNo, aNo);
      }
    });
  });

  // Hedef ayeti veya ilk ayeti seç (tam sure ve ayet eşleştirmesi ile)
  let selectedAyah = null;
  let selectedSurah = null;

  if (targetSurahNo && targetAyahNo && pageData.ayahs) {
    const matching = pageData.ayahs.find(a => a.surahNo === targetSurahNo && a.ayahNo === targetAyahNo);
    if (matching) {
      selectedAyah = matching.ayahNo;
      selectedSurah = matching.surahNo;
    }
  }

  if (!selectedAyah && targetAyahNo && pageData.ayahs) {
    const matching = pageData.ayahs.find(a => a.ayahNo === targetAyahNo);
    if (matching) {
      selectedAyah = matching.ayahNo;
      selectedSurah = matching.surahNo;
    }
  }

  if (!selectedAyah) {
    selectedAyah = pageData.ayahs && pageData.ayahs[0] ? pageData.ayahs[0].ayahNo : 1;
    selectedSurah = pageData.ayahs && pageData.ayahs[0] ? pageData.ayahs[0].surahNo : (pageData.surahNo || 1);
  }

  selectAyahOnPage(selectedSurah, selectedAyah);

  // Sayfa değişim animasyonu ve meşhur sayfalar kısayol aktifliği (v2 Obsidyen)
  if (typeof onMushafPageChanged === 'function') {
    onMushafPageChanged(pageData.pageNum);
  }
}

// Sayfa Üzerindeki Ayeti Seç ve Sağ Paneli Senkronize Et
function selectAyahOnPage(surahNo, ayahNo) {
  TilavetState.currentSurah = surahNo;
  TilavetState.currentAyah = ayahNo;

  // Sayfa üzerinde altın ışıklı vurgu ve nabız parıltısı yap
  document.querySelectorAll('.page-ayah-span').forEach(el => {
    el.classList.remove('active-page-ayah');
    el.classList.remove('found-ayah-pulse');
  });
  const targetSpan = document.querySelector(`.page-ayah-span[data-surah="${surahNo}"][data-ayah="${ayahNo}"]`);
  if (targetSpan) {
    targetSpan.classList.add('active-page-ayah');
    targetSpan.classList.add('found-ayah-pulse');
    try {
      targetSpan.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (_) {}
  }

  // Aktif sayfa verisinden ayet nesnesini bul
  const pageData = PAGE_CACHE[TilavetState.currentPage];
  let ayahObj = null;
  if (pageData && pageData.ayahs) {
    ayahObj = pageData.ayahs.find(a => a.surahNo === surahNo && a.ayahNo === ayahNo);
  }

  const surahObj = SURAH_LIST.find(s => s.no === surahNo) || { name: `Sure ${surahNo}`, ayahs: 1 };
  const juzNo = pageData ? pageData.juzNo : getJuzForPage(TilavetState.currentPage);

  // Sağ Companion Paneli Güncelle
  const titleEl = document.getElementById('activeAyahTitle');
  const juzEl = document.getElementById('activeAyahJuzBadge');
  const latinEl = document.getElementById('activeAyahLatin');
  const mealEl = document.getElementById('activeAyahMeal');
  const tajweedRulesEl = document.getElementById('activeAyahTajweedRules');

  if (titleEl) titleEl.textContent = `${surahNo}. ${surahObj.name} Suresi - ${ayahNo}. Âyet`;
  if (juzEl) juzEl.textContent = `${juzNo}. CÜZ`;
  if (latinEl) latinEl.textContent = ayahObj?.latin || 'Okunuş hazırlanıyor...';
  if (mealEl) mealEl.textContent = ayahObj?.turkishMeal || 'Meal hazırlanıyor...';

  // Toolbar ve Beni Bul alanlarını senkronize et
  syncToolbarSurahSelect(surahNo);
  const bbSurah = document.getElementById('beniBulSurahSelect');
  const bbAyah = document.getElementById('beniBulAyahInput');
  if (bbSurah && bbSurah.value != surahNo) {
    bbSurah.value = surahNo;
    updateBeniBulAyahInputBounds();
  }
  if (bbAyah && bbAyah.value != ayahNo) {
    bbAyah.value = ayahNo;
  }

  // Eğitici Tecvid Analiz Kartlarını Bas
  if (tajweedRulesEl) {
    tajweedRulesEl.innerHTML = '';
    const rulesToRender = [];

    if (ayahObj && ayahObj.tajweedRules && ayahObj.tajweedRules.length > 0) {
      ayahObj.tajweedRules.forEach(r => {
        rulesToRender.push({ word: r.word, rule: r.rule, desc: r.desc });
      });
    } else if (ayahObj && ayahObj.words) {
      const activeRules = ayahObj.words.filter(w => w.tajweed);
      activeRules.forEach(w => {
        rulesToRender.push({ word: w.ar, rule: w.tajweed.rule, desc: w.tajweed.desc });
      });
    }

    if (rulesToRender.length > 0) {
      rulesToRender.forEach(r => {
        const info = resolveTajweedRuleDetails(r.rule, r.desc, r.word);
        const card = document.createElement('div');
        card.className = 'tajweed-edu-card';
        card.style.setProperty('--rule', info.color);
        card.innerHTML = `
          <div class="tajweed-card-top">
            <span class="tajweed-card-word">${r.word}</span>
            <span class="tajweed-card-badge">
              ${info.badge}
            </span>
          </div>
          <div class="tajweed-action-strip">
            ${info.action}
          </div>
          <div class="tajweed-detail-text">
            ${info.detail}
          </div>
        `;
        tajweedRulesEl.appendChild(card);
      });
    } else {
      tajweedRulesEl.innerHTML = `
        <div class="tajweed-edu-card" data-family="neutral">
          <div class="tajweed-action-strip">
             ASLÎ OKUYUŞ VE DOĞAL MED (Madd-i Tabîi / İzhâr)
          </div>
          <div class="tajweed-detail-text">
            Bu âyette özel tutma veya aşırı uzatma kuralı bulunmamaktadır. Harfler mahreçlerinden net ve izhâr ile telaffuz edilir; med harfleri tam 1 elif boyu doğal çekilir; duraklarda nefes yumuşakça verilir.
          </div>
        </div>
      `;
    }
  }

  // Oynatıcı Master Butonunu Güncelle
  if (!isPlayingPage) {
    const isThisPlaying = TilavetState.isPlayingReference && TilavetState.playingSurah === surahNo && TilavetState.playingAyah === ayahNo;
    updateMasterPlayButtonUI(isThisPlaying);
  }

  TilavetState.activeAyahObj = ayahObj;
}

// Master Oynatma Butonu Durum Güncelleyici (Spacebar Uyumlu & Ergonomik)
function updateMasterPlayButtonUI(isPlaying, statusText = '') {
  const playBtn = document.getElementById('btnPlayActiveAyah');
  if (!playBtn) return;
  const rec = RECITERS[activeReciterId] || RECITERS.dossary;
  const subTextEl = document.getElementById('activeReciterSubText');
  if (subTextEl) subTextEl.textContent = rec.name;

  if (isPlaying) {
    playBtn.classList.add('is-playing');
    playBtn.innerHTML = `
      <span class="master-play-icon">⏸</span>
      <div class="master-play-title-wrap">
        <span class="master-play-main-text">${statusText || 'Tilaveti Durdur'}</span>
        <span id="activeReciterSubText" class="master-play-sub-text">${rec.shortName} Dinleniyor</span>
      </div>
      <span class="space-shortcut-pill"><kbd>Boşluk</kbd></span>
    `;
  } else {
    playBtn.classList.remove('is-playing');
    playBtn.innerHTML = `
      <span class="master-play-icon">▶</span>
      <div class="master-play-title-wrap">
        <span class="master-play-main-text">${statusText || 'Âyeti Dinle'}</span>
        <span id="activeReciterSubText" class="master-play-sub-text">${rec.name}</span>
      </div>
      <span class="space-shortcut-pill"><kbd>Boşluk</kbd></span>
    `;
  }
}

// =========================================================
// EĞİTİCİ TECVİD KILAVUZU & DETAYLI ANALİZ MOTORU
// Kullanıcının sadece buraya bakarak doğru okumasını sağlar
// =========================================================
function resolveTajweedRuleDetails(ruleName, desc = '', word = '') {
  const fullText = (ruleName + ' ' + desc).toLowerCase();
  const cleanText = fullText
    .replace(/[âîûôê]/g, m => ({ 'â': 'a', 'î': 'i', 'û': 'u', 'ô': 'o', 'ê': 'e' }[m]))
    .replace(/ı/g, 'i');
  
  const isMuttasil = cleanText.includes('muttasil');
  const isMunfasil = cleanText.includes('munfasil');
  const isLazim = cleanText.includes('lazim');
  const isAriz = cleanText.includes('ariz');
  const isLin = cleanText.includes('lin');
  const isTabii = cleanText.includes('tabii') || cleanText.includes('tabii');
  const isMealGunne = cleanText.includes('meal gunne') || cleanText.includes('idgam-i meal gunne') || cleanText.includes('mealgunne');
  const isBilaGunne = cleanText.includes('bila gunne') || cleanText.includes('bilagunne');
  const isIhfa = cleanText.includes('ihfa') || (cleanText.includes('gunne') && !isMealGunne && !isBilaGunne);
  const isKalkale = cleanText.includes('kalkale');
  const isIklab = cleanText.includes('iklab');
  const isLafzatullah = cleanText.includes('lafzatullah');
  const isVakifLazim = cleanText.includes('vakf-i lazim') || cleanText.includes('vakif-lazim');
  const isVakifLa = cleanText.includes('la vakf') || cleanText.includes('vakif-la');
  const isBedel = cleanText.includes('bedel');
  const isMuaneka = cleanText.includes('muaneka') || cleanText.includes('muanaka');

  // Birleşik kombinasyonlar:
  if (isMunfasil && isIhfa) {
    return {
      rule: "Madd-i Munfasıl & İhfa",
      badge: "4 Elif Med + 1.5 Elif İhfa",
      color: "#ff3366",
      action: " 4 ELİF UZAT VE 1.5 ELİF GENİZDEN TUT!",
      detail: "Bu kelimede iki kural birleşmiştir: (1) Med harfinden sonra diğer kelimenin başında hemze olduğu için ses 4 elif boyu uzatılır. (2) Sakin nûn harfinde dil damağa yapıştırılmadan ses burun genzinde 1.5 elif tutularak ihfa yapılır."
    };
  }

  if (isMuttasil && isMealGunne) {
    return {
      rule: "İdgam-ı Meal Gunne & Madd-i Muttasıl",
      badge: "VÂCİB Med + Gunne",
      color: "#ff3366",
      action: " EN AZ 4 ELİF UZAT VE HARFİ KATARAK GENİZDEN TUT!",
      detail: "(1) Tek kelimede med harfi ve bitişik hemze (ء) geldiği için en az 4 elif uzatmak VÂCİB'dir (zorunludur). (2) Sakin nûn harfi sonraki harfe katılarak burnun genzinde 1.5 elif nağmeli olarak bekletilir."
    };
  }

  if (isAriz && isKalkale) {
    return {
      rule: "Madd-i Ârız & Kalkale (Durak)",
      badge: "Durak Uzatması + Titretme",
      color: "#00e5ff",
      action: " DURAKTA 2-4 ELİF UZAT VE KALKALE HARFİNİ ÇARPIP SARS!",
      detail: "(1) Âyet sonundaki son harf üzerinde durulduğunda med harfi 2 ila 4 elif uzatılır. (2) Son harf Dal/Kaf/Tı/Be/Cim ise harfin mahrecine kuvvetle vurup yankılandırarak serbest bırakılır (örn: Kadîr, Ehad)."
    };
  }

  // Tekil kurallar:
  if (isMuttasil) {
    return {
      rule: "Madd-i Muttasıl (Bitişik Uzatma)",
      badge: "VÂCİB (4 Elif)",
      color: "#ff3366",
      action: " EN AZ 4 ELİF (2.5 - 3 Saniye) KESİNTİSİZ UZAT!",
      detail: "Tek kelimede med harfi (ا و ي) ve ardından hemze (ء / أ) gelmiştir. Hükmü VÂCİB'dir (bütün imamlara göre zorunlu). 1 elifte bırakmak büyük hatadır; parmak sayar gibi 4 elif süresince sesini uzatmalısın."
    };
  }

  if (isMunfasil) {
    return {
      rule: "Madd-i Munfasıl (Ayrı Kelimede Uzatma)",
      badge: "CÂİZ (2 - 4 Elif)",
      color: "#ff5252",
      action: " 4 ELİF UZAT (Hızlı okuyuşta en az 2 elif).",
      detail: "Birinci kelimenin sonundaki med harfi ile ikinci kelimenin başındaki hemze peş peşe gelmiştir. Normal okuyuşta 4 elif, hızlı hatimde nefese göre 2-4 elif boyu uzatılır."
    };
  }

  if (isLazim) {
    return {
      rule: "Madd-i Lâzım (Farz / Kesin Uzatma)",
      badge: "FARZ / LÂZIM (6 Elif)",
      color: "#d50000",
      action: "⚠ MUTLAKA 6 ELİF UZAT! (En Uzun Çekim)",
      detail: "Med harfinden sonra şeddeli veya cezimli sâkin harf gelmiştir (örn: Elif-Lâm-Mîm, Veleddâllîn). Kur'an'daki en uzun meddir; ister yavaş ister hızlı oku, 6 elif (~4 saniye) çekmek zorunludur."
    };
  }

  if (isAriz) {
    return {
      rule: "Madd-i Ârız (Durak Uzatması)",
      badge: "CÂİZ (2 - 4 Elif)",
      color: "#ffab00",
      action: "⏸ DURACAKSAN 2 - 4 ELİF UZAT, GEÇECEKSEN 1 ELİF.",
      detail: "Âyet sonunda veya durakta nefes verilip durulurken oluşur. Duracaksan sesini 3-4 elif uzatarak duraklat. Eğer durmayıp sonraki ayete bağlayacaksan 1 elif çekip geç."
    };
  }

  if (isLin) {
    return {
      rule: "Madd-i Lîn (Yumuşak Uzatma)",
      badge: "YUMUŞAK (2 - 3 Elif)",
      color: "#ffd700",
      action: " YUMUŞAKÇA 2 - 3 ELİF UZATARAK DUR.",
      detail: "Vav veya Ya harfi sakin olup bir önceki harf üstün olduğunda harf boğazı sıkmadan yumuşakça akıtılır ve durulduğunda 2-3 elif boyu uzatılır."
    };
  }

  if (isTabii) {
    return {
      rule: "Madd-i Tabîi (Aslî Med)",
      badge: "ASLÎ (1 Elif)",
      color: "#ffc107",
      action: " TAM 1 ELİF (~1 Saniye / 1 Parmak Süresi) ÇEK.",
      detail: "Doğal harf çekimidir. 1 eliften az çekip harfi yutma, fazla çekip gereksiz uzatma yapma. Bir parmak kaldırıp indirecek kadar çek."
    };
  }

  if (isMealGunne) {
    return {
      rule: "İdgam-ı Meal Gunne (Katarak Tutma)",
      badge: "1.5 Elif Gunne",
      color: "#00c853",
      action: " SONRAKİ HARFE KAT VE 1.5 ELİF GENİZDEN TUT.",
      detail: "Sakin Nûn veya tenvin sonrasındaki Y, N, M, V harflerine katılır ve burun genzinde 1.5 elif nağmeli tutulur (örn: Mey-yekûlü)."
    };
  }

  if (isBilaGunne) {
    return {
      rule: "İdgam-ı Bilâ Gunne (Tutmadan Katma)",
      badge: "Tutmadan Bağla",
      color: "#00e676",
      action: "⚡ HİÇ BEKLEMEDEN DİREKT ŞEDDELİ BAĞLA!",
      detail: "Sâkin Nûn (نْ) veya tenvinden sonra Lâm (ل) veya Râ (ر) harfi geldiğinde geniz sesi (gunne) yapılmaz. Nûn harfi tamamen sonraki harfe katılır ve 'mir-rabbihi' şeklinde şeddeli bağlanıp hemen akıcı geçilir."
    };
  }

  if (isBedel) {
    return {
      rule: "Madd-i Bedel (Hemzeden Sonra Med)",
      badge: "1 Elif Med",
      color: "#ffd700",
      action: " 1 ELİF BOYU DOĞAL ÇEKEREK OKU.",
      detail: "Hemzeden sonra med harfi geldiğinde (Âmene, Ûtû, Îmânen) 1 elif boyu çekilir. Aşırı uzatılmaz, tam bir parmak süresiyle telaffuz edilir."
    };
  }

  if (isMuaneka) {
    return {
      rule: "Muâneka / Mü'ânaka (Üç Nokta Vakfı)",
      badge: "Biri Tercih Edilir",
      color: "#ffc837",
      action: " İKİ NOKTADAN SADECE BİRİNDE DUR, İKİSİNDE BİRDEN DURMA!",
      detail: "Birbirine yakın iki yerde üçer nokta (ۛ) bulunur. Birincisinde durursan ikincisinde geçmelisin; birincisinde geçersen ikincisinde durmalısın. İkisinde birden durulmaz veya ikisinde birden geçilmez."
    };
  }

  if (isIhfa) {
    return {
      rule: "İhfa / Şeddeli Gunne (Genizden Tutma)",
      badge: "1.5 Elif Tutma",
      color: "#00e676",
      action: " 1.5 ELİF GENİZDEN TUT (Burnundan Ses Ver).",
      detail: "Dilini damağa yapıştırma! Nûn veya tenvin sesini burnuna (genzine) vererek 1.5 elif miktarı hafif zırıltılı tut ve sonraki harfe akıcı geç."
    };
  }

  if (isKalkale) {
    return {
      rule: "Kalkale (Harfi Sarsarak Çıkarmak)",
      badge: "Kuvvetli Vuruş",
      color: "#00e5ff",
      action: " MAHRECİNE KUVVETLE VURUP SARSARAK BIRAK!",
      detail: "Kaf, Tı, Be, Cim, Dal (ق ط ب ج د) harfleri cezimli olduğunda mahrece kuvvetle çarpıp ses titreterek bırakılır (örn: Ehad, Kadîr)."
    };
  }

  if (isIklab) {
    return {
      rule: "İklâb (Mîm Harfine Çevirme)",
      badge: "Dönüştürme",
      color: "#ff9100",
      action: " NÛN'U MÎM'E ÇEVİR, DUDAKLARI HAFİF ARALIK 1.5 ELİF TUT.",
      detail: "Tenvin veya sakin Nûn'dan sonra Be (ب) gelirse ses Mîm'e döner, dudaklar sıkılmadan hafif temasla 1.5 elif genizden tutulur."
    };
  }

  if (isLafzatullah) {
    return {
      rule: "Lafzatullâh (Allah İsmi)",
      badge: "Kalın / İnce",
      color: "#b71c1c",
      action: " ÖNCEKİ HARF ÜSTÜN/ÖTRE İSE KALIN, ESRE İSE İNCE OKU.",
      detail: "Allah kelimesinden önceki harf üstün/ötre ise 'ALLAAH' kalın ve tok okunur; esre ise 'Lillêh / Bismillêh' ince okunur."
    };
  }

  if (isVakifLazim) {
    return {
      rule: "Vakf-ı Lâzım (م)",
      badge: "KESİN DUR",
      color: "#ff1744",
      action: " BURADA MUTLAKA DUR! (Nefes Al)",
      detail: "Mananın bozulmaması için durmak şarttır. Geçilirse cümlenin anlamı yanlış bir yöne kayabilir."
    };
  }

  if (isVakifLa) {
    return {
      rule: "Lâ Vakfı (لا)",
      badge: "DURMA / GEÇ",
      color: "#ff9100",
      action: "⛔ BURADA DURMA, DİREKT GEÇ!",
      detail: "Cümle bitmemiştir; durulursa anlam bölünür. Nefes yetmezse durulur ancak başlarken 1-2 kelime geriden alınmalıdır."
    };
  }

  return {
    rule: ruleName || "Tecvid Kuralı",
    badge: "Tecvid",
    color: "#ffd700",
    action: ` ${desc || "Kuralı dikkatle uygula."}`,
    detail: desc || "Doğru tilavet için tecvid kaidesini takip ediniz."
  };
}

// Belirtilen Mushaf Sayfasını Yükle (1 - 604 Standart Diyanet/Uthmani Sayfaları)
let isPageLoading = false;
let pageLoadGeneration = 0;
async function loadMushafPage(pageNum, targetAyahNo = null, targetSurahNo = null) {
  stopAllAudioPlayback();
  pageNum = Math.max(1, Math.min(604, parseInt(pageNum, 10) || 1));
  const generation = ++pageLoadGeneration;
  TilavetState.currentPage = pageNum;
  document.querySelectorAll('.btn-page-shortcut').forEach(button => {
    button.setAttribute('aria-pressed', String(Number(button.dataset.page) === pageNum));
  });

  // Sayfa numarası inputunu güncelle
  const inputEl = document.getElementById('inputPageNum');
  if (inputEl) inputEl.value = pageNum;

  // Önbellekte varsa anında 0 milisaniyede bas
  if (PAGE_CACHE[pageNum]) {
    isPageLoading = false;
    renderMushafPage(PAGE_CACHE[pageNum], targetAyahNo, targetSurahNo);
    syncToolbarSurahSelect(PAGE_CACHE[pageNum].surahNo);
    return;
  }

  // Yükleme Göstergesi
  const container = document.getElementById('realMushafPage');
  if (container) {
    container.innerHTML = `
      <div class="mushaf-state mushaf-state--loading" role="status">
        <div class="mushaf-state-title">Sayfa ${pageNum} hazırlanıyor…</div>
        <div class="mushaf-state-sub">Mushaf hattı, tecvid haritası ve mealler yükleniyor</div>
        <div class="mushaf-skeleton" aria-hidden="true">${'<i class="mushaf-skeleton-line"></i>'.repeat(15)}</div>
      </div>
    `;
  }

  isPageLoading = true;
  try {
    // Sayfa bazlı Al-Quran Cloud endpointleri tekil çağrılır (paralel Promise.all ile ~1-2 sn)
    const [resUthmani, resTurkish, resTranslit] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/page/${pageNum}/quran-uthmani`).then(r => r.json()).catch(() => null),
      fetch(`https://api.alquran.cloud/v1/page/${pageNum}/tr.diyanet`).then(r => r.json()).catch(() => null),
      fetch(`https://api.alquran.cloud/v1/page/${pageNum}/en.transliteration`).then(r => r.json()).catch(() => null)
    ]);
    if (generation !== pageLoadGeneration) return;

    if (resUthmani && resUthmani.code === 200 && resUthmani.data && resUthmani.data.ayahs && resUthmani.data.ayahs.length > 0) {
      const uthmaniData = resUthmani.data;
      const turkishData = resTurkish && resTurkish.code === 200 ? resTurkish.data : { ayahs: [] };
      const translitData = resTranslit && resTranslit.code === 200 ? resTranslit.data : { ayahs: [] };

      const firstAyah = uthmaniData.ayahs[0];
      const surahNo = firstAyah ? firstAyah.surah.number : 1;
      const surahObj = SURAH_LIST.find(s => s.no === surahNo) || { name: `Sure ${surahNo}`, arabic: '' };
      const juzNo = firstAyah ? firstAyah.juz : getJuzForPage(pageNum);

      const ayahsList = uthmaniData.ayahs.map((ay, idx) => {
        let text = ay.text;
        let isSurahStart = false;
        let bismillahText = '';

        // 1. ayet ise (Fâtiha ve Tevbe hariç) Bismillah ayet metninden ayrıştırılır ve tezhipli şeride aktarılır
        if (ay.numberInSurah === 1 && ay.surah.number !== 1 && ay.surah.number !== 9) {
          isSurahStart = true;
          const bismillahUthmani = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
          const bismillahSimple = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
          if (text.startsWith(bismillahUthmani)) {
            text = text.substring(bismillahUthmani.length).trim();
            bismillahText = bismillahSimple;
          } else if (text.startsWith(bismillahSimple)) {
            text = text.substring(bismillahSimple.length).trim();
            bismillahText = bismillahSimple;
          } else {
            const match = text.match(/^(بِسْمِ\s+.*?(?:الرَّحِيمِ|ٱلرَّحِيمِ))\s*(.*)$/);
            if (match) {
              bismillahText = bismillahSimple;
              text = match[2].trim();
            }
          }
        }

        const trMeal = (turkishData.ayahs && turkishData.ayahs[idx]) ? turkishData.ayahs[idx].text : '';
        const rawLatin = (translitData.ayahs && translitData.ayahs[idx]) ? translitData.ayahs[idx].text : '';
        const formattedLatin = formatLatinPhonetics(rawLatin);

        const words = text.split(' ').filter(w => w.length > 0).map(w => ({
          ar: w,
          tajweed: detectWordTajweedRules(w)
        }));

        const rulesList = words.filter(w => w.tajweed).map(w => ({
          word: w.ar,
          rule: w.tajweed.rule,
          desc: w.tajweed.desc
        }));

        return {
          surahNo: ay.surah.number,
          ayahNo: ay.numberInSurah,
          latin: formattedLatin,
          turkishMeal: trMeal,
          tajweedRules: rulesList,
          words: words,
          isSurahStart: isSurahStart,
          bismillahText: bismillahText
        };
      });

      const pageData = {
        pageNum: pageNum,
        surahNo: surahNo,
        surahName: surahObj.name,
        arabicTitle: surahObj.arabic ? `سُورَةُ ${surahObj.arabic.replace('سُورَةُ ', '')}` : `سُورَةُ ${surahObj.name}`,
        juzNo: juzNo,
        ayahs: ayahsList
      };

      PAGE_CACHE[pageNum] = pageData;
      renderMushafPage(pageData, targetAyahNo, targetSurahNo);
      syncToolbarSurahSelect(targetSurahNo || surahNo);
    } else {
      throw new Error("Sayfa verisi API'den okunamadı");
    }
  } catch (err) {
    if (generation !== pageLoadGeneration) return;
    console.error('Sayfa API yükleme hatası:', err);
    if (container) {
      container.innerHTML = `
        <div class="mushaf-state mushaf-state--error" role="alert">
          <div class="mushaf-state-title">Sayfa ${pageNum} yüklenemedi</div>
          <div class="mushaf-state-sub">Sunucuya ulaşılamadı. Tekrar deneyin veya çevrimdışı hazır sayfalardan birini seçin.</div>
          <div class="mushaf-state-actions">
            <button class="btn btn-gold" onclick="loadMushafPage(${pageNum})">Tekrar dene</button>
            <button class="btn btn-outline" onclick="loadMushafPage(2)">Sayfa 2 (Bakara başı)</button>
            <button class="btn btn-outline" onclick="loadMushafPage(50)">Sayfa 50 (Âmenerrasûlü)</button>
          </div>
        </div>
      `;
    }
  } finally {
    if (generation === pageLoadGeneration) isPageLoading = false;
  }
}

// =========================================================
// SAĞLAM, KESİNTİSİZ TİLAVET SESLENDİRME MOTORU
// =========================================================

// Aktif çalan ses referansı
let activeAudioElement = null;

// Tüm ses çalmayı tamamen durdur ve arayüzü sıfırla
function stopAllAudioPlayback(reason = 'manual') {
  if (activeAudioElement) {
    try {
      activeAudioElement.onplay = null;
      activeAudioElement.onended = null;
      activeAudioElement.onerror = null;
      activeAudioElement.pause();
      activeAudioElement.removeAttribute('src');
      activeAudioElement.load();
    } catch (e) {}
    activeAudioElement = null;
  }
  
  TilavetState.audioPlayer = null;
  isPlayingPage = false;
  pageAudioQueue = [];
  pageAudioIndex = 0;
  TilavetState.isPlayingReference = false;

  const pageBtn = document.getElementById('btnPlayCurrentPage');
  if (pageBtn) pageBtn.innerHTML = '▶ Tüm Sayfayı Oynat';

  updateMasterPlayButtonUI(false);
  document.querySelectorAll('.page-ayah-span').forEach(el => el.classList.remove('page-ayah-playing'));
}

// AudioManager'a Mushaf çalarını kaydet
if (typeof TilavetAudioManager !== 'undefined') {
  TilavetAudioManager.register('mushaf', { stop: stopAllAudioPlayback, category: 'mushaf' });
}

// Seçili Âyetin Sesini Dinlet (Toggle: Çalıyorsa durdurur, duruyorsa çalar)
function playActiveAyahAudio() {
  if (!TilavetState.currentSurah || !TilavetState.currentAyah) {
    const pageData = PAGE_CACHE[TilavetState.currentPage];
    if (pageData && pageData.ayahs && pageData.ayahs[0]) {
      TilavetState.currentSurah = pageData.ayahs[0].surahNo;
      TilavetState.currentAyah = pageData.ayahs[0].ayahNo;
    } else {
      TilavetState.currentSurah = 2;
      TilavetState.currentAyah = 285;
    }
  }

  // Eğer sayfa veya tekil ses çalıyorsa, basıldığında durdur (Toggle)
  if (TilavetState.isPlayingReference || isPlayingPage) {
    stopAllAudioPlayback();
    triggerLiveTajweedFeedback('⏹ Tilavet durduruldu (Boşluk / Buton).', 'INFO');
    return;
  }

  isPlayingPage = false;

  // Akıllı tekil âyet oynatma: Kullanıcının akış tercihine göre âyet bittiğinde otomatik devam eder veya sabit kalır
  playSingleAyahWithFlowChoice(TilavetState.currentSurah, TilavetState.currentAyah);
}

// Akış tercihine göre tekil âyeti çalma ve sonrasında davranma
function playSingleAyahWithFlowChoice(surahNo, ayahNo) {
  playQariRecitation(surahNo, ayahNo, () => {
    const flowMode = (typeof TilavetAudioManager !== 'undefined')
      ? TilavetAudioManager.getFlowMode()
      : 'auto_advance';

    // Sabit Kal modunda âyet biter bitmez dur ve seçili âyette kal
    if (flowMode === 'stay_on_ayah') {
      TilavetState.isPlayingReference = false;
      updateMasterPlayButtonUI(false);
      triggerLiveTajweedFeedback(` Âyet tilâveti tamamlandı. Sabit kal modunda bekleniyor (${surahNo}:${ayahNo}).`, 'INFO');
      return;
    }

    // Kesintisiz Akış modunda: Sayfadaki sıradaki âyete otomatik geç!
    const pageData = PAGE_CACHE[TilavetState.currentPage];
    if (pageData && pageData.ayahs && pageData.ayahs.length) {
      const curIdx = pageData.ayahs.findIndex(a => a.surahNo === surahNo && a.ayahNo === ayahNo);
      if (curIdx >= 0 && curIdx < pageData.ayahs.length - 1) {
        const nextAyah = pageData.ayahs[curIdx + 1];
        selectAyahOnPage(nextAyah.surahNo, nextAyah.ayahNo);
        playSingleAyahWithFlowChoice(nextAyah.surahNo, nextAyah.ayahNo);
        return;
      } else if (curIdx === pageData.ayahs.length - 1 && TilavetState.currentPage < 604) {
        // Sayfa sonuna gelindi, sonraki sayfaya geç!
        triggerLiveTajweedFeedback(` ${TilavetState.currentPage}. Sayfa bitti, ${TilavetState.currentPage + 1}. Sayfaya kesintisiz geçiliyor...`, 'INFO');
        if (typeof showToast === 'function') {
          showToast(` ${TilavetState.currentPage + 1}. Sayfaya kesintisiz geçiliyor...`);
        }
        loadMushafPage(TilavetState.currentPage + 1, null, true);
        setTimeout(() => {
          const newPage = PAGE_CACHE[TilavetState.currentPage];
          if (newPage && newPage.ayahs && newPage.ayahs[0]) {
            selectAyahOnPage(newPage.ayahs[0].surahNo, newPage.ayahs[0].ayahNo);
            playSingleAyahWithFlowChoice(newPage.ayahs[0].surahNo, newPage.ayahs[0].ayahNo);
          }
        }, 500);
        return;
      }
    }

    TilavetState.isPlayingReference = false;
    updateMasterPlayButtonUI(false);
  });
}

// Tüm Sayfayı Sırayla Oynat (SEÇİLİ AYETTEN VEYA BAŞTAN BAŞLAR)
let isPlayingPage = false;
let pageAudioQueue = [];
let pageAudioIndex = 0;

function playCurrentPageAudio() {
  const pageData = PAGE_CACHE[TilavetState.currentPage];
  if (!pageData || !pageData.ayahs || pageData.ayahs.length === 0) {
    triggerLiveTajweedFeedback('⚠ Sayfa verisi henüz hazır değil.', 'ALERT');
    return;
  }

  const btn = document.getElementById('btnPlayCurrentPage');
  if (isPlayingPage) {
    stopAllAudioPlayback();
    triggerLiveTajweedFeedback('⏹ Sayfa tilaveti durduruldu.', 'INFO');
    return;
  }

  isPlayingPage = true;
  pageAudioQueue = pageData.ayahs;

  // SEÇİLİ ÂYETTEN BAŞLAT! (Kullanıcı hangi ayeti seçtiyse oradan başlar)
  let startIndex = 0;
  if (TilavetState.currentAyah) {
    const foundIdx = pageData.ayahs.findIndex(a => a.surahNo === TilavetState.currentSurah && a.ayahNo === TilavetState.currentAyah);
    if (foundIdx >= 0) {
      startIndex = foundIdx;
    }
  }
  pageAudioIndex = startIndex;

  if (btn) btn.innerHTML = '⏹ Sayfa Tilavetini Durdur';
  playNextAyahInPageQueue();
}

function playNextAyahInPageQueue() {
  const btn = document.getElementById('btnPlayCurrentPage');
  if (!isPlayingPage) return;

  // Sayfa sonuna gelindi mi?
  if (pageAudioIndex >= pageAudioQueue.length) {
    const flowMode = (typeof TilavetAudioManager !== 'undefined')
      ? TilavetAudioManager.getFlowMode()
      : 'auto_advance';

    // Kullanıcı Kesintisiz Akış istiyorsa ve son sayfa değilse: SONRAKİ SAYFAYA GEÇ!
    if (flowMode === 'auto_advance' && TilavetState.currentPage < 604) {
      triggerLiveTajweedFeedback(` ${TilavetState.currentPage}. Sayfa tamamlandı, ${TilavetState.currentPage + 1}. Sayfaya kesintisiz geçiliyor...`, 'SUCCESS');
      if (typeof showToast === 'function') {
        showToast(` ${TilavetState.currentPage + 1}. Sayfa kesintisiz başlatılıyor...`);
      }
      loadMushafPage(TilavetState.currentPage + 1, null, true);
      setTimeout(() => {
        if (!isPlayingPage) return;
        const newPageData = PAGE_CACHE[TilavetState.currentPage];
        if (newPageData && newPageData.ayahs && newPageData.ayahs.length) {
          pageAudioQueue = newPageData.ayahs;
          pageAudioIndex = 0;
          playNextAyahInPageQueue();
        } else {
          stopAllAudioPlayback();
        }
      }, 500);
      return;
    } else {
      // Sabit Kal modu veya son sayfada bitir
      isPlayingPage = false;
      if (btn) btn.innerHTML = '▶ Tüm Sayfayı Oynat';
      document.querySelectorAll('.page-ayah-span').forEach(el => el.classList.remove('page-ayah-playing'));
      triggerLiveTajweedFeedback(`✅ ${TilavetState.currentPage}. Sayfanın tamamı dinlendi.`, 'SUCCESS');
      return;
    }
  }

  const ay = pageAudioQueue[pageAudioIndex];
  selectAyahOnPage(ay.surahNo, ay.ayahNo);

  playQariRecitation(ay.surahNo, ay.ayahNo, () => {
    if (isPlayingPage) {
      pageAudioIndex++;
      playNextAyahInPageQueue();
    }
  }, null, (err) => {
    if (isPlayingPage) {
      triggerLiveTajweedFeedback(`⚠️ ${ay.surahNo}:${ay.ayahNo} tilâvet sesi yüklenemedi, sıradaki âyete geçiliyor...`, "ALERT");
      pageAudioIndex++;
      setTimeout(() => playNextAyahInPageQueue(), 800);
    }
  });
}

// Kari Sesini Çal (seçili kayıt; bulunamazsa açık hata bildirimi)
function playQariRecitation(surahNo, ayahNo, onEndedCallback = null, requestedReciterId = null, onErrorCallback = null, callerSource = 'mushaf') {
  if (requestedReciterId && !RECITERS[requestedReciterId]) {
    const message = `Seçilen kâri kataloğunda bulunamadı: ${requestedReciterId}`;
    console.error(message);
    triggerLiveTajweedFeedback(message, "ALERT");
    if (typeof showToast === 'function') showToast(message);
    return;
  }

  // 0. Merkezi Ses Yöneticisine bildir: Belirtilen kaynak dışındaki tüm sesleri SUSTUR!
  if (typeof TilavetAudioManager !== 'undefined') {
    TilavetAudioManager.notifyPlay(callerSource || 'mushaf');
  }

  // 1. Önceki çalan sesi zombi listener'larını temizleyerek tamamen sustur
  if (activeAudioElement) {
    try {
      activeAudioElement.onplay = null;
      activeAudioElement.onended = null;
      activeAudioElement.onerror = null;
      activeAudioElement.pause();
      activeAudioElement.removeAttribute('src');
      activeAudioElement.load();
    } catch(e) {}
    activeAudioElement = null;
  }

  // Aktif okuyucuyu belirle: Parametre yoksa DOM select'ten oku (senkronizasyon garantisi)
  const domSelect = document.getElementById('selectReciter');
  if (domSelect && domSelect.value && !requestedReciterId) {
    activeReciterId = domSelect.value;
  }
  const currentReciterKey = requestedReciterId || activeReciterId || 'dossary';
  const rec = RECITERS[currentReciterKey];
  if (!rec) {
    const message = `Seçili kâri kataloğunda bulunamadı: ${currentReciterKey}`;
    console.error(message);
    triggerLiveTajweedFeedback(message, "ALERT");
    if (typeof showToast === 'function') showToast(message);
    TilavetState.isPlayingReference = false;
    if (!isPlayingPage) updateMasterPlayButtonUI(false);
    return;
  }
  const audioUrl = getAyahAudioUrl(surahNo, ayahNo, currentReciterKey);

  if (!isPlayingPage) {
    updateMasterPlayButtonUI(false, 'Yükleniyor...');
  }

  triggerLiveTajweedFeedback(`${rec.name} tilaveti yükleniyor (${surahNo}:${ayahNo})...`, "INFO");

  // Yeni bağımsız ses nesnesi
  const player = new Audio();
  player.preload = "auto";
  player.volume = 1.0;
  activeAudioElement = player;
  TilavetState.audioPlayer = player;
  TilavetState.playingSurah = surahNo;
  TilavetState.playingAyah = ayahNo;

  // Sayfa üzerinde çalan ayeti altın parıltısıyla vurgula
  const highlightPlayingSpan = () => {
    document.querySelectorAll('.page-ayah-span').forEach(el => el.classList.remove('page-ayah-playing'));
    const targetSpan = document.querySelector(`.page-ayah-span[data-surah="${surahNo}"][data-ayah="${ayahNo}"]`);
    if (targetSpan) targetSpan.classList.add('page-ayah-playing');
  };

  player.onplay = () => {
    if (activeAudioElement !== player) return;

    TilavetState.isPlayingReference = true;
    if (!isPlayingPage) {
      updateMasterPlayButtonUI(true);
    }
    highlightPlayingSpan();
    triggerLiveTajweedFeedback(` ${rec.name} dinleniyor: ${surahNo}. Sure, ${ayahNo}. Âyet`, "INFO");
  };

  player.onended = () => {
    if (activeAudioElement !== player) return;

    TilavetState.isPlayingReference = false;
    if (!isPlayingPage) {
      updateMasterPlayButtonUI(false);
    }
    document.querySelectorAll('.page-ayah-span').forEach(el => el.classList.remove('page-ayah-playing'));

    if (typeof onEndedCallback === 'function') {
      onEndedCallback();
    }
  };

  player.onerror = (e) => {
    if (activeAudioElement !== player) return;

    console.warn('Tilavet sesi yükleme hatası:', audioUrl, e);
    TilavetState.isPlayingReference = false;
    if (!isPlayingPage) {
      updateMasterPlayButtonUI(false);
    }
    document.querySelectorAll('.page-ayah-span').forEach(el => el.classList.remove('page-ayah-playing'));

    triggerLiveTajweedFeedback(`⚠ Ses yüklenemedi (${rec.shortName} - ${surahNo}:${ayahNo}).`, "ALERT");

    if (typeof onErrorCallback === 'function') onErrorCallback(e);
  };

  // Ses kaynağını ata ve başlat
  player.src = audioUrl;
  const playPromise = player.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      if (err.name === 'AbortError') return;
      if (activeAudioElement !== player) return;

      console.warn('Ses otomatik oynatılamadı:', err);
      TilavetState.isPlayingReference = false;
      if (!isPlayingPage) updateMasterPlayButtonUI(false);
      triggerLiveTajweedFeedback(`⚠ Ses başlatılamadı: Lütfen sayfaya tıklayıp tekrar deneyiniz (${err.message})`, "ALERT");
      if (typeof onErrorCallback === 'function') onErrorCallback(err);
    });
  }
  return player;
}
window.playQariRecitation = playQariRecitation;

// Web Audio API & Bağımsız Mikrofon Enerji Analizörü (Kendi İçinde Tam Entegre)
let audioCtx = null;
let analyserNode = null;
let micStream = null;
let micSource = null;
let isMicActive = false;
let timeDataArray = null;

async function initAudioEngine() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 1024;
    timeDataArray = new Uint8Array(analyserNode.fftSize);
  }
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }
}

async function toggleMicrophone() {
  await initAudioEngine();
  if (isMicActive) {
    if (micStream) {
      micStream.getTracks().forEach(t => t.stop());
      micStream = null;
    }
    if (micSource) {
      micSource.disconnect();
      micSource = null;
    }
    isMicActive = false;
    return;
  }
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micSource = audioCtx.createMediaStreamSource(micStream);
    micSource.connect(analyserNode);
    isMicActive = true;
  } catch(e) {
    console.warn("Mikrofon izni alınamadı:", e);
  }
}

function getAcousticEnergy() {
  if (!analyserNode || !isMicActive || !timeDataArray) return 0;
  analyserNode.getByteTimeDomainData(timeDataArray);
  let sum = 0;
  for (let i = 0; i < timeDataArray.length; i++) {
    const norm = (timeDataArray[i] - 128) / 128;
    sum += norm * norm;
  }
  return Math.sqrt(sum / timeDataArray.length);
}

// Canlı Tilavet Dinleme ve Hata Kontrol Döngüsü
let tilavetSpeechRec = null;

async function toggleTilavetListening() {
  const listenBtn = document.getElementById('btnListenTilavet');
  const liveIndicator = document.getElementById('tilavetLiveBadge');
  
  if (TilavetState.isListening) {
    TilavetState.isListening = false;
    listenBtn.innerHTML = ' Tilaveti Dinle ve Denetle';
    listenBtn.classList.remove('recording');
    if (liveIndicator) {
      liveIndicator.style.display = 'none';
      liveIndicator.classList.add('hidden');
    }
    if (tilavetSpeechRec) {
      try { tilavetSpeechRec.stop(); } catch(e) {}
    }
    if (typeof showToast === 'function') showToast("⏹ Canlı denetim durduruldu.");
    return;
  }
  
  // Mikrofon akışını Web Audio ve Analyser'a bağla (Canlı RMS enerjisi için)
  if (!isMicActive) {
    await toggleMicrophone();
  } else {
    await initAudioEngine();
  }
  
  TilavetState.isListening = true;
  listenBtn.innerHTML = ' Dinlemeyi Durdur';
  listenBtn.classList.add('recording');
  if (liveIndicator) {
    liveIndicator.style.display = 'inline-flex';
    liveIndicator.classList.remove('hidden');
  }
  
  // Ses sürelerini ve duraklarını takip eden zamanlayıcı
  startAcousticTimingTracker();
  
  // Tarayıcı Arapça Konuşma Tanıma (Web Speech API)
  initSpeechRecognition();
  
  triggerLiveTajweedFeedback(" Tilavet dinleniyor... Lütfen okumaya başlayınız.", "INFO");
  if (typeof showToast === 'function') showToast(" Mikrofon aktif: Tilavet denetleniyor");
}

// Akustik Süre ve Durak Takipçisi (Web Audio RMS ile milisaniye hassasiyetinde Madd & Vakıf kontrolü)
let acousticTimerId = null;
function startAcousticTimingTracker() {
  if (acousticTimerId) clearInterval(acousticTimerId);
  
  let isVocalizing = false;
  let vocalStart = 0;
  let silenceStart = Date.now();
  
  acousticTimerId = setInterval(() => {
    if (!TilavetState.isListening) {
      clearInterval(acousticTimerId);
      return;
    }
    
    const energy = getAcousticEnergy();
    const now = Date.now();
    
    // Ses çıkarılıyor mu? (Eşik > 0.08)
    if (energy > 0.08) {
      if (!isVocalizing) {
        // Yeni bir ses başladı
        isVocalizing = true;
        vocalStart = now;
        
        // Önceki sessizlik süresini kontrol et (Durak kontrolü)
        const silenceDuration = now - silenceStart;
        checkWaqfRuleAtTransition(silenceDuration);
      }
    } else {
      if (isVocalizing) {
        // Ses bitti / sustu
        isVocalizing = false;
        silenceStart = now;
        const vocalDuration = now - vocalStart;
        
        // Uzatma süresini denetle (Madd kontrolü)
        checkMaddDurationRule(vocalDuration);
      }
    }
  }, 50);
}

// 1. UZATMA KURALI DENETİMİ (Madd-i Muttasıl, Lâzım ve Tabii)
function checkMaddDurationRule(durationMs) {
  const currentAyah = TilavetState.activeAyahObj;
  if (!currentAyah || !currentAyah.words || !TilavetState.isListening) return;

  // Kullanıcının telaffuz ettiği kelimeyi kontrol et
  const spoken = TilavetState.lastRecognizedWord || '';
  if (!spoken) return;

  // Sadece kullanıcının telaffuz ettiği kelimede 4-6 Eliflik bir uzatma kuralı varsa denetle
  const targetMaddWord = currentAyah.words.find(w => {
    if (!w.tajweed || !w.tajweed.targetDurationMs || w.tajweed.targetDurationMs <= 1000) return false;
    const cleanAr = w.ar.replace(/[ًٌٍَُِّْٰۖۗۚۛۜ]/g, '');
    return spoken.includes(cleanAr);
  });
  
  if (targetMaddWord) {
    if (durationMs < 650) {
      // 4 elif uzatması gerekirken erken kesti!
      triggerTajweedError("MADD_UZAT", targetMaddWord.ar, targetMaddWord.tajweed.rule);
    }
  }
}

// 2. VAKIF / DURAK KURALI DENETİMİ (Lâ Vakfe ve Vakf-ı Lâzım)
function checkWaqfRuleAtTransition(silenceDurationMs) {
  const currentAyah = TilavetState.activeAyahObj;
  if (!currentAyah || !currentAyah.words || !TilavetState.isListening) return;
  
  // Eğer 450ms'den uzun bir duraklama/nefes yapıldıysa
  if (silenceDurationMs > 450) {
    // "لا" (Lâ Vakfe) üzerinde mi durdu?
    const laWord = currentAyah.words.find(w => w.tajweed && w.tajweed.rule === "vakif-la");
    if (laWord && (TilavetState.lastRecognizedWord || '').includes(laWord.ar.replace(/[ًٌٍَُِّْٰۖۗۚۛۜ]/g, ''))) {
      triggerTajweedError("VAKIF_GEC", laWord.ar);
    }
  } else {
    // Çok hızlı geçildi; acaba Vakf-ı Lâzım (م) atlandı mı?
    const lazimWord = currentAyah.words.find(w => w.tajweed && w.tajweed.rule === "vakif-lazim");
    if (lazimWord && silenceDurationMs < 200 && (TilavetState.lastRecognizedWord || '').includes(lazimWord.ar.replace(/[ًٌٍَُِّْٰۖۗۚۛۜ]/g, ''))) {
      triggerTajweedError("VAKIF_DUR", lazimWord.ar, "Vakf-ı Lâzım (م)");
    }
  }
}

// Tarayıcı Konuşma Tanıma Başlatıcı (Arapça)
function initSpeechRecognition() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    console.warn('Tarayıcınız Web Speech API desteklemiyor.');
    return;
  }
  
  tilavetSpeechRec = new SpeechRec();
  tilavetSpeechRec.lang = 'ar-SA';
  tilavetSpeechRec.continuous = true;
  tilavetSpeechRec.interimResults = true;
  
  tilavetSpeechRec.onresult = (evt) => {
    let transcript = '';
    for (let i = evt.resultIndex; i < evt.results.length; i++) {
      transcript += evt.results[i][0].transcript;
    }
    const cleanTranscript = transcript.trim();
    TilavetState.lastRecognizedWord = cleanTranscript;
    const liveWordBox = document.getElementById('tilavetRecognizedWord');
    if (liveWordBox) liveWordBox.textContent = cleanTranscript;
    
    // Kelime eşleştirme ve ilerletme
    highlightMatchingWord(cleanTranscript);
  };
  
  tilavetSpeechRec.onerror = (e) => {
    console.warn('Konuşma tanıma uyarısı:', e.error);
  };
  
  try {
    tilavetSpeechRec.start();
  } catch(e) {}
}

function highlightMatchingWord(spokenText) {
  const currentAyah = TilavetState.activeAyahObj;
  if (!currentAyah || !currentAyah.words) return;
  
  // Ayetteki kelimeleri tara
  currentAyah.words.forEach((w) => {
    if (spokenText.includes(w.ar.replace(/[ًٌٍَُِّْٰ]/g, ''))) {
      const wordEls = document.querySelectorAll(`[data-surah="${currentAyah.surahNo}"][data-ayah="${currentAyah.ayahNo}"]`);
      wordEls.forEach(el => el.classList.add('word-correct-highlight'));
    }
  });
}

// Hata Bildirimi Tetikle ve Konsola / Karnelere Ekle
function triggerTajweedError(errorType, word, extraInfo = '') {
  const ruleDef = TAJWEED_RULES[errorType];
  if (!ruleDef) return;
  
  const msg = ruleDef.getMsg(word, extraInfo);
  
  // Listeye ekle
  TilavetState.errors.unshift({
    type: errorType,
    badge: ruleDef.badge,
    color: ruleDef.color,
    word: word,
    msg: msg,
    time: new Date().toLocaleTimeString('tr-TR')
  });
  
  // Puanı güncelle
  TilavetState.score = Math.max(10, TilavetState.score - 5);
  
  renderErrorConsole();
  updateTajweedScorecard();
}

function triggerLiveTajweedFeedback(text, level = "ALERT") {
  const banner = document.getElementById('liveFeedbackBanner');
  if (!banner) return;
  
  banner.textContent = text;
  banner.className = `live-feedback-banner ${level.toLowerCase()}`;
}

function reportManualTajweedAlert(word, tajweed) {
  if (tajweed.rule.includes('madd')) {
    triggerTajweedError("MADD_UZAT", word, "4 Elif Uzatma");
  } else if (tajweed.rule.includes('ihfa')) {
    triggerTajweedError("IHFA_TUT", word);
  } else if (tajweed.rule.includes('kalkale')) {
    triggerTajweedError("KALKALE", word);
  } else if (tajweed.rule.includes('vakif-la')) {
    triggerTajweedError("VAKIF_GEC", word);
  } else if (tajweed.rule.includes('vakif-lazim')) {
    triggerTajweedError("VAKIF_DUR", word);
  }
}

// Hata Konsolunu Ekrana Bas
function renderErrorConsole() {
  const consoleEl = document.getElementById('tilavetErrorList');
  if (!consoleEl) return;
  
  consoleEl.innerHTML = '';
  
  if (TilavetState.errors.length === 0) {
    consoleEl.innerHTML = '<div class="tilavet-error-empty">Henüz bir tilavet hatası tespit edilmedi. Okumaya devam edebilirsiniz.</div>';
    return;
  }
  
  TilavetState.errors.slice(0, 10).forEach(err => {
    const item = document.createElement('div');
    item.className = 'tilavet-error-item';
    item.style.setProperty('--err', err.color);
    item.innerHTML = `
      <div class="tilavet-error-head">
        <span class="error-badge" style="--err:${err.color}">${err.badge}</span>
        <span class="tilavet-error-time">${err.time}</span>
      </div>
      <div class="tilavet-error-msg">${err.msg}</div>
    `;
    consoleEl.appendChild(item);
  });
}

// Tecvid Karnesini Güncelle
function updateTajweedScorecard() {
  const scoreEl = document.getElementById('tilavetScoreVal');
  const errCountEl = document.getElementById('tilavetErrCount');
  if (scoreEl) scoreEl.textContent = `%${TilavetState.score}`;
  if (errCountEl) errCountEl.textContent = `${TilavetState.errors.length} Hata`;
}

// Olay Dinleyicileri
function setupTilavetEventListeners() {
  // Sure seçici değiştiğinde doğrudan o surenin ilk Mushaf sayfasına git
  document.getElementById('selectSurah')?.addEventListener('change', (e) => {
    const sNo = parseInt(e.target.value, 10);
    const startPage = SURAH_START_PAGE[sNo] || 1;
    loadMushafPage(startPage, 1);
  });
  
  // Canlı dinleme butonu
  document.getElementById('btnListenTilavet')?.addEventListener('click', toggleTilavetListening);
  
  // Simülasyon Butonları (Kullanıcının hemen hataları test edebilmesi için)
  document.getElementById('btnSimErrorMadd')?.addEventListener('click', () => {
    triggerTajweedError("MADD_UZAT", "السَّمَاءِ (es-Semâi)", "Madd-i Muttasıl (4 Elif)");
    triggerLiveTajweedFeedback("⚠ UZATMAN LAZIM: 'es-Semâi' kelimesinde 4 elif uzatma yapılmadı!", "ERROR");
  });
  
  document.getElementById('btnSimErrorMaddShort')?.addEventListener('click', () => {
    triggerTajweedError("MADD_KISALT", "قَالَ (Kâle)");
    triggerLiveTajweedFeedback(" KISALT: 'Kâle' kelimesi 1 eliften fazla uzatılamaz!", "WARNING");
  });
  
  document.getElementById('btnSimErrorWaqfLa')?.addEventListener('click', () => {
    triggerTajweedError("VAKIF_GEC", "وَلَا (Ve Lâ)");
    triggerLiveTajweedFeedback("⛔ BURADA DURMAMAN LAZIM: Lâ Vakfında durulmaz!", "ERROR");
  });
  
  document.getElementById('btnSimErrorWaqfMust')?.addEventListener('click', () => {
    triggerTajweedError("VAKIF_DUR", "فَلَا يَحْزُنكَ (fe lâ yahzünke)", "Vakf-ı Lâzım (م)");
    triggerLiveTajweedFeedback(" ORADA DURMAN LAZIM: Vakf-ı Lâzım'da durulmalıdır!", "ERROR");
  });
  
  document.getElementById('btnSimErrorIhfa')?.addEventListener('click', () => {
    triggerTajweedError("IHFA_TUT", "مِن قَبْلِكُمْ (Min kabliküm)");
    triggerLiveTajweedFeedback(" 1.5 ELİF TUTMAN LAZIM: İhfa kuralı uygulanmalıdır!", "WARNING");
  });
  
  document.getElementById('btnResetTilavetScore')?.addEventListener('click', () => {
    TilavetState.errors = [];
    TilavetState.score = 100;
    renderErrorConsole();
    updateTajweedScorecard();
    triggerLiveTajweedFeedback("Karneniz ve hata geçmişiniz sıfırlandı.", "INFO");
  });
  
  // BENİ BUL (Ayet Konumlandırıcı) Kapat Butonu
  document.getElementById('btnCloseBeniBulDeck')?.addEventListener('click', () => {
    const box = document.getElementById('beniBulDeck');
    if (box) {
      box.style.display = 'none';
      box.classList.add('hidden');
    }
  });

  document.getElementById('btnStartBeniBulVoice')?.addEventListener('click', toggleBeniBulListening);
  document.getElementById('btnToggleBeniBulLang')?.addEventListener('click', toggleBeniBulLanguage);

  // BENİ BUL: Doğrudan Sure ve Âyet Seçim Dinleyicileri
  const beniBulSurah = document.getElementById('beniBulSurahSelect');
  const beniBulAyah = document.getElementById('beniBulAyahInput');
  const btnBeniBulDirectGo = document.getElementById('btnBeniBulDirectGo');

  beniBulSurah?.addEventListener('change', () => {
    updateBeniBulAyahInputBounds();
    const sNo = parseInt(beniBulSurah.value, 10);
    const sObj = SURAH_LIST.find(s => s.no === sNo);
    if (sObj && beniBulInput && !beniBulInput.value.trim()) {
      beniBulInput.placeholder = `${sObj.name} suresinde ara (1 - ${sObj.ayahs})...`;
    }
  });

  beniBulAyah?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      btnBeniBulDirectGo?.click();
    }
  });

  btnBeniBulDirectGo?.addEventListener('click', async () => {
    const sNo = parseInt(beniBulSurah?.value, 10) || 1;
    let aNo = parseInt(beniBulAyah?.value, 10) || 1;
    await locateAndSelectSurahAyah(sNo, aNo);
  });

  const beniBulInput = document.getElementById('inputBeniBulText');
  const clearInputBtn = document.getElementById('btnClearBeniBulText');

  // Canlı Yazarken Arama (350ms debounce)
  let typingDebounceTimer = null;
  beniBulInput?.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (clearInputBtn) {
      clearInputBtn.style.display = val.length > 0 ? 'block' : 'none';
    }
    if (typingDebounceTimer) clearTimeout(typingDebounceTimer);
    if (val.length >= 2) {
      typingDebounceTimer = setTimeout(() => {
        executeBeniBulSearch(val);
      }, 350);
    } else if (val.length === 0) {
      const resultsContainer = document.getElementById('beniBulResultsContainer');
      if (resultsContainer) {
        resultsContainer.style.display = 'none';
        resultsContainer.classList.add('hidden');
      }
      const statusEl = document.getElementById('beniBulStatus');
      if (statusEl) statusEl.textContent = 'Aramak için okumaya başlayınız, bir ayet yazınız veya aşağıdaki örneklere tıklayınız.';
    }
  });

  clearInputBtn?.addEventListener('click', () => {
    if (beniBulInput) {
      beniBulInput.value = '';
      beniBulInput.focus();
    }
    clearInputBtn.style.display = 'none';
    const resultsContainer = document.getElementById('beniBulResultsContainer');
    if (resultsContainer) {
      resultsContainer.style.display = 'none';
      resultsContainer.classList.add('hidden');
    }
    const statusEl = document.getElementById('beniBulStatus');
    if (statusEl) statusEl.textContent = 'Arama temizlendi.';
  });

  document.getElementById('btnExecuteBeniBulSearch')?.addEventListener('click', () => {
    const val = beniBulInput?.value.trim();
    if (val) {
      executeBeniBulSearch(val);
    } else {
      const statusEl = document.getElementById('beniBulStatus');
      if (statusEl) statusEl.textContent = 'Lütfen aranacak sûre, âyet veya kelime yazınız.';
      beniBulInput?.focus();
    }
  });

  beniBulInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const val = e.target.value.trim();
      if (val) {
        executeBeniBulSearch(val);
      } else {
        const statusEl = document.getElementById('beniBulStatus');
        if (statusEl) statusEl.textContent = 'Lütfen aranacak sûre, âyet veya kelime yazınız.';
        beniBulInput?.focus();
      }
    }
  });

  // Hızlı Beni Bul Test Butonları
  document.querySelectorAll('.btn-quick-find').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.query;
      if (beniBulInput) {
        beniBulInput.value = q;
        if (clearInputBtn) clearInputBtn.style.display = 'block';
      }
      executeBeniBulSearch(q);
    });
  });

  // Çekmeceler (Hata Simülatörü ve Mikrofon Karnesi) açıldığında içeriği otomatik görünüre kaydır
  document.querySelectorAll('.mushaf-companion-sidebar details.sidebar-collapsible').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        setTimeout(() => {
          detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 80);
      }
    });
  });
}

// =========================================================
// BENİ BUL ENGINE (SESLE / METİNLE GELİŞMİŞ AYET ARAMA MOTORU)
// =========================================================

// Kesin sayfa numarasını önbellekten, bilinen tablolardan veya Al-Quran API'den tespit et
async function getExactPageForAyah(surahNo, ayahNo) {
  surahNo = parseInt(surahNo, 10) || 1;
  ayahNo = parseInt(ayahNo, 10) || 1;

  // 1. Önbellekteki yüklü sayfalarda bu ayet var mı kontrol et
  for (const p in PAGE_CACHE) {
    const page = PAGE_CACHE[p];
    if (page && page.ayahs && page.ayahs.some(a => a.surahNo === surahNo && a.ayahNo === ayahNo)) {
      return parseInt(p, 10);
    }
  }

  // 2. Meşhur veya özel ayetler için 0ms kesin dönüş
  if (surahNo === 1) return 1;
  if (surahNo === 2 && ayahNo <= 5) return 2;
  if (surahNo === 2 && ayahNo === 255) return 42;
  if (surahNo === 2 && ayahNo >= 283) return 50;
  if (surahNo >= 112) return 604;
  if (ayahNo === 1) return SURAH_START_PAGE[surahNo] || 1;

  // 3. API'den nokta atışı âyet sorgusu (Al-Quran Cloud hızlı tekil sorgu)
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNo}:${ayahNo}`);
    const json = await res.json();
    if (json.code === 200 && json.data && json.data.page) {
      return json.data.page;
    }
  } catch (_) {}

  // 4. Formülle tahmini sayfa (hızlı ve %99 yakın)
  return getEstimatedPageForAyah(surahNo, ayahNo);
}

// Belirtilen Sure ve Âyeti Mushaf Üzerinde Bul, Sayfayı Aç ve Âyeti Seçili Getir
async function locateAndSelectSurahAyah(surahNo, ayahNo) {
  if (typeof window.switchAppTab === 'function') {
    window.switchAppTab('tab-tilavet');
  }
  surahNo = parseInt(surahNo, 10) || 1;
  ayahNo = parseInt(ayahNo, 10) || 1;
  const sObj = SURAH_LIST.find(s => s.no === surahNo);
  if (sObj) {
    ayahNo = Math.max(1, Math.min(sObj.ayahs, ayahNo));
  }

  const statusEl = document.getElementById('beniBulStatus');
  if (statusEl) {
    statusEl.innerHTML = `<strong>${surahNo}. ${sObj ? sObj.name : 'Sure'} ${ayahNo}. Âyet</strong> bulunuyor ve Mushaf sayfası açılıyor...`;
  }

  // 1. Kesin sayfa numarasını tespit et
  const pageNo = await getExactPageForAyah(surahNo, ayahNo);

  // 2. Mushaf sayfasını ve seçili âyeti yükle (bulunan âyet seçili gelir)
  await loadMushafPage(pageNo, ayahNo, surahNo);

  // 3. Beni Bul penceresini kapat (böylece kullanıcı çalışma alanını doğrudan görsün)
  if (typeof closeBeniBulModal === 'function') {
    closeBeniBulModal();
  } else {
    const deck = document.getElementById('beniBulDeck');
    if (deck) {
      deck.style.display = 'none';
      deck.classList.add('hidden');
    }
  }

  // 4. Mushaf sayfasına ve seçili âyete odaklan
  setTimeout(() => {
    selectAyahOnPage(surahNo, ayahNo);
    const targetSpan = document.querySelector(`.page-ayah-span[data-surah="${surahNo}"][data-ayah="${ayahNo}"]`);
    if (targetSpan) {
      targetSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      document.getElementById('realMushafPage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);

  triggerLiveTajweedFeedback(` ${surahNo}. ${sObj ? sObj.name : ''} Suresi ${ayahNo}. Âyet seçildi ve ${pageNo}. Mushaf sayfasında açıldı.`, "SUCCESS");
}

let beniBulSpeechRec = null;
let isBeniBulListening = false;
let beniBulDebounceTimer = null;
let beniBulLang = 'tr-TR'; // Varsayılan: Türkçe Fonetik tanıma

function toggleBeniBulLanguage() {
  const btn = document.getElementById('btnToggleBeniBulLang');
  if (beniBulLang === 'tr-TR') {
    beniBulLang = 'ar-SA';
    if (btn) btn.innerHTML = ' Dil:  Arapça (Fusha)';
  } else {
    beniBulLang = 'tr-TR';
    if (btn) btn.innerHTML = ' Dil:  Türkçe (Fonetik)';
  }
  
  // Eğer dinleme aktifse yeni dille hemen yeniden başlat
  if (isBeniBulListening && beniBulSpeechRec) {
    try {
      beniBulSpeechRec.stop();
      beniBulSpeechRec.lang = beniBulLang;
      setTimeout(() => {
        try { beniBulSpeechRec.start(); } catch(e) {}
      }, 200);
    } catch(e) {}
  }
}

function toggleBeniBulListening() {
  const btn = document.getElementById('btnStartBeniBulVoice');
  const statusEl = document.getElementById('beniBulStatus');
  
  if (isBeniBulListening) {
    isBeniBulListening = false;
    if (beniBulSpeechRec) {
      try { beniBulSpeechRec.stop(); } catch(e) {}
    }
    if (btn) {
      btn.innerHTML = ' Sesle Oku & Beni Bul';
      btn.classList.remove('recording');
    }
    if (statusEl) statusEl.textContent = 'Dinleme durduruldu. Sonuçları aşağıdan seçebilirsiniz.';
    return;
  }
  
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    alert('Tarayıcınız ses tanıma desteklemiyor. Lütfen aşağıdaki arama kutusuna okuduğunuz ayeti yazınız.');
    return;
  }
  
  beniBulSpeechRec = new SpeechRec();
  beniBulSpeechRec.lang = beniBulLang;
  beniBulSpeechRec.continuous = true;
  beniBulSpeechRec.interimResults = true;
  
  isBeniBulListening = true;
  if (btn) {
    btn.innerHTML = ' Dinlemeyi Durdur';
    btn.classList.add('recording');
  }
  const langLabel = beniBulLang === 'tr-TR' ? 'Türkçe Fonetik' : 'Arapça';
  if (statusEl) statusEl.textContent = ` Dinleniyor (${langLabel})... Lütfen okuyunuz; sonuçlar sarsıntısız listelenecektir...`;
  
  beniBulSpeechRec.onresult = (evt) => {
    let transcript = '';
    for (let i = evt.resultIndex; i < evt.results.length; i++) {
      transcript += evt.results[i][0].transcript;
    }
    const inputEl = document.getElementById('inputBeniBulText');
    const clearBtn = document.getElementById('btnClearBeniBulText');
    if (inputEl) inputEl.value = transcript;
    if (clearBtn) clearBtn.style.display = 'block';
    
    if (statusEl) statusEl.innerHTML = ` <em>"${transcript}"</em> dinleniyor...`;

    // Titreme ve hızlı kaymaları önlemek için bekleme (Debounce 750ms)
    if (beniBulDebounceTimer) clearTimeout(beniBulDebounceTimer);
    beniBulDebounceTimer = setTimeout(() => {
      executeBeniBulSearch(transcript.trim());
    }, 750);
  };
  
  beniBulSpeechRec.onerror = (e) => {
    console.warn('Beni Bul ses hatası:', e.error);
  };
  
  try {
    beniBulSpeechRec.start();
  } catch(e) {}
}

// 5 Katmanlı Çok Olasılıklı Hibrit Arama Algoritması
async function executeBeniBulSearch(queryText) {
  if (!queryText || queryText.trim().length < 2) return;
  const statusEl = document.getElementById('beniBulStatus');
  const resultsContainer = document.getElementById('beniBulResultsContainer');
  const clearBtn = document.getElementById('btnClearBeniBulText');
  
  if (clearBtn) clearBtn.style.display = 'block';
  if (statusEl) statusEl.innerHTML = `⚡ <em>"${queryText}"</em> taranıyor... Sonuçlar getiriliyor...`;
  
  const rawQuery = queryText.trim();
  const normQuery = normalizeSearchText(rawQuery);
  let foundList = [];
  
  // KATMAN 1: Sözdizim (Syntax) Ayrıştırma (Örn: "Sayfa 50", "112:1", "Bakara 255", "Sure 112", "36:82")
  const syntaxMatch = parseChapterAyahSyntax(rawQuery);
  if (syntaxMatch) {
    if (syntaxMatch.type === 'page_direct') {
      foundList.push({
        surahNo: 1,
        ayahNo: 1,
        page: syntaxMatch.page,
        surahName: `Mushaf ${syntaxMatch.page}. Sayfa`,
        desc: `${getJuzForPage(syntaxMatch.page)}. Cüz`,
        arabic: '',
        latin: `Sayfa ${syntaxMatch.page}`,
        turkishMeal: 'Bu sayfayı doğrudan Mushaf üzerinde açmak için tıklayınız.',
        matchType: 'page',
        badgeText: ' DOĞRUDAN SAYFA',
        score: 100
      });
    } else {
      const pNo = getEstimatedPageForAyah(syntaxMatch.surahNo, syntaxMatch.ayahNo);
      foundList.push({
        surahNo: syntaxMatch.surahNo,
        ayahNo: syntaxMatch.ayahNo,
        page: pNo,
        surahName: syntaxMatch.surahName,
        desc: `${syntaxMatch.ayahNo}. Âyet (Sayfa ${pNo})`,
        arabic: '',
        latin: '',
        turkishMeal: '',
        matchType: 'syntax',
        badgeText: ' DOĞRUDAN ÂYET KONUMU',
        score: 100
      });
    }
  }
  
  // KATMAN 2: 114 Sure Adı & Halk Adları İndeksi
  SURAH_LIST.forEach(s => {
    const sNorm = normalizeSearchText(s.name);
    const aliases = SURAH_ALIASES[s.no] || [];
    let bestScore = calculateFuzzyMatchScore(normQuery, sNorm);
    
    aliases.forEach(al => {
      const aScore = calculateFuzzyMatchScore(normQuery, al);
      if (aScore > bestScore) bestScore = aScore;
    });
    
    // Doğrudan veya yakın eşleşme
    if (bestScore >= 55 || sNorm.includes(normQuery) || normQuery.includes(sNorm)) {
      if (!foundList.some(item => item.surahNo === s.no && item.ayahNo === 1)) {
        const sPage = SURAH_START_PAGE[s.no] || 1;
        foundList.push({
          surahNo: s.no,
          ayahNo: 1,
          page: sPage,
          surahName: `${s.no}. ${s.name} Suresi`,
          desc: `Toplam ${s.ayahs} Âyet (${s.place}) - Sayfa ${sPage}`,
          arabic: s.arabic,
          latin: `${s.name} Suresi Başlangıcı`,
          turkishMeal: '',
          matchType: 'surah',
          badgeText: ` SURE BAŞLANGICI (%${Math.max(bestScore, 85)})`,
          score: Math.max(bestScore, 85)
        });
      }
    }
  });
  
  // KATMAN 3: Genişletilmiş Popüler Ayetler & Namaz Sureleri İndeksi
  const qNoSpace = normQuery.replace(/\s+/g, '');
  BENI_BUL_PRESETS.forEach(p => {
    const pNormQuery = normalizeSearchText(p.query);
    const pNormName = normalizeSearchText(p.name);
    const pNoSpace = pNormQuery.replace(/\s+/g, '');
    
    let score = Math.max(
      calculateFuzzyMatchScore(normQuery, pNormQuery),
      calculateFuzzyMatchScore(normQuery, pNormName)
    );
    
    // Boşluksuz (space-insensitive) birebir veya alt-dize eşleşmesi
    if (qNoSpace.length >= 4 && pNoSpace.includes(qNoSpace)) {
      score = Math.max(score, 96);
    } else if (qNoSpace.length >= 4 && qNoSpace.includes(pNoSpace)) {
      score = Math.max(score, 90);
    }

    // Kelime eşleşmesi kontrolü (alakasız benzerlikleri ele)
    const qWords = normQuery.split(' ').filter(w => w.length >= 3);
    const hasWordMatch = qWords.some(qw => pNormQuery.includes(qw));
    
    if (score >= 60 || (hasWordMatch && score >= 45) || pNormQuery.includes(normQuery) || (qNoSpace.length >= 6 && pNoSpace.includes(qNoSpace))) {
      const finalScore = Math.max(score, hasWordMatch ? 82 : 65);
      const presetObj = {
        surahNo: p.surahNo,
        ayahNo: p.ayahNo,
        page: p.page || getEstimatedPageForAyah(p.surahNo, p.ayahNo),
        surahName: p.name,
        desc: p.desc,
        arabic: p.ar,
        latin: p.lt,
        turkishMeal: p.tr || '',
        matchType: 'preset',
        badgeText: ` FONETİK ÂYET EŞLEŞMESİ (%${finalScore})`,
        score: finalScore + 10 // Âyet eşleşmelerine jenerik sure başlıklarının önünde net öncelik ver
      };

      const existingIdx = foundList.findIndex(item => item.surahNo === p.surahNo && item.ayahNo === p.ayahNo);
      if (existingIdx >= 0) {
        // Önceki kayıt genel sure başlığı ise, zengin ayet preset'i ile güncelle
        foundList[existingIdx] = presetObj;
      } else {
        foundList.push(presetObj);
      }
    }
  });
  
  // KATMAN 4: Yüklü Sure İçi Yerel Arama (Arapça, Latin veya Meal)
  if (TilavetState.surahData && TilavetState.surahData.ayahs) {
    TilavetState.surahData.ayahs.forEach(ay => {
      const arNorm = normalizeSearchText(ay.textUthmani);
      const ltNorm = normalizeSearchText(ay.latin);
      const trNorm = normalizeSearchText(ay.turkishMeal);
      
      let localScore = 0;
      let matchLabel = '';
      if (arNorm.includes(normQuery)) {
        localScore = 95;
        matchLabel = ' ARAPÇA METİN';
      } else if (trNorm.includes(normQuery)) {
        localScore = 90;
        matchLabel = ' TÜRKÇE DİYANET MEALİ';
      } else if (ltNorm.includes(normQuery)) {
        localScore = 85;
        matchLabel = ' FONETİK OKUNUŞ';
      }
      
      if (localScore > 0 && !foundList.some(item => item.surahNo === TilavetState.surahData.surahNo && item.ayahNo === ay.ayahNo)) {
        foundList.push({
          surahNo: TilavetState.surahData.surahNo,
          ayahNo: ay.ayahNo,
          surahName: `${TilavetState.surahData.name} Suresi`,
          desc: `${ay.ayahNo}. Âyet`,
          arabic: ay.textUthmani,
          latin: ay.latin,
          turkishMeal: ay.turkishMeal,
          matchType: 'loaded_surah',
          badgeText: matchLabel,
          score: localScore
        });
      }
    });
  }
  
  // Yerel anlık sonuçları puana göre sırala ve hemen göster
  foundList.sort((a, b) => b.score - a.score);
  renderBeniBulResults(foundList, queryText);
  
  // KATMAN 5: Çevrimiçi Al-Quran API Arama (Tüm 6,236 Ayet İçi Hibrit Tarama)
  if (rawQuery.length >= 2) {
    try {
      const isArabicQuery = /[\u0600-\u06FF]/.test(rawQuery);
      let matchEntries = [];
      let apiBadge = isArabicQuery ? " TÜM KUR'AN (ARAPÇA)" : " TÜM KUR'AN (DİYANET MEALİ)";

      if (isArabicQuery) {
        const cleanAr = stripArabicDiacritics(rawQuery);
        // 1. Önce harekli olmayan yalın Kur'an metninde ara (en yüksek ve net isabet)
        try {
          const primaryUrl = `https://api.alquran.cloud/v1/search/${encodeURIComponent(cleanAr || rawQuery)}/all/quran-simple-clean`;
          const res = await fetch(primaryUrl);
          const json = await res.json();
          if (json.code === 200 && json.data && json.data.matches && json.data.matches.length > 0) {
            matchEntries = json.data.matches;
          }
        } catch (_) {}

        // 2. Eğer tüm dizeyle eşleşme çıkmadıysa ve çok kelimeli bir arama yapılmışsa (örn: "إن كنتم تعلمون سيقولون لله")
        if (matchEntries.length === 0) {
          const words = cleanAr.split(/\s+/).filter(w => w.length >= 3);
          if (words.length >= 2) {
            // Son 2 kelimeyi dene (örn: "سيقولون لله")
            try {
              const phraseEnd = words.slice(-2).join(' ');
              const subRes = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(phraseEnd)}/all/quran-simple-clean`);
              const subJson = await subRes.json();
              if (subJson.code === 200 && subJson.data && subJson.data.matches) {
                matchEntries.push(...subJson.data.matches);
              }
            } catch (_) {}

            // İlk 2 kelimeyi dene (örn: "ان كنتم")
            if (matchEntries.length === 0) {
              try {
                const phraseStart = words.slice(0, 2).join(' ');
                const subRes2 = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(phraseStart)}/all/quran-simple-clean`);
                const subJson2 = await subRes2.json();
                if (subJson2.code === 200 && subJson2.data && subJson2.data.matches) {
                  matchEntries.push(...subJson2.data.matches);
                }
              } catch (_) {}
            }
          }
        }

        // 3. Hâlâ bulunamadıysa geniş Arapça arama servisini dene
        if (matchEntries.length === 0) {
          try {
            const broadUrl = `https://api.alquran.cloud/v1/search/${encodeURIComponent(rawQuery)}/all/ar`;
            const broadRes = await fetch(broadUrl);
            const broadJson = await broadRes.json();
            if (broadJson.code === 200 && broadJson.data && broadJson.data.matches) {
              matchEntries = broadJson.data.matches;
            }
          } catch (_) {}
        }
      } else {
        // Latin / Türkçe Giriş: Hem Latin Fonetik (tr.transliteration) hem Türkçe Diyanet Meali (tr.diyanet) Taraması
        const cleanLatin = normQuery;
        
        // 1. Önce doğrudan Latin Fonetik Çeviriyazı üzerinde ara (tr.transliteration)
        try {
          const translitUrl = `https://api.alquran.cloud/v1/search/${encodeURIComponent(cleanLatin)}/all/tr.transliteration`;
          const res = await fetch(translitUrl);
          const json = await res.json();
          if (json.code === 200 && json.data && json.data.matches && json.data.matches.length > 0) {
            matchEntries.push(...json.data.matches.map(m => ({ ...m, _matchKind: 'latin_translit' })));
          }
        } catch (_) {}

        // 2. Türkçe Diyanet meali üzerinde tara (tr.diyanet)
        try {
          const searchUrl = `https://api.alquran.cloud/v1/search/${encodeURIComponent(rawQuery)}/all/tr.diyanet`;
          const res = await fetch(searchUrl);
          const json = await res.json();
          if (json.code === 200 && json.data && json.data.matches && json.data.matches.length > 0) {
            matchEntries.push(...json.data.matches.map(m => ({ ...m, _matchKind: 'turkish_meal' })));
          }
        } catch (_) {}

        // 3. Çok kelimeli Latin arama ise (örn: "tebbet yeda ebileheb") alt kalıpları dene:
        if (matchEntries.length === 0) {
          const words = cleanLatin.split(/\s+/).filter(w => w.length >= 3);
          
          // A) "ebileheb" -> "ebi leheb", "kulhuvallahu" -> "kul huvallahu"
          let expandedQuery = cleanLatin
            .replace(/\bebileheb\b/g, 'ebi leheb')
            .replace(/\bkulhuvallahu\b/g, 'kul huvallahu')
            .replace(/\bamenerrasulu\b/g, 'amener rasulu')
            .replace(/\belemterekeyfe\b/g, 'elem tere keyfe');
            
          if (expandedQuery !== cleanLatin) {
            try {
              const expUrl = `https://api.alquran.cloud/v1/search/${encodeURIComponent(expandedQuery)}/all/tr.transliteration`;
              const expRes = await fetch(expUrl);
              const expJson = await expRes.json();
              if (expJson.code === 200 && expJson.data && expJson.data.matches) {
                matchEntries.push(...expJson.data.matches.map(m => ({ ...m, _matchKind: 'latin_translit' })));
              }
            } catch (_) {}
          }

          // B) İlk 2 kelimeyi dene (örn: "tebbet yeda")
          if (matchEntries.length === 0 && words.length >= 2) {
            try {
              const phraseStart = words.slice(0, 2).join(' ');
              const subRes = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(phraseStart)}/all/tr.transliteration`);
              const subJson = await subRes.json();
              if (subJson.code === 200 && subJson.data && subJson.data.matches) {
                matchEntries.push(...subJson.data.matches.map(m => ({ ...m, _matchKind: 'latin_translit' })));
              }
            } catch (_) {}
          }

          // C) İngilizce transliteration (en.transliteration)
          if (matchEntries.length === 0) {
            try {
              const enUrl = `https://api.alquran.cloud/v1/search/${encodeURIComponent(cleanLatin)}/all/en.transliteration`;
              const enRes = await fetch(enUrl);
              const enJson = await enRes.json();
              if (enJson.code === 200 && enJson.data && enJson.data.matches) {
                matchEntries.push(...enJson.data.matches.map(m => ({ ...m, _matchKind: 'latin_translit' })));
              }
            } catch (_) {}
          }
        }
      }

      if (matchEntries.length > 0) {
        let hasNew = false;
        matchEntries.slice(0, 8).forEach(m => {
          const sNo = m.surah.number;
          const aNo = m.numberInSurah;
          if (!foundList.some(item => item.surahNo === sNo && item.ayahNo === aNo)) {
            const sObj = SURAH_LIST.find(s => s.no === sNo);
            const pNo = m.page || getEstimatedPageForAyah(sNo, aNo);

            let arText = isArabicQuery ? m.text : '';
            let trMeal = (m._matchKind === 'turkish_meal') ? m.text : '';
            let ltText = (m._matchKind === 'latin_translit') ? m.text : '';
            let cardBadge = apiBadge;
            if (m._matchKind === 'latin_translit') cardBadge = " TÜM KUR'AN (LATİN FONETİK)";
            else if (m._matchKind === 'turkish_meal') cardBadge = " TÜM KUR'AN (DİYANET MEALİ)";

            if (arText && arText.length > 280) {
              arText = arText.slice(0, 260) + '...';
            }

            foundList.push({
              surahNo: sNo,
              ayahNo: aNo,
              page: pNo,
              surahName: sObj ? `${sNo}. ${sObj.name} Suresi` : (m.surah.englishName || `Sure ${sNo}`),
              desc: `${aNo}. Âyet • Sayfa ${pNo}`,
              arabic: arText,
              latin: ltText,
              turkishMeal: trMeal,
              matchType: 'online_api',
              badgeText: cardBadge,
              score: 75
            });
            hasNew = true;
          }
        });

        if (hasNew) {
          foundList.sort((a, b) => b.score - a.score);
          renderBeniBulResults(foundList, queryText);

          // Eşleşen ilk 4 ayetin hem Uthmani Arapçasını hem Diyanet Mealini arka planda asenkron zenginleştir
          enrichTopResults(foundList.slice(0, 4));
        }
      }
    } catch (e) {
      console.warn("Çevrimiçi Kur'an araması atlandı:", e);
    }
  }
}

// Arapça harekeleri ve tecvid işaretlerini temizleyerek yalın arama hazırlığı
function stripArabicDiacritics(text) {
  if (!text) return '';
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/[أإآء]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[\s\t\r\n]+/g, ' ')
    .trim();
}

// Çevrimiçi gelen sonuçları hem Uthmani Arapça metin hem Türkçe Diyanet meali ile zenginleştir
async function enrichTopResults(items) {
  if (!items || !items.length) return;
  for (const item of items) {
    if ((!item.turkishMeal || !item.arabic || item.arabic.length < 5 || item.arabic.endsWith('...')) && item.surahNo && item.ayahNo) {
      try {
        const url = `https://api.alquran.cloud/v1/ayah/${item.surahNo}:${item.ayahNo}/editions/quran-uthmani,tr.diyanet`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 2) {
          const arObj = json.data.find(d => d.edition.identifier === 'quran-uthmani') || json.data[0];
          const trObj = json.data.find(d => d.edition.identifier === 'tr.diyanet') || json.data[1];
          if (arObj && arObj.text) item.arabic = arObj.text;
          if (trObj && trObj.text) item.turkishMeal = trObj.text;
          if (arObj && arObj.page) item.page = arObj.page;
          updateResultCardInDOM(item);
        }
      } catch (_) {}
    }
  }
}

// DOM'daki arama kartını zenginleşen bilgilerle anında güncelle
function updateResultCardInDOM(item) {
  const listEl = document.getElementById('beniBulResultsList');
  if (!listEl) return;
  const card = listEl.querySelector(`.beni-bul-result-card[data-surah="${item.surahNo}"][data-ayah="${item.ayahNo}"]`);
  if (!card) return;

  if (item.page) {
    const pagePill = card.querySelector('.result-page-pill');
    if (pagePill) pagePill.textContent = ` Sayfa ${item.page} (${getJuzForPage(item.page)}. Cüz)`;
    const openBtn = card.querySelector('.btn-open-fullpage');
    if (openBtn) openBtn.dataset.page = item.page;
  }

  let arEl = card.querySelector('.result-arabic-preview');
  if (item.arabic) {
    if (!arEl) {
      arEl = document.createElement('div');
      arEl.className = 'result-arabic-preview';
      const mealEl = card.querySelector('.result-meal');
      if (mealEl) card.insertBefore(arEl, mealEl);
      else card.appendChild(arEl);
    }
    arEl.textContent = item.arabic;
  }

  let mealEl = card.querySelector('.result-meal');
  if (item.turkishMeal) {
    if (!mealEl) {
      mealEl = document.createElement('div');
      mealEl.className = 'result-meal';
      card.appendChild(mealEl);
    }
    mealEl.innerHTML = `<strong> Diyanet Meali:</strong> ${item.turkishMeal}`;
  }
}

// Bulunan sonuçları derli toplu, sakin ve bilgilendirici kartlar halinde listele
function renderBeniBulResults(results, queryText) {
  const statusEl = document.getElementById('beniBulStatus');
  const resultsContainer = document.getElementById('beniBulResultsContainer');
  const listEl = document.getElementById('beniBulResultsList');
  
  if (!resultsContainer || !listEl) return;
  
  // Container görünürlüğünü kesinleştir: hem sınıfı kaldır hem inline display ayarla
  resultsContainer.classList.remove('hidden');
  resultsContainer.style.display = 'block';
  listEl.innerHTML = '';
  
  if (results.length === 0) {
    if (statusEl) statusEl.innerHTML = `❌ <em>"${queryText}"</em> için herhangi bir eşleşme bulunamadı. Lütfen farklı bir kelime, sure adı (Örn: "İhlas") veya ayet no (Örn: "2:255") deneyiniz.`;
    listEl.innerHTML = '<div style="color: var(--text-muted); font-size: 0.82rem; padding: 14px; text-align: center; border: 1px dashed rgba(255,255,255,0.1); border-radius: 8px;">Sonuç bulunamadı. Lütfen sesinizi netleştiriniz veya farklı bir kelime deneyiniz.</div>';
    return;
  }
  
  if (statusEl) statusEl.innerHTML = ` <strong>${results.length} Eşleşme Bulundu!</strong> Sayfayı kaydırmadan inceleyebilir, dinleyebilir veya tam sayfa açabilirsiniz:`;
  
  results.forEach(res => {
    const card = document.createElement('div');
    card.className = 'beni-bul-result-card';
    card.dataset.surah = res.surahNo;
    card.dataset.ayah = res.ayahNo;
    
    const pageNo = res.page || getEstimatedPageForAyah(res.surahNo, res.ayahNo);
    const juzNo = getJuzForPage(pageNo);
    const badgeText = res.badgeText || ` ${res.surahName} ${res.ayahNo ? `(${res.ayahNo}. Âyet)` : ''}`;
    
    card.innerHTML = `
      <div class="result-card-header">
        <div class="result-badge-group">
          <span class="result-badge">${badgeText}</span>
          <span class="result-page-pill"> Sayfa ${pageNo} (${juzNo}. Cüz)</span>
        </div>
        <div class="result-actions">
          <button type="button" class="btn btn-outline btn-sm btn-quick-listen" data-surah="${res.surahNo}" data-ayah="${res.ayahNo}" title="Kârî tilâvetini dinle">
            ▶ Dinle
          </button>
          <button type="button" class="btn btn-gold btn-sm btn-open-fullpage" data-surah="${res.surahNo}" data-ayah="${res.ayahNo}" data-page="${pageNo}" title="Mushaf sayfasında aç">
             Mushaf Sayfasına Git
          </button>
        </div>
      </div>
      ${res.arabic ? `<div class="result-arabic-preview">${res.arabic}</div>` : ''}
      ${res.turkishMeal ? `<div class="result-meal"><strong> Diyanet Meali:</strong> ${res.turkishMeal}</div>` : ''}
    `;
    listEl.appendChild(card);
  });
  
  // "Mushaf Sayfasına Git" buton dinleyicileri
  listEl.querySelectorAll('.btn-open-fullpage').forEach(b => {
    b.addEventListener('click', async (e) => {
      e.stopPropagation();
      const sNo = parseInt(b.dataset.surah, 10);
      const aNo = parseInt(b.dataset.ayah, 10);
      const pNo = parseInt(b.dataset.page, 10) || await getExactPageForAyah(sNo, aNo);
      
      // Önce Mushaf sayfasını ve hedef ayeti yükle (bulunan ayet seçili gelsin)
      await loadMushafPage(pNo, aNo, sNo);
      
      // Beni Bul penceresini otomatik kapat (böylece kullanıcı Mushaf sayfasını netçe görsün)
      if (typeof closeBeniBulModal === 'function') {
        closeBeniBulModal();
      } else {
        const deck = document.getElementById('beniBulDeck');
        if (deck) {
          deck.style.display = 'none';
          deck.classList.add('hidden');
        }
      }
      
      // Mushaf sayfasına ve seçili âyete odaklan
      setTimeout(() => {
        selectAyahOnPage(sNo, aNo);
        const targetSpan = document.querySelector(`.page-ayah-span[data-surah="${sNo}"][data-ayah="${aNo}"]`);
        if (targetSpan) {
          targetSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          document.getElementById('realMushafPage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      triggerLiveTajweedFeedback(` ${sNo}. Sure ${aNo}. Âyet seçildi ve ${pNo}. Mushaf sayfasında açıldı.`, "SUCCESS");
    });
  });

  // Hızlı Dinle dinleyicileri
  listEl.querySelectorAll('.btn-quick-listen').forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const sNo = parseInt(b.dataset.surah, 10);
      const aNo = parseInt(b.dataset.ayah, 10);
      
      playQariRecitation(sNo, aNo);
      triggerLiveTajweedFeedback(`▶ ${sNo}. Sure ${aNo}. Âyet tilâveti başlatıldı.`, "INFO");
    });
  });
}

// =========================================================
// MUSHAF ARAÇ ÇUBUĞU VE GEZİNTİ DİNLEYİCİLERİ
// =========================================================
function setupMushafToolbarListeners() {
  // 1. Önceki Sayfa Butonu
  document.getElementById('btnPrevPage')?.addEventListener('click', () => {
    if (TilavetState.currentPage > 1) {
      loadMushafPage(TilavetState.currentPage - 1);
    }
  });

  // 2. Sonraki Sayfa Butonu
  document.getElementById('btnNextPage')?.addEventListener('click', () => {
    if (TilavetState.currentPage < 604) {
      loadMushafPage(TilavetState.currentPage + 1);
    }
  });

  // 3. Sayfa Numarasına Git Butonu ve Enter Tuşu
  const pageInput = document.getElementById('inputPageNum');
  document.getElementById('btnGoToPage')?.addEventListener('click', () => {
    if (pageInput) {
      const p = parseInt(pageInput.value, 10);
      if (p >= 1 && p <= 604) loadMushafPage(p);
    }
  });

  pageInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const p = parseInt(pageInput.value, 10);
      if (p >= 1 && p <= 604) loadMushafPage(p);
    }
  });

  // 4. Hızlı Meşhur Sayfa Butonları
  document.querySelectorAll('.btn-page-shortcut').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = parseInt(btn.dataset.page, 10);
      if (p) {
        loadMushafPage(p);
        document.getElementById('realMushafPage')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 5. Seçili Âyeti Dinle
  document.getElementById('btnPlayActiveAyah')?.addEventListener('click', playActiveAyahAudio);

  // 6. Tüm Sayfayı Oynat
  document.getElementById('btnPlayCurrentPage')?.addEventListener('click', playCurrentPageAudio);

  // 6.5. Âyet / Sayfa Akış Tercihi Butonu (Kesintisiz Akış vs Sabit Kal)
  const flowToggleBtn = document.getElementById('btnTogglePlaybackFlow');
  if (flowToggleBtn) {
    flowToggleBtn.addEventListener('click', () => {
      if (typeof TilavetAudioManager !== 'undefined') {
        TilavetAudioManager.toggleFlowMode();
      }
    });
  }
  if (typeof TilavetAudioManager !== 'undefined') {
    TilavetAudioManager.updateFlowUI();
  }

  // 7. Tilavet Kârisi Seçici (Dossary / Katami / Afasy)
  const reciterSelect = document.getElementById('selectReciter');
  if (reciterSelect) {
    const savedRec = localStorage.getItem('cymatique_preferred_reciter');
    if (savedRec && RECITERS[savedRec]) {
      activeReciterId = savedRec;
    }
    reciterSelect.value = activeReciterId;

    const updateReciterBadge = (id) => {
      const badgeEl = document.getElementById('activeReciterBadge');
      if (badgeEl) {
        const r = RECITERS[id] || RECITERS.dossary;
        badgeEl.textContent = r.title || r.name;
      }
    };
    updateReciterBadge(activeReciterId);

    reciterSelect.addEventListener('change', () => {
      activeReciterId = reciterSelect.value;
      TilavetState.reciter = activeReciterId;
      try {
        localStorage.setItem('cymatique_preferred_reciter', activeReciterId);
      } catch(_) {}
      const rec = RECITERS[activeReciterId] || RECITERS.dossary;
      
      updateReciterBadge(activeReciterId);
      updateMasterPlayButtonUI(TilavetState.isPlayingReference);

      // Eğer şu anda bir ayet çalıyorsa, yeni kâri ile kaldığı yerden devam et
      if (TilavetState.isPlayingReference && !isPlayingPage) {
        playQariRecitation(TilavetState.currentSurah, TilavetState.currentAyah);
      }

      triggerLiveTajweedFeedback(`Kâri seçildi: ${rec.name}`, "INFO");
      if (typeof showToast === 'function') {
        showToast(` Okuyucu: ${rec.name}`, 2500);
      }
    });
  }

  // 8. Seçili Âyetin Derinlemesine İncelemesine Git (Esbâb-ı Nüzûl & Tefsir)
  document.getElementById('btnGoToAyahInceleme')?.addEventListener('click', (e) => {
    e.preventDefault();
    const s = TilavetState.currentSurah || 2;
    const a = TilavetState.currentAyah || 285;
    if (typeof window.switchAppTab === 'function') {
      window.switchAppTab('tab-inceleme');
      if (typeof window.loadAndRenderAyahInceleme === 'function') {
        window.loadAndRenderAyahInceleme(s, a);
      }
    } else {
      window.location.href = `inceleme.html?surah=${s}&ayah=${a}`;
    }
  });

  // 8. Klavye Kısayolları (Boşluk: Oynat/Durdur | Ok Tuşları: Sayfa Çevirme)
  window.addEventListener('keydown', (e) => {
    // KORUMA 1: Yalnızca Mushaf (Tilavet) sekmesi aktifse çalış; Akademi veya İnceleme'de devreden çık
    const appShell = document.querySelector('.app-shell');
    const isTilavetActive = appShell
      ? appShell.dataset.activeTab === 'tab-tilavet'
      : (document.getElementById('tab-tilavet')?.classList.contains('active') && !document.getElementById('tab-inceleme')?.classList.contains('active') && !document.getElementById('tab-akademi')?.classList.contains('active'));

    if (!isTilavetActive) {
      return;
    }

    // KORUMA 2: Komut paleti (Beni Bul) açıksa genel kısayolları durdur
    const beniBulDeck = document.getElementById('beniBulDeck');
    if (beniBulDeck && beniBulDeck.style.display !== 'none' && !beniBulDeck.classList.contains('hidden')) {
      return;
    }

    // KORUMA 3: Odaklanmış buton, link, form, summary veya rolü olan hiçbir elemanın native tuşunu gaspetme
    const activeEl = document.activeElement;
    if (activeEl && activeEl !== document.body && activeEl !== document.documentElement) {
      const tag = activeEl.tagName.toLowerCase();
      const role = activeEl.getAttribute('role');
      if (
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        tag === 'button' ||
        tag === 'summary' ||
        tag === 'a' ||
        role === 'button' ||
        role === 'tab' ||
        role === 'slider' ||
        role === 'searchbox' ||
        activeEl.isContentEditable
      ) {
        return;
      }
    }

    // BOŞLUK (SPACEBAR) TUŞU: Âyeti Oynat / Durdur
    if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
      e.preventDefault(); // Sayfanın aşağı kaymasını engelle
      playActiveAyahAudio(); // Çalıyorsa anında durdurur, duruyorsa aktif ayeti başlatır
      return;
    }

    // SAYFA ÇEVİRME: Sol (Önceki Sayfa) - Sağ (Sonraki Sayfa)
    if (e.key === 'ArrowRight') {
      if (TilavetState.currentPage < 604) {
        e.preventDefault();
        loadMushafPage(TilavetState.currentPage + 1);
      }
    } else if (e.key === 'ArrowLeft') {
      if (TilavetState.currentPage > 1) {
        e.preventDefault();
        loadMushafPage(TilavetState.currentPage - 1);
      }
    }
  });
}

// Global nesneleri pencereye (window) bağla
window.TilavetState = TilavetState;
window.loadMushafPage = loadMushafPage;
window.SURAH_START_PAGE = SURAH_START_PAGE;
window.stopAllAudioPlayback = stopAllAudioPlayback;
window.stopActiveAyahAudio = stopAllAudioPlayback;
window.locateAndSelectSurahAyah = locateAndSelectSurahAyah;
window.updateBeniBulAyahInputBounds = updateBeniBulAyahInputBounds;

// Sayfa yüklendiğinde başlat
window.addEventListener('DOMContentLoaded', () => {
  initTilavetEngine();
});

// =====================================================================
// BÖLÜM 9: TASARIMCI UI YARDIMCI FONKSİYONLARI (v2 Obsidyen)
// =====================================================================

/* 1) Toast bildirimi */
function showToast(msg, ms = 2200) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), ms);
}
window.showToast = showToast;

/* 2) Master oynat butonu durumu */
function setMasterPlayState(isPlaying) {
  const b = document.getElementById('btnPlayActiveAyah');
  if (!b) return;
  b.classList.toggle('is-playing', isPlaying);
  const icon = b.querySelector('.master-play-icon');
  const mainText = b.querySelector('.master-play-main-text');
  if (icon) icon.textContent = isPlaying ? '⏸' : '▶';
  if (mainText) mainText.textContent = isPlaying ? 'Durdur' : 'Âyeti Dinle';
}
window.setMasterPlayState = setMasterPlayState;

/* 3) Mushaf sayfa değişiminde kâğıt animasyonu + kısayol vurgusu */
function onMushafPageChanged(page) {
  const f = document.getElementById('realMushafPage');
  if (f) {
    f.classList.remove('page-turn');
    void f.offsetWidth;
    f.classList.add('page-turn');
  }
  document.querySelectorAll('.btn-page-shortcut')
    .forEach(b => b.classList.toggle('active', +b.dataset.page === page));
}
window.onMushafPageChanged = onMushafPageChanged;

/* 4) Çalan ayeti ekranda ortala */
function scrollPlayingAyahIntoView() {
  const el = document.querySelector('.page-ayah-playing');
  if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
window.scrollPlayingAyahIntoView = scrollPlayingAyahIntoView;
