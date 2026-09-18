/**
 * Direct Test of Veo generateContent endpoint
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const geminiKeyPath = path.join(__dirname, '..', 'data', 'gemini_key.json');
const apiKey = JSON.parse(fs.readFileSync(geminiKeyPath, 'utf8')).GEMINI_API_KEY;

function testVeoGenerateContent(modelName = 'veo-3.1-fast-generate-preview') {
  console.log(`===========================================================`);
  console.log(`🎬 TESTING VEO GENERATECONTENT MODEL: ${modelName}`);
  console.log(`===========================================================`);

  const postData = JSON.stringify({
    contents: [
      {
        parts: [
          { text: "A cute 3D Pixar Capybara driving a red toy car, 9:16 vertical video" }
        ]
      }
    ]
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`HTTP Status: ${res.statusCode}`);
        console.log(`Response: ${body.substring(0, 1500)}`);
        if (res.statusCode === 200) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

testVeoGenerateContent('veo-3.1-fast-generate-preview').catch(() => {
  testVeoGenerateContent('veo-3.1-generate-preview').catch(console.error);
});
