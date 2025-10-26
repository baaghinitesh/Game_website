/**
 * Memory Match Game Plugin - Backend Logic
 * Classic memory card matching game
 */

const MemoryMatchPlugin = {
  id: 'memorymatch',
  name: 'Memory Match',
  category: 'puzzle',
  minPlayers: 1,
  maxPlayers: 2,
  description: 'Test your memory! Find matching pairs of cards.',

  /**
   * Generate shuffled card pairs
   */
  generateCards(pairCount = 8) {
    const emojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎬', '🎵', '🎸', '🎹', '🎺', '🎻'];
    const selectedEmojis = emojis.slice(0, pairCount);
    const cards = [...selectedEmojis, ...selectedEmojis].map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false
    }));

    // Shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    return cards;
  },

  /**
   * Initialize game state
   */
  initializeState() {
    return {
      cards: this.generateCards(8),
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      score: 0,
      gameOver: false,
      currentPlayer: 0, // For multiplayer
      players: [
        { id: 0, name: 'Player 1', score: 0 },
        { id: 1, name: 'Player 2', score: 0 }
      ]
    };
  },

  /**
   * Validate card flip move
   */
  validateMove(state, move) {
    const { cardId } = move;
    
    if (cardId === undefined || cardId < 0 || cardId >= state.cards.length) {
      return { valid: false, reason: 'Invalid card ID' };
    }

    const card = state.cards[cardId];
    
    if (card.isMatched) {
      return { valid: false, reason: 'Card already matched' };
    }

    if (state.flippedCards.includes(cardId)) {
      return { valid: false, reason: 'Card already flipped' };
    }

    if (state.flippedCards.length >= 2) {
      return { valid: false, reason: 'Wait for cards to reset' };
    }

    return { valid: true };
  },

  /**
   * Process game logic - flip cards and check matches
   */
  processGameLogic(state, move) {
    if (state.gameOver) {
      return state;
    }

    const { cardId } = move;
    const validation = this.validateMove(state, move);
    
    if (!validation.valid) {
      return state;
    }

    // Flip the card
    state.cards[cardId].isFlipped = true;
    state.flippedCards.push(cardId);

    // Check if two cards are flipped
    if (state.flippedCards.length === 2) {
      state.moves++;
      
      const [firstId, secondId] = state.flippedCards;
      const firstCard = state.cards[firstId];
      const secondCard = state.cards[secondId];

      // Check if cards match
      if (firstCard.emoji === secondCard.emoji) {
        firstCard.isMatched = true;
        secondCard.isMatched = true;
        state.matchedPairs++;
        state.score += 100;
        
        // Award points to current player in multiplayer
        if (state.players[state.currentPlayer]) {
          state.players[state.currentPlayer].score += 100;
        }

        state.flippedCards = [];

        // Check if game is complete
        if (state.matchedPairs === state.cards.length / 2) {
          state.gameOver = true;
        }
      } else {
        // Cards don't match - they will be flipped back by frontend
        // Switch player in multiplayer mode
        state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
      }
    }

    return state;
  },

  /**
   * Reset flipped cards (called by frontend after mismatch)
   */
  resetFlippedCards(state) {
    state.flippedCards.forEach(cardId => {
      state.cards[cardId].isFlipped = false;
    });
    state.flippedCards = [];
    return state;
  },

  /**
   * Calculate winner
   */
  calculateWinner(state) {
    const totalPairs = state.cards.length / 2;
    const isComplete = state.matchedPairs === totalPairs;
    
    if (state.players.length === 2) {
      const winner = state.players[0].score > state.players[1].score 
        ? state.players[0] 
        : state.players[1];
      
      return {
        gameOver: isComplete,
        winner: isComplete ? winner.name : null,
        scores: state.players.map(p => ({ name: p.name, score: p.score })),
        moves: state.moves
      };
    }

    return {
      gameOver: isComplete,
      score: state.score,
      moves: state.moves,
      accuracy: totalPairs > 0 ? ((state.matchedPairs / state.moves) * 100).toFixed(1) : 0
    };
  }
};

export default MemoryMatchPlugin;
