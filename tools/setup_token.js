const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const token = process.argv[2];

if (!token) {
  console.error('Usage: node tools/setup_token.js <META_USER_ACCESS_TOKEN>');
  process.exit(1);
}

const projectDir = path.join(__dirname, '..');

// 1. Write .env file locally
fs.writeFileSync(path.join(projectDir, '.env'), `META_USER_ACCESS_TOKEN=${token}\n`, 'utf8');
console.log('[+] Saved token to local .env');

// 2. Set GitHub Actions Secret
const ghToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
try {
  console.log('[+] Setting GitHub Secret META_USER_ACCESS_TOKEN...');
  execSync(`powershell -Command "Set-Item Env:GH_TOKEN '${ghToken}'; echo '${token}' | gh secret set META_USER_ACCESS_TOKEN --repo VovaMuradyan/block-puzzle-facebook-automation"`, { stdio: 'inherit' });
  console.log('[+] GitHub Actions Secret updated successfully!');
} catch (err) {
  console.error('[-] Failed to set GitHub secret:', err.message);
}

// 3. Test Publisher locally
console.log('\n======================================================');
console.log('[+] Running local publisher verification...');
console.log('======================================================\n');

try {
  execSync('node src/publisher.js', { cwd: projectDir, stdio: 'inherit', env: { ...process.env, META_USER_ACCESS_TOKEN: token } });
  
  // 4. Commit updated state
  console.log('\n[+] Syncing updated state to GitHub...');
  execSync('git add data/state.json', { cwd: projectDir });
  execSync('git commit -m "Update state after test run [skip ci]"', { cwd: projectDir });
  execSync(`powershell -Command "Set-Item Env:GH_TOKEN '${ghToken}'; git push"`, { cwd: projectDir });
  
  // 5. Trigger GitHub Actions Workflow
  console.log('\n[+] Triggering GitHub Actions cloud workflow...');
  execSync(`powershell -Command "Set-Item Env:GH_TOKEN '${ghToken}'; gh workflow run publisher.yml --repo VovaMuradyan/block-puzzle-facebook-automation"`, { stdio: 'inherit' });

  console.log('\n======================================================');
  console.log('🎉 COMPLETE CLOUD AUTOMATION VERIFIED!');
  console.log('Repository: https://github.com/VovaMuradyan/block-puzzle-facebook-automation');
  console.log('Actions: https://github.com/VovaMuradyan/block-puzzle-facebook-automation/actions');
  console.log('======================================================\n');
} catch (err) {
  console.error('[-] Local publisher test failed:', err.message);
}
