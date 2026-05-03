import { create } from 'zustand';
import { mockUser } from '../lib/mockData';

// DEMO MODE - No backend required
const DEMO_MODE = true;

export const useAuthStore = create((set) => ({
  user: DEMO_MODE ? mockUser : JSON.parse(localStorage.getItem('user') || 'null'),
  token: DEMO_MODE ? 'demo-token' : localStorage.getItem('token'),
  isAuthenticated: DEMO_MODE ? true : !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    // DEMO MODE - Auto login with any credentials
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      const user = mockUser;
      const token = 'demo-token-' + Date.now();
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true };
    }
    
    // Real API call (when backend is available)
    try {
      const { auth } = await import('../lib/api');
      const response = await auth.login(credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    
    // DEMO MODE - Auto register
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const user = { ...mockUser, name: userData.name, email: userData.email };
      const token = 'demo-token-' + Date.now();
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true };
    }
    
    // Real API call
    try {
      const { auth } = await import('../lib/api');
      const response = await auth.register(userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    const updatedUser = { ...useAuthStore.getState().user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },
}));
