const fs = require('fs');
const path = require('path');
const https = require('https');

const pageTokensPath = path.join(__dirname, '..', 'data', 'page_tokens.json');
const statePath = path.join(__dirname, '..', 'data', 'state.json');

const pageData = JSON.parse(fs.readFileSync(pageTokensPath, 'utf8'));
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));

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

async function runCheck() {
  console.log('===========================================================');
  console.log('🔍 DEEP LIVE META GRAPH API CHECK FOR ALL PAGES');
  console.log('===========================================================');

  const pages = Object.values(pageData);
  console.log(`Checking ${pages.length} pages live via Meta API...\n`);

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const pageId = page.id;
    const pageName = page.name;
    const token = page.access_token;
    const pageState = state.pages ? state.pages[pageId] || {} : {};

    // Check Graph API for last post on this page
    const feedUrl = `https://graph.facebook.com/v19.0/${pageId}/posts?fields=created_time,message,id&limit=1&access_token=${token}`;
    
    let lastRealPostTime = 'UNKNOWN';
    let apiError = null;

    try {
      const res = await fetchJson(feedUrl);
      if (res.error) {
        apiError = `Meta Error (${res.error.code}): ${res.error.message}`;
      } else if (res.data && res.data.length > 0) {
        lastRealPostTime = new Date(res.data[0].created_time).toLocaleString('ru-RU');
      } else {
        lastRealPostTime = 'No posts found on Page feed';
      }
    } catch (err) {
      apiError = `Network / Fetch error: ${err.message}`;
    }

    console.log(`[${i + 1}/${pages.length}] ${pageName} (ID: ${pageId})`);
    console.log(`    Локальный стейт последнего поста: ${pageState.last_post_at ? new Date(pageState.last_post_at).toLocaleString('ru-RU') : 'Никогда'}`);
    console.log(`    Реальный последний пост в Facebook: ${lastRealPostTime}`);
    if (apiError) {
      console.log(`    🚨 ОШИБКА META API: ${apiError}`);
    }
    console.log('-----------------------------------------------------------');
  }
}

runCheck().catch(console.error);
