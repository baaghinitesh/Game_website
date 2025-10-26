import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gameAPI } from '@shared/services/api';

interface LeaderboardEntry {
  _id: string;
  userId: {
    _id: string;
    username: string;
    avatar?: string;
    level: number;
  };
  score: number;
  totalGames: number;
  wins: number;
  winRate: number;
}

interface LeaderboardProps {
  gameId?: string;
  limit?: number;
}

const Leaderboard = ({ gameId, limit = 10 }: LeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'weekly' | 'alltime'>('weekly');

  useEffect(() => {
    loadLeaderboard();
  }, [gameId, timeframe]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      if (gameId) {
        const data = await gameAPI.getLeaderboard(gameId, limit);
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500 to-amber-600';
    if (rank === 2) return 'from-gray-300 to-gray-400';
    if (rank === 3) return 'from-orange-600 to-orange-700';
    return 'from-neon-blue to-neon-purple';
  };

  const getRankBorder = (rank: number) => {
    if (rank === 1) return 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]';
    if (rank === 2) return 'border-gray-300 shadow-[0_0_15px_rgba(209,213,219,0.5)]';
    if (rank === 3) return 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]';
    return 'border-neon-blue/30';
  };

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
        </div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const restOfPlayers = leaderboard.slice(3);
  
  const totalGames = leaderboard.reduce((sum, entry) => sum + entry.totalGames, 0);
  const totalWins = leaderboard.reduce((sum, entry) => sum + entry.wins, 0);
  const avgWinRate = leaderboard.length > 0
    ? (leaderboard.reduce((sum, entry) => sum + entry.winRate, 0) / leaderboard.length).toFixed(1)
    : 0;

  return (
    <div className="glass-card p-6 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-glow-blue">Leaderboard</h2>
          <p className="text-sm text-text-secondary">Top players this week</p>
        </div>
        
        {/* Timeframe Toggle */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              timeframe === 'weekly'
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                : 'glass text-text-secondary hover:text-text-primary'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Weekly
          </motion.button>
          <motion.button
            onClick={() => setTimeframe('alltime')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              timeframe === 'alltime'
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                : 'glass text-text-secondary hover:text-text-primary'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Time
          </motion.button>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          <p className="text-lg mb-2">🏆</p>
          <p>No leaderboard data yet</p>
          <p className="text-sm">Be the first to play!</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {topThree.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {topThree.map((entry, index) => {
                  const rank = index + 1;
                  return (
                    <motion.div
                      key={entry._id}
                      className={`
                        relative p-4 rounded-xl border-2 backdrop-blur-lg
                        ${getRankBorder(rank)}
                        bg-gradient-to-br ${getRankColor(rank)} bg-opacity-10
                      `}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      {/* Medal */}
                      <div className="text-center mb-2">
                        <motion.span
                          className="text-4xl"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: rank === 1 ? [0, 5, -5, 0] : 0
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            repeatDelay: 1 
                          }}
                        >
                          {getMedalEmoji(rank)}
                        </motion.span>
                      </div>

                      {/* Avatar */}
                      <div className="flex justify-center mb-2">
                        <div className={`
                          w-16 h-16 rounded-full flex items-center justify-center
                          bg-gradient-to-br ${getRankColor(rank)}
                          text-2xl font-bold
                        `}>
                          {entry.userId.avatar || entry.userId.username.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      {/* Username */}
                      <p className="text-center font-bold text-sm mb-1 truncate">
                        {entry.userId.username}
                      </p>

                      {/* Score */}
                      <p className="text-center text-2xl font-bold text-neon-green mb-1">
                        {entry.score}
                      </p>

                      {/* Stats */}
                      <div className="text-center text-xs text-text-secondary">
                        <p>{entry.wins}W / {entry.totalGames}G</p>
                        <p className="text-neon-blue">{entry.winRate}% WR</p>
                      </div>

                      {/* Level Badge */}
                      <div className="absolute top-2 right-2">
                        <div className="glass px-2 py-1 rounded-full text-xs font-bold text-neon-purple">
                          Lv {entry.userId.level}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rest of Rankings */}
          {restOfPlayers.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-text-secondary mb-3 px-2">Other Rankings</h3>
              {restOfPlayers.map((entry, index) => {
                const rank = index + 4;
                return (
                  <motion.div
                    key={entry._id}
                    className="glass p-3 rounded-lg hover:bg-white/5 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 3) * 0.05 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center font-bold text-sm">
                        #{rank}
                      </div>

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center font-bold">
                        {entry.userId.avatar || entry.userId.username.charAt(0).toUpperCase()}
                      </div>

                      {/* Username & Level */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{entry.userId.username}</p>
                        <p className="text-xs text-text-secondary">Level {entry.userId.level}</p>
                      </div>

                      {/* Stats */}
                      <div className="text-right">
                        <p className="font-bold text-neon-green">{entry.score}</p>
                        <p className="text-xs text-text-secondary">{entry.winRate}% WR</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Aggregate Stats */}
          <motion.div
            className="mt-6 pt-4 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-text-secondary mb-1">Total Games</p>
                <p className="text-lg font-bold text-neon-blue">{totalGames}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary mb-1">Total Wins</p>
                <p className="text-lg font-bold text-neon-green">{totalWins}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary mb-1">Avg Win Rate</p>
                <p className="text-lg font-bold text-neon-purple">{avgWinRate}%</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
