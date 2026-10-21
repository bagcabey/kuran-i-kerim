import React, { useState } from 'react';
import { t } from './hooks.js';

interface Props {
  playing: boolean;
  repeatInfo?: [number, number] | null;
  onPlay: (opts: { rate: number; repeat: number; gapMs: number }) => void;
  onPause: () => void;
  onStop: () => void;
}

export function PlayerBar({ playing, repeatInfo, onPlay, onPause, onStop }: Props) {
  const [rate, setRate] = useState(1);
  const [repeat, setRepeat] = useState(1);
  const [gap, setGap] = useState(0);

  return (
    <div className="tl-player" role="region" aria-label="Oynatıcı">
      <div className="tl-player__controls">
        {!playing
          ? <button className="tl-btn tl-btn--round" onClick={() => onPlay({ rate, repeat, gapMs: gap })} aria-label="Çal">▶</button>
          : <button className="tl-btn tl-btn--round" onClick={onPause} aria-label="Duraklat">⏸</button>}
        <button className="tl-btn tl-btn--ghost" onClick={onStop} aria-label="Durdur">⏹</button>

        <label className="tl-muted">Hız
          <select className="tl-select" value={rate} onChange={e => setRate(+e.target.value)}>
            {[0.5, 0.65, 0.75, 0.9, 1, 1.15, 1.25].map(r => <option key={r} value={r}>{r}x</option>)}
          </select>
        </label>
        <label className="tl-muted">Tekrar
          <select className="tl-select" value={repeat} onChange={e => setRepeat(+e.target.value)}>
            {[1, 2, 3, 5, 10].map(r => <option key={r} value={r}>{r}x</option>)}
          </select>
        </label>
        <label className="tl-muted" title="Her tekrar arasındaki sessizlik: taklit etmen için">Boşluk
          <select className="tl-select" value={gap} onChange={e => setGap(+e.target.value)}>
            {[0, 1500, 3000, 5000].map(g => <option key={g} value={g}>{g / 1000} sn</option>)}
          </select>
        </label>
        {repeatInfo && <span className="tl-chip">{repeatInfo[0]}/{repeatInfo[1]}</span>}
      </div>
    </div>
  );
}
