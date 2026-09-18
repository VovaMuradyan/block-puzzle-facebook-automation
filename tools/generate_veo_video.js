/**
 * Google Veo 3.1 AI Video Generator Engine
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const geminiKeyPath = path.join(__dirname, '..', 'data', 'gemini_key.json');
const apiKey = JSON.parse(fs.readFileSync(geminiKeyPath, 'utf8')).GEMINI_API_KEY;

async function testVeoPredictFormat() {
  console.log('===========================================================');
  console.log('🎬 TESTING GOOGLE VEO 3.1 VIDEO GENERATION PREDICT ENDPOINT');
  console.log('===========================================================');

  const postData = JSON.stringify({
    instances: [
      {
        prompt: "A cute 3D Pixar Capybara character driving a red toy car, 9:16 vertical video"
      }
    ],
    parameters: {
      sampleCount: 1,
      aspectRatio: "9:16"
    }
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1beta/models/veo-3.1-fast-generate-preview:predict?key=${apiKey}`,
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
        console.log(`Response: ${body.substring(0, 1000)}`);
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

testVeoPredictFormat().catch(console.error);
