import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@store/authStore';
import { userAPI, gameAPI } from '@shared/services/api';
import { GameHistory } from '../types';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [statsData, historyData] = await Promise.all([
        userAPI.getUserStats(),
        gameAPI.getGameHistory(10),
      ]);
      setStats(statsData);
      setGameHistory(historyData);
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const xpToNextLevel = ((user?.level || 1) * 100);
  const xpProgress = ((user?.xp || 0) % 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Profile Header */}
        <div className="glass-card mb-8">
          <div className="flex items-center gap-6">
            <img
              src={user?.avatar}
              alt={user?.username}
              className="w-24 h-24 rounded-full border-4 border-neon-blue"
            />
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                {user?.username}
              </h1>
              
              <div className="flex items-center gap-4 text-text-secondary">
                <span>Level {user?.level}</span>
                <span>•</span>
                <span>{user?.xp} XP</span>
              </div>

              {/* XP Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-text-secondary mb-1">
                  <span>Progress to Level {(user?.level || 1) + 1}</span>
                  <span>{xpProgress} / {xpToNextLevel}</span>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(xpProgress / xpToNextLevel) * 100}%` }}
                    className="bg-gradient-to-r from-neon-blue to-neon-purple h-3 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Games"
            value={stats?.stats?.totalGames || 0}
            icon="🎮"
            gradient="from-neon-blue to-neon-purple"
          />
          <StatCard
            title="Wins"
            value={stats?.stats?.totalWins || 0}
            icon="🏆"
            gradient="from-neon-purple to-neon-pink"
          />
          <StatCard
            title="Total Score"
            value={stats?.stats?.totalScore || 0}
            icon="⭐"
            gradient="from-neon-pink to-neon-blue"
          />
        </div>

        {/* Game History */}
        <div className="glass-card">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Game History</h2>
          
          {gameHistory.length > 0 ? (
            <div className="space-y-3">
              {gameHistory.map((game) => (
                <motion.div
                  key={game._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass p-4 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-text-primary font-semibold">
                      {(game as any).gameId?.name || 'Game'}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {new Date(game.playedAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        game.result === 'win'
                          ? 'bg-neon-green/20 text-neon-green'
                          : game.result === 'loss'
                          ? 'bg-neon-pink/20 text-neon-pink'
                          : 'bg-neon-blue/20 text-neon-blue'
                      }`}
                    >
                      {game.result.toUpperCase()}
                    </span>
                    <p className="text-sm text-text-secondary mt-1">
                      +{game.xpEarned} XP
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-text-secondary py-8">
              No games played yet. Start playing to build your history!
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ title, value, icon, gradient }: any) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`glass-card bg-gradient-to-br ${gradient} p-6`}
  >
    <div className="text-4xl mb-2">{icon}</div>
    <h3 className="text-text-secondary text-sm mb-1">{title}</h3>
    <p className="text-3xl font-bold text-white">{value}</p>
  </motion.div>
);

export default ProfilePage;
