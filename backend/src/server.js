import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import partyRoutes from './routes/party.routes.js';
import candidateRoutes from './routes/candidate.routes.js';
import sentimentRoutes from './routes/sentiment.routes.js';
import alertRoutes from './routes/alert.routes.js';
import reportRoutes from './routes/report.routes.js';
import provinceRoutes from './routes/province.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { setupSocketHandlers } from './socket/handlers.js';
import { startDataIngestion } from './services/ingestion.service.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : 'http://localhost:5173',
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes
app.set('io', io);

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

// Setup Socket.io handlers
setupSocketHandlers(io);

// Start data ingestion (if enabled)
if (process.env.ENABLE_DATA_INGESTION === 'true') {
  startDataIngestion(io);
}

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔌 Socket.io ready for real-time updates`);
});

export { io };
