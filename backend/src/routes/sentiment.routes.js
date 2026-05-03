import express from 'express';
import axios from 'axios';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }
    
    const response = await axios.post(
      `${process.env.SENTIMENT_SERVICE_URL}/analyze`,
      { text }
    );
    
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ message: 'Error analyzing sentiment' });
  }
});

export default router;
