const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const token1 = 'EAAPQQjOT6sUBSLpi9g6rVnJZBpGjMepmNEoTkdfUD3lt9cmepKCmJA0ZAIoBHCZCcdHcFcLOlmE9cZCURA9pZAZB9PoOVNvJq5ck6e0zfsdu8ThdCyYrTfkB9gp2U4EI5zAxwRdtSPVL7BCsTKYPiSUhSsppfEnk3dsCG9GGlQ0narEZBYrLZCEmxZAbjzD5AhZCxstV3ReoWxPrS7FUmtpgypZCXNtBe393EnALqEEvxKbNz4oCJRx7Ez58Sekf7a7Ydq7C1Q6mhhyRUelkrhViWOm3j9E';
const token2 = 'EAAYsOFsJhFQBSEVA5XJnvmVEcOWQKV12YvKYq7s3YYtOSw9f65cyZCgw7eE5ZAlZBh6ajB91lhPc0aVnWS1LgjCDvB5Bdxv2WieWf951qh4xPd0B90e15fo1430z4phm9wpSTzQehxs8ZCuuLSmeaWam0ABSJOZCyW3P1Y851SBloy479lz7qG752XyinGl1KGqANvrZCnz90bwlcDzPG4ESZBBtSBtIcfdFWhgVp9XFcamZBivVpJluudZALMtnR4D5R3NQS1ZAqZCWzvoIqIspr5v92Vo';
const token3 = 'EAAOljljEr9oBSJPapikWiZA8yZAgpQ2ZAYI7YXlpx16WWAZCZCEIedqeElcjTpZCezuZAWbpNS9mJp1LBtiZAonZAqkNMb98nEItn5fTzVvLjzW7UVOcMfaH2VDmeUTQBUaHDjD8ZAMwvQeOZBHrkgMpWKaUGFgDnzB5UcZB2wokqUdE3VGvNAXKosdTzjhvWdMMR2tWaLd8ij6uYzrHzJwg08cpNIzAsfcdL1GO37IsHNIcc7xwcSIIFxpI5kyeZANhjqHtj6RcFy38j3Q8wmpaJevVGlydE';

const combined = `${token1.trim()},${token2.trim()},${token3.trim()}`;
const projectDir = path.join(__dirname, '..');

// 1. Write to local .env file
fs.writeFileSync(path.join(projectDir, '.env'), `META_USER_ACCESS_TOKEN=${combined}\n`, 'utf8');
console.log('[+] Saved all 3 FRESH Meta Access Tokens to local .env file.');

// 2. Update GitHub Actions secret
const ghToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
console.log('[+] Updating GitHub Actions secret META_USER_ACCESS_TOKEN...');

try {
  execSync(`powershell -Command "Set-Item Env:GH_TOKEN '${ghToken}'; gh secret set META_USER_ACCESS_TOKEN --body '${combined}' --repo VovaMuradyan/block-puzzle-facebook-automation"`, { stdio: 'inherit' });
  console.log('[+] GitHub Actions secret updated with ALL 3 FRESH TOKENS!');
} catch (err) {
  console.error('[-] Error setting GitHub secret:', err.message);
}
