import express from 'express';
import Province from '../models/Province.model.js';
import Post from '../models/Post.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const provinces = await Province.find().sort({ name: 1 });
    res.json({ success: true, data: provinces });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching provinces' });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case '24h':
        startDate = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
    }

    const provinceStats = await Post.aggregate([
      { $match: { publishedAt: { $gte: startDate }, 'location.province': { $exists: true } } },
      {
        $group: {
          _id: {
            province: '$location.province',
            sentiment: '$sentiment.label'
          },
          count: { $sum: 1 },
          avgScore: { $avg: '$sentiment.score' }
        }
      },
      {
        $group: {
          _id: '$_id.province',
          totalMentions: { $sum: '$count' },
          sentiments: {
            $push: {
              label: '$_id.sentiment',
              count: '$count'
            }
          },
          avgSentiment: { $avg: '$avgScore' }
        }
      }
    ]);

    res.json({ success: true, data: provinceStats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching province analytics' });
  }
});

export default router;
