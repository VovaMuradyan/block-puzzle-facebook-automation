/**
 * 24/7 Multi-Platform Master Daemon Publisher Engine
 * Continuously publishes your 11 original videos and Google Play links across:
 * 1. Facebook Pages (51 Pages)
 * 2. TikTok Studio (11 Animal Videos)
 * 3. YouTube Shorts (11 Animal Videos)
 * 4. Pinterest Video Pins (9:16 Vertical Video Pins)
 * 5. Reddit Gaming Subreddits (r/AndroidGaming, r/CasualGames, r/MobileGaming)
 */
const runPublisher = require('../src/publisher');
const uploadNextTikTokVideo = require('./upload_to_tiktok_browser');
const uploadToYouTubeShorts = require('./upload_to_youtube_browser');
const postToPinterest = require('./pinterest_poster');
const postToReddit = require('./reddit_poster');
const runDiscordBroadcast = require('./discord_bot_promoter');

function getMsUntilNextInterval(intervalMinutes = 5) {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ms = now.getMilliseconds();

  const nextMinuteMark = Math.ceil((minutes + 0.001) / intervalMinutes) * intervalMinutes;
  const diffMinutes = nextMinuteMark - minutes;
  const targetMs = (diffMinutes * 60 - seconds) * 1000 - ms;

  return targetMs > 0 ? targetMs : intervalMinutes * 60 * 1000;
}

async function executeAllPlatformPublishing() {
  console.log('===========================================================');
  console.log('🚀 EXECUTING 5-PLATFORM MASTER PUBLISHING RUN');
  console.log('Platforms: Facebook | TikTok | YouTube | Pinterest | Reddit');
  console.log('===========================================================');

  try {
    console.log('\n[1/5] Facebook Pages Auto-Publisher...');
    await runPublisher();
  } catch (err) {
    console.error('Facebook error:', err.message);
  }

  try {
    console.log('\n[2/5] TikTok Video Auto-Publisher...');
    await uploadNextTikTokVideo();
  } catch (err) {
    console.error('TikTok error:', err.message);
  }

  try {
    console.log('\n[3/5] YouTube Shorts Auto-Publisher...');
    await uploadToYouTubeShorts();
  } catch (err) {
    console.error('YouTube Shorts error:', err.message);
  }

  try {
    console.log('\n[4/5] Pinterest Video Pins Auto-Publisher...');
    await postToPinterest();
  } catch (err) {
    console.error('Pinterest error:', err.message);
  }

  try {
    console.log('\n[5/5] Reddit Gaming Auto-Publisher...');
    await postToReddit();
  } catch (err) {
    console.error('Reddit error:', err.message);
  }

  try {
    await runDiscordBroadcast();
  } catch (e) {}

  console.log('===========================================================');
  console.log('🎉 5-PLATFORM PUBLISHING RUN COMPLETED!');
  console.log('===========================================================');
}

async function startDaemon() {
  console.log('===========================================================');
  console.log('🚀 24/7 5-PLATFORM MASTER DAEMON ACTIVATED');
  console.log('===========================================================');

  // Trigger immediate run
  await executeAllPlatformPublishing();

  // Schedule continuous loop every 5 minutes (High-Frequency Mode)
  const scheduleNext = () => {
    const delayMs = getMsUntilNextInterval(5);
    const nextTime = new Date(Date.now() + delayMs).toLocaleTimeString();
    console.log(`\n[Daemon] Next scheduled multi-platform run at ${nextTime} (in ${Math.round(delayMs / 1000 / 60)} minutes)...`);

    setTimeout(async () => {
      try {
        await executeAllPlatformPublishing();
      } catch (err) {
        console.error('[Daemon] Error during scheduled run:', err.message);
      } finally {
        scheduleNext();
      }
    }, delayMs);
  };

  scheduleNext();
}

if (require.main === module) {
  startDaemon();
}

module.exports = { startDaemon, executeAllPlatformPublishing };
