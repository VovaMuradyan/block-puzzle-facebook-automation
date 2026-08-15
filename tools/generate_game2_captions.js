const fs = require('fs');
const path = require('path');

const trackedPlayStoreLink = 'https://rebrand.ly/Flappy-Earn';

const hooks = [
  "Can you flap past obstacle 50? 🐣",
  "One tap too late and it's game over! 😳",
  "How far can you fly in Flappy Earn?",
  "Looks easy... until you try to pass level 1!",
  "What's your high score in Flappy Earn?",
  "Think you have faster reflexes than this? ⚡",
  "Mastering the rhythm is harder than it looks!",
  "Can you beat this crazy high score flight?",
  "Perfect timing or complete crash?",
  "Tap, fly, earn, repeat! 🎮",
  "How fast are your tapping skills?",
  "Insane high score run on Flappy Earn!",
  "Satisfying arcade flight gameplay 🌟",
  "Who else loves a great arcade challenge?",
  "Pure tap-to-fly adrenaline!",
  "Who can beat this high score? Challenge accepted! 👇",
  "Flappy arcade action on mobile!",
  "Chill arcade vibes or intense tap reflexes?",
  "Rate this flight score from 1 to 10! 👇",
  "Smartest tap timing of the day!",
  "Flappy Earn players, this one is for you!"
];

const subtexts = [
  "Tap to fly and test your arcade reflexes with Flappy Earn!",
  "Challenge your friends to break your highest flight record.",
  "Simple one-tap controls, insanely addictive arcade gameplay.",
  "Can you keep your bird flying through daily obstacle challenges?",
  "Compete for the ultimate high score on Google Play!",
  "Train your timing and concentration with Flappy Earn."
];

const ctas = [
  `Play Flappy Earn now: ${trackedPlayStoreLink}`,
  `Download free on Google Play 👇\n${trackedPlayStoreLink}`,
  `Try it yourself: ${trackedPlayStoreLink}`,
  `Grab it free today: ${trackedPlayStoreLink}`,
  `Join the flight: ${trackedPlayStoreLink}`,
  `Link to play: ${trackedPlayStoreLink}`
];

const hashtags = [
  "#FlappyEarn #Gaming #MobileGames #ArcadeGame #TapToFly #AndroidGames #Gamers #FreeGames #Arcade",
  "#Flappy #MobileGaming #GamePlay #GamingCommunity #IndieGame #Android #ArcadeAction",
  "#Highscore #TapGame #ReflexGame #ArcadeAddict"
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
      id: `flappy_cap_${String(idCounter).padStart(3, '0')}`,
      hook: hook,
      text: fullCaption
    });

    idCounter++;
    if (captions.length >= 200) break;
  }
  if (captions.length >= 200) break;
}

const outputPath = path.join(__dirname, '..', 'data', 'game2_captions.json');
fs.writeFileSync(outputPath, JSON.stringify(captions, null, 2), 'utf8');
console.log(`Generated ${captions.length} Flappy Earn captions in ${outputPath}`);
