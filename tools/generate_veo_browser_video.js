/**
 * Automated Google AI Studio Veo Video Generator & Downloader
 * Automates prompt typing, button clicking, video generation, and downloading via Puppeteer on Chrome port 9222
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { generateElevenLabsSpeech } = require('./elevenlabs_multi_key');

async function createVeoVideoAuto() {
  console.log('===========================================================');
  console.log('🎬 AUTOMATED GOOGLE VEO 3.1 BROWSER VIDEO GENERATION');
  console.log('===========================================================');

  const mediaDir = path.join(__dirname, '..', 'media', 'generated_videos');
  const tempDir = path.join(__dirname, '..', 'media', 'temp');
  const artifactsDir = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2';

  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const promptText = "Cute 3D Pixar style Capybara character driving a red toy car in a sunny park, cinematic 9:16 vertical video";
  console.log(`[Veo Auto Generator] Submitting Prompt: "${promptText}"...`);

  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: null
  });

  const pages = await browser.pages();
  const page = pages[0] || await browser.newPage();

  if (!page.url().includes('aistudio.google.com/models/veo')) {
    await page.goto('https://aistudio.google.com/models/veo', { waitUntil: 'networkidle2' });
  }

  // Find textarea or input field for prompt
  console.log('[Puppeteer] Searching for prompt input box...');
  await page.waitForSelector('textarea, input[type="text"], [contenteditable="true"]', { timeout: 15000 });

  const inputs = await page.$$('textarea, input[type="text"], [contenteditable="true"]');
  console.log(`Found ${inputs.length} input element(s) on page.`);

  if (inputs.length > 0) {
    const inputField = inputs[inputs.length - 1]; // Main prompt field is usually the last/primary textarea
    await inputField.focus();
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await inputField.type(promptText, { delay: 10 });
    console.log('✅ Prompt typed into Google AI Studio Veo input box!');

    // Take screenshot after typing
    const screenshotPath = path.join(tempDir, 'veo_prompt_typed.png');
    await page.screenshot({ path: screenshotPath });
    fs.copyFileSync(screenshotPath, path.join(artifactsDir, 'veo_prompt_typed.png'));

    // Look for Run/Generate button
    console.log('[Puppeteer] Searching for Run / Generate button...');
    const buttons = await page.$$('button');
    let clicked = false;

    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent || el.getAttribute('aria-label') || '', b);
      if (text.includes('Run') || text.includes('Generate') || text.includes('Create') || text.includes('Submit')) {
        console.log(`🎉 Clicking action button: "${text.trim()}"`);
        await b.click();
        clicked = true;
        break;
      }
    }

    if (!clicked && buttons.length > 0) {
      console.log('Pressing Enter to submit...');
      await page.keyboard.press('Enter');
    }

    console.log('===========================================================');
    console.log('🚀 VEO 3.1 VIDEO GENERATION STARTED IN BROWSER!');
    console.log('===========================================================');
  }
}

if (require.main === module) {
  createVeoVideoAuto().catch(console.error);
}

module.exports = { createVeoVideoAuto };
