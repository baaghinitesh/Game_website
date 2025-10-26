/**
 * Game Categories
 * Centralized game category definitions
 */

export const GAME_CATEGORIES = {
  ALL: 'all',
  ARCADE: 'arcade',
  PUZZLE: 'puzzle',
  CARD: 'card',
  RACING: 'racing',
  STRATEGY: 'strategy',
  QUIZ: 'quiz'
} as const;

export const GAME_CATEGORY_LABELS: Record<string, string> = {
  [GAME_CATEGORIES.ALL]: 'All Games',
  [GAME_CATEGORIES.ARCADE]: 'Arcade',
  [GAME_CATEGORIES.PUZZLE]: 'Puzzle',
  [GAME_CATEGORIES.CARD]: 'Card Games',
  [GAME_CATEGORIES.RACING]: 'Racing',
  [GAME_CATEGORIES.STRATEGY]: 'Strategy',
  [GAME_CATEGORIES.QUIZ]: 'Quiz'
};

export const GAME_CATEGORY_EMOJIS: Record<string, string> = {
  [GAME_CATEGORIES.ALL]: '🎮',
  [GAME_CATEGORIES.ARCADE]: '🕹️',
  [GAME_CATEGORIES.PUZZLE]: '🧩',
  [GAME_CATEGORIES.CARD]: '🃏',
  [GAME_CATEGORIES.RACING]: '🏎️',
  [GAME_CATEGORIES.STRATEGY]: '⚔️',
  [GAME_CATEGORIES.QUIZ]: '🧠'
};

export type GameCategory = typeof GAME_CATEGORIES[keyof typeof GAME_CATEGORIES];

export default GAME_CATEGORIES;
