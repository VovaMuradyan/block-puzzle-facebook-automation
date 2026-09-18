const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const tiktokCookiesPath = path.join(__dirname, '..', 'data', 'tiktok_cookies.json');

async function debugTikTokPage() {
  console.log('Capturing diagnostic screenshot of TikTok upload page...');

  const rawCookies = JSON.parse(fs.readFileSync(tiktokCookiesPath, 'utf8'));
  const cookies = rawCookies.map(c => ({
    name: c.name,
    value: c.value,
    domain: c.domain.startsWith('.') ? c.domain : '.' + c.domain,
    path: c.path || '/',
    secure: c.secure !== undefined ? c.secure : true,
    httpOnly: c.httpOnly !== undefined ? c.httpOnly : false
  }));

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setCookie(...cookies);

  await page.goto('https://www.tiktok.com/tiktokstudio/upload', { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});

  const screenshotPath = path.join(__dirname, 'tiktok_debug.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot to ${screenshotPath}`);

  const currentUrl = page.url();
  console.log(`Current Page URL: ${currentUrl}`);

  await browser.close();
}

debugTikTokPage().catch(console.error);
