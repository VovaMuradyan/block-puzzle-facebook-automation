const fs = require('fs');
const path = require('path');

const playStoreLink = 'https://play.google.com/store/apps/details?id=com.tetris.royale';

const hooks = [
  "Can you beat this score?",
  "Looks easy... until you try it! 😳",
  "One mistake and it's game over!",
  "What's your highest score in Block Puzzle?",
  "Think you can do better than this?",
  "This level gets way harder than it looks 🎮",
  "Try clearing this combo!",
  "Perfect move or complete disaster?",
  "You have one chance. What's your move?",
  "How fast can your brain process this grid?",
  "Mastering the block drop isn't as simple as it looks!",
  "Drop, blast, repeat! 💥",
  "Can you reach 10,000 points?",
  "Insane block combo finish!",
  "Satisfying line clears to start your day 🧩",
  "Who else loves a perfect block puzzle setup?",
  "Pure satisfying puzzle gameplay 🌟",
  "Double blast or save for triple? What would you do?",
  "Grid is almost full! Can we save it? 😱",
  "Blast & Drop action on mobile!",
  "Chill puzzle vibes or high stakes strategy?",
  "Rate this move from 1 to 10! 👇",
  "Smartest block placement of the day!",
  "When the last piece fits perfectly... 🤤",
  "Block puzzle lovers, this one is for you!"
];

const subtexts = [
  "Blast blocks and test your puzzle skills with Block Puzzle: Blast & Drop!",
  "Challenge your brain with fast-paced block matching action.",
  "No rush, just pure satisfying block clearing gameplay.",
  "Simple to pick up, insanely addictive to master.",
  "Can you keep the board clean before running out of space?",
  "Compete for the ultimate high score!",
  "Train your mind with daily block puzzle challenges.",
  "Clear lines, trigger massive combos, and break score records."
];

const ctas = [
  `Play now on Google Play: ${playStoreLink}`,
  `Download free on Google Play 👇\n${playStoreLink}`,
  `Try it yourself: ${playStoreLink}`,
  `Grab it free today: ${playStoreLink}`,
  `Join the fun: ${playStoreLink}`,
  `Link to play: ${playStoreLink}`,
  `Download Block Puzzle now: ${playStoreLink}`
];

const hashtags = [
  "#BlockPuzzle #Gaming #MobileGames #PuzzleGame #BrainTeaser #AndroidGames #Gamers #BlastAndDrop #BlockRoyale",
  "#Puzzle #MobileGaming #GamePlay #GamingCommunity #IndieGame #Android #FreeGames",
  "#Satisfying #BlockGame #BrainGame #Highscore #PuzzleAddict #Puzzles"
];

const captions = [];
let idCounter = 1;

for (let i = 0; i < hooks.length; i++) {
  for (let j = 0; j < subtexts.length; j++) {
    const hook = hooks[i];
    const subtext = subtexts[j];
    const cta = ctas[(i + j) % ctas.length];
    const hashtag = hashtags[(i * j) % hashtags.length];

    const fullCaption = `${hook}\n\n${subtext}\n\n${cta}\n\n${hashtag}`;
    
    captions.push({
      id: `cap_${String(idCounter).padStart(3, '0')}`,
      hook: hook,
      text: fullCaption
    });

    idCounter++;
    if (captions.length >= 200) break;
  }
  if (captions.length >= 200) break;
}

const outputPath = path.join(__dirname, '..', 'data', 'captions.json');
fs.writeFileSync(outputPath, JSON.stringify(captions, null, 2), 'utf8');
console.log(`Generated ${captions.length} captions in ${outputPath}`);
