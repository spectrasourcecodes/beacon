import React, { useState, useEffect } from 'react';
import { Edit2, Check, X, Users, Mail, Phone, Shield, UserCheck, UserX } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { adminApi } from '../../api/admin';
import { toast } from 'sonner';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const updated = await adminApi.updateUser(id, updates);
      setUsers(users.map(u => u._id === id ? updated : u));
      setEditing(null);
      toast.success('Usuário atualizado');
    } catch (error) {
      toast.error('Erro ao atualizar usuário');
    }
  };

  const toggleEdit = (user) => {
    setEditing(editing === user._id ? null : user._id);
  };

  return (
    <div className="bg-background min-h-screen">
      <PageHeader title="Usuários" />
      <div className="px-5 pt-6 pb-6">
        {loading ? (
          <Loader size="lg" fullScreen />
        ) : users.length === 0 ? (
          <EmptyState icon={<Users className="h-12 w-12" />} message="Nenhum usuário" />
        ) : (
          <div className="space-y-3">
            {users.map((user) => {
              const isEditing = editing === user._id;
              return (
                <Card key={user._id} className="p-4">
                  {isEditing ? (
                    <EditForm user={user} onSave={handleUpdate} onCancel={() => setEditing(null)} />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-body-strong font-semibold">{user.email}</p>
                        <p className="text-small text-muted-foreground">@{user.username}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${user.isAdmin ? 'bg-primary-soft text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {user.isAdmin ? 'Admin' : 'Usuário'}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${user.isActive ? 'bg-success-soft text-success' : 'bg-destructive-soft text-destructive'}`}>
                            {user.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${user.kycVerified ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'}`}>
                            {user.kycVerified ? 'KYC Verificado' : 'KYC Pendente'}
                          </span>
                          {user.kycCode && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              Código: {user.kycCode}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => toggleEdit(user)}>
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
const EditForm = ({ user, onSave, onCancel }) => {
  const [form, setForm] = useState({
    username: user.username || '',
    email: user.email || '',
    phone: user.phone || '',
    isAdmin: user.isAdmin || false,
    isActive: user.isActive !== undefined ? user.isActive : true,
    kycCode: user.kycCode || '',
    kycVerified: user.kycVerified || false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user._id, form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-label">Usuário</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full h-10 rounded-lg bg-input px-3 border border-border focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="text-label">E-mail</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full h-10 rounded-lg bg-input px-3 border border-border focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="text-label">Telefone</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full h-10 rounded-lg bg-input px-3 border border-border focus:border-primary focus:outline-none"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <label className="flex items-center gap-2 text-label">
          <input
            type="checkbox"
            checked={form.isAdmin}
            onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
          />
          Admin
        </label>
        <label className="flex items-center gap-2 text-label">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Ativo
        </label>
        <label className="flex items-center gap-2 text-label">
          <input
            type="checkbox"
            checked={form.kycVerified}
            onChange={(e) => setForm({ ...form, kycVerified: e.target.checked })}
          />
          KYC Verificado
        </label>
      </div>
      <div>
        <label className="text-label">Código KYC</label>
        <input
          type="text"
          value={form.kycCode}
          onChange={(e) => setForm({ ...form, kycCode: e.target.value })}
          placeholder="Digite o código KYC (ex: ABC123)"
          className="w-full h-10 rounded-lg bg-input px-3 border border-border focus:border-primary focus:outline-none"
        />
        <p className="text-small text-muted-foreground mt-1">
          Deixe em branco para remover o código.
        </p>
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

export default AdminUsers;