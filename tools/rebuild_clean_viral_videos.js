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

function processGame2Clean() {
  const rawDir = 'C:\\Users\\Vov\\Desktop\\FlappyEarn\\video';
  const targetDir = path.join(__dirname, '..', 'media', 'game2', 'videos');

  if (!fs.existsSync(rawDir) || !fs.existsSync(targetDir)) return;

  const rawFiles = fs.readdirSync(rawDir).filter(f => f.endsWith('.mp4'));
  console.log(`\n[Game 2] Rebuilding ${rawFiles.length} clean viral videos...`);

  let count = 0;
  rawFiles.forEach((file, fIdx) => {
    const rawPath = path.join(rawDir, file);

    const hookText1 = viralHooksEn[(count * 2) % viralHooksEn.length];
    const out1 = path.join(targetDir, `flappy_v${fIdx + 1}_${count}_1x1.mp4`);
    const vf1 = `"crop=min(iw\\,ih):min(iw\\,ih),scale=720:720,drawtext=fontfile='${fontPath}':text='${hookText1}':fontcolor=yellow:fontsize=28:box=1:boxcolor=black@0.85:boxborderw=10:x=(w-text_w)/2:y=50"`;
    const cmd1 = `"${ffmpegPath}" -y -i "${rawPath}" -vf ${vf1} -c:v libx264 -crf 23 -preset fast -an "${out1}"`;

    const hookText2 = viralHooksEn[(count * 2 + 1) % viralHooksEn.length];
    const out2 = path.join(targetDir, `flappy_v${fIdx + 1}_${count}_9x16.mp4`);
    const vf2 = `"split[u][d];[u]scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,gblur=sigma=20[bg];[d]scale=720:-1[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,drawtext=fontfile='${fontPath}':text='${hookText2}':fontcolor=yellow:fontsize=28:box=1:boxcolor=black@0.85:boxborderw=10:x=(w-text_w)/2:y=70"`;
    const cmd2 = `"${ffmpegPath}" -y -i "${rawPath}" -vf ${vf2} -c:v libx264 -crf 23 -preset fast -an "${out2}"`;

    try {
      execSync(cmd1, { stdio: 'pipe' });
      execSync(cmd2, { stdio: 'pipe' });
      console.log(`[+] Built clean Flappy videos ${fIdx + 1}: "${hookText1}" & "${hookText2}"`);
    } catch (err) {
      console.error(`[-] Error building ${file}: ${err.message}`);
    }
    count++;
  });
}

console.log('=====================================================');
console.log('Rebuilding ALL Videos from Raw Sources (Single Clean Banner)');
console.log('=====================================================');

processGame2Clean();

console.log('\nAll Flappy Earn videos successfully rebuilt with single clean banners!');
