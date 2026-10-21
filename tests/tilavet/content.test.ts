import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const dir = path.resolve(__dirname, '../../src/tilavet/data');
const readAll = (sub: string) => fs.readdirSync(path.join(dir, sub)).filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(dir, sub, f), 'utf8')));

describe('içerik bütünlüğü', () => {
  const lessons = readAll('lessons');
  const quizzes = Object.fromEntries(readAll('quiz').map(q => [q.id, q]));
  const makams = readAll('makam');

  it('ders id\'leri benzersiz', () => {
    const ids = lessons.map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('her quiz section var olan quiz\'e işaret eder', () => {
    for (const l of lessons) for (const s of l.sections) if (s.type === 'quiz') expect(quizzes[s.quizId], `${l.id} → ${s.quizId}`).toBeDefined();
  });
  it('ön koşullar mevcut derslere işaret eder', () => {
    const ids = new Set(lessons.map(l => l.id));
    for (const l of lessons) for (const p of l.prerequisites) expect(ids.has(p), `${l.id} önkoşul ${p}`).toBe(true);
  });
  it('ayet anahtarları geçerli biçimde', () => {
    for (const l of lessons) for (const s of l.sections) {
      const keys = s.type === 'imitate' ? [s.ayah] : s.type === 'examples' ? s.items.map((i: any) => i.ayah) : [];
      for (const k of keys) expect(k).toMatch(/^\d{1,3}:\d{1,3}$/);
    }
  });
  it('yayınlanan içerik needsReview=false olmalı', () => {
    for (const x of [...lessons, ...makams]) if (x.status === 'published') expect(x.needsReview, x.id).toBe(false);
  });
  it('makam perdeleri 0..53 koma, artan sırada', () => {
    for (const m of makams) {
      const k = m.degrees.map((d: any) => d.komas);
      expect(k[0]).toBe(0); expect(k[k.length - 1]).toBe(53);
      for (let i = 1; i < k.length; i++) expect(k[i]).toBeGreaterThan(k[i - 1]);
    }
  });
});
