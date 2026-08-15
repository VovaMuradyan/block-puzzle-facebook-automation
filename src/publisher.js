const fs = require('fs');
const path = require('path');
const { getPages, publishVideoPost, publishPhotoPost } = require('./facebook');
const { loadState, canPostToPage, hasUsedComboRecently, logPublishEvent } = require('./state');

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

  const rawToken = process.env.META_USER_ACCESS_TOKEN || '';
  const userToken = rawToken.trim().replace(/[\r\n]/g, '');

  if (!userToken) {
    console.error(`[Publisher] CRITICAL ERROR: META_USER_ACCESS_TOKEN environment variable is missing.`);
    process.exit(1);
  }

  // Load captions and state
  const captionsPath = path.join(__dirname, '..', 'data', 'captions.json');
  if (!fs.existsSync(captionsPath)) {
    console.error(`[Publisher] ERROR: captions.json file not found at ${captionsPath}`);
    process.exit(1);
  }
  const captions = JSON.parse(fs.readFileSync(captionsPath, 'utf8'));

  const videosDir = path.join(__dirname, '..', 'media', 'videos');
  const photosDir = path.join(__dirname, '..', 'media', 'images');
  
  const videoFiles = fs.existsSync(videosDir) ? fs.readdirSync(videosDir).filter(f => f.endsWith('.mp4')) : [];
  const photoFiles = fs.existsSync(photosDir) ? fs.readdirSync(photosDir).filter(f => f.match(/\.(jpg|png|jpeg)$/i)) : [];

  console.log(`[Publisher] Assets available: ${videoFiles.length} videos, ${photoFiles.length} photos, ${captions.length} captions.`);

  const state = loadState();

  // Step 1: Auto-discover Facebook Pages from Meta API
  let pages = [];
  try {
    pages = await getPages(userToken);
    console.log(`[Publisher] Meta API returned ${pages.length} managed Facebook Pages:`);
    pages.forEach(p => console.log(` - ${p.name} (ID: ${p.id})`));
  } catch (err) {
    console.error(`[Publisher] Failed to fetch Facebook Pages: ${err.message}`);
    process.exit(1);
  }

  if (pages.length === 0) {
    console.warn(`[Publisher] Warning: No Facebook Pages found for this Meta account.`);
    return;
  }

  // Step 2: Iterate through each Page and enforce limits
  for (const page of pages) {
    const pageId = page.id;
    const pageName = page.name;
    const pageToken = page.access_token;
    const pageState = state.pages[pageId];

    console.log(`\n--- Processing Page: ${pageName} (${pageId}) ---`);

    // Rule: Each page max 1 post per 60 minutes
    if (!canPostToPage(pageState, 60)) {
      const lastPostTime = pageState ? pageState.last_post_at : 'Never';
      console.log(`[Publisher] SKIPPED ${pageName}: Last posted at ${lastPostTime}. Must wait 60 minutes between posts.`);
      continue;
    }

    // Pick media file and caption not recently used
    let selectedMedia = null;
    let selectedCaption = null;
    let isVideo = true;

    // Shuffle videos to randomize selection
    const shuffledVideos = [...videoFiles].sort(() => Math.random() - 0.5);
    const shuffledCaptions = [...captions].sort(() => Math.random() - 0.5);

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

    // Fallback to photos if no unused video combination found
    if (!selectedMedia && photoFiles.length > 0) {
      const shuffledPhotos = [...photoFiles].sort(() => Math.random() - 0.5);
      for (const p of shuffledPhotos) {
        for (const c of shuffledCaptions) {
          if (!hasUsedComboRecently(state, pageId, p, c.id, 7)) {
            selectedMedia = p;
            selectedCaption = c;
            isVideo = false;
            break;
          }
        }
        if (selectedMedia) break;
      }
    }

    if (!selectedMedia || !selectedCaption) {
      console.warn(`[Publisher] Warning: Could not find fresh unused content for Page ${pageName}`);
      continue;
    }

    const mediaPath = isVideo ? path.join(videosDir, selectedMedia) : path.join(photosDir, selectedMedia);
    const isReel = isVideo && selectedMedia.includes('9x16');

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
      console.log(`Page: ${pageName}`);
      console.log(`POSTED`);
      console.log(`${selectedMedia}`);
      console.log(`Facebook ID: ${fbPostId}`);
      console.log(`========================================\n`);

      logPublishEvent(state, pageId, pageName, fbPostId, selectedMedia, selectedCaption.id, 'SUCCESS');
    } catch (err) {
      console.error(`\n========================================`);
      console.error(`FAILED`);
      console.error(`Page: ${pageName}`);
      console.error(`Reason: ${err.message}`);
      console.error(`========================================\n`);

      logPublishEvent(state, pageId, pageName, null, selectedMedia, selectedCaption.id, 'FAILED', err.message);
    }
  }

  console.log(`\n[Publisher] Execution completed at ${new Date().toISOString()}`);
}

if (require.main === module) {
  runPublisher().catch(err => {
    console.error('[Publisher] Fatal Error:', err);
    process.exit(1);
  });
}

module.exports = runPublisher;
