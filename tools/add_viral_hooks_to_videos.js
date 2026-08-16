const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ffmpegPath = 'C:\\Users\\Vov\\AppData\\Local\\Microsoft\\WinGet\\Links\\ffmpeg.exe';
const fontPath = 'C\\:/Windows/Fonts/arialbd.ttf';

const viralHooksEn = [
  "99 percent OF PLAYERS FAIL AT 15 SECONDS!",
  "ONLY IQ > 130 CAN CLEAR THIS GRID!",
  "MY MOST PAINFUL MISTAKE EVER...",
  "CAN YOU BEAT THIS INSANE COMBO?",
  "LOOKS EASY... UNTIL YOU TRY IT!",
  "NO ONE HAS EVER REACHED LEVEL 50!",
  "CAN YOU SAVE THIS IMPOSSIBLE BOARD?",
  "SMARTEST MOVE OF THE DAY!",
  "TRY NOT TO GET ADDICTED!",
  "98 percent CANNOT PASS THIS FLIGHT LEVEL!"
];

function processGameVideos(gameId) {
  const videoDir = path.join(__dirname, '..', 'media', gameId, 'videos');
  if (!fs.existsSync(videoDir)) return;

  const files = fs.readdirSync(videoDir).filter(f => f.endsWith('.mp4') && !f.includes('_hooked') && fs.statSync(path.join(videoDir, f)).size > 500000);
  console.log(`\nAdding viral English text overlays to ${gameId} (${files.length} videos)...`);

  files.forEach((file, index) => {
    const inputPath = path.join(videoDir, file);
    const hookedFileName = file.replace('.mp4', '_hooked.mp4');
    const outputPath = path.join(videoDir, hookedFileName);

    let hookText = viralHooksEn[index % viralHooksEn.length]
      .replace(/:/g, '\\:')
      .replace(/'/g, '')
      .replace(/%/g, '\\%');
    
    // FFmpeg drawtext banner with dark background box
    const filter = `"drawtext=fontfile='${fontPath}':text='${hookText}':fontcolor=yellow:fontsize=32:box=1:boxcolor=black@0.8:boxborderw=12:x=(w-text_w)/2:y=60"`;
    const cmd = `"${ffmpegPath}" -y -i "${inputPath}" -vf ${filter} -c:v libx264 -crf 24 -preset fast -an "${outputPath}"`;

    try {
      execSync(cmd, { stdio: 'pipe' });
      if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 100000) {
        fs.renameSync(outputPath, inputPath);
        console.log(`[+] Added viral text hook to ${file}: "${hookText}"`);
      }
    } catch (err) {
      console.error(`[-] Error adding hook to ${file}: ${err.message}`);
    }
  });
}

console.log('=====================================================');
console.log('Generating Viral English Text Banners on All Videos');
console.log('=====================================================');

processGameVideos('game1');
processGameVideos('game2');

console.log('\nViral text overlays added successfully!');
