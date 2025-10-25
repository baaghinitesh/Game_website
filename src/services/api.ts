import axios from 'axios';
import { AuthResponse, Game, GameHistory, Friend, FriendRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (username: string, email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/register', { username, email, password });
    return data;
  },

  login: async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },

  guestLogin: async () => {
    const { data } = await api.post<AuthResponse>('/auth/guest');
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get('/auth/profile');
    return data.user;
  },

  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data;
  },
};

// Game API
export const gameAPI = {
  getAllGames: async () => {
    const { data } = await api.get<{ games: Game[] }>('/games');
    return data.games;
  },

  getGamesByCategory: async (category: string) => {
    const { data } = await api.get<{ games: Game[] }>(`/games/category/${category}`);
    return data.games;
  },

  getGameById: async (id: string) => {
    const { data } = await api.get<{ game: Game }>(`/games/${id}`);
    return data.game;
  },

  createGameSession: async (gameId: string, isPrivate: boolean = false) => {
    const { data } = await api.post('/games/session', { gameId, isPrivate });
    return data.session;
  },

  joinGameSession: async (roomId: string) => {
    const { data } = await api.post(`/games/session/${roomId}/join`);
    return data.session;
  },

  getGameHistory: async (limit: number = 20) => {
    const { data } = await api.get<{ history: GameHistory[] }>(`/games/history?limit=${limit}`);
    return data.history;
  },

  getLeaderboard: async (gameId: string, limit: number = 10) => {
    const { data } = await api.get(`/games/leaderboard/${gameId}?limit=${limit}`);
    return data.leaderboard;
  },
};

// User API
export const userAPI = {
  addFriend: async (friendUsername: string) => {
    const { data } = await api.post('/users/friends', { friendUsername });
    return data;
  },

  acceptFriendRequest: async (requestId: string) => {
    const { data } = await api.post(`/users/friends/accept/${requestId}`);
    return data;
  },

  getFriends: async () => {
    const { data } = await api.get<{ friends: Friend[] }>('/users/friends');
    return data.friends;
  },

  getFriendRequests: async () => {
    const { data } = await api.get<{ friendRequests: FriendRequest[] }>('/users/friends/requests');
    return data.friendRequests;
  },

  searchUsers: async (query: string) => {
    const { data } = await api.get(`/users/search?query=${query}`);
    return data.users;
  },

  getUserStats: async () => {
    const { data } = await api.get('/users/stats');
    return data;
  },
};

export default api;
