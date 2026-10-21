export interface BadgeRule { id: string; test: (ctx: BadgeContext) => boolean }
export interface BadgeContext {
  completedLessons: string[];
  streakDays: number;
  totalMinutes: number;
  makamDone: string[];                 // tamamlanan makam id'leri
  bestPitchScore: number;
  recordings: number;
}

export const BADGE_RULES: BadgeRule[] = [
  { id: 'first-lesson',   test: c => c.completedLessons.length >= 1 },
  { id: 'elif-ba-done',   test: c => c.completedLessons.includes('L1-6-sifatlar-giris') },
  { id: 'first-fatiha',   test: c => c.completedLessons.includes('L2-6-seviye2-sinav') },
  { id: 'tecvid-done',    test: c => c.completedLessons.includes('L3-8-seviye3-sinav') },
  { id: 'streak-7',       test: c => c.streakDays >= 7 },
  { id: 'streak-30',      test: c => c.streakDays >= 30 },
  { id: 'minutes-600',    test: c => c.totalMinutes >= 600 },
  { id: 'rast-traveler',  test: c => c.makamDone.includes('rast') },
  { id: 'uşşak-traveler', test: c => c.makamDone.includes('ussak') },
  { id: 'hicaz-traveler', test: c => c.makamDone.includes('hicaz') },
  { id: 'pitch-90',       test: c => c.bestPitchScore >= 90 },
  { id: 'rec-25',         test: c => c.recordings >= 25 },
];

export const newlyEarned = (owned: string[], ctx: BadgeContext) =>
  BADGE_RULES.filter(r => !owned.includes(r.id) && r.test(ctx)).map(r => r.id);
