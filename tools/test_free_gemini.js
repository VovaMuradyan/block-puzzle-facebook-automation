const fs = require('fs');
const path = require('path');
const https = require('https');

const geminiKeyPath = path.join(__dirname, '..', 'data', 'gemini_key.json');
const apiKey = JSON.parse(fs.readFileSync(geminiKeyPath, 'utf8')).GEMINI_API_KEY;

async function testFreeGeminiModel(modelName) {
  console.log(`[Google AI Studio Free Tier] Testing model: ${modelName}...`);

  const postData = JSON.stringify({
    contents: [
      {
        parts: [
          { text: "Generate 1 short funny joke about a capybara playing a mobile game." }
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
        if (res.statusCode === 200) {
          try {
            const data = JSON.parse(body);
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            console.log(`🎉 SUCCESS! Model ${modelName} returned:\n${text}`);
            resolve(text);
          } catch (e) { reject(e); }
        } else {
          console.log(`HTTP ${res.statusCode}: ${body.substring(0, 300)}`);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runFreeTest() {
  const freeModels = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-pro'];
  for (const m of freeModels) {
    try {
      await testFreeGeminiModel(m);
      return;
    } catch (e) {}
  }
}

runFreeTest();
