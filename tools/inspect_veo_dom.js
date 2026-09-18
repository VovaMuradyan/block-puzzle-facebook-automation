/**
 * Inspect Google AI Studio Veo DOM Selectors
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function inspectVeoDom() {
  const userDataDir = path.join(__dirname, '..', 'data', 'chrome_veo_profile');
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    userDataDir: userDataDir,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://aistudio.google.com/models/veo', { waitUntil: 'networkidle2' });

  // Dump elements
  const elementsInfo = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    return all
      .filter(el => el.tagName.includes('-') || ['TEXTAREA', 'INPUT', 'BUTTON'].includes(el.tagName) || el.getAttribute('role') || el.getAttribute('aria-label'))
      .map(el => ({
        tag: el.tagName,
        ariaLabel: el.getAttribute('aria-label'),
        placeholder: el.getAttribute('placeholder'),
        class: el.className,
        text: (el.textContent || '').substring(0, 50).trim()
      }))
      .filter(item => item.ariaLabel || item.placeholder || item.tag.includes('PROMPT') || item.text.includes('Run') || item.text.includes('Generate'));
  });

  console.log('🎉 Discovered Google AI Studio Elements:');
  console.log(JSON.stringify(elementsInfo, null, 2));

  await browser.close();
}

inspectVeoDom().catch(console.error);
