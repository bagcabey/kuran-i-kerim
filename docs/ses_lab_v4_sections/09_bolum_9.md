# 9. BÖLÜM 9: NEFES KOÇU v2 VE OTOMATİK VAD KAPASİTE ÖLÇÜMÜ

## 9.1. Tilâvet Nefesi Pedagojisi ve Modelleri
Eski sistemdeki "Kesintisiz Nefes Kapasitesi" testi mikrofonu hiç dinlememekte; sadece kullanıcının ekrandaki butona basılı tuttuğu süreyi ölçmekteydi (G1). Ayrıca nefes halkasının CSS geçişi 1 saniyede biterken nefes verme aşaması 8 saniye sürmekte, animasyon ile süre tamamen kopmaktaydı (G2).

v4.0.0 ile nefes egzersizleri tilâvet mûsikîsi ihtiyaçlarına göre 3 ayrı moda ayrılmıştır:

1. **4-4-8 (Diyafram Isınma & Sakinleşme):** 4 saniye burundan derin alış, 4 saniye diyaframda tutuş, 8 saniye sakin veriş.
2. **2-4-12 (Tilâvet & Uzun Nefes):** Tilâvette nefes alma süresi uzatılamaz; âyet arasında 1.5 - 2 saniyede ciğerleri doldurup ardından 12 ilâ 16 saniye boyunca ses tellerini titreterek dengeli hava akışı sağlamak gerekir.
3. **Otomatik VAD Kapasite Testi:** Talebe "Testi Başlat" dedikten sonra hazır olunca okumaya veya ses vermeye başlar. Mikrofon F0 ve RMS dedektörü sesi yakaladığı anda sayaç otomatik başlar. Ses kesildiğinde (1.2 saniyelik kesin duruş) test otomatik tamamlanır ve sonuç IndexedDB'ye kaydedilir.

---

## 9.2. Matematiksel SVG Dairesel Animasyon Senkronizasyonu
Nefes halkası CSS sürelerine bırakılmamış; `requestAnimationFrame` içinde matematiksel olarak normalize edilen $t \in [0, 1]$ zamanı üzerinden SVG dairesinin `strokeDashoffset` değerine doğrudan yazılır:
$$\text{offset} = \text{circumference} \times (1 - \text{progress})$$

---

## 9.3. Eksiksiz Modül Kodu: `breath_coach_v2.js`

```javascript
// kimatik_lab/audio_lab/core/breath_coach_v2.js
// VAD Destekli Otomatik Nefes Testi ve Parametrik SVG Nefes Rehberi

export const BREATH_MODES = {
  '4-4-8': {
    id: '4-4-8',
    titleTr: '4-4-8 Diyafram Isınma',
    phases: [
      { name: 'Nefes Al', duration: 4, type: 'inhale', color: '#10b981' },
      { name: 'Nefesi Tut', duration: 4, type: 'hold', color: '#d4af37' },
      { name: 'Sakin Ver', duration: 8, type: 'exhale', color: '#3b82f6' }
    ]
  },
  '2-4-12': {
    id: '2-4-12',
    titleTr: '2-4-12 Tilâvet Uzun Soluk',
    phases: [
      { name: 'Hızlı Al', duration: 2, type: 'inhale', color: '#10b981' },
      { name: 'Dolu Tut', duration: 4, type: 'hold', color: '#d4af37' },
      { name: 'Telli/Sesli Ver', duration: 12, type: 'exhale', color: '#3b82f6' }
    ]
  },
  'capacity': {
    id: 'capacity',
    titleTr: 'Otomatik Sesli Nefes Kapasite Testi',
    phases: []
  }
};

export class BreathCoachV2 {
  constructor() {
    this.mode = '4-4-8';
    this.phaseIndex = 0;
    this.isRunning = false;
    this.currentCycle = 1;

    // VAD Kapasite Testi Değişkenleri
    this.vadTestState = 'IDLE'; // 'IDLE' | 'ARMED' | 'RECORDING' | 'FINISHED'
    this.vadStartTime = 0;
    this.vadLastSoundTime = 0;
    this.vadSilenceThresholdMs = 1200; // 1.2 sn sessizlik testi bitirir
    this.recordedDurationSeconds = 0;

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

    if (this.mode === 'capacity') {
      this.vadTestState = 'ARMED'; // Sesi dinlemeye hazır
      this.recordedDurationSeconds = 0;
      this.notify();
      return;
    }

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

  /**
   * Mikrofondan gelen VAD karesini işler (Otomatik Kapasite Testi)
   * @param {Object} pitchFrame { voiced, rms, hz }
   */
  processVADFrame(pitchFrame) {
    if (!this.isRunning || this.mode !== 'capacity') return;

    const now = performance.now();

    if (this.vadTestState === 'ARMED') {
      if (pitchFrame.voiced && pitchFrame.rms > 0.02) {
        // Ses algılandı -> Sayacı otomatik başlat
        this.vadTestState = 'RECORDING';
        this.vadStartTime = now;
        this.vadLastSoundTime = now;
        this.notify();
      }
      return;
    }

    if (this.vadTestState === 'RECORDING') {
      if (pitchFrame.voiced && pitchFrame.rms > 0.015) {
        this.vadLastSoundTime = now;
      }

      this.recordedDurationSeconds = (now - this.vadStartTime) / 1000;
      this.notify();

      // Sessizlik kontrolü
      if (now - this.vadLastSoundTime > this.vadSilenceThresholdMs) {
        // Test bitti
        this.vadTestState = 'FINISHED';
        this.isRunning = false;
        this.recordedDurationSeconds = (this.vadLastSoundTime - this.vadStartTime) / 1000;
        this.notify();
      }
    }
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.vadTestState === 'RECORDING') {
      this.vadTestState = 'FINISHED';
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
        isRunning: this.isRunning,
        vadTestState: this.vadTestState,
        recordedDurationSeconds: Math.round(this.recordedDurationSeconds * 10) / 10
      });
    }
  }
}

export const breathCoach = new BreathCoachV2();
```
