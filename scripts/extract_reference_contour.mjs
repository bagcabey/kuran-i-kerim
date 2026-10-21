// scripts/extract_reference_contour.mjs
// Ses Dosyalarından Gerçek Zamanlı F0 Çıkarıcı ve JSON Üreteci CLI

import fs from 'fs';
import path from 'path';

/**
 * Node.js ortamında saf YIN algoritmasıyla PCM ses verisinden F0 konturu çıkarır.
 */
export function extractF0FromPCM(samples, sampleRate, tonicHz = 196.0) {
  const hopSize = Math.floor(sampleRate * 0.01); // 10 ms
  const bufferSize = 2048;
  const contour = [];
  const half = bufferSize / 2;
  const yinBuffer = new Float32Array(half);

  for (let i = 0; i + bufferSize < samples.length; i += hopSize) {
    const t = Math.round((i / sampleRate) * 100) / 100;
    const frame = samples.subarray(i, i + bufferSize);

    // RMS Hesabı
    let sumSq = 0;
    for (let j = 0; j < bufferSize; j++) sumSq += frame[j] * frame[j];
    const rms = Math.sqrt(sumSq / bufferSize);

    if (rms < 0.015) {
      contour.push({ t, hz: 0, cent: 0 });
      continue;
    }

    // YIN CMNDF
    yinBuffer[0] = 1;
    let runningSum = 0;
    for (let tau = 1; tau < half; tau++) {
      let delta = 0;
      for (let j = 0; j < half; j++) {
        const diff = frame[j] - frame[j + tau];
        delta += diff * diff;
      }
      runningSum += delta;
      yinBuffer[tau] = runningSum > 0 ? (delta * tau) / runningSum : 1;
    }

    // Eşik Arama
    let tauEstimate = -1;
    for (let tau = 2; tau < half; tau++) {
      if (yinBuffer[tau] < 0.15) {
        while (tau + 1 < half && yinBuffer[tau + 1] < yinBuffer[tau]) tau++;
        tauEstimate = tau;
        break;
      }
    }

    if (tauEstimate > 0) {
      // Parabolik enterpolasyon (Alt-örnek hassasiyetinde tepe tespiti)
      const s0 = yinBuffer[tauEstimate - 1];
      const s1 = yinBuffer[tauEstimate];
      const s2 = yinBuffer[tauEstimate + 1];
      const denom = 2 * (s0 - 2 * s1 + s2);
      const betterTau = denom !== 0 ? tauEstimate + (s0 - s2) / denom : tauEstimate;
      const hz = sampleRate / betterTau;

      if (hz >= 65 && hz <= 1000) {
        const cent = Math.round(1200 * Math.log2(hz / tonicHz) * 10) / 10;
        contour.push({ t, hz: Math.round(hz * 10) / 10, cent });
      } else {
        contour.push({ t, hz: 0, cent: 0 });
      }
    } else {
      contour.push({ t, hz: 0, cent: 0 });
    }
  }

  return contour;
}
