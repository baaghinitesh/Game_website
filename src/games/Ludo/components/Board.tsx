import React from 'react';
import { PlayerState, BlockState, PlayerColor } from '../types';
import { SAFE_POSITIONS, START_POSITIONS } from '../utils/constants';
import Coin from './Coin';

interface BoardProps {
  players: PlayerState[];
  blocks: BlockState;
  currentPlayer: PlayerColor | null;
  onCoinClick: (coinId: string) => void;
}

const Board: React.FC<BoardProps> = ({
  players,
  blocks,
  currentPlayer,
  onCoinClick,
}) => {
  const getPlayer = (color: PlayerColor) => players.find((p) => p.color === color);

  const colorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
  };

  // Render coins at a position
  const renderCoins = (position: string | number) => {
    const posKey = String(position);
    const coinsAtPosition = blocks[posKey] || [];
    if (coinsAtPosition.length === 0) return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {coinsAtPosition.length === 1 ? (
          <Coin
            coin={players.flatMap((p) => p.coins).find((c) => c.id === coinsAtPosition[0])!}
            playerColor={players.find((p) => p.coins.some((c) => c.id === coinsAtPosition[0]))!.color}
            isMoveable={false}
            isHighlighted={false}
            onClick={() => onCoinClick(coinsAtPosition[0])}
          />
        ) : (
          <div className="flex flex-wrap gap-0.5">
            {coinsAtPosition.slice(0, 4).map((coinId) => {
              const coin = players.flatMap((p) => p.coins).find((c) => c.id === coinId);
              const player = players.find((p) => p.coins.some((c) => c.id === coinId));
              if (!coin || !player) return null;
              return (
                <div key={coinId} className="w-3 h-3">
                  <Coin coin={coin} playerColor={player.color} isMoveable={false} isHighlighted={false} onClick={() => onCoinClick(coinId)} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Render a track square
  const renderSquare = (position: number | string, bgColor?: string) => {
    const isSafe = typeof position === 'number' && SAFE_POSITIONS.includes(position);
    const isStart = typeof position === 'number' && Object.values(START_POSITIONS).includes(position);
    const isHome = typeof position === 'string' && position.includes('home');
    
    let colorClass = 'bg-white';
    if (bgColor) {
      colorClass = bgColor;
    } else if (isHome) {
      const color = position.toString().split('-')[0] as 'r' | 'g' | 'y' | 'b';
      const colorMap = { r: 'red', g: 'green', y: 'yellow', b: 'blue' };
      colorClass = `${colorClasses[colorMap[color]]} bg-opacity-30`;
    }

    return (
      <div
        key={String(position)}
        className={`relative w-8 h-8 border border-gray-500 flex items-center justify-center text-xs ${colorClass}`}
        title={String(position)}
      >
        {isSafe && !isStart && <span className="absolute top-0.5 text-yellow-400">⭐</span>}
        {isStart && <span className="absolute text-2xl opacity-30">▶</span>}
        {renderCoins(position)}
      </div>
    );
  };

  // Render home base
  const renderHomeBase = (color: PlayerColor) => {
    const player = getPlayer(color);
    if (!player) return null;

    const homeCoins = player.coins.filter((c) => c.position === 'home');

    return (
      <div className={`w-full h-full ${colorClasses[color]} bg-opacity-20 border-4 ${colorClasses[color].replace('bg-', 'border-')} border-opacity-70 rounded-xl p-4 flex items-center justify-center`}>
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((idx) => {
            const coin = homeCoins[idx];
            return (
              <div
                key={idx}
                className={`w-11 h-11 rounded-full border-4 border-gray-800 ${colorClasses[color]} flex items-center justify-center shadow-lg`}
              >
                {coin && (
                  <Coin
                    coin={coin}
                    playerColor={color}
                    isMoveable={currentPlayer === color}
                    isHighlighted={currentPlayer === color}
                    onClick={() => onCoinClick(coin.id)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * TRADITIONAL LUDO BOARD - 15×15 Grid
   * 
   * Layout (viewing from reference images):
   * - Rows 0-5, Cols 0-5: RED home base
   * - Rows 0-5, Cols 9-14: YELLOW home base  
   * - Rows 9-14, Cols 0-5: GREEN home base
   * - Rows 9-14, Cols 9-14: BLUE home base
   * 
   * Track positions (52 total, numbered 0-51 clockwise):
   * - Position 0: RED start (row 7, col 0) - colored square
   * - Position 13: GREEN start (row 0, col 7) - colored square
   * - Position 26: YELLOW start (row 7, col 14) - colored square
   * - Position 39: BLUE start (row 14, col 7) - colored square
   */

  // Build the 15×15 grid
  const grid: React.ReactNode[] = [];

  // Map track positions to grid coordinates
  // Going clockwise starting from RED's starting position
  const trackPositions: Record<number, [number, number]> = {
    // Left side (going up): positions 0-12
    0: [7, 0],   // RED START
    1: [7, 1],
    2: [7, 2],
    3: [7, 3],
    4: [7, 4],
    5: [7, 5],
    6: [6, 5],
    7: [5, 5],
    8: [4, 5],   // STAR (safe)
    9: [3, 5],
    10: [2, 5],
    11: [1, 5],
    12: [0, 5],

    // Top side (going right): positions 13-25
    13: [0, 7],  // GREEN START
    14: [0, 8],
    15: [1, 8],
    16: [2, 8],
    17: [3, 8],
    18: [4, 8],
    19: [5, 8],
    20: [6, 8],
    21: [6, 9],  // STAR (safe)
    22: [6, 10],
    23: [6, 11],
    24: [6, 12],
    25: [6, 13],

    // Right side (going down): positions 26-38
    26: [7, 14], // YELLOW START
    27: [7, 13],
    28: [7, 12],
    29: [7, 11],
    30: [7, 10],
    31: [7, 9],
    32: [8, 9],
    33: [9, 9],
    34: [10, 9], // STAR (safe)
    35: [11, 9],
    36: [12, 9],
    37: [13, 9],
    38: [14, 9],

    // Bottom side (going left): positions 39-51
    39: [14, 7], // BLUE START
    40: [14, 6],
    41: [13, 6],
    42: [12, 6],
    43: [11, 6],
    44: [10, 6],
    45: [9, 6],
    46: [8, 6],
    47: [8, 5],  // STAR (safe)
    48: [8, 4],
    49: [8, 3],
    50: [8, 2],
    51: [8, 1],
  };

  // Home column positions
  const homeColumns: Record<string, [number, number]> = {
    // Red home column (going right from left side)
    'r-home-1': [7, 6],
    'r-home-2': [7, 7],
    'r-home-3': [7, 8],
    'r-home-4': [7, 9],
    'r-home-5': [7, 10],
    'r-home-6': [7, 11],

    // Green home column (going down from top)
    'g-home-1': [1, 7],
    'g-home-2': [2, 7],
    'g-home-3': [3, 7],
    'g-home-4': [4, 7],
    'g-home-5': [5, 7],
    'g-home-6': [6, 7],

    // Yellow home column (going left from right side)
    'y-home-1': [7, 13],
    'y-home-2': [7, 12],
    'y-home-3': [7, 11],
    'y-home-4': [7, 10],
    'y-home-5': [7, 9],
    'y-home-6': [7, 8],

    // Blue home column (going up from bottom)
    'b-home-1': [13, 7],
    'b-home-2': [12, 7],
    'b-home-3': [11, 7],
    'b-home-4': [10, 7],
    'b-home-5': [9, 7],
    'b-home-6': [8, 7],
  };

  // Build grid row by row
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      // Check if this is a home base position
      if (row < 6 && col < 6 && row === 0 && col === 0) {
        // RED home base (top-left)
        grid.push(
          <div key={`${row}-${col}`} className="col-start-1 col-end-7 row-start-1 row-end-7">
            {renderHomeBase('red')}
          </div>
        );
        continue;
      }
      if (row < 6 && col >= 9 && row === 0 && col === 9) {
        // YELLOW home base (top-right)
        grid.push(
          <div key={`${row}-${col}`} className="col-start-10 col-end-16 row-start-1 row-end-7">
            {renderHomeBase('yellow')}
          </div>
        );
        continue;
      }
      if (row >= 9 && col < 6 && row === 9 && col === 0) {
        // GREEN home base (bottom-left)
        grid.push(
          <div key={`${row}-${col}`} className="col-start-1 col-end-7 row-start-10 row-end-16">
            {renderHomeBase('green')}
          </div>
        );
        continue;
      }
      if (row >= 9 && col >= 9 && row === 9 && col === 9) {
        // BLUE home base (bottom-right)
        grid.push(
          <div key={`${row}-${col}`} className="col-start-10 col-end-16 row-start-10 row-end-16">
            {renderHomeBase('blue')}
          </div>
        );
        continue;
      }

      // Skip cells that are part of home bases
      if ((row < 6 && col < 6) || (row < 6 && col >= 9) || (row >= 9 && col < 6) || (row >= 9 && col >= 9)) {
        continue;
      }

      // Check if this is the center finish area (3×3)
      if (row >= 6 && row <= 8 && col >= 6 && col <= 8) {
        if (row === 6 && col === 6) {
          // Center finish area
          grid.push(
            <div key={`${row}-${col}`} className="col-start-7 col-end-10 row-start-7 row-end-10">
              <div className="w-full h-full border-4 border-gray-900 rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 relative overflow-hidden">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <polygon points="0,0 100,0 50,50" fill="rgb(34, 197, 94)" opacity="0.5" />
                  <polygon points="100,0 100,100 50,50" fill="rgb(234, 179, 8)" opacity="0.5" />
                  <polygon points="100,100 0,100 50,50" fill="rgb(59, 130, 246)" opacity="0.5" />
                  <polygon points="0,100 0,0 50,50" fill="rgb(239, 68, 68)" opacity="0.5" />
                  <circle cx="50" cy="50" r="10" fill="gold" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl animate-pulse">🏆</span>
                </div>
              </div>
            </div>
          );
        }
        continue;
      }

      // Check if this is a track position
      let rendered = false;
      for (const [pos, [r, c]] of Object.entries(trackPositions)) {
        if (r === row && c === col) {
          const position = parseInt(pos);
          let bgColor = undefined;
          
          // Color the starting squares
          if (position === START_POSITIONS.red) bgColor = `${colorClasses.red} bg-opacity-30`;
          else if (position === START_POSITIONS.green) bgColor = `${colorClasses.green} bg-opacity-30`;
          else if (position === START_POSITIONS.yellow) bgColor = `${colorClasses.yellow} bg-opacity-30`;
          else if (position === START_POSITIONS.blue) bgColor = `${colorClasses.blue} bg-opacity-30`;
          
          grid.push(renderSquare(position, bgColor));
          rendered = true;
          break;
        }
      }
      if (rendered) continue;

      // Check if this is a home column position
      for (const [pos, [r, c]] of Object.entries(homeColumns)) {
        if (r === row && c === col) {
          grid.push(renderSquare(pos));
          rendered = true;
          break;
        }
      }
      if (rendered) continue;

      // Empty cell
      grid.push(
        <div key={`${row}-${col}`} className="w-8 h-8 bg-gray-100"></div>
      );
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 rounded-3xl shadow-2xl border-8 border-amber-700">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">Traditional Ludo</h2>
        <p className="text-sm text-gray-600 mt-1">Roll 6 to start • ⭐ = Safe Zone</p>
      </div>

      <div
        className="grid bg-white shadow-2xl rounded-lg overflow-hidden border-4 border-gray-800"
        style={{
          gridTemplateColumns: 'repeat(15, 2rem)',
          gridTemplateRows: 'repeat(15, 2rem)',
          gap: 0,
        }}
      >
        {grid}
      </div>

      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-lg">⭐</span>
          <span>Safe Zone</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">▶</span>
          <span>Start Square</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <span>Finish</span>
        </div>
      </div>
    </div>
  );
};

export default Board;
