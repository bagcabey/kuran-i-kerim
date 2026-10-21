export interface SrsCard {
  id: string;
  ease: number;        // başlangıç 2.5
  interval: number;    // gün
  reps: number;        // art arda doğru
  lapses: number;
  due: string;         // ISO tarih
  lastReviewed?: string;
}

/** quality: 0 (tamamen unuttu) … 5 (mükemmel). Arayüzde: Tekrar=1, Zor=3, İyi=4, Kolay=5 */
export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

export function newCard(id: string, now = new Date()): SrsCard {
  return { id, ease: 2.5, interval: 0, reps: 0, lapses: 0, due: now.toISOString() };
}

export function review(card: SrsCard, q: Quality, now = new Date()): SrsCard {
  let { ease, interval, reps, lapses } = card;
  if (q < 3) {
    reps = 0; lapses += 1; interval = 1;
  } else {
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 3;
    else interval = Math.round(interval * ease);
    if (q === 3) interval = Math.max(1, Math.round(interval * 0.8)); // zor → biraz kısalt
  }
  ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  const due = new Date(now.getTime() + interval * 86400000);
  return { ...card, ease, interval, reps, lapses, due: due.toISOString(), lastReviewed: now.toISOString() };
}

export const isDue = (c: SrsCard, now = new Date()) => new Date(c.due) <= now;
export const dueCards = (cards: SrsCard[], now = new Date()) =>
  cards.filter(c => isDue(c, now)).sort((a, b) => +new Date(a.due) - +new Date(b.due));
