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
