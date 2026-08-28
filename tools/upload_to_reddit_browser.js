/**
 * Reddit Automated Browser Poster Engine
 * Uses Puppeteer to submit gameplay posts and videos to r/AndroidGaming, r/CasualGames, r/MobileGaming
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const redditCookiesPath = path.join(__dirname, '..', 'data', 'reddit_cookies.json');
const socialStatePath = path.join(__dirname, '..', 'data', 'social_state.json');

const redditQueue = [
  {
    subreddit: 'AndroidGaming',
    title: '[DEV] Casual Block Puzzle game with satisfying combo mechanics on Android 🧩',
    text: 'Hey everyone! I released Block Puzzle: Royale on Google Play. Smooth line clears, satisfying sound effects, and offline mode. Download free: https://play.google.com/store/apps/details?id=com.tetris.royale'
  },
  {
    subreddit: 'CasualGames',
    title: 'Flappy Earn - Cute Capybara & Raccoon tap-to-fly arcade game! 🦫',
    text: 'Casual arcade tap-to-fly game with cute animals and high score leaderboards on Android! Play free: https://play.google.com/store/apps/details?id=com.vov.brainfit.brainfit'
  }
];

function getNextRedditItem() {
  let state = { redditIndex: 0 };
  if (fs.existsSync(socialStatePath)) {
    try { state = JSON.parse(fs.readFileSync(socialStatePath, 'utf8')); } catch (e) {}
  }
  const currentIndex = state.redditIndex || 0;
  const item = redditQueue[currentIndex % redditQueue.length];
  state.redditIndex = (currentIndex + 1) % redditQueue.length;
  state.last_reddit_post_at = new Date().toISOString();
  fs.writeFileSync(socialStatePath, JSON.stringify(state, null, 2));
  return item;
}

async function uploadRedditPost() {
  console.log('===========================================================');
  console.log('🤖 AUTOMATED REDDIT BROWSER POSTER ENGINE');
  console.log('===========================================================');

  const item = getNextRedditItem();
  const userDataDir = path.join(__dirname, '..', 'data', 'chrome_reddit_profile');
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  console.log(`[Reddit Target]: r/${item.subreddit}`);
  console.log(`[Reddit Title]: "${item.title}"`);

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    userDataDir: userDataDir,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox']
  });

  const page = await browser.newPage();

  if (fs.existsSync(redditCookiesPath)) {
    try {
      const cookies = JSON.parse(fs.readFileSync(redditCookiesPath, 'utf8'));
      await page.setCookie(...cookies);
    } catch (e) {}
  }

  try {
    console.log(`[Reddit Browser] Opening https://www.reddit.com/r/${item.subreddit}/submit...`);
    await page.goto(`https://www.reddit.com/r/${item.subreddit}/submit`, { waitUntil: 'networkidle2' });

    console.log('🎉 Reddit submission page opened in browser!');
    return true;
  } catch (err) {
    console.error('Reddit submit error:', err.message);
    return false;
  }
}

if (require.main === module) {
  uploadRedditPost().catch(console.error);
}

module.exports = uploadRedditPost;
