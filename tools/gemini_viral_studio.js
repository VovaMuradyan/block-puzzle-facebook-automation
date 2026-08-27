/**
 * Google Gemini API Engine for Automated Shorts Video Ideas & Script Generation
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const geminiKeyPath = path.join(__dirname, '..', 'data', 'gemini_key.json');

function getGeminiKey() {
  if (fs.existsSync(geminiKeyPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(geminiKeyPath, 'utf8'));
      return data.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    } catch (e) {}
  }
  return process.env.GEMINI_API_KEY || '';
}

async function testGeminiModels(modelName = 'gemini-3.6-flash') {
  const apiKey = getGeminiKey();
  console.log(`[Google Gemini AI] Testing model: ${modelName}...`);

  const postData = JSON.stringify({
    contents: [
      {
        parts: [
          {
            text: `You are a viral TikTok and YouTube Shorts producer. Generate 1 completely NEW viral 15-second video idea about a cute animal character with a funny plot twist, ending with a call to action for the mobile game 'Flappy Earn'!`
          }
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
            const response = JSON.parse(body);
            const generatedText = response.candidates?.[0]?.content?.parts?.[0]?.text;
            console.log(`\n🎉 SUCCESS! GEMINI AI GENERATED NEW SHORTS SCRIPT:\n`);
            console.log(generatedText);
            resolve(generatedText);
          } catch (e) {
            reject(e);
          }
        } else {
          console.error(`HTTP ${res.statusCode}: ${body.substring(0, 300)}`);
          reject(new Error(`HTTP Status ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

if (require.main === module) {
  testGeminiModels('gemini-3.6-flash').catch(console.error);
}

module.exports = { testGeminiModels };
