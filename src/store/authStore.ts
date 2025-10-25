import create from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isGuest: false,
      
      setAuth: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        isGuest: user.isGuest || false,
      }),
      
      clearAuth: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isGuest: false,
      }),
      
      updateUser: (updatedUser) => set((state) => ({
        user: state.user ? { ...state.user, ...updatedUser } : null,
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
