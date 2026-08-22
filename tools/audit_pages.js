const fs = require('fs');
const path = require('path');

const pageTokensPath = path.join(__dirname, '..', 'data', 'page_tokens.json');
const statePath = path.join(__dirname, '..', 'data', 'state.json');

const pageData = JSON.parse(fs.readFileSync(pageTokensPath, 'utf8'));
const pages = Object.values(pageData);
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));

const now = new Date();

console.log('===========================================================');
console.log(`📊 FULL PAGE AUDIT REPORT - ${now.toLocaleString('ru-RU')}`);
console.log('===========================================================');
console.log(`Total Pages Registered: ${pages.length}\n`);

let active24h = 0;
let inactive24h = 0;
let neverPosted = 0;

const auditList = [];

pages.forEach((page, index) => {
  const pageId = page.id;
  const pageName = page.name;
  const pageState = state.pages ? state.pages[pageId] || {} : {};

  const lastPostAt = pageState.last_post_at ? new Date(pageState.last_post_at) : null;
  const lastStatus = pageState.last_post_status || 'UNKNOWN';
  const lastError = pageState.last_error || pageState.error || 'None';

  let hoursAgo = null;
  let statusCategory = '';

  if (!lastPostAt) {
    neverPosted++;
    statusCategory = 'NEVER_POSTED';
  } else {
    hoursAgo = (now - lastPostAt) / (1000 * 60 * 60);
    if (hoursAgo <= 24) {
      active24h++;
      statusCategory = 'ACTIVE_24H';
    } else {
      inactive24h++;
      statusCategory = 'STALLED_OVER_24H';
    }
  }

  auditList.push({
    index: index + 1,
    id: pageId,
    name: pageName,
    lastPostAt: lastPostAt ? lastPostAt.toLocaleString('ru-RU') : 'Никогда',
    hoursAgo: hoursAgo !== null ? hoursAgo.toFixed(1) : 'N/A',
    statusCategory,
    lastStatus,
    lastError
  });
});

console.log(`✅ Active pages (posted within last 24h): ${active24h}`);
console.log(`⚠️ Stalled pages (no post in >24h): ${inactive24h}`);
console.log(`❌ Never posted pages: ${neverPosted}\n`);

console.log('--- DETAILED PAGE LIST ---');
auditList.forEach(p => {
  console.log(`[${p.index}] ${p.name} (ID: ${p.id})`);
  console.log(`    Последний пост: ${p.lastPostAt} (${p.hoursAgo} ч. назад)`);
  console.log(`    Категория: ${p.statusCategory} | Код: ${p.lastStatus}`);
  if (p.lastError && p.lastError !== 'None') {
    console.log(`    ⚠️ Причина / Ошибка: ${p.lastError}`);
  }
  console.log('-----------------------------------------------------------');
});
