import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, UserRole } from '../types';
import { authService } from '../services/api';

export interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<{ user: User; token: string }>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<{ user: User; token: string }>;
  googleLogin: () => Promise<void>;
  logout: () => void;
}

// Initialize state from localStorage if available
const getInitialState = (): AuthState => {
  const savedUser = localStorage.getItem('user');
  const savedToken = localStorage.getItem('token');
  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken,
    loading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

type AuthAction =
  | { type: 'LOGIN_START' | 'REGISTER_START' }
  | { type: 'LOGIN_SUCCESS' | 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' | 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType>({
  state: initialState,
  login: async () => ({ user: {} as User, token: '' }),
  register: async () => ({ user: {} as User, token: '' }),
  googleLogin: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Persist auth state in localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
    if (state.token) {
      localStorage.setItem('token', state.token);
    } else {
      localStorage.removeItem('token');
    }
  }, [state.user, state.token]);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const data = await authService.login(email, password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      return data; // Return the user data and token
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : 'Login failed',
      });
      // Re-throw error for the component to handle
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole = 'user') => {
    try {
      dispatch({ type: 'REGISTER_START' });
      const data = await authService.register(name, email, password, role);
      dispatch({ type: 'REGISTER_SUCCESS', payload: data });
      return data; // Return the registration data
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: error instanceof Error ? error.message : 'Registration failed',
      });
      // Re-throw error for the component to handle
      throw error;
    }
  };

  const googleLogin = async () => {
    try {
      dispatch({ type: 'LOGIN_START' });
      // Redirect to Google OAuth endpoint
      window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/v1/auth/google`;
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : 'Google login failed',
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
