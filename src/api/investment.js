import api from './axios';

export const investmentApi = {
  getPlans: async () => {
    const { data } = await api.get('/investments/plans');
    return data.plans;
  },
  createInvestment: async (payload) => {
    const { data } = await api.post('/investments', payload);
    return data;
  },
};