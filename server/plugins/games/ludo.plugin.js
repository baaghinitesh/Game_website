/**
 * LUDO GAME PLUGIN
 * 
 * Real-time multiplayer Ludo game with:
 * - 2-4 players
 * - Dice rolling mechanics
 * - Coin movement and collision
 * - Turn-based gameplay
 * - Winner detection
 */

const LudoPlugin = {
  id: 'ludo',
  name: 'Ludo',
  category: 'strategy',
  minPlayers: 2,
  maxPlayers: 4,

  /**
   * Initialize game state for Ludo
   */
  initializeState(playerCount = 4) {
    const colors = ['red', 'blue', 'green', 'yellow'].slice(0, playerCount);
    
    const players = {};
    colors.forEach((color) => {
      players[color] = {
        coins: {
          [`${color[0]}0`]: { position: 'home', isTurnAvailable: false },
          [`${color[0]}1`]: { position: 'home', isTurnAvailable: false },
          [`${color[0]}2`]: { position: 'home', isTurnAvailable: false },
          [`${color[0]}3`]: { position: 'home', isTurnAvailable: false },
        },
        isActive: true,
        hasWon: false,
      };
    });

    return {
      players,
      currentPlayer: colors[0],
      dice: {
        value: 0,
        isLocked: false,
        lastRolledBy: null,
      },
      blocks: {}, // position -> array of coin ids
      winner: null,
      isFinished: false,
      playerOrder: colors,
    };
  },

  /**
   * Validate dice roll
   */
  validateDiceRoll(state, playerColor) {
    // Check if it's the player's turn
    if (state.currentPlayer !== playerColor) {
      return { valid: false, error: 'Not your turn' };
    }

    // Check if dice is locked (waiting for move)
    if (state.dice.isLocked) {
      return { valid: false, error: 'Must move a coin before rolling again' };
    }

    // Check if game is finished
    if (state.isFinished) {
      return { valid: false, error: 'Game is already finished' };
    }

    return { valid: true };
  },

  /**
   * Process dice roll
   */
  processDiceRoll(state, playerColor) {
    const newState = { ...state };
    const diceValue = Math.floor(Math.random() * 6) + 1;

    newState.dice = {
      value: diceValue,
      isLocked: true,
      lastRolledBy: playerColor,
    };

    // Check if any coins can move
    const player = newState.players[playerColor];
    const canMove = this.checkIfPlayerCanMove(player, diceValue, playerColor);

    // If no coins can move, automatically switch to next player
    if (!canMove) {
      newState.dice.isLocked = false;
      newState.currentPlayer = this.getNextPlayer(state.playerOrder, playerColor);
    }

    return newState;
  },

  /**
   * Check if a player has any moveable coins
   */
  checkIfPlayerCanMove(player, diceValue, playerColor) {
    const coins = player.coins;
    
    for (const coinId in coins) {
      const coin = coins[coinId];
      
      // Can move from home if rolled 6
      if (coin.position === 'home' && diceValue === 6) {
        return true;
      }
      
      // Can move if not at home and not won
      if (coin.position !== 'home' && coin.position !== 'won') {
        // Check if move is within bounds (simplified)
        return true;
      }
    }
    
    return false;
  },

  /**
   * Validate coin move
   */
  validateCoinMove(state, playerColor, coinId, newPosition) {
    // Check if it's the player's turn
    if (state.currentPlayer !== playerColor) {
      return { valid: false, error: 'Not your turn' };
    }

    // Check if dice is locked (has been rolled)
    if (!state.dice.isLocked || state.dice.value === 0) {
      return { valid: false, error: 'Must roll dice first' };
    }

    // Check if coin belongs to player
    const player = state.players[playerColor];
    if (!player || !player.coins[coinId]) {
      return { valid: false, error: 'Invalid coin' };
    }

    const coin = player.coins[coinId];

    // Check if coin is already won
    if (coin.position === 'won') {
      return { valid: false, error: 'Coin already won' };
    }

    // Validate position based on dice value
    if (coin.position === 'home' && state.dice.value !== 6) {
      return { valid: false, error: 'Must roll 6 to start' };
    }

    return { valid: true };
  },

  /**
   * Process coin move
   */
  processCoinMove(state, playerColor, coinId, newPosition) {
    const newState = JSON.parse(JSON.stringify(state)); // Deep clone
    const player = newState.players[playerColor];
    const coin = player.coins[coinId];
    const oldPosition = coin.position;

    // Update coin position
    coin.position = newPosition;

    // Update blocks
    if (oldPosition !== 'home' && oldPosition !== 'won') {
      if (newState.blocks[oldPosition]) {
        newState.blocks[oldPosition] = newState.blocks[oldPosition].filter(
          (id) => id !== coinId
        );
        if (newState.blocks[oldPosition].length === 0) {
          delete newState.blocks[oldPosition];
        }
      }
    }

    if (newPosition !== 'won') {
      if (!newState.blocks[newPosition]) {
        newState.blocks[newPosition] = [];
      }
      newState.blocks[newPosition].push(coinId);
    }

    // Check for killed coins (if not safe position)
    const killedCoins = this.getKilledCoins(
      newPosition,
      coinId,
      newState.blocks
    );

    // Reset killed coins to home
    killedCoins.forEach((killedCoinId) => {
      const killedColor = this.getColorFromCoinId(killedCoinId);
      newState.players[killedColor].coins[killedCoinId].position = 'home';
      
      // Remove from blocks
      if (newState.blocks[newPosition]) {
        newState.blocks[newPosition] = newState.blocks[newPosition].filter(
          (id) => id !== killedCoinId
        );
      }
    });

    // Check if player won
    const playerWon = this.checkIfPlayerWon(player);
    if (playerWon) {
      player.hasWon = true;
      newState.winner = playerColor;
      newState.isFinished = this.checkIfGameFinished(newState);
    }

    // Determine if player gets another turn
    const getAnotherTurn =
      state.dice.value === 6 || killedCoins.length > 0 || newPosition === 'won';

    // Update turn
    if (!getAnotherTurn && !newState.isFinished) {
      newState.currentPlayer = this.getNextPlayer(
        state.playerOrder,
        playerColor
      );
    }

    newState.dice = {
      value: getAnotherTurn ? state.dice.value : 0,
      isLocked: false,
      lastRolledBy: playerColor,
    };

    return newState;
  },

  /**
   * Get coins that were killed by a move
   */
  getKilledCoins(position, movingCoinId, blocks) {
    // Simplified safe positions (star positions)
    const safePositions = [
      'r00', 'b00', 'g00', 'y00',
      'r08', 'b08', 'g08', 'y08',
    ];

    // Home stretch positions are safe
    if (position.includes('h') || safePositions.includes(position)) {
      return [];
    }

    const coinsAtPosition = blocks[position] || [];
    const movingColor = movingCoinId[0];

    return coinsAtPosition.filter(
      (coinId) => coinId !== movingCoinId && coinId[0] !== movingColor
    );
  },

  /**
   * Get color from coin ID
   */
  getColorFromCoinId(coinId) {
    const colorMap = {
      r: 'red',
      b: 'blue',
      g: 'green',
      y: 'yellow',
    };
    return colorMap[coinId[0]];
  },

  /**
   * Check if player has won
   */
  checkIfPlayerWon(player) {
    const coins = player.coins;
    return Object.values(coins).every((coin) => coin.position === 'won');
  },

  /**
   * Check if game is finished
   */
  checkIfGameFinished(state) {
    const activePlayers = Object.keys(state.players).filter(
      (color) => state.players[color].isActive && !state.players[color].hasWon
    );
    return activePlayers.length <= 1;
  },

  /**
   * Get next player
   */
  getNextPlayer(playerOrder, currentPlayer) {
    const currentIndex = playerOrder.indexOf(currentPlayer);
    return playerOrder[(currentIndex + 1) % playerOrder.length];
  },

  /**
   * Get game result
   */
  getGameResult(state) {
    return {
      winner: state.winner,
      isFinished: state.isFinished,
      players: Object.keys(state.players).map((color) => ({
        color,
        hasWon: state.players[color].hasWon,
        coinsWon: Object.values(state.players[color].coins).filter(
          (c) => c.position === 'won'
        ).length,
      })),
    };
  },
};

export default LudoPlugin;
