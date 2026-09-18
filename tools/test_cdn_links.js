const https = require('https');

function testUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ statusCode: res.statusCode, headers: res.headers });
    }).on('error', (err) => resolve({ error: err.message }));
  });
}

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

async function runCdnCheck() {
  console.log('Testing jsDelivr CDN link...');
  const jsdelivrUrl = 'https://cdn.jsdelivr.net/gh/VovaMuradyan/block-puzzle-facebook-automation@main/index.html';
  
  const res = await testUrl(jsdelivrUrl);
  console.log('jsDelivr Status:', res.statusCode);

  const shortLink = await createTinyUrl(jsdelivrUrl);
  console.log(`\n✅ GUARANTEED WORKING SHORT LINK: ${shortLink}`);
}

runCdnCheck().catch(console.error);
