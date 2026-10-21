import { describe, it, expect } from 'vitest';
import { trNormalize } from '../../src/tilavet/core/text/trNormalize';
import { queryAssistant } from '../../src/tilavet/core/learning/assistant';

describe('trNormalize and assistant queries', () => {
  it('normalizes Turkish capital I, dotted I, circumflexes and diacritics', () => {
    expect(trNormalize('İzhâr')).toBe('izhar');
    expect(trNormalize('Medd-i Ârız')).toBe('medd i ariz');
    expect(trNormalize('Şeddeli Mîm')).toBe('seddeli mim');
    expect(trNormalize('Kalkale-i Kübrâ')).toBe('kalkale i kubra');
    expect(trNormalize('Hükmü\'r-Râ')).toBe('hukmu r ra');
  });

  it('correctly matches KB for circumflexed and Turkish input queries', () => {
    const izharRes = queryAssistant('İzhâr nedir?');
    expect(izharRes.sender).toBe('assistant');
    expect(izharRes.text).toContain('İzhâr Kuralı');

    const meddArizRes = queryAssistant('Medd-i Ârız ve vecihleri nelerdir?');
    expect(meddArizRes.text).toContain('Medd-i Ârız');

    const seddeliMimRes = queryAssistant('Şeddeli Mîm kuralı');
    expect(seddeliMimRes.text).toContain('Şeddeli Mîm');

    const rastRes = queryAssistant('Rast makamı özellikleri');
    expect(rastRes.text).toContain('Rast Makamı');
  });

  it('triggers theological guardrail on fatwa/fıkh queries', () => {
    const fatwaRes = queryAssistant('Bu şekilde okumak günah mı, fetva nedir?');
    expect(fatwaRes.text).toContain('fıkhî bir hüküm veya fetva');
    expect(fatwaRes.disclaimer).toBeDefined();

    const prayerValidity = queryAssistant('Bu okuyuşla namazım geçerli mi?');
    expect(prayerValidity.text).toContain('fetva vermez');
  });

  it('opens guided topic menus and offers nearby choices for misspellings', () => {
    const topicMenu = queryAssistant('Konu menüsü: tecvid');
    expect(topicMenu.text).toContain('Tecvid kuralları');
    expect(topicMenu.suggestedActions?.length).toBeGreaterThan(0);

    const typo = queryAssistant('ikhfa');
    expect(typo.text).toContain('tam eşleştiremedim');
    expect(typo.suggestedActions?.some(action => action.label.includes('İhfâ'))).toBe(true);
  });

  it('offers alternate explanations when the learner did not understand', () => {
    const followUp = queryAssistant('Bunu anlamadım');
    expect(followUp.text).toContain('farklı biçimde');
    expect(followUp.suggestedActions?.map(action => action.label)).toContain('Daha basit anlat');
    expect(followUp.suggestedActions?.map(action => action.label)).toContain('Mini alıştırma');

    const simpler = queryAssistant('Daha basit anlat: İzhâr Kuralı');
    expect(simpler.text).toContain('Kısaca');
    expect(simpler.text).toContain('İzhâr Kuralı');

    const practice = queryAssistant('Mini alıştırma: İzhâr Kuralı');
    expect(practice.text).toContain('Kuralı kendi cümlenle açıkla');
  });
});
