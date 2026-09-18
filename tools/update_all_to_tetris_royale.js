/**
 * Mass Updater: Set 100% Direct Google Play Link (com.tetris.royale) Across Entire Project
 * Replaces any intermediate landing pages, rebrand.ly, clck.ru, or second game links.
 */
const fs = require('fs');
const path = require('path');

const directGooglePlayLink = 'https://play.google.com/store/apps/details?id=com.tetris.royale';

// 1. Generate 100 High-Engagement Block Puzzle Captions with Direct Link
const hooks = [
  "🎮 CAN YOU BEAT THIS BLOCK PUZZLE HIGH SCORE? 🏆",
  "🧠 ONLY 1% OF PLAYERS CAN CLEAR THIS GRID! 🧩",
  "⚡ SATISFYING 5X COMBO CLEAR! CAN YOU DO BETTER?",
  "🔥 TRY NOT TO GET ADDICTED TO THIS BLOCK PUZZLE! 😱",
  "🤯 LOOKS EASY UNTIL THE BOARD FILLS UP! TEST YOUR BRAIN! 🧠",
  "💎 ULTIMATE BLOCK BLAST STRATEGY! BEAT THE LEVEL! 🚀",
  "💥 PERFECT CLEAR! CAN YOU REACH 10,000 POINTS?",
  "👑 BLOCK ROYALE: THE MOST ADDICTIVE BRAIN TEASER OF 2026!"
];

const bodies = [
  "Fit the blocks, clear full lines, and unleash massive combo streaks!\nNo wifi needed — enjoy endless smooth brain training anytime.",
  "Relax your mind and sharpen your IQ with fast-paced, satisfying block dropping action!\nChallenge your friends and claim the #1 spot on the leaderboard.",
  "Simple to learn, impossible to put down! Every block placement counts — plan your moves and keep the board clean.",
  "The ultimate classic block puzzle reimagined! Smooth animations, explosive line clears, and infinite levels.",
  "Looking for the best brain teaser to kill time and train your logic? This is the one you need."
];

const hashtags = "#BlockPuzzle #BlockRoyale #Tetris #PuzzleGame #BrainTeaser #AndroidGames #MobileGaming #FreeGames #Gamers #SatisfyingGame";

const generatedCaptions = [];
for (let i = 0; i < 100; i++) {
  const hook = hooks[i % hooks.length];
  const body = bodies[i % bodies.length];
  const capId = `cap_${String(i + 1).padStart(3, '0')}`;

  const text = `${hook}\n\n📲 PLAY FREE ON GOOGLE PLAY 👇\n👉 ${directGooglePlayLink}\n\n${body}\n\n👇 TAP TO INSTALL NOW 👇\n👉 ${directGooglePlayLink}\n\n${hashtags}`;

  generatedCaptions.push({
    id: capId,
    hook: hook,
    text: text
  });
}

// Write to captions.json & game1_captions.json & game2_captions.json
const dataDir = path.join(__dirname, '..', 'data');
fs.writeFileSync(path.join(dataDir, 'captions.json'), JSON.stringify(generatedCaptions, null, 2), 'utf8');
fs.writeFileSync(path.join(dataDir, 'game1_captions.json'), JSON.stringify(generatedCaptions, null, 2), 'utf8');
fs.writeFileSync(path.join(dataDir, 'game2_captions.json'), JSON.stringify(generatedCaptions, null, 2), 'utf8');
console.log('✅ Generated 100 High-Engagement Captions in data/captions.json with direct link!');

// 2. Update src/facebook.js to force direct Google Play CTA
const facebookJsPath = path.join(__dirname, '..', 'src', 'facebook.js');
if (fs.existsSync(facebookJsPath)) {
  let fbCode = fs.readFileSync(facebookJsPath, 'utf8');
  fbCode = fbCode.replace(/let ctaUrl = [^;]+;/, `let ctaUrl = '${directGooglePlayLink}';`);
  fbCode = fbCode.replace(/const match = caption\.match\([^\)]+\);[^\n]*\n\s*if \(match\) ctaUrl = match\[0\];/, `let ctaUrl = '${directGooglePlayLink}';`);
  fs.writeFileSync(facebookJsPath, fbCode, 'utf8');
  console.log('✅ Updated src/facebook.js CTA link to direct Google Play URL!');
}

// 3. Update upload_to_tiktok_browser.js, upload_to_youtube_browser.js, pinterest, reddit
const tiktokPath = path.join(__dirname, 'upload_to_tiktok_browser.js');
if (fs.existsSync(tiktokPath)) {
  let code = fs.readFileSync(tiktokPath, 'utf8');
  code = code.replace(/https:\/\/rebrand\.ly\/[^\s\n"']+/g, directGooglePlayLink);
  code = code.replace(/https:\/\/clck\.ru\/[^\s\n"']+/g, directGooglePlayLink);
  fs.writeFileSync(tiktokPath, code, 'utf8');
  console.log('✅ Updated TikTok browser uploader link!');
}

const ytPath = path.join(__dirname, 'upload_to_youtube_browser.js');
if (fs.existsSync(ytPath)) {
  let code = fs.readFileSync(ytPath, 'utf8');
  code = code.replace(/https:\/\/rebrand\.ly\/[^\s\n"']+/g, directGooglePlayLink);
  code = code.replace(/https:\/\/clck\.ru\/[^\s\n"']+/g, directGooglePlayLink);
  fs.writeFileSync(ytPath, code, 'utf8');
  console.log('✅ Updated YouTube Shorts uploader link!');
}

const pinterestPath = path.join(__dirname, 'upload_to_pinterest_browser.js');
if (fs.existsSync(pinterestPath)) {
  let code = fs.readFileSync(pinterestPath, 'utf8');
  code = code.replace(/https:\/\/rebrand\.ly\/[^\s\n"']+/g, directGooglePlayLink);
  code = code.replace(/https:\/\/clck\.ru\/[^\s\n"']+/g, directGooglePlayLink);
  fs.writeFileSync(pinterestPath, code, 'utf8');
  console.log('✅ Updated Pinterest uploader link!');
}

const redditPath = path.join(__dirname, 'upload_to_reddit_browser.js');
if (fs.existsSync(redditPath)) {
  let code = fs.readFileSync(redditPath, 'utf8');
  code = code.replace(/https:\/\/rebrand\.ly\/[^\s\n"']+/g, directGooglePlayLink);
  code = code.replace(/https:\/\/clck\.ru\/[^\s\n"']+/g, directGooglePlayLink);
  fs.writeFileSync(redditPath, code, 'utf8');
  console.log('✅ Updated Reddit uploader link!');
}

console.log('🎉 ALL PROJECT FILES SUCCESSFULLY UPDATED TO DIRECT GOOGLE PLAY LINK!');
