import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { GameComponentProps } from '../GamePluginRegistry';

interface Bird {
  y: number;
  velocity: number;
}

interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
}

interface GameState {
  bird: Bird;
  pipes: Pipe[];
  score: number;
  gameOver: boolean;
  gameStarted: boolean;
}

const FlappyGame = ({ onGameEnd }: GameComponentProps) => {
  const [gameState, setGameState] = useState<GameState>({
    bird: { y: 250, velocity: 0 },
    pipes: [
      { x: 400, gapY: 200, passed: false },
      { x: 700, gapY: 300, passed: false }
    ],
    score: 0,
    gameOver: false,
    gameStarted: false
  });

  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('flappyHighScore') || '0');
  });

  const gameLoopRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const GRAVITY = 0.6;
  const JUMP_FORCE = -10;
  const PIPE_SPEED = 3;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 150;
  const BIRD_SIZE = 34;

  const jump = useCallback(() => {
    if (gameState.gameOver) return;

    setGameState(prev => {
      if (!prev.gameStarted) {
        return { ...prev, gameStarted: true, bird: { ...prev.bird, velocity: JUMP_FORCE } };
      }
      return { ...prev, bird: { ...prev.bird, velocity: JUMP_FORCE } };
    });
  }, [gameState.gameOver]);

  const gameLoop = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || !prev.gameStarted) return prev;

      // Update bird physics
      const newVelocity = prev.bird.velocity + GRAVITY;
      const newY = prev.bird.y + newVelocity;

      // Check ground/ceiling collision
      if (newY < 0 || newY > 500 - BIRD_SIZE) {
        toast.error(`Game Over! Score: ${prev.score} 💀`);
        if (prev.score > highScore) {
          setHighScore(prev.score);
          localStorage.setItem('flappyHighScore', prev.score.toString());
          toast.success('New High Score! 🎉');
        }
        onGameEnd?.({ score: prev.score, result: 'loss' });
        return { ...prev, gameOver: true };
      }

      // Move pipes
      let newPipes = prev.pipes.map(pipe => ({
        ...pipe,
        x: pipe.x - PIPE_SPEED
      }));

      // Add new pipe
      const lastPipe = newPipes[newPipes.length - 1];
      if (lastPipe.x < 200) {
        const gapY = 100 + Math.random() * 250;
        newPipes.push({ x: 700, gapY, passed: false });
      }

      // Remove off-screen pipes
      newPipes = newPipes.filter(pipe => pipe.x > -PIPE_WIDTH);

      // Check collisions and score
      const birdLeft = 100;
      const birdRight = 100 + BIRD_SIZE;
      const birdTop = newY;
      const birdBottom = newY + BIRD_SIZE;

      let newScore = prev.score;

      for (const pipe of newPipes) {
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + PIPE_WIDTH;
        const topPipeBottom = pipe.gapY;
        const bottomPipeTop = pipe.gapY + PIPE_GAP;

        // Collision detection
        if (birdRight > pipeLeft && birdLeft < pipeRight) {
          if (birdTop < topPipeBottom || birdBottom > bottomPipeTop) {
            toast.error(`Game Over! Score: ${newScore} 💥`);
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('flappyHighScore', newScore.toString());
              toast.success('New High Score! 🎉');
            }
            onGameEnd?.({ score: newScore, result: 'loss' });
            return { ...prev, gameOver: true, score: newScore };
          }
        }

        // Score when passing pipe
        if (!pipe.passed && birdLeft > pipeRight) {
          pipe.passed = true;
          newScore++;
          toast.success('+1', { duration: 500, icon: '⭐' });
        }
      }

      return {
        ...prev,
        bird: { y: newY, velocity: newVelocity },
        pipes: newPipes,
        score: newScore
      };
    });
  }, [highScore, onGameEnd]);

  useEffect(() => {
    const handleClick = () => jump();
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [jump]);

  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameOver) {
      gameLoopRef.current = window.requestAnimationFrame(function animate() {
        gameLoop();
        gameLoopRef.current = window.requestAnimationFrame(animate);
      });
    }

    return () => {
      if (gameLoopRef.current) {
        window.cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.gameStarted, gameState.gameOver, gameLoop]);

  const restartGame = () => {
    setGameState({
      bird: { y: 250, velocity: 0 },
      pipes: [
        { x: 400, gapY: 200, passed: false },
        { x: 700, gapY: 300, passed: false }
      ],
      score: 0,
      gameOver: false,
      gameStarted: false
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-4">
      {/* Score Display */}
      <div className="flex gap-6 mb-4">
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
          <p className="text-text-secondary text-sm">Best</p>
          <p className="text-3xl font-bold text-neon-purple">{highScore}</p>
        </motion.div>
      </div>

      {/* Game Canvas */}
      <div className="relative">
        <div
          ref={canvasRef}
          className="relative glass-card rounded-lg overflow-hidden"
          style={{ width: 600, height: 500 }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900 via-sky-800 to-sky-700">
            {/* Clouds */}
            <div className="absolute top-10 left-20 text-4xl opacity-30">☁️</div>
            <div className="absolute top-20 right-40 text-3xl opacity-20">☁️</div>
            <div className="absolute top-40 left-60 text-5xl opacity-25">☁️</div>
          </div>

          {/* Bird */}
          <motion.div
            className="absolute text-4xl"
            style={{
              left: 100,
              top: gameState.bird.y,
              rotate: Math.max(-30, Math.min(30, gameState.bird.velocity * 3))
            }}
            animate={{
              rotate: Math.max(-30, Math.min(30, gameState.bird.velocity * 3))
            }}
            transition={{ duration: 0.1 }}
          >
            🐦
          </motion.div>

          {/* Pipes */}
          <AnimatePresence>
            {gameState.pipes.map((pipe, index) => (
              <div key={index} className="absolute" style={{ left: pipe.x }}>
                {/* Top Pipe */}
                <div
                  className="absolute bg-gradient-to-b from-green-600 to-green-700 border-2 border-green-800 rounded-b-lg"
                  style={{
                    width: PIPE_WIDTH,
                    height: pipe.gapY,
                    top: 0
                  }}
                />
                
                {/* Bottom Pipe */}
                <div
                  className="absolute bg-gradient-to-t from-green-600 to-green-700 border-2 border-green-800 rounded-t-lg"
                  style={{
                    width: PIPE_WIDTH,
                    height: 500 - pipe.gapY - PIPE_GAP,
                    bottom: 0
                  }}
                />
              </div>
            ))}
          </AnimatePresence>

          {/* Start Screen */}
          {!gameState.gameStarted && !gameState.gameOver && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <h2 className="text-5xl font-bold text-white mb-4">Flappy Jump</h2>
                <p className="text-xl text-white/80 mb-4">Click or press SPACE to start</p>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-6xl"
                >
                  👆
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Game Over Screen */}
          {gameState.gameOver && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <h2 className="text-5xl font-bold text-neon-pink mb-4">Game Over!</h2>
                <p className="text-3xl mb-2">Score: {gameState.score}</p>
                <p className="text-xl text-text-secondary mb-6">Best: {highScore}</p>
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
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-text-secondary">
          Click or press SPACE to jump • Avoid the pipes!
        </p>
      </div>
    </div>
  );
};

export default FlappyGame;
