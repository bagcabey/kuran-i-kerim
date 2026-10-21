// kimatik_lab/audio_lab/core/tuning_core.js
// 12-TET, 53-Koma (AEU) ve 24-EDO Perde ve Ahenk Motoru

export const AHENKLER = {
  boulahank: { id: 'boulahank', nameTr: 'Bolâhenk (Nısfiye)', dugahHz: 220.00, semitones: 0, desc: 'Standart Referans' },
  davud:     { id: 'davud',     nameTr: 'Dâvud',            dugahHz: 164.81, semitones: -5, desc: 'Derin Pest Erkek' },
  sah:       { id: 'sah',       nameTr: 'Şah',              dugahHz: 174.61, semitones: -4, desc: 'Pest Erkek' },
  mansur:    { id: 'mansur',    nameTr: 'Mansur',           dugahHz: 196.00, semitones: -2, desc: 'Bariton / Erkek' },
  kiz:       { id: 'kiz',       nameTr: 'Kız Ney',          dugahHz: 246.94, semitones: +2, desc: 'Tenor / Tiz Erkek' },
  yildiz:    { id: 'yildiz',    nameTr: 'Yıldız',           dugahHz: 261.63, semitones: +3, desc: 'Genç / Kadın' },
  mustahsen: { id: 'mustahsen', nameTr: 'Müstahsen',        dugahHz: 277.18, semitones: +4, desc: 'Tiz Ses' },
  supurde:   { id: 'supurde',   nameTr: 'Süpürde',          dugahHz: 293.66, semitones: +5, desc: 'Çok Tiz Ses' }
};

// 53-Koma Temel Perde Tablosu (Bolâhenk Referans Dügâh = 220.0 Hz)
export const PITCH_TABLE_53 = [
  { nameTr: 'Yegâh',           note: 'D3',   koma: -31, baseHz: 146.67 },
  { nameTr: 'Hüseynî-Aşîrân',  note: 'E3',   koma: -22, baseHz: 164.88 },
  { nameTr: 'Acem-Aşîrân',     note: 'F3',   koma: -18, baseHz: 173.85 },
  { nameTr: 'Geveşt',          note: 'F#3d', koma: -14, baseHz: 182.25 },
  { nameTr: 'Rast',            note: 'G3',   koma: -9,  baseHz: 195.57 },
  { nameTr: 'Zengüle',         note: 'G#3d', koma: -5,  baseHz: 205.95 },
  { nameTr: 'Dügâh',           note: 'A3',   koma: 0,   baseHz: 220.00 },
  { nameTr: 'Kürdî',           note: 'Bb3b4',koma: +4,  baseHz: 229.84 },
  { nameTr: 'Segâh',           note: 'B3d',  koma: +8,  baseHz: 244.26 },
  { nameTr: 'Bûselik',         note: 'B3',   koma: +9,  baseHz: 247.46 },
  { nameTr: 'Çargâh',          note: 'C4',   koma: +13, baseHz: 260.66 },
  { nameTr: 'Hicaz',           note: 'C#4b4',koma: +17, baseHz: 274.55 },
  { nameTr: 'Uzzâl',           note: 'C#4d', koma: +21, baseHz: 289.17 },
  { nameTr: 'Nevâ',            note: 'D4',   koma: +22, baseHz: 293.33 },
  { nameTr: 'Nîm Hisar',       note: 'Eb4',  koma: +26, baseHz: 308.97 },
  { nameTr: 'Hüseynî',         note: 'E4',   koma: +31, baseHz: 330.08 },
  { nameTr: 'Acem',            note: 'F4',   koma: +35, baseHz: 347.44 },
  { nameTr: 'Evc',             note: 'F#4d', koma: +39, baseHz: 366.49 },
  { nameTr: 'Mâhur',           note: 'F#4',  koma: +40, baseHz: 371.30 },
  { nameTr: 'Gerdâniye',       note: 'G4',   koma: +44, baseHz: 391.13 },
  { nameTr: 'Şehnaz',          note: 'G#4d', koma: +48, baseHz: 412.00 },
  { nameTr: 'Muhayyer',        note: 'A4',   koma: +53, baseHz: 440.00 },
  { nameTr: 'Tiz Segâh',       note: 'B4d',  koma: +61, baseHz: 488.52 },
  { nameTr: 'Tiz Çargâh',      note: 'C5',   koma: +66, baseHz: 521.32 }
];

export class TuningCore {
  constructor() {
    this.currentAhenk = AHENKLER.boulahank;
    this.system = '53-koma'; // '53-koma' | '12-tet' | '24-edo'
    this.inTuneToleranceCent = 15.0; // Kabul edilebilir tam karar aralığı (±15 cent)
  }

  setAhenk(ahenkId) {
    if (AHENKLER[ahenkId]) {
      this.currentAhenk = AHENKLER[ahenkId];
    }
  }

  setSystem(systemId) {
    if (['53-koma', '12-tet', '24-edo'].includes(systemId)) {
      this.system = systemId;
    }
  }

  /**
   * İki frekans arasındaki cent farkını hesaplar.
   * Negatif sapmalarda yuvarlama hatasını önler (B3 düzeltmesi).
   */
  static hzToCentDifference(f, fRef) {
    if (f <= 0 || fRef <= 0) return 0;
    return 1200.0 * Math.log2(f / fRef);
  }

  /**
   * Girilen frekansa en yakın perdeyi ve sapmayı döndürür.
   * @param {number} hz 
   * @returns {Object} TunedPitchResult
   */
  resolvePitch(hz) {
    if (!hz || hz <= 0) {
      return {
        rawHz: 0,
        filteredHz: 0,
        noteName: '--',
        traditionalName: '--',
        centDeviation: 0,
        komaDeviation: 0,
        targetHz: 0,
        tuningSystem: this.system,
        inTune: false
      };
    }

    const ahenkMultiplier = this.currentAhenk.dugahHz / 220.0;

    let bestMatch = null;
    let minAbsCent = Infinity;

    if (this.system === '53-koma') {
      for (const p of PITCH_TABLE_53) {
        const targetHz = p.baseHz * ahenkMultiplier;
        const centDiff = TuningCore.hzToCentDifference(hz, targetHz);
        const absDiff = Math.abs(centDiff);

        if (absDiff < minAbsCent) {
          minAbsCent = absDiff;
          const komaDiff = centDiff / (1200 / 53);
          bestMatch = {
            rawHz: hz,
            filteredHz: hz,
            noteName: p.note,
            traditionalName: p.nameTr,
            centDeviation: Math.round(centDiff * 10) / 10,
            komaDeviation: Math.round(komaDiff * 10) / 10,
            targetHz: Math.round(targetHz * 100) / 100,
            tuningSystem: '53-koma',
            inTune: absDiff <= this.inTuneToleranceCent
          };
        }
      }
    } else if (this.system === '12-tet') {
      const midiFloat = 69 + 12 * Math.log2(hz / 440.0);
      const roundedMidi = Math.round(midiFloat);
      const targetHz = 440.0 * Math.pow(2, (roundedMidi - 69) / 12);
      const centDiff = TuningCore.hzToCentDifference(hz, targetHz);
      const noteNames = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
      const noteName = noteNames[roundedMidi % 12] + (Math.floor(roundedMidi / 12) - 1);

      bestMatch = {
        rawHz: hz,
        filteredHz: hz,
        noteName: noteName,
        traditionalName: noteName,
        centDeviation: Math.round(centDiff * 10) / 10,
        komaDeviation: Math.round((centDiff / 22.64) * 10) / 10,
        targetHz: Math.round(targetHz * 100) / 100,
        tuningSystem: '12-tet',
        inTune: Math.abs(centDiff) <= this.inTuneToleranceCent
      };
    } else if (this.system === '24-edo') {
      const qFloat = 24 * Math.log2(hz / 220.0);
      const roundedQ = Math.round(qFloat);
      const targetHz = 220.0 * Math.pow(2, roundedQ / 24);
      const centDiff = TuningCore.hzToCentDifference(hz, targetHz);

      bestMatch = {
        rawHz: hz,
        filteredHz: hz,
        noteName: `Q${roundedQ}`,
        traditionalName: `Çeyrek Ton (${roundedQ})`,
        centDeviation: Math.round(centDiff * 10) / 10,
        komaDeviation: 0,
        targetHz: Math.round(targetHz * 100) / 100,
        tuningSystem: '24-edo',
        inTune: Math.abs(centDiff) <= this.inTuneToleranceCent
      };
    }

    return bestMatch;
  }

  /**
   * Toplanan F0 dizisinden en olası Karar perdesini ve Ahengi bulur.
   * @param {number[]} f0Array 
   */
  detectAhenkAndTonic(f0Array) {
    if (!f0Array || f0Array.length < 20) return null;

    // 1. Frekansları 2 Hz genişliğinde kovalara (bucket) böl
    const buckets = new Map();
    for (const f of f0Array) {
      if (f < 80 || f > 600) continue;
      const bKey = Math.round(f / 2) * 2;
      buckets.set(bKey, (buckets.get(bKey) || 0) + 1);
    }

    let maxCount = 0;
    let modeHz = 220;
    for (const [hz, count] of buckets.entries()) {
      if (count > maxCount) {
        maxCount = count;
        modeHz = hz;
      }
    }

    // 2. Bu modeHz hangi ahenkteki Dügâh veya Rast'a en yakın?
    let closestAhenk = AHENKLER.boulahank;
    let minDistance = Infinity;

    for (const ahenk of Object.values(AHENKLER)) {
      const dist = Math.abs(ahenk.dugahHz - modeHz);
      if (dist < minDistance) {
        minDistance = dist;
        closestAhenk = ahenk;
      }
    }

    return {
      estimatedTonicHz: modeHz,
      recommendedAhenk: closestAhenk
    };
  }
}

export const tuningCore = new TuningCore();
