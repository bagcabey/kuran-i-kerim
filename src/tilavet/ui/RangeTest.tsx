import React, { useEffect, useRef, useState } from 'react';
import { usePitch } from './hooks.js';
import { vocalRange, suggestKarar, nearestNote } from '../core/makam/tuning.js';

export function RangeTest() {
  const pitch = usePitch();
  const bag = useRef<number[]>([]);
  const [result, setResult] = useState<ReturnType<typeof vocalRange> | null>(null);

  useEffect(() => { if (pitch.sample && pitch.sample.clarity > 0.8) bag.current.push(pitch.sample.hz); }, [pitch.sample]);

  const finish = () => { pitch.stop(); setResult(vocalRange(bag.current)); };
  const sugg = result ? suggestKarar(result) : null;

  return (
    <div className="tl-card tl-stack">
      <h2 className="tl-h2">Ses sınırı testi</h2>
      <p className="tl-muted">Rahat edebildiğin en alçak sesten en yükseğe, sonra geri "aaa" ile kay. Zorlanma, ağrı hissedersen dur.</p>
      {!pitch.running
        ? <button className="tl-btn" onClick={() => { bag.current = []; setResult(null); pitch.start(); }}>Başla</button>
        : <button className="tl-btn tl-btn--gold" onClick={finish}>Bitir ve hesapla</button>}
      {pitch.sample && <div className="tl-muted">Şu an: {nearestNote(pitch.sample.hz).name}{nearestNote(pitch.sample.hz).octave}</div>}
      {result && sugg && (
        <div className="tl-note">
          Rahat aralığın: {nearestNote(result.lowHz).name}{nearestNote(result.lowHz).octave} – {nearestNote(result.highHz).name}{nearestNote(result.highHz).octave}.<br />
          Önerilen karar perdeleri: {sugg.fits.map(f => f.label).join(', ')}.
        </div>
      )}
    </div>
  );
}
