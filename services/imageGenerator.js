const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');
const jimp = require('jimp');

// Generate text overlay image
const generateTextOverlay = async (text, width = 1920, height = 1080, fontSize = 60) => {
  try {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, width, height);

    // Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Word wrapping
    const words = text.split(' ');
    let line = '';
    const lines = [];
    const maxWidth = width - 100;

    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth) {
        lines.push(line);
        line = word + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Draw lines
    const lineHeight = fontSize + 20;
    const startY = (height - (lines.length * lineHeight)) / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });

    const outputPath = path.join(process.env.TEMP_DIR || './temp', `overlay_${Date.now()}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    return outputPath;
  } catch (error) {
    console.error('Error generating text overlay:', error);
    throw error;
  }
};

// Generate gradient background
const generateGradientBackground = async (width = 1920, height = 1080, colors = ['#1a1a2e', '#16213e']) => {
  try {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const outputPath = path.join(process.env.TEMP_DIR || './temp', `background_${Date.now()}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    return outputPath;
  } catch (error) {
    console.error('Error generating background:', error);
    throw error;
  }
};

// Generate thumbnail
const generateThumbnail = async (title, width = 1280, height = 720) => {
  try {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const words = title.split(' ');
    let line = '';
    const lines = [];
    const maxWidth = width - 40;

    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth) {
        lines.push(line);
        line = word + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const lineHeight = 70;
    const startY = (height - (lines.length * lineHeight)) / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });

    const outputPath = path.join(process.env.TEMP_DIR || './temp', `thumbnail_${Date.now()}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    return outputPath;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw error;
  }
};

module.exports = {
  generateTextOverlay,
  generateGradientBackground,
  generateThumbnail,
};
