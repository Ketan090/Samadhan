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
import aiMatchingRoutes from './routes/aiMatching';
import visionRoutes from './routes/vision';
import notificationRoutes from './routes/notifications';

dotenv.config();

const app = express();
const server = http.createServer(app);
const allowedOrigins = [process.env.FRONTEND_URL, 'https://samadhan-for-us.vercel.app', 'http://localhost:3001', 'http://localhost:3000'].filter(Boolean) as string[];
const corsOptions = {
  origin: (origin: string | undefined, cb: (err: null, allow: boolean) => void) => {
    if (!origin || allowedOrigins.some(o => origin === o || (o.includes('*') && new RegExp('^' + o.replace('*','.*') + '$').test(origin)))) cb(null, true);
    else if (origin.endsWith('.vercel.app')) cb(null, true);
    else cb(null, true);
  },
  credentials: true
};
const io = new SocketServer(server, { cors: { origin: allowedOrigins, methods: ['GET', 'POST'] } });

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting — split so normal browsing never trips on AI usage.
// Global: generous backstop for all API traffic (polling + pages).
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000,
  standardHeaders: 'draft-8',
  message: { success: false, message: 'Too many requests — please wait a minute and retry.' }
});
// AI endpoints burn tokens/money per call: tighter per-connection budget
// with a message that says what to do. Applied on top of the global one.
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-8',
  message: { success: false, message: 'AI rate limit reached on your connection (too many AI requests). Wait a minute and retry — your work is saved.' }
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
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/ai-matching', aiLimiter, aiMatchingRoutes);
app.use('/api/porter', aiLimiter, visionRoutes);
app.use('/api/vision', aiLimiter, visionRoutes);
app.use('/api/notifications', notificationRoutes);

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
// Long keep-alive so the Next.js dev rewrite proxy never reuses a dead
// socket mid-upload (was causing ECONNRESET / "socket hang up" on photos).
server.keepAliveTimeout = 30000;
server.headersTimeout = 31000;
server.listen(PORT, () => {
  console.log(`🚀 SamadhanHub API running on port ${PORT}`);
});

export { app, server, io };
