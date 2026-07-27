import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  ArrowRight, 
  User,
  DollarSign,
  Clock,
  CheckCircle,
  Receipt,
  Coins
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { adminApi } from '../../api/admin';
import { formatCurrency, formatDate } from '../../utils/formatter';
import { clsx } from 'clsx';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, transactionsData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getRecentUsers(5),
        adminApi.getRecentTransactions(5),
      ]);
      setStats(statsData);
      setRecentUsers(usersData);
      setRecentTransactions(transactionsData);
    } catch (error) {
      toast.error('Erro ao carregar dados do dashboard');
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  const statCards = [
    { title: 'Usuários', value: stats?.totalUsers || 0, icon: Users, color: 'bg-primary-soft text-primary', path: '/admin/users' },
    { title: 'Carteiras', value: stats?.totalWallets || 0, icon: Wallet, color: 'bg-info/10 text-info', path: '/admin/wallets' },
    { title: 'Transações', value: stats?.totalTransactions || 0, icon: Receipt, color: 'bg-success-soft text-success', path: '/admin/transactions' },
    { title: 'Saldo Total', value: formatCurrency(stats?.totalBalance || 0), icon: DollarSign, color: 'bg-warning-soft text-warning', path: '/admin/wallets' },
    { title: 'Saques Pendentes', value: stats?.pendingWithdrawals || 0, icon: Clock, color: 'bg-destructive-soft text-destructive', path: '/admin/transactions?status=pending' },
    { title: 'Investimentos Ativos', value: stats?.activeInvestments || 0, icon: Coins, color: 'bg-primary-soft text-primary', path: '/admin/transactions?type=investment' },
  ];

  return (
    <div className="bg-background min-h-screen">
      <PageHeader title="Admin Dashboard" />
      <div className="px-5 pt-6 pb-6">
        <h2 className="text-h2 font-bold">Visão Geral</h2>
        <p className="text-body text-muted-foreground mt-1">
          Resumo da plataforma
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
          {statCards.map((stat) => (
            <Link key={stat.title} to={stat.path} className="block">
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-h3 font-bold mt-2">{stat.value}</p>
                <p className="text-small text-muted-foreground">{stat.title}</p>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Users & Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-h3 font-bold">Novos Usuários</h3>
              <Link to="/admin/users" className="text-label text-primary hover:underline">
                Ver todos
              </Link>
            </div>
            <div className="space-y-2">
              {recentUsers.length === 0 ? (
                <p className="text-small text-muted-foreground">Nenhum usuário recente</p>
              ) : (
                recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-3 bg-card rounded-xl shadow-sm border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary-soft text-primary flex items-center justify-center text-xs font-bold">
                        {user.email?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{user.email}</p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(user.createdAt)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-h3 font-bold">Transações Recentes</h3>
              <Link to="/admin/transactions" className="text-label text-primary hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="space-y-2">
              {recentTransactions.length === 0 ? (
                <p className="text-small text-muted-foreground">Nenhuma transação recente</p>
              ) : (
                recentTransactions.map((tx) => {
                  const user = tx.userId || { email: 'Unknown', username: 'unknown' };
                  return (
                    <div key={tx._id} className="flex items-center justify-between p-3 bg-card rounded-xl shadow-sm border border-border">
                      <div>
                        <p className="text-sm font-semibold">{user.email}</p>
                        <p className="text-xs text-muted-foreground">{tx.type} • {formatDate(tx.createdAt)}</p>
                      </div>
                      <span className={clsx(
                        'text-sm font-semibold',
                        tx.type === 'withdraw' ? 'text-destructive' : 'text-success'
                      )}>
                        {tx.type === 'withdraw' ? '- ' : '+ '}{formatCurrency(tx.amount)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;