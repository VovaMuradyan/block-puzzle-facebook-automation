/**
 * Inspect Gradio Space API Parameters
 */
const { Client } = require('@gradio/client');

async function inspectGradioSpace(spaceName = 'THUDM/CogVideoX-5b-space') {
  console.log(`[Gradio Inspector] Connecting to space ${spaceName}...`);
  try {
    const client = await Client.connect(spaceName);
    const apiInfo = await client.view_api();
    console.log(`\n🎉 API Endpoints for ${spaceName}:`);
    console.log(JSON.stringify(apiInfo, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

if (require.main === module) {
  inspectGradioSpace('THUDM/CogVideoX-5b-space').catch(console.error);
}
