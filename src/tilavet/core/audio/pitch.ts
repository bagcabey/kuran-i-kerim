export interface PitchResult { hz: number; clarity: number } // clarity: 0..1

/**
 * YIN algoritması (de Cheveigné & Kawahara, 2002).
 * @param buf   zaman bölgesi örnekleri (Float32Array, -1..1)
 * @param sr    örnekleme hızı
 * @param opts  eşik ve frekans sınırları
 */
export function detectPitchYIN(
  buf: Float32Array<any>,
  sr: number,
  opts: { threshold?: number; minHz?: number; maxHz?: number; minRms?: number } = {}
): PitchResult | null {
  const threshold = opts.threshold ?? 0.15;
  const minHz = opts.minHz ?? 70;
  const maxHz = opts.maxHz ?? 900;
  const minRms = opts.minRms ?? 0.01;

  // 1) Sessizlik kapısı
  let sumSq = 0;
  for (let i = 0; i < buf.length; i++) sumSq += buf[i] * buf[i];
  const rms = Math.sqrt(sumSq / buf.length);
  if (rms < minRms) return null;

  const maxTau = Math.min(Math.floor(sr / minHz), Math.floor(buf.length / 2) - 1);
  const minTau = Math.max(2, Math.floor(sr / maxHz));
  const W = buf.length - maxTau; // pencere uzunluğu
  if (W <= 0) return null;

  // 2) Fark fonksiyonu
  const d = new Float32Array(maxTau + 1);
  for (let tau = 1; tau <= maxTau; tau++) {
    let sum = 0;
    for (let j = 0; j < W; j++) {
      const diff = buf[j] - buf[j + tau];
      sum += diff * diff;
    }
    d[tau] = sum;
  }

  // 3) Kümülatif ortalama normalize fark
  const cmnd = new Float32Array(maxTau + 1);
  cmnd[0] = 1;
  let running = 0;
  for (let tau = 1; tau <= maxTau; tau++) {
    running += d[tau];
    cmnd[tau] = running === 0 ? 1 : (d[tau] * tau) / running;
  }

  // 4) Mutlak eşik
  let tauEstimate = -1;
  for (let tau = minTau; tau <= maxTau; tau++) {
    if (cmnd[tau] < threshold) {
      while (tau + 1 <= maxTau && cmnd[tau + 1] < cmnd[tau]) tau++;
      tauEstimate = tau;
      break;
    }
  }
  if (tauEstimate === -1) return null;

  // 5) Parabolik interpolasyon
  const x0 = tauEstimate > 1 ? tauEstimate - 1 : tauEstimate;
  const x2 = tauEstimate + 1 <= maxTau ? tauEstimate + 1 : tauEstimate;
  let betterTau = tauEstimate;
  if (x0 !== tauEstimate && x2 !== tauEstimate) {
    const s0 = cmnd[x0], s1 = cmnd[tauEstimate], s2 = cmnd[x2];
    const denom = 2 * (2 * s1 - s2 - s0);
    if (denom !== 0) betterTau = tauEstimate + (s2 - s0) / denom;
  }

  const hz = sr / betterTau;
  const clarity = Math.max(0, Math.min(1, 1 - cmnd[tauEstimate]));
  if (!isFinite(hz) || hz < minHz || hz > maxHz) return null;
  return { hz, clarity };
}

/** Medyan filtre: ani oktav sıçramalarını yumuşatır. */
export class MedianSmoother {
  private win: number[] = [];
  constructor(private size = 5) {}
  push(v: number): number {
    this.win.push(v);
    if (this.win.length > this.size) this.win.shift();
    const s = [...this.win].sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)];
  }
  reset() { this.win = []; }
}
