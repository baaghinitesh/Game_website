/**
 * TIC-TAC-TOE GAME PLUGIN
 * 
 * This demonstrates how to create a game plugin.
 * Each game plugin defines:
 * - Game initialization
 * - Move validation
 * - Winner calculation
 * - Game state management
 */

const TicTacToePlugin = {
  id: 'tictactoe',
  name: 'Tic Tac Toe',
  category: 'puzzle',
  minPlayers: 2,
  maxPlayers: 2,

  /**
   * Initialize game state
   */
  initializeState() {
    return {
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      isDraw: false,
      moveCount: 0,
    };
  },

  /**
   * Validate a move
   */
  validateMove(state, move) {
    const { position } = move;

    // Check if game is already over
    if (state.winner || state.isDraw) {
      return { valid: false, error: 'Game is already over' };
    }

    // Check if position is valid
    if (position < 0 || position > 8) {
      return { valid: false, error: 'Invalid position' };
    }

    // Check if position is already taken
    if (state.board[position] !== null) {
      return { valid: false, error: 'Position already taken' };
    }

    return { valid: true };
  },

  /**
   * Process game logic after a move
   */
  processGameLogic(state, move) {
    const newState = { ...state };
    const { position, player } = move;

    // Place the move
    newState.board[position] = player;
    newState.moveCount++;

    // Check for winner
    const winner = this.calculateWinner(newState);
    if (winner) {
      newState.winner = winner;
      return newState;
    }

    // Check for draw
    if (newState.moveCount === 9) {
      newState.isDraw = true;
      return newState;
    }

    // Switch player
    newState.currentPlayer = player === 'X' ? 'O' : 'X';

    return newState;
  },

  /**
   * Calculate winner
   */
  calculateWinner(state) {
    const { board } = state;
    
    // Winning combinations
    const lines = [
      [0, 1, 2], // Top row
      [3, 4, 5], // Middle row
      [6, 7, 8], // Bottom row
      [0, 3, 6], // Left column
      [1, 4, 7], // Middle column
      [2, 5, 8], // Right column
      [0, 4, 8], // Diagonal \
      [2, 4, 6], // Diagonal /
    ];

    for (let [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // Return 'X' or 'O'
      }
    }

    return null;
  },
};

export default TicTacToePlugin;
