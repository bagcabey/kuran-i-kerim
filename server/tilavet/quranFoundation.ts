import { Router } from 'express';
import { cached } from './cache.js';
import { ah } from './http.js';

const AUTH_URL = process.env.QF_AUTH_URL || 'https://auth.quran.foundation/oauth2/token';
const API_BASE = process.env.QF_API_BASE || 'https://api.quran.foundation/content/api/v4';
const CLIENT_ID = process.env.QF_CLIENT_ID || '';
const CLIENT_SECRET = process.env.QF_CLIENT_SECRET || '';

let token: { value: string; exp: number } | null = null;

async function getToken(): Promise<string> {
  if (token && token.exp > Date.now() + 30_000) return token.value;
  if (!CLIENT_ID || !CLIENT_SECRET) throw new Error('qf_credentials_not_configured');
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const r = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials&scope=content'
  });
  if (!r.ok) throw new Error('qf_auth_failed ' + r.status);
  const j: any = await r.json();
  token = { value: j.access_token, exp: Date.now() + (j.expires_in ?? 3600) * 1000 };
  return token.value;
}

async function qf(path: string) {
  const t = await getToken();
  const r = await fetch(`${API_BASE}${path}`, { headers: { 'x-auth-token': t, 'x-client-id': CLIENT_ID } });
  if (!r.ok) throw new Error(`qf_${r.status}`);
  return r.json();
}

export const qfRouter = Router();

/** Sûre sesi + kelime zamanlaması: GET /api/tilavet/qf/chapter-audio?reciter=7&chapter=1 */
qfRouter.get('/chapter-audio', ah(async (req, res) => {
  const reciter = Number(req.query.reciter), chapter = Number(req.query.chapter);
  if (!(reciter > 0) || !(chapter >= 1 && chapter <= 114)) return res.status(400).json({ error: 'bad_params' });
  try {
    const data = await cached(`qf:ch:${reciter}:${chapter}`, 24 * 3600 * 1000,
      () => qf(`/chapter_recitations/${reciter}/${chapter}?segments=true`));
    res.json(data);
  } catch (e: any) { res.status(502).json({ error: e.message }); }
}));

qfRouter.get('/chapter-reciters', ah(async (_req, res) => {
  try { res.json(await cached('qf:chapter_reciters', 24 * 3600 * 1000, () => qf('/resources/chapter_reciters'))); }
  catch (e: any) { res.status(502).json({ error: e.message }); }
}));

