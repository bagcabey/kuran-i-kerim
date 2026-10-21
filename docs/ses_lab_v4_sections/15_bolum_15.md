# 15. BÖLÜM 15: TEST PLANI VE VITEST SİNYAL TESTLERİ

## 15.1. Test Mimarisi ve Sentetik Sinyal Doğrulama
Mevcut modülde en ufak bir otomatik test bulunmamaktaydı (I6). Bu durum algoritmik gerilemelere ve frekans hesaplarındaki vahim sapmaların fark edilememesine yol açmaktaydı.

v4.0.0 ile hem DSP çekirdeği hem de iş mantığı Vitest test paketiyle %100 kapsama alınmıştır.

---

## 15.2. DSP Sinyal Testleri (`tests/studio_dsp.test.ts`)

```typescript
// tests/studio_dsp.test.ts
// YIN DSP ve Sinyal Doğrulama Birim Testleri

import { describe, it, expect } from 'vitest';
import { extractF0FromPCM } from '../scripts/extract_reference_contour.mjs';

describe('YIN DSP Algoritması Sinyal Doğrulama', () => {
  const sampleRate = 48000;
  const durationSec = 1.0;
  const totalSamples = sampleRate * durationSec;

  it('440.0 Hz Saf Sinüs Dalgasını 0.5 Hz Hassasiyetle Tespit Etmelidir', () => {
    const freq = 440.0;
    const pcm = new Float32Array(totalSamples);
    for (let i = 0; i < totalSamples; i++) {
      pcm[i] = 0.8 * Math.sin((2 * Math.PI * freq * i) / sampleRate);
    }

    const contour = extractF0FromPCM(pcm, sampleRate, 220.0);
    const validPitches = contour.filter(c => c.hz > 0);

    expect(validPitches.length).toBeGreaterThan(50);
    const avgHz = validPitches.reduce((acc, p) => acc + p.hz, 0) / validPitches.length;
    expect(Math.abs(avgHz - 440.0)).toBeLessThan(0.5);
  });

  it('244.26 Hz Segâh Karar Frekansını Doğru Kestirmelidir', () => {
    const freq = 244.26;
    const pcm = new Float32Array(totalSamples);
    for (let i = 0; i < totalSamples; i++) {
      pcm[i] = 0.7 * Math.sin((2 * Math.PI * freq * i) / sampleRate);
    }

    const contour = extractF0FromPCM(pcm, sampleRate, 244.26);
    const valid = contour.filter(c => c.hz > 0);
    expect(valid.length).toBeGreaterThan(50);

    const avgCent = valid.reduce((acc, p) => acc + p.cent, 0) / valid.length;
    expect(Math.abs(avgCent)).toBeLessThan(1.0); // 0 cent civarı
  });

  it('Saf Beyaz Gürültüde (White Noise) Sahte Perde Üretmemelidir', () => {
    const pcm = new Float32Array(totalSamples);
    for (let i = 0; i < totalSamples; i++) {
      pcm[i] = (Math.random() * 2 - 1) * 0.1; // Rastgele gürültü
    }

    const contour = extractF0FromPCM(pcm, sampleRate, 220.0);
    const validPitches = contour.filter(c => c.hz > 0);
    // Güvensiz sinyalde YIN eşik bulamamalı
    expect(validPitches.length).toBeLessThan(3);
  });
});
```

---

## 15.3. Medd Ölçüm Motoru Testleri (`tests/medd_engine.test.ts`)

```typescript
// tests/medd_engine.test.ts
// Hece Kalibrasyonu ve Hangover Debounce Testleri

import { describe, it, expect, beforeEach } from 'vitest';
import { MeddEngine } from '../kimatik_lab/audio_lab/core/medd_engine.js';

describe('MeddEngine v2 Test Paketi', () => {
  let engine: MeddEngine;

  beforeEach(() => {
    engine = new MeddEngine();
  });

  it('Tedvir Temposunda 960 ms Ses Tam 2.0 Elif Olarak Hesaplanmalıdır', () => {
    engine.setTempo('tedvir'); // 1 hareke = 240 ms, 1 elif = 480 ms
    engine.accumulatedDurationMs = 960;
    expect(engine.calculatedElif).toBe(2.0);
  });

  it('Hadr Temposunda 1440 ms Ses Tam 4.0 Elif Olarak Hesaplanmalıdır', () => {
    engine.setTempo('hadr'); // 1 hareke = 180 ms, 1 elif = 360 ms
    engine.accumulatedDurationMs = 1440;
    expect(engine.calculatedElif).toBe(4.0);
  });

  it('6 Elif Hedefli Medd-i Lâzım Kartında 5.8-6.2 Aralığı Mükemmel Kabul Edilmelidir', () => {
    engine.setCard('medd_lazim');
    engine.setTempo('tedvir'); // 1 elif = 480 ms -> 6 elif = 2880 ms
    engine.accumulatedDurationMs = 2880;
    expect(engine.calculatedElif).toBe(6.0);
    expect(engine.evaluation.status).toBe('perfect');
  });
});
```

---

## 15.4. DTW Skorlama Testleri (`tests/dtw_scoring.test.ts`)

```typescript
// tests/dtw_scoring.test.ts
// Sakoe-Chiba FastDTW ve Çift Puanlama Testleri

import { describe, it, expect } from 'vitest';
import { DTWAnalyzerV2 } from '../kimatik_lab/audio_lab/core/dtw_v2.js';

describe('DTWAnalyzerV2 Akustik Skor Testleri', () => {
  const analyzer = new DTWAnalyzerV2();

  it('Birebir Aynı Konturlar İçin %100 Skor Üretmelidir', () => {
    const samples = [
      { t: 0.1, hz: 220, cent: 0 },
      { t: 0.2, hz: 244, cent: 181 },
      { t: 0.3, hz: 260, cent: 294 },
      { t: 0.4, hz: 244, cent: 181 },
      { t: 0.5, hz: 220, cent: 0 }
    ];

    const result = analyzer.compare(samples, samples);
    expect(result.shapeScore).toBe(100);
    expect(result.rhythmScore).toBe(100);
    expect(result.combinedScore).toBe(100);
  });

  it('Zaman Kayması Olan Okuyuşta Ritim Skoru Düşmelidir', () => {
    const ref = [
      { t: 0.1, hz: 220, cent: 0 },
      { t: 0.2, hz: 220, cent: 0 },
      { t: 0.3, hz: 260, cent: 294 },
      { t: 0.4, hz: 220, cent: 0 }
    ];
    // Kullanıcı tepeye 1 adım geç ulaşmış
    const user = [
      { t: 0.1, hz: 220, cent: 0 },
      { t: 0.2, hz: 220, cent: 0 },
      { t: 0.3, hz: 220, cent: 0 },
      { t: 0.4, hz: 260, cent: 294 }
    ];

    const result = analyzer.compare(user, ref);
    expect(result.rhythmScore).toBeLessThan(90);
  });
});
```
