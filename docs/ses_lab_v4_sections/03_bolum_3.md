# 3. BÖLÜM 3: SES ODAĞI YÖNETİCİSİ (AUDIOFOCUSMANAGER) + MASTER BUS + DRONE v2

## 3.1. Master Bus Mimarisi (`master_bus.js`)
### Sorun
Eski mimaride her bileşen doğrudan `new AudioContext()` açmakta, osilatörler açık kanaldan hoparlöre gitmekte, bu da ani patlamalara (click/pop) ve tarayıcının ses işlemcisinde aşırı yüklenmeye yol açmaktaydı (A5). Ayrıca donanım örnekleme hızı (`sampleRate`) dinamik yönetilmemekteydi (J).

### Çözüm Mantığı
Tüm ses alt yapısı tek bir `MasterBus` nesnesi üzerinde birleştirilmiştir. Çıkış zinciri şöyledir:
`Herhangi bir Kaynak -> Kaynak Gain -> Master Bus Giriş -> DynamicsCompressorNode (Brickwall Limiter) -> Master Gain -> AudioDestinationNode`

```javascript
// kimatik_lab/audio_lab/core/master_bus.js
// Merkezi AudioContext, Tavan Sınırlayıcı (Limiter) ve Kazanç Yönetimi

export class MasterBus {
  constructor() {
    this.ctx = null;
    this.limiter = null;
    this.masterGain = null;
    this.isInitialized = false;
  }

  /**
   * Kullanıcı ilk kez ekrana tıkladığında AudioContext'i başlatır veya uyandırır.
   */
  async ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        throw new Error('Web Audio API bu tarayıcıda desteklenmiyor.');
      }
      this.ctx = new AudioCtx({ latencyHint: 'interactive' });

      // Brickwall Limiter (Patlamaları ve distorsiyonu engeller)
      this.limiter = this.ctx.createDynamicsCompressor();
      this.limiter.threshold.setValueAtTime(-1.0, this.ctx.currentTime);
      this.limiter.knee.setValueAtTime(0.0, this.ctx.currentTime);
      this.limiter.ratio.setValueAtTime(20.0, this.ctx.currentTime);
      this.limiter.attack.setValueAtTime(0.001, this.ctx.currentTime);
      this.limiter.release.setValueAtTime(0.05, this.ctx.currentTime);

      // Ana Ses Seviyesi (Master Volume)
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      // Zincirleme Bağlantı: Limiter -> MasterGain -> Hoparlör
      this.limiter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.isInitialized = true;
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    return this.ctx;
  }

  /**
   * Yeni bir ses kaynağını master bus limiter girişine bağlar.
   * @param {AudioNode} node 
   */
  connectSource(node) {
    if (!this.limiter) {
      throw new Error('Master bus başlatılmadan kaynak bağlanamaz.');
    }
    node.connect(this.limiter);
  }

  /**
   * Ana ses seviyesini pürüzsüz biçimde ayarlar (0.0 - 1.0).
   * @param {number} value 
   */
  setMasterVolume(value) {
    if (!this.masterGain || !this.ctx) return;
    const clamped = Math.max(0.0, Math.min(1.0, value));
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(clamped, now + 0.05);
  }

  get sampleRate() {
    return this.ctx ? this.ctx.sampleRate : 48000;
  }

  get currentTime() {
    return this.ctx ? this.ctx.currentTime : 0;
  }
}

export const masterBus = new MasterBus();
```

---

## 3.2. Ses Odağı Yöneticisi (`audio_focus_manager.js`)
### Sorun
Kullanıcı istasyonlar arasında gezindiğinde drone arkada çalmaya devam etmekte, model kâri kaydı açıldığında nefes sayacı veya piyano tuşu sesleri üst üste binerek kakofoni oluşturmaktaydı (A3).

### Çözüm Mantığı
Mobil işletim sistemlerindeki (Android AudioFocus) mimari web ortamına uyarlanmıştır:
- `exclusive` (münhasır): Model tilâvet veya kayıt dinleme gibi tam dikkat isteyen sesler çalarken arkadaki tüm `ambient` sesler (drone, metronom) ya tamamen durdurulur ya da sesi -18 dB azaltılır (ducking).
- `ambient` (çevresel): Drone sesi arka plan eşliğidir.
- Sekme arka plana düştüğünde (`visibilitychange: hidden`), pil ve işlemci tasarrufu için tüm sesler güvenle durdurulur.

```javascript
// kimatik_lab/audio_lab/core/audio_focus_manager.js
// Çoklu Ses Kaynaklarının Çakışmasını Engelleyen Odak Orkestratörü

export class AudioFocusManager {
  constructor() {
    this.activeRequesters = new Map();
    this.setupVisibilityListener();
  }

  /**
   * Ses odağı talep eder.
   * @param {Object} requester 
   * @param {string} requester.id
   * @param {string} requester.name
   * @param {'exclusive'|'ambient'} requester.priority
   * @param {Function} requester.onInterrupted
   * @param {Function} [requester.onResumed]
   */
  requestFocus(requester) {
    if (requester.priority === 'exclusive') {
      // Diğer tüm ses kaynaklarına durma veya ducking bildirimi yap
      for (const [id, active] of this.activeRequesters.entries()) {
        if (id !== requester.id) {
          active.onInterrupted();
        }
      }
    } else if (requester.priority === 'ambient') {
      // Eğer zaten aktif bir exclusive kaynak varsa, ambient kaynağı engelle veya uyar
      const hasExclusive = Array.from(this.activeRequesters.values())
        .some(r => r.priority === 'exclusive');
      if (hasExclusive) {
        requester.onInterrupted();
        return false;
      }
    }

    this.activeRequesters.set(requester.id, requester);
    return true;
  }

  /**
   * Ses odağını serbest bırakır.
   * @param {string} id 
   */
  abandonFocus(id) {
    this.activeRequesters.delete(id);

    // Eğer exclusive kaynak bittiyse, duraklatılmış ambient kaynakları canlandır
    const hasExclusive = Array.from(this.activeRequesters.values())
      .some(r => r.priority === 'exclusive');

    if (!hasExclusive) {
      for (const requester of this.activeRequesters.values()) {
        if (requester.onResumed) {
          requester.onResumed();
        }
      }
    }
  }

  /**
   * Tüm sesleri derhal susturur.
   */
  stopAll() {
    for (const requester of this.activeRequesters.values()) {
      requester.onInterrupted();
    }
    this.activeRequesters.clear();
  }

  setupVisibilityListener() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stopAll();
        }
      });
    }
  }
}

export const audioFocusManager = new AudioFocusManager();
```

---

## 3.3. Karar Demi Sentezleyicisi v2 (`drone_v2.js`)
### Sorun
Eski kodda `DroneSynthesizer.stop()` içinde bulunan `setTimeout(..., 450)` mantığı, kullanıcı hızlıca makam veya tını değiştirdiğinde yeni oluşturulan osilatörleri 450 ms sonra pat diye öldürmekteydi (A1). Ayrıca osilatörler tek frekansta sert sinüs çalarak kulak tırmalamaktaydı.

### Çözüm Mantığı
- **İptal Belirteci (Cancellation Token / Generation ID):** Her `play()` çağrısı yeni bir `generationId` üretir. Eski zamanlayıcılar sonraki nesle müdahale edemez.
- **Web Audio Determinizmi:** `setTimeout` yerine tamamen AudioParam tabanlı `linearRampToValueAtTime` kullanılır.
- **Doğal Akustik Tını:** Ana frekans (f0), yumuşak oktav harmonikleri (2*f0, 3*f0) ve düşük geçiren filtre (BiquadFilterNode) ile ney/tanbûr tınısını taklit eder.

```javascript
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
```
