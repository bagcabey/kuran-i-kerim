// kimatik_lab/audio_lab/ui/studio_ui.js
// 5 İstasyon Paneli, Sabit Kontrol Barı ve Kısmi DOM Render Motoru

import { studioStore } from './studio_store.js';
import { micManager } from '../core/mic_manager.js';
import { masterBus } from '../core/master_bus.js';
import { droneSynth } from '../instruments/drone_v2.js';
import { tuningCore, AHENKLER, PITCH_TABLE_53 } from '../core/tuning_core.js';
import { meddEngine, MEDD_CARDS } from '../core/medd_engine.js';
import { spectrumAnalyzer } from '../core/spectrum_analyzer.js';

export class StudioUI {
  constructor(rootContainerId) {
    this.rootContainerId = rootContainerId;
    this.rootEl = null;
    this.activeStationId = 1;
    this.rafId = null;
  }

  init() {
    this.rootEl = typeof this.rootContainerId === 'string'
      ? document.getElementById(this.rootContainerId)
      : this.rootContainerId;
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
            <span class="sl-brand-icon"></span>
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
              <span class="sl-tab-num">5</span> Şan &amp; Nefes Rehberi
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
                <p>Usta kârilerin tilâvet seyrini ve nağme kıvrımlarını karşılaştırmak için sabit alt çubuktaki Okuma Penceresini açın.</p>
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
            <div class="sl-breath-guide-promo">
              <span class="sl-breath-guide-icon" aria-hidden="true"></span>
              <div>
                <span class="sl-badge">ŞAN · SES · NEFES</span>
                <h2>Nefes ve ses çalışmalarının tamamı tek atölyede</h2>
                <p>Güvenli ritim koçu, adım adım egzersizler, günlük hayata aktarım ve bugünkü ilerlemen Şan &amp; Ses Atölyesi’nde.</p>
                <button id="slBtnOpenBreathGuide" class="sl-btn sl-btn-primary sl-btn-lg">Nefes &amp; Ses Atölyesini Aç</button>
              </div>
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
              <span>⚠ Karar sesi mikrofona sızıyor, lütfen kulaklık takınız!</span>
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
      if (typeof window.openSelectedAyahFocusModal === 'function') {
        window.openSelectedAyahFocusModal();
      } else if (window.showToast) {
        window.showToast('Odak penceresini açmak için önce ana alanda bir âyet seçin.');
      } else {
        console.error('Odak penceresi açılamadı: seçili âyet entegrasyonu hazır değil.');
      }
    };

    document.getElementById('slBtnLaunchModalGlobal')?.addEventListener('click', launchModal);

    // Medd Kartı Seçimi (D1 çözümü)
    this.rootEl.querySelectorAll('.sl-medd-card').forEach(card => {
      card.addEventListener('click', () => {
        this.rootEl.querySelectorAll('.sl-medd-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        meddEngine.setCard(card.dataset.meddId);
      });
    });

    document.getElementById('slBtnOpenBreathGuide')?.addEventListener('click', () => {
      if (typeof window.switchAppTab === 'function') window.switchAppTab('tab-akademi');
      const guideLink = document.querySelector('.akademi-nav-btn[data-view="san"]');
      if (guideLink && typeof guideLink.click === 'function') {
        guideLink.click();
      } else if (window.showToast) {
        window.showToast('Şan & Ses Atölyesi açılamadı. Ana Akademi menüsünden tekrar deneyin.');
      } else {
        console.error('Şan & Ses Atölyesi bağlantısı bulunamadı.');
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
      if (btn) btn.classList.toggle('active', isActive);
      if (label) label.textContent = isActive ? 'Mikrofon Açık' : 'Mikrofonu Aç';
    });

    studioStore.subscribe('isDroneActive', (isPlaying) => {
      const btn = document.getElementById('slBtnToggleDrone');
      if (btn) btn.classList.toggle('active', isPlaying);
    });

    micManager.subscribe((frame) => {
      if (frame.voiced && frame.hz > 0) {
        const tuned = tuningCore.resolvePitch(frame.hz);
        this.updateTunerUI(frame.hz, tuned);
      }
      meddEngine.processFrame(frame);
    });

    meddEngine.subscribe((data) => this.updateMeddUI(data));
  }

  updateTunerUI(rawHz, tuned) {
    const needle = document.getElementById('slTunerNeedle');
    const hzEl = document.getElementById('slTunerHz');
    const noteEl = document.getElementById('slTunerNote');
    const centEl = document.getElementById('slTunerCent');

    if (!needle) return;

    const angle = Math.max(-50, Math.min(50, tuned.centDeviation));
    needle.style.transform = `rotate(${angle}deg)`;
    if (hzEl) hzEl.textContent = `${Math.round(rawHz)} Hz`;
    if (noteEl) noteEl.textContent = `${tuned.traditionalName} (${tuned.noteName})`;
    if (centEl) centEl.textContent = `${tuned.centDeviation > 0 ? '+' : ''}${tuned.centDeviation} cent (${tuned.komaDeviation} koma)`;
  }

  updateMeddUI(data) {
    const digit = document.getElementById('slMeddBigDigit');
    const desc = document.getElementById('slMeddDesc');
    const badge = document.getElementById('slMeddStateBadge');
    if (!digit) return;

    digit.textContent = data.calculatedElif.toFixed(1);
    if (desc) desc.textContent = data.evaluation.label;
    if (badge) badge.textContent = data.state;

    // 6 Elif çubuklarını yak
    const bars = this.rootEl.querySelectorAll('.sl-elif-bar');
    bars.forEach(b => {
      const val = parseInt(b.dataset.elif, 10);
      b.classList.toggle('active', data.calculatedElif >= val);
    });
  }

  startRenderLoop() {
    const tick = () => {
      if (this.activeStationId === 4 && micManager.isActive) {
        const specCanvas = document.getElementById('slSpecCanvas');
        const oscCanvas = document.getElementById('slOscCanvas');
        spectrumAnalyzer.drawLogFrequencyBars(specCanvas);
        spectrumAnalyzer.drawOscilloscope(oscCanvas);

        const bands = spectrumAnalyzer.getBandsEnergy();
        const chest = document.getElementById('slBandChest');
        const oral = document.getElementById('slBandOral');
        const nasal = document.getElementById('slBandNasal');
        const qari = document.getElementById('slBandQari');
        if (chest) chest.style.width = `${bands.chest}%`;
        if (oral) oral.style.width = `${bands.oral}%`;
        if (nasal) nasal.style.width = `${bands.nasal}%`;
        if (qari) qari.style.width = `${bands.qariFormant}%`;
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }
}
