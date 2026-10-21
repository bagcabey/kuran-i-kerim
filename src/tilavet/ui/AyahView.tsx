import React from 'react';
import type { Ayah } from '../core/types.js';

interface Props {
  ayah: Ayah;
  activeWord?: number | null;
  highlightWords?: number[];
  showTranslation?: boolean;
  tajweedOn?: boolean;
  onWordClick?: (wordIndex: number) => void;
}

export function AyahView({ ayah, activeWord, highlightWords = [], showTranslation, tajweedOn, onWordClick }: Props) {
  const words = ayah.words ?? ayah.textUthmani.split(' ').map((w, i) => ({ index: i + 1, text: w }));
  return (
    <div className={tajweedOn ? 'tl-tj-on' : ''}>
      <div className="tl-ayah" lang="ar" dir="rtl" aria-label={`Ayet ${ayah.key}`}>
        {words.map(w => (
          <span
            key={w.index}
            className={'tl-ayah__word' + (activeWord === w.index || highlightWords.includes(w.index) ? ' is-active' : '')}
            role="button"
            tabIndex={0}
            onClick={() => onWordClick?.(w.index)}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onWordClick?.(w.index)}
          >
            {w.text}
          </span>
        ))}
        <span className="tl-ayah__num">﴿{toArabicDigits(ayah.ayah)}﴾</span>
      </div>
      {showTranslation && ayah.translationTr && <p className="tl-ayah__tr">{ayah.translationTr}</p>}
    </div>
  );
}

const toArabicDigits = (n: number) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);

export function TajweedLegend() {
  const items = [
    ['ghunna', 'Gunne', 'var(--tj-ghunna)'], ['ikhfa', 'İhfâ', 'var(--tj-ikhfa)'],
    ['idgham', 'İdğam', 'var(--tj-idgham)'], ['iqlab', 'İklâb', 'var(--tj-iqlab)'],
    ['qalqala', 'Kalkale', 'var(--tj-qalqala)'], ['madd', 'Med', 'var(--tj-madd)'],
  ] as const;
  return (
    <div className="tl-tj-legend" aria-label="Tecvid renk açıklaması">
      {items.map(([k, label, color]) => <span key={k} style={{ color }}>{label}</span>)}
    </div>
  );
}
