import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.resolve('temp_chrome_profile');

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('Launching headless Chrome...');
  const proc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${USER_DATA}`,
    'about:blank'
  ]);

  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9222/json/new', { method: 'PUT' });
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch (e) {
      await wait(300);
    }
  }

  if (!wsUrl) {
    proc.kill();
    throw new Error('Could not connect to Chrome debugging port.');
  }

  console.log('Connecting to CDP via WebSocket...');
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });

  let id = 1;
  const pending = new Map();
  const consoleErrors = [];
  const consoleWarns = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const type = msg.params.type;
      const text = msg.params.args.map(a => a.value ?? a.description ?? '').join(' ');
      if (type === 'error') consoleErrors.push(text);
      if (type === 'warning') consoleWarns.push(text);
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || ''));
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

  // 1. Desktop 1280x800
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://localhost:8000/ ...');
  await send('Page.navigate', { url: 'http://localhost:8000/' });
  await wait(2000);

  console.log('Switching to Makam Okulu tab...');
  await send('Runtime.evaluate', {
    expression: `
      if (typeof window.switchAppTab === 'function') window.switchAppTab('tab-akademi');
      if (window.TilavetAkademiEngine && typeof window.TilavetAkademiEngine.switchSubView === 'function') {
        window.TilavetAkademiEngine.switchSubView('makam');
      }
    `
  });
  await wait(1500);

  console.log('Capturing desktop screenshot (1280px)...');
  const desktopShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/makam_okulu/baseline/desktop-1280.png', Buffer.from(desktopShot.result.data, 'base64'));

  // 2. Mobile 390x844
  console.log('Setting mobile viewport (390px)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await wait(1000);

  console.log('Capturing mobile screenshot (390px)...');
  const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/makam_okulu/baseline/mobile-390.png', Buffer.from(mobileShot.result.data, 'base64'));

  ws.close();
  proc.kill();
  try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch {}

  console.log('Baseline capture complete!');
  console.log(`Console Errors count: ${consoleErrors.length}`);
  if (consoleErrors.length) console.log('Errors:', consoleErrors);
  console.log(`Console Warnings count: ${consoleWarns.length}`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
