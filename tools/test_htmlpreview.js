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

async function runHtmlPreviewTest() {
  console.log('===========================================================');
  console.log('🚀 TESTING HTMLPREVIEW.GITHUB.IO (ZERO-WARNING DIRECT RENDER)');
  console.log('===========================================================');

  const previewUrl = 'https://htmlpreview.github.io/?https://github.com/VovaMuradyan/block-puzzle-facebook-automation/blob/main/index.html';
  
  const clckLink = await createClckUrl(previewUrl);
  console.log(`✅ DIRECT INSTANT VISUAL WEBSITE LINK: ${clckLink}`);
}

runHtmlPreviewTest().catch(console.error);
