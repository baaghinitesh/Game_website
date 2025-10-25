/**
 * SCALABLE GAME PLUGIN REGISTRY
 * 
 * This is the core of our scalable architecture.
 * Each game is a plugin that can be registered dynamically.
 * 
 * Benefits:
 * 1. Easy to add new games without modifying core code
 * 2. Games can be enabled/disabled without redeployment
 * 3. Each game has its own configuration and logic
 * 4. Supports both single-player and multiplayer games
 */

class GamePluginRegistry {
  constructor() {
    this.plugins = new Map();
  }

  /**
   * Register a new game plugin
   * @param {Object} plugin - Game plugin configuration
   */
  register(plugin) {
    const {
      id,
      name,
      category,
      minPlayers,
      maxPlayers,
      validateMove,
      calculateWinner,
      initializeState,
      processGameLogic,
    } = plugin;

    if (!id || !name) {
      throw new Error('Plugin must have an id and name');
    }

    if (this.plugins.has(id)) {
      console.warn(`⚠️  Plugin ${id} is already registered. Overwriting...`);
    }

    this.plugins.set(id, {
      id,
      name,
      category: category || 'arcade',
      minPlayers: minPlayers || 1,
      maxPlayers: maxPlayers || 1,
      isMultiplayer: maxPlayers > 1,
      validateMove: validateMove || (() => true),
      calculateWinner: calculateWinner || (() => null),
      initializeState: initializeState || (() => ({})),
      processGameLogic: processGameLogic || ((state) => state),
    });

    console.log(`✅ Game plugin registered: ${name} (${id})`);
  }

  /**
   * Get a registered plugin by ID
   */
  getPlugin(id) {
    return this.plugins.get(id);
  }

  /**
   * Get all registered plugins
   */
  getAllPlugins() {
    return Array.from(this.plugins.values());
  }

  /**
   * Check if a plugin exists
   */
  hasPlugin(id) {
    return this.plugins.has(id);
  }

  /**
   * Unregister a plugin
   */
  unregister(id) {
    if (this.plugins.has(id)) {
      this.plugins.delete(id);
      console.log(`🗑️  Plugin ${id} unregistered`);
      return true;
    }
    return false;
  }

  /**
   * Get plugins by category
   */
  getPluginsByCategory(category) {
    return this.getAllPlugins().filter(plugin => plugin.category === category);
  }
}

// Singleton instance
const gameRegistry = new GamePluginRegistry();

export default gameRegistry;
