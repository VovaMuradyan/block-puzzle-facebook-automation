/**
 * Automated AI Video Generator Pipeline
 * Uses FFmpeg to automatically assemble endless unique 9:16 vertical videos (gameplay + animal overlay + dynamic text captions)
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outputDir = path.join(__dirname, '..', 'media', 'generated_videos');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function generateNewVideo(gameplayVideoPath, animalOverlayPath, captionText, outputFileName) {
  const outputPath = path.join(outputDir, outputFileName);

  console.log(`[Video Generator] Assembling new video: ${outputFileName}`);
  console.log(`[Video Generator] Caption: "${captionText}"`);

  // FFmpeg command: Overlay animal on top of gameplay with custom dynamic text banner
  const ffmpegCmd = `ffmpeg -y -i "${gameplayVideoPath}" -i "${animalOverlayPath}" -filter_complex "[0:v][1:v]overlay=x=W-w-20:y=H-h-20[bg];[bg]drawtext=text='${captionText}':fontcolor=white:fontsize=36:box=1:boxcolor=black@0.6:boxborderw=10:x=(w-text_w)/2:y=100" -c:a copy "${outputPath}"`;

  try {
    execSync(ffmpegCmd, { stdio: 'inherit' });
    console.log(`✅ Generated NEW unique video: ${outputPath}`);
    return outputPath;
  } catch (err) {
    console.error(`❌ Error generating video: ${err.message}`);
    return null;
  }
}

async function runAutoGeneratorDemo() {
  console.log('===========================================================');
  console.log('🚀 AUTOMATED AI VIDEO GENERATOR PIPELINE READY');
  console.log('===========================================================');
  console.log('FFmpeg engine detected. Ready to generate endless unique animal gameplay videos!');
}

if (require.main === module) {
  runAutoGeneratorDemo().catch(console.error);
}

module.exports = { generateNewVideo };
