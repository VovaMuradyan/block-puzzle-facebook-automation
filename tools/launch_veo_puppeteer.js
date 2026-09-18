/**
 * Google AI Studio Veo Puppeteer Autonomous Runner
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function runVeoBrowserProcess() {
  console.log('===========================================================');
  console.log('🤖 LAUNCHING AUTONOMOUS CHROME ENGINE FOR VEO 3.1');
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

  await page.waitForSelector('textarea, input[type="text"], [contenteditable="true"]', { timeout: 20000 });
  const inputs = await page.$$('textarea, input[type="text"], [contenteditable="true"]');

  if (inputs.length > 0) {
    const inputField = inputs[inputs.length - 1];
    await inputField.focus();
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await inputField.type(promptText, { delay: 15 });
    console.log('✅ Prompt typed into Google AI Studio Veo input box!');

    const screenshotPath = path.join(tempDir, 'veo_prompt_typed.png');
    await page.screenshot({ path: screenshotPath });
    fs.copyFileSync(screenshotPath, path.join(artifactsDir, 'veo_prompt_typed.png'));

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

    if (!clicked) {
      console.log('Pressing Enter to submit generation request...');
      await page.keyboard.press('Enter');
    }

    console.log('===========================================================');
    console.log('🚀 VEO 3.1 VIDEO GENERATION OFFICIALLY SUBMITTED!');
    console.log('===========================================================');
  }
}

if (require.main === module) {
  runVeoBrowserProcess().catch(console.error);
}

module.exports = { runVeoBrowserProcess };
