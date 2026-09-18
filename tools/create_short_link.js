const https = require('https');

function createTinyUrl(longUrl) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`;
    https.get(apiUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data.trim()));
    }).on('error', reject);
  });
}

async function generateShortLinks() {
  console.log('===========================================================');
  console.log('🚀 GENERATING SHORT & CLEAN BEAUTIFUL LINKS');
  console.log('===========================================================');

  const landingUrl = 'https://raw.githack.com/VovaMuradyan/block-puzzle-facebook-automation/main/index.html';
  const blockPuzzleUrl = 'https://play.google.com/store/apps/details?id=com.tetris.royale';
  const flappyEarnUrl = 'https://play.google.com/store/apps/details?id=com.vov.brainfit.brainfit';

  try {
    const shortLanding = await createTinyUrl(landingUrl);
    const shortBlock = await createTinyUrl(blockPuzzleUrl);
    const shortFlappy = await createTinyUrl(flappyEarnUrl);

    console.log(`✅ Clean Landing Page Short Link: ${shortLanding}`);
    console.log(`✅ Clean Block Puzzle Google Play Link: ${shortBlock}`);
    console.log(`✅ Clean Flappy Earn Google Play Link: ${shortFlappy}`);
  } catch (err) {
    console.error('Error generating short link:', err.message);
  }
}

generateShortLinks().catch(console.error);
