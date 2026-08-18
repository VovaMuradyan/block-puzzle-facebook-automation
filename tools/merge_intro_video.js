const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

async function main() {
  const unzippedDir = 'C:\\Users\\Vov\\Downloads\\Новая папка (2)';
  const targetDir = path.join(__dirname, '..', 'media', 'game2', 'videos');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log('[Merge Script] Reading files from:', unzippedDir);
  const files = ['1.mp4', '2.mp4', '3.mp4', '4.mp4'];

  console.log('[Merge Script] Found 4 clips:', files);

  if (files.length === 0) {
    console.error('No mp4 files found!');
    process.exit(1);
  }

  // Create a ffmpeg concat list file
  const concatListPath = path.join(__dirname, '..', 'temp_concat_list_2.txt');
  const fileLines = files.map(f => {
    const fullPath = path.join(unzippedDir, f).replace(/\\/g, '/');
    return `file '${fullPath}'`;
  }).join('\n');

  fs.writeFileSync(concatListPath, fileLines, 'utf8');
  console.log('[Merge Script] Concat list created:\n', fileLines);

  const outputFileName = 'flappy_intro_scene_40s_2.mp4';
  const outputPath = path.join(targetDir, outputFileName);

  console.log('[Merge Script] Running ffmpeg concatenation to:', outputPath);

  // Concatenate using ffmpeg demuxer with re-encode for smooth transitions and perfect audio sync
  const command = `"${ffmpegPath}" -y -f concat -safe 0 -i "${concatListPath}" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 128k "${outputPath}"`;
  
  try {
    execSync(command, { stdio: 'inherit' });
    console.log('\n✅ [Merge Script] SUCCESS! Concatenated 4 clips into 1 video:');
    console.log('Path:', outputPath);

    const stats = fs.statSync(outputPath);
    console.log('File Size:', (stats.size / (1024 * 1024)).toFixed(2), 'MB');

    // Clean up temporary concat list
    if (fs.existsSync(concatListPath)) fs.unlinkSync(concatListPath);

  } catch (err) {
    console.error('[Merge Script] Error during ffmpeg concat:', err.message);
    process.exit(1);
  }
}

main();
