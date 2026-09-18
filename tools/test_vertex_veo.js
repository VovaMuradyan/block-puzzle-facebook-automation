/**
 * Test Google Cloud Vertex AI Veo 3.1 / Veo 2.0 Video Generation Endpoint
 * Project: projects/700759551770
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const geminiKeyPath = path.join(__dirname, '..', 'data', 'gemini_key.json');
const apiKey = JSON.parse(fs.readFileSync(geminiKeyPath, 'utf8')).GEMINI_API_KEY;

async function testVertexVeoEndpoint(modelId = 'veo-2.0-generate-001') {
  console.log(`[Vertex AI Veo Test] Model: ${modelId}...`);

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
    hostname: 'us-central1-aiplatform.googleapis.com',
    port: 443,
    path: `/v1/projects/700759551770/locations/us-central1/publishers/google/models/${modelId}:predict?key=${apiKey}`,
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
        console.log(`HTTP ${res.statusCode}: ${body.substring(0, 500)}`);
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

async function runTest() {
  const models = ['veo-2.0-generate-001', 'veo-001-preview', 'imagen-3.0-generate-001'];
  for (const m of models) {
    try {
      await testVertexVeoEndpoint(m);
      return;
    } catch (e) {}
  }
}

runTest();
