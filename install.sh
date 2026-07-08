#!/bin/bash

echo "🚀 YouTube Automation App - Installation Script"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 14+"
    exit 1
fi
echo "  Node version: $(node -v)"

# Check npm
echo "✓ Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi
echo "  npm version: $(npm -v)"

# Clear npm cache
echo ""
echo "🧹 Clearing npm cache..."
npm cache clean --force

# Update npm
echo ""
echo "📦 Updating npm to latest..."
npm install -g npm@latest

# Install dependencies
echo ""
echo "📥 Installing dependencies (this may take 2-3 minutes)..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation successful!"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Copy .env.example to .env"
    echo "     cp .env.example .env"
    echo ""
    echo "  2. Edit .env and add your API keys:"
    echo "     - GROQ_API_KEY (from https://console.groq.com/)"
    echo "     - Google OAuth credentials"
    echo ""
    echo "  3. Start the app"
    echo "     npm run dev"
    echo ""
else
    echo ""
    echo "❌ Installation failed. Try:"
    echo "  npm cache clean --force"
    echo "  npm install"
    exit 1
fi
