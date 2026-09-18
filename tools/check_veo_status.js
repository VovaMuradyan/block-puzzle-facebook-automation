/**
 * Check Google AI Studio Veo Browser State & Take Screenshot
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function checkVeoLoginStatus() {
  console.log('===========================================================');
  console.log('🔍 CHECKING GOOGLE AI STUDIO VEO LOGIN STATUS...');
  console.log('===========================================================');

  const userDataDir = path.join(__dirname, '..', 'data', 'chrome_veo_profile');
  const screenshotPath = path.join(__dirname, '..', 'media', 'temp', 'veo_login_status.png');
  const artifactPath = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2\\veo_login_status.png';

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    userDataDir: userDataDir,
    defaultViewport: { width: 1280, height: 800 },
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  console.log('[Puppeteer] Opening https://aistudio.google.com/models/veo...');
  await page.goto('https://aistudio.google.com/models/veo', { waitUntil: 'networkidle2', timeout: 30000 });

  await page.screenshot({ path: screenshotPath, fullPage: false });
  fs.copyFileSync(screenshotPath, artifactPath);

  const title = await page.title();
  const url = page.url();

  console.log(`[Page Title]: ${title}`);
  console.log(`[Current URL]: ${url}`);

  await browser.close();

  console.log(`🎉 Screenshot saved to: ${artifactPath}`);
  return artifactPath;
}

if (require.main === module) {
  checkVeoLoginStatus().catch(console.error);
}

module.exports = { checkVeoLoginStatus };
