import type { LessonStatus } from '../types.js';

export interface LessonMeta { id: string; level: number; prerequisites: string[]; minutes: number }
export interface ProgressMap { [lessonId: string]: { status: LessonStatus; score?: number; attempts?: number; lastAt?: string } }

export const isDone = (s?: LessonStatus) => s === 'completed' || s === 'mastered';

export function isUnlocked(lesson: LessonMeta, progress: ProgressMap, opts: { skipLocks?: boolean } = {}): boolean {
  if (opts.skipLocks) return true;
  return lesson.prerequisites.every(id => isDone(progress[id]?.status));
}

export function levelProgress(lessons: LessonMeta[], level: number, progress: ProgressMap) {
  const inLevel = lessons.filter(l => l.level === level);
  const done = inLevel.filter(l => isDone(progress[l.id]?.status)).length;
  return { total: inLevel.length, done, percent: inLevel.length ? Math.round((done / inLevel.length) * 100) : 0 };
}

/** Sıradaki önerilen ders: ilk kilidi açık ve bitmemiş ders. */
export function nextLesson(lessons: LessonMeta[], progress: ProgressMap): LessonMeta | null {
  const sorted = [...lessons].sort((a, b) => a.level - b.level);
  return sorted.find(l => !isDone(progress[l.id]?.status) && isUnlocked(l, progress)) ?? null;
}

/** Yerel saat dilimi (varsayılan: Europe/Istanbul / UTC+3) esaslı gün hesabı (YYYY-MM-DD). */
export function localDay(d = new Date(), timeZone = 'Europe/Istanbul'): string {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });
  return f.format(d);
}

/** Seri (streak): ardışık gün sayısı. activityDays: 'YYYY-MM-DD' listesi. */
export function streak(activityDays: string[], today = new Date(), timeZone = 'Europe/Istanbul'): number {
  const set = new Set(activityDays);
  let n = 0;
  const d = new Date(today);
  if (!set.has(localDay(d, timeZone))) d.setDate(d.getDate() - 1); // bugün henüz çalışılmadıysa dünden say
  while (set.has(localDay(d, timeZone))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

