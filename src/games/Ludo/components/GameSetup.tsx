import React, { useState } from 'react';
import { PlayerColor } from '../types';
import { PLAYER_COLORS, COLOR_NAMES, TAILWIND_COLORS } from '../utils/constants';

interface GameSetupProps {
  onStartGame: (selectedPlayers: PlayerColor[]) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame }) => {
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerColor[]>(['red', 'blue']);

  const togglePlayer = (color: PlayerColor) => {
    if (selectedPlayers.includes(color)) {
      // Must have at least 2 players
      if (selectedPlayers.length > 2) {
        setSelectedPlayers(selectedPlayers.filter((p) => p !== color));
      }
    } else {
      // Maximum 4 players
      if (selectedPlayers.length < 4) {
        setSelectedPlayers([...selectedPlayers, color]);
      }
    }
  };

  const handleStart = () => {
    if (selectedPlayers.length >= 2) {
      onStartGame(selectedPlayers);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">🎲 Ludo</h1>
          <p className="text-gray-600">Select players to start the game</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {PLAYER_COLORS.map((color) => {
            const isSelected = selectedPlayers.includes(color);
            const colors = TAILWIND_COLORS[color];

            return (
              <button
                key={color}
                onClick={() => togglePlayer(color)}
                className={`
                  py-6 px-4 rounded-xl font-bold text-lg
                  transition-all duration-200
                  border-4
                  ${isSelected ? `${colors.bg} ${colors.border} text-white scale-105 shadow-lg` : `bg-white ${colors.border} ${colors.text} hover:scale-105`}
                `}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-6 h-6 rounded-full ${colors.bg}`}></div>
                  <span>{COLOR_NAMES[color]}</span>
                  {isSelected && <span>✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center text-sm text-gray-600 mb-6">
          <p>Selected: {selectedPlayers.length} player(s)</p>
          <p className="text-xs mt-1">(Minimum 2, Maximum 4)</p>
        </div>

        <button
          onClick={handleStart}
          disabled={selectedPlayers.length < 2}
          className={`
            w-full py-4 rounded-xl font-bold text-xl
            transition-all duration-200
            ${
              selectedPlayers.length >= 2
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:scale-105 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {selectedPlayers.length >= 2 ? 'Start Game 🚀' : 'Select at least 2 players'}
        </button>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
          <h3 className="font-bold mb-2">📋 Game Rules:</h3>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Roll the dice to move your coins</li>
            <li>Roll a 6 to bring a coin out of home</li>
            <li>Land on opponent coins to send them home</li>
            <li>Safe zones (⭐) protect your coins</li>
            <li>Get all 4 coins to the center to win!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
