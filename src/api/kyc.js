import api from './axios';

export const kycApi = {
  verifyKyc: async (code) => {
    const { data } = await api.post('/kyc/verify', { code });
    return data;
  },
};