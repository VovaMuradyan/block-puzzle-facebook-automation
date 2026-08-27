const puppeteer = require('puppeteer');

async function launchYouTubeStudioSession() {
  console.log('Launching browser to log into YouTube Studio...');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  await page.goto('https://studio.youtube.com');
  console.log('Opened YouTube Studio in browser!');
}

launchYouTubeStudioSession().catch(console.error);
