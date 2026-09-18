/**
 * Launch & Keep Chrome Open on Google AI Studio Veo 3.1 24/7
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function keepChromeOpen() {
  console.log('===========================================================');
  console.log('🌐 LAUNCHING CHROME IN PERMANENT OPEN VISIBLE MODE');
  console.log('===========================================================');

  const userDataDir = path.join(__dirname, '..', 'data', 'chrome_veo_profile');
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    userDataDir: userDataDir,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox']
  });

  const page = await browser.newPage();
  console.log('[Puppeteer] Opening https://aistudio.google.com/models/veo...');
  await page.goto('https://aistudio.google.com/models/veo', { waitUntil: 'networkidle2' });

  console.log('✅ Chrome is now open and will stay open 24/7!');
}

if (require.main === module) {
  keepChromeOpen().catch(console.error);
}

module.exports = { keepChromeOpen };
