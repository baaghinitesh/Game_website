import React from 'react';
import { DiceState, PlayerColor } from '../types';
import { TAILWIND_COLORS } from '../utils/constants';

interface DiceProps {
  dice: DiceState;
  currentPlayer: PlayerColor | null;
  canRoll: boolean;
  onRoll: () => void;
}

const Dice: React.FC<DiceProps> = ({ dice, currentPlayer, canRoll, onRoll }) => {
  const playerColors = currentPlayer ? TAILWIND_COLORS[currentPlayer] : null;

  const renderDots = (value: number) => {
    const dots: React.ReactNode[] = [];
    
    // Dice dot patterns
    const patterns: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };

    const pattern = patterns[value] || [];

    for (let i = 0; i < 9; i++) {
      dots.push(
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${
            pattern.includes(i)
              ? playerColors
                ? playerColors.bg
                : 'bg-gray-800'
              : 'bg-transparent'
          }`}
        />
      );
    }

    return dots;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`
          w-20 h-20 bg-white border-4 rounded-lg shadow-lg
          flex items-center justify-center cursor-pointer
          transition-all duration-300
          ${dice.isRolling ? 'animate-bounce' : ''}
          ${canRoll ? 'hover:scale-110 hover:shadow-xl' : 'opacity-50 cursor-not-allowed'}
          ${playerColors ? `${playerColors.border}` : 'border-gray-400'}
        `}
        onClick={canRoll ? onRoll : undefined}
      >
        {dice.value > 0 ? (
          <div className="grid grid-cols-3 gap-1 p-2">
            {renderDots(dice.value)}
          </div>
        ) : (
          <div className="text-2xl font-bold text-gray-400">?</div>
        )}
      </div>
      
      {canRoll && !dice.isRolling && (
        <div className="text-sm font-semibold text-gray-600 animate-pulse">
          Click to Roll!
        </div>
      )}
      
      {dice.isRolling && (
        <div className="text-sm font-semibold text-gray-600">
          Rolling...
        </div>
      )}
    </div>
  );
};

export default Dice;
