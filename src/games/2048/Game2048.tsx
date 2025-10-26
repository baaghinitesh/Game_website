import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { GameComponentProps } from '../GamePluginRegistry';

type Grid = number[][];

interface GameState {
  grid: Grid;
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
}

const Game2048 = ({ onGameEnd }: GameComponentProps) => {
  const createEmptyGrid = (): Grid => {
    return Array(4).fill(null).map(() => Array(4).fill(0));
  };

  const addRandomTile = (grid: Grid): Grid => {
    const newGrid = grid.map(row => [...row]);
    const emptyCells: { r: number; c: number }[] = [];
    
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (newGrid[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    return newGrid;
  };

  const initializeGame = (): GameState => {
    let grid = createEmptyGrid();
    grid = addRandomTile(grid);
    grid = addRandomTile(grid);

    const savedBest = localStorage.getItem('2048BestScore');
    
    return {
      grid,
      score: 0,
      bestScore: savedBest ? parseInt(savedBest) : 0,
      gameOver: false,
      won: false
    };
  };

  const [gameState, setGameState] = useState<GameState>(initializeGame());

  const moveLeft = (grid: Grid): { grid: Grid; moved: boolean; scoreGained: number } => {
    const newGrid = grid.map(row => [...row]);
    let moved = false;
    let scoreGained = 0;

    for (let r = 0; r < 4; r++) {
      let row = newGrid[r].filter(val => val !== 0);
      
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          scoreGained += row[i];
          row[i + 1] = 0;
        }
      }

      row = row.filter(val => val !== 0);
      while (row.length < 4) row.push(0);

      if (JSON.stringify(newGrid[r]) !== JSON.stringify(row)) moved = true;
      newGrid[r] = row;
    }

    return { grid: newGrid, moved, scoreGained };
  };

  const rotateRight = (grid: Grid): Grid => {
    const newGrid = createEmptyGrid();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        newGrid[c][3 - r] = grid[r][c];
      }
    }
    return newGrid;
  };

  const rotateLeft = (grid: Grid): Grid => {
    const newGrid = createEmptyGrid();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        newGrid[3 - c][r] = grid[r][c];
      }
    }
    return newGrid;
  };

  const move = (grid: Grid, direction: string): { grid: Grid; moved: boolean; scoreGained: number } => {
    let newGrid = grid.map(row => [...row]);
    let result;

    switch (direction) {
      case 'LEFT':
        result = moveLeft(newGrid);
        break;
      case 'RIGHT':
        newGrid = rotateRight(rotateRight(newGrid));
        result = moveLeft(newGrid);
        result.grid = rotateLeft(rotateLeft(result.grid));
        break;
      case 'UP':
        newGrid = rotateLeft(newGrid);
        result = moveLeft(newGrid);
        result.grid = rotateRight(result.grid);
        break;
      case 'DOWN':
        newGrid = rotateRight(newGrid);
        result = moveLeft(newGrid);
        result.grid = rotateLeft(result.grid);
        break;
      default:
        return { grid: newGrid, moved: false, scoreGained: 0 };
    }

    return result;
  };

  const canMove = (grid: Grid): boolean => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === 0) return true;
        const current = grid[r][c];
        if (c < 3 && current === grid[r][c + 1]) return true;
        if (r < 3 && current === grid[r + 1][c]) return true;
      }
    }
    return false;
  };

  const hasWon = (grid: Grid): boolean => {
    return grid.some(row => row.some(cell => cell >= 2048));
  };

  const handleMove = useCallback((direction: string) => {
    if (gameState.gameOver) return;

    const result = move(gameState.grid, direction);
    if (!result.moved) return;

    const newGrid = addRandomTile(result.grid);
    const newScore = gameState.score + result.scoreGained;
    const won = !gameState.won && hasWon(newGrid);
    const gameOver = !canMove(newGrid);

    if (won) {
      toast.success('You reached 2048! 🎉');
    }

    if (gameOver) {
      toast.error('Game Over! No more moves! 💀');
      onGameEnd?.({ score: newScore, result: 'loss' });
    }

    const newBestScore = Math.max(gameState.bestScore, newScore);
    if (newBestScore > gameState.bestScore) {
      localStorage.setItem('2048BestScore', newBestScore.toString());
    }

    setGameState({
      grid: newGrid,
      score: newScore,
      bestScore: newBestScore,
      won,
      gameOver
    });
  }, [gameState, onGameEnd]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
        
        if (e.key === 'ArrowUp' || e.key === 'w') handleMove('UP');
        else if (e.key === 'ArrowDown' || e.key === 's') handleMove('DOWN');
        else if (e.key === 'ArrowLeft' || e.key === 'a') handleMove('LEFT');
        else if (e.key === 'ArrowRight' || e.key === 'd') handleMove('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleMove]);

  const restartGame = () => {
    setGameState(initializeGame());
  };

  const getTileColor = (value: number): string => {
    const colors: { [key: number]: string } = {
      0: 'bg-gray-700/30',
      2: 'bg-gradient-to-br from-blue-400 to-blue-600',
      4: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
      8: 'bg-gradient-to-br from-purple-400 to-purple-600',
      16: 'bg-gradient-to-br from-pink-400 to-pink-600',
      32: 'bg-gradient-to-br from-red-400 to-red-600',
      64: 'bg-gradient-to-br from-orange-400 to-orange-600',
      128: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      256: 'bg-gradient-to-br from-green-400 to-green-600',
      512: 'bg-gradient-to-br from-teal-400 to-teal-600',
      1024: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
      2048: 'bg-gradient-to-br from-fuchsia-400 to-fuchsia-600',
    };
    return colors[value] || 'bg-gradient-to-br from-violet-400 to-violet-600';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-4">
      {/* Score Board */}
      <div className="flex gap-6 mb-6">
        <motion.div
          className="glass-card px-8 py-4 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-text-secondary text-sm mb-1">SCORE</p>
          <p className="text-3xl font-bold text-neon-blue">{gameState.score}</p>
        </motion.div>
        
        <motion.div
          className="glass-card px-8 py-4 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-text-secondary text-sm mb-1">BEST</p>
          <p className="text-3xl font-bold text-neon-purple">{gameState.bestScore}</p>
        </motion.div>
      </div>

      {/* Game Board */}
      <div className="relative">
        <div className="glass-card p-4 rounded-2xl bg-dark-surface/80 backdrop-blur-lg">
          <div className="grid grid-cols-4 gap-3">
            {gameState.grid.map((row, r) =>
              row.map((cell, c) => {
                const key = `${r}-${c}-${cell}`;
                return (
                  <div
                    key={`${r}-${c}`}
                    className="relative w-20 h-20 rounded-lg bg-gray-700/30"
                  >
                    <AnimatePresence>
                      {cell !== 0 && (
                        <motion.div
                          key={key}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`
                            absolute inset-0 rounded-lg flex items-center justify-center
                            font-bold text-white shadow-lg
                            ${getTileColor(cell)}
                            ${cell >= 128 ? 'text-2xl' : cell >= 1024 ? 'text-xl' : 'text-3xl'}
                          `}
                        >
                          {cell}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Game Over / Win Overlay */}
        {(gameState.gameOver || gameState.won) && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-2xl backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center p-8">
              <h2 className={`text-5xl font-bold mb-4 ${gameState.won ? 'text-neon-green' : 'text-neon-pink'}`}>
                {gameState.won ? 'You Win! 🏆' : 'Game Over!'}
              </h2>
              <p className="text-2xl mb-2">Final Score: {gameState.score}</p>
              <p className="text-lg text-text-secondary mb-6">Best: {gameState.bestScore}</p>
              <motion.button
                onClick={restartGame}
                className="btn-primary"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                New Game
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-6 text-center">
        <p className="text-text-secondary mb-3">Use arrow keys or WASD to move tiles</p>
        <div className="flex gap-3 justify-center mb-4">
          <motion.button
            onClick={() => handleMove('UP')}
            className="glass px-4 py-2 rounded hover:bg-neon-blue/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ↑
          </motion.button>
        </div>
        <div className="flex gap-3 justify-center mb-4">
          <motion.button
            onClick={() => handleMove('LEFT')}
            className="glass px-4 py-2 rounded hover:bg-neon-blue/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ←
          </motion.button>
          <motion.button
            onClick={() => handleMove('DOWN')}
            className="glass px-4 py-2 rounded hover:bg-neon-blue/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ↓
          </motion.button>
          <motion.button
            onClick={() => handleMove('RIGHT')}
            className="glass px-4 py-2 rounded hover:bg-neon-blue/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            →
          </motion.button>
        </div>
        
        {!gameState.gameOver && (
          <motion.button
            onClick={restartGame}
            className="btn-secondary"
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

export default Game2048;
