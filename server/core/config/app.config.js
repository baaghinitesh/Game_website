import dotenv from 'dotenv';

dotenv.config();

export const AppConfig = {
  app: {
    name: 'GameZone API',
    version: '1.0.0',
    env: process.env.NODE_ENV || 'development',
  },
  
  server: {
    port: process.env.PORT || 5000,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gaming-platform',
    options: {},
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
  
  socketio: {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  },
  
  features: {
    enableMultiplayer: true,
    enableChat: true,
    enableLeaderboard: true,
    enableAchievements: true,
  },
  
  games: {
    maxPlayersPerRoom: 4,
    roomCodeLength: 6,
    sessionTimeout: 3600000,
  },
};

export default AppConfig;
