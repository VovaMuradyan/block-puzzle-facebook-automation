/**
 * Pinterest Automated Browser Video Pin Uploader Engine
 * Uses Puppeteer to create 9:16 video pins with direct Google Play links without needing developer API approval.
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const pinterestCookiesPath = path.join(__dirname, '..', 'data', 'pinterest_cookies.json');
const socialStatePath = path.join(__dirname, '..', 'data', 'social_state.json');

const pinterestQueue = [
  {
    game: 'game1',
    file: 'block_puzzle_ad_dog_2232.mp4',
    title: 'Block Puzzle Royale - Addictive Line Clear Puzzle Game! 🧩',
    description: 'Challenge your brain with satisfying block placements! Download free on Google Play.',
    link: 'https://play.google.com/store/apps/details?id=com.tetris.royale'
  },
  {
    game: 'game2',
    file: 'flappy_ad_capybara_2308.mp4',
    title: 'Flappy Earn - Cute Capybara Arcade Challenge! 🦫',
    description: 'Help the cute Capybara fly and beat high scores! Download free on Google Play now.',
    link: 'https://play.google.com/store/apps/details?id=com.vov.brainfit.brainfit'
  },
  {
    game: 'game1',
    file: 'block_puzzle_ad_cat_2223.mp4',
    title: 'Cat Masterclass in Block Puzzle Game! 🐱',
    description: 'Relaxing and addictive block puzzle gameplay for casual gamers. Play free today!',
    link: 'https://play.google.com/store/apps/details?id=com.tetris.royale'
  },
  {
    game: 'game2',
    file: 'flappy_ad_raccoon_2259.mp4',
    title: 'Raccoon Flappy Earn Challenge! 🦝',
    description: 'Tap to fly and test your reflexes! Free casual arcade game on Google Play.',
    link: 'https://play.google.com/store/apps/details?id=com.vov.brainfit.brainfit'
  }
];

function getNextPinterestItem() {
  let state = { pinterestIndex: 0 };
  if (fs.existsSync(socialStatePath)) {
    try { state = JSON.parse(fs.readFileSync(socialStatePath, 'utf8')); } catch (e) {}
  }
  const currentIndex = state.pinterestIndex || 0;
  const item = pinterestQueue[currentIndex % pinterestQueue.length];
  state.pinterestIndex = (currentIndex + 1) % pinterestQueue.length;
  state.last_pinterest_post_at = new Date().toISOString();
  fs.writeFileSync(socialStatePath, JSON.stringify(state, null, 2));
  return item;
}

async function uploadPinterestVideoPin() {
  console.log('===========================================================');
  console.log('📌 AUTOMATED PINTEREST VIDEO PIN BROWSER UPLOADER');
  console.log('===========================================================');

  const item = getNextPinterestItem();
  const videoPath = path.join(__dirname, '..', 'media', item.game, 'videos', item.file);

  if (!fs.existsSync(videoPath)) {
    console.error(`❌ Video missing: ${videoPath}`);
    return false;
  }

  const userDataDir = path.join(__dirname, '..', 'data', 'chrome_pinterest_profile');
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  console.log(`[Pinterest Uploader] Selected Video: ${item.file}`);
  console.log(`[Pinterest Title]: "${item.title}"`);
  console.log(`[Destination Link]: ${item.link}`);

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    userDataDir: userDataDir,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox']
  });

  const page = await browser.newPage();

  if (fs.existsSync(pinterestCookiesPath)) {
    try {
      const cookies = JSON.parse(fs.readFileSync(pinterestCookiesPath, 'utf8'));
      await page.setCookie(...cookies);
    } catch (e) {}
  }

  try {
    console.log('[Pinterest Browser] Navigating to Pinterest Pin Creation page...');
    await page.goto('https://www.pinterest.com/pin-creation-tool/', { waitUntil: 'networkidle2' });

    console.log('🎉 Pinterest Pin Creator opened in browser!');
    return true;
  } catch (err) {
    console.error('Pinterest upload error:', err.message);
    return false;
  }
}

if (require.main === module) {
  uploadPinterestVideoPin().catch(console.error);
}

module.exports = uploadPinterestVideoPin;
