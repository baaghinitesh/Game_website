import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import socketService from './services/socket';

// Layout
import Navbar from './components/Navbar';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GamesPage from './pages/GamesPage';
import GamePlayPage from './pages/GamePlayPage';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';

function App() {
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Connect socket when user is authenticated
    if (isAuthenticated && user) {
      socketService.connect(user.id);
    }

    return () => {
      // Disconnect socket when component unmounts
      if (!isAuthenticated) {
        socketService.disconnect();
      }
    };
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:category" element={<GamesPage />} />
          <Route path="/play/:roomId" element={<GamePlayPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/friends" element={<FriendsPage />} />
        </Routes>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#E0E0E0',
            border: '1px solid rgba(0, 212, 255, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#06ffa5',
              secondary: '#1a1a2e',
            },
          },
          error: {
            iconTheme: {
              primary: '#f72585',
              secondary: '#1a1a2e',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
