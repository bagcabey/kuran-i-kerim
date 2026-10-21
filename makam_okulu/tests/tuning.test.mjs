import assert from 'node:assert/strict';
import test from 'node:test';
import * as T from '../audio/tuning.js';

const ussak = { durak: 9, dizi: { cikici: [9,17,22,31,40,44,53,62], inici: null } };

test('1 koma ≈ 22.6415 cent', () => assert.ok(Math.abs(T.KOMA_CENTS - 22.6415) < 1e-3));
test('oktav = 1200 cent', () => assert.ok(Math.abs(T.komaToCents(53) - 1200) < 1e-9));
test('Dügâh = 220 Hz (varsayılan)', () => assert.ok(Math.abs(T.hzOfAbs(9) - 220) < 1e-9));
test('Rast ≈ 195.57 Hz', () => assert.ok(Math.abs(T.hzOfAbs(0) - 195.57) < 0.05));
test('Uşşak Segâh (8 koma) ≈ 181 cent', () => assert.ok(Math.abs(T.komaToCents(17 - 9) - 181.1) < 0.1));
test('perde adları', () => { assert.equal(T.perdeAdi(9), 'Dügâh'); assert.equal(T.perdeAdi(31), 'Nevâ'); assert.equal(T.perdeAdi(999), null); });
test('hzOfDegree: karar transpoze', () => { assert.ok(Math.abs(T.hzOfDegree(53 + 9, 9, 300) - 600) < 1e-9); });
test('matchPitch: tam Nevâ', () => {
  const hz = T.hzOfDegree(31, 9, 220);
  const r = T.matchPitch(hz, ussak, 220);
  assert.equal(r.abs, 31); assert.equal(r.durum, 'iyi'); assert.ok(Math.abs(r.centsOff) < 1e-6);
});
test('matchPitch: +10 cent hala iyi, +25 yakın, +45 uzak', () => {
  const base = T.hzOfDegree(22, 9, 220);
  assert.equal(T.matchPitch(base * 2 ** (10/1200), ussak, 220).durum, 'iyi');
  assert.equal(T.matchPitch(base * 2 ** (25/1200), ussak, 220).durum, 'yakin');
  assert.equal(T.matchPitch(base * 2 ** (45/1200), ussak, 220).durum, 'uzak');
});
test('matchPitch: oktav yukarı doğru eşleşir', () => {
  const hz = T.hzOfDegree(31, 9, 220) * 2;
  assert.equal(T.matchPitch(hz, ussak, 220).abs, 31 + 53);
});
test('motifToEvents', () => {
  const ev = T.motifToEvents(ussak, { path: [{abs:31},{abs:22,beats:2}] }, 220);
  assert.equal(ev.length, 2); assert.equal(ev[1].beats, 2);
});
test('approxNote Dügâh ≈ La3', () => { const n = T.approxNote(9); assert.equal(n.name, 'La'); assert.equal(n.octave, 3); });
