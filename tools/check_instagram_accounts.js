const fs = require('fs');
const path = require('path');
const https = require('https');

const pageTokensPath = path.join(__dirname, '..', 'data', 'page_tokens.json');
const pageData = JSON.parse(fs.readFileSync(pageTokensPath, 'utf8'));

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function discoverInstagramAccounts() {
  console.log('===========================================================');
  console.log('🔍 DISCOVERING LINKED INSTAGRAM BUSINESS ACCOUNTS VIA META API');
  console.log('===========================================================');

  const pages = Object.values(pageData);
  let igCount = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const pageId = page.id;
    const pageName = page.name;
    const token = page.access_token;

    const url = `https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account,name&access_token=${token}`;

    try {
      const res = await fetchJson(url);
      if (res.instagram_business_account) {
        igCount++;
        console.log(`✅ [FB Page] ${pageName} -> Linked Instagram Business ID: ${res.instagram_business_account.id}`);
      }
    } catch (e) {
      // Ignore individual errors
    }
  }

  console.log(`\nFound ${igCount} linked Instagram Business Accounts across pages.`);
}

discoverInstagramAccounts().catch(console.error);
