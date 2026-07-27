import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  TrendingUp, 
  User, 
  LogOut, 
  Menu, 
  X,
  Shield,
  Receipt
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext'; // ✅ correct import
import { toast } from 'sonner';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Usuários', icon: Users },
  { path: '/admin/wallets', label: 'Carteiras', icon: Wallet },
  { path: '/admin/transactions', label: 'Transações', icon: Receipt },
  { path: '/admin/plans', label: 'Planos', icon: TrendingUp },
  { path: '/admin/profile', label: 'Meu Perfil', icon: User },
];

export const AdminLayout = () => {
  const { user, logout } = useAuth(); // ✅ now defined
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logout realizado com sucesso');
    navigate('/login');
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const closeDrawer = () => setDrawerOpen(false);

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={closeDrawer}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
              isActive 
                ? 'bg-primary-soft text-primary font-semibold' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200 w-full mt-4"
      >
        <LogOut className="h-5 w-5" />
        <span>Sair</span>
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0 p-4">
        <div className="flex items-center gap-2 mb-6 px-4">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-h3 font-bold">Admin</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1">
          <NavLinks />
        </div>
        <div className="pt-4 border-t border-divider">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="h-8 w-8 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold text-sm">
              {user?.email?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground truncate">@{user?.username}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <div
        className={clsx(
          'fixed inset-0 z-50 bg-black/50 transition-opacity duration-200 md:hidden',
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeDrawer}
      />
      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 h-full w-72 bg-card shadow-lg transition-transform duration-200 md:hidden',
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-divider">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-h3 font-bold">Admin</span>
          </div>
          <button onClick={closeDrawer} className="p-2 rounded-full hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-80px)]">
          <NavLinks />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-card border-b border-border md:hidden flex items-center justify-between px-4 py-3">
          <button onClick={toggleDrawer} className="p-2 rounded-full hover:bg-muted">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-body-strong font-semibold">Admin</span>
          </div>
          <div className="w-10" />
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border safe-bottom">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'flex flex-col items-center gap-0.5 pt-1',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};