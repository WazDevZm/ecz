import cron from 'node-cron';
import axios from 'axios';
import Post from '../models/Post.model.js';
import Party from '../models/Party.model.js';
import Candidate from '../models/Candidate.model.js';
import { emitNewPost } from '../socket/handlers.js';

// Mock data ingestion - Replace with real API calls
const mockSources = [
  { source: 'twitter', platform: 'Twitter/X' },
  { source: 'facebook', platform: 'Facebook' },
  { source: 'news', platform: 'News' }
];

const mockContent = [
  'The economy needs urgent attention from our leaders',
  'Youth unemployment is a critical issue that must be addressed',
  'Education reforms are essential for our future',
  'Healthcare accessibility should be a priority',
  'Corruption must be fought at all levels',
  'Infrastructure development will boost economic growth',
  'Agricultural support is vital for rural communities',
  'Job creation should be the focus of economic policy'
];

const zambianProvinces = [
  'Lusaka', 'Copperbelt', 'Southern', 'Eastern', 'Northern',
  'Luapula', 'North-Western', 'Western', 'Central', 'Muchinga'
];

export const startDataIngestion = async (io) => {
  console.log('📡 Starting data ingestion service...');

  // Fetch parties and candidates for entity linking
  const parties = await Party.find({ isActive: true });
  const candidates = await Candidate.find({ isActive: true });

  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      console.log('🔄 Running data ingestion...');
      
      // Generate 3-5 mock posts
      const numPosts = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < numPosts; i++) {
        const source = mockSources[Math.floor(Math.random() * mockSources.length)];
        const content = mockContent[Math.floor(Math.random() * mockContent.length)];
        
        // Randomly select entities
        const randomParties = parties
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 2) + 1);
        
        const randomCandidates = candidates
          .filter(c => randomParties.some(p => p._id.equals(c.party)))
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 2));

        // Analyze sentiment
        const sentimentResult = await analyzeSentiment(content);
        
        // Create post
        const post = await Post.create({
          content,
          source: source.source,
          sourceId: `mock_${Date.now()}_${i}`,
          author: {
            username: `user_${Math.floor(Math.random() * 1000)}`,
            name: `User ${Math.floor(Math.random() * 1000)}`
          },
          publishedAt: new Date(),
          engagement: {
            likes: Math.floor(Math.random() * 100),
            shares: Math.floor(Math.random() * 50),
            comments: Math.floor(Math.random() * 30)
          },
          sentiment: sentimentResult,
          entities: {
            parties: randomParties.map(p => p._id),
            candidates: randomCandidates.map(c => c._id),
            topics: extractTopics(content),
            hashtags: extractHashtags(content)
          },
          location: {
            province: zambianProvinces[Math.floor(Math.random() * zambianProvinces.length)]
          },
          isProcessed: true
        });

        // Emit to connected clients
        const populatedPost = await Post.findById(post._id)
          .populate('entities.parties', 'name abbreviation color')
          .populate('entities.candidates', 'name photo');
        
        emitNewPost(io, populatedPost);
      }
      
      console.log(`✅ Ingested ${numPosts} posts`);
    } catch (error) {
      console.error('❌ Data ingestion error:', error);
    }
  });
};

const analyzeSentiment = async (text) => {
  try {
    const response = await axios.post(
      `${process.env.SENTIMENT_SERVICE_URL}/analyze`,
      { text },
      { timeout: 5000 }
    );
    return response.data;
  } catch (error) {
    // Fallback to simple sentiment
    const positiveWords = ['good', 'great', 'excellent', 'support', 'progress', 'development'];
    const negativeWords = ['bad', 'poor', 'corruption', 'unemployment', 'crisis', 'problem'];
    
    const lowerText = text.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerText.includes(word));
    const hasNegative = negativeWords.some(word => lowerText.includes(word));
    
    if (hasPositive && !hasNegative) {
      return { label: 'positive', score: 0.7, confidence: 0.6 };
    } else if (hasNegative && !hasPositive) {
      return { label: 'negative', score: -0.7, confidence: 0.6 };
    } else {
      return { label: 'neutral', score: 0, confidence: 0.5 };
    }
  }
};

const extractTopics = (text) => {
  const topics = ['economy', 'jobs', 'education', 'health', 'corruption', 'infrastructure', 'agriculture'];
  const lowerText = text.toLowerCase();
  return topics.filter(topic => lowerText.includes(topic));
};

const extractHashtags = (text) => {
  const hashtagRegex = /#(\w+)/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches.map(tag => tag.substring(1).toLowerCase()) : [];
};
