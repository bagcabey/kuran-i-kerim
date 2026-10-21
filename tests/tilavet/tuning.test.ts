import { describe, it, expect } from 'vitest';
import { hzToCents, centsToHz, komaToCents, matchToMakam, scaleFrequencies } from '../../src/tilavet/core/makam/tuning';
import rast from '../../src/tilavet/data/makam/rast.json';

describe('tuning', () => {
  it('oktav = 1200 cent', () => expect(hzToCents(440, 220)).toBeCloseTo(1200, 5));
  it('cent→hz→cent tutarlı', () => expect(hzToCents(centsToHz(386, 200), 200)).toBeCloseTo(386, 5));
  it('31 koma ≈ 702 cent (saf beşli)', () => expect(komaToCents(31)).toBeCloseTo(702, 0));
  it('53 koma = 1200 cent', () => expect(komaToCents(53)).toBeCloseTo(1200, 5));
  it('Rast neva perdesi doğru eşleşir', () => {
    const kararHz = 196;
    const f = scaleFrequencies(rast as any, kararHz)[4];     // Neva
    const m = matchToMakam(f, rast as any, kararHz);
    expect(m.degreeIndex).toBe(4);
    expect(Math.abs(m.centsOff)).toBeLessThan(1);
    expect(m.inTune).toBe('in');
  });
});
