const { youtube_v3 } = require('google-api-nodejs-client');
const { google } = require('google-api-nodejs-client');
const fs = require('fs');
const path = require('path');

const getYoutubeClient = (accessToken) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.youtube({
    version: 'v3',
    auth: oauth2Client,
  });
};

const getChannelInfo = async (accessToken) => {
  try {
    const youtube = getYoutubeClient(accessToken);
    const response = await youtube.channels.list({
      part: 'snippet,statistics',
      mine: true,
    });

    if (response.data.items && response.data.items.length > 0) {
      const channel = response.data.items[0];
      return {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails?.default?.url,
        subscriberCount: channel.statistics.subscriberCount,
        viewCount: channel.statistics.viewCount,
      };
    }
    throw new Error('No channels found');
  } catch (error) {
    console.error('Error getting channel info:', error);
    throw error;
  }
};

const uploadVideo = async (accessToken, videoPath, metadata) => {
  try {
    if (!fs.existsSync(videoPath)) {
      throw new Error(`Video file not found: ${videoPath}`);
    }

    const youtube = getYoutubeClient(accessToken);
    const fileSize = fs.statSync(videoPath).size;

    console.log(`📤 Uploading video: ${metadata.title}`);
    console.log(`📊 File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

    const response = await youtube.videos.insert(
      {
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title: metadata.title,
            description: metadata.description,
            tags: metadata.tags || [],
            categoryId: '24', // Entertainment
          },
          status: {
            privacyStatus: 'public',
          },
        },
        media: {
          body: fs.createReadStream(videoPath),
        },
      },
      {
        onUploadProgress: (evt) => {
          const progress = Math.round((evt.bytesRead / fileSize) * 100);
          console.log(`⏳ Upload progress: ${progress}%`);
        },
      }
    );

    console.log(`✅ Video uploaded successfully: ${response.data.id}`);
    return {
      videoId: response.data.id,
      url: `https://youtube.com/watch?v=${response.data.id}`,
    };
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

const uploadShort = async (accessToken, videoPath, metadata) => {
  // Shorts are just videos < 60 seconds
  return uploadVideo(accessToken, videoPath, metadata);
};

module.exports = {
  getChannelInfo,
  uploadVideo,
  uploadShort,
  getYoutubeClient,
};
