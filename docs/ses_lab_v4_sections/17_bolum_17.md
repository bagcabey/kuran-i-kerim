# 17. BÖLÜM 17: BAŞKA BİR YAPAY ZEKÂ İÇİN YENİDEN ÜRETİM KILAVUZU

Bu bölüm, projeyi devralan başka bir yapay zekâ kod ajanının (Claude, Codex, Gemini, Cursor) hiçbir beşerî yardıma ihtiyaç duymadan Ses Laboratuvarı v4 modülünü sıfırdan ayağa kaldırabilmesi için adım adım inşa protokolüdür.

## 17.1. Adım Adım Kurulum Protokolü

### Adım 1: Dizin Hiyerarşisini Oluştur
Aşağıdaki komutla modül dizinlerini aç:
```bash
mkdir -p kimatik_lab/audio_lab/core
mkdir -p kimatik_lab/audio_lab/instruments
mkdir -p kimatik_lab/audio_lab/ui
mkdir -p kimatik_lab/audio_lab/data/qari_contours
mkdir -p tests
```

### Adım 2: Çekirdek Dosyaları Sırayla Yaz
Aşağıdaki dosyaları bu rehberde verilen eksiksiz kodlarıyla oluştur:
1. `kimatik_lab/audio_lab/core/types.ts` (Bölüm 2.3)
2. `kimatik_lab/audio_lab/core/master_bus.js` (Bölüm 3.1)
3. `kimatik_lab/audio_lab/core/audio_focus_manager.js` (Bölüm 3.2)
4. `kimatik_lab/audio_lab/instruments/drone_v2.js` (Bölüm 3.3)
5. `kimatik_lab/audio_lab/core/yin_processor.worklet.js` (Bölüm 4.1)
6. `kimatik_lab/audio_lab/core/mic_manager.js` (Bölüm 4.2)
7. `kimatik_lab/audio_lab/core/pitch_smoother.js` (Bölüm 4.3)
8. `kimatik_lab/audio_lab/core/tuning_core.js` (Bölüm 5.4)
9. `kimatik_lab/audio_lab/core/medd_engine.js` (Bölüm 6.4)
10. `kimatik_lab/audio_lab/core/dtw_v2.js` (Bölüm 7.5)
11. `kimatik_lab/audio_lab/core/spectrum_analyzer.js` (Bölüm 8.4)
12. `kimatik_lab/audio_lab/core/breath_coach_v2.js` (Bölüm 9.3)
13. `kimatik_lab/audio_lab/ui/reading_modal.js` (Bölüm 10.2)
14. `kimatik_lab/audio_lab/ui/studio_store.js` (Bölüm 11.1)
15. `kimatik_lab/audio_lab/ui/studio_ui.js` (Bölüm 11.2)
16. `kimatik_lab/audio_lab/ui/ses_lab_v4.css` (Bölüm 12.2)

### Adım 3: Test Dosyalarını Yerleştir ve Çalıştır
```bash
npm run test
# veya
npx vitest run tests/studio_dsp.test.ts tests/medd_engine.test.ts tests/dtw_scoring.test.ts
```

### Adım 4: HTML Entegrasyonu
`kimatik_lab/index.html` dosyasında Ses Laboratuvarı sekmesinin kapsayıcı div'ini bağla:
```html
<div id="sesLabRoot"></div>
<link rel="stylesheet" href="audio_lab/ui/ses_lab_v4.css">
<script type="module">
  import { StudioUI } from './audio_lab/ui/studio_ui.js';
  const studio = new StudioUI('sesLabRoot');
  studio.init();
</script>
```

### Adım 5: Doğrulama
Port 8000 üzerinden yerel sunucuyu aç ve Chrome CDP / DevTools ile konsolda sıfır hata olduğunu doğrula.
