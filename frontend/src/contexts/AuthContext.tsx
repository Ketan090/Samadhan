'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  location?: any;
  expertise?: string[];
  bio?: string;
  organization?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo accounts for SIH presentation — works without a backend
const DEMO_ACCOUNTS: Record<string, { user: User; password: string }> = {
  'admin@samadhanhub.gov.in': {
    user: {
      id: 'demo-admin-001',
      email: 'admin@samadhanhub.gov.in',
      name: 'Dr. Rajesh Kumar',
      role: 'admin',
      phone: '+91-9876543210',
      organization: 'SamadhanHub National Office',
      bio: 'Platform administrator overseeing national challenge operations',
    },
    password: 'admin123',
  },
  'citizen@samadhanhub.gov.in': {
    user: {
      id: 'demo-citizen-001',
      email: 'citizen@samadhanhub.gov.in',
      name: 'Priya Sharma',
      role: 'citizen',
      phone: '+91-9876543211',
      location: { city: 'Ranchi', state: 'Jharkhand' },
      bio: 'Environmental activist concerned about urban waste management',
    },
    password: 'citizen123',
  },
  'university@samadhanhub.gov.in': {
    user: {
      id: 'demo-univ-001',
      email: 'university@samadhanhub.gov.in',
      name: 'Prof. Anita Desai',
      role: 'university',
      organization: 'IIT Ranchi',
      expertise: ['IoT', 'Data Science', 'Environmental Engineering'],
      bio: 'Faculty mentor for societal innovation projects',
    },
    password: 'university123',
  },
  'industry@samadhanhub.gov.in': {
    user: {
      id: 'demo-ind-001',
      email: 'industry@samadhanhub.gov.in',
      name: 'Vikram Mehta',
      role: 'industry',
      organization: 'EcoTech Solutions Pvt. Ltd.',
      expertise: ['IoT', 'Sensors', 'Cloud Computing'],
      bio: 'CTO of a clean-tech startup focused on environmental monitoring',
    },
    password: 'industry123',
  },
  'government@samadhanhub.gov.in': {
    user: {
      id: 'demo-gov-001',
      email: 'government@samadhanhub.gov.in',
      name: 'Shri Amit Singh, IAS',
      role: 'government',
      organization: 'Ministry of Electronics & IT',
      bio: 'Nodal officer for Smart India Hackathon coordination',
    },
    password: 'government123',
  },
};

const DEMO_USERS = Object.values(DEMO_ACCOUNTS).map(d => d.user);

function getDemoUser(email: string): { user: User; password: string } | undefined {
  return DEMO_ACCOUNTS[email.toLowerCase().trim()];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('samadhanhub_token');
    const savedUser = localStorage.getItem('samadhanhub_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('samadhanhub_token');
        localStorage.removeItem('samadhanhub_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Check demo accounts first (works without a backend)
    const demo = getDemoUser(email);
    if (demo && demo.password === password) {
      const mockToken = `demo-token-${demo.user.role}-${Date.now()}`;
      setToken(mockToken);
      setUser(demo.user);
      localStorage.setItem('samadhanhub_token', mockToken);
      localStorage.setItem('samadhanhub_user', JSON.stringify(demo.user));
      return;
    }

    // Try real backend
    try {
      const res = await authAPI.login(email, password);
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('samadhanhub_token', newToken);
      localStorage.setItem('samadhanhub_user', JSON.stringify(newUser));
    } catch (err) {
      // If backend is unreachable, check if it's a network error vs bad credentials
      const error = err as any;
      if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error') || error?.code === 'ECONNREFUSED') {
        throw new Error('Backend is not available. Try a demo account below.');
      }
      throw err;
    }
  };

  const register = async (data: any) => {
    try {
      const res = await authAPI.register(data);
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('samadhanhub_token', newToken);
      localStorage.setItem('samadhanhub_user', JSON.stringify(newUser));
    } catch (err) {
      const error = err as any;
      if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error') || error?.code === 'ECONNREFUSED') {
        // Create a mock user locally
        const mockUser: User = {
          id: `user-${Date.now()}`,
          email: data.email,
          name: data.name,
          role: data.role || 'citizen',
          phone: data.phone,
          expertise: data.expertise,
          bio: data.bio,
          organization: data.organization,
        };
        const mockToken = `demo-token-${Date.now()}`;
        setToken(mockToken);
        setUser(mockUser);
        localStorage.setItem('samadhanhub_token', mockToken);
        localStorage.setItem('samadhanhub_user', JSON.stringify(mockUser));
        return;
      }
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('samadhanhub_token');
    localStorage.removeItem('samadhanhub_user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('samadhanhub_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
