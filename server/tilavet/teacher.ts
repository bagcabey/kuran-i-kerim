import { Router } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { q } from './db.js';
import { requireAuth, requireRole, AuthedRequest } from './auth.js';
import { ah } from './http.js';

export const teacherRouter = Router();
teacherRouter.use(requireAuth);

const uuidSchema = z.string().uuid();

teacherRouter.post('/classes', requireRole('teacher', 'admin'), ah(async (req: AuthedRequest, res) => {
  const b = z.object({ name: z.string().min(2).max(80) }).safeParse(req.body);
  if (!b.success) return res.status(400).json({ error: b.error.flatten() });
  const code = crypto.randomBytes(4).toString('hex').toUpperCase();
  const r = await q('INSERT INTO tl_classes (teacher_id, name, invite_code) VALUES ($1,$2,$3) RETURNING id, invite_code', [req.user!.id, b.data.name, code]);
  res.json(r.rows[0]);
}));

teacherRouter.post('/join', ah(async (req: AuthedRequest, res) => {
  const b = z.object({ code: z.string().min(4).max(16) }).safeParse(req.body);
  if (!b.success) return res.status(400).json({ error: b.error.flatten() });
  const c = await q('SELECT id FROM tl_classes WHERE invite_code=$1', [b.data.code.toUpperCase()]);
  if (!c.rows[0]) return res.status(404).json({ error: 'not_found' });
  await q('INSERT INTO tl_class_members (class_id, student_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [c.rows[0].id, req.user!.id]);
  res.json({ ok: true, classId: c.rows[0].id });
}));

/** Hoca: sınıfın öğrenci ilerlemesi (yalnızca KENDİ sınıfı) */
teacherRouter.get('/classes/:id/overview', requireRole('teacher', 'admin'), ah(async (req: AuthedRequest, res) => {
  if (!uuidSchema.safeParse(req.params.id).success) return res.status(400).json({ error: 'invalid_id' });
  const own = await q('SELECT 1 FROM tl_classes WHERE id=$1 AND teacher_id=$2', [req.params.id, req.user!.id]);
  if (!own.rows[0] && req.user!.role !== 'admin') return res.status(403).json({ error: 'forbidden' });
  const r = await q(
    `SELECT m.student_id,
            COUNT(*) FILTER (WHERE p.status IN ('completed','mastered')) AS done_lessons,
            COALESCE(SUM(p.seconds),0) AS seconds,
            MAX(p.updated_at) AS last_active
     FROM tl_class_members m
     LEFT JOIN tl_progress p ON p.user_id = m.student_id
     WHERE m.class_id=$1 GROUP BY m.student_id`, [req.params.id]);
  res.json({ students: r.rows });
}));

teacherRouter.post('/classes/:id/assignments', requireRole('teacher', 'admin'), ah(async (req: AuthedRequest, res) => {
  if (!uuidSchema.safeParse(req.params.id).success) return res.status(400).json({ error: 'invalid_id' });
  const b = z.object({
    title: z.string().min(2).max(120),
    ayahKey: z.string().regex(/^\d{1,3}:\d{1,3}$/).optional(),
    makamId: z.string().max(40).optional(),
    speed: z.enum(['tahkik', 'tertil', 'tedvir', 'hadr']).optional(),
    dueAt: z.string().datetime().optional(),
    note: z.string().max(500).optional(),
  }).safeParse(req.body);
  if (!b.success) return res.status(400).json({ error: b.error.flatten() });
  const own = await q('SELECT 1 FROM tl_classes WHERE id=$1 AND teacher_id=$2', [req.params.id, req.user!.id]);
  if (!own.rows[0] && req.user!.role !== 'admin') return res.status(403).json({ error: 'forbidden' });
  const v = b.data;
  const r = await q(
    `INSERT INTO tl_assignments (class_id, title, ayah_key, makam_id, speed, due_at, note)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
    [req.params.id, v.title, v.ayahKey, v.makamId, v.speed, v.dueAt, v.note]);
  res.json(r.rows[0]);
}));

/** Öğrenci: Ödevi tamamlama gönderisi (Zero raw audio - sadece analiz/attempt ID) */
teacherRouter.post('/assignments/:id/submit', ah(async (req: AuthedRequest, res) => {
  if (!uuidSchema.safeParse(req.params.id).success) return res.status(400).json({ error: 'invalid_id' });
  const b = z.object({
    attemptId: z.string().uuid().optional(),
  }).safeParse(req.body);
  if (!b.success) return res.status(400).json({ error: b.error.flatten() });

  // Öğrencinin bu sınıfa üye olduğunu doğrula
  const memberCheck = await q(
    `SELECT a.id FROM tl_assignments a
     JOIN tl_class_members cm ON cm.class_id = a.class_id
     WHERE a.id = $1 AND cm.student_id = $2`,
    [req.params.id, req.user!.id]
  );
  if (!memberCheck.rows[0]) return res.status(403).json({ error: 'not_enrolled_in_class' });

  const r = await q(
    `INSERT INTO tl_submissions (assignment_id, student_id, attempt_id)
     VALUES ($1,$2,$3) RETURNING id, submitted_at`,
    [req.params.id, req.user!.id, b.data.attemptId ?? null]
  );
  res.json(r.rows[0]);
}));

/** Hoca: Sınıfın ödev teslimlerini listele */
teacherRouter.get('/classes/:id/submissions', requireRole('teacher', 'admin'), ah(async (req: AuthedRequest, res) => {
  if (!uuidSchema.safeParse(req.params.id).success) return res.status(400).json({ error: 'invalid_id' });
  const own = await q('SELECT 1 FROM tl_classes WHERE id=$1 AND teacher_id=$2', [req.params.id, req.user!.id]);
  if (!own.rows[0] && req.user!.role !== 'admin') return res.status(403).json({ error: 'forbidden' });

  const r = await q(
    `SELECT s.id, s.assignment_id, a.title AS assignment_title, s.student_id, s.attempt_id,
            s.teacher_comment, s.teacher_score, s.submitted_at, s.reviewed_at,
            att.pitch_score, att.align_accuracy, att.duration_ms
     FROM tl_submissions s
     JOIN tl_assignments a ON a.id = s.assignment_id
     LEFT JOIN tl_attempts att ON att.id = s.attempt_id
     WHERE a.class_id = $1 ORDER BY s.submitted_at DESC`,
    [req.params.id]
  );
  res.json({ submissions: r.rows });
}));

/** Hoca: Öğrenci tilavet teslimini puanla ve ilmî değerlendirme yaz (Fem-i Muhsin) */
teacherRouter.post('/submissions/:id/review', requireRole('teacher', 'admin'), ah(async (req: AuthedRequest, res) => {
  if (!uuidSchema.safeParse(req.params.id).success) return res.status(400).json({ error: 'invalid_id' });
  const b = z.object({
    score: z.number().int().min(0).max(100),
    comment: z.string().min(2).max(2000),
  }).safeParse(req.body);
  if (!b.success) return res.status(400).json({ error: b.error.flatten() });

  // Hocanın sınıfına ait teslim mi?
  const own = await q(
    `SELECT s.id FROM tl_submissions s
     JOIN tl_assignments a ON a.id = s.assignment_id
     JOIN tl_classes c ON c.id = a.class_id
     WHERE s.id = $1 AND (c.teacher_id = $2 OR $3 = 'admin')`,
    [req.params.id, req.user!.id, req.user!.role]
  );
  if (!own.rows[0]) return res.status(403).json({ error: 'forbidden' });

  await q(
    `UPDATE tl_submissions
     SET teacher_score = $1, teacher_comment = $2, reviewed_at = now()
     WHERE id = $3`,
    [b.data.score, b.data.comment, req.params.id]
  );
  res.json({ ok: true });
}));

