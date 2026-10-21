// kimatik_lab/audio_lab/core/audio_focus_manager.js
// Çoklu Ses Kaynaklarının Çakışmasını Engelleyen Odak Orkestratörü

export class AudioFocusManager {
  constructor() {
    this.activeRequesters = new Map();
    this.setupVisibilityListener();
  }

  /**
   * Ses odağı talep eder.
   * @param {Object} requester 
   * @param {string} requester.id
   * @param {string} requester.name
   * @param {'exclusive'|'ambient'} requester.priority
   * @param {Function} requester.onInterrupted
   * @param {Function} [requester.onResumed]
   */
  requestFocus(requester) {
    if (requester.priority === 'exclusive') {
      // Diğer tüm ses kaynaklarına durma veya ducking bildirimi yap
      for (const [id, active] of this.activeRequesters.entries()) {
        if (id !== requester.id) {
          active.onInterrupted();
        }
      }
    } else if (requester.priority === 'ambient') {
      // Eğer zaten aktif bir exclusive kaynak varsa, ambient kaynağı engelle veya uyar
      const hasExclusive = Array.from(this.activeRequesters.values())
        .some(r => r.priority === 'exclusive');
      if (hasExclusive) {
        requester.onInterrupted();
        return false;
      }
    }

    this.activeRequesters.set(requester.id, requester);
    return true;
  }

  /**
   * Ses odağını serbest bırakır.
   * @param {string} id 
   */
  abandonFocus(id) {
    this.activeRequesters.delete(id);

    // Eğer exclusive kaynak bittiyse, duraklatılmış ambient kaynakları canlandır
    const hasExclusive = Array.from(this.activeRequesters.values())
      .some(r => r.priority === 'exclusive');

    if (!hasExclusive) {
      for (const requester of this.activeRequesters.values()) {
        if (requester.onResumed) {
          requester.onResumed();
        }
      }
    }
  }

  /**
   * Tüm sesleri derhal susturur.
   */
  stopAll() {
    for (const requester of this.activeRequesters.values()) {
      requester.onInterrupted();
    }
    this.activeRequesters.clear();
  }

  setupVisibilityListener() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stopAll();
        }
      });
    }
  }
}

export const audioFocusManager = new AudioFocusManager();
