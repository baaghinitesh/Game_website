import { GameService } from '../services/game.service.js';
import { ResponseUtil } from '../common/utils/response.util.js';
import { LoggerUtil } from '../common/utils/logger.util.js';

export const getAllGames = async (req, res) => {
  try {
    const { category } = req.query;
    const games = await GameService.getAllGames(category);
    return ResponseUtil.success(res, { games });
  } catch (error) {
    LoggerUtil.error('Get all games error:', error);
    return ResponseUtil.serverError(res, error.message);
  }
};

export const getGamesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const games = await GameService.getAllGames(category);
    return ResponseUtil.success(res, { games });
  } catch (error) {
    LoggerUtil.error('Get games by category error:', error);
    return ResponseUtil.serverError(res, error.message);
  }
};

export const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await GameService.getGameById(id);
    return ResponseUtil.success(res, { game });
  } catch (error) {
    LoggerUtil.error('Get game by ID error:', error);
    return ResponseUtil.notFound(res, error.message);
  }
};

export const getGameBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const game = await GameService.getGameBySlug(slug);
    return ResponseUtil.success(res, { game });
  } catch (error) {
    LoggerUtil.error('Get game by slug error:', error);
    return ResponseUtil.notFound(res, error.message);
  }
};

export const createGameSession = async (req, res) => {
  try {
    const { gameId, isMultiplayer } = req.body;
    const userId = req.user?._id || req.user?.id;

    const session = await GameService.createGameSession(gameId, userId, isMultiplayer);
    return ResponseUtil.created(res, { session }, 'Game session created');
  } catch (error) {
    LoggerUtil.error('Create game session error:', error);
    return ResponseUtil.badRequest(res, error.message);
  }
};

export const joinGameSession = async (req, res) => {
  try {
    const { roomCode } = req.body;
    const userId = req.user?._id || req.user?.id;

    const session = await GameService.joinGameSession(roomCode, userId);
    return ResponseUtil.success(res, { session }, 'Joined game session');
  } catch (error) {
    LoggerUtil.error('Join game session error:', error);
    return ResponseUtil.badRequest(res, error.message);
  }
};

export const endGameSession = async (req, res) => {
  try {
    const { sessionId, winnerId } = req.body;

    const session = await GameService.endGameSession(sessionId, winnerId);
    return ResponseUtil.success(res, { session }, 'Game session ended');
  } catch (error) {
    LoggerUtil.error('End game session error:', error);
    return ResponseUtil.badRequest(res, error.message);
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { limit } = req.query;
    const leaderboard = await GameService.getLeaderboard(
      gameId,
      limit ? parseInt(limit) : 10
    );
    return ResponseUtil.success(res, { leaderboard });
  } catch (error) {
    LoggerUtil.error('Get leaderboard error:', error);
    return ResponseUtil.serverError(res, error.message);
  }
};

export const getGameHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { limit } = req.query;

    const history = await GameService.getUserGameHistory(
      userId,
      limit ? parseInt(limit) : 20
    );
    return ResponseUtil.success(res, { history });
  } catch (error) {
    LoggerUtil.error('Get game history error:', error);
    return ResponseUtil.serverError(res, error.message);
  }
};

export const getUserGameHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { limit } = req.query;

    const history = await GameService.getUserGameHistory(
      userId,
      limit ? parseInt(limit) : 20
    );
    return ResponseUtil.success(res, { history });
  } catch (error) {
    LoggerUtil.error('Get user game history error:', error);
    return ResponseUtil.serverError(res, error.message);
  }
};

export const getAvailableGames = async (req, res) => {
  try {
    const games = GameService.getAvailableGames();
    return ResponseUtil.success(res, { games });
  } catch (error) {
    LoggerUtil.error('Get available games error:', error);
    return ResponseUtil.serverError(res, error.message);
  }
};

export const getRegisteredPlugins = async (req, res) => {
  try {
    const games = GameService.getAvailableGames();
    return ResponseUtil.success(res, { games });
  } catch (error) {
    LoggerUtil.error('Get registered plugins error:', error);
    return ResponseUtil.serverError(res, error.message);
  }
};
