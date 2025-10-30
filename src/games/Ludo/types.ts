export type PlayerColor = 'red' | 'blue' | 'green' | 'yellow';

export type CoinPosition = 'home' | 'won' | string; // string for board positions like "r12", "b40", etc.

export interface Coin {
  id: string; // e.g., "r0", "r1", "r2", "r3"
  position: CoinPosition;
  isTurnAvailable: boolean;
}

export interface PlayerState {
  color: PlayerColor;
  coins: Coin[];
  isActive: boolean;
  hasWon: boolean;
}

export interface DiceState {
  value: number;
  isRolling: boolean;
  isLocked: boolean;
  lastRolledBy: PlayerColor | null;
}

export interface BlockState {
  [key: string]: string[]; // board position -> array of coin ids
}

export interface GameState {
  roomId: string;
  players: PlayerState[];
  currentPlayer: PlayerColor | null;
  dice: DiceState;
  blocks: BlockState;
  winner: PlayerColor | null;
  isStarted: boolean;
  isFinished: boolean;
}

export interface RoomInfo {
  roomId: string;
  players: Array<{
    id: string;
    color: PlayerColor;
    name: string;
  }>;
  maxPlayers: number;
  isStarted: boolean;
}

// Socket event types
export interface JoinRoomData {
  roomId: string;
  playerName: string;
}

export interface RollDiceData {
  roomId: string;
  playerColor: PlayerColor;
}

export interface MoveCoinData {
  roomId: string;
  playerColor: PlayerColor;
  coinId: string;
  newPosition: string;
}
