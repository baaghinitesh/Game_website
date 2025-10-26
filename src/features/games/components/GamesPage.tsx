import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gameAPI } from '@shared/services/api';
import { Game } from '../types';
import GameCard from '@features/games/components/GameCard';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import Leaderboard from '@features/leaderboard/components/Leaderboard';

const GamesPage = () => {
  const { category } = useParams();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'all');

  useEffect(() => {
    loadGames();
  }, [selectedCategory]);

  const loadGames = async () => {
    setIsLoading(true);
    try {
      const gamesData = selectedCategory === 'all'
        ? await gameAPI.getAllGames()
        : await gameAPI.getGamesByCategory(selectedCategory);
      setGames(gamesData);
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['all', 'arcade', 'puzzle', 'card', 'racing', 'strategy', 'quiz'];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold text-center mb-8 text-glow-blue"
      >
        Browse Games
      </motion.h1>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                : 'glass text-text-secondary hover:text-text-primary'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Games Grid with Leaderboard */}
      {games.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Games Section */}
          <div className="xl:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <GameCard key={game._id} game={game} />
              ))}
            </div>
          </div>
          
          {/* Leaderboard Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-4">
              <Leaderboard gameId={games[0]?._id} limit={10} />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-text-secondary py-20">
          <p className="text-xl">No games found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default GamesPage;
