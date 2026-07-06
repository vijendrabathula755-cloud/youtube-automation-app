const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/init');
const youtubeUploader = require('../services/youtubeUploader');

// Get all channels for user
router.get('/', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const channels = await db.getAllUserChannels(req.user.id);
    res.json(channels);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: error.message });
  }
});

// Connect new YouTube channel
router.post('/connect', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const channels = await db.getAllUserChannels(req.user.id);
    if (channels.length >= 3) {
      return res.status(400).json({ error: 'Maximum 3 channels allowed' });
    }

    // Get YouTube channel info
    const channelInfo = await youtubeUploader.getChannelInfo(req.user.googleAccessToken);

    const channel = {
      id: uuidv4(),
      userId: req.user.id,
      channelId: channelInfo.id,
      channelName: channelInfo.title,
      channelImage: channelInfo.thumbnail,
      language: req.body.language || 'english',
      videoFormat: req.body.videoFormat || 'long',
      uploadTime: req.body.uploadTime || '09:00',
    };

    await db.saveChannel(channel);
    res.json({ message: 'Channel connected successfully', channel });
  } catch (error) {
    console.error('Error connecting channel:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update channel settings
router.put('/:channelId', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { language, videoFormat, uploadTime } = req.body;
    const channelId = req.params.channelId;

    // Update in database
    const db_module = require('../database/init');
    db_module.db.run(
      'UPDATE channels SET language = ?, videoFormat = ?, uploadTime = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?',
      [language, videoFormat, uploadTime, channelId, req.user.id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Channel updated successfully' });
      }
    );
  } catch (error) {
    console.error('Error updating channel:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete channel
router.delete('/:channelId', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const channelId = req.params.channelId;
    const db_module = require('../database/init');

    db_module.db.run(
      'UPDATE channels SET isActive = 0 WHERE id = ? AND userId = ?',
      [channelId, req.user.id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Channel deleted successfully' });
      }
    );
  } catch (error) {
    console.error('Error deleting channel:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
