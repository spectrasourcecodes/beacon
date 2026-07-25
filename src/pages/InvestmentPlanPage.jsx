import React, { useState, useEffect } from 'react';
import { TrendingUp, Coins, Calendar, Percent, X } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { EmptyState } from '../components/ui/EmptyState';
import { investmentApi } from '../api/investment';
import { useLoading } from '../context/LoadingContext';
import { useWallet } from '../context/WalletContext';
import { formatCurrency } from '../utils/formatter';
import { toast } from 'sonner';

export const InvestmentPlanPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setIsLoading } = useLoading(); // for global overlay, but we'll also use local loading for modal
  const { refreshWallet } = useWallet();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await investmentApi.getPlans();
      setPlans(data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
    setConfirmLoading(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPlan(null);
    setConfirmLoading(false);
  };

  const handleConfirm = async () => {
    if (!selectedPlan) return;
    setConfirmLoading(true);
    try {
      await investmentApi.createInvestment({ planId: selectedPlan._id, amount: selectedPlan.minAmount });
      toast.success(`Investimento de R$ ${formatCurrency(selectedPlan.minAmount)} realizado!`);
      await refreshWallet();
      closeModal();
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao realizar investimento';
      toast.error(msg);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title="Investir" />
      <div className="px-5 pt-6">
        <h2 className="text-h2 font-bold">Escolha seu plano</h2>
        <p className="text-body text-muted-foreground mt-1">
          Invista com segurança e obtenha rendimentos diários
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : plans.length === 0 ? (
          <EmptyState
            icon={<Coins className="h-12 w-12 text-muted-foreground" />}
            message="Nenhum plano disponível"
          />
        ) : (
          <div className="space-y-4 mt-6">
            {plans.map((plan) => (
              <Card key={plan._id} className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <h3 className="text-h3 font-bold">{plan.name}</h3>
                    </div>
                    <p className="text-label text-muted-foreground mt-1">{plan.description}</p>
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-muted-foreground" />
                        <span className="text-small">
                          <span className="font-semibold">Mín:</span> {formatCurrency(plan.minAmount)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        <span className="text-small">
                          <span className="font-semibold">Diário:</span> {plan.dailyReturn}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-small">
                          <span className="font-semibold">Duração:</span> {plan.durationDays} dias
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-success-soft rounded-lg">
                      <span className="text-small font-semibold text-success">
                        Rendimento total: {plan.totalReturn}%
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openModal(plan)}
                    className="ml-4 flex-shrink-0"
                  >
                    Investir
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal – always rendered, hidden via CSS */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
          modalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative bg-card rounded-2xl shadow-modal max-w-md w-full mx-4 p-6">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>

          <h2 className="text-h3 font-bold mb-2">Confirmar Investimento</h2>
          {selectedPlan && (
            <>
              <div className="bg-primary-soft rounded-xl p-4 mt-2">
                <p className="text-label text-muted-foreground">Plano escolhido</p>
                <p className="text-h3 font-bold">{selectedPlan.name}</p>
                <p className="text-small text-muted-foreground">{selectedPlan.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="text-muted-foreground">Rendimento diário</p>
                  <p className="text-body-strong font-semibold text-primary">{selectedPlan.dailyReturn}%</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="text-muted-foreground">Duração</p>
                  <p className="text-body-strong font-semibold">{selectedPlan.durationDays} dias</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-success-soft rounded-lg text-center">
                <span className="text-small font-semibold text-success">
                  Valor: {formatCurrency(selectedPlan.minAmount)}
                </span>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={closeModal}
                  disabled={confirmLoading}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleConfirm}
                  loading={confirmLoading}
                  disabled={confirmLoading}
                >
                  Confirmar
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};