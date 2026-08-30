/**
 * Test & Inspect TikTok Studio Session State
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const tiktokCookiesPath = path.join(__dirname, '..', 'data', 'tiktok_cookies.json');

async function inspectTikTokStudio() {
  if (!fs.existsSync(tiktokCookiesPath)) {
    console.log('No tiktok cookies found');
    return;
  }

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

  console.log('[TikTok Test] Navigating to https://www.tiktok.com/tiktokstudio/upload...');
  await page.goto('https://www.tiktok.com/tiktokstudio/upload', { waitUntil: 'networkidle2', timeout: 60000 });

  const screenPath = path.join(__dirname, '..', 'media', 'temp', 'tiktok_studio_state.png');
  const artifactPath = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2\\tiktok_studio_state.png';
  await page.screenshot({ path: screenPath });
  fs.copyFileSync(screenPath, artifactPath);

  console.log(`[TikTok Test] Page URL: ${page.url()}`);
  console.log(`[TikTok Test] Page Title: ${await page.title()}`);
  console.log(`📸 Screenshot saved: ${artifactPath}`);

  await browser.close();
}

inspectTikTokStudio().catch(console.error);
