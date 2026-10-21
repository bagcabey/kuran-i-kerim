import { Router } from 'express';
import { z } from 'zod';
import { q } from './db.js';
import { requireAuth, AuthedRequest } from './auth.js';
import { ah } from './http.js';

export const attemptsRouter = Router();
attemptsRouter.use(requireAuth);

const analysisSchema = z.object({
  pitchTrajectorySummary: z.array(z.number().finite()).max(1000).optional(),
  medianF0: z.number().finite().min(0).max(2000).optional(),
  voicedRatio: z.number().finite().min(0).max(1).optional(),
  durationSec: z.number().finite().min(0).max(600).optional(),
  dtwDistance: z.number().finite().min(0).optional(),
  errors: z.array(z.string().max(100)).max(50).optional(),
}).strict();

const schema = z.object({
  lessonId: z.string().max(80).optional(),
  ayahKey: z.string().regex(/^\d{1,3}:\d{1,3}$/).optional(),
  makamId: z.string().max(40).optional(),
  reciterId: z.string().max(60).optional(),
  durationMs: z.number().int().min(0).max(600000),
  pitchScore: z.number().int().min(0).max(100).optional(),
  alignAccuracy: z.number().int().min(0).max(100).optional(),
  meanCentsDiff: z.number().int().min(0).max(2000).optional(),
  analysis: analysisSchema.optional(),
});

/** Yalnızca analiz metaverisi saklanır. Ham ses burada YOKTUR (Zero raw audio retention). */
attemptsRouter.post('/', ah(async (req: AuthedRequest, res) => {
  const p = schema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.flatten() });
  const v = p.data;
  const r = await q(
    `INSERT INTO tl_attempts (user_id, lesson_id, ayah_key, makam_id, reciter_id, duration_ms, pitch_score, align_accuracy, mean_cents_diff, analysis)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
    [req.user!.id, v.lessonId, v.ayahKey, v.makamId, v.reciterId, v.durationMs, v.pitchScore, v.alignAccuracy, v.meanCentsDiff, v.analysis ? JSON.stringify(v.analysis) : null]
  );
  res.json({ id: r.rows[0].id });
}));

attemptsRouter.get('/', ah(async (req: AuthedRequest, res) => {
  const r = await q(
    `SELECT id, lesson_id, ayah_key, makam_id, pitch_score, align_accuracy, created_at
     FROM tl_attempts WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100`, [req.user!.id]);
  res.json({ attempts: r.rows });
}));

