# 7. BÖLÜM 7: KONTUR ÇIKARMA, DTW v2 VE DÜRÜST AKUSTİK KARNE

## 7.1. Kontur Çıkarma ve Zaman Serisi Ayrımı
Eski kodda "Kayıt Al" butonuna basıldığında hem yapay simüle centler hem de gerçek mikrofondan gelen veriler aynı global diziye basılarak veri kirlenmekteydi (E1). Ayrıca 7 saniyelik zengin bir tilâvet sadece 50 kaba noktaya indirgenip nağme kıvrımları silinmekteydi (E3).

v4.0.0 Kontur Motoru, 10 ms hop boyutuyla her saniyede 100 F0 noktası toplar. Sessiz bölgeler (vakıf/duraklar) yapay olarak doldurulmaz; `hz: 0` olarak korunur. Böylece talebenin nefes aldığı ve durduğu anlar ritim analizine tam yansır.

---

## 7.2. Sakoe-Chiba Kısıtlamalı FastDTW v2
Dinamik Zaman Bükme (DTW - Dynamic Time Warping), iki zaman serisi arasındaki benzerliği ölçen en güvenilir algoritmadır. Ancak sınırsız bir DTW, kullanıcının 1 saniyelik bir hatasını modelin 5 saniyelik bir nağmesine bükebilir (pathological warping).

Bu durumu engellemek için **Sakoe-Chiba Bant Kısıtlaması** uygulanır:
$$|i - j \cdot \frac{N}{M}| \le R$$
Burada $R \approx 0.15 \times \max(N, M)$ pencere yarıçapıdır. Böylece hem algoritmanın karmaşıklığı $O(N \cdot M)$'den $O(N \cdot R)$ seviyesine düşer, hem de mantıksız zaman kaymaları engellenir.

---

## 7.3. Çift Skorlama (Dual Scoring) Modeli
Eski sistemdeki "Zamanlama Skoru" gerçekte zamanı ölçmemekte, sadece perde farkından sahte bir formülle üretilmekteydi (E2).

v4.0.0 iki bağımsız skor üretir:
1. **Perde & Nağme Skoru (`shapeScore`):** Hizalanmış warping yolu üzerindeki cent farklarının ortalaması üzerinden hesaplanır:
   $$\text{shapeScore} = \max\left(0, 100 - \frac{\bar{D}_{\text{cent}}}{1.2}\right)$$
2. **Ritim & Durak Skoru (`rhythmScore`):** Warping yolunun ideal köşegenden ($\frac{i}{N} = \frac{j}{M}$) sapmasının karesel ortalaması (RMSE):
   $$\text{rhythmScore} = \max\left(0, 100 - (\text{WarpingRMSE} \times 250)\right)$$
3. **Genel Akustik Benzerlik:**
   $$\text{combinedScore} = 0.65 \times \text{shapeScore} + 0.35 \times \text{rhythmScore}$$

---

## 7.4. Catmull-Rom Spline Eğri Çizimi
Referans kâri konturu ekrana köşeli kırık çizgiler olarak değil (E6), 4 kontrol noktalı Catmull-Rom kübik spline formülüyle son derece pürüzsüz ve estetik bir hat sanatçısı fırçası gibi çizilir.

---

## 7.5. Eksiksiz Modül Kodu: `dtw_v2.js`

```javascript
// kimatik_lab/audio_lab/core/dtw_v2.js
// Sakoe-Chiba FastDTW, Çift Skorlama ve Catmull-Rom Spline Çizim Motoru

export class DTWAnalyzerV2 {
  constructor() {
    this.sakoeChibaRatio = 0.15; // %15 bükülme tolerans penceresi
  }

  /**
   * Kullanıcı konturu ile referans kâri konturunu Sakoe-Chiba kısıtlamasıyla karşılaştırır.
   * @param {Array<{t: number, cent: number, hz: number}>} userSamples 
   * @param {Array<{t: number, cent: number, hz: number}>} refSamples 
   * @returns {Object} DTWComparisonResult
   */
  compare(userSamples, refSamples) {
    if (!userSamples || userSamples.length < 5 || !refSamples || refSamples.length < 5) {
      return {
        shapeScore: 0,
        rhythmScore: 0,
        combinedScore: 0,
        warpingPath: [],
        averageDistance: 999,
        legalNotice: 'Yetersiz ses verisi.'
      };
    }

    const N = userSamples.length;
    const M = refSamples.length;
    const R = Math.max(5, Math.floor(Math.max(N, M) * this.sakoeChibaRatio));

    // Mesafe Maliyet Matrisi D[N][M] başlatma (Float32Array ile yüksek performans)
    const costMatrix = Array.from({ length: N }, () => new Float32Array(M).fill(Infinity));

    costMatrix[0][0] = this.pointDistance(userSamples[0], refSamples[0]);

    for (let i = 0; i < N; i++) {
      const minJ = Math.max(0, Math.floor((i * M) / N) - R);
      const maxJ = Math.min(M - 1, Math.floor((i * M) / N) + R);

      for (let j = minJ; j <= maxJ; j++) {
        if (i === 0 && j === 0) continue;

        const d = this.pointDistance(userSamples[i], refSamples[j]);

        const costMatch = (i > 0 && j > 0) ? costMatrix[i - 1][j - 1] : Infinity;
        const costInsert = (i > 0) ? costMatrix[i - 1][j] : Infinity;
        const costDelete = (j > 0) ? costMatrix[i][j - 1] : Infinity;

        const minPrev = Math.min(costMatch, costInsert, costDelete);
        if (minPrev !== Infinity) {
          costMatrix[i][j] = d + minPrev;
        }
      }
    }

    // Warping Yolu Geri Takibi (Backtracking)
    let i = N - 1;
    let j = M - 1;
    const warpingPath = [[i, j]];

    while (i > 0 || j > 0) {
      if (i === 0) {
        j--;
      } else if (j === 0) {
        i--;
      } else {
        const stepMatch = costMatrix[i - 1][j - 1];
        const stepInsert = costMatrix[i - 1][j];
        const stepDelete = costMatrix[i][j - 1];

        if (stepMatch <= stepInsert && stepMatch <= stepDelete) {
          i--; j--;
        } else if (stepInsert <= stepDelete) {
          i--;
        } else {
          j--;
        }
      }
      warpingPath.push([i, j]);
    }
    warpingPath.reverse();

    // 1. Perde Seyir Skoru (Shape Score)
    let totalCentDiff = 0;
    let voicedPairCount = 0;

    for (const [ui, rj] of warpingPath) {
      const u = userSamples[ui];
      const r = refSamples[rj];
      if (u.hz > 0 && r.hz > 0) {
        totalCentDiff += Math.abs(u.cent - r.cent);
        voicedPairCount++;
      }
    }

    const avgCentDiff = voicedPairCount > 0 ? totalCentDiff / voicedPairCount : 150;
    const shapeScore = Math.max(0, Math.min(100, Math.round(100 - (avgCentDiff / 1.35))));

    // 2. Ritim & Zamanlama Skoru (Rhythm Score)
    // Köşegenden sapma miktarı
    let totalDiagonalDeviation = 0;
    for (const [ui, rj] of warpingPath) {
      const idealJ = (ui * M) / N;
      const normalizedDeviation = Math.abs(rj - idealJ) / M;
      totalDiagonalDeviation += normalizedDeviation * normalizedDeviation;
    }

    const rmseDiagonal = Math.sqrt(totalDiagonalDeviation / warpingPath.length);
    const rhythmScore = Math.max(0, Math.min(100, Math.round(100 - (rmseDiagonal * 320))));

    // 3. Birleşik Skor
    const combinedScore = Math.round((0.65 * shapeScore) + (0.35 * rhythmScore));

    return {
      shapeScore,
      rhythmScore,
      combinedScore,
      warpingPath,
      averageDistance: Math.round(avgCentDiff * 10) / 10,
      legalNotice: 'Bu skor akustik ve seyir benzerliğini gösterir; fem-i muhsin icazeti veya tecvid sıhhati yerine geçmez.'
    };
  }

  pointDistance(u, r) {
    if (u.hz === 0 && r.hz === 0) return 0;
    if (u.hz === 0 || r.hz === 0) return 60.0; // Biri sesli diğeri sessiz ise ceza puanı
    return Math.abs(u.cent - r.cent);
  }

  /**
   * Catmull-Rom Kübik Spline Enterpolasyonu ile Canvas Çizimi
   */
  static drawSplineContour(ctx, points, color = '#d4af37', lineWidth = 3) {
    if (!points || points.length < 2) return;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i < points.length - 2 ? points[i + 2] : p2;

      for (let t = 0; t <= 1; t += 0.1) {
        const t2 = t * t;
        const t3 = t2 * t;

        const x = 0.5 * (
          (2 * p1.x) +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
        );

        const y = 0.5 * (
          (2 * p1.y) +
          (-p0.y + p2.y) * t +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
        );

        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
    ctx.restore();
  }
}

export const dtwAnalyzer = new DTWAnalyzerV2();
```
