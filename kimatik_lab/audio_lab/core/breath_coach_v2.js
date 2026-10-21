// kimatik_lab/audio_lab/core/breath_coach_v2.js
// Zorlamasız, nefes tutmayan ritimler için parametrik SVG nefes koçu

export const BREATH_MODES = {
  '3-4': {
    id: '3-4',
    titleTr: 'Rahat Nefes Ritmi',
    phases: [
      { name: 'Rahatça nefes al', duration: 3, type: 'inhale', color: '#10b981' },
      { name: 'Yumuşakça nefes ver', duration: 4, type: 'exhale', color: '#3b82f6' }
    ]
  },
  '2-4': {
    id: '2-4',
    titleTr: 'Kısa ve Rahat Nefes Ritmi',
    phases: [
      { name: 'Rahatça nefes al', duration: 2, type: 'inhale', color: '#10b981' },
      { name: 'Yumuşakça nefes ver', duration: 4, type: 'exhale', color: '#3b82f6' }
    ]
  }
};

export class BreathCoachV2 {
  constructor() {
    this.mode = '3-4';
    this.phaseIndex = 0;
    this.isRunning = false;
    this.currentCycle = 1;

    this.rafId = null;
    this.phaseStartTime = 0;
    this.listeners = new Set();
  }

  setMode(modeId) {
    if (BREATH_MODES[modeId]) {
      this.stop();
      this.mode = modeId;
      this.notify();
    }
  }

  start() {
    this.stop();
    this.isRunning = true;

    this.phaseIndex = 0;
    this.currentCycle = 1;
    this.phaseStartTime = performance.now();
    this.loop();
  }

  loop() {
    if (!this.isRunning) return;

    const currentMode = BREATH_MODES[this.mode];
    const currentPhase = currentMode.phases[this.phaseIndex];
    const now = performance.now();
    const elapsedSeconds = (now - this.phaseStartTime) / 1000;
    const progress = Math.min(1.0, elapsedSeconds / currentPhase.duration);

    this.notifyProgress({
      phase: currentPhase,
      progress,
      remainingSeconds: Math.max(0, Math.ceil(currentPhase.duration - elapsedSeconds)),
      cycle: this.currentCycle
    });

    if (elapsedSeconds >= currentPhase.duration) {
      // Sonraki faza geç
      this.phaseIndex++;
      if (this.phaseIndex >= currentMode.phases.length) {
        this.phaseIndex = 0;
        this.currentCycle++;
      }
      this.phaseStartTime = performance.now();
    }

    this.rafId = requestAnimationFrame(() => this.loop());
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyProgress(data) {
    for (const listener of this.listeners) {
      listener({ type: 'progress', data });
    }
  }

  notify() {
    for (const listener of this.listeners) {
      listener({
        type: 'state',
        mode: this.mode,
        isRunning: this.isRunning
      });
    }
  }
}

export const breathCoach = new BreathCoachV2();
