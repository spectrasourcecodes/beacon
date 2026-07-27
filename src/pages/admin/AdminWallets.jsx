import React, { useState, useEffect } from 'react';
import { Edit2, Check, X, Wallet, User, Mail, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { adminApi } from '../../api/admin';
import { formatCurrency } from '../../utils/formatter';
import { toast } from 'sonner';

export const AdminWallets = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getWallets();
      setWallets(data);
    } catch (error) {
      toast.error('Erro ao carregar carteiras');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const updated = await adminApi.updateWallet(id, updates);
      setWallets(wallets.map(w => w._id === id ? updated : w));
      setEditing(null);
      toast.success('Carteira atualizada');
    } catch (error) {
      toast.error('Erro ao atualizar carteira');
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <PageHeader title="Carteiras" />
      <div className="px-5 pt-6 pb-6">
        {loading ? (
          <Loader size="lg" fullScreen />
        ) : wallets.length === 0 ? (
          <EmptyState icon={<Wallet className="h-12 w-12" />} message="Nenhuma carteira" />
        ) : (
          <div className="space-y-3">
            {wallets.map((wallet) => {
              const isEditing = editing === wallet._id;
              const user = wallet.userId || { email: 'Unknown', username: 'unknown' };
              return (
                <Card key={wallet._id} className="p-4">
                  {isEditing ? (
                    <EditWalletForm wallet={wallet} onSave={handleUpdate} onCancel={() => setEditing(null)} />
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary-soft text-primary flex items-center justify-center text-xs font-bold">
                            {user.email?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="text-body-strong font-semibold">{user.email || 'Sem e-mail'}</p>
                            <p className="text-small text-muted-foreground">@{user.username || 'unknown'}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-3">
                          <div className="bg-muted rounded-lg p-2 text-center">
                            <p className="text-small text-muted-foreground">Saldo</p>
                            <p className="text-body-strong font-semibold text-primary">{formatCurrency(wallet.balance)}</p>
                          </div>
                          <div className="bg-muted rounded-lg p-2 text-center">
                            <p className="text-small text-muted-foreground">Lucro Investimento</p>
                            <p className="text-body-strong font-semibold text-success">{formatCurrency(wallet.investmentProfit)}</p>
                          </div>
                          <div className="bg-muted rounded-lg p-2 text-center">
                            <p className="text-small text-muted-foreground">Lucro Hoje</p>
                            <p className="text-body-strong font-semibold text-success">{formatCurrency(wallet.dailyProfit)}</p>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setEditing(wallet._id)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Edit Form (inline)
const EditWalletForm = ({ wallet, onSave, onCancel }) => {
  const [form, setForm] = useState({
    balance: wallet.balance,
    investmentProfit: wallet.investmentProfit,
    dailyProfit: wallet.dailyProfit,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(wallet._id, form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-label flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            Saldo
          </label>
          <input
            type="number"
            step="0.01"
            value={form.balance}
            onChange={(e) => setForm({ ...form, balance: parseFloat(e.target.value) || 0 })}
            className="w-full h-10 rounded-lg bg-input px-3 border border-border focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="text-label flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            Lucro Investimento
          </label>
          <input
            type="number"
            step="0.01"
            value={form.investmentProfit}
            onChange={(e) => setForm({ ...form, investmentProfit: parseFloat(e.target.value) || 0 })}
            className="w-full h-10 rounded-lg bg-input px-3 border border-border focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="text-label flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Lucro Hoje
          </label>
          <input
            type="number"
            step="0.01"
            value={form.dailyProfit}
            onChange={(e) => setForm({ ...form, dailyProfit: parseFloat(e.target.value) || 0 })}
            className="w-full h-10 rounded-lg bg-input px-3 border border-border focus:border-primary focus:outline-none"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" icon={<Check className="h-4 w-4" />}>
          Salvar
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel} icon={<X className="h-4 w-4" />}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default AdminWallets;