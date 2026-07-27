import React, { useState, useEffect } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  TrendingUp, 
  Coins, 
  Search, 
  Filter, 
  Calendar,
  Inbox,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { adminApi } from '../../api/admin';
import { formatCurrency, formatDate } from '../../utils/formatter';
import { clsx } from 'clsx';
import { toast } from 'sonner';

const transactionTypes = [
  { value: '', label: 'Todos' },
  { value: 'deposit', label: 'Depósito' },
  { value: 'withdraw', label: 'Saque' },
  { value: 'investment', label: 'Investimento' },
  { value: 'investment_profit', label: 'Lucro Inv.' },
  { value: 'daily_profit', label: 'Lucro Diário' },
  { value: 'transfer', label: 'Transferência' },
];

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendente' },
  { value: 'completed', label: 'Concluído' },
  { value: 'failed', label: 'Falhou' },
  { value: 'reversed', label: 'Reversão' },
];

export const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
  });
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getTransactions(filters);
      setTransactions(data);
    } catch (error) {
      toast.error('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRows(newSet);
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
      case 'transfer': return 'Transferência';
      default: return type;
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      pending: 'bg-warning-soft text-warning',
      completed: 'bg-success-soft text-success',
      failed: 'bg-destructive-soft text-destructive',
      reversed: 'bg-muted text-muted-foreground',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${classes[status] || 'bg-muted text-muted-foreground'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-background min-h-screen">
      <PageHeader title="Transações" />
      <div className="px-5 pt-6 pb-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 bg-card rounded-xl px-3 py-2 shadow-sm border border-border">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="bg-transparent border-0 outline-none text-sm"
            >
              {transactionTypes.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-card rounded-xl px-3 py-2 shadow-sm border border-border">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="bg-transparent border-0 outline-none text-sm"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <Loader size="lg" fullScreen />
        ) : transactions.length === 0 ? (
          <EmptyState icon={<Inbox className="h-12 w-12" />} message="Nenhuma transação encontrada" />
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const isExpanded = expandedRows.has(tx._id);
              const user = tx.userId || { email: 'Unknown', username: 'unknown' };
              return (
                <Card key={tx._id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className={clsx(
                          'h-10 w-10 rounded-full flex items-center justify-center',
                          tx.type === 'withdraw' ? 'bg-destructive/10' : 'bg-success/10'
                        )}>
                          {getTransactionIcon(tx.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-body-strong font-semibold">
                              {getTransactionLabel(tx.type)}
                            </span>
                            {getStatusBadge(tx.status)}
                          </div>
                          <div className="flex items-center gap-3 text-small text-muted-foreground">
                            <span>{user.email}</span>
                            <span>@{user.username}</span>
                            <span>{formatDate(tx.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={clsx(
                        'font-semibold tabular-nums',
                        tx.type === 'withdraw' ? 'text-destructive' : 'text-success'
                      )}>
                        {tx.type === 'withdraw' ? '- ' : '+ '}{formatCurrency(tx.amount)}
                      </span>
                      <button
                        onClick={() => toggleExpand(tx._id)}
                        className="p-1 rounded-full hover:bg-muted"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-divider grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">ID:</span>
                        <span className="ml-1 font-mono text-xs">{tx._id}</span>
                      </div>
                      {tx.referenceId && (
                        <div>
                          <span className="text-muted-foreground">Referência:</span>
                          <span className="ml-1 font-mono text-xs">{tx.referenceId}</span>
                        </div>
                      )}
                      {tx.referenceModel && (
                        <div>
                          <span className="text-muted-foreground">Modelo:</span>
                          <span className="ml-1">{tx.referenceModel}</span>
                        </div>
                      )}
                      {tx.meta && Object.keys(tx.meta).length > 0 && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Metadados:</span>
                          <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                            {JSON.stringify(tx.meta, null, 2)}
                          </pre>
                        </div>
                      )}
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

export default AdminTransactions;