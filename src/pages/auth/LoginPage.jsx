import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { IconPill } from '../../components/shared/IconPill';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
// 👇 import the new component
import { InstallPrompt } from '../../components/shared/InstallPrompt';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success('Bem-vindo de volta!');
      if (data.user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const telegramSupport = import.meta.env.VITE_TELEGRAM_SUPPORT_LINK;

  return (
    <div className="min-h-screen bg-card flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm flex flex-col items-center">
        <IconPill icon={Landmark} />
        <h1 className="text-h1 font-bold mt-6 text-center">Bem-vindo de volta</h1>
        <p className="text-body text-muted-foreground mt-2 text-center">
          Entre para acessar seus investimentos
        </p>

        <form onSubmit={handleSubmit} className="w-full mt-10 space-y-4">
          <Input
            id="email"
            type="email"
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            id="password"
            type="password"
            label="Senha"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={!email || !password}
          >
            Entrar
          </Button>
        </form>

        <Button
          variant="outline"
          fullWidth
          className="mt-3"
          onClick={() => navigate('/signup')}
        >
          Cadastrar
        </Button>

        <div className="w-full mt-6 space-y-3">
          <Button
            variant="telegram"
            fullWidth
            icon={<Send className="h-5 w-5" />}
            onClick={() => window.open(telegramSupport, '_blank')}
          >
            Suporte via Telegram
          </Button>
        </div>

        {/* 👇 Render the install prompt here */}
        <InstallPrompt />
      </div>
    </div>
  );
};