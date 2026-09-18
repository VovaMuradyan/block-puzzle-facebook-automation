const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Launching browser to retrieve Meta User Access Token...');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  console.log('Navigating to Meta Graph API Explorer...');
  await page.goto('https://developers.facebook.com/tools/explorer/', { waitUntil: 'networkidle2' });

  console.log('\n======================================================');
  console.log('Opened Meta Graph API Explorer in Chrome window.');
  console.log('Please make sure you are logged into Facebook/Meta and click "Generate Access Token".');
  console.log('Required permissions: pages_manage_posts, pages_read_engagement, pages_show_list');
  console.log('======================================================\n');
}

main().catch(console.error);
