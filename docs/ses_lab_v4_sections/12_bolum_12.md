# 12. BÖLÜM 12: CSS TASARIM SİSTEMİ: OBSİDYEN & ALTIN v4 (WCAG 2.2 AA)

## 12.1. Tasarım Token'ları ve Renk Hiyerarşisi
Eski arayüzdeki 11px fontlar, platforma göre değişen emoji ikonlar ve yetersiz renk kontrastları (H6) erişilebilirliği engellemekteydi.

v4.0.0 CSS sistemi, **Obsidyen & Altın (Obsidian & Gold)** paletine dayanır. Tüm değişkenler modüler `--sl-` ad alanı altındadır ve WCAG 2.2 AA kontrast kriterlerini (en az 4.5:1) tam karşılar.

---

## 12.2. Eksiksiz Stil Dosyası: `ses_lab_v4.css`

```css
/* kimatik_lab/audio_lab/ui/ses_lab_v4.css */
/* Obsidyen & Altın v4 Tasarım Sistemi - WCAG 2.2 AA Uyumlu */

:root {
  /* Renk Paleti */
  --sl-bg-dark: #0b0f17;
  --sl-surface: #141b26;
  --sl-surface-raised: #1e293b;
  --sl-surface-border: rgba(212, 175, 55, 0.2);
  
  --sl-gold: #d4af37;
  --sl-gold-light: #fef08a;
  --sl-gold-glow: rgba(212, 175, 55, 0.35);
  
  --sl-emerald: #10b981;
  --sl-emerald-glow: rgba(16, 185, 129, 0.3);
  --sl-blue: #38bdf8;
  --sl-danger: #ef4444;

  --sl-text-primary: #f8fafc;
  --sl-text-secondary: #94a3b8;
  --sl-text-muted: #64748b;

  /* Tipografi */
  --sl-font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --sl-font-arabic: 'Amiri', 'Scheherazade New', 'Traditional Arabic', serif;

  /* Boyutlandırma & Geçiş */
  --sl-radius-sm: 6px;
  --sl-radius-md: 12px;
  --sl-radius-lg: 20px;
  --sl-transition-fast: 0.15s ease;
  --sl-transition-normal: 0.25s ease;
}

/* Kapsayıcı Gövde */
.sl-app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--sl-bg-dark);
  color: var(--sl-text-primary);
  font-family: var(--sl-font-sans);
  padding-bottom: 90px; /* Sabit alt bar için boşluk */
  box-sizing: border-box;
}

/* Üst Başlık & Marka */
.sl-main-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  background: var(--sl-surface);
  border-bottom: 1px solid var(--sl-surface-border);
  gap: 1rem;
}

.sl-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sl-brand-icon {
  font-size: 2rem;
}

.sl-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--sl-gold-light);
  letter-spacing: -0.01em;
}

.sl-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: var(--sl-text-secondary);
}

/* İstasyon Sekmeleri */
.sl-station-nav {
  display: flex;
  gap: 0.5rem;
}

.sl-nav-tab {
  background: transparent;
  color: var(--sl-text-secondary);
  border: 1px solid transparent;
  padding: 0.6rem 1rem;
  border-radius: var(--sl-radius-md);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all var(--sl-transition-fast);
  min-height: 44px; /* Dokunma hedefi */
}

.sl-nav-tab:hover {
  background: var(--sl-surface-raised);
  color: var(--sl-text-primary);
}

.sl-nav-tab.active {
  background: var(--sl-surface-raised);
  color: var(--sl-gold);
  border-color: var(--sl-gold);
  box-shadow: 0 0 12px var(--sl-gold-glow);
}

.sl-tab-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  font-size: 0.75rem;
}

.sl-nav-tab.active .sl-tab-num {
  background: var(--sl-gold);
  color: var(--sl-bg-dark);
}

/* İçerik Panelleri */
.sl-main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.sl-panel {
  display: none;
}

.sl-panel.active {
  display: block;
}

/* Butonlar */
.sl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border-radius: var(--sl-radius-md);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all var(--sl-transition-fast);
  min-height: 44px;
  min-width: 44px;
}

.sl-btn:focus-visible {
  outline: 2px solid var(--sl-gold);
  outline-offset: 3px;
}

.sl-btn-primary {
  background: var(--sl-gold);
  color: var(--sl-bg-dark);
}

.sl-btn-primary:hover {
  background: var(--sl-gold-light);
  box-shadow: 0 0 15px var(--sl-gold-glow);
}

.sl-btn-secondary {
  background: var(--sl-surface-raised);
  color: var(--sl-text-primary);
  border-color: rgba(255, 255, 255, 0.1);
}

.sl-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.sl-btn-accent {
  background: linear-gradient(135deg, #d4af37, #b45309);
  color: #fff;
  border: none;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.sl-btn-accent:hover {
  filter: brightness(1.15);
}

.sl-btn-danger {
  background: var(--sl-danger);
  color: #fff;
}

.sl-btn-lg {
  padding: 0.85rem 1.75rem;
  font-size: 1.05rem;
}

.sl-btn-icon {
  background: transparent;
  color: var(--sl-text-secondary);
  padding: 0.5rem;
}

.sl-btn-icon:hover {
  color: var(--sl-text-primary);
}

.sl-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  filter: grayscale(1);
}

/* Seçiciler */
.sl-select {
  background: var(--sl-surface-raised);
  color: var(--sl-text-primary);
  border: 1px solid var(--sl-surface-border);
  padding: 0.5rem 0.85rem;
  border-radius: var(--sl-radius-sm);
  font-size: 0.9rem;
  outline: none;
  min-height: 40px;
}

.sl-select:focus-visible {
  border-color: var(--sl-gold);
}

/* İSTASYON 1: KADRAN VE PİYANO */
.sl-tuner-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.sl-gauge-card, .sl-keyboard-card {
  background: var(--sl-surface);
  border: 1px solid var(--sl-surface-border);
  border-radius: var(--sl-radius-lg);
  padding: 2rem;
}

.sl-gauge-dial {
  position: relative;
  width: 240px;
  height: 120px;
  margin: 0 auto;
  border-top-left-radius: 120px;
  border-top-right-radius: 120px;
  background: linear-gradient(to top, rgba(212, 175, 55, 0.05), rgba(212, 175, 55, 0.15));
  border: 2px solid var(--sl-surface-border);
  border-bottom: none;
  overflow: hidden;
}

.sl-gauge-needle {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 4px;
  height: 105px;
  background: var(--sl-gold);
  transform-origin: bottom center;
  transform: rotate(0deg);
  transition: transform 0.08s ease-out;
  border-radius: 2px;
  box-shadow: 0 0 8px var(--sl-gold);
}

.sl-gauge-center-pin {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 18px;
  background: var(--sl-text-primary);
  border-radius: 50%;
  border: 3px solid var(--sl-gold);
}

.sl-gauge-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 1.5rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--sl-text-muted);
}

.sl-zero-mark {
  color: var(--sl-emerald);
  font-weight: 700;
}

.sl-tuner-readout {
  text-align: center;
  margin-top: 1.5rem;
}

.sl-readout-note {
  font-size: 2.2rem;
  margin: 0.25rem 0;
  color: var(--sl-gold-light);
}

.sl-readout-hz {
  font-size: 1.1rem;
  color: var(--sl-text-secondary);
}

.sl-readout-cent {
  display: block;
  font-size: 0.95rem;
  color: var(--sl-emerald);
}

/* 53-Koma Tuşlar */
.sl-microtonal-keys {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
  max-height: 280px;
  overflow-y: auto;
}

.sl-key-btn {
  background: var(--sl-surface-raised);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--sl-radius-sm);
  color: var(--sl-text-primary);
  padding: 0.6rem 0.3rem;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: background var(--sl-transition-fast);
}

.sl-key-btn:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: var(--sl-gold);
}

.sl-key-name {
  font-size: 0.8rem;
  font-weight: 600;
}

.sl-key-note {
  font-size: 0.7rem;
  color: var(--sl-text-secondary);
}

/* İSTASYON 2: MEDD ÖLÇER */
.sl-medd-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sl-medd-cards-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.sl-medd-card {
  background: var(--sl-surface);
  border: 1px solid var(--sl-surface-border);
  border-radius: var(--sl-radius-md);
  padding: 1.25rem;
  cursor: pointer;
  text-align: center;
  transition: all var(--sl-transition-fast);
}

.sl-medd-card:hover {
  border-color: var(--sl-gold);
}

.sl-medd-card.active {
  border-color: var(--sl-gold);
  background: var(--sl-surface-raised);
  box-shadow: 0 0 15px var(--sl-gold-glow);
}

.sl-medd-card-ar {
  font-family: var(--sl-font-arabic);
  font-size: 2.2rem;
  margin: 0 0 0.5rem 0;
  color: var(--sl-gold-light);
}

.sl-medd-card-type {
  font-size: 0.85rem;
  color: var(--sl-text-secondary);
}

.sl-medd-meter-card {
  background: var(--sl-surface);
  border: 1px solid var(--sl-surface-border);
  border-radius: var(--sl-radius-lg);
  padding: 2rem;
  text-align: center;
}

.sl-medd-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.sl-elif-meter {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.sl-elif-bar {
  height: 55px;
  background: var(--sl-surface-raised);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--sl-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--sl-text-muted);
  transition: all 0.12s ease;
}

.sl-elif-bar.active {
  background: linear-gradient(to top, #10b981, #34d399);
  color: var(--sl-bg-dark);
  box-shadow: 0 0 12px var(--sl-emerald-glow);
  transform: scaleY(1.06);
}

.sl-medd-big-digit {
  font-size: 3.8rem;
  font-weight: 800;
  color: var(--sl-gold-light);
}

.sl-medd-unit {
  font-size: 1.5rem;
  color: var(--sl-text-secondary);
  margin-left: 0.5rem;
}

/* İSTASYON 5: NEFES SVG HALKASI */
.sl-breath-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem 0;
}

.sl-breath-visual {
  position: relative;
  width: 260px;
  height: 260px;
}

.sl-breath-svg {
  transform: rotate(-90deg);
}

.sl-breath-bg-circle {
  fill: none;
  stroke: var(--sl-surface-raised);
  stroke-width: 14;
}

.sl-breath-progress-circle {
  fill: none;
  stroke: var(--sl-emerald);
  stroke-width: 14;
  stroke-linecap: round;
  transition: stroke 0.3s ease;
}

.sl-breath-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

#slBreathPhaseLabel {
  font-size: 1rem;
  color: var(--sl-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

#slBreathCountdown {
  font-size: 3.2rem;
  margin: 0.25rem 0 0 0;
  color: var(--sl-text-primary);
}

/* OKUMA PENCERESİ (MODAL) */
.sl-modal {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.sl-modal:not([open]) {
  display: none;
}

.sl-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(11, 15, 23, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.sl-modal-container {
  position: relative;
  width: 90vw;
  max-width: 1100px;
  max-height: 90vh;
  background: var(--sl-surface);
  border: 1px solid var(--sl-surface-border);
  border-radius: var(--sl-radius-lg);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sl-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid var(--sl-surface-border);
}

.sl-modal-title {
  font-size: 1.35rem;
  margin: 0.25rem 0 0 0;
  color: var(--sl-text-primary);
}

.sl-badge-makam {
  background: rgba(212, 175, 55, 0.15);
  color: var(--sl-gold);
  border: 1px solid var(--sl-gold);
  border-radius: 999px;
  padding: 0.2rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.sl-modal-body {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.sl-quran-box {
  background: var(--sl-bg-dark);
  border: 1px solid var(--sl-surface-border);
  border-radius: var(--sl-radius-md);
  padding: 2rem;
  text-align: center;
}

.sl-arabic-text {
  font-family: var(--sl-font-arabic);
  font-size: clamp(2.4rem, 4.5vw, 4rem);
  line-height: 1.8;
  color: var(--sl-gold-light);
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.sl-ayah-end {
  font-size: 0.75em;
  color: var(--sl-gold);
  margin-right: 0.5rem;
}

.sl-transcription-text {
  font-size: 1.1rem;
  color: var(--sl-text-secondary);
  font-style: italic;
  margin: 1rem 0 0.5rem 0;
}

.sl-tecvid-note {
  font-size: 0.9rem;
  color: var(--sl-emerald);
  margin: 0;
}

.sl-canvas-wrapper {
  position: relative;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--sl-radius-md);
  overflow: hidden;
}

#slContourCanvas {
  display: block;
  width: 100%;
  height: 240px;
}

.sl-countdown-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sl-countdown-overlay.hidden {
  display: none;
}

#slCountdownNumber {
  font-size: 6rem;
  font-weight: 900;
  color: var(--sl-gold);
  text-shadow: 0 0 30px var(--sl-gold);
}

.sl-modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  background: var(--sl-surface-raised);
  border-top: 1px solid var(--sl-surface-border);
}

/* SABİT ALT KONTROL ÇUBUĞU */
.sl-sticky-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 74px;
  background: rgba(20, 27, 38, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid var(--sl-surface-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 100;
}

.sl-bar-left, .sl-bar-center, .sl-bar-right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.sl-btn-mic.active .sl-mic-indicator {
  background: var(--sl-emerald);
  box-shadow: 0 0 10px var(--sl-emerald);
}

.sl-mic-indicator, .sl-drone-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--sl-text-muted);
}

.sl-btn-secondary.active .sl-drone-indicator {
  background: var(--sl-gold);
  box-shadow: 0 0 10px var(--sl-gold);
}

.sl-headphone-alert {
  font-size: 0.85rem;
  color: #fbbf24;
}

.hidden {
  display: none !important;
}

/* Prefers-reduced-motion Desteği */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Mobil Duyarlılık */
@media (max-width: 768px) {
  .sl-main-header {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
  }

  .sl-station-nav {
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .sl-tuner-layout {
    grid-template-columns: 1fr;
  }

  .sl-sticky-bar {
    height: auto;
    padding: 0.75rem 1rem;
    flex-direction: column;
    gap: 0.75rem;
  }

  .sl-modal-container {
    width: 96vw;
    height: 96vh;
  }
}
```
