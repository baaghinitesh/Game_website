import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gameAPI, authAPI } from '@shared/services/api';
import GameCard from '@features/games/components/GameCard';
import ParticlesBackground from '@shared/components/common/ParticlesBackground';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import { useAuthStore } from '@store/authStore';

interface Game {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  thumbnail: string;
  minPlayers: number;
  maxPlayers: number;
  isMultiplayer: boolean;
}

const categories = [
  { name: 'Arcade', emoji: '🎯', gradient: 'from-neon-blue to-neon-purple' },
  { name: 'Puzzle', emoji: '🧩', gradient: 'from-neon-purple to-neon-pink' },
  { name: 'Card', emoji: '🃏', gradient: 'from-neon-pink to-neon-blue' },
  { name: 'Racing', emoji: '🏎️', gradient: 'from-neon-green to-neon-blue' },
  { name: 'Strategy', emoji: '⚔️', gradient: 'from-neon-blue to-neon-green' },
  { name: 'Quiz', emoji: '🧠', gradient: 'from-neon-purple to-neon-green' },
];

const HomePage = () => {
  const { isAuthenticated, setAuth } = useAuthStore();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGames();
    loadUserProfile();
  }, []);

  const loadGames = async () => {
    try {
      const gamesData = await gameAPI.getAllGames();
      setGames(gamesData);
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      try {
        const user = await authAPI.getProfile();
        setAuth(user, token);
      } catch (error) {
        console.error('Failed to load profile:', error);
        localStorage.removeItem('token');
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative min-h-screen">
      <ParticlesBackground />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              className="text-6xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink"
              animate={{
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              Welcome to GameZone
            </motion.h1>
            
            <p className="text-xl text-text-secondary mb-8">
              Experience the future of online gaming. Play, compete, and connect with friends in stunning 3D environments.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/games">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Browse Games
                </motion.button>
              </Link>
              
              {!isAuthenticated && (
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary text-lg px-8 py-4"
                  >
                    Sign Up Free
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>
        </section>

        {/* Categories Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-glow-purple">
            Game Categories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link key={category.name} to={`/games/${category.name.toLowerCase()}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`glass-card text-center cursor-pointer bg-gradient-to-br ${category.gradient} p-6`}
                >
                  <div className="text-5xl mb-3">{category.emoji}</div>
                  <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Games Section */}
        {games.length > 0 && (
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-4xl font-bold text-center mb-12 text-glow-blue">
              Featured Games
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.slice(0, 6).map((game) => (
                <GameCard key={game._id} game={game} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/games">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                >
                  View All Games
                </motion.button>
              </Link>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-glow-purple">
            Why GameZone?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon="🎮"
              title="Multiplayer Action"
              description="Challenge friends or random players in real-time multiplayer games"
            />
            <FeatureCard
              icon="🏆"
              title="Leaderboards & Achievements"
              description="Compete for the top spot and unlock special badges"
            />
            <FeatureCard
              icon="👥"
              title="Social Gaming"
              description="Add friends, chat, and invite them to play together"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05 }}
    className="glass-card text-center"
  >
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
    <p className="text-text-secondary">{description}</p>
  </motion.div>
);

export default HomePage;
