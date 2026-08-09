import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpFromLine,
  ArrowDownToLine,
  ArrowLeftRight, 
  Clock, 
  Headphones,
  Inbox 
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { useKycGuard } from '../context/KycGuardContext';
import { transactionApi } from '../api/transaction';
import { TopHeader } from '../components/layout/TopHeader';
import { StatCard } from '../components/shared/StatCard';
import { QuickAction } from '../components/shared/QuickAction';
import { SectionHeader } from '../components/shared/SectionHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { formatCurrency, formatDate } from '../utils/formatter';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { balance, investmentProfit, dailyProfit, isLoading: walletLoading, refreshWallet } = useWallet();
  const { triggerWithdraw } = useKycGuard();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user's initials for avatar
  const getInitials = () => {
    if (!user?.userName) return '?';
    const names = user.fullName.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Fetch recent transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactionApi.getTransactions(5);
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Refresh wallet when component mounts
  useEffect(() => {
    refreshWallet();
  }, []);

  const depositLink = import.meta.env.VITE_DEPOSIT_LINK;
  const telegramSupport = import.meta.env.VITE_TELEGRAM_SUPPORT_LINK;
  const quickActions = [
    { icon: ArrowDownToLine, label: 'Depositar', path: depositLink },
    { icon: ArrowUpFromLine, label: 'Transferir', path: '/withdraw' },
    { icon: Clock, label: 'Histórico', path: '/history' },
    { icon: Headphones, label: 'Suporte', path: telegramSupport },
  ];

  const comapanyName = 'Bmt Investmento';

  return (
    <div className="min-h-screen bg-background">
      {/* Green Header */}
      <TopHeader
        comapanyName={comapanyName} 
        userName={user?.username || 'Usuário'} 
        avatarLetter={getInitials()} 
        balance={balance} 
      />

      {/* Overlapping Stat Cards */}
      <div className="px-5 -mt-10">
        <div className="flex gap-3">
          <StatCard 
            label="Lucro de Investimento" 
            value={investmentProfit} 
          />
          <StatCard 
            label="Lucro de Hoje" 
            value={dailyProfit} 
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mt-6">
        <div className="flex justify-between">
          {quickActions.map((action) => {
          // Check if the path is an external URL (starts with http/https)
          const isExternal = action.path && action.path.startsWith('http');

          const handleClick = action.onClick || (() => {
            if (isExternal) {
              // Redirect to external URL (replace current page)
              window.location.href = action.path;
              // Or open in new tab:
              // window.open(action.path, '_blank');
            } else {
              navigate(action.path); // internal route
            }
          });

          return (
            <QuickAction
              key={action.label}
              icon={action.icon}
              label={action.label}
              onClick={handleClick}
            />
          );
        })}
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="px-5 mt-8">
        <SectionHeader 
          title="Transações Recentes" 
          linkText="Ver todas"
          onLinkClick={() => navigate('/history')}
        />
        <div className="mt-4">
          {loading || walletLoading ? (
            <div className="flex justify-center py-8">
              <Loader size="md" />
            </div>
          ) : transactions.length === 0 ? (
            <EmptyState 
              icon={<Inbox className="h-12 w-12 text-muted-foreground" />}
              message="Nenhuma transação recente"
              subMessage="Suas transações aparecerão aqui"
            />
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <Card key={tx._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary-soft flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">
                        {tx.type === 'withdraw' ? '↓' : tx.type === 'deposit' ? '↑' : '↗'}
                      </span>
                    </div>
                    <div>
                      <p className="text-body-strong font-semibold capitalize">
                        {tx.type === 'withdraw' ? 'Saque' : tx.type === 'deposit' ? 'Depósito' : 'Investimento'}
                      </p>
                      <p className="text-small text-muted-foreground">
                        {formatDate(tx.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className={clsx(
                    'font-semibold tabular-nums',
                    tx.type === 'withdraw' ? 'text-destructive' : 'text-success'
                  )}>
                    {tx.type === 'withdraw' ? '- ' : '+ '}{formatCurrency(tx.amount)}
                  </span>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom padding for nav */}
      <div className="h-8" />
    </div>
  );
};