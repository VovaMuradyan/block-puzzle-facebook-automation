const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ffmpegPath = 'C:\\Users\\Vov\\AppData\\Local\\Microsoft\\WinGet\\Links\\ffmpeg.exe';
const fontPath = 'C\\:/Windows/Fonts/arialbd.ttf';

const viralHooksEn = [
  "99 PERCENT FAIL AT SECOND 15!",
  "ONLY IQ > 130 CAN CLEAR THIS!",
  "MY MOST PAINFUL MISTAKE EVER!",
  "CAN YOU BEAT THIS COMBO?",
  "LOOKS EASY... UNTIL YOU TRY!",
  "NO ONE HAS REACHED LEVEL 50!",
  "CAN YOU SAVE THIS BOARD?",
  "SMARTEST MOVE OF THE DAY!",
  "TRY NOT TO GET ADDICTED!",
  "CAN YOU PASS THIS LEVEL?"
];

function processGame1Clean() {
  const targetDir = path.join(__dirname, '..', 'media', 'game1', 'videos');
  if (!fs.existsSync(targetDir)) return;

  const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.mp4') && !f.startsWith('temp_') && fs.statSync(path.join(targetDir, f)).size > 500000);
  console.log(`\n[Game 1] Rebuilding clean viral text overlays for Block Puzzle (${files.length} files)...`);

  files.forEach((file, index) => {
    const inputPath = path.join(targetDir, file);
    const tempPath = path.join(targetDir, `clean_${file}`);
    const hookText = viralHooksEn[index % viralHooksEn.length];

    const filter = `"drawtext=fontfile='${fontPath}':text='${hookText}':fontcolor=yellow:fontsize=28:box=1:boxcolor=black@0.85:boxborderw=10:x=(w-text_w)/2:y=60"`;
    const cmd = `"${ffmpegPath}" -y -i "${inputPath}" -vf ${filter} -c:v libx264 -crf 23 -preset fast -an "${tempPath}"`;

    try {
      execSync(cmd, { stdio: 'pipe' });
      if (fs.existsSync(tempPath) && fs.statSync(tempPath).size > 100000) {
        fs.renameSync(tempPath, inputPath);
        console.log(`[+] Rebuilt clean Block Puzzle video ${file}: "${hookText}"`);
      }
    } catch (err) {
      console.error(`[-] Error rebuilding ${file}: ${err.message}`);
    }
  });
}

processGame1Clean();
console.log('\nGame 1 videos cleaned!');
