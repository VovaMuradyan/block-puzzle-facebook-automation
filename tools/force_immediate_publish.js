/**
 * Force Immediate Publication Engine
 * Triggers instant video publication across Facebook Pages, TikTok, and YouTube Shorts right now!
 */
const runPublisher = require('../src/publisher');
const uploadNextTikTokVideo = require('./upload_to_tiktok_browser');
const uploadToYouTubeShorts = require('./upload_to_youtube_browser');

async function triggerImmediatePublication() {
  console.log('===========================================================');
  console.log('🚀 TRIGGERING INSTANT IMMEDIATE PUBLICATION ACROSS PLATFORMS');
  console.log('===========================================================');

  try {
    console.log('\n[1/3] Uploading video to Facebook Pages...');
    await runPublisher();
  } catch (err) {
    console.error('Facebook error:', err.message);
  }

  try {
    console.log('\n[2/3] Uploading video to TikTok Account...');
    await uploadNextTikTokVideo();
  } catch (err) {
    console.error('TikTok error:', err.message);
  }

  try {
    console.log('\n[3/3] Uploading video to YouTube Shorts Channel...');
    await uploadToYouTubeShorts();
  } catch (err) {
    console.error('YouTube Shorts error:', err.message);
  }

  console.log('===========================================================');
  console.log('🎉 IMMEDIATE PUBLICATION RUN COMPLETED!');
  console.log('===========================================================');
}

if (require.main === module) {
  triggerImmediatePublication().catch(console.error);
}

module.exports = triggerImmediatePublication;
