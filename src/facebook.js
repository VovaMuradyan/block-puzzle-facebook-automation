const fs = require('fs');
const path = require('path');

const GRAPH_API_BASE = 'https://graph.facebook.com/v20.0';
const GRAPH_VIDEO_BASE = 'https://graph-video.facebook.com/v20.0';

// Load App Config if available
let appConfig = [];
const appsConfigPath = path.join(__dirname, '..', 'config', 'apps.json');
if (fs.existsSync(appsConfigPath)) {
  try {
    appConfig = JSON.parse(fs.readFileSync(appsConfigPath, 'utf8'));
  } catch (e) {}
}

/**
 * Automatically exchange short-lived user token for 60-Day Long-Lived Token
 */
async function getLongLivedTokenIfPossible(token, accountIndex) {
  if (!token) return token;
  const cfg = appConfig[accountIndex] || appConfig[0];
  if (!cfg || !cfg.appId || !cfg.appSecret) return token;

  try {
    const url = `${GRAPH_API_BASE}/oauth/access_token?grant_type=fb_exchange_token&client_id=${cfg.appId}&client_secret=${cfg.appSecret}&fb_exchange_token=${token.trim()}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.access_token) {
      console.log(`[FB API] Successfully upgraded Token #${accountIndex + 1} to 60-DAY LONG-LIVED TOKEN (expires in ${Math.round(data.expires_in / 86400)} days)!`);
      return data.access_token;
    }
  } catch (err) {
    console.warn(`[FB API] Could not exchange token #${accountIndex + 1}: ${err.message}`);
  }
  return token;
}

/**
 * Fetch Facebook Pages grouped per user token for account interleaving.
 */
async function getAllPagesGrouped(userTokens) {
  const tokens = Array.isArray(userTokens) ? userTokens : [userTokens];
  const accountsPages = [];

  // Load cached permanent page tokens if exist
  const cachePath = path.join(__dirname, '..', 'data', 'page_tokens.json');
  let cachedPageTokens = {};
  if (fs.existsSync(cachePath)) {
    try { cachedPageTokens = JSON.parse(fs.readFileSync(cachePath, 'utf8')); } catch (e) {}
  }

  for (let idx = 0; idx < tokens.length; idx++) {
    let token = tokens[idx];
    if (!token) continue;

    // Auto-upgrade token to 60-day long-lived token
    token = await getLongLivedTokenIfPossible(token, idx);

    try {
      const url = `${GRAPH_API_BASE}/me/accounts?fields=id,name,access_token,category&access_token=${token}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        console.warn(`[FB API] Warning for Token #${idx + 1} (...${token.slice(-8)}): ${data.error.message} (code ${data.error.code}). Skipping token.`);
        continue;
      }

      const pages = data.data || [];
      if (pages.length > 0) {
        // Cache permanent page tokens
        pages.forEach(p => {
          cachedPageTokens[p.id] = { id: p.id, name: p.name, access_token: p.access_token, updated_at: new Date().toISOString() };
        });
        accountsPages.push(pages);
      }
    } catch (err) {
      console.error(`[FB API] Error requesting pages for token #${idx + 1}: ${err.message}`);
    }
  }

  // Save updated permanent page tokens to cache file
  try {
    fs.writeFileSync(cachePath, JSON.stringify(cachedPageTokens, null, 2), 'utf8');
  } catch (e) {}

  // Interleave pages across accounts: [Acc1_Page1, Acc2_Page1, Acc1_Page2, Acc2_Page2...]
  const interleavedPages = [];
  let maxPagesInAnyAccount = 0;
  accountsPages.forEach(arr => {
    if (arr.length > maxPagesInAnyAccount) maxPagesInAnyAccount = arr.length;
  });

  for (let i = 0; i < maxPagesInAnyAccount; i++) {
    for (const accPages of accountsPages) {
      if (accPages[i]) {
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
        const code = result.error.code;
        if (code === 190) {
          throw new Error(`Meta Token Expiry/Logout (190): ${result.error.message}`);
        }
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
      if (err.message.includes('190')) break;
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
        const code = result.error.code;
        if (code === 190) {
          throw new Error(`Meta Token Expiry/Logout (190): ${result.error.message}`);
        }
        throw new Error(`Meta Error (${code}): ${result.error.message}`);
      }

      console.log(`[FB API] Photo published successfully! Photo/Post ID: ${result.id}`);
      return result.id;
    } catch (err) {
      lastError = err;
      console.error(`[FB API] Attempt ${attempt} failed: ${err.message}`);
      if (err.message.includes('190')) break;
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
