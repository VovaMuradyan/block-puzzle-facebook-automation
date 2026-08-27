/**
 * ElevenLabs Multi-Key Quota Rotation & Failover Engine
 * Optimized for Free Tier ElevenLabs API keys (uses default free voice IDs: George, Jessica, Sarah, Bella)
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const keysFilePath = path.join(__dirname, '..', 'data', 'elevenlabs_keys.json');

// Free Tier Allowed Default ElevenLabs Voice IDs
const FREE_TIER_VOICES = [
  'JBFqnCBsd6RMkjVDRZzb', // George (Energetic)
  'cgSgspJ2msm6clMCkdW9', // Jessica (Playful)
  'N2l7h801s3EPuhvG1Bke', // Sarah (Upbeat)
  'XB0fDUnXU5powxnDhCwa'  // Charlotte (Cute)
];

function getApiKeys() {
  if (fs.existsSync(keysFilePath)) {
    try {
      const keys = JSON.parse(fs.readFileSync(keysFilePath, 'utf8'));
      if (Array.isArray(keys) && keys.length > 0) return keys;
    } catch (e) {}
  }
  return [];
}

function callTextToSpeech(text, voiceId, apiKey, outputPath) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
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
      let responseBody = '';
      if (res.statusCode !== 200) {
        res.on('data', d => responseBody += d);
        res.on('end', () => {
          reject(new Error(`HTTP ${res.statusCode}: ${responseBody}`));
        });
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(true);
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function testElevenLabsSpeechPool() {
  const keys = getApiKeys();
  const sampleText = "Capybara playing Flappy Earn! Tap to fly and beat my high score!";
  const outputDir = path.join(__dirname, '..', 'media', 'audio');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'test_elevenlabs_voice.mp3');
  const targetVoice = FREE_TIER_VOICES[0]; // George / Jessica

  console.log('===========================================================');
  console.log(`🎙️ TESTING ELEVENLABS SPEECH SYNTHESIS (${keys.length} Keys Pool)`);
  console.log('===========================================================');
  console.log(`Text: "${sampleText}"`);
  console.log(`Voice ID: ${targetVoice}`);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    console.log(`\n[ElevenLabs Pool] Trying API Key ${i + 1}/${keys.length} (${key.substring(0, 10)}...)...`);
    try {
      await callTextToSpeech(sampleText, targetVoice, key, outputPath);
      console.log(`🎉 SUCCESS! Ultra-realistic MP3 generated with Key ${i + 1}!`);
      console.log(`Saved audio file: ${outputPath}`);
      return outputPath;
    } catch (err) {
      console.error(`❌ Key ${i + 1} failed: ${err.message}`);
    }
  }

  console.error('\n❌ All ElevenLabs API keys failed.');
}

if (require.main === module) {
  testElevenLabsSpeechPool().catch(console.error);
}

module.exports = { testElevenLabsSpeechPool, getApiKeys, FREE_TIER_VOICES };
