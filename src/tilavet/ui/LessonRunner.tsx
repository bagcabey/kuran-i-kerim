import React, { useState } from 'react';
import type { Lesson, Section, Quiz, Ayah } from '../core/types.js';
import { QuizView } from './QuizView.js';
import { AyahView } from './AyahView.js';
import { RecorderPanel } from './RecorderPanel.js';
import { api } from '../core/api/client.js';
import { t, tx } from './hooks.js';

interface Props {
  lesson: Lesson;
  quizzes: Record<string, Quiz>;
  getAyah: (key: string) => Promise<Ayah>;                     // projenin mevcut ayet kaynağına bağla
  getAudioUrl: (audioId: string) => string | null;              // tl_audio_assets'ten çöz
  onComplete: (score?: number) => void;
}

export function LessonRunner({ lesson, quizzes, getAyah, getAudioUrl, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [startedAt] = useState(Date.now());
  const [quizScore, setQuizScore] = useState<number | undefined>();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const sections = lesson.sections;
  const sec = sections[step];
  const last = step === sections.length - 1;
  const pct = Math.round(((step + 1) / sections.length) * 100);

  const quizSection = sections.find(s => s.type === 'quiz') as Extract<Section, { type: 'quiz' }> | undefined;
  const quiz = quizSection ? quizzes[quizSection.quizId] : undefined;
  const mustPass = quiz?.passScore ?? 70;
  const isCurrentQuiz = sec.type === 'quiz';
  const canAdvance = !isCurrentQuiz || quizScore !== undefined;
  const canFinish = !quiz || (quizScore !== undefined && quizScore >= mustPass);

  async function finish() {
    if (!canFinish || saving) return;
    setSaving(true);
    setSaveError('');
    const seconds = Math.round((Date.now() - startedAt) / 1000);
    try {
      await api.saveLesson({
        lessonId: lesson.id,
        status: 'completed',
        score: quizScore,
        secondsSpent: seconds,
      });
      onComplete(quizScore);
    } catch {
      setSaveError('İlerleme kaydedilemedi. Bağlantınızı kontrol edip yeniden deneyin.');
      setSaving(false);
    }
  }

  return (
    <div className="tl-container tl-stack">
      <div className="tl-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><span style={{ width: pct + '%' }} /></div>
      <h1 className="tl-h1">{tx(lesson.title)}</h1>
      {lesson.needsReview && <div className="tl-note tl-note--warn">Bu ders uzman incelemesindedir (taslak).</div>}

      <SectionView
        key={step}
        section={sec}
        quizzes={quizzes}
        getAyah={getAyah}
        getAudioUrl={getAudioUrl}
        lessonId={lesson.id}
        onQuizDone={s => setQuizScore(s)}
      />

      {isCurrentQuiz && quizScore === undefined && (
        <div className="tl-note tl-note--warn">
          İlerlemek için lütfen bu bölümdeki sınav sorularını yanıtlayıp sınavı tamamlayınız.
        </div>
      )}

      {last && quiz && (quizScore === undefined || quizScore < mustPass) && (
        <div className="tl-note tl-note--danger">
          Dersi tamamlayabilmek için sınavı en az %{mustPass} başarıyla geçmeniz gerekmektedir. (Mevcut: {quizScore ?? 0}%)
        </div>
      )}

      {saveError && <div className="tl-note" role="alert">{saveError}</div>}

      <div className="tl-row">
        <button className="tl-btn tl-btn--ghost" disabled={step === 0} onClick={() => setStep(s => s - 1)}>Geri</button>
        <span className="tl-spacer" />
        {!last
          ? <button className="tl-btn" disabled={!canAdvance} onClick={() => setStep(s => s + 1)}>{t('tl.lesson.next')}</button>
          : <button className="tl-btn tl-btn--gold" disabled={!canFinish || saving} onClick={finish}>
              {saving ? 'Kaydediliyor…' : t('tl.lesson.finish')}
            </button>}
      </div>
    </div>
  );
}


function SectionView({ section, quizzes, getAyah, getAudioUrl, lessonId, onQuizDone }: {
  section: Section; quizzes: Record<string, Quiz>; getAyah: Props['getAyah']; getAudioUrl: Props['getAudioUrl'];
  lessonId: string; onQuizDone: (score: number) => void;
}) {
  const [ayah, setAyah] = useState<Ayah | null>(null);
  const [ayahError, setAyahError] = useState(false);
  const ayahKey = section.type === 'imitate' ? section.ayah : section.type === 'examples' ? section.items[0]?.ayah : null;
  React.useEffect(() => {
    let active = true;
    setAyah(null);
    setAyahError(false);
    if (!ayahKey) return () => { active = false; };

    getAyah(ayahKey).then(value => {
      if (active) setAyah(value);
    }).catch(error => {
      console.error(`Ayet ${ayahKey} yüklenemedi:`, error);
      if (active) setAyahError(true);
    });

    return () => { active = false; };
  }, [ayahKey, getAyah]);

  switch (section.type) {
    case 'intro':
    case 'explain':
      return <div className="tl-card"><p>{tx(section.text)}</p></div>;
    case 'listen': {
      const url = getAudioUrl(section.audioId);
      return (
        <div className="tl-card tl-stack">
          {section.caption && <p className="tl-muted">{tx(section.caption)}</p>}
          {url ? <audio controls preload="none" src={url} style={{ width: '100%' }} /> : <div className="tl-note tl-note--warn">Bu bölüm için doğrulanmış ses kaydı mevcut değil.</div>}
          {section.transcript && <details><summary>Metin</summary><p>{tx(section.transcript)}</p></details>}
        </div>
      );
    }
    case 'examples':
      return (
        <div className="tl-stack">
          {ayahError
            ? <div className="tl-note tl-note--danger">Ayet kaynağına erişilemedi. İçerik doğrulanmadan ders bu adımda sürdürülemez.</div>
            : ayah
              ? <AyahView ayah={ayah} highlightWords={section.items[0]?.highlightWords} tajweedOn showTranslation />
              : <div className="tl-note" role="status">Ayet verisi yükleniyor…</div>}
          {section.items[0]?.note && <p className="tl-muted">{tx(section.items[0].note)}</p>}
        </div>
      );
    case 'letterGrid':
      return (
        <div className="tl-card">
          <div className="tl-letter-grid">
            {section.letters.map((ltr, idx) => (
              <div key={idx} className="tl-letter-cell">
                {ltr}
              </div>
            ))}
          </div>
        </div>
      );
    case 'imitate':
      return (
        <div className="tl-stack">
          {ayahError
            ? <div className="tl-note tl-note--danger">Ayet kaynağına erişilemedi; kayıt ve değerlendirme bu adımda kullanılamıyor.</div>
            : ayah
              ? <>
                  <AyahView ayah={ayah} showTranslation />
                  <RecorderPanel onFinished={r => api.saveAttempt({ lessonId, ayahKey: section.ayah, durationMs: Math.round(r.durationMs) }).catch(() => {})} />
                  <div className="tl-note">{t('tl.feedback.estimate')}</div>
                </>
              : <div className="tl-note" role="status">Ayet verisi yükleniyor…</div>}
        </div>
      );
    case 'quiz': {
      const quiz = quizzes[section.quizId];
      if (!quiz) return <div className="tl-note tl-note--warn">Sınav bulunamadı: {section.quizId}</div>;
      return <QuizView quiz={quiz} onDone={onQuizDone} getAudioUrl={getAudioUrl} />;
    }
    case 'summary':
      return <div className="tl-card"><ul>{section.bullets.map((b, i) => <li key={i}>{tx(b)}</li>)}</ul></div>;
    default:
      return null;
  }
}
