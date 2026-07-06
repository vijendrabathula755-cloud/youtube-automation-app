const edgeTTS = require('edge-tts');
const fs = require('fs');
const path = require('path');

const VOICES = {
  english: 'en-US-AriaNeural',
  hindi: 'hi-IN-MadhurNeural',
  telugu: 'te-IN-MohanNeural',
};

const generateTTS = async (text, language = 'english', outputPath = null) => {
  try {
    const voice = VOICES[language] || VOICES.english;
    const outputFile = outputPath || path.join(process.env.TEMP_DIR || './temp', `tts_${Date.now()}.mp3`);

    // Ensure output directory exists
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create TTS communication object
    const communicate = new edgeTTS.Communicate(text, voice);
    
    // Write audio to file
    const writeStream = fs.createWriteStream(outputFile);
    
    return new Promise((resolve, reject) => {
      communicate.on('data', (chunk) => {
        writeStream.write(chunk);
      });

      communicate.on('end', () => {
        writeStream.end();
        resolve(outputFile);
      });

      communicate.on('error', (error) => {
        writeStream.destroy();
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error generating TTS:', error);
    throw error;
  }
};

const generateMultipleTTS = async (sections, language = 'english') => {
  try {
    const audioFiles = [];
    
    for (const section of sections) {
      const audioPath = await generateTTS(section.text, language);
      audioFiles.push({
        path: audioPath,
        duration: section.duration || 10,
        text: section.text,
      });
    }

    return audioFiles;
  } catch (error) {
    console.error('Error generating multiple TTS:', error);
    throw error;
  }
};

module.exports = {
  generateTTS,
  generateMultipleTTS,
  VOICES,
};
