const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/init');
const videoGenerator = require('../services/videoGenerator');

// Get videos for a channel
router.get('/:channelId', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const videos = await db.getChannelVideos(req.params.channelId);
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate and queue video for upload
router.post('/generate', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { channelId, topic, language, videoFormat } = req.body;

    // Generate script
    const scriptGenerator = require('../services/scriptGenerator');
    const script = await scriptGenerator.generateScript(topic, language);

    // Create video record
    const video = {
      id: uuidv4(),
      channelId,
      title: script.title,
      description: script.description,
      scriptContent: JSON.stringify(script),
      status: 'processing',
      language,
      duration: videoFormat === 'short' ? 60 : 600,
    };

    await db.saveVideo(video);

    // Start generation in background
    videoGenerator.generateVideoAsync(video, script, videoFormat);

    res.json({ message: 'Video generation started', videoId: video.id });
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get video processing status
router.get('/status/:videoId', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const videoId = req.params.videoId;
    const db_module = require('../database/init');

    db_module.db.get(
      'SELECT * FROM videos WHERE id = ?',
      [videoId],
      (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(row);
      }
    );
  } catch (error) {
    console.error('Error getting video status:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
