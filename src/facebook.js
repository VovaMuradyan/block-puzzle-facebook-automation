const fs = require('fs');
const path = require('path');

const GRAPH_API_BASE = 'https://graph.facebook.com/v20.0';
const GRAPH_VIDEO_BASE = 'https://graph-video.facebook.com/v20.0';

/**
 * Fetch Facebook Pages grouped per user token for account interleaving.
 */
async function getAllPagesGrouped(userTokens) {
  const tokens = Array.isArray(userTokens) ? userTokens : [userTokens];
  const accountsPages = [];

  for (const token of tokens) {
    if (!token) continue;
    try {
      const url = `${GRAPH_API_BASE}/me/accounts?fields=id,name,access_token,category&access_token=${token}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        console.error(`[FB API] Warning fetching pages for token (...${token.substr(-8)}): ${data.error.message}`);
        continue;
      }

      const pages = data.data || [];
      if (pages.length > 0) {
        accountsPages.push(pages);
      }
    } catch (err) {
      console.error(`[FB API] Error requesting pages for token: ${err.message}`);
    }
  }

  // Interleave pages across accounts: [Acc1_Page1, Acc2_Page1, Acc1_Page2, Acc2_Page2...]
  const interleavedPages = [];
  let maxPagesInAnyAccount = 0;
  accountsPages.forEach(arr => {
    if (arr.length > maxPagesInAnyAccount) maxPagesInAnyAccount = arr.length;
  });

  for (let i = 0; i < maxPagesInAnyAccount; i++) {
    for (const accPages of accountsPages) {
      if (accPages[i]) {
        // Prevent duplicate page IDs if same page belongs to multiple tokens
        if (!interleavedPages.some(p => p.id === accPages[i].id)) {
          interleavedPages.push(accPages[i]);
        }
      }
    }
  }

  return interleavedPages;
}

/**
 * Helper to delay execution for retries/backoff
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Publish a Video/Reel to a Facebook Page with up to 3 retries.
 */
async function publishVideoPost(pageId, pageAccessToken, videoPath, caption, isReel = true) {
  let attempt = 0;
  const maxRetries = 3;
  let lastError = null;

  while (attempt < maxRetries) {
    attempt++;
    try {
      console.log(`[FB API] Attempt ${attempt}/${maxRetries} uploading video to Page ID ${pageId}...`);
      
      const fileBuffer = fs.readFileSync(videoPath);
      const filename = path.basename(videoPath);
      
      const formData = new FormData();
      formData.append('access_token', pageAccessToken);
      formData.append('description', caption);
      if (isReel) {
        formData.append('is_reel', 'true');
      }
      formData.append('source', new Blob([fileBuffer]), filename);

      const endpoint = `${GRAPH_VIDEO_BASE}/${pageId}/videos`;
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      const result = await res.json();

      if (result.error) {
        // Check for Rate Limit codes
        const code = result.error.code;
        if ([4, 17, 32, 613].includes(code)) {
          console.warn(`[FB API] Rate limit reached (code ${code}). Backing off...`);
          await sleep(10000 * attempt);
        }
        throw new Error(`Meta Error (${code}): ${result.error.message}`);
      }

      console.log(`[FB API] Video published successfully! Post/Video ID: ${result.id}`);
      return result.id;
    } catch (err) {
      lastError = err;
      console.error(`[FB API] Attempt ${attempt} failed: ${err.message}`);
      if (attempt < maxRetries) {
        await sleep(3000 * attempt);
      }
    }
  }

  throw lastError;
}

/**
 * Publish a Photo to a Facebook Page with retries.
 */
async function publishPhotoPost(pageId, pageAccessToken, photoPath, caption) {
  let attempt = 0;
  const maxRetries = 3;
  let lastError = null;

  while (attempt < maxRetries) {
    attempt++;
    try {
      console.log(`[FB API] Attempt ${attempt}/${maxRetries} uploading photo to Page ID ${pageId}...`);
      
      const fileBuffer = fs.readFileSync(photoPath);
      const filename = path.basename(photoPath);

      const formData = new FormData();
      formData.append('access_token', pageAccessToken);
      formData.append('caption', caption);
      formData.append('source', new Blob([fileBuffer]), filename);

      const endpoint = `${GRAPH_API_BASE}/${pageId}/photos`;
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      const result = await res.json();

      if (result.error) {
        throw new Error(`Meta Error (${result.error.code}): ${result.error.message}`);
      }

      console.log(`[FB API] Photo published successfully! Photo/Post ID: ${result.id}`);
      return result.id;
    } catch (err) {
      lastError = err;
      console.error(`[FB API] Attempt ${attempt} failed: ${err.message}`);
      if (attempt < maxRetries) {
        await sleep(3000 * attempt);
      }
    }
  }

  throw lastError;
}

module.exports = {
  getAllPagesGrouped,
  publishVideoPost,
  publishPhotoPost,
  sleep
};
