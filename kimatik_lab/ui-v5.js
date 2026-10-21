/* =====================================================================
   TİLAVET AKADEMİSİ — ARAYÜZ v5 yardımcıları
   Yalnızca görünüm: ikonlar, mobil alt panel, okuma ayarları, başlık
   araması. İş mantığına dokunmaz; mevcut düğmeleri tetikler.
   ===================================================================== */
(function () {
  'use strict';

  const ICONS = {
    play: 'M8 5.14v13.72a1 1 0 0 0 1.52.85l11.03-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14z',
    pause: 'M7.5 5h2.5a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H7.5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm6.5 0h2.5a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H14a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
    chevronDown: 'M12 15.4 6.6 10l1.4-1.4 4 4 4-4 1.4 1.4z',
    chevronUp: 'M12 8.6 17.4 14 16 15.4l-4-4-4 4L6.6 14z',
    chevronLeft: 'M14.6 18 8.6 12l6-6L16 7.4 11.4 12l4.6 4.6z',
    chevronRight: 'M9.4 18 8 16.6 12.6 12 8 7.4 9.4 6l6 6z',
    search: 'M10.5 3a7.5 7.5 0 0 1 5.96 12.05l4.25 4.24-1.42 1.42-4.24-4.25A7.5 7.5 0 1 1 10.5 3zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z',
    tune: 'M3 6h10.2a3 3 0 0 1 5.6 0H21v2h-2.2a3 3 0 0 1-5.6 0H3zm13 2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM3 16h2.2a3 3 0 0 1 5.6 0H21v2H10.8a3 3 0 0 1-5.6 0H3zm5 2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
    sun: 'M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM11 1h2v3h-2zm0 19h2v3h-2zM3.5 4.9l1.4-1.4 2.1 2.1-1.4 1.4zM17 18.4l1.4-1.4 2.1 2.1-1.4 1.4zM1 11h3v2H1zm19 0h3v2h-3zM3.5 19.1l2.1-2.1 1.4 1.4-2.1 2.1zM17 5.6l2.1-2.1 1.4 1.4-2.1 2.1z',
    moon: 'M12.3 22A10 10 0 0 1 10.7 2.1a8 8 0 0 0 11.2 11.2A10 10 0 0 1 12.3 22z',
    sepia: 'M5 3h10.5L20 7.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm9 1.5V9h4.5zM7 12h10v1.6H7zm0 4h7v1.6H7z'
  };

  function svg(name, cls) {
    const ns = 'http://www.w3.org/2000/svg';
    const el = document.createElementNS(ns, 'svg');
    el.setAttribute('viewBox', '0 0 24 24');
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('focusable', 'false');
    el.setAttribute('class', 'v5-ico' + (cls ? ' ' + cls : ''));
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', ICONS[name]);
    el.appendChild(p);
    return el;
  }
  window.V5Icon = svg;

  const mqSheet = window.matchMedia('(max-width: 1023px)');
  const mqPhone = window.matchMedia('(max-width: 767px)');

  /* 1. Başlık araması: Beni Bul'u açan mevcut düğmeyi tetikler */
  function initHeaderSearch() {
    const hud = document.querySelector('.hud-telemetry');
    const target = document.getElementById('btnRailBeniBul');
    if (!hud || !target || document.getElementById('v5HeaderSearch')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'v5HeaderSearch';
    btn.className = 'v5-header-search';
    btn.setAttribute('aria-label', 'Âyet ara');
    btn.appendChild(svg('search'));
    const label = document.createElement('span');
    label.textContent = 'Sûre, âyet veya kelime ara';
    btn.appendChild(label);
    const kbd = document.createElement('kbd');
    kbd.textContent = 'Ctrl K';
    btn.appendChild(kbd);
    btn.addEventListener('click', (e) => {
      // Belge düzeyindeki "dışarı tıklayınca kapat" dinleyicisi pencereyi hemen kapatmasın
      e.stopPropagation();
      if (typeof window.openBeniBulModal === 'function') window.openBeniBulModal();
      else target.click();
    });
    const theme = document.getElementById('btnThemeToggle');
    hud.insertBefore(btn, theme || null);
  }

  /* 2. Sayfa geçiş düğmeleri: ikon + metin */
  function initPageNavButtons() {
    [['btnPrevPage', 'chevronLeft', 'Önceki', 'before'], ['btnNextPage', 'chevronRight', 'Sonraki', 'after']].forEach(([id, icon, text, pos]) => {
      const b = document.getElementById(id);
      if (!b || b.dataset.v5) return;
      b.dataset.v5 = '1';
      b.textContent = '';
      const t = document.createElement('span');
      t.className = 'v5-nav-txt';
      t.textContent = text;
      if (pos === 'before') { b.appendChild(svg(icon)); b.appendChild(t); }
      else { b.appendChild(t); b.appendChild(svg(icon)); }
      b.setAttribute('aria-label', text + ' sayfa');
    });
  }

  /* 3. "Meşhur sayfalar" özetine ok ikonu */
  function initDisclosureChevrons() {
    document.querySelectorAll('.quick-page-shortcuts-disclosure > summary').forEach(s => {
      if (s.querySelector('.v5-ico')) return;
      s.appendChild(svg('chevronDown', 'v5-ico--sm'));
    });
  }

  /* 4. Telefonda okuma ayarları (kârî, yazı boyutu) tek düğmenin arkasında */
  function initToolsToggle() {
    const bar = document.querySelector('.mushaf-global-toolbar');
    const center = bar && bar.querySelector('.toolbar-center-group');
    if (!bar || !center || document.getElementById('v5ToolsToggle')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'v5ToolsToggle';
    btn.className = 'btn v5-tools-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Okuma ayarları: kârî ve yazı boyutu');
    btn.appendChild(svg('tune'));
    btn.addEventListener('click', () => {
      const open = bar.classList.toggle('v5-tools-open');
      btn.setAttribute('aria-expanded', String(open));
    });
    center.appendChild(btn);
  }

  /* 5. Âyet paneli: tablet/telefonda alttan açılan panel */
  function initCompanionSheet() {
    const aside = document.querySelector('.mushaf-companion-sidebar');
    if (!aside || aside.querySelector('.v5-sheet-handle')) return;
    const handle = document.createElement('button');
    handle.type = 'button';
    handle.className = 'v5-sheet-handle';
    handle.setAttribute('aria-expanded', 'false');
    const lbl = document.createElement('span');
    lbl.className = 'v5-handle-label';
    const txt = document.createElement('span');
    txt.textContent = 'Meal, okunuş ve tecvid';
    lbl.appendChild(txt);
    lbl.appendChild(svg('chevronUp', 'v5-ico--sm'));
    handle.appendChild(lbl);
    aside.insertBefore(handle, aside.firstChild);
    aside.setAttribute('role', 'region');
    aside.setAttribute('aria-label', 'Seçili âyet');

    function setOpen(open) {
      aside.classList.toggle('is-open', open);
      handle.setAttribute('aria-expanded', String(open));
      txt.textContent = open ? 'Paneli küçült' : 'Meal, okunuş ve tecvid';
      if (open) aside.scrollTop = 0;
    }
    handle.addEventListener('click', () => setOpen(!aside.classList.contains('is-open')));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && aside.classList.contains('is-open') && mqSheet.matches) setOpen(false); });
    // Telefonda ayrı bir âyete dokunulunca panel kapalı kalır; mini oynatıcı başlığı güncellenir.
    mqSheet.addEventListener?.('change', () => setOpen(false));
  }

  /* 6. Mobil gezinti ikonları */
  const NAV_ICONS = {
    'tab-tilavet': 'M5 3.5A2.5 2.5 0 0 1 7.5 1H20v17H7.5a1 1 0 0 0 0 2H20v2H7.5A2.5 2.5 0 0 1 5 19.5zM9 5v2h7V5z',
    'tab-inceleme': 'M6 2h8l6 6v14H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5V9h5.5zM8 13h8v2H8zm0 4h6v2H8z',
    'open-beni-bul': ICONS.search,
    'tab-akademi': 'M12 3 1 9l11 6 9-4.9V17h2V9zM5 13.2V17c0 1.7 3.1 3 7 3s7-1.3 7-3v-3.8l-7 3.8z'
  };
  function initMobileNavIcons() {
    document.querySelectorAll('.mobile-nav-item').forEach(b => {
      if (b.querySelector('.v5-ico')) return;
      const key = b.dataset.tab || b.dataset.action;
      const d = NAV_ICONS[key];
      if (!d) return;
      ICONS['nav_' + key] = d;
      b.insertBefore(svg('nav_' + key), b.firstChild);
    });
  }

  /* 7. İnceleme: önceki/sonraki ikonları; kaydı olmayan bölümleri sessiz not olarak göster */
  function initInceleme() {
    [['btnPrevAyahInceleme', 'chevronLeft', 'Önceki', 'before'], ['btnNextAyahInceleme', 'chevronRight', 'Sonraki', 'after']].forEach(([id, icon, text, pos]) => {
      const b = document.getElementById(id);
      if (!b || b.dataset.v5) return;
      b.dataset.v5 = '1';
      b.textContent = '';
      const t = document.createElement('span');
      t.className = 'v5-nav-txt';
      t.textContent = text;
      if (pos === 'before') { b.appendChild(svg(icon)); b.appendChild(t); } else { b.appendChild(t); b.appendChild(svg(icon)); }
      b.setAttribute('aria-label', text + ' âyet');
    });
    document.querySelectorAll('.quick-discovery-disclosure > summary').forEach(s => { if (!s.querySelector('.v5-ico')) s.appendChild(svg('chevronDown', 'v5-ico--sm')); });

    const kissa = document.querySelector('#tab-inceleme .kissa-card');
    const scholars = document.querySelector('#tab-inceleme [aria-labelledby="scholarsStatusTitle"]');
    if (kissa && scholars && !kissa.parentElement.classList.contains('v5-notes-row')) {
      const title = document.getElementById('kissaTitle');
      const check = () => {
        const t = (title?.textContent || '').trim();
        const empty = !t || /bulunmuyor|aranıyor|gösterilemiyor/i.test(t);
        kissa.classList.toggle('v5-empty-note', empty);
        row.classList.toggle('v5-notes-row', empty);
      };
      const row = document.createElement('div');
      kissa.parentElement.insertBefore(row, kissa);
      row.appendChild(kissa);
      row.appendChild(scholars);
      scholars.classList.add('v5-empty-note');
      if (title) new MutationObserver(check).observe(title, { childList: true, characterData: true, subtree: true });
      check();
    }
  }

  /* 8. Açılır pencereler için arka perde */
  function initModalScrim() {
    const deck = document.getElementById('beniBulDeck');
    if (!deck) return;
    const sync = () => {
      const open = deck.style.display !== 'none' && !deck.classList.contains('hidden');
      document.body.classList.toggle('v5-modal-open', open);
    };
    new MutationObserver(sync).observe(deck, { attributes: true, attributeFilter: ['style', 'class'] });
    sync();
  }

  /* 9. Akademi: düğme ve başlıklardaki emoji / süs simgelerini temizle (metin korunur) */
  const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{1F000}-\u{1F2FF}]/gu;
  const KEEP = /[\u25B6\u23F8\u23F9\u23EE\u23ED\u2014\u2013\u2713\u2714\u2715\u2716\u2717\u2605\u2606\u2190-\u21FF\u2022]/;
  function cleanText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        if (!p || p.closest('[lang="ar"], [dir="rtl"], script, style, textarea, input')) return NodeFilter.FILTER_REJECT;
        EMOJI.lastIndex = 0;
        return (EMOJI.test(n.nodeValue) || /(^|\s)undefined(\s|$)/.test(n.nodeValue)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      const v = n.nodeValue.replace(EMOJI, ch => (KEEP.test(ch) ? ch : '')).replace(/(^|\s)undefined(?=\s|$)/g, '$1').replace(/^\s{2,}/, ' ');
      if (v !== n.nodeValue) n.nodeValue = v;
    });
  }
  function initEmojiCleanup() {
    const scope = document.getElementById('tab-akademi');
    if (!scope) return;
    let t = null;
    const run = () => { t = null; cleanText(scope); const d = document.getElementById('sideNavDrawer'); if (d) cleanText(d); };
    new MutationObserver(() => { if (!t) t = requestAnimationFrame(run); }).observe(scope, { childList: true, subtree: true, characterData: true });
    run();
  }

  function init() {
    initEmojiCleanup();
    initModalScrim();
    initInceleme();
    initHeaderSearch();
    initPageNavButtons();
    initDisclosureChevrons();
    initToolsToggle();
    initCompanionSheet();
    initMobileNavIcons();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
