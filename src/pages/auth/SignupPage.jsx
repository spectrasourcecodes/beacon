import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Nome completo é obrigatório';
    if (!formData.phone || formData.phone.length < 10) newErrors.phone = 'Telefone inválido';
    if (!formData.username.trim() || formData.username.length < 3) newErrors.username = 'Usuário deve ter pelo menos 3 caracteres';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await signup(formData);
      toast.success('Conta criada com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-card">
      {/* Header with back button */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-divider">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 -ml-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Voltar"
        >
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>
        <h1 className="text-h3 font-bold">Criar Conta</h1>
      </div>

      <div className="px-5 pt-6 pb-16 max-w-sm mx-auto">
        <h1 className="text-h1 font-bold">Comece a investir</h1>
        <p className="text-body text-muted-foreground mt-2">
          Preencha seus dados para criar sua conta
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Input
            id="fullName"
            label="Nome Completo"
            placeholder="Ex: João da Silva"
            value={formData.fullName}
            onChange={handleChange}
            name="fullName"
            error={errors.fullName}
            required
            autoComplete="name"
          />
          <Input
            id="phone"
            type="phone"
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={formData.phone}
            onChange={handleChange}
            name="phone"
            error={errors.phone}
            required
          />
          <Input
            id="username"
            label="Nome de Usuário"
            placeholder="Escolha um usuário"
            value={formData.username}
            onChange={handleChange}
            name="username"
            error={errors.username}
            required
            autoComplete="username"
          />
          <Input
            id="password"
            type="password"
            label="Senha"
            placeholder="Digite sua senha"
            value={formData.password}
            onChange={handleChange}
            name="password"
            error={errors.password}
            required
            autoComplete="new-password"
          />
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Criar Conta
          </Button>
        </form>
      </div>
    </div>
  );
};