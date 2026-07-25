import api from './axios';

export const walletApi = {
  getWallet: async () => {
    const { data } = await api.get('/wallet');
    return data;
  },
};