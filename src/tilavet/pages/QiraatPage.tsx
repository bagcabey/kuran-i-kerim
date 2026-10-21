import React, { useState } from 'react';
import qiraatData from '../data/qiraat.json';

export default function QiraatPage() {
  const [activeImam, setActiveImam] = useState<string>(qiraatData.imams[0].id);

  const selected = qiraatData.imams.find(i => i.id === activeImam) ?? qiraatData.imams[0];

  return (
    <div className="tl-container">
      <header className="tl-page-header">
        <h1 className="tl-page-title">{qiraatData.title}</h1>
        <p className="tl-page-desc">{qiraatData.description}</p>
        <div className="tl-disclaimer-alert">
          <span className="tl-alert-icon">⚠</span>
          <span>{qiraatData.disclaimer}</span>
        </div>
      </header>

      {/* Usul Karsilastirma Tablosu */}
      <section className="tl-card tl-qiraat-comparison" style={{ marginBottom: '2rem' }}>
        <h2 className="tl-card-title">Temel Usûl Farklılıkları Karşılaştırma Tablosu</h2>
        <div className="tl-qiraat-comparison__scroll" role="region" aria-label="Usûl karşılaştırma tablosu" tabIndex={0}>
          <table className="tl-table tl-qiraat-table">
            <thead>
              <tr>
                <th>Hüküm / Usûl</th>
                <th>Açıklama</th>
                <th>Hafs 'an Âsım</th>
                <th>Verş / Kālûn</th>
                <th>Diğer Mütevâtir Rivayetler</th>
              </tr>
            </thead>
            <tbody>
              {qiraatData.usulDifferences.map(u => (
                <tr key={u.rule}>
                  <td data-label="Hüküm / Usûl"><strong>{u.rule}</strong></td>
                  <td data-label="Açıklama">{u.description}</td>
                  <td data-label="Hafs 'an Âsım"><span className="tl-chip">{u.hafs}</span></td>
                  <td data-label="Verş / Kālûn"><span className="tl-chip tl-chip--gold">{u.vers ?? (u as any).kalunIbnKesir}</span></td>
                  <td data-label="Diğer Mütevâtir Rivayetler"><span className="tl-chip">{u.hamzaKisai ?? (u as any).ebuAmrSusi ?? (u as any).diger}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 10 Imam ve 20 Rawi Kataloğu */}
      <section className="tl-card">
        <h2 className="tl-card-title">Aşere-i Mütevâtire (10 İmam ve 20 Râvi)</h2>
        <div className="tl-chip-group" style={{ margin: '1rem 0' }}>
          {qiraatData.imams.map(im => (
            <button
              key={im.id}
              className={`tl-chip ${im.id === activeImam ? 'tl-chip--active' : ''}`}
              onClick={() => setActiveImam(im.id)}
            >
              {im.name.split(' ')[1]} ({im.region})
            </button>
          ))}
        </div>

        <div className="tl-imam-detail" style={{ padding: '1rem', border: '1px solid var(--tl-border)', borderRadius: 'var(--tl-radius)' }}>
          <h3>{selected.name} — <span style={{ color: 'var(--tl-gold)' }}>{selected.region} Ekolü</span></h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {selected.rawis.map(r => (
              <div key={r.id} className="tl-card" style={{ background: 'var(--tl-bg-surface-2)' }}>
                <h4>{r.name}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--tl-gold)', marginBottom: '0.5rem' }}>{r.status}</div>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{r.rulesSummary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Akademik Kaynakça */}
      <footer style={{ marginTop: '2rem', padding: '1rem', background: 'var(--tl-bg-surface)', borderRadius: 'var(--tl-radius)' }}>
        <h4>Doğrulanmış Kaynakça</h4>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--tl-text-dim)' }}>
          {qiraatData.academicReferences.map(ref => (
            <li key={ref}>{ref}</li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
