import React, { useState } from 'react';
import type { Quiz } from '../core/types.js';
import { gradeQuiz, isCorrect } from '../core/learning/quiz.js';
import { t, tx } from './hooks.js';
import { ProgressRing } from './ProgressRing.js';

export function QuizView({ quiz, onDone, getAudioUrl }: { quiz: Quiz; onDone: (score: number) => void; getAudioUrl?: (id: string) => string | null }) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(false);

  const q = quiz.questions[i];
  const chosen = answers[q.id] ?? [];
  const multi = q.type === 'multi';
  const audio = q.audioId ? getAudioUrl?.(q.audioId) : null;
  const audioUnavailable = q.type === 'listen' && !audio;

  function pick(id: string) {
    if (checked) return;
    setAnswers(a => {
      const cur = a[q.id] ?? [];
      const next = multi ? (cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]) : [id];
      return { ...a, [q.id]: next };
    });
  }
  function next() {
    if (i < quiz.questions.length - 1) { setI(i + 1); setChecked(false); }
    else { const r = gradeQuiz(quiz, answers); setDone(true); onDone(r.score); }
  }

  if (done) {
    const r = gradeQuiz(quiz, answers);
    return (
      <div className="tl-card tl-stack" role="status">
        <h2 className="tl-h2">{r.passed ? t('tl.quiz.pass') : t('tl.quiz.retry')}</h2>
        <ProgressRing value={r.score} label={`Sınav puanı: yüzde ${r.score}`}><b>{r.score}</b></ProgressRing>
        <p className="tl-muted">{r.correct}/{r.total} doğru</p>
        {!r.passed && <button className="tl-btn" onClick={() => { setAnswers({}); setI(0); setChecked(false); setDone(false); }}>{t('tl.quiz.retry')}</button>}
      </div>
    );
  }

  return (
    <div className="tl-card tl-quiz">
      <div className="tl-muted">Soru {i + 1}/{quiz.questions.length}</div>
      <h2 className="tl-h2" lang="tr">{tx(q.prompt)}</h2>
      {audio && <audio controls src={audio} style={{ width: '100%' }} />}
      {audioUnavailable && <div className="tl-note tl-note--warn">Bu dinleme sorusu için doğrulanmış ses kaydı bulunmuyor; soru yanıtlanamaz.</div>}
      <div role={multi ? 'group' : 'radiogroup'} aria-label="Seçenekler">
        {q.options.map(o => {
          const sel = chosen.includes(o.id);
          const isRight = q.correct.includes(o.id);
          const cls = ['tl-quiz__option', sel ? 'is-selected' : '', checked && isRight ? 'is-correct' : '', checked && sel && !isRight ? 'is-wrong' : ''].join(' ');
          return (
            <button key={o.id} className={cls} onClick={() => pick(o.id)} disabled={checked || audioUnavailable} role={multi ? 'checkbox' : 'radio'} aria-checked={sel}>
              <span lang={/[\u0600-\u06FF]/.test(tx(o.text)) ? 'ar' : 'tr'}>{tx(o.text)}</span>
            </button>
          );
        })}
      </div>
      {checked && q.explanation && <div className={'tl-note ' + (isCorrect(q, chosen) ? '' : 'tl-note--danger')}>{tx(q.explanation)}</div>}
      <div className="tl-row" style={{ marginTop: 12 }}>
        <span className="tl-spacer" />
        {!checked
          ? <button className="tl-btn" disabled={!chosen.length || audioUnavailable} onClick={() => setChecked(true)}>Kontrol et</button>
          : <button className="tl-btn" onClick={next}>{i < quiz.questions.length - 1 ? 'Sonraki' : 'Bitir'}</button>}
      </div>
    </div>
  );
}
