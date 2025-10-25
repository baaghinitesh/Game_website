import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['wins', 'games', 'social', 'special'],
    default: 'games',
  },
  requirement: {
    type: {
      type: String,
      enum: ['win_count', 'game_count', 'friend_count', 'xp_threshold', 'custom'],
      required: true,
    },
    target: {
      type: Number,
      required: true,
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
    },
  },
  xpReward: {
    type: Number,
    default: 50,
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
