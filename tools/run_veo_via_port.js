/**
 * Connect to Port 9222 Chrome and Automate Google AI Studio Veo
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

async function runVeoPortAutomation() {
  console.log('===========================================================');
  console.log('🤖 CONNECTING TO CHROME PORT 9222 FOR VEO 3.1 GENERATION');
  console.log('===========================================================');

  const tempDir = path.join(__dirname, '..', 'media', 'temp');
  const artifactsDir = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2';

  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: null
  });

  const pages = await browser.pages();
  const page = pages[0] || await browser.newPage();

  if (!page.url().includes('aistudio.google.com/models/veo')) {
    console.log('[Puppeteer] Navigating to https://aistudio.google.com/models/veo...');
    await page.goto('https://aistudio.google.com/models/veo', { waitUntil: 'networkidle2' });
  }

  // Type prompt directly using click in center of page / focus
  const promptText = "Cute 3D Pixar style Capybara character driving a red toy car in a sunny park, cinematic 9:16 vertical video";
  console.log(`[Veo Engine] Submitting Prompt: "${promptText}"...`);

  // Click on the prompt text box area
  await page.mouse.click(600, 600);
  await new Promise(r => setTimeout(r, 500));
  await page.keyboard.down('Control');
  await page.keyboard.press('A');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(promptText, { delay: 10 });
  console.log('✅ Typed prompt into Google AI Studio page!');

  const screenshotPath = path.join(tempDir, 'veo_prompt_typed_live.png');
  await page.screenshot({ path: screenshotPath });
  fs.copyFileSync(screenshotPath, path.join(artifactsDir, 'veo_prompt_typed_live.png'));

  // Press Ctrl+Enter or Enter to submit
  console.log('[Puppeteer] Submitting generation request with Ctrl+Enter...');
  await page.keyboard.down('Control');
  await page.keyboard.press('Enter');
  await page.keyboard.up('Control');

  console.log('🎉 Generation request sent successfully!');
}

if (require.main === module) {
  runVeoPortAutomation().catch(console.error);
}

module.exports = { runVeoPortAutomation };
