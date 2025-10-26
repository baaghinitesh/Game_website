import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import loadAllGamePlugins from './plugins/loadGames.js';
import { AppConfig } from './core/config/app.config.js';
import { LoggerUtil } from './common/utils/logger.util.js';

// Import routes
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/games.js';
import userRoutes from './routes/users.js';

// Import socket handlers
import { initializeSocketHandlers } from './sockets/index.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, AppConfig.socketio);

// Middleware
app.use(cors(AppConfig.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    version: AppConfig.app.version,
    env: AppConfig.app.env,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  LoggerUtil.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Initialize Socket.io handlers
initializeSocketHandlers(io);

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Load game plugins
    loadAllGamePlugins();
    
    // Start server
    httpServer.listen(AppConfig.server.port, () => {
      LoggerUtil.success(`Server running on port ${AppConfig.server.port}`);
      LoggerUtil.info(`API: http://localhost:${AppConfig.server.port}/api`);
      LoggerUtil.info(`Socket.io: http://localhost:${AppConfig.server.port}`);
      LoggerUtil.success(`${AppConfig.app.name} is ready!`);
    });
  } catch (error) {
    LoggerUtil.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { io };
