import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const { data } = await API.get('/auth/me');
          setUser(data.user);
          setOnboardingCompleted(data.onboardingCompleted);
          localStorage.setItem('user', JSON.stringify(data.user));
        } catch (err) {
          console.error("Auth check failed:", err.message);
          logout();
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    setToken(data.token);
    setUser(data);
    setOnboardingCompleted(data.onboardingCompleted);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password, role = 'user') => {
    const { data } = await API.post('/auth/register', { name, email, password, role });
    setToken(data.token);
    setUser(data);
    setOnboardingCompleted(false);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setToken('');
    setUser(null);
    setOnboardingCompleted(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateOnboardingStatus = (status) => {
    setOnboardingCompleted(status);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      onboardingCompleted,
      login,
      register,
      logout,
      updateOnboardingStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
