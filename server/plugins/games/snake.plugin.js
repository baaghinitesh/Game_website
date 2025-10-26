/**
 * Snake Game Plugin - Backend Logic
 * Classic snake game with growing mechanics
 */

const SnakePlugin = {
  id: 'snake',
  name: 'Snake Game',
  category: 'arcade',
  minPlayers: 1,
  maxPlayers: 1,
  description: 'Classic Snake game - eat food, grow longer, avoid walls and yourself!',

  /**
   * Initialize game state
   */
  initializeState() {
    const gridSize = 20;
    const startPos = { x: 10, y: 10 };
    
    return {
      gridSize,
      snake: [startPos, { x: 10, y: 9 }, { x: 10, y: 8 }],
      direction: 'RIGHT',
      food: this.generateFood(gridSize, [startPos]),
      score: 0,
      gameOver: false,
      speed: 150, // milliseconds per move
    };
  },

  /**
   * Generate random food position
   */
  generateFood(gridSize, snake) {
    let food;
    let valid = false;
    
    while (!valid) {
      food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
      
      // Check if food is not on snake
      valid = !snake.some(segment => segment.x === food.x && segment.y === food.y);
    }
    
    return food;
  },

  /**
   * Validate player move (direction change)
   */
  validateMove(state, move) {
    const { direction } = move;
    const currentDirection = state.direction;
    
    // Can't reverse direction
    if (
      (currentDirection === 'UP' && direction === 'DOWN') ||
      (currentDirection === 'DOWN' && direction === 'UP') ||
      (currentDirection === 'LEFT' && direction === 'RIGHT') ||
      (currentDirection === 'RIGHT' && direction === 'LEFT')
    ) {
      return { valid: false, reason: 'Cannot reverse direction' };
    }
    
    if (!['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(direction)) {
      return { valid: false, reason: 'Invalid direction' };
    }
    
    return { valid: true };
  },

  /**
   * Process game logic - move snake
   */
  processGameLogic(state, move) {
    if (state.gameOver) {
      return state;
    }

    // Update direction if move provided
    if (move && move.direction) {
      const validation = this.validateMove(state, move);
      if (validation.valid) {
        state.direction = move.direction;
      }
    }

    // Calculate new head position
    const head = { ...state.snake[0] };
    
    switch (state.direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }

    // Check wall collision
    if (head.x < 0 || head.x >= state.gridSize || head.y < 0 || head.y >= state.gridSize) {
      state.gameOver = true;
      return state;
    }

    // Check self collision
    if (state.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      state.gameOver = true;
      return state;
    }

    // Add new head
    state.snake.unshift(head);

    // Check if food eaten
    if (head.x === state.food.x && head.y === state.food.y) {
      state.score += 10;
      state.food = this.generateFood(state.gridSize, state.snake);
      // Increase speed slightly
      state.speed = Math.max(50, state.speed - 2);
    } else {
      // Remove tail if no food eaten
      state.snake.pop();
    }

    return state;
  },

  /**
   * Calculate final score
   */
  calculateWinner(state) {
    return {
      gameOver: state.gameOver,
      score: state.score,
      length: state.snake.length
    };
  }
};

export default SnakePlugin;
