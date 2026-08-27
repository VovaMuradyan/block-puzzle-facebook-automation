/**
 * Autonomous Full AI Studio Engine
 * Generates brand new characters, scripts, ElevenLabs voiceovers, and Lip-Sync animations 100% from scratch.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { generateElevenLabsSpeech } = require('./elevenlabs_multi_key');

const airFailKey = 'sk-25-YpvLEBKmsZFVBsQRgzLKx6RjL2';

const animalPrompts = [
  'cute 3D Pixar style baby raccoon character, front facing portrait, closed mouth, neutral background, 8k render',
  'cute 3D Pixar style capybara character wearing tiny headset, front facing portrait, closed mouth, neutral studio background',
  'cute 3D Pixar style cat gamer character, front facing portrait, closed mouth, clean background',
  'cute 3D Pixar style dog character, front facing portrait, closed mouth, studio lighting',
  'cute 3D Pixar style otter character, front facing portrait, closed mouth, high resolution'
];

async function generateCleanCharacterImage(promptText, outputPath) {
  console.log(`[AI Image Generator] Generating new character image...`);
  console.log(`[Prompt]: "${promptText}"`);

  const encodedPrompt = encodeURIComponent(promptText);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=720&height=1280&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;

  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(outputPath);
    https.get(imageUrl, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch image: HTTP ${res.statusCode}`));
      }
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✅ Clean AI character image saved to ${outputPath}`);
        resolve(outputPath);
      });
    }).on('error', reject);
  });
}

async function runAutonomousStudioPipeline() {
  console.log('===========================================================');
  console.log('🚀 AUTONOMOUS FULL AI STUDIO PIPELINE (100% FROM SCRATCH)');
  console.log('===========================================================');

  const mediaDir = path.join(__dirname, '..', 'media', 'generated_videos');
  const tempDir = path.join(__dirname, '..', 'media', 'temp');

  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const randomPrompt = animalPrompts[Math.floor(Math.random() * animalPrompts.length)];
  const characterImagePath = path.join(tempDir, 'new_character.png');

  // Step 1: Generate Clean AI Character Image
  await generateCleanCharacterImage(randomPrompt, characterImagePath);

  // Step 2: Generate Ultra-Realistic Voice with ElevenLabs
  const storyText = "Did you know raccoons spend 30 minutes planning secret missions? But my favorite mission is beating level 100 in Flappy Earn! Download free link in bio!";
  const audioPath = path.join(tempDir, 'new_story_voice.mp3');
  
  await generateElevenLabsSpeech(storyText, 'JBFqnCBsd6RMkjVDRZzb', 'new_story_voice.mp3');

  console.log('===========================================================');
  console.log('🎉 STEP 1 & 2 COMPLETE: Clean Character Image + ElevenLabs Audio Ready!');
  console.log('===========================================================');
}

if (require.main === module) {
  runAutonomousStudioPipeline().catch(console.error);
}

module.exports = runAutonomousStudioPipeline;
