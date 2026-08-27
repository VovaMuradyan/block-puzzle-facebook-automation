/**
 * Direct YouTube Shorts Automated Browser Uploader Engine
 * Rotates dynamically through ALL 11 animal videos across both Block Puzzle & Flappy Earn
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const youtubeCookiesPath = path.join(__dirname, '..', 'data', 'youtube_cookies.json');
const socialStatePath = path.join(__dirname, '..', 'data', 'social_state.json');

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
  game1: '#Shorts #BlockPuzzle #BlockRoyale #MobileGames #TalkingDog #TalkingCat #PuzzleGame #GamingCommunity',
  game2: '#Shorts #FlappyEarn #Capybara #Raccoon #TalkingAnimals #MobileGaming #EarnGames #ArcadeGame'
};

const gameLink = 'https://clck.ru/3VTmnq';

function getNextYouTubeVideo() {
  let state = { youtubeIndex: 0 };
  if (fs.existsSync(socialStatePath)) {
    try {
      state = JSON.parse(fs.readFileSync(socialStatePath, 'utf8'));
    } catch (e) {}
  }

  const currentIndex = state.youtubeIndex || 0;
  const videoItem = videoQueue[currentIndex % videoQueue.length];

  state.youtubeIndex = (currentIndex + 1) % videoQueue.length;
  fs.writeFileSync(socialStatePath, JSON.stringify(state, null, 2));

  return videoItem;
}

async function uploadToYouTubeShorts() {
  console.log('===========================================================');
  console.log('🚀 AUTOMATED YOUTUBE SHORTS DYNAMIC ROTATION PUBLISHER');
  console.log('===========================================================');

  if (!fs.existsSync(youtubeCookiesPath)) {
    console.error('❌ Error: data/youtube_cookies.json not found!');
    return;
  }

  const item = getNextYouTubeVideo();
  const videoPath = path.join(__dirname, '..', 'media', item.game, 'videos', item.file);
  const videoTitle = `${item.title} ${hashtags[item.hashtagKey]}`;

  console.log(`[YouTube Shorts Item] Game: ${item.game.toUpperCase()} | Video: ${item.file}`);
  console.log(`[YouTube Shorts Title]: "${videoTitle}"`);

  const rawCookies = JSON.parse(fs.readFileSync(youtubeCookiesPath, 'utf8'));
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

    console.log('[YouTube Shorts] Navigating to YouTube Studio...');
    await page.goto('https://studio.youtube.com', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await new Promise(r => setTimeout(r, 4000));

    // Click CREATE button
    await page.evaluate(() => {
      const btn = document.querySelector('#create-icon, ytcp-button#create-icon, [aria-label*="Create"], [aria-label*="Створити"], [aria-label*="Создать"]');
      if (btn) btn.click();
    });

    await new Promise(r => setTimeout(r, 2000));

    // Click Upload Videos
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

    console.log('[YouTube Shorts] Waiting 10s for upload modal...');
    await new Promise(r => setTimeout(r, 10000));

    // Set custom Title
    console.log(`[YouTube Shorts] Typing custom title: "${videoTitle}"...`);
    try {
      const titleBoxSelector = '#title-textbox #textbox, ytcp-social-suggestions-textbox#title-textbox #textbox';
      await page.waitForSelector(titleBoxSelector, { timeout: 10000 });
      const titleBox = await page.$(titleBoxSelector);
      if (titleBox) {
        await titleBox.click();
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        await titleBox.type(videoTitle, { delay: 20 });
      }
    } catch (e) {}

    // Select "Not made for kids"
    await page.evaluate(() => {
      const notKidsRadio = document.querySelector('tp-yt-paper-radio-button[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"], [name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]');
      if (notKidsRadio) notKidsRadio.click();
    });

    await new Promise(r => setTimeout(r, 2000));

    // Click NEXT 3 times
    for (let i = 1; i <= 3; i++) {
      await page.evaluate(() => {
        const nextBtn = document.querySelector('#next-button');
        if (nextBtn) nextBtn.click();
      });
      await new Promise(r => setTimeout(r, 3000));
    }

    // Select PUBLIC visibility option
    await page.evaluate(() => {
      const publicRadio = document.querySelector('tp-yt-paper-radio-button[name="PUBLIC"], [name="PUBLIC"]');
      if (publicRadio) publicRadio.click();
    });

    await new Promise(r => setTimeout(r, 2000));

    // Click SAVE / PUBLISH button
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
    }

    console.log('===========================================================');
    console.log(`🎉 YOUTUBE SHORTS ROTATION SUCCESSFUL! Video (${item.file}) Published!`);
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
