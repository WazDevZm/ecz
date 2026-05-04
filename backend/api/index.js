import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import connectDB from '../src/config/database.js';
import authRoutes from '../src/routes/auth.routes.js';
import userRoutes from '../src/routes/user.routes.js';
import postRoutes from '../src/routes/post.routes.js';
import partyRoutes from '../src/routes/party.routes.js';
import candidateRoutes from '../src/routes/candidate.routes.js';
import sentimentRoutes from '../src/routes/sentiment.routes.js';
import alertRoutes from '../src/routes/alert.routes.js';
import reportRoutes from '../src/routes/report.routes.js';
import provinceRoutes from '../src/routes/province.routes.js';
import dashboardRoutes from '../src/routes/dashboard.routes.js';
import { errorHandler } from '../src/middleware/error.middleware.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/parties', partyRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/provinces', provinceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling
app.use(errorHandler);

// Export for Vercel serverless
export default app;
