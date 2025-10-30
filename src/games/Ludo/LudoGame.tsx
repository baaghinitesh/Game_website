import React, { useState, useEffect } from 'react';
import { GameState, PlayerState, PlayerColor, Coin as CoinType } from './types';
import { 
  initializePlayerCoins, 
  calculateNextPosition, 
  getMoveableCoins,
  getKilledCoins,
  updateBlockState,
  shouldGetAnotherTurn,
  getNextPlayer,
  hasPlayerWon,
  isGameOver,
} from './utils/gameLogic';
import { DICE_MIN, DICE_MAX, ANIMATION_DURATION } from './utils/constants';
import GameSetup from './components/GameSetup';
import Board from './components/Board';
import Dice from './components/Dice';
import GameStatus from './components/GameStatus';

const LudoGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    roomId: '',
    players: [],
    currentPlayer: null,
    dice: {
      value: 0,
      isRolling: false,
      isLocked: false,
      lastRolledBy: null,
    },
    blocks: {},
    winner: null,
    isStarted: false,
    isFinished: false,
  });

  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

  // Initialize game with selected players
  const handleStartGame = (selectedPlayers: PlayerColor[]) => {
    const players: PlayerState[] = selectedPlayers.map((color) => ({
      color,
      coins: initializePlayerCoins(color),
      isActive: true,
      hasWon: false,
    }));

    setGameState({
      roomId: `local-${Date.now()}`,
      players,
      currentPlayer: selectedPlayers[0],
      dice: {
        value: 0,
        isRolling: false,
        isLocked: false,
        lastRolledBy: null,
      },
      blocks: {},
      winner: null,
      isStarted: true,
      isFinished: false,
    });
  };

  // Roll dice
  const handleRollDice = () => {
    if (gameState.dice.isRolling || gameState.dice.isLocked) {
      return;
    }

    setGameState((prev) => ({
      ...prev,
      dice: {
        ...prev.dice,
        isRolling: true,
        lastRolledBy: prev.currentPlayer,
      },
    }));

    setTimeout(() => {
      const diceValue = Math.floor(Math.random() * DICE_MAX) + DICE_MIN;

      setGameState((prev) => {
        const currentPlayerState = prev.players.find(
          (p) => p.color === prev.currentPlayer
        );

        if (!currentPlayerState) return prev;

        // Check which coins can move
        const moveableCoins = getMoveableCoins(currentPlayerState, diceValue);

        // Update coins' isTurnAvailable status
        const updatedPlayers = prev.players.map((player) => {
          if (player.color === prev.currentPlayer) {
            return {
              ...player,
              coins: player.coins.map((coin) => ({
                ...coin,
                isTurnAvailable: moveableCoins.some((mc) => mc.id === coin.id),
              })),
            };
          }
          return player;
        });

        // If no moveable coins, auto-switch player
        const shouldSwitchPlayer = moveableCoins.length === 0;

        return {
          ...prev,
          dice: {
            value: diceValue,
            isRolling: false,
            isLocked: shouldSwitchPlayer ? false : true,
            lastRolledBy: prev.currentPlayer,
          },
          players: updatedPlayers,
          currentPlayer: shouldSwitchPlayer
            ? getNextPlayer(updatedPlayers, prev.currentPlayer!)
            : prev.currentPlayer,
        };
      });
    }, ANIMATION_DURATION);
  };

  // Move coin
  const handleCoinClick = (coinId: string) => {
    if (!gameState.dice.isLocked || gameState.dice.value === 0) {
      return;
    }

    const currentPlayerState = gameState.players.find(
      (p) => p.color === gameState.currentPlayer
    );

    if (!currentPlayerState) return;

    const coin = currentPlayerState.coins.find((c) => c.id === coinId);

    if (!coin || !coin.isTurnAvailable) {
      return;
    }

    // Calculate next position
    const nextPosition = calculateNextPosition(
      coin,
      currentPlayerState.color,
      gameState.dice.value
    );

    if (!nextPosition) return;

    // Check for killed coins
    const killedCoins = getKilledCoins(
      nextPosition,
      currentPlayerState.color,
      gameState.blocks
    );

    // Update game state
    setGameState((prev) => {
      // Update coin position
      const updatedPlayers = prev.players.map((player) => {
        if (player.color === prev.currentPlayer) {
          const updatedCoins = player.coins.map((c) => {
            if (c.id === coinId) {
              return {
                ...c,
                position: nextPosition.includes('-won') ? 'won' : nextPosition,
                isTurnAvailable: false,
              };
            }
            return { ...c, isTurnAvailable: false };
          });

          // Check if player won
          const playerHasWon = updatedCoins.every((c) => c.position === 'won');

          return {
            ...player,
            coins: updatedCoins,
            hasWon: playerHasWon,
          };
        }

        // Reset killed coins
        if (killedCoins.some((kc) => kc[0] === player.color[0])) {
          return {
            ...player,
            coins: player.coins.map((c) =>
              killedCoins.includes(c.id) ? { ...c, position: 'home', isTurnAvailable: false } : c
            ),
          };
        }

        return player;
      });

      // Update blocks
      const newBlocks = updateBlockState(
        prev.blocks,
        coinId,
        coin.position,
        nextPosition,
        killedCoins
      );

      // Determine if player gets another turn
      const getAnotherTurn = shouldGetAnotherTurn(
        prev.dice.value,
        killedCoins,
        nextPosition
      );

      // Check for winner
      const winnerPlayer = updatedPlayers.find((p) => p.hasWon);
      const gameIsOver = isGameOver(updatedPlayers);

      return {
        ...prev,
        players: updatedPlayers,
        blocks: newBlocks,
        dice: {
          ...prev.dice,
          value: getAnotherTurn ? prev.dice.value : 0,
          isLocked: false,
        },
        currentPlayer: getAnotherTurn
          ? prev.currentPlayer
          : getNextPlayer(updatedPlayers, prev.currentPlayer!),
        winner: gameIsOver && winnerPlayer ? winnerPlayer.color : null,
        isFinished: gameIsOver,
      };
    });

    setSelectedCoin(null);
  };

  // Restart game
  const handleRestartGame = () => {
    setGameState({
      roomId: '',
      players: [],
      currentPlayer: null,
      dice: {
        value: 0,
        isRolling: false,
        isLocked: false,
        lastRolledBy: null,
      },
      blocks: {},
      winner: null,
      isStarted: false,
      isFinished: false,
    });
  };

  // Show setup screen if game not started
  if (!gameState.isStarted) {
    return <GameSetup onStartGame={handleStartGame} />;
  }

  // Main game UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">🎲 Ludo Game 🎲</h1>
          <button
            onClick={handleRestartGame}
            className="px-6 py-2 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-all"
          >
            New Game
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Board - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 flex flex-col items-center gap-6">
            <Board
              players={gameState.players}
              blocks={gameState.blocks}
              currentPlayer={gameState.currentPlayer}
              onCoinClick={handleCoinClick}
            />

            {/* Dice */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Dice
                dice={gameState.dice}
                currentPlayer={gameState.currentPlayer}
                canRoll={
                  !gameState.dice.isRolling &&
                  !gameState.dice.isLocked &&
                  !gameState.isFinished
                }
                onRoll={handleRollDice}
              />
            </div>
          </div>

          {/* Game Status - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <GameStatus
              players={gameState.players}
              currentPlayer={gameState.currentPlayer}
              winner={gameState.winner}
              diceValue={gameState.dice.value}
            />
          </div>
        </div>

        {/* Winner Modal */}
        {gameState.winner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Game Over!
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                <span className="font-bold capitalize">{gameState.winner}</span> wins! 🎉
              </p>
              <button
                onClick={handleRestartGame}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:scale-105 transition-all"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LudoGame;
