import React, { useState } from 'react';
import warm from '../data/voice/warmups.json';
import { Warmup } from '../ui/Warmup.js';
import { RangeTest } from '../ui/RangeTest.js';
import { BreathTimer } from '../ui/BreathTimer.js';
import { tx } from '../ui/hooks.js';

export default function VoicePage() {
  const [tab, setTab] = useState<'warm' | 'breath' | 'range'>('warm');
  const [routine, setRoutine] = useState(warm.routines[0].id);
  return (
    <div className="tl-container tl-stack">
      <h1 className="tl-h1">Şan ve Ses Eğitimi</h1>
      <div className="tl-note tl-note--warn">{warm.warnings.tr}</div>
      <div className="tl-tabs" role="tablist">
        {[['warm', 'Isınma'], ['breath', 'Nefes'], ['range', 'Ses sınırı']].map(([id, label]) =>
          <button key={id} role="tab" aria-selected={tab === id} className="tl-tab" onClick={() => setTab(id as any)}>{label}</button>)}
      </div>
      {tab === 'warm' && (<>
        <select className="tl-select" value={routine} onChange={e => setRoutine(e.target.value)}>
          {warm.routines.map(r => <option key={r.id} value={r.id}>{tx(r.title)}</option>)}
        </select>
        <Warmup key={routine} routineId={routine} />
      </>)}
      {tab === 'breath' && <div className="tl-card"><BreathTimer inhaleSec={4} holdSec={4} exhaleSec={8} cycles={6} /></div>}
      {tab === 'range' && <RangeTest />}
      <div className="tl-card">
        <h2 className="tl-h2">Ses modülleri</h2>
        <ul>{warm.modules.map(m => <li key={m.id}>{tx(m.title)}</li>)}</ul>
      </div>
    </div>
  );
}
