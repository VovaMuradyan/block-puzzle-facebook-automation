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

flappyVideos.forEach(v => {
  const input = path.join(__dirname, '..', 'media', 'game2', 'videos', v);
  const output = path.join(__dirname, '..', `frame_${v.replace('.mp4', '.jpg')}`);
  if (fs.existsSync(input)) {
    console.log(`Extracting frame from ${v}...`);
    execSync(`"${ffmpeg}" -ss 00:00:03 -i "${input}" -vframes 1 -q:v 2 "${output}" -y`);
  }
});
console.log('Frame extraction complete.');
