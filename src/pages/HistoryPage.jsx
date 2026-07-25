import React, { useState, useEffect } from 'react';
import { Inbox, ArrowUp, ArrowDown, TrendingUp, Coins } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Loader } from '../components/ui/Loader';
import { transactionApi } from '../api/transaction';
import { formatCurrency, formatDate } from '../utils/formatter';
import { clsx } from 'clsx';

export const HistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await transactionApi.getTransactions(50);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTransactions = () => {
    if (filter === 'all') return transactions;
    return transactions.filter(tx => {
      if (filter === 'investments') return tx.type === 'investment';
      if (filter === 'withdrawals') return tx.type === 'withdraw';
      if (filter === 'profits') return tx.type === 'investment_profit' || tx.type === 'daily_profit';
      return true;
    });
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'deposit': return <ArrowUp className="h-5 w-5 text-success" />;
      case 'withdraw': return <ArrowDown className="h-5 w-5 text-destructive" />;
      case 'investment': return <Coins className="h-5 w-5 text-primary" />;
      case 'investment_profit':
      case 'daily_profit':
        return <TrendingUp className="h-5 w-5 text-primary" />;
      default: return <TrendingUp className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTransactionLabel = (type) => {
    switch(type) {
      case 'deposit': return 'Depósito';
      case 'withdraw': return 'Saque';
      case 'investment': return 'Investimento';
      case 'investment_profit': return 'Lucro de Investimento';
      case 'daily_profit': return 'Lucro Diário';
      default: return type;
    }
  };

  const getTransactionColor = (type) => {
    if (type === 'withdraw') return 'text-destructive';
    if (type === 'deposit' || type === 'investment' || type === 'investment_profit' || type === 'daily_profit') return 'text-success';
    return 'text-muted-foreground';
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title="Histórico" />
      
      {/* Filter Tabs */}
      <div className="px-5 pt-4">
        <div className="flex gap-2 bg-muted rounded-xl p-1">
          {[
            { value: 'all', label: 'Todos' },
            { value: 'investments', label: 'Investimentos' },
            { value: 'withdrawals', label: 'Saques' },
            { value: 'profits', label: 'Lucros' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={clsx(
                'flex-1 py-2 px-4 rounded-lg text-label font-medium transition-all',
                filter === tab.value
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="px-5 mt-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-12 w-12 text-muted-foreground" />}
            message="Nenhuma transação encontrada"
            subMessage={filter === 'all' ? 'Suas transações aparecerão aqui' : 'Nenhuma transação com este filtro'}
          />
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx) => (
              <Card key={tx._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    'h-10 w-10 rounded-full flex items-center justify-center',
                    tx.type === 'withdraw' ? 'bg-destructive/10' : 'bg-success/10'
                  )}>
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <p className="text-body-strong font-semibold">
                      {getTransactionLabel(tx.type)}
                    </p>
                    <p className="text-small text-muted-foreground">
                      {formatDate(tx.createdAt)}
                    </p>
                    {tx.meta?.description && (
                      <p className="text-small text-muted-foreground truncate max-w-[200px]">
                        {tx.meta.description}
                      </p>
                    )}
                  </div>
                </div>
                <span className={clsx(
                  'font-semibold tabular-nums',
                  getTransactionColor(tx.type)
                )}>
                  {tx.type === 'withdraw' ? '- ' : '+ '}{formatCurrency(tx.amount)}
                </span>
              </Card>
            ))}
            
            {filteredTransactions.length === 50 && (
              <p className="text-center text-small text-muted-foreground py-4">
                Mostrando últimas 50 transações
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};