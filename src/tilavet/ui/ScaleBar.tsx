import React from 'react';
import type { Makam, TuningSystem } from '../core/types.js';
import { degreeCents } from '../core/makam/tuning.js';

interface Props { makam: Makam; system: TuningSystem; playingIndex: number; onPlayDegree: (i: number) => void }

export function ScaleBar({ makam, system, playingIndex, onPlayDegree }: Props) {
  return (
    <div className="tl-scale" role="group" aria-label="Makam dizisi">
      {makam.degrees.map((d, i) => {
        const cents = degreeCents(d, system);
        const height = 24 + (cents / 1200) * 120;
        return (
          <div key={i} className={['tl-scale__step', d.isMicro ? 'is-micro' : '', i === 0 ? 'is-karar' : '', i === playingIndex ? 'is-playing' : ''].join(' ')}>
            <button className="tl-scale__bar" style={{ height }} onClick={() => onPlayDegree(i)}
              aria-label={`${d.name.tr} perdesini çal`} />
            <div className="tl-scale__name">{d.name.tr}</div>
            <div className="tl-muted" style={{ fontSize: '.7rem' }}>{system === 'tr-53' ? `${d.komas}k` : `${d.arCents}c`}</div>
          </div>
        );
      })}
    </div>
  );
}
