/**
 * Pinterest Automated Video Pins Engine for Mobile Games
 * Publishes 9:16 Video Pins with Direct Google Play Destination Links
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const socialStatePath = path.join(__dirname, '..', 'data', 'social_state.json');

const pinterestQueue = [
  {
    game: 'game1',
    file: 'block_puzzle_ad_dog_2232.mp4',
    title: 'Block Puzzle Royale - Ultimate Brain Challenge! 🧩',
    description: 'Can you reach 10,000 points in Block Puzzle? Challenge your brain with satisfying line clears!',
    link: 'https://play.google.com/store/apps/details?id=com.tetris.royale'
  },
  {
    game: 'game2',
    file: 'flappy_ad_capybara_2308.mp4',
    title: 'Flappy Earn - Cute Capybara Arcade Challenge! 🦫',
    description: 'Help the cute Capybara fly and beat high scores! Download free on Google Play now.',
    link: 'https://play.google.com/store/apps/details?id=com.vov.brainfit.brainfit'
  },
  {
    game: 'game1',
    file: 'block_puzzle_ad_cat_2223.mp4',
    title: 'Cat Masterclass in Block Puzzle Game! 🐱',
    description: 'Relaxing and addictive block puzzle gameplay for casual gamers. Play free today!',
    link: 'https://play.google.com/store/apps/details?id=com.tetris.royale'
  },
  {
    game: 'game2',
    file: 'flappy_ad_raccoon_2259.mp4',
    title: 'Raccoon Flappy Earn Challenge! 🦝',
    description: 'Tap to fly and test your reflexes! Free casual arcade game on Google Play.',
    link: 'https://play.google.com/store/apps/details?id=com.vov.brainfit.brainfit'
  }
];

function getNextPinterestPin() {
  let state = { pinterestIndex: 0 };
  if (fs.existsSync(socialStatePath)) {
    try { state = JSON.parse(fs.readFileSync(socialStatePath, 'utf8')); } catch (e) {}
  }

  const currentIndex = state.pinterestIndex || 0;
  const pinItem = pinterestQueue[currentIndex % pinterestQueue.length];

  state.pinterestIndex = (currentIndex + 1) % pinterestQueue.length;
  state.last_pinterest_post_at = new Date().toISOString();
  fs.writeFileSync(socialStatePath, JSON.stringify(state, null, 2));

  return pinItem;
}

async function postToPinterest(accessToken = process.env.PINTEREST_ACCESS_TOKEN, boardId = process.env.PINTEREST_BOARD_ID) {
  console.log('===========================================================');
  console.log('📌 PINTEREST VIDEO PINS AUTOMATION ENGINE');
  console.log('===========================================================');

  const item = getNextPinterestPin();
  console.log(`[Pinterest Queue] Selected Pin: ${item.title}`);
  console.log(`[Target Link]: ${item.link}`);

  if (!accessToken || !boardId) {
    console.log('[Pinterest Note] Access Token or Board ID missing. Saving pin queue item to pending queue...');
    const pendingPath = path.join(__dirname, '..', 'data', 'pinterest_pending_queue.json');
    let queue = [];
    if (fs.existsSync(pendingPath)) queue = JSON.parse(fs.readFileSync(pendingPath, 'utf8'));
    queue.push({ ...item, queuedAt: new Date().toISOString() });
    fs.writeFileSync(pendingPath, JSON.stringify(queue, null, 2));
    console.log('✅ Saved pin item to data/pinterest_pending_queue.json!');
    return true;
  }

  // Create Pin via Pinterest API v5
  const postData = JSON.stringify({
    board_id: boardId,
    title: item.title,
    description: item.description,
    link: item.link,
    media_source: {
      source_type: 'video_id',
      cover_image_url: 'https://image.pollinations.ai/prompt/cute%203d%20pixar%20game%20cover?width=1080&height=1920'
    }
  });

  const options = {
    hostname: 'api.pinterest.com',
    port: 443,
    path: '/v5/pins',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`[Pinterest API] Status: ${res.statusCode}`);
        if (res.statusCode === 201 || res.statusCode === 200) {
          console.log('🎉 PINTEREST VIDEO PIN PUBLISHED SUCCESSFULLY!');
          resolve(true);
        } else {
          console.log(`Response: ${body}`);
          resolve(false);
        }
      });
    });
    req.on('error', console.error);
    req.write(postData);
    req.end();
  });
}

if (require.main === module) {
  postToPinterest().catch(console.error);
}

module.exports = postToPinterest;
