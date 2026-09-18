/**
 * Render Clean 9:16 Shorts Video Layout:
 * Top: New Clean 3D Pixar Character Picture
 * Bottom: Game Gameplay Video
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function renderCleanShorts() {
  const ffmpegExe = 'C:\\Users\\Vov\\AppData\\Local\\Microsoft\\WinGet\\Links\\ffmpeg.exe';

  const charImg = path.join(__dirname, '..', 'media', 'temp', 'square_chubby_character.png');
  const gameVideo = path.join(__dirname, '..', 'media', 'game1', 'videos', 'block_puzzle_ad_dog_2232.mp4');
  
  const outputVideo = path.join(__dirname, '..', 'media', 'generated_videos', 'clean_9x16_shorts_demo.mp4');
  const artifactVideo = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2\\clean_9x16_shorts_demo.mp4';

  console.log('===========================================================');
  console.log('🎬 RENDERING CLEAN 9:16 SHORTS VIDEO');
  console.log('Top: New 3D Pixar Character | Bottom: Game Video');
  console.log('===========================================================');

  // FFmpeg filter:
  // Top 50% (1080x960): New Pixar Picture
  // Bottom 50% (1080x960): Gameplay Video
  const filter = `
    color=s=1080x1920:c=black[bg];
    [0:v]scale=1080:960:force_original_aspect_ratio=increase,crop=1080:960[top_img];
    [1:v]scale=1080:960:force_original_aspect_ratio=increase,crop=1080:960[bot_vid];
    [bg][top_img]overlay=0:0[tmp];
    [tmp][bot_vid]overlay=0:960[out]
  `.replace(/\s+/g, '');

  const cmd = `"${ffmpegExe}" -y -loop 1 -i "${charImg}" -i "${gameVideo}" -filter_complex "${filter}" -map "[out]" -map 1:a? -c:v libx264 -t 10 -pix_fmt yuv420p "${outputVideo}"`;

  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ Rendered clean 9:16 Shorts video: ${outputVideo}`);

    fs.copyFileSync(outputVideo, artifactVideo);
    console.log(`🎉 Saved to artifacts: ${artifactVideo}`);
  } catch (err) {
    console.error(`❌ Error rendering video: ${err.message}`);
  }
}

if (require.main === module) {
  renderCleanShorts();
}

module.exports = renderCleanShorts;
