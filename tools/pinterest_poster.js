/**
 * Pinterest Master Video Pin Publisher Engine
 * Calls automated browser uploader to create real 9:16 Video Pins with Google Play links directly on Pinterest
 */
const uploadPinterestVideoPin = require('./upload_to_pinterest_browser');

async function postToPinterest() {
  console.log('===========================================================');
  console.log('📌 EXECUTING PINTEREST 9:16 VIDEO PIN PUBLICATION');
  console.log('===========================================================');
  return await uploadPinterestVideoPin();
}

if (require.main === module) {
  postToPinterest().catch(console.error);
}

module.exports = postToPinterest;
