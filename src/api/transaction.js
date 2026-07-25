import api from './axios';

export const transactionApi = {
  getTransactions: async (limit = 10) => {
    const { data } = await api.get(`/transactions?limit=${limit}`);
    return data.transactions;
  },
};