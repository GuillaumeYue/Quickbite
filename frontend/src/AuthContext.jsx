import { createContext, useContext, useEffect, useState } from 'react';
import api from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/auth/me').then(function(res) {
      setUser(res.data.user);
      setLoading(false);
    }).catch(function() {
      localStorage.removeItem('token');
      setLoading(false);
    });
  }, []);

  async function login(email, password) {
    const res = await api.post('/auth/login', { email: email, password: password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  }

  async function register(name, email, password) {
    const res = await api.post('/auth/signup', { name: name, email: email, password: password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  const value = {
    user: user,
    loading: loading,
    login: login,
    register: register,
    logout: logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
