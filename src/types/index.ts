// User types
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar: string;
  xp: number;
  level: number;
  badges?: Badge[];
  friends?: string[];
  status?: 'online' | 'offline' | 'in-game';
  isGuest?: boolean;
  guestId?: string;
}

export interface Badge {
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

// Game types
export interface Game {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: GameCategory;
  thumbnail: string;
  minPlayers: number;
  maxPlayers: number;
  isMultiplayer: boolean;
  pluginId: string;
  componentPath: string;
  totalPlays: number;
  activePlayers: number;
  featured: boolean;
}

export type GameCategory = 'arcade' | 'puzzle' | 'card' | 'racing' | 'strategy' | 'quiz';

// Game session types
export interface GameSession {
  id: string;
  roomId: string;
  gameId: string;
  players: Player[];
  maxPlayers: number;
  status: 'waiting' | 'active' | 'finished' | 'abandoned';
  gameState: any;
  inviteCode?: string;
  isPrivate: boolean;
}

export interface Player {
  userId?: string;
  username: string;
  isGuest: boolean;
  avatar?: string;
}

// Game history
export interface GameHistory {
  _id: string;
  userId: string;
  gameId: string;
  score: number;
  result: 'win' | 'loss' | 'draw' | 'completed';
  xpEarned: number;
  duration: number;
  playedAt: Date;
}

// Friend types
export interface Friend {
  _id: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'in-game';
  lastOnline?: Date;
}

export interface FriendRequest {
  _id: string;
  from: User;
  sentAt: Date;
}

// Socket events
export interface SocketEvents {
  'user:online': (userId: string) => void;
  'user:status': (data: { userId: string; status: string }) => void;
  'game:join-room': (data: { roomId: string; userId: string; username: string }) => void;
  'game:leave-room': (data: { roomId: string; userId: string; username: string }) => void;
  'game:move': (data: { roomId: string; move: any; userId: string }) => void;
  'game:state': (data: { gameState: any; players: Player[] }) => void;
  'game:state-update': (data: { gameState: any; status: string }) => void;
  'game:ended': (data: { winner: string | null; isDraw: boolean }) => void;
  'game:player-joined': (data: { userId: string; username: string; playerCount: number }) => void;
  'game:player-left': (data: { userId: string; username: string }) => void;
  'game:error': (data: { message: string }) => void;
  'friend:invite': (data: { fromUserId: string; toUserId: string; roomId: string; gameName: string }) => void;
  'friend:invite-received': (data: { fromUserId: string; roomId: string; gameName: string }) => void;
  'chat:message': (data: { roomId: string; userId: string; username: string; message: string }) => void;
}

// API Response types
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

// Plugin system types
export interface GamePlugin {
  id: string;
  name: string;
  category: GameCategory;
  minPlayers: number;
  maxPlayers: number;
  isMultiplayer: boolean;
  component: React.ComponentType<GameComponentProps>;
}

export interface GameComponentProps {
  roomId?: string;
  isMultiplayer?: boolean;
  onGameEnd?: (result: GameEndResult) => void;
}

export interface GameEndResult {
  winner: string | null;
  isDraw: boolean;
  score?: number;
}
