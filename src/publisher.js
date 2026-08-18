const fs = require('fs');
const path = require('path');
const { getAllPagesGrouped, publishVideoPost, publishPhotoPost, sleep } = require('./facebook');
const { loadState, canPostToPage, hasUsedComboRecently, logPublishEvent, saveState } = require('./state');

// Load .env manually if exists without requiring external packages
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

async function runPublisher() {
  console.log(`====================================================`);
  console.log(`[Publisher] Execution started at ${new Date().toISOString()}`);
  console.log(`====================================================`);

  const rawTokens = (process.env.META_USER_ACCESS_TOKEN || process.env.META_USER_ACCESS_TOKENS || '').split(',');
  const userTokens = rawTokens.map(t => t.trim().replace(/[\r\n]/g, '')).filter(t => t.length > 0);

  if (userTokens.length === 0) {
    console.error(`[Publisher] CRITICAL ERROR: META_USER_ACCESS_TOKEN environment variable is missing.`);
    process.exit(1);
  }

  const state = loadState();

  // Global Multi-Game Alternation
  const currentGame = (state.last_active_game === 'game1') ? 'game2' : 'game1';
  state.last_active_game = currentGame;
  saveState(state);

  const gameName = (currentGame === 'game1') ? 'Block Puzzle: Blast & Drop' : 'Flappy Earn';
  console.log(`[Multi-Game] Active Game for this 30-min run: [${currentGame.toUpperCase()}] (${gameName})`);

  // Load game-specific captions
  const captionsFile = (currentGame === 'game1') ? 'game1_captions.json' : 'game2_captions.json';
  let captionsPath = path.join(__dirname, '..', 'data', captionsFile);
  if (!fs.existsSync(captionsPath)) {
    captionsPath = path.join(__dirname, '..', 'data', 'captions.json');
  }
  
  if (!fs.existsSync(captionsPath)) {
    console.error(`[Publisher] ERROR: Captions file not found at ${captionsPath}`);
    process.exit(1);
  }
  const captions = JSON.parse(fs.readFileSync(captionsPath, 'utf8'));

  // Load game-specific media
  const gameMediaDir = path.join(__dirname, '..', 'media', currentGame);
  const videosDir = path.join(gameMediaDir, 'videos');
  const photosDir = path.join(gameMediaDir, 'images');

  // Fallback to default media if game-specific folder empty
  const actualVideosDir = fs.existsSync(videosDir) && fs.readdirSync(videosDir).length > 0 ? videosDir : path.join(__dirname, '..', 'media', 'videos');
  const actualPhotosDir = fs.existsSync(photosDir) && fs.readdirSync(photosDir).length > 0 ? photosDir : path.join(__dirname, '..', 'media', 'images');

  const videoFiles = fs.existsSync(actualVideosDir)
    ? fs.readdirSync(actualVideosDir).filter(f => f.endsWith('.mp4') && fs.statSync(path.join(actualVideosDir, f)).size > 50000)
    : [];
  const photoFiles = fs.existsSync(actualPhotosDir)
    ? fs.readdirSync(actualPhotosDir).filter(f => f.match(/\.(jpg|png|jpeg)$/i) && fs.statSync(path.join(actualPhotosDir, f)).size > 50000)
    : [];

  console.log(`[Publisher] Assets for ${gameName}: ${videoFiles.length} videos, ${photoFiles.length} photos, ${captions.length} captions.`);

  // Step 1: Auto-discover Facebook Pages from Meta API (Interleaved across accounts)
  let pages = [];
  try {
    pages = await getAllPagesGrouped(userTokens);
    console.log(`[Publisher] Interleaved ${pages.length} Pages across accounts for smooth distribution:`);
    pages.forEach(p => console.log(` - ${p.name} (ID: ${p.id})`));
  } catch (err) {
    console.error(`[Publisher] Failed to fetch Facebook Pages: ${err.message}`);
    process.exit(1);
  }

  if (pages.length === 0) {
    console.warn(`[Publisher] Warning: No Facebook Pages found for the provided Meta account(s).`);
    return;
  }

  let postsPublishedThisRun = 0;

  // Step 2: Iterate through each Page with Staggered Delays & Rate Limits
  for (const page of pages) {
    const pageId = page.id;
    const pageName = page.name;
    const pageToken = page.access_token;
    const pageState = state.pages[pageId] || {};

    // Rule 1: Strictly 1 post per page every 30 minutes
    if (!canPostToPage(pageState, 30)) {
      const lastPostTime = pageState.last_post_at ? new Date(pageState.last_post_at).toLocaleTimeString() : 'Never';
      console.log(`[Publisher] SKIPPED ${pageName}: Last posted at ${lastPostTime}. Must wait 30 minutes between posts.`);
      continue;
    }

    // Rule 2: Alternate Game 1 <-> Game 2 individually for THIS page
    const pageGame = (pageState.last_game === 'game1') ? 'game2' : 'game1';
    const pageGameName = (pageGame === 'game1') ? 'Block Puzzle: Blast & Drop' : 'Flappy Earn';

    console.log(`\n--- Processing Page: ${pageName} (${pageId}) [Selected Game: ${pageGame.toUpperCase()} (${pageGameName})] ---`);

    // Load game-specific captions
    const captionsFile = (pageGame === 'game1') ? 'game1_captions.json' : 'game2_captions.json';
    let captionsPath = path.join(__dirname, '..', 'data', captionsFile);
    if (!fs.existsSync(captionsPath)) {
      captionsPath = path.join(__dirname, '..', 'data', 'captions.json');
    }
    const captions = JSON.parse(fs.readFileSync(captionsPath, 'utf8'));

    // Load game-specific videos
    const videosDir = path.join(__dirname, '..', 'media', pageGame, 'videos');
    const videoFiles = fs.existsSync(videosDir)
      ? fs.readdirSync(videosDir).filter(f => f.endsWith('.mp4') && fs.statSync(path.join(videosDir, f)).size > 50000)
      : [];

    if (videoFiles.length === 0) {
      console.warn(`[Publisher] Warning: No valid videos found for ${pageGame}`);
      continue;
    }

    // Anti-ban Stagger Delay between consecutive page posts (5-10 seconds pause)
    if (postsPublishedThisRun > 0) {
      const staggerSeconds = Math.floor(Math.random() * 6) + 5;
      console.log(`[Anti-Ban Stagger] Pausing for ${staggerSeconds} seconds before posting to next page (${pageName})...`);
      await sleep(staggerSeconds * 1000);
    }

    // Pick media file and caption not recently used
    let selectedMedia = null;
    let selectedCaption = null;
    let isVideo = true;

    // Shuffle videos and captions
    const shuffledVideos = [...videoFiles].sort(() => Math.random() - 0.5);
    const shuffledCaptions = [...captions].sort(() => Math.random() - 0.5);

    // For Flappy Earn (game2), strictly alternate between Video 1 and Video 2
    if (pageGame === 'game2') {
      const lastVideo = pageState.last_flappy_video || 'flappy_intro_scene_40s_2.mp4';
      const nextVideo = (lastVideo === 'flappy_intro_scene_40s.mp4') ? 'flappy_intro_scene_40s_2.mp4' : 'flappy_intro_scene_40s.mp4';
      if (videoFiles.includes(nextVideo)) {
        selectedMedia = nextVideo;
      } else {
        selectedMedia = videoFiles[0];
      }
      pageState.last_flappy_video = selectedMedia;
    } else {
      // For Block Puzzle (game1), pick fresh video combo
      for (const v of shuffledVideos) {
        for (const c of shuffledCaptions) {
          if (!hasUsedComboRecently(state, pageId, v, c.id, 7)) {
            selectedMedia = v;
            selectedCaption = c;
            isVideo = true;
            break;
          }
        }
        if (selectedMedia) break;
      }
    }

    if (!selectedCaption) {
      selectedCaption = shuffledCaptions[Math.floor(Math.random() * shuffledCaptions.length)];
    }

    if (!selectedMedia || !selectedCaption) {
      console.warn(`[Publisher] Warning: Could not find fresh unused content for Page ${pageName}`);
      continue;
    }

    const mediaPath = path.join(videosDir, selectedMedia);
    const isReel = selectedMedia.includes('9x16') || selectedMedia.includes('flappy');

    console.log(`[Publisher] Selected asset: ${selectedMedia} (${isReel ? 'FB Reel' : isVideo ? 'FB Video' : 'FB Photo'})`);
    console.log(`[Publisher] Selected caption ID: ${selectedCaption.id} ("${selectedCaption.hook}")`);

    try {
      let fbPostId = null;
      if (isVideo) {
        fbPostId = await publishVideoPost(pageId, pageToken, mediaPath, selectedCaption.text, isReel);
      } else {
        fbPostId = await publishPhotoPost(pageId, pageToken, mediaPath, selectedCaption.text);
      }

      console.log(`\n========================================`);
      console.log(`${new Date().toISOString()}`);
      console.log(`Game: ${gameName}`);
      console.log(`Page: ${pageName}`);
      console.log(`POSTED`);
      console.log(`${selectedMedia}`);
      console.log(`Facebook ID: ${fbPostId}`);
      console.log(`========================================\n`);

      logPublishEvent(state, pageId, pageName, fbPostId, selectedMedia, selectedCaption.id, 'SUCCESS', null, pageGame);
      saveState(state);
      postsPublishedThisRun++;
    } catch (err) {
      console.error(`\n========================================`);
      console.error(`FAILED`);
      console.error(`Game: ${pageGameName}`);
      console.error(`Page: ${pageName}`);
      console.error(`Reason: ${err.message}`);
      console.error(`========================================\n`);

      logPublishEvent(state, pageId, pageName, null, selectedMedia, selectedCaption.id, 'FAILED', err.message, pageGame);
      saveState(state);
    }
  }

  console.log(`\n[Publisher] Execution completed at ${new Date().toISOString()}. Published ${postsPublishedThisRun} post(s) for ${gameName}.`);
}

if (require.main === module) {
  runPublisher().catch(err => {
    console.error('[Publisher] Fatal Error:', err);
    process.exit(1);
  });
}

module.exports = runPublisher;
