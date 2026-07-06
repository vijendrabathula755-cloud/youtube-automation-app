const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/init');

// Get schedules for user
router.get('/', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const db_module = require('../database/init');
    db_module.db.all(
      'SELECT * FROM schedules WHERE userId = ?',
      [req.user.id],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
      }
    );
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create schedule
router.post('/', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { channelId, uploadTime, dayOfWeek } = req.body;
    const scheduleId = uuidv4();
    const db_module = require('../database/init');

    db_module.db.run(
      `INSERT INTO schedules (id, userId, channelId, uploadTime, dayOfWeek, isActive)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [scheduleId, req.user.id, channelId, uploadTime, dayOfWeek],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Schedule created', scheduleId });
      }
    );
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
