import express from 'express';
import {
  getOverview,
  getSentimentTrends,
  getPartyComparison,
  getCandidateLeaderboard,
  getWordCloud,
  getRecentPosts
} from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/overview', getOverview);
router.get('/sentiment-trends', getSentimentTrends);
router.get('/party-comparison', getPartyComparison);
router.get('/candidate-leaderboard', getCandidateLeaderboard);
router.get('/word-cloud', getWordCloud);
router.get('/recent-posts', getRecentPosts);

export default router;
