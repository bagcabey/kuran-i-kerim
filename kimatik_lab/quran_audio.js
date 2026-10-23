/* =========================================================================
   QURAN AUDIO — tüm Kur'an için metin, kelime zamanlaması ve kısa örnek çalar
   Kaynak: Quran.com API v4 (114 sûre, 6236 âyet; 12 kâri için kelime zamanları)
   Bu dosya yalnız veri okur ve ses çalar; hiçbir şeyi kaydetmez.
   ========================================================================= */
(function () {
  'use strict';

  const API = 'https://api.quran.com/api/v4';
  const TR_TRANSLATION = 77; // Diyanet İşleri meali

  // Kelime zamanlaması olan kâriler (Quran.com recitation id)
  const RECITERS = [
    { id: 6,  name: 'Mahmûd Halîl el-Husarî', style: 'Murattal' },
    { id: 12, name: 'Mahmûd Halîl el-Husarî', style: 'Muallim (öğretici)' },
    { id: 9,  name: 'Muhammed Sıddîk el-Minşâvî', style: 'Murattal' },
    { id: 8,  name: 'Muhammed Sıddîk el-Minşâvî', style: 'Mücevved' },
    { id: 2,  name: 'Abdulbâsıt Abdussamed', style: 'Murattal' },
    { id: 1,  name: 'Abdulbâsıt Abdussamed', style: 'Mücevved' },
    { id: 11, name: 'Muhammed et-Tablâvî', style: 'Murattal' },
    { id: 7,  name: 'Meşârî Râşid el-Afâsî', style: 'Murattal' },
    { id: 3,  name: 'Abdurrahman es-Sudeys', style: 'Murattal' },
    { id: 10, name: 'Suûd eş-Şureym', style: 'Murattal' },
    { id: 4,  name: 'Ebû Bekir eş-Şâtırî', style: 'Murattal' },
    { id: 5,  name: 'Hânî er-Rifâî', style: 'Murattal' }
  ];

  const RECITER_KEY = 'tilavet_example_reciter';
  function getDefaultReciter() {
    try {
      const v = parseInt(localStorage.getItem(RECITER_KEY), 10);
      if (RECITERS.some(r => r.id === v)) return v;
    } catch (_) {}
    return 6;
  }
  function setDefaultReciter(id) {
    if (!RECITERS.some(r => r.id === id)) return;
    try { localStorage.setItem(RECITER_KEY, String(id)); } catch (_) {}
  }

  const cache = new Map();
  function cached(key, loader) {
    if (!cache.has(key)) {
      const p = loader().catch(err => { cache.delete(key); throw err; });
      cache.set(key, p);
    }
    return cache.get(key);
  }
  async function getJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
  function absoluteAudioUrl(url) {
    if (!url) return '';
    if (url.startsWith('//')) return 'https:' + url;
    if (/^https?:/i.test(url)) return url;
    return 'https://verses.quran.com/' + url.replace(/^\//, '');
  }

  function getChapters() {
    return cached('chapters', async () => {
      const data = await getJSON(`${API}/chapters?language=tr`);
      return data.chapters.map(c => ({
        id: c.id,
        name: c.name_simple,
        nameAr: c.name_arabic,
        meaning: c.translated_name?.name || '',
        verses: c.verses_count
      }));
    });
  }

  // Âyet metni (kelime kelime) + Diyanet meali
  function getVerse(key) {
    return cached('verse:' + key, async () => {
      const data = await getJSON(`${API}/verses/by_key/${key}?words=true&word_fields=text_uthmani&translations=${TR_TRANSLATION}&fields=text_uthmani`);
      const v = data.verse;
      const words = v.words.filter(w => w.char_type_name === 'word').map(w => ({
        pos: w.position,
        text: w.text_uthmani,
        translit: w.transliteration?.text || ''
      }));
      const meal = (v.translations && v.translations[0] && v.translations[0].text || '').replace(/<[^>]+>/g, '').replace(/\s+\d+$/, '');
      return { key: v.verse_key, text: v.text_uthmani, words, meal };
    });
  }

  // Kârinin âyet kaydı + kelime zamanları [kelimeSırası, başlangıçMs, bitişMs]
  function getRecitation(reciterId, key) {
    return cached(`rec:${reciterId}:${key}`, async () => {
      const data = await getJSON(`${API}/recitations/${reciterId}/by_ayah/${key}?fields=segments`);
      const f = data.audio_files && data.audio_files[0];
      if (!f) throw new Error('Kayıt bulunamadı');
      const segments = (f.segments || [])
        .filter(s => Array.isArray(s) && s.length >= 4)
        .map(s => ({ pos: s[1], start: s[2], end: s[3] }));
      return { url: absoluteAudioUrl(f.url), segments };
    });
  }

  // Ses dosyasını indirip 16 kHz mono'ya çevirir (analiz için)
  function decodeTo16k(url) {
    return cached('pcm:' + url, async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.arrayBuffer();
      return decodeBufferTo16k(buf);
    });
  }
  async function decodeBufferTo16k(arrayBuffer) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const tmp = new Ctx();
    let decoded;
    try {
      decoded = await tmp.decodeAudioData(arrayBuffer.slice(0));
    } finally {
      tmp.close && tmp.close();
    }
    return resampleTo16k(decoded);
  }
  async function resampleTo16k(audioBuffer) {
    const SR = 16000;
    const length = Math.max(1, Math.ceil(audioBuffer.duration * SR));
    const off = new OfflineAudioContext(1, length, SR);
    const src = off.createBufferSource();
    src.buffer = audioBuffer;
    src.connect(off.destination);
    src.start();
    const rendered = await off.startRendering();
    return { sampleRate: SR, data: rendered.getChannelData(0) };
  }

  // ----- Kısa örnek çalar: âyetin yalnız istenen kelimeleri -----
  let player = null;
  let playerButton = null;
  let stopTimer = null;
  function setButton(btn, playing) {
    if (!btn) return;
    btn.classList.toggle('is-playing', playing);
    btn.setAttribute('aria-pressed', String(playing));
  }
  let chainToken = 0;
  function stop() {
    chainToken++;
    if (stopTimer) { clearInterval(stopTimer); stopTimer = null; }
    if (player) { try { player.pause(); } catch (_) {} player = null; }
    if (playerButton) { setButton(playerButton, false); playerButton = null; }
  }
  /**
   * playClip({ key:'2:255', from:3, to:5, reciter:6, button, pad })
   * from/to: kelime sırası (1'den başlar). Verilmezse âyetin tamamı çalınır.
   * pad: kelime çevresinde kaç kelime daha çalınsın (varsayılan 0).
   */
  async function playClip(opts) {
    const { key, button } = opts;
    const reciter = opts.reciter || getDefaultReciter();
    if (button && button === playerButton) { stop(); return; }
    stop();
    if (window.TilavetAudioManager && typeof window.TilavetAudioManager.notifyPlay === 'function') {
      window.TilavetAudioManager.notifyPlay('quran-clip');
    }
    playerButton = button || null;
    setButton(playerButton, true);
    let rec;
    try {
      rec = await getRecitation(reciter, key);
    } catch (err) {
      setButton(playerButton, false); playerButton = null;
      throw err;
    }
    if (button && playerButton !== button) return; // bu arada başka bir şey çalındı
    let startMs = 0;
    let endMs = null;
    if (opts.from) {
      const pad = opts.pad || 0;
      const from = Math.max(1, opts.from - pad);
      const to = (opts.to || opts.from) + pad;
      const segs = rec.segments.filter(s => s.pos >= from && s.pos <= to);
      if (segs.length) {
        startMs = Math.max(0, Math.min(...segs.map(s => s.start)) - 120);
        const lastPos = Math.max(...rec.segments.map(s => s.pos));
        const maxEnd = Math.max(...segs.map(s => s.end));
        endMs = to >= lastPos ? null : maxEnd + 250;
      }
    }
    // continue: kelimeden/âyetten başlayıp sonraki âyetlerle sûre sonuna kadar sürer; düğmeye yeniden basınca durur
    if (opts.continue) { playChain(key, reciter, startMs, button, opts.onEnd); return; }
    const audio = new Audio(rec.url);
    player = audio;
    const finish = () => { if (player === audio) stop(); if (typeof opts.onEnd === 'function') opts.onEnd(); };
    audio.addEventListener('ended', finish);
    audio.addEventListener('error', finish);
    const begin = () => {
      if (startMs > 0) { try { audio.currentTime = startMs / 1000; } catch (_) {} }
      audio.play().catch(finish);
    };
    if (audio.readyState >= 1) begin(); else audio.addEventListener('loadedmetadata', begin, { once: true });
    if (endMs) {
      stopTimer = setInterval(() => {
        if (player !== audio) return;
        if (audio.currentTime * 1000 >= endMs) finish();
      }, 30);
    }
  }

  async function playChain(key, reciter, startMs, button, onEnd) {
    const token = chainToken;
    const [s, a0] = key.split(':').map(Number);
    let total = 286;
    try { const ch = (await getChapters()).find(c => c.id === s); if (ch) total = ch.verses; } catch (_) {}
    let a = a0;
    let offset = startMs;
    const end = () => { if (token === chainToken) stop(); if (typeof onEnd === 'function') onEnd(); };
    while (token === chainToken && a <= total) {
      let rec;
      try { rec = await getRecitation(reciter, `${s}:${a}`); } catch (_) { break; }
      if (token !== chainToken) return;
      if (a < total) getRecitation(reciter, `${s}:${a + 1}`).then(r => { const p = new Audio(); p.preload = 'auto'; p.src = r.url; }).catch(() => {});
      if (button) button.setAttribute('title', `${s}:${a} okunuyor · durdurmak için yeniden basın`);
      const ok = await new Promise(resolve => {
        const audio = new Audio(rec.url);
        player = audio;
        audio.addEventListener('ended', () => resolve(true));
        audio.addEventListener('error', () => resolve(false));
        audio.addEventListener('pause', () => { if (!audio.ended) resolve(false); });
        const begin = () => {
          if (offset > 0) { try { audio.currentTime = offset / 1000; } catch (_) {} }
          audio.play().catch(() => resolve(false));
        };
        if (audio.readyState >= 1) begin(); else audio.addEventListener('loadedmetadata', begin, { once: true });
      });
      offset = 0;
      if (!ok || token !== chainToken) break;
      a++;
    }
    if (button) button.removeAttribute('title');
    end();
  }

  if (window.TilavetAudioManager && typeof window.TilavetAudioManager.register === 'function') {
    window.TilavetAudioManager.register('quran-clip', { stop, category: 'akademi' });
  }

  // Sayfadaki her [data-clip-key] düğmesi: data-clip-from / data-clip-to / data-clip-reciter
  document.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-clip-key]');
    if (!btn) return;
    event.preventDefault();
    event.stopPropagation();
    playClip({
      key: btn.getAttribute('data-clip-key'),
      from: parseInt(btn.getAttribute('data-clip-from'), 10) || null,
      to: parseInt(btn.getAttribute('data-clip-to'), 10) || null,
      reciter: parseInt(btn.getAttribute('data-clip-reciter'), 10) || null,
      continue: btn.hasAttribute('data-clip-continue'),
      button: btn
    }).catch(() => {
      btn.classList.add('is-error');
      btn.setAttribute('title', 'Kayıt şu an açılamadı');
    });
  });

  window.QuranAudio = {
    RECITERS,
    getDefaultReciter,
    setDefaultReciter,
    getChapters,
    getVerse,
    getRecitation,
    decodeTo16k,
    decodeBufferTo16k,
    resampleTo16k,
    playClip,
    stop
  };
})();
