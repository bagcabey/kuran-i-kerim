import React from 'react';
import { nextLesson, streak, LessonMeta, ProgressMap } from '../core/learning/progress.js';
import { t, tx } from './hooks.js';
import { ProgressRing } from './ProgressRing.js';

export function Home({ metas, progress, activityDays, minutesToday, goalMinutes, titles, onOpen, srsDueCount, onReview }: {
  metas: LessonMeta[]; progress: ProgressMap; activityDays: string[]; minutesToday: number; goalMinutes: number;
  titles: Record<string, any>; onOpen: (id: string) => void; srsDueCount: number; onReview: () => void;
}) {
  const next = nextLesson(metas, progress);
  const pct = Math.min(100, Math.round((minutesToday / goalMinutes) * 100));
  return (
    <div className="tl-container tl-stack">
      <h1 className="tl-h1">{t('tl.home.title')}</h1>
      <div className="tl-grid tl-grid-2">
        <div className="tl-card tl-row">
          <ProgressRing value={pct} label={`Günlük hedefin yüzde ${pct} tamamlandı`}><b>{minutesToday}/{goalMinutes}</b></ProgressRing>
          <div>
            <div className="tl-h2">{t('tl.home.today')}</div>
            <div className="tl-muted">{streak(activityDays)} {t('tl.home.streak')}</div>
          </div>
        </div>
        <div className="tl-card tl-stack">
          <div className="tl-h2">Sıradaki ders</div>
          {next
            ? <><p>{tx(titles[next.id]) || next.id}</p><button className="tl-btn" onClick={() => onOpen(next.id)}>{t('tl.home.continue')}</button></>
            : <p className="tl-muted">Tüm mevcut dersleri tamamladın.</p>}
        </div>
      </div>
      {srsDueCount > 0 && (
        <div className="tl-card tl-row">
          <span> {srsDueCount} tekrar kartı seni bekliyor</span><span className="tl-spacer" />
          <button className="tl-btn tl-btn--ghost" onClick={onReview}>Tekrara başla</button>
        </div>
      )}
      <div className="tl-note">{t('tl.disclaimer.teacher')}</div>
    </div>
  );
}
