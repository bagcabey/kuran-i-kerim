import React from 'react';
import { useRecorder, t } from './hooks.js';
import { TunerGauge } from './TunerGauge.js';
import { nearestNote } from '../core/makam/tuning.js';
import { PitchContour } from './PitchContour.js';
import type { RecordingResult } from '../core/audio/recorder.js';

interface Props { onFinished?: (r: RecordingResult) => void; referenceContour?: any[] }

export function RecorderPanel({ onFinished, referenceContour }: Props) {
  const { recording, live, result, error, start, stop, supported } = useRecorder();
  if (!supported) return <div className="tl-note tl-note--warn">Bu tarayıcı kaydı desteklemiyor. Lütfen güncel Chrome, Edge, Safari veya Firefox kullanın.</div>;

  const n = live ? nearestNote(live.hz) : null;
  return (
    <div className="tl-card tl-stack">
      <p className="tl-muted">{t('tl.rec.why')}</p>
      {error && <div className="tl-note tl-note--danger" role="alert">{error}</div>}
      <div className="tl-row" style={{ justifyContent: 'center' }}>
        <button
          className={'tl-btn tl-btn--round tl-btn--record' + (recording ? ' is-recording' : '')}
          onClick={async () => { if (recording) { const r = await stop(); if (r) onFinished?.(r); } else await start(); }}
          aria-label={recording ? t('tl.rec.stop') : t('tl.rec.start')}
        >{recording ? '■' : '●'}</button>
      </div>
      {recording && <TunerGauge centsOff={n?.centsOff ?? null} noteLabel={n ? `${n.name}${n.octave}` : '—'} hz={live?.hz ?? null} />}
      {result && (
        <div className="tl-stack">
          <audio controls src={result.url} style={{ width: '100%' }} />
          <PitchContour user={result.pitch} reference={referenceContour} />
        </div>
      )}
    </div>
  );
}
