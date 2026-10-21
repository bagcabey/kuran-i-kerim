import { describe, it, expect } from 'vitest';
import { detectPitchYIN } from '../../src/tilavet/core/audio/pitch';

function sine(freq: number, sr = 44100, n = 4096, amp = 0.5) {
  const b = new Float32Array(n);
  for (let i = 0; i < n; i++) b[i] = amp * Math.sin((2 * Math.PI * freq * i) / sr);
  return b;
}

describe('YIN', () => {
  it.each([110, 146.83, 220, 261.63, 440])('%f Hz sinüsünü ±1.5 Hz ile bulur', f => {
    const r = detectPitchYIN(sine(f), 44100);
    expect(r).not.toBeNull();
    expect(Math.abs(r!.hz - f)).toBeLessThan(1.5);
  });
  it('sessizlikte null döner', () => {
    expect(detectPitchYIN(new Float32Array(4096), 44100)).toBeNull();
  });
});
