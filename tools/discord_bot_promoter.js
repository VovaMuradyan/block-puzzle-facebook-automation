/**
 * Discord Gaming Broadcast Engine
 * Sends rich video embeds & cards to Discord gaming channels via Webhooks / Bot API
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const socialStatePath = path.join(__dirname, '..', 'data', 'social_state.json');

const discordWebhooks = [
  process.env.DISCORD_WEBHOOK_URL_1,
  process.env.DISCORD_WEBHOOK_URL_2
].filter(Boolean);

const discordCards = [
  {
    title: '🧩 Block Puzzle: Royale - New Casual Mobile Game!',
    description: 'Satisfying line clearing, classic puzzle mechanics, and high-score leaderboards on Android!',
    url: 'https://play.google.com/store/apps/details?id=com.tetris.royale',
    color: 3447003, // Blue
    fields: [
      { name: 'Platform', value: 'Google Play (Android)', inline: true },
      { name: 'Price', value: '100% Free', inline: true }
    ],
    image: { url: 'https://image.pollinations.ai/prompt/cute%203D%20dog%20playing%20block%20puzzle?width=600&height=338' }
  },
  {
    title: '🦫 Flappy Earn - Cute Animals Arcade Challenge!',
    description: 'Fly with cute Capybaras, Raccoons, and Otters! Test your reflexes and set world records.',
    url: 'https://play.google.com/store/apps/details?id=com.vov.brainfit.brainfit',
    color: 15105570, // Orange
    fields: [
      { name: 'Platform', value: 'Google Play (Android)', inline: true },
      { name: 'Price', value: '100% Free', inline: true }
    ],
    image: { url: 'https://image.pollinations.ai/prompt/cute%203D%20pixar%20capybara%20flying?width=600&height=338' }
  }
];

async function broadcastToDiscordWebhook(webhookUrl, embedCard) {
  const postData = JSON.stringify({
    username: 'Mobile Gaming Promoter',
    avatar_url: 'https://image.pollinations.ai/prompt/mobile%20game%20logo?width=200&height=200',
    content: `🎮 **New Mobile Game Recommendation!** Download free on Google Play: ${embedCard.url}`,
    embeds: [embedCard]
  });

  const parsedUrl = new URL(webhookUrl);

  const options = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`[Discord Webhook] Status: ${res.statusCode}`);
        if (res.statusCode === 204 || res.statusCode === 200) {
          console.log('🎉 DISCORD EMBED BROADCASTED SUCCESSFULLY!');
          resolve(true);
        } else {
          console.log(`Response: ${body}`);
          resolve(false);
        }
      });
    });
    req.on('error', console.error);
    req.write(postData);
    req.end();
  });
}

async function runDiscordBroadcast() {
  console.log('===========================================================');
  console.log('👾 DISCORD GAMING BROADCAST ENGINE');
  console.log('===========================================================');

  const card = discordCards[Math.floor(Math.random() * discordCards.length)];

  if (discordWebhooks.length === 0) {
    console.log('[Discord Note] Webhook URL missing in environment. Saving card to data/discord_pending_queue.json...');
    const pendingPath = path.join(__dirname, '..', 'data', 'discord_pending_queue.json');
    let queue = [];
    if (fs.existsSync(pendingPath)) queue = JSON.parse(fs.readFileSync(pendingPath, 'utf8'));
    queue.push({ ...card, queuedAt: new Date().toISOString() });
    fs.writeFileSync(pendingPath, JSON.stringify(queue, null, 2));
    console.log('✅ Saved broadcast card to data/discord_pending_queue.json!');
    return true;
  }

  for (const url of discordWebhooks) {
    await broadcastToDiscordWebhook(url, card);
  }
}

if (require.main === module) {
  runDiscordBroadcast().catch(console.error);
}

module.exports = runDiscordBroadcast;
