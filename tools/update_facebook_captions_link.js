const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '..', 'data', 'game1_captions.json'),
  path.join(__dirname, '..', 'data', 'game2_captions.json'),
  path.join(__dirname, '..', 'data', 'captions.json')
];

const newLink = 'https://clck.ru/3VTmnq';

function updateCaptions() {
  console.log('===========================================================');
  console.log('🚀 UPDATING ALL FACEBOOK CAPTIONS WITH 2-GAMES LANDING LINK');
  console.log('===========================================================');
  console.log(`New Target Link: ${newLink}`);

  targetFiles.forEach(filePath => {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace all old links with new 2-games landing link
    const updatedContent = content.replace(/https:\/\/admin-portal-three\.vercel\.app\/r\/[a-zA-Z0-9_-]+/g, newLink)
                                   .replace(/https:\/\/play\.google\.com\/store\/apps\/details\?id=[a-zA-Z0-9_.]+/g, newLink);

    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`✅ Updated: ${path.basename(filePath)}`);
  });

  console.log('\n🎉 ALL Facebook captions successfully updated with 2-games landing link!');
}

updateCaptions();
