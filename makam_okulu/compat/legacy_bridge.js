// makam_okulu/compat/legacy_bridge.js
// Makam Okulu'nun dış dünyayla TEK temas noktası (K-01 izolasyonu).

const warned = new Set();
function warnOnce(name) {
  if (!warned.has(name)) {
    warned.add(name);
    console.warn(`[MakamBridge] Bağımlılık bulunamadı, fallback devrede: ${name}`);
  }
}

export const bridge = {
  toast: (m, ms = 2200) => {
    if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
      return window.showToast(m, ms);
    }
    warnOnce('window.showToast');
    console.info('[toast]', m);
  },

  notifyAudio: (kind) => {
    if (typeof window !== 'undefined' && window.TilavetAudioManager?.notifyPlay) {
      return window.TilavetAudioManager.notifyPlay(kind);
    }
    warnOnce('window.TilavetAudioManager.notifyPlay');
  },

  registerAudio: (name, handler) => {
    if (typeof window !== 'undefined' && window.TilavetAudioManager?.register) {
      return window.TilavetAudioManager.register(name, handler);
    }
    warnOnce('window.TilavetAudioManager.register');
  },

  stopAllAudio: (reason) => {
    if (typeof window !== 'undefined' && window.TilavetAudioManager?.stopAll) {
      return window.TilavetAudioManager.stopAll(reason);
    }
    warnOnce('window.TilavetAudioManager.stopAll');
  },

  ayahUrl: (s, a, reciterId) => {
    if (typeof window !== 'undefined' && typeof window.getAyahAudioUrl === 'function') {
      return window.getAyahAudioUrl(s, a, reciterId);
    }
    warnOnce('window.getAyahAudioUrl');
    return null;
  },

  playQari: (s, a, onEnded, reciterId) => {
    if (typeof window !== 'undefined' && typeof window.playQariRecitation === 'function') {
      return window.playQariRecitation(s, a, onEnded, reciterId);
    }
    warnOnce('window.playQariRecitation');
  },

  switchTab: (tabId) => {
    if (typeof window !== 'undefined' && typeof window.switchAppTab === 'function') {
      return window.switchAppTab(tabId);
    }
    warnOnce('window.switchAppTab');
  },

  async openInMushaf(s, a) {
    // K-04: ÖNCE sekmeye geç, SONRA ayeti seç (hedef sekme görünür olmadan seçim başarısız olabilir)
    if (typeof window !== 'undefined' && typeof window.switchAppTab === 'function') {
      window.switchAppTab('tab-tilavet');
    }
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    } else {
      await new Promise(r => setTimeout(r, 50));
    }
    if (typeof window !== 'undefined' && typeof window.locateAndSelectSurahAyah === 'function') {
      return !!window.locateAndSelectSurahAyah(s, a);
    }
    warnOnce('window.locateAndSelectSurahAyah');
    return false;
  },

  getAudioContext: () => {
    if (typeof window === 'undefined') return null;
    if (typeof window.getAudioContext === 'function') return window.getAudioContext();
    if (!window.__makamAudioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) window.__makamAudioCtx = new AudioCtx();
    }
    return window.__makamAudioCtx || null;
  },

  formatAudioTime: (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  },

  getState: () => {
    if (typeof window !== 'undefined') {
      return window.__makamState || null;
    }
    return null;
  },

  saveState: (data) => {
    if (typeof window !== 'undefined') {
      window.__makamState = data;
      try {
        localStorage.setItem('makamOkulu.v3', JSON.stringify(data));
      } catch (e) {
        // LocalStorage quota or privacy mode
      }
    }
  }
};

if (typeof window !== 'undefined') {
  window.MakamLegacyBridge = bridge;
}
