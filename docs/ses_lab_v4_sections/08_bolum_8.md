# 8. BÖLÜM 8: SPEKTRUM VE REZONANS v2: LOGARİTMİK 2048-FFT VE OSİLOSKOP

## 8.1. Akustik Rezonans ve Tilâvet Formantları Nazariyatı
Eski kod tabanında 2048 FFT verisi 64 elemanlık küçük bir diziye kopyalanmış; $1500\text{ Hz}$'in üzerindeki tüm frekanslar atılmıştır (F1). Bunun sonucunda Hayşûm (Geniz) ve Kâri Formantı göstergeleri tamamen sahte ve kör kalmıştır.

$f_s = 48000\text{ Hz}$ ve $N = 2048$ için her FFT kutusu (bin):
$$\Delta f = \frac{48000}{2048} \approx 23.4375\text{ Hz/bin}$$

v4.0.0 ile tilâvet sesinin tüm frekans uzayı 5 bilimsel rezonans bandına ayrılmıştır:

1. **Göğüs Rezonansı (Chest Resonance: 80 - 300 Hz / bin 4 - 13):** Sesin tok, vakarlı ve dolgun duyulmasını sağlayan temel harmonikler.
2. **Ağız / Boğaz Rezonansı (Pharyngeal / Oral: 300 - 1500 Hz / bin 14 - 64):** Harflerin mahreçlerini belirleyen sesli harf formantları (F1 ve F2).
3. **Hayşûm (Nasal / Geniz Rezonansı: 1500 - 2500 Hz / bin 65 - 106):** Nun, Mim ve Gunne harflerinde geniz boşluğunda oluşan karakteristik rezonans.
4. **Kâri Formantı (Qari / Singer's Formant: 2500 - 3500 Hz / bin 107 - 149):** Büyük camilerde veya açık alanlarda mikrofon olmasa dahi sesin saflığını koruyup kubbede çınlamasını sağlayan, usta kârilere has "irşâd" tınısı.
5. **Aydınlık / Hava (Brilliance: 3500 - 8000 Hz / bin 150 - 341):** Hems ve fısıltı harflerinin (ف, ح, ث, هـ, ش, خ, ص, س, ك, ت) netliği.

---

## 8.2. Sıfır-Geçişli (Zero-Crossing) Durağan Osiloskop
Tetikleme (triggering) mekanizması olmayan dalga şekilleri ekranda kontrolsüzce sağa sola kayar (F2). v4.0.0, zaman domeni sinyalinde negatiften pozitife geçen ilk sıfır noktasını (`frame[i] < 0 && frame[i+1] >= 0`) tespit ederek çizimi oradan başlatır. Ses kesildiğinde dalga tabana veya tavana yapışmaz; tam ortada ($y = H/2$) sakinleşir.

---

## 8.3. Retina / HiDPI (DPR) Çizim Desteği
Canvas pikselleri `window.devicePixelRatio` ile ölçeklenerek modern 4K/Retina ekranlarda bulanıklaşma tamamen önlenir.

---

## 8.4. Eksiksiz Modül Kodu: `spectrum_analyzer.js`

```javascript
// kimatik_lab/audio_lab/core/spectrum_analyzer.js
// 2048-FFT Logaritmik Spektrum, 5 Rezonans Bandı ve Sıfır-Geçişli Osiloskop

import { masterBus } from './master_bus.js';
import { micManager } from './mic_manager.js';

export class SpectrumAnalyzerV2 {
  constructor() {
    this.analyser = null;
    this.fftSize = 2048;
    this.frequencyData = null;
    this.timeDomainData = null;
    this.isAttached = false;
  }

  attach() {
    if (this.isAttached) return;
    const ctx = masterBus.ctx;
    if (!ctx || !micManager.sourceNode) return;

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = this.fftSize;
    this.analyser.smoothingTimeConstant = 0.82;

    micManager.sourceNode.connect(this.analyser);

    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount); // 1024 bin
    this.timeDomainData = new Float32Array(this.fftSize);

    this.isAttached = true;
  }

  /**
   * 5 Kritik Akustik Rezonans Bandının Enerjisini Hesaplar.
   * @returns {Object} SpectrumBands
   */
  getBandsEnergy() {
    if (!this.isAttached || !this.analyser) {
      return { chest: 0, oral: 0, nasal: 0, qariFormant: 0, brilliance: 0 };
    }

    this.analyser.getByteFrequencyData(this.frequencyData);
    const sampleRate = masterBus.sampleRate;
    const binHz = sampleRate / this.fftSize; // ~23.43 Hz

    const getEnergy = (minHz, maxHz) => {
      const startBin = Math.max(0, Math.floor(minHz / binHz));
      const endBin = Math.min(this.frequencyData.length - 1, Math.floor(maxHz / binHz));
      let sum = 0;
      let count = 0;
      for (let i = startBin; i <= endBin; i++) {
        sum += this.frequencyData[i];
        count++;
      }
      return count > 0 ? Math.round((sum / count) / 255 * 100) : 0;
    };

    return {
      chest: getEnergy(80, 300),         // Göğüs
      oral: getEnergy(300, 1500),        // Boğaz/Ağız
      nasal: getEnergy(1500, 2500),      // Hayşûm (Geniz)
      qariFormant: getEnergy(2500, 3500),// Kâri Formantı (İrşâd)
      brilliance: getEnergy(3500, 8000)  // Aydınlık
    };
  }

  /**
   * Sıfır-Geçişli Durağan Dalga Formu Çizer
   */
  drawOscilloscope(canvas) {
    if (!this.isAttached || !this.analyser || !canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    this.analyser.getFloatTimeDomainData(this.timeDomainData);

    // Sıfır-Geçiş (Zero-Crossing) Tetikleyici Bul
    let triggerOffset = 0;
    for (let i = 0; i < this.fftSize / 2; i++) {
      if (this.timeDomainData[i] < 0 && this.timeDomainData[i + 1] >= 0) {
        triggerOffset = i;
        break;
      }
    }

    ctx.clearRect(0, 0, width, height);

    // Kılavuz Orta Çizgi
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Dalga Çizimi
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const drawSamples = 512;
    const sliceWidth = width / drawSamples;
    let x = 0;

    for (let i = 0; i < drawSamples; i++) {
      const idx = triggerOffset + i;
      const v = idx < this.timeDomainData.length ? this.timeDomainData[idx] : 0;
      const y = (height / 2) - (v * (height / 2) * 0.9);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.stroke();
  }

  /**
   * Logaritmik Frekans Spektrum Çubuklarını Çizer
   */
  drawLogFrequencyBars(canvas) {
    if (!this.isAttached || !this.analyser || !canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    this.analyser.getByteFrequencyData(this.frequencyData);

    ctx.clearRect(0, 0, width, height);

    const barCount = 48;
    const barWidth = (width / barCount) - 2;

    for (let i = 0; i < barCount; i++) {
      // Logaritmik indeks eşleme
      const logIndex = Math.floor(Math.pow(this.frequencyData.length, i / barCount));
      const val = this.frequencyData[logIndex] || 0;
      const barHeight = (val / 255) * height;

      // Renk geçişi (Altın -> Zümrüt)
      const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
      grad.addColorStop(0, '#d4af37');
      grad.addColorStop(1, '#10b981');

      ctx.fillStyle = grad;
      ctx.fillRect(i * (barWidth + 2), height - barHeight, barWidth, barHeight);
    }
  }

  detach() {
    if (this.analyser) {
      try { this.analyser.disconnect(); } catch (e) {}
      this.analyser = null;
    }
    this.isAttached = false;
  }
}

export const spectrumAnalyzer = new SpectrumAnalyzerV2();
```
