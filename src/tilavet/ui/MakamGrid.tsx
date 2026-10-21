import React from 'react';
import type { Makam } from '../core/types.js';
import { tx } from './hooks.js';

export function MakamGrid({ makams, onPick, doneIds = [] }: { makams: Makam[]; onPick: (id: string) => void; doneIds?: string[] }) {
  return (
    <div className="tl-grid tl-grid-3">
      {makams.map(m => {
        const draft = m.status !== 'published' && m.status !== 'approved';
        return (
          <button key={m.id} className="tl-card tl-card--clickable tl-makam-card" onClick={() => onPick(m.id)}>
            <div className="tl-makam-card__title">{tx(m.names)} <span lang="ar" className="tl-muted">{m.names.ar}</span></div>
            <div className="tl-diff">Zorluk {m.difficulty}/3</div>
            <div className="tl-row">{m.characterTags.slice(0, 3).map(c => <span key={c} className="tl-chip">{c}</span>)}</div>
            {doneIds.includes(m.id) && <span className="tl-chip tl-chip--ok">Tamamlandı</span>}
            {draft && <span className="tl-chip tl-chip--warn">Hazırlanıyor</span>}
          </button>
        );
      })}
    </div>
  );
}
