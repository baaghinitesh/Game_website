import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Game } from './models/index.js';

dotenv.config();

const seedGames = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing games
    await Game.deleteMany({});
    console.log('🗑️  Cleared existing games');

    // Seed initial games
    const games = [
      {
        name: 'Tic Tac Toe',
        slug: 'tictactoe',
        description: 'Classic Tic Tac Toe game. Challenge a friend in this timeless strategy game!',
        category: 'puzzle',
        thumbnail: 'https://via.placeholder.com/400x250/1a1a2e/00d4ff?text=Tic+Tac+Toe',
        minPlayers: 2,
        maxPlayers: 2,
        isMultiplayer: true,
        pluginId: 'tictactoe',
        componentPath: '/games/TicTacToe/TicTacToeGame',
        featured: true,
        isActive: true,
        config: {
          timeLimit: null,
          rounds: 1,
        },
      },
    ];

    await Game.insertMany(games);
    console.log(`✅ Seeded ${games.length} games`);

    console.log('🎉 Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedGames();
