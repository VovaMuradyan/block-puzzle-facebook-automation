const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GRAPH_API_BASE = 'https://graph.facebook.com/v20.0';

/**
 * Exchange a short-lived Meta User Access Token for a Long-Lived (60-day) User Access Token
 */
async function exchangeLongLivedToken(shortLivedToken, appId, appSecret) {
  const url = `${GRAPH_API_BASE}/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) {
    throw new Error(`Token Exchange Error: ${data.error.message}`);
  }
  return data.access_token;
}

module.exports = { exchangeLongLivedToken };
