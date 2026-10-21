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
    userRole: 'student', // 'student', 'teacher', 'expert_reviewer'
    completedLessons: [],
    completedQuizzes: {},
    certificates: [],
    savedRecordings: [],
    cloudConsent: false,
    childMode: false,
    fontSizeScale: 1.0,
    voiceTransferMode: 'p2p', // 'p2p' (WebRTC Canlı P2P) | 'ttl24h' (Uçtan uca şifreli 24h TTL)
    voiceConsent24h: false
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
      const [mRes, lRes, sRes, rRes, qRes] = await Promise.all([
        fetch('data/tilavet/makamlar.json?v=20261020_2020').then(r => r.json()).catch(() => null),
        fetch('data/tilavet/lessons.json').then(r => r.json()).catch(() => null),
        fetch('data/tilavet/sozluk.json').then(r => r.json()).catch(() => null),
        fetch('data/tilavet/reciters.json').then(r => r.json()).catch(() => null),
        fetch('data/tilavet/qiraat.json').then(r => r.json()).catch(() => null)
      ]);

      if (mRes) {
        const researchedMakams = Array.isArray(mRes.makamlar) ? mRes.makamlar : Array.isArray(mRes) ? mRes : [];
        if (researchedMakams.length) MAKAMLAR = mergeMakamCatalog(researchedMakams);
      }
      if (lRes && Array.isArray(lRes) && lRes.length) LESSONS = lRes;
      if (sRes && Array.isArray(sRes) && sRes.length) SOZLUK = sRes;
      if (rRes && Array.isArray(rRes) && rRes.length) RECITERS = rRes;
      if (qRes && qRes.imams) QIRAAT = qRes;
    } catch (e) {
      console.info("[Akademi] Harici JSON fetch atlandı, dahili kapsamlı veri seti kullanılıyor.");
    }
  }

  // 4. ALT GÖRÜNÜM GEÇİŞİ (SUB-VIEW ROUTER)
  const AKADEMI_MODULE_META = {
    yolculuk: { title: "Yolculuğum", icon: "", subTitle: "Müfredat & İlerleme" },
    elifba: { title: "Sıfırdan Kur'an (Elifba)", icon: "", subTitle: "28 Harf & Mahreç" },
    tecvid: { title: "Tecvid Okulu", icon: "", subTitle: "20 Kural & Renkli Mushaf" },
    teknik: { title: "Tilavet Teknikleri", icon: "⚡", subTitle: "Tempolar, Secavend & Lahn" },
    makam: { title: "Makam Okulu", icon: "", subTitle: "10 Makam • Dinleme ve Geçki" },
    san: { title: "Şan & Ses Eğitimi", icon: "", subTitle: "Diyafram & Rezonans" },
    studyo: { title: "Ses Laboratuvarı", icon: "", subTitle: "53-Koma Tuner & DSP" },
    dinleme: { title: "Dinleme Salonu", icon: "", subTitle: "114 Sûre Master & Ekoller" },
    qiraat: { title: "Kıraat & Rivayet", icon: "", subTitle: "10 İmam & Rivayetler" },
    asistan: { title: "Tilavet Asistanı", icon: "", subTitle: "Yapay Zekâ Danışmanı" },
    sozluk: { title: "Terimler Sözlüğü", icon: "", subTitle: "Kavramlar Istılahı" },
    ayarlar: { title: "Ayarlar & Gizlilik", icon: "⚙", subTitle: "Akort & Tercihler" }
  };

  const MODULE_ORDER = [
    'yolculuk', 'elifba', 'tecvid', 'teknik', 'makam',
    'san', 'studyo', 'dinleme', 'qiraat', 'asistan',
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
    if (viewId === 'sinav' || viewId === 'hoca') {
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
    const miniWidget = document.getElementById('miniMushafWidget');
    const miniPill = document.getElementById('miniMushafPill');
    if (viewId !== 'tecvid' && viewId !== 'teknik') {
      if (miniWidget) miniWidget.style.display = 'none';
      if (miniPill) miniPill.style.display = 'none';
    }

    switch (viewId) {
      case 'yolculuk': renderYolculukView(); break;
      case 'elifba': renderElifbaView(); break;
      case 'tecvid': renderTecvidView(); break;
      case 'teknik': renderTeknikView(); break;
      case 'makam': renderMakamView(); break;
      case 'san': renderSanView(); break;
      case 'studyo': renderStudyoView(); break;
      case 'dinleme': renderDinlemeView(); break;
      case 'qiraat': renderQiraatView(); break;
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
                <h3 style="margin-top:0.35rem; color:#f0f3fa;">Soru ${currentQ + 1} / ${questions.length}</h3>
              </div>
              <button class="modal-close-btn" id="btnClosePlacement">&times;</button>
            </div>
            <div class="modal-body">
              <h4 style="font-size:1.15rem; color:#e5b869; margin-bottom:1.25rem;">${qData.q}</h4>
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
            <h2 style="color:#f0f3fa; margin:0.75rem 0;">Tavsiye Edilen Başlangıç Noktanız</h2>
            <div style="font-size:1.4rem; font-weight:800; color:#e5b869; margin:1rem 0; padding:1.25rem; background:rgba(229,184,105,0.1); border:1px solid #e5b869; border-radius:12px;">
              ${levelTitle}
            </div>
            <p style="color:#8a94a6; font-size:0.95rem; line-height:1.5;">
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
          saveState();
          overlay.remove();
          renderYolculukView();
          switchAkademiSubView(recommendedLevel <= 1 ? 'elifba' : (recommendedLevel === 2 ? 'elifba' : (recommendedLevel <= 4 ? 'tecvid' : 'makam')));
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
          <div style="background:rgba(255,255,255,0.03); padding:1.25rem; border-radius:10px; margin-bottom:1rem;">
            <h4 style="color:#e5b869; margin-bottom:0.5rem;">Dersin Kazanımları:</h4>
            <ul style="color:#f0f3fa; padding-left:1.25rem; line-height:1.6;">
              ${(lesson.objectives || []).map(o => `<li>${o}</li>`).join('')}
            </ul>
          </div>
          <p style="color:#8a94a6; line-height:1.6;">
            ${lesson.sections?.find(s => s.type === 'intro')?.text || 'Bu derste tilavet kaidelerini adım adım inceleyeceğiz.'}
          </p>
        `;
      } else if (currentStep === 1) {
        const exp = lesson.sections?.find(s => s.type === 'explain')?.text || 'Kıraat kuralları ve mahreç incelikleri:';
        stepContentHtml = `
          <div style="background:rgba(0,0,0,0.4); padding:1.25rem; border-radius:10px; border-left:4px solid var(--accent-gold); white-space:pre-line; color:#f0f3fa; line-height:1.6;">
            ${exp}
          </div>
        `;
      } else if (currentStep === 2) {
        const exSec = lesson.sections?.find(s => s.type === 'examples');
        const exampleItems = exSec?.items || [
          { phrase: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", rule: "Örnek Tilavet", audioAyah: { surah: 1, ayah: 1 } }
        ];
        stepContentHtml = `
          <p style="color:#8a94a6;">Aşağıdaki örnekleri dikkatle dinleyin ve sesin mahrecine odaklanın:</p>
          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-top:1rem;">
            ${exampleItems.map((it, i) => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.04); padding:1rem; border-radius:8px;">
                <div>
                  <div style="font-family:'Amiri', serif; font-size:1.6rem; color:#e5b869;" dir="rtl">${it.phrase || it.char || ''}</div>
                  <div style="font-size:0.85rem; color:#8a94a6;">${it.rule || it.sound || ''}</div>
                </div>
                <button type="button" class="btn-akademi-primary btn-play-sample-step" data-idx="${i}"><span>▶</span> Dinle</button>
              </div>
            `).join('')}
          </div>
        `;
      } else if (currentStep === 3) {
        stepContentHtml = `
          <div style="text-align:center; padding:1.5rem 0;">
            <p style="color:#f0f3fa; font-size:1.1rem; margin-bottom:1.25rem;">Şimdi duyduğunuz örneği mikrofona okuyun ve kendi sesinizi dinleyin:</p>
            <button class="btn-akademi-primary" id="btnRecordStep" style="padding:1rem 2rem; font-size:1.1rem;">
              <span></span> Kaydı Başlat
            </button>
            <div id="stepRecordStatus" style="margin-top:1rem; color:#8a94a6;">Kayda hazır...</div>
          </div>
        `;
      } else if (currentStep === 4) {
        stepContentHtml = `
          <div style="background:rgba(255,255,255,0.03); padding:1.25rem; border-radius:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <span class="card-badge gold" style="font-size:0.75rem;">PEKİŞTİRME SORUSU</span>
              <span style="font-size:0.75rem; color:#8a94a6;">Ders Sonu Değerlendirmesi</span>
            </div>
            <h4 style="color:#f0f3fa; font-size:1.05rem; margin-bottom:1rem; line-height:1.5;">${currentQuiz.question}</h4>
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
            <h3 style="color:#e5b869; font-size:1.5rem;">Ders Başarıyla Tamamlandı!</h3>
            <p style="color:#8a94a6; margin:0.75rem 0 1.5rem 0;">
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
              <span class="card-badge gold">${lesson.id}</span>
              <h3 style="margin-top:0.35rem; color:#f0f3fa;">${lesson.title?.tr || 'Ders'}</h3>
            </div>
            <button class="modal-close-btn" id="btnCloseLesson">&times;</button>
          </div>

          <div class="modal-step-dots">
            ${steps.map((st, idx) => `
              <div class="step-dot ${idx === currentStep ? 'active' : (idx < currentStep ? 'completed' : '')}" title="${st.name}"></div>
            `).join('')}
          </div>

          <div class="modal-body">
            <h4 style="color:var(--accent-cyan); margin-bottom:0.75rem;">Adım ${currentStep + 1}: ${stepMeta.name}</h4>
            ${stepContentHtml}
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:1.5rem; border-top:1px solid rgba(255,255,255,0.08); padding-top:1rem;">
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
        state.todayMinutes += 15;
        saveState();
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
  function renderYolculukView() {
    const container = document.getElementById('akademi-view-yolculuk');
    if (!container) return;

    const completedCount = state.completedLessons.length;
    const progressPercent = Math.min(100, Math.round((state.todayMinutes / state.dailyGoalMinutes) * 100));

    container.innerHTML = `
      <div class="akademi-dashboard-grid">
        <!-- Günün Hedefi Kartı -->
        <div class="akademi-card daily-goal-card">
          <div class="card-headline">
            <div>
              <span class="card-badge gold">BUGÜNÜN HEDEFİ</span>
              <h2 class="card-title">Günlük Tilavet Disiplini</h2>
            </div>
            <div class="streak-badge" title="Muntazam Pratik Serisi">
              <span class="streak-fire"></span>
              <span class="streak-count">${state.streak} Gün Seri</span>
            </div>
          </div>

          <div class="goal-progress-wrap">
            <div class="goal-circular-meter">
              <svg viewBox="0 0 100 100" class="circular-svg">
                <circle class="circle-bg" cx="50" cy="50" r="42" />
                <circle class="circle-progress" cx="50" cy="50" r="42" style="stroke-dashoffset: ${264 - (264 * progressPercent) / 100};" />
              </svg>
              <div class="meter-text">
                <span class="meter-num">${state.todayMinutes}</span>
                <span class="meter-sub">/ ${state.dailyGoalMinutes} dk</span>
              </div>
            </div>
            <div class="goal-text-info">
              <p class="goal-desc">Günde sadece 15 dakika ile mahreç, tecvid ve makam bilginizi daimi kılın.</p>
              <div class="goal-actions">
                <button type="button" class="btn-akademi-primary" id="btnContinueJourney">
                  <span>▶</span> Derslere Devam Et (Seviye ${state.currentLevel})
                </button>
                <button type="button" class="btn-akademi-secondary" id="btnOpenPlacementTest">
                  <span></span> Seviye Tespit Testi
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Öğrenme Yolu (Harita) -->
        <div class="akademi-card roadmap-card">
          <div class="card-headline">
            <span class="card-badge cyan">MÜFREDAT HARİTASI</span>
            <h3 class="card-title">A'dan Z'ye Tilavet Seviyeleri</h3>
          </div>
          <div class="level-nodes-strip">
            ${[0, 1, 2, 3, 4, 5].map(lvl => {
              const isPassed = state.currentLevel > lvl;
              const isCurrent = state.currentLevel === lvl;
              const titles = ["Hazırlık", "Elif-Ba & Mahreç", "Harekeler & Kıraat", "Tecvid Temelleri", "Tilavet Teknikleri", "Makam & Ses Sanatı"];
              return `
                <div class="level-node ${isPassed ? 'completed' : (isCurrent ? 'active' : 'locked')}" data-level="${lvl}">
                  <div class="node-icon">${isPassed ? '✓' : (lvl + 1)}</div>
                  <div class="node-meta">
                    <span class="node-level">SEVİYE ${lvl}</span>
                    <span class="node-title">${titles[lvl]}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Önerilen 3 Pratik -->
        <div class="akademi-card rec-card">
          <div class="card-headline">
            <span class="card-badge green">GÜNÜN TAVSİYELERİ</span>
            <h3 class="card-title">Bugün İçin Önerilen 3 Çalışma</h3>
          </div>
          <div class="rec-list-grid">
            <div class="rec-item-card" data-action="goto-elifba">
              <span class="rec-ico"></span>
              <div class="rec-text">
                <div class="rec-h">Benzer Harf Egzersizi</div>
                <div class="rec-sub">Peltek Harfler (ث vs س vs ص)</div>
              </div>
              <button class="btn-sm-action">Başla</button>
            </div>
            <div class="rec-item-card" data-action="goto-makam">
              <span class="rec-ico"></span>
              <div class="rec-text">
                <div class="rec-h">Rast Makamı Dizi Talimi</div>
                <div class="rec-sub">Drone Eşliğinde Dizi Tekrarı</div>
              </div>
              <button class="btn-sm-action">Başla</button>
            </div>
            <div class="rec-item-card" data-action="goto-san">
              <span class="rec-ico"></span>
              <div class="rec-text">
                <div class="rec-h">Nefes Gücü &amp; Ses Atölyesi</div>
                <div class="rec-sub">Güvenli nefes ve ses eşgüdümü rehberi</div>
              </div>
              <button class="btn-sm-action">Başla</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Buton dinleyicileri
    document.getElementById('btnContinueJourney')?.addEventListener('click', () => {
      const uncompletedInLevel = LESSONS.filter(l => l.level === state.currentLevel && !state.completedLessons.includes(l.id));
      const nextLesson = uncompletedInLevel[0] || LESSONS.find(l => l.level === state.currentLevel) || LESSONS[0];
      openLessonModal(nextLesson ? nextLesson.id : 'L0-1-giris-ve-adab');
    });

    document.getElementById('btnOpenPlacementTest')?.addEventListener('click', () => {
      openPlacementTestModal();
    });

    // Seviye haritası tıklama dinleyicileri
    container.querySelectorAll('.level-node').forEach(node => {
      node.style.cursor = 'pointer';
      node.addEventListener('click', () => {
        const lvl = parseInt(node.getAttribute('data-level'), 10);
        if (lvl === 0) {
          openLessonModal('L0-1-giris-ve-adab');
        } else if (lvl === 1 || lvl === 2) {
          switchAkademiSubView('elifba');
        } else if (lvl === 3) {
          switchAkademiSubView('tecvid');
        } else if (lvl === 4) {
          switchAkademiSubView('teknik');
        } else if (lvl === 5) {
          switchAkademiSubView('makam');
        }
      });
    });

    container.querySelectorAll('.rec-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const action = card.getAttribute('data-action');
        if (action === 'goto-elifba') switchAkademiSubView('elifba');
        else if (action === 'goto-makam') switchAkademiSubView('makam');
        else if (action === 'goto-san') switchAkademiSubView('san');
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

      tabBodyHtml = `
        <div class="elifba-harfler-split">
          <!-- Sol Kolon: 28 Harf Izgarası -->
          <div class="akademi-card">
            <div class="card-headline">
              <div>
                <span class="card-badge gold">SEVİYE 1 · 28 HARF</span>
                <h2 class="card-title">Arap Alfabesi &amp; İnteraktif Mahreç Atlası</h2>
                <p class="card-desc">Harflere dokunarak mahrecini, ses bölgesini, 4 farklı yazılış formunu ve ses karşılığını inceleyin.</p>
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
                    <span class="ar-type-tag ${item.type}">${item.type}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Sağ Kolon: Seçili Harf Tahlil Paneli -->
          <div class="akademi-card letter-detail-panel" id="letterDetailPanel">
            <div class="detail-header">
              <div class="detail-large-glyph" id="detailGlyph" lang="ar">${selectedItem.char}</div>
              <div class="detail-names">
                <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                  <h3 class="detail-title" id="detailName" style="margin:0;">${selectedItem.name}</h3>
                  <span class="card-badge ${selectedItem.type === 'kalin' ? 'alert' : (selectedItem.type === 'bogaz' ? 'gold' : 'cyan')}">${selectedItem.type.toUpperCase()}</span>
                  ${selectedItem.nonConnector ? `<span class="card-badge" style="background:rgba(255,160,0,0.18); color:#ffa000; border:1px solid rgba(255,160,0,0.4);">Bitişmeyen 6 Harf</span>` : ''}
                </div>
                <div class="detail-sound" id="detailSound">Ses: <strong>${selectedItem.sound}</strong> · Örnek: <strong lang="ar" style="font-family:'Amiri', serif; font-size:1.3rem; color:var(--accent-gold);">${selectedItem.example || ''}</strong></div>
              </div>
              <button type="button" class="btn-play-letter-sound" id="btnPlayLetterAudio" title="Bu harf için doğrulanmış ses kaydı yok">
                <span></span> Ses kaydı yok
              </button>
            </div>

            <!-- 4 Yazılış Formu -->
            <div class="forms-showcase-box">
              <div class="forms-showcase-title">
                <span>4 Yazılış Biçimi</span>
                <span style="font-size:0.68rem; color:#8a94a6; font-weight:500;">Sağdan Sola Yazım Sırası</span>
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

            <!-- Mahreç Açıklaması -->
            <div class="mahrec-box">
              <div class="mahrec-title"> Mahreç (Ses Çıkış Noktası &amp; Fonetik İlke):</div>
              <p class="mahrec-desc" id="detailMahrec">${selectedItem.mahrec}</p>
            </div>

            <!-- İnteraktif Fonetik Vokal Atlası -->
            <div class="vocal-tract-atlas">
              <div class="vocal-atlas-header">
                <span class="vocal-atlas-title"> 5 Ana Mahreç Bölgesi (Mahâric-i Âmme)</span>
                <span class="card-badge gold" style="font-size:0.68rem;">ANATOMİK ATLAS</span>
              </div>
              <div class="vocal-zones-layout">
                <div class="vocal-zone-item ${selectedItem.zone === 'haysum' ? 'active' : ''}">
                  <span class="zone-name"> Hayşûm (Geniz / Burun Boşluğu)</span>
                  <span class="zone-letters">Gunne (Mîm, Nûn)</span>
                </div>
                <div class="vocal-zone-item ${selectedItem.zone === 'sefeteyn' ? 'active' : ''}">
                  <span class="zone-name"> Şefeteyn (Dudaklar)</span>
                  <span class="zone-letters">ب · م · و · ف (4 Harf)</span>
                </div>
                <div class="vocal-zone-item ${selectedItem.zone === 'lisan' ? 'active' : ''}">
                  <span class="zone-name"> Lisân (Dil ve Damak)</span>
                  <span class="zone-letters">Dil ucu, yanları, kökü (18 Harf)</span>
                </div>
                <div class="vocal-zone-item ${selectedItem.zone === 'halk' ? 'active' : ''}">
                  <span class="zone-name"> Halk (Boğaz)</span>
                  <span class="zone-letters">ء · هـ · ع · ح · غ · خ (6 Harf)</span>
                </div>
                <div class="vocal-zone-item ${selectedItem.zone === 'cevf' ? 'active' : ''}">
                  <span class="zone-name"> Cevf (Ağız ve Göğüs Boşluğu)</span>
                  <span class="zone-letters">Med Harfleri (ا · و · ي)</span>
                </div>
              </div>
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
                  <th>Örnek Kelime</th>
                  <th>Dinle</th>
                </tr>
              </thead>
              <tbody>
                ${ARABIC_LETTERS.map((item, idx) => `
                  <tr>
                    <td><strong>${item.name}</strong> <span style="font-size:0.75rem; color:#8a94a6;">(${item.sound})</span></td>
                    <td><span class="yazilis-glyph" lang="ar">${item.forms ? item.forms[0] : item.char}</span></td>
                    <td><span class="yazilis-glyph" lang="ar">${item.forms ? item.forms[1] : item.char}</span></td>
                    <td><span class="yazilis-glyph" lang="ar">${item.forms ? item.forms[2] : item.char}</span></td>
                    <td><span class="yazilis-glyph" lang="ar">${item.forms ? item.forms[3] : item.char}</span></td>
                    <td><span style="font-family:'Amiri', serif; font-size:1.6rem; color:var(--accent-gold);" lang="ar">${item.example || ''}</span></td>
                    <td>
                      <button type="button" class="btn-sm-action btn-listen-letter" data-idx="${idx}" title="${item.name} için doğrulanmış ses kaydı yok"> Ses yok</button>
                    </td>
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
              <p class="card-desc">Arapçada harfler sessizdir; üç temel harekeyi inceleyin. Bu ekranda doğrulanmış hareke ses kayıtları bulunmuyor.</p>
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
              <div class="hareke-card" data-idx="${idx}" data-sound="${item.sound}" data-name="${item.name}" title="${item.name} için doğrulanmış ses kaydı yok">
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
              <div class="cezm-card" data-sound="${item.sound}" data-glyph="${item.glyph || item.char}" title="Doğrulanmış ses kaydı mevcut değil">
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
              <div class="sedde-card" data-sound="${item.sound}" data-glyph="${item.glyph || item.char}" title="Doğrulanmış ses kaydı mevcut değil">
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
      tabBodyHtml = `
        <div class="akademi-card">
          <div class="card-headline">
            <div>
              <span class="card-badge green">ÇİFT HAREKELER</span>
              <h2 class="card-title">Tenvin Okulu (İki Üstün, İki Esre, İki Ötre)</h2>
              <p class="card-desc">İsimlerin sonuna gelen çift harekelerdir ( ً  ٍ  ٌ ). Kelimenin sonuna gizli ve cezimli bir nûn (نْ) sesi katar.</p>
            </div>
          </div>

          <div class="tenvin-grid">
            ${TENVIN.map(item => `
              <div class="tenvin-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span class="card-badge ${item.type === 'İki Üstün' ? 'gold' : (item.type === 'İki Esre' ? 'cyan' : 'green')}" style="font-size:0.72rem;">${item.type}</span>
                  <button type="button" class="btn-sm-action btn-play-sample" data-glyph="${item.glyph}" data-sound="${item.sound}" title="Doğrulanmış ses kaydı mevcut değil"> Ses yok</button>
                </div>
                <div class="tenvin-glyph" lang="ar">${item.glyph}</div>
                <div style="text-align:center;">
                  <div style="font-size:1.15rem; font-weight:800; color:var(--accent-gold);">${item.sound}</div>
                  ${item.meaning ? `<div style="font-size:0.82rem; color:#f0f3fa; margin-top:0.25rem;">Anlamı: <em>${item.meaning}</em></div>` : ''}
                  <div style="font-size:0.76rem; color:#8a94a6; margin-top:0.25rem;">${item.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SEKME 6: MED HARFLERİ VE UZATMA
    // =========================================================================
    else if (activeElifbaTab === 'med') {
      tabBodyHtml = `
        <div class="akademi-card">
          <div class="card-headline">
            <div>
              <span class="card-badge cyan">ASLÎ MED (MEDD-İ TABİÎ)</span>
              <h2 class="card-title">Med Harfleri (Elif · Vâv · Yâ)</h2>
              <p class="card-desc">Hareketsiz harfler kendinden önceki harekeli harfi 1 elif miktarı (yaklaşık 1 saniye) uzatır.</p>
            </div>
          </div>

          <!-- Nûhîhâ Başyapıt Vitrini -->
          <div style="background:linear-gradient(135deg, rgba(229,184,105,0.14) 0%, rgba(229,184,105,0.03) 100%); border:1px solid rgba(229,184,105,0.35); border-radius:14px; padding:1.5rem; margin:1.25rem 0; text-align:center; box-shadow:0 8px 24px rgba(0,0,0,0.35);">
            <span class="card-badge gold" style="margin-bottom:0.6rem; display:inline-block;">3 MEDDİ BİR ARADA TOPLAYAN ÂYET KELİMESİ</span>
            <div style="font-family:'Amiri', serif; font-size:3.6rem; color:var(--accent-gold); margin:0.4rem 0; text-shadow:0 0 16px rgba(229,184,105,0.4);" lang="ar">نُوحِيهَا</div>
            <div style="font-size:1.2rem; font-weight:800; color:#f0f3fa;">Nû - hî - hâ (Hûd Sûresi 49. Âyet)</div>
            <p style="color:#cbd5e1; font-size:0.92rem; max-width:680px; margin:0.6rem auto 0 auto; line-height:1.6;">
              Bu mübarek kelimede 3 med harfinin tamamı sırasıyla yer alır: Öncesi ötreli Vâv (<span lang="ar" style="color:#00e676; font-family:'Amiri'; font-size:1.3rem;">نُو</span>), öncesi esreli Yâ (<span lang="ar" style="color:#00e5ff; font-family:'Amiri'; font-size:1.3rem;">حِي</span>) ve öncesi üstünlü Elif (<span lang="ar" style="color:var(--accent-gold); font-family:'Amiri'; font-size:1.3rem;">هَا</span>).
            </p>
          </div>

          <!-- 10 Med Kartı -->
          <div class="med-grid">
            ${MED_EXAMPLES.map(item => `
              <div class="med-card">
                <div class="med-glyph" lang="ar">${item.glyph}</div>
                <div style="font-size:1.15rem; font-weight:800; color:#f0f3fa;">${item.sound}</div>
                <div style="font-size:0.78rem; color:var(--accent-gold); margin-top:0.25rem; font-weight:700;">${item.type}</div>
                <div style="font-size:0.76rem; color:#8a94a6; margin-top:0.25rem;">${item.desc}</div>
                <button type="button" class="btn-sm-action btn-play-sample" data-glyph="${item.glyph}" data-sound="${item.sound}" title="Doğrulanmış ses kaydı mevcut değil" style="margin-top:0.8rem; width:100%;"> Ses kaydı yok</button>
              </div>
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
              <p class="card-desc">Heceleri sağdan sola sırayla seçerek kelimenin yazılı yapısını inceleyin. Bu ekranda doğrulanmış hece ses kayıtları bulunmuyor.</p>
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
      // 30 kapsamlı soru (15 harf mahreci + 15 kelime ve anlam ayrımı)
      // Şıkların doğru cevap pozisyonları (A, B, C) dengeli ve karışık olarak dizilmiştir.
      const rawEarQuestions = [
        // --- 1. KISIM: HARF VE MAHREÇ SEVİYESİ (1-10) ---
        {
          id: 1,
          category: "harf",
          badge: "PELTEK vs KESKİN vs KALIN",
          prompt: "Peltek ve yumuşak şekilde, dil ucunun üst ön dişlerin arasından hafifçe sızmasıyla çıkan harfi tespit edin:",
          targetChar: "ث",
          soundType: "fricative",
          freq: 4600,
          f0: 220,
          explanation: "ث (Peltek Sâ) harfinde dil ucu iki diş arasına hafifçe sıkışarak yumuşakça sızar. س keskin ve ıslıklı, ص ise dili damağa yapıştırarak dolgun ve kalındır.",
          options: [
            { char: "س", label: "س (Keskin Sîn)", desc: "Dil ucunun alt dişlerin arkasına basmasıyla çıkan ıslıklı ve ince s.", sampleWord: "سَبِيل", sampleMeaning: "Yol / İstikamet" },
            { char: "ث", label: "ث (Peltek Sâ)", desc: "Dil ucunun ön dişler arasından hafif çıkmasıyla ince ve yumuşak se.", sampleWord: "ثَوَاب", sampleMeaning: "Mükâfat / Sevap" },
            { char: "ص", label: "ص (Kalın Sâd)", desc: "Dili damağa yapıştırarak (ıtbâk) çıkarılan dolgun ve kalın s.", sampleWord: "صِرَاط", sampleMeaning: "Cadde / Sırat" }
          ]
        },
        {
          id: 2,
          category: "harf",
          badge: "BOĞAZ KATMANLARI",
          prompt: "Boğazın tam ortasının sıkılmasıyla çıkan, hırıltısız ve buharlı saf boğaz sesini seçin:",
          targetChar: "ح",
          soundType: "pharyngeal",
          freq: 1400,
          f0: 293,
          explanation: "ح (Boğaz Hâ) boğazın tam ortasından yakıcı bir buhar gibi çıkar. ه göğüsten rahatça sızar, خ ise boğazın üstünden hırıltıyla dökülür.",
          options: [
            { char: "ه", label: "ه (Göğüs Hê)", desc: "Boğazın en altından, göğse en yakın yerden serbestçe çıkan yumuşak he.", sampleWord: "هُدًى", sampleMeaning: "Hidayet Rehberi" },
            { char: "خ", label: "خ (Hırıltılı Hı)", desc: "Boğazın ağza en yakın üst kısmından hırıltılı çıkan kalın ses.", sampleWord: "خَيْر", sampleMeaning: "Hayırlı Olan" },
            { char: "ح", label: "ح (Boğaz Hâ)", desc: "Boğazın tam ortasının sıkılmasıyla çıkan buharlı duru ses.", sampleWord: "حَمْد", sampleMeaning: "Övgü ve Şükür" }
          ]
        },
        {
          id: 3,
          category: "harf",
          badge: "GIRTLAK SIKIŞMASI",
          prompt: "Gırtlağın (boğaz ortası) kuvvetle sıkılmasıyla çıkan tok ve derin sesi tespit edin:",
          targetChar: "ع",
          soundType: "pharyngeal",
          freq: 950,
          f0: 175,
          explanation: "ع (Ayn) boğaz ortasının adeta boğulurcasına sıkılmasıyla çıkar. ء (Hemze) ise ses tellerinin birden kapanıp açılmasıyla patlayan sert bir sestir.",
          options: [
            { char: "ع", label: "ع (Ayn)", desc: "Boğazın tam ortasının sıkılmasıyla çıkan tok gırtlak sesi.", sampleWord: "عَلِيم", sampleMeaning: "Hakkıyla Bilen" },
            { char: "ء", label: "ء (Hemze)", desc: "Ses tellerinin aniden kapanıp açılmasıyla çıkan patlamalı ses.", sampleWord: "أَلِيم", sampleMeaning: "Elem Verici" },
            { char: "ح", label: "ح (Hâ)", desc: "Boğazın ortasından nefesle buharlı çıkan harf.", sampleWord: "حَكِيم", sampleMeaning: "Hikmet Sahibi" }
          ]
        },
        {
          id: 4,
          category: "harf",
          badge: "DİL KÖKÜ vs DAMAK",
          prompt: "Dil kökünün küçük dil karşısındaki yumuşak damağa kuvvetle çarpmasıyla çıkan kalın harfi seçin:",
          targetChar: "ق",
          soundType: "plosive",
          freq: 850,
          f0: 196,
          explanation: "ق (Kalın Kâf) dil kökünün yumuşak damağa kilitlenmesiyle çıkar ve kalkalelidir. ك (İnce Kef) ise sert damağa vurur ve nefes akıntısı (hems) barındırır.",
          options: [
            { char: "ك", label: "ك (İnce Kef)", desc: "Dil kökünün biraz ön tarafının sert damağa vurmasıyla çıkan ince ke.", sampleWord: "كِتَاب", sampleMeaning: "İlahî Kitap" },
            { char: "ق", label: "ق (Kalın Kâf)", desc: "Dil kökünün yumuşak damağa kilitlenmesiyle çıkan kuvvetli kalın ses.", sampleWord: "قُرْآن", sampleMeaning: "Kur'ân-ı Kerîm" },
            { char: "غ", label: "غ (Ğayn)", desc: "Boğazın üst kısmından kaynayan yumuşak kalın ses.", sampleWord: "غَفُور", sampleMeaning: "Bağışlayıcı" }
          ]
        },
        {
          id: 5,
          category: "harf",
          badge: "DAMAK BASKISI (ITBÂK)",
          prompt: "Dil ucunun üst ön diş köklerine yapışması ve dil sırtının tamamen damağa kalkmasıyla (ıtbâk) en tok çıkan harf:",
          targetChar: "ط",
          soundType: "emphatic",
          freq: 750,
          f0: 261,
          explanation: "ط (Kalın Tâ) harfinde hem kalınlık hem de ıtbâk (damağa yapışma) vardır; Kur'an'daki en kuvvetli harftir. ت ise son derece ince ve zariftir.",
          options: [
            { char: "ط", label: "ط (Kalın Tâ)", desc: "Dilin üst damağa tamamen yapışmasıyla çıkan en tok kalın ses.", sampleWord: "طَيِّب", sampleMeaning: "Tertemiz / Hoş" },
            { char: "ت", label: "ت (İnce Tê)", desc: "Dil ucunun diş etlerine hafif dokunmasıyla çıkan ince te.", sampleWord: "تَوْبَة", sampleMeaning: "Tövbe ve Dönüş" },
            { char: "د", label: "د (İnce Dâl)", desc: "Dil ucunun ön diş diplerine hafifçe değmesiyle çıkan ince de.", sampleWord: "دِين", sampleMeaning: "Din ve Düzen" }
          ]
        },
        {
          id: 6,
          category: "harf",
          badge: "Z HARFLERİ AYRIMI",
          prompt: "Dil ucunun üst ön dişlerin arasından dışarı sızmasıyla peltek, ince ve yumuşak çıkan z sesini seçin:",
          targetChar: "ذ",
          soundType: "fricative",
          freq: 3800,
          f0: 233,
          explanation: "ذ ince peltektir. ز keskin arı vızıltısı gibi öter. ظ ise peltek olmakla birlikte dil sırtı damağa kalktığı için çok kalındır.",
          options: [
            { char: "ز", label: "ز (Keskin Zê)", desc: "Dil ucunun alt dişlere yaklaşmasıyla çıkan keskin arı vızıltısı.", sampleWord: "زَكَاة", sampleMeaning: "Zekât" },
            { char: "ظ", label: "ظ (Kalın Peltek Zâ)", desc: "Dil ucunun dışarı çıkmasıyla dil kökünün damağa kalktığı dolgun peltek.", sampleWord: "ظَالِم", sampleMeaning: "Zulmeden" },
            { char: "ذ", label: "ذ (İnce Peltek Zâl)", desc: "Dil ucunun üst dişler arasından yumuşakça sızdığı zarif ince peltek.", sampleWord: "ذِكْر", sampleMeaning: "Öğüt ve Zikir" }
          ]
        },
        {
          id: 7,
          category: "harf",
          badge: "KUR'AN'A HAS HARF (İSTİTÂLE)",
          prompt: "Dil yanının üst azı dişlerine teması ve sesin uzayarak akmasıyla (istitâle) çıkan harfi tespit edin:",
          targetChar: "ض",
          soundType: "emphatic",
          freq: 650,
          f0: 185,
          explanation: "ض (Dâd) dili üst yan azı dişlerine yaslayarak çıkan ve Arapçaya has en zor mahreçtir. Asla düz 'd' veya 'z' gibi okunamaz.",
          options: [
            { char: "ض", label: "ض (Dâd)", desc: "Dil yanının üst azı dişlerine uzayıp yapışmasıyla (istitâle) çıkan en hususi ses.", sampleWord: "ضِيَاء", sampleMeaning: "Kuvvetli Işık" },
            { char: "د", label: "د (İnce Dâl)", desc: "Dil ucunun üst diş diplerine değmesiyle çıkan ince ve sakin d.", sampleWord: "دُعَاء", sampleMeaning: "Yakarış ve Dua" },
            { char: "ظ", label: "ظ (Kalın Zâ)", desc: "Dil ucunun ön dişlerden dışarı taşmasıyla çıkan peltek kalın ses.", sampleWord: "ظِلّ", sampleMeaning: "Gölge" }
          ]
        },
        {
          id: 8,
          category: "harf",
          badge: "BOĞAZ ÜSTÜ AKINTISI",
          prompt: "Boğazın ağza en yakın üst kısmından hırıltısız, kaynar su gibi yumuşakça akan kalın sesi seçin:",
          targetChar: "غ",
          soundType: "pharyngeal",
          freq: 1100,
          f0: 207,
          explanation: "غ (Ğayn) boğazın üstünden kaynar gibi hırıltısız akar. خ ise aynı bölgeden sürtünmeli hırıltıyla çıkar.",
          options: [
            { char: "خ", label: "خ (Hırıltılı Hı)", desc: "Boğazın üst kısmından nefesin hırıltıyla sürtünerek çıkması.", sampleWord: "خَلْق", sampleMeaning: "Yaratılış" },
            { char: "غ", label: "غ (Ğayn)", desc: "Boğazın üst kısmından kaynar su gibi akan yumuşak dolgun ses.", sampleWord: "غَيْب", sampleMeaning: "Görünmeyen Âlem" },
            { char: "ق", label: "ق (Kâf)", desc: "Dil kökünün yumuşak damağa vurmasıyla çıkan sert patlamalı ses.", sampleWord: "قَدِير", sampleMeaning: "Her Şeye Gücü Yeten" }
          ]
        },
        {
          id: 9,
          category: "harf",
          badge: "DUDAK MAHREÇLERİ",
          prompt: "Dudakların yuvarlanarak öne doğru uzatılmasıyla çıkan yumuşak harfi seçin:",
          targetChar: "و",
          soundType: "voiced",
          freq: 800,
          f0: 220,
          explanation: "و (Vâv) iki dudağın yuvarlanıp büzülmesiyle çıkar; dişler temas etmez. ف ise üst ön dişlerin alt dudağın ıslak kısmına basmasıyla çıkar.",
          options: [
            { char: "ف", label: "ف (Fê)", desc: "Üst ön dişlerin alt dudağın ıslak yerine basmasıyla çıkan hava akıntısı.", sampleWord: "فَتْح", sampleMeaning: "Zafer ve Açılış" },
            { char: "ب", label: "ب (Bâ)", desc: "İki dudağın ıslak kısımlarının birbirine kuvvetle kapanıp açılması.", sampleWord: "بَرَكَة", sampleMeaning: "Bereket ve Bolluk" },
            { char: "و", label: "و (Vâv)", desc: "Dudakların yuvarlanarak öne doğru büzülmesiyle çıkan akıcı ses.", sampleWord: "وَاحِد", sampleMeaning: "Bir ve Tek Olan" }
          ]
        },
        {
          id: 10,
          category: "harf",
          badge: "TİTREŞİM VE TEFHÎM",
          prompt: "Dil ucunun ön damak tavanına vurup titreşmesiyle (tekrîr) çıkan, yerine göre kalın veya ince okunan harf:",
          targetChar: "ر",
          soundType: "voiced",
          freq: 1350,
          f0: 245,
          explanation: "ر (Râ) harfi dil ucunun kıvrılıp damağa değmesiyle çıkar. Üstün ve ötrede kalın (tefhîm), esrede ise ince (terkîk) okunur.",
          options: [
            { char: "ل", label: "ل (Lâm)", desc: "Dil ucunun geniş kısmının ön üst diş etlerine yapışması.", sampleWord: "لَيْل", sampleMeaning: "Gece Vakti" },
            { char: "ر", label: "ر (Râ)", desc: "Dil ucunun damağa vurup hafifçe titreşmesiyle çıkan asil ses.", sampleWord: "رَحْمَة", sampleMeaning: "Sonsuz Merhamet" },
            { char: "ن", label: "ن (Nûn)", desc: "Dil ucunun damağa basıp sesin genizden (gunne) gelmesi.", sampleWord: "نُور", sampleMeaning: "İlahî Aydınlık" }
          ]
        },

        // --- 2. KISIM: KELİME VE ANLAM DEĞİŞİMİ MINIMAL PAIRS (11-20) ---
        {
          id: 11,
          category: "kelime",
          badge: "ANLAM DEĞİŞİMİ: ق vs ك",
          prompt: "Kur'an'da 'Yürek / İman Kalbi' anlamına gelen kelimeyi doğru harfle seçin (Yanlış okunursa 'Köpek' anlamına döner!):",
          targetChar: "قَلْب",
          soundType: "plosive",
          freq: 850,
          f0: 196,
          sampleWord: "قَلْب",
          ayahRef: "Şuarâ 89 (إِلَّا مَنْ أَتَى اللَّهَ بِقَلْبٍ سَلِيمٍ)",
          explanation: "ق (Kâf) ile 'قَلْب' = Yürek, Gönül demektir. Eğer ince ك ile okunursa 'كَلْب' (Kelb) olur ve 'Köpek' mânâsına gelir. Bu bir lahn-ı celîdir (büyük hata)!",
          options: [
            { char: "قَلْب", label: "قَلْب (Kalp)", desc: "Yürek, gönül, imanın mahalli. Kalın Kâf ile okunur.", sampleWord: "قَلْبٍ سَلِيم", sampleMeaning: "Tertemiz bir kalp ile" },
            { char: "كَلْب", label: "كَلْب (Kelb)", desc: "Köpek anlamına gelir; ince Kef ile okunur.", sampleWord: "كَمَثَلِ الْكَلْبِ", sampleMeaning: "Köpeğin durumu gibi (A'râf 176)" },
            { char: "غَلْب", label: "غَلْب (Ğalb)", desc: "Galip gelmek, üstünlük kökü.", sampleWord: "غَلَبَتِ الرُّومُ", sampleMeaning: "Rumlar mağlup oldu" }
          ]
        },
        {
          id: 12,
          category: "kelime",
          badge: "ANLAM DEĞİŞİMİ: خ vs ح",
          prompt: "İlk inen âyetteki 'Yarattı' fiilini tespit edin (Harfi yanlış okursanız 'Tıraş etti' anlamına döner!):",
          targetChar: "خَلَقَ",
          soundType: "pharyngeal",
          freq: 1250,
          f0: 215,
          sampleWord: "خَلَقَ",
          ayahRef: "Alak 1 (خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ)",
          explanation: "خ (Hı) ile 'خَلَقَ' = Yoktan Yarattı demektir. ح (Hâ) ile 'حَلَقَ' denirse saç tıraş etmek anlamına döner!",
          options: [
            { char: "حَلَقَ", label: "حَلَقَ (Halaka)", desc: "Tıraş etti, saçını kesti anlamına gelir.", sampleWord: "مُحَلِّقِينَ رُءُوسَكُمْ", sampleMeaning: "Başlarınızı tıraş etmiş olarak (Feth 27)" },
            { char: "خَلَقَ", label: "خَلَقَ (Halaka)", desc: "Yarattı, var etti demektir. Hırıltılı Hı ile okunur.", sampleWord: "خَلَقَ الْإِنسَانَ", sampleMeaning: "İnsanı yarattı (Alak 1)" },
            { char: "عَلَقَ", label: "عَلَقَ ('Alaka)", desc: "Tutundu, asıldı kökü.", sampleWord: "مِنْ عَلَقٍ", sampleMeaning: "Bir aşılanmış yumurtadan" }
          ]
        },
        {
          id: 13,
          category: "kelime",
          badge: "ANLAM DEĞİŞİMİ: ع vs ء",
          prompt: "Allah'ın 'Hakkıyla Bilen' ism-i şerîfini seçin (Yanlış harfle okunursa 'Şiddetli elem verici azap' anlamına döner!):",
          targetChar: "عَلِيمٌ",
          soundType: "pharyngeal",
          freq: 950,
          f0: 180,
          sampleWord: "عَلِيمٌ",
          ayahRef: "Bakara 115 (إِنَّ اللَّهَ وَاسِعٌ عَلِيمٌ)",
          explanation: "ع ile 'عَلِيمٌ' = Her şeyi en ince ayrıntısıyla bilen Allah. ء ile 'أَلِيمٌ' = Şiddetli acı ve elem verici azaptır.",
          options: [
            { char: "أَلِيمٌ", label: "أَلِيمٌ (Elîm)", desc: "Can yakıcı acı ve elem. Hemze ile okunur.", sampleWord: "عَذَابٌ أَلِيمٌ", sampleMeaning: "Elem verici bir azap (Bakara 10)" },
            { char: "حَلِيمٌ", label: "حَلِيمٌ (Halîm)", desc: "Cezada acele etmeyen, hilm sahibi.", sampleWord: "غَفُورٌ حَلِيمٌ", sampleMeaning: "Bağışlayandır, Halîmdir" },
            { char: "عَلِيمٌ", label: "عَلِيمٌ (Alîm)", desc: "Her şeyi bilen Allah Teâlâ. Ayn ile okunur.", sampleWord: "وَاسِعٌ عَلِيمٌ", sampleMeaning: "Lütfu geniştir, Alîmdir (Bakara 115)" }
          ]
        },
        {
          id: 14,
          category: "kelime",
          badge: "ANLAM DEĞİŞİMİ: ص vs س",
          prompt: "Âyette 'İsyan etti' anlamına gelen kelimeyi seçin (İnce s ile okunursa 'Umulur ki / Belki' anlamına döner!):",
          targetChar: "عَصَى",
          soundType: "emphatic",
          freq: 750,
          f0: 210,
          sampleWord: "عَصَى",
          ayahRef: "Tâhâ 121 (وَعَصَىٰ آدَمُ رَبَّهُ فَغَوَىٰ)",
          explanation: "ص ile 'عَصَى' = İsyan etti, karşı geldi demektir. س ile 'عَسَى' denirse 'Umulur ki, umulur' anlamına dönüşür.",
          options: [
            { char: "عَسَى", label: "عَسَى ('Asâ)", desc: "Umulur ki, belki anlamına gelen temenni edatı.", sampleWord: "عَسَىٰ أَن تَكْرَهُوا", sampleMeaning: "Olur ki hoşlanmazsınız (Bakara 216)" },
            { char: "عَصَى", label: "عَصَى ('Asâ)", desc: "İsyan etti, emre uymadı. Kalın Sâd ile okunur.", sampleWord: "وَعَصَىٰ آدَمُ", sampleMeaning: "Âdem Rabbine isyan etti (Tâhâ 121)" },
            { char: "عَشَا", label: "عَشَا ('Aşâ)", desc: "Karanlıkta yolunu kaybetti, gözü zayıfladı.", sampleWord: "يَعْشُ عَن ذِكْرِ", sampleMeaning: "Kim zikirden yüz çevirirse" }
          ]
        },
        {
          id: 15,
          category: "kelime",
          badge: "ANLAM DEĞİŞİMİ: ذ vs ظ",
          prompt: "Kur'an'da 'Alçakgönüllülük / Tevazu kanatları' bağlamındaki kelime (Kalın okunursa 'Koyu gölge' olur!):",
          targetChar: "ذَلِيل",
          soundType: "fricative",
          freq: 3600,
          f0: 225,
          sampleWord: "ذَلِيل",
          ayahRef: "İsrâ 24 (وَاخْفِضْ لَهُمَا جَنَاحَ الذُّلِّ)",
          explanation: "ذ ile 'ذَلِيل' = Tevazu gösteren, boyun büken demektir. ظ ile 'ظَلِيل' = Koyu gölge demektir (Örn: 'Zıllen Zalîlâ').",
          options: [
            { char: "ذَلِيل", label: "ذَلِيل (Zelîl)", desc: "Alçakgönüllü, mütevazı. İnce Peltek Zâl iledir.", sampleWord: "جَنَاحَ الذُّلِّ", sampleMeaning: "Tevazu kanadını indir (İsrâ 24)" },
            { char: "ظَلِيل", label: "ظَلِيل (Zalîl)", desc: "Koyu, serinletici gölge. Kalın Peltek Zâ iledir.", sampleWord: "ظِلًّا ظَلِيلًا", sampleMeaning: "Koyu ve ferah gölge (Nisâ 57)" },
            { char: "زَلِيل", label: "زَلِيل (Zelîl - Keskin)", desc: "Kaygan ve hatalı telaffuz.", sampleWord: "زَلَّة", sampleMeaning: "Ayak kayması" }
          ]
        },
        {
          id: 16,
          category: "kelime",
          badge: "ANLAM DEĞİŞİMİ: ذ vs ظ",
          prompt: "İsrâ Sûresi 57. âyette geçen 'Korkulup sakınılması gereken azap' mânâsındaki lafzı seçin:",
          targetChar: "مَحْذُورًا",
          soundType: "fricative",
          freq: 3800,
          f0: 230,
          sampleWord: "مَحْذُورًا",
          ayahRef: "İsrâ 57 (إِنَّ عَذَابَ رَبِّكَ كَانَ مَحْذُورًا)",
          explanation: "ذ ile 'مَحْذُور' = Çekinilip sakınılan demektir. ظ ile 'مَحْظُور' = Yasaklanmış/engellenmiş demektir (İsrâ 20). İkisi de Kur'an'da geçer fakat zıt anlam taşır!",
          options: [
            { char: "مَحْظُورًا", label: "مَحْظُورًا (Mahzûr)", desc: "Yasaklanmış, men edilmiş demektir. Kalın Zâ iledir.", sampleWord: "مَا كَانَ مَحْظُورًا", sampleMeaning: "Kısıtlanmış değildir (İsrâ 20)" },
            { char: "مَقْدُورًا", label: "مَقْدُورًا (Makdûr)", desc: "Takdir edilmiş, ölçüsü konmuş.", sampleWord: "قَدَرًا مَقْدُورًا", sampleMeaning: "Takdir edilen kader" },
            { char: "مَحْذُورًا", label: "مَحْذُورًا (Mahzûr)", desc: "Korkulup sakınılan. İnce Peltek Zâl iledir.", sampleWord: "عَذَابَ رَبِّكَ كَانَ مَحْذُورًا", sampleMeaning: "Rabbinin azabı sakınılmalıdır (İsrâ 57)" }
          ]
        },
        {
          id: 17,
          category: "kelime",
          badge: "ANLAM DEĞİŞİMİ: ت vs ط",
          prompt: "Kur'an'da 'Tövbe edip Hakk'a yöneldi' anlamına gelen kelime (Kalın okunursa 'Hoş ve helal oldu' olur!):",
          targetChar: "تَابَ",
          soundType: "plosive",
          freq: 2200,
          f0: 240,
          sampleWord: "تَابَ",
          ayahRef: "Bakara 37 (فَتَابَ عَلَيْهِ ۚ إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ)",
          explanation: "ت ile 'تَابَ' = Tövbe etti demektir. ط ile 'طَابَ' = Hoşuna gitti, temiz ve helal oldu mânâsına gelir.",
          options: [
            { char: "طَابَ", label: "طَابَ (Tâbe)", desc: "Gönlünüze hoş geldi, helal oldu. Kalın Tâ iledir.", sampleWord: "فَانكِحُوا مَا طَابَ لَكُم", sampleMeaning: "Size hoş gelen kadınlardan (Nisâ 3)" },
            { char: "تَابَ", label: "تَابَ (Tâbe)", desc: "Tövbe etti, bağışlanma diledi. İnce Tê iledir.", sampleWord: "فَتَابَ عَلَيْهِ", sampleMeaning: "Tövbesini kabul etti (Bakara 37)" },
            { char: "ثَابَ", label: "ثَابَ (Sâbe)", desc: "Döndü, toplandı (Peltek Se ile).", sampleWord: "مَثَابَةً لِّلنَّاسِ", sampleMeaning: "İnsanlar için toplanma yeri" }
          ]
        },
        {
          id: 18,
          category: "kelime",
          badge: "ANLAM DEĞİŞİMİ: ض vs ظ",
          prompt: "Fâtiha Sûresi sonundaki 'Doğru yoldan sapanlar' mânâsındaki kelimeyi seçin (ظ ile okunursa 'Kalanlar' olur!):",
          targetChar: "الضَّالِّينَ",
          soundType: "emphatic",
          freq: 650,
          f0: 180,
          sampleWord: "الضَّالِّينَ",
          ayahRef: "Fâtiha 7 (غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ)",
          explanation: "ض ile 'ضَلَّ' = Haktan saptı, dalalete düştü demektir. ظ ile 'ظَلَّ' = Devam etti, gün boyu kaldı mânâsındadır.",
          options: [
            { char: "الضَّالِّينَ", label: "الضَّالِّينَ (Ed-Dâllîn)", desc: "Haktan sapanlar demektir. Dâd harfiyle okunur.", sampleWord: "وَلَا الضَّالِّينَ", sampleMeaning: "Ve sapıtanların yoluna değil (Fâtiha 7)" },
            { char: "الظَّالِّينَ", label: "الظَّالِّينَ (Ez-Zâllîn)", desc: "Varlığını sürdürenler; Zâ ile okunursa anlam sapar.", sampleWord: "ظَلَّ وَجْهُهُ", sampleMeaning: "Yüzü kararıp kaldı (Nahl 58)" },
            { char: "الدَّالِّينَ", label: "الدَّالِّينَ (Ed-Dâllîn - Dâl)", desc: "Yol gösterenler kökü (Dâl ile).", sampleWord: "دَلَّهُمْ", sampleMeaning: "Onlara yol gösterdi" }
          ]
        },
        {
          id: 19,
          category: "kelime",
          badge: "ANLAM DEĞİŞİMİ: ح vs ه",
          prompt: "Kâbe-i Muazzama ve Mekke için kullanılan 'Hürmetli ve güvenli kutsal belde' kelimesini seçin:",
          targetChar: "حَرَمًا",
          soundType: "pharyngeal",
          freq: 1350,
          f0: 280,
          sampleWord: "حَرَمًا",
          ayahRef: "Kasas 57 (أَوَلَمْ نُمَكِّن لَّهُمْ حَرَمًا آمِنًا)",
          explanation: "ح ile 'حَرَم' = Kutsal, hürmetli, dokunulmaz kılınan yer demektir. ه ile 'هَرَم' = İhtiyarlık, zeval ve güçten düşmektir.",
          options: [
            { char: "هَرَمًا", label: "هَرَمًا (Heramâ)", desc: "İhtiyarlık, dermansızlık, çöküş mânâsına gelir.", sampleWord: "مِنْ شَرِّ الْهَرَمِ", sampleMeaning: "İhtiyarlığın şerrinden (Hadis)" },
            { char: "خَرَمًا", label: "خَرَمًا (Haramâ)", desc: "Yarmak, delmek kökü.", sampleWord: "خَرَقَ", sampleMeaning: "Delik açtı (Kehf 71)" },
            { char: "حَرَمًا", label: "حَرَمًا (Haramâ)", desc: "Dokunulmaz ve kutsal kılınmış güvenli yurt.", sampleWord: "حَرَمًا آمِنًا", sampleMeaning: "Güvenli bir Harem (Kasas 57)" }
          ]
        },
        {
          id: 20,
          category: "kelime",
          badge: "ANLAM DEĞİŞİMİ: ص vs س",
          prompt: "Kur'an'da 'Haktan yüz çevirip engellemek' mânâsındaki lafız (İnce s ile okunursa 'Sed çekip kapatmak' olur!):",
          targetChar: "صَدَّ",
          soundType: "emphatic",
          freq: 750,
          f0: 210,
          sampleWord: "صَدَّ",
          ayahRef: "Nisâ 61 (رَأَيْتَ الْمُنَافِقِينَ يَصُدُّونَ عَنكَ صُدُودًا)",
          explanation: "ص ile 'صَدَّ' = Engelledi, yüz çevirdi demektir. س ile 'سَدَّ' = Önüne set çekti, kapattı (Zülkarneyn kıssasındaki Sed gibi) demektir.",
          options: [
            { char: "سَدَّ", label: "سَدَّ (Sedde)", desc: "Önüne set çekip kapattı. İnce Sîn iledir.", sampleWord: "بَيْنَ السَّدَّيْنِ", sampleMeaning: "İki set arasında (Kehf 93)" },
            { char: "صَدَّ", label: "صَدَّ (Sadde)", desc: "Yüz çevirdi ve alıkoydu. Kalın Sâd iledir.", sampleWord: "يَصُدُّونَ عَنكَ", sampleMeaning: "Senden yüz çevirip engellerler (Nisâ 61)" },
            { char: "شَدَّ", label: "شَدَّ (Şedde)", desc: "Kuvvetlendirdi, bağladı mânâsı.", sampleWord: "اشْدُدْ بِهِ أَزْرِي", sampleMeaning: "Onunla sırtımı kuvvetlendir" }
          ]
        },
        {
          id: 21,
          category: "harf",
          badge: "DİL UCU vs DUDAK (NÛN / MÎM)",
          prompt: "Dudakların kapanmasıyla başlayan ve geniz tınısı taşıyan harfi seçin:",
          targetChar: "م",
          soundType: "voiced",
          freq: 900,
          f0: 220,
          explanation: "م (Mîm) iki dudağın kapanmasıyla çıkar ve gunne taşır. ن (Nûn) dil ucunun üst ön diş etlerine yaklaşmasıyla çıkar; gunne iki harfte de duyulur ancak mahreçleri farklıdır.",
          options: [
            { char: "ن", label: "ن (Nûn)", desc: "Dil ucunun diş etlerine temas ettiği, geniz tınılı harf.", sampleWord: "نُور", sampleMeaning: "Işık" },
            { char: "م", label: "م (Mîm)", desc: "İki dudağın kapanmasıyla çıkan, geniz tınılı harf.", sampleWord: "مَاء", sampleMeaning: "Su" },
            { char: "ب", label: "ب (Bâ)", desc: "İki dudağın kapanıp açılmasıyla çıkan patlamalı harf.", sampleWord: "بَاب", sampleMeaning: "Kapı" }
          ]
        },
        {
          id: 22,
          category: "harf",
          badge: "ALT DUDAK vs İKİ DUDAK",
          prompt: "Üst ön dişlerin alt dudağa hafifçe değmesiyle çıkan harfi belirleyin:",
          targetChar: "ف",
          soundType: "fricative",
          freq: 2500,
          f0: 220,
          explanation: "ف (Fâ) üst ön dişlerin alt dudağa temasıyla çıkar. ب (Bâ) iki dudağın kapanmasıyla, و (Vâv) ise dudakların yuvarlanmasıyla oluşur.",
          options: [
            { char: "و", label: "و (Vâv)", desc: "Dudakların yuvarlanıp öne uzamasıyla çıkan akıcı ses.", sampleWord: "وَاحِد", sampleMeaning: "Bir" },
            { char: "ف", label: "ف (Fâ)", desc: "Üst ön dişlerin alt dudağa değmesiyle çıkan sürtünmeli ses.", sampleWord: "فَتْح", sampleMeaning: "Açılış / fetih" },
            { char: "ب", label: "ب (Bâ)", desc: "İki dudağın kapanıp açılmasıyla çıkan patlamalı ses.", sampleWord: "بَرَكَة", sampleMeaning: "Bereket" }
          ]
        },
        {
          id: 23,
          category: "harf",
          badge: "PELTEK SESLER: ث / ذ",
          prompt: "Dil ucunun dişler arasından hafifçe görünmesiyle çıkan, titreşimsiz ince sesi seçin:",
          targetChar: "ث",
          soundType: "fricative",
          freq: 4600,
          f0: 220,
          explanation: "ث (Peltek Sâ) titreşimsiz, ince bir sürtünme sesidir. ذ aynı mahreçte ses tellerinin titreşmesiyle; س ise dil ucu dişlerin arasına çıkmadan oluşur.",
          options: [
            { char: "ذ", label: "ذ (Zâl)", desc: "Dişler arasından çıkan, ses telleri titreşen peltek ses.", sampleWord: "ذِكْر", sampleMeaning: "Zikir / öğüt" },
            { char: "س", label: "س (Sîn)", desc: "Dişler arasına çıkmadan oluşan ince ve ıslıklı ses.", sampleWord: "سَبِيل", sampleMeaning: "Yol" },
            { char: "ث", label: "ث (Sâ)", desc: "Dişler arasından çıkan, titreşimsiz ve ince peltek ses.", sampleWord: "ثَوَاب", sampleMeaning: "Karşılık / sevap" }
          ]
        },
        {
          id: 24,
          category: "harf",
          badge: "BOĞAZ ORTASI: ع / ح",
          prompt: "Boğazın orta kısmından ses telleri titreşerek çıkan harfi seçin:",
          targetChar: "ع",
          soundType: "pharyngeal",
          freq: 950,
          f0: 175,
          explanation: "ع (Ayn) boğazın orta kısmından sesli ve sıkı bir çıkışla gelir. ح aynı bölgede nefesli ve titreşimsizdir; ء (Hemze) ise gırtlaktan çıkan kısa bir kapanma sesidir.",
          options: [
            { char: "ح", label: "ح (Hâ)", desc: "Boğaz ortasından nefesle çıkan titreşimsiz ses.", sampleWord: "حَمْد", sampleMeaning: "Övgü" },
            { char: "ء", label: "ء (Hemze)", desc: "Gırtlakta kısa bir kapanma ve açılmayla çıkan ses.", sampleWord: "أَمْر", sampleMeaning: "İş / buyruk" },
            { char: "ع", label: "ع (Ayn)", desc: "Boğaz ortasından ses telleri titreşerek çıkan ses.", sampleWord: "عِلْم", sampleMeaning: "Bilgi" }
          ]
        },
        {
          id: 25,
          category: "harf",
          badge: "KALINLIK: ص / س",
          prompt: "Dil sırtının yükselmesiyle kalın ve dolgun duyulan ıslıklı harfi belirleyin:",
          targetChar: "ص",
          soundType: "emphatic",
          freq: 750,
          f0: 210,
          explanation: "ص (Sâd) isti‘lâ ve ıtbâk sıfatları sebebiyle kalın ve dolgun okunur. س (Sîn) aynı bölgede ince ve ıslıklı çıkar; ز (Zây) ise ses telleri titreşen ince bir sestir.",
          options: [
            { char: "س", label: "س (Sîn)", desc: "İnce, titreşimsiz ve ıslıklı s sesi.", sampleWord: "سَلَام", sampleMeaning: "Esenlik" },
            { char: "ص", label: "ص (Sâd)", desc: "Dil sırtı yükselerek çıkan kalın ve dolgun s sesi.", sampleWord: "صَبْر", sampleMeaning: "Sabır" },
            { char: "ز", label: "ز (Zây)", desc: "Ses telleri titreşen ince ve ıslıklı z sesi.", sampleWord: "زَيْت", sampleMeaning: "Zeytin yağı" }
          ]
        },
        {
          id: 26,
          category: "kelime",
          badge: "ANLAM DEĞİŞİMİ: ت vs ط",
          prompt: "Tîn Sûresi'nde adına yemin edilen meyveyi gösteren kelimeyi seçin:",
          targetChar: "التِّين",
          soundType: "plosive",
          freq: 2200,
          f0: 240,
          sampleWord: "التِّين",
          ayahRef: "Tîn 1 (وَالتِّينِ وَالزَّيْتُونِ)",
          explanation: "تِين (tîn) incir, طِين (tîn) ise çamur anlamındadır. İnce ت ile kalın ط arasındaki fark, kelimenin anlamını değiştirir.",
          options: [
            { char: "الطِّين", label: "الطِّين (et-Tîn)", desc: "Çamur anlamındaki kelime; kalın Tâ ile başlar.", sampleWord: "مِنْ طِينٍ", sampleMeaning: "Çamurdan (Sâd 71)" },
            { char: "الدِّين", label: "الدِّين (ed-Dîn)", desc: "Din ve karşılık anlamındaki kelime; Dâl ile başlar.", sampleWord: "يَوْمِ الدِّين", sampleMeaning: "Karşılık günü" },
            { char: "التِّين", label: "التِّين (et-Tîn)", desc: "İncir anlamındaki kelime; ince Tâ ile başlar.", sampleWord: "وَالتِّينِ", sampleMeaning: "İncire (Tîn 1)" }
          ]
        },
        {
          id: 27,
          category: "kelime",
          badge: "ANLAM DEĞİŞİMİ: خ vs ح",
          prompt: "Arapçada 'yaratmak' anlamına gelen ve Kur'an'da sıkça geçen fiili seçin:",
          targetChar: "خَلَقَ",
          soundType: "pharyngeal",
          freq: 1200,
          f0: 210,
          sampleWord: "خَلَقَ",
          explanation: "خَلَقَ (khalaqa) 'yarattı' demektir. حَلَقَ (ḥalaqa) saçını tıraş etti; غَلَقَ (ghalaqa) ise kapattı anlamına gelir. Boğaz harfinin mahreci fiilin anlamını değiştirir.",
          options: [
            { char: "حَلَقَ", label: "حَلَقَ (Ḥalaqa)", desc: "Saçını tıraş etti; boğaz ortasından ح ile başlar.", sampleWord: "حَلَقَ شَعْرَهُ", sampleMeaning: "Saçını tıraş etti" },
            { char: "خَلَقَ", label: "خَلَقَ (Khalaqa)", desc: "Yarattı; boğazın üst kısmından خ ile başlar.", sampleWord: "خَلَقَ الْإِنسَانَ", sampleMeaning: "İnsanı yarattı" },
            { char: "غَلَقَ", label: "غَلَقَ (Ghalaqa)", desc: "Kapandı; boğazın üst kısmından titreşimli غ ile başlar.", sampleWord: "غَلَقَ", sampleMeaning: "Kapandı" }
          ]
        },
        {
          id: 28,
          category: "kelime",
          badge: "ANLAM DEĞİŞİMİ: غ vs ك",
          prompt: "Kur'an'da Allah'ın bağışlayıcılığını bildiren kelimeyi seçin:",
          targetChar: "غَفُور",
          soundType: "pharyngeal",
          freq: 1100,
          f0: 207,
          sampleWord: "غَفُور",
          ayahRef: "Nisâ 23 (إِنَّ اللَّهَ كَانَ غَفُورًا رَّحِيمًا)",
          explanation: "غَفُور (Ğafûr) çok bağışlayan demektir; كَفُور (Kefûr) ise çok nankör anlamına gelir. İlk harfin boğaz mahreci ile dil kökü mahreci birbirinden ayrılır.",
          options: [
            { char: "كَفُور", label: "كَفُور (Kefûr)", desc: "Çok nankör; dil kökünden ince ك ile başlar.", sampleWord: "إِنَّ الْإِنسَانَ لَكَفُورٌ", sampleMeaning: "İnsan çok nankördür (Zuhruf 15)" },
            { char: "غَفُور", label: "غَفُور (Ğafûr)", desc: "Çok bağışlayan; boğazın üst kısmından غ ile başlar.", sampleWord: "غَفُورًا رَّحِيمًا", sampleMeaning: "Çok bağışlayan, merhamet eden (Nisâ 23)" },
            { char: "عَفُوّ", label: "عَفُوّ (Afuvv)", desc: "Çok affeden; boğaz ortasından ع ile başlar.", sampleWord: "عَفُوًّا غَفُورًا", sampleMeaning: "Çok affedici, bağışlayıcı (Nisâ 99)" }
          ]
        },
        {
          id: 29,
          category: "kelime",
          badge: "ANLAM DEĞİŞİMİ: ع vs ء",
          prompt: "Kur'an'da 'bilgi' ve 'ilim' anlamına gelen kelimeyi seçin:",
          targetChar: "عِلْم",
          soundType: "pharyngeal",
          freq: 950,
          f0: 175,
          sampleWord: "عِلْم",
          ayahRef: "Bakara 32 (لَا عِلْمَ لَنَا إِلَّا مَا عَلَّمْتَنَا)",
          explanation: "عِلْم ('ilm) bilgi demektir; أَلَم (alam) ise acı anlamına gelir. ع boğaz ortasından çıkar, ء ise gırtlaktan kısa bir kapanmayla başlar.",
          options: [
            { char: "أَلَم", label: "أَلَم (Alam)", desc: "Acı ve ağrı; gırtlaktan hemze ile başlar.", sampleWord: "أَلِيم", sampleMeaning: "Acı veren" },
            { char: "حِلْم", label: "حِلْم (Ḥilm)", desc: "Yumuşak huyluluk; boğaz ortasından nefesli ح ile başlar.", sampleWord: "حَلِيم", sampleMeaning: "Yumuşak huylu" },
            { char: "عِلْم", label: "عِلْم ('İlm)", desc: "Bilgi; boğaz ortasından titreşimli ع ile başlar.", sampleWord: "لَا عِلْمَ لَنَا", sampleMeaning: "Bizim bilgimiz yoktur (Bakara 32)" }
          ]
        },
        {
          id: 30,
          category: "kelime",
          badge: "SON SESİ AYIRT ET: ب / ث / ظ",
          prompt: "Aşağıdaki kelimelerden 'gayb / görünmeyen âlem' anlamına geleni seçin:",
          targetChar: "غَيْب",
          soundType: "plosive",
          freq: 1800,
          f0: 210,
          sampleWord: "غَيْب",
          ayahRef: "Bakara 3 (الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ)",
          explanation: "غَيْب (ğayb) görünmeyen âlem; غَيْث (ğays) yağmur; غَيْظ (ğayz) ise öfke demektir. Son sesteki ب, ث ve ظ ayrımı kelimeyi ve anlamını değiştirir.",
          options: [
            { char: "غَيْث", label: "غَيْث (Ğays)", desc: "Yağmur; dil ucu dişler arasından titreşimsiz ث ile biter.", sampleWord: "وَهُوَ الَّذِي يُنَزِّلُ الْغَيْثَ", sampleMeaning: "O yağmuru indirendir (Şûrâ 28)" },
            { char: "غَيْظ", label: "غَيْظ (Ğayz)", desc: "Öfke; dil ucu dişler arasından kalın ظ ile biter.", sampleWord: "الْكَاظِمِينَ الْغَيْظَ", sampleMeaning: "Öfkelerini yutanlar (Âl-i İmrân 134)" },
            { char: "غَيْب", label: "غَيْب (Ğayb)", desc: "Görünmeyen âlem; iki dudağın kapanmasıyla ب ile biter.", sampleWord: "بِالْغَيْبِ", sampleMeaning: "Gayba (Bakara 3)" }
          ]
        }
      ];

      // Fisher-Yates Diziyi Karıştırma Fonksiyonu
      function shuffleArray(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
      }

      // Seçenekleri dinamik olarak her soru için güvenle karıştır (Asla doğru cevaplar alt alta denk gelmez!)
      const processedEarQuestions = rawEarQuestions.map(q => {
        return {
          ...q,
          options: shuffleArray(q.options)
        };
      });

      // İlerleme ve Skorlama Durumu
      const earTotalCount = processedEarQuestions.length;
      const earHarfCount = processedEarQuestions.filter(q => q.category === 'harf').length;
      const earKelimeCount = processedEarQuestions.filter(q => q.category === 'kelime').length;

      tabBodyHtml = `
        <div class="akademi-card ear-master-card">
          <!-- Üst Başlık & Kapsam Vitrini -->
          <div class="card-headline ear-card-headline">
            <div class="ear-intro">
              <div class="ear-badges">
                <span class="card-badge gold">8. ADIM · FONETİK AYIRT ETME ATÖLYESİ</span>
                <span class="card-badge green">${earTotalCount} KAPSAMLI ÇALIŞMA</span>
              </div>
              <h2 class="card-title">Benzer Sesli Harfleri ve Anlam Değişimlerini Ayırt Etme Antrenmanı</h2>
              <p class="card-desc">Türkçede birbirine yakın duyulan ancak Kur'an tilavetinde <strong>anlamı tamamen değiştiren (Lahn-ı Celî)</strong> harf ve kelimeleri canlı kulak talimiyle öğrenin. Her soruda hedef sesi dinleyebilir, seçenekleri birbiriyle canlı A/B karşılaştırabilirsiniz.</p>
            </div>
          </div>

          <!-- Canlı Telemetri ve İlerleme Karnesi -->
          <div class="ear-telemetry-strip">
            <div class="ear-metrics">
              <div class="ear-metric-pill">
                <span>Toplam soru</span> <strong id="earTotalLabel">${earTotalCount}</strong>
              </div>
              <div class="ear-metric-pill">
                <span>Çözülen</span> <strong class="gold" id="earAnsweredCount">0</strong> / ${earTotalCount}
              </div>
              <div class="ear-metric-pill">
                <span>Doğru</span> <strong class="green" id="earCorrectCount">0</strong>
              </div>
              <div class="ear-metric-pill">
                <span>Yanlış</span> <strong class="red" id="earWrongCount">0</strong>
              </div>
              <div class="ear-metric-pill">
                <span>Başarı</span> <strong class="gold" id="earAccuracyLabel">%0</strong>
              </div>
            </div>

            <div class="ear-session-actions">
              <button type="button" id="btnShuffleAllEarOptions" class="btn btn-outline btn-sm ear-action-shuffle" title="Tüm soruların ve şıkların yerlerini rastgele yeniden karıştır">
                <span></span> Şıkları Karıştır
              </button>
              <button type="button" id="btnResetEarSession" class="btn btn-outline btn-sm ear-action-reset" title="Karnemi ve seçimlerimi sıfırla">
                 Sıfırla
              </button>
            </div>
            <div class="ear-progress-track" role="progressbar" aria-label="Çözülen soru oranı" aria-valuemin="0" aria-valuemax="${earTotalCount}" aria-valuenow="0">
              <span id="earProgressFill"></span>
            </div>
          </div>

          <!-- Kategori Filtreleme Şeridi -->
          <div class="ear-filter-bar" role="group" aria-label="Soru kategorisine göre filtrele">
            <span class="ear-filter-label">KATEGORİ</span>
            <button type="button" class="btn-filter-pill active btn-ear-filter" data-cat="all" aria-pressed="true">
              Tümü (${earTotalCount})
            </button>
            <button type="button" class="btn-filter-pill btn-ear-filter" data-cat="harf" aria-pressed="false">
               1. Düzey: Harf Mahreçleri (${earHarfCount})
            </button>
            <button type="button" class="btn-filter-pill btn-ear-filter" data-cat="kelime" aria-pressed="false">
               2. Düzey: Kelime &amp; Anlam Değişimi (${earKelimeCount})
            </button>
          </div>

          <!-- Soru Listesi -->
          <div class="ear-questions-flow">
            ${processedEarQuestions.map(q => `
              <article class="ear-question-box" data-cat="${q.category}" data-target="${q.targetChar}" data-freq="${q.freq}" data-f0="${q.f0}" data-type="${q.soundType}" data-word="${q.sampleWord || ''}">
                <!-- Soru Başlığı & Sesi Dinle Barı -->
                <header class="ear-question-head">
                  <div class="ear-question-heading">
                    <div class="ear-question-meta">
                      <span class="badge-number">#${q.id}</span>
                      <span class="badge-cat">${q.badge}</span>
                      ${q.ayahRef ? `<span class="badge-ayah">${q.ayahRef}</span>` : ''}
                    </div>
                    <h3 class="ear-question-prompt">${q.prompt}</h3>
                  </div>
                  <button type="button" class="btn-akademi-primary btn-play-ear-q ear-audio-button" data-char="${q.targetChar}" data-freq="${q.freq}" data-f0="${q.f0}" data-type="${q.soundType}" data-word="${q.sampleWord || ''}">
                    <span></span> Soru Sesini Dinle
                  </button>
                </header>

                <!-- Şıklar Tablosu (Doğru cevaplar alt alta değil, tamamen karılmıştır!) -->
                <div class="ear-options-grid">
                  ${q.options.map(opt => `
                    <div class="ear-option-card-wrapper">
                      <button type="button" class="btn-akademi-secondary btn-ear-choice" data-char="${opt.char}" data-target="${q.targetChar}" data-desc="${opt.desc}" aria-pressed="false">
                        <span class="ear-choice-label" lang="ar">${opt.label}</span>
                        <span class="ear-choice-desc">${opt.desc}</span>
                        ${opt.sampleWord ? `
                          <span class="ear-choice-example">
                            <span>Örnek</span>
                            <strong lang="ar">${opt.sampleWord}</strong>
                            <span class="ear-choice-meaning">${opt.sampleMeaning || ''}</span>
                          </span>
                        ` : ''}
                      </button>
                      <button type="button" class="btn-play-opt-preview ear-preview-button" data-char="${opt.char}" data-word="${opt.sampleWord || ''}" aria-label="${opt.label} seçeneğinin sesini dinle" title="Bu şıkkın sesini ayrı dinle (A/B Karşılaştırması)"></button>
                    </div>
                  `).join('')}
                </div>

                <!-- Sonuç ve Zengin İlmi İzah Kartı -->
                <div class="ear-q-result" role="status" aria-live="polite"></div>

                <div class="ear-q-explanation">
                  <strong style="color:var(--accent-gold);"> Mahreç ve Mânâ Tahlili:</strong> ${q.explanation}
                </div>
              </article>
            `).join('')}
          </div>
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

    function reportElifbaAudioUnavailable(label) {
      if (typeof window.showToast === 'function') {
        window.showToast(`${label}: doğrulanmış ses kaydı mevcut değil.`);
      }
    }

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

          const curLetter = ARABIC_LETTERS[selectedLetterIdx];
          if (curLetter) reportElifbaAudioUnavailable(curLetter.name || curLetter.char || 'Harf');
        });
      });

      document.getElementById('btnPlayLetterAudio')?.addEventListener('click', () => {
        const curLetter = ARABIC_LETTERS[selectedLetterIdx];
        if (curLetter) reportElifbaAudioUnavailable(curLetter.name || curLetter.char || 'Harf');
      });
    }

    // SEKME 2 DİNLEYİCİLERİ: Yazılış tablosunda harf dinleme
    if (activeElifbaTab === 'yazilis') {
      container.querySelectorAll('.btn-listen-letter').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-idx'), 10) || 0;
          const curLetter = ARABIC_LETTERS[idx];
          if (curLetter) reportElifbaAudioUnavailable(curLetter.name || curLetter.char || 'Harf');
        });
      });
    }

    // SEKME 3 DİNLEYİCİLERİ: Hareke seçimi ve kart dinleme
    if (activeElifbaTab === 'harekeler') {
      container.querySelectorAll('.btn-hareke-mode').forEach(btn => {
        btn.addEventListener('click', () => {
          activeHarekeType = btn.getAttribute('data-type') || 'ustun';
          renderElifbaView();
        });
      });

      container.querySelectorAll('.hareke-card').forEach(card => {
        card.addEventListener('click', () => {
          const name = card.getAttribute('data-name');
          reportElifbaAudioUnavailable(name || 'Hareke');
        });
      });
    }

    // SEKME 4 DİNLEYİCİLERİ: Cezm ve Şedde kartları
    if (activeElifbaTab === 'cezm-sedde') {
      container.querySelectorAll('.cezm-card, .sedde-card, .cezm-item-card, .sedde-item-card').forEach(card => {
        card.addEventListener('click', () => {
        reportElifbaAudioUnavailable(card.getAttribute('data-sound') || 'Cezm/şedde');
        });
      });
    }

    // SEKME 5 VE 6 DİNLEYİCİLERİ: Tenvin & Med dinleme
    if (activeElifbaTab === 'tenvin' || activeElifbaTab === 'med') {
      container.querySelectorAll('.btn-play-sample').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          reportElifbaAudioUnavailable(btn.getAttribute('data-sound') || 'Tenvin/med');
        });
      });

      container.querySelectorAll('.tenvin-card, .med-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.btn-play-sample')) return;
          reportElifbaAudioUnavailable(card.querySelector('.btn-play-sample')?.getAttribute('data-sound') || 'Tenvin/med');
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

    // SEKME 8 DİNLEYİCİLERİ: Kulak Testi & Anlam Değişimi İstasyonu
    if (activeElifbaTab === 'kulak') {
      // Fonetik Arapça Mahreç Sentezleme & Vokal Akustik Motoru
      function playPhoneticAcoustics(char, soundType, filterHz, f0, word = '') {
        try {
          if (typeof window.TilavetAudioManager !== 'undefined') {
            window.TilavetAudioManager.notifyPlay('kulak-testi');
          }

          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          if (!window._akademiAudioCtx) {
            window._akademiAudioCtx = new AudioCtx();
          }
          const ctx = window._akademiAudioCtx;
          if (ctx.state === 'suspended') {
            ctx.resume();
          }

          const now = ctx.currentTime;
          const masterGain = ctx.createGain();
          masterGain.gain.setValueAtTime(0.28, now);
          masterGain.connect(ctx.destination);

          const dur = 0.75;
          const baseF0 = f0 || 220;

          if (soundType === 'fricative') {
            // Islıklı / Peltek Sürtünme ve Hava Akıntısı (Sîn, Sâd, Se, Zel, Zâ)
            const bufferSize = Math.floor(ctx.sampleRate * dur);
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * dur * 0.7));
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const bandFilter = ctx.createBiquadFilter();
            bandFilter.type = 'bandpass';
            bandFilter.frequency.setValueAtTime(filterHz || 4500, now);
            bandFilter.Q.setValueAtTime(3.5, now);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

            noise.connect(bandFilter);
            bandFilter.connect(gain);
            gain.connect(masterGain);

            noise.start(now);
            noise.stop(now + dur);
          } else if (soundType === 'plosive' || soundType === 'emphatic') {
            // Patlamalı ve Kalın Harfler (Kâf, Kef, Tâ, Dâd vb.)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = (soundType === 'emphatic') ? 'sawtooth' : 'triangle';
            osc.frequency.setValueAtTime(baseF0, now);
            osc.frequency.exponentialRampToValueAtTime(baseF0 * 0.7, now + dur);

            const formant = ctx.createBiquadFilter();
            formant.type = 'bandpass';
            formant.frequency.setValueAtTime(filterHz || 850, now);
            formant.Q.setValueAtTime(4.2, now);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.38, now + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

            osc.connect(formant);
            formant.connect(gain);
            gain.connect(masterGain);

            osc.start(now);
            osc.stop(now + dur);
          } else {
            // Boğaz ve Duru Harfler (Hâ, Ayn, Ğayn, Vâv, Râ vb.)
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = 'sine';
            osc2.type = 'triangle';
            osc1.frequency.setValueAtTime(baseF0, now);
            osc2.frequency.setValueAtTime(baseF0 * 1.5, now);

            const lowFilter = ctx.createBiquadFilter();
            lowFilter.type = 'lowpass';
            lowFilter.frequency.setValueAtTime(filterHz || 1350, now);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.32, now + 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

            osc1.connect(lowFilter);
            osc2.connect(lowFilter);
            lowFilter.connect(gain);
            gain.connect(masterGain);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + dur);
            osc2.stop(now + dur);
          }
        } catch(e) {
          console.warn('[Fonetik Sentez] Ses çalınamadı:', e);
        }
      }

      // Canlı Skor Karnesi Durumu
      let answeredQuestions = new Set();
      let correctAnswers = new Set();
      let wrongAnswers = new Set();

      function updateTelemetryUI() {
        const total = container.querySelectorAll('.ear-question-box').length;
        const answered = answeredQuestions.size;
        const correct = correctAnswers.size;
        const wrong = wrongAnswers.size;
        const acc = answered > 0 ? Math.round((correct / answered) * 100) : 0;

        const ansEl = document.getElementById('earAnsweredCount');
        const corEl = document.getElementById('earCorrectCount');
        const wrgEl = document.getElementById('earWrongCount');
        const accEl = document.getElementById('earAccuracyLabel');
        const progressEl = container.querySelector('.ear-progress-track');
        const progressFill = document.getElementById('earProgressFill');

        if (ansEl) ansEl.textContent = answered;
        if (corEl) corEl.textContent = correct;
        if (wrgEl) wrgEl.textContent = wrong;
        if (accEl) accEl.textContent = `%${acc}`;
        if (progressEl) progressEl.setAttribute('aria-valuenow', String(answered));
        if (progressFill) progressFill.style.width = `${total > 0 ? (answered / total) * 100 : 0}%`;
      }

      // Soru Sesi Dinleme Butonları (Master Target Sound)
      container.querySelectorAll('.btn-play-ear-q').forEach(btn => {
        btn.addEventListener('click', () => {
          const char = btn.getAttribute('data-char') || '';
          const soundType = btn.getAttribute('data-type') || 'voiced';
          const freq = parseFloat(btn.getAttribute('data-freq')) || 1000;
          const f0 = parseFloat(btn.getAttribute('data-f0')) || 220;
          const word = btn.getAttribute('data-word') || '';

          playPhoneticAcoustics(char, soundType, freq, f0, word);
          if (window.showToast) window.showToast(` "${char || word}" hedef sesi dinletiliyor...`);
        });
      });

      // Şık Dinleme Butonları (A/B Karşılaştırma Testi)
      container.querySelectorAll('.btn-play-opt-preview').forEach(previewBtn => {
        previewBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const char = previewBtn.getAttribute('data-char') || '';
          const word = previewBtn.getAttribute('data-word') || '';
          const parentBox = previewBtn.closest('.ear-question-box');
          const soundType = parentBox ? parentBox.getAttribute('data-type') : 'voiced';
          const freq = parentBox ? parseFloat(parentBox.getAttribute('data-freq')) : 1200;
          const f0 = parentBox ? parseFloat(parentBox.getAttribute('data-f0')) : 220;

          playPhoneticAcoustics(char, soundType, freq, f0, word);
          if (window.showToast) window.showToast(` Seçenek Sesi: "${char}" (${word || 'Mahreç'})`);
        });
      });

      // Şık Seçim Butonları (Karar Verme & İzahı Gösterme)
      container.querySelectorAll('.btn-ear-choice').forEach(choiceBtn => {
        choiceBtn.addEventListener('click', () => {
          const chosenChar = choiceBtn.getAttribute('data-char');
          const targetChar = choiceBtn.getAttribute('data-target');
          const box = choiceBtn.closest('.ear-question-box');
          const resultEl = box.querySelector('.ear-q-result');
          const expEl = box.querySelector('.ear-q-explanation');
          const qId = box.querySelector('.badge-number')?.textContent || 'q';

          // Diğer şıkları sıfırla
          box.querySelectorAll('.btn-ear-choice').forEach(c => {
            c.style.borderColor = 'rgba(255,255,255,0.1)';
            c.style.background = '';
            c.setAttribute('aria-pressed', 'false');
          });
          choiceBtn.setAttribute('aria-pressed', 'true');

          answeredQuestions.add(qId);

          if (chosenChar === targetChar) {
            correctAnswers.add(qId);
            wrongAnswers.delete(qId);

            choiceBtn.style.borderColor = 'var(--accent-green)';
            choiceBtn.style.background = 'rgba(0,230,118,0.15)';

            if (resultEl) {
              resultEl.style.display = 'block';
              resultEl.style.background = 'rgba(0,230,118,0.12)';
              resultEl.style.color = 'var(--accent-green)';
              resultEl.style.border = '1px solid rgba(0,230,118,0.3)';
              resultEl.innerHTML = `✅ <strong>Tebrikler, Doğru Teşhis!</strong> Doğru lafız: <strong>${chosenChar}</strong>. Mahreç ve sıfat özellikleri tam örtüşüyor.`;
            }
            if (expEl) expEl.style.display = 'block';
            if (window.showToast) window.showToast("Mükemmel! Doğru harfi/kelimeyi tespit ettiniz.");
          } else {
            wrongAnswers.add(qId);
            correctAnswers.delete(qId);

            choiceBtn.style.borderColor = '#ff3366';
            choiceBtn.style.background = 'rgba(255,51,102,0.15)';

            if (resultEl) {
              resultEl.style.display = 'block';
              resultEl.style.background = 'rgba(255,51,102,0.12)';
              resultEl.style.color = '#ff6b8b';
              resultEl.style.border = '1px solid rgba(255,51,102,0.3)';
              resultEl.innerHTML = `❌ <strong>Hatalı Seçim.</strong> Hedeflenen asıl lafız <strong>${targetChar}</strong> idi. Seçtiğiniz <strong>${chosenChar}</strong> lafzı mânâyı tahrif edebilir.`;
            }
            if (expEl) expEl.style.display = 'block';
            if (window.showToast) window.showToast("Yanlış seçim. Lütfen aşağıdaki mahreç tahlilini inceleyiniz.");
          }

          updateTelemetryUI();
        });
      });

      // Kategori Filtre Butonları (Tümü, Harfler, Kelimeler)
      container.querySelectorAll('.btn-ear-filter').forEach(filterBtn => {
        filterBtn.addEventListener('click', () => {
          container.querySelectorAll('.btn-ear-filter').forEach(f => f.classList.remove('active'));
          filterBtn.classList.add('active');

          const cat = filterBtn.getAttribute('data-cat') || 'all';
          container.querySelectorAll('.ear-question-box').forEach(box => {
            box.hidden = cat !== 'all' && box.getAttribute('data-cat') !== cat;
          });
          container.querySelectorAll('.btn-ear-filter').forEach(button => {
            button.setAttribute('aria-pressed', String(button === filterBtn));
          });
        });
      });

      // Tüm Soruları ve Şıkları Karıştırma Butonu (Shuffle)
      document.getElementById('btnShuffleAllEarOptions')?.addEventListener('click', () => {
        container.querySelectorAll('.ear-options-grid').forEach(grid => {
          const cards = Array.from(grid.children);
          for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            grid.appendChild(cards[j]);
          }
        });
        if (window.showToast) window.showToast(" Tüm seçenekler ve şıklar rastgele karıştırıldı!");
      });

      // Sıfırlama Butonu
      document.getElementById('btnResetEarSession')?.addEventListener('click', () => {
        answeredQuestions.clear();
        correctAnswers.clear();
        wrongAnswers.clear();
        updateTelemetryUI();

        container.querySelectorAll('.btn-ear-choice').forEach(c => {
          c.style.borderColor = 'rgba(255,255,255,0.1)';
          c.style.background = '';
          c.setAttribute('aria-pressed', 'false');
        });
        container.querySelectorAll('.ear-q-result, .ear-q-explanation').forEach(el => {
          el.style.display = 'none';
        });
        if (window.showToast) window.showToast(" Antrenman karneniz sıfırlandı.");
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
      meal: "Hiçbir şey O'na denk ve benzer değildir."
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
      meal: "Ebû Leheb'in iki eli kurusun; kurudu da!"
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
      meal: "İşte onlar, Rablerinden gelen bir hidayet üzeredirler..."
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
      meal: "Onlar sağırdırlar, dilsizdirler, kördürler; artık geri dönemezler."
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
      meal: "Sana indirilene ve senden önce indirilenlere iman ederler..."
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
      meal: "Onların üzerine pişirilmiş çamurdan taşlar atıyorlardı."
    },
    "idgam-misleyn-mim": {
      id: "idgam-misleyn-mim",
      surah: 2,
      ayah: 25,
      surahName: "Bakara",
      surahArabic: "سُورَةُ البَقَرَةِ",
      juz: 1,
      page: 4,
      ruleName: "İdğâm-ı Misl-i Maalgunne",
      ruleFamily: "ihfa",
      targetWord: "لَهُمْ مَا",
      html: `وَبَشِّرِ ٱلَّذِينَ ءَامَنُوا۟ ... <span class="tajweed-highlight-target"><span class="tj-ihfa">لَهُم مَّا</span></span> يَشَآءُونَ <span class="flower-medallion">۝٢٥</span>`,
      ruleExplanation: "Sâkin Mîm'den sonra harekeli Mîm gelmiştir. İki mîm birbirine katılarak 1.5 elif gunne tutulur.",
      meal: "İman edip salih ameller işleyenlere müjdele..."
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
      meal: "Gazaba uğramışların ve sapmışların yoluna değil!"
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
      meal: "Onlar: 'Biz ancak ıslah edicileriz' derler."
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
      meal: "Allah'ın yardımı ve fetih geldiği zaman..."
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
      meal: "Şüphesiz biz sana Kevser'i verdik."
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
      meal: "...ve sapmışların yoluna değil!"
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
      meal: "Rahmân ve Rahîm olan Allah'ın adıyla."
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
      meal: "Kureyş'in güven ve uzlaşması için..."
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
      meal: "De ki: O Allah tektir."
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
      meal: "Hamd, âlemlerin Rabbi olan Allah'a mahsustur."
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
      meal: "Güneşe ve onun aydınlığına andolsun."
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
      meal: "Rabbini hamd ile tesbih et; şüphesiz O, tevbeleri kabul edendir."
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
      meal: "Bu, kendisinde şüphe olmayan kitaptır; muttakiler için yol göstericidir."
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
          <span class="mini-mushaf-icon"></span>
          <div>
            <div class="mini-mushaf-title" id="miniMushafHeaderTitle">Kayan Mushaf &amp; Tecvid Takip Ekranı</div>
            <div class="mini-mushaf-sub" id="miniMushafSubtitle">⋮⋮ Buradan tutarak sürükleyebilirsiniz</div>
          </div>
        </div>
        <div class="mini-mushaf-controls">
          <button type="button" class="mini-mushaf-btn" id="btnMiniMushafTajweedToggle" title="Tecvid Renklerini Aç/Kapat ()"></button>
          <button type="button" class="mini-mushaf-btn" id="btnMiniMushafFontDec" title="Yazıyı Küçült (A-)">A−</button>
          <button type="button" class="mini-mushaf-btn" id="btnMiniMushafFontInc" title="Yazıyı Büyüt (A+)">A+</button>
          <button type="button" class="mini-mushaf-btn" id="btnMiniMushafExpand" title="Pencereyi Tam Genişlet / Varsayılan Boyuta Dön (⛶)">⛶</button>
          <button type="button" class="mini-mushaf-btn" id="btnMiniMushafReset" title="Varsayılan Boyut ve Sağ Üst Konuma Sıfırla (↺)">↺</button>
          <button type="button" class="mini-mushaf-btn" id="btnMiniMushafMin" title="Küçült / Genişlet">−</button>
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
                <span></span> <span id="miniMushafRuleTitle">İzhâr (Nûn-ı Sâkin &amp; Tenvin)</span>
              </div>
              <div class="mini-mushaf-latin-actions">
                <span class="mini-latin-label"> Meâl:</span>
                <button type="button" class="mini-latin-btn" id="btnMiniLatinDec" title="Latin meâl ve açıklamayı küçült (A-)">A−</button>
                <button type="button" class="mini-latin-btn" id="btnMiniLatinInc" title="Latin meâl ve açıklamayı büyüt (A+)">A+</button>
                <button type="button" class="mini-latin-btn" id="btnMiniLatinExpand" title="Meâl alanını genişlet / daralt (↕)">↕</button>
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
            <div class="mini-mushaf-meal-resizer" id="miniMushafMealResizer" title="Meâl alanını aşağı doğru çekerek büyütün">⋯</div>
          </div>

          <div class="mini-mushaf-legend">
            <span class="legend-dot dot-madd" data-rule="tj-madd" title="Medd-i Muttasıl, Munfasıl ve Lâzım"> Medd</span>
            <span class="legend-dot dot-ihfa" data-rule="tj-ihfa" title="İhfâ: 1.5 - 2 Elif"> İhfâ</span>
            <span class="legend-dot dot-kalkale" data-rule="tj-kalkale" title="Kalkale: Kutbu Cedin"> Kalkale</span>
            <span class="legend-dot dot-iklab" data-rule="tj-iklab" title="İklâb: B Harfine Dönüşüm"> İklâb</span>
            <span class="legend-dot" data-rule="tj-idgam" style="color:#26a69a;" title="Gunneli İdgam"> İdgam</span>
            <span class="legend-dot" data-rule="tj-kalin" style="color:#ffb300;" title="Kalın Harfler ve Ra"> Kalın/Ra</span>
          </div>

          <div class="mini-mushaf-audio-bar">
            <button type="button" class="mini-audio-play-btn" id="btnMiniMushafPlay">
              <span id="miniPlayIcon">▶</span>
              <span id="miniPlayText">Örneği Dinle</span>
            </button>
            <div class="mini-audio-status" id="miniAudioStatus">Hazır</div>
            <button type="button" class="mini-action-btn" id="btnMiniMushafMetronome" title="Bu kıraat hızının metronom ritmini başlat">
              <span>⏱</span> Metronom
            </button>
            <button type="button" class="mini-action-btn" id="btnMiniMushafFullView" title="15 Satırlık Tam Sayfa Mushaf'a Git">
              <span></span> Tam Mushaf
            </button>
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
        widget.style.left = `${Math.max(10, Math.min(maxL, savedPos.left))}px`;
        widget.style.top = `${Math.max(10, Math.min(maxT, savedPos.top))}px`;
        widget.style.right = 'auto';
        widget.style.bottom = 'auto';
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

      widget.style.left = `${newLeft}px`;
      widget.style.top = `${newTop}px`;
      widget.style.right = 'auto';
      widget.style.bottom = 'auto';
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
      widget.style.left = 'auto';
      widget.style.right = '28px';
      widget.style.top = '110px';
      widget.style.bottom = 'auto';
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

    // 6. Mini Oynatıcı Dinleyicisi
    document.getElementById('btnMiniMushafPlay')?.addEventListener('click', () => {
      if (!activeMiniMushafRule) return;
      if (isMiniMushafPlaying) {
        stopMiniMushafAudio();
      } else {
        playMiniMushafRuleAudio(activeMiniMushafRule);
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
      if (statusText) statusText.textContent = 'Tilavet Dinleniyor...';
      arabicCont?.classList.add('tajweed-live-reading');
    } else {
      playBtn?.classList.remove('is-playing');
      if (playIcon) playIcon.textContent = '▶';
      if (playText) playText.textContent = 'Örneği Dinle';
      if (statusText) statusText.textContent = activeMiniMushafRule?.reciter ? `Kâri: ${activeMiniMushafRule.reciter}` : 'Hazır';
      arabicCont?.classList.remove('tajweed-live-reading');
    }
  }

  function playMiniMushafRuleAudio(ruleData) {
    if (isMiniMushafPlaying) {
      stopMiniMushafAudio();
      return;
    }

    stopMiniMushafAudio();

    if (typeof window.TilavetAudioManager !== 'undefined') {
      window.TilavetAudioManager.notifyPlay('teknik');
    }

    const surah = ruleData.surah || 1;
    const startAyah = ruleData.ayah || 1;
    const endAyah = ruleData.endAyah || startAyah;
    const reciterKey = ruleData.reciterKey || 'husary';

    currentMiniMushafChainItem = {
      surah,
      startAyah,
      endAyah,
      currentAyah: startAyah,
      reciterKey,
      ruleData
    };

    function playCurrentChainedAyah() {
      if (!currentMiniMushafChainItem) return;
      const { surah, currentAyah, endAyah, reciterKey } = currentMiniMushafChainItem;
      const targetUrl = getEveryAyahAudioUrl(surah, currentAyah, reciterKey);

      if (miniMushafChainedAudio) {
        try { miniMushafChainedAudio.pause(); miniMushafChainedAudio.src = ''; } catch (_) {}
      }

      miniMushafChainedAudio = new Audio(targetUrl);
      setMiniMushafPlayState(true);

      const statusText = document.getElementById('miniAudioStatus');
      if (statusText) {
        const ayahPart = endAyah > startAyah ? ` [${currentAyah}/${endAyah}. Âyet]` : '';
        statusText.textContent = `Çalıyor: ${currentAyah}. Âyet${ayahPart}`;
      }

      miniMushafChainedAudio.onended = () => {
        if (currentMiniMushafChainItem && currentMiniMushafChainItem.currentAyah < currentMiniMushafChainItem.endAyah) {
          currentMiniMushafChainItem.currentAyah++;
          playCurrentChainedAyah();
        } else {
          stopMiniMushafAudio();
          if (window.showToast) window.showToast("Örnek tilavet tamamlandı.");
        }
      };

      miniMushafChainedAudio.onerror = () => {
        console.warn('Mini Mushaf ses yükleme hatası:', targetUrl);
        if (currentMiniMushafChainItem && currentMiniMushafChainItem.currentAyah < currentMiniMushafChainItem.endAyah) {
          currentMiniMushafChainItem.currentAyah++;
          playCurrentChainedAyah();
        } else {
          stopMiniMushafAudio();
          if (window.showToast) window.showToast(`⚠ Ses dosyasına ulaşılamadı (${surah}:${currentAyah}).`);
        }
      };

      miniMushafChainedAudio.play().catch(e => {
        console.warn('Mini Mushaf ses çalma hatası:', e);
        stopMiniMushafAudio();
      });
    }

    playCurrentChainedAyah();
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
        if (window.showToast) window.showToast(`▶ ${name} tilaveti dinleniyor...`);
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
          if (window.showToast) window.showToast(` ${name} kuralı sağdaki küçük Mushaf sayfasında açıldı.`);
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
            <span>⏱</span> 4 Kıraat Hızı &amp; Metronom
          </button>
          <button type="button" class="btn-teknik-sub ${activeTeknikTab === 'secavend' ? 'active' : ''}" data-teknik-tab="secavend">
            <span></span> Vakıf &amp; Secavend Atlası
          </button>
          <button type="button" class="btn-teknik-sub ${activeTeknikTab === 'lahn' ? 'active' : ''}" data-teknik-tab="lahn">
            <span>⚠</span> Lahn Atlası (Hatalar)
          </button>
          <button type="button" class="btn-teknik-sub ${activeTeknikTab === 'vasl' ? 'active' : ''}" data-teknik-tab="vasl">
            <span></span> İbtidâ &amp; Vasl
          </button>
          <button type="button" class="btn-teknik-sub ${activeTeknikTab === 'ozel' ? 'active' : ''}" data-teknik-tab="ozel">
            <span></span> Sekte &amp; Özel Kelimeler
          </button>
          <button type="button" class="btn-teknik-sub ${activeTeknikTab === 'pratik' ? 'active' : ''}" data-teknik-tab="pratik">
            <span></span> Kendini Sına (Pratik)
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

      return `
        <div class="tempos-card">
          <div class="card-headline" style="display:flex; flex-direction:column; gap:0.6rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.75rem;">
              <div>
                <span class="card-badge gold">MERÂTİBÜ'L-KIRÂA</span>
                <h2 class="card-title" style="margin-top:0.35rem;">4 Farklı Tilavet Hızı &amp; İnteraktif Metronom İstasyonu</h2>
              </div>
              <button type="button" id="btnToggleFloatingMushaf" class="btn-teknik-action btn-inspect" style="background:rgba(229,184,105,0.15); border:1px solid var(--accent-gold); color:var(--accent-gold); font-size:0.85rem; padding:0.45rem 0.9rem; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:0.4rem; white-space:nowrap;">
                <span></span> <span id="btnToggleFloatingMushafLabel">Kayan Tecvidli Mushaf Ekranı</span>
              </button>
            </div>
            <p class="card-desc">Kur'an tilavetinde harf hakları, mahreçler ve tecvid ölçüleri hız değiştikçe yok olmaz; dinamik çarpanlarla orantılı olarak korunur. Aşağıda her mertebede <strong>4 farklı doğrulanmış tilavet örneğini</strong> (toplam 16 örnek) dinleyebilir, metronom eşliğinde takip edebilir ve serbestçe sürüklenebilir <strong>Kayan Küçük Mushaf</strong> penceresinde tecvid renkleriyle inceleyebilirsiniz:</p>
          </div>

          <div class="tempo-switcher-row">
            ${tempolarList.map(t => {
              const exList = (t.examples && t.examples.length > 0) ? t.examples : [
                {
                  id: `${t.id}-0`,
                  title: t.sampleAyahName || "Örnek Tilavet",
                  surah: t.sampleSurah || 1,
                  ayah: t.sampleAyah || 1,
                  endAyah: t.sampleAyah || 1,
                  surahName: t.sampleSurahName || "Fâtiha",
                  ayahName: t.sampleAyahName || "1. Âyet",
                  reciter: t.idealReciter,
                  reciterKey: t.reciterKey,
                  bpm: t.bpm,
                  textAr: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
                  mealTr: "Rahman ve Rahim olan Allah'ın adıyla.",
                  tajweedHighlights: ["Medd ve Gunne Ölçüleri"],
                  speedNote: t.desc
                }
              ];
              const curIdx = (tempoActiveExIdx[t.id] !== undefined && tempoActiveExIdx[t.id] < exList.length) ? tempoActiveExIdx[t.id] : 0;
              const curEx = exList[curIdx] || exList[0];
              const exampleLabel = (example) => {
                if (typeof example?.title === 'string' && example.title.trim()) return example.title.trim();
                if (typeof example?.ayahName === 'string' && example.ayahName.trim()) return example.ayahName.trim();
                return 'Örnek tilavet';
              };
              const highlightLabel = (highlight) => {
                if (typeof highlight === 'string' && highlight.trim()) return highlight.trim();
                if (typeof highlight?.label === 'string' && highlight.label.trim()) return highlight.label.trim();
                return 'Tecvid vurgusu';
              };
              const surahLabel = ((typeof curEx.surahName === 'string' && curEx.surahName.trim())
                || (typeof t.sampleSurahName === 'string' && t.sampleSurahName.trim())
                || 'Örnek sûre').replace(/\s+Sûresi$/i, '');
              const isMultiAyah = curEx.endAyah && curEx.endAyah > curEx.ayah;
              const ayahRangeStr = isMultiAyah ? `${curEx.ayah}-${curEx.endAyah}. Âyetler` : `${curEx.ayah}. Âyet`;

              return `
                <div class="tempo-card-rich ${t.id}">
                  <div class="tempo-card-header">
                    <div class="tempo-title-group">
                      <span class="tempo-badge ${t.id === 'tahkik' ? 'gold' : t.id === 'tertil' ? 'emerald' : t.id === 'tedvir' ? 'cyan' : 'amber'}">${t.speed}</span>
                      <h3>${t.name}</h3>
                    </div>
                  </div>

                  <p class="tempo-p">${t.desc}</p>

                  <div class="tempo-meta-box">
                    <div>⏱ <strong>Metronom:</strong> ${t.bpmRange} (Referans: ${curEx.bpm || t.bpm} BPM)</div>
                    <div> <strong>Hız Çarpanı:</strong> ${t.multiplier}</div>
                    <div> <strong>Temsilci Kâri:</strong> ${curEx.reciter || t.idealReciter} ${curEx.reciterTitle ? `<span style="font-size:0.75rem; color:#94a3b8;">(${curEx.reciterTitle})</span>` : ''}</div>
                    <div style="font-size:0.75rem; color:#cbd5e1; margin-top:0.2rem;"> <em>${t.meddRules}</em></div>
                    ${curEx.speedNote ? `<div style="font-size:0.77rem; color:#fde68a; margin-top:0.35rem; line-height:1.45;"> <strong>İcra Notu:</strong> ${curEx.speedNote}</div>` : ''}
                  </div>

                  <!-- 4 Doğrulanmış Örnek İcra Seçici Butonları -->
                  <div class="tempo-example-selector-strip">
                    <span style="font-size:0.72rem; color:var(--accent-gold); font-weight:700; width:100%; display:block; margin-bottom:0.15rem;"> 4 Doğrulanmış Tilavet İcrası:</span>
                    ${exList.map((ex, idx) => `
                      <button type="button" class="tempo-ex-chip ${idx === curIdx ? 'active' : ''}" data-tempo-id="${t.id}" data-ex-idx="${idx}" title="${exampleLabel(ex)} (${ex.bpm} BPM)">
                        <span>${idx + 1}.</span> ${exampleLabel(ex)}
                      </button>
                    `).join('')}
                  </div>

                  <!-- Seçili Âyetin Önizlemesi & Tecvid Vurguları -->
                  <div class="tempo-sample-ayah-box">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
                      <span class="ayah-ref-tag"> AKTİF ÖRNEK: ${exampleLabel(curEx)}</span>
                      <span style="font-size:0.74rem; font-weight:700; color:var(--accent-gold);">${curEx.bpm || t.bpm} BPM</span>
                    </div>
                    <div style="font-size:0.84rem; font-weight:700; color:#fff; margin-bottom:0.35rem;">${surahLabel} Sûresi · ${ayahRangeStr}</div>
                    <div class="tempo-arabic-preview" style="font-size:0.95rem; font-family:'Amiri Quran', serif; direction:rtl; text-align:right; color:#f8fafc; line-height:2.0; max-height:90px; overflow-y:auto; padding:0.4rem 0.6rem; background:rgba(0,0,0,0.3); border-radius:6px; border:1px solid rgba(229,184,105,0.15);">
                      ${curEx.textAr}
                    </div>
                    ${curEx.tajweedHighlights && curEx.tajweedHighlights.length > 0 ? `
                      <div style="display:flex; flex-wrap:wrap; gap:0.25rem; margin-top:0.4rem;">
                        ${curEx.tajweedHighlights.map(th => `<span style="font-size:0.7rem; background:rgba(229,184,105,0.12); color:#fef3c7; border:1px solid rgba(229,184,105,0.25); padding:0.1rem 0.4rem; border-radius:4px;">${highlightLabel(th)}</span>`).join('')}
                      </div>
                    ` : ''}
                  </div>

                  <!-- Aksiyon Butonları -->
                  <div class="tempo-actions-row">
                    <button type="button" class="btn-teknik-action btn-metronome btn-play-tempo-metronome" data-bpm="${curEx.bpm || t.bpm}" data-name="${t.name}">
                      <span>⏱</span> Ritmi Dinle (${curEx.bpm || t.bpm} BPM)
                    </button>
                    <button type="button" class="btn-teknik-action btn-audio btn-play-sample-audio" data-tempo-id="${t.id}" data-ex-idx="${curIdx}" data-surah="${curEx.surah || t.sampleSurah}" data-ayah="${curEx.ayah || t.sampleAyah}" data-end-ayah="${curEx.endAyah || curEx.ayah || t.sampleAyah}" data-reciter="${curEx.reciterKey || t.reciterKey}" data-title="${t.name} (${exampleLabel(curEx)})">
                      <span>▶</span> Örnek Dinle
                    </button>
                    <button type="button" class="btn-teknik-action btn-inspect btn-open-mini-mushaf" data-tempo-id="${t.id}" data-ex-idx="${curIdx}" title="Sürüklenebilir Kayan Mushaf'ta tecvid kurallarıyla incele">
                      <span></span> Tecvidle Takip
                    </button>
                    <button type="button" class="btn-teknik-action btn-goto-secavend-ayah" data-surah="${curEx.surah || t.sampleSurah}" data-ayah="${curEx.ayah || t.sampleAyah}" title="Tam Mushaf'ta bu ayeti aç">
                      <span></span> Mushaf
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Medd ve Hız Karşılaştırma Matrisi -->
          <div class="tempo-matrix-table-wrap">
            <div style="padding:0.75rem 1rem; border-bottom:1px solid rgba(229,184,105,0.15); display:flex; justify-content:space-between; align-items:center;">
              <strong style="color:var(--accent-gold); font-size:0.92rem;"> Hız Mertebelerine Göre Medd ve Gunne Ölçüleri Tablosu</strong>
              <span style="font-size:0.75rem; color:#94a3b8;">1 Elif Miktarı ≈ 1 Parmak Kaldırma / İndirme Süresi</span>
            </div>
            <table class="tempo-matrix-table">
              <thead>
                <tr>
                  <th>Tilavet Hızı</th>
                  <th>Ortalama BPM</th>
                  <th>Medd-i Tabiî</th>
                  <th>Medd-i Muttasıl</th>
                  <th>Medd-i Munfasıl</th>
                  <th>Medd-i Lâzım</th>
                  <th>Gunne / İhfâ</th>
                  <th>Başlıca İcra Alanı</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong style="color:var(--accent-gold);">Tahkîk</strong></td>
                  <td>55 - 70</td>
                  <td>1 Elif</td>
                  <td>4 - 5 Elif</td>
                  <td>4 - 5 Elif</td>
                  <td>4 - 6 Elif</td>
                  <td>1.5 - 2 Elif</td>
                  <td>Fem-i Muhsin Meşki &amp; Talebe Talimi</td>
                </tr>
                <tr>
                  <td><strong style="color:#34d399;">Tertîl</strong></td>
                  <td>75 - 95</td>
                  <td>1 Elif</td>
                  <td>4 Elif</td>
                  <td>4 Elif</td>
                  <td>4 Elif</td>
                  <td>1.5 Elif</td>
                  <td>Huşû, Tefekkür &amp; Gece Tilaveti</td>
                </tr>
                <tr>
                  <td><strong style="color:#67e8f9;">Tedvîr</strong></td>
                  <td>100 - 120</td>
                  <td>1 Elif</td>
                  <td>3 - 4 Elif</td>
                  <td>2 - 3 Elif</td>
                  <td>4 Elif</td>
                  <td>1.5 Elif</td>
                  <td>Cemaatle Cehrî Farz Namazlar</td>
                </tr>
                <tr>
                  <td><strong style="color:#fcd34d;">Hadr</strong></td>
                  <td>130 - 155</td>
                  <td>1 Elif</td>
                  <td>2 - 3 Elif</td>
                  <td>1 - 2 Elif</td>
                  <td>4 Elif</td>
                  <td>Net / Seri</td>
                  <td>Mukabele, Hatim &amp; Teravih</td>
                </tr>
              </tbody>
            </table>
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
      const turlerList = VAKIF_TURLERI;

      // Filtreleme mantığı
      let displayItems = [];
      if (activeSecavendSub === 'all') {
        displayItems = [...classicalList, ...medineList];
      } else if (activeSecavendSub === 'secavend') {
        displayItems = classicalList;
      } else if (activeSecavendSub === 'medine') {
        displayItems = medineList;
      }

      return `
        <div class="tempos-card">
          <div class="card-headline">
            <span class="card-badge gold">DURAK &amp; VAKIF İLİMLERİ</span>
            <h2 class="card-title">Vakıf, İbtidâ ve Secavend İşaretleri Atlası</h2>
            <p class="card-desc">İmam Muhammed b. Tayfur es-Secâvendî'nin tespit ettiği 8 temel işaret ile Medine Mushafı ve Diyanet baskılarında geçerli uluslararası vakıf rumuzları:</p>
          </div>

          <!-- Alt Filtre Butonları -->
          <div class="secavend-filter-bar">
            <button type="button" class="secavend-filter-chip ${activeSecavendSub === 'all' ? 'active' : ''}" data-secavend-filter="all">
              Tümü (${classicalList.length + medineList.length})
            </button>
            <button type="button" class="secavend-filter-chip ${activeSecavendSub === 'secavend' ? 'active' : ''}" data-secavend-filter="secavend">
              Klasik Secavend (${classicalList.length})
            </button>
            <button type="button" class="secavend-filter-chip ${activeSecavendSub === 'medine' ? 'active' : ''}" data-secavend-filter="medine">
              Medine Mushafı Standartları (${medineList.length})
            </button>
            <button type="button" class="secavend-filter-chip ${activeSecavendSub === 'turler' ? 'active' : ''}" data-secavend-filter="turler">
              6 Temel Vakıf Türü (${turlerList.length})
            </button>
          </div>

          ${activeSecavendSub === 'turler' ? `
            <!-- 6 Temel Vakıf Türü Görünümü -->
            <div class="secavend-grid-wrap">
              ${turlerList.map(v => `
                <div class="secavend-item-card" style="border-top:4px solid var(--${v.color === 'gold' ? 'accent-gold' : v.color === 'alert' ? 'accent-crimson' : 'accent-cyan'});">
                  <div class="secavend-item-header">
                    <span class="secavend-hukum-badge ${v.color}" style="font-size:0.78rem;">${v.degree}</span>
                  </div>
                  <h3 class="secavend-item-name" style="font-size:1.15rem; color:#fff;">${v.name}</h3>
                  <p style="font-size:0.85rem; color:#cbd5e1; margin:0; line-height:1.5;">${v.desc}</p>
                  
                  <div class="secavend-arabic-box">
                    <div class="secavend-ar-text">${v.sampleAr}</div>
                    <div class="secavend-lt-text">${v.sampleLatin}</div>
                  </div>

                  <div class="secavend-explanation-box">
                    <strong>Hüküm:</strong> ${v.hukum}<br/>
                    <span style="color:#94a3b8; font-size:0.75rem;"> <em>${v.note}</em></span>
                  </div>

                  <div class="tempo-actions-row">
                    <button type="button" class="btn-teknik-action btn-audio btn-play-sample-audio" data-surah="${v.surah}" data-ayah="${v.ayah}" data-reciter="husary" data-title="${v.name} Örneği">
                      <span>▶</span> Dinle (${v.surah}:${v.ayah})
                    </button>
                    <button type="button" class="btn-teknik-action btn-goto-secavend-ayah" data-surah="${v.surah}" data-ayah="${v.ayah}">
                      <span></span> Mushaf'ta Gör
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <!-- Durak İşaretleri Grid Görünümü -->
            <div class="secavend-grid-wrap">
              ${displayItems.map(s => `
                <div class="secavend-item-card">
                  <div class="secavend-item-header">
                    <span class="secavend-symbol-badge">${s.symbol}</span>
                    <span class="secavend-hukum-badge ${s.symbol === 'م' || s.symbol === 'لا' ? 'alert' : s.symbol === 'قلى' ? 'gold' : 'cyan'}">${s.hukum}</span>
                  </div>
                  <h3 class="secavend-item-name">${s.name}</h3>
                  <p style="font-size:0.84rem; color:#a0aec0; margin:0; line-height:1.5;">${s.desc}</p>

                  <div class="secavend-arabic-box">
                    <div class="secavend-ar-text">${s.sampleAr}</div>
                    <div class="secavend-lt-text">${s.sampleLatin}</div>
                  </div>

                  <div class="secavend-explanation-box">
                     <strong>İlmi İzah:</strong> ${s.explanation}
                  </div>

                  <div class="tempo-actions-row">
                    <button type="button" class="btn-teknik-action btn-audio btn-play-sample-audio" data-surah="${s.surah}" data-ayah="${s.ayah}" data-reciter="husary" data-title="${s.name} Âyeti">
                      <span>▶</span> Âyeti Dinle
                    </button>
                    <button type="button" class="btn-teknik-action btn-goto-secavend-ayah" data-surah="${s.surah}" data-ayah="${s.ayah}">
                      <span></span> Mushaf'ta Aç ➔
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
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
      const vaslList = [
        ...IBTIDA_VASL,
        {
          id: "vasl-fiillerde",
          title: "Fiillerde Hemze-i Vaslın Harekeleri (3. Harf Kuralı)",
          desc: "Fiil-i emirlerin başında gelen vasıl hemzesiyle BAŞLARKEN harekesi fiilin 3. harfine göre tespit edilir.",
          sampleAr: "ٱدْعُ إِلَىٰ سَبِيلِ رَبِّكَ ۝ ٱضْرِب بِّعَصَاكَ",
          sampleLatin: "3. Harf Ötre ise: 'Ud'u' · 3. Harf Üstün/Esre ise: 'İdrib', 'İzheb'",
          rule: "3. harf ötreli ise ötre ile; 3. harf üstün veya esreli ise daima ESRE ile başlanır (Asla üstün ile başlanmaz).",
          surah: 16,
          ayah: 125
        },
        {
          id: "vasl-semai-isimler",
          title: "Semâî 7 İsimde Hemze-i Vasl",
          desc: "Kur'an'da geçen 7 semâî isim kelime başında vasıl hemzesi taşır ve başlarken daima esrelenir.",
          sampleAr: "ٱبْنُ مَرْيَمَ ۝ ٱسْمُ رَبِّكَ ۝ ٱمْرَأَتَ عِمْرَانَ",
          sampleLatin: "İbnu Meryem · İsmu Rabbike · İmra'ete 'İmrân",
          rule: "İbn, İbneh, İsm, İmru', İmra'eh, İsnân, İsnetân kelimeleriyle başlarken daima ESRE harekesi verilir.",
          surah: 3,
          ayah: 45
        },
        {
          id: "vasl-iltika-sakin",
          title: "İltikâ-i Sâkineyn (İki Sâkinin Karşılaşması)",
          desc: "Arapçada yan yana iki sâkin (cezimli) harf gelmesi caiz olmadığından, vasıl halinde ilk harf harekelenir.",
          sampleAr: "قَالَتِ ٱخْرُجْ ۝ قُلِ ٱدْعُوا",
          sampleLatin: "Kâlet-uhruc değil -> 'Kâletihruc' · Kul-ud'û değil -> 'Kulid'û'",
          rule: "Genellikle cezimli harf arızî bir esre ile harekelenerek vasıl hemzesine bağlanır.",
          surah: 12,
          ayah: 31
        },
        {
          id: "vasl-ituni",
          title: "İstisnai Bedelle Başlama ('İ'tûnî' -> 'Îtûnî')",
          desc: "Hemze-i vasldan sonra gelen cezimli hemze, tek başına başlanırken med harfine çevrilir.",
          sampleAr: "ٱئْتُونِي بِكِتَابٍ ۝ ٱلَّذِي ٱؤْتُمِنَ",
          sampleLatin: "Geçerken: '...es-semâvât-i'tûnî' · Başlarken: 'Îtûnî' · Başlarken: 'Û'tümine'",
          rule: "Yan yana gelen iki hemzenin ikincisi, birinci hemzenin harekesine uygun bir medd harfine dönüşür (İbadet ve tilavet güzelliği).",
          surah: 46,
          ayah: 4
        }
      ];

      return `
        <div class="tempos-card">
          <div class="card-headline">
            <span class="card-badge gold">BAĞLANTI &amp; BAŞLAMA İLKELERİ</span>
            <h2 class="card-title">İbtidâ (Başlama) ve Vasl (Geçiş) Kaideleri</h2>
            <p class="card-desc">Kelimeleri birbirine vaslederken (bağlarken) veya yeni bir cümleye ibtidâ ederken (başlarken) düşen, sabit kalan veya ortaya çıkan seslerin ilmi kuralları:</p>
          </div>

          <div class="vasl-list-wrap">
            ${vaslList.map(v => `
              <div class="vasl-card-item">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                  <h3 style="font-size:1.15rem; color:#fff; margin:0;">${v.title}</h3>
                  <span class="card-badge gold" style="font-size:0.75rem;">${v.id}</span>
                </div>
                <p style="font-size:0.86rem; color:#a0aec0; margin:0; line-height:1.5;">${v.desc}</p>

                <div class="secavend-arabic-box">
                  <div class="secavend-ar-text">${v.sampleAr}</div>
                  <div class="secavend-lt-text">${v.sampleLatin}</div>
                </div>

                <div class="secavend-explanation-box">
                   <strong>Uygulama Kuralı:</strong> ${v.rule}
                </div>

                ${v.surah ? `
                  <div class="tempo-actions-row">
                    <button type="button" class="btn-teknik-action btn-audio btn-play-sample-audio" data-surah="${v.surah}" data-ayah="${v.ayah || 1}" data-reciter="husary" data-title="${v.title}">
                      <span>▶</span> Örnek Tilaveti Dinle
                    </button>
                    <button type="button" class="btn-teknik-action btn-goto-secavend-ayah" data-surah="${v.surah}" data-ayah="${v.ayah || 1}">
                      <span></span> Mushaf'ta Aç
                    </button>
                  </div>
                ` : ''}
              </div>
            `).join('')}
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

    container.innerHTML = `
      <div class="makam-layout-wrap">
        <section class="makam-learning-guide" aria-label="Makam Okulu nasıl kullanılır">
          <div>
            <strong>Makamları karşılaştırarak öğren</strong>
            <p>Bir makam seç, farklı kârilerin örneklerini dinle; dizi ve seyir notlarını incele, ardından geçki kartından ilişkili makama ilerle.</p>
            <p class="makam-example-review-note">Ses bağlantıları ve ayet aralıkları kontrol edilmiştir. Kayıtların makam aidiyeti, uzman dinlemesiyle ayrıca teyit edilene kadar kesin sınıflandırma sayılmamalıdır.</p>
          </div>
          <ol>
            <li><span>1</span> Makamı seç</li>
            <li><span>2</span> Hocaları karşılaştır</li>
            <li><span>3</span> Geçkiyi takip et</li>
          </ol>
        </section>

        <!-- Makam Seçim Kartları Şeridi -->
        <div class="makam-selector-strip" role="group" aria-label="10 Klasik Makam">
          ${MAKAMLAR.map(m => `
            <button type="button" class="makam-chip ${m.id === currentMakam.id ? 'active' : ''}" data-makam="${m.id}" aria-pressed="${m.id === currentMakam.id}" aria-controls="makamDetail-${m.id}">
              <span class="makam-name-tr">${m.names.tr}</span>
              <span class="makam-name-ar" lang="ar">${m.names.ar}</span>
            </button>
          `).join('')}
        </div>

        <!-- Seçili Makam Detay İstasyonu -->
        <div class="akademi-card makam-station-card" id="makamDetail-${currentMakam.id}">
          <div class="makam-header-row">
            <div class="makam-header-main">
              <div class="makam-header-copy">
                <div class="badge-row">
                  <span class="card-badge gold">MAKAM NAZARİYATI &amp; DİNLEME</span>
                  <span class="card-badge cyan">10 MAKAM • ${totalExampleCount} SES ÖRNEĞİ</span>
                  ${currentMakam.ezanGelenegi?.metin || currentMakam.ezanVakti ? `<span class="card-badge purple"> ${(currentMakam.ezanGelenegi?.metin || currentMakam.ezanVakti).split('(')[0].trim()}</span>` : ''}
                </div>
                <h2 class="makam-headline">${currentMakam.names.tr} Makamı — <span lang="ar">${currentMakam.names.ar}</span></h2>
                <div class="makam-tags">
                  ${(currentMakam.tags || currentMakam.characterTags || []).map(t => `<span class="tag-pill">${t}</span>`).join('')}
                  <span class="tag-pill cyan">Seyir: ${{ cikici: 'Çıkıcı', 'inici-cikici': 'İnici-Çıkıcı' }[currentMakam.seyir] || currentMakam.seyir}</span>
                  <span class="tag-pill gold">Karar: ${kararName}</span>
                  <span class="tag-pill green">Güçlü: ${gucluName}</span>
                </div>
              </div>

              <!-- Drone (Karar Sesi) Kontrol Kutusu -->
              <div class="drone-control-box">
                <div class="drone-title">KARAR REFERANS DRONE (TANBUR / NEY)</div>
                <div class="drone-freq-info">${kararName} (${kararHz.toFixed(1)} Hz)</div>
                <button type="button" class="btn-drone-toggle" id="btnToggleDrone">
                  <span class="drone-icon"></span>
                  <span id="droneBtnText">Drone Başlat</span>
                </button>
              </div>
            </div>

            <section class="makam-validation-panel" aria-labelledby="makamValidationTitle">
              <div class="makam-validation-heading">
                <div>
                  <h3 id="makamValidationTitle">Kaynak ve inceleme durumu</h3>
                  <p>${reviewLabel} · Nazariyat güven düzeyi: ${confidenceLabel.toLocaleLowerCase('tr-TR')}</p>
                </div>
                <span class="makam-validation-count">${sources.length} kaynak</span>
              </div>
              ${sources.length
                ? `<ul class="makam-source-list">${sources.map(source => {
                    const url = new URL(source.url).href.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
                    return `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${escapeMarkup(source.baslik || source.yazar || url)} <span aria-hidden="true">↗</span></a></li>`;
                  }).join('')}</ul>`
                : '<p class="makam-source-empty">Bu makam için henüz kaynak bağlantısı eklenmemiş.</p>'}
              <p class="makam-validation-note">Kayıtlar dinleme örneğidir; makam tahlil notları eğitim amaçlıdır ve canlı hoca değerlendirmesinin yerine geçmez.</p>
            </section>

          </div>

          <!-- Makamın Mizaç, Ezan ve Ruh Rehberi -->
          <div class="makam-meta-grid">
            <div class="makam-meta-card gold-border">
              <div class="makam-meta-title"><span></span> Ezan Vakti &amp; Osmanlı Geleneği</div>
              <div class="makam-meta-desc">${currentMakam.ezanGelenegi?.metin || currentMakam.ezanVakti || 'Geleneksel tilavet ve ezan makamı.'}</div>
            </div>
            <div class="makam-meta-card">
              <div class="makam-meta-title"><span></span> Rûhî Tesir &amp; Mizaç</div>
              <div class="makam-meta-desc">${currentMakam.ruhiTesir || 'Kalbe ferahlık ve huşû aşılar.'}</div>
            </div>
            <div class="makam-meta-card">
              <div class="makam-meta-title"><span></span> Uyumlu Âyet Temaları (Gelenek)</div>
              <div class="makam-meta-desc">${(currentMakam.gelenekNotu || currentMakam.uyumluTemalar || ['İlahi azamet', 'Rahmet', 'Dua']).join(' • ')}</div>
            </div>
          </div>

          <!-- İnteraktif 53-Koma Dizi / Piyano Şeridi -->
          <div class="makam-scale-box" style="margin-top:1.25rem;">
            <div class="scale-header">
              <span class="scale-title">Makamın Perdeleri (Tıklayarak Dinleyin):</span>
              <span class="scale-note-hint">Mikrotonal aralıklar Arel-Ezgi ve 53-koma Türk Musikisi koma/cent değerlerindedir.</span>
            </div>
            <div class="piano-scale-strip">
              ${cikiciDizi.map((abs, i) => {
                const pHz = T ? T.hzOfDegree(abs, durakVal, kararHz) : kararHz * Math.pow(2, (abs - durakVal)/53);
                const pName = T ? (T.perdeAdi(abs) || ('Perde ' + abs)) : ('Perde ' + abs);
                const pNote = T ? T.approxNote(abs) : { name: '', octave: 3 };
                const komas = abs - durakVal;
                const cents = Math.round(T ? T.komaToCents(komas) : komas * (1200 / 53));
                return `
                  <button type="button" class="piano-key" data-abs="${abs}" data-freq="${pHz}" title="${pName} (${pNote.name}${pNote.octave}) — ${komas} koma (${cents} cent)">
                    <span class="key-degree">${i + 1}</span>
                    <span class="key-name">${pName}</span>
                    <span class="key-note">${pNote.name}${pNote.octave}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Karakteristik Seyir Motifleri -->
          <div class="makam-motifs-box">
            <h3 class="motifs-heading">Karakteristik Seyir Motifleri</h3>
            <div class="motifs-grid">
              ${(currentMakam.motifs || []).map(motif => {
                const title = motif.name?.tr || motif.title || motif.id;
                const patText = Array.isArray(motif.path)
                  ? motif.path.map(p => (T ? (T.perdeAdi(p.abs) || p.abs) : p.abs)).join(' → ')
                  : (motif.pattern || '');
                return `
                  <div class="motif-card">
                    <div class="motif-info">
                      <span class="motif-title">${title}</span>
                      <span class="motif-pattern">${patText}</span>
                    </div>
                    <button type="button" class="btn-play-motif" data-motif-id="${motif.id}">
                      <span>▶</span> Dinle
                    </button>
                  </div>
                `;
              }).join('')}
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
    container.querySelectorAll('.makam-chip').forEach(chip => {
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
    let isDronePlaying = false;
    droneBtn?.addEventListener('click', () => {
      if (!isDronePlaying) {
        window.TilavetAudioLab?.drone.start(kararHz, 'tanbur');
        isDronePlaying = true;
        droneBtn.classList.add('playing');
        document.getElementById('droneBtnText').textContent = "Drone Durdur";
        if (window.showToast) window.showToast(`${currentMakam.names.tr} Karar Sesi (${kararHz.toFixed(1)} Hz) çalıyor...`);
      } else {
        window.TilavetAudioLab?.drone.stop();
        isDronePlaying = false;
        droneBtn.classList.remove('playing');
        document.getElementById('droneBtnText').textContent = "Drone Başlat";
      }
    });

    // 3. 53-Koma Piyano Tuşları
    container.querySelectorAll('.piano-key').forEach(key => {
      key.addEventListener('click', () => {
        const freq = parseFloat(key.getAttribute('data-freq')) || 220;
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
      console.error('Dinleme Salonu ses kaydı açılamadı:', audioUrl);
      loungeState.isPlaying = false;
      updateLoungePlayerUI();
      if (window.showToast) window.showToast('Seçilen kâri/sûre kaydı açılamadı. Başka bir kâriye geçilmedi.');
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
  }

  // 5.10 KAYNAKLAR & SÖZLÜK (40 TERİM)
  function renderSozlukView() {
    const container = document.getElementById('akademi-view-sozluk');
    if (!container) return;

    container.innerHTML = `
      <div class="sozluk-layout-wrap">
        <div class="akademi-card sozluk-card">
          <div class="card-headline">
            <span class="card-badge gold">TİLAVET LÜGATİ</span>
            <h2 class="card-title">Kıraat, Tecvid &amp; Makam Terimleri Sözlüğü</h2>
            <div class="sozluk-search-row">
              <input type="text" id="inputSozlukSearch" class="akademi-input" placeholder="Terim ara (örn: mahreç, gunne, rast, vakıf)...">
            </div>
          </div>

          <div class="terms-grid" id="termsGrid">
            ${SOZLUK.map(t => `
              <div class="term-card" data-term="${t.term.toLowerCase()} ${t.definition.toLowerCase()}">
                <div class="term-top">
                  <span class="term-title-tr">${t.term}</span>
                  <span class="term-title-ar" lang="ar">${t.termAr}</span>
                </div>
                <p class="term-def">${t.definition}</p>
                <div class="term-footer">
                  <span class="term-cat-badge">${t.category}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const searchInput = document.getElementById('inputSozlukSearch');
    searchInput?.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      container.querySelectorAll('.term-card').forEach(card => {
        const text = card.getAttribute('data-term') || '';
        card.style.display = text.includes(q) ? 'block' : 'none';
      });
    });
  }

  // 5.12 AYARLAR & ERİŞİLEBİLİRLİK (KVKK & GİZLİLİK)
  function renderAyarlarView() {
    const container = document.getElementById('akademi-view-ayarlar');
    if (!container) return;

    container.innerHTML = `
      <div class="ayarlar-layout-wrap">
        <div class="akademi-card settings-card">
          <div class="card-headline">
            <span class="card-badge cyan">YAPILANDIRMA</span>
            <h2 class="card-title">Tercihler, Erişilebilirlik &amp; Gizlilik (KVKK)</h2>
          </div>

          <div class="settings-options-list">
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-title"> Varsayılan Gizlilik: Sıfır Ham Ses Saklama (Client-Side DSP)</div>
                <div class="setting-desc">Tüm F0 perde, cent ve Medd analizleri yalnızca tarayıcınızın Web Worker iş parçacığında gerçekleşir. Ham mikrofon sesiniz hiçbir sunucuya iletilmez veya kaydedilmez.</div>
              </div>
              <span class="card-badge green" style="align-self:center;">DAİMA AKTİF</span>
            </div>

            <!-- Eğitmene Ses Aktarımı Seçenekleri (Claude Karar 6) -->
            <div class="setting-item" style="flex-direction:column; align-items:flex-start; gap:0.75rem;">
              <div class="setting-info" style="width:100%;">
                <div class="setting-title"> Eğitmene Ses Aktarım Protokolü (Fem-i Muhsin Denetimi)</div>
                <div class="setting-desc">Eğitmeninizle tilavet çalışırken sesinizin nasıl iletileceğini belirleyin:</div>
              </div>
              
              <div style="display:flex; flex-direction:column; gap:0.5rem; width:100%; margin-top:0.25rem;">
                <label style="display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0.8rem; background:rgba(255,255,255,0.02); border:1px solid ${state.voiceTransferMode === 'p2p' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.08)'}; border-radius:8px; cursor:pointer;">
                  <input type="radio" name="radioVoiceTransfer" value="p2p" ${state.voiceTransferMode === 'p2p' ? 'checked' : ''}>
                  <div>
                    <strong style="color:#f0f3fa; font-size:0.85rem;">Seçenek 1: Canlı Talim (WebRTC P2P Eşler Arası)</strong>
                    <div style="font-size:0.75rem; color:var(--text-muted);">Ses doğrudan hocanın tarayıcısına akar. Sunucuda hiçbir ses kaydı veya tampon tutulmaz.</div>
                  </div>
                </label>

                <label style="display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0.8rem; background:rgba(255,255,255,0.02); border:1px solid ${state.voiceTransferMode === 'ttl24h' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.08)'}; border-radius:8px; cursor:pointer;">
                  <input type="radio" name="radioVoiceTransfer" value="ttl24h" ${state.voiceTransferMode === 'ttl24h' ? 'checked' : ''}>
                  <div>
                    <strong style="color:#f0f3fa; font-size:0.85rem;">Seçenek 2: Asenkron Ödev İnceleme (24 Saat TTL E2EE Şifreli)</strong>
                    <div style="font-size:0.75rem; color:var(--text-muted);">Uçtan uca şifreli geçici depolama. Hoca dinledikten sonra veya azami 24 saat sonra sistemden kalıcı olarak silinir.</div>
                  </div>
                </label>
              </div>

              <!-- 24h Açık Rıza Checkbox -->
              <div style="display:flex; align-items:center; gap:0.6rem; margin-top:0.5rem; padding:0.5rem; background:rgba(229,184,105,0.05); border:1px dashed rgba(229,184,105,0.3); border-radius:6px; width:100%;">
                <input type="checkbox" id="checkVoiceConsent24h" ${state.voiceConsent24h ? 'checked' : ''}>
                <label for="checkVoiceConsent24h" style="font-size:0.78rem; color:var(--accent-gold); cursor:pointer;">
                  <strong>Açık Rıza Beyanı:</strong> "Ses kaydımın yalnızca eğitmene iletilmek üzere azami 24 saat süreyle şifrelenerek tutulmasını onaylıyorum."
                </label>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-title">Çocuk &amp; Genç Emniyet Modu</div>
                <div class="setting-desc">Sosyal özellikleri kısıtlar, ses tellerini zorlamayan hafifletilmiş egzersizleri devreye alır.</div>
              </div>
              <label class="switch-wrap">
                <input type="checkbox" id="checkChildMode" ${state.childMode ? 'checked' : ''}>
                <span class="switch-slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-title">İlerlemeyi ve Pratik Geçmişini Sıfırla</div>
                <div class="setting-desc">Tamamlanan dersleri ve kaydedilen tüm yerel verileri güvenle temizler.</div>
              </div>
              <button type="button" class="btn-akademi-danger" id="btnResetProgress">Verileri Sıfırla</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Radyo butonları dinleyicisi
    container.querySelectorAll('input[name="radioVoiceTransfer"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.voiceTransferMode = e.target.value;
        saveState();
        renderAyarlarView();
        if (window.showToast) {
          window.showToast(`Ses aktarım protokolü: ${state.voiceTransferMode === 'p2p' ? 'WebRTC P2P Canlı' : '24h TTL Şifreli'}`);
        }
      });
    });

    // Açık rıza checkbox
    document.getElementById('checkVoiceConsent24h')?.addEventListener('change', (e) => {
      state.voiceConsent24h = e.target.checked;
      saveState();
      if (window.showToast) {
        window.showToast(state.voiceConsent24h ? "✅ 24 saatlik geçici aktarım rızası kaydedildi." : "ℹ Geçici aktarım rızası kaldırıldı.");
      }
    });

    document.getElementById('checkChildMode')?.addEventListener('change', (e) => {
      state.childMode = e.target.checked;
      saveState();
      if (window.showToast) window.showToast("Çocuk modu güncellendi.");
    });

    document.getElementById('btnResetProgress')?.addEventListener('click', () => {
      if (confirm("Tilavet Akademisi ilerleme verilerini sıfırlamak istediğinize emin misiniz?")) {
        state = { ...defaultState };
        saveState();
        renderAyarlarView();
        if (window.showToast) window.showToast("Tüm veriler sıfırlandı.");
      }
    });
  }

  // ===========================================================================
  // 5.8 PRATİK STÜDYOSU (SES LABORATUVARI, CANLI F0 PITCH TUNER & MEDD ELİF SAYACI)
  // ===========================================================================
  let activeStudioStation = 'kurra'; // 'kurra', 'tuner', 'medd', 'spectrum'
  let activeKararMakam = 'ussak';
  let activeKararTimbre = 'tanbur';
  let activeStudioTempoMode = 'tertil';
  let selectedMeddPracticeIdx = 0;
  let selectedStudioAyahKey = '112:1';
  let selectedStudioQariKey = 'minshawi';
  let studioSelectionMode = 'presets'; // 'presets' | 'universal'
  let universalSelectedSurah = 112;
  let universalSelectedAyah = 1;
  let universalSelectedQari = 'minshawi';
  let studioAudioRealDurationMs = null;
  let studioPlaybackCompleted = false;
  let isStudioMicActive = false;
  let isStudioRecording = false;
  let isStudioDroneActive = false;
  let isStudioPlayingRef = false;
  let userStudioPitchSamples = [];
  let dtwEvaluationResult = null;
  let spectrumCanvasAnimId = null;
  let studioPlayheadAnimId = null;
  let studioRecPitchListener = null;
  let studioContourRequestId = 0;

  function renderStudyoView() {
    if (activeStudioStation === 'nefes') {
      activeSanTab = 'diyafram';
      switchAkademiSubView('san');
      return;
    }

    const container = document.getElementById('akademi-view-studyo');
    if (!container) return;

    // 12 Zengin Kur'anî Medd Çalışma Kartı (Kur'anî Tertip: Sağdan Sola - RTL)
    const MEDD_PRACTICE_EXAMPLES = [
      {
        id: "tabii-1",
        numAr: "١",
        orderNum: 1,
        type: "1 Elif · Tabiî Med",
        word: "قَالَ",
        latin: "Kâle",
        ayah: "2:30",
        rule: "Üstünden sonra hareketsiz Elif; asgari 1 elif uzatılır.",
        targetElif: 1,
        badgeColor: "green"
      },
      {
        id: "tabii-2",
        numAr: "٢",
        orderNum: 2,
        type: "1 Elif · Tabiî Med",
        word: "يَقُولُ",
        latin: "Yekûlü",
        ayah: "2:8",
        rule: "Ötreden sonra hareketsiz Vâv; asgari 1 elif uzatılır.",
        targetElif: 1,
        badgeColor: "green"
      },
      {
        id: "tabii-3",
        numAr: "٣",
        orderNum: 3,
        type: "1 Elif · Tabiî Med",
        word: "قِيلَ",
        latin: "Kîle",
        ayah: "2:11",
        rule: "Esreden sonra hareketsiz Yâ; asgari 1 elif uzatılır.",
        targetElif: 1,
        badgeColor: "green"
      },
      {
        id: "tabii-4",
        numAr: "٤",
        orderNum: 4,
        type: "1 Elif · 3 Meddi Birleştiren Âyet",
        word: "نُوحِيهَا",
        latin: "Nû - hî - hâ",
        ayah: "11:49",
        rule: "Vâv, Yâ ve Elif harflerinin üçünü birden toplayan Kur'anî şaheser.",
        targetElif: 1,
        badgeColor: "gold"
      },
      {
        id: "ariz-1",
        numAr: "٥",
        orderNum: 5,
        type: "2 Elif · Ârız / Lîn Meddi (Vakıf Hali)",
        word: "نَسْتَعِينُ",
        latin: "Neste'în (Vakıf)",
        ayah: "1:5",
        rule: "Âyet sonunda durulduğunda sükûn-ı ârız oluşur; 2 ila 4 elif câizdir.",
        targetElif: 2,
        badgeColor: "cyan"
      },
      {
        id: "lin-1",
        numAr: "٦",
        orderNum: 6,
        type: "2 Elif · Medd-i Lîn",
        word: "خَوْفٍ",
        latin: "Havf (Vakıf)",
        ayah: "106:4",
        rule: "Üstünden sonra gelen cezimli Vâv veya Yâ harfinde vakıf hali.",
        targetElif: 2,
        badgeColor: "cyan"
      },
      {
        id: "muttasil-1",
        numAr: "٧",
        orderNum: 7,
        type: "4 Elif · Medd-i Muttasıl (Bitişik)",
        word: "جَاءَ",
        latin: "Câââe",
        ayah: "110:1",
        rule: "Med harfi ile hemze aynı kelimede bir araya gelmiştir; 4 elif vaciptir.",
        targetElif: 4,
        badgeColor: "gold"
      },
      {
        id: "muttasil-2",
        numAr: "٨",
        orderNum: 8,
        type: "4 Elif · Medd-i Muttasıl (Bitişik)",
        word: "السَّمَاءِ",
        latin: "Es-Semâââi",
        ayah: "2:22",
        rule: "Elif meddi sonrası aynı kelimede hemze; 4 elif miktarı uzatılır.",
        targetElif: 4,
        badgeColor: "gold"
      },
      {
        id: "munfasil-1",
        numAr: "٩",
        orderNum: 9,
        type: "4 Elif · Medd-i Munfasıl (Ayrık)",
        word: "يَا أَيُّهَا",
        latin: "Yâââ eyyühe",
        ayah: "2:21",
        rule: "Med harfi birinci, hemze ikinci kelimenin başında yer alır; 4 elif câizdir.",
        targetElif: 4,
        badgeColor: "cyan"
      },
      {
        id: "munfasil-2",
        numAr: "١٠",
        orderNum: 10,
        type: "4 Elif · Medd-i Munfasıl (Ayrık)",
        word: "بِمَا أُنْزِلَ",
        latin: "Bimâââ ünzile",
        ayah: "2:4",
        rule: "Kelime ayrımı sebebiyle tertil okuyuşunda 4 elif uzatılır.",
        targetElif: 4,
        badgeColor: "cyan"
      },
      {
        id: "lazim-1",
        numAr: "١١",
        orderNum: 11,
        type: "4-6 Elif · Medd-i Lâzım (Kelime-i Müsakkale)",
        word: "الضَّالِّينَ",
        latin: "Eddâââllîn",
        ayah: "1:7",
        rule: "Med harfinden sonra şeddeli harf (sükûn-ı lâzım) gelir; 4-6 elif vacip/lâzımdır.",
        targetElif: 6,
        badgeColor: "alert"
      },
      {
        id: "lazim-2",
        numAr: "١٢",
        orderNum: 12,
        type: "4-6 Elif · Medd-i Lâzım (Kelime-i Müsakkale)",
        word: "الطَّامَّةُ",
        latin: "Ettâââmmeh",
        ayah: "79:34",
        rule: "Med harfi ardından gelen şeddeli mim; 4 elif uzatma + 1.5 elif ğunne tutulur.",
        targetElif: 6,
        badgeColor: "alert"
      }
    ];

    // 16 Zengin ve Doğrulanmış Model Âyet Kataloğu (Tekil Âyet Hassasiyeti & Makam Uyumu)
    const MODEL_AYAHS = [
      { key: "112:1", surah: 112, ayah: 1, label: "İhlâs Sûresi 112:1 (Tevhîd)", makam: "Nihâvend", text: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", meal: "De ki: O, Allah'tır, bir tektir." },
      { key: "112:2", surah: 112, ayah: 2, label: "İhlâs Sûresi 112:2 (Samediyyet)", makam: "Nihâvend Terennüm", text: "ٱللَّهُ ٱلصَّمَدُ", meal: "Allah Samed'dir (her şey O'na muhtaç, O hiçbir şeye muhtaç değildir)." },
      { key: "112:3", surah: 112, ayah: 3, label: "İhlâs Sûresi 112:3 (Tenzîh)", makam: "Nihâvend İnici", text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", meal: "O, doğurmamış ve doğmamıştır." },
      { key: "112:4", surah: 112, ayah: 4, label: "İhlâs Sûresi 112:4 (Hatm)", makam: "Nihâvend Karar", text: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ", meal: "Hiçbir şey O'na denk ve benzer değildir." },
      { key: "1:1", surah: 1, ayah: 1, label: "Fâtiha Sûresi 1:1 (Besmele)", makam: "Beyatî / Rast Karar", text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", meal: "Rahmân ve Rahîm olan Allah'ın adıyla." },
      { key: "1:2", surah: 1, ayah: 2, label: "Fâtiha Sûresi 1:2 (Hamd Âyeti)", makam: "Rast Seyir", text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", meal: "Hamd, âlemlerin Rabbi olan Allah'a mahsustur." },
      { key: "1:5", surah: 1, ayah: 5, label: "Fâtiha Sûresi 1:5 (İbadet & İstiâne)", makam: "Hicaz Karar", text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", meal: "(Rabbimiz!) Yalnız sana kulluk eder ve yalnız senden yardım dileriz." },
      { key: "1:7", surah: 1, ayah: 7, label: "Fâtiha Sûresi 1:7 (Hidayet Yolu)", makam: "Rast / Beyatî Seyir", text: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", meal: "Kendilerine lütufta bulunduğun kimselerin yoluna ilet; gazaba uğramışların ve sapmışların yoluna değil." },
      { key: "2:255", surah: 2, ayah: 255, label: "Bakara Sûresi 2:255 (Âyetü'l-Kürsî)", makam: "Hicaz / Sabâ", text: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ", meal: "Allah O'dur ki, O'ndan başka ilah yoktur. Hayy'dır, Kayyûm'dur." },
      { key: "36:1", surah: 36, ayah: 1, label: "Yâsîn Sûresi 36:1-2 (Hikmetli Kur'an)", makam: "Beyatî / Hüseynî", text: "يس ۝ وَٱلْقُرْءَانِ ٱلْحَكِيمِ", meal: "Yâ Sîn. Hikmet dolu Kur'an'a andolsun." },
      { key: "55:1", surah: 55, ayah: 1, label: "Rahmân Sûresi 55:1-4 (er-Rahmân)", makam: "Rast / Beyatî", text: "ٱلرَّحْمَٰنُ ۝ عَلَّمَ ٱلْقُرْءَانَ ۝ خَلَقَ ٱلْإِنسَٰنَ", meal: "Rahmân, Kur'an'ı öğretti. İnsanı yarattı." },
      { key: "67:1", surah: 67, ayah: 1, label: "Mülk Sûresi 67:1 (Tebârekellezî)", makam: "Rast / Beyatî", text: "تَبَٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ", meal: "Hükümranlık elinde olan Allah yüceler yücesidir." },
      { key: "89:27", surah: 89, ayah: 27, label: "Fecr Sûresi 89:27-30 (Yâ Eyyetühe'n-Nefs)", makam: "Sabâ / Hüseynî", text: "يَٰٓأَيَّتُهَا ٱلنَّفْسُ ٱلْمُطْمَئِنَّةُ", meal: "Ey huzura kavuşmuş nefis! Razı olmuş ve razı olunmuş olarak Rabbine dön!" },
      { key: "93:1", surah: 93, ayah: 1, label: "Duhâ Sûresi 93:1-3 (Ve'd-Duhâ)", makam: "Segâh", text: "وَٱلضُّحَىٰ ۝ وَٱلَّيْلِ إِذَا سَجَىٰ", meal: "Kuşluk vaktine andolsun. Karanlığı çöktüğü vakit geceye andolsun." },
      { key: "103:1", surah: 103, ayah: 1, label: "Asr Sûresi 103:1-3 (Ve'l-Asr)", makam: "Rast / Beyatî", text: "وَٱلْعَصْرِ ۝ إِنَّ ٱلْإِنسَٰنَ لَفِى خُسْرٍ", meal: "Asra yemin olsun ki, insan gerçekten ziyan içindedir." },
      { key: "110:1", surah: 110, ayah: 1, label: "Nasr Sûresi 110:1 (Fetih Müjdesi)", makam: "Rast / Nehavend", text: "إِذَا جَآءَ نَصْرُ ٱللَّهِ وَٱلْفَتْحُ", meal: "Allah'ın yardımı ve fetih geldiği zaman..." }
    ];

    const currentModelAyah = MODEL_AYAHS.find(a => a.key === selectedStudioAyahKey) || MODEL_AYAHS[0];
    const isUniversalMode = studioSelectionMode === 'universal';
    const allSurahsList = window.SURAH_LIST || [];
    const activeSurahObj = allSurahsList.find(s => s.no === universalSelectedSurah) || { no: 112, name: "İhlâs", arabic: "الإخلاص", ayahs: 4 };

    const activeAyahMeta = isUniversalMode ? {
      key: `${universalSelectedSurah}:${universalSelectedAyah}`,
      surah: universalSelectedSurah,
      ayah: universalSelectedAyah,
      label: `${activeSurahObj.name} Sûresi ${universalSelectedSurah}:${universalSelectedAyah}`,
      makam: 'Uzman doğrulaması yok',
      qari: universalSelectedQari,
      text: 'Âyet metni kaynaktan yükleniyor…',
      meal: ''
    } : {
      key: currentModelAyah.key,
      surah: currentModelAyah.surah,
      ayah: currentModelAyah.ayah,
      label: `${allSurahsList.find(s => s.no === currentModelAyah.surah)?.name || `Sûre ${currentModelAyah.surah}`} Sûresi ${currentModelAyah.key}`,
      makam: 'Uzman doğrulaması yok',
      qari: selectedStudioQariKey,
      text: 'Âyet metni kaynaktan yükleniyor…',
      meal: ''
    };

    // Üst İstasyon Seçici Gezinti Şeridi
    const subNavHtml = `
      <div class="studio-sub-nav" role="group" aria-label="Ses laboratuvarı istasyonları">
        <button type="button" class="studio-station-pill ${activeStudioStation === 'tuner' ? 'active' : ''}" data-station="tuner" aria-pressed="${activeStudioStation === 'tuner'}">
          <span></span> 1. Perde &amp; Karar Akordu
        </button>
        <button type="button" class="studio-station-pill ${activeStudioStation === 'medd' ? 'active' : ''}" data-station="medd" aria-pressed="${activeStudioStation === 'medd'}">
          <span>⏱</span> 2. Medd &amp; Tempo Ölçer
        </button>
        <button type="button" class="studio-station-pill ${activeStudioStation === 'kurra' ? 'active' : ''}" data-station="kurra" aria-pressed="${activeStudioStation === 'kurra'}">
          <span></span> 3. Kurrâ Mukayesesi (DTW)
        </button>
        <button type="button" class="studio-station-pill ${activeStudioStation === 'spectrum' ? 'active' : ''}" data-station="spectrum" aria-pressed="${activeStudioStation === 'spectrum'}">
          <span></span> 4. Canlı Spektrum &amp; Rezonans
        </button>
      </div>
    `;

    // Eğitici Rehber Banner'ı (Kullanıcının Laboratuvarın Ne İşe Yaradığını Anlamasını Sağlar)
    const guideBannerHtml = `
      <div class="studio-guide-banner">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.75rem;">
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.25rem;">
              <span class="card-badge gold">TİLAVET AKUSTİK LABORATUVARI</span>
              <span class="card-badge green">GERÇEK ZAMANLI DSP MOTORU</span>
              <span class="card-badge cyan">DTW SEYİR ANALİZİ</span>
            </div>
            <h2 style="font-size:1.35rem; font-weight:800; color:#f0f3fa; margin:0.2rem 0;">
               Kur'an Tilaveti Ses Laboratuvarı &amp; Akustik Tahlil İstasyonu
            </h2>
            <p style="color:#cbd5e1; font-size:0.88rem; max-width:850px; line-height:1.55; margin:0.25rem 0 0 0;">
              Bu laboratuvar, Kur'an tilavetinde sesinizi rasgele değil; <strong>F0 temel frekansı, Türk-İslam makam karar perdeleri, milisaniye hassasiyetli medd (elif) uzatmaları</strong> ve <strong>usta kurrâların perde seyrine uyumunu</strong> bilimsel olarak ölçüp geliştirmek üzere tasarlanmıştır.
            </p>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
            <button type="button" class="btn-akademi-primary" id="btnLaunchFocusModal" style="background:linear-gradient(135deg, #d4af37, #b45309); color:#fff; border:none; box-shadow:0 4px 15px rgba(212,175,55,0.3); font-weight:700; padding:0.65rem 1.25rem;">
              <span></span> Okuma Penceresi (Odak Modu)
            </button>
            <button type="button" class="btn-akademi-primary" id="btnStudioToggleMic" style="padding:0.65rem 1.25rem;">
              <span id="studioMicIcon"></span>
              <span id="studioMicBtnText">${isStudioMicActive ? 'Mikrofonu Durdur' : 'Canlı Mikrofonu Başlat'}</span>
            </button>
          </div>
        </div>

        <div class="studio-guide-grid">
          <div class="studio-guide-card">
            <strong style="color:var(--accent-gold);">1. Karar Perdesi:</strong> Doğal sesinizin makam karar perdesine (Rast, Dügâh vb.) tam oturup oturmadığını koma hassasiyetiyle görün.
          </div>
          <div class="studio-guide-card">
            <strong style="color:var(--accent-green);">2. Akustik Medd:</strong> 4 kıraat temposunda (Tahkik/Tertil/Tedvir/Hadr) sesinizi uzatıp elif miktarını canlı çubuklarla test edin.
          </div>
          <div class="studio-guide-card">
            <strong style="color:var(--accent-cyan);">3. DTW Mukayesesi:</strong> Kâbe İmamı veya Mısırlı kâriyi dinleyin; âyeti okuyup perde seyrinizin uyumunu gerçek zamanlı eğrilerle karşılaştırın.
          </div>
          <div class="studio-guide-card">
            <strong style="color:#b388ff;">4. Tını &amp; Ğunne:</strong> Sesinizin göğüs tokluğu, boğaz netliği ve geniz (hayşûm/ğunne) rezonansını canlı frekans spektrumunda izleyin.
          </div>
        </div>
      </div>
    `;

    // =========================================================================
    // İSTASYON 1: CANLI PERDE & KARAR AKORT ODASI
    // =========================================================================
    let stationContentHtml = '';

    if (activeStudioStation === 'tuner') {
      stationContentHtml = `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem;">
          
          <!-- Sol Kolon: Canlı F0 Tuner Göstergesi -->
          <div class="tuner-dashboard">
            <div style="display:flex; justify-content:space-between; width:100%; margin-bottom:0.75rem;">
              <span style="font-size:0.75rem; font-weight:800; color:var(--text-muted); letter-spacing:0.5px;">CANLI PERDE ANALİZÖRÜ (F0)</span>
              <span class="card-badge gold" id="studioKomaPill">0 koma · Karar</span>
            </div>

            <div class="tuner-note-display" id="studioNoteDisplay">—</div>
            <div class="tuner-freq-display" id="studioFreqDisplay">0.0 Hz</div>
            
            <div class="tuner-cents-gauge" title="Cent Sapması (-50 ila +50 cent)">
              <div class="gauge-center-line"></div>
              <div class="gauge-needle" id="studioGaugeNeedle" style="left: 50%;"></div>
            </div>

            <div class="tuner-status-text" id="studioTunerStatus">
              ${isStudioMicActive ? 'Ses bekleniyor… Mikrofona bir harf veya âyet okuyun.' : 'Mikrofonu başlatarak sesinizi karar sesine akort edin.'}
            </div>

            <div style="display:flex; gap:0.5rem; justify-content:center; margin-top:1.25rem; flex-wrap:wrap;">
              <span class="card-badge green">±15 Cent Tolerans (Tam Karar)</span>
              <span class="card-badge cyan">1 Koma ≈ 22.6 Cent</span>
            </div>
          </div>

          <!-- Sağ Kolon: Makam Karar Sesi İstasyonu (Drone) -->
          <div class="akademi-card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="card-headline" style="margin-bottom:0.75rem;">
                <div>
                  <span class="card-badge gold">MAKAM KARAR DEMİ (DRONE)</span>
                  <h3 class="card-title" style="font-size:1.15rem; margin-top:0.25rem;">Makam Karar Perdesini Eşleme</h3>
                </div>
                <button type="button" class="btn-akademi-primary" id="btnStudioToggleDrone" style="padding:0.45rem 1rem;">
                  <span id="studioDroneIcon"></span>
                  <span id="studioDroneBtnText">${isStudioDroneActive ? 'Dem Sesini Durdur' : 'Karar Sesini Çal'}</span>
                </button>
              </div>
              <p style="font-size:0.85rem; color:#a0aec0; line-height:1.5; margin-bottom:1rem;">
                Kur'an tilavetinde perde kaymasını önlemek için okuyacağınız makamın karar sesini (demini) dinleyin. Sesinizi bu perdeye kilitleyerek mikrofon ibresinde <strong>"Tam Karar"</strong> yeşilini yakalayın.
              </p>
            </div>

            <!-- Makam Karar Butonları Şeridi -->
            <div>
              <div style="font-size:0.75rem; font-weight:700; color:var(--accent-gold); margin-bottom:0.5rem;">MAKAMLAR VE KARAR SESLERİ:</div>
              <div class="karar-drone-strip">
                <button type="button" class="btn-makam-karar ${activeKararMakam === 'rast' ? 'active' : ''}" data-makam="rast">
                  Rast (Sol · G3 · 196 Hz)
                </button>
                <button type="button" class="btn-makam-karar ${activeKararMakam === 'ussak' ? 'active' : ''}" data-makam="ussak">
                  Uşşak/Beyatî (La · Dügâh · 220 Hz)
                </button>
                <button type="button" class="btn-makam-karar ${activeKararMakam === 'segah' ? 'active' : ''}" data-makam="segah">
                  Segâh (Si koma-b · 241 Hz)
                </button>
                <button type="button" class="btn-makam-karar ${activeKararMakam === 'hicaz' ? 'active' : ''}" data-makam="hicaz">
                  Hicaz (La · Dügâh · 220 Hz)
                </button>
                <button type="button" class="btn-makam-karar ${activeKararMakam === 'saba' ? 'active' : ''}" data-makam="saba">
                  Sabâ (La · Dügâh · 220 Hz)
                </button>
                <button type="button" class="btn-makam-karar ${activeKararMakam === 'nahavend' ? 'active' : ''}" data-makam="nahavend">
                  Nihâvend (Do · Çargâh · 261 Hz)
                </button>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.85rem; padding-top:0.6rem; border-top:1px solid rgba(255,255,255,0.06); font-size:0.8rem; color:#cbd5e1;">
                <div>Tını: <strong>${activeKararTimbre === 'tanbur' ? 'Akustik Tanbur' : 'Ney Tınısı'}</strong></div>
                <div style="display:flex; gap:0.4rem;">
                  <button type="button" class="btn-sm-action btn-timbre-select" data-timbre="tanbur" style="${activeKararTimbre === 'tanbur' ? 'background:var(--accent-gold); color:#000;' : ''}">Tanbur</button>
                  <button type="button" class="btn-sm-action btn-timbre-select" data-timbre="ney" style="${activeKararTimbre === 'ney' ? 'background:var(--accent-gold); color:#000;' : ''}">Ney</button>
                </div>
              </div>
            </div>

          </div>

        </div>
      `;
    }

    // =========================================================================
    // İSTASYON 2: MEDD (ELİF MİKTARI) VE TEMPO KRONOMETRESİ
    // =========================================================================
    else if (activeStudioStation === 'medd') {
      stationContentHtml = `
        <div class="akademi-card" style="margin-bottom:1.25rem;">
          <div class="card-headline">
            <div>
              <span class="card-badge gold">AKUSTİK MEDD SAYACI</span>
              <h3 class="card-title">Kur'an Okuma Tempoları ve Canlı Elif Ölçümü</h3>
              <p class="card-desc">Kur'an'da uzatma (medd) süreleri metronomik bir saniye değil; okunan tempoya orantılı 'Elif miktarı'dır.</p>
            </div>
          </div>

          <!-- Okuma Biçimi (Tempo Modu) Seçim Şeridi -->
          <div style="display:flex; align-items:center; gap:0.6rem; padding:0.75rem 1rem; background:rgba(0,0,0,0.3); border:1px solid rgba(229,184,105,0.2); border-radius:10px; margin:0.85rem 0 1.25rem 0; flex-wrap:wrap;">
            <span style="font-size:0.78rem; font-weight:800; color:var(--accent-gold);">OKUMA BİÇİMİ (TEMPO):</span>
            <button type="button" class="btn-tempo-pill ${activeStudioTempoMode === 'tahkik' ? 'active' : ''}" data-mode="tahkik" style="padding:0.4rem 0.85rem; font-size:0.78rem; border-radius:6px; background:${activeStudioTempoMode === 'tahkik' ? 'var(--accent-gold)' : 'transparent'}; border:1px solid ${activeStudioTempoMode === 'tahkik' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.15)'}; color:${activeStudioTempoMode === 'tahkik' ? '#07090e' : '#a0aec0'}; font-weight:${activeStudioTempoMode === 'tahkik' ? '700' : 'normal'}; cursor:pointer;">
              Tahkik (Ağır / Tane Tane · K=1.40)
            </button>
            <button type="button" class="btn-tempo-pill ${activeStudioTempoMode === 'tertil' ? 'active' : ''}" data-mode="tertil" style="padding:0.4rem 0.85rem; font-size:0.78rem; border-radius:6px; background:${activeStudioTempoMode === 'tertil' ? 'var(--accent-gold)' : 'transparent'}; border:1px solid ${activeStudioTempoMode === 'tertil' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.15)'}; color:${activeStudioTempoMode === 'tertil' ? '#07090e' : '#a0aec0'}; font-weight:${activeStudioTempoMode === 'tertil' ? '700' : 'normal'}; cursor:pointer;">
              Tertil (Dengeli / Orta · K=1.00)
            </button>
            <button type="button" class="btn-tempo-pill ${activeStudioTempoMode === 'tedvir' ? 'active' : ''}" data-mode="tedvir" style="padding:0.4rem 0.85rem; font-size:0.78rem; border-radius:6px; background:${activeStudioTempoMode === 'tedvir' ? 'var(--accent-gold)' : 'transparent'}; border:1px solid ${activeStudioTempoMode === 'tedvir' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.15)'}; color:${activeStudioTempoMode === 'tedvir' ? '#07090e' : '#a0aec0'}; font-weight:${activeStudioTempoMode === 'tedvir' ? '700' : 'normal'}; cursor:pointer;">
              Tedvir (Orta-Hızlı · K=0.85)
            </button>
            <button type="button" class="btn-tempo-pill ${activeStudioTempoMode === 'hadr' ? 'active' : ''}" data-mode="hadr" style="padding:0.4rem 0.85rem; font-size:0.78rem; border-radius:6px; background:${activeStudioTempoMode === 'hadr' ? 'var(--accent-gold)' : 'transparent'}; border:1px solid ${activeStudioTempoMode === 'hadr' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.15)'}; color:${activeStudioTempoMode === 'hadr' ? '#07090e' : '#a0aec0'}; font-weight:${activeStudioTempoMode === 'hadr' ? '700' : 'normal'}; cursor:pointer;">
              Hadr (Hızlı / Hatim · K=0.70)
            </button>
          </div>

          <!-- Canlı Medd Göstergesi -->
          <div class="medd-tracker-gauge">
            <div class="medd-info-side">
              <div style="font-size:0.75rem; font-weight:800; color:var(--accent-gold); letter-spacing:0.05em;">CANLI UZATMA DURUMU:</div>
              <div style="font-size:0.85rem; color:#cbd5e1; margin:0.3rem 0;" id="studioMeddStatusText">
                Okuma Modu: ${activeStudioTempoMode.toUpperCase()} (K=${(window.TilavetAudioLab?.meddTimer?.getEffectiveMultiplier() || 1).toFixed(2)})
              </div>
              <div style="font-size:1.25rem; font-weight:800; color:var(--accent-green);" id="studioMeddElifValue">
                0 Elif · 0 ms
              </div>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">
                Mikrofonu açıp aşağıdaki kelimelerden birini uzatarak okuyunuz.
              </div>
            </div>
            
            <div class="medd-visual-bars" id="studioMeddBars">
              <div class="medd-bar" data-elif="1" title="1 Elif (Tabiî Med)"></div>
              <div class="medd-bar" data-elif="2" title="2 Elif (Ârız/Lîn)"></div>
              <div class="medd-bar" data-elif="3" title="3 Elif (Ârız)"></div>
              <div class="medd-bar" data-elif="4" title="4 Elif (Muttasıl/Munfasıl/Lâzım)"></div>
              <div class="medd-bar" data-elif="5" title="5 Elif (Aşırı)"></div>
              <div class="medd-bar" data-elif="6" title="6 Elif (İfrat)"></div>
            </div>
          </div>
        </div>

        <!-- 12 Zengin Medd Çalışma Kartı Matrisi (Kur'anî Tertip: Sağdan Sola) -->
        <div class="akademi-card">
          <div class="card-headline">
            <div>
              <span class="card-badge cyan">12 KUR'ANÎ ÖRNEK İLE MEDD ÇALIŞMASI</span>
              <h3 class="card-title">Uzatma Kuralları Talim Kataloğu</h3>
              <p class="card-desc">Her karta dokunarak kuralı inceleyin; mikrofona okuyarak elif sayacında hedef miktarı tutturun.</p>
            </div>
          </div>

          <!-- Arapça Kıraat Yönü Rehber Şeridi (Sağdan Sola - RTL) -->
          <div class="medd-direction-guide-banner" style="display:flex; justify-content:space-between; align-items:center; background:linear-gradient(90deg, rgba(229,184,105,0.08), rgba(6,182,212,0.12)); border:1px solid rgba(229,184,105,0.25); border-radius:8px; padding:0.6rem 1rem; margin-top:0.75rem;">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="font-size:1.15rem;"></span>
              <span style="font-size:0.84rem; font-weight:800; color:var(--accent-gold);">Kur'an-ı Kerîm &amp; Arapça Kıraat Sırası:</span>
              <span style="font-size:0.8rem; color:#cbd5e1;">Arapça harfler ve tilavet <strong>sağdan sola (RTL)</strong> okunur; talime sağ üstteki <strong>١ (1. Örnek)</strong> ile başlayınız.</span>
            </div>
            <div style="font-size:0.85rem; font-weight:800; color:#38bdf8; display:flex; align-items:center; gap:0.4rem; direction:rtl;">
              <span>Sağdan Sola (١ ➔ ١٢)</span>
              <span style="font-size:1.1rem; letter-spacing:2px;">⬅ ⬅</span>
            </div>
          </div>

          <!-- Sağdan Sola Tertip Edilmiş Kart Izgarası -->
          <div class="medd-catalog-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:1rem; margin-top:1.15rem; direction:rtl;">
            ${MEDD_PRACTICE_EXAMPLES.map((item, idx) => `
              <div class="med-card btn-practice-med-card ${selectedMeddPracticeIdx === idx ? 'is-selected' : ''}" data-idx="${idx}" data-word="${item.word}" data-latin="${item.latin}" data-ayah="${item.ayah}" data-target-elif="${item.targetElif}" style="text-align:center; padding:1.25rem 1rem; cursor:pointer; direction:rtl; position:relative;" title="Kur'anî ${item.orderNum}. Örnek (${item.latin}) - Talim için dokunun">
                <!-- Kart Üst Barı: Sağda Sıra Numarası & Medd Türü, Solda Âyet Referansı -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem; direction:rtl;">
                  <span class="card-badge ${item.badgeColor}" style="font-size:0.72rem; font-weight:800; display:inline-flex; align-items:center; gap:0.35rem;">
                    <span style="font-family:'Amiri', serif; font-size:0.95rem; font-weight:bold;">${item.numAr}</span>
                    <span>${item.type}</span>
                  </span>
                  <span style="font-size:0.74rem; color:#94a3b8; font-weight:600; direction:ltr;">Âyet ${item.ayah}</span>
                </div>

                <!-- Arapça Kelime (Kur'an Hattı - Kesin Sağdan Sola) -->
                <div class="med-glyph" lang="ar" dir="rtl" style="font-size:2.85rem; margin:0.35rem 0; font-family:'Amiri', 'Scheherazade New', serif; line-height:1.3; direction:rtl; unicode-bidi:isolate;">${item.word}</div>

                <!-- Latin Okunuş & Transkripsiyon -->
                <div dir="ltr" style="font-size:1.15rem; font-weight:800; color:#f0f3fa; letter-spacing:0.02em;">${item.latin}</div>

                <!-- Tecvid Kuralı İzahı -->
                <div dir="ltr" style="font-size:0.78rem; color:#8a94a6; margin-top:0.4rem; line-height:1.45;">${item.rule}</div>

                <!-- Aksiyon Butonları (Dinle & Hedef Seç) -->
                <div style="margin-top:0.85rem; display:flex; gap:0.4rem; direction:ltr;">
                  <button type="button" class="btn-sm-action btn-play-med-sample" data-ayah="${item.ayah}" data-word="${item.latin}" data-ar="${item.word}" style="flex:1; width:auto; font-size:0.76rem; font-weight:700;">
                    <span></span> Hakiki Tilavet
                  </button>
                  <button type="button" class="btn-sm-action btn-select-med-target" data-idx="${idx}" style="background:rgba(229,184,105,0.15); border:1px solid rgba(229,184,105,0.3); color:var(--accent-gold); font-size:0.76rem; font-weight:700; padding:0.45rem 0.65rem;" title="Bu örneği canlı sayaç için aktif hedef yap">
                    <span></span> Seç
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // İSTASYON 3: KURRÂ PERDE MUKAYESESİ VE GERÇEK DTW
    // =========================================================================
    else if (activeStudioStation === 'kurra') {
      stationContentHtml = `
        <div class="akademi-card" style="margin-bottom:1.25rem;">
          <div class="card-headline">
            <div>
              <span class="card-badge gold">KURRÂ-İ İZÂM MUKAYESESİ</span>
              <h3 class="card-title">Model Kâri Perde Seyri &amp; Bilimsel DTW Karşılaştırması</h3>
              <p class="card-desc">Seçilen kâri kaydından çıkarılan gerçek temel frekans (F0) konturu kendi kaydınızla DTW üzerinden karşılaştırılır. Makam etiketi otomatik atanmaz; sonuç yalnızca akustik benzerliktir. Referans ses ve âyet metni yüklenemezse uydurma grafik gösterilmez.</p>
            </div>
            <div style="display:flex; gap:0.6rem; flex-wrap:wrap; align-items:center;">
              <button type="button" class="btn-akademi-secondary" id="btnStudioPlayRef">
                <span>${studioPlaybackCompleted ? '' : (isStudioPlayingRef ? '⏹' : '▶')}</span>
                <span id="studioPlayRefBtnText">${studioPlaybackCompleted ? 'Tekrar Dinle' : (isStudioPlayingRef ? 'Tilaveti Durdur' : 'Seçilen Kâriyi Dinle')}</span>
              </button>
              <button type="button" class="btn-akademi-primary btn-record-studio" id="btnStudioRecord">
                <span>⏺</span>
                <span id="studioRecordBtnText">${isStudioRecording ? '⏹ Kaydı Bitir & Karşılaştır' : 'Kayıt Al & Karşılaştır'}</span>
              </button>
            </div>
          </div>

          <!-- Mod Seçici Şeridi: Seçkin Mod vs 114 Sûre Universal Mod -->
          <div class="studio-mode-switcher">
            <button type="button" class="studio-mode-btn ${studioSelectionMode === 'presets' ? 'active' : ''}" id="btnStudioModePresets">
              <span>⭐</span> Hazır Âyet Kısayolları
            </button>
            <button type="button" class="studio-mode-btn ${studioSelectionMode === 'universal' ? 'active' : ''}" id="btnStudioModeUniversal">
              <span></span> Tüm Kur'an-ı Kerîm (114 Sûre &amp; 6236 Âyet)
            </button>
          </div>

          <!-- 1. KONTROL GRUBU: Seçkin Model Âyetler Görünümü -->
          <div id="studioPresetsContainer" style="display:${studioSelectionMode === 'presets' ? 'grid' : 'none'}; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; padding:1rem; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.08); border-radius:10px; margin:0 0 1.25rem 0;">
            <div>
              <label style="display:block; font-size:0.75rem; font-weight:700; color:var(--accent-gold); margin-bottom:0.35rem;">MODEL ÂYET SEÇİMİ:</label>
              <select id="studioSelectAyah" class="form-select" style="width:100%; background:#141923; color:#f0f3fa; border:1px solid rgba(229,184,105,0.25); padding:0.5rem; border-radius:6px; font-weight:600;">
                ${MODEL_AYAHS.map(a => `
                  <option value="${a.key}" ${a.key === selectedStudioAyahKey ? 'selected' : ''}>${allSurahsList.find(s => s.no === a.surah)?.name || `Sûre ${a.surah}`} ${a.key}</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label style="display:block; font-size:0.75rem; font-weight:700; color:var(--accent-gold); margin-bottom:0.35rem;">MODEL KÂRİ SEÇİMİ:</label>
              <select id="studioSelectQari" class="form-select" style="width:100%; background:#141923; color:#f0f3fa; border:1px solid rgba(229,184,105,0.25); padding:0.5rem; border-radius:6px; font-weight:600;">
                <option value="minshawi" ${selectedStudioQariKey === 'minshawi' ? 'selected' : ''}>Muhammed Sıddîk el-Minşâvî (Murattal)</option>
                <option value="dossary" ${selectedStudioQariKey === 'dossary' ? 'selected' : ''}>Şeyh Yâsir ed-Devserî (Kâbe İmamı)</option>
                <option value="abdulbasit" ${selectedStudioQariKey === 'abdulbasit' ? 'selected' : ''}>Abdussamed (Mücevved)</option>
                <option value="hussary" ${selectedStudioQariKey === 'hussary' ? 'selected' : ''}>Mahmûd Halîl el-Husarî (Muallem)</option>
                <option value="katami" ${selectedStudioQariKey === 'katami' ? 'selected' : ''}>Nâsır el-Katâmî</option>
                <option value="alafasy" ${selectedStudioQariKey === 'alafasy' ? 'selected' : ''}>Mişârî Râşid el-Afâsî</option>
              </select>
            </div>

            <div style="display:flex; align-items:flex-end;">
              <button type="button" class="btn-sm-action" id="btnStudioMushafLink" style="width:100%; padding:0.6rem; text-align:center;">
                 Bu Âyeti Mushaf'ta Aç
              </button>
            </div>
          </div>

          <!-- 2. KONTROL GRUBU: Tüm Kur'an-ı Kerîm (114 Sûre) Universal Seçici Görünümü -->
          <div id="studioUniversalContainer" style="display:${studioSelectionMode === 'universal' ? 'grid' : 'none'}; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:0.85rem; padding:1rem; background:rgba(0,0,0,0.3); border:1px solid rgba(0,229,255,0.25); border-radius:10px; margin:0 0 1.25rem 0;">
            <div>
              <label style="display:block; font-size:0.75rem; font-weight:700; color:var(--accent-cyan); margin-bottom:0.35rem;">1. SÛRE SEÇİMİ (1-114):</label>
              <select id="studioUniversalSurah" class="form-select" style="width:100%; background:#141923; color:#f0f3fa; border:1px solid rgba(0,229,255,0.3); padding:0.5rem; border-radius:6px; font-weight:600;">
                ${allSurahsList.map(s => `
                  <option value="${s.no}" ${s.no === universalSelectedSurah ? 'selected' : ''}>${s.no}. ${s.name} (${s.arabic || ''}) - ${s.ayahs} Âyet</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label style="display:block; font-size:0.75rem; font-weight:700; color:var(--accent-cyan); margin-bottom:0.35rem;">2. ÂYET SEÇİMİ:</label>
              <select id="studioUniversalAyah" class="form-select" style="width:100%; background:#141923; color:#f0f3fa; border:1px solid rgba(0,229,255,0.3); padding:0.5rem; border-radius:6px; font-weight:600;">
                ${Array.from({ length: activeSurahObj.ayahs || 7 }, (_, i) => i + 1).map(num => `
                  <option value="${num}" ${num === universalSelectedAyah ? 'selected' : ''}>${num}. Âyet</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label style="display:block; font-size:0.75rem; font-weight:700; color:var(--accent-cyan); margin-bottom:0.35rem;">4. MODEL KÂRİ:</label>
              <select id="studioUniversalQari" class="form-select" style="width:100%; background:#141923; color:#f0f3fa; border:1px solid rgba(0,229,255,0.3); padding:0.5rem; border-radius:6px; font-weight:600;">
                <option value="minshawi" ${universalSelectedQari === 'minshawi' ? 'selected' : ''}>Muhammed Sıddîk el-Minşâvî (Murattal)</option>
                <option value="dossary" ${universalSelectedQari === 'dossary' ? 'selected' : ''}>Şeyh Yâsir ed-Devserî (Kâbe İmamı)</option>
                <option value="abdulbasit" ${universalSelectedQari === 'abdulbasit' ? 'selected' : ''}>Abdussamed (Mücevved)</option>
                <option value="hussary" ${universalSelectedQari === 'hussary' ? 'selected' : ''}>Mahmûd Halîl el-Husarî (Muallem)</option>
                <option value="katami" ${universalSelectedQari === 'katami' ? 'selected' : ''}>Nâsır el-Katâmî</option>
                <option value="alafasy" ${universalSelectedQari === 'alafasy' ? 'selected' : ''}>Mişârî Râşid el-Afâsî</option>
              </select>
            </div>

            <div style="display:flex; align-items:flex-end;">
              <button type="button" class="btn-akademi-primary" id="btnLoadUniversalAyah" style="width:100%; padding:0.6rem; text-align:center; background:linear-gradient(135deg, #00e5ff, #0284c7); color:#07090e; font-weight:800; border:none;">
                 Âyeti Getir &amp; Tahlil Et
              </button>
            </div>
          </div>

          <!-- Seçili Âyetin Metin Vitrini & Telemetri Çubuğu -->
          <div style="text-align:center; padding:1.25rem 1.25rem; background:rgba(229,184,105,0.06); border:1px solid rgba(229,184,105,0.25); border-radius:12px; margin-bottom:1.25rem; position:relative;">
            <div style="font-size:0.85rem; font-weight:700; color:var(--text-muted); margin-bottom:0.4rem;" id="studioAyahTitle">
              ${activeAyahMeta.label}
            </div>
            <div id="studioAyahArabic" style="font-family:'Amiri', 'Scheherazade New', serif; font-size:2.35rem; color:var(--accent-gold); line-height:1.45; direction:rtl; unicode-bidi:isolate;" lang="ar">
              ${activeAyahMeta.text}
            </div>
            <div id="studioAyahMeal" style="font-size:0.88rem; color:#cbd5e1; margin-top:0.65rem; line-height:1.55; max-width:850px; margin-left:auto; margin-right:auto; font-style:italic;">
              "${activeAyahMeta.meal}"
            </div>

            <div class="studio-telemetry-strip" style="justify-content:center;">
              <span class="studio-telemetry-pill gold" id="studioMakamBadge">
                 Makam: Uzman etiketlemesi yok
              </span>
              <span class="studio-telemetry-pill cyan" id="studioAudioDurationBadge">
                ⏱ Gerçek ses süresi: ${studioAudioRealDurationMs ? (studioAudioRealDurationMs / 1000).toFixed(1) + 's' : 'Ses analiz ediliyor…'}
              </span>
              <span class="studio-telemetry-pill green" id="studioActivePitchBadge">
                 Alt-perde referansı: Ses kaydından ölçülecek
              </span>
              <span class="studio-telemetry-pill" id="studioStatusBadge" style="${studioPlaybackCompleted ? 'color:#00e676; border-color:rgba(0,230,118,0.4);' : ''}">
                ${studioPlaybackCompleted ? '✅ Tamamlandı (%100)' : (isStudioPlayingRef ? '▶ Oynatılıyor...' : ' Dinlemeye Hazır')}
              </span>
            </div>
          </div>

          <!-- HTML5 Canvas Çift Konturlu Görselleştirici -->
          <div class="pitch-canvas-wrap">
            <div style="display:flex; justify-content:space-between; align-items:center; padding:0.65rem 1.25rem; background:rgba(0,0,0,0.4); font-size:0.78rem; border-bottom:1px solid rgba(255,255,255,0.08); flex-wrap:wrap; gap:0.5rem;">
              <div style="display:flex; gap:1.25rem; flex-wrap:wrap;">
                <span style="color:var(--accent-gold); font-weight:700;">● Kaynak kayıttan çıkarılan F0 konturu</span>
                <span style="color:var(--accent-green); font-weight:700;">● Sizin F0 konturunuz</span>
              </div>
              <span style="color:var(--text-muted); font-family:'JetBrains Mono', monospace;" id="studioCanvasTimeScale">Zaman vs göreli F0 (cent)</span>
            </div>
            <canvas id="studioPitchCanvas" class="pitch-canvas" width="800" height="230"></canvas>
            <div id="studioContourStatus" role="status" aria-live="polite" style="padding:0.5rem 1rem; color:var(--text-muted); font-size:0.78rem;">Kaynak ses analiz ediliyor…</div>
          </div>

          <!-- Gerçek DTW 4-Metrik Karnesi -->
          <div class="akademi-card" id="studioScoreCard" style="margin-top:1.25rem; padding:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
              <div>
                <span class="card-badge gold">TİLAVET VE SEYİR KARNESİ</span>
                <span style="font-size:0.8rem; color:var(--text-muted); margin-left:0.5rem;">Sakoe-Chiba DTW Hesaplama Sonucu</span>
              </div>
              <span class="card-badge ${dtwEvaluationResult ? 'green' : 'cyan'}" id="studioVerdictBadge">
                ${dtwEvaluationResult ? `Ortalama Sapma: ±${dtwEvaluationResult.meanCentsDiff} cent` : 'Henüz kayıt alınmadı'}
              </span>
            </div>

            <div class="metric-quad-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:0.75rem; margin-bottom:0.75rem;">
              <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:0.75rem; border-radius:8px;">
                <div style="font-size:0.7rem; color:var(--text-muted); font-weight:700;">1. PERDE UYUMU</div>
                <div style="font-size:1.35rem; font-weight:800; color:var(--accent-green); margin-top:0.2rem;" id="studioScorePitch">
                  ${dtwEvaluationResult ? `%${dtwEvaluationResult.pitchScore}` : '—'}
                </div>
                <div style="font-size:0.72rem; color:var(--text-muted);">Cent sapması</div>
              </div>

              <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:0.75rem; border-radius:8px;">
                <div style="font-size:0.7rem; color:var(--text-muted); font-weight:700;">2. KONTUR / SEYİR</div>
                <div style="font-size:1.35rem; font-weight:800; color:var(--accent-gold); margin-top:0.2rem;" id="studioScoreContour">
                  ${dtwEvaluationResult ? `%${dtwEvaluationResult.contourScore}` : '—'}
                </div>
                <div style="font-size:0.72rem; color:var(--text-muted);">Makam seyr-i dengesi</div>
              </div>

              <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:0.75rem; border-radius:8px;">
                <div style="font-size:0.7rem; color:var(--text-muted); font-weight:700;">3. ZAMANLAMA &amp; TEMPO</div>
                <div style="font-size:1.35rem; font-weight:800; color:var(--accent-cyan); margin-top:0.2rem;" id="studioScoreTiming">
                  ${dtwEvaluationResult ? `%${dtwEvaluationResult.timingScore}` : '—'}
                </div>
                <div style="font-size:0.72rem; color:var(--text-muted);">DTW yol uyumu</div>
              </div>

              <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:0.75rem; border-radius:8px;">
                <div style="font-size:0.7rem; color:var(--text-muted); font-weight:700;">4. TOLERANS KORİDORU</div>
                <div style="font-size:1.35rem; font-weight:800; color:#b388ff; margin-top:0.2rem;" id="studioScoreCorridor">
                  ${dtwEvaluationResult ? `%${dtwEvaluationResult.corridorScore}` : '—'}
                </div>
                <div style="font-size:0.72rem; color:var(--text-muted);">Yazılım eşiği: ±40 cent</div>
              </div>
            </div>

            <div style="font-size:0.85rem; color:#cbd5e1; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.6rem;" id="studioVerdictText">
              ${dtwEvaluationResult ? dtwEvaluationResult.verdict : 'Referans sesini dinleyin; âyeti mikrofona okuyun ve okuyuş tamamlanınca kaydı durdurup karşılaştırın.'}
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // İSTASYON 4: CANLI SPEKTRUM VE REZONANS ANALİZİ
    // =========================================================================
    else if (activeStudioStation === 'spectrum') {
      stationContentHtml = `
        <div class="akademi-card">
          <div class="card-headline">
            <div>
              <span class="card-badge cyan">FREKANS &amp; REZONANS LABORATUVARI</span>
              <h3 class="card-title">Canlı FFT Spektrumu &amp; Ses Tınısı Analizörü</h3>
              <p class="card-desc">Sesinizin göğüs tokluğu (karar rezonansı), boğaz mahreç netliği ve geniz (hayşûm/ğunne) frekans dağılımını canlı izleyin.</p>
            </div>
          </div>

          <!-- Canlı Spektrum & Osiloskop Canvas -->
          <div class="spectrum-canvas-wrap" style="height:260px; margin:1rem 0;">
            <canvas id="studioSpectrumCanvas" class="spectrum-canvas" width="800" height="260"></canvas>
          </div>

          <!-- 3 Rezonans Bölgesi Canlı Barı -->
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; margin-top:1.25rem;">
            
            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:1rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <strong style="color:var(--accent-gold);"> 1. Göğüs Rezonansı</strong>
                <span class="card-badge gold" style="font-size:0.68rem;">100 - 300 Hz</span>
              </div>
              <div style="font-size:0.8rem; color:#8a94a6; line-height:1.45;">
                Sesin gövdesi ve karar perdesindeki tokluk. Karar seslerinde güçlü olması beklenir.
              </div>
              <div style="background:rgba(0,0,0,0.4); height:8px; border-radius:4px; margin-top:0.75rem; overflow:hidden;">
                <div id="barChestResonance" style="height:100%; width:45%; background:var(--accent-gold); transition:width 0.1s ease;"></div>
              </div>
            </div>

            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:1rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <strong style="color:var(--accent-green);"> 2. Boğaz &amp; Ağız Mahreci</strong>
                <span class="card-badge green" style="font-size:0.68rem;">300 - 1500 Hz</span>
              </div>
              <div style="font-size:0.8rem; color:#8a94a6; line-height:1.45;">
                Harf mahreçlerinin (F1 &amp; F2 formantları) artikülasyon netliği ve berraklığı.
              </div>
              <div style="background:rgba(0,0,0,0.4); height:8px; border-radius:4px; margin-top:0.75rem; overflow:hidden;">
                <div id="barThroatResonance" style="height:100%; width:60%; background:var(--accent-green); transition:width 0.1s ease;"></div>
              </div>
            </div>

            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:1rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <strong style="color:var(--accent-cyan);"> 3. Hayşûm (Ğunne Tınısı)</strong>
                <span class="card-badge cyan" style="font-size:0.68rem;">1500 - 3500 Hz</span>
              </div>
              <div style="font-size:0.8rem; color:#8a94a6; line-height:1.45;">
                Nûn ve Mîm harflerindeki geniz akışı (ğunne) ve tiz harmonik ışıltısı.
              </div>
              <div style="background:rgba(0,0,0,0.4); height:8px; border-radius:4px; margin-top:0.75rem; overflow:hidden;">
                <div id="barNasalResonance" style="height:100%; width:35%; background:var(--accent-cyan); transition:width 0.1s ease;"></div>
              </div>
            </div>

          </div>
        </div>
      `;
    }

    // İlmî / Fıkhî Güvence Bildirimi
    const theologicalDisclaimerHtml = `
      <div class="tl-disclaimer-alert" style="background:rgba(229,184,105,0.08); border:1px solid rgba(229,184,105,0.25); border-left:4px solid var(--accent-gold); border-radius:8px; padding:0.9rem 1.25rem; display:flex; gap:0.85rem; align-items:flex-start; margin-top:1.25rem; color:#cbd5e1; font-size:0.82rem; line-height:1.55;">
        <span style="font-size:1.3rem;">⚠</span>
        <div>
          <strong style="color:var(--accent-gold);">İLMÎ VE AKUSTİK BİLDİRİM:</strong>
          Bu laboratuvardaki akustik analizler (F0 perde takibi, DTW eğri mukayesesi ve spektrum tahlili), öğrencinin ses kontrolünü ve makam kulağını geliştirmesi için tasarlanmış yardımcı bir eğitim teknolojisidir. Kur'an tilavetinin aslı, harf mahreçlerinin ve tecvid sıfatlarının sıhhatidir; bu ise yalnızca ehil bir <strong>fem-i muhsin (icazetli kıraat hocası)</strong> huzurunda meşk edilerek tescillenebilir. Akustik skorlar kesinlikle icazet veya salahiyet belgesi yerine geçmez.
        </div>
      </div>
    `;

    // Ana Konteyner DOM Montajı
    container.innerHTML = `
      <div class="studio-layout-wrap">
        ${subNavHtml}
        ${guideBannerHtml}
        <div class="studio-station-body" style="margin-top:0.5rem;">
          ${stationContentHtml}
        </div>
        ${theologicalDisclaimerHtml}
      </div>
    `;

    // =========================================================================
    // ETKİLEŞİM DİNLEYİCİLERİ
    // =========================================================================

    // 1. İstasyon Geçiş Butonları
    container.querySelectorAll('.studio-station-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        activeStudioStation = pill.getAttribute('data-station') || 'tuner';
        renderStudyoView();
        updateExecutiveBarAndDrawer('studyo');
      });
    });

    // 1.5. Okuma Penceresi (Odak Modu - v4.0.0 Modal) Butonu
    const openSelectedAyahFocusModal = () => {
      const [surah, ayah] = selectedStudioAyahKey.split(':').map(Number);
      const audioUrl = window.getAyahAudioUrl?.(surah, ayah, selectedStudioQariKey);
      const reference = window.TilavetAudioLab?.contourAnalyzer?.getReference(selectedStudioAyahKey, selectedStudioQariKey);
      if (!reference) {
        if (window.showToast) window.showToast('Odak penceresi için önce seçilen âyetin gerçek ses konturu yüklenmelidir.');
        return;
      }
      if (typeof window.openReadingFocusModal === 'function') {
        window.openReadingFocusModal({
          surah,
          ayah,
          surahName: window.SURAH_LIST?.find(item => item.no === surah)?.name || `Sûre ${surah}`,
          makamName: 'Makam etiketi uzman tarafından doğrulanmamış',
          arabicText: document.getElementById('studioAyahArabic')?.textContent || '',
          transcription: `${surah}:${ayah}`,
          tecvidNote: 'Akustik kontur F0 ölçümüdür; tecvid ve mahreç doğrulaması için ehil hocaya başvurunuz.',
          audioUrl,
          audioDurationSeconds: reference.durationMs / 1000,
          anchorHz: reference.anchorHz,
          samples: reference.points.map(point => ({
            t: point.t / 1000,
            hz: point.hz,
            cent: point.cents
          }))
        });
      }
    };
    window.openSelectedAyahFocusModal = openSelectedAyahFocusModal;
    document.getElementById('btnLaunchFocusModal')?.addEventListener('click', openSelectedAyahFocusModal);

    // 2. Canlı Mikrofon Butonu
    const btnToggleMic = document.getElementById('btnStudioToggleMic');
    const micBtnText = document.getElementById('studioMicBtnText');
    const micIcon = document.getElementById('studioMicIcon');
    const noteDisplay = document.getElementById('studioNoteDisplay');
    const freqDisplay = document.getElementById('studioFreqDisplay');
    const needle = document.getElementById('studioGaugeNeedle');
    const statusText = document.getElementById('studioTunerStatus');
    const komaPill = document.getElementById('studioKomaPill');
    const meddBars = container.querySelectorAll('.medd-bar');
    const meddText = document.getElementById('studioMeddElifValue');

    let meddActive = false;
    let meddStartTime = 0;

    btnToggleMic?.addEventListener('click', async () => {
      if (!isStudioMicActive) {
        try {
          if (window.TilavetAudioLab?.pitchDetector) {
            await window.TilavetAudioLab.pitchDetector.start((data) => {
              if (data.detected) {
                if (noteDisplay) noteDisplay.textContent = data.note;
                if (freqDisplay) freqDisplay.textContent = `${data.freq.toFixed(1)} Hz`;

                const clamped = Math.max(-50, Math.min(50, data.cents));
                const leftPercent = 50 + (clamped / 50) * 45;
                if (needle) needle.style.left = `${leftPercent}%`;

                const koma = Math.round(data.cents / 22.64);
                if (komaPill) komaPill.textContent = `${koma > 0 ? '+' : ''}${koma} koma (${data.cents > 0 ? '+' : ''}${data.cents} c)`;

                if (statusText) {
                  if (data.inTune) {
                    statusText.textContent = "Tam Karar / Dengeli Perde (±15 cent)";
                    statusText.style.color = "var(--accent-green)";
                  } else {
                    statusText.textContent = data.cents > 0 ? "Biraz Tiz (Sesinizi hafifçe indirin)" : "Biraz Pest (Sesinizi hafifçe yükseltin)";
                    statusText.style.color = "var(--accent-gold)";
                  }
                }

                // Medd Takibi (İstasyon 2)
                if (!meddActive) {
                  meddActive = true;
                  meddStartTime = Date.now();
                } else {
                  const elapsedMs = Date.now() - meddStartTime;
                  const evalData = window.TilavetAudioLab?.meddTimer.evaluateElifAmount(elapsedMs);
                  if (evalData && meddText) {
                    meddText.textContent = `${evalData.elif} Elif · ${elapsedMs} ms (${evalData.text})`;
                    meddText.style.color = evalData.color;

                    meddBars.forEach((bar, idx) => {
                      if (idx < evalData.elif) bar.classList.add('active');
                      else bar.classList.remove('active');
                    });
                  }
                }

                // DTW Kayıt Örneklemesi
                if (isStudioRecording) {
                  userStudioPitchSamples.push({
                    t: userStudioPitchSamples.length * 60,
                    cents: data.cents
                  });
                }

              } else {
                if (needle) needle.style.left = "50%";
                if (statusText) {
                  statusText.textContent = "Ses bekleniyor… Lütfen mikrofona okuyun";
                  statusText.style.color = "var(--text-muted)";
                }
                meddActive = false;
                meddBars.forEach(bar => bar.classList.remove('active'));
              }
            });

            isStudioMicActive = true;
            if (micBtnText) micBtnText.textContent = "Mikrofonu Durdur";
            if (micIcon) micIcon.textContent = "⏹";
            btnToggleMic.classList.add('alert');
            if (window.showToast) window.showToast(" Mikrofon devrede. Sesiniz gerçek zamanlı analiz ediliyor.");
          }
        } catch (err) {
          alert("Mikrofon izni alınamadı. Tarayıcınızdan mikrofon erişimine izin veriniz.");
        }
      } else {
        window.TilavetAudioLab?.pitchDetector.stop();
        isStudioMicActive = false;
        if (micBtnText) micBtnText.textContent = "Canlı Mikrofonu Başlat";
        if (micIcon) micIcon.textContent = "";
        btnToggleMic.classList.remove('alert');
        meddBars.forEach(bar => bar.classList.remove('active'));
        if (window.showToast) window.showToast("Mikrofon durduruldu.");
      }
    });

    // 3. Karar Drone Sentezleyicisi (İstasyon 1)
    const btnToggleDrone = document.getElementById('btnStudioToggleDrone');
    const droneBtnText = document.getElementById('studioDroneBtnText');
    const droneIcon = document.getElementById('studioDroneIcon');

    btnToggleDrone?.addEventListener('click', () => {
      if (!isStudioDroneActive) {
        if (window.TilavetAudioLab?.drone) {
          const preset = window.TilavetAudioLab.drone.startMakam(activeKararMakam, activeKararTimbre);
          isStudioDroneActive = true;
          if (droneBtnText) droneBtnText.textContent = "Dem Sesini Durdur";
          if (droneIcon) droneIcon.textContent = "⏹";
          if (window.showToast) window.showToast(` ${preset.name} dem sesi başlatıldı.`);
        }
      } else {
        window.TilavetAudioLab?.drone.stop();
        isStudioDroneActive = false;
        if (droneBtnText) droneBtnText.textContent = "Karar Sesini Çal";
        if (droneIcon) droneIcon.textContent = "";
        if (window.showToast) window.showToast("Karar sesi durduruldu.");
      }
    });

    container.querySelectorAll('.btn-makam-karar').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.btn-makam-karar').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeKararMakam = btn.getAttribute('data-makam') || 'ussak';
        if (isStudioDroneActive && window.TilavetAudioLab?.drone) {
          const preset = window.TilavetAudioLab.drone.startMakam(activeKararMakam, activeKararTimbre);
          if (window.showToast) window.showToast(` Karar perdesi değiştirildi: ${preset.name}`);
        }
      });
    });

    container.querySelectorAll('.btn-timbre-select').forEach(btn => {
      btn.addEventListener('click', () => {
        activeKararTimbre = btn.getAttribute('data-timbre') || 'tanbur';
        if (isStudioDroneActive && window.TilavetAudioLab?.drone) {
          window.TilavetAudioLab.drone.startMakam(activeKararMakam, activeKararTimbre);
        }
        renderStudyoView();
      });
    });

    // 4. Tempo Butonları (İstasyon 2)
    container.querySelectorAll('.btn-tempo-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        activeStudioTempoMode = btn.getAttribute('data-mode') || 'tertil';
        if (window.TilavetAudioLab?.meddTimer) {
          window.TilavetAudioLab.meddTimer.setMode(activeStudioTempoMode);
        }
        renderStudyoView();
      });
    });

    // Medd Örnek Kartları Hakiki Tilavet Sesi Çalma (Sağdan Sola Kur'anî Sıra)
    container.querySelectorAll('.btn-play-med-sample').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ayahRef = btn.getAttribute('data-ayah') || '2:30';
        const word = btn.getAttribute('data-word') || '';
        const arWord = btn.getAttribute('data-ar') || '';
        const parts = ayahRef.split(':').map(Number);
        const surah = parts[0] || 1;
        const ayah = parts[1] || 1;

        if (activeTeknikAudio && !activeTeknikAudio.paused) {
          activeTeknikAudio.pause();
          activeTeknikAudio = null;
        }

        const audioUrl = getEveryAyahAudioUrl(surah, ayah, 'husary');
        if (typeof window.TilavetAudioManager !== 'undefined') {
          window.TilavetAudioManager.notifyPlay('studyo');
        }

        const audio = new Audio(audioUrl);
        activeTeknikAudio = audio;
        btn.innerHTML = `<span class="audio-spinner">⏹</span> Çalıyor...`;

        audio.play().catch(err => {
          console.warn('Medd örneği sesi çalınamadı:', err);
          if (window.TilavetAudioLab?.drone) {
            window.TilavetAudioLab.drone.playSingleNote(220, 1.8);
          }
        });

        audio.onended = () => {
          btn.innerHTML = `<span></span> Hakiki Tilavet`;
          if (activeTeknikAudio === audio) activeTeknikAudio = null;
        };

        audio.onerror = () => {
          btn.innerHTML = `<span></span> Hakiki Tilavet`;
          if (activeTeknikAudio === audio) activeTeknikAudio = null;
          if (window.TilavetAudioLab?.drone) {
            window.TilavetAudioLab.drone.playSingleNote(220, 1.8);
          }
        };

        if (window.showToast) {
          window.showToast(` "${arWord}" (${word} - Âyet ${ayahRef}) Şeyh Husarî talimiyle seslendiriliyor...`);
        }
      });
    });

    // Medd Kartını Aktif Talim Hedefi Olarak Seçme
    container.querySelectorAll('.btn-practice-med-card, .btn-select-med-target').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-idx'), 10) || 0;
        const item = MEDD_PRACTICE_EXAMPLES[idx];
        if (!item) return;

        selectedMeddPracticeIdx = idx;

        // Kartların aktif durumunu güncelle
        container.querySelectorAll('.btn-practice-med-card').forEach((c, cIdx) => {
          if (cIdx === idx) {
            c.classList.add('is-selected');
            c.style.borderColor = 'var(--accent-gold)';
            c.style.boxShadow = '0 0 18px rgba(229,184,105,0.35)';
          } else {
            c.classList.remove('is-selected');
            c.style.borderColor = '';
            c.style.boxShadow = '';
          }
        });

        // Üst Sayaç Göstergesini Güncelle
        const statusText = document.getElementById('studioMeddStatusText');
        if (statusText) {
          statusText.innerHTML = ` <strong>Hedef:</strong> <span style="font-family:'Amiri', serif; font-size:1.3rem; color:var(--accent-gold); margin:0 0.35rem;">${item.word}</span> (${item.latin}) · Hedef Ölçü: <strong style="color:var(--accent-green);">${item.targetElif} Elif</strong> (Âyet ${item.ayah})`;
        }

        // Barlarda hedefi görsel olarak yak
        const bars = document.querySelectorAll('#studioMeddBars .medd-bar');
        bars.forEach(bar => {
          const eVal = parseInt(bar.getAttribute('data-elif'), 10) || 1;
          if (eVal <= item.targetElif) {
            bar.classList.add('target-active');
            bar.style.opacity = '1';
            bar.style.borderColor = 'var(--accent-gold)';
          } else {
            bar.classList.remove('target-active');
            bar.style.opacity = '0.35';
            bar.style.borderColor = '';
          }
        });

        if (window.showToast) {
          window.showToast(` ${item.orderNum}. Örnek "${item.word}" (${item.latin}) hedef olarak belirlendi.`);
        }
      });
    });

    // 5. Kurrâ Mukayesesi & Canvas Çizimi (İstasyon 3)
    if (activeStudioStation === 'kurra') {
      const pitchCanvas = document.getElementById('studioPitchCanvas');
      const pCtx = (pitchCanvas && typeof pitchCanvas.getContext === 'function') ? pitchCanvas.getContext('2d') : null;

      function renderPitchContourCanvas(playheadMs = null, isPlayingRef = false) {
        if (!pCtx || !pitchCanvas) return;
        const dpr = window.devicePixelRatio || 1;
        const rect = pitchCanvas.getBoundingClientRect();
        const displayWidth = rect.width > 0 ? Math.floor(rect.width) : 800;
        const displayHeight = 230;

        if (pitchCanvas.width !== displayWidth * dpr || pitchCanvas.height !== displayHeight * dpr) {
          pitchCanvas.width = displayWidth * dpr;
          pitchCanvas.height = displayHeight * dpr;
        }

        pCtx.save();
        pCtx.scale(dpr, dpr);
        const w = displayWidth;
        const h = displayHeight;

        // Arka Plan
        pCtx.fillStyle = "#0c1017";
        pCtx.fillRect(0, 0, w, h);

        const padLeft = 70;
        const padRight = 25;
        const padTop = 25;
        const padBottom = 30;
        const plotW = Math.max(10, w - padLeft - padRight);
        const plotH = Math.max(10, h - padTop - padBottom);

        const refData = window.TilavetAudioLab?.contourAnalyzer?.getReference(selectedStudioAyahKey, selectedStudioQariKey) || null;
        const lastUserSample = userStudioPitchSamples[userStudioPitchSamples.length - 1];
        const maxT = Math.max(refData?.durationMs || 0, lastUserSample?.t || 0, 1000);
        const values = [];
        (refData?.points || []).forEach(point => values.push(point.cents));
        userStudioPitchSamples.forEach(point => values.push(point.cents));
        let minValue = values.length ? values[0] : -200;
        let maxValue = values.length ? values[0] : 800;
        values.forEach(value => {
          minValue = Math.min(minValue, value);
          maxValue = Math.max(maxValue, value);
        });
        let minCents = Math.floor((minValue - 100) / 200) * 200;
        let maxCents = Math.ceil((maxValue + 100) / 200) * 200;
        if (maxCents - minCents < 400) {
          minCents -= 200;
          maxCents += 200;
        }

        const tToX = (t) => padLeft + (Math.max(0, Math.min(maxT, t)) / maxT) * plotW;
        const centsToY = (c) => padTop + plotH - ((c - minCents) / (maxCents - minCents)) * plotH;

        for (let cents = minCents; cents <= maxCents; cents += 200) {
          const y = centsToY(cents);
          pCtx.strokeStyle = cents === 0 ? "rgba(229, 184, 105, 0.4)" : "rgba(255, 255, 255, 0.08)";
          pCtx.lineWidth = cents === 0 ? 1.5 : 1;
          pCtx.setLineDash(cents === 0 ? [] : [3, 4]);
          pCtx.beginPath();
          pCtx.moveTo(padLeft, y);
          pCtx.lineTo(w - padRight, y);
          pCtx.stroke();
          pCtx.setLineDash([]);
          pCtx.fillStyle = cents === 0 ? "#e5b869" : "rgba(255, 255, 255, 0.4)";
          pCtx.font = "10px Inter, sans-serif";
          pCtx.textAlign = "right";
          pCtx.fillText(`${cents > 0 ? "+" : ""}${cents} c`, padLeft - 6, y + 3);
        }

        // 2. Zaman Eksen Çizgileri
        const timeStep = maxT > 6000 ? 2000 : 1000;
        for (let t = 0; t <= maxT; t += timeStep) {
          const x = tToX(t);
          pCtx.strokeStyle = "rgba(255, 255, 255, 0.05)";
          pCtx.beginPath();
          pCtx.moveTo(x, padTop);
          pCtx.lineTo(x, padTop + plotH);
          pCtx.stroke();

          pCtx.fillStyle = "rgba(255, 255, 255, 0.45)";
          pCtx.font = "10px 'JetBrains Mono', monospace";
          pCtx.textAlign = "center";
          pCtx.fillText(`${(t / 1000).toFixed(1)}s`, x, h - 10);
        }

        const drawContour = (points, color, width) => {
          if (!points || points.length < 2) return;
          pCtx.strokeStyle = color;
          pCtx.lineWidth = width;
          pCtx.lineCap = "round";
          pCtx.lineJoin = "round";
          pCtx.beginPath();
          let previousPoint = null;
          points.forEach(point => {
            if (!Number.isFinite(point.cents)) return;
            const x = tToX(point.t);
            const y = centsToY(point.cents);
            if (!previousPoint || point.t - previousPoint.t > 160) pCtx.moveTo(x, y);
            else pCtx.lineTo(x, y);
            previousPoint = point;
          });
          pCtx.stroke();
        };

        drawContour(refData?.points, "#e5b869", 3);

        // Kullanıcı F0 konturu
        if (userStudioPitchSamples && userStudioPitchSamples.length > 0) {
          pCtx.shadowColor = "rgba(0, 230, 118, 0.5)";
          pCtx.shadowBlur = 8;
          drawContour(userStudioPitchSamples, "#00e676", 3.5);
          pCtx.shadowBlur = 0;

          const lastPt = userStudioPitchSamples[userStudioPitchSamples.length - 1];
          pCtx.fillStyle = "#ffffff";
          pCtx.beginPath();
          pCtx.arc(tToX(lastPt.t), centsToY(lastPt.cents), 5, 0, Math.PI * 2);
          pCtx.fill();
          pCtx.strokeStyle = "#00e676";
          pCtx.lineWidth = 2;
          pCtx.stroke();
        } else if (!refData && !isStudioRecording) {
          pCtx.fillStyle = "rgba(255, 255, 255, 0.25)";
          pCtx.font = "12px Inter, sans-serif";
          pCtx.textAlign = "center";
          pCtx.fillText("Gerçek kaynak ses yüklenmeden kontur gösterilmez", w / 2, h / 2 + 10);
        }

        // 6. Oynatma veya Kayıt İmleci (Playhead)
        if (playheadMs !== null && playheadMs >= 0) {
          const curX = tToX(playheadMs);
          pCtx.strokeStyle = isPlayingRef ? "#ffd700" : "#ff3366";
          pCtx.lineWidth = 2;
          pCtx.setLineDash([4, 4]);
          pCtx.beginPath();
          pCtx.moveTo(curX, padTop);
          pCtx.lineTo(curX, padTop + plotH);
          pCtx.stroke();
          pCtx.setLineDash([]);

          pCtx.fillStyle = isPlayingRef ? "#ffd700" : "#ff3366";
          pCtx.beginPath();
          pCtx.arc(curX, padTop, 5, 0, Math.PI * 2);
          pCtx.fill();
        }

        pCtx.restore();
      }

      renderPitchContourCanvas();

      async function loadStudioAyahSource() {
        const key = selectedStudioAyahKey;
        const [surah, ayah] = key.split(':').map(Number);
        const requestId = ++studioContourRequestId;
        studioPlaybackCompleted = false;
        const statusEl = document.getElementById('studioContourStatus');
        const durationEl = document.getElementById('studioAudioDurationBadge');
        const pitchEl = document.getElementById('studioActivePitchBadge');
        const titleEl = document.getElementById('studioAyahTitle');
        const arabicEl = document.getElementById('studioAyahArabic');
        const mealEl = document.getElementById('studioAyahMeal');
        const audioUrl = window.getAyahAudioUrl?.(surah, ayah, selectedStudioQariKey);

        studioAudioRealDurationMs = null;
        if (durationEl) durationEl.textContent = '⏱ Gerçek ses süresi: yükleniyor…';
        if (pitchEl) pitchEl.textContent = ' Alt-perde referansı: kaynak ses çözümleniyor…';
        if (titleEl) titleEl.textContent = `${window.SURAH_LIST?.find(item => item.no === surah)?.name || `Sûre ${surah}`} Sûresi ${key}`;
        if (arabicEl) arabicEl.textContent = 'Âyet metni kaynaktan yükleniyor…';
        if (mealEl) mealEl.textContent = '';
        if (statusEl) statusEl.textContent = 'Seçilen âyetin ses kaydı indiriliyor ve gerçek F0 konturu çıkarılıyor…';
        renderPitchContourCanvas();

        const textRequest = fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/quran-uthmani,tr.diyanet`)
          .then(response => {
            if (!response.ok) throw new Error(`Âyet metni kaynağı HTTP ${response.status} yanıtı verdi.`);
            return response.json();
          })
          .then(json => {
            if (json.code !== 200 || !Array.isArray(json.data) || json.data.length < 2 ||
                typeof json.data[0]?.text !== 'string' || typeof json.data[1]?.text !== 'string') {
              throw new Error('Âyet metni kaynağından beklenen Arapça metin ve meal alınamadı.');
            }
            if (requestId !== studioContourRequestId) return;
            if (arabicEl) arabicEl.textContent = json.data[0].text;
            if (mealEl) mealEl.textContent = `“${json.data[1].text}”`;
          });

        const analyzer = window.TilavetAudioLab?.contourAnalyzer;
        const contourRequest = audioUrl && typeof analyzer?.loadReference === 'function'
          ? analyzer.loadReference(key, selectedStudioQariKey, audioUrl)
          : Promise.reject(new Error('Seçilen kâri için EveryAyah ses adresi veya analiz motoru oluşturulamadı.'));

        const [textResult, contourResult] = await Promise.allSettled([textRequest, contourRequest]);
        if (requestId !== studioContourRequestId) return;

        if (textResult.status === 'rejected') {
          console.error('Stüdyo âyet metni yüklenemedi:', textResult.reason);
          if (arabicEl) arabicEl.textContent = 'Âyet metni yüklenemedi.';
          if (mealEl) mealEl.textContent = 'Kaynak metne şu anda erişilemiyor.';
        }
        if (contourResult.status === 'rejected') {
          console.error('Referans ses konturu yüklenemedi:', contourResult.reason);
          if (statusEl) statusEl.textContent = `Kontur oluşturulamadı: ${contourResult.reason?.message || 'Ses kaynağına erişilemiyor.'} Referans çizgi ve DTW puanı gösterilmez; tilavet oynatımı yine kullanılabilir.`;
          renderPitchContourCanvas();
          return;
        }

        const reference = contourResult.value;
        studioAudioRealDurationMs = reference.durationMs;
        if (durationEl) durationEl.textContent = `⏱ Gerçek ses süresi: ${(reference.durationMs / 1000).toFixed(2)} s`;
        if (pitchEl) pitchEl.textContent = ` Ses alt-perde referansı: ${reference.anchorHz.toFixed(1)} Hz`;
        if (statusEl) {
          statusEl.textContent = `${reference.qariKey} · ${key} · ${reference.sampleCount} F0 örneği · alt %20 ses aralığı referans alınmıştır. Grafik makam etiketi veya uzman hükmü değildir.`;
        }
        renderPitchContourCanvas();
      }

      function stopStudioReferencePlayback() {
        if (!isStudioPlayingRef) return;
        const player = window.TilavetState?.audioPlayer;
        if (player && !player.paused) player.pause();
        isStudioPlayingRef = false;
        if (studioPlayheadAnimId) cancelAnimationFrame(studioPlayheadAnimId);
        studioPlayheadAnimId = null;
      }

      void loadStudioAyahSource();

      document.getElementById('btnStudioModePresets')?.addEventListener('click', () => {
        stopStudioReferencePlayback();
        studioSelectionMode = 'presets';
        const firstPreset = MODEL_AYAHS.find(item => item.key === selectedStudioAyahKey) || MODEL_AYAHS[0];
        selectedStudioAyahKey = firstPreset.key;
        selectedStudioQariKey = document.getElementById('studioSelectQari')?.value || selectedStudioQariKey;
        userStudioPitchSamples = [];
        dtwEvaluationResult = null;
        studioPlaybackCompleted = false;
        renderStudyoView();
      });

      document.getElementById('btnStudioModeUniversal')?.addEventListener('click', () => {
        stopStudioReferencePlayback();
        studioSelectionMode = 'universal';
        selectedStudioAyahKey = `${universalSelectedSurah}:${universalSelectedAyah}`;
        selectedStudioQariKey = universalSelectedQari;
        userStudioPitchSamples = [];
        dtwEvaluationResult = null;
        studioPlaybackCompleted = false;
        renderStudyoView();
      });

      document.getElementById('studioUniversalSurah')?.addEventListener('change', (event) => {
        stopStudioReferencePlayback();
        universalSelectedSurah = Number(event.target.value);
        universalSelectedAyah = 1;
        selectedStudioAyahKey = `${universalSelectedSurah}:1`;
        userStudioPitchSamples = [];
        dtwEvaluationResult = null;
        studioPlaybackCompleted = false;
        renderStudyoView();
      });

      document.getElementById('studioUniversalAyah')?.addEventListener('change', (event) => {
        stopStudioReferencePlayback();
        universalSelectedAyah = Number(event.target.value);
        selectedStudioAyahKey = `${universalSelectedSurah}:${universalSelectedAyah}`;
        userStudioPitchSamples = [];
        dtwEvaluationResult = null;
        studioPlaybackCompleted = false;
        renderStudyoView();
      });

      document.getElementById('studioUniversalQari')?.addEventListener('change', (event) => {
        stopStudioReferencePlayback();
        universalSelectedQari = event.target.value;
        selectedStudioQariKey = universalSelectedQari;
        userStudioPitchSamples = [];
        dtwEvaluationResult = null;
        studioPlaybackCompleted = false;
        renderStudyoView();
      });

      document.getElementById('btnLoadUniversalAyah')?.addEventListener('click', () => {
        stopStudioReferencePlayback();
        studioSelectionMode = 'universal';
        universalSelectedSurah = Number(document.getElementById('studioUniversalSurah')?.value || universalSelectedSurah);
        universalSelectedAyah = Number(document.getElementById('studioUniversalAyah')?.value || universalSelectedAyah);
        universalSelectedQari = document.getElementById('studioUniversalQari')?.value || universalSelectedQari;
        selectedStudioAyahKey = `${universalSelectedSurah}:${universalSelectedAyah}`;
        selectedStudioQariKey = universalSelectedQari;
        userStudioPitchSamples = [];
        dtwEvaluationResult = null;
        studioPlaybackCompleted = false;
        renderStudyoView();
      });

      // Âyet ve Kâri Değişimi
      document.getElementById('studioSelectAyah')?.addEventListener('change', (e) => {
        stopStudioReferencePlayback();
        selectedStudioAyahKey = e.target.value;
        userStudioPitchSamples = [];
        dtwEvaluationResult = null;
        studioPlaybackCompleted = false;
        renderStudyoView();
      });

      document.getElementById('studioSelectQari')?.addEventListener('change', (e) => {
        stopStudioReferencePlayback();
        selectedStudioQariKey = e.target.value;
        userStudioPitchSamples = [];
        dtwEvaluationResult = null;
        studioPlaybackCompleted = false;
        renderStudyoView();
      });

      // Model Tilaveti Dinle & Canlı Playhead Takibi
      const btnPlayRef = document.getElementById('btnStudioPlayRef');
      btnPlayRef?.addEventListener('click', () => {
        if (isStudioPlayingRef) {
          if (window.TilavetState?.audioPlayer) {
            try { window.TilavetState.audioPlayer.pause(); } catch (_) {}
          }
          isStudioPlayingRef = false;
          if (studioPlayheadAnimId) cancelAnimationFrame(studioPlayheadAnimId);
          if (btnPlayRef) btnPlayRef.innerHTML = "<span>▶</span> Seçilen Kâriyi Dinle";
          renderPitchContourCanvas(null, false);
          if (window.showToast) window.showToast("Tilavet durduruldu.");
          return;
        }

        const parts = selectedStudioAyahKey.split(':');
        const surah = parseInt(parts[0], 10) || 1;
        const ayah = parseInt(parts[1], 10) || 1;

        if (typeof window.playQariRecitation === 'function') {
          isStudioPlayingRef = true;
          if (btnPlayRef) btnPlayRef.innerHTML = "<span>⏹</span> Tilaveti Durdur";

          const onEnded = () => {
            if (!isStudioPlayingRef) return;
            isStudioPlayingRef = false;
            studioPlaybackCompleted = true;
            if (studioPlayheadAnimId) cancelAnimationFrame(studioPlayheadAnimId);
            if (btnPlayRef) btnPlayRef.innerHTML = "<span>▶</span> Seçilen Kâriyi Dinle";
            const status = document.getElementById('studioStatusBadge');
            if (status) status.textContent = '✅ Âyet kaydı tamamlandı';
            renderPitchContourCanvas(studioAudioRealDurationMs, true);
            if (window.showToast) window.showToast("Model tilavet tamamlandı.");
          };

          const onPlaybackError = () => {
            if (!isStudioPlayingRef) return;
            isStudioPlayingRef = false;
            studioPlaybackCompleted = false;
            if (studioPlayheadAnimId) cancelAnimationFrame(studioPlayheadAnimId);
            if (btnPlayRef) btnPlayRef.innerHTML = "<span>▶</span> Seçilen Kâriyi Dinle";
            const status = document.getElementById('studioStatusBadge');
            if (status) status.textContent = '⚠ Ses yüklenemedi; kaynak veya bağlantıyı kontrol edin';
            renderPitchContourCanvas(null, false);
          };

          studioPlaybackCompleted = false;
          const status = document.getElementById('studioStatusBadge');
          if (status) status.textContent = '▶ Oynatılıyor…';
          const player = window.playQariRecitation(surah, ayah, onEnded, selectedStudioQariKey, onPlaybackError);
          if (!player) {
            onPlaybackError();
            return;
          }
          if (window.showToast) window.showToast(`▶ ${surah}:${ayah} âyeti çalınıyor...`);

          // Ses oynatılırken sarı imleci canvas üzerinde hareket ettir
          function trackPlayhead() {
            if (!isStudioPlayingRef) return;
            if (player.error) {
              onPlaybackError();
              return;
            }
            if (player.ended) {
              onEnded();
              return;
            }
            if (!player.paused) {
              const currentMs = (player.currentTime || 0) * 1000;
              renderPitchContourCanvas(currentMs, true);
            }
            studioPlayheadAnimId = requestAnimationFrame(trackPlayhead);
          }

          if (studioPlayheadAnimId) cancelAnimationFrame(studioPlayheadAnimId);
          studioPlayheadAnimId = requestAnimationFrame(trackPlayhead);
        }
      });

      // Mushaf Bağlantısı
      document.getElementById('btnStudioMushafLink')?.addEventListener('click', () => {
        const parts = selectedStudioAyahKey.split(':');
        const surah = parseInt(parts[0], 10) || 1;
        const ayah = parseInt(parts[1], 10) || 1;
        if (typeof window.locateAndSelectSurahAyah === 'function') {
          window.locateAndSelectSurahAyah(surah, ayah);
        }
        if (typeof window.switchAppTab === 'function') {
          window.switchAppTab('tab-tilavet');
        }
      });

      // Kayıt ve Gerçek DTW Karşılaştırması
      const btnRecord = document.getElementById('btnStudioRecord');
      const recordBtnText = document.getElementById('studioRecordBtnText');

      btnRecord?.addEventListener('click', async () => {
        if (!isStudioRecording) {
          const selectedReference = window.TilavetAudioLab?.contourAnalyzer?.getReference(selectedStudioAyahKey, selectedStudioQariKey);
          if (!selectedReference) {
            if (window.showToast) window.showToast("Kayıt puanlanmadan önce gerçek kâri ses konturunun yüklenmesi beklenmelidir.");
            return;
          }
          try {
            // Referans çalıyorsa durdur
            if (isStudioPlayingRef) {
              if (window.TilavetState?.audioPlayer) {
                try { window.TilavetState.audioPlayer.pause(); } catch (_) {}
              }
              isStudioPlayingRef = false;
              if (studioPlayheadAnimId) cancelAnimationFrame(studioPlayheadAnimId);
              if (btnPlayRef) btnPlayRef.innerHTML = "<span>▶</span> Seçilen Kâriyi Dinle";
            }

            userStudioPitchSamples = [];
            dtwEvaluationResult = null;

            // Mikrofonu ve PitchDetector'ı başlat (çalışmıyorsa)
            if (window.TilavetAudioLab?.pitchDetector) {
              if (!window.TilavetAudioLab.pitchDetector.isListening) {
                await window.TilavetAudioLab.pitchDetector.start();
                isStudioMicActive = true;
                const micBtnText = document.getElementById('studioMicBtnText');
                const micIcon = document.getElementById('studioMicIcon');
                if (micBtnText) micBtnText.textContent = "Mikrofonu Durdur";
                if (micIcon) micIcon.textContent = "⏹";
                const btnToggleMic = document.getElementById('btnStudioToggleMic');
                if (btnToggleMic) btnToggleMic.classList.add('alert');
              }
            }

            await window.TilavetAudioLab?.recorder.start();
            isStudioRecording = true;
            const recStartTime = performance.now();

            if (recordBtnText) recordBtnText.textContent = "⏹ Kaydı Bitir & Karşılaştır";
            btnRecord.classList.add('alert');

            // Kayıt esnasında gerçek zamanlı F0 perde dinleyicisi
            if (studioRecPitchListener && window.TilavetAudioLab?.pitchDetector) {
              window.TilavetAudioLab.pitchDetector.removeListener(studioRecPitchListener);
            }

            studioRecPitchListener = (data) => {
              if (!isStudioRecording) return;
              const elapsedMs = Math.round(performance.now() - recStartTime);
              const ref = window.TilavetAudioLab?.contourAnalyzer?.getReference(selectedStudioAyahKey, selectedStudioQariKey);
              if (data && data.detected && data.freq > 50) {
                const userCents = window.TilavetAudioLab.contourAnalyzer.convertFreqToContourCents(data.freq, ref?.anchorHz || 0);
                if (Number.isFinite(userCents)) {
                  userStudioPitchSamples.push({
                    t: elapsedMs,
                    cents: userCents,
                    hz: Math.round(data.freq * 10) / 10
                  });
                }
              }

              // Her ses karesinde canvas'ı zümrüt yeşili çizgiyle canlı güncelle
              renderPitchContourCanvas(elapsedMs, false);
            };

            window.TilavetAudioLab.pitchDetector.addListener(studioRecPitchListener);

            // Başlangıç çizimini güncelle (boş kullanıcı çizgisi, imleç 0'da)
            renderPitchContourCanvas(0, false);

            if (window.showToast) {
              window.showToast("⏺ Canlı kayıt başladı! Âyeti mikrofona okuyunuz; ses eğriniz ekranda anlık çizilecektir.");
            }
          } catch (err) {
            console.error("Kayıt başlatılamadı:", err);
            alert("Kayıt başlatılamadı. Mikrofon iznini kontrol ediniz.");
          }
        } else {
          isStudioRecording = false;
          if (studioRecPitchListener && window.TilavetAudioLab?.pitchDetector) {
            window.TilavetAudioLab.pitchDetector.removeListener(studioRecPitchListener);
            studioRecPitchListener = null;
          }

          let recResult = null;
          try {
            recResult = await window.TilavetAudioLab?.recorder.stop();
          } catch (_) {}

          if (recordBtnText) recordBtnText.textContent = "Kayıt Al & Karşılaştır";
          btnRecord.classList.remove('alert');

          // Gerçek DTW Hesaplamasını Çalıştır
          const refContour = window.TilavetAudioLab?.contourAnalyzer?.getReference(selectedStudioAyahKey, selectedStudioQariKey);
          if (refContour && window.TilavetAudioLab?.contourAnalyzer) {
            dtwEvaluationResult = window.TilavetAudioLab.contourAnalyzer.calculateDTW(userStudioPitchSamples, refContour.points);
          }

          // DOM Metriklerini Anında Güncelle
          const pScore = document.getElementById('studioScorePitch');
          const cScore = document.getElementById('studioScoreContour');
          const tScore = document.getElementById('studioScoreTiming');
          const kScore = document.getElementById('studioScoreCorridor');
          const vBadge = document.getElementById('studioVerdictBadge');
          const vText = document.getElementById('studioVerdictText');

          if (dtwEvaluationResult) {
            if (pScore) pScore.textContent = `%${dtwEvaluationResult.pitchScore}`;
            if (cScore) cScore.textContent = `%${dtwEvaluationResult.contourScore}`;
            if (tScore) tScore.textContent = `%${dtwEvaluationResult.timingScore}`;
            if (kScore) kScore.textContent = `%${dtwEvaluationResult.corridorScore}`;

            if (vBadge) {
              if (dtwEvaluationResult.noAudio || dtwEvaluationResult.noReference) {
                vBadge.textContent = "Ses Algılanamadı";
                vBadge.className = "card-badge alert";
              } else {
                vBadge.textContent = `Ortalama Sapma: ±${dtwEvaluationResult.meanCentsDiff} cent`;
                vBadge.className = `card-badge ${dtwEvaluationResult.avgScore >= 75 ? 'green' : (dtwEvaluationResult.avgScore >= 60 ? 'gold' : 'alert')}`;
              }
            }

            if (vText) {
              vText.textContent = dtwEvaluationResult.verdict;
              vText.style.color = (dtwEvaluationResult.noAudio || dtwEvaluationResult.noReference) ? "#ff3366" : "#cbd5e1";
            }
          }

          // Son eğriyi imleçsiz netleştirerek çiz
          renderPitchContourCanvas(null, false);

          if (window.showToast) {
            if (dtwEvaluationResult?.noAudio || dtwEvaluationResult?.noReference) {
              window.showToast(dtwEvaluationResult.verdict);
            } else {
              window.showToast(`✅ Mukayese tamamlandı! Başarı: %${dtwEvaluationResult?.avgScore || 0} · Sapma: ±${dtwEvaluationResult?.meanCentsDiff || 0} cent`);
            }
          }
        }
      });
    }

    // 6. Canlı Spektrum & Rezonans (İstasyon 4)
    if (activeStudioStation === 'spectrum') {
      const specCanvas = document.getElementById('studioSpectrumCanvas');
      const sCtx = (specCanvas && typeof specCanvas.getContext === 'function') ? specCanvas.getContext('2d') : null;
      const freqBuf = new Uint8Array(64);
      const waveBuf = new Uint8Array(128);

      function loopSpectrum() {
        if (activeStudioStation !== 'spectrum') return;

        if (sCtx && specCanvas && window.TilavetAudioLab?.pitchDetector) {
          const hasWave = window.TilavetAudioLab.pitchDetector.getWaveformData(waveBuf);
          const hasFreq = window.TilavetAudioLab.pitchDetector.getFrequencyData(freqBuf);

          const w = specCanvas.width;
          const h = specCanvas.height;
          sCtx.clearRect(0, 0, w, h);

          // 1. Üst Kısım: Yeşil Osiloskop Dalga Formu
          sCtx.strokeStyle = "rgba(0, 230, 118, 0.85)";
          sCtx.lineWidth = 2;
          sCtx.beginPath();
          const sliceW = w / waveBuf.length;
          let x = 0;
          for (let i = 0; i < waveBuf.length; i++) {
            const v = waveBuf[i] / 128.0;
            const y = (v * (h * 0.35)) + 20;
            if (i === 0) sCtx.moveTo(x, y);
            else sCtx.lineTo(x, y);
            x += sliceW;
          }
          sCtx.stroke();

          // 2. Alt Kısım: 32 Ekolayzır Frekans Çubuğu
          const barCount = 32;
          const barW = (w / barCount) - 3;
          let chestEnergy = 0, throatEnergy = 0, nasalEnergy = 0;

          for (let i = 0; i < barCount; i++) {
            const val = freqBuf[i] || 0;
            const barH = (val / 255) * (h * 0.45);
            const bx = i * (barW + 3);
            const by = h - barH - 10;

            if (i < 8) {
              sCtx.fillStyle = "#e5b869"; // Göğüs
              chestEnergy += val;
            } else if (i < 20) {
              sCtx.fillStyle = "#00e676"; // Boğaz
              throatEnergy += val;
            } else {
              sCtx.fillStyle = "#00e5ff"; // Hayşûm / Ğunne
              nasalEnergy += val;
            }

            sCtx.fillRect(bx, by, barW, barH);
          }

          // Enerji Barlarını Güncelle
          const chestBar = document.getElementById('barChestResonance');
          const throatBar = document.getElementById('barThroatResonance');
          const nasalBar = document.getElementById('barNasalResonance');
          if (chestBar) chestBar.style.width = `${Math.min(100, Math.round((chestEnergy / (8 * 255)) * 100))}%`;
          if (throatBar) throatBar.style.width = `${Math.min(100, Math.round((throatEnergy / (12 * 255)) * 100))}%`;
          if (nasalBar) nasalBar.style.width = `${Math.min(100, Math.round((nasalEnergy / (12 * 255)) * 100))}%`;
        }

        spectrumCanvasAnimId = requestAnimationFrame(loopSpectrum);
      }

      if (spectrumCanvasAnimId) cancelAnimationFrame(spectrumCanvasAnimId);
      loopSpectrum();
    }

  }

  // ===========================================================================
  // 5.8 AŞERE-İ MÜTEVÂTİRE KIRAAT VE RİVAYET ATLASI
  // ===========================================================================
  activeQiraatImamId = activeQiraatImamId || 'asim';

  function renderQiraatView() {
    const container = document.getElementById('akademi-view-qiraat');
    if (!container) return;

    const data = QIRAAT || (DEFAULT_DATA && DEFAULT_DATA.qiraat) || {
      title: "Aşere-i Mütevâtire Kıraat ve Rivayet Kataloğu",
      description: "Sahabe-i kiramdan tevatür yoluyla günümüze ulaşan 10 sahih imam ve 20 meşhur râvisinin okuyuş hükümleri ve usûl kaideleri.",
      disclaimer: "Farklı kıraat ve rivayetler lehçe farklılıkları veya musiki/makam varyasyonları değil; Hz. Peygamber'e (s.a.v.) dayanan vahyî okuyuş biçimleridir. Kesinlikle ehil hoca (fem-i muhsin) denetimi olmadan kendi kendine kıraat tatbikatı yapılmamalıdır.",
      academicReferences: [
        "İbnü'l-Cezerî, en-Neşr fi'l-Kırââti'l-Aşr",
        "İmam eş-Şâtıbî, Hırzü'l-Emânî ve Vechü't-Tehânî (eş-Şâtıbiyye)",
        "İbnü'l-Cezerî, Tayyibetü'n-Neşr fi'l-Kırââti'l-Aşr"
      ],
      imams: [],
      usulDifferences: []
    };

    const imams = data.imams || [];
    const selectedImam = imams.find(i => i.id === activeQiraatImamId) || imams[0] || {
      name: "İmam Âsım b. Behdele el-Kûfî",
      region: "Kûfe",
      rawis: []
    };

    container.innerHTML = `
      <div class="qiraat-layout-wrap" style="display:flex; flex-direction:column; gap:1.5rem; width:100%;">
        <!-- Başlık & Teolojik Güvence Bildirimi -->
        <div class="akademi-card qiraat-hero-card">
          <div class="card-headline">
            <div>
              <span class="card-badge gold">AŞERE-İ MÜTEVÂTİRE</span>
              <h2 class="card-title">${data.title}</h2>
              <p class="card-desc">${data.description}</p>
            </div>
          </div>
          <div class="tl-disclaimer-alert" style="background:rgba(239, 68, 68, 0.12); border:1px solid rgba(239, 68, 68, 0.35); border-left:4px solid #ef4444; border-radius:8px; padding:1rem 1.25rem; display:flex; gap:0.85rem; align-items:flex-start; margin-top:1rem; color:#fca5a5; font-size:0.88rem; line-height:1.5;">
            <span style="font-size:1.4rem;">⚠</span>
            <div>
              <strong style="color:#fee2e2;">Teolojik Güvence ve Fem-i Muhsin İlkesi:</strong><br/>
              ${data.disclaimer}
            </div>
          </div>
        </div>

        <!-- 10 Sahih İmam Seçici & Râvi Detayları -->
        <div class="akademi-card imam-catalog-card">
          <div class="card-headline">
            <span class="card-badge cyan">10 İMÂM VE 20 RÂVÎ</span>
            <h3 class="card-title">Kıraat İmamları ve Rivayet Zinciri</h3>
          </div>
          
          <!-- İmam Hap Butonları -->
          <div class="elifba-sub-nav" style="margin-top:1rem;">
            ${imams.map(im => `
              <button type="button" class="elifba-sub-pill btn-qiraat-imam ${im.id === activeQiraatImamId ? 'active' : ''}" data-imam="${im.id}">
                ${im.name.split(' ')[0]} ${im.name.split(' ')[1] || ''} <span style="font-size:0.75rem; opacity:0.8;">(${im.region})</span>
              </button>
            `).join('')}
          </div>

          <!-- Seçili İmam Bilgisi -->
          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(229,184,105,0.25); border-radius:12px; padding:1.25rem; margin-top:1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:0.75rem;">
              <h3 style="color:var(--accent-gold); font-size:1.2rem; margin:0;">${selectedImam.name}</h3>
              <span class="card-badge gold">${selectedImam.region} Ekolü</span>
            </div>

            <h4 style="color:#cbd5e1; font-size:0.95rem; margin-bottom:0.75rem;">Meşhur 2 Râvisi ve Okuyuş Kaideleri:</h4>
            <div class="qiraat-rawi-grid">
              ${(selectedImam.rawis || []).map(r => `
                <div class="rawi-card">
                  <div class="rawi-card-header">
                    <span class="rawi-name"> ${r.name}</span>
                    <span class="rawi-status">${r.status || ''}</span>
                  </div>
                  <div class="rawi-rules">
                    <strong>Temel Kaideler:</strong> ${r.rulesSummary}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Temel Usûl Farklılıkları Karşılaştırma Tablosu -->
        <div class="akademi-card usul-table-card">
          <div class="card-headline">
            <span class="card-badge green">USÛL MUKAYESESİ</span>
            <h3 class="card-title">Kıraatler Arası Temel Usûl Farklılıkları Tablosu</h3>
            <p class="card-desc">Hafs, Verş, Kālûn, Hamza ve diğer mütevâtir rivayetlerin usûl bazındaki okuyuş ayrışımları.</p>
          </div>

          <div style="overflow-x:auto; margin-top:1.25rem;">
            <table class="table-qiraat" style="width:100%; border-collapse:collapse;">
              <thead>
                <tr style="background:rgba(229,184,105,0.08); color:var(--accent-gold); text-align:left;">
                  <th style="padding:0.85rem 1rem;">Hüküm / Usûl</th>
                  <th style="padding:0.85rem 1rem;">Açıklama</th>
                  <th style="padding:0.85rem 1rem;">Hafs 'an Âsım</th>
                  <th style="padding:0.85rem 1rem;">Verş / Kālûn</th>
                  <th style="padding:0.85rem 1rem;">Diğer Mütevâtir Rivayetler</th>
                </tr>
              </thead>
              <tbody>
                ${(data.usulDifferences || []).map(u => `
                  <tr>
                    <td><strong style="color:#f8fafc;">${u.rule}</strong></td>
                    <td style="color:#94a3b8; font-size:0.85rem;">${u.description}</td>
                    <td><span style="background:rgba(0,230,118,0.12); color:#00e676; padding:0.25rem 0.5rem; border-radius:6px; font-size:0.82rem; font-weight:600;">${u.hafs || '—'}</span></td>
                    <td><span style="background:rgba(229,184,105,0.15); color:var(--accent-gold); padding:0.25rem 0.5rem; border-radius:6px; font-size:0.82rem; font-weight:600;">${u.vers || u.kalunIbnKesir || '—'}</span></td>
                    <td><span style="background:rgba(0,229,255,0.12); color:#00e5ff; padding:0.25rem 0.5rem; border-radius:6px; font-size:0.82rem; font-weight:600;">${u.hamzaKisai || u.ebuAmrSusi || u.diger || '—'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Akademik Kaynakça -->
        <div class="akademi-card" style="padding:1.25rem;">
          <h4 style="color:var(--accent-gold); font-size:0.95rem; margin-bottom:0.6rem;"> Akademik ve Dinî Doğrulanmış Kaynakça:</h4>
          <ul style="padding-left:1.5rem; margin:0; color:#94a3b8; font-size:0.85rem; line-height:1.6;">
            ${(data.academicReferences || []).map(ref => `<li>${ref}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    // İmam Değiştirme Butonları
    container.querySelectorAll('.btn-qiraat-imam').forEach(btn => {
      btn.addEventListener('click', () => {
        activeQiraatImamId = btn.getAttribute('data-imam');
        renderQiraatView();
      });
    });
  }

  // ===========================================================================
  // 5.9 TİLAVET ÖĞRENME ASİSTANI (GUARDRAILS & KNOWLEDGE BASE)
  // ===========================================================================
  let asistanChatHistory = [
    {
      id: 'init',
      sender: 'assistant',
      text: "Esselâmü aleyküm ve rahmetullāh. Ben Tilavet Öğrenme Asistanınızım. Tecvid kuralları (İzhâr, İhfâ, İdğâm, Medler), makamlar (Rast, Uşşak, Hicaz vb.), diyafram-nefes egzersizleri veya dengeli çalışma programları hakkında sorularınızı yanıtlayabilirim.",
      time: "Şimdi",
      references: ["İbnü'l-Cezerî, el-Mukaddimetü'l-Cezeriyye", "Tilavet Akademisi Öğretim Tasarımı"]
    }
  ];

  const ASISTAN_GUARDRAIL_WARNING = "⚠ Bu asistan pedagojik ve teknik rehberlik amaçlıdır. Bir kıraat hocasının (fem-i muhsin) canlı denetiminin yerine geçemez; ayetler üzerinde kesin dinî fetva veya hüküm veremez.";

  const ASISTAN_TOPICS = [
    { id: 'elifba', icon: '', label: 'Kur’an harfleri ve mahreç', keywords: ['elifba', 'harf', 'mahrec', 'mahreç', 'hareke'], prompts: ['Arapça harfleri çalışmak istiyorum', 'Mahreçleri nasıl öğrenebilirim?', 'Harekeler ve cezim nedir?'] },
    { id: 'tecvid', icon: '', label: 'Tecvid kuralları', keywords: ['tecvid', 'tecvit', 'kural', 'ihfa', 'izhar', 'idgam', 'med', 'gunne'], prompts: ['Tecvid kurallarına nereden başlamalıyım?', 'Nûn-ı sâkin ve tenvin hükümleri nelerdir?', 'Med çeşitlerini açıklar mısın?'] },
    { id: 'vakif', icon: '⏸', label: 'Vakıf, ibtidâ ve duraklar', keywords: ['vakif', 'vakf', 'ibtida', 'ibtida', 'durak', 'secavend', 'sekte'], prompts: ['Durak işaretlerini açıklar mısın?', 'Nerede durup nereden başlamalıyım?', 'Sekte nedir?'] },
    { id: 'qiraat', icon: '', label: 'Kıraat ve rivayet', keywords: ['kiraat', 'rivayet', 'hafs', 'verş', 'varsh', 'asim', 'imam'], prompts: ['Hafs rivayeti nedir?', 'Kıraat ile makam arasındaki fark nedir?', 'Kıraatleri öğrenirken nelere dikkat etmeliyim?'] },
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

  const ASISTAN_KB = [
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
    const specificFiqhQuestion = /(?:namaz|abdest|oruc|zekat|hac).{0,40}(?:bozul|gecerli|kabul|sahih|caiz|helal|haram|gunah|farz|vacip)/.test(q);
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
        if (q.includes(normK) && normK.length > bestKeywordLen) {
          match = item;
          bestKeywordLen = normK.length;
        }
      }
    }

    if (match) {
      return {
        text: `${match.answer}`,
        references: match.references
      };
    }

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

  function renderAsistanView() {
    const container = document.getElementById('akademi-view-asistan');
    if (!container) return;

    container.innerHTML = `
      <div class="asistan-layout-wrap">
        <!-- Başlık Kartı -->
        <div class="akademi-card">
          <div class="card-headline">
            <div>
              <span class="card-badge gold">KONU MENÜLÜ ÖĞRENME REHBERİ</span>
              <h2 class="card-title"> Tilavet Öğrenme Asistanı</h2>
              <p class="card-desc">Tilavet, Kur’an ilimleri ve İslamî temel kavramlarda uygulama içi kaynaklara dayalı rehberlik; anlamadığında farklı anlatım ve konu seçimi.</p>
            </div>
          </div>
          <div class="tl-disclaimer-alert" style="background:rgba(229,184,105,0.1); border:1px solid rgba(229,184,105,0.3); border-left:4px solid var(--accent-gold); border-radius:8px; padding:0.85rem 1.15rem; margin-top:0.85rem; font-size:0.85rem; color:#f0f3fa; line-height:1.5;">
            ${ASISTAN_GUARDRAIL_WARNING}
          </div>
        </div>

        <div class="asistan-topic-menu" aria-label="Asistan konu menüsü">
          <div class="asistan-topic-menu-heading">
            <strong>Hangi konuda yardımcı olayım?</strong>
            <span>Bir başlık seç veya kendi sorunu yaz.</span>
          </div>
          <div class="asistan-topic-grid">
            ${ASISTAN_TOPICS.map(topic => `
              <button type="button" class="asistan-topic-pill" data-q="Konu menüsü: ${escapeAsistanHtml(topic.id)}">
                <span aria-hidden="true">${topic.icon}</span><span>${escapeAsistanHtml(topic.label)}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Sohbet Kartı -->
        <div class="asistan-chat-card">
          <div class="asistan-chat-header">
            <div style="display:flex; align-items:center; gap:0.6rem;">
              <span style="font-size:1.3rem;"></span>
              <div>
                <strong style="color:var(--accent-gold); font-size:0.95rem;">Tilavet ve Dinî Bilgi Rehberi</strong>
                <span style="font-size:0.75rem; color:#00e676; margin-left:0.5rem;">● Uygulama içi</span>
              </div>
            </div>
            <button type="button" class="btn-sm-action" id="btnClearAsistanChat" style="font-size:0.78rem;">Sohbeti Sıfırla</button>
          </div>

          <!-- Mesajlar Kutusu -->
          <div class="asistan-messages-box" id="asistanMessagesBox">
            ${asistanChatHistory.map(m => `
              <div class="asistan-msg-row ${m.sender}">
                <div class="asistan-avatar">${m.sender === 'user' ? '' : ''}</div>
                <div class="asistan-msg-bubble">
                  ${escapeAsistanHtml(m.text).replace(/\n/g, '<br/>')}
                  ${m.references && m.references.length > 0 ? `
                    <div class="asistan-msg-references">
                       <strong>Kaynak:</strong> ${m.references.map(escapeAsistanHtml).join(', ')}
                    </div>
                  ` : ''}
                  ${m.options && m.options.length ? `
                    <div class="asistan-option-list" aria-label="Yanıt seçenekleri">
                      ${m.options.map((option, index) => `
                        <button type="button" class="asistan-option-pill" data-q="${escapeAsistanHtml(option.query)}">
                          <span class="asistan-option-number">${index + 1}</span>${escapeAsistanHtml(option.label)}
                        </button>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Öneri Çipleri -->
          <div class="asistan-suggestions-wrap">
            <span style="font-size:0.78rem; color:#8a94a6; align-self:center;">Hızlı Sor:</span>
            <button type="button" class="asistan-suggestion-pill" data-q="İzhâr kuralı nedir?">İzhâr kuralı</button>
            <button type="button" class="asistan-suggestion-pill" data-q="Rast makamı özellikleri">Rast makamı</button>
            <button type="button" class="asistan-suggestion-pill" data-q="Segâh makamı özellikleri">Segâh makamı</button>
            <button type="button" class="asistan-suggestion-pill" data-q="Kur'an'daki 4 sekte">4 Sekte</button>
            <button type="button" class="asistan-suggestion-pill" data-q="Hükmü'r-Râ kuralları">Hükmü'r-Râ</button>
            <button type="button" class="asistan-suggestion-pill" data-q="Secavend durak işaretleri">Secavendler</button>
            <button type="button" class="asistan-suggestion-pill" data-q="Lahn-ı Celî ve Lahn-ı Hafî">Lahn çeşitleri</button>
            <button type="button" class="asistan-suggestion-pill" data-q="Fem-i Muhsin ilkesi nedir?">Fem-i Muhsin</button>
            <button type="button" class="asistan-suggestion-pill" data-q="20 dakikalık çalışma planı">20 dk plan</button>
            <button type="button" class="asistan-suggestion-pill" data-q="Güvenli nefes ve ses çalışması">Nefes &amp; ses rehberi</button>
          </div>

          <!-- Mesaj Gönderme Formu -->
          <form class="asistan-input-form" id="formAsistanChat">
            <input type="text" id="inputAsistanQuery" class="asistan-input-text" placeholder="Bir soru yazın; ör. “tenvin nasıl okunur?”" autocomplete="off" maxlength="500" aria-label="Asistana soru yaz">
            <button type="submit" class="asistan-btn-send">
              <span>Gönder</span>
              <span>➤</span>
            </button>
          </form>
        </div>
      </div>
    `;

    const msgsBox = document.getElementById('asistanMessagesBox');
    if (msgsBox) msgsBox.scrollTop = msgsBox.scrollHeight;

    function handleAsistanSend(query) {
      if (!query || !query.trim()) return;
      const q = query.trim();

      asistanChatHistory.push({
        id: 'u-' + Date.now(),
        sender: 'user',
        text: q,
        time: 'Şimdi'
      });

      const reply = queryAsistan(q);
      pendingAsistanOptions = reply.options || [];

      setTimeout(() => {
        asistanChatHistory.push({
          id: 'a-' + Date.now(),
          sender: 'assistant',
          text: reply.text,
          references: reply.references,
          options: reply.options,
          time: 'Şimdi'
        });
        renderAsistanView();
      }, 300);

      renderAsistanView();
    }

    document.getElementById('formAsistanChat')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('inputAsistanQuery');
      if (input) {
        handleAsistanSend(input.value);
        input.value = '';
      }
    });

    container.querySelectorAll('.asistan-suggestion-pill, .asistan-topic-pill, .asistan-option-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const q = pill.getAttribute('data-q');
        handleAsistanSend(q);
      });
    });

    document.getElementById('btnClearAsistanChat')?.addEventListener('click', () => {
      asistanChatHistory = [
        {
          id: 'init',
          sender: 'assistant',
          text: "Esselâmü aleyküm ve rahmetullāh. Sohbet sıfırlandı. Tecvid, makam veya çalışma planınızla ilgili her türlü soruyu sorabilirsiniz.",
          time: "Şimdi"
        }
      ];
      renderAsistanView();
    });
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
        } else if (imamId) {
          activeQiraatImamId = imamId;
          renderQiraatView();
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

        // Mobilde tıklamadan sonra çekmeceyi nazikçe kapat
        if (window.innerWidth < 768) {
          closeSideNavDrawer();
        }
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
  async function initTilavetAkademi() {
    await loadAkademiData();

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
