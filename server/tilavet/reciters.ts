import { Router } from 'express';
import { cached } from './cache.js';
import { ah } from './http.js';

const MP3Q = 'https://www.mp3quran.net/api/v3';
const DAY = 24 * 3600 * 1000;
export const recitersRouter = Router();

const pad3 = (n: number) => String(n).padStart(3, '0');

async function fetchJson(url: string) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 10000);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) throw new Error(`upstream ${r.status}`);
    return await r.json();
  } finally { clearTimeout(t); }
}

/** GET /api/tilavet/reciters?lang=tr */
recitersRouter.get('/', ah(async (req, res) => {
  const lang = String(req.query.lang || 'tr');
  try {
    const data = await cached(`mp3q:reciters:${lang}`, DAY, () => fetchJson(`${MP3Q}/reciters?language=${lang}`));
    const list = (data.reciters ?? []).map((r: any) => ({
      id: `mp3q-${r.id}`,
      name: { [lang]: r.name },
      externalIds: { mp3quran: r.id },
      moshafs: (r.moshaf ?? []).map((m: any) => ({
        id: m.id, name: m.name, server: m.server,
        surahList: String(m.surah_list || '').split(',').filter(Boolean).map(Number)
      }))
    }));
    res.json({ reciters: list });
  } catch (e: any) {
    res.status(502).json({ error: 'upstream_failed', detail: e.message });
  }
}));

/** GET /api/tilavet/reciters/audio?server=...&surah=1  →  { url } (server alanı yalnızca *.mp3quran.net olabilir) */
recitersRouter.get('/audio', ah(async (req, res) => {
  const server = String(req.query.server || '');
  const surah = Number(req.query.surah);
  let host = '';
  try { host = new URL(server).hostname; } catch {}
  if (!/(^|\.)mp3quran\.net$/.test(host)) return res.status(400).json({ error: 'bad_server' });
  if (!(surah >= 1 && surah <= 114)) return res.status(400).json({ error: 'bad_surah' });
  res.json({ url: `${server.replace(/\/?$/, '/')}${pad3(surah)}.mp3` });
}));

