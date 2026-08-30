/**
 * 1-Click YouTube Redirect Card Publisher for Facebook Pages
 * Publishes native Link Cards where clicking ANYWHERE on the image instantly opens the YouTube video!
 */
const fs = require('fs');
const path = require('path');
const { getAllPagesGrouped, sleep } = require('../src/facebook');

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

const customCaption = `🎬 Tap the image to watch full gameplay on YouTube! 👇

🎮 Room13 is an indie third-person horror game set in a mysterious old hotel.

In this video, I’m showing early gameplay, movement, camera, doors, rooms, and the atmosphere of the Room13 hotel.

The game is still in development, so you may see work-in-progress features and improvements.

Want to support Room13 or discuss possible investment / revenue-share participation?
You can find the interest form link in my channel profile or in the pinned comment.

Important: this is only an expression of interest. No profit or revenue is guaranteed. Any participation requires discussion and a written agreement.

Subscribe to follow the development of Room13.

👉 https://youtu.be/pAMgsCMQ8Cw`;

const youtubeLink = 'https://www.youtube.com/watch?v=pAMgsCMQ8Cw';

async function publish1ClickYouTubeLinkCard() {
  console.log('===========================================================');
  console.log('🔗 PUBLISHING 1-CLICK YOUTUBE REDIRECT CARDS TO FACEBOOK');
  console.log('(Clicking anywhere on the picture opens YouTube immediately!)');
  console.log('===========================================================');

  const rawTokens = (process.env.META_USER_ACCESS_TOKEN || process.env.META_USER_ACCESS_TOKENS || '').split(',');
  const userTokens = rawTokens.map(t => t.trim().replace(/[\r\n]/g, '')).filter(t => t.length > 0);

  if (userTokens.length === 0) {
    console.error('CRITICAL: META_USER_ACCESS_TOKEN is missing in .env');
    return;
  }

  const pages = await getAllPagesGrouped(userTokens);
  console.log(`[Link Card Publisher] Discovered ${pages.length} Facebook Pages to publish to.`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    console.log(`\n[${i + 1}/${pages.length}] Publishing 1-Click Card to: ${page.name} (ID: ${page.id})...`);

    try {
      const res = await fetch(`https://graph.facebook.com/v20.0/${page.id}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: customCaption,
          link: youtubeLink,
          access_token: page.access_token
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      console.log(`✅ SUCCESS on ${page.name}! Post ID: ${data.id}`);
      successCount++;
    } catch (err) {
      console.error(`❌ FAILED on ${page.name}: ${err.message}`);
      failCount++;
    }

    if (i < pages.length - 1) {
      await sleep(5000);
    }
  }

  console.log('===========================================================');
  console.log(`🎉 1-CLICK LINK PUBLICATION FINISHED! Success: ${successCount}, Failed: ${failCount}`);
  console.log('===========================================================');
}

if (require.main === module) {
  publish1ClickYouTubeLinkCard().catch(console.error);
}

module.exports = { publish1ClickYouTubeLinkCard };
