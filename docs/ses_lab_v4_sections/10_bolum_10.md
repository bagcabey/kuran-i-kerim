# 10. BÖLÜM 10: OKUMA PENCERESİ (ODAK MODU - FOCUS MODE MODAL)

## 10.1. Tasarım Felsefesi ve Kullanıcı Deneyimi (UX)
Eski sistemdeki en büyük ergonomi eksikliği, tilâvet talebesinin okuma yaparken küçük bir kutu içinde sıkışması, harfleri ve durakları net görememesiydi (H3).

**Okuma Penceresi (Focus Mode Modal)**, talebe mikrofona yöneldiğinde arayüzdeki tüm yan unsurları karartarak (backdrop blur) zihni sadece Kur'ân hattına ve sese odaklayan bir dijital halvetgâh sunar.

### Pencere Hiyerarşisi
1. **Zirve (Header):**
   - Sûre ve Âyet Bilgisi (Örn: *Fâtiha Sûresi, 1. Âyet*).
   - "Mushaf'ta Aç" Köprü Butonu (`locateAndSelectSurahAyah` çağrısı).
   - Kapatma Butonu (`ESC` tuşu veya `✕` simgesi).
2. **Kudsî Merkez (Arapça Hat & Metin):**
   - Dev Mushaf hattı (`font-size: clamp(2.2rem, 5vw, 4rem); font-family: 'Amiri', 'Scheherazade New', serif`).
   - Tecvid renklendirmeli harfler (Yeşil: İhfâ/İdğam, Kırmızı: Meddler, Mavi: Kalkale).
   - Orijinal durak gülü ve âyet numarası (۝١).
   - Latin transkripsiyon ve tecvid rehberi notu.
3. **Canlı Akustik Sahne:**
   - Eşzamanlı Çift Eğri (Model kâri nağmesi: Altın sarısı spline; Talebenin sesi: Lapis mavisi canlı çizgi).
   - Canlı İbre Rozeti (Hedef makam perdesi ve anlık cent sapması).
4. **Pedagojik İcra Konsolu:**
   - 3-2-1 Ritmik Geri Sayım Butonu ("Okumaya Başla / Kayıt Al").
   - A-B Kıyaslama Oynatıcısı ("Model Kâriyi Dinle" vs "Kendi Sesini Dinle").
   - Akustik Karne Modalı (Perde Uyumu, Ritim, Karar Kararlılığı ve Fıkhî Not).

---

## 10.2. Eksiksiz Modül Kodu: `reading_modal.js`

```javascript
// kimatik_lab/audio_lab/ui/reading_modal.js
// Tam Ekran Odaklı Okuma Penceresi, Canlı Kontur ve A-B Oynatıcı

import { micManager } from '../core/mic_manager.js';
import { tuningCore } from '../core/tuning_core.js';
import { dtwAnalyzer, DTWAnalyzerV2 } from '../core/dtw_v2.js';
import { audioFocusManager } from '../core/audio_focus_manager.js';
import { masterBus } from '../core/master_bus.js';

export class ReadingModal {
  constructor() {
    this.dialogEl = null;
    this.isOpen = false;
    this.currentData = null;

    // Kayıt ve Kontur Verileri
    this.userSamples = [];
    this.userAudioUrl = null;
    this.modelAudio = null;
    this.userAudio = null;

    this.isRecording = false;
    this.countdownTimer = null;
    this.recordingStartTime = 0;

    this.unsubscribeMic = null;
  }

  /**
   * HTML5 <dialog> elemanını DOM'a enjekte eder.
   */
  mount() {
    if (document.getElementById('readingFocusModal')) {
      this.dialogEl = document.getElementById('readingFocusModal');
      return;
    }

    const modalHtml = `
      <dialog id="readingFocusModal" class="sl-modal" aria-labelledby="slModalTitle" aria-modal="true">
        <div class="sl-modal-backdrop"></div>
        <div class="sl-modal-container">
          
          <!-- Üst Çubuk -->
          <div class="sl-modal-header">
            <div class="sl-header-info">
              <span class="sl-badge-makam" id="slModalMakamBadge">Rast Makamı</span>
              <h2 id="slModalTitle" class="sl-modal-title">Fâtiha Sûresi, 1. Âyet</h2>
            </div>
            <div class="sl-header-actions">
              <button id="slBtnOpenMushaf" class="sl-btn sl-btn-secondary" title="Mushaf Sayfasını Aç">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                Mushaf'ta Aç
              </button>
              <button id="slBtnCloseModal" class="sl-btn sl-btn-icon" aria-label="Kapat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          <!-- Kudsî Metin Sahnesi (Arapça Hat) -->
          <div class="sl-modal-body">
            <div class="sl-quran-box">
              <p id="slModalArabic" class="sl-arabic-text" dir="rtl" lang="ar">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ <span class="sl-ayah-end">۝١</span>
              </p>
              <p id="slModalTranscription" class="sl-transcription-text">
                Bismillâhir-Rahmânir-Rahîm
              </p>
              <p id="slModalTecvidNote" class="sl-tecvid-note">
                <strong>Tecvid Notu:</strong> "Rahmân" ve "Rahîm" lafızlarındaki lâm-ı ta'rifler idğâm-ı şemsiyye ile okunur.
              </p>
            </div>

            <!-- Canlı İbre ve Frekans Rozeti -->
            <div class="sl-live-pitch-badge" id="slLivePitchBadge">
              <span class="sl-target-name" id="slTargetNoteName">Hedef: Rast (G3)</span>
              <div class="sl-badge-needle-wrap">
                <div class="sl-badge-needle" id="slBadgeNeedle"></div>
              </div>
              <span class="sl-current-hz" id="slCurrentHzText">-- Hz (0 cent)</span>
            </div>

            <!-- Çift Eğri Karşılaştırma Tuvali (Dual Canvas) -->
            <div class="sl-canvas-wrapper">
              <canvas id="slContourCanvas" width="900" height="240"></canvas>
              <div id="slCountdownOverlay" class="sl-countdown-overlay hidden">
                <span id="slCountdownNumber">3</span>
              </div>
            </div>

            <!-- Akustik Karne Çekmecesi (Gizli/Görünür) -->
            <div id="slScoreReport" class="sl-score-card hidden">
              <div class="sl-score-header">
                <h3>Akustik Tahlil Karnesi</h3>
                <span class="sl-badge-grade" id="slFinalGrade">%84 - Mümtaz</span>
              </div>
              <div class="sl-score-grid">
                <div class="sl-score-metric">
                  <span class="sl-metric-label">Perde & Nağme Uyumu</span>
                  <div class="sl-progress-bar"><div class="sl-progress-fill" id="slMetricShape" style="width: 85%"></div></div>
                  <span class="sl-metric-val" id="slValShape">%85</span>
                </div>
                <div class="sl-score-metric">
                  <span class="sl-metric-label">Ritim & Durak Uyumu</span>
                  <div class="sl-progress-bar"><div class="sl-progress-fill" id="slMetricRhythm" style="width: 82%"></div></div>
                  <span class="sl-metric-val" id="slValRhythm">%82</span>
                </div>
              </div>
              <p class="sl-legal-warning">
                <strong>Fıkhî/İlmî Hatırlatma:</strong> Bu skor yazılımsal bir benzerlik ölçümüdür. Fem-i muhsin icazeti, tilâvet sıhhati veya sahih kıraat senedi yerine ikame edilemez.
              </p>
            </div>
          </div>

          <!-- Alt Kontrol Konsolu -->
          <div class="sl-modal-footer">
            <div class="sl-footer-left">
              <button id="slBtnStartRec" class="sl-btn sl-btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>
                <span>3-2-1 Okumaya Başla</span>
              </button>
            </div>
            
            <div class="sl-footer-center">
              <button id="slBtnPlayModel" class="sl-btn sl-btn-secondary" title="Model Kâri Sesini Dinle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Model Tilâvet
              </button>
              <button id="slBtnPlayUser" class="sl-btn sl-btn-secondary" disabled title="Kendi Kaydını Dinle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Kendi Sesin
              </button>
            </div>

            <div class="sl-footer-right">
              <button id="slBtnFinishAndGrade" class="sl-btn sl-btn-accent" disabled>
                Tahlil Et & Karne Çıkar
              </button>
            </div>
          </div>

        </div>
      </dialog>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    this.dialogEl = document.getElementById('readingFocusModal');
    this.bindEvents();
  }

  bindEvents() {
    const closeBtn = document.getElementById('slBtnCloseModal');
    const openMushafBtn = document.getElementById('slBtnOpenMushaf');
    const startRecBtn = document.getElementById('slBtnStartRec');
    const playModelBtn = document.getElementById('slBtnPlayModel');
    const playUserBtn = document.getElementById('slBtnPlayUser');
    const gradeBtn = document.getElementById('slBtnFinishAndGrade');

    closeBtn?.addEventListener('click', () => this.close());
    this.dialogEl?.addEventListener('cancel', () => this.close()); // ESC tuşu

    openMushafBtn?.addEventListener('click', () => {
      if (this.currentData && window.locateAndSelectSurahAyah) {
        window.locateAndSelectSurahAyah(this.currentData.surah, this.currentData.ayah);
        this.close();
      }
    });

    startRecBtn?.addEventListener('click', () => this.toggleRecording());
    playModelBtn?.addEventListener('click', () => this.playModelAudio());
    playUserBtn?.addEventListener('click', () => this.playUserAudio());
    gradeBtn?.addEventListener('click', () => this.evaluateAndShowReport());
  }

  /**
   * Modalı belirtilen âyet ve model verisi ile açar.
   */
  async open(data) {
    this.mount();
    this.currentData = data;
    this.userSamples = [];
    this.userAudioUrl = null;

    // Arayüz metinlerini güncelle
    document.getElementById('slModalTitle').textContent = `${data.surahName || 'Sûre'}, ${data.ayah}. Âyet`;
    document.getElementById('slModalMakamBadge').textContent = `${data.makamName || 'Rast'} Makamı`;
    document.getElementById('slModalArabic').innerHTML = `${data.arabicText} <span class="sl-ayah-end">۝${data.ayah}</span>`;
    document.getElementById('slModalTranscription').textContent = data.transcription || '';
    document.getElementById('slModalTecvidNote').innerHTML = `<strong>Tecvid Notu:</strong> ${data.tecvidNote || 'Makam ve harf mahreçlerine riayet ediniz.'}`;

    // Butonları başlangıç haline getir
    document.getElementById('slBtnPlayUser').disabled = true;
    document.getElementById('slBtnFinishAndGrade').disabled = true;
    document.getElementById('slScoreReport').classList.add('hidden');

    this.dialogEl.showModal();
    this.isOpen = true;

    // Mikrofonu dinlemeye başla
    await micManager.start();
    this.unsubscribeMic = micManager.subscribe((frame) => this.handleMicFrame(frame));

    // Referans konturu canvas'a ilk kez çiz
    this.drawContours();
  }

  close() {
    if (this.isRecording) {
      this.stopRecording();
    }
    if (this.unsubscribeMic) {
      this.unsubscribeMic();
      this.unsubscribeMic = null;
    }
    this.stopAudios();
    this.dialogEl.close();
    this.isOpen = false;
  }

  handleMicFrame(frame) {
    if (!this.isOpen) return;

    // Canlı mini tuner ibresini güncelle
    if (frame.voiced && frame.hz > 0) {
      const tuned = tuningCore.resolvePitch(frame.hz);
      const needleEl = document.getElementById('slBadgeNeedle');
      const hzTextEl = document.getElementById('slCurrentHzText');

      if (needleEl) {
        const deg = Math.max(-45, Math.min(45, (tuned.centDeviation / 50) * 45));
        needleEl.style.transform = `rotate(${deg}deg)`;
      }
      if (hzTextEl) {
        hzTextEl.textContent = `${Math.round(frame.hz)} Hz (${tuned.centDeviation > 0 ? '+' : ''}${tuned.centDeviation} cent)`;
      }

      // Kayıt aktifse zaman serisine ekle
      if (this.isRecording) {
        const t = (performance.now() - this.recordingStartTime) / 1000;
        this.userSamples.push({
          t,
          hz: frame.hz,
          cent: tuned.centDeviation,
          rms: frame.rms
        });
        this.drawContours();
      }
    }
  }

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startCountdownAndRecord();
    }
  }

  startCountdownAndRecord() {
    const overlay = document.getElementById('slCountdownOverlay');
    const numEl = document.getElementById('slCountdownNumber');
    const btn = document.getElementById('slBtnStartRec');

    overlay.classList.remove('hidden');
    let count = 3;
    numEl.textContent = count;

    this.countdownTimer = setInterval(() => {
      count--;
      if (count > 0) {
        numEl.textContent = count;
      } else {
        clearInterval(this.countdownTimer);
        overlay.classList.add('hidden');
        // Kaydı fiilen başlat
        this.isRecording = true;
        this.userSamples = [];
        this.recordingStartTime = performance.now();
        micManager.startRecording();

        btn.classList.add('sl-btn-danger');
        btn.querySelector('span').textContent = 'Okumayı Durdur';
      }
    }, 800);
  }

  async stopRecording() {
    this.isRecording = false;
    const btn = document.getElementById('slBtnStartRec');
    btn.classList.remove('sl-btn-danger');
    btn.querySelector('span').textContent = 'Yeniden Oku';

    this.userAudioUrl = await micManager.stopRecording();
    if (this.userAudioUrl) {
      document.getElementById('slBtnPlayUser').disabled = false;
      document.getElementById('slBtnFinishAndGrade').disabled = false;
    }
  }

  drawContours() {
    const canvas = document.getElementById('slContourCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Kılavuz Çizgiler (0 cent, +50 cent, -50 cent)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75].forEach(ratio => {
      ctx.beginPath();
      ctx.moveTo(0, h * ratio);
      ctx.lineTo(w, h * ratio);
      ctx.stroke();
    });

    const maxDuration = (this.currentData && this.currentData.audioDurationSeconds) || 8.0;

    // 1. Model Kâri Referansı (Altın Eğri)
    if (this.currentData && this.currentData.samples) {
      const refPoints = this.currentData.samples.map(s => ({
        x: (s.t / maxDuration) * w,
        y: (h / 2) - ((s.cent / 100) * (h / 2) * 0.8)
      }));
      DTWAnalyzerV2.drawSplineContour(ctx, refPoints, '#d4af37', 3.5);
    }

    // 2. Kullanıcı Canlı Eğrisi (Lapis Mavisi)
    if (this.userSamples.length > 1) {
      const userPoints = this.userSamples.map(s => ({
        x: (s.t / maxDuration) * w,
        y: (h / 2) - ((s.cent / 100) * (h / 2) * 0.8)
      }));
      DTWAnalyzerV2.drawSplineContour(ctx, userPoints, '#38bdf8', 3);
    }
  }

  evaluateAndShowReport() {
    if (!this.currentData || !this.currentData.samples || this.userSamples.length < 5) return;

    const result = dtwAnalyzer.compare(this.userSamples, this.currentData.samples);

    document.getElementById('slMetricShape').style.width = `${result.shapeScore}%`;
    document.getElementById('slValShape').textContent = `%${result.shapeScore}`;

    document.getElementById('slMetricRhythm').style.width = `${result.rhythmScore}%`;
    document.getElementById('slValRhythm').textContent = `%${result.rhythmScore}`;

    document.getElementById('slFinalGrade').textContent = `%${result.combinedScore} - ${result.combinedScore >= 80 ? 'Mümtaz' : 'Gayretli'}`;

    document.getElementById('slScoreReport').classList.remove('hidden');
  }

  playModelAudio() {
    if (!this.currentData || !this.currentData.audioUrl) return;
    this.stopAudios();

    audioFocusManager.requestFocus({
      id: 'model_audio_player',
      name: 'Model Tilâvet',
      priority: 'exclusive',
      onInterrupted: () => this.stopAudios()
    });

    this.modelAudio = new Audio(this.currentData.audioUrl);
    this.modelAudio.play();
  }

  playUserAudio() {
    if (!this.userAudioUrl) return;
    this.stopAudios();

    audioFocusManager.requestFocus({
      id: 'user_audio_player',
      name: 'Kullanıcı Tilâvet',
      priority: 'exclusive',
      onInterrupted: () => this.stopAudios()
    });

    this.userAudio = new Audio(this.userAudioUrl);
    this.userAudio.play();
  }

  stopAudios() {
    if (this.modelAudio) {
      this.modelAudio.pause();
      this.modelAudio = null;
    }
    if (this.userAudio) {
      this.userAudio.pause();
      this.userAudio = null;
    }
    audioFocusManager.abandonFocus('model_audio_player');
    audioFocusManager.abandonFocus('user_audio_player');
  }
}

export const readingModal = new ReadingModal();
```
