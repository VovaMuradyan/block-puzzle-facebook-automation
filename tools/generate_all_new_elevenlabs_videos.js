/**
 * Generate Brand New Videos with New Characters, New Scripts, and New ElevenLabs AI Voiceovers
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const keysFilePath = path.join(__dirname, '..', 'data', 'elevenlabs_keys.json');
const keys = JSON.parse(fs.readFileSync(keysFilePath, 'utf8'));

const newStorylines = [
  {
    character: 'Raccoon',
    file: 'flappy_ad_raccoon_2259.mp4',
    game: 'game2',
    script: "Did you know raccoons spend 30 minutes a day planning secret missions? But my favorite mission is beating level 100 in Flappy Earn! Download free link in bio!",
    audioName: 'story_raccoon.mp3',
    videoName: 'new_raccoon_story_elevenlabs.mp4'
  },
  {
    character: 'Parrot',
    file: 'flappy_ad_parrot_2258.mp4',
    game: 'game2',
    script: "Humans think parrots only repeat what they hear. But I actually repeat my favorite game! Flappy Earn is so addictive, tap to fly and beat my score!",
    audioName: 'story_parrot.mp3',
    videoName: 'new_parrot_story_elevenlabs.mp4'
  },
  {
    character: 'Otter',
    file: 'flappy_ad_otter_2310.mp4',
    game: 'game2',
    script: "Only 1% of players can clear 6 block lines in a row without making a single mistake. Think you have high IQ? Prove it in Block Royale!",
    audioName: 'story_otter.mp3',
    videoName: 'new_otter_story_elevenlabs.mp4'
  }
];

function generateElevenLabsAudio(text, apiKey, outputPath) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.45, similarity_boost: 0.8 }
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      port: 443,
      path: '/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb',
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
        let err = '';
        res.on('data', d => err += d);
        res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${err}`)));
        return;
      }
      const stream = fs.createWriteStream(outputPath);
      res.pipe(stream);
      stream.on('finish', () => { stream.close(); resolve(true); });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function buildAllNewVideos() {
  console.log('===========================================================');
  console.log('🚀 GENERATING 3 BRAND NEW CHARACTER VIDEOS WITH ELEVENLABS VOICE');
  console.log('===========================================================');

  const audioDir = path.join(__dirname, '..', 'media', 'audio');
  const generatedDir = path.join(__dirname, '..', 'media', 'generated_videos');
  const artifactsDir = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2';

  if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
  if (!fs.existsSync(generatedDir)) fs.mkdirSync(generatedDir, { recursive: true });

  const ffmpegExe = 'C:\\Users\\Vov\\AppData\\Local\\Microsoft\\WinGet\\Links\\ffmpeg.exe';

  for (let i = 0; i < newStorylines.length; i++) {
    const item = newStorylines[i];
    const apiKey = keys[i % keys.length];
    const audioPath = path.join(audioDir, item.audioName);
    const sourceVideoPath = path.join(__dirname, '..', 'media', item.game, 'videos', item.file);
    const outputVideoPath = path.join(generatedDir, item.videoName);
    const artifactVideoPath = path.join(artifactsDir, item.videoName);

    console.log(`\n[${i + 1}/3] Character: ${item.character} | Script: "${item.script}"`);
    console.log(`[ElevenLabs] Synthesizing speech with API Key #${(i % keys.length) + 1}...`);
    
    await generateElevenLabsAudio(item.script, apiKey, audioPath);
    console.log(`✅ ElevenLabs Audio generated: ${audioPath}`);

    console.log(`[FFmpeg] Rendering final video with ElevenLabs voice: ${item.videoName}...`);
    const cmd = `"${ffmpegExe}" -y -i "${sourceVideoPath}" -i "${audioPath}" -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 "${outputVideoPath}"`;
    execSync(cmd, { stdio: 'inherit' });

    // Copy to artifacts for playback
    fs.copyFileSync(outputVideoPath, artifactVideoPath);
    console.log(`🎉 COMPLETED & SAVED: ${artifactVideoPath}`);
  }

  console.log('\n===========================================================');
  console.log('🎉 ALL 3 BRAND NEW CHARACTER VIDEOS GENERATED SUCCESSFULLY!');
  console.log('===========================================================');
}

if (require.main === module) {
  buildAllNewVideos().catch(console.error);
}

module.exports = buildAllNewVideos;
