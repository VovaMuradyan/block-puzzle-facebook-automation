/**
 * Continuous Veo 3.1 Studio Engine via Puppeteer Direct
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function checkVeoRenderingProgress() {
  console.log('===========================================================');
  console.log('⏳ CHECKING VEO 3.1 RENDERING PROGRESS (EVERY 15 SECONDS)');
  console.log('===========================================================');

  const userDataDir = path.join(__dirname, '..', 'data', 'chrome_veo_profile');
  const tempDir = path.join(__dirname, '..', 'media', 'temp');
  const artifactsDir = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2';

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    userDataDir: userDataDir,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox']
  });

  const pages = await browser.pages();
  const page = pages[0] || await browser.newPage();

  const screenshotPath = path.join(tempDir, 'veo_render_live_check.png');
  await page.screenshot({ path: screenshotPath });
  fs.copyFileSync(screenshotPath, path.join(artifactsDir, 'veo_render_live_check.png'));
  console.log(`📸 Render screenshot updated: ${path.join(artifactsDir, 'veo_render_live_check.png')}`);

  await browser.close();
}

checkVeoRenderingProgress().catch(console.error);
