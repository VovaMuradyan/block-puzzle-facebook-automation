const runPublisher = require('../src/publisher');
const uploadNextTikTokVideo = require('./upload_to_tiktok_browser');
const uploadToYouTubeShorts = require('./upload_to_youtube_browser');

function getMsUntilNextInterval(intervalMinutes = 30) {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ms = now.getMilliseconds();

  const nextMinuteMark = Math.ceil((minutes + 0.001) / intervalMinutes) * intervalMinutes;
  const diffMinutes = nextMinuteMark - minutes;
  const targetMs = (diffMinutes * 60 - seconds) * 1000 - ms;

  return targetMs > 0 ? targetMs : intervalMinutes * 60 * 1000;
}

async function startDaemon() {
  console.log('===========================================================');
  console.log('🚀 24/7 TRIPLE-PLATFORM DAEMON PUBLISHER STARTED (FACEBOOK + TIKTOK + YOUTUBE SHORTS)');
  console.log('===========================================================');

  // Trigger first immediate run
  try {
    console.log('\n[Daemon] Executing publication run for Facebook, TikTok & YouTube Shorts...');
    await runPublisher();
    await uploadNextTikTokVideo();
    await uploadToYouTubeShorts();
  } catch (err) {
    console.error('[Daemon] Immediate run error:', err.message);
  }

  // Schedule loop sharp at :00 and :30 minute marks
  const scheduleNext = () => {
    const delayMs = getMsUntilNextInterval(30);
    const nextTime = new Date(Date.now() + delayMs).toLocaleTimeString();
    console.log(`\n[Daemon] Next scheduled multi-platform run at ${nextTime} (in ${Math.round(delayMs / 1000 / 60)} minutes)...`);

    setTimeout(async () => {
      try {
        console.log(`\n[Daemon] Triggering scheduled run at ${new Date().toISOString()}...`);
        await runPublisher();
        await uploadNextTikTokVideo();
        await uploadToYouTubeShorts();
      } catch (err) {
        console.error('[Daemon] Scheduled run error:', err.message);
      } finally {
        scheduleNext();
      }
    }, delayMs);
  };

  scheduleNext();
}

startDaemon();
