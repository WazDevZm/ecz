import express from 'express';
import User from '../models/User.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

export default router;
