import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader } from './ui/Loader';
import { KycModal } from './KycModal';

export const KycRoute = ({ children }) => {
  const { kycVerified, isLoading } = useAuth();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  // If not verified, render children but with modal overlay
  return (
    <>
      {children}
      {!kycVerified && (
        <KycModal
          isOpen={true}
          onClose={() => {}} // no-op, user must verify
          onSuccess={() => {
            // onSuccess will trigger context update, modal will disappear
            // because kycVerified becomes true.
          }}
          disableClose={true} // prevent closing via backdrop/escape
        />
      )}
    </>
  );
};