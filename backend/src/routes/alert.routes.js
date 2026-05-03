import express from 'express';
import Alert from '../models/Alert.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts' });
  }
});

router.post('/', async (req, res) => {
  try {
    const alert = await Alert.create({
      ...req.body,
      user: req.user.id
    });
    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ message: 'Error creating alert' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ message: 'Error updating alert' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const alert = await Alert.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json({ success: true, message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting alert' });
  }
});

export default router;
