import gameRegistry from './GamePluginRegistry.js';
import TicTacToePlugin from './games/tictactoe.plugin.js';
import SnakePlugin from './games/snake.plugin.js';
import MemoryMatchPlugin from './games/memorymatch.plugin.js';
import Game2048Plugin from './games/2048.plugin.js';
import FlappyPlugin from './games/flappy.plugin.js';
import LudoPlugin from './games/ludo.plugin.js';

/**
 * LOAD ALL GAME PLUGINS
 * 
 * This is where you register all your game plugins.
 * To add a new game:
 * 1. Create a new plugin file in server/plugins/games/
 * 2. Import it here
 * 3. Register it with gameRegistry.register()
 * 
 * That's it! Your game is now available in the platform.
 */

export const loadAllGamePlugins = () => {
  console.log('🎮 Loading game plugins...');

  // Register all games
  gameRegistry.register(TicTacToePlugin);
  gameRegistry.register(SnakePlugin);
  gameRegistry.register(MemoryMatchPlugin);
  gameRegistry.register(Game2048Plugin);
  gameRegistry.register(FlappyPlugin);
  gameRegistry.register(LudoPlugin);

  // Add more games here as you create them:
  // gameRegistry.register(ChessPlugin);
  // gameRegistry.register(ConnectFourPlugin);
  
  console.log(`✅ Loaded ${gameRegistry.getAllPlugins().length} game plugins`);
  
  return gameRegistry;
};

export default loadAllGamePlugins;
