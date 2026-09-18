/**
 * Puppeteer Headless Inspector for Google AI Studio Veo
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function inspectVeoPage() {
  console.log('===========================================================');
  console.log('🤖 INSPECTING GOOGLE AI STUDIO VEO PAGE VIA PUPPETEER');
  console.log('===========================================================');

  const mediaDir = path.join(__dirname, '..', 'media', 'temp');
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

  const screenshotPath = path.join(mediaDir, 'veo_page_inspect.png');
  const artifactPath = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2\\veo_page_inspect.png';

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('[Puppeteer] Navigating to https://aistudio.google.com/models/veo...');
  await page.goto('https://aistudio.google.com/models/veo', { waitUntil: 'networkidle2', timeout: 60000 });

  console.log(`[Page Title]: ${await page.title()}`);
  console.log(`[Page URL]: ${page.url()}`);

  await page.screenshot({ path: screenshotPath, fullPage: true });
  fs.copyFileSync(screenshotPath, artifactPath);
  console.log(`🎉 Screenshot captured to: ${artifactPath}`);

  await browser.close();
}

inspectVeoPage().catch(console.error);
