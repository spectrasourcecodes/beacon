import React, { useState, useEffect } from 'react';
import { Edit2, Check, X, Plus, Trash2, TrendingUp } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { adminApi } from '../../api/admin';
import { formatCurrency } from '../../utils/formatter';
import { toast } from 'sonner';

export const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getPlans();
      setPlans(data);
    } catch (error) {
      toast.error('Erro ao carregar planos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (planData) => {
    try {
      const created = await adminApi.createPlan(planData);
      setPlans([...plans, created]);
      setCreating(false);
      toast.success('Plano criado');
    } catch (error) {
      toast.error('Erro ao criar plano');
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const updated = await adminApi.updatePlan(id, updates);
      setPlans(plans.map(p => p._id === id ? updated : p));
      setEditing(null);
      toast.success('Plano atualizado');
    } catch (error) {
      toast.error('Erro ao atualizar plano');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este plano?')) return;
    try {
      await adminApi.deletePlan(id);
      setPlans(plans.filter(p => p._id !== id));
      toast.success('Plano excluído');
    } catch (error) {
      toast.error('Erro ao excluir plano');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title="Planos de Investimento" />
      <div className="px-5 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-h3 font-bold">Gerenciar Planos</h2>
          <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setCreating(true)}>
            Novo Plano
          </Button>
        </div>

        {loading ? (
          <Loader size="lg" fullScreen />
        ) : plans.length === 0 ? (
          <EmptyState icon={<TrendingUp className="h-12 w-12" />} message="Nenhum plano" />
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => {
              const isEditing = editing === plan._id;
              return (
                <Card key={plan._id} className="p-4">
                  {isEditing ? (
                    <EditPlanForm plan={plan} onSave={handleUpdate} onCancel={() => setEditing(null)} />
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-body-strong font-semibold">{plan.name}</p>
                        <p className="text-small text-muted-foreground">{plan.description}</p>
                        <div className="flex flex-wrap gap-3 mt-1">
                          <span className="text-label">Mín: <span className="font-semibold">{formatCurrency(plan.minAmount)}</span></span>
                          <span className="text-label">Diário: <span className="font-semibold text-primary">{plan.dailyReturn}%</span></span>
                          <span className="text-label">Duração: <span className="font-semibold">{plan.durationDays} dias</span></span>
                          <span className="text-label">Total: <span className="font-semibold text-success">{plan.totalReturn}%</span></span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${plan.isActive ? 'bg-success-soft text-success' : 'bg-destructive-soft text-destructive'}`}>
                            {plan.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => setEditing(plan._id)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(plan._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {creating && (
          <div className="mt-4">
            <Card className="p-4">
              <h3 className="text-h3 font-bold mb-3">Novo Plano</h3>
              <CreatePlanForm onSave={handleCreate} onCancel={() => setCreating(false)} />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

const EditPlanForm = ({ plan, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: plan.name,
    description: plan.description || '',
    minAmount: plan.minAmount,
    dailyReturn: plan.dailyReturn,
    durationDays: plan.durationDays,
    totalReturn: plan.totalReturn,
    isActive: plan.isActive,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(plan._id, form);
  };

  return <PlanForm form={form} setForm={setForm} onSubmit={handleSubmit} onCancel={onCancel} />;
};

const CreatePlanForm = ({ onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    minAmount: 50,
    dailyReturn: 1.5,
    durationDays: 30,
    totalReturn: 45,
    isActive: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return <PlanForm form={form} setForm={setForm} onSubmit={handleSubmit} onCancel={onCancel} />;
};

const PlanForm = ({ form, setForm, onSubmit, onCancel }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-label">Nome</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full h-10 rounded-lg bg-input px-3 border border-border focus:border-primary focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="text-label">Descrição</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full h-10 rounded-lg bg-input px-3 border border-border focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="text-label">Valor Mínimo</label>
          <input
            type="number"
            step="0.01"
            value={form.minAmount}
            onChange={(e) => setForm({ ...form, minAmount: parseFloat(e.target.value) })}
            className="w-full h-10 rounded-lg bg-input px-3 border border-border focus:border-primary focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="text-label">Rendimento Diário (%)</label>
          <input
            type="number"
            step="0.1"
            value={form.dailyReturn}
            onChange={(e) => setForm({ ...form, dailyReturn: parseFloat(e.target.value) })}
            className="w-full h-10 rounded-lg bg-input px-3 border border-border focus:border-primary focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="text-label">Duração (dias)</label>
          <input
            type="number"
            value={form.durationDays}
            onChange={(e) => setForm({ ...form, durationDays: parseInt(e.target.value) })}
            className="w-full h-10 rounded-lg bg-input px-3 border border-border focus:border-primary focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="text-label">Rendimento Total (%)</label>
          <input
            type="number"
            step="0.1"
            value={form.totalReturn}
            onChange={(e) => setForm({ ...form, totalReturn: parseFloat(e.target.value) })}
            className="w-full h-10 rounded-lg bg-input px-3 border border-border focus:border-primary focus:outline-none"
            required
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Ativo
        </label>
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

export default AdminPlans;