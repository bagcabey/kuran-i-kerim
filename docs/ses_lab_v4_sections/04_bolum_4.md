# 4. BÖLÜM 4: DSP ÇEKİRDEĞİ: AUDIOWORKLET YIN, VAD, MİKROFON VE GECİKME TELAFİSİ

## 4.1. AudioWorklet YIN Processor (`yin_processor.worklet.js`)
### Sorun
Eski kodda perde tespiti ana JavaScript iş parçacığında `requestAnimationFrame` içinde çalışan ham otokorelasyona ($O(N^2)$) dayanmaktaydı (B2, B5). UI çizimleri veya DOM işlemleri ana iş parçacığını meşgul ettiğinde perde ibresi donmakta, gecikme 150 ms'nin üzerine çıkmakta, sessizlikte gürültüyü perde sanıp rastgele notalar fırlatmaktaydı.

### Çözüm Mantığı
- **Ses İş Parçacığı (Dedicated Audio Thread):** De-Facto endüstri standardı olan Web Audio API `AudioWorkletProcessor` mimarisine geçilmiştir. UI donmaları DSP analizini zerre etkilemez.
- **YIN Algoritması:** 5 aşamalı YIN algoritması uygulanmıştır:
  1. Kareler Farkı Fonksiyonu (Difference Function): $d_t(\tau) = \sum_{j=1}^W (x_j - x_{j+\tau})^2$
  2. Kümülatif Ortalama Normalize Fark (CMNDF): $d'_t(\tau) = \frac{d_t(\tau)}{\frac{1}{\tau}\sum_{j=1}^\tau d_t(j)}$
  3. Mutlak Eşikleme (Absolute Threshold: $\approx 0.15$)
  4. Parabolik Enterpolasyon (Alt-örnek hassasiyetinde tepe tespiti)
  5. En İyi Yerel Minimum Arama (Oktav hatalarını engelleme)
- **Hop Boyutu:** 48 kHz örnekleme hızında 480 örnek ($\approx 10\text{ ms}$) ile 100 FPS eşdeğeri canlı akış.

```javascript
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
      const denom = 2 * (2 * s1 - s0 - s2);
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
```

---

## 4.2. Paylaşımlı Mikrofon Yöneticisi (`mic_manager.js`)
### Sorun
- Mobil Safari'de ses kaydı başlatıldığında tuner mikrofonunun susması (A7).
- Hoparlörden çıkan sesin mikrofona girip sahte skor üretmesi (A4).
- Tarayıcıların varsayılan eko ve gürültü filtrelerinin müzikal tilâvet harmoniklerini budaması (B1).
- iOS cihazlarda `audio/webm` desteğinin olmaması (A8).

### Çözüm Mantığı
- **Tek Stream, Çoklu Tüketici:** Uygulama genelinde tek bir `navigator.mediaDevices.getUserMedia` akışı açılır; bu akış hem `AudioWorkletNode` tuner'a, hem `AnalyserNode` spektrumuna hem de `MediaRecorder` kayıtçısına aynı anda dağıtılır.
- **Akustik Saflık:** `echoCancellation: false`, `noiseSuppression: false`, `autoGainControl: false` ayarlarıyla mûsikî harmonikleri korunur.
- **Geri Besleme Kalkanı (Anti-Feedback Guard):** Drone açıkken mikrofondan gelen F0, drone'un karar frekansı ile $\pm 10\text{ cent}$ aralığında eşleşirse ve kullanıcı kulaklık takmamışsa uyarı fırlatılır.
- **Çoklu Platform MIME Fallback:** iOS'ta `audio/mp4`, Chrome'da `audio/webm`.

```javascript
// kimatik_lab/audio_lab/core/mic_manager.js
// Tek Stream Mikrofon Yöneticisi ve Kayıt Altyapısı

import { masterBus } from './master_bus.js';
import { droneSynth } from '../instruments/drone_v2.js';

export class MicrophoneManager {
  constructor() {
    this.stream = null;
    this.sourceNode = null;
    this.workletNode = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.listeners = new Set();
    this.isActive = false;
    this.isRecording = false;
    this.hasHeadphonesWarning = false;
  }

  async start() {
    if (this.isActive) return;

    const ctx = await masterBus.ensureContext();

    // Worklet modülünü yükle
    try {
      await ctx.audioWorklet.addModule('audio_lab/core/yin_processor.worklet.js');
    } catch (e) {
      console.warn('Worklet zaten yüklü veya göreli yol uyarısı:', e);
    }

    // Saf Müzikal Ses Kısıtlamaları
    const constraints = {
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        sampleRate: ctx.sampleRate
      }
    };

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.sourceNode = ctx.createMediaStreamSource(this.stream);

      this.workletNode = new AudioWorkletNode(ctx, 'yin-pitch-processor');
      this.workletNode.port.onmessage = (e) => this.handleWorkletMessage(e.data);

      this.sourceNode.connect(this.workletNode);
      this.isActive = true;
    } catch (err) {
      console.error('Mikrofon erişim hatası:', err);
      throw err;
    }
  }

  handleWorkletMessage(data) {
    // Anti-Drone Feedback Koruması
    if (droneSynth.isPlaying && data.voiced && data.hz > 0) {
      const droneHz = droneSynth.currentHz;
      const ratio = data.hz / droneHz;
      // Kullanıcının mikrofona giren ses drone ile 0.99 - 1.01 oranında birebir örtüşüyorsa
      if (Math.abs(ratio - 1.0) < 0.015 || Math.abs(ratio - 2.0) < 0.015) {
        if (!this.hasHeadphonesWarning) {
          console.warn('UYARI: Hoparlörden çıkan karar sesi mikrofona sızıyor. Lütfen kulaklık kullanın.');
          this.hasHeadphonesWarning = true;
        }
      }
    }

    // Dinleyicilere yay
    for (const listener of this.listeners) {
      listener(data);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Model ile kıyaslama için temiz ses kaydı başlatır.
   */
  startRecording() {
    if (!this.stream) throw new Error('Mikrofon aktif değil.');
    this.audioChunks = [];

    // Platforma uygun MIME tipi seçimi (iOS Safari mp4 ister)
    let mimeType = 'audio/webm;codecs=opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'audio/mp4';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = ''; // Tarayıcının varsayılanına bırak
      }
    }

    const options = mimeType ? { mimeType } : {};
    this.mediaRecorder = new MediaRecorder(this.stream, options);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(100);
    this.isRecording = true;
  }

  /**
   * Kaydı durdurur ve ses Blob URL'ini döndürür.
   * @returns {Promise<string>} Blob URL
   */
  async stopRecording() {
    if (!this.mediaRecorder || !this.isRecording) return null;

    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(this.audioChunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(blob);
        this.isRecording = false;
        resolve(audioUrl);
      };
      this.mediaRecorder.stop();
    });
  }

  stop() {
    if (this.sourceNode) {
      try { this.sourceNode.disconnect(); } catch (e) {}
      this.sourceNode = null;
    }
    if (this.workletNode) {
      try { this.workletNode.disconnect(); } catch (e) {}
      this.workletNode = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isActive = false;
  }
}

export const micManager = new MicrophoneManager();
```

---

## 4.3. Perde Yumuşatma ve Oktav Koruması (`pitch_smoother.js`)
### Sorun
Ses tellerinin kararsız kaldığı başlangıç anlarında ibre ani $1200\text{ cent}$ oktav zıplamaları yapmakta ve gürültüde titremektedir (B2).

### Çözüm Mantığı
Gelen son 3 geçerli sesli kareden medyan değer seçilir. Eğer yeni gelen perde önceki perdeden tam 1 oktav ($1200\pm 60\text{ cent}$) yukarıda veya aşağıdaysa ve güven katsayısı önceki kadar yüksek değilse sıçrama düzeltilerek ana perdede tutulur.

```javascript
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
```
