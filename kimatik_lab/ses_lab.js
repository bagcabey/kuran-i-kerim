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
    return { hop: 0.01, hz, rmsDb, ap, maxDb, duration: frames * 0.01 };
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
    { id: 'tuner', label: 'Perde ve makam' },
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
  const kurraState = { surah: 1, ayah: 1, reciter: 6, until: 0 };
  function Kurra(host) {
    const QA = window.QuranAudio;
    const PX_PER_SEC = 70;          // kaydırmalı görünümde 1 saniyenin genişliği
    const MAX_AYAHS = 40;           // "Durdurana kadar" modunda en çok yüklenecek âyet
    const MAX_REF_SEC = 600;        // kâri kaydı üst sınırı (10 dk)
    const MAX_REC_SEC = 600;        // kullanıcı kaydı üst sınırı (10 dk)
    host.innerHTML = `
      <section class="sl-card">
        <div class="sl-picker">
          <label class="sl-field"><span>Sûre</span><select id="slSurah"><option>Yükleniyor…</option></select></label>
          <label class="sl-field sl-field-sm"><span>Başlangıç</span><select id="slAyah"></select></label>
          <label class="sl-field sl-field-md"><span>Nereye kadar</span><select id="slUntil"></select></label>
          <label class="sl-field"><span>Kâri</span><select id="slReciter">${QA.RECITERS.map(r => `<option value="${r.id}" ${r.id === kurraState.reciter ? 'selected' : ''}>${esc(r.name)} · ${esc(r.style)}</option>`).join('')}</select></label>
          <button type="button" class="sl-btn sl-btn-ghost" id="slOpenMushaf">Mushaf'ta aç</button>
        </div>

        <div class="sl-ayah" id="slAyahBox">
          <div class="sl-controls sl-controls--dock">
            <button type="button" class="sl-btn sl-btn-primary" id="slPlayRef" disabled><span class="sl-ico-play"></span>Kâriyi dinle</button>
            <button type="button" class="sl-btn sl-btn-record" id="slRecord" disabled><span class="sl-ico-rec"></span>Okumaya başla</button>
            <span class="sl-status" id="slStatus" role="status">Âyet yükleniyor…</span>
            <button type="button" class="sl-link" id="slFocus">Metni büyüt</button>
          </div>
          <div class="sl-ayah-words" id="slWords" dir="rtl" lang="ar"></div>
          <p class="sl-ayah-meal" id="slMeal"></p>
        </div>

        <div class="sl-chart">
          <div class="sl-chart-head">
            <div class="sl-legend">
              <span><i class="sl-dot ref"></i>Kâri</span>
              <span><i class="sl-dot usr"></i>Siz</span>
              <span><i class="sl-band"></i>±2 koma tolerans</span>
            </div>
            <div class="sl-zoom" role="group" aria-label="Görünüm">
              <button type="button" data-zoom="scroll" class="active">Yakın</button>
              <button type="button" data-zoom="fit">Tümü</button>
            </div>
          </div>
          <div class="sl-chart-scroll" id="slScroll" tabindex="0" aria-label="Perde eğrisi; yana kaydırılabilir">
            <div class="sl-chart-track" id="slTrack"><canvas id="slCanvas" height="300"></canvas></div>
          </div>
          <p class="sl-chart-note" id="slChartNote">Eğri, sesin karar perdesine göre ne kadar yukarıda ya da aşağıda olduğunu gösterir (100 cent ≈ 4,4 koma). Uzun bölümlerde grafiği yana kaydırın; bir yere dokunursanız kâri oradan okumaya başlar.</p>
        </div>

        <div class="sl-results" id="slResults" hidden></div>

        <details class="sl-guide">
          <summary>Nasıl kullanılır?</summary>
          <ol>
            <li>Sûreyi, başlangıç âyetini ve kâriyi seçin. "Nereye kadar" alanında belli bir âyeti ya da <strong>Durdurana kadar</strong> seçeneğini kullanın.</li>
            <li>"Kâriyi dinle" ile dinleyin; kâri âyetleri art arda okur, siz durdurana kadar devam eder. Okunan kelime işaretlenir.</li>
            <li>"Okumaya başla"ya basın, istediğiniz kadar okuyun, bitince "Bitir"e basın. Kaç âyet okuduğunuz kendiliğinden bulunur ve her âyet ayrı puanlanır.</li>
            <li>Sessiz bir ortamda, mikrofona bir karış uzaklıkta okuyun. Kulaklık kullanırsanız kârinin sesi kayda karışmaz.</li>
          </ol>
        </details>
      </section>`;

    const $ = id => host.querySelector('#' + id);
    const canvas = $('slCanvas');
    const scroller = $('slScroll');
    const trackEl = $('slTrack');
    // ref: { karar, ayahs:[{ayah, verse, rec, track, off, dur}], hz, frames, series, done, voicedDur }
    let ref = null;
    let usr = null;        // { series, cmp, refSeries, upto, perAyah }
    let refAudio = null;   // { audio, idx }
    let raf = 0;
    let loadToken = 0;
    let live = null;
    let zoom = 'scroll';
    let userScrollAt = 0;
    let chapters = [];

    const status = (t) => { $('slStatus').textContent = t; };
    const toArabicDigits = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

    QA.getChapters().then(chs => {
      chapters = chs;
      $('slSurah').innerHTML = chs.map(c => `<option value="${c.id}" ${c.id === kurraState.surah ? 'selected' : ''}>${c.id}. ${esc(c.name)} (${c.verses})</option>`).join('');
      fillAyahs();
      $('slSurah').addEventListener('change', () => { kurraState.surah = +$('slSurah').value; kurraState.ayah = 1; kurraState.until = 0; fillAyahs(); load(); });
      load();
    }).catch(() => status('Sûre listesi alınamadı. İnternet bağlantısını kontrol edin.'));

    function verseCount() { const ch = chapters.find(c => c.id === kurraState.surah); return ch ? ch.verses : 7; }
    function fillAyahs() {
      const n = verseCount();
      if (kurraState.ayah > n) kurraState.ayah = 1;
      $('slAyah').innerHTML = Array.from({ length: n }, (_, i) => `<option value="${i + 1}" ${i + 1 === kurraState.ayah ? 'selected' : ''}>${i + 1}. âyet</option>`).join('');
      fillUntil();
    }
    function fillUntil() {
      const n = verseCount();
      const a = kurraState.ayah;
      if (kurraState.until && (kurraState.until < a || kurraState.until > n)) kurraState.until = 0;
      const opts = [`<option value="0" ${!kurraState.until ? 'selected' : ''}>Durdurana kadar</option>`];
      for (let i = a; i <= Math.min(n, a + MAX_AYAHS - 1); i++) {
        opts.push(`<option value="${i}" ${kurraState.until === i ? 'selected' : ''}>${i === a ? 'Yalnız bu âyet' : i + '. âyete kadar'}</option>`);
      }
      $('slUntil').innerHTML = opts.join('');
    }
    function lastAyah() {
      const n = verseCount();
      return kurraState.until ? kurraState.until : Math.min(n, kurraState.ayah + MAX_AYAHS - 1);
    }
    $('slAyah').addEventListener('change', () => { kurraState.ayah = +$('slAyah').value; fillUntil(); load(); });
    $('slUntil').addEventListener('change', () => { kurraState.until = +$('slUntil').value; load(); });
    $('slReciter').addEventListener('change', () => { kurraState.reciter = +$('slReciter').value; load(); });
    $('slOpenMushaf').addEventListener('click', () => {
      if (typeof window.openMushafAndHighlightRule === 'function') window.openMushafAndHighlightRule(kurraState.surah, kurraState.ayah, '', '', true);
    });
    $('slFocus').addEventListener('click', () => {
      const box = $('slAyahBox');
      const on = box.classList.toggle('is-focus');
      $('slFocus').textContent = on ? 'Metni küçült' : 'Metni büyüt';
    });
    host.querySelectorAll('[data-zoom]').forEach(b => b.addEventListener('click', () => {
      zoom = b.dataset.zoom;
      host.querySelectorAll('[data-zoom]').forEach(x => x.classList.toggle('active', x === b));
      layout(); draw(currentPlaySec());
    }));
    ['wheel', 'pointerdown', 'touchstart', 'keydown'].forEach(ev => scroller.addEventListener(ev, () => { userScrollAt = performance.now(); }, { passive: true }));
    scroller.addEventListener('scroll', () => draw(currentPlaySec()), { passive: true });

    // --- Yükleme: âyetler sırayla indirilir, ilk âyet hazır olunca kullanılabilir ---
    async function load() {
      const token = ++loadToken;
      stopRef();
      usr = null; live = null;
      ref = { karar: 0, ayahs: [], hz: new Float32Array(0), frames: 0, series: { t: [], c: [] }, done: false, voicedDur: 0, hop: 0.01 };
      $('slResults').hidden = true;
      $('slPlayRef').disabled = true; $('slRecord').disabled = true;
      $('slWords').innerHTML = ''; $('slMeal').textContent = '';
      scroller.scrollLeft = 0;
      layout(); draw();
      const first = kurraState.ayah, last = lastAyah();
      for (let a = first; a <= last; a++) {
        const key = `${kurraState.surah}:${a}`;
        try {
          if (!ref.ayahs.length) status('Âyet ve kayıt alınıyor…');
          const [verse, rec] = await Promise.all([QA.getVerse(key), QA.getRecitation(kurraState.reciter, key)]);
          if (token !== loadToken) return;
          const pcm = await QA.decodeTo16k(rec.url);
          if (token !== loadToken) return;
          const track = await DSP.track(pcm.data, { onProgress: p => { if (token === loadToken && !ref.ayahs.length) status(`Perde eğrisi hesaplanıyor… %${Math.round(p * 100)}`); } });
          if (token !== loadToken) return;
          addAyah(a, verse, rec, track);
          if (ref.ayahs.length === 1) {
            ref.karar = DSP.estimateKarar(track.hz);
            if (!ref.karar) throw new Error('Kayıtta sesli bölüm bulunamadı');
            $('slPlayRef').disabled = !!recording; $('slRecord').disabled = false;
          }
          rebuildSeries();
          renderWords();
          layout(); draw(currentPlaySec());
          readyStatus(a < last);
          if (refAudio && refAudio.waiting) playIndex(refAudio.waiting, 0);
          if (ref.frames * ref.hop >= MAX_REF_SEC) break;
        } catch (err) {
          if (token !== loadToken) return;
          if (!ref.ayahs.length) { status('Bu âyetin kaydı açılamadı. Başka bir kâri seçin ya da bağlantıyı kontrol edin.'); draw(); return; }
          break;
        }
      }
      if (token !== loadToken) return;
      ref.done = true;
      readyStatus(false);
      if (refAudio && refAudio.waiting) stopRef();
    }
    function readyStatus(more) {
      if (recording || !ref || !ref.ayahs.length) return;
      if (refAudio) return;
      const n = ref.ayahs.length;
      const a0 = ref.ayahs[0].ayah, a1 = ref.ayahs[n - 1].ayah;
      const span = n === 1 ? `${a0}. âyet` : `${a0}–${a1}. âyetler`;
      status(`Hazır · ${span} · ${fmtSec(ref.frames * ref.hop)}${more ? ' · sonraki âyetler yükleniyor…' : ''}`);
    }
    function addAyah(a, verse, rec, track) {
      const off = ref.frames * ref.hop;
      ref.ayahs.push({ ayah: a, verse, rec, track, off, dur: track.hz.length * track.hop });
      const hz = new Float32Array(ref.frames + track.hz.length);
      hz.set(ref.hz, 0); hz.set(track.hz, ref.frames);
      ref.hz = hz; ref.frames = hz.length; ref.hop = track.hop;
    }
    function rebuildSeries() {
      ref.series = DSP.voicedSeries({ hz: ref.hz, hop: ref.hop }, ref.karar, 1e9);
      let v = 0; for (let i = 0; i < ref.hz.length; i++) if (ref.hz[i] > 0) v++;
      ref.voicedDur = v * ref.hop;
    }
    function totalDur() { return ref && ref.frames ? ref.frames * ref.hop : 1; }
    function ayahIndexAt(sec) {
      if (!ref) return -1;
      for (let i = ref.ayahs.length - 1; i >= 0; i--) if (sec >= ref.ayahs[i].off) return i;
      return 0;
    }

    function renderWords() {
      $('slWords').innerHTML = ref.ayahs.map((A, i) => `<span class="sl-ayah-seg" data-i="${i}">${A.verse.words.map(w => `<span class="sl-word" data-i="${i}" data-pos="${w.pos}">${esc(w.text)}</span>`).join(' ')} <span class="sl-ayah-num">${toArabicDigits(A.ayah)}</span></span>`).join(' ');
      setMeal(refAudio ? refAudio.idx : 0);
    }
    let mealIdx = -1;
    function setMeal(i) {
      if (!ref || !ref.ayahs[i] || i === mealIdx) return;
      mealIdx = i;
      const A = ref.ayahs[i];
      $('slMeal').textContent = (ref.ayahs.length > 1 ? `${A.ayah}. ` : '') + (A.verse.meal || '');
    }
    let lastWordEl = null;
    function highlightAt(sec) {
      let el = null;
      if (ref && sec !== null && sec >= 0) {
        const i = ayahIndexAt(sec);
        const A = ref.ayahs[i];
        const ms = (sec - A.off) * 1000;
        const seg = A.rec.segments.find(s => ms >= s.start && ms <= s.end);
        if (seg) el = host.querySelector(`.sl-word[data-i="${i}"][data-pos="${seg.pos}"]`);
        setMeal(i);
      }
      if (el === lastWordEl) return;
      if (lastWordEl) lastWordEl.classList.remove('is-active');
      lastWordEl = el;
      if (el) {
        el.classList.add('is-active');
        const box = $('slWords');
        const top = el.offsetTop - box.offsetTop;
        if (top < box.scrollTop || top > box.scrollTop + box.clientHeight - 40) box.scrollTo({ top: Math.max(0, top - 30), behavior: 'smooth' });
      }
    }

    // --- Kâri sesini çal: âyetler art arda, durdurulana kadar ---
    function currentPlaySec() {
      if (!refAudio || !ref || !ref.ayahs[refAudio.idx] || refAudio.waiting) return null;
      return ref.ayahs[refAudio.idx].off + (refAudio.audio ? refAudio.audio.currentTime : 0);
    }
    function setPlayBtn(on) {
      $('slPlayRef').classList.toggle('is-playing', on);
      $('slPlayRef').lastChild.textContent = on ? 'Durdur' : 'Kâriyi dinle';
    }
    function stopRef() {
      if (refAudio && refAudio.audio) { try { refAudio.audio.pause(); } catch (_) {} }
      refAudio = null;
      cancelAnimationFrame(raf);
      setPlayBtn(false);
      highlightAt(null);
      readyStatus(ref && !ref.done);
      draw();
    }
    function playIndex(i, startSec) {
      if (!ref) return;
      if (refAudio && refAudio.audio) { try { refAudio.audio.pause(); } catch (_) {} }
      if (!ref.ayahs[i]) {
        if (ref.done || i >= lastAyah() - kurraState.ayah + 1) { stopRef(); return; }
        refAudio = { audio: null, idx: i - 1, waiting: i };
        status('Sonraki âyet yükleniyor…');
        return;
      }
      const A = ref.ayahs[i];
      const audio = new Audio(A.rec.url);
      refAudio = { audio, idx: i, waiting: 0 };
      audio.addEventListener('ended', () => { if (refAudio && refAudio.audio === audio) playIndex(i + 1, 0); });
      audio.addEventListener('error', () => { if (refAudio && refAudio.audio === audio) stopRef(); });
      const begin = () => { if (startSec > 0) { try { audio.currentTime = startSec; } catch (_) {} } audio.play().catch(() => { if (refAudio && refAudio.audio === audio) stopRef(); }); };
      if (audio.readyState >= 1 || !startSec) begin(); else audio.addEventListener('loadedmetadata', begin, { once: true });
      status(ref.ayahs.length > 1 || !ref.done ? `Kâri okuyor · ${A.ayah}. âyet` : 'Kâri okuyor');
      // bir sonrakini önceden ısıt
      const nx = ref.ayahs[i + 1];
      if (nx) { const p = new Audio(); p.preload = 'auto'; p.src = nx.rec.url; }
    }
    function startPlayback(globalSec) {
      if (!ref || !ref.ayahs.length) return;
      if (window.TilavetAudioManager) window.TilavetAudioManager.notifyPlay('ses-lab');
      const i = Math.max(0, ayahIndexAt(globalSec));
      setPlayBtn(true);
      playIndex(i, Math.max(0, globalSec - ref.ayahs[i].off));
      cancelAnimationFrame(raf);
      const tick = () => {
        if (!refAudio) return;
        const sec = currentPlaySec();
        if (sec !== null) { highlightAt(sec); follow(sec); }
        draw(sec);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    $('slPlayRef').addEventListener('click', () => {
      if (refAudio) { stopRef(); return; }
      startPlayback(0);
    });
    canvas.addEventListener('click', (e) => {
      if (!ref || !ref.ayahs.length || recording) return;
      const r = canvas.getBoundingClientRect();
      const sec = invX(e.clientX - r.left);
      if (sec < 0 || sec > totalDur()) return;
      startPlayback(sec);
    });

    // --- Kayıt: kullanıcı istediği yere kadar okur ---
    let recording = null;
    $('slRecord').addEventListener('click', async () => {
      if (recording) { finishRecording(); return; }
      if (!ref || !ref.ayahs.length) return;
      stopRef();
      try {
        const mic = await openMic();
        const chunks = [];
        const pitch = makeLivePitch(mic.ctx.sampleRate);
        live = { t: [], c: [], start: performance.now() };
        usr = null;
        let peak = 0;
        let lastDraw = 0;
        attachFrameProcessor(mic, (buf) => {
          if (!recording) return;
          chunks.push(new Float32Array(buf));
          for (let i = 0; i < buf.length; i++) { const a = Math.abs(buf[i]); if (a > peak) peak = a; }
          const r = pitch(buf);
          const t = (performance.now() - live.start) / 1000;
          if (r.ap < 0.25 && r.rmsDb > -50 && r.f0 > 65 && r.f0 < 700) {
            let c = 1200 * Math.log2(r.f0 / ref.karar);
            c -= 1200 * Math.round(c / 1200);
            live.t.push(t); live.c.push(c);
          }
          const now = performance.now();
          if (now - lastDraw > 80) {
            lastDraw = now;
            status(`Kayıt sürüyor · ${fmtSec(t)} · istediğiniz yerde "Bitir"e basın`);
            if (t > totalDur()) layout();
            follow(t);
            draw();
          }
          if (t >= MAX_REC_SEC) finishRecording();
        });
        recording = { mic, chunks, sr: mic.ctx.sampleRate, getPeak: () => peak };
        $('slRecord').classList.add('is-recording');
        $('slRecord').lastChild.textContent = 'Bitir';
        $('slPlayRef').disabled = true;
        status('Kayıt sürüyor · istediğiniz kadar okuyun, bitince "Bitir"e basın');
        $('slResults').hidden = true;
        scroller.scrollLeft = 0;
        // okunacak metin hemen görünsün: kutu ekranın başına, metin en başa
        $('slWords').scrollTop = 0;
        $('slAyahBox').scrollIntoView({ block: 'start', behavior: 'smooth' });
      } catch (err) {
        status('Mikrofona erişilemedi. Tarayıcının mikrofon iznini açın.');
      }
    });

    async function finishRecording() {
      const rec = recording;
      if (!rec) return;
      recording = null;
      $('slRecord').classList.remove('is-recording');
      $('slRecord').lastChild.textContent = 'Okumaya başla';
      $('slPlayRef').disabled = false;
      const peak = rec.getPeak();
      closeMic();
      const total = rec.chunks.reduce((n, c) => n + c.length, 0);
      if (total < rec.sr * 1) { live = null; status('Kayıt çok kısa. En az bir âyet okuyun.'); draw(); return; }
      const all = new Float32Array(total);
      let o = 0; rec.chunks.forEach(c => { all.set(c, o); o += c.length; });
      rec.chunks.length = 0;
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
      const uKarar = DSP.estimateKarar(track.hz);
      if (!uKarar || voicedFrames < 60) { live = null; showResults(null, ['Kayıtta okunuş algılanamadı. Mikrofonu ve ortam sesini kontrol edin.']); draw(); return; }
      status('Okuduğunuz bölüm kâriyle eşleştiriliyor…');
      await new Promise(r => setTimeout(r, 20));
      const best = matchPrefix(track, uKarar, voicedFrames * track.hop);
      live = null;
      if (!best) { showResults(null, ['Okuyuşunuz kârinin kaydıyla eşleştirilemedi. Seçtiğiniz âyetten başlayarak okuyun.']); draw(); return; }
      if (best.k === 1 && voicedFrames * track.hop < 0.35 * best.refVoiced) issues.push('Kayıtta sesli bölüm az: âyetin tamamını okuyun.');
      usr = best;
      showResults(best, issues);
      status(`Karşılaştırma tamamlandı · ${spanText(best.k)}`);
      layout(); scroller.scrollLeft = 0; draw();
    }
    function spanText(k) {
      const a0 = ref.ayahs[0].ayah, a1 = ref.ayahs[k - 1].ayah;
      return k === 1 ? `${a0}. âyet` : `${a0}–${a1}. âyetler`;
    }

    // Kullanıcının kaç âyet okuduğunu bulur: her olası bitiş için DTW yapılır, en uyumlu olan seçilir.
    function matchPrefix(track, uKarar, usrVoiced) {
      const MAXP = 2400;
      let best = null;
      const ayahs = ref.ayahs;
      let cand = [];
      for (let k = 1; k <= ayahs.length; k++) {
        const endF = Math.round((ayahs[k - 1].off + ayahs[k - 1].dur) / ref.hop);
        const hz = ref.hz.subarray(0, endF);
        let v = 0; for (let i = 0; i < hz.length; i++) if (hz[i] > 0) v++;
        const refVoiced = v * ref.hop;
        const ratio = usrVoiced / Math.max(0.01, refVoiced);
        cand.push({ k, endF, refVoiced, ratio });
      }
      // makul hız aralığındaki adaylar; hiçbiri yoksa en yakını
      let pool = cand.filter(c => c.ratio > 0.4 && c.ratio < 2.5);
      if (!pool.length) pool = [cand.reduce((a, b) => Math.abs(Math.log(a.ratio)) < Math.abs(Math.log(b.ratio)) ? a : b)];
      pool.forEach(c => {
        const hz = ref.hz.subarray(0, c.endF);
        // karar: kârinin ilk âyetinin durağı; kullanıcıda da ilk âyete denk gelen bölümün durağı
        const kar = ref.karar;
        const firstF = Math.round(track.hz.length * (ayahs[0].dur / Math.max(0.01, c.endF * ref.hop)));
        const uk = DSP.estimateKarar(track.hz.subarray(0, Math.min(track.hz.length, Math.max(50, firstF)))) || uKarar;
        const usrAll = DSP.voicedSeries(track, uk, 1e9);
        const refFull = DSP.voicedSeries({ hz, hop: ref.hop }, kar, 1e9);
        const step = Math.max(1, Math.ceil(Math.max(refFull.t.length, usrAll.t.length) / MAXP));
        const dec = s => step === 1 ? s : { t: s.t.filter((_, i) => i % step === 0), c: s.c.filter((_, i) => i % step === 0) };
        const rS = dec(refFull), uS = dec(usrAll);
        const cmp = DSP.compare(rS, uS, c.refVoiced, usrVoiced);
        if (!cmp) return;
        // eşleşme kalitesi: genel puan, ortalama sapma cezalı
        const q = cmp.score - 0.6 * (cmp.medDev / KOMA);
        if (!best || q > best.q) best = { q, k: c.k, cmp, refS: rS, karar: kar, refVoiced: c.refVoiced, gap: Math.max(0.12, step * ref.hop * 1.6) };
      });
      if (!best) return null;
      // âyet âyet ayrıntı
      const per = [];
      for (let a = 0; a < best.k; a++) {
        const A = ref.ayahs[a], t0 = A.off, t1 = A.off + A.dur;
        const d = [];
        best.cmp.path.forEach(([i, j]) => { const t = best.refS.t[i]; if (t >= t0 && t < t1) d.push(Math.abs(best.cmp.mapped[i] - best.refS.c[i])); });
        if (!d.length) { per.push({ ayah: A.ayah, n: 0 }); return; }
        const within = d.filter(x => x <= 2 * KOMA).length / d.length;
        per.push({ ayah: A.ayah, n: d.length, within: Math.round(within * 100), dev: DSP.median(d) / KOMA, t0 });
      }
      best.perAyah = per;
      return best;
    }

    function showResults(res, issues) {
      const box = $('slResults');
      box.hidden = false;
      if (!res) {
        box.innerHTML = `<div class="sl-issues">${issues.map(i => `<p>${esc(i)}</p>`).join('')}</div>`;
        return;
      }
      const cmp = res.cmp;
      const tempoTxt = cmp.tempoRatio > 1.08 ? `kâriden %${Math.round((cmp.tempoRatio - 1) * 100)} daha yavaş` : (cmp.tempoRatio < 0.92 ? `kâriden %${Math.round((1 - cmp.tempoRatio) * 100)} daha hızlı` : 'kâriye yakın hızda');
      const devKoma = cmp.medDev / KOMA;
      const per = res.perAyah || [];
      box.innerHTML = `
        <div class="sl-score"><strong>${cmp.score}</strong><span>/ 100</span><small>genel uyum</small></div>
        <div class="sl-metrics">
          <div class="sl-metric"><span>Perde uyumu</span><strong>%${cmp.pitchScore}</strong><small>±2 koma içinde kalan bölüm</small><i style="--v:${cmp.pitchScore}%"></i></div>
          <div class="sl-metric"><span>Seyir</span><strong>%${cmp.contourScore}</strong><small>iniş-çıkış yönlerinin benzerliği</small><i style="--v:${cmp.contourScore}%"></i></div>
          <div class="sl-metric"><span>Tempo</span><strong>%${cmp.tempoScore}</strong><small>${tempoTxt}</small><i style="--v:${cmp.tempoScore}%"></i></div>
          <div class="sl-metric"><span>Ortalama sapma</span><strong>${devKoma.toFixed(1)} koma</strong><small>${Math.round(cmp.medDev)} cent (medyan)</small><i style="--v:${Math.max(0, 100 - devKoma * 12)}%"></i></div>
        </div>
        <p class="sl-span">Okuduğunuz bölüm: <strong>${spanText(res.k)}</strong> <small>(kaydınızdan kendiliğinden bulundu)</small></p>
        ${per.length > 1 ? `
          <div class="sl-per">
            <span class="sl-label">Âyet âyet</span>
            <ul>${per.map(p => p.n ? `
              <li><button type="button" data-goto="${p.t0}">
                <b>${p.ayah}. âyet</b>
                <span class="sl-per-bar"><i style="--v:${p.within}%" class="${p.within >= 70 ? 'is-ok' : p.within >= 45 ? 'is-mid' : 'is-low'}"></i></span>
                <em>%${p.within}</em><small>${p.dev.toFixed(1)} koma</small>
              </button></li>` : `<li class="is-empty"><b>${p.ayah}. âyet</b><small>eşleşme yok</small></li>`).join('')}</ul>
          </div>` : ''}
        ${issues.length ? `<div class="sl-issues">${issues.map(i => `<p>${esc(i)}</p>`).join('')}</div>` : ''}`;
      box.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => {
        const t = parseFloat(b.dataset.goto);
        if (zoom === 'scroll') scroller.scrollTo({ left: Math.max(0, t * pxPerSec() - 40), behavior: 'smooth' });
        scroller.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }));
    }

    // --- Çizim: grafik yana kaydırılır, tuval yalnız görünen bölümü çizer ---
    const padL = 48, padR = 12, padT = 22, padB = 40, H = 300;
    function viewW() { return Math.max(280, scroller.clientWidth || 800); }
    function contentDur() {
      let d = totalDur();
      if (live && live.t.length) d = Math.max(d, live.t[live.t.length - 1] + 1);
      return d;
    }
    function pxPerSec() {
      const fit = (viewW() - padL - padR) / contentDur();
      return zoom === 'fit' ? fit : Math.max(fit, PX_PER_SEC);
    }
    function layout() {
      const w = Math.ceil(padL + padR + contentDur() * pxPerSec());
      trackEl.style.width = Math.max(viewW(), w) + 'px';
      scroller.classList.toggle('is-scrollable', w > viewW() + 2);
    }
    function X(t) { return padL + t * pxPerSec() - scroller.scrollLeft; }
    function invX(x) { return (x - padL + scroller.scrollLeft) / pxPerSec(); }
    function follow(sec) {
      if (zoom !== 'scroll' || performance.now() - userScrollAt < 2500) return;
      const x = padL + sec * pxPerSec();
      const vw = viewW();
      const sl = scroller.scrollLeft;
      if (x < sl + padL || x > sl + vw * 0.7) scroller.scrollLeft = Math.max(0, x - vw * 0.3);
    }
    function draw(playSec = null) {
      const dpr = window.devicePixelRatio || 1;
      const W = viewW();
      canvas.style.width = W + 'px';
      if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) { canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); }
      const g = canvas.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bg = cssVar('--v5-surface', '#fff'), text3 = cssVar('--v5-text-3', '#888'), hair = cssVar('--v5-hairline', '#ddd');
      const refCol = cssVar('--v5-gold', '#c9973a'), usrCol = cssVar('--v5-primary', '#0f6b4f');
      g.fillStyle = bg; g.fillRect(0, 0, W, H);
      if (!ref || !ref.ayahs.length) { g.fillStyle = text3; g.font = '13px Figtree, sans-serif'; g.textAlign = 'left'; g.fillText('Kâri sesi yüklendiğinde perde eğrisi burada görünür.', padL, H / 2); return; }
      const showUsr = usr && usr.cmp;
      const rS = showUsr ? usr.refS : ref.series;
      // görünür zaman aralığı
      const tA = invX(padL) - 0.5, tB = invX(W) + 0.5;
      // y aralığı: verinin %2–%98'i (tamamı üzerinden, kaydırınca zıplamasın)
      const vals = [];
      const stepV = Math.max(1, Math.floor(rS.c.length / 3000));
      for (let i = 0; i < rS.c.length; i += stepV) vals.push(rS.c[i]);
      if (showUsr) for (let i = 0; i < usr.cmp.mapped.length; i += stepV) { const v = usr.cmp.mapped[i]; if (v !== null) vals.push(v); }
      if (live) for (let i = 0; i < live.c.length; i += 4) vals.push(live.c[i]);
      const sorted = vals.sort((a, b) => a - b);
      let lo = sorted.length ? sorted[Math.floor(sorted.length * 0.02)] : -300;
      let hi = sorted.length ? sorted[Math.floor(sorted.length * 0.98)] : 300;
      lo = Math.max(-1200, Math.floor(Math.min(lo, -200) / 100) * 100 - 100);
      hi = Math.min(1500, Math.ceil(Math.max(hi, 200) / 100) * 100 + 100);
      const Y = c => padT + (1 - (c - lo) / (hi - lo)) * (H - padT - padB);
      g.save();
      g.beginPath(); g.rect(padL, 0, W - padL, H); g.clip();
      // kelime bantları + âyet sınırları
      g.font = `15px "KFGQPC HAFS", "KFGQPC Uthman Taha Naskh", "Amiri Quran", Amiri, serif`; g.textAlign = 'center';
      let band = 0;
      ref.ayahs.forEach((A, ai) => {
        if (A.off > tB || A.off + A.dur < tA) { band += A.rec.segments.length; return; }
        A.rec.segments.forEach(s => {
          const x1 = X(A.off + s.start / 1000), x2 = X(A.off + s.end / 1000);
          if (band++ % 2 === 0) { g.fillStyle = 'rgba(127,127,127,0.06)'; g.fillRect(x1, padT, x2 - x1, H - padT - padB); }
          const w = A.verse.words.find(v => v.pos === s.pos);
          if (w && x2 - x1 > 18) { g.fillStyle = text3; g.fillText(w.text, (x1 + x2) / 2, H - 12); }
        });
        if (ref.ayahs.length > 1 || ai > 0) {
          const x = X(A.off);
          g.strokeStyle = refCol; g.globalAlpha = 0.55; g.lineWidth = 1; g.setLineDash([4, 4]);
          g.beginPath(); g.moveTo(x, padT - 4); g.lineTo(x, H - padB); g.stroke(); g.setLineDash([]); g.globalAlpha = 1;
          g.fillStyle = cssVar('--v5-gold-ink', '#8a6420'); g.font = '700 11px Figtree, sans-serif'; g.textAlign = 'left';
          g.fillText(`${A.ayah}. âyet`, x + 5, padT - 7);
          g.font = `15px "KFGQPC HAFS", "KFGQPC Uthman Taha Naskh", "Amiri Quran", Amiri, serif`; g.textAlign = 'center';
        }
      });
      // ızgara çizgileri
      for (let c = Math.ceil(lo / 100) * 100; c <= hi; c += 100) {
        g.strokeStyle = c === 0 ? refCol : hair; g.lineWidth = c === 0 ? 1.5 : 1;
        g.beginPath(); g.moveTo(padL, Y(c)); g.lineTo(W - padR, Y(c)); g.stroke();
      }
      const vis = (t, c) => { const a = [], b = []; for (let i = 0; i < t.length; i++) if (t[i] >= tA && t[i] <= tB) { a.push(t[i]); b.push(c[i]); } return [a, b]; };
      const [vt, vc] = vis(rS.t, rS.c);
      // tolerans bandı
      const tol = 2 * KOMA;
      g.fillStyle = 'rgba(201,151,58,0.14)';
      const rGap = showUsr ? usr.gap : 0.12;
      strokeSeries(vt, vc, (pts) => {
        g.beginPath();
        pts.forEach(([t, c], i) => { const x = X(t), y = Y(c + tol); if (i) g.lineTo(x, y); else g.moveTo(x, y); });
        for (let i = pts.length - 1; i >= 0; i--) { const [t, c] = pts[i]; g.lineTo(X(t), Y(c - tol)); }
        g.closePath(); g.fill();
      }, rGap);
      g.strokeStyle = refCol; g.lineWidth = 2.2; g.lineJoin = 'round';
      strokeSeries(vt, vc, pts => { g.beginPath(); pts.forEach(([t, c], i) => i ? g.lineTo(X(t), Y(c)) : g.moveTo(X(t), Y(c))); g.stroke(); }, rGap);
      if (showUsr) {
        g.strokeStyle = usrCol; g.lineWidth = 2.2;
        const tt = [], cc = [];
        usr.cmp.mapped.forEach((v, i) => { const t = rS.t[i]; if (v !== null && t >= tA && t <= tB) { tt.push(t); cc.push(v); } });
        strokeSeries(tt, cc, pts => { g.beginPath(); pts.forEach(([t, c], i) => i ? g.lineTo(X(t), Y(c)) : g.moveTo(X(t), Y(c))); g.stroke(); }, usr.gap);
        // okunmayan bölümü soldur
        const endT = ref.ayahs[usr.k - 1].off + ref.ayahs[usr.k - 1].dur;
        if (endT < tB) { g.fillStyle = bg; g.globalAlpha = 0.6; g.fillRect(Math.max(padL, X(endT)), 0, W, H - padB + 4); g.globalAlpha = 1; }
      } else if (live && live.t.length) {
        g.fillStyle = usrCol;
        for (let i = 0; i < live.t.length; i++) { const t = live.t[i]; if (t < tA || t > tB) continue; g.fillRect(X(t) - 1.5, Y(live.c[i]) - 1.5, 3, 3); }
        const tl = live.t[live.t.length - 1];
        g.strokeStyle = usrCol; g.globalAlpha = 0.5; g.lineWidth = 1; g.beginPath(); g.moveTo(X(tl), padT); g.lineTo(X(tl), H - padB); g.stroke(); g.globalAlpha = 1;
      }
      if (playSec !== null) { g.strokeStyle = cssVar('--v5-danger', '#c33'); g.lineWidth = 1.5; g.beginPath(); g.moveTo(X(playSec), padT); g.lineTo(X(playSec), H - padB); g.stroke(); }
      g.restore();
      // sabit y ekseni etiketleri
      g.fillStyle = bg; g.fillRect(0, 0, padL, H);
      g.textAlign = 'right'; g.font = '11px Figtree, sans-serif';
      for (let c = Math.ceil(lo / 100) * 100; c <= hi; c += 100) {
        if (c % 200 === 0) { g.fillStyle = c === 0 ? refCol : text3; g.fillText(c === 0 ? 'Karar' : (c > 0 ? '+' : '') + c, padL - 6, Y(c) + 4); }
      }
      // kaydırma ipucu: sağda/solda devam varsa
      const sl = scroller.scrollLeft, maxSl = scroller.scrollWidth - scroller.clientWidth;
      g.fillStyle = text3; g.font = '700 11px Figtree, sans-serif';
      if (maxSl > 2 && sl < maxSl - 2) { g.textAlign = 'right'; g.fillText('›', W - 4, H / 2); }
      if (sl > 2) { g.textAlign = 'left'; g.fillText('‹', padL + 4, H / 2); }
    }
    // Eğriyi boşluklarda böler
    function strokeSeries(t, c, fn, gap = 0.12) {
      let seg = [];
      for (let i = 0; i < t.length; i++) {
        if (seg.length && t[i] - seg[seg.length - 1][0] > gap) { if (seg.length > 1) fn(seg); seg = []; }
        seg.push([t[i], c[i]]);
      }
      if (seg.length > 1) fn(seg);
    }
    const onResize = () => { layout(); draw(currentPlaySec()); };
    window.addEventListener('resize', onResize);
    cleanupFns.push(() => { window.removeEventListener('resize', onResize); stopRef(); recording = null; loadToken++; });
    layout();
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
          <button type="button" class="sl-btn sl-btn-ghost" data-clip-key="${target().word.key}" data-clip-from="${target().word.pos}" data-clip-reciter="12" data-clip-continue id="slMeddMore"><span class="sl-ico-play"></span>Devamını dinle</button>
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
      $('slMeddMore').setAttribute('data-clip-key', t.word.key);
      $('slMeddMore').setAttribute('data-clip-from', t.word.pos);
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
  // 3.3 Perde, karar ve makam
  //   Canlı: en yakın perde + koma sapması + son 8 sn'lik ezgi çizgisi.
  //   Değerlendirme (okuma bitince, 10 ms çözünürlükle):
  //   - karar tahmini, 53 komalık perde dağılımı → 10 makam şablonuyla benzerlik
  //   - perde başına isabet ve ortalama sapma
  //   - ses bölgesi, aralık, kararlılık, güç dengesi, nefes/berraklık
  //   - kâri önerisi (12 kârinin gerçek kayıtlarından ölçülmüş değerlerle)
  // ----------------------------------------------------------------------
  // Kâri ölçümleri: 1:2, 1:5, 112:1, 108:1 kayıtlarının medyanları (Quran.com sesleri, YIN 10 ms)
  //   med: ortanca perde (Hz), range: %5–%95 aralığı (yarım ses), move: ortalama perde hareketi (cent/sn), f2: Fâtiha 2. âyet süresi (sn)
  const RECITER_PROFILES = [
    { id: 6, med: 185.6, range: 4.1, move: 626, f2: 6.2 },
    { id: 12, med: 183.6, range: 4.3, move: 895, f2: 8.2 },
    { id: 9, med: 203.2, range: 2.9, move: 575, f2: 5.5 },
    { id: 8, med: 252.4, range: 5.1, move: 546, f2: 13.0 },
    { id: 2, med: 191.6, range: 5.8, move: 678, f2: 5.3 },
    { id: 1, med: 233.7, range: 6.7, move: 630, f2: 10.1 },
    { id: 11, med: 186.6, range: 5.1, move: 630, f2: 6.0 },
    { id: 7, med: 178.8, range: 8.0, move: 809, f2: 5.5 },
    { id: 3, med: 246.6, range: 4.5, move: 490, f2: 4.4 },
    { id: 10, med: 167.7, range: 3.2, move: 400, f2: 3.5 },
    { id: 4, med: 149.9, range: 4.5, move: 720, f2: 5.0 },
    { id: 5, med: 285.0, range: 5.8, move: 785, f2: 5.4 }
  ];
  const NOTE_NAMES = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];
  function noteName(hz) {
    if (!(hz > 0)) return '—';
    const midi = Math.round(69 + 12 * Math.log2(hz / 440));
    return `${NOTE_NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
  }
  function voiceZone(med) {
    if (med < 115) return { name: 'Pes (bas) bölge', tip: 'Kalın ve derin bir ses. Kararı rahatça pes tutabilirsiniz; tiz bölgelere yavaş yavaş çıkın.' };
    if (med < 155) return { name: 'Orta-pes (bariton) bölge', tip: 'Dengeli, tok bir ses. Kararı orta perdede tutmak sesi yormaz.' };
    if (med < 210) return { name: 'Orta-tiz (tenor) bölge', tip: 'Kârilerin çoğunun okuduğu bölge. Güçlü perdeye çıkarken sesi zorlamamaya dikkat edin.' };
    if (med < 280) return { name: 'Tiz (alto) bölge', tip: 'Parlak bir ses. Erkek kârileri bir oktav üstten takip etmek doğaldır.' };
    return { name: 'Çok tiz (soprano) bölge', tip: 'Çok parlak bir ses. Kararı biraz pes tutarsanız uzun okumalarda daha az yorulursunuz.' };
  }

  // Makam şablonu: durağa göre 53 komalık dairede derece konumları (çıkıcı + inici)
  function makamTemplate(m) {
    const T = new Float32Array(53);
    const durak = typeof m.durak === 'number' ? m.durak : (m.dizi.cikici || m.dizi)[0];
    const degs = new Set([...(m.dizi.cikici || m.dizi || []), ...((m.dizi && m.dizi.inici) || [])].map(a => (((a - durak) % 53) + 53) % 53));
    const guclu = typeof m.guclu === 'number' ? (((m.guclu - durak) % 53) + 53) % 53 : -1;
    degs.forEach(d => {
      const w = d === 0 ? 1.6 : (d === guclu ? 1.3 : 1);
      for (let k = -3; k <= 3; k++) T[(d + k + 53) % 53] += w * Math.exp(-(k * k) / (2 * 1.1 * 1.1));
    });
    return { T, degs: [...degs].sort((a, b) => a - b), durak, guclu };
  }
  function cosine(a, b, shift) {
    let s = 0, na = 0, nb = 0;
    for (let i = 0; i < 53; i++) { const x = a[(i + shift + 53) % 53], y = b[i]; s += x * y; na += x * x; nb += y * y; }
    return na && nb ? s / Math.sqrt(na * nb) : 0;
  }
  // hz dizisi (10 ms) + karar → perde dağılımı ve makam benzerlikleri
  DSP.makamScores = function (hz, kararHz, makams) {
    const pcd = new Float32Array(53);
    const pcs = [];
    for (let i = 0; i < hz.length; i++) {
      if (!(hz[i] > 0)) continue;
      const k = 1200 * Math.log2(hz[i] / kararHz) / KOMA;
      const pc = ((k % 53) + 53) % 53;
      pcs.push(pc);
      pcd[Math.round(pc) % 53] += 1;
    }
    const n = pcs.length;
    if (!n) return { pcd, scores: [] };
    for (let i = 0; i < 53; i++) pcd[i] /= n;
    // Örnekleme: uzun kayıtlarda hesap yükünü sınırla
    const step = Math.max(1, Math.floor(n / 4000));
    const scores = makams.map(m => {
      const tp = makamTemplate(m);
      let best = -1, bestShift = 0, bestFit = 0, bestShape = 0;
      for (let sh = -1; sh <= 1; sh++) {
        // uyum: her sesin en yakın dereceye uzaklığı (koma) → exp(-d²/2σ²), σ = 0,9 koma
        let fit = 0, cnt = 0;
        for (let i = 0; i < n; i += step) {
          const pc = pcs[i] + sh;
          let dmin = 99;
          for (const d of tp.degs) { let dv = Math.abs(pc - d); if (dv > 26.5) dv = 53 - dv; if (dv < dmin) dmin = dv; }
          fit += Math.exp(-(dmin * dmin) / (2 * 0.81)); cnt++;
        }
        fit /= Math.max(1, cnt);
        const shape = cosine(pcd, tp.T, sh); // karar ve güçlü vurgusu
        const sc = (0.75 * fit + 0.25 * shape) * (sh === 0 ? 1 : 0.97);
        if (sc > best) { best = sc; bestShift = sh; bestFit = fit; bestShape = shape; }
      }
      return { id: m.id, name: (m.names && m.names.tr) || m.id, score: best, fit: bestFit, shape: bestShape, shift: bestShift, tp };
    }).sort((a, b) => b.score - a.score);
    return { pcd, scores };
  };
  // Perde başına isabet: her çerçeve en yakın dereceye atanır
  DSP.degreeStats = function (hz, kararHz, tp, shift) {
    const stats = tp.degs.map(d => ({ d, n: 0, sum: 0, hit: 0 }));
    let total = 0, hits = 0;
    for (let i = 0; i < hz.length; i++) {
      if (!(hz[i] > 0)) continue;
      const k = 1200 * Math.log2(hz[i] / kararHz) / KOMA + shift;
      const pc = ((k % 53) + 53) % 53;
      let bi = 0, bd = 99;
      stats.forEach((s, j) => { let dv = pc - s.d; if (dv > 26.5) dv -= 53; if (dv < -26.5) dv += 53; if (Math.abs(dv) < Math.abs(bd)) { bd = dv; bi = j; } });
      const s = stats[bi]; s.n++; s.sum += bd; total++;
      if (Math.abs(bd) <= 1) { s.hit++; hits++; }
    }
    stats.forEach(s => { s.share = total ? s.n / total : 0; s.mean = s.n ? s.sum / s.n : 0; s.acc = s.n ? s.hit / s.n : 0; });
    return { stats, accuracy: total ? hits / total : 0 };
  };
  // Ses dengesi: kararlılık, güç, berraklık, nefes uzunluğu
  DSP.voiceBalance = function (track) {
    const hz = track.hz, db = track.rmsDb, ap = track.ap || null;
    const vc = [], vdb = [], vap = [];
    const runs = [];
    let run = 0;
    for (let i = 0; i < hz.length; i++) {
      if (hz[i] > 0) { vc.push(1200 * Math.log2(hz[i] / 55)); vdb.push(db[i]); if (ap) vap.push(ap[i]); run++; }
      else { if (run) runs.push(run); run = 0; vc.push(NaN); }
    }
    if (run) runs.push(run);
    // kararlılık: 150 ms pencerelerde (yalnız tutulan seslerde) standart sapma
    const sds = [];
    for (let i = 0; i + 15 <= vc.length; i += 8) {
      const w = vc.slice(i, i + 15);
      if (w.some(isNaN)) continue;
      const lo = Math.min(...w), hi = Math.max(...w);
      if (hi - lo > 120) continue; // perde geçişi; tutulan ses değil
      const m = w.reduce((a, b) => a + b, 0) / w.length;
      sds.push(Math.sqrt(w.reduce((a, b) => a + (b - m) * (b - m), 0) / w.length));
    }
    const mdb = vdb.reduce((a, b) => a + b, 0) / Math.max(1, vdb.length);
    const sdDb = Math.sqrt(vdb.reduce((a, b) => a + (b - mdb) * (b - mdb), 0) / Math.max(1, vdb.length));
    const longRuns = runs.filter(r => r >= 30).map(r => r / 100);
    return {
      stability: sds.length ? DSP.median(sds) : null,
      loudnessSd: vdb.length ? sdDb : null,
      breathiness: vap.length ? DSP.median(vap) : null,
      phrase: longRuns.length ? longRuns.reduce((a, b) => a + b, 0) / longRuns.length : null,
      longest: longRuns.length ? Math.max(...longRuns) : null,
      voicedSec: vdb.length / 100
    };
  };
  // Kâri önerisi: perde bölgesi (oktav katlı), ezgi genişliği/hareketi ve varsa hız
  function suggestReciters(user) {
    const QA = window.QuranAudio;
    const fold = x => { let v = x % 12; if (v > 6) v -= 12; if (v < -6) v += 12; return v; };
    return RECITER_PROFILES.map(p => {
      const reg = Math.abs(fold(12 * Math.log2(user.med / p.med)));
      const octave = Math.round(12 * Math.log2(user.med / p.med) / 12);
      const style = Math.abs(user.range - p.range) / 4 + Math.abs(user.move - p.move) / 400;
      const tempo = user.f2 ? Math.abs(Math.log(user.f2 / p.f2)) / 0.4 : null;
      const cost = reg / 2 * 0.55 + style * 0.25 + (tempo === null ? 0 : tempo * 0.2);
      const r = (QA && QA.RECITERS.find(x => x.id === p.id)) || { name: '', style: '' };
      const why = [];
      why.push(reg <= 1 ? 'Ses bölgeniz bu kâriyle neredeyse aynı' : reg <= 2.5 ? `Ses bölgeniz yakın (yaklaşık ${reg.toFixed(1)} yarım ses fark)` : `Ses bölgesi ${reg.toFixed(1)} yarım ses farklı`);
      if (octave !== 0) why.push(octave > 0 ? 'bir oktav üstten takip edebilirsiniz' : 'bir oktav pesten takip edebilirsiniz');
      why.push(style < 0.6 ? 'ezgi genişliği ve süsleme yoğunluğu benzer' : (user.move < p.move ? 'süslemeleri sizden daha zengin; nağme öğrenmek için iyi bir örnek' : 'daha sade okuyor; perdeleri netleştirmek için iyi bir örnek'));
      if (tempo !== null) why.push(tempo < 0.5 ? 'okuma hızınız da benzer' : (user.f2 < p.f2 ? 'sizden daha ağır okuyor; tertîl için iyi bir örnek' : 'sizden daha akıcı okuyor'));
      return { id: p.id, name: r.name, style: r.style, cost, why };
    }).sort((a, b) => a.cost - b.cost).slice(0, 2);
  }

  const tunerState = { makam: 'auto', text: 'free', kararHz: 0, manualKarar: false, result: null };
  function Tuner(host) {
    const data = (window.TilavetAkademiDefaultData && window.TilavetAkademiDefaultData.makamlar) || [];
    const makams = data.filter(m => m.dizi && (m.dizi.cikici || Array.isArray(m.dizi)));
    const T = window.MakamTuning || null;
    const perdeName = (abs) => (T && T.perdeAdi && T.perdeAdi(abs)) || '';
    const MAXSEC = 300, MINVOICED = 8;
    host.innerHTML = `
      <section class="sl-card">
        <div class="sl-picker">
          <label class="sl-field"><span>Makam</span><select id="slMakam"><option value="auto" ${tunerState.makam === 'auto' ? 'selected' : ''}>Otomatik bul</option>${makams.map(m => `<option value="${m.id}" ${m.id === tunerState.makam ? 'selected' : ''}>${esc(m.names.tr)}</option>`).join('')}</select></label>
          <label class="sl-field"><span>Okuyacağınız metin</span><select id="slText"><option value="free" ${tunerState.text === 'free' ? 'selected' : ''}>Serbest okuma (bir âyet ya da seyir)</option><option value="f2" ${tunerState.text === 'f2' ? 'selected' : ''}>Fâtiha 2. âyet (okuma hızı da ölçülür)</option></select></label>
        </div>
        <div class="sl-controls">
          <button type="button" class="sl-btn sl-btn-record" id="slTunerStart"><span class="sl-ico-rec"></span><span>Okumaya başla</span></button>
          <span class="sl-status" id="slTunerStatus">En az 10–15 saniye, rahat bir sesle okuyun. Sonra "Bitir" deyin.</span>
        </div>
        <div class="tn-live">
          <div class="tn-now">
            <span class="tn-kicker">Şu an</span>
            <strong id="slTunerName">—</strong>
            <span id="slTunerHz" class="tn-hz">Okumaya başlayınca perdeniz burada görünür</span>
          </div>
          <div class="tn-meter">
            <div class="sl-needle"><div class="sl-needle-scale">${[-4, -3, -2, -1, 0, 1, 2, 3, 4].map(k => `<span style="left:${(k + 4) / 8 * 100}%">${k > 0 ? '+' + k : k}</span>`).join('')}</div><i id="slNeedle" style="opacity:.3"></i></div>
            <div class="tn-meter-legend"><span>pes</span><span>±1 koma</span><span>tiz</span></div>
          </div>
          <div class="tn-progress"><span id="slTunerFill"></span></div>
          <canvas id="slTunerCanvas" height="240" aria-label="Son 8 saniyenin perde çizgisi"></canvas>
        </div>
        <button type="button" class="sl-link" id="slSetKarar">${tunerState.manualKarar ? `Karar elle belirlendi: ${tunerState.kararHz.toFixed(1)} Hz (${noteName(tunerState.kararHz)}). Değiştir` : 'Kararımı elle belirlemek istiyorum'}</button>
      </section>
      <div id="slTunerResult"></div>
      <details class="sl-guide">
        <summary>Nasıl ölçülür, sonuçlar ne anlama gelir?</summary>
        <ul>
          <li><b>Karar:</b> Okuyuşun sonunda en çok dinlendiğiniz perde. Elle belirlemezseniz son cümlelerinizden hesaplanır; okumayı kararda bitirin.</li>
          <li><b>Makam yakınlığı:</b> Perdelerinizin 53 komalık dağılımı her makamın dizisiyle karşılaştırılır. Uşşak–Bayâtî gibi dizisi çok benzeyen makamlar yakın puan alır; seyir ve çeşniyi yalnız kulak ayırt eder.</li>
          <li><b>Perde isabeti:</b> Seslerinizin makam perdelerine ±1 koma yakınlıkta kaldığı oran. Pes/tiz etiketi, o perdeyi ortalama ne kadar kaçırdığınızı gösterir.</li>
          <li><b>Kararlılık:</b> Tutulan seslerde perdenin titreme miktarı (cent). 10'un altı çok iyi, 25'in üstü titrek.</li>
          <li>Sessiz bir odada, mikrofona 20–30 cm uzaklıkta okuyun. Ölçüm bir yardımcıdır; hocanın kulağının yerini tutmaz.</li>
        </ul>
      </details>`;
    const $ = id => host.querySelector('#' + id);
    const canvas = $('slTunerCanvas');
    const live = []; // {t, c(abs cent re 55 Hz)}
    let liveHz = []; // ~46 ms aralıklı, canlı karar ve makam tahmini için
    let liveMakam = null, liveKarar = 0, lastGuess = 0;
    $('slMakam').addEventListener('change', () => { tunerState.makam = $('slMakam').value; liveMakam = null; if (tunerState.result) analyze(tunerState.result.track); });
    $('slText').addEventListener('change', () => { tunerState.text = $('slText').value; });

    const chosenMakam = () => tunerState.makam === 'auto' ? (liveMakam || makams.find(m => m.id === 'rast')) : makams.find(m => m.id === tunerState.makam);
    function degreesOf(m) {
      if (!m) return [];
      const tp = makamTemplate(m);
      return tp.degs.map(d => ({ d, name: perdeName(tp.durak + d) || perdeName(tp.durak + d - 53) || '', isDurak: d === 0, isGuclu: d === tp.guclu }));
    }
    function nearestDeg(centsRel, m) {
      let best = null;
      degreesOf(m).forEach(dg => {
        for (let o = -2; o <= 2; o++) {
          const c = dg.d * KOMA + o * 1200, dev = centsRel - c;
          if (!best || Math.abs(dev) < Math.abs(best.dev)) best = { ...dg, dev, c };
        }
      });
      return best;
    }
    function drawLive() {
      const dpr = window.devicePixelRatio || 1;
      const W = Math.max(280, canvas.clientWidth || 600), H = 240;
      if (canvas.width !== Math.round(W * dpr)) { canvas.width = Math.round(W * dpr); canvas.height = H * dpr; }
      const g = canvas.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      const kar = tunerState.kararHz || liveKarar;
      const pts = live.filter(p => performance.now() - p.t < 8000);
      if (!kar || !pts.length) {
        g.fillStyle = cssVar('--v5-text-3', '#888'); g.font = '13px Figtree, sans-serif'; g.textAlign = 'center';
        g.fillText(pts.length ? 'Karar hesaplanıyor…' : 'Ezgi çizginiz burada akar', W / 2, H / 2);
        return;
      }
      const kc = 1200 * Math.log2(kar / 55);
      const rel = pts.map(p => p.c - kc);
      let lo = Math.min(-150, ...rel) - 80, hi = Math.max(900, ...rel) + 80;
      const Y = c => 12 + (1 - (c - lo) / (hi - lo)) * (H - 24);
      const labelW = 74;
      g.font = '12px Figtree, sans-serif'; g.textAlign = 'left'; g.textBaseline = 'middle';
      let lastY = -99;
      const m = chosenMakam();
      const lines = [];
      degreesOf(m).forEach(dg => { for (let o = -1; o <= 2; o++) { const c = dg.d * KOMA + o * 1200; if (c >= lo && c <= hi) lines.push({ ...dg, c }); } });
      lines.sort((a, b) => b.c - a.c).forEach(dg => {
        const y = Y(dg.c);
        g.strokeStyle = dg.isDurak ? cssVar('--v5-gold', '#c9973a') : cssVar('--v5-hairline', '#ddd');
        g.lineWidth = dg.isDurak || dg.isGuclu ? 1.5 : 1;
        g.beginPath(); g.moveTo(labelW, y); g.lineTo(W, y); g.stroke();
        if (y - lastY >= 14) { g.fillStyle = dg.isDurak ? cssVar('--v5-gold-ink', '#8a6416') : cssVar('--v5-text-3', '#888'); g.fillText(dg.name || '', 4, y); lastY = y; }
      });
      g.strokeStyle = cssVar('--v5-primary-ink', '#0f6b4f'); g.lineWidth = 2.5; g.lineJoin = 'round';
      g.beginPath();
      const now = performance.now();
      let prev = null;
      pts.forEach((p, i) => {
        const x = labelW + (1 - (now - p.t) / 8000) * (W - labelW);
        const y = Y(rel[i]);
        if (prev && p.t - prev.t < 160 && Math.abs(rel[i] - prev.r) < 400) g.lineTo(x, y); else g.moveTo(x, y);
        prev = { t: p.t, r: rel[i] };
      });
      g.stroke();
    }

    let mode = null, chunks = [], chunkLen = 0, micSr = 48000, startT = 0, voicedFrames = 0, kararSamples = [];
    function setBtn(rec) {
      const b = $('slTunerStart');
      b.classList.toggle('is-recording', rec);
      b.lastChild.textContent = rec ? 'Bitir ve değerlendir' : 'Okumaya başla';
    }
    async function start(m) {
      const mic = await openMic();
      micSr = mic.ctx.sampleRate;
      const pitch = makeLivePitch(micSr);
      mode = m; chunks = []; chunkLen = 0; startT = performance.now(); voicedFrames = 0; kararSamples = [];
      live.length = 0; liveHz = []; liveKarar = 0; liveMakam = null;
      attachFrameProcessor(mic, (buf) => {
        if (!mode) return;
        const r = pitch(buf);
        const ok = r.ap < 0.25 && r.rmsDb > -50 && r.f0 > 65 && r.f0 < 700;
        if (mode === 'karar') {
          if (ok) kararSamples.push(r.f0);
          $('slTunerStatus').textContent = `Dinleniyor… %${Math.min(100, Math.round(kararSamples.length / 45 * 100))}`;
          if (kararSamples.length >= 45) {
            tunerState.kararHz = 55 * Math.pow(2, DSP.median(kararSamples.map(f => 1200 * Math.log2(f / 55))) / 1200);
            tunerState.manualKarar = true;
            stop();
            $('slSetKarar').textContent = `Karar elle belirlendi: ${tunerState.kararHz.toFixed(1)} Hz (${noteName(tunerState.kararHz)}). Değiştir`;
            $('slTunerStatus').textContent = 'Karar kaydedildi. Şimdi "Okumaya başla" ile okuyun.';
          }
          return;
        }
        chunks.push(new Float32Array(buf)); chunkLen += buf.length;
        const el = (performance.now() - startT) / 1000;
        liveHz.push(ok ? r.f0 : 0);
        if (ok) { voicedFrames++; live.push({ t: performance.now(), c: 1200 * Math.log2(r.f0 / 55) }); }
        while (live.length && performance.now() - live[0].t > 8000) live.shift();
        const vsec = voicedFrames * buf.length / micSr;
        $('slTunerFill').style.width = `${Math.min(100, vsec / 12 * 100)}%`;
        $('slTunerStatus').textContent = `${el.toFixed(0)} sn · sesli ${vsec.toFixed(1)} sn ${vsec < MINVOICED ? `(en az ${MINVOICED} sn gerekli)` : '· yeterli, istediğiniz an bitirebilirsiniz'}`;
        // canlı karar ve makam tahmini (2 sn'de bir)
        if (!tunerState.manualKarar && performance.now() - lastGuess > 2000 && voicedFrames > 40) {
          lastGuess = performance.now();
          liveKarar = DSP.estimateKarar(Float32Array.from(liveHz));
          if (tunerState.makam === 'auto' && liveKarar) {
            const ms = DSP.makamScores(liveHz, liveKarar, makams);
            if (ms.scores[0]) liveMakam = makams.find(x => x.id === ms.scores[0].id);
          }
        }
        const kar = tunerState.kararHz || liveKarar;
        if (!ok || !kar) { $('slNeedle').style.opacity = 0.3; drawLive(); return; }
        const rel = 1200 * Math.log2(r.f0 / kar);
        const nb = nearestDeg(rel, chosenMakam());
        if (nb) {
          const devK = Math.max(-4, Math.min(4, nb.dev / KOMA));
          $('slTunerName').textContent = nb.name || '—';
          $('slTunerHz').textContent = `${r.f0.toFixed(1)} Hz · ${noteName(r.f0)} · ${Math.abs(devK) < 0.25 ? 'tam perdede' : `${Math.abs(devK).toFixed(1)} koma ${devK < 0 ? 'pes' : 'tiz'}`}${tunerState.makam === 'auto' && liveMakam ? ` · ${liveMakam.names.tr} dizisine göre` : ''}`;
          $('slNeedle').style.opacity = 1;
          $('slNeedle').style.left = `${(devK + 4) / 8 * 100}%`;
          $('slNeedle').classList.toggle('is-ok', Math.abs(devK) <= 1);
        }
        drawLive();
        if (el >= MAXSEC) finish();
      });
    }
    function stop() { mode = null; closeMic(); setBtn(false); }
    async function finish() {
      if (mode !== 'live') return;
      mode = null;
      const sr = micSr, total = chunkLen;
      closeMic(); setBtn(false);
      const vsec = voicedFrames * 2048 / sr;
      if (vsec < 3) { $('slTunerStatus').textContent = 'Yeterli ses alınamadı. Mikrofona biraz yaklaşıp daha uzun okuyun.'; return; }
      $('slTunerStatus').textContent = 'Değerlendiriliyor…';
      try {
        const ab = new AudioBuffer({ length: total, numberOfChannels: 1, sampleRate: sr });
        const ch = ab.getChannelData(0); let o = 0;
        chunks.forEach(c => { ch.set(c, o); o += c.length; });
        chunks = [];
        const pcm = await window.QuranAudio.resampleTo16k(ab);
        const track = await DSP.track(pcm.data, { fmax: 700 });
        analyze(track);
      } catch (e) {
        $('slTunerStatus').textContent = 'Değerlendirme yapılamadı: ' + (e && e.message ? e.message : 'bilinmeyen hata');
      }
    }

    function bar(pct, cls = '') { return `<span class="tn-bar ${cls}"><i style="width:${Math.max(2, Math.min(100, pct))}%"></i></span>`; }
    function verdict(v, good, ok) { return v === null ? ['—', ''] : v <= good ? ['Çok iyi', 'is-good'] : v <= ok ? ['İyi', 'is-ok'] : ['Geliştirilebilir', 'is-warn']; }

    function analyze(track) {
      const hz = track.hz;
      const voiced = []; for (let i = 0; i < hz.length; i++) if (hz[i] > 0) voiced.push(hz[i]);
      const out = $('slTunerResult');
      if (voiced.length < 300) { $('slTunerStatus').textContent = 'Değerlendirme için yeterli sesli bölüm yok (en az 3 saniye).'; out.innerHTML = ''; return; }
      const kararHz = tunerState.manualKarar && tunerState.kararHz ? tunerState.kararHz : DSP.estimateKarar(hz);
      const ms = DSP.makamScores(hz, kararHz, makams);
      const top = ms.scores[0];
      const picked = tunerState.makam === 'auto' ? top : (ms.scores.find(s => s.id === tunerState.makam) || top);
      const ds = DSP.degreeStats(hz, kararHz, picked.tp, picked.shift);
      const bal = DSP.voiceBalance(track);
      const cents = voiced.map(f => 1200 * Math.log2(f / 55)).sort((a, b) => a - b);
      const q = p => cents[Math.floor(p * (cents.length - 1))];
      const med = 55 * Math.pow(2, q(0.5) / 1200);
      const lo = 55 * Math.pow(2, q(0.05) / 1200), hiF = 55 * Math.pow(2, q(0.95) / 1200);
      const range = (q(0.95) - q(0.05)) / 100;
      let mv = 0, mn = 0;
      for (let i = 1; i < hz.length; i++) if (hz[i] > 0 && hz[i - 1] > 0) { const d = Math.abs(1200 * Math.log2(hz[i] / hz[i - 1])); if (d < 200) { mv += d; mn++; } }
      const move = mn ? mv / mn * 100 : 0;
      let f2 = null;
      if (tunerState.text === 'f2') { let a = -1, b = -1; for (let i = 0; i < hz.length; i++) if (hz[i] > 0) { if (a < 0) a = i; b = i; } if (a >= 0) f2 = (b - a) / 100; }
      const zone = voiceZone(med);
      const recs = suggestReciters({ med, range, move, f2 });
      const lowData = bal.voicedSec < MINVOICED;
      const margin = ms.scores[1] ? top.score - ms.scores[1].score : 1;
      tunerState.result = { track };
      $('slTunerStatus').textContent = `Değerlendirme hazır · ${bal.voicedSec.toFixed(1)} sn sesli okuma`;

      const stabV = verdict(bal.stability, 10, 25);
      const loudV = verdict(bal.loudnessSd, 4, 7);
      const brV = verdict(bal.breathiness, 0.08, 0.15);
      const accPct = Math.round(ds.accuracy * 100);
      const accV = accPct >= 70 ? ['Çok iyi', 'is-good'] : accPct >= 50 ? ['İyi', 'is-ok'] : ['Geliştirilebilir', 'is-warn'];
      const ladder = ds.stats.slice().sort((a, b) => b.d - a.d);
      out.innerHTML = `
        <section class="sl-card tn-res">
          <div class="tn-res-head">
            <div><span class="tn-kicker">Makam yakınlığı</span><h3>${tunerState.makam === 'auto' ? `En yakın: ${esc(top.name)}` : `${esc(picked.name)} dizisine göre`}</h3></div>
            <span class="tn-pill ${lowData || margin < 0.02 ? 'is-warn' : 'is-good'}">${lowData ? 'Az veri: daha uzun okuyun' : margin < 0.02 ? 'Yakın adaylar var' : 'Belirgin'}</span>
          </div>
          <ol class="tn-chart">
            ${ms.scores.map(s => `<li class="${s.id === picked.id ? 'is-top' : ''}"><span class="tn-chart-name">${esc(s.name)}</span>${bar(Math.round(s.score * 100))}<b>%${Math.round(s.score * 100)}</b></li>`).join('')}
          </ol>
          <p class="tn-note">Karar: <b>${kararHz.toFixed(1)} Hz (${noteName(kararHz)})</b>${tunerState.manualKarar ? ' · elle belirlendi' : ' · okuyuşun sonundan hesaplandı'}. Uşşak, Bayâtî ve Nevâ gibi dizisi benzer makamları yalnız seyir ayırır.</p>
        </section>

        <section class="sl-card tn-res">
          <div class="tn-res-head">
            <div><span class="tn-kicker">Perdelere isabet · ${esc(picked.name)}</span><h3>%${accPct} doğru perdede</h3></div>
            <span class="tn-pill ${accV[1]}">${accV[0]}</span>
          </div>
          <ul class="tn-ladder">
            ${ladder.map(s => {
              const name = perdeName(picked.tp.durak + s.d) || '';
              const tag = s.n < 15 ? '<em>kullanılmadı</em>' : Math.abs(s.mean) < 0.5 ? '<em class="is-good">tam</em>' : `<em class="${Math.abs(s.mean) > 1.5 ? 'is-warn' : 'is-ok'}">${Math.abs(s.mean).toFixed(1)} koma ${s.mean < 0 ? 'pes' : 'tiz'}</em>`;
              return `<li class="${s.d === 0 ? 'is-durak' : ''}${s.d === picked.tp.guclu ? ' is-guclu' : ''}"><span class="tn-ladder-name">${esc(name)}${s.d === 0 ? ' <small>karar</small>' : s.d === picked.tp.guclu ? ' <small>güçlü</small>' : ''}</span>${bar(s.share * 100 * 3)}<span class="tn-ladder-val">%${Math.round(s.share * 100)}</span>${tag}</li>`;
            }).join('')}
          </ul>
          <p class="tn-note">Çubuk, o perdede geçirdiğiniz süreyi; etiket ise perdeyi ortalama ne kadar kaçırdığınızı gösterir.</p>
        </section>

        <div class="tn-grid">
          <section class="sl-card tn-res">
            <span class="tn-kicker">Sesiniz</span>
            <h3>${zone.name}</h3>
            <dl class="tn-facts">
              <div><dt>Ortanca perde</dt><dd>${med.toFixed(0)} Hz · ${noteName(med)}</dd></div>
              <div><dt>Kullandığınız aralık</dt><dd>${noteName(lo)} – ${noteName(hiF)} · ${range.toFixed(1)} yarım ses</dd></div>
              <div><dt>Karar</dt><dd>${noteName(kararHz)}</dd></div>
              ${f2 ? `<div><dt>Fâtiha 2. âyet süresi</dt><dd>${f2.toFixed(1)} sn</dd></div>` : ''}
            </dl>
            <p class="tn-note">${zone.tip}</p>
          </section>
          <section class="sl-card tn-res">
            <span class="tn-kicker">Ses dengesi</span>
            <ul class="tn-balance">
              <li><span>Perde isabeti</span>${bar(accPct, accV[1])}<b class="${accV[1]}">${accV[0]}</b></li>
              <li><span>Kararlılık${bal.stability !== null ? ` <small>${bal.stability.toFixed(0)} cent titreme</small>` : ''}</span>${bar(bal.stability === null ? 0 : 100 - Math.min(100, bal.stability * 3), stabV[1])}<b class="${stabV[1]}">${stabV[0]}</b></li>
              <li><span>Güç dengesi${bal.loudnessSd !== null ? ` <small>±${bal.loudnessSd.toFixed(1)} dB</small>` : ''}</span>${bar(bal.loudnessSd === null ? 0 : 100 - Math.min(100, bal.loudnessSd * 10), loudV[1])}<b class="${loudV[1]}">${loudV[0]}</b></li>
              <li><span>Berraklık${bal.breathiness !== null ? ` <small>nefes payı ${(bal.breathiness * 100).toFixed(0)}</small>` : ''}</span>${bar(bal.breathiness === null ? 0 : 100 - Math.min(100, bal.breathiness * 500), brV[1])}<b class="${brV[1]}">${brV[0]}</b></li>
              <li><span>Nefes uzunluğu${bal.phrase ? ` <small>ort. ${bal.phrase.toFixed(1)} sn, en uzun ${bal.longest.toFixed(1)} sn</small>` : ''}</span>${bar(bal.phrase ? Math.min(100, bal.phrase / 6 * 100) : 0)}<b>${bal.phrase ? (bal.phrase >= 4 ? 'Uzun' : bal.phrase >= 2 ? 'Orta' : 'Kısa') : '—'}</b></li>
            </ul>
            <p class="tn-note">${[
              stabV[1] === 'is-warn' ? 'Tutulan seslerde perde titriyor: uzun bir "â" ile sesi düz tutma çalışın.' : '',
              loudV[1] === 'is-warn' ? 'Ses gücü dalgalanıyor: nefesi karından, eşit basınçla verin.' : '',
              brV[1] === 'is-warn' ? 'Seste nefes payı yüksek: sesi fısıltıya kaçırmadan, tok verin.' : '',
              accV[1] === 'is-warn' ? 'Perdeleri kaçırıyorsunuz: önce kararı, sonra dizinin ilk dört perdesini yavaşça çalışın.' : ''
            ].filter(Boolean).join(' ') || 'Ses dengeniz iyi. Daha uzun bölümler ve farklı makamlarla devam edin.'}</p>
          </section>
        </div>

        <section class="sl-card tn-res">
          <span class="tn-kicker">Size önerilen kâriler</span>
          <h3>Ses tonunuza ve okuyuşunuza en yakın</h3>
          <div class="tn-recs">
            ${recs.map(r => `
              <article class="tn-rec">
                <strong>${esc(r.name)}</strong><span class="tn-rec-style">${esc(r.style)}</span>
                <ul>${r.why.map(w => `<li>${esc(w.charAt(0).toUpperCase() + w.slice(1))}</li>`).join('')}</ul>
                <div class="tn-rec-actions">
                  <button type="button" class="sl-btn sl-btn-ghost" data-clip-key="1:2" data-clip-reciter="${r.id}" data-clip-continue aria-pressed="false" title="Durdurana kadar okur">Dinle</button>
                  <button type="button" class="sl-btn sl-btn-ghost" data-tn-compare="${r.id}">Bu kâriyle karşılaştır</button>
                </div>
              </article>`).join('')}
          </div>
          <p class="tn-note">Öneri, 12 kârinin aynı âyetlerdeki kayıtlarından ölçülen perde bölgesi, ezgi genişliği${f2 ? ', okuma hızı' : ''} ile sizin ölçümlerinizin karşılaştırılmasıyla yapılır.</p>
        </section>`;
      out.querySelectorAll('[data-tn-compare]').forEach(b => b.addEventListener('click', () => {
        kurraState.reciter = parseInt(b.getAttribute('data-tn-compare'), 10);
        current = 'kurra';
        if (options.onStation) options.onStation(current);
        render();
      }));
      out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    $('slSetKarar').addEventListener('click', async () => {
      stop();
      try { await start('karar'); $('slTunerStatus').textContent = 'Rahat bir sesle 2 saniye "â" deyin…'; } catch (_) { $('slTunerStatus').textContent = 'Mikrofona erişilemedi. Tarayıcıdan izin verin.'; }
    });
    $('slTunerStart').addEventListener('click', async () => {
      if (mode === 'live') { finish(); return; }
      try { await start('live'); setBtn(true); } catch (_) { $('slTunerStatus').textContent = 'Mikrofona erişilemedi. Adres çubuğundaki kilit simgesinden izin verin.'; }
    });
    drawLive();
    const ro = new ResizeObserver(() => drawLive()); ro.observe(canvas);
    cleanupFns.push(() => { mode = null; ro.disconnect(); });
    if (tunerState.result) analyze(tunerState.result.track);
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
