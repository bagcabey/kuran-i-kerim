# 6. BÖLÜM 6: MEDD MOTORU v2: HECE KALİBRASYONU VE KARARLI ÖLÇÜM

## 6.1. Tecvid Nazariyatı: Elif Miktarı ve Kıraat Tempoları
Eski sistemdeki en büyük pedagojik hata, 1 elif miktarını sabit bir $280\text{ ms}$ katsayısına bağlamaktı (D4). Tecvid ilminde elif miktarı mutlak bir kronometre süresi değil; kârinin o an okuduğu kıraat mertebesine (temposuna) bağlı **göreli bir birimdir**.

Kıraat ilminde 4 temel okuma mertebesi vardır:
1. **Hadr (Hızlı Sürat):** Hatimlerde tercih edilen seri okuyuş. $1\text{ hareke} \approx 160 - 200\text{ ms} \implies 1\text{ elif} \approx 320 - 400\text{ ms}$.
2. **Tedvîr (Orta Sürat):** Namaz ve tilâvetlerde en yaygın mertebe. $1\text{ hareke} \approx 220 - 260\text{ ms} \implies 1\text{ elif} \approx 440 - 520\text{ ms}$.
3. **Tertîl (Vakarlı ve Tane Tane):** Tefekkür ve manaya odaklı okuyuş. $1\text{ hareke} \approx 280 - 320\text{ ms} \implies 1\text{ elif} \approx 560 - 640\text{ ms}$.
4. **Tahkîk (Talim / Meşk Sürati):** Her harfin ve meddin hakkının en geniş verildiği eğitim mertebesi. $1\text{ hareke} \approx 340 - 400\text{ ms} \implies 1\text{ elif} \approx 680 - 800\text{ ms}$.

### Bireysel Hareke Kalibratörü
Talebe okumaya başlamadan önce kalibrasyon moduna alınır. Talebeden peş peşe 3 kısa hareke (örneğin "ketebe" كَتَبَ) okuması istenir. VAD ile tespit edilen 3 hecenin toplam ses süresi $3$'e bölünerek talebenin doğal hareke birimi ($T_{\text{harakah}}$) milisaniye cinsinden hesaplanır. 1 elif, tam olarak $2 \times T_{\text{harakah}}$ olarak kabul edilir.

---

## 6.2. Hangover Debounce ve Kesinti Koruması
Ses tellerinin titremesinde (glottal stop veya heceler arası mikro kesintilerde) F0 bir anlığına kesilebilir. Eski kodda bu durumda sayaç sıfırlanmaktaydı (D2).

v4.0.0 Medd Motoru, $130\text{ ms}$'lik bir **Hangover (Bekleme) Tamponu** işletir. Ses enerjisi eşik altına inse dahi motor derhal durmaz; $130\text{ ms}$ boyunca dinler. Eğer ses bu süre içinde yeniden başlarsa, aradaki süre medde dâhil edilerek ölçüme kesintisiz devam edilir.

---

## 6.3. Donma (Freeze) Durum Makinesi ve Karne
Ölçüm tamamlandığında sonuç ekrandan silinmez (D5). Motor `FROZEN_RESULT` durumuna geçer; talebenin hedefiyle gerçekleşen süre, elif çubukları (1, 2, 3, 4, 5, 6 elif) üzerinde görsel olarak donar ve detaylı karne sunulur.

---

## 6.4. Medd Kartları Kataloğu (Örnek Sesli ve Harf Analizli)
Tüm kartlar tıklanabilir yapılmış (D1), her karta uygun örnek ses frekansı atanmış (A2) ve fıkhî tarîk ihtilafları belirtilmiştir (C6).

```javascript
// kimatik_lab/audio_lab/core/medd_engine.js
// Hece Kalibrasyonlu, Hangover Korumalı Medd Ölçüm Motoru

export const MEDD_CARDS = [
  {
    id: 'medd_tabii',
    arabicText: 'قَالَ',
    transcription: 'Qâle',
    surahAyah: 'Bakara, 33',
    meddType: 'tabii',
    targetElifMin: 1.0,
    targetElifMax: 1.3,
    exemplarHz: 220.0,
    ruleExplanationTr: 'Medd-i Tabîî: Harf-i medden sonra sebebi med bulunmazsa 1 elif miktarı uzatılır. Kasr vaciptir.'
  },
  {
    id: 'medd_muttasil',
    arabicText: 'جَآءَ',
    transcription: 'Cââ\'e',
    surahAyah: 'Nasr, 1',
    meddType: 'muttasil',
    targetElifMin: 4.0,
    targetElifMax: 5.0,
    exemplarHz: 244.26, // Segâh kararı
    ruleExplanationTr: 'Medd-i Muttasıl: Harf-i med ve sebebi med (hemze) aynı kelimede. Âsım kıraatinde 4 elif uzatmak vaciptir.'
  },
  {
    id: 'medd_munfasil',
    arabicText: 'يَآ أَيُّهَا',
    transcription: 'Yââ eyyuhel...',
    surahAyah: 'Bakara, 21',
    meddType: 'munfasil',
    targetElifMin: 2.0,
    targetElifMax: 4.0,
    exemplarHz: 260.66, // Çargâh
    ruleExplanationTr: 'Medd-i Munfasıl: Harf-i med kelime sonunda, sebebi med diğer kelime başında. Hadr ile 2, tertil ile 4 elif câizdir.'
  },
  {
    id: 'medd_lazim',
    arabicText: 'الْحَآقَّةُ',
    transcription: 'El-Hââqqah',
    surahAyah: 'Hâkka, 1',
    meddType: 'lazim',
    targetElifMin: 5.8,
    targetElifMax: 6.2,
    exemplarHz: 195.57, // Rast
    ruleExplanationTr: 'Medd-i Lâzım: Harf-i medden sonra sebebi med sükûn-i lâzım (şedde/cezm). İttifakla 6 elif uzatmak vaciptir.'
  },
  {
    id: 'medd_ariz',
    arabicText: 'الْعَالَمِينَ',
    transcription: 'El-Âlemîîn',
    surahAyah: 'Fâtiha, 2',
    meddType: 'ariz',
    targetElifMin: 2.0,
    targetElifMax: 6.0,
    exemplarHz: 220.0,
    ruleExplanationTr: 'Medd-i Ârız: Durulduğunda ortaya çıkan sükûn-i ârız. Tûl (4-6), Tevassut (2-3) veya Kasr (1) câizdir.'
  }
];

export class MeddEngine {
  constructor() {
    this.state = 'IDLE'; // 'IDLE' | 'CALIBRATING' | 'READY' | 'MEASURING' | 'HANGOVER' | 'FROZEN_RESULT'
    this.harakahUnitMs = 240; // Varsayılan Tedvîr (1 elif = 480 ms)
    this.activeCard = MEDD_CARDS[0];

    this.measuringStartTime = 0;
    this.hangoverStartTime = 0;
    this.accumulatedDurationMs = 0;
    this.hangoverLimitMs = 130; // 130 ms sessizlik tamponu

    this.calibrationSamples = [];
    this.listeners = new Set();
  }

  setCard(cardId) {
    const card = MEDD_CARDS.find(c => c.id === cardId);
    if (card) {
      this.activeCard = card;
      this.reset();
    }
  }

  setTempo(tempoName) {
    switch (tempoName) {
      case 'hadr':   this.harakahUnitMs = 180; break;
      case 'tedvir': this.harakahUnitMs = 240; break;
      case 'tertil': this.harakahUnitMs = 300; break;
      case 'tahkik': this.harakahUnitMs = 360; break;
    }
    this.notify();
  }

  startCalibration() {
    this.state = 'CALIBRATING';
    this.calibrationSamples = [];
    this.notify();
  }

  /**
   * Ses iş parçacığından gelen her ses karesinde çalışır.
   * @param {Object} pitchFrame { voiced, rms, hz }
   */
  processFrame(pitchFrame) {
    const now = performance.now();

    if (this.state === 'CALIBRATING') {
      if (pitchFrame.voiced) {
        this.calibrationSamples.push(now);
      }
      return;
    }

    if (this.state === 'IDLE' || this.state === 'READY') {
      if (pitchFrame.voiced) {
        // Ses başladı -> Ölçüme gir
        this.state = 'MEASURING';
        this.measuringStartTime = now;
        this.accumulatedDurationMs = 0;
        this.notify();
      }
      return;
    }

    if (this.state === 'MEASURING') {
      if (pitchFrame.voiced) {
        // Ses sürüyor
        this.accumulatedDurationMs = now - this.measuringStartTime;
        this.notify();
      } else {
        // Ses aniden kesildi -> Derhal bitirme, Hangover'a gir
        this.state = 'HANGOVER';
        this.hangoverStartTime = now;
      }
      return;
    }

    if (this.state === 'HANGOVER') {
      if (pitchFrame.voiced) {
        // Ses hangover süresi içinde geri geldi -> Ölçüme devam
        this.state = 'MEASURING';
        this.accumulatedDurationMs = now - this.measuringStartTime;
        this.notify();
      } else {
        // Sessizlik hangover süresini aştı mı?
        if (now - this.hangoverStartTime > this.hangoverLimitMs) {
          // Ölçüm kesin olarak tamamlandı -> Don (Freeze)
          this.state = 'FROZEN_RESULT';
          // Hangover süresini ölçülen medd süresinden düş
          this.accumulatedDurationMs = Math.max(0, this.hangoverStartTime - this.measuringStartTime);
          this.notify();
        }
      }
    }
  }

  finishCalibration() {
    if (this.calibrationSamples.length > 5) {
      const startT = this.calibrationSamples[0];
      const endT = this.calibrationSamples[this.calibrationSamples.length - 1];
      const totalMs = endT - startT;
      // 3 harekelik okuma varsayımı:
      const calculatedUnit = totalMs / 3.0;
      if (calculatedUnit >= 140 && calculatedUnit <= 450) {
        this.harakahUnitMs = Math.round(calculatedUnit);
      }
    }
    this.state = 'READY';
    this.notify();
  }

  reset() {
    this.state = 'IDLE';
    this.accumulatedDurationMs = 0;
    this.measuringStartTime = 0;
    this.hangoverStartTime = 0;
    this.notify();
  }

  /**
   * Süreyi elif cinsine dönüştürür. 1 elif = 2 hareke.
   * D3 düzeltmesi: 1'den 6'ya kadar tüm aralıkları kesintisiz destekler.
   */
  get calculatedElif() {
    const oneElifMs = this.harakahUnitMs * 2.0;
    if (oneElifMs <= 0) return 0;
    return Math.round((this.accumulatedDurationMs / oneElifMs) * 10) / 10;
  }

  get evaluation() {
    const elif = this.calculatedElif;
    const min = this.activeCard.targetElifMin;
    const max = this.activeCard.targetElifMax;

    if (elif < 0.5) return { status: 'none', label: 'Ses Bekleniyor' };
    if (elif < min) return { status: 'short', label: `Kısa (${elif} Elif - Hedef: ${min}-${max})` };
    if (elif > max + 0.6) return { status: 'long', label: `Fazla Uzun (${elif} Elif - Hedef: ${min}-${max})` };
    return { status: 'perfect', label: `Mükemmel Ölçü (${elif} Elif)` };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const payload = {
      state: this.state,
      durationMs: Math.round(this.accumulatedDurationMs),
      calculatedElif: this.calculatedElif,
      harakahUnitMs: this.harakahUnitMs,
      card: this.activeCard,
      evaluation: this.evaluation
    };
    for (const listener of this.listeners) {
      listener(payload);
    }
  }
}

export const meddEngine = new MeddEngine();
```
