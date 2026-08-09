import React, { createContext, useContext, useEffect, useState } from 'react';

const InstallPromptContext = createContext(null);

export const InstallPromptProvider = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    console.log('📦 InstallPromptProvider mounted');

    // Check if already running as installed PWA
    const checkStandalone = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

      console.log('📱 Standalone:', standalone);

      if (standalone) {
        setIsInstalled(true);
        setShowPrompt(false);
      }

      return standalone;
    };

    if (checkStandalone()) {
      return;
    }

    const handleBeforeInstallPrompt = (event) => {
      console.log('🚀 beforeinstallprompt FIRED');

      // Prevent Chrome from showing its own automatic prompt
      event.preventDefault();

      // Save the event
      setDeferredPrompt(event);

      // Show your custom install button/modal
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      console.log('✅ PWA installed');

      setDeferredPrompt(null);
      setShowPrompt(false);
      setIsInstalled(true);

      localStorage.removeItem('installPromptDismissed');
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );

    window.addEventListener('appinstalled', handleAppInstalled);

    console.log(
      '🛠️ beforeinstallprompt supported:',
      'onbeforeinstallprompt' in window
    );

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );

      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.warn('❌ No deferred install prompt available');
      return;
    }

    console.log('📲 Showing install prompt');

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    console.log('👤 Install choice:', outcome);

    if (outcome === 'accepted') {
      console.log('✅ User accepted installation');

      setShowPrompt(false);
      setDeferredPrompt(null);
      setIsInstalled(true);

      localStorage.removeItem('installPromptDismissed');
    } else {
      console.log('❌ User dismissed installation');

      setShowPrompt(false);
      localStorage.setItem('installPromptDismissed', 'true');
    }
  };

  const handleDismiss = () => {
    console.log('🗑️ Install prompt dismissed');

    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  return (
    <InstallPromptContext.Provider
      value={{
        deferredPrompt,
        showPrompt,
        isInstalled,
        handleInstall,
        handleDismiss,
      }}
    >
      {children}
    </InstallPromptContext.Provider>
  );
};

export const useInstallPrompt = () => {
  const context = useContext(InstallPromptContext);

  if (!context) {
    throw new Error(
      'useInstallPrompt must be used inside InstallPromptProvider'
    );
  }

  return context;
};