import { getAudioContext, resumeAudio } from './context.js';
import { detectPitchYIN, MedianSmoother } from './pitch.js';
import type { PitchSample } from '../types.js';

type Listener = (s: PitchSample | null) => void;

export class PitchTracker {
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private timer: number | null = null;
  private buf!: Float32Array;
  private smoother = new MedianSmoother(5);
  private listeners = new Set<Listener>();
  private t0 = 0;
  public samples: PitchSample[] = [];

  /** Mikrofon stream'i dışarıdan verilebilir (kayıtla paylaşmak için). */
  async start(existing?: MediaStream, intervalMs = 40): Promise<void> {
    const ctx = await resumeAudio();
    this.stream = existing ?? await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
    });
    this.source = ctx.createMediaStreamSource(this.stream);
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 4096;
    this.buf = new Float32Array(this.analyser.fftSize);
    this.source.connect(this.analyser);
    this.samples = [];
    this.t0 = performance.now();

    this.timer = window.setInterval(() => {
      if (!this.analyser) return;
      this.analyser.getFloatTimeDomainData(this.buf as any);
      const r = detectPitchYIN(this.buf, ctx.sampleRate);
      let rms = 0;
      for (let i = 0; i < this.buf.length; i++) rms += this.buf[i] * this.buf[i];
      rms = Math.sqrt(rms / this.buf.length);
      if (!r) { this.smoother.reset(); this.emit(null); return; }
      const hz = this.smoother.push(r.hz);
      const sample: PitchSample = { t: performance.now() - this.t0, hz, clarity: r.clarity, rms };
      this.samples.push(sample);
      this.emit(sample);
    }, intervalMs);
  }

  stop(stopStream = true) {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.source?.disconnect();
    this.analyser?.disconnect();
    if (stopStream) this.stream?.getTracks().forEach(t => t.stop());
    this.source = null; this.analyser = null; this.stream = null;
  }

  on(fn: Listener) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  private emit(s: PitchSample | null) { this.listeners.forEach(l => l(s)); }
}
