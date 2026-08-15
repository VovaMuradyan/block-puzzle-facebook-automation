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

console.log('Starting video batch processing with FFmpeg (Full Fit + Blurred Background)...');

sources.forEach((src, srcIndex) => {
  const inputPath = path.join(sourceVideoDir, src.filename);
  
  // Cut clips every 8-12 seconds
  const clipLengths = [8, 10, 12, 15];
  let startTime = 0;
  
  while (startTime + 8 <= src.maxDuration) {
    const duration = clipLengths[clipCount % clipLengths.length];
    if (startTime + duration > src.maxDuration) break;

    clipCount++;

    // Aspect ratio 1: 9:16 vertical (Reels - Full gameplay fit inside 720x1280 with blurred background)
    const clipName916 = `clip_v${srcIndex + 1}_${clipCount}_9x16.mp4`;
    const outPath916 = path.join(outputDir, clipName916);
    const filter916 = `"split[a][b];[a]scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,gblur=sigma=20[bg];[b]scale=720:1280:force_original_aspect_ratio=decrease[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2"`;
    const cmd916 = `"${ffmpegPath}" -y -ss ${startTime} -i "${inputPath}" -t ${duration} -filter_complex ${filter916} -c:v libx264 -crf 26 -preset fast -an "${outPath916}"`;
    try {
      execSync(cmd916, { stdio: 'pipe' });
      console.log(`[+] Created Full-Fit Reel clip ${clipCount}: ${clipName916}`);
    } catch (err) {
      console.error(`[-] Failed to generate ${clipName916}:`, err.message);
    }

    // Aspect ratio 2: 1:1 square (Feed post - Full gameplay fit inside 720x720 with blurred background)
    const clipName11 = `clip_v${srcIndex + 1}_${clipCount}_1x1.mp4`;
    const outPath11 = path.join(outputDir, clipName11);
    const filter11 = `"split[a][b];[a]scale=720:720:force_original_aspect_ratio=increase,crop=720:720,gblur=sigma=20[bg];[b]scale=720:720:force_original_aspect_ratio=decrease[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2"`;
    const cmd11 = `"${ffmpegPath}" -y -ss ${startTime} -i "${inputPath}" -t ${duration} -filter_complex ${filter11} -c:v libx264 -crf 26 -preset fast -an "${outPath11}"`;
    try {
      execSync(cmd11, { stdio: 'pipe' });
      console.log(`[+] Created Full-Fit Square clip ${clipCount}: ${clipName11}`);
    } catch (err) {
      console.error(`[-] Failed to generate ${clipName11}:`, err.message);
    }

    startTime += 6; // overlap clips by 6 seconds for maximum variety
  }
});

console.log(`\nVideo batch processing completed! Created clips in ${outputDir}`);
