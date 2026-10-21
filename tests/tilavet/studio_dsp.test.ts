// tests/tilavet/studio_dsp.test.ts
// YIN DSP ve Sinyal Doğrulama Birim Testleri

import { describe, it, expect } from 'vitest';
import { extractF0FromPCM } from '../../scripts/extract_reference_contour.mjs';

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
