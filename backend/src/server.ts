import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/db';
import rateLimit from 'express-rate-limit';

// Routes
import authRoutes from './routes/auth';
import challengeRoutes from './routes/challenges';
import solutionRoutes from './routes/solutions';
import organizationRoutes from './routes/organizations';
import collaborationRoutes from './routes/collaborations';
import evaluationRoutes from './routes/evaluations';
import analyticsRoutes from './routes/analytics';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/collaborations', collaborationRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (_, res) => {
  res.json({ success: true, message: 'SamadhanHub API is running', timestamp: new Date().toISOString() });
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-challenge', (challengeId: string) => {
    socket.join(`challenge-${challengeId}`);
  });

  socket.on('leave-challenge', (challengeId: string) => {
    socket.leave(`challenge-${challengeId}`);
  });

  socket.on('send-message', (data: { challengeId: string; message: any }) => {
    io.to(`challenge-${data.challengeId}`).emit('new-message', data.message);
  });

  socket.on('task-update', (data: { challengeId: string; task: any }) => {
    io.to(`challenge-${data.challengeId}`).emit('task-updated', data.task);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible in routes
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 SamadhanHub API running on port ${PORT}`);
});

export { app, server, io };
