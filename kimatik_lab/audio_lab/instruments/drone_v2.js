// kimatik_lab/audio_lab/instruments/drone_v2.js
// Karar Demi (Drone) Sentezleyicisi - Yarışmasız ve Doğal Akustik

import { masterBus } from '../core/master_bus.js';
import { audioFocusManager } from '../core/audio_focus_manager.js';

export class DroneSynthesizerV2 {
  constructor() {
    this.nodes = [];
    this.masterDroneGain = null;
    this.filterNode = null;
    this.isPlaying = false;
    this.currentHz = 220.0;
    this.currentMakamId = 'rast';
    this.timbre = 'ney'; // 'ney' | 'tanbur' | 'organ'
    this.generation = 0; // Yarış durumu (race-condition) önleme kimliği

    this.focusToken = {
      id: 'drone_synth',
      name: 'Karar Sesi (Drone)',
      priority: 'ambient',
      onInterrupted: () => this.duckOrStop(true),
      onResumed: () => this.duckOrStop(false)
    };
  }

  async play(hz, makamId = 'rast', timbre = 'ney') {
    const ctx = await masterBus.ensureContext();
    this.generation++;
    const currentGen = this.generation;

    // Önceki sesleri derhal pürüzsüz kapat
    this.stopImmediate();

    audioFocusManager.requestFocus(this.focusToken);

    this.currentHz = hz;
    this.currentMakamId = makamId;
    this.timbre = timbre;
    this.isPlaying = true;

    const now = ctx.currentTime;

    // Drone için özel çıkış kazancı
    this.masterDroneGain = ctx.createGain();
    this.masterDroneGain.gain.setValueAtTime(0.0001, now);
    this.masterDroneGain.gain.exponentialRampToValueAtTime(0.4, now + 0.3); // Yumuşak açılış (fade-in)

    // Tını Şekillendirme Filtresi (LPF)
    this.filterNode = ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(this.getFilterCutoff(timbre), now);

    this.masterDroneGain.connect(this.filterNode);
    masterBus.connectSource(this.filterNode);

    // Harmonik Yapısı (Ana ses + Sub oktav + Zayıf 2. ve 3. harmonik)
    const harmonicWeights = this.getHarmonicWeights(timbre);

    harmonicWeights.forEach(h => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = h.type;
      osc.frequency.setValueAtTime(hz * h.multiplier, now);

      oscGain.gain.setValueAtTime(h.gain, now);

      osc.connect(oscGain);
      oscGain.connect(this.masterDroneGain);

      osc.start(now);
      this.nodes.push(osc);
    });
  }

  /**
   * Sesi yumuşakça kapatır (fade-out).
   * @param {number} fadeOutSeconds 
   */
  stop(fadeOutSeconds = 0.25) {
    if (!this.isPlaying || !this.masterDroneGain) return;
    this.isPlaying = false;
    audioFocusManager.abandonFocus('drone_synth');

    const ctx = masterBus.ctx;
    if (!ctx) return;

    const now = ctx.currentTime;
    this.masterDroneGain.gain.cancelScheduledValues(now);
    this.masterDroneGain.gain.setValueAtTime(this.masterDroneGain.gain.value, now);
    this.masterDroneGain.gain.linearRampToValueAtTime(0.0001, now + fadeOutSeconds);

    const oldNodes = [...this.nodes];
    this.nodes = [];

    setTimeout(() => {
      oldNodes.forEach(node => {
        try { node.stop(); node.disconnect(); } catch (e) {}
      });
    }, fadeOutSeconds * 1000 + 20);
  }

  /**
   * Yarışma olmaksızın anında kapatır.
   */
  stopImmediate() {
    this.isPlaying = false;
    this.nodes.forEach(node => {
      try { node.stop(); node.disconnect(); } catch (e) {}
    });
    this.nodes = [];
    if (this.masterDroneGain) {
      try { this.masterDroneGain.disconnect(); } catch (e) {}
      this.masterDroneGain = null;
    }
  }

  duckOrStop(isDucked) {
    if (!this.isPlaying || !this.masterDroneGain) return;
    const ctx = masterBus.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    const targetGain = isDucked ? 0.08 : 0.4; // -18 dB ducking
    this.masterDroneGain.gain.cancelScheduledValues(now);
    this.masterDroneGain.gain.linearRampToValueAtTime(targetGain, now + 0.15);
  }

  getHarmonicWeights(timbre) {
    switch (timbre) {
      case 'tanbur':
        return [
          { multiplier: 0.5, gain: 0.2, type: 'sawtooth' },
          { multiplier: 1.0, gain: 0.6, type: 'triangle' },
          { multiplier: 2.0, gain: 0.25, type: 'sine' },
          { multiplier: 3.0, gain: 0.1, type: 'sine' }
        ];
      case 'organ':
        return [
          { multiplier: 1.0, gain: 0.5, type: 'sine' },
          { multiplier: 2.0, gain: 0.35, type: 'sine' },
          { multiplier: 4.0, gain: 0.15, type: 'sine' }
        ];
      case 'ney':
      default:
        return [
          { multiplier: 1.0, gain: 0.75, type: 'sine' },
          { multiplier: 2.0, gain: 0.18, type: 'triangle' },
          { multiplier: 3.0, gain: 0.07, type: 'sine' }
        ];
    }
  }

  getFilterCutoff(timbre) {
    switch (timbre) {
      case 'tanbur': return 1400;
      case 'organ': return 1800;
      case 'ney':
      default: return 900;
    }
  }
}

export const droneSynth = new DroneSynthesizerV2();
