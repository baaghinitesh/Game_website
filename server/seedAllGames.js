import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Game from './models/Game.js';

dotenv.config();

const games = [
  {
    name: 'Tic Tac Toe',
    slug: 'tictactoe',
    description: 'Classic Tic Tac Toe game. Challenge a friend in this timeless strategy game!',
    category: 'puzzle',
    thumbnail: '/images/games/tictactoe.png',
    minPlayers: 2,
    maxPlayers: 2,
    isMultiplayer: true,
    pluginId: 'tictactoe',
    componentPath: '/games/TicTacToe/TicTacToeGame',
    config: { timeLimit: null, rounds: 1 },
    featured: true,
    isActive: true
  },
  {
    name: 'Snake Game',
    slug: 'snake',
    description: 'Classic Snake game - eat food, grow longer, avoid walls and yourself!',
    category: 'arcade',
    thumbnail: '/images/games/snake.jpg',
    minPlayers: 1,
    maxPlayers: 1,
    isMultiplayer: false,
    pluginId: 'snake',
    componentPath: '/games/Snake/SnakeGame',
    config: { timeLimit: null },
    featured: true,
    isActive: true
  },
  {
    name: 'Memory Match',
    slug: 'memorymatch',
    description: 'Test your memory! Find matching pairs of cards in this classic puzzle game.',
    category: 'puzzle',
    thumbnail: 'https://via.placeholder.com/400x250/1a1a2e/a855f7?text=Memory+Match',
    minPlayers: 1,
    maxPlayers: 2,
    isMultiplayer: false,
    pluginId: 'memorymatch',
    componentPath: '/games/MemoryMatch/MemoryMatchGame',
    config: { pairCount: 8 },
    featured: true,
    isActive: true
  },
  {
    name: '2048',
    slug: '2048',
    description: 'Slide tiles to combine numbers and reach 2048! Addictive puzzle game.',
    category: 'puzzle',
    thumbnail: '/images/games/2048.jpg',
    minPlayers: 1,
    maxPlayers: 1,
    isMultiplayer: false,
    pluginId: '2048',
    componentPath: '/games/2048/Game2048',
    config: { gridSize: 4 },
    featured: true,
    isActive: true
  },
  {
    name: 'Flappy Jump',
    slug: 'flappy',
    description: 'Tap to jump and avoid obstacles! How far can you go in this addictive arcade game?',
    category: 'arcade',
    thumbnail: '/images/games/flappybird.jpg',
    minPlayers: 1,
    maxPlayers: 1,
    isMultiplayer: false,
    pluginId: 'flappy',
    componentPath: '/games/Flappy/FlappyGame',
    config: { difficulty: 'medium' },
    featured: true,
    isActive: true
  },
  {
    name: 'Ludo',
    slug: 'ludo',
    description: 'Classic Ludo board game! Roll the dice, move your pieces, and race to the finish. Play with 2-4 players!',
    category: 'strategy',
    thumbnail: '/images/games/ludo.jpg',
    minPlayers: 2,
    maxPlayers: 4,
    isMultiplayer: true,
    pluginId: 'ludo',
    componentPath: '/games/Ludo/LudoGame',
    config: { timeLimit: null, playerCount: 4 },
    featured: true,
    isActive: true
  }
];

const seedGames = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing games
    await Game.deleteMany({});
    console.log('🗑️  Cleared existing games');

    // Insert new games
    const inserted = await Game.insertMany(games);
    console.log(`✅ Inserted ${inserted.length} games:`);
    inserted.forEach(game => console.log(`   - ${game.name} (${game.category})`));

    console.log('\n🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedGames();
