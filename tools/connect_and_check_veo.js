/**
 * Connect to running Veo Chrome instance and capture status screenshot
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

async function connectAndCheckStatus() {
  console.log('===========================================================');
  console.log('🔍 CONNECTING TO RUNNING CHROME VEO SESSION...');
  console.log('===========================================================');

  const screenshotPath = path.join(__dirname, '..', 'media', 'temp', 'veo_live_status.png');
  const artifactPath = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2\\veo_live_status.png';

  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: null
  });

  const pages = await browser.pages();
  const page = pages[0] || await browser.newPage();

  console.log(`[Current Page URL]: ${page.url()}`);
  console.log(`[Current Page Title]: ${await page.title()}`);

  await page.screenshot({ path: screenshotPath });
  fs.copyFileSync(screenshotPath, artifactPath);

  console.log(`🎉 Live screenshot captured to: ${artifactPath}`);
  return artifactPath;
}

if (require.main === module) {
  connectAndCheckStatus().catch(console.error);
}

module.exports = { connectAndCheckStatus };
