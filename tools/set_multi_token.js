const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const combined = 'EAAPQQjOT6sUBSGOCPRatYdwM0RrnKxaxzvzaXOHH0DEXLJknZBKpXaO5ZAA5LwHMP9HbZCAO00FNCaFk2UcdXJRtoWtqDNETyErzDgfmpg29u4RGMezCAFNSZBnXq05EDgA97ZC2PJefWq1IwksiCoYGb5fxWDwYmkZCZCeiXZCat8pZA2MZAP7KRpNaqYGVyBKvC9,EAAOljljEr9oBSJZCZBNA0ZANoZBJv5KSP0yNVNEBdCEJhycRXeUohvZBCdS2AV9CpZA3LfiQaLUSZBkZB1NvxZChQNqX14tqHxDksunEiI5ZB1ZCqg4QexfrZBtGxB8GZCCki83BrnZCHj6pZCOUhcju0ZBxhZC2SNTZA8W5PWF5jF57qDrAVEtceiFxmVFdVdKuAzexubgvow,EAAYsOFsJhFQBSI6ZAOqjWCw8nePLRNZBZB3MNzpj6TfJDZAa5thjC8Vq5yNZCz4os8YI336qPsQm7tG3FQl6Xj2OrHWkaxg43shJjcdbKHZBOaP9sMvxvkTsNugtFKQiqZBHR69jicngwSKZCPMJtiHtB5f9XH4sKdVxj8U8bbGpKPBxzcSOSk8hlIkimwlAxx3b';
const projectDir = path.join(__dirname, '..');

fs.writeFileSync(path.join(projectDir, '.env'), `META_USER_ACCESS_TOKEN=${combined}\n`, 'utf8');

const ghToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
try {
  execSync(`powershell -Command "Set-Item Env:GH_TOKEN '${ghToken}'; gh secret set META_USER_ACCESS_TOKEN --body '${combined}' --repo VovaMuradyan/block-puzzle-facebook-automation"`, { stdio: 'inherit' });
  console.log('[+] GitHub Actions secret updated with ALL 60-DAY LONG-LIVED TOKENS!');
} catch (err) {
  console.error('[-] Error setting GitHub secret:', err.message);
}
