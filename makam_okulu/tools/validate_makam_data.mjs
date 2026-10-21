// makam_okulu/tools/validate_makam_data.mjs
// Kullanım:  node tools/validate_makam_data.mjs data/makamlar.json [--strict]
// Çıkış kodu: 0 = temiz, 1 = hata (ya da --strict iken uyarı) var.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { perdeAdi, OCTAVE_KOMA, allAbs, hzOfDegree, hzOfAbs } from '../audio/tuning.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Argüman kontrolü
const args = process.argv.slice(2);
const strict = args.includes('--strict');
const fileArg = args.find(a => !a.startsWith('--')) ?? path.resolve(__dirname, '../data/makamlar.json');
const filePath = path.isAbsolute(fileArg) ? fileArg : path.resolve(process.cwd(), fileArg);

if (!fs.existsSync(filePath)) {
  console.error(`✖ Dosya bulunamadı: ${filePath}`);
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const errors = [], warnings = [];
const err  = (id, m) => errors.push(`✖ [${id}] ${m}`);
const warn = (id, m) => warnings.push(`⚠ [${id}] ${m}`);

const SEYIR = new Set(['cikici', 'inici', 'inici-cikici']);
const ids = new Set();

if (!Array.isArray(db.makamlar)) {
  console.error('✖ db.makamlar bir dizi olmalıdır!');
  process.exit(1);
}

if (db.makamlar.length !== 10) err('GENEL', `10 makam bekleniyor, ${db.makamlar.length} bulundu`);

for (const m of db.makamlar) {
  const id = m.id ?? '?';
  if (ids.has(id)) err(id, 'tekrar eden id');
  ids.add(id);

  // --- dizi bütünlüğü ---
  const c = m.dizi?.cikici;
  if (!Array.isArray(c) || !c.every(Number.isInteger)) {
    err(id, 'dizi.cikici tam sayı dizisi olmalı');
    continue;
  }
  for (let i = 1; i < c.length; i++) {
    if (c[i] <= c[i - 1]) err(id, `dizi artan değil: ${c[i - 1]} → ${c[i]}`);
  }
  if (m.partial) {
    if (!m.needsReview) err(id, 'partial:true iken needsReview:true zorunlu');
    warn(id, `dizi EKSİK (partial) — ${c.length} perde; yayın öncesi tamamlanmalı`);
  } else {
    if (c.length < 8) err(id, `dizi ≥ 8 perde olmalı (bulundu: ${c.length})`);
    if (c.at(-1) - c[0] !== OCTAVE_KOMA) err(id, `dizi tam oktav (53 koma) değil: ${c.at(-1) - c[0]}`);
  }

  const ic = m.dizi.inici;
  if (ic != null) {
    if (!Array.isArray(ic) || !ic.every(Number.isInteger)) {
      err(id, 'dizi.inici tam sayı dizisi olmalı');
    } else {
      for (let i = 1; i < ic.length; i++) {
        if (ic[i] <= ic[i - 1]) err(id, `inici dizi artan değil: ${ic[i - 1]} → ${ic[i]}`);
      }
      if (ic[0] !== c[0] || ic.at(-1) !== c.at(-1)) {
        err(id, 'inici dizi aynı durak ve oktavda başlayıp bitmeli');
      }
    }
  }

  // --- durak / güçlü / yeden / seyir ---
  const pcs = new Set(allAbs(m, [-2, -1, 0, 1, 2]));
  if (!pcs.has(m.durak)) err(id, `durak (${m.durak}) dizide yok`);
  if (c[0] !== m.durak && !m.partial) {
    warn(id, `dizi durak ile başlamıyor (durak=${m.durak}, ilk=${c[0]}) — çıkıcı/inici seyirde normal olabilir`);
  }
  if (m.guclu == null) {
    if (!m.needsReview) err(id, 'guclu boş ise needsReview:true olmalı');
    else warn(id, 'guclu boş');
  } else if (!pcs.has(m.guclu)) {
    err(id, `güçlü (${m.guclu}) dizide yok`);
  }

  if (m.seyir == null) {
    if (!m.needsReview) err(id, 'seyir boş ise needsReview:true olmalı');
    else warn(id, 'seyir boş');
  } else if (!SEYIR.has(m.seyir)) {
    err(id, `seyir geçersiz: ${m.seyir}`);
  }

  // --- perde adları ---
  for (const a of new Set([...c, ...(ic ?? [])])) {
    if (!perdeAdi(a)) warn(id, `perde adı yok: abs=${a}`);
  }

  // --- frekans makullüğü: durak hz hesaplanabilir ve 80–600 Hz aralığında ---
  const hz = hzOfAbs(m.durak);
  if (!(hz > 80 && hz < 600)) err(id, `durak frekansı makul aralık dışı: ${hz.toFixed(1)} Hz`);

  // --- eski/yasaklı alanlar ---
  for (const f of ['kararFreq', 'scale']) {
    if (f in m) err(id, `eski alan yasak: '${f}' (frekans koma'dan TÜRETİLİR)`);
  }

  // --- doğrulanmış iddiası ---
  if (m.needsReview === false && m.confidence === 'low') {
    err(id, 'confidence:low iken needsReview:false olamaz');
  }

  // --- motifler (Faz 1 sonrası zorunlu) ---
  if (Array.isArray(m.motifs)) {
    if (m.motifs.length < 3) err(id, `en az 3 motif gerekli (bulundu ${m.motifs.length})`);
    for (const mo of m.motifs) {
      if (!Array.isArray(mo.path) || mo.path.length < 3) {
        err(id, `motif ${mo.id}: path ≥ 3 adım olmalı`);
        continue;
      }
      for (const s of mo.path) {
        if (!pcs.has(s.abs)) err(id, `motif ${mo.id}: abs=${s.abs} dizide yok`);
      }
    }
  } else {
    warn(id, 'motifs henüz tanımlı değil');
  }

  // --- geçkiler ---
  for (const t of m.transitions ?? []) {
    if (!db.makamlar.some(x => x.id === t.to)) err(id, `geçki hedefi yok: ${t.to}`);
    if (!Number.isInteger(t.viaAbs)) err(id, `geçki 'viaAbs' (koma) zorunlu; nota adı yasak (${t.via})`);
  }
}

console.log(`\nMakam: ${db.makamlar.length}  |  Hata: ${errors.length}  |  Uyarı: ${warnings.length}\n`);
errors.forEach(e => console.log(e));
warnings.forEach(w => console.log(w));

process.exit(errors.length || (strict && warnings.length) ? 1 : 0);
