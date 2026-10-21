// kimatik_lab/audio_lab/core/pitch_smoother.js
// Medyan Filtresi ve Oktav Zıplama Düzelticisi

export class PitchSmoother {
  constructor() {
    this.history = [];
    this.lastValidHz = 0;
  }

  process(rawHz, clarity) {
    if (rawHz <= 0 || clarity < 0.70) {
      return 0;
    }

    // Oktav sıçrama denetimi (Harmonik katlanmalarını önler)
    if (this.lastValidHz > 0) {
      const ratio = rawHz / this.lastValidHz;
      // Yaklaşık 2x (oktav üstü)
      if (ratio > 1.88 && ratio < 2.12) {
        rawHz = rawHz / 2.0;
      }
      // Yaklaşık 0.5x (oktav altı)
      else if (ratio > 0.47 && ratio < 0.53) {
        rawHz = rawHz * 2.0;
      }
    }

    this.history.push(rawHz);
    if (this.history.length > 3) {
      this.history.shift();
    }

    // 3 elemanlı medyan filtresi
    const sorted = [...this.history].sort((a, b) => a - b);
    const medianHz = sorted[Math.floor(sorted.length / 2)];
    this.lastValidHz = medianHz;
    return medianHz;
  }

  reset() {
    this.history = [];
    this.lastValidHz = 0;
  }
}

export const pitchSmoother = new PitchSmoother();
