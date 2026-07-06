const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'app.db');
const db = new sqlite3.Database(dbPath);

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const initialize = () => {
  db.serialize(() => {
    // Users Table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        photo TEXT,
        googleAccessToken TEXT,
        googleRefreshToken TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Channels Table
    db.run(`
      CREATE TABLE IF NOT EXISTS channels (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        channelId TEXT UNIQUE,
        channelName TEXT,
        channelImage TEXT,
        language TEXT DEFAULT 'english',
        videoFormat TEXT DEFAULT 'long',
        uploadFrequency TEXT DEFAULT 'daily',
        uploadTime TEXT DEFAULT '09:00',
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      )
    `);

    // Videos Table
    db.run(`
      CREATE TABLE IF NOT EXISTS videos (
        id TEXT PRIMARY KEY,
        channelId TEXT NOT NULL,
        title TEXT,
        description TEXT,
        scriptContent TEXT,
        videoPath TEXT,
        status TEXT DEFAULT 'pending',
        uploadedAt DATETIME,
        youtubeVideoId TEXT,
        language TEXT,
        duration INTEGER,
        thumbnailPath TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(channelId) REFERENCES channels(id)
      )
    `);

    // Topics Table
    db.run(`
      CREATE TABLE IF NOT EXISTS topics (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        topic TEXT,
        category TEXT,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      )
    `);

    // Schedules Table
    db.run(`
      CREATE TABLE IF NOT EXISTS schedules (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        channelId TEXT,
        uploadTime TEXT,
        dayOfWeek TEXT,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id),
        FOREIGN KEY(channelId) REFERENCES channels(id)
      )
    `);

    // Processing Jobs Table
    db.run(`
      CREATE TABLE IF NOT EXISTS processingJobs (
        id TEXT PRIMARY KEY,
        videoId TEXT,
        jobType TEXT,
        status TEXT DEFAULT 'pending',
        progress INTEGER DEFAULT 0,
        errorMessage TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(videoId) REFERENCES videos(id)
      )
    `);
  });
};

const saveUser = (user) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO users (id, email, name, photo, googleAccessToken, googleRefreshToken, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [user.id, user.email, user.name, user.photo, user.googleAccessToken, user.googleRefreshToken],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

const getUser = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const getAllUserChannels = (userId) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM channels WHERE userId = ? ORDER BY createdAt DESC', [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const saveChannel = (channel) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO channels (id, userId, channelId, channelName, channelImage, language, videoFormat, uploadTime)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [channel.id, channel.userId, channel.channelId, channel.channelName, channel.channelImage, 
       channel.language || 'english', channel.videoFormat || 'long', channel.uploadTime || '09:00'],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

const saveVideo = (video) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO videos (id, channelId, title, description, scriptContent, videoPath, status, language, duration, thumbnailPath)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [video.id, video.channelId, video.title, video.description, video.scriptContent, video.videoPath, 
       video.status || 'pending', video.language, video.duration, video.thumbnailPath],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

const getChannelVideos = (channelId) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM videos WHERE channelId = ? ORDER BY createdAt DESC LIMIT 50',
      [channelId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
};

const updateVideoStatus = (videoId, status) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE videos SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [status, videoId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

module.exports = {
  db,
  initialize,
  saveUser,
  getUser,
  getAllUserChannels,
  saveChannel,
  saveVideo,
  getChannelVideos,
  updateVideoStatus,
};
