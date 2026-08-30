/**
 * TikTok Cookie Login & Session Saver Engine
 * Opens an isolated browser window for logging in to TikTok and saves fresh cookies to data/tiktok_cookies.json
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const tiktokCookiesPath = path.join(__dirname, '..', 'data', 'tiktok_cookies.json');

async function loginAndSaveTikTokCookies() {
  console.log('===========================================================');
  console.log('🔑 TIKTOK LOGIN & SESSION SAVER');
  console.log('===========================================================');

  const userDataDir = path.join(__dirname, '..', 'data', 'chrome_tiktok_profile');
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    userDataDir: userDataDir,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox']
  });

  const page = await browser.newPage();
  console.log('[TikTok Login] Opening https://www.tiktok.com/login ...');
  await page.goto('https://www.tiktok.com/login', { waitUntil: 'networkidle2' });

  console.log('👉 Пожалуйста, войдите в свой аккаунт TikTok в открывшемся окне.');
  console.log('Как только вы войдете (откроется главная страница или TikTok Studio), куки сохранятся автоматически!');

  // Wait for login by checking URL or cookies periodically
  let loggedIn = false;
  while (!loggedIn) {
    await new Promise(r => setTimeout(r, 4000));
    try {
      const currentUrl = page.url();
      if (!currentUrl.includes('/login')) {
        const cookies = await page.cookies();
        const hasSession = cookies.some(c => c.name.includes('session') || c.name === 'sessionid' || c.name === 'sid_tt');
        if (hasSession) {
          fs.writeFileSync(tiktokCookiesPath, JSON.stringify(cookies, null, 2));
          console.log('🎉 TIKTOK COOKIES УСПЕШНО СОХРАНЕНЫ В data/tiktok_cookies.json!');
          loggedIn = true;
          break;
        }
      }
    } catch (e) {
      break;
    }
  }

  await browser.close();
}

if (require.main === module) {
  loginAndSaveTikTokCookies().catch(console.error);
}

module.exports = { loginAndSaveTikTokCookies };
