# 13. BÖLÜM 13: MODERN REACT & TYPESCRIPT ENTEGRASYONU

## 13.1. Çift Motorlu Mimari ve Sözleşme Birliği
Eski kod tabanında Vanilla arayüzde tuner toleransı $\pm 15\text{ cent}$ iken React bileşeninde $\pm 12\text{ cent}$ olarak hardcoded yazılmıştı (H7). Ayrıca iki motor farklı veri tipleri kullanmaktaydı (I2).

v4.0.0 ile hem Vanilla hem React katmanı `core/types.ts` ve `core/tuning_core.js` üzerinde mutlak birliğe kavuşturulmuştur.

---

## 13.2. `useAudioWorkletPitch.ts` (React Hook)

```typescript
// src/audio_lab/hooks/useAudioWorkletPitch.ts
// React İçi AudioWorklet Tabanlı Canlı Perde Yakalama Kancası

import { useState, useEffect, useRef, useCallback } from 'react';
import { micManager } from '../../../kimatik_lab/audio_lab/core/mic_manager.js';
import { tuningCore } from '../../../kimatik_lab/audio_lab/core/tuning_core.js';
import { pitchSmoother } from '../../../kimatik_lab/audio_lab/core/pitch_smoother.js';
import type { TunedPitchResult, PitchFrame } from '../../../kimatik_lab/audio_lab/core/types';

export function useAudioWorkletPitch() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentPitch, setCurrentPitch] = useState<TunedPitchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFrame = useCallback((frame: PitchFrame) => {
    if (frame.voiced && frame.hz > 0) {
      const smoothedHz = pitchSmoother.process(frame.hz, frame.clarity);
      if (smoothedHz > 0) {
        const result = tuningCore.resolvePitch(smoothedHz);
        setCurrentPitch(result);
      }
    } else {
      pitchSmoother.reset();
      setCurrentPitch(null);
    }
  }, []);

  const startTuner = useCallback(async () => {
    try {
      setError(null);
      await micManager.start();
      setIsActive(true);
    } catch (err: any) {
      setError(err?.message || 'Mikrofon başlatılamadı.');
      setIsActive(false);
    }
  }, []);

  const stopTuner = useCallback(() => {
    micManager.stop();
    pitchSmoother.reset();
    setIsActive(false);
    setCurrentPitch(null);
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    if (isActive) {
      unsubscribe = micManager.subscribe(handleFrame);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isActive, handleFrame]);

  return {
    isActive,
    currentPitch,
    error,
    startTuner,
    stopTuner
  };
}
```

---

## 13.3. `TunerGauge.tsx` (Kadran Bileşeni)

```tsx
// src/audio_lab/components/TunerGauge.tsx
// WCAG 2.2 Uyumlu, Mikrotonal İbre ve Perde Göstergesi

import React from 'react';
import type { TunedPitchResult } from '../../../kimatik_lab/audio_lab/core/types';

interface TunerGaugeProps {
  pitchResult: TunedPitchResult | null;
}

export const TunerGauge: React.FC<TunerGaugeProps> = ({ pitchResult }) => {
  const cent = pitchResult ? pitchResult.centDeviation : 0;
  const inTune = pitchResult ? pitchResult.inTune : false;
  const angle = Math.max(-45, Math.min(45, (cent / 50) * 45));

  return (
    <div className="sl-gauge-card" role="region" aria-label="Perde Kadranı">
      <div className="sl-gauge-dial">
        <div
          className={`sl-gauge-needle ${inTune ? 'in-tune' : ''}`}
          style={{ transform: `rotate(${angle}deg)` }}
        />
        <div className="sl-gauge-center-pin" />
      </div>

      <div className="sl-gauge-labels">
        <span>-50¢</span>
        <span className="sl-zero-mark">0</span>
        <span>+50¢</span>
      </div>

      <div className="sl-tuner-readout">
        <span className="sl-readout-hz">
          {pitchResult ? `${Math.round(pitchResult.rawHz)} Hz` : '-- Hz'}
        </span>
        <h2 className="sl-readout-note">
          {pitchResult ? `${pitchResult.traditionalName} (${pitchResult.noteName})` : '--'}
        </h2>
        <span className={`sl-readout-cent ${inTune ? 'text-emerald-400' : 'text-slate-400'}`}>
          {pitchResult
            ? `${cent > 0 ? '+' : ''}${cent} cent (${pitchResult.komaDeviation} koma)`
            : 'Sessizlik'}
        </span>
      </div>
    </div>
  );
};
```

---

## 13.4. `PitchContour.tsx` (Canlı Kontur Canvas Bileşeni)

```tsx
// src/audio_lab/components/PitchContour.tsx
// Catmull-Rom Destekli Canlı Çift Eğri Karşılaştırma Tuvali

import React, { useRef, useEffect } from 'react';
import { DTWAnalyzerV2 } from '../../../kimatik_lab/audio_lab/core/dtw_v2.js';
import type { TimeSeriesPoint } from '../../../kimatik_lab/audio_lab/core/types';

interface PitchContourProps {
  modelSamples: Array<{ t: number; cent: number; hz: number }>;
  userSamples: TimeSeriesPoint[];
  maxDurationSeconds?: number;
}

export const PitchContour: React.FC<PitchContourProps> = ({
  modelSamples,
  userSamples,
  maxDurationSeconds = 8.0
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Kılavuz çizgiler
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75].forEach(r => {
      ctx.beginPath();
      ctx.moveTo(0, h * r);
      ctx.lineTo(w, h * r);
      ctx.stroke();
    });

    // Model Referans Kontur (Altın Sarısı)
    if (modelSamples && modelSamples.length > 1) {
      const refPoints = modelSamples.map(s => ({
        x: (s.t / maxDurationSeconds) * w,
        y: (h / 2) - ((s.cent / 100) * (h / 2) * 0.8)
      }));
      DTWAnalyzerV2.drawSplineContour(ctx, refPoints, '#d4af37', 3.5);
    }

    // Kullanıcı Canlı Kontur (Lapis Mavisi)
    if (userSamples && userSamples.length > 1) {
      const userPoints = userSamples.map(s => ({
        x: (s.t / maxDurationSeconds) * w,
        y: (h / 2) - ((s.cent / 100) * (h / 2) * 0.8)
      }));
      DTWAnalyzerV2.drawSplineContour(ctx, userPoints, '#38bdf8', 3.0);
    }
  }, [modelSamples, userSamples, maxDurationSeconds]);

  return (
    <div className="sl-canvas-wrapper">
      <canvas ref={canvasRef} width={900} height={240} />
    </div>
  );
};
```

---

## 13.5. `ReadingModal.tsx` (React Odak Penceresi)

```tsx
// src/audio_lab/components/ReadingModal.tsx
// Tam Ekran Odaklı Okuma Penceresi React Bileşeni

import React, { useState, useEffect, useRef } from 'react';
import { PitchContour } from './PitchContour';
import { useAudioWorkletPitch } from '../hooks/useAudioWorkletPitch';
import { dtwAnalyzer } from '../../../kimatik_lab/audio_lab/core/dtw_v2.js';
import type { QariReferenceContour, TimeSeriesPoint, DTWComparisonResult } from '../../../kimatik_lab/audio_lab/core/types';

interface ReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  qariContour: QariReferenceContour;
  onOpenMushaf?: (surah: number, ayah: number) => void;
}

export const ReadingModal: React.FC<ReadingModalProps> = ({
  isOpen,
  onClose,
  qariContour,
  onOpenMushaf
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const { isActive, currentPitch, startTuner, stopTuner } = useAudioWorkletPitch();

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [userSamples, setUserSamples] = useState<TimeSeriesPoint[]>([]);
  const [evaluation, setEvaluation] = useState<DTWComparisonResult | null>(null);

  const recordStartRef = useRef<number>(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      startTuner();
    } else {
      dialog.close();
      stopTuner();
      setIsRecording(false);
      setCountdown(null);
    }
  }, [isOpen, startTuner, stopTuner]);

  // Canlı mikrofon karesi kaydı
  useEffect(() => {
    if (isRecording && currentPitch && currentPitch.rawHz > 0) {
      const t = (performance.now() - recordStartRef.current) / 1000;
      setUserSamples(prev => [
        ...prev,
        { t, hz: currentPitch.rawHz, cent: currentPitch.centDeviation, rms: 0.1 }
      ]);
    }
  }, [isRecording, currentPitch]);

  const handleStartCountdown = () => {
    setCountdown(3);
    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);
        setIsRecording(true);
        setUserSamples([]);
        recordStartRef.current = performance.now();
      }
    }, 800);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleGrade = () => {
    if (userSamples.length > 5 && qariContour.samples.length > 5) {
      const result = dtwAnalyzer.compare(userSamples, qariContour.samples);
      setEvaluation(result);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog ref={dialogRef} className="sl-modal" aria-modal="true" onCancel={onClose}>
      <div className="sl-modal-backdrop" onClick={onClose} />
      <div className="sl-modal-container">
        
        <div className="sl-modal-header">
          <div>
            <span className="sl-badge-makam">{qariContour.makamId.toUpperCase()} Makamı</span>
            <h2 className="sl-modal-title">{qariContour.titleTr}</h2>
          </div>
          <div className="flex gap-2">
            {onOpenMushaf && (
              <button
                className="sl-btn sl-btn-secondary"
                onClick={() => onOpenMushaf(qariContour.surah, qariContour.ayah)}
              >
                Mushaf'ta Aç
              </button>
            )}
            <button className="sl-btn sl-btn-icon" onClick={onClose} aria-label="Kapat">✕</button>
          </div>
        </div>

        <div className="sl-modal-body">
          <div className="sl-quran-box">
            <p className="sl-arabic-text" dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ <span className="sl-ayah-end">۝{qariContour.ayah}</span>
            </p>
            <p className="sl-transcription-text">Bismillâhir-Rahmânir-Rahîm</p>
          </div>

          <div className="relative">
            <PitchContour
              modelSamples={qariContour.samples}
              userSamples={userSamples}
              maxDurationSeconds={qariContour.audioDurationSeconds}
            />
            {countdown !== null && (
              <div className="sl-countdown-overlay">
                <span id="slCountdownNumber">{countdown}</span>
              </div>
            )}
          </div>

          {evaluation && (
            <div className="sl-score-card">
              <div className="sl-score-header">
                <h3>Akustik Tahlil Karnesi</h3>
                <span className="sl-badge-grade">%{evaluation.combinedScore}</span>
              </div>
              <div className="sl-score-grid">
                <div className="sl-score-metric">
                  <span>Perde Uyumu</span>
                  <div className="sl-progress-bar">
                    <div className="sl-progress-fill" style={{ width: `${evaluation.shapeScore}%` }} />
                  </div>
                  <span>%{evaluation.shapeScore}</span>
                </div>
                <div className="sl-score-metric">
                  <span>Ritim Uyumu</span>
                  <div className="sl-progress-bar">
                    <div className="sl-progress-fill" style={{ width: `${evaluation.rhythmScore}%` }} />
                  </div>
                  <span>%{evaluation.rhythmScore}</span>
                </div>
              </div>
              <p className="sl-legal-warning">{evaluation.legalNotice}</p>
            </div>
          )}
        </div>

        <div className="sl-modal-footer">
          <button
            className={`sl-btn ${isRecording ? 'sl-btn-danger' : 'sl-btn-primary'}`}
            onClick={isRecording ? handleStopRecording : handleStartCountdown}
          >
            {isRecording ? 'Okumayı Durdur' : '3-2-1 Okumaya Başla'}
          </button>
          <button
            className="sl-btn sl-btn-accent"
            disabled={userSamples.length < 5 || isRecording}
            onClick={handleGrade}
          >
            Tahlil Et & Karne Çıkar
          </button>
        </div>

      </div>
    </dialog>
  );
};
```
