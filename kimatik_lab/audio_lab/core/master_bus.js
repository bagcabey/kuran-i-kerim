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
