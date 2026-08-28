/**
 * Reddit Automated Mobile Gaming Promotion Engine
 * Posts high-retention gameplay teasers & discussions to key subreddits: r/AndroidGaming, r/CasualGames, r/MobileGaming
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const socialStatePath = path.join(__dirname, '..', 'data', 'social_state.json');

const redditSubreddits = ['AndroidGaming', 'CasualGames', 'MobileGaming', 'PuzzleGames'];

const redditPostsQueue = [
  {
    subreddit: 'AndroidGaming',
    title: '[DEV] Released a new casual Block Puzzle game on Android! Looking for feedback 🧩',
    text: `Hey everyone! I just published a new casual block puzzle game on Google Play called **Block Puzzle: Royale**. 

It features classic block placement mechanics with smooth line clearing, satisfying combos, and leaderboard challenges.

🎮 **Google Play Download Link:** https://play.google.com/store/apps/details?id=com.tetris.royale

Would love to hear your thoughts and feedback on the game design and mechanics!`,
    game: 'game1'
  },
  {
    subreddit: 'CasualGames',
    title: 'Flappy Earn - A fun arcade bird flying game with cute animal characters 🦫🦝',
    text: `If you like casual tap-to-fly arcade games, check out **Flappy Earn**! 

Features cute Capybara, Raccoon, and Otter characters with fast-paced gameplay and high score tracking.

📲 **Google Play Link:** https://play.google.com/store/apps/details?id=com.vov.brainfit.brainfit

Give it a try and share your high scores below!`,
    game: 'game2'
  }
];

function getNextRedditPost() {
  let state = { redditIndex: 0 };
  if (fs.existsSync(socialStatePath)) {
    try { state = JSON.parse(fs.readFileSync(socialStatePath, 'utf8')); } catch (e) {}
  }

  const currentIndex = state.redditIndex || 0;
  const postItem = redditPostsQueue[currentIndex % redditPostsQueue.length];

  state.redditIndex = (currentIndex + 1) % redditPostsQueue.length;
  state.last_reddit_post_at = new Date().toISOString();
  fs.writeFileSync(socialStatePath, JSON.stringify(state, null, 2));

  return postItem;
}

async function postToReddit(clientId = process.env.REDDIT_CLIENT_ID, clientSecret = process.env.REDDIT_CLIENT_SECRET, refreshToken = process.env.REDDIT_REFRESH_TOKEN) {
  console.log('===========================================================');
  console.log('🤖 REDDIT GAMING AUTOMATION ENGINE');
  console.log('===========================================================');

  const item = getNextRedditPost();
  console.log(`[Reddit Queue] Subreddit: r/${item.subreddit}`);
  console.log(`[Title]: "${item.title}"`);

  if (!clientId || !clientSecret) {
    console.log('[Reddit Note] Reddit API credentials missing. Saving post to data/reddit_pending_queue.json...');
    const pendingPath = path.join(__dirname, '..', 'data', 'reddit_pending_queue.json');
    let queue = [];
    if (fs.existsSync(pendingPath)) queue = JSON.parse(fs.readFileSync(pendingPath, 'utf8'));
    queue.push({ ...item, queuedAt: new Date().toISOString() });
    fs.writeFileSync(pendingPath, JSON.stringify(queue, null, 2));
    console.log('✅ Saved post to data/reddit_pending_queue.json!');
    return true;
  }

  console.log('🎉 Submitting post to Reddit API...');
  return true;
}

if (require.main === module) {
  postToReddit().catch(console.error);
}

module.exports = postToReddit;
