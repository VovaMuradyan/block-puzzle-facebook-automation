/**
 * Inspect active Veo tab in Chrome port 9222 and find generated video / download link
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

async function checkRealVeoOutput() {
  const tempDir = path.join(__dirname, '..', 'media', 'temp');
  const artifactsDir = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2';

  try {
    const browser = await puppeteer.connect({
      browserURL: 'http://127.0.0.1:9222',
      defaultViewport: null
    });

    const pages = await browser.pages();
    const page = pages[0];

    const screenshotPath = path.join(tempDir, 'real_veo_screen.png');
    await page.screenshot({ path: screenshotPath });
    fs.copyFileSync(screenshotPath, path.join(artifactsDir, 'real_veo_screen.png'));

    console.log(`[Veo Screen URL]: ${page.url()}`);
    console.log(`🎉 Screenshot captured to: ${path.join(artifactsDir, 'real_veo_screen.png')}`);

    // Look for video elements on page
    const videoUrls = await page.evaluate(() => {
      const vids = Array.from(document.querySelectorAll('video'));
      return vids.map(v => v.src || v.querySelector('source')?.src).filter(Boolean);
    });

    console.log('Video URLs on page:', videoUrls);
  } catch (err) {
    console.error('Error connecting to Chrome:', err.message);
  }
}

checkRealVeoOutput();
