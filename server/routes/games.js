import express from 'express';
import {
  getAllGames,
  getGamesByCategory,
  getGameById,
  getRegisteredPlugins,
  createGameSession,
  joinGameSession,
  getGameHistory,
  getLeaderboard,
} from '../controllers/gameController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllGames);
router.get('/plugins', getRegisteredPlugins);
router.get('/category/:category', getGamesByCategory);
router.get('/history', authenticateToken, getGameHistory);
router.get('/leaderboard/:gameId', getLeaderboard);
router.get('/:id', getGameById);

router.post('/session', optionalAuth, createGameSession);
router.post('/session/:roomId/join', optionalAuth, joinGameSession);

export default router;
