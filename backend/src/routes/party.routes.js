import express from 'express';
import Party from '../models/Party.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const parties = await Party.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: parties });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parties' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }
    res.json({ success: true, data: party });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching party' });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const party = await Party.create(req.body);
    res.status(201).json({ success: true, data: party });
  } catch (error) {
    res.status(500).json({ message: 'Error creating party' });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const party = await Party.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }
    res.json({ success: true, data: party });
  } catch (error) {
    res.status(500).json({ message: 'Error updating party' });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const party = await Party.findByIdAndDelete(req.params.id);
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }
    res.json({ success: true, message: 'Party deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting party' });
  }
});

export default router;
