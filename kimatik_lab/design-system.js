(function () {
  'use strict';

  /* Üç tema: aydınlık, sepya (okuma), karanlık. Varsayılan: sistem tercihi. */
  const root = document.documentElement;
  const button = document.getElementById('btnThemeToggle');
  const storageKey = 'cymatique_theme';
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  const ORDER = ['light', 'sepia', 'dark'];
  const LABELS = { light: 'Aydınlık', sepia: 'Sepya', dark: 'Karanlık' };
  const META = { light: '#ffffff', sepia: '#f8ebd5', dark: '#222529' };
  const ICON = {
    light: 'M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM11 1h2v3h-2zm0 19h2v3h-2zM3.5 4.9l1.4-1.4 2.1 2.1-1.4 1.4zM17 18.4l1.4-1.4 2.1 2.1-1.4 1.4zM1 11h3v2H1zm19 0h3v2h-3zM3.5 19.1l2.1-2.1 1.4 1.4-2.1 2.1zM17 5.6l2.1-2.1 1.4 1.4-2.1 2.1z',
    sepia: 'M5 3h10.5L20 7.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm9 1.5V9h4.5zM7 12h10v1.6H7zm0 4h7v1.6H7z',
    dark: 'M12.3 22A10 10 0 0 1 10.7 2.1a8 8 0 0 0 11.2 11.2A10 10 0 0 1 12.3 22z'
  };
  let mode = 'system';

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'system' || ORDER.includes(saved)) mode = saved;
  } catch (error) {
    console.warn('[UI] Tema tercihi okunamadı:', error);
  }

  function current() {
    return mode === 'system' ? (preference.matches ? 'dark' : 'light') : mode;
  }

  function applyTheme() {
    const theme = current();
    // Sepya, aydınlık temanın bir okuma tonudur: eski aydınlık kurallar da geçerli kalır.
    root.dataset.theme = theme === 'sepia' ? 'light' : theme;
    if (theme === 'sepia') root.dataset.tone = 'sepia'; else delete root.dataset.tone;
    root.dataset.themeMode = mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META[theme]);
    if (!button) return;
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    button.setAttribute('aria-label', `Görünüm: ${LABELS[theme]}. ${LABELS[next]} görünüme geç`);
    button.setAttribute('title', `Görünüm: ${LABELS[theme]} · ${LABELS[next]} için tıklayın`);
    const icon = button.querySelector('.theme-toggle-icon');
    if (icon) icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${ICON[theme]}"/></svg>`;
    const label = button.querySelector('.theme-toggle-label');
    if (label) label.textContent = LABELS[theme];
  }

  button?.addEventListener('click', () => {
    mode = ORDER[(ORDER.indexOf(current()) + 1) % ORDER.length];
    try {
      localStorage.setItem(storageKey, mode);
    } catch (error) {
      console.warn('[UI] Tema tercihi kaydedilemedi:', error);
    }
    applyTheme();
  });

  window.TilavetTheme = {
    getMode: () => mode,
    setMode: (next) => {
      if (next !== 'system' && !ORDER.includes(next)) return;
      mode = next;
      try { localStorage.setItem(storageKey, mode); } catch (_) {}
      applyTheme();
    }
  };

  preference.addEventListener?.('change', () => {
    if (mode === 'system') applyTheme();
  });
  applyTheme();
})();
