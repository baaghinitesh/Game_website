import { Game, GameSession, GameHistory } from '../models/index.js';
import { LoggerUtil } from '../common/utils/logger.util.js';
import GamePluginRegistry from '../plugins/GamePluginRegistry.js';

export class GameService {
  static async getAllGames(category = null) {
    const query = category ? { category } : {};
    const games = await Game.find(query).sort({ popularity: -1 });
    return games;
  }

  static async getGameById(gameId) {
    const game = await Game.findById(gameId);
    if (!game) {
      throw new Error('Game not found');
    }
    return game;
  }

  static async getGameBySlug(slug) {
    const game = await Game.findOne({ slug });
    if (!game) {
      throw new Error('Game not found');
    }
    return game;
  }

  static async createGameSession(gameId, userId, isMultiplayer = false) {
    const game = await this.getGameById(gameId);

    const session = new GameSession({
      game: gameId,
      players: [userId],
      isMultiplayer,
      roomCode: isMultiplayer ? this.generateRoomCode() : null,
      status: isMultiplayer ? 'waiting' : 'active',
    });

    await session.save();
    LoggerUtil.success(`Game session created: ${game.name}`, { sessionId: session._id });

    return session;
  }

  static async joinGameSession(roomCode, userId) {
    const session = await GameSession.findOne({ roomCode, status: 'waiting' });
    
    if (!session) {
      throw new Error('Room not found or already started');
    }

    if (session.players.includes(userId)) {
      return session;
    }

    if (session.players.length >= session.maxPlayers) {
      throw new Error('Room is full');
    }

    session.players.push(userId);
    
    if (session.players.length >= session.maxPlayers) {
      session.status = 'active';
      session.startedAt = new Date();
    }

    await session.save();
    LoggerUtil.info(`User joined game session: ${roomCode}`);

    return session;
  }

  static async endGameSession(sessionId, winnerId = null) {
    const session = await GameSession.findById(sessionId).populate('game');
    
    if (!session) {
      throw new Error('Session not found');
    }

    session.status = 'completed';
    session.completedAt = new Date();
    session.winner = winnerId;

    await session.save();

    // Create game history records for all players
    const historyPromises = session.players.map(playerId => {
      return GameHistory.create({
        user: playerId,
        game: session.game._id,
        score: 0, // This should be passed from game logic
        isWinner: playerId.toString() === winnerId?.toString(),
        completedAt: new Date(),
      });
    });

    await Promise.all(historyPromises);

    LoggerUtil.success(`Game session ended`, { sessionId });

    return session;
  }

  static async getLeaderboard(gameId = null, limit = 10) {
    const query = gameId ? { game: gameId } : {};
    
    const leaderboard = await GameHistory.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$user',
          totalScore: { $sum: '$score' },
          gamesPlayed: { $sum: 1 },
          wins: { $sum: { $cond: ['$isWinner', 1, 0] } },
        },
      },
      { $sort: { totalScore: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          username: '$user.username',
          avatar: '$user.avatar',
          totalScore: 1,
          gamesPlayed: 1,
          wins: 1,
          winRate: {
            $multiply: [
              { $divide: ['$wins', '$gamesPlayed'] },
              100,
            ],
          },
        },
      },
    ]);

    return leaderboard;
  }

  static async getUserGameHistory(userId, limit = 20) {
    const history = await GameHistory.find({ user: userId })
      .populate('game', 'name slug thumbnail')
      .sort({ completedAt: -1 })
      .limit(limit);

    return history;
  }

  static generateRoomCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  static getAvailableGames() {
    return GamePluginRegistry.getAllGames();
  }

  static getGamePlugin(gameId) {
    const plugin = GamePluginRegistry.getGame(gameId);
    if (!plugin) {
      throw new Error('Game plugin not found');
    }
    return plugin;
  }
}

export default GameService;
