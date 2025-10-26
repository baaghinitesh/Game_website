import { GameSession } from '../models/index.js';
import gameRegistry from '../plugins/GamePluginRegistry.js';
import { LoggerUtil } from '../common/utils/logger.util.js';
import { SOCKET_EVENTS } from '../core/constants/api.constants.js';

// Store online users and their socket connections
const onlineUsers = new Map(); // userId -> socketId
const socketToUser = new Map(); // socketId -> userId

export const initializeSocketHandlers = (io) => {
  LoggerUtil.info('Initializing Socket.io handlers...');

  io.on(SOCKET_EVENTS.CONNECT, (socket) => {
    LoggerUtil.success(`Client connected: ${socket.id}`);

    // User authentication and online status
    socket.on(SOCKET_EVENTS.USER_ONLINE, (userId) => {
      onlineUsers.set(userId, socket.id);
      socketToUser.set(socket.id, userId);
      
      // Broadcast to friends
      io.emit('user:status', { userId, status: 'online' });
      LoggerUtil.info(`User ${userId} is now online`);
    });

    // Join a game room
    socket.on(SOCKET_EVENTS.GAME_JOIN_ROOM, async ({ roomId, userId, username }) => {
      try {
        socket.join(roomId);
        
        // Get session
        const session = await GameSession.findOne({ roomId });
        if (!session) {
          socket.emit(SOCKET_EVENTS.GAME_ERROR, { message: 'Room not found' });
          return;
        }

        // Broadcast to room
        io.to(roomId).emit('game:player-joined', {
          userId,
          username,
          playerCount: session.players.length,
        });

        // Send current game state to the player
        socket.emit(SOCKET_EVENTS.GAME_STATE, {
          gameState: session.gameState,
          players: session.players,
        });

        LoggerUtil.info(`User ${username} joined room ${roomId}`);
      } catch (error) {
        LoggerUtil.error('Join room error:', error);
        socket.emit(SOCKET_EVENTS.GAME_ERROR, { message: 'Failed to join room' });
      }
    });

    // Leave a game room
    socket.on(SOCKET_EVENTS.GAME_LEAVE_ROOM, ({ roomId, userId, username }) => {
      socket.leave(roomId);
      io.to(roomId).emit('game:player-left', { userId, username });
      LoggerUtil.info(`User ${username} left room ${roomId}`);
    });

    // Handle game moves
    socket.on(SOCKET_EVENTS.GAME_MOVE, async ({ roomId, move, userId }) => {
      try {
        const session = await GameSession.findOne({ roomId });
        if (!session) {
          socket.emit(SOCKET_EVENTS.GAME_ERROR, { message: 'Session not found' });
          return;
        }

        if (session.status !== 'active') {
          socket.emit(SOCKET_EVENTS.GAME_ERROR, { message: 'Game is not active' });
          return;
        }

        // Get game plugin
        const game = await (await import('../models/index.js')).Game.findById(session.gameId);
        const plugin = gameRegistry.getPlugin(game.pluginId);

        if (!plugin) {
          socket.emit(SOCKET_EVENTS.GAME_ERROR, { message: 'Game plugin not found' });
          return;
        }

        // Validate move
        const validation = plugin.validateMove(session.gameState, move);
        if (!validation.valid) {
          socket.emit(SOCKET_EVENTS.GAME_INVALID_MOVE, { error: validation.error });
          return;
        }

        // Process game logic
        const newState = plugin.processGameLogic(session.gameState, move);
        session.gameState = newState;

        // Check for game end
        if (newState.winner || newState.isDraw) {
          session.status = 'finished';
          session.finishedAt = new Date();
          
          // Award XP to players
          const { User, GameHistory } = await import('../models/index.js');
          
          for (const player of session.players) {
            if (player.userId && !player.isGuest) {
              const xpEarned = newState.winner === player.userId.toString() ? 50 : 10;
              const user = await User.findById(player.userId);
              if (user) {
                await user.addXP(xpEarned);
              }

              // Save game history
              await GameHistory.create({
                userId: player.userId,
                gameId: session.gameId,
                sessionId: session._id,
                result: newState.winner === player.userId.toString() ? 'win' : 
                        newState.isDraw ? 'draw' : 'loss',
                xpEarned,
                playedAt: new Date(),
              });
            }
          }
        }

        await session.save();

        // Broadcast new state to all players in room
        io.to(roomId).emit(SOCKET_EVENTS.GAME_STATE_UPDATE, {
          gameState: newState,
          status: session.status,
        });

        if (session.status === 'finished') {
          io.to(roomId).emit(SOCKET_EVENTS.GAME_ENDED, {
            winner: newState.winner,
            isDraw: newState.isDraw,
          });
        }

        LoggerUtil.info(`Move processed in room ${roomId}`);
      } catch (error) {
        LoggerUtil.error('Game move error:', error);
        socket.emit(SOCKET_EVENTS.GAME_ERROR, { message: 'Failed to process move' });
      }
    });

    // Friend invites
    socket.on('friend:invite', ({ fromUserId, toUserId, roomId, gameName }) => {
      const targetSocketId = onlineUsers.get(toUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('friend:invite-received', {
          fromUserId,
          roomId,
          gameName,
        });
        LoggerUtil.info(`Invite sent from ${fromUserId} to ${toUserId}`);
      } else {
        socket.emit('friend:invite-failed', { message: 'Friend is offline' });
      }
    });

    // Chat messages in game room
    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, ({ roomId, userId, username, message }) => {
      io.to(roomId).emit(SOCKET_EVENTS.CHAT_MESSAGE, {
        userId,
        username,
        message,
        timestamp: new Date(),
      });
    });

    // Disconnect
    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      const userId = socketToUser.get(socket.id);
      if (userId) {
        onlineUsers.delete(userId);
        socketToUser.delete(socket.id);
        
        // Broadcast offline status
        io.emit('user:status', { userId, status: 'offline' });
        LoggerUtil.info(`User ${userId} disconnected`);
      }
      LoggerUtil.info(`Client disconnected: ${socket.id}`);
    });
  });

  LoggerUtil.success('Socket.io handlers initialized');
};
