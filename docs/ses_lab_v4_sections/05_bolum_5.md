# 5. BÖLÜM 5: PERDE VE AKORT SİSTEMİ: 12-TET, 53-KOMA (AEU), ARAP 24-EDO VE AHENKLER

## 5.1. Çoklu Akort Sistemleri Nazariyatı ve Matematiksel Modeli
Mevcut kod tabanındaki en vahim nazariyat hatası, tüm mûsiki ve tilâvet perdelerini 12 eşit tamperamanlı (12-TET) Batı sistemine zorlamaktı (B6). Bu durum; Segâh perdesinde (244 Hz) okuyan bir talebenin sesinin sisteme B3 (247 Hz, -20 cent) gibi görünmesine ve ibrenin hiçbir zaman yeşil "Tam Karar" vermemesine yol açmaktaydı.

v4.0.0 ile üç farklı akort sistemi matematiksel olarak eksiksiz modellenmiştir:

### 1. Batı 12 Eşit Bölümlü Akort (12-TET)
Frekans formülü:
$$f(n) = 440 \cdot 2^{\frac{n - 69}{12}}$$
Burada $n$, MIDI nota numarasıdır ($A_4 = 69$).

### 2. Türk Mûsikîsi 53 Holder-Koma Sistemi (Arel-Ezgi-Uzdilek / AEU)
Bir oktav 53 eşit Holder komasına bölünür. 1 koma aralığı:
$$\text{Cent} = \frac{1200}{53} \approx 22.6415\text{ cent}$$
Referans Dügâh ($A_3$) perdesi $k = 0$ kabul edildiğinde, frekans:
$$f(k) = 220 \cdot 2^{\frac{k}{53}}$$

| Perde Adı (Türkçe) | Mutlak Nota Kodu | Koma İndeksi ($k$) | İdeal Frekans (Hz) | Göreli Cent (Dügâh'a Göre) |
|:---|:---:|:---:|:---:|:---:|
| **Yegâh** | D3 | -31 | 146.67 | -701.89 |
| **Hüseynî-Aşîrân** | E3 | -22 | 164.88 | -498.11 |
| **Acem-Aşîrân** | F3 | -18 | 173.85 | -407.55 |
| **Rast (Karar)** | G3 | -9 | 195.57 | -203.77 |
| **Dügâh (Referans)**| A3 | 0 | 220.00 | 0.00 |
| **Dik Dügâh** | A#3 (-5k) | +4 | 229.84 | +90.57 |
| **Segâh** | B3 (-1k) | +8 | 244.26 | +181.13 |
| **Bûselik** | B3 | +9 | 247.46 | +203.77 |
| **Çargâh** | C4 | +13 | 260.66 | +294.34 |
| **Hicaz** | C#4 (-4k) | +17 | 274.55 | +384.91 |
| **Uzzâl** | C#4 (-1k) | +21 | 289.17 | +475.47 |
| **Nevâ** | D4 | +22 | 293.33 | +498.11 |
| **Hisar** | D#4 (-5k) | +26 | 308.97 | +588.68 |
| **Hüseynî** | E4 | +31 | 330.08 | +701.89 |
| **Acem** | F4 | +35 | 347.44 | +792.45 |
| **Evc** | F#4 (-1k) | +39 | 366.49 | +883.02 |
| **Mâhur** | F#4 | +40 | 371.30 | +905.66 |
| **Gerdâniye** | G4 | +44 | 391.13 | +996.23 |
| **Muhayyer** | A4 | +53 | 440.00 | +1200.00 |

### 3. Arap 24 Eşit Çeyrek Ton Sistemi (24-EDO)
Bir oktav 24 çeyrek tona bölünür (adım başına 50 cent).
$$f(q) = 220 \cdot 2^{\frac{q}{24}}$$
Arap Maqamat geleneğinde Sikâh ve Bayâtî seyrindeki çeyrek ton bemoller (quarter-tone flat) $\approx -50\text{ cent}$ ile ifade edilir.

---

## 5.2. 6 Klasik Türk Mûsikîsi Ahengi (Ses Düzenleri)
Tilâvet talebesinin ses rengi ve ses genişliği (pest erkek sesi, tiz kadın/çocuk sesi) farklıdır. Sabit tek bir frekansta akort zorlaması pedagojiye aykırıdır. Sistem, 6 geleneksel Türk mûsikisi ahengini dinamik transpoze ile destekler:

1. **Bolâhenk (Nısfiye / Referans):** Dügâh = 220.00 Hz ($A_3$). Standart oda diyapazonu.
2. **Dâvud:** Dügâh = 164.81 Hz ($E_3$, -5 ses). Çok pest (bas) erkek sesleri için.
3. **Şah:** Dügâh = 174.61 Hz ($F_3$, -4 ses). Pest erkek sesleri için.
4. **Mansur:** Dügâh = 196.00 Hz ($G_3$, -2 ses). Bariton tilâvetler için en yaygın ney ahengi.
5. **Kız:** Dügâh = 246.94 Hz ($B_3$, +2 ses). Tenor ve tiz erkek sesleri için en yaygın ney ahengi.
6. **Yıldız:** Dügâh = 261.63 Hz ($C_4$, +3 ses). Kadın ve genç talebe sesleri için.
7. **Müstahsen:** Dügâh = 277.18 Hz ($C^\sharp_4$, +4 ses). Tiz sesler.
8. **Süpürde:** Dügâh = 293.66 Hz ($D_4$, +5 ses). Çok tiz (soprano) sesler.

---

## 5.3. Otomatik Karar ve Ahenk Tespiti (Auto-Tonic Detector)
Talebe mikrofona okumaya başladığında, ilk 3 saniyedeki kararlı F0 noktalarının histogramı çıkarılır. En yüksek tepe noktasının (mod frekansı) makamın karar sesi olduğu varsayılır ve talebeye en uygun ahenk otomatik önerilir.

---

## 5.4. Eksiksiz Modül Kodu: `tuning_core.js`

```javascript
// kimatik_lab/audio_lab/core/tuning_core.js
// 12-TET, 53-Koma (AEU) ve 24-EDO Perde ve Ahenk Motoru

export const AHENKLER = {
  boulahank: { id: 'boulahank', nameTr: 'Bolâhenk (Nısfiye)', dugahHz: 220.00, semitones: 0, desc: 'Standart Referans' },
  davud:     { id: 'davud',     nameTr: 'Dâvud',            dugahHz: 164.81, semitones: -5, desc: 'Derin Pest Erkek' },
  sah:       { id: 'sah',       nameTr: 'Şah',              dugahHz: 174.61, semitones: -4, desc: 'Pest Erkek' },
  mansur:    { id: 'mansur',    nameTr: 'Mansur',           dugahHz: 196.00, semitones: -2, desc: 'Bariton / Erkek' },
  kiz:       { id: 'kiz',       nameTr: 'Kız Ney',          dugahHz: 246.94, semitones: +2, desc: 'Tenor / Tiz Erkek' },
  yildiz:    { id: 'yildiz',    nameTr: 'Yıldız',           dugahHz: 261.63, semitones: +3, desc: 'Genç / Kadın' },
  mustahsen: { id: 'mustahsen', nameTr: 'Müstahsen',        dugahHz: 277.18, semitones: +4, desc: 'Tiz Ses' },
  supurde:   { id: 'supurde',   nameTr: 'Süpürde',          dugahHz: 293.66, semitones: +5, desc: 'Çok Tiz Ses' }
};

// 53-Koma Temel Perde Tablosu (Bolâhenk Referans Dügâh = 220.0 Hz)
export const PITCH_TABLE_53 = [
  { nameTr: 'Yegâh',           note: 'D3',   koma: -31, baseHz: 146.67 },
  { nameTr: 'Hüseynî-Aşîrân',  note: 'E3',   koma: -22, baseHz: 164.88 },
  { nameTr: 'Acem-Aşîrân',     note: 'F3',   koma: -18, baseHz: 173.85 },
  { nameTr: 'Geveşt',          note: 'F#3d', koma: -14, baseHz: 182.25 },
  { nameTr: 'Rast',            note: 'G3',   koma: -9,  baseHz: 195.57 },
  { nameTr: 'Zengüle',         note: 'G#3d', koma: -5,  baseHz: 205.95 },
  { nameTr: 'Dügâh',           note: 'A3',   koma: 0,   baseHz: 220.00 },
  { nameTr: 'Kürdî',           note: 'Bb3b4',koma: +4,  baseHz: 229.84 },
  { nameTr: 'Segâh',           note: 'B3d',  koma: +8,  baseHz: 244.26 },
  { nameTr: 'Bûselik',         note: 'B3',   koma: +9,  baseHz: 247.46 },
  { nameTr: 'Çargâh',          note: 'C4',   koma: +13, baseHz: 260.66 },
  { nameTr: 'Hicaz',           note: 'C#4b4',koma: +17, baseHz: 274.55 },
  { nameTr: 'Uzzâl',           note: 'C#4d', koma: +21, baseHz: 289.17 },
  { nameTr: 'Nevâ',            note: 'D4',   koma: +22, baseHz: 293.33 },
  { nameTr: 'Nîm Hisar',       note: 'Eb4',  koma: +26, baseHz: 308.97 },
  { nameTr: 'Hüseynî',         note: 'E4',   koma: +31, baseHz: 330.08 },
  { nameTr: 'Acem',            note: 'F4',   koma: +35, baseHz: 347.44 },
  { nameTr: 'Evc',             note: 'F#4d', koma: +39, baseHz: 366.49 },
  { nameTr: 'Mâhur',           note: 'F#4',  koma: +40, baseHz: 371.30 },
  { nameTr: 'Gerdâniye',       note: 'G4',   koma: +44, baseHz: 391.13 },
  { nameTr: 'Şehnaz',          note: 'G#4d', koma: +48, baseHz: 412.00 },
  { nameTr: 'Muhayyer',        note: 'A4',   koma: +53, baseHz: 440.00 },
  { nameTr: 'Tiz Segâh',       note: 'B4d',  koma: +61, baseHz: 488.52 },
  { nameTr: 'Tiz Çargâh',      note: 'C5',   koma: +66, baseHz: 521.32 }
];

export class TuningCore {
  constructor() {
    this.currentAhenk = AHENKLER.boulahank;
    this.system = '53-koma'; // '53-koma' | '12-tet' | '24-edo'
    this.inTuneToleranceCent = 15.0; // Kabul edilebilir tam karar aralığı (±15 cent)
  }

  setAhenk(ahenkId) {
    if (AHENKLER[ahenkId]) {
      this.currentAhenk = AHENKLER[ahenkId];
    }
  }

  setSystem(systemId) {
    if (['53-koma', '12-tet', '24-edo'].includes(systemId)) {
      this.system = systemId;
    }
  }

  /**
   * İki frekans arasındaki cent farkını hesaplar.
   * Negatif sapmalarda yuvarlama hatasını önler (B3 düzeltmesi).
   */
  static hzToCentDifference(f, fRef) {
    if (f <= 0 || fRef <= 0) return 0;
    return 1200.0 * Math.log2(f / fRef);
  }

  /**
   * Girilen frekansa en yakın perdeyi ve sapmayı döndürür.
   * @param {number} hz 
   * @returns {Object} TunedPitchResult
   */
  resolvePitch(hz) {
    if (!hz || hz <= 0) {
      return {
        rawHz: 0,
        filteredHz: 0,
        noteName: '--',
        traditionalName: '--',
        centDeviation: 0,
        komaDeviation: 0,
        targetHz: 0,
        tuningSystem: this.system,
        inTune: false
      };
    }

    const ahenkMultiplier = this.currentAhenk.dugahHz / 220.0;

    let bestMatch = null;
    let minAbsCent = Infinity;

    if (this.system === '53-koma') {
      for (const p of PITCH_TABLE_53) {
        const targetHz = p.baseHz * ahenkMultiplier;
        const centDiff = TuningCore.hzToCentDifference(hz, targetHz);
        const absDiff = Math.abs(centDiff);

        if (absDiff < minAbsCent) {
          minAbsCent = absDiff;
          const komaDiff = centDiff / (1200 / 53);
          bestMatch = {
            rawHz: hz,
            filteredHz: hz,
            noteName: p.note,
            traditionalName: p.nameTr,
            centDeviation: Math.round(centDiff * 10) / 10,
            komaDeviation: Math.round(komaDiff * 10) / 10,
            targetHz: Math.round(targetHz * 100) / 100,
            tuningSystem: '53-koma',
            inTune: absDiff <= this.inTuneToleranceCent
          };
        }
      }
    } else if (this.system === '12-tet') {
      const midiFloat = 69 + 12 * Math.log2(hz / 440.0);
      const roundedMidi = Math.round(midiFloat);
      const targetHz = 440.0 * Math.pow(2, (roundedMidi - 69) / 12);
      const centDiff = TuningCore.hzToCentDifference(hz, targetHz);
      const noteNames = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
      const noteName = noteNames[roundedMidi % 12] + (Math.floor(roundedMidi / 12) - 1);

      bestMatch = {
        rawHz: hz,
        filteredHz: hz,
        noteName: noteName,
        traditionalName: noteName,
        centDeviation: Math.round(centDiff * 10) / 10,
        komaDeviation: Math.round((centDiff / 22.64) * 10) / 10,
        targetHz: Math.round(targetHz * 100) / 100,
        tuningSystem: '12-tet',
        inTune: Math.abs(centDiff) <= this.inTuneToleranceCent
      };
    } else if (this.system === '24-edo') {
      const qFloat = 24 * Math.log2(hz / 220.0);
      const roundedQ = Math.round(qFloat);
      const targetHz = 220.0 * Math.pow(2, roundedQ / 24);
      const centDiff = TuningCore.hzToCentDifference(hz, targetHz);

      bestMatch = {
        rawHz: hz,
        filteredHz: hz,
        noteName: `Q${roundedQ}`,
        traditionalName: `Çeyrek Ton (${roundedQ})`,
        centDeviation: Math.round(centDiff * 10) / 10,
        komaDeviation: 0,
        targetHz: Math.round(targetHz * 100) / 100,
        tuningSystem: '24-edo',
        inTune: Math.abs(centDiff) <= this.inTuneToleranceCent
      };
    }

    return bestMatch;
  }

  /**
   * Toplanan F0 dizisinden en olası Karar perdesini ve Ahengi bulur.
   * @param {number[]} f0Array 
   */
  detectAhenkAndTonic(f0Array) {
    if (!f0Array || f0Array.length < 20) return null;

    // 1. Frekansları 2 Hz genişliğinde kovalara (bucket) böl
    const buckets = new Map();
    for (const f of f0Array) {
      if (f < 80 || f > 600) continue;
      const bKey = Math.round(f / 2) * 2;
      buckets.set(bKey, (buckets.get(bKey) || 0) + 1);
    }

    let maxCount = 0;
    let modeHz = 220;
    for (const [hz, count] of buckets.entries()) {
      if (count > maxCount) {
        maxCount = count;
        modeHz = hz;
      }
    }

    // 2. Bu modeHz hangi ahenkteki Dügâh veya Rast'a en yakın?
    let closestAhenk = AHENKLER.boulahank;
    let minDistance = Infinity;

    for (const ahenk of Object.values(AHENKLER)) {
      const dist = Math.abs(ahenk.dugahHz - modeHz);
      if (dist < minDistance) {
        minDistance = dist;
        closestAhenk = ahenk;
      }
    }

    return {
      estimatedTonicHz: modeHz,
      recommendedAhenk: closestAhenk
    };
  }
}

export const tuningCore = new TuningCore();
```
