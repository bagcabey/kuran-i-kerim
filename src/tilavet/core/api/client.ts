const BASE = '/api/tilavet';

export interface ReciterCatalogMoshaf {
  id: number;
  name: string;
  server: string;
  surahList: number[];
}

export interface ReciterCatalogEntry {
  id: string;
  name: Record<string, string>;
  externalIds: { mp3quran: number };
  moshafs: ReciterCatalogMoshaf[];
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(BASE + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!r.ok) throw new Error(`API ${r.status}: ${await r.text().catch(() => '')}`);
  return r.json();
}

export const api = {
  reciters: (lang = 'tr') => req<{ reciters: ReciterCatalogEntry[] }>(`/reciters?lang=${lang}`),
  reciterAudio: (server: string, surah: number) =>
    req<{ url: string }>(`/reciters/audio?server=${encodeURIComponent(server)}&surah=${surah}`),
  chapterAudio: (reciter: number, chapter: number) => req<any>(`/qf/chapter-audio?reciter=${reciter}&chapter=${chapter}`),
  progress: () => req<any>('/progress'),
  saveLesson: (b: { lessonId: string; status: string; score?: number; secondsSpent?: number }) =>
    req('/progress/lesson', { method: 'PUT', body: JSON.stringify(b) }),
  saveSettings: (b: any) => req('/progress/settings', { method: 'PUT', body: JSON.stringify(b) }),
  srsDue: () => req<{ cards: any[] }>('/srs/due'),
  srsReview: (cardId: string, quality: number) => req('/srs/review', { method: 'POST', body: JSON.stringify({ cardId, quality }) }),
  srsSeed: (cardIds: string[]) => req('/srs/seed', { method: 'POST', body: JSON.stringify({ cardIds }) }),
  saveAttempt: (b: any) => req<{ id: string }>('/attempts', { method: 'POST', body: JSON.stringify(b) }),
  deleteAll: () => req('/progress/all', { method: 'DELETE' }),
};
