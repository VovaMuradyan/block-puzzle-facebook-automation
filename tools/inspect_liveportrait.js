/**
 * Inspect KwaiVGI/LivePortrait Gradio Space API Parameters
 */
const { Client } = require('@gradio/client');

async function inspectLivePortraitSpace() {
  console.log('[Gradio Inspector] Connecting to KwaiVGI/LivePortrait space...');
  try {
    const client = await Client.connect('KwaiVGI/LivePortrait');
    const apiInfo = await client.view_api();
    console.log(`\n🎉 LivePortrait API Endpoints:`);
    console.log(JSON.stringify(apiInfo, null, 2).substring(0, 1500));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

inspectLivePortraitSpace();
