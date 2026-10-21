// tests/tilavet/dtw_scoring.test.ts
// Sakoe-Chiba FastDTW ve Çift Puanlama Testleri

import { describe, it, expect } from 'vitest';
import { DTWAnalyzerV2 } from '../../kimatik_lab/audio_lab/core/dtw_v2.js';

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
