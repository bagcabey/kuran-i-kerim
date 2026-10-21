import { Router } from 'express';
import { z } from 'zod';
import { q } from './db.js';
import { requireAuth, AuthedRequest } from './auth.js';
import { ah } from './http.js';
import { review, newCard } from '../../src/tilavet/core/learning/srs.js';

export const srsRouter = Router();
srsRouter.use(requireAuth);

srsRouter.get('/due', ah(async (req: AuthedRequest, res) => {
  const r = await q(`SELECT card_id AS id, ease, interval, reps, lapses, due FROM tl_srs_cards
                     WHERE user_id=$1 AND due <= now() ORDER BY due ASC LIMIT 50`, [req.user!.id]);
  res.json({ cards: r.rows });
}));

srsRouter.post('/review', ah(async (req: AuthedRequest, res) => {
  const b = z.object({ cardId: z.string().max(100), quality: z.number().int().min(0).max(5) }).safeParse(req.body);
  if (!b.success) return res.status(400).json({ error: b.error.flatten() });
  const uid = req.user!.id;
  const cur = await q('SELECT card_id AS id, ease, interval, reps, lapses, due FROM tl_srs_cards WHERE user_id=$1 AND card_id=$2', [uid, b.data.cardId]);
  const card = cur.rows[0] ?? newCard(b.data.cardId);
  const next = review(card, b.data.quality as any);
  await q(
    `INSERT INTO tl_srs_cards (user_id, card_id, ease, interval, reps, lapses, due, last_reviewed)
     VALUES ($1,$2,$3,$4,$5,$6,$7,now())
     ON CONFLICT (user_id, card_id) DO UPDATE SET ease=$3, interval=$4, reps=$5, lapses=$6, due=$7, last_reviewed=now()`,
    [uid, next.id, next.ease, next.interval, next.reps, next.lapses, next.due]
  );
  res.json({ next });
}));

/** Ders bitince ilgili kartları kuyruğa ekle */
srsRouter.post('/seed', ah(async (req: AuthedRequest, res) => {
  const b = z.object({ cardIds: z.array(z.string().max(100)).max(100) }).safeParse(req.body);
  if (!b.success) return res.status(400).json({ error: b.error.flatten() });
  for (const id of b.data.cardIds)
    await q(`INSERT INTO tl_srs_cards (user_id, card_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [req.user!.id, id]);
  res.json({ ok: true });
}));
