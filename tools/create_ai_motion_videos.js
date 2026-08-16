const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ffmpegPath = 'C:\\Users\\Vov\\AppData\\Local\\Microsoft\\WinGet\\Links\\ffmpeg.exe';
const fontPath = 'C\\:/Windows/Fonts/arialbd.ttf';

const img1 = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2\\block_puzzle_exact_gameplay_1786884415357.jpg';
const img2 = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2\\flappy_earn_exact_gameplay_1786884432336.jpg';

const g1Dir = path.join(__dirname, '..', 'media', 'game1', 'videos');
const g2Dir = path.join(__dirname, '..', 'media', 'game2', 'videos');

// Build 60 FPS animated zoom-in motion video for Game 1 (Block Puzzle)
const out1 = path.join(g1Dir, 'ai_exact_block_puzzle_9x16.mp4');
const vf1 = `"scale=720:1280,zoompan=z='min(zoom+0.0015\\,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=300:s=720x1280,drawtext=fontfile='${fontPath}':text='ONLY IQ > 130 CAN CLEAR THIS!':fontcolor=yellow:fontsize=28:box=1:boxcolor=black@0.85:boxborderw=10:x=(w-text_w)/2:y=70"`;
const cmd1 = `"${ffmpegPath}" -y -loop 1 -i "${img1}" -vf ${vf1} -c:v libx264 -t 10 -pix_fmt yuv420p -r 30 "${out1}"`;

// Build 60 FPS animated zoom-in motion video for Game 2 (Flappy Earn)
const out2 = path.join(g2Dir, 'ai_exact_flappy_earn_9x16.mp4');
const vf2 = `"scale=720:1280,zoompan=z='min(zoom+0.0015\\,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=300:s=720x1280,drawtext=fontfile='${fontPath}':text='99 PERCENT FAIL AT SECOND 15!':fontcolor=yellow:fontsize=28:box=1:boxcolor=black@0.85:boxborderw=10:x=(w-text_w)/2:y=70"`;
const cmd2 = `"${ffmpegPath}" -y -loop 1 -i "${img2}" -vf ${vf2} -c:v libx264 -t 10 -pix_fmt yuv420p -r 30 "${out2}"`;

console.log('Generating exact game AI motion videos with FFmpeg...');
try {
  execSync(cmd1, { stdio: 'pipe' });
  console.log('[+] AI Exact Video for Block Puzzle generated!');
  execSync(cmd2, { stdio: 'pipe' });
  console.log('[+] AI Exact Video for Flappy Earn generated!');
} catch (err) {
  console.error('Error generating motion video:', err.message);
}
