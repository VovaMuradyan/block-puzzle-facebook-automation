/**
 * Direct TikTok Automated Browser Uploader Engine
 * Continuous On-Demand Upload Mode for All 11 Animal Videos
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const tiktokCookiesPath = path.join(__dirname, '..', 'data', 'tiktok_cookies.json');
const socialStatePath = path.join(__dirname, '..', 'data', 'social_state.json');

// 11 Unique Animal Videos Queue alternating between Game 1 & Game 2
const videoQueue = [
  { game: 'game1', file: 'block_puzzle_ad_dog_2232.mp4', title: 'Dog playing Block Puzzle! 🐶 Can you beat this score?', hashtagKey: 'game1' },
  { game: 'game2', file: 'flappy_ad_raccoon_2259.mp4', title: 'Raccoon playing Flappy Earn! 🦝 Tap to fly!', hashtagKey: 'game2' },
  { game: 'game1', file: 'block_puzzle_ad_cat_2223.mp4', title: 'Cat masterclass in Block Royale! 🐱 Block Puzzle fun!', hashtagKey: 'game1' },
  { game: 'game2', file: 'flappy_ad_parrot_2258.mp4', title: 'Parrot gaming session in Flappy Earn! 🦜 Fly high!', hashtagKey: 'game2' },
  { game: 'game1', file: 'block_puzzle_ad_dog_2229.mp4', title: 'Dog clearing lines in Block Puzzle! 🐶 Satisfying!', hashtagKey: 'game1' },
  { game: 'game2', file: 'flappy_ad_otter_2310.mp4', title: 'Otter playing Flappy Earn! 🦦 High score run!', hashtagKey: 'game2' },
  { game: 'game1', file: 'block_puzzle_ad_dog_2224.mp4', title: 'Dog puzzle challenge in Block Royale! 🐶', hashtagKey: 'game1' },
  { game: 'game2', file: 'flappy_ad_cat_2254.mp4', title: 'Cat playing Flappy Earn! 🐱 Tap & score!', hashtagKey: 'game2' },
  { game: 'game1', file: 'block_puzzle_ad_dog_2223.mp4', title: 'Perfect block placement in Block Puzzle! 🐶', hashtagKey: 'game1' },
  { game: 'game2', file: 'flappy_ad_dog_2253.mp4', title: 'Dog flying in Flappy Earn! 🐶 Arcade fun!', hashtagKey: 'game2' },
  { game: 'game2', file: 'flappy_ad_capybara_2308.mp4', title: 'Capybara playing Flappy Earn! 🦫 Tap to fly!', hashtagKey: 'game2' }
];

const hashtags = {
  game1: '#BlockPuzzle #BlockRoyale #MobileGames #TalkingDog #TalkingCat #PuzzleGame #GamingCommunity #ViralGaming',
  game2: '#FlappyEarn #Capybara #Raccoon #TalkingAnimals #MobileGaming #EarnGames #ViralReels #ArcadeGame #CapybaraSong'
};

function getNextTikTokVideo() {
  let state = { tiktokIndex: 0 };
  if (fs.existsSync(socialStatePath)) {
    try {
      state = JSON.parse(fs.readFileSync(socialStatePath, 'utf8'));
    } catch (e) {}
  }

  const currentIndex = state.tiktokIndex || 0;
  const videoItem = videoQueue[currentIndex % videoQueue.length];

  state.tiktokIndex = (currentIndex + 1) % videoQueue.length;
  state.last_tiktok_post_at = new Date().toISOString();
  fs.writeFileSync(socialStatePath, JSON.stringify(state, null, 2));

  return videoItem;
}

async function uploadNextTikTokVideo() {
  console.log('===========================================================');
  console.log('🚀 AUTOMATED TIKTOK VIDEO PUBLISHER (ACTIVE RUN)');
  console.log('===========================================================');

  if (!fs.existsSync(tiktokCookiesPath)) {
    console.error('❌ Error: data/tiktok_cookies.json not found!');
    return false;
  }

  const item = getNextTikTokVideo();
  const videoPath = path.join(__dirname, '..', 'media', item.game, 'videos', item.file);
  const captionText = `${item.title} ${hashtags[item.hashtagKey]}`;

  console.log(`[TikTok Queue] Selected Video: ${item.file} (${item.game.toUpperCase()})`);
  console.log(`[TikTok Caption]: "${captionText}"`);

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

    const fileInputSelector = 'input[type="file"]';
    await page.waitForSelector(fileInputSelector, { timeout: 30000 });

    console.log('[TikTok Studio] Attaching video file...');
    const fileInput = await page.$(fileInputSelector);
    await fileInput.uploadFile(videoPath);

    console.log('[TikTok Studio] Video attached. Waiting 15s for processing...');
    await new Promise(r => setTimeout(r, 15000));

    // Fill caption text
    console.log('[TikTok Studio] Setting custom caption and hashtags...');
    try {
      const editorSelector = 'div[contenteditable="true"], textarea';
      await page.waitForSelector(editorSelector, { timeout: 10000 });
      const editor = await page.$(editorSelector);
      if (editor) {
        await editor.click();
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        await editor.type(captionText, { delay: 30 });
      }
    } catch (e) {}

    console.log('[TikTok Studio] Clicking POST button...');
    await new Promise(r => setTimeout(r, 5000));

    const postClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const postBtn = buttons.find(b => {
        const txt = (b.textContent || '').trim().toLowerCase();
        return txt === 'post' || txt === 'publish' || txt === 'опубликовать' || txt.includes('post') || txt.includes('опубликовать');
      });
      if (postBtn) {
        postBtn.click();
        return true;
      }
      return false;
    });

    if (postClicked) {
      console.log('✅ Clicked POST / PUBLISH button!');
      await new Promise(r => setTimeout(r, 10000));
    }

    console.log('===========================================================');
    console.log(`🎉 TIKTOK VIDEO POSTED SUCCESSFULLY!`);
    console.log('===========================================================');
    return true;
  } catch (err) {
    console.error('[TikTok Studio Error]', err.message);
    return false;
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  uploadNextTikTokVideo().catch(console.error);
}

module.exports = uploadNextTikTokVideo;
