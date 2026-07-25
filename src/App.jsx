import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import { KycGuardProvider } from './context/KycGuardContext';
import { LoadingProvider } from './context/LoadingContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WalletProvider>
          <KycGuardProvider>
            <LoadingProvider>
              <AppRoutes />
              <Toaster
                position="top-center"
                toastOptions={{
                  className: 'rounded-xl shadow-lg',
                  duration: 4000,
                }}
              />
            </LoadingProvider>
          </KycGuardProvider>
        </WalletProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;