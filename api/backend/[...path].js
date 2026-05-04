// Vercel serverless function wrapper for backend API
import app from '../../backend/api/index.js';

export default app;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
