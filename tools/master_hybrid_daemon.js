/**
 * 24/7 Master Hybrid Daemon Publisher
 * - Phase 1: Publishes Room13 Post (with YouTube link at the top) 4 times every 15 minutes.
 * - Phase 2: Long-term rotation: 3 Game Videos (from the 11 videos) -> 1 Room13 Post (with YouTube link at the top) -> Repeat!
 */
const fs = require('fs');
const path = require('path');
const { getAllPagesGrouped, publishPhotoPost, publishVideoPost, sleep } = require('../src/facebook');
const runPublisher = require('../src/publisher');
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

const stateFilePath = path.join(__dirname, '..', 'data', 'hybrid_schedule_state.json');

function loadHybridState() {
  if (fs.existsSync(stateFilePath)) {
    try {
      return JSON.parse(fs.readFileSync(stateFilePath, 'utf8'));
    } catch (e) {}
  }
  return {
    initialRoom13RunsDone: 0,
    gameVideosCountSinceLastRoom13: 0,
    totalRoom13Published: 0,
    totalGameVideosPublished: 0
  };
}

function saveHybridState(state) {
  fs.writeFileSync(stateFilePath, JSON.stringify(state, null, 2));
}

// Room13 Caption with YouTube link at the VERY TOP
const room13TopLinkCaption = `🎬 WATCH FULL GAMEPLAY ON YOUTUBE:
👉 https://youtu.be/pAMgsCMQ8Cw

🎮 Room13 is an indie third-person horror game set in a mysterious old hotel.

In this video, I’m showing early gameplay, movement, camera, doors, rooms, and the atmosphere of the Room13 hotel.

The game is still in development, so you may see work-in-progress features and improvements.

Want to support Room13 or discuss possible investment / revenue-share participation?
You can find the interest form link in my channel profile or in the pinned comment.

Important: this is only an expression of interest. No profit or revenue is guaranteed. Any participation requires discussion and a written agreement.

Subscribe to follow the development of Room13.

👉 https://youtu.be/pAMgsCMQ8Cw`;

const photoPath = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2\\.user_uploaded\\media_1788037844054.jpg';

async function publishRoom13Run() {
  console.log('===========================================================');
  console.log('🎮 [Room13] PUBLISHING ROOM13 POST (YOUTUBE LINK AT TOP)');
  console.log('===========================================================');

  const rawTokens = (process.env.META_USER_ACCESS_TOKEN || process.env.META_USER_ACCESS_TOKENS || '').split(',');
  const userTokens = rawTokens.map(t => t.trim().replace(/[\r\n]/g, '')).filter(t => t.length > 0);

  if (userTokens.length === 0) {
    console.error('CRITICAL: META_USER_ACCESS_TOKEN is missing');
    return;
  }

  const pages = await getAllPagesGrouped(userTokens);
  console.log(`[Room13] Publishing across ${pages.length} Facebook Pages...`);

  let success = 0;
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    try {
      if (fs.existsSync(photoPath)) {
        await publishPhotoPost(page.id, page.access_token, photoPath, room13TopLinkCaption);
      } else {
        await fetch(`https://graph.facebook.com/v20.0/${page.id}/feed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: room13TopLinkCaption,
            link: 'https://youtu.be/pAMgsCMQ8Cw',
            access_token: page.access_token
          })
        });
      }
      success++;
      console.log(`[${i + 1}/${pages.length}] ✅ Posted on ${page.name}`);
    } catch (e) {
      console.error(`[${i + 1}/${pages.length}] ❌ Failed on ${page.name}: ${e.message}`);
    }
    if (i < pages.length - 1) await sleep(5000);
  }

  console.log(`🎉 Room13 Run Finished! Posted to ${success} pages.`);
}

async function startMasterHybridDaemon() {
  console.log('===========================================================');
  console.log('🚀 24/7 MASTER HYBRID DAEMON ACTIVATED');
  console.log('Rule 1: 4 Initial Room13 Posts every 15 minutes');
  console.log('Rule 2: Then 3 Game Videos (11 videos) -> 1 Room13 Post rotation');
  console.log('===========================================================');

  const state = loadHybridState();

  const runCycle = async () => {
    const currentState = loadHybridState();

    if (currentState.initialRoom13RunsDone < 4) {
      console.log(`\n⏳ [PHASE 1] Initial Room13 Run #${currentState.initialRoom13RunsDone + 1}/4 (15-min interval)...`);
      await publishRoom13Run();
      currentState.initialRoom13RunsDone++;
      currentState.totalRoom13Published++;
      saveHybridState(currentState);

      console.log(`[Scheduler] Next initial Room13 run in 15 minutes...`);
      setTimeout(runCycle, 15 * 60 * 1000);
    } else {
      console.log(`\n🔄 [PHASE 2] Long-Term Rotation: 3 Game Videos -> 1 Room13 Post`);

      if (currentState.gameVideosCountSinceLastRoom13 < 3) {
        console.log(`[Rotation] Publishing Game Video #${currentState.gameVideosCountSinceLastRoom13 + 1}/3...`);
        try {
          await runPublisher();
          await uploadNextTikTokVideo();
          await uploadToYouTubeShorts();
        } catch (e) {
          console.error('[Rotation Error]:', e.message);
        }
        currentState.gameVideosCountSinceLastRoom13++;
        currentState.totalGameVideosPublished++;
        saveHybridState(currentState);

        console.log(`[Scheduler] Next game run in 15 minutes...`);
        setTimeout(runCycle, 15 * 60 * 1000);
      } else {
        console.log(`[Rotation] 3 Game videos reached! Publishing Room13 Post (YouTube Link at Top)...`);
        await publishRoom13Run();
        currentState.gameVideosCountSinceLastRoom13 = 0;
        currentState.totalRoom13Published++;
        saveHybridState(currentState);

        console.log(`[Scheduler] Next run in 15 minutes...`);
        setTimeout(runCycle, 15 * 60 * 1000);
      }
    }
  };

  // Start immediate first run
  await runCycle();
}

if (require.main === module) {
  startMasterHybridDaemon().catch(console.error);
}

module.exports = { startMasterHybridDaemon, publishRoom13Run };
