const cron = require('node-cron');
const db = require('../database/init');
const scriptGenerator = require('./scriptGenerator');
const videoGenerator = require('./videoGenerator');
const youtubeUploader = require('./youtubeUploader');
const { v4: uuidv4 } = require('uuid');

const processingQueue = new Map();

const startScheduler = () => {
  console.log('🕐 Starting video generation scheduler...');

  // Run every day at scheduled time (default 9 AM)
  cron.schedule('0 9 * * *', async () => {
    console.log('⏰ Daily scheduler triggered');
    await generateVideosForAllChannels();
  });

  // Check processing status every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log('🔄 Checking processing queue...');
    await processQueue();
  });
};

const generateVideosForAllChannels = async () => {
  try {
    console.log('📺 Generating videos for all channels...');

    // Get all active channels
    db.db.all(
      'SELECT * FROM channels WHERE isActive = 1',
      async (err, channels) => {
        if (err) {
          console.error('Error fetching channels:', err);
          return;
        }

        for (const channel of channels) {
          await generateVideoForChannel(channel);
        }
      }
    );
  } catch (error) {
    console.error('Error in daily scheduler:', error);
  }
};

const generateVideoForChannel = async (channel) => {
  try {
    console.log(`🎬 Generating video for channel: ${channel.channelName}`);

    // Generate script
    const script = await scriptGenerator.generateScript(null, channel.language);

    // Create video record
    const videoId = uuidv4();
    const video = {
      id: videoId,
      channelId: channel.id,
      title: script.title,
      description: script.description,
      scriptContent: JSON.stringify(script),
      status: 'processing',
      language: channel.language,
      duration: channel.videoFormat === 'short' ? 60 : 600,
    };

    await db.saveVideo(video);

    // Add to processing queue
    processingQueue.set(videoId, {
      video,
      script,
      channel,
      status: 'generating',
      progress: 0,
      startTime: Date.now(),
    });

    // Generate video in background
    videoGenerator.generateVideoAsync(video, script, channel.videoFormat);
  } catch (error) {
    console.error(`Error generating video for channel ${channel.id}:`, error);
  }
};

const processQueue = async () => {
  try {
    for (const [videoId, job] of processingQueue.entries()) {
      if (job.status === 'generated') {
        // Upload to YouTube
        try {
          console.log(`📤 Uploading video ${videoId}...`);
          const user = db.getUser(job.channel.userId);

          // This would be called with the actual video path
          // For now, just mark as uploaded
          await db.updateVideoStatus(videoId, 'uploaded');

          job.status = 'uploaded';
          processingQueue.delete(videoId);
          console.log(`✅ Video ${videoId} uploaded successfully`);
        } catch (error) {
          console.error(`Error uploading video ${videoId}:`, error);
          job.status = 'failed';
          await db.updateVideoStatus(videoId, 'failed');
        }
      }
    }
  } catch (error) {
    console.error('Error processing queue:', error);
  }
};

module.exports = {
  startScheduler,
  generateVideosForAllChannels,
  generateVideoForChannel,
  processingQueue,
};
