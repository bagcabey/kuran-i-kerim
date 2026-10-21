import React from 'react';
import { KARAR_CHOICES } from '../core/makam/tuning.js';
import { useDrone, t } from './hooks.js';

interface Props { kararId: string; onKararChange: (id: string) => void }

export function DronePanel({ kararId, onKararChange }: Props) {
  const { on, toggle, setHz, drone } = useDrone();
  const karar = KARAR_CHOICES.find(k => k.id === kararId) ?? KARAR_CHOICES[1];
  return (
    <div className="tl-card tl-row">
      <label>{t('tl.makam.karar')}
        <select className="tl-select" value={kararId}
          onChange={e => { onKararChange(e.target.value); const k = KARAR_CHOICES.find(x => x.id === e.target.value)!; setHz(k.hz); }}>
          {KARAR_CHOICES.map(k => <option key={k.id} value={k.id}>{k.label}</option>)}
        </select>
      </label>
      <button className={'tl-btn' + (on ? '' : ' tl-btn--ghost')} onClick={() => toggle(karar.hz)}>
        {on ? '⏸ Sesi durdur' : ' ' + t('tl.makam.drone')}
      </button>
      <label className="tl-muted">Ses
        <input type="range" min={0.05} max={0.4} step={0.01} defaultValue={0.18}
          onChange={e => drone.setVolume(+e.target.value)} aria-label="Drone ses seviyesi" />
      </label>
    </div>
  );
}
