/**
 * Custom Facebook Publisher for Room13 Indie Horror Game
 * Publishes the photo post with the exact description and YouTube link across Facebook Pages
 */
const fs = require('fs');
const path = require('path');
const { getAllPagesGrouped, publishPhotoPost, sleep } = require('../src/facebook');

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

const customCaption = `🎮 Room13 is an indie third-person horror game set in a mysterious old hotel.

In this video, I’m showing early gameplay, movement, camera, doors, rooms, and the atmosphere of the Room13 hotel.

The game is still in development, so you may see work-in-progress features and improvements.

Want to support Room13 or discuss possible investment / revenue-share participation?
You can find the interest form link in my channel profile or in the pinned comment.

Important: this is only an expression of interest. No profit or revenue is guaranteed. Any participation requires discussion and a written agreement.

Subscribe to follow the development of Room13.

🎬 Watch full gameplay video on YouTube:
https://youtu.be/zOwLtcDn7io`;

async function publishRoom13ToFacebook() {
  console.log('===========================================================');
  console.log('🎮 PUBLISHING ROOM13 INDIE HORROR GAME POST TO FACEBOOK');
  console.log('===========================================================');

  const rawTokens = (process.env.META_USER_ACCESS_TOKEN || process.env.META_USER_ACCESS_TOKENS || '').split(',');
  const userTokens = rawTokens.map(t => t.trim().replace(/[\r\n]/g, '')).filter(t => t.length > 0);

  if (userTokens.length === 0) {
    console.error('CRITICAL: META_USER_ACCESS_TOKEN is missing in .env');
    return;
  }

  const pages = await getAllPagesGrouped(userTokens);
  console.log(`[Room13 Publisher] Discovered ${pages.length} Facebook Pages to publish to.`);

  const photoPath = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2\\.user_uploaded\\media_1788037844054.jpg';

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    console.log(`\n[${i + 1}/${pages.length}] Publishing to: ${page.name} (ID: ${page.id})...`);

    try {
      let postId;
      if (fs.existsSync(photoPath)) {
        postId = await publishPhotoPost(page.id, page.access_token, photoPath, customCaption);
      } else {
        // Feed post fallback
        const res = await fetch(`https://graph.facebook.com/v20.0/${page.id}/feed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: customCaption,
            link: 'https://youtu.be/zOwLtcDn7io',
            access_token: page.access_token
          })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        postId = data.id;
      }

      console.log(`✅ SUCCESS on ${page.name}! Post ID: ${postId}`);
      successCount++;
    } catch (err) {
      console.error(`❌ FAILED on ${page.name}: ${err.message}`);
      failCount++;
    }

    // Stagger delay between pages
    if (i < pages.length - 1) {
      await sleep(6000);
    }
  }

  console.log('===========================================================');
  console.log(`🎉 ROOM13 PUBLICATION COMPLETE! Success: ${successCount}, Failed: ${failCount}`);
  console.log('===========================================================');
}

if (require.main === module) {
  publishRoom13ToFacebook().catch(console.error);
}

module.exports = { publishRoom13ToFacebook };
