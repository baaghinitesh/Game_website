import { motion } from 'framer-motion';
import { Game } from '../types';
import { useNavigate } from 'react-router-dom';

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const navigate = useNavigate();

  const handlePlay = () => {
    // Navigate to game page (will be handled by game plugin system)
    navigate(`/play/${game._id}`);
  };

  return (
    <motion.div
      className="glass-card hover-lift cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
        boxShadow: '0 0 30px rgba(0, 212, 255, 0.5)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={handlePlay}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={game.thumbnail || 'https://via.placeholder.com/400x250/1a1a2e/00d4ff?text=' + game.name}
          alt={game.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="btn-primary w-full"
              onClick={(e) => {
                e.stopPropagation();
                handlePlay();
              }}
            >
              Play Now
            </motion.button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {game.isMultiplayer && (
            <span className="px-2 py-1 text-xs bg-neon-purple/80 backdrop-blur-sm rounded-full text-white">
              Multiplayer
            </span>
          )}
          {game.featured && (
            <span className="px-2 py-1 text-xs bg-neon-pink/80 backdrop-blur-sm rounded-full text-white">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Game Info */}
      <div>
        <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-glow-blue transition-all">
          {game.name}
        </h3>
        
        <p className="text-sm text-text-secondary mb-3 line-clamp-2">
          {game.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {game.activePlayers} playing
            </span>
            
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {game.totalPlays} plays
            </span>
          </div>

          <span className="text-xs px-2 py-1 rounded-full bg-dark-elevated text-neon-blue capitalize">
            {game.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;
