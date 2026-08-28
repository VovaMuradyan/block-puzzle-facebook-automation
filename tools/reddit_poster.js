/**
 * Reddit Master Post Publisher Engine
 * Calls automated browser poster to submit real posts & Google Play links directly to r/AndroidGaming & r/CasualGames
 */
const uploadRedditPost = require('./upload_to_reddit_browser');

async function postToReddit() {
  console.log('===========================================================');
  console.log('🤖 EXECUTING REDDIT SUBMISSION PUBLICATION');
  console.log('===========================================================');
  return await uploadRedditPost();
}

if (require.main === module) {
  postToReddit().catch(console.error);
}

module.exports = postToReddit;
