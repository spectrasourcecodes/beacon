// client/src/api/auth.js
import api from './axios';

export const authApi = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    return data;
  },
  signup: async (userData) => {
    const { data } = await api.post('/auth/signup', userData);
    localStorage.setItem('token', data.token);
    return data;
  },
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
  updatePassword: async (currentPassword, newPassword) => {
    const { data } = await api.put('/auth/password', { currentPassword, newPassword });
    return data;
  },
};