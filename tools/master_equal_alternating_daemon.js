/**
 * 24/7 High-Volume 1:1 Evenly Alternating Master Daemon (Day 2 1-Click Redirect Link Cards)
 * - YouTube Posts: 100% Clickable Link Card (Clicking image instantly opens YouTube https://youtu.be/u6O5FnfPezY)
 * - Game Posts: Original 11 3D Video Files
 * - Alternating 1:1 across ALL 51 Pages from ALL 3 Meta Accounts!
 */
const fs = require('fs');
const path = require('path');
const { getAllPagesGrouped, publishVideoPost, sleep } = require('../src/facebook');
const uploadNextTikTokVideo = require('./upload_to_tiktok_browser');
const uploadToYouTubeShorts = require('./upload_to_youtube_browser');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of envLines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const stateFilePath = path.join(__dirname, '..', 'data', 'equal_alternating_state.json');

function loadState() {
  if (fs.existsSync(stateFilePath)) {
    try { return JSON.parse(fs.readFileSync(stateFilePath, 'utf8')); } catch (e) {}
  }
  return { runCount: 0, totalYoutubePosts: 0, totalGamePosts: 0 };
}

function saveState(state) {
  fs.writeFileSync(stateFilePath, JSON.stringify(state, null, 2));
}

const room13Day2Caption = `🎬 Tap the image to watch Day 2 gameplay on YouTube! 👇

🎮 Room13 is an indie third-person horror game set in a mysterious old hotel.

In this video, I’m showing early gameplay, movement, camera, doors, rooms, and the atmosphere of the Room13 hotel.

The game is still in development, so you may see work-in-progress features and improvements.

Want to support Room13 or discuss possible investment / revenue-share participation?
You can find the interest form link in my channel profile or in the pinned comment.

Important: this is only an expression of interest. No profit or revenue is guaranteed. Any participation requires discussion and a written agreement.

Subscribe to follow the development of Room13.

👉 https://youtu.be/u6O5FnfPezY`;

const youtubeLink = 'https://www.youtube.com/watch?v=u6O5FnfPezY';

// 11 Original Game Videos Pool
const gameVideos = [
  { game: 'game1', file: 'block_puzzle_ad_dog_2232.mp4', cap: 'Can you beat this block puzzle high score? 🧩' },
  { game: 'game2', file: 'flappy_ad_raccoon_2259.mp4', cap: 'Raccoon flying challenge in Flappy Earn! 🦝' },
  { game: 'game1', file: 'block_puzzle_ad_cat_2223.mp4', cap: 'Cat masterclass in Block Puzzle! 🐱' },
  { game: 'game2', file: 'flappy_ad_parrot_2258.mp4', cap: 'Parrot gaming session in Flappy Earn! 🦜' },
  { game: 'game1', file: 'block_puzzle_ad_dog_2229.mp4', cap: 'Satisfying block placement! 🐶' },
  { game: 'game2', file: 'flappy_ad_otter_2310.mp4', cap: 'Otter high score run! 🦦' },
  { game: 'game1', file: 'block_puzzle_ad_dog_2224.mp4', cap: 'Grid challenge in Block Puzzle! 🐶' },
  { game: 'game2', file: 'flappy_ad_cat_2254.mp4', cap: 'Cat tap-to-fly arcade action! 🐱' },
  { game: 'game1', file: 'block_puzzle_ad_dog_2223.mp4', cap: 'Perfect combo clear! 🐶' },
  { game: 'game2', file: 'flappy_ad_dog_2253.mp4', cap: 'Dog flying in Flappy Earn! 🐶' },
  { game: 'game2', file: 'flappy_ad_capybara_2308.mp4', cap: 'Capybara arcade fun! 🦫' }
];

async function execute20x20AlternatingRun() {
  console.log('===========================================================');
  console.log('🚀 EXECUTING 1-CLICK YOUTUBE + GAME ALTERNATING RUN (51 PAGES ACROSS 3 ACCOUNTS)');
  console.log('Link: https://youtu.be/u6O5FnfPezY (Clicking image opens YouTube immediately!)');
  console.log('===========================================================');

  const rawTokens = (process.env.META_USER_ACCESS_TOKEN || process.env.META_USER_ACCESS_TOKENS || '').split(',');
  const userTokens = rawTokens.map(t => t.trim().replace(/[\r\n]/g, '')).filter(t => t.length > 0);

  if (userTokens.length === 0) {
    console.error('CRITICAL: META_USER_ACCESS_TOKEN missing');
    return;
  }

  const pages = await getAllPagesGrouped(userTokens);
  console.log(`[Publisher] Discovered ${pages.length} Pages across 3 Meta Accounts. Distributing posts 1:1...`);

  const state = loadState();
  let ytCount = 0;
  let gameCount = 0;

  for (let i = 0; i < pages.length && (ytCount < 20 || gameCount < 20); i++) {
    const page = pages[i];
    const isYouTubeSlot = (i % 2 === 0);

    if (isYouTubeSlot && ytCount < 20) {
      console.log(`\n[YT #${ytCount + 1}/20] Publishing 1-Click YouTube Link Card to: ${page.name}...`);
      try {
        const res = await fetch(`https://graph.facebook.com/v20.0/${page.id}/feed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: room13Day2Caption,
            link: youtubeLink,
            access_token: page.access_token
          })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        console.log(`✅ [1-Click YouTube Success] on ${page.name}! Post ID: ${data.id}`);
        ytCount++;
        state.totalYoutubePosts++;
      } catch (err) {
        console.error(`❌ [YouTube Failed] on ${page.name}: ${err.message}`);
      }
    } else if (!isYouTubeSlot && gameCount < 20) {
      const videoItem = gameVideos[gameCount % gameVideos.length];
      const videoPath = path.join(__dirname, '..', 'media', videoItem.game, 'videos', videoItem.file);
      console.log(`\n[GAME #${gameCount + 1}/20] Publishing Game Video (${videoItem.file}) to: ${page.name}...`);

      try {
        if (fs.existsSync(videoPath)) {
          const vidId = await publishVideoPost(page.id, page.access_token, videoPath, videoItem.cap, true);
          console.log(`✅ [Game Video Success] on ${page.name}! ID: ${vidId}`);
          gameCount++;
          state.totalGamePosts++;
        }
      } catch (err) {
        console.error(`❌ [Game Video Failed] on ${page.name}: ${err.message}`);
      }
    }

    await sleep(5000);
  }

  // Also trigger TikTok & YouTube Shorts
  try {
    await uploadNextTikTokVideo();
    await uploadToYouTubeShorts();
  } catch (e) {}

  state.runCount++;
  saveState(state);

  console.log('===========================================================');
  console.log(`🎉 20x20 ALTERNATING RUN FINISHED! (YT Posts: ${ytCount}, Game Posts: ${gameCount})`);
  console.log('===========================================================');
}

async function startMasterEqualDaemon(intervalMinutes = 5) {
  console.log('===========================================================');
  console.log('🚀 24/7 20x20 EQUAL ALTERNATING MASTER DAEMON ACTIVATED (DAY 2 1-CLICK)');
  console.log('===========================================================');

  const executeLoop = async () => {
    try {
      await execute20x20AlternatingRun();
    } catch (e) {
      console.error('[Daemon Error]:', e.message);
    } finally {
      console.log(`\n⏳ Next 20x20 alternating run in ${intervalMinutes} minutes...`);
      setTimeout(executeLoop, intervalMinutes * 60 * 1000);
    }
  };

  await executeLoop();
}

if (require.main === module) {
  startMasterEqualDaemon(5).catch(console.error);
}

module.exports = { startMasterEqualDaemon, execute20x20AlternatingRun };
