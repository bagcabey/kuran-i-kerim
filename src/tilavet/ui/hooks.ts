import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PitchTracker } from '../core/audio/tracker.js';
import { Recorder, RecordingResult } from '../core/audio/recorder.js';
import { RangePlayer } from '../core/audio/player.js';
import { Drone } from '../core/audio/drone.js';
import type { PitchSample } from '../core/types.js';
import tr from '../i18n/tr.json';

export const t = (k: keyof typeof tr | string) => (tr as Record<string, string>)[k] ?? k;
export const tx = (o: Partial<Record<'tr' | 'ar' | 'en', string>> | undefined, lang: 'tr' | 'ar' | 'en' = 'tr') =>
  o?.[lang] ?? o?.tr ?? '';

/** Canlı perde (tuner / ses sınırı ölçümü için) */
export function usePitch() {
  const trackerRef = useRef<PitchTracker | null>(null);
  const [running, setRunning] = useState(false);
  const [sample, setSample] = useState<PitchSample | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    try {
      setError(null);
      const tr = new PitchTracker();
      tr.on(setSample);
      await tr.start();
      trackerRef.current = tr; setRunning(true);
    } catch (e: any) {
      setError(e?.name === 'NotAllowedError' ? t('tl.rec.noMic') : String(e?.message ?? e));
    }
  }, []);
  const stop = useCallback(() => {
    trackerRef.current?.stop(); trackerRef.current = null; setRunning(false); setSample(null);
  }, []);
  useEffect(() => () => trackerRef.current?.stop(), []);
  const samples = () => trackerRef.current?.samples ?? [];
  return { running, sample, error, start, stop, samples };
}

/** Kayıt */
export function useRecorder() {
  const recRef = useRef<Recorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [live, setLive] = useState<PitchSample | null>(null);
  const [result, setResult] = useState<RecordingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    try {
      setError(null);
      if (result) URL.revokeObjectURL(result.url);
      setResult(null);
      const r = new Recorder();
      r.onPitch = setLive;
      await r.start();
      recRef.current = r; setRecording(true);
    } catch (e: any) {
      setError(e?.name === 'NotAllowedError' ? t('tl.rec.noMic') : String(e?.message ?? e));
    }
  }, [result]);

  const stop = useCallback(async () => {
    if (!recRef.current) return null;
    const res = await recRef.current.stop();
    recRef.current = null; setRecording(false); setLive(null); setResult(res);
    return res;
  }, []);

  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);
  return { recording, live, result, error, start, stop, supported: Recorder.supported() };
}

/** Ayet/kelime senkron oynatıcı */
export function useRangePlayer() {
  const p = useMemo(() => new RangePlayer(), []);
  const [word, setWord] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [rep, setRep] = useState<[number, number] | null>(null);
  useEffect(() => {
    const offs = [p.on('word', setWord), p.on('state', setPlaying), p.on('repeat', (n, tot) => setRep([n, tot]))];
    return () => { offs.forEach(o => o()); p.destroy(); };
  }, [p]);
  return { player: p, word, playing, rep };
}

export function useDrone() {
  const d = useMemo(() => new Drone(), []);
  const [on, setOn] = useState(false);
  useEffect(() => () => d.stop(), [d]);
  return {
    on,
    toggle: async (hz: number) => { if (d.playing) { d.stop(); setOn(false); } else { await d.start(hz, { withFifth: true }); setOn(true); } },
    setHz: (hz: number) => d.playing && d.setFrequency(hz),
    drone: d,
  };
}

/** Ayarları html köküne uygula (ayet boyutu, tema) */
export function applySettings(s: { quranScale: number; theme: 'auto' | 'light' | 'dark' }) {
  const root = document.documentElement;
  root.style.setProperty('--tl-quran-scale', String(s.quranScale));
  if (s.theme === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', s.theme);
}
