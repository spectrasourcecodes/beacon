import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Phone, 
  Mail, 
  Shield, 
  LogOut,
  ChevronRight,
  Settings,
  HelpCircle,
  FileText
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado com sucesso');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const getInitials = () => {
    if (!user?.email) return '?';
    const names = user.email.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const menuItems = [
    { icon: User, label: 'Dados Pessoais', path: '/profile/edit' },
    { icon: Shield, label: 'Segurança', path: '/profile/security' },
    { icon: FileText, label: 'Termos e Condições', path: '/terms' },
    { icon: HelpCircle, label: 'Ajuda', path: '/support' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title="Perfil" />
      
      <div className="px-5 pt-6">
        {/* Profile Card */}
        <Card className="flex flex-col items-center p-6">
          <div className="h-20 w-20 rounded-full bg-primary-soft text-primary flex items-center justify-center text-display font-bold">
            {getInitials()}
          </div>
          <h2 className="text-h2 font-bold mt-4">{user?.email || 'Usuário'}</h2>
          <p className="text-label text-muted-foreground">@{user?.username || 'username'}</p>
          
          <div className="w-full mt-4 pt-4 border-t border-divider space-y-2">
            <div className="flex items-center gap-3 text-body">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">{user?.email || 'email@exemplo.com'}</span>
            </div>
            <div className="flex items-center gap-3 text-body">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">{user?.phone || '(00) 00000-0000'}</span>
            </div>
          </div>
        </Card>

        {/* Menu Items */}
        <div className="mt-6 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center justify-between p-4 bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-body font-medium">{item.label}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          fullWidth
          icon={<LogOut className="h-5 w-5" />}
          onClick={handleLogout}
          className="mt-6 text-destructive border-destructive/30 hover:bg-destructive/10"
        >
          Sair da Conta
        </Button>

        {/* App Version */}
        <p className="text-center text-small text-muted-foreground mt-6">
          Bmt Investimento v1.0.0
        </p>
      </div>
    </div>
  );
};