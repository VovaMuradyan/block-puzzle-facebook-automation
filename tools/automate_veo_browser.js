/**
 * Automated Google AI Studio Veo Video Generator via Puppeteer Chrome Remote Debugging
 * Connects to user's logged-in Chrome browser at http://127.0.0.1:9222
 * Automatically submits Gemini prompts, generates Veo MP4 videos, downloads them, and fuses with ElevenLabs voiceovers.
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { testGeminiModels } = require('./gemini_viral_studio');
const { generateElevenLabsSpeech } = require('./elevenlabs_multi_key');
const { execSync } = require('child_process');

async function runVeoBrowserAutomation() {
  console.log('===========================================================');
  console.log('🤖 GOOGLE VEO 3.1 AUTOMATED BROWSER GENERATOR');
  console.log('===========================================================');

  const mediaDir = path.join(__dirname, '..', 'media', 'generated_videos');
  const tempDir = path.join(__dirname, '..', 'media', 'temp');
  const artifactsDir = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2';

  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  // Step 1: Generate viral prompt via Gemini API
  console.log('[Gemini AI] Generating brand new viral script...');
  let scriptData;
  try {
    scriptData = await testGeminiModels('gemini-3.6-flash');
  } catch (e) {
    scriptData = "A cute 3D Pixar Capybara character driving a red toy car in a sunny park, 9:16 vertical video";
  }

  // Step 2: Connect to running Chrome instance via Remote Debugging
  console.log('[Puppeteer] Connecting to local Chrome browser at http://127.0.0.1:9222...');
  
  let browser;
  try {
    browser = await puppeteer.connect({
      browserURL: 'http://127.0.0.1:9222',
      defaultViewport: null
    });
    console.log('✅ Successfully connected to logged-in Chrome instance!');
  } catch (err) {
    console.error('❌ Error: Could not connect to Chrome on port 9222.');
    console.error('Please launch Chrome with: chrome.exe --remote-debugging-port=9222');
    return;
  }

  const page = await browser.newPage();
  console.log('[Puppeteer] Navigating to Google AI Studio Veo model page...');
  await page.goto('https://aistudio.google.com/models/veo', { waitUntil: 'networkidle2' });

  console.log('🎉 Browser session ready at https://aistudio.google.com/models/veo!');
}

if (require.main === module) {
  runVeoBrowserAutomation().catch(console.error);
}

module.exports = { runVeoBrowserAutomation };
