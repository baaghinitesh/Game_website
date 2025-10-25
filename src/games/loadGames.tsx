import frontendGameRegistry from './GamePluginRegistry';
import TicTacToeGame from './TicTacToe/TicTacToeGame';

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

  // Register Tic-Tac-Toe
  frontendGameRegistry.register({
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    category: 'puzzle',
    minPlayers: 2,
    maxPlayers: 2,
    isMultiplayer: true,
    component: TicTacToeGame,
  });

  // Register more games here as you create them:
  // frontendGameRegistry.register({
  //   id: 'memory-match',
  //   name: 'Memory Match',
  //   category: 'puzzle',
  //   minPlayers: 1,
  //   maxPlayers: 1,
  //   isMultiplayer: false,
  //   component: MemoryMatchGame,
  // });

  console.log(`✅ Loaded ${frontendGameRegistry.getAllPlugins().length} frontend game plugins`);

  return frontendGameRegistry;
};

export default loadAllFrontendGamePlugins;
