const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VOICES = {
  english: 'en-US-AriaNeural',
  hindi: 'hi-IN-MadhurNeural',
  telugu: 'te-IN-MohanNeural',
};

// Method 1: Using edge-tts if available
const generateTTSWithEdge = async (text, language = 'english', outputPath = null) => {
  try {
    const voice = VOICES[language] || VOICES.english;
    const outputFile = outputPath || path.join(process.env.TEMP_DIR || './temp', `tts_${Date.now()}.mp3`);

    // Ensure output directory exists
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
      const edgeTTS = require('edge-tts');
      const communicate = new edgeTTS.Communicate(text, voice);
      
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
    } catch (edgeError) {
      console.warn('Edge-TTS failed, trying fallback method:', edgeError.message);
      return generateTTSWithPython(text, language, outputFile);
    }
  } catch (error) {
    console.error('Error in edge-tts generation:', error);
    throw error;
  }
};

// Method 2: Using Python (gTTS) as fallback
const generateTTSWithPython = async (text, language = 'english', outputPath = null) => {
  try {
    const outputFile = outputPath || path.join(process.env.TEMP_DIR || './temp', `tts_${Date.now()}.mp3`);
    
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const langCode = { english: 'en', hindi: 'hi', telugu: 'te' }[language] || 'en';
    
    // Create Python script for gTTS
    const pythonScript = `
from gtts import gTTS
import sys

text = '''${text.replace(/'/g, "\\'").replace(/\n/g, ' ')}'''
lang = '${langCode}'
output_file = '${outputFile}'

try:
    tts = gTTS(text=text, lang=lang, slow=False)
    tts.save(output_file)
    print(f'Success: {output_file}')
except Exception as e:
    print(f'Error: {str(e)}')
    sys.exit(1)
`;

    const scriptPath = path.join(process.env.TEMP_DIR || './temp', `tts_${Date.now()}.py`);
    fs.writeFileSync(scriptPath, pythonScript);

    try {
      const result = execSync(`python3 "${scriptPath}"`, { encoding: 'utf-8' });
      console.log('Python TTS result:', result);
      
      // Clean up script
      fs.unlinkSync(scriptPath);
      
      if (fs.existsSync(outputFile)) {
        return outputFile;
      } else {
        throw new Error('TTS file not created');
      }
    } catch (execError) {
      console.error('Python execution error:', execError.message);
      throw execError;
    }
  } catch (error) {
    console.error('Error in Python TTS generation:', error);
    throw error;
  }
};

// Method 3: Using simple silence audio (fallback for testing)
const generateSilentAudio = async (duration = 10, outputPath = null) => {
  try {
    const outputFile = outputPath || path.join(process.env.TEMP_DIR || './temp', `silent_${Date.now()}.mp3`);
    
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create a simple audio file using ffmpeg
    const cmd = `ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t ${duration} -q:a 9 -acodec libmp3lame "${outputFile}" -y`;
    execSync(cmd);
    
    return outputFile;
  } catch (error) {
    console.error('Error generating silent audio:', error);
    throw error;
  }
};

// Main function with fallback chain
const generateTTS = async (text, language = 'english', outputPath = null) => {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('Text is empty');
    }

    console.log(`\ud83d\udd� Generating TTS for language: ${language}`);
    
    try {
      // Try edge-tts first
      return await generateTTSWithEdge(text, language, outputPath);
    } catch (error) {
      console.warn('Edge-TTS failed, trying Python fallback...');
      try {
        return await generateTTSWithPython(text, language, outputPath);
      } catch (pythonError) {
        console.warn('Python TTS also failed, using silent audio for testing...');
        const duration = (text.split(' ').length / 130) * 60 || 10;
        return await generateSilentAudio(Math.ceil(duration), outputPath);
      }
    }
  } catch (error) {
    console.error('Fatal error in TTS generation:', error);
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
