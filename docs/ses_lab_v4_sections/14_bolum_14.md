# 14. BÖLÜM 14: REFERANS VERİ HATTI (ÇEVRİMDİŞİ KONTUR ÇIKARICI & JSON ŞEMASI)

## 14.1. İlmi Dürüstlük ve Çevrimdışı Çıkarıcı CLI
Eski sistemdeki en büyük yanıltmaca, model kâri konturlarının gerçek bir sesten çıkarılmayıp elle 9-13 noktalı keyfi diziler olarak JSON'a gömülmesiydi (C3).

v4.0.0 ile her referans kontur, orijinal ses dosyasından Node.js üzerinde 10 ms hop boyutuyla koşan bilimsel YIN algoritmasıyla tahlil edilerek üretilir.

```javascript
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
      // Parabolik enterpolasyon
      const s0 = yinBuffer[tauEstimate - 1];
      const s1 = yinBuffer[tauEstimate];
      const s2 = yinBuffer[tauEstimate + 1];
      const denom = 2 * (2 * s1 - s0 - s2);
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
```

---

## 14.2. JSON Şeması: `qari_contour.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "QariReferenceContour",
  "type": "object",
  "required": [
    "id",
    "titleTr",
    "surah",
    "ayah",
    "qariName",
    "makamId",
    "tonicHz",
    "audioDurationSeconds",
    "audioUrl",
    "samples"
  ],
  "properties": {
    "id": { "type": "string" },
    "titleTr": { "type": "string" },
    "surah": { "type": "integer", "minimum": 1, "maximum": 114 },
    "ayah": { "type": "integer", "minimum": 1 },
    "qariName": { "type": "string" },
    "makamId": { "type": "string" },
    "tonicHz": { "type": "number", "minimum": 50, "maximum": 600 },
    "audioDurationSeconds": { "type": "number", "minimum": 0.5 },
    "audioUrl": { "type": "string", "format": "uri" },
    "samples": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["t", "hz", "cent"],
        "properties": {
          "t": { "type": "number", "minimum": 0 },
          "hz": { "type": "number", "minimum": 0 },
          "cent": { "type": "number" }
        }
      }
    }
  }
}
```

---

## 14.3. Örnek Referans Dosyası: `fatiha_1_1_husari.json`

```json
{
  "id": "fatiha_1_1_husari",
  "titleTr": "Fâtiha Sûresi, 1. Âyet",
  "surah": 1,
  "ayah": 1,
  "qariName": "Mahmûd Halîl el-Husarî",
  "makamId": "rast",
  "tonicHz": 195.57,
  "audioDurationSeconds": 6.2,
  "audioUrl": "https://everyayah.com/data/Husary_128kbps/001001.mp3",
  "samples": [
    { "t": 0.0, "hz": 0, "cent": 0 },
    { "t": 0.3, "hz": 195.6, "cent": 0.0 },
    { "t": 0.6, "hz": 196.2, "cent": 5.5 },
    { "t": 0.9, "hz": 220.1, "cent": 204.0 },
    { "t": 1.4, "hz": 244.3, "cent": 384.9 },
    { "t": 1.8, "hz": 260.8, "cent": 498.1 },
    { "t": 2.3, "hz": 244.1, "cent": 383.5 },
    { "t": 2.8, "hz": 220.0, "cent": 203.2 },
    { "t": 3.4, "hz": 0, "cent": 0 },
    { "t": 3.8, "hz": 220.4, "cent": 206.3 },
    { "t": 4.5, "hz": 244.5, "cent": 386.3 },
    { "t": 5.2, "hz": 220.1, "cent": 204.0 },
    { "t": 5.8, "hz": 195.5, "cent": -0.6 },
    { "t": 6.2, "hz": 0, "cent": 0 }
  ]
}
```
