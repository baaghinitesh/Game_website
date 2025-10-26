import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { GameComponentProps } from '../GamePluginRegistry';

interface Position {
  x: number;
  y: number;
}

interface SnakeState {
  snake: Position[];
  direction: string;
  food: Position;
  score: number;
  gameOver: boolean;
  gridSize: number;
  speed: number;
}

const SnakeGame = ({ onGameEnd }: GameComponentProps) => {
  const [gameState, setGameState] = useState<SnakeState>({
    gridSize: 20,
    snake: [{ x: 10, y: 10 }, { x: 10, y: 9 }, { x: 10, y: 8 }],
    direction: 'RIGHT',
    food: { x: 15, y: 15 },
    score: 0,
    gameOver: false,
    speed: 150
  });
  
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snakeHighScore') || '0');
  });
  
  const directionRef = useRef('RIGHT');
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random food
  const generateFood = useCallback((snake: Position[], gridSize: number): Position => {
    let food: Position;
    let valid = false;
    
    while (!valid) {
      food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
      valid = !snake.some(segment => segment.x === food.x && segment.y === food.y);
    }
    
    return food!;
  }, []);

  // Move snake
  const moveSnake = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameOver || isPaused) return prevState;

      const head = { ...prevState.snake[0] };
      const direction = directionRef.current;

      // Calculate new head position
      switch (direction) {
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
      if (head.x < 0 || head.x >= prevState.gridSize || head.y < 0 || head.y >= prevState.gridSize) {
        toast.error('Game Over! You hit the wall! 💥');
        if (prevState.score > highScore) {
          setHighScore(prevState.score);
          localStorage.setItem('snakeHighScore', prevState.score.toString());
          toast.success('New High Score! 🎉');
        }
        onGameEnd?.({ score: prevState.score, result: 'loss' });
        return { ...prevState, gameOver: true };
      }

      // Check self collision
      if (prevState.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        toast.error('Game Over! You hit yourself! 🐍');
        if (prevState.score > highScore) {
          setHighScore(prevState.score);
          localStorage.setItem('snakeHighScore', prevState.score.toString());
          toast.success('New High Score! 🎉');
        }
        onGameEnd?.({ score: prevState.score, result: 'loss' });
        return { ...prevState, gameOver: true };
      }

      const newSnake = [head, ...prevState.snake];

      // Check if food eaten
      if (head.x === prevState.food.x && head.y === prevState.food.y) {
        const newScore = prevState.score + 10;
        toast.success('+10 points! 🍎', { duration: 1000 });
        return {
          ...prevState,
          snake: newSnake,
          score: newScore,
          food: generateFood(newSnake, prevState.gridSize),
          speed: Math.max(50, prevState.speed - 2)
        };
      } else {
        newSnake.pop();
      }

      return {
        ...prevState,
        snake: newSnake
      };
    });
  }, [generateFood, highScore, isPaused, onGameEnd]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key;
      const currentDirection = directionRef.current;

      let newDirection = currentDirection;

      if ((key === 'ArrowUp' || key === 'w' || key === 'W') && currentDirection !== 'DOWN') {
        newDirection = 'UP';
      } else if ((key === 'ArrowDown' || key === 's' || key === 'S') && currentDirection !== 'UP') {
        newDirection = 'DOWN';
      } else if ((key === 'ArrowLeft' || key === 'a' || key === 'A') && currentDirection !== 'RIGHT') {
        newDirection = 'LEFT';
      } else if ((key === 'ArrowRight' || key === 'd' || key === 'D') && currentDirection !== 'LEFT') {
        newDirection = 'RIGHT';
      } else if (key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }

      directionRef.current = newDirection;
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameState.gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, gameState.speed);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.speed, gameState.gameOver, isPaused, moveSnake]);

  // Restart game
  const restartGame = () => {
    directionRef.current = 'RIGHT';
    setGameState({
      gridSize: 20,
      snake: [{ x: 10, y: 10 }, { x: 10, y: 9 }, { x: 10, y: 8 }],
      direction: 'RIGHT',
      food: generateFood([{ x: 10, y: 10 }], 20),
      score: 0,
      gameOver: false,
      speed: 150
    });
    setIsPaused(false);
  };

  const cellSize = 20;

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-4">
      {/* Score Board */}
      <div className="flex gap-8 mb-6">
        <motion.div
          className="glass-card px-6 py-3 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-text-secondary text-sm">Score</p>
          <p className="text-3xl font-bold text-neon-green">{gameState.score}</p>
        </motion.div>
        
        <motion.div
          className="glass-card px-6 py-3 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-text-secondary text-sm">High Score</p>
          <p className="text-3xl font-bold text-neon-purple">{highScore}</p>
        </motion.div>

        <motion.div
          className="glass-card px-6 py-3 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-text-secondary text-sm">Length</p>
          <p className="text-3xl font-bold text-neon-blue">{gameState.snake.length}</p>
        </motion.div>
      </div>

      {/* Game Board */}
      <div className="relative">
        <div
          className="relative glass-card p-2 rounded-lg"
          style={{
            width: gameState.gridSize * cellSize + 16,
            height: gameState.gridSize * cellSize + 16
          }}
        >
          {/* Grid Background */}
          <div
            className="relative bg-dark-surface rounded"
            style={{
              width: gameState.gridSize * cellSize,
              height: gameState.gridSize * cellSize
            }}
          >
            {/* Snake */}
            {gameState.snake.map((segment, index) => (
              <motion.div
                key={index}
                className={`absolute ${
                  index === 0 ? 'bg-neon-green shadow-neon-green' : 'bg-green-500'
                } rounded-sm`}
                style={{
                  left: segment.x * cellSize,
                  top: segment.y * cellSize,
                  width: cellSize - 2,
                  height: cellSize - 2
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.1 }}
              />
            ))}

            {/* Food */}
            <motion.div
              className="absolute bg-neon-pink shadow-neon-pink rounded-full"
              style={{
                left: gameState.food.x * cellSize,
                top: gameState.food.y * cellSize,
                width: cellSize - 2,
                height: cellSize - 2
              }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </div>

          {/* Game Over Overlay */}
          {gameState.gameOver && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <h2 className="text-4xl font-bold text-neon-pink mb-4">Game Over!</h2>
                <p className="text-2xl mb-2">Score: {gameState.score}</p>
                <p className="text-lg text-text-secondary mb-6">Length: {gameState.snake.length}</p>
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

          {/* Pause Overlay */}
          {isPaused && !gameState.gameOver && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <h2 className="text-4xl font-bold text-neon-blue mb-4">Paused</h2>
                <p className="text-text-secondary">Press SPACE to continue</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 text-center">
        <p className="text-text-secondary mb-2">Controls:</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <span className="glass px-3 py-1 rounded text-sm">Arrow Keys or WASD to move</span>
          <span className="glass px-3 py-1 rounded text-sm">SPACE to pause</span>
        </div>
        
        {!gameState.gameOver && (
          <motion.button
            onClick={() => setIsPaused(prev => !prev)}
            className="btn-secondary mt-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
