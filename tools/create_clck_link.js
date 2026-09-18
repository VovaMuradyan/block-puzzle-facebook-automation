const https = require('https');

function createClckUrl(longUrl) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://clck.ru/--?url=${encodeURIComponent(longUrl)}`;
    https.get(apiUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data.trim()));
    }).on('error', reject);
  });
}

async function runClckShortener() {
  console.log('===========================================================');
  console.log('🚀 GENERATING INSTANT DIRECT YANDEX CLCK.RU LINKS');
  console.log('===========================================================');

  const flappyEarnUrl = 'https://play.google.com/store/apps/details?id=com.vov.brainfit.brainfit';
  const blockPuzzleUrl = 'https://play.google.com/store/apps/details?id=com.tetris.royale';

  try {
    const clckFlappy = await createClckUrl(flappyEarnUrl);
    const clckBlock = await createClckUrl(blockPuzzleUrl);

    console.log(`✅ DIRECT Instant Link (Flappy Earn): ${clckFlappy}`);
    console.log(`✅ DIRECT Instant Link (Block Puzzle): ${clckBlock}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

runClckShortener().catch(console.error);
