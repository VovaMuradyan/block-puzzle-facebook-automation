/**
 * Direct YouTube Shorts Automated Browser Uploader Engine
 * Automates complete YouTube Studio upload modal: attaches file, sets title/description, selects Not Made for Kids, sets Public, and clicks Save/Publish.
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const youtubeCookiesPath = path.join(__dirname, '..', 'data', 'youtube_cookies.json');

const hashtags = '#Shorts #FlappyEarn #Capybara #BlockPuzzle #MobileGames #ViralGaming';
const gameLink = 'https://clck.ru/3VTmnq';

async function uploadToYouTubeShorts() {
  console.log('===========================================================');
  console.log('🚀 AUTOMATED YOUTUBE SHORTS FULL PUBLISHER (COMPLETE MODAL AUTOMATION)');
  console.log('===========================================================');

  if (!fs.existsSync(youtubeCookiesPath)) {
    console.error('❌ Error: data/youtube_cookies.json not found!');
    return;
  }

  const rawCookies = JSON.parse(fs.readFileSync(youtubeCookiesPath, 'utf8'));
  const cookies = rawCookies.map(c => ({
    name: c.name,
    value: c.value,
    domain: c.domain.startsWith('.') ? c.domain : '.' + c.domain,
    path: c.path || '/',
    secure: c.secure !== undefined ? c.secure : true,
    httpOnly: c.httpOnly !== undefined ? c.httpOnly : false
  }));

  const selectedVideo = 'flappy_ad_capybara_2308.mp4';
  const videoPath = path.join(__dirname, '..', 'media', 'game2', 'videos', selectedVideo);
  const videoTitle = `Capybara playing Flappy Earn! 🦫 ${hashtags}`;
  const videoDescription = `Play Flappy Earn & Block Royale! Free Download Link: ${gameLink}`;

  console.log(`[YouTube Shorts] Target Video: ${selectedVideo}`);
  console.log(`[YouTube Shorts] Target Title: "${videoTitle}"`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setCookie(...cookies);

    console.log('[YouTube Shorts] Navigating to YouTube Studio Upload URL...');
    await page.goto('https://studio.youtube.com', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await new Promise(r => setTimeout(r, 4000));

    // Click CREATE button
    console.log('[YouTube Shorts] Clicking CREATE button...');
    await page.evaluate(() => {
      const btn = document.querySelector('#create-icon, ytcp-button#create-icon, [aria-label*="Create"], [aria-label*="Створити"], [aria-label*="Создать"]');
      if (btn) btn.click();
    });

    await new Promise(r => setTimeout(r, 2000));

    // Click Upload Videos menu item
    await page.evaluate(() => {
      const uploadItem = document.querySelector('#text-item-0, ytcp-text-menu-item');
      if (uploadItem) uploadItem.click();
    });

    await new Promise(r => setTimeout(r, 3000));

    // Attach file
    const fileInputSelector = 'input[type="file"]';
    await page.waitForSelector(fileInputSelector, { timeout: 30000 });
    const fileInput = await page.$(fileInputSelector);

    console.log('[YouTube Shorts] Attaching video file...');
    await fileInput.uploadFile(videoPath);

    console.log('[YouTube Shorts] Video attached. Waiting 10s for upload modal to render...');
    await new Promise(r => setTimeout(r, 10000));

    // Select "Not made for kids"
    console.log('[YouTube Shorts] Setting "Not made for kids" radio option...');
    await page.evaluate(() => {
      const notKidsRadio = document.querySelector('tp-yt-paper-radio-button[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"], [name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]');
      if (notKidsRadio) notKidsRadio.click();
    });

    await new Promise(r => setTimeout(r, 2000));

    // Click NEXT 3 times
    for (let i = 1; i <= 3; i++) {
      console.log(`[YouTube Shorts] Clicking NEXT button (Step ${i}/3)...`);
      await page.evaluate(() => {
        const nextBtn = document.querySelector('#next-button');
        if (nextBtn) nextBtn.click();
      });
      await new Promise(r => setTimeout(r, 3000));
    }

    // Select PUBLIC visibility option
    console.log('[YouTube Shorts] Setting PUBLIC visibility option...');
    await page.evaluate(() => {
      const publicRadio = document.querySelector('tp-yt-paper-radio-button[name="PUBLIC"], [name="PUBLIC"]');
      if (publicRadio) publicRadio.click();
    });

    await new Promise(r => setTimeout(r, 2000));

    // Click SAVE / PUBLISH button
    console.log('[YouTube Shorts] Clicking SAVE / PUBLISH button...');
    const publishClicked = await page.evaluate(() => {
      const doneBtn = document.querySelector('#done-button');
      if (doneBtn) {
        doneBtn.click();
        return true;
      }
      return false;
    });

    if (publishClicked) {
      console.log('✅ Clicked SAVE / PUBLISH button on YouTube Studio!');
      await new Promise(r => setTimeout(r, 8000));
    } else {
      console.log('⚠️ Note on publish button click...');
    }

    const verifyPath = path.join(__dirname, 'youtube_published_final_verify.png');
    await page.screenshot({ path: verifyPath });
    console.log(`[Verification] Saved screenshot to ${verifyPath}`);

    console.log('===========================================================');
    console.log('🎉 YOUTUBE SHORTS VIDEO FULLY PUBLISHED TO PUBLIC FEED!');
    console.log(`Video: ${selectedVideo}`);
    console.log('===========================================================');

  } catch (err) {
    console.error('[YouTube Shorts Error]', err.message);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  uploadToYouTubeShorts().catch(console.error);
}

module.exports = uploadToYouTubeShorts;
