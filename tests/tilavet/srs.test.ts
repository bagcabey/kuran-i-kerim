import { describe, it, expect } from 'vitest';
import { newCard, review } from '../../src/tilavet/core/learning/srs';

describe('SM-2', () => {
  it('ilk doğru cevap → 1 gün, ikinci → 3 gün', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    let c = review(newCard('x', now), 4, now);
    expect(c.interval).toBe(1);
    c = review(c, 4, now);
    expect(c.interval).toBe(3);
  });
  it('unutunca sıfırlanır ve lapses artar', () => {
    const now = new Date();
    let c = review(newCard('x', now), 5, now);
    c = review(c, 1, now);
    expect(c.reps).toBe(0); expect(c.lapses).toBe(1); expect(c.interval).toBe(1);
  });
  it('ease 1.3 altına düşmez', () => {
    let c = newCard('x');
    for (let i = 0; i < 30; i++) c = review(c, 0);
    expect(c.ease).toBeGreaterThanOrEqual(1.3);
  });
});
