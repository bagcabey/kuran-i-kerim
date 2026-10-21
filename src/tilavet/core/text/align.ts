import { wordsOf } from './arabic.js';

export interface AlignOp { type: 'ok' | 'sub' | 'del' | 'ins'; expected?: string; heard?: string; expectedIndex?: number }
export interface AlignResult { wer: number; accuracy: number; ops: AlignOp[]; missed: number[] }

/** Beklenen ayet metni ile tanınan (ASR) metin arasında kelime düzeyinde hizalama. */
export function alignReading(expectedText: string, heardText: string): AlignResult {
  const A = wordsOf(expectedText), B = wordsOf(heardText);
  const n = A.length, m = B.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    const sub = dp[i - 1][j - 1] + (A[i - 1] === B[j - 1] ? 0 : 1);
    dp[i][j] = Math.min(sub, dp[i - 1][j] + 1, dp[i][j - 1] + 1);
  }
  // geri izleme
  const ops: AlignOp[] = []; let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + (A[i - 1] === B[j - 1] ? 0 : 1)) {
      ops.push(A[i - 1] === B[j - 1]
        ? { type: 'ok', expected: A[i - 1], heard: B[j - 1], expectedIndex: i }
        : { type: 'sub', expected: A[i - 1], heard: B[j - 1], expectedIndex: i });
      i--; j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      ops.push({ type: 'del', expected: A[i - 1], expectedIndex: i }); i--;
    } else { ops.push({ type: 'ins', heard: B[j - 1] }); j--; }
  }
  ops.reverse();
  const errors = dp[n][m];
  const wer = n === 0 ? 0 : errors / n;
  return {
    wer, accuracy: Math.max(0, Math.round((1 - wer) * 100)), ops,
    missed: ops.filter(o => o.type === 'sub' || o.type === 'del').map(o => o.expectedIndex!)
  };
}
