const express = require('express');
const router = express.Router();
const db = require('../database/init');

// Get dashboard data for all channels
router.get('/', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const channels = await db.getAllUserChannels(req.user.id);
    
    // Get stats for each channel
    const channelStats = await Promise.all(
      channels.map(async (channel) => {
        const videos = await db.getChannelVideos(channel.id);
        const uploadedCount = videos.filter(v => v.status === 'uploaded').length;
        const processingCount = videos.filter(v => v.status === 'processing').length;
        const failedCount = videos.filter(v => v.status === 'failed').length;

        return {
          ...channel,
          stats: {
            totalVideos: videos.length,
            uploadedVideos: uploadedCount,
            processingVideos: processingCount,
            failedVideos: failedCount,
          },
          recentVideos: videos.slice(0, 5),
        };
      })
    );

    res.json({
      user: req.user,
      channels: channelStats,
      totalChannels: channels.length,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
