const fs = require('fs');
const path = require('path');

const g1Path = path.join(__dirname, '..', 'data', 'game1_captions.json');
const g2Path = path.join(__dirname, '..', 'data', 'game2_captions.json');

const g1Link = 'https://admin-portal-three.vercel.app/r/block-puzzle';
const g2Link = 'https://admin-portal-three.vercel.app/r/flappy-earn';

function prependTopLink(filePath, link) {
  if (!fs.existsSync(filePath)) return;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  data.forEach(item => {
    let cleanText = item.text.replace(/👉 PLAY FREE ON GOOGLE PLAY:.*?\n\n/gi, '')
                             .replace(/👉 PLAY FREE ON GOOGLE PLAY:.*?\n/gi, '')
                             .replace(/https:\/\/rebrand\.ly\/\S+/gi, '')
                             .replace(/https:\/\/admin-portal-three\.vercel\.app\/\S+/gi, '')
                             .trim();

    item.text = `👉 PLAY FREE ON GOOGLE PLAY: ${link} 👈\n\n${cleanText}`;
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`[+] Updated ${data.length} captions in ${path.basename(filePath)} with LIVE TRACKING LINK: ${link}`);
}

prependTopLink(g1Path, g1Link);
prependTopLink(g2Path, g2Link);
