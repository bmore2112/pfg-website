import { chromium } from 'playwright-core';
const exe = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-x64/chrome-headless-shell';
const b = await chromium.launch({ executablePath: exe });
const grab = async (path, file, y=0) => { const p = await b.newPage({ viewport:{width:1440,height:900} }); await p.goto('http://localhost:5173'+path,{waitUntil:'load'}); await p.waitForTimeout(1200); if(y)await p.evaluate(v=>window.scrollTo(0,v),y); await p.waitForTimeout(500); await p.screenshot({path:file}); await p.close(); };
await grab('/', 'shot-ofstrip.png', 720);
await grab('/', 'shot-footer.png', 99999);
await grab('/services', 'shot-services.png');
await b.close(); console.log('done');
