import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { BankTile } from '../components/shared/BankTile';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { withdrawalApi } from '../api/withdrawal';
import { useWallet } from '../context/WalletContext';
import { toast } from 'sonner';

const banks = [
  { code: 'nubank', name: 'Nubank', color: '#8A05BE', letter: 'N' },
  { code: 'bb', name: 'Banco do Brasil', color: '#F9D016', letter: 'B' },
  { code: 'bradesco', name: 'Bradesco', color: '#CC092F', letter: 'B' },
  { code: 'itau', name: 'Itaú', color: '#EC7000', letter: 'I' },
  { code: 'caixa', name: 'Caixa', color: '#1A6DD3', letter: 'C' },
  { code: 'santander', name: 'Santander', color: '#EC0000', letter: 'S' },
  { code: 'inter', name: 'Inter', color: '#FF7A00', letter: 'I' },
  { code: 'c6', name: 'C6 Bank', color: '#111111', letter: 'C' },
  { code: 'pan', name: 'Banco PAN', color: '#0B4C6B', letter: 'B' },
  { code: 'btg', name: 'BTG Pactual', color: '#0A1A3C', letter: 'B' },
  { code: 'mp', name: 'Mercado Pago', color: '#33B5E5', letter: 'M' },
  { code: 'picpay', name: 'PicPay', color: '#21C25E', letter: 'P' },
  { code: 'neon', name: 'Neon', color: '#2E6BFF', letter: 'N' },
  { code: 'pagbank', name: 'PagBank', color: '#F5A623', letter: 'P' },
  { code: 'sicoob', name: 'Sicoob', color: '#003D2B', letter: 'S' },
  { code: 'sicredi', name: 'Sicredi', color: '#00995D', letter: 'S' },
];

export const PixPage = () => {
  const navigate = useNavigate();
  const { refreshWallet } = useWallet();
  const [selectedBank, setSelectedBank] = useState(null);
  const [pixKey, setPixKey] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleBankSelect = (code) => {
    setSelectedBank(code);
    setErrors((prev) => ({ ...prev, bank: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!selectedBank) newErrors.bank = 'Selecione um banco';
    if (!pixKey.trim()) newErrors.pixKey = 'Chave PIX é obrigatória';
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Valor inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const bank = banks.find(b => b.code === selectedBank);
      await withdrawalApi.createWithdrawal({
        method: 'pix',
        bankCode: bank?.code,
        pixKey: pixKey.trim(),
        amount: parseFloat(amount.replace(/[^0-9,]/g, '').replace(',', '.')),
      });
      toast.success('Saque solicitado com sucesso!');
      await refreshWallet();
      navigate('/withdraw/pin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao solicitar saque');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title="Saque PIX" />
      
      <form onSubmit={handleSubmit}>
        <div className="px-5 pt-4">
          <label className="text-label text-foreground block mb-3">
            Selecione o Banco
            {errors.bank && <span className="text-destructive text-small block mt-1">{errors.bank}</span>}
          </label>
          
          <div className="grid grid-cols-3 gap-3">
            {banks.map((bank) => (
              <BankTile
                key={bank.code}
                code={bank.code}
                name={bank.name}
                color={bank.color}
                letter={bank.letter}
                selected={selectedBank === bank.code}
                onSelect={handleBankSelect}
              />
            ))}
          </div>
        </div>

        <div className="px-5 mt-6 space-y-4">
          <Input
            id="pixKey"
            label="Chave PIX"
            placeholder="CPF, E-mail, Telefone ou Aleatória"
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            error={errors.pixKey}
            required
          />
          
          <Input
            id="amount"
            type="currency"
            label="Valor (R$)"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Transferir
          </Button>
        </div>
      </form>
    </div>
  );
};