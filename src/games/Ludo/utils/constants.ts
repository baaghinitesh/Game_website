import { PlayerColor } from '../types';

// Color mappings
export const PLAYER_COLORS: PlayerColor[] = ['red', 'blue', 'green', 'yellow'];

export const COLOR_MAP = {
  r: 'red',
  b: 'blue',
  g: 'green',
  y: 'yellow',
} as const;

export const COLOR_NAMES = {
  red: 'Red',
  blue: 'Blue',
  green: 'Green',
  yellow: 'Yellow',
} as const;

export const TAILWIND_COLORS = {
  red: {
    bg: 'bg-red-500',
    hover: 'hover:bg-red-600',
    border: 'border-red-500',
    text: 'text-red-500',
  },
  blue: {
    bg: 'bg-blue-500',
    hover: 'hover:bg-blue-600',
    border: 'border-blue-500',
    text: 'text-blue-500',
  },
  green: {
    bg: 'bg-green-500',
    hover: 'hover:bg-green-600',
    border: 'border-green-500',
    text: 'text-green-500',
  },
  yellow: {
    bg: 'bg-yellow-500',
    hover: 'hover:bg-yellow-600',
    border: 'border-yellow-500',
    text: 'text-yellow-500',
  },
} as const;

/**
 * TRADITIONAL LUDO BOARD - BASED ON REFERENCE IMAGES
 * ===================================================
 * 
 * 15×15 Grid Layout:
 * - 4 corner HOME BASES (6×6 each): RED (left), GREEN (top), YELLOW (right), BLUE (bottom)
 * - Cross-shaped track: 4 arms with 3-square width
 * - 52 squares in outer track (13 per side)
 * - Each player has a HOME COLUMN (6 squares) leading to center
 * - Central finish area
 * 
 * Position Naming: 
 * - Track positions: 0-51 (52 total positions in clockwise order)
 * - Home columns: r-home-1 to r-home-6, g-home-1 to g-home-6, etc.
 * - Start positions are where players enter from base (must roll 6)
 */

// Starting positions - the square where tokens enter the track after rolling 6
export const START_POSITIONS: Record<PlayerColor, number> = {
  red: 0,      // Red starts at position 0 (entering from left side)
  green: 13,   // Green starts at position 13 (entering from top side)
  yellow: 26,  // Yellow starts at position 26 (entering from right side)
  blue: 39,    // Blue starts at position 39 (entering from bottom side)
};

// Safe positions (8 total): 
// - 4 starting positions (one for each color)
// - 4 star-marked positions (one on each side of board)
export const SAFE_POSITIONS = [
  0,   // Red start - SAFE
  13,  // Green start - SAFE
  26,  // Yellow start - SAFE
  39,  // Blue start - SAFE
  8,   // Star position on left side - SAFE
  21,  // Star position on top side - SAFE
  34,  // Star position on right side - SAFE
  47,  // Star position on bottom side - SAFE
];

/**
 * Movement paths for each player
 * Each player moves 52 squares clockwise, then enters their home column (6 squares), then finishes
 */
export const MOVES: Record<PlayerColor, (number | string)[]> = {
  /**
   * RED starts from position 0 (left side middle)
   * Goes clockwise around board (52 positions)
   * Then enters red home column
   */
  red: [
    // Enter at start position and go clockwise
    ...Array.from({ length: 52 }, (_, i) => i),
    // Enter red home column (6 squares leading to center)
    'r-home-1', 'r-home-2', 'r-home-3', 'r-home-4', 'r-home-5', 'r-home-6',
    // Finish
    'r-won',
  ],

  /**
   * GREEN starts from position 13 (top side middle)
   * Goes clockwise: 13→51, then 0→12
   * Then enters green home column
   */
  green: [
    // Start at 13, go to 51
    ...Array.from({ length: 39 }, (_, i) => i + 13),
    // Wrap around: 0 to 12
    ...Array.from({ length: 13 }, (_, i) => i),
    // Enter green home column
    'g-home-1', 'g-home-2', 'g-home-3', 'g-home-4', 'g-home-5', 'g-home-6',
    // Finish
    'g-won',
  ],

  /**
   * YELLOW starts from position 26 (right side middle)
   * Goes clockwise: 26→51, then 0→25
   * Then enters yellow home column
   */
  yellow: [
    // Start at 26, go to 51
    ...Array.from({ length: 26 }, (_, i) => i + 26),
    // Wrap around: 0 to 25
    ...Array.from({ length: 26 }, (_, i) => i),
    // Enter yellow home column
    'y-home-1', 'y-home-2', 'y-home-3', 'y-home-4', 'y-home-5', 'y-home-6',
    // Finish
    'y-won',
  ],

  /**
   * BLUE starts from position 39 (bottom side middle)
   * Goes clockwise: 39→51, then 0→38
   * Then enters blue home column
   */
  blue: [
    // Start at 39, go to 51
    ...Array.from({ length: 13 }, (_, i) => i + 39),
    // Wrap around: 0 to 38
    ...Array.from({ length: 39 }, (_, i) => i),
    // Enter blue home column
    'b-home-1', 'b-home-2', 'b-home-3', 'b-home-4', 'b-home-5', 'b-home-6',
    // Finish
    'b-won',
  ],
};

// Game constants
export const COINS_PER_PLAYER = 4;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 4;
export const DICE_MIN = 1;
export const DICE_MAX = 6;
export const START_DICE_VALUE = 6; // Must roll 6 to start
export const ANIMATION_DURATION = 1000; // ms
export const MOVE_DURATION = 300; // ms
