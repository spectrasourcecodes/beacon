import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, Send, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { IconPill } from '../components/shared/IconPill';
import { kycApi } from '../api/kyc';
import { toast } from 'sonner';

export const PinPage = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    setPin(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (pin.length < 4) {
      setError('Mínimo 4 dígitos');
      return;
    }

    setLoading(true);
    try {
      // Verify the PIN against the user's kycCode
      await kycApi.verifyKyc(pin);
      toast.success('PIN verificado com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error('PIN inválido');
    } finally {
      setLoading(false);
    }
  };

  const telegramSupport = import.meta.env.VITE_TELEGRAM_SUPPORT_LINK;
  const whatsappSupport = import.meta.env.VITE_WHATSSAPP_SUPPORT_LINK;

  const isValid = pin.length >= 4 && /^\d+$/.test(pin);

  return (
    <div className="min-h-screen bg-card pb-32">
      {/* Back button */}
      <div className="px-5 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="text-body font-medium">Voltar</span>
        </button>
      </div>

      <div className="px-5 pt-4 flex flex-col items-center max-w-sm mx-auto">
        <IconPill icon={Shield} />
        
        <h1 className="text-h1 font-bold mt-6 text-center">
          Verificar PIN de Segurança
        </h1>
        
        <p className="text-body text-muted-foreground text-center mt-2">
          Insira o PIN de 4 dígitos fornecido pelo administrador para verificar sua identidade.
        </p>

        <form onSubmit={handleSubmit} className="w-full mt-8">
          <Input
            id="pin"
            type="pin"
            label="Seu PIN (4 dígitos)"
            placeholder="• • • •"
            value={pin}
            onChange={handlePinChange}
            error={error}
            maxLength={8}
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="mt-6"
            loading={loading}
            disabled={!isValid || loading}
          >
            {isValid ? 'Verificar PIN' : 'Verificar PIN'}
          </Button>
        </form>

        <div className="w-full mt-6 space-y-3">
          <Button
            variant="telegram"
            fullWidth
            icon={<Send className="h-5 w-5" />}
            onClick={() => window.open(telegramSupport, '_blank')}
          >
            Suporte via Telegram
          </Button>
          
          <Button
            variant="whatsapp"
            fullWidth
            icon={<MessageCircle className="h-5 w-5" />}
            onClick={() => window.open(whatsappSupport, '_blank')}
          >
            Suporte via WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};