# 🔐 Google OAuth Setup Guide (Real Mode)

## 📋 Step-by-Step Instructions

### **Step 1: Create Google Cloud Project**

1. Go to: https://console.cloud.google.com/
2. Sign in with your Google account
3. Click on **"Select a Project"** at the top
4. Click **"NEW PROJECT"**
5. Name it: `YouTube Automation App`
6. Click **"CREATE"**
7. Wait for project to be created (1-2 minutes)

---

### **Step 2: Enable YouTube Data API**

1. In Google Cloud Console, search for: **"YouTube Data API v3"**
2. Click on it
3. Click **"ENABLE"** button
4. Wait for it to enable

---

### **Step 3: Create OAuth Credentials**

1. Go to: **APIs & Services** → **Credentials** (left sidebar)
2. Click **"+ CREATE CREDENTIALS"** button
3. Select **"OAuth client ID"**
4. If prompted, configure OAuth consent screen:
   - Click **"CONFIGURE CONSENT SCREEN"**
   - Choose **"External"** (for personal use)
   - Click **"CREATE"**
   - Fill in:
     - **App name:** `YouTube Automation`
     - **User support email:** Your email
     - **Developer contact:** Your email
   - Click **"SAVE AND CONTINUE"**
   - Skip scopes (click "SAVE AND CONTINUE")
   - Add your email as test user
   - Click **"SAVE AND CONTINUE"** → **"BACK TO DASHBOARD"**

5. Now go back to **"Credentials"**
6. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
7. Select **"Desktop application"**
8. Name it: `YouTube Automation Local`
9. Click **"CREATE"**
10. Click **"DOWNLOAD JSON"** to save credentials
11. A popup shows your credentials - copy:
    - **Client ID**
    - **Client Secret**

---

### **Step 4: Add Authorized Redirect URI**

1. In the credentials page, click your newly created credential
2. Scroll to **"Authorized redirect URIs"**
3. Click **"ADD URI"**
4. Enter: `http://localhost:3000/auth/google/callback`
5. Click **"SAVE"**

---

### **Step 5: Update .env File**

Open `.env` in Notepad and update:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URL=http://localhost:3000/auth/google/callback
```

Replace:
- `your_client_id_here` with the Client ID from step 3
- `your_client_secret_here` with the Client Secret from step 3

---

### **Step 6: Get Groq API Key**

1. Go to: https://console.groq.com/
2. Sign up (FREE)
3. Go to **"API Keys"**
4. Click **"Create API Key"**
5. Copy the key
6. In `.env`, update:
   ```env
   GROQ_API_KEY=your_key_here
   ```

---

### **Step 7: Start the App**

```powershell
npm run dev
```

Open: **http://localhost:3000**

---

## ✅ Test It

1. Click **"Login with Google"**
2. Select your Google account
3. Click **"Allow"** when asked for permissions
4. You're logged in!

---

## 🎯 Features Now Available

✅ **Real YouTube Login**
✅ **Connect Your YouTube Channels**
✅ **Auto-generate Videos**
✅ **Upload to YouTube**
✅ **Daily Scheduling**
✅ **Multi-language Support**

---

## 🆘 Troubleshooting

### "Redirect URI mismatch"
**Solution:** Make sure `.env` has:
```env
GOOGLE_REDIRECT_URL=http://localhost:3000/auth/google/callback
```

### "Invalid Client ID"
**Solution:** Copy-paste from Google Console again, ensure no extra spaces

### "YouTube API not enabled"
**Solution:** Go to Google Cloud Console → enable YouTube Data API v3

### "This app isn't verified"
**This is normal for development!** Click **"Continue"** → **"Continue to YouTube Automation"**

---

## 📝 Summary

| What | Where |
|------|-------|
| Client ID | `.env` → `GOOGLE_CLIENT_ID` |
| Client Secret | `.env` → `GOOGLE_CLIENT_SECRET` |
| Groq API Key | `.env` → `GROQ_API_KEY` |
| Redirect URL | `http://localhost:3000/auth/google/callback` |

---

**You're all set! Your YouTube automation app is ready for real use! 🚀**
