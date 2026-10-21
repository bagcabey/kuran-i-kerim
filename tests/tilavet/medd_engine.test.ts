// tests/tilavet/medd_engine.test.ts
// Hece Kalibrasyonu ve Hangover Debounce Testleri

import { describe, it, expect, beforeEach } from 'vitest';
import { MeddEngine } from '../../kimatik_lab/audio_lab/core/medd_engine.js';

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
