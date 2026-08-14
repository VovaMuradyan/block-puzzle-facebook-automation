const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ghToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
if (!ghToken) {
  console.error('GH_TOKEN or GITHUB_TOKEN environment variable required.');
  process.exit(1);
}

const repoName = 'block-puzzle-facebook-automation';

async function main() {
  console.log(`[GitHub Setup] Checking / Creating repository '${repoName}' on GitHub...`);

  const res = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      'Authorization': `token ${ghToken}`,
      'User-Agent': 'Node.js',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: repoName,
      description: 'Autonomous Facebook Pages & Reels Publisher for Block Puzzle: Blast & Drop',
      private: false,
      auto_init: false
    })
  });

  const data = await res.json();
  if (res.status === 201) {
    console.log(`[+] Repository created successfully: ${data.html_url}`);
  } else if (res.status === 422 && data.errors?.[0]?.message?.includes('already exists')) {
    console.log(`[*] Repository '${repoName}' already exists. Proceeding with sync.`);
  } else {
    console.log(`[*] GitHub API Response (${res.status}):`, data.message || data);
  }

  const projectDir = path.join(__dirname, '..');
  
  // Create .gitignore
  const gitignoreContent = `node_modules/
.env
tools/get_meta_token.js
`;
  fs.writeFileSync(path.join(projectDir, '.gitignore'), gitignoreContent, 'utf8');

  // Initialize git & push
  const remoteUrl = `https://${ghToken}@github.com/VovaMuradyan/${repoName}.git`;
  
  try {
    execSync('git init', { cwd: projectDir });
    execSync('git config user.name "VovaMuradyan"', { cwd: projectDir });
    execSync('git config user.email "352465v@gmail.com"', { cwd: projectDir });
    execSync('git branch -M main', { cwd: projectDir });
    
    try {
      execSync('git remote remove origin', { cwd: projectDir, stdio: 'pipe' });
    } catch (e) {}
    
    execSync(`git remote add origin ${remoteUrl}`, { cwd: projectDir });
    
    execSync('git add .', { cwd: projectDir });
    execSync('git commit --amend -m "Initial commit: Autonomous Facebook Pages Publisher system"', { cwd: projectDir });
    execSync('git push -u origin main --force', { cwd: projectDir });
    
    console.log(`\n[+] SUCCESS! Code and media pushed to https://github.com/VovaMuradyan/${repoName}`);
  } catch (err) {
    console.error(`[-] Git push failed:`, err.message);
  }
}

main().catch(console.error);
