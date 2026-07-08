@echo off
REM YouTube Automation App - Installation Script for Windows

echo.
echo =====================================================
echo   YouTube Automation App - Installation
echo =====================================================
echo.

REM Check Node.js
echo Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found. Please install Node.js 14+
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo   Node version: %NODE_VERSION%

REM Check npm
echo Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm not found
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo   npm version: %NPM_VERSION%

REM Clear npm cache
echo.
echo Clearing npm cache...
call npm cache clean --force

REM Update npm
echo.
echo Updating npm to latest...
call npm install -g npm@latest

REM Install dependencies
echo.
echo Installing dependencies (this may take 2-3 minutes)...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ SUCCESS! Installation completed.
    echo.
    echo Next steps:
    echo   1. Copy .env.example to .env
    echo      copy .env.example .env
    echo.
    echo   2. Edit .env and add your API keys:
    echo      - GROQ_API_KEY from https://console.groq.com/
    echo      - Google OAuth credentials
    echo.
    echo   3. Start the app
    echo      npm run dev
    echo.
    echo App will run at: http://localhost:3000
    echo.
    pause
) else (
    echo.
    echo ❌ Installation failed. Try:
    echo   npm cache clean --force
    echo   npm install
    echo.
    pause
    exit /b 1
)
