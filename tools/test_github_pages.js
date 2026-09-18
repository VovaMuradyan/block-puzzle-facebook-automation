const https = require('https');

function testUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ statusCode: res.statusCode, headers: res.headers });
    }).on('error', (err) => resolve({ error: err.message }));
  });
}

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

async function runGhPagesTest() {
  const ghPagesUrl = 'https://vovamuradyan.github.io/block-puzzle-facebook-automation/index.html';
  const res = await testUrl(ghPagesUrl);
  console.log('GitHub Pages Status Code:', res.statusCode);
  
  if (res.statusCode === 200) {
    const cleanLink = await createClckUrl(ghPagesUrl);
    console.log(`✅ GitHub Pages Direct Link: ${cleanLink}`);
  }
}

runGhPagesTest().catch(console.error);
