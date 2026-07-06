const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const TOPICS = [
  'motivational quotes', 'self-improvement', 'productivity tips',
  'technology news', 'artificial intelligence', 'programming',
  'health and fitness', 'nutrition', 'mental health',
  'entrepreneurship', 'business tips', 'personal finance',
  'travel tips', 'lifestyle', 'entertainment',
  'science facts', 'educational content', 'life hacks'
];

const generateScript = async (topic = null, language = 'english') => {
  try {
    const selectedTopic = topic || TOPICS[Math.floor(Math.random() * TOPICS.length)];
    
    const languagePrompt = {
      telugu: 'Generate the response in Telugu language.',
      hindi: 'Generate the response in Hindi language.',
      english: 'Generate the response in English language.'
    }[language] || 'Generate the response in English language.';

    const prompt = `${languagePrompt}
    
Create an engaging short video script about: "${selectedTopic}"

Return JSON with exactly this structure:
{
  "title": "Video Title",
  "description": "Short description for YouTube",
  "sections": [
    {
      "type": "intro",
      "text": "Hook and introduction",
      "duration": 5
    },
    {
      "type": "main",
      "text": "Main content points",
      "duration": 30
    },
    {
      "type": "outro",
      "text": "Call to action and closing",
      "duration": 5
    }
  ],
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "topic": "${selectedTopic}"
}`;

    const message = await groq.messages.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'mixtral-8x7b-32768',
      max_tokens: 1024,
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse script response');
    }

    const script = JSON.parse(jsonMatch[0]);
    return script;
  } catch (error) {
    console.error('Error generating script:', error);
    throw error;
  }
};

const generateScriptForTopic = async (topic, language = 'english', videoType = 'short') => {
  return generateScript(topic, language);
};

module.exports = {
  generateScript,
  generateScriptForTopic,
  TOPICS,
};
