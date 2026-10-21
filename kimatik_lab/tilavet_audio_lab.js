/**
 * CYMATIQUE — TİLAVET AKADEMİSİ
 * Ses Laboratuvarı & DSP Motoru (tilavet_audio_lab.js)
 * =============================================================================
 * Web Audio API tabanlı Karar Drone Sentezleyicisi, Perde Oynatıcı,
 * Gerçek Zamanlı F0 Frekans/Perde Dedektörü (Autocorrelation),
 * Cent Sapmalı Canlı Tuner ve Diyafram Nefes Zamanlayıcısı.
 * =============================================================================
 */

(function (window) {
  'use strict';

  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // ===========================================================================
  // 1. DRONE (KARAR SESİ) VE PİYANO NOTA SENTEZLEYİCİ
  // ===========================================================================
  class DroneSynthesizer {
    constructor() {
      this.active = false;
      this.currentFreq = 220; // Default A3
      this.oscillators = [];
      this.gainNode = null;
      this.filterNode = null;

      this.MAKAM_PRESETS = {
        rast:     { name: "Rast Karar (Sol / G3 · 196 Hz)", note: "G3", freq: 196.00, desc: "Aydınlık, fıtrî ve ferah karar" },
        ussak:    { name: "Uşşak / Beyatî Karar (La / Dügâh · A3 · 220 Hz)", note: "A3", freq: 220.00, desc: "Tevazu, hüzün, huşû ve teslimiyet" },
        segah:    { name: "Segâh Karar (Si Koma Bemol · 241 Hz)", note: "B3b-koma", freq: 241.00, desc: "Mistik, tefekkür ve münâcât" },
        hicaz:    { name: "Hicaz Karar (La / Dügâh · A3 · 220 Hz)", note: "A3", freq: 220.00, desc: "Derin yakarış, celâl ve tesir" },
        saba:     { name: "Sabâ Karar (La / Dügâh · A3 · 220 Hz)", note: "A3", freq: 220.00, desc: "Seher vakti, gözyaşı ve nedamet" },
        nahavend: { name: "Nihâvend Karar (Do / Çargâh · C4 · 261.6 Hz)", note: "C4", freq: 261.63, desc: "Vakar, dinginlik ve letafet" },
        huseyni:  { name: "Hüseynî Karar (La / Dügâh · A3 · 220 Hz)", note: "A3", freq: 220.00, desc: "Genişlik, kahramanlık ve teslimiyet" }
      };
    }

    startMakam(makamKey, timbre = 'tanbur') {
      const preset = this.MAKAM_PRESETS[makamKey] || this.MAKAM_PRESETS.ussak;
      this.start(preset.freq, timbre);
      return preset;
    }

    start(freq = 220, timbre = 'tanbur') {
      this.stop();
      if (typeof window.TilavetAudioManager !== 'undefined') {
        window.TilavetAudioManager.notifyPlay('drone');
      }
      const ctx = getAudioContext();
      this.currentFreq = freq;
      this.active = true;

      // Master Gain
      this.gainNode = ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.8);

      // Lowpass Formant Filter (Akustik Tını)
      this.filterNode = ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(timbre === 'ney' ? 850 : 1200, ctx.currentTime);
      this.filterNode.Q.setValueAtTime(2.5, ctx.currentTime);

      // Zengin Harmonik Osilatör Seti (1x, 2x, 3x harmonikler)
      const harmonics = [
        { mult: 1, gain: 0.6, type: 'triangle' },
        { mult: 2, gain: 0.25, type: 'sine' },
        { mult: 3, gain: 0.1, type: 'sine' },
        { mult: 0.5, gain: 0.35, type: 'sine' } // Alt oktav derinliği
      ];

      this.oscillators = harmonics.map(h => {
        const osc = ctx.createOscillator();
        const subGain = ctx.createGain();
        osc.type = h.type;
        osc.frequency.setValueAtTime(freq * h.mult, ctx.currentTime);
        subGain.gain.setValueAtTime(h.gain, ctx.currentTime);

        osc.connect(subGain);
        subGain.connect(this.filterNode);
        osc.start();
        return osc;
      });

      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(ctx.destination);
    }

    stop() {
      if (!this.active) return;
      const ctx = getAudioContext();
      if (this.gainNode) {
        try {
          this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, ctx.currentTime);
          this.gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
          setTimeout(() => {
            this.oscillators.forEach(o => { try { o.stop(); o.disconnect(); } catch (_) {} });
            this.oscillators = [];
            this.gainNode?.disconnect();
            this.filterNode?.disconnect();
          }, 450);
        } catch (_) {}
      }
      this.active = false;
    }

    playSingleNote(freq, duration = 1.2) {
      if (typeof window.TilavetAudioManager !== 'undefined') {
        window.TilavetAudioManager.notifyPlay('drone');
      }
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration + 0.1);
    }
  }

  // ===========================================================================
  // 2. GERÇEK ZAMANLI PERDE (F0) VE TUNER DEDEKTÖRÜ (WORKER & DSP OFFLOAD)
  // ===========================================================================
  class PitchDetector {
    constructor() {
      this.isListening = false;
      this.stream = null;
      this.sourceNode = null;
      this.analyser = null;
      this.buf = new Float32Array(2048);
      this.rafId = null;
      this.lastProcessTime = 0;
      this.throttleIntervalMs = 38; // ~26 FPS kontrollü UI güncelleme sıklığı
      this.onPitchCallback = null;
      this.listeners = new Set();
      this.worker = null;
      this.isWorkerBusy = false;

      this.initWorker();
    }

    addListener(fn) {
      if (typeof fn === 'function') {
        this.listeners.add(fn);
      }
    }

    removeListener(fn) {
      this.listeners.delete(fn);
    }

    emitPitch(data) {
      if (typeof this.onPitchCallback === 'function') {
        try { this.onPitchCallback(data); } catch (e) { console.error(e); }
      }
      for (const fn of this.listeners) {
        try { fn(data); } catch (e) { console.error(e); }
      }
    }

    initWorker() {
      if (typeof window.Worker === 'undefined') return;
      try {
        const workerCode = `
          self.onmessage = function(e) {
            var buffer = new Float32Array(e.data.buffer);
            var sampleRate = e.data.sampleRate;
            var pitch = autoCorrelate(buffer, sampleRate);
            if (pitch !== -1) {
              var noteData = freqToNote(pitch);
              self.postMessage({
                detected: true,
                freq: pitch,
                note: noteData.note,
                cents: noteData.cents,
                inTune: Math.abs(noteData.cents) <= 15
              });
            } else {
              self.postMessage({ detected: false });
            }
          };

          function autoCorrelate(buffer, sampleRate) {
            var SIZE = buffer.length;
            var rms = 0;
            for (var i = 0; i < SIZE; i++) {
              var val = buffer[i];
              rms += val * val;
            }
            rms = Math.sqrt(rms / SIZE);
            if (rms < 0.015) return -1; // Yetersiz enerji (sessizlik tabanı)

            var r1 = 0, r2 = SIZE - 1, thres = 0.2;
            for (var i = 0; i < SIZE / 2; i++) {
              if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
            }
            for (var i = 1; i < SIZE / 2; i++) {
              if (Math.abs(buffer[SIZE - i]) < thres) { r2 = SIZE - i; break; }
            }

            buffer = buffer.slice(r1, r2);
            SIZE = buffer.length;

            var c = new Array(SIZE).fill(0);
            for (var i = 0; i < SIZE; i++) {
              for (var j = 0; j < SIZE - i; j++) {
                c[i] = c[i] + buffer[j] * buffer[j + i];
              }
            }

            var d = 0;
            while (c[d] > c[d + 1]) d++;
            var maxval = -1, maxpos = -1;
            for (var i = d; i < SIZE; i++) {
              if (c[i] > maxval) {
                maxval = c[i];
                maxpos = i;
              }
            }
            var T0 = maxpos;

            var x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
            var a = (x1 + x3 - 2 * x2) / 2;
            var b = (x3 - x1) / 2;
            if (a) T0 = T0 - b / (2 * a);

            var freq = sampleRate / T0;
            if (freq >= 60 && freq <= 1100) {
              return freq;
            }
            return -1;
          }

          function freqToNote(freq) {
            var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            var A4 = 440;
            var noteNum = 12 * (Math.log(freq / A4) / Math.log(2));
            var roundedNote = Math.round(noteNum) + 69;
            var noteName = noteStrings[roundedNote % 12];
            var octave = Math.floor(roundedNote / 12) - 1;
            var exactFreq = A4 * Math.pow(2, (roundedNote - 69) / 12);
            var cents = Math.floor(1200 * (Math.log(freq / exactFreq) / Math.log(2)));
            return { note: noteName + octave, cents: cents };
          }
        `;
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        this.worker = new Worker(URL.createObjectURL(blob));
        this.worker.onmessage = (e) => {
          this.isWorkerBusy = false;
          this.emitPitch(e.data);
        };
      } catch (e) {
        console.warn("[PitchDetector] Web Worker başlatılamadı, fallback modu kullanılacak:", e);
        this.worker = null;
      }
    }

    async start(callback) {
      if (typeof callback === 'function') {
        this.onPitchCallback = callback;
      }
      if (this.isListening) {
        return;
      }
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        try { await ctx.resume(); } catch (_) {}
      }

      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
      } catch (err) {
        console.warn("[PitchDetector] Mikrofon izni alınamadı:", err);
        throw err;
      }

      this.sourceNode = ctx.createMediaStreamSource(this.stream);
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.sourceNode.connect(this.analyser);

      this.isListening = true;
      this.loop();
    }

    stop() {
      this.isListening = false;
      if (this.rafId) cancelAnimationFrame(this.rafId);
      if (this.stream) {
        this.stream.getTracks().forEach(t => t.stop());
        this.stream = null;
      }
      this.sourceNode?.disconnect();
      this.analyser?.disconnect();
      this.isWorkerBusy = false;
      this.emitPitch({ detected: false });
    }

    getAnalyser() {
      return this.analyser;
    }

    getWaveformData(outputArray) {
      if (this.analyser && this.isListening) {
        this.analyser.getByteTimeDomainData(outputArray);
        return true;
      }
      return false;
    }

    getFrequencyData(outputArray) {
      if (this.analyser && this.isListening) {
        this.analyser.getByteFrequencyData(outputArray);
        return true;
      }
      return false;
    }

    loop() {
      if (!this.isListening) return;

      const now = performance.now();
      if (now - this.lastProcessTime >= this.throttleIntervalMs) {
        this.lastProcessTime = now;
        this.analyser.getFloatTimeDomainData(this.buf);

        if (this.worker && !this.isWorkerBusy) {
          // Sıfır kopyalama için buffer klonlanıp Transferable olarak worker'a aktarılır
          this.isWorkerBusy = true;
          const copy = new Float32Array(this.buf);
          this.worker.postMessage({ buffer: copy.buffer, sampleRate: getAudioContext().sampleRate }, [copy.buffer]);
        } else if (!this.worker) {
          // Fallback senkron yürütme
          const pitch = this.autoCorrelateFallback(this.buf, getAudioContext().sampleRate);
          if (pitch !== -1) {
            const noteData = this.freqToNote(pitch);
            this.emitPitch({
              detected: true,
              freq: pitch,
              note: noteData.note,
              cents: noteData.cents,
              inTune: Math.abs(noteData.cents) <= 15
            });
          } else {
            this.emitPitch({ detected: false });
          }
        }
      }

      this.rafId = requestAnimationFrame(() => this.loop());
    }

    autoCorrelateFallback(buffer, sampleRate) {
      let SIZE = buffer.length;
      let rms = 0;
      for (let i = 0; i < SIZE; i++) {
        const val = buffer[i];
        rms += val * val;
      }
      rms = Math.sqrt(rms / SIZE);
      if (rms < 0.015) return -1;

      let r1 = 0, r2 = SIZE - 1, thres = 0.2;
      for (let i = 0; i < SIZE / 2; i++) {
        if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
      }
      for (let i = 1; i < SIZE / 2; i++) {
        if (Math.abs(buffer[SIZE - i]) < thres) { r2 = SIZE - i; break; }
      }

      buffer = buffer.slice(r1, r2);
      SIZE = buffer.length;

      const c = new Array(SIZE).fill(0);
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE - i; j++) {
          c[i] = c[i] + buffer[j] * buffer[j + i];
        }
      }

      let d = 0;
      while (c[d] > c[d + 1]) d++;
      let maxval = -1, maxpos = -1;
      for (let i = d; i < SIZE; i++) {
        if (c[i] > maxval) {
          maxval = c[i];
          maxpos = i;
        }
      }
      let T0 = maxpos;

      let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
      let a = (x1 + x3 - 2 * x2) / 2;
      let b = (x3 - x1) / 2;
      if (a) T0 = T0 - b / (2 * a);

      const freq = sampleRate / T0;
      if (freq >= 60 && freq <= 1100) return freq;
      return -1;
    }

    freqToNote(freq) {
      const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      const A4 = 440;
      const noteNum = 12 * (Math.log(freq / A4) / Math.log(2));
      const roundedNote = Math.round(noteNum) + 69;
      const noteName = noteStrings[roundedNote % 12];
      const octave = Math.floor(roundedNote / 12) - 1;
      const exactFreq = A4 * Math.pow(2, (roundedNote - 69) / 12);
      const cents = Math.floor(1200 * (Math.log(freq / exactFreq) / Math.log(2)));

      return {
        note: `${noteName}${octave}`,
        cents: cents
      };
    }
  }

  // ===========================================================================
  // 3. Rahat nefes ritmi koçu (nefes tutma içermez)
  // ===========================================================================
  class BreathCoach {
    constructor() {
      this.isRunning = false;
      this.timerId = null;
      this.phase = 'idle'; // 'inhale' or 'exhale'
      this.remainingSeconds = 0;
      this.onTickCallback = null;
    }

    start(onTick, pattern = 'gentle') {
      this.onTickCallback = onTick;
      this.pattern = pattern === 'short' ? 'short' : 'gentle';
      this.isRunning = true;
      this.runCycle();
    }

    stop() {
      this.isRunning = false;
      clearTimeout(this.timerId);
      this.phase = 'idle';
      if (this.onTickCallback) this.onTickCallback({ phase: 'idle', seconds: 0, text: 'Hazır' });
    }

    runCycle() {
      if (!this.isRunning) return;

      // Nefes ritmi rahat olmalı; süreler hedef değil, zorlamadan takip edilir.
      this.phase = 'inhale';
      const inhaleSeconds = this.pattern === 'short' ? 2 : 3;
      this.countPhase(inhaleSeconds, 'Burundan rahatça nefes al', () => {
        if (!this.isRunning) return;
        this.phase = 'exhale';
        this.countPhase(4, 'Nefesi dudakları hafif büzerek rahatça ver', () => {
          if (this.isRunning) this.runCycle();
        });
      });
    }

    countPhase(seconds, text, onComplete) {
      let sec = seconds;
      const tick = () => {
        if (!this.isRunning) return;
        if (this.onTickCallback) {
          this.onTickCallback({
            phase: this.phase,
            seconds: sec,
            totalSeconds: seconds,
            text: text
          });
        }
        if (sec > 0) {
          sec--;
          this.timerId = setTimeout(tick, 1000);
        } else {
          onComplete();
        }
      };
      tick();
    }
  }

  // ===========================================================================
  // 4. MİKROFON SES KAYDEDİCİSİ (MEDIARECORDER YEREL SAKLAMA)
  // ===========================================================================
  class VoiceRecorder {
    constructor() {
      this.mediaRecorder = null;
      this.audioChunks = [];
      this.isRecording = false;
      this.stream = null;
      this.startTime = 0;
    }

    async start() {
      this.audioChunks = [];
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: 'audio/webm' };
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        this.mediaRecorder = new MediaRecorder(this.stream);
      } else {
        this.mediaRecorder = new MediaRecorder(this.stream, options);
      }

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.audioChunks.push(e.data);
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      this.startTime = Date.now();
    }

    stop() {
      return new Promise((resolve) => {
        if (!this.isRecording || !this.mediaRecorder) {
          resolve(null);
          return;
        }

        this.mediaRecorder.onstop = () => {
          const durationSec = Math.round((Date.now() - this.startTime) / 1000);
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          this.isRecording = false;
          if (this.stream) {
            this.stream.getTracks().forEach(t => t.stop());
            this.stream = null;
          }
          resolve({ blob: audioBlob, url: audioUrl, duration: durationSec });
        };

        this.mediaRecorder.stop();
      });
    }
  }

  // ===========================================================================
  // 5. MEDD UZATMA SÜRESİ TAKİPÇİSİ (ADAPTİF AKUSTİK ELİF MİKTARI ÖLÇER)
  // ===========================================================================
  class MeddTimer {
    constructor() {
      this.measuring = false;
      this.activeDurationMs = 0;
      this.thresholdRms = 0.02;
      this.currentMode = 'tertil'; // 'tahkik', 'tertil', 'tedvir', 'hadr'
      
      // Okuma Biçimleri Tempo Çarpanları (K_tempo)
      this.TEMPO_PRESETS = {
        tahkik: { mult: 1.40, name: "Tahkik (Ağır / Tane Tane)" },
        tertil: { mult: 1.00, name: "Tertil (Dengeli / Orta)" },
        tedvir: { mult: 0.85, name: "Tedvir (Orta-Hızlı)" },
        hadr:   { mult: 0.70, name: "Hadr (Hızlı / Hatim)" }
      };

      // Dayanıklı Tempo Tahmini için Geçerli Hece Geçmişi (Nefes ve sessizlikler hariç)
      this.syllableDurations = [];
    }

    setMode(mode) {
      if (this.TEMPO_PRESETS[mode]) {
        this.currentMode = mode;
      }
    }

    addSyllableSample(durationMs) {
      // 120ms ile 1200ms arasındaki gerçekçi hece sürelerini kaydet
      if (durationMs >= 120 && durationMs <= 1200) {
        this.syllableDurations.push(durationMs);
        if (this.syllableDurations.length > 10) {
          this.syllableDurations.shift();
        }
      }
    }

    getEffectiveMultiplier() {
      const baseMult = this.TEMPO_PRESETS[this.currentMode]?.mult || 1.0;
      if (this.syllableDurations.length >= 4) {
        // Medyan hece süresi ile ince ayar (±%15 sınırlandırmalı tolerans)
        const sorted = [...this.syllableDurations].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        const normalized = median / 280; // 280ms = standart tertil hecesi
        const adaptiveFactor = Math.max(0.85, Math.min(1.15, normalized));
        return baseMult * adaptiveFactor;
      }
      return baseMult;
    }

    evaluateElifAmount(durationMs) {
      const K = this.getEffectiveMultiplier();
      const uncertainty = Math.round(110 * K);

      // Dinamik / Adaptif Hedef Aralıkları: T_hedef = T_referans * K_tempo
      const t1Min = Math.round(750 * K);
      const t1Max = Math.round(1450 * K);
      const t2Max = Math.round(2600 * K);
      const t4Max = Math.round(4800 * K);

      if (durationMs < t1Min) {
        return {
          elif: 0.5,
          text: `Yetersiz (Kasr - ${this.TEMPO_PRESETS[this.currentMode].name})`,
          valid: false,
          color: "#ff3366",
          uncertaintyMs: uncertainty,
          tempoK: K.toFixed(2),
          pedagogicalNote: "Asgari 1 Elif miktarı uzatılmalıdır."
        };
      }
      if (durationMs >= t1Min && durationMs < t1Max) {
        return {
          elif: 1,
          text: `1 Elif (Tabiî Med - ${this.TEMPO_PRESETS[this.currentMode].name})`,
          valid: true,
          color: "#00e676",
          uncertaintyMs: uncertainty,
          tempoK: K.toFixed(2),
          pedagogicalNote: "Tabiî med süresi temponuza uygun ve dengeli."
        };
      }
      if (durationMs >= t1Max && durationMs < t2Max) {
        return {
          elif: 2,
          text: `2 Elif (Ârız / Lîn - ${this.TEMPO_PRESETS[this.currentMode].name})`,
          valid: true,
          color: "#e5b869",
          uncertaintyMs: uncertainty,
          tempoK: K.toFixed(2),
          pedagogicalNote: "Vakıf halinde câiz olan med süresi."
        };
      }
      if (durationMs >= t2Max && durationMs <= t4Max) {
        return {
          elif: 4,
          text: `4 Elif (Muttasıl / Munfasıl / Lâzım - ${this.TEMPO_PRESETS[this.currentMode].name})`,
          valid: true,
          color: "#00e676",
          uncertaintyMs: uncertainty,
          tempoK: K.toFixed(2),
          pedagogicalNote: "Hükmî ve lâzım medler için tam ölçü."
        };
      }
      return {
        elif: 5,
        text: `Aşırı Uzatma (İfrat > 4 Elif - ${this.TEMPO_PRESETS[this.currentMode].name})`,
        valid: false,
        color: "#ff9100",
        uncertaintyMs: uncertainty,
        tempoK: K.toFixed(2),
        pedagogicalNote: "Sesi gereğinden fazla uzatmak lafzı bozar; kısaltılmalıdır."
      };
    }
  }

  // ===========================================================================
  // 6. DTW VE PERDE KONTURU KARŞILAŞTIRMA MOTORU (DYNAMIC TIME WARPING)
  // ===========================================================================
  class ContourAnalyzer {
    constructor() {
      this.referenceCache = new Map();
      this.referenceRequests = new Map();
      this.maxCachedReferences = 160;
    }

    async loadReference(ayahKey, qariKey, audioUrl) {
      if (!ayahKey || !qariKey || !audioUrl) throw new Error('Âyet, kâri ve ses kaynağı gereklidir.');
      if (this.referenceCache.has(audioUrl)) return this.referenceCache.get(audioUrl);
      if (this.referenceRequests.has(audioUrl)) return this.referenceRequests.get(audioUrl);

      const request = (async () => {
        const response = await fetch(audioUrl, { mode: 'cors', credentials: 'omit' });
        if (!response.ok) throw new Error(`Ses kaynağı HTTP ${response.status} yanıtı verdi.`);

        const encodedAudio = await response.arrayBuffer();
        const audioBuffer = await getAudioContext().decodeAudioData(encodedAudio);
        const rawPoints = this.extractPitchContour(audioBuffer);
        if (rawPoints.length < 5) throw new Error('Bu kayıtta güvenilir F0 konturu çıkarılamadı.');

        const sortedPitches = rawPoints.map(point => point.hz).sort((a, b) => a - b);
        // Robust 35th percentile anchor calculation
        const anchorHz = sortedPitches[Math.floor((sortedPitches.length - 1) * 0.35)] || 160;
        const points = rawPoints.map(point => {
          let cents = 1200 * Math.log2(point.hz / anchorHz);
          // Safeguard within realistic vocal bounds (-800 to +1600 cents)
          cents = Math.max(-800, Math.min(1600, cents));
          return {
            ...point,
            cents: Math.round(cents * 10) / 10
          };
        });
        const reference = {
          ayahKey,
          qariKey,
          audioUrl,
          durationMs: Math.round(audioBuffer.duration * 1000),
          anchorHz: Math.round(anchorHz * 10) / 10,
          points,
          sampleCount: points.length,
          source: 'audio-f0'
        };

        this.referenceCache.set(audioUrl, reference);
        if (this.referenceCache.size > this.maxCachedReferences) {
          this.referenceCache.delete(this.referenceCache.keys().next().value);
        }
        return reference;
      })();

      this.referenceRequests.set(audioUrl, request);
      try {
        return await request;
      } finally {
        this.referenceRequests.delete(audioUrl);
      }
    }

    extractPitchContour(audioBuffer) {
      const channelCount = audioBuffer.numberOfChannels || 1;
      const sourceRate = audioBuffer.sampleRate;
      const decimation = Math.max(1, Math.round(sourceRate / 12000));
      const sampleRate = sourceRate / decimation;
      const channelData = Array.from({ length: channelCount }, (_, index) => audioBuffer.getChannelData(index));
      const sampleCount = Math.ceil(audioBuffer.length / decimation);
      const mono = new Float32Array(sampleCount);

      for (let outputIndex = 0; outputIndex < sampleCount; outputIndex++) {
        const start = outputIndex * decimation;
        const end = Math.min(start + decimation, audioBuffer.length);
        let total = 0;
        for (let sampleIndex = start; sampleIndex < end; sampleIndex++) {
          for (const channel of channelData) total += channel[sampleIndex] || 0;
        }
        mono[outputIndex] = total / ((end - start) * channelCount);
      }

      // 1. Dinamik Tepe Enerji ve Sessizlik Tabanı
      let peakRms = 0;
      const rmsChunk = 512;
      for (let i = 0; i + rmsChunk <= mono.length; i += rmsChunk) {
        let e = 0;
        for (let j = 0; j < rmsChunk; j++) e += mono[i + j] * mono[i + j];
        const r = Math.sqrt(e / rmsChunk);
        if (r > peakRms) peakRms = r;
      }
      const silenceThreshold = Math.max(0.010, peakRms * 0.038);

      const frameSize = 1024;
      const hopSize = Math.max(1, Math.round(sampleRate * 0.03)); // 30ms adımı
      const minHz = 75;
      const maxHz = 550; // Kur'an tilaveti için bilimsel vokal aralığı
      const minLag = Math.max(2, Math.floor(sampleRate / maxHz));
      const maxLag = Math.min(frameSize - 2, Math.ceil(sampleRate / minHz));
      const normalizedDifference = new Float32Array(maxLag + 1);
      const candidatePoints = [];

      let runningMedianHz = 0;
      const recentValidHz = [];

      for (let frameStart = 0; frameStart + frameSize <= mono.length; frameStart += hopSize) {
        let energy = 0;
        for (let index = frameStart; index < frameStart + frameSize; index++) {
          energy += mono[index] * mono[index];
        }
        const frameRms = Math.sqrt(energy / frameSize);
        if (frameRms < silenceThreshold) continue;

        let cumulativeDifference = 0;
        normalizedDifference[0] = 1;
        for (let lag = 1; lag <= maxLag; lag++) {
          let sum = 0;
          const limit = frameStart + frameSize - lag;
          for (let index = frameStart; index < limit; index++) {
            const delta = mono[index] - mono[index + lag];
            sum += delta * delta;
          }
          cumulativeDifference += sum;
          normalizedDifference[lag] = cumulativeDifference === 0 ? 1 : (sum * lag) / cumulativeDifference;
        }

        // 2. YIN Dip Eşiği: 0.18 (Gürültülü sürtünmeli ünsüz zıplamalarını engeller)
        let bestLag = -1;
        for (let lag = minLag; lag <= maxLag; lag++) {
          if (normalizedDifference[lag] < 0.18) {
            while (lag < maxLag && normalizedDifference[lag + 1] < normalizedDifference[lag]) lag++;
            bestLag = lag;
            break;
          }
        }
        // Eğer 0.18 altında dip yoksa sadece güçlü enerjide dar eşik (0.24) ile kabul et
        if (bestLag < 0 && frameRms > silenceThreshold * 1.5) {
          let minVal = 0.24;
          for (let lag = minLag; lag <= maxLag; lag++) {
            if (normalizedDifference[lag] < minVal) {
              minVal = normalizedDifference[lag];
              bestLag = lag;
            }
          }
        }
        if (bestLag < 0) continue;

        // 3. Parabolik Enterpolasyon (Alt-örnek hassasiyeti)
        const left = normalizedDifference[Math.max(1, bestLag - 1)];
        const center = normalizedDifference[bestLag];
        const right = normalizedDifference[Math.min(maxLag, bestLag + 1)];
        const denominator = left - 2 * center + right;
        const offset = Math.abs(denominator) > 1e-6 ? Math.max(-0.5, Math.min(0.5, 0.5 * (left - right) / denominator)) : 0;
        let hz = sampleRate / (bestLag + offset);
        if (hz < minHz || hz > maxHz) continue;

        // 4. Oktav Zıplama Düzelticisi (Harmonik katlanmalarını temel frekansa indirir)
        if (recentValidHz.length >= 3) {
          const sortedRecent = [...recentValidHz].sort((a, b) => a - b);
          runningMedianHz = sortedRecent[Math.floor(sortedRecent.length / 2)];
          if (runningMedianHz > 60) {
            const ratio = hz / runningMedianHz;
            if (ratio > 1.82 && ratio < 2.18) hz /= 2.0;
            else if (ratio > 0.45 && ratio < 0.55) hz *= 2.0;
            else if (ratio > 2.75 && ratio < 3.25) hz /= 3.0;
          }
        }

        recentValidHz.push(hz);
        if (recentValidHz.length > 7) recentValidHz.shift();

        candidatePoints.push({
          t: ((frameStart + frameSize / 2) * decimation / sourceRate) * 1000,
          hz
        });
      }

      if (candidatePoints.length < 3) return candidatePoints;

      // 5. Zamansal 5-Noktalı Medyan Filtresi: Tekil darbe gürültülerini ve +2000c sıçramalarını yok eder
      const smoothedPoints = [];
      const windowRadius = 2;
      for (let i = 0; i < candidatePoints.length; i++) {
        const currentT = candidatePoints[i].t;
        const neighborhood = [];
        for (let j = Math.max(0, i - windowRadius); j <= Math.min(candidatePoints.length - 1, i + windowRadius); j++) {
          if (Math.abs(candidatePoints[j].t - currentT) <= 160) {
            neighborhood.push(candidatePoints[j].hz);
          }
        }
        if (neighborhood.length === 0) continue;
        neighborhood.sort((a, b) => a - b);
        const medHz = neighborhood[Math.floor(neighborhood.length / 2)];

        // 100ms içinde komşusu olmayan izole gürültü patlamalarını at
        const hasCloseNeighbor = (i > 0 && Math.abs(candidatePoints[i].t - candidatePoints[i - 1].t) <= 100) ||
                                 (i < candidatePoints.length - 1 && Math.abs(candidatePoints[i + 1].t - candidatePoints[i].t) <= 100);
        if (!hasCloseNeighbor && candidatePoints.length > 5) continue;

        smoothedPoints.push({
          t: Math.round(candidatePoints[i].t),
          hz: Math.round(medHz * 10) / 10
        });
      }

      return smoothedPoints;
    }

    getReference(ayahKey, qariKey = 'dossary') {
      const url = window.getAyahAudioUrl
        ? window.getAyahAudioUrl(...ayahKey.split(':').map(Number), qariKey)
        : null;
      return url ? this.referenceCache.get(url) || null : null;
    }

    convertFreqToContourCents(freq, anchorHz) {
      if (!Number.isFinite(freq) || freq <= 0 || !Number.isFinite(anchorHz) || anchorHz <= 0) return null;
      let cents = 1200 * Math.log2(freq / anchorHz);
      return Math.max(-900, Math.min(1800, Math.round(cents * 10) / 10));
    }

    resamplePoints(points, targetCount = 64) {
      if (!points || points.length === 0) return new Array(targetCount).fill(0);
      if (points.length === 1) return new Array(targetCount).fill(points[0].cents || 0);

      const totalT = points[points.length - 1].t || 1;
      const resampled = [];
      let j = 0;

      for (let i = 0; i < targetCount; i++) {
        const targetT = (i / (targetCount - 1)) * totalT;
        while (j < points.length - 2 && points[j + 1].t < targetT) {
          j++;
        }
        const p1 = points[j];
        const p2 = points[Math.min(j + 1, points.length - 1)];
        const dt = p2.t - p1.t;
        const ratio = dt === 0 ? 0 : Math.max(0, Math.min(1, (targetT - p1.t) / dt));
        const interpolated = p1.cents + (p2.cents - p1.cents) * ratio;
        resampled.push(interpolated);
      }
      return resampled;
    }

    resamplePointsWithHz(points, targetCount = 64) {
      if (!points || points.length === 0) {
        return Array.from({ length: targetCount }, () => ({ t: 0, cents: 0, hz: 0 }));
      }
      if (points.length === 1) {
        return Array.from({ length: targetCount }, () => ({ t: points[0].t, cents: points[0].cents || 0, hz: points[0].hz || 0 }));
      }
      const totalT = points[points.length - 1].t || 1;
      const resampled = [];
      let j = 0;

      for (let i = 0; i < targetCount; i++) {
        const targetT = (i / (targetCount - 1)) * totalT;
        while (j < points.length - 2 && points[j + 1].t < targetT) j++;
        const p1 = points[j];
        const p2 = points[Math.min(j + 1, points.length - 1)];
        const dt = p2.t - p1.t;
        const ratio = dt === 0 ? 0 : Math.max(0, Math.min(1, (targetT - p1.t) / dt));
        const cents = p1.cents + (p2.cents - p1.cents) * ratio;
        const hz = p1.hz && p2.hz ? p1.hz + (p2.hz - p1.hz) * ratio : (p1.hz || p2.hz || 0);
        resampled.push({ t: targetT, cents, hz });
      }
      return resampled;
    }

    calculateDTW(userPoints, refPoints, options = {}) {
      if (!userPoints || userPoints.length < 5) {
        return {
          noAudio: true,
          meanCentsDiff: 0,
          pitchScore: 0,
          contourScore: 0,
          timingScore: 0,
          corridorScore: 0,
          avgScore: 0,
          verdict: "Mikrofondan ses algılanamadı veya kayıt çok kısa. Lütfen mikrofonunuzu açıp âyeti sesli olarak okuyunuz."
        };
      }
      if (!refPoints || refPoints.length < 5) {
        return {
          noReference: true,
          meanCentsDiff: 0,
          pitchScore: 0,
          contourScore: 0,
          timingScore: 0,
          corridorScore: 0,
          avgScore: 0,
          verdict: "Bu âyet için gerçek ses referansı yüklenemedi; kayıt puanlanmadı."
        };
      }

      // Kullanıcı ve Referans Karar Perdesi (Tessitura) Tespiti
      const userPitches = userPoints.filter(p => p.hz > 50).map(p => p.hz).sort((a, b) => a - b);
      const userAnchorHz = userPitches.length > 0
        ? userPitches[Math.floor(userPitches.length * 0.35)]
        : 150;

      const refPitches = refPoints.filter(p => p.hz > 50).map(p => p.hz).sort((a, b) => a - b);
      const refAnchorHz = refPitches.length > 0
        ? refPitches[Math.floor(refPitches.length * 0.35)]
        : 170;

      const tonicShiftCents = (userAnchorHz > 0 && refAnchorHz > 0)
        ? Math.round(1200 * Math.log2(userAnchorHz / refAnchorHz))
        : 0;

      // N=64 Noktalı Sakoe-Chiba DTW Matrisi
      const N = 64;
      const uRes = this.resamplePointsWithHz(userPoints, N);
      const rRes = this.resamplePointsWithHz(refPoints, N);

      // Göreli Seyir Modu (Varsayılan): Kullanıcı kendi ses genişliğinde okuduğunda nağme aralıklarını doğru ölçer
      const relativeMode = options.relativeMode !== false;
      const uCents = uRes.map(p => relativeMode ? (p.cents - tonicShiftCents) : p.cents);
      const rCents = rRes.map(p => p.cents);

      const band = Math.max(5, Math.floor(N * 0.20));
      const INF = 1e9;
      const D = Array.from({ length: N + 1 }, () => new Float32Array(N + 1).fill(INF));
      D[0][0] = 0;

      for (let i = 1; i <= N; i++) {
        const jMin = Math.max(1, i - band);
        const jMax = Math.min(N, i + band);
        for (let j = jMin; j <= jMax; j++) {
          const cost = Math.abs(uCents[i - 1] - rCents[j - 1]);
          const prev = Math.min(D[i - 1][j], D[i][j - 1], D[i - 1][j - 1]);
          D[i][j] = cost + prev;
        }
      }

      // Optimal DTW Warping Yolunu Geri Çıkar (Backtracking)
      let i = N;
      let j = N;
      const path = [[i, j]];
      while (i > 1 || j > 1) {
        if (i === 1) j--;
        else if (j === 1) i--;
        else {
          const dDiag = D[i - 1][j - 1];
          const dLeft = D[i][j - 1];
          const dUp = D[i - 1][j];
          if (dDiag <= dLeft && dDiag <= dUp) { i--; j--; }
          else if (dLeft <= dUp) { j--; }
          else { i--; }
        }
        path.push([i, j]);
      }
      path.reverse();

      // 1. PERDE UYUMU (Eşleştirilmiş cent farkı)
      let totalWarpedDiff = 0;
      let inCorridorCount = 0;
      const corridorThreshold = 45; // ±45 cent (~2 koma pedagojik tolerans bandı)

      for (const [ui, rj] of path) {
        const diff = Math.abs(uCents[ui - 1] - rCents[rj - 1]);
        totalWarpedDiff += diff;
        if (diff <= corridorThreshold) inCorridorCount++;
      }
      const meanCentsDiff = totalWarpedDiff / path.length;
      const pitchScore = Math.max(0, Math.min(100, Math.round(100 - (meanCentsDiff / 1.25))));

      // 2. KONTUR / SEYİR UYUMU (Türev ve iniş-çıkış yön benzerliği)
      let matchedSlopes = 0;
      let validTransitions = 0;
      for (let k = 1; k < N; k++) {
        const du = uCents[k] - uCents[k - 1];
        const dr = rCents[k] - rCents[k - 1];
        const uFlat = Math.abs(du) <= 12;
        const rFlat = Math.abs(dr) <= 12;
        if (uFlat && rFlat) {
          matchedSlopes += 1.0;
        } else if ((du > 12 && dr > 12) || (du < -12 && dr < -12)) {
          matchedSlopes += 1.0;
        } else if (uFlat || rFlat) {
          matchedSlopes += 0.5;
        }
        validTransitions++;
      }
      const contourScore = validTransitions > 0
        ? Math.max(0, Math.min(100, Math.round((matchedSlopes / validTransitions) * 100)))
        : 75;

      // 3. ZAMANLAMA & TEMPO UYUMU (Köşegen sapması ve süre oranı)
      let totalDiagDev = 0;
      for (const [ui, rj] of path) {
        const idealJ = (ui * N) / N;
        const normDev = Math.abs(rj - idealJ) / N;
        totalDiagDev += normDev * normDev;
      }
      const rmseDiag = Math.sqrt(totalDiagDev / path.length);
      const userTotalT = userPoints[userPoints.length - 1].t - userPoints[0].t;
      const refTotalT = refPoints[refPoints.length - 1].t - refPoints[0].t;
      const durRatio = refTotalT > 0 ? (userTotalT / refTotalT) : 1;
      const durPenalty = Math.min(25, Math.abs(1 - durRatio) * 40);
      const timingScore = Math.max(0, Math.min(100, Math.round(100 - (rmseDiag * 260) - durPenalty)));

      // 4. TOLERANS KORİDORU İÇİ NOKTA YÜZDESİ
      const corridorScore = Math.max(0, Math.min(100, Math.round((inCorridorCount / path.length) * 100)));

      // Birleşik Ağırlıklı Pedagojik Skor
      const avgScore = Math.round(
        (0.35 * pitchScore) +
        (0.35 * contourScore) +
        (0.15 * timingScore) +
        (0.15 * corridorScore)
      );

      // Transpoze ve Perde Karar Etiketi
      const semitones = (tonicShiftCents / 100).toFixed(1);
      const tonicLabel = Math.abs(tonicShiftCents) <= 35
        ? "Kâri ile aynı karar perdesi (±35 cent)"
        : (tonicShiftCents < 0 ? `${Math.abs(semitones)} yarım ton pest (Kendi kararınız)` : `${semitones} yarım ton tiz (Kendi kararınız)`);

      // Bilimsel & Pedagojik Hüküm
      let verdict = '';
      if (avgScore >= 88) {
        verdict = `Mükemmel akustik uyum! Perde seyriniz, tecvid süresi ve nağme geçişleriniz referans kâriye çok yakın (${tonicLabel}).`;
      } else if (avgScore >= 75) {
        verdict = `Başarılı tilavet. Genel perde seyriniz ve makam dengeniz iyi (${tonicLabel}); bazı geçişlerde kâriyi tekrar dinleyiniz.`;
      } else if (avgScore >= 60) {
        verdict = `Gelişmeye açık. Perde eğrinizde iniş-çıkışlar modelden ayrılıyor (${tonicLabel}); yavaşlatılmış hızda dinleyip tekrar deneyiniz.`;
      } else {
        verdict = `Akustik seyir kâriden belirgin şekilde farklı. Bu sonuç icazet veya hüküm değildir; makam seyrini çalışıp yeniden deneyiniz.`;
      }

      return {
        meanCentsDiff: Math.round(meanCentsDiff),
        pitchScore,
        contourScore,
        timingScore,
        corridorScore,
        avgScore,
        tonicShiftCents,
        tonicLabel,
        userAnchorHz: Math.round(userAnchorHz * 10) / 10,
        refAnchorHz: Math.round(refAnchorHz * 10) / 10,
        verdict
      };
    }
  }

  // Global Dışa Aktarım
  window.TilavetAudioLab = {
    getAudioContext,
    drone: new DroneSynthesizer(),
    pitchDetector: new PitchDetector(),
    breathCoach: new BreathCoach(),
    recorder: new VoiceRecorder(),
    meddTimer: new MeddTimer(),
    contourAnalyzer: new ContourAnalyzer()
  };

  // Merkezi Ses Yöneticisine AudioLab bileşenlerini bağla
  if (typeof window.TilavetAudioManager !== 'undefined') {
    window.TilavetAudioManager.register('audio_lab', {
      stop: () => {
        try {
          window.TilavetAudioLab?.drone?.stop();
          window.TilavetAudioLab?.pitchDetector?.stop();
          window.TilavetAudioLab?.breathCoach?.stop();
        } catch (_) {}
      },
      category: 'lab'
    });
  }

})(window);
