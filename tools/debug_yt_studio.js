/**
 * Debug YouTube Studio Page Load & Selectors
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const youtubeCookiesPath = path.join(__dirname, '..', 'data', 'youtube_cookies.json');

async function debugYouTubeStudio() {
  if (!fs.existsSync(youtubeCookiesPath)) return;
  const cookies = JSON.parse(fs.readFileSync(youtubeCookiesPath, 'utf8'));

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--start-maximized', '--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setCookie(...cookies);

  console.log('[YouTube Debug] Opening studio.youtube.com...');
  await page.goto('https://studio.youtube.com', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 5000));

  const screenshotPath = path.join(__dirname, '..', 'media', 'temp', 'yt_studio_debug.png');
  const artifactPath = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2\\yt_studio_debug.png';
  await page.screenshot({ path: screenshotPath });
  fs.copyFileSync(screenshotPath, artifactPath);

  console.log(`[YouTube Debug] Page Title: ${await page.title()}`);
  console.log(`[YouTube Debug] Current URL: ${page.url()}`);
  console.log(`[YouTube Debug] Screenshot: ${artifactPath}`);

  await browser.close();
}

debugYouTubeStudio().catch(console.error);
