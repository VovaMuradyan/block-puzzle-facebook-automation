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

async function runGroupedCheck() {
  console.log('===========================================================');
  console.log('🔍 ACCOUNT-BY-ACCOUNT LIVE META GRAPH API DIAGNOSTIC');
  console.log('===========================================================');

  const pages = Object.values(pageData);

  // Group pages by unique access token / account
  const accountMap = {};

  pages.forEach(p => {
    // Get token prefix as unique account ID
    const tokenKey = p.access_token ? p.access_token.substring(0, 35) : 'NO_TOKEN';
    if (!accountMap[tokenKey]) {
      accountMap[tokenKey] = {
        token: p.access_token,
        pages: []
      };
    }
    accountMap[tokenKey].pages.push(p);
  });

  const accountKeys = Object.keys(accountMap);
  console.log(`Found ${accountKeys.length} distinct Facebook User Admin Accounts.\n`);

  for (let accIdx = 0; accIdx < accountKeys.length; accIdx++) {
    const acc = accountMap[accountKeys[accIdx]];
    console.log(`===========================================================`);
    console.log(`👤 FACEBOOK ADMIN ACCOUNT #${accIdx + 1} (${acc.pages.length} Pages)`);
    console.log(`===========================================================`);

    for (let pIdx = 0; pIdx < acc.pages.length; pIdx++) {
      const page = acc.pages[pIdx];
      const pageId = page.id;
      const pageName = page.name;
      const token = page.access_token;

      const feedUrl = `https://graph.facebook.com/v19.0/${pageId}/posts?fields=created_time,message,id&limit=1&access_token=${token}`;
      
      let lastRealPostTime = 'UNKNOWN';
      let statusSymbol = '🟢';
      let errorDetail = null;

      try {
        const res = await fetchJson(feedUrl);
        if (res.error) {
          statusSymbol = '🔴';
          errorDetail = `Meta Error (${res.error.code}): ${res.error.message}`;
        } else if (res.data && res.data.length > 0) {
          const postDate = new Date(res.data[0].created_time);
          const hoursAgo = ((Date.now() - postDate.getTime()) / (1000 * 3600)).toFixed(1);
          lastRealPostTime = `${postDate.toLocaleString('ru-RU')} (${hoursAgo} ч. назад)`;
          if (hoursAgo > 24) {
            statusSymbol = '⚠️';
          }
        } else {
          statusSymbol = '⚠️';
          lastRealPostTime = 'No posts found on Page feed';
        }
      } catch (err) {
        statusSymbol = '🔴';
        errorDetail = err.message;
      }

      console.log(`  ${statusSymbol} [Page ${pIdx + 1}] ${pageName} (ID: ${pageId})`);
      console.log(`      Реальный последний пост в Facebook: ${lastRealPostTime}`);
      if (errorDetail) {
        console.log(`      🚨 Ошибка Meta: ${errorDetail}`);
      }
    }
    console.log('\n');
  }
}

runGroupedCheck().catch(console.error);
