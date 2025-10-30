import React from 'react';
import { Coin as CoinType, PlayerColor } from '../types';
import { TAILWIND_COLORS } from '../utils/constants';
import Coin from './Coin';

interface HomeBoxProps {
  playerColor: PlayerColor;
  coins: CoinType[];
  isCurrentPlayer: boolean;
  onCoinClick: (coinId: string) => void;
}

const HomeBox: React.FC<HomeBoxProps> = ({
  playerColor,
  coins,
  isCurrentPlayer,
  onCoinClick,
}) => {
  const colors = TAILWIND_COLORS[playerColor];
  const homeCoins = coins.filter((c) => c.position === 'home');

  return (
    <div
      className={`
        w-40 h-40 ${colors.bg} bg-opacity-20
        border-4 ${colors.border}
        rounded-lg flex items-center justify-center
        ${isCurrentPlayer ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''}
      `}
    >
      <div className="grid grid-cols-2 gap-3">
        {homeCoins.map((coin) => (
          <div key={coin.id} className="flex items-center justify-center">
            <Coin
              coin={coin}
              playerColor={playerColor}
              isMoveable={coin.isTurnAvailable && isCurrentPlayer}
              isHighlighted={false}
              onClick={() => onCoinClick(coin.id)}
            />
          </div>
        ))}
        {/* Placeholder for empty slots */}
        {Array.from({ length: 4 - homeCoins.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className={`w-8 h-8 rounded-full border-2 border-dashed ${colors.border} opacity-30`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HomeBox;
