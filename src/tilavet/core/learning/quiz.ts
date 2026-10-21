import type { Quiz, QuizQuestion } from '../types.js';

export interface QuizState { answers: Record<string, string[]>; finished: boolean }
export interface QuizResult { score: number; correct: number; total: number; passed: boolean; wrong: string[] }

export function isCorrect(q: QuizQuestion, chosen: string[]): boolean {
  const a = [...chosen].sort().join('|');
  const b = [...q.correct].sort().join('|');
  return a === b;
}

export function gradeQuiz(quiz: Quiz, answers: Record<string, string[]>): QuizResult {
  let correct = 0; const wrong: string[] = [];
  for (const q of quiz.questions) {
    if (isCorrect(q, answers[q.id] ?? [])) correct++; else wrong.push(q.id);
  }
  const score = Math.round((correct / quiz.questions.length) * 100);
  return { score, correct, total: quiz.questions.length, passed: score >= quiz.passScore, wrong };
}

/** Seçenek sırasını karıştır (Fisher–Yates). Tohum verilirse tekrarlanabilir. */
export function shuffle<T>(arr: T[], seed = Date.now()): T[] {
  const a = [...arr]; let s = seed;
  const rnd = () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
