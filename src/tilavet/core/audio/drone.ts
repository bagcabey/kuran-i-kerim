import { resumeAudio } from './context.js';

export class Drone {
  private oscs: OscillatorNode[] = [];
  private gain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  public playing = false;

  /** @param freq karar perdesinin frekansı (Hz)
   *  @param withFifth true ise beşli (kuvvetli) ses de eklenir */
  async start(freq: number, opts: { volume?: number; withFifth?: boolean } = {}) {
    if (this.playing) this.stop();
    const ctx = await resumeAudio();
    this.gain = ctx.createGain();
    this.gain.gain.value = 0;
    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 1400;

    const mk = (f: number, type: OscillatorType, g: number) => {
      const o = ctx.createOscillator();
      o.type = type; o.frequency.value = f;
      const og = ctx.createGain(); og.gain.value = g;
      o.connect(og).connect(this.filter!);
      o.start();
      this.oscs.push(o);
    };
    mk(freq, 'triangle', 0.6);
    mk(freq * 2, 'sine', 0.2);
    mk(freq / 2, 'sine', 0.25);
    if (opts.withFifth) mk(freq * 1.5, 'sine', 0.15);

    this.filter.connect(this.gain).connect(ctx.destination);
    const vol = opts.volume ?? 0.18;
    this.gain.gain.setTargetAtTime(vol, ctx.currentTime, 0.15); // yumuşak giriş
    this.playing = true;
  }

  setFrequency(freq: number) {
    this.oscs.forEach((o, i) => {
      const mult = [1, 2, 0.5, 1.5][i] ?? 1;
      o.frequency.setTargetAtTime(freq * mult, o.context.currentTime, 0.05);
    });
  }

  setVolume(v: number) {
    if (this.gain) this.gain.gain.setTargetAtTime(v, this.gain.context.currentTime, 0.05);
  }

  stop() {
    if (!this.gain) return;
    const ctx = this.gain.context;
    this.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
    const oscs = this.oscs;
    setTimeout(() => oscs.forEach(o => { try { o.stop(); o.disconnect(); } catch {} }), 400);
    this.oscs = []; this.playing = false;
  }
}

/** Tek perde çalar (dizi dinleme, harf/perde tıklama). */
export async function playTone(freq: number, durMs = 700, volume = 0.25) {
  const ctx = await resumeAudio();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.value = freq;
  const now = ctx.currentTime;
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(volume, now + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, now + durMs / 1000);
  o.connect(g).connect(ctx.destination);
  o.start(now);
  o.stop(now + durMs / 1000 + 0.05);
}

/** Bir diziyi sırayla çalar. */
export async function playScale(freqs: number[], stepMs = 650, onStep?: (i: number) => void) {
  for (let i = 0; i < freqs.length; i++) {
    onStep?.(i);
    await playTone(freqs[i], stepMs * 0.95);
    await new Promise(r => setTimeout(r, stepMs));
  }
  onStep?.(-1);
}
