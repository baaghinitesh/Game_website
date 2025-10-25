import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gameAPI } from '../services/api';
import { Game } from '../types';
import frontendGameRegistry from '../games/GamePluginRegistry';
import loadAllFrontendGamePlugins from '../games/loadGames';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const GamePlayPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load game plugins
    loadAllFrontendGamePlugins();
    
    // For demo, we'll use Tic-Tac-Toe directly
    // In production, you'd load the game based on roomId or gameId
    loadGameData();
  }, [roomId]);

  const loadGameData = async () => {
    try {
      // For now, we'll create a demo game object
      // In production, you'd fetch this from the API based on roomId
      const demoGame: Game = {
        _id: roomId || 'demo',
        name: 'Tic Tac Toe',
        slug: 'tictactoe',
        description: 'Classic Tic Tac Toe game',
        category: 'puzzle',
        thumbnail: '',
        minPlayers: 2,
        maxPlayers: 2,
        isMultiplayer: true,
        pluginId: 'tictactoe',
        componentPath: '',
        totalPlays: 0,
        activePlayers: 0,
        featured: false,
      };
      
      setGame(demoGame);
    } catch (error) {
      console.error('Failed to load game:', error);
      toast.error('Failed to load game');
      navigate('/games');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameEnd = (result: any) => {
    console.log('Game ended:', result);
    setTimeout(() => {
      navigate('/games');
    }, 3000);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!game) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-4">Game not found</h1>
        <button onClick={() => navigate('/games')} className="btn-primary">
          Back to Games
        </button>
      </div>
    );
  }

  const GameComponent = frontendGameRegistry.getGameComponent(game.pluginId);

  if (!GameComponent) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-4">Game component not loaded</h1>
        <button onClick={() => navigate('/games')} className="btn-primary">
          Back to Games
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="mb-6">
          <button
            onClick={() => navigate('/games')}
            className="btn-secondary"
          >
            ← Back to Games
          </button>
        </div>

        <GameComponent
          roomId={roomId}
          isMultiplayer={game.isMultiplayer}
          onGameEnd={handleGameEnd}
        />
      </motion.div>
    </div>
  );
};

export default GamePlayPage;
