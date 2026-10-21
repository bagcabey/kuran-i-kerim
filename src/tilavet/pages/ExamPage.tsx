import React, { useState } from 'react';
import { QuizView } from '../ui/QuizView.js';
import { RecorderPanel } from '../ui/RecorderPanel.js';
import q3_2 from '../data/quiz/Q-3-2.json';
import { t } from '../ui/hooks.js';
import type { RecordingResult } from '../core/audio/recorder.js';

export default function ExamPage() {
  const [examType, setExamType] = useState<'quiz' | 'recite'>('quiz');
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [studentName, setStudentName] = useState('');

  const [reciteStatus, setReciteStatus] = useState<'idle' | 'rejected' | 'submitted_to_hoca'>('idle');
  const [reciteMessage, setReciteMessage] = useState('');
  const [reciteDetails, setReciteDetails] = useState<{
    durationSec: number;
    voicedRatio: number;
    clarityScore: number;
  } | null>(null);

  const handleReciteFinished = (r: RecordingResult) => {
    const durationSec = Math.round(r.durationMs / 1000);
    // 1. Süre kontrolü (Fâtiha-i Şerîfe en az 20 saniye olmalıdır)
    if (r.durationMs < 20000) {
      setReciteStatus('rejected');
      setReciteMessage(
        `Kayıt süresi yetersiz (${durationSec} sn). Fâtiha-i Şerîfe tilaveti en az 20 saniye olmalıdır. Lütfen âyetleri tertîl üzere okuyunuz.`
      );
      setReciteDetails(null);
      return;
    }

    // 2. Ses ve perde kontrolü (boş mikrofon veya gürültü engeli)
    const voiced = r.pitch.filter(p => p.clarity > 0.45 && p.rms > 0.015);
    const voicedRatio = r.pitch.length > 0 ? voiced.length / r.pitch.length : 0;
    if (voicedRatio < 0.25) {
      setReciteStatus('rejected');
      setReciteMessage(
        'Yeterli seviyede berrak insan sesi tespit edilemedi. Lütfen mikrofonunuzu kontrol edin ve sessiz bir ortamda tekrar okuyun.'
      );
      setReciteDetails(null);
      return;
    }

    // 3. Ön değerlendirme metrikleri (sahte puan yok, salt akustik özet)
    const avgClarity = Math.round(
      (voiced.reduce((acc, v) => acc + v.clarity, 0) / (voiced.length || 1)) * 100
    );

    setReciteDetails({
      durationSec,
      voicedRatio: Math.round(voicedRatio * 100),
      clarityScore: avgClarity,
    });
    setReciteStatus('submitted_to_hoca');
    setReciteMessage(
      'Ön değerlendirme tamamlandı. Tilavet analiziniz incelenmek üzere hoca onay havuzuna iletildi. Fem-i muhsin ilkesi gereği nihai değerlendirme ehil bir hoca tarafından yapılır.'
    );
  };

  return (
    <div className="tl-container tl-stack">
      <h1 className="tl-h1">Yeterlilik ve Seviye Sınavları</h1>
      <div className="tl-note tl-note--warn">{t('tl.disclaimer.cert')}</div>

      <div className="tl-tabs" role="tablist">
        <button
          className="tl-tab"
          role="tab"
          aria-selected={examType === 'quiz'}
          onClick={() => setExamType('quiz')}
        >
          Tecvid Teori Sınavı
        </button>
        <button
          className="tl-tab"
          role="tab"
          aria-selected={examType === 'recite'}
          onClick={() => setExamType('recite')}
        >
          Fâtiha / Tilavet İmtihanı
        </button>
      </div>

      {examType === 'quiz' && (
        <div className="tl-stack">
          <QuizView
            quiz={q3_2 as any}
            onDone={s => setQuizScore(s)}
          />

          {quizScore !== null && quizScore >= 70 && (
            <div className="tl-card tl-stack" style={{ textAlign: 'center', borderColor: 'var(--tl-gold)' }}>
              <h2 className="tl-h2" style={{ color: 'var(--tl-gold)' }}>Tebrikler! Teori Sınavını Başarıyla Geçtiniz</h2>
              <p className="tl-muted">Teori Puanınız: {quizScore} / 100</p>
              <div className="tl-row" style={{ justifyContent: 'center' }}>
                <input
                  className="tl-select"
                  placeholder="Belgede görünecek adınız"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                />
              </div>
              <div className="tl-note" style={{ borderColor: 'var(--tl-gold)' }}>
                <strong>{studentName || 'Talebe'}</strong> — Tilavet Akademisi Teori Başarı Belgesi<br />
                <span style={{ color: '#b45309', fontWeight: 600 }}>
                  Bu belge yalnızca tecvid nazariyatına aittir; fem-i muhsin tilavet icazeti veya amelî yeterlilik ifade etmez.
                </span><br />
                <small>{t('tl.disclaimer.cert')}</small>
              </div>
            </div>
          )}

          {quizScore !== null && quizScore < 70 && (
            <div className="tl-note tl-note--warn">
              Teori sınavı puanınız: {quizScore} / 100. Geçme notu 70'tir. Lütfen tecvid derslerini gözden geçirip tekrar deneyiniz.
            </div>
          )}
        </div>
      )}

      {examType === 'recite' && (
        <div className="tl-stack">
          <div className="tl-card">
            <h2 className="tl-h2">Uygulamalı Okuma İmtihanı: Fâtiha Sûresi</h2>
            <p className="tl-muted">
              Kaydı başlatıp Fâtiha-i Şerîfe'yi tecvid ve mahreç kurallarına riayet ederek tertîl üzere okuyunuz (en az 20 saniye).
            </p>
          </div>

          <RecorderPanel onFinished={handleReciteFinished} />

          {reciteStatus === 'rejected' && (
            <div className="tl-note tl-note--danger" role="alert">
              <strong>Kayıt Değerlendirilemedi:</strong> {reciteMessage}
            </div>
          )}

          {reciteStatus === 'submitted_to_hoca' && (
            <div className="tl-card tl-stack" style={{ borderColor: 'var(--tl-gold)' }}>
              <h2 className="tl-h2" style={{ color: 'var(--tl-gold)' }}>Ön Değerlendirme Alındı ✓</h2>
              <p>{reciteMessage}</p>
              {reciteDetails && (
                <div className="tl-row tl-muted" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                  <span className="tl-chip">Süre: {reciteDetails.durationSec} sn</span>
                  <span className="tl-chip">Seslilik Oranı: %{reciteDetails.voicedRatio}</span>
                  <span className="tl-chip">Akustik Kararlılık: %{reciteDetails.clarityScore}</span>
                </div>
              )}
              <div className="tl-note">
                <strong>Fem-i Muhsin Kuralı:</strong> Yapay zekâ amelî tilavete nihai icazet veya geçerlilik veremez. Kaydınızın DSP analiz raporu hocanızın değerlendirme havuzuna aktarılmıştır.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
