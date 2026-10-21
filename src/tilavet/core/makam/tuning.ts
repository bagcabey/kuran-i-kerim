// src/tilavet/core/makam/tuning.ts
// SAF tuning.js ÜZERİNE TYPESCRIPT TİP SARMALAYICISI (Mantık kopyalanmaz)

import type { Makam, MakamDegree, TuningSystem } from '../types.js';
import * as T from '../../../../makam_okulu/audio/tuning.js';

export const OCTAVE_KOMA = T.OCTAVE_KOMA;
export const KOMA_CENTS = T.KOMA_CENTS;
export const A4 = 440;

export const hzToCents = (hz: number, refHz: number): number => T.hzToCents(hz, refHz);
export const centsToHz = (cents: number, refHz: number): number => T.centsToHz(cents, refHz);
export const komaToCents = (k: number): number => T.komaToCents(k);
export const centsToKoma = (c: number): number => T.centsToKoma(c);
export const komaToRatio = (k: number): number => T.komaToRatio(k);
export const hzOfDegree = (abs: number, durakAbs: number, kararHz: number): number => T.hzOfDegree(abs, durakAbs, kararHz);
export const hzOfAbs = (abs: number): number => T.hzOfAbs(abs);
export const perdeAdi = (abs: number): string | null => T.perdeAdi(abs);

const NOTE_TR = ['Do', 'Do♯', 'Re', 'Re♯', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'La♯', 'Si'];
export function nearestNote(hz: number): { name: string; octave: number; centsOff: number; hz: number } {
  const n = Math.round(12 * Math.log2(hz / A4)) + 69; // MIDI
  const ref = A4 * Math.pow(2, (n - 69) / 12);
  return { name: NOTE_TR[((n % 12) + 12) % 12], octave: Math.floor(n / 12) - 1, centsOff: hzToCents(hz, ref), hz: ref };
}

/** Karar perdesi için seçilebilir tonlar (kadın/erkek ses aralığına uygun). */
export const KARAR_CHOICES = [
  { id: 'C3', label: 'Do (C3)', hz: 130.81 }, { id: 'D3', label: 'Re (D3)', hz: 146.83 },
  { id: 'E3', label: 'Mi (E3)', hz: 164.81 }, { id: 'F3', label: 'Fa (F3)', hz: 174.61 },
  { id: 'G3', label: 'Sol (G3)', hz: 196.0 },  { id: 'A3', label: 'La (A3)', hz: 220.0 },
  { id: 'B3', label: 'Si (B3)', hz: 246.94 }, { id: 'C4', label: 'Do (C4)', hz: 261.63 },
  { id: 'D4', label: 'Re (D4)', hz: 293.66 }, { id: 'E4', label: 'Mi (E4)', hz: 329.63 },
];

export function degreeCents(d: MakamDegree, system: TuningSystem = 'tr-53'): number {
  return system === 'tr-53' ? komaToCents(d.komas) : (d.arCents ?? komaToCents(d.komas));
}

/** Makamın tüm perdelerinin frekansları (kararın üzerinden). */
export function scaleFrequencies(m: any, kararHz: number, system: TuningSystem = 'tr-53'): number[] {
  if (m.dizi) {
    const list = m.dizi.cikici || m.dizi;
    return list.map((abs: number) => hzOfDegree(abs, m.durak ?? list[0], kararHz));
  }
  if (Array.isArray(m.degrees)) {
    return m.degrees.map((d: MakamDegree) => centsToHz(degreeCents(d, system), kararHz));
  }
  return [];
}

export interface DegreeMatch {
  degreeIndex: number;          // m.degrees veya dizi içindeki indeks
  degreeName: string;
  centsOff: number;             // + = yüksek, − = alçak
  octave: number;
  inTune: 'in' | 'near' | 'far';
}

/** Bir frekansı makam perdelerine göre değerlendirir. */
export function matchToMakam(
  hz: number,
  m: any,
  kararHz: number,
  system: TuningSystem = 'tr-53',
  lang: 'tr' | 'ar' | 'en' = 'tr'
): DegreeMatch {
  if (m.dizi) {
    const res = T.matchPitch(hz, m, kararHz);
    const dizi = T.diziOf(m, 'cikici');
    const idx = dizi.indexOf(res.abs);
    return {
      degreeIndex: idx >= 0 ? idx : 0,
      degreeName: res.ad ?? '',
      centsOff: res.centsOff,
      octave: Math.floor(hzToCents(hz, kararHz) / 1200),
      inTune: res.durum === 'iyi' ? 'in' : res.durum === 'yakin' ? 'near' : 'far'
    };
  }

  const c = hzToCents(hz, kararHz);
  const oct = Math.floor(c / 1200);
  const pc = c - oct * 1200;
  let best = 0, bestDiff = Infinity;
  m.degrees.forEach((d: any, i: number) => {
    const diff = pc - degreeCents(d, system);
    if (Math.abs(diff) < Math.abs(bestDiff)) { bestDiff = diff; best = i; }
  });
  const diffAbs = Math.abs(bestDiff);
  return {
    degreeIndex: best,
    degreeName: m.degrees[best]?.name?.[lang] ?? m.degrees[best]?.name?.tr ?? '',
    centsOff: bestDiff,
    octave: oct,
    inTune: diffAbs <= 15 ? 'in' : diffAbs <= 30 ? 'near' : 'far'
  };
}

export const centsToKomaText = (cents: number): string => T.formatKoma(T.centsToKoma(cents));

/** Kullanıcının ses aralığı (ambitus): örneklerden 10–90 persentil. */
export function vocalRange(hzSamples: number[]): { lowHz: number; highHz: number } | null {
  const a = hzSamples.filter(h => h > 0).sort((x, y) => x - y);
  if (a.length < 20) return null;
  return { lowHz: a[Math.floor(a.length * 0.1)], highHz: a[Math.floor(a.length * 0.9)] };
}

/** Ses aralığına en uygun kararı öner. */
export function suggestKarar(range: { lowHz: number; highHz: number }) {
  const span = range.highHz / range.lowHz;
  const fits = KARAR_CHOICES.filter(k => k.hz >= range.lowHz * 0.95 && k.hz * 2 <= range.highHz * 1.05);
  return {
    span,
    fits: fits.length ? fits : [KARAR_CHOICES.reduce((a, b) =>
      Math.abs(a.hz - range.lowHz) < Math.abs(b.hz - range.lowHz) ? a : b)]
  };
}
