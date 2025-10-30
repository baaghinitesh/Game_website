import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gameAPI } from '@shared/services/api';
import { Game } from '../types';
import frontendGameRegistry from '@games/GamePluginRegistry';
import loadAllFrontendGamePlugins from '@games/loadGames';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import ShareGameModal from '@features/games/components/ShareGameModal';
import toast from 'react-hot-toast';

const GamePlayPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    // Load game plugins
    loadAllFrontendGamePlugins();
    
    // For demo, we'll use Tic-Tac-Toe directly
    // In production, you'd load the game based on roomId or gameId
    loadGameData();
  }, [roomId]);

  const loadGameData = async () => {
    try {
      if (!roomId) {
        toast.error('No game ID provided');
        navigate('/games');
        return;
      }

      // Fetch the actual game data from the API
      const gameData = await gameAPI.getGameById(roomId);
      
      if (!gameData) {
        toast.error('Game not found');
        navigate('/games');
        return;
      }
      
      setGame(gameData);
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
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate('/games')}
            className="btn-secondary"
          >
            ← Back to Games
          </button>
          
          {game.isMultiplayer && (
            <motion.button
              onClick={() => {
                // Generate invite code (in production, get from API)
                const code = roomId?.slice(-6).toUpperCase() || 'DEMO123';
                setInviteCode(code);
                setShowShareModal(true);
              }}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Invite Friends
            </motion.button>
          )}
        </div>

        <GameComponent
          roomId={roomId}
          isMultiplayer={game.isMultiplayer}
          onGameEnd={handleGameEnd}
        />
      </motion.div>

      {/* Share Modal */}
      <ShareGameModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        roomId={roomId || 'demo'}
        inviteCode={inviteCode}
        gameName={game.name}
      />
    </div>
  );
};

export default GamePlayPage;
