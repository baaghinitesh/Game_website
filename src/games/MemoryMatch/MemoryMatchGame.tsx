import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { GameComponentProps } from '../GamePluginRegistry';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameState {
  cards: Card[];
  flippedCards: number[];
  matchedPairs: number;
  moves: number;
  score: number;
  gameOver: boolean;
}

const MemoryMatchGame = ({ onGameEnd }: GameComponentProps) => {
  const generateCards = (pairCount = 8): Card[] => {
    const emojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎬', '🎵', '🎸', '🎹', '🎺', '🎻'];
    const selectedEmojis = emojis.slice(0, pairCount);
    const cards = [...selectedEmojis, ...selectedEmojis].map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false
    }));

    // Shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    return cards;
  };

  const [gameState, setGameState] = useState<GameState>({
    cards: generateCards(),
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    score: 0,
    gameOver: false
  });

  const [canFlip, setCanFlip] = useState(true);

  const handleCardClick = (cardId: number) => {
    if (!canFlip) return;

    const card = gameState.cards[cardId];
    if (card.isMatched || card.isFlipped || gameState.flippedCards.length >= 2) {
      return;
    }

    const newCards = [...gameState.cards];
    newCards[cardId].isFlipped = true;

    const newFlipped = [...gameState.flippedCards, cardId];

    setGameState(prev => ({
      ...prev,
      cards: newCards,
      flippedCards: newFlipped
    }));

    // Check for match if two cards are flipped
    if (newFlipped.length === 2) {
      setCanFlip(false);

      const [firstId, secondId] = newFlipped;
      const firstCard = newCards[firstId];
      const secondCard = newCards[secondId];

      setTimeout(() => {
        if (firstCard.emoji === secondCard.emoji) {
          // Match!
          toast.success('Match found! 🎉', { duration: 1500 });
          newCards[firstId].isMatched = true;
          newCards[secondId].isMatched = true;

          const newMatchedPairs = gameState.matchedPairs + 1;
          const newScore = gameState.score + 100;
          const newMoves = gameState.moves + 1;
          const totalPairs = gameState.cards.length / 2;

          const isComplete = newMatchedPairs === totalPairs;

          setGameState({
            cards: newCards,
            flippedCards: [],
            matchedPairs: newMatchedPairs,
            moves: newMoves,
            score: newScore,
            gameOver: isComplete
          });

          if (isComplete) {
            toast.success(`Game Complete! Score: ${newScore} 🏆`);
            onGameEnd?.({ score: newScore, result: 'win' });
          }
        } else {
          // No match
          newCards[firstId].isFlipped = false;
          newCards[secondId].isFlipped = false;

          setGameState(prev => ({
            ...prev,
            cards: newCards,
            flippedCards: [],
            moves: prev.moves + 1
          }));
        }

        setCanFlip(true);
      }, 1000);
    }
  };

  const restartGame = () => {
    setGameState({
      cards: generateCards(),
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      score: 0,
      gameOver: false
    });
    setCanFlip(true);
  };

  const accuracy = gameState.moves > 0 
    ? ((gameState.matchedPairs / gameState.moves) * 100).toFixed(1) 
    : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-4">
      {/* Stats */}
      <div className="flex gap-4 mb-6 flex-wrap justify-center">
        <motion.div
          className="glass-card px-6 py-3 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-text-secondary text-sm">Score</p>
          <p className="text-2xl font-bold text-neon-green">{gameState.score}</p>
        </motion.div>
        
        <motion.div
          className="glass-card px-6 py-3 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-text-secondary text-sm">Moves</p>
          <p className="text-2xl font-bold text-neon-blue">{gameState.moves}</p>
        </motion.div>

        <motion.div
          className="glass-card px-6 py-3 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-text-secondary text-sm">Pairs</p>
          <p className="text-2xl font-bold text-neon-purple">
            {gameState.matchedPairs}/{gameState.cards.length / 2}
          </p>
        </motion.div>

        <motion.div
          className="glass-card px-6 py-3 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-text-secondary text-sm">Accuracy</p>
          <p className="text-2xl font-bold text-neon-pink">{accuracy}%</p>
        </motion.div>
      </div>

      {/* Game Board */}
      <div className="relative">
        <div className="grid grid-cols-4 gap-3 p-4 glass-card rounded-xl max-w-md">
          {gameState.cards.map((card) => (
            <motion.div
              key={card.id}
              className={`
                relative w-20 h-20 cursor-pointer
                ${!canFlip && !card.isMatched ? 'cursor-not-allowed' : ''}
              `}
              onClick={() => handleCardClick(card.id)}
              whileHover={{ scale: canFlip ? 1.05 : 1 }}
              whileTap={{ scale: canFlip ? 0.95 : 1 }}
            >
              <motion.div
                className="relative w-full h-full"
                initial={false}
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Card Back */}
                <div
                  className="absolute inset-0 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)'
                  }}
                >
                  <span className="text-3xl">🎴</span>
                </div>

                {/* Card Front */}
                <div
                  className={`
                    absolute inset-0 rounded-lg flex items-center justify-center text-5xl
                    ${card.isMatched 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-600'
                    }
                  `}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  {card.emoji}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Game Over Overlay */}
        {gameState.gameOver && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center p-8">
              <h2 className="text-4xl font-bold text-neon-green mb-4">Victory! 🏆</h2>
              <p className="text-2xl mb-2">Score: {gameState.score}</p>
              <p className="text-lg text-text-secondary mb-2">Moves: {gameState.moves}</p>
              <p className="text-lg text-text-secondary mb-6">Accuracy: {accuracy}%</p>
              <motion.button
                onClick={restartGame}
                className="btn-primary"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Again
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center">
        <p className="text-text-secondary">
          Click cards to flip them and find matching pairs!
        </p>
        {!gameState.gameOver && (
          <motion.button
            onClick={restartGame}
            className="btn-secondary mt-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            New Game
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default MemoryMatchGame;
