import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Key, LogOut, Save, Eye, EyeOff, Shield } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../api/admin';
import { authApi } from '../../api/auth';
import { toast } from 'sonner';

export const AdminProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminApi.updateUser(user._id, {
        username: profileForm.username,
        email: profileForm.email,
        phone: profileForm.phone,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        kycCode: user.kycCode || '',
        kycVerified: user.kycVerified || false,
      });
      toast.success('Perfil atualizado com sucesso');
      window.location.reload();
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    setPasswordLoading(true);
    try {
      await authApi.updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Senha atualizada com sucesso');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar senha');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="bg-background min-h-screen">
      <PageHeader title="Meu Perfil" />
      <div className="px-5 pt-6 pb-6 max-w-2xl mx-auto">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-16 w-16 rounded-full bg-primary-soft text-primary flex items-center justify-center text-2xl font-bold">
              {user?.email?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-body-strong font-semibold">{user?.email}</p>
              <p className="text-small text-muted-foreground">@{user?.username}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-soft text-primary">Admin</span>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <Input
              label="Usuário"
              type="text"
              value={profileForm.username}
              onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
              icon={<User className="h-5 w-5 text-muted-foreground" />}
            />
            <Input
              label="E-mail"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              icon={<Mail className="h-5 w-5 text-muted-foreground" />}
            />
            <Input
              label="Telefone"
              type="tel"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              icon={<Phone className="h-5 w-5 text-muted-foreground" />}
            />
            <Button type="submit" fullWidth loading={loading} icon={<Save className="h-5 w-5" />}>
              Atualizar Perfil
            </Button>
          </form>
        </Card>

        <Card className="p-5 mt-4">
          <h2 className="text-h3 font-bold mb-4">Alterar Senha</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <Input
              label="Senha Atual"
              type={showPassword ? 'text' : 'password'}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
            />
            <Input
              label="Nova Senha"
              type={showPassword ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
            />
            <Input
              label="Confirmar Nova Senha"
              type={showPassword ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-small text-primary flex items-center gap-1"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPassword ? 'Ocultar senhas' : 'Mostrar senhas'}
            </button>
            <Button type="submit" fullWidth loading={passwordLoading} variant="outline">
              Alterar Senha
            </Button>
          </form>
        </Card>

        <Button
          variant="outline"
          fullWidth
          className="mt-4 text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleLogout}
          icon={<LogOut className="h-5 w-5" />}
        >
          Sair da Conta
        </Button>
      </div>
    </div>
  );
};

export default AdminProfile;