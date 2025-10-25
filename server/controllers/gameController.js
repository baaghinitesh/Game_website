import { Game, GameSession, GameHistory } from '../models/index.js';
import gameRegistry from '../plugins/GamePluginRegistry.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find({ isActive: true });
    res.json({ games });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGamesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const games = await Game.find({ category, isActive: true });
    res.json({ games });
  } catch (error) {
    console.error('Get games by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json({ game });
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRegisteredPlugins = async (req, res) => {
  try {
    const plugins = gameRegistry.getAllPlugins();
    res.json({ plugins });
  } catch (error) {
    console.error('Get plugins error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createGameSession = async (req, res) => {
  try {
    const { gameId, isPrivate } = req.body;
    const userId = req.user?._id;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const plugin = gameRegistry.getPlugin(game.pluginId);
    if (!plugin) {
      return res.status(400).json({ message: 'Game plugin not loaded' });
    }

    const roomId = uuidv4();
    const inviteCode = isPrivate ? uuidv4().substring(0, 8).toUpperCase() : null;

    const session = new GameSession({
      gameId,
      roomId,
      maxPlayers: plugin.maxPlayers,
      isPrivate,
      inviteCode,
      gameState: plugin.initializeState(),
      players: userId ? [{
        userId,
        username: req.user.username,
        isGuest: req.user.isGuest || false,
      }] : [],
    });

    await session.save();

    res.status(201).json({
      message: 'Game session created',
      session: {
        id: session._id,
        roomId: session.roomId,
        inviteCode: session.inviteCode,
        maxPlayers: session.maxPlayers,
        currentPlayers: session.players.length,
      },
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const joinGameSession = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user?._id;

    const session = await GameSession.findOne({ roomId });
    if (!session) {
      return res.status(404).json({ message: 'Game session not found' });
    }

    if (session.status !== 'waiting') {
      return res.status(400).json({ message: 'Game already started' });
    }

    if (session.players.length >= session.maxPlayers) {
      return res.status(400).json({ message: 'Game session is full' });
    }

    // Check if user already in session
    const alreadyJoined = session.players.some(
      p => p.userId && p.userId.toString() === userId?.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: 'Already joined this session' });
    }

    session.players.push({
      userId,
      username: req.user?.username || `Guest_${uuidv4().substring(0, 8)}`,
      isGuest: !userId || req.user?.isGuest,
    });

    // Start game if full
    if (session.players.length === session.maxPlayers) {
      session.status = 'active';
      session.startedAt = new Date();
    }

    await session.save();

    res.json({
      message: 'Joined game session',
      session: {
        id: session._id,
        roomId: session.roomId,
        status: session.status,
        players: session.players,
      },
    });
  } catch (error) {
    console.error('Join session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGameHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 20 } = req.query;

    const history = await GameHistory.find({ userId })
      .populate('gameId', 'name thumbnail')
      .sort({ playedAt: -1 })
      .limit(parseInt(limit));

    res.json({ history });
  } catch (error) {
    console.error('Get game history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { limit = 10 } = req.query;

    const pipeline = [
      { $match: { gameId: gameId } },
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$score' },
          wins: {
            $sum: { $cond: [{ $eq: ['$result', 'win'] }, 1, 0] }
          },
          gamesPlayed: { $sum: 1 },
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          username: '$user.username',
          avatar: '$user.avatar',
          totalScore: 1,
          wins: 1,
          gamesPlayed: 1,
        }
      }
    ];

    const leaderboard = await GameHistory.aggregate(pipeline);

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
