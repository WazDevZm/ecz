import express from 'express';
import Post from '../models/Post.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { source, sentiment, partyId, candidateId, province, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (source) filter.source = source;
    if (sentiment) filter['sentiment.label'] = sentiment;
    if (partyId) filter['entities.parties'] = partyId;
    if (candidateId) filter['entities.candidates'] = candidateId;
    if (province) filter['location.province'] = province;
    
    const posts = await Post.find(filter)
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('entities.parties', 'name abbreviation color')
      .populate('entities.candidates', 'name photo');
    
    const total = await Post.countDocuments(filter);
    
    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('entities.parties', 'name abbreviation color')
      .populate('entities.candidates', 'name photo party');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post' });
  }
});

export default router;
