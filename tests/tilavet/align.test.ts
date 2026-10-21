import { describe, it, expect } from 'vitest';
import { alignReading } from '../../src/tilavet/core/text/align';
import { normalizeArabic } from '../../src/tilavet/core/text/arabic';

describe('Arapça normalizasyon ve hizalama', () => {
  it('harekeleri kaldırır', () => expect(normalizeArabic('بِسْمِ ٱللَّهِ')).toBe('بسم الله'));
  it('aynı metin %100', () => expect(alignReading('بسم الله الرحمن الرحيم', 'بسم الله الرحمن الرحيم').accuracy).toBe(100));
  it('eksik kelimeyi bulur', () => {
    const r = alignReading('بسم الله الرحمن الرحيم', 'بسم الله الرحيم');
    expect(r.missed).toContain(3);
    expect(r.accuracy).toBeLessThan(100);
  });
});
