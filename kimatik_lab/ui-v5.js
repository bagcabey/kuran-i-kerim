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


  /* 6. Mobil gezinti ikonları */
  const NAV_ICONS = {
    'tab-tilavet': 'M5 3.5A2.5 2.5 0 0 1 7.5 1H20v17H7.5a1 1 0 0 0 0 2H20v2H7.5A2.5 2.5 0 0 1 5 19.5zM9 5v2h7V5z',
    'tab-inceleme': 'M6 2h8l6 6v14H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5V9h5.5zM8 13h8v2H8zm0 4h6v2H8z',
    'open-beni-bul': ICONS.search,
    'open-seslab': 'M3 10h2v4H3zm4-4h2v12H7zm4-3h2v18h-2zm4 5h2v8h-2zm4-2h2v12h-2z',
    'open-pratik': 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
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

  /* Açık bir panel/pencere varken arka sayfa kaymaz */
  function syncScrollLock() {
    const deck = document.getElementById('beniBulDeck');
    const deckOpen = deck && deck.style.display !== 'none' && !deck.classList.contains('hidden');
    const drawerOpen = document.getElementById('sideNavDrawer')?.classList.contains('active');
    const modalOpen = !!document.querySelector('.akademi-modal-overlay');
    const sheetOpen = document.body.classList.contains('v5-sheet-open');
    const mini = document.getElementById('miniMushafWidget');
    const miniOpen = mqPhone.matches && mini && mini.style.display !== 'none' && getComputedStyle(mini).display !== 'none';
    document.body.classList.toggle('v5-scroll-lock', !!(deckOpen || drawerOpen || modalOpen || sheetOpen));
    void miniOpen; // kayan Mushaf açıkken sayfa kaydırılabilir kalır (örnekleri takip etmek için)
  }
  window.V5SyncScrollLock = syncScrollLock;
  function initScrollLockWatch() {
    const mo = new MutationObserver(() => syncScrollLock());
    mo.observe(document.body, { childList: true });
    const drawer = document.getElementById('sideNavDrawer');
    if (drawer) mo.observe(drawer, { attributes: true, attributeFilter: ['class'] });
  }

  /* 8. Açılır pencereler için arka perde */
  function initModalScrim() {
    const deck = document.getElementById('beniBulDeck');
    if (!deck) return;
    const sync = () => {
      const open = deck.style.display !== 'none' && !deck.classList.contains('hidden');
      document.body.classList.toggle('v5-modal-open', open);
      syncScrollLock();
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


  // Akademi bölümleri sol menüde: başka sekmedeyken de doğrudan bölüme gider.
  function initRailAkademiSub() {
    document.querySelectorAll('.v5-rail-subbtn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var view = btn.getAttribute('data-view');
        var shell = document.querySelector('.app-shell');
        if (shell && shell.getAttribute('data-active-tab') !== 'tab-akademi') {
          var tab = document.getElementById('tabBtnAkademi');
          if (tab) tab.click();
          if (typeof window.switchAkademiSubView === 'function') window.switchAkademiSubView(view);
        }
        if (window.innerWidth < 1024) window.scrollTo({ top: 0 });
      });
    });
  }

  // Âyet paneli: bir bölüm açılınca diğerleri kapanır; tecvid bölümünde kural sayısı
  function initAyahAccordion() {
    var aside = document.querySelector('.mushaf-companion-sidebar');
    if (!aside) return;
    aside.addEventListener('toggle', function (e) {
      var d = e.target;
      if (!d || !d.classList || !d.classList.contains('v5-acc') || !d.open) return;
      aside.querySelectorAll('details.v5-acc[open]').forEach(function (o) { if (o !== d) o.open = false; });
    }, true);
    var list = document.getElementById('activeAyahTajweedRules');
    var badge = document.getElementById('activeAyahTajweedCount');
    if (list && badge) {
      var sync = function () {
        var n = list.querySelectorAll('.tajweed-edu-card:not([data-family="neutral"])').length;
        badge.hidden = n === 0;
        badge.textContent = n + ' kural';
      };
      new MutationObserver(sync).observe(list, { childList: true });
      sync();
    }
  }

  /* Telefon ve tablet: uygulama kabuğu (başlık, bölüm menüsü, alt sekmeler, Mushaf çevirme) */
  const IC = {
    menu: 'M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z',
    flip: 'M7 7h10v3l4-4-4-4v3H5v6h2zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2z',
    play: ICONS.play,
    pause: ICONS.pause,
    left: 'M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12z',
    right: 'M8.6 16.6 10 18l6-6-6-6-1.4 1.4 4.6 4.6z'
  };
  function icon(d) {
    const ns = 'http://www.w3.org/2000/svg';
    const el = document.createElementNS(ns, 'svg');
    el.setAttribute('viewBox', '0 0 24 24'); el.setAttribute('aria-hidden', 'true'); el.setAttribute('class', 'v5-ico');
    const p = document.createElementNS(ns, 'path'); p.setAttribute('d', d); el.appendChild(p);
    return el;
  }

  function initMobileApp() {
    const shell = document.querySelector('.app-shell');
    const brand = document.querySelector('.brand-area');
    const header = document.querySelector('.app-header');
    if (!shell || !brand || !header) return;
    const mq = window.matchMedia('(max-width: 1023px)');

    const title = document.createElement('span');
    title.className = 'v5-appbar-title';
    title.id = 'v5AppTitle';
    brand.appendChild(title);

    // Akademi bölümleri menüsü: başlıktaki menü düğmesi
    const menuBtn = document.createElement('button');
    menuBtn.type = 'button';
    menuBtn.className = 'v5-appbar-menu';
    menuBtn.setAttribute('aria-label', 'Akademi bölümleri');
    menuBtn.appendChild(icon(IC.menu));
    menuBtn.addEventListener('click', (e) => { e.stopPropagation(); window.openSideNavDrawer?.(); });
    header.insertBefore(menuBtn, header.firstChild);

    const goView = (view) => {
      if (shell.getAttribute('data-active-tab') !== 'tab-akademi') document.getElementById('tabBtnAkademi')?.click();
      setTimeout(() => { window.switchAkademiSubView?.(view); window.scrollTo({ top: 0 }); }, 0);
    };
    const pratikNav = document.querySelector('.mobile-nav-item[data-action="open-pratik"]');
    const labNav = document.querySelector('.mobile-nav-item[data-action="open-seslab"]');
    const akademiNav = document.querySelector('.mobile-nav-item[data-tab="tab-akademi"]');
    pratikNav?.addEventListener('click', () => goView('pratik'));
    labNav?.addEventListener('click', () => goView('studyo'));
    akademiNav?.addEventListener('click', () => {
      setTimeout(() => {
        const v = document.querySelector('.v5-rail-subbtn.active')?.dataset.view;
        if (v === 'pratik' || v === 'studyo') window.switchAkademiSubView?.('yolculuk');
      }, 0);
    });

    const TAB_TITLES = { 'tab-tilavet': 'Mushaf', 'tab-inceleme': 'Âyet İnceleme', 'tab-akademi': 'Akademi' };
    function sync() {
      const tab = shell.getAttribute('data-active-tab') || 'tab-tilavet';
      const activeBtn = document.querySelector('.v5-rail-subbtn.active');
      const view = tab === 'tab-akademi' ? (activeBtn?.dataset.view || 'yolculuk') : '';
      title.textContent = view ? (activeBtn?.dataset.tip || 'Akademi') : (TAB_TITLES[tab] || '');
      document.body.dataset.v5View = view || tab.replace('tab-', '');
      const set = (el, on) => { if (!el) return; el.classList.toggle('active', on); if (on) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current'); };
      const onAk = tab === 'tab-akademi';
      set(pratikNav, onAk && view === 'pratik');
      set(labNav, onAk && view === 'studyo');
      set(akademiNav, onAk && view !== 'pratik' && view !== 'studyo');
      // Menüde seçili bölüm belirgin
      document.querySelectorAll('.drawer-acc-node').forEach(n => n.classList.toggle('is-current', onAk && n.dataset.module === view));
    }
    new MutationObserver(sync).observe(shell, { attributes: true, attributeFilter: ['data-active-tab'] });
    document.querySelectorAll('.v5-rail-subbtn').forEach(b => new MutationObserver(sync).observe(b, { attributes: true, attributeFilter: ['class'] }));
    sync();

    initMushafFlip(mq);
  }

  /* Mushaf (telefon/tablet): araç çubuğunda Dinle + Çevir; çevirince âyet sayfası tam ekran açılır */
  function initMushafFlip(mq) {
    const toolbar = document.querySelector('.mushaf-global-toolbar');
    const ws = document.querySelector('.mushaf-split-workspace');
    const master = document.getElementById('btnPlayActiveAyah');
    const titleEl = document.getElementById('activeAyahTitle');
    if (!toolbar || !ws || !master) return;

    const bar = document.createElement('div');
    bar.className = 'v5-m-ayahbar';
    bar.innerHTML = '<div class="v5-m-ayah"><span class="v5-m-ayah-kicker">Seçili âyet</span><strong class="v5-m-ayah-name"></strong></div>';
    const play = document.createElement('button');
    play.type = 'button';
    play.className = 'v5-m-play';
    const playTxt = document.createElement('span');
    play.appendChild(icon(IC.play)); play.appendChild(playTxt);
    const flip = document.createElement('button');
    flip.type = 'button';
    flip.className = 'v5-m-flip';
    flip.setAttribute('aria-pressed', 'false');
    const flipTxt = document.createElement('span');
    flip.appendChild(icon(IC.flip)); flip.appendChild(flipTxt);
    bar.appendChild(play); bar.appendChild(flip);
    toolbar.appendChild(bar);

    const nameEl = bar.querySelector('.v5-m-ayah-name');
    const syncTitle = () => {
      const t = (titleEl?.textContent || '').trim();
      const m = t.match(/^(\d+)\.\s*(.+?)\s+Suresi\s*-\s*(\d+)\./i);
      nameEl.textContent = m ? `${m[2]} · ${m[3]}. âyet` : t;
    };
    const syncPlay = () => {
      const on = master.classList.contains('is-playing');
      play.classList.toggle('is-playing', on);
      play.querySelector('path').setAttribute('d', on ? IC.pause : IC.play);
      playTxt.textContent = on ? 'Durdur' : 'Dinle';
      play.setAttribute('aria-label', on ? 'Âyeti durdur' : 'Âyeti dinle');
    };
    const setFlip = (on) => {
      ws.classList.toggle('v5-flipped', on);
      flip.setAttribute('aria-pressed', String(on));
      flipTxt.textContent = on ? 'Mushaf' : 'Âyet';
      flip.setAttribute('aria-label', on ? 'Mushaf sayfasına dön' : 'Âyetin meal, okunuş ve tecvidini aç');
      if (mq.matches) toolbar.scrollIntoView({ block: 'start' });
    };
    play.addEventListener('click', (e) => { e.stopPropagation(); master.click(); });
    flip.addEventListener('click', (e) => { e.stopPropagation(); setFlip(!ws.classList.contains('v5-flipped')); });
    if (titleEl) new MutationObserver(syncTitle).observe(titleEl, { childList: true, characterData: true, subtree: true });
    new MutationObserver(syncPlay).observe(master, { attributes: true, attributeFilter: ['class'] });
    mq.addEventListener?.('change', () => { if (!mq.matches) setFlip(false); });
    syncTitle(); syncPlay(); setFlip(false);
  }

  /* Yana kayan sekme şeritleri: taşma varsa iki yanda ok ve solma; aktif öğe görünür */
  const SCROLLER_SEL = ['.elifba-sub-nav', '.teknik-sub-nav', '.tecvid-cat-strip', '.mk-picker', '.sl-tabs', '.kt-filter', '.elifba-filter-row', '.wa-quick', '.quick-page-shortcuts', '.mushaf-legend-bar', '.makam-selector-strip', '.quick-discovery-strip', '.lounge-quick-pills', '.reciter-filter-strip', '.secavend-filter-bar', '.mk-scale', '.tp-compare-scroll'].join(',');
  const SCROLLER_FREE = '.mk-scale, .tp-compare-scroll';
  function enhanceScroller(el) {
    if (el.dataset.v5Scroller || !el.parentElement) return;
    el.dataset.v5Scroller = '1';
    const wrap = document.createElement('div');
    wrap.className = 'v5-scroller' + (el.matches(SCROLLER_FREE) ? ' v5-scroller--free' : '');
    el.parentElement.insertBefore(wrap, el);
    wrap.appendChild(el);
    el.classList.add('v5-scroller-track');
    const mk = (dir) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'v5-scroller-btn is-' + dir;
      b.setAttribute('aria-label', dir === 'prev' ? 'Öncekiler' : 'Sonrakiler');
      b.tabIndex = -1;
      b.appendChild(icon(dir === 'prev' ? IC.left : IC.right));
      b.addEventListener('click', (e) => { e.stopPropagation(); el.scrollBy({ left: (dir === 'prev' ? -1 : 1) * el.clientWidth * 0.7, behavior: 'smooth' }); });
      wrap.appendChild(b);
      return b;
    };
    mk('prev'); mk('next');
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const over = max > 4;
      wrap.classList.toggle('has-overflow', over);
      wrap.classList.toggle('can-prev', over && el.scrollLeft > 4);
      wrap.classList.toggle('can-next', over && el.scrollLeft < max - 4);
    };
    el.addEventListener('scroll', update, { passive: true });
    new ResizeObserver(update).observe(el);
    const active = el.querySelector('.active, .is-active, [aria-selected="true"], [aria-pressed="true"]');
    if (active && el.scrollWidth > el.clientWidth) el.scrollLeft = Math.max(0, active.offsetLeft - el.clientWidth / 2 + active.offsetWidth / 2);
    update();
  }
  function initScrollers() {
    let t = null;
    const run = () => { t = null; document.querySelectorAll(SCROLLER_SEL).forEach(enhanceScroller); };
    new MutationObserver(() => { if (!t) t = requestAnimationFrame(run); }).observe(document.body, { childList: true, subtree: true });
    run();
  }

  function init() {
    initRailAkademiSub();
    initMobileApp();
    initScrollers();
    initAyahAccordion();
    initScrollLockWatch();
    initEmojiCleanup();
    initModalScrim();
    initInceleme();
    initHeaderSearch();
    initPageNavButtons();
    initDisclosureChevrons();
    initToolsToggle();
    initMobileNavIcons();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
