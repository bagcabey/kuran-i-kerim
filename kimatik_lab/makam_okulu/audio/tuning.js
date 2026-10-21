// makam_okulu/audio/tuning.js
// SAF (pure) fonksiyonlar: DOM yok, AudioContext yok. Node'da test edilebilir.
// Tek doğruluk kaynağı: 53-koma TAM SAYI konumları (Rast = 0).

export const OCTAVE_KOMA = 53;
export const KOMA_CENTS = 1200 / OCTAVE_KOMA;            // ≈ 22.6415 cent

export const komaToCents = (k) => k * KOMA_CENTS;
export const centsToKoma = (c) => c / KOMA_CENTS;
export const centsToHz   = (cents, refHz) => refHz * Math.pow(2, cents / 1200);
export const hzToCents   = (hz, refHz) => 1200 * Math.log2(hz / refHz);
export const komaToRatio = (k) => Math.pow(2, k / OCTAVE_KOMA);

/** Varsayılan ses sistemi: Dügâh = A3 = 220 Hz (A4 = 440). Rast = Dügâh − 9 koma. */
export const DEFAULT_TUNING = Object.freeze({ a4: 440, dugahAbs: 9 });

export function rastHz(tuning = DEFAULT_TUNING) {
  const dugahHz = tuning.a4 / 2;                         // A3 = 220 Hz
  return dugahHz * komaToRatio(-tuning.dugahAbs);        // Rast (≈ G3, ~195.57 Hz)
}

/** Mutlak koma konumunun (Rast=0) frekansı. */
export function hzOfAbs(abs, tuning = DEFAULT_TUNING) {
  return rastHz(tuning) * komaToRatio(abs);
}

/** Bir makam derecesinin frekansı; kararHz kullanıcı transpozisyonudur (durak hangi frekansa gelecek). */
export function hzOfDegree(abs, durakAbs, kararHz) {
  return kararHz * komaToRatio(abs - durakAbs);
}

/* ---------- PERDE ADLARI (mutlak konuma göre; kaynak: TDV İslâm Ans. perde maddeleri) ---------- */
export const PERDE_ADI = Object.freeze({
  [-31]: 'Kaba Çargâh',
  [-22]: 'Yegâh',
  [-13]: 'Hüseynî-Aşîran',
  [-9]: 'Acem-Aşîran',
  [-5]: 'Irak',
  [-4]: 'Geveşt',
  0: 'Rast',
  4: 'Zirgüle',
  9: 'Dügâh',
  13: 'Kürdî',
  14: 'Dik-Kürdî',
  17: 'Segâh',
  18: 'Bûselik',
  22: 'Çargâh',
  26: 'Nîm-Hicaz',
  27: 'Hicaz',
  30: 'Dik-Hicaz',
  31: 'Nevâ',
  35: 'Nîm-Hisar',
  36: 'Hisar',
  39: 'Dik-Hisar',
  40: 'Hüseynî',
  44: 'Acem',
  48: 'Eviç',
  49: 'Mâhur',
  53: 'Gerdâniye',
  57: 'Nîm-Zirgüle',
  62: 'Muhayyer',
  65: 'Nîm-Şehnaz',
  66: 'Şehnaz',
  70: 'Tiz-Segâh',
  71: 'Tiz-Bûselik',
  75: 'Tiz-Çargâh',
  79: 'Tiz Nîm-Hicaz',
  80: 'Tiz-Hicaz',
  84: 'Tiz-Nevâ'
});

export function perdeAdi(abs) {
  return PERDE_ADI[abs] ?? null;                         // null → validator hata verir
}

/** Batı nota karşılığı (yaklaşık, gösterim amaçlı). Rast = G3. 12-EDO'ya en yakın + sapma (koma). */
const NOTE_TR = ['Do', 'Do♯', 'Re', 'Re♯', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'La♯', 'Si'];
export function approxNote(abs) {
  const semis = (abs / OCTAVE_KOMA) * 12;               // Rast'tan yarım ses
  const nearest = Math.round(semis);
  const midi = 55 + nearest;                             // G3 = MIDI 55
  const name = NOTE_TR[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  const devKoma = (semis - nearest) * (OCTAVE_KOMA / 12); // + = nota üstü (koma)
  return { name, octave, devKoma: Math.round(devKoma * 10) / 10 };
}

/* ---------- DİZİ / MOTİF ---------- */

/** Dizi (yön duyarlı): 'cikici' | 'inici'. inici tanımsızsa çıkıcıyı döndürür. */
export function diziOf(makam, yon = 'cikici') {
  return (yon === 'inici' && makam.dizi?.inici) ? makam.dizi.inici : (makam.dizi?.cikici || makam.dizi || []);
}

/** Makamın tüm oktav-açılmış perde kümesi (çıkıcı ∪ inici), sıralı, tekrarsız. */
export function allAbs(makam, octaves = [-1, 0, 1]) {
  const set = new Set();
  const c = makam.dizi?.cikici || makam.dizi || [];
  const base = [...c, ...(makam.dizi?.inici ?? [])];
  for (const o of octaves) for (const a of base) set.add(a + o * OCTAVE_KOMA);
  return [...set].sort((x, y) => x - y);
}

/** Motif → [{hz, beats, abs}] */
export function motifToEvents(makam, motif, kararHz) {
  return motif.path.map(s => ({
    hz: hzOfDegree(s.abs, makam.durak, kararHz),
    beats: s.beats ?? 1,
    abs: s.abs
  }));
}

/** Dizi → frekans listesi (çal butonları için). */
export function scaleHz(makam, kararHz, yon = 'cikici') {
  return diziOf(makam, yon).map(a => hzOfDegree(a, makam.durak, kararHz));
}

/* ---------- PERDE EŞLEME (tuner) ---------- */
export const DEFAULT_TOLERANCE = Object.freeze({ iyi: 15, yakin: 30 }); // cent

/**
 * Ölçülen frekansı makam perdelerine eşler.
 * @returns {{abs:number, ad:string|null, centsOff:number, komaOff:number, durum:'iyi'|'yakin'|'uzak'}}
 */
export function matchPitch(hz, makam, kararHz, opts = {}) {
  const tol = opts.tolerance ?? DEFAULT_TOLERANCE;
  const centsFromDurak = hzToCents(hz, kararHz);
  const absFloat = makam.durak + centsToKoma(centsFromDurak);
  let best = null;
  for (const a of allAbs(makam, [-2, -1, 0, 1, 2])) {
    const diffKoma = absFloat - a;
    if (best === null || Math.abs(diffKoma) < Math.abs(best.diffKoma)) best = { a, diffKoma };
  }
  const centsOff = komaToCents(best.diffKoma);
  const m = Math.abs(centsOff);
  return {
    abs: best.a,
    ad: perdeAdi(best.a),
    centsOff,
    komaOff: best.diffKoma,
    durum: m <= tol.iyi ? 'iyi' : m <= tol.yakin ? 'yakin' : 'uzak'
  };
}

export const formatKoma = (k) => (k >= 0 ? '+' : '−') + Math.abs(k).toFixed(1) + ' koma';

/** Ses aralığına göre karar önerisi: dizi [durak .. durak+53] rahat sığsın. */
export function suggestKarar(makam, lowHz, highHz) {
  const c = makam.dizi?.cikici || makam.dizi || [makam.durak + 53];
  const spanKoma = Math.max(...c) - makam.durak;
  const spanRatio = komaToRatio(spanKoma);
  const maxDurak = highHz / spanRatio;
  const candidate = Math.min(Math.max(lowHz * 1.05, lowHz), maxDurak);
  return { kararHz: candidate, sigar: candidate >= lowHz && candidate * spanRatio <= highHz * 1.02 };
}

if (typeof window !== 'undefined') {
  window.MakamTuning = {
    OCTAVE_KOMA,
    KOMA_CENTS,
    DEFAULT_TUNING,
    komaToCents,
    centsToKoma,
    centsToHz,
    hzToCents,
    komaToRatio,
    rastHz,
    hzOfAbs,
    hzOfDegree,
    PERDE_ADI,
    perdeAdi,
    approxNote,
    diziOf,
    allAbs,
    motifToEvents,
    scaleHz,
    DEFAULT_TOLERANCE,
    matchPitch,
    formatKoma,
    suggestKarar
  };
}
