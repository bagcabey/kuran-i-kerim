import React, { useMemo, useState } from 'react';
import glossaryData from '../data/glossary.json';
import { tx } from '../ui/hooks.js';

export default function GlossaryPage() {
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    return glossaryData.filter(item => {
      const trTerm = item.term?.tr?.toLowerCase() || '';
      const arTerm = item.term?.ar || '';
      const def = item.def?.tr?.toLowerCase() || '';
      const query = q.toLowerCase();
      return trTerm.includes(query) || arTerm.includes(query) || def.includes(query);
    });
  }, [q]);

  return (
    <div className="tl-container tl-stack">
      <h1 className="tl-h1">Tilavet &amp; Tecvid Terimleri Sözlüğü</h1>
      <p className="tl-muted">Kur'an-ı Kerim tilaveti, tecvid kaideleri ve makam ıstılahları.</p>

      <div className="tl-row">
        <input
          className="tl-select"
          style={{ width: '100%', maxWidth: '400px' }}
          placeholder="Terim veya tanım ara…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {list.length === 0 ? (
        <div className="tl-card tl-stack" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <p className="tl-muted">"{q}" aramasına uygun terim bulunamadı.</p>
        </div>
      ) : (
        <div className="tl-grid tl-grid-2">
          {list.map(item => (
            <div key={item.id} className="tl-card tl-stack">
              <div className="tl-row">
                <h2 className="tl-h2">{tx(item.term)}</h2>
                {item.term?.ar && <span lang="ar" className="tl-chip">{item.term.ar}</span>}
              </div>
              <p className="tl-muted">{tx(item.def)}</p>
              {item.lessons && item.lessons.length > 0 && (
                <div className="tl-row">
                  <span className="tl-chip tl-chip--gold">İlgili dersler: {item.lessons.join(', ')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
