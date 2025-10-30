import React from 'react';
import { Coin as CoinType, PlayerColor } from '../types';
import { TAILWIND_COLORS } from '../utils/constants';

interface CoinProps {
  coin: CoinType;
  playerColor: PlayerColor;
  isMoveable: boolean;
  isHighlighted: boolean;
  onClick: () => void;
}

const Coin: React.FC<CoinProps> = ({
  coin,
  playerColor,
  isMoveable,
  isHighlighted,
  onClick,
}) => {
  const colors = TAILWIND_COLORS[playerColor];

  return (
    <div
      className={`
        w-8 h-8 rounded-full border-2 shadow-md
        flex items-center justify-center
        transition-all duration-200
        ${colors.bg} ${colors.border}
        ${isMoveable ? `cursor-pointer hover:scale-125 ${colors.hover} animate-pulse` : ''}
        ${isHighlighted ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-110' : ''}
        ${!isMoveable ? 'opacity-70' : ''}
      `}
      onClick={isMoveable ? onClick : undefined}
      title={`${coin.id} - ${coin.position}`}
    >
      <div className="w-5 h-5 bg-white rounded-full opacity-90"></div>
    </div>
  );
};

export default Coin;
