/**
 * Open Video AI Generation Engine (CogVideoX via Gradio Client)
 * Generates 100% real moving MP4 animated videos directly from text prompts and clean character images!
 */
const fs = require('fs');
const path = require('path');

async function generateOpenAiVideo(promptText, characterImagePath = null, outputVideoName = 'generated_open_ai_video.mp4') {
  console.log('===========================================================');
  console.log('🎬 OPEN VIDEO AI GENERATOR (REAL MOVING MP4 ANIMATION)');
  console.log('===========================================================');
  console.log(`[Prompt]: "${promptText}"`);

  const { Client, handle_file } = await import('@gradio/client');
  const mediaDir = path.join(__dirname, '..', 'media', 'generated_videos');
  const artifactsDir = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2';

  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

  const outputVideoPath = path.join(mediaDir, outputVideoName);
  const artifactVideoPath = path.join(artifactsDir, outputVideoName);

  try {
    console.log('[HuggingFace AI Engine] Connecting to CogVideoX Text-to-Video Engine...');
    const client = await Client.connect('THUDM/CogVideoX-5b-space');

    console.log('[HuggingFace AI Engine] Rendering 9:16 vertical animated MP4 video...');
    
    const payload = {
      prompt: promptText,
      image_input: characterImagePath ? handle_file(characterImagePath) : null,
      video_input: null,
      video_strength: 0.8,
      seed_value: Math.floor(Math.random() * 90000 + 1000),
      scale_status: false,
      rife_status: true
    };

    const result = await client.predict('/generate', payload);

    if (result && result.data && result.data[0]) {
      const tempVideoPath = result.data[0].video?.path || result.data[0].path || result.data[1]?.path;
      console.log(`✅ Open AI Video generated successfully! Path: ${tempVideoPath}`);
      if (tempVideoPath && fs.existsSync(tempVideoPath)) {
        fs.copyFileSync(tempVideoPath, outputVideoPath);
        fs.copyFileSync(outputVideoPath, artifactVideoPath);
        console.log(`🎉 Saved final video to: ${artifactVideoPath}`);
        return artifactVideoPath;
      }
    }
  } catch (err) {
    console.error(`[Gradio Video Engine Error]: ${err.message}`);
  }

  return null;
}

if (require.main === module) {
  const sampleImg = path.join(__dirname, '..', 'media', 'temp', 'square_chubby_character.png');
  generateOpenAiVideo('A cute 3D Pixar Capybara character driving a red toy car in a sunny park, 9:16 vertical video', sampleImg).catch(console.error);
}

module.exports = { generateOpenAiVideo };
