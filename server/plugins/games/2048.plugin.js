/**
 * 2048 Game Plugin - Backend Logic
 * Classic 2048 sliding tile puzzle
 */

const Game2048Plugin = {
  id: '2048',
  name: '2048',
  category: 'puzzle',
  minPlayers: 1,
  maxPlayers: 1,
  description: 'Slide tiles to combine numbers and reach 2048!',

  /**
   * Initialize empty 4x4 grid
   */
  createEmptyGrid() {
    return Array(4).fill(null).map(() => Array(4).fill(0));
  },

  /**
   * Add random tile (2 or 4) to empty position
   */
  addRandomTile(grid) {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    return grid;
  },

  /**
   * Initialize game state with two random tiles
   */
  initializeState() {
    let grid = this.createEmptyGrid();
    grid = this.addRandomTile(grid);
    grid = this.addRandomTile(grid);

    return {
      grid,
      score: 0,
      bestScore: 0,
      gameOver: false,
      won: false
    };
  },

  /**
   * Move and merge tiles in one direction
   */
  moveLeft(grid) {
    const newGrid = grid.map(row => [...row]);
    let moved = false;
    let scoreGained = 0;

    for (let r = 0; r < 4; r++) {
      // Remove zeros
      let row = newGrid[r].filter(val => val !== 0);
      
      // Merge adjacent equal values
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          scoreGained += row[i];
          row[i + 1] = 0;
        }
      }

      // Remove zeros again after merge
      row = row.filter(val => val !== 0);

      // Pad with zeros
      while (row.length < 4) {
        row.push(0);
      }

      // Check if row changed
      if (JSON.stringify(newGrid[r]) !== JSON.stringify(row)) {
        moved = true;
      }

      newGrid[r] = row;
    }

    return { grid: newGrid, moved, scoreGained };
  },

  /**
   * Rotate grid 90 degrees clockwise
   */
  rotateRight(grid) {
    const newGrid = this.createEmptyGrid();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        newGrid[c][3 - r] = grid[r][c];
      }
    }
    return newGrid;
  },

  /**
   * Rotate grid 90 degrees counter-clockwise
   */
  rotateLeft(grid) {
    const newGrid = this.createEmptyGrid();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        newGrid[3 - c][r] = grid[r][c];
      }
    }
    return newGrid;
  },

  /**
   * Move tiles in specified direction
   */
  move(grid, direction) {
    let newGrid = grid.map(row => [...row]);
    let moved = false;
    let scoreGained = 0;

    switch (direction) {
      case 'LEFT': {
        const result = this.moveLeft(newGrid);
        newGrid = result.grid;
        moved = result.moved;
        scoreGained = result.scoreGained;
        break;
      }
      case 'RIGHT': {
        newGrid = this.rotateRight(this.rotateRight(newGrid));
        const result = this.moveLeft(newGrid);
        newGrid = this.rotateLeft(this.rotateLeft(result.grid));
        moved = result.moved;
        scoreGained = result.scoreGained;
        break;
      }
      case 'UP': {
        newGrid = this.rotateLeft(newGrid);
        const result = this.moveLeft(newGrid);
        newGrid = this.rotateRight(result.grid);
        moved = result.moved;
        scoreGained = result.scoreGained;
        break;
      }
      case 'DOWN': {
        newGrid = this.rotateRight(newGrid);
        const result = this.moveLeft(newGrid);
        newGrid = this.rotateLeft(result.grid);
        moved = result.moved;
        scoreGained = result.scoreGained;
        break;
      }
    }

    return { grid: newGrid, moved, scoreGained };
  },

  /**
   * Check if any moves are possible
   */
  canMove(grid) {
    // Check for empty cells
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === 0) return true;
      }
    }

    // Check for possible merges
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = grid[r][c];
        if (c < 3 && current === grid[r][c + 1]) return true;
        if (r < 3 && current === grid[r + 1][c]) return true;
      }
    }

    return false;
  },

  /**
   * Check if player has won (reached 2048)
   */
  hasWon(grid) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] >= 2048) return true;
      }
    }
    return false;
  },

  /**
   * Validate move
   */
  validateMove(state, move) {
    const { direction } = move;
    
    if (!['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(direction)) {
      return { valid: false, reason: 'Invalid direction' };
    }

    if (state.gameOver) {
      return { valid: false, reason: 'Game is over' };
    }

    return { valid: true };
  },

  /**
   * Process game logic
   */
  processGameLogic(state, move) {
    if (state.gameOver) {
      return state;
    }

    const validation = this.validateMove(state, move);
    if (!validation.valid) {
      return state;
    }

    const { direction } = move;
    const result = this.move(state.grid, direction);

    if (!result.moved) {
      return state; // No change
    }

    const newGrid = this.addRandomTile(result.grid);
    const newScore = state.score + result.scoreGained;
    const won = !state.won && this.hasWon(newGrid);
    const gameOver = !this.canMove(newGrid);

    return {
      ...state,
      grid: newGrid,
      score: newScore,
      bestScore: Math.max(state.bestScore, newScore),
      won,
      gameOver
    };
  },

  /**
   * Calculate final result
   */
  calculateWinner(state) {
    return {
      gameOver: state.gameOver,
      won: state.won,
      score: state.score,
      bestScore: state.bestScore
    };
  }
};

export default Game2048Plugin;
