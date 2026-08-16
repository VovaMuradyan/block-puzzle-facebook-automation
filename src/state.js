const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, '..', 'data', 'state.json');

function loadState() {
  if (fs.existsSync(STATE_FILE)) {
    try {
      const raw = fs.readFileSync(STATE_FILE, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('[State] Warning: Failed to parse state.json, initializing fresh state:', e.message);
    }
  }
  return { pages: {}, history: [] };
}

function saveState(state) {
  const dir = path.dirname(STATE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

function canPostToPage(pageState, minIntervalMinutes = 60) {
  if (!pageState || !pageState.last_post_at) return true;
  const lastPost = new Date(pageState.last_post_at).getTime();
  const now = Date.now();
  const diffMinutes = (now - lastPost) / (1000 * 60);
  return diffMinutes >= minIntervalMinutes;
}

function hasUsedComboRecently(state, pageId, mediaFilename, captionId, daysWindow = 7) {
  if (!state || !state.history) return false;
  const cutoffTime = Date.now() - (daysWindow * 24 * 60 * 60 * 1000);
  
  return state.history.some(entry => {
    if (entry.page_id !== pageId) return false;
    const entryTime = new Date(entry.timestamp).getTime();
    if (entryTime < cutoffTime) return false;
    
    // Check if same media or same caption was used on this page recently
    return entry.media_filename === mediaFilename && entry.caption_id === captionId;
  });
}

function logPublishEvent(state, pageId, pageName, fbPostId, mediaFilename, captionId, status, errorMsg = null, gameId = 'game1') {
  const nowIso = new Date().toISOString();
  
  if (!state.pages[pageId]) {
    state.pages[pageId] = {
      page_id: pageId,
      page_name: pageName,
      enabled: true,
      last_post_at: null,
      last_media_id: null,
      last_caption_id: null,
      last_success_at: null,
      last_error: null,
      total_posts: 0,
      last_game: null
    };
  }

  const p = state.pages[pageId];
  p.page_name = pageName;
  
  if (status === 'SUCCESS') {
    p.last_post_at = nowIso;
    p.last_success_at = nowIso;
    p.last_media_id = mediaFilename;
    p.last_caption_id = captionId;
    p.last_game = gameId;
    p.last_error = null;
    p.total_posts = (p.total_posts || 0) + 1;
  } else {
    p.last_error = errorMsg || 'Unknown error';
  }

  state.history.push({
    id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    page_id: pageId,
    page_name: pageName,
    timestamp: nowIso,
    fb_post_id: fbPostId || null,
    media_filename: mediaFilename,
    caption_id: captionId,
    status: status,
    error: errorMsg || null
  });

  saveState(state);
}

module.exports = {
  loadState,
  saveState,
  canPostToPage,
  hasUsedComboRecently,
  logPublishEvent
};
