/**
 * Application Configuration
 * Central configuration for the entire application
 */

export const AppConfig = {
  app: {
    name: 'GameZone',
    version: '1.0.0',
    description: '3D Gaming Platform with Multiplayer Support'
  },
  
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    timeout: 30000,
    retries: 3
  },
  
  socket: {
    url: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  },
  
  features: {
    enableMultiplayer: true,
    enableChat: true,
    enableFriends: true,
    enableLeaderboard: true,
    enableAchievements: true,
    enableDailyChallenges: false, // Coming soon
    enableTournaments: false // Coming soon
  },
  
  ui: {
    animationDuration: 300,
    toastDuration: 3000,
    modalAnimationDuration: 200
  },
  
  game: {
    defaultTimeLimit: null,
    maxPlayersPerRoom: 4,
    roomCodeLength: 6
  },
  
  storage: {
    authTokenKey: 'auth-storage',
    gameStateKey: 'game-storage',
    settingsKey: 'settings-storage'
  }
} as const;

export default AppConfig;
