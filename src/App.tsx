import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@store/authStore';
import { socket } from '@shared';
import { ROUTES } from '@core/constants/routes';

// Layout Components
import { Navbar, HomePage } from '@shared/components/layout';

// Feature Pages
import { LoginPage, RegisterPage } from '@features/auth';
import { GamesPage, GamePlayPage } from '@features/games';
import { ProfilePage } from '@features/profile';
import { FriendsPage } from '@features/friends';

function App() {
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Connect socket when user is authenticated
    if (isAuthenticated && user) {
      socket.connect(user.id);
    }

    return () => {
      // Disconnect socket when component unmounts
      if (!isAuthenticated) {
        socket.disconnect();
      }
    };
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      
      <main className="pt-16">
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.AUTH.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.GAMES.LIST} element={<GamesPage />} />
          <Route path="/games/:category" element={<GamesPage />} />
          <Route path={ROUTES.GAMES.PLAY} element={<GamePlayPage />} />
          <Route path={ROUTES.USER.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.SOCIAL.FRIENDS} element={<FriendsPage />} />
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
