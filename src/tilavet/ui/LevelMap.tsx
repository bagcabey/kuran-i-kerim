import React from 'react';
import { isDone, isUnlocked, levelProgress, LessonMeta, ProgressMap } from '../core/learning/progress.js';
import { tx } from './hooks.js';

interface LevelInfo { level: number; id: string; title: any; lessons: string[] }

export function LevelMap({ levels, metas, progress, titles, onOpen }: {
  levels: LevelInfo[]; metas: LessonMeta[]; progress: ProgressMap;
  titles: Record<string, any>; onOpen: (lessonId: string) => void;
}) {
  return (
    <div className="tl-path">
      {levels.map(lv => {
        const p = levelProgress(metas, lv.level, progress);
        const current = lv.lessons.find(id => !isDone(progress[id]?.status));
        return (
          <section key={lv.id} className={'tl-node' + (p.percent === 100 ? ' is-done' : current ? ' is-current' : '')}>
            <div className="tl-card tl-stack">
              <div className="tl-row">
                <h2 className="tl-h2">Seviye {lv.level} · {tx(lv.title)}</h2>
                <span className="tl-spacer" /><span className="tl-chip">{p.done}/{p.total}</span>
              </div>
              <div className="tl-progress"><span style={{ width: p.percent + '%' }} /></div>
              <div className="tl-grid tl-grid-2">
                {lv.lessons.map(id => {
                  const meta = metas.find(m => m.id === id);
                  const locked = meta ? !isUnlocked(meta, progress) : true;
                  const done = isDone(progress[id]?.status);
                  return (
                    <button key={id} className={'tl-card tl-card--soft tl-card--clickable' + (locked ? ' tl-card--locked' : '')}
                      onClick={() => onOpen(id)} disabled={locked} aria-label={`${tx(titles[id])}${locked ? ' (kilitli)' : ''}`}>
                      {tx(titles[id]) || id}
                      {done ? ' · Tamamlandı' : locked ? ' · Kilitli' : ''}
                      {meta && <span className="tl-muted"> · {meta.minutes} dk</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
