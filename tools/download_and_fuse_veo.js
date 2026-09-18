/**
 * Veo Video Download & ElevenLabs Audio Fusion Engine
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { generateElevenLabsSpeech } = require('./elevenlabs_multi_key');
const { execSync } = require('child_process');

async function downloadAndFuseVeoVideo() {
  console.log('===========================================================');
  console.log('📥 WAITING FOR VEO 3.1 MP4 GENERATION & DOWNLOADING');
  console.log('===========================================================');

  const mediaDir = path.join(__dirname, '..', 'media', 'generated_videos');
  const tempDir = path.join(__dirname, '..', 'media', 'temp');
  const artifactsDir = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2';

  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: null
  });

  const pages = await browser.pages();
  const page = pages[0];

  // Screenshot current progress
  const screenPath = path.join(tempDir, 'veo_rendering_progress.png');
  await page.screenshot({ path: screenPath });
  fs.copyFileSync(screenPath, path.join(artifactsDir, 'veo_rendering_progress.png'));
  console.log(`📸 Render status captured: ${path.join(artifactsDir, 'veo_rendering_progress.png')}`);

  // Check for completed video elements
  const videoSrc = await page.evaluate(() => {
    const v = document.querySelector('video');
    return v ? v.src : null;
  });

  console.log(`[Video Element Src]: ${videoSrc}`);
}

if (require.main === module) {
  downloadAndFuseVeoVideo().catch(console.error);
}

module.exports = { downloadAndFuseVeoVideo };
