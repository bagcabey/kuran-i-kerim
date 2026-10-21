// kimatik_lab/audio_lab/core/types.ts
// Merkezi Tip Sözleşmeleri (Single Source of Truth)

export type TuningSystemId = '12-tet' | '53-koma' | '24-edo';

export type AhenkId = 
  | 'boulahank'   // Bolâhenk (Referans A3 = 220.00 Hz)
  | 'davud'       // Dâvud (E3 = 164.81 Hz, -5 ses)
  | 'sah'         // Şah (F3 = 174.61 Hz, -4 ses)
  | 'mansur'      // Mansur (G3 = 196.00 Hz, -2 ses)
  | 'kiz'         // Kız (B3 = 246.94 Hz, +2 ses)
  | 'yildiz'      // Yıldız (C4 = 261.63 Hz, +3 ses)
  | 'mustahsen'   // Müstahsen (C#4 = 277.18 Hz, +4 ses)
  | 'supurde';    // Süpürde (D4 = 293.66 Hz, +5 ses)

export interface PitchFrame {
  timestamp: number;    // Performans milisaniyesi (ms)
  hz: number;           // Ham frekans (Hz, ses yoksa 0)
  clarity: number;      // Perde belirlilik katsayısı [0.0 - 1.0]
  rms: number;          // Kök-ortalama-kare enerji [0.0 - 1.0]
  voiced: boolean;      // İnsan sesi var mı?
}

export interface TunedPitchResult {
  rawHz: number;
  filteredHz: number;
  noteName: string;         // Batı nota adı (örn: "A3", "Bb3")
  traditionalName: string;  // Geleneksel perde adı (örn: "Dügâh", "Segâh")
  centDeviation: number;    // Sapma cent [-50.0 ile +50.0]
  komaDeviation: number;    // Türk sisteminde koma sapması [-4.5 ile +4.5]
  targetHz: number;         // En yakın perdenin ideal frekansı
  tuningSystem: TuningSystemId;
  inTune: boolean;          // Eşik içinde mi? (örn: |cent| <= 15)
}

export interface AhenkDefinition {
  id: AhenkId;
  nameTr: string;
  dugahHz: number;          // Dügâh (A) perdesinin bu ahenkteki frekansı
  semitoneShift: number;    // Bolâhenk'e göre yarım ses kayması
  description: string;
}

export type FocusPriority = 'exclusive' | 'ambient';

export interface FocusRequester {
  id: string;
  name: string;
  priority: FocusPriority;
  onInterrupted: () => void;
  onResumed?: () => void;
}

export type MeddType = 
  | 'tabii'      // 1-2 elif (Medd-i Tabîî)
  | 'muttasil'   // 4-5 elif (Medd-i Muttasıl)
  | 'munfasil'   // 2-4 elif (Medd-i Munfasıl)
  | 'lazim'      // 6 elif (Medd-i Lâzım)
  | 'ariz'       // 2-4-6 elif (Medd-i Ârız)
  | 'lin';       // 2-4-6 elif (Medd-i Lîn)

export type ReadingTempo = 'hadr' | 'tedvir' | 'tertil' | 'tahkik';

export interface MeddCardInfo {
  id: string;
  arabicText: string;
  transcription: string;
  surahAyah: string;
  meddType: MeddType;
  targetElifMin: number;
  targetElifMax: number;
  ruleExplanationTr: string;
  exemplarAudioUrl?: string;
  exemplarHz?: number;
}

export interface MeddMeasurementResult {
  cardId: string;
  measuredDurationMs: number;
  calculatedElif: number;
  harakahUnitMs: number;
  targetMin: number;
  targetMax: number;
  isSuccessful: boolean;
  tempoDetected: ReadingTempo;
  completedAt: number;
}

export interface TimeSeriesPoint {
  t: number;      // Başlangıçtan itibaren geçen süre (saniye)
  hz: number;     // Frekans (Hz)
  cent: number;   // Karar sesine göre cent sapması
  rms: number;    // Ses şiddeti
}

export interface QariReferenceContour {
  id: string;
  titleTr: string;
  surah: number;
  ayah: number;
  qariName: string;
  makamId: string;
  tonicHz: number;
  audioDurationSeconds: number;
  audioUrl: string;
  samples: Array<{ t: number; hz: number; cent: number }>;
}

export interface DTWComparisonResult {
  shapeScore: number;     // 0 - 100 (Seyir ve perde uyumu)
  rhythmScore: number;    // 0 - 100 (Zamanlama ve durak uyumu)
  combinedScore: number;  // Ağırlıklı genel akustik skor
  warpingPath: Array<[number, number]>;
  averageDistance: number;
  legalNotice: string;    // "Fem-i muhsin icazeti değildir" uyarısı
}

export interface SpectrumBands {
  chest: number;      // 80 - 300 Hz (Göğüs Rezonansı)
  oral: number;       // 300 - 1500 Hz (Ağız / Boğaz)
  nasal: number;      // 1500 - 2500 Hz (Hayşûm / Geniz)
  qariFormant: number;// 2500 - 3500 Hz (Kâri Formantı / İrşâd Çınlaması)
  brilliance: number; // 3500 - 8000 Hz (Tiz Aydınlık)
}

export interface BreathSessionResult {
  mode: '3-4' | '2-4';
  durationSeconds: number;
  timestamp: number;
}
