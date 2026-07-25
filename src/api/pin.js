import api from './axios';

export const pinApi = {
  createPin: async (pin) => {
    const { data } = await api.post('/pin', { pin });
    return data;
  },

  verifyPin: async (pin) => {
    const { data } = await api.post('/pin/verify', { pin });
    return data;
  },
};