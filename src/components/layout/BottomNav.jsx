import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, Clock, TrendingUp, User, ArrowUpFromLine } from 'lucide-react';
import { clsx } from 'clsx';
import { useKycGuard } from '../../context/KycGuardContext';

const navItems = [
  { path: '/', label: 'Início', icon: Home },
  { path: '/history', label: 'Histórico', icon: Clock },
  { path: '/withdraw', label: 'Sacar', icon: ArrowUpFromLine, fab: true },
  { path: '/invest', label: 'Investir', icon: TrendingUp },
  { path: '/profile', label: 'Perfil', icon: User },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { triggerWithdraw } = useKycGuard();

  const handleFabClick = () => {
    triggerWithdraw(() => navigate('/withdraw'));
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-card shadow-lg safe-bottom">
      <div className="relative flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.fab) {
            return (
              <button
                key={item.path}
                onClick={handleFabClick}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-8"
                aria-label="Sacar"
              >
                <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-fab flex items-center justify-center hover:brightness-95 active:scale-[0.94] transition-all">
                  <Icon className="h-7 w-7" strokeWidth={2} />
                </div>
              </button>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={clsx(
                'flex flex-col items-center justify-center gap-0.5 pt-1',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-6 w-6" strokeWidth={2} />
              <span className="text-caption font-medium">{item.label}</span>
              {isActive && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};