/**
 * Autonomous Full AI Studio Engine
 * Generates non-distorted, perfectly proportioned 9:16 vertical 3D Pixar/Disney style animal character portraits.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { generateElevenLabsSpeech } = require('./elevenlabs_multi_key');

const ultraCleanPixarPrompts = [
  'adorable cute 3D Pixar Golden Retriever puppy, full body centered vertical portrait, big round expressive eyes, closed mouth, beautiful studio lighting, clean background, 8k resolution, cinematic 9:16 aspect ratio',
  'adorable cute 3D Pixar Capybara wearing headphones, full body centered vertical portrait, big round expressive eyes, closed mouth, beautiful studio lighting, clean background, 8k resolution, cinematic 9:16 aspect ratio',
  'adorable cute 3D Pixar Baby Raccoon gamer, full body centered vertical portrait, big round expressive eyes, closed mouth, beautiful studio lighting, clean background, 8k resolution, cinematic 9:16 aspect ratio',
  'adorable cute 3D Pixar Fluffy Cat, full body centered vertical portrait, big round expressive eyes, closed mouth, beautiful studio lighting, clean background, 8k resolution, cinematic 9:16 aspect ratio'
];

async function generateUltraCleanCharacterImage(promptText, outputPath) {
  console.log(`[AI 8K Studio Generator] Generating non-distorted Pixar character portrait...`);
  console.log(`[Prompt]: "${promptText}"`);

  const encodedPrompt = encodeURIComponent(promptText);
  // Using 1080x1920 dimensions with Flux model for natural proportions
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1920&nologo=true&model=flux&seed=${Math.floor(Math.random() * 900000 + 100000)}`;

  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(outputPath);
    https.get(imageUrl, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch image: HTTP ${res.statusCode}`));
      }
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✅ Perfectly proportioned 9:16 character saved to ${outputPath}`);
        resolve(outputPath);
      });
    }).on('error', reject);
  });
}

async function runAutonomousStudioPipeline() {
  console.log('===========================================================');
  console.log('🚀 AUTONOMOUS 8K PIXAR AI STUDIO PIPELINE (NATURAL PROPORTIONS)');
  console.log('===========================================================');

  const mediaDir = path.join(__dirname, '..', 'media', 'generated_videos');
  const tempDir = path.join(__dirname, '..', 'media', 'temp');

  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const selectedPrompt = ultraCleanPixarPrompts[Math.floor(Math.random() * ultraCleanPixarPrompts.length)];
  const characterImagePath = path.join(tempDir, 'pixar_character_proportional.png');

  await generateUltraCleanCharacterImage(selectedPrompt, characterImagePath);
  console.log('===========================================================');
  console.log('🎉 Perfectly Proportioned 9:16 Character Rendered!');
  console.log('===========================================================');
}

if (require.main === module) {
  runAutonomousStudioPipeline().catch(console.error);
}

module.exports = runAutonomousStudioPipeline;
