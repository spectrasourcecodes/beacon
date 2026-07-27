import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Eye, EyeOff, Save, ArrowLeft } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { authApi } from '../api/auth';
import { toast } from 'sonner';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.currentPassword) newErrors.currentPassword = 'Senha atual é obrigatória';
    if (!form.newPassword || form.newPassword.length < 6) {
      newErrors.newPassword = 'Nova senha deve ter pelo menos 6 caracteres';
    }
    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await authApi.updatePassword(form.currentPassword, form.newPassword);
      toast.success('Senha alterada com sucesso!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      navigate('/profile');
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao alterar senha';
      toast.error(msg);
      if (error.response?.data?.message?.toLowerCase().includes('atual')) {
        setErrors({ ...errors, currentPassword: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPasswords = () => setShowPasswords(!showPasswords);

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title="Configurações" />
      <div className="px-5 pt-6 max-w-md mx-auto">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Key className="h-5 w-5 text-primary" />
            <h2 className="text-h3 font-bold">Alterar Senha</h2>
          </div>
          <p className="text-label text-muted-foreground mb-4">
            Para sua segurança, insira sua senha atual e defina uma nova.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="currentPassword"
              name="currentPassword"
              type={showPasswords ? 'text' : 'password'}
              label="Senha Atual"
              placeholder="Digite sua senha atual"
              value={form.currentPassword}
              onChange={handleChange}
              error={errors.currentPassword}
              required
            />
            <Input
              id="newPassword"
              name="newPassword"
              type={showPasswords ? 'text' : 'password'}
              label="Nova Senha"
              placeholder="Digite a nova senha (mín. 6 caracteres)"
              value={form.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              required
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPasswords ? 'text' : 'password'}
              label="Confirmar Nova Senha"
              placeholder="Digite novamente a nova senha"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            <button
              type="button"
              onClick={toggleShowPasswords}
              className="text-small text-primary flex items-center gap-1"
            >
              {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPasswords ? 'Ocultar senhas' : 'Mostrar senhas'}
            </button>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/profile')}
                icon={<ArrowLeft className="h-4 w-4" />}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                icon={<Save className="h-4 w-4" />}
              >
                Salvar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;