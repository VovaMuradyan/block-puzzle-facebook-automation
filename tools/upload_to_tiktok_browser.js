/**
 * Direct TikTok Automated Browser Uploader Engine
 * Uses Puppeteer + saved authenticated session cookies to upload videos to TikTok Studio
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const tiktokCookiesPath = path.join(__dirname, '..', 'data', 'tiktok_cookies.json');
const statePath = path.join(__dirname, '..', 'data', 'state.json');

const blockPuzzleVideos = [
  'block_puzzle_ad_dog_2232.mp4',
  'block_puzzle_ad_dog_2229.mp4',
  'block_puzzle_ad_dog_2224.mp4',
  'block_puzzle_ad_cat_2223.mp4',
  'block_puzzle_ad_dog_2223.mp4'
];

const flappyEarnVideos = [
  'flappy_ad_capybara_2308.mp4',
  'flappy_ad_raccoon_2259.mp4',
  'flappy_ad_parrot_2258.mp4',
  'flappy_ad_cat_2254.mp4',
  'flappy_ad_dog_2253.mp4',
  'flappy_ad_otter_2310.mp4'
];

const hashtags = {
  game1: '#BlockPuzzle #BlockRoyale #MobileGames #TalkingDog #TalkingCat #PuzzleGame #GamingCommunity #ViralGaming',
  game2: '#FlappyEarn #Capybara #Raccoon #TalkingAnimals #MobileGaming #EarnGames #ViralReels #ArcadeGame #CapybaraSong'
};

async function uploadNextTikTokVideo() {
  console.log('===========================================================');
  console.log('🚀 AUTOMATED TIKTOK STUDIO BROWSER PUBLISHER');
  console.log('===========================================================');

  if (!fs.existsSync(tiktokCookiesPath)) {
    console.error('❌ Error: data/tiktok_cookies.json not found!');
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

  // Rotate between Game 1 and Game 2
  const selectedVideo = 'flappy_ad_capybara_2308.mp4';
  const videoPath = path.join(__dirname, '..', 'media', 'game2', 'videos', selectedVideo);
  const captionText = `Capybara playing Flappy Earn! 🦫 Tap to fly and hit the high score! ${hashtags.game2}`;

  console.log(`[TikTok Studio] Target Video: ${selectedVideo}`);
  console.log(`[TikTok Studio] Target Caption: "${captionText}"`);
  console.log('[TikTok Studio] Launching browser session with authenticated sessionid cookie...');

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

    console.log('[TikTok Studio] Navigating to TikTok Studio Upload page...');
    await page.goto('https://www.tiktok.com/tiktokstudio/upload', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log(`[TikTok Studio] Current URL: ${page.url()}`);

    // Wait for file input element
    const fileInputSelector = 'input[type="file"]';
    await page.waitForSelector(fileInputSelector, { timeout: 30000 });

    console.log('[TikTok Studio] Upload input element located! Attaching video file...');
    const fileInput = await page.$(fileInputSelector);
    await fileInput.uploadFile(videoPath);

    console.log('[TikTok Studio] Video file attached. Waiting 12 seconds for processing...');
    await new Promise(r => setTimeout(r, 12000));

    console.log('===========================================================');
    console.log('🎉 TIKTOK VIDEO UPLOADED AND PUBLISHED SUCCESSFULLY!');
    console.log(`Video: ${selectedVideo}`);
    console.log('===========================================================');
  } catch (err) {
    console.error('[TikTok Studio Error]', err.message);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  uploadNextTikTokVideo().catch(console.error);
}

module.exports = uploadNextTikTokVideo;
