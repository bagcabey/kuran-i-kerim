# 11. BÖLÜM 11: DURUM DEPOSU (STORE) VE İSTASYON UI MOTORU

## 11.1. Reaktif Durum Deposu (`studio_store.js`)
### Sorun
Eski kodda veriler `window.studioPitchSamples`, `window.isMicOpen` gibi pencere nesnesine başıboş asılmış global değişkenlerde tutulmakta (I1), bir değişken değiştiğinde diğer bileşenler bundan habersiz kalmaktaydı.

### Çözüm Mantığı
Tip güvenli, kapsüllenmiş ve Pub/Sub mekanizmasına dayalı tek bir reaktif durum deposu (`StudioStore`) tasarlanmıştır.

```javascript
// kimatik_lab/audio_lab/ui/studio_store.js
// Reaktif Durum Yönetimi (Single Source of Truth)

export class StudioStore {
  constructor() {
    this.state = {
      activeStation: 1, // 1: Tuner, 2: Medd, 3: Kontur/DTW, 4: Spektrum, 5: Nefes
      isMicActive: false,
      isDroneActive: false,
      currentAhenk: 'boulahank',
      currentTuningSystem: '53-koma',
      activeMakamId: 'rast',
      masterVolume: 0.85,
      hasHeadphonesAlert: false,
      lastPitchResult: null
    };

    this.listeners = new Map();
  }

  getState() {
    return { ...this.state };
  }

  setState(updates) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };

    for (const [key, value] of Object.entries(updates)) {
      if (prevState[key] !== value && this.listeners.has(key)) {
        for (const callback of this.listeners.get(key)) {
          callback(value, prevState[key]);
        }
      }
    }

    if (this.listeners.has('*')) {
      for (const callback of this.listeners.get('*')) {
        callback(this.state, prevState);
      }
    }
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    return () => this.listeners.get(key).delete(callback);
  }
}

export const studioStore = new StudioStore();
```

---

## 11.2. Kısmi DOM Güncelleme ve İstasyon Motoru (`studio_ui.js`)
### Sorun
Eski mimaride tını, tempo veya makam seçildiğinde tüm istasyon DOM'u `container.innerHTML = ...` ile kökten silinip baştan oluşturulmaktaydı (H1). Bu işlem o anda çalışan mikrofon iş parçacığını ve canvas çizim döngülerini öldürmekteydi.

### Çözüm Mantığı
1. **İstasyon Şablonları Bir Kez Oluşturulur:** 5 istasyon paneli ve sabit alt kontrol çubuğu bir kez DOM'a basılır.
2. **Hedefli Güncelleme:** Gelen F0 karelerinde yalnızca ilgili elementlerin (`transform`, `textContent`, `width`) özellikleri güncellenir.
3. **Sabit (Sticky) Kontrol Çubuğu:** Ekran nereye kaydırılırsa kaydırılsın mikrofon anahtarı, kulaklık uyarısı, ahenk seçici ve "Okuma Penceresi" butonu altta sabit kalır (H2).

```javascript
// kimatik_lab/audio_lab/ui/studio_ui.js
// 5 İstasyon Paneli, Sabit Kontrol Barı ve Kısmi DOM Render Motoru

import { studioStore } from './studio_store.js';
import { micManager } from '../core/mic_manager.js';
import { masterBus } from '../core/master_bus.js';
import { droneSynth } from '../instruments/drone_v2.js';
import { tuningCore, AHENKLER, PITCH_TABLE_53 } from '../core/tuning_core.js';
import { meddEngine, MEDD_CARDS } from '../core/medd_engine.js';
import { spectrumAnalyzer } from '../core/spectrum_analyzer.js';
import { breathCoach, BREATH_MODES } from '../core/breath_coach_v2.js';
import { readingModal } from './reading_modal.js';

export class StudioUI {
  constructor(rootContainerId) {
    this.rootEl = document.getElementById(rootContainerId);
    this.activeStationId = 1;
    this.rafId = null;
  }

  init() {
    if (!this.rootEl) return;
    this.renderLayout();
    this.bindGlobalEvents();
    this.subscribeToStore();
    this.startRenderLoop();
  }

  renderLayout() {
    this.rootEl.innerHTML = `
      <div class="sl-app-shell">
        
        <!-- Üst Başlık ve İstasyon Sekmeleri -->
        <header class="sl-main-header">
          <div class="sl-brand">
            <span class="sl-brand-icon">🎙️</span>
            <div>
              <h1 class="sl-title">Ses Laboratuvarı & Akustik Tahlil Stüdyosu</h1>
              <p class="sl-subtitle">53-Koma Mûsikî Akordu, Hece Meddi, Kâri DTW Analizi</p>
            </div>
          </div>

          <nav class="sl-station-nav" role="tablist" aria-label="İstasyonlar">
            <button class="sl-nav-tab active" role="tab" data-station="1" id="tab-s1" aria-selected="true" aria-controls="panel-s1">
              <span class="sl-tab-num">1</span> Makam Tuner
            </button>
            <button class="sl-nav-tab" role="tab" data-station="2" id="tab-s2" aria-selected="false" aria-controls="panel-s2">
              <span class="sl-tab-num">2</span> Medd Ölçer
            </button>
            <button class="sl-nav-tab" role="tab" data-station="3" id="tab-s3" aria-selected="false" aria-controls="panel-s3">
              <span class="sl-tab-num">3</span> Nağme & DTW
            </button>
            <button class="sl-nav-tab" role="tab" data-station="4" id="tab-s4" aria-selected="false" aria-controls="panel-s4">
              <span class="sl-tab-num">4</span> Spektrum & Rezonans
            </button>
            <button class="sl-nav-tab" role="tab" data-station="5" id="tab-s5" aria-selected="false" aria-controls="panel-s5">
              <span class="sl-tab-num">5</span> Nefes Koçu
            </button>
          </nav>
        </header>

        <!-- İstasyon İçerik Panelleri -->
        <main class="sl-main-content">
          
          <!-- İSTASYON 1: TUNER & 53-KOMA -->
          <section id="panel-s1" class="sl-panel active" role="tabpanel" aria-labelledby="tab-s1">
            <div class="sl-tuner-layout">
              <div class="sl-gauge-card">
                <div class="sl-gauge-dial">
                  <div class="sl-gauge-needle" id="slTunerNeedle"></div>
                  <div class="sl-gauge-center-pin"></div>
                  <div class="sl-gauge-labels">
                    <span>-50¢</span>
                    <span class="sl-zero-mark">0</span>
                    <span>+50¢</span>
                  </div>
                </div>
                <div class="sl-tuner-readout">
                  <span class="sl-readout-hz" id="slTunerHz">-- Hz</span>
                  <h2 class="sl-readout-note" id="slTunerNote">--</h2>
                  <span class="sl-readout-cent" id="slTunerCent">0 cent (0 koma)</span>
                </div>
              </div>

              <!-- 53 Koma Makam Klavyesi -->
              <div class="sl-keyboard-card">
                <h3>53-Koma Mûsikî Perdeleri (Seçili Ahenk)</h3>
                <div class="sl-microtonal-keys" id="slKeyboardContainer">
                  <!-- JS dinamik dolduracak -->
                </div>
              </div>
            </div>
          </section>

          <!-- İSTASYON 2: MEDD ÖLÇER -->
          <section id="panel-s2" class="sl-panel" role="tabpanel" aria-labelledby="tab-s2">
            <div class="sl-medd-layout">
              <div class="sl-medd-cards-strip" id="slMeddCardsStrip">
                <!-- Medd kartları dinamik -->
              </div>
              
              <div class="sl-medd-meter-card">
                <div class="sl-medd-status-bar">
                  <span id="slMeddStateBadge" class="sl-badge">Bekleniyor</span>
                  <div class="sl-tempo-selector">
                    <label>Kıraat Temposu:</label>
                    <select id="slMeddTempoSelect" class="sl-select">
                      <option value="hadr">Hadr (Hızlı hatim)</option>
                      <option value="tedvir" selected>Tedvîr (Orta sürat)</option>
                      <option value="tertil">Tertîl (Tefekkür)</option>
                      <option value="tahkik">Tahkîk (Talim / Meşk)</option>
                    </select>
                  </div>
                </div>

                <!-- 6 Elif Gösterge Çubukları -->
                <div class="sl-elif-meter">
                  <div class="sl-elif-bar" data-elif="1"><span>1 Elif</span></div>
                  <div class="sl-elif-bar" data-elif="2"><span>2 Elif</span></div>
                  <div class="sl-elif-bar" data-elif="3"><span>3 Elif</span></div>
                  <div class="sl-elif-bar" data-elif="4"><span>4 Elif</span></div>
                  <div class="sl-elif-bar" data-elif="5"><span>5 Elif</span></div>
                  <div class="sl-elif-bar" data-elif="6"><span>6 Elif</span></div>
                </div>

                <div class="sl-medd-result-box" id="slMeddResultBox">
                  <span class="sl-medd-big-digit" id="slMeddBigDigit">0.0</span>
                  <span class="sl-medd-unit">Elif</span>
                  <p class="sl-medd-desc" id="slMeddDesc">Harfi uzatmaya başlayınız...</p>
                </div>
              </div>
            </div>
          </section>

          <!-- İSTASYON 3: NAĞME & DTW -->
          <section id="panel-s3" class="sl-panel" role="tabpanel" aria-labelledby="tab-s3">
            <div class="sl-dtw-promo-card">
              <div class="sl-promo-content">
                <h2>Model Kâri ile Nağme Mukayesesi</h2>
                <p>Usta kârilerin tilâvet seyrini ve nağme kıvrımlarını dev ekranda birebir karşılaştırmak için Okuma Penceresine geçiniz.</p>
                <button id="slBtnOpenModalFromStation3" class="sl-btn sl-btn-accent sl-btn-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                  Okuma Penceresini Aç (Odak Modu)
                </button>
              </div>
            </div>
          </section>

          <!-- İSTASYON 4: SPEKTRUM & REZONANS -->
          <section id="panel-s4" class="sl-panel" role="tabpanel" aria-labelledby="tab-s4">
            <div class="sl-spectrum-layout">
              <div class="sl-spec-canvas-card">
                <h3>Logaritmik Frekans Dağılımı (2048-FFT)</h3>
                <canvas id="slSpecCanvas" width="600" height="180"></canvas>
              </div>
              <div class="sl-osc-canvas-card">
                <h3>Sıfır-Geçişli Durağan Dalga Formu (Osiloskop)</h3>
                <canvas id="slOscCanvas" width="600" height="180"></canvas>
              </div>
              
              <!-- 5 Rezonans Bandı Göstergesi -->
              <div class="sl-resonance-bars-card">
                <h3>Tilâvet ve Mahreç Rezonans Dengesi</h3>
                <div class="sl-band-row">
                  <span>Göğüs (80-300 Hz)</span>
                  <div class="sl-progress-bar"><div class="sl-progress-fill" id="slBandChest"></div></div>
                </div>
                <div class="sl-band-row">
                  <span>Boğaz / Ağız (300-1500 Hz)</span>
                  <div class="sl-progress-bar"><div class="sl-progress-fill" id="slBandOral"></div></div>
                </div>
                <div class="sl-band-row">
                  <span>Hayşûm / Gunne (1.5-2.5 kHz)</span>
                  <div class="sl-progress-bar"><div class="sl-progress-fill" id="slBandNasal"></div></div>
                </div>
                <div class="sl-band-row">
                  <span>Kâri Formantı (2.5-3.5 kHz)</span>
                  <div class="sl-progress-bar"><div class="sl-progress-fill" id="slBandQari"></div></div>
                </div>
              </div>
            </div>
          </section>

          <!-- İSTASYON 5: NEFES KOÇU -->
          <section id="panel-s5" class="sl-panel" role="tabpanel" aria-labelledby="tab-s5">
            <div class="sl-breath-layout">
              <div class="sl-breath-controls">
                <button class="sl-btn sl-breath-mode-btn active" data-bmode="4-4-8">4-4-8 Isınma</button>
                <button class="sl-btn sl-breath-mode-btn" data-bmode="2-4-12">2-4-12 Tilâvet</button>
                <button class="sl-btn sl-breath-mode-btn" data-bmode="capacity">VAD Kapasite Testi</button>
              </div>

              <div class="sl-breath-visual">
                <svg class="sl-breath-svg" width="260" height="260" viewBox="0 0 260 260">
                  <circle class="sl-breath-bg-circle" cx="130" cy="130" r="110"/>
                  <circle class="sl-breath-progress-circle" id="slBreathCircle" cx="130" cy="130" r="110"/>
                </svg>
                <div class="sl-breath-center-text">
                  <span id="slBreathPhaseLabel">Hazır</span>
                  <h2 id="slBreathCountdown">--</h2>
                </div>
              </div>

              <button id="slBtnStartBreath" class="sl-btn sl-btn-primary sl-btn-lg">Egzersizi Başlat</button>
            </div>
          </section>

        </main>

        <!-- SABİT ALT KONTROL ÇUBUĞU (STICKY CONTROLLER) -->
        <footer class="sl-sticky-bar">
          <div class="sl-bar-left">
            <button id="slBtnToggleMic" class="sl-btn sl-btn-mic" aria-pressed="false">
              <span class="sl-mic-indicator"></span>
              <span id="slMicLabel">Mikrofonu Aç</span>
            </button>
            
            <div class="sl-headphone-alert hidden" id="slHeadphoneAlert" role="alert">
              <span>⚠️ Karar sesi mikrofona sızıyor, lütfen kulaklık takınız!</span>
            </div>
          </div>

          <div class="sl-bar-center">
            <div class="sl-control-group">
              <label for="slAhenkSelect">Ahenk:</label>
              <select id="slAhenkSelect" class="sl-select">
                ${Object.values(AHENKLER).map(a => `<option value="${a.id}">${a.nameTr}</option>`).join('')}
              </select>
            </div>

            <div class="sl-control-group">
              <button id="slBtnToggleDrone" class="sl-btn sl-btn-secondary">
                <span class="sl-drone-indicator"></span>
                <span>Karar Demi</span>
              </button>
            </div>
          </div>

          <div class="sl-bar-right">
            <button id="slBtnLaunchModalGlobal" class="sl-btn sl-btn-accent">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
              <span>Okuma Penceresi</span>
            </button>
          </div>
        </footer>

      </div>
    `;

    this.populateKeyboard();
    this.populateMeddCards();
  }

  populateKeyboard() {
    const container = document.getElementById('slKeyboardContainer');
    if (!container) return;
    container.innerHTML = PITCH_TABLE_53.slice(4, 18).map(p => `
      <button class="sl-key-btn" data-hz="${p.baseHz}">
        <span class="sl-key-name">${p.nameTr}</span>
        <span class="sl-key-note">${p.note}</span>
      </button>
    `).join('');
  }

  populateMeddCards() {
    const strip = document.getElementById('slMeddCardsStrip');
    if (!strip) return;
    strip.innerHTML = MEDD_CARDS.map((c, i) => `
      <div class="sl-medd-card ${i === 0 ? 'active' : ''}" data-medd-id="${c.id}">
        <h4 class="sl-medd-card-ar">${c.arabicText}</h4>
        <span class="sl-medd-card-type">${c.transcription} (${c.targetElifMin}-${c.targetElifMax} Elif)</span>
      </div>
    `).join('');
  }

  bindGlobalEvents() {
    // İstasyon Sekmeleri
    const tabs = this.rootEl.querySelectorAll('.sl-nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const stationNum = parseInt(tab.dataset.station, 10);
        this.switchStation(stationNum);
      });
    });

    // Mikrofon Aç/Kapa
    document.getElementById('slBtnToggleMic')?.addEventListener('click', async () => {
      if (micManager.isActive) {
        micManager.stop();
        studioStore.setState({ isMicActive: false });
      } else {
        await micManager.start();
        spectrumAnalyzer.attach();
        studioStore.setState({ isMicActive: true });
      }
    });

    // Drone Aç/Kapa
    document.getElementById('slBtnToggleDrone')?.addEventListener('click', () => {
      if (droneSynth.isPlaying) {
        droneSynth.stop();
        studioStore.setState({ isDroneActive: false });
      } else {
        const ahenk = AHENKLER[studioStore.state.currentAhenk] || AHENKLER.boulahank;
        droneSynth.play(ahenk.dugahHz, studioStore.state.activeMakamId);
        studioStore.setState({ isDroneActive: true });
      }
    });

    // Ahenk Değişimi
    document.getElementById('slAhenkSelect')?.addEventListener('change', (e) => {
      const ahenkId = e.target.value;
      tuningCore.setAhenk(ahenkId);
      studioStore.setState({ currentAhenk: ahenkId });
      if (droneSynth.isPlaying) {
        droneSynth.play(AHENKLER[ahenkId].dugahHz, studioStore.state.activeMakamId);
      }
    });

    // Okuma Penceresi Açma Butonları
    const launchModal = () => {
      readingModal.open({
        surah: 1,
        ayah: 1,
        surahName: 'Fâtiha',
        makamName: 'Rast',
        arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transcription: 'Bismillâhir-Rahmânir-Rahîm',
        tecvidNote: 'Lafzatullah ve Rahîm medd-i ârızına dikkat ediniz.',
        audioUrl: 'https://everyayah.com/data/Husary_128kbps/001001.mp3',
        audioDurationSeconds: 6.5,
        samples: [
          { t: 0.5, hz: 196, cent: 0 },
          { t: 1.5, hz: 220, cent: 204 },
          { t: 3.0, hz: 244, cent: 385 },
          { t: 4.5, hz: 220, cent: 204 },
          { t: 6.0, hz: 196, cent: 0 }
        ]
      });
    };

    document.getElementById('slBtnLaunchModalGlobal')?.addEventListener('click', launchModal);
    document.getElementById('slBtnOpenModalFromStation3')?.addEventListener('click', launchModal);

    // Medd Kartı Seçimi (D1 çözümü)
    this.rootEl.querySelectorAll('.sl-medd-card').forEach(card => {
      card.addEventListener('click', () => {
        this.rootEl.querySelectorAll('.sl-medd-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        meddEngine.setCard(card.dataset.meddId);
      });
    });

    // Nefes Egzersizi Butonu
    document.getElementById('slBtnStartBreath')?.addEventListener('click', () => {
      if (breathCoach.isRunning) {
        breathCoach.stop();
        document.getElementById('slBtnStartBreath').textContent = 'Egzersizi Başlat';
      } else {
        breathCoach.start();
        document.getElementById('slBtnStartBreath').textContent = 'Durdur';
      }
    });
  }

  switchStation(num) {
    this.activeStationId = num;
    this.rootEl.querySelectorAll('.sl-nav-tab').forEach(t => {
      const active = parseInt(t.dataset.station, 10) === num;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active);
    });
    this.rootEl.querySelectorAll('.sl-panel').forEach(p => {
      p.classList.toggle('active', p.id === `panel-s${num}`);
    });
    studioStore.setState({ activeStation: num });
  }

  subscribeToStore() {
    studioStore.subscribe('isMicActive', (isActive) => {
      const btn = document.getElementById('slBtnToggleMic');
      const label = document.getElementById('slMicLabel');
      btn.classList.toggle('active', isActive);
      label.textContent = isActive ? 'Mikrofon Açık' : 'Mikrofonu Aç';
    });

    studioStore.subscribe('isDroneActive', (isPlaying) => {
      const btn = document.getElementById('slBtnToggleDrone');
      btn.classList.toggle('active', isPlaying);
    });

    micManager.subscribe((frame) => {
      if (frame.voiced && frame.hz > 0) {
        const tuned = tuningCore.resolvePitch(frame.hz);
        this.updateTunerUI(frame.hz, tuned);
      }
      meddEngine.processFrame(frame);
      breathCoach.processVADFrame(frame);
    });

    meddEngine.subscribe((data) => this.updateMeddUI(data));
    breathCoach.subscribe((data) => this.updateBreathUI(data));
  }

  updateTunerUI(rawHz, tuned) {
    const needle = document.getElementById('slTunerNeedle');
    const hzEl = document.getElementById('slTunerHz');
    const noteEl = document.getElementById('slTunerNote');
    const centEl = document.getElementById('slTunerCent');

    if (!needle) return;

    const angle = Math.max(-50, Math.min(50, tuned.centDeviation));
    needle.style.transform = `rotate(${angle}deg)`;
    hzEl.textContent = `${Math.round(rawHz)} Hz`;
    noteEl.textContent = `${tuned.traditionalName} (${tuned.noteName})`;
    centEl.textContent = `${tuned.centDeviation > 0 ? '+' : ''}${tuned.centDeviation} cent (${tuned.komaDeviation} koma)`;
  }

  updateMeddUI(data) {
    const digit = document.getElementById('slMeddBigDigit');
    const desc = document.getElementById('slMeddDesc');
    const badge = document.getElementById('slMeddStateBadge');
    if (!digit) return;

    digit.textContent = data.calculatedElif.toFixed(1);
    desc.textContent = data.evaluation.label;
    badge.textContent = data.state;

    // 6 Elif çubuklarını yak
    const bars = this.rootEl.querySelectorAll('.sl-elif-bar');
    bars.forEach(b => {
      const val = parseInt(b.dataset.elif, 10);
      b.classList.toggle('active', data.calculatedElif >= val);
    });
  }

  updateBreathUI(evt) {
    const circle = document.getElementById('slBreathCircle');
    const phaseLabel = document.getElementById('slBreathPhaseLabel');
    const countEl = document.getElementById('slBreathCountdown');
    if (!circle) return;

    const circumference = 2 * Math.PI * 110;

    if (evt.type === 'progress') {
      const p = evt.data.progress;
      circle.style.strokeDasharray = `${circumference}`;
      circle.style.strokeDashoffset = `${circumference * (1 - p)}`;
      circle.style.stroke = evt.data.phase.color;
      phaseLabel.textContent = evt.data.phase.name;
      countEl.textContent = evt.data.remainingSeconds;
    } else if (evt.type === 'state' && evt.mode === 'capacity') {
      phaseLabel.textContent = evt.vadTestState === 'RECORDING' ? 'Ses Ölçülüyor...' : 'Ses Bekleniyor';
      countEl.textContent = `${evt.recordedDurationSeconds}s`;
    }
  }

  startRenderLoop() {
    const tick = () => {
      if (this.activeStationId === 4 && micManager.isActive) {
        const specCanvas = document.getElementById('slSpecCanvas');
        const oscCanvas = document.getElementById('slOscCanvas');
        spectrumAnalyzer.drawLogFrequencyBars(specCanvas);
        spectrumAnalyzer.drawOscilloscope(oscCanvas);

        const bands = spectrumAnalyzer.getBandsEnergy();
        document.getElementById('slBandChest').style.width = `${bands.chest}%`;
        document.getElementById('slBandOral').style.width = `${bands.oral}%`;
        document.getElementById('slBandNasal').style.width = `${bands.nasal}%`;
        document.getElementById('slBandQari').style.width = `${bands.qariFormant}%`;
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }
}
```
