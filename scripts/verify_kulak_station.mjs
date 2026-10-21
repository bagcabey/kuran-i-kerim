import { spawn } from 'node:child_process';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.resolve('temp_chrome_profile_verify');

async function test() {
  const proc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${USER_DATA}`,
    'about:blank'
  ]);

  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9225/json/new', { method: 'PUT' });
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch(e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  if (!wsUrl) {
    proc.kill();
    throw new Error('Chrome WS bağlanamadı');
  }

  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  function send(method, params = {}) {
    return new Promise(res => {
      const curId = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          res(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:8000/index.html#tab-akademi' });
  await new Promise(r => setTimeout(r, 1200));

  // Switch to elifba view and kulak tab
  const evalRes = await send('Runtime.evaluate', {
    expression: `
      window.TilavetAkademiEngine.switchSubView('elifba');
      const kulakBtn = document.querySelector('.elifba-sub-pill[data-tab="kulak"]');
      if (kulakBtn) kulakBtn.click();
      
      const boxes = document.querySelectorAll('.ear-question-box');
      const firstHtml = boxes[0]?.innerHTML;
      const choicesInBox0 = Array.from(boxes[0]?.querySelectorAll('.btn-ear-choice') || []).map(b => b.outerHTML);
      ({ count: choicesInBox0.length, choices: choicesInBox0 })
    `,
    returnByValue: true
  });

  console.log('Browser Kulak Test Verification Result:', evalRes.result.value);

  await ws.close();
  proc.kill();
}
test().catch(console.error);
