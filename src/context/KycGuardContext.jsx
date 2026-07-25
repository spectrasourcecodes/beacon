import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { KycModal } from '../components/KycModal';

const KycGuardContext = createContext(null);

export const KycGuardProvider = ({ children }) => {
  const { kycVerified } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const triggerWithdraw = useCallback((action) => {
    if (kycVerified) {
      // If already verified, execute the action immediately
      action();
    } else {
      // Otherwise, store the action and show the modal
      setPendingAction(() => action);
      setShowModal(true);
    }
  }, [kycVerified]);

  const handleKycSuccess = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  return (
    <KycGuardContext.Provider value={{ triggerWithdraw }}>
      {children}
      <KycModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setPendingAction(null);
        }}
        onSuccess={handleKycSuccess}
      />
    </KycGuardContext.Provider>
  );
};

export const useKycGuard = () => {
  const context = useContext(KycGuardContext);
  if (!context) throw new Error('useKycGuard must be used within a KycGuardProvider');
  return context;
};