import { describe, expect, it } from 'vitest';
import { BREATH_MODES, BreathCoachV2 } from '../../kimatik_lab/audio_lab/core/breath_coach_v2.js';

describe('BreathCoachV2', () => {
  it('offers gentle inhale and exhale rhythms without breath holds', () => {
    expect(Object.keys(BREATH_MODES)).toEqual(['3-4', '2-4']);

    for (const mode of Object.values(BREATH_MODES)) {
      expect(mode.phases.map(phase => phase.type)).toEqual(['inhale', 'exhale']);
    }
  });

  it('defaults to a gentle rhythm and ignores unsupported modes', () => {
    const coach = new BreathCoachV2();

    expect(coach.mode).toBe('3-4');
    coach.setMode('2-4');
    expect(coach.mode).toBe('2-4');
    coach.setMode('capacity');
    expect(coach.mode).toBe('2-4');
  });
});
