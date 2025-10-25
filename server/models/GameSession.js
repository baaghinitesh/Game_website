import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema({
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  players: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
    isGuest: Boolean,
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  maxPlayers: {
    type: Number,
    default: 2,
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'finished', 'abandoned'],
    default: 'waiting',
  },
  gameState: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  startedAt: Date,
  finishedAt: Date,
  isPrivate: {
    type: Boolean,
    default: false,
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true,
  },
}, {
  timestamps: true,
});

// Index for faster lookups
gameSessionSchema.index({ roomId: 1 });
gameSessionSchema.index({ status: 1 });
gameSessionSchema.index({ inviteCode: 1 });

const GameSession = mongoose.model('GameSession', gameSessionSchema);

export default GameSession;
