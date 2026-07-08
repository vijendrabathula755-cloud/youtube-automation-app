# YouTube Automation App - Complete Setup Guide

## 🎯 Prerequisites

- Node.js 16+ 
- FFmpeg installed
- Python 3.7+ (for TTS fallback)
- Google API credentials
- Groq API key

## ⚙️ Installation Steps

### 1️⃣ **Clone Repository**
```bash
git clone https://github.com/vijendrabathula755-cloud/youtube-automation-app.git
cd youtube-automation-app
```

### 2️⃣ **Install Dependencies**
```bash
npm install
```

### 3️⃣ **Install System Dependencies**

**For Windows (Chocolatey):**
```bash
choco install ffmpeg python
```

**For macOS (Homebrew):**
```bash
brew install ffmpeg python3
```

**For Linux (Ubuntu/Debian):**
```bash
sudo apt-get install ffmpeg python3 python3-pip
pip3 install gtts
```

### 4️⃣ **Setup Environment Variables**
```bash
cp .env.example .env
```

Edit `.env` and add:

```env
# Application
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000

# Database
DATABASE_PATH=./database/app.db

# Groq API (Get from https://console.groq.com/)
GROQ_API_KEY=your_groq_api_key_here

# Google OAuth (Get from https://console.cloud.google.com/)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URL=http://localhost:3000/auth/google/callback

# Video Settings
VIDEO_QUALITY=1080p
VIDEO_BITRATE=5000k
VIDEO_OUTPUT_DIR=./uploads/videos
TEMP_DIR=./temp

# Scheduler
SCHEDULE_TIME=09:00
VIDEOS_PER_DAY=1
```

### 5️⃣ **Setup Google OAuth**

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 Desktop Application credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

### 6️⃣ **Setup Groq API**

1. Go to https://console.groq.com/
2. Sign up (FREE)
3. Generate API key
4. Add to `.env` as `GROQ_API_KEY`

### 7️⃣ **Start the Application**

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

App will run on: http://localhost:3000

## 🎬 How to Use

### Step 1: Login
- Click "Login with Google"
- Authorize YouTube channel access

### Step 2: Connect Channels
- Go to "Channels" page
- Select language (English, Hindi, Telugu)
- Choose video format (Shorts or Long)
- Set upload time
- Click "Connect Channel" (repeat for up to 3 channels)

### Step 3: Generate Videos

**Automatic (Daily):**
- Videos generate automatically at scheduled time
- One video per day per channel
- Automatically uploads to YouTube

**Manual:**
- Go to Dashboard
- Click "Generate Video" on any channel
- Enter topic or leave blank for random
- Watch progress in real-time

### Step 4: Monitor Progress
- Dashboard shows all 3 channels in one view
- Real-time upload status
- Video counts (Total, Uploaded, Processing)
- Recent videos list

## 🐛 Troubleshooting

### Edge-TTS Not Working
**Solution:** App automatically falls back to Python gTTS
```bash
pip3 install gtts
```

### FFmpeg Not Found
**Windows:** Install from https://ffmpeg.org/download.html
**Mac:** `brew install ffmpeg`
**Linux:** `sudo apt-get install ffmpeg`

### Google Auth Failing
- Verify Client ID and Secret
- Check redirect URL matches exactly
- Clear browser cookies and try again

### Database Locked
```bash
rm database/app.db
npm run dev
```

### Port Already in Use
```bash
PORT=3001 npm run dev
```

## 📊 Features

✅ **Multi-Language Support**
- English
- Hindi (हिंदी)
- Telugu (తెలుగు)

✅ **Video Formats**
- Long-form (10+ minutes)
- YouTube Shorts (< 60 seconds)

✅ **Automatic Features**
- AI script generation (Groq)
- Video creation with animations
- Multi-language text-to-speech
- Auto-upload to YouTube
- Daily scheduling

✅ **Dashboard**
- Monitor 3 channels simultaneously
- Real-time progress tracking
- Video statistics
- Upload history

## 🔄 Workflow

```
1. Generate Script (Groq AI)
   ↓
2. Create Video (Canvas + FFmpeg)
   ↓
3. Generate TTS (Edge-TTS or Python)
   ↓
4. Merge Audio + Video
   ↓
5. Upload to YouTube
   ↓
6. Update Dashboard
```

## 📁 Project Structure

```
youtube-automation-app/
├── server.js                 # Main app
├── config/                   # Configuration
├── database/                 # Database setup
├── routes/                   # API routes
├── services/                 # Core services
│   ├── scriptGenerator.js   # AI script
│   ├── videoGenerator.js    # Video creation
│   ├── ttsService.js        # Text-to-speech
│   ├── youtubeUploader.js   # YouTube upload
│   └── scheduler.js         # Daily jobs
├── views/                    # EJS templates
├── public/                   # Frontend assets
├── uploads/                  # Video output
└── temp/                     # Temporary files
```

## 🚀 Deployment

### Heroku
```bash
heroku login
heroku create your-app-name
git push heroku main
```

### Docker
```bash
docker build -t youtube-automation .
docker run -p 3000:3000 youtube-automation
```

### AWS/GCP/Azure
See cloud deployment docs for your provider.

## 📝 License

MIT

## 💡 Tips

1. **Script Quality:** More detailed topics = better scripts
2. **Video Upload:** Ensure stable internet connection
3. **Scheduling:** Use off-peak times for faster uploads
4. **Monitoring:** Check dashboard regularly for any failures
5. **API Limits:** Groq free tier = 14,400 requests/day

## 🆘 Support

- Check GitHub Issues
- Read troubleshooting section
- Check server logs for errors

---

**Made with ❤️ for YouTube Creators**
