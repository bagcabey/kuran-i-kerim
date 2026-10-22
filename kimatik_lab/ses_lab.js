/* =========================================================================
   SES LABORATUVARI v5
   - Perde takibi: YIN (de Cheveigné & Kawahara 2002), 8 kHz, 10 ms adım
   - Temizleme: oktav düzeltme, medyan süzgeç, kısa adacık silme
   - Karşılaştırma: Sakoe-Chiba bantlı DTW, cent cinsinden göreli seyir
   - Tüm Kur'an: Quran.com kelime zamanları ile her âyet, 12 kâri
   - Elif ölçer: canlı ses süresi → elif miktarı (8 kare)
   - Spektrum: Hann pencereli FFT (AnalyserNode), log frekans bantları
   Ses hiçbir yere gönderilmez; analiz tarayıcıda yapılır.
   ========================================================================= */
(function () {
  'use strict';

  const KOMA = 1200 / 53; // 1 Holder koması ≈ 22.64 cent

  // ======================================================================
  // 1. DSP
  // ======================================================================
  const DSP = {};

  // 16 kHz → 8 kHz (3 dokulu alçak geçiren + seyreltme)
  DSP.decimate2 = function (x) {
    const n = Math.floor(x.length / 2);
    const y = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const j = 2 * i;
      const a = x[j - 1] || 0, b = x[j], c = x[j + 1] || 0;
      y[i] = 0.25 * a + 0.5 * b + 0.25 * c;
    }
    return y;
  };

  // YIN: tek çerçeve. d: önceden ayrılmış Float32Array(tauMax + 2)
  DSP.yinFrame = function (x, off, W, sr, tauMin, tauMax, d) {
    d[0] = 1;
    let running = 0;
    for (let tau = 1; tau <= tauMax; tau++) {
      let s = 0;
      for (let j = 0; j < W; j++) {
        const v = x[off + j] - x[off + j + tau];
        s += v * v;
      }
      running += s;
      d[tau] = running > 0 ? (s * tau) / running : 1;
    }
    let tau = -1;
    for (let t = tauMin; t <= tauMax; t++) {
      if (d[t] < 0.15) {
        while (t + 1 <= tauMax && d[t + 1] < d[t]) t++;
        tau = t;
        break;
      }
    }
    if (tau < 0) {
      let m = Infinity;
      for (let t = tauMin; t <= tauMax; t++) if (d[t] < m) { m = d[t]; tau = t; }
    }
    if (tau <= 0) return { f0: 0, ap: 1 };
    const a = d[tau - 1], b = d[tau], c = tau + 1 <= tauMax ? d[tau + 1] : b;
    const den = a - 2 * b + c;
    const shift = den !== 0 ? Math.max(-1, Math.min(1, (0.5 * (a - c)) / den)) : 0;
    return { f0: sr / (tau + shift), ap: b };
  };

  DSP.rms = function (x, off, W) {
    let s = 0;
    for (let j = 0; j < W; j++) { const v = x[off + j] || 0; s += v * v; }
    return Math.sqrt(s / W);
  };
  DSP.db = v => 20 * Math.log10(Math.max(v, 1e-9));

  // Tüm sinyalin perde izini çıkarır (asenkron, arayüzü kilitlemez)
  DSP.track = async function (pcm16k, opts = {}) {
    const fmin = opts.fmin || 65, fmax = opts.fmax || 600;
    const x = DSP.decimate2(pcm16k);
    const sr = 8000, W = 256, hop = 80; // 32 ms pencere, 10 ms adım
    const tauMin = Math.floor(sr / fmax), tauMax = Math.ceil(sr / fmin);
    const d = new Float32Array(tauMax + 2);
    const frames = Math.max(0, Math.floor((x.length - W - tauMax - 1) / hop));
    const hz = new Float32Array(frames), ap = new Float32Array(frames), rmsDb = new Float32Array(frames);
    let maxDb = -120;
    for (let i = 0; i < frames; i++) {
      const off = i * hop;
      const r = DSP.db(DSP.rms(x, off, W));
      rmsDb[i] = r;
      if (r > maxDb) maxDb = r;
      const res = DSP.yinFrame(x, off, W, sr, tauMin, tauMax, d);
      hz[i] = res.f0; ap[i] = res.ap;
      if (i % 400 === 399) {
        if (opts.onProgress) opts.onProgress(i / frames);
        await new Promise(r2 => setTimeout(r2, 0));
      }
    }
    // Sesli çerçeve kararı: periyodik + yeterince güçlü
    const floor = Math.max(maxDb - 32, -58);
    for (let i = 0; i < frames; i++) {
      const voiced = ap[i] < 0.25 && rmsDb[i] > floor && hz[i] >= fmin && hz[i] <= fmax;
      if (!voiced) hz[i] = 0;
    }
    DSP.cleanup(hz);
    return { hop: 0.01, hz, rmsDb, maxDb, duration: frames * 0.01 };
  };

  // Oktav sıçraması düzeltme + medyan süzgeç + kısa adacıkları silme
  DSP.cleanup = function (hz) {
    const n = hz.length;
    const cents = new Float32Array(n);
    for (let i = 0; i < n; i++) cents[i] = hz[i] > 0 ? 1200 * Math.log2(hz[i] / 55) : NaN;
    // 1) yerel medyana göre oktav düzeltme (±25 çerçeve)
    const R = 25;
    const fixed = new Float32Array(cents);
    for (let i = 0; i < n; i++) {
      if (isNaN(cents[i])) continue;
      const win = [];
      for (let k = Math.max(0, i - R); k <= Math.min(n - 1, i + R); k++) if (!isNaN(cents[k])) win.push(cents[k]);
      if (win.length < 5) continue;
      win.sort((a, b) => a - b);
      const med = win[win.length >> 1];
      const diff = cents[i] - med;
      if (Math.abs(diff) > 700) fixed[i] = cents[i] - 1200 * Math.round(diff / 1200);
    }
    // 2) 5'li medyan süzgeç (yalnız sesli komşularla)
    const smooth = new Float32Array(fixed);
    for (let i = 0; i < n; i++) {
      if (isNaN(fixed[i])) continue;
      const w = [];
      for (let k = i - 2; k <= i + 2; k++) if (k >= 0 && k < n && !isNaN(fixed[k])) w.push(fixed[k]);
      w.sort((a, b) => a - b);
      smooth[i] = w[w.length >> 1];
    }
    // 3) 60 ms'den kısa sesli adacıkları sil
    let i = 0;
    while (i < n) {
      if (isNaN(smooth[i])) { i++; continue; }
      let j = i;
      while (j < n && !isNaN(smooth[j])) j++;
      if (j - i < 6) for (let k = i; k < j; k++) smooth[k] = NaN;
      i = j;
    }
    for (let k = 0; k < n; k++) hz[k] = isNaN(smooth[k]) ? 0 : 55 * Math.pow(2, smooth[k] / 1200);
    return hz;
  };

  // Karar (durak) tahmini: son %25'teki sesli çerçevelerin 20 cent'lik histogram tepesi
  DSP.estimateKarar = function (hz) {
    const voiced = [];
    for (let i = 0; i < hz.length; i++) if (hz[i] > 0) voiced.push(i);
    if (voiced.length < 10) return 0;
    const tail = voiced.slice(Math.floor(voiced.length * 0.75));
    const bins = new Map();
    tail.forEach(i => {
      const c = 1200 * Math.log2(hz[i] / 55);
      const b = Math.round(c / 20);
      bins.set(b, (bins.get(b) || 0) + 1);
    });
    let best = 0, bestCount = -1;
    bins.forEach((cnt, b) => {
      const s = cnt + 0.5 * ((bins.get(b - 1) || 0) + (bins.get(b + 1) || 0));
      if (s > bestCount) { bestCount = s; best = b; }
    });
    const center = best * 20;
    const near = tail.map(i => 1200 * Math.log2(hz[i] / 55)).filter(c => Math.abs(c - center) <= 50);
    const mean = near.reduce((a, b) => a + b, 0) / Math.max(1, near.length);
    return 55 * Math.pow(2, mean / 1200);
  };

  // Sesli çerçeveler → {t, c} (karar'a göre cent), en fazla maxPts nokta
  DSP.voicedSeries = function (track, kararHz, maxPts = 1600) {
    const t = [], c = [];
    const hz = track.hz;
    for (let i = 0; i < hz.length; i++) {
      if (hz[i] > 0) { t.push(i * track.hop); c.push(1200 * Math.log2(hz[i] / kararHz)); }
    }
    const step = Math.max(1, Math.ceil(t.length / maxPts));
    if (step === 1) return { t, c };
    const t2 = [], c2 = [];
    for (let i = 0; i < t.length; i += step) { t2.push(t[i]); c2.push(c[i]); }
    return { t: t2, c: c2 };
  };

  // Bantlı DTW (Sakoe-Chiba). Dönüş: [[i, j], ...]
  DSP.dtw = function (a, b) {
    const n = a.length, m = b.length;
    if (!n || !m) return [];
    const band = Math.max(25, Math.round(0.2 * Math.max(n, m)));
    const width = 2 * band + 1;
    const INF = 1e12;
    const D = new Float64Array(n * width).fill(INF);
    const center = i => Math.round((i * (m - 1)) / Math.max(1, n - 1));
    const idx = (i, j) => { const k = j - center(i) + band; return (k < 0 || k >= width) ? -1 : i * width + k; };
    const cost = (i, j) => Math.min(800, Math.abs(a[i] - b[j]));
    for (let i = 0; i < n; i++) {
      const c0 = center(i);
      for (let j = Math.max(0, c0 - band); j <= Math.min(m - 1, c0 + band); j++) {
        const k = idx(i, j);
        let best;
        if (i === 0 && j === 0) best = 0;
        else {
          best = INF;
          const p1 = i > 0 ? idx(i - 1, j) : -1;
          const p2 = j > 0 ? idx(i, j - 1) : -1;
          const p3 = i > 0 && j > 0 ? idx(i - 1, j - 1) : -1;
          if (p1 >= 0) best = Math.min(best, D[p1] + 1);   // küçük ceza: düz yolu yeğle
          if (p2 >= 0) best = Math.min(best, D[p2] + 1);
          if (p3 >= 0) best = Math.min(best, D[p3]);
        }
        D[k] = best + cost(i, j);
      }
    }
    // geri izleme
    const path = [];
    let i = n - 1, j = m - 1;
    if (idx(i, j) < 0 || D[idx(i, j)] >= INF) return [];
    while (i > 0 || j > 0) {
      path.push([i, j]);
      const c1 = i > 0 && j > 0 && idx(i - 1, j - 1) >= 0 ? D[idx(i - 1, j - 1)] : INF;
      const c2 = i > 0 && idx(i - 1, j) >= 0 ? D[idx(i - 1, j)] : INF;
      const c3 = j > 0 && idx(i, j - 1) >= 0 ? D[idx(i, j - 1)] : INF;
      if (c1 <= c2 && c1 <= c3) { i--; j--; } else if (c2 <= c3) i--; else j--;
    }
    path.push([0, 0]);
    return path.reverse();
  };

  DSP.median = arr => { if (!arr.length) return 0; const s = [...arr].sort((x, y) => x - y); return s[s.length >> 1]; };

  // Referans ile kullanıcı kaydını karşılaştırır
  DSP.compare = function (refS, usrS, refDurVoiced, usrDurVoiced) {
    const path = DSP.dtw(refS.c, usrS.c);
    if (path.length < 10) return null;
    const diffs = path.map(([i, j]) => usrS.c[j] - refS.c[i]);
    const absd = diffs.map(Math.abs);
    const within = absd.filter(v => v <= 2 * KOMA).length / absd.length;
    const medDev = DSP.median(absd);
    // Seyir: hizalanmış eğimlerin korelasyonu (0.15 s'lik farklar)
    const lag = 8;
    const da = [], db = [];
    for (let k = lag; k < path.length; k++) {
      const [i1, j1] = path[k - lag], [i2, j2] = path[k];
      da.push(refS.c[i2] - refS.c[i1]); db.push(usrS.c[j2] - usrS.c[j1]);
    }
    const mean = v => v.reduce((x, y) => x + y, 0) / Math.max(1, v.length);
    const ma = mean(da), mb = mean(db);
    let num = 0, va = 0, vb = 0;
    for (let k = 0; k < da.length; k++) { const x = da[k] - ma, y = db[k] - mb; num += x * y; va += x * x; vb += y * y; }
    const corr = va > 0 && vb > 0 ? num / Math.sqrt(va * vb) : 0;
    const tempoRatio = usrDurVoiced / Math.max(0.01, refDurVoiced);
    const tempoScore = 100 * Math.exp(-2.2 * Math.abs(Math.log(tempoRatio)));
    // Kullanıcıyı referans zamanına taşı (çizim için)
    const mapped = new Array(refS.c.length).fill(null);
    const acc = new Map();
    path.forEach(([i, j]) => { const e = acc.get(i) || [0, 0]; e[0] += usrS.c[j]; e[1]++; acc.set(i, e); });
    acc.forEach((e, i) => { mapped[i] = e[0] / e[1]; });
    const pitchScore = Math.round(within * 100);
    const contourScore = Math.round(Math.max(0, corr) * 100);
    const score = Math.round(0.5 * pitchScore + 0.3 * contourScore + 0.2 * tempoScore);
    return { path, mapped, pitchScore, contourScore, tempoScore: Math.round(tempoScore), tempoRatio, medDev, score };
  };

  // ======================================================================
  // 2. Ortak yardımcılar: mikrofon, renkler, kayıt
  // ======================================================================
  let micState = null;
  async function openMic() {
    if (micState) return micState;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('Tarayıcı mikrofonu desteklemiyor');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    if (ctx.state === 'suspended') await ctx.resume();
    const source = ctx.createMediaStreamSource(stream);
    micState = { ctx, stream, source, nodes: [] };
    return micState;
  }
  function closeMic() {
    if (!micState) return;
    try { micState.nodes.forEach(n => n.disconnect()); } catch (_) {}
    try { micState.stream.getTracks().forEach(t => t.stop()); } catch (_) {}
    try { micState.ctx.close(); } catch (_) {}
    micState = null;
  }
  // Canlı çerçeve işleyici: her ~43 ms'de onFrame(samples, sr)
  function attachFrameProcessor(mic, onFrame, bufferSize = 2048) {
    const proc = mic.ctx.createScriptProcessor(bufferSize, 1, 1);
    const sink = mic.ctx.createGain();
    sink.gain.value = 0;
    proc.onaudioprocess = (e) => onFrame(e.inputBuffer.getChannelData(0), mic.ctx.sampleRate);
    mic.source.connect(proc);
    proc.connect(sink);
    sink.connect(mic.ctx.destination);
    mic.nodes.push(proc, sink);
    return proc;
  }
  // Canlı perde (yerel örnekleme hızında)
  function makeLivePitch(sr, fmin = 65, fmax = 700) {
    const W = Math.round(sr * 0.032);
    const tauMin = Math.floor(sr / fmax), tauMax = Math.ceil(sr / fmin);
    const need = W + tauMax + 2;
    const ring = new Float32Array(need);
    const d = new Float32Array(tauMax + 2);
    // Hesap yükünü azaltmak için 2:1 seyreltilmiş kopya
    const sr2 = sr / 2, W2 = W >> 1, tauMin2 = Math.floor(sr2 / fmax), tauMax2 = Math.ceil(sr2 / fmin);
    const x2 = new Float32Array((need >> 1) + 2);
    const d2 = new Float32Array(tauMax2 + 2);
    return function (chunk) {
      // halka tampona ekle
      if (chunk.length >= need) ring.set(chunk.subarray(chunk.length - need));
      else { ring.copyWithin(0, chunk.length); ring.set(chunk, need - chunk.length); }
      for (let i = 0; i < x2.length; i++) { const j = 2 * i; x2[i] = 0.25 * (ring[j - 1] || 0) + 0.5 * (ring[j] || 0) + 0.25 * (ring[j + 1] || 0); }
      const rmsDb = DSP.db(DSP.rms(ring, need - W, W));
      const res = DSP.yinFrame(x2, 0, W2, sr2, tauMin2, tauMax2, d2);
      return { f0: res.f0, ap: res.ap, rmsDb };
    };
  }
  function cssVar(name, fallback) {
    const v = getComputedStyle(document.body).getPropertyValue(name).trim();
    return v || fallback;
  }
  function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
  function fmtSec(s) { return `${s.toFixed(1)} sn`; }

  // ======================================================================
  // 3. Arayüz
  // ======================================================================
  const STATIONS = [
    { id: 'kurra', label: 'Kâri ile karşılaştır' },
    { id: 'medd', label: 'Elif ölçer' },
    { id: 'tuner', label: 'Perde ve karar' },
    { id: 'spectrum', label: 'Ses spektrumu' }
  ];

  let root = null;
  let options = {};
  let current = 'kurra';
  let cleanupFns = [];
  function runCleanup() { cleanupFns.splice(0).forEach(fn => { try { fn(); } catch (_) {} }); closeMic(); if (window.QuranAudio) window.QuranAudio.stop(); }

  function mount(container, opts = {}) {
    runCleanup();
    root = container;
    options = opts;
    current = STATIONS.some(s => s.id === opts.station) ? opts.station : 'kurra';
    render();
  }
  function render() {
    runCleanup();
    root.innerHTML = `
      <div class="sl-wrap">
        <header class="sl-head">
          <div>
            <span class="sl-eyebrow">Ses laboratuvarı</span>
            <h2 class="sl-title">Okuyuşunuzu ölçün</h2>
            <p class="sl-lead">Ses yalnız bu cihazda işlenir, hiçbir yere gönderilmez. Ölçümler kulağınızı geliştirmek içindir; hocanın değerlendirmesinin yerini tutmaz.</p>
          </div>
        </header>
        <div class="sl-tabs" role="tablist">
          ${STATIONS.map(s => `<button type="button" role="tab" class="sl-tab ${s.id === current ? 'active' : ''}" aria-selected="${s.id === current}" data-sl-station="${s.id}">${s.label}</button>`).join('')}
        </div>
        <div class="sl-station" id="slStation"></div>
      </div>`;
    root.querySelectorAll('[data-sl-station]').forEach(btn => btn.addEventListener('click', () => {
      current = btn.getAttribute('data-sl-station');
      if (options.onStation) options.onStation(current);
      render();
    }));
    const host = root.querySelector('#slStation');
    if (current === 'kurra') Kurra(host);
    else if (current === 'medd') Medd(host);
    else if (current === 'tuner') Tuner(host);
    else Spectrum(host);
  }

  // ----------------------------------------------------------------------
  // 3.1 Kâri ile karşılaştırma (tüm Kur'an)
  // ----------------------------------------------------------------------
  const kurraState = { surah: 1, ayah: 1, reciter: 6 };
  function Kurra(host) {
    const QA = window.QuranAudio;
    host.innerHTML = `
      <section class="sl-card">
        <div class="sl-picker">
          <label class="sl-field"><span>Sûre</span><select id="slSurah"><option>Yükleniyor…</option></select></label>
          <label class="sl-field sl-field-sm"><span>Âyet</span><select id="slAyah"></select></label>
          <label class="sl-field"><span>Kâri</span><select id="slReciter">${QA.RECITERS.map(r => `<option value="${r.id}" ${r.id === kurraState.reciter ? 'selected' : ''}>${esc(r.name)} · ${esc(r.style)}</option>`).join('')}</select></label>
          <button type="button" class="sl-btn sl-btn-ghost" id="slOpenMushaf">Mushaf'ta aç</button>
        </div>

        <div class="sl-ayah" id="slAyahBox">
          <div class="sl-ayah-words" id="slWords" dir="rtl" lang="ar"></div>
          <p class="sl-ayah-meal" id="slMeal"></p>
          <button type="button" class="sl-link" id="slFocus">Metni büyüt</button>
        </div>

        <div class="sl-controls">
          <button type="button" class="sl-btn sl-btn-primary" id="slPlayRef" disabled><span class="sl-ico-play"></span>Kâriyi dinle</button>
          <button type="button" class="sl-btn sl-btn-record" id="slRecord" disabled><span class="sl-ico-rec"></span>Kaydet ve karşılaştır</button>
          <span class="sl-status" id="slStatus" role="status">Âyet yükleniyor…</span>
        </div>

        <div class="sl-chart">
          <div class="sl-legend">
            <span><i class="sl-dot ref"></i>Kâri</span>
            <span><i class="sl-dot usr"></i>Siz</span>
            <span><i class="sl-band"></i>±2 koma tolerans</span>
          </div>
          <canvas id="slCanvas" height="300"></canvas>
          <p class="sl-chart-note" id="slChartNote">Eğri, sesin karar perdesine göre ne kadar yukarıda ya da aşağıda olduğunu gösterir (100 cent ≈ 4,4 koma). Kendi sesinizin tonu farklı olsa da seyir karşılaştırılır.</p>
        </div>

        <div class="sl-results" id="slResults" hidden></div>

        <details class="sl-guide">
          <summary>Nasıl kullanılır?</summary>
          <ol>
            <li>Sûre, âyet ve kâriyi seçin. Kârinin sesi indirilir ve perde eğrisi bu cihazda hesaplanır.</li>
            <li>"Kâriyi dinle" ile âyeti dinleyin; okunan kelime işaretlenir.</li>
            <li>"Kaydet ve karşılaştır"a basın, âyeti baştan sona okuyun, bitince "Durdur"a basın.</li>
            <li>Sessiz bir ortamda, mikrofona bir karış uzaklıkta okuyun. Kulaklık kullanırsanız kârinin sesi kayda karışmaz.</li>
          </ol>
        </details>
      </section>`;

    const $ = id => host.querySelector('#' + id);
    const canvas = $('slCanvas');
    let ref = null;        // { rec, track, karar, series, words, verse }
    let usr = null;        // { track, series, cmp }
    let refAudio = null;
    let raf = 0;
    let loadToken = 0;
    let live = null;       // canlı kayıt eğrisi

    const status = (t) => { $('slStatus').textContent = t; };

    QA.getChapters().then(chs => {
      $('slSurah').innerHTML = chs.map(c => `<option value="${c.id}" ${c.id === kurraState.surah ? 'selected' : ''}>${c.id}. ${esc(c.name)} (${c.verses})</option>`).join('');
      fillAyahs(chs);
      $('slSurah').addEventListener('change', () => { kurraState.surah = +$('slSurah').value; kurraState.ayah = 1; fillAyahs(chs); load(); });
      load();
    }).catch(() => status('Sûre listesi alınamadı. İnternet bağlantısını kontrol edin.'));

    function fillAyahs(chs) {
      const ch = chs.find(c => c.id === kurraState.surah);
      const n = ch ? ch.verses : 7;
      if (kurraState.ayah > n) kurraState.ayah = 1;
      $('slAyah').innerHTML = Array.from({ length: n }, (_, i) => `<option value="${i + 1}" ${i + 1 === kurraState.ayah ? 'selected' : ''}>${i + 1}</option>`).join('');
    }
    $('slAyah').addEventListener('change', () => { kurraState.ayah = +$('slAyah').value; load(); });
    $('slReciter').addEventListener('change', () => { kurraState.reciter = +$('slReciter').value; load(); });
    $('slOpenMushaf').addEventListener('click', () => {
      if (typeof window.openMushafAndHighlightRule === 'function') window.openMushafAndHighlightRule(kurraState.surah, kurraState.ayah, '', '', true);
    });
    $('slFocus').addEventListener('click', () => {
      const box = $('slAyahBox');
      const on = box.classList.toggle('is-focus');
      $('slFocus').textContent = on ? 'Metni küçült' : 'Metni büyüt';
    });

    async function load() {
      const token = ++loadToken;
      stopRef();
      usr = null; ref = null; live = null;
      $('slResults').hidden = true;
      $('slPlayRef').disabled = true; $('slRecord').disabled = true;
      const key = `${kurraState.surah}:${kurraState.ayah}`;
      status('Âyet ve kayıt alınıyor…');
      try {
        const [verse, rec] = await Promise.all([QA.getVerse(key), QA.getRecitation(kurraState.reciter, key)]);
        if (token !== loadToken) return;
        renderWords(verse);
        status('Kârinin sesi çözümleniyor…');
        const pcm = await QA.decodeTo16k(rec.url);
        if (token !== loadToken) return;
        const track = await DSP.track(pcm.data, { onProgress: p => { if (token === loadToken) status(`Perde eğrisi hesaplanıyor… %${Math.round(p * 100)}`); } });
        if (token !== loadToken) return;
        const karar = DSP.estimateKarar(track.hz);
        if (!karar) throw new Error('Kayıtta sesli bölüm bulunamadı');
        const series = DSP.voicedSeries(track, karar);
        ref = { rec, track, karar, series, verse, voicedDur: series.t.length ? track.hz.filter(v => v > 0).length * track.hop : 0 };
        $('slPlayRef').disabled = false; $('slRecord').disabled = false;
        status(`Hazır · Kayıt ${fmtSec(track.duration)} · Karar perdesi ${karar.toFixed(1)} Hz`);
        draw();
      } catch (err) {
        if (token !== loadToken) return;
        status('Bu âyetin kaydı açılamadı. Başka bir kâri seçin ya da bağlantıyı kontrol edin.');
        draw();
      }
    }

    function renderWords(verse) {
      $('slWords').innerHTML = verse.words.map(w => `<span class="sl-word" data-pos="${w.pos}">${esc(w.text)}</span>`).join(' ') +
        ` <span class="sl-ayah-num">${toArabicDigits(kurraState.ayah)}</span>`;
      $('slMeal').textContent = verse.meal || '';
    }
    function toArabicDigits(n) { return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]); }
    function highlightWord(ms) {
      if (!ref) return;
      const seg = ref.rec.segments.find(s => ms >= s.start && ms <= s.end);
      host.querySelectorAll('.sl-word').forEach(el => el.classList.toggle('is-active', !!seg && +el.dataset.pos === seg.pos));
    }

    // --- Kâri sesini çal ---
    function stopRef() {
      if (refAudio) { try { refAudio.pause(); } catch (_) {} refAudio = null; }
      cancelAnimationFrame(raf);
      $('slPlayRef').classList.remove('is-playing');
      $('slPlayRef').lastChild.textContent = 'Kâriyi dinle';
      highlightWord(-1);
      draw();
    }
    $('slPlayRef').addEventListener('click', () => {
      if (refAudio) { stopRef(); return; }
      if (!ref) return;
      if (window.TilavetAudioManager) window.TilavetAudioManager.notifyPlay('ses-lab');
      refAudio = new Audio(ref.rec.url);
      $('slPlayRef').classList.add('is-playing');
      $('slPlayRef').lastChild.textContent = 'Durdur';
      refAudio.addEventListener('ended', stopRef);
      refAudio.play().catch(stopRef);
      const tick = () => {
        if (!refAudio) return;
        const sec = refAudio.currentTime;
        highlightWord(sec * 1000);
        draw(sec);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });

    // --- Kayıt ---
    let recording = null;
    $('slRecord').addEventListener('click', async () => {
      if (recording) { finishRecording(); return; }
      if (!ref) return;
      stopRef();
      try {
        const mic = await openMic();
        const chunks = [];
        const pitch = makeLivePitch(mic.ctx.sampleRate);
        live = { t: [], c: [], start: performance.now() };
        let peak = 0;
        attachFrameProcessor(mic, (buf) => {
          chunks.push(new Float32Array(buf));
          for (let i = 0; i < buf.length; i++) { const a = Math.abs(buf[i]); if (a > peak) peak = a; }
          const r = pitch(buf);
          const t = (performance.now() - live.start) / 1000;
          if (r.ap < 0.25 && r.rmsDb > -50 && r.f0 > 65 && r.f0 < 700) {
            let c = 1200 * Math.log2(r.f0 / ref.karar);
            // canlı görüntüde oktavı kâri aralığına katla
            c -= 1200 * Math.round(c / 1200);
            live.t.push(t); live.c.push(c);
          }
          draw();
        });
        recording = { mic, chunks, sr: mic.ctx.sampleRate, getPeak: () => peak };
        $('slRecord').classList.add('is-recording');
        $('slRecord').lastChild.textContent = 'Durdur';
        $('slPlayRef').disabled = true;
        status('Kayıt sürüyor · âyeti okuyun, bitince Durdur\'a basın');
        $('slResults').hidden = true;
      } catch (err) {
        status('Mikrofona erişilemedi. Tarayıcının mikrofon iznini açın.');
      }
    });

    async function finishRecording() {
      const rec = recording;
      recording = null;
      $('slRecord').classList.remove('is-recording');
      $('slRecord').lastChild.textContent = 'Kaydet ve karşılaştır';
      $('slPlayRef').disabled = false;
      const peak = rec.getPeak();
      closeMic();
      const total = rec.chunks.reduce((n, c) => n + c.length, 0);
      if (total < rec.sr * 1) { status('Kayıt çok kısa. Âyetin tamamını okuyun.'); return; }
      const all = new Float32Array(total);
      let o = 0; rec.chunks.forEach(c => { all.set(c, o); o += c.length; });
      status('Kaydınız çözümleniyor…');
      const off = new OfflineAudioContext(1, all.length, rec.sr);
      const ab = off.createBuffer(1, all.length, rec.sr);
      ab.getChannelData(0).set(all);
      const pcm = await window.QuranAudio.resampleTo16k(ab);
      const track = await DSP.track(pcm.data, { fmin: 65, fmax: 700, onProgress: p => status(`Kaydınız çözümleniyor… %${Math.round(p * 100)}`) });
      const voicedFrames = track.hz.filter(v => v > 0).length;
      const issues = [];
      if (peak > 0.98) issues.push('Ses yer yer kırpılmış: mikrofondan biraz uzaklaşın.');
      if (peak < 0.04) issues.push('Ses çok kısık: mikrofona yaklaşın ya da daha gür okuyun.');
      if (voicedFrames * 0.01 < 0.35 * ref.voicedDur) issues.push('Kayıtta sesli bölüm az: âyetin tamamını okuyun.');
      const uKarar = DSP.estimateKarar(track.hz);
      if (!uKarar) { live = null; showResults(null, ['Kayıtta okunuş algılanamadı. Mikrofonu ve ortam sesini kontrol edin.']); draw(); return; }
      const series = DSP.voicedSeries(track, uKarar);
      const cmp = DSP.compare(ref.series, series, ref.voicedDur, voicedFrames * 0.01);
      usr = { track, series, cmp, karar: uKarar };
      live = null;
      showResults(cmp, issues);
      status('Karşılaştırma tamamlandı');
      draw();
    }

    function showResults(cmp, issues) {
      const box = $('slResults');
      box.hidden = false;
      if (!cmp) {
        box.innerHTML = `<div class="sl-issues">${issues.map(i => `<p>${esc(i)}</p>`).join('')}</div>`;
        return;
      }
      const tempoTxt = cmp.tempoRatio > 1.08 ? `kâriden %${Math.round((cmp.tempoRatio - 1) * 100)} daha yavaş` : (cmp.tempoRatio < 0.92 ? `kâriden %${Math.round((1 - cmp.tempoRatio) * 100)} daha hızlı` : 'kâriye yakın hızda');
      const devKoma = cmp.medDev / KOMA;
      box.innerHTML = `
        <div class="sl-score"><strong>${cmp.score}</strong><span>/ 100</span><small>genel uyum</small></div>
        <div class="sl-metrics">
          <div class="sl-metric"><span>Perde uyumu</span><strong>%${cmp.pitchScore}</strong><small>±2 koma içinde kalan bölüm</small><i style="--v:${cmp.pitchScore}%"></i></div>
          <div class="sl-metric"><span>Seyir</span><strong>%${cmp.contourScore}</strong><small>iniş-çıkış yönlerinin benzerliği</small><i style="--v:${cmp.contourScore}%"></i></div>
          <div class="sl-metric"><span>Tempo</span><strong>%${cmp.tempoScore}</strong><small>${tempoTxt}</small><i style="--v:${cmp.tempoScore}%"></i></div>
          <div class="sl-metric"><span>Ortalama sapma</span><strong>${devKoma.toFixed(1)} koma</strong><small>${Math.round(cmp.medDev)} cent (medyan)</small><i style="--v:${Math.max(0, 100 - devKoma * 12)}%"></i></div>
        </div>
        ${issues.length ? `<div class="sl-issues">${issues.map(i => `<p>${esc(i)}</p>`).join('')}</div>` : ''}`;
    }

    // --- Çizim ---
    function draw(playSec = null) {
      const dpr = window.devicePixelRatio || 1;
      const W = Math.max(280, canvas.clientWidth || 800), H = 300;
      if (canvas.width !== W * dpr) { canvas.width = W * dpr; canvas.height = H * dpr; }
      const g = canvas.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bg = cssVar('--v5-surface', '#fff'), text3 = cssVar('--v5-text-3', '#888'), hair = cssVar('--v5-hairline', '#ddd');
      const refCol = cssVar('--v5-gold', '#c9973a'), usrCol = cssVar('--v5-primary', '#0f6b4f');
      g.fillStyle = bg; g.fillRect(0, 0, W, H);
      const padL = 48, padR = 12, padT = 12, padB = 40;
      if (!ref) { g.fillStyle = text3; g.font = '13px Figtree, sans-serif'; g.fillText('Kâri sesi yüklendiğinde perde eğrisi burada görünür.', padL, H / 2); return; }
      const dur = ref.track.duration || 1;
      // y aralığı: verinin %2–%98'i, en az ±300 cent
      const vals = [...ref.series.c];
      if (usr && usr.cmp) usr.cmp.mapped.forEach(v => { if (v !== null) vals.push(v); });
      if (live) vals.push(...live.c);
      const sorted = vals.slice().sort((a, b) => a - b);
      let lo = sorted.length ? sorted[Math.floor(sorted.length * 0.02)] : -300;
      let hi = sorted.length ? sorted[Math.floor(sorted.length * 0.98)] : 300;
      lo = Math.max(-1200, Math.floor(Math.min(lo, -200) / 100) * 100 - 100);
      hi = Math.min(1500, Math.ceil(Math.max(hi, 200) / 100) * 100 + 100);
      const X = t => padL + (t / dur) * (W - padL - padR);
      const Y = c => padT + (1 - (c - lo) / (hi - lo)) * (H - padT - padB);
      // kelime bantları
      g.font = `15px "Amiri Quran", Amiri, serif`; g.textAlign = 'center';
      ref.rec.segments.forEach((s, k) => {
        const x1 = X(s.start / 1000), x2 = X(s.end / 1000);
        if (k % 2 === 0) { g.fillStyle = 'rgba(127,127,127,0.06)'; g.fillRect(x1, padT, x2 - x1, H - padT - padB); }
        const w = ref.verse.words.find(v => v.pos === s.pos);
        if (w && x2 - x1 > 18) { g.fillStyle = text3; g.fillText(w.text, (x1 + x2) / 2, H - 12); }
      });
      // ızgara
      g.textAlign = 'right'; g.font = '11px Figtree, sans-serif';
      for (let c = Math.ceil(lo / 100) * 100; c <= hi; c += 100) {
        g.strokeStyle = c === 0 ? refCol : hair; g.lineWidth = c === 0 ? 1.5 : 1;
        g.beginPath(); g.moveTo(padL, Y(c)); g.lineTo(W - padR, Y(c)); g.stroke();
        if (c % 200 === 0) { g.fillStyle = text3; g.fillText(c === 0 ? 'Karar' : (c > 0 ? '+' : '') + c, padL - 6, Y(c) + 4); }
      }
      // tolerans bandı (kâri eğrisi etrafında ±2 koma)
      const tol = 2 * KOMA;
      g.fillStyle = 'rgba(201,151,58,0.14)';
      strokeSeries(ref.series.t, ref.series.c, (pts) => {
        g.beginPath();
        pts.forEach(([t, c], i) => { const x = X(t), y = Y(c + tol); if (i) g.lineTo(x, y); else g.moveTo(x, y); });
        for (let i = pts.length - 1; i >= 0; i--) { const [t, c] = pts[i]; g.lineTo(X(t), Y(c - tol)); }
        g.closePath(); g.fill();
      });
      // kâri eğrisi
      g.strokeStyle = refCol; g.lineWidth = 2.2; g.lineJoin = 'round';
      strokeSeries(ref.series.t, ref.series.c, pts => { g.beginPath(); pts.forEach(([t, c], i) => i ? g.lineTo(X(t), Y(c)) : g.moveTo(X(t), Y(c))); g.stroke(); });
      // kullanıcı (hizalanmış) ya da canlı
      if (usr && usr.cmp) {
        g.strokeStyle = usrCol; g.lineWidth = 2.2;
        const tt = [], cc = [];
        usr.cmp.mapped.forEach((v, i) => { if (v !== null) { tt.push(ref.series.t[i]); cc.push(v); } });
        strokeSeries(tt, cc, pts => { g.beginPath(); pts.forEach(([t, c], i) => i ? g.lineTo(X(t), Y(c)) : g.moveTo(X(t), Y(c))); g.stroke(); });
      } else if (live && live.t.length) {
        g.fillStyle = usrCol;
        for (let i = 0; i < live.t.length; i++) { const t = live.t[i]; if (t > dur) break; g.fillRect(X(t) - 1.5, Y(live.c[i]) - 1.5, 3, 3); }
      }
      if (playSec !== null) { g.strokeStyle = cssVar('--v5-danger', '#c33'); g.lineWidth = 1.5; g.beginPath(); g.moveTo(X(playSec), padT); g.lineTo(X(playSec), H - padB); g.stroke(); }
    }
    // Eğriyi 0,12 sn'den uzun boşluklarda böler
    function strokeSeries(t, c, fn) {
      let seg = [];
      for (let i = 0; i < t.length; i++) {
        if (seg.length && t[i] - seg[seg.length - 1][0] > 0.12) { if (seg.length > 1) fn(seg); seg = []; }
        seg.push([t[i], c[i]]);
      }
      if (seg.length > 1) fn(seg);
    }
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    cleanupFns.push(() => { window.removeEventListener('resize', onResize); stopRef(); recording = null; loadToken++; });
    draw();
  }

  // ----------------------------------------------------------------------
  // 3.2 Elif ölçer
  // ----------------------------------------------------------------------
  const MEDD_TEMPOS = [
    { id: 'tahkik', name: 'Tahkîk', ms: 700 },
    { id: 'tertil', name: 'Tertîl', ms: 550 },
    { id: 'tedvir', name: 'Tedvîr', ms: 450 },
    { id: 'hadr', name: 'Hadr', ms: 350 }
  ];
  const MEDD_TARGETS = [
    { id: 'tabii', name: 'Medd-i tabiî', elif: 1, word: { key: '2:30', pos: 2, ar: 'قَالَ' } },
    { id: 'arz', name: 'Medd-i ârız (durakta)', elif: 3, word: { key: '1:4', pos: 3, ar: 'ٱلدِّينِ' } },
    { id: 'munfasil', name: 'Medd-i munfasıl', elif: 4, word: { key: '108:1', pos: 1, ar: 'إِنَّآ' } },
    { id: 'muttasil', name: 'Medd-i muttasıl', elif: 4, word: { key: '110:1', pos: 2, ar: 'جَآءَ' } },
    { id: 'lazim', name: 'Medd-i lâzım', elif: 4, word: { key: '1:7', pos: 9, ar: 'ٱلضَّآلِّينَ' } }
  ];
  const meddState = { tempo: 'tertil', target: 'muttasil', elifMs: 550 };
  function Medd(host) {
    const target = () => MEDD_TARGETS.find(t => t.id === meddState.target) || MEDD_TARGETS[0];
    host.innerHTML = `
      <section class="sl-card">
        <div class="sl-medd-top">
          <div class="sl-field-group">
            <span class="sl-label">Okuma hızı</span>
            <div class="sl-seg" id="slTempo">${MEDD_TEMPOS.map(t => `<button type="button" class="${t.id === meddState.tempo ? 'active' : ''}" data-tempo="${t.id}">${t.name}<small>1 elif ≈ ${(t.ms / 1000).toFixed(2)} sn</small></button>`).join('')}</div>
          </div>
          <div class="sl-field-group">
            <span class="sl-label">Çalışılacak med</span>
            <div class="sl-seg sl-seg-wrap" id="slTarget">${MEDD_TARGETS.map(t => `<button type="button" class="${t.id === meddState.target ? 'active' : ''}" data-target="${t.id}">${t.name}<small>${t.elif} elif</small></button>`).join('')}</div>
          </div>
        </div>

        <div class="sl-medd-word">
          <span class="sl-medd-word-ar" lang="ar" id="slMeddWord">${target().word.ar}</span>
          <button type="button" class="sl-btn sl-btn-ghost" data-clip-key="${target().word.key}" data-clip-from="${target().word.pos}" data-clip-reciter="12" id="slMeddClip"><span class="sl-ico-play"></span>Hocadan dinle</button>
        </div>

        <div class="sl-controls">
          <button type="button" class="sl-btn sl-btn-record" id="slMeddStart"><span class="sl-ico-rec"></span>Ölçmeye başla</button>
          <span class="sl-status" id="slMeddStatus" role="status">Mikrofon kapalı</span>
        </div>

        <div class="sl-elif-meter" aria-live="polite">
          <div class="sl-elif-boxes" id="slElifBoxes">${Array.from({ length: 8 }, (_, i) => `<div class="sl-elif-box" data-i="${i}"><i></i><span>${i + 1}</span></div>`).join('')}</div>
          <div class="sl-elif-read"><strong id="slElifNum">0,0</strong><span>elif</span><small id="slElifSec">0,00 sn</small></div>
        </div>
        <div class="sl-level"><span>Ses düzeyi</span><div class="sl-level-bar"><i id="slLevel"></i><b id="slLevelThr"></b></div></div>

        <div class="sl-medd-result" id="slMeddResult" hidden></div>

        <details class="sl-guide" open>
          <summary>Kullanım kılavuzu</summary>
          <ol>
            <li>Okuma hızını seçin. Uzatma, hıza bağlıdır: tertîlde 1 elif yaklaşık 0,55 saniyedir.</li>
            <li>Med türünü seçin, örneği hocadan dinleyin.</li>
            <li>"Ölçmeye başla"ya basın ve ilk yarım saniye sessiz kalın; ortam gürültüsü ölçülür.</li>
            <li>Kelimeyi okuyun ve med harfini <strong>tek nefeste, sesli ve düz bir tonla</strong> uzatın. Uzattığınız süre karelere dolar.</li>
            <li>Sesiniz kesildiğinde sonuç gösterilir. Hedef kareler çerçevelidir; yarım elif fark kabul edilir.</li>
          </ol>
          <p class="sl-guide-why"><strong>Neden ölçülmüyor?</strong> Ses düzeyi çubuğu çizgiyi geçmiyorsa mikrofona yaklaşın. Fısıltı veya nefes sesi ölçülmez; sesli okuyun. Okurken ses kesilirse ölçüm yeniden başlar.</p>
        </details>
      </section>`;
    const $ = id => host.querySelector('#' + id);
    host.querySelectorAll('[data-tempo]').forEach(b => b.addEventListener('click', () => {
      meddState.tempo = b.dataset.tempo;
      meddState.elifMs = MEDD_TEMPOS.find(t => t.id === meddState.tempo).ms;
      host.querySelectorAll('[data-tempo]').forEach(x => x.classList.toggle('active', x === b));
      paintTarget();
    }));
    host.querySelectorAll('[data-target]').forEach(b => b.addEventListener('click', () => {
      meddState.target = b.dataset.target;
      host.querySelectorAll('[data-target]').forEach(x => x.classList.toggle('active', x === b));
      const t = target();
      $('slMeddWord').textContent = t.word.ar;
      $('slMeddClip').setAttribute('data-clip-key', t.word.key);
      $('slMeddClip').setAttribute('data-clip-from', t.word.pos);
      paintTarget();
    }));
    function paintTarget() {
      const n = target().elif;
      host.querySelectorAll('.sl-elif-box').forEach((b, i) => b.classList.toggle('is-target', i < n));
    }
    paintTarget();

    function paint(elifs, sec) {
      host.querySelectorAll('.sl-elif-box').forEach((b, i) => {
        const fill = Math.max(0, Math.min(1, elifs - i));
        b.querySelector('i').style.transform = `scaleY(${fill})`;
        b.classList.toggle('is-full', fill >= 1);
      });
      $('slElifNum').textContent = elifs.toFixed(1).replace('.', ',');
      $('slElifSec').textContent = `${sec.toFixed(2).replace('.', ',')} sn`;
    }

    let running = null;
    $('slMeddStart').addEventListener('click', async () => {
      if (running) { stopMeasure(); return; }
      try {
        const mic = await openMic();
        const pitch = makeLivePitch(mic.ctx.sampleRate);
        const frameSec = 2048 / mic.ctx.sampleRate;
        const st = { calib: [], noiseDb: -60, thr: -48, active: false, dur: 0, gap: 0, cents: [], unvoicedLoud: 0, breaks: 0, maxLevel: -120 };
        running = { mic, st };
        $('slMeddStart').classList.add('is-recording');
        $('slMeddStart').lastChild.textContent = 'Durdur';
        $('slMeddResult').hidden = true;
        $('slMeddStatus').textContent = 'Ortam sesi ölçülüyor, sessiz kalın…';
        paint(0, 0);
        attachFrameProcessor(mic, (buf) => {
          const r = pitch(buf);
          st.maxLevel = Math.max(st.maxLevel, r.rmsDb);
          // düzey çubuğu (-70…-10 dB)
          const lv = Math.max(0, Math.min(1, (r.rmsDb + 70) / 60));
          $('slLevel').style.transform = `scaleX(${lv})`;
          if (st.calib.length < Math.ceil(0.6 / frameSec)) {
            st.calib.push(r.rmsDb);
            if (st.calib.length === Math.ceil(0.6 / frameSec)) {
              st.noiseDb = DSP.median(st.calib);
              st.thr = Math.max(st.noiseDb + 12, -52);
              $('slLevelThr').style.left = `${Math.max(0, Math.min(1, (st.thr + 70) / 60)) * 100}%`;
              $('slMeddStatus').textContent = st.noiseDb > -38 ? 'Ortam gürültülü; ölçüm zorlaşabilir. Okuyabilirsiniz.' : 'Hazır · kelimeyi okuyup med harfini uzatın';
            }
            return;
          }
          const loud = r.rmsDb > st.thr;
          const voiced = loud && r.ap < 0.3 && r.f0 > 65 && r.f0 < 700;
          if (voiced) {
            const c = 1200 * Math.log2(r.f0 / 55);
            const med = st.cents.length ? DSP.median(st.cents.slice(-20)) : c;
            if (st.active && Math.abs(c - med) > 350) {
              // perde ani değişti: yeni hece → önceki uzatmayı bitir
              finalize(); st.active = false;
            }
            if (!st.active) { st.active = true; st.dur = 0; st.gap = 0; st.cents = []; st.breaks = 0; }
            st.dur += frameSec + st.gap; st.gap = 0;
            st.cents.push(c);
            paint(st.dur * 1000 / meddState.elifMs, st.dur);
            $('slMeddStatus').textContent = 'Ölçülüyor…';
          } else {
            if (loud && !voiced) st.unvoicedLoud++;
            if (st.active) {
              st.gap += frameSec;
              if (st.gap > 0.08 && st.gap <= 0.25) st.breaks = 1;
              if (st.gap > 0.25) { finalize(); st.active = false; }
            }
          }
        });
      } catch (err) {
        $('slMeddStatus').textContent = 'Mikrofona erişilemedi. Tarayıcıda mikrofon iznini açın.';
      }
    });
    function finalize() {
      const st = running && running.st;
      if (!st || st.dur < 0.15) return;
      const elifs = st.dur * 1000 / meddState.elifMs;
      const tgt = target().elif;
      const diff = elifs - tgt;
      const cents = st.cents;
      const med = DSP.median(cents);
      const spread = DSP.median(cents.map(c => Math.abs(c - med)));
      const tips = [];
      let verdict, cls;
      if (Math.abs(diff) <= 0.5) { verdict = 'Doğru uzunlukta'; cls = 'ok'; }
      else if (diff < 0) { verdict = `${Math.abs(diff).toFixed(1).replace('.', ',')} elif kısa`; cls = 'short'; tips.push('Med harfine geldiğinizde nefesi kesmeden, sesi düz tutarak biraz daha uzatın.'); }
      else { verdict = `${diff.toFixed(1).replace('.', ',')} elif uzun`; cls = 'long'; tips.push('Uzatmayı hedef karelere gelince bırakın; fazla uzatmak da tecvid hatasıdır.'); }
      if (st.breaks) tips.push('Uzatma sırasında ses bir an kesildi; tek nefeste, kesintisiz uzatın.');
      if (spread > 60) tips.push('Ses uzatma boyunca dalgalandı; tonu sabit tutmaya çalışın.');
      $('slMeddResult').hidden = false;
      $('slMeddResult').className = `sl-medd-result is-${cls}`;
      $('slMeddResult').innerHTML = `<strong>${elifs.toFixed(1).replace('.', ',')} elif · ${st.dur.toFixed(2).replace('.', ',')} sn — ${verdict}</strong><span>Hedef: ${tgt} elif (${target().name}, ${MEDD_TEMPOS.find(t => t.id === meddState.tempo).name})</span>${tips.map(t => `<p>${t}</p>`).join('')}`;
      $('slMeddStatus').textContent = 'Yeniden okuyabilirsiniz';
    }
    function stopMeasure() {
      const st = running && running.st;
      if (st && st.active) finalize();
      if (st && st.maxLevel < st.thr) {
        $('slMeddResult').hidden = false;
        $('slMeddResult').className = 'sl-medd-result is-short';
        $('slMeddResult').innerHTML = '<strong>Ses algılanmadı</strong><p>Ses düzeyi çizgiyi hiç geçmedi. Mikrofona yaklaşın ya da daha gür okuyun.</p>';
      } else if (st && st.unvoicedLoud > 20 && !$('slMeddResult').innerHTML) {
        $('slMeddResult').hidden = false;
        $('slMeddResult').innerHTML = '<strong>Sesli okuma algılanmadı</strong><p>Fısıltı ya da nefes sesi ölçülmez; harfleri sesli okuyun.</p>';
      }
      running = null;
      closeMic();
      $('slMeddStart').classList.remove('is-recording');
      $('slMeddStart').lastChild.textContent = 'Ölçmeye başla';
      $('slMeddStatus').textContent = 'Mikrofon kapalı';
      $('slLevel').style.transform = 'scaleX(0)';
    }
    cleanupFns.push(() => { if (running) { running = null; } });
  }

  // ----------------------------------------------------------------------
  // 3.3 Perde ve karar (canlı akort)
  // ----------------------------------------------------------------------
  const tunerState = { makam: 'rast', kararHz: 0 };
  function Tuner(host) {
    const data = (window.TilavetAkademiDefaultData && window.TilavetAkademiDefaultData.makamlar) || [];
    const makams = data.filter(m => m.dizi && (m.dizi.cikici || Array.isArray(m.dizi)));
    const T = window.MakamTuning || null;
    const getMakam = () => makams.find(m => m.id === tunerState.makam) || makams[0];
    host.innerHTML = `
      <section class="sl-card">
        <div class="sl-picker">
          <label class="sl-field"><span>Makam dizisi</span><select id="slMakam">${makams.map(m => `<option value="${m.id}" ${m.id === tunerState.makam ? 'selected' : ''}>${esc(m.names.tr)}</option>`).join('')}</select></label>
        </div>
        <div class="sl-controls">
          <button type="button" class="sl-btn sl-btn-ghost" id="slSetKarar">Kararımı belirle</button>
          <button type="button" class="sl-btn sl-btn-record" id="slTunerStart"><span class="sl-ico-rec"></span>Mikrofonu aç</button>
          <span class="sl-status" id="slTunerStatus">${tunerState.kararHz ? `Karar: ${tunerState.kararHz.toFixed(1)} Hz` : 'Önce rahat bir sesle 2 saniye "â" diyerek kararınızı belirleyin.'}</span>
        </div>
        <div class="sl-tuner">
          <div class="sl-tuner-note"><span id="slTunerName">—</span><small id="slTunerHz">Hz</small></div>
          <div class="sl-needle"><div class="sl-needle-scale">${[-4, -3, -2, -1, 0, 1, 2, 3, 4].map(k => `<span style="left:${(k + 4) / 8 * 100}%">${k > 0 ? '+' + k : k}</span>`).join('')}</div><i id="slNeedle"></i></div>
          <p class="sl-tuner-hint">İbre, en yakın perdeye göre sapmayı koma cinsinden gösterir (1 koma ≈ 22,6 cent). Yeşil alan ±1 komadır.</p>
        </div>
        <canvas id="slTunerCanvas" height="220"></canvas>
      </section>`;
    const $ = id => host.querySelector('#' + id);
    $('slMakam').addEventListener('change', () => { tunerState.makam = $('slMakam').value; });
    const canvas = $('slTunerCanvas');
    const hist = [];
    function scaleDegrees() {
      const m = getMakam();
      if (!m) return [];
      const dizi = m.dizi.cikici || m.dizi;
      const durak = typeof m.durak === 'number' ? m.durak : dizi[0];
      return dizi.map(abs => ({ koma: abs - durak, name: (T && T.perdeAdi(abs)) || '' }));
    }
    function nearest(cents) {
      const degs = scaleDegrees();
      let best = null;
      for (let oct = -1; oct <= 2; oct++) {
        degs.forEach(dg => {
          const c = dg.koma * KOMA + oct * 1200;
          const dev = cents - c;
          if (!best || Math.abs(dev) < Math.abs(best.dev)) best = { name: dg.name, dev, c };
        });
      }
      return best;
    }
    function drawHist() {
      const dpr = window.devicePixelRatio || 1;
      const W = Math.max(280, canvas.clientWidth || 600), H = 220;
      if (canvas.width !== W * dpr) { canvas.width = W * dpr; canvas.height = H * dpr; }
      const g = canvas.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.fillStyle = cssVar('--v5-surface', '#fff'); g.fillRect(0, 0, W, H);
      const lo = -300, hi = 1500;
      const Y = c => 10 + (1 - (c - lo) / (hi - lo)) * (H - 20);
      g.font = '11px Figtree, sans-serif'; g.textAlign = 'left';
      scaleDegrees().forEach(dg => {
        [0, 1200].forEach(o => {
          const c = dg.koma * KOMA + o; if (c < lo || c > hi) return;
          g.strokeStyle = (dg.koma === 0) ? cssVar('--v5-gold', '#c9973a') : cssVar('--v5-hairline', '#ddd');
          g.beginPath(); g.moveTo(0, Y(c)); g.lineTo(W, Y(c)); g.stroke();
          g.fillStyle = cssVar('--v5-text-3', '#888'); g.fillText(dg.name, 6, Y(c) - 3);
        });
      });
      g.fillStyle = cssVar('--v5-primary', '#0f6b4f');
      const now = performance.now();
      hist.forEach(p => { const x = W - (now - p.t) / 6000 * W; if (x > 0) g.fillRect(x - 1.5, Y(p.c) - 1.5, 3, 3); });
    }
    let mode = null; // 'karar' | 'live'
    let kararSamples = [];
    async function start(m) {
      const mic = await openMic();
      const pitch = makeLivePitch(mic.ctx.sampleRate);
      mode = m;
      kararSamples = [];
      attachFrameProcessor(mic, (buf) => {
        const r = pitch(buf);
        const ok = r.ap < 0.25 && r.rmsDb > -50 && r.f0 > 65 && r.f0 < 700;
        if (mode === 'karar') {
          if (ok) kararSamples.push(r.f0);
          $('slTunerStatus').textContent = `Dinleniyor… ${Math.min(100, Math.round(kararSamples.length / 45 * 100))}%`;
          if (kararSamples.length >= 45) {
            const cents = kararSamples.map(f => 1200 * Math.log2(f / 55));
            tunerState.kararHz = 55 * Math.pow(2, DSP.median(cents) / 1200);
            stop();
            $('slTunerStatus').textContent = `Karar: ${tunerState.kararHz.toFixed(1)} Hz. Şimdi mikrofonu açıp diziyi okuyun.`;
          }
          return;
        }
        if (!ok || !tunerState.kararHz) { $('slTunerName').textContent = '—'; $('slNeedle').style.opacity = 0.3; return; }
        const cents = 1200 * Math.log2(r.f0 / tunerState.kararHz);
        const nb = nearest(cents);
        const devK = Math.max(-4, Math.min(4, nb.dev / KOMA));
        $('slTunerName').textContent = nb.name || '—';
        $('slTunerHz').textContent = `${r.f0.toFixed(1)} Hz · ${devK > 0 ? '+' : ''}${devK.toFixed(1)} koma`;
        $('slNeedle').style.opacity = 1;
        $('slNeedle').style.left = `${(devK + 4) / 8 * 100}%`;
        $('slNeedle').classList.toggle('is-ok', Math.abs(devK) <= 1);
        hist.push({ t: performance.now(), c: cents });
        while (hist.length && performance.now() - hist[0].t > 6000) hist.shift();
        drawHist();
      });
    }
    function stop() {
      mode = null; closeMic();
      $('slTunerStart').classList.remove('is-recording');
      $('slTunerStart').lastChild.textContent = 'Mikrofonu aç';
    }
    $('slSetKarar').addEventListener('click', async () => {
      stop();
      try { await start('karar'); $('slTunerStatus').textContent = 'Rahat bir sesle "â" deyin…'; } catch (_) { $('slTunerStatus').textContent = 'Mikrofona erişilemedi.'; }
    });
    $('slTunerStart').addEventListener('click', async () => {
      if (mode === 'live') { stop(); return; }
      if (!tunerState.kararHz) { $('slTunerStatus').textContent = 'Önce "Kararımı belirle" ile karar perdenizi kaydedin.'; return; }
      try {
        await start('live');
        $('slTunerStart').classList.add('is-recording');
        $('slTunerStart').lastChild.textContent = 'Kapat';
      } catch (_) { $('slTunerStatus').textContent = 'Mikrofona erişilemedi.'; }
    });
    drawHist();
    cleanupFns.push(() => { mode = null; });
  }

  // ----------------------------------------------------------------------
  // 3.4 Spektrum
  // ----------------------------------------------------------------------
  function Spectrum(host) {
    host.innerHTML = `
      <section class="sl-card">
        <div class="sl-controls">
          <button type="button" class="sl-btn sl-btn-record" id="slSpecStart"><span class="sl-ico-rec"></span>Mikrofonu aç</button>
          <span class="sl-status" id="slSpecStatus">Uzun bir "â" ya da "nnn" sesi ile deneyin.</span>
        </div>
        <canvas id="slSpecCanvas" height="260"></canvas>
        <div class="sl-bands">
          <div class="sl-bandcard"><span>Gövde / göğüs</span><small>80–300 Hz</small><strong id="slB1">—</strong><i id="slB1b"></i></div>
          <div class="sl-bandcard"><span>Ağız ve boğaz</span><small>300–1500 Hz</small><strong id="slB2">—</strong><i id="slB2b"></i></div>
          <div class="sl-bandcard"><span>Parlaklık / geniz</span><small>1500–4000 Hz</small><strong id="slB3">—</strong><i id="slB3b"></i></div>
        </div>
        <p class="sl-chart-note">Grafik sesinizin frekans dağılımını gösterir (Hann pencereli FFT, 8192 nokta, logaritmik eksen). Bant yüzdeleri, 80–4000 Hz arasındaki toplam enerjinin payıdır. Gunne sesinde (نّ / مّ) yüksek bantta belirgin bir artış görülür; bu bir tanı değil, gözlemdir.</p>
      </section>`;
    const $ = id => host.querySelector('#' + id);
    const canvas = $('slSpecCanvas');
    let state = null;
    function draw(freqDb, sr, f0) {
      const dpr = window.devicePixelRatio || 1;
      const W = Math.max(280, canvas.clientWidth || 800), H = 260;
      if (canvas.width !== W * dpr) { canvas.width = W * dpr; canvas.height = H * dpr; }
      const g = canvas.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.fillStyle = cssVar('--v5-surface', '#fff'); g.fillRect(0, 0, W, H);
      const fLo = 60, fHi = 6000, padB = 22, padL = 34;
      const X = f => padL + (Math.log(f / fLo) / Math.log(fHi / fLo)) * (W - padL - 8);
      const dbLo = -100, dbHi = -20;
      const Y = db => 8 + (1 - (Math.max(dbLo, Math.min(dbHi, db)) - dbLo) / (dbHi - dbLo)) * (H - padB - 8);
      // ızgara
      g.font = '11px Figtree, sans-serif'; g.fillStyle = cssVar('--v5-text-3', '#888'); g.strokeStyle = cssVar('--v5-hairline', '#ddd');
      [100, 200, 500, 1000, 2000, 5000].forEach(f => { g.beginPath(); g.moveTo(X(f), 8); g.lineTo(X(f), H - padB); g.stroke(); g.textAlign = 'center'; g.fillText(f >= 1000 ? f / 1000 + ' kHz' : f + ' Hz', X(f), H - 6); });
      [-80, -60, -40].forEach(db => { g.beginPath(); g.moveTo(padL, Y(db)); g.lineTo(W, Y(db)); g.stroke(); g.textAlign = 'right'; g.fillText(db + ' dB', padL - 4, Y(db) + 4); });
      // bant renkleri
      const bandCol = f => f < 300 ? cssVar('--v5-gold', '#c9973a') : (f < 1500 ? cssVar('--v5-primary', '#0f6b4f') : '#3b82c4');
      if (!freqDb) return;
      const binHz = sr / 2 / freqDb.length;
      const bars = 72;
      for (let b = 0; b < bars; b++) {
        const f1 = fLo * Math.pow(fHi / fLo, b / bars), f2 = fLo * Math.pow(fHi / fLo, (b + 1) / bars);
        const i1 = Math.max(1, Math.floor(f1 / binHz)), i2 = Math.max(i1 + 1, Math.ceil(f2 / binHz));
        let p = 0;
        for (let i = i1; i < i2 && i < freqDb.length; i++) p += Math.pow(10, freqDb[i] / 10);
        const db = 10 * Math.log10(p / (i2 - i1) + 1e-12);
        const x1 = X(f1), x2 = X(f2);
        g.fillStyle = bandCol(Math.sqrt(f1 * f2));
        g.fillRect(x1 + 0.5, Y(db), Math.max(1, x2 - x1 - 1), H - padB - Y(db));
      }
      if (f0) {
        g.strokeStyle = cssVar('--v5-danger', '#c33'); g.lineWidth = 1.5;
        g.beginPath(); g.moveTo(X(f0), 8); g.lineTo(X(f0), H - padB); g.stroke();
        g.fillStyle = cssVar('--v5-danger', '#c33'); g.textAlign = 'left'; g.fillText(`F0 ${Math.round(f0)} Hz`, X(f0) + 4, 20);
      }
    }
    function bandPct(freqDb, sr) {
      const binHz = sr / 2 / freqDb.length;
      const sum = (a, b) => { let p = 0; for (let i = Math.ceil(a / binHz); i <= Math.floor(b / binHz); i++) p += Math.pow(10, freqDb[i] / 10); return p; };
      const b1 = sum(80, 300), b2 = sum(300, 1500), b3 = sum(1500, 4000), tot = b1 + b2 + b3 || 1;
      return [b1 / tot, b2 / tot, b3 / tot];
    }
    let raf = 0;
    $('slSpecStart').addEventListener('click', async () => {
      if (state) { stop(); return; }
      try {
        const mic = await openMic();
        const an = mic.ctx.createAnalyser();
        an.fftSize = 8192; an.smoothingTimeConstant = 0.6; an.minDecibels = -110; an.maxDecibels = -10;
        mic.source.connect(an); mic.nodes.push(an);
        const pitch = makeLivePitch(mic.ctx.sampleRate);
        const freq = new Float32Array(an.frequencyBinCount);
        const time = new Float32Array(4096);
        state = { mic, an };
        $('slSpecStart').classList.add('is-recording');
        $('slSpecStart').lastChild.textContent = 'Kapat';
        const ema = [0, 0, 0];
        const loop = () => {
          if (!state) return;
          an.getFloatFrequencyData(freq);
          an.getFloatTimeDomainData(time);
          const r = pitch(time);
          const voiced = r.ap < 0.25 && r.rmsDb > -50;
          draw(freq, mic.ctx.sampleRate, voiced ? r.f0 : 0);
          if (r.rmsDb > -55) {
            const pct = bandPct(freq, mic.ctx.sampleRate);
            pct.forEach((v, i) => { ema[i] = 0.85 * ema[i] + 0.15 * v; });
            [['slB1', 'slB1b'], ['slB2', 'slB2b'], ['slB3', 'slB3b']].forEach(([a, b], i) => { $(a).textContent = `%${Math.round(ema[i] * 100)}`; $(b).style.transform = `scaleX(${ema[i]})`; });
            $('slSpecStatus').textContent = voiced ? `Perde: ${r.f0.toFixed(1)} Hz` : 'Ses var, perde algılanmadı (sessiz harf ya da nefes)';
          } else {
            $('slSpecStatus').textContent = 'Ses bekleniyor…';
          }
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      } catch (_) { $('slSpecStatus').textContent = 'Mikrofona erişilemedi.'; }
    });
    function stop() {
      cancelAnimationFrame(raf); state = null; closeMic();
      $('slSpecStart').classList.remove('is-recording');
      $('slSpecStart').lastChild.textContent = 'Mikrofonu aç';
    }
    draw(null);
    cleanupFns.push(() => { cancelAnimationFrame(raf); state = null; });
  }

  if (window.TilavetAudioManager && typeof window.TilavetAudioManager.register === 'function') {
    window.TilavetAudioManager.register('ses-lab', { stop: () => { if (window.QuranAudio) window.QuranAudio.stop(); }, category: 'akademi' });
  }
  window.SesLab = { mount, stop: runCleanup, DSP };
})();
