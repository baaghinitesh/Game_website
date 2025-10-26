import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameComponentProps } from '@core/types';
import socketService from '@shared/services/socket';
import { useAuthStore } from '@store/authStore';
import toast from 'react-hot-toast';

interface GameState {
  board: (string | null)[];
  currentPlayer: string;
  winner: string | null;
  isDraw: boolean;
  moveCount: number;
}

const TicTacToeGame = ({ roomId, isMultiplayer = false, onGameEnd }: GameComponentProps) => {
  const { user } = useAuthStore();
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    isDraw: false,
    moveCount: 0,
  });
  const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O'>('X');
  const [isMyTurn, setIsMyTurn] = useState(true);

  useEffect(() => {
    if (isMultiplayer && roomId) {
      // Join room
      socketService.emit('game:join-room', {
        roomId,
        userId: user?.id,
        username: user?.username,
      });

      // Listen for game state updates
      socketService.on('game:state', (data) => {
        setGameState(data.gameState);
        // Determine player symbol based on join order
        const playerIndex = data.players.findIndex((p: any) => p.userId === user?.id);
        setPlayerSymbol(playerIndex === 0 ? 'X' : 'O');
        setIsMyTurn(data.gameState.currentPlayer === (playerIndex === 0 ? 'X' : 'O'));
      });

      socketService.on('game:state-update', (data) => {
        setGameState(data.gameState);
        setIsMyTurn(data.gameState.currentPlayer === playerSymbol);
      });

      socketService.on('game:ended', (data) => {
        if (data.winner) {
          toast.success(data.winner === playerSymbol ? 'You won! 🎉' : 'You lost!');
        } else if (data.isDraw) {
          toast('It\'s a draw!');
        }
        
        if (onGameEnd) {
          onGameEnd({
            winner: data.winner,
            isDraw: data.isDraw,
          });
        }
      });

      socketService.on('game:invalid-move', (data) => {
        toast.error(data.error);
      });

      return () => {
        socketService.off('game:state');
        socketService.off('game:state-update');
        socketService.off('game:ended');
        socketService.off('game:invalid-move');
        
        socketService.emit('game:leave-room', {
          roomId,
          userId: user?.id,
          username: user?.username,
        });
      };
    }
  }, [roomId, isMultiplayer, user, playerSymbol, onGameEnd]);

  const handleCellClick = (position: number) => {
    if (gameState.board[position] !== null || gameState.winner || gameState.isDraw) {
      return;
    }

    if (isMultiplayer) {
      if (!isMyTurn) {
        toast.error('Not your turn!');
        return;
      }

      // Send move to server
      socketService.emit('game:move', {
        roomId,
        move: { position, player: playerSymbol },
        userId: user?.id,
      });
    } else {
      // Local single-player game
      const newBoard = [...gameState.board];
      newBoard[position] = gameState.currentPlayer;
      
      const winner = calculateWinner(newBoard);
      const isDraw = !winner && newBoard.every(cell => cell !== null);
      
      setGameState({
        board: newBoard,
        currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
        winner,
        isDraw,
        moveCount: gameState.moveCount + 1,
      });

      if (winner || isDraw) {
        setTimeout(() => {
          if (winner) {
            toast.success(`${winner} wins! 🎉`);
          } else {
            toast('It\'s a draw!');
          }
          
          if (onGameEnd) {
            onGameEnd({ winner, isDraw });
          }
        }, 500);
      }
    }
  };

  const calculateWinner = (board: (string | null)[]): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  };

  const resetGame = () => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      isDraw: false,
      moveCount: 0,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-lg w-full"
      >
        {/* Game Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-glow-blue mb-2">Tic Tac Toe</h2>
          
          {isMultiplayer ? (
            <div className="space-y-2">
              <p className="text-text-secondary">
                You are: <span className="text-neon-blue font-bold">{playerSymbol}</span>
              </p>
              <p className="text-text-secondary">
                {isMyTurn ? (
                  <span className="text-neon-green">Your turn!</span>
                ) : (
                  <span className="text-text-secondary">Waiting for opponent...</span>
                )}
              </p>
            </div>
          ) : (
            <p className="text-text-secondary">
              Current Player: <span className="text-neon-blue font-bold">{gameState.currentPlayer}</span>
            </p>
          )}
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {gameState.board.map((cell, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: cell === null && !gameState.winner ? 1.05 : 1 }}
              whileTap={{ scale: cell === null && !gameState.winner ? 0.95 : 1 }}
              onClick={() => handleCellClick(index)}
              className={`
                aspect-square h-24 rounded-xl text-4xl font-bold
                transition-all duration-300
                ${cell === null && !gameState.winner
                  ? 'glass hover:border-neon-blue cursor-pointer'
                  : 'glass cursor-not-allowed'
                }
                ${cell === 'X' ? 'text-neon-blue' : 'text-neon-pink'}
              `}
              disabled={cell !== null || !!gameState.winner || gameState.isDraw}
            >
              {cell}
            </motion.button>
          ))}
        </div>

        {/* Game Status */}
        {(gameState.winner || gameState.isDraw) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            {gameState.winner ? (
              <p className="text-2xl font-bold text-neon-green">
                {gameState.winner} Wins! 🎉
              </p>
            ) : (
              <p className="text-2xl font-bold text-text-primary">
                It's a Draw! 🤝
              </p>
            )}
          </motion.div>
        )}

        {/* Actions */}
        {!isMultiplayer && (gameState.winner || gameState.isDraw) && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="btn-primary w-full"
          >
            Play Again
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default TicTacToeGame;
