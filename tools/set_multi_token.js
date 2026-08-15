const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const token1 = 'EAAOljljEr9oBSFzEaTYDrryIcubnKExG4QI1uAPppBAuFopqSyKJHWbsPK8li8t5dZBVsWuYy6ZAMZAv3VnIWXw66WTVisWaqeUtWNqCUsgyFFXoZC0KD0aGzVlTJs0wkBUAumt5dSCofyDSzusmedSBZBkLCnLOZAY6vGTI1zk16ZCw7gXSsugGgxlS8AvgdKAtvqyDLUq3vKGpFDq26rSd3KNyNmd8Kx64HsQZCOEkY1NL72nxQE7Dpa1njm0b6AfaMb1fHksNXT93lEjvRg4JS5SIZBgZDZD';
const token2 = 'EAAPQQjOT6sUBSGc0n0SwSUE25wa19tZBJq0QFVXozL16pjgxeZAjGRlS0NcZBSJ4WufnJKhoijXAGxSXxw6F6RmZCr7PIClQoCRWJuSFo1omNwUfhh0r3iq59R5CeZBYm8kXs1glZBNVJhKTVbq6NHPJzVI9Y5sISL7B7goZAbny6rIENXdBZAQx7ITkMdmZCZAr5jXRWzbgV0vsjnZAc6ZBjPwE0l28wzQ50KcLhbwOQyYLorxPyCmSbGdsgbdpKkXjwfuMtgLZBrVMPjZAbYy95i7nS1rt46bwZDZD';

const combined = `${token1},${token2}`;
const projectDir = path.join(__dirname, '..');

// 1. Write to local .env file
fs.writeFileSync(path.join(projectDir, '.env'), `META_USER_ACCESS_TOKEN=${combined}\n`, 'utf8');
console.log('[+] Saved both Meta Access Tokens to local .env file.');

// 2. Update GitHub Actions secret
const ghToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
console.log('[+] Updating GitHub Actions secret META_USER_ACCESS_TOKEN...');

try {
  execSync(`powershell -Command "Set-Item Env:GH_TOKEN '${ghToken}'; gh secret set META_USER_ACCESS_TOKEN --body '${combined}' --repo VovaMuradyan/block-puzzle-facebook-automation"`, { stdio: 'inherit' });
  console.log('[+] GitHub Actions secret updated with BOTH tokens!');
} catch (err) {
  console.error('[-] Error setting GitHub secret:', err.message);
}
