/**
 * Full-Screen Capybara Scene Video Generator Engine
 * Generates 100% full-screen 9:16 videos of Capybara in changing environments (on a bike, driving a car, at home, on the beach, in space) with new storylines and ElevenLabs voiceovers.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const { generateElevenLabsSpeech } = require('./elevenlabs_multi_key');

const capybaraScenes = [
  {
    location: 'Bicycle in Park',
    prompt: 'cute 3D Pixar Capybara character riding a tiny red bicycle in a sunny green park, full 9:16 vertical scene, Disney Pixar style, closed mouth, 8k render, vibrant colorful background',
    script: 'People ask me why I ride my bicycle every morning. It keeps me relaxed and ready to beat high scores! Try Flappy Earn today, free download link in bio!'
  },
  {
    location: 'Cool Sports Car',
    prompt: 'cute 3D Pixar Capybara character driving a cool miniature convertible sports car, wearing sunglasses, full 9:16 vertical scene, Disney Pixar style, closed mouth, 8k render, sunny city street',
    script: 'Cruising through the city like a boss! But when traffic hits, I play Block Puzzle: Block Royale to pass the time! Download for free link in bio!'
  },
  {
    location: 'Cozy Living Room',
    prompt: 'cute 3D Pixar Capybara character sitting on a cozy soft armchair with hot tea, full 9:16 vertical scene, Disney Pixar style, closed mouth, 8k render, warm living room background',
    script: 'Nothing beats a rainy day at home with a hot drink and a great puzzle game. Challenge your brain in Block Puzzle today!'
  },
  {
    location: 'Tropical Beach',
    prompt: 'cute 3D Pixar Capybara character lounging under a palm tree umbrella on a tropical beach, full 9:16 vertical scene, Disney Pixar style, closed mouth, 8k render, ocean view',
    script: 'Living the tropical beach life! 80 percent relaxing, 20 percent crushing records in Flappy Earn! Link in bio to download free!'
  }
];

async function fetchCapybaraSceneImage(promptText, outputPath) {
  console.log(`[AI Scene Generator] Rendering 9:16 full-screen scene image...`);
  console.log(`[Prompt]: "${promptText}"`);

  const encodedPrompt = encodeURIComponent(promptText);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1920&nologo=true&model=flux&seed=${Math.floor(Math.random() * 900000 + 100000)}`;

  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(outputPath);
    https.get(imageUrl, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch image: HTTP ${res.statusCode}`));
      }
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✅ Full-screen 9:16 scene image saved to ${outputPath}`);
        resolve(outputPath);
      });
    }).on('error', reject);
  });
}

async function renderFullCapybaraVideo(sceneIndex = 0) {
  const scene = capybaraScenes[sceneIndex % capybaraScenes.length];
  const tempDir = path.join(__dirname, '..', 'media', 'temp');
  const mediaDir = path.join(__dirname, '..', 'media', 'generated_videos');
  const artifactsDir = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2';

  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

  const sceneImgPath = path.join(tempDir, `capybara_${sceneIndex}.png`);
  const audioFileName = `capybara_voice_${sceneIndex}.mp3`;
  const outputVideoPath = path.join(mediaDir, `full_capybara_scene_${sceneIndex}.mp4`);
  const artifactVideoPath = path.join(artifactsDir, `full_capybara_scene_${sceneIndex}.mp4`);

  console.log('===========================================================');
  console.log(`🚀 GENERATING FULL-SCREEN CAPYBARA SCENE: [${scene.location.toUpperCase()}]`);
  console.log('===========================================================');

  // Step 1: Render 9:16 full-screen scene image
  await fetchCapybaraSceneImage(scene.prompt, sceneImgPath);

  // Step 2: Synthesize new ElevenLabs voiceover
  console.log(`[ElevenLabs] Synthesizing speech: "${scene.script}"...`);
  const audioPath = await generateElevenLabsSpeech(scene.script, 'JBFqnCBsd6RMkjVDRZzb', audioFileName);

  // Step 3: Render single full-screen 9:16 MP4 video
  const ffmpegExe = 'C:\\Users\\Vov\\AppData\\Local\\Microsoft\\WinGet\\Links\\ffmpeg.exe';
  console.log(`[FFmpeg] Rendering full-screen 9:16 video: ${outputVideoPath}...`);

  const cmd = `"${ffmpegExe}" -y -loop 1 -i "${sceneImgPath}" -i "${audioPath}" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest "${outputVideoPath}"`;
  execSync(cmd, { stdio: 'inherit' });

  fs.copyFileSync(outputVideoPath, artifactVideoPath);
  console.log(`🎉 COMPLETED FULL-SCREEN VIDEO: ${artifactVideoPath}`);

  return artifactVideoPath;
}

if (require.main === module) {
  renderFullCapybaraVideo(0).catch(console.error);
}

module.exports = { renderFullCapybaraVideo, capybaraScenes };
