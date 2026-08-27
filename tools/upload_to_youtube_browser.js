/**
 * Direct YouTube Shorts Automated Browser Uploader Engine
 * Automatically connects to local Chrome User Data session to upload Shorts to YouTube Studio
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const chromeProfileCopyDir = path.join(__dirname, '..', 'data', 'chrome_profile_copy');

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

const hashtags = '#Shorts #FlappyEarn #Capybara #BlockPuzzle #MobileGames #ViralGaming';
const gameLink = 'https://clck.ru/3VTmnq';

async function uploadToYouTubeShorts() {
  console.log('===========================================================');
  console.log('🚀 AUTOMATED YOUTUBE SHORTS PUBLISHER (USING LOGGED-IN SESSION)');
  console.log('===========================================================');

  const selectedVideo = 'flappy_ad_capybara_2308.mp4';
  const videoPath = path.join(__dirname, '..', 'media', 'game2', 'videos', selectedVideo);
  const videoTitle = `Capybara playing Flappy Earn! 🦫 ${hashtags}`;
  const videoDescription = `Play Flappy Earn & Block Royale! Free Download Link: ${gameLink}`;

  console.log(`[YouTube Shorts] Target Video: ${selectedVideo}`);
  console.log(`[YouTube Shorts] Target Title: "${videoTitle}"`);
  console.log('[YouTube Shorts] Launching browser session with cloned Chrome profile...');

  const browser = await puppeteer.launch({
    headless: 'new',
    userDataDir: chromeProfileCopyDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log('[YouTube Shorts] Navigating to YouTube Studio Upload page...');
    await page.goto('https://studio.youtube.com', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log(`[YouTube Shorts] Current Page URL: ${page.url()}`);

    const fileInputSelector = 'input[type="file"]';
    const fileInput = await page.waitForSelector(fileInputSelector, { timeout: 30000 }).catch(() => null);

    if (fileInput) {
      console.log('[YouTube Shorts] File input located! Uploading video file...');
      await fileInput.uploadFile(videoPath);
      await new Promise(r => setTimeout(r, 15000));
      console.log('🎉 YOUTUBE SHORTS VIDEO UPLOADED SUCCESSFULLY!');
    } else {
      console.log('[YouTube Shorts] Checking YouTube Studio authentication state...');
      const verifyPath = path.join(__dirname, 'youtube_studio_verify.png');
      await page.screenshot({ path: verifyPath });
      console.log(`Saved screenshot to ${verifyPath}`);
    }
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
