import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Tilavet Akademi Arayüz, Navigasyon ve Modül Denetimi', () => {
  const htmlPath = path.resolve(__dirname, '../../kimatik_lab/index.html');
  const incelemeHtmlPath = path.resolve(__dirname, '../../kimatik_lab/inceleme.html');
  const enginePath = path.resolve(__dirname, '../../kimatik_lab/tilavet_akademi_engine.js');
  const dataPath = path.resolve(__dirname, '../../kimatik_lab/tilavet_akademi_data.js');
  const audioLabPath = path.resolve(__dirname, '../../kimatik_lab/tilavet_audio_lab.js');

  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const incelemeHtmlContent = fs.readFileSync(incelemeHtmlPath, 'utf8');
  const engineContent = fs.readFileSync(enginePath, 'utf8');
  const dataContent = fs.readFileSync(dataPath, 'utf8');
  const audioLabContent = fs.readFileSync(audioLabPath, 'utf8');

  it('index.html içerisinde sinav ve hoca alanları tamamen kaldırılmıştır', () => {
    // Navigasyon butonları
    expect(htmlContent).not.toContain('data-view="sinav"');
    expect(htmlContent).not.toContain('data-view="hoca"');
    expect(htmlContent).not.toContain('Sınav &amp; Sertifika');
    expect(htmlContent).not.toContain('Eğitmen Paneli');

    // Panel kapsayıcıları
    expect(htmlContent).not.toContain('id="akademi-view-sinav"');
    expect(htmlContent).not.toContain('id="akademi-view-hoca"');
  });

  it('12 geçerli akademi alt paneli index.html içerisinde tanımlıdır', () => {
    const validViews = [
      'yolculuk', 'elifba', 'tecvid', 'teknik', 'makam',
      'san', 'studyo', 'dinleme', 'qiraat', 'asistan',
      'sozluk', 'ayarlar'
    ];

    for (const v of validViews) {
      expect(htmlContent).toContain(`data-view="${v}"`);
      expect(htmlContent).toContain(`id="akademi-view-${v}"`);
    }
  });

  it('Tüm 12 alt görünüm (views) motor tarafından istisnasız ve zengin HTML üreterek render edilir', () => {
    const containers: Record<string, any> = {};

    const fakeDoc = {
      getElementById: (id: string) => {
        if (!containers[id]) {
          containers[id] = {
            id,
            innerHTML: '',
            style: {},
            classList: { add: () => {}, remove: () => {} },
            setAttribute: () => {},
            getAttribute: () => null,
            addEventListener: () => {},
            querySelectorAll: () => [],
            querySelector: () => null,
            appendChild: () => {}
          };
        }
        return containers[id];
      },
      querySelectorAll: () => [],
      querySelector: () => null,
      createElement: (tag: string) => ({
        tagName: tag,
        style: {},
        classList: { add: () => {}, remove: () => {} },
        setAttribute: () => {},
        getAttribute: () => null,
        addEventListener: () => {},
        appendChild: () => {}
      }),
      body: { appendChild: () => {} }
    };

    const fakeWindow: any = {
      document: fakeDoc,
      localStorage: { getItem: () => null, setItem: () => {} }
    };

    // Veri ve motoru çalıştır
    const runData = new Function('window', dataContent);
    runData(fakeWindow);

    const runEngine = new Function('window', 'document', 'localStorage', engineContent);
    runEngine(fakeWindow, fakeDoc, fakeWindow.localStorage);

    expect(fakeWindow.TilavetAkademiEngine).toBeDefined();

    const views = [
      'yolculuk', 'elifba', 'tecvid', 'teknik', 'makam',
      'san', 'studyo', 'dinleme', 'qiraat', 'asistan',
      'sozluk', 'ayarlar'
    ];

    for (const v of views) {
      fakeWindow.TilavetAkademiEngine.switchSubView(v);
      const container = containers[`akademi-view-${v}`];
      expect(container, `Panel akademi-view-${v} bulunamadı`).toBeDefined();
      expect(container.innerHTML.length).toBeGreaterThan(500);
    }
  });

  it('Teori verisi yüklenirken çoklu tilavet örneklerini korur ve kaynak/geçki bağlantılarını gösterir', async () => {
    const containers: Record<string, any> = {};
    const fakeDoc = {
      getElementById: (id: string) => {
        if (!containers[id]) {
          containers[id] = {
            id,
            innerHTML: '',
            style: {},
            classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => false },
            setAttribute: () => {},
            getAttribute: () => null,
            addEventListener: () => {},
            querySelectorAll: () => [],
            querySelector: () => null,
            appendChild: () => {}
          };
        }
        return containers[id];
      },
      querySelectorAll: () => [],
      querySelector: () => null,
      createElement: () => ({
        style: {},
        classList: { add: () => {}, remove: () => {} },
        setAttribute: () => {},
        addEventListener: () => {},
        appendChild: () => {}
      }),
      body: { appendChild: () => {} }
    };
    const fakeWindow: any = {
      document: fakeDoc,
      localStorage: { getItem: () => null, setItem: () => {} },
      addEventListener: () => {}
    };
    new Function('window', dataContent)(fakeWindow);
    const fetchMock = async (url: string) => {
      if (!url.includes('makamlar.json')) throw new Error('No mock for this request');
      return { json: async () => JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../kimatik_lab/data/tilavet/makamlar.json'), 'utf8')) };
    };
    new Function('window', 'document', 'localStorage', 'fetch', engineContent)(
      fakeWindow,
      fakeDoc,
      fakeWindow.localStorage,
      fetchMock
    );

    await fakeWindow.TilavetAkademiEngine.init();
    fakeWindow.TilavetAkademiEngine.switchSubView('makam');
    const markup = containers['akademi-view-makam'].innerHTML;
    expect(markup).toContain('Makamları karşılaştırarak öğren');
    expect(markup).toContain('makamReciterFilter');
    expect(markup).toContain('TDV İslâm Ansiklopedisi');
    expect(markup).toContain('btn-makam-transition');
    expect(markup.match(/class="makam-ayah-card/g)).toHaveLength(5);
    expect(markup).toContain('Yeni aday · makam uzmanı teyidi bekliyor');
    expect(markup).toContain('makam aidiyeti');
    expect(fakeWindow.getMakamAyahAudioUrl(
      'https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/024035.mp3',
      24,
      36
    )).toBe('https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/024036.mp3');
    expect(() => fakeWindow.getMakamAyahAudioUrl(
      'https://example.com/audio/024035.mp3',
      24,
      36
    )).toThrow();
    expect(engineContent).toContain('makamAudioPlayer.onerror = null');
    expect(engineContent).toContain('if (makamAudioPlayer !== player || currentMakamAudioItem !== item) return;');
    expect(engineContent).toContain('Ses dosyasına ulaşılamadı (${surah}:${item.currentAyah})');
  });

  it('Elif-Ba modülü tüm 8 sekmesinde modern sınıflar ve zengin pedagojik içerik üretir', () => {
    // Motor dosyası içerisinde 8 sekmenin de modern CSS sınıflarının yer aldığını doğrula
    const requiredElifbaClasses = [
      'elifba-module-container',
      'elifba-sub-nav',
      'elifba-harfler-split',
      'arabic-letters-grid',
      'vocal-tract-atlas',
      'table-yazilis',
      'harekeler-grid',
      'cezm-grid',
      'sedde-grid',
      'tenvin-grid',
      'med-grid',
      'heceleme-grid',
      'ear-question-box'
    ];

    for (const cls of requiredElifbaClasses) {
      expect(engineContent).toContain(cls);
    }
  });

  it('Kulak testi 30 soruyu iki dengeli kategoride ve erişilebilir ilerleme kontrolleriyle sunar', () => {
    const questionBlock = engineContent.split('const rawEarQuestions = [')[1]?.split('\n      ];')[0] || '';
    const questionIds = [...questionBlock.matchAll(/^\s*id:\s*(\d+),$/gm)].map(match => Number(match[1]));

    expect(questionIds).toEqual(Array.from({ length: 30 }, (_, index) => index + 1));
    expect(questionBlock.match(/category:\s*"harf"/g) || []).toHaveLength(15);
    expect(questionBlock.match(/category:\s*"kelime"/g) || []).toHaveLength(15);
    expect(engineContent).toContain('id="earProgressFill"');
    expect(engineContent).toContain('aria-valuenow');
    expect(engineContent).toContain('ear-preview-button');
  });

  it('Ses Laboratuvarı modülü 5 istasyon, gerçek DTW ve akustik analiz yapılarını içerir', () => {
    const audioLabPath = path.resolve(__dirname, '../../kimatik_lab/tilavet_audio_lab.js');
    const audioLabContent = fs.readFileSync(audioLabPath, 'utf8');

    // tilavet_audio_lab.js içerisinde ContourAnalyzer, Makam Presets ve FFT analiz metotları yer almalıdır
    expect(audioLabContent).toContain('class ContourAnalyzer');
    expect(audioLabContent).toContain('calculateDTW');
    expect(audioLabContent).toContain('audio-f0');
    expect(audioLabContent).toContain('MAKAM_PRESETS');
    expect(audioLabContent).toContain('getWaveformData');
    expect(audioLabContent).toContain('getFrequencyData');

    // engine içerisinde 5 istasyon ve ilgili görsel bileşenler tanımlı olmalıdır
    const requiredStudioElements = [
      'studio-sub-nav',
      'studio-station-pill',
      'btn-makam-karar',
      'btn-practice-med-card',
      'studioSpectrumCanvas',
      'breathCircle',
      'studioPitchCanvas'
    ];

    for (const el of requiredStudioElements) {
      expect(engineContent).toContain(el);
    }
  });

  it('Tilavet Teknikleri modülü 6 alt sekmesi, ses ve metronom donanımıyla eksiksizdir', () => {
    const requiredTeknikElements = [
      'btn-teknik-sub',
      'tempos-card',
      'tempo-matrix-table',
      'btn-play-tempo-metronome',
      'btn-play-sample-audio',
      'btn-goto-secavend-ayah',
      'secavend-filter-chip',
      'secavend-grid-wrap',
      'lahn-comparison-grid',
      'lahn-cases-grid',
      'vasl-list-wrap',
      'ozel-group-wrap',
      'teknik-quiz-wrap'
    ];

    for (const el of requiredTeknikElements) {
      expect(engineContent, `Tilavet Teknikleri bileşeni ${el} bulunamadı`).toContain(el);
    }

    // 4 Temponun da doğru kâri ve BPM değerleriyle yer aldığını doğrula
    expect(engineContent).toContain('Tahkîk (التحقيق)');
    expect(engineContent).toContain('Tertîl (الترتيل)');
    expect(engineContent).toContain('Tedvîr (التدوير)');
    expect(engineContent).toContain('Hadr (الحدر)');
    expect(engineContent).toContain('Şeyh Mahmûd Halîl el-Husarî');
    expect(engineContent).toContain('Şeyh Muhammed Sıddîk el-Minşâvî');
    expect(engineContent).toContain('Şeyh Yâsir ed-Devserî');
    expect(engineContent).toContain('Şeyh Meşâri Râşid el-Afâsî');
  });

  it('Tilavet Teknikleri 6 alt sekmesinin tamamı zengin ve geçerli içerik üretir', () => {
    const tabs = ['tempolar', 'secavend', 'lahn', 'vasl', 'ozel', 'pratik'];
    for (const t of tabs) {
      const containers: Record<string, any> = {};
      const fakeDoc = {
        getElementById: (id: string) => {
          if (!containers[id]) {
            containers[id] = {
              id,
              innerHTML: '',
              style: {},
              classList: { add: () => {}, remove: () => {} },
              querySelectorAll: () => [],
              querySelector: () => null,
              addEventListener: () => {},
              appendChild: () => {}
            };
          }
          return containers[id];
        },
        querySelectorAll: () => [],
        querySelector: () => null,
        createElement: () => ({
          style: {},
          classList: { add: () => {}, remove: () => {} },
          setAttribute: () => {},
          addEventListener: () => {}
        }),
        body: { appendChild: () => {} }
      };
      const fakeWin: any = {
        document: fakeDoc,
        localStorage: { getItem: () => null, setItem: () => {} }
      };
      new Function('window', dataContent)(fakeWin);
      const mod = engineContent.replace("let activeTeknikTab = 'tempolar';", `let activeTeknikTab = '${t}';`);
      new Function('window', 'document', 'localStorage', mod)(fakeWin, fakeDoc, fakeWin.localStorage);
      fakeWin.TilavetAkademiEngine.switchSubView('teknik');
      const inner = containers['akademi-view-teknik'].innerHTML;
      expect(inner.length, `${t} sekmesi içeriği yetersiz`).toBeGreaterThan(1500);
    }
  });

  it('Dinleme Salonu modülü master oynatıcı, 114 sûre seçimi, şaheser icraları ve ekolleri tam teşekküllü üretir', () => {
    const containers: Record<string, any> = {};
    const fakeDoc = {
      getElementById: (id: string) => {
        if (!containers[id]) {
          containers[id] = {
            id,
            innerHTML: '',
            style: {},
            classList: { add: () => {}, remove: () => {} },
            querySelectorAll: () => [],
            querySelector: () => null,
            addEventListener: () => {},
            appendChild: () => {}
          };
        }
        return containers[id];
      },
      querySelectorAll: () => [],
      querySelector: () => null,
      createElement: () => ({
        style: {},
        classList: { add: () => {}, remove: () => {} },
        setAttribute: () => {},
        addEventListener: () => {}
      }),
      body: { appendChild: () => {} }
    };
    const fakeWin: any = {
      document: fakeDoc,
      localStorage: { getItem: () => null, setItem: () => {} },
      SURAH_LIST: [
        { no: 1, name: "Fâtiha", arabic: "الفاتحة", ayahs: 7 },
        { no: 36, name: "Yâsîn", arabic: "يس", ayahs: 83 }
      ]
    };
    new Function('window', dataContent)(fakeWin);
    new Function('window', 'document', 'localStorage', engineContent)(fakeWin, fakeDoc, fakeWin.localStorage);
    fakeWin.TilavetAkademiEngine.switchSubView('dinleme');

    const dinlemeHtml = containers['akademi-view-dinleme'].innerHTML;
    expect(dinlemeHtml.length).toBeGreaterThan(2000);

    // Temel bileşenlerin varlığını doğrula
    expect(dinlemeHtml).toContain('lounge-master-station');
    expect(dinlemeHtml).toContain('loungeSurahSelect');
    expect(dinlemeHtml).toContain('loungeModeSelect');
    expect(dinlemeHtml).toContain('loungePlayPauseBtn');
    expect(dinlemeHtml).toContain('loungeProgress');
    expect(dinlemeHtml).toContain('loungeWaveform');
    expect(dinlemeHtml).toContain('btn-play-masterpiece');
    expect(dinlemeHtml).toContain('btn-listen-reciter');
    expect(dinlemeHtml).toContain('reciter-schools-card');
  });

  it('Ses Laboratuvarı (studyo) modülü DTW Kurra mukayese konsolu, canlı canvas, F0 tuner ve nefes koçuyla tam teşekküllü üretir', () => {
    const containers: Record<string, any> = {};
    const fakeDoc = {
      getElementById: (id: string) => {
        if (!containers[id]) {
          containers[id] = {
            id,
            innerHTML: '',
            style: {},
            classList: { add: () => {}, remove: () => {} },
            querySelectorAll: () => [],
            querySelector: () => null,
            addEventListener: () => {},
            appendChild: () => {}
          };
        }
        return containers[id];
      },
      querySelectorAll: () => [],
      querySelector: () => null,
      createElement: () => ({
        style: {},
        classList: { add: () => {}, remove: () => {} },
        setAttribute: () => {},
        addEventListener: () => {}
      }),
      body: { appendChild: () => {} }
    };
    const fakeWin: any = {
      document: fakeDoc,
      localStorage: { getItem: () => null, setItem: () => {} }
    };
    new Function('window', dataContent)(fakeWin);
    new Function('window', 'document', 'localStorage', engineContent)(fakeWin, fakeDoc, fakeWin.localStorage);
    fakeWin.TilavetAkademiEngine.switchSubView('studyo');

    const studyoHtml = containers['akademi-view-studyo'].innerHTML;
    expect(studyoHtml.length).toBeGreaterThan(2000);

    // Temel bileşenlerin varlığını doğrula
    expect(studyoHtml).toContain('studio-sub-nav');
    expect(studyoHtml).toContain('studioPitchCanvas');
    expect(studyoHtml).toContain('btnStudioRecord');
    expect(studyoHtml).toContain('btnStudioPlayRef');
    expect(studyoHtml).toContain('studioSelectAyah');
    expect(studyoHtml).toContain('studioSelectQari');
    expect(studyoHtml).toContain('studioScoreCard');
    expect(studyoHtml).toContain('studioScorePitch');
    expect(studyoHtml).toContain('studioScoreContour');
    expect(studyoHtml).toContain('studioScoreTiming');
    expect(studyoHtml).toContain('studioScoreCorridor');
  });

  it('ContourAnalyzer.convertFreqToContourCents ve PitchDetector.addListener mekanizması doğrulanır', () => {
    const fakeWin: any = {};
    new Function('window', audioLabContent)(fakeWin);
    const audioLab = fakeWin.TilavetAudioLab;
    expect(audioLab).toBeDefined();

    // convertFreqToContourCents doğrulaması
    const analyzer = audioLab.contourAnalyzer;
    // Karar frekansı 220Hz (A3 Dügâh)
    expect(analyzer.convertFreqToContourCents(220, 220)).toBe(0);
    // Oktav farkı kontur karşılaştırmasında korunur.
    expect(analyzer.convertFreqToContourCents(440, 220)).toBe(1200);
    expect(analyzer.convertFreqToContourCents(110, 220)).toBe(-1200);
    // ~200 cent yukarısı (247Hz)
    const c200 = analyzer.convertFreqToContourCents(247, 220);
    expect(c200).toBeGreaterThanOrEqual(190);
    expect(c200).toBeLessThanOrEqual(215);

    // addListener ve emitPitch doğrulaması
    const detector = audioLab.pitchDetector;
    let receivedData: any = null;
    const testListener = (d: any) => { receivedData = d; };
    detector.addListener(testListener);
    detector.emitPitch({ detected: true, freq: 220, note: 'A3', cents: 0 });
    expect(receivedData).toEqual({ detected: true, freq: 220, note: 'A3', cents: 0 });

    detector.removeListener(testListener);
    receivedData = null;
    detector.emitPitch({ detected: false });
    expect(receivedData).toBeNull();
  });

  it('Akademi çekmecesi tek bir bağlamsal açıcıya ve yalnızca Akademi modüllerine sahiptir', () => {
    // 1. Yönetici Bar ve Hızlı Seçici
    expect(htmlContent).toContain('class="akademi-executive-bar"');
    expect(htmlContent).toContain('id="akademiBreadcrumb"');
    expect(htmlContent).toContain('id="akademiQuickModuleSelect"');
    expect(htmlContent).toContain('id="btnOpenSideDrawer"');
    expect(htmlContent).toContain('aria-controls="sideNavDrawer"');
    expect(htmlContent.match(/id="btnOpenSideDrawer"/g)).toHaveLength(1);
    expect(htmlContent).not.toContain('id="btnHeaderSideMenu"');
    expect(htmlContent).not.toContain('id="btnFloatingSideNav"');

    // 2. Sağ Açılır Çekmece Bileşenleri
    expect(htmlContent).toContain('id="sideNavDrawer"');
    expect(htmlContent).toContain('id="sideNavBackdrop"');
    expect(htmlContent).toContain('id="drawerSearchInput"');
    expect(htmlContent).toContain('id="drawerAccordionTree"');
    expect(htmlContent).toContain('aria-label="Tilavet Akademisi bölümleri"');
    expect(htmlContent).not.toContain('drawer-main-card');
    expect(htmlContent).not.toContain('data-section-name="ana-calisma"');
    expect(incelemeHtmlContent).not.toContain('mobile-page-nav');
    expect(engineContent).toContain("document.querySelector('.app-shell')?.dataset.activeTab === 'tab-akademi'");
    expect(engineContent).toContain("document.querySelector('.app-shell')?.dataset.activeTab !== 'tab-akademi'");

    // 3. Makam Okulu 10 Makam Alt Menü Elemanları
    const makams = ['rast', 'ussak', 'hicaz', 'nihavend', 'saba', 'segah', 'kurdi', 'acem', 'neva', 'huzzam'];
    for (const m of makams) {
      expect(htmlContent).toContain(`data-makam="${m}"`);
    }

    // 4. Elif-Ba 8 Alt Modül Elemanları
    const elifbaSubs = ['harfler', 'yazilis', 'harekeler', 'cezm-sedde', 'tenvin', 'med', 'heceleme', 'kulak'];
    for (const s of elifbaSubs) {
      expect(htmlContent).toContain(`data-sub="${s}"`);
    }

    // 5. Tecvid Alt Menü Elemanları
    const tecvidCats = ['all', 'nun', 'mim', 'madd', 'letter'];
    for (const c of tecvidCats) {
      expect(htmlContent).toContain(`data-tecvid-cat="${c}"`);
    }
  });
});
