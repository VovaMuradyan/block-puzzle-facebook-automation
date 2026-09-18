const https = require('https');

function createIsGdUrl(longUrl) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://is.gd/create.php?format=simple&url=${encodeURIComponent(longUrl)}`;
    https.get(apiUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data.trim()));
    }).on('error', reject);
  });
}

async function runIsGdShortener() {
  console.log('===========================================================');
  console.log('🚀 GENERATING INSTANT DIRECT 1-CLICK IS.GD LINKS');
  console.log('===========================================================');

  const flappyEarnUrl = 'https://play.google.com/store/apps/details?id=com.vov.brainfit.brainfit';
  const blockPuzzleUrl = 'https://play.google.com/store/apps/details?id=com.tetris.royale';

  try {
    const isGdFlappy = await createIsGdUrl(flappyEarnUrl);
    const isGdBlock = await createIsGdUrl(blockPuzzleUrl);

    console.log(`✅ DIRECT Instant Link (Flappy Earn Google Play): ${isGdFlappy}`);
    console.log(`✅ DIRECT Instant Link (Block Puzzle Google Play): ${isGdBlock}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

runIsGdShortener().catch(console.error);
