/**
 * Application Routes
 * Centralized route definitions
 */

export const ROUTES = {
  HOME: '/',
  
  // Auth routes
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout'
  },
  
  // Game routes
  GAMES: {
    LIST: '/games',
    CATEGORY: '/games/:category',
    PLAY: '/play/:roomId',
    CREATE: '/games/create'
  },
  
  // User routes
  USER: {
    PROFILE: '/profile',
    SETTINGS: '/settings',
    STATS: '/profile/stats'
  },
  
  // Social routes
  SOCIAL: {
    FRIENDS: '/friends',
    LEADERBOARD: '/leaderboard',
    ACHIEVEMENTS: '/achievements'
  }
} as const;

export default ROUTES;
