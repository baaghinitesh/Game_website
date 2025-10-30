import React from 'react';
import { PlayerState, PlayerColor } from '../types';
import { TAILWIND_COLORS, COLOR_NAMES } from '../utils/constants';

interface GameStatusProps {
  players: PlayerState[];
  currentPlayer: PlayerColor | null;
  winner: PlayerColor | null;
  diceValue: number;
}

const GameStatus: React.FC<GameStatusProps> = ({
  players,
  currentPlayer,
  winner,
  diceValue,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Game Status
      </h2>

      {/* Winner announcement */}
      {winner && (
        <div
          className={`
            ${TAILWIND_COLORS[winner].bg} text-white
            py-3 px-4 rounded-lg text-center
            animate-bounce font-bold text-lg
          `}
        >
          🎉 {COLOR_NAMES[winner]} Wins! 🎉
        </div>
      )}

      {/* Current turn */}
      {!winner && currentPlayer && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Current Turn:</p>
          <div
            className={`
              inline-block px-6 py-2 rounded-full font-bold text-white
              ${TAILWIND_COLORS[currentPlayer].bg}
            `}
          >
            {COLOR_NAMES[currentPlayer]}
          </div>
        </div>
      )}

      {/* Dice value */}
      {diceValue > 0 && !winner && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Last Roll:</p>
          <div className="text-4xl font-bold text-gray-800">{diceValue}</div>
        </div>
      )}

      {/* Player scores */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-600 text-center">
          Players Progress:
        </p>
        {players.map((player) => {
          const coinsHome = player.coins.filter((c) => c.position === 'home').length;
          const coinsWon = player.coins.filter((c) => c.position === 'won').length;
          const coinsPlaying = 4 - coinsHome - coinsWon;
          const colors = TAILWIND_COLORS[player.color];

          return (
            <div
              key={player.color}
              className={`
                flex items-center justify-between p-3 rounded-lg
                ${colors.bg} bg-opacity-10 border-2 ${colors.border}
                ${player.hasWon ? 'opacity-50' : ''}
              `}
            >
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${colors.bg}`}></div>
                <span className="font-semibold text-gray-700">
                  {COLOR_NAMES[player.color]}
                </span>
                {player.hasWon && (
                  <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full font-bold">
                    WON
                  </span>
                )}
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-gray-600">
                  Home: <span className="font-bold">{coinsHome}</span>
                </span>
                <span className="text-gray-600">
                  Playing: <span className="font-bold">{coinsPlaying}</span>
                </span>
                <span className="text-green-600">
                  Won: <span className="font-bold">{coinsWon}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      {!winner && (
        <div className="text-xs text-gray-500 text-center pt-4 border-t">
          <p>🎲 Roll 6 to start a coin</p>
          <p>⭐ Safe zones protect your coins</p>
          <p>💫 Get all coins home to win!</p>
        </div>
      )}
    </div>
  );
};

export default GameStatus;
