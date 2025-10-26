/**
 * Flappy Bird Clone Plugin - Backend Logic
 * Simple arcade game with obstacle avoidance
 */

const FlappyPlugin = {
  id: 'flappy',
  name: 'Flappy Jump',
  category: 'arcade',
  minPlayers: 1,
  maxPlayers: 1,
  description: 'Tap to jump and avoid obstacles! How far can you go?',

  /**
   * Initialize game state
   */
  initializeState() {
    return {
      bird: {
        y: 250, // vertical position
        velocity: 0,
        gravity: 0.6,
        jumpForce: -10
      },
      pipes: [
        { x: 400, gapY: 200, passed: false },
        { x: 700, gapY: 300, passed: false }
      ],
      score: 0,
      gameOver: false,
      gameStarted: false,
      pipeWidth: 60,
      pipeGap: 150,
      pipeSpeed: 3
    };
  },

  /**
   * Validate jump action
   */
  validateMove(state, move) {
    if (state.gameOver) {
      return { valid: false, reason: 'Game is over' };
    }

    if (move.action !== 'jump') {
      return { valid: false, reason: 'Invalid action' };
    }

    return { valid: true };
  },

  /**
   * Process game logic - bird physics and collision
   */
  processGameLogic(state, move) {
    if (state.gameOver) {
      return state;
    }

    // Start game on first jump
    if (!state.gameStarted && move && move.action === 'jump') {
      state.gameStarted = true;
    }

    if (!state.gameStarted) {
      return state;
    }

    // Apply jump
    if (move && move.action === 'jump') {
      const validation = this.validateMove(state, move);
      if (validation.valid) {
        state.bird.velocity = state.bird.jumpForce;
      }
    }

    // Apply gravity
    state.bird.velocity += state.bird.gravity;
    state.bird.y += state.bird.velocity;

    // Check ground/ceiling collision
    if (state.bird.y < 0 || state.bird.y > 500) {
      state.gameOver = true;
      return state;
    }

    // Move pipes
    state.pipes = state.pipes.map(pipe => ({
      ...pipe,
      x: pipe.x - state.pipeSpeed
    }));

    // Add new pipe when needed
    const lastPipe = state.pipes[state.pipes.length - 1];
    if (lastPipe.x < 200) {
      const gapY = 100 + Math.random() * 250;
      state.pipes.push({
        x: 700,
        gapY,
        passed: false
      });
    }

    // Remove off-screen pipes
    state.pipes = state.pipes.filter(pipe => pipe.x > -state.pipeWidth);

    // Check collisions and score
    const birdLeft = 100;
    const birdRight = 134;
    const birdTop = state.bird.y;
    const birdBottom = state.bird.y + 24;

    for (const pipe of state.pipes) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + state.pipeWidth;
      const topPipeBottom = pipe.gapY;
      const bottomPipeTop = pipe.gapY + state.pipeGap;

      // Check if bird is in pipe's x range
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check collision with top or bottom pipe
        if (birdTop < topPipeBottom || birdBottom > bottomPipeTop) {
          state.gameOver = true;
          return state;
        }
      }

      // Check if bird passed the pipe
      if (!pipe.passed && birdLeft > pipeRight) {
        pipe.passed = true;
        state.score++;
      }
    }

    return state;
  },

  /**
   * Calculate final score
   */
  calculateWinner(state) {
    return {
      gameOver: state.gameOver,
      score: state.score
    };
  }
};

export default FlappyPlugin;
