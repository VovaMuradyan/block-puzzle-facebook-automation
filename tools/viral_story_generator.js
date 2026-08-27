/**
 * Viral AI Story & Video Generator Engine
 * Generates engaging 15-second viral animal storylines with native mobile game call-to-actions
 */
const fs = require('fs');
const path = require('path');

const viralStoryTemplates = [
  {
    type: 'fun_fact',
    story: "Did you know capybaras are so chill because they spend 80% of their day relaxing? But when I get bored...",
    cta: "I play Flappy Earn! Tap to fly and beat my high score! 🦫🎮",
    game: 'game2'
  },
  {
    type: 'life_hack',
    story: "3 secret rules to keep your brain sharp every day: Number 1, drink water. Number 2, get good sleep. Number 3...",
    cta: "Challenge your mind with Block Puzzle: Block Royale! 🧩",
    game: 'game1'
  },
  {
    type: 'funny_confession',
    story: "My owner thinks I'm sleeping all day, but secretely I'm training my gaming reflexes...",
    cta: "Check out Flappy Earn! Link in bio to download for free! 🐣✨",
    game: 'game2'
  },
  {
    type: 'challenge',
    story: "Only 1% of people can clear 5 lines in a row without making a single mistake. Think you have high IQ?",
    cta: "Prove it in Block Puzzle! Download free link in bio! 📲🔥",
    game: 'game1'
  },
  {
    type: 'mystery',
    story: "Raccoons don't actually wash their food because they like it clean, they do it to feel the texture! And when I want a real challenge...",
    cta: "I open Flappy Earn and try to beat level 50! 🦝🎮",
    game: 'game2'
  }
];

function generateRandomViralStory() {
  const selected = viralStoryTemplates[Math.floor(Math.random() * viralStoryTemplates.length)];
  const fullScript = `${selected.story} ${selected.cta}`;
  
  console.log('===========================================================');
  console.log('🎭 GENERATED NEW VIRAL STORYLINE SCRIPT');
  console.log('===========================================================');
  console.log(`[Category]: ${selected.type.toUpperCase()}`);
  console.log(`[Target Game]: ${selected.game.toUpperCase()}`);
  console.log(`[Full Script]: "${fullScript}"`);

  return { ...selected, fullScript };
}

if (require.main === module) {
  generateRandomViralStory();
}

module.exports = { generateRandomViralStory, viralStoryTemplates };
