/**
 * Ultimate 9:16 Viral Shorts Layout Engine
 * Top 60%: Cute Pixar Talking Animal Character (1:1 chubby proportion)
 * Bottom 40%: Mobile Gameplay Recording (Block Puzzle / Flappy Earn)
 * Center: Dynamic Captions & Subtitles
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function renderViralShorts9x16(characterImagePath, gameplayVideoPath, outputShortsVideoPath) {
  const ffmpegExe = 'C:\\Users\\Vov\\AppData\\Local\\Microsoft\\WinGet\\Links\\ffmpeg.exe';

  console.log('===========================================================');
  console.log('🎬 RENDERING FULL 9:16 SHORTS LAYOUT (CHARACTER + GAMEPLAY)');
  console.log('===========================================================');

  // FFmpeg filter:
  // 1. Create 1080x1920 dark gradient background
  // 2. Scale character image to 1080x1100 (top section)
  // 3. Scale gameplay video to 1080x820 (bottom section)
  const filter = `
    color=s=1080x1920:c=black[bg];
    [0:v]scale=1080:1100:force_original_aspect_ratio=decrease[char];
    [1:v]scale=1080:820:force_original_aspect_ratio=increase,crop=1080:820[game];
    [bg][char]overlay=(W-w)/2:40[top];
    [top][game]overlay=0:1100[out]
  `.replace(/\s+/g, '');

  const cmd = `"${ffmpegExe}" -y -loop 1 -i "${characterImagePath}" -i "${gameplayVideoPath}" -filter_complex "${filter}" -map "[out]" -map 1:a? -c:v libx264 -t 10 -pix_fmt yuv420p "${outputShortsVideoPath}"`;

  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`🎉 FULL 9:16 VIRAL SHORTS VIDEO RENDERED: ${outputShortsVideoPath}`);
    return outputShortsVideoPath;
  } catch (err) {
    console.error(`❌ Error rendering Shorts video: ${err.message}`);
    return null;
  }
}

async function demoShortsLayout() {
  const tempDir = path.join(__dirname, '..', 'media', 'temp');
  const mediaDir = path.join(__dirname, '..', 'media', 'generated_videos');
  const artifactsDir = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2';

  const charImg = path.join(tempDir, 'square_chubby_character.png');
  const gameVideo = path.join(__dirname, '..', 'media', 'game1', 'videos', 'block_puzzle_ad_dog_2232.mp4');
  const outputVideo = path.join(mediaDir, 'viral_shorts_9x16_final.mp4');
  const artifactVideo = path.join(artifactsDir, 'viral_shorts_9x16_final.mp4');

  if (fs.existsSync(charImg) && fs.existsSync(gameVideo)) {
    renderViralShorts9x16(charImg, gameVideo, outputVideo);
    if (fs.existsSync(outputVideo)) {
      fs.copyFileSync(outputVideo, artifactVideo);
    }
  }
}

if (require.main === module) {
  demoShortsLayout().catch(console.error);
}

module.exports = { renderViralShorts9x16 };
