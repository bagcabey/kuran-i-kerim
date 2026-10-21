import React, { useMemo, useState } from 'react';
import type { Makam, TuningSystem } from '../core/types.js';
import { KARAR_CHOICES, scaleFrequencies, matchToMakam } from '../core/makam/tuning.js';
import { playScale, playTone } from '../core/audio/drone.js';
import { ScaleBar } from './ScaleBar.js';
import { DronePanel } from './DronePanel.js';
import { TunerGauge } from './TunerGauge.js';
import { usePitch, t, tx } from './hooks.js';

export function MakamDetail({ makam }: { makam: Makam }) {
  const [kararId, setKararId] = useState('D3');
  const [system, setSystem] = useState<TuningSystem>('tr-53');
  const [playing, setPlaying] = useState(-1);
  const pitch = usePitch();

  const karar = KARAR_CHOICES.find(k => k.id === kararId)!;
  const freqs = useMemo(() => scaleFrequencies(makam, karar.hz, system), [makam, karar.hz, system]);
  const match = pitch.sample ? matchToMakam(pitch.sample.hz, makam, karar.hz, system) : null;

  return (
    <div className="tl-stack">
      <header>
        <h1 className="tl-h1">{tx(makam.names)} <span lang="ar">{makam.names.ar}</span></h1>
        <p className="tl-muted">{tx(makam.description)}</p>
        <div className="tl-row">
          {makam.characterTags.map(c => <span key={c} className="tl-chip">{c}</span>)}
          <span className="tl-diff">Zorluk {makam.difficulty}/3</span>
          {makam.needsReview && <span className="tl-chip tl-chip--warn">Uzman onayı bekliyor</span>}
        </div>
      </header>

      <div className="tl-note">{t('tl.disclaimer.makam')}</div>

      <DronePanel kararId={kararId} onKararChange={setKararId} />

      <div className="tl-card tl-stack">
        <div className="tl-row">
          <h2 className="tl-h2">Dizi ve perdeler</h2><span className="tl-spacer" />
          <select className="tl-select" value={system} onChange={e => setSystem(e.target.value as TuningSystem)} aria-label="Ses sistemi">
            <option value="tr-53">Türk (53 koma)</option>
            <option value="ar-24">Arap (çeyrek ton)</option>
          </select>
          <button className="tl-btn" onClick={() => playScale(freqs, 650, setPlaying)}>▶ Diziyi çal</button>
        </div>
        <ScaleBar makam={makam} system={system} playingIndex={playing} onPlayDegree={i => playTone(freqs[i])} />
      </div>

      <div className="tl-card tl-stack">
        <div className="tl-row">
          <h2 className="tl-h2">Perde antrenörü</h2><span className="tl-spacer" />
          {!pitch.running
            ? <button className="tl-btn" onClick={pitch.start}>Başla</button>
            : <button className="tl-btn tl-btn--ghost" onClick={pitch.stop}>■ Durdur</button>}
        </div>
        {pitch.error && <div className="tl-note tl-note--danger" role="alert">{pitch.error}</div>}
        <TunerGauge
          centsOff={match?.centsOff ?? null}
          noteLabel={match?.degreeName ?? '—'}
          hz={pitch.sample?.hz ?? null}
        />
        <p className="tl-muted">Karar sesi çalarken diziyi söyle; göstergede hangi perdeye ne kadar yakın olduğunu gör.</p>
      </div>

      <div className="tl-card">
        <h2 className="tl-h2">Kalıp cümleler (motifler)</h2>
        <div className="tl-grid tl-grid-3">
          {makam.motifs.map(m => (
            <button key={m.id} className="tl-card tl-card--clickable tl-card--soft"
              onClick={() => playScale(m.degreesPath.map(i => freqs[i]), 500)}>
              ▶ {tx(m.name)}
            </button>
          ))}
        </div>
      </div>

      {makam.ayahExamples && makam.ayahExamples.length > 0 && (
        <div className="tl-card tl-stack">
          <div className="tl-row">
            <h2 className="tl-h2">Doğrulanmış Makam Tilavetleri (Gerçek İcralar)</h2>
            <span className="tl-spacer" />
            <span className="tl-chip" style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.4)' }}>
              ✓ Doğrulanmış Kayıtlar
            </span>
          </div>
          <p className="tl-muted">Her makamın seyrine ve manasına uygun âyetler, ilgili makamın usta kârisi tarafından icra edilmektedir.</p>

          <div className="tl-stack">
            {makam.ayahExamples.map((ex: any) => (
              <div key={ex.id || `${ex.surah}:${ex.ayah}`} className="tl-card tl-card--soft tl-stack" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="tl-row" style={{ justifyContent: 'space-between' }}>
                  <strong>{ex.reciter} — <span style={{ color: 'var(--accent-gold, #e5b869)' }}>{ex.text}</span></strong>
                  <span className="tl-chip">{ex.surah}:{ex.ayah}</span>
                </div>
                {ex.ayahTextAr && (
                  <div style={{ fontFamily: "'Amiri', serif", fontSize: '1.4rem', textAlign: 'right', direction: 'rtl', color: '#ffdf9e', padding: '0.5rem 0' }}>
                    {ex.ayahTextAr}
                  </div>
                )}
                {ex.ayahTextTr && (
                  <div style={{ fontStyle: 'italic', color: '#c5cddb', fontSize: '0.9rem' }}>
                    "{ex.ayahTextTr}"
                  </div>
                )}
                {ex.makamAnalysis && (
                  <div style={{ fontSize: '0.85rem', color: '#9feeff', background: 'rgba(0,229,255,0.05)', padding: '0.5rem 0.75rem', borderRadius: 6, borderLeft: '3px solid #00e5ff' }}>
                    <strong>Makam Tahlili:</strong> {ex.makamAnalysis}
                  </div>
                )}
                {ex.audioUrl && (
                  <audio controls preload="none" src={ex.audioUrl} style={{ width: '100%', marginTop: '0.5rem' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
