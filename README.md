# 🎬 YouTube Automation App

An intelligent multi-language YouTube channel automation system that generates, processes, and uploads videos automatically.

## ✨ Features

✅ **Multi-Language Support**: Telugu, Hindi, English
✅ **Automated Script Generation**: AI-powered using Groq API (FREE)
✅ **Video Generation**: Dynamic video creation with animations
✅ **Text-to-Speech**: Native TTS in multiple languages
✅ **Auto Upload**: Scheduled uploads to connected channels
✅ **Multi-Channel Management**: Connect up to 3 YouTube channels
✅ **Format Support**: Short-form (Shorts) and long-form videos
✅ **Daily Scheduling**: One video per day automation
✅ **Unified Dashboard**: Monitor all channels in one view
✅ **Progress Tracking**: Real-time upload and processing status
✅ **Topic Optimization**: Customizable content categories
✅ **Completely FREE**: No paid dependencies

## 🚀 Installation

```bash
git clone https://github.com/vijendrabathula755-cloud/youtube-automation-app.git
cd youtube-automation-app
npm install
```

## ⚙️ Configuration

1. Create `.env` file:
```bash
cp .env.example .env
```

2. Get API keys:
   - **Groq API**: https://console.groq.com/ (FREE)
   - **Google OAuth**: https://console.cloud.google.com/
   - **YouTube API**: Enable YouTube Data API v3

3. Update `.env` with your credentials

## 🏃 Quick Start

```bash
npm run dev
```

Access: `http://localhost:3000`

## 📁 Project Structure

```
youtube-automation-app/
├── server.js                 # Main application
├── config/
│   ├── database.js
│   └── oauth.js
├── database/
│   ├── init.js
│   └── models.js
├── routes/
│   ├── auth.js
│   ├── channels.js
│   ├── videos.js
│   └── dashboard.js
├── controllers/
│   ├── authController.js
│   ├── channelController.js
│   ├── videoController.js
│   └── dashboardController.js
├── services/
│   ├── scriptGenerator.js    # AI script generation
│   ├── videoGenerator.js     # Video creation
│   ├── ttsService.js         # Text-to-speech
│   ├── youtubeUploader.js    # YouTube upload
│   └── scheduler.js          # Cron jobs
├── middleware/
│   └── auth.js
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── views/
│   ├── index.ejs
│   ├── dashboard.ejs
│   ├── channels.ejs
│   └── settings.ejs
└── uploads/
    └── videos/
```

## 🔑 Environment Variables

```env
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000
DATABASE_PATH=./database/app.db
GROQ_API_KEY=your_key_here
GOOGLE_CLIENT_ID=your_id_here
GOOGLE_CLIENT_SECRET=your_secret_here
GOOGLE_REDIRECT_URL=http://localhost:3000/auth/google/callback
VIDEO_QUALITY=1080p
VIDEO_BITRATE=5000k
SCHEDULE_TIME=09:00
```

## 📜 License

MIT
