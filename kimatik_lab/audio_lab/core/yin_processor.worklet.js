// kimatik_lab/audio_lab/core/yin_processor.worklet.js
// AudioWorklet İçi Gerçek Zamanlı YIN Perde ve Enerji Tahlilcisi

class YINPitchProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 2048;
    this.hopSize = 480; // 48kHz'de 10 ms hop size
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
    this.threshold = 0.15; // YIN dip eşiği
    this.yinBuffer = new Float32Array(this.bufferSize / 2);
    this.sampleCountSinceLastPost = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const channelData = input[0];
    const len = channelData.length;

    for (let i = 0; i < len; i++) {
      this.buffer[this.bufferIndex] = channelData[i];
      this.bufferIndex = (this.bufferIndex + 1) % this.bufferSize;
      this.sampleCountSinceLastPost++;

      if (this.sampleCountSinceLastPost >= this.hopSize) {
        this.sampleCountSinceLastPost = 0;
        this.analyzeFrame();
      }
    }

    return true;
  }

  analyzeFrame() {
    // Dairesel tampondaki son 2048 örneği düz diziye aç
    const frame = new Float32Array(this.bufferSize);
    let readIdx = this.bufferIndex;
    for (let i = 0; i < this.bufferSize; i++) {
      frame[i] = this.buffer[readIdx];
      readIdx = (readIdx + 1) % this.bufferSize;
    }

    // 1. RMS Enerji Hesabı (VAD için)
    let sumSquares = 0;
    for (let i = 0; i < this.bufferSize; i++) {
      sumSquares += frame[i] * frame[i];
    }
    const rms = Math.sqrt(sumSquares / this.bufferSize);

    // RMS çok düşükse analiz yapmadan sessizlik dön (-45 dBFS altı)
    if (rms < 0.015) {
      this.port.postMessage({ hz: 0, clarity: 0, rms, voiced: false });
      return;
    }

    // 2. YIN Adım 1 & 2: Fark ve CMNDF Fonksiyonu
    const halfBufferSize = this.bufferSize / 2;
    this.yinBuffer[0] = 1;
    let runningSum = 0;

    for (let tau = 1; tau < halfBufferSize; tau++) {
      let delta = 0;
      for (let i = 0; i < halfBufferSize; i++) {
        const diff = frame[i] - frame[i + tau];
        delta += diff * diff;
      }
      runningSum += delta;
      this.yinBuffer[tau] = runningSum > 0 ? (delta * tau) / runningSum : 1;
    }

    // 3. YIN Adım 3: Mutlak Eşik Altındaki İlk Vadiyi Bul
    let tauEstimate = -1;
    for (let tau = 2; tau < halfBufferSize; tau++) {
      if (this.yinBuffer[tau] < this.threshold) {
        while (tau + 1 < halfBufferSize && this.yinBuffer[tau + 1] < this.yinBuffer[tau]) {
          tau++;
        }
        tauEstimate = tau;
        break;
      }
    }

    if (tauEstimate === -1) {
      // Eşik altı bulunamazsa küresel minimumu ara
      let minVal = 1000;
      let minTau = -1;
      for (let tau = 2; tau < halfBufferSize; tau++) {
        if (this.yinBuffer[tau] < minVal) {
          minVal = this.yinBuffer[tau];
          minTau = tau;
        }
      }
      if (minVal < 0.35) {
        tauEstimate = minTau;
      }
    }

    if (tauEstimate === -1) {
      this.port.postMessage({ hz: 0, clarity: 0, rms, voiced: false });
      return;
    }

    // 4. YIN Adım 4: Parabolik Enterpolasyon (Alt-Örnek Hassasiyeti)
    let betterTau = tauEstimate;
    if (tauEstimate > 0 && tauEstimate < halfBufferSize - 1) {
      const s0 = this.yinBuffer[tauEstimate - 1];
      const s1 = this.yinBuffer[tauEstimate];
      const s2 = this.yinBuffer[tauEstimate + 1];
      const denom = 2 * (s0 - 2 * s1 + s2);
      if (denom !== 0) {
        betterTau = tauEstimate + (s0 - s2) / denom;
      }
    }

    const hz = sampleRate / betterTau;
    const clarity = Math.max(0, 1 - this.yinBuffer[tauEstimate]);

    // İnsan sesi kıraat aralığı doğrulaması (65 Hz - 1100 Hz arası)
    const voiced = (clarity >= 0.70) && (hz >= 65 && hz <= 1100);

    this.port.postMessage({
      hz: voiced ? hz : 0,
      clarity,
      rms,
      voiced
    });
  }
}

registerProcessor('yin-pitch-processor', YINPitchProcessor);
