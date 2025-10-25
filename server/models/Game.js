import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['arcade', 'puzzle', 'card', 'racing', 'strategy', 'quiz'],
  },
  thumbnail: {
    type: String,
    required: true,
  },
  minPlayers: {
    type: Number,
    default: 1,
  },
  maxPlayers: {
    type: Number,
    default: 1,
  },
  isMultiplayer: {
    type: Boolean,
    default: false,
  },
  // Plugin system configuration
  pluginId: {
    type: String,
    required: true,
    unique: true,
  },
  componentPath: {
    type: String,
    required: true,
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  // Statistics
  totalPlays: {
    type: Number,
    default: 0,
  },
  activePlayers: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Game = mongoose.model('Game', gameSchema);

export default Game;
