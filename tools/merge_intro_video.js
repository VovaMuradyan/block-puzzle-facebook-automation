const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

async function main() {
  const dir = 'C:\\Users\\Vov\\Downloads\\block puzzle2';
  const targetDir = path.join(__dirname, '..', 'media', 'game1', 'videos');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Set 1: 1.mp4, 2.mp4, 3.mp4, 4.mp4 -> block_puzzle_intro_scene_40s_2.mp4
  const set1 = ['1.mp4', '2.mp4', '3.mp4', '4.mp4'];
  const concat1 = path.join(__dirname, '..', 'temp_concat_p2_1.txt');
  fs.writeFileSync(concat1, set1.map(f => `file '${path.join(dir, f).replace(/\\/g, '/')}'`).join('\n'), 'utf8');
  const out1 = path.join(targetDir, 'block_puzzle_intro_scene_40s_2.mp4');
  console.log('[Merge Script] Building set 1 ->', out1);
  execSync(`"${ffmpegPath}" -y -f concat -safe 0 -i "${concat1}" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 128k "${out1}"`, { stdio: 'inherit' });

  // Set 2: 5.mp4, 6.mp4, 7.mp4, 8.mp4 -> block_puzzle_intro_scene_40s_3.mp4
  const set2 = ['5.mp4', '6.mp4', '7.mp4', '8.mp4'];
  const concat2 = path.join(__dirname, '..', 'temp_concat_p2_2.txt');
  fs.writeFileSync(concat2, set2.map(f => `file '${path.join(dir, f).replace(/\\/g, '/')}'`).join('\n'), 'utf8');
  const out2 = path.join(targetDir, 'block_puzzle_intro_scene_40s_3.mp4');
  console.log('[Merge Script] Building set 2 ->', out2);
  execSync(`"${ffmpegPath}" -y -f concat -safe 0 -i "${concat2}" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 128k "${out2}"`, { stdio: 'inherit' });

  // Cleanup
  if (fs.existsSync(concat1)) fs.unlinkSync(concat1);
  if (fs.existsSync(concat2)) fs.unlinkSync(concat2);

  console.log('\n✅ [Merge Script] SUCCESS! Built both Block Puzzle videos:');
  console.log(' -', out1, `(${(fs.statSync(out1).size / (1024*1024)).toFixed(2)} MB)`);
  console.log(' -', out2, `(${(fs.statSync(out2).size / (1024*1024)).toFixed(2)} MB)`);
}

main();
