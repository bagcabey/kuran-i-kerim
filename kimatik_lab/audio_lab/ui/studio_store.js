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
