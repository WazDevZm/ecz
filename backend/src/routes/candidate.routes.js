import express from 'express';
import Candidate from '../models/Candidate.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { partyId, position } = req.query;
    const filter = { isActive: true };
    
    if (partyId) filter.party = partyId;
    if (position) filter.position = position;
    
    const candidates = await Candidate.find(filter)
      .populate('party', 'name abbreviation color')
      .sort({ name: 1 });
    
    res.json({ success: true, data: candidates });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidates' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate('party', 'name abbreviation color logo');
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidate' });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.status(201).json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ message: 'Error creating candidate' });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ message: 'Error updating candidate' });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.json({ success: true, message: 'Candidate deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting candidate' });
  }
});

export default router;
