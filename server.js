require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

// Create required directories
const dirs = [process.env.TEMP_DIR || './temp', process.env.VIDEO_OUTPUT_DIR || './uploads/videos', './database'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Initialize Database
const db = require('./database/init');
try {
  db.initialize();
  console.log('✅ Database initialized');
} catch (error) {
  console.error('❌ Database initialization error:', error.message);
}

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'youtube-automation-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

try {
  require('./config/oauth')(passport);
  console.log('✅ OAuth configured');
} catch (error) {
  console.error('⚠️  OAuth configuration warning:', error.message);
}

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api/channels', require('./routes/channels'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/schedule', require('./routes/schedule'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Views
app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('dashboard', { user: req.user });
});

app.get('/channels', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('channels', { user: req.user });
});

app.get('/settings', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('settings', { user: req.user });
});

// Start Scheduler
try {
  const scheduler = require('./services/scheduler');
  scheduler.startScheduler();
  console.log('✅ Scheduler started');
} catch (error) {
  console.error('⚠️  Scheduler error:', error.message);
}

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Application error:', err);
  res.status(err.status || 500).json({ 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!' 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗`);
  console.log(`║  🚀 YouTube Automation App Running                   ║`);
  console.log(`║  ✅ Port: ${PORT}`);
  console.log(`║  🌐 URL: http://localhost:${PORT}`);
  console.log(`║  📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`╚════════════════════════════════════════════════════════╝
`);
});

module.exports = app;
