import { detectPitchYIN } from './pitch.js';
import type { PitchSample } from '../types.js';

/** Ses dosyasından (referans kurrâ) perde konturu çıkarır. CORS izinli URL gerekir. */
export async function extractContour(url: string, hopMs = 40, frame = 4096): Promise<PitchSample[]> {
  const res = await fetch(url, { mode: 'cors' });
  if (!res.ok) throw new Error('Ses indirilemedi: ' + res.status);
  const arr = await res.arrayBuffer();
  const OfflineCtx = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  const tmp = new OfflineCtx(1, 1, 44100);
  const audio = await tmp.decodeAudioData(arr);
  const data = audio.getChannelData(0);
  const sr = audio.sampleRate;
  const hop = Math.floor((hopMs / 1000) * sr);
  const out: PitchSample[] = [];
  const buf = new Float32Array(frame);
  for (let i = 0; i + frame < data.length; i += hop) {
    buf.set(data.subarray(i, i + frame));
    const r = detectPitchYIN(buf, sr);
    if (r) out.push({ t: (i / sr) * 1000, hz: r.hz, clarity: r.clarity, rms: 0 });
  }
  return out;
}

/** Hz dizisini, tonik (veya medyan) referansa göre cent dizisine çevirir. */
export function toCents(samples: PitchSample[], refHz?: number): { t: number; cents: number }[] {
  const valid = samples.filter(s => s.hz > 0);
  if (!valid.length) return [];
  const ref = refHz ?? median(valid.map(s => s.hz));
  return valid.map(s => ({ t: s.t, cents: 1200 * Math.log2(s.hz / ref) }));
}

function median(a: number[]) { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; }

/** Zaman ekseninde sabit adıma yeniden örnekle. */
export function resample(c: { t: number; cents: number }[], n: number): number[] {
  if (c.length === 0) return new Array(n).fill(NaN);
  const t0 = c[0].t, t1 = c[c.length - 1].t;
  const out: number[] = [];
  let j = 0;
  for (let i = 0; i < n; i++) {
    const t = t0 + ((t1 - t0) * i) / Math.max(1, n - 1);
    while (j < c.length - 2 && c[j + 1].t < t) j++;
    const a = c[j], b = c[Math.min(j + 1, c.length - 1)];
    const k = b.t === a.t ? 0 : (t - a.t) / (b.t - a.t);
    out.push(a.cents + (b.cents - a.cents) * Math.min(1, Math.max(0, k)));
  }
  return out;
}

/** DTW (Sakoe–Chiba bandı) ile iki kontur arası ortalama cent farkı. */
export function dtwMeanDiff(a: number[], b: number[], band = Math.floor(Math.max(a.length, b.length) * 0.2)): number {
  const n = a.length, m = b.length;
  const INF = 1e12;
  const D: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(INF));
  const L: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  D[0][0] = 0;
  for (let i = 1; i <= n; i++) {
    const jMin = Math.max(1, i - band), jMax = Math.min(m, i + band);
    for (let j = jMin; j <= jMax; j++) {
      const cost = Math.abs(a[i - 1] - b[j - 1]);
      const prev = Math.min(D[i - 1][j], D[i][j - 1], D[i - 1][j - 1]);
      const arg = prev === D[i - 1][j - 1] ? L[i - 1][j - 1] : prev === D[i - 1][j] ? L[i - 1][j] : L[i][j - 1];
      D[i][j] = cost + prev;
      L[i][j] = arg + 1;
    }
  }
  return D[n][m] >= INF ? NaN : D[n][m] / Math.max(1, L[n][m]);
}

export interface ContourScore { meanCentsDiff: number; score: number; verdict: 'excellent' | 'good' | 'fair' | 'practice' }

/** Kullanıcı ve referans konturu karşılaştırır. Her biri kendi medyanına göre normalize edilir (farklı ses aralığı sorun olmaz). */
export function compareContours(user: PitchSample[], ref: PitchSample[], points = 120): ContourScore | null {
  const u = resample(toCents(user), points).filter(v => !isNaN(v));
  const r = resample(toCents(ref), points).filter(v => !isNaN(v));
  if (u.length < 10 || r.length < 10) return null;
  const diff = dtwMeanDiff(u, r);
  if (isNaN(diff)) return null;
  const score = Math.max(0, Math.round(100 - (diff / 150) * 100)); // 150 cent ve üzeri = 0 puan
  const verdict = score >= 85 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'fair' : 'practice';
  return { meanCentsDiff: Math.round(diff), score, verdict };
}
