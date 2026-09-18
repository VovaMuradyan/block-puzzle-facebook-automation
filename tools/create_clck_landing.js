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

async function runDualGameShortener() {
  console.log('===========================================================');
  console.log('🚀 GENERATING INSTANT DUAL-GAME LANDING SHORT LINK VIA CLCK.RU');
  console.log('===========================================================');

  const dualGameLandingUrl = 'https://cdn.jsdelivr.net/gh/VovaMuradyan/block-puzzle-facebook-automation@main/index.html';

  try {
    const clckDualLink = await createClckUrl(dualGameLandingUrl);
    console.log(`✅ INSTANT DUAL-GAME SHORT LINK (Both Games): ${clckDualLink}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

runDualGameShortener().catch(console.error);
