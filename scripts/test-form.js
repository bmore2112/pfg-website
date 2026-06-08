import { chromium } from 'playwright-core';
const exe = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-x64/chrome-headless-shell';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5173/', { waitUntil: 'load' });
await page.waitForTimeout(800);
// jump to apply
await page.evaluate(() => document.querySelector('#apply').scrollIntoView());
await page.waitForTimeout(600);
const successVisibleBefore = await page.locator('#formSuccess').isVisible();
await page.screenshot({ path: 'shot-apply.png' });
// test coaching toggle
await page.click('.seg__btn[data-goal="coaching"]');
const coachingShown = await page.locator('.form__coaching').isVisible();
const creatorHidden = !(await page.locator('.form__creator').isVisible());
// back to creator, fill + submit
await page.click('.seg__btn[data-goal="creator"]');
await page.fill('input[name="name"]','Test Creator');
await page.fill('input[name="email"]','test@example.com');
await page.check('input[name="age"]');
await page.click('#applyForm button[type="submit"]');
await page.waitForTimeout(700);
const successVisibleAfter = await page.locator('#formSuccess').isVisible();
await page.screenshot({ path: 'shot-form-success.png' });
console.log(JSON.stringify({ successVisibleBefore, coachingShown, creatorHidden, successVisibleAfter }));
await browser.close();
