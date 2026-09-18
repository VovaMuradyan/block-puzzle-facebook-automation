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

function testHeader(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.headers['content-type']);
    }).on('error', () => resolve(null));
  });
}

async function runRenderTest() {
  console.log('===========================================================');
  console.log('🚀 TESTING REAL VISUAL HTML RENDERING HOSTS');
  console.log('===========================================================');

  const githackUrl = 'https://raw.githack.com/VovaMuradyan/block-puzzle-facebook-automation/main/index.html';
  
  const type = await testHeader(githackUrl);
  console.log(`GitHack Content-Type: ${type}`);

  const clckLink = await createClckUrl(githackUrl);
  console.log(`\n✅ REAL VISUAL WEBSITE SHORT LINK: ${clckLink}`);
}

runRenderTest().catch(console.error);
