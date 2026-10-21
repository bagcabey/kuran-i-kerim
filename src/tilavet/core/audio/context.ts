let ctx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!ctx) {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    ctx = new Ctor();
  }
  return ctx;
}

/** Kullanıcı etkileşiminden (tıklama) sonra çağrılmalı; tarayıcılar bağlamı askıda başlatır. */
export async function resumeAudio(): Promise<AudioContext> {
  const c = getAudioContext();
  if (c.state === 'suspended') await c.resume();
  return c;
}
