/**
 * Capture Google AI Studio Veo Screen After Video Generation
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function captureVeoOutputScreen() {
  console.log('===========================================================');
  console.log('📸 CAPTURING GOOGLE AI STUDIO VEO GENERATED VIDEO SCREEN');
  console.log('===========================================================');

  const userDataDir = path.join(__dirname, '..', 'data', 'chrome_veo_profile');
  const tempDir = path.join(__dirname, '..', 'media', 'temp');
  const artifactsDir = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2';

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    userDataDir: userDataDir,
    defaultViewport: { width: 1280, height: 900 },
    args: ['--start-maximized', '--no-sandbox']
  });

  const page = await browser.newPage();
  console.log('[Veo Screen] Navigating to https://aistudio.google.com/models/veo...');
  await page.goto('https://aistudio.google.com/models/veo', { waitUntil: 'networkidle2' });

  await new Promise(r => setTimeout(r, 4000));

  const screenshotPath = path.join(tempDir, 'veo_generated_video_screen.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  fs.copyFileSync(screenshotPath, path.join(artifactsDir, 'veo_generated_video_screen.png'));

  console.log(`🎉 Screen captured: ${path.join(artifactsDir, 'veo_generated_video_screen.png')}`);

  // Find video elements or download links
  const mediaInfo = await page.evaluate(() => {
    const vids = Array.from(document.querySelectorAll('video')).map(v => v.src || v.querySelector('source')?.src);
    const links = Array.from(document.querySelectorAll('a[download], button')).map(b => b.innerText || b.getAttribute('aria-label'));
    return { vids, links };
  });

  console.log('Media Info:', mediaInfo);
}

captureVeoOutputScreen().catch(console.error);
