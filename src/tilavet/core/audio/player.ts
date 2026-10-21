import type { WordSegment } from '../types.js';

export interface PlayRangeOptions {
  startMs: number;
  endMs: number;
  segments?: WordSegment[];     // kelime zamanları (dosya başlangıcına göre mutlak ms)
  repeat?: number;              // 1 = bir kez
  gapMs?: number;               // tekrarlar arası sessizlik (taklit için)
  rate?: number;                // 0.5 .. 1.5
}

type Events = {
  word: (wordIndex: number | null) => void;
  time: (ms: number) => void;
  repeat: (n: number, total: number) => void;
  end: () => void;
  state: (playing: boolean) => void;
  error: (e: unknown) => void;
};

export class RangePlayer {
  private audio = new Audio();
  private raf = 0;
  private opts: PlayRangeOptions | null = null;
  private doneRepeats = 0;
  private gapTimer: number | null = null;
  private handlers: { [K in keyof Events]?: Set<Events[K]> } = {};
  private lastWord: number | null = null;
  public playing = false;

  constructor() {
    this.audio.preload = 'auto';
    this.audio.crossOrigin = 'anonymous';           // contour çıkarma için CORS izni gerekir
    (this.audio as any).preservesPitch = true;       // hız değişince perde bozulmasın
    (this.audio as any).mozPreservesPitch = true;
    (this.audio as any).webkitPreservesPitch = true;
    this.audio.addEventListener('error', e => this.emit('error', e));
  }

  on<K extends keyof Events>(k: K, fn: Events[K]) {
    (this.handlers[k] ??= new Set() as any).add(fn as any);
    return () => (this.handlers[k] as any).delete(fn);
  }
  private emit<K extends keyof Events>(k: K, ...a: Parameters<Events[K]>) {
    (this.handlers[k] as Set<any> | undefined)?.forEach(fn => fn(...a));
  }

  async load(src: string) {
    if (this.audio.src !== src) {
      this.audio.src = src;
      await new Promise<void>((res, rej) => {
        const ok = () => { cleanup(); res(); };
        const bad = () => { cleanup(); rej(new Error('Ses yüklenemedi: ' + src)); };
        const cleanup = () => {
          this.audio.removeEventListener('loadedmetadata', ok);
          this.audio.removeEventListener('error', bad);
        };
        this.audio.addEventListener('loadedmetadata', ok, { once: true });
        this.audio.addEventListener('error', bad, { once: true });
      });
    }
  }

  /** Tüm dosyayı çal (aralık verilmezse). */
  async playRange(opts: PlayRangeOptions) {
    this.opts = { repeat: 1, gapMs: 0, rate: 1, ...opts };
    this.doneRepeats = 0;
    this.audio.playbackRate = this.opts.rate!;
    await this.startPass();
  }

  private async startPass() {
    const o = this.opts!;
    this.audio.currentTime = o.startMs / 1000;
    this.lastWord = null;
    try { await this.audio.play(); } catch (e) { this.emit('error', e); return; }
    this.playing = true; this.emit('state', true);
    cancelAnimationFrame(this.raf);
    this.loop();
  }

  private loop() {
    const o = this.opts; if (!o) return;
    const tick = () => {
      const ms = this.audio.currentTime * 1000;
      this.emit('time', ms);
      const w = this.wordAt(ms);
      if (w !== this.lastWord) { this.lastWord = w; this.emit('word', w); }
      if (ms >= o.endMs - 20 || this.audio.ended) { this.passFinished(); return; }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private wordAt(ms: number): number | null {
    const segs = this.opts?.segments;
    if (!segs) return null;
    for (const [idx, s, e] of segs) if (ms >= s && ms < e) return idx;
    return null;
  }

  private passFinished() {
    const o = this.opts!;
    this.audio.pause();
    this.doneRepeats++;
    this.emit('word', null);
    if (this.doneRepeats < (o.repeat ?? 1)) {
      this.emit('repeat', this.doneRepeats, o.repeat!);
      this.gapTimer = window.setTimeout(() => this.startPass(), o.gapMs ?? 0);
    } else {
      this.playing = false; this.emit('state', false); this.emit('end');
    }
  }

  pause() { this.audio.pause(); cancelAnimationFrame(this.raf); this.playing = false; this.emit('state', false); }
  async resume() { await this.audio.play(); this.playing = true; this.emit('state', true); this.loop(); }
  stop() {
    cancelAnimationFrame(this.raf);
    if (this.gapTimer) clearTimeout(this.gapTimer);
    this.audio.pause();
    this.playing = false; this.emit('word', null); this.emit('state', false);
  }
  setRate(r: number) { this.audio.playbackRate = r; if (this.opts) this.opts.rate = r; }
  seekMs(ms: number) { this.audio.currentTime = ms / 1000; }
  get durationMs() { return (this.audio.duration || 0) * 1000; }
  get element() { return this.audio; }
  destroy() { this.stop(); this.audio.src = ''; }
}
