import { PlayerColor, Coin, BlockState, PlayerState } from '../types';
import { MOVES, START_POSITIONS, SAFE_POSITIONS, START_DICE_VALUE, COINS_PER_PLAYER } from './constants';

/**
 * Initialize coins for a player
 */
export function initializePlayerCoins(color: PlayerColor): Coin[] {
  const coins: Coin[] = [];
  for (let i = 0; i < COINS_PER_PLAYER; i++) {
    coins.push({
      id: `${color[0]}${i}`,
      position: 'home',
      isTurnAvailable: false,
    });
  }
  return coins;
}

/**
 * Calculate the next position for a coin given dice value
 */
export function calculateNextPosition(
  coin: Coin,
  playerColor: PlayerColor,
  diceValue: number
): string | null {
  const currentPosition = coin.position;

  // If coin is at home, can only move if rolled 6
  if (currentPosition === 'home') {
    const startPos = START_POSITIONS[playerColor];
    return diceValue === START_DICE_VALUE ? String(startPos) : null;
  }

  // If coin already won, cannot move
  if (currentPosition === 'won') {
    return null;
  }

  // Find current position in the movement path
  const movePath = MOVES[playerColor];
  const currentIndex = movePath.findIndex(p => String(p) === String(currentPosition));

  if (currentIndex === -1) {
    return null; // Invalid position
  }

  // Calculate next position
  const nextIndex = currentIndex + diceValue;

  // Check if move is within bounds
  if (nextIndex >= movePath.length) {
    return null; // Cannot move beyond winning position
  }

  return String(movePath[nextIndex]);
}

/**
 * Check if a coin can move
 */
export function canCoinMove(
  coin: Coin,
  playerColor: PlayerColor,
  diceValue: number
): boolean {
  if (coin.position === 'won') {
    return false;
  }

  if (coin.position === 'home') {
    return diceValue === START_DICE_VALUE;
  }

  const nextPosition = calculateNextPosition(coin, playerColor, diceValue);
  return nextPosition !== null;
}

/**
 * Get all moveable coins for a player
 */
export function getMoveableCoins(
  player: PlayerState,
  diceValue: number
): Coin[] {
  return player.coins.filter((coin) =>
    canCoinMove(coin, player.color, diceValue)
  );
}

/**
 * Check if a position is safe (cannot kill coins here)
 */
export function isSafePosition(position: string): boolean {
  // Check if numeric position is in safe positions list
  const numPos = parseInt(position);
  if (!isNaN(numPos) && SAFE_POSITIONS.includes(numPos)) {
    return true;
  }
  // Home column positions are safe
  if (position.includes('home')) {
    return true;
  }
  return false;
}

/**
 * Get coins that would be killed if a coin moves to a position
 */
export function getKilledCoins(
  newPosition: string,
  movingCoinColor: PlayerColor,
  blocks: BlockState
): string[] {
  // Cannot kill on safe positions
  if (isSafePosition(newPosition)) {
    return [];
  }

  const coinsAtPosition = blocks[newPosition] || [];
  
  // Kill all coins that are from different colors
  return coinsAtPosition.filter((coinId) => {
    const coinColor = coinId[0];
    return coinColor !== movingCoinColor[0];
  });
}

/**
 * Update block state after a coin move
 */
export function updateBlockState(
  blocks: BlockState,
  coinId: string,
  oldPosition: string,
  newPosition: string,
  killedCoins: string[]
): BlockState {
  const newBlocks = { ...blocks };

  // Remove coin from old position
  if (oldPosition !== 'home' && oldPosition !== 'won') {
    newBlocks[oldPosition] = (newBlocks[oldPosition] || []).filter(
      (id) => id !== coinId
    );
    if (newBlocks[oldPosition].length === 0) {
      delete newBlocks[oldPosition];
    }
  }

  // Add coin to new position (if not won)
  if (newPosition !== 'won') {
    if (!newBlocks[newPosition]) {
      newBlocks[newPosition] = [];
    }
    newBlocks[newPosition].push(coinId);
  }

  // Remove killed coins
  if (killedCoins.length > 0 && newBlocks[newPosition]) {
    newBlocks[newPosition] = newBlocks[newPosition].filter(
      (id) => !killedCoins.includes(id)
    );
  }

  return newBlocks;
}

/**
 * Check if player gets another turn
 * - Rolled a 6
 * - Killed an opponent coin
 * - Entered winning position
 */
export function shouldGetAnotherTurn(
  diceValue: number,
  killedCoins: string[],
  newPosition: string
): boolean {
  return diceValue === 6 || killedCoins.length > 0 || newPosition.includes('-won');
}

/**
 * Get next player
 */
export function getNextPlayer(
  players: PlayerState[],
  currentPlayerColor: PlayerColor
): PlayerColor | null {
  const activePlayers = players.filter((p) => p.isActive && !p.hasWon);
  
  if (activePlayers.length === 0) {
    return null;
  }

  const currentIndex = activePlayers.findIndex((p) => p.color === currentPlayerColor);
  const nextIndex = (currentIndex + 1) % activePlayers.length;
  
  return activePlayers[nextIndex].color;
}

/**
 * Check if player has won (all coins in won position)
 */
export function hasPlayerWon(player: PlayerState): boolean {
  return player.coins.every((coin) => coin.position === 'won');
}

/**
 * Check if game is over (only one player left or winner declared)
 */
export function isGameOver(players: PlayerState[]): boolean {
  const activePlayers = players.filter((p) => p.isActive && !p.hasWon);
  return activePlayers.length <= 1;
}

/**
 * Generate a random room ID
 */
export function generateRoomId(): string {
  return `ludo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
