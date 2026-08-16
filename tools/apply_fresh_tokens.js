const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { appConfig, exchangeForLongLivedToken } = require('./exchange_tokens');

const rawToken1 = 'EAAPQQjOT6sUBSO9m5Y7T8Y2gZBNTJmGQOsZBEPkNdscLUExClszqjdnrq996pCv4DG43Yz3PjzEleWnU3HC2SUId02RQvImbCxUpGZCJfV4BHSR4C4z0WLZBWVgZB5uIPFuKxChuYjYNX2CDXElDttxet1vLc9belIaLkOJqmRvjciC4ygMgclyl9nyXWOgybG1EXnRACvnGk2t7zvTxyufdj5EGWXZCErmvUvujg9QKs5nYE8vgohCBDVmP0szbVSSEtR39ICUtZAcjd9vh0wjJIHt';
const rawToken2 = 'EAAOljljEr9oBSPf4ZArjA0FPpIySsCqppNA7Fzsj4MmyVZBZASBTveACxsboZB1VgvAwP8hMwKylZBfOoi9j1CpPcR2xq51cWvREmz2DGEqbQGC0sdf6PCGd11ZCPsD2C60ZBFcYq7O9tBYghOl4xVYsZBxGQPTdt5ZCeXLlcli0VlrmfznM5VNYjRpkZAkwqQFeOQv88ytaW4yu3PEjVLPf2ZCScAfI8vzuOd2tCiXwSm6Fo8qFZAnyz3G146bFFJBfs20FvKJMEVbAnfWR0ZCZCMQ8OrpsIb';
const rawToken3 = 'EAAYsOFsJhFQBSGvcJCZBdhPQCQziwgiv4hZBY8nf0oCkYoHK3JXKCZBj9D6Cb6ESzUr4ZCCgeZCfp90YH5JsW4ntJhwkUo9HP25rih8ZAl39Ozf7wg06IWxvr2ZBwM5dupo9Jxge1YafrsEnyXjVdxnbvV7WIIUZBNvZCsolSoW75FFIKG9KHLkOaVZCAEjUghYwQ7StVeva7LX6AKYrHWDGnZCMtgk7xfNltlBt9FVALsZBcTIjOZA9UoMas8bZA63wPF85KHZBiZBhulcaTYH4WsZAwrSIUyX0A';

const rawTokens = [rawToken1, rawToken2, rawToken3];

async function main() {
  console.log('=====================================================');
  console.log('Starting 60-Day Long-Lived Token Exchange Process...');
  console.log('=====================================================');

  const upgradedTokens = [];

  for (let i = 0; i < rawTokens.length; i++) {
    const rawToken = rawTokens[i];
    const cfg = appConfig[i];
    console.log(`\nProcessing Account #${i + 1} with App ID ${cfg.appId}...`);
    const longToken = await exchangeForLongLivedToken(rawToken, cfg.appId, cfg.appSecret);
    upgradedTokens.push(longToken);
  }

  const combined = upgradedTokens.join(',');
  const projectDir = path.join(__dirname, '..');

  // 1. Update local .env file
  fs.writeFileSync(path.join(projectDir, '.env'), `META_USER_ACCESS_TOKEN=${combined}\n`, 'utf8');
  console.log('\n[+] Saved ALL 60-DAY LONG-LIVED TOKENS to local .env file.');

  // 2. Update set_multi_token.js
  const setTokenScript = `const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const combined = '${combined}';
const projectDir = path.join(__dirname, '..');

fs.writeFileSync(path.join(projectDir, '.env'), \`META_USER_ACCESS_TOKEN=\${combined}\\n\`, 'utf8');

const ghToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
try {
  execSync(\`powershell -Command "Set-Item Env:GH_TOKEN '\${ghToken}'; gh secret set META_USER_ACCESS_TOKEN --body '\${combined}' --repo VovaMuradyan/block-puzzle-facebook-automation"\`, { stdio: 'inherit' });
  console.log('[+] GitHub Actions secret updated with ALL 60-DAY LONG-LIVED TOKENS!');
} catch (err) {
  console.error('[-] Error setting GitHub secret:', err.message);
}
`;

  fs.writeFileSync(path.join(projectDir, 'tools', 'set_multi_token.js'), setTokenScript, 'utf8');

  // 3. Update GitHub Actions secret via gh CLI
  const ghToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (ghToken) {
    try {
      execSync(`powershell -Command "Set-Item Env:GH_TOKEN '${ghToken}'; gh secret set META_USER_ACCESS_TOKEN --body '${combined}' --repo VovaMuradyan/block-puzzle-facebook-automation"`, { stdio: 'inherit' });
      console.log('[+] GitHub Actions secret updated with ALL 60-DAY LONG-LIVED TOKENS!');
    } catch (err) {
      console.error('[-] Error setting GitHub secret:', err.message);
    }
  }
}

main().catch(console.error);
