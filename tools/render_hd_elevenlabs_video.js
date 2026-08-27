/**
 * HD Animated Video + ElevenLabs Voiceover Engine
 * Uses original high-quality 3D animated videos (Capybara, Raccoon, Parrot, Dog, Cat, Otter)
 * and replaces the audio with brand new ultra-realistic ElevenLabs AI story scripts.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { generateElevenLabsSpeech } = require('./elevenlabs_multi_key');

const hdVideosQueue = [
  {
    character: 'Capybara',
    file: 'flappy_ad_capybara_2308.mp4',
    game: 'game2',
    script: "Did you know capybaras are so chill because they spend 80 percent of their day relaxing? But when I want real fun, I play Flappy Earn! Link in bio to download free!",
    outputName: 'hd_capybara_elevenlabs_final.mp4'
  },
  {
    character: 'Raccoon',
    file: 'flappy_ad_raccoon_2259.mp4',
    game: 'game2',
    script: "Raccoons don't actually wash their food because they like it clean, they do it to feel the texture! And when I want a real challenge, I try to beat level 100 in Flappy Earn!",
    outputName: 'hd_raccoon_elevenlabs_final.mp4'
  },
  {
    character: 'Parrot',
    file: 'flappy_ad_parrot_2258.mp4',
    game: 'game2',
    script: "Humans think parrots only repeat what they hear. But I actually repeat my favorite game! Flappy Earn is so addictive, tap to fly and beat my score!",
    outputName: 'hd_parrot_elevenlabs_final.mp4'
  }
];

async function renderHdVideoWithElevenLabsVoice(index = 0) {
  const item = hdVideosQueue[index % hdVideosQueue.length];
  const audioDir = path.join(__dirname, '..', 'media', 'audio');
  const mediaDir = path.join(__dirname, '..', 'media', 'generated_videos');
  const artifactsDir = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2';

  if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

  const sourceVideoPath = path.join(__dirname, '..', 'media', item.game, 'videos', item.file);
  const audioFileName = `elevenlabs_${item.character.toLowerCase()}_hd.mp3`;
  const outputVideoPath = path.join(mediaDir, item.outputName);
  const artifactVideoPath = path.join(artifactsDir, item.outputName);

  console.log('===========================================================');
  console.log(`🚀 RENDERING HD ANIMATED VIDEO + ELEVENLABS AI VOICE [${item.character.toUpperCase()}]`);
  console.log('===========================================================');
  console.log(`[Source Video]: ${item.file}`);
  console.log(`[New Script]: "${item.script}"`);

  // Step 1: Synthesize ultra-realistic ElevenLabs speech
  const audioPath = await generateElevenLabsSpeech(item.script, 'JBFqnCBsd6RMkjVDRZzb', audioFileName);

  // Step 2: Combine high-quality HD animated video with ElevenLabs voiceover
  const ffmpegExe = 'C:\\Users\\Vov\\AppData\\Local\\Microsoft\\WinGet\\Links\\ffmpeg.exe';
  console.log(`[FFmpeg Engine] Replacing audio track with ElevenLabs AI voice...`);

  const cmd = `"${ffmpegExe}" -y -i "${sourceVideoPath}" -i "${audioPath}" -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 "${outputVideoPath}"`;
  execSync(cmd, { stdio: 'inherit' });

  fs.copyFileSync(outputVideoPath, artifactVideoPath);
  console.log(`🎉 COMPLETED HD VIDEO WITH ELEVENLABS VOICE: ${artifactVideoPath}`);

  return artifactVideoPath;
}

if (require.main === module) {
  renderHdVideoWithElevenLabsVoice(0).catch(console.error);
}

module.exports = { renderHdVideoWithElevenLabsVoice, hdVideosQueue };
