/**
 * Isolated Automated Studio Engine (Reliable Multi-Engine Downloader)
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const { generateElevenLabsSpeech } = require('./elevenlabs_multi_key');

async function renderBrandNewVideo() {
  console.log('===========================================================');
  console.log('🚀 ISOLATED AI STUDIO - CREATING BRAND NEW SHORTS VIDEO');
  console.log('===========================================================');

  const mediaDir = path.join(__dirname, '..', 'media', 'generated_videos');
  const tempDir = path.join(__dirname, '..', 'media', 'temp');
  const artifactsDir = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2';

  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const timestamp = Date.now();
  const characterImgPath = path.join(tempDir, `new_pixar_${timestamp}.jpg`);
  const audioPathName = `voice_${timestamp}.mp3`;
  const outputVideoPath = path.join(mediaDir, `brand_new_shorts_${timestamp}.mp4`);
  const artifactVideoPath = path.join(artifactsDir, `brand_new_shorts_${timestamp}.mp4`);

  const voiceText = "Did you know capybaras are the chillest animals on earth? But when I want pure excitement, I beat levels in Flappy Earn! Download free link in bio!";

  // Step 1: Use reliable image generator
  console.log('[AI Image Engine] Fetching new 3D Pixar character scene...');
  const prompt = encodeURIComponent('cute 3D Pixar Capybara gamer wearing stylish headphones, Disney Pixar animation style, 8k render');
  const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1080&height=1920&nologo=true`;

  await new Promise((resolve) => {
    const fileStream = fs.createWriteStream(characterImgPath);
    https.get(imageUrl, (res) => {
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', () => resolve());
  });

  // Fallback check
  if (!fs.existsSync(characterImgPath) || fs.statSync(characterImgPath).size < 1000) {
    console.log('[Fallback] Using backup Pixar character asset...');
    const fallbackPath = path.join(tempDir, 'perfect_9x16_chubby_character.png');
    if (fs.existsSync(fallbackPath)) {
      fs.copyFileSync(fallbackPath, characterImgPath);
    }
  }

  // Step 2: Generate ElevenLabs Speech
  console.log('[ElevenLabs Engine] Synthesizing speech...');
  const audioFile = await generateElevenLabsSpeech(voiceText, 'JBFqnCBsd6RMkjVDRZzb', audioPathName);

  // Step 3: Render MP4 Video
  const ffmpegExe = 'C:\\Users\\Vov\\AppData\\Local\\Microsoft\\WinGet\\Links\\ffmpeg.exe';
  console.log('[FFmpeg Engine] Rendering 9:16 vertical animated video...');

  const filter = `scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.001,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=250:s=1080x1920`;

  const cmd = `"${ffmpegExe}" -y -loop 1 -i "${characterImgPath}" -i "${audioFile}" -vf "${filter}" -c:v libx264 -c:a aac -b:a 192k -pix_fmt yuv420p -shortest "${outputVideoPath}"`;
  execSync(cmd, { stdio: 'inherit' });

  fs.copyFileSync(outputVideoPath, artifactVideoPath);
  console.log(`🎉 BRAND NEW MP4 VIDEO RENDERED SUCCESSFULLY: ${artifactVideoPath}`);
  return artifactVideoPath;
}

if (require.main === module) {
  renderBrandNewVideo().catch(console.error);
}

module.exports = { renderBrandNewVideo };
