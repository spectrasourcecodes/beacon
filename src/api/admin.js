import api from './axios';

export const adminApi = {
  // Users
  getUsers: async () => {
    const { data } = await api.get('/admin/users');
    return data.users;
  },
  getUser: async (id) => {
    const { data } = await api.get(`/admin/users/${id}`);
    return data.user;
  },
  updateUser: async (id, userData) => {
    const { data } = await api.put(`/admin/users/${id}`, userData);
    return data.user;
  },

  // Wallets
  getWallets: async () => {
    const { data } = await api.get('/admin/wallets');
    return data.wallets;
  },
  updateWallet: async (id, walletData) => {
    const { data } = await api.put(`/admin/wallets/${id}`, walletData);
    return data.wallet;
  },

  // Plans
  getPlans: async () => {
    const { data } = await api.get('/admin/plans');
    return data.plans;
  },
  createPlan: async (planData) => {
    const { data } = await api.post('/admin/plans', planData);
    return data.plan;
  },
  updatePlan: async (id, planData) => {
    const { data } = await api.put(`/admin/plans/${id}`, planData);
    return data.plan;
  },
  deletePlan: async (id) => {
    const { data } = await api.delete(`/admin/plans/${id}`);
    return data;
  },
  getStats: async () => {
  const { data } = await api.get('/admin/stats');
  return data;
},
getRecentUsers: async () => {
  const { data } = await api.get('/admin/recent-users');
  return data.users;
},
getRecentTransactions: async () => {
  const { data } = await api.get('/admin/recent-transactions');
  return data.transactions;
},
getTransactions: async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const { data } = await api.get(`/admin/transactions?${query}`);
  return data.transactions;
},
};