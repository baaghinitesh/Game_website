import mongoose from 'mongoose';

const gameHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GameSession',
  },
  score: {
    type: Number,
    default: 0,
  },
  result: {
    type: String,
    enum: ['win', 'loss', 'draw', 'completed'],
    required: true,
  },
  xpEarned: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number, // in seconds
    default: 0,
  },
  stats: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  playedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
gameHistorySchema.index({ userId: 1, playedAt: -1 });
gameHistorySchema.index({ gameId: 1, score: -1 });

const GameHistory = mongoose.model('GameHistory', gameHistorySchema);

export default GameHistory;
