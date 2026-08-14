const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ffmpegPath = 'C:\\Users\\Vov\\AppData\\Local\\Microsoft\\WinGet\\Links\\ffmpeg.exe';
const sourceVideoDir = 'C:\\Users\\Vov\\Desktop\\BlockRoyale_v2\\video';
const outputDir = path.join(__dirname, '..', 'media', 'videos');
const imageOutputDir = path.join(__dirname, '..', 'media', 'images');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(imageOutputDir)) fs.mkdirSync(imageOutputDir, { recursive: true });

const sources = [
  { filename: 'Screenrecorder-2026-08-14-21-52-46-214.mp4', maxDuration: 80 },
  { filename: 'Screenrecorder-2026-08-14-21-55-10-934.mp4', maxDuration: 80 },
  { filename: 'Screenrecorder-2026-08-14-21-58-02-760.mp4', maxDuration: 110 }
];

let clipCount = 0;

console.log('Starting video batch processing with FFmpeg...');

sources.forEach((src, srcIndex) => {
  const inputPath = path.join(sourceVideoDir, src.filename);
  
  // Cut clips every 8-12 seconds
  const clipLengths = [8, 10, 12, 15];
  let startTime = 0;
  
  while (startTime + 8 <= src.maxDuration) {
    const duration = clipLengths[clipCount % clipLengths.length];
    if (startTime + duration > src.maxDuration) break;

    clipCount++;

    // Aspect ratio 1: 9:16 vertical (Reels - 720x1280 cropped)
    const clipName916 = `clip_v${srcIndex + 1}_${clipCount}_9x16.mp4`;
    const outPath916 = path.join(outputDir, clipName916);
    const cmd916 = `"${ffmpegPath}" -y -ss ${startTime} -i "${inputPath}" -t ${duration} -vf "crop=1080:1920:0:(ih-1920)/2,scale=720:1280" -c:v libx264 -crf 26 -preset fast -an "${outPath916}"`;
    try {
      execSync(cmd916, { stdio: 'pipe' });
      console.log(`[+] Created Reel clip ${clipCount}: ${clipName916}`);
    } catch (err) {
      console.error(`[-] Failed to generate ${clipName916}:`, err.message);
    }

    // Aspect ratio 2: 1:1 square (Feed post - 720x720 cropped)
    const clipName11 = `clip_v${srcIndex + 1}_${clipCount}_1x1.mp4`;
    const outPath11 = path.join(outputDir, clipName11);
    const cmd11 = `"${ffmpegPath}" -y -ss ${startTime} -i "${inputPath}" -t ${duration} -vf "crop=1080:1080:0:(ih-1080)/2,scale=720:720" -c:v libx264 -crf 26 -preset fast -an "${outPath11}"`;
    try {
      execSync(cmd11, { stdio: 'pipe' });
      console.log(`[+] Created Square clip ${clipCount}: ${clipName11}`);
    } catch (err) {
      console.error(`[-] Failed to generate ${clipName11}:`, err.message);
    }

    startTime += 6; // overlap clips by 6 seconds for maximum variety
  }
});

console.log(`\nVideo batch processing completed! Created clips in ${outputDir}`);

// Copy existing image assets
const sourceImages = [
  'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\c07eebca-2f56-4e4a-9858-bb35e6471379\\blockpuzzle_avatar_1786730804321.jpg',
  'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\c07eebca-2f56-4e4a-9858-bb35e6471379\\blockpuzzle_banner_1786730816599.jpg',
  'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\tempmediaStorage\\media_1786732452399.png'
];

sourceImages.forEach((img, idx) => {
  if (fs.existsSync(img)) {
    const ext = path.extname(img);
    const dest = path.join(imageOutputDir, `promo_image_${idx + 1}${ext}`);
    fs.copyFileSync(img, dest);
    console.log(`[+] Copied image ${path.basename(dest)}`);
  }
});

console.log('Media generation finished.');
