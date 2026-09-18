/**
 * YouTube Studio Cookie Login & Session Saver Engine
 * Launches Chrome in visible mode for 1-click Google login and saves fresh cookies to data/youtube_cookies.json
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const youtubeCookiesPath = path.join(__dirname, '..', 'data', 'youtube_cookies.json');

async function loginAndSaveYouTubeCookies() {
  console.log('===========================================================');
  console.log('🔑 YOUTUBE STUDIO SESSION & COOKIE SAVER');
  console.log('===========================================================');

  const userDataDir = path.join(__dirname, '..', 'data', 'chrome_yt_profile');
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    userDataDir: userDataDir,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox']
  });

  const page = await browser.newPage();
  console.log('[YouTube Studio] Opening https://studio.youtube.com...');
  await page.goto('https://studio.youtube.com', { waitUntil: 'networkidle2' });

  // Save fresh cookies automatically
  const cookies = await page.cookies();
  fs.writeFileSync(youtubeCookiesPath, JSON.stringify(cookies, null, 2));
  console.log('🎉 YouTube Cookies saved to data/youtube_cookies.json!');
}

if (require.main === module) {
  loginAndSaveYouTubeCookies().catch(console.error);
}

module.exports = { loginAndSaveYouTubeCookies };
