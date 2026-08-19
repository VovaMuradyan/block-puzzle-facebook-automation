const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const flappyVideos = [
  'flappy_ad_capybara_2308.mp4',
  'flappy_ad_raccoon_2259.mp4',
  'flappy_ad_parrot_2258.mp4',
  'flappy_ad_cat_2254.mp4',
  'flappy_ad_dog_2253.mp4',
  'flappy_ad_otter_2310.mp4'
];

const videosDir = path.join(__dirname, '..', 'media', 'game2', 'videos');

console.log('Fixing bottom title text on all 6 Flappy Earn videos...');

flappyVideos.forEach(file => {
  const filePath = path.join(videosDir, file);
  const tempPath = path.join(videosDir, `fixed_${file}`);

  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  console.log(`Processing ${file}...`);

  // Draw black/gradient box at bottom to cover wrong text "Block Puzzle" (y=1680 to 1920)
  // and draw bold crisp "FLAPPY EARN" text with yellow shadow
  const vfFilter = [
    // Draw solid dark rounded banner box at bottom (y=1660 to 1860, height 200px)
    "drawbox=x=60:y=1660:w=960:h=200:color=black@0.85:t=fill",
    // Draw bright yellow border box around banner
    "drawbox=x=60:y=1660:w=960:h=200:color=0xFFD700@0.9:t=6",
    // Draw text FLAPPY EARN centered in banner
    "drawtext=text='FLAPPY EARN':x=(w-text_w)/2:y=1710:fontsize=75:fontcolor=0xFFD700:shadowcolor=black:shadowx=4:shadowy=4"
  ].join(",");

  const cmd = `"${ffmpeg}" -i "${filePath}" -vf "${vfFilter}" -c:a copy -c:v libx264 -preset fast -crf 20 "${tempPath}" -y`;

  try {
    execSync(cmd, { stdio: 'inherit' });
    fs.renameSync(tempPath, filePath);
    console.log(`✅ Successfully updated ${file} with FLAPPY EARN bottom banner!`);
  } catch (err) {
    console.error(`❌ Error processing ${file}:`, err.message);
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
});

console.log('All 6 Flappy Earn videos successfully fixed!');
