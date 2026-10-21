import React, { useEffect, useRef, useState } from 'react';

type Phase = 'inhale' | 'hold' | 'exhale' | 'idle';
interface Props { inhaleSec: number; holdSec: number; exhaleSec: number; cycles: number; onDone?: () => void }

const LABEL: Record<Phase, string> = { inhale: 'Nefes al', hold: 'Tut', exhale: 'Yavaşça ver', idle: 'Hazır' };

export function BreathTimer({ inhaleSec, holdSec, exhaleSec, cycles, onDone }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [cycle, setCycle] = useState(0);
  const [left, setLeft] = useState(0);
  const running = useRef(false);

  useEffect(() => () => { running.current = false; }, []);

  async function run() {
    running.current = true;
    for (let c = 1; c <= cycles && running.current; c++) {
      setCycle(c);
      for (const [p, sec] of [['inhale', inhaleSec], ['hold', holdSec], ['exhale', exhaleSec]] as [Phase, number][]) {
        if (!running.current) return;
        if (sec <= 0) continue;
        setPhase(p);
        for (let s = sec; s > 0 && running.current; s--) { setLeft(s); await new Promise(r => setTimeout(r, 1000)); }
      }
    }
    setPhase('idle'); running.current = false; onDone?.();
  }

  const dur = phase === 'inhale' ? inhaleSec : phase === 'exhale' ? exhaleSec : 1;
  return (
    <div className="tl-stack" style={{ textAlign: 'center' }}>
      <div className="tl-breath" data-phase={phase} style={{ ['--tl-breath-dur' as any]: dur + 's' }} role="status" aria-live="polite">
        <div><div className="tl-h2">{LABEL[phase]}</div>{phase !== 'idle' && <div style={{ fontSize: '2rem' }}>{left}</div>}</div>
      </div>
      <div className="tl-muted">{cycle > 0 && `Tur ${cycle}/${cycles}`}</div>
      {phase === 'idle'
        ? <button className="tl-btn" onClick={run}>Başla</button>
        : <button className="tl-btn tl-btn--ghost" onClick={() => { running.current = false; setPhase('idle'); }}>Durdur</button>}
    </div>
  );
}
