/**
 * Targeted Google AI Studio Veo Payload Field Scanner
 * Tests field names on /v1beta/models/veo-3.1-fast-generate-preview:predict
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const geminiKeyPath = path.join(__dirname, '..', 'data', 'gemini_key.json');
const apiKey = JSON.parse(fs.readFileSync(geminiKeyPath, 'utf8')).GEMINI_API_KEY;

const targetUrl = `/v1beta/models/veo-3.1-fast-generate-preview:predict?key=${apiKey}`;

const testPayloads = [
  { instances: [{ text: "A cute 3D Pixar Capybara driving a toy car" }] },
  { instances: [{ input_text: "A cute 3D Pixar Capybara driving a toy car" }] },
  { instances: [{ content: "A cute 3D Pixar Capybara driving a toy car" }] },
  { instances: [{ caption: "A cute 3D Pixar Capybara driving a toy car" }] },
  { instances: [{ text_prompt: "A cute 3D Pixar Capybara driving a toy car" }] },
  { instances: ["A cute 3D Pixar Capybara driving a toy car"] },
  { requests: [{ prompt: "A cute 3D Pixar Capybara driving a toy car" }] },
  { prompt_text: "A cute 3D Pixar Capybara driving a toy car" },
  { gcs_uri: "gs://test" }
];

function testPayload(payload, index) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(payload);

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: targetUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`\n[Payload #${index + 1}] HTTP ${res.statusCode}:`);
        console.log(body.substring(0, 400));
        if (res.statusCode === 200) {
          console.log('\n🎉 SUCCESS! MATCHING VEO PAYLOAD FOUND!');
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

    req.on('error', () => resolve(false));
    req.write(postData);
    req.end();
  });
}

async function runFieldScan() {
  console.log('===========================================================');
  console.log('🔍 TESTING VEO PAYLOAD FIELD NAMES...');
  console.log('===========================================================');

  for (let i = 0; i < testPayloads.length; i++) {
    const matched = await testPayload(testPayloads[i], i);
    if (matched) return;
  }
}

runFieldScan();
