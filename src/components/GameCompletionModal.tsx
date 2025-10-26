import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';

interface GameCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: 'win' | 'loss' | 'draw';
  score?: number;
  xpGained?: number;
  onPlayAgain: () => void;
  gameName: string;
  opponentId?: string;
}

interface User {
  _id: string;
  username: string;
  avatar?: string;
  level: number;
  status: string;
}

const GameCompletionModal = ({
  isOpen,
  onClose,
  result,
  score = 0,
  xpGained = 0,
  onPlayAgain,
  gameName,
  opponentId
}: GameCompletionModalProps) => {
  const navigate = useNavigate();
  const [suggestedFriends, setSuggestedFriends] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSuggestedFriends();
    }
  }, [isOpen]);

  const loadSuggestedFriends = async () => {
    setIsLoading(true);
    try {
      // In production, this would fetch users who played the same game
      // For now, we'll simulate it
      const response = await userAPI.searchUsers('');
      setSuggestedFriends(response.slice(0, 3));
    } catch (error) {
      console.error('Failed to load suggested friends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (userId: string) => {
    try {
      await userAPI.addFriend(userId);
      toast.success('Friend request sent! 👋');
      setSuggestedFriends(prev => prev.filter(f => f._id !== userId));
    } catch (error) {
      toast.error('Failed to send friend request');
    }
  };

  const getResultEmoji = () => {
    if (result === 'win') return '🏆';
    if (result === 'loss') return '😢';
    return '🤝';
  };

  const getResultColor = () => {
    if (result === 'win') return 'text-neon-green';
    if (result === 'loss') return 'text-neon-pink';
    return 'text-neon-blue';
  };

  const getResultTitle = () => {
    if (result === 'win') return 'Victory!';
    if (result === 'loss') return 'Game Over';
    return "It's a Draw!";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="glass-card p-8 rounded-2xl max-w-lg w-full relative">
              {/* Confetti Effect */}
              {result === 'win' && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 2, delay: 1 }}
                >
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-2xl"
                      initial={{
                        top: '50%',
                        left: '50%',
                        opacity: 1
                      }}
                      animate={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        opacity: 0
                      }}
                      transition={{ duration: 1.5, delay: i * 0.05 }}
                    >
                      🎉
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Result Header */}
              <div className="text-center mb-6">
                <motion.div
                  className="text-7xl mb-4"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: result === 'win' ? [0, 10, -10, 0] : 0
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {getResultEmoji()}
                </motion.div>
                <h2 className={`text-4xl font-bold ${getResultColor()} mb-2`}>
                  {getResultTitle()}
                </h2>
                <p className="text-text-secondary">{gameName}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass p-4 rounded-xl text-center">
                  <p className="text-text-secondary text-sm mb-1">Score</p>
                  <p className="text-3xl font-bold text-neon-blue">{score}</p>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                  <p className="text-text-secondary text-sm mb-1">XP Gained</p>
                  <p className="text-3xl font-bold text-neon-purple">+{xpGained}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <motion.button
                  onClick={onPlayAgain}
                  className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-neon-green to-emerald-600 text-white font-bold text-lg flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Play Again
                </motion.button>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => navigate('/games')}
                    className="px-4 py-3 rounded-xl glass hover:bg-white/10 font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Browse Games
                  </motion.button>
                  
                  <motion.button
                    onClick={() => navigate('/profile')}
                    className="px-4 py-3 rounded-xl glass hover:bg-white/10 font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Stats
                  </motion.button>
                </div>
              </div>

              {/* Friend Suggestions */}
              {suggestedFriends.length > 0 && (
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span>👥</span>
                    Players you might know
                  </h3>
                  <div className="space-y-3">
                    {suggestedFriends.map((user) => (
                      <motion.div
                        key={user._id}
                        className="glass p-3 rounded-lg flex items-center justify-between"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center font-bold">
                            {user.avatar || user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold">{user.username}</p>
                            <p className="text-xs text-text-secondary">Level {user.level}</p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => handleAddFriend(user._id)}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-semibold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          + Add
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 text-text-secondary hover:text-white"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GameCompletionModal;
