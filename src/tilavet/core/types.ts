export type Lang = 'tr' | 'ar' | 'en';
export type I18nText = Partial<Record<Lang, string>>;

export type AyahKey = `${number}:${number}`; // "1:1"

/** [kelimeSırası(1'den), başlangıçMs, bitişMs] */
export type WordSegment = [number, number, number];

export interface Word {
  index: number;            // 1'den başlar
  text: string;             // Uthmani
  transliteration?: string;
  translation?: string;
  audioUrl?: string;        // kelime sesi (mutlak URL)
  tajweed?: TajweedTag[];   // kural işaretleri (opsiyonel)
}

export type TajweedKind = 'ghunna' | 'ikhfa' | 'idgham' | 'iqlab' | 'qalqala' | 'madd';
export interface TajweedTag { kind: TajweedKind; from: number; to: number } // karakter aralığı

export interface Ayah {
  key: AyahKey;
  surah: number;
  ayah: number;
  textUthmani: string;
  words?: Word[];
  translationTr?: string;
}

export interface AyahTiming {
  key: AyahKey;
  fromMs: number;
  toMs: number;
  segments?: WordSegment[];
}

export interface Reciter {
  id: string;                       // iç ID: "mp3q-231" gibi
  name: { ar?: string; en?: string; tr?: string };
  school: 'misir' | 'hicaz' | 'turk' | 'diger';
  externalIds: { qf?: number; mp3quran?: number; everyayah?: string };
  moshafs: Moshaf[];
}
export interface Moshaf {
  id: number;
  name: string;                    // "Hafs an Âsım - Mürettel"
  riwaya: string;
  style: 'murattal' | 'mujawwad' | 'muallim' | 'other';
  server: string;                  // "https://server6.mp3quran.net/akdr/"
  surahList: number[];
}

export type LessonStatus = 'not_started' | 'in_progress' | 'completed' | 'mastered';
export type ReviewStatus = 'draft' | 'expert_review' | 'approved' | 'published';

export type Section =
  | { type: 'intro'; text: I18nText }
  | { type: 'listen'; audioId: string; transcript?: I18nText; caption?: I18nText }
  | { type: 'explain'; text: I18nText; image?: string }
  | { type: 'examples'; items: { ayah: AyahKey; highlightWords?: number[]; audioId?: string; note?: I18nText }[] }
  | { type: 'letterGrid'; letters: string[] }
  | { type: 'imitate'; ayah: AyahKey; recordingRequired?: boolean; mode?: 'ayah' | 'phrase' }
  | { type: 'quiz'; quizId: string }
  | { type: 'summary'; bullets: I18nText[] };

export interface Lesson {
  id: string;
  level: number;
  module: string;
  title: I18nText;
  objectives: I18nText[];
  estimatedMinutes: number;
  prerequisites: string[];
  status: ReviewStatus;
  needsReview: boolean;
  sections: Section[];
  sources?: string[];
}

export interface QuizQuestion {
  id: string;
  type: 'single' | 'multi' | 'listen' | 'match';
  prompt: I18nText;
  audioId?: string;
  options: { id: string; text: I18nText }[];
  correct: string[];                 // doğru seçenek id'leri
  explanation?: I18nText;
}
export interface Quiz { id: string; title: I18nText; passScore: number; questions: QuizQuestion[] }

export interface PitchSample { t: number; hz: number; clarity: number; rms: number }  // t: ms
export type TuningSystem = 'tr-53' | 'ar-24';

export interface MakamDegree { name: I18nText; komas: number; arCents: number; isMicro?: boolean }
export interface Makam {
  id: string;
  names: I18nText;
  school: ('misir' | 'turk' | 'hicaz')[];
  characterTags: string[];
  difficulty: 1 | 2 | 3;
  kararName: string;                 // "Dügâh"
  guclu: string;                     // "Neva"
  seyir: 'cikici' | 'inici' | 'cikici-inici';
  degrees: MakamDegree[];            // karardan oktava, 0 .. 53 koma
  motifs: { id: string; name: I18nText; degreesPath: number[]; audioId?: string }[];
  transitions: { to: string; via: string; note?: I18nText }[];
  description: I18nText;
  ezanVakti?: string;
  ruhiTesir?: string;
  uyumluTemalar?: string[];
  ayahExamples?: any[];
  needsReview: boolean;
  status: ReviewStatus;
}
