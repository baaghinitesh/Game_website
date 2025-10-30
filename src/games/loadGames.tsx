import frontendGameRegistry from './GamePluginRegistry';
import TicTacToeGame from './TicTacToe/TicTacToeGame';
import SnakeGame from './Snake/SnakeGame';
import MemoryMatchGame from './MemoryMatch/MemoryMatchGame';
import Game2048 from './2048/Game2048';
import FlappyGame from './Flappy/FlappyGame';
import { LudoGame } from './Ludo';

/**
 * LOAD ALL FRONTEND GAME PLUGINS
 * 
 * This is where you register all your game components.
 * To add a new game:
 * 1. Create a new game component in src/games/YourGame/
 * 2. Import it here
 * 3. Register it with frontendGameRegistry.register()
 * 
 * That's it! Your game is now available in the platform.
 */

export const loadAllFrontendGamePlugins = () => {
  console.log('🎮 Loading frontend game plugins...');

  // Register all games
  frontendGameRegistry.register({
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    category: 'puzzle',
    minPlayers: 2,
    maxPlayers: 2,
    isMultiplayer: true,
    component: TicTacToeGame,
  });

  frontendGameRegistry.register({
    id: 'snake',
    name: 'Snake Game',
    category: 'arcade',
    minPlayers: 1,
    maxPlayers: 1,
    isMultiplayer: false,
    component: SnakeGame,
  });

  frontendGameRegistry.register({
    id: 'memorymatch',
    name: 'Memory Match',
    category: 'puzzle',
    minPlayers: 1,
    maxPlayers: 1,
    isMultiplayer: false,
    component: MemoryMatchGame,
  });

  frontendGameRegistry.register({
    id: '2048',
    name: '2048',
    category: 'puzzle',
    minPlayers: 1,
    maxPlayers: 1,
    isMultiplayer: false,
    component: Game2048,
  });

  frontendGameRegistry.register({
    id: 'flappy',
    name: 'Flappy Jump',
    category: 'arcade',
    minPlayers: 1,
    maxPlayers: 1,
    isMultiplayer: false,
    component: FlappyGame,
  });

  frontendGameRegistry.register({
    id: 'ludo',
    name: 'Ludo',
    category: 'strategy',
    minPlayers: 2,
    maxPlayers: 4,
    isMultiplayer: true,
    component: LudoGame,
  });

  // Add more games here as you create them

  console.log(`✅ Loaded ${frontendGameRegistry.getAllPlugins().length} frontend game plugins`);

  return frontendGameRegistry;
};

export default loadAllFrontendGamePlugins;
