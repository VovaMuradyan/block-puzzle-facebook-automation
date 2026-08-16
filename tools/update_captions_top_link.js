const fs = require('fs');
const path = require('path');

const g1Path = path.join(__dirname, '..', 'data', 'game1_captions.json');
const g2Path = path.join(__dirname, '..', 'data', 'game2_captions.json');

const g1Link = 'https://rebrand.ly/BlockPuzzlePlay-';
const g2Link = 'https://rebrand.ly/Flappy-Earn';

function prependTopLink(filePath, link, gameName) {
  if (!fs.existsSync(filePath)) return;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  data.forEach(item => {
    // Strip any existing link lines inside body
    let cleanText = item.text.replace(/Play now on Google Play:.*?\n/gi, '')
                             .replace(/Download free on Google Play 👇\nhttps:\/\/.*?\n/gi, '')
                             .replace(/Try it yourself:.*?\n/gi, '')
                             .replace(/Grab it free today:.*?\n/gi, '')
                             .replace(/Join the fun:.*?\n/gi, '')
                             .replace(/Link to play:.*?\n/gi, '')
                             .replace(/https:\/\/rebrand\.ly\/\S+/gi, '')
                             .trim();

    // Construct high-converting top-line text
    item.text = `👉 PLAY FREE ON GOOGLE PLAY: ${link} 👈\n\n${cleanText}`;
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`[+] Updated ${data.length} captions in ${path.basename(filePath)} with TOP-LINE link!`);
}

prependTopLink(g1Path, g1Link, 'Block Puzzle');
prependTopLink(g2Path, g2Link, 'Flappy Earn');
