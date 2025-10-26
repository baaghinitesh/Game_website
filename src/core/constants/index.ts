/**
 * Constants Barrel Export
 * Single entry point for all constants
 */

export * from './routes';
export * from './game-categories';

export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_GUEST_LOGIN: '/api/auth/guest-login',
  AUTH_PROFILE: '/api/auth/profile',
  AUTH_LOGOUT: '/api/auth/logout',
  
  // Games
  GAMES_LIST: '/api/games',
  GAMES_BY_CATEGORY: '/api/games/category/:category',
  GAMES_SESSION: '/api/games/session',
  GAMES_HISTORY: '/api/games/history/:userId',
  GAMES_LEADERBOARD: '/api/games/leaderboard/:gameId',
  
  // Users
  USERS_SEARCH: '/api/users/search',
  USERS_FRIENDS: '/api/users/friends',
  USERS_FRIEND_REQUEST: '/api/users/friend-request',
  USERS_ACCEPT_REQUEST: '/api/users/accept-request'
} as const;

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // User
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  USER_STATUS: 'user:status',
  
  // Game
  GAME_JOIN_ROOM: 'game:join-room',
  GAME_LEAVE_ROOM: 'game:leave-room',
  GAME_MOVE: 'game:move',
  GAME_STATE: 'game:state',
  GAME_STATE_UPDATE: 'game:state-update',
  GAME_ENDED: 'game:ended',
  GAME_PLAYER_JOINED: 'game:player-joined',
  GAME_PLAYER_LEFT: 'game:player-left',
  
  // Friends
  FRIEND_INVITE: 'friend:invite',
  FRIEND_ACCEPT: 'friend:accept',
  FRIEND_ONLINE: 'friend:online',
  FRIEND_OFFLINE: 'friend:offline',
  
  // Chat
  CHAT_MESSAGE: 'chat:message',
  CHAT_TYPING: 'chat:typing'
} as const;

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth-storage',
  GAME_STATE: 'game-storage',
  USER_PREFERENCES: 'user-preferences',
  HIGH_SCORES: {
    SNAKE: 'snakeHighScore',
    FLAPPY: 'flappyHighScore',
    GAME_2048: '2048BestScore'
  }
} as const;
