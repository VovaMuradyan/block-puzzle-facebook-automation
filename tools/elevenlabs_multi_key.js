/**
 * ElevenLabs Multi-Key Quota Rotation & Failover Engine
 * Automatically rotates across multiple ElevenLabs API keys to generate ultra-realistic human/animal AI voices with 0 downtime.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const keysFilePath = path.join(__dirname, '..', 'data', 'elevenlabs_keys.json');

function getApiKeys() {
  if (fs.existsSync(keysFilePath)) {
    try {
      const keys = JSON.parse(fs.readFileSync(keysFilePath, 'utf8'));
      if (Array.isArray(keys) && keys.length > 0) return keys;
    } catch (e) {}
  }

  const envKeys = (process.env.ELEVENLABS_API_KEYS || process.env.ELEVENLABS_API_KEY || '').split(',');
  return envKeys.map(k => k.trim()).filter(k => k.length > 0);
}

// Default ElevenLabs Animal/Character Voice IDs
const ELEVENLABS_VOICES = {
  cute_animal: '21m00Tcm4TlvDq8ikWAM', // Rachel / Cute energetic
  funny_pet: 'AZnzlk1XvdvUeBnXmlld',   // Domi / Playful
  deep_chill: 'EXAVITQu4vr4xnSDxMaL'    // Bella / Relaxed Capybara
};

async function generateElevenLabsSpeech(text, voiceId = ELEVENLABS_VOICES.cute_animal, outputFileName = 'speech.mp3') {
  const apiKeys = getApiKeys();
  if (apiKeys.length === 0) {
    console.error('❌ Error: No ElevenLabs API keys provided in data/elevenlabs_keys.json!');
    return null;
  }

  console.log('===========================================================');
  console.log(`🎙️ ELEVENLABS MULTI-KEY AI VOICE GENERATOR (${apiKeys.length} Keys Pool Active)`);
  console.log('===========================================================');
  console.log(`[Input Text]: "${text}"`);

  const outputDir = path.join(__dirname, '..', 'media', 'audio');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, outputFileName);

  for (let i = 0; i < apiKeys.length; i++) {
    const currentKey = apiKeys[i];
    console.log(`[ElevenLabs Pool] Trying API Key ${i + 1}/${apiKeys.length} (${currentKey.substring(0, 8)}...)...`);

    try {
      const success = await callElevenLabsApi(text, voiceId, currentKey, outputPath);
      if (success) {
        console.log(`✅ Ultra-realistic speech generated using Key ${i + 1}! Output: ${outputPath}`);
        return outputPath;
      }
    } catch (err) {
      console.warn(`⚠️ Key ${i + 1} quota exceeded or failed: ${err.message}. Rotating to next API key...`);
    }
  }

  console.error('❌ All ElevenLabs API keys exhausted or failed!');
  return null;
}

function callElevenLabsApi(text, voiceId, apiKey, outputPath) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8
      }
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      port: 443,
      path: `/v1/text-to-speech/${voiceId}`,
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP Status ${res.statusCode}`));
      }

      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(true);
      });
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

if (require.main === module) {
  generateElevenLabsSpeech("Capybara playing Flappy Earn! Tap to fly and beat my score!").catch(console.error);
}

module.exports = { generateElevenLabsSpeech, ELEVENLABS_VOICES };
