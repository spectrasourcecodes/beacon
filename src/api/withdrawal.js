import api from './axios';

export const withdrawalApi = {
  createWithdrawal: async (withdrawalData) => {
    const { data } = await api.post('/withdraw', withdrawalData);
    return data;
  },

  getWithdrawals: async () => {
    const { data } = await api.get('/withdraw');
    return data.withdrawals;
  },
};