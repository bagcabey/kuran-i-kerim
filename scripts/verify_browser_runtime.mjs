import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.resolve('temp_chrome_profile_verify');

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('Başlatılıyor: Headless Chrome CDP Doğrulama...');
  const proc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${USER_DATA}`,
    'about:blank'
  ]);

  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9223/json/new', { method: 'PUT' });
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch (e) {
      await wait(300);
    }
  }

  if (!wsUrl) {
    proc.kill();
    throw new Error('Chrome remote debugging portuna bağlanılamadı.');
  }

  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });

  let id = 1;
  const pending = new Map();
  const consoleErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const type = msg.params.type;
      const text = msg.params.args.map(a => a.value ?? a.description ?? '').join(' ');
      if (type === 'error') {
        console.error('Browser Console Error:', text);
        consoleErrors.push(text);
      }
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      const ex = msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || '');
      console.error('Browser Exception:', ex);
      consoleErrors.push(ex);
    }
  };

  function send(method, params = {}) {
    const msgId = id++;
    return new Promise((resolve) => {
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://localhost:8000/ ...');
  await send('Page.navigate', { url: 'http://localhost:8000/' });
  await wait(2500);

  console.log('Akademi -> Ses Laboratuvarı (studyo) sekmesine geçiliyor...');
  await send('Runtime.evaluate', {
    expression: `
      if (typeof window.switchAppTab === 'function') window.switchAppTab('tab-akademi');
      if (window.TilavetAkademiEngine && typeof window.TilavetAkademiEngine.switchSubView === 'function') {
        window.TilavetAkademiEngine.switchSubView('studyo');
      }
    `
  });
  await wait(1500);

  console.log('Okuma Penceresi (ReadingModal) açılıyor...');
  const modalResult = await send('Runtime.evaluate', {
    expression: `
      if (typeof window.openReadingFocusModal === 'function') {
        window.openReadingFocusModal();
        const dialog = document.getElementById('readingFocusModal');
        Boolean(dialog && dialog.open);
      } else {
        false;
      }
    `
  });
  console.log('Modal açıldı mı?:', modalResult.result.value);

  await wait(1000);

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/screenshot_ses_lab_v4_modal.png', Buffer.from(shot.result.data, 'base64'));
  console.log('Ekran görüntüsü kaydedildi: docs/screenshot_ses_lab_v4_modal.png');

  ws.close();
  proc.kill();

  if (consoleErrors.length > 0) {
    console.error(`❌ Doğrulama sırasında ${consoleErrors.length} konsol hatası oluştu!`);
    process.exit(1);
  } else {
    console.log('✅ Sıfır Konsol Hatası: Ses Laboratuvarı v4.0.0 başarıyla yüklendi ve çalışıyor!');
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
