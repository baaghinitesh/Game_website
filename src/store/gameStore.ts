import create from 'zustand';
import { Game, GameSession } from '../types';

interface GameState {
  games: Game[];
  currentGame: Game | null;
  currentSession: GameSession | null;
  gameState: any;
  setGames: (games: Game[]) => void;
  setCurrentGame: (game: Game | null) => void;
  setCurrentSession: (session: GameSession | null) => void;
  updateGameState: (state: any) => void;
}

export const useGameStore = create<GameState>((set) => ({
  games: [],
  currentGame: null,
  currentSession: null,
  gameState: null,
  
  setGames: (games) => set({ games }),
  
  setCurrentGame: (game) => set({ currentGame: game }),
  
  setCurrentSession: (session) => set({ currentSession: session }),
  
  updateGameState: (gameState) => set({ gameState }),
}));
