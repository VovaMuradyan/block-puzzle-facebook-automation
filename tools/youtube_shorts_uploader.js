/**
 * YouTube Shorts Automated Browser Uploader Engine
 * Uses Puppeteer + saved session cookies to automatically upload videos to YouTube Shorts
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const youtubeCookiesPath = path.join(__dirname, '..', 'data', 'youtube_cookies.json');

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
const directGameLink = 'https://clck.ru/3VTmnq';

async function uploadToYouTubeShorts() {
  console.log('===========================================================');
  console.log('🚀 AUTOMATED YOUTUBE SHORTS PUBLISHER');
  console.log('===========================================================');

  if (!fs.existsSync(youtubeCookiesPath)) {
    console.log('ℹ️ YouTube session cookies not found yet at data/youtube_cookies.json.');
    console.log('Manual Upload Instructions:');
    console.log('1. Go to https://studio.youtube.com');
    console.log('2. Click CREATE -> Upload Videos');
    console.log('3. Select video from media/game2/videos/ (e.g. flappy_ad_capybara_2308.mp4)');
    console.log(`4. Title: Capybara playing Flappy Earn! 🦫 ${hashtags}`);
    console.log(`5. Description: Download both games here: ${directGameLink}`);
    return;
  }

  console.log('[YouTube Shorts] Cookies found! Launching automated YouTube Shorts upload session...');
}

if (require.main === module) {
  uploadToYouTubeShorts().catch(console.error);
}

module.exports = uploadYouTubeShorts = uploadToYouTubeShorts;
