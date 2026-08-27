/**
 * Autonomous Full AI Studio Engine
 * Generates wide, chubby, round 1:1 Pixar animal portraits composited on a 9:16 vertical canvas for 100% natural un-squeezed character proportions.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const wideChubbyPixarPrompts = [
  'super cute chubby 3D Pixar Golden Retriever puppy, wide round face, chubby cheeks, big adorable eyes, close-up centered portrait, closed mouth, 1024x1024 square, Disney Pixar style, soft studio lighting',
  'super cute chubby 3D Pixar Capybara wearing headphones, wide round face, chubby cheeks, big adorable eyes, close-up centered portrait, closed mouth, 1024x1024 square, Disney Pixar style, soft studio lighting',
  'super cute chubby 3D Pixar Baby Raccoon gamer, wide round face, chubby cheeks, big adorable eyes, close-up centered portrait, closed mouth, 1024x1024 square, Disney Pixar style, soft studio lighting',
  'super cute chubby 3D Pixar Fluffy Kitten, wide round face, chubby cheeks, big adorable eyes, close-up centered portrait, closed mouth, 1024x1024 square, Disney Pixar style, soft studio lighting'
];

async function generateSquareChubbyCharacter(promptText, outputPath) {
  console.log(`[AI 1:1 Studio Generator] Generating wide chubby Pixar character (1024x1024)...`);
  console.log(`[Prompt]: "${promptText}"`);

  const encodedPrompt = encodeURIComponent(promptText);
  // Generating 1024x1024 square character image
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&model=flux&seed=${Math.floor(Math.random() * 900000 + 100000)}`;

  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(outputPath);
    https.get(imageUrl, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch image: HTTP ${res.statusCode}`));
      }
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✅ Wide chubby 1:1 character saved to ${outputPath}`);
        resolve(outputPath);
      });
    }).on('error', reject);
  });
}

function compositeIntoVerticalCanvas(squareImagePath, finalOutputPath) {
  const ffmpegExe = 'C:\\Users\\Vov\\AppData\\Local\\Microsoft\\WinGet\\Links\\ffmpeg.exe';
  
  console.log('[FFmpeg Composer] Compositing square chubby character into 9:16 vertical canvas (1080x1920)...');
  // Scale background to fill 1080x1920 and blur it, overlay sharp 1:1 character in center
  const filter = `[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=30[bg];[0:v]scale=1000:1000[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2`;

  const cmd = `"${ffmpegExe}" -y -i "${squareImagePath}" -filter_complex "${filter}" -vframes 1 "${finalOutputPath}"`;
  execSync(cmd, { stdio: 'inherit' });
  console.log(`🎉 Final 9:16 composite saved to ${finalOutputPath}`);
}

async function runAutonomousStudioPipeline() {
  console.log('===========================================================');
  console.log('🚀 AUTONOMOUS CHUBBY PIXAR CHARACTER ENGINE (0% DISTORTION)');
  console.log('===========================================================');

  const mediaDir = path.join(__dirname, '..', 'media', 'generated_videos');
  const tempDir = path.join(__dirname, '..', 'media', 'temp');

  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const selectedPrompt = wideChubbyPixarPrompts[Math.floor(Math.random() * wideChubbyPixarPrompts.length)];
  const squareImagePath = path.join(tempDir, 'square_chubby_character.png');
  const finalCanvasPath = path.join(tempDir, 'perfect_9x16_chubby_character.png');

  await generateSquareChubbyCharacter(selectedPrompt, squareImagePath);
  compositeIntoVerticalCanvas(squareImagePath, finalCanvasPath);
}

if (require.main === module) {
  runAutonomousStudioPipeline().catch(console.error);
}

module.exports = runAutonomousStudioPipeline;
