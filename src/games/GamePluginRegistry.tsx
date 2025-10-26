import React from 'react';
import { GamePlugin, GameComponentProps } from '@games/types';

/**
 * FRONTEND GAME PLUGIN REGISTRY
 * 
 * This mirrors the backend plugin system on the frontend.
 * Each game is a React component that can be dynamically loaded.
 * 
 * Benefits:
 * 1. Easy to add new games - just create a component and register it
 * 2. Games are isolated and don't affect each other
 * 3. Supports lazy loading for better performance
 * 4. Type-safe with TypeScript
 */

class FrontendGamePluginRegistry {
  private plugins: Map<string, GamePlugin> = new Map();

  /**
   * Register a game plugin
   */
  register(plugin: GamePlugin) {
    if (!plugin.id || !plugin.name || !plugin.component) {
      throw new Error('Plugin must have id, name, and component');
    }

    if (this.plugins.has(plugin.id)) {
      console.warn(`⚠️  Plugin ${plugin.id} is already registered. Overwriting...`);
    }

    this.plugins.set(plugin.id, plugin);
    console.log(`✅ Frontend game plugin registered: ${plugin.name} (${plugin.id})`);
  }

  /**
   * Get a plugin by ID
   */
  getPlugin(id: string): GamePlugin | undefined {
    return this.plugins.get(id);
  }

  /**
   * Get all plugins
   */
  getAllPlugins(): GamePlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Check if plugin exists
   */
  hasPlugin(id: string): boolean {
    return this.plugins.has(id);
  }

  /**
   * Get plugin component
   */
  getGameComponent(id: string): React.ComponentType<GameComponentProps> | null {
    const plugin = this.plugins.get(id);
    return plugin?.component || null;
  }
}

// Singleton instance
const frontendGameRegistry = new FrontendGamePluginRegistry();

export default frontendGameRegistry;
