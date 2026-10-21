import { describe, it, expect } from 'vitest';
import { isUnlocked, nextLesson, streak } from '../../src/tilavet/core/learning/progress';

const metas = [
  { id: 'a', level: 1, prerequisites: [], minutes: 5 },
  { id: 'b', level: 1, prerequisites: ['a'], minutes: 5 },
];
describe('progress', () => {
  it('ön koşul tamamlanmadan kilitli', () => expect(isUnlocked(metas[1], {})).toBe(false));
  it('ön koşul bitince açık', () => expect(isUnlocked(metas[1], { a: { status: 'completed' } })).toBe(true));
  it('sıradaki ders', () => expect(nextLesson(metas, { a: { status: 'completed' } })?.id).toBe('b'));
  it('seri hesabı', () => {
    expect(streak(['2026-10-17', '2026-10-18', '2026-10-19'], new Date('2026-10-19T12:00:00Z'))).toBe(3);
  });
  it('gece 01:30 (UTC dünkü gün) seriyi bozmaz (Europe/Istanbul)', () => {
    // 2026-10-19 22:30:00 UTC = 2026-10-20 01:30:00 TSİ
    const nightDate = new Date('2026-10-19T22:30:00Z');
    expect(streak(['2026-10-19', '2026-10-20'], nightDate, 'Europe/Istanbul')).toBe(2);
  });
});

