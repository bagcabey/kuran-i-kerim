import React, { useEffect, useRef } from 'react';
import type { PitchSample } from '../core/types.js';
import { toCents } from '../core/audio/contour.js';

interface Props { user?: PitchSample[]; reference?: PitchSample[]; height?: number }

export function PitchContour({ user = [], reference = [], height = 220 }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current; if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth, h = height;
    c.width = w * dpr; c.height = h * dpr;
    const g = c.getContext('2d')!; g.scale(dpr, dpr);
    const css = getComputedStyle(c);
    const col = (v: string) => css.getPropertyValue(v).trim() || '#888';

    g.clearRect(0, 0, w, h);
    const u = toCents(user), r = toCents(reference);

    const all = [...u, ...r];
    if (!all.length) {
      g.fillStyle = col('--tl-text-soft'); g.font = '14px system-ui';
      g.fillText('Henüz perde verisi yok', 16, h / 2); return;
    }
    const tMax = Math.max(...all.map(p => p.t));
    const cMin = Math.min(-300, ...all.map(p => p.cents)) - 50;
    const cMax = Math.max(300, ...all.map(p => p.cents)) + 50;
    const X = (t: number) => 8 + (t / tMax) * (w - 16);
    const Y = (cn: number) => h - 8 - ((cn - cMin) / (cMax - cMin)) * (h - 16);

    // 100 centlik ızgara
    g.strokeStyle = col('--tl-border'); g.lineWidth = 1;
    for (let cn = Math.ceil(cMin / 100) * 100; cn <= cMax; cn += 100) {
      g.beginPath(); g.moveTo(0, Y(cn)); g.lineTo(w, Y(cn)); g.stroke();
    }
    const draw = (pts: { t: number; cents: number }[], color: string, width: number) => {
      g.strokeStyle = color; g.lineWidth = width; g.lineJoin = 'round'; g.beginPath();
      pts.forEach((p, i) => {
        const prev = pts[i - 1];
        if (!prev || p.t - prev.t > 200) g.moveTo(X(p.t), Y(p.cents)); else g.lineTo(X(p.t), Y(p.cents));
      });
      g.stroke();
    };
    if (r.length) draw(r, col('--tl-gold'), 3);
    if (u.length) draw(u, col('--tl-primary'), 3);
  }, [user, reference, height]);


  return (
    <div>
      <canvas ref={canvas} className="tl-contour" style={{ height }} role="img" aria-label="Perde eğrisi: sen ve kurrâ" />
      <div className="tl-row tl-muted" style={{ marginTop: 6 }}>
        <span className="tl-chip">Sen</span><span className="tl-chip tl-chip--gold">Kurrâ</span>
      </div>
    </div>
  );
}
