import React, { useEffect, useState } from 'react';
import { RecorderPanel } from '../ui/RecorderPanel.js';
import { extractContour, compareContours } from '../core/audio/contour.js';
import { api } from '../core/api/client.js';
import type { PitchSample } from '../core/types.js';
import type { RecordingResult } from '../core/audio/recorder.js';
import { ProgressRing } from '../ui/ProgressRing.js';

/** Stüdyo: referans ses seç → dinle → kaydet → karşılaştır */
export default function StudioPage() {
  const [refUrl, setRefUrl] = useState<string>('');       // dinleme salonundan veya derse bağlı gelir
  const [refContour, setRefContour] = useState<PitchSample[]>([]);
  const [score, setScore] = useState<ReturnType<typeof compareContours> | null>(null);
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (!refUrl) return;
    setInfo('Referans perde eğrisi hazırlanıyor…');
    extractContour(refUrl).then(c => { setRefContour(c); setInfo(''); })
      .catch(() => setInfo('Bu kaynaktan perde eğrisi çıkarılamadı (CORS). Karşılaştırma yapılamaz; yine de kayıt alıp dinleyebilirsin.'));
  }, [refUrl]);

  async function onFinished(r: RecordingResult) {
    const s = compareContours(r.pitch, refContour);
    setScore(s);
    await api.saveAttempt({ durationMs: Math.round(r.durationMs), pitchScore: s?.score, meanCentsDiff: s?.meanCentsDiff }).catch(() => {});
  }

  return (
    <div className="tl-container tl-stack">
      <h1 className="tl-h1">Pratik Stüdyosu</h1>
      <div className="tl-card tl-stack">
        <label>Referans ses URL
          <input className="tl-select" style={{ width: '100%' }} value={refUrl} onChange={e => setRefUrl(e.target.value)} placeholder="Dinleme Salonu'ndan seç veya ses URL gir" />
        </label>
        {refUrl && <audio controls src={refUrl} style={{ width: '100%' }} crossOrigin="anonymous" />}
        {info && <div className="tl-note">{info}</div>}
      </div>
      <RecorderPanel onFinished={onFinished} referenceContour={refContour} />
      {score && (
        <div className="tl-card tl-row" role="status">
          <ProgressRing value={score.score} label={`Perde benzerliği: yüzde ${score.score}`}><b>{score.score}</b></ProgressRing>
          <div>
            <div className="tl-h2">Perde benzerliği</div>
            <div className="tl-muted">Ortalama fark: {score.meanCentsDiff} cent</div>
            <span className="tl-chip">{({ excellent: 'Mükemmel', good: 'İyi', fair: 'Orta', practice: 'Biraz daha pratik' } as any)[score.verdict]}</span>
          </div>
        </div>
      )}
    </div>
  );
}
