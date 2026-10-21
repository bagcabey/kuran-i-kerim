import { Router } from 'express';
import { z } from 'zod';
import { q, pool } from './db.js';
import { requireAuth, AuthedRequest } from './auth.js';
import { ah } from './http.js';

export const progressRouter = Router();
progressRouter.use(requireAuth);

progressRouter.get('/', ah(async (req: AuthedRequest, res) => {
  const uid = req.user!.id;
  const [p, days, badges, settings] = await Promise.all([
    q('SELECT lesson_id, status, score, attempts, updated_at FROM tl_progress WHERE user_id=$1', [uid]),
    q('SELECT to_char(day,\'YYYY-MM-DD\') AS day, minutes FROM tl_activity_days WHERE user_id=$1 ORDER BY day DESC LIMIT 400', [uid]),
    q('SELECT badge_id FROM tl_user_badges WHERE user_id=$1', [uid]),
    q('SELECT * FROM tl_settings WHERE user_id=$1', [uid]),
  ]);
  res.json({
    progress: Object.fromEntries(p.rows.map(r => [r.lesson_id, { status: r.status, score: r.score, attempts: r.attempts, lastAt: r.updated_at }])),
    activity: days.rows,
    badges: badges.rows.map(b => b.badge_id),
    settings: settings.rows[0] ?? null,
  });
}));

const putSchema = z.object({
  lessonId: z.string().min(1).max(80),
  status: z.enum(['not_started', 'in_progress', 'completed', 'mastered']),
  score: z.number().int().min(0).max(100).optional(),
  secondsSpent: z.number().int().min(0).max(36000).default(0),
  localDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

progressRouter.put('/lesson', ah(async (req: AuthedRequest, res) => {
  const parsed = putSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { lessonId, status, score, secondsSpent, localDay } = parsed.data;
  const uid = req.user!.id;

  await q(
    `INSERT INTO tl_progress (user_id, lesson_id, status, score, attempts, seconds)
     VALUES ($1,$2,$3,$4,1,$5)
     ON CONFLICT (user_id, lesson_id) DO UPDATE SET
       status = CASE WHEN tl_progress.status IN ('completed','mastered') AND EXCLUDED.status = 'in_progress'
                     THEN tl_progress.status ELSE EXCLUDED.status END,
       score = GREATEST(COALESCE(tl_progress.score,0), COALESCE(EXCLUDED.score,0)),
       attempts = tl_progress.attempts + 1,
       seconds = tl_progress.seconds + EXCLUDED.seconds,
       updated_at = now()`,
    [uid, lessonId, status, score ?? null, secondsSpent]
  );

  // P0-8: Yalnızca gerçek bir çalışma süresi varsa (ve 0 saniye değilse) aktivite gününü artır
  const minutes = Math.round(secondsSpent / 60);
  if (minutes > 0) {
    const dayParam = localDay || null;
    await q(
      `INSERT INTO tl_activity_days (user_id, day, minutes)
       VALUES ($1, COALESCE($2::date, CURRENT_DATE), $3)
       ON CONFLICT (user_id, day) DO UPDATE SET minutes = tl_activity_days.minutes + EXCLUDED.minutes`,
      [uid, dayParam, minutes]
    );
  }

  res.json({ ok: true });
}));

progressRouter.put('/settings', ah(async (req: AuthedRequest, res) => {
  const s = z.object({
    quranScale: z.number().min(0.8).max(2),
    tajweedColors: z.boolean(),
    theme: z.enum(['auto', 'light', 'dark']),
    dailyGoalMinutes: z.number().int().min(1).max(240),
    kararId: z.string().max(8),
    tuning: z.enum(['tr-53', 'ar-24']),
    cloudRecordings: z.boolean(),
    reminders: z.boolean(),
  }).safeParse(req.body);
  if (!s.success) return res.status(400).json({ error: s.error.flatten() });
  const v = s.data;
  await q(
    `INSERT INTO tl_settings (user_id, quran_scale, tajweed_colors, theme, daily_goal_minutes, karar_id, tuning, cloud_recordings, reminders)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (user_id) DO UPDATE SET quran_scale=$2, tajweed_colors=$3, theme=$4, daily_goal_minutes=$5,
       karar_id=$6, tuning=$7, cloud_recordings=$8, reminders=$9`,
    [req.user!.id, v.quranScale, v.tajweedColors, v.theme, v.dailyGoalMinutes, v.kararId, v.tuning, v.cloudRecordings, v.reminders]
  );
  res.json({ ok: true });
}));

/** Gizlilik & KVKK: tüm Tilavet verisini transaction ile eksiksiz sil */
progressRouter.delete('/all', ah(async (req: AuthedRequest, res) => {
  const uid = req.user!.id;
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    for (const t of [
      'tl_submissions',
      'tl_class_members',
      'tl_attempts',
      'tl_srs_cards',
      'tl_progress',
      'tl_activity_days',
      'tl_user_badges',
      'tl_settings',
      'tl_consents'
    ]) {
      const col = (t === 'tl_submissions' || t === 'tl_class_members') ? 'student_id' : 'user_id';
      await c.query(`DELETE FROM ${t} WHERE ${col}=$1`, [uid]);
    }
    await c.query(`UPDATE tl_content_reports SET user_id = NULL WHERE user_id=$1`, [uid]);
    await c.query(
      `INSERT INTO tl_deletion_log (user_id_hash, requested_at)
       VALUES (encode(digest($1::text,'sha256'),'hex'), now())`,
      [uid]
    );
    await c.query('COMMIT');
    res.json({ ok: true });
  } catch (e) {
    await c.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    c.release();
  }
}));
