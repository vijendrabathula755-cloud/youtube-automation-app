# 🚀 Quick Start Guide

## ⚡ Fastest Way to Get Started (5 minutes)

### Step 1: Install Dependencies

**Windows:**
```bash
install.bat
```

**macOS/Linux:**
```bash
bash install.sh
```

**Or manually:**
```bash
npm cache clean --force
npm install
```

### Step 2: Setup Environment

```bash
# Copy example env
cp .env.example .env
# or on Windows
copy .env.example .env
```

### Step 3: Get API Keys

**Groq API (FREE):**
1. Go to https://console.groq.com/
2. Sign up
3. Generate API key
4. Copy to `.env` as `GROQ_API_KEY`

**Google OAuth:**
1. Go to https://console.cloud.google.com/
2. Create new project
3. Enable "YouTube Data API v3"
4. Create OAuth 2.0 Desktop credentials
5. Add redirect: `http://localhost:3000/auth/google/callback`
6. Copy Client ID & Secret to `.env`

### Step 4: Run the App

```bash
npm run dev
```

Open: http://localhost:3000

---

## 🔧 If Installation Fails

### Error: "npm ERR! 404"

**Solution:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Error: "Module not found"

**Solution:**
```bash
npm install --save express express-session passport passport-google-oauth20 dotenv axios sqlite3 node-cron uuid lodash cors body-parser multer googleapis
```

### Error: "Port 3000 already in use"

**Solution:**
```bash
PORT=3001 npm run dev
```

### Still Not Working? Use Docker

```bash
docker build -t youtube-automation .
docker run -p 3000:3000 youtube-automation
```

---

## 📱 How to Use (After Installation)

### 1️⃣ Login
- Click "Login with Google"
- Authorize YouTube access

### 2️⃣ Connect Channels
- Go to "Channels"
- Select language (English, Hindi, Telugu)
- Choose format (Shorts or Long)
- Set upload time
- Click "Connect Channel" (max 3)

### 3️⃣ Generate Videos

**Automatic (Every Day):**
- Videos auto-generate at scheduled time
- Auto-upload to YouTube
- Monitor from dashboard

**Manual:**
- Dashboard → "Generate Video"
- Enter topic (optional)
- Watch progress

### 4️⃣ Monitor
- Dashboard shows all 3 channels
- Real-time status updates
- Video statistics

---

## 🎯 Features

✅ Multi-Language (English, Hindi, Telugu)
✅ AI Script Generation (Groq - FREE)
✅ Auto Video Creation
✅ Text-to-Speech
✅ Auto YouTube Upload
✅ Daily Scheduling
✅ 3 Channels Support
✅ Short & Long Videos
✅ Real-time Dashboard

---

## 📂 Environment Setup

Your `.env` should look like:

```env
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000

DATABASE_PATH=./database/app.db

GROQ_API_KEY=your_groq_key_here
GOOGLE_CLIENT_ID=your_google_id_here
GOOGLE_CLIENT_SECRET=your_google_secret_here
GOOGLE_REDIRECT_URL=http://localhost:3000/auth/google/callback

VIDEO_QUALITY=1080p
VIDEO_BITRATE=5000k
VIDEO_OUTPUT_DIR=./uploads/videos
TEMP_DIR=./temp

SCHEDULE_TIME=09:00
VIDEOS_PER_DAY=1
```

---

## ✨ Ready to Start?

```bash
# Install
bash install.sh  # or install.bat on Windows

# Setup
cp .env.example .env
# Edit .env with your API keys

# Run
npm run dev

# Open
# http://localhost:3000
```

**That's it! Your YouTube automation app is ready! 🎉**
