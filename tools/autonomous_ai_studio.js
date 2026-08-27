/**
 * Autonomous Full AI Studio Engine
 * Generates ultra-high quality 8K Pixar/Disney style centered animal character portraits with 100% clean aesthetics and closed mouth.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { generateElevenLabsSpeech } = require('./elevenlabs_multi_key');

const ultraCleanPixarPrompts = [
  'photorealistic cute 3D Pixar animated Capybara character, adorable big round eyes, centered front portrait, closed mouth, 8k render, Disney style, soft studio lighting, clean background',
  'photorealistic cute 3D Pixar animated Baby Raccoon character, adorable big round eyes, centered front portrait, closed mouth, 8k render, Disney style, soft studio lighting, clean background',
  'photorealistic cute 3D Pixar animated Fluffy Cat character, adorable big round eyes, centered front portrait, closed mouth, 8k render, Disney style, soft studio lighting, clean background',
  'photorealistic cute 3D Pixar animated Golden Retriever Puppy character, adorable big round eyes, centered front portrait, closed mouth, 8k render, Disney style, soft studio lighting, clean background',
  'photorealistic cute 3D Pixar animated Sea Otter character, adorable big round eyes, centered front portrait, closed mouth, 8k render, Disney style, soft studio lighting, clean background'
];

async function generateUltraCleanCharacterImage(promptText, outputPath) {
  console.log(`[AI 8K Studio Generator] Generating ultra-clean Pixar character portrait...`);
  console.log(`[Prompt]: "${promptText}"`);

  const encodedPrompt = encodeURIComponent(promptText);
  // Using model=flux for ultra high aesthetic quality
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=720&height=1280&nologo=true&model=flux&seed=${Math.floor(Math.random() * 900000 + 100000)}`;

  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(outputPath);
    https.get(imageUrl, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch image: HTTP ${res.statusCode}`));
      }
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✅ Ultra-clean 8K Pixar character saved to ${outputPath}`);
        resolve(outputPath);
      });
    }).on('error', reject);
  });
}

async function runAutonomousStudioPipeline() {
  console.log('===========================================================');
  console.log('🚀 AUTONOMOUS 8K PIXAR AI STUDIO PIPELINE');
  console.log('===========================================================');

  const mediaDir = path.join(__dirname, '..', 'media', 'generated_videos');
  const tempDir = path.join(__dirname, '..', 'media', 'temp');

  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const selectedPrompt = ultraCleanPixarPrompts[Math.floor(Math.random() * ultraCleanPixarPrompts.length)];
  const characterImagePath = path.join(tempDir, 'pixar_character.png');

  await generateUltraCleanCharacterImage(selectedPrompt, characterImagePath);
  console.log('===========================================================');
  console.log('🎉 8K Pixar Character Rendered Successfully!');
  console.log('===========================================================');
}

if (require.main === module) {
  runAutonomousStudioPipeline().catch(console.error);
}

module.exports = runAutonomousStudioPipeline;
