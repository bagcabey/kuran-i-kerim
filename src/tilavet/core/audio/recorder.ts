import { PitchTracker } from './tracker.js';
import type { PitchSample } from '../types.js';

function pickMime(): string | undefined {
  const cands = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
  return cands.find(m => (window as any).MediaRecorder?.isTypeSupported?.(m));
}

export interface RecordingResult {
  blob: Blob;
  url: string;              // object URL (iş bitince URL.revokeObjectURL çağır)
  mime: string;
  durationMs: number;
  pitch: PitchSample[];
}

export class Recorder {
  private rec: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private tracker = new PitchTracker();
  private startedAt = 0;
  public onPitch: ((s: PitchSample | null) => void) | null = null;

  static supported() {
    return !!(navigator.mediaDevices?.getUserMedia && (window as any).MediaRecorder);
  }

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false, channelCount: 1 }
    });
    const mime = pickMime();
    this.rec = new MediaRecorder(this.stream, mime ? { mimeType: mime } : undefined);
    this.chunks = [];
    this.rec.ondataavailable = e => e.data.size && this.chunks.push(e.data);
    this.tracker.on(s => this.onPitch?.(s));
    await this.tracker.start(this.stream);
    this.startedAt = performance.now();
    this.rec.start(250);
  }

  stop(): Promise<RecordingResult> {
    return new Promise((resolve, reject) => {
      if (!this.rec) return reject(new Error('Kayıt başlatılmadı'));
      const rec = this.rec;
      rec.onstop = () => {
        const mime = rec.mimeType || 'audio/webm';
        const blob = new Blob(this.chunks, { type: mime });
        const pitch = this.tracker.samples.slice();
        this.tracker.stop(false);
        this.stream?.getTracks().forEach(t => t.stop());
        resolve({
          blob, mime, pitch,
          url: URL.createObjectURL(blob),
          durationMs: performance.now() - this.startedAt
        });
        this.rec = null; this.stream = null;
      };
      rec.stop();
    });
  }
}

/** İzin durumunu kontrol et (desteklenmiyorsa 'prompt' döner). */
export async function micPermission(): Promise<PermissionState> {
  try {
    const r = await (navigator as any).permissions.query({ name: 'microphone' });
    return r.state;
  } catch { return 'prompt'; }
}
