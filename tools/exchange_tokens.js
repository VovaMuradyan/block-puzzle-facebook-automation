const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GRAPH_API_BASE = 'https://graph.facebook.com/v20.0';

const appConfig = [
  {
    accountId: 1,
    appId: '1073407681882821',
    appSecret: '695887f45101df8eb588596d02458384'
  },
  {
    accountId: 2,
    appId: '1026455723356122',
    appSecret: '176164adb68249e63982b8fda6f686cb'
  },
  {
    accountId: 3,
    appId: '1737470417405012',
    appSecret: 'deb795798a71db5088b35d1e3c98533e'
  }
];

// Save App Config to config/apps.json
const configDir = path.join(__dirname, '..', 'config');
if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
fs.writeFileSync(path.join(configDir, 'apps.json'), JSON.stringify(appConfig, null, 2), 'utf8');
console.log('[+] Saved Meta App credentials to config/apps.json');

/**
 * Exchange a short-lived user token for a 60-day long-lived user token
 */
async function exchangeForLongLivedToken(shortToken, appId, appSecret) {
  try {
    const url = `${GRAPH_API_BASE}/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken.trim()}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) {
      console.error(`[-] Exchange failed for App ID ${appId}: ${data.error.message}`);
      return shortToken; // fallback
    }
    console.log(`[+] SUCCESS! Exchanged short token for 60-DAY LONG-LIVED TOKEN (expires in ${data.expires_in} seconds / 60 days)`);
    return data.access_token;
  } catch (err) {
    console.error(`[-] Error exchanging token: ${err.message}`);
    return shortToken;
  }
}

/**
 * Given user tokens and app configs, exchange all user tokens for 60-day tokens
 */
async function processAllTokens(userTokens) {
  const longLivedTokens = [];
  
  for (let i = 0; i < userTokens.length; i++) {
    const token = userTokens[i];
    const cfg = appConfig[i] || appConfig[0];
    console.log(`\nExchanging token #${i + 1} using App ID ${cfg.appId}...`);
    const longToken = await exchangeForLongLivedToken(token, cfg.appId, cfg.appSecret);
    longLivedTokens.push(longToken);
  }

  return longLivedTokens;
}

module.exports = {
  appConfig,
  exchangeForLongLivedToken,
  processAllTokens
};
