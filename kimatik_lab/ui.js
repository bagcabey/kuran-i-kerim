/**
 * CYMATIQUE — Kur'ân-ı Kerîm Mushaf & Tilavet Laboratuvarı
 * UI / UX Katmanı (ui.js)
 * =============================================================================
 * Motor mantığına dokunmadan, MutationObserver ve yerel olay dinleyicileriyle
 * arayüzün durum -> görsel eşlemesini ve erişilebilirlik gereksinimlerini yönetir.
 * =============================================================================
 */

(function () {
  'use strict';

  // 1. TECVİD KARTI AİLE EŞLEME TABLOSU (HEX -> data-family)
  const HEX_FAMILY = {
    '#ff3366': 'madd',
    '#ff5252': 'madd',
    '#d50000': 'madd',
    '#ffab00': 'madd',
    '#ffd700': 'madd',
    '#ffc107': 'madd',
    '#00c853': 'ihfa',
    '#00e676': 'ihfa',
    '#00e5ff': 'kalkale',
    '#b71c1c': 'lafz',
    '#ff1744': 'vakif',
    '#ffc837': 'vakif',
    '#ff9100': 'iklab' // Rozet metninde 'Dönüştürme' yoksa 'vakif' olur
  };

  // 2. YAZI BOYUTU (A- / A+) VE CVD (RENK DIŞI İPUCU) YÖNETİMİ
  let currentScale = 1.0;
  const STORAGE_KEY_SCALE = 'cymatique_mushaf_scale';
  const STORAGE_KEY_CVD = 'cymatique_mushaf_cvd';

  function initFontScaling() {
    const savedScale = localStorage.getItem(STORAGE_KEY_SCALE);
    if (savedScale) {
      const parsed = parseFloat(savedScale);
      if (!isNaN(parsed) && parsed >= 0.8 && parsed <= 1.5) {
        currentScale = parsed;
        applyFontScale(currentScale);
      }
    }

    const btnMinus = document.getElementById('btnFontMinus');
    const btnPlus = document.getElementById('btnFontPlus');

    btnMinus?.addEventListener('click', (e) => {
      e.preventDefault();
      currentScale = Math.max(0.8, Math.round((currentScale - 0.05) * 100) / 100);
      applyFontScale(currentScale);
    });

    btnPlus?.addEventListener('click', (e) => {
      e.preventDefault();
      currentScale = Math.min(1.5, Math.round((currentScale + 0.05) * 100) / 100);
      applyFontScale(currentScale);
    });
  }

  function applyFontScale(scale) {
    document.documentElement.style.setProperty('--mushaf-scale', scale);
    localStorage.setItem(STORAGE_KEY_SCALE, scale.toString());
  }

  function initCvdToggle() {
    const btn = document.getElementById('btnToggleCvd');
    const isCvd = localStorage.getItem(STORAGE_KEY_CVD) === 'true';

    if (isCvd) {
      document.documentElement.setAttribute('data-cvd', '');
      btn?.setAttribute('aria-pressed', 'true');
    }

    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      const current = document.documentElement.hasAttribute('data-cvd');
      if (current) {
        document.documentElement.removeAttribute('data-cvd');
        btn.setAttribute('aria-pressed', 'false');
        localStorage.setItem(STORAGE_KEY_CVD, 'false');
      } else {
        document.documentElement.setAttribute('data-cvd', '');
        btn.setAttribute('aria-pressed', 'true');
        localStorage.setItem(STORAGE_KEY_CVD, 'true');
      }
    });
  }

  // 3. MUSHAF SAYFASI ERİŞİLEBİLİRLİK & ETKİLEŞİM İYİLEŞTİRMELERİ
  function enhanceMushafPageA11y(container) {
    if (!container) return;

    const bodyEl = container.querySelector('.mushaf-15lines-body');
    if (bodyEl) {
      bodyEl.setAttribute('lang', 'ar');
      bodyEl.setAttribute('dir', 'rtl');
    }

    const ayahSpans = container.querySelectorAll('.page-ayah-span');
    ayahSpans.forEach(span => {
      if (!span.hasAttribute('tabindex')) {
        span.setAttribute('tabindex', '0');
        span.setAttribute('role', 'button');
        const s = span.getAttribute('data-surah') || '';
        const a = span.getAttribute('data-ayah') || '';
        span.setAttribute('aria-label', `Sure ${s}, Âyet ${a}`);

        span.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            span.click();
          }
        });
      }
    });
  }

  // 4. TECVİD KARTLARINA data-family ETİKETİ ATAMA (MUTATION OBSERVER)
  function tagTajweedCards(container) {
    if (!container) return;

    const cards = container.querySelectorAll('.tajweed-edu-card');
    cards.forEach(card => {
      if (card.hasAttribute('data-family')) return;

      const ruleColor = (card.style.getPropertyValue('--rule') || '').trim().toLowerCase();
      const badgeText = (card.querySelector('.tajweed-card-badge')?.textContent || '').toLowerCase();
      const actionText = (card.querySelector('.tajweed-action-strip')?.textContent || '').toLowerCase();

      let family = HEX_FAMILY[ruleColor];

      if (ruleColor === '#ff9100') {
        if (badgeText.includes('dönüştür') || actionText.includes('iklab') || actionText.includes('iklâb')) {
          family = 'iklab';
        } else {
          family = 'vakif';
        }
      }

      if (!family) {
        if (actionText.includes('madd') || actionText.includes('uzat')) family = 'madd';
        else if (actionText.includes('ihfa') || actionText.includes('gunne') || actionText.includes('idgam')) family = 'ihfa';
        else if (actionText.includes('kalkale')) family = 'kalkale';
        else if (actionText.includes('vakıf') || actionText.includes('durak') || actionText.includes('dur')) family = 'vakif';
        else if (actionText.includes('lafzatullah') || actionText.includes('lafza')) family = 'lafz';
        else if (actionText.includes('iklab') || actionText.includes('iklâb')) family = 'iklab';
        else family = 'neutral';
      }

      card.setAttribute('data-family', family);
    });
  }

  // 5. MİKROFON HUD SENKRONİZASYONU
  function syncMicrophoneHUD() {
    const micDot = document.getElementById('micHudDot');
    const micStatus = document.getElementById('hudMicStatus');
    if (!micDot || !micStatus) return;

    const liveBadge = document.getElementById('tilavetLiveBadge');
    const isLiveBadgeActive = liveBadge && liveBadge.style.display !== 'none' && !liveBadge.classList.contains('hidden');

    const listenBtn = document.getElementById('btnListenTilavet');
    const isListeningBtn = listenBtn && (listenBtn.classList.contains('recording') || listenBtn.classList.contains('is-recording'));

    const beniBulVoiceBtn = document.getElementById('btnStartBeniBulVoice');
    const isBeniBulVoice = beniBulVoiceBtn && beniBulVoiceBtn.classList.contains('recording');

    const studioMicActive = (window.TilavetAkademiEngine?.isStudioMicActive?.() === true) || (window.MicManagerV4?.isActive === true);
    const isRecording = isLiveBadgeActive || isListeningBtn || isBeniBulVoice || studioMicActive;

    if (isRecording) {
      micDot.className = 'hud-dot red';
      micStatus.textContent = 'DİNLİYOR';
    } else {
      micDot.className = 'hud-dot active';
      micStatus.textContent = 'HAZIR';
    }

    function syncStudyIntro() {
      const target = document.getElementById('studyIntroAyah');
      if (!target) return;
      const state = window.IncelemeState || window.TilavetState;
      const surahNo = Number(state?.currentSurah);
      const ayahNo = Number(state?.currentAyah);
      const surah = window.SURAH_LIST?.find(item => item.no === surahNo);
      if (surah && Number.isFinite(ayahNo) && ayahNo > 0) {
        target.textContent = `${surah.name} · ${ayahNo}`;
        return;
      }
      const badge = document.getElementById('hudActiveAyahBadge');
      if (badge?.textContent) target.textContent = badge.textContent.trim();
    }

    // Beni Bul durum çubuğunu senkronize et
    const beniBulStatus = document.getElementById('beniBulStatus');
    if (beniBulStatus) {
      if (isBeniBulVoice) {
        beniBulStatus.classList.add('listening');
      } else {
        beniBulStatus.classList.remove('listening');
      }
    }
  }

  // 6. BENİ BUL KAPLAMASI (AÇMA, KAPATMA, ESC & DIŞARI TIKLAMA)
  function openBeniBulModal() {
    const deck = document.getElementById('beniBulDeck');
    if (!deck) return;

    if (typeof switchAppTab === 'function') {
      switchAppTab('tab-tilavet');
    }

    deck.style.display = 'block';
    deck.classList.remove('hidden');

    const surahSel = document.getElementById('beniBulSurahSelect');
    const ayahInput = document.getElementById('beniBulAyahInput');
    if (surahSel && window.TilavetState && window.TilavetState.currentSurah) {
      surahSel.value = window.TilavetState.currentSurah;
      if (typeof window.updateBeniBulAyahInputBounds === 'function') {
        window.updateBeniBulAyahInputBounds();
      }
    }
    if (ayahInput && window.TilavetState && window.TilavetState.currentAyah) {
      ayahInput.value = window.TilavetState.currentAyah;
    }

    setTimeout(() => {
      const input = document.getElementById('inputBeniBulText');
      if (input) {
        input.focus();
        input.select();
      }
    }, 60);
  }

  function closeBeniBulModal() {
    const deck = document.getElementById('beniBulDeck');
    if (!deck) return;
    deck.classList.add('hidden');
    deck.style.display = 'none';
  }

  function toggleBeniBulModal() {
    const deck = document.getElementById('beniBulDeck');
    if (!deck) return;
    const isVisible = deck.style.display !== 'none' && !deck.classList.contains('hidden');
    if (isVisible) {
      closeBeniBulModal();
    } else {
      openBeniBulModal();
    }
  }

  window.openBeniBulModal = openBeniBulModal;
  window.closeBeniBulModal = closeBeniBulModal;
  window.toggleBeniBulModal = toggleBeniBulModal;

  function initBeniBulOverlayEvents() {
    const deck = document.getElementById('beniBulDeck');
    const railBtn = document.getElementById('btnRailBeniBul');
    const closeBtn = document.getElementById('btnCloseBeniBulDeck');
    if (!deck) return;

    // Sol raydaki "Beni Bul" butonuna tıklandığında aç/kapat
    railBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleBeniBulModal();
    });

    // Modal içindeki ✕ Kapat butonuna tıklandığında kapat
    closeBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      closeBeniBulModal();
      railBtn?.focus();
    });

    // Esc tuşu ile kapatma
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        const isVisible = deck.style.display !== 'none' && !deck.classList.contains('hidden');
        if (isVisible) {
          e.preventDefault();
          closeBeniBulModal();
          railBtn?.focus();
        }
      }
    });

    // Dışarı tıklama ile kapatma (railBtn veya deck haricine tıklandığında)
    document.addEventListener('click', (e) => {
      const isVisible = deck.style.display !== 'none' && !deck.classList.contains('hidden');
      if (!isVisible) return;

      const isInsideDeck = deck.contains(e.target);
      const isRailBtn = railBtn && (railBtn === e.target || railBtn.contains(e.target));
      const isSearchTrigger = e.target.closest('#btnIntroFindAyah, .mobile-nav-item[data-action="open-beni-bul"]');

      if (!isInsideDeck && !isRailBtn && !isSearchTrigger) {
        closeBeniBulModal();
      }
    });

    // Sonuç kartındaki "Mushaf Sayfasına Git" butonuna basılınca paneli kapat
    deck.addEventListener('click', (e) => {
      const openFullBtn = e.target.closest('.btn-open-fullpage');
      if (openFullBtn) {
        setTimeout(() => {
          closeBeniBulModal();
        }, 120);
      }
    });
  }

  // 7. ÇALAN ÂYETİN GÖRÜNÜR ALANA OTOMATİK KAYDIRILMASI
  function scrollPlayingAyahIntoView(container) {
    if (!container) return;
    const playingAyah = container.querySelector('.page-ayah-playing');
    if (playingAyah) {
      playingAyah.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }

  // 8. KLAVYE SPACE TUŞU KORUMASI (CAPTURE AŞAMASI)
  function initSpacebarProtection() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        const active = document.activeElement;
        if (!active) return;

        const tag = active.tagName.toLowerCase();
        // Buton, form elemanı, summary veya link üzerinde Space basıldıysa native eyleme izin ver
        if (
          tag === 'input' ||
          tag === 'textarea' ||
          tag === 'select' ||
          tag === 'summary' ||
          tag === 'button' ||
          active.isContentEditable ||
          active.classList.contains('page-ayah-span')
        ) {
          e.stopPropagation();
        }
      }
    }, true); // Capture phase
  }

  // 9. SAYFA GEÇİŞ YÖNÜ BELİRTECİ
  function initPageTurnDirectionTracker() {
    const prevBtn = document.getElementById('btnPrevPage');
    const nextBtn = document.getElementById('btnNextPage');
    const pageFrame = document.getElementById('realMushafPage');

    prevBtn?.addEventListener('click', () => {
      pageFrame?.setAttribute('data-turn', 'prev');
    });

    nextBtn?.addEventListener('click', () => {
      pageFrame?.setAttribute('data-turn', 'next');
    });

    const shortcutBtns = document.querySelectorAll('.btn-page-shortcut');
    shortcutBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        pageFrame?.setAttribute('data-turn', 'next');
      });
    });
  }

  // 10. DOM MUTATION OBSERVERS
  function initObservers() {
    // A. Mushaf sayfası render gözlemcisi
    const mushafContainer = document.getElementById('realMushafPage');
    if (mushafContainer) {
      enhanceMushafPageA11y(mushafContainer);

      const pageObserver = new MutationObserver((mutations) => {
        enhanceMushafPageA11y(mushafContainer);
        scrollPlayingAyahIntoView(mushafContainer);
      });

      pageObserver.observe(mushafContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    }

    // B. Tecvid kuralları listesi gözlemcisi
    const tajweedContainer = document.getElementById('activeAyahTajweedRules');
    if (tajweedContainer) {
      tagTajweedCards(tajweedContainer);

      const tajweedObserver = new MutationObserver(() => {
        tagTajweedCards(tajweedContainer);
      });

      tajweedObserver.observe(tajweedContainer, {
        childList: true,
        subtree: true
      });
    }

    // C. Canlı mikrofon durumu gözlemcisi
    const micObserver = new MutationObserver(() => {
      syncMicrophoneHUD();
      syncStudyIntro();

      const studyBadge = document.getElementById('hudActiveAyahBadge');
      if (studyBadge) {
        const studyObserver = new MutationObserver(syncStudyIntro);
        studyObserver.observe(studyBadge, { childList: true, subtree: true, characterData: true });
      }
    });

    const liveBadge = document.getElementById('tilavetLiveBadge');
    if (liveBadge) {
      micObserver.observe(liveBadge, { attributes: true, attributeFilter: ['style', 'class'] });
    }

    const listenBtn = document.getElementById('btnListenTilavet');
    if (listenBtn) {
      micObserver.observe(listenBtn, { attributes: true, attributeFilter: ['class'] });
    }

    const beniBulVoiceBtn = document.getElementById('btnStartBeniBulVoice');
    if (beniBulVoiceBtn) {
      micObserver.observe(beniBulVoiceBtn, { attributes: true, attributeFilter: ['class'] });
    }

    syncMicrophoneHUD();
  }

  // 10. SEKME (TAB) GEZİNTİSİ VE ÇİFT YÖNLÜ BAĞLANTI (MUSHAF <-> İNCELEME)
  function switchAppTab(tabId) {
    if (!tabId) return;

    // 1. Tab butonlarının aktifliğini güncelle
    const tabBtns = document.querySelectorAll('.nav-tab-btn');
    tabBtns.forEach(btn => {
      const target = btn.getAttribute('data-tab');
      if (target === tabId) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // 2. Tab içeriklerinin görünürlüğünü güncelle
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
      if (content.id === tabId) {
        content.classList.add('active');
        content.style.display = 'block';
      } else {
        content.classList.remove('active');
        content.style.display = 'none';
      }
    });

    // 3. Kabuk üzerinde aktif sekmeyi işaretle (CSS HUD filtreleme için)
    document.querySelector('.app-shell')?.setAttribute('data-active-tab', tabId);
    document.querySelectorAll('.mobile-nav-item[data-tab]').forEach(btn => {
      const isActive = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', isActive);
      if (isActive) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });

    // 4. Sekmeler arası ses çakışmasını %100 önle (Merkezi Ses Koordinatörü)
    if (typeof window.TilavetAudioManager !== 'undefined') {
      window.TilavetAudioManager.stopAll('tab_change');
    }
    if (typeof window.stopAllAudioPlayback === 'function') {
      window.stopAllAudioPlayback();
    }
    if (typeof window.stopAyahAudio === 'function') {
      window.stopAyahAudio();
    }
    if (window.TilavetAudioLab?.drone) {
      window.TilavetAudioLab.drone.stop();
    }

    // Mini Mushaf penceresini sadece Akademi sekmesinde tut
    const miniWidget = document.getElementById('miniMushafWidget');
    const miniPill = document.getElementById('miniMushafPill');
    if (tabId !== 'tab-akademi') {
      if (miniWidget) miniWidget.style.display = 'none';
      if (miniPill) miniPill.style.display = 'none';
    }

    if (tabId === 'tab-akademi' && typeof window.TilavetAkademiEngine?.init === 'function') {
      window.TilavetAkademiEngine.init();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 5. URL hash güncelle
    try {
      history.replaceState(null, '', `#${tabId}`);
    } catch (_) {}
  }
  window.switchAppTab = switchAppTab;

  function initRailCollapse() {
    const appShell = document.querySelector('.app-shell');
    const toggle = document.getElementById('btnToggleRail');
    if (!appShell || !toggle) return;

    const storageKey = 'cymatique_rail_collapsed';
    let isCollapsed = false;

    try {
      isCollapsed = localStorage.getItem(storageKey) === 'true';
    } catch (error) {
      console.warn('[UI] Gezinti menüsü tercihi okunamadı:', error);
    }

    function applyState() {
      appShell.dataset.railCollapsed = String(isCollapsed);
      const label = isCollapsed ? 'Menüyü genişlet' : 'Menüyü daralt';
      toggle.setAttribute('aria-expanded', String(!isCollapsed));
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('title', label);
      const screenReaderLabel = toggle.querySelector('.sr-only');
      if (screenReaderLabel) screenReaderLabel.textContent = label;
      const icon = toggle.querySelector('.rail-toggle-icon');
      if (icon) icon.textContent = isCollapsed ? '›' : '‹';
    }

    applyState();
    toggle.addEventListener('click', () => {
      isCollapsed = !isCollapsed;
      applyState();
      try {
        localStorage.setItem(storageKey, String(isCollapsed));
      } catch (error) {
        console.warn('[UI] Gezinti menüsü tercihi kaydedilemedi:', error);
      }
    });
  }

  function initTabNavigation() {
    // Sol rail tab butonları
    const tabBtns = document.querySelectorAll('.nav-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-tab');
        if (target) switchAppTab(target);
      });
    });

    document.querySelectorAll('.mobile-nav-item[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => switchAppTab(btn.getAttribute('data-tab')));
    });

    document.querySelectorAll('.mobile-nav-item[data-action="open-beni-bul"], #btnIntroFindAyah').forEach(btn => {
      btn.addEventListener('click', () => openBeniBulModal());
    });

    // Mushaf toolbar'ındaki "Âyet İnceleme & Tefsir" butonu
    const btnOpenInceleme = document.getElementById('btnOpenIncelemePage');
    btnOpenInceleme?.addEventListener('click', (e) => {
      e.preventDefault();
      const s = window.TilavetState?.currentSurah || 2;
      const a = window.TilavetState?.currentAyah || 285;
      if (typeof window.loadAndRenderAyahInceleme === 'function') {
        window.loadAndRenderAyahInceleme(s, a);
      }
      syncStudyIntro();
      const studyAyah = document.getElementById('studyIntroAyah');
      const surah = window.SURAH_LIST?.find(item => item.no === s);
      if (studyAyah) studyAyah.textContent = `${surah?.name || 'Sûre ' + s} · ${a}`;
      switchAppTab('tab-inceleme');
    });

    // İnceleme sayfasından Mushaf'a dönüş butonu
    const btnReturnMushaf = document.getElementById('btnReturnToMushaf');
    btnReturnMushaf?.addEventListener('click', (e) => {
      e.preventDefault();
      const s = window.IncelemeState?.currentSurah || 2;
      const a = window.IncelemeState?.currentAyah || 1;

      switchAppTab('tab-tilavet');
      if (typeof window.locateAndSelectSurahAyah === 'function') {
        window.locateAndSelectSurahAyah(s, a);
      } else if (typeof window.loadMushafPage === 'function') {
        const page = (window.SURAH_START_PAGE && window.SURAH_START_PAGE[s]) || 1;
        window.loadMushafPage(page, a);
      }
      document.getElementById('realMushafPage')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Sayfa ilk yüklendiğinde hash varsa o sekmeyi aç
    const hash = window.location.hash.replace('#', '');
    if (hash === 'tab-inceleme' || hash === 'tab-tilavet' || hash === 'tab-akademi') {
      switchAppTab(hash);
    }
  }

  // 11. BAŞLATICI
  document.addEventListener('DOMContentLoaded', () => {
    initFontScaling();
    initCvdToggle();
    initBeniBulOverlayEvents();
    initSpacebarProtection();
    initPageTurnDirectionTracker();
    initRailCollapse();
    initTabNavigation();
    initObservers();
  });

})();
