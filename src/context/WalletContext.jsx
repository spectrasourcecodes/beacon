import React, { createContext, useState, useContext, useEffect } from 'react';
import { walletApi } from '../api/wallet';
import { useAuth } from './AuthContext';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(0);
  const [investmentProfit, setInvestmentProfit] = useState(0);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWallet = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const data = await walletApi.getWallet();
      setBalance(data.balance);
      setInvestmentProfit(data.investmentProfit);
      setDailyProfit(data.dailyProfit);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWallet();
    } else {
      setBalance(0);
      setInvestmentProfit(0);
      setDailyProfit(0);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const refreshWallet = fetchWallet;

  return (
    <WalletContext.Provider value={{ balance, investmentProfit, dailyProfit, isLoading, refreshWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within a WalletProvider');
  return context;
};