/**
 * Direct Puppeteer Launcher for Google AI Studio Veo Video Generation
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function generateVeoBrowserDirect() {
  console.log('===========================================================');
  console.log('🤖 LAUNCHING DIRECT VEO 3.1 BROWSER ENGINE');
  console.log('===========================================================');

  const userDataDir = path.join(__dirname, '..', 'data', 'chrome_veo_profile');
  const tempDir = path.join(__dirname, '..', 'media', 'temp');
  const artifactsDir = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2';

  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    userDataDir: userDataDir,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox']
  });

  const page = await browser.newPage();
  console.log('[Puppeteer] Navigating to https://aistudio.google.com/models/veo...');
  await page.goto('https://aistudio.google.com/models/veo', { waitUntil: 'networkidle2' });

  const promptText = "Cute 3D Pixar style Capybara character driving a red toy car in a sunny park, cinematic 9:16 vertical video";
  console.log(`[Veo Engine] Submitting Prompt: "${promptText}"...`);

  // Wait 3s for page load
  await new Promise(r => setTimeout(r, 3000));

  // Click on the prompt text box area
  await page.mouse.click(600, 600);
  await new Promise(r => setTimeout(r, 500));

  await page.keyboard.down('Control');
  await page.keyboard.press('A');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(promptText, { delay: 10 });
  console.log('✅ Typed prompt into Google AI Studio Veo input area!');

  const screenshotPath = path.join(tempDir, 'veo_direct_typed.png');
  await page.screenshot({ path: screenshotPath });
  fs.copyFileSync(screenshotPath, path.join(artifactsDir, 'veo_direct_typed.png'));

  // Press Ctrl+Enter
  console.log('[Puppeteer] Sending generation command Ctrl+Enter...');
  await page.keyboard.down('Control');
  await page.keyboard.press('Enter');
  await page.keyboard.up('Control');

  console.log('🎉 Generation command sent!');
}

if (require.main === module) {
  generateVeoBrowserDirect().catch(console.error);
}

module.exports = { generateVeoBrowserDirect };
