import React from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '../ui/Button';
import { useInstallPrompt } from '../../context/InstallPromptContext';

export const InstallPrompt = () => {
  const {
    showPrompt,
    isInstalled,
    handleInstall,
    handleDismiss,
  } = useInstallPrompt();

  // Detect iOS
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !window.MSStream;

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Don't show if dismissed or event hasn't arrived
  if (!showPrompt) {
    return null;
  }

  // iOS
  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50">
        <div className="rounded-xl bg-white p-5 shadow-xl border">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-6 w-6" />

              <div>
                <h3 className="font-semibold">
                  Instale o App
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  Toque no ícone de compartilhar e selecione
                  "Adicionar à Tela de Início".
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <Button
            variant="primary"
            fullWidth
            className="mt-4"
            onClick={handleDismiss}
          >
            Entendi
          </Button>
        </div>
      </div>
    );
  }

  // Android / Chrome / Edge etc.
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="rounded-xl bg-white p-5 shadow-xl border">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Download className="h-6 w-6" />

            <div>
              <h3 className="font-semibold">
                Instale o App
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                Baixe o app e tenha acesso rápido e offline.
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Button
          variant="primary"
          fullWidth
          className="mt-4"
          onClick={handleInstall}
        >
          <Download className="h-5 w-5 mr-2" />
          Instalar
        </Button>
      </div>
    </div>
  );
};