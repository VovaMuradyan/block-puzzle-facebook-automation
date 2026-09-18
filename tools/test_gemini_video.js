/**
 * Test Google Gemini API Available Models & Video Generation Endpoints
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const geminiKeyPath = path.join(__dirname, '..', 'data', 'gemini_key.json');
const apiKey = JSON.parse(fs.readFileSync(geminiKeyPath, 'utf8')).GEMINI_API_KEY;

function listGeminiModels() {
  console.log('===========================================================');
  console.log('🔍 FETCHING ALL AVAILABLE MODELS FOR YOUR GEMINI API KEY...');
  console.log('===========================================================');

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1beta/models?key=${apiKey}`,
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const data = JSON.parse(body);
          console.log('✅ Available Models List:');
          const videoModels = data.models.filter(m => m.name.includes('veo') || m.name.includes('video') || m.name.includes('imagen'));
          console.log('\n--- Video / Media Models Found ---');
          console.log(videoModels.map(m => m.name));
          console.log('\n--- All Models ---');
          console.log(data.models.map(m => m.name));
        } catch (e) {
          console.error(e);
        }
      } else {
        console.error(`HTTP ${res.statusCode}: ${body}`);
      }
    });
  });

  req.on('error', console.error);
  req.end();
}

listGeminiModels();
