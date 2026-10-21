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
        const anchorHz = sortedPitches[Math.floor((sortedPitches.length - 1) * 0.2)];
        const points = rawPoints.map(point => ({
          ...point,
          cents: 1200 * Math.log2(point.hz / anchorHz)
        }));
        const reference = {
          ayahKey,
          qariKey,
          audioUrl,
          durationMs: Math.round(audioBuffer.duration * 1000),
          anchorHz,
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

      const frameSize = 1024;
      const hopSize = Math.max(1, Math.round(sampleRate * 0.04));
      const minHz = 65;
      const maxHz = 750;
      const minLag = Math.max(2, Math.floor(sampleRate / maxHz));
      const maxLag = Math.min(frameSize - 2, Math.ceil(sampleRate / minHz));
      const normalizedDifference = new Float32Array(maxLag + 1);
      const points = [];

      for (let frameStart = 0; frameStart + frameSize <= mono.length; frameStart += hopSize) {
        let energy = 0;
        for (let index = frameStart; index < frameStart + frameSize; index++) {
          energy += mono[index] * mono[index];
        }
        if (Math.sqrt(energy / frameSize) < 0.008) continue;

        let cumulativeDifference = 0;
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

        let bestLag = -1;
        for (let lag = minLag; lag <= maxLag; lag++) {
          if (normalizedDifference[lag] < 0.15) {
            while (lag < maxLag && normalizedDifference[lag + 1] < normalizedDifference[lag]) lag++;
            bestLag = lag;
            break;
          }
        }
        if (bestLag < 0) {
          let bestDifference = 0.35;
          for (let lag = minLag; lag <= maxLag; lag++) {
            if (normalizedDifference[lag] < bestDifference) {
              bestDifference = normalizedDifference[lag];
              bestLag = lag;
            }
          }
        }
        if (bestLag < 0) continue;

        const left = normalizedDifference[Math.max(1, bestLag - 1)];
        const center = normalizedDifference[bestLag];
        const right = normalizedDifference[Math.min(maxLag, bestLag + 1)];
        const denominator = left - 2 * center + right;
        const offset = denominator === 0 ? 0 : Math.max(-0.5, Math.min(0.5, 0.5 * (left - right) / denominator));
        const hz = sampleRate / (bestLag + offset);
        if (hz < minHz || hz > maxHz) continue;

        points.push({
          t: ((frameStart + frameSize / 2) * decimation / sourceRate) * 1000,
          hz
        });
      }
      return points;
    }

    getReference(ayahKey, qariKey = 'dossary') {
      const url = window.getAyahAudioUrl
        ? window.getAyahAudioUrl(...ayahKey.split(':').map(Number), qariKey)
        : null;
      return url ? this.referenceCache.get(url) || null : null;
    }

    convertFreqToContourCents(freq, anchorHz) {
      if (!Number.isFinite(freq) || freq <= 0 || !Number.isFinite(anchorHz) || anchorHz <= 0) return null;
      return 1200 * Math.log2(freq / anchorHz);
    }

    resamplePoints(points, targetCount = 50) {
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

    calculateDTW(userPoints, refPoints) {
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

      const N = 50;
      const u = this.resamplePoints(userPoints, N);
      const r = this.resamplePoints(refPoints, N);

      // Sakoe-Chiba bant kısıtlamalı DTW algoritması
      const band = Math.max(4, Math.floor(N * 0.25));
      const INF = 1e9;
      const D = Array.from({ length: N + 1 }, () => new Array(N + 1).fill(INF));
      const L = Array.from({ length: N + 1 }, () => new Array(N + 1).fill(0));
      D[0][0] = 0;

      let inCorridorCount = 0;
      const corridorThresholdCents = 40;

      for (let i = 1; i <= N; i++) {
        const jMin = Math.max(1, i - band);
        const jMax = Math.min(N, i + band);

        if (Math.abs(u[i - 1] - r[i - 1]) <= corridorThresholdCents) {
          inCorridorCount++;
        }

        for (let j = jMin; j <= jMax; j++) {
          const cost = Math.abs(u[i - 1] - r[j - 1]);
          const prev = Math.min(D[i - 1][j], D[i][j - 1], D[i - 1][j - 1]);
          const stepCount = prev === D[i - 1][j - 1] ? L[i - 1][j - 1] : (prev === D[i - 1][j] ? L[i - 1][j] : L[i][j - 1]);
          D[i][j] = cost + prev;
          L[i][j] = stepCount + 1;
        }
      }

      const totalDist = D[N][N];
      const steps = Math.max(1, L[N][N]);
      const meanCentsDiff = totalDist >= INF ? 150 : (totalDist / steps);

      // 1. Perde Uyumu (0 - 100): Ortalama cent farkına göre hesaplanır
      const pitchScore = Math.max(0, Math.min(100, Math.round(100 - (meanCentsDiff / 1.4))));

      // 2. Kontur / Seyir Uyumu (Eğrinin iniş-çıkış türev benzerliği):
      let directionMatches = 0;
      for (let i = 1; i < N; i++) {
        const du = u[i] - u[i - 1];
        const dr = r[i] - r[i - 1];
        if ((du >= 0 && dr >= 0) || (du <= 0 && dr <= 0)) {
          directionMatches++;
        }
      }
      const contourScore = Math.max(0, Math.min(100, Math.round((directionMatches / (N - 1)) * 100)));

      // 3. Zamanlama & Medd Uyumu:
      const timingScore = Math.max(0, Math.min(100, Math.round(100 - (meanCentsDiff * 0.4))));

      // 4. Tolerans Koridoru İçi Nokta Yüzdesi:
      const corridorScore = Math.max(0, Math.min(100, Math.round((inCorridorCount / N) * 100)));

      // Genel Değerlendirme & Pedagojik Hüküm
      const avgScore = Math.round((pitchScore + contourScore + timingScore + corridorScore) / 4);
      let verdict = '';
      if (avgScore >= 88) {
        verdict = "Referans kayda göre perde seyri ve zamanlama benzerliği yüksek.";
      } else if (avgScore >= 75) {
        verdict = "Referansla genel akustik uyum iyi; perde geçişlerini tekrar dinleyerek çalışın.";
      } else if (avgScore >= 60) {
        verdict = "Referansla perde ve zamanlama farkları var; yavaş okuyup yeniden deneyin.";
      } else {
        verdict = "Konturlar belirgin biçimde farklı. Bu sonuç yalnızca akustik karşılaştırmadır.";
      }

      return {
        meanCentsDiff: Math.round(meanCentsDiff),
        pitchScore,
        contourScore,
        timingScore,
        corridorScore,
        avgScore,
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
