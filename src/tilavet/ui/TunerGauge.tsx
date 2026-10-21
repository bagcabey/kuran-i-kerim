import React from 'react';
import { centsToKomaText } from '../core/makam/tuning.js';

interface Props {
  centsOff: number | null;       // −50 .. +50 arası gösterilir
  noteLabel: string;             // "Segâh" veya "La"
  hz: number | null;
  showKoma?: boolean;
}

export function TunerGauge({ centsOff, noteLabel, hz, showKoma = true }: Props) {
  const clamped = centsOff == null ? 0 : Math.max(-50, Math.min(50, centsOff));
  const angle = (clamped / 50) * 60;                 // −60° .. +60°
  const abs = centsOff == null ? 999 : Math.abs(centsOff);
  const cls = abs <= 12 ? 'in-tune' : abs <= 30 ? 'near' : 'far';
  return (
    <div className="tl-tuner" role="img" aria-label={centsOff == null ? 'Ses algılanmıyor' : `${noteLabel}, ${Math.round(centsOff)} cent`}>
      <svg viewBox="0 0 300 170">
        {/* renkli yaylar */}
        <path d="M30 150 A120 120 0 0 1 270 150" fill="none" stroke="var(--tl-danger)" strokeWidth="14" opacity=".25" />
        <path d="M85 54 A120 120 0 0 1 215 54" fill="none" stroke="var(--tl-warn)" strokeWidth="14" opacity=".45" />
        <path d="M128 33 A120 120 0 0 1 172 33" fill="none" stroke="var(--tl-ok)" strokeWidth="14" />
        {/* ibre */}
        <g transform={`translate(150 150) rotate(${angle})`} style={{ transition: 'transform .12s linear' }}>
          <line x1="0" y1="0" x2="0" y2="-110" stroke="var(--tl-text)" strokeWidth="4" strokeLinecap="round" />
        </g>
        <circle cx="150" cy="150" r="9" fill="var(--tl-text)" />
        <text x="30" y="168" fontSize="12" fill="var(--tl-text-soft)">−50</text>
        <text x="140" y="22" fontSize="12" fill="var(--tl-text-soft)">0</text>
        <text x="256" y="168" fontSize="12" fill="var(--tl-text-soft)">+50</text>
      </svg>
      <div className="tl-tuner__note">{centsOff == null ? '—' : noteLabel}</div>
      <div className={`tl-tuner__off ${centsOff == null ? '' : cls}`}>
        {centsOff == null ? 'Ses bekleniyor…' : `${centsOff > 0 ? '+' : ''}${Math.round(centsOff)} cent${showKoma ? ' · ' + centsToKomaText(centsOff) : ''}`}
      </div>
      {hz != null && <div className="tl-muted">{hz.toFixed(1)} Hz</div>}
    </div>
  );
}
