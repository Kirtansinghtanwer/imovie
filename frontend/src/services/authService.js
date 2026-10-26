import api from './api';
import { mockUsers } from '../data/mockUsers';

const AUTH_STORAGE_KEY = 'imovies_user_session';
const TOKEN_STORAGE_KEY = 'imovies_token';

export const authService = {
  // Login with credentials
  login: async (email, password) => {
    try {
      // Try connecting to real Express backend first
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.user && res.data?.token) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.data.user));
        localStorage.setItem(TOKEN_STORAGE_KEY, res.data.token);
        return { success: true, user: res.data.user, token: res.data.token, isDemo: false };
      }
    } catch {
      // Gracefully fall back to local mock authentication for demo
      console.info('[IMovies Auth] Backend not reachable or route not configured. Falling back to local demo auth.');
    }

    // Local mock auth matching
    const foundUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (foundUser) {
      const demoToken = `demo-jwt-${foundUser.role}-${Date.now()}`;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(foundUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, demoToken);
      return {
        success: true,
        user: foundUser,
        token: demoToken,
        isDemo: true,
        message: `Welcome, ${foundUser.name}! (Logged in as demo ${foundUser.role})`
      };
    }

    // Generic fallback user if custom email entered
    const defaultUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: email.split('@')[0],
      email: email,
      role: 'user',
      phone: '+1 (555) 000-1122',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      memberSince: 'Just now',
      status: 'active'
    };

    const demoToken = `demo-jwt-user-${Date.now()}`;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
    localStorage.setItem(TOKEN_STORAGE_KEY, demoToken);
    return {
      success: true,
      user: defaultUser,
      token: demoToken,
      isDemo: true,
      message: `Welcome, ${defaultUser.name}! (Signed in with demo profile)`
    };
  },

  // Register new account
  register: async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data?.user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.data.user));
        localStorage.setItem(TOKEN_STORAGE_KEY, res.data.token || 'demo-jwt-new');
        return { success: true, user: res.data.user, isDemo: false };
      }
    } catch {
      console.info('[IMovies Auth] Backend registration unavailable. Creating local demo user session.');
    }

    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: userData.name || userData.fullName,
      email: userData.email,
      phone: userData.phone || '+1 (555) 123-4567',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      memberSince: 'Today',
      status: 'active'
    };

    const demoToken = `demo-jwt-user-${Date.now()}`;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    localStorage.setItem(TOKEN_STORAGE_KEY, demoToken);

    return {
      success: true,
      user: newUser,
      token: demoToken,
      isDemo: true,
      message: 'Account created successfully! Welcome to IMovies.'
    };
  },

  // Get current logged in user from localStorage
  getCurrentUser: () => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  // Update profile
  updateProfile: async (updatedData) => {
    try {
      const res = await api.put('/users/profile', updatedData);
      if (res.data?.user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.data.user));
        return { success: true, user: res.data.user };
      }
    } catch {
      // Demo update
    }

    const current = authService.getCurrentUser() || {};
    const updated = { ...current, ...updatedData };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    return { success: true, user: updated, isDemo: true };
  },

  // Logout
  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};
