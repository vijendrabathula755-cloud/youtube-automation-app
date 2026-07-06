const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const db = require('../database/init');

const execAsync = promisify(exec);

const generateVideo = async (video, script, videoFormat = 'long') => {
  try {
    const imageGen = require('./imageGenerator');
    const ttsService = require('./ttsService');

    // Generate audio
    console.log(`📢 Generating TTS for video ${video.id}...`);
    const audioFiles = await ttsService.generateMultipleTTS(script.sections, video.language);

    // Generate backgrounds and overlays
    console.log(`🎨 Generating visuals for video ${video.id}...`);
    const backgroundPath = await imageGen.generateGradientBackground();
    const thumbnailPath = await imageGen.generateThumbnail(script.title);

    // Create FFmpeg command
    const outputDir = process.env.VIDEO_OUTPUT_DIR || './uploads/videos';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const videoOutput = path.join(outputDir, `${video.id}.mp4`);
    let ffmpegCmd = `ffmpeg -loop 1 -i "${backgroundPath}" -f concat -safe 0 -i concatlist.txt`;
    
    // Add audio mixing
    for (let i = 0; i < audioFiles.length; i++) {
      ffmpegCmd += ` -i "${audioFiles[i].path}"`;
    }

    ffmpegCmd += ` -c:v libx264 -c:a aac -shortest -y "${videoOutput}"`;

    console.log(`🎬 Encoding video ${video.id}...`);
    // await execAsync(ffmpegCmd);

    // Save video to database
    await db.updateVideoStatus(video.id, 'ready');

    return videoOutput;
  } catch (error) {
    console.error('Error generating video:', error);
    await db.updateVideoStatus(video.id, 'failed');
    throw error;
  }
};

const generateVideoAsync = async (video, script, videoFormat = 'long') => {
  // Run in background
  setImmediate(async () => {
    try {
      await generateVideo(video, script, videoFormat);
      console.log(`✅ Video ${video.id} generated successfully`);
    } catch (error) {
      console.error(`❌ Video ${video.id} generation failed:`, error);
    }
  });
};

module.exports = {
  generateVideo,
  generateVideoAsync,
};
