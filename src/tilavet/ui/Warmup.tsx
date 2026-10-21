import React, { useState } from 'react';
import warm from '../data/voice/warmups.json';
import { BreathTimer } from './BreathTimer.js';
import { tx, t } from './hooks.js';
import { playScale } from '../core/audio/drone.js';
import { KARAR_CHOICES, scaleFrequencies } from '../core/makam/tuning.js';
import rast from '../data/makam/rast.json';
import ussak from '../data/makam/ussak.json';
import hicaz from '../data/makam/hicaz.json';

const MAKAMS: any[] = [rast, ussak, hicaz];

export function Warmup({ routineId }: { routineId: string }) {
  const routine = warm.routines.find(r => r.id === routineId)!;
  const [i, setI] = useState(0);
  const [sec, setSec] = useState<number | null>(null);
  const step: any = routine.steps[i];
  const finished = i >= routine.steps.length;

  async function timed(durationSec: number) {
    for (let s = durationSec; s > 0; s--) { setSec(s); await new Promise(r => setTimeout(r, 1000)); }
    setSec(null);
  }
  async function playVocalise() {
    const m = MAKAMS.find((x: any) => x.id === step.makamId);
    if (!m) return;
    const karar = KARAR_CHOICES.find(k => k.id === 'D3')!;
    const f = scaleFrequencies(m, karar.hz);
    await playScale((step.degreesPath as number[]).map(idx => f[idx]), 600);
  }

  if (finished) return <div className="tl-card"><h2 className="tl-h2">Isınma tamamlandı</h2><p className="tl-muted">Suyunu içmeyi unutma.</p></div>;

  return (
    <div className="tl-card tl-stack">
      <div className="tl-note tl-note--warn">{t('tl.voice.warn')}</div>
      <div className="tl-muted">Adım {i + 1}/{routine.steps.length}</div>
      <h2 className="tl-h2">{tx(step.title)}</h2>
      {step.hint && <p>{tx(step.hint)}</p>}

      {step.type === 'breath' && <BreathTimer inhaleSec={step.inhaleSec} holdSec={step.holdSec} exhaleSec={step.exhaleSec} cycles={step.cycles} />}
      {['lip-trill', 'humming', 'siren'].includes(step.type) && (
        <div className="tl-row">
          <button className="tl-btn" onClick={() => timed(step.durationSec)}>Başlat ({step.durationSec} sn)</button>
          {sec !== null && <span className="tl-chip">{sec} sn</span>}
        </div>
      )}
      {step.type === 'sustain' && <p>{step.reps} kez, her biri hedef {step.targetSec} sn. Sesin titremeden sabit kalsın.</p>}
      {step.type === 'scale' && <button className="tl-btn" onClick={playVocalise}>▶ Diziyi dinle, sonra sen söyle</button>}

      <div className="tl-row"><span className="tl-spacer" /><button className="tl-btn" onClick={() => setI(i + 1)}>Sonraki adım</button></div>
    </div>
  );
}
