import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case 'LOGOUT':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case 'UPDATE_USER':
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get('/auth/me');
      dispatch({
        type: 'USER_LOADED',
        payload: res.data,
      });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL' });
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data,
      });
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Response data:', error.response?.data);
      
      let message = 'Registration failed';
      
      if (error.response?.data) {
        if (error.response.data.msg) {
          message = error.response.data.msg;
        } else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          // Handle validation errors
          message = error.response.data.errors.map(err => err.message || err.msg).join(', ');
        } else if (error.response.data.error) {
          message = error.response.data.error;
        }
      } else if (error.message) {
        message = error.message;
      }
      
      dispatch({ type: 'REGISTER_FAIL' });
      return { success: false, message };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
      });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Response data:', error.response?.data);
      
      let message = 'Login failed';
      
      // Handle network errors specifically
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error' || !error.response) {
        message = 'Cannot connect to server. Please try again later.';
      } else if (error.response?.data) {
        if (error.response.data.msg) {
          message = error.response.data.msg;
        } else if (error.response.data.error) {
          message = error.response.data.error;
        } else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          // Handle validation errors
          message = error.response.data.errors.map(err => err.message || err.msg).join(', ');
        }
      } else if (error.message) {
        message = error.message;
      }
      
      dispatch({ type: 'LOGIN_FAIL' });
      return { success: false, message };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: userData,
    });
  };

  const value = {
    ...state,
    register,
    login,
    logout,
    loadUser,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

