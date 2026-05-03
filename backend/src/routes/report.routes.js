import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { generateReport } from '../services/report.service.js';

const router = express.Router();

router.use(protect);

router.post('/generate', async (req, res) => {
  try {
    const { format, timeRange, includeCharts } = req.body;
    
    const report = await generateReport({
      format: format || 'pdf',
      timeRange: timeRange || '7d',
      includeCharts: includeCharts !== false
    });
    
    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
});

export default router;
